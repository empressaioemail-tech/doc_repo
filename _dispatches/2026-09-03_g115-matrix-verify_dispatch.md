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

PLAN-ROW: G-115 (90_operations/OPS-17_govtech_stack_plan_of_record.md)
repo: plan-review

# G-115 item 2: live matrix run under bastrop_tx

---
id: 2026-09-03_g115_matrix_verify_mission
title: Mission — G-115 item 2 (live matrix run under bastrop_tx)
status: active
last_updated: 2026-09-03
applies_to: plan-review
owner: nick
related:
  - _inbox/2026-09-02_bastrop_permitflow_islandcut_WDLL
  - 90_operations/OPS-17_govtech_stack_plan_of_record
  - _inbox/2026-09-02_g115_tenant_and_icc_wiring_mission
  - _inbox/2026-09-03_g115-tenant-icc_close
---

# Mission: G-115 item 2 — live matrix run under the real Bastrop tenant

Start card: `_inbox/2026-09-02_bastrop_permitflow_islandcut_WDLL.md` (approved 2026-09-02). Items 1, 4, 5 are MET (A-108) — the `bastrop_tx`/`staff` persona is live with cross-tenant refusal proven, and IBC live-citation wiring works. This mission covers item 2 only: re-verifying that UDC edition selection and citation resolve correctly THROUGH that real tenant, on a real Bastrop parcel — not `template-city`'s fixture parcels, and not the mechanism-only proof item 1/4 already gave.

## Standing constraints (binding, unchanged from the card's approval — do not violate)

1. **Live Bastrop (`smartcity-os`, `smartcityos.io`, PermitFlow) stays 100% live and untouched.** Nothing here touches that repo or service.
2. **Additive only.** This mission creates plain engagement records through the existing, already-shipped intake path — the same path any real user hits. No schema change, no new endpoint, no touching `CODE_BOOKS`/`AVAILABLE_EDITIONS`/`buildCitation()`/the absence taxonomy.

## What "done" actually means here — read this before running anything

**A real, source-checked correction to the WDLL's literal wording, not an assumption:** the WDLL's check for this item asks for "a genuine Pass or Fail on `14-02-003`/`14-02-008`." Read `src/mcp.mjs`'s `matrixFromChain` (lines ~303–343) before treating that as two adjudicable rows — it is not. `14-02-003` (district requirements / front setback) is wired to `adjudicateMinimumSetback()` and genuinely reaches Pass or Fail. `14-02-008` (permitted-use table) has **no adjudication logic at all**, by explicit design (`src/mcp.mjs`'s own comment: "not a fabricated Pass" — `Uncertain` is reserved for a genuine authority conflict per the transaction contract, missing adjudication logic is honestly `Unchecked`). `14-02-008` will correctly return `Unchecked` with a real, structured citation and a real typed-absence basis every time, regardless of tenant or parcel — that is not a defect to chase.

So the honest target for this item: a genuine Pass **or** Fail on `14-02-003` (both reachable, per `adjudication.test.mjs`'s existing coverage — pick one or demonstrate both), plus confirmation that `14-02-008` returns its expected real-citation Unchecked row, not a fabricated determination and not `SOURCE_UNAVAILABLE`. If you find this reading wrong, stop and report rather than silently reinterpreting the WDLL text back to its literal form.

## Steps (verify by violation — actually make the calls, don't infer from code review)

1. **Resolve the live serving URL before assuming the one below is still current:**
   `gcloud run services describe plan-review --project plan-review-505715 --region us-east1 --format='value(status.url)'`
   (Last known, per the 2026-09-03 g115-tenant-icc close: `https://plan-review-ozx33wafia-ue.a.run.app`, revision `plan-review-00014-bbg` @100%. Confirm current before trusting it.)

2. **Create a real engagement under the Bastrop persona**, using the same real Bastrop parcel already proven live under G-108's own walk (A-095: `48021:34737`, Bastrop County FIPS 48021 — a parcel identity, not tenant-scoped, safe to reuse under a different persona):
   `POST /api/plan-review/engagements` — body `{"orgId":"bastrop_tx","userId":"staff","parcelNodeId":"48021:34737","projectType":"setback-review","scope":"G-115 item 2 live verification"}`
   Confirm the response's `orgId` is `bastrop_tx`, not `template-city` — this is the one thing item 1 proved the mechanism CAN do; this call is the first time a real caller actually did it for this specific check.

3. **Declare the Bastrop UDC edition, with a proposed value that should Pass** (this parcel's real `setback-rule.front` minimum was 25 ft per A-095's live read; unchanged since, but confirm rather than assume if the value returned in step 4 disagrees):
   `POST /api/plan-review/engagements/<id>/edition` — header `x-persona: bastrop_tx/staff` — body `{"editionId":"bastrop_tx-bdc-2026-adopted","proposedSetbackFrontFt":30}`
   Reject the response if `editionId` isn't accepted (400 `unknown_edition`) — should not happen, but don't skip checking.

4. **Run the matrix and inspect the two real rows:**
   `GET /api/plan-review/engagements/<id>/matrix` — header `x-persona: bastrop_tx/staff`
   Confirm on the `14-02-003` row: `determination` is `"Pass"`, `absence` is `null`, and `bookId`/`editionId`/`sectionId` are populated (not fabricated — cross-check `editionId` equals `bastrop_tx-bdc-2026-adopted`, `bookId` equals `BASTROP-UDC`). Confirm on the `14-02-008` row: `determination` is `"Unchecked"`, `citation` is a real non-null string (proves the citation path resolved even though no Pass/Fail exists here), and `absence.status` is `UNCHECKED` — not `SOURCE_UNAVAILABLE` (which would mean the tenant/persona context broke something item 4 already fixed).

5. **Prove Fail is also reachable, not just Pass** (a second engagement, or re-declare the edition on the same one with a below-minimum value — check whether `setEngagementEdition` allows re-declaration before assuming):
   Repeat steps 2–4 with `proposedSetbackFrontFt: 15`. Confirm `14-02-003` now returns `determination: "Fail"`, `absence: null`, and a `detail`/`analysis` string naming the actual proposed and required values (not a generic message).

6. **Do not touch item 3 or item 6.** Item 3 (coverage measurement) depends on this item landing first and is a separate, larger mission. Item 6 is the operator's own action.

## Close

Report per the standing dispatch/close-artifact convention. If the Pass/Fail-on-both-sections reading above turns out to be wrong (i.e., you find real adjudication logic on `14-02-008` this mission missed), name that explicitly as a correction, not a silent reinterpretation.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-03_g115-matrix-verify_cp1.json
  CP2: _inbox/2026-09-03_g115-matrix-verify_cp2.json
  CLOSE: _inbox/2026-09-03_g115-matrix-verify_close.json

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-03_g115-matrix-verify_cp1.json
  CP2: _inbox/2026-09-03_g115-matrix-verify_cp2.json
  CLOSE: _inbox/2026-09-03_g115-matrix-verify_close.json
