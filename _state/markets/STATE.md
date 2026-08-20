# Markets seat state

**Last updated: 2026-08-20.** Namespace `markets`. Worktree `P:/seat-worktrees/markets/doc_repo` on `seat/markets`.

## OPEN

**SMART MARKETS (instrument twin) — pickup lives in `_inbox/2026-08-17_smart_markets_pickup.md`.** Moved here from the shared _STATE.md because that file was under concurrent write and a read-modify-write lost this block once on 2026-08-17. Summary at time of split: cockpit TW-24 + TW-25 MERGED (main `f285b8c3`, CI green, baseline zero); Smart Markets PR #1 and cockpit PR #331 open and green, unmerged; migration 0058 NOT applied; production UNCHANGED. The measured defect recorded in that pickup: 935 of 1,323 issuer nodes violate the per-CIK guardrail, holding 93.6% of the graph. Treat those figures as the dated pickup's numbers, not as a claim this file refreshes.

empressa-trading exclusive owner is this seat (see seat_register `_empressaTradingOwnership`). Trading requests cockpit product/UX changes.
