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

PLAN-ROW: P-40 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: hauska-map

# Smart Site consumer surface

## Lane W2 — Smart Site consumer surface (P-40)

WORKING DIRECTORY: `/p/hauska-map-worktrees/ss-w2-consumer-voice` (branch `ss/w2-consumer-voice`, based on `origin/main` = 5bf06ec). Remote `https://github.com/empressaioemail-tech/hauska-map.git`.

READ FIRST: `P:/doc_repo/_catalog/parcel_fact_sheet_contract/CONTRACT_RULES.md`, invariants I3 and I4 especially. FROZEN. Dispute it by stopping and reporting, never by changing it.

### Why this lane exists

Smart Site ships internal engineering language to consumers, and styles correct behaviour so it reads as failure. Verbatim from the operator QA pass: "there is a lot of irrelevant text in the black box, most of the info (inside the parenthesis) is not valuable to the consumer... it seems to be our personal info where we pull the data from", and separately "the data box on the left of the screen looks like its displaying error messages".

The second one is the subtle one. That Travis County card was working correctly. Grey italic "not verified here" is the system honestly refusing to invent facts outside stamped coverage. It is styled like a failure, so a user reads three greyed rows as a broken app. The system was right and the design was lying about it.

### File ownership (six lanes run this repo in parallel)

YOURS: `apps/property-explorer/src/browse/InspectCard.tsx` (JSX, styling, copy), `src/browse/TerrainExportSection.tsx`, `src/browse/PropertyBriefPanel.tsx`, `src/browse/SmartFilesMountStub.tsx`, `src/browse/SitePlanExportSection.tsx`, plus the CI guard you add.

NOT YOURS: lane P-39 owns InspectCard's DATA SOURCE and all of `src/lib/**`, `src/browse/SearchBar.tsx`, `src/browse/ExplorerMap.tsx`, `api/**`. You own how InspectCard renders; P-39 owns what it reads. Stay strictly on your side of that line. Lanes P-41 and P-42 own `packages/map-renderer/**`.

### Work items

1. Delete the hardcoded internal roadmap note. `InspectCard.tsx` renders unconditionally, on every parcel: "I-Code building citations on deep research when ICC ingest is live — operator credentials pending (WDLL 31 hold)". WDLL 31 is one of our own work items and it is shipping to customers.

2. Remove `SmartFilesMountStub` from the consumer surface. It is a dev probe printing a folder id and the sentence "Isolation probe, not this parcel's room. Save/share stay the get-by." Verify whether anything else consumes it before deleting the component itself.

3. Invariant I3, provenance demoted not deleted. `src/lib/baked-facets.ts` currently CONCATENATES provenance into the value string: `formatLandUseDisplay` returns "A1 — Single-family residential (cad-roll · data-export-01.14.2026)" as one string, and `formatAcreageDisplay` returns "0.2345 ac (shoelace-wgs84)". Lane P-39 is splitting those into `Fact.value` and `Fact.provenance`. YOUR job is presentation: primary display shows the value, provenance renders in a disclosure affordance. The `SetbackXrayDetail` pattern already in `InspectCard.tsx` (the `xrayOpen` toggle) is the reference implementation, reuse it. Provenance is demoted, never removed: selling reasoning rather than data means the citation IS the product, it just does not belong shouting on the card face. Until P-39 lands, build against the frozen `Fact<T>` type from the contract.

4. Invariant I4, failure is not an absence. Give `absent-covered`, `absent-uncovered` and `unresolved` three visually distinct treatments. An honest absence must read as a designed state that names what would fill it (`wouldBeFilledBy`), not as an error. `unresolved` is an error and must look like one. This is the fix for the "looks like error messages" report.

5. Saved-property state. The `Save property` button in `InspectCard.tsx` has no `isSaved` prop at all, so it re-offers Save on an already-saved property and there is no unsave. The correct pattern is eleven lines above it in the same file: the `Make subject` button reads `isSubject`, disables itself and relabels to "Subject property". Apply the same pattern and add unsave in place rather than sending people to My Properties.

6. Source-encoding defect and its guard. `src/browse/TerrainExportSection.tsx` carries literal mojibake committed in the source: line 157 `Terrain export Â· public-paid`, line 203 `Exportingâ€¦`, line 113 `ready â€” download below`, seven occurrences total. `api/spine.ts` has two more, but that file belongs to P-39, so report those to the planner rather than editing it. The file was saved double-encoded. Fix yours and add a CI check that fails the build when the mojibake signatures appear in source, because this will recur.

7. The vacant-parcel header renders a bare double-quote character where an address is missing. Render a designed no-address state instead.

### Rules

Push your branch immediately after the first commit, then keep working. Open a PR against main. DO NOT MERGE, DO NOT DEPLOY, DO NOT push to main. Every verification command must EXIT on its own: no dev servers left running, no watch mode. Windows with Git Bash, forward slashes. Keep the suite green.

### Report back

Every file changed and why; the PR URL; verbatim pasted build and test output; anything that contradicts this briefing. Include a before/after description of the three absence treatments so the planner can judge whether an absence still reads as an error.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-08-18_ss-w2_cp1.json
  CP2: _inbox/2026-08-18_ss-w2_cp2.json
  CLOSE: _inbox/2026-08-18_ss-w2_close.json
