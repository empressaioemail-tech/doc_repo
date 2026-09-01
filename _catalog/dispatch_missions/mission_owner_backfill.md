# Mission — strip owner fields from ~239k cad-parcel-roll bodies

## Authorised

Operator ruling 2026-09-01, recorded in
`_decisions/2026-09-01_owner_policy_and_portal_access_rulings.md`. Option B was ruled
with the backfill, and the backfill was authorised **separately** from the forward fix
because it mutates production data. This card is that authorisation.

## What is being removed, and what is not

`ownerName` and `ownerMailingAddress` come out of `cad-parcel-roll` bodies in
`hauska_mcp`. Measured populations:

| county | roll atoms | ownerName | mailing address |
|---|---|---|---|
| 48021 Bastrop | 77,078 | 77,078 | 77,048 |
| 48055 Caldwell | 48,384 | 48,384 | 48,170 |
| 48309 McLennan | 114,280 | 113,384 | 114,254 |
| 48209 / 48453 / 48491 | — | 29 / 3 / 7 | 0 |

**No data is lost.** `cad_property` remains the source of record and is untouched;
`owner-fact` remains the paid home and is untouched. This removes a duplicate from an
atom whose `public-free` policy was never right for it. Say that in the close, because
"mutate 239,000 production rows" reads worse than what this is.

**Do not touch `owner-fact`. Do not touch `cad_property`. Do not touch any other field
on the roll atom.**

## Serialization — this is the constraint that governs the whole card

`hauska_mcp` and `neondb` share one compute on **cortex-prod**, and containment owns it
for Williamson and Travis. **Confirm no `factory-p2-juris` execution is running before
you start**, and do not start if one is queued behind you.

If containment starts while you are mid-backfill, you contend. Chunk small enough that
stopping between chunks is cheap, and prefer yielding to holding.

**Do not run into Tuesday 05:00–06:00 UTC.** Scale-to-zero is disabled on both computes,
but they still restart for scheduled updates in that window, and `FIX-57P01`'s error
listeners are not merged — so a restart mid-backfill is still an uncaught exit.

## Method

1. **Dry run first, always.** The script defaults to it. Report the dry-run counts per
   county and compare them to the table above before applying. **A dry-run count that
   disagrees with the measurement is a stop, not a rounding.**
2. **Run row first.** No mutation without one.
3. **Chunk it, and resume from the ledger** rather than restarting. 239k bodies is not a
   single statement.
4. **A count is not a record.** Every chunk emits a durable record naming the predicate,
   the range acted on, the row count and the timestamp, so the set is re-derivable. If
   the record cannot be written, the mutation does not run.

## Falsifiers, stated before you apply

**Before:** re-run the exposure query and confirm it still returns the measured
populations. If it does not, something changed since 2026-08-31 and you stop and report
rather than proceeding against a stale target.

**After:** the same query returns **zero** `ownerName` and zero `ownerMailingAddress` on
`cad-parcel-roll` across all six counties.

**Untouched, all three:**
- `owner-fact` atom count and bodies unchanged
- `cad_property.owner_name` unchanged
- roll atoms' **other** fields unchanged — spot-check a body before and after and
  confirm only the two keys differ

**The one that matters most:** a body that carried no owner field before must be
byte-identical after. A strip that rewrites untouched rows is a different operation from
the one authorised.

## Then close the exposure properly

The forward fix (`hauska-engine #371`) stops new writes. This card removes the existing
pool. **Neither alone closes it**, so the close states both and names the merge SHA of
the forward fix alongside this run id.

Add a regression test on the MCP catalog path: an anonymous `get_atom` on a
`cad-parcel-roll` DID returns a body with **no owner keys**. Without it, the next writer
that adds an owner field to a `public-free` atom reproduces this silently, and the
protection is back to being a habit.

## Do not

- Do not run while a containment execution is live.
- Do not run into Tuesday 05:00–06:00 UTC.
- Do not apply without a clean dry run whose counts match the measurement.
- Do not touch `owner-fact`, `cad_property`, or any other roll field.
- Do not add an MCP field stripper; the ruling rejected it and the policy is the
  protection.
- Do not proceed if the before-query disagrees with the measured populations.
- Do not touch any repository other than the registered engine worktree you open.

## Close

Use the exact CP1 / CP2 / CLOSE paths named at the end of this dispatch. Declare
snapshot in the first output, and confirm no containment execution was running when you
started. State every falsifier before running it. Report per-county before and after
counts, the run id, and the forward fix's merge SHA. `leave_behind` named. Subagents do
not commit.
