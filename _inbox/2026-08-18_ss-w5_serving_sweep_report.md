---
title: Statewide serving sweep — what Smart Site actually serves
date: 2026-08-18
lane: SS-W5
plan_row: P-43
repo: hauska-engine
branch: ss/w5-serving-sweep
status: active
last_updated: 2026-08-18
---

# Statewide serving sweep — what Smart Site actually serves

Lane SS-W5, PLAN-ROW P-43, OPS-16 amendment A-018. Report first, per the operator's
instruction. Everything below is measured; every ratio carries its denominator and its
counting rule at the point of use.

## The question, answered

OPS-16 row P-27 records situs as 99.3% populated. The operator has parcels with no address
on the served sheet. Both are true, and the reason is that the 99.3% counts a string being
present, not an address being present.

Measured today against the live parcel fabric, `txgio_parcel`, 253 loaded counties,
counting DISTINCT parcels per county and summing:

| Rule | Parcels | Of 13,071,975 |
|---|---:|---:|
| `situs_address IS NOT NULL` — the P-27 counting rule | 12,999,845 | 99.45% |
| Non-null AND non-blank | 12,999,845 | 99.45% |
| Carries a STREET SEGMENT (text before the first comma has a letter or digit) | 11,751,433 | 89.90% |
| Carries a city | 8,178,863 | 62.57% |

**1,248,412 parcels, 9.55% of the state, are counted as populated and carry no street.**
The 99.3% figure is correct under its own rule and wrong as a statement about what a person
reads on the card. Blank-string filtering changes nothing: the non-null and the
non-null-and-non-blank counts are identical to the parcel, because the defect is not an
empty string.

The defect is a concatenation artifact that survived every emptiness test ever applied to
it. In Bastrop it is the literal three-character string `, ,` — a street, a city and a state
joined by commas when all three were empty. In Travis it is `, TX 78660` — the same join with
the state and zip surviving and the street and city gone.

Both come from the source column itself. `txgio_parcel` row for Bastrop prop 36521 reads
`situs_address = ", ,"`, `situs_city = NULL`, `situs_state = NULL`, vintage
`stratmap25-landparcels_48021_bastrop_202503`. Nothing in our bake invented it; the bake
copied it faithfully and every instrument downstream counted it as an address.

### The instrument made the same mistake once, in the same session

The first statewide pass here used "contains at least one alphanumeric" as the legibility
rule. That rule passes `, TX 78754`. It was caught by looking at Travis, corrected to the
street-segment rule, and the corrected number is the one in the table above. The uncorrected
number was 94.64%. The ladder so far has three rungs, each of which counted the next class of
non-address as an address, and there is no proof it has only three:

```
IS NOT NULL                             passes  ", ,"            Bastrop
contains an alphanumeric                passes  ", TX 78754"     Travis
first comma-segment has an alphanumeric  <- the rule used here
```

This is recorded because the correction is the strongest evidence for the finding: an
emptiness test written by someone who has not looked at the strings will pass the sentinel.

## The operator's two parcels, settled

**Bastrop `48021:36521`.** The live surface serves `situsAddress: ", ,"` today. Verified by
GET on the deployed endpoint, not inferred:

```
GET https://property-explorer-xi.vercel.app/api/spine/property-atoms/48021:36521/facets
HTTP/1.1 200 OK
X-Pe-Read-Path: atom-chain-warm
  "baseFacts": { "apn": "36521", "situsAddress": ", ,", "situsCity": null, ... }
```

The address is not missing from the company. It is in the atoms store, on the
`cad-parcel-roll` atom for the same parcel:

```
"parcelNodeId": "48021:36521",  "situsAddress": "1503 FARM ST",
"situsCity": "BASTROP",         "situsZip": "78602",
"sourceAdapter": "cad-property-ingest-v1",
"sourceVintage": "data-export-01.14.2026"
```

That atom rides the served atom chain and the PE adapter never reads it.
`adaptAtomChainToBakedFacets` hardcodes `baseFacts.situsAddress = null`, and
`mergeBakedBaseFacts` then prefers the baked value whenever it is a non-empty trimmed string,
which `", ,"` is. So the CAD roll cannot win even where it has the answer.

**Travis, 17005 Simsbrook Drive, Pflugerville.** A different mechanism, and worth stating
plainly because it changes the fix. That parcel is not in `txgio_parcel` at all. The whole
Simsbrook street carries 8 parcels in the fabric — 16907, 16911, 17002, 17021, 17100, 17104,
17105, 17106 — and every one of them serves a city-less address of the form
`17002 SIMSBROOK DR , TX 78660`. Travis `situs_city` is NULL for 380,918 of 380,918 parcels,
and the Travis `cad-parcel-roll` atoms carry `situsAddress: null` for all 492,848 rows, so
there is no appraisal-roll fallback in that county at all.

The address is nevertheless already in the database, in a table the serving path does not
read:

```
txgio_address, county_fips 48453
full_addr "17005 SIMSBROOK DR"   add_number 17005   st_name "Simsbrook"
post_comm "Pflugerville"          post_code 78660
longitude -97.63542129189058      latitude 30.459005369635157
source_vintage "stratmap_address_points_48_most_recent"
```

`txgio_address` holds 1,688,950 address points across 6 counties, each with a populated city:
Bexar 710,316, Travis 433,031, Williamson 345,111, Hays 114,898, Bastrop 61,085, Caldwell
24,509. It is loaded, it is current, and nothing serves from it.

## What the sweep is, and why it is not a golden set

The sweep resolves EVERY parcel on a county's roster. It never samples.

It measures the SERVED body, not the store. The serving path was traced to source and the
production mode verified by reading the `X-PE-Read-Path` response header off the deployed
surface: `PROPERTY_ATOM_PATH=1`, so the atom chain is product truth for zoning, setbacks and
envelope, and the cortex Tier-1 bake supplies base facts through `mergeBakedBaseFacts`.

Running that over 10 million parcels as HTTP calls is not a sweep, it is an outage. So the
sweep bulk-reads the two stores and runs the real serving transforms in process. The five
files that decide what is served are copied byte-for-byte from `hauska-map@d3510a6` into
`packages/retrieval/src/serving-sweep/vendor/`, with the only four edits being import
specifiers, each marked inline. The retrieval half imports the same suppression predicates
the live service imports.

Two controls make that legitimate, and both were proven able to FAIL before being trusted:

- **Live-wire parity.** The offline composition reproduces the deployed wire body on 10
  parcels spanning 3 counties and all 3 read paths. Mutating one fixture made it fail;
  restoring made it pass. 12 tests.
- **Assembly divergence.** The bulk chain assembly and the live
  `HybridRetrieval.getPropertyAtomChain` agree on every slot across 7 branch cases including
  the R13/R27 stale-setback suppression and its depth-warm survival carve-out. Deleting the
  R27 invalidation made it fail; restoring made it pass. 9 tests.
- **Detector liveness.** All five contradiction detectors are shown tripping on constructed
  payloads, so the zeros below are real zeros and not dead gates. 10 tests.

This certifies the INSTRUMENT. It is the opposite of a golden parcel set, which certifies a
COUNTY from a handful of parcels and is what narrowed scope on Bastrop once. The sweep it
validates has no scope knob to narrow.

## Bastrop 48021 — every parcel

Roster, two independently measured id sets, never one derived from the other: 62,257 baked
Tier-1 snapshots, 62,398 `parcel-node` atoms, 62,256 in both, **union 62,399**. Zero parcels
were unresolvable. Swept in 107 seconds. Read paths: 58,467 `atom-chain`, 3,932
`atom-chain-warm`.

| Field | present | absent-covered | absent-uncovered | unresolved | present, of 62,399 |
|---|---:|---:|---:|---:|---:|
| apn | 62,399 | 0 | 0 | 0 | 100.00% |
| landUse | 61,531 | 0 | 868 | 0 | 98.61% |
| situsAddress | 46,144 | 16,255 | 0 | 0 | 73.95% |
| zoning | 9,557 | 0 | 52,842 | 0 | 15.32% |
| geometry | 3,931 | 0 | 58,468 | 0 | 6.30% |
| setbacks | 3,931 | 0 | 58,468 | 0 | 6.30% |
| envelope | 3,931 | 0 | 58,468 | 0 | 6.30% |
| flood | 0 | 0 | 62,399 | 0 | 0.00% |
| frontage | 0 | 0 | 62,399 | 0 | 0.00% |

**The card's own verdict against the sweep's.** `deriveBakedCardModel` calls situs present for
62,257 of 62,399 parcels, 99.77%. A human can read an address on 46,144, 73.95%. The gap is
16,113 parcels — 16,104 serving the `", ,"` sentinel and 9 serving a Travis-shaped stub —
rendering as present addresses. Both numbers are published because the difference between them
is the finding, and hiding it inside the sweep's own definition would repeat the error being
reported.

**Single-family, 32,269 parcels** (served CAD state code `A*`): situs present on 30,229,
93.68%; no readable address on 2,040, 6.32%. Zoning 6,448, 19.98%. Setbacks and envelope 2,945, 9.13%.
Land use and apn 100%. Flood and frontage 0%.

**Setbacks, restricted to parcels that HAVE a served zoning district** — the number that
matches the operator's report that even places in Bastrop County cannot find setbacks:
**3,931 of 9,557 zoned parcels, 41.13%.** The other 5,626 decline, each with a named reason:

| Decline reason | Parcels | Of 62,399 |
|---|---:|---:|
| no-zoning-stamp (unzoned, mostly unincorporated county) | 52,700 | 84.46% |
| served | 3,931 | 6.30% |
| no-setback-row | 1,948 | 3.12% |
| warm-verify-decline | 1,785 | 2.86% |
| front-orientation | 571 | 0.92% |
| road-classification-mismatch | 472 | 0.76% |
| r32-per-edge-inset | 289 | 0.46% |
| null-inset | 268 | 0.43% |
| faces-answer | 180 | 0.29% |
| zoning-absent | 142 | 0.23% |
| superseded-prop-id | 84 | 0.13% |
| no-road-adjacency, front-orientation-unresolved, unzoned-no-district-basis, geometry, setback-rule-pending | 29 | 0.05% |

The 52,700 no-zoning-stamp parcels are classified `absent-uncovered` because the served
reason is a statement about our stamp coverage rather than about the world. Most
unincorporated Texas is genuinely unzoned and that share is irreducible; it is not a backlog
and must not be read as one. The reason token is preserved per parcel so the two can be
separated without re-running the sweep.

## Travis 48453 — every parcel

Roster: 380,918 baked Tier-1 snapshots, 804,457 `parcel-node` atoms, 380,917 in both,
**union 804,458**. Zero unresolvable. Swept in 903 seconds. Every parcel returned the
`atom-chain` read path; none was depth-warm.

The roster divergence is itself the largest Travis finding. **423,540 parcels, 52.65% of the
county, carry a `parcel-node` atom and no baked Tier-1 snapshot.** For those parcels the atom
chain is usable (the parcel-node atom is in it) and carries no zoning fact, so the adapter
serves a declined envelope with reason `zoning-absent` and no base facts at all. They are on
our roster and they serve an empty sheet.

| Field | present | absent-covered | absent-uncovered | unresolved | present, of 804,458 |
|---|---:|---:|---:|---:|---:|
| apn | 804,458 | 0 | 0 | 0 | 100.00% |
| landUse | 373,459 | 0 | 430,999 | 0 | 46.42% |
| zoning | 233,247 | 0 | 571,211 | 0 | 28.99% |
| situsAddress | 67,634 | 736,824 | 0 | 0 | 8.41% |
| setbacks | 6,457 | 0 | 798,001 | 0 | 0.80% |
| envelope | 6,457 | 0 | 798,001 | 0 | 0.80% |
| geometry | 0 | 0 | 804,458 | 0 | 0.00% |
| flood | 0 | 0 | 804,458 | 0 | 0.00% |
| frontage | 0 | 0 | 804,458 | 0 | 0.00% |

**The card calls situs present for 380,918 parcels, 47.35%. A human can read an address on
67,634, 8.41%.** The 313,284-parcel gap is the `, TX 78660` stub. Another 423,540 carry no
address at all.

**Single-family, 299,222 parcels**: situs 49,193, 16.44%. Zoning 189,530, 63.34%. Setbacks and
envelope 5,715, 1.91%. Land use and apn 100%. Geometry, flood and frontage 0%.

Setbacks restricted to parcels with a served zoning district: **6,457 of 233,247, 2.77%.** The
declines: `warm-verify-decline` 166,256 and `setback-rule-pending` 60,534.

`address-absent-but-on-cad-roll` is **0** for Travis, and that zero is not good news. It is 0
because the Travis `cad-parcel-roll` atoms carry `situsAddress: null` for all 492,848 rows.
There is no appraisal-roll fallback in that county to recover from, which is exactly why the
Travis fix has to come from `txgio_address` instead.

`flood-zone-disagreement` is 332 of 804,458, 0.04%, against Bastrop's 8.69%. The difference is
the vintage: in Travis both paths carry `NFHL_48_20260101`, while in Bastrop the tier-2 bake
was taken from a 2026-07-22 snapshot and the atom from `NFHL_48_20260101`. **The disagreement
tracks which NFHL snapshot each path was baked from, not the geography.** That is the
reconciliation lead.

Travis sources: geometry and situs `txgio_parcel` / `stratmap25-landparcels_48453_travis_202508`;
land use `cad-roll` / `2026 preliminary appraisal export supp 0_07072026`; zoning, setbacks and
envelope `cortex-tier1-snapshot-breadth-bake` (2026-07-23/24); flood `fema-nfhl` /
`NFHL_48_20260101`.

## Contradictions

Counted per parcel — one parcel contributes at most one count to a kind — over 62,399 Bastrop
parcels.

| Kind | Parcels | Rate |
|---|---:|---:|
| field-unavailable-but-present-upstream | 62,399 | 100.00% |
| flood-zone-disagreement | 5,424 | 8.69% |
| address-absent-but-on-cad-roll | 1,036 | 1.66% |
| envelope-not-derived-but-area-shown | 0 | 0.00% |
| setbacks-present-card-absent-brief | 0 | 0.00% |

Both counties together, over 866,857 swept parcels: `field-unavailable-but-present-upstream`
866,710 (99.98%), `flood-zone-disagreement` 5,756 (0.66%), `address-absent-but-on-cad-roll`
1,036 (0.12%), the other two 0.

### Flood is served to nobody, and the two flood paths disagree

**The Tier-2 FEMA overlay never reaches the browser on the production read path.** The
`node-facets:tier2` bake holds a flood determination for 608,414 parcels, and the endpoint
that serves it composes its response through `mergeBakedBaseFacts`, which builds from the atom
response and never copies `tier2` across. The live body for `48021:36521` has no `tier2` key
at all, while the store holds `{"status":"in-sfha","floodZone":"AO"}` for that parcel. This is
asserted against the captured live bodies in the parity test, not argued from code reading.

Every surface that reads flood reads `tier2.flood`: `compare-facts.ts:201`,
`brief-verdict.ts:105`, `share-verdict.ts:50`. All of them render `flood not verified here`
for 100% of parcels on this path. That is the 62,399 count above.

**And the two flood code paths do not agree.** For `48021:36521`:

| Path | Zone | Adapter | Vintage |
|---|---|---|---|
| `place_layer_snapshots` tier2 | **AO** | `fema:nfhl-flood-zone` | 2026-07-21 |
| `flood-hazard-fact` atom | **AE** | `fema-nfhl-bulk-v1` | `NFHL_48_20260101` |

Both claim FEMA NFHL. They disagree on **5,424 of 62,399 Bastrop parcels, 8.69%**, compared
only where both name a zone — an absent second opinion is not a disagreement. This is the
X-ray PDF defect quoted in the frozen contract ("Zone AO on sheet 1, Flood zone AE on sheet
4") reproduced at source. It is not a rendering bug. Two stores hold different answers and
whichever surface reads whichever store prints whichever zone.

### The two zeros are real zeros, and they relocate the defect

`envelope-not-derived-but-area-shown` and `setbacks-present-card-absent-brief` both returned
0, and both detectors are proven able to fire. Within a single served payload those
contradictions are now structurally impossible, because the atom-chain adapter sets envelope
status and coverage together.

That does not clear the X-ray PDF. It relocates the defect: the PDF, the site-plan sheets and
the brief RE-DERIVE rather than render the served sheet, so the disagreement lives between
surfaces, not inside the payload. `brief-view-model.ts:365` reads `env.setbacks` straight off
the payload with no coverage check while `compare-facts.ts:269` reads the coverage-gated card
facet — one payload, two rules, and today no payload happens to sit in the gap between them.
Nothing prevents one tomorrow. This is exactly what contract invariant I2 (render the sheet,
never re-derive it) exists to close, and P-39 is the row that closes it.

## Two fields nothing serves at all

**Geometry.** The fact-sheet response carries no parcel ring. The only geometry on the wire is
the buildable-envelope polygon, present on 3,931 of 62,399 Bastrop parcels, 6.30%. The map
draws parcels from a PMTiles archive and the search bar gets a centroid by geocoding the situs
address through a separate buildable-envelope resolve. That is contract invariant I5 inverted:
addresses are the navigation authority today and geometry is not, which is precisely why a
missing address presents as a broken Find rather than as a blank field. The 16,104 Bastrop
parcels serving `", ,"` cannot be centred by that path, because `", ,"` passes the truthiness
check in `parcel-lookup.ts` and is then handed to a geocoder as if it were an address.

**Frontage.** `attachingRoads` rides the retrieval atom-chain wire and the PE adapter never
reads it, so no frontage reaches any surface through this endpoint. 0 of 62,399.

## Absence clusters

Grid cells of 0.05 degrees holding at least 250 parcels whose served state is not present.
For a field absent everywhere — flood and frontage — the "clusters" are just parcel density
and carry no information; they are reported for completeness and should be ignored.

The informative ones:

- **situsAddress**, largest cell 2,570 parcels at 30.05,-97.30, then 1,377 at 30.05,-97.35,
  then 541 at 30.05,-97.15. The sentinel is concentrated in unincorporated southeast Bastrop
  County but appears in most cells. It is a source-quality pattern across the StratMap 2025
  Bastrop tile, not a single hole.
- **zoning**, largest cells 4,180 at 30.05,-97.30 and 2,786 at 30.05,-97.35. These are
  unincorporated county and the absence there is honest.
- **setbacks and envelope** track the zoning clusters outside the cities, and inside the city
  the 3,733 `no-setback-row` plus `warm-verify-decline` parcels are the real, fixable hole.

84 clusters in total are recorded in the county record.

## Sources for the follow-on re-ingest

Per county, the source each field was actually served from. Bastrop:

| Field | Source | Vintage |
|---|---|---|
| geometry | `txgio_parcel` | `stratmap25-landparcels_48021_bastrop_202503` |
| situsAddress | `txgio` (parcel fabric) | `stratmap25-landparcels_48021_bastrop_202503` |
| apn | parcel node id | — |
| landUse | `cad-roll` | `data-export-01.14.2026` |
| zoning | `cortex-tier1-snapshot-breadth-bake` (modal), `txgio-zoning-stamp:bastrop-city-tx`, `txgio-zoning-stamp:elgin-tx` | stamped 2026-08-04 |
| setbacks | `cortex-tier1-snapshot-breadth-bake` (modal), `descriptor-fixture`, `bastrop-per-parcel-record-layer-23` | 2026-07-24 |
| envelope | `cortex-tier1-snapshot-breadth-bake` | 2026-08-08 |
| flood | `fema-nfhl` | 2026-07-22 |

Unserved-but-held sources the re-ingest should reach for, both already in the same databases:

- `cad-parcel-roll` atoms — 59,374 Bastrop parcels with a street-segment situs, unread by the
  adapter. Only 1,036 of Bastrop's 16,113 unreadable-address parcels (6.43%) intersect that
  set, verified independently of the sweep by pulling both id sets and intersecting them, so
  the CAD roll fixes the operator's parcel and 6% of the class, not the class. Travis carries
  `situsAddress: null` on all 492,848 of its CAD-roll atoms and gains nothing from this path.
- `txgio_address` — 1,688,950 address points across 6 counties, every one with a city, unread
  by anything.

## Worst counties for served addresses

Parcels with no street segment, `txgio_parcel`, distinct parcels per county.

| FIPS | County | No street | Parcels | Rate | Parcels with a city |
|---|---|---:|---:|---:|---:|
| 48453 | Travis | 312,598 | 380,918 | 82.1% | 0 |
| 48141 | El Paso | 94,535 | 396,734 | 23.8% | 302,452 |
| 48113 | Dallas | 49,753 | 693,556 | 7.2% | 643,803 |
| 48339 | Montgomery | 46,165 | 316,270 | 14.6% | 269,613 |
| 48167 | Galveston | 24,068 | 182,805 | 13.2% | 0 |
| 48229 | Hudspeth | 21,783 | 21,783 | 100.0% | 0 |
| 48355 | Nueces | 17,781 | 146,339 | 12.2% | 131,770 |
| 48349 | Navarro | 17,078 | 45,012 | 37.9% | 27,784 |
| 48021 | Bastrop | 16,113 | 62,257 | 25.9% | 45,929 |
| 48005 | Angelina | 14,274 | 54,183 | 26.3% | 22,830 |

10 counties have ZERO parcels with a street segment: 48153, 48229, 48261, 48295, 48319,
48359, 48393, 48395, 48445, 48501. 48 counties have ZERO parcels with a city. 55 counties are
at or above 50% no-street.

The large metros are healthy: Harris 99.99% street, Bexar 99.11%, Dallas 92.83%, Williamson
100.00% street but 0% city. Travis is the single worst county in Texas by absolute count and
it is the county the operator hit.

## What this changes

1. **P-27's 99.3% must be restated with its counting rule wherever it appears.** The
   address-to-parcel resolver it scopes would index 1,248,412 parcels of non-address as if
   they were addresses. The honest figure for that work is 11,751,433 of 13,071,975, 89.90%.
2. **The flood overlay is a serving bug, not a coverage gap**, and it is one line in
   `mergeBakedBaseFacts`. 608,414 baked flood determinations reach no user today.
3. **The two flood stores must be reconciled before either is served.** Fixing the merge
   without reconciling them ships a number that disagrees with the other surface 8.69% of the
   time in Bastrop.
4. **The address fix is a join, not an acquisition.** For Bastrop the answer is on the
   `cad-parcel-roll` atom; for Travis it is in `txgio_address`. Neither needs a new source.
5. **Geometry must move onto the fact sheet** before a missing address can stop breaking
   navigation. That is contract invariant I5 and it is P-39's work.

## Scope and honesty about what this report is not

Two counties were swept parcel-by-parcel: Bastrop 48021 (62,399 parcels) and Travis 48453
(804,458 parcels), **866,857 parcels of roughly 13 million, 2 counties of 254.** The statewide
ADDRESS numbers ARE a genuine full-table measurement of the parcel fabric across all 253 loaded
counties. The statewide FIELD tallies are NOT: no county beyond those two has been swept, and
nothing here should be read as a statewide claim about zoning, setbacks, envelope, flood or
frontage.

The two counties swept fail in opposite ways, which is itself the argument against
extrapolating from either. Bastrop's addresses are recoverable from an appraisal roll it
already holds; Travis's are not, and half of Travis's roster has no baked snapshot at all.
Runtime is not the obstacle to finishing the state — Bastrop ran in 107 seconds and Travis in
903 — so the remaining 252 counties are hours of compute, and the reason to stop here is that
each new county has so far taught something that changed how the numbers should be counted.

The sweep's declared deviations from the live path, each stated in the resolver version string
that travels with every record: no read-time calibration overlay; envelope geojson replaced by
a feature-count stand-in proven to change no served decision; and the three transport failure
branches are unreachable offline, so a zero `unresolved` count from this sweep is not evidence
that the live path does not fail.
