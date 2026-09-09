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

# One McLennan parcel fails on provenance and nobody has diagnosed it

# CTX-PROV — one McLennan parcel fails on provenance and nobody has diagnosed it

Repo: `hauska-factory`. Scope is one parcel and one rule. It is small on purpose.

## The measurement

McLennan staging walk `4c3d0746`, 2026-09-09T16:39:51Z, on publish image
`sha256:ca82faf3` (jobs gen 32/33, LDT pin `3885efad`):

    pass = 181
    fail = 1     48309:103671   "facets lack conformant-v1 provenance per layer"

This is the only thing between McLennan and a clean staging walk. Every other failure
that county carried this morning cleared when the classifier fix reached the image; five
`zoning not-applicable missing basis` failures went away and this one did not.

It also survived the prior two runs unchanged: walks `9044f5cc` and `2019b91f` both graded
`pass=176 fail=6` with this same parcel and this same message among them. Three runs,
identical result, so it is not a transient and not a race.

## What has NOT been established, and the assumption you must not inherit

The retired planner recorded this in its own unverified-claims section:

> "McLennan's 48309:103671 BP-CONFORMANT-01 failure is the same class as Caldwell's
> 48055:1 (a roll-dropout on the old schema). Basis: PURE INFERENCE from the shared rule
> id. NEVER DIAGNOSED. McLennan has only ONE CAD vintage (2025), so it CANNOT have a
> roll-dropout population -- which means this inference is probably WRONG and this parcel
> needs its own diagnosis."

That self-correction is almost certainly right. McLennan holds a single vintage, so there
is no dropout population for this parcel to belong to. Start from nothing.

Note also that Caldwell's `48055:1` now presents as HTTP 422 while this one presents as a
provenance failure. Different symptoms. Do not assume one diagnosis covers both, and do
not coordinate with CTX-WALKRULE's conclusion; that lane owns the retirement grading and
this one owns this parcel.

## The work

1. Read the rule that emits "facets lack conformant-v1 provenance per layer". Write down
   exactly what it checks, per layer, and what shape satisfies it. That definition does
   not exist in writing anywhere and producing it is half the value of this lane.

2. Read what `48309:103671` actually serves. Fetch the served payload from the staging
   target the walk used (`https://smart-site-factory.vercel.app/site`) and read its
   provenance per layer against the rule from step 1. Name which layer or layers fail and
   what they carry instead.

3. Establish the mechanism. Candidates, none preferred:
   - the bake did not write provenance for this parcel on one or more layers
   - the bake wrote it and the serve strips or reshapes it, as happened with `envelope`
   - this parcel's row predates the conformant bake and was never re-baked
   - the parcel is degenerate in the underlying geometry, as `48055:1` turned out to be
   - the rule is wrong about what conformant provenance looks like

   State the one you chose and one you rejected, with evidence for both.

4. Establish the population. Is this one parcel, or is it the visible member of a class
   the cohort sampler happens to have drawn? Count how many McLennan rows fail the same
   provenance predicate. **This is the most important step.** One parcel is a curiosity;
   a class is a launch blocker, and the sampler biases toward low `prop_id` so a single
   surfaced failure is weak evidence of rarity.

   Run the same count for the other five counties (48021, 48055, 48209, 48453, 48491) so
   nobody has to ask later whether it is McLennan-specific.

5. If the fix is in this repo, make it, with the check observed failing before it passes.
   If the fix is in the bake, which lives in legacy-design-tools, or in the serve, do NOT
   write there. Report it with enough precision that a dispatch can be compiled from your
   close without a second diagnostic pass.

## Do not make it pass by exclusion

If your conclusion is that this parcel should not be graded, that is a named class with a
counting rule and an explicit justification, not a filter. The sampler bias toward low
`prop_id` was deliberately left in place by two prior lanes on the grounds that adjusting
a sampler to avoid a failure it correctly found is sampling around the problem. The same
logic applies to excluding a parcel from a grade.

Do not widen `BP-CONFORMANT-01`. If the rule is genuinely wrong about conformant
provenance, that is a finding with evidence, handed back, not a loosened predicate.

## What you must NOT do

Do not deploy, submit a Cloud Build, or run any bake, publish or walk. The integration
seat owns every execution. Reading a served payload over HTTP is expected and is not an
execution.

Do not write to legacy-design-tools, hauska-engine or hauska-map.

Do not touch `cloudbuild.publish.yaml`'s `_LDT_SHA` pin.

Do not coordinate with or duplicate CTX-WALKRULE, which is live in a separate worktree on
`fix/ctx-walkrule-retired-grading` and owns retirement grading. If you find your fix
touches the same lines, stop and report the collision rather than resolving it yourself.

## Close contract

Standard lane close JSON, plus:

- The provenance rule written out: what it checks per layer, what satisfies it.
- What `48309:103671` actually serves, per layer, verbatim.
- The mechanism you chose, the one you rejected, and the evidence.
- The failing-population count for all six counties with its counting rule.
- If fixed here: both runs. If not: where the fix belongs, precisely enough to dispatch.
- `leave_behind`.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-09_ctx-prov_cp1.json
  CP2: _inbox/2026-09-09_ctx-prov_cp2.json
  CLOSE: _inbox/2026-09-09_ctx-prov_close.json
