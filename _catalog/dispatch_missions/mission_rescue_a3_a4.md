# Mission — push three branches before anything else, then deal with their bases

## This is the covers-fastpath trap, second occurrence in one day

Fourteen files of completed work exist only as dirty files in `P:/tmp`. No commits, no
branches on origin. Verified 2026-09-01 at roughly 13:40Z:

```
/p/tmp/hauska-engine-a3-f1-chunked   feat/a3-f1-chunked   head 0e96e6a   3 dirty
/p/tmp/hauska-engine-a4-p3           feat/a4-p3-absence   head e3e1485   3 dirty
/p/tmp/hauska-factory-a4-p3-build    feat/a4-p3-build     head 5f9acc3   8 dirty

gh api .../branches  ->  no a3-f1 or a4-p3 branch on either origin
```

This morning the same shape nearly lost the `ST_Covers` fast path, the 57P01 listeners
and the HELD replay gate. `P:/tmp` holds twenty-seven factory and engine clones and has
been recycled before on this operation.

**Step 1 is `git push`. Before reading anything, before fixing anything, before opening a
PR.** Commit each tree to its own branch and push. Your own branch needs no authorisation
and it takes a minute.

## Two of the three are on stale bases. Push first anyway.

| branch | head | current main |
|---|---|---|
| engine `feat/a3-f1-chunked` | `0e96e6a` | moved past it |
| engine `feat/a4-p3-absence` | `e3e1485` | current, this is the `#371` merge |
| factory `feat/a4-p3-build` | `5f9acc3` | `7a22f45` |

**Push the stale ones as they are first.** A pushed branch on an old base is recoverable;
an unpushed branch is not. Reconcile the base *after* the work is safe, with
`gh api -X PUT .../pulls/<n>/update-branch` on the PR. `git rebase` is blocked here.

`5f9acc3` in particular predates the four factory merges that landed this morning, so
`feat/a4-p3-build` has never seen the `ST_Covers` fast path or the reaper removal. Expect
the update to be substantive rather than clean, and say what it touched.

## Commit messages must describe their own diff

Each tree is one subject, so this is three commits in three repos, not one sweep. Commit
by explicit pathspec and confirm the content is staged rather than the paths — a file can
change between a write and an add, and two seats have swept each other's work into
unrelated commits by reflex here.

## One decision this card owes

`/p/tmp/hauska-factory-a3-f1` is on current main `7a22f45` and is **clean**, while the
engine tree holds the real A3 work. The A3 close recorded that the chunked runner was
never ported to factory.

**Say whether it should be ported, and do not port it on this card.** A3's finding is
already banked — the F1 six-county split is measured, placeholder 188,103 and
nonPlaceholder 158,573, and the P4 setback half is no longer gated by an UNMEASURED F1.
The port is a separate question about where the runner lives, and answering it here would
mix a rescue with a design decision.

## Do not

- Do not read or write any store. This card is git only.
- Do not apply, stamp, or run anything. These are builds.
- Do not rebase; use `update-branch` on the PR after pushing.
- Do not merge on this card unless a branch is already green against current main, and say
  which you merged and why.
- Do not fold three repos into one commit or one PR.
- Do not port the A3 runner to factory; recommend and stop.
- Do not touch `feat/covers-fastpath`; it is merged and its worktree is finished.

## Close

Use the exact CP1 / CP2 / CLOSE paths named at the end of this dispatch. Declare snapshot
per worktree in the first output, and **report the three pushed SHAs before doing anything
else**. State what `update-branch` changed on the two stale branches. Give the port
recommendation with reasoning. Name what contradicted this card, or say plainly that
nothing did. `leave_behind` named. Subagents do not commit.
