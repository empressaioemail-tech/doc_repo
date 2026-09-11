# MISSION - OPS-21 S4: gate verdicts read, then slate what passes (P-135)

## YOUR SCOPE CHANGED BEFORE YOU STARTED - read this first

The original dispatch said "add the 19 zoning-envelope rails to `DEFAULT_SCHED_RAIL_KEYS`,
then slate per county as verdicts pass." **The first half is DONE.** D5 (P-136) landed:
`DEFAULT_SCHED_RAIL_KEYS` is now DERIVED from `PARCEL_RECORD_RAIL_KEYS`, length 65,
test-enforced, and live-verified at 390/390 (county,rail) verdict rows present, fresh, zero
drift. Do not re-do it.

**Your repo is `legacy-design-tools`, not hauska-factory.** `PARCEL_RECORD_SLATE` lives in
`artifacts/api-server/src/lib/parcelRecordAllowlist.ts`.

## What you are actually doing

**Step 1 is a MEASUREMENT, not a change. Do it first and report before writing anything.**

Read the live `parcel_gate_verdict` rows for the nine rails that now have written cells, across
the five in-scope counties, and report which (county, rail) pairs actually carry `pass`:

    S1 wrote:  setbackFrontFt  setbackSideFt  setbackRearFt  setbackCornerFt  setbackRules
    S2 wrote:  parcelAreaSqFt  maxHeightFt  maxLotCoveragePct  maxFootprintSqFt

**Do not assume any of them pass.** The publish gate is zero-tolerance
(`publish-gate.js`: `ok: unaccountedCount === 0`), and S1's close records a residual of
**3,376 parcels still unaccounted on the setback rails**, blocked on their `zoningDistrict`
cell not yet being `value` or `refused`. S2 inherited the same population on three of its four
rails. If those 3,376 are spread across counties, **every county fails every affected rail**
and the honest answer to this lane is "nothing can be slated yet, and here is exactly what
blocks it."

That is a legitimate and useful close. **Report the real verdict grid. Do not widen the slate
to make the lane look finished.**

**Step 2, only for pairs that genuinely pass:** add them to `PARCEL_RECORD_SLATE`.

## STANDING FACTS

- **The slate is code-owned and is NEVER auto-derived from a passing verdict.** A mechanical
  PASS does not capture every product-quality concern. Adding a pair is a deliberate, reviewed
  decision — the file's own header says so. A passing verdict makes a pair ELIGIBLE, not slated.
- **Four rails must NOT be slated**: `buildableAreaSqFt`, `buildableAreaPct`, `envelopeStatus`,
  `envelopeDisclosure`. S2 deliberately left them unwritten because the only tested computation
  needs road-frontage edge labeling nobody has acquired (OPS-21 item 3P-14). They will refuse,
  correctly. Leave them alone.
- **Hays (48209) is excluded.** P-145 has not landed; its cells are 100 percent unaccounted by
  design. Five counties: 48021, 48055, 48309, 48453, 48491.
- **Every cutover carries its old-path retirement in the same card** — the c-then-b rule. But
  read L1's close first (`_inbox/2026-09-10_ops21-l1_close.json`): it audited all 97 existing
  pairs and found **70 present-reachable**, meaning ninety-seven cutovers have shipped and not
  one legacy path has been verified retired. Do not compound that. For each pair you slate,
  state its legacy path's status from L1's own verdicts, and if L1 already classified your
  rail, cite it rather than re-deriving.
- **L1's sharpest lesson, which applies directly to you:** a ServeCutover module's header
  saying "no live legacy loader" is necessary and NOT sufficient. `stripZombieEnvelopeFromFacets`
  nulls `facets.envelope` on every request, every route, regardless of cutover state.
  `zoningDistrict` and `setbackFrontFt` carry identical wrapper language and diverge completely
  on real reachability. **Trace the shared response-assembly function, not the per-rail wrapper.**
- **Grading is not serving.** D5 widened what is graded and changed nothing a customer sees.
  YOUR change is the one that does. Treat it with that weight.
- **Three stores, two of them named `neondb`.** `parcel_gate_verdict`'s host is listed NOT
  ESTABLISHED in the program preamble — resolve it live and report which host answered so that
  block gains a line instead of a guess.

## Completion predicate

Not "the slate is bigger." The predicate is: **every (county, rail) pair among the nine written
rails carries a reported verdict, and every pair with a `pass` verdict is either slated or
carries a named reason it was not.** A lane that slates nothing because nothing passes MEETS
this predicate, provided the grid and the blocking cause are reported.

`node scripts/plan-progress.mjs --sql` in doc_repo for the S4 row.

## Out of scope
Re-widening `DEFAULT_SCHED_RAIL_KEYS` (D5 did it). Writing any cell. Running
`parcel-r5-zoning`. Fixing the 3,376 deferred parcels. Retiring any legacy path (that is
L3/P-144). Hays.
