---
id: 2026-05-18_substrate_v1_dispatch_allocation_claude_code
title: Session — Substrate v1 sprint dispatch allocation (fleet doubling; four cc-agent kickoff prompts)
date: 2026-05-18
agent: claude_code
repo: docs
session_type: planning
rolled_up: true
rolled_up_into: [_decisions/2026-05-18_substrate_v1_dispatch_allocation, _dispatches/2026-05-18_cc-agent-1_substrate_v1_1A_2A, _dispatches/2026-05-18_cc-agent-2_substrate_v1_1B_2B, _dispatches/2026-05-18_cc-agent-3_substrate_v1_1C_2C, _dispatches/2026-05-18_cc-agent-4_substrate_v1_1D_2D, 00_current_state]
---

## What was done

Allocated the substrate v1 sprint's eight parallel streams across four cc-agents by doubling. Each cc-agent owns one Track 1 stream plus the matching Track 2 stream. Pairings reflect natural domain coupling: cc-agent-1 (1A + 2A: input boundaries and tool wiring); cc-agent-2 (1B + 2B: schema and access control); cc-agent-3 (1C + 2C: data layer and telemetry); cc-agent-4 (1D + 2D: quality and production posture). Planner (this Claude Code session) retains Bump 1 atom contract coordination plus sync points 4 and 5 (launch gates).

Drafted four pasteable cc-agent kickoff prompts at `_dispatches/2026-05-18_cc-agent-*.md`. Each is self-contained: identity, read-first list, scope summary pointing to 51 sections, sync-point ownership and dependencies, coordination expectations, out-of-scope items, done criteria. New convention `_dispatches/` directory introduced per the "inherently a series" subdirectory rule in [`01_doc_conventions.md`](../01_doc_conventions.md) §Subdirectories.

Decision record at [`_decisions/2026-05-18_substrate_v1_dispatch_allocation.md`](../_decisions/2026-05-18_substrate_v1_dispatch_allocation.md) captures the doubling rationale, the per-agent pair reasoning, and four reversal triggers (per-agent context budget; coordination overhead; pair structural mismatch; lean-shop posture relaxation).

## What was learned

51 §Sync points across tracks line about Track 2 streams proceeding against mocked or staged backends before sync point 3 is the structural enabler for doubling. Without it, Track 2 streams would wait on Sync 3 before starting and the parallelism design would fail under a 4-agent fleet. With it, all eight streams can start concurrently.

The six sync points across tracks (1 Bump 1, 2 adapter contract, 3 retrieval API, 4 first jurisdiction eval, 5 20-jurisdiction corpus, 6 IP attorney memo) split into planner-owned (1, 4, 5), agent-owned (2 cc-agent-1, 3 cc-agent-3), and external (6 Nick action). Naming the ownership in each dispatch prompt removes ambiguity at the critical-path moments.

`_dispatches/` is a new doc_repo convention introduced this session. Pattern matches `_sessions/` and `_decisions/`: subdirectory for inherently-a-series artifacts; file naming `<YYYY-MM-DD>_<agent>_<topic>.md`. Future sprints can re-use the convention.

## What's still open

Nick to paste the four dispatch prompts into the respective cc-agent Cursor sessions to actually start the work. The agents will then run their own session-protocol-compliant work and ship session summaries back to doc_repo.

Planner-owned Bump 1 atom contract coordination starts when cc-agent-2's `packages/atoms/` registrations land. Single-PR-per-repo atomically-merged pattern across five repos (legacy-design-tools, smartcity-os, legacy-revit-sensor, hauska-engine, hauska-mcp-server).

Texas IP attorney memo (Sync 6, Nick action) remains the external gate for Tier 1 plus Tier 2 plus Tier 3 batch ingest beyond Bastrop and Grand County. Tracked at [`72_hauska_inc_operations.md`](../72_hauska_inc_operations.md) IP attorney memo section.

M9 Tier-3 city name remains deferred to batch-time per [`_decisions/2026-05-18_substrate_v1_phase_0_close.md`](../_decisions/2026-05-18_substrate_v1_phase_0_close.md).

## Suggested canonical doc updates

All applied this session.

- [`00_current_state.md`](../00_current_state.md) §4 (Agent fleet assignments): cc-agent-1..4 entry updated with the substrate-v1 stream-pair allocation; §5 prepends this session, drops oldest 2026-05-18 entry; §6 Hauska MCP Server v1 watch entry updated to point at dispatch allocation.
- `_decisions/2026-05-18_substrate_v1_dispatch_allocation.md` (new): decision record for the doubling.
- `_dispatches/2026-05-18_cc-agent-1_substrate_v1_1A_2A.md` (new): cc-agent-1 kickoff prompt.
- `_dispatches/2026-05-18_cc-agent-2_substrate_v1_1B_2B.md` (new): cc-agent-2 kickoff prompt.
- `_dispatches/2026-05-18_cc-agent-3_substrate_v1_1C_2C.md` (new): cc-agent-3 kickoff prompt.
- `_dispatches/2026-05-18_cc-agent-4_substrate_v1_1D_2D.md` (new): cc-agent-4 kickoff prompt.
