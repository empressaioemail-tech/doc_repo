---
id: 2026-05-20_cortex_qa_backlog_claude_code-02
title: Session — Cortex QA backlog WS-C dispatched + WS-E resolved (continuation)
date: 2026-05-20
agent: planner
repo: docs
session_type: planning
rolled_up: false
rolled_up_into: []
related:
  - 43_cortex_qa_backlog
  - 44_mcp_cortex_architecture_map
  - _sessions/2026-05-20_cortex_qa_backlog_claude_code
  - _decisions/2026-05-20_hutto_tx_prioritized_ingest
---

## TL;DR

Continuation of the 2026-05-20 Cortex QA backlog session. WS-C scoped and dispatched; WS-E resolved (QA-10 decided and dispatched, QA-06 let-ride). With WS-A, WS-B, and WS-D from the first segment, all five QA workstreams are now dispatched, delivered, decided, or routed. Key correction: WS-C is a bounded one-sprint build, not the roadmap-scale retrofit the first segment assumed; grounding in docs 28 and 42 showed the Cortex MCP tool surface already shipped in the combined Cortex/Codex sprint. Two pre-mortems run, both cleared. One decision record filed (Hutto prioritized ingest, provisional). Three commits this segment.

## What was done

- **WS-C scoped and dispatched.** Grounding in docs 28 and 42 reframed WS-C: the Cortex MCP tool surface (31 Cortex tools on hauska-mcp-server) already shipped, so WS-C is the bounded piece, wiring the in-app chat (`chat.ts`, which calls Anthropic with no tool use) to cortex-api's own L-surface and read endpoints. Pre-mortem cleared green, with the quality-gate guardrail (provenance, AI-origin marker, reversibility, agent-action log on every agent write) made a hard dispatch requirement. Operator decisions: direct-write, one sprint covering QA-07/08/09/11. Dispatched to cc-agent-C per [`_dispatches/2026-05-20_cc-agent-C_cortex_qa_wsc_in_app_agent.md`](../_dispatches/2026-05-20_cc-agent-C_cortex_qa_wsc_in_app_agent.md).
- **WS-E QA-10 decided.** Pre-mortem cleared green with one operational yellow on focus-queue (Sync 5 is deferred), operator-acknowledged. The operator chose a prioritized one-off Hutto TX ingest over queuing with Sync 5. Decision record at [`_decisions/2026-05-20_hutto_tx_prioritized_ingest.md`](../_decisions/2026-05-20_hutto_tx_prioritized_ingest.md), status provisional pending a Municode-versus-eCode360 platform check. Dispatched to cc-agent-E per [`_dispatches/2026-05-20_cc-agent-E_hutto_tx_ingest.md`](../_dispatches/2026-05-20_cc-agent-E_hutto_tx_ingest.md).
- **WS-E QA-06 let-ride.** Per the operator's call, QA-06 (plan-set to publisher; scope Claude operating Revit) stays routed to [`41_advanced_capture_features.md`](../41_advanced_capture_features.md), picked up when the rendering activation gate opens.
- **Canonical doc updates.** doc 43 updated across both segments; doc 42 gains the `DA-IN-APP-AGENT` Phase 2 stream; doc 50 tool-surface correction (the "14 new tools" / slash-namespace framing superseded by the verified 40-tool flat-underscore surface); `00_current_state.md` regenerated.

## What was learned (changes to ground truth)

- WS-C is not roadmap-scale. The Cortex MCP tool surface shipped in the combined Cortex/Codex sprint; WS-C is the bounded in-app-chat wiring. The first-segment framing ("roadmap-scale Cortex MCP retrofit") is corrected in doc 43 and doc 44.
- The in-app chat is inside cortex-api and wires to cortex-api's own L-surface endpoints directly, not through the MCP server, which serves external agents.
- `50_hauska_mcp_server.md` was stale on the tool surface (slash namespace, "14 new tools"); corrected to the code-verified 40-tool shipped surface (5 public, 4 Codex, 31 Cortex, flat underscore names).

## What's still open

- QA-04: IFC 500 filed; the Revit add-in repoint (`legacy-revit-sensor` `ReplitUrl` setting) is the live data-scatter item.
- WS-C and the Hutto ingest are in cc-agent-C's and cc-agent-E's hands; the operator hands off the two dispatches.
- The Hutto decision is provisional until cc-agent-E's HUTTO.1 platform check clears it.
- QA-06 is picked up when the doc-41 rendering activation gate opens.
- legacy-design-tools repo hygiene: a root `.gitattributes`; cc-agent-M's MCP architecture research doc should be committed to hauska-mcp-server.

## Suggested canonical doc updates

All applied this session: doc 42 `DA-IN-APP-AGENT` stream, doc 50 tool-surface correction, `00_current_state.md` section 5 and section 6 refresh.

## Commit batch

Three commits this segment: `c4b753e` (WS-C dispatch plus backlog update), `078e688` (WS-E QA-10 decision plus cc-agent-E dispatch), and the close commit covering this session summary, `00_current_state.md`, `42_design_accelerator_program_plan.md`, and `50_hauska_mcp_server.md`.
