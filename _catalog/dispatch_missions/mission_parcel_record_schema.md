# Mission — build the parcel record: the shape, the template, and one county proven

## What this is

The operator has ruled that every parcel in all six counties carries a full record, filled
with data or honest absence, **before anything else moves**. Rebake is acceptable. Ruling:
`_decisions/2026-09-01_parcel_record_is_the_gate_to_everything.md`.

**This card is step 1 of 7: build the tables.** It does not fill them beyond one proving
county. Do not let it drift into acquisition.

## The shape

**Row: one parcel.** 981,405 across the six counties by containment. **Column: one rail we
intend to serve.** **Cell: exactly one accounted state.**

```
value            the value, with provenance: source and vintage
absent-verified  something LOOKED; a basis says where and why not
not-applicable   it structurally cannot exist for this parcel; a reason says why
refused          a named refusal
unaccounted      nothing has looked yet. Legitimate at rest. FATAL at publish.
```

Standing rule, `_decisions/2026-09-01_every_parcel_starts_with_a_full_record.md`: a record
is instantiated with its **complete** column set and is never partially shaped. Acquisition
changes a cell's state, never its existence.

**Make the column set closed and compiler-enforced where the shape can carry it.** A type
with no way to omit a cell has no trigger to be missing and no call site to be absent. The
gate is the backstop; the type is the mechanism.

## Scalar cells and companion tables

Some rails are one-to-many: wells, permits, easements, pipelines, setback rules, special
districts. **The cell still carries exactly one state**; the companion table carries the
rows.

A parcel with three wells has `wells = value` plus three companion rows. A parcel in an
unsourced permit jurisdiction has `permits = absent-verified` with a basis and zero
companion rows. **A parcel with zero permits at a SOURCED jurisdiction has `permits = value`
with an empty set** — and that is a different cell from the unsourced one. Get that
distinction into the type, not into a convention.

## The rail set: derive it, but lose nothing

Seed list from evidence and from the operator's naming. **Treat this as a floor, not a
specification** — derive the authoritative set from `Tier1FacetPayload`,
`Tier2EnvelopeFacet`, the rail register, and the `CAD-SERVE-RECONCILE` close, then add
anything below that is missing.

**CAD and identity** — apn, situs address / city / state / zip, landUse code + description +
source + vintage, acreage value + sqft + method, yearBuilt, and the cadRoll five:
marketValue, assessedValue, landValue, improvementValue, livingAreaSqft.

**Jurisdiction** — county, cityLimits, etjStatus.

**Zoning and envelope** — district, jurisdictionKey, zoning provenance, envelope status,
setbacks front/side/rear/corner, parcelAreaSqFt, buildableAreaSqFt, buildableAreaPct,
maxLotCoveragePct, maxHeightFt, maxFootprintSqFt, citationUrl, disclosure, edgeSignal.

**Companion-bearing rails** — setback rules, wells, pipelines, permits, easements, building
footprint, special districts including MUD and PUD, flood.

**Two facts to carry into the design.** MUD duplicates special-district: 1,888 MUD polygons
are already loaded in `tx_special_district`, so `mud` is the same subject built twice —
resolve it as one rail with a declaration, not two columns. And flood tier-2 holds 608,414
determinations that `mergeBakedBaseFacts` currently drops, so flood is a rail whose data
exists and does not reach a user.

**Owner is not a public column.** Owner names were stripped from `public-free` roll bodies
2026-09-01; `owner-fact` is the paid home. If owner appears at all it is gated, and it is
not part of the free record.

## Two states that are earned, and one that must never be forged

**`not-applicable` needs a structural reason.** Counties do not zone unincorporated land, so
zoning, setbacks, edges and envelope are `not-applicable` for the **370,289** unincorporated
parcels measured by containment — **not** the roadmap's 357,269, which is wrong by about
13,020 in the split. Outside that population it is an unearned absence.

**`absent-verified` needs a basis.** It is a claim that something looked.

**Never convert `unaccounted` to `absent-verified` to clear a gate.** That is a lie that
passes every check, and it is the single most likely way this build fails. Watch for
unaccounted counts falling without a matching acquisition landing.

## Durable and portable, because the second state is the point

The schema, the cell-state type, the companion pattern and the instantiation procedure are
a **reusable template** with a durable home. Say where you put it.

**Name anything hardcoded to Texas or to these six counties at build time.** `engine-core`
is already known not to be Texas-clean — 30 of 48 executable files are coupled — and
discovering the same in this template later costs a rebuild. Utah proved the premise ports
while normalisation does not.

## Do not build beside the dead ledger

A county-by-rail ledger exists and **its gating indicators are dead**: `hasWriter`,
`atomFamilyState` and `isPartial` are uniform across all 3,556 cells and nothing recomputes
it. This is a different grain, so it is not a duplicate — **but say what happens to the old
one.** Repoint consumers before retiring a store, never the reverse, and two ledgers where
one is dead and nobody says which is authoritative is worse than either.

## Prove it on one county, then stop

**Instantiate the full record for one county**, every parcel, every column, all cells
`unaccounted` except what the shape can establish structurally. Report the cell counts by
state.

Then **ingest what already exists for that one county** — step 2 of the ruling, scoped to
one county as a proof. Much of this data is present and merely unstamped, unmerged or
unserved. Report how many cells moved from `unaccounted` to a real state on existing data
alone, before any acquisition.

**That number is the finding of this card.** It sizes steps 2 through 4 for the other five
counties and it tells the operator how much of the perceived gap is acquisition versus
plumbing.

Do not acquire anything. Do not run the other five counties. Do not bake.

## Verify by violating

Before reporting the shape as working: **instantiate a parcel with a missing column and
confirm it cannot be constructed.** If it can, the type is not carrying the constraint and
the gate is doing work the compiler should do.

Then poison one cell to `unaccounted` on a county that was otherwise complete and confirm
the publish gate refuses. Both directions, on real data.

## Do not

- Do not fill beyond the one proving county.
- Do not acquire any new data on this card.
- Do not bake or publish.
- Do not convert `unaccounted` to `absent-verified`.
- Do not stamp `not-applicable` outside the 370,289 unincorporated population.
- Do not author the rail list only from this card; derive it and report what you added.
- Do not model MUD and special-district as two rails.
- Do not put owner on the free record.
- Do not hardcode Texas or these six counties without naming it.
- Do not touch any repository other than the registered worktree you open.

## Close

Use the exact CP1 / CP2 / CLOSE paths named at the end of this dispatch. Declare snapshot
and `current_database()` in the first output. Report the derived rail set and what you added
beyond the seed, the schema and where the durable template lives, the per-state cell counts
for the proving county before and after ingesting existing data, **how many cells moved on
existing data alone**, the Texas-coupling you found, the disposition of the county-rail
ledger, and both violation tests. Name what contradicted this card, or say plainly that
nothing did. `leave_behind` named. Subagents do not commit.
