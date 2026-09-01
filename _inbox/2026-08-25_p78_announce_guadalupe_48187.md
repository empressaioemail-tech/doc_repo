---
title: P-78 announce — Guadalupe 48187 stratmap-landuse leftover (Texas fill #18)
date: 2026-08-25
status: filed
plan_row: P-78
packet: _inbox/2026-08-25_p78_announce_guadalupe_48187_packet.json
---

# Announce: Guadalupe 48187 stratmap-landuse leftover

| Field | Value |
| --- | --- |
| FIPS | **48187** Guadalupe |
| Path | **A** (leftover year 2025 n=93728 before apply; in-place update @ 2025) |
| Declared L17 | **2025 / stratmap-roll** (no flip) |
| Inspect read set | **Yes** — leftover 2025 equals declared L17 |
| Source | TxGIO StratMap zip `stratmap25-landparcels_48187_lp.zip` |
| DBF in zip | `stratmap25-landparcels_48187_guadalupe_202503.dbf` (year **202503**; confirmed by `--dry-run --limit=1` extract, 0 upserted) |
| Structured vintage | `tier:stratmap-roll;adapter:stratmap;drop:stratmap25-landparcels_48187_lp` |
| Writer SHA | **`46e1a5a1`** (`git rev-parse HEAD` on `P:/tmp/ldt-p78-bastrop`) |
| Dest | cortex-prod `cad_property` via `CORTEX_DATABASE_URL` |
| Gate | Packet PASS `derivedPath=A` leftoverN=93728 before apply |

## Scope locks

- **Leftover only.** Not CAMA. Not P-80. Not Dallas/Tarrant/Gillespie/Frio/Hood rewrite.
- **One county only:** 48187 (~94k existing 2025 keys)
- **No** `--allow-stratmap-fallback`
- **No** rewrite of 48055 / 48021 / 48209 / 48491 / 48453 / 48013 / 48019 / 48029 / 48031 / 48053 / 48085 / 48091 / 48121 / 48139 / 48149 / 48163 / 48171
- **No** L17 flip
- **No** atoms `--apply` / rematerialize / P-25 CAMA
- Gold `48021:34137` living area HOLD. `48453:280238` stays lookup-failed.

Dest identity live PASS before write (`_inbox/2026-08-25_p78_guadalupe_48187_dest_identity.json`): Caldwell 24989, Bastrop 77799, Hays 172116, Williamson 282570, Travis 380918, Atascosa 34649, Bandera 32755, Bexar 703258, Blanco 13648, Burnet 49243, Collin 387334, Comal 103207, Denton 351798, Ellis 98150, Fayette 22432, Frio 12489, Gillespie 31452 @ 2025.

Prop_ID literal `"0"` counted separately — not leftover success.

Inspect probe will run after apply: leftover 2025 equals declared L17. Parcel will be a Guadalupe key, not `48021:34137` / `48453:280238` / `48029:262160` / `48085:10000` / `48091:10003` / `48121:10`.
