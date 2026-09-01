# Mission — land four branches, and close the trap where production runs off a branch

## The trap, first, because it gets worse with time

`feat/covers-fastpath` is pushed at `e5a8d88` and **has no PR and is not merged**.
`main` is still `5f9acc3`.

Production is running the `ST_Covers` fast path, the per-run TEMP city table, the 57P01
error listeners and the HELD replay gate — **none of which are on `main`**. Anyone who
rebuilds the Factory image from `main` right now silently ships a job that re-decodes the
statewide city table every chunk and has no connection error listeners. It would look
like a clean build and behave like a regression to a state we spent a night leaving.

That is the whole reason this card exists. The merges below are ordinary; this one is
load bearing.

## Order, and it matters

**1. Merge `#52` first.** `fix(f03): delete reaper start-time fallback after expiry`.
Verified green and mergeable:

```
#52  mergeable=MERGEABLE  test=SUCCESS  gate8=SUCCESS
#51  mergeable=MERGEABLE  test=FAILURE  gate8=SUCCESS
#50  mergeable=MERGEABLE  test=FAILURE  gate8=SUCCESS
```

`#50` and `#51` are red **for that one reason and nothing else** — the expired
`LEGACY_FALLBACK_REMOVE_BY` time bomb reds every PR in the repo until the fallback is
deleted. Merging `#52` is what fixes them; do not touch their code.

**2. Re-green `#50` and `#51` against the new base.** A green check against a stale base
is not a green check. Use:

```
gh api -X PUT repos/empressaioemail-tech/hauska-factory/pulls/<n>/update-branch
```

`git rebase` is blocked in this environment. Read the **conclusion string**, never a `gh`
exit code. Then merge.

**3. PR and merge `feat/covers-fastpath` at `e5a8d88`.** Land it last so it merges onto a
base that already carries the reaper removal and greens cleanly.

## The falsifier, and it is not "the merge succeeded"

**Read `main` after the merges and confirm the code is actually in it.** A clean clone of
`main` must contain the `ST_Covers` fast path, `covers-v1`, the TEMP city table, and the
57P01 error listeners. Check the file contents on the merged `main`, not the PR diffs and
not the merge result.

This is the point of the card. If `main` still lacks that code after four merges, the
merges were beside the point and the trap is still open.

**Second arm:** confirm `#50` and `#51` are green on the **post-`#52`** base before
merging, and say which base each was green against.

## Do not

- Do not rebuild or redeploy the Factory image on this card. A containment campaign is in
  flight and the serving digest is the one that was measured; a new digest is unproven.
- Do not fold the four branches into one merge or one PR.
- Do not touch `#37`; it is older and out of scope here.
- Do not edit `#50` or `#51` code to get them green. `#52` is the fix.
- Do not weaken or skip the reaper test to get the repo green. The test is the control and
  it fired correctly.
- Do not judge CI by a `gh` exit code.
- Do not touch any repository other than the registered Factory worktree you open.

## Close

Use the exact CP1 / CP2 / CLOSE paths named at the end of this dispatch. Declare snapshot
in the first output. Report the four merge SHAs, the base each PR was green against, and
**the verbatim evidence that merged `main` contains `covers-v1` and the error listeners**.
`leave_behind` named. Subagents do not commit.
