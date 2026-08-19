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

PLAN-ROW: P-39 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: hauska-map

# Smart Site fact-sheet unification

## Lane W1 — Smart Site fact-sheet unification (P-39)

WORKING DIRECTORY: `/p/hauska-map-worktrees/ss-w1-subject-factsheet` (git worktree, branch `ss/w1-subject-factsheet`, based on `origin/main` = 5bf06ec). Remote `https://github.com/empressaioemail-tech/hauska-map.git`.

READ FIRST, IN ORDER: `P:/doc_repo/_catalog/parcel_fact_sheet_contract/CONTRACT_RULES.md` then `parcel-fact-sheet.ts` in the same folder. The contract is FROZEN by the planner. If you believe an invariant is wrong, STOP and report it. Do not change it unilaterally.

### Why this lane exists

The 2026-08-18 operator QA pass filed 21 defects. Traced to source, most of them are one defect: the app has no single subject. The search box, the inspect card, the compare panel and each export panel hold independent parcel targets, and exports read whichever one they captured. A flood/drainage report returned parcel `48027:498770` when `498778` was selected. A DXF export targeted "city of Bastrop" left in the search box while the sidebar displayed a different address. Separately, five code paths each answer the same parcel questions independently, so one X-ray PDF printed "Zone AO" on sheet 1 and "Flood zone AE" on sheet 4, and said "buildable envelope not derived here" on sheet 1 while sheet 3 drew an envelope and sheet 4 measured it at 6,325 sq ft.

### File ownership (six lanes run this repo in parallel; do not stray)

YOURS: `packages/parcel-fact-sheet/**` (new), `apps/property-explorer/src/lib/**`, `apps/property-explorer/src/browse/SearchBar.tsx`, `apps/property-explorer/src/browse/ExplorerMap.tsx`, `apps/property-explorer/api/**`, and the verdict formatters you delete.

NOT YOURS: lane P-40 owns `apps/property-explorer/src/browse/InspectCard.tsx` RENDERING in parallel with you. You MAY change InspectCard only to swap the data source it consumes. Do NOT touch its JSX structure, styling or copy. Lanes P-41 and P-42 own `packages/map-renderer/**`.

### Work items

1. Create workspace package `packages/parcel-fact-sheet`, taking the frozen contract verbatim as `src/index.ts`, then implement the two `declare function` stubs (`composeVerdict`, `formatMeasurement`) as real pure functions with tests. Both `apps/property-explorer` and `apps/command-center` must be able to consume it; match how `packages/map-renderer` is wired into the workspace.

2. Implement `FactSheetResolver` against the sources the app uses today. Begin by reading `src/lib/baked-facets.ts`, `src/lib/parcel-lookup.ts`, `src/lib/buildable-envelope.js` and `src/browse/brief-view-model.ts` to enumerate every current read path. The resolver replaces all of them.

3. Implement `SubjectStore` as the single current-parcel state and wire every consumer to read it. This is invariant I1 and the most important thing in your lane.

4. Invariant I5: centre the camera on `ParcelGeometry.centroid`. Today `src/lib/parcel-lookup.ts` geocodes the situs ADDRESS to decide where to fly, and carries a comment admitting a null centre means "the inspect card opens but the map does not move". Parcels with no address therefore never move the map, so a data gap presents as a broken Find. Note also that the address branch of `resolveParcelLookup` has no geocode fallback while the parcel-id branch does; geometric centring removes that asymmetry entirely.

5. Invariant I2: delete `brief-verdict.ts`, `share-verdict.ts`, the verdict half of `compare-facts.ts` and the verdict half of `brief-view-model.ts`. Replace with the single `composeVerdict`.

6. Exports take a `factSheetId`, never a free-text query or a panel-local parcel id. Update `api/pe-site-plan-export.ts`, `api/pe-terrain-export.ts` and the flood/drainage path. Every rendered artifact prints its `factSheetId`.

7. SearchBar defect, confirmed by the planner. In `src/browse/SearchBar.tsx` around line 379, `pick()` runs `setValue(chosen.kind === "parcel" ? chosen.parcelNodeId ?? chosen.label : chosen.label)`. For an address suggestion `label` is only housenumber plus street (see `featureToSuggestion` in `src/lib/search-kinds.ts`) while the correctly built full string sits in `chosen.lookupQuery` and is discarded. Picking "17005 Simsbrook Drive, Pflugerville, TX 78660" leaves "17005 Simsbrook Drive" in the box, so pressing Find submits the truncated string and errors. Fix so the input carries the full lookup target and Find re-submits what the suggestion resolved. Verify against that exact address.

8. US-only results. `api/_lib/pe-geocode-core.ts` builds the Photon query with no country filter; the response parser already extracts `countrycode` onto every wire feature. Filter server-side.

9. Invariant I6: flood becomes a zone SET. A parcel can be in the 100-year and the 500-year floodplain at once and can be part AE and part AO. The scalar `floodZone` is itself the defect.

### Rules

Push your branch immediately after the first commit, then keep working. Open a PR against main when done. DO NOT MERGE, DO NOT DEPLOY, DO NOT push to main. Every verification command must EXIT on its own: no dev servers left running, no watch mode; use build and test runs, or background-start plus curl plus kill. Windows with Git Bash, forward slashes. Keep the existing suite green; if a test encodes behaviour this contract deliberately changes, update it and say so explicitly.

### Report back

Every file changed and why; the PR URL; verbatim pasted output of your build and test commands; any invariant you think is wrong; anything you found that contradicts this briefing. The planner reviews adversarially at source, so do not report a result you have not run.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-08-18_ss-w1_cp1.json
  CP2: _inbox/2026-08-18_ss-w1_cp2.json
  CLOSE: _inbox/2026-08-18_ss-w1_close.json
