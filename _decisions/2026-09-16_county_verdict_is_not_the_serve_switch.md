---
decision_id: 2026-09-16_county_verdict_is_not_the_serve_switch
date: 2026-09-16
owner: Nick (operator ruling), recommended by the integration seat
status: active
related_canonical:
  - 90_operations/OPS-16_texas_market_plan_of_record.md (A-192, A-193, rows P-256, P-269, P-297)
  - _catalog/program_preambles/OPS-24.md (law 7)
  - _decisions/2026-09-11_ledger_as_serving_path_seven_steps.md
  - _inbox/2026-09-16_texas_scaleup_ROADMAP.md
---

## Decision

The gate verdict for a (county, rail) pair is a completeness and publish grade and stops being
the switch that decides what a customer is served: on a slated rail, each parcel is served from
its own ledger cell (an earned value as that value, anything else as a declared refusal with its
reason), and nothing on a slated rail ever falls back to the legacy or baked value.

## Context

The integration seat found this while reviewing P-256 (factory PR #160), which stops the setback
writer from writing false "checked, none required" absences and rewrites about 219,472 parcels'
worth of them. Today the verdict does two jobs. The publish gate reads it to decide whether a
county may publish, and the serve path reads the same row to decide whether to serve the ledger
at all: LDT's `resolveAllowlistState` (`artifacts/api-server/src/lib/parcelRecordAllowlist.ts`,
line 547 at LDT `9ce30b8`) returns `record` only on `pass` and `refused` otherwise, about 19
`*ServeCutover.ts` modules follow it, and `setbacksFactServeCutover.ts:57` returns `null` on
anything but `record`, so the caller keeps the bake-derived value. hauska-engine's
`services/retrieval-api/src/parcel-record-reader.ts` (around line 105 at `d88cf65`) makes the same
county-level decision for the `/record` route. Because the verdict refuses on a single unaccounted
cell, P-256's honest correction would turn `setbackFrontFt` to `refuse` in all six counties (all
five setback rails read `pass` there on 2026-09-16, and `setbackFrontFt` is slated in all six),
and every parcel in those counties, including parcels with correct current values, would fall
back to the stale bake. The alternatives were to apply P-256 and accept that regression, or to
hold P-256 indefinitely; both leave a customer-facing value decided by a county-wide flag.

## Structural commitment check

Sell reasoning, not data: holds; each served value keeps its own cell's source, vintage and
reason, and a refusal carries its reason. Confidence is earned, not asserted: strengthened; an
unaccounted cell can no longer be dressed as a stale value, and an earned cell is no longer
hidden by its neighbours' gaps. Cost per jurisdiction: neutral. Dual interface: holds; the MCP,
map and PDF read one decision through the one reader. Tenant sovereignty: unaffected.

## Reasoning

A county verdict is an aggregate: it answers "is this rail complete enough in this county to
publish", and one unaccounted parcel correctly makes that answer no. Using the same aggregate to
choose what an individual parcel shows punishes every parcel for the worst parcel in its county,
and it turns every honest correction (a writer replacing a false absence with `unaccounted`) into
a county-wide regression to older data, which makes correctness work look like breakage and
teaches the fleet to avoid it. The 2026-09-11 ruling already says the one reader "walks gated
cells" and that unslated rails "refuse with the cell state; they do not fall to a legacy path"
(`_decisions/2026-09-11_ledger_as_serving_path_seven_steps.md`, step 3); OPS-23 law says an
unslated or unaccounted rail refuses and never falls to legacy; P-269 already carries that
principle for the dollar rails. Deciding per cell is the reading of those rulings that survives
contact with a partly complete county. The slate stays: it says which rails are cut over to the
ledger at all, and a rail off the slate keeps its current path until it is cut over.

## What this means in practice

1. **Publish** keeps reading the county verdict through `requirePreBakeReadiness`, unchanged.
2. **Serve**, for a slated rail: the reader loads the parcel's own cell. `value` (and a verified
   zero where the rail has one) is served with its source and vintage; `absent-verified` and
   `not-applicable` are served as the stated absence with its reason; `refused` and `unaccounted`
   are served as a declared refusal with the cell's reason; a missing cell or an unreadable store
   is a declared refusal naming that. The legacy or baked value is never the answer for a slated
   rail.
3. **The verdict still travels** on the response as information (the county's grade and count),
   so a surface can say "this county's setbacks are incomplete" without hiding a parcel's value.
4. **Both decision sites change together** (LDT's allowlist and every cutover that follows it;
   retrieval-api's reader), with a divergence test between them, as OPS-24's paired-code trap
   already requires.
5. **Order:** this lands and deploys before P-256's apply, and P-256's apply needs either a
   blast-radius guard in the factory writer or an explicit authorisation with its declared share
   (A-192), because nothing in hauska-factory refuses a mass state change today.

## Known downstream consequences (accepted by the operator, "fine for now")

- Customers in the six counties will see declared refusals ("setbacks not on file for this
  parcel") where they now see a stale baked value. That is the honest state and is the intent.
- The serve path reads one more thing per request for a slated rail (the parcel's cell); the
  `/record` route already does this, and the cost is measured by P-295's phase 1.
- Instruments that assumed "slated and `pass`" means "served from the ledger" (P-253's ledger leg,
  P-254's customer legs, any surface probe) must key on the cell, not the verdict.
- The P-230 bake still serves unslated rails and every surface that does not yet go through the
  cutover; this ruling does not retire the bake (P-295 is that direction).
- Rows written before this ruling that treat the verdict as the serve switch (the PARCEL-B slate
  cards, the cutover module headers) are superseded on that point and should be read with this
  record.

## Reversal criteria

- If per-cell serving measurably costs the public hot path more than its budget (P-295 phase 1
  measures `/record` p50 and p95), revisit the mechanism (a cached per-county cell index, for
  example), not the principle.
- If the operator decides a partly complete county should show nothing from the ledger at all for
  a rail, that is a narrower ruling per rail, recorded as its own decision, and still never a fall
  back to legacy.
- If the ledger stops being the serving path (a reversal of the 2026-09-11 ruling), this record
  goes with it.

## Dependencies

Depends on: the 2026-09-11 ledger-as-serving-path ruling; the P-252 gate rollout (verdict
vocabulary); P-293 and its engine remainder (both readers understand every verdict string).
Depended on by: P-256's apply; P-269 (folded into the same build, row P-297); P-294 and P-295
(what a refreshed or ledger-read surface shows); P-254's customer legs; every future rail cut-over
onto the slate, including Burnet's.

## Counterparties

Internal. Affected: the integration seat, the LDT and hauska-engine lanes that own the serve
path, and customers of the six counties, who will see declared refusals where stale values
used to be.
