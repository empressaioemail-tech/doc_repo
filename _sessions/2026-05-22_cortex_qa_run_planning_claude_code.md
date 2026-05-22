---
date: 2026-05-22
agent: planner
repo: docs
session_type: planning
rolled_up: true
rolled_up_into: [00_current_state, 43_cortex_qa_backlog, 48_codex_program_plan, 44_mcp_cortex_architecture_map]
---

# Session — Cortex QA run planning and dispatch teeing-up

## What was done

Planned the 2026-05-22 Cortex / Design Tools QA run from a running operator QA list (six items captured in-session from screenshots) plus a handoff from a prior agent.

Synthesized the QA list: six items, three already covered by the existing fix-session dispatch (IFC upload 500, site-context layer failures on two engagements), three net-new product features — start a project from a dropped link (QA-27), in-app client-letter generation (QA-28), client presentations (QA-29).

Ran the MCP-servicing check the operator asked for. Finding: the Design Tools app does not consume the MCP server, by design. cortex-api is self-contained; the MCP-to-Cortex edge is one-directional. The in-app assistant is `chat.ts` calling Anthropic directly with in-process tools. The one wired path (Code Library, QA-17 PR #64) is mock-mode default. No customer-zero loop breakage is MCP-related.

Reconciled the fleet against reality: nothing was in flight. The doc set claimed cc-agent-C / AC / E dispatches were active; they were written, not fired. Caught a naming drift introduced by the prior agent — an invented fifth agent "cc-agent-D" and "cc-agent-AC" (atom contract) reassigned to deploy-workflow CI work. Collapsed both: all `legacy-design-tools` work consolidates under cc-agent-C as one phased dispatch.

Ran premortem-check formally on the full plan. Cleared green — three load-bearing commitments clean, one operational yellow on commitment 4 (dual interface), absorbed with a quality-gate guardrail requirement on the features and an MCP-retrofit tracking note.

Produced the consolidated dispatch (`_dispatches/2026-05-22_cc-agent-C_cortex_qa_build.md`, three phases) and the CDX review-surface relocation decision record reversing CDX-Phase1-1.

## What was learned (changes to ground truth)

Nothing was in flight as of session start — the 2026-05-21 roadmap-catch-up successor dispatches were written but never fired. `00_current_state.md` had recorded them as "Dispatched".

The MCP server does not service the Design Tools app; the app is self-contained (verified against doc 44). doc 44's "MCP server not deployed" facts are stale — `00_current_state.md` records the MCP server deployed to hauska-prod since the 2026-05-20 map was written.

The last fix session did not land because fixes shipped in code while the prod environment lagged — the prod DB was never migrated past the QA-04 manual apply, and the deploy does not run migrations.

## What's still open

The QA run is teed up, awaiting operator dispatch: cc-agent-C QA build (one phased dispatch) and cc-agent-E continuation. The operator dispatches; the planner goes on the `_inbox/` sweep loop.

doc 44 owes a full refresh against the post-deploy MCP topology; a dated staleness note was added this session.

## Suggested canonical doc updates

Applied this session: `00_current_state.md` (sections 2/4/5/6 corrected to reality), `43_cortex_qa_backlog.md` (QA-27/28/29 appended, QA-04 status updated, MCP-retrofit tracking note), `48_codex_program_plan.md` (CDX-Phase1-1 reversal), `44_mcp_cortex_architecture_map.md` (staleness note). New: the cc-agent-C QA build dispatch, the CDX review-surface relocation decision record. Superseded: `_decisions/2026-05-21_codex_reviewer_qa_surface_location.md` (status flip); the cc-agent-D, cc-agent-AC, and cc-agent-C IFC dispatches (banners).
