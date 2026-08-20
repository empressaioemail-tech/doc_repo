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

PLAN-ROW: P-47 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: legacy-design-tools

# Scorer correctness: zoning zeros and orphaned facet key

## Lane SS-W13 — Scorer correctness: the zoning zeros and the orphaned facet key (P-47)

WORKING DIRECTORY: `/p/tmp/ss-w13-scorer-correctness` (branch `ss/w13-scorer-correctness`, off `origin/main`). Remote `https://github.com/empressaioemail-tech/legacy-design-tools`. Scorers live at `artifacts/api-server/`.

### Why this lane exists

Two defects in scorers that DO run, distinct from the six rails that have no scorer at all (lane SS-W12 owns that).

**Defect 1: the zoning scorer records zero for counties that serve zoning.** Planner-verified, three independent instruments, 2026-08-19:

```
SERVED   GET smartsite.cloud/api/spine/property-atoms/48453:149405/facets
         -> zoning {"district":"SF-2"}, facetCoverage.zoning TRUE, readPath atom-chain
WRITTEN  lane SS-W8 probe: Travis 233,249 zoning atoms
         lane SS-W5 statewide sweep: 233,247 ZONED Travis parcels (agrees within 2)
SCORED   live ledger: Travis 48453 zoning displayState not-yet, honestCoveragePct 0,
         source null
```

Same shape on Bexar 48029, McLennan 48309, Guadalupe 48187 and Bell 48027 — all scored 0.00% not-yet with null source. Bastrop 48021 envelope reads not-yet while carrying 99.77% coverage.

So zoning is written, served to customers today, and scored zero. Find out why. This is a correctness bug in a scorer that runs, and it has been steering how the portfolio sizes jurisdiction depth — a planner memory asserting "zoning depth is ONE county" was written off these zeros and has since been disproven.

**Defect 2: a facet-key mismatch orphaning live rows.** `countyCoverageScoreCli.ts` writes facet `land-use` while the rail key is `landuse`. Lane SS-W9 measured 19 live scorer rows orphaned by it. Fix the mismatch and reconcile the orphans; decide and state whether the fix is to rename the written facet, alias at read time, or both, and say what happens to rows already written under the wrong key.

**Related, verify before assuming:** SS-W9 reports the store showing 19 zoning cells satisfied while the console shows 1, which it attributes to a read-time depth gate. Establish whether that is a third defect or a correct gate, and say which.

### Rules

Push your branch immediately after the first commit. Open a PR against main. DO NOT MERGE, DO NOT DEPLOY, DO NOT push to main. Exit-bounded verification only. Read-only against production databases; any write path must be proven by dry-run first. Keep the suite green. Lane SS-W12 is working the same repo on the scorer capability — coordinate on file ownership and do not both edit `countyCoverageScoreCli.ts` blind.

### Report back

Root cause of the zoning zeros with evidence; the facet-key fix and what happens to orphaned rows; your verdict on the 19-versus-1 depth gate; the PR URL; verbatim verification output.

---

## EVIDENCE DISCIPLINE (planner requirement)

Every number names WHICH OF THREE LAYERS it came from: WRITTEN (atoms in store), SCORED (`county_facet_coverage` / `GET /api/county-ledger`), SERVED (what Smart Site shows a human). All three disagree independently.

Every figure sourced from the ledger travels with its `computedAt`. Label each claim VERIFIED by you, INFERRED by you, or RELAYED from another lane. Do not restate another lane's magnitude as your own finding.

A malformed probe is not evidence: a bodyless POST to a cortex-api route returns `411 Length Required` and proves nothing; with a body it returns `404`. Check what your instrument measures before reporting what it says. The planner has been wrong twice this week by stopping at the first mechanism that fit the observation — footprints "not ingested" (they were, in 174 counties) and then "the ledger is 67 hours stale" (a recompute moves zero cells; there is simply no footprint scorer). Find the cause, not a cause.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-08-19_ss-w13_cp1.json
  CP2: _inbox/2026-08-19_ss-w13_cp2.json
  CLOSE: _inbox/2026-08-19_ss-w13_close.json
