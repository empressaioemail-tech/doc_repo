---
id: 2026-08-24_write_path_planner_handoff
title: Handoff prompt — execute parcel public-facts write-path (Wave 1)
date: 2026-08-24
status: filed
plan_row: P-75
from: integration planner @ 54d791d
to: fresh doc_repo planner
---

# Handoff: execute the write-path plan (do not remake it)

Paste everything below the line into a fresh planner session.

---

You are the doc_repo planner. Execute the already-approved parcel public-facts write-path program. Do not remake the stack. Do not start CAMA, footprint drain, Travis join fix, or REST harvest.

## Snapshot at handoff (re-verify before you act)

- This prompt was written against **doc_repo `main` @ `54d791d`** (pushed). Declare your own seat, worktree, branch, and commit in your first output. If you are in another seat's checkout, stop.
- Identify your seat from `_catalog/seat_register.json`. Integration `P:/doc_repo` on `main` is **not** a planner seat. Do planner writes from your registered worktree.
- LDT pin for Wave 1: **`origin/main` @ `244567a50ae62334984b3f990d776872e1c206ea`**. Isolated trees already exist. Do not use the property-seat LDT (`feat/s1-instrument-hardening`) or the A2 PE tree (`fix/pe-pricing-a2`).

## Read this order, then stop reading and execute

1. `_STATE.md` then `MEMORY.md` then `_scratch/parcel-facts-write-path.md`
2. `_inbox/2026-08-24_parcel_facts_write_path_game_plan.md` (execution instrument)
3. `_inbox/2026-08-24_parcel_facts_write_path_WDLL.md` (acceptance items; Wave 1 go is items 4-5)
4. `_inbox/2026-08-24_write_path_what_we_missed.md` (hop and deploy surprises)
5. `_inbox/2026-08-24_inspect_hop_diagram.md`
6. Lane cards you will run: `_inbox/2026-08-24_lane3_p75_who_serves_WDLL.md`, `_inbox/2026-08-24_p75_CP1.md`, `_inbox/2026-08-24_lane3_p76_city_limits_WDLL.md`, `_inbox/2026-08-24_p76_CP1.md`
7. `90_runbooks/AGENT_CONTRACT.md` and `90_runbooks/DEV_PROCESS.md`

Dispatches are compiled: `node scripts/dispatch.mjs --plan OPS-16 --lane <ID> --plan-row <P-xx>`. Never hand-assemble. Work that cannot name a plan row is not scoped.

## What is already done (do not redo)

| Item | Evidence | Do not |
| --- | --- | --- |
| P-73 field map | `_inbox/2026-08-24_p73_ingest_bound_field_map.md` | Another 66-row remapping |
| OPS-16 A-026 / A-027 | plan of record on `54d791d` | Re-open the program |
| Live store counts 2026-08-25T01:58:19Z | `_inbox/2026-08-24_wave1_live_store_counts.json` | Treat ss-w15 / L22 as unmeasured. Counts match those closes exactly (1222 city, 10196 staging). Timestamp is the new fact. Empty-index lie is still a **code-path** risk on origin/main. |
| Caldwell StratMap YEAR_BUILT / GIS_AREA | `_inbox/2026-08-24_stratmap_year_built_gis_area_sample.md` | Assume `Number(YEAR_BUILT)` or assume acres statewide |
| P-77 **measure** (WDLL item 6) | `scripts/p77-travis-join-measure.mjs` live 2026-08-25T02:08:37Z: **10 hit / 1 miss / 0 vintage-gap / 0 unmeasured**. Miss `48453:280238` `leading_zero_orphan=false`. | Re-derive the join. Invent a geo_id join. Treat 0.51 `prop_id_bad_rate` as the grade. Treat 280238 as a padded key. |
| P-78 **spec** (not product) | `_inbox/2026-08-24_p78_cad_property_merge_SPEC.md` + F1–F8 + `node scripts/p78-merge-fixtures-selftest.mjs` | Start Dallas CAMA. Rewrite the merge in prose. Use `Number()` on YEAR_BUILT lists. |
| Hop diagram | `_inbox/2026-08-24_inspect_hop_diagram.md` | Treat a `cad_property` upsert as an inspect-title write |

Re-run the two selftests at session start. They must still pass.

```
node scripts/p78-merge-fixtures-selftest.mjs
node scripts/p77-travis-join-measure.mjs --self-test
```

`--live` is named-ID EXISTS only. Do not county-scan 48453.

## Operator go (A-027). This is your job.

**Close Wave 1 bind to a live probe. P-75 and P-76 only.**

CAMA (P-25) and footprint (P-09) stay not-parallel. P-74 situs and P-77 honest-miss are **named, not this go**. P-60 3b checkout is a separate approved card; do not mix it into this program.

### P-75 who-serves (WDLL item 4)

- Isolated LDT: `P:/tmp/ldt-lane3-wave1` branch `fix/lane3-wave1-p75-p76` HEAD must stay on pin `244567a5` plus your uncommitted reader. Confirm the tree is still that pin before you write.
- CP1 is pass-to-build. 0076 is on the tree. Drizzle `txUtilityTerritoryStaging` was missing at CP1. Reader was uncommitted (`whoServesRead.ts`). Live serving describe was UNMEASURED; the 10196 count is now measured on deployment Neon.
- v1: serve-time PIP over `tx_utility_territory_staging`. Holders plus residual `SERVICE-LETTER-REQUIRED`. No atom family. No `--apply`.
- TCEQ `water-district` rows stay complementary who-governs (item 6 on the lane WDLL). Do not remap them to water CCN.
- Close is a **live** gold probe after **cortex deploy** of the reader + route. A cortex-only ship dies at PE until a merge/chip exists; PE chip is leave_behind unless you have an isolated hauska-map tree from `origin/main`.
- Check: gold `48021:34137` typed section; outside-polygon fixture is residual, never `{}`.

### P-76 city-limits (WDLL item 5)

- Isolated LDT: `P:/tmp/ldt-lane3-p76` branch `fix/lane3-p76-city-limits` same pin.
- Table is live **1222 / 1222 geo_id**. CLI exists. origin/main `resolveCityContainment` still reports an **empty** index as unincorporated. Isolated reader must mark empty as unmeasured. ETJ is `unresolved`, never a fabricated buffer. P-76 does **not** close ruling 3.
- Boundary CLI apply is planner-owned if it writes Neon. Do not ask the operator to deploy.
- Close is a live probe: Bastrop city gold incorporated; named unincorporated control unincorporated; ETJ chip unresolved.
- PE `withRootFacts` does not copy `cityLimitsFact` on origin/main. Cortex deploy then PE merge. Card row is leave_behind unless you have the isolated PE tree.

### Deploys

Wave 1 needs a cortex-api deploy and, for card rows, a PE deploy. Deploys are planner-owned. Grade is a live probe on the deployed surface, never a merged PR. Pin the serving revision by request log / digest, not `latestReadyRevisionName`.

## Named next, not this go (queue, do not start unless operator amends)

1. **P-74** situs sentinel on an isolated hauska-map tree from `origin/main`. Simsbrook `48453:280239` title must not be `, TX` when `txgio_parcel` has a street. Gold `48021:34137` stays `908 PINE`. P-27 address resolver stays parked.
2. **P-77 honest miss** (WDLL item 7). `48453:280238` facets name lookup-failed at `2026/cad-export`. Neighbor `280239` stays joined. Measure is already filed.
3. **P-78 product rewrite** (WDLL items 8-9). Port the spec into `upsertCadProperties` + `landuse.ts`. Last-wins must fail F1 and F3 in cad-ingest. First-valid-YYYY (F8). GIS_AREA_U gate (F5). One-county dry-run. No `txgio_parcel` value columns. No P-25 until this is in code.
4. **P-25 Dallas/Tarrant** only after P-78 is in cad-ingest. Announce the zip. Flip L17 after the load. Atom apply is a leave_behind, not the close. Travis CAMA will not bind 280238.
5. **P-79 / P-80 / P-09 / remaining-metro parsers / COVER** stay Wave 5-6. A-017 and A-022 stand.

If you finish P-75 and P-76 to live probe in this session, **stop and present the next compile** (P-74 and/or P-78). Do not absorb Wave 3.

## Hard constraints (fail closed)

- Standing: Cotality extinguished; deploys planner-owned; public-record only; CTX/national held; code-done != customer-done.
- One atoms `--apply` slot. Who-serves and city-limits do not take it.
- One heavy PostGIS / full-table scan at a time. Announce CAMA and footprint if they ever start (they must not, this session).
- Subagents do not commit. You commit, by explicit pathspec, only when asked or when a lane close requires it in your seat.
- Stay in repos you own. Request product PRs from the owning seat; do not write property LDT/PE checkouts.
- No privileged data. Owner/mailing must not ride the new public-free wires.
- No em dashes in doc body prose.

## Corrections you must not relitigate

Two StratMap paths (`parse.ts` geometry vs `landuse.ts` values). L20 291k is zoning, not footprints (real staging `tx_building_footprint` ~10.67M). City limits ≠ ETJ. REST harvest writer is absent. `upsertCadProperties` is last-wins until P-78 lands in product. Travis join is `prop_id` only. 0076 is on `origin/main` (PR #427). Living area is the live CAD hop; title is baked situs.

## First actions this session (in order)

1. Seat + worktree + `git rev-parse` snapshot. Confirm isolated LDT trees still exist and still sit on `244567a5` (or report they do not).
2. Run the two selftests. Read `_inbox/2026-08-24_p77_travis_join_measure.json` live block (MEASURED, not the old UNMEASURED draft).
3. Code-read the isolated P-75 and P-76 trees. Diff against origin/main. File CP2 or a pickup that names what is uncommitted vs merged vs deployed.
4. Compile (do not hand-assemble) the next P-75 and P-76 dispatch if a lane is not already in flight. Supervise to a **live** gold probe. Cite WDLL items 4 and 5.
5. If blocked on PE (A2 tree still held), ship cortex, declare PE chip leave_behind, and say so. Do not open `fix/pe-pricing-a2`.
6. Update `_scratch/parcel-facts-write-path.md` and your `_state/<seat>/STATE.md`. Do not self-promote MEMORY.md.

## Success for this handoff

P-75 and P-76 are customer-done or an honest blocked close: serving revision named, live gold probe, WDLL items 4-5 graded with evidence, leave_behind declared (PE chip, P-74 tree, P-78 product). Waves 3-6 untouched. No `--apply`. No CAMA zip.

## Refuse

Starting P-25, P-09, P-79, P-80, P-17 COVER, P-27, MLS, HOA, Factory 2 setbacks. Fabricating ETJ. Scanning Travis county-wide. Writing `year_built` 0. Assuming GIS_AREA is acres. Treating CAMA as a title fix. Grading from a dirty property-seat tree.

## Artifacts (paths)

- Game plan: `_inbox/2026-08-24_parcel_facts_write_path_game_plan.md`
- Program WDLL: `_inbox/2026-08-24_parcel_facts_write_path_WDLL.md`
- Decision: `_decisions/2026-08-24_write_path_data_capture_order.md`
- Who-serves decision: `_decisions/2026-08-24_who_serves_promotion.md`
- Miss list: `_inbox/2026-08-24_write_path_what_we_missed.md`
- P-78 spec: `_inbox/2026-08-24_p78_cad_property_merge_SPEC.md`
- P-77 measure: `_inbox/2026-08-24_p77_travis_join_measure.md`
- Hop diagram: `_inbox/2026-08-24_inspect_hop_diagram.md`

Filed: 2026-08-24
From: integration planner (P:\doc_repo @ 54d791d)
To: fresh doc_repo planner
Re: Execute Wave 1 P-75 / P-76; do not remake the write-path plan
