#!/usr/bin/env python3
"""Rebuild the pasted React artifact with the generated MLB pitcher tables."""

from __future__ import annotations

import json
import math
import re
import shutil
import unicodedata
import urllib.parse
import urllib.request
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path
from zoneinfo import ZoneInfo


ROOT = Path(__file__).resolve().parents[1]
ATTACHMENT = Path("/Users/mac/.codex/attachments/8af764ba-73ad-4d07-80e1-85df67999921/pasted-text.txt")
DATA_DIR = ROOT / "data"
SRC_DIR = ROOT / "src"
PUBLIC_DIR = ROOT / "public"

HIDDEN_DAMAGE_PANEL = r'''function DamagePanel({ report, awayTeam, homeTeam, awayArm, homeArm }) {
  return null;
}'''

HIDDEN_DISCIPLINE_PANEL = r'''function DisciplinePanel({ report, awayTeam, homeTeam, awayArm, homeArm }) {
  return null;
}'''

HIDDEN_K_MECHANISM_PANEL = r'''function KMechanismPanel({ arm, mech, oppTeam, oppAbbr, rawK, adjK, kConv, finalK, projK, bf }) {
  return null;
}'''


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


def fetch_schedule(season_date: str, teams_by_id: dict[int, str], fallback_games: list[dict], bullpen_by_team=None) -> list[dict]:
    params = urllib.parse.urlencode(
        {"sportId": 1, "date": season_date, "hydrate": "probablePitcher,venue,weather,linescore,team,lineups"}
    )
    url = f"https://statsapi.mlb.com/api/v1/schedule?{params}"
    try:
        payload = request_json_url(url, timeout=20)
    except Exception:
        return fallback_games

    games = []
    bullpen_by_team = bullpen_by_team or {}
    for day in payload.get("dates", []):
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
    return games or fallback_games


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


def build_pitcher_objects(original: dict, starter_rows: list[dict], pitch_type_rows: list[dict], chase_rows: list[dict]) -> list[dict]:
    original_by_name = {normalize_name(p.get("name")): p for p in original.get("pitchers", [])}
    pitch_rows_by_id = defaultdict(list)
    pitch_ref = dict(original.get("pitchRef", {}))
    for row in pitch_type_rows:
        player_id = row.get("player_id")
        pitch_rows_by_id[player_id].append(row)
        if row.get("pitch_type") and row.get("pitch_name"):
            pitch_ref.setdefault(row["pitch_type"], row["pitch_name"])

    chase_by_id = {row["player_id"]: row for row in chase_rows}
    pitchers = []
    for starter in starter_rows:
        player_id = starter["player_id"]
        name = starter.get("player_name")
        base = original_by_name.get(normalize_name(name), {})
        chase = chase_by_id.get(player_id, {})
        source_bits = ["savant-starter-damage", "savant-pitch-type-damage", "savant-chase-generation"]
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


def main() -> None:
    pasted = ATTACHMENT.read_text(encoding="utf-8")
    original = extract_default_data(pasted)
    quality = read_json(DATA_DIR / "data_quality_report.json")
    starters = read_json(DATA_DIR / "starter_damage_allowed.json")
    pitch_types = read_json(DATA_DIR / "pitcher_pitch_type_damage_allowed.json")
    chase = read_json(DATA_DIR / "pitcher_chase_generation.json")
    bullpen = read_json(DATA_DIR / "bullpen_availability.json") if (DATA_DIR / "bullpen_availability.json").exists() else []

    pitchers = build_pitcher_objects(original, starters, pitch_types, chase)
    source_context = quality.get("source_context", {})
    season_date = source_context.get("end_date") or original.get("date")
    bullpen_by_team = {row.get("team"): row for row in bullpen if row.get("team")}
    games = fetch_schedule(season_date, load_team_ids(), original.get("games", []), bullpen_by_team)

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

    data_json = json.dumps(next_data, ensure_ascii=False, indent=2)
    (SRC_DIR / "diamond_data.json").write_text(data_json + "\n", encoding="utf-8")
    (PUBLIC_DIR / "diamond_data.json").write_text(data_json + "\n", encoding="utf-8")

    for name in [
        "starter_damage_allowed.json",
        "pitcher_pitch_type_damage_allowed.json",
        "pitcher_chase_generation.json",
        "bullpen_availability.json",
        "backtest_calibration.json",
        "data_quality_report.json",
    ]:
        if (DATA_DIR / name).exists():
            shutil.copyfile(DATA_DIR / name, PUBLIC_DIR / "data" / name)

    app_source = pasted
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
        'markets: "h2h,spreads,totals,team_totals,pitcher_strikeouts,pitcher_outs,pitcher_hits_allowed,pitcher_walks,pitcher_earned_runs,pitcher_to_record_a_win",',
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
        if (market.key === "pitcher_to_record_a_win") {
          market.outcomes.forEach((outcome) => {
            const player = normalizeName(outcome.description || outcome.name || "");
            if (player && normalizeName(model.awayArm?.name || "").includes(player)) nextOdds.awaySPwin = outcome.price;
            if (player && normalizeName(model.homeArm?.name || "").includes(player)) nextOdds.homeSPwin = outcome.price;
          });
        }''',
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
    if "Odds API key" in current_app and "derivedTeamTotalLines" in current_app:
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
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
