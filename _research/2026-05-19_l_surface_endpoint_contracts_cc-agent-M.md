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

## L2 — sheet-content-extraction + attached-document

Atoms: `SheetContentExtractionAtomInstance` (L2a) + `AttachedDocumentAtomInstance` (L2b), `@hauska-engine/atoms` package 0.2.0. Two coupled atoms — the sheet-ingest pass emits both.

### POST /api/sheets/:sheetId/content-extraction

Trigger the structured-content extraction pass on a sheet (OCR text segments + structured annotations: revision-cloud, dimension, schedule-row, callout).

Request body: `{}` (empty — the sheet id in the path is the only input).

Backend behavior: run the extraction; emit a `sheet-content-extraction` atom; set `accessPolicy` to `"tenant-private"`. Extraction may be a heavy pass — if the backend makes it async, return the in-progress atom or extend the contract with a job ref and surface it to the planner.

Response `200`: `{ "sheetContentExtraction": SheetContentExtractionAtomInstance }`

### GET /api/sheets/:sheetId/content-extraction

Fetch the `sheet-content-extraction` atom for a sheet.

Response `200`: `{ "sheetContentExtraction": SheetContentExtractionAtomInstance | null }` — `null` when the sheet has not been extracted yet (a normal empty result, not a 404).

### GET /api/engagements/:engagementId/attached-documents

List the supporting documents attached to an engagement.

Query params: `documentType` (optional) — one of `specification | calculation | product-data | narrative`.

Response `200`: `{ "attachedDocuments": AttachedDocumentAtomInstance[] }`

### GET /api/attached-documents/:attachedDocumentId

Fetch a single attached-document atom, including parsed `extractedText` and `originalBlobRef`.

Response `200`: `{ "attachedDocument": AttachedDocumentAtomInstance }`

### Error envelopes (all L2 routes)

- `404` `{ "error": "sheet_not_found" }` / `{ "error": "engagement_not_found" }` / `{ "error": "attached_document_not_found" }`
- `400` for body/param validation failures

Note: there is no MCP tool to *create* an `attached-document` — those atoms are produced by the sheet-ingest pipeline (coupled at the producer with `sheet-content-extraction`). The MCP surface for attached-document is read-only (list + fetch).

## L3 — deliverable-letter

Atom: `DeliverableLetterAtomInstance` / `DELIVERABLE_LETTER_SCHEMA` (`@hauska-engine/atoms` package 0.3.0). Status enum: `draft | sent`. Sections are an ordered array of `LetterSection` (`kind` ∈ `cover | intro | per-comment-response | signature`, `heading`, `content`, `provenance`). A letter is complete (sendable) when `cover`, `intro`, and `signature` are each present at least once — the engine `deliverableLetterCompleteness()` helper is the source of truth.

Sections have no per-section id field. Endpoints that target a single section use the section's zero-based **index** into the ordered `sections` array.

### POST /api/engagements/:engagementId/deliverable-letters

Create a deliverable letter in `draft` status.

Request body:
```
{
  "title": string,                       // required, non-empty
  "sections": [                          // optional initial sections
    { "kind": LetterSectionKind, "heading": string, "content": string }
  ],
  "recipientActorId": string | null,     // optional
  "actorId": string | null,              // optional
  "principalActorId": string | null      // optional
}
```

Backend behavior: assign `entityId`; set `status` to `"draft"`; stamp `createdAt`; set `accessPolicy` to `"tenant-private"`; for each supplied section initialize `provenance` to empty arrays; record the `deliverable-letter.drafted` event.

Response `201`: `{ "deliverableLetter": DeliverableLetterAtomInstance }`

### POST /api/deliverable-letters/:letterId/sections

Upsert a section by index.

Request body: `{ "sectionIndex": number, "kind": LetterSectionKind, "heading": string, "content": string }`

Backend behavior: `sectionIndex` within the current array replaces that section's `kind` / `heading` / `content` and **preserves its `provenance`**; `sectionIndex` equal to the current array length appends a new section with empty `provenance`; a larger index is a `400`. Record the `deliverable-letter.section-revised` event.

Response `200`: `{ "deliverableLetter": DeliverableLetterAtomInstance }`

### POST /api/deliverable-letters/:letterId/sections/:sectionIndex/provenance

Merge atom references into a section's provenance.

Request body (all keys optional; at least one required): `{ "responseTaskIds": string[], "sheetContentExtractionIds": string[], "findingIds": string[], "adjudicationStateIds": string[] }`

Backend behavior: add the supplied entityIds to the section's existing provenance arrays, deduped.

Response `200`: `{ "deliverableLetter": DeliverableLetterAtomInstance }`

### GET /api/deliverable-letters/:letterId/completeness

Run the engine `deliverableLetterCompleteness()` helper against the letter's sections.

Response `200`: `{ "complete": boolean, "missing": LetterSectionKind[] }`

### POST /api/deliverable-letters/:letterId/send

Transition the letter from `draft` to `sent`.

Backend behavior: run the completeness check first. An incomplete letter is rejected with `409` `{ "error": "deliverable_letter_incomplete", "missing": LetterSectionKind[] }`. On success set `status` to `"sent"`, stamp `sentAt`, record the `deliverable-letter.sent` event.

Response `200`: `{ "deliverableLetter": DeliverableLetterAtomInstance }`

### Error envelopes (all L3 routes)

- `404` `{ "error": "engagement_not_found" }` / `{ "error": "deliverable_letter_not_found" }`
- `400` for body/param validation failures, including `sectionIndex` out of range
- `409` `{ "error": "deliverable_letter_incomplete", "missing": [...] }` on `send`

## L4-L6

Appended as each surface's MCP tools land. L4 (detail-callout-spec) is next per cc-agent-E's Lane A.2 progress.

## Status

- L1 contract: defined; MCP tools shipped in hauska-mcp-server (`cortex_response_task_*`, PR #6). Legacy routes pending cc-agent-C Lane C.4.
- L2 contract: defined; MCP tools shipped (`cortex_sheet_content_extraction_*` + `cortex_attached_document_*`, PR #7). Legacy routes pending cc-agent-C Lane C.4.
- L3 contract: defined; MCP tools shipped (`cortex_deliverable_letter_*`, PR #8). Legacy routes pending cc-agent-C Lane C.4.
- L4-L6: pending.
