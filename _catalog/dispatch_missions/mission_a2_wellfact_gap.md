# Mission A2 — explain the 2,087 well-fact gap before it is multiplied by five

## Why this card exists

The first non-CAD write this system has ever done succeeded and fired a
pre-registered failure. Run `3dc46ece`, execution `factory-atoms-cad-9zhg5`, child
`write-well-fact-county.mjs`, lease `entity_type=well-fact`, on digest
`sha256:0b259a54` / `ENGINE_SHA 34710cb6` / generation 4.

**Planned 69,000. Store holds 66,913. Gap 2,087.**

The written count was confirmed two ways, by `entity_id` range and by `atom_did`
prefix, so it is not a counting artefact. It is not rounding. **Cause unknown.**

Wells are owed on four more counties. Applying them before this is explained
multiplies an unknown by five, and the gap would then be indistinguishable from
whatever those runs produce.

## No store connection is required to start

Read the write path first. The answer may be in the code, and code reading outranks
output measuring on this board: every real defect found here to date came from reading
a write path, and none from measuring output. Measuring output applies the same
predicates that admitted the defect.

Start from `write-well-fact-county.mjs` and the batch write it calls.

## Mechanisms to separate, and none to assume

State each before you test it, and say which you rejected and why:

1. **The plan over-counts.** 69,000 is a planned figure, and the split reported was
   12,079 present and 56,921 absent. Confirm 12,079 + 56,921 equals the plan and that
   the plan is not counting a class the writer never emits.
2. **The writer skips a class silently.** Parcels with a condition the writer declines
   without recording a refusal. If so the skip is a defect twice over: the rows are
   missing and nothing named them.
3. **The batch drops rows.** Chunk boundaries, an upsert conflict collapsing two
   planned rows onto one `atom_did`, or a slice that partially failed without failing
   the run.
4. **The count is right and the plan is a different population.** Present-plus-absent
   may not be the same set as writable atoms.

Mechanism 3 is the one with a durable consequence, because an upsert collapse means
the gap is not missing data but **merged** data, and the same collapse would recur on
every county.

## What would settle it

A per-chunk reconciliation: for each chunk, planned rows in versus rows written out,
from the `run_event` records the writer already emits. If the writer records only a
total, that is itself the finding — **a count is not a record** — and the fix is to
name the items acted on per chunk.

If the gap concentrates in one chunk, it is a boundary or a failure. If it spreads
evenly, it is a class the writer declines. Those are different repairs and the
distribution tells you which.

## Falsifier

Whatever mechanism you land on must **predict the 2,087** and not merely be
consistent with it. A story that explains a gap of any size explains nothing. State
the predicted number before you check it.

## What this does not do

Does not apply wells to any other county. Does not re-run 48021. Does not lift the
hold on Hays, McLennan, Travis or Williamson. Does not touch the lease path, which
worked.

## Do not

- Do not re-run the 48021 write to "see if it happens again" before reading the path.
- Do not mutate or delete atoms.
- Do not apply wells on another county.
- Do not read `neondb` for atom counts; the atoms store is `hauska_mcp`.
- Do not run a heavy store scan while lane A1 or A3 is running.
- Do not touch any repository other than the registered engine worktree you open.

## Close

Use the exact CP1 / CP2 / CLOSE paths named at the end of this dispatch. Declare
snapshot in the first output. State each mechanism and the reason you rejected it.
State the predicted number before checking it. `leave_behind` named. Subagents do not
commit.
