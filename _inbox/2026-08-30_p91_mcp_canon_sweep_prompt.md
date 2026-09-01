<!-- CANON-PREAMBLE v6f9d139b generated 2026-08-30 from _STATE.md -->

## STANDING DECISIONS (paste into every executor dispatch)

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


---
id: 2026-08-30_p91_mcp_canon_sweep_prompt
title: Sweep prompt. Bring every canonical doc that names the Smart Site MCP App to the v2 serving state
date: 2026-08-30
status: ready (hand-carry; or the planner spawns it as a Claude subagent on the operator's go)
plan_row: P-91
sources_of_truth: _inbox/2026-08-30_smartsite_mcp_app_v2_WDLL.md; _inbox/2026-08-30_p91_v2_build_close.md; _inbox/2026-08-30_p91_p558_deploy.md; _inbox/2026-08-30_p91_p543_deploy.md; _decisions/2026-08-29_p91_open_stays_a_turn.md
---

# Task

You are a doc_repo editor working for the integration planner. You do not commit. You edit the files named below in place, bump `last_updated` where a doc carries one, and hand back the diff. Repository `P:/doc_repo`, branch `main`; declare the commit you read at the top of your report.

The Smart Site MCP App is built and serving at v2: `smartsite-mcp` revision `smartsite-mcp-00065-siv` tag p558 (URI `ui://smartsite/app-p558.html`) and `cortex-api` revision `cortex-api-00668-cos` tag p543, both at 100 percent, read by field name 2026-08-30. LDT PRs #553 (`d8dfb319`) and #555 (`24553cfc`) are merged. The catalog is 13 tools. The operator ruled 2026-08-29 that Open stays a `ui/message` turn (every opened parcel lands in Claude's context); there is no Ask Claude button; `ask_the_map` is blocked `not_ready`; node-depth batches cap at 25 and stub batches at 50; every non-OK body is declared with `status` and `reason`; `unread` is a fifth wire state kept through normalization. The v2 card supersedes items 12, 13, 14, 16, 21, 22, 25, 26 of the 2026-08-28 WDLL. Not built, by name: footprint geometry, envelope, land use, drainage facets, flood citations, typed-absence vintage (data lane); exports (substrate seat); N1, F9, R3 (P-92); Free tier unchanged.

Every sentence you write must trace to one of the sources of truth in the frontmatter. If a doc claims something those sources contradict, correct the doc and cite the source in the edit; if a doc claims something the sources do not cover, leave it and list it in your report as unverified.

# Files, and what each needs

`90_operations/OPS-16_texas_market_plan_of_record.md`. Append one amendment row after the last A-0xx row, next id in sequence, date 2026-08-30, rows P-91 and P-92. Content: P-91 v2 built and serving (p558 / p543, PRs #553 and #555), the v2 card path, the close path, the paired shift order, the p555 uuid-binding regression repaired on p558, and that P-92 now holds N1 (neighbor seam), F9 (zoning codeRefs), R3 (flood-study forms) rather than the tools A-045 listed for it (those shipped in v1 per A-046). Decision column: operator 2026-08-30 "commit then spawn sub agents to execute and manage this build through deploy". Do not edit A-045 or A-046.

`90_operations/OPS-19_factory_plan_of_record.md`. Find the P-91 citation. If it states a serving tag, tool count, or state older than p558 / 13 tools, update that sentence only.

`_catalog/dispatch_missions/mission_p91_iframe.md`. Update the mission state to v2 serving: URI, tags, the five lanes (S6 to S10) and their commits (`4cd2b57b`, `525f3bca`, `29086224`, `8a34f2c6` on the panel branch; `37cf5286` and `0bcced84` on the cortex branch), the card and close paths, and the W1 walk as the open item. Keep the mission history; add, do not rewrite.

`_catalog/dispatch_missions/mission_p89_xray_mcp.md`. Read the one MCP App reference. Change it only if it names a state v2 changed (for example an envelope or X-ray claim the O1 refuse decision or the v2 card contradicts).

`_catalog/thesis_parity_ledger.md`. Find the MCP App row. Update its state cell to v2 serving with the card path. Nothing else in that ledger.

`_decisions/2026-08-26_smartsite_product_mcp_and_ai_connector.md`, `_decisions/2026-08-28_smartsite_mcp_app_v1_v2.md`. Decisions are not rewritten. Add a dated status note at the end of each: what shipped at v1 (p557) and v2 (p558 / p543), the P-92 re-scope, and the pointer to the v2 card. For the v1_v2 decision, name explicitly that the tools it listed under v2 shipped in v1 under A-046 and that P-92 now carries N1, F9, R3.

`_inbox/2026-08-28_smartsite_mcp_app_WDLL.md`. It already carries an amendment from 2026-08-29. Add a 2026-08-30 amendment naming the items the v2 card supersedes (12, 13, 14, 16, 21, 22, 25, 26) and the card path. Do not change item text.

`28_mcp_first_product_design.md`. Read it once. Add one paragraph only if it says nothing about MCP Apps (an iframe served by the MCP server, mounted by the host per tool call, with `ui/message` as the app's only path back to the model). If it already covers the pattern, change nothing and say so.

Do not touch `00_current_state.md`, `_catalog/seat_register.json`, or anything under `_sessions/`, `_inbox/` (other than the one WDLL named above), or `_dispatches/`.

# Rules

No em dashes or en dashes in body prose. Edit in place; never delete; retire by status flip. Frontmatter stays valid. Every number you write (tags, revisions, PR numbers, commit SHAs, tool count, caps) is copied from the sources of truth, not remembered. If two sources disagree, stop on that item and report both readings.

# Verification (exit-bounded)

Run these and paste the raw output in your report:

    cd /p/doc_repo && git diff --stat
    grep -lE 'p558|24553cfc' 90_operations/OPS-16_texas_market_plan_of_record.md _catalog/dispatch_missions/mission_p91_iframe.md _catalog/thesis_parity_ledger.md _decisions/2026-08-26_smartsite_product_mcp_and_ai_connector.md _decisions/2026-08-28_smartsite_mcp_app_v1_v2.md _inbox/2026-08-28_smartsite_mcp_app_WDLL.md | wc -l
    grep -nH $'\xe2\x80\x93\|\xe2\x80\x94' $(git diff --name-only) | grep -v -E '^[^:]+:[0-9]+:#' | head

The second command must print 6. The third must print nothing outside section titles, commit subjects, brand strings, or quotes. Both commands terminate on their own; do not add a watch or a loop.

# Report

Snapshot line (repo, branch, commit read). Per file: changed or unchanged, and the one-line reason. The unverified list. The two-readings list if any. The raw verification output. Then stop; the planner reads the diff and commits.
