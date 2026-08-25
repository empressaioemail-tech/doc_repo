CANON-PREAMBLE v78ed9c62

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

# Seat: govtech (planner deploy lane)

# Govtech seat state

Read `_state/govtech/STATE.md` before work; write that file at close, not this block. Scope rev 3: `_inbox/2026-08-24_govtech_program_scope.md`. **Last updated: 2026-08-24.** Branch `seat/govtech`. Merged ≠ live until deploy gates pass violation probes.

**Deploy queue (G-105):** plan-review #7, smartcity-dashboards #39, hauska-mcp-server #75, hauska-engine #361 — all merged, armed-inert. plan-review #6 is LIVE (BFF only). Live Bastrop no-touch.

AGENT-CONTRACT v92aa194c — you are bound by 90_runbooks/AGENT_CONTRACT.md in full (fan model,
interruption recovery, slot law + lease, heavy-scan serialization, verification rules, close schema).
Read it before any work; where this dispatch and the contract disagree, STOP and report.

DEV-PROCESS vbb19bd34 — you are bound by 90_runbooks/DEV_PROCESS.md in full. It governs how work
is SHAPED and how a result is JUDGED: coverage figures travel with their denominator, classes are
measured never subtracted, an instrument's exclusion set is part of its contract, gating indicators are
proven able to fire, paired controls need a divergence test, guardrails that do not survive a clone are
not guardrails. Every rule in it is traced to an incident. Read it before any work.

PLAN-ROW: G-105 (90_operations/OPS-17_govtech_stack_plan_of_record.md)

# govtech-deploy dispatch

You MAY spawn sub-agents for read-only recon. Sub-agents MUST NOT commit, merge, or deploy. You MUST NOT git add / commit / push in doc_repo (planner-owned). **This lane prepares deploy + probe instruments; it does NOT run production deploys.**

Runbook: `_inbox/2026-08-25_govtech_deploy_runbook.md`. Probe instrument: `scripts/govtech/deploy-violation-probes.mjs`.

## Mission

Execute **G-105 / S5-2a**: deploy cut plus live violation probes for four merged PRs on `template-city` Wave 1. Grade on the **deployed serving revision**, never the merge SHA alone.

**Acceptance:** cite `_inbox/2026-08-25_govtech_wave1_WDLL.md` items **1–4** (deploy gates) in CP/CLOSE. This lane owns WDLL items 1–4 only; items 5–15 are later G-106–G-110 dispatches.

| WDLL | Item |
|---|---|
| 1 | DEPLOY-7 + Vercel paired; code-lookup refuse probe |
| 2 | DEPLOY-39 compose gate probe |
| 3 | DEPLOY-75 meter bypass probe |
| 4 | DEPLOY-361 writer refuse probe |
| — | Self-test: `node --test scripts/govtech/deploy-violation-probes.test.mjs` |

**Deploy order (strict):**

1. **DEPLOY-7 + DEPLOY-39 (paired)** — deploy together in one cut; probe each before advancing.
2. **DEPLOY-75** — substrate MCP; probe after traffic shift.
3. **DEPLOY-361** — engine-api (property seat deploys; govtech owns probe + close evidence).

**DEPLOY-7 rule:** plan-review **Cloud Run service** and **Vercel plan-review-app** MUST deploy in the **same cut**. Pre-#7 UI synthesises a citation when the server sends none; service-only deploy reinstates fabrication one layer out (`_sessions/2026-08-24_govtech_thread_open_claude_code.md`).

| Gate | Repo | PR | Defect (scope rev 3) | Probe gate id |
|---|---|---|---|---|
| DEPLOY-7 | `empressaioemail-tech/plan-review` | **#7** | #6 neighbour code-lookup fallback | `deploy-7` |
| DEPLOY-39 | `empressaioemail-tech/smartcity-dashboards` | **#39** | #1 absent accessPolicy visible; #2 compose ungated | `deploy-39` |
| DEPLOY-75 | `empressaioemail-tech/hauska-mcp-server` | **#75** | S4-2 ICC meter bypass (empty provenance accrual) | `deploy-75` |
| DEPLOY-361 | `empressaioemail-tech/hauska-engine` | **#361** | #5 writer `?? "public-free"` on accessPolicy | `deploy-361` |

**Per-gate sequence:** record serving revision placeholders → `node scripts/govtech/deploy-violation-probes.mjs --gate <id> --expect fail` (baseline) → deploy (planner-owned) → shift traffic → `--expect pass` → file evidence in CP2/CLOSE.

**Out of scope this lane:** Smart Files S3-1 (G-106), engine migration S2-1 (DOC-5), property backfill S4-6, Bastrop/live city, setting a real ICC rate (O-1).

## Return

CP1 before any deploy: occupancy, gates in order, revisions you will record, which WDLL/G105 items you own, falsifiers per gate. CP2 after probes: raw probe output, revision names, self-test pass. CLOSE cites G105-1 through G105-6 with evidence paths.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-08-25_govtech-deploy_cp1.json
  CP2: _inbox/2026-08-25_govtech-deploy_cp2.json
  CLOSE: _inbox/2026-08-25_govtech-deploy_close.json
