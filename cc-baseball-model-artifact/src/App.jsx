import React, { useEffect, useMemo, useState } from "react";
import BOARD from "./customer_board.json";

// CUSTOMER_BOARD_SAFE: this component receives only published customer
// forecasts. Model inputs, calibration tables, and scoring mechanics stay out
// of the browser bundle.
const CUSTOMER_FACING = true;
const PRELOADED_ODDS_API_KEY = import.meta.env.VITE_ODDS_API_KEY || "";
// Public customer boards use the separate worker endpoint. It holds the Odds
// API credential server-side; this URL is routing information, not a secret.
const ODDS_PROXY_ORIGIN = "https://cc-baseball-board-20260710.chatfield60.chatgpt.site";
// Props receive a deliberately lighter price check than sides/totals. When a
// paired price exists, use its no-vig probability and move the fair only 15%.
const PROP_PRICE_BLEND_WEIGHT = 0.15;
const K_FAIR_SCALE = 1.55;
const STRONG_PROB_EDGE = 0.045;
const BET_PROB_EDGE = 0.025;
const LEAN_PROB_EDGE = 0.01;
const TOTAL_RUN_TO_PROB = 0.11;
const ODDS_HISTORY_KEY = "cc-baseball-odds-history-v1";
const MARKET_TOTAL_BLEND_WEIGHT = 0.55;
const MARKET_TOTAL_MAX_RUN_SHIFT = 1.50;
const MARKET_TOTAL_EXTREME_GAP = 2.00;
const MARKET_TOTAL_EXTREME_BLEND_WEIGHT = 0.72;
const MARKET_TOTAL_EXTREME_MAX_RUN_SHIFT = 3.50;
const MARKET_MARGIN_BLEND_WEIGHT = 0.45;
const MARKET_MARGIN_MAX_RUN_SHIFT = 1.00;
const FULL_GAME_MARGIN_SCALE = 1.25;
const F5_MARGIN_SCALE = 0.95;
const RESULT_MARKET_TYPES = [
  { key: "moneyline", label: "Moneyline", rank: 10 },
  { key: "run_line", label: "Run line", rank: 20 },
  { key: "full_total", label: "Full-game total", rank: 30 },
  { key: "team_total", label: "Team total", rank: 40 },
  { key: "f5_moneyline", label: "F5 moneyline", rank: 50 },
  { key: "f5_run_line", label: "F5 run line", rank: 60 },
  { key: "f5_total", label: "F5 total", rank: 70 },
  { key: "pitcher_strikeouts", label: "Pitcher strikeouts", rank: 80 },
  { key: "batter_hits", label: "Batter hits", rank: 90 },
  { key: "batter_total_bases", label: "Batter total bases", rank: 100 },
  { key: "batter_hr", label: "Batter homerun", rank: 110 },
  { key: "batter_strikeouts", label: "Batter strikeouts", rank: 120 },
];
const RESULT_MARKET_ALIASES = {
  full_game_total: "full_total",
  game_total: "full_total",
  total: "full_total",
  team_totals: "team_total",
  f5_ml: "f5_moneyline",
  f5_money_line: "f5_moneyline",
  f5_totals: "f5_total",
  batter_tb: "batter_total_bases",
  batter_home_runs: "batter_hr",
};

const APP_CSS = `
  :root {
    color-scheme: light;
    --page-bg: #F6F8FB;
    --surface: #FFFFFF;
    --surface-muted: #F9FAFC;
    --text-primary: #172033;
    --text-secondary: #68758A;
    --text-tertiary: #98A2B3;
    --border: #E6EAF0;
    --accent: #3B6FE8;
    --accent-soft: #EEF4FF;
    --positive: #16835B;
    --radius-sm: 8px;
    --radius-md: 12px;
    --radius-lg: 16px;
    font-family: Inter, Geist, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    background: var(--page-bg);
    color: var(--text-primary);
  }
  * { box-sizing: border-box; }
  body { margin: 0; min-width: 320px; background: var(--page-bg); }
  button { font: inherit; cursor: pointer; }
  button:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
  .app { min-height: 100vh; background: var(--page-bg); color: var(--text-primary); }
  .app.night {
    color-scheme: dark;
    --page-bg: #0E1624;
    --surface: #121C2B;
    --surface-muted: #172235;
    --text-primary: #EAF0F8;
    --text-secondary: #A7B4C6;
    --text-tertiary: #7D8CA1;
    --border: #253248;
    --accent: #7FA6FF;
    --accent-soft: #182A4B;
    --positive: #65D6A2;
  }
  h1, h2, h3, p { margin: 0; }
  h2 { color: var(--text-primary); font-size: 18px; font-weight: 700; letter-spacing: 0; }
  h3 { color: var(--text-primary); font-size: 13px; font-weight: 650; letter-spacing: 0; }
  .muted, .subline { color: var(--text-secondary); font-size: 13px; line-height: 1.45; }
  .topbar {
    position: sticky;
    top: 0;
    z-index: 5;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    padding: 18px max(28px, calc((100vw - 1320px) / 2));
    border-bottom: 1px solid var(--border);
    background: color-mix(in srgb, var(--page-bg) 90%, var(--surface));
  }
  .brand { color: var(--text-primary); font-size: 20px; font-weight: 700; letter-spacing: 0; }
  .brand b { color: var(--accent); }
  .top-actions { display: flex; align-items: center; gap: 10px; }
  .odds-stamp { color: var(--text-secondary); font-size: 12px; white-space: nowrap; }
  .mode, .refresh {
    min-height: 40px;
    padding: 0 14px;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    background: var(--surface);
    color: var(--text-primary);
    font-weight: 650;
    font-size: 13px;
  }
  .refresh { border-color: var(--accent); background: var(--accent); color: #fff; }
  .refresh:disabled { cursor: wait; opacity: .68; }
  .mode:hover, .refresh:hover:not(:disabled), .score-tile:hover { transform: translateY(-1px); }
  .shell { width: min(1320px, 100%); margin: 0 auto; padding: 22px; display: grid; gap: 16px; }
  .card {
    overflow: hidden;
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    background: var(--surface);
  }
  .card-title {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 16px;
    padding: 14px 16px 6px;
  }
  .card-title .muted { color: var(--text-secondary); }
  .compact-scores {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 8px;
    padding: 12px;
  }
  .score-tile {
    position: relative;
    min-height: 106px;
    display: grid;
    grid-template-rows: auto 1fr auto;
    gap: 9px;
    padding: 12px 14px;
    border: 1px solid transparent;
    border-radius: var(--radius-md);
    background: var(--surface-muted);
    color: inherit;
    text-align: left;
    transition: border-color .16s ease, background .16s ease, transform .16s ease;
  }
  .score-tile.active {
    border-color: color-mix(in srgb, var(--accent) 82%, var(--border));
    background: color-mix(in srgb, var(--accent-soft) 72%, var(--surface));
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--accent) 24%, transparent);
  }
  .score-tile.active::before {
    content: "";
    position: absolute;
    inset: 12px auto 12px 0;
    width: 3px;
    border-radius: 999px;
    background: var(--accent);
  }
  .tile-head, .tile-line, .tile-meta, .selected-main, .footer-grid {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }
  .tile-head { color: var(--text-secondary); font-size: 12px; font-weight: 600; line-height: 1.35; }
  .tile-line { color: var(--text-primary); font-size: 21px; font-weight: 700; font-variant-numeric: tabular-nums; }
  .tile-line span { display: flex; align-items: baseline; gap: 6px; white-space: nowrap; }
  .tile-line span:first-child { justify-content: flex-start; }
  .tile-line span:last-child { justify-content: flex-end; }
  .tile-line small { color: var(--text-secondary); font-size: 12px; font-weight: 650; }
  .tile-line b { font-weight: 700; }
  .tile-line .score-high b { color: var(--accent); font-size: 1.12em; }
  .tile-meta { color: var(--text-secondary); font-size: 12px; font-weight: 500; font-variant-numeric: tabular-nums; }
  .tile-meta-right { display: inline-flex; align-items: center; justify-content: flex-end; gap: 6px; }
  .edge-badge {
    justify-self: end;
    padding: 3px 7px;
    border-radius: 999px;
    background: var(--positive);
    color: #fff;
    font-size: 11px;
    font-weight: 750;
    line-height: 1.2;
  }
  .selected-summary {
    padding: 0 4px;
    border-bottom: 1px solid var(--border);
  }
  .selected-main { padding: 2px 0 14px; align-items: flex-start; }
  .selected-main h2 { margin-bottom: 4px; font-size: 20px; }
  .selected-score {
    color: var(--text-primary);
    font-size: 26px;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }
  .edge-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; padding: 10px 16px 14px; }
  .edge-card {
    position: relative;
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 10px;
    padding: 12px;
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    background: var(--surface-muted);
  }
  .edge-card.strong { border-left: 4px solid var(--positive); background: color-mix(in srgb, #EAF8F2 58%, var(--surface-muted)); }
  .edge-card.bet { border-color: color-mix(in srgb, var(--positive) 45%, var(--border)); }
  .edge-card.strong { box-shadow: 0 8px 20px rgba(22, 131, 91, .08); }
  .edge-main, .edge-data { display: grid; gap: 5px; }
  .edge-data { min-width: 138px; justify-items: end; padding-top: 24px; color: var(--text-secondary); font-size: 12px; font-variant-numeric: tabular-nums; }
  .edge-data b { color: var(--text-primary); font-weight: 700; }
  .edge-card .pill { position: absolute; top: 10px; right: 10px; }
  .edge-card strong { color: var(--text-primary); font-size: 13px; font-weight: 650; }
  .edge-card span { color: var(--text-secondary); font-size: 12px; line-height: 1.4; }
  .edge-category { color: var(--text-tertiary) !important; font-size: 11px !important; font-weight: 750; letter-spacing: .01em; text-transform: uppercase; }
  .edge-controls { display: flex; align-items: center; justify-content: flex-end; gap: 10px; }
  .tier-legend {
    position: relative;
    color: var(--text-secondary);
    font-size: 12px;
  }
  .tier-legend summary { cursor: pointer; list-style: none; font-weight: 650; }
  .tier-legend summary::-webkit-details-marker { display: none; }
  .tier-legend[open] {
    max-width: 360px;
    padding: 10px;
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    background: var(--surface);
  }
  .tier-legend div { display: grid; gap: 5px; margin-top: 8px; line-height: 1.35; }
  .empty-state {
    margin: 2px 16px 16px;
    padding: 14px 16px;
    border-radius: var(--radius-md);
    background: var(--surface-muted);
    color: var(--text-secondary);
    font-size: 13px;
    line-height: 1.45;
  }
  .market-section { display: grid; gap: 12px; padding: 8px 16px 16px; }
  .market-group { display: grid; gap: 10px; }
  .market-group-title { color: var(--text-tertiary); font-size: 12px; font-weight: 650; letter-spacing: .01em; }
  .market-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; }
  .market-card {
    display: grid;
    gap: 7px;
    padding: 12px;
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    background: var(--surface);
  }
  .market-card.strong {
    border-left: 4px solid var(--positive);
    border-color: color-mix(in srgb, var(--positive) 50%, var(--border));
    background: color-mix(in srgb, #EAF8F2 48%, var(--surface));
    box-shadow: 0 8px 20px rgba(22, 131, 91, .08);
  }
  .market-card.bet { border-color: color-mix(in srgb, var(--positive) 42%, var(--border)); }
  .market-card.pass { opacity: .62; filter: saturate(.72); }
  .market-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
  .market-main { color: var(--text-primary); font-size: 22px; font-weight: 700; font-variant-numeric: tabular-nums; }
  .market-edge { color: var(--text-primary); font-size: 12px; font-weight: 700; font-variant-numeric: tabular-nums; }
  .market-meta { display: grid; gap: 3px; color: var(--text-secondary); font-size: 12px; line-height: 1.3; }
  .market-meta span:first-child { color: var(--text-primary); font-weight: 600; }
  .market-card p.muted { color: var(--text-secondary); font-size: 12px; line-height: 1.35; }
  .copy { padding: 8px 20px 20px; display: grid; gap: 10px; color: var(--text-primary); font-size: 14px; line-height: 1.55; }
  .notice {
    margin-top: 4px;
    padding: 12px 14px;
    border-left: 3px solid var(--accent);
    border-radius: var(--radius-sm);
    background: var(--accent-soft);
    color: var(--text-secondary);
    font-size: 13px;
  }
  .angle-list { display: grid; gap: 10px; padding: 12px 20px 20px; }
  .angle {
    padding: 16px;
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    background: var(--surface);
  }
  .angle-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 14px; }
  .angle h3 { margin-bottom: 4px; }
  .pill {
    flex: 0 0 auto;
    padding: 4px 8px;
    border-radius: 999px;
    background: var(--surface-muted);
    color: var(--text-secondary);
    font-size: 11px;
    font-weight: 650;
    line-height: 1.2;
    border: 1px solid var(--border);
  }
  .pill.small, .pill.lean { color: #8A5B08; background: #FFF7E8; border-color: #F4DFB8; }
  .pill.bet { color: var(--positive); background: #EAF8F2; border-color: #CDEDE0; }
  .pill.strong { color: #fff; background: var(--positive); border-color: var(--positive); }
  .pill.pass, .pill.watch { color: var(--text-secondary); background: var(--surface-muted); border-color: var(--border); }
  .pill.pass { opacity: .72; filter: saturate(.7); }
  .night .pill.small, .night .pill.lean { color: #F0C777; background: #3A2A13; border-color: #574019; }
  .night .pill.bet { color: #8FE4B9; background: #123326; border-color: #1D513C; }
  .night .pill.strong { color: #06150E; background: #8FE4B9; border-color: #8FE4B9; }
  .night .edge-badge { color: #06150E; background: #8FE4B9; }
  .night .edge-card.strong, .night .market-card.strong { background: color-mix(in srgb, #123326 54%, var(--surface)); box-shadow: 0 8px 20px rgba(0, 0, 0, .18); }
  .night .edge-card.bet, .night .market-card.bet { border-color: color-mix(in srgb, #8FE4B9 40%, var(--border)); }
  .night .market-card.pass { opacity: .58; filter: saturate(.62); }
  .prices { display: flex; flex-wrap: wrap; gap: 12px; margin: 12px 0 8px; }
  .prices span { color: var(--text-secondary); font-size: 13px; line-height: 1.4; }
  .prices b { color: var(--text-primary); font-variant-numeric: tabular-nums; }
  .table { width: 100%; border-collapse: collapse; font-size: 13px; }
  .table th, .table td { padding: 13px 20px; text-align: left; border-bottom: 1px solid var(--border); vertical-align: top; }
  .table th { color: var(--text-tertiary); font-size: 12px; font-weight: 650; letter-spacing: .01em; }
  .table tr:last-child td { border-bottom: 0; }
  .table b { color: var(--text-primary); font-weight: 650; }
  .segmented { display: inline-flex; padding: 3px; gap: 3px; border: 1px solid var(--border); border-radius: var(--radius-sm); background: var(--surface-muted); }
  .segmented button { min-height: 30px; padding: 0 10px; border: 0; border-radius: 6px; background: transparent; color: var(--text-secondary); font-weight: 650; font-size: 12px; }
  .segmented button.active { background: var(--surface); color: var(--accent); }
  .edge-tier-filter { display: inline-flex; align-items: center; gap: 6px; color: var(--text-secondary); font-size: 12px; font-weight: 650; }
  .edge-tier-filter select { min-height: 32px; max-width: 148px; padding: 0 28px 0 9px; border: 1px solid var(--border); border-radius: var(--radius-sm); background: var(--surface); color: var(--text-primary); font: inherit; font-size: 12px; font-weight: 650; }
  .k-section { display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(0, .95fr); gap: 10px; padding: 10px 16px 16px; }
  .k-section.single { grid-template-columns: 1fr; }
  .k-panel { display: grid; align-content: start; gap: 8px; }
  .k-panel-title { color: var(--text-tertiary); font-size: 12px; font-weight: 650; letter-spacing: .01em; }
  .k-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
  .k-card {
    display: grid;
    gap: 8px;
    padding: 11px;
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    background: var(--surface-muted);
  }
  .k-card strong { color: var(--text-primary); font-size: 13px; font-weight: 650; line-height: 1.25; }
  .k-card span { color: var(--text-secondary); font-size: 12px; line-height: 1.35; }
  .k-card b { color: var(--text-primary); font-variant-numeric: tabular-nums; }
  .k-card-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; }
  .line-control { display: grid; grid-template-columns: auto 82px; align-items: center; gap: 8px; color: var(--text-secondary); font-size: 12px; font-weight: 650; }
  .line-control input {
    width: 82px;
    min-height: 32px;
    padding: 0 9px;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    background: var(--surface);
    color: var(--text-primary);
    font: inherit;
    font-variant-numeric: tabular-nums;
  }
  .mini-stats { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px; }
  .mini-stats span { padding: 7px 8px; border-radius: var(--radius-sm); background: var(--surface); border: 1px solid var(--border); }
  .fair-note { color: var(--text-tertiary) !important; }
  .performance-grid { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 10px; padding: 10px 16px; }
  .performance-card {
    display: grid;
    gap: 4px;
    padding: 12px;
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    background: var(--surface-muted);
  }
  .performance-card span { color: var(--text-secondary); font-size: 12px; font-weight: 650; }
  .performance-card strong { color: var(--text-primary); font-size: 22px; font-weight: 700; font-variant-numeric: tabular-nums; }
  .results-market-summary { display: grid; gap: 8px; padding: 0 16px 12px; }
  .results-section-label { color: var(--text-tertiary); font-size: 12px; font-weight: 750; letter-spacing: .01em; }
  .results-market-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; }
  .market-performance-card {
    display: grid;
    gap: 7px;
    min-width: 0;
    padding: 10px;
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    background: var(--surface-muted);
  }
  .market-performance-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; }
  .market-performance-head strong { color: var(--text-primary); font-size: 12px; font-weight: 750; line-height: 1.3; }
  .market-performance-head span, .market-performance-main span, .market-performance-footer span { color: var(--text-secondary); font-size: 11px; font-variant-numeric: tabular-nums; }
  .market-performance-main { display: flex; justify-content: space-between; align-items: baseline; gap: 8px; }
  .market-performance-main strong { color: var(--text-primary); font-size: 17px; font-weight: 750; font-variant-numeric: tabular-nums; }
  .market-performance-footer { display: flex; flex-wrap: wrap; gap: 6px 8px; }
  .results-details { margin: 0 16px 16px; border: 1px solid var(--border); border-radius: var(--radius-md); background: var(--surface-muted); }
  .results-details summary { padding: 11px 12px; color: var(--text-primary); font-size: 13px; font-weight: 650; cursor: pointer; }
  .results-details[open] summary { border-bottom: 1px solid var(--border); }
  .results-details:not([open]) .results-list { display: none; }
  .results-list { display: grid; gap: 8px; padding: 0 16px 16px; }
  .market-result-group {
    display: grid;
    gap: 8px;
    padding: 12px;
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    background: var(--surface);
  }
  .market-result-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
  .market-result-head h3 { margin: 0; color: var(--text-primary); font-size: 13px; font-weight: 750; }
  .market-result-head span { color: var(--text-secondary); font-size: 12px; line-height: 1.35; font-variant-numeric: tabular-nums; }
  .market-result-record { color: var(--text-primary) !important; font-weight: 750; white-space: nowrap; }
  .market-result-date { display: grid; gap: 7px; }
  .market-result-date + .market-result-date { padding-top: 10px; border-top: 1px solid var(--border); }
  .market-result-date-head { display: flex; justify-content: space-between; align-items: baseline; gap: 10px; color: var(--text-secondary); font-size: 11px; font-weight: 750; font-variant-numeric: tabular-nums; letter-spacing: .01em; }
  .market-result-date-head strong { color: var(--text-primary); font-size: 12px; }
  .bet-result-list { display: grid; gap: 7px; }
  .bet-result-item {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto auto;
    align-items: center;
    gap: 10px;
    padding-top: 8px;
    border-top: 1px solid var(--border);
  }
  .bet-result-copy { display: grid; gap: 3px; min-width: 0; }
  .bet-result-copy strong { overflow-wrap: anywhere; }
  .bet-result-copy span, .bet-result-units { color: var(--text-secondary); font-size: 12px; line-height: 1.35; font-variant-numeric: tabular-nums; overflow-wrap: anywhere; }
  .bet-result-units { color: var(--text-primary); font-weight: 700; white-space: nowrap; }
  .result-pill {
    display: inline-flex;
    width: fit-content;
    align-items: center;
    padding: 3px 7px;
    border-radius: 999px;
    border: 1px solid var(--border);
    background: var(--surface-muted);
    color: var(--text-secondary);
    font-size: 11px;
    font-weight: 750;
    line-height: 1.2;
    white-space: nowrap;
  }
  .result-pill.hit { color: var(--positive); background: #EAF8F2; border-color: #CDEDE0; }
  .result-pill.miss { color: #B42318; background: #FEF3F2; border-color: #F8C9C5; }
  .result-pill.push, .result-pill.neutral { color: var(--text-secondary); background: var(--surface-muted); }
  .night .result-pill.hit { color: #8FE4B9; background: #123326; border-color: #1D513C; }
  .night .result-pill.miss { color: #FFB4AA; background: #3A1715; border-color: #62302C; }
  .info { padding: 14px 20px 20px; color: var(--text-secondary); font-size: 13px; line-height: 1.45; }
  .model-footer { padding: 16px 20px; color: var(--text-secondary); font-size: 12px; }
  .footer-grid { flex-wrap: wrap; justify-content: flex-start; }
  .footer-grid span { padding-right: 12px; border-right: 1px solid var(--border); }
  .footer-grid span:last-child { border-right: 0; }
  .top-grid { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 12px; padding: 12px 20px 20px; }
  .top-card { display: grid; align-content: start; gap: 10px; padding: 14px; border: 1px solid var(--border); border-radius: var(--radius-md); background: var(--surface-muted); }
  .top-pick { display: grid; gap: 4px; padding-top: 10px; border-top: 1px solid var(--border); }
  .top-pick:first-of-type { border-top: 0; padding-top: 0; }
  .top-pick strong { color: var(--text-primary); font-size: 13px; font-weight: 650; }
  .top-pick span { color: var(--text-secondary); font-size: 12px; line-height: 1.35; }
  .biggest-edges-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; padding: 10px 16px 16px; }
  .biggest-edge-group { display: grid; align-content: start; gap: 8px; min-width: 0; padding: 12px; border: 1px solid var(--border); border-radius: var(--radius-md); background: var(--surface-muted); }
  .biggest-edge-group h3 { margin: 0; color: var(--text-primary); font-size: 13px; font-weight: 750; }
  .biggest-edge-list { display: grid; gap: 7px; }
  .biggest-edge-pick { display: grid; gap: 5px; width: 100%; min-width: 0; padding: 9px; border: 1px solid var(--border); border-radius: var(--radius-sm); background: var(--surface); color: inherit; text-align: left; }
  .biggest-edge-pick:hover { border-color: color-mix(in srgb, var(--positive) 48%, var(--border)); background: color-mix(in srgb, var(--positive) 7%, var(--surface)); }
  .biggest-edge-pick strong { color: var(--text-primary); font-size: 12px; font-weight: 750; line-height: 1.3; }
  .biggest-edge-pick span { color: var(--text-secondary); font-size: 11px; line-height: 1.35; }
  .biggest-edge-meta { display: flex; flex-wrap: wrap; gap: 4px 7px; font-variant-numeric: tabular-nums; }
  .biggest-edge-meta b { color: var(--text-primary); font-weight: 700; }
  .biggest-edge-empty { color: var(--text-tertiary); font-size: 12px; line-height: 1.4; }
  @media (max-width: 1080px) {
    .compact-scores, .market-grid, .edge-grid, .top-grid, .performance-grid, .results-market-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    .biggest-edges-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .k-section { grid-template-columns: 1fr; }
    .bet-result-item { grid-template-columns: minmax(0, 1fr) auto; }
    .bet-result-units { grid-column: 1 / -1; }
  }
  @media (max-width: 760px) {
    .topbar { align-items: flex-start; flex-direction: column; padding: 18px; }
    .top-actions { width: 100%; flex-wrap: wrap; }
    .mode, .refresh { flex: 1; }
    .shell { padding: 18px; gap: 18px; }
    .compact-scores { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .market-grid, .edge-grid, .top-grid, .k-grid, .performance-grid, .biggest-edges-grid { grid-template-columns: 1fr; }
    .results-market-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .edge-card { grid-template-columns: 1fr; }
    .edge-data { justify-items: start; padding-top: 0; }
    .selected-main { flex-direction: column; }
    .selected-score { font-size: 24px; }
    .table { min-width: 680px; }
    .card:has(.table) { overflow-x: auto; }
  }
  @media (max-width: 460px) {
    .shell { padding: 14px; }
    .card-title { align-items: flex-start; flex-direction: column; gap: 4px; }
    .compact-scores { grid-template-columns: 1fr; }
    .results-market-grid { grid-template-columns: 1fr; }
    .tile-line, .market-main { font-size: 22px; }
  }
`;

function normal(value) {
  return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function clamp(value, low, high) {
  return Math.max(low, Math.min(high, value));
}

function price(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric === 0) return "—";
  return numeric > 0 ? `+${numeric}` : String(numeric);
}

function playToFromFair(fair) {
  const numeric = Number(fair);
  if (!Number.isFinite(numeric)) return null;
  return Math.round(numeric + 10);
}

function validBookPrice(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric !== 0;
}

function americanFromProbability(probability) {
  const probabilityNumber = Number(probability);
  if (!Number.isFinite(probabilityNumber) || probabilityNumber <= 0 || probabilityNumber >= 1) return null;
  if (probabilityNumber >= 0.5) return Math.round(-100 * probabilityNumber / (1 - probabilityNumber));
  return Math.round(100 * (1 - probabilityNumber) / probabilityNumber);
}

function probabilityText(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? `${Math.round(numeric * 100)}%` : "—";
}

function score(value) {
  return Number.isFinite(Number(value)) ? Number(value).toFixed(1) : "—";
}

function signedRun(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return "—";
  return `${numeric > 0 ? "+" : ""}${numeric.toFixed(1)}`;
}

function gradeValue(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric.toFixed(1) : "—";
}

function recordText(wins, losses, pushes = 0) {
  if (!wins && !losses && !pushes) return "—";
  return pushes ? `${wins}-${losses}-${pushes}` : `${wins}-${losses}`;
}

function percentText(wins, attempts) {
  const made = Number(wins);
  const total = Number(attempts);
  if (!Number.isFinite(made) || !Number.isFinite(total) || total <= 0) return "—";
  return `${Math.round((made / total) * 100)}%`;
}

function percentSigned(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return "—";
  return `${numeric > 0 ? "+" : ""}${(numeric * 100).toFixed(1)}%`;
}

function unitText(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return "—";
  return `${numeric > 0 ? "+" : ""}${numeric.toFixed(1)}u`;
}

function trackedMarketText(value) {
  const labels = {
    moneyline: "Moneyline",
    run_line: "Run line",
    full_total: "Full-game total",
    team_total: "Team total",
    f5_moneyline: "F5 moneyline",
    f5_run_line: "F5 run line",
    f5_total: "F5 total",
    pitcher_strikeouts: "Pitcher strikeouts",
    batter_hr: "Homerun",
    batter_home_runs: "Homerun",
    batter_hits: "Hits",
    batter_tb: "Total bases",
    batter_total_bases: "Total bases",
    batter_strikeouts: "Batter strikeouts",
  };
  return labels[value] || String(value || "Bet").replace(/_/g, " ");
}

function resultMarketKey(value) {
  const key = String(value || "").trim().toLowerCase();
  return RESULT_MARKET_ALIASES[key] || key || "other";
}

function resultMarketInfo(value) {
  const key = resultMarketKey(value);
  return RESULT_MARKET_TYPES.find((item) => item.key === key) || {
    key,
    label: trackedMarketText(value),
    rank: 999,
  };
}

function summarizeResultMarket(bets) {
  const settled = bets.filter((bet) => ["Win", "Loss", "Push"].includes(bet?.result));
  const decided = settled.filter((bet) => ["Win", "Loss"].includes(bet?.result));
  const wins = decided.filter((bet) => bet.result === "Win").length;
  const losses = decided.length - wins;
  const pushes = settled.filter((bet) => bet.result === "Push").length;
  const pending = bets.filter((bet) => bet?.result === "Pending").length;
  const voids = bets.filter((bet) => bet?.result === "Void").length;
  const riskedUnits = decided.reduce((sum, bet) => sum + (Number(bet.riskUnits) || 0), 0);
  const netUnits = settled.reduce((sum, bet) => sum + (Number(bet.netUnits) || 0), 0);
  const wonUnits = settled
    .filter((bet) => bet.result === "Win")
    .reduce((sum, bet) => sum + Math.max(0, Number(bet.netUnits) || 0), 0);
  const lostUnits = settled
    .filter((bet) => bet.result === "Loss")
    .reduce((sum, bet) => sum + Math.abs(Math.min(0, Number(bet.netUnits) || 0)), 0);
  return {
    posted: bets.length,
    settled: settled.length,
    decided: decided.length,
    wins,
    losses,
    pushes,
    pending,
    voids,
    netUnits,
    wonUnits,
    lostUnits,
    roi: riskedUnits > 0 ? netUnits / riskedUnits : null,
  };
}

function resultMarketGroups(rows) {
  const groups = new Map();
  for (const row of rows || []) {
    const resultDate = row?.resultDate || "Undated";
    for (const bet of row?.bets || []) {
      if (!bet || typeof bet !== "object") continue;
      const info = resultMarketInfo(bet.market);
      const group = groups.get(info.key) || { info, bets: [] };
      group.bets.push({ ...bet, resultDate, resultMatchup: row.matchup || bet.matchup || "MLB slate", resultId: row.id || resultDate });
      groups.set(info.key, group);
    }
  }
  return [...groups.values()]
    .map((group) => ({
      ...group,
      bets: [...group.bets].sort((a, b) => (
        String(b.resultDate || "").localeCompare(String(a.resultDate || ""))
        || String(a.resultMatchup || "").localeCompare(String(b.resultMatchup || ""))
        || displayBetTitle(a).localeCompare(displayBetTitle(b))
      )),
    }))
    .map((group) => ({ ...group, summary: summarizeResultMarket(group.bets) }))
    .sort((a, b) => a.info.rank - b.info.rank || a.info.label.localeCompare(b.info.label));
}

function resultDateGroups(bets, fallbackDate) {
  const groups = new Map();
  for (const bet of bets || []) {
    const date = String(bet?.resultDate || fallbackDate || "Undated");
    const group = groups.get(date) || [];
    group.push(bet);
    groups.set(date, group);
  }
  return [...groups.entries()]
    .sort(([left], [right]) => String(right).localeCompare(String(left)))
    .map(([date, groupedBets]) => ({ date, bets: groupedBets }));
}

function displayBetTitle(bet) {
  const title = String(bet?.title || "Posted pick");
  const labels = {
    batter_hr: "homerun",
    batter_home_runs: "homerun",
    batter_hits: "hits",
    batter_tb: "total bases",
    batter_total_bases: "total bases",
    batter_strikeouts: "strikeouts",
    pitcher_strikeouts: "strikeouts",
  };
  const market = labels[bet?.market];
  if (!market || normal(title).includes(normal(market))) return title;
  const match = title.match(/^(.*?)(\s+(?:over|under)\s+[-+]?\d+(?:\.\d+)?(?:\s+.*)?)$/i);
  return match ? `${match[1]} ${market}${match[2]}` : `${title} ${market}`;
}

function quoteIsBetter(candidate, current) {
  if (!validBookPrice(candidate?.price)) return false;
  return !current || Number(candidate.price) > Number(current.price);
}

function quoteKey(player, side, line) {
  return `${normal(player)}|${normal(side)}|${Number(line)}`;
}

function propSideKey(side) {
  const value = normal(side);
  if (value.includes("yes") || value.includes("over")) return "over";
  if (value.includes("no") || value.includes("under")) return "under";
  return value || "over";
}

function propQuoteKey(market, player, side, line) {
  const point = Number.isFinite(Number(line)) ? Number(line) : "none";
  return `${normal(market)}|${normal(player)}|${propSideKey(side)}|${point}`;
}

function propMarketLabel(key) {
  if (key === "batter_home_runs") return "Batter HR";
  if (key === "batter_hits") return "Batter hits";
  if (key === "batter_total_bases") return "Batter TB";
  if (key === "batter_strikeouts") return "Batter strikeouts";
  return key;
}

function propMarketText(market) {
  if (market === "Batter TB") return "total bases";
  if (market === "Batter HR") return "homerun";
  if (market === "Batter hits") return "hits";
  if (market === "Batter strikeouts") return "strikeouts";
  return market || "Prop";
}

function gameKey(game) {
  return String(game?.id ?? `${game?.away || "away"}-${game?.home || "home"}`);
}

function isActionTone(tone) {
  return tone === "bet" || tone === "strong";
}

function isGradedBetTone(tone) {
  return tone === "lean" || tone === "bet" || tone === "strong";
}

function tierRank(tone) {
  if (tone === "strong") return 3;
  if (tone === "bet") return 2;
  if (tone === "lean" || tone === "small") return 1;
  return 0;
}

function starterHand(game, side) {
  const keys = [
    `${side}_starter_hand`,
    `${side}_pitcher_hand`,
    `${side}_starter_throws`,
    `${side}_handedness`,
    `${side}_pitch_hand`,
  ];
  const raw = keys.map((key) => game?.[key]).find((value) => value != null && String(value).trim());
  if (raw == null) return null;
  const value = String(raw).trim();
  const normalized = normal(value);
  if (normalized === "l" || normalized.includes("left")) return "L";
  if (normalized === "r" || normalized.includes("right")) return "R";
  if (normalized === "s" || normalized.includes("switch")) return "S";
  return value;
}

function starterLabel(team, name, hand) {
  const starter = name || "TBD";
  return hand ? `${team}: ${starter} (${hand})` : `${team}: ${starter}`;
}

function updatedAgoText(timestamp, now) {
  if (timestamp == null) return null;
  const start = Number(timestamp);
  const current = Number(now);
  if (!Number.isFinite(start) || !Number.isFinite(current)) return null;
  if (start <= 0 || start > current + 60000) return null;
  const seconds = Math.max(0, Math.floor((current - start) / 1000));
  if (seconds > 24 * 60 * 60) return null;
  if (seconds < 30) return "Updated just now";
  if (seconds < 3600) return `Updated ${Math.floor(seconds / 60)}m ago`;
  return `Updated ${Math.floor(seconds / 3600)}h ago`;
}

function moneylineValueMetric(fair, book) {
  const fairProbability = impliedProbability(fair);
  const ev = expectedValuePerUnit(fairProbability, book);
  if (!Number.isFinite(ev)) return null;
  return `${percentSigned(ev)} EV vs fair`;
}

function runGapMetric(fairLine, liveLine) {
  const fair = Number(fairLine);
  const live = Number(liveLine);
  if (!Number.isFinite(fair) || !Number.isFinite(live)) return null;
  return `Fair ${fair.toFixed(1)} vs line ${live.toFixed(1)} · ${signedRun(fair - live)}`;
}

function blendPropFairWithBook(fair, book, oppositeBook = null) {
  const fairProbability = impliedProbability(fair);
  const bookProbability = noVigBookProbability(book, oppositeBook);
  if (!Number.isFinite(fairProbability) || !Number.isFinite(bookProbability)) return fair;
  return americanFromProbability(fairProbability + (bookProbability - fairProbability) * PROP_PRICE_BLEND_WEIGHT);
}

function blankOdds() {
  return { k: {}, pitcherK: {}, batter: {}, teamTotals: [], h2h: {}, totals: [], f5H2h: {}, f5Totals: [] };
}

function defaultGameIndex(games) {
  const index = (games || []).findIndex((game) => {
    const status = normal(game?.status);
    return !status.includes("in progress") && !status.includes("final") && !status.includes("completed") && !status.includes("game over");
  });
  return index >= 0 ? index : 0;
}

function isPregameGame(game) {
  const status = normal(game?.status);
  if (!status) return true;
  if (status.includes("final") || status.includes("completed") || status.includes("game over")) return false;
  if (status.includes("in progress") || status.includes("live")) return false;
  return true;
}

function isFinalStatsGame(statsGame) {
  const status = statsGame?.status || {};
  const state = normal(`${status.abstractGameState || ""} ${status.detailedState || ""} ${status.statusCode || ""}`);
  return state.includes("final") || state.includes("completed") || state.split(" ").includes("f");
}

function statsGameKey(statsGame) {
  return Number(statsGame?.gamePk);
}

function findStatsGameForProjection(statsGames, projection) {
  const projectionId = Number(projection?.id);
  if (Number.isFinite(projectionId)) {
    const byId = statsGames.find((game) => statsGameKey(game) === projectionId);
    if (byId) return byId;
  }
  const away = normal(projection?.away_name || projection?.away);
  const home = normal(projection?.home_name || projection?.home);
  return statsGames.find((game) => {
    const statsAway = normal(game?.teams?.away?.team?.name || game?.teams?.away?.team?.abbreviation);
    const statsHome = normal(game?.teams?.home?.team?.name || game?.teams?.home?.team?.abbreviation);
    return away && home && (statsAway === away || statsAway.includes(away) || away.includes(statsAway)) && (statsHome === home || statsHome.includes(home) || home.includes(statsHome));
  }) || null;
}

function sanitizeBetEdge(edge) {
  if (!edge || !isGradedBetTone(edge.tone)) return null;
  if (!edge.betKind || !validBookPrice(edge.book)) return null;
  return {
    category: edge.category || "Bet",
    betKind: edge.betKind,
    propMarket: edge.propMarket || null,
    player: edge.player || null,
    team: edge.team || null,
    teamSide: edge.teamSide || null,
    betSide: edge.betSide || null,
    line: Number.isFinite(Number(edge.line)) ? Number(edge.line) : null,
    title: edge.title || "Bet",
    subtitle: edge.subtitle || "",
    fair: Number.isFinite(Number(edge.fair)) ? Number(edge.fair) : null,
    book: Number(edge.book),
    bookName: edge.bookName || "Sportsbook",
    label: edge.label || "Lean",
    tone: edge.tone || "lean",
    edge: Number.isFinite(Number(edge.edge)) ? Number(edge.edge) : null,
  };
}

function betEdgesFromDisplay(display) {
  return (display?.allEdges || []).map(sanitizeBetEdge).filter(Boolean);
}

function normalizeBetLedger(ledger) {
  if (!ledger || typeof ledger !== "object") return {};
  const normalized = {};
  for (const [date, games] of Object.entries(ledger)) {
    if (!date || !games || typeof games !== "object") continue;
    const nextGames = {};
    for (const [key, bets] of Object.entries(games)) {
      const cleaned = Array.isArray(bets) ? bets.map(sanitizeBetEdge).filter(Boolean) : [];
      if (cleaned.length) nextGames[key] = cleaned;
    }
    if (Object.keys(nextGames).length) normalized[date] = nextGames;
  }
  return normalized;
}

function mergeBetLedgers(...ledgers) {
  const merged = {};
  for (const ledger of ledgers.map(normalizeBetLedger)) {
    for (const [date, games] of Object.entries(ledger)) {
      merged[date] = { ...(merged[date] || {}), ...games };
    }
  }
  return merged;
}

function countBetLedgerEntries(games) {
  return Object.values(games || {}).reduce((sum, bets) => sum + (Array.isArray(bets) ? bets.length : 0), 0);
}

function readStoredBetLedger(date) {
  return date ? {} : {};
}

function writeStoredBetLedger(date, displays) {
  if (!date) return 0;
  const gameBets = {};
  for (const display of displays || []) {
    const bets = betEdgesFromDisplay(display);
    if (bets.length) gameBets[gameKey(display.game)] = bets;
  }
  return countBetLedgerEntries(gameBets);
}

function firstFiveScores(feed) {
  const innings = feed?.liveData?.linescore?.innings;
  if (!Array.isArray(innings) || innings.length < 5) return null;
  const firstFive = innings.slice(0, 5);
  const away = firstFive.reduce((sum, inning) => sum + (Number(inning?.away?.runs) || 0), 0);
  const home = firstFive.reduce((sum, inning) => sum + (Number(inning?.home?.runs) || 0), 0);
  return { away, home, total: away + home };
}

function findBoxPlayerStats(feed, playerName, group) {
  const wanted = normal(playerName);
  if (!wanted) return null;
  const teams = feed?.liveData?.boxscore?.teams || {};
  for (const side of ["away", "home"]) {
    for (const player of Object.values(teams?.[side]?.players || {})) {
      const fullName = player?.person?.fullName;
      const name = normal(fullName);
      if (!name || (name !== wanted && !name.includes(wanted) && !wanted.includes(name))) continue;
      return player?.stats?.[group] || null;
    }
  }
  return null;
}

function compareTotalSide(value, line, side) {
  const actual = Number(value);
  const target = Number(line);
  const betSide = normal(side);
  if (!Number.isFinite(actual) || !Number.isFinite(target) || !betSide) return { result: "Pending", correct: null, push: false };
  if (actual === target) return { result: "Push", correct: null, push: true };
  const won = betSide.includes("over") ? actual > target : actual < target;
  return { result: won ? "Hit" : "Miss", correct: won, push: false };
}

function gradeBet(edge, projection, actual, feed) {
  const base = {
    ...edge,
    result: "Pending",
    correct: null,
    push: false,
    actual: null,
  };
  if (edge.betKind === "moneyline") {
    if (actual.side === "tie") return { ...base, result: "Push", push: true };
    const won = edge.betSide === actual.side;
    return { ...base, result: won ? "Hit" : "Miss", correct: won, actual: actual.side === "away" ? projection.away : projection.home };
  }
  if (edge.betKind === "full_total") {
    const graded = compareTotalSide(actual.total, edge.line, edge.betSide);
    return { ...base, ...graded, actual: actual.total };
  }
  if (edge.betKind === "team_total") {
    const teamRuns = edge.teamSide === "away" ? actual.away : edge.teamSide === "home" ? actual.home : null;
    const graded = compareTotalSide(teamRuns, edge.line, edge.betSide);
    return { ...base, ...graded, actual: teamRuns };
  }
  if (edge.betKind === "f5_moneyline" || edge.betKind === "f5_total") {
    const f5 = firstFiveScores(feed);
    if (!f5) return base;
    if (edge.betKind === "f5_total") {
      const graded = compareTotalSide(f5.total, edge.line, edge.betSide);
      return { ...base, ...graded, actual: f5.total };
    }
    const f5Side = f5.home > f5.away ? "home" : f5.away > f5.home ? "away" : "tie";
    if (f5Side === "tie") return { ...base, result: "Push", push: true, actual: "Tie" };
    const won = edge.betSide === f5Side;
    return { ...base, result: won ? "Hit" : "Miss", correct: won, actual: f5Side === "away" ? projection.away : projection.home };
  }
  if (edge.betKind === "pitcher_strikeouts") {
    const stats = findBoxPlayerStats(feed, edge.player, "pitching");
    const strikeouts = Number(stats?.strikeOuts);
    const graded = compareTotalSide(strikeouts, edge.line, edge.betSide);
    return { ...base, ...graded, actual: Number.isFinite(strikeouts) ? strikeouts : null };
  }
  if (edge.betKind === "batter_prop") {
    const stats = findBoxPlayerStats(feed, edge.player, "batting");
    const market = edge.propMarket;
    const value = market === "Batter HR"
      ? Number(stats?.homeRuns)
      : market === "Batter hits"
        ? Number(stats?.hits)
        : market === "Batter TB"
          ? Number(stats?.totalBases)
          : market === "Batter strikeouts"
            ? Number(stats?.strikeOuts)
            : NaN;
    const graded = compareTotalSide(value, edge.line, edge.betSide);
    return { ...base, ...graded, actual: Number.isFinite(value) ? value : null };
  }
  return base;
}

function gradeCompletedGames(projections, statsGames, displayByGame = {}, detailByGame = {}, storedBetLedger = {}) {
  return (projections || []).map((projection) => {
    const statsGame = findStatsGameForProjection(statsGames || [], projection);
    if (!statsGame || !isFinalStatsGame(statsGame)) return null;
    const actualAway = Number(statsGame?.teams?.away?.score);
    const actualHome = Number(statsGame?.teams?.home?.score);
    const projectedAway = Number(projection?.away_score);
    const projectedHome = Number(projection?.home_score);
    if (![actualAway, actualHome, projectedAway, projectedHome].every(Number.isFinite)) return null;
    const projectedTotal = Number.isFinite(Number(projection?.total)) ? Number(projection.total) : projectedAway + projectedHome;
    const actualTotal = actualAway + actualHome;
    const projectedMargin = projectedHome - projectedAway;
    const actualMargin = actualHome - actualAway;
    const actualSide = actualMargin > 0 ? "home" : actualMargin < 0 ? "away" : "tie";
    const actualWinner = actualSide === "away" ? projection.away : actualSide === "home" ? projection.home : "Tie";
    const totalDelta = actualTotal - projectedTotal;
    const totalError = Math.abs(totalDelta);
    const key = gameKey(projection);
    const liveBets = betEdgesFromDisplay(displayByGame[key]);
    const savedBets = storedBetLedger[key] || [];
    const betsToGrade = liveBets.length ? liveBets : savedBets;
    if (!betsToGrade.length) return null;
    const actual = { away: actualAway, home: actualHome, total: actualTotal, side: actualSide };
    const feed = detailByGame[String(statsGame.gamePk)] || detailByGame[key] || null;
    const gradedAllBets = betsToGrade.map((edge) => gradeBet(edge, projection, actual, feed));
    const bets = gradedAllBets.filter((bet) => bet.result !== "Pending");
    const pendingBets = gradedAllBets.filter((bet) => bet.result === "Pending");
    const betWins = bets.filter((bet) => bet.correct === true).length;
    const betLosses = bets.filter((bet) => bet.correct === false).length;
    const betPushes = bets.filter((bet) => bet.push).length;
    return {
      id: projection.id || statsGame.gamePk,
      matchup: `${projection.away} @ ${projection.home}`,
      projected: `${projection.away} ${score(projectedAway)} · ${score(projectedHome)} ${projection.home}`,
      final: `${projection.away} ${actualAway} · ${actualHome} ${projection.home}`,
      savedBetCount: betsToGrade.length,
      betCount: bets.length,
      betWins,
      betLosses,
      betPushes,
      bets,
      pendingBetCount: pendingBets.length,
      pendingBets: pendingBets.slice(0, 3),
      actualWinner,
      scoreMae: (Math.abs(actualAway - projectedAway) + Math.abs(actualHome - projectedHome)) / 2,
      totalError,
      marginError: Math.abs(actualMargin - projectedMargin),
      totalDelta,
      resultDate: projection.date || BOARD.date || null,
    };
  }).filter(Boolean);
}

function resultIdentity(row) {
  return String(row?.id ?? `${row?.matchup || "game"}-${row?.final || ""}`);
}

function normalizeResultsHistory(history) {
  if (!history || typeof history !== "object") return {};
  const entries = Array.isArray(history)
    ? history.map((item) => [item?.date, item?.rows])
    : Object.entries(history);
  const normalized = {};
  for (const [date, rows] of entries) {
    if (!date || !Array.isArray(rows) || !rows.length) continue;
    normalized[date] = rows
      .filter((row) => row && typeof row === "object")
      .map((row) => ({ ...row, resultDate: row.resultDate || date }));
  }
  return normalized;
}

function readStoredResultsHistory() {
  return {};
}

function writeStoredResultsHistory(history) {
  return normalizeResultsHistory(history);
}

function mergeResultsHistories(...histories) {
  const merged = {};
  for (const history of histories) {
    const normalized = normalizeResultsHistory(history);
    for (const [date, rows] of Object.entries(normalized)) {
      const byId = new Map((merged[date] || []).map((row) => [resultIdentity(row), row]));
      for (const row of rows) byId.set(resultIdentity(row), { ...row, resultDate: row.resultDate || date });
      merged[date] = [...byId.values()];
    }
  }
  return merged;
}

function mergeResultsRowsForDate(history, date, rows) {
  if (!date || !Array.isArray(rows) || !rows.length) return normalizeResultsHistory(history);
  return mergeResultsHistories(history, { [date]: rows.map((row) => ({ ...row, resultDate: row.resultDate || date })) });
}

function flattenResultsHistory(history) {
  return Object.entries(normalizeResultsHistory(history))
    .sort(([a], [b]) => String(b).localeCompare(String(a)))
    .flatMap(([date, rows]) => rows.map((row) => ({ ...row, resultDate: row.resultDate || date })))
    .filter((row) => (
      Number(row.savedBetCount)
      || Number(row.betCount)
      || Number(row.pendingBetCount)
      || (Array.isArray(row.bets) ? row.bets.length : 0)
    ));
}

function resultDateRange(rows) {
  const dates = [...new Set((rows || []).map((row) => row.resultDate).filter(Boolean))].sort();
  if (!dates.length) return "No finals saved yet";
  if (dates.length === 1) return `Date ${dates[0]}`;
  return `${dates[0]} through ${dates[dates.length - 1]} · ${dates.length} dates`;
}

function summarizeResults(rows) {
  const bets = (rows || []).flatMap((row) => Array.isArray(row.bets) ? row.bets : []);
  const settledBets = bets.filter((bet) => ["Win", "Loss", "Push"].includes(bet?.result));
  const decidedBets = settledBets.filter((bet) => ["Win", "Loss"].includes(bet?.result));
  const wins = decidedBets.filter((bet) => bet.result === "Win").length;
  const losses = decidedBets.length - wins;
  const pushes = settledBets.filter((bet) => bet.result === "Push").length;
  const pendingBets = bets.filter((bet) => bet?.result === "Pending").length;
  const riskedUnits = decidedBets.reduce((sum, bet) => sum + (Number(bet.riskUnits) || 0), 0);
  const netUnits = settledBets.reduce((sum, bet) => sum + (Number(bet.netUnits) || 0), 0);
  const roi = riskedUnits > 0 ? netUnits / riskedUnits : null;
  const metrics = [
    { label: "Posted picks", value: String(bets.length) },
    ...(settledBets.length ? [{ label: "Record", value: recordText(wins, losses, pushes) }] : []),
    ...(decidedBets.length ? [{ label: "Accuracy", value: percentText(wins, decidedBets.length) }] : []),
    ...(settledBets.length ? [{ label: "Net units", value: unitText(netUnits) }] : []),
    ...(roi != null ? [{ label: "ROI", value: percentSigned(roi) }] : []),
    ...(pendingBets ? [{ label: "Open", value: String(pendingBets) }] : []),
  ];
  return metrics.filter((metric) => metric.value !== "—");
}

async function fetchJsonWithTimeout(url, timeoutMs = 3500) {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { headers: { accept: "application/json" }, signal: controller.signal });
    if (!response.ok) return null;
    return response.json();
  } finally {
    window.clearTimeout(timer);
  }
}

function poissonOverProbability(meanValue, line) {
  const mean = Number(meanValue);
  const target = Number(line);
  if (!Number.isFinite(mean) || !Number.isFinite(target) || mean <= 0) return null;
  const threshold = Math.floor(target);
  let cumulative = 0;
  let term = Math.exp(-mean);
  for (let k = 0; k <= threshold; k += 1) {
    if (k > 0) term *= mean / k;
    cumulative += term;
  }
  return clamp(1 - cumulative, 0.01, 0.99);
}

function fairFromProjection(projected, line) {
  const projection = Number(projected);
  const bookLine = Number(line);
  if (!Number.isFinite(projection) || !Number.isFinite(bookLine)) return { over: null, under: null };
  const overProbability = poissonOverProbability(projection, bookLine) ?? clamp(1 / (1 + Math.exp(-(projection - bookLine) / K_FAIR_SCALE)), 0.08, 0.92);
  return { over: americanFromProbability(overProbability), under: americanFromProbability(1 - overProbability) };
}

function exactPitcherKBook(pitcherK, player, line) {
  const rows = pitcherK[normal(player)] || [];
  const target = Number(line);
  if (!Number.isFinite(target)) return null;
  return rows.find((row) => Number(row.line) === target) || null;
}

function findPitcherKBook(pitcherK, player, fallbackLine) {
  const rows = pitcherK[normal(player)] || [];
  if (!rows.length) return null;
  const target = Number(fallbackLine);
  if (!Number.isFinite(target)) return rows[0] || null;
  return [...rows].sort((a, b) => Math.abs(Number(a.line) - target) - Math.abs(Number(b.line) - target))[0] || null;
}

function lineInputValue(line) {
  const numeric = Number(line);
  if (!Number.isFinite(numeric)) return "";
  return String(numeric);
}

function isHitterPropEdge(edge) {
  if (edge?.betKind !== "batter_prop") return false;
  return ["batter hr", "batter home runs", "batter hits", "batter tb", "batter total bases"].includes(normal(edge.propMarket));
}

function isStrikeoutEdge(edge) {
  return edge?.betKind === "pitcher_strikeouts"
    || (edge?.betKind === "batter_prop" && normal(edge.propMarket) === "batter strikeouts");
}

function biggestEdgeValue(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : -Infinity;
}

function rankBiggestEdges(edges, predicate) {
  return (edges || [])
    .filter((edge) => isGradedBetTone(edge?.tone) && predicate(edge))
    .sort((left, right) => (
      biggestEdgeValue(right.edge) - biggestEdgeValue(left.edge)
      || tierRank(right.tone) - tierRank(left.tone)
      || String(left.title || "").localeCompare(String(right.title || ""))
    ))
    .slice(0, 3);
}

function BiggestEdgesBoard({ edges, hasOdds, onSelectGame }) {
  if (!hasOdds) return null;
  const sections = [
    ["Best moneylines", rankBiggestEdges(edges, (edge) => edge.betKind === "moneyline")],
    ["Best props", rankBiggestEdges(edges, isHitterPropEdge)],
    ["Best strikeouts", rankBiggestEdges(edges, isStrikeoutEdge)],
    ["Best totals", rankBiggestEdges(edges, (edge) => ["full_total", "team_total", "f5_total"].includes(edge.betKind))],
  ];
  return <section className="card" aria-label="Biggest full-slate edges">
    <div className="card-title"><h2>Biggest edges</h2><span className="muted">Price-gated full slate</span></div>
    <div className="biggest-edges-grid">
      {sections.map(([title, items]) => <article className="biggest-edge-group" key={title}>
        <h3>{title}</h3>
        <div className="biggest-edge-list">
          {items.length ? items.map((edge, index) => <button
            className="biggest-edge-pick"
            type="button"
            key={`${title}-${edge.gameKey || edge.gameLabel || "game"}-${edge.title}-${index}`}
            onClick={() => onSelectGame(edge.gameIndex)}
          >
            <strong>{edge.title}</strong>
            <span>{edge.gameLabel} · {edge.label}</span>
            <span className="biggest-edge-meta">Fair <b>{edge.fairDisplay || price(edge.fair)}</b> · Book <b>{edge.bookDisplay || price(edge.book)}</b> · {edge.bookName || "Sportsbook"}</span>
          </button>) : <span className="biggest-edge-empty">No price-gated edge.</span>}
        </div>
      </article>)}
    </div>
  </section>;
}

function Scoreboard({ games, gameIndex, onSelect, edgeCounts }) {
  return <section className="card">
    <div className="card-title"><h2>Projected scores</h2><span className="muted">{games.length} games · tap a game for detail</span></div>
    <div className="compact-scores">
      {games.map((item, index) => {
        const moneylineFairs = baseMoneylineFairs(item);
        const favorite = favoriteFromMoneyline(item, moneylineFairs);
        const awayScore = Number(item.away_score);
        const homeScore = Number(item.home_score);
        const awayHigh = Number.isFinite(awayScore) && Number.isFinite(homeScore) && awayScore > homeScore;
        const homeHigh = Number.isFinite(awayScore) && Number.isFinite(homeScore) && homeScore > awayScore;
        const edgeCount = edgeCounts?.[gameKey(item)] || 0;
        return <button className={`score-tile ${index === gameIndex ? "active" : ""}`} type="button" key={`${item.id || index}-${item.away}-${item.home}`} onClick={() => onSelect(index)}>
          <span className="tile-head"><span>{item.away} @ {item.home}</span><span>{item.time || item.status || "—"}</span></span>
          <span className="tile-line"><span className={awayHigh ? "score-high" : ""}><small>{item.away}</small><b>{score(item.away_score)}</b></span><span className={homeHigh ? "score-high" : ""}><b>{score(item.home_score)}</b><small>{item.home}</small></span></span>
          <span className="tile-meta">
            <span>Total {score(item.total)}</span>
            <span className="tile-meta-right">
              <span>{favorite ? `${favorite.team} ${Math.round(favorite.probability * 100)}%` : "—"}</span>
              {edgeCount ? <span className="edge-badge">{edgeCount} edge{edgeCount === 1 ? "" : "s"}</span> : null}
            </span>
          </span>
        </button>;
      })}
    </div>
  </section>;
}

function limitRowsPerTeam(rows, limit = 3) {
  const counts = {};
  const output = [];
  for (const row of rows || []) {
    const team = row.team || "unknown";
    counts[team] = counts[team] || 0;
    if (counts[team] >= limit) continue;
    counts[team] += 1;
    output.push(row);
  }
  return output;
}

function prioritizeBatterPropAngles(angles, limit = 3) {
  const byTeam = new Map();
  for (const angle of angles || []) {
    if (!angle?.player || !angle?.market) continue;
    const team = angle.team || "unknown";
    if (!byTeam.has(team)) byTeam.set(team, []);
    byTeam.get(team).push(angle);
  }
  const output = [];
  for (const teamAngles of byTeam.values()) {
    const homeruns = teamAngles.filter((angle) => angle.market === "Batter HR");
    const otherAngles = teamAngles.filter((angle) => angle.market !== "Batter HR");
    const hrCount = Math.min(homeruns.length, 1);
    output.push(...homeruns.slice(0, hrCount), ...otherAngles.slice(0, Math.max(0, limit - hrCount)));
  }
  return output;
}

function TierLegend() {
  return <details className="tier-legend">
    <summary>Tier guide</summary>
    <div>
      <span><b>Strong bet:</b> best actionable sportsbook gap.</span>
      <span><b>Bet:</b> clear sportsbook gap.</span>
      <span><b>Lean / small edge:</b> thinner gap, worth monitoring.</span>
      <span><b>No edge:</b> book price has not cleared fair.</span>
    </div>
  </details>;
}

function PricedEdgeBoard({ edges, hasOdds, view, onViewChange, tier, onTierChange }) {
  const visibleEdges = tier === "all" ? edges : edges.filter((edge) => edge.tone === tier);
  const tierLabel = tier === "all" ? "all tiers" : tier === "strong" ? "strong bets" : `${tier}s`;
  const status = visibleEdges.length ? `${visibleEdges.length} ${tierLabel}` : hasOdds ? `No ${tierLabel} on this board` : "Waiting for odds";
  return <section className="card">
    <div className="card-title">
      <h2>Edge board</h2>
      <div className="edge-controls">
        <span className="muted">{status} · props + markets</span>
        <div className="segmented" aria-label="Priced edge scope">
          <button type="button" className={view === "game" ? "active" : ""} onClick={() => onViewChange("game")}>This game</button>
          <button type="button" className={view === "slate" ? "active" : ""} onClick={() => onViewChange("slate")}>Full slate</button>
        </div>
        <label className="edge-tier-filter">
          <span>Tier</span>
          <select value={tier} onChange={(event) => onTierChange(event.target.value)} aria-label="Filter edge tier">
            <option value="all">All tiers</option>
            <option value="strong">Strong bets</option>
            <option value="bet">Bets</option>
            <option value="lean">Leans</option>
          </select>
        </label>
        <TierLegend />
      </div>
    </div>
    {visibleEdges.length ? <div className="edge-grid">
      {visibleEdges.slice(0, view === "slate" ? 12 : 8).map((edge, index) => <article className={`edge-card ${edge.tone || "lean"}`} key={`${edge.title}-${edge.gameLabel || ""}-${index}`}>
        <div className="edge-main">
          <span className="edge-category">{edge.category || "Edge"}</span>
          <strong>{edge.title}</strong>
          <span>{edge.gameLabel ? `${edge.gameLabel} · ${edge.subtitle}` : edge.subtitle}</span>
        </div>
        <div className="edge-data">
          <span>Fair <b>{edge.fairDisplay || price(edge.fair)}</b></span>
          <span>Book <b>{edge.bookDisplay || price(edge.book)}</b></span>
          <span>{edge.bookName || "Sportsbook"}</span>
        </div>
        <span className={`pill ${edge.tone || "lean"}`}>{edge.label}</span>
      </article>)}
    </div> : <div className="empty-state">{hasOdds ? `No ${tierLabel} cleared the current book numbers.` : "Refresh pregame odds to populate prop and market edges. No book price, no edge label."}</div>}
  </section>;
}

function BatterKTargetsBoard({ targets }) {
  if (!targets.length) return null;
  return <section className="card">
    <div className="card-title"><h2>Batter K target fairs</h2><span className="muted">Fair only · no book prices required</span></div>
    <div className="k-section single">
      <div className="k-panel">
        <div className="k-grid">
          {targets.map((target, index) => <article className="k-card" key={`${target.batter}-${target.pitcher}-${index}`}>
            <div className="k-card-head">
              <strong>{target.batter || "Batter"} over {target.line ?? "—"} K</strong>
              <span className="pill watch">Fair only</span>
            </div>
            <span>{target.team || "—"} vs {target.pitcher || "starter"} · {target.pitch_name || target.pitch_type || "Pitch"} {Number.isFinite(Number(target.usage)) ? `${Math.round(Number(target.usage))}%` : "—"}</span>
            <div className="mini-stats">
              <span>Fair <b>{price(target.fair)}</b></span>
              <span>Prob <b>{probabilityText(target.probability)}</b></span>
            </div>
            <span className="fair-note">Play-to {price(target.play_to)}</span>
          </article>)}
        </div>
      </div>
    </div>
  </section>;
}

function PlayerPropAnglesBoard({ angles, pitcherRows, kMode, onKModeChange, lineOverrides, onLineChange }) {
  const rows = prioritizeBatterPropAngles((angles || []).filter((angle) => angle?.hasBook), 3);
  const kRows = (pitcherRows || []).filter((row) => row?.hasBook);
  if (!rows.length && !kRows.length) return null;
  return <section className="card">
    <div className="card-title">
      <h2>Player prop angles</h2>
      <div className="edge-controls">
        <span className="muted">Current pregame book price</span>
        {kRows.length ? <div className="segmented" aria-label="K projection mode">
          <button type="button" className={kMode === "base" ? "active" : ""} onClick={() => onKModeChange("base")}>Base K</button>
          <button type="button" className={kMode === "ceiling" ? "active" : ""} onClick={() => onKModeChange("ceiling")}>Ceiling K</button>
        </div> : null}
      </div>
    </div>
    <div className="angle-list">
      {kRows.map((row) => {
        const lineValue = lineOverrides[row.key] ?? lineInputValue(row.line);
        return <article className="angle" key={row.key}>
          <div className="angle-top">
            <div>
              <h3>{row.player || "Starter"} strikeouts</h3>
              <p className="muted">{kMode === "base" ? "Base" : "Ceiling"} projection {score(row.projected)} K · selected market line</p>
            </div>
            <span className="pill watch">Pregame price</span>
          </div>
          <label className="line-control" style={{ marginTop: 12, maxWidth: 220 }}>
            <span>K line</span>
            <input
              type="number"
              inputMode="decimal"
              step="0.5"
              min="0.5"
              value={lineValue}
              onChange={(event) => onLineChange(row.key, event.target.value)}
            />
          </label>
          <div className="prices">
            <span>Over fair <b>{price(row.fair)}</b></span>
            <span>Under fair <b>{price(row.underFair)}</b></span>
            {row.hasBook ? <span>Book <b>{pairedBookMeta("O", row.overBook)} / {pairedBookMeta("U", row.underBook)}</b></span> : null}
          </div>
          {row.explainer ? <p className="muted">{row.explainer}</p> : null}
        </article>;
      })}
      {rows.map((angle, index) => <article className="angle" key={`${angle.player}-${angle.market}-${index}`}>
        <div className="angle-top">
          <div>
            <h3>{angle.player} {propMarketText(angle.market)} {angle.side || "Over"} {angle.line ?? "—"}</h3>
            <p className="muted">{angle.team || "—"} vs {angle.pitcher || "starter"} · {angle.pitch_name || angle.pitch_type || "Pitch"} {Number.isFinite(Number(angle.usage)) ? `${Math.round(Number(angle.usage))}%` : "—"}</p>
          </div>
          <span className={`pill ${angle.designation?.tone || "watch"}`}>{angle.designation?.label || "Watch price"}</span>
        </div>
        <div className="prices">
          <span>Fair <b>{price(angle.fair)}</b></span>
          <span>Play-to <b>{price(angle.play_to)}</b></span>
          <span>Prob <b>{probabilityText(angle.probability)}</b></span>
          <span>Book <b>{price(angle.book?.price)} · {angle.book?.book || "—"}</b></span>
        </div>
        {angle.explainer ? <p className="muted">{angle.explainer}</p> : null}
      </article>)}
    </div>
  </section>;
}

function resultTone(value, correct, push) {
  if (value === "Void") return "neutral";
  if (push || value === "Push") return "push";
  if (correct === true || value === "Hit" || value === "Win") return "hit";
  if (correct === false || value === "Miss" || value === "Loss") return "miss";
  return "neutral";
}

function ResultsPerformance({ rows, date }) {
  const bets = (rows || []).flatMap((row) => Array.isArray(row.bets) ? row.bets : []);
  if (!bets.length) return null;
  const metrics = summarizeResults(rows);
  const marketGroups = resultMarketGroups(rows);
  const titleBits = [
    resultDateRange(rows),
    "captured pregame prices",
  ].filter(Boolean);
  return <section className="card">
    <div className="card-title"><h2>Results dashboard</h2><span className="muted">{titleBits.join(" · ")}</span></div>
    <div className="performance-grid">
      {metrics.map((metric) => <article className="performance-card" key={metric.label}>
        <span>{metric.label}</span>
        <strong>{metric.value}</strong>
      </article>)}
    </div>
    <section className="results-market-summary" aria-label="Cumulative performance by market">
      <div className="results-section-label">Cumulative by market · all posted sides and props</div>
      <div className="results-market-grid">
        {marketGroups.map((group) => {
          const summary = group.summary;
          const mainValue = summary.decided ? recordText(summary.wins, summary.losses, summary.pushes) : summary.pending ? `${summary.pending} open` : summary.voids ? `${summary.voids} void` : "—";
          const secondaryValue = summary.decided ? `Accuracy ${percentText(summary.wins, summary.decided)}` : summary.settled ? `${summary.settled} settled` : "Awaiting result";
          return <article className="market-performance-card" key={group.info.key}>
            <div className="market-performance-head"><strong>{group.info.label}</strong><span>{summary.posted} posted</span></div>
            <div className="market-performance-main"><strong>{mainValue}</strong><span>{secondaryValue}</span></div>
            <div className="market-performance-footer">
              {summary.decided ? <span>Won {unitText(summary.wonUnits)}</span> : null}
              {summary.decided ? <span>Lost {unitText(-summary.lostUnits)}</span> : null}
              {summary.settled ? <span>Net {unitText(summary.netUnits)}</span> : null}
              {summary.roi != null ? <span>ROI {percentSigned(summary.roi)}</span> : null}
              {summary.pending ? <span>{summary.pending} open</span> : null}
              {summary.voids ? <span>{summary.voids} void</span> : null}
            </div>
          </article>;
        })}
      </div>
    </section>
    <details className="results-details">
      <summary>Posted picks by bet type ({bets.length})</summary>
      <div className="results-list">
        {marketGroups.map((group) => <article className="market-result-group" key={group.info.key}>
          <div className="market-result-head">
            <div>
              <h3>{group.info.label}</h3>
              <span>{group.summary.posted} posted · {group.summary.pending ? `${group.summary.pending} open` : `${group.summary.settled} settled`}</span>
            </div>
            {group.summary.decided ? <span className="market-result-record">{recordText(group.summary.wins, group.summary.losses, group.summary.pushes)} · {unitText(group.summary.netUnits)}</span> : null}
          </div>
          {resultDateGroups(group.bets, date).map((dateGroup) => <section className="market-result-date" key={dateGroup.date}>
            <div className="market-result-date-head"><strong>{dateGroup.date}</strong><span>{dateGroup.bets.length} posted</span></div>
            <div className="bet-result-list">
              {dateGroup.bets.map((bet, index) => <div className="bet-result-item" key={`${bet.resultId}-${bet.resultDate}-${bet.market}-${bet.title}-${index}`}>
                <div className="bet-result-copy">
                  <strong>{displayBetTitle(bet)}</strong>
                  <span>{bet.resultMatchup || bet.matchup || trackedMarketText(bet.market)} · {bet.book || "—"} {price(bet.bookOdds)}</span>
                </div>
                <span className={`result-pill ${resultTone(bet.result)}`}>{bet.result || "Pending"}</span>
                <span className="bet-result-units">{bet.result === "Pending" ? `Risk ${unitText(bet.riskUnits)}` : bet.result === "Void" ? "No action" : unitText(bet.netUnits)}</span>
              </div>)}
            </div>
          </section>)}
        </article>)}
      </div>
    </details>
  </section>;
}

function ModelFooter({ games, message }) {
  const totals = (games || []).map((game) => Number(game.total)).filter(Number.isFinite);
  const avgTotal = totals.length ? totals.reduce((sum, value) => sum + value, 0) / totals.length : null;
  const highest = [...(games || [])].filter((game) => Number.isFinite(Number(game.total))).sort((a, b) => Number(b.total) - Number(a.total))[0];
  const tight = [...(games || [])].filter((game) => Number.isFinite(Number(game.away_score)) && Number.isFinite(Number(game.home_score))).sort((a, b) => Math.abs(Number(a.away_score) - Number(a.home_score)) - Math.abs(Number(b.away_score) - Number(b.home_score)))[0];
  return <footer className="card model-footer">
    <div className="footer-grid">
      <span>Model snapshot: {BOARD.date || "—"}</span>
      <span>{games.length} games</span>
      <span>Avg total {score(avgTotal)}</span>
      <span>Highest total {highest ? `${highest.away}/${highest.home} ${score(highest.total)}` : "—"}</span>
      <span>Closest game {tight ? `${tight.away}/${tight.home}` : "—"}</span>
      <span>{message || "Props are odds-gated; no book number, no bet label."}</span>
    </div>
  </footer>;
}

function favoriteForGame(game) {
  return favoriteFromMoneyline(game, baseMoneylineFairs(game));
}

function favoriteFromMoneyline(game, moneylineFairs) {
  const homeProbability = Number(moneylineFairs?.home_probability);
  const awayProbability = Number(moneylineFairs?.away_probability);
  if (!Number.isFinite(homeProbability) || !Number.isFinite(awayProbability)) return null;
  if (homeProbability >= awayProbability) return { team: game.home, probability: homeProbability };
  return { team: game.away, probability: awayProbability };
}

function specialEventFavorite(event) {
  const homeProbability = Number(event?.home_win_probability);
  if (!Number.isFinite(homeProbability)) return null;
  const awayProbability = 1 - homeProbability;
  if (homeProbability >= awayProbability) return { team: event.home_name || event.home, probability: homeProbability };
  return { team: event.away_name || event.away, probability: awayProbability };
}

function baseMoneylineFairs(game) {
  const homeProbability = Number(game?.moneyline_fairs?.home_probability ?? game?.home_win_probability);
  const awayProbability = Number(game?.moneyline_fairs?.away_probability ?? (Number.isFinite(homeProbability) ? 1 - homeProbability : null));
  return {
    away_probability: Number.isFinite(awayProbability) ? awayProbability : null,
    home_probability: Number.isFinite(homeProbability) ? homeProbability : null,
    away_fair: game?.moneyline_fairs?.away_fair ?? americanFromProbability(awayProbability),
    home_fair: game?.moneyline_fairs?.home_fair ?? americanFromProbability(homeProbability),
  };
}

function impliedProbability(priceValue) {
  const priceNumber = Number(priceValue);
  if (!validBookPrice(priceNumber)) return null;
  return priceNumber < 0 ? Math.abs(priceNumber) / (Math.abs(priceNumber) + 100) : 100 / (priceNumber + 100);
}

function noVigBookProbability(book, oppositeBook = null) {
  const sideProbability = impliedProbability(book);
  if (!Number.isFinite(sideProbability)) return null;
  const oppositeProbability = impliedProbability(oppositeBook);
  if (!Number.isFinite(oppositeProbability)) return sideProbability;
  const total = sideProbability + oppositeProbability;
  return total > 0 ? sideProbability / total : sideProbability;
}

function bookProfitPerUnit(priceValue) {
  const priceNumber = Number(priceValue);
  if (!validBookPrice(priceNumber)) return null;
  return priceNumber > 0 ? priceNumber / 100 : 100 / Math.abs(priceNumber);
}

function expectedValuePerUnit(fairProbability, book) {
  const profit = bookProfitPerUnit(book);
  const probability = Number(fairProbability);
  if (!Number.isFinite(probability) || !Number.isFinite(profit)) return null;
  return probability * profit - (1 - probability);
}

function probabilityEdgeMetric(edge) {
  const numeric = Number(edge);
  if (!Number.isFinite(numeric)) return null;
  return `${numeric > 0 ? "+" : ""}${(numeric * 100).toFixed(1)}% implied edge`;
}

function tieredDesignation(edge, ev, detailWhenLive, noEdgeDetail = "Book price has not cleared fair.") {
  const edgeNumber = Number(edge);
  const evNumber = Number(ev);
  if (!Number.isFinite(edgeNumber)) {
    return { label: "Watch price", tone: "watch", detail: "No pregame book price yet." };
  }
  const detail = detailWhenLive || `${probabilityEdgeMetric(edgeNumber)} vs book.`;
  if (edgeNumber >= STRONG_PROB_EDGE || evNumber >= 0.07) return { label: "Strong bet", tone: "strong", detail, edgeScore: edgeNumber, ev: evNumber };
  if (edgeNumber >= BET_PROB_EDGE || evNumber >= 0.04) return { label: "Bet", tone: "bet", detail, edgeScore: edgeNumber, ev: evNumber };
  if (edgeNumber >= LEAN_PROB_EDGE || evNumber > 0.015) return { label: "Lean", tone: "lean", detail: `${detail} Thin margin.`, edgeScore: edgeNumber, ev: evNumber };
  return { label: "No edge", tone: "pass", detail: noEdgeDetail, edgeScore: edgeNumber, ev: evNumber };
}

function designationForOdds(fair, book, oppositeBook = null) {
  const fairProbability = impliedProbability(fair);
  const bookProbability = noVigBookProbability(book, oppositeBook);
  if (!Number.isFinite(fairProbability) || !Number.isFinite(bookProbability) || !validBookPrice(book)) {
    return { label: "Watch price", tone: "watch", detail: "No pregame book price yet.", edgeScore: null };
  }
  const edge = fairProbability - bookProbability;
  const ev = expectedValuePerUnit(fairProbability, book);
  const detail = `${probabilityEdgeMetric(edge)} · fair ${price(fair)} vs book ${price(book)}.`;
  return tieredDesignation(edge, ev, detail);
}

function teamSideFromText(text, game) {
  const value = normal(text);
  if (!value) return null;
  const awayFull = normal(game?.away_name);
  const homeFull = normal(game?.home_name);
  const awayAbbr = normal(game?.away);
  const homeAbbr = normal(game?.home);
  if (value === awayAbbr || value.includes(awayFull) || awayFull.includes(value)) return "away";
  if (value === homeAbbr || value.includes(homeFull) || homeFull.includes(value)) return "home";
  return null;
}

function setBestTeamPrice(store, side, candidate) {
  if (!side) return;
  if (quoteIsBetter(candidate, store[side])) store[side] = candidate;
}

function findOddsForGame(items, game) {
  return Array.isArray(items) ? items.find((item) => normal(item.away_team) === normal(game.away_name) && normal(item.home_team) === normal(game.home_name)) : null;
}

function isPregameOddsEvent(event) {
  const start = Date.parse(String(event?.commence_time || ""));
  return !Number.isFinite(start) || start > Date.now();
}

function mainPoint(rows) {
  const counts = new Map();
  for (const row of rows || []) {
    if (!Number.isFinite(Number(row.line))) continue;
    const key = String(Number(row.line));
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || Math.abs(Number(a[0]) - 8.5) - Math.abs(Number(b[0]) - 8.5))[0]?.[0];
}

function bestRow(rows, predicate) {
  let best = null;
  for (const row of rows || []) {
    if (!predicate(row)) continue;
    if (!best || Number(row.price) > Number(best.price)) best = row;
  }
  return best;
}

function pickTeamTotalRows(rows, team, fairLine) {
  const teamRows = (rows || []).filter((row) => normal(row.team).includes(normal(team)) || normal(team).includes(normal(row.team)));
  if (!teamRows.length) return { over: null, under: null };
  const points = [...new Set(teamRows.map((row) => Number(row.line)).filter(Number.isFinite))];
  const point = points.sort((a, b) => Math.abs(a - Number(fairLine)) - Math.abs(b - Number(fairLine)))[0];
  return {
    over: bestRow(teamRows, (row) => Number(row.line) === point && normal(row.side) === "over"),
    under: bestRow(teamRows, (row) => Number(row.line) === point && normal(row.side) === "under"),
  };
}

function consensusMarketPoint(rows, fairLine) {
  const counts = new Map();
  for (const row of rows || []) {
    const line = Number(row?.line);
    if (!Number.isFinite(line)) continue;
    counts.set(line, (counts.get(line) || 0) + 1);
  }
  const anchor = Number.isFinite(Number(fairLine)) ? Number(fairLine) : 8.5;
  const point = [...counts.entries()].sort((a, b) => b[1] - a[1] || Math.abs(a[0] - anchor) - Math.abs(b[0] - anchor) || a[0] - b[0])[0]?.[0];
  return Number.isFinite(point) ? point : null;
}

function marketTeamTotalPoint(rows, game, side, fairLine) {
  const team = side === "away" ? game?.away_name || game?.away : game?.home_name || game?.home;
  const teamKey = normal(team);
  if (!teamKey) return null;
  const teamRows = (rows || []).filter((row) => {
    const rowTeam = normal(row?.team);
    return rowTeam && (rowTeam.includes(teamKey) || teamKey.includes(rowTeam));
  });
  return consensusMarketPoint(teamRows, fairLine);
}

function marketMarginFromHomeProbability(probability, scale) {
  const value = Number(probability);
  if (!Number.isFinite(value) || value <= 0 || value >= 1) return null;
  const bounded = clamp(value, 0.01, 0.99);
  return Math.log(bounded / (1 - bounded)) * scale;
}

function marketHomeProbabilityFromMargin(margin, scale) {
  const value = Number(margin);
  if (!Number.isFinite(value)) return null;
  return clamp(1 / (1 + Math.exp(-value / scale)), 0.01, 0.99);
}

function blendTotalTowardMarket(baseTotal, marketTotal) {
  const base = Number(baseTotal);
  const market = Number(marketTotal);
  if (!Number.isFinite(base) || !Number.isFinite(market)) return base;
  const gap = Math.abs(market - base);
  const weight = gap >= MARKET_TOTAL_EXTREME_GAP ? MARKET_TOTAL_EXTREME_BLEND_WEIGHT : MARKET_TOTAL_BLEND_WEIGHT;
  const maxShift = gap >= MARKET_TOTAL_EXTREME_GAP ? MARKET_TOTAL_EXTREME_MAX_RUN_SHIFT : MARKET_TOTAL_MAX_RUN_SHIFT;
  return base + clamp((market - base) * weight, -maxShift, maxShift);
}

function blendedScorePair(awayScore, homeScore, {
  marketTotal = null,
  marketHomeProbability = null,
  marketAwayTeamTotal = null,
  marketHomeTeamTotal = null,
  marginScale = FULL_GAME_MARGIN_SCALE,
} = {}) {
  const awayBase = Number(awayScore);
  const homeBase = Number(homeScore);
  if (!Number.isFinite(awayBase) || !Number.isFinite(homeBase)) return null;
  const baseTotal = awayBase + homeBase;
  const baseMargin = homeBase - awayBase;
  const marketAway = Number(marketAwayTeamTotal);
  const marketHome = Number(marketHomeTeamTotal);
  const hasTeamTotals = Number.isFinite(marketAway) && Number.isFinite(marketHome);
  const suppliedTotal = Number(marketTotal);
  const totalTarget = Number.isFinite(suppliedTotal) ? suppliedTotal : hasTeamTotals ? marketAway + marketHome : null;
  const marginTargets = [];
  const moneylineMargin = marketMarginFromHomeProbability(marketHomeProbability, marginScale);
  if (Number.isFinite(moneylineMargin)) marginTargets.push([moneylineMargin, 0.70]);
  if (hasTeamTotals) marginTargets.push([marketHome - marketAway, 0.30]);
  if (!Number.isFinite(totalTarget) && !marginTargets.length) return null;

  const adjustedTotal = Number.isFinite(totalTarget)
    ? blendTotalTowardMarket(baseTotal, totalTarget)
    : baseTotal;
  const marginWeight = marginTargets.reduce((sum, [, weight]) => sum + weight, 0);
  const targetMargin = marginWeight ? marginTargets.reduce((sum, [margin, weight]) => sum + margin * weight, 0) / marginWeight : baseMargin;
  const adjustedMargin = marginWeight
    ? baseMargin + clamp((targetMargin - baseMargin) * MARKET_MARGIN_BLEND_WEIGHT, -MARKET_MARGIN_MAX_RUN_SHIFT, MARKET_MARGIN_MAX_RUN_SHIFT)
    : baseMargin;
  const away = Math.round(clamp((adjustedTotal - adjustedMargin) / 2, 2, 8) * 10) / 10;
  const home = Math.round(clamp((adjustedTotal + adjustedMargin) / 2, 2, 8) * 10) / 10;
  const homeProbability = marketHomeProbabilityFromMargin(home - away, marginScale);
  return {
    away_score: away,
    home_score: home,
    total: Math.round((away + home) * 10) / 10,
    home_win_probability: Number.isFinite(homeProbability) ? Math.round(homeProbability * 1000) / 1000 : null,
  };
}

function marketAdjustedGame(game, odds = blankOdds()) {
  if (!game || !hasOddsEntry(odds)) return game;
  const awayScore = Number(game.away_score);
  const homeScore = Number(game.home_score);
  if (!Number.isFinite(awayScore) || !Number.isFinite(homeScore)) return game;
  const homeMarketProbability = noVigBookProbability(odds.h2h?.home?.price, odds.h2h?.away?.price);
  const full = blendedScorePair(awayScore, homeScore, {
    marketTotal: consensusMarketPoint(odds.totals, awayScore + homeScore),
    marketHomeProbability: homeMarketProbability,
    marketAwayTeamTotal: marketTeamTotalPoint(odds.teamTotals, game, "away", awayScore),
    marketHomeTeamTotal: marketTeamTotalPoint(odds.teamTotals, game, "home", homeScore),
  });
  if (!full) return game;

  const moneylineFairs = {
    away_probability: Math.round((1 - full.home_win_probability) * 1000) / 1000,
    home_probability: full.home_win_probability,
    away_fair: americanFromProbability(1 - full.home_win_probability),
    home_fair: americanFromProbability(full.home_win_probability),
  };
  const originalF5 = game.f5 || {};
  const originalF5Away = Number(originalF5.away_score);
  const originalF5Home = Number(originalF5.home_score);
  let f5 = originalF5;
  if (Number.isFinite(originalF5Away) && Number.isFinite(originalF5Home)) {
    const awayShare = awayScore > 0 ? originalF5Away / awayScore : 0.55;
    const homeShare = homeScore > 0 ? originalF5Home / homeScore : 0.55;
    const f5Away = Math.round(full.away_score * awayShare * 10) / 10;
    const f5Home = Math.round(full.home_score * homeShare * 10) / 10;
    const adjustedF5 = blendedScorePair(f5Away, f5Home, {
      marketTotal: consensusMarketPoint(odds.f5Totals, f5Away + f5Home),
      marketHomeProbability: noVigBookProbability(odds.f5H2h?.home?.price, odds.f5H2h?.away?.price),
      marginScale: F5_MARGIN_SCALE,
    });
    const f5Projection = adjustedF5 || {
      away_score: f5Away,
      home_score: f5Home,
      total: Math.round((f5Away + f5Home) * 10) / 10,
      home_win_probability: Math.round(marketHomeProbabilityFromMargin(f5Home - f5Away, F5_MARGIN_SCALE) * 1000) / 1000,
    };
    f5 = {
      ...originalF5,
      ...f5Projection,
      away_fair: americanFromProbability(1 - f5Projection.home_win_probability),
      home_fair: americanFromProbability(f5Projection.home_win_probability),
    };
  }
  return {
    ...game,
    ...full,
    f5,
    moneyline_fairs: moneylineFairs,
    team_total_fairs: { away: full.away_score, home: full.home_score },
  };
}

function bookMeta(row) {
  if (!validBookPrice(row?.price)) return "Book unavailable";
  return `Book ${row.book || "Sportsbook"} ${price(row.price)}`;
}

function marketLineMeta(label, line, row) {
  const lineText = line ?? "—";
  if (!validBookPrice(row?.price)) return `${label} ${lineText} · book unavailable`;
  return `${label} ${lineText} · Book ${row.book || "Sportsbook"} ${price(row.price)}`;
}

function pairedBookMeta(label, row) {
  if (!validBookPrice(row?.price)) return `${label} book unavailable`;
  return `${label} ${row.book || "Sportsbook"} ${price(row.price)}`;
}

function totalSideProbability(fairLine, liveLine, side) {
  const fair = Number(fairLine);
  const live = Number(liveLine);
  if (!Number.isFinite(fair) || !Number.isFinite(live)) return null;
  const directionalGap = side === "Under" ? live - fair : fair - live;
  if (directionalGap <= 0) return 0.5;
  return clamp(0.5 + directionalGap * TOTAL_RUN_TO_PROB, 0.5, 0.78);
}

function lineLean(fairLine, liveLine, overRow, underRow) {
  const fair = Number(fairLine);
  const live = Number(liveLine);
  const overPrice = overRow?.price;
  const underPrice = underRow?.price;
  if (!Number.isFinite(fair) || !Number.isFinite(live)) return { label: "Waiting", tone: "watch", detail: "No pregame line loaded." };
  const diff = fair - live;
  const side = diff >= 0 ? "Over" : "Under";
  const row = side === "Over" ? overRow : underRow;
  const oppositeRow = side === "Over" ? underRow : overRow;
  if (Math.abs(diff) >= 0.25 && !validBookPrice(row?.price)) return { label: "Watch price", tone: "watch", detail: `${side} lean, but no valid pregame price is loaded.`, edgeScore: null };
  if (Math.abs(diff) >= 0.25 && validBookPrice(row?.price)) {
    const fairProbability = totalSideProbability(fair, live, side);
    const bookProbability = noVigBookProbability(row?.price, oppositeRow?.price);
    const edge = Number.isFinite(fairProbability) && Number.isFinite(bookProbability) ? fairProbability - bookProbability : null;
    const ev = expectedValuePerUnit(fairProbability, row?.price);
    const detail = `${side}: fair ${fair.toFixed(1)} vs line ${live.toFixed(1)} at ${price(row?.price)} from ${row?.book || "Sportsbook"} · ${probabilityEdgeMetric(edge)}.`;
    return tieredDesignation(edge, ev, detail, `Fair ${fair.toFixed(1)} is close to pregame ${live.toFixed(1)} after price.`);
  }
  return { label: "No edge", tone: "pass", detail: `Fair ${fair.toFixed(1)} is close to pregame ${live.toFixed(1)}.` };
}

function edgeMetricForTone(tone, metric) {
  return ["lean", "small", "bet", "strong"].includes(tone) ? metric : null;
}

function marketBookForTotal(fairLine, liveLine, overRow, underRow) {
  const fair = Number(fairLine);
  const live = Number(liveLine);
  if (!Number.isFinite(fair) || !Number.isFinite(live)) return null;
  return fair >= live ? overRow : underRow;
}

function totalSideLabel(fairLine, liveLine) {
  const fair = Number(fairLine);
  const live = Number(liveLine);
  if (!Number.isFinite(fair) || !Number.isFinite(live)) return "";
  return fair >= live ? "Over" : "Under";
}

function marketEdgeFromCard(card) {
  if (!card || !["lean", "bet", "strong"].includes(card.designation?.tone)) return null;
  if (card.marketType === "moneyline") {
    return {
      category: "Market",
      betKind: card.betKind,
      betSide: card.betSide,
      teamSide: card.teamSide,
      line: card.line ?? null,
      title: card.title,
      subtitle: `${card.group} · ${card.edgeMetric || card.designation.detail}`,
      fair: card.fairValue,
      book: card.bookValue,
      fairDisplay: price(card.fairValue),
      bookDisplay: price(card.bookValue),
      bookName: card.bookName,
      label: card.designation.label,
      tone: card.designation.tone,
      edge: card.designation.edgeScore ?? 0,
    };
  }
  if (card.marketType === "total") {
    const side = totalSideLabel(card.fairValue, card.bookLine);
    return {
      category: "Market",
      betKind: card.betKind,
      betSide: side,
      teamSide: card.teamSide,
      line: card.bookLine,
      title: side ? `${card.title} ${side}` : card.title,
      subtitle: `${card.group} · ${card.edgeMetric || card.designation.detail}`,
      fair: card.fairValue,
      book: card.bookValue,
      fairDisplay: score(card.fairValue),
      bookDisplay: card.bookLine == null ? "—" : `Line ${Number(card.bookLine).toFixed(1)} · ${price(card.bookValue)}`,
      bookName: card.bookName,
      label: card.designation.label,
      tone: card.designation.tone,
      edge: card.designation.edgeScore ?? 0,
    };
  }
  return null;
}

function hasOddsEntry(odds) {
  return Boolean(
    Object.keys(odds?.h2h || {}).length
    || Object.keys(odds?.f5H2h || {}).length
    || (odds?.totals || []).length
    || (odds?.f5Totals || []).length
    || (odds?.teamTotals || []).length
    || Object.keys(odds?.k || {}).length
    || Object.keys(odds?.batter || {}).length
  );
}

function normalizeOddsEntry(entry) {
  if (!entry || typeof entry !== "object") return blankOdds();
  return {
    k: { ...(entry.k || {}) },
    pitcherK: { ...(entry.pitcherK || entry.k || {}) },
    batter: { ...(entry.batter || {}) },
    teamTotals: Array.isArray(entry.teamTotals) ? entry.teamTotals : [],
    h2h: { ...(entry.h2h || {}) },
    totals: Array.isArray(entry.totals) ? entry.totals : [],
    f5H2h: { ...(entry.f5H2h || {}) },
    f5Totals: Array.isArray(entry.f5Totals) ? entry.f5Totals : [],
  };
}

function normalizeOddsHistory(history) {
  if (!history || typeof history !== "object") return {};
  const normalized = {};
  for (const [date, snapshot] of Object.entries(history)) {
    if (!date || !snapshot || typeof snapshot !== "object") continue;
    const rawGames = snapshot.games && typeof snapshot.games === "object" ? snapshot.games : snapshot;
    const games = {};
    for (const [key, entry] of Object.entries(rawGames || {})) {
      const cleaned = normalizeOddsEntry(entry);
      if (hasOddsEntry(cleaned)) games[key] = cleaned;
    }
    if (Object.keys(games).length) {
      normalized[date] = {
        fetched_at: snapshot.fetched_at || snapshot.last_updated || null,
        source: snapshot.source || "sportsbook odds snapshot",
        games,
      };
    }
  }
  return normalized;
}

function mergeOddsHistories(...histories) {
  const merged = {};
  for (const history of histories.map(normalizeOddsHistory)) {
    for (const [date, snapshot] of Object.entries(history)) {
      merged[date] = {
        ...(merged[date] || {}),
        ...snapshot,
        games: { ...((merged[date] || {}).games || {}), ...(snapshot.games || {}) },
      };
    }
  }
  return merged;
}

function timestampMs(value) {
  if (value == null) return null;
  const numeric = Number(value);
  if (Number.isFinite(numeric)) return numeric;
  const parsed = Date.parse(String(value));
  return Number.isFinite(parsed) ? parsed : null;
}

function readStoredOddsSnapshot(date) {
  if (typeof window === "undefined" || !window.localStorage) {
    return { games: {}, fetched_at: null };
  }
  try {
    const history = normalizeOddsHistory(JSON.parse(window.localStorage.getItem(ODDS_HISTORY_KEY) || "{}"));
    return date ? history[date] || { games: {}, fetched_at: null } : { games: {}, fetched_at: null };
  } catch {
    return { games: {}, fetched_at: null };
  }
}

function readPublishedOddsSnapshot(date) {
  if (!date || !BOARD.pregame_quotes || typeof BOARD.pregame_quotes !== "object") {
    return { games: {}, fetched_at: null };
  }
  return normalizeOddsHistory({ [date]: BOARD.pregame_quotes })[date] || { games: {}, fetched_at: null };
}

function initialOddsSnapshot(date) {
  const published = readPublishedOddsSnapshot(date);
  const stored = readStoredOddsSnapshot(date);
  const merged = mergeOddsHistories({ [date]: published }, { [date]: stored })[date] || { games: {}, fetched_at: null };
  const publishedAt = timestampMs(published.fetched_at) || 0;
  const storedAt = timestampMs(stored.fetched_at) || 0;
  return {
    ...merged,
    fetched_at: storedAt > publishedAt ? stored.fetched_at : published.fetched_at || stored.fetched_at || null,
  };
}

function writeStoredOddsHistory(date, oddsByGame, fetchedAt = new Date().toISOString()) {
  if (typeof window === "undefined" || !window.localStorage || !date) return 0;
  const normalized = normalizeOddsHistory({ [date]: { fetched_at: fetchedAt, source: "manual pregame odds refresh", games: oddsByGame } });
  const snapshot = normalized[date];
  const savedGames = Object.keys(snapshot?.games || {}).length;
  if (!savedGames) return 0;
  try {
    const history = normalizeOddsHistory(JSON.parse(window.localStorage.getItem(ODDS_HISTORY_KEY) || "{}"));
    history[date] = { ...(history[date] || {}), ...snapshot, games: { ...((history[date] || {}).games || {}), ...snapshot.games } };
    window.localStorage.setItem(ODDS_HISTORY_KEY, JSON.stringify(history));
    return savedGames;
  } catch {
    return 0;
  }
}

function buildGameDisplay(game, odds = blankOdds(), kMode = "base", kLineOverrides = {}) {
  if (!game) {
    return { marketCards: [], marketEdges: [], pitcherKFairRows: [], batterPropRows: [], kTargetRows: [], pricedEdges: [], allEdges: [], hasAnyOdds: false };
  }
  const teamTotals = (odds.teamTotals || []).filter((row) => row.away === game.away && row.home === game.home);
  const selectedH2h = odds.h2h || {};
  const moneylineFairs = baseMoneylineFairs(game);
  const f5 = game.f5 || {
    away_score: Number.isFinite(Number(game.away_score)) ? Number(game.away_score) * 0.55 : null,
    home_score: Number.isFinite(Number(game.home_score)) ? Number(game.home_score) * 0.55 : null,
    total: Number.isFinite(Number(game.total)) ? Number(game.total) * 0.55 : null,
  };
  const f5HomeProb = f5.home_win_probability ?? (Number.isFinite(Number(f5.away_score)) && Number.isFinite(Number(f5.home_score)) ? 1 / (1 + Math.exp(-(Number(f5.home_score) - Number(f5.away_score)) / 0.95)) : null);
  const fullTotalPoint = mainPoint(odds.totals);
  const fullOver = bestRow(odds.totals, (row) => String(Number(row.line)) === String(fullTotalPoint) && normal(row.side) === "over");
  const fullUnder = bestRow(odds.totals, (row) => String(Number(row.line)) === String(fullTotalPoint) && normal(row.side) === "under");
  const f5TotalPoint = mainPoint(odds.f5Totals);
  const f5Over = bestRow(odds.f5Totals, (row) => String(Number(row.line)) === String(f5TotalPoint) && normal(row.side) === "over");
  const f5Under = bestRow(odds.f5Totals, (row) => String(Number(row.line)) === String(f5TotalPoint) && normal(row.side) === "under");
  const awayTTRows = pickTeamTotalRows(teamTotals, game.away_name, game.team_total_fairs?.away ?? game.away_score);
  const homeTTRows = pickTeamTotalRows(teamTotals, game.home_name, game.team_total_fairs?.home ?? game.home_score);
  const awayMlDesignation = designationForOdds(moneylineFairs.away_fair, selectedH2h.away?.price, selectedH2h.home?.price);
  const homeMlDesignation = designationForOdds(moneylineFairs.home_fair, selectedH2h.home?.price, selectedH2h.away?.price);
  const fullTotalDesignation = lineLean(game.total, fullTotalPoint, fullOver, fullUnder);
  const f5TotalDesignation = lineLean(f5.total, f5TotalPoint, f5Over, f5Under);
  const awayF5Fair = f5.away_fair ?? americanFromProbability(f5HomeProb == null ? null : 1 - f5HomeProb);
  const homeF5Fair = f5.home_fair ?? americanFromProbability(f5HomeProb);
  const awayF5Designation = designationForOdds(awayF5Fair, odds.f5H2h?.away?.price, odds.f5H2h?.home?.price);
  const homeF5Designation = designationForOdds(homeF5Fair, odds.f5H2h?.home?.price, odds.f5H2h?.away?.price);
  const awayTTLine = awayTTRows.over?.line ?? awayTTRows.under?.line;
  const homeTTLine = homeTTRows.over?.line ?? homeTTRows.under?.line;
  const awayTTFair = game.team_total_fairs?.away ?? game.away_score;
  const homeTTFair = game.team_total_fairs?.home ?? game.home_score;
  const awayTTDesignation = lineLean(awayTTFair, awayTTLine, awayTTRows.over, awayTTRows.under);
  const homeTTDesignation = lineLean(homeTTFair, homeTTLine, homeTTRows.over, homeTTRows.under);
  const marketCards = [
    {
      group: "Full game",
      marketType: "moneyline",
      betKind: "moneyline",
      betSide: "away",
      teamSide: "away",
      title: `${game.away} moneyline`,
      main: price(moneylineFairs.away_fair),
      meta: [`Fair probability ${probabilityText(moneylineFairs.away_probability)}`, bookMeta(selectedH2h.away)],
      designation: awayMlDesignation,
      edgeMetric: edgeMetricForTone(awayMlDesignation.tone, moneylineValueMetric(moneylineFairs.away_fair, selectedH2h.away?.price)),
      fairValue: moneylineFairs.away_fair,
      bookValue: selectedH2h.away?.price,
      bookName: selectedH2h.away?.book,
    },
    {
      group: "Full game",
      marketType: "moneyline",
      betKind: "moneyline",
      betSide: "home",
      teamSide: "home",
      title: `${game.home} moneyline`,
      main: price(moneylineFairs.home_fair),
      meta: [`Fair probability ${probabilityText(moneylineFairs.home_probability)}`, bookMeta(selectedH2h.home)],
      designation: homeMlDesignation,
      edgeMetric: edgeMetricForTone(homeMlDesignation.tone, moneylineValueMetric(moneylineFairs.home_fair, selectedH2h.home?.price)),
      fairValue: moneylineFairs.home_fair,
      bookValue: selectedH2h.home?.price,
      bookName: selectedH2h.home?.book,
    },
    {
      group: "Full game",
      marketType: "total",
      betKind: "full_total",
      line: fullTotalPoint,
      title: "Full-game total",
      main: score(game.total),
      meta: [`Fair total`, `Line ${fullTotalPoint ?? "—"}`, marketLineMeta("Over", fullTotalPoint, fullOver), marketLineMeta("Under", fullTotalPoint, fullUnder)],
      designation: fullTotalDesignation,
      edgeMetric: edgeMetricForTone(fullTotalDesignation.tone, runGapMetric(game.total, fullTotalPoint)),
      fairValue: game.total,
      bookLine: fullTotalPoint,
      bookValue: marketBookForTotal(game.total, fullTotalPoint, fullOver, fullUnder)?.price,
      bookName: marketBookForTotal(game.total, fullTotalPoint, fullOver, fullUnder)?.book,
    },
    {
      group: "First five",
      marketType: "total",
      betKind: "f5_total",
      line: f5TotalPoint,
      title: "F5 total",
      main: score(f5.total),
      meta: [`Fair F5`, `Line ${f5TotalPoint ?? "—"}`, marketLineMeta("Over", f5TotalPoint, f5Over), marketLineMeta("Under", f5TotalPoint, f5Under)],
      designation: f5TotalDesignation,
      edgeMetric: edgeMetricForTone(f5TotalDesignation.tone, runGapMetric(f5.total, f5TotalPoint)),
      fairValue: f5.total,
      bookLine: f5TotalPoint,
      bookValue: marketBookForTotal(f5.total, f5TotalPoint, f5Over, f5Under)?.price,
      bookName: marketBookForTotal(f5.total, f5TotalPoint, f5Over, f5Under)?.book,
    },
    {
      group: "First five",
      marketType: "moneyline",
      betKind: "f5_moneyline",
      betSide: "away",
      teamSide: "away",
      title: `${game.away} F5 ML`,
      main: price(awayF5Fair),
      meta: [`Fair probability ${probabilityText(f5HomeProb == null ? null : 1 - f5HomeProb)}`, bookMeta(odds.f5H2h?.away)],
      designation: awayF5Designation,
      edgeMetric: edgeMetricForTone(awayF5Designation.tone, moneylineValueMetric(awayF5Fair, odds.f5H2h?.away?.price)),
      fairValue: awayF5Fair,
      bookValue: odds.f5H2h?.away?.price,
      bookName: odds.f5H2h?.away?.book,
    },
    {
      group: "First five",
      marketType: "moneyline",
      betKind: "f5_moneyline",
      betSide: "home",
      teamSide: "home",
      title: `${game.home} F5 ML`,
      main: price(homeF5Fair),
      meta: [`Fair probability ${probabilityText(f5HomeProb)}`, bookMeta(odds.f5H2h?.home)],
      designation: homeF5Designation,
      edgeMetric: edgeMetricForTone(homeF5Designation.tone, moneylineValueMetric(homeF5Fair, odds.f5H2h?.home?.price)),
      fairValue: homeF5Fair,
      bookValue: odds.f5H2h?.home?.price,
      bookName: odds.f5H2h?.home?.book,
    },
    {
      group: "Team totals",
      marketType: "total",
      betKind: "team_total",
      teamSide: "away",
      line: awayTTLine,
      title: `${game.away} team total`,
      main: score(awayTTFair),
      meta: [`Fair runs`, marketLineMeta("Over", awayTTLine, awayTTRows.over), marketLineMeta("Under", awayTTRows.under?.line ?? awayTTRows.over?.line, awayTTRows.under)],
      designation: awayTTDesignation,
      edgeMetric: edgeMetricForTone(awayTTDesignation.tone, runGapMetric(awayTTFair, awayTTLine)),
      fairValue: awayTTFair,
      bookLine: awayTTLine,
      bookValue: marketBookForTotal(awayTTFair, awayTTLine, awayTTRows.over, awayTTRows.under)?.price,
      bookName: marketBookForTotal(awayTTFair, awayTTLine, awayTTRows.over, awayTTRows.under)?.book,
    },
    {
      group: "Team totals",
      marketType: "total",
      betKind: "team_total",
      teamSide: "home",
      line: homeTTLine,
      title: `${game.home} team total`,
      main: score(homeTTFair),
      meta: [`Fair runs`, marketLineMeta("Over", homeTTLine, homeTTRows.over), marketLineMeta("Under", homeTTRows.under?.line ?? homeTTRows.over?.line, homeTTRows.under)],
      designation: homeTTDesignation,
      edgeMetric: edgeMetricForTone(homeTTDesignation.tone, runGapMetric(homeTTFair, homeTTLine)),
      fairValue: homeTTFair,
      bookLine: homeTTLine,
      bookValue: marketBookForTotal(homeTTFair, homeTTLine, homeTTRows.over, homeTTRows.under)?.price,
      bookName: marketBookForTotal(homeTTFair, homeTTLine, homeTTRows.over, homeTTRows.under)?.book,
    },
  ];
  const pitcherKFairRows = (game.prop_angles || []).map((angle, index) => {
    const key = `${normal(angle.player) || "starter"}-${index}`;
    const manualValue = kLineOverrides[key];
    const manualLine = manualValue === "" || manualValue == null ? null : Number(manualValue);
    const hasManualLine = Number.isFinite(manualLine);
    const fallbackBook = !hasManualLine ? findPitcherKBook(odds.pitcherK || {}, angle.player, angle.line) : null;
    const displayLine = hasManualLine ? manualLine : (fallbackBook?.line ?? angle.line);
    const exactBook = exactPitcherKBook(odds.pitcherK || {}, angle.player, displayLine);
    const book = exactBook || (!hasManualLine ? fallbackBook : null);
    const projected = kMode === "base" && angle.base_projected != null ? angle.base_projected : (angle.ceiling_projected ?? angle.projected);
    const recalculated = fairFromProjection(projected, displayLine);
    const fair = recalculated.over ?? (kMode === "base" && angle.base_fair != null ? angle.base_fair : angle.fair);
    const underFair = recalculated.under ?? (kMode === "base" && angle.base_under_fair != null ? angle.base_under_fair : angle.under_fair);
    const overBook = book?.over ?? odds.k?.[quoteKey(angle.player, "Over", displayLine)];
    const underBook = book?.under ?? odds.k?.[quoteKey(angle.player, "Under", displayLine)];
    return {
      key,
      player: angle.player,
      line: displayLine,
      projected,
      fair,
      underFair,
      overBook,
      underBook,
      hasBook: validBookPrice(overBook?.price) || validBookPrice(underBook?.price),
      explainer: angle.explainer,
    };
  });
  const batterPropRows = (game.batter_prop_angles || []).map((angle, index) => {
    const live = odds.batter?.[propQuoteKey(angle.market, angle.player, angle.side || "Over", angle.line)] || angle.book_quote || null;
    const hasBook = validBookPrice(live?.price);
    const oppositeSide = propSideKey(angle.side || "Over") === "over" ? "Under" : "Over";
    const oppositeLive = odds.batter?.[propQuoteKey(angle.market, angle.player, oppositeSide, angle.line)];
    const fair = hasBook ? blendPropFairWithBook(angle.fair, live.price, oppositeLive?.price) : angle.fair;
    const designation = hasBook
      ? designationForOdds(fair, live.price, oppositeLive?.price)
      : { label: "Fair only", tone: "watch", detail: "Refresh pregame odds to price this angle." };
    return {
      ...angle,
      key: `${angle.player}-${angle.market}-${index}`,
      fair,
      play_to: playToFromFair(fair) ?? angle.play_to,
      book: hasBook ? live : null,
      hasBook,
      designation,
    };
  }).filter((angle) => angle?.player && angle?.market && Number.isFinite(Number(angle.fair)) && angle.hasBook);
  const kTargetRows = [...(game.k_targets || [])]
    .filter((target) => target?.batter && Number.isFinite(Number(target.fair)))
    .sort((a, b) => Number(b.probability || 0) - Number(a.probability || 0));
  const pricedPitcherRows = pitcherKFairRows.flatMap((row) => {
    const overBook = row.overBook;
    const underBook = row.underBook;
    if (!validBookPrice(overBook?.price) && !validBookPrice(underBook?.price)) return [];
    const anchoredOverFair = blendPropFairWithBook(row.fair, overBook?.price, underBook?.price);
    const anchoredUnderFair = blendPropFairWithBook(row.underFair, underBook?.price, overBook?.price);
    const overDesignation = designationForOdds(anchoredOverFair, overBook?.price, underBook?.price);
    const underDesignation = designationForOdds(anchoredUnderFair, underBook?.price, overBook?.price);
    const side = (underDesignation.edgeScore ?? -Infinity) > (overDesignation.edgeScore ?? -Infinity) ? "Under" : "Over";
    const sideFair = side === "Under" ? anchoredUnderFair : anchoredOverFair;
    const sideBook = side === "Under" ? underBook : overBook;
    const designation = side === "Under" ? underDesignation : overDesignation;
    return [{
      kind: "pitcherK",
      key: row.key,
      title: `${row.player || "Starter"} ${side} ${row.line} K`,
      subtitle: `${kMode === "base" ? "Base" : "Ceiling"} projection ${row.projected ?? "—"} K`,
      player: row.player,
      line: row.line,
      projected: row.projected,
      fair: anchoredOverFair,
      underFair: anchoredUnderFair,
      overBook,
      underBook,
      side,
      sideFair,
      sideBook,
      designation,
      edge: designation.edgeScore ?? -999,
      explainer: row.explainer,
    }];
  }).sort((a, b) => b.edge - a.edge);

  const pricedBatterRows = limitRowsPerTeam(
    batterPropRows
      .filter((angle) => angle.hasBook)
      .map((angle) => ({
        kind: "batterProp",
        key: angle.key,
        team: angle.team,
        market: angle.market,
        side: angle.side || "Over",
        line: angle.line,
        player: angle.player,
        title: `${angle.player || "Hitter"} ${propMarketText(angle.market)} ${angle.side || "Over"} ${angle.line ?? "—"}`,
        subtitle: `${angle.team || "—"} vs ${angle.pitcher || "starter"} · ${angle.pitch_name || angle.pitch_type || "Pitch"} ${angle.usage ?? "—"}%`,
        fair: angle.fair,
        playTo: angle.play_to,
        book: angle.book,
        designation: angle.designation,
        edge: angle.designation.edgeScore ?? -999,
        metrics: angle.metrics,
        explainer: angle.explainer,
      }))
      .sort((a, b) => b.edge - a.edge),
    3,
  );
  const pricedEdges = [
    ...pricedPitcherRows.filter((row) => ["lean", "bet", "strong"].includes(row.designation.tone)).map((row) => ({
      category: "Prop",
      betKind: "pitcher_strikeouts",
      player: row.player,
      betSide: row.side,
      line: row.line,
      title: row.title,
      subtitle: row.subtitle,
      fair: row.sideFair,
      book: row.sideBook?.price,
      fairDisplay: price(row.sideFair),
      bookDisplay: price(row.sideBook?.price),
      bookName: row.sideBook?.book,
      label: row.designation.label,
      tone: row.designation.tone,
      edge: row.edge,
    })),
    ...pricedBatterRows.filter((row) => ["lean", "bet", "strong"].includes(row.designation.tone)).map((row) => ({
      category: "Prop",
      betKind: "batter_prop",
      propMarket: row.market,
      player: row.player,
      team: row.team,
      betSide: row.side,
      line: row.line,
      title: row.title,
      subtitle: row.subtitle,
      fair: row.fair,
      book: row.book?.price,
      fairDisplay: price(row.fair),
      bookDisplay: price(row.book?.price),
      bookName: row.book?.book,
      label: row.designation.label,
      tone: row.designation.tone,
      edge: row.edge,
    })),
  ].sort((a, b) => (b.edge || 0) - (a.edge || 0));
  const marketEdges = marketCards
    .map(marketEdgeFromCard)
    .filter(Boolean);
  const allEdges = [...marketEdges, ...pricedEdges]
    .sort((a, b) => tierRank(b.tone) - tierRank(a.tone) || (b.edge || 0) - (a.edge || 0));

  return {
    marketCards,
    marketEdges,
    pitcherKFairRows,
    batterPropRows,
    kTargetRows,
    pricedEdges,
    allEdges,
    hasAnyOdds: hasOddsEntry(odds),
  };
}

function CustomerBoard() {
  const games = BOARD.games || [];
  const specialEvents = Array.isArray(BOARD.special_events) ? BOARD.special_events : [];
  const [night, setNight] = useState(false);
  const [gameIndex, setGameIndex] = useState(() => defaultGameIndex(games));
  const [kMode, setKMode] = useState("base");
  const [kLineOverrides, setKLineOverrides] = useState({});
  const [resultHistory] = useState(() => normalizeResultsHistory(BOARD.results_history));
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [oddsByGame, setOddsByGame] = useState(() => initialOddsSnapshot(BOARD.date).games || {});
  const [lastOddsUpdatedAt, setLastOddsUpdatedAt] = useState(() => timestampMs(initialOddsSnapshot(BOARD.date).fetched_at));
  const [nowTick, setNowTick] = useState(() => Date.now());
  const [edgeView, setEdgeView] = useState("game");
  const [edgeTier, setEdgeTier] = useState("all");
  const hostname = typeof window !== "undefined" ? window.location.hostname : "";
  const isLocalHost = ["localhost", "127.0.0.1", "::1"].includes(hostname);
  const hasHostedProxy = hostname.endsWith(".chatgpt.site");
  const canUseLocalKey = isLocalHost && !!PRELOADED_ODDS_API_KEY;
  const canRefreshOdds = hasHostedProxy || canUseLocalKey || !!ODDS_PROXY_ORIGIN;

  const displayGames = useMemo(() => games.map((item) => marketAdjustedGame(item, oddsByGame[gameKey(item)] || blankOdds())), [games, oddsByGame]);
  const game = displayGames[gameIndex] || displayGames[0] || null;
  const resultRows = useMemo(() => flattenResultsHistory(resultHistory), [resultHistory]);
  const gameDisplays = useMemo(() => displayGames.map((item, index) => ({
    game: item,
    ...buildGameDisplay(item, oddsByGame[gameKey(item)] || blankOdds(), kMode, index === gameIndex ? kLineOverrides : {}),
  })), [displayGames, oddsByGame, kMode, gameIndex, kLineOverrides]);
  const selectedDisplay = gameDisplays[gameIndex] || buildGameDisplay(game, oddsByGame[gameKey(game)] || blankOdds(), kMode, kLineOverrides);

  useEffect(() => {
    const timer = window.setInterval(() => setNowTick(Date.now()), 30 * 1000);
    return () => window.clearInterval(timer);
  }, []);

  async function refreshOdds() {
    if (!canRefreshOdds) {
      setMessage("Pregame odds refresh is not available on this static view.");
      return;
    }
    const pregameGames = games.filter(isPregameGame);
    if (!pregameGames.length) {
      setMessage("Pregame odds only. No games on this slate are currently in a pregame state.");
      return;
    }
    setLoading(true);
    setMessage("Fetching pregame sportsbook lines for the slate…");
    try {
      // Local testing may use VITE_ODDS_API_KEY. Every hosted request goes to
      // the worker, which supplies its ODDS_API_KEY secret server-side.
      const oddsUrl = (endpoint, params = new URLSearchParams()) => {
        const qs = params.toString();
        if (canUseLocalKey) {
          const glue = qs ? `${qs}&` : "";
          return `https://api.the-odds-api.com/v4/${endpoint}?${glue}apiKey=${encodeURIComponent(PRELOADED_ODDS_API_KEY)}`;
        }
        if (hasHostedProxy) {
          return `/api/odds/sports?target=${encodeURIComponent(endpoint)}${qs ? `&${qs}` : ""}`;
        }
        if (!ODDS_PROXY_ORIGIN) throw new Error("Pregame odds refresh is not available on this static view.");
        return `${ODDS_PROXY_ORIGIN}/api/odds/sports?target=${encodeURIComponent(endpoint)}${qs ? `&${qs}` : ""}`;
      };
      const eventsResponse = await fetch(oddsUrl("sports/baseball_mlb/events"));
      if (!eventsResponse.ok) throw new Error(`Pregame odds events request returned HTTP ${eventsResponse.status}`);
      const events = await eventsResponse.json();
      const warnings = new Set();

      const fetchGameOdds = async (targetGame) => {
        const event = findOddsForGame(events, targetGame);
        if (!event || !isPregameOddsEvent(event)) return null;
        const nextK = {};
        const nextBatter = {};
        const nextTotals = [];
        const nextH2h = {};
        const nextF5H2h = {};
        const nextGameTotals = [];
        const nextF5Totals = [];

        const fetchOddsPayload = async (markets) => {
          const params = new URLSearchParams({ regions: "us", oddsFormat: "american", markets });
          const response = await fetch(oddsUrl(`sports/baseball_mlb/events/${event.id}/odds`, params));
          if (response.ok) return response.json();
          if (response.status === 401) {
            warnings.add("sportsbook odds key rejected");
            return null;
          }
          const fallbackResponse = await fetch(oddsUrl("sports/baseball_mlb/odds", params));
          if (fallbackResponse.status === 401) {
            warnings.add("sportsbook odds key rejected");
            return null;
          }
          if (!fallbackResponse.ok) return null;
          const fallbackOdds = await fallbackResponse.json();
          if (!Array.isArray(fallbackOdds)) return null;
          return fallbackOdds.find((item) => normal(item.away_team) === normal(targetGame.away_name) && normal(item.home_team) === normal(targetGame.home_name)) || null;
        };

        const parseStandardOdds = (eventOdds) => {
          if (!eventOdds) return;
          for (const bookmaker of eventOdds.bookmakers || []) {
            for (const market of bookmaker.markets || []) {
              if (market.key === "h2h" || market.key === "h2h_1st_5_innings") {
                const store = market.key === "h2h" ? nextH2h : nextF5H2h;
                for (const outcome of market.outcomes || []) {
                  const side = teamSideFromText(outcome.name, targetGame);
                  setBestTeamPrice(store, side, { price: outcome.price, book: bookmaker.title || "Sportsbook" });
                }
              }
              if (market.key === "totals" || market.key === "totals_1st_5_innings") {
                const rows = market.key === "totals" ? nextGameTotals : nextF5Totals;
                for (const outcome of market.outcomes || []) {
                  rows.push({
                    side: outcome.name || null,
                    line: outcome.point ?? null,
                    price: outcome.price ?? null,
                    book: bookmaker.title || "Sportsbook",
                  });
                }
              }
              if (market.key === "pitcher_strikeouts") {
                for (const outcome of market.outcomes || []) {
                  const key = quoteKey(outcome.description, outcome.name, outcome.point);
                  const candidate = { price: outcome.price, book: bookmaker.title || "Sportsbook" };
                  if (quoteIsBetter(candidate, nextK[key])) nextK[key] = candidate;
                  const playerKey = normal(outcome.description);
                  const line = Number(outcome.point);
                  if (!playerKey || !Number.isFinite(line)) continue;
                  nextK[playerKey] ||= [];
                  let row = nextK[playerKey].find((item) => Number(item.line) === line);
                  if (!row) {
                    row = { line, over: null, under: null };
                    nextK[playerKey].push(row);
                  }
                  if (propSideKey(outcome.name) === "over" && quoteIsBetter(candidate, row.over)) row.over = candidate;
                  if (propSideKey(outcome.name) === "under" && quoteIsBetter(candidate, row.under)) row.under = candidate;
                }
              }
              // Standard team totals are deliberately accepted from this one Odds
              // API market only—never inferred from full-game or alternate totals.
              if (market.key === "team_totals") {
                for (const outcome of market.outcomes || []) {
                  nextTotals.push({
                    away: targetGame.away,
                    home: targetGame.home,
                    team: outcome.description || null,
                    side: outcome.name || null,
                    line: outcome.point ?? null,
                    price: outcome.price ?? null,
                    book: bookmaker.title || "Sportsbook",
                  });
                }
              }
            }
          }
        };

        const parseBatterOdds = (propOdds) => {
          if (!propOdds) return;
          for (const bookmaker of propOdds.bookmakers || []) {
            for (const market of bookmaker.markets || []) {
              const label = propMarketLabel(market.key);
              if (!["Batter HR", "Batter hits", "Batter TB", "Batter strikeouts"].includes(label)) continue;
              for (const outcome of market.outcomes || []) {
                const line = outcome.point ?? (market.key === "batter_home_runs" ? 0.5 : null);
                const key = propQuoteKey(label, outcome.description, outcome.name, line);
                const candidate = { price: outcome.price, book: bookmaker.title || "Sportsbook" };
                if (quoteIsBetter(candidate, nextBatter[key])) nextBatter[key] = candidate;
              }
            }
          }
        };

        const mainOdds = await fetchOddsPayload("h2h,totals");
        if (mainOdds) parseStandardOdds(mainOdds);
        else if (!warnings.has("sportsbook odds key rejected")) warnings.add("moneyline/total prices unavailable");

        const teamTotalOdds = await fetchOddsPayload("team_totals");
        if (teamTotalOdds) parseStandardOdds(teamTotalOdds);
        else if (!warnings.has("sportsbook odds key rejected")) warnings.add("team total prices unavailable");

        const f5Odds = await fetchOddsPayload("h2h_1st_5_innings,totals_1st_5_innings");
        if (f5Odds) parseStandardOdds(f5Odds);
        else if (!warnings.has("sportsbook odds key rejected")) warnings.add("F5 prices unavailable");

        const pitcherKOdds = await fetchOddsPayload("pitcher_strikeouts");
        if (pitcherKOdds) parseStandardOdds(pitcherKOdds);
        else if (!warnings.has("sportsbook odds key rejected")) warnings.add("pitcher K prices unavailable");

        const propOdds = await fetchOddsPayload("batter_home_runs,batter_hits,batter_total_bases,batter_strikeouts");
        if (propOdds) parseBatterOdds(propOdds);
        else if (!warnings.has("sportsbook odds key rejected")) warnings.add("batter prop prices unavailable");

        const entry = { k: nextK, pitcherK: nextK, batter: nextBatter, teamTotals: nextTotals, h2h: nextH2h, totals: nextGameTotals, f5H2h: nextF5H2h, f5Totals: nextF5Totals };
        return hasOddsEntry(entry) ? entry : null;
      };

      const nextOddsByGame = {};
      for (const targetGame of pregameGames) {
        const entry = await fetchGameOdds(targetGame);
        if (entry) nextOddsByGame[gameKey(targetGame)] = entry;
      }
      const successfulGames = Object.keys(nextOddsByGame).length;
      if (!successfulGames) {
        setMessage(warnings.has("sportsbook odds key rejected") ? "The sportsbook odds endpoint is rejecting the configured API key, so pregame book prices are not available yet." : "No pregame sportsbook prices matched this slate.");
        return;
      }
      const fetchedAt = new Date().toISOString();
      writeStoredOddsHistory(BOARD.date, nextOddsByGame, fetchedAt);
      setOddsByGame(nextOddsByGame);
      setLastOddsUpdatedAt(Date.parse(fetchedAt));
      setNowTick(Date.now());
      const warningList = [...warnings];
      setMessage(`Pregame odds updated for ${successfulGames} game${successfulGames === 1 ? "" : "s"}.${warningList.length ? ` ${warningList.includes("sportsbook odds key rejected") ? "The sportsbook odds endpoint is rejecting the configured API key, so some pregame book prices are not available yet." : `Some markets are not returned by the sportsbook feed: ${warningList.join(", ")}.`}` : ""}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Pregame odds are unavailable right now.");
    } finally {
      setLoading(false);
    }
  }

  if (!CUSTOMER_FACING) return null;
  const edgeCounts = useMemo(() => {
    const counts = {};
    for (const display of gameDisplays) {
      counts[gameKey(display.game)] = (display.allEdges || []).filter((edge) => isActionTone(edge.tone)).length;
    }
    return counts;
  }, [gameDisplays]);
  const fullSlatePricedEdges = useMemo(() => gameDisplays
    .flatMap((display, index) => (display.allEdges || []).map((edge) => ({
      ...edge,
      gameIndex: index,
      gameKey: gameKey(display.game),
      gameLabel: `${display.game.away} @ ${display.game.home}`,
    })))
    .sort((a, b) => tierRank(b.tone) - tierRank(a.tone) || (b.edge || 0) - (a.edge || 0)), [gameDisplays]);
  const displayedPricedEdges = edgeView === "slate" ? fullSlatePricedEdges : selectedDisplay.allEdges;
  const hasFreshSlateOdds = Number.isFinite(lastOddsUpdatedAt)
    && Object.values(oddsByGame).some((entry) => hasOddsEntry(entry));
  const oddsStamp = updatedAgoText(lastOddsUpdatedAt, nowTick);
  const awayHand = starterHand(game, "away");
  const homeHand = starterHand(game, "home");
  if (!game) return (
    <main className={`app ${night ? "night" : ""}`}>
      <style>{APP_CSS}</style>
      <header className="topbar">
        <div>
          <div className="brand"><b>CC</b> Baseball Board</div>
          <div className="subline">Customer slate · {BOARD.date || "—"}</div>
        </div>
        <div className="top-actions">
          <button type="button" className="mode" onClick={() => setNight((value) => !value)}>{night ? "Day mode" : "Night mode"}</button>
        </div>
      </header>
      <div className="shell">
        {specialEvents.length ? specialEvents.map((event) => {
          const hasProjection = [event.away_score, event.home_score, event.home_win_probability].every((value) => Number.isFinite(Number(value)));
          const favorite = hasProjection ? specialEventFavorite(event) : null;
          return <section className="card" key={event.id || event.title || "special-event"}>
            <div className="card-title"><h2>{event.title || "MLB special event"}</h2><span className="muted">Special event</span></div>
            <div className="copy">
              <p><strong>{event.away_name || event.away || "—"} vs {event.home_name || event.home || "—"}</strong>{event.start_time_et ? ` · ${event.start_time_et}` : ""}</p>
              {(event.venue || event.status) ? <p className="muted">{[event.venue, event.status].filter(Boolean).join(" · ")}</p> : null}
              {hasProjection ? <>
                <p><strong>Model projection</strong> · {event.away || "Away"} {score(event.away_score)} · {score(event.home_score)} {event.home || "Home"}</p>
                {favorite ? <p className="muted">{favorite.team} {Math.round(favorite.probability * 100)}% favorite</p> : null}
                {event.synthesis ? <p className="muted">{event.synthesis}</p> : null}
                <p className="muted">Roster-backed score projection only—no prices, markets, K targets, or prop angles.</p>
              </> : <p className="muted">A projection will appear when MLB's official All-Star roster coverage is available. Prices, markets, K targets, and prop angles are unavailable.</p>}
            </div>
          </section>;
        }) : (
          <section className="card">
            <div className="card-title"><h2>No games today</h2><span className="muted">0 games</span></div>
            <div className="copy"><p>{BOARD.empty_slate ? "No MLB games are scheduled for this slate." : "No customer board is available for this slate."}</p><p className="muted">Scores, prop angles, and prices will return with the next slate.</p></div>
          </section>
        )}
      </div>
    </main>
  );

  return (
    <main className={`app ${night ? "night" : ""}`}>
      <style>{APP_CSS}</style>
      <header className="topbar">
        <div>
          <div className="brand"><b>CC</b> Baseball Board</div>
          <div className="subline">Customer slate · {BOARD.date || "—"} · private model details hidden</div>
        </div>
        <div className="top-actions">
          <button type="button" className="mode" onClick={() => setNight((value) => !value)}>{night ? "Day mode" : "Night mode"}</button>
          {oddsStamp ? <span className="odds-stamp">{oddsStamp}</span> : null}
          {canRefreshOdds ? <button type="button" className="refresh" onClick={refreshOdds} disabled={loading}>{loading ? "Refreshing…" : "Refresh pregame odds"}</button> : null}
        </div>
      </header>

      <div className="shell">
        <BiggestEdgesBoard
          edges={fullSlatePricedEdges}
          hasOdds={hasFreshSlateOdds}
          onSelectGame={(index) => {
            if (!Number.isInteger(index) || index < 0 || index >= displayGames.length) return;
            setGameIndex(index);
            setKLineOverrides({});
            setMessage("");
          }}
        />
        <Scoreboard games={displayGames} gameIndex={gameIndex} edgeCounts={edgeCounts} onSelect={(index) => { setGameIndex(index); setKLineOverrides({}); setMessage(""); }} />

        <section className="selected-summary">
          <div className="selected-main">
            <div>
              <h2>{game.away} @ {game.home}</h2>
              <p className="muted">{starterLabel(game.away, game.away_starter, awayHand)} vs {starterLabel(game.home, game.home_starter, homeHand)} · {game.time || game.status || "—"}</p>
            </div>
            <div className="selected-score">{game.away} {score(game.away_score)} · {score(game.home_score)} {game.home}</div>
          </div>
        </section>

        <PricedEdgeBoard
          edges={displayedPricedEdges}
          hasOdds={edgeView === "slate" ? fullSlatePricedEdges.length > 0 || Object.keys(oddsByGame).length > 0 : selectedDisplay.hasAnyOdds}
          view={edgeView}
          onViewChange={setEdgeView}
          tier={edgeTier}
          onTierChange={setEdgeTier}
        />

        <PlayerPropAnglesBoard
          angles={selectedDisplay.batterPropRows}
          pitcherRows={selectedDisplay.pitcherKFairRows}
          kMode={kMode}
          onKModeChange={setKMode}
          lineOverrides={kLineOverrides}
          onLineChange={(key, value) => setKLineOverrides((current) => ({ ...current, [key]: value }))}
        />

        <BatterKTargetsBoard targets={selectedDisplay.kTargetRows} />

        <section className="card">
          <div className="card-title"><h2>Selected game markets</h2><span className="muted">ML · totals · F5 · team totals</span></div>
          <div className="market-section">
            <div className="market-grid">
              {selectedDisplay.marketCards.map((card) => (
                <article className={`market-card ${card.designation.tone}`} key={card.title}>
                  <div className="market-top">
                    <h3>{card.title}</h3>
                    <span className={`pill ${card.designation.tone}`}>{card.designation.label}</span>
                  </div>
                  <div className="market-main">{card.main}</div>
                  {card.edgeMetric ? <div className="market-edge">{card.edgeMetric}</div> : null}
                  <div className="market-meta">{card.meta.map((item) => <span key={item}>{item}</span>)}</div>
                  <p className="muted">{card.designation.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <ResultsPerformance rows={resultRows} date={BOARD.date} />
        <ModelFooter games={displayGames} message={message} />
      </div>
    </main>
  );
}

export default CustomerBoard;
BiggestEdgesBoard
