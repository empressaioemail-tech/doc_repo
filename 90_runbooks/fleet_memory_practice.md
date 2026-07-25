---
title: Fleet memory practice — the dev-fleet scratchpad and its promotion gate
description: How the fleet captures build knowledge at Tier 2 (scratch) and promotes it to Tier 1 (durable) through a planner-gated mechanical gate. Sprint-zero infrastructure (M0) under the 27 master WDLL.
last_updated: 2026-07-25
owner: nick
governs: M0 sub-WDLL of 27_MASTER_WDLL_spine_completion_and_depth_engine
---

# Fleet memory practice (M0)

The problem this solves: build knowledge dies at context roll. An agent figures something out — a lesson, a dead end, a live ground-truth — and it evaporates when the context window ends or the dispatch closes. The next agent re-derives from archaeology and re-makes the same class of mistake. The 714 Spring St jagged-polygon bug was exactly this: an agent knew enough to reject one naive geometry path and not enough to reject the second, and left no durable memory of the missing lesson. This practice stops that.

It is a two-tier system. Tier 2 is cheap, lossy, disposable working memory. Tier 1 is durable, promoted, provable memory. A planner-gated mechanical gate separates them. The gate is the whole point — Tier 2 is allowed to be wrong precisely because promotion to Tier 1 is gated.

## Tier 2 — the scratchpad (capture aggressively; being wrong is fine)

One file per active workstream, at `_scratch/<workstream>.md` in doc_repo (planner side) or embedded in the dispatch loop (cc-agent side). Write entries as you work. Four entry kinds, one line each where possible:

- `LESSON:` a hard-won fact that should probably become a test or a durable note. Example: `LESSON: per-edge miter self-intersects on concave rings; naive parallel offset is wrong for real parcel geometry; use a real polygon-offset (jsts/martinez/polygon-clipping).`
- `DEAD-END:` a tried-and-failed path the next agent must NOT retry, with the reason. Example: `DEAD-END: broadening ldt api-server esbuild conditions to fix pg import boot-crashed the container ("Class extends value"); reverted; conditions must stay ["workspace"].`
- `GROUND-TRUTH:` a live-verified state that goes stale and MUST carry its timestamp. Example: `GROUND-TRUTH (2026-07-25 live): engine-api serving hauska-engine-api-00086-hoz @ 100%, health=/engine-api.`
- `OPEN:` a live thread a fresh context must pick up. Example: `OPEN: ROW/road-width data availability across Central TX unknown; assumed-per-class-width v1 chosen; precision pass deferred.`

Rules for Tier 2:
- Capture aggressively. A wrong LESSON is cheap; a lost one is expensive.
- Every GROUND-TRUTH carries the timestamp of when it was verified. A GROUND-TRUTH with no timestamp is invalid — it will be trusted stale.
- Nearing your context ceiling: FLUSH. Write your open threads, live ground-truths, and lessons to the scratch file before compaction. The file is continuity; you are disposable. The next instance reads the file first and starts warm.
- Reading a workstream cold: read its scratch file FIRST, before archaeology.

## Tier 1 — promotion (planner-gated; the strongest form is a mechanical guard)

A Tier-2 LESSON earns promotion to durable memory only when verified, and only through planner review. The scratchpad does NOT write durable memory autonomously — this is the drift firewall. An autonomous memory-writer is the exact nested-agent-fan / scan-fix drift shape this whole program exists to kill.

Promotion order of preference (strongest first):
1. A MECHANICAL GUARD — a failing test, a CI check, a fail-closed gate. Prose rots; a test cannot be silently violated. The geometry lesson promotes to a failing test on a concave fixture, NOT a note that says "use a real offset library." Always prefer this form when the lesson can be made mechanical.
2. A durable doc / MEMORY.md entry — only where prose is the only possible form (a process gotcha, an operator ruling, an external constraint). Follow the existing MEMORY.md convention.

Promotion procedure:
- The agent proposes promotion by leaving the LESSON in the scratch file (do not self-promote).
- The planner reviews at session close (or when a scratch file accumulates promotable lessons), decides mechanical-guard-vs-prose, and lands the durable form.
- The promoted entry links back to the scratch origin so the lesson's provenance is traceable.

## Install (the "survives every build" requirement — the fleet is split)

Planner half (doc_repo, Claude Code + Cursor): the `.cursor/rules/fleet-memory.mdc` rule (alwaysApply, all-agents, terse, points here) + the `_scratch/` convention. Live in this repo.

cc-agent half (product repos ldt/engine/map — which have no `.cursor/rules/` today): the copy-paste-ready rule block below is embedded in every dispatch prompt, and the scratch convention runs inside the dispatch loop (the agent's scratch is returned in its close and mirrored into doc_repo `_scratch/` by the planner, since cc-agent-M has no doc_repo access). Until product repos carry their own rules, the dispatch is the install surface.

cc-agent dispatch rule block (paste verbatim into every sprint dispatch):

```
FLEET MEMORY (M0): As you work, capture build knowledge in a scratch block you return in your close, using four entry kinds — LESSON (a hard-won fact worth a test/note), DEAD-END (a tried-and-failed path + reason, so it is not retried), GROUND-TRUTH (a live-verified state WITH its timestamp), OPEN (a live thread the next context must pick up). Read any scratch context passed to you FIRST before re-deriving. Do NOT promote anything to durable memory yourself — return lessons in your close; the planner gates promotion. Nearing your limit, flush open threads + live ground-truths into your close so the next instance starts warm.
```

## Why this is load-bearing for the 27 master

M0 is sprint zero — built and installed before R0 — so the depth-engine build (R0-R4) is the first real dogfood of this practice. R0's geometry lessons are M0's first scratch entries; a promoted geometry lesson becoming a mechanical test is M0's proof it works. The build of the depth engine is the first test of whether the fleet-memory process keeps the build itself from drifting one level up. See `27_MASTER_WDLL_spine_completion_and_depth_engine.md` (M0 acceptance items M0.1-M0.4).
