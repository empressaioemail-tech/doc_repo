# L21 cross-vintage key mapping scratch (Tier 2) — 2026-08-14

## GROUND-TRUTH — 2026-08-14T17:30Z (post-reload residual classification)

- Operator post-reload gate quote confirmed: identical 654,675 + crosswalk-additive 7 / 689,838 = **0.949037 (94.90%)**.
- Dallas-style split on the 35,156 unmapped: **parcel_linked=35156 / non_geometry=0**. Full 2025 denom also 689,838 parcel-linked / 0 non-geom.
- 15/15 owner+situs samples geom-agree (real parcels). Source: 34,298 absent from 2026 TAD GIS_Link; 845 exact GIS_Link are **RP=P only**; 4 norm-only C/RC unseeded.
- Recomputed parcel-linked coverage **0.949037 HOLD** vs 0.99. Artifact: `_inbox/2026-08-14_l21_tarrant_post_reload_residual.json`.

## GROUND-TRUTH — 2026-08-14T16:26Z

- PR ldt #426 squash-merged @ `a6207607` after CI conclusion **success** (run 31818577412). `ci-vintage-predicate` success.
- Table `cad_property_vintage_crosswalk` live on cortex-prod; seed counts Tarrant 550 / Dallas 121.
- Coverage (parcel-linked): Tarrant **87.7849% HOLD**; Dallas **92.0427% HOLD** vs 99% flip gate.
- Tarrant 48,971 orphans exist in 2026 TAD source as RP C/P under same GIS_Link — load-filter defect, not a crosswalk. Parser now keeps R+C and named-skips other RP. Reload NOT executed (constraint).
- Dallas StratMap prop_id ≈ DCAD parcel Acct; 2026 roll is ACCOUNT_NUM. 34,036 parcel-linked orphans are GIS parcels without 2026 tax accounts.
- Drain-queue manifest filed (NOT executed): `_inbox/2026-08-14_l21_drain_queue_manifest.json`.
- Close: `_inbox/2026-08-14_l21_close.json` (CLOSED_PARTIAL_HOLD_FLIPS).
- Cloud Run: canary `cortex-api-00505-tan` (run 31819683438) → shift-traffic 100% (run 31819852130) both **success**.

## LESSON

- Key-shape guessing is wrong: Tarrant plat-style keys are real GIS_Link values; many missing rows were C-class drops.
- DCAD ACCOUNT_NUM == store prop_id does not mean StratMap prop_id shares that namespace.
- Schema fixture drift: drizzle-kit push PK auto-name must match fixture; name the primaryKey explicitly AND update integration expected table list.

## DEAD-END

- Spatial rekey of Dallas 2025→2026 live-account parcels returned 0 matches when filtered to ACCOUNT_NUM∩parcel Acct; GIS_PARCEL_ID unique path is the only deterministic map found so far (121).

## OPEN

- Planner flip ruling still blocked: Tarrant post-reload parcel-linked coverage **94.90% HOLD** (residual 35,156 all parcel-linked; named in `_inbox/2026-08-14_l21_tarrant_post_reload_residual.json`).
- Optional later: seed the 4 norm-only C/RC keys if targets already in 2026 store (measurement-only follow-up did not seed).
- Drain-queue owner/landuse/cad-roll re-applies for 48439/48113 after flip (manifest only).
