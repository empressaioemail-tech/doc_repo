---
id: current_state_protocol
title: Current-state snapshot protocol
status: active
last_updated: 2026-08-20
applies_to: portfolio
related: [01_doc_conventions, 20_agent_operating_rules, session_close_template, 00_current_state, _STATE]
---

# Current-state snapshot protocol

> **Purpose.** A 1–2 page snapshot of the portfolio's working state, regenerated at every session close. Replaces the kitchen-sink orientation pass at the start of each new planner session — the planner reads the snapshot first, then loads targeted canonical docs only for the work at hand. Cuts orientation cost ~70–80% vs reading every canonical doc cold, especially valuable when running parallel sprints with multiple planner sessions per week.

## The snapshot file

- **Location:** [`_STATE.md`](../_STATE.md) is the live combined snapshot. It is generated from `_state/<seat>/STATE.md` plus `_state/shared/STANDING_DECISIONS.md` by `scripts/state/generate-combined.mjs`. [`00_current_state.md`](../00_current_state.md) is a pointer at band 00. Do not regenerate 00 as a many-writer snapshot.
- **Format:** Markdown. Seat files have no required frontmatter. Combined `_STATE.md` must not be hand-edited.
- **Length target:** each seat file stays a pickup, not a novel. If a seat file grows past 150 lines, extract durable content into a named doc and leave a pointer.

## What lives in the snapshot

Six fixed sections, in this order:

### 1. Active fires
Anything actively blocking, deploying, or burning attention right now.
Format: `- **Fire N:** <one-line description> — <owner> — <state>`

### 2. In-flight sprints
Every sprint currently active. One entry per sprint with sprint_id, product, phase, owner agent, status, doc link, and which milestone it advances toward.

### 3. Open ADRs to be aware of
ADRs with `status: proposed` or `status: active` likely to be touched in upcoming work. Title + ID + one-line rule. No full bodies.

### 4. Agent fleet assignments
Which agent owns which repo / scope right now.

### 5. Recent session summaries
Last 5 entries from `_sessions/`. Title + date + one-line outcome each.

### 6. Cross-cutting watch list
Anything spanning multiple repos/products needing coordination — naming changes in flight, contract migrations, shared-engine concerns, interface stubs awaiting full spec. Brief.

## When the snapshot is regenerated

At every session close, as a step in [`session_close_template.md`](session_close_template.md) Stage 2D. The seat writes `_state/<its-namespace>/STATE.md`. Then `node scripts/state/generate-combined.mjs` regenerates `_STATE.md`. Do not overwrite `00_current_state.md` as the serving snapshot.

This guarantees:
- The snapshot is never more than ~1 session out of date
- Stale entries decay naturally (a fire that hasn't moved in 3 sessions either changes status or gets archived to a proper doc)
- The planner can trust the snapshot as orientation ground truth while still routing through canonical docs for deep-context lookups specific to a session's work

## How the planner uses it

**Session start (replaces full orientation):**
1. Small courier prompt: "Read `_STATE.md` verbatim, plus any docs it references that are relevant to <today's topic>. Report."
2. Pasted snapshot + targeted docs = orientation complete.
3. Begin substantive work.

**Mid-session:** Targeted courier prompts for specific canonical docs, same as before.

**End-of-session:** Updated [`session_close_template.md`](session_close_template.md) flow includes snapshot regeneration as part of the courier commit.

## What the snapshot is NOT

- Not a substitute for ADRs, roadmap, or canonical docs. Those remain source of truth — the snapshot is a pointer doc.
- Not auto-generated at the seat file. Combined `_STATE.md` is generated. The seat writes its own `_state/<namespace>/STATE.md`.
- Not append-only. Stale entries are removed when no longer current. A monotonically growing snapshot is a failing snapshot.

## Revision history

- **2026-08-20:** live snapshot moved to `_STATE.md`. `00_current_state.md` is a pointer. Session close no longer regenerates 00 as a many-writer file.
- **2026-05-11 (origin):** protocol drafted. Triggered by orientation cost becoming the dominant context-window expense at session start, especially with multi-sprint parallelism increasing the breadth of context the planner needs to enter a session with.

## Pairs with the orientation discipline addendum

This runbook is the mechanism. The discipline — when to use the snapshot vs when to trigger a full orientation — lives in the planner project's project-knowledge addendum (separate from doc_repo). Threshold rule of thumb: structural commitments living in doc_repo for >2 weeks need calibration; tactical dispatch against an already-planned sprint can jam.
