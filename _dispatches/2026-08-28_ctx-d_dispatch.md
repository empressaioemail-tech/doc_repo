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

PLAN-ROW: F-03, F-06, F-10 (90_operations/OPS-19_factory_plan_of_record.md)
repo: hauska-factory

# CTX card D: the reaper matches by execution name

---
id: 2026-08-28_ctx_d_reaper_execution_identity_WDLL
title: WDLL — CTX card D: a run names its own Cloud Run execution at start, and the reaper matches by that name, never by start time
date: 2026-08-28
last_updated: 2026-08-28
status: approved
applies_to: hauska-factory (control/runs, control/reaper, jobs/bastrop-publish, jobs/verify-walk, jobs/f10-cad-loop, jobs/conformant, jobs/restamp-access, jobs/staging-reset)
plan_row: F-03, F-06, F-10
depends_on: OPS-19 A-020 (Central Texas first), A-022(5) (orphan rule), A-019 (job templates from the build config)
operator_go: 2026-08-28 (standing: "they are all approved"; "spawn subagents to do everything and get this through to completion")
model_law: ENFORCEMENT.md (a control whose scope is broader than its claim is a defect; state changing operations leave a record naming the items acted on), _blueprint/40_rule_register.md BP-FACTORY-01 (every run terminates once, with a record)
snapshot: hauska-factory origin/main 25d031b (cards A, B, C, timeout, LDT pin merged) · three staging publish executions started within two seconds at 09:22:59Z to 09:23:01Z (czlpc 48055, csvv8 48309, wqnzb 48209) · `termination_records` shows run 41bcc81a (the Hays staging publish, execution wqnzb) terminated `crashed` at 09:50:25Z by the reaper while its bake was still running (czlpc had finished 09:35Z, csvv8 09:43Z); when wqnzb finished at 10:12Z its own termination hit unique violation 23505 and the run row reads `failed 23505` although `publish_runs` 41bcc81a succeeded and its walk ecd466a7 passed · `src/control/reaper.mjs` matches a `started` run to an execution by job affinity and a 90 s start-time window when the run's scope carries no execution name
owner: planner-run subagent in P:/seat-worktrees/property/hauska-factory-ctx-replay on seat/property-ctx-reaper (from origin/main). The subagent produces the diff and the test output and hands back; it does not commit, push, deploy, or execute any job. The planner commits, merges, rebuilds after the running loop finishes, and reads the rows.
---

# CTX card D: the reaper matches by execution name

Date: 2026-08-28  Status: approved

The reaper's start-time fallback is a control broader than its claim: with three executions of one job starting in the same two seconds it attached a finished sibling to a running run and terminated it as `crashed` mid-bake, and the run's own close then failed on the duplicate termination. The publish itself was right; the ledger about it is wrong twice. The fix is identity, not a wider window.

## Acceptance items

1. **Every run names its execution at start.** `startRun` (or each job's call to it) records `scope.execution = process.env.CLOUD_RUN_EXECUTION` and `scope.job = process.env.CLOUD_RUN_JOB` when they are set (every Factory job runs on Cloud Run), for publish, verify-walk, staging-reset, restamp-access, the loop and its county children (the county child already carries `parentRun`; it gains its own execution name too). A run started on Cloud Run without an execution name refuses `EXECUTION_NAME_REQUIRED`; a run started outside Cloud Run (tests, a dry run on a laptop that is otherwise refused) records `execution: null` with `scope.host = "not-cloud-run"`. | check: tests per job; the fixture asserts the scope fields | grade: [ ]

2. **The reaper matches by name only.** A `started` run whose scope names an execution is reconciled against that execution and nothing else; the start-time fallback applies only to runs whose scope has no execution name AND whose `started_at` predates the deploy of this change (a constant `EXECUTION_NAME_SINCE` in the reaper, set by the planner at merge), and it is removed entirely by a follow-up test date the handback names. A run with a name whose execution cannot be found is left `started` until its age bound, then `orphaned` (A-022(5)), never attached to a sibling. Tests: three same-job runs started in one second with three executions in flight, one finishing, reconcile exactly that one; a named run whose execution is missing is not attached to a live stranger; the legacy fallback still reconciles a pre-date unnamed run. | check: tests; the three-sibling fixture fails on main before the fix | grade: [ ]

3. **A duplicate termination is a named refusal, not a 23505.** `writeTermination` refuses `ALREADY_TERMINATED` with the existing record's exit kind and recorder when a termination exists, and the job's close records that refusal on the run (`refuse_code`, `counts.terminationConflict`) instead of failing the process after a succeeded publish. The publish job's exit code follows the publish and the walk, not the termination race. | check: fixture: a pre-existing termination makes the close record the conflict and the job still exits 0 when the publish succeeded | grade: [ ]

4. **Correct the Hays row honestly.** Add a `reconcile-termination` verb to the reap job that, for a run whose termination was written by the reaper by start-time match while the run's own execution later finished with a different outcome, writes a `termination_records` amendment row (or a `run_event` `termination-corrected` if the table is one row per run) naming both records and sets `runs.status` from the run's own close evidence (`publish_runs` succeeded and walk pass for 41bcc81a). The planner executes it for 41bcc81a after the rebuild. | check: fixture; the verb refuses when there is no evidence of a different outcome | grade: [ ]

5. **Handback.** Diff summary by file, full `node --test` output, the `EXECUTION_NAME_SINCE` value to set, the exact execute command for item 4 on 41bcc81a, and `leave_behind`. No commit, push, deploy, or execution; no store write; no secret printed; doc_repo writes limited to the three checkpoint files. | check: handback | grade: [ ]

## Do not

- Commit, push, open a PR, deploy, or execute any Cloud Run job; the planner does those, and the conformant image is not rebuilt until the running loop (Travis, Williamson) has finished.
- Write to any store; tests use the fake factory.
- Print any DATABASE_URL, secret, or token.
- Widen the start-time window or add a second heuristic; identity replaces the heuristic.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-08-28_ctx-d_cp1.json
  CP2: _inbox/2026-08-28_ctx-d_cp2.json
  CLOSE: _inbox/2026-08-28_ctx-d_close.json
