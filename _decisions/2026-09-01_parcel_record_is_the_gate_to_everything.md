---
title: The parcel record is built and filled before anything else moves
date: 2026-09-01
status: active
decision_type: program sequencing
---

# Decision

**Every parcel in all six counties carries a full record, filled with data or honest
absence, before any other work proceeds.** Rebake is acceptable. This outranks Wave R, the
rail applies, P5, and every card currently queued behind them.

Operator ruling 2026-09-01: *"this is the most imperative thing in the whole build because
it has cost us countless hours so far."*

## Why it outranks everything

It is the fix for the defect that has cost the most time. A missing column is invisible; an
unaccounted cell is countable. Four separate multi-hour investigations on 2026-09-01 alone
existed only because a field could be absent from the contract rather than from a parcel:
permits, the `#575` CAD value fields, orphaned zoning ingest, and the owner-population
disagreement that produced five wrong mechanisms.

It also breaks the serial bottleneck. Counties fill **in parallel** because filling a cell
is independent per county, and the bake runs **once** when everything is verified. Today
every county waits on the same store for every rail in sequence.

## The order, and it is not negotiable

1. **Build the tables** — the parcel record, its cell-state type, and the companion tables
   for multi-valued rails.
2. **Ingest what we already have.** Much of this data exists and is unreachable, unstamped,
   or unserved. Ingest before acquisition, because acquiring what we already hold is the
   most expensive possible mistake.
3. **Finish the audits.** The reconciles and gap analyses already in flight.
4. **Data acquisition program** for what is genuinely missing.
5. **Adversarial review of the program**, not of its output. The program itself gets
   attacked.
6. **Fix the review findings.**
7. **Only then** consider what is needed to reach production.

Steps 5 and 6 are the ones most likely to be skipped under pressure and they are the reason
this order exists. A program reviewed only by its own output measurements applies the same
predicates that admitted the defects.

## Scope of the record

Everything we intend to bring to a user, not everything we currently have. A rail we aspire
to serve and have not sourced is a column of `unaccounted` cells, which is honest and
countable. A rail absent from the shape is invisible.

Named by the operator: setbacks, MUD, PUD, wells, pipelines, "all of it." Setback rules are
a **companion** table, not a cell — the cell carries the state, the companion carries the
rows.

## Reusable, not one-off

The schema and the fill procedure are a **durable template**. The six counties are where it
is proven; the second state is where it pays. Anything hardcoded to Texas or to these six
counties in the template is a defect to be named at build time, not discovered later.

## Reversal criteria

Reverse the sequencing if filling proves to require acquisition that cannot complete in any
reasonable horizon for a rail nobody has asked for. The answer then is to narrow the rail
set, not to abandon the shape — a smaller full record beats a larger partial one.

Do **not** reverse it because filling is slow. Slow and visible is the outcome being bought.

Watch for step 2 being skipped into step 4. Acquiring data we already hold would be the
most expensive failure available here, and it will present as progress.
