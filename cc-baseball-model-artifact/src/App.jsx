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
      "status": "Scheduled",
      "time": "12:05 PM ET",
      "day_night": "day",
      "away_score": 4.8,
      "home_score": 4.6,
      "total": 9.4,
      "home_win_probability": 0.46,
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
          "fair": 113,
          "book": null,
          "play_to": 123,
          "designation": "Watch price",
          "explainer": "Sharp-pitcher K view: uses projected K rate, expected workload, and a modest command/workload bump. This affects K props only, not score or team-total forecasts."
        },
        {
          "player": "Braxton Ashcraft",
          "market": "Pitcher strikeouts",
          "side": "Over",
          "line": 7.5,
          "fair": -140,
          "book": null,
          "play_to": -130,
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
          "fair": 105,
          "book": null,
          "play_to": 115,
          "designation": "Watch price",
          "explainer": "Sharp-pitcher K view: uses projected K rate, expected workload, and a modest command/workload bump. This affects K props only, not score or team-total forecasts."
        },
        {
          "player": "Bubba Chandler",
          "market": "Pitcher strikeouts",
          "side": "Over",
          "line": 4.5,
          "fair": -139,
          "book": null,
          "play_to": -129,
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
          "fair": 117,
          "book": null,
          "play_to": 127,
          "designation": "Watch price",
          "explainer": "Sharp-pitcher K view: uses projected K rate, expected workload, and a modest command/workload bump. This affects K props only, not score or team-total forecasts."
        },
        {
          "player": "Joe Ryan",
          "market": "Pitcher strikeouts",
          "side": "Over",
          "line": 7.5,
          "fair": 102,
          "book": null,
          "play_to": 112,
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
      "status": "Scheduled",
      "time": "2:10 PM ET",
      "day_night": "day",
      "away_score": 4.7,
      "home_score": 4.9,
      "total": 9.6,
      "home_win_probability": 0.54,
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
          "fair": -144,
          "book": null,
          "play_to": -134,
          "designation": "Watch price",
          "explainer": "Sharp-pitcher K view: uses projected K rate, expected workload, and a modest command/workload bump. This affects K props only, not score or team-total forecasts."
        },
        {
          "player": "Bryan Hudson",
          "market": "Pitcher strikeouts",
          "side": "Over",
          "line": 1.5,
          "fair": -129,
          "book": null,
          "play_to": -119,
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
          "fair": -121,
          "book": null,
          "play_to": -111,
          "designation": "Watch price",
          "explainer": "Sharp-pitcher K view: uses projected K rate, expected workload, and a modest command/workload bump. This affects K props only, not score or team-total forecasts."
        },
        {
          "player": "Tyler Mahle",
          "market": "Pitcher strikeouts",
          "side": "Over",
          "line": 5.5,
          "fair": -104,
          "book": null,
          "play_to": -94,
          "designation": "Watch price",
          "explainer": "Sharp-pitcher K view: uses projected K rate, expected workload, and a modest command/workload bump. This affects K props only, not score or team-total forecasts."
        }
      ]
    },
    {
      "id": 822711,
      "away": "NYY",
      "home": "WSH",
      "away_name": "New York Yankees",
      "home_name": "Washington Nationals",
      "away_starter": "Cam Schlittler",
      "home_starter": "Miles Mikolas",
      "status": "Scheduled",
      "time": "4:05 PM ET",
      "day_night": "day",
      "away_score": 4.7,
      "home_score": 4.9,
      "total": 9.6,
      "home_win_probability": 0.54,
      "synthesis": "The board sees a higher-scoring game script. Neither side has a meaningful projected scoring edge.",
      "k_targets": [],
      "prop_angles": [
        {
          "player": "Cam Schlittler",
          "market": "Pitcher strikeouts",
          "side": "Over",
          "line": 8.5,
          "fair": 132,
          "book": null,
          "play_to": 142,
          "designation": "Watch price",
          "explainer": "Sharp-pitcher K view: uses projected K rate, expected workload, and a modest command/workload bump. This affects K props only, not score or team-total forecasts."
        },
        {
          "player": "Miles Mikolas",
          "market": "Pitcher strikeouts",
          "side": "Over",
          "line": 3.5,
          "fair": 121,
          "book": null,
          "play_to": 131,
          "designation": "Watch price",
          "explainer": "Sharp-pitcher K view: uses projected K rate, expected workload, and a modest command/workload bump. This affects K props only, not score or team-total forecasts."
        }
      ]
    },
    {
      "id": 823603,
      "away": "BOS",
      "home": "NYM",
      "away_name": "Boston Red Sox",
      "home_name": "New York Mets",
      "away_starter": null,
      "home_starter": "Freddy Peralta",
      "status": "Scheduled",
      "time": "4:10 PM ET",
      "day_night": "day",
      "away_score": 4.2,
      "home_score": null,
      "total": null,
      "home_win_probability": null,
      "synthesis": "A customer-safe matchup summary will appear when both team forecasts are available.",
      "k_targets": [],
      "prop_angles": [
        {
          "player": "Freddy Peralta",
          "market": "Pitcher strikeouts",
          "side": "Over",
          "line": 5.5,
          "fair": -113,
          "book": null,
          "play_to": -103,
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
          "fair": -114,
          "book": null,
          "play_to": -104,
          "designation": "Watch price",
          "explainer": "Sharp-pitcher K view: uses projected K rate, expected workload, and a modest command/workload bump. This affects K props only, not score or team-total forecasts."
        },
        {
          "player": "Griffin Jax",
          "market": "Pitcher strikeouts",
          "side": "Over",
          "line": 5.5,
          "fair": 109,
          "book": null,
          "play_to": 119,
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
          "fair": 114,
          "book": null,
          "play_to": 124,
          "designation": "Watch price",
          "explainer": "Sharp-pitcher K view: uses projected K rate, expected workload, and a modest command/workload bump. This affects K props only, not score or team-total forecasts."
        },
        {
          "player": "Eury Pérez",
          "market": "Pitcher strikeouts",
          "side": "Over",
          "line": 6.5,
          "fair": -153,
          "book": null,
          "play_to": -143,
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
          "fair": 130,
          "book": null,
          "play_to": 140,
          "designation": "Watch price",
          "explainer": "Sharp-pitcher K view: uses projected K rate, expected workload, and a modest command/workload bump. This affects K props only, not score or team-total forecasts."
        },
        {
          "player": "Casey Mize",
          "market": "Pitcher strikeouts",
          "side": "Over",
          "line": 6.5,
          "fair": -126,
          "book": null,
          "play_to": -116,
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
          "fair": 119,
          "book": null,
          "play_to": 129,
          "designation": "Watch price",
          "explainer": "Sharp-pitcher K view: uses projected K rate, expected workload, and a modest command/workload bump. This affects K props only, not score or team-total forecasts."
        },
        {
          "player": "Kyle Bradish",
          "market": "Pitcher strikeouts",
          "side": "Over",
          "line": 6.5,
          "fair": 118,
          "book": null,
          "play_to": 128,
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
          "fair": 135,
          "book": null,
          "play_to": 145,
          "designation": "Watch price",
          "explainer": "Sharp-pitcher K view: uses projected K rate, expected workload, and a modest command/workload bump. This affects K props only, not score or team-total forecasts."
        },
        {
          "player": "Kumar Rocker",
          "market": "Pitcher strikeouts",
          "side": "Over",
          "line": 4.5,
          "fair": -135,
          "book": null,
          "play_to": -125,
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
          "fair": -154,
          "book": null,
          "play_to": -144,
          "designation": "Watch price",
          "explainer": "Sharp-pitcher K view: uses projected K rate, expected workload, and a modest command/workload bump. This affects K props only, not score or team-total forecasts."
        },
        {
          "player": "Nick Lodolo",
          "market": "Pitcher strikeouts",
          "side": "Over",
          "line": 4.5,
          "fair": -117,
          "book": null,
          "play_to": -107,
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
      "synthesis": "The board sees a balanced run environment. Neither side has a meaningful projected scoring edge.",
      "k_targets": [],
      "prop_angles": [
        {
          "player": "Reynaldo López",
          "market": "Pitcher strikeouts",
          "side": "Over",
          "line": 4.5,
          "fair": -110,
          "book": null,
          "play_to": -100,
          "designation": "Watch price",
          "explainer": "Sharp-pitcher K view: uses projected K rate, expected workload, and a modest command/workload bump. This affects K props only, not score or team-total forecasts."
        },
        {
          "player": "Matthew Liberatore",
          "market": "Pitcher strikeouts",
          "side": "Over",
          "line": 5.5,
          "fair": 150,
          "book": null,
          "play_to": 160,
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
          "fair": 131,
          "book": null,
          "play_to": 141,
          "designation": "Watch price",
          "explainer": "Sharp-pitcher K view: uses projected K rate, expected workload, and a modest command/workload bump. This affects K props only, not score or team-total forecasts."
        },
        {
          "player": "Walker Buehler",
          "market": "Pitcher strikeouts",
          "side": "Over",
          "line": 5.5,
          "fair": 146,
          "book": null,
          "play_to": 156,
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
          "fair": -155,
          "book": null,
          "play_to": -145,
          "designation": "Watch price",
          "explainer": "Sharp-pitcher K view: uses projected K rate, expected workload, and a modest command/workload bump. This affects K props only, not score or team-total forecasts."
        },
        {
          "player": "Yoshinobu Yamamoto",
          "market": "Pitcher strikeouts",
          "side": "Over",
          "line": 7.5,
          "fair": -124,
          "book": null,
          "play_to": -114,
          "designation": "Watch price",
          "explainer": "Sharp-pitcher K view: uses projected K rate, expected workload, and a modest command/workload bump. This affects K props only, not score or team-total forecasts."
        }
      ]
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
  .info { padding: 13px 15px; color: #66788e; font-size: 13px; }
  .night .info { color: #a1b2c6; }
  @media (max-width: 640px) { .topbar { align-items: flex-start; flex-direction: column; padding: 12px 14px; } .top-actions { width: 100%; } .mode, .refresh { flex: 1; } .shell { padding: 12px; } .score-grid { grid-template-columns: 1fr 1fr; } .score:last-child { grid-column: span 2; } .table { font-size: 12px; } .table th, .table td { padding: 9px 8px; } }
`;

function normal(value) {
  return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function price(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return "—";
  return numeric > 0 ? `+${numeric}` : String(numeric);
}

function score(value) {
  return Number.isFinite(Number(value)) ? Number(value).toFixed(1) : "—";
}

function quoteIsBetter(candidate, current) {
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
  if (!Number.isFinite(Number(fair)) || !Number.isFinite(Number(book))) {
    return { label: "Watch price", tone: "watch", detail: "No live book price yet." };
  }
  const edge = Number(book) - Number(fair);
  if (edge >= 25) return { label: "Strong bet", tone: "strong", detail: `${Math.round(edge)} cents better than fair.` };
  if (edge >= 10) return { label: "Bet", tone: "bet", detail: `${Math.round(edge)} cents better than fair.` };
  if (edge > 0) return { label: "Small edge", tone: "small", detail: `${Math.round(edge)} cents better than fair; thinner margin.` };
  return { label: "No edge", tone: "pass", detail: "Book price has not cleared fair." };
}

function CustomerBoard() {
  const [night, setNight] = useState(false);
  const [gameIndex, setGameIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [odds, setOdds] = useState({ k: {}, teamTotals: [] });
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
        markets: "team_totals,pitcher_strikeouts",
      });
      const response = await fetch(oddsUrl(`sports/baseball_mlb/events/${event.id}/odds`, params));
      if (!response.ok) throw new Error(`Live odds request returned HTTP ${response.status}`);
      const eventOdds = await response.json();
      const nextK = {};
      const nextTotals = [];
      for (const bookmaker of eventOdds.bookmakers || []) {
        for (const market of bookmaker.markets || []) {
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
      setOdds({ k: nextK, teamTotals: nextTotals });
      setMessage("Live odds updated. A price must clear the displayed play-to number before any consideration.");
    } catch (error) {
      setOdds({ k: {}, teamTotals: [] });
      setMessage(error instanceof Error ? error.message : "Live odds are unavailable right now.");
    } finally {
      setLoading(false);
    }
  }

  if (!CUSTOMER_FACING) return null;
  if (!game) return <main className="app"><div className="shell"><div className="card info">No customer board is available for this slate.</div></div></main>;
  const favorite = favoriteForGame(game);

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
            {games.map((item, index) => <button className={`game ${index === gameIndex ? "active" : ""}`} type="button" key={`${item.id || index}-${item.away}-${item.home}`} onClick={() => { setGameIndex(index); setOdds({ k: {}, teamTotals: [] }); setMessage(""); }}>
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
          <div className="card-title"><h2>Matchup synthesis</h2><span className="muted">Published outlook</span></div>
          <div className="copy"><p>{game.synthesis}</p><div className="notice">Customer forecasts are informational. Lineups, weather, and starting-pitcher changes can move a game before first pitch.</div></div>
        </section>

        <section className="card">
          <div className="card-title"><h2>Prop angles</h2><span className="muted">Fair / book / play-to</span></div>
          <div className="angle-list">
            {(game.prop_angles || []).length ? game.prop_angles.map((angle, index) => {
              const live = odds.k[quoteKey(angle.player, angle.side, angle.line)];
              const bookPrice = live?.price ?? angle.book;
              const designation = designationForOdds(angle.fair, bookPrice);
              return <article className="angle" key={`${angle.player}-${angle.line}-${index}`}>
                <div className="angle-top"><div><h3>{angle.player || "Starter"} {angle.side} {angle.line ?? "—"} {angle.market}</h3><p className="muted">{angle.explainer}</p></div><span className={`pill ${designation.tone}`}>{designation.label}</span></div>
                <div className="prices"><span>Fair <b>{price(angle.fair)}</b></span><span>Book <b>{price(bookPrice)}</b>{live?.book ? ` · ${live.book}` : ""}</span><span>Play-to <b>{price(angle.play_to)}</b></span></div>
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

        <section className="card">
          <div className="card-title"><h2>Team totals</h2><span className="muted">Odds API · team_totals only</span></div>
          {teamTotals.length ? <table className="table"><thead><tr><th>Team</th><th>Side</th><th>Line</th><th>Book</th></tr></thead><tbody>{teamTotals.map((row, index) => <tr key={`${row.team}-${row.side}-${row.line}-${index}`}><td>{row.team || "—"}</td><td>{row.side || "—"}</td><td>{row.line ?? "—"} · {price(row.price)}</td><td>{row.book}</td></tr>)}</tbody></table> : <div className="info">Team totals load only from the Odds API <code>team_totals</code> market. Refresh live odds; if the book has none, this section remains empty.</div>}
        </section>

        <div className="info">{message || BOARD.notice}</div>
      </div>
    </main>
  );
}

export default CustomerBoard;
