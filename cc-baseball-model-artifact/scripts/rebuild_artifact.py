#!/usr/bin/env python3
"""Rebuild the pasted React artifact with the generated MLB pitcher tables."""

from __future__ import annotations

import json
import math
import os
import re
import unicodedata
import urllib.parse
import urllib.request
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path
from zoneinfo import ZoneInfo


ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data"
SRC_DIR = ROOT / "src"
PUBLIC_DIR = ROOT / "public"
BASELINE_DATA = SRC_DIR / "diamond_data.json"
ODDS_API_ORIGIN = "https://api.the-odds-api.com/v4"

HIDDEN_DAMAGE_PANEL = r'''function DamagePanel({ report, awayTeam, homeTeam, awayArm, homeArm }) {
  return null;
}'''

HIDDEN_DISCIPLINE_PANEL = r'''function DisciplinePanel({ report, awayTeam, homeTeam, awayArm, homeArm }) {
  return null;
}'''

HIDDEN_K_MECHANISM_PANEL = r'''function KMechanismPanel({ arm, mech, oppTeam, oppAbbr, rawK, adjK, kConv, finalK, projK, bf }) {
  return null;
}'''

SUPPRESSED_CUSTOMER_GAMES = {
    # Starter feed conflict. Do not publish a customer edge until the WSH opener
    # / bulk assignment is confirmed cleanly.
    ("2026-07-11", "NYY", "WSH"): "starter_confirmation_conflict",
}


def normalize_name(value: str | None) -> str:
    if not value:
        return ""
    text = unicodedata.normalize("NFD", value)
    text = "".join(ch for ch in text if unicodedata.category(ch) != "Mn")
    return re.sub(r"[^a-z0-9]+", " ", text.lower()).strip()


def read_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def finite(value):
    if value is None:
        return None
    try:
        number = float(value)
    except (TypeError, ValueError):
        return None
    return number if math.isfinite(number) else None


def rounded(value, digits=4):
    number = finite(value)
    if number is None:
        return None
    return round(number, digits)


def pct(value, digits=1):
    number = finite(value)
    if number is None:
        return None
    return round(number * 100, digits)


def mean(values):
    vals = [finite(v) for v in values]
    vals = [v for v in vals if v is not None]
    return sum(vals) / len(vals) if vals else None


def request_json_url(url: str, timeout: int = 20) -> dict:
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=timeout) as response:
        return json.load(response)


def request_odds_json(path: str, api_key: str, params: dict | None = None, timeout: int = 20):
    query = dict(params or {})
    query["apiKey"] = api_key
    url = f"{ODDS_API_ORIGIN}/{path}?{urllib.parse.urlencode(query)}"
    return request_json_url(url, timeout=timeout)


def valid_book_price(value) -> bool:
    number = finite(value)
    return number is not None and number != 0


def quote_is_better(candidate: dict | None, current: dict | None) -> bool:
    if not candidate or not valid_book_price(candidate.get("price")):
        return False
    current_price = finite(current.get("price")) if current else None
    return current_price is None or finite(candidate.get("price")) > current_price


def game_key(game: dict) -> str:
    return str(game.get("id") or f"{game.get('away') or 'away'}-{game.get('home') or 'home'}")


def prop_side_key(side: str | None) -> str:
    value = normalize_name(side)
    if "yes" in value or "over" in value:
        return "over"
    if "no" in value or "under" in value:
        return "under"
    return value or "over"


def quote_key(player: str | None, side: str | None, line) -> str:
    line_value = finite(line)
    return f"{normalize_name(player)}|{normalize_name(side)}|{line_value:g}" if line_value is not None else f"{normalize_name(player)}|{normalize_name(side)}|nan"


def prop_market_label(key: str | None) -> str:
    if key == "batter_home_runs":
        return "Batter HR"
    if key == "batter_hits":
        return "Batter hits"
    if key == "batter_total_bases":
        return "Batter TB"
    if key == "batter_strikeouts":
        return "Batter strikeouts"
    return key or "Prop"


def prop_quote_key(market: str | None, player: str | None, side: str | None, line) -> str:
    point = finite(line)
    point_text = f"{point:g}" if point is not None else "none"
    return f"{normalize_name(market)}|{normalize_name(player)}|{prop_side_key(side)}|{point_text}"


def team_side_from_text(text: str | None, game: dict) -> str | None:
    value = normalize_name(text)
    if not value:
        return None
    away_full = normalize_name(game.get("away_name"))
    home_full = normalize_name(game.get("home_name"))
    away_abbr = normalize_name(game.get("away"))
    home_abbr = normalize_name(game.get("home"))
    if value == away_abbr or (away_full and (value in away_full or away_full in value)):
        return "away"
    if value == home_abbr or (home_full and (value in home_full or home_full in value)):
        return "home"
    return None


def set_best_team_price(store: dict, side: str | None, candidate: dict) -> None:
    if side and quote_is_better(candidate, store.get(side)):
        store[side] = candidate


def find_odds_event(events, game: dict) -> dict | None:
    if not isinstance(events, list):
        return None
    away = normalize_name(game.get("away_name"))
    home = normalize_name(game.get("home_name"))
    for event in events:
        if normalize_name(event.get("away_team")) == away and normalize_name(event.get("home_team")) == home:
            return event
    return None


def is_pregame_customer_game(game: dict) -> bool:
    status = normalize_name(game.get("status"))
    if not status:
        return True
    if "final" in status or "completed" in status or "game over" in status:
        return False
    if "in progress" in status or "live" in status:
        return False
    return True


def empty_odds_entry() -> dict:
    return {"k": {}, "pitcherK": {}, "batter": {}, "teamTotals": [], "h2h": {}, "totals": [], "f5H2h": {}, "f5Totals": []}


def has_odds_entry(entry: dict) -> bool:
    return bool(
        (entry.get("h2h") or {})
        or (entry.get("f5H2h") or {})
        or (entry.get("totals") or [])
        or (entry.get("f5Totals") or [])
        or (entry.get("teamTotals") or [])
        or (entry.get("k") or {})
        or (entry.get("batter") or {})
    )


def normalize_odds_entry(entry: dict | None) -> dict:
    entry = entry if isinstance(entry, dict) else {}
    return {
        "k": dict(entry.get("k") or {}),
        "pitcherK": dict(entry.get("pitcherK") or entry.get("k") or {}),
        "batter": dict(entry.get("batter") or {}),
        "teamTotals": entry.get("teamTotals") if isinstance(entry.get("teamTotals"), list) else [],
        "h2h": dict(entry.get("h2h") or {}),
        "totals": entry.get("totals") if isinstance(entry.get("totals"), list) else [],
        "f5H2h": dict(entry.get("f5H2h") or {}),
        "f5Totals": entry.get("f5Totals") if isinstance(entry.get("f5Totals"), list) else [],
    }


def normalize_odds_history(history) -> dict:
    if not isinstance(history, dict):
        return {}
    normalized = {}
    for date, snapshot in history.items():
        if not date or not isinstance(snapshot, dict):
            continue
        raw_games = snapshot.get("games") if isinstance(snapshot.get("games"), dict) else snapshot
        games = {}
        for key, entry in (raw_games or {}).items():
            cleaned = normalize_odds_entry(entry)
            if has_odds_entry(cleaned):
                games[str(key)] = cleaned
        if games:
            normalized[str(date)] = {
                "fetched_at": snapshot.get("fetched_at") or snapshot.get("last_updated"),
                "source": snapshot.get("source") or "sportsbook odds snapshot",
                "games": games,
            }
    return normalized


def merge_odds_history(history: dict, date: str | None, snapshot: dict | None) -> dict:
    merged = normalize_odds_history(history)
    if date and snapshot:
        normalized = normalize_odds_history({date: snapshot}).get(str(date))
        if normalized:
            current = merged.get(str(date), {})
            merged[str(date)] = {
                **current,
                **normalized,
                "games": {**(current.get("games") or {}), **(normalized.get("games") or {})},
            }
    return merged


def parse_standard_odds(event_odds: dict | None, game: dict, entry: dict) -> None:
    if not event_odds:
        return
    for bookmaker in event_odds.get("bookmakers") or []:
        book = bookmaker.get("title") or "Sportsbook"
        for market in bookmaker.get("markets") or []:
            key = market.get("key")
            if key in {"h2h", "h2h_1st_5_innings"}:
                store = entry["h2h"] if key == "h2h" else entry["f5H2h"]
                for outcome in market.get("outcomes") or []:
                    set_best_team_price(store, team_side_from_text(outcome.get("name"), game), {"price": outcome.get("price"), "book": book})
            if key in {"totals", "totals_1st_5_innings"}:
                rows = entry["totals"] if key == "totals" else entry["f5Totals"]
                for outcome in market.get("outcomes") or []:
                    rows.append({"side": outcome.get("name"), "line": outcome.get("point"), "price": outcome.get("price"), "book": book})
            if key == "pitcher_strikeouts":
                for outcome in market.get("outcomes") or []:
                    candidate = {"price": outcome.get("price"), "book": book}
                    direct_key = quote_key(outcome.get("description"), outcome.get("name"), outcome.get("point"))
                    if quote_is_better(candidate, entry["k"].get(direct_key)):
                        entry["k"][direct_key] = candidate
                    player_key = normalize_name(outcome.get("description"))
                    line = finite(outcome.get("point"))
                    if not player_key or line is None:
                        continue
                    entry["k"].setdefault(player_key, [])
                    row = next((item for item in entry["k"][player_key] if finite(item.get("line")) == line), None)
                    if row is None:
                        row = {"line": line, "over": None, "under": None}
                        entry["k"][player_key].append(row)
                    side = prop_side_key(outcome.get("name"))
                    if side == "over" and quote_is_better(candidate, row.get("over")):
                        row["over"] = candidate
                    if side == "under" and quote_is_better(candidate, row.get("under")):
                        row["under"] = candidate
            if key == "team_totals":
                for outcome in market.get("outcomes") or []:
                    entry["teamTotals"].append(
                        {
                            "away": game.get("away"),
                            "home": game.get("home"),
                            "team": outcome.get("description"),
                            "side": outcome.get("name"),
                            "line": outcome.get("point"),
                            "price": outcome.get("price"),
                            "book": book,
                        }
                    )
    entry["pitcherK"] = entry["k"]


def parse_batter_odds(prop_odds: dict | None, entry: dict) -> None:
    if not prop_odds:
        return
    for bookmaker in prop_odds.get("bookmakers") or []:
        book = bookmaker.get("title") or "Sportsbook"
        for market in bookmaker.get("markets") or []:
            label = prop_market_label(market.get("key"))
            if label not in {"Batter HR", "Batter hits", "Batter TB", "Batter strikeouts"}:
                continue
            for outcome in market.get("outcomes") or []:
                line = outcome.get("point")
                if market.get("key") == "batter_home_runs" and line is None:
                    line = 0.5
                key = prop_quote_key(label, outcome.get("description"), outcome.get("name"), line)
                candidate = {"price": outcome.get("price"), "book": book}
                if quote_is_better(candidate, entry["batter"].get(key)):
                    entry["batter"][key] = candidate


def fetch_event_odds(api_key: str, event_id: str, markets: str, game: dict):
    params = {"regions": "us", "oddsFormat": "american", "markets": markets}
    try:
        return request_odds_json(f"sports/baseball_mlb/events/{event_id}/odds", api_key, params=params, timeout=20)
    except Exception:
        fallback = request_odds_json("sports/baseball_mlb/odds", api_key, params=params, timeout=20)
        if not isinstance(fallback, list):
            return None
        return find_odds_event(fallback, game)


def fetch_customer_odds_snapshot(customer_board: dict) -> dict | None:
    api_key = os.getenv("ODDS_API_KEY") or os.getenv("VITE_ODDS_API_KEY") or os.getenv("THE_ODDS_API_KEY")
    if not api_key:
        return None
    date = customer_board.get("date")
    pregame_games = [game for game in customer_board.get("games") or [] if is_pregame_customer_game(game)]
    if not date or not pregame_games:
        return None
    try:
        events = request_odds_json("sports/baseball_mlb/events", api_key, timeout=20)
    except Exception:
        return None
    odds_by_game = {}
    warnings = []
    for game in pregame_games:
        event = find_odds_event(events, game)
        if not event or not event.get("id"):
            warnings.append(f"{game.get('away')}@{game.get('home')}: no matching event")
            continue
        entry = empty_odds_entry()
        try:
            parse_standard_odds(fetch_event_odds(api_key, event["id"], "h2h,totals", game), game, entry)
        except Exception:
            warnings.append(f"{game.get('away')}@{game.get('home')}: moneyline/total unavailable")
        try:
            parse_standard_odds(fetch_event_odds(api_key, event["id"], "team_totals", game), game, entry)
        except Exception:
            warnings.append(f"{game.get('away')}@{game.get('home')}: team totals unavailable")
        try:
            parse_standard_odds(fetch_event_odds(api_key, event["id"], "h2h_1st_5_innings,totals_1st_5_innings", game), game, entry)
        except Exception:
            warnings.append(f"{game.get('away')}@{game.get('home')}: F5 unavailable")
        try:
            parse_standard_odds(fetch_event_odds(api_key, event["id"], "pitcher_strikeouts", game), game, entry)
        except Exception:
            warnings.append(f"{game.get('away')}@{game.get('home')}: pitcher Ks unavailable")
        try:
            parse_batter_odds(fetch_event_odds(api_key, event["id"], "batter_home_runs,batter_hits,batter_total_bases,batter_strikeouts", game), entry)
        except Exception:
            warnings.append(f"{game.get('away')}@{game.get('home')}: batter props unavailable")
        if has_odds_entry(entry):
            odds_by_game[game_key(game)] = normalize_odds_entry(entry)
    if not odds_by_game:
        return None
    snapshot = {
        "fetched_at": datetime.now(timezone.utc).replace(microsecond=0).isoformat(),
        "source": "The Odds API pregame snapshot",
        "games": odds_by_game,
    }
    if warnings:
        snapshot["warnings"] = warnings[:20]
    return snapshot


def display_number(value, digits=1):
    number = finite(value)
    if number is None:
        return "—"
    if digits == 0 or float(number).is_integer():
        return str(int(number))
    return f"{number:.{digits}f}"


def is_final_stats_game(stats_game: dict) -> bool:
    status = stats_game.get("status") or {}
    state = normalize_name(f"{status.get('abstractGameState') or ''} {status.get('detailedState') or ''} {status.get('statusCode') or ''}")
    return "final" in state or "completed" in state or " f " in f" {state} "


def find_stats_game_for_customer_projection(stats_games: list[dict], projection: dict) -> dict | None:
    projection_id = finite(projection.get("id"))
    if projection_id is not None:
        for stats_game in stats_games:
            if stats_game.get("gamePk") == int(projection_id):
                return stats_game
    away = normalize_name(projection.get("away_name") or projection.get("away"))
    home = normalize_name(projection.get("home_name") or projection.get("home"))
    for stats_game in stats_games:
        teams = stats_game.get("teams") or {}
        away_team = ((teams.get("away") or {}).get("team") or {})
        home_team = ((teams.get("home") or {}).get("team") or {})
        stats_away = normalize_name(away_team.get("name") or away_team.get("abbreviation"))
        stats_home = normalize_name(home_team.get("name") or home_team.get("abbreviation"))
        if away and home and (stats_away == away or stats_away in away or away in stats_away) and (stats_home == home or stats_home in home or home in stats_home):
            return stats_game
    return None


def grade_customer_board_results(board: dict) -> list[dict]:
    slate_date = board.get("date")
    games = board.get("games") or []
    if not slate_date or not games:
        return []
    try:
        payload = request_json_url(f"https://statsapi.mlb.com/api/v1/schedule?sportId=1&date={urllib.parse.quote(str(slate_date))}", timeout=20)
    except Exception:
        return []
    stats_games = [game for day in payload.get("dates", []) for game in day.get("games", [])]
    rows = []
    for projection in games:
        stats_game = find_stats_game_for_customer_projection(stats_games, projection)
        if not stats_game or not is_final_stats_game(stats_game):
            continue
        actual_away = finite(((stats_game.get("teams") or {}).get("away") or {}).get("score"))
        actual_home = finite(((stats_game.get("teams") or {}).get("home") or {}).get("score"))
        projected_away = finite(projection.get("away_score"))
        projected_home = finite(projection.get("home_score"))
        if any(value is None for value in (actual_away, actual_home, projected_away, projected_home)):
            continue
        projected_total = finite(projection.get("total"))
        if projected_total is None:
            projected_total = projected_away + projected_home
        actual_total = actual_away + actual_home
        projected_margin = projected_home - projected_away
        actual_margin = actual_home - actual_away
        actual_side = "home" if actual_margin > 0 else "away" if actual_margin < 0 else "tie"
        rows.append(
            {
                "id": projection.get("id") or stats_game.get("gamePk"),
                "matchup": f"{projection.get('away')} @ {projection.get('home')}",
                "projected": f"{projection.get('away')} {display_number(projected_away)} · {display_number(projected_home)} {projection.get('home')}",
                "final": f"{projection.get('away')} {display_number(actual_away, 0)} · {display_number(actual_home, 0)} {projection.get('home')}",
                "betCount": 0,
                "betWins": 0,
                "betLosses": 0,
                "betPushes": 0,
                "bets": [],
                "actualWinner": projection.get("away") if actual_side == "away" else projection.get("home") if actual_side == "home" else "Tie",
                "scoreMae": rounded((abs(actual_away - projected_away) + abs(actual_home - projected_home)) / 2, 4),
                "totalError": rounded(abs(actual_total - projected_total), 4),
                "marginError": rounded(abs(actual_margin - projected_margin), 4),
                "totalDelta": rounded(actual_total - projected_total, 4),
                "resultDate": slate_date,
            }
        )
    return rows


def normalize_results_history(history) -> dict:
    if not isinstance(history, dict):
        return {}
    normalized = {}
    for date, rows in history.items():
        if not date or not isinstance(rows, list) or not rows:
            continue
        by_id = {}
        for row in rows:
            if isinstance(row, dict):
                row = dict(row)
                if not (
                    finite(row.get("savedBetCount"))
                    or finite(row.get("betCount"))
                    or finite(row.get("pendingBetCount"))
                    or row.get("bets")
                ):
                    continue
                row.setdefault("resultDate", date)
                by_id[str(row.get("id") or row.get("matchup") or len(by_id))] = row
        if by_id:
            normalized[str(date)] = list(by_id.values())
    return normalized


def merge_results_history(history: dict, date: str | None, rows: list[dict]) -> dict:
    merged = normalize_results_history(history)
    if date and rows:
        existing = {str(row.get("id") or row.get("matchup") or index): row for index, row in enumerate(merged.get(str(date), []))}
        for index, row in enumerate(rows):
            existing[str(row.get("id") or row.get("matchup") or index)] = row
        merged[str(date)] = list(existing.values())
    return merged


def parse_lineup(box_team: dict, game_players: dict) -> dict:
    batters = []
    for player in (box_team.get("players") or {}).values():
        batting_order = player.get("battingOrder")
        if not batting_order:
            continue
        person = player.get("person") or {}
        player_id = person.get("id")
        game_data_player = game_players.get(f"ID{player_id}", {}) if player_id is not None else {}
        bat_side = (game_data_player.get("batSide") or {}).get("code")
        batters.append(
            {
                "order": int(str(batting_order)[:1]) if str(batting_order)[:1].isdigit() else None,
                "player_id": player_id,
                "player_name": person.get("fullName"),
                "position": (player.get("position") or {}).get("abbreviation"),
                "bat_side": bat_side,
            }
        )
    batters.sort(key=lambda item: item.get("order") or 99)
    counts = {
        "L": sum(1 for item in batters if item.get("bat_side") == "L"),
        "R": sum(1 for item in batters if item.get("bat_side") == "R"),
        "S": sum(1 for item in batters if item.get("bat_side") == "S"),
    }
    return {
        "status": "confirmed" if len(batters) >= 9 else "pending",
        "batters": batters,
        "left_bats": counts["L"],
        "right_bats": counts["R"],
        "switch_bats": counts["S"],
    }


def fetch_game_context(game_pk, base_weather):
    context = {
        "lineups": {
            "away": {"status": "pending", "batters": [], "left_bats": None, "right_bats": None, "switch_bats": None},
            "home": {"status": "pending", "batters": [], "left_bats": None, "right_bats": None, "switch_bats": None},
        },
        "weather": {
            "condition": None,
            "temp": None,
            "wind": None,
            "source": None,
        },
        "umpire": {
            "home_plate": None,
            "source": None,
        },
        "warnings": [],
    }
    if base_weather:
        context["weather"] = {
            "condition": base_weather.get("condition"),
            "temp": base_weather.get("temp"),
            "wind": base_weather.get("wind"),
            "source": "MLB StatsAPI schedule",
        }
    if not game_pk:
        context["warnings"].append("missing_game_pk")
        return context
    try:
        live = request_json_url(f"https://statsapi.mlb.com/api/v1.1/game/{game_pk}/feed/live", timeout=20)
    except Exception:
        context["warnings"].append("live_feed_unavailable")
        return context
    game_data = live.get("gameData") or {}
    boxscore = (live.get("liveData") or {}).get("boxscore") or {}
    game_players = game_data.get("players") or {}
    teams = boxscore.get("teams") or {}
    for side in ("away", "home"):
        context["lineups"][side] = parse_lineup(teams.get(side) or {}, game_players)
    weather = game_data.get("weather") or base_weather or {}
    if weather:
        context["weather"] = {
            "condition": weather.get("condition"),
            "temp": weather.get("temp"),
            "wind": weather.get("wind"),
            "source": "MLB StatsAPI live feed",
        }
    for official in boxscore.get("officials") or []:
        if official.get("officialType") == "Home Plate":
            context["umpire"] = {
                "home_plate": (official.get("official") or {}).get("fullName"),
                "source": "MLB StatsAPI boxscore",
            }
            break
    if context["lineups"]["away"]["status"] != "confirmed" or context["lineups"]["home"]["status"] != "confirmed":
        context["warnings"].append("confirmed_lineups_unavailable")
    if not context["weather"]["source"]:
        context["warnings"].append("weather_unavailable")
    if not context["umpire"]["home_plate"]:
        context["warnings"].append("home_plate_umpire_unavailable")
    return context


def fetch_schedule(season_date: str, teams_by_id: dict[int, str], bullpen_by_team=None) -> list[dict]:
    params = urllib.parse.urlencode(
        {"sportId": 1, "date": season_date, "hydrate": "probablePitcher,venue,weather,linescore,team,lineups"}
    )
    url = f"https://statsapi.mlb.com/api/v1/schedule?{params}"
    try:
        payload = request_json_url(url, timeout=20)
    except Exception as exc:
        raise RuntimeError("MLB schedule refresh failed; refusing to publish a stale slate") from exc

    games = []
    bullpen_by_team = bullpen_by_team or {}
    for day in payload.get("dates", []):
        if day.get("date") != season_date:
            continue
        for game in day.get("games", []):
            teams = game.get("teams", {})
            away = teams.get("away", {})
            home = teams.get("home", {})
            away_team = away.get("team", {})
            home_team = home.get("team", {})
            away_abbr = teams_by_id.get(away_team.get("id"))
            home_abbr = teams_by_id.get(home_team.get("id"))
            if not away_abbr or not home_abbr:
                continue
            game_date = game.get("gameDate")
            display_time = game.get("status", {}).get("detailedState")
            if game_date:
                try:
                    dt = datetime.fromisoformat(game_date.replace("Z", "+00:00")).astimezone(ZoneInfo("America/New_York"))
                    display_time = dt.strftime("%-I:%M %p ET")
                except ValueError:
                    pass
            game_pk = game.get("gamePk")
            context = fetch_game_context(game_pk, game.get("weather") or {})
            away_bullpen = bullpen_by_team.get(away_abbr)
            home_bullpen = bullpen_by_team.get(home_abbr)
            context["bullpen"] = {
                "away": away_bullpen,
                "home": home_bullpen,
            }
            context["odds"] = {
                "pregame": "requires_odds_api_key",
                "props": "requires_odds_api_key",
            }
            games.append(
                {
                    "gamePk": game_pk,
                    "away": away_abbr,
                    "home": home_abbr,
                    "awayName": away_team.get("name"),
                    "homeName": home_team.get("name"),
                    "venue": (game.get("venue") or {}).get("name"),
                    "dayNight": game.get("dayNight"),
                    "awayStarter": away.get("probablePitcher", {}).get("fullName"),
                    "awayStarterId": away.get("probablePitcher", {}).get("id"),
                    "homeStarter": home.get("probablePitcher", {}).get("fullName"),
                    "homeStarterId": home.get("probablePitcher", {}).get("id"),
                    "awayBullpenStatus": (away_bullpen or {}).get("bullpen_status"),
                    "homeBullpenStatus": (home_bullpen or {}).get("bullpen_status"),
                    "status": game.get("status", {}).get("detailedState"),
                    "time": display_time,
                    "date": day.get("date", season_date),
                    "context": context,
                }
            )
    return games


def extract_default_data(source: str) -> dict:
    match = re.search(r"const DEFAULT_DATA = (\{.*?\});\n\nconst BULLPEN_MULT", source, re.S)
    if not match:
        raise RuntimeError("Could not find DEFAULT_DATA in pasted artifact")
    return json.loads(match.group(1))


def load_team_ids() -> dict[int, str]:
    # Official MLB team ids are stable and only used to map the schedule response.
    return {
        108: "LAA",
        109: "AZ",
        110: "BAL",
        111: "BOS",
        112: "CHC",
        113: "CIN",
        114: "CLE",
        115: "COL",
        116: "DET",
        117: "HOU",
        118: "KC",
        119: "LAD",
        120: "WSH",
        121: "NYM",
        133: "ATH",
        134: "PIT",
        135: "SD",
        136: "SEA",
        137: "SF",
        138: "STL",
        139: "TB",
        140: "TEX",
        141: "TOR",
        142: "MIN",
        143: "PHI",
        144: "ATL",
        145: "CWS",
        146: "MIA",
        147: "NYY",
        158: "MIL",
    }


def build_pitcher_objects(original: dict, starter_rows: list[dict], pitch_type_rows: list[dict], chase_rows: list[dict], pitch_by_pitch_k_rows: list[dict]) -> list[dict]:
    original_by_name = {normalize_name(p.get("name")): p for p in original.get("pitchers", [])}
    pitch_rows_by_id = defaultdict(list)
    pitch_ref = dict(original.get("pitchRef", {}))
    for row in pitch_type_rows:
        player_id = row.get("player_id")
        pitch_rows_by_id[player_id].append(row)
        if row.get("pitch_type") and row.get("pitch_name"):
            pitch_ref.setdefault(row["pitch_type"], row["pitch_name"])

    chase_by_id = {row["player_id"]: row for row in chase_rows}
    pitch_k_by_id = {row["player_id"]: row for row in pitch_by_pitch_k_rows}
    pitchers = []
    for starter in starter_rows:
        player_id = starter["player_id"]
        name = starter.get("player_name")
        base = original_by_name.get(normalize_name(name), {})
        chase = chase_by_id.get(player_id, {})
        pitch_k = pitch_k_by_id.get(player_id, {})
        source_bits = ["savant-starter-damage", "savant-pitch-type-damage", "savant-chase-generation"]
        if pitch_k:
            source_bits.append("savant-pitch-by-pitch-k")
        if starter.get("core_stats_source"):
            source_bits.append("statsapi-core")
        if base:
            source_bits.append("preserved-original-xera")

        mix = []
        for row in sorted(pitch_rows_by_id.get(player_id, []), key=lambda r: finite(r.get("usage_pct")) or 0, reverse=True):
            pitch_type = row.get("pitch_type")
            if not pitch_type:
                continue
            mix.append(
                {
                    "t": pitch_type,
                    "u": rounded(row.get("usage_pct"), 1),
                    "pitches": row.get("pitches_thrown"),
                    "pa": row.get("batters_faced_or_pa"),
                    "ba": rounded(row.get("ba_allowed"), 3),
                    "slg": rounded(row.get("slg_allowed"), 3),
                    "iso": rounded(row.get("iso_allowed"), 3),
                    "woba": rounded(row.get("woba_allowed"), 3),
                    "xslg": rounded(row.get("xslg_allowed"), 3),
                    "xwoba": rounded(row.get("xwoba_allowed"), 3),
                    "brl": rounded(row.get("barrel_allowed_rate"), 3),
                    "hh": rounded(row.get("hard_hit_allowed_rate"), 3),
                    "ev": rounded(row.get("avg_exit_velocity_allowed"), 1),
                    "la": rounded(row.get("launch_angle_allowed"), 1),
                    "hr": row.get("hr_allowed"),
                    "wh": rounded(row.get("whiff_rate"), 3),
                    "ch": rounded(row.get("chase_rate_generated"), 3),
                    "ozWhiff": rounded(row.get("out_of_zone_whiff_rate"), 3),
                    "zoneWhiff": rounded(row.get("zone_whiff_rate"), 3),
                    "smallSample": bool(row.get("small_sample")),
                }
            )

        pitcher = {
            "player_id": player_id,
            "name": name,
            "team": starter.get("team"),
            "season": starter.get("season"),
            "xera": base.get("xera"),
            "era": rounded(starter.get("era"), 3),
            "runPreventionEra": rounded(base.get("xera") if base.get("xera") is not None else starter.get("era"), 3),
            "runPreventionSource": "xera-original-snapshot" if base.get("xera") is not None else ("statsapi-era" if starter.get("era") is not None else None),
            "k": pct(starter.get("strikeout_rate"), 1) if starter.get("strikeout_rate") is not None else base.get("k"),
            "bb": pct(starter.get("walk_rate"), 1) if starter.get("walk_rate") is not None else base.get("bb"),
            "ip": rounded(starter.get("avg_start_innings"), 2) if starter.get("avg_start_innings") is not None else base.get("ip"),
            "matchup": base.get("matchup", 1),
            "hand": starter.get("pitch_hand") or base.get("hand"),
            "starts": starter.get("games_started") if starter.get("games_started") is not None else base.get("starts"),
            "source": "+".join(source_bits),
            "inningsPitched": rounded(starter.get("innings_pitched"), 3),
            "battersFaced": starter.get("batters_faced"),
            "strikeouts": starter.get("strikeouts"),
            "walks": starter.get("walks"),
            "strikeoutRate": rounded(starter.get("strikeout_rate"), 4),
            "walkRate": rounded(starter.get("walk_rate"), 4),
            "gamesStarted": starter.get("games_started"),
            "gamesPitched": starter.get("games_pitched"),
            "gameLogStarts": starter.get("game_log_starts"),
            "avgStartPitches": rounded(starter.get("avg_start_pitches"), 1),
            "avgStartBattersFaced": rounded(starter.get("avg_start_batters_faced"), 1),
            "coreStatsSource": starter.get("core_stats_source"),
            "barrelAllowed": rounded(starter.get("barrel_allowed_rate"), 4),
            "hardHitAllowed": rounded(starter.get("hard_hit_allowed_rate"), 4),
            "avgExitVelocityAllowed": rounded(starter.get("avg_exit_velocity_allowed"), 2),
            "launchAngleAllowed": rounded(starter.get("launch_angle_allowed"), 2),
            "hrFbAllowed": rounded(starter.get("hr_fb_allowed"), 4),
            "slgAllowed": rounded(starter.get("slg_allowed"), 4),
            "xslgAllowed": rounded(starter.get("xslg_allowed"), 4),
            "xbaAllowed": rounded(starter.get("xba_allowed"), 4),
            "xwobaAllowed": rounded(starter.get("xwoba_allowed"), 4),
            "sampleBattedBalls": starter.get("sample_batted_balls"),
            "pitchesThrown": chase.get("pitches_thrown"),
            "outOfZonePitches": chase.get("out_of_zone_pitches"),
            "outOfZoneSwings": chase.get("out_of_zone_swings"),
            "outOfZoneWhiffs": chase.get("out_of_zone_whiffs"),
            "zonePitches": chase.get("zone_pitches"),
            "zoneSwings": chase.get("zone_swings"),
            "zoneWhiffs": chase.get("zone_whiffs"),
            "chaseGenerated": rounded(chase.get("chase_rate_generated"), 4),
            "outOfZoneWhiffRate": rounded(chase.get("out_of_zone_whiff_rate"), 4),
            "zoneWhiffRate": rounded(chase.get("zone_whiff_rate"), 4),
            "calledStrikeRate": rounded(chase.get("called_strike_rate"), 4),
            "firstPitchStrikeRate": rounded(chase.get("first_pitch_strike_rate"), 4),
            "swingingStrikeRate": rounded(chase.get("swinging_strike_rate"), 4),
            "chaseKShare": chase.get("chase_k_share_if_available"),
            "sliderSplitterChangeUsage": rounded(chase.get("slider_splitter_change_usage"), 4),
            "chaseRelianceScore": chase.get("chase_reliance_score"),
            "pitchKSamplePitches": pitch_k.get("sample_pitches"),
            "pitchKPlateAppearances": pitch_k.get("plate_appearances"),
            "pitchKStrikeouts": pitch_k.get("strikeouts"),
            "pitchKRatePerPa": rounded(pitch_k.get("strikeout_rate_per_pa"), 4),
            "pitchKSwingingStrikeouts": pitch_k.get("swinging_strikeouts"),
            "pitchKCalledStrikeouts": pitch_k.get("called_strikeouts"),
            "pitchKTwoStrikePitches": pitch_k.get("two_strike_pitches"),
            "pitchKTwoStrikeSwings": pitch_k.get("two_strike_swings"),
            "pitchKTwoStrikeWhiffs": pitch_k.get("two_strike_whiffs"),
            "pitchKTwoStrikeCalledStrikes": pitch_k.get("two_strike_called_strikes"),
            "pitchKTwoStrikeFouls": pitch_k.get("two_strike_fouls"),
            "pitchKPutawayPitches": pitch_k.get("putaway_pitches"),
            "pitchKPutawayRate": rounded(pitch_k.get("putaway_rate"), 4),
            "pitchKWhiffRatePerSwing": rounded(pitch_k.get("whiff_rate_per_swing"), 4),
            "pitchKCalledStrikeRate": rounded(pitch_k.get("called_strike_rate"), 4),
            "pitchKCswRate": rounded(pitch_k.get("csw_rate"), 4),
            "pitchKTwoStrikeWhiffRate": rounded(pitch_k.get("two_strike_whiff_rate"), 4),
            "pitchKTwoStrikeCswRate": rounded(pitch_k.get("two_strike_csw_rate"), 4),
            "pitchKTopPitchType": pitch_k.get("top_strikeout_pitch_type"),
            "pitchKTopPitchName": pitch_k.get("top_strikeout_pitch_name"),
            "pitchKTopPitchCount": pitch_k.get("top_strikeout_pitch_count"),
            "pitchKTopPitchShare": rounded(pitch_k.get("top_strikeout_pitch_share"), 4),
            "mix": mix,
        }
        # Preserve original arsenal velocities where the same pitcher/pitch exists.
        old_mix = {item.get("t"): item for item in base.get("mix", [])}
        for item in pitcher["mix"]:
            old = old_mix.get(item["t"])
            if old and old.get("v") is not None:
                item["v"] = old["v"]
        pitchers.append(pitcher)

    pitchers.sort(key=lambda p: (p.get("team") or "ZZZ", p.get("name") or ""))
    return pitchers


def clamp(value, low, high):
    return max(low, min(high, value))


def american_from_probability(probability):
    probability = finite(probability)
    if probability is None or probability <= 0 or probability >= 1:
        return None
    if probability >= 0.5:
        return int(round(-100 * probability / (1 - probability)))
    return int(round(100 * (1 - probability) / probability))


def play_to_from_fair(fair):
    fair = finite(fair)
    if fair is None:
        return None
    # Higher American odds are better for the bettor on a fixed side, whether
    # negative or positive. Require a modest improvement over fair.
    return int(round(fair + 10))


def customer_prop_probability(raw_probability, baseline, low, high, weight=0.42):
    raw = finite(raw_probability)
    if raw is None:
        return None
    return clamp(baseline + (raw - baseline) * weight, low, high)


FEATURED_HITTER_NAME_OVERRIDES = {
    "ATH": {"Butler": "Lawrence Butler", "Cortes": "Carlos Cortes", "Heim": "Jonah Heim", "Kurtz": "Nick Kurtz", "Muncy": "Max Muncy", "Soderstrom": "Tyler Soderstrom"},
    "ATL": {"Albies": "Ozzie Albies", "Baldwin": "Drake Baldwin", "Dubón": "Mauricio Dubón", "II": "Michael Harris II", "Mateo": "Jorge Mateo", "Olson": "Matt Olson"},
    "AZ": {"Carroll": "Corbin Carroll", "Marte": "Ketel Marte", "Moreno": "Gabriel Moreno", "Perdomo": "Geraldo Perdomo", "Troy": "Tommy Troy", "Vargas": "Ildemaro Vargas"},
    "BAL": {"Alexander": "Blaze Alexander", "Alonso": "Pete Alonso", "Beavers": "Dylan Beavers", "Cowser": "Colton Cowser", "Henderson": "Gunnar Henderson", "Rutschman": "Adley Rutschman"},
    "BOS": {"Abreu": "Wilyer Abreu", "Contreras": "Willson Contreras", "Durbin": "Caleb Durbin", "Rafaela": "Ceddanne Rafaela", "Yoshida": "Masataka Yoshida"},
    "CHC": {"Busch": "Michael Busch", "Conforto": "Michael Conforto", "Crow-Armstrong": "Pete Crow-Armstrong", "Hoerner": "Nico Hoerner", "Kelly": "Carson Kelly", "Shaw": "Matt Shaw"},
    "CIN": {"Bleday": "JJ Bleday", "Lowe": "Nathaniel Lowe", "Myers": "Dane Myers", "Stewart": "Sal Stewart", "Suárez": "Eugenio Suárez"},
    "CLE": {"Bazzana": "Travis Bazzana", "DeLauter": "Chase DeLauter", "Rocchio": "Brayan Rocchio", "Schneemann": "Daniel Schneemann"},
    "COL": {"Castro": "Willi Castro", "Goodman": "Hunter Goodman", "Johnston": "Troy Johnston", "Karros": "Kyle Karros", "McCarthy": "Jake McCarthy", "Moniak": "Mickey Moniak"},
    "CWS": {"Benintendi": "Andrew Benintendi", "Grichuk": "Randal Grichuk", "Vargas": "Miguel Vargas"},
    "DET": {"Carpenter": "Kerry Carpenter", "Dingler": "Dillon Dingler", "Greene": "Riley Greene", "Jones": "Jahmai Jones", "Keith": "Colt Keith", "Lee": "Hao-Yu Lee", "McGonigle": "Kevin McGonigle"},
    "HOU": {"Altuve": "Jose Altuve", "Alvarez": "Yordan Alvarez", "Paredes": "Isaac Paredes", "Walker": "Christian Walker"},
    "KC": {"Caglianone": "Jac Caglianone", "Collins": "Isaac Collins", "Jensen": "Carter Jensen", "Jr.": "Bobby Witt Jr.", "Loftin": "Nick Loftin"},
    "LAA": {"Grissom": "Vaughn Grissom", "Guzman": "Denzer Guzman", "Peraza": "Oswald Peraza", "Soler": "Jorge Soler", "Walton": "Donovan Walton"},
    "LAD": {"Freeman": "Freddie Freeman", "Muncy": "Max Muncy", "Ohtani": "Shohei Ohtani", "Pages": "Andy Pages", "Tucker": "Kyle Tucker"},
    "MIA": {"Hernández": "Heriberto Hernández", "Lopez": "Otto Lopez", "Marsee": "Jakob Marsee", "Ruiz": "Esteury Ruiz", "Stowers": "Kyle Stowers"},
    "MIL": {"Bauers": "Jake Bauers", "Chourio": "Jackson Chourio", "Frelick": "Sal Frelick", "Turang": "Brice Turang", "Vaughn": "Andrew Vaughn", "Yelich": "Christian Yelich"},
    "MIN": {"Caratini": "Victor Caratini", "Clemens": "Kody Clemens", "Kreidler": "Ryan Kreidler", "Larnach": "Trevor Larnach", "Lee": "Brooks Lee", "Martin": "Austin Martin"},
    "NYM": {"Baty": "Brett Baty", "Bichette": "Bo Bichette", "Soto": "Juan Soto", "Young": "Jared Young"},
    "NYY": {"Bellinger": "Cody Bellinger", "Goldschmidt": "Paul Goldschmidt", "Jr.": "Jazz Chisholm Jr.", "Rice": "Ben Rice"},
    "PHI": {"Harper": "Bryce Harper", "Marsh": "Brandon Marsh", "Schwarber": "Kyle Schwarber", "Sosa": "Edmundo Sosa", "Stott": "Bryson Stott"},
    "PIT": {"Griffin": "Konnor Griffin", "Lowe": "Brandon Lowe", "Mangum": "Jake Mangum", "Reynolds": "Bryan Reynolds", "Valdez": "Esmerlyn Valdez"},
    "SD": {"Andujar": "Miguel Andujar", "France": "Ty France", "Machado": "Manny Machado", "Merrill": "Jackson Merrill", "Taylor": "Samad Taylor"},
    "SEA": {"Crawford": "J.P. Crawford", "Emerson": "Colt Emerson", "Garver": "Mitch Garver", "Naylor": "Josh Naylor", "Raleigh": "Cal Raleigh", "Raley": "Luke Raley"},
    "SF": {"Arraez": "Luis Arraez", "Eldridge": "Bryce Eldridge", "Ramos": "Heliot Ramos", "Schmitt": "Casey Schmitt"},
    "STL": {"Burleson": "Alec Burleson", "Church": "Nathan Church", "Herrera": "Iván Herrera", "Walker": "Jordan Walker", "Winn": "Masyn Winn"},
    "TB": {"Aranda": "Jonathan Aranda", "Caminero": "Junior Caminero", "Díaz": "Yandy Díaz", "Simpson": "Chandler Simpson", "Vilade": "Ryan Vilade"},
    "TEX": {"Burger": "Jake Burger", "Duran": "Ezequiel Duran", "Higashioka": "Kyle Higashioka", "Jung": "Josh Jung", "Osuna": "Alejandro Osuna", "Pederson": "Joc Pederson"},
    "TOR": {"Lukes": "Nathan Lukes", "Okamoto": "Kazuma Okamoto", "Springer": "George Springer", "Valenzuela": "Brandon Valenzuela"},
    "WSH": {"Abrams": "CJ Abrams", "Lile": "Daylen Lile", "Nuñez": "Nasim Nuñez", "Ruiz": "Keibert Ruiz", "Wood": "James Wood"},
}


def display_featured_hitter(team_abbr, short_name):
    if not short_name:
        return None
    return FEATURED_HITTER_NAME_OVERRIDES.get(team_abbr, {}).get(short_name, short_name)


def customer_score(team, opposing_starter, opposing_bullpen_status, league):
    """Create a publishable score forecast without exporting model inputs."""
    rpg = finite(team.get("rpg"))
    offense = finite(team.get("offenseXwoba"))
    park = finite(team.get("park"))
    starter_era = finite((opposing_starter or {}).get("runPreventionEra"))
    bullpen_era = finite(team.get("bullpenEra"))
    league_rpg = finite(league.get("rpg"))
    league_era = finite(league.get("era"))
    if None in (rpg, offense, park, starter_era, bullpen_era, league_rpg, league_era):
        return None
    bullpen_adjustment = {"fresh": -0.05, "normal": 0.0, "taxed": 0.10}.get(opposing_bullpen_status)
    if bullpen_adjustment is None:
        return None
    k_pitch_adjustment = pitcher_pitch_by_pitch_run_adjustment(opposing_starter)
    forecast = (
        rpg
        + (offense - 0.318) * 12
        + (league_era - starter_era) * 0.32
        + (bullpen_era - league_era) * 0.08
        + (park - 1) * 0.45
        + bullpen_adjustment
        + k_pitch_adjustment
    )
    return round(clamp(forecast, 2.0, 8.0), 1)


def pitcher_pitch_by_pitch_run_adjustment(starter):
    starter = starter or {}
    sample = finite(starter.get("pitchKSamplePitches"))
    if sample is None or sample < 150:
        return 0.0
    csw = finite(starter.get("pitchKCswRate"))
    putaway = finite(starter.get("pitchKPutawayRate"))
    two_strike_whiff = finite(starter.get("pitchKTwoStrikeWhiffRate"))
    k_pa = finite(starter.get("pitchKRatePerPa"))
    components = []
    if csw is not None:
        components.append((csw - 0.275) * -2.0)
    if putaway is not None:
        components.append((putaway - 0.185) * -1.6)
    if two_strike_whiff is not None:
        components.append((two_strike_whiff - 0.235) * -1.2)
    if k_pa is not None:
        components.append((k_pa - 0.225) * -1.0)
    return round(clamp(sum(components), -0.28, 0.22), 4) if components else 0.0


def pitcher_pitch_by_pitch_k_bonus(starter):
    starter = starter or {}
    sample = finite(starter.get("pitchKSamplePitches"))
    if sample is None or sample < 150:
        return 0.0
    csw = finite(starter.get("pitchKCswRate"))
    putaway = finite(starter.get("pitchKPutawayRate"))
    two_strike_whiff = finite(starter.get("pitchKTwoStrikeWhiffRate"))
    k_pa = finite(starter.get("pitchKRatePerPa"))
    components = []
    if csw is not None:
        components.append((csw - 0.275) * 3.2)
    if putaway is not None:
        components.append((putaway - 0.185) * 2.2)
    if two_strike_whiff is not None:
        components.append((two_strike_whiff - 0.235) * 1.7)
    if k_pa is not None:
        components.append((k_pa - 0.225) * 2.0)
    return round(clamp(sum(components), -0.35, 0.50), 4) if components else 0.0


def customer_k_target(starter):
    starter = starter or {}
    k_rate = finite(starter.get("k"))
    innings = finite(starter.get("ip"))
    if k_rate is None or innings is None:
        return {
            "player": starter.get("name"),
            "line": None,
            "projected": None,
            "over_fair": None,
            "under_fair": None,
            "over_play_to": None,
            "under_play_to": None,
            "explainer": "Starter strikeout target is unavailable until a supported projection is available.",
        }
    base_projected = clamp((k_rate / 100) * (innings * 4.35), 1.5, 11.0)
    chase = finite(starter.get("chaseGenerated"))
    swstr = finite(starter.get("swingingStrikeRate"))
    slg_allowed = finite(starter.get("slgAllowed"))
    xwoba_allowed = finite(starter.get("xwobaAllowed"))
    barrel_allowed = finite(starter.get("barrelAllowed"))
    chase_bonus = clamp(((chase or 0.302) - 0.302) * 2.0 + ((swstr or 0.108) - 0.108) * 7.0, 0.0, 0.45)
    workload_bonus = clamp((innings - 5.0) * 0.18, 0.0, 0.35)
    damage_penalty = clamp(
        max(0, (slg_allowed or 0.402) - 0.402) * 1.2
        + max(0, (xwoba_allowed or 0.318) - 0.318) * 2.5
        + max(0, (barrel_allowed or 0.080) - 0.080) * 4.5,
        0.0,
        0.70,
    )
    pitch_by_pitch_bonus = pitcher_pitch_by_pitch_k_bonus(starter)
    ceiling_projected = clamp(base_projected + 0.95 + chase_bonus + workload_bonus + pitch_by_pitch_bonus - damage_penalty, base_projected + 0.15, 12.0)
    line = math.floor(base_projected) + 0.5
    over_probability = clamp(0.50 + (ceiling_projected - line) * 0.22, 0.35, 0.65)
    under_probability = 1 - over_probability
    base_over_probability = clamp(0.50 + (base_projected - line) * 0.22, 0.35, 0.65)
    base_under_probability = 1 - base_over_probability
    over_fair = american_from_probability(over_probability)
    under_fair = american_from_probability(under_probability)
    base_over_fair = american_from_probability(base_over_probability)
    base_under_fair = american_from_probability(base_under_probability)
    return {
        "player": starter.get("name"),
        "line": line,
        "base_projected": round(base_projected, 1),
        "ceiling_projected": round(ceiling_projected, 1),
        "projected": round(ceiling_projected, 1),
        "over_fair": over_fair,
        "under_fair": under_fair,
        "base_over_fair": base_over_fair,
        "base_under_fair": base_under_fair,
        "over_play_to": play_to_from_fair(over_fair),
        "under_play_to": play_to_from_fair(under_fair),
        "base_over_play_to": play_to_from_fair(base_over_fair),
        "base_under_play_to": play_to_from_fair(base_under_fair),
        "pitch_by_pitch_k_bonus": round(pitch_by_pitch_bonus, 2),
        "pitch_by_pitch_sample_pitches": starter.get("pitchKSamplePitches"),
        "putaway_rate": rounded(starter.get("pitchKPutawayRate"), 3),
        "csw_rate": rounded(starter.get("pitchKCswRate"), 3),
        "two_strike_whiff_rate": rounded(starter.get("pitchKTwoStrikeWhiffRate"), 3),
        "explainer": "Ceiling game view: starts from base K workload, adds chase/whiff upside, and suppresses the ceiling when the starter's damage profile threatens early traffic or shorter leash.",
    }


def customer_batter_k_targets(batting_team, opposing_starter, crush, pitch_ref):
    if not opposing_starter or not opposing_starter.get("mix"):
        return []
    team_crush = (crush or {}).get(batting_team) or {}
    candidates = []
    for pitch in opposing_starter.get("mix") or []:
        pitch_type = pitch.get("t")
        usage = finite(pitch.get("u"))
        if not pitch_type or usage is None or usage < 10:
            continue
        featured = team_crush.get(pitch_type)
        if not featured:
            continue
        whiff = finite(featured.get("wh"))
        if whiff is None or whiff < 0.30:
            continue
        chase = finite(featured.get("ch"))
        batter = display_featured_hitter(batting_team, featured.get("n"))
        pitch_name = (pitch_ref or {}).get(pitch_type) or pitch_type
        strength = whiff * usage
        candidates.append(
            {
                "batter": batter,
                "team": batting_team,
                "pitcher": opposing_starter.get("name"),
                "pitch_type": pitch_type,
                "pitch_name": pitch_name,
                "usage": round(usage, 1),
                "whiff_rate": round(whiff, 3),
                "chase_rate": round(chase, 3) if chase is not None else None,
                "market": "Batter strikeouts",
                "side": "Over",
                "line": 0.5,
                "probability": round(clamp(0.48 + (whiff - 0.30) * 0.55 + (usage - 10) * 0.006 + ((chase or 0.30) - 0.30) * 0.08, 0.42, 0.68), 3),
                "strength": round(strength, 3),
                "label": "Strong K target" if whiff >= 0.40 or usage >= 24 else "K target",
                "explainer": f"{batter or 'Featured hitter'} has a high whiff profile against {pitch_name}; {opposing_starter.get('name') or 'the starter'} throws it {round(usage)}% of the time.",
            }
        )
    candidates.sort(key=lambda item: (item["strength"], item["whiff_rate"], item["usage"]), reverse=True)
    seen = set()
    out = []
    for item in candidates:
        key = normalize_name(item.get("batter"))
        if key in seen:
            continue
        seen.add(key)
        item.pop("strength", None)
        item["fair"] = american_from_probability(item.get("probability"))
        item["play_to"] = play_to_from_fair(item.get("fair"))
        out.append(item)
        if len(out) >= 3:
            break
    return out


def customer_batter_prop_angles(batting_team, opposing_starter, crush, pitch_ref):
    if not opposing_starter or not opposing_starter.get("mix"):
        return []
    team_crush = (crush or {}).get(batting_team) or {}
    candidates = []
    plate_appearances = 4.1

    def add_angle(featured, pitch, market, side, line, probability, pitch_name, reasons, score_boost=0):
        batter = display_featured_hitter(batting_team, featured.get("n"))
        if not batter:
            return
        fair = american_from_probability(probability)
        if fair is None:
            return
        usage = finite(pitch.get("u")) or 0
        rv = finite(featured.get("rv")) or 0
        slg = finite(featured.get("slg"))
        ba = finite(featured.get("ba"))
        barrel = finite(featured.get("brl"))
        strength = probability * 100 + usage * 0.25 + max(rv, 0) * 1.8 + score_boost
        label = "Strong angle" if (
            market == "Batter HR" and (probability >= 0.13 or (barrel is not None and barrel >= 0.14))
        ) or (
            market == "Batter TB" and (probability >= 0.53 or (slg is not None and slg >= 0.70))
        ) or (
            market == "Batter hits" and (probability >= 0.70 or (ba is not None and ba >= 0.37))
        ) else "Angle"
        metric_bits = []
        if ba is not None:
            metric_bits.append(f"{ba:.3f} BA")
        if slg is not None:
            metric_bits.append(f"{slg:.3f} SLG")
        if barrel is not None:
            metric_bits.append(f"{round(barrel * 100)}% barrel")
        reason_text = ", ".join(reasons[:3]) if reasons else "pitch-type fit"
        candidates.append(
            {
                "player": batter,
                "team": batting_team,
                "market": market,
                "side": side,
                "line": line,
                "probability": round(probability, 3),
                "fair": fair,
                "play_to": play_to_from_fair(fair),
                "pitcher": opposing_starter.get("name"),
                "pitch_type": pitch.get("t"),
                "pitch_name": pitch_name,
                "usage": round(usage, 1),
                "ba": round(ba, 3) if ba is not None else None,
                "slg": round(slg, 3) if slg is not None else None,
                "barrel_rate": round(barrel, 3) if barrel is not None else None,
                "label": label,
                "explainer": f"{batter} {market.replace('Batter ', '')} angle vs {opposing_starter.get('name') or 'the starter'} on {pitch_name} ({round(usage)}% usage): {reason_text}.",
                "metrics": " · ".join(metric_bits),
                "_strength": round(strength, 4),
            }
        )

    for pitch in opposing_starter.get("mix") or []:
        pitch_type = pitch.get("t")
        usage = finite(pitch.get("u"))
        if not pitch_type or usage is None or usage < 12:
            continue
        featured = team_crush.get(pitch_type)
        if not featured:
            continue
        ba = finite(featured.get("ba"))
        slg = finite(featured.get("slg"))
        barrel = finite(featured.get("brl"))
        pitch_name = (pitch_ref or {}).get(pitch_type) or pitch_type
        if ba is not None and ba >= 0.30:
            raw_probability = clamp(1 - math.pow(1 - clamp(ba, 0.05, 0.45), plate_appearances), 0.05, 0.95)
            probability = customer_prop_probability(raw_probability, 0.62, 0.38, 0.74)
            reasons = []
            if ba >= 0.35:
                reasons.append("high contact fit")
            if usage >= 18:
                reasons.append("starter shows this pitch often")
            reasons.append("hit-market profile")
            add_angle(featured, pitch, "Batter hits", "Over", 0.5, probability, pitch_name, reasons)
        if slg is not None and (slg >= 0.55 or (barrel is not None and barrel >= 0.08)):
            raw_probability = clamp(1 - math.pow(1 - clamp(slg / 4, 0.05, 0.4), plate_appearances) - 0.12, 0.05, 0.80)
            probability = customer_prop_probability(raw_probability, 0.45, 0.25, 0.60)
            reasons = []
            if slg >= 0.65:
                reasons.append("extra-base damage fit")
            if barrel is not None and barrel >= 0.10:
                reasons.append("barrel-backed contact")
            if usage >= 18:
                reasons.append("starter shows this pitch often")
            add_angle(featured, pitch, "Batter TB", "Over", 1.5, probability, pitch_name, reasons)
        if barrel is not None and (barrel >= 0.08 or (slg is not None and slg >= 0.62)):
            raw_probability = clamp(1 - math.pow(1 - clamp(barrel * 0.20, 0.003, 0.07), plate_appearances), 0.02, 0.28)
            probability = customer_prop_probability(raw_probability, 0.10, 0.02, 0.18)
            reasons = []
            if barrel >= 0.14:
                reasons.append("home-run barrel signal")
            if slg is not None and slg >= 0.70:
                reasons.append("power damage fit")
            if usage >= 18:
                reasons.append("starter shows this pitch often")
            add_angle(featured, pitch, "Batter HR", "Over", 0.5, probability, pitch_name, reasons, score_boost=4)

    seen = defaultdict(int)
    out = []
    buckets = {
        "Batter HR": sorted([item for item in candidates if item.get("market") == "Batter HR"], key=lambda item: item["_strength"], reverse=True),
        "Batter TB": sorted([item for item in candidates if item.get("market") == "Batter TB"], key=lambda item: item["_strength"], reverse=True),
        "Batter hits": sorted([item for item in candidates if item.get("market") == "Batter hits"], key=lambda item: item["_strength"], reverse=True),
    }
    for market, limit in [("Batter HR", 4), ("Batter TB", 4), ("Batter hits", 4)]:
        kept = 0
        for item in buckets[market]:
            player_key = normalize_name(item.get("player"))
            market_key = item.get("market")
            if seen[(player_key, market_key)]:
                continue
            if seen[player_key] >= 3:
                continue
            seen[(player_key, market_key)] += 1
            seen[player_key] += 1
            item.pop("_strength", None)
            out.append(item)
            kept += 1
            if kept >= limit:
                break
    return out


def matchup_synthesis(away, home, away_score, home_score):
    if away_score is None or home_score is None:
        return "A customer-safe matchup summary will appear when both team forecasts are available."
    total = away_score + home_score
    edge = home_score - away_score
    pace = "a lower-scoring game script" if total < 8.1 else "a balanced run environment" if total < 9.4 else "a higher-scoring game script"
    if abs(edge) < 0.35:
        side = "Neither side has a meaningful projected scoring edge."
    else:
        team = home if edge > 0 else away
        side = f"{team} has the clearer projected scoring path."
    return f"The board sees {pace}. {side}"


def customer_f5_projection(away_score, home_score, away_starter, home_starter):
    if away_score is None or home_score is None:
        return None
    away_ip = finite((away_starter or {}).get("ip")) or 5.0
    home_ip = finite((home_starter or {}).get("ip")) or 5.0
    away_share = clamp(0.50 + (home_ip - 5.0) * 0.025, 0.47, 0.62)
    home_share = clamp(0.50 + (away_ip - 5.0) * 0.025, 0.47, 0.62)
    f5_away = round(away_score * away_share, 1)
    f5_home = round(home_score * home_share, 1)
    f5_total = round(f5_away + f5_home, 1)
    home_probability = round(1 / (1 + math.exp(-(f5_home - f5_away) / 0.95)), 3)
    return {
        "away_score": f5_away,
        "home_score": f5_home,
        "total": f5_total,
        "home_win_probability": home_probability,
        "away_fair": american_from_probability(1 - home_probability),
        "home_fair": american_from_probability(home_probability),
    }


def current_slate_date():
    configured_date = os.environ.get("MLB_SLATE_DATE")
    if configured_date:
        try:
            return datetime.strptime(configured_date, "%Y-%m-%d").date().isoformat()
        except ValueError as exc:
            raise RuntimeError("MLB_SLATE_DATE must use YYYY-MM-DD") from exc
    return datetime.now(ZoneInfo("America/New_York")).date().isoformat()


def build_top_board(games):
    hr_angles = []
    pitcher_k = []
    batter_k = []
    totals = []
    side_total_pool = []
    for game in games:
        label = f"{game.get('away')} @ {game.get('home')}"
        for angle in game.get("batter_prop_angles") or []:
            if angle.get("market") == "Batter HR":
                hr_angles.append(
                    {
                        "title": f"{angle.get('player')} HR",
                        "subtitle": f"{angle.get('team')} vs {angle.get('pitcher')} · {angle.get('pitch_name')} {angle.get('usage')}%",
                        "game": label,
                        "fair": angle.get("fair"),
                        "play_to": angle.get("play_to"),
                        "score": angle.get("probability") or 0,
                    }
                )
        for angle in game.get("prop_angles") or []:
            line = finite(angle.get("line"))
            ceiling = finite(angle.get("projected"))
            base = finite(angle.get("base_projected"))
            edge = (ceiling - line) if ceiling is not None and line is not None else 0
            pitcher_k.append(
                {
                    "title": f"{angle.get('player')} over Ks",
                    "subtitle": f"Base {base} · ceiling {ceiling} · fallback line {line}",
                    "game": label,
                    "fair": angle.get("fair"),
                    "play_to": angle.get("play_to"),
                    "score": edge,
                }
            )
        for target in game.get("k_targets") or []:
            batter_k.append(
                {
                    "title": f"{target.get('batter')} over 0.5 K",
                    "subtitle": f"{target.get('team')} vs {target.get('pitcher')} · {target.get('pitch_name')} {target.get('usage')}%",
                    "game": label,
                    "fair": target.get("fair"),
                    "play_to": target.get("play_to"),
                    "score": target.get("probability") or 0,
                }
            )
        total = finite(game.get("total"))
        if total is not None:
            total_side = "Over" if total >= 9.2 else "Under" if total <= 8.3 else None
            total_score = abs(total - 8.7)
            if total_side:
                totals.append(
                    {
                        "title": f"{total_side} lean",
                        "subtitle": f"Fair total {total:.1f}",
                        "game": label,
                        "fair": None,
                        "play_to": None,
                        "score": total_score,
                    }
                )
                side_total_pool.append({**totals[-1], "type": "total"})
        home_probability = finite(game.get("home_win_probability"))
        if home_probability is not None:
            if home_probability >= 0.54:
                side_total_pool.append(
                    {
                        "title": f"{game.get('home')} moneyline",
                        "subtitle": f"Fair win {round(home_probability * 100)}%",
                        "game": label,
                        "fair": (game.get("moneyline_fairs") or {}).get("home_fair"),
                        "play_to": play_to_from_fair((game.get("moneyline_fairs") or {}).get("home_fair")),
                        "score": home_probability - 0.50,
                        "type": "side",
                    }
                )
            elif home_probability <= 0.46:
                away_probability = 1 - home_probability
                side_total_pool.append(
                    {
                        "title": f"{game.get('away')} moneyline",
                        "subtitle": f"Fair win {round(away_probability * 100)}%",
                        "game": label,
                        "fair": (game.get("moneyline_fairs") or {}).get("away_fair"),
                        "play_to": play_to_from_fair((game.get("moneyline_fairs") or {}).get("away_fair")),
                        "score": away_probability - 0.50,
                        "type": "side",
                    }
                )

    def top(items, limit):
        return sorted(items, key=lambda item: item.get("score") or 0, reverse=True)[:limit]

    parlay = []
    used_games = set()
    for item in top(side_total_pool, 10):
        if item.get("game") in used_games:
            continue
        used_games.add(item.get("game"))
        parlay.append(item)
        if len(parlay) == 3:
            break
    return {
        "best_hr_bets": top(hr_angles, 5),
        "best_pitcher_strikeout_bets": top(pitcher_k, 5),
        "best_batter_strikeout_targets": top(batter_k, 5),
        "best_three_game_side_total_parlay": parlay,
        "best_total_bets": top(totals, 5),
    }


def build_customer_board(data):
    teams = {team.get("abbr"): team for team in data.get("teams", []) if team.get("abbr")}
    pitchers_by_id = {pitcher.get("player_id"): pitcher for pitcher in data.get("pitchers", []) if pitcher.get("player_id") is not None}
    pitchers_by_name = {normalize_name(pitcher.get("name")): pitcher for pitcher in data.get("pitchers", []) if pitcher.get("name")}
    crush = data.get("crush") or {}
    pitch_ref = data.get("pitchRef") or {}
    games = []
    suppressed = []
    for game in data.get("games", []):
        away = game.get("away")
        home = game.get("home")
        away_team = teams.get(away)
        home_team = teams.get(home)
        if not away_team or not home_team:
            continue
        game_date = game.get("date") or data.get("date")
        suppression_key = (game_date, away, home)
        if suppression_key in SUPPRESSED_CUSTOMER_GAMES:
            suppressed.append({"id": game.get("gamePk"), "away": away, "home": home, "reason": SUPPRESSED_CUSTOMER_GAMES[suppression_key]})
            continue
        away_starter = pitchers_by_id.get(game.get("awayStarterId")) or pitchers_by_name.get(normalize_name(game.get("awayStarter")))
        home_starter = pitchers_by_id.get(game.get("homeStarterId")) or pitchers_by_name.get(normalize_name(game.get("homeStarter")))
        if not away_starter or not home_starter:
            suppressed.append({"id": game.get("gamePk"), "away": away, "home": home, "reason": "missing_supported_starter"})
            continue
        away_score = customer_score(away_team, home_starter, game.get("homeBullpenStatus"), data.get("league") or {})
        home_score = customer_score(home_team, away_starter, game.get("awayBullpenStatus"), data.get("league") or {})
        total = round(away_score + home_score, 1) if away_score is not None and home_score is not None else None
        home_probability = None
        if away_score is not None and home_score is not None:
            home_probability = round(1 / (1 + math.exp(-(home_score - away_score) / 1.25)), 3)
        f5 = customer_f5_projection(away_score, home_score, away_starter, home_starter)
        away_starter_k = customer_k_target(away_starter)
        home_starter_k = customer_k_target(home_starter)
        batter_k_targets = (
            customer_batter_k_targets(away, home_starter, crush, pitch_ref)
            + customer_batter_k_targets(home, away_starter, crush, pitch_ref)
        )
        batter_prop_angles = (
            customer_batter_prop_angles(away, home_starter, crush, pitch_ref)
            + customer_batter_prop_angles(home, away_starter, crush, pitch_ref)
        )
        batter_prop_angles.sort(key=lambda item: (item.get("label") == "Strong angle", item.get("probability") or 0), reverse=True)
        batter_prop_angles = batter_prop_angles[:10]
        prop_angles = []
        for target in (away_starter_k, home_starter_k):
            if target.get("line") is None:
                continue
            prop_angles.append(
                {
                    "player": target.get("player"),
                    "market": "Pitcher strikeouts",
                    "side": "Over",
                    "line": target.get("line"),
                    "projected": target.get("projected"),
                    "base_projected": target.get("base_projected"),
                    "fair": target.get("over_fair"),
                    "under_fair": target.get("under_fair"),
                    "base_fair": target.get("base_over_fair"),
                    "base_under_fair": target.get("base_under_fair"),
                    "book": None,
                    "play_to": target.get("over_play_to"),
                    "under_play_to": target.get("under_play_to"),
                    "base_play_to": target.get("base_over_play_to"),
                    "base_under_play_to": target.get("base_under_play_to"),
                    "designation": "Watch price",
                    "explainer": target.get("explainer"),
                }
            )
        games.append(
            {
                "id": game.get("gamePk"),
                "away": away,
                "home": home,
                "away_name": game.get("awayName"),
                "home_name": game.get("homeName"),
                "away_starter": (away_starter or {}).get("name") or game.get("awayStarter"),
                "home_starter": (home_starter or {}).get("name") or game.get("homeStarter"),
                "status": game.get("status"),
                "time": game.get("time"),
                "day_night": game.get("dayNight"),
                "away_score": away_score,
                "home_score": home_score,
                "total": total,
                "home_win_probability": home_probability,
                "moneyline_fairs": {
                    "away_probability": round(1 - home_probability, 3) if home_probability is not None else None,
                    "home_probability": home_probability,
                    "away_fair": american_from_probability(1 - home_probability) if home_probability is not None else None,
                    "home_fair": american_from_probability(home_probability) if home_probability is not None else None,
                },
                "team_total_fairs": {
                    "away": away_score,
                    "home": home_score,
                },
                "f5": f5,
                "synthesis": matchup_synthesis(away, home, away_score, home_score),
                "batter_prop_angles": batter_prop_angles,
                "k_targets": batter_k_targets,
                "prop_angles": prop_angles,
            }
        )
    return {
        "date": data.get("date"),
        "generated": data.get("generated"),
        "games": games,
        "top_board": build_top_board(games),
        "suppressed_games": suppressed,
    }


def main() -> None:
    original = read_json(BASELINE_DATA)
    existing_customer_board_path = SRC_DIR / "customer_board.json"
    existing_customer_board = read_json(existing_customer_board_path) if existing_customer_board_path.exists() else {}
    results_history = normalize_results_history(existing_customer_board.get("results_history"))
    bet_ledger = existing_customer_board.get("bet_ledger") if isinstance(existing_customer_board.get("bet_ledger"), dict) else {}
    odds_history = normalize_odds_history(existing_customer_board.get("odds_history"))
    quality = read_json(DATA_DIR / "data_quality_report.json")
    starters = read_json(DATA_DIR / "starter_damage_allowed.json")
    pitch_types = read_json(DATA_DIR / "pitcher_pitch_type_damage_allowed.json")
    chase = read_json(DATA_DIR / "pitcher_chase_generation.json")
    pitch_by_pitch_k = read_json(DATA_DIR / "pitcher_pitch_by_pitch_strikeouts.json") if (DATA_DIR / "pitcher_pitch_by_pitch_strikeouts.json").exists() else []
    bullpen = read_json(DATA_DIR / "bullpen_availability.json") if (DATA_DIR / "bullpen_availability.json").exists() else []

    pitchers = build_pitcher_objects(original, starters, pitch_types, chase, pitch_by_pitch_k)
    source_context = quality.get("source_context", {})
    season_date = current_slate_date()
    bullpen_by_team = {row.get("team"): row for row in bullpen if row.get("team")}
    games = fetch_schedule(season_date, load_team_ids(), bullpen_by_team)

    pitch_ref = dict(original.get("pitchRef", {}))
    for row in pitch_types:
        if row.get("pitch_type") and row.get("pitch_name"):
            pitch_ref.setdefault(row["pitch_type"], row["pitch_name"])

    next_data = dict(original)
    next_data.update(
        {
            "source": "live-data+savant-pitcher-tables",
            "generated": source_context.get("last_updated") or datetime.now(timezone.utc).replace(microsecond=0).isoformat(),
            "date": season_date,
            "start": source_context.get("start_date") or original.get("start"),
            "end": source_context.get("end_date") or original.get("end"),
            "pitchers": pitchers,
            "games": games,
            "pitchRef": pitch_ref,
            "sourceTables": {
                "starterDamageRows": len(starters),
                "pitchTypeDamageRows": len(pitch_types),
                "chaseGenerationRows": len(chase),
                "pitchByPitchStrikeoutRows": len(pitch_by_pitch_k),
                "bullpenAvailabilityRows": len(bullpen),
                "smallSamplePitchTypeRows": quality.get("small_sample_counts", {}).get("pitcher_pitch_type_damage_allowed"),
                "qualityReport": "data/data_quality_report.json",
                "backtestCalibration": "data/backtest_calibration.json",
            },
        }
    )
    next_data["league"] = dict(next_data.get("league", {}))
    for key, field in [
        ("barrelAllowed", "barrel_allowed_rate"),
        ("hardHitAllowed", "hard_hit_allowed_rate"),
        ("hrFbAllowed", "hr_fb_allowed"),
        ("slgAllowed", "slg_allowed"),
        ("xslgAllowed", "xslg_allowed"),
    ]:
        value = mean(row.get(field) for row in starters)
        if value is not None:
            next_data["league"][key] = rounded(value, 4)

    customer_board = build_customer_board(next_data)
    odds_history = merge_odds_history(odds_history, customer_board.get("date"), fetch_customer_odds_snapshot(customer_board))
    if results_history:
        customer_board["results_history"] = results_history
    if bet_ledger:
        customer_board["bet_ledger"] = bet_ledger
    if odds_history:
        customer_board["odds_history"] = odds_history
    (SRC_DIR / "customer_board.json").write_text(
        json.dumps(customer_board, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    # The source tables are build inputs, not customer-facing artifacts. Keep
    # them out of public/ so neither raw inputs nor model-quality metadata is
    # carried into dist/.
    for name in [
        "diamond_data.json",
        "starter_damage_allowed.json",
        "pitcher_pitch_type_damage_allowed.json",
        "pitcher_chase_generation.json",
        "bullpen_availability.json",
        "backtest_calibration.json",
        "data_quality_report.json",
    ]:
        path = (PUBLIC_DIR / "data" / name) if name != "diamond_data.json" else (PUBLIC_DIR / name)
        path.unlink(missing_ok=True)

    current_app_path = SRC_DIR / "App.jsx"
    current_app = current_app_path.read_text(encoding="utf-8") if current_app_path.exists() else ""
    if "CUSTOMER_BOARD_SAFE" not in current_app:
        raise RuntimeError("Maintained customer board is missing its safety marker; refusing legacy attachment rewrite")

    # The customer board is maintained source. Its data comes exclusively from
    # customer_board.json, so a daily refresh must never depend on a volatile
    # attachment or attempt brittle regex rewrites of the frontend.
    print(
        json.dumps(
            {
                "pitchers": len(pitchers),
                "games": len(games),
                "pitch_type_rows": len(pitch_types),
                "chase_rows": len(chase),
                "bullpen_rows": len(bullpen),
                "starter_rows": len(starters),
                "customer_games": len(customer_board["games"]),
            },
            indent=2,
        )
    )
    return

    app_source = ""
    app_source = app_source.replace(
        'import { useEffect, useMemo, useState } from "react";',
        'import React, { useEffect, useMemo, useState } from "react";',
        1,
    )
    app_source = re.sub(
        r'import \{\n  Bar,\n  BarChart,\n  CartesianGrid,\n  ResponsiveContainer,\n  Tooltip,\n  XAxis,\n  YAxis\n\} from "recharts";',
        'import {\n  Bar,\n  BarChart,\n  CartesianGrid,\n  ResponsiveContainer,\n  Tooltip,\n  XAxis,\n  YAxis\n} from "recharts";\nimport DEFAULT_DATA from "./diamond_data.json";',
        app_source,
        count=1,
    )
    app_source = re.sub(
        r'\nconst DEFAULT_DATA = \{.*?\};\n\nconst BULLPEN_MULT',
        "\nconst BULLPEN_MULT",
        app_source,
        count=1,
        flags=re.S,
    )
    app_source = app_source.replace(
        'const [loadState, setLoadState] = useState("Savant data · " + DEFAULT_DATA.date);',
        'const [loadState, setLoadState] = useState("Savant pitcher tables · " + DEFAULT_DATA.date);',
    )
    app_source = app_source.replace(
        'const label = nextData.source === "live-data" ? `Live data · ${nextData.generated}` : "Embedded snapshot";',
        'const label = nextData.source?.includes("savant-pitcher-tables") ? `Savant pitcher tables · ${nextData.generated}` : (nextData.source === "live-data" ? `Live data · ${nextData.generated}` : "Embedded snapshot");',
    )
    app_source = app_source.replace(
        'if (!cancelled) setLoadState("Savant data · " + DEFAULT_DATA.date);',
        'if (!cancelled) setLoadState("Savant pitcher tables · " + DEFAULT_DATA.date);',
    )
    app_source = app_source.replace(
        '''function pitcherByName(pitchers, name) {
  const wanted = normalizeName(name);
  return pitchers.find((pitcher) => normalizeName(pitcher.name) === wanted) || pitchers[0];
}
''',
        '''function pitcherByName(pitchers, name) {
  const wanted = normalizeName(name);
  return pitchers.find((pitcher) => normalizeName(pitcher.name) === wanted) || pitchers[0];
}

function pitcherRunPreventionEra(arm, fallbackEra = 4.15) {
  const sourced = arm?.runPreventionEra ?? arm?.xera ?? arm?.era;
  const value = Number(sourced);
  return Number.isFinite(value) && value > 0 ? value : Number(fallbackEra || 4.15);
}
''',
    )
    app_source = app_source.replace(
        'const starterFactor = Number(opposingPitcher?.xera || 4.2) / pitchBase;',
        'const starterFactor = pitcherRunPreventionEra(opposingPitcher, pitchBase) / pitchBase;',
    )
    app_source = app_source.replace(
        'const sFac = Number(oppPitcher?.xera || 4.2) / leagueRpg;',
        'const sFac = pitcherRunPreventionEra(oppPitcher, leagueEra) / leagueEra;',
    )
    app_source = app_source.replace(
        'oppStarterWeak: (Number(oppArm?.xera || 4.2) / leagueRpg) - 1,',
        'oppStarterWeak: (pitcherRunPreventionEra(oppArm, leagueEra) / leagueEra) - 1,',
    )
    app_source = app_source.replace(
        'starterQuality: 1 - (Number(ownArm?.xera || 4.2) / leagueRpg),',
        'starterQuality: 1 - (pitcherRunPreventionEra(ownArm, leagueEra) / leagueEra),',
    )
    app_source = app_source.replace(
        '<div className="subline">Slate {data.date || ""} · {games.length} games · pitch-type weighted model</div>',
        '<div className="subline">Slate {data.date || ""} · {games.length} games · {pitchers.length} pitchers · {data.sourceTables?.pitchTypeDamageRows || 0} pitch-type rows</div>',
    )
    app_source = app_source.replace(
        '''          <div className="projection-strip">
            <div><span>{awayTeam} runs</span><strong>{model.awayRuns.toFixed(2)}</strong></div>
            <div><span>{homeTeam} runs</span><strong>{model.homeRuns.toFixed(2)}</strong></div>
            <div><span>Game total</span><strong>{(model.awayRuns + model.homeRuns).toFixed(1)}</strong></div>
            <div><span>F5 total</span><strong>{(model.f5Away + model.f5Home).toFixed(1)}</strong></div>
          </div>''',
        '''          <div className="projection-strip">
            <div><span>{awayTeam} runs</span><strong>{model.awayRuns.toFixed(2)}</strong></div>
            <div><span>{homeTeam} runs</span><strong>{model.homeRuns.toFixed(2)}</strong></div>
            <div><span>Game total</span><strong>{(model.awayRuns + model.homeRuns).toFixed(1)}</strong></div>
            <div><span>F5 total</span><strong>{(model.f5Away + model.f5Home).toFixed(1)}</strong></div>
          </div>
          {selectedGame?.context ? (() => {
            const ctx = selectedGame.context || {};
            const awLu = ctx.lineups?.away?.status === "confirmed";
            const hmLu = ctx.lineups?.home?.status === "confirmed";
            const lineupText = awLu && hmLu ? "Lineups confirmed" : "Lineups pending";
            const wx = ctx.weather || {};
            const weatherText = wx.source ? [wx.temp, wx.condition, wx.wind].filter(Boolean).join(" · ") : "Weather unavailable";
            const umpText = ctx.umpire?.home_plate || "Umpire pending";
            return (
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", padding: "8px 14px", borderTop: "1px solid #e7ecf1", color: "#667386", fontSize: 11.5 }}>
                <strong style={{ color: "#18212f" }}>Context</strong>
                <span>{lineupText}</span>
                <span>{weatherText}</span>
                <span>{umpText}</span>
                <span>{awayTeam} pen {awayBullpen} / {homeTeam} pen {homeBullpen}</span>
              </div>
            );
          })() : null}''',
    )
    app_source = app_source.replace(
        '''    setAwayPitcher(aMatch?.name || firstArm(game.away, pool));
    setHomePitcher(hMatch?.name || firstArm(game.home, pool));''',
        '''    setAwayPitcher(aMatch?.name || firstArm(game.away, pool));
    setHomePitcher(hMatch?.name || firstArm(game.home, pool));
    if (["fresh", "normal", "taxed"].includes(game.awayBullpenStatus)) setAwayBullpen(game.awayBullpenStatus);
    if (["fresh", "normal", "taxed"].includes(game.homeBullpenStatus)) setHomeBullpen(game.homeBullpenStatus);''',
    )
    app_source = app_source.replace(
        '{row("xERA", Number(arm.xera).toFixed(2))}',
        '{row(arm.xera != null ? "xERA" : arm.era != null ? "ERA" : "Run prevention", arm.xera != null ? Number(arm.xera).toFixed(2) : arm.era != null ? Number(arm.era).toFixed(2) : "neutral")}',
    )
    app_source = app_source.replace(
        '{row("K%", `${Number(arm.k).toFixed(1)}%`)}',
        '{row("K%", arm.k != null ? `${Number(arm.k).toFixed(1)}%` : "—")}',
    )
    app_source = app_source.replace(
        '{row("BB%", `${Number(arm.bb ?? 0).toFixed(1)}%`)}',
        '{row("BB%", arm.bb != null ? `${Number(arm.bb).toFixed(1)}%` : "—")}',
    )
    app_source = app_source.replace(
        '{row("BB%", arm.bb != null ? `${Number(arm.bb).toFixed(1)}%` : "—")}',
        '{row("BB%", arm.bb != null ? `${Number(arm.bb).toFixed(1)}%` : "—")}\n      {arm.avgStartPitches != null ? row("Avg start", `${Number(arm.ip ?? 0).toFixed(1)} IP · ${Number(arm.avgStartPitches).toFixed(0)} pit`) : null}\n      {arm.chaseGenerated != null ? row("Chase gen", `${(Number(arm.chaseGenerated) * 100).toFixed(1)}%`) : null}\n      {arm.swingingStrikeRate != null ? row("SwStr", `${(Number(arm.swingingStrikeRate) * 100).toFixed(1)}%`) : null}\n      {arm.barrelAllowed != null ? row("Barrel allowed", `${(Number(arm.barrelAllowed) * 100).toFixed(1)}%`) : null}',
    )
    app_source = app_source.replace(
        '              <span><strong>{m.u}%</strong>{m.v ? <span style={{ color: "#8793a2" }}> · {m.v}</span> : null}</span>',
        '              <span><strong>{m.u}%</strong>{m.slg != null ? <span style={{ color: "#8793a2" }}> · .{String(Math.round(Number(m.slg) * 1000)).padStart(3, "0")} SLG</span> : null}{m.v ? <span style={{ color: "#8793a2" }}> · {m.v}</span> : null}</span>',
    )
    app_source = app_source.replace(
        '  _chaseBase = { usage: mean(us), usageSd: sd(us), chase: mean(ch), chaseSd: sd(ch), cc: mean(cc), ccSd: sd(cc) };',
        '  const cg = arms.map((p) => Number(p.chaseGenerated) * 100).filter((x) => x > 0);\n  const oz = arms.map((p) => Number(p.outOfZoneWhiffRate) * 100).filter((x) => x > 0);\n  const zw = arms.map((p) => Number(p.zoneWhiffRate) * 100).filter((x) => x > 0);\n  _chaseBase = { usage: mean(us), usageSd: sd(us), chase: mean(ch), chaseSd: sd(ch), cc: mean(cc), ccSd: sd(cc), gen: mean(cg), genSd: sd(cg), ozWhiff: mean(oz), ozWhiffSd: sd(oz), zoneWhiff: mean(zw), zoneWhiffSd: sd(zw) };',
    )
    app_source = app_source.replace(
        '  const u = chasePitchUsage(arm);\n  if (u == null) return null;\n  const b = chaseBaselines(data);\n  const zUsage = (u - b.usage) / b.usageSd;\n  return clamp(zUsage, -CHASE_RELIANCE_CLIP, CHASE_RELIANCE_CLIP);',
        '  const b = chaseBaselines(data);\n  if (arm.chaseRelianceScore != null) return clamp(Number(arm.chaseRelianceScore), -CHASE_RELIANCE_CLIP, CHASE_RELIANCE_CLIP);\n  if (arm.chaseGenerated != null && b.genSd) {\n    const genZ = (Number(arm.chaseGenerated) * 100 - b.gen) / b.genSd;\n    const ozZ = arm.outOfZoneWhiffRate != null && b.ozWhiffSd ? (Number(arm.outOfZoneWhiffRate) * 100 - b.ozWhiff) / b.ozWhiffSd : 0;\n    const zoneZ = arm.zoneWhiffRate != null && b.zoneWhiffSd ? (Number(arm.zoneWhiffRate) * 100 - b.zoneWhiff) / b.zoneWhiffSd : 0;\n    return clamp(0.60 * genZ + 0.30 * ozZ - 0.10 * zoneZ, -CHASE_RELIANCE_CLIP, CHASE_RELIANCE_CLIP);\n  }\n  const u = chasePitchUsage(arm);\n  if (u == null) return null;\n  const zUsage = (u - b.usage) / b.usageSd;\n  return clamp(zUsage, -CHASE_RELIANCE_CLIP, CHASE_RELIANCE_CLIP);',
    )
    app_source = app_source.replace(
        '    genIsProxy: true  // arsenal-usage proxy; swap in real chase-generated rate when available',
        '    genIsProxy: opposingPitcher?.chaseGenerated == null  // false when real pitcher chase-generation data is loaded',
    )
    app_source = app_source.replace(
        'markets: "h2h,spreads,totals",',
        'markets: "h2h,spreads,totals,team_totals,pitcher_strikeouts",',
    )
    app_source = app_source.replace(
        '''        if (market.key === "spreads") {
          market.outcomes.forEach((outcome) => {
            const name = normalizeName(outcome.name);
            if (name.includes(homeName) || homeName.includes(name)) {
              setHomeSpread(outcome.point);
              nextOdds.homeRunline = outcome.price;
            }
            if (name.includes(awayName) || awayName.includes(name)) nextOdds.awayRunline = outcome.price;
          });
        }''',
        '''        if (market.key === "spreads") {
          market.outcomes.forEach((outcome) => {
            const name = normalizeName(outcome.name);
            if (name.includes(homeName) || homeName.includes(name)) {
              setHomeSpread(outcome.point);
              nextOdds.homeRunline = outcome.price;
            }
            if (name.includes(awayName) || awayName.includes(name)) nextOdds.awayRunline = outcome.price;
          });
        }
        if (market.key === "team_totals") {
          market.outcomes.forEach((outcome) => {
            const teamDesc = normalizeName(outcome.description || outcome.name);
            const sideName = normalizeName(outcome.name);
            const awayLine = Number(totalLine) / 2 - 0.25;
            const homeLine = Number(totalLine) / 2 + 0.25;
            if (sideName === "over" && Math.abs(Number(outcome.point) - awayLine) < 0.01 && (teamDesc.includes(awayName) || awayName.includes(teamDesc))) nextOdds.awayTT = outcome.price;
            if (sideName === "over" && Math.abs(Number(outcome.point) - homeLine) < 0.01 && (teamDesc.includes(homeName) || homeName.includes(teamDesc))) nextOdds.homeTT = outcome.price;
          });
        }
        if (market.key === "pitcher_strikeouts") {
          market.outcomes.forEach((outcome) => {
            const player = normalizeName(outcome.description || "");
            const sideName = normalizeName(outcome.name);
            if (player && normalizeName(model.awayArm?.name || "").includes(player)) {
              if (outcome.point != null) setKLineAway(outcome.point);
              if (sideName === "over") nextOdds.kAway = outcome.price;
              if (sideName === "under") nextOdds.kAwayU = outcome.price;
            }
            if (player && normalizeName(model.homeArm?.name || "").includes(player)) {
              if (outcome.point != null) setKLineHome(outcome.point);
              if (sideName === "over") nextOdds.kHome = outcome.price;
              if (sideName === "under") nextOdds.kHomeU = outcome.price;
            }
          });
        }
        // Customer view intentionally excludes alternate pitcher markets and
        // pitcher-win prices. Starter K props are the only pitcher prop pulled
        // from live odds here.''',
    )
    app_source, damage_panel_replacements = re.subn(
        r'function DamagePanel\(\{ report, awayTeam, homeTeam, awayArm, homeArm \}\) \{.*?\n\}\n\nfunction DisciplinePanel',
        HIDDEN_DAMAGE_PANEL + "\n\nfunction DisciplinePanel",
        app_source,
        count=1,
        flags=re.S,
    )
    if damage_panel_replacements != 1:
        raise RuntimeError("Could not replace verbose DamagePanel")
    app_source, discipline_panel_replacements = re.subn(
        r'function DisciplinePanel\(\{ report, awayTeam, homeTeam, awayArm, homeArm \}\) \{.*?\n\}\n\nfunction KMechanismPanel',
        HIDDEN_DISCIPLINE_PANEL + "\n\nfunction KMechanismPanel",
        app_source,
        count=1,
        flags=re.S,
    )
    if discipline_panel_replacements != 1:
        raise RuntimeError("Could not replace verbose DisciplinePanel")
    app_source, k_panel_replacements = re.subn(
        r'function KMechanismPanel\(\{ arm, mech, oppTeam, oppAbbr, rawK, adjK, kConv, finalK, projK, bf \}\) \{.*?\n\}\n\nfunction KProp',
        HIDDEN_K_MECHANISM_PANEL + "\n\nfunction KProp",
        app_source,
        count=1,
        flags=re.S,
    )
    if k_panel_replacements != 1:
        raise RuntimeError("Could not replace verbose KMechanismPanel")
    noisy_calls = [
        '              <DisciplinePanel report={model.disciplineReport} awayTeam={awayTeam} homeTeam={homeTeam} awayArm={model.awayArm} homeArm={model.homeArm} />\n',
        '              <DamagePanel report={model.damageReport} awayTeam={awayTeam} homeTeam={homeTeam} awayArm={model.awayArm} homeArm={model.homeArm} />\n',
        '      <KMechanismPanel arm={arm} mech={mech} oppTeam={oppTeam} oppAbbr={oppAbbr} rawK={rawK} adjK={adjK} kConv={kConv} finalK={finalK} projK={projK} bf={bf} />\n',
    ]
    for call in noisy_calls:
        app_source = app_source.replace(call, "")
    current_app_path = SRC_DIR / "App.jsx"
    current_app = current_app_path.read_text(encoding="utf-8") if current_app_path.exists() else ""
    if "CUSTOMER_BOARD_SAFE" in current_app:
        # The maintained customer board intentionally contains no client-side
        # model inputs or formula implementation.
        pass
    elif "Odds API key" in current_app and "derivedTeamTotalLines" in current_app:
        # Preserve the maintained frontend. Data refreshes still update diamond_data.json,
        # which the app loads at runtime.
        pass
    else:
        current_app_path.write_text(app_source, encoding="utf-8")

    print(
        json.dumps(
            {
                "pitchers": len(pitchers),
                "games": len(games),
                "pitch_type_rows": len(pitch_types),
                "chase_rows": len(chase),
                "bullpen_rows": len(bullpen),
                "starter_rows": len(starters),
                "customer_games": len(customer_board["games"]),
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
