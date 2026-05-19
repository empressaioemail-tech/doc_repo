---
id: 2026-05-19_cc-agent-E_l_surface_atom_shapes
title: Dispatch — cc-agent-E hauska-engine (L1-L6 atom shapes for Cortex/Codex sprint)
date: 2026-05-19
agent: cc-agent-E
repo: hauska-engine
kind: dispatch
related: [_decisions/2026-05-19_sync_4_5_and_cortex_sprint, 42_design_accelerator_program_plan, 27_engine_evolution_plan, 80_adrs/adr_001_atom_architecture, 80_adrs/adr_018_atom_contract_substrate_layer, CLAUDE.md]
---

# Lane A.2 — cc-agent-E dispatch (L1-L6 atom shapes; engine atom-registry expansion)

You are cc-agent-E. This dispatch runs after Lane A.1 (Sync 4.5 jurisdictions) closes. Scope: lock the atom shapes for the L1-L6 Cortex/Codex surfaces in `hauska-engine/packages/atoms/`. Each lock fires **Sync B** for that surface, unblocking Lane B (cc-agent-M MCP tool) and Lane C (cc-agent-C UI surface) to consume the shape in parallel.

Per option β framing from ADR-018: these atoms live in the engine atom-registry (`hauska-engine/packages/atoms/`), not the framework package (`@hauska/atom-contract`). The contract package stays framework-only; engine atoms are catalog-data atoms.

## Why this exists

L1-L6 are the Cortex/Codex surfaces gating the next QA cycle. Each surface has a primary atom type that must exist before UI and MCP work can land cleanly. Atom-shape-first ordering avoids the cross-repo merge churn lesson from the substrate v1 Bump 1 rollout — UI and MCP tool work consumes an already-locked shape rather than negotiating shape inline with code.

The L1-L6 list per `42_design_accelerator_program_plan.md` lines 62-73:

- **L1:** `response-task` atom — persistent task state for client comments / response checklists.
- **L2:** `sheet-content-extraction` atom + `attached-document` atom — sheet OCR + annotation extraction + supporting docs.
- **L3:** `deliverable-letter` atom — DOCX/PDF comment-response letter as a classified atom.
- **L4:** `detail-callout-spec` atom — Revit content push via APS Design Automation.
- **L5:** `product-spec-reference` atom — live ICC-ES verification status.
- **L6:** deliverable-letter render pipeline — produces DOCX/PDF from L3's `deliverable-letter` atom. The atom itself exists at L3; L6 is the render shape (which may or may not require atom-side fields — design call).

## Read first

In order:

1. [`CLAUDE.md`](../CLAUDE.md) — operating instructions.
2. [`_decisions/2026-05-19_sync_4_5_and_cortex_sprint.md`](../_decisions/2026-05-19_sync_4_5_and_cortex_sprint.md) — sprint scope.
3. [`42_design_accelerator_program_plan.md`](../42_design_accelerator_program_plan.md) lines 62-73 — QA readiness L1-L6 definitions; lines 113-152 Phase 2 streams DA-4 through DA-9 (your atom shapes feed these streams).
4. [`27_engine_evolution_plan.md`](../27_engine_evolution_plan.md) Stream B Bump 1 — existing 19-atom registry plus the 6 substrate atom types you already shipped.
5. [`80_adrs/adr_001_atom_architecture.md`](../80_adrs/adr_001_atom_architecture.md) — four-layer contract every atom carries.
6. [`80_adrs/adr_018_atom_contract_substrate_layer.md`](../80_adrs/adr_018_atom_contract_substrate_layer.md) — option β: catalog atoms in engine atom-registry, framework package stays clean.
7. Existing engine `packages/atoms/` (your prior bootstrap work) — pattern reference.

## Scope

Six atom-shape locks. Each follows the same shape: Zod schema, ADR-001 four-layer contract, ADR-017 accessPolicy, ADR-015 actor linking, render-mode stubs, conformance suite tests, engine atom-registry minor bump.

Sequence sub-tasks per surface; do not batch all six into one PR (that creates merge-conflict risk against UI and MCP consumers). One PR per atom shape (six PRs).

### Phase A — L1: `response-task` atom

**Purpose.** Persistent task state for client-comment response flow. Architect receives client comments → creates response tasks (`response-task` atom per L1) → tracks state (open / in-progress / done) → task state survives session reload.

**Shape questions for you to resolve:**

- Task title, description, source (client-comment atom ref), state enum, due/done timestamps.
- Link fields: which finding (if any), which engagement, which actor (architect responsible).
- State transitions: model as event chain per ADR-011 (response-task-opened, response-task-progressed, response-task-completed) or as field updates on the main atom? Recommend event-chain for audit trail symmetry with other state-bearing atoms.

**Conformance suite:** schema validation, round-trip through `register()` to `contextSummary()`, state-transition tests.

**Fires Sync B(L1).** cc-agent-M starts L1 MCP tool; cc-agent-C starts L1 UI.

### Phase B — L2: `sheet-content-extraction` + `attached-document` atoms

**Purpose.** Sheet OCR + structured annotation extraction (revision clouds, dimension callouts, schedules) + attached supporting docs. Currently the plan-review pipeline does Claude Sonnet 4.5 vision OCR on sheet images; structured-annotation extraction does not exist. L2 closes that gap by producing classified atoms downstream of OCR.

**Shape questions:**

- `sheet-content-extraction`: source-sheet-ref, extracted text segments with bounding boxes, structured-annotation list (revision-cloud, dimension, schedule-row, callout). Each annotation carries position, content, source-confidence.
- `attached-document`: source-engagement-ref, document title, document type (specification, calculation, product-data, narrative), extracted text, link to original blob.

**Two atoms in one phase** because they are coupled at the producer (sheet ingest extracts both inline in one pass).

**Conformance suite:** schema + round-trip for both; cross-reference tests (sheet → annotations, engagement → attached docs).

**Fires Sync B(L2).**

### Phase C — L3: `deliverable-letter` atom

**Purpose.** The comment-response letter as a classified atom (structured sections + per-section content + provenance to source findings / response-tasks). DOCX/PDF rendering is a downstream consumer (L6) of this atom.

**Shape questions:**

- Letter sections (cover, intro, per-comment-response, signature), structured per section type.
- Provenance links: which findings, which response-tasks, which adjudications fed each section.
- Status (draft, sent), recipient (cliennt actor), timestamps.

**Conformance suite:** schema + round-trip; provenance-chain integrity tests; section-completeness checks (required sections present).

**Fires Sync B(L3).**

### Phase D — L4: `detail-callout-spec` atom

**Purpose.** Spec for a Revit detail callout that the Revit Connector add-in consumes via APS Design Automation. Closes the Revit content push gap.

**Shape questions:**

- Detail type (door schedule, wall section, wall type, room finish), spec contents per type, source finding or response-task ref.
- Push state (pending, pushed, applied, rejected-by-user).
- APS task ref (when pushed).

**Conformance suite:** schema + round-trip; push-state transition tests.

**Fires Sync B(L4).**

### Phase E — L5: `product-spec-reference` atom

**Purpose.** Reference to a specific product spec (e.g., ICC-ES ESR-1234 for a specific connector or rated assembly). Carries live ESR status (active / withdrawn / expired). When ESR status changes upstream, the atom updates and downstream findings flag.

**Shape questions:**

- Product identifier, ICC-ES ESR number, status enum, last-verified timestamp, source URL.
- Integration mechanism for live verification — open at design time per `42` Phase 3; pick what is simplest for v1 (probably periodic re-poll against ICC-ES site, not real-time webhook).

**Conformance suite:** schema + round-trip; status-change history tests.

**Fires Sync B(L5).**

### Phase F — L6: deliverable-letter render pipeline (atom side)

**Purpose.** Define any atom-side fields the L6 DOCX/PDF render pipeline needs that are not already on the L3 `deliverable-letter` atom. Likely candidates: render-format hint (DOCX vs PDF), branding asset refs, page-break preferences. The render *implementation* is Lane B (MCP tool) + Lane C (UI) work; this dispatch handles only atom-shape additions if any.

**Decision call:** if all L6 needs are already covered by L3's `deliverable-letter` atom shape, this phase is a no-op atom-side and fires Sync B(L6) immediately. Document the decision.

**Conformance suite:** if any fields added, schema + round-trip; if no-op, document why.

**Fires Sync B(L6).**

### Phase G — Engine atom-registry version bump

After all six atom shapes lock:

- Bump `hauska-engine/packages/atoms/` package version (minor bump from current per option β).
- CHANGELOG entries for L1-L6.
- Session summary at `_sessions/<close-date>_l_surface_atom_shapes_cc-agent-E.md` capturing all six shapes, design decisions, and Sync B fires.

## Test plan

Per atom (all six):

1. Schema validation: valid instances accept; invalid instances reject with clear errors.
2. Round-trip: `register()` → `contextSummary()` → composition resolution returns equivalent atom.
3. `@ts-expect-error` smoke tests: widening rejection on every union field.
4. Render-mode stubs: all five modes (inline, compact, card, expanded, focus) produce output; focus mode polish-grade per ADR-012.
5. ADR-017 access policy enforcement: default per atom type; appropriate for each (these are platform-internal or tenant-private — not public catalog atoms).
6. ADR-015 actor linking: `actorId` and `principalActorId` fields validated where applicable.

Cross-atom:

7. Provenance chains: L3 `deliverable-letter` links to L1 `response-task`, L2 `sheet-content-extraction`, and findings — all resolve.
8. State transitions: response-task lifecycle event chain composes correctly.

## Dependencies

- **Gates this dispatch:** Lane A.1 (Sync 4.5) closes. You should not start Lane A.2 mid-flight on Sync 4.5 — let the cost-tracking signal land cleanly first.
- **Unblocks:** Lane B (cc-agent-M MCP tools per Sync B per surface) and Lane C (cc-agent-C UI surfaces per Sync B per surface).
- **Pin updates:** consumers of the engine atom-registry (currently just hauska-engine internals and the Lane B MCP server) pick up new atom types on next dependency refresh. Do not require atomic cross-repo coordination — that's the Bump 1 lesson.

## Hand-off

Each Sync B fires as its atom shape locks. Planner notifies Lane B (cc-agent-M) and Lane C (cc-agent-C) per surface as Sync B fires for that surface. You publish a session summary capturing all six locks at the end of this dispatch.

After this dispatch, you return to steady-state unless a follow-on surface need surfaces from QA cycle.
