---
id: 2026-05-28_cc-agent-M_brokerage_workspace_mcp_surface
title: Dispatch — MCP surface for Brokerage V1 workspace retrieval and share graph
date: 2026-05-28
agent: cc-agent-M
repo: hauska-mcp-server
kind: dispatch
related: [50_hauska_mcp_server, 28_mcp_first_product_design, _dispatches/2026-05-28_cc-agent-E_property_workspace_atom_pipeline, _decisions/2026-05-28_brokerage_v1_expanded_scope]
---

# MCP parity slice for Brokerage V1

You are `cc-agent-M`, owning MCP surface only.

## Goal

Add minimum MCP tools for brokerage workspace retrieval so V1 remains dual-interface compatible.

## Scope

In scope:
- Add MCP tools:
  - `list_property_workspaces`
  - `get_property_workspace`
  - `list_workspace_share_edges`
- Respect access rules:
  - owner/collaborator read allowed
  - consent-aware graph edge visibility
- Return compact payloads with refs to evidence/citations.

Out of scope:
- Writing workspace data (handled by product/API layer).
- Billing enforcement.
- UI/admin dashboards.

## Acceptance criteria

- [ ] Tools registered and documented.
- [ ] Access checks enforced.
- [ ] Responses include stable IDs and timestamps.
- [ ] Integration tests green against sample workspace atoms.

## Report back

Write inbox close file:

`P:/doc_repo/_inbox/2026-05-28_hauska-mcp-server_cc-agent-M_brokerage_workspace_mcp_surface_close.md`

Include PR URL, SHAs, and sample tool responses.
