---
id: 2026-08-30_ctx_w0_point_source
title: W0 point-source candidate (CTX facts-complete item 4)
date: 2026-08-30
status: active
plan_row: F-06
wdll: _inbox/2026-08-30_ctx_facts_complete_WDLL.md item 4
---

# Point source for leftover 0,0 / no-row

Ordered. The bake tries the next source only when the previous one cannot produce a usable point. A fabricating `prop_id` join on 48209 or 48491 is not a source.

1. **Owner-gated situs-keyed `txgio_parcel`.** Same path card H already wired for blocked FIPS (`normalizeSitusAddress` then `ownersAgree`). Extend it to leftover no-row on 48021, 48055, and 48453 when a situs key exists. `parcelJoin.state` is `joined-situs` or honest `gate-blocked` / `no-row`. Seed stays.

2. **CAD roll centroid, only when the claim body carries finite coordinates.** Card F CP1 sampled centroids were null. If a later atom carries one, use it and name `source: cad-roll-centroid`. Do not invent a centroid from a mailing address.

3. **Factory-indexed `landing_txgio_parcel` by county plus situs key.** Walk and bake share the index. This is also WDLL item 7 (BP-VALUE-01 stops being shared-input). A 15M sequential scan is refused.

4. **P-80 `geo_id` join.** Only for the Travis cannot-bind remainder the W0 recount names. Designed before coded. Not in the W1 PR unless item 2 splits that class.

Live remainder after card H (production `place_layer_snapshots` 2026-08-30T13:48:33Z, `_inbox/2026-08-30_ctx_w0_residue_recount.json`):

- 232,770 unstamped 0,0 now (pre-H 534,700; 301,930 recovered on Hays/Williamson situs).
- Travis `no-row` still 119,389. Situs was not tried there. W1 source 1 first.
- Bastrop `no-row` 15,542 and Caldwell `no-row` 23,660 unchanged. Same W1 source 1.
- Hays 130,663 `joined-situs` / 41,619 `gate-blocked` / 0 `joined`. Williamson 511,029 / 91,021 / 0. Seed did not leak.
- McLennan 0 sentinel. Point work there is not the residue.

Do not: lift the seed, join 48209/48491 on `prop_id`, treat Taylor `gate-blocked` as a miss, treat Laird `stamp-missing` as a miss.
