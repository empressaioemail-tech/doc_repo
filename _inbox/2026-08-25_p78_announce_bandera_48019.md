---
title: P-78 announce — Bandera 48019 stratmap-landuse leftover (Texas fill #7)
date: 2026-08-25
status: filed
plan_row: P-78
packet: _inbox/2026-08-25_p78_announce_bandera_48019_packet.json
---

# Announce: Bandera 48019 stratmap-landuse leftover

| Field | Value |
| --- | --- |
| FIPS | **48019** Bandera |
| Path | **B** (leftover year 2025 n=0 before apply; greenfield insert @ 2025) |
| Declared store year | **2026 absent** (n=0; registry L17 null — no flip) |
| Inspect read set | **No** — leftover 2025; registry `current_tax_year` / `current_tier` null; no live roll year on store |
| Source | TxGIO StratMap zip (network fetch; drop name confirmed at apply) |
| Structured vintage | `tier:stratmap-roll;adapter:stratmap;drop:stratmap25-landparcels_48019_lp` |
| Writer SHA | **`46e1a5a1`** (`git rev-parse HEAD` on `P:/tmp/ldt-p78-bastrop`) |
| Dest | cortex-prod `cad_property` via `CORTEX_DATABASE_URL` |
| Gate | Packet must PASS before apply |

## Scope locks

- **Leftover only.** Not CAMA. Not P-80. Not Dallas/Tarrant/Bexar/Blanco.
- **One county only:** 48019
- **No** `--allow-stratmap-fallback`
- **No** rewrite of 48055 / 48021 / 48209 / 48491 / 48453 / 48013
- **No** L17 or registry flip (`tx-48019` L17 is null)
- **No** atoms `--apply` / rematerialize / P-25 CAMA
- Gold `48021:34137` living area HOLD. `48453:280238` stays lookup-failed.

Queue verified before write (`_inbox/2026-08-25_leftover_queue.md`): Caldwell 24989, Bastrop 77799, Hays 172116, Williamson 282570, Travis 380918, Atascosa 34649 @ 2025.

Prop_ID literal `"0"` counted separately — not leftover success.

## After measure (filed post-apply)

Greenfield before apply. Leftover @ 2025: **0 / 0 / 0** → **32755 / 0 / 32755** (n / year_built / land_acres). Declared 2026 still absent on store. Path B insert. 32755 upserted. prop_id zero @ 2025 = 1. DBF in zip: `stratmap25-landparcels_48019_bandera_202503`. Registry L17 not flipped. Close: `_inbox/2026-08-25_p78_bandera_48019_leftover_close.json`.
