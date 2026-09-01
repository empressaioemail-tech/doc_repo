---
id: 2026-08-31_capability_inventory
title: Capability inventory — what the store already holds that the serve path never projects
date: 2026-08-31
status: active
plan_row: P-91 (v3 gap ledger carry), F-06, F-11
snapshot: >
  doc_repo main 9a3cd62. All product-code claims read from `git show origin/main:<path>`,
  never from a working tree: legacy-design-tools origin/main 394424f2 (2026-08-31 15:15 CDT),
  hauska-engine origin/main 0e96e6a (2026-08-31 14:58 CDT), hauska-atom-contract origin/main
  f8b7a6d, hauska-map origin/main 0fb9734, hauska-mcp-server origin/main 1ae9f28.
  Local checkouts of LDT, engine and map are on OTHER branches with dirty trees; nothing
  below was read from them. ZERO database queries were run (containment job on the shared
  Neon compute). Every population question is marked PENDING-STORE-READ.
---

# The rule this document is written under

A column that exists is not a column that is populated, and a column that is
populated is not a field a customer can see. Those are three states and this
document keeps them apart. Where the third question needs a store read, the row
says PENDING-STORE-READ and stops. Nothing here is a zero that was inferred from
an absence.

Two surfaces are in play and conflating them produces wrong answers in both
directions. The **twin** is the P-91 SmartSite path: `get_smart_site` over
`POST /property-explorer/v1/research/brief` (depths `node`, `draw`, `stub`).
The **brief** is the older Property Brief / Chrome extension path:
`POST /api/brokerage/v1/brief`, mounted at `routes/index.ts:84`, which runs the
adapter registry. Several functions the twin refuses are answered on the brief.
That is the single largest finding in this pass.

# 1. The eight refusing functions, categorised

Ledger numbering is the authoritative one from
`_inbox/2026-08-30_smartsite_mcp_app_v3_WDLL.md` section 1.

| # | Function | Category | Evidence |
|---|---|---|---|
| 8 | Owner | **Built, gated by pricing policy.** Not absent, not unmeasured as a mechanism. | Writer `hauska-engine packages/atoms/src/owner-fact-writer.ts` ("THE ONE PAID PROPERTY ATOM", `public-paid`, source is `cad_property.owner_name` / `owner_mailing_address` / `exemption_codes`). Runner `packages/engine-core/scripts/write-owner-fact-county.mjs`. Reader `LDT artifacts/api-server/src/lib/ownerFactRead.ts`. Served on `GET /node/:parcelNodeId/facets` (`routes/brokerageNodeFacets.ts:652`, docblock lines 100-114) only when PE entitlement is studio or team; every other caller gets a typed `studio-gated` refusal and no atom query runs. The twin strips owner-shaped keys at any depth (`sanitizeNodeFacetPayload`, same file line 229). Separately, `cad:property` on the BRIEF path emits `ownerName` at the FREE tier (`lib/adapters/src/local/cad.ts:462`, `brokerageTierGate.ts` FREE_KEYS). Coverage per county: PENDING-STORE-READ. |
| 10a | Liens | **No source acquired. Acquisition path known, costed, and blocked on a ruling.** | `_inbox/2026-08-30_p91_measurement_x3_clerk_index.md`: the clerk index exists and is free to a human at Bastrop (`cc.co.bastrop.tx.us`, Aumentum, 1973-present) and Travis (`tccsearch.org`, 1988-present); Williamson breaks the pattern. `robots.txt` is a full `Disallow: /` at all three, so the free portal is not a lawful uniform crawl target. Lawful uniform routes are an LGC 191.008 access agreement or a PIA extract. `recorded_instruments` / `restriction_clauses` (`lib/db/src/schema/encumbrances.ts`) DO exist but default to `tenant-private` and are fed by per-engagement upload, so they are not a twin source and must never become one. Held on the operator portal-access ruling per `_inbox/2026-08-31_ctx_verdict.md`. |
| 10b | Distress | **Landed in part, not faceted. Designed end to end, four of five signals with no source.** | `artifacts/api-server/src/lib/brokerageMotivatedSellerSignals.ts` header, verbatim: absentee-owner (mailing != situs) is LIVE from `cad_property`; tenure, tax-delinquency, pre-foreclosure NOS, and lis-pendens/liens/probate are each named NOT LIVE with the store that is missing. `brokerageGisCompositeLayers.ts:1656-1733` carries the documented weighted-sum and the "not-evaluated is excluded from the denominator, never treated as not motivated" rule. So one real distress signal is computable today from data already held and reaches no twin surface. |
| 11 | Permits | **Landed for two metros, not faceted on the twin. Served on the brief.** | `lib/db/src/schema/permitRecord.ts` and `lib/db/drizzle/0055_permit_record.sql`: an OWNED public-record corpus, `austin_tx` about 2.36M rows (1921-present, City of Austin open data resource `3syk-w9eu`) and `san_antonio_tx` about 487K rows (2020-07-present), acquired 2026-06-21. Adapter `lib/adapters/src/local/permits.ts` (`permits:record`), accessor `artifacts/api-server/src/lib/permitHistoryLookup.ts`, FREE tier in `brokerageTierGate.ts`. Everywhere outside the two routing bboxes is a typed honest no-coverage. The twin reads none of it. Row counts in the live store: PENDING-STORE-READ. |
| 9 | Value | **Landed, not faceted on the twin. Served on the brief.** | Three independent derivations agree the columns are real, so this does not rest on the test fixture: `lib/db/src/schema/cadProperty.ts` (drizzle module), `lib/db/drizzle/0052_cad_property.sql` (migration DDL), and `hauska-atom-contract src/property/cad-parcel-roll.ts:52-55` (contract + zod schema). `hauska-engine packages/atoms/src/cad-parcel-roll-writer.ts:183-208` writes all four onto the atom at `accessPolicy: "public-free"`. Served on the brief by `cad:property` and `cad:tax` with correct honesty language already written and tested ("CAD market value (assessed)", never AVM). Population: PENDING-STORE-READ. |
| 12 | Rent | **No source at all.** Genuine acquisition, and not from public record. | The only rent read in the tree is `brokeragePencilsAt.ts:79` keying on `layerKind === "cotality-rent-avm"`, and Cotality is extinguished. `brokerageGisRentAreaLayers.ts:26` says in its own header that no rent provider is wired. Rent is not public record in Texas or anywhere else; WDLL R-2 (external feed, bring-your-own-key) is the correct and unchanged posture. |
| — | Drainage | **Two different subjects. One has a live national source at MAX tier; the twin facet has no producer.** | Measurement 5's grep was scoped to the bake modules and its finding is correct there: no module writes `facets.drainage`, so the twin section is honestly `unread`. That does NOT mean no drainage source exists. `lib/adapters/src/federal/usda-ssurgo.ts:673` pulls `drainagecl` (soil drainage class) from USDA Soil Data Access, a free national uniform source, live and wired at the MAX tier. **These are not the same claim.** Soil drainage class is a hydrologic soil property; the twin's drainage facet is a site stormwater / drainage-easement question. Substituting one for the other would be a fabricated answer. The third thing named `drainage` in the tree, `atoms/site-drainage.atom.ts`, is a per-engagement `tenant-private` AEC-cortex simulation record and is not a twin source either. |
| 7/Q2 | Subdivision | **Landed, not parsed. The parser is not merely low-confidence, it is wrong, and twice it is confidently wrong.** | `cad_property.legal_description` exists (schema + DDL) and rides onto the atom as `legalDescription`. A parser already exists: `parseSubdivisionLotBlockFromLegal` in `artifacts/api-server/src/lib/recordsSearchQueryPlan.ts`, consumed by `recordsSearchTerms.ts`. Measured below. |

## The subdivision parser, measured

The regex is keyword-LEADING and captures what follows the keyword, while Texas
CAD legal descriptions overwhelmingly put the subdivision name BEFORE it. Run
against the exact forms named in the card, with a two-direction self-test so a
vacuous instrument would be visible:

```
legal_description                                    | parsed subdivision   | want                 | verdict
------------------------------------------------------------------------------------------------------------
WALNUT RIDGE I                                       | null                 | WALNUT RIDGE         | WRONG
Attra Subdivision                                    | null                 | Attra                | WRONG
RIVERSIDE GROVE SUBDIVISION PHASE 1                  | PHASE 1              | RIVERSIDE GROVE      | WRONG
LOT 1066 LAKEWAY SEC 13                              | null                 | LAKEWAY              | WRONG
6 CREEKS PHASE 1 SECTION 10                          | 1 SECTION 10         | 6 CREEKS             | WRONG
Building Block                                       | null                 | Building Block       | WRONG
LOT 4 BLK A WALNUT RIDGE I                           | null                 | WALNUT RIDGE         | WRONG
LOT 12 BLOCK 3 RIVERSIDE GROVE SUBDIVISION PHASE 1   | PHASE 1              | RIVERSIDE GROVE      | WRONG
------------------------------------------------------------------------------------------------------------
subdivision WRONG on 8 of 8 named forms

BLOCK regex, digit vs letter:
  LOT 4 BLOCK 12 OAKS      -> "12"
  LOT 4 BLOCK A OAKS       -> null
  LOT 4 BLK 12A OAKS       -> "12A"
  LOT 4 BLK B OAKS         -> null

SELF-TEST positive (must be non-null): "FOO BAR"
SELF-TEST negative (must be null)    : null
SELF-TEST ok — instrument fires in both directions
```

Instrument: a file, not a shell one-liner, at
`<scratchpad>/legalparse.mjs`, replicating the regexes verbatim from
`recordsSearchQueryPlan.ts` at `394424f2`. It fires in both directions.

Two consequences. First, the refusal on the `subdivision` selector was justified
by parser confidence and the parser is worse than that framing: on two of the
eight it returns a **wrong non-null**, which is a fabricated search term, not a
low-confidence one. Second, the block regex `\bBL(?:OC)?K\.?\s+(\d+[A-Z]?)\b`
requires a leading digit, which is exactly the letter-block null that the P-85
audit recorded in `_inbox/2026-08-31_ctx_verdict.md` ("the shipped parser still
stores null on a letter-only block"). Same defect, one code reading, two
symptoms in two workstreams.

# 2. The unexposed-data sweep

"Twin" below means every P-91 surface: brief sections, draw, stub, saved-property
rows, screen rows. "Serves" is a code-reading claim about `origin/main`, not a
live probe.

## 2a. On the `cad-parcel-roll` atom and in `cad_property`, read by no bake

The Tier-1 conformant bake's claim reader takes exactly six fields.
`nodeFacetBakeTier1Conformant.ts:175-185` (`readConformantCadClaim`) reads
`countyFips`, `propId`, `situsAddress`, `situsCity`, `situsZip`, `landAcres`,
`propertyUseCode`, and its own docblock line 40 states "The claim carries
`ownerName`. This module never reads it." Everything else on the row is dropped
before the bake, so these are a two-hop gap (bake change plus serve change), not
a serialization change.

| Field | Where it lives | Anything serves it? | What it would take |
|---|---|---|---|
| `marketValue` | `cad_property`, `cad-parcel-roll` atom | brief only (`cad:property`, FREE) | bake reader + brief section |
| `assessedValue` | same | brief only (`cad:tax`, FREE) | bake reader + brief section |
| `landValue` | same | brief only (`cad:property`) | bake reader + brief section |
| `improvementValue` | same | brief only (`cad:property`) | bake reader + brief section |
| `livingAreaSqft` | same | brief only (`cad:property`) | bake reader + draw attr |
| `legalDescription` | same | brief summary + `recordsSearchTerms.ts` | bake reader + a working parser |
| `exemptionCodes` | same | brief only (`cad:tax`, decoded labels) | see the 25.027 flag below |
| `ownerName` | same | brief FREE tier; twin studio/team via `owner-fact` | deliberate policy, leave |
| `ownerMailingAddress` | same | brief; twin studio/team | deliberate policy, leave |
| `yearBuilt` | same | **twin serves it** via `structuralFactRead.ts` reading `cad_property` directly | already served |

That is **nine** customer-facing CAD fields the twin cannot reach.

## 2b. In the Tier-1 bake, never serialized to any twin surface

Re-confirmed against `nodeFacetTier1Assemble.ts` (`Tier1FacetPayload`,
`BaseFacts`) and consistent with `_inbox/2026-08-30_p91_measurement5_field_inventory.md`.

| Group | Fields | Anything serves it? | What it would take |
|---|---|---|---|
| Customer-facing | `baseFacts.apn`, `baseFacts.acreage` (value, sqft, method), `countyFips`, `countyName`, `baseFacts.situsState` | no (`apn` is read only as a label fallback that is never reached; situsState may appear inside the composed situs label but is not a field) | serialization only. This is WDLL S1 |
| Envelope content | Tier-1 envelope `status`, `declineReason`, `disclosure`, `jurisdictionKey` | no; nulled by `loadBakedNodeFacetSnapshot` before compose, only the derived refusal code survives | held on P4-QUARANTINE |
| Provenance | `parcelSource`, `parcelVintage`, `landUseSource`, `landUseAddressRecovered`, `roadsPending`, `tierNote`, `landUseGateBlocked`, `zoningSource`, `parcelJoin` | no | serialization only |
| Coverage flags | `facetCoverage` x5 | no; read only inside `extractEnvelopeBriefRefusal` | serialization only |
| Wrapper | `shapeSource`, `baked`, `source`, `access`, `accessNormalizedFrom`, `publishRunId`, `facets.base` | no | serialization only |
| Index | `tier`, `facetSchemaVersion`, `queryPoint` (lat, lng) | `queryPoint` is consumed by the brokerage facets city-limits read only | serialization only |

## 2c. In the Tier-2 bake, never crossing any wire

| Field | Anything serves it? | What it would take |
|---|---|---|
| Tier-2 FEMA `status`, `floodZone`, `inSpecialFloodHazardArea`, `zoneSubtype`, `baseFloodElevation`, `provenance` | **no.** `extractTier2Overlay` reduces the row to `{flood: null, floodDisposition, envelope: null, bakedAt, snapshotAt}` and `Tier2FloodDisposition` is typed as an all-refusal union, so no non-refusal flood value can cross by type | WDLL S2, **plus** a reconciliation against the live `flood-hazard-fact` atom before serving. Standing memory records the two stores disagreeing AO vs AE. Two derivations of one fact must declare disagreement, never pick silently |
| Tier-2 envelope | no | held |

## 2d. Landed stores and atom families with no twin reader

| Thing | Where | Anything serves it? | Note |
|---|---|---|---|
| `permit_record` (13 informational columns) | deployment store | brief only | see section 3 |
| `rail-corridor-fact` atoms | atoms store | **nothing on any serve path.** Only appearance outside the writer is `railScoring/registry.ts`, which counts atoms for the county ledger and never reads a value | written and never served |
| `utility-easement` atoms | atoms store | same | written and never served |
| `building-footprint` atoms | atoms store | brokerage facets route only; the draw's footprint overlay is hardcoded to `state: unknown` and no footprint read is wired into it | measurement 5 item 11 |
| `parcel-terrain-model` | atom contract only | no writer found in `packages/atoms/src`, no reader anywhere | contract-only type |
| `txgio_parcel.owner_name`, `.geo_id` | deployment store | no | `geo_id` is the CAD geographic id, a second parcel identifier |
| `txgio_address` (10 columns) | deployment store | address search paths only | not a parcel facet |

## Count

**Nineteen** customer-facing leaf fields (nine CAD roll, five bake base,
five Tier-2 flood) and roughly **twenty-five** provenance and plumbing fields are
present in the store or in the bake and reach no twin surface. Add to that two
whole atom families with no reader anywhere (`rail-corridor-fact`,
`utility-easement`), one whole landed corpus with no twin reader
(`permit_record`), and one whole stored facet reduced to a refusal by type
(Tier-2 FEMA).

## A caution about the checked-in schema

The card's warning about `lib/db/src/__tests__/__fixtures__/schema.sql.template`
generalises further than stated. The **drizzle module** `txgioParcel.ts` also
declares exactly one index plus the primary key, and the live catalog reportedly
has four. So the authoritative-looking source is also not authoritative for
indexes: indexes have been added out of band (the ctx verdict records that "no
production bbox index was applied", implying others were). Column presence in
this document rests on two agreeing derivations, the drizzle module and the
migration DDL. Index and population claims rest on neither and are not made.

# 3. Permits: the public-source finding

## The rule this section obeys

Bastrop's MyGov feed is tenant data and is not a source here, in any form,
including a Bastrop-only or anonymised form. It is named below only to mark that
the standing plan of record still points at it and must be amended.

## What we already own, uniformly acquired

`permit_record` holds two metros, both acquired 2026-06-21 from public open-data
portals that any member of the public can download, with no account, no
relationship, and no privileged access:

| Metro | Rows | Span | Portal | Acquisition shape |
|---|---|---|---|---|
| `austin_tx` | about 2.36M | 1921 to acquisition date | `data.austintexas.gov` resource `3syk-w9eu` | SODA API or bulk CSV |
| `san_antonio_tx` | about 487K | 2020-07 to acquisition date | `data.sanantonio.gov/dataset/building-permits` | bulk CSV |

The pre-2020-07 San Antonio history sits in the city's Hansen legacy portal and
was not bulk-acquirable. That gap is real and the adapter's copy is forbidden
from implying otherwise. Row counts above are the adapter docstring's figures;
live counts are PENDING-STORE-READ.

## Per-jurisdiction availability, Central Texas

Source: `_inbox/2026-06-21_acquisition_acquisition-agent_wave1-public-record-target-inventory.md`,
a per-jurisdiction inventory measured 2026-06-21 and **not re-verified this pass**.
Two web searches run today returned nothing that contradicts it and nothing that
adds a new bulk source; they surfaced only Austin, San Antonio, Dallas, and a
Collin CAD dataset, plus commercial aggregators.

| Shape | Jurisdictions | Acquisition |
|---|---|---|
| Bulk open data, machine native | Austin, San Antonio | already owned |
| Vendor portal, guest or account search, bulk export unverified | Round Rock, New Braunfels, San Marcos (split MyPermitNow / Clariti at 2025-01-02), Waco, Georgetown, Cedar Park, Buda, Taylor, Dripping Springs, Live Oak, Rollingwood, Lago Vista, Pflugerville, Kyle, Leander, Hutto, Manor, Schertz, Converse, Boerne (bifurcated at 2025-07-14) | per-vendor recon, then scrape-or-export ruling per portal. Not uniform |
| PDF reports or email intake, PIR first | Killeen (annual summary PDF only, counts and values, not case level), Temple (weekly and monthly PDF), Elgin, Lockhart, Wimberley | OCR or PIA. High friction |
| No county building-permit ledger exists at all | Bastrop County unincorporated (MGO carries development, OSSF, floodplain, driveway only; HB 2833 residential inspections are private) | **an absence, and it is the honest answer.** No source to acquire |
| Tenant data, OFF LIMITS | Bastrop city MyGov | not a source |

**The honest answer for the corridor is that no uniform public permit source
exists outside Austin and San Antonio.** Every other Central Texas jurisdiction
is a per-vendor portal whose bulk path has to be negotiated one at a time, which
is the opposite of uniform acquisition and runs straight into the cost per
jurisdiction rule. Bastrop city in particular has no lawful uniform path for us,
because the only rich source is the tenant's.

## One statewide lead, unmeasured

TDLR's Architectural Barriers project registration (TABS, `tdlr.texas.gov/tabs/search`)
is a **statewide, uniform, public** register of construction projects, searchable
by county, city, work type and cost, with a published open-records policy. It
covers commercial and public-accommodation projects with estimated construction
cost at or above $50,000 and is required for permitting, so it is genuinely
uniform across all 254 counties and works for a jurisdiction with no relationship
to us.

Named as a lead, not a finding. What is not established: whether a bulk or API
path exists at all (only the search UI is confirmed), what the `robots.txt`
posture is, and whether registration date and scope are a useful proxy for
issuance. It is explicitly **not** a residential permit source and cannot
substitute for a city permit ledger on single-family work. Measuring it is
cheap and it is the only candidate found that satisfies uniformity.

## Two corrections owed upstream

The wave-1 inventory ranks "Bastrop MyGov (city)" as **pull first** and P0. That
recommendation is now forbidden by the tenant-sovereignty commitment and the
no-privileged-data rule. The doc is unamended and a fresh agent reading it will
be pointed straight at the tenant's data. It needs a status flip or an amendment
block naming the ruling.

The WDLL ledger row 11 reads "dead; per-city sources". That is wrong for Austin
and San Antonio, where a 2.8M-row owned corpus is landed and wired. The row is
correct only about the twin.

# 4. What is worth populating, and what to leave

Ordered by the axis the operator already ruled: what we hold today first, biggest
gap last. Preference throughout is landed-and-correct over acquisition.

**1. CAD values, living area, acreage and APN onto the twin. Start here.**
Worth it because it is the only item on this list where the data is landed, the
contract shape already exists, the honesty language is already written and
tested, and the same four fields answer two of the eight refusing functions
(value directly, distress partly through carrying cost). To serve honestly it
needs: the vintage, which is free (`taxYear` is the roll year and doubles as
`asOf`, `sourceVintage` names the export drop, the CAD name is resolved);
the label discipline that already exists in `lib/adapters/src/local/cad.ts`
("CAD market value (assessed)", never AVM, never "market estimate"); and a
refusal path, which already exists as the absent disposition for a parcel with
no roll row. It contends with nothing: the bake already reads the same claim row,
so the added fields ride an existing read. The one real risk is a reader
conflating `assessedValue` (appraised minus homestead cap) with `marketValue`;
the fix is to serve both or neither, never one alone.

**2. Fix the subdivision parser, and do not fix it with a better regex.**
Worth it because it unblocks the Q1 `subdivision` selector and simultaneously
repairs the P-85 clerk-index search terms, where 36 issued jobs carried zero
block terms. A regex cannot be made right here: the keyword is optional, its
position varies, and one Bastrop subdivision is literally named "Building Block".
The shape that can be right is a **per-county subdivision gazetteer**, built by
aggregating distinct legal-description prefixes per county, then longest-prefix
matching a parcel's legal text against that county's known set, and refusing when
nothing matches. That gives a second independently derived input (this parcel's
text versus the county's set of names), which is a meaning-shaped check rather
than the presence-shaped one in place now. It also resolves "Building Block"
correctly, because the gazetteer contains it as a name. Building the gazetteer
needs one aggregate read per county: PENDING-STORE-READ.

**3. Permits onto the twin, for Austin and San Antonio only.**
Worth it because it is landed, wired, and the accessor already returns
count/earliest/latest aggregates over the full match set so a summary can say
"N permits since YYYY" without lying. To serve honestly it needs the fuzzy-match
caveat carried verbatim (`PERMIT_MATCH_CAVEAT` already exists), valuations
labelled applicant-declared, and a typed no-coverage everywhere else that names
the two covered metros rather than going quiet. It contends with the temptation
this creates: the moment permits appear on the twin, the first question will be
why Bastrop is empty. The answer is written above and does not change.

**4. The stored Tier-2 FEMA flood facet (WDLL S2), but reconcile first.**
Worth it because a whole facet is sitting in `place_layer_snapshots` and only its
refusal crosses the wire. It must not ship as a serialization change: there are
two derivations of one fact (the stored Tier-2 facet and the live
`flood-hazard-fact` atom) and standing memory records them disagreeing on zone
between AO and AE. Serving the stored facet before that reconciliation exists
would turn a disagreement into a silent pick. Build the divergence check, make it
fail on disagreement, then serve.

**5. The absentee-owner signal.**
Worth it because it is already derived, already honest about its method, already
reads only data we hold, and is the cheapest real answer the twin can give to
"distress" today. It is a derived flag rather than an owner identity, so it does
not trip the studio/team owner gate. Serving it needs the disclosed method string
carried ("derived from CAD homestead exemption plus mailing/situs comparison")
and a not-evaluated state that is visibly distinct from "not absentee".

## What I would leave, and why

**Rent.** No public record exists. The only wired path was Cotality and Cotality
is extinguished. R-2's bring-your-own-key posture is correct. Do not build.

**Comps and resale value.** Texas is a non-disclosure state, so sale prices are
not in the public record; canon establishes this in four places including a
broker confirming from practice that comps are unobtainable even for brokers.
This is a permanent structural gap, shared by every competitor. The correct
product move is to serve the CAD assessed value and say plainly that it is not a
sale price. Do not chase it.

**Clerk index, and therefore liens and deeds.** Correctly held. The acquisition
is per-county statutory, carries real cost and lead time, and is blocked on the
operator ruling. Nothing about this pass changes that.

**Drainage as a twin facet.** No producer, and the two nearby things named
"drainage" are different subjects. Substituting SSURGO soil drainage class for a
site drainage answer would be a fabrication. The honest `unread` is correct and
should stay until a real producer lands.

**Owner identity on the twin.** The studio/team gate is a deliberate, correctly
enforced tier decision with defence in depth. Leave it. What is worth revisiting
is not the gate but the inconsistency named below.

# 5. Three flags raised in passing

**An owner-policy inconsistency, not a leak.** `owner-fact` is `public-paid` and
its writer docblock says the contract schema rejects any other policy. But
`cad-parcel-roll` carries `ownerName` and `ownerMailingAddress` in its body at
`accessPolicy: "public-free"` (`cad-parcel-roll-writer.ts:153, 208`,
`hauska-atom-contract src/property/cad-parcel-roll.ts:45-46`), gated only on
`joinPassedOwnerMatchGate`. Nothing on the twin serves it, because the bake never
reads it and the serve strips owner-shaped keys at any depth. So this is not a
live leak. It is that the same fact carries two different access policies on two
atom families, and the protection against that resting on a downstream stripper
rather than on the policy. Worth a ruling; not worth a fire.

**A Tax Code 25.027 question for counsel, not for me.** Section 25.027 restricts
posting appraisal information on the internet that indicates an owner is 65 or
older. `cad:tax` on the brief path decodes `exemption_codes` into labelled
exemptions including "Over-65 (OV65)". Layer payloads are stripped from the
client wire by `stripSiteContextForClient`, but they feed the LLM brief prose,
which is displayed. Note that the `owner-fact` atom is designed correctly here:
`deriveExemptionFlags` merges OV65 with disabled-person codes into one
`seniorOrDisability` boolean, so a `true` does not indicate over-65 specifically.
Anyone "improving" that by splitting the flag would create the exposure the merge
prevents. Route the `cad:tax` question to counsel; do not split the flag.

**Two stale notes found while reading.** `railScoring/registry.ts` still says the
`rrc-wells` acquisition source is "Harris-only (12,796 features)", which standing
memory records as superseded by a staged 1.4M-well statewide source. And the
wave-1 permit inventory's Bastrop MyGov recommendation, above. Both are the same
failure mode: a measurement that was true of the source it measured, left
un-dated in a place a fresh agent will read as current.

# Leave-behind

```
leave_behind:
  - item: wave-1 permit inventory still ranks Bastrop MyGov as pull-first; contradicts tenant sovereignty
    owner: planner
    plan_row: P-91
  - item: WDLL ledger row 11 says permits are dead; a 2.8M-row owned corpus is landed and wired on the brief
    owner: planner
    plan_row: P-91
  - item: subdivision/block parser is 0-for-8 and returns wrong non-null twice; feeds P-85 search terms
    owner: property
    plan_row: P-85, P-91
  - item: cad-parcel-roll carries ownerName at public-free while owner-fact is public-paid; policy ruling owed
    owner: substrate
    plan_row: F-11
  - item: cad:tax decodes OV65 into brief prose; Tax Code 25.027 question for counsel
    owner: nick
    plan_row: P-91
  - item: rail-corridor-fact and utility-easement atoms have no serve reader anywhere
    owner: property
    plan_row: F-11
  - item: railScoring/registry.ts rrc-wells note says Harris-only; superseded
    owner: property
    plan_row: F-11
  - item: TDLR TABS statewide commercial-project register; bulk path and robots posture UNMEASURED
    owner: unassigned
    plan_row: P-91
  - item: every population figure in this document is PENDING-STORE-READ; no query was run
    owner: property
    plan_row: P-91
```
