# P1-LDT DrawEdge leftovers — fresh tree off current main

## How to work this card

Do NOT spawn sub-agents. Hand back, do not land. No commit, push, or deploy.

## Why this card exists

P1-LDT graded MET on the write path
(`_inbox/2026-08-30_p1-ldt_supervisor_review.md`) and was never merged.
`P:/seat-worktrees/property/legacy-design-tools-p1-edges` on
`seat/property-ctx-p1-ldt` is dirty vs `13ec82d4` on DrawEdge files.
Main has moved (`#558` then `#560` / `#561`). Do not open that dirty tree.
Do not merge that branch.

Cut is already made: `P:/seat-worktrees/property/legacy-design-tools-p1-leftover`
on `seat/property-ctx-p1-leftover` from `origin/main`. Work only there.

## Work

1. Diff the dirty p1-edges tree against current `origin/main` for DrawEdge
   files only. List every leftover path and whether main already has it.
2. Port only what main still lacks and what the grade accepted:
   `DrawEdge.state` union (`present | unknown | refused`), no default
   `present`, refused cannot emit present, retired filter, per-edge
   `sourceAdapter`. Gold reciprocal may stay present.
3. Do not port the adjacencyKind invariant. That was refused.
4. Do not move C3 or C4. Do not touch setback refuse (`#560` is serving).
   Do not touch envelope.
5. Re-run the card tests both arms. A default `present` must fail to compile
   or fail a test.

## Do not

Open `legacy-design-tools-p1-edges`. Open `legacy-design-tools-f11-ldt`.
Open `legacy-design-tools-p2b-serve`. Cherry the whole dirty branch. Treat
this as customer-done. Deploy.
