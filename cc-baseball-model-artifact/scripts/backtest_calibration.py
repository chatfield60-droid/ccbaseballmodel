#!/usr/bin/env python3
"""Build a calibration report from graded betting-model outputs.

Input is intentionally simple JSON so exported picks can be graded elsewhere and
fed back without changing the model. Expected records live at
data/graded_bets.json by default and may include:

  market, probability, book_odds, closing_odds, result

`result` should be 1 for win, 0 for loss, and 0.5 for push/half outcomes.
"""

from __future__ import annotations

import argparse
import json
import math
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Build betting calibration report.")
    parser.add_argument("--input", default="data/graded_bets.json")
    parser.add_argument("--output", default="data/backtest_calibration.json")
    return parser.parse_args()


def finite(value):
    try:
        number = float(value)
    except (TypeError, ValueError):
        return None
    return number if math.isfinite(number) else None


def american_profit(odds):
    odds = finite(odds)
    if odds is None:
        return None
    return odds / 100 if odds > 0 else 100 / abs(odds)


def grade_records(records):
    clean = []
    for row in records:
        probability = finite(row.get("probability") or row.get("model_probability"))
        result = finite(row.get("result"))
        book_odds = finite(row.get("book_odds"))
        closing_odds = finite(row.get("closing_odds"))
        if probability is None or result is None:
            continue
        if not 0 <= probability <= 1 or not 0 <= result <= 1:
            continue
        profit = None
        if book_odds is not None:
            win_profit = american_profit(book_odds)
            if win_profit is not None:
                profit = result * win_profit - (1 - result)
        clean.append(
            {
                "market": row.get("market") or "unknown",
                "probability": probability,
                "result": result,
                "book_odds": book_odds,
                "closing_odds": closing_odds,
                "profit_units": profit,
            }
        )
    return clean


def summarize(rows):
    if not rows:
        return None
    n = len(rows)
    avg_prob = sum(r["probability"] for r in rows) / n
    win_rate = sum(r["result"] for r in rows) / n
    brier = sum((r["probability"] - r["result"]) ** 2 for r in rows) / n
    profit_rows = [r for r in rows if r["profit_units"] is not None]
    roi = None
    if profit_rows:
        roi = sum(r["profit_units"] for r in profit_rows) / len(profit_rows)
    return {
        "bets": n,
        "avg_model_probability": round(avg_prob, 6),
        "actual_win_rate": round(win_rate, 6),
        "calibration_error": round(win_rate - avg_prob, 6),
        "brier_score": round(brier, 6),
        "roi_per_1u": round(roi, 6) if roi is not None else None,
    }


def probability_bins(rows):
    bins = defaultdict(list)
    for row in rows:
        lo = math.floor(row["probability"] * 10) / 10
        hi = min(lo + 0.1, 1.0)
        bins[f"{lo:.1f}-{hi:.1f}"].append(row)
    return {key: summarize(value) for key, value in sorted(bins.items())}


def main() -> None:
    args = parse_args()
    in_path = ROOT / args.input
    out_path = ROOT / args.output
    generated_at = datetime.now(timezone.utc).replace(microsecond=0).isoformat()

    if not in_path.exists():
        report = {
            "generated_at": generated_at,
            "status": "no_graded_bets_available",
            "input": str(in_path.relative_to(ROOT)),
            "required_fields": ["market", "probability", "result"],
            "optional_fields": ["book_odds", "closing_odds"],
            "note": "No calibration was estimated because no graded bets file exists.",
        }
    else:
        records = json.loads(in_path.read_text(encoding="utf-8"))
        if isinstance(records, dict):
            records = records.get("bets") or records.get("records") or []
        rows = grade_records(records)
        by_market = defaultdict(list)
        for row in rows:
            by_market[row["market"]].append(row)
        report = {
            "generated_at": generated_at,
            "status": "ok" if rows else "no_usable_graded_bets",
            "input": str(in_path.relative_to(ROOT)),
            "overall": summarize(rows),
            "by_market": {market: summarize(items) for market, items in sorted(by_market.items())},
            "probability_bins": probability_bins(rows),
        }

    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
