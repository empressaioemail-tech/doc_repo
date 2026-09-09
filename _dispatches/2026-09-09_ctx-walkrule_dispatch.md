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

# The bake writes a retirement the walk has no rule to read

# CTX-WALKRULE — the bake writes a retirement the walk has no rule to read

Repo: `hauska-factory`.

## Why this exists, stated plainly

This is the integration seat's omission, not a lane's. CTX-RETIRE closed on 2026-09-09
having built `recordRetirement` into the LDT bake, and its close handed the integration
seat a six-rule walk implementation under the key `walkGradingRuleProposal`. The
integration seat then rebuilt and pinned the publish image so the bake writes
`recordRetirement`, and never implemented the walk side.

Measured consequence, live: Caldwell staging walk `716c7ad0` at `pass=85 fail=1`, the
survivor being `48055:1` returning HTTP 422. The prediction that the rebuild would clear
it was wrong for this reason.

So the current state is a mechanism that is built, correct, and unreached, which is the
defect class this whole program exists to stop.

## The six rules, from CTX-RETIRE verbatim

Read `_inbox/2026-09-09_ctx-retire_close.json` key `walkGradingRuleProposal` in full
before implementing. Do not work from this summary alone. Summarised here only so you
know the shape:

1. Read `payload.recordRetirement`. Apply `isEarnedRecordRetirement`, exported from
   `nodeFacetBakeTier1Conformant.ts`, rather than a bare truthy check. Same completeness
   discipline as `isEarnedLeafAbsence`.
2. A row where `isEarnedRecordRetirement` is true grades as its own class, `RETIRED`.
   Never a `BP-CONTENT-01` failure, never silently dropped from any denominator. Report
   `retiredCount` alongside `servedCount`, each with its counting rule stated inline.
3. `BP-CONFORMANT-01` is UNCHANGED. A retired row must still carry
   `facetSchemaVersion === 'node-facets-tier1-conformant-v1'`. This is not a new
   tolerance; it is the existing rule finally being satisfiable for this population.
4. `BP-CONTENT-01` is UNCHANGED at the leaf level. No new tolerance there either.
5. Any coverage or completeness metric computed over a county must EXCLUDE retired rows
   from its denominator, or report retired-versus-live as an explicitly separate split.
   Folding a retired account's necessarily-absent facets into a live coverage denominator
   manufactures a false coverage gap.
6. Prove the recognition check can REJECT a malformed marker before trusting it. A
   payload carrying `recordRetirement: {status:'retired'}` with required fields missing
   must NOT grade `RETIRED`. `isEarnedRecordRetirement` already implements that
   rejection; the walk's suite must exercise it.

Rules 3 and 4 are the ones that matter most and they are both instructions NOT to widen
anything. If your diff loosens either check, you have implemented the wrong thing.

## The 422, which you must diagnose rather than assume

`48055:1` currently returns HTTP 422 to the walk. Two mechanisms produce that and they
need different fixes:

**A.** The retirement is being written and served, and the walk has no rule for it, so it
grades a legitimately retired parcel as a failure. Rule 2 fixes it.

**B.** Something else refuses this parcel entirely and the retirement never reached it.
Historically 422 on this program has meant `ACCESS_NOT_DEFAULTED` at the serve guard.

Determine which, with evidence, before implementing. State the mechanism you chose and
the one you rejected. If it is B, rule 2 will not clear this parcel and reporting it as
fixed would be false.

There is a third thing you should know about this specific parcel and it may matter:
CTX-RETIRE found that `48055:1` is not a well-formed single account at all. `txgio_parcel`
holds 203 distinct features sharing `prop_id = '1'`, and 227 sharing `'0'`, almost
certainly sentinel or bucket ids from the `stratmap25-landparcels` ingest rather than a
real CAD account identity. If this parcel is not an account, then whether it should be
graded at all is a legitimate question, and answering it is in scope. Do not make it pass
by excluding it silently; if it should be excluded, that is a named class with a counting
rule.

## The sampler, which you must not touch

The jurisdiction cohort samples `prop_id` ascending, which biases toward low-numbered and
therefore old or degenerate parcels. That is WHY `48055:1` keeps surfacing. It was
deliberately left unchanged by the retired planner, on the grounds that adjusting a
sampler to avoid a failure it correctly found is sampling around the problem. That
judgement stands. Do not change the sampler.

## Verify by violating

Show the new grading failing before it passes, both runs pasted literally, exit codes read
from the process rather than from a pipe. Rule 6 is exactly this and it is not optional.

Additionally: confirm a row WITHOUT `recordRetirement` still grades exactly as it does
today. A change that alters grading for live rows is out of scope and is a regression.

## What you must NOT do

Do not widen `BP-CONFORMANT-01` or `BP-CONTENT-01`.

Do not exclude any parcel from a denominator without naming the class and its counting
rule.

Do not deploy, submit a Cloud Build, or run any Cloud Run job, bake, publish or walk. The
integration seat rebuilds the image from your merged main and runs the counties.

Do not write to legacy-design-tools, hauska-engine or hauska-map. `isEarnedRecordRetirement`
lives in LDT and reaches this repo through the pinned `_LDT_SHA`, currently `3885efad`.
Import it; do not reimplement it.

Do not touch `cloudbuild.publish.yaml`'s pin.

## Close contract

Standard lane close JSON, plus:

- The 422 mechanism, the one you rejected, and the evidence.
- The disposition of `48055:1` specifically, including whether it should be graded at all.
- Both runs of the rule-6 malformed-marker check.
- Proof that non-retired rows grade unchanged.
- `retiredCount` and `servedCount` counting rules as you implemented them.
- `leave_behind`.

Report the merge commit. The integration seat rebuilds and re-runs Caldwell from it.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-09_ctx-walkrule_cp1.json
  CP2: _inbox/2026-09-09_ctx-walkrule_cp2.json
  CLOSE: _inbox/2026-09-09_ctx-walkrule_close.json
