# MISSION - OPS-21 L1: retirement audit of 94 slated pairs (P-142)

## What you are building
A READ-ONLY audit. You retire nothing. You produce a ranked backlog.

**For each of the 94 slated (county, rail) pairs: does its OLD serve path still exist, and is
it still reachable?**

## STANDING FACTS
- `_decisions/2026-09-02_step7_consumer_c_then_b.md` requires that **each cutover carries its
  old-path retirement in the same card.** That is the ENFORCEMENT retirement rule as designed.
- **94 cutovers have shipped and nobody has verified that a single legacy path was retired.**
  If none was, 24 percent of the serve path has two live implementations, and ENFORCEMENT's
  rule - repoint consumers first, THEN retire the store, because reverse order turns an
  invisible defect into a visible regression - is being violated 94 times.
- The live slate is `PARCEL_RECORD_SLATE` in
  `artifacts/api-server/src/lib/parcelRecordAllowlist.ts`: 18 rails, 94 pairs. The 13
  `*ServeCutover.ts` modules name their own legacy loaders, and several state in their own
  headers that there IS no legacy fallback loader - which is itself a per-rail answer worth
  recording rather than assuming.
- **Four read paths are live simultaneously:** the atom chain (retrieval-api), the baked
  node-facets snapshot, the cortex fallback route (`envelope`-null by design), and the
  engine-api feasibility route. A rail may have a legacy path on more than one.
- **Reachability, not existence.** ENFORCEMENT: retirement is proven by decline, never by
  documentation. Code existing is not the finding; a caller able to reach it is.

## Completion predicate
Every one of the 94 pairs carries an audited verdict - legacy absent, present-unreachable, or
present-reachable. Count of unaudited pairs equals 0. Output ranks the reachable ones for L3.

## Out of scope
Retiring anything (L3 / P-144). Widening the slate (L2 / P-143).
