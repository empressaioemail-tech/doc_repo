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

# A gate that compares two different vintages and a tracer with a blind spot

# CTX-B2 — a gate that compares two different vintages, and a tracer with a blind spot

Repo: `hauska-factory`. Three items, all small, all named precisely by prior lanes.

## Item 1 — the cadRoll expectation has no vintage scope

CTX-HAYS-GATE measured this at source. `CADROLL_EXPECTATION_SQL` in
`src/lib/publish-cadroll-postcondition.mjs` selects prop_ids whose `cad_property` row carries
a real dollar **in any tax year**, while the bake deliberately reads only the county's
declared vintage (`legacy-design-tools` `vintage.ts:58`). **100 percent** of Hays' 38,197
misses are prop_ids with a 2025-only dollar and zero 2026 row.

Its own sampled rate is also misleading: `ORDER BY prop_id ... LIMIT 500` reports 71.0
percent against a true population rate of 22.1 percent, a 3.2x overstatement, because
ascending prop_id lands on exactly the oldest parcels.

Scope the expectation to the declared vintage. Read that vintage from the bake summary, or
from a mirrored constant **guarded by a divergence test** — a constant copied without a
guard is the drift this repo has already paid for twice.

**The trap the operator ruled on tonight (A2), and it binds you.** Vintage-scoping alone
clears the Hays gate by relabelling 37,813 rows as "left the roll". Those rows were **never
on a CAD roll**, so a retirement claim on them is false and would pass every existing check.
**The scoping ships together with a truthful state for rows that were never on a roll, or it
does not ship.** If that truthful state belongs in `legacy-design-tools` rather than here,
report it precisely enough to dispatch rather than inventing one locally.

Hays stays held either way. This lane does not unhold it.

## Item 2 — the module-graph tracer has a bare-specifier blind spot

CTX-PIN2 built `scripts/bake-module-graph.mjs` and the staleness check on top of it, and both
work. But the review found the tracer follows **relative specifiers only**, so
`@workspace/cad-ingest` is not followed into the graph.

That matters directly: a change to `vintage.ts` — the exact file item 1 depends on — would
**not** trip the staleness check today.

Close it. **Required test: a change to `vintage.ts` must fail the staleness check.** Observe
it failing before it passes.

Note CTX-PIN2 also established that of CTX-LEAVES2's three fixes, only the acreage fix is in
the 26-module graph; the `unmeasured`-to-`refused` fix and the prop_id guard are outside it.
If closing the blind spot changes the graph's membership, **say what moved in and what that
implies for pins already taken** — that is a finding, not a footnote.

## Item 3 — the pin, and its ordering dependency

`cloudbuild.publish.yaml` should end up pinned at CTX-B1's merge SHA.

**Check whether CTX-B1 has merged before you touch the pin.** It is live in
`legacy-design-tools` on `fix/ctx-b1-provenance-honest-cadroll` and carries the customer-facing
provenance fix.

- If B1 has merged: pin to its SHA, confirm LDT main is exactly that before and after, write
  the pin comment in the file's established style.
- If B1 has NOT merged: **do not pin to `9873ff11` as an interim.** The operator's chosen
  sequence is B1 first and one bake pass, because the label change is small and a bake pass
  per county is not. Land items 1 and 2, and report the pin as owed with the SHA it is owed
  to.

Never pin to `main`. Confirm the SHA with `gh api` and paste the literal output.

## Verify by violating

Item 1: a parcel with a dollar only in a non-declared vintage must **not** enter the
expectation set. Show the gate's compared/miss counts before and after on real Hays data.

Item 2: the `vintage.ts` test above, failing then passing.

Item 3: if you pin, the staleness check must pass at the new pin and fail at the old one.

## What you must NOT do

**Do not touch `MAX_MISS_RATE` or any threshold.** That gate caught a real data problem.

Do not write a retirement state for rows never on a roll. That is the A2 trap.

Do not deploy, submit a Cloud Build, or run any Cloud Run job, bake, publish or walk. The
integration seat owns every execution.

Do not write to `legacy-design-tools`, `hauska-engine` or `hauska-map`.

CTX-B3 is live in this repo on a separate worktree building the census instrument, and
CTX-TEARDOWN is read-only here. If your work touches the same files, STOP and report the
collision rather than resolving it.

## Close contract

Standard lane close JSON, plus:

- The declared-vintage source you used and the divergence guard on it.
- Hays' compared and miss counts before and after, with the counting rule.
- Whether the truthful-state half belongs here or in LDT, precisely enough to dispatch.
- What closing the tracer blind spot moved into the graph, and what that implies for pins
  already taken.
- The pin: taken and to which SHA, or owed and to which.
- All violation runs.
- `leave_behind`.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-10_ctx-b2_cp1.json
  CP2: _inbox/2026-09-10_ctx-b2_cp2.json
  CLOSE: _inbox/2026-09-10_ctx-b2_close.json
