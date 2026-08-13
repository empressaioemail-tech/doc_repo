---
title: Interruption-safe note template for in-flight Cursor lane agents
date: 2026-08-12
last_updated: 2026-08-12
status: active
purpose: Cursor stops a lane agent's running sub-agent processes whenever the operator interrupts or sends new input. Prepend this block to ANY instruction sent to an in-flight lane agent so stopped workers are recovered, not orphaned.
---

# Interruption-safe note template

Cursor native agents stop their running sub-agent processes the moment the parent receives new input. First observed cost 2026-08-12: a scope addendum to L5 stopped its LDT silent-fallback sub-agent mid-fix. A stopped worker's uncommitted worktree diff is the only copy of its work, and its triage items silently fall out of the plan while the parent pivots to the new instruction.

Paste this ABOVE any instruction sent to an in-flight lane agent, then the instruction itself:

```
SUPERVISION NOTE (interruption recovery — do this BEFORE acting on anything below):
This message has STOPPED your running sub-agents. For EACH sub-agent that was running:
1. Capture its state NOW: git status + full diff in its worktree, any branch pushed, any PR opened.
   Paste into your next checkpoint artifact. A stopped worker's uncommitted diff is the only copy of
   its work.
2. Its owned triage/work items do NOT move to deferred by virtue of the stop. The instruction below
   ADDS or CHANGES scope explicitly; it displaces nothing by implication. Re-triage only with a
   written reason.
3. Resume it as a SUPERVISED continuation from its captured state (recover, never reconstruct; never
   a blind fresh re-dispatch that redoes or half-overlaps the diff).
4. Check for limbo PRs: finish through the normal gate (CI conclusion STRING "success") or mark
   draft. No PR left in an ambiguous state.
5. Report each stopped agent's disposition (recovered / resumed / re-triaged) with evidence in your
   next checkpoint artifact.
```
