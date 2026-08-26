---
id: 2026-08-26_factory_phase_a_WDLL
title: WDLL — Factory Phase A (F-00 repo and skeleton, F-01 store and landing, F-03 control core, F-04 console skeleton, F-05 ledgers)
date: 2026-08-26
last_updated: 2026-08-26
status: draft
applies_to: hauska-factory, hauska-map, legacy-design-tools
plan_row: F-00, F-01, F-03, F-04, F-05
operator_go: 2026-08-26 direction ("build this factory right"); model law and option A ruled later the same day; card text pending operator read
design: _inbox/2026-08-26_factory_program_design.md
decision: _decisions/2026-08-26_factory_program_and_hold_lifts.md; _decisions/2026-08-26_factory_model_law_and_option_a.md
plan: 90_operations/OPS-19_factory_plan_of_record.md
model_law: 19_the_instrument_contract.md; _blueprint/10_model.md; _blueprint/20_pipeline.md; _blueprint/40_rule_register.md; _blueprint/50_grading.md; 51_ingestion_pipeline_reference.md; 24_instrument_conformance_program.md
snapshot: P:/doc_repo main 9753b830a8e929ba1b59e625a2c60e50712ebcc0 · LDT origin/main 46e1a5a1 · engine cfa18bc
owner: property seat. Deploys planner-owned per standing decision.
---

# WDLL: Factory Phase A

Date: 2026-08-26  Status: draft  Operator approval: pending

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

## Finish card (graded at close)

1. (graded at close)

leave_behind: (declared at close)
