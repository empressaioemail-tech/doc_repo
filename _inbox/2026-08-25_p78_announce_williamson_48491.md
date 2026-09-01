---
title: P-78 announce — Williamson 48491 stratmap-landuse leftover (Texas fill #4)
date: 2026-08-25
status: announced-before-write
plan_row: P-78
packet: _inbox/2026-08-25_p78_announce_williamson_48491_packet.json
---

# Announce: Williamson 48491 stratmap-landuse leftover

| Field | Value |
| --- | --- |
| FIPS | **48491** Williamson |
| Path | **B** — leftover year 2025 n=0; insert new 2025 keys (declared 2026 already present) |
| Declared L17 | **2026 / cad-export** (no flip) |
| Inspect read set | **No** — leftover 2025 ≠ declared 2026 |
| Source | TxGIO StratMap zip (network fetch) |
| Structured vintage | `tier:stratmap-roll;adapter:stratmap;drop:stratmap25-landparcels_48491_lp` |
| Writer SHA | **`46e1a5a1`** (`git rev-parse HEAD` on apply worktree = `46e1a5a1b52a14953e9eb242fd1c908ea24b13ce`) |
| Worktree | `P:/tmp/ldt-p78-bastrop` detached @ `46e1a5a1` |
| Dest | cortex-prod `cad_property` via `CORTEX_DATABASE_URL` |
| Gate | `_inbox/2026-08-25_p78_announce_williamson_48491_packet.json` PASS (Path B, leftoverN=0) |

## Before census (all years)

| tax_year | n | year_built | land_acres |
| --- | --- | --- | --- |
| 2025 (leftover) | 0 | 0 | 0 |
| 2026 (L17) | 319480 | 245450 | 100813 |

prop_id literal `0` all years = 0. Dest identity 2025 still Caldwell 24989 / Bastrop 77799 / Hays 172116.

## Scope locks

- **One county only:** 48491
- **No** `--allow-stratmap-fallback`
- **No** 48021 / 48055 / 48209 rewrite / 48113 / 48439 / 48453
- **No** L17 flip
- **No** atoms `--apply` / rematerialize / P-25 CAMA
- **No** gold 48021:34137 living area restore

Prop_ID literal `"0"` counted separately — not leftover success.

Inspect probe skipped unless leftover year equals declared L17. It does not.
