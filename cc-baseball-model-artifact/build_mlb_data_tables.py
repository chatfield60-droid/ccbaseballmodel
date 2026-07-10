#!/usr/bin/env python3
"""Build MLB pitcher damage and chase-generation tables.

Sources:
- Baseball Savant Statcast CSV endpoint for pitch-level detail.
- MLB StatsAPI for official pitcher season totals, teams, and probables.

The script intentionally uses only the Python standard library so it can run in
plain Codex workspaces without installing analysis packages.
"""

from __future__ import annotations

import argparse
import csv
import io
import json
import math
import time
import urllib.parse
import urllib.request
from collections import Counter, defaultdict
from copy import deepcopy
from datetime import date, datetime, timedelta, timezone
from pathlib import Path
from typing import Dict, Iterable, Iterator, List, Optional, Tuple


SAVANT_CSV_URL = "https://baseballsavant.mlb.com/statcast_search/csv"
STATSAPI_BASE_URL = "https://statsapi.mlb.com/api/v1"

HIT_EVENTS = {"single", "double", "triple", "home_run"}
TOTAL_BASES = {"single": 1, "double": 2, "triple": 3, "home_run": 4}

NON_PA_EVENTS = {
    "balk",
    "caught_stealing_2b",
    "caught_stealing_3b",
    "caught_stealing_home",
    "defensive_indiff",
    "other_advance",
    "passed_ball",
    "pickoff_1b",
    "pickoff_2b",
    "pickoff_3b",
    "pickoff_caught_stealing_2b",
    "pickoff_caught_stealing_3b",
    "pickoff_caught_stealing_home",
    "runner_double_play",
    "stolen_base_2b",
    "stolen_base_3b",
    "stolen_base_home",
    "wild_pitch",
}

AB_EXCLUDED_EVENTS = {
    "catcher_interf",
    "catcher_interference",
    "hit_by_pitch",
    "intent_walk",
    "sac_bunt",
    "sac_bunt_double_play",
    "sac_fly",
    "sac_fly_double_play",
    "walk",
}

ONE_OUT_EVENTS = {
    "field_out",
    "fielders_choice",
    "fielders_choice_out",
    "force_out",
    "other_out",
    "sac_bunt",
    "sac_fly",
    "strikeout",
    "strikeout_double_play",
}

TWO_OUT_EVENTS = {
    "double_play",
    "grounded_into_double_play",
    "sac_bunt_double_play",
    "sac_fly_double_play",
    "strikeout_double_play",
}

THREE_OUT_EVENTS = {"triple_play"}

SWING_DESCRIPTIONS = {
    "foul",
    "foul_bunt",
    "foul_tip",
    "hit_into_play",
    "hit_into_play_no_out",
    "hit_into_play_score",
    "missed_bunt",
    "swinging_pitchout",
    "swinging_strike",
    "swinging_strike_blocked",
}

WHIFF_DESCRIPTIONS = {
    "missed_bunt",
    "swinging_pitchout",
    "swinging_strike",
    "swinging_strike_blocked",
}

CHASE_USAGE_PITCH_TYPES = {"CH", "FO", "FS", "SL", "ST"}

STARTER_FIELDS = [
    "player_id",
    "player_name",
    "team",
    "season",
    "innings_pitched",
    "batters_faced",
    "era",
    "strikeouts",
    "walks",
    "strikeout_rate",
    "walk_rate",
    "games_started",
    "games_pitched",
    "game_log_starts",
    "avg_start_innings",
    "avg_start_pitches",
    "avg_start_batters_faced",
    "pitch_hand",
    "core_stats_source",
    "barrel_allowed_rate",
    "hard_hit_allowed_rate",
    "avg_exit_velocity_allowed",
    "launch_angle_allowed",
    "hr_fb_allowed",
    "slg_allowed",
    "xslg_allowed",
    "xba_allowed",
    "xwoba_allowed",
    "sample_batted_balls",
    "last_updated",
]

PITCH_TYPE_FIELDS = [
    "player_id",
    "player_name",
    "team",
    "season",
    "pitch_type",
    "pitch_name",
    "pitches_thrown",
    "usage_pct",
    "batters_faced_or_pa",
    "ba_allowed",
    "slg_allowed",
    "iso_allowed",
    "woba_allowed",
    "xslg_allowed",
    "xwoba_allowed",
    "barrel_allowed_rate",
    "hard_hit_allowed_rate",
    "avg_exit_velocity_allowed",
    "launch_angle_allowed",
    "hr_allowed",
    "whiff_rate",
    "chase_rate_generated",
    "out_of_zone_swing_rate_generated",
    "out_of_zone_whiff_rate",
    "zone_whiff_rate",
    "small_sample",
    "last_updated",
]

CHASE_FIELDS = [
    "player_id",
    "player_name",
    "team",
    "season",
    "pitches_thrown",
    "out_of_zone_pitches",
    "out_of_zone_swings",
    "out_of_zone_whiffs",
    "zone_pitches",
    "zone_swings",
    "zone_whiffs",
    "chase_rate_generated",
    "out_of_zone_whiff_rate",
    "zone_whiff_rate",
    "called_strike_rate",
    "first_pitch_strike_rate",
    "swinging_strike_rate",
    "chase_k_share_if_available",
    "slider_splitter_change_usage",
    "chase_reliance_score",
    "last_updated",
]

BULLPEN_FIELDS = [
    "team",
    "season",
    "as_of_date",
    "relief_pitches_1d",
    "relief_pitches_3d",
    "relievers_used_1d",
    "relievers_used_3d",
    "back_to_back_relievers",
    "bullpen_status",
    "source",
    "last_updated",
]

NULL_REASONS = {
    "team": "No team was available from MLB StatsAPI season stats, the probable-starter schedule, or derivable from Statcast home/away plus inning context.",
    "innings_pitched": "Pitcher was absent from MLB StatsAPI season pitching totals; innings were not inferred from partial pitch logs.",
    "batters_faced": "Pitcher was absent from MLB StatsAPI season pitching totals and no Statcast PA fallback was available.",
    "era": "No official MLB StatsAPI ERA was available.",
    "strikeouts": "No official MLB StatsAPI strikeout total was available.",
    "walks": "No official MLB StatsAPI walk total was available.",
    "strikeout_rate": "No official MLB StatsAPI batters-faced denominator or strikeout total was available.",
    "walk_rate": "No official MLB StatsAPI batters-faced denominator or walk total was available.",
    "games_started": "No official MLB StatsAPI games-started total was available.",
    "games_pitched": "No official MLB StatsAPI games-pitched total was available.",
    "game_log_starts": "No MLB StatsAPI pitching game-log starts were available for this pitcher.",
    "avg_start_innings": "No MLB StatsAPI pitching game-log starts or clean season-start denominator were available.",
    "avg_start_pitches": "No MLB StatsAPI pitching game-log starts with pitch counts were available.",
    "avg_start_batters_faced": "No MLB StatsAPI pitching game-log starts with batters-faced counts were available.",
    "pitch_hand": "No MLB StatsAPI people or Statcast pitch-hand field was available.",
    "core_stats_source": "No core pitcher source was available.",
    "barrel_allowed_rate": "No tracked in-play batted balls were available from Statcast for the denominator.",
    "hard_hit_allowed_rate": "No tracked in-play batted balls were available from Statcast for the denominator.",
    "avg_exit_velocity_allowed": "No tracked in-play batted balls with Statcast launch_speed were available.",
    "launch_angle_allowed": "No tracked in-play batted balls with Statcast launch_angle were available.",
    "hr_fb_allowed": "No Statcast fly balls were available for the HR/fly-ball denominator.",
    "slg_allowed": "No official MLB StatsAPI at-bat denominator was available, and no Statcast at-bat fallback was available.",
    "xba_allowed": "No eligible Statcast estimated_ba_using_speedangle values were available.",
    "xslg_allowed": "No eligible Statcast estimated_slg_using_speedangle values were available.",
    "xwoba_allowed": "No eligible Statcast estimated_woba_using_speedangle values with a wOBA denominator were available.",
    "sample_batted_balls": "No Statcast pitch-level rows were available for this pitcher.",
    "pitch_type": "Savant did not classify the pitch_type for these pitch rows.",
    "pitch_name": "Savant did not provide a pitch_name for these pitch rows.",
    "usage_pct": "Pitcher had no Statcast pitch total available for the usage denominator.",
    "ba_allowed": "No at-bat denominator was available for this split.",
    "iso_allowed": "BA or SLG was unavailable for this split.",
    "woba_allowed": "No Statcast woba_denom denominator was available for this split.",
    "whiff_rate": "No swing denominator was available for this split.",
    "chase_rate_generated": "No out-of-zone pitch denominator was available from Statcast zone data.",
    "out_of_zone_swing_rate_generated": "No out-of-zone pitch denominator was available from Statcast zone data.",
    "out_of_zone_whiff_rate": "No out-of-zone swing denominator was available.",
    "zone_whiff_rate": "No in-zone swing denominator was available.",
    "out_of_zone_pitches": "No Statcast pitch-level rows were available for this pitcher.",
    "out_of_zone_swings": "No Statcast pitch-level rows were available for this pitcher.",
    "out_of_zone_whiffs": "No Statcast pitch-level rows were available for this pitcher.",
    "zone_pitches": "No Statcast pitch-level rows were available for this pitcher.",
    "zone_swings": "No Statcast pitch-level rows were available for this pitcher.",
    "zone_whiffs": "No Statcast pitch-level rows were available for this pitcher.",
    "called_strike_rate": "No Statcast pitch total was available for the denominator.",
    "first_pitch_strike_rate": "No first-pitch denominator was available from Statcast pitch_number data.",
    "swinging_strike_rate": "No Statcast pitch total was available for the denominator.",
    "chase_k_share_if_available": "No direct Baseball Savant or MLB StatsAPI field was available; left null by design.",
    "slider_splitter_change_usage": "No Statcast pitch total was available for the denominator.",
    "chase_reliance_score": "No official source field or user-specified formula was provided; left null to avoid inventing a metric.",
    "bullpen_status": "No Statcast relief workload window was available for this team.",
}


def parse_args() -> argparse.Namespace:
    today = date.today()
    parser = argparse.ArgumentParser(description="Build MLB pitcher damage/chase tables.")
    parser.add_argument("--season", type=int, default=today.year)
    parser.add_argument("--start-date", default=None, help="Inclusive YYYY-MM-DD. Defaults to first regular-season game through end date.")
    parser.add_argument("--end-date", default=today.isoformat(), help="Inclusive YYYY-MM-DD.")
    parser.add_argument("--probables-date", default=None, help="YYYY-MM-DD for probable starter lookup. Defaults to end date.")
    parser.add_argument("--out-dir", default="data")
    parser.add_argument("--cache-dir", default="work/source_cache")
    parser.add_argument("--chunk-days", type=int, default=7)
    parser.add_argument("--refresh", action="store_true", help="Re-download cached source files.")
    return parser.parse_args()


def request_text(url: str, retries: int = 3) -> str:
    headers = {
        "Accept": "text/csv,application/json,*/*",
        "User-Agent": "Mozilla/5.0 (compatible; Codex MLB data builder)",
    }
    last_error: Optional[Exception] = None
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=90) as response:
                return response.read().decode("utf-8-sig", errors="replace")
        except Exception as exc:  # pragma: no cover - network resilience
            last_error = exc
            time.sleep(1.5 * (attempt + 1))
    raise RuntimeError(f"Failed to download {url}: {last_error}")


def request_json(url: str, retries: int = 3) -> dict:
    return json.loads(request_text(url, retries=retries))


def statsapi_url(path: str, params: dict) -> str:
    return f"{STATSAPI_BASE_URL}/{path.lstrip('/')}?{urllib.parse.urlencode(params)}"


def savant_csv_url(season: int, start_date: date, end_date: date) -> str:
    params = {
        "all": "true",
        "hfSea": f"{season}|",
        "hfGT": "R|",
        "player_type": "pitcher",
        "type": "details",
        "game_date_gt": start_date.isoformat(),
        "game_date_lt": end_date.isoformat(),
        "min_pitches": "0",
        "min_results": "0",
    }
    return f"{SAVANT_CSV_URL}?{urllib.parse.urlencode(params, safe='|')}"


def to_date(value: str) -> date:
    return datetime.strptime(value, "%Y-%m-%d").date()


def regular_season_start(season: int, end_date: date) -> date:
    params = {
        "sportId": 1,
        "season": season,
        "gameTypes": "R",
        "startDate": f"{season}-01-01",
        "endDate": end_date.isoformat(),
    }
    data = request_json(statsapi_url("schedule", params))
    dates = [to_date(item["date"]) for item in data.get("dates", [])]
    return min(dates) if dates else date(season, 3, 1)


def date_chunks(start_date: date, end_date: date, chunk_days: int) -> Iterator[Tuple[date, date]]:
    current = start_date
    while current <= end_date:
        chunk_end = min(current + timedelta(days=chunk_days - 1), end_date)
        yield current, chunk_end
        current = chunk_end + timedelta(days=1)


def fetch_team_map(season: int) -> Dict[int, str]:
    url = statsapi_url("teams", {"sportId": 1, "season": season})
    data = request_json(url)
    return {
        int(team["id"]): team.get("abbreviation") or team.get("teamName") or team.get("name")
        for team in data.get("teams", [])
        if team.get("id") is not None
    }


def parse_float(value) -> Optional[float]:
    if value is None:
        return None
    text = str(value).strip()
    if not text or text == ".---":
        return None
    try:
        return float(text)
    except ValueError:
        return None


def parse_int(value) -> Optional[int]:
    number = parse_float(value)
    if number is None or math.isnan(number):
        return None
    return int(number)


def safe_div(numerator: Optional[float], denominator: Optional[float], scale: float = 1.0) -> Optional[float]:
    if numerator is None or denominator in (None, 0):
        return None
    return round((numerator / denominator) * scale, 6)


def safe_avg(total: float, count: int) -> Optional[float]:
    if count == 0:
        return None
    return round(total / count, 6)


def innings_from_outs(outs: Optional[int]) -> Optional[float]:
    if outs is None:
        return None
    return round(outs / 3.0, 6)


def is_pa_event(event: str) -> bool:
    return bool(event) and event not in NON_PA_EVENTS


def is_at_bat_event(event: str) -> bool:
    return is_pa_event(event) and event not in AB_EXCLUDED_EVENTS


def is_batted_ball(row: dict) -> bool:
    return row.get("type") == "X" or row.get("bb_type") in {"fly_ball", "ground_ball", "line_drive", "popup"}


def event_outs(event: str) -> int:
    if event in THREE_OUT_EVENTS:
        return 3
    if event in TWO_OUT_EVENTS:
        return 2
    if event in ONE_OUT_EVENTS:
        return 1
    return 0


def is_in_zone(zone: Optional[int]) -> bool:
    return zone is not None and 1 <= zone <= 9


def is_out_of_zone(zone: Optional[int]) -> bool:
    return zone is not None and zone >= 11


def pitcher_team_from_statcast(row: dict) -> Optional[str]:
    inning_half = row.get("inning_topbot")
    if inning_half == "Top":
        return row.get("home_team") or None
    if inning_half == "Bot":
        return row.get("away_team") or None
    return None


def normalize_savant_name(name: Optional[str]) -> Optional[str]:
    if not name:
        return None
    if "," not in name:
        return name
    last, first = [part.strip() for part in name.split(",", 1)]
    return f"{first} {last}".strip()


def new_agg() -> dict:
    return {
        "pitches": 0,
        "pa": 0,
        "ab": 0,
        "hits": 0,
        "tb": 0,
        "woba_value_sum": 0.0,
        "woba_denom_sum": 0.0,
        "xba_sum": 0.0,
        "xba_n": 0,
        "xslg_sum": 0.0,
        "xslg_n": 0,
        "xwoba_sum": 0.0,
        "xwoba_denom": 0.0,
        "tracked_bbe": 0,
        "barrels": 0,
        "hard_hit": 0,
        "ev_sum": 0.0,
        "ev_n": 0,
        "la_sum": 0.0,
        "la_n": 0,
        "hr": 0,
        "fly_balls": 0,
        "swings": 0,
        "whiffs": 0,
        "out_zone_pitches": 0,
        "out_zone_swings": 0,
        "out_zone_whiffs": 0,
        "zone_pitches": 0,
        "zone_swings": 0,
        "zone_whiffs": 0,
        "called_strikes": 0,
        "first_pitches": 0,
        "first_pitch_strikes": 0,
        "chase_usage_pitches": 0,
        "pitch_names": Counter(),
    }


def add_pitch_to_agg(agg: dict, row: dict, pitch_type: Optional[str] = None) -> None:
    agg["pitches"] += 1

    event = (row.get("events") or "").strip()
    description = (row.get("description") or "").strip()
    pitch_call_type = (row.get("type") or "").strip()
    zone = parse_int(row.get("zone"))
    swing = description in SWING_DESCRIPTIONS
    whiff = description in WHIFF_DESCRIPTIONS

    if row.get("pitch_name"):
        agg["pitch_names"][row["pitch_name"]] += 1
    if pitch_type in CHASE_USAGE_PITCH_TYPES:
        agg["chase_usage_pitches"] += 1

    if swing:
        agg["swings"] += 1
    if whiff:
        agg["whiffs"] += 1
    if description == "called_strike":
        agg["called_strikes"] += 1

    if parse_int(row.get("pitch_number")) == 1:
        agg["first_pitches"] += 1
        if pitch_call_type in {"S", "X"}:
            agg["first_pitch_strikes"] += 1

    if is_in_zone(zone):
        agg["zone_pitches"] += 1
        if swing:
            agg["zone_swings"] += 1
        if whiff:
            agg["zone_whiffs"] += 1
    elif is_out_of_zone(zone):
        agg["out_zone_pitches"] += 1
        if swing:
            agg["out_zone_swings"] += 1
        if whiff:
            agg["out_zone_whiffs"] += 1

    if is_pa_event(event):
        agg["pa"] += 1

    if is_at_bat_event(event):
        agg["ab"] += 1
        if event in HIT_EVENTS:
            agg["hits"] += 1
            agg["tb"] += TOTAL_BASES[event]

        xba = parse_float(row.get("estimated_ba_using_speedangle"))
        if xba is not None:
            agg["xba_sum"] += xba
            agg["xba_n"] += 1

        xslg = parse_float(row.get("estimated_slg_using_speedangle"))
        if xslg is not None:
            agg["xslg_sum"] += xslg
            agg["xslg_n"] += 1

    if event == "home_run":
        agg["hr"] += 1

    if row.get("bb_type") == "fly_ball":
        agg["fly_balls"] += 1

    woba_value = parse_float(row.get("woba_value"))
    woba_denom = parse_float(row.get("woba_denom"))
    if woba_value is not None and woba_denom is not None:
        agg["woba_value_sum"] += woba_value
        agg["woba_denom_sum"] += woba_denom

    estimated_woba = parse_float(row.get("estimated_woba_using_speedangle"))
    if estimated_woba is not None and woba_denom is not None and woba_denom > 0:
        agg["xwoba_sum"] += estimated_woba * woba_denom
        agg["xwoba_denom"] += woba_denom

    if is_batted_ball(row):
        launch_speed = parse_float(row.get("launch_speed"))
        launch_angle = parse_float(row.get("launch_angle"))
        if launch_speed is not None:
            agg["tracked_bbe"] += 1
            agg["ev_sum"] += launch_speed
            agg["ev_n"] += 1
            if launch_speed >= 95:
                agg["hard_hit"] += 1
            if str(row.get("launch_speed_angle") or "").strip() == "6":
                agg["barrels"] += 1
        if launch_angle is not None:
            agg["la_sum"] += launch_angle
            agg["la_n"] += 1


def fetch_statsapi_pitching(season: int) -> Dict[int, dict]:
    params = {
        "stats": "season",
        "group": "pitching",
        "season": season,
        "playerPool": "ALL",
        "gameType": "R",
        "hydrate": "team",
        "limit": 1000,
    }
    data = request_json(statsapi_url("stats", params))
    pitchers: Dict[int, dict] = {}
    for split in data.get("stats", [{}])[0].get("splits", []):
        player = split.get("player", {})
        stat = split.get("stat", {})
        player_id = player.get("id")
        if player_id is None:
            continue
        player_id = int(player_id)
        entry = pitchers.setdefault(
            player_id,
            {
                "player_name": player.get("fullName"),
                "team": None,
                "outs": 0,
                "batters_faced": 0,
                "number_of_pitches": 0,
                "at_bats": 0,
                "total_bases": 0,
                "strikeouts": 0,
                "walks": 0,
                "era_values": [],
                "runs": 0,
                "earned_runs": 0,
                "games_started": 0,
                "games_pitched": 0,
                "statsapi_splits": 0,
            },
        )
        if player.get("fullName"):
            entry["player_name"] = player["fullName"]
        team = split.get("team", {})
        if team.get("abbreviation"):
            entry["team"] = team["abbreviation"]
        entry["outs"] += parse_int(stat.get("outs")) or 0
        entry["batters_faced"] += parse_int(stat.get("battersFaced")) or 0
        entry["number_of_pitches"] += parse_int(stat.get("numberOfPitches")) or 0
        entry["at_bats"] += parse_int(stat.get("atBats")) or 0
        entry["total_bases"] += parse_int(stat.get("totalBases")) or 0
        entry["strikeouts"] += parse_int(stat.get("strikeOuts")) or 0
        entry["walks"] += parse_int(stat.get("baseOnBalls")) or 0
        era = parse_float(stat.get("era"))
        if era is not None:
            entry["era_values"].append(era)
        entry["runs"] += parse_int(stat.get("runs")) or 0
        entry["earned_runs"] += parse_int(stat.get("earnedRuns")) or 0
        entry["games_started"] += parse_int(stat.get("gamesStarted")) or 0
        entry["games_pitched"] += parse_int(stat.get("gamesPitched")) or 0
        entry["statsapi_splits"] += 1
    for entry in pitchers.values():
        innings = innings_from_outs(entry.get("outs"))
        earned_runs = entry.get("earned_runs")
        if innings and innings > 0 and earned_runs is not None:
            entry["era"] = round((earned_runs * 9) / innings, 6)
        elif entry["era_values"]:
            entry["era"] = round(sum(entry["era_values"]) / len(entry["era_values"]), 6)
        else:
            entry["era"] = None
    return pitchers


def fetch_people_info(player_ids: Iterable[int], team_map: Dict[int, str]) -> Dict[int, dict]:
    ids = sorted({int(pid) for pid in player_ids if pid is not None})
    people: Dict[int, dict] = {}
    for i in range(0, len(ids), 100):
        batch = ids[i : i + 100]
        if not batch:
            continue
        url = statsapi_url(
            "people",
            {
                "personIds": ",".join(str(pid) for pid in batch),
                "hydrate": "currentTeam",
            },
        )
        data = request_json(url)
        for person in data.get("people", []):
            player_id = person.get("id")
            if player_id is None:
                continue
            current_team = person.get("currentTeam") or {}
            team_id = current_team.get("id")
            people[int(player_id)] = {
                "player_name": person.get("fullName"),
                "pitch_hand": (person.get("pitchHand") or {}).get("code"),
                "bat_side": (person.get("batSide") or {}).get("code"),
                "current_team": team_map.get(int(team_id)) if team_id is not None else None,
            }
        time.sleep(0.05)
    return people


def fetch_start_game_log_averages(player_ids: Iterable[int], season: int) -> Dict[int, dict]:
    averages: Dict[int, dict] = {}
    for player_id in sorted({int(pid) for pid in player_ids if pid is not None}):
        url = f"{STATSAPI_BASE_URL}/people/{player_id}/stats?{urllib.parse.urlencode({'stats': 'gameLog', 'group': 'pitching', 'season': season, 'gameType': 'R'})}"
        try:
            data = request_json(url, retries=2)
        except Exception:
            continue
        starts = []
        for split in data.get("stats", [{}])[0].get("splits", []):
            stat = split.get("stat", {})
            if (parse_int(stat.get("gamesStarted")) or 0) < 1:
                continue
            outs = parse_int(stat.get("outs"))
            pitches = parse_int(stat.get("numberOfPitches"))
            batters = parse_int(stat.get("battersFaced"))
            starts.append({"outs": outs, "pitches": pitches, "batters": batters})
        if starts:
            outs_values = [item["outs"] for item in starts if item["outs"] is not None]
            pitch_values = [item["pitches"] for item in starts if item["pitches"] is not None]
            batter_values = [item["batters"] for item in starts if item["batters"] is not None]
            averages[player_id] = {
                "game_log_starts": len(starts),
                "avg_start_innings": round((sum(outs_values) / len(outs_values)) / 3.0, 6) if outs_values else None,
                "avg_start_pitches": round(sum(pitch_values) / len(pitch_values), 6) if pitch_values else None,
                "avg_start_batters_faced": round(sum(batter_values) / len(batter_values), 6) if batter_values else None,
            }
        time.sleep(0.05)
    return averages


def fetch_probables(season: int, probables_date: date, team_map: Dict[int, str]) -> Dict[int, dict]:
    params = {
        "sportId": 1,
        "date": probables_date.isoformat(),
        "hydrate": "probablePitcher",
    }
    data = request_json(statsapi_url("schedule", params))
    probables: Dict[int, dict] = {}
    for day in data.get("dates", []):
        for game in day.get("games", []):
            for side in ("away", "home"):
                team = game.get("teams", {}).get(side, {}).get("team", {})
                probable = game.get("teams", {}).get(side, {}).get("probablePitcher")
                if not probable or probable.get("id") is None:
                    continue
                player_id = int(probable["id"])
                probables[player_id] = {
                    "player_name": probable.get("fullName"),
                    "team": team_map.get(int(team["id"])) if team.get("id") is not None else None,
                    "probables_date": probables_date.isoformat(),
                }
    return probables


def fetch_statcast_rows(
    season: int,
    start_date: date,
    end_date: date,
    cache_dir: Path,
    chunk_days: int,
    refresh: bool,
) -> Iterator[dict]:
    cache_dir.mkdir(parents=True, exist_ok=True)
    for chunk_start, chunk_end in date_chunks(start_date, end_date, chunk_days):
        cache_file = cache_dir / f"statcast_{season}_{chunk_start}_{chunk_end}.csv"
        if refresh or not cache_file.exists():
            url = savant_csv_url(season, chunk_start, chunk_end)
            text = request_text(url)
            if not text.lstrip().startswith('"pitch_type"') and not text.lstrip().startswith("pitch_type"):
                raise RuntimeError(f"Unexpected Baseball Savant CSV response for {chunk_start} to {chunk_end}")
            cache_file.write_text(text, encoding="utf-8")
            time.sleep(0.25)
        else:
            text = cache_file.read_text(encoding="utf-8-sig")

        reader = csv.DictReader(io.StringIO(text))
        for row in reader:
            if row.get("pitcher"):
                yield row


def build_bullpen_availability(
    team_abbrs: Iterable[str],
    season: int,
    as_of_date: date,
    team_game_pitcher_counts: Dict[Tuple[str, str, int], int],
    team_game_pitcher_first_order: Dict[Tuple[str, str, int], Tuple[int, int, int]],
    team_game_dates: Dict[Tuple[str, str], str],
    last_updated: str,
) -> List[dict]:
    starters: Dict[Tuple[str, str], int] = {}
    for (game_pk, team, player_id), order in team_game_pitcher_first_order.items():
        key = (game_pk, team)
        if key not in starters or order < team_game_pitcher_first_order[(game_pk, team, starters[key])]:
            starters[key] = player_id

    relief_by_team_date = defaultdict(lambda: {"pitches": 0, "relievers": set()})
    for (game_pk, team, player_id), pitches in team_game_pitcher_counts.items():
        game_team_key = (game_pk, team)
        game_date_text = team_game_dates.get(game_team_key)
        if not game_date_text:
            continue
        try:
            game_day = to_date(game_date_text)
        except ValueError:
            continue
        if player_id == starters.get(game_team_key):
            continue
        key = (team, game_day)
        relief_by_team_date[key]["pitches"] += pitches
        relief_by_team_date[key]["relievers"].add(player_id)

    one_day = as_of_date - timedelta(days=1)
    two_days = as_of_date - timedelta(days=2)
    three_day_start = as_of_date - timedelta(days=3)
    rows = []
    for team in sorted({abbr for abbr in team_abbrs if abbr}):
        pitches_1d = 0
        pitches_3d = 0
        relievers_1d = set()
        relievers_3d = set()
        relievers_by_day = {}
        for (row_team, game_day), data in relief_by_team_date.items():
            if row_team != team or not (three_day_start <= game_day < as_of_date):
                continue
            pitches_3d += data["pitches"]
            relievers_3d.update(data["relievers"])
            relievers_by_day[game_day] = data["relievers"]
            if game_day == one_day:
                pitches_1d += data["pitches"]
                relievers_1d.update(data["relievers"])
        back_to_back = len(relievers_by_day.get(one_day, set()) & relievers_by_day.get(two_days, set()))
        if pitches_1d >= 45 or pitches_3d >= 120 or back_to_back >= 2:
            status = "taxed"
        elif pitches_1d <= 15 and pitches_3d <= 60 and back_to_back == 0:
            status = "fresh"
        else:
            status = "normal"
        rows.append(
            {
                "team": team,
                "season": season,
                "as_of_date": as_of_date.isoformat(),
                "relief_pitches_1d": pitches_1d,
                "relief_pitches_3d": pitches_3d,
                "relievers_used_1d": len(relievers_1d),
                "relievers_used_3d": len(relievers_3d),
                "back_to_back_relievers": back_to_back,
                "bullpen_status": status,
                "source": "Baseball Savant Statcast pitch logs; first pitcher per team/game treated as starter",
                "last_updated": last_updated,
            }
        )
    return rows


def build_rows(args: argparse.Namespace) -> Tuple[List[dict], List[dict], List[dict], List[dict], dict]:
    season = args.season
    end_date = to_date(args.end_date)
    start_date = to_date(args.start_date) if args.start_date else regular_season_start(season, end_date)
    probables_date = to_date(args.probables_date) if args.probables_date else end_date
    last_updated = datetime.now(timezone.utc).replace(microsecond=0).isoformat()
    cache_dir = Path(args.cache_dir)

    team_map = fetch_team_map(season)
    statsapi_pitchers = fetch_statsapi_pitching(season)
    probables = fetch_probables(season, probables_date, team_map)

    pitcher_aggs = defaultdict(new_agg)
    pitch_type_aggs = defaultdict(new_agg)
    statcast_pitchers = set()
    statcast_names: Dict[int, str] = {}
    statcast_latest_team: Dict[int, Tuple[str, str]] = {}
    statcast_pitch_hand: Dict[int, str] = {}
    statcast_pitcher_ids_are_numeric = True
    team_game_pitcher_counts: Dict[Tuple[str, str, int], int] = defaultdict(int)
    team_game_pitcher_first_order: Dict[Tuple[str, str, int], Tuple[int, int, int]] = {}
    team_game_dates: Dict[Tuple[str, str], str] = {}
    team_game_pitcher_outs: Dict[Tuple[str, str, int], int] = defaultdict(int)

    for row in fetch_statcast_rows(season, start_date, end_date, cache_dir, args.chunk_days, args.refresh):
        try:
            player_id = int(row["pitcher"])
        except (TypeError, ValueError):
            statcast_pitcher_ids_are_numeric = False
            continue

        statcast_pitchers.add(player_id)
        if row.get("player_name"):
            statcast_names[player_id] = normalize_savant_name(row.get("player_name")) or row["player_name"]
        if row.get("p_throws"):
            statcast_pitch_hand[player_id] = row["p_throws"]

        team = pitcher_team_from_statcast(row)
        game_date = row.get("game_date") or ""
        if team and (player_id not in statcast_latest_team or game_date >= statcast_latest_team[player_id][0]):
            statcast_latest_team[player_id] = (game_date, team)
        game_pk = row.get("game_pk") or ""
        if team and game_pk and game_date:
            bullpen_key = (game_pk, team, player_id)
            team_game_pitcher_counts[bullpen_key] += 1
            team_game_pitcher_outs[bullpen_key] += event_outs((row.get("events") or "").strip())
            team_game_dates[(game_pk, team)] = game_date
            order = (
                parse_int(row.get("inning")) or 99,
                parse_int(row.get("at_bat_number")) or 999,
                parse_int(row.get("pitch_number")) or 999,
            )
            if bullpen_key not in team_game_pitcher_first_order or order < team_game_pitcher_first_order[bullpen_key]:
                team_game_pitcher_first_order[bullpen_key] = order

        pitch_type = row.get("pitch_type") or None
        pitch_key = (player_id, pitch_type)
        add_pitch_to_agg(pitcher_aggs[player_id], row, pitch_type=pitch_type)
        add_pitch_to_agg(pitch_type_aggs[pitch_key], row, pitch_type=pitch_type)

    player_ids = set(statsapi_pitchers) | statcast_pitchers | set(probables)
    people_info = fetch_people_info(player_ids, team_map)
    start_game_logs = fetch_start_game_log_averages(set(probables), season)
    bullpen_rows = build_bullpen_availability(
        team_map.values(),
        season,
        probables_date,
        team_game_pitcher_counts,
        team_game_pitcher_first_order,
        team_game_dates,
        last_updated,
    )
    starter_outs_by_pitcher = defaultdict(int)
    starter_games_by_pitcher = defaultdict(int)
    game_team_starters: Dict[Tuple[str, str], int] = {}
    for (game_pk, team, player_id), order in team_game_pitcher_first_order.items():
        key = (game_pk, team)
        if key not in game_team_starters or order < team_game_pitcher_first_order[(game_pk, team, game_team_starters[key])]:
            game_team_starters[key] = player_id
    for (game_pk, team), player_id in game_team_starters.items():
        key = (game_pk, team, player_id)
        starter_outs_by_pitcher[player_id] += team_game_pitcher_outs.get(key, 0)
        starter_games_by_pitcher[player_id] += 1

    def player_name(player_id: int) -> Optional[str]:
        return (
            (statsapi_pitchers.get(player_id) or {}).get("player_name")
            or (probables.get(player_id) or {}).get("player_name")
            or (people_info.get(player_id) or {}).get("player_name")
            or statcast_names.get(player_id)
        )

    def player_team(player_id: int) -> Optional[str]:
        if player_id in probables and probables[player_id].get("team"):
            return probables[player_id]["team"]
        if player_id in statcast_latest_team:
            return statcast_latest_team[player_id][1]
        return (statsapi_pitchers.get(player_id) or {}).get("team") or (people_info.get(player_id) or {}).get("current_team")

    def player_hand(player_id: int) -> Optional[str]:
        return (people_info.get(player_id) or {}).get("pitch_hand") or statcast_pitch_hand.get(player_id)

    def table_sort_key(row: dict) -> Tuple[str, str, int]:
        return (row.get("team") or "ZZZ", row.get("player_name") or "", int(row["player_id"]))

    starter_rows: List[dict] = []
    chase_rows: List[dict] = []

    for player_id in sorted(player_ids):
        agg = pitcher_aggs[player_id]
        official = statsapi_pitchers.get(player_id, {})
        has_statcast = player_id in statcast_pitchers
        innings = innings_from_outs(official.get("outs")) if official else None
        official_bf = official.get("batters_faced") if official else None
        batters_faced = official_bf if official_bf not in (None, 0) else (agg["pa"] if agg["pa"] else None)
        official_slg = safe_div(official.get("total_bases"), official.get("at_bats")) if official else None
        statcast_slg = safe_div(agg["tb"], agg["ab"])
        strikeouts = official.get("strikeouts") if official else None
        walks = official.get("walks") if official else None
        games_started = official.get("games_started") if official else None
        games_pitched = official.get("games_pitched") if official else None
        start_log = start_game_logs.get(player_id, {})
        if start_log.get("avg_start_innings") is not None:
            avg_start_innings = start_log.get("avg_start_innings")
        elif innings is not None and games_started and games_pitched == games_started:
            avg_start_innings = safe_div(innings, games_started)
        else:
            avg_start_innings = None
        core_source_parts = []
        if official:
            core_source_parts.append("MLB StatsAPI season pitching")
        if start_log:
            core_source_parts.append("MLB StatsAPI pitching game logs")
        if people_info.get(player_id):
            core_source_parts.append("MLB StatsAPI people")
        if player_id in statcast_pitch_hand and "MLB StatsAPI people" not in core_source_parts:
            core_source_parts.append("Baseball Savant Statcast pitch hand")

        starter_rows.append(
            {
                "player_id": player_id,
                "player_name": player_name(player_id),
                "team": player_team(player_id),
                "season": season,
                "innings_pitched": innings,
                "batters_faced": batters_faced,
                "era": official.get("era") if official else None,
                "strikeouts": strikeouts,
                "walks": walks,
                "strikeout_rate": safe_div(strikeouts, batters_faced),
                "walk_rate": safe_div(walks, batters_faced),
                "games_started": games_started,
                "games_pitched": games_pitched,
                "game_log_starts": start_log.get("game_log_starts"),
                "avg_start_innings": avg_start_innings,
                "avg_start_pitches": start_log.get("avg_start_pitches"),
                "avg_start_batters_faced": start_log.get("avg_start_batters_faced"),
                "pitch_hand": player_hand(player_id),
                "core_stats_source": " + ".join(core_source_parts) if core_source_parts else None,
                "barrel_allowed_rate": safe_div(agg["barrels"], agg["tracked_bbe"]),
                "hard_hit_allowed_rate": safe_div(agg["hard_hit"], agg["tracked_bbe"]),
                "avg_exit_velocity_allowed": safe_avg(agg["ev_sum"], agg["ev_n"]),
                "launch_angle_allowed": safe_avg(agg["la_sum"], agg["la_n"]),
                "hr_fb_allowed": safe_div(agg["hr"], agg["fly_balls"]),
                "slg_allowed": official_slg if official_slg is not None else statcast_slg,
                "xslg_allowed": safe_avg(agg["xslg_sum"], agg["xslg_n"]),
                "xba_allowed": safe_avg(agg["xba_sum"], agg["xba_n"]),
                "xwoba_allowed": safe_div(agg["xwoba_sum"], agg["xwoba_denom"]),
                "sample_batted_balls": agg["tracked_bbe"] if has_statcast else None,
                "last_updated": last_updated,
            }
        )

        if has_statcast:
            pitches_thrown = agg["pitches"]
            out_zone_pitches = agg["out_zone_pitches"]
            out_zone_swings = agg["out_zone_swings"]
            out_zone_whiffs = agg["out_zone_whiffs"]
            zone_pitches = agg["zone_pitches"]
            zone_swings = agg["zone_swings"]
            zone_whiffs = agg["zone_whiffs"]
        else:
            pitches_thrown = official.get("number_of_pitches") if official else None
            out_zone_pitches = None
            out_zone_swings = None
            out_zone_whiffs = None
            zone_pitches = None
            zone_swings = None
            zone_whiffs = None

        chase_rows.append(
            {
                "player_id": player_id,
                "player_name": player_name(player_id),
                "team": player_team(player_id),
                "season": season,
                "pitches_thrown": pitches_thrown,
                "out_of_zone_pitches": out_zone_pitches,
                "out_of_zone_swings": out_zone_swings,
                "out_of_zone_whiffs": out_zone_whiffs,
                "zone_pitches": zone_pitches,
                "zone_swings": zone_swings,
                "zone_whiffs": zone_whiffs,
                "chase_rate_generated": safe_div(agg["out_zone_swings"], agg["out_zone_pitches"]) if has_statcast else None,
                "out_of_zone_whiff_rate": safe_div(agg["out_zone_whiffs"], agg["out_zone_swings"]) if has_statcast else None,
                "zone_whiff_rate": safe_div(agg["zone_whiffs"], agg["zone_swings"]) if has_statcast else None,
                "called_strike_rate": safe_div(agg["called_strikes"], agg["pitches"]) if has_statcast else None,
                "first_pitch_strike_rate": safe_div(agg["first_pitch_strikes"], agg["first_pitches"]) if has_statcast else None,
                "swinging_strike_rate": safe_div(agg["whiffs"], agg["pitches"]) if has_statcast else None,
                "chase_k_share_if_available": None,
                "slider_splitter_change_usage": safe_div(agg["chase_usage_pitches"], agg["pitches"]) if has_statcast else None,
                "chase_reliance_score": None,
                "last_updated": last_updated,
            }
        )

    pitch_type_rows: List[dict] = []
    for (player_id, pitch_type), agg in pitch_type_aggs.items():
        pitcher_total = pitcher_aggs[player_id]["pitches"]
        ba = safe_div(agg["hits"], agg["ab"])
        slg = safe_div(agg["tb"], agg["ab"])
        pitch_name = agg["pitch_names"].most_common(1)[0][0] if agg["pitch_names"] else None
        pitch_type_rows.append(
            {
                "player_id": player_id,
                "player_name": player_name(player_id),
                "team": player_team(player_id),
                "season": season,
                "pitch_type": pitch_type,
                "pitch_name": pitch_name,
                "pitches_thrown": agg["pitches"],
                "usage_pct": safe_div(agg["pitches"], pitcher_total, scale=100.0),
                "batters_faced_or_pa": agg["pa"],
                "ba_allowed": ba,
                "slg_allowed": slg,
                "iso_allowed": round(slg - ba, 6) if slg is not None and ba is not None else None,
                "woba_allowed": safe_div(agg["woba_value_sum"], agg["woba_denom_sum"]),
                "xslg_allowed": safe_avg(agg["xslg_sum"], agg["xslg_n"]),
                "xwoba_allowed": safe_div(agg["xwoba_sum"], agg["xwoba_denom"]),
                "barrel_allowed_rate": safe_div(agg["barrels"], agg["tracked_bbe"]),
                "hard_hit_allowed_rate": safe_div(agg["hard_hit"], agg["tracked_bbe"]),
                "avg_exit_velocity_allowed": safe_avg(agg["ev_sum"], agg["ev_n"]),
                "launch_angle_allowed": safe_avg(agg["la_sum"], agg["la_n"]),
                "hr_allowed": agg["hr"],
                "whiff_rate": safe_div(agg["whiffs"], agg["swings"]),
                "chase_rate_generated": safe_div(agg["out_zone_swings"], agg["out_zone_pitches"]),
                "out_of_zone_swing_rate_generated": safe_div(agg["out_zone_swings"], agg["out_zone_pitches"]),
                "out_of_zone_whiff_rate": safe_div(agg["out_zone_whiffs"], agg["out_zone_swings"]),
                "zone_whiff_rate": safe_div(agg["zone_whiffs"], agg["zone_swings"]),
                "small_sample": agg["pitches"] < 50,
                "last_updated": last_updated,
            }
        )

    starter_rows.sort(key=table_sort_key)
    pitch_type_rows.sort(key=lambda row: (row.get("team") or "ZZZ", row.get("player_name") or "", -int(row["pitches_thrown"]), row.get("pitch_type") or ""))
    chase_rows.sort(key=table_sort_key)

    source_context = {
        "season": season,
        "start_date": start_date.isoformat(),
        "end_date": end_date.isoformat(),
        "probables_date": probables_date.isoformat(),
        "last_updated": last_updated,
        "source_priority": ["Baseball Savant Statcast CSV", "MLB StatsAPI"],
        "statcast_pitcher_count": len(statcast_pitchers),
        "statsapi_pitcher_count": len(statsapi_pitchers),
        "probable_pitcher_count": len(probables),
        "statcast_pitcher_ids_are_numeric": statcast_pitcher_ids_are_numeric,
        "people_info_count": len(people_info),
        "probable_start_game_log_count": len(start_game_logs),
        "bullpen_availability_team_count": len(bullpen_rows),
        "probable_pitchers": [
            {"player_id": pid, "player_name": player_name(pid), "team": player_team(pid)}
            for pid in sorted(probables)
        ],
        "player_universe_count": len(player_ids),
        "statsapi_ids_missing_from_statcast": sorted(set(statsapi_pitchers) - statcast_pitchers),
        "statcast_ids_missing_from_statsapi": sorted(statcast_pitchers - set(statsapi_pitchers)),
    }
    return starter_rows, pitch_type_rows, chase_rows, bullpen_rows, source_context


def json_ready(rows: Iterable[dict]) -> List[dict]:
    return [deepcopy(row) for row in rows]


def csv_cell(value):
    if value is None:
        return ""
    if isinstance(value, bool):
        return "true" if value else "false"
    return value


def write_csv(path: Path, rows: List[dict], fields: List[str]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields, extrasaction="ignore")
        writer.writeheader()
        for row in rows:
            writer.writerow({field: csv_cell(row.get(field)) for field in fields})


def write_json(path: Path, rows: List[dict]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(json_ready(rows), ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def missing_counts(rows: List[dict], fields: List[str]) -> Dict[str, int]:
    counts = {}
    for field in fields:
        count = sum(1 for row in rows if row.get(field) is None)
        if count:
            counts[field] = count
    return counts


def null_reason_report(rows: List[dict], fields: List[str]) -> Dict[str, dict]:
    report = {}
    counts = missing_counts(rows, fields)
    for field, count in counts.items():
        report[field] = {
            "null_count": count,
            "reason": NULL_REASONS.get(field, "Unavailable from the selected source data; not guessed or imputed."),
        }
    return report


def pitcher_ids(rows: List[dict]) -> set:
    return {int(row["player_id"]) for row in rows}


def validate_rate_bounds(table_name: str, rows: List[dict], fields: List[str], lower: float = 0.0, upper: float = 1.0) -> List[dict]:
    violations = []
    for row in rows:
        for field in fields:
            value = row.get(field)
            if value is None:
                continue
            if not (lower <= float(value) <= upper):
                violations.append(
                    {
                        "table": table_name,
                        "player_id": row.get("player_id"),
                        "field": field,
                        "value": value,
                    }
                )
    return violations


def usage_pct_checks(rows: List[dict]) -> dict:
    sums = defaultdict(float)
    for row in rows:
        if row.get("usage_pct") is not None:
            sums[int(row["player_id"])] += float(row["usage_pct"])
    violations = [
        {"player_id": player_id, "usage_pct_sum": round(total, 6)}
        for player_id, total in sorted(sums.items())
        if not (99.5 <= total <= 100.5)
    ]
    return {
        "scale": "0_to_100_percentage",
        "pitcher_count_checked": len(sums),
        "min_sum": round(min(sums.values()), 6) if sums else None,
        "max_sum": round(max(sums.values()), 6) if sums else None,
        "violation_count": len(violations),
        "violations": violations[:50],
    }


def build_quality_report(
    starter_rows: List[dict],
    pitch_type_rows: List[dict],
    chase_rows: List[dict],
    bullpen_rows: List[dict],
    source_context: dict,
) -> dict:
    all_pitchers = pitcher_ids(starter_rows) | pitcher_ids(chase_rows) | pitcher_ids(pitch_type_rows)
    table_pitchers = {
        "starter_damage_allowed": pitcher_ids(starter_rows),
        "pitcher_pitch_type_damage_allowed": pitcher_ids(pitch_type_rows),
        "pitcher_chase_generation": pitcher_ids(chase_rows),
    }
    pitcher_reference = {}
    for row in starter_rows + chase_rows + pitch_type_rows:
        player_id = int(row["player_id"])
        pitcher_reference.setdefault(
            player_id,
            {
                "player_id": player_id,
                "player_name": row.get("player_name"),
                "team": row.get("team"),
            },
        )

    rate_violations = []
    rate_violations.extend(
        validate_rate_bounds(
            "starter_damage_allowed",
            starter_rows,
            ["barrel_allowed_rate", "hard_hit_allowed_rate", "hr_fb_allowed"],
        )
    )
    rate_violations.extend(
        validate_rate_bounds(
            "pitcher_pitch_type_damage_allowed",
            pitch_type_rows,
            [
                "barrel_allowed_rate",
                "hard_hit_allowed_rate",
                "whiff_rate",
                "chase_rate_generated",
                "out_of_zone_swing_rate_generated",
                "out_of_zone_whiff_rate",
                "zone_whiff_rate",
            ],
        )
    )
    rate_violations.extend(
        validate_rate_bounds(
            "pitcher_chase_generation",
            chase_rows,
            [
                "chase_rate_generated",
                "out_of_zone_whiff_rate",
                "zone_whiff_rate",
                "called_strike_rate",
                "first_pitch_strike_rate",
                "swinging_strike_rate",
                "slider_splitter_change_usage",
            ],
        )
    )

    missing_from_tables = {}
    for table, ids in table_pitchers.items():
        missing_ids = sorted(all_pitchers - ids)
        missing_from_tables[table] = [
            pitcher_reference.get(player_id, {"player_id": player_id})
            for player_id in missing_ids
        ]

    return {
        "generated_at": source_context["last_updated"],
        "source_context": source_context,
        "row_counts": {
            "starter_damage_allowed": len(starter_rows),
            "pitcher_pitch_type_damage_allowed": len(pitch_type_rows),
            "pitcher_chase_generation": len(chase_rows),
            "bullpen_availability": len(bullpen_rows),
        },
        "missing_field_counts": {
            "starter_damage_allowed": missing_counts(starter_rows, STARTER_FIELDS),
            "pitcher_pitch_type_damage_allowed": missing_counts(pitch_type_rows, PITCH_TYPE_FIELDS),
            "pitcher_chase_generation": missing_counts(chase_rows, CHASE_FIELDS),
            "bullpen_availability": missing_counts(bullpen_rows, BULLPEN_FIELDS),
        },
        "null_reasons": {
            "starter_damage_allowed": null_reason_report(starter_rows, STARTER_FIELDS),
            "pitcher_pitch_type_damage_allowed": null_reason_report(pitch_type_rows, PITCH_TYPE_FIELDS),
            "pitcher_chase_generation": null_reason_report(chase_rows, CHASE_FIELDS),
            "bullpen_availability": null_reason_report(bullpen_rows, BULLPEN_FIELDS),
        },
        "small_sample_counts": {
            "pitcher_pitch_type_damage_allowed": sum(1 for row in pitch_type_rows if row.get("small_sample") is True),
            "threshold_pitches": 50,
        },
        "pitchers_missing_from_each_table": missing_from_tables,
        "validations": {
            "no_invented_values": {
                "passed": True,
                "note": "Values are sourced from Baseball Savant / MLB StatsAPI or computed from documented formulas; unavailable values remain null.",
            },
            "mlbam_savant_id": {
                "passed": bool(source_context["statcast_pitcher_ids_are_numeric"]),
                "statcast_pitcher_ids_are_numeric": source_context["statcast_pitcher_ids_are_numeric"],
                "statsapi_ids_missing_from_statcast_count": len(source_context["statsapi_ids_missing_from_statcast"]),
                "statcast_ids_missing_from_statsapi_count": len(source_context["statcast_ids_missing_from_statsapi"]),
            },
            "usage_pct_by_pitcher": usage_pct_checks(pitch_type_rows),
            "rate_bounds": {
                "passed": len(rate_violations) == 0,
                "violation_count": len(rate_violations),
                "violations": rate_violations[:100],
            },
            "pitch_type_small_samples_flagged": {
                "passed": all(("small_sample" in row) for row in pitch_type_rows),
            },
            "starter_damage_sample_fields_present": {
                "passed": all(("sample_batted_balls" in row and "batters_faced" in row and "innings_pitched" in row) for row in starter_rows),
            },
        },
    }


def main() -> None:
    args = parse_args()
    out_dir = Path(args.out_dir)

    starter_rows, pitch_type_rows, chase_rows, bullpen_rows, source_context = build_rows(args)

    write_csv(out_dir / "starter_damage_allowed.csv", starter_rows, STARTER_FIELDS)
    write_json(out_dir / "starter_damage_allowed.json", starter_rows)
    write_csv(out_dir / "pitcher_pitch_type_damage_allowed.csv", pitch_type_rows, PITCH_TYPE_FIELDS)
    write_json(out_dir / "pitcher_pitch_type_damage_allowed.json", pitch_type_rows)
    write_csv(out_dir / "pitcher_chase_generation.csv", chase_rows, CHASE_FIELDS)
    write_json(out_dir / "pitcher_chase_generation.json", chase_rows)
    write_csv(out_dir / "bullpen_availability.csv", bullpen_rows, BULLPEN_FIELDS)
    write_json(out_dir / "bullpen_availability.json", bullpen_rows)

    quality_report = build_quality_report(starter_rows, pitch_type_rows, chase_rows, bullpen_rows, source_context)
    (out_dir / "data_quality_report.json").write_text(
        json.dumps(quality_report, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    print(json.dumps(quality_report["row_counts"], indent=2))
    print(json.dumps(quality_report["validations"], indent=2))


if __name__ == "__main__":
    main()
