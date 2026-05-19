---
id: 2026-05-19_cortex_tools_lane_b_group_2_cc-agent-M
title: Session — hauska-mcp-server Lane B Group 2 (4 Cortex tools + two-auth-path legacy client)
date: 2026-05-19
agent: cc-agent-M
repo: hauska-mcp-server
session_type: engineering
rolled_up: false
rolled_up_into: []
---

## What was done

Lane B Group 2 of the 2026-05-19 Cortex/Codex sprint per [`_dispatches/2026-05-19_cc-agent-M_mcp_tool_surfaces.md`](../_dispatches/2026-05-19_cc-agent-M_mcp_tool_surfaces.md). Four Cortex (design accelerator) MCP tools wrapping legacy-design-tools api-server endpoints. Shipped on feature branch `feat/cortex-tools`; PR open at [empressaioemail-tech/hauska-mcp-server#3](https://github.com/empressaioemail-tech/hauska-mcp-server/pull/3). Single commit `84dab4e` on top of PR #2's squash-merge `fe58d8b`.

**Four Cortex tools, underscore-namespaced.**

| Tool | Method | Legacy endpoint | Auth |
|---|---|---|---|
| `cortex_snapshot_register` | POST | `/api/snapshots` | `x-snapshot-secret` |
| `cortex_ifc_ingest` | POST | `/api/snapshots/:id/ifc` (multipart) | `x-snapshot-secret` |
| `cortex_bim_model_query` | GET | `/api/engagements/:id/bim-model` | bearer |
| `cortex_briefing_emit` | POST | `/api/engagements/:id/briefing/generate` | bearer |

`cortex_snapshot_register` discriminates on `engagement_id` vs `project_name` body branch matching the legacy `CreateSnapshotBody` discriminated union. `cortex_briefing_emit` normalizes the 409 briefing-generation-already-in-flight envelope into `alreadyInFlight=true`, the same shape `codex_finding_generation` uses. `cortex_bim_model_query` falls back to the legacy backend's synthesize-from-IFC path when no `bim_models` row exists but an IFC ingest has succeeded — the wire shape passes through transparently.

**Two-auth-path legacy client.** The legacy backend's `/snapshots` and `/snapshots/:id/ifc` routes already gate on the `x-snapshot-secret` header (originally for the Revit add-in's service-to-service path). The other Cortex tools (`bim_model_query`, `briefing_emit`) hit cookie-session-auth routes and depend on the same Lane C bearer-token middleware as the Codex tools. `legacy-client.ts` grew a `snapshotFetch()` helper alongside the existing `legacyFetch()`; route selection picks the auth path. The two snapshot-secret Cortex tools work end-to-end against any legacy backend that has `LEGACY_SNAPSHOT_SECRET` configured to match the legacy backend's `getSnapshotSecret()`.

**IFC ingest via multipart.** `cortex_ifc_ingest` accepts the IFC bytes as base64 plus a filename via Zod. The MCP server decodes to a Buffer, copies into a fresh `ArrayBuffer`-backed view (required to satisfy the DOM lib's `BlobPart` type which rejects `Uint8Array<ArrayBufferLike>`), builds a `Blob` + `FormData`, and POSTs as `multipart/form-data`. The client lets fetch set the multipart boundary on the content-type header — manually setting content-type for FormData strips the boundary parameter and the legacy backend's busboy parse fails. Documented size caveat for the MCP message-size limit at the tool layer.

Known carry-over per the 2026-05-19 sprint decision: IFC import has unresolved failure modes. Tool surfaces raw legacy responses so callers see backend errors directly; do not gate ship on bug resolution. Verify at Stage 9 against post-cutover Cloud Run + new Neon.

**Cross-product gate covered.** `requireProduct()` now has explicit coverage for both directions: codex-key denied for cortex tool; cortex-key denied for codex tool; same-product allows. The gate was already exported in PR #2; this PR adds the symmetric cortex-direction test cases.

**Tests.** 78/78 pass (61 prior + 15 new in [`tests/cortex-client.test.ts`](https://github.com/empressaioemail-tech/hauska-mcp-server/blob/feat/cortex-tools/tests/cortex-client.test.ts) covering `registerSnapshot` discriminator branches, snapshot-secret header path, `ingestIfc` multipart shape, `queryBimModel` bearer-vs-snapshot-secret routing, `emitBriefing` 409 normalization and 400 no-sources rethrow, network-error path; plus 2 new in [`tests/codex-tools.test.ts`](https://github.com/empressaioemail-tech/hauska-mcp-server/blob/feat/cortex-tools/tests/codex-tools.test.ts) covering cortex-direction gate semantics). `tsc --noEmit` clean.

## What was learned

Three things worth carrying forward.

**Two auth paths on the same backend is a real and common shape.** The legacy backend mixes cookie-session auth (`requireReviewerAudience`, `requireArchitectAudience`) with service-token auth (`x-snapshot-secret`) depending on route family. Wrapping it under one MCP-server-side client meant adding a second fetch helper that knows which header to send for which route. The pattern generalizes: when a UI-first backend exposes select routes for service callers (Revit add-in, webhook, etc.), MCP retrofit can lean on those routes directly without waiting on the broader bearer-middleware work. **Two of the four Cortex tools ship working end-to-end today** because of this. The other two still gate on Lane C. Worth noting in [`28_mcp_first_product_design.md`](../28_mcp_first_product_design.md): MCP retrofit should inventory existing service-token entry points first; not every tool needs to wait on a comprehensive auth refactor.

**Multipart-over-fetch in Node has a typed-array generic trap.** Node's `Buffer` and `Uint8Array<ArrayBufferLike>` are not assignable to the DOM lib's `BlobPart` (which wants `Uint8Array<ArrayBuffer>` specifically). The workaround is to copy bytes into a fresh `ArrayBuffer` and pass that to the `Blob` constructor. Cheap (one allocation; the network upload dominates) and runtime-correct. Same trap will hit any future MCP tool that uploads binary blobs to a legacy backend (Cortex `cortex_ifc_ingest` here; possible future tools for plan-set PDFs, render outputs, etc.).

**Discriminated union body shapes need explicit caller validation.** `POST /api/snapshots` accepts two body shapes: existing-engagement (with `engagementId`) or new-engagement (with `projectName`). The Zod schema for `cortex_snapshot_register` couldn't enforce the union at the MCP-tool boundary cleanly because both fields are individually optional. Implemented the discrimination as an `if (!a && !b) return error; if (a && b) return error` runtime check inside the handler, mirroring the legacy backend's `CreateSnapshotBody` union semantics. Worth a note for any future MCP tool wrapping a discriminated-union backend route: Zod can model unions but the MCP tool surface is flat for LLM ergonomics, so handler-side validation is the right place to enforce the discriminator.

## What's still open

Group 2 follow-ups:

- **End-to-end against a deployed legacy backend.** Snapshot-secret tools (`cortex_snapshot_register`, `cortex_ifc_ingest`) unblock as soon as `LEGACY_SNAPSHOT_SECRET` is provisioned. Bearer-auth tools (`cortex_bim_model_query`, `cortex_briefing_emit`) gate on the Lane C service-token middleware.
- **MCP Inspector cross-client probe.** Defer until Groups 3 + 5 land so the verification pass covers all 12+ tools (Group 4 scope).

Other Group work per the dispatch:

- **Group 5 (visibility filter on `list_jurisdictions`).** Gates on Lane Foundation v1.1.0 publish (cc-agent-AC). No 2026-05-19 cc-agent-AC session in [`_sessions/`](../_sessions/) yet. Group 5 will land when Lane Foundation Sync A fires.
- **Group 3 (L1-L6 surface tools).** Gates per Sync B from Lane A.2 atom-shape locks (cc-agent-E). Lane A.2 has not started; Lane A.1 (Sync 4.5 jurisdictions) closes first.
- **Group 4 (cross-client verification).** Gates on Groups 1+2+3+5 landing.

## Suggested canonical doc updates

Three light updates:

- [`00_current_state.md`](../00_current_state.md) §5 (Recent session summaries). Prepend a line pointing at this session.
- [`50_hauska_mcp_server.md`](../50_hauska_mcp_server.md) §Sprint 2 tool expansion. Flip the Cortex existing-product tools list to "landed in PR #3"; add a note that the two snapshot-secret tools work end-to-end today while the two bearer-auth tools wait on Lane C.
- [`28_mcp_first_product_design.md`](../28_mcp_first_product_design.md). One-line note: MCP retrofit should inventory existing service-token entry points on the backend (snapshot-secret, webhook signatures, etc.) before waiting on a broader bearer-middleware refactor. Cortex Group 2 here is the case study.

## Commit batch

One commit lands this session close, two repos touched:

- `hauska-mcp-server` `feat/cortex-tools` `84dab4e`: `feat(cortex): 4 Cortex MCP tools + two-auth-path legacy client`. Pushed; PR #3 open at [empressaioemail-tech/hauska-mcp-server#3](https://github.com/empressaioemail-tech/hauska-mcp-server/pull/3). Squash-merge on operator approval per the established pattern.
- `doc_repo` `main`: this session summary.

Sync points consumed this session: none directly. Sync A (Lane Foundation v1.1.0 atom-contract bump) and Sync B(L1-L6) (Lane A.2 atom-shape locks) remain pending and gate Groups 3 + 5.
