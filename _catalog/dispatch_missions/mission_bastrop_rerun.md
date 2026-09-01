# Mission — Bastrop on the #49 image: the run that licenses everything downstream

## Why this card exists

Hays completed. Caldwell matched. Bastrop is the only county of the three that has
never produced a **succeeded** run, and its 62,256 landing rows are therefore
unlicensed. That single gap now blocks more than it looks like:

- TOTALS cannot be measured without it.
- The Bastrop setback bake, ruled authoritative on 2026-08-31, waits on a named
  succeeded Bastrop run or an explicit operator license of those rows.
- P3 absence has no inputs until containment lands.

One re-run clears all three.

## What changed since the refuse

**The oracle was restated and the ruling is recorded** (`d86b6cb`). Bastrop 48021 is
**50,264 / 11,992 / 62,256**. The sentinel is 168 rows resolving to one
**unincorporated** key, excluded as `txgio_parcel_sentinel_zero`. The earlier
62,257 came from an interactive instrument that counted the sentinel; three sources
(job, landing, ledger) agree on 62,256.

Do not re-derive this and do not soften `PARTITION_MISMATCH`. The refuse was the
control working.

**Factory #49 (`5f9acc3`) fixes the close path.** Caldwell exposed it: the SUCCESS
path left the Factory pg client open, Node never exited, and Cloud Run sat idle.
Bastrop's earlier run only terminated because the throw calls `process.exit(1)`. So
the failure path exits and the success path hangs, and Caldwell had to be cancelled
by hand with a planner-written termination.

**Run on the #49 image. Not the image that ran `gzr6z`.**

## Two falsifiers, and the second has never been observed

State both before executing.

**F1, the numbers.** Bastrop must emit exactly **50,264 / 11,992 / 62,256**. Any
other triple refuses `PARTITION_MISMATCH` and the run stops. Diagnose, do not tune,
do not absorb the sentinel to make the number look right.

**F2, the close path.** The job must reach a **succeeded termination and the process
must exit on its own.** This is what #49 changes and **no succeeded containment run
has ever exited unaided** — Caldwell's was cancelled. If the process hangs after a
successful write, #49 did not fix it, and that is a finding to report rather than
work around with another manual cancel. Do not write a planner termination to paper
over a hang; report the hang.

A run that satisfies F1 and hangs on F2 has not succeeded. Both arms or it is not
done.

## What a succeeded run licenses, and what it does not

**Licenses:** the 62,256 rows in `landing_parcel_jurisdiction` become bound to a
succeeded run, which is the mechanism a downstream consumer requires. Say so
explicitly in the close, naming the run id, so the setback bake has a citable
authority rather than an inference.

**Does not license:** Travis or Williamson leaving `COUNTY_HELD`, the setback bake
starting (it is separately gated by `P4-QUARANTINE`, because one placeholder parcel
throws `PLACEHOLDER_COLLISION` and aborts the whole city plan), or any statement
about TOTALS, which stays UNMEASURED until all six counties emit.

## Then, in order

**McLennan 48309** next, and measure its sentinel first. Bastrop's resolved
unincorporated and Caldwell's resolved **in-city** (Mustang Ridge 50200), which is
why Caldwell's restated triple moved `in_city` rather than `unincorporated`.
Assuming a shape produces a wrong expectation and a refuse for the wrong reason.
State McLennan's restated triple before executing it.

**Travis and Williamson** release from `COUNTY_HELD` only after McLennan lands.
They are larger, and with chunking that means more chunks rather than a cliff. Do
not predict their wall time and do not pick a chunk size from Hays.

## Do not

- Do not run on the pre-#49 image.
- Do not soften `PARTITION_MISMATCH` or absorb the sentinel.
- Do not hand-cancel a hang and write a success over it. Report it.
- Do not raise `statement_timeout` or change the page size from 8,000.
- Do not run two heavy operations concurrently.
- Do not fit a curve to per-chunk `wallMs`. Hays ranged 36.4 to 92.9 and licenses
  no size.
- Do not start the setback bake from this card.
- Do not run Travis or Williamson.
- Do not touch any repository other than the registered Factory worktree you open.

## Close

Use the exact CP1 / CP2 / CLOSE paths named at the end of this dispatch. Declare
snapshot (repo, branch, commit, image digest) in the first output. State both
falsifiers before executing. Report the run id and whether the process exited
unaided. `leave_behind` named. Subagents do not commit.
