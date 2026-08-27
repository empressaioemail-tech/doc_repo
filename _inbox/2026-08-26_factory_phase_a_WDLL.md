---
id: 2026-08-26_factory_phase_a_WDLL
title: WDLL — Factory Phase A (F-00 repo and skeleton, F-01 store and landing, F-03 control core, F-04 console skeleton, F-05 ledgers)
date: 2026-08-26
last_updated: 2026-08-26
status: approved
applies_to: hauska-factory, hauska-map, legacy-design-tools
plan_row: F-00, F-01, F-03, F-04, F-05
operator_go: 2026-08-26 direction ("build this factory right"); model law and option A ruled later the same day; card approved by the operator 2026-08-26 ("two cards approved"); repo created same day
design: _inbox/2026-08-26_factory_program_design.md
decision: _decisions/2026-08-26_factory_program_and_hold_lifts.md; _decisions/2026-08-26_factory_model_law_and_option_a.md
plan: 90_operations/OPS-19_factory_plan_of_record.md
model_law: 19_the_instrument_contract.md; _blueprint/10_model.md; _blueprint/20_pipeline.md; _blueprint/40_rule_register.md; _blueprint/50_grading.md; 51_ingestion_pipeline_reference.md; 24_instrument_conformance_program.md
snapshot: P:/doc_repo main 9753b830a8e929ba1b59e625a2c60e50712ebcc0 · LDT origin/main 46e1a5a1 · engine cfa18bc
owner: property seat. Deploys planner-owned per standing decision.
---

# WDLL: Factory Phase A

Date: 2026-08-26  Status: approved  Operator approval: 2026-08-26

Prior artifacts for this lane (DEV_PROCESS 3.3b): none for a Factory control plane or console. Adjacent: `27a_jurisdiction_factory_engine_spec.md` F1 (its guardrails G1 to G8 apply here verbatim), `_inbox/2026-08-24_county_manifest_dump.json` (last operator instrument for the county manifest), `_catalog/texas_roster_v1.json` (the city roster), `_inbox/2026-08-24_factory_routing_pin.json` (the hold set to import), `_blueprint/40_rule_register.md` (the rules this phase arms: BP-LAND-01, BP-FACTORY-01, BP-LEDGER-01, BP-ABSENCE-01, BP-LANDUSE-01). The planner's numbers are the planner's; reporting one wrong is a successful outcome.

## Done looks like

`hauska-factory` exists with a seat, CI, and an image that runs one job in `us-east4` and records its own snapshot and termination record. The Factory Neon project holds immutable landing tables with the adopted Texas sources (vintage, source id, checksum where known, unknown where not) and the adopted manifest tables, with counts that equal their sources. The control core refuses a run without a row, refuses a job without a termination record, refuses a held cell, and has retired the routing pin file by refuse. Smart Site Factory is reachable at its own base URL and shows Texas as it is: 254 counties by rails, 1,223 cities by rails, runs, queues, holds, defects seeded from V1 to V15 and the gap matrix, and Bexar 48029 cad reads partial with nobody having typed it. The manifests read layer verdicts per node, with `hasWriter` and `atomFamilyState` derived from the store. Nothing has been written to a serving store.

## Acceptance items

### F-00 repository and skeleton

1. **Repo and seat.** `empressaioemail-tech/hauska-factory` exists; `_catalog/seat_register.json` names it under the property seat with a worktree; the seat-worktree-gate refuses a write from another seat's checkout. | check: `gh repo view`; register row; gate negative | grade: [ ]

2. **Image, first execution, termination record.** Cloud Build builds the Factory image from named `hauska-engine`, `legacy-design-tools` and `hauska-atom-contract` SHAs; a Cloud Run Job in `us-east4` runs `factory snapshot` and records `engine_sha`, `ldt_sha`, `contract_version`, `image_digest`, `db_host_fingerprint`, `rtt_ms`, and a termination record (max duration, exit kind, lease release). Prediction: `rtt_ms` under 5 ms. A job that exits without a termination record fails its own close (BP-FACTORY-01). | check: run row read by field; missing-termination fixture | grade: [ ]

3. **Secrets in the job definition; missing env refuses (G7).** | check: missing-env refuse | grade: [ ]

### F-01 store and landing

4. **Project and schema.** New Neon project; schema per design section 4 (L1/L2, L3, control, ledgers, quality, states); migrations tracked with `schema_migrations`; connection layer refuses a `-pooler` host. | check: migration table; pooler refuse | grade: [ ]

5. **Landing is immutable and classed.** Landing tables carry `retention_class`, `checksum`, `fetched_at`, `source_id`, `vintage`, `adapter_version`; an UPDATE or DELETE on a landed row refuses (trigger or grant); a landing without a retention class refuses (BP-LAND-01). Verified by violation. | check: mutation refuse; missing-class refuse | grade: [ ]

6. **Texas adoption by import, counted, unknown recorded as unknown.** `txgio_parcel`, `cad_property`, `tx_fema_nfhl_flood_zone`, `tx_special_district`, `tx_rrc_well`, `tx_rrc_pipeline`, `tx_building_footprint`, `tx_city_boundary`, utility staging imported into landing; per-table count in the Factory store equals per-table count at source at import time, both quoted with timestamps; rows whose vintage or source is unknown say `unknown`, never a default (T1.7 applied at import). | check: import ledger rows; two counts per table; zero defaulted provenance fields | grade: [ ]

7. **Manifest tables adopted.** `county_manifest`, `county_rail`, `county_facet_coverage` imported; the Factory's own grid read equals the last operator dump cell for cell (667 of 3,556 at `computedAt` 2026-08-25T23:40:18Z); differences listed, none silent. | check: cell-by-cell diff file | grade: [ ]

### F-03 control core

8. **A run cannot start without a row.** Break the store connection; a job exits non-zero before any work with `RUN_RECORD_UNWRITABLE`. | check: fault test | grade: [ ]

9. **Holds are data, imported once.** The routing pin's holds become `holds` rows with reason, author `import:routing-pin`, `docRepoHead`; a held cell is a `refused: hold:<reason>` run row; the pin file is retired by refuse (`scripts/factory-routing-readiness.mjs` exits 2 with a pointer to the console); a CI divergence test fails if the pin SHA moves before retirement. | check: hold refuse row; script exit; divergence test observed failing | grade: [ ]

10. **Work list is derived, path-aware.** `factory plan --state=48 --path=existing` returns Bexar cad only (option A); `--path=conformant` returns cells minus holds once F-16 and F-18 exist and refuses `STAGE_NOT_BUILT` until then; a fabricated county refuses; footprint and roads never enter while held. | check: plan outputs; refuse tests | grade: [ ]

11. **Leases and the control API.** `leases` per the drain card items 8 to 13; control API endpoints for start, stop, hold, lift, approve, adjudicate, re-run, lane request, each creating a row; an unauthenticated call refuses. | check: endpoint negatives | grade: [ ]

### F-04 console skeleton

12. **Own app and URL.** `hauska-map/apps/factory` on its own Vercel project and base URL; `/site` rewrites to a placeholder until F-07; the app reads only the control API and holds no state. | check: Vercel project; grep for persistence returns only view preferences | grade: [ ]

13. **Numbers equal the store (G1).** Every count on the console equals a `SELECT` on the Factory store at the same instant, by a script that reads both and diffs. | check: `factory console-audit`, zero differences | grade: [ ]

14. **Bexar reads partial.** With no human input, `48029` cad shows 660,000 of 703,257 on the new shape with edges and 43,257 on the 2026-08-12 shape with zero edges, from an edge-presence read. | check: screen plus the query behind it | grade: [ ]

15. **Screens present, honest empty.** States, County manifest, City manifest, Runs, Queues (provisional depth, adjudication throughput, pending scores, drift), Defects, Holds, Gates, Lanes, Walk, Cost; screens whose stage is not built say so from the control API's capability list, never a stub badge. | check: walkthrough; badge computed | grade: [ ]

### F-05 ledgers

16. **Cells read layer verdicts per node.** A county cell is satisfied when every node in scope carries a `populated` or `not-applicable` layer for that rail; `absent-verified` requires the `evaluated` plus `provenanceScope` pair (BP-ABSENCE-01); `lookup-failed` and `quarantined` are their own visible states; a typed absence object without the pair reads `unmeasured`, never satisfied. Verified by violation. | check: fixture cells in each state; pairless absence reads unmeasured | grade: [ ]

17. **Indicators derive and vary.** `hasWriter` and `atomFamilyState` are computed from the store (a registered producer with rows, a family with atoms) and differ across cells; a grid where they are constant fails the ledger's own self-test (BP-LEDGER-01). `land-use-fact` and the `landuse` rail are never summed as one measurement (BP-LANDUSE-01). | check: self-test observed failing on a constant fixture | grade: [ ]

18. **Bounded per-cell materialise.** One cell moves after a verified run; the full-grid recompute path is unreachable from the Factory. | check: cell move test; runtime negative for the full-grid call | grade: [ ]

19. **City manifest exists.** 1,223 rows from the roster with rails (zoning layer, code text, parcel record layer, setbacks, envelope, footprint tier, easement tier) and cell states from roster verification fields; 777 unprobed cities read `not-yet` with reason `unprobed`, never absent. | check: row count; state counts equal roster status counts | grade: [ ]

20. **Published copy for Command Center.** County manifest copied one-way to `neondb` on a schedule with `published_at`; the CC county-ledger reads it unchanged in shape. | check: CC GET byte-compatible; `published_at` present | grade: [ ]

21. **Defects seeded.** V1 to V15, every M-row in the gap matrix, and every named Texas class in OPS-19 F-10 are `defects` rows with cells and evidence pointers; none closed. | check: row count equals the named list; spot-check three | grade: [ ]

22. **Out of this card.** No serving-store writes except item 20; no stage B to E code (F-16 to F-18 are their own cards); no publish; no adapters; no Utah. | check: `updated_at` audit on serving stores shows zero rows in this card's run windows | grade: [ ]

## Do not

- Write to `hauska_mcp`, `neondb` serving tables, tiles, cortex-api, or PE from any Phase A job except item 20.
- Read the pooler host anywhere in the Factory.
- Store state in the console.
- Import a Texas table without recording its source count, time, and which provenance fields are unknown.
- Grade any item by a screenshot or a percentage.

## Amendments

- 2026-08-26 (later): landing immutability and retention class (item 5), termination records (item 2), path-aware work list (item 10), verdict-per-node cells and derived indicators (items 16 and 17), model law references, after the model-law ruling.
- 2026-08-26 (CP4, planner-verified): item 2 query round trip measured: `query_rtt_p50_ms` 5, `connect_ms` 773 on `factory-snapshot-lmpfx`; the under-5 prediction failed by definition and the instrument is now correct. Item 19 graded met on the east-1 counts (1,223 cities, 735 unprobed). Item 20: the lane reports `published_at` on the live GET; the planner's fetch of `GET /api/county-ledger` found no such field; the lane must name the endpoint and the table the copy landed in before item 20 grades met. Map PR #223 is blocked on the required `test` check, which has not reported for `apps/factory`; the lane resolves the workflow trigger, never the protection rule. Factory PR #2 merged by the planner.
- 2026-08-26 (CP3 and east-1 cutover, planner-verified): store is now `withered-surf-26870298` in `aws-us-east-1` (created by REST `POST /api/v2/projects` with `project.region_id`; the Neon CLI fetch-fails even with a valid key; the MCP tool has no region field); west-2 `delicate-lake-78875790` retired by decline after both stores matched 17 / 71 / 1,223 / 8,561 / 735 (DELETE then GET 404). Job `factory-snapshot` is deployed by digest `ae25421a…` with `IMAGE_DIGEST` matching the execution image (item 2 digest half met). Item 2 prediction **failed** on east-1 too: `rtt_ms` 144 as measured; the lane's instrument measured a TLS connect, not a query round trip. Instrument corrected: record `connect_ms` and `query_rtt_p50_ms` (ten warm `SELECT 1`) separately; the under-5 ms prediction applies to the query round trip and is re-tested on the next execution. Item 4 re-graded met (region, schema, pooler refuse). Console tree found uncommitted on the wrong hauska-map branch; a second registered worktree `P:/seat-worktrees/property/hauska-map-factory` on `seat/property-factory` is added for item 12.
- 2026-08-26 (CP2): item 19 corrected: the roster has **735** fully unprobed cities of 1,223, not 777; the planner's figure was wrong and the store follows the roster. Item 2 prediction **failed**: `rtt_ms` measured 1,077 ms, not under 5 ms, because the Neon MCP `create_project` has no region field and created `delicate-lake-78875790` in `aws-us-west-2`; the design requires `aws-us-east-1`. Ruling (planner, same day): no Texas landing import (item 6) into the west-2 project; cut over to an east-1 project first, re-run item 2 there, and retire west-2 by decline after counts match. Item 2 second defect: the run row recorded the image tag `phase-a-local`, and the job itself is deployed by tag; the job must be deployed by `@sha256` digest and the row must carry that digest, cross-checked against the execution's container image (two derivations).

## Finish card (graded at close)

Close artifact `_inbox/2026-08-26_f-phase-a_close.json` filed 2026-08-26T22:44Z; lane snapshot factory `seat/property` 6c2beaa (main 567d38a via PR #3), console `seat/property-factory` b959886. Planner re-graded at source 2026-08-26T22:50Z to 22:57Z; where the lane's reading and the planner's differ, the planner's is later and is stated.

1. met. 2. failed-by-definition (`query_rtt_p50_ms` 5, `connect_ms` 773; the under-5 ms prediction failed and the planner accepted the measured figure). 3, 4, 5. met. 6. partial: import ledger shows 4 of 9 tables matched (tx_city_boundary 1,222, tx_special_district 2,775, tx_utility_territory_staging 10,196, tx_fema_nfhl_flood_zone 198,178; `defaulted_provenance` 0 on each); knl7d failed `MODULE_NOT_FOUND` from an unquoted PowerShell `--args`; five per-table jobs launched 22:38Z to 22:40Z on image `…69d87e7cfc00` (batch 50), of which the planner read at 22:53Z pipeline-mrxbd and wells-9f846 `Completed True` and cad-dq7md, footprint-ppdgr, parcel-wqdzv still running; their ledger rows are unread by the planner and grade at the next handback. 7 to 19. met (19 on cutover counts 1,223 / 735). 20. not-met: `GET /api/county-ledger` at 22:30Z and at the planner's two earlier fetches carries no `published_at`; the publish job wrote `county_ledger_published` and `neondb.county_ledger_snapshot.payload.published_at` (20:37:29Z) but the served handler `legacy-design-tools/artifacts/api-server/src/routes/countyLedger.ts` `router.get("/")` builds its payload from facet coverage and the manifest grid and never reads that table; the copy landed where serve does not look. Routed to OPS-19 F-05 as an LDT route change, not silently fixed. 21. met. 22. met-so-far.

hauska-map PR #223 closed superseded; PR #224 (same head b959886) was graded by the lane at 22:30Z as zero check runs; by 22:49Z `test` and `No double-encoded source` had both completed `SUCCESS` (the runs fired nineteen minutes after the push), `mergeStateStatus CLEAN`, base current (2 ahead, 0 behind main 9224a73), and the planner merged it at 22:57:06Z as `be8b7eb` with `seat/property-factory` preserved. The required `test` context now exists for `apps/factory/**`.

leave_behind:
  - item: factory-landing-cad-dq7md, factory-landing-footprint-ppdgr, factory-landing-parcel-wqdzv (running) and the ledger rows for pipeline-mrxbd and wells-9f846 (completed, unread)
    owner: property
    plan_row: F-01
  - item: `published_at` on the served ledger (LDT `countyLedger.ts` GET, option A add the field read from `county_ledger_snapshot` and name what it stamps, or option B serve the snapshot)
    owner: property (LDT)
    plan_row: F-05
  - item: `VITE_FACTORY_CONTROL_API_KEY` compiled into the public console bundle (`smart-site-factory.vercel.app` answers 200 unauthenticated; the bundle sends `Authorization: Bearer <build-time constant>` to `factory-control`, whose `POST` verbs are live); rotate the key and move the call behind a server-side proxy with an operator login before any further mutation verb ships
    owner: property
    plan_row: F-04
  - item: PowerShell `--args` quoting for `gcloud run jobs execute` recorded in the runbook so knl7d does not recur
    owner: property
    plan_row: F-03
