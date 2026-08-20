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
repo: legacy-design-tools

# Sweep endpoint and manifest recompute

## Lane SS-W7 — The sweep endpoint and a real manifest recompute (P-44)

WORKING DIRECTORY: `/p/tmp/ss-w7-sweep-endpoint` (branch `ss/w7-sweep-endpoint`, off `origin/main`). Remote `https://github.com/empressaioemail-tech/legacy-design-tools`. cortex-api lives at `artifacts/api-server/`.

READ FIRST: `P:/doc_repo/_catalog/parcel_fact_sheet_contract/serving-sweep.ts` — the frozen record you serve.

### Why this lane exists

Command Center has a serving-sweep panel, built and deployed. It probes `GET /api/serving-sweep` and gets the SPA fallthrough (HTTP 200, text/html), so it renders an honest not-served state naming the URL. The data exists as JSON artifacts. Nothing joins the two.

That missing route is a planner seam error: the record shape was frozen so the producer and consumer lanes could run in parallel, and nobody was assigned the pipe. You are the pipe.

### Work items

1. `GET /api/serving-sweep` on cortex-api, serving `StatewideServingSweep` per the frozen record, with per-county detail addressable. Same service that serves `/api/county-ledger` (see `artifacts/api-server/src/countyLedgerCompute.ts` for the established pattern).

2. A real recompute route for the county ledger. Today `/api/county-ledger/recompute` and `/refresh` both return the SPA fallthrough, so nothing can refresh the manifest: a county row only moves when someone re-runs a block for it. That is why the live ledger is materialized 2026-08-14T17:41:22.500Z and four-plus days stale.

3. **The staleness is worse than a stale number and this is the operator's priority.** The L26 effort landed footprints in 174 counties closing 2026-08-17 12:43Z; the ledger reports `footprint` as not-yet on all 254 cells because it was computed 67 hours earlier. Decisions are being made against a snapshot that predates the work. A recompute route is the fix; make it callable and make its result carry a fresh `computedAt`.

4. Never let a re-read masquerade as a recompute. If a recompute does not move `computedAt`, that is evidence of upstream staleness and must be reported as such, never as success.

### Rules

Push your branch immediately after the first commit. Open a PR against main. DO NOT MERGE, DO NOT DEPLOY, DO NOT push to main. Exit-bounded verification only: build and test, or background-start plus curl plus kill. Never a watch, tail or serve left running. Keep the existing suite green.

### Report back

Route shapes and their contracts; how a recompute is triggered and by whom; the PR URL; verbatim verification output; anything contradicting this briefing.

---

## EVIDENCE DISCIPLINE (planner requirement, 2026-08-19)

Every number you report names WHICH OF THREE LAYERS it came from:

```
WRITTEN   atoms actually in the store
SCORED    county_facet_coverage / GET /api/county-ledger
SERVED    what Smart Site actually shows a human
```

All three disagree independently. A rail can be written, unscored and unserved in three different amounts.

**Every figure sourced from the ledger travels with its `computedAt`.** The live ledger is materialized `2026-08-14T17:41:22.500Z` and is stale BY MORE THAN THE WORK IT DESCRIBES: the L26 effort landed footprints in 174 counties closing 2026-08-17 12:43Z, 67 hours later, and that ledger still reports footprint as not-yet on all 254 cells. The planner read it as world-truth and told the operator footprints were not ingested. A ledger figure is a claim about its timestamp, never about now.

**Label every claim by how you know it:** VERIFIED at source by you, INFERRED by you, or RELAYED from another lane's report. Do not restate another lane's magnitude as your own finding. The planner has been quoting SS-W5's counts all week having verified only the mechanisms behind them, and is no longer doing that.

**A malformed probe is not evidence.** A bare POST to a cortex-api route returns `411 Length Required`, which proves nothing about whether the route exists; probing with a body gives `404`. Check what your instrument is actually measuring before you report what it says. Every defect this programme has found is a version of that one mistake.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-08-19_ss-w7_cp1.json
  CP2: _inbox/2026-08-19_ss-w7_cp2.json
  CLOSE: _inbox/2026-08-19_ss-w7_close.json
