---
id: 2026-08-09_statewide_acquisition_master_planner_close
title: Session close — statewide acquisition, 19 to 196 counties, the manifest starts measuring
date: 2026-08-09
type: session_summary
participants: [nick, claude_code_master_planner]
memory_graded: none
related: [_STATE, _decisions/2026-08-08_layer_first_statewide_fabric_sequence, _decisions/2026-08-08_ldt_is_the_factory_repo, _decisions/2026-08-08_county_shape_thirteen_rails_and_geometry_first, _decisions/2026-08-09_factory_spec_precedence_ruling, 90_operations/OPS-11_invariant_register, 90_operations/OPS-12_instrument_inventory, 90_operations/OPS-13_store_topology]
---

# Session close — 2026-08-08 into 2026-08-09

Successor to the envelope-saga close. Began as cohort supervision, became a statewide acquisition program plus a governance repair.

## THE FOUR NUMBERS (verified live at close, 2026-08-09)

| Measure | At open | At close | Verify with |
|---|---|---|---|
| Counties with parcel geometry | 19 | **196** | `SELECT count(DISTINCT county_fips) FROM txgio_parcel` on `DEPLOYMENT_DATABASE_URL` |
| Parcel rows | 5,535,897 | **15,479,206** | same table |
| Counties with `parcel-node` atoms | 0 | **96** (1,142,174 atoms) | `SELECT count(DISTINCT body->>'countyFips') FROM atoms WHERE entity_type='parcel-node'` on `DATABASE_URL`, database `hauska_mcp` |
| Texas completeness | 4.76 percent (fiction) | **0.2134 percent** (measured) | `GET https://cortex-api-tds7av26va-uc.a.run.app/api/county-ledger` |

FEMA NFHL: **198,178 of 198,240** rows loaded.

## THE SINGLE CHEAPEST ACTION FOR THE NEXT AGENT

`countyGeometryScoreCli.ts` (legacy-design-tools, `artifacts/api-server/src/`) turns `parcel-node` atoms into manifest coverage. **It has been run ONCE, against 49 counties. 96 counties now have atoms.** Re-running it moves the completeness number immediately with zero new acquisition and zero new atoms. Do this first.

## THE CEILING THAT REFRAMES THE 24-HOUR TEXAS GOAL

**`county_rail` declares 12 rails. Only 4 have writers.** Eight rails structurally cannot produce a satisfied cell no matter how much data is acquired, so completeness has a hard ceiling near one third until those writers exist. Acquisition alone cannot finish Texas. This is the most important strategic fact in this document.

## WHAT THE MANIFEST WAS, AND WHAT IT BECAME

The County Manifest shipped reading **4.76 percent complete**. An audit found 4.723 of those points came from a single doctrine string applied identically to all 254 counties: Harris County rendered `satisfied-absent` on zoning, correctly describing unincorporated Harris County and silent about Houston. 99.2 percent of the headline was a definition wearing a number's clothes.

Corrected to **0.0365 percent** (one measured cell of 3,302). Then the geometry rail scorer wired `parcel-node` atoms into the ledger and it moved to **0.2134 percent** — the first movement in the program's history that represented measurement rather than assertion.

## THE DEFECT THAT SHOULD SHAPE HOW THE NEXT AGENT VERIFIES

**Harris County held 564,948 parcels and should have held 1.6 million.** `lib/cad-ingest/src/txgio/cli.ts:149` used `files.find()` to pick a shapefile; the Harris archive ships two, and the 213 MB west half (larger than the 103 MB east) was silently discarded. The store stopped dead at longitude -95.4364 against a true -95.96.

**It survived every gate.** Dry, apply, a second apply, and independent SQL all agreed at 564,948, because all four read the same truncated input. The membership file's `parcel_count_est` was 536,512 — exactly the east-only count — so the sizing probe carried the identical bug. It was found by a reviewer asking a geographic question instead of a counting one.

**A count cannot detect a defect it inherits.** That line belongs in every verification design from here.

REPAIRED at close: Harris now holds 1,602,031 rows, westmost -95.960827 against Census -95.960733, 769,053 parcels recovered west of the old wall. Zero atom contamination (Harris had no parcel-nodes written). The 254-county sweep found Harris is the ONLY multi-shapefile county. Reader fix in ldt PR #404 — fail closed unless `--multi-shp=concat`, never silent discard.

## THE OPEN DEFECT NOBODY HAS FIXED

**The cert lane grades against the retired frame.** `packages/engine-core/src/registry/cert-grade-core.ts:329-331` fetches the BCAD ring and scrubs it: `ring = bcadRing ? scrubLotLineRing(bcadRing) : null`. Geometry Law rule 1 makes txgio the truth frame with BCAD demoted to divergence reporting; rule 2 says truth is the RAW ring, never a scrubbed representation.

`block13-cert-grade.mjs` imports that core. **So the standing 7/7 regression gate — the one that held through the entire envelope saga — has been grading against the retired frame the whole time.** This is the reconciliation the Geometry Law itself named as owed before the next cert wave. It is now located precisely, on origin/main, with line numbers.

## DEFECT FAMILIES FOUND, ALL BY GUARDS WORKING CORRECTLY

1. **The `!dryRun` compute fork** (`depth-warm-bastrop-batch.mjs:653`) read stored boundary primitives only when `!dryRun`, so the dry leg ran a DIFFERENT computation than apply. Every dry/apply pair before the fix compared two different programs. Closed by engine #279; dry now predicts apply for the first time.
2. **The projection guard was a substring test.** `assertWgs84Prj` checked for `GCS_WGS_1984`, which a Web Mercator `.prj` nests inside `PROJCS[...]` — so it PASSED on projected metres. 57 of 235 counties ship the 202505 vintage in EPSG:3857, six of them among the ten smallest, so the natural first wave was exactly the wave that would trip it. Closed by ldt #396/#397 with a coordinate-range assertion as the durable guard.
3. **StratMap null placeholders** halted the wave three times (Wood, Henderson, Liberty; El Paso would have been a fourth). Fixed by declining with identity rather than weakening the guard. Critically: a proposed attributes-only predicate was MEASURED and would have over-dropped 10,837 valid parcels, 1,168-to-1 in Wood alone.
4. **A skip path incremented a bare counter.** Liberty alone lost 1,145 records carrying real `prop_id`, `geo_id` and owner name, silently, for the program's entire history. Every declination now carries identity.
5. **Multi-shapefile truncation** (Harris, above).
6. **NFHL backpressure** — unbounded stdout queue racing DB-bound consumption; 16 GB heap did not fix it. Fix in ldt #403.

## RULINGS RECORDED

- **legacy-design-tools IS the factory repo, not retiring.** The canon declared it retiring while it took 387 commits in 60 days and became the acquisition home. The planner dispatched ten new tables into it without reading the intent doc.
- **Layer-first replaces jurisdiction-first.** Statewide-uniform layers first, jurisdiction rails backfilled behind them.
- **Thirteen required rails, three states, threshold not binary.** Join quality later ruled a derived metric; denominator is 12.
- **Reprojection approved**, explicit and opt-in, never silent.
- **Factory spec precedence:** `factory_onboarding_runbook.md` governs the pipeline, the OPS band governs doctrine. Six 27-band specs retired by status flip, with 27c and 29 deliberately preserved as carve-outs.

## GOVERNANCE — WHAT NOW ENFORCES ITSELF

`.claude/hooks/canon-gate.ps1` on the `Agent|Write` matcher blocks dispatches into no-touch repos and dispatches missing the standing-decisions preamble. **It blocked its own author within hours of being built.** M2, the divergence detector, replayed the real 2026-07-04 to 2026-08-08 window and alarmed correctly on ldt at 223 commits.

Built hook-shaped because doc_repo has NO CI and NO git hooks, and the measured base rate here is **hook-shaped controls 1-for-1, protocol-step-shaped 0-for-3**. The session-close grading rung had run 0 of 215 sessions and was DELETED rather than repaired.

Four new docs: `OPS-11_invariant_register` (25 invariants, each naming its enforcing check or marked UNENFORCED — 3 are unenforced process rules), `OPS-12_instrument_inventory` (53 instruments each with what it CANNOT see, plus 13 defect classes with no instrument), `OPS-13_store_topology` (the worst absent domain), and the precedence ruling.

## STORE TOPOLOGY — the fact that bit twice

Atoms live in database **`hauska_mcp`** on `DATABASE_URL` (project hauska-prod-497015). `txgio_parcel`, `cad_property`, `county_facet_coverage`, `county_manifest`, `county_rail`, `tx_fema_nfhl_flood_zone` live in **`neondb`** on `DEPLOYMENT_DATABASE_URL` (project legacy-design-tools-prod). `CORTEX_DATABASE_URL` and `DEPLOYMENT_DATABASE_URL` are **byte-identical**. Same Neon endpoint, DIFFERENT databases — a single pool cannot see both, which is why `countyGeometryScoreCli.ts` opens two pools and joins in application code.

The governing runbook at line 379 still asserts CORTEX differs from DEPLOYMENT, which md5 disproves. Correction block added.

**A `-pooler` host produced `code 25006 / PreventCommandIfReadOnly` and killed two lanes.** An adversarial reviewer ran 12-way concurrent writes and could NOT reproduce the mechanism, so the causal claim is downgraded to observed-signature-with-unproven-cause. Use the direct host anyway — the cost asymmetry is the argument, not the mechanism.

**Concurrency 1-2 only.** 8-way deadlocked (`40P01`) on the shared `txgio_parcel` index; county-disjoint keys do NOT imply index-disjointness.

## THE PROCESS FAILURE THAT DEFINED THE SECOND HALF

**Five executors did real, correct work and returned with no report.** One after downloading 1.81 GB and applying a migration. One after loading 36,000 NFHL rows. One after repairing Wilbarger and advancing the sweep seven counties. CI green, work sound, close-out absent — each armed a Monitor and stopped.

Consequence: **the master planner became the reporting layer**, querying stores and merging PRs instead of planning. The operator observed the session "fell off the rails" in its second half, and this is the mechanism. A separate failure: one executor burned 48,000 tokens briefing a sub-agent that never ran and reported it as "dispatched and running" — caught only by checking the live endpoint.

Every dispatch now carries a no-nesting clause as its first line. **The unfixed half is the silent return.** If you dispatch a long-running data lane, verify at source on your own schedule.

The planner's own failure worth recording: a plan of five lanes (A through E) was written and then a different set was run. Inbound reports set the agenda instead of the plan. Two of the five never ran until the operator asked twice.

## MEMORY SYSTEM

90 files, index repaired. Five Cotality orphans were de-indexed but left intact on disk — invisible to an index scan, fully visible to semantic search. `regrid-purged-cotality-sole-spine.md` still asserted "Cotality is the sole parcel and property data spine" four weeks after extinction, which is how a dead vendor resurfaced in planning. All five now carry retirement blocks. **De-indexing is not retirement.**

**The memory store is NOT version controlled.** 90 files of institutional memory, no history, no backup, no recovery from a bad edit.

## OPEN PRs AT CLOSE

| PR | State | Note |
|---|---|---|
| eng **#287** | CI RED | Unified warm runner. Its own commit `9040c45` retired the scripts two test suites assert against. **BLOCKS ELGIN.** Rewrite the tests against `depth-warm-city-batch.mjs`; do not delete them, they pin the fork and bulk-acquisition guards |
| ldt **#403** | CI RED | NFHL backpressure fix |
| ldt **#404** | open | Multi-shapefile reader fix |
| ldt **#393** | CI RED | Observability tables; red five times on an unrelated `lib/portal-ui` socket flake |
| map **#118** | unknown | Older program |

## WHAT IS STILL OWED

Writers for eight rails (the ceiling above). Elgin and the tier catch-up (blocked on #287). Roads statewide ingest — design done, adversarially REFUTED for statewide until a two-county TIGER edge proof and a supersede contract exist. Topo. SSURGO. The tarball migration (79 files on the retired `@hauska/atom-contract` in ldt). Bell's divergence recording. Donley's source decision. Bosque's idempotency re-run. C3.7's ring-binding stamp. The `buildable-envelope` decline data migration (~58k Bastrop rows, designed not run). CLAUDE.md's dated status paragraphs, which should move to a historical record so point-in-time counts stop going stale inside the document every session loads first.
