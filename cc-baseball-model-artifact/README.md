# MLB Pitcher Damage and Chase Data Tables

This workspace builds the requested MLB pitcher data tables without changing the betting model code. It also rebuilds the artifact with official starter core stats, nullable game context, bullpen workload, expanded odds hooks, a customer-facing app surface, and a calibration report scaffold.

- `data/starter_damage_allowed.csv` and `.json`
- `data/pitcher_pitch_type_damage_allowed.csv` and `.json`
- `data/pitcher_chase_generation.csv` and `.json`
- `data/bullpen_availability.csv` and `.json`
- `data/data_quality_report.json`
- `data/backtest_calibration.json`

## Sources Used

Primary source:

- Baseball Savant Statcast CSV endpoint: `https://baseballsavant.mlb.com/statcast_search/csv`
- Used for pitch-level events, pitch type, batted-ball quality, expected values, wOBA fields, zone, swing/whiff, and chase metrics.

Secondary source:

- MLB StatsAPI: `https://statsapi.mlb.com/api/v1`
- Used for official MLBAM player IDs, season pitching totals, innings/outs, batters faced, team metadata, pitch hand, probable starters, probable starter game logs, and available game context.

Optional source:

- The Odds API. The local artifact has the key preloaded for operator use; a public hosted version should move this value to a server-side runtime secret/proxy so it is not visible in browser source.
- Used by the app's odds refresh path. Featured markets use `/v4/sports/baseball_mlb/odds`; team totals and MLB player props use the single-event `/v4/sports/baseball_mlb/events/{eventId}/odds` endpoint.
- The app requests moneyline, spread, full-game total, team total, alternate team total, alternate spread, alternate total, F5 moneyline, F5 total, first-inning total for YRFI/NRFI, pitcher strikeout, alternate pitcher strikeout, and pitcher win markets. If a market is unavailable from the API response, the app leaves it null.

The pipeline does not fill missing values with league averages and does not create guessed placeholder values. Unavailable fields are exported as null in JSON and empty cells in CSV.

## Field Definitions and Formulas

All rate fields are exported as decimals from 0 to 1 unless otherwise noted. `usage_pct` is exported as a 0-to-100 percentage so pitcher pitch-type rows sum to about 100.

### starter_damage_allowed

- `innings_pitched`: MLB StatsAPI official outs divided by 3.
- `batters_faced`: MLB StatsAPI official `battersFaced`; Statcast PA count is used only when StatsAPI is unavailable.
- `era`: MLB StatsAPI official `era`, parsed as a decimal when available.
- `strikeouts`: MLB StatsAPI official strikeout total.
- `walks`: MLB StatsAPI official walk total.
- `strikeout_rate`: MLB StatsAPI strikeouts / batters faced.
- `walk_rate`: MLB StatsAPI walks / batters faced.
- `games_started`: MLB StatsAPI official games started.
- `games_pitched`: MLB StatsAPI official games pitched.
- `game_log_starts`: Count of MLB StatsAPI game-log appearances marked as starts for probable starters.
- `avg_start_innings`: Average innings per start from game-log starts when available; otherwise season starter innings proxy for pitchers with starts.
- `avg_start_pitches`: Average pitches per start from MLB StatsAPI probable-starter game logs.
- `avg_start_batters_faced`: Average batters faced per start from MLB StatsAPI probable-starter game logs.
- `pitch_hand`: MLB StatsAPI people endpoint pitch-hand code.
- `core_stats_source`: Human-readable source label for the official core fields.
- `barrel_allowed_rate`: Statcast barrels allowed / tracked in-play batted balls.
- `hard_hit_allowed_rate`: Statcast in-play batted balls with launch speed >= 95 mph / tracked in-play batted balls.
- `avg_exit_velocity_allowed`: Average Statcast launch_speed on tracked in-play batted balls.
- `launch_angle_allowed`: Average Statcast launch_angle on tracked in-play batted balls.
- `hr_fb_allowed`: home runs allowed / Statcast fly balls allowed.
- `slg_allowed`: MLB StatsAPI total bases allowed / at-bats allowed; Statcast event fallback only if StatsAPI is unavailable.
- `xslg_allowed`: Average available Statcast `estimated_slg_using_speedangle` for eligible at-bat events.
- `xba_allowed`: Average available Statcast `estimated_ba_using_speedangle` for eligible at-bat events.
- `xwoba_allowed`: Weighted average available Statcast `estimated_woba_using_speedangle` over rows with a positive `woba_denom`.
- `sample_batted_balls`: Count of tracked in-play batted balls used for barrel, hard-hit, and EV denominators.

### pitcher_pitch_type_damage_allowed

- One row per pitcher and Savant `pitch_type`.
- `pitches_thrown`: Count of Statcast pitch rows for the pitcher and pitch type.
- `usage_pct`: Pitch-type pitches / total pitcher pitches * 100.
- `batters_faced_or_pa`: Statcast plate appearances ending on that pitch type.
- `ba_allowed`: Hits / at-bats ending on that pitch type.
- `slg_allowed`: Total bases / at-bats ending on that pitch type.
- `iso_allowed`: `slg_allowed - ba_allowed`.
- `woba_allowed`: Sum of Statcast `woba_value` / sum of `woba_denom`.
- `xslg_allowed`: Average available Statcast `estimated_slg_using_speedangle`.
- `xwoba_allowed`: Weighted average available Statcast `estimated_woba_using_speedangle` over rows with a positive `woba_denom`.
- `barrel_allowed_rate`: Barrels / tracked in-play batted balls for that pitch type.
- `hard_hit_allowed_rate`: Hard-hit tracked in-play batted balls / tracked in-play batted balls for that pitch type.
- `avg_exit_velocity_allowed`: Average launch_speed on tracked in-play batted balls for that pitch type.
- `launch_angle_allowed`: Average launch_angle on tracked in-play batted balls for that pitch type.
- `hr_allowed`: Home runs ending on that pitch type.
- `whiff_rate`: Whiffs / swings.
- `chase_rate_generated`: Swings at out-of-zone pitches / out-of-zone pitches.
- `out_of_zone_swing_rate_generated`: Same formula as `chase_rate_generated`.
- `out_of_zone_whiff_rate`: Whiffs on out-of-zone pitches / swings at out-of-zone pitches.
- `zone_whiff_rate`: Whiffs on in-zone pitches / swings at in-zone pitches.
- `small_sample`: `true` when the pitch type has fewer than 50 pitches.

### pitcher_chase_generation

- `pitches_thrown`: Count of Statcast pitch rows; if no Statcast rows exist, MLB StatsAPI `numberOfPitches` is used when available.
- `out_of_zone_pitches`: Statcast zone 11 or higher.
- `out_of_zone_swings`: Out-of-zone pitches with swing descriptions.
- `out_of_zone_whiffs`: Out-of-zone pitches with whiff descriptions.
- `zone_pitches`: Statcast zones 1 through 9.
- `zone_swings`: In-zone pitches with swing descriptions.
- `zone_whiffs`: In-zone pitches with whiff descriptions.
- `chase_rate_generated`: `out_of_zone_swings / out_of_zone_pitches`.
- `out_of_zone_whiff_rate`: `out_of_zone_whiffs / out_of_zone_swings`.
- `zone_whiff_rate`: `zone_whiffs / zone_swings`.
- `called_strike_rate`: Called strikes / total Statcast pitches.
- `first_pitch_strike_rate`: First pitches with Statcast type `S` or `X` / first pitches.
- `swinging_strike_rate`: Total whiffs / total Statcast pitches.
- `chase_k_share_if_available`: Null. No direct Savant or StatsAPI field is available in this pipeline.
- `slider_splitter_change_usage`: Pitch types `SL`, `ST`, `CH`, `FS`, and `FO` / total Statcast pitches.
- `chase_reliance_score`: Null. No official source field or user-provided formula was supplied, so the pipeline does not invent one.

### bullpen_availability

- One row per MLB team.
- `relief_pitches_1d`: Statcast pitch count by pitchers who were not the first pitcher used by that team in games on the prior day.
- `relief_pitches_3d`: Same relief-pitch workload over the prior three days.
- `relievers_used_1d`: Distinct non-starting pitchers used on the prior day.
- `relievers_used_3d`: Distinct non-starting pitchers used over the prior three days.
- `back_to_back_relievers`: Relievers used on both of the prior two days.
- `bullpen_status`: Derived workload flag of `fresh`, `normal`, or `taxed`; no model weights are changed by this export.

### Artifact game context

The rebuilt app uses official MLB StatsAPI schedule/live-feed data for game context:

- Confirmed lineup batters and batting handedness are included when MLB publishes lineup data.
- Weather and home-plate umpire are included when MLB publishes them in the live feed.
- Missing lineups, weather, and umpire fields remain null/pending and are listed in each game's context warnings.
- Bullpen status is joined from `data/bullpen_availability.json`.
- Odds and props are fetched only when `ODDS_API_KEY` is available; unavailable markets remain null.
- Team-total betting lines are snapped to sportsbook-style 0.5 increments, such as `4` or `4.5`; model run projections remain decimal projections.
- Strikeout props include a `K workload` scenario toggle. `Baseline` uses the normal damage-adjusted expected IP. `No damage IP penalty` removes only the damage-pressure workload penalty for strikeout projections; run markets, pitcher outs, and pitcher win stay on the baseline model.
- `CUSTOMER_FACING` is enabled in `src/App.jsx` so the rendered artifact hides raw model internals, debug panels, calibration controls, source-table counts, damage/discipline/K-mechanism details, and proprietary data explanations. The older internal panels remain in the source for operator/admin work but are not the default customer view.

### Backtest calibration

`scripts/backtest_calibration.py` reads `data/graded_bets.json` when available and writes `data/backtest_calibration.json` with overall calibration, by-market calibration, probability-bin summaries, Brier score, and ROI per 1u where book odds exist. If no graded bets file exists, the report explicitly returns `status: "no_graded_bets_available"` and does not estimate calibration.

## Known Missing Fields

Expected nulls are documented in `data/data_quality_report.json` under `null_reasons`.

Common null reasons:

- A denominator is zero, such as no out-of-zone pitches, no swings, no fly balls, or no tracked in-play batted balls.
- Statcast does not provide an expected value for a row.
- A pitcher appears in MLB StatsAPI but has no matching Statcast pitch-level rows in the selected date range.
- `chase_k_share_if_available` and `chase_reliance_score` are intentionally null because no direct source field or explicit formula is available.
- Confirmed lineup, weather, and home-plate umpire fields can be pending/null before MLB publishes them.
- Odds and props are null unless an Odds API key is provided and the requested market is returned.
- Backtest calibration remains unavailable until graded historical bets are supplied in `data/graded_bets.json`.

## Validation

`data/data_quality_report.json` includes:

- Row counts by table.
- Missing field counts by table.
- Null reasons by field.
- Small-sample pitch-type row counts.
- Bullpen availability row counts and missing-field counts.
- Pitchers missing from each table.
- MLBAM/Savant ID checks.
- Usage percentage sum checks by pitcher.
- Rate bound checks for chase, barrel, hard-hit, and related 0-to-1 rates.

## Refresh

Run:

```bash
python3 build_mlb_data_tables.py
python3 scripts/backtest_calibration.py
python3 scripts/rebuild_artifact.py
```

Useful options:

```bash
python3 build_mlb_data_tables.py --season 2026 --end-date 2026-07-10
python3 build_mlb_data_tables.py --season 2026 --start-date 2026-03-25 --end-date 2026-07-10 --refresh
```

Raw source CSV chunks are cached under `work/source_cache/`. Use `--refresh` to re-download them.

The app can be run locally with:

```bash
pnpm install
pnpm dev
```

For odds refreshes, paste a The Odds API key into the Markets panel and click `Fetch odds`.

For the customer artifact, click `Refresh live odds`; the key is already preloaded locally. For a public hosted site, use a server-side odds proxy with `ODDS_API_KEY` as a secret rather than exposing the key in the browser bundle.

## Hosting and Daily Refresh

Recommended production shape:

1. Run the data refresh daily at 5:00 AM ET:

```bash
python3 build_mlb_data_tables.py --season 2026 --end-date "$(date +%F)" --refresh
python3 scripts/backtest_calibration.py
python3 scripts/rebuild_artifact.py
pnpm build
```

2. Publish the built customer-facing app to the hosting target.
3. Store `ODDS_API_KEY` as a hosting secret and route odds calls through a server-side endpoint before making the site public.
4. Keep `CUSTOMER_FACING=true` for customer deployments so proprietary model data stays hidden.
