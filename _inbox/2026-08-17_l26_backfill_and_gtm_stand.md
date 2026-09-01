---
id: 2026-08-17_l26_backfill_and_gtm_stand
title: L26 stand — QA/launch now, why backfill failed, GTM rulings
status: active
last_updated: 2026-08-17
applies_to: portfolio
related:
  - _decisions/2026-08-17_qa_launch_current_map.md
  - _decisions/2026-08-17_smartsite_gtm_pipedrive_popup_hobby.md
  - _decisions/2026-08-17_roads_exclude_harris_statewide_pbf.md
  - _inbox/2026-08-15_l26_gotomarket_pickup.md
  - 90_operations/OPS-16_texas_market_plan_of_record.md
---

# L26 stand (read this first when you come back)

Date: 2026-08-17. Operator: QA and launch on the current map. Do not hunt `_STATE.md` or the 15-minute scoreboard for this.

Live QA URL: `https://smartsite.cloud` (Vercel, same app as `property-explorer-xi.vercel.app`). Probed 2026-08-17T17:58Z: HTTP 200, `Server: Vercel`, `X-Vercel-Cache: HIT`, `Last-Modified: Sun, 16 Aug 2026 05:02:21 GMT`. 15-minute L26 scoreboard loop **dead** (terminal 760359 status failed; PID 85672 not running). 30-minute loop PID 84712 also dead. Roads drain **idle**. Do not restart it. L26 lease heartbeat PID **22096** still alive as of 17:58Z (last beat 17:53Z, expires ~21:53Z); it is not filling.

## Where we stand

| Item | State |
|---|---|
| Launch posture | Current map. Roads 254/254 and CAMA sqft are **backfill**, not the go. OPS-16 **A-017**. |
| Flood | 84/84 including Harris 48201. 10,989,635 atoms, 0 VF. |
| Pipelines | Keyset 201. Metro apply 50/52. Honest holds: Brazoria 48039, Fort Bend 48157. Do not `--apply` those two. Segmentize was reversed. |
| Wells / footprints | 174 landed each. |
| Roads PBF this pass | **98/254** landed. Fail-closed: Bastrop 48021, Caldwell 48055 (protected Overpass adapters; those counties already have road atoms). Harris 48201 **not landed** on PBF. |
| Dallas CAD atoms | Already written 2026-08-12 (A1 owner / land-use / cad-roll). L26 cad-roll re-apply **never started**. |
| Dallas CAMA sqft/year | **0%**. StratMap in store. DCAD zip never announce-loaded. That is the building-characteristics gap, not a missing map. |
| Stripe | Operator E2E 2026-08-17: **mechanically works**. Polish owed. Catalog names Smart Site Solo/Studio/Team. Amounts still $29/$65/$99, not locked $49/$129/$299. Unlock $15 product not created. |
| CRM | **Pipedrive**, tag `smartsite` plus user tier. Not a city feed (G-63 still stands). Not built this session. |
| Pricing UX | Popup like the landing signup modal. Not a full page. Not built this session. |
| Vercel | **Hobby stays.** PE is 11 of 12 functions. Do not add a BFF without merging one. |
| Deploy this session | **None.** No PE/cortex code changed. Live site is already the QA surface. Do not `npx vercel --prod` from dirty `P:\hauska-map`. |
| Google sign-in on `smartsite.cloud` | **BLOCKED 2026-08-17:** `redirect_uri_mismatch`. Live start sends `https://smartsite.cloud/api/auth/google/callback`. Client `1062716564162-1ost2c9ekv7t6t13v7l1jtd2cjvle19d` in GCP project `legacy-design-tools-prod` does not list that URI (Vercel host likely still listed). No code/deploy fix. Operator adds the URI in Cloud Console, then retry. |

## Why the backfill kept failing (do not retry these)

The two-week fill is one defect, repeated: **statewide cardinality in a Python or Node nested loop, killed by a wall, scored as drain JSON instead of the customer map.**

1. **Roads Harris.** `extract_highways.py` streams `P:\tmp\statewide-roads\texas-latest.osm.pbf` (713 MB, MD5 `4dd27afd6bc1c654f9b9635b709cf424`) and runs pure-Python point-in-polygon plus every-edge tests against the county ring. Dallas 48113 did that file in 9.8 min and wrote 321,958 atoms. Harris ran ~5 hours, ~366k ways kept, **0 atoms written**, then died. Third restart 17:25Z killed at 64k ways / 0 written. **Do not statewide-PBF Harris again.** Next method: clipped PBF or shapely prepared geometry, NDJSON off the atoms slot, then `--skip-extract --ndjson`. Script staged at `P:\tmp\l26_flood_drain_20260815\extract_highways_prepared.py` (not run).

2. **Wall-clock raise-and-restart.** Roads walls went 20 → 60 → 120 → 240 → 360 → 720 min. Each kill throws away extract progress. Right for Bexar. Wrong for Harris.

3. **Detach without `/T` still kills the tree.** 17:23Z `taskkill /PID 112100 /F` (no `/T`) killed python extract anyway. Dead-end. Do not retry.

4. **One atoms writer + one nested loop.** A metro that is 30x slower than a rural county blocks everyone. Flood and pipelines escaped via PostGIS. Roads never did.

5. **Wrong scoreboard.** 98/254 looked like a crisis. CAPCOG already has Overpass roads (Bastrop 19,907). That is why 48021/48055 fail-closed on PBF. Dallas/Bexar/Fort Bend PBF already landed. Harris **flood** is on the map.

6. **Dallas CAD tail was the wrong job.** L26 would have re-run `write-cad-parcel-roll-county` for 48113. A1 already did that. L21 flipped Dallas to 2026/cad-export (34,588 named 2025 fallbacks) but **did not reload CAMA**. Engine `DECLARED_CAD_VINTAGES[48113]` still 2025; do not `--apply` cad-roll until that mirror lands. The UX hole is `living_area_sqft` / `year_built`, which needs the DCAD certified zip (L9 parser merged, zip never loaded).

7. **Pipeline holds that are honest.** 48039 first batch 591s near 600s timeout. 48157 hit `statement_timeout` at 0 written. `ST_Subdivide` then `ST_Segmentize` made it worse. Reversed. Do not raise `statement_timeout`. Do not `--apply`.

## Work roots (do not use stale trees)

- Drain artifacts: `P:\tmp\l26_flood_drain_20260815\`
- Flood/roads engine: `P:\hauska-engine-worktrees\l24-flood-plan-emit` (not `P:\hauska-engine`)
- Pipeline engine: `P:\hauska-engine-worktrees\l26-pipeline-postgis` (PR #345 unmerged)
- Pinned roads PBF: `P:\tmp\statewide-roads\texas-latest.osm.pbf` (not `P:\tmp\pbf\`)
- Pickup: `_inbox/2026-08-15_l26_gotomarket_pickup.md`
- This stand: `_inbox/2026-08-17_l26_backfill_and_gtm_stand.md`

## Next when you reopen (not now)

1. QA the live map. Stripe polish from the operator pass.
2. Pipedrive webhook: person + `smartsite` + tier tag. Server-side only.
3. Pricing popup matching lander signup. Hobby: no new function.
4. Stripe amounts to 4900/12900/29900 when you take real money. Unlock $15 product.
5. Roads backfill redesign (not serial PBF). CAMA zip after announce. Engine vintage mirror before Dallas/Tarrant cad-roll re-apply.
