---
id: 2026-09-12_cotality_reengagement_division_cogs_and_probe
title: Cotality re-engagement — rail division, per-call COGS model, and live credential probe
date: 2026-09-12
status: active
kind: research
applies_to: portfolio
owner: nick
related: [_decisions/2026-07-13_cotality_swap_public_record_migration, _decisions/2026-06-16_cotality_consumer_display_license_gate, 75l_cotality_data_stack_catalog, 77b_cotality_integration_strategy, _research/2026-06-06_cotality_api_surface_catalog, 90_operations/OPS-21_serve_completion_program, 90_operations/OPS-22_spine_architecture_map, _smartsite_gtm/09_crm_courthouse_agent_roadmap]
---

# Cotality re-engagement — division, COGS, and live probe

> **Posture.** Analysis and grounding for a commercial decision that has not been made.
> This is NOT a plan of record and carries NO plan row. Nothing here dispatches.
> The standing directive from `_decisions/2026-07-13_cotality_swap_public_record_migration.md`
> stays in force until a commercial agreement is in hand and read: a live-code Cotality
> failure is a re-route, never a credential rotation.

## Snapshot

Written 2026-09-12. The rail set was read from the compiled `rail-keys.js` at engine
commit `22e71e1` (`P:\tmp\parcel-record-js-22e71e1\`), because the `P:\hauska-factory`
checkout on this machine sits at "Initial commit" and carries no live source. It
corroborates against OPS-21's own description of the same set, so two derivations agree.
The Cotality REST surface is from `_research/2026-06-06_cotality_api_surface_catalog.md`,
captured from the authenticated portal. The probe section was run live on 2026-09-12 from
this repo, with credentials read from GCP Secret Manager. Probe scripts are session
scratchpad artifacts and are not tracked; the raw output is pasted below so the finding
survives without them.

## 1. What changed

The operator met Cotality on 2026-09-11 and reports a commercial agreement arriving that
week. Terms as stated: pay per use, no deposit, no upfront dataset purchase, access to the
full library through API and MCP, billed monthly in arrears. The operator has ruled that
there is no room for renegotiation and no appetite for one, on the grounds that reopening
terms costs months. All design below works inside those terms as given.

This supersedes the open re-engagement recorded at R11 in
`_smartsite_gtm/09_crm_courthouse_agent_roadmap.md` on 2026-09-03, which correctly
declined to treat the earlier signal as a reversal. It does not yet supersede the
2026-07-13 decision, because that decision's reversal criteria turn on entitlements and
keys, and the commercial agreement has not been read.

Two prior constraints are narrower than this repo recorded them. The Closed Secure System
clause prohibiting outputs reaching end users belongs to the 2026-07-14 MCP **eval**
agreement, not to the commercial agreement. The 100 requests per day ceiling is likewise
an eval and testing tier quota. Both still bind everything done on the eval channel today.

## 2. Credential probe, 2026-09-12

Secrets present. `legacy-design-tools-prod` carries the six `COTALITY_*` REST secrets,
latest versions dated 2026-06-06 through 2026-06-15. `hauska-prod-497015` carries the same
six plus `COTALITY_MCP_UAT_CLIENT_ID` and `COTALITY_MCP_UAT_CLIENT_SECRET`, both created
2026-07-14T18:53. All keys are 48 characters and all secrets 64, matching the documented
shape.

Token mint, using the auth form verified live on 2026-06-15 (HTTP Basic, `grant_type` in
the query string, empty body with an explicit `Content-Length: 0`):

```
property     500 {"fault":{"faultstring":"Invalid client identifier","detail":{"errorcode":"oauth.v2.InvalidClientIdentifier"}}}
spatialtile  500 {"fault":{"faultstring":"Invalid client identifier","detail":{"errorcode":"oauth.v2.InvalidClientIdentifier"}}}
riskmeter    500 {"fault":{"faultstring":"Invalid client identifier","detail":{"errorcode":"oauth.v2.InvalidClientIdentifier"}}}
mcp_uat      200 {"access_token":"...", "expires_in":"3599", "token_type":"Bearer"}
mcp_prod     500 {"fault":{"faultstring":"Invalid client identifier","detail":{"errorcode":"oauth.v2.InvalidClientIdentifier"}}}
```

Property, Spatial Tile and RiskMeter are dead, consistent with the ~2026-07-06 demo
expiry. Production MCP is dead against the UAT credential, which is expected.

**The MCP UAT channel is live and had never been probed.** The 2026-07-14 record states
creds were not yet delivered. They were delivered the same day, written to Secret Manager,
and left untouched for two months. `expires_in` returns as the numeric string `"3599"`,
the documented coercion hazard.

## 3. What the live MCP channel exposes

Server identifies as `litellm-mcp-server` v1.0.0, so Cotality's MCP is itself a proxy over
their APIs. Eleven tools across four sub-servers, each declaring a required scope. The
token response carries no scope field, so entitlement is attached server side to the
client.

| Tool | Required input | Scope | Result on a live Travis parcel |
|---|---|---|---|
| `clip-find_property_by_clip` | `clip` | `clip:find-by-clip` | works |
| `clip-find_property_by_address` | `fullAddress` | `clip:find-by-address` | works, real data |
| `pd-get_property_characteristics` | `clips` | `property:characteristics` | works, 84 leaf fields |
| `at-get_property_analytics` | `clips` | `risk:analytics` | works, 13 fields, climate only |
| `at-get_property_climate_risk` | `clips` | `risk:climate-analytics` | works, identical payload |
| `at-get_property_roof_age` | `clips` | `risk:age-of-roof` | returns `clip` only, no payload |
| `pr-get_listing_trends` | `analyticsFilter` | `analytics:listing-trends` | geography keyed |
| `pr-get_market_trends` | `analyticsFilter` | `analytics:market-trends` | geography keyed |
| `pr-get_rental_trends` | `analyticsFilter` | `analytics:rental-trends` | geography keyed |
| `pr-get_home_price_index` | `analyticsFilter` | `analytics:hpi` | geography keyed |
| `pr-get_home_price_index_forecast` | `analyticsFilter` | `analytics:hpi-forecast` | geography keyed |

Resolving `4210 Red River St, Austin, TX 78751` returned CLIP `8058076206`, `countyCode`
48453, `apnUnformatted` 214976, an `alternateApn`, a `universalParcelId`, the USPS
normalized address with ZIP+4, lat/lng, `matchCode: ADDR:ADDREXACT`, and
`owner1Name: RESOLUTE HANCOCK LLC`. Owner arrives on the identity call.

`pd-get_property_characteristics` returned 84 leaf field paths in a single call, including
`landUseCodeDescription`, `attributes.standardSubdivisionCode` and its description, the
full `owner[]` block with mailing address and corporate indicator, `ownerOccupiedIndicator`
and `absenteeOwnerCode`, `structure[].actualYearBuilt` alongside `effectiveYearBuilt`,
living, gross and ground square footage, bathrooms, rooms, stories, foundation code,
roof code and roof cover code, construction type, pool, patio, census tract and CBSA.

Three of those we cannot source at all today. `landUseCodeDescription` was verified by the
OPS-21 D1 lane to be underivable from `cad_property` and moved to 3P-13. Subdivision is
the rail whose parser got zero of six in the CTX verdict. Roof, foundation and
construction type have no producer anywhere in the bake.

The `pr-` tools filter by `zip_code`, `county_fips_code`, `cbsa_code`, `state` or
`state_id`, take up to 25 geography values per call, and accept a year-month range. They
are market level, not parcel level.

**What the live channel does not carry:** transaction or sales history, liens, mortgage,
per-property AVM, comparables, building permits, HOA, flood depth, SpatialRecord utility
or mineral, parcel polygon. Those are REST products and the REST keys are dead. The rails
that close the capability gap are therefore still unverified against a working endpoint.

One open question worth carrying, since it costs nothing to ask:
`at-get_property_analytics` and `at-get_property_climate_risk` returned identical payloads.
A tool named property analytics returning only climate is most likely scope narrowed on
the eval entitlement. If a fuller entitlement puts AVM and value behind that same tool,
that is the highest value unknown on the list.

## 4. The 65-rail division

The 65 parcel-record rails are the division. Verdicts: BUY means Cotality answers it and
we do not have it statewide. MAKE means only we can produce it. HAVE means we already hold
it free statewide and must never pay for it. SPLIT means partly held. CHECK means
unresolved.

| # | Rail | Verdict | Cotality source | Note |
|---|---|---|---|---|
| 1 | apn | HAVE | SpatialTile fips+apn | TxGIO statewide; their copy is a cross-check |
| 2 | situsAddress | BUY | geocode / site-location | Ours is 6 counties; real street coverage 89.9% |
| 3 | situsCity | BUY | site-location | |
| 4 | situsState | HAVE | | Derivable, OPS-21 D1 |
| 5 | situsZip | BUY | site-location | |
| 6 | landUseCode | BUY | landUseAndZoningCodes | Raw county code, no national taxonomy |
| 7 | landUseDescription | BUY | characteristics | Verified underivable for us. Clean buy |
| 8 | landUseSource | MAKE | | Provenance is ours by construction |
| 9 | landUseVintage | MAKE | | D1 |
| 10 | acreageAcres | BUY | site-location lot | |
| 11 | acreageSqft | MAKE | | Derived from acres |
| 12 | acreageMethod | MAKE | | Provenance |
| 13 | yearBuilt | BUY | characteristics | Actual and effective both available |
| 14 | marketValue | BUY | tax-assessments | Have in 6 counties, need 248 |
| 15 | assessedValue | BUY | tax-assessments | |
| 16 | landValue | BUY | tax-assessments | |
| 17 | improvementValue | BUY | tax-assessments | |
| 18 | livingAreaSqft | BUY | characteristics | |
| 19 | legalDescription | BUY | characteristics | |
| 20 | exemptionCodes | CHECK | tax-assessment | Confirm TX exemption detail, not just a flag |
| 21 | countyFips | HAVE | | |
| 22 | cityLimits | HAVE | | landing_parcel_jurisdiction |
| 23 | etjStatus | MAKE | | Texas legal construct, nothing to buy |
| 24 | schoolDistrict | MAKE | | Free spatial join against TEA boundaries |
| 25 | zoningDistrict | MAKE | (zoningCode) | Do not fill from Cotality. Raw code, no taxonomy |
| 26 | zoningJurisdictionKey | MAKE | | |
| 27 | zoningProvenance | MAKE | | |
| 28 | envelopeStatus | MAKE | | |
| 29 | setbackFrontFt | MAKE | | |
| 30 | setbackSideFt | MAKE | | |
| 31 | setbackRearFt | MAKE | | |
| 32 | setbackCornerFt | MAKE | | |
| 33 | parcelAreaSqFt | MAKE | | From geometry we hold |
| 34 | buildableAreaSqFt | MAKE | | |
| 35 | buildableAreaPct | MAKE | | |
| 36 | maxLotCoveragePct | MAKE | | |
| 37 | maxHeightFt | MAKE | | |
| 38 | maxFootprintSqFt | MAKE | | |
| 39 | citationUrl | MAKE | | The citation is the product |
| 40 | envelopeDisclosure | MAKE | | |
| 41 | edgeSignal | MAKE | | |
| 42 | maxImperviousCoverPct | MAKE | | Declared ahead |
| 43 | treeProtection | MAKE | | Declared ahead |
| 44 | setbackRules | MAKE | | |
| 45 | wells | HAVE | SpatialRecordOG | RRC staged, 1.4M wells, 254 counties |
| 46 | pipelines | HAVE | SpatialRecordOG | Writer exists, runner-blocked (D3). Data free |
| 47 | permits | SPLIT | building-permits | Austin + San Antonio free at 2.85M rows. Buy the other 252 |
| 48 | easements | MAKE | | Courthouse. They have liens, not easements |
| 49 | buildingFootprint | CHECK | Location API WKT | Overture/Microsoft footprints free nationally |
| 50 | specialDistricts | HAVE | | Six writers, PUCT/TCEQ free |
| 51 | flood | SPLIT | RiskMeter flood suite | FEMA zone free. Buy depth, AAL, first-floor-height |
| 52 | owner | BUY | characteristics / clip | Paid-tier rail; needs its own atom family |
| 53 | valueHistory | BUY | tax-assessments history | R11 unchecked item resolved: additive, not duplicate |
| 54 | salesHistory | BUY | transaction-history | Unobtainable elsewhere. TX is non-disclosure |
| 55 | publicRecordRefs | BUY | liens, mortgage, document-images | D6-blocked on our side |
| 56 | ossf | MAKE | | County health department septic permits |
| 57 | utilityService | BUY | SpatialRecordUT | Our HIFLD electric is 139 rows against 8,515 water |
| 58 | agValuation | CHECK | | Confirm they carry TX rollback liability |
| 59 | mineralRights | BUY | SpatialRecordOG | TX severed estate. We have wells, not estate |
| 60 | hoaDeedRestrictions | BUY | home-owners-association | Ours is courthouse on-demand, D6-blocked |
| 61 | overlayDistricts | MAKE | | City GIS |
| 62 | parcelGeometry | HAVE | SpatialTile parcels | TxGIO 253/254. Do not buy in Texas |
| 63 | roads | HAVE | | Free |
| 64 | terrain | HAVE | | USGS free |
| 65 | railCorridor | HAVE | | Free |

Twenty clean buys, two partial buys, three unresolved, twenty-nine we manufacture, eleven
we already own free. Roughly a third bought, a third built, a third owned.

**Every BUY above means the endpoint exists in their catalog, not that we verified we can
get it.** The 2026-06-19 probe proved the difference: Property returned 403 account not
entitled on a documented endpoint. Only the eleven MCP tools in section 3 are verified.

## 5. COGS model at fifteen cents per call

Working assumption, operator supplied: $0.15 per call. The billing unit is unread and it
is the single most load-bearing unknown in this document. Per call, per record returned,
per product per CLIP, and per field are four different invoices for identical usage.

Cells are not calls. `property-detail` is a composite returning buildings, ownership,
site-location, tax-assessment, last market sale and most recent owner transfer in one
billable event, and `pd-get_property_characteristics` returned 84 fields in one. The
governing rule is therefore to buy composites and never components. An integration that
fetches buildings, then ownership, then tax-assessments separately pays three times for
one call's content.

| Bundle | Calls | COGS | Rails filled |
|---|---|---|---|
| Tier 0, the map | 0 | $0.00 | geometry, zoning, setbacks, envelope, citation, free federal layers |
| CLIP resolve | 1 | $0.15 | one time per parcel, never repeated |
| The record | 1 | $0.15 | situs, land use and description, acreage, year built, values, living area, legal, owner |
| The history | 4 | $0.60 | transaction history, tax-assessment history, mortgage, liens |
| The risk | 3 | $0.45 | climate composite, inland flood cat model, first floor height |
| The valuation | 3 | $0.45 | AVM, rent AVM, comparables |
| The extras | 6 | $0.90 | permits, HOA, utility, oil and gas, roof age, replacement cost |

A full record is about 12 calls, $1.80. Counting every per-parcel endpoint in the catalog
and excluding geometry, the ceiling is about 37 calls, **$5.55 per parcel for everything
they sell**. If the meter counts fields the same parcel is roughly $30.

The trend products break the per-parcel model in our favour. They are geography keyed at
up to 25 values per call, so statewide Texas coverage is roughly 104 calls per product per
period. Four products is about $60 for a monthly statewide refresh of listing, market and
rental trends plus HPI, amortized across every user in the state rather than charged per
parcel.

Margin at $5.55 worst case: a $49 record is 89 percent gross, a $29 record 81 percent.
At the pessimistic per-field case a $99 deep report still holds 70 percent. The atom cache
then compounds it, because the second buyer of the same parcel costs nothing. That
compounding is entirely contingent on the retention right in the commercial agreement,
which is the clause that decides whether this is an appreciating asset or a pass-through
with markup.

The controlling risk in a per-call world is that our own factory is the largest potential
caller. Every verb the factory is built around (backfill, re-bake, sweep, recompute,
refresh, audit) becomes a purchase. Eleven million Texas parcels times one bulk sweep is an
eleven million call invoice, and `publish-gate-sched` runs hourly. The boundary that the
factory may never call Cotality in bulk has to be a gate that refuses, not a convention,
because the failure mode is silent until the statement arrives.

## 6. Tier shape and the free-tier inversion

The operator's line is geometry, zoning and setbacks free as the map experience, then a
paid upgrade. The geometry half is solid at 253 of 254 counties. The zoning and setback
half is not. Ruled setback tables exist for ten Texas jurisdictions (Austin, Bastrop
county, Bastrop city, the Bastrop development code, the Elgin development code, Kyle,
Pflugerville, Round Rock, San Antonio, Waco) and the write path from those tables into a
cell is being built now under OPS-21 S1 and S2, because `computeTier1Envelope` has two
branches and both return declined.

So the free hook works in about ten cities while purchased depth would work in 254 counties
on day one. The funnel inverts and a user in Lubbock receives an outline, no value, and an
upgrade prompt. The available fix costs nothing: widen the free tier to everything held
free statewide, which is FEMA flood zone, city limits, ETJ, school district, special
districts, wells, pipelines, roads and terrain. Zoning and setbacks then become the
premium-free layer where manufactured, which is also the honest story.

A further design note. The question should determine the call set, not the tier. Somebody
asking whether a duplex fits needs zoning and setbacks, which are free and ours, plus
possibly land use at fifteen cents. Somebody asking whether to buy needs value, comps,
sales history and liens, about six calls. Same parcel, different bundles, neither user
paying for the other's fields. That is also the more MCP-native shape, since an agent asks
a question rather than requesting a record.

## 7. Gaps, three directions

Theirs, which we fill or refuse: zoning with an ordinance citation, all four setbacks,
buildable envelope, height, lot coverage, impervious cover, tree protection, ETJ,
easements, OSSF, overlay districts, plat restrictions, site-specific drainage. Every one
concerns what may be built, and none is a national data product because each is
manufactured per jurisdiction from primary law.

Ours, which they fill: sales history, value history, liens, mortgage, distress, AVM, rent,
equity and LTV, owner tenure, HOA, roof age, replacement cost, utility territory, mineral
estate, and the structural characteristics (roof, foundation, construction type) that have
no producer in our bake. Most of the eight refusing functions from the CTX verdict.

Neither, which is where the product actually is: site-specific hydrology, since their
models are actuarial and regional while ours would be physics based and is unbuilt; live
permit status, since they carry history rather than whether an application is moving; and
whether a specific project on a specific parcel would be approved. That last one is the
moat, and it requires their facts, our rules, and reasoning over both.

## 8. What is unverified

The commercial agreement has not been read. Retention and derivative rights, consumer
redisplay rights, and the billing unit are all unknown, and the first two decide whether
the cache-and-atomize model is lawful at all. The 2026-06-16 display-license decision
remains active and gates public display of Cotality-sourced figures independent of price.

Quota on the eval channel is documented at 100 requests per day. About fourteen were spent
on 2026-09-12 and no ceiling was reached, so that number is carried from the record, not
measured.

Every BUY verdict outside the eleven probed MCP tools rests on the portal catalog rather
than a live 200.

## 9. The immediate opportunity

The bake-off does not wait on the commercial agreement. The eval agreement prohibits
shipping outputs to end users and permits internal evaluation, which is exactly what a
bake-off is. Six counties of ground truth built from primary sources already exist, the
channel is live, and comparing Cotality against those rails converts most of section 4
from catalog claim into measured fact before money moves. It is also the only way to
satisfy the earned-confidence commitment, since the alternative is inheriting a vendor's
numbers into a product that claims calibrated confidence.

## 10. The binding and the gate, read at source 2026-09-12

Read against `origin/main` of `plan-review` (`1af5ac5`) and `hauska-mcp-server`
(`3b5626b`), by `git show`, without checking either repo out.

### The binding is declared, never derived

`plan-review/sql/005_engagement_edition.sql` adds `edition_id` to
`plan_review_engagements` and `plan_review_findings`. Its own comment on why the column
is nullable:

> "declared code edition (S2-9). Nullable: unset until the edition selector is used.
> Nothing derives it from jurisdiction, that guess is exactly what item 8 replaces with
> a declaration."

`src/citation.mjs` enforces it at construction: `buildCitation()` throws without
`editionId`, `bookId` and `sectionNumber`, and there is no path to a citation-shaped
object that skips it. Before it existed, two call sites hand-wrote the placeholder
`"IRC-EDITION-UNRESOLVED"` because nothing forced them to hold a real edition. The
structured fields are stored; `renderCitationText()` is the only place a display string
is assembled, and never the reverse.

The consequence for a third-party code source: **the jurisdiction-to-edition adoption
table is a deliberately empty slot, not an oversight.** ICC sells the code text; the
binding that says which edition governs this parcel is manufactured per jurisdiction
from primary sources, exactly as the ruled setback tables are. Same division as
Cotality: the vendor brings content, we manufacture the binding that makes it apply.

### The obligation gate exists and is further along than the doc set records

`hauska-mcp-server` carries `migrations/009_source_obligation_ledger.sql`,
`src/source-obligation-meter.ts`, `src/source-obligation-reader.ts`, and tests for both.
The meter's header states that every successful tool read returning an ICC-sourced atom
DID accrues to ICC's inbound meter, free anonymous included: money owed on reference
regardless of whether anything sold.

Two behaviours are worth generalizing verbatim, both from the meter's own comments:

> "Rates unset → amount null + graceTerms pending-rate (countable, never silent zero)."

> "Null adapter is unmeasured, not 'not ICC'."

Both implement the absent-versus-zero-versus-unmeasured rule rather than restating it.

ICC content is live in the substrate: jurisdiction tenant `icc-model-code` carries 4,966
atoms, DIDs shaped `did:hauska:code-section:icc-model-code/<edition-slug>/<section-dashed>`,
and an anonymous caller receives "not readable under the caller's accessPolicy."
IPMC2018P2 is an honest empty with no live path, which is a different state from absent.

Detection, however, is heuristic: allowlist, stamp, `sourceActorDid`, citation matching.
That is OPS-17 G-17, open, whose fix is a hard reference carrying `sourceActorDid` plus
`book_id` plus `section_id`. Rates are null across the board (G-23) and the substrate
reader is G-111, open.

### The accrual-trigger asymmetry

Reading the two sources together surfaces a design constraint neither one shows alone.

ICC accrues **on reference**, so the meter must sit on the read path, because a cache
hit still owes a royalty. Cotality accrues **on acquisition**, so every serve after the
first is free, which is the whole basis of the compounding-margin argument.

A meter fixed to the read path charges us for Cotality cache hits that cost nothing. A
meter fixed to the fetch path silently under-reports the ICC obligation on every cached
read. The trigger has to be a declared property of the source. Carried into
`80_adrs/adr_032_third_party_source_rights_envelope.md` as `accrualTrigger`.

### The typed-absence vocabulary already covers licensed IP

`plan-review/src/code-lookup.mjs` distinguishes `unchecked`, `source-unavailable`,
`not-entitled` and `absent-verified`, with the explicit note that `unchecked` is a
statement about our corpus while `absent-verified` is a statement about the code book,
and only the second would entitle anyone to say a provision does not apply.
`not-entitled` is precisely the licensed-third-party-IP state, and it exists today.

## 11. The test set

`scripts/vendor-testset-ctx.mjs` builds a deterministic sixty-parcel set, ten per county
across the six CTX counties, five incorporated and five unincorporated, selected by
`md5(place_key)` and restricted to parcels whose `situsAddress` cell is `kind=value`
because a parcel with no address cannot be resolved by a vendor and its miss would read
as a coverage finding when it is a selection defect. Shortfalls are recorded, never
padded from the other class. Self-test runs five checks in both directions including an
explicit not-vacuous case; `--live` refuses to proceed if it fails; a missing DSN exits 2
as UNMEASURED rather than writing an empty set. Output at
`_catalog/vendor_testset_ctx.json`.

First run: `parcels=60/60 counties=6 status=COMPLETE`.

Two findings before any vendor call.

**The two paths are structurally different and visible.** Every unincorporated parcel
carries exactly `not-applicable: 19`, the nineteen zoning and envelope rails correctly
excluded outside city limits. In-city parcels carry zero or one. Unaccounted runs 19 to
37 per parcel, which is the precise target a vendor fill would move.

**Address quality varies by county and will drive the vendor resolve rate.** Bastrop,
Hays, McLennan and Williamson return full addresses with city and ZIP. Travis and
Caldwell return bare street lines (`1006 WISTERIA CIR`, `301 PITKIN DR`). Cotality's
resolver takes a `fullAddress` and its own tool description states match confidence
scales with completeness, so those two counties will resolve worse for reasons unrelated
to Cotality coverage. A low Travis hit rate must not be read as a vendor gap without
controlling for this.

**Quota constraint on running it.** At three calls per parcel (resolve, characteristics,
climate) the full set is 180 calls against a documented 100 per day eval ceiling. That
ceiling is carried from the record and has not been measured; about fourteen calls were
spent on 2026-09-12 without reaching it.

## Revision history

- **2026-09-12 (origin).** Captured from the Cotality re-engagement conversation. Records
  the operator's commercial terms as stated, the live credential probe, the eleven-tool
  MCP inventory, the 65-rail division, the per-call COGS model, and the free-tier
  inversion problem. No plan row; nothing dispatches from this document.
- **2026-09-12 (append).** Sections 10 and 11 added after reading `plan-review` and
  `hauska-mcp-server` at `origin/main`: the edition binding is declared and never
  derived, the source-obligation gate exists with two behaviours worth generalizing, the
  accrual-trigger asymmetry between the two sources, and the sixty-parcel test set with
  its two pre-findings. Envelope carried to ADR-032.
