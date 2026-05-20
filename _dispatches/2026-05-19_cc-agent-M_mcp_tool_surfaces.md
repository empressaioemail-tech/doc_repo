---
id: 2026-05-19_cc-agent-M_mcp_tool_surfaces
title: Dispatch — cc-agent-M hauska-mcp-server (L1-L6 + Codex + Cortex MCP tool surfaces)
date: 2026-05-19
agent: cc-agent-M
repo: hauska-mcp-server
kind: dispatch
related: [_decisions/2026-05-19_sync_4_5_and_cortex_sprint, 50_hauska_mcp_server, 28_mcp_first_product_design, 42_design_accelerator_program_plan, 48_codex_program_plan, 29_mcp_surface_tier_model, CLAUDE.md]
---

# Lane B — cc-agent-M dispatch (Cortex + Codex + L1-L6 MCP tool surfaces)

You are cc-agent-M owning the `hauska-mcp-server` repo. This dispatch covers all MCP tool surface work for the 2026-05-19 sprint: 6 L-surface tools (gated on Lane A.2 atom-shape locks), 4 Codex existing-product tools, 4 Cortex existing-product tools. 14 tools total.

Per the dual-interface commitment in CLAUDE.md and `28_mcp_first_product_design.md`, Codex and Cortex are existing UI-first products getting MCP retrofit. This sprint folds MCP co-design into the L1-L6 stream rather than treating retrofit as a separate later phase — stronger than the minimum policy.

## Why this exists

The operator's next QA cycle is expected to flow through MCP-driven agent workflows. Without MCP tool surfaces for Codex and Cortex, QA exercises only the UI; with them, QA exercises both surfaces and proves dual-interface coherence.

The 4 Codex + 4 Cortex existing-product tools wrap existing legacy-design-tools capabilities. They are parallel-safe with Lane A.2 atom-shape work — they consume existing atoms.

The 6 L-surface tools wrap NEW capabilities landing in Lane A.2 + Lane C.4 in parallel. Each L-surface tool is gated on its matching Lane A.2 atom-shape lock (Sync B per surface).

## Read first

In order:

1. [`CLAUDE.md`](../CLAUDE.md) — operating instructions.
2. [`_decisions/2026-05-19_sync_4_5_and_cortex_sprint.md`](../_decisions/2026-05-19_sync_4_5_and_cortex_sprint.md) — sprint scope.
3. [`50_hauska_mcp_server.md`](../50_hauska_mcp_server.md) — existing tool catalog (5 v1 tools); §Sprint 2 tool expansion (added this sprint) — the catalog you extend.
4. [`28_mcp_first_product_design.md`](../28_mcp_first_product_design.md) §Product-by-product status — Codex + Cortex tracked-retrofit confirmation.
5. [`29_mcp_surface_tier_model.md`](../29_mcp_surface_tier_model.md) — within-vs-cross-tenant tier model. Codex and Cortex tools are per-product, not Hauska MCP Server public catalog tools — different tier framing.
6. [`42_design_accelerator_program_plan.md`](../42_design_accelerator_program_plan.md) §QA readiness milestone (L1-L6 definitions) — what each Cortex tool wraps.
7. [`48_codex_program_plan.md`](../48_codex_program_plan.md) §QA readiness milestone — what each Codex tool wraps.
8. Your prior session at [`_sessions/2026-05-19_stream_2a_wiring_cc-agent-M.md`](../_sessions/2026-05-19_stream_2a_wiring_cc-agent-M.md) — Stream 2A wiring against real Sync 3 retrieval API; pattern reference for new tool wiring.
9. cc-agent-E's L-surface atom-shape dispatch [`2026-05-19_cc-agent-E_l_surface_atom_shapes.md`](2026-05-19_cc-agent-E_l_surface_atom_shapes.md) — atoms you consume.

## Scope

Three groups of tools. Group 1 (Codex existing) and Group 2 (Cortex existing) can start immediately — they wrap existing capabilities. Group 3 (L-surface) gates per atom-shape lock from Lane A.2.

### Group 1 — Codex existing-product MCP tools

These wrap existing Codex 1b reviewer-side capabilities. Surface on the `hauska-mcp-server` instance under a `codex/*` tool namespace prefix (operator decision: separate server vs co-tenanted; co-tenanted is cleaner for v1, easier to manage operationally).

**B.2.1 — `codex/finding_generation`.** Triggers engine full-pass mode against a submission; emits findings as atoms; returns finding atom IDs plus summary. Wraps existing plan-review `routes/findings.ts` POST endpoint. Tier: Layer 2 paid (engine reasoning); auth required.

**B.2.2 — `codex/override_write`.** Writes an adjudication-state atom against a finding (accept / edit / reject + reviewer rationale). Wraps existing override endpoint at `routes/findings.ts`. Tier: Layer 2 paid; auth required. Note carry-over follow-on from PR #20 close-out — server's 409 `finding_already_overridden` envelope doesn't carry `resolvedBy`/`resolvedAt` so cross-tab race attribution is partial. Surface this in the tool's error-handling docs but don't fix it here (out of this dispatch's scope).

**B.2.3 — `codex/briefing_fetch`.** Returns a briefing atom for a given engagement. Wraps existing briefing-fetch endpoint. Tier: Layer 2 paid; auth required.

**B.2.4 — `codex/snapshot_ingest`.** Accepts a snapshot artifact (PDF + metadata) and triggers the ingest pipeline. Wraps existing snapshot-ingest endpoint. Tier: Layer 2 paid; auth required.

### Group 2 — Cortex existing-product MCP tools

These wrap existing Cortex (formerly Design Accelerator) capabilities. Surface under a `cortex/*` namespace.

**B.3.1 — `cortex/ifc_ingest`.** Accepts an IFC file; triggers ingest at `lib/ifcIngest.ts`; emits a `bim-model` atom symmetric with Push-to-Revit. Tier: Layer 2 paid; auth required. **Note:** IFC import has a known carry-over bug per the sprint decision record — verify behavior at Stage 9 against Cloud Run + new Neon; do not gate this tool's ship on bug resolution.

**B.3.2 — `cortex/bim_model_query`.** Queries a `bim-model` atom for downstream consumers: materializable-element list, glTF bundle ref, ingest metadata. Tier: Layer 2 paid; auth required.

**B.3.3 — `cortex/snapshot_register`.** Registers a snapshot (a versioned design state) against an engagement. Wraps existing snapshot endpoint. Tier: Layer 2 paid; auth required.

**B.3.4 — `cortex/briefing_emit`.** Generates a parcel briefing for a given engagement (DA-side: parcel + jurisdiction + 3DEP + neighboring context). Wraps existing briefing-generation endpoint. Tier: Layer 2 paid; auth required.

### Group 3 — L1-L6 surface MCP tools

Each gates on Sync B from Lane A.2 for that surface.

**B.1.1 — `cortex/response_task_*` (L1 surface tools).** Tools for response-task atom lifecycle: create, update state, list per engagement, link to finding. Atom-shape from Lane A.2 Phase A.

**B.1.2 — `cortex/sheet_content_extraction_*` (L2 surface tools).** Tools to trigger sheet extraction, fetch extracted content, list attached documents. Atom-shape from Lane A.2 Phase B.

**B.1.3 — `cortex/deliverable_letter_*` (L3 surface tools).** Tools to draft, update, finalize a deliverable letter. Atom-shape from Lane A.2 Phase C.

**B.1.4 — `cortex/detail_callout_spec_*` (L4 surface tools).** Tools to define a detail callout spec, list per engagement, mark push-status. Atom-shape from Lane A.2 Phase D.

**B.1.5 — `cortex/product_spec_reference_*` (L5 surface tools).** Tools to add a product-spec reference, refresh ESR status, list per engagement. Atom-shape from Lane A.2 Phase E.

**B.1.6 — `cortex/deliverable_letter_render` (L6 tool).** Tool to render a deliverable-letter atom into DOCX/PDF; returns blob URL or inline blob ref. Whether new atom-side fields needed per Lane A.2 Phase F determines tool shape.

### Group 4 — Auth + cross-client integration verification

After all 14 tools land:

- Verify auth wiring covers per-product tier checks (Codex tools require Codex-tier API key; Cortex tools require Cortex-tier API key; shared Hauska MCP key works for the existing 5 public tools per the current model).
- Test against MCP Inspector + Claude Desktop + Cursor MCP client. Capture a session of cross-client testing in `_sessions/<date>_mcp_tool_cross_client_cc-agent-M.md`.
- Update `50_hauska_mcp_server.md` §Sprint 2 tool expansion if it diverges from what landed.

### Group 5 — Filter visibility on `list_jurisdictions`

This is a small follow-on but lives in Lane B because it's an MCP tool change.

Per Lane Foundation (cc-agent-AC v1.1.0): the `jurisdiction-corpus` atom now carries a visibility partition. `list_jurisdictions` MCP tool must filter to public-tier jurisdictions for unauthenticated callers; show all for platform-internal callers. Whether the partition lives in a new `visibility` field or in the existing ADR-017 `accessPolicy` field depends on cc-agent-AC's v1.1.0 shape choice — read their session summary and honor it.

Test: unauthenticated call returns Bastrop UDC + Grand County (the public-tier corpora as of Sync 4.5); platform-internal call returns all four Sync 4.5 jurisdictions plus Grand County.

## Test plan

Per-tool:

1. MCP Inspector round-trip: tool callable, schema validates request, response matches schema.
2. Auth check: unauthenticated call fails per tier; authenticated call succeeds.
3. Real backend wiring: tool round-trips through real legacy-design-tools endpoint (for Codex + Cortex existing-product tools) or hauska-engine retrieval API (for L-surface tools).
4. Error handling: 404 / 409 / 500 cases return clean MCP error envelopes.

Cross-tool (Group 4 verification):

5. End-to-end flow exercising multiple tools: e.g., `cortex/snapshot_ingest` → `cortex/briefing_emit` → `codex/finding_generation` → `codex/override_write` → `cortex/deliverable_letter_render` on a small fixture engagement.
6. Cross-client compatibility: same flow runs from MCP Inspector, Claude Desktop, Cursor's MCP client.

Group 5:

7. `list_jurisdictions` filter test as named above.

## Dependencies

- **Gates this dispatch:**
  - Groups 1 + 2 + 5 can start immediately (Sync A + existing Codex/Cortex backends already wired).
  - Group 3 per-tool gates on matching Sync B from Lane A.2.
  - Group 4 gates on all of Groups 1, 2, 3 landing.
- **Parallel-safe with:** all of Lane A and Lane C.
- **Cutover dependency:** Group 4 verification should target the production deployment surface (Cloud Run, not Replit) — but you can do staging-environment verification mid-flight and re-verify post-cutover. Coordinate with Lane C.6 (cutover gate).

## Hand-off

Each Group fires a session summary. Group 4 verification produces the canonical "MCP tool surfaces live and addressable" hand-off to the operator for Stage 9 verification.

Note: the Codex/Cortex tool count and naming are first-pass framings from the operator's sprint scope. If during implementation you find that the four operator-named tools per product don't cleanly map to existing endpoints (e.g., `cortex/briefing_emit` actually requires two tools because the briefing flow is multi-step), surface the proposed adjustment in your session summary and let the planner ratify before locking the v1 tool surface. Tool surface is contract-grade — easier to add than to rename.

## Group 4 addendum (2026-05-19 post-Amendment-7)

> Added after cc-agent-C's first-contact recon on Lane C.4 exposed structural questions the original Group 4 scope didn't anticipate. Captured here so cc-agent-M doesn't re-litigate when Group 4 fires.

**Read Sprint Amendment 7 before firing Group 4.** [`_decisions/2026-05-19_sync_4_5_and_cortex_sprint.md`](../_decisions/2026-05-19_sync_4_5_and_cortex_sprint.md) §Sprint amendments. Path A locked: `legacy-design-tools` mirrors the 7 L-atom Zod schemas verbatim from `hauska-engine/packages/atoms/src/instances.ts` into `lib/atoms-l-surface/` (or sibling per cc-agent-C's final placement) with header pinning + contract-conformance test. `@hauska-engine/atoms` stays workspace-private; the endpoint contract doc at [`_research/2026-05-19_l_surface_endpoint_contracts_cc-agent-M.md`](../_research/2026-05-19_l_surface_endpoint_contracts_cc-agent-M.md) is the canonical cross-repo seam.

**The consumer landscape is now three mirrors.** When you fire Group 4, three places carry copies of the L-surface atom shape:

1. **Engine source of truth** — `P:/hauska-engine/packages/atoms/src/instances.ts` at `@hauska-engine/atoms@0.6.0` (SHA `7ed915c`).
2. **MCP mirror** — your own `hauska-mcp-server/src/legacy-client.ts`, mocked-fetch tested during Group 3.
3. **Legacy-design-tools mirror** — `legacy-design-tools/lib/atoms-l-surface/`, shipped during Lane C.4 by cc-agent-C.

Group 4 is the first moment these three mirrors meet real endpoints + real clients. Drift between any pair surfaces here, not earlier.

**Added Group 4 scope** (supplements the original Group 4 list above; does not replace it):

- **Cross-mirror diff.** Pull cc-agent-C's `legacy-design-tools/lib/atoms-l-surface/` mirror; diff against your `legacy-client.ts`; verify both match engine source at v0.6.0 SHA `7ed915c` (or later if cc-agent-C re-mirrored against a bump — capture that bump pointer in your session summary). Flag any field-shape, enum-value, or required-vs-optional drift to the planner BEFORE ratifying. Per Amendment 7's surface-drift-to-planner rule.
- **Contract-conformance test on the MCP side.** Add a sibling of cc-agent-C's pattern: parse representative JSON examples from the endpoint contract doc against `legacy-client.ts` schemas. Drift surfaces in CI, not runtime. cc-agent-C ships the legacy-design-tools side; you ship the MCP-side parallel.
- **`did:hauska:` DID verification for L-surface atoms.** Per Amendment 6, L-surface atoms get real `did:hauska:` DIDs via the new `lSurfaceProvenance` helper — different from Groups 1+2's synthetic `legacy:` identifiers. Verify end-to-end through your tool layer: engine emits a real DID → cc-agent-C's endpoint returns it → your MCP tool serializes through → MCP client receives a `did:hauska:` string. Worth one discrete test per surface (L1 through L6).
- **L4 discriminated-union round-trip across MCP clients.** Per your own Group 3 close-out flag: `cortex/detail_callout_spec_*` tools carry the opaque `spec` payload as a `z.discriminatedUnion` keyed on `detailType`. Verify each MCP client (Inspector + Desktop + Cursor) handles the union shape on round-trip — request and response serialization both. Capture any client that flattens or stringifies the union.
- **Latency budget verification on synchronous L5/L6 calls.** Per your own Group 3 close-out flag: `cortex/product_spec_reference_refresh` (L5) and `cortex/deliverable_letter_render` (L6) are synchronous — verify each MCP client's tool-call timeout budget accommodates real-world latency (DOCX render in particular can be slow). MCP Inspector + Claude Desktop + Cursor each have different timeout shapes; document the observed limits.

The original Group 4 scope (auth-tier wiring, MCP Inspector round-trips, end-to-end multi-tool flow on a fixture engagement, `50_hauska_mcp_server.md` divergence pass) stays intact — the addendum supplements rather than replaces.
