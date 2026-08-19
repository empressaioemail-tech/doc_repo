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

PLAN-ROW: P-44 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: hauska-map

# County Manifest refresh and serving-sweep panel

## Lane W6 — County Manifest refresh and serving-sweep panel (P-44)

WORKING DIRECTORY: `/p/hauska-map-worktrees/ss-w6-cc-truth-console` (branch `ss/w6-cc-truth-console`, based on `origin/main` = 5bf06ec). Remote `https://github.com/empressaioemail-tech/hauska-map.git`.

READ FIRST: `P:/doc_repo/_catalog/parcel_fact_sheet_contract/serving-sweep.ts` (the frozen record you render) and `CONTRACT_RULES.md`. FROZEN.

### Why this lane exists

Operator ruling 2026-08-18: the statewide serving sweep renders as a panel in Command Center under the County Manifest subtab, and the County Manifest itself is stale and must be refreshed to current state.

Command Center is a read and sandbox surface over spine data, and a CONSUMER of Smart Site. It is not a second product.

### File ownership (six lanes run this repo in parallel)

YOURS: `apps/command-center/**`.

NOT YOURS: `apps/property-explorer/**` belongs to lanes P-39 and P-40; `packages/map-renderer/**` belongs to P-41 and P-42. If Command Center needs a change in either, report it to the planner rather than making it.

### What is already known about the staleness

The planner traced it before dispatch, so start from here rather than rediscovering it.

`GET /api/county-ledger` is served from `county_facet_coverage`. That table is written as a SIDE EFFECT of block runs by `packages/engine-core/scripts/upsert-county-facet-ledger.mjs` in the hauska-engine repo, whose `DEFAULT_FACETS` is only `["zoning", "envelope"]`. Nothing recomputes it, so a county's row only moves when someone re-runs a block for that county. Separately, `hasWriter` and `atomFamilyState` are HAND-DECLARED, so the manifest drifts against the engine in both directions: a registered writer is not the same as one that can produce coverage.

`apps/command-center/src/admin/control/panels/countyManifestTypes.ts` already carries the right architectural instinct in its header comment, that the rail set is derived from the API and never declared client-side, after a defect where the console printed 13 columns while the API served 14. Extend that instinct rather than working around it.

### Work items

1. Refresh the County Manifest to current state. Establish what current state actually IS by reading live, then make the refresh repeatable rather than a one-time correction. A manifest that can only be refreshed by hand will be stale again next week. Say plainly in your report which parts are now derived and which remain hand-declared, because that boundary is the thing that keeps biting.

2. Build the serving-sweep panel on the County Manifest subtab, rendering `CountyServingSweep` and `StatewideServingSweep` per the frozen record. Lane P-43 produces the data; you render it. Build against the frozen type and do not wait on them.

3. Show the two instruments SIDE BY SIDE and make disagreement visible. This is the whole point of putting them on one subtab. A rail reading satisfied at 100% next to a serving sweep reading that a large share of parcels serve no setback is the finding, and the console must surface it rather than average it away. Per DEV_PROCESS, coverage figures travel with their denominator and classes are measured never subtracted.

4. Make absences openable. A cell showing an absence rate should let the operator open the underlying parcels, since the follow-on work is per-county source review and re-ingest. `exampleParcelNodeIds` on each contradiction tally exists for exactly this.

5. Surface `unresolved` distinctly from the two absence states everywhere it appears. A failed lookup is an outage, not a coverage gap, and folding them together is what made a correct Smart Site card read as broken to the operator.

### Rules

Push your branch immediately after the first commit, then keep working. Open a PR against main. DO NOT MERGE, DO NOT DEPLOY, DO NOT push to main. Every verification command must EXIT on its own: no dev servers left running, no watch mode; use build and test runs, or background-start plus curl plus kill. Windows with Git Bash, forward slashes. Keep the suite green.

### Report back

Every file changed and why; the PR URL; verbatim build and test output; exactly which parts of the manifest are now derived versus still hand-declared; how a refresh is triggered and by whom; and anything that contradicts this briefing.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-08-18_ss-w6_cp1.json
  CP2: _inbox/2026-08-18_ss-w6_cp2.json
  CLOSE: _inbox/2026-08-18_ss-w6_close.json
