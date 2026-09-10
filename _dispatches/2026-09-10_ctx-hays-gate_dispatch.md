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

# The only county nobody has measured and its refusal has never been read

# CTX-HAYS-GATE — the only county nobody has measured, and its refusal has never been read

Repo: `hauska-factory`. **Measurement lane.** A code diff may or may not be warranted; that
is your finding, not your assignment.

## First, a correction to what everyone believes about Hays

Hays' **pre-bake rail gate passes.** Read live 2026-09-10 from `parcel_gate_verdict`:
`48209` has **no refusing rails at all**, while Bastrop and Travis were still refusing on
`schoolDistrict`.

Hays' blocker is the **cadRoll post-condition**, which fires after the bake, not the
readiness gate that fires before it. Those are different gates and the distinction has been
blurred all day.

## Second, a correction to the framing that has been carried since 2026-09-09

The original finding recorded Hays as refusing `CADROLL_RENULLED` at a 22.22 percent
dollar-miss rate, derived as 38,444 / 173,050 — tier1 rows without dollars over all tier1
rows.

**That is not the gate's arithmetic.** `CADROLL_EXPECTATION_SQL` selects only prop_ids
whose `cad_property` row **already carries a real dollar** (`land_value > 0 OR market_value
> 0 OR assessed_value > 0 OR improvement_value > 0`). Its own comment says so:

> A `cad_property` row with no dollar columns populated is a legitimate declared absence
> (Williamson's 282,570 hollow StratMap rows are exactly this), and a baked null against it
> is CORRECT, not a regression.

Parcels with no baked snapshot at all are excluded as `absentSnapshot`, not counted as
misses.

So the 38,060 geometry-only rows CTX-HAYS-SPLIT identified **cannot** be causing this
refusal. The failing population is parcels that **have** dollars in `cad_property`, **do**
have a baked snapshot, and whose snapshot lacks the dollar object. That is a real bake
defect on real accounts, and **nobody has read the list.**

The integration seat carried the wrong framing for several hours and held an operator ruling
that would not have unblocked anything. Do not inherit it.

## The work

1. **Read the actual failing set.** The refusal payload carries `sampled`, `compared`,
   `misses`, `missRate`, `absentSnapshot` and `examples: misses.slice(0,5)`. Get the real
   numbers and the real parcel ids — from a run record, a re-derivation of the gate's own
   query against the store, or both. Say which instrument you used.

2. **Reproduce the gate's predicate exactly**, then count the true failing population for
   Hays. `CADROLL_EXPECTATION_SQL` is `ORDER BY prop_id ... LIMIT`, so the gate sees a
   **sample**, not the population. The sample is ascending-`prop_id`, which biases toward
   low-numbered and degenerate parcels — the same bias that surfaced `48055:1` repeatedly.
   **The sampled miss rate and the true population miss rate may differ substantially, and
   establishing that gap is part of the mission.**

   Note the comment on `DISTINCT` in that file: an undistincted `LIMIT 500` once sampled
   only 309 distinct parcels across two tax years and counted duplicates in both numerator
   and denominator. Do not reintroduce that.

3. **Determine the mechanism.** Why does a parcel with real dollars in `cad_property` bake
   without them? Candidates, none preferred:
   - the bake reads a different vintage than the expectation query;
   - a join that drops the dollar object for a subset;
   - the `situsForBake` skip path, now fixed in LDT `9873ff11` but **not yet in any image**
     — Hays carries 768 punctuation-only situs rows, so some of this population may simply
     evaporate when that pin lands;
   - something else.

   State the mechanism you chose and one you rejected, with evidence.

4. **Say whether it is worth running Hays again first.** The publish image is about to be
   rebuilt on LDT `9873ff11`, which carries both the situs fix and the acreage earned
   absence. If your analysis says Hays' failing set is largely the situs class, the honest
   recommendation may be "re-run after the pin and re-measure" rather than a fix. That is a
   legitimate and valuable answer.

## What you must NOT do

**Do not touch `MAX_MISS_RATE` or any gate threshold.** That gate caught a real data problem
and no code change should paper over it.

Do not backfill, re-acquire, or write anything to `cad_property`. Hays' 2026 roll was
independently confirmed correct by Hays CAD's own 2025 Annual Report (132,538 accounts,
132,358 by category, against our 134,606) — the county is not missing anything and that
question is closed.

Do not deploy, submit a Cloud Build, or run any bake, publish, walk or Cloud Run job. The
integration seat owns every execution and will re-run Hays when you say it is worth it.

Do not write to `legacy-design-tools`, `hauska-engine` or `hauska-map`.

## Traps carried forward, all paid for today

`parcel_gate_verdict` is a **cached** evaluation carrying `evaluated_at`. A verdict read
during a write is meaningless — the integration seat nearly reported a partial impervious
failure off a verdict cached mid-apply.

`runs` has `started_at`, not `created_at`. Dry runs write **no** run row (`runId: null`), so
absence of a row is not absence of a run.

`parcel_record_cell.place_key` is `<fips>:<prop_id>`; `place_layer_snapshots.place_key` is
`node:<fips>:<prop_id>`.

`cad_property` carries multiple tax-year rows per `prop_id`. Hays holds 2025 and 2026.

`cli.mjs` has a code-only catch handler that discards error detail; call the job function
directly to see the real payload.

## Close contract

Standard lane close JSON, plus:

- The real refusal numbers and the example parcel ids, with the instrument named.
- The gate's sampled miss rate versus the true population miss rate, both with counting
  rules.
- The mechanism, the one you rejected, and the evidence.
- A plain yes or no: is it worth re-running Hays after the LDT pin lands, before any fix?
- If a fix is warranted: where, precisely enough to dispatch.
- `leave_behind`.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-10_ctx-hays-gate_cp1.json
  CP2: _inbox/2026-09-10_ctx-hays-gate_cp2.json
  CLOSE: _inbox/2026-09-10_ctx-hays-gate_close.json
