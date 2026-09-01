# hauska-map bb02f3b — customer-done review (wire only)

Snapshot: read-only, anonymous, no auth header. Live host `https://smartsite.cloud`.
All facets fetches returned `Age: 0` / `X-Vercel-Cache: MISS` — live bodies, not cache.
Instrument: `curl --max-time 30` writing to files, then `node` JSON parse from those files.
No positional CLI formatters were used. DOM/render is OUT OF SCOPE and is marked
NEEDS-BROWSER wherever it decides the verdict.

## STEP 1 — build stamp: CONFIRMED

`GET https://smartsite.cloud/` → `HTTP/1.1 200`, `Date: Mon, 31 Aug 2026 03:13:50 GMT`,
`Age: 5230`, `Cache-Control: public, max-age=0, must-revalidate`,
`Etag: "00d4bf0361a033d82c37950bcd48c70c"`, `Last-Modified: Mon, 31 Aug 2026 01:46:40 GMT`,
`X-Vercel-Cache: HIT`.

Bundle filename UNCHANGED from the reported one:

    <script type="module" crossorigin src="/assets/index-CgJc9x-_.js"></script>

`GET /assets/index-CgJc9x-_.js` → 200, 1,974,547 bytes,
`Etag: "8aee7e31650352e73162d2caf400af32"`, `Last-Modified: Mon, 31 Aug 2026 01:46:44 GMT`.
Raw grep hit from the fetched bundle:

    document.documentElement.dataset.hauskaBuild="bb02f3b503bdcc463a31eb3286429de2c8757ae1";globalThis.__HAUSKA_BUILD__="bb02f3b

Equals the expected SHA. No redeploy since. CONFIRMED.

## STEP 2 — live brief, exact strings

Endpoint: `/api/spine/cortex/api/brokerage/v1/place/node/<id>/facets`
Headers on all four: `Age: 0`, `Cache-Control: public, max-age=0, must-revalidate`,
`X-Vercel-Cache: MISS`, `Date: Mon, 31 Aug 2026 03:14:08–03:14:10 GMT`. Etags:
laird `W/"1e83-DHiCs19LpAwsXj8QnUaQlq/tY58"`, shoalwood `W/"19d4-nUdytPAld5R9CS6R0ta+bpyK3cE"`,
pinegold `W/"2c3a-znksCePRwBrhGIWfTPa4kiH/jjU"`, rainmaker `W/"1c5d-Ld8gnZZSlxZeQJHLptyISLAhPFA"`.

### 48453:231086 — 6102 Laird, Austin (snapshotAt 2026-08-30T03:17:18.179Z)

zoning: `"verdict": "stamp-missing"`, `"authority": "Austin"`, `"status": "absent"`,
`"derivation": {"method":"city-limits-containment","cityLimitsStatus":"incorporated","place":{"cityName":"Austin","geoId":"4805000"}}`,
basis `"...the parcel sits inside the incorporated place Austin and carries no zoning stamp, so the stamp is missing; zoning authority is not absent"`.

`baseFacts.landUse`: `null`. `facetCoverage.landUse`: `false`.
Beside it `landUseFact` is `{"state":"present","landUseCode":"A1","landUseLabel":null,"sourceAdapter":"cad-property-land-use-v1"}`.

envelope (in facets): `"envelope": null` (both `facets.envelope` and `tier2.envelope`);
`facetCoverage.envelope: false`. No refusal object. The only reason text is buried in
`provenance.tierNote`: `"Buildable envelope product path retired (anti-zombie / atom_path_pending) — read envelope from property atom chain."`

`structuralFact`: NO `state` key and NO `yearBuilt` key. Shape is
`{"status":"absent","verdict":"absent-verified","authority":"county-appraisal-district","scopeSearched":"cad_property tax_year=2026 tier=cad-export","basis":"CAD row present but structural fields (living_area_sqft, year_built) are null"}`.

Edge states: floodHazard `present` / `fema-nfhl-bulk-v1`; landUse `present` / `cad-property-land-use-v1`;
specialDistrict `present`; pipeline `present` / `tx-rrc-pipeline-staged-v1`;
well `refused` / `atom-miss`; buildingFootprint `refused` / `atom-miss`;
boundaryEdge `refused` / `atom-miss`; owner `refused` / `studio-gated`.
`tier2.floodDisposition`: `{"state":"refused","code":"no-flood-facet","reason":"This Tier-2 row carries no flood facet. Absent is not a determination."}`.

### 48453:493738 — 4707 Shoalwood (snapshotAt 2026-08-30T04:10:10.607Z)

zoning: `"verdict": "unmeasured"`, `"authority": "unresolved"`, `"status": "absent"`,
`"derivation": {"cityLimitsStatus":"unmeasured","queryPoint":null,"place":null}`,
scopeSearched `"incorporated-place polygons in tx_city_boundary; no usable query point"`,
basis `"no usable parcel query point; city limits are unmeasured"`.
`provenance.parcelJoin.state`: `"no-row"`.

`baseFacts.landUse`: `null`. `facetCoverage.landUse`: `false`. `baseFacts.acreage`: `null`.
`situsState`: `null`. envelope: `null`, `facetCoverage.envelope: false`.
`structuralFact`: same Travis shape — `status: "absent"`, `verdict: "absent-verified"`, no `yearBuilt`.
Edge states: ALL EIGHT `refused` — seven `atom-miss`, owner `studio-gated`.

### 48021:34137 — 908 Pine, Bastrop (snapshotAt 2026-08-29T20:02:22.015Z)

zoning: `{"district":"SF-1","jurisdictionKey":"bastrop_city_tx","provenance":{"cityKey":"bastrop-city-tx","codeField":"ZoneTypeClass","layerName":"Zoned_Parcels","sourceUrl":"https://services7.arcgis.com/qOeXJdBtGknaCJC4/arcgis/rest/services/Zoned_Parcels/FeatureServer/83","stampedAt":"2026-08-29T20:02:07.730Z"}}`.
No verdict/authority keys on a stamped parcel — a different shape from the absent case.

`baseFacts.landUse`: `null`. `facetCoverage.landUse`: `false`.
`landUseFact`: `{"state":"present","landUseCode":"A1","landUseLabel":null}`.

envelope (in facets): `"envelope": null`, `facetCoverage.envelope: false`. `buildableAreaSqFt`
appears ZERO times in the facets body, and `9350` appears zero times, on all four parcels.

`structuralFact`: `{"state":"present","yearBuilt":1910,"livingAreaSqft":null,"taxYear":2025,"tier":"cad-export","sourceVintage":"tier:stratmap-roll;adapter:stratmap;drop:stratmap25-landparcels_48021_lp"}`.

Edge states: floodHazard `present`; landUse `present`; specialDistrict `absent` with
`"absence":{"kind":"outside-tceq-source-boundaries","reason":"Parcel geometry does not intersect any polygon in tx_special_district (TCEQ Public/WaterDistricts MapServer/0) for county 48021. Finding is scoped to that source only; Comptroller registry omissions, ESD, PID, and other district types outside this layer may still apply."}` and `"verifiedAbsence": null`;
pipeline `present`; well `refused` / `atom-miss`; buildingFootprint `refused` / `atom-miss`;
boundaryEdge `present` with `"sourceAdapter":"descriptor-fixture"`; owner `refused` / `studio-gated`.
All four nested `edges[]` carry `"setback":{"state":"refused","basis":"refused: retired road-class derivation — a road class is not a setback"}` and `"sourceAdapter":"descriptor-fixture"`.

### 48021:8720522 — 111 Rainmaker Cv (snapshotAt 2026-08-29T20:07:59.184Z)

zoning: `{"district":"PDD","jurisdictionKey":"bastrop_city_tx", ...same ArcGIS provenance...}`.
`baseFacts.landUse`: `null`; `facetCoverage.landUse`: `false`; `landUseFact` `present` / `A1`.
envelope: `null`. `structuralFact`: `{"state":"present","yearBuilt":2021,"livingAreaSqft":null}`.
Edge states: flood `present`, landUse `present`, specialDistrict `absent` (outside-tceq),
pipeline `present`, well / footprint / boundaryEdge `refused` / `atom-miss`, owner `refused` / `studio-gated`.

## STEP 3 — the four fixes

### 1. Zoning verdict distinguishes stamp-missing from unmeasured — CONFIRMED (wire)

    Laird:     "verdict": "stamp-missing", "authority": "Austin",    cityLimitsStatus "incorporated"
    Shoalwood: "verdict": "unmeasured",    "authority": "unresolved", cityLimitsStatus "unmeasured", queryPoint null

Two distinct verdicts, two distinct authorities, two distinct bases, and the Shoalwood basis
names the actual cause (no usable parcel query point) rather than asserting absence. This is
the wire. Whether the two render as different customer sentences is NEEDS-BROWSER.

### 2. baseFacts.landUse — REFUTED on the wire, patched in the client projection

`baseFacts.landUse` is STILL `null` on all four, and `facetCoverage.landUse` is STILL `false`
on all four, including the three parcels whose `landUseFact` is `state: "present"` with
`landUseCode: "A1"`. The server projection was not fixed.

What WAS fixed is client-side. From the shipped bundle:

    function oN(e,r){var u;if(r&&typeof r=="object")return cr(r.state)==="present"
      ?{landUseCode:cr(r.landUseCode),landUseDescription:cr(r.landUseLabel)}
      :{landUseCode:null,landUseDescription:null};
      const s=((u=e.baseFacts)==null?void 0:u.landUse)??null; ...}

called as `oN(e, r?.landUseFact)`. The client now prefers `landUseFact.landUseCode` and only
falls back to `baseFacts.landUse`. So the customer can see `A1` — but `landUseLabel` is `null`
on the wire, so `landUseDescription` resolves to `null` and the code renders with no human
label. Separately, `facetCoverage.landUse: false` still contradicts a present A1 atom, so
anything scoring coverage off `facetCoverage` under-counts.

### 3. envelope — the 9350/ok defect is gone from FACETS, but the ENVELOPE WIRE STILL SAYS ok

In the facets brief, `envelope` is `null` on all four and `buildableAreaSqFt` appears zero times.
But the facets brief is not where the client gets the envelope. The bundle POSTs a separate call:

    await s(`${f}/brokerage/v1/place/buildable-envelope`,{method:"POST",...})

That endpoint, anonymous, for Pine gold (`Date: Mon, 31 Aug 2026 03:16:04 GMT`, `X-Vercel-Cache: MISS`):

    {"status":"ok","layer":"buildable-envelope","parcel_node_id":"48021:34137",
     "derivePath":"labelEdges+derive","setbackSource":"codified-ordinance",
     "effectiveZoningCode":"SF-1","spineZoningSource":"baked-snapshot",
     "setbacks":{"front_ft":30,"side_ft":10,"rear_ft":30,"side_corner_ft":20,"district":"SF-1"}}

    feature[0].properties: "buildableAreaSqFt":7478, "buildableAreaPct":44.9,
      "parcelAreaSqFt":16673, "maxHeightFt":35,
      "maxLotCoveragePct":0, "maxFootprintSqFt":0,
      "citationUrl":"https://www.cityofbastrop.org/page/open/18744/0/ORDINANCE%20NO.%202026-06%20B3%20Code%20Repeal%20and%20Bastrop%20Development%20Code%20Adoption.pdf"

So the wire STILL says `ok` for Pine gold. The number changed (9350 → 7478) and it now carries
a real ordinance citation, real setbacks, and a disclosure string. The exact defect the prior
review found — wire `ok` while the page says "Buildable: Not stamped here" — is therefore NOT
refuted by this review. It is NEEDS-BROWSER. The strings `"Not stamped here"` and
`"Not stamped on this parcel yet"` are both still present in the shipped bundle.

The other three envelope responses are honest and carry non-200 codes, so the client's `!b.ok`
branch catches them:

    Laird     http=200 {"status":"declined","declineReason":"no-zoning-stamp","payload":{...,"empty":true}}
    Rainmaker http=404 {"status":"no-district","reason":"No authoritative setback source covers this district — geometry not derived."}
    Shoalwood http=422 {"errorClass":"geocode_miss","message":"Could not geocode the provided address"}

### 4. Edge state union — CONFIRMED

Not a uniform `"present"`. Distinct values observed across the four briefs:

    present | refused | absent

with refusal codes `atom-miss` and `studio-gated`, and `absent` carrying a structured
`absence.kind` (`outside-tceq-source-boundaries`) plus a scope caveat naming what the finding
does NOT cover. Plus `floodDisposition.state: "refused"` / `no-flood-facet` and per-edge
`setback.state: "refused"`. Shoalwood is all-`refused`; Pine gold is mixed
`present` / `absent` / `refused`. The union is live and discriminating.

## Additional findings not in the four

**A. `structuralFact` has two incompatible shapes on one endpoint.** Travis returns
`{status,verdict,authority,scopeSearched,basis}` with NO `state` and NO `yearBuilt`.
Bastrop returns `{state:"present",yearBuilt,livingAreaSqft,taxYear}` with NO `status`.
A consumer reading `structuralFact.state` gets `undefined` on every Travis parcel.

**B. Fabricated zeros on the envelope wire.** `maxLotCoveragePct: 0` and `maxFootprintSqFt: 0`
for Pine gold. The bundle's numeric guard is
`function _u(e){return typeof e=="number"&&Number.isFinite(e)?e:null}` and the render is gated
only on `!== null`, so `0` passes and produces `Max lot coverage: 0%` / `Max footprint: 0 sq ft`.
Absent is being encoded as zero. Absent, zero and unmeasured are three different states.

**C. Situs sentinel live on the customer wire.** The envelope endpoint returns
`"situsAddress": ", TX 78757"` for Laird while the facets brief for the same parcel returns
`"6102 LAIRD DR"`. Two endpoints disagree on the same field and one of them serves the known
`", TX <zip>"` sentinel.

**D. `descriptor-fixture` is a customer-facing sourceAdapter.** Pine gold's boundary edges,
bearings and distances (`N 89°28' E`, `99.92 ft`) are served with
`"sourceAdapter":"descriptor-fixture"`. They are labelled `gis-approximate` /
`"GIS-approximate — not a survey"`, which is honest about precision, but the adapter name
says fixture.

**E. One unreproduced fail-open risk, status code NOT captured.** The first (cold) Laird
envelope POST returned `{"message":"upstream aborted after 10000ms","payload":{}}` with no
`status` field. The client computes
`c = w?.status ?? (b.ok ? "ok" : http-${b.status})` and then refuses only when
`!b.ok || (c!=="ok" && c!=="no-buildable-area")`. If that timeout body carries HTTP 200, a
timeout is coerced to `"ok"` with an empty payload. I did not capture the HTTP code on that one
occurrence and could not reproduce it in seven subsequent probes (all refusals came back
404/422, which the `!b.ok` branch catches). Competing explanation I cannot exclude: the gateway
returned 504 and the client would have refused correctly. Unresolved; needs one cold-path
capture with `-w %{http_code}`.

## STEP 4 — verdict

    1. zoning verdict stamp-missing vs unmeasured .... CUSTOMER-DONE ON THE WIRE
                                                       (render wording NEEDS-BROWSER)
    2. baseFacts.landUse ............................ NOT CUSTOMER-DONE ON THE WIRE
                                                       (still null; client projection covers it;
                                                        landUseLabel null so no human label;
                                                        facetCoverage.landUse still false)
    3. envelope ..................................... NEEDS-BROWSER — NOT CLEARED
                                                       (facets envelope null, but the real
                                                        envelope endpoint still returns
                                                        status:"ok" + buildableAreaSqFt:7478
                                                        for Pine gold; the wire-vs-DOM defect
                                                        shape is untested by this review)
    4. edge state union ............................. CUSTOMER-DONE ON THE WIRE

Customer-done requires a browser for items 1 and 3. Item 2 is not done at the source and should
not be closed on the client patch alone. Item 4 is done.
