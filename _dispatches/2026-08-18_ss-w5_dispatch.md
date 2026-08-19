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

PLAN-ROW: P-43 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: hauska-engine

# Statewide serving sweep

## Lane W5 — Statewide serving sweep (P-43)

WORKING DIRECTORY: `/p/hauska-engine-worktrees/ss-w5-serving-sweep` (branch `ss/w5-serving-sweep`, based on `origin/main` = ebe6d63). Remote `https://github.com/empressaioemail-tech/hauska-engine.git`.

READ FIRST: `P:/doc_repo/_catalog/parcel_fact_sheet_contract/serving-sweep.ts` (the frozen record shape you emit) and `CONTRACT_RULES.md` in the same folder for the vocabulary. FROZEN by the planner. Dispute an invariant by stopping and reporting, never by changing it.

### Why this lane exists

The County Manifest answers "did a writer run for this county". It is written as a side effect of block runs by `packages/engine-core/scripts/upsert-county-facet-ledger.mjs`, with default facets of only `zoning` and `envelope`, and `hasWriter` / `atomFamilyState` are hand-declared. It therefore drifts against the engine in both directions and nothing recomputes it.

Your sweep answers a different question: what does Smart Site actually SERVE a human, for every parcel. The two questions diverge, and the divergence is the finding.

The operator refused a golden-parcel regression set, and was right to: sampling narrowed scope on Bastrop once and certified a broken county. You sweep every parcel in an area. You never sample.

### The question that starts this lane

OPS-16 row P-27 records situs as **99.3% populated**. The operator has missing addresses on single-family parcels in at least two counties: Bastrop `48021:36521`, which is `1503 Farm St, Bastrop TX 78602` on the county CAD roll, and Travis `17005 Simsbrook Drive, Pflugerville TX 78660`. Both cannot be true. Either 99.3% is a store-side number and the serving path drops addresses on the way to the surface, or the number is wrong. Settle it with evidence.

### Work items

1. Locate the parcel roster and the serving read paths. The sweep must measure what the PRODUCT serves today, not what the store holds, so drive it through the same reads Smart Site makes: the baked-facets BFF, the buildable-envelope resolve, and the flood path. Read `apps/property-explorer/src/lib/baked-facets.ts`, `lib/parcel-lookup.ts` and `lib/buildable-envelope.js` in `https://github.com/empressaioemail-tech/hauska-map` to enumerate them precisely. The gap between store truth and served truth is the thing being measured, so do not shortcut to a direct store query and call it the answer.

2. Emit `CountyServingSweep` per county and `StatewideServingSweep` overall, exactly per the frozen record. Tally `present` / `absentCovered` / `absentUncovered` / `unresolved` per field. A non-zero `unresolved` is an outage, not a coverage gap, and must never be folded into an absence count.

3. Compute the contradiction tallies. These are the defects a coverage percentage cannot see, and every one is drawn from a real observation in the 2026-08-18 QA pass: envelope reported not-derived while an area was rendered; two code paths reporting different flood zones for one parcel; a field reported unavailable that identity or geometry already carries (the X-ray PDF printed "County name is not on file" for a parcel whose id begins with its FIPS); situs absent on the served sheet but present on the county CAD roll; setbacks present on the card and absent on the brief.

4. Break every tally out for the single-family residential class separately. That is where the address gap was observed and it is the class a consumer surface is judged on.

5. Report absence CLUSTERS, not just counts. The operator reports "even places in Bastrop County saying it cant find setbacks". Name the geographic shape of each hole so it can be traced to a source. A scattered absence and a contiguous regional hole are different findings with different fixes.

6. Record `sourcesByField` per county, so the follow-on work (re-open each county's data sources and re-ingest) starts from a list rather than an investigation. The operator has already named that as the next step after this report.

7. Deliver the REPORT FIRST. Operator instruction, verbatim: "make the report first then we will have to look at the data sources for each county and open each one up again and do another ingest". Ship the statewide report as a dated artifact before any polish.

### Hard constraints

RUN ONE COUNTY END TO END BEFORE SCOPING WAVES. Standing lesson from the L2 acquisition work: five blockers surfaced serially, each found only after the prior one cleared. Prove the whole chain on a single county and report what you learned before scaling to 254.

SERIALIZE HEAVY DATABASE SCANS. Do not parallelize them. A statewide parcel scan is exactly the shape that has destabilised this environment before. Respect the slot law in the agent contract.

Bastrop `48021` is the natural first county: the operator's examples live there, it is the most-warmed jurisdiction, and both known-good and known-bad parcels are available. Travis `48453` should be second because it carries the other confirmed address gap and a different pipeline.

### Rules

Push your branch immediately after the first commit, then keep working. Open a PR against main. DO NOT MERGE, DO NOT DEPLOY, DO NOT push to main. Every verification command must EXIT on its own: no watch mode, no non-exiting processes, no unbounded scans without a stated row cap. Windows with Git Bash, forward slashes.

### Report back

The one-county proof and what it taught you before you scaled; the statewide report artifact path; the verbatim answer to the 99.3% question with the numbers behind it; the contradiction tallies; the absence clusters; and anything that contradicts this briefing. Every coverage figure travels with its denominator, per DEV_PROCESS. A percentage without its denominator is not a result.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-08-18_ss-w5_cp1.json
  CP2: _inbox/2026-08-18_ss-w5_cp2.json
  CLOSE: _inbox/2026-08-18_ss-w5_close.json
