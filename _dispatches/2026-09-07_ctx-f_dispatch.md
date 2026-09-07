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

# CTX-F dispatch

# CTX-F — factory readiness, and the gate that makes one bake true

## Context you need before anything else

The factory bake is real and has run: Cloud Run job `factory-bastrop-publish` in
`hauska-prod-497015`, 25 executions between 2026-08-28 and 2026-08-30, all six Central Texas
counties published to production. Last execution 2026-08-30T06:34:30Z. It bundles four LDT
CLIs built by `scripts/build-publish-bake-clis.mjs` into `Dockerfile.publish`.

The operator has reversed A-027's "one bake; do not rebake" for this sprint. The bake will run
again. Your lane makes that safe.

## 1. THE PRE-BAKE READINESS GATE. This is the most important thing you build.

"One bake" is only true if the bake refuses to run against an incomplete dataset. Otherwise it
means one bake of whatever happened to be ready, which is what forced the last re-bake.

Build a per-county, per-rail gate that REFUSES the bake unless every rail is either populated
or carries a declared honest absence. `unaccounted` is legitimate at rest and fatal at publish.
Both halves are load bearing: if it stops being fatal it becomes cover, and if it stops being
legitimate the pressure moves to fabricating values.

It must answer the three-question test in its own output: what executes it, what triggers it,
and what fails when it is violated. If any answer is "a human remembers", it is not a control.
And name what bypasses it, because the answer is rarely none.

Verify it by violation: run it against a county with a deliberately unaccounted rail and
confirm it refuses. A gate observed only passing has not been observed working.

Other lanes will send you rail names and check shapes: CTX-C for the cadRoll rails, CTX-D for
geometry and footprint absences, CTX-G for the ledger rails. Collect them.

WATCH FOR: never let `unaccounted` be converted to `absent-verified` to clear your gate.
`absent-verified` is a claim that something looked. Writing it where nothing looked is a lie
that passes every check. If unaccounted counts fall without a matching acquisition landing,
that is relabelling.

## 2. Fix staging, which cannot currently run

`factory-staging-reset` requires `NEONDB_NEON_PROJECT_ID`, `NEONDB_NEON_PARENT_BRANCH_ID`,
`HAUSKA_MCP_NEON_PROJECT_ID` and `HAUSKA_MCP_NEON_PARENT_BRANCH_ID` and throws without them.
Generation 25 of the job template carries NONE of them; the two successful executions, both
2026-08-27, received them as execution-time overrides. The recorded values
(`fancy-fire-06136146`, `br-crimson-feather-aphfmy91`) are eleven days old. RE-DERIVE them, do
not paste them. Six stale staging branches were deleted on 2026-08-28.

Then automate the secret rotation. `staging-reset` writes branch ids and hosts into
`staging_targets`, but the bake reads its URLs from Secret Manager and NOTHING closes that
loop. It is a hand step with no code path. Strip any `-pooler` suffix; `src/db/connect.mjs`
refuses pooler hosts outright.

Rule 6 of OPS-19 is that a production publish with no passed staging sibling refuses. That
rule is real and it is currently unenforceable because staging cannot run.

## 3. The stale sibling check

`STAGING_SIBLING_SQL` orders by completion date and takes the newest with no time filter at
all, so a production publish today would be satisfied by a 2026-08-29 sibling. That is a real
gate with a hole in it. Add a recency bound.

## 4. Bump the pin

`cloudbuild.publish.yaml` pins `_LDT_SHA` to `65f924e8` (LDT PR #578, 2026-09-01) and
`_CONTRACT_VERSION` to `1.30.0`. LDT main is 110 commits ahead and the atom contract published
1.31.0. The four bundled entry blobs are byte-identical across that gap, but nobody has walked
the transitive import closure, so do not assume the bundle is current. Establish it, then bump.

## 5. Exclude Tier-2

`nodeFacetBakeTier2ConformantCli.ts` writes a literal `{flood: null, envelope: null,
source: "conformant-v1-tier2-stub"}` and writes `PLACE_COORD_SENTINEL = "0.00000"` for every
row with no guard. Running it would null roughly 18,100 real flood facets across four counties
(Bastrop 16,104, McLennan 1,165, Hays 768, Caldwell 63) and stamp Null Island coordinates
everywhere. Exclude it from this bake. Whether the legacy Tier-2 bake is retired outright is an
operator ruling, not yours; flag it, do not decide it.

## 6. Two facts to record, not necessarily to fix

Nothing serializes bakes. There is no lease and no advisory lock in the publish path, and
`STORE_TOKEN_HELD` in the doc_repo queue has been dead code since 2026-09-01 while three
documents still describe it as live. One execution per county is discipline, not enforcement.

The bake writes no durable run record beyond snapshot rows and stdout counts. A count is not a
record; nothing names the parcels acted on, and refusals leave no name at all.

## Acceptance

The readiness gate exists, is armed, is triggered by the publish path, refuses a county with an
unaccounted rail, and has been proven to refuse by construction; staging-reset runs from its own
template without execution-time overrides; the secret rotation has a code path; the sibling
check has a recency bound; the pin question is answered with evidence; Tier-2 conformant cannot
run in this bake.

## Do not

Do not run a production bake. Do not deploy to production. CTX-G owns the ledger rails and
`county_facet_coverage`; coordinate, do not overlap.

## Standing rules for this lane

Repo: hauska-factory. Worktree: P:/tmp/ctx-f-readiness. Branch: feat/ctx-f-bake-readiness. Work ONLY there. If you are in another
seat's checkout, stop and say so; do not work around it.

You commit your own repo. You do not touch doc_repo. If you fan to subagents they hand you
artifacts and you commit; they never touch git.

Program is P-124, the Central Texas completion sprint. Lane CTX-F. Coordination seat is
doc-repo-26 (integration). Report to it, not to another lane.

DEPLOY RULE, binding: production deploys of legacy-design-tools and hauska-engine route
through doc-repo-26 during this sprint and every deploy names its commit. Six lanes land to
those two mains and a deploy ships whatever is there. Do not shift traffic on your own.

Anything you find that is real and outside your scope: report it, do not fix it. Another lane
probably owns it.

Every claim you return names its instrument. A merged PR is not a deployed change and a
deployed change is not a serving one; only `git merge-base --is-ancestor <merge-commit>
<served-commit>` proves a fix is in what serves. Read Cloud Run traffic from JSON by field
name, never a positional --format=value(), because a blank field shifts every column.

If a check returns the answer you expected, interrogate the instrument before believing it.
Pre-register what result would prove your check wrong. If no result would, it is not a check.

## Close

Declare `leave_behind` in your close, even if the answer is `none`. It is required regardless.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-07_ctx-f_cp1.json
  CP2: _inbox/2026-09-07_ctx-f_cp2.json
  CLOSE: _inbox/2026-09-07_ctx-f_close.json
