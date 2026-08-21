# L15 plan farm — Tier 2 scratch

## GROUND-TRUTH (2026-08-13T12:40Z)
- Neon cortex-prod fancy-fire-06136146: txgio_parcel 16,428,786 / 253 counties. Donley 48129 absent.
- tx_rrc_well 1,396,049 / county_null **1556** (mission cited 1713; store wins). pipelines 491,178 / 0 null / 254.
- tx_building_footprint 10,674,975 / 254 / geom 100%.
- flood-hazard-fact 2,524,094 / 181 counties. Six metros 0 atoms. Features: Harris 1,523,641.
- L1 Harris tree PIDs 58656/58484/56316 still alive (1.1 GB RSS, 34s CPU since 04:38). Occupies heavy-PostGIS slot.
- PBF live at P:/tmp/pbf/texas-latest.osm.pbf (713,825,447 bytes). Also P:/tmp/statewide-roads/texas-latest.osm.pbf (older, 713,163,541).
- P:/hauska-engine DETACHED 8d8e880 A2-dirty — do not touch. origin/main d1d99e6 has 28b85a1.
- CP1: `_inbox/2026-08-13_L15_cp1_design.json`

## LESSON
- Writer --out for flood is SUMMARY only (counts/digest), not planned[]. Sidecar must persist compact NDJSON if drain is to skip PostGIS later.
- Rail 99.4% "present" was writer-shape (outcome present for outside-buffer). Gate is nearTrueRate. Density bands catch 99% without a 16M-parcel ST_DWithin.

## GROUND-TRUTH (2026-08-13T14:07Z)
- Close HONESTLY_PARTIAL `_inbox/2026-08-13_L15_plan_farm_close.json`. Manifest `_inbox/2026-08-13_L15_plan_farm_manifest.json`.
- L1 PID 56316 still alive at close: RSS 1788 MB, cpu 64.3s, 48201.plan.json ABSENT. Occupies heavy-PostGIS slot.
- Flood waiter PID 9192 still polling. Roads python 34688 highway_seen 269364 / ~4.02M. Do not kill.
- engine_wt pnpm install DONE 13:06:54Z (214 packages). Footprint runner ready, not started.
- HS-FLOOD-48201 aborted 13:04:30Z (serialize). HS-FLOOD-48261 confirmed atomsWritten=0.

## OPEN
- After L1 56316 exits + 30s: flood serial metros then remainder 76, then footprint serial.
- Roads: wait for `roads.split.done` / `split_counts.json`.
- Well null count drifted 1713→1556; partition live nulls.
