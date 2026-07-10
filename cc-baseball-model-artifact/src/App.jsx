import React, { useEffect, useMemo, useState } from "react";
import {
  Activity,
  CircleDollarSign,
  Database,
  RefreshCcw,
  Upload,
  Wifi
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import DEFAULT_DATA from "./diamond_data.json";

const APP_CSS = ":root {\n  color-scheme: light;\n  -webkit-text-size-adjust: 100%;\n  text-size-adjust: 100%;\n  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif;\n  background: #f4f6f8;\n  color: #18212f;\n  font-synthesis: none;\n  text-rendering: optimizeLegibility;\n}\n\n* {\n  box-sizing: border-box;\n}\n\nbody {\n  margin: 0;\n  min-width: 320px;\n  min-height: 100vh;\n}\n\nbutton,\ninput,\nselect,\ntextarea {\n  font: inherit;\n}\n\nbutton {\n  border: 0;\n  cursor: pointer;\n}\n\n.app-shell {\n  min-height: 100vh;\n}\n\n.topbar {\n  position: sticky;\n  top: 0;\n  z-index: 10;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 16px;\n  min-height: 72px;\n  padding: 14px 22px;\n  border-bottom: 1px solid #dfe5eb;\n  background: rgba(255, 255, 255, 0.94);\n  backdrop-filter: blur(10px);\n}\n\n.brand {\n  font-size: 20px;\n  font-weight: 800;\n  letter-spacing: 0;\n}\n\n.subline {\n  margin-top: 2px;\n  color: #687586;\n  font-size: 13px;\n}\n\n.status-pill {\n  display: inline-flex;\n  align-items: center;\n  gap: 8px;\n  min-height: 34px;\n  max-width: 420px;\n  padding: 0 12px;\n  border: 1px solid #d5dce5;\n  border-radius: 999px;\n  color: #596779;\n  background: #f8fafc;\n  font-size: 13px;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.status-pill span {\n  width: 9px;\n  height: 9px;\n  flex: 0 0 auto;\n  border-radius: 50%;\n  background: #8793a2;\n}\n\n.status-pill.live {\n  color: #126039;\n  border-color: #b8e1c9;\n  background: #edf9f1;\n}\n\n.status-pill.live span {\n  background: #18a957;\n  box-shadow: 0 0 0 4px rgba(24, 169, 87, 0.12);\n}\n\n.model-grid {\n  display: grid;\n  grid-template-columns: 1fr;\n  overflow-x: hidden;\n  gap: 14px;\n  padding: 14px;\n  max-width: 820px;\n  margin: 0 auto;\n  align-items: start;\n}\n\n.model-grid > * {\n  min-width: 0;\n}\n\n.panel {\n  max-width: 100%;\n  min-width: 0;\n  border: 1px solid #dfe5eb;\n  border-radius: 8px;\n  background: #ffffff;\n  box-shadow: 0 1px 2px rgba(24, 33, 47, 0.04);\n  min-width: 0;\n}\n\n.panel-heading {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 10px;\n  min-height: 48px;\n  padding: 0 14px;\n  border-bottom: 1px solid #e7ecf1;\n}\n\n.panel-heading h2 {\n  margin: 0;\n  font-size: 15px;\n  font-weight: 800;\n  letter-spacing: 0;\n}\n\n.slate-panel,\n.chart-panel {\n  grid-column: span 1;\n}\n\n.controls-panel {\n  grid-column: span 1;\n}\n\n.markets-panel {\n  grid-column: span 1;\n}\n\n.angles-panel {\n  grid-column: span 1;\n}\n\n.import-panel {\n  grid-column: span 1;\n}\n\n.game-list {\n  display: grid;\n  gap: 8px;\n  padding: 10px;\n}\n\n.game-card {\n  display: grid;\n  gap: 4px;\n  min-height: 78px;\n  width: 100%;\n  padding: 10px;\n  border: 1px solid #e1e7ee;\n  border-radius: 6px;\n  background: #fbfcfd;\n  color: #243044;\n  text-align: left;\n}\n\n.game-card:hover,\n.game-card.active {\n  border-color: #8db2e8;\n  background: #f2f7ff;\n}\n\n.game-card .matchup {\n  font-weight: 800;\n}\n\n.game-card span:not(.matchup),\n.game-card small,\n.muted,\n.empty-state {\n  color: #667386;\n}\n\n.control-grid {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  gap: 12px;\n  padding: 14px;\n}\n\nlabel {\n  display: grid;\n  gap: 6px;\n  color: #5e6b7c;\n  font-size: 12px;\n  font-weight: 750;\n}\n\nselect,\ninput,\ntextarea {\n  min-height: 38px;\n  width: 100%;\n  border: 1px solid #cfd8e3;\n  border-radius: 6px;\n  background: #fff;\n  color: #18212f;\n  padding: 8px 10px;\n  outline: none;\n}\n\nselect:focus,\ninput:focus,\ntextarea:focus {\n  border-color: #2d6cdf;\n  box-shadow: 0 0 0 3px rgba(45, 108, 223, 0.12);\n}\n\n.projection-strip {\n  display: grid;\n  grid-template-columns: repeat(4, minmax(0, 1fr));\n  gap: 1px;\n  border-top: 1px solid #e7ecf1;\n  background: #e7ecf1;\n}\n\n.projection-strip div,\n.bankroll div {\n  display: grid;\n  gap: 4px;\n  min-height: 68px;\n  align-content: center;\n  padding: 10px 14px;\n  background: #fbfcfd;\n}\n\n.projection-strip span,\n.bankroll span {\n  color: #657385;\n  font-size: 12px;\n  font-weight: 750;\n}\n\n.projection-strip strong,\n.bankroll strong {\n  font-size: 22px;\n  letter-spacing: 0;\n}\n\n.odds-tools,\n.import-actions {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto minmax(80px, auto);\n  gap: 8px;\n  align-items: center;\n  padding: 12px 14px;\n}\n\n.odds-tools button,\n.import-actions button {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 6px;\n  min-height: 38px;\n  padding: 0 12px;\n  border-radius: 6px;\n  background: #18212f;\n  color: #fff;\n  font-weight: 800;\n}\n\n.odds-tools span,\n.import-actions span {\n  color: #657385;\n  font-size: 12px;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.market-table {\n  padding: 0 14px 14px;\n}\n\n.market-head,\n.market-row {\n  display: grid;\n  grid-template-columns: minmax(130px, 1fr) 68px 64px 70px;\n  gap: 8px;\n  align-items: center;\n  min-height: 34px;\n  border-bottom: 1px solid #edf1f5;\n  font-size: 13px;\n}\n\n.market-head {\n  color: #657385;\n  font-size: 12px;\n  font-weight: 800;\n}\n\n.market-row strong {\n  font-variant-numeric: tabular-nums;\n}\n\n.ev-pos {\n  color: #11824a;\n  font-weight: 800;\n}\n\n.ev-neg {\n  color: #b24040;\n  font-weight: 800;\n}\n\n.chart-panel {\n  min-height: 300px;\n}\n\n.chart-panel .recharts-wrapper {\n  padding: 10px 8px 6px;\n}\n\n.matchup-cards {\n  display: grid;\n  grid-template-columns: 1fr auto 1fr;\n  gap: 10px;\n  align-items: stretch;\n  padding: 14px;\n}\n\n.matchup-cards .vs {\n  align-self: center;\n  color: #8793a2;\n  font-weight: 800;\n  font-size: 12px;\n  text-align: center;\n}\n\n\n.rec-row {\n  display: flex;\n  flex-direction: column;\n  align-items: stretch;\n  gap: 3px;\n  padding: 7px 10px;\n  border-radius: 6px;\n  min-width: 0;\n}\n\n.rec-main {\n  min-width: 0;\n}\n\n.rec-sub {\n  white-space: normal;\n  overflow-wrap: anywhere;\n}\n\n.rec-right {\n  display: flex;\n  gap: 10px;\n  align-items: baseline;\n  flex-wrap: wrap;\n  text-align: left;\n}\n\n@media (max-width: 560px) {\n  .matchup-cards {\n    grid-template-columns: 1fr;\n    gap: 8px;\n  }\n}\n\n.angles-list {\n  display: grid;\n  gap: 8px;\n  padding: 12px 14px;\n}\n\n.angle-item {\n  display: grid;\n  grid-template-columns: minmax(0, 1fr) auto auto;\n  gap: 12px;\n  align-items: center;\n  min-height: 42px;\n  padding: 8px 10px;\n  border-radius: 6px;\n  background: #f6faf7;\n  border: 1px solid #dbeee1;\n}\n\n.angle-item strong {\n  color: #126039;\n}\n\n.angle-item small {\n  color: #667386;\n}\n\n.empty-state {\n  min-height: 42px;\n  display: grid;\n  align-items: center;\n}\n\n.bankroll {\n  display: grid;\n  grid-template-columns: 1fr 1fr 0.8fr;\n  gap: 10px;\n  padding: 0 14px 14px;\n}\n\n.import-panel textarea {\n  min-height: 168px;\n  resize: vertical;\n  border-radius: 0;\n  border-width: 0 0 1px 0;\n  box-shadow: none;\n  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", monospace;\n  font-size: 12px;\n}\n\n@media (max-width: 740px) {\n  .topbar {\n    align-items: flex-start;\n    flex-direction: column;\n    gap: 8px;\n    min-height: 0;\n    padding: 10px;\n  }\n\n  .status-pill {\n    max-width: 100%;\n  }\n\n  .model-grid {\n    grid-template-columns: 1fr;\n    gap: 10px;\n    padding: 10px;\n  }\n\n  .controls-panel,\n  .markets-panel,\n  .import-panel,\n  .chart-panel,\n  .slate-panel,\n  .angles-panel {\n    grid-column: span 1;\n  }\n\n  .panel-heading {\n    min-height: 42px;\n    padding: 0 12px;\n  }\n\n  .control-grid {\n    grid-template-columns: 1fr;\n    padding: 12px;\n  }\n\n  .projection-strip {\n    grid-template-columns: 1fr 1fr;\n  }\n\n  .projection-strip div,\n  .bankroll div {\n    padding: 10px 12px;\n  }\n\n  .bankroll {\n    grid-template-columns: repeat(3, 1fr);\n  }\n\n  .projection-strip strong,\n  .bankroll strong {\n    font-size: 19px;\n  }\n\n  .odds-tools,\n  .import-actions {\n    grid-template-columns: 1fr;\n  }\n\n  .market-table {\n    padding: 0 10px 12px;\n  }\n\n  .market-head,\n  .market-row {\n    grid-template-columns: minmax(0, 1fr) 50px 50px 56px;\n    gap: 6px;\n    font-size: 12px;\n  }\n\n  .market-head > *,\n  .market-row > * {\n    min-width: 0;\n    overflow: hidden;\n    text-overflow: ellipsis;\n    white-space: nowrap;\n  }\n\n  .game-card {\n    min-height: 0;\n  }\n}\n\n@media (max-width: 460px) {\n  .brand {\n    font-size: 18px;\n  }\n\n  .market-head,\n  .market-row {\n    grid-template-columns: minmax(0, 1fr) 44px 44px 50px;\n    gap: 5px;\n    font-size: 11.5px;\n  }\n\n  .market-row strong {\n    font-size: 11.5px;\n  }\n\n  .projection-strip strong,\n  .bankroll strong {\n    font-size: 18px;\n  }\n\n  .projection-strip span,\n  .bankroll span {\n    font-size: 11px;\n  }\n}\n";

const PRELOADED_ODDS_API_KEY = "bab454819e9526707fa520d801f7ea7c";
const CUSTOMER_FACING = true;

const BULLPEN_MULT = {
  fresh: 0.86,
  normal: 1,
  taxed: 1.17
};

function clamp(value, low, high) {
  return Math.max(low, Math.min(high, value));
}

function normalizeName(value = "") {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function americanOdds(probability) {
  const p = clamp(probability, 0.001, 0.999);
  if (p >= 0.5) return Math.round((-100 * p) / (1 - p));
  return Math.round((100 * (1 - p)) / p);
}

function formatOdds(value) {
  if (!Number.isFinite(value)) return "-";
  return value > 0 ? `+${Math.round(value)}` : `${Math.round(value)}`;
}

function formatBookInput(value) {
  if (value === undefined || value === null || value === "") return "";
  const text = String(value);
  if (text.startsWith("+") || text === "-" || text.endsWith(".")) return text;
  const number = Number(text);
  if (!Number.isFinite(number)) return text;
  return number > 0 ? `+${number}` : `${number}`;
}

function profitForAmerican(odds) {
  if (!Number.isFinite(Number(odds))) return null;
  const number = Number(odds);
  return number > 0 ? number : 10000 / Math.abs(number);
}

function evPer100(probability, odds) {
  const profit = profitForAmerican(odds);
  if (profit === null) return null;
  return probability * profit - (1 - probability) * 100;
}

function kellyUnits(probability, american) {
  if (american == null || isNaN(Number(american))) return 0;
  const a = Number(american);
  const dec = a > 0 ? a / 100 + 1 : 100 / Math.abs(a) + 1;
  const b = dec - 1;
  if (b <= 0) return 0;
  const f = (probability * dec - 1) / b; // full Kelly fraction
  if (f <= 0) return 0;
  return clamp(Math.round(f * 0.125 * 100 * 4) / 4, 0.25, 4); // eighth-Kelly, 1u = 1% bankroll
}

function nbDistribution(mean, r, maxRuns = 16) {
  const mu = Math.max(mean, 0.05);
  const dispersion = Math.max(r, 0.4);
  const p = dispersion / (dispersion + mu);
  const q = 1 - p;
  const values = [];
  values[0] = Math.pow(p, dispersion);
  for (let k = 1; k <= maxRuns; k += 1) {
    values[k] = values[k - 1] * ((k - 1 + dispersion) / k) * q;
  }
  const sum = values.reduce((acc, item) => acc + item, 0);
  return values.map((item) => item / sum);
}

function poissonOver(lambda, line) {
  // P(K > line) for K ~ Poisson(lambda); e.g. line 5.5 -> P(K >= 6)
  const need = Math.floor(line) + 1;
  let cdf = 0;
  let term = Math.exp(-lambda);
  for (let k = 0; k < need; k++) {
    cdf += term;
    term *= lambda / (k + 1);
  }
  return clamp(1 - cdf, 0.001, 0.999);
}

function arsenalMatchup(mix, teamRV, leagueRV) {
  // weighted excess run value of the batting team vs this pitcher's specific mix
  if (!mix || !mix.length || !teamRV) return { mult: 1, excess: 0 };
  let ex = 0;
  let w = 0;
  for (const p of mix) {
    const tp = teamRV[p.t];
    const base = leagueRV ? leagueRV[p.t] : null;
    if (!tp || tp.rv == null || base == null) continue; // skip rare pitches w/o baseline
    ex += (p.u / 100) * clamp(tp.rv - base, -2, 2);
    w += p.u / 100;
  }
  if (w <= 0) return { mult: 1, excess: 0 };
  const excess = ex / w;
  return { mult: clamp(1 + 0.14 * excess, 0.85, 1.15), excess };
}

function softSpots(mix, teamRV, crushers, ref) {
  const offense = [];
  const pitcherEdge = [];
  const kRaw = [];
  for (const p of (mix || [])) {
    const tp = teamRV ? teamRV[p.t] : null;
    const name = (ref && ref[p.t]) || p.t;
    // strikeout victims: featured bat with high whiff on a pitch the starter throws often
    const c = crushers ? crushers[p.t] : null;
    if (c && c.wh != null && p.u >= 10 && c.wh >= 0.3) {
      kRaw.push({ t: p.t, pitch: name, u: p.u, hitter: c.n, wh: c.wh, ch: c.ch });
    }
    if (!tp || tp.rk == null || p.u < 9) continue;
    if (tp.rk <= 8) offense.push({ t: p.t, name, u: p.u, rk: tp.rk, rv: tp.rv, hitter: crushers ? crushers[p.t] : null });
    else if (tp.rk >= 23) pitcherEdge.push({ t: p.t, name, u: p.u, rk: tp.rk, rv: tp.rv });
  }
  offense.sort((a, b) => a.rk - b.rk);
  pitcherEdge.sort((a, b) => b.rk - a.rk);
  kRaw.sort((a, b) => b.wh - a.wh);
  const kSeen = new Set();
  const kTargets = [];
  for (const k of kRaw) { if (kSeen.has(k.hitter)) continue; kSeen.add(k.hitter); kTargets.push(k); if (kTargets.length >= 2) break; }
  return { offense: offense.slice(0, 2), pitcherEdge: pitcherEdge.slice(0, 2), kTargets };
}

function playerAngles(mix, crushers, ref) {
  // specific player prop leans: threat hitters on pitches the SP actually throws
  const out = [];
  for (const p of (mix || [])) {
    if (p.u < 12) continue;
    const c = crushers ? crushers[p.t] : null;
    if (!c) continue;
    const type = (c.brl != null && c.brl >= 0.10) ? "HR / TB" : (c.slg != null && c.slg >= 0.55) ? "Total bases" : (c.ba != null && c.ba >= 0.32) ? "Hits" : "Run";
    out.push({ hitter: c.n, type, pitch: (ref && ref[p.t]) || p.t, u: p.u, brl: c.brl, slg: c.slg, ba: c.ba, rv: c.rv });
  }
  const byH = {};
  for (const a of out) if (!byH[a.hitter] || a.rv > byH[a.hitter].rv) byH[a.hitter] = a;
  return Object.values(byH).sort((x, y) => y.rv - x.rv).slice(0, 3);
}

function scoreMatrix(awayMean, homeMean, dispersion) {
  const away = nbDistribution(awayMean, dispersion);
  const home = nbDistribution(homeMean, dispersion);
  const matrix = [];
  for (let a = 0; a < away.length; a += 1) {
    for (let h = 0; h < home.length; h += 1) {
      matrix.push({ away: a, home: h, p: away[a] * home[h] });
    }
  }
  return matrix;
}

function teamByAbbr(teams, abbr) {
  return teams.find((team) => team.abbr === abbr) || teams[0];
}

function pitcherByName(pitchers, name) {
  const wanted = normalizeName(name);
  return pitchers.find((pitcher) => normalizeName(pitcher.name) === wanted) || pitchers[0];
}

function pitcherRunPreventionEra(arm, fallbackEra = 4.15) {
  const sourced = arm?.runPreventionEra ?? arm?.xera ?? arm?.era;
  const value = Number(sourced);
  return Number.isFinite(value) && value > 0 ? value : Number(fallbackEra || 4.15);
}

// UNIT FIX: xERA and bullpenEra are ERA-scale (earned runs / 9 IP). They must be
// normalized by LEAGUE ERA, not league RPG (runs/game, which includes unearned runs).
// Dividing by rpg made a league-average arm (xERA 4.15) yield a 0.943 factor instead of
// 1.00, shrinking every projection ~5.7% (-0.57 r/g vs the model's own baseline).
function expectedRuns({ battingTeam, opposingPitcher, opposingTeam, park, bullpenStatus, leagueRpg, leagueEra, disciplineMult = 1, damageMult = 1 }) {
  const pitchBase = Number(leagueEra) > 0 ? Number(leagueEra) : 4.15;
  const starterIp = clamp(Number(opposingPitcher?.ip || 5), 3.5, 7.2);
  const bullpenIp = Math.max(0, 9 - starterIp);
  const starterFactor = pitcherRunPreventionEra(opposingPitcher, pitchBase) / pitchBase;
  const penFactor = (Number(opposingTeam?.bullpenEra || 4.15) * BULLPEN_MULT[bullpenStatus]) / pitchBase;
  const matchup = Number(opposingPitcher?.matchup || 1);
  const blended = (starterIp / 9) * starterFactor * matchup + (bullpenIp / 9) * penFactor;
  return clamp(Number(battingTeam?.rpg || leagueRpg) * Number(park || 1) * Number(disciplineMult || 1) * Number(damageMult || 1) * blended, 1.6, 8.2);
}

function starterOnlyRuns({ battingTeam, opposingPitcher, park, leagueRpg, leagueEra, disciplineMult = 1, damageMult = 1 }) {
  const pitchBase = Number(leagueEra) > 0 ? Number(leagueEra) : 4.15;   // same unit fix as expectedRuns
  const starterFactor = pitcherRunPreventionEra(opposingPitcher, pitchBase) / pitchBase;
  const matchup = Number(opposingPitcher?.matchup || 1);
  return clamp(Number(battingTeam?.rpg || leagueRpg) * Number(park || 1) * Number(disciplineMult || 1) * Number(damageMult || 1) * (5 / 9) * starterFactor * matchup, 0.6, 5.6);
}

function snapHalf(value) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.round(number * 2) / 2 : null;
}

function formatLine(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "—";
  return Number.isInteger(number) ? String(number) : number.toFixed(1);
}

function derivedTeamTotalLines(totalLine) {
  const total = Number(totalLine);
  if (!Number.isFinite(total)) return { away: 4, home: 4.5 };
  return {
    away: snapHalf(total / 2 - 0.25),
    home: snapHalf(total / 2 + 0.25)
  };
}

function summarizeMarkets(matrix, totalLine, homeSpread, awayTeam, homeTeam) {
  let awayReg = 0;
  let homeReg = 0;
  let tie = 0;
  let over = 0;
  let under = 0;
  let totalPush = 0;
  let homeCover = 0;
  let awayCover = 0;
  let spreadPush = 0;
  let awayTeamOver = 0;
  let homeTeamOver = 0;
  let awayTeamPush = 0;
  let homeTeamPush = 0;
  const ttLines = derivedTeamTotalLines(totalLine);
  const awayTt = ttLines.away;
  const homeTt = ttLines.home;

  matrix.forEach((score) => {
    if (score.away > score.home) awayReg += score.p;
    else if (score.home > score.away) homeReg += score.p;
    else tie += score.p;

    const total = score.away + score.home;
    if (total > totalLine) over += score.p;
    else if (total < totalLine) under += score.p;
    else totalPush += score.p;

    const homeMarginWithSpread = score.home + homeSpread - score.away;
    if (homeMarginWithSpread > 0) homeCover += score.p;
    else if (homeMarginWithSpread < 0) awayCover += score.p;
    else spreadPush += score.p;

    if (score.away > awayTt) awayTeamOver += score.p;
    else if (score.away === awayTt) awayTeamPush += score.p;
    if (score.home > homeTt) homeTeamOver += score.p;
    else if (score.home === homeTt) homeTeamPush += score.p;
  });

  const noPushTotal = Math.max(0.001, 1 - totalPush);
  const noPushSpread = Math.max(0.001, 1 - spreadPush);
  const noPushAwayTt = Math.max(0.001, 1 - awayTeamPush);
  const noPushHomeTt = Math.max(0.001, 1 - homeTeamPush);
  const awayMl = awayReg + tie * 0.5;
  const homeMl = homeReg + tie * 0.5;
  const awayTtOver = awayTeamOver / noPushAwayTt;
  const homeTtOver = homeTeamOver / noPushHomeTt;

  return {
    moneyline: [
      { label: `${awayTeam} ML`, probability: awayMl, odds: americanOdds(awayMl), key: "awayML" },
      { label: `${homeTeam} ML`, probability: homeMl, odds: americanOdds(homeMl), key: "homeML" }
    ],
    totals: [
      { label: `Over ${totalLine}`, probability: over / noPushTotal, odds: americanOdds(over / noPushTotal), key: "over" },
      { label: `Under ${totalLine}`, probability: under / noPushTotal, odds: americanOdds(under / noPushTotal), key: "under" }
    ],
    runline: [
      { label: `${homeTeam} ${homeSpread}`, probability: homeCover / noPushSpread, odds: americanOdds(homeCover / noPushSpread), key: "homeRunline" },
      { label: `${awayTeam} ${homeSpread > 0 ? "-" : "+"}${Math.abs(homeSpread)}`, probability: awayCover / noPushSpread, odds: americanOdds(awayCover / noPushSpread), key: "awayRunline" }
    ],
    teamTotals: [
      { label: `${awayTeam} over ${formatLine(awayTt)}`, line: awayTt, probability: awayTtOver, odds: americanOdds(awayTtOver), key: "awayTT" },
      { label: `${homeTeam} over ${formatLine(homeTt)}`, line: homeTt, probability: homeTtOver, odds: americanOdds(homeTtOver), key: "homeTT" }
    ]
  };
}

function RecRow({ r, runEnv }) {
  const play = r.suggested_units > 0;
  const edgeStr = r.edge == null ? "" : `${r.edge > 0 ? "+" : ""}${r.edge.toFixed(1)}`;
  const sub = r.can_confirm_clusters.length
    ? `confirms: ${r.can_confirm_clusters.join(", ")}`
    : (r.failed_gates[0] || r.projection);
  const isTotal = r.market === "Total" || r.market === "Team total" || r.market === "First 5";
  const re = runEnv || {};
  const on = re.enabled && re.n >= 1;
  const pct = re.factor != null ? (re.factor - 1) * 100 : 0;
  const prov = !isTotal ? "" : (on
    ? `RUN ENV: ${Number(re.rawTotal || 0).toFixed(1)}→${Number(re.adjTotal || 0).toFixed(1)} · ${pct >= 0 ? "+" : ""}${pct.toFixed(1)}%${re.capped ? ` capped ±${Number(re.capPct || 8).toFixed(0)}%` : ""} · ${re.n || 0} clean nights, Coors/blowouts excl · ON${re.lowSample ? " · LOW SAMPLE" : ""}`
    : "RUN ENV: off, raw model only");
  return (
    <div className="rec-row" style={{ border: "1px solid " + (play ? "#bfe3cd" : "#e7ecf1"), background: play ? "#f1faf4" : "#fafbfc" }}>
      <div className="rec-main">
        <div style={{ fontSize: 12.5 }}><strong>{r.selection}</strong> <span style={{ color: "#8793a2" }}>{r.market}{r.odds != null ? ` · ${formatOdds(r.odds)}` : ""}</span></div>
        <div className="rec-sub" style={{ fontSize: 10, color: "#8793a2" }}>{sub}{r.angle ? ` · ${r.angle}` : ""}</div>
        {prov ? <div className="rec-sub" style={{ fontSize: 9.5, fontWeight: 700, color: on ? (re.lowSample ? "#9a3412" : "#2d6cdf") : "#9aa6b4" }}>{prov}</div> : null}
        {r.env && r.env.env_dependent ? (
          <div className="rec-sub" style={{ fontSize: 9.5, fontWeight: 800, color: "#9a3412", background: "#fff3ec", border: "1px solid #ffd2b3", borderRadius: 4, padding: "2px 5px", marginTop: 2 }}>
            ⚠ ENV-DEPENDENT TEAM TOTAL · raw {Number(r.env.raw_team_total).toFixed(1)}→adj {Number(r.env.adjusted_team_total).toFixed(1)} · env +{Number(r.env.env_added_runs).toFixed(2)} R · share {Math.round(Number(r.env.env_share_of_edge) * 100)}%
          </div>
        ) : null}
      </div>
      <div className="rec-right">
        <div style={{ fontSize: 12, fontVariantNumeric: "tabular-nums" }}>fair {formatOdds(r.fair_odds)}</div>
        <div style={{ fontSize: 10.5, fontWeight: 800, color: play ? "#11824a" : "#9aa6b4" }}>{r.confidence}{play ? ` · ${r.suggested_units}u · to ${formatOdds(r.play_to_price)}` : ""}</div>
      </div>
    </div>
  );
}

function MarketRow({ item, marketOdds, setOdd }) {
  const book = marketOdds[item.key];
  const hasBook = book !== undefined && book !== "" && !isNaN(Number(book));
  const ev = hasBook ? evPer100(item.probability, Number(book)) : null;
  const units = ev !== null && ev > 0 ? kellyUnits(item.probability, Number(book)) : 0;
  return (
    <div className="market-row">
      <span>{item.label}</span>
      <strong>{formatOdds(item.odds)}</strong>
      <input
        value={formatBookInput(book)}
        placeholder="line"
        onChange={(event) => setOdd(item.key, event.target.value)}
        style={{ minHeight: 26, height: 26, padding: "2px 6px", fontSize: 12, textAlign: "right" }}
      />
      <span className={units > 0 ? "ev-pos" : "muted"}>
        {units > 0 ? `${units}u` : "-"}
      </span>
    </div>
  );
}

function CustomerPickRow({ r }) {
  const units = Number(r.suggested_units || 0);
  const book = r.odds != null ? formatOdds(r.odds) : "enter price";
  const toPrice = r.play_to_price != null ? formatOdds(r.play_to_price) : "";
  return (
    <div style={{ display: "grid", gap: 4, padding: "10px 12px", borderRadius: 8, border: "1px solid #d9e8dd", background: "#f4fbf6" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "baseline", flexWrap: "wrap" }}>
        <strong style={{ fontSize: 13.5 }}>{r.selection}</strong>
        <span style={{ color: units > 0 ? "#11824a" : "#667386", fontWeight: 800, fontSize: 12.5 }}>{units > 0 ? `${units}u` : r.confidence}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", color: "#667386", fontSize: 11.5 }}>
        <span>{r.market} · book {book}</span>
        <span>{toPrice ? `play to ${toPrice}` : "watchlist"}</span>
      </div>
    </div>
  );
}

function CustomerPropAngle({ item }) {
  return (
    <div style={{ display: "grid", gap: 4, padding: "9px 11px", borderRadius: 8, border: "1px solid #e1e7ee", background: "#fbfcfd" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "baseline", flexWrap: "wrap" }}>
        <strong style={{ fontSize: 13 }}>{item.selection}</strong>
        <span style={{ color: "#667386", fontSize: 11.5, fontWeight: 800 }}>{item.market}</span>
      </div>
      <div style={{ color: "#667386", fontSize: 11.5, lineHeight: 1.35 }}>{item.note}</div>
    </div>
  );
}

function PitcherCard({ arm, team, projK, projOuts, expIP, pitchRef, rawK, adjK, oppK, oppAbbr }) {
  if (!arm) return <div style={{ color: "#667386", fontSize: 13 }}>No pitcher selected</div>;
  const row = (k, v) => (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, padding: "2px 0" }}>
      <span style={{ color: "#667386" }}>{k}</span><strong>{v}</strong>
    </div>
  );
  return (
    <div style={{ border: "1px solid #e1e7ee", borderRadius: 8, padding: "10px 12px", background: "#fbfcfd" }}>
      <div style={{ fontWeight: 800, fontSize: 14 }}>{arm.name}</div>
      <div style={{ color: "#667386", fontSize: 12, marginBottom: 6 }}>{team} · {arm.hand || "?"}HP</div>
      {row(arm.xera != null ? "xERA" : arm.era != null ? "ERA" : "Run prevention", arm.xera != null ? Number(arm.xera).toFixed(2) : arm.era != null ? Number(arm.era).toFixed(2) : "neutral")}
      {row("K%", arm.k != null ? `${Number(arm.k).toFixed(1)}%` : "—")}
      {adjK != null && oppK != null ? row(
        `Adj K% vs ${oppAbbr || "opp"}`,
        `${(Number(rawK) * 100).toFixed(1)}% \u2192 ${(Number(adjK) * 100).toFixed(1)}%`
      ) : null}
      {row("BB%", arm.bb != null ? `${Number(arm.bb).toFixed(1)}%` : "—")}
      {arm.avgStartPitches != null ? row("Avg start", `${Number(arm.ip ?? 0).toFixed(1)} IP · ${Number(arm.avgStartPitches).toFixed(0)} pit`) : null}
      {arm.chaseGenerated != null ? row("Chase gen", `${(Number(arm.chaseGenerated) * 100).toFixed(1)}%`) : null}
      {arm.swingingStrikeRate != null ? row("SwStr", `${(Number(arm.swingingStrikeRate) * 100).toFixed(1)}%`) : null}
      {arm.barrelAllowed != null ? row("Barrel allowed", `${(Number(arm.barrelAllowed) * 100).toFixed(1)}%`) : null}
      {row("Exp IP", Number(expIP ?? arm.ip).toFixed(1))}
      {row("Proj K", projK.toFixed(1))}
      {row("Proj outs", Math.round(projOuts))}
      {arm.mix && arm.mix.length ? (
        <div style={{ marginTop: 7, paddingTop: 7, borderTop: "1px solid #eef2f6" }}>
          <div style={{ fontSize: 10.5, color: "#8793a2", fontWeight: 800, marginBottom: 3 }}>ARSENAL</div>
          {arm.mix.map((m) => (
            <div key={m.t} style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, padding: "1px 0" }}>
              <span style={{ color: "#667386" }}>{(pitchRef && pitchRef[m.t]) || m.t}</span>
              <span><strong>{m.u}%</strong>{m.slg != null ? <span style={{ color: "#8793a2" }}> · .{String(Math.round(Number(m.slg) * 1000)).padStart(3, "0")} SLG</span> : null}{m.v ? <span style={{ color: "#8793a2" }}> · {m.v}</span> : null}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function RunBar({ team, parts, total, status }) {
  const spPct = total > 0 ? clamp((parts.sp / total) * 100, 0, 100) : 0;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 4 }}>
        <strong>{team} {total.toFixed(2)} R</strong>
        <span style={{ color: "#667386" }}>SP {parts.sp.toFixed(2)} · pen {parts.pen.toFixed(2)} ({status} ×{parts.statusMult.toFixed(2)})</span>
      </div>
      <div style={{ display: "flex", height: 10, borderRadius: 5, overflow: "hidden", background: "#e7ecf1" }}>
        <div style={{ width: `${spPct}%`, background: "#2d6cdf" }} />
        <div style={{ width: `${100 - spPct}%`, background: "#8db2e8" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, color: "#8793a2", marginTop: 3 }}>
        <span>vs SP ({parts.starterIp.toFixed(1)} ip · ×{parts.starterFactor.toFixed(2)})</span>
        <span>vs pen ({parts.bullpenIp.toFixed(1)} ip · ×{parts.penFactor.toFixed(2)})</span>
      </div>
    </div>
  );
}

// A K rate is usable only if it is real. Placeholder arms carry GUESSED rates (round 15/20/22)
// and must not produce a priced strikeout market — that is fabricated pricing, not a projection.
function hasRealKRate(arm) {
  return !!arm && !!arm.name && Number(arm.k) > 0 && !String(arm.source || "").includes("placeholder");
}

function DamagePanel({ report, awayTeam, homeTeam, awayArm, homeArm }) {
  return null;
}

function DisciplinePanel({ report, awayTeam, homeTeam, awayArm, homeArm }) {
  return null;
}

function KMechanismPanel({ arm, mech, oppTeam, oppAbbr, rawK, adjK, kConv, finalK, projK, bf }) {
  return null;
}

function KProp({ arm, projK, line, setLine, oddsKey, marketOdds, setOdd, mech, oppTeam, oppAbbr, rawK, adjK, kConv, finalK, bf, kExpIP, baselineProjK, noDamageProjK, baselineExpIP, noDamageExpIP, kWorkloadMode, publicMode = false }) {
  if (!arm) return null;
  // DATA GATE: no usable K rate (bullpen game, placeholder, unknown arm) => show no prices.
  // Missing data must never render as a priced certainty.
  const hasK = hasRealKRate(arm);
  if (!hasK) {
    return (
      <div style={{ border: "1px dashed #d3dae3", borderRadius: 8, padding: "10px 12px", background: "#fbfcfd" }}>
        <strong style={{ fontSize: 13.5 }}>{arm.name}</strong>
        <div style={{ color: "#8a94a3", fontSize: 12, marginTop: 4 }}>
          No strikeout market — no verified K rate for this arm{arm.source ? ` (${String(arm.source).split("(")[0].trim()})` : ""}.
        </div>
      </div>
    );
  }
  const pOver = kOverProb(projK, Number(line)); // negative binomial, matches the rec engine
  const sides = [
    { label: `Over ${Number(line).toFixed(1)} K`, p: pOver, k: oddsKey },
    { label: `Under ${Number(line).toFixed(1)} K`, p: 1 - pOver, k: `${oddsKey}U` }
  ];
  return (
    <div style={{ border: "1px solid #e1e7ee", borderRadius: 8, padding: "10px 12px", background: "#fbfcfd" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <strong style={{ fontSize: 13.5 }}>{arm.name}</strong>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: "#667386", fontSize: 12 }}>proj {projK.toFixed(1)} K</span>
          <label style={{ display: "flex", alignItems: "center", gap: 4, color: "#5e6b7c", fontSize: 11 }}>Line
            <input type="number" step="0.5" value={line} onChange={(event) => setLine(event.target.value)} style={{ minHeight: 26, height: 26, padding: "2px 6px", width: 54 }} />
          </label>
        </div>
      </div>
      {publicMode ? (
        <div style={{ marginTop: 6, color: "#667386", fontSize: 10.5 }}>
          Scenario: {kWorkloadMode === "no_damage" ? "pitcher efficiency / no damage workload penalty" : "baseline workload"}
        </div>
      ) : (
        <div style={{ marginTop: 6, display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap", color: "#667386", fontSize: 10.5 }}>
          <span>K workload: {kWorkloadMode === "no_damage" ? "no damage IP penalty" : "baseline"} · {Number(kExpIP ?? 0).toFixed(1)} IP / {Number(bf ?? 0).toFixed(1)} BF</span>
          <span>base {Number(baselineProjK ?? projK).toFixed(1)} K · no-dmg {Number(noDamageProjK ?? projK).toFixed(1)} K</span>
        </div>
      )}
      <div className="market-table" style={{ padding: 0, marginTop: 8 }}>
        <div className="market-head"><span>Market</span><span>Fair</span><span>Book</span><span>Bet</span></div>
        {sides.map((sd) => {
          const book = marketOdds[sd.k];
          const has = book !== undefined && book !== "" && !isNaN(Number(book));
          const ev = has ? evPer100(sd.p, Number(book)) : null;
          const units = ev !== null && ev > 0 ? kellyUnits(sd.p, Number(book)) : 0;
          return (
            <div className="market-row" key={sd.k}>
              <span>{sd.label} <span style={{ color: "#8793a2" }}>{(sd.p * 100).toFixed(0)}%</span></span>
              <strong style={{ fontVariantNumeric: "tabular-nums" }}>{formatOdds(americanOdds(sd.p))}</strong>
              <input value={formatBookInput(book)} placeholder="line" onChange={(event) => setOdd(sd.k, event.target.value)} style={{ minHeight: 26, height: 26, padding: "2px 6px", width: "100%", textAlign: "right" }} />
              <span className={units > 0 ? "ev-pos" : "muted"}>{units > 0 ? `${units}u` : "-"}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SoftSpotBlock({ label, match, soft }) {
  const m = match || { mult: 1, excess: 0 };
  const tilt = m.mult > 1.005 ? "offense" : m.mult < 0.995 ? "pitcher" : "neutral";
  const tiltText = tilt === "offense" ? "edge to offense" : tilt === "pitcher" ? "edge to pitcher" : "neutral";
  const fmt3 = (v) => (v == null ? "—" : v.toFixed(3).replace(/^0/, ""));
  const pctv = (v) => (v == null ? "—" : `${Math.round(v * 100)}%`);
  return (
    <div style={{ border: "1px solid #e1e7ee", borderRadius: 8, padding: "10px 12px", background: "#fbfcfd" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <strong style={{ fontSize: 12.5 }}>{label}</strong>
        <span style={{ fontSize: 12, fontWeight: 800, color: tilt === "offense" ? "#11824a" : tilt === "pitcher" ? "#b24040" : "#667386" }}>
          ×{m.mult.toFixed(3)} <span style={{ fontWeight: 600, color: "#8793a2" }}>{tiltText}</span>
        </span>
      </div>
      {soft && soft.offense.length ? soft.offense.map((s) => (
        <div key={`o-${s.t}`} style={{ marginTop: 6 }}>
          <div style={{ fontSize: 11.5, color: "#11824a" }}>
            ▲ Soft spot: <strong>{s.name}</strong> ({s.u}%) — lineup ranks #{s.rk} vs it ({s.rv >= 0 ? "+" : ""}{s.rv} rv/100)
          </div>
          {s.hitter ? (
            <div style={{ fontSize: 10.5, color: "#667386", marginLeft: 12, marginTop: 1 }}>
              {s.hitter.n}: run {s.hitter.rv >= 0 ? "+" : ""}{s.hitter.rv} · hit {fmt3(s.hitter.ba)} · slug {fmt3(s.hitter.slg)} · HR/brl {pctv(s.hitter.brl)} · whiff {pctv(s.hitter.wh)}
            </div>
          ) : null}
        </div>
      )) : null}
      {soft && soft.pitcherEdge.length ? soft.pitcherEdge.map((s) => (
        <div key={`p-${s.t}`} style={{ fontSize: 11.5, marginTop: 6, color: "#b24040" }}>
          ▼ Pitcher exploits: <strong>{s.name}</strong> ({s.u}%) — lineup ranks #{s.rk} vs it
        </div>
      )) : null}
      {soft && soft.kTargets && soft.kTargets.length ? soft.kTargets.map((s) => (
        <div key={`k-${s.t}`} style={{ fontSize: 11.5, marginTop: 6, color: "#b24040" }}>
          ◎ K target: <strong>{s.hitter}</strong> — {pctv(s.wh)} whiff vs {s.pitch} ({s.u}%){s.ch != null ? `, ${pctv(s.ch)} chase` : ""}
        </div>
      )) : null}
      {soft && !soft.offense.length && !soft.pitcherEdge.length && (!soft.kTargets || !soft.kTargets.length) ? (
        <div style={{ fontSize: 11.5, marginTop: 5, color: "#8793a2" }}>No standout pitch-type mismatch</div>
      ) : null}
    </div>
  );
}

function poissonOverProb(mean, line) {
  return poissonOver(Math.max(mean, 0.05), line);
}

// Strikeout totals are a MIXED Poisson, not a Poisson: innings pitched (the exposure) is
// itself random — an arm gets chased in the 3rd or goes 7. That makes the marginal K
// distribution overdispersed, so a plain Poisson overstates P(over) for lines above the
// projection. Modeled as negative binomial with var = mu + mu^2/r.
// r calibrated from residual variance of actual K around projK (7/7/26, n=23 starters:
// mu 5.42, resid var 7.54 -> r ~= 14). SMALL SAMPLE — refit as the graded set grows.
// Log5 (Bill James): combine a pitcher's K rate with the opposing lineup's K rate,
// normalized to league. A 33% K arm vs a 19% K lineup is NOT a 33% K arm.
// expIP stays on the run-value channel (getting squared up shortens a start); whiff belongs here.
// RULE 3: placeholder arms are excluded from every priced or derived path.
// For pricing paths (K market, pitcher win, discipline) we suppress the market outright.
// For the RUN path we cannot suppress the game, so the arm must contribute IDENTITY --
// league-average xERA and neutral BB% -- rather than a guessed value that would silently
// move totals, sides and F5. `measured: true` opts out (e.g. a bullpen game whose xera is
// the team's real measured bullpen ERA).
function neutralizeArm(arm, league) {
  if (!arm) return arm;
  if (!String(arm.source || "").includes("placeholder")) return arm;
  if (arm.measured) return arm;
  return { ...arm, xera: Number(league?.era || 4.15), bb: 8, _neutralized: true };
}

function log5Rate(pitcherRate, batterRate, leagueRate) {
  const p = Number(pitcherRate), b = Number(batterRate), lg = Number(leagueRate);
  if (!(p > 0 && p < 1) || !(b > 0 && b < 1) || !(lg > 0 && lg < 1)) return Number(pitcherRate) || 0;
  const num = (p * b) / lg;
  const den = num + ((1 - p) * (1 - b)) / (1 - lg);
  return den > 0 ? num / den : p;
}

// PLATE-DISCIPLINE / PITCH-EFFICIENCY CHANNEL.
// A patient lineup (low chase, low waste-zone swings) grinds a starter's pitch count and
// pulls him early; a chase-happy lineup hands him cheap outs and lets him go deep. This is a
// VOLUME effect (innings), not a rate effect, so it does NOT double-count xERA (a rate) or
// team rpg / K% (already embedded in the run and K layers).
// patience > 0 => more patient than league => starter exits sooner.
// Coefficient is conservative and capped; NOT yet fit to graded IP data. Refit when the
// SP-innings sample is large enough (see grader).
const PATIENCE_IP_COEF = 0.6;
const PATIENCE_IP_CAP = 0.05;   // +/-5% on expected starter IP
function patienceIpFactor(oppTeam, league) {
  if (!oppTeam || oppTeam.teamChase == null) return 1;
  const lgChase = Number(league?.chase || 0.2587), lgWaste = Number(league?.waste || 0.0729);
  const patience = (lgChase - Number(oppTeam.teamChase)) + (lgWaste - Number(oppTeam.teamWaste));
  return clamp(1 - PATIENCE_IP_COEF * patience, 1 - PATIENCE_IP_CAP, 1 + PATIENCE_IP_CAP);
}

// ---- DISCIPLINE INTERACTION LAYER -----------------------------------------
// A bounded MATCHUP modifier on offensive run expectation. It answers "does this lineup's
// approach make THIS pitcher better or worse than his baseline, and does he exploit them?"
// NOT "is this lineup disciplined?" (that is already inside rpg / xwOBA / K%).
//
// Both terms are products of DEVIATIONS, so the modifier is exactly 1.0 whenever either
// side is league-average. That is what prevents double-counting season-level information.
//
//   exposure       = lineupChase_z * pitcherChaseGen_z
//                    chasers vs a chase-generator      -> offense DOWN
//                    patient bats vs a chase-dependent -> offense UP (his weapon is neutralized)
//   commandExploit = lineupPatience_z * pitcherWildness_z
//                    patient vs poor command -> offense UP  (walks, deep counts)
//                    aggressive vs wild      -> offense DOWN (they bail him out)
//
// NOTE: pitcherChaseGen is PROXIED by K% z-score — we have no pitcher O-Swing%/chase-induced
// rate loaded. Swap in the real rate when available. Coefficients are deliberately small and
// the whole thing is capped at +/-4%: this is a secondary modifier alongside park and bullpen,
// NOT a second run model. Pitch/arsenal interaction remains primary.
const DISC_CHASE_COEF = 0.010;    // pitcher's chase weapon vs lineup's chase propensity
const DISC_COMMAND_COEF = 0.008;  // lineup patience vs pitcher command
const DISC_FINISH_COEF = 0.008;   // lineup patience vs pitcher's inability to put hitters away
const DISC_CAP = 0.04;
const DISC_Z_CLIP = 2.0;

// League baselines computed from loaded data (real arms only, placeholders excluded).
let _discBase = null;
function disciplineBaselines(data) {
  if (_discBase) return _discBase;
  const arms = (data.pitchers || []).filter(
    (p) => Number(p.k) > 0 && Number(p.bb) > 0 && !String(p.source || "").includes("placeholder")
  );
  const teams = data.teams || [];
  const mean = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0);
  const sd = (a) => { const m = mean(a); return Math.sqrt(mean(a.map((x) => (x - m) ** 2))) || 1; };
  const ks = arms.map((p) => Number(p.k)), bbs = arms.map((p) => Number(p.bb));
  const ch = teams.map((t) => Number(t.teamChase) * 100).filter((x) => x > 0);
  _discBase = { pK: mean(ks), pKsd: sd(ks), pBB: mean(bbs), pBBsd: sd(bbs), chase: mean(ch), chaseSd: sd(ch) };
  return _discBase;
}

// battingTeam's offense vs opposingPitcher. Bounded multiplier near 1.0.
//   A) chase channel  : gated on genZ > 0. A pitcher who cannot generate chase has no chase
//                       weapon, so the channel is silent rather than rewarding either side.
//   B) command channel: patience x wildness.
//   C) finish channel : gated on genZ < 0. Patient bats vs an arm that cannot put hitters
//                       away extend counts and find mistakes.
// Every term is a product of deviations => modifier is exactly 1.0 if EITHER side is average.
function disciplineMatchup(battingTeam, opposingPitcher, data) {
  const NONE = { mult: 1, chase: 0, command: 0, finish: 0 };
  if (!battingTeam || !opposingPitcher) return NONE;
  // Placeholder arms carry GUESSED K%/BB% (round 15/20/22). They must not drive the chase-weapon
  // proxy or the command channel, exactly as they are barred from pricing a K market.
  if (String(opposingPitcher.source || "").includes("placeholder")) return NONE;
  if (!(Number(opposingPitcher.k) > 0) || !(Number(opposingPitcher.bb) > 0)) return NONE;
  if (battingTeam.teamChase == null) return NONE;
  const b = disciplineBaselines(data);
  const z = (v, m, sd) => clamp((v - m) / sd, -DISC_Z_CLIP, DISC_Z_CLIP);

  const chaseZ = z(Number(battingTeam.teamChase) * 100, b.chase, b.chaseSd); // + = chases more
  const patienceZ = -chaseZ;
  // chase weapon = arsenal-based chase reliance (NOT raw K%: K% says he gets Ks, not how).
  const rel = chaseReliance(opposingPitcher, data);
  const genZ = rel == null ? 0 : clamp(rel, -DISC_Z_CLIP, DISC_Z_CLIP);
  const finishZ = z(Number(opposingPitcher.k), b.pK, b.pKsd);  // K% = ability to put hitters away
  const wildZ = z(Number(opposingPitcher.bb), b.pBB, b.pBBsd); // + = poor command

  const chaseTerm = chaseZ * Math.max(genZ, 0);            // A: needs a real chase weapon
  const commandTerm = patienceZ * wildZ;                    // B
  const finishTerm = patienceZ * Math.max(-finishZ, 0);     // C: cannot put hitters away (K%)

  const raw = 1
    - DISC_CHASE_COEF * chaseTerm
    + DISC_COMMAND_COEF * commandTerm
    + DISC_FINISH_COEF * finishTerm;
  const mult = clamp(raw, 1 - DISC_CAP, 1 + DISC_CAP);
  return {
    mult, capped: Math.abs(raw - mult) > 1e-9,
    chaseZ, patienceZ, genZ, wildZ, finishZ,
    chase: chaseTerm, command: commandTerm, finish: finishTerm,
    chaseContrib: -DISC_CHASE_COEF * chaseTerm,
    commandContrib: DISC_COMMAND_COEF * commandTerm,
    finishContrib: DISC_FINISH_COEF * finishTerm,
    genIsProxy: opposingPitcher?.chaseGenerated == null  // false when real pitcher chase-generation data is loaded
  };
}

// ---- DAMAGE PRESSURE INTERACTION -------------------------------------------
// "Does this lineup have the damage profile to punish THIS pitcher's weakness today?"
// Pure interaction: lineup_damage x pitcher_damage_allowed x pitch_matchup_gate.
// Zero when either side is league-average, so it cannot double-count rpg / xwOBA / xERA.
//
// SCOPE NOTE (important): pitcher_damage_allowed is TEAM STAFF allowed, not starter-specific.
// Savant team pitching tables are what we have. A staff number is a decent first-build stand-in
// for the starter, but it is NOT the starter's own barrel/hard-hit/xSLG allowed. Upgrade to
// starter-level splits when available. Placeholder arms => identity (no damage effect at all).
//
// PITCH MATCHUP GATE: the spec wants pitch_type_tb_rate allowed vs blended SLG. We have no
// per-pitcher per-pitch damage-allowed data. We DO have real run value by pitch type
// (`pitchRV`), which is exactly "does this lineup profile well against his top pitches" --
// the arsenal multiplier the model already computes. Gate reads that, not a proxy stat.
const DAMAGE_RUN_WEIGHT = 0.025;
const DAMAGE_IP_WEIGHT = 0.020;
const DAMAGE_TB_WEIGHT = 0.030;
const DAMAGE_HR_WEIGHT = 0.050;
const DAMAGE_HITS_WEIGHT = 0.010;
const DAMAGE_HRR_WEIGHT = 0.025;

let _dmgBase = null;
function damageBaselines(data) {
  if (_dmgBase) return _dmgBase;
  const T = data.teams || [];
  const mean = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0);
  const sd = (a) => { const m = mean(a); return Math.sqrt(mean(a.map((x) => (x - m) ** 2))) || 1; };
  const col = (k) => T.map((t) => Number(t[k])).filter((x) => !isNaN(x));
  const st = (k) => ({ m: mean(col(k)), s: sd(col(k)) });
  _dmgBase = {
    barrel: st("barrel"), hardHit: st("hardHit"), iso: st("iso"), slg: st("slg"),
    barrelAllowed: st("barrelAllowed"), hardHitAllowed: st("hardHitAllowed"),
    hrFbAllowed: st("hrFbAllowed"), slgAllowed: st("slgAllowed"), xslgAllowed: st("xslgAllowed")
  };
  return _dmgBase;
}
const _z = (v, st) => (st && st.s ? (Number(v) - st.m) / st.s : 0);

function lineupDamageScore(team, data) {
  if (!team || team.barrel == null || team.hardHit == null || team.iso == null || team.slg == null) return null;
  const b = damageBaselines(data);
  return 0.30 * _z(team.barrel, b.barrel) + 0.25 * _z(team.hardHit, b.hardHit)
       + 0.25 * _z(team.iso, b.iso) + 0.20 * _z(team.slg, b.slg);
}

// Damage allowed. NEVER derived from xERA, K%, or RPG.
// Prefers STARTER-level fields when the arm carries them; falls back to TEAM STAFF and says so.
// A staff aggregate includes the bullpen: an ace on a leaky staff is punished, a soft-tosser on
// an elite staff gets a free pass. That is a known limitation, surfaced in `source`, not hidden.
const DAMAGE_ALLOWED_FIELDS = ["barrelAllowed", "hardHitAllowed", "hrFbAllowed", "slgAllowed", "xslgAllowed"];
function hasStarterDamageAllowed(arm) {
  return !!arm && DAMAGE_ALLOWED_FIELDS.slice(0, 4).every((k) => arm[k] != null);
}
function pitcherDamageAllowedScore(pitcherTeam, data, arm) {
  const useStarter = hasStarterDamageAllowed(arm);
  const src = useStarter ? arm : pitcherTeam;
  if (!src || src.barrelAllowed == null || src.hardHitAllowed == null) return null;
  const b = damageBaselines(data);
  const xslg = src.xslgAllowed != null ? _z(src.xslgAllowed, b.xslgAllowed) : 0;
  const score = 0.30 * _z(src.barrelAllowed, b.barrelAllowed)
    + 0.25 * _z(src.hardHitAllowed, b.hardHitAllowed)
    + 0.20 * _z(src.hrFbAllowed, b.hrFbAllowed)
    + 0.15 * _z(src.slgAllowed, b.slgAllowed)
    + 0.10 * xslg;
  return { score, source: useStarter ? "starter" : "staff" };
}

// arsenalMatchup mult: >1 means the lineup profiles well against what he throws.
function pitchMatchupGate(arsenalMult) {
  const m = Number(arsenalMult);
  if (!isFinite(m)) return 0.5;
  if (m >= 1.05) return 1.0;    // lineup profiles well vs his top pitches
  if (m <= 0.95) return 0.25;   // negative pitch matchup -> muted
  return 0.5;                   // neutral
}

// battingTeam's damage vs the arm it faces (arm's staff = pitcherTeam).
function damagePressure(battingTeam, opposingArm, pitcherTeam, arsenalMult, data) {
  const IDENTITY = {
    pressure: 0, gate: 0, lineup: null, allowed: null, allowedSource: null, exploit: 0,
    run: 1, ip: 1, tb: 1, hr: 1, hits: 1, hrr: 1, reason: null
  };
  if (!opposingArm) return { ...IDENTITY, reason: "no arm" };
  if (String(opposingArm.source || "").includes("placeholder")) return { ...IDENTITY, reason: "placeholder arm" };
  const lineup = lineupDamageScore(battingTeam, data);
  const allowedObj = pitcherDamageAllowedScore(pitcherTeam, data, opposingArm);
  if (lineup == null) return { ...IDENTITY, reason: "missing lineup damage data" };
  if (allowedObj == null) return { ...IDENTITY, reason: "missing damage-allowed data" };
  const allowed = allowedObj.score;
  const allowedSource = allowedObj.source;   // "starter" | "staff"
  // GUARANTEE 2: a below-average-damage lineup produces NO damage effect, up or down.
  // Its weakness is already priced into rpg / the offense baseline.
  if (lineup <= 0) {
    return { ...IDENTITY, lineup, allowed, allowedSource, exploit: 0,
      reason: "lineup below league-average damage — baseline already prices it" };
  }
  const gate = pitchMatchupGate(arsenalMult);
  // SIGN GUARD. A raw signed product (lineup * allowed) inverts in the lineup-negative
  // quadrants: a weak lineup would draw its biggest DOWNGRADE against the most barrel-prone
  // staff, and a BOOST against the best suppressor. Both are wrong -- a lineup's lack of
  // damage is already inside its rpg/xwOBA.
  // Damage pressure requires damage CAPABILITY: below-average damage lineups exert none, in
  // either direction. Above-average lineups are boosted by vulnerable staffs and suppressed
  // by good ones, which is the whole point of the layer.
  const exploit = Math.max(lineup, 0);
  const pressure = exploit * allowed * gate;
  return {
    pressure, gate, lineup, allowed, allowedSource, exploit, reason: null,
    run: 1 + clamp(DAMAGE_RUN_WEIGHT * pressure, -0.035, 0.060),
    ip: 1 - clamp(DAMAGE_IP_WEIGHT * Math.max(pressure, 0), 0.000, 0.060),
    tb: 1 + clamp(DAMAGE_TB_WEIGHT * pressure, -0.040, 0.080),
    hr: 1 + clamp(DAMAGE_HR_WEIGHT * pressure, -0.050, 0.120),
    hits: 1 + clamp(DAMAGE_HITS_WEIGHT * pressure, -0.020, 0.030),
    hrr: 1 + clamp(DAMAGE_HRR_WEIGHT * pressure, -0.030, 0.070)
  };
}

// ---- CHASE / CHASE-CONTACT K WEIGHTING -------------------------------------
// Chase is NOT a universal K bump. It only matters when the pitcher's K mechanism DEPENDS on
// hitters expanding the zone. Answer: "does this pitcher need chase, and does this lineup
// give him chase AND miss?"  Applied to the K RATE only -- never to batters faced or expIP.
const CHASE_K_WEIGHT = 0.035;
const CHASE_K_LO = 0.92, CHASE_K_HI = 1.08;
const CHASE_RELIANCE_CLIP = 1.5;

// Chase-oriented offerings (hitters must expand to swing): sliders/sweepers/slurves,
// splitters, changeups. Curveballs/knuckle-curves earn half credit -- they generate chase
// but also a large share of called strikes.
const CHASE_PITCH_WEIGHT = { SL: 1, ST: 1, SV: 1, FS: 1, CH: 1, FO: 1, CU: 0.5, KC: 0.5, CS: 0.5 };
function chasePitchUsage(arm) {
  if (!arm || !arm.mix || !arm.mix.length) return null;
  let u = 0;
  for (const p of arm.mix) u += (CHASE_PITCH_WEIGHT[p.t] || 0) * Number(p.u || 0);
  return u; // 0..100
}

// PROXY, PARTIAL. Spec wants:
//   0.50*z(chase_generated) + 0.25*z(oz_whiff) + 0.20*z(chase_k_share) - 0.15*z(zone_whiff)
// and, absent that:
//   0.50*z(SL/FS/CH usage) + 0.30*z(whiff) - 0.20*z(zone_rate)
// We have arsenal usage only -- no per-pitcher whiff rate, no zone rate. So the usage term
// carries full weight and the missing terms are OMITTED, not invented.
// Raw pitcher K% is deliberately NOT used: K% says he gets Ks, not HOW.
let _chaseBase = null;
function chaseBaselines(data) {
  if (_chaseBase) return _chaseBase;
  const arms = (data.pitchers || []).filter(
    (p) => !String(p.source || "").includes("placeholder") && p.mix && p.mix.length
  );
  const us = arms.map(chasePitchUsage).filter((x) => x != null);
  const teams = data.teams || [];
  const mean = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0);
  const sd = (a) => { const m = mean(a); return Math.sqrt(mean(a.map((x) => (x - m) ** 2))) || 1; };
  const ch = teams.map((t) => Number(t.teamChase) * 100);
  const cc = teams.map((t) => Number(t.teamChaseContact) * 100);
  const cg = arms.map((p) => Number(p.chaseGenerated) * 100).filter((x) => x > 0);
  const oz = arms.map((p) => Number(p.outOfZoneWhiffRate) * 100).filter((x) => x > 0);
  const zw = arms.map((p) => Number(p.zoneWhiffRate) * 100).filter((x) => x > 0);
  _chaseBase = { usage: mean(us), usageSd: sd(us), chase: mean(ch), chaseSd: sd(ch), cc: mean(cc), ccSd: sd(cc), gen: mean(cg), genSd: sd(cg), ozWhiff: mean(oz), ozWhiffSd: sd(oz), zoneWhiff: mean(zw), zoneWhiffSd: sd(zw) };
  return _chaseBase;
}

function chaseReliance(arm, data) {
  if (!arm || String(arm.source || "").includes("placeholder")) return null; // real arms only
  const b = chaseBaselines(data);
  if (arm.chaseRelianceScore != null) return clamp(Number(arm.chaseRelianceScore), -CHASE_RELIANCE_CLIP, CHASE_RELIANCE_CLIP);
  if (arm.chaseGenerated != null && b.genSd) {
    const genZ = (Number(arm.chaseGenerated) * 100 - b.gen) / b.genSd;
    const ozZ = arm.outOfZoneWhiffRate != null && b.ozWhiffSd ? (Number(arm.outOfZoneWhiffRate) * 100 - b.ozWhiff) / b.ozWhiffSd : 0;
    const zoneZ = arm.zoneWhiffRate != null && b.zoneWhiffSd ? (Number(arm.zoneWhiffRate) * 100 - b.zoneWhiff) / b.zoneWhiffSd : 0;
    return clamp(0.60 * genZ + 0.30 * ozZ - 0.10 * zoneZ, -CHASE_RELIANCE_CLIP, CHASE_RELIANCE_CLIP);
  }
  const u = chasePitchUsage(arm);
  if (u == null) return null;
  const zUsage = (u - b.usage) / b.usageSd;
  return clamp(zUsage, -CHASE_RELIANCE_CLIP, CHASE_RELIANCE_CLIP);
}

// high chase + LOW chase-contact = strikeout fuel. high chase + high chase-contact = they
// expand but survive, so the boost shrinks.
function lineupChaseVulnerability(team, data) {
  if (!team || team.teamChase == null || team.teamChaseContact == null) return 0;
  const b = chaseBaselines(data);
  const chaseZ = (Number(team.teamChase) * 100 - b.chase) / b.chaseSd;
  const ccZ = (Number(team.teamChaseContact) * 100 - b.cc) / b.ccSd;
  return 0.65 * chaseZ - 0.35 * ccZ;
}

// Pure interaction: if the pitcher is not chase-reliant, the adjustment is ~1.0 regardless of
// how much the lineup chases. Team K% is NOT re-used here (it lives in the Log5 base path).
// Archetype sets HOW MUCH chase matters (spec: "team chase should have high weight here" /
// "low weight"). Offspeed usage alone cannot distinguish a chase-whiff arm from a contact
// manager whose changeup induces weak contact -- the missing oz_whiff term would. Until that
// data exists, the archetype weight carries that judgement explicitly.
const CHASE_ARCHETYPE_WEIGHT = {
  "chase-reliant": 1.00,
  "balanced": 0.60,
  "zone-dominant": 0.35,
  "command / called-strike": 0.35,
  "low-K contact manager": 0.35
};

function chaseKAdj(arm, oppTeam, data) {
  const rel = chaseReliance(arm, data);
  if (rel == null) return { adj: 1, reliance: null, vulnerability: 0, archetype: "unrated (placeholder / no arsenal)", weight: 0, effReliance: 0 };
  const archetype = kArchetype(arm, rel, data);
  const weight = CHASE_ARCHETYPE_WEIGHT[archetype] ?? 0.6;
  const effReliance = rel * weight;
  const vuln = lineupChaseVulnerability(oppTeam, data);
  const adj = clamp(1 + CHASE_K_WEIGHT * effReliance * vuln, CHASE_K_LO, CHASE_K_HI);
  return { adj, reliance: rel, effReliance, weight, vulnerability: vuln, archetype };
}

function kArchetype(arm, rel, data) {
  const b = disciplineBaselines(data);
  const k = Number(arm.k), bb = Number(arm.bb);
  // below-average K rate: strikeouts come from opponent K% and volume, not chase.
  if (k < b.pK - 0.5 * b.pKsd) return "low-K contact manager";
  if (rel >= 0.5) return "chase-reliant";
  if (rel <= -0.3 && k >= b.pK) return "zone-dominant";
  if (bb <= b.pBB - 0.5 * b.pBBsd && rel <= 0) return "command / called-strike";
  return "balanced";
}

const BATTERS_FACED_PER_IP = 4.3;
// Explicit seams for the strikeout lambda. Held at identity (1.0) because no park-K,
// umpire-K, or conversion data is loaded. Replace with real factors when available.
const K_PARK_FACTOR = 1.0;       // no park-K data loaded
const K_UMPIRE_FACTOR = 1.0;     // no umpire-K data loaded
const K_CONVERSION_ADJ = 1.0;    // no calibrated K-tier adjustment loaded

const K_DISPERSION_R = 14;
function kOverProb(mean, line, r = K_DISPERSION_R) {
  const mu = Math.max(Number(mean) || 0.05, 0.05);
  if (!isFinite(r) || r <= 0) return poissonOverProb(mu, line);
  const x = Math.floor(Number(line));            // P(K > line) for a half-point line
  const p = r / (r + mu);
  let cdf = 0, term = Math.pow(p, r);
  for (let k = 0; k <= x; k++) { cdf += term; term *= ((k + r) / (k + 1)) * (1 - p); }
  return Math.max(0, Math.min(1, 1 - cdf));
}

const MODEL_VERSION = "DiamondModel/2026.07.04";
// Team totals receive a dampened share of the run-env overlay (option 2).
// team_total_env_factor = 1 + TEAM_TOTAL_ENV_WEIGHT * (run_env_factor - 1). Full-game totals keep the full factor.
const TEAM_TOTAL_ENV_WEIGHT = 0.50;
// First-inning (YRFI) is derived from a crude even-inning approximation, so it must clear a
// higher bar than core markets before it is surfaced as actionable (guard against thin overs).
const YRFI_SURFACE_THRESHOLD = 0.65;
const MIN_EDGE_AFTER_VIG = 0.05;
const YRFI_REF_PRICE = -125; // representative YRFI market price for the edge test

// Map a live-engine rec OR a surfaced angle into the daily pick-export schema. Pure/derivational —
// never re-prices or re-picks; it only reshapes what the model already surfaced. Every surfaced
// row (rec_engine, lean, angle) is exported so the grader can catch anything that can lose money.
function toExportPick(rec, meta) {
  const { date, away, home, pitchers, awayStarterSrc, homeStarterSrc } = meta;
  const isAngle = rec._source === "angle" || rec.source_type === "angle";
  const source_type = rec._source || rec.source_type || (rec.recommendation_status === "recommended" ? "rec_engine" : rec.recommendation_status === "lean" ? "lean" : "projection");
  const sel = rec.selection || rec.label || "";
  const side = rec.side || (/\bover\b/i.test(sel) ? "over" : /\bunder\b/i.test(sel) ? "under"
    : sel.startsWith(away) ? away : sel.startsWith(home) ? home : null);
  let team = null;
  if (rec.entity) {
    const nn = normalizeName(rec.entity);
    const p = (pitchers || []).find((x) => normalizeName(x.name) === nn);
    team = p ? p.team : null;
  }
  if (!team && !isAngle) team = sel.startsWith(away) ? away : sel.startsWith(home) ? home : null;
  const opponent = team === away ? home : team === home ? away : null;
  // angle odds are FAIR odds (no book); rec.odds is the entered BOOK odds
  const bookOdds = isAngle ? null : (rec.odds != null ? rec.odds : null);
  const fairOdds = isAngle ? (rec.odds != null ? rec.odds : null) : (rec.fair_odds != null ? rec.fair_odds : null);
  const warnings = [];
  if (String(awayStarterSrc || "").includes("placeholder") || String(homeStarterSrc || "").includes("placeholder")) warnings.push("placeholder_starter_in_game");
  if (bookOdds == null && !isAngle) warnings.push("no_book_price");
  if (isAngle && rec.watch) warnings.push("watch_only_not_actionable");
  warnings.push("cap_fired_not_instrumented");
  const provenance = warnings.includes("placeholder_starter_in_game") ? "low" : (rec.entity ? "medium" : "high");
  const clusters = rec.can_confirm_clusters || [];
  const regime = clusters.some((c) => /arsenal|offense|run|bullpen|starter/i.test(c)) ? "run_value" : "matchup";
  let topPitch = null, topShare = null;
  const m = String(rec.angle || "").match(/on ([A-Za-z0-9\-. ]+?) \(([\d.]+)% usage\)/);
  if (m) { topPitch = m[1].trim(); topShare = Number(m[2]); }
  return {
    date, game_id: `${date}_${away}@${home}`, game: `${away}@${home}`,
    source_type, actionable: rec.actionable !== false,
    player_id: null, player_name: rec.entity || null, team, opponent,
    market: rec.market, line: rec.line != null ? rec.line : null, side,
    book_odds: bookOdds, fair_odds: fairOdds, book: null,
    projection: rec.projection != null ? rec.projection : null,
    probability: rec.model_probability != null ? rec.model_probability : (rec.probability != null ? rec.probability : null),
    threshold_used: rec.threshold_used != null ? rec.threshold_used : (rec.projThresh != null ? rec.projThresh : null),
    edge: rec.edge != null ? rec.edge : null,
    cap_fired: null, model_regime: regime,
    top_pitch_type: topPitch, top_pitch_share: topShare,
    provenance_grade: provenance, input_warnings: warnings,
    raw_team_total: rec.env ? rec.env.raw_team_total : null,
    adjusted_team_total: rec.env ? rec.env.adjusted_team_total : null,
    env_added_runs: rec.env ? rec.env.env_added_runs : null,
    env_share_of_edge: rec.env ? rec.env.env_share_of_edge : null,
    env_dependent: rec.env ? !!rec.env.env_dependent : null,
    model_version: MODEL_VERSION, created_at: new Date().toISOString()
  };
}

// Auto-generated matchup synthesis: reads the model's own signals (lean, arm edge, arsenal
// matchups, soft spots/exploits, K targets, sharpest prop angle) and states where the edge is.
// Pure/derivational — never re-prices; mirrors the soccer synthesis pattern.
function matchupSynthesis(model, awayTeam, homeTeam) {
  if (!model || !model.markets) return null;
  const m = model.markets;
  const A = Number(model.awayRuns || 0), H = Number(model.homeRuns || 0), total = A + H;
  const awayML = m.moneyline[0].probability, homeML = m.moneyline[1].probability;
  const fav = H >= A ? homeTeam : awayTeam, favML = Math.max(awayML, homeML);
  const margin = Math.abs(H - A);
  const aArm = model.awayArm, hArm = model.homeArm;
  const aX = Number(aArm?.xera || 4.2), hX = Number(hArm?.xera || 4.2);
  const re = model.calibration && model.calibration.runEnv;
  const lines = [];

  // 1) lean + environment
  const envNote = re && re.enabled && re.n >= 1 && Math.abs((re.factor || 1) - 1) > 0.001
    ? ` (run-env ${(re.factor - 1) >= 0 ? "+" : ""}${((re.factor - 1) * 100).toFixed(0)}%)` : "";
  const band = total >= 9.5 ? "high-scoring" : total <= 7.5 ? "pitcher-friendly" : "moderate";
  lines.push(`Model leans ${fav} by ${margin.toFixed(1)} (${(favML * 100).toFixed(0)}% ML) in a ${band} ${total.toFixed(1)}-run projection${envNote}.`);

  // 2) pitching edge
  const armGap = hX - aX; // >0 → away arm better
  if (Math.abs(armGap) >= 0.5) {
    const bN = armGap > 0 ? aArm?.name : hArm?.name, bX = armGap > 0 ? aX : hX;
    const wN = armGap > 0 ? hArm?.name : aArm?.name, wX = armGap > 0 ? hX : aX;
    lines.push(`${bN} (xERA ${bX.toFixed(2)}) holds a clear arm edge over ${wN} (xERA ${wX.toFixed(2)}).`);
  } else {
    lines.push(`${aArm?.name || awayTeam + " SP"} (${aX.toFixed(2)}) vs ${hArm?.name || homeTeam + " SP"} (${hX.toFixed(2)}) is an even pitching matchup.`);
  }

  // 3) where runs open up — arsenal edge + top soft spot
  const aEdge = Number(model.awayMatch?.mult || 1) - 1, hEdge = Number(model.homeMatch?.mult || 1) - 1;
  const runsOpen = [];
  if (aEdge >= 0.03) { const s = (model.awaySoft?.offense || [])[0]; runsOpen.push(`${awayTeam} punishes ${hArm?.name || "the arm"}'s arsenal${s ? ` (strongest on the ${s.name}, ${s.u}% usage, lineup #${s.rk})` : ""}`); }
  if (hEdge >= 0.03) { const s = (model.homeSoft?.offense || [])[0]; runsOpen.push(`${homeTeam} punishes ${aArm?.name || "the arm"}'s arsenal${s ? ` (strongest on the ${s.name}, ${s.u}% usage, lineup #${s.rk})` : ""}`); }
  if (runsOpen.length) lines.push("Where runs open up: " + runsOpen.join("; ") + ".");

  // 4) exploits + K targets (opposing arm attacks the lineup)
  const exploits = [];
  const hExp = (model.awaySoft?.pitcherEdge || [])[0]; // home arm exploits away lineup
  const aExp = (model.homeSoft?.pitcherEdge || [])[0]; // away arm exploits home lineup
  const hK = (model.awaySoft?.kTargets || [])[0];       // home arm K target among away bats
  const aK = (model.homeSoft?.kTargets || [])[0];
  if (hExp) exploits.push(`${hArm?.name || "home arm"} attacks the ${hExp.name} vs ${awayTeam} (they rank #${hExp.rk})`);
  if (aExp) exploits.push(`${aArm?.name || "away arm"} attacks the ${aExp.name} vs ${homeTeam} (#${aExp.rk})`);
  if (hK) exploits.push(`${hK.hitter} a whiff/K target (${Math.round(hK.wh * 100)}% on the ${hK.pitch})`);
  if (aK) exploits.push(`${aK.hitter} a K target (${Math.round(aK.wh * 100)}% on the ${aK.pitch})`);
  if (exploits.length) lines.push("Arm can exploit: " + exploits.slice(0, 3).join("; ") + ".");

  // 5) sharpest prop angle
  const angles = [...(model.awayPlayerAngles || []).map(a => ({ ...a, team: awayTeam })), ...(model.homePlayerAngles || []).map(a => ({ ...a, team: homeTeam }))].sort((x, y) => (y.rv || 0) - (x.rv || 0));
  if (angles[0]) lines.push(`Sharpest prop angle: ${angles[0].hitter} (${angles[0].team}) ${angles[0].type} on the ${angles[0].pitch}.`);

  // 6) verdict — the play the synthesis points to
  const strongestOff = Math.max(aEdge, hEdge);
  let verdict;
  if (armGap >= 0.6 && favML >= 0.56) verdict = `${fav} run line, lean the under if the arm holds`;
  else if (strongestOff >= 0.05) verdict = `${aEdge > hEdge ? awayTeam : homeTeam} team total over`;
  else if (favML >= 0.60) verdict = `${fav} moneyline`;
  else if (angles[0]) verdict = `${angles[0].hitter} ${angles[0].type} prop`;
  else verdict = "no standout edge — pass or size down";
  return { lines, verdict };
}

// One source of truth for every recommendation surface (game markets + player props).
function buildLiveRecommendations(model, marketOdds, o) {
  const recs = [];
  const ctx = model.context || { away: {}, home: {} };
  const mk = model.markets;
  const num = (k) => { const b = marketOdds[k]; return (b === undefined || b === "" || isNaN(Number(b))) ? null : Number(b); };
  const impliedProb = (a) => (a > 0 ? 100 / (a + 100) : -a / (-a + 100));
  const bookTt = o.bookTeamTotalLines || {};
  const bookTtGameKey = `${o.awayTeam}@${o.homeTeam}`;
  const hasBookTeamTotalLine = (side) => bookTt.gameKey === bookTtGameKey && bookTt[side] != null;

  const push = ({ market, selection, line, key, prob, projEdge, projThresh, clusters, contradict = false, pos = [], neg = [], projection = "", angle = "", entity = "", env = null, side = null }) => {
    const book = num(key);
    const edge = book != null ? evPer100(prob, book) : null;
    const nC = clusters.length;
    const failed = [];
    if (nC < 2) failed.push("needs \u22652 core clusters");
    if (projEdge < projThresh) failed.push("projection gap below threshold");
    if (contradict) failed.push("context contradicts");
    if (book == null) failed.push("no book price");
    else if (edge != null && edge <= 0) failed.push("no edge at price");
    let grp;
    if (projEdge < projThresh) grp = "D";
    else if (nC < 2 || contradict) grp = "C";
    else if (book != null && edge > 0) grp = "A";
    else grp = "B";
    const strongLean = grp === "B" && nC >= 3 && projEdge >= projThresh * 1.5;
    const confidence = grp === "A" ? (nC >= 3 ? "A" : "B") : grp === "B" ? (strongLean ? "Strong lean" : "Lean") : grp === "C" ? "Edge" : "Pass";
    const units = grp === "A" && book != null ? kellyUnits(prob, book) : 0;
    const status = grp === "A" ? "recommended" : grp === "B" ? "lean" : grp === "C" ? "blocked" : "pass";
    recs.push({
      market, selection, line, odds: book, projection, model_probability: prob,
      fair_odds: americanOdds(prob), edge, proj_edge: projEdge, confidence,
      suggested_units: units, play_to_price: americanOdds(prob),
      can_confirm_clusters: clusters, failed_gates: failed,
      top_positive_factors: pos, top_negative_factors: neg, source: "live_engine", group: grp, angle,
      entity, side, recommendation_status: status,
      is_user_visible: status === "recommended" || status === "lean",
      env,
      blocked_reason: status === "blocked" || status === "pass" ? failed.join("; ") : ""
    });
  };

  // ---- core skill clusters only (modifiers / park / weather / BA diffs cannot confirm) ----
  const overC = (s) => { const c = [], x = ctx[s] || {};
    if (x.arsenalEdge > 0.02) c.push("arsenal edge");
    if (x.softSpots >= 1) c.push("lineup soft spots");
    if (x.offenseRate > 0.03) c.push("offense rate");
    if (x.oppStarterWeak > 0.03) c.push("opp starter weak");
    if (x.oppBullpenWeak > 0.03) c.push("opp bullpen weak");
    return c; };
  const underC = (s) => { const c = [], x = ctx[s] || {};
    if (x.arsenalEdge < -0.02) c.push("arsenal disadvantage");
    if (x.offenseRate < -0.03) c.push("weak offense");
    if (x.oppStarterWeak < -0.03) c.push("strong opp starter");
    if (x.oppBullpenWeak < -0.03) c.push("strong opp bullpen");
    return c; };
  const mlC = (s) => { const c = [], x = ctx[s] || {};
    if (x.arsenalEdge > 0.02 || x.offenseRate > 0.03) c.push("offense edge");
    if (x.starterQuality > 0.03) c.push("starter quality");
    if (x.oppStarterWeak > 0.03) c.push("opp starter weak");
    if (x.oppBullpenWeak > 0.03) c.push("opp bullpen weak");
    return c; };
  const pf = (s) => { const x = ctx[s] || {}, f = [];
    if (x.arsenalEdge > 0.02) f.push("arsenal +" + (x.arsenalEdge * 100).toFixed(0) + "%");
    if (x.offenseRate > 0.03) f.push("offense +" + (x.offenseRate * 100).toFixed(0) + "%");
    if (x.oppStarterWeak > 0.03) f.push("opp SP weak");
    if (x.softSpots >= 1) f.push(x.softSpots + " soft spot");
    return f.slice(0, 3); };
  const nf = (s) => { const x = ctx[s] || {}, f = [];
    if (x.arsenalEdge < -0.02) f.push("arsenal -");
    if (x.offenseRate < -0.03) f.push("weak offense");
    if (x.oppStarterWeak < -0.03) f.push("strong opp SP");
    return f.slice(0, 3); };

  const projTotal = model.awayRuns + model.homeRuns;
  const tl = Number(o.totalLine);

  [["away", mk.moneyline[0]], ["home", mk.moneyline[1]]].forEach(([s, m]) => {
    push({ market: "Moneyline", selection: m.label, line: "ML", key: m.key, prob: m.probability,
      projEdge: (m.probability - 0.5) * 100, projThresh: 3, clusters: mlC(s),
      projection: `${(s === "away" ? model.awayRuns : model.homeRuns).toFixed(2)} R proj`, pos: pf(s), neg: nf(s) });
  });
  mk.runline.forEach((m) => {
    const s = m.key === "homeRunline" ? "home" : "away";
    push({ market: "Run line", selection: m.label, line: "\u00B11.5", key: m.key, prob: m.probability,
      projEdge: (m.probability - 0.5) * 100, projThresh: 3, clusters: mlC(s),
      projection: `${(model.homeRuns - model.awayRuns).toFixed(2)} margin`, pos: pf(s), neg: nf(s) });
  });
  {
    const over = projTotal > tl;
    const m = over ? mk.totals[0] : mk.totals[1];
    const clusters = [...new Set([...(over ? overC("away") : underC("away")), ...(over ? overC("home") : underC("home"))])];
    push({ market: "Total", selection: m.label, line: tl, key: m.key, prob: m.probability,
      projEdge: over ? projTotal - tl : tl - projTotal, projThresh: 0.4, clusters, projection: `${projTotal.toFixed(2)} proj total`,
      pos: [...pf("away"), ...pf("home")].slice(0, 3), neg: [...nf("away"), ...nf("home")].slice(0, 3) });
  }
  [["away", mk.teamTotals[0], model.awayRunsTT != null ? model.awayRunsTT : model.awayRuns], ["home", mk.teamTotals[1], model.homeRunsTT != null ? model.homeRunsTT : model.homeRuns]].forEach(([s, m, proj]) => {
    if (o.requireApiTeamTotals && !hasBookTeamTotalLine(s)) return;
    const line = Number(m.line ?? (s === "away" ? derivedTeamTotalLines(tl).away : derivedTeamTotalLines(tl).home));
    const over = proj > line;
    push({ market: "Team total", selection: `${o[s + "Team"]} ${over ? "Over" : "Under"} ${formatLine(line)}`,
      line, key: over ? m.key : `${m.key}U`, prob: over ? m.probability : 1 - m.probability, projEdge: over ? proj - line : line - proj, projThresh: 0.25,
      clusters: over ? overC(s) : underC(s), projection: `${proj.toFixed(2)} R proj`, pos: over ? pf(s) : [], neg: over ? [] : nf(s), env: m.env });
  });
  {
    const f5Tot = model.f5Away + model.f5Home;
    const f5over = f5Tot > 4.5;
    const fT = model.f5Rows.find((m) => m.key === (f5over ? "f5Over" : "f5Under"));
    if (fT) push({ market: "First 5", selection: fT.label, line: 4.5, key: fT.key, prob: fT.probability,
      projEdge: f5over ? f5Tot - 4.5 : 4.5 - f5Tot, projThresh: 0.4,
      clusters: [...new Set([...(f5over ? overC("away") : underC("away")), ...(f5over ? overC("home") : underC("home"))])],
      projection: `${f5Tot.toFixed(2)} F5 proj` });
    const aML = model.f5Rows.find((m) => m.key === "f5AwayML"), hML = model.f5Rows.find((m) => m.key === "f5HomeML");
    if (aML && hML) {
      const homeFav = hML.probability >= aML.probability;
      const fm = homeFav ? hML : aML, fs = homeFav ? "home" : "away";
      push({ market: "First 5", selection: fm.label, line: "ML", key: fm.key, prob: fm.probability,
        projEdge: (fm.probability - 0.5) * 100, projThresh: 3, clusters: mlC(fs), projection: `F5 ML ${(fm.probability * 100).toFixed(0)}%` });
    }
  }
  [["away", model.pitcherWin[0], model.expIPAway], ["home", model.pitcherWin[1], model.expIPHome]].forEach(([s, m, ip]) => {
    if (!m || m.suppressed) return;   // bullpen game / placeholder: no starter can win
    const x = ctx[s] || {}, c = [];
    if (x.starterQuality > 0.03) c.push("starter quality");
    if (ip >= 5.2) c.push("workload to qualify");
    if (x.oppStarterWeak > 0.02 || x.offenseRate > 0.03) c.push("run support");
    push({ market: "Pitcher win", selection: m.label, line: "Yes", key: m.key, prob: m.probability,
      projEdge: (m.probability - 0.5) * 100, projThresh: 3, clusters: c,
      projection: `${ip.toFixed(1)} IP proj`, angle: `${m.label}: ${(m.probability * 100).toFixed(0)}% to go 5+ with the lead held` });
  });
  [["away", model.awayArm, model.projKAway, o.kLineAway, "kAway", "home", model.kExpIPAway ?? model.expIPAway],
   ["home", model.homeArm, model.projKHome, o.kLineHome, "kHome", "away", model.kExpIPHome ?? model.expIPHome]].forEach(([s, arm, projK, line, key, oppS, ip]) => {
    // DATA GATE: placeholder / bullpen-game / unknown arms carry no usable K rate. A missing
    // rate is NOT a zero — pricing projK=0 produced a 100% "Under" lock (-99900). Suppress the
    // strikeout market entirely rather than emit a fabricated certainty in either direction.
    if (!hasRealKRate(arm)) return;
    const prob = kOverProb(projK, Number(line));
    const x = ctx[s] || {}, opp = ctx[oppS] || {}, c = [];
    if (x.kRate >= 0.22) c.push("pitcher K rate");
    if (ip >= 5.2) c.push("workload/volume");
    if ((opp.arsenalEdge || 0) < -0.02) c.push("lineup whiffs vs arsenal");
    push({ market: "Strikeout prop", selection: `${arm?.name || "SP"} Over ${Number(line).toFixed(1)} K`, line: Number(line),
      key, prob, projEdge: projK - Number(line), projThresh: 0.5, clusters: c, projection: `${projK.toFixed(1)} K proj`,
      entity: arm?.name || null,
      angle: `${arm?.name || "SP"} projects ${projK.toFixed(1)} K vs a ${Number(line).toFixed(1)} line` });
  });
  const batterRows = (list, s, oppArm, dmg) => (list || []).forEach((a) => {
    // DAMAGE PRESSURE applies to the hitter's DAMAGE RATES, not as a blind probability boost.
    // xERA is NOT used as a damage-allowed proxy (forbidden: it is already the run-prevention
    // term in expectedRuns). Real barrel/hard-hit/HR-FB/SLG/xSLG-allowed drive `dmg`.
    const D = dmg || { hr: 1, tb: 1, hits: 1, allowed: null, pressure: 0 };
    const ba = clamp(Number(a.ba || 0) * D.hits, 0, 0.6);
    const slg = clamp(Number(a.slg || 0) * D.tb, 0, 1.2);
    const brl = clamp(Number(a.brl || 0) * D.hr, 0, 0.35);
    const pa = 4.1;
    const oppLowK = (Number(oppArm?.k || 22) / 100) < 0.20;
    const armName = oppArm?.name || "SP";
    const nudge = 1;                                   // retired: was 1 + 0.5*(xera/rpg - 1)
    const dmgAllowed = D.allowed;
    const matchTxt = D.pressure > 0.15 ? "favors damage" : D.pressure < -0.15 ? "tough matchup" : "neutral matchup";
    const defs = [];
    if (a.type.includes("Hits")) {                          // research: contact/BA + pitcher contact allowed
      const c = [];
      if (ba >= 0.27) c.push("contact skill");
      if ((dmgAllowed != null && dmgAllowed > 0.4) || oppLowK) c.push("pitcher hittable");
      if (a.u >= 18) c.push("sees this pitch often");
      defs.push({ mkt: "Batter hits", sel: `${a.hitter} Over 0.5 hits`, line: 0.5, key: `bh_${s}_${a.hitter}`,
        prob: clamp((1 - Math.pow(1 - clamp(ba, 0.05, 0.45), pa)) * nudge, 0.05, 0.95), c, typ: 0.62, thr: 2 });
    }
    if (a.type.includes("HR")) {                            // research: barrel/power + pitcher HR/damage vuln
      const c = [];
      if (brl >= 0.09 || slg >= 0.50) c.push("HR power");
      if (brl >= 0.11) c.push("elite barrel");
      if (dmgAllowed != null && dmgAllowed > 0.4) c.push("staff allows barrels/hard contact");
      defs.push({ mkt: "Batter HR", sel: `${a.hitter} HR`, line: 0.5, key: `bhr_${s}_${a.hitter}`, side: "over",
        prob: clamp((1 - Math.pow(1 - clamp(brl * 0.20, 0.003, 0.07), pa)) * nudge, 0.02, 0.28), c, typ: 0.14, thr: 1.5 });
    }
    if (a.type.includes("bases")) {                         // research: xSLG/SLG damage + pitcher damage allowed
      const c = [];
      if (slg >= 0.47 || brl >= 0.08) c.push("damage profile");
      if (brl >= 0.10) c.push("elite barrel");
      if (dmgAllowed != null && dmgAllowed > 0.4) c.push("staff allows barrels/hard contact");
      defs.push({ mkt: "Batter TB", sel: `${a.hitter} Over 1.5 TB`, line: 1.5, key: `btb_${s}_${a.hitter}`,
        prob: clamp((1 - Math.pow(1 - clamp(slg / 4, 0.05, 0.4), pa) - 0.12) * nudge, 0.05, 0.8), c, typ: 0.45, thr: 2 });
    }
    defs.forEach((d) => {
      push({ market: d.mkt, selection: d.sel, line: d.line, key: d.key, prob: d.prob, side: d.side || null,
        projEdge: (d.prob - d.typ) * 100, projThresh: d.thr, clusters: d.c, entity: a.hitter,
        projection: `est P=${(d.prob * 100).toFixed(0)}% vs ~${(d.typ * 100).toFixed(0)}% typ`,
        angle: `${a.hitter} vs ${armName} on ${a.pitch} (${a.u}% usage); ${matchTxt} \u2014 estimate, not a priced projection` });
    });
  });
  batterRows(model.awayPlayerAngles, "away", model.homeArm, model.awayDamage);
  batterRows(model.homePlayerAngles, "home", model.awayArm, model.homeDamage);

  const groups = { A: [], B: [], C: [], D: [] };
  recs.forEach((r) => groups[r.group].push(r));
  const sortFn = (a, b) => (b.edge ?? -1e9) - (a.edge ?? -1e9) || Math.abs(b.proj_edge) - Math.abs(a.proj_edge);
  Object.values(groups).forEach((g) => g.sort(sortFn));
  const debug = {
    recommendation_source: model.markets ? "live_engine" : "none",
    number_of_live_markets: recs.length,
    number_of_user_visible: groups.A.length + groups.B.length,
    number_of_live_recommendations: groups.A.length,
    number_of_leans: groups.B.length,
    number_of_blocked_edges: groups.C.length,
    number_of_passes: groups.D.length,
    number_of_static_recommendations: 0,
    calibration_total_bias: Number(model.calibration.totalBias.toFixed(3)),
    calibration_side_bias: model.calibration.sideBiasApplied,
    calibration_games_logged: model.calibration.gamesLogged,
    timestamp_generated: new Date().toISOString()
  };
  return { all: recs, groups, debug };
}

// ---- offline player-prop pipeline ingestion (source of truth when present) ----
function parsePropCSV(text) {
  const rows = []; let field = "", row = [], inq = false;
  for (let i = 0; i < text.length; i += 1) {
    const c = text[i];
    if (inq) { if (c === '"') { if (text[i + 1] === '"') { field += '"'; i += 1; } else inq = false; } else field += c; }
    else if (c === '"') inq = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
    else if (c !== "\r") field += c;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  const head = rows.shift() || [];
  return rows.filter((r) => r.length > 1).map((r) => Object.fromEntries(head.map((h, j) => [h, r[j]])));
}
const PROP_MARKET_LABEL = { pitcher_strikeouts: "Strikeout prop", pitcher_win: "Pitcher win",
  batter_hits: "Batter hits", batter_total_bases: "Batter TB", batter_home_runs: "Batter HR" };
const PROP_GROUP = { recommended: "A", lean: "B", blocked: "C", pass: "D" };
function offlinePropSelection(m, p, line) {
  if (m === "pitcher_strikeouts") return `${p} Over ${line} K`;
  if (m === "pitcher_win") return `${p} Win`;
  if (m === "batter_hits") return `${p} Over 0.5 hits`;
  if (m === "batter_total_bases") return `${p} Over 1.5 TB`;
  return `${p} HR`;
}
function mapOfflineProps(text) {
  const num = (v) => (v === "" || v == null || isNaN(Number(v)) ? null : Number(v));
  return parsePropCSV(text).map((r) => ({
    selection: offlinePropSelection(r.market, r.player, r.line),
    market: PROP_MARKET_LABEL[r.market] || r.market, line: r.line, odds: num(r.odds),
    model_probability: num(r.model_probability), fair_odds: num(r.fair_odds), edge: num(r.edge),
    confidence: r.confidence, suggested_units: num(r.suggested_units) || 0, play_to_price: num(r.play_to_price),
    can_confirm_clusters: r.core_clusters_confirming ? r.core_clusters_confirming.split("|").filter(Boolean) : [],
    failed_gates: r.failed_gates ? r.failed_gates.split("|").filter(Boolean) : [],
    top_positive_factors: r.top_positive_factors ? r.top_positive_factors.split("|").filter(Boolean) : [],
    recommendation_status: r.recommendation_status, is_user_visible: r.is_user_visible === "True" || r.is_user_visible === true,
    group: PROP_GROUP[r.recommendation_status] || "D", angle: r.artifact_angle_text || "",
    entity: r.player, proj_edge: 0, source: r.source || "offline_pipeline", _date: r.game_date,
    team_context_joined: r.team_context_joined === "True" || r.team_context_joined === true,
    tc_win_prob: r.team_win_probability, tc_run_diff: r.projected_run_diff, tc_run_env: r.run_environment,
  })).filter((r) => r.market);
}

export default function DiamondModel() {
  const [data, setData] = useState(DEFAULT_DATA);
  const [loadState, setLoadState] = useState("Savant pitcher tables · " + DEFAULT_DATA.date);
  const [selectedGameIndex, setSelectedGameIndex] = useState(0);
  const [awayTeam, setAwayTeam] = useState(DEFAULT_DATA.games[0].away);
  const [homeTeam, setHomeTeam] = useState(DEFAULT_DATA.games[0].home);
  const [awayPitcher, setAwayPitcher] = useState(DEFAULT_DATA.pitchers.find((p) => normalizeName(p.name) === normalizeName(DEFAULT_DATA.games[0].awayStarter))?.name || DEFAULT_DATA.pitchers.find((p) => p.team === DEFAULT_DATA.games[0].away)?.name || "");
  const [homePitcher, setHomePitcher] = useState(DEFAULT_DATA.pitchers.find((p) => normalizeName(p.name) === normalizeName(DEFAULT_DATA.games[0].homeStarter))?.name || DEFAULT_DATA.pitchers.find((p) => p.team === DEFAULT_DATA.games[0].home)?.name || "");
  const [awayBullpen, setAwayBullpen] = useState("normal");
  const [homeBullpen, setHomeBullpen] = useState("normal");
  const dispersion = 4;
  const [totalLine, setTotalLine] = useState(8.5);
  const [homeSpread, setHomeSpread] = useState(-1.5);
  const [poolText, setPoolText] = useState("");
  const [importMessage, setImportMessage] = useState("");
  const [oddsKey, setOddsKey] = useState(PRELOADED_ODDS_API_KEY);
  const [bookTeamTotalLines, setBookTeamTotalLines] = useState({ gameKey: "", away: null, home: null });
  const [marketOdds, setMarketOdds] = useState({});
  const setOdd = (key, value) => setMarketOdds((prev) => ({ ...prev, [key]: value }));
  const [kLineAway, setKLineAway] = useState(5.5);
  const [kLineHome, setKLineHome] = useState(5.5);
  const [kWorkloadMode, setKWorkloadMode] = useState("baseline");
  const [oddsMessage, setOddsMessage] = useState("");
  const [modelDaily, setModelDaily] = useState(null);
  const [offlineProps, setOfflineProps] = useState(null);

  useEffect(() => {
    fetch("./daily_player_angle_output.csv", { cache: "no-store" })
      .then((r) => (r.ok ? r.text() : null))
      .then((t) => { if (t) { const recs = mapOfflineProps(t); if (recs.length) setOfflineProps({ recs, count: recs.length, date: recs[0]?._date, synthetic: recs.some((r) => r.source === "synthetic_dev") }); } })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch("./model_daily.json", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((m) => m && setModelDaily(m))
      .catch(() => {});
  }, []);

  const [results, setResults] = useState([{"night": "2026-07-05", "away": "NYM", "home": "ATL", "projAway": 4.21, "projHome": 3.92, "projWinHome": 0.47, "actualAway": 10, "actualHome": 9}, {"night": "2026-07-05", "away": "PIT", "home": "WSH", "projAway": 4.61, "projHome": 4.32, "projWinHome": 0.47, "actualAway": 11, "actualHome": 5}, {"night": "2026-07-05", "away": "BAL", "home": "CIN", "projAway": 5.8, "projHome": 4.36, "projWinHome": 0.39, "actualAway": 2, "actualHome": 3}, {"night": "2026-07-05", "away": "MIN", "home": "NYY", "projAway": 4.21, "projHome": 4.14, "projWinHome": 0.49, "actualAway": 6, "actualHome": 1}, {"night": "2026-07-05", "away": "CWS", "home": "CLE", "projAway": 4.51, "projHome": 3.93, "projWinHome": 0.45, "actualAway": 7, "actualHome": 6}, {"night": "2026-07-05", "away": "STL", "home": "CHC", "projAway": 5.03, "projHome": 5.49, "projWinHome": 0.53, "actualAway": 4, "actualHome": 6}, {"night": "2026-07-05", "away": "PHI", "home": "KC", "projAway": 4.41, "projHome": 4.15, "projWinHome": 0.48, "actualAway": 2, "actualHome": 5}, {"night": "2026-07-05", "away": "TB", "home": "HOU", "projAway": 3.88, "projHome": 4.53, "projWinHome": 0.56, "actualAway": 0, "actualHome": 2}, {"night": "2026-07-05", "away": "DET", "home": "TEX", "projAway": 4.74, "projHome": 3.58, "projWinHome": 0.39, "actualAway": 6, "actualHome": 3}, {"night": "2026-07-05", "away": "SF", "home": "COL", "projAway": 5.04, "projHome": 4.95, "projWinHome": 0.49, "actualAway": 6, "actualHome": 7}, {"night": "2026-07-05", "away": "MIL", "home": "AZ", "projAway": 4.87, "projHome": 4.28, "projWinHome": 0.45, "actualAway": 3, "actualHome": 2}, {"night": "2026-07-05", "away": "MIA", "home": "ATH", "projAway": 3.32, "projHome": 4.46, "projWinHome": 0.61, "actualAway": 9, "actualHome": 8}, {"night": "2026-07-05", "away": "TOR", "home": "SEA", "projAway": 3.96, "projHome": 3.41, "projWinHome": 0.44, "actualAway": 0, "actualHome": 4}, {"night": "2026-07-05", "away": "SD", "home": "LAD", "projAway": 3.89, "projHome": 5.28, "projWinHome": 0.62, "actualAway": 5, "actualHome": 2}, {"night": "2026-07-05", "away": "BOS", "home": "LAA", "projAway": 4.49, "projHome": 3.54, "projWinHome": 0.41, "actualAway": 7, "actualHome": 5}, {"night": "2026-07-06", "away": "PHI", "home": "KC", "projAway": 4.68, "projHome": 3.5, "projWinHome": 0.39, "actualAway": 1, "actualHome": 15}, {"night": "2026-07-06", "away": "NYY", "home": "TB", "projAway": 5.17, "projHome": 3.02, "projWinHome": 0.31, "actualAway": 5, "actualHome": 1}, {"night": "2026-07-06", "away": "HOU", "home": "WSH", "projAway": 4.73, "projHome": 4.49, "projWinHome": 0.48, "actualAway": 11, "actualHome": 12}, {"night": "2026-07-06", "away": "NYM", "home": "ATL", "projAway": 4.73, "projHome": 4.13, "projWinHome": 0.45, "actualAway": 7, "actualHome": 6}, {"night": "2026-07-06", "away": "MIL", "home": "STL", "projAway": 4.44, "projHome": 3.7, "projWinHome": 0.43, "actualAway": 4, "actualHome": 3}, {"night": "2026-07-06", "away": "AZ", "home": "SD", "projAway": 4.44, "projHome": 4.69, "projWinHome": 0.52, "actualAway": 8, "actualHome": 0}, {"night": "2026-07-06", "away": "TOR", "home": "SF", "projAway": 3.4, "projHome": 4.06, "projWinHome": 0.56, "actualAway": 1, "actualHome": 10}, {"night": "2026-07-06", "away": "COL", "home": "LAD", "projAway": 4.78, "projHome": 6.63, "projWinHome": 0.63, "actualAway": 7, "actualHome": 8}, {"night": "2026-07-07", "away": "MIL", "home": "STL", "projAway": 4.65, "projHome": 2.78, "projWinHome": 0.32, "actualAway": 4, "actualHome": 3}, {"night": "2026-07-07", "away": "MIL", "home": "STL", "projAway": 4.65, "projHome": 4.23, "projWinHome": 0.46, "actualAway": 10, "actualHome": 2}, {"night": "2026-07-07", "away": "CHC", "home": "BAL", "projAway": 4.82, "projHome": 4.79, "projWinHome": 0.5, "actualAway": 5, "actualHome": 2}, {"night": "2026-07-07", "away": "ATH", "home": "DET", "projAway": 3.86, "projHome": 4.23, "projWinHome": 0.54, "actualAway": 2, "actualHome": 6}, {"night": "2026-07-07", "away": "SEA", "home": "MIA", "projAway": 3.95, "projHome": 3.97, "projWinHome": 0.5, "actualAway": 5, "actualHome": 6}, {"night": "2026-07-07", "away": "ATL", "home": "PIT", "projAway": 3.37, "projHome": 4.37, "projWinHome": 0.6, "actualAway": 4, "actualHome": 12}, {"night": "2026-07-07", "away": "NYY", "home": "TB", "projAway": 4.15, "projHome": 3.98, "projWinHome": 0.48, "actualAway": 4, "actualHome": 6}, {"night": "2026-07-07", "away": "HOU", "home": "WSH", "projAway": 4.43, "projHome": 4.39, "projWinHome": 0.5, "actualAway": 6, "actualHome": 3}, {"night": "2026-07-07", "away": "PHI", "home": "CIN", "projAway": 5.23, "projHome": 4.4, "projWinHome": 0.43, "actualAway": 4, "actualHome": 1}, {"night": "2026-07-07", "away": "KC", "home": "NYM", "projAway": 4.25, "projHome": 4.98, "projWinHome": 0.56, "actualAway": 16, "actualHome": 12}, {"night": "2026-07-07", "away": "CLE", "home": "MIN", "projAway": 3.91, "projHome": 4.16, "projWinHome": 0.52, "actualAway": 1, "actualHome": 3}, {"night": "2026-07-07", "away": "BOS", "home": "CWS", "projAway": 4.48, "projHome": 3.4, "projWinHome": 0.4, "actualAway": 8, "actualHome": 1}, {"night": "2026-07-07", "away": "LAA", "home": "TEX", "projAway": 3.92, "projHome": 4.43, "projWinHome": 0.55, "actualAway": 3, "actualHome": 8}, {"night": "2026-07-07", "away": "AZ", "home": "SD", "projAway": 4.95, "projHome": 4.94, "projWinHome": 0.5, "actualAway": 1, "actualHome": 4}, {"night": "2026-07-07", "away": "TOR", "home": "SF", "projAway": 3.95, "projHome": 4.01, "projWinHome": 0.51, "actualAway": 9, "actualHome": 3}, {"night": "2026-07-07", "away": "COL", "home": "LAD", "projAway": 4.37, "projHome": 6.38, "projWinHome": 0.64, "actualAway": 4, "actualHome": 3}]);
  const [actualAway, setActualAway] = useState("");
  const [actualHome, setActualHome] = useState("");
  const [altTotal, setAltTotal] = useState(8.5);
  const [altRL, setAltRL] = useState(1.5);
  const [altRLflip, setAltRLflip] = useState(false);
  const [manualCalib, setManualCalib] = useState({ enabled: false, totalBias: 0, homeBias: 0, awayBias: 0, notes: "" });
  const [runEnvOn, setRunEnvOn] = useState(true);
  const [pickStore, setPickStore] = useState({});
  const [exportAllProj, setExportAllProj] = useState(true);
  const [exportJson, setExportJson] = useState("");
  const [exportCopied, setExportCopied] = useState("");
  const [exportDate, setExportDate] = useState("");
  const [showBlocked, setShowBlocked] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        if (typeof window !== "undefined" && window.storage) {
          const r = await window.storage.get("ccresults:v1");
          if (r && r.value) setResults(JSON.parse(r.value));
        }
      } catch (e) { /* no persistent storage on this host */ }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        if (typeof window !== "undefined" && window.storage && results.length) {
          await window.storage.set("ccresults:v1", JSON.stringify(results));
        }
      } catch (e) { /* ignore */ }
    })();
  }, [results]);

  // results feed back into the model: learned total + margin bias (shrunk + clamped) and win calibration
  const calib = useMemo(() => {
    const n = results.length;
    if (!n) return { totalBias: 0, marginBias: 0, rawTotal: 0, rawMargin: 0, n: 0, winPred: 0, winAct: 0 };
    const tErr = results.reduce((s, r) => s + ((r.actualAway + r.actualHome) - (r.projAway + r.projHome)), 0) / n;
    const mErr = results.reduce((s, r) => s + ((r.actualHome - r.actualAway) - (r.projHome - r.projAway)), 0) / n;
    const shrink = n / (n + 5);
    const winPred = results.reduce((s, r) => s + (r.projWinHome || 0), 0) / n;
    const winAct = results.reduce((s, r) => s + (r.actualHome > r.actualAway ? 1 : 0), 0) / n;
    return {
      totalBias: clamp(tErr * shrink, -2, 2),
      marginBias: clamp(mErr * shrink, -1.5, 1.5),
      rawTotal: tErr, rawMargin: mErr, n, winPred, winAct
    };
  }, [results]);

  // effective calibration: manual dev override takes precedence over learned bias
  const effCalib = useMemo(() => {
    if (manualCalib.enabled) {
      return {
        source: "manual_override", manualOverrideActive: true,
        totalBias: Number(manualCalib.totalBias) || 0,
        homeBias: Number(manualCalib.homeBias) || 0,
        awayBias: Number(manualCalib.awayBias) || 0,
        n: calib.n, notes: manualCalib.notes || "", learnedTotalBias: calib.totalBias
      };
    }
    return {
      source: calib.n ? "learned" : "none", manualOverrideActive: false,
      totalBias: calib.totalBias, homeBias: calib.marginBias / 2, awayBias: -calib.marginBias / 2,
      n: calib.n, notes: "", learnedTotalBias: calib.totalBias
    };
  }, [manualCalib, calib]);

  // TEMP RUN ENVIRONMENT ADJUSTMENT: rolling weighted bias from the last 3 logged nights.
  // Per-night bias = mean(actual total - projected total), EXCLUDING Coors (home COL) and
  // extreme blowouts (|margin| >= 10) so a hot broad slate — not outliers — drives the bump.
  // Weights 0.50 / 0.30 / 0.20 (most-recent-first), renormalized when fewer than 3 nights exist.
  const runEnv = useMemo(() => {
    const byNight = {};
    for (const r of results) { const k = r.night || "unknown"; (byNight[k] = byNight[k] || []).push(r); }
    const perNight = Object.keys(byNight).sort().map((night) => {
      const all = byNight[night];
      const clean = all.filter((r) => r.home !== "COL" && Math.abs(r.actualHome - r.actualAway) < 10);
      const bias = clean.length ? clean.reduce((s, r) => s + ((r.actualAway + r.actualHome) - (r.projAway + r.projHome)), 0) / clean.length : null;
      return { night, bias, nClean: clean.length, nAll: all.length, excluded: all.length - clean.length };
    }).filter((x) => x.bias != null);
    const last3 = perNight.slice(-3);
    const baseW = [0.2, 0.3, 0.5];
    const ws = baseW.slice(3 - last3.length);
    const wsum = ws.reduce((a, b) => a + b, 0) || 1;
    const weightedBias = last3.reduce((s, x, i) => s + (ws[i] / wsum) * x.bias, 0);
    const cleanN = last3.reduce((s, x) => s + x.nClean, 0);
    const lowSample = cleanN < 12;
    const cap = lowSample ? 0.04 : 0.08;
    return { enabled: runEnvOn, weightedBias, nights: last3, n: last3.length, cleanN, lowSample, cap };
  }, [results, runEnvOn]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    let mv = document.querySelector('meta[name="viewport"]');
    if (!mv) { mv = document.createElement("meta"); mv.setAttribute("name", "viewport"); document.head.appendChild(mv); }
    mv.setAttribute("content", "width=device-width, initial-scale=1, viewport-fit=cover");
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("./diamond_data.json", { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then((nextData) => {
        if (cancelled) return;
        setData(nextData);
        const label = nextData.source?.includes("savant-pitcher-tables") ? `Savant pitcher tables · ${nextData.generated}` : (nextData.source === "live-data" ? `Live data · ${nextData.generated}` : "Embedded snapshot");
        setLoadState(label);
        applyGame(nextData.games?.[0], nextData);
      })
      .catch(() => {
        if (!cancelled) setLoadState("Savant pitcher tables · " + DEFAULT_DATA.date);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const teams = data.teams?.length ? data.teams : DEFAULT_DATA.teams;
  const pitchers = data.pitchers?.length ? data.pitchers : DEFAULT_DATA.pitchers;
  const games = data.games?.length ? data.games : DEFAULT_DATA.games;
  const leagueRpg = Number(data.league?.rpg || 4.4);
  const leagueEra = Number(data.league?.era || 4.15);
  const leagueRV = data.leagueRV || DEFAULT_DATA.leagueRV || {};
  const crush = data.crush || DEFAULT_DATA.crush || {};
  const pitchRef = data.pitchRef || DEFAULT_DATA.pitchRef || {};
  const selectedGame = games[selectedGameIndex] || games[0];

  const firstArm = (teamAbbr, pool = pitchers) => {
    const arms = pool.filter((p) => p.team === teamAbbr).sort((a, b) => Number(b.ip || 0) - Number(a.ip || 0));
    return arms[0]?.name || pool[0]?.name || "";
  };
  function applyGame(game, sourceData = data) {
    if (!game) return;
    const pool = sourceData.pitchers?.length ? sourceData.pitchers : DEFAULT_DATA.pitchers;
    setBookTeamTotalLines({ gameKey: "", away: null, home: null });
    setAwayTeam(game.away);
    setHomeTeam(game.home);
    const aMatch = game.awayStarter ? pool.find((p) => normalizeName(p.name) === normalizeName(game.awayStarter)) : null;
    const hMatch = game.homeStarter ? pool.find((p) => normalizeName(p.name) === normalizeName(game.homeStarter)) : null;
    setAwayPitcher(aMatch?.name || firstArm(game.away, pool));
    setHomePitcher(hMatch?.name || firstArm(game.home, pool));
    if (["fresh", "normal", "taxed"].includes(game.awayBullpenStatus)) setAwayBullpen(game.awayBullpenStatus);
    if (["fresh", "normal", "taxed"].includes(game.homeBullpenStatus)) setHomeBullpen(game.homeBullpenStatus);
  }

  const model = useMemo(() => {
    const away = teamByAbbr(teams, awayTeam);
    const home = teamByAbbr(teams, homeTeam);
    const awayArm = neutralizeArm(pitcherByName(pitchers, awayPitcher), data.league);
    const homeArm = neutralizeArm(pitcherByName(pitchers, homePitcher), data.league);
    const park = Number(home?.park || 1);

    const awayMatch = arsenalMatchup(homeArm?.mix, away?.pitchRV, leagueRV); // away offense vs home SP arsenal
    const homeMatch = arsenalMatchup(awayArm?.mix, home?.pitchRV, leagueRV); // home offense vs away SP arsenal
    // expected workload: base IP trimmed by walks and by how hard the opposing lineup hits him
    const walkTrim = (bb) => Math.max(0, Number(bb || 8) - 8) * 0.09;
    // away arm faces the HOME lineup -> home lineup's patience sets his pitch efficiency
    // DAMAGE PRESSURE (order: pitch matchup -> chase(K rate) -> damage -> runs -> IP/BF -> hitters)
    // away offense faces the HOME arm (home staff allowed); gate = away lineup vs home arsenal
    const awayDamage = damagePressure(away, homeArm, home, awayMatch.mult, data);
    const homeDamage = damagePressure(home, awayArm, away, homeMatch.mult, data);

    // starter IP is suppressed by the OPPOSING lineup's damage pressure
    const expIPAway = clamp((Number(awayArm?.ip || 5) - walkTrim(awayArm?.bb) - (homeMatch.mult - 1) * 3.2) * patienceIpFactor(home, data.league) * homeDamage.ip, 3.3, 7.6);
    // home arm faces the AWAY lineup -> away lineup's patience sets his pitch efficiency
    const expIPHome = clamp((Number(homeArm?.ip || 5) - walkTrim(homeArm?.bb) - (awayMatch.mult - 1) * 3.2) * patienceIpFactor(away, data.league) * awayDamage.ip, 3.3, 7.6);
    const homeArmM = { ...homeArm, matchup: awayMatch.mult, ip: expIPHome };
    const awayArmM = { ...awayArm, matchup: homeMatch.mult, ip: expIPAway };
    // discipline interaction: each offense vs the arm it actually faces
    const awayDisc = disciplineMatchup(away, homeArm, data);
    const homeDisc = disciplineMatchup(home, awayArm, data);
    const awaySoft = softSpots(homeArm?.mix, away?.pitchRV, crush[awayTeam], pitchRef);
    const homeSoft = softSpots(awayArm?.mix, home?.pitchRV, crush[homeTeam], pitchRef);
    const awayPlayerAngles = playerAngles(homeArm?.mix, crush[awayTeam], pitchRef);
    const homePlayerAngles = playerAngles(awayArm?.mix, crush[homeTeam], pitchRef);

    const rawAwayRuns = expectedRuns({
      battingTeam: away,
      opposingPitcher: homeArmM,
      opposingTeam: home,
      park,
      bullpenStatus: homeBullpen,
      leagueRpg, leagueEra, disciplineMult: awayDisc.mult, damageMult: awayDamage.run
    });
    const rawHomeRuns = expectedRuns({
      battingTeam: home,
      opposingPitcher: awayArmM,
      opposingTeam: away,
      park,
      bullpenStatus: awayBullpen,
      leagueRpg, leagueEra, disciplineMult: homeDisc.mult, damageMult: homeDamage.run
    });
    // TEMP RUN ENVIRONMENT ADJUSTMENT: capped ±8% multiplier on each team lambda.
    // factor = 1 + weightedBias / rawTotal (short-term slate environment, not a baseline move).
    // Side/margin bias stays additive; run-value architecture untouched.
    // COUNTERFACTUAL for verbose reporting: same game with the discipline modifier switched off.
    const neutralAwayRuns = expectedRuns({
      battingTeam: away, opposingPitcher: homeArmM, opposingTeam: home, park,
      bullpenStatus: homeBullpen, leagueRpg, leagueEra, disciplineMult: 1, damageMult: awayDamage.run
    });
    const neutralHomeRuns = expectedRuns({
      battingTeam: home, opposingPitcher: awayArmM, opposingTeam: away, park,
      bullpenStatus: awayBullpen, leagueRpg, leagueEra, disciplineMult: 1, damageMult: homeDamage.run
    });
    // damage-off counterfactual (for the DAMAGE PRESSURE report)
    const dmgOffAwayRuns = expectedRuns({
      battingTeam: away, opposingPitcher: homeArmM, opposingTeam: home, park,
      bullpenStatus: homeBullpen, leagueRpg, leagueEra, disciplineMult: awayDisc.mult, damageMult: 1
    });
    const dmgOffHomeRuns = expectedRuns({
      battingTeam: home, opposingPitcher: awayArmM, opposingTeam: away, park,
      bullpenStatus: awayBullpen, leagueRpg, leagueEra, disciplineMult: homeDisc.mult, damageMult: 1
    });

    const _rawTotal = rawAwayRuns + rawHomeRuns;
    const _cap = runEnv.cap != null ? runEnv.cap : 0.08;
    const envFactor = runEnv.enabled && runEnv.n >= 1 ? clamp(1 + Number(runEnv.weightedBias || 0) / Math.max(_rawTotal, 1), 1 - _cap, 1 + _cap) : 1;
    const envCapped = envFactor === (1 - _cap) || envFactor === (1 + _cap);
    const awayRuns = clamp(rawAwayRuns * envFactor + Number(effCalib.awayBias || 0), 1.6, 8.2);
    const homeRuns = clamp(rawHomeRuns * envFactor + Number(effCalib.homeBias || 0), 1.6, 8.2);
    const matrix = scoreMatrix(awayRuns, homeRuns, dispersion);
    const markets = summarizeMarkets(matrix, Number(totalLine), Number(homeSpread), awayTeam, homeTeam);
    // discipline impact measured against the mult=1 counterfactual, same env/dispersion
    const _nA = clamp(neutralAwayRuns * envFactor + Number(effCalib.awayBias || 0), 1.6, 8.2);
    const _nH = clamp(neutralHomeRuns * envFactor + Number(effCalib.homeBias || 0), 1.6, 8.2);
    const _nMarkets = summarizeMarkets(scoreMatrix(_nA, _nH, dispersion), Number(totalLine), Number(homeSpread), awayTeam, homeTeam);
    // damage before/after: recompute IP, BF, projK and markets with damage OFF
    const _eA0 = clamp((Number(awayArm?.ip || 5) - walkTrim(awayArm?.bb) - (homeMatch.mult - 1) * 3.2) * patienceIpFactor(home, data.league), 3.3, 7.6);
    const _eH0 = clamp((Number(homeArm?.ip || 5) - walkTrim(homeArm?.bb) - (awayMatch.mult - 1) * 3.2) * patienceIpFactor(away, data.league), 3.3, 7.6);
    const _dA = clamp(dmgOffAwayRuns * envFactor + Number(effCalib.awayBias || 0), 1.6, 8.2);
    const _dH = clamp(dmgOffHomeRuns * envFactor + Number(effCalib.homeBias || 0), 1.6, 8.2);
    const _dMarkets = summarizeMarkets(scoreMatrix(_dA, _dH, dispersion), Number(totalLine), Number(homeSpread), awayTeam, homeTeam);
    const disciplineReport = {
      away: awayDisc, home: homeDisc,
      awayRunsNeutral: neutralAwayRuns, homeRunsNeutral: neutralHomeRuns,
      awayRunDelta: rawAwayRuns - neutralAwayRuns,
      homeRunDelta: rawHomeRuns - neutralHomeRuns,
      totalDelta: (rawAwayRuns + rawHomeRuns) - (neutralAwayRuns + neutralHomeRuns),
      homeWinDelta: markets.moneyline[1].probability - _nMarkets.moneyline[1].probability,
      coefs: { chase: DISC_CHASE_COEF, command: DISC_COMMAND_COEF, finish: DISC_FINISH_COEF, cap: DISC_CAP }
    };
    // OPTION 2: team totals get a dampened share of the run-env bump (full-game total keeps full factor).
    const teamEnvFactor = 1 + TEAM_TOTAL_ENV_WEIGHT * (envFactor - 1);
    const awayRunsTT = clamp(rawAwayRuns * teamEnvFactor + Number(effCalib.awayBias || 0), 1.6, 8.2);
    const homeRunsTT = clamp(rawHomeRuns * teamEnvFactor + Number(effCalib.homeBias || 0), 1.6, 8.2);
    const defaultTt = derivedTeamTotalLines(totalLine);
    const activeBookTt = bookTeamTotalLines.gameKey === `${awayTeam}@${homeTeam}` ? bookTeamTotalLines : {};
    const _awayTt = activeBookTt.away != null ? Number(activeBookTt.away) : defaultTt.away;
    const _homeTt = activeBookTt.home != null ? Number(activeBookTt.home) : defaultTt.home;
    const ttOverP = (lam, lineTt) => { const d = nbDistribution(lam, dispersion); let p = 0; for (let k = 0; k < d.length; k++) if (k > lineTt) p += d[k]; return p; };
    const mkTTenv = (raw, adj, lineTt) => { const rnd = (x) => Math.round(x * 100) / 100; const added = adj - raw; const denom = Math.abs(adj - lineTt); const share = denom > 0 ? added / denom : 0; return { raw_team_total: rnd(raw), adjusted_team_total: rnd(adj), line: lineTt, env_added_runs: rnd(added), env_share_of_edge: Math.round(share * 100) / 100, env_dependent: added >= 0.25 || share >= 0.40 }; };
    const awayTTover = ttOverP(awayRunsTT, _awayTt), homeTTover = ttOverP(homeRunsTT, _homeTt);
    markets.teamTotals = [
      { label: `${awayTeam} over ${formatLine(_awayTt)}`, line: _awayTt, probability: awayTTover, odds: americanOdds(awayTTover), key: "awayTT", env: mkTTenv(rawAwayRuns, awayRunsTT, _awayTt) },
      { label: `${homeTeam} over ${formatLine(_homeTt)}`, line: _homeTt, probability: homeTTover, odds: americanOdds(homeTTover), key: "homeTT", env: mkTTenv(rawHomeRuns, homeRunsTT, _homeTt) }
    ];

    const f5Away = starterOnlyRuns({ battingTeam: away, opposingPitcher: homeArmM, park, leagueRpg, leagueEra, disciplineMult: awayDisc.mult, damageMult: awayDamage.run });
    const f5Home = starterOnlyRuns({ battingTeam: home, opposingPitcher: awayArmM, park, leagueRpg, leagueEra, disciplineMult: homeDisc.mult, damageMult: homeDamage.run });
    const f5Markets = summarizeMarkets(scoreMatrix(f5Away, f5Home, dispersion), 4.5, 0, awayTeam, homeTeam);
    const nrfi = Math.exp(-((f5Away / 5) + (f5Home / 5)));

    const totalDistribution = Array.from({ length: 17 }, (_, runs) => ({
      runs,
      probability: matrix
        .filter((score) => score.away + score.home === runs)
        .reduce((acc, score) => acc + score.p, 0)
    }));

    const angles = [];
    const leanIf = (m, thr) => { if (m && m.probability >= thr) angles.push(m); };
    // First inning (crude even-inning approximation → high-threshold only).
    const _refImplied = Math.abs(YRFI_REF_PRICE) / (Math.abs(YRFI_REF_PRICE) + 100); // implied prob at ref price
    const _yProb = 1 - nrfi;
    const _yEdge = _yProb - _refImplied;
    const _yActionable = _yProb >= YRFI_SURFACE_THRESHOLD && _yEdge >= MIN_EDGE_AFTER_VIG;
    if (nrfi >= 0.55) {
      angles.push({ label: "NRFI", market: "First inning", line: 0.5, side: "under", probability: nrfi, odds: americanOdds(nrfi), key: "nrfi", source_type: "angle", threshold_used: 0.55, actionable: true });
    } else if (_yActionable) {
      angles.push({ label: "YRFI", market: "First inning", line: 0.5, side: "over", probability: _yProb, odds: americanOdds(_yProb), key: "yrfi", source_type: "angle", threshold_used: YRFI_SURFACE_THRESHOLD, actionable: true });
    } else if (_yProb >= 0.55) {
      const watchReasons = [];
      if (_yProb < YRFI_SURFACE_THRESHOLD) watchReasons.push(`${(_yProb * 100).toFixed(0)}% below 65% trigger`);
      if (_yEdge < MIN_EDGE_AFTER_VIG) watchReasons.push(`edge ${(_yEdge * 100).toFixed(1)}% below 5% trigger`);
      angles.push({ label: "YRFI WATCH", market: "First inning", line: 0.5, side: "over", probability: _yProb, odds: americanOdds(_yProb), key: "yrfi", source_type: "angle", threshold_used: YRFI_SURFACE_THRESHOLD, actionable: false, watch: true, watch_reason: watchReasons.join(" · ") || "watch only" });
    }
    leanIf(markets.moneyline[0], 0.60);
    leanIf(markets.moneyline[1], 0.60);
    leanIf(markets.totals[0], 0.58);
    leanIf(markets.totals[1], 0.58);
    leanIf(markets.teamTotals[0], 0.58);
    leanIf(markets.teamTotals[1], 0.58);
    leanIf({ ...f5Markets.moneyline[0], label: `${awayTeam} F5 ML`, key: "f5AwayML" }, 0.59);
    leanIf({ ...f5Markets.moneyline[1], label: `${homeTeam} F5 ML`, key: "f5HomeML" }, 0.59);
    leanIf({ ...f5Markets.totals[0], label: "F5 Over 4.5", key: "f5Over" }, 0.58);
    leanIf({ ...f5Markets.totals[1], label: "F5 Under 4.5", key: "f5Under" }, 0.58);

    const partsFor = (battingTeam, oppPitcher, oppTeam, status, totalRuns) => {
      const sIp = clamp(Number(oppPitcher?.ip || 5), 3.5, 7.2);
      const pIp = Math.max(0, 9 - sIp);
      const sFac = pitcherRunPreventionEra(oppPitcher, leagueEra) / leagueEra;
      const statusMult = BULLPEN_MULT[status];
      const pFac = (Number(oppTeam?.bullpenEra || 4.15) * statusMult) / leagueRpg;
      const mu = Number(oppPitcher?.matchup || 1);
      const base = Number(battingTeam?.rpg || leagueRpg) * Number(park || 1);
      const sp = base * (sIp / 9) * sFac * mu;
      const pen = base * (pIp / 9) * pFac;
      const raw = sp + pen;
      const scale = raw > 0 ? totalRuns / raw : 1; // scale parts to the clamped headline
      return { sp: sp * scale, pen: pen * scale, starterIp: sIp, bullpenIp: pIp, starterFactor: sFac, penFactor: pFac, matchup: mu, statusMult };
    };
    const awayParts = partsFor(away, homeArmM, home, homeBullpen, awayRuns);
    const homeParts = partsFor(home, awayArmM, away, awayBullpen, homeRuns);

    // ---- STRIKEOUT LAMBDA (explicit) ----------------------------------------
    // raw pitcher K% is only the BASELINE INPUT. The Log5 opponent-adjusted rate is the
    // PROJECTION INPUT. Everything downstream (projK, P(over), fair odds, edge) is derived
    // from adj_k_log5, never from raw_pitcher_k.
    const league_k = Number(data.league?.kPct || 0.2209);
    const raw_k_away = Number(awayArm?.k || 0) / 100;
    const raw_k_home = Number(homeArm?.k || 0) / 100;
    const opp_k_away = Number(home?.teamK || league_k);   // away arm faces the HOME lineup
    const opp_k_home = Number(away?.teamK || league_k);   // home arm faces the AWAY lineup
    const adj_k_away = log5Rate(raw_k_away, opp_k_away, league_k);
    const adj_k_home = log5Rate(raw_k_home, opp_k_home, league_k);

    // k_lambda = BF x adj_k_log5 x park x umpire x conversion.
    // park/umpire/conversion are EXPLICIT SEAMS held at 1.0: we have no park-K or umpire-K
    // data loaded. They are NOT estimates — they are identity multipliers until real data
    // is supplied. Do not invent values here.
    // CHASE INTERACTION: modifies the K RATE (via k_conversion), never BF or expIP.
    const chaseAway = chaseKAdj(awayArm, home, data);   // away arm vs HOME lineup
    const chaseHome = chaseKAdj(homeArm, away, data);
    const kConvAway = K_CONVERSION_ADJ * chaseAway.adj;
    const kConvHome = K_CONVERSION_ADJ * chaseHome.adj;
    const final_k_away = adj_k_away * kConvAway;
    const final_k_home = adj_k_home * kConvHome;

    const baselineKExpIPAway = expIPAway;
    const baselineKExpIPHome = expIPHome;
    const noDamageKExpIPAway = _eA0;
    const noDamageKExpIPHome = _eH0;
    const kExpIPAway = kWorkloadMode === "no_damage" ? noDamageKExpIPAway : baselineKExpIPAway;
    const kExpIPHome = kWorkloadMode === "no_damage" ? noDamageKExpIPHome : baselineKExpIPHome;
    const bfAway = kExpIPAway * BATTERS_FACED_PER_IP;
    const bfHome = kExpIPHome * BATTERS_FACED_PER_IP;
    const projKAwayBaseline = baselineKExpIPAway * BATTERS_FACED_PER_IP * final_k_away * K_PARK_FACTOR * K_UMPIRE_FACTOR;
    const projKHomeBaseline = baselineKExpIPHome * BATTERS_FACED_PER_IP * final_k_home * K_PARK_FACTOR * K_UMPIRE_FACTOR;
    const projKAwayNoDamage = noDamageKExpIPAway * BATTERS_FACED_PER_IP * final_k_away * K_PARK_FACTOR * K_UMPIRE_FACTOR;
    const projKHomeNoDamage = noDamageKExpIPHome * BATTERS_FACED_PER_IP * final_k_home * K_PARK_FACTOR * K_UMPIRE_FACTOR;
    const projKAway = bfAway * final_k_away * K_PARK_FACTOR * K_UMPIRE_FACTOR;
    const projKHome = bfHome * final_k_home * K_PARK_FACTOR * K_UMPIRE_FACTOR;
    const damageReport = {
      away: awayDamage, home: homeDamage,
      beforeAfter: {
        awayLambdaBefore: dmgOffAwayRuns, awayLambdaAfter: rawAwayRuns,
        homeLambdaBefore: dmgOffHomeRuns, homeLambdaAfter: rawHomeRuns,
        totalBefore: dmgOffAwayRuns + dmgOffHomeRuns, totalAfter: rawAwayRuns + rawHomeRuns,
        homeWinBefore: _dMarkets.moneyline[1].probability, homeWinAfter: markets.moneyline[1].probability,
        expIPAwayBefore: _eA0, expIPAwayAfter: expIPAway,
        expIPHomeBefore: _eH0, expIPHomeAfter: expIPHome,
        projKAwayBefore: _eA0 * BATTERS_FACED_PER_IP * final_k_away,
        projKAwayAfter: projKAway,
        projKHomeBefore: _eH0 * BATTERS_FACED_PER_IP * final_k_home,
        projKHomeAfter: projKHome
      },
      weights: { run: DAMAGE_RUN_WEIGHT, ip: DAMAGE_IP_WEIGHT, tb: DAMAGE_TB_WEIGHT, hr: DAMAGE_HR_WEIGHT, hits: DAMAGE_HITS_WEIGHT, hrr: DAMAGE_HRR_WEIGHT }
    };

    const projOutsAway = Math.round(expIPAway * 3);
    const projOutsHome = Math.round(expIPHome * 3);

    const firstInning = [
      { label: "NRFI", probability: nrfi, odds: americanOdds(nrfi), key: "nrfi" },
      { label: "YRFI", probability: 1 - nrfi, odds: americanOdds(1 - nrfi), key: "yrfi" }
    ];
    const f5Rows = [
      { ...f5Markets.moneyline[0], label: `${awayTeam} F5 ML`, key: "f5AwayML" },
      { ...f5Markets.moneyline[1], label: `${homeTeam} F5 ML`, key: "f5HomeML" },
      { ...f5Markets.totals[0], label: "F5 Over 4.5", key: "f5Over" },
      { ...f5Markets.totals[1], label: "F5 Under 4.5", key: "f5Under" }
    ];

    // pitcher to record the win: P(go 5+) x P(team leads after his innings, from the F5 model) x P(pen holds)
    const qual = (ip) => clamp((ip - 4) / 2, 0.12, 0.95);
    const HOLD = 0.80;
    const awayWinP = clamp(qual(expIPAway) * f5Markets.moneyline[0].probability * HOLD, 0.02, 0.80);
    const homeWinP = clamp(qual(expIPHome) * f5Markets.moneyline[1].probability * HOLD, 0.02, 0.80);
    // A bullpen game or placeholder arm has no starter who can qualify for a win.
    const winnable = (a) => !!a && !!a.name && !String(a.source || "").includes("placeholder");
    const pitcherWin = [
      { label: `${awayArm?.name || awayTeam + " SP"} win`, probability: awayWinP, odds: americanOdds(awayWinP), key: "awaySPwin", suppressed: !winnable(awayArm) },
      { label: `${homeArm?.name || homeTeam + " SP"} win`, probability: homeWinP, odds: americanOdds(homeWinP), key: "homeSPwin", suppressed: !winnable(homeArm) }
    ];

    // core baseball-skill cluster signals (used by the live recommendation gate)
    const mkCtx = (off, oppArm, oppTeam, match, soft, ownArm) => ({
      arsenalEdge: match.mult - 1,
      softSpots: soft.offense.length,
      offenseRate: (Number(off?.rpg || leagueRpg) / leagueRpg) - 1,
      oppStarterWeak: (pitcherRunPreventionEra(oppArm, leagueEra) / leagueEra) - 1,
      oppBullpenWeak: (Number(oppTeam?.bullpenEra || 4.15) / leagueRpg) - 1,
      starterQuality: 1 - (pitcherRunPreventionEra(ownArm, leagueEra) / leagueEra),
      kRate: Number(ownArm?.k || 0) / 100
    });
    const context = {
      leagueRpg, park,
      away: mkCtx(away, homeArm, home, awayMatch, awaySoft, awayArm),
      home: mkCtx(home, awayArm, away, homeMatch, homeSoft, homeArm)
    };
    const calibration = {
      source: effCalib.source,
      manualOverrideActive: effCalib.manualOverrideActive,
      totalBias: effCalib.totalBias, homeBias: effCalib.homeBias, awayBias: effCalib.awayBias,
      gamesLogged: effCalib.n, learnedTotalBias: effCalib.learnedTotalBias, notes: effCalib.notes,
      rawAwayRuns, rawHomeRuns, calibratedAwayRuns: awayRuns, calibratedHomeRuns: homeRuns,
      totalBiasApplied: effCalib.totalBias,
      sideBiasApplied: { home: Number(effCalib.homeBias || 0), away: Number(effCalib.awayBias || 0) },
      runEnv: { enabled: runEnv.enabled, weightedBias: Number(runEnv.weightedBias || 0), factor: envFactor, capPct: _cap * 100, capped: envCapped, n: runEnv.n, cleanN: runEnv.cleanN, lowSample: runEnv.lowSample, rawTotal: _rawTotal, adjTotal: awayRuns + homeRuns, nights: runEnv.nights }
    };

    return {
      away,
      home,
      awayArm,
      homeArm,
      awayRuns,
      homeRuns,
      awayRunsTT,
      homeRunsTT,
      rawAwayRuns,
      rawHomeRuns,
      matrix,
      context,
      calibration,
      f5Away,
      f5Home,
      nrfi,
      markets,
      f5Markets,
      f5Rows,
      firstInning,
      pitcherWin,
      awayParts,
      homeParts,
      projKAway,
      projKHome,
      projKAwayBaseline,
      projKHomeBaseline,
      projKAwayNoDamage,
      projKHomeNoDamage,
      rawKAway: raw_k_away, rawKHome: raw_k_home,
      oppKAway: opp_k_away, oppKHome: opp_k_home,
      adjKAway: adj_k_away, adjKHome: adj_k_home,
      finalKAway: final_k_away, finalKHome: final_k_home,
      kConvAway, kConvHome,
      chaseAway, chaseHome,
      bfAway, bfHome,
      kExpIPAway,
      kExpIPHome,
      baselineKExpIPAway,
      baselineKExpIPHome,
      noDamageKExpIPAway,
      noDamageKExpIPHome,
      kWorkloadMode,
      leagueK: league_k,
      awayDisc, homeDisc, disciplineReport,
      awayDamage, homeDamage, damageReport,
      dmgOffAwayRuns, dmgOffHomeRuns,
      projOutsAway,
      projOutsHome,
      expIPAway,
      expIPHome,
      awayPlayerAngles,
      homePlayerAngles,
      awayMatch,
      homeMatch,
      awaySoft,
      homeSoft,
      totalDistribution,
      angles
    };
  }, [awayTeam, homeTeam, awayPitcher, homePitcher, awayBullpen, homeBullpen, dispersion, totalLine, homeSpread, teams, pitchers, leagueRpg, leagueRV, crush, pitchRef, effCalib, runEnv, bookTeamTotalLines, kWorkloadMode]);

  function importPool() {
    try {
      const parsed = JSON.parse(poolText);
      const nextPitchers = Array.isArray(parsed) ? parsed : parsed.pitchers;
      if (!Array.isArray(nextPitchers) || nextPitchers.length === 0) {
        throw new Error("No pitchers array found.");
      }
      const nextGames = Array.isArray(parsed.games) && parsed.games.length ? parsed.games : games;
      const nextData = {
        ...data,
        source: "imported-pool",
        generated: new Date().toISOString(),
        pitchers: nextPitchers,
        games: nextGames
      };
      setData(nextData);
      setLoadState(`Imported pool · ${nextPitchers.length} pitchers`);
      setImportMessage(`Imported ${nextPitchers.length} pitchers`);
      applyGame(nextGames[0], nextData);
      setSelectedGameIndex(0);
    } catch (error) {
      setImportMessage(error.message);
    }
  }

  async function fetchOdds() {
    if (!oddsKey.trim()) {
      setOddsMessage("Missing API key");
      return;
    }
    setOddsMessage("Fetching...");
    try {
      const requestJson = async (url) => {
        const response = await fetch(url);
        if (!response.ok) {
          let detail = "";
          try { detail = await response.text(); } catch (e) { /* ignore */ }
          throw new Error(`HTTP ${response.status}${detail ? `: ${detail.slice(0, 120)}` : ""}`);
        }
        return response.json();
      };
      const baseParams = {
        apiKey: oddsKey.trim(),
        regions: "us",
        oddsFormat: "american"
      };
      const sameEntity = (value, target) => {
        const name = normalizeName(value || "");
        const wanted = normalizeName(target || "");
        return !!name && !!wanted && (name.includes(wanted) || wanted.includes(name));
      };
      const samePoint = (point, target, tolerance = 0.01) => (
        Number.isFinite(Number(point)) &&
        Number.isFinite(Number(target)) &&
        Math.abs(Number(point) - Number(target)) <= tolerance
      );
      const bestBook = (bookmakers = [], wantedMarkets = []) => {
        const wanted = new Set(wantedMarkets);
        return bookmakers
          .map((book) => ({
            book,
            score: (book.markets || []).reduce((sum, market) => sum + (wanted.has(market.key) ? 2 : 1), 0)
          }))
          .sort((a, b) => b.score - a.score)[0]?.book || null;
      };
      const booksForMarkets = (bookmakers = [], wantedMarkets = []) => {
        const seen = new Set();
        const books = [];
        wantedMarkets.forEach((key) => {
          const book = bookmakers.find((item) => item.markets?.some((market) => market.key === key));
          if (book && !seen.has(book.key || book.title)) {
            seen.add(book.key || book.title);
            books.push(book);
          }
        });
        return books;
      };
      const featuredParams = new URLSearchParams({
        ...baseParams,
        markets: "h2h,spreads,totals"
      });
      const odds = await requestJson(`https://api.the-odds-api.com/v4/sports/baseball_mlb/odds/?${featuredParams}`);
      const awayName = normalizeName(model.away?.name || awayTeam);
      const homeName = normalizeName(model.home?.name || homeTeam);
      const event = odds.find((item) => {
        const names = [item.away_team, item.home_team].map(normalizeName);
        return names.some((name) => name.includes(awayName) || awayName.includes(name)) &&
          names.some((name) => name.includes(homeName) || homeName.includes(name));
      });
      if (!event) throw new Error("Game not found");

      const nextOdds = {};
      const nextTeamTotalLines = { gameKey: `${awayTeam}@${homeTeam}`, away: null, home: null };
      const loadedMarkets = new Set();
      const armName = (arm) => normalizeName(arm?.name || "");
      const isArm = (value, arm) => {
        const player = normalizeName(value || "");
        const target = armName(arm);
        return !!player && !!target && (target.includes(player) || player.includes(target));
      };
      const parseBook = (book) => {
        book?.markets?.forEach((market) => {
        loadedMarkets.add(market.key);
        if (market.key === "h2h") {
          market.outcomes.forEach((outcome) => {
            const name = normalizeName(outcome.name);
            if (name.includes(awayName) || awayName.includes(name)) nextOdds.awayML = outcome.price;
            if (name.includes(homeName) || homeName.includes(name)) nextOdds.homeML = outcome.price;
          });
        }
        if (market.key === "totals") {
          market.outcomes.forEach((outcome) => {
            if (outcome.point) setTotalLine(outcome.point);
            if (outcome.name === "Over") nextOdds.over = outcome.price;
            if (outcome.name === "Under") nextOdds.under = outcome.price;
          });
        }
        if (market.key === "spreads") {
          market.outcomes.forEach((outcome) => {
            const name = normalizeName(outcome.name);
            if (name.includes(homeName) || homeName.includes(name)) {
              setHomeSpread(outcome.point);
              nextOdds.homeRunline = outcome.price;
            }
            if (name.includes(awayName) || awayName.includes(name)) nextOdds.awayRunline = outcome.price;
          });
        }
        if (market.key === "alternate_spreads") {
          market.outcomes.forEach((outcome) => {
            if (!samePoint(Math.abs(Number(outcome.point)), Number(altRL))) return;
            const name = normalizeName(outcome.name);
            const point = Number(outcome.point);
            if (name.includes(homeName) || homeName.includes(name)) nextOdds[point < 0 ? "altHomeLay" : "altHomeGet"] = outcome.price;
            if (name.includes(awayName) || awayName.includes(name)) nextOdds[point < 0 ? "altAwayLay" : "altAwayGet"] = outcome.price;
          });
        }
        if (market.key === "alternate_totals") {
          market.outcomes.forEach((outcome) => {
            if (!samePoint(outcome.point, altTotal)) return;
            if (outcome.name === "Over") nextOdds.altOver = outcome.price;
            if (outcome.name === "Under") nextOdds.altUnder = outcome.price;
          });
        }
        if (market.key === "team_totals" || market.key === "alternate_team_totals") {
          market.outcomes.forEach((outcome) => {
            const teamDesc = normalizeName(outcome.description || outcome.name);
            const sideName = normalizeName(outcome.name);
            const point = snapHalf(outcome.point);
            if (point == null) return;
            if (teamDesc.includes(awayName) || awayName.includes(teamDesc)) {
              if (nextTeamTotalLines.away == null) nextTeamTotalLines.away = point;
              if (sideName === "over" && nextOdds.awayTT == null) nextOdds.awayTT = outcome.price;
              if (sideName === "under" && nextOdds.awayTTU == null) nextOdds.awayTTU = outcome.price;
            }
            if (teamDesc.includes(homeName) || homeName.includes(teamDesc)) {
              if (nextTeamTotalLines.home == null) nextTeamTotalLines.home = point;
              if (sideName === "over" && nextOdds.homeTT == null) nextOdds.homeTT = outcome.price;
              if (sideName === "under" && nextOdds.homeTTU == null) nextOdds.homeTTU = outcome.price;
            }
          });
        }
        if (market.key === "h2h_1st_5_innings") {
          market.outcomes.forEach((outcome) => {
            const name = normalizeName(outcome.name);
            if (name.includes(awayName) || awayName.includes(name)) nextOdds.f5AwayML = outcome.price;
            if (name.includes(homeName) || homeName.includes(name)) nextOdds.f5HomeML = outcome.price;
          });
        }
        if (market.key === "totals_1st_5_innings") {
          market.outcomes.forEach((outcome) => {
            if (!samePoint(outcome.point, 4.5)) return;
            if (outcome.name === "Over") nextOdds.f5Over = outcome.price;
            if (outcome.name === "Under") nextOdds.f5Under = outcome.price;
          });
        }
        if (market.key === "totals_1st_1_innings") {
          market.outcomes.forEach((outcome) => {
            if (outcome.name === "Over") nextOdds.yrfi = outcome.price;
            if (outcome.name === "Under") nextOdds.nrfi = outcome.price;
          });
        }
        if (market.key === "pitcher_strikeouts" || market.key === "pitcher_strikeouts_alternate") {
          market.outcomes.forEach((outcome) => {
            const player = normalizeName(outcome.description || "");
            const sideName = normalizeName(outcome.name);
            const isAlt = market.key === "pitcher_strikeouts_alternate";
            if (isArm(player, model.awayArm)) {
              if (!isAlt && outcome.point != null) setKLineAway(outcome.point);
              if (isAlt && !samePoint(outcome.point, kLineAway)) return;
              if (sideName === "over") nextOdds.kAway = outcome.price;
              if (sideName === "under") nextOdds.kAwayU = outcome.price;
            }
            if (isArm(player, model.homeArm)) {
              if (!isAlt && outcome.point != null) setKLineHome(outcome.point);
              if (isAlt && !samePoint(outcome.point, kLineHome)) return;
              if (sideName === "over") nextOdds.kHome = outcome.price;
              if (sideName === "under") nextOdds.kHomeU = outcome.price;
            }
          });
        }
        if (market.key === "pitcher_record_a_win" || market.key === "pitcher_to_record_a_win") {
          market.outcomes.forEach((outcome) => {
            const player = normalizeName(outcome.description || outcome.name || "");
            if (isArm(player, model.awayArm)) nextOdds.awaySPwin = outcome.price;
            if (isArm(player, model.homeArm)) nextOdds.homeSPwin = outcome.price;
          });
        }
      });
      };
      const featuredBook = bestBook(event.bookmakers || [], ["h2h", "spreads", "totals"]);
      parseBook(featuredBook);

      const eventParams = new URLSearchParams({
        ...baseParams,
        markets: [
          "team_totals",
          "alternate_team_totals",
          "alternate_spreads",
          "alternate_totals",
          "h2h_1st_5_innings",
          "totals_1st_5_innings",
          "totals_1st_1_innings",
          "pitcher_strikeouts",
          "pitcher_strikeouts_alternate",
          "pitcher_record_a_win"
        ].join(",")
      });
      let eventBook = null;
      let eventBooksUsed = [];
      let eventWarning = "";
      const eventMarketKeys = [
        "team_totals",
        "alternate_team_totals",
        "alternate_spreads",
        "alternate_totals",
        "h2h_1st_5_innings",
        "totals_1st_5_innings",
        "totals_1st_1_innings",
        "pitcher_strikeouts",
        "pitcher_strikeouts_alternate",
        "pitcher_record_a_win"
      ];
      try {
        const eventOdds = await requestJson(`https://api.the-odds-api.com/v4/sports/baseball_mlb/events/${event.id}/odds?${eventParams}`);
        eventBooksUsed = booksForMarkets(eventOdds.bookmakers || [], eventMarketKeys);
        eventBook = eventBooksUsed[0] || bestBook(eventOdds.bookmakers || [], eventMarketKeys);
        (eventBooksUsed.length ? eventBooksUsed : [eventBook]).forEach(parseBook);
      } catch (eventError) {
        eventWarning = `; props unavailable (${eventError.message})`;
      }
      if (!Object.keys(nextOdds).length) throw new Error("No matching bookmaker prices");

      if (nextTeamTotalLines.away != null || nextTeamTotalLines.home != null) {
        setBookTeamTotalLines(nextTeamTotalLines);
      } else {
        setBookTeamTotalLines({ gameKey: "", away: null, home: null });
      }
      setMarketOdds(nextOdds);
      const titles = [featuredBook?.title, ...eventBooksUsed.map((book) => book.title), eventBook?.title].filter(Boolean);
      const loaded = [...loadedMarkets].length;
      setOddsMessage(`${titles.length ? `${[...new Set(titles)].join(" + ")} odds loaded` : "Odds loaded"} · ${loaded} markets${eventWarning}`);
    } catch (error) {
      const blocked = /failed to fetch|networkerror|load failed/i.test(error.message || "");
      setOddsMessage(
        blocked
          ? "Browser blocked the request. Use a deployed host/proxy, or type prices manually."
          : error.message
      );
    }
  }

  const live = data.source === "live-data";
  const mkGrp = { padding: "12px 2px 3px", fontSize: 11, fontWeight: 800, color: "#2d6cdf", textTransform: "uppercase", letterSpacing: 0.5 };
  const modelBlock = modelDaily?.games?.[`${awayTeam}@${homeTeam}`];

  const altOver = (line) => {
    let o = 0, u = 0, push = 0;
    (model.matrix || []).forEach((s) => {
      const t = s.away + s.home;
      if (t > line) o += s.p; else if (t < line) u += s.p; else push += s.p;
    });
    const np = Math.max(0.001, 1 - push);
    return { over: o / np, under: u / np };
  };
  const altRun = (line) => {
    let lay = 0, get = 0;
    (model.matrix || []).forEach((s) => {
      const m = s.home - s.away;
      if (m - line > 0) lay += s.p;   // home -line covers
      if (m + line > 0) get += s.p;   // home +line covers
    });
    return { homeLay: lay, homeGet: get, awayGet: 1 - lay, awayLay: 1 - get };
  };
  const r2 = (x) => Math.round(Number(x) * 100) / 100;
  const stepBtn = { width: 28, height: 28, borderRadius: 6, border: "1px solid #cfd8e3", background: "#fff", color: "#18212f", fontWeight: 800, fontSize: 15, lineHeight: 1 };
  const snapBtn = { height: 28, padding: "0 10px", borderRadius: 6, border: "1px solid #cfd8e3", background: "#f2f7ff", color: "#2d6cdf", fontWeight: 800, fontSize: 11 };
  const calBox = { display: "grid", gap: 3, padding: "10px 12px", background: "#fbfcfd", alignContent: "center" };
  const calLbl = { fontSize: 10.5, color: "#657385", fontWeight: 750 };
  const calVal = { fontSize: 18, fontWeight: 800 };

  function logResult() {
    const aa = Number(actualAway), ah = Number(actualHome);
    if (actualAway === "" || actualHome === "" || Number.isNaN(aa) || Number.isNaN(ah)) return;
    const rec = {
      date: data.date || "", night: data.date || "", away: awayTeam, home: homeTeam,
      projAway: r2(model.rawAwayRuns), projHome: r2(model.rawHomeRuns),
      projWinHome: model.markets.moneyline[1].probability,
      actualAway: aa, actualHome: ah
    };
    setResults((prev) => [
      ...prev.filter((x) => !(x.date === rec.date && x.away === rec.away && x.home === rec.home)),
      rec
    ]);
    setActualAway(""); setActualHome("");
  }
  function resetResults() {
    setResults([]);
    try { if (typeof window !== "undefined" && window.storage) window.storage.delete("ccresults:v1"); } catch (e) { /* ignore */ }
  }
  // ONE source of truth: the live calibrated engine drives every recommendation surface
  const liveRecs = buildLiveRecommendations(model, marketOdds, { awayTeam, homeTeam, leagueRpg, awayBullpen, homeBullpen, kLineAway, kLineHome, totalLine, bookTeamTotalLines, requireApiTeamTotals: CUSTOMER_FACING });
  const visibleHitters = new Set(liveRecs.all.filter((r) => r.entity && r.is_user_visible).map((r) => r.entity));
  const PROP_MARKETS = new Set(["Strikeout prop", "Pitcher win", "Batter hits", "Batter TB", "Batter HR"]);
  const propSourceLabel = !offlineProps ? "Source: In-app estimate fallback"
    : offlineProps.synthetic ? "Source: Synthetic player-prop pipeline — dev only"
      : "Source: Offline player-prop pipeline";
  const dispGroups = (() => {
    if (!offlineProps) return liveRecs.groups;
    const g = { A: [], B: [], C: [], D: [] };
    ["A", "B", "C", "D"].forEach((k) => { g[k] = liveRecs.groups[k].filter((r) => !PROP_MARKETS.has(r.market)); });
    offlineProps.recs.forEach((r) => { if (g[r.group]) g[r.group].push(r); });
    ["A", "B", "C", "D"].forEach((k) => g[k].sort((a, b) => (b.edge ?? -1e9) - (a.edge ?? -1e9)));
    return g;
  })();
  const cal = model.calibration;

  // PICK EXPORT: capture the exact surfaced picks for the viewed game into a date-keyed store.
  // Additive only — reads the engine's own output (dispGroups), never re-prices or alters recs.
  useEffect(() => {
    if (!model || !model.markets) return;
    const firstInningAngles = (model.angles || []).filter((a) => a.market === "First inning");
    const tagged = [
      ...dispGroups.A.map((r) => ({ ...r, _source: "rec_engine" })),
      ...dispGroups.B.map((r) => ({ ...r, _source: "lean" })),
      ...(exportAllProj ? [...dispGroups.C, ...dispGroups.D].map((r) => ({ ...r, _source: "projection" })) : []),
      ...firstInningAngles.map((a) => ({ ...a, _source: "angle" }))
    ];
    const meta = {
      date: data.date, away: awayTeam, home: homeTeam, pitchers,
      awayStarterSrc: (pitchers.find((p) => normalizeName(p.name) === normalizeName(awayPitcher)) || {}).source,
      homeStarterSrc: (pitchers.find((p) => normalizeName(p.name) === normalizeName(homePitcher)) || {}).source
    };
    const picks = tagged.map((r) => toExportPick(r, meta));
    setPickStore((prev) => {
      const next = { ...prev, [`${data.date}|${awayTeam}@${homeTeam}`]: { game: `${awayTeam}@${homeTeam}`, date: data.date, count: picks.length, picks } };
      try {
        if (typeof window !== "undefined" && window.storage) {
          const bundle = {};
          Object.keys(next).forEach((k) => { if (next[k].date === data.date) bundle[k] = next[k]; });
          window.storage.set(`diamondpicks_${data.date}`, JSON.stringify(bundle)).catch(() => {});
        }
      } catch (e) { /* storage unavailable on this host — in-memory still works */ }
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model, offlineProps, exportAllProj, awayTeam, homeTeam, data.date]);

  // Restore every previously-captured slate from durable storage on load, so a reload
  // or moving to a new date never loses picks — past dates stay exportable.
  useEffect(() => {
    (async () => {
      try {
        if (typeof window === "undefined" || !window.storage) return;
        const res = await window.storage.list("diamondpicks_");
        const keys = (res && res.keys) || [];
        const restored = {};
        for (const k of keys) {
          try { const r = await window.storage.get(k); if (r && r.value) { const bundle = JSON.parse(r.value); Object.keys(bundle).forEach((bk) => { restored[bk] = bundle[bk]; }); } } catch (e) {}
        }
        if (Object.keys(restored).length) setPickStore((prev) => ({ ...restored, ...prev }));
      } catch (e) { /* no durable storage */ }
    })();
  }, []);

  function buildExportPayload(exDate) {
    const date = exDate || data.date;
    const entries = Object.values(pickStore).filter((e) => e.date === date);
    const picks = entries.flatMap((e) => e.picks);
    return {
      date, model_version: MODEL_VERSION, generated_at: new Date().toISOString(),
      export_all_projections: exportAllProj, games_captured: entries.length,
      games_on_slate: games.length, pick_count: picks.length, picks
    };
  }
  function exportSlate() {
    const exDate = exportDate || data.date;
    const json = JSON.stringify(buildExportPayload(exDate), null, 2);
    setExportJson(json);            // reliable in the sandbox — copy/paste this
    setExportCopied("");
    try {                           // best-effort file download (works on a deployed host)
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `diamond_picks_${exDate}.json`;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (e) { /* sandbox blocks downloads — the copyable text below is the path */ }
  }
  async function copyExport() {
    try { await navigator.clipboard.writeText(exportJson); setExportCopied("Copied ✓"); }
    catch (e) {
      const ta = document.getElementById("export-json-ta");
      if (ta && ta.select) { ta.select(); try { document.execCommand("copy"); setExportCopied("Copied ✓"); } catch (e2) { setExportCopied("Select the text and copy manually"); } }
      else setExportCopied("Select the text and copy manually");
    }
    setTimeout(() => setExportCopied(""), 2500);
  }
  const effExportDate = exportDate || data.date;
  const availableDates = [...new Set(Object.values(pickStore).map((e) => e.date))].sort();
  const capturedForDate = Object.values(pickStore).filter((e) => e.date === effExportDate);
  const capturedPickCount = capturedForDate.reduce((s, e) => s + e.count, 0);
  const recSource = model.markets ? "live_engine" : (modelBlock ? "offline_snapshot" : "empty");
  const sourceLabel = recSource === "live_engine" ? "Source: Live engine"
    : recSource === "offline_snapshot" ? "Source: Offline pipeline snapshot" : "Source: Empty fallback";
  const calZero = cal.totalBias === 0 && cal.sideBiasApplied.home === 0 && cal.sideBiasApplied.away === 0;
  const teamTotalMarketRows = model.markets.teamTotals.flatMap((item) => [
    item,
    {
      ...item,
      label: item.label.replace("over", "under"),
      probability: 1 - item.probability,
      odds: americanOdds(1 - item.probability),
      key: `${item.key}U`
    }
  ]);
  const activeBookTeamTotals = bookTeamTotalLines.gameKey === `${awayTeam}@${homeTeam}` ? bookTeamTotalLines : {};
  const apiTeamTotalRows = teamTotalMarketRows.filter((item) => {
    const side = item.key.startsWith("away") ? "away" : item.key.startsWith("home") ? "home" : null;
    return side && activeBookTeamTotals[side] != null;
  });
  const firstInningNotice = (() => {
    const angle = (model.angles || []).find((item) => item.market === "First inning");
    const yrfi = model.firstInning.find((item) => item.key === "yrfi");
    const nrfiRow = model.firstInning.find((item) => item.key === "nrfi");
    const yrfiPct = yrfi ? `${(yrfi.probability * 100).toFixed(0)}%` : "n/a";
    const nrfiPct = nrfiRow ? `${(nrfiRow.probability * 100).toFixed(0)}%` : "n/a";
    if (angle && angle.actionable !== false) {
      return { tone: "good", text: `${angle.label} actionable · ${(angle.probability * 100).toFixed(0)}%` };
    }
    if (angle?.watch) {
      return { tone: "warn", text: `${angle.label} watch only · ${angle.watch_reason || `YRFI ${yrfiPct} / NRFI ${nrfiPct}`}` };
    }
    return { tone: "muted", text: `No actionable first-inning edge · YRFI ${yrfiPct} / NRFI ${nrfiPct}` };
  })();
  const customerPropAngles = (() => {
    const priced = liveRecs.all
      .filter((r) => PROP_MARKETS.has(r.market) && r.entity && r.angle && r.is_user_visible)
      .map((r) => ({
        key: `${r.market}-${r.selection}`,
        selection: r.selection,
        market: r.odds != null ? `${r.market} ${formatOdds(r.odds)}` : r.market,
        note: r.confidence ? `${r.confidence} · ${r.angle}` : r.angle
      }));
    const watch = [
      ...(model.awayPlayerAngles || []).map((item) => ({
        key: `away-${item.hitter}-${item.type}`,
        selection: item.hitter,
        market: item.type,
        note: `${awayTeam} angle vs ${model.homeArm?.name || "opposing starter"}`
      })),
      ...(model.homePlayerAngles || []).map((item) => ({
        key: `home-${item.hitter}-${item.type}`,
        selection: item.hitter,
        market: item.type,
        note: `${homeTeam} angle vs ${model.awayArm?.name || "opposing starter"}`
      }))
    ];
    const seen = new Set();
    return [...priced, ...watch].filter((item) => {
      if (seen.has(item.key)) return false;
      seen.add(item.key);
      return true;
    }).slice(0, 8);
  })();
  const customerPicks = [...dispGroups.A, ...dispGroups.B].slice(0, 10);
  const publicOddsTools = {
    gridTemplateColumns: "minmax(120px, auto) minmax(0, 1fr)",
    alignItems: "center"
  };

  if (CUSTOMER_FACING) {
    return (
      <div className="app-shell">
        <style dangerouslySetInnerHTML={{ __html: APP_CSS }} />
        <header className="topbar">
          <div>
            <div className="brand"><span style={{ color: "#2d6cdf" }}>CC</span> Baseball Board</div>
            <div className="subline">Slate {data.date || ""} · {games.length} games · mobile customer view</div>
          </div>
          <div className="status-pill live">
            <span />
            Private model details hidden
          </div>
        </header>

        <main className="model-grid">
          <section className="panel slate-panel">
            <div className="panel-heading">
              <h2>Slate</h2>
              <Database size={18} aria-hidden="true" />
            </div>
            <div className="game-list">
              {games.map((game, index) => (
                <button
                  className={`game-card ${index === selectedGameIndex ? "active" : ""}`}
                  key={`${game.away}-${game.home}-${index}`}
                  onClick={() => {
                    setSelectedGameIndex(index);
                    applyGame(game);
                  }}
                >
                  <span className="matchup">{game.away} @ {game.home}</span>
                  <span>{game.awayStarter || "TBD"} vs {game.homeStarter || "TBD"}</span>
                  <small>{game.status === "Final" && game.score ? `Final ${game.score.a}-${game.score.h}` : (game.time || game.status || "")}</small>
                </button>
              ))}
            </div>
          </section>

          <section className="panel" style={{ borderColor: "#cfe0fb" }}>
            <div className="panel-heading"><h2>Top Plays</h2><CircleDollarSign size={18} aria-hidden="true" /></div>
            <div style={{ padding: 14, display: "grid", gap: 10 }}>
              {customerPicks.length ? customerPicks.map((r, i) => (
                <CustomerPickRow key={`${r.market}-${r.selection}-${i}`} r={r} />
              )) : (
                <div className="empty-state">Refresh odds or enter prices to surface qualified plays.</div>
              )}
            </div>
          </section>

          <section className="panel">
            <div className="panel-heading"><h2>Prop Angles</h2><Activity size={18} aria-hidden="true" /></div>
            <div style={{ padding: 14, display: "grid", gap: 8 }}>
              {customerPropAngles.length ? customerPropAngles.map((item) => (
                <CustomerPropAngle key={item.key} item={item} />
              )) : (
                <div className="empty-state">No customer-safe prop angle cleared the watchlist.</div>
              )}
            </div>
          </section>

          <section className="panel markets-panel">
            <div className="panel-heading">
              <h2>Markets</h2>
              <CircleDollarSign size={18} aria-hidden="true" />
            </div>
            <div className="odds-tools" style={publicOddsTools}>
              <button type="button" onClick={fetchOdds}>Refresh live odds</button>
              <span style={{ whiteSpace: "normal" }}>{oddsMessage || "API key is preloaded. Refresh to pull sportsbook lines for this game."}</span>
            </div>

            <div className="market-table">
              <div className="market-head"><span>Market</span><span>Fair</span><span>Book</span><span>Bet</span></div>
              <div style={mkGrp}>Full Game</div>
              {model.markets.moneyline.map((item) => <MarketRow key={item.label} item={item} marketOdds={marketOdds} setOdd={setOdd} />)}
              {model.markets.runline.map((item) => <MarketRow key={item.label} item={item} marketOdds={marketOdds} setOdd={setOdd} />)}
              {model.markets.totals.map((item) => <MarketRow key={item.label} item={item} marketOdds={marketOdds} setOdd={setOdd} />)}
              <div style={mkGrp}>Team Totals</div>
              {apiTeamTotalRows.length ? apiTeamTotalRows.map((item) => <MarketRow key={item.key} item={item} marketOdds={marketOdds} setOdd={setOdd} />) : (
                <div style={{ fontSize: 10.5, color: "#9a6a1a", background: "#fff8ec", border: "1px solid #f2dcae", borderRadius: 5, padding: "6px 8px", margin: "4px 0 7px" }}>
                  Team totals load only from the odds API. Refresh live odds; if the book does not return team totals, this section stays empty.
                </div>
              )}
              <div style={mkGrp}>First 5</div>
              {model.f5Rows.map((item) => <MarketRow key={item.label} item={item} marketOdds={marketOdds} setOdd={setOdd} />)}
              <div style={mkGrp}>Pitcher</div>
              {model.pitcherWin.filter((item) => !item.suppressed).map((item) => <MarketRow key={item.label} item={item} marketOdds={marketOdds} setOdd={setOdd} />)}
              <div style={mkGrp}>First Inning</div>
              <div style={{ fontSize: 10.5, fontWeight: 800, padding: "2px 0 6px", color: firstInningNotice.tone === "good" ? "#11824a" : firstInningNotice.tone === "warn" ? "#9a6a1a" : "#8793a2" }}>
                {firstInningNotice.text}
              </div>
              {model.firstInning.map((item) => <MarketRow key={item.label} item={item} marketOdds={marketOdds} setOdd={setOdd} />)}
            </div>
          </section>

          <section className="panel">
            <div className="panel-heading"><h2>Alt Markets</h2><CircleDollarSign size={18} aria-hidden="true" /></div>
            <div style={{ padding: 14, display: "grid", gap: 16 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 800, color: "#5e6b7c" }}>Alt total</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <button onClick={() => setAltTotal((v) => Math.max(3, r2(Number(v) - 0.5)))} style={stepBtn}>-</button>
                    <strong style={{ minWidth: 40, textAlign: "center", fontVariantNumeric: "tabular-nums" }}>{Number(altTotal).toFixed(1)}</strong>
                    <button onClick={() => setAltTotal((v) => r2(Number(v) + 0.5))} style={stepBtn}>+</button>
                  </div>
                </div>
                <div className="market-table" style={{ padding: 0 }}>
                  <div className="market-head"><span>Market</span><span>Fair</span><span>Book</span><span>Bet</span></div>
                  {(() => { const at = altOver(Number(altTotal)); return [
                    { label: `Over ${Number(altTotal).toFixed(1)}`, probability: at.over, odds: americanOdds(at.over), key: "altOver" },
                    { label: `Under ${Number(altTotal).toFixed(1)}`, probability: at.under, odds: americanOdds(at.under), key: "altUnder" }
                  ].map((item) => <MarketRow key={item.key} item={item} marketOdds={marketOdds} setOdd={setOdd} />); })()}
                </div>
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 800, color: "#5e6b7c" }}>Alt run line</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <button onClick={() => setAltRLflip((v) => !v)} style={{ height: 26, padding: "0 9px", borderRadius: 6, border: "1px solid #d4dbe4", background: altRLflip ? "#eef4ff" : "#fff", color: altRLflip ? "#2d6cdf" : "#5e6b7c", fontSize: 11, fontWeight: 800, cursor: "pointer" }}>flip</button>
                    <button onClick={() => setAltRL((v) => Math.max(0.5, r2(Number(v) - 1)))} style={stepBtn}>-</button>
                    <strong style={{ minWidth: 40, textAlign: "center", fontVariantNumeric: "tabular-nums" }}>{Number(altRL).toFixed(1)}</strong>
                    <button onClick={() => setAltRL((v) => r2(Number(v) + 1))} style={stepBtn}>+</button>
                  </div>
                </div>
                <div className="market-table" style={{ padding: 0 }}>
                  <div className="market-head"><span>Market</span><span>Fair</span><span>Book</span><span>Bet</span></div>
                  {(() => { const ar = altRun(Number(altRL)); const L = Number(altRL).toFixed(1); const homeFav = ar.homeLay >= ar.awayLay;
                    const favLay = homeFav ? { label: `${homeTeam} -${L}`, probability: ar.homeLay, key: "altHomeLay" } : { label: `${awayTeam} -${L}`, probability: ar.awayLay, key: "altAwayLay" };
                    const dogGet = homeFav ? { label: `${awayTeam} +${L}`, probability: ar.awayGet, key: "altAwayGet" } : { label: `${homeTeam} +${L}`, probability: ar.homeGet, key: "altHomeGet" };
                    const dogLay = homeFav ? { label: `${awayTeam} -${L}`, probability: ar.awayLay, key: "altAwayLay" } : { label: `${homeTeam} -${L}`, probability: ar.homeLay, key: "altHomeLay" };
                    const favGet = homeFav ? { label: `${homeTeam} +${L}`, probability: ar.homeGet, key: "altHomeGet" } : { label: `${awayTeam} +${L}`, probability: ar.awayGet, key: "altAwayGet" };
                    const rows = altRLflip ? [dogLay, favGet] : [favLay, dogGet];
                    return rows.map((item) => <MarketRow key={item.key} item={{ ...item, odds: americanOdds(item.probability) }} marketOdds={marketOdds} setOdd={setOdd} />); })()}
                </div>
              </div>
            </div>
          </section>

          <section className="panel">
            <div className="panel-heading"><h2>Strikeout Props</h2><CircleDollarSign size={18} aria-hidden="true" /></div>
            <div style={{ padding: 14, display: "grid", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap", border: "1px solid #e1e7ee", borderRadius: 8, padding: "8px 10px", background: "#fbfcfd" }}>
                <strong style={{ fontSize: 12.5 }}>Pitcher form scenario</strong>
                <div style={{ display: "inline-flex", border: "1px solid #cfd8e3", borderRadius: 7, overflow: "hidden" }}>
                  {[
                    ["baseline", "Baseline"],
                    ["no_damage", "Pitcher sharp"]
                  ].map(([mode, label]) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setKWorkloadMode(mode)}
                      style={{
                        height: 30,
                        padding: "0 10px",
                        borderRadius: 0,
                        background: kWorkloadMode === mode ? "#2d6cdf" : "#fff",
                        color: kWorkloadMode === mode ? "#fff" : "#243044",
                        fontSize: 11.5,
                        fontWeight: 800
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <KProp publicMode arm={model.awayArm} projK={model.projKAway} line={kLineAway} setLine={setKLineAway} oddsKey="kAway" marketOdds={marketOdds} setOdd={setOdd} mech={model.chaseAway} oppTeam={teams.find((t) => t.abbr === homeTeam)} oppAbbr={homeTeam} rawK={model.rawKAway} adjK={model.adjKAway} kConv={model.kConvAway} finalK={model.finalKAway} bf={model.bfAway} kExpIP={model.kExpIPAway} baselineProjK={model.projKAwayBaseline} noDamageProjK={model.projKAwayNoDamage} baselineExpIP={model.baselineKExpIPAway} noDamageExpIP={model.noDamageKExpIPAway} kWorkloadMode={model.kWorkloadMode} />
              <KProp publicMode arm={model.homeArm} projK={model.projKHome} line={kLineHome} setLine={setKLineHome} oddsKey="kHome" marketOdds={marketOdds} setOdd={setOdd} mech={model.chaseHome} oppTeam={teams.find((t) => t.abbr === awayTeam)} oppAbbr={awayTeam} rawK={model.rawKHome} adjK={model.adjKHome} kConv={model.kConvHome} finalK={model.finalKHome} bf={model.bfHome} kExpIP={model.kExpIPHome} baselineProjK={model.projKHomeBaseline} noDamageProjK={model.projKHomeNoDamage} baselineExpIP={model.baselineKExpIPHome} noDamageExpIP={model.noDamageKExpIPHome} kWorkloadMode={model.kWorkloadMode} />
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <style dangerouslySetInnerHTML={{ __html: APP_CSS }} />
      <header className="topbar">
        <div>
          <div className="brand"><span style={{ color: "#2d6cdf" }}>CC</span> Baseball Model</div>
          <div className="subline">Slate {data.date || ""} · {games.length} games · {pitchers.length} pitchers · {data.sourceTables?.pitchTypeDamageRows || 0} pitch-type rows</div>
        </div>
        <div className={`status-pill ${live ? "live" : ""}`}>
          <span />
          {loadState}
        </div>
      </header>

      <main className="model-grid">
        <section className="panel slate-panel">
          <div className="panel-heading">
            <h2>Slate</h2>
            <Database size={18} aria-hidden="true" />
          </div>
          <div className="game-list">
            {games.map((game, index) => (
              <button
                className={`game-card ${index === selectedGameIndex ? "active" : ""}`}
                key={`${game.away}-${game.home}-${index}`}
                onClick={() => {
                  setSelectedGameIndex(index);
                  applyGame(game);
                }}
              >
                <span className="matchup">{game.away} @ {game.home}</span>
                <span>{game.awayStarter || "TBD"} vs {game.homeStarter || "TBD"}</span>
                <small>{game.status === "Final" && game.score ? `Final ${game.score.a}-${game.score.h}` : (game.time || game.status || "")}</small>
              </button>
            ))}
          </div>
        </section>

        <section className="panel controls-panel">
          <div className="panel-heading">
            <h2>Run Model</h2>
            <Activity size={18} aria-hidden="true" />
          </div>

          <div className="control-grid">
            <label>
              Away
              <select value={awayTeam} onChange={(event) => { setBookTeamTotalLines({ gameKey: "", away: null, home: null }); setAwayTeam(event.target.value); setAwayPitcher(firstArm(event.target.value)); }}>
                {teams.map((team) => <option key={team.abbr} value={team.abbr}>{team.abbr}</option>)}
              </select>
            </label>
            <label>
              Home
              <select value={homeTeam} onChange={(event) => { setBookTeamTotalLines({ gameKey: "", away: null, home: null }); setHomeTeam(event.target.value); setHomePitcher(firstArm(event.target.value)); }}>
                {teams.map((team) => <option key={team.abbr} value={team.abbr}>{team.abbr}</option>)}
              </select>
            </label>
            <label>
              Away SP ({awayTeam})
              <select value={awayPitcher} onChange={(event) => setAwayPitcher(event.target.value)}>
                {pitchers.filter((p) => p.team === awayTeam).map((pitcher) => <option key={pitcher.name} value={pitcher.name}>{pitcher.name}</option>)}
              </select>
            </label>
            <label>
              Home SP ({homeTeam})
              <select value={homePitcher} onChange={(event) => setHomePitcher(event.target.value)}>
                {pitchers.filter((p) => p.team === homeTeam).map((pitcher) => <option key={pitcher.name} value={pitcher.name}>{pitcher.name}</option>)}
              </select>
            </label>
            <label>
              {awayTeam} pen
              <select value={awayBullpen} onChange={(event) => setAwayBullpen(event.target.value)}>
                <option value="fresh">Fresh</option>
                <option value="normal">Normal</option>
                <option value="taxed">Taxed</option>
              </select>
            </label>
            <label>
              {homeTeam} pen
              <select value={homeBullpen} onChange={(event) => setHomeBullpen(event.target.value)}>
                <option value="fresh">Fresh</option>
                <option value="normal">Normal</option>
                <option value="taxed">Taxed</option>
              </select>
            </label>
            <label>
              Total
              <input type="number" step="0.5" value={totalLine} onChange={(event) => { setBookTeamTotalLines({ gameKey: "", away: null, home: null }); setTotalLine(event.target.value); }} />
            </label>
            <label>
              Home spread
              <input type="number" step="0.5" value={homeSpread} onChange={(event) => setHomeSpread(event.target.value)} />
            </label>
          </div>

          <div className="projection-strip">
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
          })() : null}
        </section>

        <section className="panel" style={{ borderColor: "#cfe0fb" }}>
          <div className="panel-heading"><h2>Recommendations · Live engine</h2><CircleDollarSign size={18} aria-hidden="true" /></div>
          <div style={{ padding: 14, display: "grid", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: 10, color: offlineProps ? (offlineProps.synthetic ? "#b45309" : "#11824a") : "#9aa6b4" }}>Props {propSourceLabel}{offlineProps ? ` (${offlineProps.count} props${offlineProps.date ? ", " + offlineProps.date : ""})` : ""}</span>
              <span style={{ fontSize: 10.5, color: "#8793a2" }}>{liveRecs.debug.number_of_live_markets} markets · {dispGroups.A.length} recommended</span>
            </div>

            <div style={{ background: "#0f1b30", color: "#fff", borderRadius: 8, padding: "12px 14px", display: "grid", gap: 6 }}>
              <div style={{ fontSize: 10.5, color: "#9fb3d6", fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.5 }}>Final prediction</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
                <strong style={{ fontSize: 20 }}>{awayTeam} {model.awayRuns.toFixed(1)} — {model.homeRuns.toFixed(1)} {homeTeam}</strong>
                <span style={{ fontSize: 13, color: "#cfe0fb" }}>
                  {(() => { const hp = model.markets.moneyline[1].probability; const fav = hp >= 0.5 ? homeTeam : awayTeam; const fp = Math.round((hp >= 0.5 ? hp : 1 - hp) * 100); const mar = Math.abs(model.homeRuns - model.awayRuns).toFixed(1); return `${fav} ${fp}% · by ${mar} · total ${(model.awayRuns + model.homeRuns).toFixed(1)}`; })()}
                </span>
              </div>
              {(() => { const top = dispGroups.A[0] || dispGroups.B[0]; return top
                ? <div style={{ fontSize: 12, color: "#bfe3cd" }}>Top play: <strong>{top.selection}</strong> {top.market}{top.odds != null ? ` ${formatOdds(top.odds)}` : ""} · {top.confidence}{top.suggested_units ? ` · ${top.suggested_units}u` : ""}</div>
                : <div style={{ fontSize: 12, color: "#9fb3d6" }}>No qualified play — projection only.</div>; })()}
            </div>

            {cal.manualOverrideActive ? (
              <div style={{ fontSize: 11, fontWeight: 800, color: "#9a3412", background: "#fff3ec", border: "1px solid #ffd2b3", borderRadius: 6, padding: "7px 10px" }}>
                ⚠ Manual calibration override active — dev/testing only{cal.notes ? ` (${cal.notes})` : ""}
              </div>
            ) : null}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 1, background: "#e7ecf1", borderRadius: 6, overflow: "hidden", border: "1px solid #e7ecf1" }}>
              <div style={calBox}><span style={calLbl}>{awayTeam} raw → adj</span><strong style={calVal}>{cal.rawAwayRuns.toFixed(2)} → {cal.calibratedAwayRuns.toFixed(2)}</strong></div>
              <div style={calBox}><span style={calLbl}>{homeTeam} raw → adj</span><strong style={calVal}>{cal.rawHomeRuns.toFixed(2)} → {cal.calibratedHomeRuns.toFixed(2)}</strong></div>
            </div>
            {(() => { const re = cal.runEnv || {}; const on = re.enabled && re.n >= 1; const wb = Number(re.weightedBias || 0); const pct = re.factor != null ? (re.factor - 1) * 100 : 0; return (
              <div style={{ border: "1px solid " + (on ? "#cfe0ff" : "#e7ecf1"), background: on ? "#f4f8ff" : "#fafbfc", borderRadius: 6, padding: "8px 10px", display: "grid", gap: 4 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: 0.4, color: on ? "#2d6cdf" : "#8793a2" }}>TEMP RUN ENVIRONMENT ADJUSTMENT</span>
                  <label style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#5e6b7c", cursor: "pointer" }}>
                    <input type="checkbox" checked={!!re.enabled} onChange={(e) => setRunEnvOn(e.target.checked)} style={{ margin: 0 }} />on
                  </label>
                </div>
                {on ? (
                  <div style={{ fontSize: 11, color: "#41506a" }}>Raw total <strong>{Number(re.rawTotal || 0).toFixed(1)}</strong> → adjusted <strong>{Number(re.adjTotal || 0).toFixed(1)}</strong> (×{Number(re.factor || 1).toFixed(3)}, {pct >= 0 ? "+" : ""}{pct.toFixed(1)}%{re.capped ? `, capped ±${Number(re.capPct || 8).toFixed(0)}%` : ""})</div>
                ) : (
                  <div style={{ fontSize: 11, color: "#8793a2" }}>Off — showing raw model total {Number(re.rawTotal || 0).toFixed(1)}.</div>
                )}
                {on && re.lowSample ? (
                  <div style={{ fontSize: 10.5, fontWeight: 800, color: "#9a3412", background: "#fff3ec", border: "1px solid #ffd2b3", borderRadius: 5, padding: "4px 7px" }}>⚠ LOW SAMPLE RUN ENV WARNING — {re.cleanN || 0} clean games (&lt;12); cap tightened to ±4%.</div>
                ) : null}
                <div style={{ fontSize: 10, color: "#8793a2" }}>Weighted bias {wb >= 0 ? "+" : ""}{wb.toFixed(2)} r/g · basis: last {re.n || 0} clean night{(re.n || 0) === 1 ? "" : "s"} ({re.cleanN || 0} games), Coors/blowouts excluded (0.50/0.30/0.20). Temporary slate overlay — not a baseline change.{cal.sideBiasApplied && (cal.sideBiasApplied.home || cal.sideBiasApplied.away) ? ` Side bias H ${cal.sideBiasApplied.home >= 0 ? "+" : ""}${cal.sideBiasApplied.home.toFixed(2)} / A ${cal.sideBiasApplied.away >= 0 ? "+" : ""}${cal.sideBiasApplied.away.toFixed(2)}.` : ""}</div>
              </div>
            ); })()}

            {(dispGroups.A.length + dispGroups.B.length) ? (
              [["A", "Recommended bets"], ["B", "Leans"]].map(([g, label]) => (
                dispGroups[g].length ? (
                  <div key={g} style={{ display: "grid", gap: 6 }}>
                    <div style={mkGrp}>{label} ({dispGroups[g].length})</div>
                    {dispGroups[g].map((r, i) => <RecRow key={r.market + r.selection + i} r={r} runEnv={cal.runEnv} />)}
                  </div>
                ) : null
              ))
            ) : (
              <div style={{ fontSize: 12.5, color: "#5e6b7c", padding: "10px 2px" }}>
                No qualified bets passed the confirmation gates.
                <div style={{ fontSize: 10.5, color: "#9aa6b4", marginTop: 4 }}>Some model edges may have been blocked by confirmation or context filters.</div>
              </div>
            )}

            <label style={{ flexDirection: "row", alignItems: "center", gap: 8, display: "flex", fontSize: 10.5, color: "#9aa6b4", cursor: "pointer", marginTop: 2 }}>
              <input type="checkbox" style={{ width: 15, height: 15, minHeight: 0 }} checked={showBlocked} onChange={(e) => setShowBlocked(e.target.checked)} />
              Show blocked model edges
            </label>
            {showBlocked ? (
              <div style={{ display: "grid", gap: 6, border: "1px dashed #d5dce5", borderRadius: 6, padding: 10, background: "#fbfcfd" }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: "#8793a2" }}>Blocked Model Edges — Debug Only</div>
                <div style={{ fontSize: 10, color: "#9aa6b4" }}>These had model edge but failed confirmation, context, or data-quality gates. They are not recommended bets.</div>
                {offlineProps ? (() => { const tj = offlineProps.recs.filter((r) => r.team_context_joined).length; const top = offlineProps.recs.find((r) => r.team_context_joined && r.tc_win_prob); return (
                  <div style={{ fontSize: 10, color: tj ? "#11824a" : "#9aa6b4" }}>
                    Team/game context: {tj ? `joined ${tj}/${offlineProps.count} props (source: team_game_pipeline)` : "not joined — proxy fallback"}
                    {top ? ` · e.g. win prob ${top.tc_win_prob}, run diff ${top.tc_run_diff}, run env ${top.tc_run_env}` : ""}
                  </div>); })() : null}
                {offlineProps ? (
                  <div style={{ fontSize: 10, color: "#9aa6b4" }}>
                    Pitcher-win target: official MLB decisions (historical label only). Slate rows are pregame — official labels unavailable, no leakage.
                  </div>) : null}
                {(dispGroups.C.length + dispGroups.D.length) ? (
                  [["C", "Hidden by confirmation filters"], ["D", "No edge — audit only"]].map(([g, label]) => (
                    dispGroups[g].length ? (
                      <div key={g} style={{ display: "grid", gap: 6 }}>
                        <div style={{ ...mkGrp, color: "#9aa6b4" }}>{label} ({dispGroups[g].length})</div>
                        {(g === "D" ? dispGroups[g].slice(0, 6) : dispGroups[g]).map((r, i) => <RecRow key={r.market + r.selection + i} r={r} runEnv={cal.runEnv} />)}
                      </div>
                    ) : null
                  ))
                ) : <div style={{ fontSize: 10.5, color: "#9aa6b4" }}>None.</div>}
              </div>
            ) : null}

            <details>
              <summary style={{ fontSize: 11, color: "#8793a2", cursor: "pointer" }}>Debug</summary>
              <pre style={{ fontSize: 10, color: "#667386", background: "#f8fafc", border: "1px solid #e7ecf1", borderRadius: 6, padding: 10, overflowX: "auto", whiteSpace: "pre-wrap" }}>{JSON.stringify(liveRecs.debug, null, 2)}</pre>
            </details>
          </div>
        </section>

        <section className="panel">
          <div className="panel-heading"><h2>Pick Export</h2><Database size={18} aria-hidden="true" /></div>
          <div style={{ padding: 14, display: "grid", gap: 10 }}>
            <div style={{ fontSize: 12, color: "#5e6b7c" }}>Captures the exact surfaced picks the engine produces, per game, and <strong>saves them durably</strong> — reloading or moving to a new slate no longer loses anything. Navigating a game captures it; open each game you want graded.</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: 11.5, color: "#5e6b7c", fontWeight: 700 }}>Export date</span>
              <select value={effExportDate} onChange={(e) => setExportDate(e.target.value)} style={{ height: 30, padding: "0 8px", borderRadius: 6, border: "1px solid #d4dbe4", fontSize: 12.5 }}>
                {(availableDates.includes(data.date) ? availableDates : [data.date, ...availableDates]).map((d) => (
                  <option key={d} value={d}>{d}{d === data.date ? " (today)" : ""}</option>
                ))}
              </select>
              <span style={{ fontSize: 10.5, color: "#8793a2" }}>{availableDates.length} saved slate{availableDates.length === 1 ? "" : "s"}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
              <div style={{ fontSize: 12.5, fontWeight: 800, color: capturedForDate.length ? "#11824a" : "#9a6a1a" }}>
                {capturedForDate.length} game{capturedForDate.length === 1 ? "" : "s"} captured for {effExportDate} · {capturedPickCount} picks
              </div>
              <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, color: "#5e6b7c", cursor: "pointer" }}>
                <input type="checkbox" checked={exportAllProj} onChange={(e) => setExportAllProj(e.target.checked)} style={{ margin: 0 }} />
                export_all_projections
              </label>
            </div>
            {effExportDate === data.date && capturedForDate.length < games.length ? (
              <div style={{ fontSize: 10.5, color: "#9a6a1a", background: "#fff8ec", border: "1px solid #f2dcae", borderRadius: 5, padding: "5px 8px" }}>
                {games.length - capturedForDate.length} game{games.length - capturedForDate.length === 1 ? "" : "s"} not yet opened today — open each game you're betting so it's captured. The grader flags anything missing, never drops.
              </div>
            ) : null}
            <button onClick={exportSlate} disabled={!capturedForDate.length} style={{ height: 38, padding: "0 14px", borderRadius: 6, background: capturedForDate.length ? "#18212f" : "#c7ced8", color: "#fff", fontWeight: 800 }}>
              Build export — diamond_picks_{effExportDate}.json
            </button>
            {exportJson ? (
              <div style={{ display: "grid", gap: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <button onClick={copyExport} style={{ height: 32, padding: "0 12px", borderRadius: 6, background: "#2d6cdf", color: "#fff", fontWeight: 800, fontSize: 12 }}>Copy JSON</button>
                  <span style={{ fontSize: 11, color: "#11824a", fontWeight: 700 }}>{exportCopied}</span>
                  <span style={{ fontSize: 10.5, color: "#8793a2" }}>tap the box to select all · a file download is also attempted</span>
                </div>
                <textarea id="export-json-ta" readOnly value={exportJson} onFocus={(e) => e.target.select()} onClick={(e) => e.target.select()} style={{ width: "100%", minHeight: 130, resize: "vertical", fontFamily: "ui-monospace, monospace", fontSize: 10.5, lineHeight: 1.4, padding: 8, border: "1px solid #d4dbe4", borderRadius: 6, background: "#fafbfc", color: "#243044", whiteSpace: "pre" }} />
              </div>
            ) : null}
            <div style={{ fontSize: 10, color: "#8793a2" }}>Copy the JSON above (the sandbox blocks silent downloads). Surfaced picks only (recommended + leans + first-inning angles){exportAllProj ? " + all projections" : ""}. Export never changes recommendations; grading never updates the model. <code>cap_fired</code> exports as null.</div>
          </div>
        </section>
        {modelDaily && modelBlock ? (
          <section className="panel" style={{ opacity: 0.85 }}>
            <div className="panel-heading"><h2 style={{ fontSize: 13, color: "#8793a2" }}>Offline Pipeline Snapshot</h2><Database size={16} aria-hidden="true" /></div>
            <div style={{ padding: 12, display: "grid", gap: 6 }}>
              <div style={{ fontSize: 10.5, color: "#8793a2" }}>Source: Offline pipeline snapshot{modelDaily.synthetic ? " (synthetic demo feed)" : ""}. Secondary reference — not the live bet surface.</div>
              {modelBlock.recs.slice(0, 4).map((r, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, color: "#667386" }}>
                  <span>{r.selection} <span style={{ color: "#9aa6b4" }}>{r.market.replace(/_/g, " ")}</span></span>
                  <span>{r.edge > 0 ? "+" : ""}{r.edge}pp · {r.confidence}</span>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {(() => { const syn = matchupSynthesis(model, awayTeam, homeTeam); if (!syn) return null; return (
          <section className="panel">
            <div className="panel-heading"><h2>Matchup Synthesis</h2><Activity size={18} aria-hidden="true" /></div>
            <div style={{ padding: 14, display: "grid", gap: 8 }}>
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.55, color: "#243044" }}>{syn.lines.join(" ")}</p>
              <div style={{ marginTop: 2, padding: "8px 10px", borderRadius: 6, background: "#f2f7ff", border: "1px solid #cfe0ff", fontSize: 12.5 }}>
                <strong style={{ color: "#2d6cdf", letterSpacing: 0.3 }}>EDGE → </strong><strong>{syn.verdict}</strong>
              </div>
              <div style={{ fontSize: 10, color: "#8793a2" }}>Auto-generated from the model's own signals (lean, arm edge, arsenal matchups, soft spots, K targets, prop angles) — not a separate projection.</div>
            </div>
          </section>
        ); })()}

        <section className="panel">
          <div className="panel-heading"><h2>Pitcher Matchup</h2><Activity size={18} aria-hidden="true" /></div>
          <div className="matchup-cards">
            <PitcherCard arm={model.awayArm} team={awayTeam} projK={model.projKAwayBaseline ?? model.projKAway} projOuts={model.projOutsAway} expIP={model.expIPAway} pitchRef={pitchRef} rawK={model.rawKAway} adjK={model.adjKAway} oppK={model.oppKAway} oppAbbr={homeTeam} />
            <div className="vs">vs</div>
            <PitcherCard arm={model.homeArm} team={homeTeam} projK={model.projKHomeBaseline ?? model.projKHome} projOuts={model.projOutsHome} expIP={model.expIPHome} pitchRef={pitchRef} rawK={model.rawKHome} adjK={model.adjKHome} oppK={model.oppKHome} oppAbbr={awayTeam} />
          </div>
        </section>

        <section className="panel">
          <div className="panel-heading"><h2>Run Construction</h2><RefreshCcw size={18} aria-hidden="true" /></div>
          <div style={{ padding: 14, display: "grid", gap: 14 }}>
            <RunBar team={awayTeam} parts={model.awayParts} total={model.awayRuns} status={homeBullpen} />
            <RunBar team={homeTeam} parts={model.homeParts} total={model.homeRuns} status={awayBullpen} />
            <div style={{ fontSize: 10.5, color: "#8793a2" }}>Each team's runs = vs opposing starter (xERA × matchup over ~IP) + vs bullpen (penERA × status), with team R/G and park applied.</div>
          </div>
        </section>

        <section className="panel">
          <div className="panel-heading"><h2>Matchup Edges</h2><Activity size={18} aria-hidden="true" /></div>
          <div style={{ padding: 14, display: "grid", gap: 12 }}>
            <SoftSpotBlock label={`${awayTeam} bats vs ${model.homeArm?.name || "SP"}`} match={model.awayMatch} soft={model.awaySoft} />
            <SoftSpotBlock label={`${homeTeam} bats vs ${model.awayArm?.name || "SP"}`} match={model.homeMatch} soft={model.homeSoft} />
            <div style={{ fontSize: 10.5, color: "#8793a2" }}>Pitch-type matchup = arsenal usage × the lineup's run value per pitch vs league baseline; the multiplier weights the run model. Soft spot = lineup ranks top-8 vs a pitch the starter leans on (hitter = that lineup's biggest threat on it). Exploit = lineup ranks bottom-8 vs a pitch he throws. K target = a lineup's featured bat with a high whiff rate (≥30%) on a pitch the starter throws ≥10% — drawn from the per-pitch featured-hitter sample, not a full-roster whiff scan.</div>
          </div>
        </section>

        <section className="panel markets-panel">
          <div className="panel-heading">
            <h2>Markets</h2>
            <CircleDollarSign size={18} aria-hidden="true" />
          </div>
          <div className="odds-tools">
            <input
              type="password"
              value={oddsKey}
              onChange={(event) => setOddsKey(event.target.value)}
              placeholder="Odds API key"
              autoComplete="off"
              aria-label="Odds API key"
            />
            <button type="button" onClick={fetchOdds}>Fetch odds</button>
            <span style={{ whiteSpace: "normal" }}>{oddsMessage || "Type prices manually or fetch from The Odds API."}</span>
          </div>

          <div className="market-table">
            <div className="market-head"><span>Market</span><span>Fair</span><span>Book</span><span>Bet</span></div>
            <div style={mkGrp}>Full Game</div>
            {model.markets.moneyline.map((item) => <MarketRow key={item.label} item={item} marketOdds={marketOdds} setOdd={setOdd} />)}
            {model.markets.runline.map((item) => <MarketRow key={item.label} item={item} marketOdds={marketOdds} setOdd={setOdd} />)}
            {model.markets.totals.map((item) => <MarketRow key={item.label} item={item} marketOdds={marketOdds} setOdd={setOdd} />)}
            {teamTotalMarketRows.map((item) => <MarketRow key={item.key} item={item} marketOdds={marketOdds} setOdd={setOdd} />)}
            <div style={mkGrp}>First 5</div>
            {model.f5Rows.map((item) => <MarketRow key={item.label} item={item} marketOdds={marketOdds} setOdd={setOdd} />)}
            <div style={mkGrp}>Pitcher</div>
            {model.pitcherWin.filter((item) => !item.suppressed).map((item) => <MarketRow key={item.label} item={item} marketOdds={marketOdds} setOdd={setOdd} />)}
            <div style={mkGrp}>First Inning</div>
            {(() => { const fi = (model.angles || []).find((a) => a.market === "First inning"); if (!fi) return (
              <div style={{ fontSize: 10.5, color: "#8793a2", padding: "2px 0 6px" }}>No first-inning angle clears the gate (needs ≥65% and ≥5% edge). Reference odds below.</div>
            ); const act = fi.actionable !== false; return (
              <div style={{ fontSize: 10.5, fontWeight: 800, padding: "2px 0 6px", color: act ? "#11824a" : "#9a6a1a" }}>
                {act ? `${fi.label} actionable · ${(fi.probability * 100).toFixed(0)}%` : `YRFI WATCH — not actionable · ${(fi.probability * 100).toFixed(0)}% (needs ≥65% & ≥5% edge). Reference only.`}
              </div>
            ); })()}
            {model.firstInning.map((item) => <MarketRow key={item.label} item={item} marketOdds={marketOdds} setOdd={setOdd} />)}
          </div>
        </section>

        <section className="panel">
          <div className="panel-heading"><h2>Alt Markets</h2><CircleDollarSign size={18} aria-hidden="true" /></div>
          <div style={{ padding: 14, display: "grid", gap: 16 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: "#5e6b7c" }}>Alt total</span>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <button onClick={() => setAltTotal((v) => Math.max(3, r2(Number(v) - 0.5)))} style={stepBtn}>−</button>
                  <strong style={{ minWidth: 40, textAlign: "center", fontVariantNumeric: "tabular-nums" }}>{Number(altTotal).toFixed(1)}</strong>
                  <button onClick={() => setAltTotal((v) => r2(Number(v) + 0.5))} style={stepBtn}>+</button>
                  <button onClick={() => setAltTotal(r2(Math.round((model.awayRuns + model.homeRuns) * 2) / 2))} style={snapBtn} title="snap to projection">snap</button>
                </div>
              </div>
              <div className="market-table" style={{ padding: 0 }}>
                <div className="market-head"><span>Market</span><span>Fair</span><span>Book</span><span>Bet</span></div>
                {(() => { const at = altOver(Number(altTotal)); return [
                  { label: `Over ${Number(altTotal).toFixed(1)}`, probability: at.over, odds: americanOdds(at.over), key: "altOver" },
                  { label: `Under ${Number(altTotal).toFixed(1)}`, probability: at.under, odds: americanOdds(at.under), key: "altUnder" }
                ].map((item) => <MarketRow key={item.key} item={item} marketOdds={marketOdds} setOdd={setOdd} />); })()}
              </div>
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: "#5e6b7c" }}>Alt run line</span>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <button onClick={() => setAltRLflip((v) => !v)} style={{ height: 26, padding: "0 9px", borderRadius: 6, border: "1px solid #d4dbe4", background: altRLflip ? "#eef4ff" : "#fff", color: altRLflip ? "#2d6cdf" : "#5e6b7c", fontSize: 11, fontWeight: 800, cursor: "pointer" }}>flip</button>
                  <button onClick={() => setAltRL((v) => Math.max(0.5, r2(Number(v) - 1)))} style={stepBtn}>−</button>
                  <strong style={{ minWidth: 40, textAlign: "center", fontVariantNumeric: "tabular-nums" }}>{Number(altRL).toFixed(1)}</strong>
                  <button onClick={() => setAltRL((v) => r2(Number(v) + 1))} style={stepBtn}>+</button>
                </div>
              </div>
              <div className="market-table" style={{ padding: 0 }}>
                <div className="market-head"><span>Market</span><span>Fair</span><span>Book</span><span>Bet</span></div>
                {(() => { const ar = altRun(Number(altRL)); const L = Number(altRL).toFixed(1); const homeFav = ar.homeLay >= ar.awayLay;
                  const favLay = homeFav ? { label: `${homeTeam} -${L}`, probability: ar.homeLay, key: "altHomeLay" } : { label: `${awayTeam} -${L}`, probability: ar.awayLay, key: "altAwayLay" };
                  const dogGet = homeFav ? { label: `${awayTeam} +${L}`, probability: ar.awayGet, key: "altAwayGet" } : { label: `${homeTeam} +${L}`, probability: ar.homeGet, key: "altHomeGet" };
                  const dogLay = homeFav ? { label: `${awayTeam} -${L}`, probability: ar.awayLay, key: "altAwayLay" } : { label: `${homeTeam} -${L}`, probability: ar.homeLay, key: "altHomeLay" };
                  const favGet = homeFav ? { label: `${homeTeam} +${L}`, probability: ar.homeGet, key: "altHomeGet" } : { label: `${awayTeam} +${L}`, probability: ar.awayGet, key: "altAwayGet" };
                  const rows = altRLflip ? [dogLay, favGet] : [favLay, dogGet];
                  return rows.map((item) => <MarketRow key={item.key} item={{ ...item, odds: americanOdds(item.probability) }} marketOdds={marketOdds} setOdd={setOdd} />); })()}
              </div>
            </div>
          </div>
        </section>

        <section className="panel">
          <div className="panel-heading"><h2>Results &amp; Calibration</h2><RefreshCcw size={18} aria-hidden="true" /></div>
          <div style={{ padding: 14, display: "grid", gap: 12 }}>
            <div style={{ fontSize: 11, color: "#667386" }}>Log a final score for {awayTeam}@{homeTeam}. Logged finals learn a total bias that nudges every projection.</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 8, alignItems: "end" }}>
              <label>{awayTeam} runs<input type="number" min="0" value={actualAway} onChange={(e) => setActualAway(e.target.value)} /></label>
              <label>{homeTeam} runs<input type="number" min="0" value={actualHome} onChange={(e) => setActualHome(e.target.value)} /></label>
              <button onClick={logResult} style={{ height: 38, padding: "0 14px", borderRadius: 6, background: "#18212f", color: "#fff", fontWeight: 800 }}>Log</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: "#e7ecf1", borderRadius: 6, overflow: "hidden", border: "1px solid #e7ecf1" }}>
              <div style={calBox}><span style={calLbl}>Games logged</span><strong style={calVal}>{calib.n}</strong></div>
              <div style={calBox}><span style={calLbl}>Learned bias (all logged, ref)</span><strong style={{ ...calVal, color: calib.totalBias >= 0 ? "#11824a" : "#b24040" }}>{calib.totalBias >= 0 ? "+" : ""}{calib.totalBias.toFixed(2)}</strong></div>
              <div style={calBox}><span style={calLbl}>Win cal pred/act</span><strong style={calVal}>{calib.n ? `${Math.round(calib.winPred * 100)}/${Math.round(calib.winAct * 100)}%` : "—"}</strong></div>
            </div>
            {calib.n ? <div style={{ fontSize: 10.5, color: "#8793a2" }}>Applied bias = raw bias shrunk by sample (n/(n+5)) and clamped ±2.0 runs, split across both teams. Raw {calib.rawTotal >= 0 ? "+" : ""}{calib.rawTotal.toFixed(2)} over {calib.n} games.</div> : null}

            <div style={{ borderTop: "1px solid #eef1f5", paddingTop: 10, display: "grid", gap: 8 }}>
              <label style={{ flexDirection: "row", alignItems: "center", gap: 8, display: "flex", fontSize: 11.5, color: cal.manualOverrideActive ? "#9a3412" : "#5e6b7c" }}>
                <input type="checkbox" style={{ width: 16, height: 16, minHeight: 0 }} checked={manualCalib.enabled} onChange={(e) => setManualCalib((m) => ({ ...m, enabled: e.target.checked }))} />
                Manual calibration override (dev/testing only)
              </label>
              {manualCalib.enabled ? (
                <>
                  <div style={{ fontSize: 10.5, fontWeight: 800, color: "#9a3412" }}>⚠ Override active — projections, fair odds, EVs and recs use these values, not learned bias.</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                    <label style={{ fontSize: 11 }}>Total bias<input type="number" step="0.1" value={manualCalib.totalBias} onChange={(e) => setManualCalib((m) => ({ ...m, totalBias: e.target.value }))} /></label>
                    <label style={{ fontSize: 11 }}>Home bias<input type="number" step="0.1" value={manualCalib.homeBias} onChange={(e) => setManualCalib((m) => ({ ...m, homeBias: e.target.value }))} /></label>
                    <label style={{ fontSize: 11 }}>Away bias<input type="number" step="0.1" value={manualCalib.awayBias} onChange={(e) => setManualCalib((m) => ({ ...m, awayBias: e.target.value }))} /></label>
                  </div>
                  <label style={{ fontSize: 11 }}>Notes<input type="text" value={manualCalib.notes} onChange={(e) => setManualCalib((m) => ({ ...m, notes: e.target.value }))} placeholder="why this override is on" /></label>
                </>
              ) : null}
            </div>
            {results.length ? (
              <div style={{ display: "grid", gap: 0, maxHeight: 150, overflowY: "auto" }}>
                {results.slice().reverse().slice(0, 12).map((r, i) => {
                  const at = r.actualAway + r.actualHome, pt = r.projAway + r.projHome;
                  return (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#667386", padding: "4px 2px", borderBottom: "1px solid #f0f3f6" }}>
                      <span>{r.away}@{r.home} {r.date}</span>
                      <span>act {at} vs proj {pt.toFixed(1)} <strong style={{ color: at - pt >= 0 ? "#11824a" : "#b24040" }}>({at - pt >= 0 ? "+" : ""}{(at - pt).toFixed(1)})</strong></span>
                    </div>
                  );
                })}
              </div>
            ) : null}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 10, color: "#9aa6b4" }}>{typeof window !== "undefined" && window.storage ? "Saved across sessions." : "Session-only on this host."}</span>
              {results.length ? <button onClick={resetResults} style={{ height: 28, padding: "0 10px", borderRadius: 6, border: "1px solid #e3b4b4", background: "#fdf2f2", color: "#b24040", fontWeight: 800, fontSize: 11 }}>Reset</button> : null}
            </div>
          </div>
        </section>

        <section className="panel">
          <div className="panel-heading"><h2>Strikeout Props</h2><CircleDollarSign size={18} aria-hidden="true" /></div>
          <div style={{ padding: 14, display: "grid", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap", border: "1px solid #e1e7ee", borderRadius: 8, padding: "8px 10px", background: "#fbfcfd" }}>
              <div>
                <strong style={{ fontSize: 12.5 }}>K workload</strong>
                <div style={{ color: "#667386", fontSize: 10.5, marginTop: 2 }}>Scenario affects strikeout props only. Runs, pitcher outs, and win markets stay baseline.</div>
              </div>
              <div style={{ display: "inline-flex", border: "1px solid #cfd8e3", borderRadius: 7, overflow: "hidden" }}>
                {[
                  ["baseline", "Baseline"],
                  ["no_damage", "No damage IP penalty"]
                ].map(([mode, label]) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setKWorkloadMode(mode)}
                    style={{
                      height: 30,
                      padding: "0 10px",
                      borderRadius: 0,
                      background: kWorkloadMode === mode ? "#2d6cdf" : "#fff",
                      color: kWorkloadMode === mode ? "#fff" : "#243044",
                      fontSize: 11.5,
                      fontWeight: 800
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <KProp arm={model.awayArm} projK={model.projKAway} line={kLineAway} setLine={setKLineAway} oddsKey="kAway" marketOdds={marketOdds} setOdd={setOdd} mech={model.chaseAway} oppTeam={teams.find((t) => t.abbr === homeTeam)} oppAbbr={homeTeam} rawK={model.rawKAway} adjK={model.adjKAway} kConv={model.kConvAway} finalK={model.finalKAway} bf={model.bfAway} kExpIP={model.kExpIPAway} baselineProjK={model.projKAwayBaseline} noDamageProjK={model.projKAwayNoDamage} baselineExpIP={model.baselineKExpIPAway} noDamageExpIP={model.noDamageKExpIPAway} kWorkloadMode={model.kWorkloadMode} />
            <KProp arm={model.homeArm} projK={model.projKHome} line={kLineHome} setLine={setKLineHome} oddsKey="kHome" marketOdds={marketOdds} setOdd={setOdd} mech={model.chaseHome} oppTeam={teams.find((t) => t.abbr === awayTeam)} oppAbbr={awayTeam} rawK={model.rawKHome} adjK={model.adjKHome} kConv={model.kConvHome} finalK={model.finalKHome} bf={model.bfHome} kExpIP={model.kExpIPHome} baselineProjK={model.projKHomeBaseline} noDamageProjK={model.projKHomeNoDamage} baselineExpIP={model.baselineKExpIPHome} noDamageExpIP={model.noDamageKExpIPHome} kWorkloadMode={model.kWorkloadMode} />
            <div style={{ fontSize: 10.5, color: "#8793a2" }}>Proj K = K% × expected batters faced (~4.3/inning). Opponent-adjusted (Log5). Fair price from negative binomial(proj K). Most accurate with a real K% loaded.</div>
          </div>
        </section>

        <section className="panel chart-panel">
          <div className="panel-heading">
            <h2>Run Distribution</h2>
            <RefreshCcw size={18} aria-hidden="true" />
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={model.totalDistribution}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="runs" tickLine={false} axisLine={false} />
              <YAxis tickFormatter={(value) => `${Math.round(value * 100)}%`} tickLine={false} axisLine={false} width={42} />
              <Tooltip formatter={(value) => `${(value * 100).toFixed(1)}%`} />
              <Bar dataKey="probability" fill="#2d6cdf" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </section>

        <section className="panel angles-panel">
          <div className="panel-heading">
            <h2>Player Angles</h2>
            <Activity size={18} aria-hidden="true" />
          </div>
          <div style={{ padding: "12px 14px", display: "grid", gap: 10 }}>
            {[{ team: awayTeam, vs: model.homeArm?.name, list: model.awayPlayerAngles },
              { team: homeTeam, vs: model.awayArm?.name, list: model.homePlayerAngles }].map((grp) => {
              const list = showBlocked ? grp.list : grp.list.filter((a) => visibleHitters.has(a.hitter));
              return (
              <div key={grp.team}>
                <div style={{ fontSize: 10.5, color: "#8793a2", fontWeight: 800, marginBottom: 4 }}>{grp.team} bats vs {grp.vs || "SP"}</div>
                {list.length ? list.map((a) => (
                  <div key={a.hitter} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 10px", marginBottom: 4, borderRadius: 6, background: "#f6faf7", border: "1px solid #dbeee1" }}>
                    <span style={{ fontSize: 12.5 }}><strong>{a.hitter}</strong> <span style={{ color: "#11824a", fontWeight: 700 }}>{a.type}</span></span>
                    <span style={{ fontSize: 10.5, color: "#667386" }}>{a.pitch} {a.u}%{a.brl != null ? ` · ${Math.round(a.brl * 100)}% brl` : ""}</span>
                  </div>
                )) : <div style={{ fontSize: 11.5, color: "#8793a2" }}>No hitter prop cleared the gate</div>}
              </div>
              );
            })}
          </div>
        </section>

        <section className="panel">
          <div className="panel-heading">
            <h2>Value Plays</h2>
            <CircleDollarSign size={18} aria-hidden="true" />
          </div>
          <div style={{ padding: "12px 14px", display: "grid", gap: 8 }}>
            {dispGroups.A.length ? dispGroups.A.map((v, i) => (
              <div key={v.market + v.selection + i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px", borderRadius: 6, background: "#eef6ff", border: "1px solid #cfe2fb" }}>
                <span style={{ fontSize: 12.5 }}><strong>{v.selection}</strong> <span style={{ color: "#667386" }}>{v.market} {formatOdds(v.odds)}</span></span>
                <span style={{ fontSize: 12.5, fontWeight: 800, color: "#11824a" }}>{v.suggested_units}u</span>
              </div>
            )) : <div style={{ fontSize: 11.5, color: "#8793a2" }}>Enter book lines in the Markets table — any market that clears the gate at a +EV price lands here from the live engine (eighth-Kelly stake).</div>}
          </div>
        </section>
      </main>
    </div>
  );
}
