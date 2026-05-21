---
id: 2026-05-20_cc-agent-C2_working_tree_forensics
title: Dispatch — cc-agent-C2 forensic analysis of un-attributed legacy-design-tools working-tree changes
date: 2026-05-20
agent: cc-agent-C2
repo: legacy-design-tools
kind: dispatch
related: [43_cortex_qa_backlog, 2026-05-20_cc-agent-C_cortex_qa_wsb_ui_cleanup, _decisions/2026-05-19_sync_4_5_and_cortex_sprint, CLAUDE.md]
---

# Working-tree forensics — cc-agent-C2 dispatch

You are a separate Cursor agent on the `legacy-design-tools` repo, distinct from cc-agent-C which owns the active Cortex QA work-stream lanes. This is a read-only forensic task. It produces a report; it changes nothing.

## Why this exists

While executing the Cortex QA work (WS-A and WS-B), cc-agent-C found un-attributed changes in the working tree to two files that its own work did not produce:

- `findings.ts`
- `track-b-ifc-schema.test.ts`

cc-agent-C preserved them in `git stash@{0}`, kept off the `feat/cortex-qa-wsb` branch. Their origin is unknown. The operator's hypothesis is a crossover from the combined Cortex/Codex sprint (Lanes A, B, C, and the L-surface work). The task is to establish what these changes are, where they came from, and whether they should be kept and turned into a PR, discarded, or escalated for an operator decision.

## Critical constraints

- `git stash@{0}` is local to the legacy-design-tools checkout that ran WS-A and WS-B. It is not pushed, not portable, and not recoverable if dropped.
- Do NOT drop the stash. Do NOT `pop` or `apply` it. Do NOT commit the changes. Do NOT push anything.
- Run this task in the same checkout that holds `stash@{0}`. If you are on a fresh checkout the stash will not be present; coordinate with cc-agent-C or the operator to export it first.
- This is read-only forensics plus a report. The planner decides disposition afterward.

## Read first

1. [`CLAUDE.md`](../CLAUDE.md) — operating instructions.
2. [`43_cortex_qa_backlog.md`](../43_cortex_qa_backlog.md) — Cortex QA backlog context.
3. [`_decisions/2026-05-19_sync_4_5_and_cortex_sprint.md`](../_decisions/2026-05-19_sync_4_5_and_cortex_sprint.md) — the combined Cortex/Codex sprint, the most likely crossover source.

## Scope

### Step 1 — Capture the diff

Run `git stash show -p stash@{0}` and record the full patch for both files. Export it to a portable patch file so the content survives independent of the local stash: `git stash show -p stash@{0} > _research/2026-05-20_stash0.patch`.

### Step 2 — Trace provenance

For each of `findings.ts` and `track-b-ifc-schema.test.ts`: run `git log` and `git blame` on the committed file, identify the last committed state, and characterize exactly how the stashed change diverges from it.

### Step 3 — Cross-reference recent sprint history

Check recent sprint branches and merged PRs to locate the origin. Candidates include the combined Cortex/Codex sprint Lanes A/B/C, the L-surface PRs (#42, #43, #46, #51), and the cutover PRs (#52, #53, #54). Determine whether each stashed change is: (a) already-merged work the working tree drifted from, (b) abandoned in-progress work from a sprint lane, or (c) genuine uncommitted work that still needs a home.

### Step 4 — Assess

For each file: are the changes coherent and intentional, partial or broken, or stale. Do they still apply cleanly on current `origin/main`.

## Output

A report doc `_research/2026-05-20_working_tree_forensics.md` in legacy-design-tools, containing the captured diff summary, the provenance findings per file, and a recommendation per file: keep-and-PR, discard, or needs-operator-decision. Reference the exported `2026-05-20_stash0.patch`.

Do not action the recommendation.

## Hand-off

The report hands to the planner, who reviews and decides disposition. Flag explicitly if either file's change looks like it belongs to an in-flight sprint lane, so the planner can route it back to the owning agent rather than orphaning it.
