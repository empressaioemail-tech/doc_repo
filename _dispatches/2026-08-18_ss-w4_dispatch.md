CANON-PREAMBLE v664d6256

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

AGENT-CONTRACT v7b714e95 — you are bound by 90_runbooks/AGENT_CONTRACT.md in full (fan model,
interruption recovery, slot law + lease, heavy-scan serialization, verification rules, close schema).
Read it before any work; where this dispatch and the contract disagree, STOP and report.

DEV-PROCESS vbb19bd34 — you are bound by 90_runbooks/DEV_PROCESS.md in full. It governs how work
is SHAPED and how a result is JUDGED: coverage figures travel with their denominator, classes are
measured never subtracted, an instrument's exclusion set is part of its contract, gating indicators are
proven able to fire, paired controls need a divergence test, guardrails that do not survive a clone are
not guardrails. Every rule in it is traced to an incident. Read it before any work.

PLAN-ROW: P-42 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: hauska-map

# Smart Site instruments and mobile

## Lane W4 — Smart Site instruments and mobile (P-42)

WORKING DIRECTORY: `/p/hauska-map-worktrees/ss-w4-tools-mobile` (branch `ss/w4-tools-mobile`, based on `origin/main` = 5bf06ec). Remote `https://github.com/empressaioemail-tech/hauska-map.git`.

READ FIRST: `P:/doc_repo/_catalog/parcel_fact_sheet_contract/CONTRACT_RULES.md`. FROZEN.

### Why this lane exists

The map tools are demos rather than instruments. Verbatim from the operator QA pass: "the measuring tool there are a few issues. There is no stop or go back. Once you measure in one direction there is a continuation of measuring and it keeps going. If you hit trash it deletes all measurements that you made. There needs to be an undo section. You can not measure length and width together its a single measurement... Even when you double click it does not allow you to place a new line."

### File ownership (six lanes run this repo in parallel)

YOURS: `packages/map-renderer/src/chrome/mapToolsController.ts`, `chrome/MapTools.tsx`, `chrome/MapToolset.tsx`, `chrome/LayersControl.tsx`, `chrome/geoMeasure.ts`, and `apps/property-explorer/src/browse/MobilePanelContext.tsx`, `src/browse/mobile-layout.ts`.

NOT YOURS: lane P-41 owns `packages/map-renderer/src/map/**` and `chrome/satelliteBase.ts`. Lanes P-39 and P-40 own the rest of `apps/property-explorer/**`; in particular P-39 owns `ExplorerMap.tsx` and P-40 owns `InspectCard.tsx`. If the mobile work needs a change in either, report it to the planner rather than making it.

### Work items

1. Measure becomes an instrument. Root cause confirmed by the planner in `chrome/mapToolsController.ts`: the draw tool has a `drawShapes` array and a `commitDraw()`, while measure has neither, only a single `state.measureVerts` array. So exactly one measurement can exist, which is why length and width cannot both be taken. `onMapDblClick` in measure mode only pops a vertex and never commits, which is why the line runs forever. The only removal operation is `clearAll()`, which is why trash nukes everything. The readout even promises "Double-click or Esc to finish", which measure does not honour. Add committed measurements, an explicit finish, undo of the last point, removal of a single measurement, per-segment plus running total, and area with square footage.

2. Shape reports its area. `commitDraw` pushes polygons into `drawShapes` but nothing ever measures them. The operator asked directly whether the shape tool should give area and square footage; the planner's answer is yes. `ringAreaSqMeters` and `formatArea` already exist unused in `chrome/geoMeasure.ts`.

3. Panel manager. Verbatim: "How do i make the tools disappear so I can read this". Three floating panels (Reports and exports, TOOLS, LAYERS) stack over each other with no z-management and no collapse. Add collapse, minimise, sane z-order and a hide-all-panels control.

4. Location tool STAYS ON, and grows. Operator ruling: it serves on-the-ground consumers standing on a lot, so do not remove it. On select it must fly the map to the located point, and it should resolve the parcel the user is standing on. Coordinate with lane P-39, which owns the subject state and the camera; expose what you need and report the seam rather than reaching into their files.

5. Notes. The operator asked for a per-parcel note so a user can record their own judgement and return to it, in their words "good boundaries possible option" or "there was 130 sf of space needed for my project". This is the first feature in the app carrying the user's judgement rather than ours. Give it its own tool slot, not Location's.

6. Mobile sheet collapse. Verbatim: "In the mobile version when i pull up the menus and make a selection the menu needs to collapse". Root cause confirmed: `MobilePanelContext` exposes `openSheet` and NO `closeSheet` at all, and exactly one place in the app returns to the map. Every in-sheet selection therefore has no way to dismiss its sheet, because the API cannot express it. Add the primitive and auto-collapse on selection.

7. Resize flicker, probable cause, verify before fixing. Verbatim: "Screen flickers when sizing down". `ExplorerMap.tsx` renders the card as two different subtrees, one guarded by `isMobile` and one by `!isMobile`, at the 768px breakpoint in `mobile-layout.ts`, so drag-resizing across that boundary unmounts and remounts on every crossing. That file belongs to P-39, so confirm or refute the diagnosis and report it; do not edit `ExplorerMap.tsx` yourself.

### Rules

Push your branch immediately after the first commit, then keep working. Open a PR against main. DO NOT MERGE, DO NOT DEPLOY, DO NOT push to main. Every verification command must EXIT on its own: no dev servers, no watch mode. Windows with Git Bash, forward slashes. Keep the suite green. `packages/map-renderer` is consumed by BOTH apps, so verify Command Center still renders.

### Report back

Every file changed and why; the PR URL; verbatim build and test output; the seams you exposed for P-39 (location fly, subject resolve); your verdict on the resize-flicker diagnosis with evidence; and anything that contradicts this briefing.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-08-18_ss-w4_cp1.json
  CP2: _inbox/2026-08-18_ss-w4_cp2.json
  CLOSE: _inbox/2026-08-18_ss-w4_close.json
