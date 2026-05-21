---
id: 2026-05-20_cc-agent-C_cortex_qa_wsc_in_app_agent
title: Dispatch — cc-agent-C cortex QA WS-C (in-app agent tool-use: read-awareness + write-back)
date: 2026-05-20
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
related: [43_cortex_qa_backlog, 44_mcp_cortex_architecture_map, 42_design_accelerator_program_plan, 28_mcp_first_product_design, CLAUDE.md]
---

# WS-C — cc-agent-C dispatch (in-app agent tool-use)

You are cc-agent-C continuing on the `legacy-design-tools` repo. This dispatch handles WS-C of the Cortex QA backlog: giving the in-app Cortex chat panel tool-use, so the in-app agent gains platform read-awareness and write-back. WS-C covers four QA items: QA-07, QA-08 (review-to-taskboard portion), QA-09, QA-11 (push-to-response-task portion). See [`43_cortex_qa_backlog.md`](../43_cortex_qa_backlog.md) for the full backlog.

## Why this exists

The Cortex MCP tool surface already shipped in the combined Cortex/Codex sprint: 31 Cortex tools on hauska-mcp-server, the full L1-L6 atom plus endpoint plus UI set. The in-app Cortex chat panel is the one surface that never got wired to any of it. Per the WSA.1 audit, `chat.ts` calls the Anthropic API directly (model `claude-sonnet-4-6`) with zero tool use: it is strictly read-only and emits a text stream. The L-surface operations, atoms, and endpoints all exist. WS-C connects the in-app agent to them. This is a bounded sprint, not the roadmap-scale retrofit the QA backlog's earlier framing implied.

## Pre-mortem

WS-C cleared the pre-mortem GREEN. One condition: the quality-gate guardrails on agent writes (provenance, AI-origin marker, reversibility, agent-action log) are a hard requirement, implemented as WSC.5. Direct-write is acceptable precisely because those guardrails make every write visible and reversible.

## Operator decisions

- **Direct-write.** Agent writes persist immediately; the operator undoes if wrong. This is conditioned on WSC.5: every write must be reversible and visible.
- **One sprint, all four items** (QA-07, QA-08, QA-09, QA-11).

## Read first

In order:

1. [`CLAUDE.md`](../CLAUDE.md) — operating instructions.
2. [`43_cortex_qa_backlog.md`](../43_cortex_qa_backlog.md) — the backlog and standing findings.
3. [`44_mcp_cortex_architecture_map.md`](../44_mcp_cortex_architecture_map.md) — the topology. Critical: the in-app chat is inside cortex-api; the MCP server serves external agents. WS-C does not route through the MCP server.
4. The WSA.1 audit at `_research/2026-05-20_cortex_qa_wsa_data_source_audit.md` in this repo — surface (c) covers `chat.ts` specifics.
5. [`42_design_accelerator_program_plan.md`](../42_design_accelerator_program_plan.md) — where WS-C fits; the L-surface streams.

## Architecture constraints

- The in-app chat lives inside cortex-api. Add Anthropic tool-use to `chat.ts`; tools execute against cortex-api's own L-surface and read endpoints in-process. Do not route the in-app chat through hauska-mcp-server.
- Reuse the L1-L6 endpoint contract (the same routes the MCP tools call, shipped in Lane C.4). Per the doc 28 back-into pattern, the in-app UI agent path and the external MCP path must flow through the same L-surface.
- Keep the model (`claude-sonnet-4-6`) and the SSE streaming behavior.

## Scope

### WSC.1 — Tool-use agentic loop in chat.ts

Work. Convert the chat route from a plain `messages.stream` call to a tool-use agentic loop: the model may call tools, the route executes each against cortex-api endpoints in-process, appends the `tool_result`, and continues, until the model returns a final text turn. Preserve SSE streaming to the panel. Define the tool registry that WSC.2 through WSC.4 populate.

Test. The agent can call a read tool, receive a result, and continue to a final answer in one streamed turn.

### WSC.2 — Read tools and platform awareness (QA-07)

Work.

- Ambient engagement context: the chat always knows which engagement is open and which tab the operator is on, without the operator pasting anything.
- Read tools: list and read the engagement's sheets; read engagement state; read tab data (site, site context, findings, snapshots, submissions, the L-surface tabs).
- UI: a sheet-select checkbox on sheet thumbnails to push selected sheets into chat context. The ambient context plus read tools are the larger half of QA-07 ("the agent can pull them and read them without me sending to chat").

Test. With no manual paste, the agent answers a question that requires reading a specific sheet and the current engagement's findings.

### WSC.3 — Write-back to response tasks (QA-08 and QA-11)

Work.

- A tool to create `response-task` (L1) atoms, single and batch.
- QA-08: a self-run code review renders in the center frame, and the operator can convert its findings into L1 response-tasks (the agent calls the create-task tool per finding).
- QA-11: "push these to response tasks" from chat works as a direct instruction.

Test. A code review run in chat produces response-task atoms that appear in the Response tasks tab and survive reload.

### WSC.4 — AI-assisted spec creation (QA-09)

Context. QA-09 asked what the detail-callout and product-spec tabs are for and whether they should be AI functions. The L4 `detail-callout-spec` and L5 `product-spec-reference` atoms and their manual forms both already exist. Resolution: augment, do not replace.

Work. Tools to draft and create `detail-callout-spec` (L4) and `product-spec-reference` (L5) atoms. Add an "AI-populate" path to the existing manual forms: the agent drafts the spec, the operator reviews and edits in the form. Keep the manual form path intact.

Test. The agent drafts a room-finish detail-callout-spec from the model and engagement context; it lands in the form for operator edit, then persists as an L4 atom.

### WSC.5 — Quality gate and reversibility (pre-mortem requirement)

The WS-C pre-mortem cleared green conditioned on this sub-task. It is not optional.

Work.

- Every atom the agent creates carries provenance: the source it derived from (finding atom, client comment, sheet), the agent's one-line reasoning, a timestamp, and an explicit AI-originated marker distinguishing agent-created atoms from operator-created ones. Where the source finding carries a confidence or severity, it propagates onto the created task.
- Every agent write is reversible. Response-task atoms use the L1 `cancelled` state as the undo. For detail-callout-spec and product-spec-reference atoms, confirm a delete or archive path exists; if a spec atom has no reversible path, that write gets a confirm step as a direct-write exception, and flag it to the planner.
- An agent-action log in the chat panel surfaces every write the agent made this session, each with a one-click reverse. Direct-write is acceptable precisely because the operator can see and undo; the log is what makes that true.

Test. Create atoms via the agent and confirm each carries provenance and the AI-origin marker; cancel an agent-created response task from the agent-action log; confirm a spec atom with no delete path triggers the confirm exception.

## Dependencies

- Sequenced after WS-A and WS-B, both merged via PR #55.
- WSC.3 and WSC.4 reuse the L1, L4, and L5 endpoints shipped in Lane C.4. No new backend persistence.
- WS-C modifies `chat.ts` and the engagement-detail UI; if any other cc-agent-C work touches those, sequence rather than interleave.

## Hand-off

Session summary documents all five sub-tasks. Flag explicitly if any spec atom (L4 or L5) lacks a reversible path, since that forces a confirm-step exception to direct-write. The planner adds a WS-C stream to [`42_design_accelerator_program_plan.md`](../42_design_accelerator_program_plan.md) at session close.
