---
id: 2026-05-19_l_surface_atom_shapes_cc-agent-E
title: Session — Lane A.2 close-out (L1-L6 L-surface atom shapes locked)
date: 2026-05-19
agent: cc-agent-E
repo: hauska-engine
session_type: engineering
rolled_up: false
rolled_up_into: []
related:
  - _dispatches/2026-05-19_cc-agent-E_l_surface_atom_shapes
  - _decisions/2026-05-19_sync_4_5_and_cortex_sprint
  - 42_design_accelerator_program_plan
  - 27_engine_evolution_plan
  - 80_adrs/adr_001_atom_architecture
  - 80_adrs/adr_018_atom_contract_substrate_layer
---

## TL;DR

Lane A.2 is **done**. All six L-surface atom shapes for the Cortex/Codex sprint are locked in the engine atom-registry (`hauska-engine/packages/atoms/`), one PR per atom phase per the dispatch's anti-batching rule. Each merge fired its Sync B; Lane B (cc-agent-M MCP tools) and Lane C (cc-agent-C UI) can consume all six shapes.

| Sync | Atom(s) | PR | atoms version |
|---|---|---|---|
| B(L1) | `response-task` | #9 | 0.0.0 → 0.1.0 |
| B(L2) | `sheet-content-extraction` + `attached-document` | #10 | 0.1.0 → 0.2.0 |
| B(L3) | `deliverable-letter` | #11 | 0.2.0 → 0.3.0 |
| B(L4) | `detail-callout-spec` | #12 | 0.3.0 → 0.4.0 |
| B(L5) | `product-spec-reference` | #13 | 0.4.0 → 0.5.0 |
| B(L6) | `deliverable-letter-render` | #14 | 0.5.0 → 0.6.0 |

Seven Cortex atom types total. `@hauska-engine/atoms` at 0.6.0. 194 workspace tests green at HEAD (`7ed915c`); 112 of them are the L-surface conformance suites (16 + 20 + 23 + 20 + 17 + 16).

## What was done

Six atom-shape locks, each: Zod schema, ADR-001 four-layer contract (the `AtomRegistration` in `bootstrapEngineAtomRegistry()` with `contextSummary`), ADR-015 actor linking, ADR-017 `accessPolicy`, five render modes, conformance suite, engine atom-registry minor bump. Per option β (ADR-018) the L-surface atoms are catalog-data atoms in the engine atom-registry, not the `@hauska/atom-contract` framework package.

### L1 `response-task`

Persistent task state for the client-comment response flow. State as a field (`open` / `in-progress` / `done` / `cancelled`) with declared audit eventTypes — the atom is the single source of truth for current state; consumers wanting an event-sourced view compose it from the storage event log. Cross-product link fields (`sourceClientCommentId`, `findingId`, `engagementId`) all nullable. This established the pattern every later L-atom followed.

### L2 `sheet-content-extraction` + `attached-document`

Two coupled atoms in one PR (the sheet-ingest pass extracts both inline). `sheet-content-extraction` carries OCR text segments + structured annotations with page-relative normalized `BoundingBox` positions and a `SheetAnnotationKind` enum. `attached-document` carries a typed supporting document (`specification` / `calculation` / `product-data` / `narrative`).

### L3 `deliverable-letter`

The comment-response letter as a classified atom — structured `LetterSection`s with per-section provenance (each section names exactly the L1 / L2 / finding / adjudication atoms that fed it). `deliverableLetterCompleteness()` helper gates the "send" action. `draft` / `sent` status.

### L4 `detail-callout-spec`

Revit detail-callout spec consumed by the Revit Connector via APS Design Automation. The `spec` payload is a Zod `discriminatedUnion` keyed on `detailType` (`door-schedule` / `wall-section` / `wall-type` / `room-finish`) — the enum IS the discriminant, so atom and spec can't drift. Push lifecycle (`pending` / `pushed` / `applied` / `rejected-by-user`) with an advisory `isLegalPushTransition` helper. `apsTaskRef` opaque work-item ref.

### L5 `product-spec-reference`

Reference to an ICC-ES-evaluated product spec with live status (`active` / `withdrawn` / `expired`). `esrNumber` Zod-validated against `ESR-<digits>`. An inline append-only `statusHistory` chain makes the transition history queryable from one atom version. Per the dispatch, the ICC-ES poller is runtime-layer work (legacy-design-tools) — out of atom-shape scope.

### L6 `deliverable-letter-render`

The rendered DOCX/PDF of an L3 letter, as a first-class atom (planner architectural call per Sprint Amendment 6 — render output IS an atom, not bytes-only). `sourceLetterRef` is a DID-validated ref to the L3 atom; `sourceLetterVersion` pins the rendered-against version (ADR-011); `blobRef` is an opaque pointer to the stored bytes. Renders are 1-to-many off one letter.

## What was learned (design decisions worth carrying forward)

- **State-as-field + declared eventTypes** beats inline event-sourcing for these workflow atoms. The atom record is the single source of truth for current state; eventTypes are declared on the registration so the storage event log carries the audit chain. Established at L1, reused L3-L6. The one inline-history exception is L5's `statusHistory` — the dispatch explicitly asked for a queryable ESR-status chain on the atom, and a verifier holding one atom version benefits from not having to walk the version chain.

- **Discriminated unions key on the discriminant, no redundant flat field.** L4's `spec` and the principle generalize: when a payload varies by a type tag, make the tag the union discriminant (`z.discriminatedUnion`) and don't also carry it as a top-level field — zero drift risk, Zod-native validation.

- **Advisory helpers, not runtime enforcement.** `deliverableLetterCompleteness` (L3), `isLegalPushTransition` (L4) are exported helpers consumers consult; the atom-registry enforces nothing at runtime, consistent with how the code-corpus atoms behave. Keeps the registry a pure declarative surface.

- **Leaf composition throughout.** All six L-atoms use `composition: []`. Cross-atom references (findingId, sourceLetterRef, per-section provenance) are data fields consumers resolve themselves, not declared composition edges — the atom-contract's flat `dataKey` composition model doesn't fit nested or single-ref provenance cleanly, and keeping them leaf is consistent and simple.

- **`accessPolicy: "tenant-private"`** for every L-atom — these are engagement workflow data, never public-catalog atoms (ADR-017).

- **No backend/persistence/runtime open question needed planner escalation** for L1-L5 — the dispatch + the L1 precedent fully determined each shape. L6 had a genuine architectural question (is render output an atom or just bytes?); the planner pre-resolved it via Sprint Amendment 6 before dispatching L6, so no escalation was needed there either. Sprint Amendment 6's discipline (check planner answers against the system as the agent sees it) held up — every shape was buildable as specified.

## What's still open

Lane A.2 itself is closed. Downstream:

- **Lane B (cc-agent-M)** consumes all six shapes for the `cortex/*` MCP tools (`response_task_*`, `sheet_content_extraction_*`, `deliverable_letter_*`, `detail_callout_spec_*`, `product_spec_reference_*`, `deliverable_letter_render`). Each Sync B(Ln) is fired.
- **Lane C (cc-agent-C)** consumes them for the L1-L6 UI surfaces.
- **Runtime-layer work** the atom shapes deliberately deferred: the ICC-ES poller (L5) and the DOCX/PDF render pipeline (L6) are legacy-design-tools implementation work, not engine atom-registry scope.
- **Render-mode React bindings** — the atom-registry declares `supportedModes`; the actual per-mode components live in a sibling render package per ADR-001. Not in scope here.

cc-agent-E returns to steady-state until Lane A.2-side follow-on surfaces (post-QA-cycle atom-shape refinements, any L7+ surfaces the operator queues).

## Suggested canonical doc updates

[`42_design_accelerator_program_plan.md`](../42_design_accelerator_program_plan.md) — the Phase 1 stream 27-B ("Atom registry implementation, DA-side atoms first") can be marked complete for the L1-L6 set; the DA-4 / DA-5 / DA-6 streams' atom dependencies (`sheet-content-extraction`, `deliverable-letter`, `response-task`) are now satisfied.

[`27_engine_evolution_plan.md`](../27_engine_evolution_plan.md) §Stream B — the engine atom-registry now carries seven Cortex atom types beyond the six Bump 1 code-corpus types; `@hauska-engine/atoms` at 0.6.0.

[`00_current_state.md`](../00_current_state.md) §recent-sessions — add the Lane A.2 close.

## Commit batch

Six squash-merged PRs on `empressaioemail-tech/hauska-engine` main: #9 (L1, `31a8f1f`), #10 (L2, `30b8047`), #11 (L3, `99d4f5f`), #12 (L4, `918f4eb`), #13 (L5, `b030570`), #14 (L6, `7ed915c`). `@hauska-engine/atoms` 0.0.0 → 0.6.0 with a CHANGELOG entry per phase. doc_repo carries this close-out summary.
