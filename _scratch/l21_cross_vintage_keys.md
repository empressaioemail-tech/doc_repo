# L21 cross-vintage key mapping scratch (Tier 2) — 2026-08-14

## GROUND-TRUTH — 2026-08-14T20:25Z (follow-up 5 Dallas named fallback + flip)

- Loaded **34,588** Dallas rows into `cad_property_vintage_fallback` (`method=named-fallback-2025`): absent-2026-account-space **33,094** / dcad-gis-id-ambiguous-refused **1,494**.
- PR ldt **#429** squash-merged @ `4dfb118c`. CI conclusion **success** (run 31836001060); `ci-vintage-predicate` success.
- Deploy: build 31836823962 → canary 31837173134 → shift-traffic 31837361809. Serving **`cortex-api-00509-nij` @100%**. `/health` 200.
- Runtime + registry: 48113 → 2026/cad-export (registry doc_repo uncommitted).
- Sample verify: ambiguous-refused `001165000001A0000` → taxYear 2025 WITH vintageResolution named-fallback; exact `00000100006000000` → taxYear 2026 propertyUseCode C12, no marker.
- Drain queue: Dallas owner/landuse/cad-roll **READY_FOR_L16_TAIL**. Blocker: engine `DECLARED_CAD_VINTAGES["48113"]` still 2025 until parity PR (same shape as Tarrant / engine #341).
- Constraints honored: no atoms, no slot, no cad_property reload, no second resolver/table.

## GROUND-TRUTH — 2026-08-14T20:10Z (follow-up 4 Dallas residual classification)

- Mutually exclusive Dallas residual after 121 accepted crosswalks: **34,588** = absent keyed 2026 account identity **33,094** + keyless candidates **0** + suffix family **0** + exact GIS identity ambiguous/refused **1,494**.
- Raw `ACCOUNT_INFO.CSV`: 806,563 rows, all ACCOUNT_NUM nonblank; GIS_PARCEL_ID blank **16,313** (BPP 16,300 / COM 13), 16,312 with owner+situs.
- Only 20 residual keys had usable owner+situs. Probe covered all 20 against blank-GIS rows: **0/20 hits**. Keyless mining dead for the measured residual.
- Mapped coverage remains **400,086 / 434,674 = 0.9204277 HOLD**. Need 30,242 more deterministic maps for 0.99; even resolving all 1,494 ambiguous keys yields only 0.9238648.
- Recommendation, planner-ruling required: named 2025 fallback total **34,588**, evidence classes absent-account-space 33,094 / ambiguous-GIS-refused 1,494. Classified closure would be (399,965 exact + 121 crosswalk + 34,588 fallback) / 434,674 = 1.0.
- Reconciliation finding: prior ambiguous count 1,492 was from an overlapping class report that did not sum to the universe. Raw-source mutually exclusive remeasurement is 1,494.
- Artifacts: `_inbox/2026-08-14_l21_dallas_residual_classification.json`, `_inbox/2026-08-14_l21_followup4_{cp1,cp2,close}.json`.
- Constraints: no flip, no load, no atoms, no registry/runtime changes. Dallas remains 2025/stratmap-roll.

## GROUND-TRUTH — 2026-08-14T18:25Z (follow-up 3 named fallback + Tarrant flip)

- CP1: companion table `cad_property_vintage_fallback` (ONE seam via `chooseCadPropIdResolution`; not fake identity crosswalk). Artifact `_inbox/2026-08-14_l21_followup3_cp1.json`.
- Loaded 35,156 fallback rows method=`named-fallback-2025`: absent-GIS 34,298 / RP=P-only 845 / norm-only 13. Counting rule: COUNT(*) WHERE county_fips=48439 AND declared_tax_year=2026 GROUP BY evidence_class.
- PR ldt **#428** squash-merged @ `3f680490`. CI conclusion SUCCESS (run 31827312860); `ci-vintage-predicate` SUCCESS.
- Image build push success (31828097006). Canary deploy dispatched (31828445717). Registry 48439 -> 2026/cad-export (doc_repo uncommitted). Dallas untouched.
- Sample verify: fallback key `1000-13-15` -> taxYear 2025 WITH vintageResolution named-fallback; exact key `-3680-1--10` -> taxYear 2026 propertyUseCode M1, no marker.
- Drain queue: Tarrant re-applies READY_FOR_L16_TAIL (blocked on engine mirror parity); Dallas HOLD.
- Engine `DECLARED_CAD_VINTAGES["48439"]` still 2025 until follow-on engine PR.

## GROUND-TRUTH — 2026-08-14T17:50Z (blank-GIS situs+owner probe)

- Sample 20 lowest absent-from-2026-GIS_Link keys with owner+situs; searched RAW TAD blank-GIS_Link rows (1,234,500; 10,931 with owner+situs).
- **Hit rate 0/20 (0.0%)** on situs+owner. Blank GIS mass is RP=M mineral; identity-bearing blanks are mostly P/C railroads.
- Decision: **named 2025-fallback list**, not keyless blank-GIS mining. Artifact: `_inbox/2026-08-14_l21_tarrant_blank_gis_probe.json`.

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
- Named prior-vintage fallback cannot live in the crosswalk table without fake declared-year targets; companion table keeps one seam and preserves the crosswalk invariant.
- Fallback CSV upserts must batch (~2k) or PostgreSQL rejects the parameter count.

## DEAD-END

- Spatial rekey of Dallas 2025→2026 live-account parcels returned 0 matches when filtered to ACCOUNT_NUM∩parcel Acct; GIS_PARCEL_ID unique path is the only deterministic map found so far (121).
- Blank-GIS keyless mining for Tarrant absences: 0/20 situs+owner hits; ruled out.
- Dallas suffix family: zero unique ±1–3 trailing-alphanumeric candidates across the 34,588 residual.
- Dallas blank-GIS mining: 0/20 owner+situs hits, exhausting all identity-bearing residual keys.

## OPEN

- Engine `resolveDeclaredCadVintage` mirror still 2025 for **48439** and **48113** — required before L16 owner/landuse/cad-roll re-applies (same shape as engine #341).
- Optional later: suffix/replate probes only if uniqueness is mechanically proven.
- Drain-queue owner/landuse/cad-roll re-applies for 48439 and 48113 both READY_FOR_L16_TAIL (not executed).
