---
id: current_state_protocol
title: Current-state snapshot protocol
status: active
last_updated: 2026-05-11
applies_to: portfolio
related: [01_doc_conventions, 20_agent_operating_rules, session_close_template, 00_current_state]
---

# Current-state snapshot protocol

> **Purpose.** A 1–2 page snapshot of the portfolio's working state, regenerated at every session close. Replaces the kitchen-sink orientation pass at the start of each new planner session — the planner reads the snapshot first, then loads targeted canonical docs only for the work at hand. Cuts orientation cost ~70–80% vs reading every canonical doc cold, especially valuable when running parallel sprints with multiple planner sessions per week.

## The snapshot file

- **Location:** [`00_current_state.md`](../00_current_state.md) (band 00 = "read me first").
- **Format:** Markdown with required frontmatter (`id`, `title`, `status`, `last_updated`, `applies_to`).
- **Length target:** 1–2 pages rendered (~80–120 body lines). If it grows past 150, content is leaking out of pointer-doc territory into canonical-doc territory — extract the long content into a proper doc and replace with a link.

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

At every session close, as a step in [`session_close_template.md`](session_close_template.md) Stage 2D. The planner authors the new snapshot from the session's outcomes plus the prior snapshot; the doc_repo courier agent commits it alongside the session summary and canonical doc updates.

This guarantees:
- The snapshot is never more than ~1 session out of date
- Stale entries decay naturally (a fire that hasn't moved in 3 sessions either changes status or gets archived to a proper doc)
- The planner can trust the snapshot as orientation ground truth while still routing through canonical docs for deep-context lookups specific to a session's work

## How the planner uses it

**Session start (replaces full orientation):**
1. Small courier prompt: "Read `00_current_state.md` verbatim, plus any docs it references that are relevant to <today's topic>. Report."
2. Pasted snapshot + targeted docs = orientation complete.
3. Begin substantive work.

**Mid-session:** Targeted courier prompts for specific canonical docs, same as before.

**End-of-session:** Updated [`session_close_template.md`](session_close_template.md) flow includes snapshot regeneration as part of the courier commit.

## What the snapshot is NOT

- Not a substitute for ADRs, roadmap, or canonical docs. Those remain source of truth — the snapshot is a pointer doc.
- Not auto-generated. The planner writes it as part of session-close, applying judgment about what made the cut.
- Not append-only. Stale entries are removed when no longer current. A monotonically growing snapshot is a failing snapshot.

## Pairs with the orientation discipline addendum

This runbook is the mechanism. The discipline — when to use the snapshot vs when to trigger a full orientation — lives in the planner project's project-knowledge addendum (separate from doc_repo). Threshold rule of thumb: structural commitments living in doc_repo for >2 weeks need calibration; tactical dispatch against an already-planned sprint can jam.

## Revision history

- **2026-05-11 (origin):** protocol drafted. Triggered by orientation cost becoming the dominant context-window expense at session start, especially with multi-sprint parallelism increasing the breadth of context the planner needs to enter a session with.
