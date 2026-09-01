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

PLAN-ROW: F-04 (90_operations/OPS-19_factory_plan_of_record.md)
repo: hauska-map

# F-04 operator login and server-side proxy for the Smart Site Factory console: the operator sees the Factory's runs, nobody else does, no key in any bundle; verified by violation from a browser that never signed in

---
id: 2026-08-27_f04_console_login_proxy_WDLL
title: WDLL — F-04 operator login and server-side proxy for the Smart Site Factory console: the console shows the Factory's runs to the operator and nobody else, with no key in any bundle
date: 2026-08-27
last_updated: 2026-08-27
status: approved
applies_to: hauska-map (apps/factory console and its Vercel serverless routes), hauska-factory (control API, none or minimal)
plan_row: F-04
depends_on: none (the control API, its key in Secret Manager, and the console exist)
operator_go: 2026-08-27 (operator opened the console, saw UNAUTHENTICATED, asked why the Factory shows no activity)
decision: _decisions/2026-08-26_factory_program_and_hold_lifts.md (console placement); OPS-19 A-001 (key exposure closed, proxy owed), A-002 (first F-04 item)
snapshot: doc_repo main 5f3b72e · console smart-site-factory.vercel.app on its own Vercel project, public URL answers 200 and every screen renders {"error":"UNAUTHENTICATED"} because the control key was rotated out of the bundle on 2026-08-26 after it was found compiled into public JavaScript · factory-control-00004-jin serves the control API with Bearer auth on FACTORY_CONTROL_API_KEY · authenticated GET /screens shows runs, queues, gates (verified by the conformant lane) · the Factory store holds dozens of runs since 2026-08-26 (Phase A, drain, writer, conformant, F-10 CP2, publish) that the operator cannot see
owner: property seat, a small fresh lane (no sub-agents needed). Worktree: P:/seat-worktrees/property/hauska-map-factory on seat/property-factory (registered; the Phase A console worktree, idle since #226 merged) or a fresh one from origin/main if it is dirty. Deploys recorded by the lane and verified by the planner.
---

# WDLL: F-04 operator login and proxy

Date: 2026-08-27  Status: approved  Operator approval: 2026-08-27

The console is honest and useless: it refuses everything because the only credential it ever had was a public one. The Factory has been running for a day and the operator cannot see a single run. This card gives the console a server side that holds the key and a front door that only the operator can open.

## Done looks like

The operator opens `smart-site-factory.vercel.app`, signs in once, and every screen (States, County manifest, City manifest, Runs, Queues, Defects, Holds, Gates, Lanes, Walk, Cost) renders live from the Factory store through the control API. Nobody without the operator's sign-in sees anything but the sign-in. No control key exists in any bundle, HTML, or client-visible response. The control API itself keeps its Bearer check; the proxy is the only holder of the key. Verified by violation from a browser that has never signed in.

## Acceptance items

1. **Server-side proxy holds the key.** Vercel serverless routes under `apps/factory/api/` forward `GET /screens`, `GET /counts`, and the read routes to `factory-control` with `Authorization: Bearer` from a server-side environment variable (`FACTORY_CONTROL_API_KEY`, set in the Vercel project, never `VITE_*`). The client calls the proxy only. Verified by violation: the built bundle contains no `Bearer`, no 32-character literal, and no `factory-control` hostname; `grep` on the served assets is the check. | check: bundle grep; proxy route responds; direct `factory-control` URL absent from client code | grade: [ ]

2. **Operator login, fail closed.** A sign-in the operator controls in front of every proxy route and every screen: the simplest correct form is the existing Smart Site OIDC (Google, Microsoft) with an allow-list of operator subjects held server-side, or Vercel's own protection if it can be scoped to this project; a signed, `HttpOnly`, `Secure` session cookie; no session, no data. Unauthenticated requests to the proxy return 401 with no body from the store; unauthenticated page loads show the sign-in and nothing else. The allow-list is a server-side setting, not a client constant. | check: from a browser that has never signed in, every screen shows sign-in and every proxy route is 401; after sign-in, Runs shows the last twenty runs with phase, target, status, counts, cost; a non-allow-listed account signs in and is refused | grade: [ ]

3. **Mutation verbs stay behind the same door and are recorded.** `POST` verbs (`start`, `stop`, `hold`, `lift`, `approve`, `adjudicate`, `re-run`, `lane-request`) pass through the proxy only for a signed-in operator, and the proxy adds the operator identity to the request so the Factory run row records who pressed the button. A mutation without an operator identity is refused by the control API, not only by the proxy. | check: a `POST` without a session is 401 at the proxy; a `POST` with a forged identity header and no session is refused by `factory-control`; a real `start` records the operator subject on the run row | grade: [ ]

4. **Re-grade Phase A item 11 by violation.** Item 11 (control API 401 on a missing key) is re-graded from the public internet against the deployed console and proxy, not from a shell that holds the key. | check: recorded probe set with timestamps and the serving revisions of the console and `factory-control` | grade: [ ]

5. **Deploy, verify, close.** Console deployed by the Vercel CLI (no auto-deploy on merge), bundle marker verified, `factory-control` unchanged or re-pinned by digest if item 3 needed a change; close at `_inbox/2026-08-27_f04-console-proxy_close.json` with the probes, the revision names, and `leave_behind`. | check: artifacts | grade: [ ]

6. **Out of this card.** New screens; the Factory store schema; any change to what the screens show (that is F-05 and F-12); Smart Site product sign-in (P-86 owns the product session; this card may reuse its OIDC provider configuration but not its session). | check: pathspec | grade: [ ]

## Do not

- Put the key in `VITE_*`, in `tiles.json`, in a query string, or in any file the client fetches.
- Ship a "temporary" client-side password check; a check the client evaluates is not a check.
- Pass the verification with a shell that holds the key; the browser that has never signed in is the instrument.
- Touch `factory-control`'s verbs beyond recording the operator identity.

## Amendments

- None yet.

## Finish card (graded at close)

(not yet)

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-08-27_f04-console-proxy_cp1.json
  CP2: _inbox/2026-08-27_f04-console-proxy_cp2.json
  CLOSE: _inbox/2026-08-27_f04-console-proxy_close.json
