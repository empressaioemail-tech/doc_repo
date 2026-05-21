---
id: 2026-05-20_cc-agent-M_architecture_map_input
title: Dispatch — cc-agent-M MCP-server architecture map input (QA-05 / WS-D)
date: 2026-05-20
agent: cc-agent-M
repo: hauska-mcp-server
kind: dispatch
related: [43_cortex_qa_backlog, 2026-05-20_cc-agent-C_cortex_qa_wsa_audit, 90_runbooks/legacy_design_tools_replit_to_cloud_run_cutover, CLAUDE.md]
---

# MCP-server architecture map input — cc-agent-M dispatch

You are cc-agent-M on the `hauska-mcp-server` repo. This is a read-only recon and documentation task. It feeds QA-05 (WS-D) of the Cortex QA backlog: the operator wants a clear architecture diagram of which MCP servers run what, how they relate to the database, and how they consume the Hauska SDK. cc-agent-C's WSA.1 audit produces the Cortex and legacy-design-tools side; this dispatch produces the hauska-mcp-server side. The planner assembles the full diagram from both.

## Why this exists

Post-cutover, the operator does not have a clear mental model of the MCP topology. cc-agent-C's WSA.1 audit initially carried a "zero MCP integration" headline that turned out to be wrong (origin/main carries an L-surface inbound SERVICE_API_KEY bearer path). That a code-resident audit got the topology wrong is itself the signal that the topology is under-documented. A canonical diagram resolves it.

## Read first

1. [`CLAUDE.md`](../CLAUDE.md) — operating instructions, including the ADR-018 rule that product surfaces consume `@hauska/atom-contract` directly and the SDK is consumed only for paid-tier VDA wrapping or revenue routing.
2. [`43_cortex_qa_backlog.md`](../43_cortex_qa_backlog.md) — QA-05 context.
3. [`90_runbooks/legacy_design_tools_replit_to_cloud_run_cutover.md`](../90_runbooks/legacy_design_tools_replit_to_cloud_run_cutover.md) — Stage 9, including the recorded wiring facts (MCP server local at `:3000`; hauska-engine retrieval API not deployed at `localhost:8080`; `X-Hauska-Key` inbound header).

## Scope

Produce a structured, code-verified description of the hauska-mcp-server side of the topology:

- **Servers and products.** hauska-codex and hauska-cortex appear as two MCP server entries in the operator's Cursor settings, each showing roughly 40 tools, while `00_current_state.md` records 31 Cortex tools plus 4 Codex tools. Resolve this: one server process with product gating, or separate processes, and what the tool count actually is per product.
- **Downstream calls.** What each tool surface calls: cortex-api (legacy-design-tools) via the SERVICE_API_KEY bearer path, the hauska-engine retrieval API, cortex-prod Neon (directly, or only by way of cortex-api), and the hauska-engine substrate database.
- **Auth model.** The `X-Hauska-Key` inbound header, the product gate, and the SERVICE_API_KEY outbound bearer to cortex-api. Note where a wrong header silently degrades to the public tier.
- **Database relationships.** What the MCP server reads or writes directly versus what it proxies. Identify which database is which: cortex-prod versus the hauska-engine substrate Neon.
- **Hauska SDK consumption.** Verify against actual code: where the MCP server uses the Hauska SDK versus `@hauska/atom-contract` directly. Confirm or correct the ADR-018 expectation.
- **Deployment state.** Which tools are actually live given the MCP server runs locally at `:3000` and the hauska-engine retrieval API is not deployed.

## Output

A doc `_research/2026-05-20_mcp_architecture_map.md` in hauska-mcp-server, structured so the planner can render it into the QA-05 diagram. A draft mermaid or MD diagram fragment of the hauska-mcp-server side is welcome.

This is read-only recon and documentation; no code changes. Parallel-safe with cc-agent-M's other lanes.

## Hand-off

The report and diagram fragment hand to the planner, who merges them with cc-agent-C's WSA.1 Cortex-side fragment into the canonical QA-05 architecture doc.
