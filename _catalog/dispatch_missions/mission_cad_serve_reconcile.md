# Mission — every CAD field we hold, against every field we are about to serve, per county

## The question

For each of the six CTX counties: **what does CAD actually have, what will production
actually serve, and what is the gap?** The gap has to be closed before Wave R, so it has to
be named first.

This is read-only. It measures and reports. **It fixes nothing.**

## Why per county, and why derived rather than listed

`livingAreaSqft` is the worked example and the reason this card exists. Measured
2026-09-01: Hays 54.3 percent of parcels, Williamson 40.8, Caldwell 27.7, Bastrop 11.2,
and **McLennan and Travis exactly zero** of 114,255 and 500,307. A single global number
would have read as "about a third covered" and hidden two counties with nothing at all.

**Enumerate the field set from the catalog, never from a list somebody remembers.** Query
`information_schema.columns` for the CAD tables and enumerate the distinct keys actually
present in the atom bodies. A hand-written field list finds only the fields whoever wrote
it already knew about, and the fields nobody remembers are exactly the ones this card
exists to surface.

## Four cells, and one of them is an alarm

For every field, in every county, place it in exactly one cell:

| | served | not served |
|---|---|---|
| **has data at source** | fine | **THE GAP** — data we hold and do not ship |
| **no data at source** | **ALARM** | honest absence, if it is labelled |

**The bottom-left cell is the one to look hardest at.** A field appearing on the served
surface with no source behind it is either legitimately derived — in which case its
provenance must say so and name its inputs — or it is defaulted, inherited, or invented. A
`0` or an empty string that was never measured is the defect class this operation keeps
finding, and it will look like coverage in every count.

**The top-right cell is the operator's question.** Fields we already hold and are about to
not ship.

**The bottom-right cell is only acceptable if labelled.** No data and no state is
blank-no-state, which the gold probe already found on the five `#575` CAD value fields. No
data with `absent-verified` and a basis is correct and needs no fix.

## Method: both sides in SQL, 100 percent, then a live spot check

**Source side.** Per county, per field: rows, distinct parcels, non-null, and — for numeric
fields — how many are stored zeros. **Do not collapse zero into absent.** Bastrop carries
26,553 real `$0` improvement values on vacant land, and `living_area_sqft` has no stored
zeros at all. Those are different fields with different truths and one rule for both is
wrong.

**Serve side.** Measure what production will actually serve, which is the bake output, not
the code. Establish where the served shape lives — the twin bodies, node facets, whatever
the bake writes — and enumerate the keys actually present per county. **Say in your close
which store and table you measured and how you established it is the one Wave R publishes.**

**Then spot-check the six golds live**, because a bake row and a rendered card are not the
same thing. Today `inspectHighLevelLabel` returns `Land use` in current source while the
**shipped bundle still carries the `Zone` fallback**, and `buildableAreaPct` 56.1 sits on
the wire while the card prints `Buildable Not stamped here`. Source-fixed, bake-correct and
bundle-stale are three different states and only the last one is what a user sees.

If a field is present in the bake and absent on the rendered card, that is a serve-path
finding and it belongs in this report.

## A fifth thing to look for: pipeline words leaking onto the wire

GOLD-PROBE found `cityLimitsFact.status = unmeasured` served on `48491:76149` and
`48453:493738`, with basis "no usable parcel query point", and `etjStatus: unresolved`
leaking on **all six golds**.

Those are not "we have not looked." **The bake looked, found no usable query point, and
then put its own internal word on the wire.** `unmeasured` and `unresolved` are pipeline
states; the serve contract has four states and neither is one of them. Ruled 2026-09-01:
the serve path never emits a pipeline state word — it converts to `absent-verified` with
that basis, or it refuses the facet.

**So check every served field for state-word leakage, not just for presence.** A field
carrying `unmeasured`, `unresolved`, `pending`, `unknown`, or any other internal token is
a defect even though it is non-null and will pass every presence-shaped count. Report each
one with the field, the counties, and the basis the bake had available.

This is distinct from the four cells above: the field is served and has data at source, and
it is still wrong.

## Sampling

**100 percent for anything expressible in SQL.** Both sides are, so both should be.

For the live spot check, **area sweep, not random.** Random sampling certified a broken
Bastrop once. Take the six golds plus every parcel in one chosen block per county, and
force in the hard classes: refused-roster parcels, gate-blocked, no-row, PDD, five- and
seven-digit ids, two-tax-year parcels, and unincorporated.

## What to report

**A per-county, per-field table with the four-cell placement**, plus the source population
and the served population for each. That table is the deliverable and the gap is whatever
sits in the top-right and bottom-left cells.

Rank the gap. A field with data in all six counties that ships in none is worth more than
one with 11 percent coverage in a single county, and the operator needs to see which is
which rather than a flat list.

**Name which gaps are source gaps and which are pipeline gaps.** Travis living area is a
CAD acquisition problem; a field we hold everywhere and never serve is a bake or serve
problem. They go on different cards and conflating them wastes a lane.

## Store discipline

`cortex-prod` holds `hauska_mcp` and `neondb` on one compute. Take the store token, run one
heavy operation at a time, and do not run inside a Tuesday 05:00 to 06:00 UTC Neon
maintenance window.

Landmines that return confident wrong answers: the atoms store is database **`hauska_mcp`**,
not `neondb`; factory `runs.status` is `success`, not `succeeded`; `landing.method` is
`ring` on every persist row including `covers-v1`; a county's latest factory success may be
a `persist:false` measure run; and **`jurisdiction_tenant` is not a FIPS scope** — 72
`cad-parcel-roll` atoms carry a bare-FIPS or foreign-county tenant, so scope by half-open
`entity_id` FIPS ranges as in `_inbox/2026-09-01_owner-rowcount_table.json`.

## Do not

- Do not fix any gap you find. Finding and fixing are separate cards.
- Do not write, bake, stamp, or backfill anything.
- Do not hand-write the field list; derive it from the catalog and from the bodies.
- Do not collapse stored zeros into absent, and do not fabricate a zero for a missing value.
- Do not report a served field from code; measure the bake output and the rendered card.
- Do not random-sample the live check.
- Do not scope by `jurisdiction_tenant`.
- Do not touch any repository other than the registered worktree you open.

## Close

Use the exact CP1 / CP2 / CLOSE paths named at the end of this dispatch. Declare snapshot
and `current_database()` in the first output. Report the derived field list and how you
derived it, which store and table you measured as the serve side and how you established it
is what Wave R publishes, the per-county per-field four-cell table, the ranked gap split
into source gaps and pipeline gaps, and any field served with no source behind it. Name
what contradicted this card, or say plainly that nothing did. `leave_behind` named.
Subagents do not commit.
