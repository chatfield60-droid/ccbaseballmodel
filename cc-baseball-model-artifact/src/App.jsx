import React, { useMemo, useState } from "react";
const BOARD = {
  "date": "2026-07-11",
  "generated": "2026-07-11T12:24:23+00:00",
  "games": [
    {
      "id": 823357,
      "away": "MIL",
      "home": "PIT",
      "away_name": "Milwaukee Brewers",
      "home_name": "Pittsburgh Pirates",
      "away_starter": "Brandon Sproat",
      "home_starter": "Braxton Ashcraft",
      "status": "Pre-Game",
      "time": "12:05 PM ET",
      "day_night": "day",
      "away_score": 4.8,
      "home_score": 4.6,
      "total": 9.4,
      "home_win_probability": 0.46,
      "moneyline_fairs": {
        "away_probability": 0.54,
        "home_probability": 0.46,
        "away_fair": -117,
        "home_fair": 117
      },
      "team_total_fairs": {
        "away": 4.8,
        "home": 4.6
      },
      "f5": {
        "away_score": 2.5,
        "home_score": 2.3,
        "total": 4.8,
        "home_win_probability": 0.448,
        "away_fair": -123,
        "home_fair": 123
      },
      "synthesis": "The board sees a balanced run environment. Neither side has a meaningful projected scoring edge.",
      "k_targets": [
        {
          "batter": "Esmerlyn Valdez",
          "team": "PIT",
          "pitcher": "Brandon Sproat",
          "pitch_type": "FF",
          "pitch_name": "4-Seam Fastball",
          "usage": 21.6,
          "whiff_rate": 0.423,
          "chase_rate": 0.281,
          "label": "Strong K target",
          "explainer": "Esmerlyn Valdez has a high whiff profile against 4-Seam Fastball; Brandon Sproat throws it 22% of the time."
        },
        {
          "batter": "Bryan Reynolds",
          "team": "PIT",
          "pitcher": "Brandon Sproat",
          "pitch_type": "CU",
          "pitch_name": "Curveball",
          "usage": 10.8,
          "whiff_rate": 0.419,
          "chase_rate": 0.307,
          "label": "Strong K target",
          "explainer": "Bryan Reynolds has a high whiff profile against Curveball; Brandon Sproat throws it 11% of the time."
        }
      ],
      "prop_angles": [
        {
          "player": "Brandon Sproat",
          "market": "Pitcher strikeouts",
          "side": "Over",
          "line": 6.5,
          "projected": 6.4,
          "base_projected": 5.8,
          "fair": 113,
          "under_fair": -113,
          "base_fair": 186,
          "base_under_fair": -186,
          "book": null,
          "play_to": 123,
          "under_play_to": -103,
          "base_play_to": 196,
          "base_under_play_to": -176,
          "designation": "Watch price",
          "explainer": "Sharp-pitcher K view: uses projected K rate, expected workload, and a modest command/workload bump. This affects K props only, not score or team-total forecasts."
        },
        {
          "player": "Braxton Ashcraft",
          "market": "Pitcher strikeouts",
          "side": "Over",
          "line": 7.5,
          "projected": 7.9,
          "base_projected": 7.3,
          "fair": -140,
          "under_fair": 140,
          "base_fair": 121,
          "base_under_fair": -121,
          "book": null,
          "play_to": -130,
          "under_play_to": 150,
          "base_play_to": 131,
          "base_under_play_to": -111,
          "designation": "Watch price",
          "explainer": "Sharp-pitcher K view: uses projected K rate, expected workload, and a modest command/workload bump. This affects K props only, not score or team-total forecasts."
        }
      ]
    },
    {
      "id": 823356,
      "away": "MIL",
      "home": "PIT",
      "away_name": "Milwaukee Brewers",
      "home_name": "Pittsburgh Pirates",
      "away_starter": "Shane Drohan",
      "home_starter": "Bubba Chandler",
      "status": "Scheduled",
      "time": "4:05 PM ET",
      "day_night": "day",
      "away_score": 4.4,
      "home_score": 5.0,
      "total": 9.4,
      "home_win_probability": 0.618,
      "moneyline_fairs": {
        "away_probability": 0.382,
        "home_probability": 0.618,
        "away_fair": 162,
        "home_fair": -162
      },
      "team_total_fairs": {
        "away": 4.4,
        "home": 5.0
      },
      "f5": {
        "away_score": 2.2,
        "home_score": 2.5,
        "total": 4.7,
        "home_win_probability": 0.578,
        "away_fair": 137,
        "home_fair": -137
      },
      "synthesis": "The board sees a higher-scoring game script. PIT has the clearer projected scoring path.",
      "k_targets": [
        {
          "batter": "Esmerlyn Valdez",
          "team": "PIT",
          "pitcher": "Shane Drohan",
          "pitch_type": "FF",
          "pitch_name": "4-Seam Fastball",
          "usage": 28.6,
          "whiff_rate": 0.423,
          "chase_rate": 0.281,
          "label": "Strong K target",
          "explainer": "Esmerlyn Valdez has a high whiff profile against 4-Seam Fastball; Shane Drohan throws it 29% of the time."
        },
        {
          "batter": "Brandon Lowe",
          "team": "PIT",
          "pitcher": "Shane Drohan",
          "pitch_type": "SL",
          "pitch_name": "Slider",
          "usage": 20.7,
          "whiff_rate": 0.379,
          "chase_rate": 0.467,
          "label": "K target",
          "explainer": "Brandon Lowe has a high whiff profile against Slider; Shane Drohan throws it 21% of the time."
        },
        {
          "batter": "Bryan Reynolds",
          "team": "PIT",
          "pitcher": "Shane Drohan",
          "pitch_type": "CU",
          "pitch_name": "Curveball",
          "usage": 13.3,
          "whiff_rate": 0.419,
          "chase_rate": 0.307,
          "label": "Strong K target",
          "explainer": "Bryan Reynolds has a high whiff profile against Curveball; Shane Drohan throws it 13% of the time."
        }
      ],
      "prop_angles": [
        {
          "player": "Shane Drohan",
          "market": "Pitcher strikeouts",
          "side": "Over",
          "line": 5.5,
          "projected": 5.4,
          "base_projected": 4.8,
          "fair": 105,
          "under_fair": -105,
          "base_fair": 182,
          "base_under_fair": -182,
          "book": null,
          "play_to": 115,
          "under_play_to": -95,
          "base_play_to": 192,
          "base_under_play_to": -172,
          "designation": "Watch price",
          "explainer": "Sharp-pitcher K view: uses projected K rate, expected workload, and a modest command/workload bump. This affects K props only, not score or team-total forecasts."
        },
        {
          "player": "Bubba Chandler",
          "market": "Pitcher strikeouts",
          "side": "Over",
          "line": 4.5,
          "projected": 4.9,
          "base_projected": 4.3,
          "fair": -139,
          "under_fair": 139,
          "base_fair": 122,
          "base_under_fair": -122,
          "book": null,
          "play_to": -129,
          "under_play_to": 149,
          "base_play_to": 132,
          "base_under_play_to": -112,
          "designation": "Watch price",
          "explainer": "Sharp-pitcher K view: uses projected K rate, expected workload, and a modest command/workload bump. This affects K props only, not score or team-total forecasts."
        }
      ]
    },
    {
      "id": 823682,
      "away": "LAA",
      "home": "MIN",
      "away_name": "Los Angeles Angels",
      "home_name": "Minnesota Twins",
      "away_starter": "Ryan Johnson",
      "home_starter": "Joe Ryan",
      "status": "Scheduled",
      "time": "2:10 PM ET",
      "day_night": "day",
      "away_score": 4.6,
      "home_score": 4.3,
      "total": 8.9,
      "home_win_probability": 0.44,
      "moneyline_fairs": {
        "away_probability": 0.56,
        "home_probability": 0.44,
        "away_fair": -127,
        "home_fair": 127
      },
      "team_total_fairs": {
        "away": 4.6,
        "home": 4.3
      },
      "f5": {
        "away_score": 2.4,
        "home_score": 2.1,
        "total": 4.5,
        "home_win_probability": 0.422,
        "away_fair": -137,
        "home_fair": 137
      },
      "synthesis": "The board sees a balanced run environment. Neither side has a meaningful projected scoring edge.",
      "k_targets": [
        {
          "batter": "Oswald Peraza",
          "team": "LAA",
          "pitcher": "Joe Ryan",
          "pitch_type": "ST",
          "pitch_name": "Sweeper",
          "usage": 14.4,
          "whiff_rate": 0.456,
          "chase_rate": 0.429,
          "label": "Strong K target",
          "explainer": "Oswald Peraza has a high whiff profile against Sweeper; Joe Ryan throws it 14% of the time."
        },
        {
          "batter": "Trevor Larnach",
          "team": "MIN",
          "pitcher": "Ryan Johnson",
          "pitch_type": "FS",
          "pitch_name": "Split-Finger",
          "usage": 26.1,
          "whiff_rate": 0.45,
          "chase_rate": 0.306,
          "label": "Strong K target",
          "explainer": "Trevor Larnach has a high whiff profile against Split-Finger; Ryan Johnson throws it 26% of the time."
        },
        {
          "batter": "Austin Martin",
          "team": "MIN",
          "pitcher": "Ryan Johnson",
          "pitch_type": "ST",
          "pitch_name": "Sweeper",
          "usage": 14.9,
          "whiff_rate": 0.337,
          "chase_rate": 0.182,
          "label": "K target",
          "explainer": "Austin Martin has a high whiff profile against Sweeper; Ryan Johnson throws it 15% of the time."
        }
      ],
      "prop_angles": [
        {
          "player": "Ryan Johnson",
          "market": "Pitcher strikeouts",
          "side": "Over",
          "line": 4.5,
          "projected": 4.3,
          "base_projected": 3.7,
          "fair": 117,
          "under_fair": -117,
          "base_fair": 186,
          "base_under_fair": -186,
          "book": null,
          "play_to": 127,
          "under_play_to": -107,
          "base_play_to": 196,
          "base_under_play_to": -176,
          "designation": "Watch price",
          "explainer": "Sharp-pitcher K view: uses projected K rate, expected workload, and a modest command/workload bump. This affects K props only, not score or team-total forecasts."
        },
        {
          "player": "Joe Ryan",
          "market": "Pitcher strikeouts",
          "side": "Over",
          "line": 7.5,
          "projected": 7.5,
          "base_projected": 6.9,
          "fair": 102,
          "under_fair": -102,
          "base_fair": 175,
          "base_under_fair": -175,
          "book": null,
          "play_to": 112,
          "under_play_to": -92,
          "base_play_to": 185,
          "base_under_play_to": -165,
          "designation": "Watch price",
          "explainer": "Sharp-pitcher K view: uses projected K rate, expected workload, and a modest command/workload bump. This affects K props only, not score or team-total forecasts."
        }
      ]
    },
    {
      "id": 824576,
      "away": "ATH",
      "home": "CWS",
      "away_name": "Athletics",
      "home_name": "Chicago White Sox",
      "away_starter": "Gage Jump",
      "home_starter": "Bryan Hudson",
      "status": "Pre-Game",
      "time": "2:10 PM ET",
      "day_night": "day",
      "away_score": 4.7,
      "home_score": 4.9,
      "total": 9.6,
      "home_win_probability": 0.54,
      "moneyline_fairs": {
        "away_probability": 0.46,
        "home_probability": 0.54,
        "away_fair": 117,
        "home_fair": -117
      },
      "team_total_fairs": {
        "away": 4.7,
        "home": 4.9
      },
      "f5": {
        "away_score": 2.2,
        "home_score": 2.5,
        "total": 4.7,
        "home_win_probability": 0.578,
        "away_fair": 137,
        "home_fair": -137
      },
      "synthesis": "The board sees a higher-scoring game script. Neither side has a meaningful projected scoring edge.",
      "k_targets": [
        {
          "batter": "Montgomery",
          "team": "CWS",
          "pitcher": "Gage Jump",
          "pitch_type": "SL",
          "pitch_name": "Slider",
          "usage": 24.5,
          "whiff_rate": 0.37,
          "chase_rate": 0.345,
          "label": "Strong K target",
          "explainer": "Montgomery has a high whiff profile against Slider; Gage Jump throws it 24% of the time."
        }
      ],
      "prop_angles": [
        {
          "player": "Gage Jump",
          "market": "Pitcher strikeouts",
          "side": "Over",
          "line": 5.5,
          "projected": 5.9,
          "base_projected": 5.3,
          "fair": -144,
          "under_fair": 144,
          "base_fair": 118,
          "base_under_fair": -118,
          "book": null,
          "play_to": -134,
          "under_play_to": 154,
          "base_play_to": 128,
          "base_under_play_to": -108,
          "designation": "Watch price",
          "explainer": "Sharp-pitcher K view: uses projected K rate, expected workload, and a modest command/workload bump. This affects K props only, not score or team-total forecasts."
        },
        {
          "player": "Bryan Hudson",
          "market": "Pitcher strikeouts",
          "side": "Over",
          "line": 2.5,
          "projected": 2.1,
          "base_projected": 1.5,
          "fair": 143,
          "under_fair": -143,
          "base_fair": 186,
          "base_under_fair": -186,
          "book": null,
          "play_to": 153,
          "under_play_to": -133,
          "base_play_to": 196,
          "base_under_play_to": -176,
          "designation": "Watch price",
          "explainer": "Sharp-pitcher K view: uses projected K rate, expected workload, and a modest command/workload bump. This affects K props only, not score or team-total forecasts."
        }
      ]
    },
    {
      "id": 823198,
      "away": "COL",
      "home": "SF",
      "away_name": "Colorado Rockies",
      "home_name": "San Francisco Giants",
      "away_starter": "Kyle Freeland",
      "home_starter": "Tyler Mahle",
      "status": "Scheduled",
      "time": "4:05 PM ET",
      "day_night": "day",
      "away_score": 4.4,
      "home_score": 3.8,
      "total": 8.2,
      "home_win_probability": 0.382,
      "moneyline_fairs": {
        "away_probability": 0.618,
        "home_probability": 0.382,
        "away_fair": -162,
        "home_fair": 162
      },
      "team_total_fairs": {
        "away": 4.4,
        "home": 3.8
      },
      "f5": {
        "away_score": 2.2,
        "home_score": 1.9,
        "total": 4.1,
        "home_win_probability": 0.422,
        "away_fair": -137,
        "home_fair": 137
      },
      "synthesis": "The board sees a balanced run environment. COL has the clearer projected scoring path.",
      "k_targets": [
        {
          "batter": "Hunter Goodman",
          "team": "COL",
          "pitcher": "Tyler Mahle",
          "pitch_type": "SL",
          "pitch_name": "Slider",
          "usage": 10.1,
          "whiff_rate": 0.323,
          "chase_rate": 0.438,
          "label": "K target",
          "explainer": "Hunter Goodman has a high whiff profile against Slider; Tyler Mahle throws it 10% of the time."
        }
      ],
      "prop_angles": [
        {
          "player": "Kyle Freeland",
          "market": "Pitcher strikeouts",
          "side": "Over",
          "line": 4.5,
          "projected": 4.7,
          "base_projected": 4.1,
          "fair": -121,
          "under_fair": 121,
          "base_fair": 140,
          "base_under_fair": -140,
          "book": null,
          "play_to": -111,
          "under_play_to": 131,
          "base_play_to": 150,
          "base_under_play_to": -130,
          "designation": "Watch price",
          "explainer": "Sharp-pitcher K view: uses projected K rate, expected workload, and a modest command/workload bump. This affects K props only, not score or team-total forecasts."
        },
        {
          "player": "Tyler Mahle",
          "market": "Pitcher strikeouts",
          "side": "Over",
          "line": 5.5,
          "projected": 5.5,
          "base_projected": 4.9,
          "fair": -104,
          "under_fair": 104,
          "base_fair": 165,
          "base_under_fair": -165,
          "book": null,
          "play_to": -94,
          "under_play_to": 114,
          "base_play_to": 175,
          "base_under_play_to": -155,
          "designation": "Watch price",
          "explainer": "Sharp-pitcher K view: uses projected K rate, expected workload, and a modest command/workload bump. This affects K props only, not score or team-total forecasts."
        }
      ]
    },
    {
      "id": 822953,
      "away": "SEA",
      "home": "TB",
      "away_name": "Seattle Mariners",
      "home_name": "Tampa Bay Rays",
      "away_starter": "Logan Gilbert",
      "home_starter": "Griffin Jax",
      "status": "Scheduled",
      "time": "4:10 PM ET",
      "day_night": "day",
      "away_score": 4.3,
      "home_score": 4.4,
      "total": 8.7,
      "home_win_probability": 0.52,
      "moneyline_fairs": {
        "away_probability": 0.48,
        "home_probability": 0.52,
        "away_fair": 108,
        "home_fair": -108
      },
      "team_total_fairs": {
        "away": 4.3,
        "home": 4.4
      },
      "f5": {
        "away_score": 2.1,
        "home_score": 2.3,
        "total": 4.4,
        "home_win_probability": 0.552,
        "away_fair": 123,
        "home_fair": -123
      },
      "synthesis": "The board sees a balanced run environment. Neither side has a meaningful projected scoring edge.",
      "k_targets": [
        {
          "batter": "Colt Emerson",
          "team": "SEA",
          "pitcher": "Griffin Jax",
          "pitch_type": "CH",
          "pitch_name": "Changeup",
          "usage": 23.8,
          "whiff_rate": 0.429,
          "chase_rate": 0.417,
          "label": "Strong K target",
          "explainer": "Colt Emerson has a high whiff profile against Changeup; Griffin Jax throws it 24% of the time."
        },
        {
          "batter": "Josh Naylor",
          "team": "SEA",
          "pitcher": "Griffin Jax",
          "pitch_type": "ST",
          "pitch_name": "Sweeper",
          "usage": 25.3,
          "whiff_rate": 0.333,
          "chase_rate": 0.167,
          "label": "Strong K target",
          "explainer": "Josh Naylor has a high whiff profile against Sweeper; Griffin Jax throws it 25% of the time."
        },
        {
          "batter": "Luke Raley",
          "team": "SEA",
          "pitcher": "Griffin Jax",
          "pitch_type": "FF",
          "pitch_name": "4-Seam Fastball",
          "usage": 16.7,
          "whiff_rate": 0.326,
          "chase_rate": 0.271,
          "label": "K target",
          "explainer": "Luke Raley has a high whiff profile against 4-Seam Fastball; Griffin Jax throws it 17% of the time."
        },
        {
          "batter": "Ryan Vilade",
          "team": "TB",
          "pitcher": "Logan Gilbert",
          "pitch_type": "SL",
          "pitch_name": "Slider",
          "usage": 22.8,
          "whiff_rate": 0.476,
          "chase_rate": 0.355,
          "label": "Strong K target",
          "explainer": "Ryan Vilade has a high whiff profile against Slider; Logan Gilbert throws it 23% of the time."
        }
      ],
      "prop_angles": [
        {
          "player": "Logan Gilbert",
          "market": "Pitcher strikeouts",
          "side": "Over",
          "line": 7.5,
          "projected": 7.7,
          "base_projected": 7.1,
          "fair": -114,
          "under_fair": 114,
          "base_fair": 149,
          "base_under_fair": -149,
          "book": null,
          "play_to": -104,
          "under_play_to": 124,
          "base_play_to": 159,
          "base_under_play_to": -139,
          "designation": "Watch price",
          "explainer": "Sharp-pitcher K view: uses projected K rate, expected workload, and a modest command/workload bump. This affects K props only, not score or team-total forecasts."
        },
        {
          "player": "Griffin Jax",
          "market": "Pitcher strikeouts",
          "side": "Over",
          "line": 5.5,
          "projected": 5.4,
          "base_projected": 4.8,
          "fair": 109,
          "under_fair": -109,
          "base_fair": 186,
          "base_under_fair": -186,
          "book": null,
          "play_to": 119,
          "under_play_to": -99,
          "base_play_to": 196,
          "base_under_play_to": -176,
          "designation": "Watch price",
          "explainer": "Sharp-pitcher K view: uses projected K rate, expected workload, and a modest command/workload bump. This affects K props only, not score or team-total forecasts."
        }
      ]
    },
    {
      "id": 823844,
      "away": "CLE",
      "home": "MIA",
      "away_name": "Cleveland Guardians",
      "home_name": "Miami Marlins",
      "away_starter": "Tanner Bibee",
      "home_starter": "Eury Pérez",
      "status": "Scheduled",
      "time": "4:10 PM ET",
      "day_night": "day",
      "away_score": 3.9,
      "home_score": 4.0,
      "total": 7.9,
      "home_win_probability": 0.52,
      "moneyline_fairs": {
        "away_probability": 0.48,
        "home_probability": 0.52,
        "away_fair": 108,
        "home_fair": -108
      },
      "team_total_fairs": {
        "away": 3.9,
        "home": 4.0
      },
      "f5": {
        "away_score": 2.0,
        "home_score": 2.1,
        "total": 4.1,
        "home_win_probability": 0.526,
        "away_fair": 111,
        "home_fair": -111
      },
      "synthesis": "The board sees a lower-scoring game script. Neither side has a meaningful projected scoring edge.",
      "k_targets": [
        {
          "batter": "Kyle Stowers",
          "team": "MIA",
          "pitcher": "Tanner Bibee",
          "pitch_type": "FC",
          "pitch_name": "Cutter",
          "usage": 25.0,
          "whiff_rate": 0.324,
          "chase_rate": 0.357,
          "label": "Strong K target",
          "explainer": "Kyle Stowers has a high whiff profile against Cutter; Tanner Bibee throws it 25% of the time."
        }
      ],
      "prop_angles": [
        {
          "player": "Tanner Bibee",
          "market": "Pitcher strikeouts",
          "side": "Over",
          "line": 5.5,
          "projected": 5.4,
          "base_projected": 4.8,
          "fair": 114,
          "under_fair": -114,
          "base_fair": 186,
          "base_under_fair": -186,
          "book": null,
          "play_to": 124,
          "under_play_to": -104,
          "base_play_to": 196,
          "base_under_play_to": -176,
          "designation": "Watch price",
          "explainer": "Sharp-pitcher K view: uses projected K rate, expected workload, and a modest command/workload bump. This affects K props only, not score or team-total forecasts."
        },
        {
          "player": "Eury Pérez",
          "market": "Pitcher strikeouts",
          "side": "Over",
          "line": 6.5,
          "projected": 7.0,
          "base_projected": 6.4,
          "fair": -153,
          "under_fair": 153,
          "base_fair": 112,
          "base_under_fair": -112,
          "book": null,
          "play_to": -143,
          "under_play_to": 163,
          "base_play_to": 122,
          "base_under_play_to": -102,
          "designation": "Watch price",
          "explainer": "Sharp-pitcher K view: uses projected K rate, expected workload, and a modest command/workload bump. This affects K props only, not score or team-total forecasts."
        }
      ]
    },
    {
      "id": 824249,
      "away": "PHI",
      "home": "DET",
      "away_name": "Philadelphia Phillies",
      "home_name": "Detroit Tigers",
      "away_starter": "Cristopher Sánchez",
      "home_starter": "Casey Mize",
      "status": "Scheduled",
      "time": "6:10 PM ET",
      "day_night": "night",
      "away_score": 4.8,
      "home_score": 4.9,
      "total": 9.7,
      "home_win_probability": 0.52,
      "moneyline_fairs": {
        "away_probability": 0.48,
        "home_probability": 0.52,
        "away_fair": 108,
        "home_fair": -108
      },
      "team_total_fairs": {
        "away": 4.8,
        "home": 4.9
      },
      "f5": {
        "away_score": 2.5,
        "home_score": 2.6,
        "total": 5.1,
        "home_win_probability": 0.526,
        "away_fair": 111,
        "home_fair": -111
      },
      "synthesis": "The board sees a higher-scoring game script. Neither side has a meaningful projected scoring edge.",
      "k_targets": [
        {
          "batter": "Kyle Schwarber",
          "team": "PHI",
          "pitcher": "Casey Mize",
          "pitch_type": "FS",
          "pitch_name": "Split-Finger",
          "usage": 24.9,
          "whiff_rate": 0.333,
          "chase_rate": 0.256,
          "label": "Strong K target",
          "explainer": "Kyle Schwarber has a high whiff profile against Split-Finger; Casey Mize throws it 25% of the time."
        },
        {
          "batter": "Dillon Dingler",
          "team": "DET",
          "pitcher": "Cristopher Sánchez",
          "pitch_type": "SL",
          "pitch_name": "Slider",
          "usage": 18.9,
          "whiff_rate": 0.302,
          "chase_rate": 0.329,
          "label": "K target",
          "explainer": "Dillon Dingler has a high whiff profile against Slider; Cristopher Sánchez throws it 19% of the time."
        }
      ],
      "prop_angles": [
        {
          "player": "Cristopher Sánchez",
          "market": "Pitcher strikeouts",
          "side": "Over",
          "line": 8.5,
          "projected": 8.2,
          "base_projected": 7.6,
          "fair": 130,
          "under_fair": -130,
          "base_fair": 186,
          "base_under_fair": -186,
          "book": null,
          "play_to": 140,
          "under_play_to": -120,
          "base_play_to": 196,
          "base_under_play_to": -176,
          "designation": "Watch price",
          "explainer": "Sharp-pitcher K view: uses projected K rate, expected workload, and a modest command/workload bump. This affects K props only, not score or team-total forecasts."
        },
        {
          "player": "Casey Mize",
          "market": "Pitcher strikeouts",
          "side": "Over",
          "line": 6.5,
          "projected": 6.8,
          "base_projected": 6.2,
          "fair": -126,
          "under_fair": 126,
          "base_fair": 135,
          "base_under_fair": -135,
          "book": null,
          "play_to": -116,
          "under_play_to": 136,
          "base_play_to": 145,
          "base_under_play_to": -125,
          "designation": "Watch price",
          "explainer": "Sharp-pitcher K view: uses projected K rate, expected workload, and a modest command/workload bump. This affects K props only, not score or team-total forecasts."
        }
      ]
    },
    {
      "id": 824813,
      "away": "KC",
      "home": "BAL",
      "away_name": "Kansas City Royals",
      "home_name": "Baltimore Orioles",
      "away_starter": "Noah Cameron",
      "home_starter": "Kyle Bradish",
      "status": "Scheduled",
      "time": "7:05 PM ET",
      "day_night": "night",
      "away_score": 4.6,
      "home_score": 4.6,
      "total": 9.2,
      "home_win_probability": 0.5,
      "moneyline_fairs": {
        "away_probability": 0.5,
        "home_probability": 0.5,
        "away_fair": -100,
        "home_fair": -100
      },
      "team_total_fairs": {
        "away": 4.6,
        "home": 4.6
      },
      "f5": {
        "away_score": 2.4,
        "home_score": 2.3,
        "total": 4.7,
        "home_win_probability": 0.474,
        "away_fair": -111,
        "home_fair": 111
      },
      "synthesis": "The board sees a balanced run environment. Neither side has a meaningful projected scoring edge.",
      "k_targets": [
        {
          "batter": "Blaze Alexander",
          "team": "BAL",
          "pitcher": "Noah Cameron",
          "pitch_type": "CU",
          "pitch_name": "Curveball",
          "usage": 17.2,
          "whiff_rate": 0.308,
          "chase_rate": 0.344,
          "label": "K target",
          "explainer": "Blaze Alexander has a high whiff profile against Curveball; Noah Cameron throws it 17% of the time."
        }
      ],
      "prop_angles": [
        {
          "player": "Noah Cameron",
          "market": "Pitcher strikeouts",
          "side": "Over",
          "line": 5.5,
          "projected": 5.3,
          "base_projected": 4.7,
          "fair": 119,
          "under_fair": -119,
          "base_fair": 186,
          "base_under_fair": -186,
          "book": null,
          "play_to": 129,
          "under_play_to": -109,
          "base_play_to": 196,
          "base_under_play_to": -176,
          "designation": "Watch price",
          "explainer": "Sharp-pitcher K view: uses projected K rate, expected workload, and a modest command/workload bump. This affects K props only, not score or team-total forecasts."
        },
        {
          "player": "Kyle Bradish",
          "market": "Pitcher strikeouts",
          "side": "Over",
          "line": 6.5,
          "projected": 6.3,
          "base_projected": 5.7,
          "fair": 118,
          "under_fair": -118,
          "base_fair": 186,
          "base_under_fair": -186,
          "book": null,
          "play_to": 128,
          "under_play_to": -108,
          "base_play_to": 196,
          "base_under_play_to": -176,
          "designation": "Watch price",
          "explainer": "Sharp-pitcher K view: uses projected K rate, expected workload, and a modest command/workload bump. This affects K props only, not score or team-total forecasts."
        }
      ]
    },
    {
      "id": 822875,
      "away": "HOU",
      "home": "TEX",
      "away_name": "Houston Astros",
      "home_name": "Texas Rangers",
      "away_starter": "Peter Lambert",
      "home_starter": "Kumar Rocker",
      "status": "Scheduled",
      "time": "7:05 PM ET",
      "day_night": "night",
      "away_score": 4.4,
      "home_score": 4.5,
      "total": 8.9,
      "home_win_probability": 0.52,
      "moneyline_fairs": {
        "away_probability": 0.48,
        "home_probability": 0.52,
        "away_fair": 108,
        "home_fair": -108
      },
      "team_total_fairs": {
        "away": 4.4,
        "home": 4.5
      },
      "f5": {
        "away_score": 2.2,
        "home_score": 2.3,
        "total": 4.5,
        "home_win_probability": 0.526,
        "away_fair": 111,
        "home_fair": -111
      },
      "synthesis": "The board sees a balanced run environment. Neither side has a meaningful projected scoring edge.",
      "k_targets": [
        {
          "batter": "Christian Walker",
          "team": "HOU",
          "pitcher": "Kumar Rocker",
          "pitch_type": "SL",
          "pitch_name": "Slider",
          "usage": 38.0,
          "whiff_rate": 0.394,
          "chase_rate": 0.369,
          "label": "Strong K target",
          "explainer": "Christian Walker has a high whiff profile against Slider; Kumar Rocker throws it 38% of the time."
        },
        {
          "batter": "Kyle Higashioka",
          "team": "TEX",
          "pitcher": "Peter Lambert",
          "pitch_type": "CH",
          "pitch_name": "Changeup",
          "usage": 22.0,
          "whiff_rate": 0.43,
          "chase_rate": 0.343,
          "label": "Strong K target",
          "explainer": "Kyle Higashioka has a high whiff profile against Changeup; Peter Lambert throws it 22% of the time."
        },
        {
          "batter": "Ezequiel Duran",
          "team": "TEX",
          "pitcher": "Peter Lambert",
          "pitch_type": "SL",
          "pitch_name": "Slider",
          "usage": 16.9,
          "whiff_rate": 0.393,
          "chase_rate": 0.349,
          "label": "K target",
          "explainer": "Ezequiel Duran has a high whiff profile against Slider; Peter Lambert throws it 17% of the time."
        }
      ],
      "prop_angles": [
        {
          "player": "Peter Lambert",
          "market": "Pitcher strikeouts",
          "side": "Over",
          "line": 6.5,
          "projected": 6.2,
          "base_projected": 5.6,
          "fair": 135,
          "under_fair": -135,
          "base_fair": 186,
          "base_under_fair": -186,
          "book": null,
          "play_to": 145,
          "under_play_to": -125,
          "base_play_to": 196,
          "base_under_play_to": -176,
          "designation": "Watch price",
          "explainer": "Sharp-pitcher K view: uses projected K rate, expected workload, and a modest command/workload bump. This affects K props only, not score or team-total forecasts."
        },
        {
          "player": "Kumar Rocker",
          "market": "Pitcher strikeouts",
          "side": "Over",
          "line": 4.5,
          "projected": 4.8,
          "base_projected": 4.2,
          "fair": -135,
          "under_fair": 135,
          "base_fair": 126,
          "base_under_fair": -126,
          "book": null,
          "play_to": -125,
          "under_play_to": 145,
          "base_play_to": 136,
          "base_under_play_to": -116,
          "designation": "Watch price",
          "explainer": "Sharp-pitcher K view: uses projected K rate, expected workload, and a modest command/workload bump. This affects K props only, not score or team-total forecasts."
        }
      ]
    },
    {
      "id": 824492,
      "away": "CHC",
      "home": "CIN",
      "away_name": "Chicago Cubs",
      "home_name": "Cincinnati Reds",
      "away_starter": "Javier Assad",
      "home_starter": "Nick Lodolo",
      "status": "Scheduled",
      "time": "7:10 PM ET",
      "day_night": "night",
      "away_score": 4.4,
      "home_score": 4.5,
      "total": 8.9,
      "home_win_probability": 0.52,
      "moneyline_fairs": {
        "away_probability": 0.48,
        "home_probability": 0.52,
        "away_fair": 108,
        "home_fair": -108
      },
      "team_total_fairs": {
        "away": 4.4,
        "home": 4.5
      },
      "f5": {
        "away_score": 2.2,
        "home_score": 2.3,
        "total": 4.5,
        "home_win_probability": 0.526,
        "away_fair": 111,
        "home_fair": -111
      },
      "synthesis": "The board sees a balanced run environment. Neither side has a meaningful projected scoring edge.",
      "k_targets": [
        {
          "batter": "Michael Busch",
          "team": "CHC",
          "pitcher": "Nick Lodolo",
          "pitch_type": "CU",
          "pitch_name": "Curveball",
          "usage": 24.3,
          "whiff_rate": 0.404,
          "chase_rate": 0.13,
          "label": "Strong K target",
          "explainer": "Michael Busch has a high whiff profile against Curveball; Nick Lodolo throws it 24% of the time."
        },
        {
          "batter": "Matt Shaw",
          "team": "CHC",
          "pitcher": "Nick Lodolo",
          "pitch_type": "CH",
          "pitch_name": "Changeup",
          "usage": 23.8,
          "whiff_rate": 0.324,
          "chase_rate": 0.463,
          "label": "K target",
          "explainer": "Matt Shaw has a high whiff profile against Changeup; Nick Lodolo throws it 24% of the time."
        },
        {
          "batter": "Sal Stewart",
          "team": "CIN",
          "pitcher": "Javier Assad",
          "pitch_type": "FF",
          "pitch_name": "4-Seam Fastball",
          "usage": 18.9,
          "whiff_rate": 0.353,
          "chase_rate": 0.364,
          "label": "K target",
          "explainer": "Sal Stewart has a high whiff profile against 4-Seam Fastball; Javier Assad throws it 19% of the time."
        }
      ],
      "prop_angles": [
        {
          "player": "Javier Assad",
          "market": "Pitcher strikeouts",
          "side": "Over",
          "line": 3.5,
          "projected": 4.0,
          "base_projected": 3.4,
          "fair": -154,
          "under_fair": 154,
          "base_fair": 111,
          "base_under_fair": -111,
          "book": null,
          "play_to": -144,
          "under_play_to": 164,
          "base_play_to": 121,
          "base_under_play_to": -101,
          "designation": "Watch price",
          "explainer": "Sharp-pitcher K view: uses projected K rate, expected workload, and a modest command/workload bump. This affects K props only, not score or team-total forecasts."
        },
        {
          "player": "Nick Lodolo",
          "market": "Pitcher strikeouts",
          "side": "Over",
          "line": 4.5,
          "projected": 4.7,
          "base_projected": 4.1,
          "fair": -117,
          "under_fair": 117,
          "base_fair": 145,
          "base_under_fair": -145,
          "book": null,
          "play_to": -107,
          "under_play_to": 127,
          "base_play_to": 155,
          "base_under_play_to": -135,
          "designation": "Watch price",
          "explainer": "Sharp-pitcher K view: uses projected K rate, expected workload, and a modest command/workload bump. This affects K props only, not score or team-total forecasts."
        }
      ]
    },
    {
      "id": 823030,
      "away": "ATL",
      "home": "STL",
      "away_name": "Atlanta Braves",
      "home_name": "St. Louis Cardinals",
      "away_starter": "Reynaldo López",
      "home_starter": "Matthew Liberatore",
      "status": "Scheduled",
      "time": "7:15 PM ET",
      "day_night": "night",
      "away_score": 4.3,
      "home_score": 4.6,
      "total": 8.9,
      "home_win_probability": 0.56,
      "moneyline_fairs": {
        "away_probability": 0.44,
        "home_probability": 0.56,
        "away_fair": 127,
        "home_fair": -127
      },
      "team_total_fairs": {
        "away": 4.3,
        "home": 4.6
      },
      "f5": {
        "away_score": 2.1,
        "home_score": 2.2,
        "total": 4.3,
        "home_win_probability": 0.526,
        "away_fair": 111,
        "home_fair": -111
      },
      "synthesis": "The board sees a balanced run environment. Neither side has a meaningful projected scoring edge.",
      "k_targets": [],
      "prop_angles": [
        {
          "player": "Reynaldo López",
          "market": "Pitcher strikeouts",
          "side": "Over",
          "line": 4.5,
          "projected": 4.6,
          "base_projected": 4.0,
          "fair": -110,
          "under_fair": 110,
          "base_fair": 155,
          "base_under_fair": -155,
          "book": null,
          "play_to": -100,
          "under_play_to": 120,
          "base_play_to": 165,
          "base_under_play_to": -145,
          "designation": "Watch price",
          "explainer": "Sharp-pitcher K view: uses projected K rate, expected workload, and a modest command/workload bump. This affects K props only, not score or team-total forecasts."
        },
        {
          "player": "Matthew Liberatore",
          "market": "Pitcher strikeouts",
          "side": "Over",
          "line": 5.5,
          "projected": 5.0,
          "base_projected": 4.4,
          "fair": 150,
          "under_fair": -150,
          "base_fair": 186,
          "base_under_fair": -186,
          "book": null,
          "play_to": 160,
          "under_play_to": -140,
          "base_play_to": 196,
          "base_under_play_to": -176,
          "designation": "Watch price",
          "explainer": "Sharp-pitcher K view: uses projected K rate, expected workload, and a modest command/workload bump. This affects K props only, not score or team-total forecasts."
        }
      ]
    },
    {
      "id": 823276,
      "away": "TOR",
      "home": "SD",
      "away_name": "Toronto Blue Jays",
      "home_name": "San Diego Padres",
      "away_starter": "Trey Yesavage",
      "home_starter": "Walker Buehler",
      "status": "Scheduled",
      "time": "8:40 PM ET",
      "day_night": "night",
      "away_score": 3.9,
      "home_score": 4.6,
      "total": 8.5,
      "home_win_probability": 0.636,
      "moneyline_fairs": {
        "away_probability": 0.364,
        "home_probability": 0.636,
        "away_fair": 175,
        "home_fair": -175
      },
      "team_total_fairs": {
        "away": 3.9,
        "home": 4.6
      },
      "f5": {
        "away_score": 1.9,
        "home_score": 2.4,
        "total": 4.3,
        "home_win_probability": 0.629,
        "away_fair": 170,
        "home_fair": -170
      },
      "synthesis": "The board sees a balanced run environment. SD has the clearer projected scoring path.",
      "k_targets": [
        {
          "batter": "Brandon Valenzuela",
          "team": "TOR",
          "pitcher": "Walker Buehler",
          "pitch_type": "SL",
          "pitch_name": "Slider",
          "usage": 10.9,
          "whiff_rate": 0.382,
          "chase_rate": 0.615,
          "label": "K target",
          "explainer": "Brandon Valenzuela has a high whiff profile against Slider; Walker Buehler throws it 11% of the time."
        }
      ],
      "prop_angles": [
        {
          "player": "Trey Yesavage",
          "market": "Pitcher strikeouts",
          "side": "Over",
          "line": 6.5,
          "projected": 6.2,
          "base_projected": 5.6,
          "fair": 131,
          "under_fair": -131,
          "base_fair": 186,
          "base_under_fair": -186,
          "book": null,
          "play_to": 141,
          "under_play_to": -121,
          "base_play_to": 196,
          "base_under_play_to": -176,
          "designation": "Watch price",
          "explainer": "Sharp-pitcher K view: uses projected K rate, expected workload, and a modest command/workload bump. This affects K props only, not score or team-total forecasts."
        },
        {
          "player": "Walker Buehler",
          "market": "Pitcher strikeouts",
          "side": "Over",
          "line": 5.5,
          "projected": 5.1,
          "base_projected": 4.5,
          "fair": 146,
          "under_fair": -146,
          "base_fair": 186,
          "base_under_fair": -186,
          "book": null,
          "play_to": 156,
          "under_play_to": -136,
          "base_play_to": 196,
          "base_under_play_to": -176,
          "designation": "Watch price",
          "explainer": "Sharp-pitcher K view: uses projected K rate, expected workload, and a modest command/workload bump. This affects K props only, not score or team-total forecasts."
        }
      ]
    },
    {
      "id": 823926,
      "away": "AZ",
      "home": "LAD",
      "away_name": "Arizona Diamondbacks",
      "home_name": "Los Angeles Dodgers",
      "away_starter": "Brandon Pfaadt",
      "home_starter": "Yoshinobu Yamamoto",
      "status": "Scheduled",
      "time": "9:10 PM ET",
      "day_night": "night",
      "away_score": 4.7,
      "home_score": 5.2,
      "total": 9.9,
      "home_win_probability": 0.599,
      "moneyline_fairs": {
        "away_probability": 0.401,
        "home_probability": 0.599,
        "away_fair": 149,
        "home_fair": -149
      },
      "team_total_fairs": {
        "away": 4.7,
        "home": 5.2
      },
      "f5": {
        "away_score": 2.5,
        "home_score": 2.7,
        "total": 5.2,
        "home_win_probability": 0.552,
        "away_fair": 123,
        "home_fair": -123
      },
      "synthesis": "The board sees a higher-scoring game script. LAD has the clearer projected scoring path.",
      "k_targets": [
        {
          "batter": "Kyle Tucker",
          "team": "LAD",
          "pitcher": "Brandon Pfaadt",
          "pitch_type": "ST",
          "pitch_name": "Sweeper",
          "usage": 13.5,
          "whiff_rate": 0.3,
          "chase_rate": 0.222,
          "label": "K target",
          "explainer": "Kyle Tucker has a high whiff profile against Sweeper; Brandon Pfaadt throws it 14% of the time."
        },
        {
          "batter": "Shohei Ohtani",
          "team": "LAD",
          "pitcher": "Brandon Pfaadt",
          "pitch_type": "CH",
          "pitch_name": "Changeup",
          "usage": 10.7,
          "whiff_rate": 0.349,
          "chase_rate": 0.278,
          "label": "K target",
          "explainer": "Shohei Ohtani has a high whiff profile against Changeup; Brandon Pfaadt throws it 11% of the time."
        }
      ],
      "prop_angles": [
        {
          "player": "Brandon Pfaadt",
          "market": "Pitcher strikeouts",
          "side": "Over",
          "line": 4.5,
          "projected": 5.0,
          "base_projected": 4.4,
          "fair": -155,
          "under_fair": 155,
          "base_fair": 110,
          "base_under_fair": -110,
          "book": null,
          "play_to": -145,
          "under_play_to": 165,
          "base_play_to": 120,
          "base_under_play_to": -100,
          "designation": "Watch price",
          "explainer": "Sharp-pitcher K view: uses projected K rate, expected workload, and a modest command/workload bump. This affects K props only, not score or team-total forecasts."
        },
        {
          "player": "Yoshinobu Yamamoto",
          "market": "Pitcher strikeouts",
          "side": "Over",
          "line": 7.5,
          "projected": 7.7,
          "base_projected": 7.1,
          "fair": -124,
          "under_fair": 124,
          "base_fair": 138,
          "base_under_fair": -138,
          "book": null,
          "play_to": -114,
          "under_play_to": 134,
          "base_play_to": 148,
          "base_under_play_to": -128,
          "designation": "Watch price",
          "explainer": "Sharp-pitcher K view: uses projected K rate, expected workload, and a modest command/workload bump. This affects K props only, not score or team-total forecasts."
        }
      ]
    }
  ],
  "suppressed_games": [
    {
      "id": 822711,
      "away": "NYY",
      "home": "WSH",
      "reason": "starter_confirmation_conflict"
    },
    {
      "id": 823603,
      "away": "BOS",
      "home": "NYM",
      "reason": "missing_supported_starter"
    }
  ],
  "notice": "Customer-facing forecasts only. Missing values remain unavailable rather than estimated."
}
;

// CUSTOMER_BOARD_SAFE: this component receives only published customer
// forecasts. Model inputs, calibration tables, and scoring mechanics stay out
// of the browser bundle.
const CUSTOMER_FACING = true;
const PRELOADED_ODDS_API_KEY = import.meta.env.VITE_ODDS_API_KEY || "";

const APP_CSS = `
  :root { color-scheme: light; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #f4f6f8; color: #162132; }
  * { box-sizing: border-box; }
  body { margin: 0; min-width: 320px; }
  button { font: inherit; cursor: pointer; }
  .app { min-height: 100vh; background: #f4f6f8; }
  .app.night { color-scheme: dark; background: #0d1623; color: #e8edf5; }
  .topbar { position: sticky; top: 0; z-index: 5; display: flex; justify-content: space-between; align-items: center; gap: 16px; padding: 15px max(18px, calc((100vw - 1040px) / 2)); border-bottom: 1px solid #dce3ec; background: rgba(255,255,255,.94); backdrop-filter: blur(10px); }
  .night .topbar { background: rgba(13,22,35,.94); border-color: #26364a; }
  .brand { font-size: 20px; font-weight: 850; letter-spacing: -.02em; }
  .brand b { color: #2d6cdf; }
  .subline, .muted { color: #647388; font-size: 13px; }
  .night .subline, .night .muted { color: #9baac0; }
  .top-actions { display: flex; align-items: center; gap: 9px; }
  .mode, .refresh { border: 1px solid #cad4e0; border-radius: 8px; min-height: 36px; padding: 0 11px; background: #fff; color: #223047; font-weight: 750; }
  .night .mode, .night .refresh { color: #e8edf5; border-color: #3b4b61; background: #162236; }
  .refresh { background: #1d4f9f; border-color: #1d4f9f; color: #fff; }
  .refresh:disabled { cursor: wait; opacity: .65; }
  .shell { width: min(1040px, 100%); margin: 0 auto; padding: 18px; display: grid; gap: 15px; }
  .card { border: 1px solid #dce4ed; border-radius: 13px; background: #fff; box-shadow: 0 1px 3px rgba(21,36,54,.05); overflow: hidden; }
  .night .card { background: #121e30; border-color: #273a50; box-shadow: none; }
  .card-title { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; padding: 14px 16px; border-bottom: 1px solid #e7edf3; }
  .night .card-title { border-color: #26394f; }
  h1, h2, h3, p { margin: 0; }
  h2 { font-size: 15px; letter-spacing: -.01em; }
  .slate { display: grid; gap: 8px; padding: 10px; }
  .game { width: 100%; display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 10px; padding: 12px; text-align: left; color: inherit; background: #f9fbfd; border: 1px solid #e2e9f0; border-radius: 9px; }
  .game.active { background: #eef5ff; border-color: #7ba6e6; }
  .night .game { background: #172438; border-color: #2b4057; }
  .night .game.active { background: #183154; border-color: #4c82ca; }
  .matchup { font-weight: 850; }
  .status { color: #5e7088; font-size: 12px; text-align: right; }
  .night .status { color: #a2b2c6; }
  .score-grid { display: grid; grid-template-columns: repeat(3, 1fr); background: #e8eef5; gap: 1px; }
  .night .score-grid { background: #2a3b50; }
  .score { padding: 16px; background: #fff; display: grid; gap: 5px; }
  .night .score { background: #121e30; }
  .score span { color: #63758b; font-size: 12px; font-weight: 750; }
  .night .score span { color: #9daec2; }
  .score strong { font-size: 25px; font-variant-numeric: tabular-nums; }
  .copy { padding: 16px; display: grid; gap: 9px; line-height: 1.5; }
  .notice { border-left: 3px solid #83a9dd; padding-left: 10px; color: #53677f; font-size: 13px; }
  .night .notice { color: #a6b7cc; }
  .table { width: 100%; border-collapse: collapse; font-size: 13px; }
  .table th, .table td { padding: 11px 14px; text-align: left; border-bottom: 1px solid #e8edf3; vertical-align: top; }
  .night .table th, .night .table td { border-color: #26394f; }
  .table th { color: #61738a; font-size: 11px; text-transform: uppercase; letter-spacing: .04em; }
  .night .table th { color: #9fb0c5; }
  .table tr:last-child td { border-bottom: 0; }
  .angle-list { display: grid; gap: 9px; padding: 12px; }
  .angle { padding: 13px; border: 1px solid #d9e6dc; background: #f5fbf6; border-radius: 9px; }
  .night .angle { border-color: #2d513f; background: #14291f; }
  .angle-top { display: flex; justify-content: space-between; align-items: start; gap: 12px; }
  .angle h3 { font-size: 14px; }
  .pill { flex: 0 0 auto; padding: 3px 7px; border-radius: 999px; background: #e7f5ea; color: #1a6a3b; font-size: 11px; font-weight: 800; }
  .night .pill { background: #1c4930; color: #9ee2b6; }
  .pill.watch { background: #eef3f8; color: #53677f; }
  .pill.small { background: #fff7e6; color: #9a5b00; }
  .pill.bet { background: #e7f5ea; color: #1a6a3b; }
  .pill.strong { background: #dff7f0; color: #00634d; }
  .pill.pass { background: #f3f5f7; color: #6d7d91; }
  .night .pill.watch { background: #203047; color: #a9bad0; }
  .night .pill.small { background: #412f13; color: #f2c56b; }
  .night .pill.bet { background: #1c4930; color: #9ee2b6; }
  .night .pill.strong { background: #11463d; color: #8df0d5; }
  .night .pill.pass { background: #263447; color: #a8b6c7; }
  .prices { display: flex; flex-wrap: wrap; gap: 12px; margin: 10px 0 7px; }
  .prices span { color: #63758b; font-size: 12px; }
  .night .prices span { color: #a1b3c9; }
  .prices b { color: inherit; font-variant-numeric: tabular-nums; }
  .market-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; padding: 12px; }
  .market-card { display: grid; gap: 8px; padding: 13px; border: 1px solid #dfe7ef; border-radius: 9px; background: #fafcfe; }
  .night .market-card { background: #172438; border-color: #2b4057; }
  .market-top { display: flex; justify-content: space-between; gap: 10px; align-items: start; }
  .market-card h3 { font-size: 14px; }
  .market-main { font-size: 22px; font-weight: 850; font-variant-numeric: tabular-nums; }
  .market-meta { display: flex; flex-wrap: wrap; gap: 10px; color: #63758b; font-size: 12px; }
  .night .market-meta { color: #a1b3c9; }
  .segmented { display: inline-flex; padding: 3px; gap: 3px; border: 1px solid #cad4e0; border-radius: 9px; background: #fff; }
  .night .segmented { border-color: #3b4b61; background: #162236; }
  .segmented button { min-height: 28px; padding: 0 8px; border: 0; border-radius: 6px; background: transparent; color: inherit; font-weight: 800; font-size: 12px; }
  .segmented button.active { background: #1d4f9f; color: #fff; }
  .info { padding: 13px 15px; color: #66788e; font-size: 13px; }
  .night .info { color: #a1b2c6; }
  @media (max-width: 760px) { .market-grid { grid-template-columns: 1fr; } }
  @media (max-width: 640px) { .topbar { align-items: flex-start; flex-direction: column; padding: 12px 14px; } .top-actions { width: 100%; flex-wrap: wrap; } .mode, .refresh { flex: 1; } .shell { padding: 12px; } .score-grid { grid-template-columns: 1fr 1fr; } .score:last-child { grid-column: span 2; } .table { font-size: 12px; } .table th, .table td { padding: 9px 8px; } }
`;

function normal(value) {
  return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function price(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric === 0) return "—";
  return numeric > 0 ? `+${numeric}` : String(numeric);
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

function quoteIsBetter(candidate, current) {
  if (!validBookPrice(candidate?.price)) return false;
  return !current || Number(candidate.price) > Number(current.price);
}

function quoteKey(player, side, line) {
  return `${normal(player)}|${normal(side)}|${Number(line)}`;
}

function favoriteForGame(game) {
  const homeProbability = Number(game?.home_win_probability);
  if (!Number.isFinite(homeProbability)) return null;
  if (homeProbability >= 0.5) return { team: game.home, probability: homeProbability };
  return { team: game.away, probability: 1 - homeProbability };
}

function designationForOdds(fair, book) {
  if (!Number.isFinite(Number(fair)) || !validBookPrice(book)) {
    return { label: "Watch price", tone: "watch", detail: "No live book price yet." };
  }
  const edge = Number(book) - Number(fair);
  if (edge >= 25) return { label: "Strong bet", tone: "strong", detail: `${Math.round(edge)} cents better than fair.` };
  if (edge >= 10) return { label: "Bet", tone: "bet", detail: `${Math.round(edge)} cents better than fair.` };
  if (edge > 0) return { label: "Small edge", tone: "small", detail: `${Math.round(edge)} cents better than fair; thinner margin.` };
  return { label: "No edge", tone: "pass", detail: "Book price has not cleared fair." };
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

function lineLean(fairLine, liveLine, overPrice, underPrice) {
  const fair = Number(fairLine);
  const live = Number(liveLine);
  if (!Number.isFinite(fair) || !Number.isFinite(live)) return { label: "Waiting", tone: "watch", detail: "No live line loaded." };
  const diff = fair - live;
  if (diff >= 0.45 && validBookPrice(overPrice)) return { label: "Bet", tone: "bet", detail: `Over lean: fair ${fair.toFixed(1)} vs line ${live.toFixed(1)} at ${price(overPrice)}.` };
  if (diff <= -0.45 && validBookPrice(underPrice)) return { label: "Bet", tone: "bet", detail: `Under lean: fair ${fair.toFixed(1)} vs line ${live.toFixed(1)} at ${price(underPrice)}.` };
  if (Math.abs(diff) >= 0.25 && validBookPrice(diff > 0 ? overPrice : underPrice)) return { label: "Small edge", tone: "small", detail: `${diff > 0 ? "Over" : "Under"} is thin: fair ${fair.toFixed(1)} vs line ${live.toFixed(1)}.` };
  if (Math.abs(diff) >= 0.25) return { label: "Watch price", tone: "watch", detail: `${diff > 0 ? "Over" : "Under"} lean, but no valid live price is loaded.` };
  return { label: "No edge", tone: "pass", detail: `Fair ${fair.toFixed(1)} is close to live ${live.toFixed(1)}.` };
}

function summarizeSynthesis(game) {
  const base = game?.synthesis ? [game.synthesis] : [];
  const ml = game?.moneyline_fairs || {};
  const f5 = game?.f5 || {};
  const favorite = favoriteForGame(game);
  if (favorite) base.push(`${favorite.team} fair ML ${price(americanFromProbability(favorite.probability))} from ${probabilityText(favorite.probability)} win probability.`);
  if (f5.total != null) base.push(`F5 fair: ${game.away} ${score(f5.away_score)} - ${score(f5.home_score)} ${game.home}, total ${score(f5.total)}.`);
  if (ml.away_fair != null && ml.home_fair != null) base.push(`Full-game ML fairs: ${game.away} ${price(ml.away_fair)}, ${game.home} ${price(ml.home_fair)}.`);
  return base;
}

function CustomerBoard() {
  const [night, setNight] = useState(false);
  const [gameIndex, setGameIndex] = useState(0);
  const [kMode, setKMode] = useState("sharp");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [odds, setOdds] = useState({ k: {}, teamTotals: [], h2h: {}, totals: [], f5H2h: {}, f5Totals: [] });
  const games = BOARD.games || [];
  const game = games[gameIndex] || games[0] || null;
  const hasHostedProxy = typeof window !== "undefined" && !["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);
  const canUseLocalKey = !hasHostedProxy && !!PRELOADED_ODDS_API_KEY;

  const teamTotals = useMemo(() => {
    if (!game) return [];
    return odds.teamTotals.filter((row) => row.away === game.away && row.home === game.home);
  }, [game, odds.teamTotals]);

  async function refreshOdds() {
    if (!game) return;
    setLoading(true);
    setMessage("Fetching live sportsbook lines…");
    try {
      // Local testing may use VITE_ODDS_API_KEY. Every hosted request goes to
      // the worker, which supplies its ODDS_API_KEY secret server-side.
      const oddsUrl = (endpoint, params = new URLSearchParams()) => {
        const qs = params.toString();
        if (canUseLocalKey) {
          const glue = qs ? `${qs}&` : "";
          return `https://api.the-odds-api.com/v4/${endpoint}?${glue}apiKey=${encodeURIComponent(PRELOADED_ODDS_API_KEY)}`;
        }
        return `/api/odds/sports?target=${encodeURIComponent(endpoint)}${qs ? `&${qs}` : ""}`;
      };
      const eventsResponse = await fetch(oddsUrl("sports/baseball_mlb/events"));
      if (!eventsResponse.ok) throw new Error(`Live odds events request returned HTTP ${eventsResponse.status}`);
      const events = await eventsResponse.json();
      const event = Array.isArray(events) ? events.find((item) => normal(item.away_team) === normal(game.away_name) && normal(item.home_team) === normal(game.home_name)) : null;
      if (!event) {
        setOdds({ k: {}, teamTotals: [] });
        setMessage("No current sportsbook event matched this game.");
        return;
      }
      const params = new URLSearchParams({
        regions: "us",
        oddsFormat: "american",
        markets: "h2h,totals,h2h_1st_5_innings,totals_1st_5_innings,team_totals,pitcher_strikeouts",
      });
      const response = await fetch(oddsUrl(`sports/baseball_mlb/events/${event.id}/odds`, params));
      if (!response.ok) throw new Error(`Live odds request returned HTTP ${response.status}`);
      const eventOdds = await response.json();
      const nextK = {};
      const nextTotals = [];
      const nextH2h = {};
      const nextF5H2h = {};
      const nextGameTotals = [];
      const nextF5Totals = [];
      const setTeamPrice = (store, side, candidate) => {
        if (!side) return;
        if (quoteIsBetter(candidate, store[side])) store[side] = candidate;
      };
      for (const bookmaker of eventOdds.bookmakers || []) {
        for (const market of bookmaker.markets || []) {
          if (market.key === "h2h" || market.key === "h2h_1st_5_innings") {
            const store = market.key === "h2h" ? nextH2h : nextF5H2h;
            for (const outcome of market.outcomes || []) {
              const side = teamSideFromText(outcome.name, game);
              setTeamPrice(store, side, { price: outcome.price, book: bookmaker.title || "Sportsbook" });
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
            }
          }
          // Standard team totals are deliberately accepted from this one Odds
          // API market only—never inferred from full-game or alternate totals.
          if (market.key === "team_totals") {
            for (const outcome of market.outcomes || []) {
              nextTotals.push({
                away: game.away,
                home: game.home,
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
      setOdds({ k: nextK, teamTotals: nextTotals, h2h: nextH2h, totals: nextGameTotals, f5H2h: nextF5H2h, f5Totals: nextF5Totals });
      setMessage("Live odds updated. A price must clear the displayed play-to number before any consideration.");
    } catch (error) {
      setOdds({ k: {}, teamTotals: [], h2h: {}, totals: [], f5H2h: {}, f5Totals: [] });
      setMessage(error instanceof Error ? error.message : "Live odds are unavailable right now.");
    } finally {
      setLoading(false);
    }
  }

  if (!CUSTOMER_FACING) return null;
  if (!game) return <main className="app"><div className="shell"><div className="card info">No customer board is available for this slate.</div></div></main>;
  const favorite = favoriteForGame(game);
  const moneylineFairs = game.moneyline_fairs || {
    away_probability: game.home_win_probability == null ? null : 1 - Number(game.home_win_probability),
    home_probability: game.home_win_probability,
    away_fair: game.home_win_probability == null ? null : americanFromProbability(1 - Number(game.home_win_probability)),
    home_fair: game.home_win_probability == null ? null : americanFromProbability(Number(game.home_win_probability)),
  };
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
  const marketCards = [
    {
      title: `${game.away} moneyline`,
      main: price(moneylineFairs.away_fair),
      meta: [`Fair ${probabilityText(moneylineFairs.away_probability)}`, `Book ${price(odds.h2h.away?.price)}${odds.h2h.away?.book ? ` · ${odds.h2h.away.book}` : ""}`],
      designation: designationForOdds(moneylineFairs.away_fair, odds.h2h.away?.price),
    },
    {
      title: `${game.home} moneyline`,
      main: price(moneylineFairs.home_fair),
      meta: [`Fair ${probabilityText(moneylineFairs.home_probability)}`, `Book ${price(odds.h2h.home?.price)}${odds.h2h.home?.book ? ` · ${odds.h2h.home.book}` : ""}`],
      designation: designationForOdds(moneylineFairs.home_fair, odds.h2h.home?.price),
    },
    {
      title: "Full-game total",
      main: score(game.total),
      meta: [`Fair total`, `Line ${fullTotalPoint ?? "—"}`, `Over ${price(fullOver?.price)}`, `Under ${price(fullUnder?.price)}`],
      designation: lineLean(game.total, fullTotalPoint, fullOver?.price, fullUnder?.price),
    },
    {
      title: "F5 total",
      main: score(f5.total),
      meta: [`Fair F5`, `Line ${f5TotalPoint ?? "—"}`, `Over ${price(f5Over?.price)}`, `Under ${price(f5Under?.price)}`],
      designation: lineLean(f5.total, f5TotalPoint, f5Over?.price, f5Under?.price),
    },
    {
      title: `${game.away} F5 ML`,
      main: price(f5.away_fair ?? americanFromProbability(f5HomeProb == null ? null : 1 - f5HomeProb)),
      meta: [`Fair ${probabilityText(f5HomeProb == null ? null : 1 - f5HomeProb)}`, `Book ${price(odds.f5H2h.away?.price)}`],
      designation: designationForOdds(f5.away_fair ?? americanFromProbability(f5HomeProb == null ? null : 1 - f5HomeProb), odds.f5H2h.away?.price),
    },
    {
      title: `${game.home} F5 ML`,
      main: price(f5.home_fair ?? americanFromProbability(f5HomeProb)),
      meta: [`Fair ${probabilityText(f5HomeProb)}`, `Book ${price(odds.f5H2h.home?.price)}`],
      designation: designationForOdds(f5.home_fair ?? americanFromProbability(f5HomeProb), odds.f5H2h.home?.price),
    },
    {
      title: `${game.away} team total`,
      main: score(game.team_total_fairs?.away ?? game.away_score),
      meta: [`Fair runs`, `O ${awayTTRows.over?.line ?? "—"} ${price(awayTTRows.over?.price)}`, `U ${awayTTRows.under?.line ?? "—"} ${price(awayTTRows.under?.price)}`],
      designation: lineLean(game.team_total_fairs?.away ?? game.away_score, awayTTRows.over?.line ?? awayTTRows.under?.line, awayTTRows.over?.price, awayTTRows.under?.price),
    },
    {
      title: `${game.home} team total`,
      main: score(game.team_total_fairs?.home ?? game.home_score),
      meta: [`Fair runs`, `O ${homeTTRows.over?.line ?? "—"} ${price(homeTTRows.over?.price)}`, `U ${homeTTRows.under?.line ?? "—"} ${price(homeTTRows.under?.price)}`],
      designation: lineLean(game.team_total_fairs?.home ?? game.home_score, homeTTRows.over?.line ?? homeTTRows.under?.line, homeTTRows.over?.price, homeTTRows.under?.price),
    },
  ];

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
          <button type="button" className="refresh" onClick={refreshOdds} disabled={loading}>{loading ? "Refreshing…" : "Refresh live odds"}</button>
        </div>
      </header>

      <div className="shell">
        <section className="card">
          <div className="card-title"><h2>Slate</h2><span className="muted">{games.length} games</span></div>
          <div className="slate">
            {games.map((item, index) => <button className={`game ${index === gameIndex ? "active" : ""}`} type="button" key={`${item.id || index}-${item.away}-${item.home}`} onClick={() => { setGameIndex(index); setOdds({ k: {}, teamTotals: [], h2h: {}, totals: [], f5H2h: {}, f5Totals: [] }); setMessage(""); }}>
              <span><span className="matchup">{item.away} @ {item.home}</span><br /><span className="muted">{item.away_starter || "TBD"} vs {item.home_starter || "TBD"}</span></span>
              <span className="status">{item.time || item.status || "—"}</span>
            </button>)}
          </div>
        </section>

        <section className="card">
          <div className="card-title"><h2>Predicted score</h2><span className="muted">{favorite ? `Favorite ${favorite.team} ${Math.round(favorite.probability * 100)}%` : "Customer forecast"}</span></div>
          <div className="score-grid">
            <div className="score"><span>{game.away}</span><strong>{score(game.away_score)}</strong></div>
            <div className="score"><span>{game.home}</span><strong>{score(game.home_score)}</strong></div>
            <div className="score"><span>Game total</span><strong>{score(game.total)}</strong></div>
          </div>
        </section>

        <section className="card">
          <div className="card-title"><h2>Fair market board</h2><span className="muted">ML · totals · F5 · team totals</span></div>
          <div className="market-grid">
            {marketCards.map((card) => (
              <article className="market-card" key={card.title}>
                <div className="market-top">
                  <h3>{card.title}</h3>
                  <span className={`pill ${card.designation.tone}`}>{card.designation.label}</span>
                </div>
                <div className="market-main">{card.main}</div>
                <div className="market-meta">{card.meta.map((item) => <span key={item}>{item}</span>)}</div>
                <p className="muted">{card.designation.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="card">
          <div className="card-title"><h2>Matchup synthesis</h2><span className="muted">Published outlook</span></div>
          <div className="copy">
            {summarizeSynthesis(game).map((line) => <p key={line}>{line}</p>)}
            <div className="notice">Customer forecasts are informational. Starter conflicts, missing starters, and stale probable data are suppressed from the slate instead of published.</div>
          </div>
        </section>

        <section className="card">
          <div className="card-title">
            <h2>Pitcher K prop fairs</h2>
            <div className="segmented" aria-label="K projection mode">
              <button type="button" className={kMode === "sharp" ? "active" : ""} onClick={() => setKMode("sharp")}>Sharp</button>
              <button type="button" className={kMode === "base" ? "active" : ""} onClick={() => setKMode("base")}>Base</button>
            </div>
          </div>
          <div className="angle-list">
            {(game.prop_angles || []).length ? game.prop_angles.map((angle, index) => {
              const fair = kMode === "base" && angle.base_fair != null ? angle.base_fair : angle.fair;
              const underFair = kMode === "base" && angle.base_under_fair != null ? angle.base_under_fair : angle.under_fair;
              const projected = kMode === "base" && angle.base_projected != null ? angle.base_projected : angle.projected;
              const playTo = kMode === "base" && angle.base_play_to != null ? angle.base_play_to : angle.play_to;
              const underPlayTo = kMode === "base" && angle.base_under_play_to != null ? angle.base_under_play_to : angle.under_play_to;
              const live = odds.k[quoteKey(angle.player, "Over", angle.line)];
              const liveUnder = odds.k[quoteKey(angle.player, "Under", angle.line)];
              const bookPrice = live?.price ?? angle.book;
              const designation = designationForOdds(fair, bookPrice);
              return <article className="angle" key={`${angle.player}-${angle.line}-${index}`}>
                <div className="angle-top"><div><h3>{angle.player || "Starter"} K line {angle.line ?? "—"}</h3><p className="muted">{kMode === "sharp" ? "Sharp K view" : "Base K view"} · projected {projected ?? "—"} K. {angle.explainer}</p></div><span className={`pill ${designation.tone}`}>{designation.label}</span></div>
                <div className="prices"><span>Over fair <b>{price(fair)}</b></span><span>Over book <b>{price(bookPrice)}</b>{live?.book ? ` · ${live.book}` : ""}</span><span>Play-to <b>{price(playTo)}</b></span></div>
                <div className="prices"><span>Under fair <b>{price(underFair)}</b></span><span>Under book <b>{price(liveUnder?.price)}</b>{liveUnder?.book ? ` · ${liveUnder.book}` : ""}</span><span>Play-to <b>{price(underPlayTo)}</b></span></div>
                <p className="muted">{designation.detail}</p>
              </article>;
            }) : <div className="info">No customer-safe prop angle is available for this game.</div>}
          </div>
        </section>

        <section className="card">
          <div className="card-title"><h2>Batter K Targets</h2><span className="muted">Swing-and-miss matchup flags</span></div>
          {(game.k_targets || []).length ? <table className="table"><thead><tr><th>Batter</th><th>Matchup</th><th>Whiff / chase</th><th>Why</th></tr></thead><tbody>
            {(game.k_targets || []).map((target, index) => (
              <tr key={`${target.batter}-${target.pitcher}-${index}`}>
                <td><b>{target.batter || "TBD"}</b><br /><span className="muted">{target.team || "—"} · {target.label || "K target"}</span></td>
                <td>{target.pitcher || "Starter"}<br /><span className="muted">{target.pitch_name || target.pitch_type || "Pitch"} · {target.usage ?? "—"}% usage</span></td>
                <td>{target.whiff_rate == null ? "—" : `${Math.round(Number(target.whiff_rate) * 100)}% whiff`}<br /><span className="muted">{target.chase_rate == null ? "—" : `${Math.round(Number(target.chase_rate) * 100)}% chase`}</span></td>
                <td>{target.explainer || "Batter whiff profile lines up with a pitch this starter uses."}</td>
              </tr>
            ))}
          </tbody></table> : <div className="info">No batter K target cleared the pitch-mix whiff screen for this game.</div>}
        </section>

        <div className="info">{message || BOARD.notice}</div>
      </div>
    </main>
  );
}

export default CustomerBoard;
