---
id: 2026-05-19_codex_tools_lane_b_group_1_cc-agent-M
title: Session — hauska-mcp-server Lane B Group 1 (4 Codex tools + product dimension on api_keys)
date: 2026-05-19
agent: cc-agent-M
repo: hauska-mcp-server
session_type: engineering
rolled_up: false
rolled_up_into: []
---

## What was done

Lane B Group 1 of the 2026-05-19 Cortex/Codex sprint per [`_dispatches/2026-05-19_cc-agent-M_mcp_tool_surfaces.md`](../_dispatches/2026-05-19_cc-agent-M_mcp_tool_surfaces.md). Four Codex (plan-review) MCP tools wrapping legacy-design-tools api-server endpoints, plus the auth shape needed to gate them. Shipped on feature branch `feat/codex-tools`; PR open at [empressaioemail-tech/hauska-mcp-server#2](https://github.com/empressaioemail-tech/hauska-mcp-server/pull/2). Single commit `6bd3ffe` on top of PR #1's squash-merge `74fdd4f`.

**Four Codex tools, underscore-namespaced.**

| Tool | Method | Legacy endpoint |
|---|---|---|
| `codex_finding_generation` | POST | `/api/submissions/:submissionId/findings/generate` |
| `codex_override_write` | POST | `/api/findings/:findingId/override` |
| `codex_briefing_fetch` | GET | `/api/engagements/:id/briefing` |
| `codex_snapshot_ingest` | POST | `/api/engagements/:id/submissions` |

`codex_finding_generation` normalizes the legacy backend's 409 finding-generation-already-in-flight response into a uniform envelope with `alreadyInFlight=true` so MCP callers reason about job state without sniffing HTTP semantics. `codex_override_write` carries the PR #20 carry-over flag: the 409 `finding_already_overridden` envelope does not surface `resolvedBy` / `resolvedAt`, so cross-tab race attribution is partial; documented in the tool description so agents don't depend on those fields.

**Product dimension on api_keys.** New `product` column (`public` / `codex` / `cortex`) orthogonal to `tier`. Migration `migrations/002_api_keys_product.sql` adds the column with default `'public'` and a CHECK constraint, so existing rows backfill safely without coordinated app deploy. Pre-migration rows that lack the column also default to `'public'` at the application castRow boundary. Admin endpoints (`POST /admin/keys`, `PATCH /admin/keys/:id`) accept `product`; the field defaults to `'public'` when omitted, preserving existing operator-script semantics for substrate-tier mints. The new `requireProduct(tool, expected)` gate in [`src/tools.ts`](https://github.com/empressaioemail-tech/hauska-mcp-server/blob/feat/codex-tools/src/tools.ts) rejects mismatched-product callers with a consistent error envelope.

Dev mode (`HAUSKA_DEV_MODE=true`) honors a new `X-Hauska-Dev-Product` request header so local developers can exercise `codex_*` tools without standing up the api_keys table. Unknown / missing header defaults to `'public'`.

**legacy-client.ts.** New [`src/legacy-client.ts`](https://github.com/empressaioemail-tech/hauska-mcp-server/blob/feat/codex-tools/src/legacy-client.ts) mirrors the `hauska-client.ts` pattern: native fetch, typed errors (`LegacyHttpError`, `LegacyUnreachableError`), bearer-token auth via `LEGACY_BACKEND_API_KEY`, base URL via `LEGACY_BACKEND_URL` (default `http://localhost:5000`), 30-second per-request timeout. Wire-shape types are hand-mirrored from `legacy-design-tools/artifacts/api-server/src/routes/{findings,parcelBriefings,engagements}.ts` and `lib/api-zod/src/generated/`; the mcp-server build graph stays clean (no workspace dependency on legacy-design-tools).

**Codex envelope.** `atom-shape.ts` gains `codexEnvelope` + `codexProvenance` builders. Each Codex tool response surfaces a synthetic `legacy:<kind>:<rowId>` identifier under `atoms`, the legacy endpoint URL as `source.url`, and the standard `meta` block. Free-tier attribution rules are inherited from the existing `buildEnvelope` helper (Codex is Layer 2 paid; attribution is suppressed for paid tiers). The synthetic DID format is provisional pending the legacy atom-registry surfacing via the engine retrieval API as a downstream sync.

**Tests.** 61/61 pass: 38 existing (Stream 2A + 2B regression coverage) plus 14 new in [`tests/legacy-client.test.ts`](https://github.com/empressaioemail-tech/hauska-mcp-server/blob/feat/codex-tools/tests/legacy-client.test.ts) (wire conformance via mocked fetch, 409 normalization, bearer-token header, env-var override, unreachable-error path) plus 9 new in [`tests/codex-tools.test.ts`](https://github.com/empressaioemail-tech/hauska-mcp-server/blob/feat/codex-tools/tests/codex-tools.test.ts) (product gate semantics under various AsyncLocalStorage bindings, envelope shape, attribution rules, null-provenance tolerance). `tsc --noEmit` clean.

**Naming adjustment surfaced for planner ratification.** The dispatch named `codex_snapshot_ingest` matching its "Accepts a snapshot artifact (PDF + metadata) and triggers the ingest pipeline" intent. The legacy backend's `/snapshots` route is Cortex-side (Revit add-in model snapshots); the Codex-side analog is `/engagements/:id/submissions`, which records a plan-review submission and auto-triggers classification + finding generation downstream via `lib/autoTriggerClassificationOnSubmissionCreated.ts` and `lib/autoTriggerFindingsOnSubmissionCreated.ts`. The tool name preserves dispatch naming for downstream API stability; the endpoint wrapping is the correct Codex-side analog. Flagging here per the dispatch's "Surface adjustments via Lane B session summary; planner ratifies before lock" clause. Recommendation: keep the tool name `codex_snapshot_ingest` as is; planner update on the dispatch's B.2.4 entry to clarify the endpoint mapping.

## What was learned

Three things worth carrying forward.

**Product as an axis distinct from tier.** The current Tier enum (`free | developer_pro | team | embedder`) is the substrate-MCP four-band model. Codex and Cortex are per-product surfaces with their own buyer + per-seat tier semantics per [`29_mcp_surface_tier_model.md`](../29_mcp_surface_tier_model.md). Conflating them onto a single axis would have created a 12-way enum (free_public, pro_public, free_codex, pro_codex, etc.) that obscures the distinct buyer flows. Two orthogonal columns (`tier` + `product`) compose cleanly and match the canonical doc. The same pattern will apply to Cortex tools (Group 2) and to any future per-product MCP surface (Codex 1b, SmartCity OS).

**Backend auth shape mismatch is a real cross-repo coordination item.** The legacy-design-tools backend uses cookie-session auth via `requireReviewerAudience`. MCP-retrofit servers route through service-to-service bearer tokens. The MCP server is wired to send `Authorization: Bearer ${LEGACY_BACKEND_API_KEY}`; the legacy backend currently ignores the bearer header and requires a session cookie. End-to-end Codex tool calls against a deployed legacy backend will fail until the legacy backend grows a service-token middleware. **This is a Lane C coordination item for cc-agent-C** — the cleanest landing place is alongside the Replit decouple + Cloud Run cutover work since the auth shape is part of the infrastructure transition. Worth a one-line note in [`28_mcp_first_product_design.md`](../28_mcp_first_product_design.md) so future MCP retrofits flag this gap up front.

**Tool naming: dispatch intent vs codebase truth.** The Group 1 tools came across with names matching the dispatch author's mental model. Three of four mapped cleanly to legacy endpoints; the fourth (`codex_snapshot_ingest`) mapped to a Codex-side analog (`/engagements/:id/submissions`) because the dispatch author's "snapshot" term collides with the legacy codebase's `/snapshots` route (which is Cortex-side). Tool surface is contract-grade — easier to add than to rename. The right pattern: ship under the dispatch name, document the mapping in REPO_NOTES + session summary, flag for planner ratification before downstream consumers wire to the name. Same caution applies to the Cortex tools in Group 2.

## What's still open

Group 1 follow-ups:

- **End-to-end against a deployed legacy backend.** Gates on Lane C bearer-token middleware. Unit-test coverage (23 new tests + 38 existing) is mocked-fetch only.
- **MCP Inspector cross-client probe.** Defer until Group 2 + Group 3 land so the verification pass covers all 12 tools (Group 4 scope).

Other Group work per the dispatch:

- **Group 2 (Cortex 4 tools).** `cortex_ifc_ingest`, `cortex_bim_model_query`, `cortex_snapshot_register`, `cortex_briefing_emit`. Wraps `/api/snapshots`, `/api/bim-models`, `/api/engagements/:id/briefing/*`. Parallel-safe with this PR; can start as soon as PR #2 merges.
- **Group 5 (visibility filter on `list_jurisdictions`).** Gates on Lane Foundation v1.1.0 publish (cc-agent-AC). Not yet published as of this session close — no cc-agent-AC session in [`_sessions/`](../_sessions/) for 2026-05-19. Group 5 will land when Lane Foundation Sync A fires.
- **Group 3 (L1-L6 surface tools).** Gates per Sync B from Lane A.2 atom-shape locks (cc-agent-E). Lane A.2 has not started; Lane A.1 (Sync 4.5 jurisdictions) closes first.
- **Group 4 (cross-client verification).** Gates on Groups 1+2+3 landing.

## Suggested canonical doc updates

Three light updates:

- [`00_current_state.md`](../00_current_state.md) §5 (Recent session summaries). Prepend a line pointing at this session.
- [`50_hauska_mcp_server.md`](../50_hauska_mcp_server.md) §Sprint 2 tool expansion. The Codex tools list can flip from "to be implemented" framing to "landed in PR #2"; the `codex_snapshot_ingest` description should clarify it wraps `/engagements/:id/submissions` rather than a `/snapshots` route (the dispatch's "snapshot-ingest endpoint" framing was a Codex-vs-Cortex term collision).
- [`28_mcp_first_product_design.md`](../28_mcp_first_product_design.md). One-line note: every product MCP retrofit consuming a UI-first backend should plan for a bearer-token service-auth path on the backend side before MCP tools work end-to-end. The Codex Group 1 work surfaces this; downstream retrofits (Cortex per Group 2, SmartCity OS, Codex 1b) will hit the same gap.

## Commit batch

One commit lands this session close, two repos touched:

- `hauska-mcp-server` `feat/codex-tools` `6bd3ffe`: `feat(codex): 4 Codex MCP tools + product dimension on api_keys`. Pushed; PR #2 open at [empressaioemail-tech/hauska-mcp-server#2](https://github.com/empressaioemail-tech/hauska-mcp-server/pull/2). Squash-merge on operator approval per the established pattern.
- `doc_repo` `main`: this session summary.

Sync points consumed this session: none directly. Sync A (Lane Foundation v1.1.0 atom-contract bump) and Sync B(L1-L6) (Lane A.2 atom-shape locks) remain pending and gate Groups 3 + 5.
