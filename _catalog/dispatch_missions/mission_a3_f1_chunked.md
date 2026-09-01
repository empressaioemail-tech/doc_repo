# Mission — re-cut F1 as a chunked job so the setback quarantine gets scored

## Why this card exists and why it is not on anyone's list

F1 is a 15s single-shot scan. It **timed out on Travis and Williamson and returned
UNMEASURED**, which is the worst of the three states: absent, zero and unmeasured are
different, and unmeasured is the one that propagates silently into everything downstream.

The wave plan names this exactly: *"This is the actual gate on P4's setback half and it is
on nobody's list."*

What it must score: **188,103 placeholder `setback-rule` atoms** (`storage-port-proof/
phase-1a`; Hays and Williamson are 100 percent placeholder) and the second population the
wave plan records as **158,573**. **Read F1's own definition for what each population
actually is rather than taking those numbers from this card.** They are the reason for the
work, not the specification of it.

Also standing behind the same gate: **McLennan's 65,814 envelopes derived from 0 setback
rules.** Say whether F1 scores that too or whether it is a separate quarantine.

## The fix is a port, not a design problem

Containment was the same failure — a single-shot scan against a store that will not finish
it — and the fix is now proven twice on this store at this scale, on 2026-09-01:

| county | rows | chunks | wall |
|---|---|---|---|
| 48491 Williamson | 282,570 | 36 | 5m26s |
| 48453 Travis | 380,917 | 48 | 4m40s |

Zero unresolved on both. The design that did it: a **chunk manifest** written at run start
carrying `county`, `denominator`, `pageSize` and `rangeCount`; a **per-chunk durable event**
carrying its range, row count and wall time; a **`method_version`** on every chunk so work
done under two different methods can never be silently interchanged; and **cross-run resume
keyed on the run id**, which refuses `METHOD_VERSION_MISMATCH` when the method has changed
underneath.

Read that implementation before writing a new one. `src/jobs/p2-juris*.mjs` on
`feat/covers-fastpath`.

**Do not port the parts that do not apply.** Containment's cost was geometry; F1's may not
be. Chunking by row count was right for containment because per-chunk cost turned out to be
a property of the range rather than of the row count, and that is a fact about parcels in
`prop_id` order, not a law about scans.

## State the cost proxy before you chunk

Containment's page size worked by luck as much as design: a uniform 8,000-row page was
adequate only because the `ST_Covers` fast path collapsed the expensive term first. Before
choosing F1's chunking, say **what makes an F1 chunk expensive** and how that is computed
cheaply. If the answer is "row count", say so and say why.

## The falsifier, registered before running

**One county, end to end, before any sweep.** The measured lesson from the L2 acquisition
work is that blockers surface serially: five were found, each only after the prior cleared,
because the scope was set before one county had run end to end.

Then: **a chunked F1 must produce the same answer as the single-shot F1 on a county where
the single-shot actually completed.** If no county completed, say so — that means there is
no known-good comparison and the first result is unverified rather than verified.

And the honest inverse: **if the chunked run also fails to score, the problem was never
chunking.** Report that rather than tuning page size until something returns.

## Serialization

This is `hauska_mcp` on cortex-prod. **Take the store token; one heavy operation at a time.**
Containment is finished for all six counties, so nothing is queued ahead of you, but confirm
that rather than assuming it.

Do not run inside the Tuesday 05:00-06:00 UTC Neon maintenance window. The queue refuses it
and that refusal is correct.

## Do not

- Do not raise a timeout to make a scan finish. That is the defect, not the fix.
- Do not quote 188,103 or 158,573 as findings; re-derive them.
- Do not sweep counties before one has run end to end.
- Do not apply setbacks, resolve either quarantine, or delete any atom. This card scores;
  it does not remediate.
- Do not tune page size until something returns.
- Do not touch any repository other than the registered worktree you open.

## Close

Use the exact CP1 / CP2 / CLOSE paths named at the end of this dispatch. Declare snapshot
in the first output. State the cost proxy before chunking, and the falsifier before running.
Report the scored populations, whether a known-good comparison existed, and whether
McLennan's 65,814 envelopes are in scope. Name what contradicted this card, or say plainly
that nothing did. `leave_behind` named. Subagents do not commit.
