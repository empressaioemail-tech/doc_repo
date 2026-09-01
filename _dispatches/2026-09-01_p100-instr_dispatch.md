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

PLAN-ROW: P-100 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: legacy-design-tools

# Share-loop and funnel instrumentation (affiliate launch gate)

---
id: 2026-08-31_p100_share_and_funnel_instrumentation_WDLL
title: WDLL — P-100: share-loop and funnel instrumentation, the affiliate launch gate
date: 2026-08-31
last_updated: 2026-08-31
status: open
applies_to: legacy-design-tools (cortex-api gtm_events), hauska-map (property-explorer emitters)
plan_row: P-100
depends_on: _decisions/2026-08-31_ctx_gtm_rulings.md ruling 3, _smartsite_gtm/01_central_texas_gtm_strategy.md, _inbox/2026-08-10_smartsite_humanless_gtm_handoff.md items 5-7
operator_go: 2026-08-31 ("assign p100")
snapshot: planner read origin/main read-only 2026-08-31 — legacy-design-tools 394424f2, hauska-map fbda04aa
owner: property seat (lane planner); planner verifies and commits doc_repo
---

# P-100 share-loop and funnel instrumentation

Date: 2026-08-31  Status: open

This card is the declared gate on affiliate link distribution (`_decisions/2026-08-31_ctx_gtm_rulings.md` ruling 3). Until it closes, affiliates may be recruited and kits written, but no link goes out.

## Start from this correction, not from the old doc

`_inbox/2026-08-24_track_coverage_map_DRAFT.md` says the funnel events are not wired and `76h` describes them as a plan. **Both are stale.** A read of `origin/main` on 2026-08-31 found the infrastructure already exists: `lib/db/src/schema/gtmEvents.ts`, `gtmConsent.ts`, `artifacts/api-server/src/lib/recordGtmEvent.ts` with many live call sites across `brokerageBilling.ts`, `brokerageBrief.ts` and `brokerageBuyBoxTeacher.ts`, a `gtmClient.ts` emitter in the PE app, and `share_created` / `share_viewed` emitted from `brokerageWorkspace.ts:480` and `:129`.

This card is therefore NOT a build from zero. It is measure, then close the named gaps. A lane that rebuilds an existing writer fails this card.

One gap is already established by a repo-wide read and does not need re-measuring: **sharer attribution does not exist.** `sharerUserId`, `referredBy`, `attributedTo`, `referrerUserId` return zero hits across `artifacts/` and `lib/db/`. A recipient who signs up is not credited to the sharer anywhere.

One suspicion is NOT established and item 1 settles it: the known `share_created` / `share_viewed` emitters live in `brokerageWorkspace.ts`, which is the brokerage workspace surface, not necessarily the Smart Site `/share#token` plane served by `pe-share-view.ts`. Events firing on the wrong surface would read as instrumented while measuring nothing about the Smart Site share loop.

## Done looks like

A named person can answer, from a query rather than from a narration: how many shares were created last week, how many were viewed, how many viewers signed up, which sharer each signup belongs to, and what fraction of new accounts arrived by share versus affiliate versus organic. Each of those answers can come back zero, and zero is distinguishable from unmeasured. Consent state is carried on every event and no event type is emitted that lacks one.

## Acceptance items

1. **Measure before building. Three states, never collapsed.** For every funnel and share event type named in `gtmClient.ts`, `brokerageGtm.ts` and the locked handoff, report which of three states it is in: no writer exists; a writer exists but has never written a row; rows exist. Report the surface each writer is mounted on and, for share specifically, whether the Smart Site `/share#token` plane emits at all or whether only the brokerage workspace does. Absent, zero, and unmeasured are three different findings and a table that merges them fails this item. | check: a dated artifact carrying the three-state table plus the query that produced it | grade: [ ]

2. **The Smart Site share plane emits.** `share_created` on the sharer's action and `share_viewed` on the recipient's load, from the Smart Site share path, carrying the grant row id. If item 1 finds this already true, this item closes by citing that evidence and NOTHING is built. If it finds the events fire only on the brokerage workspace, they are added to the Smart Site plane without a second writer for the same subject. | check: fail-then-pass test on the Smart Site path; a duplicate-subject writer fails the card | grade: [ ]

3. **Sharer attribution, the genuinely absent piece.** A recipient who arrives on a share and later creates an account is joined back to the sharer, durably, by the grant row id rather than by a client-asserted value. The join survives the anonymous-to-account claim flow, which is the recorded trap: an auth flip that orphans anonymous data would silently drop every share attribution. Attribution is never written by the client. | check: fail-then-pass covering an anonymous view then signup; a violation where the client asserts a sharer must be refused | grade: [ ]

4. **Activation events.** First parcel inspected, first property saved, first report opened, each fired once per account with the honest first-time semantics. `pe_activation_events` already appears in the codebase; item 1 establishes whether it is fed. Without activation the affiliate program cannot tell a good audience from a bad one, which is the reason this is in the gate. | check: fail-then-pass; a re-fire on the second occurrence fails | grade: [ ]

5. **Consent is carried, and is year-zero.** Every event carries its consent state at emit time. The locked rule is that consent flags cannot be retrofitted, so an event emitted without one is a permanent hole rather than a later fix. An event type that can be emitted with consent absent, rather than refusing, fails this item. | check: a violation test emitting without consent must refuse, not default | grade: [ ]

6. **A readout that can go red.** One query or endpoint returning the six numbers in Done-looks-like, with share and affiliate reported side by side as the locked handoff requires. It must be able to return zero and to return unmeasured, and those must render differently. A readout that always finds a number is the defect class this operation is named against. | check: run it against a period with no activity and show it returns zero, then against an unmeasured event type and show it says so | grade: [ ]

7. **Verify by violation, both directions.** Every check above is shown failing on a deliberate violation and passing on restore, with the verbatim failure text. A check observed only passing has not been observed working. | check: the close artifact carries both directions per item | grade: [ ]

## Explicitly not this card

Do not build a second gtm_events store or a parallel event writer. Do not wire the GoHighLevel CRM sync; that is P-99 and it depends on the Stripe live switch. Do not touch PromoteKit, which attributes against Stripe and is owned by the affiliate group. Do not change the share fidelity rule: a share carries everything the sharer stored, regardless of recipient tier, and that is locked. Do not put tenant-private research on any event; that a parcel was inspected may cross, which parcel may not.

## Leave behind

Declared at close per the contract, `none` being a valid answer.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-01_p100-instr_cp1.json
  CP2: _inbox/2026-09-01_p100-instr_cp2.json
  CLOSE: _inbox/2026-09-01_p100-instr_close.json
