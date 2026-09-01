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

`hauska_mcp` and `neondb` share one compute on **cortex-prod**, and containment owns it.
**Three gates, all of them, before you start.** Verify each from live state, not from a
lane's report that it finished.

**Gate 1 — `CTX-CONTAINMENT-RUN` is closed for BOTH counties.** Williamson 48491 and
Travis 48453 must both have landed. Containment now takes roughly ten minutes per county
rather than ten hours, so this is a short wait, and starting in the gap between the two
counties is the specific mistake to avoid. Check:

```
gcloud run jobs executions list --job=factory-p2-juris   --project=hauska-prod-497015 --region=us-east4 --limit=5 --format=json
```

Require `runningCount` null on every recent execution and a succeeded execution for each
of 48491 and 48453. **Read the execution's own `args` for its `--county`**, not the
execution name, which says nothing about scope.

**Gate 2 — the Neon maintenance window has passed.** Both computes sit in a
**Tuesday 05:00 to 06:00 UTC** window and restart in it for scheduled updates. Scale-to-zero
is disabled, which does not help here. Do not start before **2026-09-01T06:00:00Z**, and do
not start inside any later Tuesday window either.

This window has already cost two runs in one night. `FIX-57P01`'s error listeners are in
the serving image now, so a restart mid-run is a caught and recorded death rather than an
uncaught exit, but a caught death is still a dead run.

**Gate 3 — nothing else is running or queued on cortex-prod.** If containment starts while
you are mid-backfill, you contend. Chunk small enough that stopping between chunks is
cheap, and prefer yielding to holding.

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

- Do not run while a containment execution is live, and do not start between Williamson
  and Travis.
- Do not start before 2026-09-01T06:00:00Z, or inside any Tuesday 05:00–06:00 UTC window.
- Do not infer a county from an execution name; read the execution's `args`.
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
