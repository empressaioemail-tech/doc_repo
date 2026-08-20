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
repo: legacy-design-tools

# Stop serving tier2.flood, surgical

## Lane SS-W16 — Stop serving tier2.flood on the anonymous route, TODAY (P-45, items 0.5 and 0.6)

WORKING DIRECTORY: `/p/tmp/ss-w16-tier2-stop` (branch `ss/w16-tier2-stop`, off `origin/main` = `3de86ffd`). Remote `https://github.com/empressaioemail-tech/legacy-design-tools`. cortex-api lives at `artifacts/api-server/`.

READ FIRST: `P:/tmp/data fix/61_enforcement_doctrine.md` and `P:/tmp/data fix/enforcement.mdc`. They are the operating law for this lane. In particular: fail closed, presence is not validity, retirement is proven by decline rather than documentation, and no check is reported as working until it has been observed failing.

### The live exposure

Planner-verified at source, snapshot legacy-design-tools `3de86ffd`, 2026-08-19:

```
GET https://cortex-api-tds7av26va-uc.a.run.app/api/brokerage/v1/place/node/48021%3A36521/facets
HTTP 200, no authentication
tier2.flood.floodZone                 "AO"
tier2.flood.inSpecialFloodHazardArea  true
tier2.flood.provenance.adapterKey     "fema:nfhl-flood-zone"
```

That determination is **wrong**. Lane SS-W11 adjudicated 5,756 disagreements against FEMA NFHL: the `flood-hazard-fact` atom was right in 5,714 of 5,714 non-split cases and `tier2` in **zero**, including **1,995 parcels told they are outside a Special Flood Hazard Area when the parcel centroid is inside one**. The cause is at `nodeFacetBakeTier2Cli.ts:126,288-289`: the bake quantises the parcel centroid to a `FEMA_TILE_DEG = 0.005` tile and asks FEMA once at the tile centre, a measured median 227 m and maximum 366 m from the parcel it answers for.

`fema:nfhl-flood-zone` is not a separate store. It is the `adapterKey` inside tier2's own provenance, same bake, same quantiser. Ruled: they retire as a pair.

### 0.5 — the surgical stop. This is the urgent item.

**Scope narrowly.** Do NOT remove the brokerage facets route. Other consumers may depend on it for unrelated facets, and an over-broad removal creates its own outage. Strip `tier2.flood` and its `fema:nfhl-flood-zone` provenance from the response in `artifacts/api-server/src/routes/brokerageNodeFacets.ts`, or make that field raise a typed refusal. Everything else the route serves stays.

The decline shape is whatever refusal is native to the consumption path. This is not HTTP-shaped, so a 404 is the wrong instrument. The invariant is that **no value is returned** for tier2 flood. Add a CI grep that fails if the field reappears.

**Constraint on how, and it is the point of the item.** The replacement must NOT be another presence-shaped guard. What currently keeps this off Smart Site is `apps/property-explorer/src/lib/baked-facets.ts:430` in hauska-map — `base.includes("/property-atoms")` — a substring test on a config string deciding which of two semantically different flood answers a caller receives. Do not build a second one of those. Where a branch selects a route, make it explicit and exhaustive.

### 0.6 — capture the guard as a T-25 row before it is touched

Record, in your close as a machine-readable row:

```
check      baked-facets.ts:430  base.includes("/property-atoms")
predicate  substring containment on a configuration string
cheapest   ANY string containing "/property-atoms"
valid      NO — decides a hazard determination by string shape
2nd deriv  state whether one exists, per the three-state rule below
```

Also record the tier2 predicate itself, since retirement destroys evidence otherwise:

```
check      nodeFacetBakeTier2Cli.ts:126,288-289
predicate  NONE — the quantised point is used unchecked
cheapest   any coordinate within one 0.005-deg tile of the parcel (~366 m max)
valid      NO — answers for a point that is not the parcel
2nd deriv  AVAILABLE NOW — the FEMA query point must fall inside the parcel ring
```

**Second-derivation column has THREE states, not two:** available now; available once a named dependency lands, with the dependency named explicitly; none exists. Only the third is a budget question. The second is the actionable queue and disappears under a binary.

### Rules

Push your branch immediately after the first commit. Open a PR against main. DO NOT MERGE, DO NOT DEPLOY — the deploy is planner-owned and the planner will present its blast radius to the operator, because deploying cortex-api ships every other merged PR in this repo alongside your change.

Exit-bounded verification only. Every check you report as working must first be observed FAILING against a known violation; a check seen only passing has not been seen working. Declare the commit your work ran against in your output. For every finding, state the second mechanism that would produce the same observation and why you rejected it.

### Report back

The stripped-or-refused shape and why you chose it; proof the CI grep fails on reintroduction; both T-25 rows with three-state second derivations; the PR URL; verbatim verification output; anything contradicting this briefing.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-08-19_ss-w16_cp1.json
  CP2: _inbox/2026-08-19_ss-w16_cp2.json
  CLOSE: _inbox/2026-08-19_ss-w16_close.json
