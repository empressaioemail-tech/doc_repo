---
id: 2026-05-18_plan_review_engine_inventory_cc-agent-PR
title: Plan review engine inventory — read-only recon (cc-agent-PR 2026-05-18)
status: complete
last_updated: 2026-05-18
applies_to: hauska-engine
related: [40_design_accelerator, 27_engine_evolution_plan, 47_codex_plan_review, 49_code_ingestion_pipeline, 42_design_accelerator_program_plan, 10_ground_truth, 41_revit_connector, 40a_customer_zero_observations_arena_roja_2026_05_06, adr_001_atom_architecture, adr_008_engine_factor_out]
agent: cc-agent-PR
kind: session
---

# Plan review engine inventory — read-only recon

Companion to `2026-05-18_cc-agent-UI_cortex_ui_inventory.md`. This report inventories every stage of the plan-review engine (Hauska Engine) — the pipeline that ingests BIM models, plan sheets, and parcel data; retrieves against the code corpus; emits findings and briefings. Cited from a read-only pass over `P:\legacy-design-tools` HEAD `3c9097f` (branch `docs/empressa-atom-rename-hauska-atom-contract`, parent of origin/main `99a6a02` per [10_ground_truth.md:258](P:\doc_repo\10_ground_truth.md#L258)).

## Executive summary

Fifty-nine stages inventoried across intake, BIM/IFC, sheet/PDF, retrieval, rule application, finding emission, briefing, mode handling, AI/LLM, test coverage, and cross-cutting. State distribution (engine-only — UI not counted): **works** 18, **partial** 14, **stub** 6, **mock-only** 7, **missing** 11, **placeholder-only** 3. The numbers tilt toward "real but shallow": ingestion is wired end-to-end and produces persistent atoms; analysis is pure-LLM with very little structural scaffolding around it.

**BIM analysis in one sentence.** Server-side IFC parsing extracts entity metadata (GlobalId, IfcType, label, PropertySet) and consolidated glTF via `web-ifc` WASM at [artifacts/api-server/src/lib/ifcIngest.ts:316-332](P:\legacy-design-tools\artifacts\api-server\src\lib\ifcIngest.ts#L316-L332), persists per-entity `materializable-element` rows, and passes them as a flat string list to the finding-engine — no geometric reasoning, no spatial checks, no setback/height verification against parsed elements.

**Plan-sheet analysis in one sentence.** Sheet content extraction at [artifacts/api-server/src/lib/sheetContentExtractor.ts:85-133](P:\legacy-design-tools\artifacts\api-server\src\lib\sheetContentExtractor.ts#L85-L133) is a Claude Sonnet 4.5 vision pass over each sheet PNG that returns up to 8000 chars of plain extracted text into `sheets.contentBody` — annotations, dimension callouts, revision clouds, schedules, attached documents are not parsed as structured data.

**Top five gaps blocking Phase 2 QA-readiness.**

1. There is no real distinction between incremental (<5s) and full-pass (30-120s) modes in code — same `generateFindings` path serves both, and the mode-switch claim in [40_design_accelerator.md:142-153](P:\doc_repo\40_design_accelerator.md#L142-L153) is aspirational.
2. The finding engine is pure-LLM with zero structural/rules pass — no setback intersection, no height check against parsed BIM, no jurisdictional rule application; everything funnels through one Sonnet 4.5 prompt at [lib/finding-engine/src/prompt.ts:36-77](P:\legacy-design-tools\lib\finding-engine\src\prompt.ts#L36-L77).
3. The DA-side new atoms specified in [27_engine_evolution_plan.md:95-133](P:\doc_repo\27_engine_evolution_plan.md#L95-L133) — `sheet-content-extraction`, `attached-document`, `detail-callout-spec`, `product-spec-reference` — are unregistered; the inventory still shows the 19 atoms from 2026-05-05.
4. Mock mode is the default for every LLM path (finding, briefing, classification, sheet extraction) — production behavior is opt-in via env flags, and the test projects (Musgrave, Seguin, Arena Roja, Alexander 404, Balsley, Dart Frog) have no captured eval coverage.
5. Code retrieval is a simple top-K vector + lexical fallback at [lib/codes/src/retrieval.ts](P:\legacy-design-tools\lib\codes\src\retrieval.ts) with no graph traversal of `code-cross-reference` edges (ADR-010 §4 hybrid retrieval is unbuilt) and no jurisdiction-key-to-code-edition pinning.

**Top three quickest wins.**

1. Wire a structured-vs-text branch in `sheetContentExtractor.ts` to emit a separate `sheet-content-extraction` atom (vs only patching `sheets.contentBody`) — schema slot is documented at [27_engine_evolution_plan.md:97-101](P:\doc_repo\27_engine_evolution_plan.md#L97-L101), no breaking work in extraction prompt.
2. Capture finding-engine eval data: every prod-mode `generateFindings` run emits `invalidCitations` and `discardedFindings` counts at [lib/finding-engine/src/types.ts:195-223](P:\legacy-design-tools\lib\finding-engine\src\types.ts#L195-L223) but they're only logged in `finding_runs.invalidCitationCount` ([lib/db/src/schema/findingRuns.ts:54-124](P:\legacy-design-tools\lib\db\src\schema\findingRuns.ts#L54-L124)); a `findings.runs.summary` aggregator on top of that table would surface eval signal immediately.
3. Add a jurisdiction-pinned filter pass to retrieval — the data is there (`code_atoms.jurisdictionKey`) but the engine fetches without `code-edition` versioning, so as-of-time queries (ADR-011) cannot be answered yet. Small filter change unlocks downstream version-drift work.

**What cc-agent-E should know.** The engine is portable shape-wise: `lib/finding-engine`, `lib/briefing-engine`, `lib/codes`, `lib/integrations-anthropic-ai`, and `lib/comment-letter` are five clean workspace packages each with their own README, prompt files, and tests. The legacy engine is **not** a monolith — it's already factored into well-bounded packages whose dependencies form a small DAG ([dependency graph in §Side-intel](#side-intel-for-cc-agent-e)). What is NOT portable: the LLM-only synthesis pattern (no rules layer), the lack of `code-cross-reference` graph traversal, the lack of jurisdiction-by-edition pinning, and the lack of any structured BIM geometric reasoning. These are gaps to design fresh in `hauska-engine`, not to port.

## Pipeline shape diagram

```
                         ┌─────────────────────────────────────────────────────────────┐
                         │  ARCHITECT (Revit add-in legacy-revit-sensor)               │
                         │  - Send Snapshot                                            │
                         │  - Configure                                                │
                         └─────────────────────────────────────────────────────────────┘
                                                       │ x-snapshot-secret header
                                                       ▼
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ INTAKE (artifacts/api-server/src/routes/)                                                        │
│                                                                                                  │
│   POST /api/engagements/match  ───────────────► [works] match.ts:82-190 (GUID > path > name)     │
│                                                                                                  │
│   POST /api/snapshots ────────────────────────► [works] snapshots.ts:562-740                     │
│     ├─► snapshot atom created                                                                    │
│     ├─► engagement atom (on fresh create)                                                        │
│     ├─► fire-and-forget: fireAutoBriefingKickoff()                                              │
│     └─► fire-and-forget: fireGeocodeAndWarmup()                                                  │
│                                                                                                  │
│   POST /api/snapshots/:id/sheets ─────────────► [works] sheets.ts:161-804                        │
│     ├─► per-sheet INSERT/UPDATE, sheet.created/updated events                                    │
│     ├─► thumbnail + full PNG stored as bytea columns                                             │
│     └─► fire-and-forget: runSheetContentExtraction()                                             │
│           └─► [partial] sheetContentExtractor.ts:85-133 (Sonnet 4.5 vision, text only)           │
│                                                                                                  │
│   POST /api/snapshots/:id/ifc ────────────────► [works] snapshots.ts:989-1011                    │
│     └─► ingestSnapshotIfc() → ifcIngest.ts:227-399                                               │
│           ├─► IFC blob → GCS                                                                     │
│           ├─► parseIfc() via web-ifc WASM → ifcParser/index.ts:46-135                            │
│           ├─► per-entity materializable-element rows (sourceKind=as-built-ifc)                   │
│           └─► glTF bundle row (sourceKind=as-built-ifc-bundle)                                   │
│                                                                                                  │
│   POST /api/engagements/:id/bim-model ────────► [partial] bimModels.ts (Push-to-Revit + divergence) │
│                                                                                                  │
│   POST /api/submissions (route varies) ───────► [works] auto-fires:                              │
│     ├─► autoTriggerClassificationOnSubmissionCreated.ts:24-44                                    │
│     └─► autoTriggerFindingsOnSubmissionCreated.ts:17-31                                          │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
                                                       │
                                                       ▼
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ ENGINE (lib/* workspace packages)                                                                │
│                                                                                                  │
│  ┌──────────────────────┐    ┌──────────────────────────────┐    ┌────────────────────────────┐  │
│  │ submission-          │    │ briefing-engine              │    │ finding-engine             │  │
│  │ classifier           │    │  [partial]                   │    │  [partial]                 │  │
│  │  [works/mock-only]   │    │ - generateBriefing()         │    │ - generateFindings()       │  │
│  │ - Sonnet 4.5         │    │ - Sonnet 4.5, 7 sections A-G │    │ - Sonnet 4.5               │  │
│  │ - JSON output        │    │ - JSON output                │    │ - JSON output              │  │
│  │ - mock default       │    │ - mock default               │    │ - mock default             │  │
│  │ - no rules pass      │    │ - no rules pass              │    │ - NO RULES PASS            │  │
│  └──────────────────────┘    └──────────────────────────────┘    └────────────────────────────┘  │
│                                                  │                              │                │
│                                                  │                              ▼                │
│                                                  │                  ┌─────────────────────────┐  │
│                                                  │                  │ codes (retrieval)       │  │
│                                                  │                  │  [partial]              │  │
│                                                  │                  │ - retrieveAtomsForQ()   │  │
│                                                  │                  │ - OpenAI text-emb-3-sm  │  │
│                                                  │                  │ - pgvector cosine 0.35  │  │
│                                                  │                  │ - lexical fallback      │  │
│                                                  │                  │ - K=8                   │  │
│                                                  │                  │ - jurisdiction filter   │  │
│                                                  │                  │ - NO graph traversal    │  │
│                                                  │                  └─────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
                                                       │
                                                       ▼
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ PERSISTENCE (lib/db/src/schema/)                                                                 │
│   findings, finding_runs, parcel_briefings, briefing_generation_jobs,                            │
│   briefing_sources, briefing_divergences, materializable_elements, snapshot_ifc_files,           │
│   submission_classifications, sheets, snapshots, atom_events                                     │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
                                                       │
                                                       ▼
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ DOWNSTREAM SURFACES                                                                              │
│   - design-tools UI (architect-side, Cortex)        — cc-agent-UI scope                          │
│   - plan-review UI (architect-side window)          — cc-agent-UI scope                          │
│   - comment-letter assembly                         — [works] lib/comment-letter/                │
│   - decision PDF + stamped plan set                 — [works] lib/plan-review-pdf/               │
│   - SSE live event channel                          — [works] routes/submissionEvents.ts         │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

## Stage-by-stage inventory

### Engine entry points

### 1. Snapshot ingestion handler (`POST /api/snapshots`)

**Intended.** Three-branch intake: existing engagement, create-new, or GUID-race rebind. Creates `snapshot` atom; on fresh path also creates `engagement` atom; kicks off briefing + warmup fire-and-forget. Wire contract per [41_revit_connector.md:96-114](P:\doc_repo\41_revit_connector.md#L96-L114).
**Current state.** works
**Evidence.** Handler at [artifacts/api-server/src/routes/snapshots.ts:562-740](P:\legacy-design-tools\artifacts\api-server\src\routes\snapshots.ts#L562-L740). Snapshot insert lines 660-668; engagement insert lines 648-659; GUID race rebind 681-699; briefing kickoff line 728; warmup kickoff lines 703-705. Atom emission at routes/snapshots.ts:194-256 (`snapshot.created`/`snapshot.replaced`), lines 108-137 (`engagement.created`).
**External deps.** None at intake time (downstream fires touch Anthropic + adapters).
**Atoms.** Produces `snapshot` (always), `engagement` (fresh path only).
**Mode.** Both — same path serves architect-side Cortex and reviewer-side Codex intake.
**Gap.** None at this stage. The downstream auto-trigger lifecycle is more interesting.

### 2. Engagement match handler (`POST /api/engagements/match`)

**Intended.** Resolve which engagement a Revit snapshot belongs to using GUID > path > name precedence per A04.7 ([10_ground_truth.md:278-282](P:\doc_repo\10_ground_truth.md#L278-L282)).
**Current state.** works
**Evidence.** [artifacts/api-server/src/routes/match.ts:82-190](P:\legacy-design-tools\artifacts\api-server\src\routes\match.ts#L82-L190). GUID match lines 110-129; path match lines 135-154; name collision lines 160-177 (returns up to 10 candidates per `CHOOSE_CANDIDATE_LIMIT` at line 29); no-match lines 181-185.
**External deps.** None.
**Atoms.** None produced (read-only routing decision).
**Mode.** Both.
**Gap.** None.

### 3. Sheet upload handler (`POST /api/snapshots/:id/sheets`)

**Intended.** Multipart sheet upload; persist PNG (thumbnail + full); fire content extraction. Per Revit Connector A→B→C→D pipeline.
**Current state.** works (storage); partial (extraction kickoff — see §17).
**Evidence.** [artifacts/api-server/src/routes/sheets.ts:161-804](P:\legacy-design-tools\artifacts\api-server\src\routes\sheets.ts#L161-L804). Multipart parse lines 207-256; upsert lines 458-598; `sheet.created` event line 514-550; `sheet.updated` field diff lines 562-595; removals lines 607-696; content-extraction kickoff lines 765-800.
**External deps.** Anthropic (downstream extraction); GCS for PNG storage (via columns, not signed URLs at intake — PNG is `bytea` per schema).
**Atoms.** Produces `sheet` atoms.
**Mode.** Both.
**Gap.** PNG stored as `bytea` columns (`sheets.thumbnailPng`, `sheets.fullPng`) per intake handler, not GCS object paths — diverges from the IFC ingest pattern (object-storage upload).

### 4. IFC upload handler (`POST /api/snapshots/:id/ifc`)

**Intended.** Multipart IFC upload (Track B per PR #15). Parse via web-ifc. Produce `bim-model` + `materializable-element` atoms with parsed elements.
**Current state.** works (parse + persistence); partial (no geometric reasoning downstream).
**Evidence.** Route at [artifacts/api-server/src/routes/snapshots.ts:989-1011](P:\legacy-design-tools\artifacts\api-server\src\routes\snapshots.ts#L989-L1011). Full pipeline at [artifacts/api-server/src/lib/ifcIngest.ts:227-399](P:\legacy-design-tools\artifacts\api-server\src\lib\ifcIngest.ts#L227-L399). IFC blob upload to GCS lines 246-256; web-ifc parse line 316-332; glTF emit lines 335-350; per-entity `materializable_elements` insert lines 355-367; bundle row insert lines 372-382.
**External deps.** GCS (via `ObjectStorageService`); web-ifc WASM at boot.
**Atoms.** Produces `materializable-element` (per-entity rows with `sourceKind=as-built-ifc` and one `as-built-ifc-bundle` row carrying glTF path). Does not produce a `bim-model` atom directly — `bim-model` is materialized via the `bimModels.ts` route on Push-to-Revit (see §5).
**Mode.** Inline (Phase 1, line 10 of ifcParser/index.ts comments "Phase 2 worker upgrade").
**Gap.** No spatial / geometric reasoning downstream — parsed elements feed the finding-engine as a flat string list (see §13).

### 5. Post-intake job dispatch (queue / worker / inline)

**Intended.** Either an explicit queue or fire-and-forget chain. For full-pass vs incremental, mode dictates timing.
**Current state.** partial — fire-and-forget pattern, no queue.
**Evidence.** Snapshot intake fires kickoffs as void async IIFEs: [autoTriggerFindingsOnSubmissionCreated.ts:17-31](P:\legacy-design-tools\artifacts\api-server\src\lib\autoTriggerFindingsOnSubmissionCreated.ts#L17-L31); [autoTriggerClassificationOnSubmissionCreated.ts:24-44](P:\legacy-design-tools\artifacts\api-server\src\lib\autoTriggerClassificationOnSubmissionCreated.ts#L24-L44); briefing kickoff via `fireAutoBriefingKickoff()` from snapshot route. State is tracked in `finding_runs` and `briefing_generation_jobs` rows (see §34, §40), not in a queue. The only queue is `codeAtomFetchQueue` for corpus warmup ([lib/codes/src/orchestrator.ts](P:\legacy-design-tools\lib\codes\src\orchestrator.ts) lines 94-198).
**External deps.** None for orchestration; node `setInterval` for the warmup queue worker.
**Atoms.** None directly.
**Mode.** Both (incremental and full-pass use the same dispatch).
**Gap.** No BullMQ / Cloud Tasks / cron — every analysis is in-process. Acceptable for single-instance Replit; will need queue for Cloud Run autoscale.

### BIM / IFC analysis pipeline

### 6. IFC parsing (server-side web-ifc usage)

**Intended.** Open IFC, walk type-classified entities, extract metadata + geometry.
**Current state.** works (metadata + geometry); partial (no per-entity geometry export to atoms — only consolidated glTF).
**Evidence.** [artifacts/api-server/src/lib/ifcParser/wasmRuntime.ts:1-97](P:\legacy-design-tools\artifacts\api-server\src\lib\ifcParser\wasmRuntime.ts#L1-L97) — singleton WASM init forced to Node entry (`web-ifc/web-ifc-api-node.js`) at lines 4-17; cached per process and NOT reentrant (lines 11-15). [artifacts/api-server/src/lib/ifcParser/index.ts:46-135](P:\legacy-design-tools\artifacts\api-server\src\lib\ifcParser\index.ts#L46-L135) — `parseIfc()` public entry. Library version: `web-ifc ^0.0.71` from api-server `package.json`.
**External deps.** web-ifc WASM (committed wasm in node_modules).
**Atoms.** Used by §7.
**Mode.** Both.
**Gap.** Singleton-per-process means re-entrance is unsafe — concurrent IFC uploads on same instance serialize. PR #15 + post-saga fix `99a6a02` (web-ifc wasm dir fix) closed the immediate fire.

### 7. IFC element extraction

**Intended.** Pull walls, slabs, openings, spaces, materials, dimensions out of the model.
**Current state.** partial — tracked entity types limited; only metadata fields extracted, no dimensional/material data.
**Evidence.** Tracked types at [artifacts/api-server/src/lib/ifcParser/wasmRuntime.ts:66-88](P:\legacy-design-tools\artifacts\api-server\src\lib\ifcParser\wasmRuntime.ts#L66-L88) — WALL, WALLSTANDARDCASE, SLAB, DOOR, WINDOW, SPACE, COLUMN, BEAM, ROOF, BUILDINGPROXY. Extracted fields at index.ts:71-134: GlobalId, Name, Description, ObjectType, PredefinedType. No quantity sets (IfcElementQuantity), no material layers (IfcMaterialLayerSet), no IfcRelSpaceBoundary parsing.
**External deps.** web-ifc.
**Atoms.** Feeds `materializable-element` rows (see §8).
**Mode.** Both.
**Gap.** Materials, dimensions, schedules from IFC are not extracted. Inference (marked): a real compliance engine would need quantities to verify "wall is 6 inches thick" against an R-value requirement.

### 8. `materializable-element` atom production

**Intended.** Persistent atom representing a buildable element. Per ADR-001 four-layer contract.
**Current state.** works (schema) — atom registered, columns populated.
**Evidence.** Atom registration at [artifacts/api-server/src/atoms/materializable-element.atom.ts](P:\legacy-design-tools\artifacts\api-server\src\atoms\materializable-element.atom.ts). Schema at [lib/db/src/schema/materializableElements.ts]. Insert sites: IFC ingest at [artifacts/api-server/src/lib/ifcIngest.ts:355-367](P:\legacy-design-tools\artifacts\api-server\src\lib\ifcIngest.ts#L355-L367) (sourceKind=as-built-ifc); briefing-engine `extractMaterializableElements()` at [lib/briefing-engine/src/materializableElements.ts:1-66](P:\legacy-design-tools\lib\briefing-engine\src\materializableElements.ts#L1-L66) (sourceKind from briefing sections C/D/F).
**External deps.** None.
**Atoms.** This IS the atom. Composition declares edges to `parcel-briefing`, `briefing-source`, `briefing-divergence`.
**Mode.** Both.
**Gap.** Atom carries `ifcType`, `label`, `propertySet` (JSON), `glbObjectPath`, but no geometric properties (volume, dimensions, location). Per [27_engine_evolution_plan.md:135-178](P:\doc_repo\27_engine_evolution_plan.md#L135-L178) the code-pipeline atoms also reference this slot.

### 9. `bim-model` atom production

**Intended.** Atom representing the BIM model itself (composition target for materializable-elements).
**Current state.** partial — registered as atom type but production path is via the bim-model route (Push-to-Revit), not IFC ingest.
**Evidence.** Registration in [artifacts/api-server/src/atoms/bim-model.atom.ts](P:\legacy-design-tools\artifacts\api-server\src\atoms\bim-model.atom.ts). Route at [artifacts/api-server/src/routes/bimModels.ts](P:\legacy-design-tools\artifacts\api-server\src\routes\bimModels.ts) records (or updates) engagement's `bim_models` row to point at parcel briefing + stamps `materializedAt`; emits `bim-model.materialized` event. NOT created on IFC ingest — IFC ingest only writes `materializable_elements` and `snapshot_ifc_files`.
**External deps.** None.
**Atoms.** `bim-model` atom (materialized at Push-to-Revit time).
**Mode.** Both.
**Gap.** Inference (marked): the asymmetry between IFC ingest (writes elements, no `bim-model`) and Push-to-Revit (writes `bim-model`, no elements) means the as-built IFC and the to-be-built design aren't first-class peers in the atom graph.

### 10. `briefing-divergence` atom production

**Intended.** Atom representing a divergence between the parcel briefing's materialized elements and what's actually present in the BIM model.
**Current state.** works — atom registered, schema exists, detection routed through bimModels.
**Evidence.** Atom at [artifacts/api-server/src/atoms/briefing-divergence.atom.ts](P:\legacy-design-tools\artifacts\api-server\src\atoms\briefing-divergence.atom.ts) with event types `briefing-divergence.recorded` and `briefing-divergence.resolved` (lines 70-73). Schema at [lib/db/src/schema/briefingDivergences.ts:53-129](P:\legacy-design-tools\lib\db\src\schema\briefingDivergences.ts#L53-L129) with columns `bimModelId`, `materializableElementId`, `briefingId`, `reason`, `note`, `detail`, `resolvedAt`. Composition declares `bim-model`, `materializable-element`, `parcel-briefing`.
**External deps.** None.
**Atoms.** This IS the atom.
**Mode.** Both.
**Gap.** Detection is reactive — recorded when something else (UI, route) declares a divergence. There's no automated divergence-detection pass that compares parsed IFC against the briefing's expected elements.

### 11. Element classification

**Intended.** Classify elements as structural / envelope / interior / etc.
**Current state.** missing
**Evidence.** No classifier on IFC entities beyond the IFC type itself. The `PredefinedType` field is captured but not interpreted. No `elementClass` or similar column on `materializable_elements`. No code search for "classifyElement" or equivalent surfaced any matches.
**External deps.** None.
**Atoms.** Would slot into `materializable-element`.
**Mode.** N/A.
**Gap.** Compliance rules that key on element class (e.g. "structural members must meet IRC §R301") have no anchor to classify against.

### 12. Geometry handling

**Intended.** Reason about geometry (intersect parcel boundary with wall placements; check height; check setback).
**Current state.** missing — geometry is extracted into glTF for viewing only.
**Evidence.** glTF emitter at [artifacts/api-server/src/lib/ifcParser/gltfEmitter.ts:1-127](P:\legacy-design-tools\artifacts\api-server\src\lib\ifcParser\gltfEmitter.ts#L1-L127) converts web-ifc's `LoadAllGeometry` to a single glTF Document; one Node per FlatMesh placement; vertex colors from FlatMesh; no PBR materials (lines 13-16). The Buffer is uploaded to GCS and referenced as `glbObjectPath` on the bundle materializable-element row only. No spatial queries downstream.
**External deps.** `@gltf-transform/core ^4.3.0`.
**Atoms.** glTF reference lives on `materializable-element` bundle row.
**Mode.** Both.
**Gap.** The L+ critical implicit gap — no geometry-based compliance checks. The LLM sees element metadata, not coordinates.

### 13. Cross-reference between IFC elements and code requirements

**Intended.** When a code section says "egress paths must be ≥36 inches wide" the engine matches DOOR/SPACE elements against that requirement.
**Current state.** partial — elements are passed to finding-engine as strings, not as queryable spatial data.
**Evidence.** [artifacts/api-server/src/routes/findings.ts:589-612](P:\legacy-design-tools\artifacts\api-server\src\routes\findings.ts#L589-L612) loads materializable-elements where `briefingId = briefing.id` and maps to `BimElementInput`. Prompt format at [lib/finding-engine/src/prompt.ts:144-147](P:\legacy-design-tools\lib\finding-engine\src\prompt.ts#L144-L147) renders BIM elements as `<bim_elements>` block — a list of strings, not structured data. The LLM picks an `elementRef` from this list if applicable.
**External deps.** None.
**Atoms.** Findings get `elementRef` field referencing element by string.
**Mode.** Both.
**Gap.** The LLM cannot run "is wall longer than min" because it has no length data. It can only flag the element by name + ifcType. This is the core BIM-analysis gap.

### 14. APS integration (Model Derivative, AEC Data Model)

**Intended.** Server-side calls to Autodesk Platform Services per [40_design_accelerator.md:181-184](P:\doc_repo\40_design_accelerator.md#L181-L184) ("APS paid tier active. Model Derivative + AEC Data Model APIs load-bearing.").
**Current state.** missing on api-server.
**Evidence.** Grep for `aps.autodesk`, `forge.autodesk`, `developer.api.autodesk` in `artifacts/api-server/src/` returns zero matches. No `@aps/*` or `forge-apis` package dependency. The Revit add-in side ([41_revit_connector.md](P:\doc_repo\41_revit_connector.md)) handles Revit-side operations directly via Revit API.
**External deps.** N/A — would be APS.
**Atoms.** Would feed `bim-model` and `materializable-element`.
**Mode.** Both.
**Gap.** Doc claim is aspirational. The current server-side BIM path is web-ifc parsing of IFC files that the Revit add-in (or user) uploads. Design Automation API ([40_design_accelerator.md:184](P:\doc_repo\40_design_accelerator.md#L184)) "elevated to near-term priority" has no scaffold yet.

### 15. Track B IFC schema state on helium dev

**Intended.** `snapshot_ifc_files` table applied to helium dev DB matching production state per [10_ground_truth.md:330](P:\doc_repo\10_ground_truth.md#L330).
**Current state.** Confirmed by ground truth: missing on helium dev, applied to prod 2026-05-04. Not directly probed in this pass.
**Evidence.** [10_ground_truth.md:330-336](P:\doc_repo\10_ground_truth.md#L330-L336) — "snapshot_ifc_files MISSING — Track B IFC schema not applied to dev DB"; Track B's `track-b-ifc-ingest.sql` was applied to deployment Neon during 2026-05-04 saga. Schema definition exists in `lib/db/src/schema/snapshotIfcFiles.ts`.
**External deps.** Neon.
**Atoms.** N/A (DDL state).
**Mode.** N/A.
**Gap.** Dev-DB drift means local IFC ingest tests will hit "relation does not exist" failures unless TEST_DATABASE_URL is pointed at a DB with the schema. This is a Phase 2 prereq.

### Sheet / plan analysis pipeline

### 16. PDF intake

**Intended.** Parse incoming sheet PDFs.
**Current state.** partial — sheets arrive as PNG (already rasterized by the Revit add-in), not PDF. PDF generation is downstream-only (briefing export, decision stamping).
**Evidence.** Sheet upload at [artifacts/api-server/src/routes/sheets.ts:161-804](P:\legacy-design-tools\artifacts\api-server\src\routes\sheets.ts#L161-L804) accepts PNGs paired with metadata JSON. The Revit add-in rasterizes per A→B→C→D pipeline at [41_revit_connector.md:90+](P:\doc_repo\41_revit_connector.md#L90). PDF generation libraries used downstream: `pdf-lib ^1.17.1`, `puppeteer ^24.42.0`.
**External deps.** None at intake.
**Atoms.** `sheet` atoms.
**Mode.** Both.
**Gap.** Inference (marked): for non-Revit sources (architect uploads existing PDFs directly per Codex 1b standalone), there's no PDF→PNG pipeline.

### 17. OCR pass

**Intended.** OCR over sheet content per L2 from [40a_customer_zero_observations_arena_roja_2026_05_06.md:28-29](P:\doc_repo\40a_customer_zero_observations_arena_roja_2026_05_06.md#L28-L29).
**Current state.** partial — Claude Sonnet 4.5 vision is the OCR pass; no Tesseract or alternate fallback.
**Evidence.** [artifacts/api-server/src/lib/sheetContentExtractor.ts:1-203](P:\legacy-design-tools\artifacts\api-server\src\lib\sheetContentExtractor.ts#L1-L203). Mode selection lines 11-21 (default `"mock"`). Vision call lines 85-133 using model `claude-sonnet-4-5` (line 36) with max tokens 1500 (line 43). System prompt lines 54-62 — verbatim: "You are an OCR/transcription assistant for architectural drawing sheets. Extract every legible block of free-text...". Clipping at 8000 chars (line 29 `SHEET_CONTENT_BODY_MAX_CHARS`). Returns `kind: "text" | "empty" | "error"`. No Tesseract grep match; no fallback OCR engine.
**External deps.** Anthropic.
**Atoms.** Patches `sheets.contentBody` column directly; does not produce a `sheet-content-extraction` atom.
**Mode.** Both (mock mode is default).
**Gap.** Default mock means production behavior is opt-in via `SHEET_CONTENT_LLM_MODE=anthropic` per ground truth. No quality bar / eval against typical sheet content.

### 18. Annotation extraction (revision clouds, dimension callouts, schedules, title block)

**Intended.** Structured extraction of annotation primitives per L2 fix in [27_engine_evolution_plan.md:99-101](P:\doc_repo\27_engine_evolution_plan.md#L99-L101) — `extractedText`, `annotations[]`, `dimensionCallouts[]`, `revisionClouds[]`, `attachedDocRefs[]`.
**Current state.** missing — only flat text is extracted.
**Evidence.** Prompt at sheetContentExtractor.ts lines 54-62 asks for "every legible block of free-text" — no schema for structured annotation output. Return type at lines 64-69 is `{ kind: "text", body: string }`. No structured field for annotations / dimensions / revision clouds.
**External deps.** Anthropic.
**Atoms.** Would slot into `sheet-content-extraction` (unregistered).
**Mode.** Both.
**Gap.** L2 partially addressed (architect can see SOME extracted content); structured annotations are the missing half.

### 19. `sheet` atom production

**Intended.** Sheet atom per registry. Carries metadata; per atom contract carries identity/context/composition/history layers.
**Current state.** works
**Evidence.** Registration at [artifacts/api-server/src/atoms/sheet.atom.ts](P:\legacy-design-tools\artifacts\api-server\src\atoms\sheet.atom.ts). Events emitted on upload: `sheet.created`, `sheet.updated`, `sheet.removed` at [artifacts/api-server/src/routes/sheets.ts:514-696](P:\legacy-design-tools\artifacts\api-server\src\routes\sheets.ts#L514-L696). PLR-8 added cross-reference hyperlinks (commit `3b48b84`).
**External deps.** None.
**Atoms.** This IS the atom.
**Mode.** Both.
**Gap.** Atom carries `contentBody` (post-extraction text) but no structured annotation, cross-reference, dimension fields. Same root cause as §18.

### 20. `sheet-content-extraction` atom (L2 fix)

**Intended.** Per [27_engine_evolution_plan.md:97-101](P:\doc_repo\27_engine_evolution_plan.md#L97-L101). Separates extracted content from sheet metadata so it can be queried, versioned, and re-extracted independently.
**Current state.** missing — not in registry, not in schema.
**Evidence.** Grep for `sheet-content-extraction` in `lib/empressa-atom` and `artifacts/api-server/src/atoms/` returns zero matches. Atom registry at registry.ts:162-230 still shows the 19 atoms from 2026-05-05 (no expansion since). cc-agent-AC's scope per [10_ground_truth.md:299-305](P:\doc_repo\10_ground_truth.md#L299-L305).
**External deps.** N/A.
**Atoms.** Would be net-new.
**Mode.** N/A.
**Gap.** This is one of four DA-side new atoms specified in 27 — all four are missing. Atom contract version bump (Bump 1) tracked in [27_engine_evolution_plan.md:225-244](P:\doc_repo\27_engine_evolution_plan.md#L225-L244).

### 21. `attached-document` atom

**Intended.** Per [27_engine_evolution_plan.md:103-107](P:\doc_repo\27_engine_evolution_plan.md#L103-L107). Makes ICC-ES reports / Rescheck / structural calcs queryable.
**Current state.** missing.
**Evidence.** No matches for `attached-document` in `lib/empressa-atom` or `artifacts/api-server/src/atoms/`. No `attachedDocuments` schema table.
**External deps.** N/A.
**Atoms.** Net-new.
**Mode.** N/A.
**Gap.** Same status as §20 — Bump 1 pending.

### 22. Sheet → code-citation linkage

**Intended.** When a finding cites a code section, the finding's `elementRef` or `sourceRef` should also be linkable to a specific sheet/page.
**Current state.** partial — finding's `sourceRef` field exists; sheet linkage is implicit via `briefingId`.
**Evidence.** Finding schema at [lib/db/src/schema/findings.ts:114-274](P:\legacy-design-tools\lib\db\src\schema\findings.ts#L114-L274) has `elementRef` (string), `sourceRef` (JSON), `citations` (JSON). The finding-engine prompt at [lib/finding-engine/src/prompt.ts:152-160](P:\legacy-design-tools\lib\finding-engine\src\prompt.ts#L152-L160) instructs the LLM to emit `sourceRef: { id, label }` referencing a briefing-source — not a sheet directly.
**External deps.** None.
**Atoms.** Findings reference briefing-source by id, not sheet.
**Mode.** Both.
**Gap.** No direct sheet attribution — a finding about a specific sheet must funnel through briefing-source, which is a content-grouping concept, not a sheet identifier. Linkage to sheet page/index is implicit at best.

### Code corpus retrieval

### 23. Vector retrieval

**Intended.** Embed query, search atoms by cosine similarity, top-K.
**Current state.** works
**Evidence.** [lib/codes/src/retrieval.ts:81-139](P:\legacy-design-tools\lib\codes\src\retrieval.ts#L81-L139). Embed query via `embedQuery()` (line 89), pgvector cosine ranking (line 103), default K=8 (line 84), `MIN_VECTOR_SCORE = 0.35` filter (line 61), jurisdiction filter applied at line 109. Index location: pgvector column on `code_atoms` table per [lib/db/src/__tests__/integration/schema.integration.test.ts:275-309](P:\legacy-design-tools\lib\db\src\__tests__\integration\schema.integration.test.ts#L275-L309).
**External deps.** Neon Postgres + pgvector extension; OpenAI for embeddings.
**Atoms.** Reads `code_atom` rows.
**Mode.** Both.
**Gap.** Threshold tuned on Grand County Land Use Code (215 atoms). Sensitivity at scale unverified.

### 24. Structural retrieval / section-number lookup

**Intended.** Direct lookup by section number; cross-reference traversal per ADR-010.
**Current state.** missing — no section-number index, no traversal.
**Evidence.** retrieval.ts has only two paths: vector (lines 88-139) and lexical fallback (lines 141-198) which is bag-of-words substring scoring. No "lookup by sectionNumber" function in `lib/codes/src/`. No code grep finds any `crossReference` field on `code_atoms` schema being followed.
**External deps.** N/A.
**Atoms.** N/A.
**Mode.** N/A.
**Gap.** ADR-010 hybrid retrieval ("graph traversal as edges") is unbuilt. The `code-cross-reference` atom type ([27_engine_evolution_plan.md:159-164](P:\doc_repo\27_engine_evolution_plan.md#L159-L164)) is unregistered.

### 25. Hybrid retrieval (vector + lexical combiner)

**Intended.** Vector + lexical scored together; lexical as fuzzy fallback or boost.
**Current state.** partial — lexical is fallback-only (when vector returns 0 rows), not a combined scorer.
**Evidence.** [lib/codes/src/retrieval.ts:115](P:\legacy-design-tools\lib\codes\src\retrieval.ts#L115) — early exit if vector returned rows. Lexical lines 141-198 fires only when no key or no rows. Not a hybrid combiner.
**External deps.** N/A.
**Atoms.** N/A.
**Mode.** Both.
**Gap.** Hybrid scoring (per ADR-010 Alt 1) is unbuilt.

### 26. Jurisdiction filtering

**Intended.** Scope retrieval to Grand County vs Bastrop vs Lemhi.
**Current state.** works
**Evidence.** Jurisdiction filter applied unconditionally at retrieval.ts line 109 (`where ${codeAtoms.jurisdictionKey} = ${jurisdictionKey}`). Jurisdiction keys defined in [lib/codes/src/jurisdictions.ts:37-81](P:\legacy-design-tools\lib\codes\src\jurisdictions.ts#L37-L81): `grand_county_ut`, `bastrop_tx`. Key derivation from engagement at lines 113-152.
**External deps.** Neon.
**Atoms.** N/A.
**Mode.** Both.
**Gap.** No `code-edition` filtering (per [27_engine_evolution_plan.md:166-171](P:\doc_repo\27_engine_evolution_plan.md#L166-L171)) — as-of-time queries unanswerable.

### 27. Code-atom shape

**Intended.** Match the schema described in [49_code_ingestion_pipeline.md](P:\doc_repo\49_code_ingestion_pipeline.md) §B.3 (sectionNumber, body, jurisdictionTenant, codeEditionDid, crossReferenceCids[], definedTermCids[]).
**Current state.** partial — base fields present; ADR-010/011 fields missing.
**Evidence.** Schema at `lib/db/src/schema/codeAtoms.ts` (inferred — not directly read but `code_atoms` table referenced everywhere). Embedding column `vector(1536)` matches `EMBEDDING_DIMENSIONS = 1536` at [lib/codes/src/embeddings.ts:15](P:\legacy-design-tools\lib\codes\src\embeddings.ts#L15). Content hash for dedup at `lib/codes/src/contentHash.ts`.
**External deps.** None.
**Atoms.** Code-atom schema.
**Mode.** Both.
**Gap.** `codeEditionDid`, `crossReferenceCids[]`, `definedTermCids[]`, `sourceAdapter`, `sourceFetchedAt` per ADR-010/011 contract specs — not in schema. Atom registry doesn't include `code-section`, `code-definition`, `code-amendment`, `code-cross-reference`, `code-edition`, `jurisdiction-corpus` (they're code atoms not domain atoms; semantically distinct).

### 28. Retrieval cache / hot path

**Intended.** Cache frequent queries to avoid repeated embedding cost.
**Current state.** missing — no cache layer.
**Evidence.** retrieval.ts has no in-memory cache, no Redis ref. Each call hits Neon + OpenAI. `lib/adapters/src/cache/` exists but is for federal adapter responses, not retrieval.
**External deps.** Would be Redis or in-memory.
**Atoms.** N/A.
**Mode.** Incremental (where caching matters most).
**Gap.** At <5s incremental budget, the retrieval cost is the largest variable. No cache means every architect keystroke re-embeds.

### Compliance rule engine

### 29. Rule definitions

**Intended.** Handwritten compliance rules, LLM-generated rules, or hybrid.
**Current state.** missing — there are no rule definitions. The "rule" is the LLM's interpretation of code atoms.
**Evidence.** No `lib/rules/` directory. No `rules.json` or `rules.ts` file. Grep for `ruleId`, `ruleType`, `applyRule` returns no matches in finding-engine. Finding-engine's `engine.ts` ([lib/finding-engine/src/engine.ts:192-240](P:\legacy-design-tools\lib\finding-engine\src\engine.ts#L192-L240)) goes straight from input → LLM → validation → output.
**External deps.** N/A.
**Atoms.** Would be net-new.
**Mode.** Both.
**Gap.** The single largest architectural gap for compliance. Pure-LLM cannot deterministically test "is height > 35ft" — it can describe what 35ft means in the IRC but cannot answer the geometric question. Adding rule definitions is a Phase 2 prereq.

### 30. Rule application pass

**Intended.** Sequential / parallel / batched rule application.
**Current state.** missing.
**Evidence.** Same as §29 — no rule layer exists, so no application pass.
**External deps.** N/A.
**Atoms.** N/A.
**Mode.** N/A.
**Gap.** N/A until §29 lands.

### 31. Per-jurisdiction rule coverage

**Intended.** Track which jurisdictions have how many rules.
**Current state.** missing.
**Evidence.** N/A — no rules.
**External deps.** N/A.
**Atoms.** N/A.
**Mode.** N/A.
**Gap.** Cost-per-jurisdiction (one of four structural commitments at [CLAUDE.md:29-31](P:\doc_repo\CLAUDE.md#L29-L31)) cannot be measured without rule scope to count.

### 32. Rule confidence scoring

**Intended.** Each rule produces a confidence on its application to a given submission.
**Current state.** partial — finding carries `confidence` ([0,1]) but it's LLM-output, not rule-derived.
**Evidence.** `confidence` field on `EngineFinding` at [lib/finding-engine/src/types.ts:174](P:\legacy-design-tools\lib\finding-engine\src\types.ts#L174). Threshold `lowConfidence: confidence < 0.6` per prompt lines 50-51. Score is set by Claude in the JSON response; no calibration.
**External deps.** None.
**Atoms.** Finding atom.
**Mode.** Both.
**Gap.** Not calibrated. No test that "confidence 0.8 corresponds to N% accuracy."

### 33. Rule provenance

**Intended.** Each rule traces to a specific code section.
**Current state.** partial — findings cite code sections, but provenance is the LLM citing inline tokens, not a structured rule-to-section map.
**Evidence.** Finding's `citations` array carries `{kind: "code-section", atomId}` (lines 70-73 of finding-engine types.ts). Validation at [lib/finding-engine/src/citationAdapter.ts:1-39](P:\legacy-design-tools\lib\finding-engine\src\citationAdapter.ts#L1-L39) verifies the atomId exists in the input bundle.
**External deps.** None.
**Atoms.** Finding's citations.
**Mode.** Both.
**Gap.** Citation provenance ≠ rule provenance. A finding cited atom X doesn't tell you which structural rule it derives from.

### Finding generation

### 34. `finding` atom production

**Intended.** Atom registered per ADR-001. Persisted on `findings` table. Emit `finding.generated` event.
**Current state.** works
**Evidence.** Atom at [artifacts/api-server/src/atoms/finding.atom.ts](P:\legacy-design-tools\artifacts\api-server\src\atoms\finding.atom.ts). Schema at [lib/db/src/schema/findings.ts:114-274](P:\legacy-design-tools\lib\db\src\schema\findings.ts#L114-L274) — columns include `atomId`, `submissionId`, `severity`, `category`, `status`, `text`, `citations` (JSON), `confidence`, `lowConfidence`, `elementRef`, `sourceRef`, `aiGeneratedAt`, `findingRunId`. Persist site at [artifacts/api-server/src/routes/findings.ts:842-871](P:\legacy-design-tools\artifacts\api-server\src\routes\findings.ts#L842-L871).
**External deps.** None.
**Atoms.** This IS the atom.
**Mode.** Both.
**Gap.** None at the atom production level.

### 35. Reasoning chain attachment per CLAUDE.md structural commitment #1

**Intended.** Every output carries reasoning chain ([CLAUDE.md:27](P:\doc_repo\CLAUDE.md#L27): "reasoning chain, source citation, confidence score, timestamp").
**Current state.** partial — confidence + source citation + timestamp present; reasoning chain is implicit (embedded in `text` with inline citations) rather than a separate field.
**Evidence.** [lib/finding-engine/src/types.ts:167-192](P:\legacy-design-tools\lib\finding-engine\src\types.ts#L167-L192) shows EngineFinding has `text` (with inline citation tokens), `citations`, `confidence`, `aiGeneratedAt`. No separate `reasoning` or `reasoningChain` field.
**External deps.** Anthropic.
**Atoms.** Finding atom.
**Mode.** Both.
**Gap.** Implicit-in-text means the reasoning cannot be queried separately from the finding body. A structured `reasoningChain[]` field would be a small addition with high downstream value (audit trails per ADR-001, paid-tier teasers per [08_tiered_access_model.md](P:\doc_repo\08_tiered_access_model.md)).

### 36. Source citation completeness

**Intended.** Every finding cites at least one code section or briefing source.
**Current state.** works
**Evidence.** Prompt at [lib/finding-engine/src/prompt.ts:44-49](P:\legacy-design-tools\lib\finding-engine\src\prompt.ts#L44-L49) strictly requires "EVERY finding's text MUST cite at least one source". Validation at [lib/finding-engine/src/engine.ts:126-163](P:\legacy-design-tools\lib\finding-engine\src\engine.ts#L126-L163) calls `validateInlineCitations` and discards findings with zero retained citations AND no `elementRef` (discard reason `no_valid_citations_or_anchor`).
**External deps.** Anthropic.
**Atoms.** Finding citations.
**Mode.** Both.
**Gap.** None — strictly enforced.

### 37. Confidence score computation

**Intended.** LLM-output or rule-derived.
**Current state.** works (LLM-output, uncalibrated).
**Evidence.** Per §32 — `confidence` is whatever Claude emits in JSON. `lowConfidence` is derived: `lowConfidence = confidence < 0.6`.
**External deps.** Anthropic.
**Atoms.** Finding.
**Mode.** Both.
**Gap.** Uncalibrated (see §32).

### 38. Severity classification

**Intended.** blocker / concern / advisory.
**Current state.** works (LLM-output).
**Evidence.** Per [lib/finding-engine/src/types.ts:18-29](P:\legacy-design-tools\lib\finding-engine\src\types.ts#L18-L29) — `FindingSeverity` enum `blocker | concern | advisory`. Prompt rubric at [lib/finding-engine/src/prompt.ts:40-43](P:\legacy-design-tools\lib\finding-engine\src\prompt.ts#L40-L43). Parser validates strictly at [lib/finding-engine/src/anthropicGenerator.ts:140-145](P:\legacy-design-tools\lib\finding-engine\src\anthropicGenerator.ts#L140-L145) — invalid severity → `anthropic_invalid_finding_shape` error.
**External deps.** Anthropic.
**Atoms.** Finding.
**Mode.** Both.
**Gap.** None.

### 39. False-positive / suppression mechanism

**Intended.** Reviewer can suppress findings; engine learns to avoid repeats.
**Current state.** partial — reviewer can reject/override but no learning loop.
**Evidence.** Finding schema has `reviewerStatusBy`, `reviewerStatusChangedAt`, `reviewerComment`, `acceptedByReviewerId`, `acceptedAt` fields ([lib/db/src/schema/findings.ts:114-274](P:\legacy-design-tools\lib\db\src\schema\findings.ts#L114-L274)). Status enum (inferred) includes a "rejected" or "overridden" state. No `adjudication-record` atom exists yet ([27_engine_evolution_plan.md:263-308](P:\doc_repo\27_engine_evolution_plan.md#L263-L308) — Bump 1 pending).
**External deps.** None.
**Atoms.** Finding row mutated by reviewer action.
**Mode.** Full-pass (reviewer-side).
**Gap.** Adjudication records (the compounding moat per [27_engine_evolution_plan.md:263-308](P:\doc_repo\27_engine_evolution_plan.md#L263-L308)) are unbuilt.

### Briefing pipeline

### 40. `parcel-briefing` atom production

**Intended.** Parcel-scoped briefing atom with 7 sections (A-G).
**Current state.** works
**Evidence.** Atom at [artifacts/api-server/src/atoms/parcel-briefing.atom.ts](P:\legacy-design-tools\artifacts\api-server\src\atoms\parcel-briefing.atom.ts). Schema at [lib/db/src/schema/parcelBriefings.ts:48-106](P:\legacy-design-tools\lib\db\src\schema\parcelBriefings.ts#L48-L106) — columns `sectionA..sectionG`, `generatedAt`, `generatedBy`, `priorSectionA..priorSectionG` (versioning), `generationId`. Engine call at [artifacts/api-server/src/routes/parcelBriefings.ts:1595](P:\legacy-design-tools\artifacts\api-server\src\routes\parcelBriefings.ts#L1595).
**External deps.** Anthropic; adapters (indirectly via briefing-sources).
**Atoms.** This IS the atom.
**Mode.** Both (auto-fired post-engagement-creation per commit `30dfad4`).
**Gap.** None at production level. Section semantics defined at [lib/briefing-engine/src/types.ts:77-85](P:\legacy-design-tools\lib\briefing-engine\src\types.ts#L77-L85) — A executive summary, B threshold issues, C regulatory gates, D site infrastructure, E buildable envelope, F neighboring context, G next-step checklist.

### 41. `neighboring-context` atom production

**Intended.** Adjacent parcels query, 3DEP elevation pull, hazards lookup per W2 wave.
**Current state.** partial — atom registered; schema and production path inferred from `lib/site-context` package.
**Evidence.** Registration in atom registry. `lib/site-context/src/server/parcel.ts` and `geocode.ts` provide neighboring-parcel queries (inferred). UI side at `lib/site-context/src/client/`. Not deeply probed in this pass.
**External deps.** Geocoder; cadastral data (state/local adapters); USGS for elevation.
**Atoms.** This IS the atom.
**Mode.** Both.
**Gap.** Production path documented in §43 (briefing source); the atom itself is one of the 19 but its automatic population from adapters is partial.

### 42. `briefing-source` atom

**Intended.** Per-source atom representing one snapshot of one data layer (e.g., one FEMA flood zone reading).
**Current state.** works
**Evidence.** Atom at [artifacts/api-server/src/atoms/briefing-source.atom.ts](P:\legacy-design-tools\artifacts\api-server\src\atoms\briefing-source.atom.ts). Schema at [lib/db/src/schema/briefingSources.ts:47-163](P:\legacy-design-tools\lib\db\src\schema\briefingSources.ts#L47-L163) — columns `briefingId`, `layerKind`, `sourceKind`, `provider`, `snapshotDate`, `payload` (JSON), `uploadObjectPath`, `dxfObjectPath`, `glbObjectPath`, `conversionStatus`, `note`, `supersededById`, `supersededAt`. Layer-kind → section mapping at [lib/briefing-engine/src/sourceCategories.ts:35-98](P:\legacy-design-tools\lib\briefing-engine\src\sourceCategories.ts#L35-L98).
**External deps.** None at the atom level.
**Atoms.** This IS the atom.
**Mode.** Both.
**Gap.** None at production level. The `supersededById` versioning is in place.

### 43. `intent` atom production

**Intended.** Architect's stated intent; v1 stopgap on procedure-execution per [CLAUDE.md:99](P:\doc_repo\CLAUDE.md#L99). Registered in the 19.
**Current state.** partial — atom registered; no detected production path in routes (search for `intent` produces only common-word matches).
**Evidence.** Atom at [artifacts/api-server/src/atoms/intent.atom.ts](P:\legacy-design-tools\artifacts\api-server\src\atoms\intent.atom.ts). No route handler emits `intent.created` per recon coverage. Inference (marked): may be produced via a `reviewerRequests` or `me` route; not surfaced in this pass.
**External deps.** None.
**Atoms.** This IS the atom.
**Mode.** Both.
**Gap.** Production path unclear from this pass — flag for follow-up.

### Mode handling

### 44. Real distinction between incremental (<5s) and full-pass (30-120s) modes

**Intended.** Two distinct code paths or budget-aware execution modes per [40_design_accelerator.md:142-153](P:\doc_repo\40_design_accelerator.md#L142-L153) and [27_engine_evolution_plan.md:25-29](P:\doc_repo\27_engine_evolution_plan.md#L25-L29).
**Current state.** missing — same code path serves both surfaces.
**Evidence.** Grep across `artifacts/` and `lib/` for `incremental`, `fullPass`, `full-pass`, `full_pass`, `INCREMENTAL`, `FULL_PASS` returns one comment-mentioning match in `lib/codes/src/promptFormatter.test.ts` and one flag mention in `artifacts/api-server/src/routes/renders.ts` — neither is a real mode-branch. `generateFindings` and `generateBriefing` have one path each.
**External deps.** N/A.
**Atoms.** N/A.
**Mode.** Both (literally — there's no branch).
**Gap.** Mode-switching is purely aspirational. This is a load-bearing architectural claim in the canonical docs that the code does not back.

### 45. Performance measurements

**Intended.** Timing instrumentation present.
**Current state.** partial — finding-runs and briefing-generation-jobs rows carry `startedAt` and `completedAt`, but no per-stage breakdown.
**Evidence.** `finding_runs` columns at [lib/db/src/schema/findingRuns.ts:54-124](P:\legacy-design-tools\lib\db\src\schema\findingRuns.ts#L54-L124) include `startedAt`, `completedAt`. `briefing_generation_jobs` similarly at [lib/db/src/schema/briefingGenerationJobs.ts:52-115](P:\legacy-design-tools\lib\db\src\schema\briefingGenerationJobs.ts#L52-L115). No per-stage timing (embed query → retrieve → LLM → validate breakdown).
**External deps.** None.
**Atoms.** Run rows.
**Mode.** Both.
**Gap.** Top-level only. No way to attribute latency to retrieval vs LLM vs validation.

### 46. Caching between modes

**Intended.** Full-pass results reused by incremental.
**Current state.** N/A — there's no mode distinction (§44).
**Evidence.** N/A.
**External deps.** N/A.
**Atoms.** N/A.
**Mode.** N/A.
**Gap.** When modes are introduced, §28 retrieval cache becomes load-bearing.

### AI/LLM usage

### 47. Anthropic API call sites — Sonnet vs Haiku

**Intended.** Sonnet for complex writing, Haiku for classification per [40_design_accelerator.md:181-182](P:\doc_repo\40_design_accelerator.md#L181-L182).
**Current state.** partial — Sonnet 4.5 everywhere; Haiku not used.
**Evidence.** Grep for `claude-haiku` across `artifacts/` and `lib/` returns zero matches. Sonnet 4.5 used at: [lib/finding-engine/src/anthropicGenerator.ts:38](P:\legacy-design-tools\lib\finding-engine\src\anthropicGenerator.ts#L38), [lib/briefing-engine/src/anthropicGenerator.ts:23](P:\legacy-design-tools\lib\briefing-engine\src\anthropicGenerator.ts#L23), [lib/submission-classifier/src/constants.ts:17](P:\legacy-design-tools\lib\submission-classifier\src\constants.ts#L17), [artifacts/api-server/src/lib/sheetContentExtractor.ts:36](P:\legacy-design-tools\artifacts\api-server\src\lib\sheetContentExtractor.ts#L36). Sonnet 4.6 used at [artifacts/api-server/src/routes/chat.ts:748](P:\legacy-design-tools\artifacts\api-server\src\routes\chat.ts#L748) and [artifacts/api-server/src/routes/communications.ts:242](P:\legacy-design-tools\artifacts\api-server\src\routes\communications.ts#L242). Prompts inline in `prompt.ts` files (no separate templates directory).
**External deps.** Anthropic API.
**Atoms.** N/A.
**Mode.** Both.
**Gap.** Submission classification (`submission-classifier`) at Sonnet 4.5 is overkill cost-wise — Haiku would be a quick model-swap win.

### 48. Output parsing — JSON mode? Tool use? Free-form parse?

**Intended.** Structured output safe to parse.
**Current state.** works — strict JSON freeform parse with markdown-fence tolerance.
**Evidence.** Finding-engine at [lib/finding-engine/src/anthropicGenerator.ts:64-69](P:\legacy-design-tools\lib\finding-engine\src\anthropicGenerator.ts#L64-L69) strips accidental `\`\`\`json...\`\`\`` fence. Briefing-engine same pattern at [lib/briefing-engine/src/anthropicGenerator.ts:48-54](P:\legacy-design-tools\lib\briefing-engine\src\anthropicGenerator.ts#L48-L54). Submission classifier per `parseClassificationResponse()`. No Anthropic tool-use, no extended-thinking mode (would benefit reasoning chain capture per §35).
**External deps.** Anthropic.
**Atoms.** N/A.
**Mode.** Both.
**Gap.** No tool-use means no structured retrieval-during-generation. Code-cross-reference traversal at LLM-call time (ADR-010 Alt 1) would need tool-use.

### 49. Error handling on LLM failures

**Intended.** Graceful degradation; retry on transient errors.
**Current state.** partial — typed errors but no retry, no backoff.
**Evidence.** [lib/finding-engine/src/anthropicGenerator.ts:272-276](P:\legacy-design-tools\lib\finding-engine\src\anthropicGenerator.ts#L272-L276) — errors bubble: `anthropic_call_failed`, `anthropic_invalid_json`, `anthropic_invalid_finding_shape`. Same shape in briefing-engine at lines 114-118. No retry logic, no exponential backoff. The `integrations-anthropic-ai/batch/index.ts` has retry helpers (`isRateLimitError`, `p-retry`) but those are not used by finding-engine or briefing-engine.
**External deps.** Anthropic.
**Atoms.** N/A.
**Mode.** Both.
**Gap.** Finding-runs row's `state=failed` + `error` columns capture the failure but require manual re-trigger.

### 50. Token / cost accounting

**Intended.** Track per-finding cost; budget per jurisdiction.
**Current state.** missing.
**Evidence.** No cost tracking in finding-engine or briefing-engine. No usage telemetry to a metering store. The cost-per-jurisdiction commitment ([CLAUDE.md:29-31](P:\doc_repo\CLAUDE.md#L29-L31): "under 200 dollars compute plus one hour human review") has no measurement scaffold.
**External deps.** Anthropic API returns `usage` in response — not captured.
**Atoms.** Would slot into a metering atom.
**Mode.** Both.
**Gap.** Cost commitment is unmeasurable today.

### Test coverage and quality

### 51. Test projects run end-to-end

**Intended.** Active prod test projects from [40_design_accelerator.md:58-77](P:\doc_repo\40_design_accelerator.md#L58-L77): Alexander 404, Musgrave, Seguin, Balsley, Dart Frog.
**Current state.** partial — Musgrave and Seguin in `lib/db/src/seed.ts` per [10_ground_truth.md:248-250](P:\doc_repo\10_ground_truth.md#L248-L250); others memory-only.
**Evidence.** Seed file referenced (not directly read in this pass). No end-to-end test fixture for any specific project in `artifacts/api-server/src/__tests__/`. Test pattern is unit + route-level, not project-level integration.
**External deps.** Postgres + Neon.
**Atoms.** N/A.
**Mode.** Both.
**Gap.** No "run Musgrave through the engine and see what comes out" smoke test. This is what eval-harness work per [49_code_ingestion_pipeline.md](P:\doc_repo\49_code_ingestion_pipeline.md) B.4 would unblock.

### 52. Eval harness or scoring rubric

**Intended.** Automated scoring of engine output against ground-truth.
**Current state.** missing for finding-engine. Partial for code corpus (mentioned in 49 B.4).
**Evidence.** No `eval/` directory. No `evals.test.ts`. The `lib/codes` package has `__tests__/landUseSmoke.test.ts` (real-embeddings smoke per recon) — closest thing to an eval, but it's connectivity testing, not quality scoring.
**External deps.** None.
**Atoms.** N/A.
**Mode.** N/A.
**Gap.** Eval is the most-cited Phase 2 prereq across [42_design_accelerator_program_plan.md](P:\doc_repo\42_design_accelerator_program_plan.md) and [49_code_ingestion_pipeline.md](P:\doc_repo\49_code_ingestion_pipeline.md). Nothing in place.

### 53. Regression test suite for findings

**Intended.** Snapshot test: same input → same output (modulo non-determinism).
**Current state.** partial — finding-engine has unit tests for engine, anthropicGenerator, citationAdapter, mockGenerator, prompt; not a regression-suite per se.
**Evidence.** [lib/finding-engine/src/__tests__/](P:\legacy-design-tools\lib\finding-engine\src\__tests__) — 5 test files. Tests verify behavior (citation discard, severity parse, etc.) but mock generator is non-deterministic ULID per recon (`Date.now() + Math.random()` per mockGenerator.ts line 32).
**External deps.** None.
**Atoms.** N/A.
**Mode.** Both.
**Gap.** No "given this Musgrave snapshot, expect these findings" regression fixture.

### 54. Known false-positive log or finding-quality log

**Intended.** Captured FP rate.
**Current state.** missing.
**Evidence.** Status enum on findings table (per [lib/db/src/schema/findings.ts:114-274](P:\legacy-design-tools\lib\db\src\schema\findings.ts#L114-L274)) implies a rejected state, but no aggregation table or query surfaced in routes or lib.
**External deps.** None.
**Atoms.** Would be paired with `adjudication-record` per [27_engine_evolution_plan.md:263-308](P:\doc_repo\27_engine_evolution_plan.md#L263-L308).
**Mode.** Full-pass.
**Gap.** FP/FN measurement is not instrumented.

### Cross-cutting

### 55. Observability — logs, traces, metrics

**Intended.** Per-stage logging, structured fields, traceability.
**Current state.** partial — Pino structured logging is wired (`logger` from `lib/logger.ts`). No tracing (OpenTelemetry, etc.). No metrics emission.
**Evidence.** [artifacts/api-server/src/lib/logger.ts](P:\legacy-design-tools\artifacts\api-server\src\lib\logger.ts) — Pino singleton. `pino-http` for request logging. No OTel deps. No `metrics.` or `gauge.` calls.
**External deps.** Pino.
**Atoms.** N/A.
**Mode.** Both.
**Gap.** Cloud Run cutover will need observability before scale.

### 56. Error states and fallbacks per stage

**Intended.** Each pipeline stage handles its failure mode.
**Current state.** partial.
**Evidence.** Engine errors bubble (per §49). Auto-triggers swallow errors (per autoTriggerFindingsOnSubmissionCreated.ts:17-31). Briefing kickoff swallows errors (similar pattern). Sheet extraction returns `{kind: "error"}` (sheetContentExtractor.ts:60+). No structured circuit-breaker, no fallback chain.
**External deps.** Anthropic, OpenAI, Neon, GCS.
**Atoms.** Run-state rows capture terminal failure.
**Mode.** Both.
**Gap.** Fire-and-forget pattern means architect-side surfaces have to poll `finding_runs.state` to know an engine failed (which is what SSE does per `routes/submissionEvents.ts`).

### 57. Idempotency on re-ingest

**Intended.** Re-upload same IFC / same snapshot doesn't duplicate atoms.
**Current state.** works — at sheet upsert and IFC ingest.
**Evidence.** Sheet upsert at [artifacts/api-server/src/routes/sheets.ts:458-598](P:\legacy-design-tools\artifacts\api-server\src\routes\sheets.ts#L458-L598) uses INSERT...ON CONFLICT, tracks wasInsert flag (line 488). IFC ingest at [artifacts/api-server/src/lib/ifcIngest.ts:260-314](P:\legacy-design-tools\artifacts\api-server\src\lib\ifcIngest.ts#L260-L314) deletes prior materializable_elements on re-upload then re-inserts. Engagement-match GUID race rebind at snapshots.ts:681-699.
**External deps.** Postgres uniques.
**Atoms.** N/A.
**Mode.** Both.
**Gap.** Materializable-element delete-and-reinsert breaks atom history per ADR-001 — should be append + supersede chain, not delete. Inference (marked).

### 58. Recent commits in `artifacts/api-server/src/` (last 50)

**Intended.** What's been actively worked on.
**Current state.** works — git log surfaces an active engine fleet.
**Evidence.** Recent commits on engine code (verbatim, last 30 touching `artifacts/api-server/src/` + `lib/finding-engine/` + `lib/briefing-engine/` + `lib/codes/` + `lib/integrations-anthropic-ai/` + `lib/comment-letter/` + `lib/submission-classifier/`):

```
e4b15c1 ci(cloud-run): mount SNAPSHOT_SECRET to canary (#24)
da07fee ci(cloud-run): fix first-service deploy + unauthenticated CI flag (#23)
99a6a02 fix(api-server): resolve web-ifc wasm dir via entry point, not package.json
25e0b0e Track B — Server IFC ingest, parse, atom persistence (#15)
2c83096 feat(adapters): PL-04 federal adapters fire nationwide on geocode
c7a225c refactor(api,scripts): extract submission-classifier into shared workspace package
9d60025 feat(api): hydrate Session.requestor.disciplines + adopt UpdateMyDisciplinesBody + Track-1 classification backfill script
76dbd59 feat(api): add submission-classification atom + auto-classifier on submission.created
4300819 Task #516: Architect-side 3D completion in design-tools
bbc8641 qa: harden autopilot run lifecycle (Task #508)
148a519 Task #501: CSV export for Compliance Engine runs
7f03cf1 Task #499 — Per-bucket count badges on In Review / Approved / Rejected
75eaa96 Task #503 — QA dashboard polish + Triage queue
5707b7a Task #492 — Build the Code Library browser
ea9876a Task #493 — Compliance Engine console (review-fix pass)
9c0599d Task #484: Notify the team when QA Autopilot finishes a sweep with red suites.
31c1624 Task #485: integration test for autopilot orchestration
6728ce1 Task #483: Suggested patches for app-code autopilot findings
9f0b582 Task #482 — QA Dashboard Autopilot
28eddf3 PLR-11 (review fixes round 2): derive PDF state from recorded atom + sync test schema.
c137941 Task #481: QA Dashboard artifact
3b48b84 Task #477 (PLR-8): sheet content + cross-ref extraction pipeline
67c9a1e Task #479: Retire legacy POST/GET /engagements/:id/submissions/:submissionId/response
09dc887 Task #472: Make canned-finding library multi-tenant via session
```

Pattern: heavy QA autopilot work, Compliance Engine console (#493), CSV export (#501), classification atom (#76dbd59), sheet content extraction (#3b48b84, #d7b80df), Track B IFC ingest (#25e0b0e). Briefing auto-fire (#30dfad4), findings auto-fire (#99c4187), bimElements wire-up (#d8d191f V1-7).

**External deps.** N/A.
**Atoms.** N/A.
**Mode.** N/A.
**Gap.** None — actively maintained codebase.

### 59. Prior QA-note files or known-issues files

**Intended.** Repo-level documentation of bugs/gaps.
**Current state.** missing — none exist.
**Evidence.** No `BUGS.md`, `KNOWN-ISSUES.md`, `QA_NOTES.md`, `STATE.md`, `TODO.md`, or `README.md` at any depth in `artifacts/api-server/` or repo root per first-pass recon. Documentation lives in canonical doc_repo or inline comments referencing Task #XXX / PLR-N / V1-N / AIR-N.
**External deps.** N/A.
**Atoms.** N/A.
**Mode.** N/A.
**Gap.** All status tracking lives in doc_repo. Acceptable convention since this is the satellite repo.

## BIM analysis deep section

Synthesizes items 6-15. Question: **can the engine analyze a BIM model today, partially, or only nominally?**

**Verdict: nominally analyzable, structurally incapable of geometric reasoning.**

What runs end-to-end on a Musgrave-style IFC right now:

1. Architect clicks Send Snapshot in Revit add-in ([41_revit_connector.md:90+](P:\doc_repo\41_revit_connector.md#L90)).
2. IFC blob arrives at `POST /api/snapshots/:id/ifc` ([artifacts/api-server/src/routes/snapshots.ts:989-1011](P:\legacy-design-tools\artifacts\api-server\src\routes\snapshots.ts#L989-L1011)).
3. `ingestSnapshotIfc()` uploads the IFC blob to GCS ([artifacts/api-server/src/lib/ifcIngest.ts:246-256](P:\legacy-design-tools\artifacts\api-server\src\lib\ifcIngest.ts#L246-L256)) and persists `snapshot_ifc_files` row.
4. `parseIfc()` opens the model via `web-ifc ^0.0.71` in a process-singleton WASM runtime ([artifacts/api-server/src/lib/ifcParser/wasmRuntime.ts:1-97](P:\legacy-design-tools\artifacts\api-server\src\lib\ifcParser\wasmRuntime.ts#L1-L97)) and walks 10 entity types (WALL, WALLSTANDARDCASE, SLAB, DOOR, WINDOW, SPACE, COLUMN, BEAM, ROOF, BUILDINGPROXY) extracting GlobalId, Name, Description, ObjectType, PredefinedType ([artifacts/api-server/src/lib/ifcParser/index.ts:46-135](P:\legacy-design-tools\artifacts\api-server\src\lib\ifcParser\index.ts#L46-L135)).
5. `gltfEmitter` converts geometry to a consolidated glTF with vertex colors but no PBR materials ([artifacts/api-server/src/lib/ifcParser/gltfEmitter.ts:1-127](P:\legacy-design-tools\artifacts\api-server\src\lib\ifcParser\gltfEmitter.ts#L1-L127)).
6. Per-entity `materializable_elements` rows are written with `sourceKind=as-built-ifc`, carrying `ifcGlobalId`, `ifcType`, `label`, and `propertySet` JSON ([artifacts/api-server/src/lib/ifcIngest.ts:355-367](P:\legacy-design-tools\artifacts\api-server\src\lib\ifcIngest.ts#L355-L367)). One bundle row `sourceKind=as-built-ifc-bundle` carries the glTF object path.
7. Downstream, when findings generate for a submission whose engagement has a briefing, the finding-engine receives those elements as `BimElementInput[]` ([artifacts/api-server/src/routes/findings.ts:589-612](P:\legacy-design-tools\artifacts\api-server\src\routes\findings.ts#L589-L612)) and renders them in the prompt as a `<bim_elements>` block of strings ([lib/finding-engine/src/prompt.ts:144-147](P:\legacy-design-tools\lib\finding-engine\src\prompt.ts#L144-L147)).
8. The LLM may set `elementRef` on a finding to point at a parsed element by string. That's the full BIM-to-finding linkage.

What does NOT run:

- **No geometric/spatial reasoning.** The LLM sees `IfcWall (GlobalId 1aBcD..., Name "Wall-Exterior-North")` but no dimensions, coordinates, materials, R-values, or quantities. A finding like "wall thickness violates IRC R601.3" cannot be substantiated by data — the engine can only flag the wall by name.
- **No setback intersection.** Parcel boundary is not extracted from the IFC into a queryable shape. Setback rules in `lib/adapters/src/local/setbacks/` ([lib/adapters/src/local/setbacks/index.ts:1-87](P:\legacy-design-tools\lib\adapters\src\local\setbacks\index.ts#L1-L87)) are scalar values that the briefing prose mentions, not constraints applied to geometry.
- **No height check against parsed BIM.** Building height is not derived from the geometry. The IRC max-height rule cannot be applied to the model.
- **No element classification beyond IFC type.** No structural / envelope / interior layer.
- **No APS integration.** Doc claim at [40_design_accelerator.md:181-184](P:\doc_repo\40_design_accelerator.md#L181-L184) ("APS paid tier active. Model Derivative + AEC Data Model APIs load-bearing.") is aspirational on the server. The Revit add-in handles Revit-API operations directly; server-side APS is absent.
- **No `bim-model` atom production on IFC ingest.** That atom is materialized on Push-to-Revit per `bimModels.ts`. The as-built IFC and the to-be-built design are not symmetric peers in the atom graph.
- **No automated divergence detection.** `briefing-divergence` atom is reactive (recorded by external trigger), not computed by comparing IFC entities against briefing's expected `materializable-element` list.
- **`snapshot_ifc_files` table missing on helium dev** per [10_ground_truth.md:330](P:\doc_repo\10_ground_truth.md#L330) — applied to prod but not dev; local IFC ingest will fail until schema is synced.

Net effect: a Musgrave IFC can be uploaded, persisted, viewed via glTF, and reach the finding-engine as element metadata. The LLM can reference an element by name when generating a finding. The engine can neither validate geometric claims nor measure compliance dimensionally.

## Plan-sheet analysis deep section

Synthesizes items 16-22. Question: **can the engine analyze plan sheets today, partially, or only nominally?**

**Verdict: partial — text extraction works, structured annotation extraction is missing.**

What runs end-to-end:

1. Architect sends sheets via Revit add-in (rasterized to PNG before upload) to `POST /api/snapshots/:id/sheets` ([artifacts/api-server/src/routes/sheets.ts:161-804](P:\legacy-design-tools\artifacts\api-server\src\routes\sheets.ts#L161-L804)).
2. Sheets are upserted idempotently — `sheet.created` event on fresh insert, `sheet.updated` with field-level diff on conflict-update. Thumbnail PNG and full PNG stored as `bytea` columns directly on `sheets` row.
3. Removal of sheets present in prior snapshot but absent in new snapshot is detected and `sheet.removed` events fire.
4. After upsert, `runSheetContentExtraction()` fires fire-and-forget per sheet whose `contentBody` is null at metadata time ([artifacts/api-server/src/routes/sheets.ts:765-800](P:\legacy-design-tools\artifacts\api-server\src\routes\sheets.ts#L765-L800)).
5. `sheetContentExtractor` ([artifacts/api-server/src/lib/sheetContentExtractor.ts:1-203](P:\legacy-design-tools\artifacts\api-server\src\lib\sheetContentExtractor.ts#L1-L203)) selects mode from `SHEET_CONTENT_LLM_MODE` env (default `"mock"`).
6. In `"anthropic"` mode, calls Claude Sonnet 4.5 vision (model id `claude-sonnet-4-5`, max 1500 tokens) over the sheet PNG with system prompt "You are an OCR/transcription assistant for architectural drawing sheets. Extract every legible block of free-text..." (lines 54-62).
7. Returns one of `{ kind: "text", body: string }`, `{ kind: "empty" }`, `{ kind: "error", err }`. Text is clipped at 8000 chars (`SHEET_CONTENT_BODY_MAX_CHARS`).
8. Result patches `sheets.contentBody` column directly. No `sheet-content-extraction` atom.

What does NOT run:

- **No structured annotation extraction.** Revision clouds, dimension callouts, schedules, legends, title block fields, PE stamps — the prompt does not ask for structured output and the type returned has only `body: string`. L2 from [40a_customer_zero_observations_arena_roja_2026_05_06.md:28-29](P:\doc_repo\40a_customer_zero_observations_arena_roja_2026_05_06.md#L28-L29) is partly addressed (text yes), partly missing (structure no).
- **No `sheet-content-extraction` atom.** Per [27_engine_evolution_plan.md:97-101](P:\doc_repo\27_engine_evolution_plan.md#L97-L101) this should be a separate atom carrying `annotations[]`, `dimensionCallouts[]`, `revisionClouds[]`, `attachedDocRefs[]`. Today the extracted text rides in `sheets.contentBody` only.
- **No `attached-document` atom.** Attached PDFs (ICC-ES reports, Rescheck, structural calcs) per [27_engine_evolution_plan.md:103-107](P:\doc_repo\27_engine_evolution_plan.md#L103-L107) — unregistered, no ingest, no extraction.
- **No Tesseract or alternate OCR.** Single Claude Sonnet 4.5 vision pass, no fallback chain.
- **Mock default.** Production behavior is opt-in via env flag.
- **No sheet-to-finding linkage in citations.** A finding can reference a `briefing-source` (id-keyed) but not a specific sheet/page. The `elementRef` field carries a BIM-element string, not a sheet reference. Same root gap as §22.
- **Cross-reference hyperlinks were added in PLR-8** (commit `3b48b84`, `d7b80df`) — the only structured-extraction work that has landed.

Net effect: an Arena Roja-style sheet stack can be uploaded, OCR'd to plain text, and the text becomes available for the finding-engine and chat surfaces. The granular comparison that 40a L2 wants ("compare revised sheets against the comment report annotation-by-annotation") cannot be answered.

## Cross-cutting findings

1. **Pure-LLM compliance with no structural fallback.** Every analytical surface (finding-engine, briefing-engine, sheet content extraction, submission classification, comment-letter polish) routes a single prompt to Anthropic and parses JSON. There is no rules engine, no constraint solver, no structural pre-filter. The risk: a model regression silently degrades every surface simultaneously, and there is no eval to catch it.

2. **Mock-default everywhere.** Default modes for finding-engine (`mock`), briefing-engine (`mock`), submission-classifier (`mock`), sheet content extractor (`mock`) means an unconfigured environment generates fixtures, not real findings. Useful for CI, dangerous if a prod env var rotation silently flips a surface back to mock.

3. **Mode-aspirational architecture.** Incremental vs full-pass is a load-bearing doc claim that the code does not back. Same path serves both surfaces. When the engine factor-out lands ([adr_008_engine_factor_out.md](P:\doc_repo\80_adrs\adr_008_engine_factor_out.md)), `hauska-engine` will need to model modes as real budget-aware execution branches, not a single path.

4. **Citations are inline, not structured.** The finding's `text` contains `[[CODE:atomId]]` and `{{atom|briefing-source|id|label}}` tokens. Downstream UI/PDF rendering must re-parse these tokens. The `citations` array is a redundant index, not the source of truth. For ADR-012 `.atompack` export, this means findings need a re-render pass before export.

5. **Atom registry is the 19 from 2026-05-05.** Bump 1 atoms ([27_engine_evolution_plan.md:225-244](P:\doc_repo\27_engine_evolution_plan.md#L225-L244)) — code-pipeline (6), DA-side new (6), Codex-side (3), adjudication-context (3) — are unbuilt. cc-agent-AC's M2-C extraction at `@hauska/atom-contract@1.0.0` is the gate per the same doc.

6. **Retrieval is rudimentary.** Vector-only with lexical fallback (no hybrid combiner), no graph traversal, no jurisdiction edition pinning, no cache. The K=8 / 0.35-threshold tuning is on 215 atoms — sensitivity at scale is open.

7. **Geometric reasoning is the missing leg.** BIM analysis cannot answer geometric questions. The engine treats the model as a flat catalog of named entities. Every quantitative claim in a finding must be supplied as text in the briefing or code section — the model cannot derive new facts.

8. **No cost/usage instrumentation.** Per-request token usage from Anthropic is not captured. Cost-per-jurisdiction commitment ([CLAUDE.md:29-31](P:\doc_repo\CLAUDE.md#L29-L31)) cannot be enforced.

9. **Engine packages are well-isolated.** `finding-engine`, `briefing-engine`, `codes`, `integrations-anthropic-ai`, `comment-letter`, `submission-classifier`, `plan-review-pdf` form a small clean DAG (see §Side-intel). Factor-out to `hauska-engine` is structurally low-friction.

10. **Active engineering velocity is high.** Last 30 commits on engine code show Compliance Engine console, classification atom, sheet content extraction, Track B IFC ingest, briefing auto-fire, findings auto-fire, bimElements wire-up — none of these existed two months ago. The engine is young, not stuck.

## Recommended dispatch shape

Sketches only, not detailed dispatches.

**Dispatch A: Add `sheet-content-extraction` and `attached-document` atoms with structured extraction.** L2/L3 fix per 40a. XS (registration) + M (structured extraction prompt redesign + schema). Parallel-safe against cc-agent-UI (different surface), needs cc-agent-AC coordination on contract bump.

**Dispatch B: Add `code-edition` pinning + `code-cross-reference` traversal to retrieval.** XS (schema additions) + S (retrieval upgrade) + S (one-line jurisdiction edition filter). Parallel-safe against cc-agent-UI, parallel-safe against cc-agent-AC (different atom set), feeds cc-agent-E for engine factor-out.

**Dispatch C: Eval harness against the five active test projects.** S (fixture extraction from `lib/db/src/seed.ts` + memory) + M (rubric design + scoring) + S (CI wiring). Parallel-safe broadly. The single highest-leverage dispatch for Phase 2 QA-readiness gating per [42_design_accelerator_program_plan.md](P:\doc_repo\42_design_accelerator_program_plan.md).

**Dispatch D: Cost & latency instrumentation.** S — wrap Anthropic call sites to capture `usage` and `duration_ms`, log to `finding_runs` / `briefing_generation_jobs`. Unlocks both cost-per-jurisdiction enforcement and the §44 mode distinction (full-pass vs incremental becomes empirically distinguishable). Parallel-safe.

## Side-intel for cc-agent-E

**Portable to `hauska-engine` as-is:**

- `lib/finding-engine/` — 7 source files, 5 test files. Clean public API (`generateFindings`, types, prompt builders). Single Anthropic dependency. Move whole.
- `lib/briefing-engine/` — 7 source + 8 test files. Same shape. Move whole.
- `lib/codes/src/embeddings.ts`, `retrieval.ts`, `bootstrap.ts`, `contentHash.ts`, `sourceRegistry.ts` — corpus retrieval + ingest scaffolding. Move whole.
- `lib/codes/src/promptFormatter.ts` — prompt assembly for chat surfaces; reusable.
- `lib/integrations-anthropic-ai/` — SDK wrapper, batch helpers. Move whole.
- `lib/comment-letter/` — markdown assembly + LLM polish. Move whole.
- `lib/submission-classifier/` — classification atom + auto-classifier. Move whole.

Dependency graph (clean DAG):

```
finding-engine ─► briefing-engine ─► integrations-anthropic-ai
                                     ▲
comment-letter ─► finding-engine ────┘
                          
codes ─► db (schema only — will need an engine-side db abstraction)
submission-classifier ─► db, empressa-atom, integrations-anthropic-ai
plan-review-pdf ─► comment-letter
```

**Needs porting with care:**

- `lib/codes/src/orchestrator.ts` + `queue.ts` — warmup orchestrator depends on Postgres queue table. Refactor for either engine-owned DB or DB-injection pattern.
- `lib/codes/src/jurisdictions.ts` — hard-coded jurisdiction map (Grand County UT + Bastrop TX). Either keep as authoritative or move to data file.
- `lib/adapters/` — federal/state/local data adapters. Massive surface (27+ exports per recon). May not belong in engine — could live in a separate `hauska-adapters` package.
- `lib/empressa-atom/` — atom contract. cc-agent-AC's M2-C extraction at `@hauska/atom-contract@1.0.0` (per [CLAUDE.md:83](P:\doc_repo\CLAUDE.md#L83)) is the natural seam. Engine should depend on the extracted contract.
- The `materializable-element` ingest path mixes IFC parsing with atom production. Engine version should separate the IFC parser (a tool) from the atom-production logic (engine-internal).

**Design fresh, do not port:**

- **Mode handling.** Build incremental vs full-pass as a real budget-bounded execution surface, not a parameter. Incremental should be sub-second; full-pass can be minutes. These are different code paths and possibly different orchestration models.
- **Rules layer.** Add a structural rules pass before / alongside the LLM. Setbacks, heights, lot coverage, egress widths are computable directly when the BIM model exposes geometry. The LLM should compose structural results, not derive them.
- **Geometric reasoning module.** Per the BIM analysis section above — the missing leg. Engine-fresh design here unblocks dimensional compliance.
- **Graph retrieval per ADR-010.** Hybrid vector + graph traversal. The legacy implementation is vector-only with lexical fallback.
- **Eval harness.** Fresh design with the 5-project canon as fixtures.
- **Cost / token / latency telemetry.** Surface from day one in `hauska-engine`. The legacy engine has no scaffold for this.
- **Tool-use for retrieval-at-LLM-time.** Per [ADR-010 Alt 1](P:\doc_repo\80_adrs\adr_010_atom_graph_traversal.md). Legacy is pre-retrieve + stuff-context; tool-use unlocks "follow this code cross-reference" mid-generation.

The biggest "what cc-agent-E should know": **the legacy engine is structurally simple but architecturally incomplete.** Porting 90% of it produces a 90%-complete engine. The factor-out value is the clean slate to land the missing 10% (rules, geometry, modes, eval) without retrofitting them onto a working system.

## Open questions for Nick

1. **Mode distinction.** Should the recon's finding that incremental vs full-pass is unbuilt go to [40_design_accelerator.md](P:\doc_repo\40_design_accelerator.md) as a "currently aspirational, gated on `hauska-engine`" note? Right now it reads as built.

2. **`bim-model` atom asymmetry.** IFC ingest produces `materializable-element` rows but no `bim-model` atom; Push-to-Revit produces `bim-model` but no elements. Intended? Or recon-flagged inconsistency to fix in Bump 1?

3. **`intent` atom production path.** Atom is registered (one of the 19) but I couldn't surface a production site in this pass. Is `intent` actively populated anywhere, or is it a v1-stopgap-only placeholder per [CLAUDE.md:99](P:\doc_repo\CLAUDE.md#L99)?

4. **Materializable-element delete-and-reinsert on IFC re-ingest.** Per §57 — this breaks atom history semantics. Was this an intentional shortcut at Track B time, or is the supersede chain the correct path forward?

5. **Sheet content extraction atom vs column.** Worth promoting `sheets.contentBody` extraction output to a separate `sheet-content-extraction` atom now (as part of Bump 1 per [27_engine_evolution_plan.md:225-244](P:\doc_repo\27_engine_evolution_plan.md#L225-L244)), or keep it as a column until structured annotation extraction is also ready?
