---
id: 2026-05-20_amendment_8_followon_cc-agent-M
title: Session — hauska-mcp-server Amendment 8 follow-on (L3/L6 read + download MCP tools)
date: 2026-05-20
agent: cc-agent-M
repo: hauska-mcp-server
session_type: engineering
rolled_up: false
rolled_up_into: []
related: [_dispatches/2026-05-19_cc-agent-M_mcp_tool_surfaces, _research/2026-05-19_l_surface_endpoint_contracts_cc-agent-M, _decisions/2026-05-19_sync_4_5_and_cortex_sprint, _sessions/2026-05-19_mcp_tool_cross_client_cc-agent-M, 50_hauska_mcp_server]
---

## What was done

Sprint Amendment 8 follow-on. cc-agent-C closed Lane C.4 on 2026-05-20 (legacy-design-tools PR #46 L1 + PR #51 L2-L6 consolidated, both merged to `main`). PR #51 added three read endpoints beyond the original write-path-only L3/L6 contract; its "open item 1" explicitly asks cc-agent-M to grow matching `legacy-client.ts` methods. Amendment 8 ratified the additions in-scope. This session matched them on the MCP surface.

Three new MCP tools, all bearer-auth, tenant-scoped, `cortex` product gate. Shipped as [hauska-mcp-server#13](https://github.com/empressaioemail-tech/hauska-mcp-server/pull/13), branch `feat/amendment-8-l3-l6-read-tools`, commit `58a834b`.

| Tool | Method | Legacy endpoint |
|---|---|---|
| `cortex_deliverable_letter_list` | GET | `/api/engagements/:id/deliverable-letters` (optional `?status`) |
| `cortex_deliverable_letter_fetch` | GET | `/api/deliverable-letters/:id` |
| `cortex_deliverable_letter_render_download` | GET | `/api/deliverable-letter-renders/:id/file` (byte-serve) |

200/200 tests pass (186 prior plus 14 new: 5 envelope-conformance, 5 L3 client wire, 4 L6 binary-download wire). `tsc --noEmit` clean.

## Design calls

**Binary download as an MCP embedded resource.** The byte-serve endpoint returns the file itself, not a JSON envelope. A new `legacyFetchBinary` helper in `legacy-client.ts` reads `arrayBuffer()` and lifts `Content-Type` / `Content-Disposition` off the response headers; `downloadDeliverableLetterRender` parses the filename (both the plain `filename="..."` and RFC-5987 `filename*=` forms) and falls back to `<renderId>.<ext>` when the header is absent. The `cortex_deliverable_letter_render_download` tool returns the file as an MCP embedded `resource` content block (base64 blob plus `mimeType`) alongside a text metadata summary. This is the MCP-native shape for a downloadable binary; for v1 the L6 DOCX is minimal OOXML (small files per PR #51 note 6), so inline base64 is acceptable. If render sizes grow, the follow-on is a `resource_link` to a signed URL rather than an inline blob.

**No new atom schema, only envelope schemas.** The two JSON endpoints return existing `DeliverableLetterAtomInstance` shapes inside new wrappers (`{ deliverableLetters: [...] }`, `{ deliverableLetter: {...} }`). `legacy-schemas.ts` gained `DELIVERABLE_LETTER_LIST_RESPONSE_SCHEMA` and `DELIVERABLE_LETTER_FETCH_RESPONSE_SCHEMA` wrapping the existing `DELIVERABLE_LETTER_SCHEMA`. The byte-serve endpoint has no JSON envelope and gets no schema; its wire behavior is covered by the legacy-client binary-fetch tests.

## Amendment 8 item 2 — BaseAtomInstance fields: no-op, verified

Amendment 8 item 2 codifies that every L-atom instance carries `sourceAdapter` / `sourceUrl` / `contentHash` / `fetchedAt`. The dispatch flagged this as "likely an additive field bump on the existing shapes." It was not. Those four fields are part of the engine `BaseAtomInstance`, and `legacy-client.ts` (the TS interfaces) plus `legacy-schemas.ts` (the Zod schemas, PR #12) have carried all four on every L1-L6 shape since they were first mirrored. Verified field-for-field again this session. No bump needed; the mirrors already conform.

## Engine pin and contract-drift check

hauska-engine is still at SHA `7ed915c` on `main` (atoms `0.6.0`). No re-mirror bump. The `legacy-schemas.ts` header pin stays `7ed915c`.

Per the Amendments 6/7/8 surface-drift-before-locking discipline, the PR #51 implemented endpoints were checked against the post-Amendment-8 contract doc. The three endpoints match the contract as written: request paths, the `?status` query param, the JSON envelopes, and the byte-serve `Content-Type` / `Content-Disposition` behavior. No drift to surface.

One minor doc-precision observation, not drift and not blocking: the contract doc lists `404 deliverable_letter_not_found` for "all L6 routes," but a 404 from the render-download route (keyed on `:renderId`) would more naturally read `render_not_found`. The MCP tool surfaces the legacy 4xx body opaquely, so behavior is unaffected whichever string the backend returns. Flagging for the planner to tidy the contract doc wording if desired.

## Stacking note

PR #13 stacks on PR #12 (`feat/group-4-prep-contract-conformance`, the Group 4 prep contract-conformance test). PR #12 is still open and unmerged, and `legacy-schemas.ts` plus the conformance test that PR #13 extends both ship in PR #12. PR #13's base is set to the PR #12 branch so its diff is clean. Merge order: PR #12 first, then PR #13 retargets to `main`.

## What is still open

- PR #12 and PR #13 await operator review and merge, in that order.
- Group 4 e2e — the sprint-end cross-client verification gate. With Lane C.4 closed and these three tools landing, Group 4 e2e is now gated only on the Replit-to-Cloud-Run cutover. Re-fire per the 9-item runbook in `_sessions/2026-05-19_mcp_tool_cross_client_cc-agent-M.md`. Two cutover preconditions from Amendment 8 carry into that runbook: `SERVICE_API_KEY` on Cloud Run must equal the MCP server's `LEGACY_BACKEND_API_KEY` or the bearer path fails, and `ICC_ES_REPORT_URL_TEMPLATE` must be set for the L5 refresh path.
- Cross-mirror diff legs 2 and 3 (against `legacy-design-tools/lib/atoms-l-surface/`) are now unblocked — that mirror exists post-Lane-C.4. They fold into the Group 4 e2e pass.
- The MCP tool count is now 35 product-gated tools (8 Codex/Cortex existing-product plus 24 original L-surface plus these 3), plus the 5 public catalog tools.

## Suggested canonical doc updates

- `00_current_state.md` §5 — prepend this session. §6 — note Lane C.4 closed 2026-05-20; the three Amendment 8 follow-on MCP tools shipped (PR #13); Group 4 e2e now gated only on the cutover.
- `50_hauska_mcp_server.md` §Sprint 2 tool expansion — add the three L3/L6 read tools to the catalog. The post-e2e divergence pass still happens after Group 4.
- `_research/2026-05-19_l_surface_endpoint_contracts_cc-agent-M.md` — optional precision tidy: the L6 download 404 error string (see contract-drift check above). No functional change.

## Commit batch

- `hauska-mcp-server` `feat/amendment-8-l3-l6-read-tools` `58a834b` → PR #13 (stacked on PR #12). Six files: `src/legacy-client.ts`, `src/legacy-schemas.ts`, `src/tools.ts`, `tests/legacy-contract-conformance.test.ts`, `tests/cortex-deliverable-letter.test.ts`, `tests/cortex-deliverable-letter-render.test.ts`.
- `doc_repo` — this session summary. Written by cc-agent-M; awaits the planner's commit batch (cc-agent-M does not run git operations in the doc_repo working tree per the workspace-hygiene rule).

Amendment 8 follow-on complete. Group 4 e2e fires per the existing 9-item runbook once the cutover executes.
