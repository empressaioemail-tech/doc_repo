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

PLAN-ROW: P-97 (90_operations/OPS-16_texas_market_plan_of_record.md)

# A-062: the PE billing portal, the live-money blocker

---
id: 2026-09-01_a062_pe_billing_portal_WDLL
title: WDLL — A-062: the PE billing portal, the live-money blocker
date: 2026-09-01
last_updated: 2026-09-01
status: open
applies_to: legacy-design-tools (api-server propertyExplorer.ts), hauska-map (property-explorer Settings + deep-allowlist)
plan_row: P-97
depends_on: _inbox/2026-08-31_p97_stripe_live_activation_checklist.md Phase 0 item 3, 90_operations/OPS-16_texas_market_plan_of_record.md A-062, _smartsite_gtm/06_consolidated_roadmap.md Wave 1.1
operator_go: 2026-08-31 (ruled a BLOCKING Phase 0 item, elevated from a checklist line)
snapshot: planner read 2026-08-31 against LDT origin/main d1154938 and hauska-map origin/main 333c3c05, plus live probes on smartsite.cloud
owner: property seat (lane planner); planner verifies and commits doc_repo
---

# A-062 the PE billing portal

Date: 2026-09-01  Status: open

This is Wave 1.1 of `_smartsite_gtm/06_consolidated_roadmap.md` and it gates the Stripe live switch. It sat unowned across two parallel working threads because each assumed the other held it.

## The defect, stated sharply

`apps/property-explorer/public/terms.html` states verbatim: "You can cancel a paid plan through the Stripe billing flow in the product." Zero billing-portal references exist anywhere in `apps/property-explorer`, verified by grep rather than inferred.

The product is honest and the legal page is not. `SettingsModal.tsx:21-22` says in its own header comment that payment method, invoices and cancel need a billing portal that does not exist, and the Plan tab renders "Not built" to the user's face. The app declines to overclaim while the terms overclaim on its behalf. That is the inversion of the usual failure and it is the half carrying legal weight, because the terms are the document a customer is held to and holds us to.

Taking live money against a cancellation promise the product cannot honour is the exposure. It is not a copy defect, and amending the terms is the wrong trade because the fix is small.

## What already exists, so do not rebuild it

The Stripe call is built and proven. `brokerageStripe.ts:245` posts to `/billing_portal/sessions`, and `POST /api/brokerage/v1/billing/portal` is live on the install-scoped seam. What is missing is only the PE user-scoped equivalent. `propertyExplorer.ts` carries `billing/checkout` and `billing/property-unlock/checkout` and no portal route at all.

A lane that writes a second Stripe portal client fails this card.

## Sequencing hazard, read this before starting

The P-98b client lane has an unmerged branch `feat/p98b-account-entitlement-client` on hauska-map that changes `SettingsModal.tsx` by +210/-74, and it is the branch that makes the Plan tab able to read account state at all. **The Settings half of this card must land after that branch merges, or the two rewrite the same file.** The server half of this card has no such conflict and can start immediately.

Check `gh pr list --repo empressaioemail-tech/hauska-map` before touching `SettingsModal.tsx`.

## Done looks like

A signed-in paying customer can open the Stripe billing portal from Settings, on their own customer id, and cancel. The sentence in `terms.html` becomes true. A signed-in customer who has never paid gets an honest refusal rather than a portal, an error, or somebody else's account.

## Acceptance items

1. **The route, user-scoped and fail-closed.** `POST /property-explorer/v1/billing/portal` resolves `stripe_customer_id` from the authenticated session and never from the request body, a header, or a query parameter. A caller-supplied customer id is refused, not honoured, and a test proves the refusal. Reuse the existing portal client; do not write a second one. | check: fail-then-pass where a request body carrying another user's `stripe_customer_id` is refused | grade: [ ]

2. **No customer id is a declared refusal, never a fabricated one.** A signed-in user with no `stripe_customer_id` (free, or never completed a checkout) gets a declared refusal naming that state. It must not return a portal for a different customer, must not create a Stripe customer as a side effect of asking for a portal, and must not return a 500. Absent is a real and common state here and it is distinct from an error. | check: fail-then-pass on a signed-in user with a null `stripe_customer_id`; a test that a Stripe customer was NOT created | grade: [ ]

3. **The allowlist entry, proven by its own test and not by a probe.** The new path is added to `apps/property-explorer/api/_lib/deep-allowlist.ts` in `DEEP_POST_EXACT`. Omitting it returns 403 from the same-origin deep proxy, which is exactly the defect class that made the `ai-connections` card dead for every user on 2026-08-31. The proof is a parity test that imports the path constant the CLIENT builds its request from, not a retyped string, and not a production 401 (the proxy checks the cookie before the allowlist, so a signed-out caller gets 401 either way and that proves nothing). | check: a parity test asserting `isDeepPathAllowed('POST', <the client's own constant>)` is true | grade: [ ]

4. **The return URL points at Smart Site.** The portal session's `return_url` must land the customer back on the Smart Site host. Do not inherit the server default at `pePaywallStripe.ts:126-129`, which is the hardcoded `https://property-explorer-xi.vercel.app/`. Send it explicitly from the client the way `billingClient.ts:98-99` already does for checkout. | check: a test pinning the sent `return_url`, plus a live open showing the customer returns to smartsite.cloud | grade: [ ]

5. **Settings > Plan replaces "Not built" with a working control, and only where it is working.** The cancel and manage-payment rows get a real control. Rows that remain genuinely unbuilt keep saying so; this card does not license turning every "Not built" into a button. The panel's own printed rule stands: a field with no traced source says so. | check: fail-then-pass on the cancel row rendering a control for a customer WITH an id and the honest state for one without | grade: [ ]

6. **The terms sentence is now true, and something says so.** A test or check that fails if `terms.html` claims an in-product cancellation path while no portal route is mounted. This is the item that keeps the defect from returning: the two halves drifted apart once already and nothing noticed. | check: a check that reads both the terms string and the route table and fails on disagreement | grade: [ ]

7. **Verify by violation, both directions.** Every check above shown failing on a deliberate violation and passing on restore, with verbatim failure text. A check observed only passing has not been observed working. | check: the close artifact carries both directions per item | grade: [ ]

## Live-mode dependency, named so it is not discovered late

The Stripe Customer Portal has a per-mode configuration. Checklist item 10 requires creating the live Customer Portal configuration, and without it `/billing/portal` returns 502 in live mode. Test mode has its own configuration, so **this card is fully buildable and verifiable in test mode today** and the live configuration is an operator step in Phase 1, not a blocker on this build.

## Explicitly not this card

Do not amend `terms.html` to remove the promise; the ruling is to keep the promise and build the capability. Do not retire `api/pe-billing.ts`; that is ruled and is its own item in Wave 1.2. Do not touch the install-scoped `POST /api/brokerage/v1/billing/portal` route or the extension's portal path. Do not perform the Stripe live switch or create any live Stripe object. Do not build dunning, invoice history, or payment-method update UI beyond what the portal itself provides; the portal is Stripe's surface and we link to it.

## Leave behind

Declared at close per the contract, `none` being a valid answer.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-01_a062-portal_cp1.json
  CP2: _inbox/2026-09-01_a062-portal_cp2.json
  CLOSE: _inbox/2026-09-01_a062-portal_close.json
