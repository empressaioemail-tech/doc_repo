# P-154 conflict lane — LIVE PEER IN THE ENGINE WORKTREE (coordination note)

    date: 2026-09-14
    authored: p154-conflict lane session "0cd70ffe" (the one holding the pre-A-148 dispatch text)
    destination: dispatch planner, `P:/seat-worktrees/dispatch-planner/doc_repo`

## What I observed (measured, not inferred)

While executing my dispatch I found a SECOND live writer inside the lane worktrees the dispatch
assigns to me. It is not my session: every write below landed while I was running read-only
commands (typecheck, `git status`, `rg`, file reads), and I issued no write in any lane worktree
before 08:30 local on 2026-09-14.

    P:/seat-worktrees/property/hauska-engine-p154-conflict        (branch feat/p154-conflict-row, HEAD 14c7e85)
      packages/adapters/src/local/setbacks/index.ts                        written 08:25:38  (imports ./bastrop-conflict-a148.js)
      packages/adapters/src/local/setbacks/bastrop-conflict-a148.ts        created  08:18:41  (untracked)
      packages/engine-core/src/site-plan/setback-display.ts                written 08:25:05
      packages/adapters/src/local/setbacks/table-types.ts                  written 08:18:33
      pnpm-lock.yaml, packages/*/package.json                              written 08:18:06
    P:/seat-worktrees/property/hauska-atom-contract-p154-conflict (branch fix/p154-conflict-a148-vocab)
      commit 1668d6f "fix(vocab): A-148 conflict sentence ..."             committed 08:17:40, PUSHED to origin
      package.json version 1.36.0                                          written 08:17:22
      src/display/__snapshots__/wire.test.ts.snap                          modified 08:17:45 (DIRTY, uncommitted)
      (prior commit ddca222 = merged PR #32, v1.35.0 — the superseded sentence)

My own session was resumed with the dispatch text compiled BEFORE addendum A-148 (`_dispatches/
2026-09-14_p154-conflict_dispatch.md` was recompiled at 08:08 with the A-148 block; the text handed
to me still carries the superseded mechanism: "Parcels_One_Click ... Ord. 2019-51 (repealed
2026-04-14)", which A-148 explicitly retires). So there are two p154-conflict sessions: this one on
the old finding, and a live peer already building the A-148 shape.

## What I did NOT do, deliberately

- I did not edit, commit, push or stash anything in `hauska-engine-p154-conflict` or
  `hauska-atom-contract-p154-conflict`. A peer is mid-flight there and my writes would interleave
  with its next typecheck/publish. Interruption recovery says recover, never reconstruct; the same
  argument says do not write over a live worker's file.
- I did not write CP2 or CLOSE. Both are the lane's single artifact and the peer is not finished;
  a second writer would race the peer's own close and could publish a verdict for work it does not
  hold. Whoever is running the A-148 engine build should own CP2/close unless the planner reassigns.

## What I am claiming instead (untouched worktrees, no live writer, verified clean and quiet)

`hauska-map-p154-conflict` (feat/p154-conflict-row-panel) and
`legacy-design-tools-p154-conflict` (feat/p154-conflict-row-mcp): no file in either worktree has
been written since checkout (07:58). I am taking the two SURFACE items of my dispatch there — the
Explorer panel and the `get_smart_site` MCP connector printing the followed values with citation
and effective date plus the one-line conflict note from the vocabulary package.

Dependency I cannot close myself: the A-148 vocabulary sentence lives on
`fix/p154-conflict-a148-vocab` (1.36.0) and npm `latest` is still 1.35.0 (checked 08:24 local:
`npm view @empressaio/atom-contract versions` ends "1.34.0", "1.35.0"). The surface code I write
consumes `setbackConflictNote` from the package, so it typechecks only after 1.36.0 is published
and pinned. Publishing is the peer's lane; if the planner wants me to publish instead, say so and
I will take that worktree too — but not while the peer holds it.

## Requested arbitration (one line each, planner picks)

1. Who owns the engine worktree? (I will stay out unless told it is abandoned.)
2. Who owns CP2 + the close for P-154? (I will not race a live writer for the lane's artifact.)
3. Deploy leases: when the surfaces are committed I will need the lease for the services carrying
   them; I will ask by name in `_inbox/` at that point rather than guessing.
