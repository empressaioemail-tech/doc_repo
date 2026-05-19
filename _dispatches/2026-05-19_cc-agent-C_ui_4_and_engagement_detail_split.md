---
id: 2026-05-19_cc-agent-C_ui_4_and_engagement_detail_split
title: Dispatch — cc-agent-C legacy-design-tools (UI-4 reclassify + EngagementDetail.tsx split)
date: 2026-05-19
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
related: [_decisions/2026-05-19_sync_4_5_and_cortex_sprint, _sessions/2026-05-18_cortex_ui_inventory_cc-agent-UI, _sessions/2026-05-19_cortex_track_close_out_claude_code, CLAUDE.md]
---

# Lane C.3 — cc-agent-C dispatch (UI-4 reclassify endpoint UI + EngagementDetail.tsx split)

You are cc-agent-C continuing on the `legacy-design-tools` repo. Lane C.3 is independent of L-surface work and infrastructure cutover — parallel-safe with both. Closes two UI debts surfaced by the cortex UI inventory.

## Why this exists

The cortex UI inventory at [`_sessions/2026-05-18_cortex_ui_inventory_cc-agent-UI.md`](../_sessions/2026-05-18_cortex_ui_inventory_cc-agent-UI.md) surfaced two structural debts:

1. **Reclassify endpoint with no UI caller.** Server-side reclassification logic exists at `routes/submissions.ts:421-632` with zero frontend consumers. The capability is built but unreachable from the UI.
2. **EngagementDetail.tsx is 5,172 lines.** Single-file monolith carrying the architect-side detail view. Hard to reason about, hard to test, hard to extend; surfaces in the inventory as a structural refactor candidate.

Both ship-blocking? No. Both worth closing before the L-surface UI work lands on top? Yes — L-surface UI consumers will touch the EngagementDetail surface, and the split makes their work safer.

## Read first

In order:

1. [`CLAUDE.md`](../CLAUDE.md) — operating instructions.
2. [`_decisions/2026-05-19_sync_4_5_and_cortex_sprint.md`](../_decisions/2026-05-19_sync_4_5_and_cortex_sprint.md) — sprint scope.
3. [`_sessions/2026-05-18_cortex_ui_inventory_cc-agent-UI.md`](../_sessions/2026-05-18_cortex_ui_inventory_cc-agent-UI.md) — the recon that surfaced both debts.
4. legacy-design-tools `routes/submissions.ts:421-632` — the reclassify endpoint signature and behavior.
5. legacy-design-tools `EngagementDetail.tsx` — the file you're splitting.

## Scope

### C.3.1 — Reclassify endpoint UI (UI-4)

**Context.** Server endpoint exists at `routes/submissions.ts:421-632`. No frontend caller per the cortex UI inventory. The capability lets an operator reclassify a submission's classification atom (e.g., recategorize a submission from "wall section" to "wall type" or similar). Operationally useful for fixing misclassifications surfaced during QA.

**Work.**

- Inspect the reclassify endpoint: input shape, output shape, validation, error envelopes.
- Add a UI affordance at the appropriate surface (likely on the submission detail view or the QA artifact). Should be reachable from a per-submission menu or button.
- Implement the client-side call: form for new classification value, validation matching server-side, success/error handling.
- Add a confirmation step before submitting (reclassifications are reversible but operationally meaningful).

**Test.** End-to-end: open a submission, reclassify it, verify the classification atom updates server-side, verify UI reflects the new classification, verify the action lands in any audit log if one exists.

### C.3.2 — EngagementDetail.tsx split

**Context.** 5,172-line single-file component. Split into per-section components without changing user-visible behavior.

**Work.**

- Read EngagementDetail.tsx end-to-end. Identify the logical section boundaries (likely: header, briefing panel, snapshot list, findings panel, communications panel, deliverables panel, etc.).
- Extract each section as its own component file under `components/engagement-detail/`.
- The main EngagementDetail.tsx becomes a thin composition shell delegating to the section components.
- Preserve all existing props, state lifting patterns, and event handlers — no behavior changes.
- Preserve performance characteristics — be careful with React.memo or useMemo wrappers if present.

**Test.** Existing E2E tests pass unchanged. Visual regression: open an engagement in dev mode, verify every section renders identically to pre-split main. Verify all interactive affordances (buttons, menus, navigation) still work.

**Critical constraint.** This is a refactor, not a redesign. The L-surface UI work landing in Lane C.4 will consume these new section components — leaving the split clean and consumer-friendly is the value here.

## Test plan (cross-task)

Per task as noted. Cross-task: full pnpm build + typecheck + test on legacy-design-tools after each PR. Visual smoke test of the engagement detail view before and after the split.

## Dependencies

- **Gates this dispatch:** Lane C.1 closes (so quick-win turbulence is behind you). Lane C.2 (Replit decouple) can be in-flight in parallel — different code paths.
- **Parallel-safe with:** Lane A and Lane B (different repos).
- **Coordinates with:** Lane C.4 (L-surface UI) — the EngagementDetail split lands BEFORE Lane C.4 starts, so L-surface UI work consumes the cleaner shape.

## Hand-off

Two PRs, session summary at close. After C.3 closes, Lane C.4 (L-surface UI per Sync B fires) is your next dispatch.
