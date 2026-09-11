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
