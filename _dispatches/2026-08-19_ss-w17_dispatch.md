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

PLAN-ROW: P-45 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: hauska-engine

# Containment check and harness promotion

## Lane SS-W17 — The containment check, and promoting the adjudication harness (P-45, items 0.7 and 1.0)

WORKING DIRECTORY: `/p/hauska-engine-worktrees/ss-w17-containment` (branch `ss/w17-containment`, off `origin/main` = `d3f3794`). Remote `https://github.com/empressaioemail-tech/hauska-engine.git`.

READ FIRST: `P:/tmp/data fix/61_enforcement_doctrine.md` and `P:/tmp/data fix/enforcement.mdc`. They are the operating law. Then read lane SS-W11's close at `P:/doc_repo/_inbox/2026-08-19_ss-w11_close.json` — you are promoting its adjudication harness.

### The gate this lane exists to satisfy

`tier2` flood is being retired because it is wrong: it quantises the parcel centroid to a 0.005-degree tile and asks FEMA once at the tile centre, a measured median 227 m from the parcel. The replacement is the `flood-hazard-fact` atom, which scored **5,714 of 5,714** against FEMA NFHL in SS-W11's adjudication.

**That is evidence, not a guarantee, and it is exactly the kind of clean result that invites treating an unchecked instrument as trustworthy.** Tier2 would also have passed an adjudication of one parcel that happened to sit near a tile centre.

Operator ruling: **do not repoint any consumer to the flood-hazard-fact atom until that atom carries the containment check.** Otherwise the retirement replaces one unchecked hazard determination with another that currently happens to be right, and buys a better number rather than a better instrument.

### 0.7a — the containment check

Build it as a MEANING-SHAPED check per the constructive rule: a presence-shaped check has one input; a meaning-shaped check has two or more independently derived inputs and asks whether they agree.

The two derivations here are the FEMA query point and the parcel's own geometry ring. **The point at which the hazard was determined must fall inside the parcel it answers for.** No sentinel satisfies that, because it would have to be correct in both derivations at once.

Fail closed. A determination whose query point falls outside the ring does not get a lower confidence score; it refuses. Per the doctrine: never emit a value computed without a required input.

Note two things you will hit. Some parcels have no ring — SS-W15 measured PostGIS `geom` on zero features in **189 of 253 counties** holding parcels, all-or-nothing with no partials. A missing ring is not a failed containment check; it is an unmeasurable one, and those are three different states that must not collapse. And SS-W11 found genuinely split parcels, 42 of them all in Bastrop, where more than one zone is legitimately correct.

### 0.7b — promote the adjudication harness

SS-W11 built the only instrument in this estate that has ever adjudicated a determination against an external authority: it compared 5,756 parcels against NFHL_48_20260101 and classified every disagreement. Its target is being retired. **Its method is the thing that caught this, and it is the shape every other check should be converted toward.**

Do not retire it because its subject went away. Promote it to a standing check on the replacement: it runs against `flood-hazard-fact`, against NFHL, on a trigger, and fails on disagreement beyond a declared band.

Per the three-question gate, state in your close what executes it, what triggers it, and what fails when it is violated. If the honest answer to any of those is that a human remembers, say so rather than shipping it.

### 1.0 — repoint and retire, GATED on 0.7 passing

Only after the containment check exists and the promoted harness has run against the replacement.

Consumer set, re-derived by the planner at current main. SS-W11's earlier list named three readers; two no longer exist and four were never listed, which is why this set is re-derived rather than inherited:

```
hauska-map 204789f   pe-property-atoms.ts, pe-share-brief.ts, pe-share-view.ts,
                     fact-sheet-resolver.ts, compare-facts.ts
ldt 3de86ffd         nodeFacetBakeTier2.ts, nodeFacetTier2Constants.ts,
                     nodeFacetBakeTier2Cli.ts (THE WRITER), brokerageNodeFacets.ts,
                     propertyExplorer.ts
hauska-engine        9 files, all audit instruments — see the three buckets below
```

Retire the writer end to end, not just the read path. Retiring readers while `nodeFacetBakeTier2Cli` keeps generating tile-quantised determinations produces wrong data behind a closed door, which looks resolved and is worse than the current state.

Remove the guard structurally rather than documenting it. `pe-property-atoms.ts` currently strips `tier2.envelope`; documenting that the composer deliberately omits flood would be prose, and prose does not enforce.

**The nine engine instruments split three ways, not two.** REPOINT the duplicate-subject detector, whose subject — two answers existing for one thing — survives this retirement and will be needed for the next. PROMOTE the adjudication harness per 0.7b. RETIRE the tier2-specific sweep probes, whose subject and method are both gone.

### Rules

Push immediately after the first commit. PR against main. DO NOT MERGE, DO NOT DEPLOY. Read-only against production databases; serialize heavy scans. Exit-bounded verification only.

Every check you report as working must first be observed FAILING against a known violation. Declare your snapshot in your output. For every finding, state the second mechanism that would produce the same observation and why you rejected it — the planner reported this whole defect wrongly yesterday by checking one read path and reporting a property of the system.

### Report back

The containment check with proof it fails on a known violation; the promoted harness answering all three gate questions; the three-bucket disposition of the nine instruments; what 1.0 repointed and retired; the PR URL; verbatim verification output.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-08-19_ss-w17_cp1.json
  CP2: _inbox/2026-08-19_ss-w17_cp2.json
  CLOSE: _inbox/2026-08-19_ss-w17_close.json
