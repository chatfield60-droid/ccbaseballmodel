import React, { useEffect, useMemo, useState } from "react";
const BOARD = {
  "date": "2026-07-12",
  "generated": "2026-07-12T09:10:18+00:00",
  "games": [
    {
      "id": 823358,
      "away": "MIL",
      "home": "PIT",
      "away_name": "Milwaukee Brewers",
      "home_name": "Pittsburgh Pirates",
      "away_starter": "Robert Gasser",
      "home_starter": "Paul Skenes",
      "status": "Scheduled",
      "time": "12:15 PM ET",
      "day_night": "day",
      "away_score": 4.9,
      "home_score": 5.0,
      "total": 9.9,
      "home_win_probability": 0.52,
      "moneyline_fairs": {
        "away_probability": 0.48,
        "home_probability": 0.52,
        "away_fair": 108,
        "home_fair": -108
      },
      "team_total_fairs": {
        "away": 4.9,
        "home": 5.0
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
      "batter_prop_angles": [
        {
          "player": "Jake Mangum",
          "team": "PIT",
          "market": "Batter hits",
          "side": "Over",
          "line": 0.5,
          "probability": 0.74,
          "fair": -285,
          "play_to": -275,
          "pitcher": "Robert Gasser",
          "pitch_type": "ST",
          "pitch_name": "Sweeper",
          "usage": 28.1,
          "ba": 0.488,
          "slg": 0.659,
          "barrel_rate": 0.0,
          "label": "Strong angle",
          "explainer": "Jake Mangum hits angle vs Robert Gasser on Sweeper (28% usage): high contact fit, starter shows this pitch often, hit-market profile.",
          "metrics": "0.488 BA · 0.659 SLG · 0% barrel"
        },
        {
          "player": "Jake Bauers",
          "team": "MIL",
          "market": "Batter hits",
          "side": "Over",
          "line": 0.5,
          "probability": 0.736,
          "fair": -279,
          "play_to": -269,
          "pitcher": "Paul Skenes",
          "pitch_type": "ST",
          "pitch_name": "Sweeper",
          "usage": 15.5,
          "ba": 0.425,
          "slg": 1.033,
          "barrel_rate": 0.278,
          "label": "Strong angle",
          "explainer": "Jake Bauers hits angle vs Paul Skenes on Sweeper (16% usage): high contact fit, hit-market profile.",
          "metrics": "0.425 BA · 1.033 SLG · 28% barrel"
        },
        {
          "player": "Bryan Reynolds",
          "team": "PIT",
          "market": "Batter hits",
          "side": "Over",
          "line": 0.5,
          "probability": 0.733,
          "fair": -275,
          "play_to": -265,
          "pitcher": "Robert Gasser",
          "pitch_type": "SI",
          "pitch_name": "Sinker",
          "usage": 25.5,
          "ba": 0.415,
          "slg": 0.564,
          "barrel_rate": 0.083,
          "label": "Strong angle",
          "explainer": "Bryan Reynolds hits angle vs Robert Gasser on Sinker (26% usage): high contact fit, starter shows this pitch often, hit-market profile.",
          "metrics": "0.415 BA · 0.564 SLG · 8% barrel"
        },
        {
          "player": "Konnor Griffin",
          "team": "PIT",
          "market": "Batter hits",
          "side": "Over",
          "line": 0.5,
          "probability": 0.732,
          "fair": -273,
          "play_to": -263,
          "pitcher": "Robert Gasser",
          "pitch_type": "FC",
          "pitch_name": "Cutter",
          "usage": 16.8,
          "ba": 0.412,
          "slg": 0.588,
          "barrel_rate": 0.143,
          "label": "Strong angle",
          "explainer": "Konnor Griffin hits angle vs Robert Gasser on Cutter (17% usage): high contact fit, hit-market profile.",
          "metrics": "0.412 BA · 0.588 SLG · 14% barrel"
        },
        {
          "player": "Andrew Vaughn",
          "team": "MIL",
          "market": "Batter hits",
          "side": "Over",
          "line": 0.5,
          "probability": 0.729,
          "fair": -269,
          "play_to": -259,
          "pitcher": "Paul Skenes",
          "pitch_type": "FF",
          "pitch_name": "4-Seam Fastball",
          "usage": 39.2,
          "ba": 0.404,
          "slg": 0.787,
          "barrel_rate": 0.079,
          "label": "Strong angle",
          "explainer": "Andrew Vaughn hits angle vs Paul Skenes on 4-Seam Fastball (39% usage): high contact fit, starter shows this pitch often, hit-market profile.",
          "metrics": "0.404 BA · 0.787 SLG · 8% barrel"
        },
        {
          "player": "Christian Yelich",
          "team": "MIL",
          "market": "Batter hits",
          "side": "Over",
          "line": 0.5,
          "probability": 0.706,
          "fair": -241,
          "play_to": -231,
          "pitcher": "Paul Skenes",
          "pitch_type": "CH",
          "pitch_name": "Changeup",
          "usage": 16.0,
          "ba": 0.347,
          "slg": 0.728,
          "barrel_rate": 0.104,
          "label": "Strong angle",
          "explainer": "Christian Yelich hits angle vs Paul Skenes on Changeup (16% usage): hit-market profile.",
          "metrics": "0.347 BA · 0.728 SLG · 10% barrel"
        },
        {
          "player": "Jake Bauers",
          "team": "MIL",
          "market": "Batter TB",
          "side": "Over",
          "line": 1.5,
          "probability": 0.507,
          "fair": -103,
          "play_to": -93,
          "pitcher": "Paul Skenes",
          "pitch_type": "ST",
          "pitch_name": "Sweeper",
          "usage": 15.5,
          "ba": 0.425,
          "slg": 1.033,
          "barrel_rate": 0.278,
          "label": "Strong angle",
          "explainer": "Jake Bauers TB angle vs Paul Skenes on Sweeper (16% usage): extra-base damage fit, barrel-backed contact.",
          "metrics": "0.425 BA · 1.033 SLG · 28% barrel"
        },
        {
          "player": "Esmerlyn Valdez",
          "team": "PIT",
          "market": "Batter TB",
          "side": "Over",
          "line": 1.5,
          "probability": 0.475,
          "fair": 111,
          "play_to": 121,
          "pitcher": "Robert Gasser",
          "pitch_type": "FF",
          "pitch_name": "4-Seam Fastball",
          "usage": 22.9,
          "ba": 0.324,
          "slg": 0.859,
          "barrel_rate": 0.279,
          "label": "Strong angle",
          "explainer": "Esmerlyn Valdez TB angle vs Robert Gasser on 4-Seam Fastball (23% usage): extra-base damage fit, barrel-backed contact, starter shows this pitch often.",
          "metrics": "0.324 BA · 0.859 SLG · 28% barrel"
        },
        {
          "player": "Andrew Vaughn",
          "team": "MIL",
          "market": "Batter TB",
          "side": "Over",
          "line": 1.5,
          "probability": 0.46,
          "fair": 118,
          "play_to": 128,
          "pitcher": "Paul Skenes",
          "pitch_type": "FF",
          "pitch_name": "4-Seam Fastball",
          "usage": 39.2,
          "ba": 0.404,
          "slg": 0.787,
          "barrel_rate": 0.079,
          "label": "Strong angle",
          "explainer": "Andrew Vaughn TB angle vs Paul Skenes on 4-Seam Fastball (39% usage): extra-base damage fit, starter shows this pitch often.",
          "metrics": "0.404 BA · 0.787 SLG · 8% barrel"
        },
        {
          "player": "Christian Yelich",
          "team": "MIL",
          "market": "Batter TB",
          "side": "Over",
          "line": 1.5,
          "probability": 0.446,
          "fair": 124,
          "play_to": 134,
          "pitcher": "Paul Skenes",
          "pitch_type": "CH",
          "pitch_name": "Changeup",
          "usage": 16.0,
          "ba": 0.347,
          "slg": 0.728,
          "barrel_rate": 0.104,
          "label": "Strong angle",
          "explainer": "Christian Yelich TB angle vs Paul Skenes on Changeup (16% usage): extra-base damage fit, barrel-backed contact.",
          "metrics": "0.347 BA · 0.728 SLG · 10% barrel"
        }
      ],
      "k_targets": [
        {
          "batter": "Jake Bauers",
          "team": "MIL",
          "pitcher": "Paul Skenes",
          "pitch_type": "ST",
          "pitch_name": "Sweeper",
          "usage": 15.5,
          "whiff_rate": 0.328,
          "chase_rate": 0.2,
          "market": "Batter strikeouts",
          "side": "Over",
          "line": 0.5,
          "probability": 0.52,
          "label": "K target",
          "explainer": "Jake Bauers has a high whiff profile against Sweeper; Paul Skenes throws it 16% of the time.",
          "fair": -108,
          "play_to": -98
        },
        {
          "batter": "Esmerlyn Valdez",
          "team": "PIT",
          "pitcher": "Robert Gasser",
          "pitch_type": "FF",
          "pitch_name": "4-Seam Fastball",
          "usage": 22.9,
          "whiff_rate": 0.423,
          "chase_rate": 0.281,
          "market": "Batter strikeouts",
          "side": "Over",
          "line": 0.5,
          "probability": 0.624,
          "label": "Strong K target",
          "explainer": "Esmerlyn Valdez has a high whiff profile against 4-Seam Fastball; Robert Gasser throws it 23% of the time.",
          "fair": -166,
          "play_to": -156
        }
      ],
      "prop_angles": [
        {
          "player": "Robert Gasser",
          "market": "Pitcher strikeouts",
          "side": "Over",
          "line": 5.5,
          "projected": 6.1,
          "base_projected": 5.2,
          "fair": -180,
          "under_fair": 180,
          "base_fair": 135,
          "base_under_fair": -135,
          "book": null,
          "play_to": -170,
          "under_play_to": 190,
          "base_play_to": 145,
          "base_under_play_to": -125,
          "designation": "Watch price",
          "explainer": "Ceiling game view: starts from base K workload, adds chase/whiff upside, and suppresses the ceiling when the starter's damage profile threatens early traffic or shorter leash."
        },
        {
          "player": "Paul Skenes",
          "market": "Pitcher strikeouts",
          "side": "Over",
          "line": 6.5,
          "projected": 8.2,
          "base_projected": 6.9,
          "fair": -186,
          "under_fair": 186,
          "base_fair": -144,
          "base_under_fair": 144,
          "book": null,
          "play_to": -176,
          "under_play_to": 196,
          "base_play_to": -134,
          "base_under_play_to": 154,
          "designation": "Watch price",
          "explainer": "Ceiling game view: starts from base K workload, adds chase/whiff upside, and suppresses the ceiling when the starter's damage profile threatens early traffic or shorter leash."
        }
      ]
    },
    {
      "id": 824814,
      "away": "KC",
      "home": "BAL",
      "away_name": "Kansas City Royals",
      "home_name": "Baltimore Orioles",
      "away_starter": "Seth Lugo",
      "home_starter": "Shane Baz",
      "status": "Scheduled",
      "time": "1:35 PM ET",
      "day_night": "day",
      "away_score": 4.3,
      "home_score": 4.3,
      "total": 8.6,
      "home_win_probability": 0.5,
      "moneyline_fairs": {
        "away_probability": 0.5,
        "home_probability": 0.5,
        "away_fair": -100,
        "home_fair": -100
      },
      "team_total_fairs": {
        "away": 4.3,
        "home": 4.3
      },
      "f5": {
        "away_score": 2.3,
        "home_score": 2.2,
        "total": 4.5,
        "home_win_probability": 0.474,
        "away_fair": -111,
        "home_fair": 111
      },
      "synthesis": "The board sees a balanced run environment. Neither side has a meaningful projected scoring edge.",
      "batter_prop_angles": [
        {
          "player": "Adley Rutschman",
          "team": "BAL",
          "market": "Batter hits",
          "side": "Over",
          "line": 0.5,
          "probability": 0.74,
          "fair": -284,
          "play_to": -274,
          "pitcher": "Seth Lugo",
          "pitch_type": "FC",
          "pitch_name": "Cutter",
          "usage": 16.8,
          "ba": 0.437,
          "slg": 1.225,
          "barrel_rate": 0.352,
          "label": "Strong angle",
          "explainer": "Adley Rutschman hits angle vs Seth Lugo on Cutter (17% usage): high contact fit, hit-market profile.",
          "metrics": "0.437 BA · 1.225 SLG · 35% barrel"
        },
        {
          "player": "Carter Jensen",
          "team": "KC",
          "market": "Batter hits",
          "side": "Over",
          "line": 0.5,
          "probability": 0.733,
          "fair": -275,
          "play_to": -265,
          "pitcher": "Shane Baz",
          "pitch_type": "FC",
          "pitch_name": "Cutter",
          "usage": 17.5,
          "ba": 0.415,
          "slg": 0.824,
          "barrel_rate": 0.2,
          "label": "Strong angle",
          "explainer": "Carter Jensen hits angle vs Shane Baz on Cutter (18% usage): high contact fit, hit-market profile.",
          "metrics": "0.415 BA · 0.824 SLG · 20% barrel"
        },
        {
          "player": "Blaze Alexander",
          "team": "BAL",
          "market": "Batter hits",
          "side": "Over",
          "line": 0.5,
          "probability": 0.728,
          "fair": -267,
          "play_to": -257,
          "pitcher": "Seth Lugo",
          "pitch_type": "CU",
          "pitch_name": "Curveball",
          "usage": 15.0,
          "ba": 0.4,
          "slg": 0.48,
          "barrel_rate": 0.0,
          "label": "Strong angle",
          "explainer": "Blaze Alexander hits angle vs Seth Lugo on Curveball (15% usage): high contact fit, hit-market profile.",
          "metrics": "0.400 BA · 0.480 SLG · 0% barrel"
        },
        {
          "player": "Colton Cowser",
          "team": "BAL",
          "market": "Batter hits",
          "side": "Over",
          "line": 0.5,
          "probability": 0.717,
          "fair": -254,
          "play_to": -244,
          "pitcher": "Seth Lugo",
          "pitch_type": "SI",
          "pitch_name": "Sinker",
          "usage": 19.1,
          "ba": 0.372,
          "slg": 0.915,
          "barrel_rate": 0.27,
          "label": "Strong angle",
          "explainer": "Colton Cowser hits angle vs Seth Lugo on Sinker (19% usage): high contact fit, starter shows this pitch often, hit-market profile.",
          "metrics": "0.372 BA · 0.915 SLG · 27% barrel"
        },
        {
          "player": "Adley Rutschman",
          "team": "BAL",
          "market": "Batter TB",
          "side": "Over",
          "line": 1.5,
          "probability": 0.537,
          "fair": -116,
          "play_to": -106,
          "pitcher": "Seth Lugo",
          "pitch_type": "FC",
          "pitch_name": "Cutter",
          "usage": 16.8,
          "ba": 0.437,
          "slg": 1.225,
          "barrel_rate": 0.352,
          "label": "Strong angle",
          "explainer": "Adley Rutschman TB angle vs Seth Lugo on Cutter (17% usage): extra-base damage fit, barrel-backed contact.",
          "metrics": "0.437 BA · 1.225 SLG · 35% barrel"
        },
        {
          "player": "Colton Cowser",
          "team": "BAL",
          "market": "Batter TB",
          "side": "Over",
          "line": 1.5,
          "probability": 0.486,
          "fair": 106,
          "play_to": 116,
          "pitcher": "Seth Lugo",
          "pitch_type": "SI",
          "pitch_name": "Sinker",
          "usage": 19.1,
          "ba": 0.372,
          "slg": 0.915,
          "barrel_rate": 0.27,
          "label": "Strong angle",
          "explainer": "Colton Cowser TB angle vs Seth Lugo on Sinker (19% usage): extra-base damage fit, barrel-backed contact, starter shows this pitch often.",
          "metrics": "0.372 BA · 0.915 SLG · 27% barrel"
        },
        {
          "player": "Carter Jensen",
          "team": "KC",
          "market": "Batter TB",
          "side": "Over",
          "line": 1.5,
          "probability": 0.467,
          "fair": 114,
          "play_to": 124,
          "pitcher": "Shane Baz",
          "pitch_type": "FC",
          "pitch_name": "Cutter",
          "usage": 17.5,
          "ba": 0.415,
          "slg": 0.824,
          "barrel_rate": 0.2,
          "label": "Strong angle",
          "explainer": "Carter Jensen TB angle vs Shane Baz on Cutter (18% usage): extra-base damage fit, barrel-backed contact.",
          "metrics": "0.415 BA · 0.824 SLG · 20% barrel"
        },
        {
          "player": "Adley Rutschman",
          "team": "BAL",
          "market": "Batter HR",
          "side": "Over",
          "line": 0.5,
          "probability": 0.166,
          "fair": 502,
          "play_to": 512,
          "pitcher": "Seth Lugo",
          "pitch_type": "FC",
          "pitch_name": "Cutter",
          "usage": 16.8,
          "ba": 0.437,
          "slg": 1.225,
          "barrel_rate": 0.352,
          "label": "Strong angle",
          "explainer": "Adley Rutschman HR angle vs Seth Lugo on Cutter (17% usage): home-run barrel signal, power damage fit.",
          "metrics": "0.437 BA · 1.225 SLG · 35% barrel"
        },
        {
          "player": "Jac Caglianone",
          "team": "KC",
          "market": "Batter HR",
          "side": "Over",
          "line": 0.5,
          "probability": 0.148,
          "fair": 575,
          "play_to": 585,
          "pitcher": "Shane Baz",
          "pitch_type": "FF",
          "pitch_name": "4-Seam Fastball",
          "usage": 33.1,
          "ba": 0.308,
          "slg": 0.683,
          "barrel_rate": 0.286,
          "label": "Strong angle",
          "explainer": "Jac Caglianone HR angle vs Shane Baz on 4-Seam Fastball (33% usage): home-run barrel signal, starter shows this pitch often.",
          "metrics": "0.308 BA · 0.683 SLG · 29% barrel"
        },
        {
          "player": "Colton Cowser",
          "team": "BAL",
          "market": "Batter HR",
          "side": "Over",
          "line": 0.5,
          "probability": 0.143,
          "fair": 597,
          "play_to": 607,
          "pitcher": "Seth Lugo",
          "pitch_type": "SI",
          "pitch_name": "Sinker",
          "usage": 19.1,
          "ba": 0.372,
          "slg": 0.915,
          "barrel_rate": 0.27,
          "label": "Strong angle",
          "explainer": "Colton Cowser HR angle vs Seth Lugo on Sinker (19% usage): home-run barrel signal, power damage fit, starter shows this pitch often.",
          "metrics": "0.372 BA · 0.915 SLG · 27% barrel"
        }
      ],
      "k_targets": [
        {
          "batter": "Blaze Alexander",
          "team": "BAL",
          "pitcher": "Seth Lugo",
          "pitch_type": "CU",
          "pitch_name": "Curveball",
          "usage": 15.0,
          "whiff_rate": 0.308,
          "chase_rate": 0.344,
          "market": "Batter strikeouts",
          "side": "Over",
          "line": 0.5,
          "probability": 0.518,
          "label": "K target",
          "explainer": "Blaze Alexander has a high whiff profile against Curveball; Seth Lugo throws it 15% of the time.",
          "fair": -107,
          "play_to": -97
        },
        {
          "batter": "Gunnar Henderson",
          "team": "BAL",
          "pitcher": "Seth Lugo",
          "pitch_type": "ST",
          "pitch_name": "Sweeper",
          "usage": 10.3,
          "whiff_rate": 0.356,
          "chase_rate": 0.353,
          "market": "Batter strikeouts",
          "side": "Over",
          "line": 0.5,
          "probability": 0.517,
          "label": "K target",
          "explainer": "Gunnar Henderson has a high whiff profile against Sweeper; Seth Lugo throws it 10% of the time.",
          "fair": -107,
          "play_to": -97
        }
      ],
      "prop_angles": [
        {
          "player": "Seth Lugo",
          "market": "Pitcher strikeouts",
          "side": "Over",
          "line": 4.5,
          "projected": 5.3,
          "base_projected": 4.5,
          "fair": -186,
          "under_fair": 186,
          "base_fair": -102,
          "base_under_fair": 102,
          "book": null,
          "play_to": -176,
          "under_play_to": 196,
          "base_play_to": -92,
          "base_under_play_to": 112,
          "designation": "Watch price",
          "explainer": "Ceiling game view: starts from base K workload, adds chase/whiff upside, and suppresses the ceiling when the starter's damage profile threatens early traffic or shorter leash."
        },
        {
          "player": "Shane Baz",
          "market": "Pitcher strikeouts",
          "side": "Over",
          "line": 5.5,
          "projected": 6.1,
          "base_projected": 5.1,
          "fair": -179,
          "under_fair": 179,
          "base_fair": 147,
          "base_under_fair": -147,
          "book": null,
          "play_to": -169,
          "under_play_to": 189,
          "base_play_to": 157,
          "base_under_play_to": -137,
          "designation": "Watch price",
          "explainer": "Ceiling game view: starts from base K workload, adds chase/whiff upside, and suppresses the ceiling when the starter's damage profile threatens early traffic or shorter leash."
        }
      ]
    },
    {
      "id": 822708,
      "away": "NYY",
      "home": "WSH",
      "away_name": "New York Yankees",
      "home_name": "Washington Nationals",
      "away_starter": "Will Warren",
      "home_starter": "Cade Cavalli",
      "status": "Scheduled",
      "time": "1:35 PM ET",
      "day_night": "day",
      "away_score": 4.8,
      "home_score": 4.5,
      "total": 9.3,
      "home_win_probability": 0.44,
      "moneyline_fairs": {
        "away_probability": 0.56,
        "home_probability": 0.44,
        "away_fair": -127,
        "home_fair": 127
      },
      "team_total_fairs": {
        "away": 4.8,
        "home": 4.5
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
      "batter_prop_angles": [
        {
          "player": "Jazz Chisholm Jr.",
          "team": "NYY",
          "market": "Batter hits",
          "side": "Over",
          "line": 0.5,
          "probability": 0.73,
          "fair": -270,
          "play_to": -260,
          "pitcher": "Cade Cavalli",
          "pitch_type": "SI",
          "pitch_name": "Sinker",
          "usage": 15.2,
          "ba": 0.406,
          "slg": 0.656,
          "barrel_rate": 0.077,
          "label": "Strong angle",
          "explainer": "Jazz Chisholm Jr. hits angle vs Cade Cavalli on Sinker (15% usage): high contact fit, hit-market profile.",
          "metrics": "0.406 BA · 0.656 SLG · 8% barrel"
        },
        {
          "player": "Ben Rice",
          "team": "NYY",
          "market": "Batter hits",
          "side": "Over",
          "line": 0.5,
          "probability": 0.715,
          "fair": -251,
          "play_to": -241,
          "pitcher": "Cade Cavalli",
          "pitch_type": "FF",
          "pitch_name": "4-Seam Fastball",
          "usage": 34.6,
          "ba": 0.366,
          "slg": 0.981,
          "barrel_rate": 0.32,
          "label": "Strong angle",
          "explainer": "Ben Rice hits angle vs Cade Cavalli on 4-Seam Fastball (35% usage): high contact fit, starter shows this pitch often, hit-market profile.",
          "metrics": "0.366 BA · 0.981 SLG · 32% barrel"
        },
        {
          "player": "Nasim Nuñez",
          "team": "WSH",
          "market": "Batter hits",
          "side": "Over",
          "line": 0.5,
          "probability": 0.714,
          "fair": -250,
          "play_to": -240,
          "pitcher": "Will Warren",
          "pitch_type": "ST",
          "pitch_name": "Sweeper",
          "usage": 19.6,
          "ba": 0.364,
          "slg": 0.364,
          "barrel_rate": 0.0,
          "label": "Strong angle",
          "explainer": "Nasim Nuñez hits angle vs Will Warren on Sweeper (20% usage): high contact fit, starter shows this pitch often, hit-market profile.",
          "metrics": "0.364 BA · 0.364 SLG · 0% barrel"
        },
        {
          "player": "CJ Abrams",
          "team": "WSH",
          "market": "Batter hits",
          "side": "Over",
          "line": 0.5,
          "probability": 0.707,
          "fair": -241,
          "play_to": -231,
          "pitcher": "Will Warren",
          "pitch_type": "FF",
          "pitch_name": "4-Seam Fastball",
          "usage": 38.8,
          "ba": 0.348,
          "slg": 0.584,
          "barrel_rate": 0.11,
          "label": "Strong angle",
          "explainer": "CJ Abrams hits angle vs Will Warren on 4-Seam Fastball (39% usage): starter shows this pitch often, hit-market profile.",
          "metrics": "0.348 BA · 0.584 SLG · 11% barrel"
        },
        {
          "player": "Ben Rice",
          "team": "NYY",
          "market": "Batter TB",
          "side": "Over",
          "line": 1.5,
          "probability": 0.498,
          "fair": 101,
          "play_to": 111,
          "pitcher": "Cade Cavalli",
          "pitch_type": "FF",
          "pitch_name": "4-Seam Fastball",
          "usage": 34.6,
          "ba": 0.366,
          "slg": 0.981,
          "barrel_rate": 0.32,
          "label": "Strong angle",
          "explainer": "Ben Rice TB angle vs Cade Cavalli on 4-Seam Fastball (35% usage): extra-base damage fit, barrel-backed contact, starter shows this pitch often.",
          "metrics": "0.366 BA · 0.981 SLG · 32% barrel"
        },
        {
          "player": "Ben Rice",
          "team": "NYY",
          "market": "Batter HR",
          "side": "Over",
          "line": 0.5,
          "probability": 0.158,
          "fair": 534,
          "play_to": 544,
          "pitcher": "Cade Cavalli",
          "pitch_type": "FF",
          "pitch_name": "4-Seam Fastball",
          "usage": 34.6,
          "ba": 0.366,
          "slg": 0.981,
          "barrel_rate": 0.32,
          "label": "Strong angle",
          "explainer": "Ben Rice HR angle vs Cade Cavalli on 4-Seam Fastball (35% usage): home-run barrel signal, power damage fit, starter shows this pitch often.",
          "metrics": "0.366 BA · 0.981 SLG · 32% barrel"
        },
        {
          "player": "Daylen Lile",
          "team": "WSH",
          "market": "Batter hits",
          "side": "Over",
          "line": 0.5,
          "probability": 0.697,
          "fair": -230,
          "play_to": -220,
          "pitcher": "Will Warren",
          "pitch_type": "SI",
          "pitch_name": "Sinker",
          "usage": 27.9,
          "ba": 0.327,
          "slg": 0.523,
          "barrel_rate": 0.05,
          "label": "Angle",
          "explainer": "Daylen Lile hits angle vs Will Warren on Sinker (28% usage): starter shows this pitch often, hit-market profile.",
          "metrics": "0.327 BA · 0.523 SLG · 5% barrel"
        },
        {
          "player": "Jazz Chisholm Jr.",
          "team": "NYY",
          "market": "Batter TB",
          "side": "Over",
          "line": 1.5,
          "probability": 0.429,
          "fair": 133,
          "play_to": 143,
          "pitcher": "Cade Cavalli",
          "pitch_type": "SI",
          "pitch_name": "Sinker",
          "usage": 15.2,
          "ba": 0.406,
          "slg": 0.656,
          "barrel_rate": 0.077,
          "label": "Angle",
          "explainer": "Jazz Chisholm Jr. TB angle vs Cade Cavalli on Sinker (15% usage): extra-base damage fit.",
          "metrics": "0.406 BA · 0.656 SLG · 8% barrel"
        },
        {
          "player": "CJ Abrams",
          "team": "WSH",
          "market": "Batter TB",
          "side": "Over",
          "line": 1.5,
          "probability": 0.411,
          "fair": 143,
          "play_to": 153,
          "pitcher": "Will Warren",
          "pitch_type": "FF",
          "pitch_name": "4-Seam Fastball",
          "usage": 38.8,
          "ba": 0.348,
          "slg": 0.584,
          "barrel_rate": 0.11,
          "label": "Angle",
          "explainer": "CJ Abrams TB angle vs Will Warren on 4-Seam Fastball (39% usage): barrel-backed contact, starter shows this pitch often.",
          "metrics": "0.348 BA · 0.584 SLG · 11% barrel"
        },
        {
          "player": "CJ Abrams",
          "team": "WSH",
          "market": "Batter HR",
          "side": "Over",
          "line": 0.5,
          "probability": 0.095,
          "fair": 957,
          "play_to": 967,
          "pitcher": "Will Warren",
          "pitch_type": "FF",
          "pitch_name": "4-Seam Fastball",
          "usage": 38.8,
          "ba": 0.348,
          "slg": 0.584,
          "barrel_rate": 0.11,
          "label": "Angle",
          "explainer": "CJ Abrams HR angle vs Will Warren on 4-Seam Fastball (39% usage): starter shows this pitch often.",
          "metrics": "0.348 BA · 0.584 SLG · 11% barrel"
        }
      ],
      "k_targets": [
        {
          "batter": "Keibert Ruiz",
          "team": "WSH",
          "pitcher": "Will Warren",
          "pitch_type": "CH",
          "pitch_name": "Changeup",
          "usage": 10.2,
          "whiff_rate": 0.308,
          "chase_rate": 0.5,
          "market": "Batter strikeouts",
          "side": "Over",
          "line": 0.5,
          "probability": 0.502,
          "label": "K target",
          "explainer": "Keibert Ruiz has a high whiff profile against Changeup; Will Warren throws it 10% of the time.",
          "fair": -101,
          "play_to": -91
        }
      ],
      "prop_angles": [
        {
          "player": "Will Warren",
          "market": "Pitcher strikeouts",
          "side": "Over",
          "line": 5.5,
          "projected": 6.1,
          "base_projected": 5.2,
          "fair": -174,
          "under_fair": 174,
          "base_fair": 134,
          "base_under_fair": -134,
          "book": null,
          "play_to": -164,
          "under_play_to": 184,
          "base_play_to": 144,
          "base_under_play_to": -124,
          "designation": "Watch price",
          "explainer": "Ceiling game view: starts from base K workload, adds chase/whiff upside, and suppresses the ceiling when the starter's damage profile threatens early traffic or shorter leash."
        },
        {
          "player": "Cade Cavalli",
          "market": "Pitcher strikeouts",
          "side": "Over",
          "line": 5.5,
          "projected": 6.4,
          "base_projected": 5.4,
          "fair": -186,
          "under_fair": 186,
          "base_fair": 108,
          "base_under_fair": -108,
          "book": null,
          "play_to": -176,
          "under_play_to": 196,
          "base_play_to": 118,
          "base_under_play_to": -98,
          "designation": "Watch price",
          "explainer": "Ceiling game view: starts from base K workload, adds chase/whiff upside, and suppresses the ceiling when the starter's damage profile threatens early traffic or shorter leash."
        }
      ]
    },
    {
      "id": 824491,
      "away": "CHC",
      "home": "CIN",
      "away_name": "Chicago Cubs",
      "home_name": "Cincinnati Reds",
      "away_starter": "Matthew Boyd",
      "home_starter": "Andrew Abbott",
      "status": "Scheduled",
      "time": "1:40 PM ET",
      "day_night": "day",
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
        "away_score": 2.3,
        "home_score": 2.3,
        "total": 4.6,
        "home_win_probability": 0.5,
        "away_fair": -100,
        "home_fair": -100
      },
      "synthesis": "The board sees a balanced run environment. Neither side has a meaningful projected scoring edge.",
      "batter_prop_angles": [
        {
          "player": "Nico Hoerner",
          "team": "CHC",
          "market": "Batter hits",
          "side": "Over",
          "line": 0.5,
          "probability": 0.74,
          "fair": -285,
          "play_to": -275,
          "pitcher": "Andrew Abbott",
          "pitch_type": "ST",
          "pitch_name": "Sweeper",
          "usage": 20.9,
          "ba": 0.57,
          "slg": 0.816,
          "barrel_rate": 0.0,
          "label": "Strong angle",
          "explainer": "Nico Hoerner hits angle vs Andrew Abbott on Sweeper (21% usage): high contact fit, starter shows this pitch often, hit-market profile.",
          "metrics": "0.570 BA · 0.816 SLG · 0% barrel"
        },
        {
          "player": "Nico Hoerner",
          "team": "CHC",
          "market": "Batter TB",
          "side": "Over",
          "line": 1.5,
          "probability": 0.466,
          "fair": 115,
          "play_to": 125,
          "pitcher": "Andrew Abbott",
          "pitch_type": "ST",
          "pitch_name": "Sweeper",
          "usage": 20.9,
          "ba": 0.57,
          "slg": 0.816,
          "barrel_rate": 0.0,
          "label": "Strong angle",
          "explainer": "Nico Hoerner TB angle vs Andrew Abbott on Sweeper (21% usage): extra-base damage fit, starter shows this pitch often.",
          "metrics": "0.570 BA · 0.816 SLG · 0% barrel"
        },
        {
          "player": "Sal Stewart",
          "team": "CIN",
          "market": "Batter HR",
          "side": "Over",
          "line": 0.5,
          "probability": 0.129,
          "fair": 675,
          "play_to": 685,
          "pitcher": "Matthew Boyd",
          "pitch_type": "FF",
          "pitch_name": "4-Seam Fastball",
          "usage": 49.2,
          "ba": 0.304,
          "slg": 0.577,
          "barrel_rate": 0.221,
          "label": "Strong angle",
          "explainer": "Sal Stewart HR angle vs Matthew Boyd on 4-Seam Fastball (49% usage): home-run barrel signal, starter shows this pitch often.",
          "metrics": "0.304 BA · 0.577 SLG · 22% barrel"
        },
        {
          "player": "Matt Shaw",
          "team": "CHC",
          "market": "Batter hits",
          "side": "Over",
          "line": 0.5,
          "probability": 0.697,
          "fair": -230,
          "play_to": -220,
          "pitcher": "Andrew Abbott",
          "pitch_type": "FF",
          "pitch_name": "4-Seam Fastball",
          "usage": 45.4,
          "ba": 0.328,
          "slg": 0.694,
          "barrel_rate": 0.098,
          "label": "Angle",
          "explainer": "Matt Shaw hits angle vs Andrew Abbott on 4-Seam Fastball (45% usage): starter shows this pitch often, hit-market profile.",
          "metrics": "0.328 BA · 0.694 SLG · 10% barrel"
        },
        {
          "player": "Sal Stewart",
          "team": "CIN",
          "market": "Batter hits",
          "side": "Over",
          "line": 0.5,
          "probability": 0.685,
          "fair": -217,
          "play_to": -207,
          "pitcher": "Matthew Boyd",
          "pitch_type": "FF",
          "pitch_name": "4-Seam Fastball",
          "usage": 49.2,
          "ba": 0.304,
          "slg": 0.577,
          "barrel_rate": 0.221,
          "label": "Angle",
          "explainer": "Sal Stewart hits angle vs Matthew Boyd on 4-Seam Fastball (49% usage): starter shows this pitch often, hit-market profile.",
          "metrics": "0.304 BA · 0.577 SLG · 22% barrel"
        },
        {
          "player": "Matt Shaw",
          "team": "CHC",
          "market": "Batter TB",
          "side": "Over",
          "line": 1.5,
          "probability": 0.438,
          "fair": 128,
          "play_to": 138,
          "pitcher": "Andrew Abbott",
          "pitch_type": "FF",
          "pitch_name": "4-Seam Fastball",
          "usage": 45.4,
          "ba": 0.328,
          "slg": 0.694,
          "barrel_rate": 0.098,
          "label": "Angle",
          "explainer": "Matt Shaw TB angle vs Andrew Abbott on 4-Seam Fastball (45% usage): extra-base damage fit, starter shows this pitch often.",
          "metrics": "0.328 BA · 0.694 SLG · 10% barrel"
        },
        {
          "player": "JJ Bleday",
          "team": "CIN",
          "market": "Batter TB",
          "side": "Over",
          "line": 1.5,
          "probability": 0.419,
          "fair": 139,
          "play_to": 149,
          "pitcher": "Matthew Boyd",
          "pitch_type": "SL",
          "pitch_name": "Slider",
          "usage": 14.2,
          "ba": 0.287,
          "slg": 0.615,
          "barrel_rate": 0.055,
          "label": "Angle",
          "explainer": "JJ Bleday TB angle vs Matthew Boyd on Slider (14% usage): pitch-type fit.",
          "metrics": "0.287 BA · 0.615 SLG · 6% barrel"
        },
        {
          "player": "Sal Stewart",
          "team": "CIN",
          "market": "Batter TB",
          "side": "Over",
          "line": 1.5,
          "probability": 0.409,
          "fair": 145,
          "play_to": 155,
          "pitcher": "Matthew Boyd",
          "pitch_type": "FF",
          "pitch_name": "4-Seam Fastball",
          "usage": 49.2,
          "ba": 0.304,
          "slg": 0.577,
          "barrel_rate": 0.221,
          "label": "Angle",
          "explainer": "Sal Stewart TB angle vs Matthew Boyd on 4-Seam Fastball (49% usage): barrel-backed contact, starter shows this pitch often.",
          "metrics": "0.304 BA · 0.577 SLG · 22% barrel"
        },
        {
          "player": "Nathaniel Lowe",
          "team": "CIN",
          "market": "Batter TB",
          "side": "Over",
          "line": 1.5,
          "probability": 0.407,
          "fair": 146,
          "play_to": 156,
          "pitcher": "Matthew Boyd",
          "pitch_type": "CH",
          "pitch_name": "Changeup",
          "usage": 26.7,
          "ba": 0.25,
          "slg": 0.571,
          "barrel_rate": 0.136,
          "label": "Angle",
          "explainer": "Nathaniel Lowe TB angle vs Matthew Boyd on Changeup (27% usage): barrel-backed contact, starter shows this pitch often.",
          "metrics": "0.250 BA · 0.571 SLG · 14% barrel"
        },
        {
          "player": "Nathaniel Lowe",
          "team": "CIN",
          "market": "Batter HR",
          "side": "Over",
          "line": 0.5,
          "probability": 0.103,
          "fair": 872,
          "play_to": 882,
          "pitcher": "Matthew Boyd",
          "pitch_type": "CH",
          "pitch_name": "Changeup",
          "usage": 26.7,
          "ba": 0.25,
          "slg": 0.571,
          "barrel_rate": 0.136,
          "label": "Angle",
          "explainer": "Nathaniel Lowe HR angle vs Matthew Boyd on Changeup (27% usage): starter shows this pitch often.",
          "metrics": "0.250 BA · 0.571 SLG · 14% barrel"
        }
      ],
      "k_targets": [
        {
          "batter": "Matt Shaw",
          "team": "CHC",
          "pitcher": "Andrew Abbott",
          "pitch_type": "CH",
          "pitch_name": "Changeup",
          "usage": 17.5,
          "whiff_rate": 0.324,
          "chase_rate": 0.463,
          "market": "Batter strikeouts",
          "side": "Over",
          "line": 0.5,
          "probability": 0.551,
          "label": "K target",
          "explainer": "Matt Shaw has a high whiff profile against Changeup; Andrew Abbott throws it 18% of the time.",
          "fair": -123,
          "play_to": -113
        },
        {
          "batter": "Michael Busch",
          "team": "CHC",
          "pitcher": "Andrew Abbott",
          "pitch_type": "CU",
          "pitch_name": "Curveball",
          "usage": 13.5,
          "whiff_rate": 0.404,
          "chase_rate": 0.13,
          "market": "Batter strikeouts",
          "side": "Over",
          "line": 0.5,
          "probability": 0.545,
          "label": "Strong K target",
          "explainer": "Michael Busch has a high whiff profile against Curveball; Andrew Abbott throws it 14% of the time.",
          "fair": -120,
          "play_to": -110
        },
        {
          "batter": "Sal Stewart",
          "team": "CIN",
          "pitcher": "Matthew Boyd",
          "pitch_type": "FF",
          "pitch_name": "4-Seam Fastball",
          "usage": 49.2,
          "whiff_rate": 0.353,
          "chase_rate": 0.364,
          "market": "Batter strikeouts",
          "side": "Over",
          "line": 0.5,
          "probability": 0.68,
          "label": "Strong K target",
          "explainer": "Sal Stewart has a high whiff profile against 4-Seam Fastball; Matthew Boyd throws it 49% of the time.",
          "fair": -213,
          "play_to": -203
        },
        {
          "batter": "JJ Bleday",
          "team": "CIN",
          "pitcher": "Matthew Boyd",
          "pitch_type": "SL",
          "pitch_name": "Slider",
          "usage": 14.2,
          "whiff_rate": 0.323,
          "chase_rate": 0.27,
          "market": "Batter strikeouts",
          "side": "Over",
          "line": 0.5,
          "probability": 0.515,
          "label": "K target",
          "explainer": "JJ Bleday has a high whiff profile against Slider; Matthew Boyd throws it 14% of the time.",
          "fair": -106,
          "play_to": -96
        }
      ],
      "prop_angles": [
        {
          "player": "Matthew Boyd",
          "market": "Pitcher strikeouts",
          "side": "Over",
          "line": 5.5,
          "projected": 6.7,
          "base_projected": 5.7,
          "fair": -186,
          "under_fair": 186,
          "base_fair": -114,
          "base_under_fair": 114,
          "book": null,
          "play_to": -176,
          "under_play_to": 196,
          "base_play_to": -104,
          "base_under_play_to": 124,
          "designation": "Watch price",
          "explainer": "Ceiling game view: starts from base K workload, adds chase/whiff upside, and suppresses the ceiling when the starter's damage profile threatens early traffic or shorter leash."
        },
        {
          "player": "Andrew Abbott",
          "market": "Pitcher strikeouts",
          "side": "Over",
          "line": 4.5,
          "projected": 5.3,
          "base_projected": 4.3,
          "fair": -186,
          "under_fair": 186,
          "base_fair": 121,
          "base_under_fair": -121,
          "book": null,
          "play_to": -176,
          "under_play_to": 196,
          "base_play_to": 131,
          "base_under_play_to": -111,
          "designation": "Watch price",
          "explainer": "Ceiling game view: starts from base K workload, adds chase/whiff upside, and suppresses the ceiling when the starter's damage profile threatens early traffic or shorter leash."
        }
      ]
    },
    {
      "id": 823602,
      "away": "BOS",
      "home": "NYM",
      "away_name": "Boston Red Sox",
      "home_name": "New York Mets",
      "away_starter": "Payton Tolle",
      "home_starter": "Zach Thornton",
      "status": "Scheduled",
      "time": "1:40 PM ET",
      "day_night": "day",
      "away_score": 4.0,
      "home_score": 5.0,
      "total": 9.0,
      "home_win_probability": 0.69,
      "moneyline_fairs": {
        "away_probability": 0.31,
        "home_probability": 0.69,
        "away_fair": 223,
        "home_fair": -223
      },
      "team_total_fairs": {
        "away": 4.0,
        "home": 5.0
      },
      "f5": {
        "away_score": 2.0,
        "home_score": 2.6,
        "total": 4.6,
        "home_win_probability": 0.653,
        "away_fair": 188,
        "home_fair": -188
      },
      "synthesis": "The board sees a balanced run environment. NYM has the clearer projected scoring path.",
      "batter_prop_angles": [
        {
          "player": "Brett Baty",
          "team": "NYM",
          "market": "Batter hits",
          "side": "Over",
          "line": 0.5,
          "probability": 0.735,
          "fair": -277,
          "play_to": -267,
          "pitcher": "Payton Tolle",
          "pitch_type": "SI",
          "pitch_name": "Sinker",
          "usage": 23.2,
          "ba": 0.42,
          "slg": 0.539,
          "barrel_rate": 0.049,
          "label": "Strong angle",
          "explainer": "Brett Baty hits angle vs Payton Tolle on Sinker (23% usage): high contact fit, starter shows this pitch often, hit-market profile.",
          "metrics": "0.420 BA · 0.539 SLG · 5% barrel"
        },
        {
          "player": "Willson Contreras",
          "team": "BOS",
          "market": "Batter hits",
          "side": "Over",
          "line": 0.5,
          "probability": 0.726,
          "fair": -265,
          "play_to": -255,
          "pitcher": "Zach Thornton",
          "pitch_type": "SI",
          "pitch_name": "Sinker",
          "usage": 14.9,
          "ba": 0.394,
          "slg": 0.803,
          "barrel_rate": 0.125,
          "label": "Strong angle",
          "explainer": "Willson Contreras hits angle vs Zach Thornton on Sinker (15% usage): high contact fit, hit-market profile.",
          "metrics": "0.394 BA · 0.803 SLG · 12% barrel"
        },
        {
          "player": "Willson Contreras",
          "team": "BOS",
          "market": "Batter TB",
          "side": "Over",
          "line": 1.5,
          "probability": 0.463,
          "fair": 116,
          "play_to": 126,
          "pitcher": "Zach Thornton",
          "pitch_type": "SI",
          "pitch_name": "Sinker",
          "usage": 14.9,
          "ba": 0.394,
          "slg": 0.803,
          "barrel_rate": 0.125,
          "label": "Strong angle",
          "explainer": "Willson Contreras TB angle vs Zach Thornton on Sinker (15% usage): extra-base damage fit, barrel-backed contact.",
          "metrics": "0.394 BA · 0.803 SLG · 12% barrel"
        },
        {
          "player": "Ceddanne Rafaela",
          "team": "BOS",
          "market": "Batter HR",
          "side": "Over",
          "line": 0.5,
          "probability": 0.127,
          "fair": 688,
          "play_to": 698,
          "pitcher": "Zach Thornton",
          "pitch_type": "ST",
          "pitch_name": "Sweeper",
          "usage": 16.3,
          "ba": 0.243,
          "slg": 0.484,
          "barrel_rate": 0.214,
          "label": "Strong angle",
          "explainer": "Ceddanne Rafaela HR angle vs Zach Thornton on Sweeper (16% usage): home-run barrel signal.",
          "metrics": "0.243 BA · 0.484 SLG · 21% barrel"
        },
        {
          "player": "Juan Soto",
          "team": "NYM",
          "market": "Batter HR",
          "side": "Over",
          "line": 0.5,
          "probability": 0.125,
          "fair": 701,
          "play_to": 711,
          "pitcher": "Payton Tolle",
          "pitch_type": "FF",
          "pitch_name": "4-Seam Fastball",
          "usage": 47.8,
          "ba": 0.315,
          "slg": 0.664,
          "barrel_rate": 0.207,
          "label": "Strong angle",
          "explainer": "Juan Soto HR angle vs Payton Tolle on 4-Seam Fastball (48% usage): home-run barrel signal, starter shows this pitch often.",
          "metrics": "0.315 BA · 0.664 SLG · 21% barrel"
        },
        {
          "player": "Wilyer Abreu",
          "team": "BOS",
          "market": "Batter HR",
          "side": "Over",
          "line": 0.5,
          "probability": 0.105,
          "fair": 854,
          "play_to": 864,
          "pitcher": "Zach Thornton",
          "pitch_type": "FC",
          "pitch_name": "Cutter",
          "usage": 43.3,
          "ba": 0.311,
          "slg": 0.52,
          "barrel_rate": 0.142,
          "label": "Strong angle",
          "explainer": "Wilyer Abreu HR angle vs Zach Thornton on Cutter (43% usage): home-run barrel signal, starter shows this pitch often.",
          "metrics": "0.311 BA · 0.520 SLG · 14% barrel"
        },
        {
          "player": "Juan Soto",
          "team": "NYM",
          "market": "Batter hits",
          "side": "Over",
          "line": 0.5,
          "probability": 0.691,
          "fair": -223,
          "play_to": -213,
          "pitcher": "Payton Tolle",
          "pitch_type": "FF",
          "pitch_name": "4-Seam Fastball",
          "usage": 47.8,
          "ba": 0.315,
          "slg": 0.664,
          "barrel_rate": 0.207,
          "label": "Angle",
          "explainer": "Juan Soto hits angle vs Payton Tolle on 4-Seam Fastball (48% usage): starter shows this pitch often, hit-market profile.",
          "metrics": "0.315 BA · 0.664 SLG · 21% barrel"
        },
        {
          "player": "Wilyer Abreu",
          "team": "BOS",
          "market": "Batter hits",
          "side": "Over",
          "line": 0.5,
          "probability": 0.688,
          "fair": -221,
          "play_to": -211,
          "pitcher": "Zach Thornton",
          "pitch_type": "FC",
          "pitch_name": "Cutter",
          "usage": 43.3,
          "ba": 0.311,
          "slg": 0.52,
          "barrel_rate": 0.142,
          "label": "Angle",
          "explainer": "Wilyer Abreu hits angle vs Zach Thornton on Cutter (43% usage): starter shows this pitch often, hit-market profile.",
          "metrics": "0.311 BA · 0.520 SLG · 14% barrel"
        },
        {
          "player": "Juan Soto",
          "team": "NYM",
          "market": "Batter TB",
          "side": "Over",
          "line": 1.5,
          "probability": 0.431,
          "fair": 132,
          "play_to": 142,
          "pitcher": "Payton Tolle",
          "pitch_type": "FF",
          "pitch_name": "4-Seam Fastball",
          "usage": 47.8,
          "ba": 0.315,
          "slg": 0.664,
          "barrel_rate": 0.207,
          "label": "Angle",
          "explainer": "Juan Soto TB angle vs Payton Tolle on 4-Seam Fastball (48% usage): extra-base damage fit, barrel-backed contact, starter shows this pitch often.",
          "metrics": "0.315 BA · 0.664 SLG · 21% barrel"
        },
        {
          "player": "Caleb Durbin",
          "team": "BOS",
          "market": "Batter TB",
          "side": "Over",
          "line": 1.5,
          "probability": 0.402,
          "fair": 149,
          "play_to": 159,
          "pitcher": "Zach Thornton",
          "pitch_type": "FF",
          "pitch_name": "4-Seam Fastball",
          "usage": 22.7,
          "ba": 0.261,
          "slg": 0.553,
          "barrel_rate": 0.061,
          "label": "Angle",
          "explainer": "Caleb Durbin TB angle vs Zach Thornton on 4-Seam Fastball (23% usage): starter shows this pitch often.",
          "metrics": "0.261 BA · 0.553 SLG · 6% barrel"
        }
      ],
      "k_targets": [],
      "prop_angles": [
        {
          "player": "Payton Tolle",
          "market": "Pitcher strikeouts",
          "side": "Over",
          "line": 6.5,
          "projected": 7.3,
          "base_projected": 6.1,
          "fair": -186,
          "under_fair": 186,
          "base_fair": 140,
          "base_under_fair": -140,
          "book": null,
          "play_to": -176,
          "under_play_to": 196,
          "base_play_to": 150,
          "base_under_play_to": -130,
          "designation": "Watch price",
          "explainer": "Ceiling game view: starts from base K workload, adds chase/whiff upside, and suppresses the ceiling when the starter's damage profile threatens early traffic or shorter leash."
        },
        {
          "player": "Zach Thornton",
          "market": "Pitcher strikeouts",
          "side": "Over",
          "line": 5.5,
          "projected": 6.3,
          "base_projected": 5.4,
          "fair": -186,
          "under_fair": 186,
          "base_fair": 114,
          "base_under_fair": -114,
          "book": null,
          "play_to": -176,
          "under_play_to": 196,
          "base_play_to": 124,
          "base_under_play_to": -104,
          "designation": "Watch price",
          "explainer": "Ceiling game view: starts from base K workload, adds chase/whiff upside, and suppresses the ceiling when the starter's damage profile threatens early traffic or shorter leash."
        }
      ]
    },
    {
      "id": 822951,
      "away": "SEA",
      "home": "TB",
      "away_name": "Seattle Mariners",
      "home_name": "Tampa Bay Rays",
      "away_starter": "Emerson Hancock",
      "home_starter": "Ian Seymour",
      "status": "Scheduled",
      "time": "1:40 PM ET",
      "day_night": "day",
      "away_score": 4.8,
      "home_score": 4.1,
      "total": 8.9,
      "home_win_probability": 0.364,
      "moneyline_fairs": {
        "away_probability": 0.636,
        "home_probability": 0.364,
        "away_fair": -175,
        "home_fair": 175
      },
      "team_total_fairs": {
        "away": 4.8,
        "home": 4.1
      },
      "f5": {
        "away_score": 2.3,
        "home_score": 2.1,
        "total": 4.4,
        "home_win_probability": 0.448,
        "away_fair": -123,
        "home_fair": 123
      },
      "synthesis": "The board sees a balanced run environment. SEA has the clearer projected scoring path.",
      "batter_prop_angles": [
        {
          "player": "Jonathan Aranda",
          "team": "TB",
          "market": "Batter hits",
          "side": "Over",
          "line": 0.5,
          "probability": 0.74,
          "fair": -285,
          "play_to": -275,
          "pitcher": "Emerson Hancock",
          "pitch_type": "ST",
          "pitch_name": "Sweeper",
          "usage": 18.3,
          "ba": 0.44,
          "slg": 0.92,
          "barrel_rate": 0.1,
          "label": "Strong angle",
          "explainer": "Jonathan Aranda hits angle vs Emerson Hancock on Sweeper (18% usage): high contact fit, starter shows this pitch often, hit-market profile.",
          "metrics": "0.440 BA · 0.920 SLG · 10% barrel"
        },
        {
          "player": "Yandy Díaz",
          "team": "TB",
          "market": "Batter hits",
          "side": "Over",
          "line": 0.5,
          "probability": 0.735,
          "fair": -277,
          "play_to": -267,
          "pitcher": "Emerson Hancock",
          "pitch_type": "SI",
          "pitch_name": "Sinker",
          "usage": 22.8,
          "ba": 0.421,
          "slg": 0.526,
          "barrel_rate": 0.04,
          "label": "Strong angle",
          "explainer": "Yandy Díaz hits angle vs Emerson Hancock on Sinker (23% usage): high contact fit, starter shows this pitch often, hit-market profile.",
          "metrics": "0.421 BA · 0.526 SLG · 4% barrel"
        },
        {
          "player": "Cal Raleigh",
          "team": "SEA",
          "market": "Batter hits",
          "side": "Over",
          "line": 0.5,
          "probability": 0.728,
          "fair": -267,
          "play_to": -257,
          "pitcher": "Ian Seymour",
          "pitch_type": "SI",
          "pitch_name": "Sinker",
          "usage": 13.5,
          "ba": 0.4,
          "slg": 0.8,
          "barrel_rate": 0.333,
          "label": "Strong angle",
          "explainer": "Cal Raleigh hits angle vs Ian Seymour on Sinker (14% usage): high contact fit, hit-market profile.",
          "metrics": "0.400 BA · 0.800 SLG · 33% barrel"
        },
        {
          "player": "Junior Caminero",
          "team": "TB",
          "market": "Batter hits",
          "side": "Over",
          "line": 0.5,
          "probability": 0.709,
          "fair": -243,
          "play_to": -233,
          "pitcher": "Emerson Hancock",
          "pitch_type": "FF",
          "pitch_name": "4-Seam Fastball",
          "usage": 38.6,
          "ba": 0.352,
          "slg": 0.712,
          "barrel_rate": 0.202,
          "label": "Strong angle",
          "explainer": "Junior Caminero hits angle vs Emerson Hancock on 4-Seam Fastball (39% usage): high contact fit, starter shows this pitch often, hit-market profile.",
          "metrics": "0.352 BA · 0.712 SLG · 20% barrel"
        },
        {
          "player": "Jonathan Aranda",
          "team": "TB",
          "market": "Batter TB",
          "side": "Over",
          "line": 1.5,
          "probability": 0.487,
          "fair": 105,
          "play_to": 115,
          "pitcher": "Emerson Hancock",
          "pitch_type": "ST",
          "pitch_name": "Sweeper",
          "usage": 18.3,
          "ba": 0.44,
          "slg": 0.92,
          "barrel_rate": 0.1,
          "label": "Strong angle",
          "explainer": "Jonathan Aranda TB angle vs Emerson Hancock on Sweeper (18% usage): extra-base damage fit, barrel-backed contact, starter shows this pitch often.",
          "metrics": "0.440 BA · 0.920 SLG · 10% barrel"
        },
        {
          "player": "Cal Raleigh",
          "team": "SEA",
          "market": "Batter TB",
          "side": "Over",
          "line": 1.5,
          "probability": 0.462,
          "fair": 116,
          "play_to": 126,
          "pitcher": "Ian Seymour",
          "pitch_type": "SI",
          "pitch_name": "Sinker",
          "usage": 13.5,
          "ba": 0.4,
          "slg": 0.8,
          "barrel_rate": 0.333,
          "label": "Strong angle",
          "explainer": "Cal Raleigh TB angle vs Ian Seymour on Sinker (14% usage): extra-base damage fit, barrel-backed contact.",
          "metrics": "0.400 BA · 0.800 SLG · 33% barrel"
        },
        {
          "player": "Colt Emerson",
          "team": "SEA",
          "market": "Batter TB",
          "side": "Over",
          "line": 1.5,
          "probability": 0.451,
          "fair": 122,
          "play_to": 132,
          "pitcher": "Ian Seymour",
          "pitch_type": "CH",
          "pitch_name": "Changeup",
          "usage": 30.8,
          "ba": 0.25,
          "slg": 0.75,
          "barrel_rate": 0.111,
          "label": "Strong angle",
          "explainer": "Colt Emerson TB angle vs Ian Seymour on Changeup (31% usage): extra-base damage fit, barrel-backed contact, starter shows this pitch often.",
          "metrics": "0.250 BA · 0.750 SLG · 11% barrel"
        },
        {
          "player": "Junior Caminero",
          "team": "TB",
          "market": "Batter TB",
          "side": "Over",
          "line": 1.5,
          "probability": 0.443,
          "fair": 126,
          "play_to": 136,
          "pitcher": "Emerson Hancock",
          "pitch_type": "FF",
          "pitch_name": "4-Seam Fastball",
          "usage": 38.6,
          "ba": 0.352,
          "slg": 0.712,
          "barrel_rate": 0.202,
          "label": "Strong angle",
          "explainer": "Junior Caminero TB angle vs Emerson Hancock on 4-Seam Fastball (39% usage): extra-base damage fit, barrel-backed contact, starter shows this pitch often.",
          "metrics": "0.352 BA · 0.712 SLG · 20% barrel"
        },
        {
          "player": "Cal Raleigh",
          "team": "SEA",
          "market": "Batter HR",
          "side": "Over",
          "line": 0.5,
          "probability": 0.161,
          "fair": 520,
          "play_to": 530,
          "pitcher": "Ian Seymour",
          "pitch_type": "SI",
          "pitch_name": "Sinker",
          "usage": 13.5,
          "ba": 0.4,
          "slg": 0.8,
          "barrel_rate": 0.333,
          "label": "Strong angle",
          "explainer": "Cal Raleigh HR angle vs Ian Seymour on Sinker (14% usage): home-run barrel signal, power damage fit.",
          "metrics": "0.400 BA · 0.800 SLG · 33% barrel"
        },
        {
          "player": "Luke Raley",
          "team": "SEA",
          "market": "Batter HR",
          "side": "Over",
          "line": 0.5,
          "probability": 0.132,
          "fair": 657,
          "play_to": 667,
          "pitcher": "Ian Seymour",
          "pitch_type": "FF",
          "pitch_name": "4-Seam Fastball",
          "usage": 23.3,
          "ba": 0.278,
          "slg": 0.61,
          "barrel_rate": 0.231,
          "label": "Strong angle",
          "explainer": "Luke Raley HR angle vs Ian Seymour on 4-Seam Fastball (23% usage): home-run barrel signal, starter shows this pitch often.",
          "metrics": "0.278 BA · 0.610 SLG · 23% barrel"
        }
      ],
      "k_targets": [
        {
          "batter": "Colt Emerson",
          "team": "SEA",
          "pitcher": "Ian Seymour",
          "pitch_type": "CH",
          "pitch_name": "Changeup",
          "usage": 30.8,
          "whiff_rate": 0.429,
          "chase_rate": 0.417,
          "market": "Batter strikeouts",
          "side": "Over",
          "line": 0.5,
          "probability": 0.68,
          "label": "Strong K target",
          "explainer": "Colt Emerson has a high whiff profile against Changeup; Ian Seymour throws it 31% of the time.",
          "fair": -213,
          "play_to": -203
        },
        {
          "batter": "Josh Naylor",
          "team": "SEA",
          "pitcher": "Ian Seymour",
          "pitch_type": "ST",
          "pitch_name": "Sweeper",
          "usage": 25.2,
          "whiff_rate": 0.333,
          "chase_rate": 0.167,
          "market": "Batter strikeouts",
          "side": "Over",
          "line": 0.5,
          "probability": 0.579,
          "label": "Strong K target",
          "explainer": "Josh Naylor has a high whiff profile against Sweeper; Ian Seymour throws it 25% of the time.",
          "fair": -138,
          "play_to": -128
        },
        {
          "batter": "Luke Raley",
          "team": "SEA",
          "pitcher": "Ian Seymour",
          "pitch_type": "FF",
          "pitch_name": "4-Seam Fastball",
          "usage": 23.3,
          "whiff_rate": 0.326,
          "chase_rate": 0.271,
          "market": "Batter strikeouts",
          "side": "Over",
          "line": 0.5,
          "probability": 0.572,
          "label": "K target",
          "explainer": "Luke Raley has a high whiff profile against 4-Seam Fastball; Ian Seymour throws it 23% of the time.",
          "fair": -134,
          "play_to": -124
        }
      ],
      "prop_angles": [
        {
          "player": "Emerson Hancock",
          "market": "Pitcher strikeouts",
          "side": "Over",
          "line": 6.5,
          "projected": 7.0,
          "base_projected": 6.0,
          "fair": -156,
          "under_fair": 156,
          "base_fair": 156,
          "base_under_fair": -156,
          "book": null,
          "play_to": -146,
          "under_play_to": 166,
          "base_play_to": 166,
          "base_under_play_to": -146,
          "designation": "Watch price",
          "explainer": "Ceiling game view: starts from base K workload, adds chase/whiff upside, and suppresses the ceiling when the starter's damage profile threatens early traffic or shorter leash."
        },
        {
          "player": "Ian Seymour",
          "market": "Pitcher strikeouts",
          "side": "Over",
          "line": 5.5,
          "projected": 6.7,
          "base_projected": 5.6,
          "fair": -186,
          "under_fair": 186,
          "base_fair": -107,
          "base_under_fair": 107,
          "book": null,
          "play_to": -176,
          "under_play_to": 196,
          "base_play_to": -97,
          "base_under_play_to": 117,
          "designation": "Watch price",
          "explainer": "Ceiling game view: starts from base K workload, adds chase/whiff upside, and suppresses the ceiling when the starter's damage profile threatens early traffic or shorter leash."
        }
      ]
    },
    {
      "id": 824250,
      "away": "PHI",
      "home": "DET",
      "away_name": "Philadelphia Phillies",
      "home_name": "Detroit Tigers",
      "away_starter": "Zack Wheeler",
      "home_starter": "Tarik Skubal",
      "status": "Scheduled",
      "time": "1:40 PM ET",
      "day_night": "day",
      "away_score": 4.5,
      "home_score": 4.8,
      "total": 9.3,
      "home_win_probability": 0.56,
      "moneyline_fairs": {
        "away_probability": 0.44,
        "home_probability": 0.56,
        "away_fair": 127,
        "home_fair": -127
      },
      "team_total_fairs": {
        "away": 4.5,
        "home": 4.8
      },
      "f5": {
        "away_score": 2.4,
        "home_score": 2.5,
        "total": 4.9,
        "home_win_probability": 0.526,
        "away_fair": 111,
        "home_fair": -111
      },
      "synthesis": "The board sees a balanced run environment. Neither side has a meaningful projected scoring edge.",
      "batter_prop_angles": [
        {
          "player": "Edmundo Sosa",
          "team": "PHI",
          "market": "Batter hits",
          "side": "Over",
          "line": 0.5,
          "probability": 0.74,
          "fair": -285,
          "play_to": -275,
          "pitcher": "Tarik Skubal",
          "pitch_type": "FF",
          "pitch_name": "4-Seam Fastball",
          "usage": 38.0,
          "ba": 0.438,
          "slg": 0.844,
          "barrel_rate": 0.167,
          "label": "Strong angle",
          "explainer": "Edmundo Sosa hits angle vs Tarik Skubal on 4-Seam Fastball (38% usage): high contact fit, starter shows this pitch often, hit-market profile.",
          "metrics": "0.438 BA · 0.844 SLG · 17% barrel"
        },
        {
          "player": "Hao-Yu Lee",
          "team": "DET",
          "market": "Batter hits",
          "side": "Over",
          "line": 0.5,
          "probability": 0.74,
          "fair": -285,
          "play_to": -275,
          "pitcher": "Zack Wheeler",
          "pitch_type": "ST",
          "pitch_name": "Sweeper",
          "usage": 14.8,
          "ba": 0.474,
          "slg": 0.632,
          "barrel_rate": 0.0,
          "label": "Strong angle",
          "explainer": "Hao-Yu Lee hits angle vs Zack Wheeler on Sweeper (15% usage): high contact fit, hit-market profile.",
          "metrics": "0.474 BA · 0.632 SLG · 0% barrel"
        },
        {
          "player": "Kyle Schwarber",
          "team": "PHI",
          "market": "Batter hits",
          "side": "Over",
          "line": 0.5,
          "probability": 0.725,
          "fair": -264,
          "play_to": -254,
          "pitcher": "Tarik Skubal",
          "pitch_type": "SI",
          "pitch_name": "Sinker",
          "usage": 17.9,
          "ba": 0.392,
          "slg": 0.839,
          "barrel_rate": 0.224,
          "label": "Strong angle",
          "explainer": "Kyle Schwarber hits angle vs Tarik Skubal on Sinker (18% usage): high contact fit, hit-market profile.",
          "metrics": "0.392 BA · 0.839 SLG · 22% barrel"
        },
        {
          "player": "Bryson Stott",
          "team": "PHI",
          "market": "Batter hits",
          "side": "Over",
          "line": 0.5,
          "probability": 0.725,
          "fair": -264,
          "play_to": -254,
          "pitcher": "Tarik Skubal",
          "pitch_type": "SL",
          "pitch_name": "Slider",
          "usage": 15.1,
          "ba": 0.392,
          "slg": 0.743,
          "barrel_rate": 0.077,
          "label": "Strong angle",
          "explainer": "Bryson Stott hits angle vs Tarik Skubal on Slider (15% usage): high contact fit, hit-market profile.",
          "metrics": "0.392 BA · 0.743 SLG · 8% barrel"
        },
        {
          "player": "Edmundo Sosa",
          "team": "PHI",
          "market": "Batter TB",
          "side": "Over",
          "line": 1.5,
          "probability": 0.472,
          "fair": 112,
          "play_to": 122,
          "pitcher": "Tarik Skubal",
          "pitch_type": "FF",
          "pitch_name": "4-Seam Fastball",
          "usage": 38.0,
          "ba": 0.438,
          "slg": 0.844,
          "barrel_rate": 0.167,
          "label": "Strong angle",
          "explainer": "Edmundo Sosa TB angle vs Tarik Skubal on 4-Seam Fastball (38% usage): extra-base damage fit, barrel-backed contact, starter shows this pitch often.",
          "metrics": "0.438 BA · 0.844 SLG · 17% barrel"
        },
        {
          "player": "Kyle Schwarber",
          "team": "PHI",
          "market": "Batter TB",
          "side": "Over",
          "line": 1.5,
          "probability": 0.471,
          "fair": 112,
          "play_to": 122,
          "pitcher": "Tarik Skubal",
          "pitch_type": "SI",
          "pitch_name": "Sinker",
          "usage": 17.9,
          "ba": 0.392,
          "slg": 0.839,
          "barrel_rate": 0.224,
          "label": "Strong angle",
          "explainer": "Kyle Schwarber TB angle vs Tarik Skubal on Sinker (18% usage): extra-base damage fit, barrel-backed contact.",
          "metrics": "0.392 BA · 0.839 SLG · 22% barrel"
        },
        {
          "player": "Bryson Stott",
          "team": "PHI",
          "market": "Batter TB",
          "side": "Over",
          "line": 1.5,
          "probability": 0.45,
          "fair": 122,
          "play_to": 132,
          "pitcher": "Tarik Skubal",
          "pitch_type": "SL",
          "pitch_name": "Slider",
          "usage": 15.1,
          "ba": 0.392,
          "slg": 0.743,
          "barrel_rate": 0.077,
          "label": "Strong angle",
          "explainer": "Bryson Stott TB angle vs Tarik Skubal on Slider (15% usage): extra-base damage fit.",
          "metrics": "0.392 BA · 0.743 SLG · 8% barrel"
        },
        {
          "player": "Kyle Schwarber",
          "team": "PHI",
          "market": "Batter HR",
          "side": "Over",
          "line": 0.5,
          "probability": 0.156,
          "fair": 542,
          "play_to": 552,
          "pitcher": "Tarik Skubal",
          "pitch_type": "CH",
          "pitch_name": "Changeup",
          "usage": 24.9,
          "ba": 0.26,
          "slg": 0.699,
          "barrel_rate": 0.313,
          "label": "Strong angle",
          "explainer": "Kyle Schwarber HR angle vs Tarik Skubal on Changeup (25% usage): home-run barrel signal, starter shows this pitch often.",
          "metrics": "0.260 BA · 0.699 SLG · 31% barrel"
        },
        {
          "player": "Dillon Dingler",
          "team": "DET",
          "market": "Batter HR",
          "side": "Over",
          "line": 0.5,
          "probability": 0.117,
          "fair": 755,
          "play_to": 765,
          "pitcher": "Zack Wheeler",
          "pitch_type": "FF",
          "pitch_name": "4-Seam Fastball",
          "usage": 35.9,
          "ba": 0.309,
          "slg": 0.6,
          "barrel_rate": 0.181,
          "label": "Strong angle",
          "explainer": "Dillon Dingler HR angle vs Zack Wheeler on 4-Seam Fastball (36% usage): home-run barrel signal, starter shows this pitch often.",
          "metrics": "0.309 BA · 0.600 SLG · 18% barrel"
        },
        {
          "player": "Edmundo Sosa",
          "team": "PHI",
          "market": "Batter HR",
          "side": "Over",
          "line": 0.5,
          "probability": 0.113,
          "fair": 788,
          "play_to": 798,
          "pitcher": "Tarik Skubal",
          "pitch_type": "FF",
          "pitch_name": "4-Seam Fastball",
          "usage": 38.0,
          "ba": 0.438,
          "slg": 0.844,
          "barrel_rate": 0.167,
          "label": "Strong angle",
          "explainer": "Edmundo Sosa HR angle vs Tarik Skubal on 4-Seam Fastball (38% usage): home-run barrel signal, power damage fit, starter shows this pitch often.",
          "metrics": "0.438 BA · 0.844 SLG · 17% barrel"
        }
      ],
      "k_targets": [
        {
          "batter": "Kyle Schwarber",
          "team": "PHI",
          "pitcher": "Tarik Skubal",
          "pitch_type": "CH",
          "pitch_name": "Changeup",
          "usage": 24.9,
          "whiff_rate": 0.393,
          "chase_rate": 0.25,
          "market": "Batter strikeouts",
          "side": "Over",
          "line": 0.5,
          "probability": 0.617,
          "label": "Strong K target",
          "explainer": "Kyle Schwarber has a high whiff profile against Changeup; Tarik Skubal throws it 25% of the time.",
          "fair": -161,
          "play_to": -151
        },
        {
          "batter": "Riley Greene",
          "team": "DET",
          "pitcher": "Zack Wheeler",
          "pitch_type": "FC",
          "pitch_name": "Cutter",
          "usage": 10.9,
          "whiff_rate": 0.374,
          "chase_rate": 0.132,
          "market": "Batter strikeouts",
          "side": "Over",
          "line": 0.5,
          "probability": 0.513,
          "label": "K target",
          "explainer": "Riley Greene has a high whiff profile against Cutter; Zack Wheeler throws it 11% of the time.",
          "fair": -105,
          "play_to": -95
        }
      ],
      "prop_angles": [
        {
          "player": "Zack Wheeler",
          "market": "Pitcher strikeouts",
          "side": "Over",
          "line": 7.5,
          "projected": 9.4,
          "base_projected": 7.9,
          "fair": -186,
          "under_fair": 186,
          "base_fair": -148,
          "base_under_fair": 148,
          "book": null,
          "play_to": -176,
          "under_play_to": 196,
          "base_play_to": -138,
          "base_under_play_to": 158,
          "designation": "Watch price",
          "explainer": "Ceiling game view: starts from base K workload, adds chase/whiff upside, and suppresses the ceiling when the starter's damage profile threatens early traffic or shorter leash."
        },
        {
          "player": "Tarik Skubal",
          "market": "Pitcher strikeouts",
          "side": "Over",
          "line": 7.5,
          "projected": 9.3,
          "base_projected": 7.8,
          "fair": -186,
          "under_fair": 186,
          "base_fair": -129,
          "base_under_fair": 129,
          "book": null,
          "play_to": -176,
          "under_play_to": 196,
          "base_play_to": -119,
          "base_under_play_to": 139,
          "designation": "Watch price",
          "explainer": "Ceiling game view: starts from base K workload, adds chase/whiff upside, and suppresses the ceiling when the starter's damage profile threatens early traffic or shorter leash."
        }
      ]
    },
    {
      "id": 823842,
      "away": "CLE",
      "home": "MIA",
      "away_name": "Cleveland Guardians",
      "home_name": "Miami Marlins",
      "away_starter": "Joey Cantillo",
      "home_starter": "Tyler Phillips",
      "status": "Scheduled",
      "time": "1:40 PM ET",
      "day_night": "day",
      "away_score": 4.0,
      "home_score": 4.0,
      "total": 8.0,
      "home_win_probability": 0.5,
      "moneyline_fairs": {
        "away_probability": 0.5,
        "home_probability": 0.5,
        "away_fair": -100,
        "home_fair": -100
      },
      "team_total_fairs": {
        "away": 4.0,
        "home": 4.0
      },
      "f5": {
        "away_score": 2.0,
        "home_score": 2.0,
        "total": 4.0,
        "home_win_probability": 0.5,
        "away_fair": -100,
        "home_fair": -100
      },
      "synthesis": "The board sees a lower-scoring game script. Neither side has a meaningful projected scoring edge.",
      "batter_prop_angles": [
        {
          "player": "Chase DeLauter",
          "team": "CLE",
          "market": "Batter hits",
          "side": "Over",
          "line": 0.5,
          "probability": 0.71,
          "fair": -245,
          "play_to": -235,
          "pitcher": "Tyler Phillips",
          "pitch_type": "SI",
          "pitch_name": "Sinker",
          "usage": 25.6,
          "ba": 0.356,
          "slg": 0.486,
          "barrel_rate": 0.0,
          "label": "Strong angle",
          "explainer": "Chase DeLauter hits angle vs Tyler Phillips on Sinker (26% usage): high contact fit, starter shows this pitch often, hit-market profile.",
          "metrics": "0.356 BA · 0.486 SLG · 0% barrel"
        },
        {
          "player": "Esteury Ruiz",
          "team": "MIA",
          "market": "Batter hits",
          "side": "Over",
          "line": 0.5,
          "probability": 0.707,
          "fair": -241,
          "play_to": -231,
          "pitcher": "Joey Cantillo",
          "pitch_type": "FF",
          "pitch_name": "4-Seam Fastball",
          "usage": 36.2,
          "ba": 0.348,
          "slg": 0.87,
          "barrel_rate": 0.188,
          "label": "Strong angle",
          "explainer": "Esteury Ruiz hits angle vs Joey Cantillo on 4-Seam Fastball (36% usage): starter shows this pitch often, hit-market profile.",
          "metrics": "0.348 BA · 0.870 SLG · 19% barrel"
        },
        {
          "player": "Daniel Schneemann",
          "team": "CLE",
          "market": "Batter hits",
          "side": "Over",
          "line": 0.5,
          "probability": 0.706,
          "fair": -241,
          "play_to": -231,
          "pitcher": "Tyler Phillips",
          "pitch_type": "CU",
          "pitch_name": "Curveball",
          "usage": 16.8,
          "ba": 0.347,
          "slg": 0.609,
          "barrel_rate": 0.094,
          "label": "Strong angle",
          "explainer": "Daniel Schneemann hits angle vs Tyler Phillips on Curveball (17% usage): hit-market profile.",
          "metrics": "0.347 BA · 0.609 SLG · 9% barrel"
        },
        {
          "player": "Jakob Marsee",
          "team": "MIA",
          "market": "Batter hits",
          "side": "Over",
          "line": 0.5,
          "probability": 0.705,
          "fair": -240,
          "play_to": -230,
          "pitcher": "Joey Cantillo",
          "pitch_type": "CH",
          "pitch_name": "Changeup",
          "usage": 26.7,
          "ba": 0.345,
          "slg": 0.577,
          "barrel_rate": 0.094,
          "label": "Strong angle",
          "explainer": "Jakob Marsee hits angle vs Joey Cantillo on Changeup (27% usage): starter shows this pitch often, hit-market profile.",
          "metrics": "0.345 BA · 0.577 SLG · 9% barrel"
        },
        {
          "player": "Esteury Ruiz",
          "team": "MIA",
          "market": "Batter TB",
          "side": "Over",
          "line": 1.5,
          "probability": 0.477,
          "fair": 110,
          "play_to": 120,
          "pitcher": "Joey Cantillo",
          "pitch_type": "FF",
          "pitch_name": "4-Seam Fastball",
          "usage": 36.2,
          "ba": 0.348,
          "slg": 0.87,
          "barrel_rate": 0.188,
          "label": "Strong angle",
          "explainer": "Esteury Ruiz TB angle vs Joey Cantillo on 4-Seam Fastball (36% usage): extra-base damage fit, barrel-backed contact, starter shows this pitch often.",
          "metrics": "0.348 BA · 0.870 SLG · 19% barrel"
        },
        {
          "player": "Kyle Stowers",
          "team": "MIA",
          "market": "Batter TB",
          "side": "Over",
          "line": 1.5,
          "probability": 0.442,
          "fair": 126,
          "play_to": 136,
          "pitcher": "Joey Cantillo",
          "pitch_type": "CU",
          "pitch_name": "Curveball",
          "usage": 25.4,
          "ba": 0.309,
          "slg": 0.709,
          "barrel_rate": 0.067,
          "label": "Strong angle",
          "explainer": "Kyle Stowers TB angle vs Joey Cantillo on Curveball (25% usage): extra-base damage fit, starter shows this pitch often.",
          "metrics": "0.309 BA · 0.709 SLG · 7% barrel"
        },
        {
          "player": "Esteury Ruiz",
          "team": "MIA",
          "market": "Batter HR",
          "side": "Over",
          "line": 0.5,
          "probability": 0.119,
          "fair": 740,
          "play_to": 750,
          "pitcher": "Joey Cantillo",
          "pitch_type": "FF",
          "pitch_name": "4-Seam Fastball",
          "usage": 36.2,
          "ba": 0.348,
          "slg": 0.87,
          "barrel_rate": 0.188,
          "label": "Strong angle",
          "explainer": "Esteury Ruiz HR angle vs Joey Cantillo on 4-Seam Fastball (36% usage): home-run barrel signal, power damage fit, starter shows this pitch often.",
          "metrics": "0.348 BA · 0.870 SLG · 19% barrel"
        },
        {
          "player": "Kyle Stowers",
          "team": "MIA",
          "market": "Batter hits",
          "side": "Over",
          "line": 0.5,
          "probability": 0.687,
          "fair": -220,
          "play_to": -210,
          "pitcher": "Joey Cantillo",
          "pitch_type": "CU",
          "pitch_name": "Curveball",
          "usage": 25.4,
          "ba": 0.309,
          "slg": 0.709,
          "barrel_rate": 0.067,
          "label": "Angle",
          "explainer": "Kyle Stowers hits angle vs Joey Cantillo on Curveball (25% usage): starter shows this pitch often, hit-market profile.",
          "metrics": "0.309 BA · 0.709 SLG · 7% barrel"
        },
        {
          "player": "Daniel Schneemann",
          "team": "CLE",
          "market": "Batter TB",
          "side": "Over",
          "line": 1.5,
          "probability": 0.417,
          "fair": 140,
          "play_to": 150,
          "pitcher": "Tyler Phillips",
          "pitch_type": "CU",
          "pitch_name": "Curveball",
          "usage": 16.8,
          "ba": 0.347,
          "slg": 0.609,
          "barrel_rate": 0.094,
          "label": "Angle",
          "explainer": "Daniel Schneemann TB angle vs Tyler Phillips on Curveball (17% usage): pitch-type fit.",
          "metrics": "0.347 BA · 0.609 SLG · 9% barrel"
        },
        {
          "player": "Jakob Marsee",
          "team": "MIA",
          "market": "Batter TB",
          "side": "Over",
          "line": 1.5,
          "probability": 0.409,
          "fair": 145,
          "play_to": 155,
          "pitcher": "Joey Cantillo",
          "pitch_type": "CH",
          "pitch_name": "Changeup",
          "usage": 26.7,
          "ba": 0.345,
          "slg": 0.577,
          "barrel_rate": 0.094,
          "label": "Angle",
          "explainer": "Jakob Marsee TB angle vs Joey Cantillo on Changeup (27% usage): starter shows this pitch often.",
          "metrics": "0.345 BA · 0.577 SLG · 9% barrel"
        }
      ],
      "k_targets": [
        {
          "batter": "Kyle Stowers",
          "team": "MIA",
          "pitcher": "Joey Cantillo",
          "pitch_type": "CU",
          "pitch_name": "Curveball",
          "usage": 25.4,
          "whiff_rate": 0.335,
          "chase_rate": 0.269,
          "market": "Batter strikeouts",
          "side": "Over",
          "line": 0.5,
          "probability": 0.589,
          "label": "Strong K target",
          "explainer": "Kyle Stowers has a high whiff profile against Curveball; Joey Cantillo throws it 25% of the time.",
          "fair": -143,
          "play_to": -133
        }
      ],
      "prop_angles": [
        {
          "player": "Joey Cantillo",
          "market": "Pitcher strikeouts",
          "side": "Over",
          "line": 5.5,
          "projected": 6.2,
          "base_projected": 5.2,
          "fair": -186,
          "under_fair": 186,
          "base_fair": 135,
          "base_under_fair": -135,
          "book": null,
          "play_to": -176,
          "under_play_to": 196,
          "base_play_to": 145,
          "base_under_play_to": -125,
          "designation": "Watch price",
          "explainer": "Ceiling game view: starts from base K workload, adds chase/whiff upside, and suppresses the ceiling when the starter's damage profile threatens early traffic or shorter leash."
        },
        {
          "player": "Tyler Phillips",
          "market": "Pitcher strikeouts",
          "side": "Over",
          "line": 3.5,
          "projected": 4.6,
          "base_projected": 3.7,
          "fair": -186,
          "under_fair": 186,
          "base_fair": -120,
          "base_under_fair": 120,
          "book": null,
          "play_to": -176,
          "under_play_to": 196,
          "base_play_to": -110,
          "base_under_play_to": 130,
          "designation": "Watch price",
          "explainer": "Ceiling game view: starts from base K workload, adds chase/whiff upside, and suppresses the ceiling when the starter's damage profile threatens early traffic or shorter leash."
        }
      ]
    },
    {
      "id": 823681,
      "away": "LAA",
      "home": "MIN",
      "away_name": "Los Angeles Angels",
      "home_name": "Minnesota Twins",
      "away_starter": "José Soriano",
      "home_starter": "Taj Bradley",
      "status": "Scheduled",
      "time": "2:10 PM ET",
      "day_night": "day",
      "away_score": 4.3,
      "home_score": 4.3,
      "total": 8.6,
      "home_win_probability": 0.5,
      "moneyline_fairs": {
        "away_probability": 0.5,
        "home_probability": 0.5,
        "away_fair": -100,
        "home_fair": -100
      },
      "team_total_fairs": {
        "away": 4.3,
        "home": 4.3
      },
      "f5": {
        "away_score": 2.2,
        "home_score": 2.2,
        "total": 4.4,
        "home_win_probability": 0.5,
        "away_fair": -100,
        "home_fair": -100
      },
      "synthesis": "The board sees a balanced run environment. Neither side has a meaningful projected scoring edge.",
      "batter_prop_angles": [
        {
          "player": "Ryan Kreidler",
          "team": "MIN",
          "market": "Batter hits",
          "side": "Over",
          "line": 0.5,
          "probability": 0.74,
          "fair": -285,
          "play_to": -275,
          "pitcher": "José Soriano",
          "pitch_type": "SI",
          "pitch_name": "Sinker",
          "usage": 25.6,
          "ba": 0.438,
          "slg": 0.63,
          "barrel_rate": 0.032,
          "label": "Strong angle",
          "explainer": "Ryan Kreidler hits angle vs José Soriano on Sinker (26% usage): high contact fit, starter shows this pitch often, hit-market profile.",
          "metrics": "0.438 BA · 0.630 SLG · 3% barrel"
        },
        {
          "player": "Donovan Walton",
          "team": "LAA",
          "market": "Batter hits",
          "side": "Over",
          "line": 0.5,
          "probability": 0.739,
          "fair": -283,
          "play_to": -273,
          "pitcher": "Taj Bradley",
          "pitch_type": "FF",
          "pitch_name": "4-Seam Fastball",
          "usage": 47.4,
          "ba": 0.433,
          "slg": 0.827,
          "barrel_rate": 0.089,
          "label": "Strong angle",
          "explainer": "Donovan Walton hits angle vs Taj Bradley on 4-Seam Fastball (47% usage): high contact fit, starter shows this pitch often, hit-market profile.",
          "metrics": "0.433 BA · 0.827 SLG · 9% barrel"
        },
        {
          "player": "Donovan Walton",
          "team": "LAA",
          "market": "Batter TB",
          "side": "Over",
          "line": 1.5,
          "probability": 0.468,
          "fair": 114,
          "play_to": 124,
          "pitcher": "Taj Bradley",
          "pitch_type": "FF",
          "pitch_name": "4-Seam Fastball",
          "usage": 47.4,
          "ba": 0.433,
          "slg": 0.827,
          "barrel_rate": 0.089,
          "label": "Strong angle",
          "explainer": "Donovan Walton TB angle vs Taj Bradley on 4-Seam Fastball (47% usage): extra-base damage fit, starter shows this pitch often.",
          "metrics": "0.433 BA · 0.827 SLG · 9% barrel"
        },
        {
          "player": "Oswald Peraza",
          "team": "LAA",
          "market": "Batter HR",
          "side": "Over",
          "line": 0.5,
          "probability": 0.119,
          "fair": 738,
          "play_to": 748,
          "pitcher": "Taj Bradley",
          "pitch_type": "FC",
          "pitch_name": "Cutter",
          "usage": 24.1,
          "ba": 0.305,
          "slg": 0.609,
          "barrel_rate": 0.189,
          "label": "Strong angle",
          "explainer": "Oswald Peraza HR angle vs Taj Bradley on Cutter (24% usage): home-run barrel signal, starter shows this pitch often.",
          "metrics": "0.305 BA · 0.609 SLG · 19% barrel"
        },
        {
          "player": "Ryan Kreidler",
          "team": "MIN",
          "market": "Batter HR",
          "side": "Over",
          "line": 0.5,
          "probability": 0.112,
          "fair": 793,
          "play_to": 803,
          "pitcher": "José Soriano",
          "pitch_type": "FF",
          "pitch_name": "4-Seam Fastball",
          "usage": 23.4,
          "ba": 0.266,
          "slg": 0.613,
          "barrel_rate": 0.165,
          "label": "Strong angle",
          "explainer": "Ryan Kreidler HR angle vs José Soriano on 4-Seam Fastball (23% usage): home-run barrel signal, starter shows this pitch often.",
          "metrics": "0.266 BA · 0.613 SLG · 16% barrel"
        },
        {
          "player": "Oswald Peraza",
          "team": "LAA",
          "market": "Batter hits",
          "side": "Over",
          "line": 0.5,
          "probability": 0.685,
          "fair": -218,
          "play_to": -208,
          "pitcher": "Taj Bradley",
          "pitch_type": "FC",
          "pitch_name": "Cutter",
          "usage": 24.1,
          "ba": 0.305,
          "slg": 0.609,
          "barrel_rate": 0.189,
          "label": "Angle",
          "explainer": "Oswald Peraza hits angle vs Taj Bradley on Cutter (24% usage): starter shows this pitch often, hit-market profile.",
          "metrics": "0.305 BA · 0.609 SLG · 19% barrel"
        },
        {
          "player": "Ryan Kreidler",
          "team": "MIN",
          "market": "Batter TB",
          "side": "Over",
          "line": 1.5,
          "probability": 0.418,
          "fair": 139,
          "play_to": 149,
          "pitcher": "José Soriano",
          "pitch_type": "FF",
          "pitch_name": "4-Seam Fastball",
          "usage": 23.4,
          "ba": 0.266,
          "slg": 0.613,
          "barrel_rate": 0.165,
          "label": "Angle",
          "explainer": "Ryan Kreidler TB angle vs José Soriano on 4-Seam Fastball (23% usage): barrel-backed contact, starter shows this pitch often.",
          "metrics": "0.266 BA · 0.613 SLG · 16% barrel"
        },
        {
          "player": "Oswald Peraza",
          "team": "LAA",
          "market": "Batter TB",
          "side": "Over",
          "line": 1.5,
          "probability": 0.417,
          "fair": 140,
          "play_to": 150,
          "pitcher": "Taj Bradley",
          "pitch_type": "FC",
          "pitch_name": "Cutter",
          "usage": 24.1,
          "ba": 0.305,
          "slg": 0.609,
          "barrel_rate": 0.189,
          "label": "Angle",
          "explainer": "Oswald Peraza TB angle vs Taj Bradley on Cutter (24% usage): barrel-backed contact, starter shows this pitch often.",
          "metrics": "0.305 BA · 0.609 SLG · 19% barrel"
        },
        {
          "player": "Donovan Walton",
          "team": "LAA",
          "market": "Batter HR",
          "side": "Over",
          "line": 0.5,
          "probability": 0.088,
          "fair": 1039,
          "play_to": 1049,
          "pitcher": "Taj Bradley",
          "pitch_type": "FF",
          "pitch_name": "4-Seam Fastball",
          "usage": 47.4,
          "ba": 0.433,
          "slg": 0.827,
          "barrel_rate": 0.089,
          "label": "Angle",
          "explainer": "Donovan Walton HR angle vs Taj Bradley on 4-Seam Fastball (47% usage): power damage fit, starter shows this pitch often.",
          "metrics": "0.433 BA · 0.827 SLG · 9% barrel"
        }
      ],
      "k_targets": [
        {
          "batter": "Oswald Peraza",
          "team": "LAA",
          "pitcher": "Taj Bradley",
          "pitch_type": "FC",
          "pitch_name": "Cutter",
          "usage": 24.1,
          "whiff_rate": 0.306,
          "chase_rate": 0.32,
          "market": "Batter strikeouts",
          "side": "Over",
          "line": 0.5,
          "probability": 0.57,
          "label": "Strong K target",
          "explainer": "Oswald Peraza has a high whiff profile against Cutter; Taj Bradley throws it 24% of the time.",
          "fair": -133,
          "play_to": -123
        },
        {
          "batter": "Trevor Larnach",
          "team": "MIN",
          "pitcher": "José Soriano",
          "pitch_type": "FS",
          "pitch_name": "Split-Finger",
          "usage": 19.9,
          "whiff_rate": 0.45,
          "chase_rate": 0.306,
          "market": "Batter strikeouts",
          "side": "Over",
          "line": 0.5,
          "probability": 0.622,
          "label": "Strong K target",
          "explainer": "Trevor Larnach has a high whiff profile against Split-Finger; José Soriano throws it 20% of the time.",
          "fair": -165,
          "play_to": -155
        }
      ],
      "prop_angles": [
        {
          "player": "José Soriano",
          "market": "Pitcher strikeouts",
          "side": "Over",
          "line": 6.5,
          "projected": 7.5,
          "base_projected": 6.3,
          "fair": -186,
          "under_fair": 186,
          "base_fair": 123,
          "base_under_fair": -123,
          "book": null,
          "play_to": -176,
          "under_play_to": 196,
          "base_play_to": 133,
          "base_under_play_to": -113,
          "designation": "Watch price",
          "explainer": "Ceiling game view: starts from base K workload, adds chase/whiff upside, and suppresses the ceiling when the starter's damage profile threatens early traffic or shorter leash."
        },
        {
          "player": "Taj Bradley",
          "market": "Pitcher strikeouts",
          "side": "Over",
          "line": 6.5,
          "projected": 7.8,
          "base_projected": 6.8,
          "fair": -186,
          "under_fair": 186,
          "base_fair": -131,
          "base_under_fair": 131,
          "book": null,
          "play_to": -176,
          "under_play_to": 196,
          "base_play_to": -121,
          "base_under_play_to": 141,
          "designation": "Watch price",
          "explainer": "Ceiling game view: starts from base K workload, adds chase/whiff upside, and suppresses the ceiling when the starter's damage profile threatens early traffic or shorter leash."
        }
      ]
    },
    {
      "id": 824574,
      "away": "ATH",
      "home": "CWS",
      "away_name": "Athletics",
      "home_name": "Chicago White Sox",
      "away_starter": "J.T. Ginn",
      "home_starter": "Noah Schultz",
      "status": "Scheduled",
      "time": "2:10 PM ET",
      "day_night": "day",
      "away_score": 4.2,
      "home_score": 4.6,
      "total": 8.8,
      "home_win_probability": 0.579,
      "moneyline_fairs": {
        "away_probability": 0.421,
        "home_probability": 0.579,
        "away_fair": 138,
        "home_fair": -138
      },
      "team_total_fairs": {
        "away": 4.2,
        "home": 4.6
      },
      "f5": {
        "away_score": 2.1,
        "home_score": 2.3,
        "total": 4.4,
        "home_win_probability": 0.552,
        "away_fair": 123,
        "home_fair": -123
      },
      "synthesis": "The board sees a balanced run environment. CWS has the clearer projected scoring path.",
      "batter_prop_angles": [
        {
          "player": "Tyler Soderstrom",
          "team": "ATH",
          "market": "Batter hits",
          "side": "Over",
          "line": 0.5,
          "probability": 0.737,
          "fair": -281,
          "play_to": -271,
          "pitcher": "Noah Schultz",
          "pitch_type": "ST",
          "pitch_name": "Sweeper",
          "usage": 21.8,
          "ba": 0.429,
          "slg": 1.429,
          "barrel_rate": 0.4,
          "label": "Strong angle",
          "explainer": "Tyler Soderstrom hits angle vs Noah Schultz on Sweeper (22% usage): high contact fit, starter shows this pitch often, hit-market profile.",
          "metrics": "0.429 BA · 1.429 SLG · 40% barrel"
        },
        {
          "player": "Carlos Cortes",
          "team": "ATH",
          "market": "Batter hits",
          "side": "Over",
          "line": 0.5,
          "probability": 0.737,
          "fair": -281,
          "play_to": -271,
          "pitcher": "Noah Schultz",
          "pitch_type": "FC",
          "pitch_name": "Cutter",
          "usage": 20.2,
          "ba": 0.429,
          "slg": 1.286,
          "barrel_rate": 0.25,
          "label": "Strong angle",
          "explainer": "Carlos Cortes hits angle vs Noah Schultz on Cutter (20% usage): high contact fit, starter shows this pitch often, hit-market profile.",
          "metrics": "0.429 BA · 1.286 SLG · 25% barrel"
        },
        {
          "player": "Max Muncy",
          "team": "ATH",
          "market": "Batter hits",
          "side": "Over",
          "line": 0.5,
          "probability": 0.721,
          "fair": -259,
          "play_to": -249,
          "pitcher": "Noah Schultz",
          "pitch_type": "FF",
          "pitch_name": "4-Seam Fastball",
          "usage": 23.0,
          "ba": 0.382,
          "slg": 0.676,
          "barrel_rate": 0.217,
          "label": "Strong angle",
          "explainer": "Max Muncy hits angle vs Noah Schultz on 4-Seam Fastball (23% usage): high contact fit, starter shows this pitch often, hit-market profile.",
          "metrics": "0.382 BA · 0.676 SLG · 22% barrel"
        },
        {
          "player": "Montgomery",
          "team": "CWS",
          "market": "Batter hits",
          "side": "Over",
          "line": 0.5,
          "probability": 0.718,
          "fair": -255,
          "play_to": -245,
          "pitcher": "J.T. Ginn",
          "pitch_type": "FC",
          "pitch_name": "Cutter",
          "usage": 19.0,
          "ba": 0.375,
          "slg": 1.042,
          "barrel_rate": 0.333,
          "label": "Strong angle",
          "explainer": "Montgomery hits angle vs J.T. Ginn on Cutter (19% usage): high contact fit, starter shows this pitch often, hit-market profile.",
          "metrics": "0.375 BA · 1.042 SLG · 33% barrel"
        },
        {
          "player": "Randal Grichuk",
          "team": "CWS",
          "market": "Batter hits",
          "side": "Over",
          "line": 0.5,
          "probability": 0.706,
          "fair": -241,
          "play_to": -231,
          "pitcher": "J.T. Ginn",
          "pitch_type": "SI",
          "pitch_name": "Sinker",
          "usage": 34.3,
          "ba": 0.347,
          "slg": 0.695,
          "barrel_rate": 0.0,
          "label": "Strong angle",
          "explainer": "Randal Grichuk hits angle vs J.T. Ginn on Sinker (34% usage): starter shows this pitch often, hit-market profile.",
          "metrics": "0.347 BA · 0.695 SLG · 0% barrel"
        },
        {
          "player": "Tyler Soderstrom",
          "team": "ATH",
          "market": "Batter TB",
          "side": "Over",
          "line": 1.5,
          "probability": 0.562,
          "fair": -128,
          "play_to": -118,
          "pitcher": "Noah Schultz",
          "pitch_type": "ST",
          "pitch_name": "Sweeper",
          "usage": 21.8,
          "ba": 0.429,
          "slg": 1.429,
          "barrel_rate": 0.4,
          "label": "Strong angle",
          "explainer": "Tyler Soderstrom TB angle vs Noah Schultz on Sweeper (22% usage): extra-base damage fit, barrel-backed contact, starter shows this pitch often.",
          "metrics": "0.429 BA · 1.429 SLG · 40% barrel"
        },
        {
          "player": "Carlos Cortes",
          "team": "ATH",
          "market": "Batter TB",
          "side": "Over",
          "line": 1.5,
          "probability": 0.545,
          "fair": -120,
          "play_to": -110,
          "pitcher": "Noah Schultz",
          "pitch_type": "FC",
          "pitch_name": "Cutter",
          "usage": 20.2,
          "ba": 0.429,
          "slg": 1.286,
          "barrel_rate": 0.25,
          "label": "Strong angle",
          "explainer": "Carlos Cortes TB angle vs Noah Schultz on Cutter (20% usage): extra-base damage fit, barrel-backed contact, starter shows this pitch often.",
          "metrics": "0.429 BA · 1.286 SLG · 25% barrel"
        },
        {
          "player": "Montgomery",
          "team": "CWS",
          "market": "Batter TB",
          "side": "Over",
          "line": 1.5,
          "probability": 0.509,
          "fair": -104,
          "play_to": -94,
          "pitcher": "J.T. Ginn",
          "pitch_type": "FC",
          "pitch_name": "Cutter",
          "usage": 19.0,
          "ba": 0.375,
          "slg": 1.042,
          "barrel_rate": 0.333,
          "label": "Strong angle",
          "explainer": "Montgomery TB angle vs J.T. Ginn on Cutter (19% usage): extra-base damage fit, barrel-backed contact, starter shows this pitch often.",
          "metrics": "0.375 BA · 1.042 SLG · 33% barrel"
        },
        {
          "player": "Jonah Heim",
          "team": "ATH",
          "market": "Batter TB",
          "side": "Over",
          "line": 1.5,
          "probability": 0.483,
          "fair": 107,
          "play_to": 117,
          "pitcher": "Noah Schultz",
          "pitch_type": "SI",
          "pitch_name": "Sinker",
          "usage": 25.0,
          "ba": 0.27,
          "slg": 0.9,
          "barrel_rate": 0.209,
          "label": "Strong angle",
          "explainer": "Jonah Heim TB angle vs Noah Schultz on Sinker (25% usage): extra-base damage fit, barrel-backed contact, starter shows this pitch often.",
          "metrics": "0.270 BA · 0.900 SLG · 21% barrel"
        },
        {
          "player": "Tyler Soderstrom",
          "team": "ATH",
          "market": "Batter HR",
          "side": "Over",
          "line": 0.5,
          "probability": 0.166,
          "fair": 502,
          "play_to": 512,
          "pitcher": "Noah Schultz",
          "pitch_type": "ST",
          "pitch_name": "Sweeper",
          "usage": 21.8,
          "ba": 0.429,
          "slg": 1.429,
          "barrel_rate": 0.4,
          "label": "Strong angle",
          "explainer": "Tyler Soderstrom HR angle vs Noah Schultz on Sweeper (22% usage): home-run barrel signal, power damage fit, starter shows this pitch often.",
          "metrics": "0.429 BA · 1.429 SLG · 40% barrel"
        }
      ],
      "k_targets": [
        {
          "batter": "Montgomery",
          "team": "CWS",
          "pitcher": "J.T. Ginn",
          "pitch_type": "CH",
          "pitch_name": "Changeup",
          "usage": 19.8,
          "whiff_rate": 0.348,
          "chase_rate": 0.388,
          "market": "Batter strikeouts",
          "side": "Over",
          "line": 0.5,
          "probability": 0.572,
          "label": "K target",
          "explainer": "Montgomery has a high whiff profile against Changeup; J.T. Ginn throws it 20% of the time.",
          "fair": -134,
          "play_to": -124
        }
      ],
      "prop_angles": [
        {
          "player": "J.T. Ginn",
          "market": "Pitcher strikeouts",
          "side": "Over",
          "line": 4.5,
          "projected": 6.0,
          "base_projected": 4.9,
          "fair": -186,
          "under_fair": 186,
          "base_fair": -143,
          "base_under_fair": 143,
          "book": null,
          "play_to": -176,
          "under_play_to": 196,
          "base_play_to": -133,
          "base_under_play_to": 153,
          "designation": "Watch price",
          "explainer": "Ceiling game view: starts from base K workload, adds chase/whiff upside, and suppresses the ceiling when the starter's damage profile threatens early traffic or shorter leash."
        },
        {
          "player": "Noah Schultz",
          "market": "Pitcher strikeouts",
          "side": "Over",
          "line": 4.5,
          "projected": 4.9,
          "base_projected": 4.3,
          "fair": -137,
          "under_fair": 137,
          "base_fair": 121,
          "base_under_fair": -121,
          "book": null,
          "play_to": -127,
          "under_play_to": 147,
          "base_play_to": 131,
          "base_under_play_to": -111,
          "designation": "Watch price",
          "explainer": "Ceiling game view: starts from base K workload, adds chase/whiff upside, and suppresses the ceiling when the starter's damage profile threatens early traffic or shorter leash."
        }
      ]
    },
    {
      "id": 823029,
      "away": "ATL",
      "home": "STL",
      "away_name": "Atlanta Braves",
      "home_name": "St. Louis Cardinals",
      "away_starter": "JR Ritchie",
      "home_starter": "Dustin May",
      "status": "Scheduled",
      "time": "2:15 PM ET",
      "day_night": "day",
      "away_score": 4.8,
      "home_score": 4.7,
      "total": 9.5,
      "home_win_probability": 0.48,
      "moneyline_fairs": {
        "away_probability": 0.52,
        "home_probability": 0.48,
        "away_fair": -108,
        "home_fair": 108
      },
      "team_total_fairs": {
        "away": 4.8,
        "home": 4.7
      },
      "f5": {
        "away_score": 2.4,
        "home_score": 2.4,
        "total": 4.8,
        "home_win_probability": 0.5,
        "away_fair": -100,
        "home_fair": -100
      },
      "synthesis": "The board sees a higher-scoring game script. Neither side has a meaningful projected scoring edge.",
      "batter_prop_angles": [
        {
          "player": "Mauricio Dubón",
          "team": "ATL",
          "market": "Batter hits",
          "side": "Over",
          "line": 0.5,
          "probability": 0.74,
          "fair": -285,
          "play_to": -275,
          "pitcher": "Dustin May",
          "pitch_type": "FC",
          "pitch_name": "Cutter",
          "usage": 22.2,
          "ba": 0.44,
          "slg": 0.642,
          "barrel_rate": 0.029,
          "label": "Strong angle",
          "explainer": "Mauricio Dubón hits angle vs Dustin May on Cutter (22% usage): high contact fit, starter shows this pitch often, hit-market profile.",
          "metrics": "0.440 BA · 0.642 SLG · 3% barrel"
        },
        {
          "player": "Alec Burleson",
          "team": "STL",
          "market": "Batter hits",
          "side": "Over",
          "line": 0.5,
          "probability": 0.712,
          "fair": -247,
          "play_to": -237,
          "pitcher": "JR Ritchie",
          "pitch_type": "CU",
          "pitch_name": "Curveball",
          "usage": 26.0,
          "ba": 0.359,
          "slg": 0.691,
          "barrel_rate": 0.152,
          "label": "Strong angle",
          "explainer": "Alec Burleson hits angle vs JR Ritchie on Curveball (26% usage): high contact fit, starter shows this pitch often, hit-market profile.",
          "metrics": "0.359 BA · 0.691 SLG · 15% barrel"
        },
        {
          "player": "Jorge Mateo",
          "team": "ATL",
          "market": "Batter hits",
          "side": "Over",
          "line": 0.5,
          "probability": 0.707,
          "fair": -241,
          "play_to": -231,
          "pitcher": "Dustin May",
          "pitch_type": "FF",
          "pitch_name": "4-Seam Fastball",
          "usage": 26.5,
          "ba": 0.348,
          "slg": 0.519,
          "barrel_rate": 0.082,
          "label": "Strong angle",
          "explainer": "Jorge Mateo hits angle vs Dustin May on 4-Seam Fastball (26% usage): starter shows this pitch often, hit-market profile.",
          "metrics": "0.348 BA · 0.519 SLG · 8% barrel"
        },
        {
          "player": "Drake Baldwin",
          "team": "ATL",
          "market": "Batter HR",
          "side": "Over",
          "line": 0.5,
          "probability": 0.166,
          "fair": 502,
          "play_to": 512,
          "pitcher": "Dustin May",
          "pitch_type": "ST",
          "pitch_name": "Sweeper",
          "usage": 19.3,
          "ba": 0.3,
          "slg": 0.6,
          "barrel_rate": 0.5,
          "label": "Strong angle",
          "explainer": "Drake Baldwin HR angle vs Dustin May on Sweeper (19% usage): home-run barrel signal, starter shows this pitch often.",
          "metrics": "0.300 BA · 0.600 SLG · 50% barrel"
        },
        {
          "player": "Matt Olson",
          "team": "ATL",
          "market": "Batter HR",
          "side": "Over",
          "line": 0.5,
          "probability": 0.112,
          "fair": 793,
          "play_to": 803,
          "pitcher": "Dustin May",
          "pitch_type": "SI",
          "pitch_name": "Sinker",
          "usage": 17.8,
          "ba": 0.327,
          "slg": 0.606,
          "barrel_rate": 0.165,
          "label": "Strong angle",
          "explainer": "Matt Olson HR angle vs Dustin May on Sinker (18% usage): home-run barrel signal.",
          "metrics": "0.327 BA · 0.606 SLG · 16% barrel"
        },
        {
          "player": "Alec Burleson",
          "team": "STL",
          "market": "Batter HR",
          "side": "Over",
          "line": 0.5,
          "probability": 0.108,
          "fair": 826,
          "play_to": 836,
          "pitcher": "JR Ritchie",
          "pitch_type": "CU",
          "pitch_name": "Curveball",
          "usage": 26.0,
          "ba": 0.359,
          "slg": 0.691,
          "barrel_rate": 0.152,
          "label": "Strong angle",
          "explainer": "Alec Burleson HR angle vs JR Ritchie on Curveball (26% usage): home-run barrel signal, starter shows this pitch often.",
          "metrics": "0.359 BA · 0.691 SLG · 15% barrel"
        },
        {
          "player": "Jordan Walker",
          "team": "STL",
          "market": "Batter hits",
          "side": "Over",
          "line": 0.5,
          "probability": 0.7,
          "fair": -233,
          "play_to": -223,
          "pitcher": "JR Ritchie",
          "pitch_type": "CH",
          "pitch_name": "Changeup",
          "usage": 17.1,
          "ba": 0.333,
          "slg": 0.611,
          "barrel_rate": 0.136,
          "label": "Angle",
          "explainer": "Jordan Walker hits angle vs JR Ritchie on Changeup (17% usage): hit-market profile.",
          "metrics": "0.333 BA · 0.611 SLG · 14% barrel"
        },
        {
          "player": "Matt Olson",
          "team": "ATL",
          "market": "Batter hits",
          "side": "Over",
          "line": 0.5,
          "probability": 0.697,
          "fair": -230,
          "play_to": -220,
          "pitcher": "Dustin May",
          "pitch_type": "SI",
          "pitch_name": "Sinker",
          "usage": 17.8,
          "ba": 0.327,
          "slg": 0.606,
          "barrel_rate": 0.165,
          "label": "Angle",
          "explainer": "Matt Olson hits angle vs Dustin May on Sinker (18% usage): hit-market profile.",
          "metrics": "0.327 BA · 0.606 SLG · 16% barrel"
        },
        {
          "player": "Drake Baldwin",
          "team": "ATL",
          "market": "Batter hits",
          "side": "Over",
          "line": 0.5,
          "probability": 0.682,
          "fair": -215,
          "play_to": -205,
          "pitcher": "Dustin May",
          "pitch_type": "ST",
          "pitch_name": "Sweeper",
          "usage": 19.3,
          "ba": 0.3,
          "slg": 0.6,
          "barrel_rate": 0.5,
          "label": "Angle",
          "explainer": "Drake Baldwin hits angle vs Dustin May on Sweeper (19% usage): starter shows this pitch often, hit-market profile.",
          "metrics": "0.300 BA · 0.600 SLG · 50% barrel"
        },
        {
          "player": "Alec Burleson",
          "team": "STL",
          "market": "Batter TB",
          "side": "Over",
          "line": 1.5,
          "probability": 0.438,
          "fair": 129,
          "play_to": 139,
          "pitcher": "JR Ritchie",
          "pitch_type": "CU",
          "pitch_name": "Curveball",
          "usage": 26.0,
          "ba": 0.359,
          "slg": 0.691,
          "barrel_rate": 0.152,
          "label": "Angle",
          "explainer": "Alec Burleson TB angle vs JR Ritchie on Curveball (26% usage): extra-base damage fit, barrel-backed contact, starter shows this pitch often.",
          "metrics": "0.359 BA · 0.691 SLG · 15% barrel"
        }
      ],
      "k_targets": [
        {
          "batter": "Jordan Walker",
          "team": "STL",
          "pitcher": "JR Ritchie",
          "pitch_type": "CH",
          "pitch_name": "Changeup",
          "usage": 17.1,
          "whiff_rate": 0.37,
          "chase_rate": 0.397,
          "market": "Batter strikeouts",
          "side": "Over",
          "line": 0.5,
          "probability": 0.569,
          "label": "K target",
          "explainer": "Jordan Walker has a high whiff profile against Changeup; JR Ritchie throws it 17% of the time.",
          "fair": -132,
          "play_to": -122
        }
      ],
      "prop_angles": [
        {
          "player": "JR Ritchie",
          "market": "Pitcher strikeouts",
          "side": "Over",
          "line": 4.5,
          "projected": 5.5,
          "base_projected": 4.7,
          "fair": -186,
          "under_fair": 186,
          "base_fair": -115,
          "base_under_fair": 115,
          "book": null,
          "play_to": -176,
          "under_play_to": 196,
          "base_play_to": -105,
          "base_under_play_to": 125,
          "designation": "Watch price",
          "explainer": "Ceiling game view: starts from base K workload, adds chase/whiff upside, and suppresses the ceiling when the starter's damage profile threatens early traffic or shorter leash."
        },
        {
          "player": "Dustin May",
          "market": "Pitcher strikeouts",
          "side": "Over",
          "line": 5.5,
          "projected": 6.2,
          "base_projected": 5.2,
          "fair": -186,
          "under_fair": 186,
          "base_fair": 126,
          "base_under_fair": -126,
          "book": null,
          "play_to": -176,
          "under_play_to": 196,
          "base_play_to": 136,
          "base_under_play_to": -116,
          "designation": "Watch price",
          "explainer": "Ceiling game view: starts from base K workload, adds chase/whiff upside, and suppresses the ceiling when the starter's damage profile threatens early traffic or shorter leash."
        }
      ]
    },
    {
      "id": 822876,
      "away": "HOU",
      "home": "TEX",
      "away_name": "Houston Astros",
      "home_name": "Texas Rangers",
      "away_starter": "Cristian Javier",
      "home_starter": "MacKenzie Gore",
      "status": "Scheduled",
      "time": "2:35 PM ET",
      "day_night": "day",
      "away_score": 4.6,
      "home_score": 3.7,
      "total": 8.3,
      "home_win_probability": 0.327,
      "moneyline_fairs": {
        "away_probability": 0.673,
        "home_probability": 0.327,
        "away_fair": -206,
        "home_fair": 206
      },
      "team_total_fairs": {
        "away": 4.6,
        "home": 3.7
      },
      "f5": {
        "away_score": 2.3,
        "home_score": 1.7,
        "total": 4.0,
        "home_win_probability": 0.347,
        "away_fair": -188,
        "home_fair": 188
      },
      "synthesis": "The board sees a balanced run environment. HOU has the clearer projected scoring path.",
      "batter_prop_angles": [
        {
          "player": "Yordan Alvarez",
          "team": "HOU",
          "market": "Batter hits",
          "side": "Over",
          "line": 0.5,
          "probability": 0.71,
          "fair": -245,
          "play_to": -235,
          "pitcher": "MacKenzie Gore",
          "pitch_type": "CU",
          "pitch_name": "Curveball",
          "usage": 21.4,
          "ba": 0.355,
          "slg": 0.806,
          "barrel_rate": 0.261,
          "label": "Strong angle",
          "explainer": "Yordan Alvarez hits angle vs MacKenzie Gore on Curveball (21% usage): high contact fit, starter shows this pitch often, hit-market profile.",
          "metrics": "0.355 BA · 0.806 SLG · 26% barrel"
        },
        {
          "player": "Yordan Alvarez",
          "team": "HOU",
          "market": "Batter TB",
          "side": "Over",
          "line": 1.5,
          "probability": 0.464,
          "fair": 116,
          "play_to": 126,
          "pitcher": "MacKenzie Gore",
          "pitch_type": "CU",
          "pitch_name": "Curveball",
          "usage": 21.4,
          "ba": 0.355,
          "slg": 0.806,
          "barrel_rate": 0.261,
          "label": "Strong angle",
          "explainer": "Yordan Alvarez TB angle vs MacKenzie Gore on Curveball (21% usage): extra-base damage fit, barrel-backed contact, starter shows this pitch often.",
          "metrics": "0.355 BA · 0.806 SLG · 26% barrel"
        },
        {
          "player": "Kyle Higashioka",
          "team": "TEX",
          "market": "Batter TB",
          "side": "Over",
          "line": 1.5,
          "probability": 0.455,
          "fair": 120,
          "play_to": 130,
          "pitcher": "Cristian Javier",
          "pitch_type": "CH",
          "pitch_name": "Changeup",
          "usage": 16.7,
          "ba": 0.3,
          "slg": 0.767,
          "barrel_rate": 0.22,
          "label": "Strong angle",
          "explainer": "Kyle Higashioka TB angle vs Cristian Javier on Changeup (17% usage): extra-base damage fit, barrel-backed contact.",
          "metrics": "0.300 BA · 0.767 SLG · 22% barrel"
        },
        {
          "player": "Yordan Alvarez",
          "team": "HOU",
          "market": "Batter HR",
          "side": "Over",
          "line": 0.5,
          "probability": 0.141,
          "fair": 610,
          "play_to": 620,
          "pitcher": "MacKenzie Gore",
          "pitch_type": "CU",
          "pitch_name": "Curveball",
          "usage": 21.4,
          "ba": 0.355,
          "slg": 0.806,
          "barrel_rate": 0.261,
          "label": "Strong angle",
          "explainer": "Yordan Alvarez HR angle vs MacKenzie Gore on Curveball (21% usage): home-run barrel signal, power damage fit, starter shows this pitch often.",
          "metrics": "0.355 BA · 0.806 SLG · 26% barrel"
        },
        {
          "player": "Kyle Higashioka",
          "team": "TEX",
          "market": "Batter HR",
          "side": "Over",
          "line": 0.5,
          "probability": 0.129,
          "fair": 677,
          "play_to": 687,
          "pitcher": "Cristian Javier",
          "pitch_type": "CH",
          "pitch_name": "Changeup",
          "usage": 16.7,
          "ba": 0.3,
          "slg": 0.767,
          "barrel_rate": 0.22,
          "label": "Strong angle",
          "explainer": "Kyle Higashioka HR angle vs Cristian Javier on Changeup (17% usage): home-run barrel signal, power damage fit.",
          "metrics": "0.300 BA · 0.767 SLG · 22% barrel"
        },
        {
          "player": "Joc Pederson",
          "team": "TEX",
          "market": "Batter HR",
          "side": "Over",
          "line": 0.5,
          "probability": 0.118,
          "fair": 751,
          "play_to": 761,
          "pitcher": "Cristian Javier",
          "pitch_type": "FF",
          "pitch_name": "4-Seam Fastball",
          "usage": 48.5,
          "ba": 0.271,
          "slg": 0.573,
          "barrel_rate": 0.183,
          "label": "Strong angle",
          "explainer": "Joc Pederson HR angle vs Cristian Javier on 4-Seam Fastball (48% usage): home-run barrel signal, starter shows this pitch often.",
          "metrics": "0.271 BA · 0.573 SLG · 18% barrel"
        },
        {
          "player": "Ezequiel Duran",
          "team": "TEX",
          "market": "Batter hits",
          "side": "Over",
          "line": 0.5,
          "probability": 0.7,
          "fair": -233,
          "play_to": -223,
          "pitcher": "Cristian Javier",
          "pitch_type": "ST",
          "pitch_name": "Sweeper",
          "usage": 24.2,
          "ba": 0.333,
          "slg": 0.667,
          "barrel_rate": 0.103,
          "label": "Angle",
          "explainer": "Ezequiel Duran hits angle vs Cristian Javier on Sweeper (24% usage): starter shows this pitch often, hit-market profile.",
          "metrics": "0.333 BA · 0.667 SLG · 10% barrel"
        },
        {
          "player": "Kyle Higashioka",
          "team": "TEX",
          "market": "Batter hits",
          "side": "Over",
          "line": 0.5,
          "probability": 0.682,
          "fair": -215,
          "play_to": -205,
          "pitcher": "Cristian Javier",
          "pitch_type": "CH",
          "pitch_name": "Changeup",
          "usage": 16.7,
          "ba": 0.3,
          "slg": 0.767,
          "barrel_rate": 0.22,
          "label": "Angle",
          "explainer": "Kyle Higashioka hits angle vs Cristian Javier on Changeup (17% usage): hit-market profile.",
          "metrics": "0.300 BA · 0.767 SLG · 22% barrel"
        },
        {
          "player": "Ezequiel Duran",
          "team": "TEX",
          "market": "Batter TB",
          "side": "Over",
          "line": 1.5,
          "probability": 0.432,
          "fair": 132,
          "play_to": 142,
          "pitcher": "Cristian Javier",
          "pitch_type": "ST",
          "pitch_name": "Sweeper",
          "usage": 24.2,
          "ba": 0.333,
          "slg": 0.667,
          "barrel_rate": 0.103,
          "label": "Angle",
          "explainer": "Ezequiel Duran TB angle vs Cristian Javier on Sweeper (24% usage): extra-base damage fit, barrel-backed contact, starter shows this pitch often.",
          "metrics": "0.333 BA · 0.667 SLG · 10% barrel"
        },
        {
          "player": "Joc Pederson",
          "team": "TEX",
          "market": "Batter TB",
          "side": "Over",
          "line": 1.5,
          "probability": 0.408,
          "fair": 145,
          "play_to": 155,
          "pitcher": "Cristian Javier",
          "pitch_type": "FF",
          "pitch_name": "4-Seam Fastball",
          "usage": 48.5,
          "ba": 0.271,
          "slg": 0.573,
          "barrel_rate": 0.183,
          "label": "Angle",
          "explainer": "Joc Pederson TB angle vs Cristian Javier on 4-Seam Fastball (48% usage): barrel-backed contact, starter shows this pitch often.",
          "metrics": "0.271 BA · 0.573 SLG · 18% barrel"
        }
      ],
      "k_targets": [
        {
          "batter": "Christian Walker",
          "team": "HOU",
          "pitcher": "MacKenzie Gore",
          "pitch_type": "CH",
          "pitch_name": "Changeup",
          "usage": 11.2,
          "whiff_rate": 0.327,
          "chase_rate": 0.29,
          "market": "Batter strikeouts",
          "side": "Over",
          "line": 0.5,
          "probability": 0.501,
          "label": "K target",
          "explainer": "Christian Walker has a high whiff profile against Changeup; MacKenzie Gore throws it 11% of the time.",
          "fair": -100,
          "play_to": -90
        },
        {
          "batter": "Kyle Higashioka",
          "team": "TEX",
          "pitcher": "Cristian Javier",
          "pitch_type": "CH",
          "pitch_name": "Changeup",
          "usage": 16.7,
          "whiff_rate": 0.43,
          "chase_rate": 0.343,
          "market": "Batter strikeouts",
          "side": "Over",
          "line": 0.5,
          "probability": 0.595,
          "label": "Strong K target",
          "explainer": "Kyle Higashioka has a high whiff profile against Changeup; Cristian Javier throws it 17% of the time.",
          "fair": -147,
          "play_to": -137
        }
      ],
      "prop_angles": [
        {
          "player": "Cristian Javier",
          "market": "Pitcher strikeouts",
          "side": "Over",
          "line": 1.5,
          "projected": 2.2,
          "base_projected": 1.7,
          "fair": -186,
          "under_fair": 186,
          "base_fair": -121,
          "base_under_fair": 121,
          "book": null,
          "play_to": -176,
          "under_play_to": 196,
          "base_play_to": -111,
          "base_under_play_to": 131,
          "designation": "Watch price",
          "explainer": "Ceiling game view: starts from base K workload, adds chase/whiff upside, and suppresses the ceiling when the starter's damage profile threatens early traffic or shorter leash."
        },
        {
          "player": "MacKenzie Gore",
          "market": "Pitcher strikeouts",
          "side": "Over",
          "line": 5.5,
          "projected": 7.0,
          "base_projected": 5.9,
          "fair": -186,
          "under_fair": 186,
          "base_fair": -146,
          "base_under_fair": 146,
          "book": null,
          "play_to": -176,
          "under_play_to": 196,
          "base_play_to": -136,
          "base_under_play_to": 156,
          "designation": "Watch price",
          "explainer": "Ceiling game view: starts from base K workload, adds chase/whiff upside, and suppresses the ceiling when the starter's damage profile threatens early traffic or shorter leash."
        }
      ]
    },
    {
      "id": 823199,
      "away": "COL",
      "home": "SF",
      "away_name": "Colorado Rockies",
      "home_name": "San Francisco Giants",
      "away_starter": "Michael Lorenzen",
      "home_starter": "Trevor McDonald",
      "status": "Scheduled",
      "time": "4:05 PM ET",
      "day_night": "day",
      "away_score": 4.4,
      "home_score": 3.9,
      "total": 8.3,
      "home_win_probability": 0.401,
      "moneyline_fairs": {
        "away_probability": 0.599,
        "home_probability": 0.401,
        "away_fair": -149,
        "home_fair": 149
      },
      "team_total_fairs": {
        "away": 4.4,
        "home": 3.9
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
      "batter_prop_angles": [
        {
          "player": "Casey Schmitt",
          "team": "SF",
          "market": "Batter hits",
          "side": "Over",
          "line": 0.5,
          "probability": 0.74,
          "fair": -285,
          "play_to": -275,
          "pitcher": "Michael Lorenzen",
          "pitch_type": "CH",
          "pitch_name": "Changeup",
          "usage": 20.2,
          "ba": 0.445,
          "slg": 0.999,
          "barrel_rate": 0.193,
          "label": "Strong angle",
          "explainer": "Casey Schmitt hits angle vs Michael Lorenzen on Changeup (20% usage): high contact fit, starter shows this pitch often, hit-market profile.",
          "metrics": "0.445 BA · 0.999 SLG · 19% barrel"
        },
        {
          "player": "Luis Arraez",
          "team": "SF",
          "market": "Batter hits",
          "side": "Over",
          "line": 0.5,
          "probability": 0.74,
          "fair": -285,
          "play_to": -275,
          "pitcher": "Michael Lorenzen",
          "pitch_type": "CU",
          "pitch_name": "Curveball",
          "usage": 12.0,
          "ba": 0.442,
          "slg": 0.588,
          "barrel_rate": 0.0,
          "label": "Strong angle",
          "explainer": "Luis Arraez hits angle vs Michael Lorenzen on Curveball (12% usage): high contact fit, hit-market profile.",
          "metrics": "0.442 BA · 0.588 SLG · 0% barrel"
        },
        {
          "player": "Jake McCarthy",
          "team": "COL",
          "market": "Batter hits",
          "side": "Over",
          "line": 0.5,
          "probability": 0.736,
          "fair": -279,
          "play_to": -269,
          "pitcher": "Trevor McDonald",
          "pitch_type": "SI",
          "pitch_name": "Sinker",
          "usage": 57.9,
          "ba": 0.425,
          "slg": 0.672,
          "barrel_rate": 0.067,
          "label": "Strong angle",
          "explainer": "Jake McCarthy hits angle vs Trevor McDonald on Sinker (58% usage): high contact fit, starter shows this pitch often, hit-market profile.",
          "metrics": "0.425 BA · 0.672 SLG · 7% barrel"
        },
        {
          "player": "Casey Schmitt",
          "team": "SF",
          "market": "Batter TB",
          "side": "Over",
          "line": 1.5,
          "probability": 0.501,
          "fair": -101,
          "play_to": -91,
          "pitcher": "Michael Lorenzen",
          "pitch_type": "CH",
          "pitch_name": "Changeup",
          "usage": 20.2,
          "ba": 0.445,
          "slg": 0.999,
          "barrel_rate": 0.193,
          "label": "Strong angle",
          "explainer": "Casey Schmitt TB angle vs Michael Lorenzen on Changeup (20% usage): extra-base damage fit, barrel-backed contact, starter shows this pitch often.",
          "metrics": "0.445 BA · 0.999 SLG · 19% barrel"
        },
        {
          "player": "Bryce Eldridge",
          "team": "SF",
          "market": "Batter TB",
          "side": "Over",
          "line": 1.5,
          "probability": 0.442,
          "fair": 126,
          "play_to": 136,
          "pitcher": "Michael Lorenzen",
          "pitch_type": "FF",
          "pitch_name": "4-Seam Fastball",
          "usage": 19.5,
          "ba": 0.303,
          "slg": 0.711,
          "barrel_rate": 0.249,
          "label": "Strong angle",
          "explainer": "Bryce Eldridge TB angle vs Michael Lorenzen on 4-Seam Fastball (20% usage): extra-base damage fit, barrel-backed contact, starter shows this pitch often.",
          "metrics": "0.303 BA · 0.711 SLG · 25% barrel"
        },
        {
          "player": "Bryce Eldridge",
          "team": "SF",
          "market": "Batter HR",
          "side": "Over",
          "line": 0.5,
          "probability": 0.137,
          "fair": 628,
          "play_to": 638,
          "pitcher": "Michael Lorenzen",
          "pitch_type": "FF",
          "pitch_name": "4-Seam Fastball",
          "usage": 19.5,
          "ba": 0.303,
          "slg": 0.711,
          "barrel_rate": 0.249,
          "label": "Strong angle",
          "explainer": "Bryce Eldridge HR angle vs Michael Lorenzen on 4-Seam Fastball (20% usage): home-run barrel signal, power damage fit, starter shows this pitch often.",
          "metrics": "0.303 BA · 0.711 SLG · 25% barrel"
        },
        {
          "player": "Hunter Goodman",
          "team": "COL",
          "market": "Batter HR",
          "side": "Over",
          "line": 0.5,
          "probability": 0.122,
          "fair": 719,
          "play_to": 729,
          "pitcher": "Trevor McDonald",
          "pitch_type": "SL",
          "pitch_name": "Slider",
          "usage": 26.8,
          "ba": 0.239,
          "slg": 0.629,
          "barrel_rate": 0.198,
          "label": "Strong angle",
          "explainer": "Hunter Goodman HR angle vs Trevor McDonald on Slider (27% usage): home-run barrel signal, starter shows this pitch often.",
          "metrics": "0.239 BA · 0.629 SLG · 20% barrel"
        },
        {
          "player": "Casey Schmitt",
          "team": "SF",
          "market": "Batter HR",
          "side": "Over",
          "line": 0.5,
          "probability": 0.121,
          "fair": 729,
          "play_to": 739,
          "pitcher": "Michael Lorenzen",
          "pitch_type": "CH",
          "pitch_name": "Changeup",
          "usage": 20.2,
          "ba": 0.445,
          "slg": 0.999,
          "barrel_rate": 0.193,
          "label": "Strong angle",
          "explainer": "Casey Schmitt HR angle vs Michael Lorenzen on Changeup (20% usage): home-run barrel signal, power damage fit, starter shows this pitch often.",
          "metrics": "0.445 BA · 0.999 SLG · 19% barrel"
        },
        {
          "player": "Bryce Eldridge",
          "team": "SF",
          "market": "Batter hits",
          "side": "Over",
          "line": 0.5,
          "probability": 0.684,
          "fair": -216,
          "play_to": -206,
          "pitcher": "Michael Lorenzen",
          "pitch_type": "FF",
          "pitch_name": "4-Seam Fastball",
          "usage": 19.5,
          "ba": 0.303,
          "slg": 0.711,
          "barrel_rate": 0.249,
          "label": "Angle",
          "explainer": "Bryce Eldridge hits angle vs Michael Lorenzen on 4-Seam Fastball (20% usage): starter shows this pitch often, hit-market profile.",
          "metrics": "0.303 BA · 0.711 SLG · 25% barrel"
        },
        {
          "player": "Jake McCarthy",
          "team": "COL",
          "market": "Batter TB",
          "side": "Over",
          "line": 1.5,
          "probability": 0.433,
          "fair": 131,
          "play_to": 141,
          "pitcher": "Trevor McDonald",
          "pitch_type": "SI",
          "pitch_name": "Sinker",
          "usage": 57.9,
          "ba": 0.425,
          "slg": 0.672,
          "barrel_rate": 0.067,
          "label": "Angle",
          "explainer": "Jake McCarthy TB angle vs Trevor McDonald on Sinker (58% usage): extra-base damage fit, starter shows this pitch often.",
          "metrics": "0.425 BA · 0.672 SLG · 7% barrel"
        }
      ],
      "k_targets": [
        {
          "batter": "Hunter Goodman",
          "team": "COL",
          "pitcher": "Trevor McDonald",
          "pitch_type": "SL",
          "pitch_name": "Slider",
          "usage": 26.8,
          "whiff_rate": 0.323,
          "chase_rate": 0.438,
          "market": "Batter strikeouts",
          "side": "Over",
          "line": 0.5,
          "probability": 0.604,
          "label": "Strong K target",
          "explainer": "Hunter Goodman has a high whiff profile against Slider; Trevor McDonald throws it 27% of the time.",
          "fair": -153,
          "play_to": -143
        }
      ],
      "prop_angles": [
        {
          "player": "Michael Lorenzen",
          "market": "Pitcher strikeouts",
          "side": "Over",
          "line": 3.5,
          "projected": 4.1,
          "base_projected": 3.4,
          "fair": -169,
          "under_fair": 169,
          "base_fair": 110,
          "base_under_fair": -110,
          "book": null,
          "play_to": -159,
          "under_play_to": 179,
          "base_play_to": 120,
          "base_under_play_to": -100,
          "designation": "Watch price",
          "explainer": "Ceiling game view: starts from base K workload, adds chase/whiff upside, and suppresses the ceiling when the starter's damage profile threatens early traffic or shorter leash."
        },
        {
          "player": "Trevor McDonald",
          "market": "Pitcher strikeouts",
          "side": "Over",
          "line": 4.5,
          "projected": 5.0,
          "base_projected": 4.0,
          "fair": -154,
          "under_fair": 154,
          "base_fair": 151,
          "base_under_fair": -151,
          "book": null,
          "play_to": -144,
          "under_play_to": 164,
          "base_play_to": 161,
          "base_under_play_to": -141,
          "designation": "Watch price",
          "explainer": "Ceiling game view: starts from base K workload, adds chase/whiff upside, and suppresses the ceiling when the starter's damage profile threatens early traffic or shorter leash."
        }
      ]
    },
    {
      "id": 823925,
      "away": "AZ",
      "home": "LAD",
      "away_name": "Arizona Diamondbacks",
      "home_name": "Los Angeles Dodgers",
      "away_starter": "Mitch Bratt",
      "home_starter": "Emmet Sheehan",
      "status": "Scheduled",
      "time": "4:10 PM ET",
      "day_night": "day",
      "away_score": 4.5,
      "home_score": 5.8,
      "total": 10.3,
      "home_win_probability": 0.739,
      "moneyline_fairs": {
        "away_probability": 0.261,
        "home_probability": 0.739,
        "away_fair": 283,
        "home_fair": -283
      },
      "team_total_fairs": {
        "away": 4.5,
        "home": 5.8
      },
      "f5": {
        "away_score": 2.2,
        "home_score": 2.7,
        "total": 4.9,
        "home_win_probability": 0.629,
        "away_fair": 170,
        "home_fair": -170
      },
      "synthesis": "The board sees a higher-scoring game script. LAD has the clearer projected scoring path.",
      "batter_prop_angles": [
        {
          "player": "Tommy Troy",
          "team": "AZ",
          "market": "Batter hits",
          "side": "Over",
          "line": 0.5,
          "probability": 0.74,
          "fair": -285,
          "play_to": -275,
          "pitcher": "Emmet Sheehan",
          "pitch_type": "FF",
          "pitch_name": "4-Seam Fastball",
          "usage": 43.1,
          "ba": 0.466,
          "slg": 0.914,
          "barrel_rate": 0.157,
          "label": "Strong angle",
          "explainer": "Tommy Troy hits angle vs Emmet Sheehan on 4-Seam Fastball (43% usage): high contact fit, starter shows this pitch often, hit-market profile.",
          "metrics": "0.466 BA · 0.914 SLG · 16% barrel"
        },
        {
          "player": "Shohei Ohtani",
          "team": "LAD",
          "market": "Batter hits",
          "side": "Over",
          "line": 0.5,
          "probability": 0.74,
          "fair": -285,
          "play_to": -275,
          "pitcher": "Mitch Bratt",
          "pitch_type": "SI",
          "pitch_name": "Sinker",
          "usage": 20.0,
          "ba": 0.507,
          "slg": 0.907,
          "barrel_rate": 0.167,
          "label": "Strong angle",
          "explainer": "Shohei Ohtani hits angle vs Mitch Bratt on Sinker (20% usage): high contact fit, starter shows this pitch often, hit-market profile.",
          "metrics": "0.507 BA · 0.907 SLG · 17% barrel"
        },
        {
          "player": "Max Muncy",
          "team": "LAD",
          "market": "Batter hits",
          "side": "Over",
          "line": 0.5,
          "probability": 0.707,
          "fair": -241,
          "play_to": -231,
          "pitcher": "Mitch Bratt",
          "pitch_type": "FF",
          "pitch_name": "4-Seam Fastball",
          "usage": 26.7,
          "ba": 0.348,
          "slg": 0.682,
          "barrel_rate": 0.211,
          "label": "Strong angle",
          "explainer": "Max Muncy hits angle vs Mitch Bratt on 4-Seam Fastball (27% usage): starter shows this pitch often, hit-market profile.",
          "metrics": "0.348 BA · 0.682 SLG · 21% barrel"
        },
        {
          "player": "Tommy Troy",
          "team": "AZ",
          "market": "Batter TB",
          "side": "Over",
          "line": 1.5,
          "probability": 0.486,
          "fair": 106,
          "play_to": 116,
          "pitcher": "Emmet Sheehan",
          "pitch_type": "FF",
          "pitch_name": "4-Seam Fastball",
          "usage": 43.1,
          "ba": 0.466,
          "slg": 0.914,
          "barrel_rate": 0.157,
          "label": "Strong angle",
          "explainer": "Tommy Troy TB angle vs Emmet Sheehan on 4-Seam Fastball (43% usage): extra-base damage fit, barrel-backed contact, starter shows this pitch often.",
          "metrics": "0.466 BA · 0.914 SLG · 16% barrel"
        },
        {
          "player": "Shohei Ohtani",
          "team": "LAD",
          "market": "Batter TB",
          "side": "Over",
          "line": 1.5,
          "probability": 0.484,
          "fair": 107,
          "play_to": 117,
          "pitcher": "Mitch Bratt",
          "pitch_type": "SI",
          "pitch_name": "Sinker",
          "usage": 20.0,
          "ba": 0.507,
          "slg": 0.907,
          "barrel_rate": 0.167,
          "label": "Strong angle",
          "explainer": "Shohei Ohtani TB angle vs Mitch Bratt on Sinker (20% usage): extra-base damage fit, barrel-backed contact, starter shows this pitch often.",
          "metrics": "0.507 BA · 0.907 SLG · 17% barrel"
        },
        {
          "player": "Max Muncy",
          "team": "LAD",
          "market": "Batter HR",
          "side": "Over",
          "line": 0.5,
          "probability": 0.126,
          "fair": 693,
          "play_to": 703,
          "pitcher": "Mitch Bratt",
          "pitch_type": "FF",
          "pitch_name": "4-Seam Fastball",
          "usage": 26.7,
          "ba": 0.348,
          "slg": 0.682,
          "barrel_rate": 0.211,
          "label": "Strong angle",
          "explainer": "Max Muncy HR angle vs Mitch Bratt on 4-Seam Fastball (27% usage): home-run barrel signal, starter shows this pitch often.",
          "metrics": "0.348 BA · 0.682 SLG · 21% barrel"
        },
        {
          "player": "Shohei Ohtani",
          "team": "LAD",
          "market": "Batter HR",
          "side": "Over",
          "line": 0.5,
          "probability": 0.113,
          "fair": 788,
          "play_to": 798,
          "pitcher": "Mitch Bratt",
          "pitch_type": "SI",
          "pitch_name": "Sinker",
          "usage": 20.0,
          "ba": 0.507,
          "slg": 0.907,
          "barrel_rate": 0.167,
          "label": "Strong angle",
          "explainer": "Shohei Ohtani HR angle vs Mitch Bratt on Sinker (20% usage): home-run barrel signal, power damage fit, starter shows this pitch often.",
          "metrics": "0.507 BA · 0.907 SLG · 17% barrel"
        },
        {
          "player": "Corbin Carroll",
          "team": "AZ",
          "market": "Batter HR",
          "side": "Over",
          "line": 0.5,
          "probability": 0.11,
          "fair": 806,
          "play_to": 816,
          "pitcher": "Emmet Sheehan",
          "pitch_type": "SL",
          "pitch_name": "Slider",
          "usage": 30.7,
          "ba": 0.28,
          "slg": 0.6,
          "barrel_rate": 0.16,
          "label": "Strong angle",
          "explainer": "Corbin Carroll HR angle vs Emmet Sheehan on Slider (31% usage): home-run barrel signal, starter shows this pitch often.",
          "metrics": "0.280 BA · 0.600 SLG · 16% barrel"
        },
        {
          "player": "Tommy Troy",
          "team": "AZ",
          "market": "Batter HR",
          "side": "Over",
          "line": 0.5,
          "probability": 0.109,
          "fair": 813,
          "play_to": 823,
          "pitcher": "Emmet Sheehan",
          "pitch_type": "FF",
          "pitch_name": "4-Seam Fastball",
          "usage": 43.1,
          "ba": 0.466,
          "slg": 0.914,
          "barrel_rate": 0.157,
          "label": "Strong angle",
          "explainer": "Tommy Troy HR angle vs Emmet Sheehan on 4-Seam Fastball (43% usage): home-run barrel signal, power damage fit, starter shows this pitch often.",
          "metrics": "0.466 BA · 0.914 SLG · 16% barrel"
        },
        {
          "player": "Max Muncy",
          "team": "LAD",
          "market": "Batter TB",
          "side": "Over",
          "line": 1.5,
          "probability": 0.435,
          "fair": 130,
          "play_to": 140,
          "pitcher": "Mitch Bratt",
          "pitch_type": "FF",
          "pitch_name": "4-Seam Fastball",
          "usage": 26.7,
          "ba": 0.348,
          "slg": 0.682,
          "barrel_rate": 0.211,
          "label": "Angle",
          "explainer": "Max Muncy TB angle vs Mitch Bratt on 4-Seam Fastball (27% usage): extra-base damage fit, barrel-backed contact, starter shows this pitch often.",
          "metrics": "0.348 BA · 0.682 SLG · 21% barrel"
        }
      ],
      "k_targets": [
        {
          "batter": "Max Muncy",
          "team": "LAD",
          "pitcher": "Mitch Bratt",
          "pitch_type": "SL",
          "pitch_name": "Slider",
          "usage": 20.0,
          "whiff_rate": 0.333,
          "chase_rate": 0.318,
          "market": "Batter strikeouts",
          "side": "Over",
          "line": 0.5,
          "probability": 0.56,
          "label": "K target",
          "explainer": "Max Muncy has a high whiff profile against Slider; Mitch Bratt throws it 20% of the time.",
          "fair": -127,
          "play_to": -117
        }
      ],
      "prop_angles": [
        {
          "player": "Mitch Bratt",
          "market": "Pitcher strikeouts",
          "side": "Over",
          "line": 3.5,
          "projected": 4.4,
          "base_projected": 3.0,
          "fair": -186,
          "under_fair": 186,
          "base_fair": 154,
          "base_under_fair": -154,
          "book": null,
          "play_to": -176,
          "under_play_to": 196,
          "base_play_to": 164,
          "base_under_play_to": -144,
          "designation": "Watch price",
          "explainer": "Ceiling game view: starts from base K workload, adds chase/whiff upside, and suppresses the ceiling when the starter's damage profile threatens early traffic or shorter leash."
        },
        {
          "player": "Emmet Sheehan",
          "market": "Pitcher strikeouts",
          "side": "Over",
          "line": 5.5,
          "projected": 6.6,
          "base_projected": 5.5,
          "fair": -186,
          "under_fair": 186,
          "base_fair": 103,
          "base_under_fair": -103,
          "book": null,
          "play_to": -176,
          "under_play_to": 196,
          "base_play_to": 113,
          "base_under_play_to": -93,
          "designation": "Watch price",
          "explainer": "Ceiling game view: starts from base K workload, adds chase/whiff upside, and suppresses the ceiling when the starter's damage profile threatens early traffic or shorter leash."
        }
      ]
    },
    {
      "id": 823274,
      "away": "TOR",
      "home": "SD",
      "away_name": "Toronto Blue Jays",
      "home_name": "San Diego Padres",
      "away_starter": "Kevin Gausman",
      "home_starter": "Germán Márquez",
      "status": "Scheduled",
      "time": "4:10 PM ET",
      "day_night": "day",
      "away_score": 3.6,
      "home_score": 4.4,
      "total": 8.0,
      "home_win_probability": 0.655,
      "moneyline_fairs": {
        "away_probability": 0.345,
        "home_probability": 0.655,
        "away_fair": 190,
        "home_fair": -190
      },
      "team_total_fairs": {
        "away": 3.6,
        "home": 4.4
      },
      "f5": {
        "away_score": 1.8,
        "home_score": 2.3,
        "total": 4.1,
        "home_win_probability": 0.629,
        "away_fair": 170,
        "home_fair": -170
      },
      "synthesis": "The board sees a lower-scoring game script. SD has the clearer projected scoring path.",
      "batter_prop_angles": [
        {
          "player": "Samad Taylor",
          "team": "SD",
          "market": "Batter hits",
          "side": "Over",
          "line": 0.5,
          "probability": 0.735,
          "fair": -277,
          "play_to": -267,
          "pitcher": "Kevin Gausman",
          "pitch_type": "FF",
          "pitch_name": "4-Seam Fastball",
          "usage": 51.5,
          "ba": 0.421,
          "slg": 0.421,
          "barrel_rate": 0.0,
          "label": "Strong angle",
          "explainer": "Samad Taylor hits angle vs Kevin Gausman on 4-Seam Fastball (52% usage): high contact fit, starter shows this pitch often, hit-market profile.",
          "metrics": "0.421 BA · 0.421 SLG · 0% barrel"
        },
        {
          "player": "Kazuma Okamoto",
          "team": "TOR",
          "market": "Batter HR",
          "side": "Over",
          "line": 0.5,
          "probability": 0.13,
          "fair": 671,
          "play_to": 681,
          "pitcher": "Germán Márquez",
          "pitch_type": "FF",
          "pitch_name": "4-Seam Fastball",
          "usage": 38.7,
          "ba": 0.313,
          "slg": 0.658,
          "barrel_rate": 0.223,
          "label": "Strong angle",
          "explainer": "Kazuma Okamoto HR angle vs Germán Márquez on 4-Seam Fastball (39% usage): home-run barrel signal, starter shows this pitch often.",
          "metrics": "0.313 BA · 0.658 SLG · 22% barrel"
        },
        {
          "player": "Kazuma Okamoto",
          "team": "TOR",
          "market": "Batter hits",
          "side": "Over",
          "line": 0.5,
          "probability": 0.689,
          "fair": -222,
          "play_to": -212,
          "pitcher": "Germán Márquez",
          "pitch_type": "FF",
          "pitch_name": "4-Seam Fastball",
          "usage": 38.7,
          "ba": 0.313,
          "slg": 0.658,
          "barrel_rate": 0.223,
          "label": "Angle",
          "explainer": "Kazuma Okamoto hits angle vs Germán Márquez on 4-Seam Fastball (39% usage): starter shows this pitch often, hit-market profile.",
          "metrics": "0.313 BA · 0.658 SLG · 22% barrel"
        },
        {
          "player": "Kazuma Okamoto",
          "team": "TOR",
          "market": "Batter TB",
          "side": "Over",
          "line": 1.5,
          "probability": 0.43,
          "fair": 133,
          "play_to": 143,
          "pitcher": "Germán Márquez",
          "pitch_type": "FF",
          "pitch_name": "4-Seam Fastball",
          "usage": 38.7,
          "ba": 0.313,
          "slg": 0.658,
          "barrel_rate": 0.223,
          "label": "Angle",
          "explainer": "Kazuma Okamoto TB angle vs Germán Márquez on 4-Seam Fastball (39% usage): extra-base damage fit, barrel-backed contact, starter shows this pitch often.",
          "metrics": "0.313 BA · 0.658 SLG · 22% barrel"
        }
      ],
      "k_targets": [
        {
          "batter": "Brandon Valenzuela",
          "team": "TOR",
          "pitcher": "Germán Márquez",
          "pitch_type": "SL",
          "pitch_name": "Slider",
          "usage": 11.3,
          "whiff_rate": 0.382,
          "chase_rate": 0.615,
          "market": "Batter strikeouts",
          "side": "Over",
          "line": 0.5,
          "probability": 0.558,
          "label": "K target",
          "explainer": "Brandon Valenzuela has a high whiff profile against Slider; Germán Márquez throws it 11% of the time.",
          "fair": -126,
          "play_to": -116
        }
      ],
      "prop_angles": [
        {
          "player": "Kevin Gausman",
          "market": "Pitcher strikeouts",
          "side": "Over",
          "line": 5.5,
          "projected": 7.1,
          "base_projected": 5.9,
          "fair": -186,
          "under_fair": 186,
          "base_fair": -145,
          "base_under_fair": 145,
          "book": null,
          "play_to": -176,
          "under_play_to": 196,
          "base_play_to": -135,
          "base_under_play_to": 155,
          "designation": "Watch price",
          "explainer": "Ceiling game view: starts from base K workload, adds chase/whiff upside, and suppresses the ceiling when the starter's damage profile threatens early traffic or shorter leash."
        },
        {
          "player": "Germán Márquez",
          "market": "Pitcher strikeouts",
          "side": "Over",
          "line": 3.5,
          "projected": 3.9,
          "base_projected": 3.2,
          "fair": -143,
          "under_fair": 143,
          "base_fair": 129,
          "base_under_fair": -129,
          "book": null,
          "play_to": -133,
          "under_play_to": 153,
          "base_play_to": 139,
          "base_under_play_to": -119,
          "designation": "Watch price",
          "explainer": "Ceiling game view: starts from base K workload, adds chase/whiff upside, and suppresses the ceiling when the starter's damage profile threatens early traffic or shorter leash."
        }
      ]
    }
  ],
  "top_board": {
    "best_hr_bets": [
      {
        "title": "Adley Rutschman HR",
        "subtitle": "BAL vs Seth Lugo · Cutter 16.8%",
        "game": "KC @ BAL",
        "fair": 502,
        "play_to": 512,
        "score": 0.166
      },
      {
        "title": "Tyler Soderstrom HR",
        "subtitle": "ATH vs Noah Schultz · Sweeper 21.8%",
        "game": "ATH @ CWS",
        "fair": 502,
        "play_to": 512,
        "score": 0.166
      },
      {
        "title": "Drake Baldwin HR",
        "subtitle": "ATL vs Dustin May · Sweeper 19.3%",
        "game": "ATL @ STL",
        "fair": 502,
        "play_to": 512,
        "score": 0.166
      },
      {
        "title": "Cal Raleigh HR",
        "subtitle": "SEA vs Ian Seymour · Sinker 13.5%",
        "game": "SEA @ TB",
        "fair": 520,
        "play_to": 530,
        "score": 0.161
      },
      {
        "title": "Ben Rice HR",
        "subtitle": "NYY vs Cade Cavalli · 4-Seam Fastball 34.6%",
        "game": "NYY @ WSH",
        "fair": 534,
        "play_to": 544,
        "score": 0.158
      }
    ],
    "best_pitcher_strikeout_bets": [
      {
        "title": "Zack Wheeler over Ks",
        "subtitle": "Base 7.9 · ceiling 9.4 · fallback line 7.5",
        "game": "PHI @ DET",
        "fair": -186,
        "play_to": -176,
        "score": 1.9000000000000004
      },
      {
        "title": "Tarik Skubal over Ks",
        "subtitle": "Base 7.8 · ceiling 9.3 · fallback line 7.5",
        "game": "PHI @ DET",
        "fair": -186,
        "play_to": -176,
        "score": 1.8000000000000007
      },
      {
        "title": "Paul Skenes over Ks",
        "subtitle": "Base 6.9 · ceiling 8.2 · fallback line 6.5",
        "game": "MIL @ PIT",
        "fair": -186,
        "play_to": -176,
        "score": 1.6999999999999993
      },
      {
        "title": "Kevin Gausman over Ks",
        "subtitle": "Base 5.9 · ceiling 7.1 · fallback line 5.5",
        "game": "TOR @ SD",
        "fair": -186,
        "play_to": -176,
        "score": 1.5999999999999996
      },
      {
        "title": "J.T. Ginn over Ks",
        "subtitle": "Base 4.9 · ceiling 6.0 · fallback line 4.5",
        "game": "ATH @ CWS",
        "fair": -186,
        "play_to": -176,
        "score": 1.5
      }
    ],
    "best_batter_strikeout_targets": [
      {
        "title": "Sal Stewart over 0.5 K",
        "subtitle": "CIN vs Matthew Boyd · 4-Seam Fastball 49.2%",
        "game": "CHC @ CIN",
        "fair": -213,
        "play_to": -203,
        "score": 0.68
      },
      {
        "title": "Colt Emerson over 0.5 K",
        "subtitle": "SEA vs Ian Seymour · Changeup 30.8%",
        "game": "SEA @ TB",
        "fair": -213,
        "play_to": -203,
        "score": 0.68
      },
      {
        "title": "Esmerlyn Valdez over 0.5 K",
        "subtitle": "PIT vs Robert Gasser · 4-Seam Fastball 22.9%",
        "game": "MIL @ PIT",
        "fair": -166,
        "play_to": -156,
        "score": 0.624
      },
      {
        "title": "Trevor Larnach over 0.5 K",
        "subtitle": "MIN vs José Soriano · Split-Finger 19.9%",
        "game": "LAA @ MIN",
        "fair": -165,
        "play_to": -155,
        "score": 0.622
      },
      {
        "title": "Kyle Schwarber over 0.5 K",
        "subtitle": "PHI vs Tarik Skubal · Changeup 24.9%",
        "game": "PHI @ DET",
        "fair": -161,
        "play_to": -151,
        "score": 0.617
      }
    ],
    "best_three_game_side_total_parlay": [
      {
        "title": "Over lean",
        "subtitle": "Fair total 10.3",
        "game": "AZ @ LAD",
        "fair": null,
        "play_to": null,
        "score": 1.6000000000000014,
        "type": "total"
      },
      {
        "title": "Over lean",
        "subtitle": "Fair total 9.9",
        "game": "MIL @ PIT",
        "fair": null,
        "play_to": null,
        "score": 1.200000000000001,
        "type": "total"
      },
      {
        "title": "Over lean",
        "subtitle": "Fair total 9.5",
        "game": "ATL @ STL",
        "fair": null,
        "play_to": null,
        "score": 0.8000000000000007,
        "type": "total"
      }
    ],
    "best_total_bets": [
      {
        "title": "Over lean",
        "subtitle": "Fair total 10.3",
        "game": "AZ @ LAD",
        "fair": null,
        "play_to": null,
        "score": 1.6000000000000014
      },
      {
        "title": "Over lean",
        "subtitle": "Fair total 9.9",
        "game": "MIL @ PIT",
        "fair": null,
        "play_to": null,
        "score": 1.200000000000001
      },
      {
        "title": "Over lean",
        "subtitle": "Fair total 9.5",
        "game": "ATL @ STL",
        "fair": null,
        "play_to": null,
        "score": 0.8000000000000007
      },
      {
        "title": "Under lean",
        "subtitle": "Fair total 8.0",
        "game": "CLE @ MIA",
        "fair": null,
        "play_to": null,
        "score": 0.6999999999999993
      },
      {
        "title": "Under lean",
        "subtitle": "Fair total 8.0",
        "game": "TOR @ SD",
        "fair": null,
        "play_to": null,
        "score": 0.6999999999999993
      }
    ]
  },
  "suppressed_games": [],
  "notice": "Customer-facing forecasts only. Missing values remain unavailable rather than estimated."
}
;

// CUSTOMER_BOARD_SAFE: this component receives only published customer
// forecasts. Model inputs, calibration tables, and scoring mechanics stay out
// of the browser bundle.
const CUSTOMER_FACING = true;
const PRELOADED_ODDS_API_KEY = import.meta.env.VITE_ODDS_API_KEY || "";
const PROP_PRICE_BLEND_WEIGHT = 0.18;
const K_FAIR_SCALE = 1.55;

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
    border-color: color-mix(in srgb, var(--accent) 55%, var(--border));
    background: var(--surface);
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
  .tile-meta { color: var(--text-secondary); font-size: 12px; font-weight: 500; font-variant-numeric: tabular-nums; }
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
  .edge-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; padding: 10px 16px 14px; }
  .edge-card {
    display: grid;
    gap: 6px;
    padding: 12px;
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    background: var(--surface-muted);
  }
  .edge-card strong { color: var(--text-primary); font-size: 13px; font-weight: 650; }
  .edge-card span { color: var(--text-secondary); font-size: 12px; line-height: 1.4; }
  .edge-controls { display: flex; align-items: center; justify-content: flex-end; gap: 10px; }
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
  .market-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
  .market-main { color: var(--text-primary); font-size: 22px; font-weight: 700; font-variant-numeric: tabular-nums; }
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
  .pill.bet, .pill.strong { color: var(--positive); background: #EAF8F2; border-color: #CDEDE0; }
  .pill.pass, .pill.watch { color: var(--text-secondary); background: var(--surface-muted); border-color: var(--border); }
  .night .pill.small, .night .pill.lean { color: #F0C777; background: #3A2A13; border-color: #574019; }
  .night .pill.bet, .night .pill.strong { color: #8FE4B9; background: #123326; border-color: #1D513C; }
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
  .results-details { margin: 0 16px 16px; border: 1px solid var(--border); border-radius: var(--radius-md); background: var(--surface-muted); }
  .results-details summary { padding: 11px 12px; color: var(--text-primary); font-size: 13px; font-weight: 650; cursor: pointer; }
  .results-details[open] summary { border-bottom: 1px solid var(--border); }
  .results-details:not([open]) .results-list { display: none; }
  .results-list { display: grid; gap: 8px; padding: 0 16px 16px; }
  .result-row {
    display: grid;
    grid-template-columns: 1.15fr .9fr .9fr .75fr .75fr;
    gap: 10px;
    align-items: center;
    padding: 10px 12px;
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    background: var(--surface);
  }
  .result-row strong { color: var(--text-primary); font-size: 13px; font-weight: 650; }
  .result-row span { color: var(--text-secondary); font-size: 12px; line-height: 1.35; font-variant-numeric: tabular-nums; }
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
  @media (max-width: 1080px) {
    .compact-scores, .market-grid, .edge-grid, .top-grid, .performance-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    .k-section { grid-template-columns: 1fr; }
    .result-row { grid-template-columns: 1fr 1fr; }
  }
  @media (max-width: 760px) {
    .topbar { align-items: flex-start; flex-direction: column; padding: 18px; }
    .top-actions { width: 100%; }
    .mode, .refresh { flex: 1; }
    .shell { padding: 18px; gap: 18px; }
    .compact-scores { display: flex; overflow-x: auto; scroll-snap-type: x mandatory; padding-bottom: 18px; }
    .score-tile { min-width: 280px; scroll-snap-align: start; }
    .market-grid, .edge-grid, .top-grid, .k-grid, .performance-grid, .result-row { grid-template-columns: 1fr; }
    .selected-main { flex-direction: column; }
    .selected-score { font-size: 24px; }
    .table { min-width: 680px; }
    .card:has(.table) { overflow-x: auto; }
  }
  @media (max-width: 460px) {
    .shell { padding: 14px; }
    .card-title { align-items: flex-start; flex-direction: column; gap: 4px; }
    .score-tile { min-width: 255px; }
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
  return key;
}

function propMarketText(market) {
  if (market === "Batter TB") return "total bases";
  if (market === "Batter HR") return "homerun";
  if (market === "Batter hits") return "hits";
  return market || "Prop";
}

function blendPropFairWithBook(fair, book) {
  const fairProbability = impliedProbability(fair);
  const bookProbability = impliedProbability(book);
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

function gradeCompletedGames(projections, statsGames) {
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
    const totalLine = [
      projection?.closing_total,
      projection?.market_total,
      projection?.book_total,
      projection?.total_line,
    ].map(Number).find(Number.isFinite);
    const projectedMargin = projectedHome - projectedAway;
    const actualMargin = actualHome - actualAway;
    const pickSide = Math.abs(projectedMargin) < 0.05 ? null : projectedMargin > 0 ? "home" : "away";
    const actualSide = actualMargin > 0 ? "home" : actualMargin < 0 ? "away" : "tie";
    const winnerCorrect = pickSide && actualSide !== "tie" ? pickSide === actualSide : null;
    const pickTeam = pickSide === "away" ? projection.away : pickSide === "home" ? projection.home : "No side";
    const actualWinner = actualSide === "away" ? projection.away : actualSide === "home" ? projection.home : "Tie";
    const totalDelta = actualTotal - projectedTotal;
    const totalError = Math.abs(totalDelta);
    const totalClose = totalError <= 1;
    const totalPick = Number.isFinite(totalLine) && Math.abs(projectedTotal - totalLine) >= 0.05 ? projectedTotal > totalLine ? "Over" : "Under" : null;
    const actualTotalSide = Number.isFinite(totalLine) ? actualTotal > totalLine ? "Over" : actualTotal < totalLine ? "Under" : "Push" : null;
    const totalCorrect = totalPick && actualTotalSide && actualTotalSide !== "Push" ? totalPick === actualTotalSide : null;
    return {
      id: projection.id || statsGame.gamePk,
      matchup: `${projection.away} @ ${projection.home}`,
      projected: `${projection.away} ${score(projectedAway)} · ${score(projectedHome)} ${projection.home}`,
      final: `${projection.away} ${actualAway} · ${actualHome} ${projection.home}`,
      pickTeam,
      actualWinner,
      winnerResult: winnerCorrect == null ? "No side" : winnerCorrect ? "Hit" : "Miss",
      winnerCorrect,
      totalLine: Number.isFinite(totalLine) ? totalLine : null,
      totalPick,
      actualTotalSide,
      totalCorrect,
      totalResult: totalCorrect == null ? (totalClose ? "Close" : "Miss") : totalCorrect ? "Hit" : "Miss",
      scoreMae: (Math.abs(actualAway - projectedAway) + Math.abs(actualHome - projectedHome)) / 2,
      totalError,
      marginError: Math.abs(actualMargin - projectedMargin),
      totalDelta,
    };
  }).filter(Boolean);
}

function summarizeResults(rows) {
  const completed = rows.length;
  const sideRows = rows.filter((row) => row.winnerCorrect != null);
  const totalBetRows = rows.filter((row) => row.totalCorrect != null);
  const closeTotalRows = rows.filter((row) => Number(row.totalError) <= 1);
  const average = (values) => values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
  const sideWins = sideRows.filter((row) => row.winnerCorrect).length;
  const totalWins = totalBetRows.filter((row) => row.totalCorrect).length;
  const metrics = [
    { label: "Finals graded", value: String(completed) },
    ...(sideRows.length ? [{ label: "Side record", value: recordText(sideWins, sideRows.length - sideWins) }] : []),
    ...(totalBetRows.length ? [{ label: "Total O/U record", value: recordText(totalWins, totalBetRows.length - totalWins) }] : []),
    { label: "Totals within 1", value: recordText(closeTotalRows.length, completed - closeTotalRows.length) },
    { label: "Score MAE", value: gradeValue(average(rows.map((row) => row.scoreMae))) },
    { label: "Total MAE", value: gradeValue(average(rows.map((row) => row.totalError))) },
    { label: "Total bias", value: signedRun(average(rows.map((row) => row.totalDelta))) },
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

function fairFromProjection(projected, line) {
  const projection = Number(projected);
  const bookLine = Number(line);
  if (!Number.isFinite(projection) || !Number.isFinite(bookLine)) return { over: null, under: null };
  const overProbability = clamp(1 / (1 + Math.exp(-(projection - bookLine) / K_FAIR_SCALE)), 0.08, 0.92);
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

function TopBoard({ board }) {
  const sections = [
    ["Best HR bets", board?.best_hr_bets || []],
    ["Best pitcher K bets", board?.best_pitcher_strikeout_bets || []],
    ["Best 3-leg parlay", board?.best_three_game_side_total_parlay || []],
    ["Best total bets", board?.best_total_bets || []],
  ];
  return <section className="card">
    <div className="card-title"><h2>Top board</h2><span className="muted">Pregame angles</span></div>
    <div className="top-grid">
      {sections.map(([title, items]) => <article className="top-card" key={title}>
        <h3>{title}</h3>
        {items.length ? items.map((item, index) => <div className="top-pick" key={`${title}-${item.title}-${index}`}>
          <strong>{item.title}</strong>
          <span>{item.game}</span>
          <span>{item.subtitle}</span>
          {(item.fair != null || item.play_to != null) ? <span>Fair {price(item.fair)} · play-to {price(item.play_to)}</span> : null}
        </div>) : <p className="muted">No angle cleared.</p>}
      </article>)}
    </div>
  </section>;
}

function Scoreboard({ games, gameIndex, onSelect }) {
  return <section className="card">
    <div className="card-title"><h2>Projected scores</h2><span className="muted">{games.length} games · tap a game for detail</span></div>
    <div className="compact-scores">
      {games.map((item, index) => {
        const moneylineFairs = baseMoneylineFairs(item);
        const favorite = favoriteFromMoneyline(item, moneylineFairs);
        return <button className={`score-tile ${index === gameIndex ? "active" : ""}`} type="button" key={`${item.id || index}-${item.away}-${item.home}`} onClick={() => onSelect(index)}>
          <span className="tile-head"><span>{item.away} @ {item.home}</span><span>{item.time || item.status || "—"}</span></span>
          <span className="tile-line"><span><small>{item.away}</small><b>{score(item.away_score)}</b></span><span><b>{score(item.home_score)}</b><small>{item.home}</small></span></span>
          <span className="tile-meta"><span>Total {score(item.total)}</span><span>{favorite ? `${favorite.team} ${Math.round(favorite.probability * 100)}%` : "—"}</span></span>
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

function edgeCents(fair, book) {
  const fairNumber = Number(fair);
  const bookNumber = Number(book);
  if (!Number.isFinite(fairNumber) || !Number.isFinite(bookNumber)) return null;
  return bookNumber - fairNumber;
}

function PricedEdgeBoard({ edges, hasOdds, controls }) {
  const status = edges.length ? `${edges.length} priced` : hasOdds ? "No qualifying edges" : "Waiting for odds";
  return <section className="card">
    <div className="card-title"><h2>Priced edges</h2><div className="edge-controls"><span className="muted">{status}</span>{controls}</div></div>
    {edges.length ? <div className="edge-grid">
      {edges.slice(0, 8).map((edge, index) => <article className="edge-card" key={`${edge.title}-${index}`}>
        <strong>{edge.title}</strong>
        <span>{edge.subtitle}</span>
        <span>Fair {price(edge.fair)} · book {price(edge.book)}{edge.bookName ? ` · ${edge.bookName}` : ""}</span>
        <span>{edge.label}</span>
      </article>)}
    </div> : <div className="empty-state">{hasOdds ? "No priced prop edge cleared the current book numbers." : "Sportsbook prices have not loaded yet. Prop leans remain hidden until a qualifying book price is available."}</div>}
  </section>;
}

function PitcherKPricingBoard({ pitcherRows, kMode, onKModeChange, lineOverrides, onLineChange }) {
  if (!pitcherRows.length) return null;
  return <section className="card">
    <div className="card-title">
      <h2>Pitcher strikeout pricing</h2>
      <div className="edge-controls">
        <span className="muted">Manual K lines · fair odds</span>
        <div className="segmented" aria-label="K projection mode">
          <button type="button" className={kMode === "base" ? "active" : ""} onClick={() => onKModeChange("base")}>Base</button>
          <button type="button" className={kMode === "ceiling" ? "active" : ""} onClick={() => onKModeChange("ceiling")}>Ceiling</button>
        </div>
      </div>
    </div>
    <div className="k-section single">
      <div className="k-panel">
        <div className="k-grid">
          {pitcherRows.map((row) => {
            const lineValue = lineOverrides[row.key] ?? lineInputValue(row.line);
            return <article className="k-card" key={row.key}>
              <div className="k-card-head">
                <strong>{row.player || "Starter"}</strong>
                <span className="pill">{kMode === "base" ? "Base" : "Ceiling"} {score(row.projected)} K</span>
              </div>
              <label className="line-control">
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
              <div className="mini-stats">
                <span>Over fair <b>{price(row.fair)}</b></span>
                <span>Under fair <b>{price(row.underFair)}</b></span>
              </div>
              {row.hasBook ? <span className="fair-note">Book {row.line}: {pairedBookMeta("O", row.overBook)} / {pairedBookMeta("U", row.underBook)}</span> : <span className="fair-note">Fair only unless a matching pregame K line is returned.</span>}
            </article>;
          })}
        </div>
      </div>
    </div>
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
              <strong>{target.batter || "Batter"} over {target.line ?? 0.5} K</strong>
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

function ResultsPerformance({ rows }) {
  if (!rows.length) return null;
  const metrics = summarizeResults(rows);
  return <section className="card">
    <div className="card-title"><h2>Results snapshot</h2><span className="muted">Official finals · records forward-facing</span></div>
    <div className="performance-grid">
      {metrics.map((metric) => <article className="performance-card" key={metric.label}>
        <span>{metric.label}</span>
        <strong>{metric.value}</strong>
      </article>)}
    </div>
    <details className="results-details">
      <summary>Game-by-game results ({rows.length})</summary>
      <div className="results-list">
        {rows.map((row) => <article className="result-row" key={row.id}>
          <div>
            <strong>{row.matchup}</strong>
            <span>{row.winnerResult} · Pick {row.pickTeam} · Final winner {row.actualWinner}</span>
          </div>
          <span>Projected<br />{row.projected}</span>
          <span>Final<br />{row.final}</span>
          <span>Total grade<br />{row.totalResult}{row.totalPick ? ` · ${row.totalPick} ${row.totalLine}` : ""}</span>
          <span>Total Δ<br />{signedRun(row.totalDelta)}</span>
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

function designationForOdds(fair, book) {
  if (!Number.isFinite(Number(fair)) || !validBookPrice(book)) {
    return { label: "Watch price", tone: "watch", detail: "No pregame book price yet." };
  }
  const edge = Number(book) - Number(fair);
  if (edge >= 25) return { label: "Strong bet", tone: "strong", detail: `${Math.round(edge)} cents better than fair.` };
  if (edge >= 10) return { label: "Bet", tone: "bet", detail: `${Math.round(edge)} cents better than fair.` };
  if (edge > 0) return { label: "Lean", tone: "lean", detail: `${Math.round(edge)} cents better than fair; thinner margin.` };
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

function setBestTeamPrice(store, side, candidate) {
  if (!side) return;
  if (quoteIsBetter(candidate, store[side])) store[side] = candidate;
}

function findOddsForGame(items, game) {
  return Array.isArray(items) ? items.find((item) => normal(item.away_team) === normal(game.away_name) && normal(item.home_team) === normal(game.home_name)) : null;
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

function lineLean(fairLine, liveLine, overRow, underRow) {
  const fair = Number(fairLine);
  const live = Number(liveLine);
  const overPrice = overRow?.price;
  const underPrice = underRow?.price;
  if (!Number.isFinite(fair) || !Number.isFinite(live)) return { label: "Waiting", tone: "watch", detail: "No pregame line loaded." };
  const diff = fair - live;
  if (diff >= 0.65 && validBookPrice(overPrice)) return { label: "Strong bet", tone: "strong", detail: `Over lean: fair ${fair.toFixed(1)} vs line ${live.toFixed(1)} at ${price(overPrice)} from ${overRow?.book || "Sportsbook"}.` };
  if (diff <= -0.65 && validBookPrice(underPrice)) return { label: "Strong bet", tone: "strong", detail: `Under lean: fair ${fair.toFixed(1)} vs line ${live.toFixed(1)} at ${price(underPrice)} from ${underRow?.book || "Sportsbook"}.` };
  if (diff >= 0.45 && validBookPrice(overPrice)) return { label: "Bet", tone: "bet", detail: `Over lean: fair ${fair.toFixed(1)} vs line ${live.toFixed(1)} at ${price(overPrice)} from ${overRow?.book || "Sportsbook"}.` };
  if (diff <= -0.45 && validBookPrice(underPrice)) return { label: "Bet", tone: "bet", detail: `Under lean: fair ${fair.toFixed(1)} vs line ${live.toFixed(1)} at ${price(underPrice)} from ${underRow?.book || "Sportsbook"}.` };
  if (Math.abs(diff) >= 0.25 && validBookPrice(diff > 0 ? overPrice : underPrice)) {
    const row = diff > 0 ? overRow : underRow;
    return { label: "Lean", tone: "lean", detail: `${diff > 0 ? "Over" : "Under"} is thin: fair ${fair.toFixed(1)} vs line ${live.toFixed(1)} at ${price(row?.price)} from ${row?.book || "Sportsbook"}.` };
  }
  if (Math.abs(diff) >= 0.25) return { label: "Watch price", tone: "watch", detail: `${diff > 0 ? "Over" : "Under"} lean, but no valid pregame price is loaded.` };
  return { label: "No edge", tone: "pass", detail: `Fair ${fair.toFixed(1)} is close to pregame ${live.toFixed(1)}.` };
}

function CustomerBoard() {
  const games = BOARD.games || [];
  const [night, setNight] = useState(false);
  const [gameIndex, setGameIndex] = useState(() => defaultGameIndex(games));
  const [kMode, setKMode] = useState("base");
  const [kLineOverrides, setKLineOverrides] = useState({});
  const [resultRows, setResultRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [odds, setOdds] = useState(blankOdds);
  const game = games[gameIndex] || games[0] || null;
  const hasHostedProxy = typeof window !== "undefined" && !["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);
  const canUseLocalKey = !hasHostedProxy && !!PRELOADED_ODDS_API_KEY;

  useEffect(() => {
    let cancelled = false;
    const slateDate = BOARD.date;
    async function refreshResults() {
      if (!slateDate || !games.length) return;
      try {
        const directUrl = `https://statsapi.mlb.com/api/v1/schedule?sportId=1&date=${encodeURIComponent(slateDate)}`;
        const scheduleUrls = hasHostedProxy ? [`/api/mlb/schedule?date=${encodeURIComponent(slateDate)}`, directUrl] : [directUrl];
        let payload = null;
        for (const scheduleUrl of scheduleUrls) {
          try {
            payload = await fetchJsonWithTimeout(scheduleUrl);
            if (payload) break;
          } catch {
            payload = null;
          }
        }
        if (!payload) return;
        const statsGames = payload?.dates?.flatMap((date) => date.games || []) || [];
        const graded = gradeCompletedGames(games, statsGames);
        if (!cancelled) setResultRows(graded);
      } catch {
        if (!cancelled) setResultRows([]);
      }
    }
    refreshResults();
    const timer = window.setInterval(refreshResults, 5 * 60 * 1000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [games, hasHostedProxy]);

  const teamTotals = useMemo(() => {
    if (!game) return [];
    return odds.teamTotals.filter((row) => row.away === game.away && row.home === game.home);
  }, [game, odds.teamTotals]);

  async function refreshOdds() {
    if (!game) return;
    if (!isPregameGame(game)) {
      setOdds(blankOdds());
      setMessage("Pregame odds only. This game is no longer in a pregame state, so book prices are not pulled.");
      return;
    }
    setLoading(true);
    setMessage("Fetching pregame sportsbook lines…");
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
      if (!eventsResponse.ok) throw new Error(`Pregame odds events request returned HTTP ${eventsResponse.status}`);
      const events = await eventsResponse.json();
      const event = findOddsForGame(events, game);
      if (!event) {
        setOdds(blankOdds());
        setMessage("No current sportsbook event matched this game.");
        return;
      }
      const nextK = {};
      const nextBatter = {};
      const nextTotals = [];
      const nextH2h = {};
      const nextF5H2h = {};
      const nextGameTotals = [];
      const nextF5Totals = [];
      const warnings = new Set();

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
        return fallbackOdds.find((item) => normal(item.away_team) === normal(game.away_name) && normal(item.home_team) === normal(game.home_name)) || null;
      };

      const parseStandardOdds = (eventOdds) => {
        if (!eventOdds) return;
        for (const bookmaker of eventOdds.bookmakers || []) {
          for (const market of bookmaker.markets || []) {
            if (market.key === "h2h" || market.key === "h2h_1st_5_innings") {
              const store = market.key === "h2h" ? nextH2h : nextF5H2h;
              for (const outcome of market.outcomes || []) {
                const side = teamSideFromText(outcome.name, game);
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
      };

      const parseBatterOdds = (propOdds) => {
        if (!propOdds) return;
        for (const bookmaker of propOdds.bookmakers || []) {
          for (const market of bookmaker.markets || []) {
            const label = propMarketLabel(market.key);
            if (!["Batter HR", "Batter hits", "Batter TB"].includes(label)) continue;
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

      const propOdds = await fetchOddsPayload("batter_home_runs,batter_hits,batter_total_bases");
      if (propOdds) parseBatterOdds(propOdds);
      else if (!warnings.has("sportsbook odds key rejected")) warnings.add("batter prop prices unavailable");

      setOdds({ k: nextK, pitcherK: nextK, batter: nextBatter, teamTotals: nextTotals, h2h: nextH2h, totals: nextGameTotals, f5H2h: nextF5H2h, f5Totals: nextF5Totals });
      const warningList = [...warnings];
      setMessage(`Pregame odds updated. A price must clear the displayed play-to number before any consideration.${warningList.length ? ` ${warningList.includes("sportsbook odds key rejected") ? "The sportsbook odds endpoint is rejecting the configured API key, so pregame book prices are not available yet." : `Some markets are not returned by the sportsbook feed: ${warningList.join(", ")}.`}` : ""}`);
    } catch (error) {
      setOdds(blankOdds());
      setMessage(error instanceof Error ? error.message : "Pregame odds are unavailable right now.");
    } finally {
      setLoading(false);
    }
  }

  if (!CUSTOMER_FACING) return null;
  if (!game) return <main className="app"><div className="shell"><div className="card info">No customer board is available for this slate.</div></div></main>;
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
  const marketCards = [
    {
      group: "Full game",
      title: `${game.away} moneyline`,
      main: price(moneylineFairs.away_fair),
      meta: [`Fair probability ${probabilityText(moneylineFairs.away_probability)}`, bookMeta(selectedH2h.away)],
      designation: designationForOdds(moneylineFairs.away_fair, selectedH2h.away?.price),
    },
    {
      group: "Full game",
      title: `${game.home} moneyline`,
      main: price(moneylineFairs.home_fair),
      meta: [`Fair probability ${probabilityText(moneylineFairs.home_probability)}`, bookMeta(selectedH2h.home)],
      designation: designationForOdds(moneylineFairs.home_fair, selectedH2h.home?.price),
    },
    {
      group: "Full game",
      title: "Full-game total",
      main: score(game.total),
      meta: [`Fair total`, `Line ${fullTotalPoint ?? "—"}`, marketLineMeta("Over", fullTotalPoint, fullOver), marketLineMeta("Under", fullTotalPoint, fullUnder)],
      designation: lineLean(game.total, fullTotalPoint, fullOver, fullUnder),
    },
    {
      group: "First five",
      title: "F5 total",
      main: score(f5.total),
      meta: [`Fair F5`, `Line ${f5TotalPoint ?? "—"}`, marketLineMeta("Over", f5TotalPoint, f5Over), marketLineMeta("Under", f5TotalPoint, f5Under)],
      designation: lineLean(f5.total, f5TotalPoint, f5Over, f5Under),
    },
    {
      group: "First five",
      title: `${game.away} F5 ML`,
      main: price(f5.away_fair ?? americanFromProbability(f5HomeProb == null ? null : 1 - f5HomeProb)),
      meta: [`Fair probability ${probabilityText(f5HomeProb == null ? null : 1 - f5HomeProb)}`, bookMeta(odds.f5H2h.away)],
      designation: designationForOdds(f5.away_fair ?? americanFromProbability(f5HomeProb == null ? null : 1 - f5HomeProb), odds.f5H2h.away?.price),
    },
    {
      group: "First five",
      title: `${game.home} F5 ML`,
      main: price(f5.home_fair ?? americanFromProbability(f5HomeProb)),
      meta: [`Fair probability ${probabilityText(f5HomeProb)}`, bookMeta(odds.f5H2h.home)],
      designation: designationForOdds(f5.home_fair ?? americanFromProbability(f5HomeProb), odds.f5H2h.home?.price),
    },
    {
      group: "Team totals",
      title: `${game.away} team total`,
      main: score(game.team_total_fairs?.away ?? game.away_score),
      meta: [`Fair runs`, marketLineMeta("Over", awayTTRows.over?.line ?? awayTTRows.under?.line, awayTTRows.over), marketLineMeta("Under", awayTTRows.under?.line ?? awayTTRows.over?.line, awayTTRows.under)],
      designation: lineLean(game.team_total_fairs?.away ?? game.away_score, awayTTRows.over?.line ?? awayTTRows.under?.line, awayTTRows.over, awayTTRows.under),
    },
    {
      group: "Team totals",
      title: `${game.home} team total`,
      main: score(game.team_total_fairs?.home ?? game.home_score),
      meta: [`Fair runs`, marketLineMeta("Over", homeTTRows.over?.line ?? homeTTRows.under?.line, homeTTRows.over), marketLineMeta("Under", homeTTRows.under?.line ?? homeTTRows.over?.line, homeTTRows.under)],
      designation: lineLean(game.team_total_fairs?.home ?? game.home_score, homeTTRows.over?.line ?? homeTTRows.under?.line, homeTTRows.over, homeTTRows.under),
    },
  ];
  const hasAnyOdds = Boolean(
    Object.keys(odds.h2h || {}).length
    || Object.keys(odds.f5H2h || {}).length
    || (odds.totals || []).length
    || (odds.f5Totals || []).length
    || (odds.teamTotals || []).length
    || Object.keys(odds.k || {}).length
    || Object.keys(odds.batter || {}).length
  );
  const pitcherKFairRows = (game.prop_angles || []).map((angle, index) => {
    const key = `${normal(angle.player) || "starter"}-${index}`;
    const manualValue = kLineOverrides[key];
    const manualLine = manualValue === "" || manualValue == null ? null : Number(manualValue);
    const hasManualLine = Number.isFinite(manualLine);
    const fallbackBook = !hasManualLine ? findPitcherKBook(odds.pitcherK, angle.player, angle.line) : null;
    const displayLine = hasManualLine ? manualLine : (fallbackBook?.line ?? angle.line);
    const exactBook = exactPitcherKBook(odds.pitcherK, angle.player, displayLine);
    const book = exactBook || (!hasManualLine ? fallbackBook : null);
    const projected = kMode === "base" && angle.base_projected != null ? angle.base_projected : (angle.ceiling_projected ?? angle.projected);
    const recalculated = fairFromProjection(projected, displayLine);
    const fair = recalculated.over ?? (kMode === "base" && angle.base_fair != null ? angle.base_fair : angle.fair);
    const underFair = recalculated.under ?? (kMode === "base" && angle.base_under_fair != null ? angle.base_under_fair : angle.under_fair);
    const overBook = book?.over ?? odds.k[quoteKey(angle.player, "Over", displayLine)];
    const underBook = book?.under ?? odds.k[quoteKey(angle.player, "Under", displayLine)];
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
  const kTargetRows = [...(game.k_targets || [])]
    .filter((target) => target?.batter && Number.isFinite(Number(target.fair)))
    .sort((a, b) => Number(b.probability || 0) - Number(a.probability || 0));
  const pricedPitcherRows = pitcherKFairRows.flatMap((row) => {
    const overBook = row.overBook;
    const underBook = row.underBook;
    if (!validBookPrice(overBook?.price) && !validBookPrice(underBook?.price)) return [];
    const anchoredOverFair = blendPropFairWithBook(row.fair, overBook?.price);
    const anchoredUnderFair = blendPropFairWithBook(row.underFair, underBook?.price);
    const overEdge = edgeCents(anchoredOverFair, overBook?.price);
    const underEdge = edgeCents(anchoredUnderFair, underBook?.price);
    const side = (underEdge ?? -Infinity) > (overEdge ?? -Infinity) ? "Under" : "Over";
    const sideFair = side === "Under" ? anchoredUnderFair : anchoredOverFair;
    const sideBook = side === "Under" ? underBook : overBook;
    const designation = designationForOdds(sideFair, sideBook?.price);
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
      edge: edgeCents(sideFair, sideBook?.price) ?? -999,
      explainer: row.explainer,
    }];
  }).sort((a, b) => b.edge - a.edge);

  const pricedBatterRows = limitRowsPerTeam([
    ...(game.batter_prop_angles || []).map((angle, index) => {
      const live = odds.batter[propQuoteKey(angle.market, angle.player, angle.side || "Over", angle.line)];
      if (!validBookPrice(live?.price)) return null;
      const fair = blendPropFairWithBook(angle.fair, live.price);
      const designation = designationForOdds(fair, live.price);
      return {
        kind: "batterProp",
        key: `${angle.player}-${angle.market}-${index}`,
        team: angle.team,
        title: `${angle.player || "Hitter"} ${propMarketText(angle.market)} ${angle.side || "Over"} ${angle.line ?? "—"}`,
        subtitle: `${angle.team || "—"} vs ${angle.pitcher || "starter"} · ${angle.pitch_name || angle.pitch_type || "Pitch"} ${angle.usage ?? "—"}%`,
        fair,
        playTo: playToFromFair(fair) ?? angle.play_to,
        book: live,
        designation,
        edge: edgeCents(fair, live.price) ?? -999,
        metrics: angle.metrics,
        explainer: angle.explainer,
      };
    }),
  ].filter(Boolean).sort((a, b) => b.edge - a.edge), 3);
  const pricedEdges = [
    ...pricedPitcherRows.filter((row) => ["lean", "bet", "strong"].includes(row.designation.tone)).map((row) => ({
      title: row.title,
      subtitle: row.subtitle,
      fair: row.sideFair,
      book: row.sideBook?.price,
      bookName: row.sideBook?.book,
      label: row.designation.label,
      edge: row.edge,
    })),
    ...pricedBatterRows.filter((row) => ["lean", "bet", "strong"].includes(row.designation.tone)).map((row) => ({
      title: row.title,
      subtitle: row.subtitle,
      fair: row.fair,
      book: row.book?.price,
      bookName: row.book?.book,
      label: row.designation.label,
      edge: row.edge,
    })),
  ].sort((a, b) => (b.edge || 0) - (a.edge || 0));

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
          <button type="button" className="refresh" onClick={refreshOdds} disabled={loading}>{loading ? "Refreshing…" : "Refresh pregame odds"}</button>
        </div>
      </header>

      <div className="shell">
        <Scoreboard games={games} gameIndex={gameIndex} onSelect={(index) => { setGameIndex(index); setOdds(blankOdds()); setKLineOverrides({}); setMessage(""); }} />

        <ResultsPerformance rows={resultRows} />

        <section className="selected-summary">
          <div className="selected-main">
            <div>
              <h2>{game.away} @ {game.home}</h2>
              <p className="muted">{game.away_starter || "TBD"} vs {game.home_starter || "TBD"} · {game.time || game.status || "—"}</p>
            </div>
            <div className="selected-score">{game.away} {score(game.away_score)} · {score(game.home_score)} {game.home}</div>
          </div>
        </section>

        <PricedEdgeBoard
          edges={pricedEdges}
          hasOdds={hasAnyOdds}
        />

        <PitcherKPricingBoard
          pitcherRows={pitcherKFairRows}
          kMode={kMode}
          onKModeChange={setKMode}
          lineOverrides={kLineOverrides}
          onLineChange={(key, value) => setKLineOverrides((current) => ({ ...current, [key]: value }))}
        />

        <BatterKTargetsBoard targets={kTargetRows} />

        <section className="card">
          <div className="card-title"><h2>Fair market board</h2><span className="muted">ML · totals · F5 · team totals</span></div>
          <div className="market-section">
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
          </div>
        </section>

        <ModelFooter games={games} message={message || BOARD.notice} />
      </div>
    </main>
  );
}

export default CustomerBoard;
