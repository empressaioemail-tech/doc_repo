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

PLAN-ROW: F-10, F-19, F-03 (90_operations/OPS-19_factory_plan_of_record.md)
repo: hauska-factory

# CTX card A: replay determinism, reaper reconciliation, register dispositions

---
id: 2026-08-28_ctx_a_replay_reaper_dispositions_WDLL
title: WDLL — CTX card A: F-19 replay determinism, reaper reconciliation of orphaned runs, register dispositions for the Central Texas slice
date: 2026-08-28
last_updated: 2026-08-28
status: approved
applies_to: hauska-factory (stages/resolve, stages/replay, jobs/conformant, jobs/reap, ledgers/f10-defect-register, jobs/f10-cad-loop)
plan_row: F-10, F-19, F-03
depends_on: OPS-19 A-020 (Central Texas first), A-021 (standing production word), A-019 (job templates from the build config)
operator_go: 2026-08-28 ("they are all approved"; "spawn subagents to do everything and get this through to completion")
model_law: _blueprint/10_model.md (V1 minted ids, V9 repoint before retire), _blueprint/20_pipeline.md (L3 stages A-E), _blueprint/40_rule_register.md (BP-WRITE-01, BP-VERIFY-01), 19_the_instrument_contract.md
snapshot: hauska-factory origin/main a70139a · factory-conformant gen 18 and factory-f10-cad-loop gen 8 on image 3e1bbea0 · CP2 loop 7eb4d0fd (execution factory-f10-cad-loop-scllr) closed 06:31Z with 7 idempotent, 1 situs-sentinel skip, 2 executed (48055 run 1956886d, 48085 run 75ada535), both terminated success and both TX-REPLAY-NOT-IDENTICAL · three runs stuck at started: 309a07ab (48029 child of loop ff092eb7, 05:51Z), 1bd6316f (publish staging:48021, 08-27 20:13Z), c536c8c6 (control probe, 08-27 22:42Z)
owner: planner-run subagent in P:/seat-worktrees/property/hauska-factory-ctx-replay on seat/property-ctx-replay (from origin/main a70139a). The subagent produces the diff and the test output and hands back; it does not commit, push, deploy, or execute any job. The planner commits, merges, builds, and executes.
---

# CTX card A: replay determinism, reaper reconciliation, register dispositions

Date: 2026-08-28  Status: approved

Three code defects stand between the Central Texas six and a clean new-shape write, and every one of them is in `hauska-factory`. This card fixes them in one worktree with one writer. It runs no job and touches no store; the planner executes after merge.

## What the evidence says

**Replay is non-identical by construction, not by chance.** In `src/jobs/conformant.mjs`, `pipelineFromRows` stages `rs.aliases`, the resolve store's whole cumulative alias list, on every chunk. The store is hydrated from the `aliases` table before pass one and shared across chunks, so chunk N stages every alias hydrated from earlier runs plus every alias emitted by chunks 1 to N. That is why 48055 staged 783,710 atoms for 73,371 landing rows and 48085 staged 2,174,668 for 387,334, and why the Factory `aliases` table holds 247,397 rows for Bastrop's 77,799 parcels. Pass two (`replayCountyCadChunks`) hydrates again, now from a table that already holds pass one's aliases at this run's `knowledgeAt`, so `resolveCandidate`'s `already` check (nodeId, validFrom, knowledgeAt all equal) suppresses the alias for every candidate; pass two's chunk one therefore carries the whole county's aliases from hydration where pass one's chunk one carried only its own. The 48085 diff is exactly that: key `48085:1832707`, an `identity.alias` present on the second side only. The 48055 diff is a `cad-parcel-roll` key whose `atomId` and `atomDid` differ while `nodeId` and the claim hash agree; that one is not yet explained by the alias mechanism and item 1 must find it rather than assume it.

**The reaper cannot see three kinds of orphan.** Run 309a07ab is a `f10-county` child whose `scope` carries `parentRun` and no `execution`, so the execution-to-run mapping in `reap.mjs` never reaches it; it has sat at `started` since 05:51Z and the loop's idempotency guard reads it as `in-flight`, which is why Bexar was skipped as in-flight in the CP2 loop although 2nd9z wrote it clean. Publish run 1bd6316f and control run c536c8c6 are the same shape from other verbs. A run row at `started` with nothing running is a ledger lie of the class A-020 lists as not deferred.

**Three register classes sit on the Central Texas slice and all three block the write outright.** `TX-TRAVIS-JOIN` (48453, disposition `lane`), `TX-HAYS-LANDUSE` (48209, `quarantine`), `TX-SITUS-SENTINELS` (48021 and 48209, `quarantine`). The Travis join is a fabric defect (TxGIO geometry to CAD prop_id), the Hays hold is the landuse fact writer, the situs class is punctuation-only situs strings; none of them is a defect in the CAD roll write, and the bake already refuses a punctuation-only situs at serve (Bastrop's staging publish wrote 61,695 of 77,799 with the rest refused honestly). A-020 rules that these are dispositioned as fix or as an accepted degraded state the manifest shows.

## Acceptance items

1. **Replay identical across passes, by construction.** Stage per chunk only the aliases this chunk's candidates produced (the delta, not the store), and make the alias a candidate emits independent of what an earlier pass persisted: resolution returns the alias for every candidate; the staged alias set for a chunk is that chunk's candidates' aliases; deduplication happens at persist (the alias table's conflict target), never at emission. Find the cause of the 48055 `atomId`-only divergence with a failing test before fixing it; do not assume it is the alias mechanism. Tests: (a) a two-pass fixture where pass two hydrates from pass one's persisted aliases and the chunk fingerprint roll is identical; (b) the same fixture with a deliberately non-deterministic mint fails; (c) staged atoms per chunk equal candidates times the per-candidate atom count, no cumulative growth. | check: tests pass, the negative fixture fails, `node --test` output pasted | grade: [ ]

2. **Reaper reconciles every orphan.** `reap.mjs` reconciles every `runs.status = 'started'` row, not only rows whose scope names an execution: a row older than its `max_duration_s` (default 3600 where absent) with no live execution terminates as `orphaned` with a `termination_records` row; a child run whose `parentRun` is terminated terminates with it; publish and control runs are covered. Test: insert a fake started run older than an hour with no execution, run reap, it is terminated with a record; a run younger than its max duration is left alone. The three live orphans are reconciled by the first scheduled reap after the planner deploys; name them in the handback so the planner reads the rows. | check: test output; the reap job's log line names what it reconciled | grade: [ ]

3. **Register dispositions for the Central Texas slice.** Add a disposition value `execute-degraded` to `f10-defect-register.mjs` and honour it in `f10-cad-loop.mjs`: the county executes, the F-10 county row and the manifest cell carry the class id under a `degraded` field, and the manifest verdict reader shows the class. Set `TX-TRAVIS-JOIN`, `TX-HAYS-LANDUSE`, and `TX-SITUS-SENTINELS` to `execute-degraded` for the Central Texas counties only (48453, 48209, 48021); every other county keeps its current disposition. Test: a work list containing a Central Texas county under each class executes and its cell carries the class; a non-Central-Texas county under the same class still skips. | check: tests; the register diff shows exactly three classes changed and scoped | grade: [ ]

4. **Nothing else.** No writer changes beyond item 1, no loop concurrency, no F-09, no console. If item 1's investigation finds a second non-determinism outside the alias path, fix it under item 1 with its own failing test and name it in the handback. | check: diff pathspec | grade: [ ]

5. **Handback.** Final message to the planner: the diff summary by file, the full `node --test` output, the three fixtures named, the cause of the 48055 divergence stated with a second mechanism that would produce the same diff and why it was rejected, and `leave_behind`. No commit, no push, no deploy, no job execution, no write to doc_repo. | check: handback | grade: [ ]

## Do not

- Commit, push, open a PR, deploy, or execute any Cloud Run job or scheduler; the planner does those.
- Write to any store, staging included; tests use fixtures or an in-process fake.
- Print any DATABASE_URL, secret, or token.
- Change job templates by hand; `cloudbuild.conformant.yaml` is the only place a job's command, args, or resources live (A-019).
- Widen a check to admit the failing case. If replay cannot be made identical for a reason you can name, say so in the handback with the evidence.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-08-28_ctx-a_cp1.json
  CP2: _inbox/2026-08-28_ctx-a_cp2.json
  CLOSE: _inbox/2026-08-28_ctx-a_close.json
