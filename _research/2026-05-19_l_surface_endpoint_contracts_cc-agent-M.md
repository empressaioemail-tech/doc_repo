---
id: 2026-05-19_l_surface_endpoint_contracts_cc-agent-M
title: Contract — L-surface legacy-design-tools endpoints (MCP-first, for cc-agent-C Lane C.4)
date: 2026-05-19
agent: cc-agent-M
repo: hauska-mcp-server
session_type: contract
rolled_up: false
related: [_dispatches/2026-05-19_cc-agent-M_mcp_tool_surfaces, _dispatches/2026-05-19_cc-agent-C_l_surface_ui, _research/2026-05-19_l1_l6_mcp_tool_prep_cc-agent-M]
---

## Purpose

The Lane B Group 3 MCP tools (L1-L6 Cortex surfaces) wrap legacy-design-tools endpoints that **do not exist yet**. Per the planner's 2026-05-19 dispatch, cc-agent-M defines the endpoint contract MCP-first; cc-agent-C builds the matching legacy routes in Lane C.4; cc-agent-C's L-surface UI consumes the same endpoints.

This doc is the canonical contract cc-agent-C implements against. The MCP-side mirror lives in `hauska-mcp-server/src/legacy-client.ts`. If the contract needs to change during Lane C.4 implementation, surface the drift to the planner before locking — tool surface is contract-grade.

Atom shapes are locked by cc-agent-E in `hauska-engine/packages/atoms/` (`@hauska-engine/atoms`). The endpoints below return data conforming to those atom instance shapes.

## Conventions

- All routes are bearer-auth (the `Authorization: Bearer` service-token path). This is the same service-token middleware the Groups 1+2 Codex/Cortex bearer tools need; one middleware covers all of it.
- All routes are tenant-scoped per ADR-007. The bearer key resolves to a tenant; routes only touch that tenant's data.
- IDs in paths are atom `entityId`s (or engagement UUIDs).
- Responses return full atom instances conforming to the engine atom Zod schema for that type, so the MCP boundary and the UI both validate against one canonical shape.

## L1 — response-task

Atom: `ResponseTaskAtomInstance` / `RESPONSE_TASK_SCHEMA` (`@hauska-engine/atoms`, package 0.1.0). State enum: `open | in-progress | done | cancelled`.

### POST /api/engagements/:engagementId/response-tasks

Create a response-task within an engagement.

Request body:
```
{
  "title": string,                       // required, non-empty
  "description": string,                 // required (may be "")
  "sourceClientCommentId": string | null,// optional — client-comment atom entityId
  "findingId": string | null,            // optional — finding entityId
  "dueAt": string | null,                // optional — ISO-8601
  "actorId": string | null,              // optional — ADR-015 assigned actor
  "principalActorId": string | null      // optional — ADR-015 accountable actor
}
```

Backend behavior: assign `entityId`; set `state` to `"open"`; stamp `createdAt`; set `accessPolicy` to `"tenant-private"`; record the `response-task-opened` audit event.

Response `201`: `{ "responseTask": ResponseTaskAtomInstance }`

### POST /api/response-tasks/:responseTaskId/state

Transition a response-task to a new state.

Request body: `{ "state": "open" | "in-progress" | "done" | "cancelled" }`

Backend behavior: validate the transition; stamp `completedAt` when the new state is `"done"` (clear it otherwise); record the matching audit event (`response-task-progressed` / `response-task-completed`). A forbidden transition returns `409` with `{ "error": "response_task_transition_forbidden" }`.

Response `200`: `{ "responseTask": ResponseTaskAtomInstance }`

### GET /api/engagements/:engagementId/response-tasks

List response-tasks for an engagement, newest-first.

Query params: `state` (optional) — filter to a single state.

Response `200`: `{ "responseTasks": ResponseTaskAtomInstance[] }`

### POST /api/response-tasks/:responseTaskId/link-finding

Link a response-task to a finding.

Request body: `{ "findingId": string }`

Backend behavior: set the atom's `findingId`; record an audit event.

Response `200`: `{ "responseTask": ResponseTaskAtomInstance }`

### Error envelopes (all L1 routes)

- `404` `{ "error": "engagement_not_found" }` / `{ "error": "response_task_not_found" }`
- `400` `{ "error": "invalid_..." }` for body/param validation failures
- `409` for forbidden state transitions

The MCP server surfaces 4xx bodies to the agent and treats 5xx as an engineering-notified server error.

## L2-L6

Appended as each surface's MCP tools land. L2 (sheet-content-extraction + attached-document) is next.

## Status

- L1 contract: defined here; MCP tools shipped in hauska-mcp-server (`cortex_response_task_*`). Legacy routes pending cc-agent-C Lane C.4.
- L2-L6: pending.
