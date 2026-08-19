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

PLAN-ROW: P-41 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: hauska-map

# Smart Site map legibility

## Lane W3 — Smart Site map legibility (P-41)

WORKING DIRECTORY: `/p/hauska-map-worktrees/ss-w3-map-legibility` (branch `ss/w3-map-legibility`, based on `origin/main` = 5bf06ec). Remote `https://github.com/empressaioemail-tech/hauska-map.git`.

READ FIRST: `P:/doc_repo/_catalog/parcel_fact_sheet_contract/CONTRACT_RULES.md`, invariant I6 especially. FROZEN.

### Why this lane exists

Verbatim from the operator QA pass: "I cant see street names I think this is important I have to click on a house to see the name of the street" and "In Zoning C-D-E-F are all orange there is no variance in the colors so how can I tell?" and "The current flood map is a little hard to read could you color code it... so that we can quickly identify the sections that are in and out of the zones".

Command Center is a CONSUMER of Smart Site per operator ruling, so this work lands in `packages/map-renderer` and CC inherits it.

### File ownership (six lanes run this repo in parallel)

YOURS: `packages/map-renderer/src/map/**` (paint, style, layers, legends) and `packages/map-renderer/src/chrome/satelliteBase.ts`.

NOT YOURS: lane P-42 owns `packages/map-renderer/src/chrome/mapToolsController.ts`, `chrome/MapTools.tsx`, `chrome/MapToolset.tsx`, `chrome/LayersControl.tsx`. Lanes P-39 and P-40 own `apps/property-explorer/**`.

### Work items

1. Street labels over satellite. Root cause confirmed by the planner: the basemap is a single CARTO raster (`light_all`) with labels baked into the image, and `chrome/satelliteBase.ts` `setSatelliteBase` hides that entire raster when satellite is on, so satellite mode has zero labels by construction. Every screenshot in the QA pass is satellite mode. Add a labels-only raster above the satellite layer. CARTO publishes `light_only_labels` and `dark_only_labels` at the same tile endpoints, same provider, same attribution, so this is a drop-in. Keep it above imagery and below data layers.

2. Zoning palette. Root cause confirmed: in `map/gis-map-paint.js` the zoning layer paints via `landUseFillColorExpr`, a hardcoded case ladder matching only `P-5`, `P-4`, `P-2`, `SFR`, `R-1`, `MF`, `COM`, `AG` plus description keyword matching. Real Texas district codes (C, D, E, F, GC, SF-1, MU) match nothing and all fall through to `C.other.fill`. They are orange because they are all classed unclassified, not because anyone chose orange four times. Replace with a data-driven categorical palette keyed on the district codes actually present, with a legend. Load the `dataviz` skill before choosing colours. The palette must be legible in light and dark and must not collide with the flood palette, per the operator note "if this overlaps or causes issues with the existing colors please use other shades".

3. Flood palette and legend. Only `AE` and `X_500` currently have distinct subcodes in `GIS_LAYER_PAINT`; `AO`, `A`, `VE` and the floodway variants collapse to one fill. Extend to the full FEMA zone set with a legend. The operator reference screenshot carries eight legend entries against our two. Per invariant I6 a parcel can sit in more than one zone at once, so the legend must make in-versus-out readable at a glance and overlapping zones must stay distinguishable.

4. Subject marker. Nothing currently draws a pin at the resolved parcel. Verbatim: "when I hit find I can not find the property, it will not zoom in or place an arrow on the lot" and "I am comparing 2 properties and I have no idea where they are, there should be some point of visual reference to show each location". Draw a subject marker plus a distinct secondary marker for compare's property B. Lane P-39 owns the camera fly and the subject state; you own marker rendering. Expose a seam P-39 can bind to and state clearly in your report what that seam is.

### Rules

Push your branch immediately after the first commit, then keep working. Open a PR against main. DO NOT MERGE, DO NOT DEPLOY, DO NOT push to main. Every verification command must EXIT on its own: no dev servers, no watch mode. Windows with Git Bash, forward slashes. Keep the suite green. `packages/map-renderer` is consumed by BOTH apps, so verify you have not broken Command Center's render path.

### Report back

Every file changed and why; the PR URL; verbatim build and test output; the marker seam you exposed for P-39; and a description of each palette with its colour values so the planner can judge contrast and collision without running the app.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-08-18_ss-w3_cp1.json
  CP2: _inbox/2026-08-18_ss-w3_cp2.json
  CLOSE: _inbox/2026-08-18_ss-w3_close.json
