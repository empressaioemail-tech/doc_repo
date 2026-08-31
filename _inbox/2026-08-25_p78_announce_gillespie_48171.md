---
title: P-78 announce — Gillespie 48171 stratmap-landuse leftover (Texas fill #17)
date: 2026-08-25
status: filed
plan_row: P-78
packet: _inbox/2026-08-25_p78_announce_gillespie_48171_packet.json
---

# Announce: Gillespie 48171 stratmap-landuse leftover

| Field | Value |
| --- | --- |
| FIPS | **48171** Gillespie |
| Path | **B** (leftover year 2025 n=0 before apply; greenfield insert @ 2025) |
| Declared store year | **2026 absent** (n=0; registry L17 null — no flip) |
| Inspect read set | **No** — leftover 2025; registry `current_tax_year` / `current_tier` null; no live roll year on store |
| CAD REST | arcgis_rest present. Leftover still uses StratMap zip. Not a CAMA load. |
| Source | TxGIO StratMap zip `stratmap25-landparcels_48171_lp.zip` |
| DBF in zip | `stratmap25-landparcels_48171_gillespie_202503.dbf` (year **202503**; confirmed by `--dry-run --limit=1` extract, 0 upserted) |
| Structured vintage | `tier:stratmap-roll;adapter:stratmap;drop:stratmap25-landparcels_48171_lp` |
| Writer SHA | **`46e1a5a1`** (`git rev-parse HEAD` on `P:/tmp/ldt-p78-bastrop`) |
| Dest | cortex-prod `cad_property` via `CORTEX_DATABASE_URL` |
| Gate | Packet PASS `derivedPath=B` leftoverN=0 before apply |

## Scope locks

- **Leftover only.** Not CAMA. Not P-80. Not Dallas/Tarrant/Guadalupe.
- **One county only:** 48171
- **No** `--allow-stratmap-fallback`
- **No** rewrite of 48055 / 48021 / 48209 / 48491 / 48453 / 48013 / 48019 / 48029 / 48031 / 48053 / 48085 / 48091 / 48121 / 48139 / 48149 / 48163
- **No** L17 or registry flip (`tx-48171` L17 is null)
- **No** atoms `--apply` / rematerialize / P-25 CAMA
- Gold `48021:34137` living area HOLD. `48453:280238` stays lookup-failed.

Dest identity live PASS before write (`_inbox/2026-08-25_p78_gillespie_48171_dest_identity.json`): Caldwell 24989, Bastrop 77799, Hays 172116, Williamson 282570, Travis 380918, Atascosa 34649, Bandera 32755, Bexar 703258, Blanco 13648, Burnet 49243, Collin 387334, Comal 103207, Denton 351798, Ellis 98150, Fayette 22432, Frio 12489 @ 2025.

Prop_ID literal `"0"` counted separately — not leftover success.

Inspect probe will be skipped: L17 undeclared, leftover 2025 is not a declared store live-roll year.
