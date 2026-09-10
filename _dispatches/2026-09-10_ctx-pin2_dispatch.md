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

# The same seam the second time today, plus the mechanism that would have caught it

# CTX-PIN2 — the same seam, the second time today, plus the mechanism that would have caught it

Repo: `hauska-factory`. Two items. The pin bump is one line; the check is the point.

## Item 1 — the pin

`cloudbuild.publish.yaml` pins `_LDT_SHA: 7a739849`. LDT main is `9873ff11`, which is
CTX-LEAVES2 (PR #649) and carries three fixes the bake needs:

- `baseFacts.acreage` earned absence, closing a bare null on **291,231 of 1,516,110**
  baked cells across the six counties;
- `unmeasured` to `refused` at `verdictLayerServe.ts`, implementing
  `_decisions/2026-09-01_serve_path_never_emits_pipeline_state.md` at a call site where it
  had never been implemented;
- a `prop_id` shape guard against the `PRIVATE ROAD` class.

Four counties are held behind this: Bastrop and Travis fail their walks on the acreage
class, Williamson fails on both acreage and `unmeasured`, and McLennan is passing but
should be re-verified on the same image before production.

Bump it to `9873ff11`. Before you do:

1. Confirm LDT main is still exactly `9873ff11`, before pinning and again at close. If it
   has moved, STOP and report rather than pinning to a SHA nobody named. Never pin to
   `main`.
2. Write a pin comment in the file's established style saying what is being picked up and
   why. There are three such comments already; match them.
3. **Prove the change reaches the bake, do not assume it.** `Dockerfile.publish` copies
   only `/ldt/node_modules` and `/app/bakes`, and `/app/bakes` is an esbuild bundle over a
   26-module graph. CTX-PIN built and validated a tracer for exactly this and found that an
   earlier commit the integration seat claimed was urgent did **not** reach the bake at
   all. Re-run that tracer. Note CTX-PIN also found the entrypoint count is five, not the
   four an older comment claims.

## Item 2 — the check, and why the obvious version is worse than nothing

This is the second time today this seam has held up the same counties. The first time,
CTX-SITUS-SKIP merged, the pin stayed put, and Caldwell and McLennan both failed on a fix
that was merged and unreachable. The only mechanism holding it is a person noticing.

**Do not write a check that fails whenever the pin differs from LDT main.** The pin is
supposed to lag sometimes — you pin deliberately, and most LDT commits never touch the
bake. A check like that fires constantly, and a control that blocks work it was never meant
to reach teaches the fleet to use the bypass flag. That is the over-broad-control failure
`ENFORCEMENT.md` names specifically, and it is worse than the gap it closes.

**Write the meaning-shaped version instead**, using the tracer that already exists:

> If any commit between the pinned `_LDT_SHA` and LDT main touches a file **inside the
> bake's module graph**, fail. Otherwise pass.

Two independently derived inputs — the pin, and the graph — asked whether they agree. It
fires only when the divergence actually matters to the bake.

Decide deliberately whether it runs in CI or as a script, and say why in your close. A CI
job needs network access to reach LDT, which may or may not be available in that context;
if it is not, a script that a person or a job runs is honest and a CI check that silently
cannot reach the network is the dormant-mechanism failure. **Establish which, rather than
assuming CI works.**

Also add the shape guard CTX-PIN reported as absent: nothing validates `_LDT_SHA` is even a
real 40-character hex SHA. The deploy digest has a regex guard; the pin does not. A
malformed pin sails through.

## Verify by violating

The staleness check must be shown failing before it passes. Point it at a pin you know is
behind on a bake-graph file — `7a739849` against `9873ff11` is exactly that pair, since
CTX-LEAVES2 touches `nodeFacetBakeTier1Conformant.ts` — and show it fail. Then show it pass
at the new pin. Both outputs pasted literally, exit codes read from the process, not a
pipe.

Then show it **passing** on a divergence that does not touch the bake graph, so it is not
simply "pin differs from main" wearing a better name. If you cannot construct that case
from real history, say so and explain what you did instead.

The shape guard must reject a malformed value and admit a real SHA.

## What you must NOT do

Do not deploy, submit a Cloud Build, or run any Cloud Run job, bake, publish or walk. The
integration seat rebuilds from your merged main and runs the counties.

Do not write to `legacy-design-tools`, `hauska-engine` or `hauska-map`.

Do not touch any ceiling, `assertResidueWithinDeclaration`, the rail gate, or
`BP-CONTENT-01`.

Do not bump `cloudbuild.parcel-r5-zoning.yaml`'s `_LDT_SHA`. It is three commits stale and
that is a **false provenance label rather than a stale dependency** — the plain
`Dockerfile` never fetches LDT, so `LDT_SHA` there is `ARG` to `ENV` and nothing more.
Worth recording in your close as a follow-on; not worth changing in a lane that gates four
counties.

## Close contract

Standard lane close JSON, plus:

- The literal `gh api` output confirming LDT main at pin time and at close.
- The module-graph trace result for `9873ff11`, with the method stated.
- Where the staleness check runs, and the evidence that it can actually reach LDT there.
- All violation runs: check failing, check passing, check passing on a non-bake-graph
  divergence, guard rejecting and admitting.
- `leave_behind`.

Report the merge commit. Four counties are waiting on it.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-10_ctx-pin2_cp1.json
  CP2: _inbox/2026-09-10_ctx-pin2_cp2.json
  CLOSE: _inbox/2026-09-10_ctx-pin2_close.json
