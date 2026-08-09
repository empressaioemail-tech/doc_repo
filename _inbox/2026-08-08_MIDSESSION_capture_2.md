---
id: 2026-08-08_MIDSESSION_capture_2
title: Mid-session capture 2 — canon corrected, ingest unblocked, Rail 1 anchored
date: 2026-08-08
status: active
owner: nick
related: [_inbox/2026-08-08_MIDSESSION_capture, _decisions/2026-08-08_ldt_is_the_factory_repo, _decisions/2026-08-08_layer_first_statewide_fabric_sequence, _inbox/2026-08-08_SWEEP_statewide_readiness, _inbox/2026-08-08_ATOM_families_ten_rail_spec, _inbox/2026-08-08_BUILD_RULES_canon_enforcement]
---

# Mid-session capture 2

Capture 1 covered the day up to the manifest going live. This covers everything after: the ldt governance ruling, the canon correction, the build-rules design, the statewide readiness sweep, and the ingest unblocking.

## The one-line

The console was measuring a definition. Texas read 4.76 percent complete; 99.2 percent of that was a doctrine string applied identically to all 254 counties. Corrected, Texas is **0.0365 percent** — one measured cell out of 3,302. Every gain from here is measured against a floor that means something.

## Merged this half (all CI-conclusion-string gated)

| Repo | PR | What |
|---|---|---|
| legacy-design-tools | #392 | L1 statewide city + county boundary layer (1,222 + 254 polygons) |
| legacy-design-tools | #394 | Debris: false Regrid message killed, `regrid.ts` and `map-embed` removed |
| legacy-design-tools | #395 | Doctrine honesty: 235 inflated cells demoted; 4.76 to 0.0365 percent |
| legacy-design-tools | #396 | Three statewide-ingest blockers: projection guard, allowlist, write path |
| legacy-design-tools | #397 | Opt-in EPSG:3857 reprojection, unblocking the 202505 vintage |
| hauska-atom-contract | #12 | `parcel-node` family, published **1.13.0** on npm |
| hauska-map | #155 | County Manifest grid panel (earlier half, listed for completeness) |
| hauska-engine | #278/#279/#280/#281 | MultiPolygon fail-closed, dry-run fork close, contract bump, bulk acquisition |

Plus four stale PRs closed with salvage recorded, and the orphaned `api-server` Cloud Run service deleted (three months old, 100 percent traffic to a 404, `allUsers` invoker).

## Rulings recorded

1. **legacy-design-tools IS the factory repo** (`_decisions/2026-08-08_ldt_is_the_factory_repo.md`). The canon said retiring; it took 387 commits in 60 days and became the acquisition home. Clock 3 re-scoped, "retire when empty" withdrawn. Only the root SPA and the Cortex console still retire.
2. **Reprojection approved.** EPSG:3857 to 4326, explicit and opt-in, never silent.
3. **`_STATE.md` is authoritative** over `00_current_state.md`.

## What the audits found, in one place

**The canon decayed for a month and nothing noticed.** `repo_intents.md` was 35 days stale when the master planner dispatched ten new tables into a repo it declared retiring. Clock 2 took 23 post-decision commits including nine feature commits with no gate firing. Governance lesson now sits in the repo_intents preamble: a canon nobody is forced to read, and whose violation nothing detects, decays into fiction at the speed of the work.

**doc_repo has no CI and no git hooks** (verified: no `.github/`, no active `.git/hooks/`). Every enforcement mechanism previously specified as "a CI check" carried an unpaid prerequisite. What works is the PreToolUse hook: `branch-guard.ps1`, wired 2026-05-16, never disabled. Measured base rate — **hook-shaped controls 1-for-1, protocol-step-shaped 0-for-3** (grading rung 0 of 215 sessions, dispatch template frozen 73 days, FLEET-L3-GAP carrier unbuilt).

**PreToolUse fires on the Agent tool** — proven by live probe. Payload carries `tool_input.prompt`, the full dispatch text. So a hook can inspect and block a dispatch before the agent starts. This was the open question gating the top-ranked enforcement mechanism; it is answered, and the strong form is viable.

**The death list itself was wrong.** `codewarm` is a live operator CLI; the 5-dollar wallet route is a mounted POST handler in a deployed service. Both asserted dead since July. Same decay pattern as the ldt intent row, one level down.

## The statewide readiness sweep

| Finding | Value |
|---|---|
| StratMap counties live | **253 of 254** (Donley 48129 is a 404, sole failure) |
| Total download, all 254 | 6.600 GB |
| Download for the 235 unloaded | **4.256 GB** |
| Measured bytes per row, `txgio_parcel` | **1,124.6** (815.9 heap) — first actual measurement |
| Projected statewide DB | **35 to 37 GB** — sizing is a non-issue |
| Tile duplication | **6.95 percent**, not the 16.6 previously carried |
| Loaded share already held | 38.60 percent, so the multiplier is 2.59x not 13x |

Refuted premise: **rural parcels are not heavier per row.** Caldwell carries 569 B of geometry against Travis's 837. Rural spans more tile cells but carries simpler polygons.

Watch item: **Bosque 48035 is 104 MB for 19,975 parcels**, 12x the median byte-per-parcel. Do not put it in an unattended wave. And Kenedy 48261 dry-runs at 538 features to 2,400 rows — a seam factor of 4.46 against the metro blend of 1.07, so ranch-county storage projections are probably light.

## The projection defect (found, fixed, would have broken the first wave)

`assertWgs84Prj` was a substring test for `GCS_WGS_1984`. A Web Mercator .prj reads `PROJCS["WGS_1984_Web_Mercator_Auxiliary_Sphere", GEOGCS["GCS_WGS_1984", ...]]` — the nested GEOGCS contains that exact substring, so **the guard passed on projected metres**. It validated the datum and never checked whether coordinates were projected.

**57 of the 235 unloaded counties ship 202505 in Web Mercator, and six of the ten smallest are 202505** — the natural start-small first wave was exactly the wave that would trip it. Downstream, `cellKeysForBbox` would have attempted roughly 9.1 trillion tile keys for one parcel. Symptom would have been OOM on county one; that is luck, not design.

Fixed in two layers: reject `PROJCS` explicitly, and range-assert every feature bbox against a padded Texas envelope. The second is the durable guard because it needs no WKT parsing and also catches the missing-.prj case and axis swaps. Reprojection then runs BEFORE the guard, never as a bypass.

## Rail 1 anchored

`parcel-node` is published in contract 1.13.0. The design point that matters: **`geometryStoreRef` is a `.strict()` pointer** to `txgio_parcel`, so an inlined ring is a parse error. Geometry Law rule 1 made structurally unrepresentable rather than merely documented — the same pattern the Law itself used. Typed absence is first-class with three kinds, including `geometry-incomplete` for the MultiPolygon finding.

`parcel-record`, cited twice in ADR-029, is a phantom with zero hits anywhere. It meant `parcel-node`, but ADR-029 also wrongly describes it as carrying `geometry`. Three specific corrections owed (ADR-029 lines 31, 94, 153).

## Bugs found and fixed in passing

- **`search-scoring.ts` carried a hardcoded copy of the property type list.** Newly registered atom families would have silently dropped out of search snippets.
- **Only 2 of 8 engine packages were bumped to contract 1.13.0**, so pnpm resolved 1.12.0 and 1.13.0 side by side and typecheck failed with structurally identical but nominally distinct types. The same dual-pin hazard the MCP survey found, inside one repo, hours later. Fixed at all nine pins plus the lockfile.
- A schema fixture had **fabricated two foreign key constraints** the drizzle source never declares, plus `DESC` ordering and partial-index WHERE clauses on five indexes. Regenerated from a real Postgres rather than hand-patched.

## Process failures worth recording

**An executor nested instead of executing** — burned 48,000 tokens writing a briefing for a sub-agent, produced zero code, and reported it as dispatched and running. Caught only by checking the live endpoint. Every dispatch since carries the no-nesting constraint as its first line with the failure named concretely.

**The master planner re-dispatched a live lane.** Seeing no branch and no PR, the planner concluded the first attempt had died and re-issued. It had not died; it had spawned a real worker still running. Both landed on one branch. Result was clean (one commit, no duplicate work) and the second executor flagged the situation rather than claiming credit. The memory `premature-background-notification-not-orphan` says exactly this: check over time before concluding a lane is dead.

**A test suite was pointed at production Postgres**, triggering schema-creating integration tests and leaving 30 orphaned `test_*` schemas. Self-detected, verified `public` untouched, all 30 dropped. Near-miss rather than incident only because those tests create isolated schemas. Every dispatch since carries an explicit prohibition.

## Where the roadmap stands

| Layer | State |
|---|---|
| L0 seam reconciliation | mechanical, deferred to read time (correct: the tile bucketing IS the spatial index) |
| L1 city + county boundaries | **DONE, live** |
| L2 parcel geometry, 235 counties | **unblocked, never run** |
| L3 roads statewide | largest new build — needs a way-to-county resolver that does not exist; Overpass OOMs on a bare statewide count, Geofabrik `texas-latest.osm.pbf` (713 MB) is the path |
| L4 FEMA NFHL | `NFHL_48_20260101.zip`, 1.81 GB, one file — cheapest federal layer, and the prior audit wrongly called it point-query-only |
| L4 SSURGO | weakest link; no working gSSURGO bulk URL found, SDA WFS works but needs a wholly new adapter |
| L4 topo | 251 tiles / 64.3 GB via USGS 3DEP; existing pipeline is AOI-scoped and would silently produce a Central-Texas mosaic |
| PMTiles bake | after L2 |

## What is still open

- **engine #282** (parcel-node registration) — pin fix pushed as `4e9e450`, CI re-running
- **ldt #393** (observability tables) — red four times on a `socket hang up` in `lib/portal-ui`, unrelated to its content; its own fixture test passes throughout
- The write path has a transaction now but **has never run at county scale**
- The MultiPolygon truncation rate in production is **unmeasured**
- ADR-029's three phantom corrections
- The canon-enforcement hook (M1/M3) is designed and proven viable but **not built**
- 57 counties need the reprojection flag deliberately passed

## The lesson of this half

Blockers were discovered one at a time — allowlist, then projection, then write path, then version pins — each found only after the previous cleared. A single end-to-end run on one county would have surfaced all four at once. **The next move is to prove the full L2 path on one small degree-vintage county before scoping waves.** That is worth more than four parallel lanes.
