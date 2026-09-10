# CTX-HAYS-GATE — the only county nobody has measured, and its refusal has never been read

Repo: `hauska-factory`. **Measurement lane.** A code diff may or may not be warranted; that
is your finding, not your assignment.

## First, a correction to what everyone believes about Hays

Hays' **pre-bake rail gate passes.** Read live 2026-09-10 from `parcel_gate_verdict`:
`48209` has **no refusing rails at all**, while Bastrop and Travis were still refusing on
`schoolDistrict`.

Hays' blocker is the **cadRoll post-condition**, which fires after the bake, not the
readiness gate that fires before it. Those are different gates and the distinction has been
blurred all day.

## Second, a correction to the framing that has been carried since 2026-09-09

The original finding recorded Hays as refusing `CADROLL_RENULLED` at a 22.22 percent
dollar-miss rate, derived as 38,444 / 173,050 — tier1 rows without dollars over all tier1
rows.

**That is not the gate's arithmetic.** `CADROLL_EXPECTATION_SQL` selects only prop_ids
whose `cad_property` row **already carries a real dollar** (`land_value > 0 OR market_value
> 0 OR assessed_value > 0 OR improvement_value > 0`). Its own comment says so:

> A `cad_property` row with no dollar columns populated is a legitimate declared absence
> (Williamson's 282,570 hollow StratMap rows are exactly this), and a baked null against it
> is CORRECT, not a regression.

Parcels with no baked snapshot at all are excluded as `absentSnapshot`, not counted as
misses.

So the 38,060 geometry-only rows CTX-HAYS-SPLIT identified **cannot** be causing this
refusal. The failing population is parcels that **have** dollars in `cad_property`, **do**
have a baked snapshot, and whose snapshot lacks the dollar object. That is a real bake
defect on real accounts, and **nobody has read the list.**

The integration seat carried the wrong framing for several hours and held an operator ruling
that would not have unblocked anything. Do not inherit it.

## The work

1. **Read the actual failing set.** The refusal payload carries `sampled`, `compared`,
   `misses`, `missRate`, `absentSnapshot` and `examples: misses.slice(0,5)`. Get the real
   numbers and the real parcel ids — from a run record, a re-derivation of the gate's own
   query against the store, or both. Say which instrument you used.

2. **Reproduce the gate's predicate exactly**, then count the true failing population for
   Hays. `CADROLL_EXPECTATION_SQL` is `ORDER BY prop_id ... LIMIT`, so the gate sees a
   **sample**, not the population. The sample is ascending-`prop_id`, which biases toward
   low-numbered and degenerate parcels — the same bias that surfaced `48055:1` repeatedly.
   **The sampled miss rate and the true population miss rate may differ substantially, and
   establishing that gap is part of the mission.**

   Note the comment on `DISTINCT` in that file: an undistincted `LIMIT 500` once sampled
   only 309 distinct parcels across two tax years and counted duplicates in both numerator
   and denominator. Do not reintroduce that.

3. **Determine the mechanism.** Why does a parcel with real dollars in `cad_property` bake
   without them? Candidates, none preferred:
   - the bake reads a different vintage than the expectation query;
   - a join that drops the dollar object for a subset;
   - the `situsForBake` skip path, now fixed in LDT `9873ff11` but **not yet in any image**
     — Hays carries 768 punctuation-only situs rows, so some of this population may simply
     evaporate when that pin lands;
   - something else.

   State the mechanism you chose and one you rejected, with evidence.

4. **Say whether it is worth running Hays again first.** The publish image is about to be
   rebuilt on LDT `9873ff11`, which carries both the situs fix and the acreage earned
   absence. If your analysis says Hays' failing set is largely the situs class, the honest
   recommendation may be "re-run after the pin and re-measure" rather than a fix. That is a
   legitimate and valuable answer.

## What you must NOT do

**Do not touch `MAX_MISS_RATE` or any gate threshold.** That gate caught a real data problem
and no code change should paper over it.

Do not backfill, re-acquire, or write anything to `cad_property`. Hays' 2026 roll was
independently confirmed correct by Hays CAD's own 2025 Annual Report (132,538 accounts,
132,358 by category, against our 134,606) — the county is not missing anything and that
question is closed.

Do not deploy, submit a Cloud Build, or run any bake, publish, walk or Cloud Run job. The
integration seat owns every execution and will re-run Hays when you say it is worth it.

Do not write to `legacy-design-tools`, `hauska-engine` or `hauska-map`.

## Traps carried forward, all paid for today

`parcel_gate_verdict` is a **cached** evaluation carrying `evaluated_at`. A verdict read
during a write is meaningless — the integration seat nearly reported a partial impervious
failure off a verdict cached mid-apply.

`runs` has `started_at`, not `created_at`. Dry runs write **no** run row (`runId: null`), so
absence of a row is not absence of a run.

`parcel_record_cell.place_key` is `<fips>:<prop_id>`; `place_layer_snapshots.place_key` is
`node:<fips>:<prop_id>`.

`cad_property` carries multiple tax-year rows per `prop_id`. Hays holds 2025 and 2026.

`cli.mjs` has a code-only catch handler that discards error detail; call the job function
directly to see the real payload.

## Close contract

Standard lane close JSON, plus:

- The real refusal numbers and the example parcel ids, with the instrument named.
- The gate's sampled miss rate versus the true population miss rate, both with counting
  rules.
- The mechanism, the one you rejected, and the evidence.
- A plain yes or no: is it worth re-running Hays after the LDT pin lands, before any fix?
- If a fix is warranted: where, precisely enough to dispatch.
- `leave_behind`.
