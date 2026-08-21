CANON-PREAMBLE v6c68a963

- COTALITY IS EXTINGUISHED — when code hits it (502/OAuth/fallthrough), re-route to county-gis/public-record, NEVER rotate the credential. Regrid also dead.
- DEPLOYS ARE PLANNER-OWNED — the agent deploys and fixes failed deploys; never escalate a deploy to the operator; "failed on X, fixing X".
- NO PRIVILEGED DATA — everything via uniform public-record; any path must work for a no-relationship jurisdiction.
- CTX / national HELD until Bastrop QA-done + operator go.
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

# Seat: property

# Property seat state

Preserved from _STATE.md at the 2026-08-20 topology split. Write this file, not the generated combined view. Duplicate branch-protection paragraphs from the concurrent double write were removed; the surviving record is `_state/systems/STATE.md`. The Smart Markets block moved to `_state/markets/STATE.md`.

Single source of truth for WHERE WE ARE RIGHT NOW. Not decisions (those are in memory / _decisions/), not history (those are in _sessions/). Live state a fresh agent picks up from; edit it constantly. **Last updated: 2026-08-20. Property namespace. Restructured from _STATE.md; branch protection lives in _state/systems/STATE.md.**

**LANE B 2026-08-19 (waves 1 and 2 SHIPPED): TEMPLATE CITY BUILD IS RUNNING.** Read `_inbox/2026-08-19_template_city_lens_build_sheet.md` and OPS-17 rows **A-073 to A-079**. **THE CORRECTION THAT OPENED THIS: the G-18 register's `Not built` meant THIS SURFACE DOES NOT EXIST YET, and three agent handoffs hardened it into THIS SURFACE IS MEANT TO BE EMPTY.** Rulings: honest absence is now about SOURCES per region, not screens; the department roster matches live and GROWS; demo data on every lens with one `Demo` chip. Dashboards main **`1b271c8c3dc7bf361c09f00a095cc8e9022a6946`**, serving **`smartcity-dashboards-00025-mam` @100%**, suite **320/320**. Kit main **`17eccfade057c0f8a835b8731be834cd4b828166`**, vocabulary **143**, components **86**, Design project **482** files. **Registry: 11 domains, 10 carrying on `template-city`, 0 of 11 on `empty-city`; `patrol-vehicles` stays the single `ungranted` region on purpose** — granting everything deletes the state that proves ruling 1. Footer now carries two claims: `0 of 10 sources granted` beside `6 of 10 demonstrated with fixture records`. Connections register split to **70 rows / 5 addenda**. **WAVE 3 SHIPPED 2026-08-20** under OPS-17 rows **A-080 to A-084**. Every department lens now renders its domain. Conformance instrument is live and is the reason wave 3 grew: 92 scans over 23 surfaces DERIVED from route definitions (the hand-built list of 16 was 30% short), 0 unwaived nodes, 132 adjudicated, bound stated as JUDGED not CONTAINED. Vertosoft handoff bundle assembled at `P:/tmp/VPAT/vertosoft_handoff_2026-08-20/` (tagged PDFs + CSV, verified against an untagged control). Heads and serving revisions are in the L1/L2 closes, not restated here. **OPEN and dispatchable: G-103 shared tagged-PDF render service, G-104 SmartSite title + glyph fix.** Both compile through `scripts/dispatch.mjs`; a fabricated row refuses. The eleven domains reach no pixel; all fifteen lenses share one `web/index.html` and one unpartitioned `web/shell.css`, so lens rendering merges one at a time. **Open, operator-owed:** Parks and Court are NOT expressible on the seam (four gate points, pinned to go red if a vendorless path appears) and four build-sheet lenses have no vendor — W2DEPT-F2; the register's disposition column is still hand-declared and can drift; the Design picker walk is STILL unrun. Closes `_inbox/2026-08-19_w2ds_close.json`, `_w2dept_close.json`, `_w2fix_close.json`.

**DRAIN STATUS 2026-08-17: L26 IDLE, QA/LAUNCH ON CURRENT MAP.** Read `_inbox/2026-08-17_l26_backfill_and_gtm_stand.md` first. Decision `_decisions/2026-08-17_qa_launch_current_map.md`. GTM `_decisions/2026-08-17_smartsite_gtm_pipedrive_popup_hobby.md`. Pickup `_inbox/2026-08-15_l26_gotomarket_pickup.md`. 15-min scoreboard loop PID 85672 **dead**. Lease **L26** heartbeat PID **22096** still live (expires ~21:53

AGENT-CONTRACT v92aa194c — you are bound by 90_runbooks/AGENT_CONTRACT.md in full (fan model,
interruption recovery, slot law + lease, heavy-scan serialization, verification rules, close schema).
Read it before any work; where this dispatch and the contract disagree, STOP and report.

DEV-PROCESS vbb19bd34 — you are bound by 90_runbooks/DEV_PROCESS.md in full. It governs how work
is SHAPED and how a result is JUDGED: coverage figures travel with their denominator, classes are
measured never subtracted, an instrument's exclusion set is part of its contract, gating indicators are
proven able to fire, paired controls need a divergence test, guardrails that do not survive a clone are
not guardrails. Every rule in it is traced to an incident. Read it before any work.

PLAN-ROW: R-07 (90_operations/OPS-18_canon_reconciliation_plan_of_record.md)

# R-07 grade store audit against mesh

You MUST NOT spawn sub-agents. Do not commit. Do not git add/commit/push.

Plan row R-07. Seat integration. Worktree P:/doc_repo.

## Mission

Grade the existing store audit against the blueprint mesh. OPS-18a acceptance item 5. Also draft the OPS-16 unmeasured DC (operator ruling 2).

## R-07 grade

Read `_inbox/2026-08-20_store_audit_atom_graph.md` (the log, not a paraphrase) and `_blueprint/40_rule_register.md`.

Write `_inbox/2026-08-21_r07_store_grade.md` with one row per audit Q (Q1 through Q10 and any lettered sub-Qs that carry a count):

- Q id
- What was measured (quote the figure and timestamp from the audit)
- BP-* rule it fails or satisfies
- Status of that rule (STARVED / UNENFORCED / DORMANT / wrong-value)
- Launch-critical? yes/no (yes = blocks measured-everywhere once R-09 is live)

No new SQL. No COUNT(*) on atoms. If a figure is missing from the audit, say UNMEASURED, do not estimate.

This is the input to R-08. Order the yes-launch-critical rows by: identity/keys first, then edges, then serve-path, then ledger.

## DC-9 draft

Read `_decisions/2026-08-11_texas_flush_launch_gate_amendment.md`. Add DC-9: unmeasured / `derivation-indeterminate` / overlay-indeterminate cells must be 0 at launch. Do not change DC-4 or DC-5 string equality. Cite `_decisions/2026-08-21_dc4_dc5_unmeasured_stays_distinct.md`. Bump last_updated. No em dashes.

## Return

Path of the grade. Count of Qs mapped. Count launch-critical. Confirm you did not query the store. Confirm DC-4 and DC-5 text still counts no-atom and no-writer only.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-08-21_r07-grade_cp1.json
  CP2: _inbox/2026-08-21_r07-grade_cp2.json
  CLOSE: _inbox/2026-08-21_r07-grade_close.json
