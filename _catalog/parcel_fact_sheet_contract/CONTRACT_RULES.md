# Parcel Fact Sheet — the six binding invariants

Frozen 2026-08-18 by the planner. Every Smart Site and Command Center lane
builds against this. A change to any invariant comes back to the planner, it is
not negotiated inside a lane.

The contract is `parcel-fact-sheet.ts`. These are the rules that make it bind.

## I1. One resolve per parcel, and exports resolve by id

`FactSheetResolver.resolve(parcelNodeId)` is the only path that reads parcel
facts. Every export takes a `factSheetId` and calls `bySheetId`. No export
accepts a free-text query, an address, or a parcel id captured by its own panel.

This is the invariant that kills the wrong-target class: the drainage study that
returned parcel 48027:498770 for a selected 498778, and the DXF export that
targeted "city of Bastrop" from the search box while the sidebar showed an
address.

## I2. Render the sheet, never re-derive it

The inspect card, property brief, compare panel, share view, site-plan sheets,
X-ray PDF and Command Center all take a `ParcelFactSheet` and render it. None of
them issues its own lookup for anything the sheet carries.

`brief-verdict.ts`, `share-verdict.ts`, `compare-facts.ts` and the verdict half
of `brief-view-model.ts` are deleted and replaced by `composeVerdict`.

Every rendered artifact prints its `factSheetId`. One PDF carrying two different
sheet ids is a visible defect.

## I3. Provenance is a sibling of the value, never inside it

`formatLandUseDisplay` and `formatAcreageDisplay` in `baked-facets.ts` currently
return `"A1 — Single-family residential (cad-roll · data-export-01.14.2026)"` as
one string, so the UI physically cannot separate the fact from its sourcing.

A `Fact<T>` carries `value` and `provenance` as separate fields. Primary display
shows `value`. Provenance renders in a disclosure affordance. The `SetbackXrayDetail`
pattern already in `InspectCard.tsx` is the reference implementation.

Provenance is demoted, never deleted. Selling reasoning rather than data means
the citation is the product; it just does not belong shouting on the card face.

## I4. Failure is not an absence

`Fact` has four states and `unresolved` is an error. It must be visually and
structurally distinct from `absent-covered` and `absent-uncovered`.

Today all three render as grey italic "not verified here", which is why a user
looking at a correctly honest Travis County card reported that "the data box
looks like its displaying error messages". The system was right and the design
was lying about it.

`absent-uncovered` must name `wouldBeFilledBy`. An honest absence that cannot
say what would fill it is not honest, it is just empty.

## I5. Geometry is the navigation authority, addresses are not

`ParcelGeometry` is required and `centroid` is the only thing that moves the map.

The current code geocodes the situs address to find the parcel, so parcels with
no address never move the map. That makes a data gap present as a broken Find.
After this, a missing address is a display gap and nothing else.

## I6. Multiplicity and units live in the type

Flood is a set of zones with area shares. A parcel can be in the 100-year and
the 500-year floodplain at once, and can be part AE and part AO. `primaryZone`
is convenience only; a surface that renders it while hiding a second zone is in
breach.

Every measurement is a `Measurement` with a unit, formatted at render by
`formatMeasurement` against a `DisplaySystem`. No surface formats by hand. This
is what stops elevation printing in metres beside a layer control that says feet,
and stops the DXF exporting metres into a Revit US template.

## Structural consequences worth stating plainly

`county` is not a `Fact`. The FIPS is a substring of the `parcelNodeId`, so a
sheet that cannot name its county is malformed rather than honestly absent.
"County name is not on file for this parcel" on a 48021 parcel becomes
unrepresentable.

`BuildableEnvelope` is one field with three exclusive kinds. "Buildable envelope
not derived here" and "6,325 sq ft, 58% of lot" can no longer coexist in one
document, because they are different variants of the same value.

`derived` names its `setbacksUsed` and its `subtractions`. Two adjacent lots
producing 1,896 and 4,321 sq ft can then be diffed at the input level instead of
argued about at the output.

---

# AMENDMENT 1 — 2026-08-18, planner

Three changes, all raised by lane SS-W1 during implementation. Two are defects in
the frozen v1; one is a consequence of I5 that needed a designed answer rather
than the one the code fell into. The six invariants are unchanged.

## A1.1 `Provenance.atomDids`

v1 could not express the shipped AtomChip popover, which resolves an atom `did`
through `fetchAtomByDid`. Swapping the card onto the sheet would have silently
deleted a live feature.

This was a hole in the contract's own logic, not a compatibility gap. A
provenance record that cannot name the atoms it came from is the wrong shape for
a product whose thesis is that the reasoning chain is the good being sold. An
empty array means no atom backs the fact, which is itself worth rendering. It
never means unknown.

## A1.2 `Setbacks` becomes four `SetbackAxis` values

v1 was four bare measurements, which could not express the shipped setback X-ray
disclosure driven by per-axis `governedBy` and `fieldNotes`.

Keep it beyond that compatibility need. Two adjacent lots produced 1,896 and
4,321 sq ft of buildable area with front setbacks of 25 ft and 20 ft and no
visible reason. Per-axis governance makes that answerable instead of arguable,
which is the same reason `BuildableEnvelope.derived` names its `subtractions`.

## A1.3 `UnplaceableParcel` and `ResolveResult`

SS-W1 implemented I5 correctly and surfaced its consequence: a parcel nothing
could locate stopped opening at all.

That trades one honest failure for a worse one. The QA pass this whole programme
answers was ABOUT parcels that could not be found. Answering it by making them
vanish is not an improvement, and "the card opens but the map does not move" was
at least informative.

Geometry stays REQUIRED on the sheet, because that is what makes I5 structural:
anything holding a `ParcelFactSheet` can be placed, with no null checks and no
still-map branch anywhere downstream. An unplaceable parcel is a different
result type, rendered as a designed state that says we hold the record, cannot
place it, and names what would fix that. It must never silently become a sheet.

**I5 is unchanged and is now enforceable rather than aspirational.**

## Standing ruling on scope

An invariant is not amendable by a lane. A TYPE that cannot express a shipped
feature is a defect in the type, and reporting it rather than deleting the
feature is the correct behaviour. SS-W1 did that on both counts and was right
both times.

---

# AMENDMENT 2 — 2026-08-18, planner

Both raised by SS-W1 after implementing Amendment 1, both verified at source by
the planner, both the same class as Amendment 1: the type could not express what
the product already ships.

## A2.1 `SetbackAxis.distance` becomes nullable

A jurisdiction can govern an axis without setting a number. `api/_lib/setback-not-specified.ts`
exists entirely for this case, with an `allPrimaryNotSpecified` branch, and the
payload carries `setbacks.not_specified`. Such an axis has NO scalar.

Amendment 1 made `distance` non-optional, which forced SS-W1 to carry the state
as a non-finite `Measurement`. It flagged that rather than accepting it, and was
right: a future implementer reads NaN as a bug and "fixes" it to 0, which prints
a 0 ft setback and produces the exact build-to-line error the not-specified
treatment exists to prevent.

**Standing rule this establishes: an unrepresentable state gets made
representable. It never gets encoded in a sentinel value.** A sentinel is a
comment that the compiler cannot read and the next implementer will not believe.

## A2.2 `atomDids` becomes `AtomRef[]`

`InspectCard.tsx` pushes `{ did: cs.atomDid, label: cs.sectionNumber }`, so a
code-section chip reads as its section number. Amendment 1's bare string list
degraded those chips to unlabelled. `AtomRef` carries `did` plus a nullable
`label`.

## Note on the contract's own failure rate

Three implementation rounds have now produced four type defects, every one
found by the lane doing the work rather than by the planner who froze the
contract. The contract was written by READING the code; the defects were found
by EXERCISING it. That is the same gap as code-done versus customer-done, one
level down, and it is the argument for freezing an interface early and letting
an implementer hit it fast rather than for freezing it more carefully.

The invariants have not moved across either amendment. Only the types have.
That split is the contract working as intended.

---

# AMENDMENT 3 — 2026-08-18, planner. Closes the class.

## A3.1 `ParcelGeometry.lotArea` becomes nullable

Raised by SS-W1 applying the A2.1 rule to a case A2.1 did not name, which is
the correct way to read a standing rule. Verified at source: `parcel-geometry.ts`
falls through to `Number.NaN` when there is neither a measured ring area nor a
CAD acreage. A parcel can be placeable and still have no measurable lot area.

## A3.2 The class is now closed, not patched again

Three amendments have each fixed one instance of one defect: a value that can be
unavailable, typed as though it cannot be, and carried as a sentinel. Fixing
them one at a time is the serial-blocker shape — the same failure the sweep lane
was told to avoid by running one county end to end before scoping waves.

So the rule is stated generally and the contract is audited once:

**Every `Measurement` that can be unavailable is `| null`. No sentinel value
ever stands in for absence — not `NaN`, not `0`, not `-1`.**

Audit of every `Measurement` in the contract as of this amendment:

| Field | State |
|---|---|
| `SetbackAxis.distance` | nullable (A2.1) |
| `ParcelGeometry.lotArea` | nullable (A3.1) |
| `FloodDetermination.baseFloodElevation` | already nullable |
| `SiteConditions.elevationRange` | already nullable |
| `SiteConditions.contourInterval` | already nullable |
| `StreetFrontage.frontageLength` | already nullable |
| `BuildableEnvelope.derived.area` | non-null AND CORRECT |
| `BuildableEnvelope.derived.subtractions[].area` | non-null AND CORRECT |

The two envelope measurements stay required because the discriminated union
already carries absence: an envelope with no area is the `not-derived` or
`consumed` variant, so the `derived` variant is only ever constructed when an
area exists. That is absence modelled in the type rather than in a value, which
is the whole point.

**The class is closed. A fourth instance of this pattern is a bug in an
implementation, not a gap in the contract.**

## What three rounds of this actually taught

Every one of the five type defects was found by an implementer filling a type
from a real payload, never by the planner reading code to write the type. The
invariants — which came from observed product defects — never moved. The types,
which came from reading source, moved five times.

That is the same lesson as code-done versus customer-done, one level down: a
model built by reading is a hypothesis, and it is only tested by being filled.
The argument it supports is to freeze an interface EARLY and let an implementer
hit it hard, not to freeze it more carefully.

---

# AMENDMENT 4 — 2026-08-18, planner. The class, closed correctly this time.

## The planner error worth recording

Amendment 3 declared this class closed. It was not. A3.2 audited by grepping for
`Measurement`, but the property that matters is semantic — CAN THIS QUANTITY BE
UNAVAILABLE — and two bare `number` fields carry that property while sitting
outside the type the audit searched for.

**That is the same defect as the thing this whole programme is about.** The
P-27 situs figure counted whether a string was non-null when the question was
whether an address was present, and reported 99.3% against a real 89.90%. My
audit counted whether a field was a `Measurement` when the question was whether
it could be absent. A rule that counts the wrong thing reports a number that is
true and useless. I wrote the closure while the sweep lane was proving the
identical failure a level down.

Closing a class by grepping for a TYPE is not closing a class.

## A4.1 `FloodZoneShare.areaShare` becomes nullable

Upstream may serve a zone set without per-zone shares. Writing `0` for an
unserved share asserts that none of the parcel lies in a zone the same record
lists — a fabricated measurement, not a missing one, and a worse failure than
absence because it is arithmetically usable.

When shares are null the `zones` order is the upstream's and carries no ranking,
so `primaryZone` must be the upstream's declared zone rather than a computed
largest, and `provenance.method` distinguishes `zone-set-with-shares` from
`zone-set-without-shares`.

## A4.2 `BuildableEnvelope.derived.areaPctOfLot` becomes nullable

A known buildable area with no known lot area has no percentage. Declining to
build `derived` in that case was considered and rejected: it discards a
genuinely known area, and the area is the fact the customer came for while the
percentage is derived convenience.

## The complete numeric audit, by field, done once

Every numeric field in the contract, enumerated rather than pattern-matched:

| Field | State | Basis |
|---|---|---|
| `Measurement.value` | non-null, CORRECT | a Measurement that exists has a value; absence is the nullable Measurement |
| `Provenance.confidence` | nullable | was already correct |
| `ParcelGeometry.lotArea` | nullable | A3.1 |
| `SetbackAxis.distance` | nullable | A2.1 |
| `FloodZoneShare.areaShare` | nullable | A4.1 |
| `FloodDetermination.baseFloodElevation` | nullable | was already correct |
| `BuildableEnvelope.derived.area` | non-null, CORRECT | the union carries absence |
| `BuildableEnvelope.derived.subtractions[].area` | non-null, CORRECT | a subtraction that exists has an area |
| `BuildableEnvelope.derived.areaPctOfLot` | nullable | A4.2 |
| `SiteConditions.elevationRange` | nullable | was already correct |
| `SiteConditions.contourInterval` | nullable | was already correct |
| `StreetFrontage.frontageLength` | nullable | was already correct |

**THE RULE, stated by the property and not by the type: every quantity that can
be unavailable is nullable. No sentinel ever stands in for absence — not `NaN`,
not `0`, not `-1`, not an empty string, and not `", ,"`.**

That last one is not a joke. It is the production value of `situsAddress` on
parcel 48021:36521, it passed a non-null test for 1,248,412 parcels, and it is
the same mistake in the data that the sentinel is in the type.

The class is closed against the enumeration above, not against a grep.
