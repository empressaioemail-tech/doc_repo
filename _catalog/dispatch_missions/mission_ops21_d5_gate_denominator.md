# MISSION - OPS-21 D5: gate denominator 17 to 65 (P-136)

## What you are building
Widen `DEFAULT_SCHED_RAIL_KEYS` in `src/jobs/publish-gate-sched.mjs` (hauska-factory) from
17 rails to all 65.

## STANDING FACTS - this is safe, and here is exactly why
- Today the scheduler grades SLATE_1 (5) + SLATE_1B (2) + SLATE_1C (1) + SLATE_1D (7) +
  LANDUSE_OWNER_GATE_GAP (2) = **17 rails. 48 of 65 are never graded.** Canon says
  `unaccounted` is fatal at publish; for three quarters of the grid that is written in canon
  and not enforced in code.
- **Grading is NOT serving.** `parcelRecordAllowlist.ts` (LDT) requires BOTH slate membership
  AND a `pass` verdict before a rail serves from the record, and the slate is code-owned and
  never auto-derived from a verdict. Widening the gate produces `refuse` verdicts for
  unslated rails and **changes nothing a customer sees.**
- Expect a large pile of refusals. That is the point. 48 rails currently cannot report a
  problem; after this they fail loudly and countably, per rail per county, hourly.
- The closed rail set is `src/lib/parcel-record-engine/rail-keys.js`, 65 rails, derived and
  not hand-authored. **Derive from it.** Do not hand-author a second list - a hand-maintained
  denominator is the exact defect class this program exists to close.
- Watch the latent defect already recorded against the ledger rollup: `totalRails` reads a TS
  constant while `totalCells` counts SQL rows, and nothing asserts the two agree. Do not
  reproduce that shape.

## Completion predicate
`DEFAULT_SCHED_RAIL_KEYS` is derived from `PARCEL_RECORD_RAIL_KEYS` and has length 65, and a
scheduler run produces verdict rows for all 65 rails across the six counties.

## Out of scope
Changing `PARCEL_RECORD_SLATE`. Fixing any rail that now refuses. Both are later rows.
