CANON-PREAMBLE v6f9d139b
- COTALITY IS EXTINGUISHED — when code hits it (502/OAuth/fallthrough), re-route to county-gis/public-record, NEVER rotate the credential. Regrid also dead.
- DEPLOYS ARE PLANNER-OWNED — the agent deploys and fixes failed deploys; never escalate a deploy to the operator; "failed on X, fixing X".
- NO PRIVILEGED DATA — everything via uniform public-record; any path must work for a no-relationship jurisdiction.
- CTX / national HOLD LIFTED 2026-08-26 for the Factory program (`_decisions/2026-08-26_factory_program_and_hold_lifts.md`); the Bastrop QA condition is cosmetic and does not gate the data path. NO PRIVILEGED DATA and the Hauska spine rule stand.
- THE FACTORY (OPS-19, `F-` rows) — one machine built to the MODEL LAW (`19_the_instrument_contract.md`, `_blueprint/10_model.md`, `_blueprint/20_pipeline.md`, `_blueprint/40_rule_register.md`, `51_ingestion_pipeline_reference.md`, `24_instrument_conformance_program.md`; package `dist/*.d.ts` is the tiebreaker; `25_atom_architecture_reference.md` is superseded for the model): four layers, five canonicalisation stages, each stage the executor of its `BP-` rules; own repo `hauska-factory`, own Neon store, console Smart Site Factory in `hauska-map/apps/factory`; staging Smart Site under the Factory base URL and every publish lands on staging before the identical job runs on production; nothing reaches a serving store except through publish; laptop ingest is FROZEN (`_decisions/2026-08-26_ingest_freeze_and_cloud_loader.md`). **OPTION A ruled** (`_decisions/2026-08-26_factory_model_law_and_option_a.md`): P-82-lite plus BP-WRITE-01 land on the existing writer as a bug fix; Bexar 48029 cad finishes on the current shape (660,000 of 703,257 done); NO new county is written on the old shape; Harris, Dallas and the Texas remainder wait for the conformant stage E writer (F-15, F-16, F-18). STATUS 2026-08-27: Phase A closed; F-02 runner `factory-atoms-cad` (us-east4, digest-pinned, run row first) is the only writer job; OLD-SHAPE WRITES ENDED permanently (no `--apply` through the old writer for any county; Bexar 703,257 = roll, complete); the store is still the old shape and still serves; next card is the conformant writer (F-16 resolution, F-17 reconcile, F-20 stage-and-merge write, F-18 intensional demotion) on one Texas source, F-15 types from the substrate seat by request, then F-10 drains Texas, then F-06 publishes. Every lane has its own registered worktree; never build in another lane's checkout.
- CODE-DONE != CUSTOMER-DONE — a grade is a live probe on the deployed surface across multiple different-data parcels, never a merged PR.
- SMARTCITY PRODUCT LINE THEN UI THEN ONE FEED — template Dashboards UI first, then one adapter/source onto `template-city`. Live Bastrop is an island, not the next card. Three identities: `template-city` demo, live `tenant_id=2` Bastrop, next onboarded city. Do not rewrite `tenant_id=2` in place. CitizenConnect is the citizen lens, not a SKU. Feeds are adapters that write records. Destination still `_decisions/2026-08-17_smartcity_product_line_then_bastrop_onboarding.md`. Next-card sequence `_decisions/2026-08-17_dashboards_ui_then_one_feed.md`. Gap map `_inbox/2026-08-17_dashboards_missing_pieces.md`.
- FEED ADAPTER CONTRACT (G-63 CLOSED) — kinds are a catalog; grants are per city pack. Write spine or files with provenance. Never a Dashboards vendor table. Never Pipedrive as a city feed. Samsara fleet copies are not G-24. Decision `_decisions/2026-08-17_g63_feed_adapter_contract.md`.
- G-11 CITY-PACK TENANCY (CLOSED 2026-08-17 as sequencing) — a city pack is the tenant. Identified caller is a Hauska product key whose `jurisdiction_tenant` equals `cityKey`. `DASHBOARDS_API_KEY` is not a tenant. Fixture pack `fixture-city`. Not sprint-54 done. Not live ingest. WDLL `_inbox/2026-08-17_g11_tenancy_WDLL.md`. Decision `_decisions/2026-08-17_g11_city_pack_tenancy.md`. Close `_inbox/2026-08-17_g11_close.json`.
- G-45 SMARTSITE STAFF MAP (CLOSED 2026-08-17) — Dashboards staff map is the SmartSite embed of gold `48021:34137`. GET `/` auto-loads it. Do not cut live Leaflet. Do not clone PE. WDLL `_inbox/2026-08-17_g45_smartsite_staff_map_WDLL.md`. Decision `_decisions/2026-08-17_g45_smartsite_staff_map.md`. Close `_inbox/2026-08-17_g45_close.json`.
- G-64 LANE C STAFF PATH (CLOSED 2026-08-17) — Dashboards development-services mounts plan-review-app. GET `/?lens=development-services` auto-loads it. GET `/` stays G-45 SmartSite. Do not cut live PermitFlow. Do not start G-52. WDLL `_inbox/2026-08-17_g64_lane_c_staff_path_WDLL.md`. Decision `_decisions/2026-08-17_g64_lane_c_staff_path.md`. Close `_inbox/2026-08-17_g64_close.json`. Serving Dashboards `00007-8sc`.
- G-65 PERMITFLOW KILL (CLOSED 2026-08-17) — PermitFlow dead as a Dashboards product. Live `/permitflow/*` uncut until a named island replacement. WDLL `_inbox/2026-08-17_g65_permitflow_kill_WDLL.md`. Decision `_decisions/2026-08-17_g65_permitflow_kill.md`. Close `_inbox/2026-08-17_g65_close.json`.
- COMPASS IS SHARED-ELEMENT SHEET CHROME — G-66 item. Top-bar source control, not a page, not a rail-only assistant. Answer engine is out of this wave. Old Compass is not the atom-render reference; SmartSite is. Decision `_decisions/2026-08-17_ux_implementation_sequence.md`.
- UX IMPLEMENTATION SEQUENCE (G-67 first) — kit copy, then G-66 / G-68 / G-69 in parallel. Those three CLOSED 2026-08-17. G-24 stays zero. Live Bastrop no-touch.
- FILES COMPOSE THEN ONE FEED (G-70 G-71 G-72 CLOSED 2026-08-17) — Work → Files mounts smart-files-app. G-71 wrote Bastrop municode meetings onto `template-city` files. That host is a HOLD (identity collapse), not a feed win. Decision `_decisions/2026-08-17_files_compose_then_one_feed.md`.
- SHELL BEFORE FEEDS (G-73 CLOSED 2026-08-17) — Every G-18 / live-Bastrop staff function has a named home on the Dashboards shell. Connections is 67 of 67 Homes-table rows. Assets honest-empty. Feeds still pause. Register `_inbox/2026-08-17_g18_shell_homes.md`. Decision `_decisions/2026-08-17_shell_before_feeds.md`. WDLL `_inbox/2026-08-17_g73_shell_homes_WDLL.md`. Close `_inbox/2026-08-17_b_g73_close.json`.
- TEMPLATE-CITY IDENTITY (G-74 CLOSED 2026-08-17) — municode grant pulled off template-city. Compose meetings empty with basis `no municode calendar grant on template-city`. Citizen has no Chestnut. Connections HTML has zero Bastrop. No clerk retarget. Decision `_decisions/2026-08-17_template_city_identity.md`. WDLL `_inbox/2026-08-17_g74_identity_leak_WDLL.md`. Close `_inbox/2026-08-17_b_g74_close.json`.
- DEMO-CITY CHROME (G-75 CLOSED 2026-08-17) — mounts fill the frame, one SmartSite iframe, Compass-class map motion from current rails, 30c screens honest-empty. Serving `00013-vkl`. Plan Review `embed=1` is Dashboards-side; host already had detection. Interruptibility partial. Register 67 of 67 plus 3 addenda. Note `_inbox/2026-08-17_g75_shell_mounts_motion.md`. WDLL `_inbox/2026-08-17_g75_shell_mounts_motion_WDLL.md`. Close `_inbox/2026-08-17_b_g75_close.json`. Handoff `_inbox/2026-08-17_demo_city_template_handoff.md`.
- SMARTCITY PRODUCT-LINE DESIGN SYSTEM — one Empressa kit governs Dashboards, Smart Files, Plan Review, and future Asset Management. Not a Dashboards-only theme. Not Hauska chrome. Decision `_decisions/2026-08-17_smartcity_product_line_design_system.md`.
- SMARTCITY VISUAL LAW (session 1, operator loved 2026-08-17) — quiet surfaces, loud exceptions, honest absence. Register not card deck. Sidebar. Inverted applicability (Pass quiet, Unchecked hatch). Inter + Plex Mono, 12px floor. Environment badge. Not-built nav. Provenance chip; no bare confidence. Code citation has no ICC body slot. Light `--sc-atom` `#177F78`, dark `#4CC9C0`. Kit extract `_inbox/2026-08-17_sc_kit.css`. Decisions `_decisions/2026-08-17_smartcity_visual_law.md` and `_decisions/2026-08-17_atom_accent_light_hex.md`.
- SMARTCITY DASHBOARDS HOUSING — one product repo `empressaioemail-tech/smartcity-dashboards`, cities as tenant packs. Live Bastrop stays `smartcity-os` until a named island replacement. Decision `_decisions/2026-08-17_smartcity_dashboards_housing.md`.
- Full standing-decisions detail: `MEMORY.md` (auto-memory) + `_decisions/`.

AGENT-CONTRACT v1890f0bb — you are bound by 90_runbooks/AGENT_CONTRACT.md in full (fan model,
interruption recovery, slot law + lease, heavy-scan serialization, verification rules, close schema).
Read it before any work; where this dispatch and the contract disagree, STOP and report.

DEV-PROCESS vbb19bd34 — you are bound by 90_runbooks/DEV_PROCESS.md in full. It governs how work
is SHAPED and how a result is JUDGED: coverage figures travel with their denominator, classes are
measured never subtracted, an instrument's exclusion set is part of its contract, gating indicators are
proven able to fire, paired controls need a divergence test, guardrails that do not survive a clone are
not guardrails. Every rule in it is traced to an incident. Read it before any work.

FLEET-MEMORY v2a98086b — you are bound by 90_runbooks/fleet_memory_practice.md (M0).
The verbatim install block follows. Product-repo agents do not carry .cursor/rules; this is the install.

FLEET MEMORY (M0): As you work, capture build knowledge in a scratch block you return in your close, using four entry kinds — LESSON (a hard-won fact worth a test/note), DEAD-END (a tried-and-failed path + reason, so it is not retried), GROUND-TRUTH (a live-verified state WITH its timestamp), OPEN (a live thread the next context must pick up). Read any scratch context passed to you FIRST before re-deriving. Do NOT promote anything to durable memory yourself — return lessons in your close; the planner gates promotion. Nearing your limit, flush open threads + live ground-truths into your close so the next instance starts warm.

PLAN-ROW: F-16, F-17, F-18, F-20 (90_operations/OPS-19_factory_plan_of_record.md)
repo: hauska-factory

# The conformant writer: F-16 resolution, F-17 reconcile and promote, F-20 stage-and-merge graph write, F-18 flood demotion; one Texas source (Bastrop 48021 CAD roll) end to end on the new shape beside the old rows; F-15 types by request from the substrate seat

---
id: 2026-08-27_f16_f18_conformant_writer_WDLL
title: WDLL — The conformant writer: F-16 resolution, F-17 reconcile and promote, F-20 stage-and-merge graph write, F-18 intensional demotion; one Texas source end to end on the new shape
date: 2026-08-27
last_updated: 2026-08-27
status: approved
applies_to: hauska-factory (stages, store schema, console rows), hauska-engine (adapter plan halves only), hauska-atom-contract (F-15, substrate seat, by request)
plan_row: F-16, F-17, F-18, F-20
depends_on: F-15 (substrate seat; request at _inbox/2026-08-27_f15_contract_types_request.md), F-19 (replay and idempotency, proven inside item 6 of this card)
operator_go: 2026-08-27 ("yes to F-15 to F-18"; fresh agent; the drain lane and the writer lane are retired)
decision: _decisions/2026-08-26_factory_model_law_and_option_a.md; _decisions/2026-08-26_factory_program_and_hold_lifts.md
model_law: 19_the_instrument_contract.md; _blueprint/10_model.md (V1 to V15); _blueprint/20_pipeline.md (L3 stages A to E); _blueprint/40_rule_register.md (BP-* rules); 24_instrument_conformance_program.md (Track 2 types, T1.1 to T1.7); 51_ingestion_pipeline_reference.md (remediation order)
design: _inbox/2026-08-26_factory_program_design.md (sections 2, 3, 4, 8, 9, 12)
snapshot: doc_repo main d9a88d2 · hauska-factory main 7d5f50d (F-00 to F-05 closed; F-02 runner factory-atoms-cad gen 2, digest 5a3bf94d) · hauska-engine main 2c90b99 (write boundary, batched links, lease v2, run-id refusal) · hauska_mcp on ep-lucky-truth-apodo8hr, direct host, migrations 010 and 011 applied, atoms_writer_lease_v2 present · Factory store withered-surf-26870298 (us-east-1), runs and import_ledger populated, nine landing tables matched · old-shape writes ended 2026-08-27 (OPS-16 A-042); Bexar 703,257 = roll · the two readings that open this card: 149.0 and 67.4 atoms/s on 999-row rewrite chunks through the row-at-a-time path
owner: property seat, a fresh lane. Worktrees registered ahead of creation: P:/seat-worktrees/property/hauska-factory-conform on seat/property-conform and P:/seat-worktrees/property/hauska-engine-conform on seat/property-conform, both created from origin/main. The retired drain and writer worktrees (hauska-engine-drain, hauska-engine-writer, hauska-factory-writer, the primary hauska-factory worktree on seat/property) are not opened; their uncommitted salvage is listed in item 1. Deploys and job creation are recorded by this lane and verified by the planner. Substrate seat delivers F-15.
---

# WDLL: the conformant writer (F-16, F-17, F-20, F-18)

Date: 2026-08-27  Status: approved  Operator approval: 2026-08-27

Everything the store holds today is the old shape, written by the old writer, and it serves Smart Site now. Nothing in this card touches serving (F-06) or repoints a consumer. This card builds the writer that produces the new shape and proves it on one Texas source, side by side with the old rows, so that F-10 can drain Texas county by county through it. Read the model law before the code; the shape is not the store.

## What exists (read, do not rebuild)

The Factory control plane and store (F-00, F-01, F-03) are live: `runs`, `termination_records`, `leases`, `holds`, `import_ledger`, the landing tables for the nine Texas sources with `vintage`, `source_id`, `checksum`, `fetched_at`, `adapter_version`. The F-02 runner `factory-atoms-cad` shows the job shape every stage runner follows: image by digest from the engine repository, secrets on the direct host, run row first, args per execution, counts from the store, lease v2 held for the scope and released on termination. The write boundary (`packages/atoms/src/write-boundary.ts`) refuses bare keys, sentinels, decimal-padded grammar, and foreign DID namespaces; lease v2 is `(scope_type, scope_id)` token-bound. The console has Runs, Queues, Defects, Holds, Gates, Lanes screens reading the Factory store.

The two readings that end the old path: the row-at-a-time upsert with batched links measured 149.0 and 67.4 atoms/s in-region on 999-row chunks against a 300 atoms/s prediction. That is why this card writes through a stage table and a merge, not through `writePropertyAtomsBatch`.

## Done looks like

One Texas source (the Bastrop 48021 CAD roll already in landing) runs end to end on the new shape: adapter candidates in the six-field shape, canonical node ids minted with alias atoms and validity eras, tiered resolution with an adjudication queue the console shows, reconciliation that emits CONFLICT and SUPERSEDED_BY edges and never overwrites, promotion with a gate that has an owner and a throughput, a stage-and-merge graph write under lease v2 whose rate is measured on at least 100,000 rows against a pre-registered prediction, replay that produces the same atoms from the same landed bytes, and the first intensional demotion (flood) writing selector atoms and Derivation rows that re-point the enumerated rows rather than re-fetching. Every new-shape row grades by rule id V1 to V15; the old rows stay untouched and keep serving. The contract types the stages need come from `@empressaio/atom-contract` releases the substrate seat publishes (F-15); a temporary shim is allowed only with a check that fails the day the contract carries the type.

## Acceptance items

1. **Worktrees and salvage.** Create the two `-conform` worktrees from `origin/main`. List, do not open, the uncommitted salvage left in the retired worktrees (`hauska-factory-writer`: `atoms-writer-run.mjs`, `cloudbuild.control.yaml`, `scripts/`, `test/atoms-writer-run.test.mjs`; `hauska-engine-writer`: `services/atoms-writer/`); record in your CP1 which pieces you adopt by re-creating them on your branch and which you leave. Never commit onto `seat/property-writer` or `seat/property-drain`. | check: `git worktree list` shows the two new worktrees on `seat/property-conform`; CP1 salvage list | grade: [ ]

2. **F-15 dependency handled fail-closed.** Build against the published `@empressaio/atom-contract` version that carries each Track 2 type (2.1 branded `NodeId`, 2.2 provenance-class union, 2.3 `derivesFrom` required on Derivation, 2.4 absence verdicts, 2.8 supersession as an edge, 2.10 alias as atom and lineage edges, 2.11 selector algebra, 2.12 two-field access). Until a type is published, a local shim under `src/contract-shim/` is permitted only with a CI check that imports the contract and FAILS when the contract exports the type, so the shim cannot outlive its reason. Request status from the substrate seat at every checkpoint; do not fork the contract. | check: shim check verified by violation (a fixture contract export makes it fail); the contract version pinned per type | grade: [ ]

3. **F-16 resolution.** `src/stages/resolve/`: canonical node ids minted by `mint()` never borrowed from a source key; alias atoms with validity eras for every source identifier; tier 1 exact match on an authoritative alias, tier 2 scored on normalised address plus centroid containment with the score recorded, tier 3 provisional node plus a row in `adjudication_queue` with owner, depth, and throughput on the console Queues screen; node type explicit from the adapter's declared set; one resolution atom per decision, replayable; `SPLIT_FROM` and `MERGED_INTO` edges; `canonical(id, knowledgeAt)` answers the current node for any alias at any time. Verified by violation: a candidate whose key is a source id and not an alias refuses; two candidates carrying the same authoritative alias resolve to one node; a provisional node serves flagged and never merges automatically; a queue that only grows across two runs fails the item. | check: fixtures for each refusal and the merge; queue depth and throughput readable on the console | grade: [ ]

4. **F-17 reconciliation and promotion.** `src/stages/reconcile/` and `src/stages/promote/`: a resolved candidate meets the atoms on its node; the same claim from a higher authority keeps both with confidence updated; a contradiction emits a CONFLICT edge and never overwrites; a newer version emits SUPERSEDED_BY and closes the prior validity window; only reconciled atoms enter views; promotion gates carry an owner and a throughput expectation and are read from the console Gates screen. Verified by violation: two authoritative stores disagreeing on one parcel fact produce a CONFLICT edge, never a silent pick; an in-place update is refused as `IMMUTABLE_ATOM`. | check: conflict fixture; in-place update fixture; a promotion with no owner refuses | grade: [ ]

5. **F-20 stage-and-merge graph write.** `src/stages/write/`: candidates and their edges are COPYed into a stage table in the Factory store, then written into `hauska_mcp` by one MERGE per `(entity_type, county_fips)` scope under a lease v2 row locked for the duration, atoms and edges (`applies-to`, `subject-to`, `derivesFrom`) in one transaction, ids a pure function of their inputs so the write is idempotent. The write boundary runs on every row before the merge. Every write is a run with counts read back from the store (`updated_at >= run start` in scope, verified against the stage table count), never from stdout. Pre-registered prediction: at least 300 atoms/s sustained on a run of at least 100,000 rows in-region; the floor is 150; under the floor the lane stops and reports the per-leg timing rather than tuning. | check: stage table and merge visible in the run; lease row during, released after; boundary refusal fixture; the rate reported with rows, wall time, and per-leg timing | grade: [ ]

6. **F-19 replay proven inside this card.** The same landed bytes plus the same adapter version and logic version produce byte-identical atoms and edges on a second run; a replay overwrites rather than skips; a changed logic version produces a supersession edge, not an update. Proven on the one source before item 7. | check: two runs diffed to zero; a logic-version bump produces SUPERSEDED_BY rows | grade: [ ]

7. **One Texas source end to end on the new shape.** The Bastrop 48021 CAD roll from landing through stages A to E into `hauska_mcp` as new-shape rows under new node ids, beside the old rows, which are not touched; the county's new rows graded by rule id V1 to V15 (`rule_grades`), with UNMEASURED where only presence checks passed; alias atoms link every new node to its CAD identifier; the run ledger shows every stage for the county with cost. No consumer is repointed; no publish (F-06). | check: `rule_grades` rows for 48021 by rule id; old-row count unchanged before and after; the run ledger per stage | grade: [ ]

8. **F-18 first intensional demotion, flood.** One selector atom per FEMA zone with an honest citation and a closed-union predicate (2.11), materialised Derivation rows per Bastrop parcel node carrying `derivesFrom` (selector atom id, store version, method) with ids a pure function of those inputs; the existing enumerated flood rows for 48021 re-pointed to the Derivation rows, not re-fetched; wall time and row count recorded against the enumerated rows they replace, which is the falsifier for the statewide cost unknown. | check: selector atoms and Derivation rows present; a Derivation without `derivesFrom` refuses; the re-point count equals the enumerated count; timing recorded | grade: [ ]

9. **Checkpoints, close, leave-behind.** CP1 after item 2, CP2 after item 5 with the rate, close after item 8 at `_inbox/2026-08-27_f16-f18-conformant_close.json` with the finish card, the grades by item, the contract versions pinned, the unknowns' outcomes (write rate, tier 2 precision on a hand-graded adjudication sample, flood demotion cost), and `leave_behind`. F-10 (Texas cleanup through this writer) is the next card, not this one. | check: artifacts filed; planner grades | grade: [ ]

10. **Out of this card.** F-06 publish and any consumer repoint; F-07 staging; F-08 verify walk; any county beyond 48021; any source beyond the CAD roll and the flood demotion; any `--apply` through the old writer; changes to `hauska-atom-contract` (substrate seat, by request); the console operator-login proxy (F-04). | check: pathspec and `notStarted` on close | grade: [ ]

## Do not

- Write the old shape. `OLD_SHAPE_FILL_FROZEN` is permanent; `writePropertyAtomsBatch` is not this card's writer.
- Borrow a source key as a node id, or default a node type, a provenance class, or an access field. Refuse and route to adjudication.
- Collapse absent, zero, and unmeasured. A rule that only had presence checks grades UNMEASURED.
- Fork the contract. Shim only with the self-defeating check in item 2.
- Repoint any consumer, publish, or touch `neondb` serving tables. Old rows keep serving.
- Run anything from a laptop that writes a store. Jobs in us-east4, image by digest, run row first.
- Count from stdout. Read the store.
- Open the retired worktrees or commit onto their branches.

## Amendments

- None yet.

## Finish card (graded at close)

(not yet)

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-08-27_f16-f18-conformant_cp1.json
  CP2: _inbox/2026-08-27_f16-f18-conformant_cp2.json
  CLOSE: _inbox/2026-08-27_f16-f18-conformant_close.json
