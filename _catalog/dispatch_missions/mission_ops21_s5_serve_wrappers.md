# MISSION - OPS-21 S5: the five missing serve wrappers, and the first end-to-end proof (P-148)

## What you are building

Five `*ServeCutover.ts` wrappers in `legacy-design-tools`, **wired into the shared
response-assembly path**, for the five written rails that have no consumer:

    setbackRules   parcelAreaSqFt   maxHeightFt   maxLotCoveragePct   maxFootprintSqFt

Then slate `parcelAreaSqFt` for the five counties whose gate verdict now passes.

## Why this lane exists — S4's finding, and it is a clean inverse

S4 (P-135) measured all 45 (county, rail) pairs and refused to slate the passing ones:

```
4 setback rails    wrapper EXISTS (setbacksFactServeCutover.ts)  ->  FAIL the gate, 5/5 counties
parcelAreaSqFt     NO WRAPPER                                    ->  PASSES, 5/5 counties
setbackRules, maxHeightFt, maxLotCoveragePct, maxFootprintSqFt   ->  NO WRAPPER, and fail
```

Adding a pair to `PARCEL_RECORD_SLATE` with no consuming code path is **textually compliant and
functionally inert** — the "runs perfectly, cannot succeed on any branch" class this whole
program was opened over. S4 was right to stop.

## CARRY S4's TWO LESSONS - they are the heart of this lane

**1. Slate membership with no consumer is undetectable by the existing tests.**
`parcelRecordAllowlist.test.ts` tests the pure decision function and **never whether anything
calls it.** Before adding any pair, grep for a `resolveAllowlist` call site keyed to that exact
`rail_key`. Your wrappers are what make those call sites exist.

**2. `parcel_gate_verdict` is a LIVE table under active scheduled per-county re-evaluation,
not a stable snapshot.** S4 proved it the hard way: `48453:parcelAreaSqFt` read `refuse` (1,755
unaccounted) at CP1 and `pass` (0 unaccounted) at CP2, because a new gate run
(`run_id c6177dfb-4b13-4bae-b9c1-b7484a11357e`, `2026-09-11 11:36:03 UTC`) landed between the
two reads. All 44 other pairs were byte-identical across both. **Re-verify the grid immediately
before you slate, and again at close. Do not trust a read you took an hour earlier.**

## The completion predicate is a LIVE PROBE, not a merged file

This is the important part and it is deliberately harsher than "the wrapper exists."

**A wrapper that nothing calls is the same defect one level up from the one S4 refused to
ship.** So: after slating, prove that `parcelAreaSqFt` **reaches an actual response for a real
parcel** on a deployed surface — a live read through `brokerageNodeFacetsRouter` and/or
`propertyExplorerRouter`, whichever your wiring touches, on a parcel in a passing county,
showing the record-sourced value.

If you cannot produce that probe, the lane is not done, regardless of what merged.

That probe is also **the first end-to-end proof this rail family has ever had**: write ->
gate -> slate -> serve. Nothing in the setback/envelope group has completed that path. Say so
in your close, and name the parcel you probed.

## STANDING FACTS

- **Slate only `parcelAreaSqFt`, only the counties that pass at the moment you write.** The
  other eight rails are blocked on the 3,376-parcel `zoningDistrict` residual, which lane Z1
  (P-147) is characterising right now. Do not slate them, do not wait for Z1, and do not
  assume its outcome.
- **Build all five wrappers anyway.** They resolve to `legacy` for any unslated pair by the
  allowlist's own fail-closed default, so they are safe to merge inert and they are what lets
  the next lane slate in one move rather than five.
- **The slate is code-owned and NEVER auto-derived from a passing verdict.** A mechanical PASS
  makes a pair eligible, not slated. The file's own header says so.
- **Every cutover carries its old-path retirement in the same card** (c-then-b). Read L1's
  close (`_inbox/2026-09-10_ops21-l1_close.json`) for your rails' legacy status rather than
  re-deriving — and note its sharpest lesson: a wrapper header saying "no live legacy loader"
  is necessary and **not sufficient**, because `stripZombieEnvelopeFromFacets` nulls
  `facets.envelope` on every request regardless of cutover state. **Trace the shared
  response-assembly function, not the per-rail wrapper.** That function is also where your
  wiring goes, so you will be reading it anyway.
- 97 pairs have shipped and **not one legacy path has been verified retired** (L1). Do not
  compound it: state each pair's legacy status explicitly.
- `parcel_gate_verdict` is on the **FACTORY** host (`ep-round-base-au0jofwp`), resolved by S4.
  `parcel_record_cell` is on the same host. The cortex tables are on a different one; no SQL
  join across them.
- Hays (48209) is excluded; P-145 has not landed.

## Out of scope
Slating anything but `parcelAreaSqFt`. Waiting on or second-guessing Z1. Writing any cell.
Retiring a legacy path (L3/P-144). Hays. `hauska-factory`.
