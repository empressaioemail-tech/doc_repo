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

PLAN-ROW: P-124 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: hauska-factory

# The bake is behind the serve, and a live job's build config is untracked

# CTX-BUILD — the bake is behind the serve, and a live job's only build config is untracked

Three items in `hauska-factory`. They are one lane because they all gate the same
thing: a publish image that can be trusted to bake what the serve projects.

## Context you need and must not take on my word

The outgoing CTX planner was retired 2026-09-09. Its close is
`_inbox/2026-09-09_ctx_planner_retirement_close.json` and its section 8 lists eleven
claims it believed but did not measure. Read that section before you start. The
integration seat has since resolved three of them by direct measurement; the rest
stand as unverified.

Do not treat any number in this mission as established. Re-measure each one and
report agreement or disagreement. Disagreement is a finding, not a failure.

## Item 1 — rescue the orphaned build config

`cloudbuild.parcel-r5-zoning.yaml` is an untracked file in the worktree
`P:/tmp/ctx-w2-gate` (branch `work/bake`, which belongs to another registration and
which you must NOT check out or modify). It is the only copy of the Cloud Build config
that created and deploys the Cloud Run job `factory-parcel-r5-zoning`.

Verified by the integration seat 2026-09-09: that job is live in
`hauska-prod-497015` / `us-east4` at generation 1, image digest
`sha256:795e0e78bc078c2b`, from Cloud Build `64450772` at `2026-09-09T05:22:01Z`.
Nothing in any repo can currently rebuild or audit it.

Copy that file into your own worktree and commit it. Read it first; do not transcribe
it from anything but the file itself. It is 85 lines and its header explains why it
exists.

Verify by violating: before you commit, confirm the file is absent from `origin/main`
(`git cat-file -e origin/main:cloudbuild.parcel-r5-zoning.yaml` must fail). After the
merge, confirm it is present. If it turns out to already be tracked, stop and report
that, because it would mean the retirement close was wrong about the most important
item in it.

## Item 2 — the publish pin is three commits behind, and the bake is behind the serve

`cloudbuild.publish.yaml` pins `_LDT_SHA: 301bb75ac3f287a424d859dfa86e6d4e89b75529`.

Measured by the integration seat 2026-09-09 against the GitHub API, not from a doc:
legacy-design-tools `main` is `3885efadb789942a479b475d34d1518807756e0a` with nothing
ahead of it, and `301bb75a...3885efad` is `ahead_by=3`:

    3c3c243d  2026-09-09T01:18:59Z  fix(deploy): Smart Site MCP export env vars survive redeploy (#645)
    69de8fe6  2026-09-09T04:38:37Z  fix(zoning): project the rail's own refused state, not the generic fallback (#646)
    3885efad  2026-09-09T13:13:58Z  fix(P-124/CTX-retire): declared record retirement for an account absent from the current CAD roll (#647)

Two of those matter and the second one is the reason this is urgent rather than tidy.

`69de8fe6` is CTX-MIRROR. Production `cortex-api-00754-feg` is ALREADY built from it.
So the serve projects the rail's own refused state while the bake, pinned to
`301bb75a`, does not write it. **The bake is behind the serve on the exact field the
zoning walk grades.** Any BP-CONTENT-01 result taken on the current pin is measured
with a bake and a serve that disagree.

`3885efad` is CTX-RETIRE, which adds `recordRetirement` to
`nodeFacetBakeTier1Conformant.ts`. The integration seat confirmed `recordRetirement`
appears zero times in hauska-factory `main` at `004236d2`, which is expected because
it lives in LDT and reaches the image only through this pin.

Bump the pin to `3885efad`. Before you do:

1. Confirm LDT `main` is still exactly `3885efad`. If it has moved, STOP and report
   rather than pinning to a SHA nobody named. Do not pin to `main`.
2. Read what each of the three commits changes. Pin comments in this file are
   substantial by convention; write one that says what is being picked up and why,
   in the style of the two comments already there.
3. State explicitly in your CP2 whether `3c3c243d` (the smartsite-mcp env fix) has any
   effect on the bake. The integration seat believes it does not and that belief is
   UNVERIFIED.

## Item 3 — the reachability instrument, named by the repo's own file

The header of `cloudbuild.parcel-r5-zoning.yaml` names this and it is the third
distinct layer of the same class this program keeps hitting:

> `test/writer-cli-reachability.test.mjs` asserts every allowlisted writer has a
> `cmd === "<id>"` branch in `cli.mjs`, which this job HAS. Having a CLI command and
> having somewhere to execute it are different questions, and only the first is
> checked.

Add the second check. A writer that is allowlisted and CLI-dispatchable must also have
a deployable target: a `cloudbuild.*.yaml` that deploys a Cloud Run job for it, or an
explicit declared exemption with a reason.

This must FAIL before it passes. Demonstrate it by removing (in your working tree only,
not committed) the config for a writer that has one, showing the test go red, and
restoring it. Paste both outputs. A test observed only passing has not been observed
working.

Do not make it pass by widening the allowlist. If a writer genuinely has no deployable
target and should not have one, that is a declared exemption with a written reason, and
the count of exemptions goes in your close.

## What you must NOT do

Do not run any Cloud Run job. Do not submit any Cloud Build. Do not deploy anything.
Do not run a bake, a walk, or a publish. The integration seat owns every execution and
deploy on this program and will rebuild the image from your merged main.

Do not touch `P:/tmp/ctx-w2-gate`. Read the file out of it if you must, but never check
out a branch there, never commit there, and never delete its untracked files. Three of
them are debris (`_cty.mjs`, `_shapes.mjs`, `_sz.mjs`) and are not yours to clean.

Do not write to legacy-design-tools, hauska-engine, or hauska-map.

## Close contract

Standard lane close JSON at the auto-named path. In addition to the usual sections:

- The before/after `git cat-file` proof for item 1.
- The literal `gh api` output you used to confirm LDT main for item 2, not a summary.
- Both the failing and passing runs of the new instrument for item 3.
- Any disagreement with a number in this mission, stated plainly.
- `leave_behind`, including the count of declared exemptions from item 3.

Report the merge commit. The integration seat rebuilds and runs the counties from it.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-09_ctx-build_cp1.json
  CP2: _inbox/2026-09-09_ctx-build_cp2.json
  CLOSE: _inbox/2026-09-09_ctx-build_close.json
