# Mission — CTX TOTALS: six counties, two derivations, one recorded number each

## Why now

A1 is complete. All six Central Texas counties have containment, and TOTALS is the head of
the critical path (`TOTALS -> P4 -> P5-final -> P6`). Nothing downstream of P4 can be
scoped against a number nobody has written down.

Measured tonight, from the execution payloads:

| county | rows | in city | unincorporated | unresolved | method | run |
|---|---|---|---|---|---|---|
| 48491 Williamson | 282,570 | 174,827 | 107,743 | 0 | `covers-v1` | `2a40517b` |
| 48453 Travis | 380,917 | 277,003 | 103,914 | 0 | `covers-v1` | `dd58e803` |

Bastrop 48021, Caldwell 48055, Hays 48209 and McLennan 48309 landed earlier and their
totals are **not** restated here on purpose. Collect them from their own run records rather
than from any planner document, this one included.

## The four things this card must not get wrong

**1. The six counties do not share a method version.** Travis and Williamson ran
`covers-v1`; the earlier four ran `intersection-v1`. The emit was proven bit-identical on
three ranges, so mixing them is sound — but **it must be recorded per county, not
silently averaged into one figure**. A totals table that does not carry `method_version`
per row loses the only fact that would let someone re-derive it later.

**2. A self-report is one derivation.** The manifest `denominator` and the summed chunk
emissions both come from the same run. They agreeing is internal consistency and it
catches transcription errors, not wrong sources.

**The second derivation is a `COUNT` against `landing_parcel_jurisdiction` on
cortex-prod**, per county, by disposition. Does the store hold what the runs said they
wrote? **Require agreement and refuse on mismatch.** Report both numbers per county even
when they agree, because a table of one number cannot show you it was checked.

**3. Travis's denominator is 380,917 and the figure carried in planning all week was
380,918.** One row. Do not round it, do not reconcile it by picking the prettier number,
and do not report the pair without an explanation. A sentinel row, an exclusion, or a
stale source count are all plausible and they are distinguishable. The payload records
`sentinel: {excluded, n, prop_id, reason}` — read it.

**4. `match.checked: false` appears in both `covers-v1` payloads.** Coverage is confirmed
by the manifest-versus-totals agreement, so nothing is known to be wrong, but a `match`
block that reports totals while declaring itself unchecked is the shape of a control that
reads as satisfied. **Say what `match` compares, why it did not run, and whether it should
gate.** If it is dead, say it is dead; if it is starved, name its input.

## Serialization

The store is free. Containment is finished for all six counties and nothing is queued
behind it.

**Do not run into a Tuesday 05:00 to 06:00 UTC Neon maintenance window.** Both computes
restart in it for scheduled updates and it has already cost runs this week. If the current
time is inside one, wait.

If OWNER-BACKFILL is running, wait for it. One heavy operation at a time on cortex-prod.

## What TOTALS is for, so you scope the output correctly

P4 applies rails per county, and a rail's denominator is a county's parcel population split
by disposition. Downstream needs a durable, re-derivable table keyed by county carrying:
total, in city, unincorporated, unresolved, `method_version`, run id, and the store-side
count that confirmed it.

**Write it as an artifact, not as a chat answer.** A count is not a record.

## Do not

- Do not restate Bastrop, Caldwell, Hays or McLennan totals from any planner doc; read
  their run records.
- Do not average or collapse across `method_version`.
- Do not report a total confirmed by only its own run.
- Do not round away the 380,917 versus 380,918 discrepancy.
- Do not run inside the Tuesday maintenance window, or alongside another heavy operation.
- Do not re-run containment on any county. It is complete.
- Do not touch any repository other than the registered Factory worktree you open.

## Close

Use the exact CP1 / CP2 / CLOSE paths named at the end of this dispatch. Declare snapshot
in the first output. Report the six-row table with both derivations per county, the
Travis one-row explanation, and the `match.checked` answer. State the refuse condition you
used for a store-versus-run mismatch and whether it fired. `leave_behind` named. Subagents
do not commit.
