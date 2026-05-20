---
id: 2026-05-19_mcp_tool_cross_client_cc-agent-M
title: Session — hauska-mcp-server Group 4 cross-client verification (prep / readiness; e2e gated on Lane C.4 + cutover)
date: 2026-05-19
agent: cc-agent-M
repo: hauska-mcp-server
session_type: engineering
rolled_up: false
rolled_up_into: []
related: [_dispatches/2026-05-19_cc-agent-M_mcp_tool_surfaces, _research/2026-05-19_l_surface_endpoint_contracts_cc-agent-M, _decisions/2026-05-19_sync_4_5_and_cortex_sprint, 50_hauska_mcp_server, 90_runbooks/legacy_design_tools_replit_to_cloud_run_cutover]
---

> **Dual-state hand-off.** Group 4 is the sprint-end cross-client verification gate. Its e2e portion cannot run yet: Lane C.4 (the legacy-design-tools L1-L6 endpoints + UI) has not closed and the Replit to Cloud Run cutover has not executed. This session ships the prep that has no such dependency and leaves a runbook for the e2e pass. When Lane C.4 closes and the cutover lands, Group 4 e2e fires against production per the runbook below; this summary is the canonical readiness record for the operator's Stage 9 input.

## What was done

Group 4 prep on the unblocked surface. cc-agent-M wound down after Group 3 close (PR #11 L6 merged, `eb6a1d7`, all 24 L-surface MCP tools plus 8 Codex/Cortex existing-product tools plus the Group 5 `list_jurisdictions` filter live on `origin/main`). This session fired Group 4 and found its e2e scope gated, so it executed the three Group 4 items that do not depend on a live legacy backend:

1. **Cross-mirror diff, leg 1 of 3.** Verified the MCP mirror against the engine source of truth.
2. **MCP-side contract-conformance test.** Built the sibling of cc-agent-C's Lane C.4 conformance test. Shipped as PR #12.
3. **Auth-tier wiring review.** Static review of the per-product gate across all 32 product-scoped tools.

The remaining Group 4 scope (e2e multi-tool flow, three-client round-trips, cross-mirror legs 2 and 3, DID-through-the-stack, L4 union round-trip across clients, L5/L6 latency budgets) is gated and captured in the runbook section.

## Group 4 is gated — Lane C.4 not closed, cutover not done

The original dispatch and the Group 4 addendum both assume Lane C.4 has closed. It has not. Verified against canonical signals:

- No cc-agent-C Lane C.4 session exists in `_sessions/`. The dispatch named one to read first; it is not present.
- `legacy-design-tools` HEAD is on `docs/c2-3-4-5-research-drafts` (`ac42611`). cc-agent-C has shipped Lane C.1 and Lane C.2 (Replit-decouple + cutover-prep, PRs #34 to #38 plus the C.2.3/C.2.4/C.2.5 research drafts). Lane C.3 (EngagementDetail split) and Lane C.4 (the L1-L6 endpoints + UI) are not in the repo.
- `legacy-design-tools/lib/atoms-l-surface/` does not exist. That is cc-agent-C's mirror, the third leg of the cross-mirror diff.
- No L-surface routes exist on the legacy backend. Every L1-L6 endpoint the MCP tools call is still MCP-first contract only.
- The cutover has not executed. Stage 0 of the cutover runbook hard-gates on Lane C.4 closed, so `cortex.empressa.io` on Cloud Run is not the live target. legacy-design-tools production is still Replit autoscale.

Consequence: every Group 4 item that needs a live legacy backend or live MCP clients against one is blocked. That is the e2e multi-tool flow, the three-client round-trips, the bearer-token middleware e2e check, the DID-through-the-stack verification, the L4 discriminated-union cross-client round-trip, the L5/L6 latency budgets, and cross-mirror diff legs 2 and 3.

This is a status report, not a reversal trigger. Group 4 was always sequenced last and always depended on Lane C.4. The prep below removes everything from the critical path that does not need the backend, so the e2e pass is short once C.4 and the cutover land.

## Cross-mirror diff — leg 1 of 3 (clean)

Sprint Amendment 7 created three mirrors of the L-surface atom schema: engine source, the MCP mirror (`hauska-mcp-server/src/legacy-client.ts`), and the legacy mirror (`legacy-design-tools/lib/atoms-l-surface/`). Group 4 is the first point all three meet. This session verified the one leg that does not depend on cc-agent-C's mirror existing.

hauska-engine is at exactly SHA `7ed915c` on `main` (atoms package `0.6.0`, the L6 `deliverable-letter-render` shape). That is the pin the dispatch expects; no re-mirror bump beyond it.

The MCP mirror in `legacy-client.ts` was diffed field-for-field against `hauska-engine/packages/atoms/src/instances.ts` at `7ed915c` for all six L-surface atom shapes (response-task, sheet-content-extraction, attached-document, deliverable-letter, detail-callout-spec, product-spec-reference, deliverable-letter-render). **Result: clean. No field-shape, enum-value, or required-vs-optional drift.**

One intentional looseness, not a drift: the MCP mirror types `accessPolicy` as `string` and the L4 `spec` as an opaque `Record<string, unknown>`, where the engine uses the four-value `AccessPolicy` union and a discriminated union. Both are deliberate MCP-client-ergonomics calls documented in `legacy-client.ts` and in the Group 3 L4 session. The new Zod schema file validates against the tighter canonical contract, so the looseness in the TS types does not weaken conformance coverage.

Legs 2 and 3 (engine to legacy mirror, MCP mirror to legacy mirror) are deferred to the Group 4 e2e pass because `legacy-design-tools/lib/atoms-l-surface/` does not exist yet. Runbook step below.

## Contract-conformance test — MCP side (PR #12)

Per Group 4 addendum item 5 and the operator's confirmation to add runtime Zod schemas. Two files, shipped as [hauska-mcp-server#12](https://github.com/empressaioemail-tech/hauska-mcp-server/pull/12), branch `feat/group-4-prep-contract-conformance`, commit `0190e1e`.

- `src/legacy-schemas.ts` — runtime Zod schemas for the six L1-L6 atom shapes. `legacy-client.ts` carries the MCP mirror as compile-time TS interfaces only; this file carries the same shapes as runtime schemas so the contract can be validated against JSON. Header-pinned to `@hauska-engine/atoms@0.6.0` (SHA `7ed915c`) per the Amendment 7 mirror convention. The schemas are faithful to the canonical engine contract: the L4 discriminated union, the ESR-number regex, the deliverable-letter DID regex, the four-value `accessPolicy` enum.
- `tests/legacy-contract-conformance.test.ts` — the MCP-side sibling of cc-agent-C's Lane C.4 conformance test. Parses representative JSON-round-tripped atom payloads (the L-surface endpoint response shapes per the contract doc) against the schemas. Contract drift between the MCP mirror and the engine source surfaces in CI, not at runtime. 32 cases: representative-atom conformance and negative cases per surface, all four L4 discriminated-union arms, and the `did:hauska:` provenance shape on the L6 render atom.

Tests 186/186 pass (154 prior plus 32 new). `tsc --noEmit` clean.

Note for the re-mirror discipline: there are now two MCP-side artifacts pinned to `7ed915c`, the TS interfaces in `legacy-client.ts` and the Zod schemas in `legacy-schemas.ts`. Both file headers cross-reference each other. An engine atoms version bump re-mirrors both in one pass.

## Auth-tier wiring review

Per Group 4 item 1. Static review of `auth.ts`, `products.ts`, `tiers.ts`, `tools.ts`. No code change needed; the wiring is correct for v1. Findings:

The product axis (`public | codex | cortex`) is orthogonal to the tier axis (`free | developer_pro | team | embedder`, which governs rate-limit bands only). A key carries both. Every Codex, Cortex, and L-surface tool calls `requireProduct(tool, expected)` against the caller's product, resolved from the API key via migration 002. Cross-product calls are denied with a clean 4xx envelope; the Group 2 session confirmed both directions are tested.

"Auth required" holds transitively. A free-anonymous caller (no key) resolves to product `public` in `auth.ts`. The product gate therefore blocks anonymous callers from every `codex_*` and `cortex_*` tool, because `public` never equals `codex` or `cortex`. There is no separate "is authenticated" assertion, and none is needed. The five public catalog tools carry no product gate and remain callable by free-anonymous callers; `list_jurisdictions` additionally applies the Group 5 visibility filter.

One thing the operator should know, carried from the Group 5 session and confirmed here: "Layer 2 paid" is enforced by the product binding on the key, not by a runtime tier-value check. A key bound to product `codex` reaches the Codex tools regardless of its tier band; tier governs only how many calls per day. This is correct for v1 (a Codex or Cortex key is a paid-product key by how it is minted), but it means there is no code path that rejects a call for being "unpaid" independent of the product binding. If billing ever needs a paid-vs-free assertion inside a product, that is a new check. Not in scope here; flagged for the planner alongside the Group 5 free-tier-sees-platform-internal flag, which is the same shape of concern on the visibility axis.

## Group 4 runbook — what fires when Lane C.4 + cutover land

This is the canonical e2e checklist for the operator's Stage 9. Each item names its gate. Target environment: production (`cortex.empressa.io` on Cloud Run) if the cutover has executed; staging Cloud Run revision if Lane C.4 has closed but the cutover has not. Do not run Group 4 e2e against Replit production.

Preconditions before any e2e item:
- Lane C.4 closed: L1-L6 legacy routes live, matching the contract at `_research/2026-05-19_l_surface_endpoint_contracts_cc-agent-M.md`.
- The legacy bearer-token / service-token middleware exists. The Codex tools and the Cortex bearer-auth tools (`cortex_bim_model_query`, `cortex_briefing_emit`) cannot round-trip without it. The two snapshot-secret Cortex tools (`cortex_snapshot_register`, `cortex_ifc_ingest`) work today. This middleware is a Lane C coordination item flagged since Group 1.
- `cc-agent-C` Lane C.4 close session exists, naming the engine SHA its `lib/atoms-l-surface/` mirror was pinned to.

E2e items, each gated on the preconditions:

1. **Cross-mirror diff legs 2 and 3.** Pull `legacy-design-tools/lib/atoms-l-surface/`. Diff against `legacy-client.ts` and against engine `instances.ts`. Confirm cc-agent-C pinned to `7ed915c` or, if a re-mirror happened, capture the bump pointer. Flag any field-shape, enum, or required-vs-optional drift to the planner before ratifying. Leg 1 is already verified clean (above).
2. **Auth-tier e2e.** Confirm a Codex-product key reaches Codex tools and is denied on Cortex tools, and the reverse, against the live backend. Static review done; e2e confirms the key store and middleware agree.
3. **Three-client round-trips.** MCP Inspector, Claude Desktop, Cursor MCP client. All 32 product tools plus the 5 public tools: tool callable, request schema validates, response matches schema.
4. **End-to-end multi-tool flow** on a fixture engagement (Musgrave): `cortex/snapshot_ingest` then `cortex/briefing_emit` then `codex/finding_generation` then `codex/override_write` then `cortex/deliverable_letter_render`.
5. **`did:hauska:` DID verification, one test per L1-L6.** L-surface atoms ship real `did:hauska:` DIDs via the engine `lSurfaceProvenance` helper, not the synthetic `legacy:` identifiers of Groups 1 and 2. Verify a real DID travels engine to legacy endpoint to MCP tool to MCP client intact. The conformance test already enforces the `did:hauska:deliverable-letter:` shape on the L6 render atom's `sourceLetterRef`; the e2e check confirms the real value, not just the shape.
6. **L4 discriminated-union round-trip across clients.** `cortex/detail_callout_spec_*` carry the opaque `spec` payload. The conformance test validates all four arms statically; the e2e check confirms each MCP client handles the union on request and response serialization without flattening or stringifying it.
7. **L5/L6 synchronous latency budget.** `cortex/product_spec_reference_refresh` (ICC-ES fetch) and `cortex/deliverable_letter_render` (DOCX generation) are synchronous. Document each client's tool-call timeout shape and whether real render latency fits. If render routinely exceeds about 30s, the documented follow-on is an async poll shape; surface to the planner.
8. **IFC import deferred-bug gate.** `cortex/ifc_ingest` rides the known IFC import carry-over. Verify behavior post-cutover per the cutover runbook Probe 6. Do not gate the tool's status on bug resolution.
9. **`50_hauska_mcp_server.md` divergence pass.** After e2e, reconcile the §Sprint 2 tool expansion catalog with what actually round-trips. Nothing has diverged in the tool surface as of this session; the pass is a post-e2e confirmation.

## What is still open

- Group 4 e2e, all nine runbook items, gated on Lane C.4 close plus the legacy bearer middleware plus (for production target) the cutover.
- The legacy bearer-token middleware. Open since Group 1. Codex tools and the two Cortex bearer tools cannot e2e without it.
- Cross-mirror legs 2 and 3, gated on `legacy-design-tools/lib/atoms-l-surface/` existing.
- PR #12 awaits operator review and merge. On merge, the MCP-side contract-conformance test is in CI.
- Planner-review flag: "Layer 2 paid" is enforced via product binding, not a runtime tier check (this session), alongside the Group 5 free-tier-sees-platform-internal flag. Same shape, both worth a look before public-tier signups go live. Neither is urgent.

## Suggested canonical doc updates

- `00_current_state.md` §5 — prepend this session. §6 watch list — note Group 4 e2e gated on Lane C.4 (not yet closed) plus the cutover; Group 4 prep (contract-conformance test, mirror-diff leg 1, auth review) done.
- `50_hauska_mcp_server.md` §Sprint 2 tool expansion — no divergence to record yet; the divergence pass is post-e2e. Optionally note the MCP-side contract-conformance test as shipped.
- `_research/2026-05-19_l_surface_endpoint_contracts_cc-agent-M.md` — no change; the contract is final and unchanged. The conformance test now enforces it MCP-side.

## Commit batch

- `hauska-mcp-server` `feat/group-4-prep-contract-conformance` `0190e1e` → PR #12. Two new files: `src/legacy-schemas.ts`, `tests/legacy-contract-conformance.test.ts`.
- `doc_repo` — this session summary. Written by cc-agent-M; awaits the planner's commit batch (cc-agent-M does not run git operations in the doc_repo working tree per the workspace-hygiene rule).

Group 4 status: prep complete; e2e gated on Lane C.4 close and the cutover. Re-fire Group 4 e2e per the runbook above once cc-agent-C closes Lane C.4.
