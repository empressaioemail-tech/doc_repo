CANON-PREAMBLE v8c70058f
- COTALITY IS EXTINGUISHED — when code hits it (502/OAuth/fallthrough), re-route to county-gis/public-record, NEVER rotate the credential. Regrid also dead.
- DEPLOYS ARE PLANNER-OWNED — the agent deploys and fixes failed deploys; never escalate a deploy to the operator; "failed on X, fixing X".
- NO PRIVILEGED DATA — everything via uniform public-record; any path must work for a no-relationship jurisdiction.
- CTX / national HOLD LIFTED 2026-08-26 for the Factory program (`_decisions/2026-08-26_factory_program_and_hold_lifts.md`); the Bastrop QA condition is cosmetic and does not gate the data path. NO PRIVILEGED DATA and the Hauska spine rule stand.
- THE FACTORY (OPS-19, `F-` rows) — one machine built to the MODEL LAW (`19_the_instrument_contract.md`, `_blueprint/10_model.md`, `_blueprint/20_pipeline.md`, `_blueprint/40_rule_register.md`, `51_ingestion_pipeline_reference.md`, `24_instrument_conformance_program.md`; package `dist/*.d.ts` is the tiebreaker; `25_atom_architecture_reference.md` is superseded for the model): four layers, five canonicalisation stages, each stage the executor of its `BP-` rules; own repo `hauska-factory`, own Neon store, console Smart Site Factory in `hauska-map/apps/factory`; staging Smart Site under the Factory base URL and every publish lands on staging before the identical job runs on production; nothing reaches a serving store except through publish; laptop ingest is FROZEN (`_decisions/2026-08-26_ingest_freeze_and_cloud_loader.md`). **OPTION A ruled** (`_decisions/2026-08-26_factory_model_law_and_option_a.md`): P-82-lite plus BP-WRITE-01 land on the existing writer as a bug fix; Bexar 48029 cad finishes on the current shape (660,000 of 703,257 done); NO new county is written on the old shape; Harris, Dallas and the Texas remainder wait for the conformant stage E writer (F-15, F-16, F-18). STATUS 2026-08-27: Phase A closed; F-02 runner `factory-atoms-cad` (us-east4, digest-pinned, run row first) is the only writer job; OLD-SHAPE WRITES ENDED permanently (no `--apply` through the old writer for any county; Bexar 703,257 = roll, complete); the store is still the old shape and still serves; next card is the conformant writer (F-16 resolution, F-17 reconcile, F-20 stage-and-merge write, F-18 intensional demotion) on one Texas source, F-15 types from the substrate seat by request, then F-10 drains Texas, then F-06 publishes. Every lane has its own registered worktree; never build in another lane's checkout.
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
- MOST-CURRENT SOURCE WINS (operator 2026-09-11) — for setbacks and every dimensional rule, in every city and county, the source with the most recent effective date supplies the value; tier breaks ties only on equal or unreadable dates; dates are read at source (ordinance effective date, ArcGIS `editingInfo.lastEditDate`), never assumed from source kind; an unreadable date produces a conflict row with both values, never a silent pick. Supersedes tier-first ranking in LDT `authoritativeSetbackSource.ts` and layer-23-first in hauska-map. `_decisions/2026-09-11_setback_source_most_current_wins.md`.
- ENVELOPE DRAWN, FIGURE REFUSED (operator 2026-09-11) — Ruling B reversed for the polygon only: map and MCP draw block draw the modelled buildable envelope from the same `place/buildable-envelope` call with its disclosure wherever a district and setback table exist; buildable area and percent stay refused until an envelope atom backs them. Entitlement gate unchanged. `_decisions/2026-09-11_ruling_b_reversed_polygon_only.md`.
- THE CUSTOMER SURFACE IS THE PREDICATE (operator 2026-09-11, OPS-23) — a lane closes on a live probe of the surface it claims to have changed (panel facets, envelope endpoint, PDF, `get_smart_site`) on the OPS-23 §7 parcel set; a merged PR, a cortex read, a ledger count, or an MCP read alone does not close a lane. Plan `90_operations/OPS-23_surface_completion_program.md`; preamble `_catalog/program_preambles/OPS-23.md`.
- THE LEDGER IS THE SERVING PATH, ATOMS ARE CANONICAL (operator 2026-09-11) — node = identity, atom = one claim from one authority at one time, edge = an atom whose value is a node; a cell is accounting (state, atom reference, provenance, cached rendering keyed to atom version and vocabulary version), never a copied value; one reader in `hauska-engine/services/retrieval-api` walks gated cells and dereferences atoms and every surface and the Hauska MCP catalog consume it; unslated rails refuse, never fall to legacy; one writer mints atom + pointer + rendering in one transaction; one vocabulary module in the atom-contract package. Never add a read path, a vocabulary copy, or a value-holding cell. `_decisions/2026-09-11_ledger_as_serving_path_seven_steps.md`, ADR-031 amendment 2026-09-11, OPS-23 §0.
- Full standing-decisions detail: `MEMORY.md` (auto-memory) + `_decisions/`.

AGENT-CONTRACT v1890f0bb — you are bound by 90_runbooks/AGENT_CONTRACT.md in full (fan model,
interruption recovery, slot law + lease, heavy-scan serialization, verification rules, close schema).
Read it before any work; where this dispatch and the contract disagree, STOP and report.

DEV-PROCESS vbb19bd34 — you are bound by 90_runbooks/DEV_PROCESS.md in full. It governs how work
is SHAPED and how a result is JUDGED: coverage figures travel with their denominator, classes are
measured never subtracted, an instrument's exclusion set is part of its contract, gating indicators are
proven able to fire, paired controls need a divergence test, guardrails that do not survive a clone are
not guardrails. Every rule in it is traced to an incident. Read it before any work.

FLEET-MEMORY v2a98086b — you are bound by 90_runbooks/fleet_memory_practice.md (M0).
The verbatim install block follows. Product-repo agents do not carry .cursor/rules; this is the install.

FLEET MEMORY (M0): As you work, capture build knowledge in a scratch block you return in your close, using four entry kinds — LESSON (a hard-won fact worth a test/note), DEAD-END (a tried-and-failed path + reason, so it is not retried), GROUND-TRUTH (a live-verified state WITH its timestamp), OPEN (a live thread the next context must pick up). Read any scratch context passed to you FIRST before re-deriving. Do NOT promote anything to durable memory yourself — return lessons in your close; the planner gates promotion. Nearing your limit, flush open threads + live ground-truths into your close so the next instance starts warm.

PLAN-ROW: P-151 (90_operations/OPS-16_texas_market_plan_of_record.md)
repo: hauska-map

# PROGRAM CONTEXT — OPS-23 surface completion

You are working a lane of OPS-23. Everything below is program law for this lane. If it
conflicts with the general canon preamble, this section is narrower and wins on scope; if it
conflicts with the AGENT CONTRACT or ENFORCEMENT, those win. The plan is
`90_operations/OPS-23_surface_completion_program.md`; read sections 2, 3 and 7 before any work.

## The one goal

The Property Explorer panel, the map, the exported PDFs, and the Smart Site MCP connector show
the same facts for the same parcel, from one reader, with honest absences that name the city or
source that is missing. Six Central Texas counties first. **The customer surface is the
predicate.** A merged PR, a cortex read, a ledger count, or an MCP read alone does not close a
lane in this program.

## The five rulings (operator, 2026-09-11) — do not relitigate

- **R-1 MOST-CURRENT SOURCE WINS.** For setbacks and every dimensional rule, everywhere: the
  source with the most recent effective date supplies the value; tier breaks ties only when dates
  are equal or unreadable; dates are read from the source (ordinance effective date, ArcGIS
  `editingInfo.lastEditDate`), never assumed from source kind; unreadable dates produce a conflict
  row with both values, never a silent pick. `_decisions/2026-09-11_setback_source_most_current_wins.md`.
- **R-2 ENVELOPE DRAWN, FIGURE REFUSED.** The map and the MCP draw block draw the modelled
  buildable envelope from the same call with its disclosure wherever a district and a setback
  table exist. The buildable area number and percent stay refused until an envelope atom backs
  them. `_decisions/2026-09-11_ruling_b_reversed_polygon_only.md`.
- **R-3 THE CITY IS THE UNIT.** Zoning and setback work is scoped per city with a per-city
  predicate. Until a city is done, every absence string names the city.
- **R-4 THE SURFACE PROBE IS THE PREDICATE.** Your close cites a `surface-probe` artifact run
  after your deploy (or, until `scripts/surface-probe.mjs` lands, the raw output of the hand
  probes in OPS-23 §2 pasted verbatim) showing your change on the surface you claim to have
  changed.
- **R-5 THREE ROLES.** You are a lane. You do not commit to doc_repo; you hand artifacts back.
  You may fan one level per AGENT_CONTRACT §1 and verification stays with you.
- **R-6 THE LEDGER IS THE SERVING PATH AND ATOMS ARE CANONICAL.** A node is identity; an atom
  is one claim from one authority at one time; an edge is an atom whose value is a node. A cell
  is accounting: state, atom reference, provenance, and a cached rendering keyed to atom
  version and vocabulary version; a cell never holds a value as canon. One reader in
  `hauska-engine/services/retrieval-api` walks gated cells and dereferences atoms; every
  surface and the Hauska MCP catalog consume it; unslated rails refuse, never fall to legacy.
  One writer mints atom, pointer and rendering in one transaction. One vocabulary module in
  the atom-contract package. Never add a seventh read path, a second vocabulary, or a cell
  that copies a value. `_decisions/2026-09-11_ledger_as_serving_path_seven_steps.md`, OPS-23 §0.

## The probe set — every lane measures on these, and may add one, never remove one

`48021:34049` (1109 Pecan St, Bastrop, corner lot, improved 1906) · `48021:33223` (P-91 gold) ·
`48453:113408` (414 Spiller Ln, West Lake Hills, split situs) · `48453:474034` (2601 Sterling
Panorama Ct, unincorporated, Lake Pointe MUD) · `48453:367134` (5833 Taylor Draper Cv, Austin
SF-2). Calls: `GET https://smartsite.cloud/api/spine/property-atoms/<id>/facets`;
`POST https://smartsite.cloud/api/spine/cortex/api/brokerage/v1/place/buildable-envelope`
by address and by `{lat,lng}`; `POST .../brokerage/v1/map-data/gis-layer {"layer":"parcels","bbox":{west,south,east,north}}`.

## Facts a lane must carry (verified 2026-09-11; re-verify at source before relying)

- The panel reads facets through hauska-map's own adapter (`api/_lib/pe-property-atoms.ts`,
  `atom-chain-to-facets.ts`), `readPath: atom-chain`, not through cortex node-facets. The
  record-served setback cutover lives in LDT `nodeFacetTier1Assemble.ts` /
  `setbacksFactServeCutover.ts` and reaches `get_smart_site`, not the panel.
- The map draws an envelope only through `ExplorerMap.handleEnvelope`, fed by `InspectCard`
  from the sealed sheet (`fact-sheet-resolver.ts`); the card issues no lookup of its own
  (invariant I2). `sheetEnvelopeIsAtomPathPending` (`fact-sheet-resolver.ts:216-241`) is Ruling
  B's mechanism. `handleEnvelope` also gates drawing on `isEntitled` (Pro, unlocked, dev role);
  that gate is not yours to change.
- `resolveGeometry` (`fact-sheet-resolver.ts:2520-2660`) already accepts `hint.centroid`;
  `ExplorerMap.adoptSubject` passes only `{ geometry }`. The live parcel layer
  (`map-data/gis-layer`) returns the ring for a bbox around `cityLimitsFact.queryPoint`.
- cortex geocoding cannot find "414 SPILLER LN" with or without ", WEST LAKE HILLS, TX"
  (422 `geocode_miss` both ways). Placement must not depend on it.
- The feasibility engine (`hauska-engine-api-00198-cir`) completes Travis refreshes in 85 to
  154 s with 201; PE and smartsite-mcp abort at 55 s; the download endpoint serves the finished
  PDF in 0.2 s afterwards.
- Cell-state vocabulary is OPS-21's (`_catalog/program_preambles/OPS-21.md`). Six states. Use no other.

## What a lane in this program must not do

- Do not mint or backfill envelope atoms; that program resumes when P-152 closes.
- Do not change the entitlement gate or any pricing surface.
- Do not fix a naming mismatch by renaming; report it.
- Do not widen a check to admit a value it does not satisfy; report it.
- Do not read a working tree to verify a deploy; read the serving revision by field name and probe the surface.
- Do not write to a repository your seat does not own; request it from the owning seat via the close.

## Close requirements, in addition to AGENT_CONTRACT §6

- `probe:` the artifact path or the pasted raw output, per R-4.
- `falsifier:` the result you pre-registered that would have proved your change wrong, and what you observed.
- `contradicted:` what in the dispatch or the plan was wrong when you got there. "Nothing" is acceptable and must be said.
- `leave_behind:` per ENFORCEMENT.md.


## Mission — P-151 SEAM: placement never depends on geocoding

You may fan sub-agents exactly one level deep per AGENT_CONTRACT §1. Verification stays with
you. Sub-agents produce diffs and evidence; you read every diff and run every check yourself.

### Where you work

Two repos, both property seat, both registered in `_catalog/seat_register.json`:

- `empressaioemail-tech/hauska-map`, worktree `P:/seat-worktrees/property/hauska-map-p151-seam`,
  branch `fix/p151-placement-seam`, created from `origin/main` with `git worktree add`.
- `empressaioemail-tech/legacy-design-tools`, worktree
  `P:/seat-worktrees/property/legacy-design-tools-p151-point-route`, branch
  `fix/p151-envelope-point-route`, created from `origin/main`.

Declare both start commits before you write anything. `P:/hauska-map` and
`P:/legacy-design-tools` are other people's checkouts; never build there.

### What the customer saw, and what production actually holds

On 2026-09-11 the Property Explorer panel for Travis parcel `48453:113408` (414 Spiller Ln,
West Lake Hills) rendered three rows: APN, County, and the land-use description
"Single-family residential" under a label reading "Zone", with the header "No street address
on the county record". Production holds fourteen present facts for that parcel, read the same
hour from the panel's own facets endpoint and from `get_smart_site`: situs `414 SPILLER LN`,
city West Lake Hills, incorporated, land use A1, lot 1.52 ac, flood X, special district LCRA,
no pipeline within 500 ft, no well, Eanes ISD, Austin Energy, ag valuation, values for 2025 and
2026, owner.

The card is the `unplaceable` fallback (`InspectCard.tsx:1336-1345`, reached through
`inspectCardStateFromResolve` at `InspectCard.tsx:167-173`). It fell there because
`PeFactSheetResolver.resolveGeometry` (`apps/property-explorer/src/lib/fact-sheet-resolver.ts`,
around lines 2520-2660 at `fb41c05`) found no seed. Every seed source failed, in order:

```
0. hint       ExplorerMap.adoptSubject passes factSheetResolver.hint(id, { geometry: null })   -> no ring, no centroid
1. facets     envelope.geojson absent (envelope declined: no-zoning-stamp)                       -> nothing
2. derive     identityFacts uses baseFacts.situsAddress ONLY = "414 SPILLER LN"; situsCity "WEST LAKE HILLS" is a separate field
              POST /brokerage/v1/place/buildable-envelope {"address":"414 SPILLER LN"}          -> HTTP 422 {"errorClass":"geocode_miss"}
              (with the city appended, "414 SPILLER LN, WEST LAKE HILLS, TX"                    -> ALSO 422 geocode_miss)
2b. geocode   GET /api/pe-geocode?q=414 SPILLER LN&limit=1                                     -> {"features":[]}
3. ring probe runs only `if (seed)`                                                              -> skipped
=> buildParcelGeometry({ rings: [], centroidFallback: null }) returns null => unplaceable
```

Meanwhile the record itself carries a point, `cityLimitsFact.queryPoint` = `{longitude:
-97.81149, latitude: 30.29002}`, and the live parcel layer returns the parcel's ring for a bbox
around that point:

```
POST /api/spine/cortex/api/brokerage/v1/map-data/gis-layer
     {"layer":"parcels","bbox":{"west":-97.8125,"south":30.2890,"east":-97.8105,"north":30.2910}}
-> HTTP 200, featureCount 14, one feature whose properties carry prop_id 113408, adapterKey txgio:parcels:48453
```

And the point form of the envelope route hangs:

```
POST /brokerage/v1/place/buildable-envelope {"lat":30.29002,"lng":-97.81149}   -> HTTP 504 after 10.2 s
```

Bastrop parcels never hit this because the Bastrop roll stores the whole string
(`1109 PECAN ST , BASTROP, TX 78602`) in `situsAddress`. The other Travis parcel probed,
`48453:367134`, sealed only because "5833 TAYLOR DRAPER CV" happens to geocode without a city.
Whether a Travis parcel shows its facts today depends on whether its bare street name is
unique in the geocoder. That is the defect.

Second, smaller: for `48453:474034` (2601 Sterling Panorama Ct), which IS placed, the zoning
row reads "this area is not zoned or not stamped". The record says `cityLimitsFact.status:
"unincorporated"`. Unincorporated Travis has no municipal zoning; that is a finding, not a gap,
and the string hides which of the two it is.

### Rulings already on file that this card enforces, not invents

- **Invariant I5** (P-39 fact-sheet contract, in `fact-sheet-resolver.ts:2512`): "geometry is
  the navigation authority. The situs address is never the centring authority; it is only ever
  a way to ask the backend for a coordinate when nothing geometric is on hand." The record's own
  point IS geometric and IS on hand; the resolver never consults it. That is the defect in I5's
  own terms.
- **P-27 ruling** (`_decisions/2026-08-13_p27_address_to_parcel_post_gate.md`): "Do NOT build a
  geocoder. Photon keeps the coordinate path; this resolver answers address to parcel as a
  service." Address to parcel is a situs index, not a geocode.
- The cortex envelope route (`routes/brokeragePlaceBuildableEnvelope.ts:200-220`) already
  orders resolution as: explicit lat/lng honoured verbatim; situs to parcel directly (the
  strongest authority); fuzzy geocode LAST. For "414 SPILLER LN" the situs pre-pass missed and
  the route fell through to Nominatim, which missed. Do not "fix" the geocoder. Make the panel
  stop reaching it.

The operator's read, 2026-09-11: "I thought we had done away with geocoding to a certain
extent; maybe that cortex function is not caught up with the decision." The cortex function is
caught up in order but not in outcome; the panel is the caller that still ends on the geocode.

### The change — hauska-map

1. **Seed from what the record already knows, before any network call.** In
   `resolveGeometry`, after the hint, and before the live-derive and geocode steps, seed from
   the inspect wire's own point: `cityLimitsFact.queryPoint` when present, else any centroid the
   facets carry. `resolveGeometry` already reads `hint?.centroid`; the record point is the same
   shape. Then the existing step 3 ring probe runs and `pickParcelRings` matches the parcel by
   `parcelNodeId`/`apn`, which is what makes the seed safe: a wrong point yields no matching
   ring, never a wrong ring.
2. **Seed from the click.** In `ExplorerMap.adoptSubject` (`ExplorerMap.tsx:947-960`) and the
   two click handlers that call it, pass the click point as `hint.centroid`
   (`factSheetResolver.hint(parcelNodeId, { geometry, centroid: { lat, lng } })`). The PMTiles
   path deliberately passes no ring (clipped per tile); a point is not a ring and is safe to
   pass.
3. **Compose the address you still send, and send it to the situs index first.** Where the
   resolver or `live-envelope-augment.ts` builds an address from `baseFacts.situsAddress`,
   append `situsCity` and `situsState` when present and not already contained. When the resolver
   still needs a coordinate from an address (nothing geometric on hand, which after steps 1 and 2
   should be rare), ask PE's own situs search (`api/pe-situs-search.ts`, the Find path,
   `PE_SITUS_SEARCH_URL`) with the county FIPS from the parcel node id, and accept a hit only
   when it returns this exact `parcelNodeId`; fall to the envelope route's address form only
   after that. Record in the close whether the situs search resolves `48453:113408`; if it does
   not, that is a P-27 finding for `leave_behind`, not something to work around with a geocoder.
4. **Relabel the fallback row.** `InspectCard.tsx:1342` `label="Zone"` renders
   `card.landUseDescription`. It is land use. Label it "Land use".
5. **Unincorporated is a finding.** Where the zoning absence string
   "this area is not zoned or not stamped" is produced (`fact-sheet-resolver.ts` near line
   1726), branch on `cityLimitsFact.status === "unincorporated"` and say
   "unincorporated <County> County: no municipal zoning applies". Keep the existing string for
   the in-city no-stamp case, and make it say in-city: "inside <city> limits; no zoning layer on
   file for <city>". Both strings name the jurisdiction. Reuse the vocabulary module if the
   panel's strings live there; do not add a third copy.

Do not change `sheetEnvelopeIsAtomPathPending` or anything Ruling B touches; that is P-153 and
it branches after you merge.

### The change — legacy-design-tools

6. **Cortex Travis lookups must answer or refuse inside their budget.** Three cortex reads on
   Travis hung in one hour on 2026-09-11: `POST /brokerage/v1/place/buildable-envelope
   {lat,lng}` returned 504 at 10.2 s for `30.29002,-97.81149`; PE's situs search
   (`GET /api/pe-situs-search?q=414 SPILLER LN&countyFips=48453`) returned 502
   `{"error":"situs_search_unreachable","message":"cortex timed out after 5000ms"}`; and
   `GET /api/spine/property-atoms/48453:474034/facets` hung a full 60 s once and answered in
   1.9 s on retry. Treat these as one class until shown otherwise. Read `routes/brokeragePlaceBuildableEnvelope.ts` and the point
   resolution it calls. State the mechanism you believe explains the hang, state a second
   mechanism that would produce the same observation, and say why you rejected it, before you
   change anything (ENFORCEMENT "Reporting findings"). The fleet has a recorded instance of a
   hanging point route (`place/radius-search`, 504 at 300 s, 2026-08-31); check whether this is
   the same code path. The fix is a bounded resolution that returns a declared refusal
   (`errorClass`, `message`) when it cannot resolve in time, never a 504. If the fix is larger
   than a bounded timeout plus a refusal, stop, report the size, and let the operator route it;
   the hauska-map half does not depend on this route once seeds 1 and 2 exist.

### Verification, and the falsifier you pre-register

Before running anything, write down: *if after the hauska-map change `48453:113408` still
resolves unplaceable, or if the ring probe returns a ring for a parcel other than 113408, the
fix is wrong.* Then:

- Unit tests with the resolver's injectable fetch, using fixtures captured from the live
  responses above (paste them into the fixture with their capture timestamp): 113408 seals with
  a ring from the record point; a parcel with no record point and no click still degrades to
  unplaceable rather than throwing; a click point on parcel A while inspecting parcel B seeds
  nothing (identity guard).
- The fallback-card test asserts the label "Land use".
- The unincorporated string test uses `48453:474034`'s wire shape.
- Non-vacuity: a test proving the seed path returns a ring for at least one real input; a
  test that only proves it runs is not enough.

Deploy per the standing decision (deploys are lane-owned): hauska-map Property Explorer through
the Vercel CLI for the property-explorer app, then confirm the new deployment is what the alias
serves (fleet memory: Vercel does not auto-deploy this app; CLI exit code is not deploy state;
judge by the live bundle). LDT through the cortex-api canary workflow, then read the serving
revision by field name from the traffic JSON, never positionally.

Then the probe, after deploy, raw output pasted into the close:

```
GET  https://smartsite.cloud/api/spine/property-atoms/48453%3A113408/facets           -> expect cityLimitsFact.queryPoint present
POST .../brokerage/v1/map-data/gis-layer  bbox around that point                      -> expect the 113408 ring
POST .../brokerage/v1/place/buildable-envelope {"lat":30.29002,"lng":-97.81149}       -> expect a status inside 10 s, never 504
```

and the operator's own screenshot of `48453:113408` showing the header `414 SPILLER LN` and the
flood, lot, land use, special district, school, utility and value rows, plus `48453:474034`
showing the unincorporated string. The screenshot is part of the predicate; ask for it in the
close and do not close without it.

### Close

AGENT_CONTRACT §6 artifact at the path the dispatch names, plus the OPS-23 preamble's four
fields: `probe`, `falsifier`, `contradicted`, `leave_behind`. If you found the split-situs shape
in any county other than Travis, name the county in `leave_behind`; that is the trigger for the
deferred per-county situs JOIN.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-09-11_p151-seam_cp1.json
  CP2: _inbox/2026-09-11_p151-seam_cp2.json
  CLOSE: _inbox/2026-09-11_p151-seam_close.json
