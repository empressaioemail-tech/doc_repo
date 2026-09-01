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

PLAN-ROW: P-105 (90_operations/OPS-16_texas_market_plan_of_record.md)

# P-105: the share becomes a doorway, for a person and for a model

---
id: 2026-09-01_p105_share_handoff_WDLL
title: WDLL — P-105: the share becomes a doorway, for a person and for a model
date: 2026-09-01
last_updated: 2026-09-01
status: open
applies_to: hauska-map (property-explorer share plane), legacy-design-tools (smartsite-mcp connector copy)
plan_row: P-105
depends_on: _decisions/2026-08-31_claude_sync_card_and_connected_signal.md, _sessions/2026-08-30_p91_v3_mcp_wave_claude_code.md, _smartsite_gtm/07_rails_by_persona_pricing_input.md
operator_go: 2026-09-01
snapshot: planner probed the live share plane 2026-09-01 and read hauska-map + legacy-design-tools origin/main
owner: property seat (lane planner); planner verifies and commits doc_repo
---

# P-105 the share handoff

Date: 2026-09-01  Status: open

## Why this row exists

A share is the highest-intent moment the product gets. A person has been handed a specific parcel, by someone they trust, inside their AI, and they care about it right now. Today that moment ends in a static document with a relative link that a foreign model cannot even resolve.

**The bridge is already built on the wrong side of the product.** Claude Sync (P-87) turns a parcel into a Claude conversation that calls `get_smart_site`, which is one of the three tools in `APP_HOST_TOOLS` that mounts the Smart Site panel through `appMetaFor`. That path works and ships. It lives on the workbench, which is the **sharer**. The **recipient**, who is the one with fresh intent, gets nothing.

The design was already written on 2026-08-30 and the lane was never started: carry the address so the chat reads naturally, the parcel node id so the tool call is exact, and the share URL as a fallback, so a user with the connector gets the full panel and a user without it still gets an answer from the fetched share link.

## Established before you start, do not re-derive

The share plane serves three formats off one instrument, verified live 2026-09-01 against a real grant: `/s/{grantId}` returns HTML on `text/html`, JSON on `application/json`, and Markdown on `text/markdown` or `?format=agent`. A bogus grant returns 403 before negotiating, which is the correct fail-closed order. `/share#token` is human-only by construction because the token sits in the URL hash and never reaches the server.

`smartsite.cloud/llms.txt` is live and documents that contract.

`claudeSync.ts` in `apps/property-explorer/src/lib/` is a pure, tested prompt builder. It carries the parcel node id as the operative half, omits an unresolved label rather than guessing, guards at 14,000 characters, and puts the prompt on the clipboard before opening the chat because Anthropic documents prefill only for the `claude://` desktop scheme. **Reuse it. A second prompt builder is the defect, not the fix.**

## The distinction this card turns on

The human share and the agent share need **different** handoffs, and giving them the same one is a category error.

A person reading the HTML view can click. They get the Sync handoff exactly as the workbench does it.

A model reading the Markdown or JSON form cannot click anything, so a `claude://` link is meaningless to it. What it needs is the connector's identity, the parcel node id, and the name of the tool that opens the parcel. That is **data plus an offer**. It must never read as an instruction the model is expected to obey, because this body runs inside somebody else's model and a share that reads as commands is one screenshot away from being a story about prompt injection.

## Done looks like

A person who receives a share and has the connector reaches the live Smart Site panel for that parcel without typing a parcel id. A person without the connector still gets the full share and a truthful account of what connecting would add. A model that receives a share can state what it can see, what it cannot, why not in each case, and what its user could do about it, without inventing anything and without being told to call a tool it cannot reach.

## Acceptance items

1. **The human share carries the Sync handoff, from the existing builder.** The HTML view of `/s/{grantId}` offers the same clipboard-then-open handoff the workbench offers, built by importing `claudeSync.ts` rather than reimplementing it. A test proves the share path and the workbench path produce an identical prompt for the same parcel. | check: fail-then-pass; a second prompt builder fails this item | grade: [ ]

2. **The agent formats carry a connector offer, not a deep link and not an instruction.** Markdown and JSON name the connector, the parcel node id, and `get_smart_site`. Phrased as availability, never as a directive. No `claude://` URL appears in either format. | check: a test asserting no `claude://` in the agent bodies, plus a reviewed copy read against the injection-shape rule | grade: [ ]

3. **Every link in every format is absolute.** The live-view link is `/share?g=...` today, which a foreign model cannot resolve. Every URL in the Markdown and JSON forms is fully qualified. | check: a test asserting no relative URL in the agent bodies | grade: [ ]

4. **Absence becomes four states, each with its own next action.** Today everything unavailable says "Not verified on this share." At minimum: the sharer did not include it; we have not measured this county; it is paid-tier; it does not exist for this parcel. Each carries guidance a model can act on. The MCP app already carries `agentGuidance` on every non-present facet from the p563 work, and that vocabulary is the source rather than a new one. | check: fail-then-pass per state; a body that collapses two of them fails | grade: [ ]

5. **The duplication goes, and the developer strings with it.** Artifacts and Withholdings currently repeat four identical lines. And the body ships raw internal errors to customers, including a literal `(404)` and an instruction to "Call `refresh_parcel_dossier_export` first to build it", which tells a foreign model to invoke a tool it has no access to. | check: a test asserting no tool name and no bare HTTP status appears in a customer-facing body | grade: [ ]

6. **One line stops asserting two contradictory facts.** "Not exported by the sharer (Dossier artifact not found (404)...)" claims both that the sharer chose not to share it and that it does not exist. Pick the true one per case and say only that. | check: fail-then-pass covering both cases separately | grade: [ ]

7. **Verify by violation, both directions.** Every check above shown failing on a deliberate violation and passing on restore, with verbatim failure text. | check: the close carries both directions per item | grade: [ ]

## Two things to measure, not assume

**Our own records disagree on whether web prefill works.** `_sessions/2026-08-30_p91_v3_mcp_wave_claude_code.md` reports the `https://claude.ai/new?q=` form was tested and Claude executed the prompt. `_decisions/2026-08-31_claude_sync_card_and_connected_signal.md` records it as undocumented with web prefill reportedly removed in October 2025, and chose clipboard-first because of it. Both are ours, six days apart. Report which is true as observed, or report it unresolved. **Do not quietly adopt either.** The clipboard-first design is correct regardless, so this changes copy, not architecture.

**Whether the panel mounts when the prefilled call is the first action in a fresh conversation.** Almost certainly yes, since it is the same tool call, but nobody has watched it happen. If it cannot be observed from this lane, say unmeasured rather than implying it works.

## Explicitly not this card

Do not build a second prompt builder. Do not change the share fidelity rule, which is locked: a share carries everything the sharer stored regardless of recipient tier. Do not add or rename an MCP tool. Do not change the connector's gates; the connector is a door and inherits the tier. Do not put owner data or tenant-private research into any share body. Do not weaken the paste-logs-the-URL warning; as the instrument gets more valuable that warning gets more important, not less. Do not wire share analytics; P-100 owns the share event spine and a second writer for the same subject fails that card too.

## Leave behind

Declared at close per the contract, `none` being a valid answer.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-01_p105-share-handoff_cp1.json
  CP2: _inbox/2026-09-01_p105-share-handoff_cp2.json
  CLOSE: _inbox/2026-09-01_p105-share-handoff_close.json
