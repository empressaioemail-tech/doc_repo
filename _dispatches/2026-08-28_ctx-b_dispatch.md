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

PLAN-ROW: F-06, F-07, F-08 (90_operations/OPS-19_factory_plan_of_record.md)
repo: hauska-factory

# CTX card B: sweep walk, walk ownership, production wiring, per county

---
id: 2026-08-28_ctx_b_walk_sweep_production_publish_WDLL
title: WDLL — CTX card B: the walk sweeps an area, the publish run owns its walk, the production target is wired and refuses correctly, and the job runs per county
date: 2026-08-28
last_updated: 2026-08-28
status: approved
applies_to: hauska-factory (jobs/bastrop-publish, jobs/verify-walk, lib/publish-guards, cloudbuild.publish.yaml)
plan_row: F-06, F-07, F-08
depends_on: OPS-19 A-020 (Central Texas first), A-021 (standing production word for the six), the publish lane's A-017 commits on seat/property-publish (carried on this branch)
operator_go: 2026-08-28 ("they are all approved"; "spawn subagents to do everything and get this through to completion")
model_law: _blueprint/10_model.md (V3 access never defaulted, V6 situs refused at serve, V9 repoint before retire), _blueprint/40_rule_register.md (BP-SERVE-01, BP-SERVE-02, BP-CONFORMANT-01, BP-VERIFY-01), OPS-19 rule 6 (staging first, identical job second), 50_grading.md
snapshot: hauska-factory origin/seat/property-publish 9b27304 (5 ahead of main a70139a, 10 behind) · factory-bastrop-publish gen on image 2c7c6479 (args `--target=staging --county=48021 --skip-pmtiles`) · staging publish run e1b32af8 succeeded 06:17Z (tier 1 61,695 written of 77,799 conformant rows over 10 pages of 8,000, tier 2 61,695; stamp sourceVintage conformant-v1; walk_id null) · verify walk 6350cb8b passed 06:25Z on 5 parcels (gold 48021:34137, three smoke, the broken fixture) with no area sweep · production cortex-api serves LDT b8983157 (main is 6 ahead, all bake CLI or MCP search commits)
owner: planner-run subagent in P:/seat-worktrees/property/hauska-factory-ctx-publish on seat/property-ctx-publish (from origin/seat/property-publish 9b27304). The subagent produces the diff and the test output and hands back; it does not commit, push, deploy, or execute any job. The planner commits, merges, builds, creates secrets, and executes.
---

# CTX card B: sweep walk, walk ownership, production wiring, per county

Date: 2026-08-28  Status: approved

Bastrop is one walk away from production. The staging publish succeeded on the new shape and the walk passed on gold, but the walk covered five parcels with no area sweep, the publish run does not own its walk, and the production path has two guard defects that make it refuse always and pass vacuously at once. This card fixes the path so the identical job can run for six counties on the standing word.

## What the evidence says

**The walk has no sweep.** `runVerifyWalk` walks gold, three smoke parcels, `opts.sweepParcels` (never supplied), and the broken fixture. The card's item 6 requires at least ten more parcels chosen by area sweep, never by sampling one, and A-021 makes a passed sweep walk the precondition for production. The walk does assert `conformant-v1` provenance per layer (BP-CONFORMANT-01) and the broken fixture (BP-VERIFY-01), which is right and stays.

**The publish run does not own its walk.** With `--skip-walk` the publish stores `walk_id` null and the standalone walk never writes back, so `publish_runs.walk_id` is null on both succeeded staging runs.

**The production guard is wrong twice.** `requireStagingSibling` in `src/lib/publish-guards.mjs` finds the county with `SELECT county_fips FROM publish_runs WHERE id = $1` for the production run's own id, but that row is inserted only after the bakes, so the subquery is null and the guard refuses every production publish (`no passed staging sibling`) regardless of state. And `if (walkVerdict && walkVerdict !== "pass")` lets a sibling with no walk through, so once the first defect is fixed an unwalked staging run would authorise production. Over-broad and vacuous in one function.

**The production bake env falls back.** `bakeEnv` sets `DATABASE_URL: env.STAGING_NEONDB_URL ?? env.DEPLOYMENT_DATABASE_URL` for every target, so a production run with the job's current template would bake into the staging branches while stamping production. The job template carries only `STAGING_NEONDB_URL` and `STAGING_HAUSKA_MCP_URL`.

## Acceptance items

1. **Branch current.** Merge `origin/main` (a70139a) into `seat/property-ctx-publish`, resolve conflicts, `node --test` green. The lane's untracked scratch scripts are not carried. If `cloudbuild.publish.yaml` is not what built image 2c7c6479 (the lane's worktree holds an untracked `cloudbuild.publish.bundle.yaml`), make the tracked file the one that builds the publish and walk jobs with the bake bundle, and say so. | check: merge commit in the diff; test output; the tracked build file names both jobs | grade: [ ]

2. **Area sweep in the walk.** `verify-walk --sweep=<n>` (default 12, refuse below 10) selects the sweep by area, never by sampling: the parcels nearest the gold parcel by a rule you state (same situs street in the landing roll, or the nearest by landing geometry, or contiguous prop_ids in one subdivision) read from the Factory landing for the county, so every neighbour in the area is walked and a broken neighbour cannot hide. The walk body records `sweep: { rule, count, parcels }`. A walk with fewer than ten sweep parcels refuses and records why. | check: fixture with a seeded landing of 15 neighbours walks all of them; the under-ten refusal fixture | grade: [ ]

3. **The publish run owns its walk.** `bastrop-publish` without `--skip-walk` runs the sweep walk inline and stores `walk_id`; `verify-walk --publish-run=<id>` writes `walk_id` onto that publish run. A succeeded publish run without a walk is visible as such (`walk_id` null) and is never treated as walked. | check: fixture: publish then standalone walk links; the body shows the link | grade: [ ]

4. **The production guard is right.** `requireStagingSibling` takes the county from flags, requires the most recent succeeded staging run for that county to carry a `walk_id` whose walk verdict is `pass` and whose sweep count is at least ten, and refuses otherwise with a named code (`STAGING_SIBLING_REQUIRED`, `STAGING_SIBLING_UNWALKED`, `STAGING_SIBLING_FAILED`, `STAGING_SIBLING_NO_SWEEP`). The production publish row records `staging_sibling_id`. Verified by violation: fixtures for each refusal and one pass. | check: four refusal fixtures and one pass | grade: [ ]

5. **Production env, no fallback.** `bakeEnv` selects by target: staging reads `STAGING_NEONDB_URL` and `STAGING_HAUSKA_MCP_URL`; production reads `PRODUCTION_NEONDB_URL` and `PRODUCTION_HAUSKA_MCP_URL`; a missing variable for the selected target refuses with `TARGET_ENV_MISSING` before any bake; no `??` chain across targets. `OPERATOR_PUBLISH_GO` stays an execution-time environment override, never a template value; document the exact `gcloud run jobs execute` form in the job's header comment. `cloudbuild.publish.yaml` declares the two production secrets on the job template (`PRODUCTION_NEONDB_URL:latest`, `PRODUCTION_HAUSKA_MCP_URL:latest`); the planner creates the secrets. | check: refusal fixture; the build file diff | grade: [ ]

6. **Per county.** Confirm the job runs for any county the loop has written (`--county=<fips>`): the bakes scope by county, the freshness stamp and `publish_runs` row are per county and target, the staging reset is county-agnostic, and the served county ledger's `published_at` for that county moves. Where a Bastrop-only assumption remains (name, constant, path), remove it; the job name may stay until a rename card. | check: grep for `48021` and `bastrop` in the publish and walk code with each remaining occurrence justified | grade: [ ]

7. **Handback.** Final message to the planner: the diff summary by file, the full `node --test` output, the sweep rule chosen and why, each remaining Bastrop-only occurrence justified, the exact execute commands for staging reset, staging publish with sweep walk, and production publish for one county, and `leave_behind`. No commit, no push, no deploy, no job execution, no write to doc_repo. | check: handback | grade: [ ]

## Do not

- Commit, push, open a PR, deploy, or execute any Cloud Run job; the planner does those.
- Write to any store, staging included; tests use fixtures or an in-process fake.
- Print any DATABASE_URL, secret, or token.
- Change job templates by hand; `cloudbuild.publish.yaml` is the only place a job's command, args, env, or secrets live (A-019).
- Point production at staging branches or staging at production stores, in code or in a test.
- Pass the walk with presence checks; UNMEASURED is the grade for that.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-08-28_ctx-b_cp1.json
  CP2: _inbox/2026-08-28_ctx-b_cp2.json
  CLOSE: _inbox/2026-08-28_ctx-b_close.json
