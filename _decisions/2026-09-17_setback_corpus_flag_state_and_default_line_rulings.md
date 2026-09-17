---
decision_id: 2026-09-17_setback_corpus_flag_state_and_default_line_rulings
date: 2026-09-17
owner: Nick (operator rulings on the integration seat's recommendations)
status: active
related_canonical:
  - 90_operations/OPS-16_texas_market_plan_of_record.md (A-199, rows P-299, P-300)
  - _inbox/2026-09-16_p258-setback-campaign_close.json (findings OT-1, OT-2, OT-3, OT-10)
  - hauska-setback-corpus src/setbacks/gate.ts (rules G2, G6, G7)
  - hauska-factory src/jobs/parcel-envelope-cells.mjs (the P-146 not-specified classification table)
  - legacy-design-tools artifacts/api-server/src/lib/buildableEnvelope/derive.ts (maxHeightFt)
---

## Decision

Four rulings on the setback corpus (`@empressaio/setback-corpus`) raised by the P-258 campaign:
the height "not specified" flag has one meaning; transcribed sources get their own, weaker
verification state; the campaign worklist distinguishes a located instrument from a wall; and a
city-wide default setback line may be carried as a jurisdiction default table.

## Context

P-258 added 258 district rows (corpus 1.3.0) and, verified by its wave planner, left four
questions no lane could settle alone. The integration seat explained each to the operator on
2026-09-17 with options and a recommendation; the operator approved all four recommendations.

## The rulings

1. **OT-1, the height flag.** `provenance.max_height_ft.not_specified: true` means only "the
   instrument states no height limit". It never sits beside a real, stated limit. The 130
   flagged rows are reconciled at the source: where a limit is quoted, the flag is cleared and
   the value kept; where the instrument is silent, the value is the canonical placeholder. The
   corpus test suite runs the gate (G7 included) over every shipped table, so this cannot drift
   again. **No consumer surfaces a flagged height as a number** (today LDT's `derive.ts` returns
   `max_height_ft` without reading the flag, and 39 LDT district rows carry 999). Direction, not
   yet built: the 999 placeholder is retired in a future major version in favour of an explicit
   absence with a reason, as ENFORCEMENT requires of any unrepresentable state. The factory's
   P-146 classification table is the starting point for the reconciliation and becomes redundant
   once the corpus is corrected.
2. **OT-2, a fourth verification state.** Values read from a copy of the governing instrument (a
   third-party mirror, a browser render, a transcription) get their own state, distinct from
   `primary-source-verified`, with a lower confidence cap and a citation to the authoritative
   instrument. The 169 affected rows are relabelled from what each table's note already records.
   Every consumer's accepted-state list is updated with a divergence test, as was done for the
   gate verdict strings.
3. **OT-3, the worklist vocabulary** (integration seat's call, recorded here). Campaign worklists
   gain a `located` state: the instrument is identified and reachable, and extraction is not
   finished. `blocked` is reserved for a named wall (a JavaScript-only page, a bot challenge, a
   dead route). P-258's blocked entries are reclassified when the next setback wave is compiled.
4. **OT-10, city-wide default lines.** A setback table may carry a jurisdiction default: one row
   marked as a city-wide default, not a zoning district, applied only to that jurisdiction's
   parcels that have no district. Every answer that uses it carries a disclosure that a recorded
   plat or another ordinance may set a different line. Gholson (McLennan, 840 parcels,
   Sec. 3.01.002: 25 front, 15 rear, 10 side, 25 corner street side) is the first case.

## Structural commitment check

Sell reasoning, not data: strengthened; each value's state now says how it was read, and a
default line says when it may not apply. Confidence earned: strengthened; a transcription can no
longer carry a primary-source label, and a placeholder can no longer read as a limit. Cost per
jurisdiction: slightly positive; located-but-unextracted cities become a cheap queue. Dual
interface: unaffected. Tenant sovereignty: unaffected.

## Reasoning

A flag with two meanings forces every consumer to guess, and the factory already built a private
guessing table, which is a second interpreter of the corpus that can drift from it. Fixing the
data at the source and enforcing the gate over shipped tables removes the guess. A verification
label that overstates how a value was read defeats the point of carrying one; an honest weaker
state costs a vocabulary update and buys labels a machine can trust. Separating a queue from a
wall is the single most useful signal for dispatching the next acquisition wave. And refusing a
real, cited default line because the schema only knows districts denies a true rule to 840
parcels; the conditional disclosure keeps the answer honest about when the line may not apply.
Small unzoned cities often regulate this way, so the shape is likely to recur in the farm run.

## Reversal criteria

- If reconciling the 130 rows shows the flag cannot be given one meaning without losing
  information a consumer needs, revisit OT-1 with that evidence.
- If the fourth state proves indistinguishable in practice from `primary-source-verified` (for
  example every new row lands in it), revisit OT-2.
- If a jurisdiction default is applied to a parcel a plat governs and the disclosure is not
  enough to prevent a wrong reliance, revisit OT-10 (for example require a plat check first).

## Dependencies

Depends on: P-258 (the tables), P-146 (the factory classification table). Built by: P-299 (OT-1
and OT-2, corpus and LDT, runnable now) and P-300 (OT-10, corpus, router and writers, after P-256,
which edits the same factory writer). OT-3 is applied in the next setback wave's mission. Depended
on by: the setback writer re-run after P-256, the next setback wave, Burnet's cities.

## Counterparties

Internal: the property seat (owner of hauska-setback-corpus, hauska-factory, legacy-design-tools)
and the integration seat. Customers of the six counties see fewer overstated labels and no
placeholder heights.
