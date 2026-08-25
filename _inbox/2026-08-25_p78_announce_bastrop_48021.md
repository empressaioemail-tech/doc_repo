---
title: P-78 announce — Bastrop 48021 stratmap-landuse leftover (Texas fill #2)
date: 2026-08-25
status: filed
plan_row: P-78
packet: _inbox/2026-08-25_p78_announce_bastrop_48021_packet.json
---

# Announce: Bastrop 48021 stratmap-landuse leftover

| Field | Value |
| --- | --- |
| FIPS | **48021** Bastrop |
| Path | **A** (leftover year 2025 n=77073; in-place merge) |
| Declared L17 | **2025 / cad-export** (no flip) |
| Inspect read set | **Yes** — leftover year matches declared vintage |
| Source | TxGIO StratMap 202503 zip (network fetch; no local `--file`) |
| Structured vintage | `tier:stratmap-roll;adapter:stratmap;drop:stratmap25-landparcels_48021_lp` |
| LDT SHA | `46e1a5a1` (origin/main) |
| Dest | cortex-prod `cad_property` via `CORTEX_DATABASE_URL` |
| CLI | `pnpm --filter @workspace/cad-ingest stratmap-landuse -- --county=48021 --vintage=<structured>` |
| Gate | `_inbox/2026-08-25_p78_announce_bastrop_48021_packet.json` PASS |
| Fields targeted | `year_built`, `land_acres` from StratMap DBF (P-78 COALESCE merge) |

## Scope locks

- **One county only:** 48021
- **No** `--allow-stratmap-fallback`
- **No** 48113 / 48439 / second FIPS
- **No** L17 flip
- **No** atoms `--apply` / rematerialize / P-25 CAMA

Prop_ID literal `"0"` rows counted separately — not leftover success.
