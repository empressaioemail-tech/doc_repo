# MISSION - OPS-21 S6: slate the eight, and make it QA-able (P-150)

## This is the last lane before the operator can QA in the app

Two lanes closed in parallel and between them they removed the only two blockers:

- **Z2 (P-149)** taught both writers to propagate a legitimate `not-applicable` zoningDistrict.
  Live-verified: unaccounted for the eight dependent rails across five counties is **exactly 0**,
  and **all 40 of 40 `parcel_gate_verdict` (county, rail) pairs flipped from `refuse` to `pass`.**
- **S5 (P-148)** built and wired the five missing `*ServeCutover.ts` wrappers, and proved the
  path end to end with live HTTP probes on production (Williamson 7,239.42 sqft, Bastrop
  13,988.45 sqft, both genuine `parcel_record`-sourced values).

**S5's own close says its other four wrappers are "permanently inert, blocked on the
3,376-parcel residual that Z1 is characterizing in parallel." That is no longer true.** Z2
closed that residual while S5 was running. S5 could not have known. Verify it yourself rather
than taking either close's word.

## What you are doing

Add to `PARCEL_RECORD_SLATE` in `artifacts/api-server/src/lib/parcelRecordAllowlist.ts`, for the
five in-scope counties (48021, 48055, 48309, 48453, 48491):

    setbackFrontFt  setbackSideFt  setbackRearFt  setbackCornerFt  setbackRules
    maxHeightFt     maxLotCoveragePct            maxFootprintSqFt

Forty pairs. `parcelAreaSqFt` is already slated by S5 — leave it.

## STEP 1: RE-VERIFY THE GRID YOURSELF, IMMEDIATELY BEFORE YOU WRITE

`parcel_gate_verdict` is a **live table under active scheduled per-county re-evaluation, not a
snapshot.** S4 proved it: `48453:parcelAreaSqFt` read `refuse` at CP1 and `pass` at CP2 because
a scheduled run landed between the reads, while all 44 other pairs stayed byte-identical.

Read all 40 pairs live. Slate only what passes **at the moment you write**, and re-verify again
at close. If a pair has flipped back, say so and leave it out — a slate entry whose verdict has
gone stale is exactly the state the allowlist's `refused` bucket exists to make visible.

It is on the FACTORY host (`ep-round-base-au0jofwp`), resolved by S4.

## CARRY THE RETIREMENT, because this is the 98th through 137th cutover

`_decisions/2026-09-02_step7_consumer_c_then_b.md` requires every cutover to carry its old-path
retirement **in the same card**. L1 (P-142) audited all 97 existing pairs and found **70
present-reachable** — ninety-seven cutovers shipped and not one legacy path verified retired.

**Do not compound that silently.** For each of your 40 pairs, state its legacy path's status.
Read L1's close (`_inbox/2026-09-10_ops21-l1_close.json`) rather than re-deriving; it already
classified the setback rail-group. Where L1's verdict covers your rail, cite it. Where it does
not, determine it.

**And apply L1's sharpest lesson:** a wrapper header saying "no live legacy loader" is necessary
and NOT sufficient. `stripZombieEnvelopeFromFacets` nulls `facets.envelope` on every request,
every route, regardless of cutover state. `zoningDistrict` and `setbackFrontFt` carry identical
wrapper language and diverge completely on real reachability. **Trace the shared
response-assembly function, not the per-rail wrapper.**

## THE COMPLETION PREDICATE IS A LIVE PROBE, and a negative control

Copy S5's discipline exactly, because it is the standard now:

1. **Live HTTP probes on the production surface**, at least two parcels in two different
   counties, showing genuine `parcel_record`-sourced setback and envelope values. Name the
   parcels and the values.
2. **A negative control on the same probe** proving the four 3P-14 rails
   (`buildableAreaSqFt`, `buildableAreaPct`, `envelopeStatus`, `envelopeDisclosure`) still
   correctly REFUSE rather than leaking across the slate boundary.
3. **A Hays probe** confirming 48209 is untouched and still declines — it was excluded from
   every write and P-145 has not landed.

A merged slate is not a served slate. If you cannot produce those three, the lane is not done.

## STANDING FACTS

- **The slate is code-owned and NEVER auto-derived from a passing verdict.** A mechanical PASS
  makes a pair eligible, not slated. Adding these 40 is a deliberate reviewed decision, which
  is what this card is.
- **`setbackRules` is NOT a scalar.** S5 found by querying live data that its content lives
  entirely in a `parcel_record_companion_row` and the cell's own value field is null on all
  351,872 present rows. A unit test with hand-invented fixtures would pass on a broken adapter.
  S5's wrapper already handles it — do not "simplify" it.
- **Do not slate the four 3P-14 rails.** They are unwritten by operator ruling (no approximation
  state; the trigger is the road-frontage acquisition). They will refuse, correctly.
- **Hays (48209) is excluded.** P-145 has not landed.
- Deploy through this repo's canary-then-shift discipline, image pinned by digest, never
  `latest`. Read CI conclusions as raw SUCCESS strings via `gh api`, never the display bucket.

## Out of scope
Writing any cell. Retiring a legacy path (L3/P-144 owns that; you only report status). Hays.
The 3P-14 rails. hauska-factory.
