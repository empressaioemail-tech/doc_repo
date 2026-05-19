---
id: 2026-05-19_cc-agent-C_quick_wins_and_schema
title: Dispatch — cc-agent-C legacy-design-tools (quick wins + schema reconciliation)
date: 2026-05-19
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
related: [_decisions/2026-05-19_sync_4_5_and_cortex_sprint, 42_design_accelerator_program_plan, 80_adrs/adr_001_atom_architecture, _sessions/2026-05-19_cortex_track_close_out_claude_code, CLAUDE.md]
---

# Lane C.1 — cc-agent-C dispatch (quick wins + schema reconciliation)

You are cc-agent-C owning the `legacy-design-tools` repo (the Cursor terminal pinned to this repo for this sprint). This is your first dispatch — Lane C.1 — covering low-cost / high-value items that can land before deeper Cortex/Codex work begins. No upstream dependency; start immediately.

## Why this exists

The 2026-05-19 cortex-track close-out surfaced multiple small follow-ons that are independent of L-surface work, infrastructure cutover, and atom-shape locks. Clearing them now reduces the noise floor during the bigger work coming up. Also captures the eval-schema regression (PR #26 never merged) and the PR #29 commit-2 mystery (ULID column type) that surfaced during that close-out.

## Read first

In order:

1. [`CLAUDE.md`](../CLAUDE.md) — operating instructions.
2. [`_decisions/2026-05-19_sync_4_5_and_cortex_sprint.md`](../_decisions/2026-05-19_sync_4_5_and_cortex_sprint.md) — sprint scope.
3. [`_sessions/2026-05-19_cortex_track_close_out_claude_code.md`](../_sessions/2026-05-19_cortex_track_close_out_claude_code.md) — origin of every item below; read carefully for context per item.
4. [`80_adrs/adr_001_atom_architecture.md`](../80_adrs/adr_001_atom_architecture.md) — materializable-element history semantics for C.1.5.

## Scope

Five sub-tasks. Sequence in the order below if running single-threaded; parallelize cautiously if running multi-branch (each is its own PR scope).

### C.1.1 — TS6305 eval-workflow build-order fix

**Context.** `.github/workflows/eval.yml` rubric typecheck fails because composite-package dist is not built before typecheck. Three-line workflow fix queued per the cortex track close-out queued-dispatches table.

**Work.**

- Inspect `.github/workflows/eval.yml`.
- Add a `pnpm build` step (or equivalent composite-dist build) before the rubric typecheck step.
- Push PR; verify CI green.

**Test.** Workflow runs clean on a forced re-trigger.

### C.1.2 — PR #26 fate resolution

**Context.** PR #26 (cc-agent-EVAL eval harness scaffold) is OPEN, never merged. Schema work for `evalRuns` / `evalScores` / `evalBaselines` is stuck on the `feat/eval-harness` branch only. Operator decision needed: merge as-is, split into smaller PRs, or close.

**Work.**

- Read PR #26 diff carefully via `gh pr view 26 --json files,additions,deletions,body` plus `gh pr diff 26`.
- Render a one-page summary for operator review:
  - What schema tables it adds (eval_runs, eval_scores, eval_baselines).
  - What scaffolding code it adds.
  - What's testable on the branch vs untestable.
  - Risk assessment of merge-as-is vs split.
- Surface the summary to the planner; operator decides merge / split / close.
- If merge: execute merge (squash). If split: execute the split per operator scope. If close: close with comment pointing at the decision.

**Test.** Post-resolution, schema/index.ts state matches the operator's chosen path.

### C.1.3 — PR #29 commit-2 ULID column type mystery

**Context.** Per the cortex track close-out: PR #29 commit 2 claimed to change `reviewer_requests.triggered_action_event_id` from `uuid()` to `text()`. PR #29 merged, but current `lib/db/src/schema/reviewerRequests.ts:214` still declares `uuid()` and Neon column is still `uuid`. Mystery: was commit 2 squashed out, was the diff partial, or something else.

**Work.**

- `git log --all --oneline -- lib/db/src/schema/reviewerRequests.ts` to surface what actually shipped.
- `gh pr view 29 --json commits,files` for PR-side truth.
- Compare squash-merge diff against per-commit diff.
- If commit 2's change got dropped: re-apply as a new PR with rationale link to the original commit. Decide UUID vs text on the merits — the original implicit-resolve UPDATE silent-failure justifies `text` per the original commit-2 rationale, but verify the failure mode still exists.
- If commit 2's change was intentional drop: document why in a doc-repo note so this doesn't get re-discovered.

**Test.** Schema and Neon agree (both `uuid` or both `text`); the silent-failure mode either is resolved or is documented as accepted.

### C.1.4 — UI-1 shell hygiene

**Context.** Cortex UI inventory surfaced three small SPA hygiene fixes: no global ErrorBoundary, dead `not-found.tsx` (not wired into router), no auth affordance (gateway-assumed). Per `42_design_accelerator_program_plan.md` queued items.

**Work.**

- Add a global ErrorBoundary at the React app root; surface caught errors with a recovery path (refresh + report).
- Wire `not-found.tsx` into the router so unknown routes render the 404 instead of a blank page.
- Add a minimal auth affordance (sign-out button + current-user indicator) somewhere in the chrome — likely top-right of the app shell.

**Test.** Forced error renders the ErrorBoundary; navigation to `/nonexistent-route` renders 404; sign-out clears auth and redirects to login.

### C.1.5 — Materializable-element delete-and-reinsert per ADR-001

**Context.** Per `40_design_accelerator.md` lines 132 + the cortex track close-out: current behavior at `ifcIngest.ts:260-314` is delete-prior-rows + re-insert on IFC re-ingest, which breaks ADR-001 atom history. Resolution: append + supersede chain per ADR-011.

**Work.**

- Read ADR-001 and ADR-011 (atom identity across versions).
- Modify `ifcIngest.ts:260-314` to:
  - On re-ingest, do not delete prior materializable_elements rows.
  - Mark prior rows as superseded (via a status column or by linking to a new event atom that points at them).
  - Insert new rows with proper provenance chain.
- Ensure UI consumers (BIM viewport, materializable-element queries) read the active rows only.

**Test.** Re-ingest IFC against an engagement with prior materializable_elements; verify (a) no rows deleted, (b) prior rows flagged superseded, (c) new rows present, (d) UI reads active rows only.

## Test plan (cross-task)

Per-task tests as noted above. Cross-task: full pnpm build + typecheck + test on legacy-design-tools after each sub-task lands, to ensure no cross-cutting breakage.

## Dependencies

- **Gates this dispatch:** none. Start immediately.
- **Parallel-safe with:** all other Lane C dispatches, all of Lane A and Lane B.
- **Merge coordination:** five sub-tasks, five PRs. Land sequentially against main; do not batch into one bulk PR (the planner has bigger Lane C work coming and wants each item bisectable).

## Hand-off

Each sub-task ships as its own PR. Session summary at end captures all five plus any follow-ons that surfaced during execution.

After C.1, the next Lane C dispatch you'll receive is [`2026-05-19_cc-agent-C_replit_decouple.md`](2026-05-19_cc-agent-C_replit_decouple.md) — the infrastructure track. Coordinate with planner on whether Lane C.2 starts before or after C.1 fully closes. If C.1 has all five sub-tasks landed and the operator has decided 0.20 (Cloud Run + Neon specs), C.2 starts; otherwise wait.
