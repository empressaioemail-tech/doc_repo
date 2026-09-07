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
repo: legacy-design-tools

# CTX-B dispatch

# CTX-B — setback truth: reconcile, repair, then repoint

## What you own

`packages/adapters/` in hauska-engine for the duration of this sprint, and the setback tables
in legacy-design-tools and hauska-setback-corpus. Another program's lane (R-03) was told to
scope to resolvers inside `engine-core` and route adapter changes to you.

There are FOUR copies of the setback tables and they disagree: LDT's vendored
`lib/adapters/src/local/setbacks/` (28 tables, serves the LDT request-time envelope route),
hauska-engine's `packages/adapters/src/local/setbacks/` (14 tables, now a frozen baseline),
the published `@empressaio/setback-corpus` 1.0.1 (30 tables, what hauska-engine actually
resolves since PR #399), and a fourth in hauska-map at
`api/_lib/codified-setback-from-zoning.ts` carrying exactly four tables (austin, elgin,
pflugerville, san-antonio) that serves Property Explorer, the customer surface.

Do the work in this order. The order is the point.

## 1. Round Rock reconciliation — operator-ruled, do not re-litigate

Operator ruled 2026-09-07: take the corpus derivation with LDT's breadth. Concretely:

`side_corner_ft` uses the CORPUS derivation (50/30/20/15), which is grounded in Section 1-50's
rule that all street-abutting lot lines are front lot lines. LDT's 20/5/5/5 mirrors the base
side setback, which is an assumption, and it is the permissive direction, which for a
buildable envelope is the dangerous one.

District breadth uses LDT's ten districts, not the corpus's four, so six districts do not fall
to absence.

SF-3 is NOT resolved by picking. The two files read different sub-columns of the same chart
cell (Standard-Lot against zero-lot-line) and a GIS code of "SF-3" cannot tell you which
applies. Refuse rather than pick, and record why.

Also reconcile the `max_height_ft` non-binding sentinel, which is 100 in one file and 999 in
the other, both flagged `not_specified: true`. A correct reader ignores the number; a reader
that drops the flag gets two different wrong answers. Prefer a type that cannot express the
bad state over a convention.

## 2. The Kyle regression — repair before you repoint

Sequence, all 2026-09-07 UTC. 01:59, engine PR #393 relabelled Kyle to
`primary-source-verified` across 5 districts after live-verifying `kyle_tx` has ZERO
code-section atoms, and stripped fabricated `atom_did` values. 14:09, the corpus merge took
engine's Round Rock and Waco but LDT's Kyle. 16:38, engine PR #399 repointed onto the corpus.

Net: engine's runtime Kyle is back to `human-verified` on values with no atom corpus behind
them, the exact overclaim #393 removed fourteen hours earlier, plus four districts
(R-3-1, R-3-2, RS, M-2) engine never reviewed.

## 3. Fix the test that could not catch it

`corpus-divergence.test.ts` iterates `for (const vendoredDistrict of vendored.districts)`,
which is one-directional, so corpus districts absent from the baseline are never examined.
Its own docstring excludes `verification_state`, `confidence`, `atom_did` and quote from
comparison. Both halves of the Kyle regression land exactly in that blind spot. It is a
presence-shaped check wearing a consistency check's clothes.

Make it symmetric on the district set (set equality, not one-way containment) and assert
provenance monotonicity: a repoint may never weaken a `verification_state`.

Then verify it by violation. Construct a corpus table with an extra district and a weakened
verification state and confirm the test FAILS. A check observed only passing has not been
observed working.

## 4. Author `waco-tx.json` into LDT

McLennan is the only county in the six with zero setback coverage. Waco is wired for zoning
and has 6,332 staged district polygons across 21 distinct codes, and `waco-tx.json` exists in
hauska-engine and in the corpus but NOT in LDT (confirmed: LDT's directory holds 28 JSON
tables and Waco is not among them). McLennan has 48,431 parcels carrying a real zoning
district and 0 `setback-rule` atoms and 0 buildable envelopes as a direct consequence. One
table, highest return in the set.

## 5. Port `gate.ts`, PROVE it runs, then repoint. Not the other order.

`lib/adapters/src/local/setbacks/gate.ts` is the setback-extraction acceptance gate. It blocks
on missing or fabricated citations, missing districts and missing verification state. It did
NOT port into the published package, which has `index.ts` and `schema.json` and no gate.

Repointing consumers and deleting the vendored copy before porting the gate destroys the only
executable governance in this pipeline. Correct order: port the gate into the corpus, prove it
runs there by failing it on a known-bad table, repoint, divergence-test every table, THEN
retire. Pin `^1.0.1`; 1.0.0 lacks the `elgin-tx` alias and silently null-resolves Elgin.

Note also: `runSetbackGate` currently has no runtime caller in LDT outside tests. An exported
detector nothing calls in a gating position is a starved mechanism. Fix that or say plainly
that it is still starved.

## Acceptance

Round Rock serves one reconciled table with the ruled derivation and LDT breadth and an honest
SF-3 refusal; Kyle's provenance matches what its atom corpus actually supports; the divergence
test fails on a constructed violation in both new dimensions; `waco-tx.json` resolves in LDT;
the gate runs inside the corpus and fails a known-bad table; consumers repointed with a
divergence test passing across all tables.

## Do not

Do not touch `lib/cad-ingest` (CTX-A) or the cad-roll paths in `artifacts/api-server` (CTX-C).
Do not deploy. Do not run a bake.

## Standing rules for this lane

Repo: legacy-design-tools + hauska-engine + hauska-setback-corpus. Worktree: P:/tmp/ctx-b-setbacks. Branch: feat/ctx-b-setback-truth. Work ONLY there. If you are in another
seat's checkout, stop and say so; do not work around it.

You commit your own repo. You do not touch doc_repo. If you fan to subagents they hand you
artifacts and you commit; they never touch git.

Program is P-124, the Central Texas completion sprint. Lane CTX-B. Coordination seat is
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
  CP1: _inbox/2026-09-07_ctx-b_cp1.json
  CP2: _inbox/2026-09-07_ctx-b_cp2.json
  CLOSE: _inbox/2026-09-07_ctx-b_close.json
