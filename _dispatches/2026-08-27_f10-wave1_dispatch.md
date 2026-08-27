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

PLAN-ROW: F-10, F-05 (90_operations/OPS-19_factory_plan_of_record.md)
repo: hauska-factory

# F-10 wave 1: the CAD roll for all 254 Texas counties through the conformant writer, one recorded run per county, defect rows before the loop, manifest cells reading verdicts per node (F-05); START GATED on the conformant close, the reaper trigger, and the merged PR

---
id: 2026-08-27_f10_wave1_cad_roll_WDLL
title: WDLL — F-10 wave 1: the CAD roll for all 254 Texas counties through the conformant writer, county by county, with the manifest cells reading verdicts per node (F-05 completion)
date: 2026-08-27
last_updated: 2026-08-27
status: approved, START GATED (see "Start gate")
applies_to: hauska-factory (loop runner, defect register rows, manifest verdict reader), hauska-engine (adapter plan halves only if a county's roll needs one), legacy-design-tools (none; the manifest publish stays the Factory's one-way copy)
plan_row: F-10, F-05
depends_on: the conformant-writer card close (_inbox/2026-08-27_f16-f18-conformant_close.json) with items 6 to 8 graded, the reaper trigger (that card's amendment i), and its product PR merged on main; F-15 in parallel (substrate)
operator_go: 2026-08-27 ("F-10 wave 1 and the Bastrop publish in parallel, two lanes")
decision: _decisions/2026-08-26_factory_model_law_and_option_a.md; _decisions/2026-08-26_factory_program_and_hold_lifts.md; OPS-16 A-042 (old-shape writes ended), A-043 (fill rows re-homed under F-10)
model_law: 19_the_instrument_contract.md; _blueprint/10_model.md (V1 to V15); _blueprint/20_pipeline.md; _blueprint/40_rule_register.md; 24_instrument_conformance_program.md (T1.1 to T1.7); 51_ingestion_pipeline_reference.md
design: _inbox/2026-08-26_factory_program_design.md (sections 3, 4, 8, 12)
snapshot: doc_repo main 462010f · hauska-factory job factory-conformant gen 8 ace17072 · Bastrop 48021 written on the new shape by run 15c5c397 (jmwdp, 133 s wall, 77,799 landing rows); rate 1,165 atoms/s on 100,000 rows · landing cad_property 8,021,862 rows statewide, matched on the two-count ledger · old-shape rows untouched and serving
owner: property seat, a fresh LANE PLANNER (may spawn sub-agents under AGENT_CONTRACT section 1). Worktrees registered ahead of creation: P:/seat-worktrees/property/hauska-factory-f10 on seat/property-f10 and P:/seat-worktrees/property/hauska-engine-f10 on seat/property-f10, both from origin/main. Never the conform, drain, or writer worktrees.
---

# WDLL: F-10 wave 1, the CAD roll statewide

Date: 2026-08-27  Status: approved, start gated  Operator approval: 2026-08-27

## Lane planner mode

This card is run by a planning agent that may fan work to sub-agents under `90_runbooks/AGENT_CONTRACT.md` section 1. The conditions that make fanning safe: the lane planner supervises every sub-agent to completion (a coordinator that fans and returns abandons its workers); sub-agents produce artifacts and hand them back and never commit or execute a job; the lane planner reads every diff and asks every sub-agent what it violated to establish a claim; adversarial review at CP1 and CP2 by the lane planner, never by the sub-agent that did the work; verification never delegated below the lane planner; one writer at a time on any file in the lane's worktree; every sub-agent prompt begins with the no-nesting clause.

## Start gate

Do not execute a county until all three are true, and say which are not: the conformant-writer card is closed with items 6 to 8 graded (the shape is proven on 48021); the termination reaper has a Cloud Scheduler trigger verified by violation (a 254-county loop without it repeats the 5j4mc timeout sit 254 times); the conformant lane's product PR is merged on `main` so this lane builds on it rather than beside it. Building the loop runner, the defect rows, and the verdict reader before the gate is allowed; executing is not.

## What exists

The conformant writer (`factory-conformant`, gen 8, digest-pinned) takes a county through stages A to E from landing into `hauska_mcp` on the new shape beside the old rows, as a recorded run with per-leg clocks, replay proven, counts read from the store, lease v2 per `(entity_type, county_fips)`, the `assertZeroRateProbe` detector, and the reaper. The landing table `cad_property` holds 8,021,862 rows across counties with `vintage` and `adapter_version` unknown on some (declared, not fabricated). The county manifest today is the old ledger (`county_facet_coverage`, `readManifestGrid`), 667 of 3,556 cells on a GET that has not moved since 2026-08-25T23:47Z, and it does not read verdicts per node.

## Done looks like

Every county's CAD roll has been through the writer as its own recorded run, or carries a defect row saying why not (source missing, vintage unknown, keyKind, sentinel situs) with a disposition and an owner; the Factory county manifest reads layer verdicts per node for the `cad` rail so a cell is satisfied when every node in scope is `populated` or `not-applicable`, honest absence is `absent-verified` with its scope, and `lookup-failed` and `quarantined` stay visible; `hasWriter` and `atomFamilyState` are derived from the store and vary across cells; the one-way copy to `neondb` carries `published_at` and the served ledger reads it (F-05 item 20); the old-shape rows are untouched and still serve; no publish (F-06) and no consumer repoint happen on this card.

## Acceptance items

1. **Worktrees, salvage, and the start gate recorded.** The two `-f10` worktrees from `origin/main`. CP1 states the three gate conditions with evidence (close artifact path and grades; scheduler job name and the by-violation record; merged PR and SHA). | check: CP1 | grade: [ ]

2. **Loop runner, one county per run.** `src/jobs/f10-cad-loop.mjs` (or the repo's convention) plans the 254-county work list from landing (`county_fips` present, row count, vintage and adapter_version known or declared unknown), refuses a county whose landing is absent or whose provenance is undeclared (defect row instead), executes `factory-conformant` per county with `--county=<fips> --apply --replay` through the Cloud Run Admin API with a run row first, waits, reads the termination, and moves on; concurrency is bounded by the heavy-scan scope rule (one heavy-scan scope per database) and by the lease table; a failed county is a defect row and the loop continues; the loop itself is a run with a work-list snapshot. Verified by violation: a county with an undeclared vintage produces a defect row and no execution; a second loop started while one runs refuses on the loop's own lease. | check: work-list snapshot; refusal fixtures; two-loop refusal recorded | grade: [ ]

3. **Per-county evidence, not a percentage.** For each county: run id, landing count, aliases, nodes, atoms, edges, replay identical or not, per-leg clocks, rate, and the V1 to V15 `rule_grades` with UNMEASURED where only presence checks ran. A county whose replay is not identical terminates `failed` and gets a defect row. | check: ledger rows per county; a non-identical replay fixture fails | grade: [ ]

4. **Named defect classes become rows, not code paths.** Ector keyKind, situs sentinels (`", ,"` and `", TX 78660"` shapes), Dallas and Tarrant vintages (P-25 KEEP, no DELETE), Hays landuse hold, unknown `vintage` or `adapter_version`, the Travis join P-80: each is a defect row with a disposition (re-run, re-acquire, quarantine, lane) and an owner in the Factory `defects` table before wave 1 starts; the loop consults the register and does not "handle" a class silently. | check: rows present; a county in a quarantined class is skipped with the row cited in its run | grade: [ ]

5. **Manifest reads verdicts per node (F-05).** The Factory county manifest for the `cad` rail derives each cell from the layer verdicts on the nodes in scope (bounded per-cell materialise), with `hasWriter` and `atomFamilyState` derived from the store; the vocabulary is `populated`, `not-applicable`, `absent-verified` with scope, `lookup-failed`, `quarantined`; the city manifest uses the same vocabulary from the roster. Verified by violation: a typed absence without the verified-absence pair refuses; a cell whose indicators are uniform across all cells is reported as dead (V5). | check: cells vary; refusal fixture; the 48021 cell moves within 30 minutes of its verified run | grade: [ ]

6. **The one-way copy carries `published_at` and the served ledger reads it (F-05 item 20).** The Factory publishes the county manifest to `neondb.county_ledger_snapshot` with `published_at`; the LDT `GET /api/county-ledger` returns `published_at` (option A: the field named as the snapshot's stamp beside the live grid; option B: serve the snapshot). This is an LDT change in its own worktree and PR. | check: live GET carries `published_at` equal to the last publish run's stamp | grade: [ ]

7. **Wave 1 execution and the honest count.** The loop runs to the end of the work list. Report counties written, counties with defect rows by class, total atoms, wall time, and the rate distribution (not the mean alone); the old-shape row counts per county before and after, unchanged. No county is re-run "to improve the number". | check: loop run row; per-county ledger; old-shape counts equal | grade: [ ]

8. **Checkpoints, close, leave-behind.** CP1 at the start gate, CP2 after the first ten counties (rate distribution, defect rows, any quirk that needs an amendment), close at `_inbox/2026-08-27_f10-wave1_close.json` with grades by item, the defect register export, and `leave_behind`. | check: artifacts | grade: [ ]

9. **Out of this card.** Any source other than the CAD roll (flood, footprints, districts, wells, roads, easements are later waves under F-10); publish, staging, walk (the Bastrop publish card); any consumer repoint; any `--apply` through the old writer; changes to the atom contract (substrate); the console proxy (F-04). | check: pathspec and `notStarted` | grade: [ ]

## Do not

- Start a county before the start gate is met and stated.
- Handle a defect class in code instead of a register row.
- Report a mean rate without the distribution, or a percentage for a manifest cell.
- Touch old-shape rows, serving views, or `neondb` beyond the one-way manifest copy.
- Run two loops, or a loop and a manual execute, on the same store.
- Let a sub-agent execute a job or commit.

## Amendments

- None yet.

## Finish card (graded at close)

(not yet)

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-08-27_f10-wave1_cp1.json
  CP2: _inbox/2026-08-27_f10-wave1_cp2.json
  CLOSE: _inbox/2026-08-27_f10-wave1_close.json
