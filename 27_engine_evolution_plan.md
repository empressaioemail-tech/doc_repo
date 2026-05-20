---
id: 27_engine_evolution_plan
title: Engine evolution plan and atom registry expansion
status: active
last_updated: 2026-05-19 (Lane A.2 closed: all 7 Cortex atom types locked in engine atom-registry across six Sync B fires; `@hauska-engine/atoms` 0.0.0 → 0.6.0 via PRs #9-#14; 194 workspace tests green at HEAD `7ed915c`; design decisions captured below per cc-agent-E Phase G close-out — state-as-field + declared eventTypes, discriminated unions key on discriminant, advisory helpers, leaf composition, tenant-private accessPolicy throughout. New `deliverable-letter-render` atom spec added under DA-side new atoms per Sprint Amendment 6 — render output IS a first-class atom, not bytes-only. Runtime-layer work the atom shapes deliberately deferred to legacy-design-tools: ICC-ES poller for L5, DOCX/PDF render pipeline for L6. Earlier 2026-05-18 entry: doc-set sweep for ADR-018 substrate-layer reframe.)
applies_to: portfolio
related: [25_atom_architecture_reference, 26_atom_upgrade_guide, 40_design_accelerator, 47_codex_plan_review, 42_design_accelerator_program_plan, 48_codex_program_plan, 49_code_ingestion_pipeline, 46_smartcity_parcel_intelligence, 11a_bastrop_live_roadmap, 08_tiered_access_model, adr_001_atom_architecture, adr_007_cross_stakeholder_atom_access, adr_008_engine_factor_out, adr_010_atom_graph_traversal, adr_011_atom_identity_across_versions, adr_012_atom_export_format, adr_018_atom_contract_substrate_layer]
owner: nick
---

# Engine evolution plan and atom registry expansion

> **Purpose.** Specifies the work on the shared engine (Hauska Engine,
> currently in `legacy-design-tools` `api-server`) that both
> [`42_design_accelerator_program_plan.md`](42_design_accelerator_program_plan.md)
> and [`48_codex_program_plan.md`](48_codex_program_plan.md) depend on.
> Engine work is shared because the architecture per
> [`40_design_accelerator.md`](40_design_accelerator.md) commits to one
> engine codebase serving both surfaces. This doc keeps that work in
> one place; program plans reference it rather than re-specifying it.

## Current state

Engine code lives in the `legacy-design-tools` repository (local: `P:\legacy-design-tools`; remote: `empressaioemail-tech/legacy-design-tools`) under `artifacts/api-server/src/`. Consumed by:

- `legacy-design-tools` `artifacts/design-tools` — DA architect-side UI, incremental mode (<5s)
- `legacy-design-tools` `artifacts/plan-review` — DA architect-side window into Codex output, incremental mode
- `smartcity-os` AI Plan Review surface — Codex 1b reviewer-side, full-pass mode (30–120s). Lands when CDX-1b ships.

The repo name `legacy-design-tools` stays through ADR-008 factor-out; Codex and Cortex are product brands, not the repo name. Factor-out targets a new repo `hauska-engine` in the `empressaioemail-tech` org.

Atom registry at `artifacts/api-server/src/atoms/registry.ts` — 19 domain atoms as of 2026-05-05:

> sheet, engagement, snapshot, submission, intent, briefing-source, parcel-briefing, neighboring-context, materializable-element, briefing-divergence, bim-model, reviewer-annotation, reviewer-request, viewpoint-render, render-output, finding, communication-event, decision-event, submission-classification

Code corpus (legal corpus, distinct from domain atoms) — 479 atoms across four sources as of 2026-05-05:

> Grand County Land Use (215), Bastrop Muni Code (189), Grand County IWUIC (61), Grand County IRC R301.2.1 (14)

Production count needs verification against deployment Neon — see [`10_ground_truth.md`](10_ground_truth.md) Open questions.

Engine factor-out to `hauska-engine` repo is **gated on migration sprint Phase 2C closure** per [ADR-008](80_adrs/adr_008_engine_factor_out.md). Until then, engine work happens in place. Pre-factor-out module discipline matters: how the code is organized now sets up how cleanly factor-out goes later.

## Atom registry expansion

New atoms required for the next product wave (Codex Wave 1 + DA pilot expansion). Driven by customer-zero feedback in [`40a_customer_zero_observations_arena_roja_2026_05_06.md`](40a_customer_zero_observations_arena_roja_2026_05_06.md) and the Codex feature roadmap in [`47_codex_plan_review.md`](47_codex_plan_review.md).

Each atom below specifies: name, purpose, producer/consumer surface(s), key fields, outstanding open questions. Detailed schemas live in code; this is the contract-level spec that drives the contract version bump.

### Codex-side new atoms

#### `firm-tenant`
- **Purpose.** Tenant record for contractor firms in Codex 1a invited mode. Holds firm identity, COI metadata, subscription state, host tool credentials.
- **Producer.** Codex provisioning surface (TBD).
- **Consumer.** Codex 1a + 1b (scope checks per ADR-007).
- **Key fields.** `firmId`, `firmName`, `hostToolBindings[]` (Bluebeam/Acrobat/ProjectDox account refs), `coiPolicies[]`, `subscriptionTier`.
- **Gate.** ADR-009 firm tenancy schema (queued; deferred until 1a returns to active scope).

#### `firm-precedent`
- **Purpose.** Cross-engagement learning aggregation scoped to a firm. The most defensible moat feature per `47_codex_plan_review.md`.
- **Producer.** Codex engine (background aggregation pass).
- **Consumer.** Codex engine (retrieval at review time), Codex web companion (precedent queries).
- **Key fields.** `firmId`, `codeSection`, `precedentSummary`, `sourceFindingIds[]`, `confidence`.
- **Open.** Aggregation cadence (real-time vs nightly batch).

#### `per-reviewer-learning`
- **Purpose.** Individual reviewer adjudication patterns; informs adaptive UI tier per CDX-12.
- **Producer.** Codex engine (per adjudication event).
- **Consumer.** Codex adaptive UI surface.
- **Key fields.** `reviewerId`, `verbosityPreference`, `confidenceThreshold`, `adjudicationPatterns[]`.

#### `audit-trail-anchor`
- **Purpose.** Cryptographic anchor for a property's lineage chain per [ADR-001](80_adrs/adr_001_atom_architecture.md). Powers CDX-15.
- **Producer.** Hauska SDK `EventAnchoringService`.
- **Consumer.** Codex audit export, third-party verification.
- **Key fields.** `propertyId`, `chainHashTip`, `anchorTimestamp`, `anchoringSubstrate` (Polygon CDK / TSA / Hauska cluster — settled in deferred ADR-006).
- **Gate.** Hauska SDK gap closure (33 migration → SDK work).

#### `code-change-broadcast-event`
- **Purpose.** Jurisdiction-wide notification on code adoption; powers CDX-17.
- **Producer.** Codex jurisdiction admin surface.
- **Consumer.** All atoms with matching jurisdiction scope (for version-drift detection).

#### `version-drift-snapshot-diff`
- **Purpose.** Diff between code edition snapshots for an in-flight submission; powers CDX-14.
- **Producer.** Codex engine on jurisdiction code-edition change.
- **Consumer.** Codex web companion (drift alerts).

#### `jurisdictional-precedent`
- **Purpose.** City-to-city learning aggregation per [`06_cities_value_narrative.md`](06_cities_value_narrative.md). Federated, privacy-preserving.
- **Producer.** Codex engine (cross-jurisdiction aggregation pass).
- **Consumer.** Codex web companion (cross-jurisdictional queries via CDX-13 conversational primitive).
- **Open.** Privacy model (property-level anonymization, pattern-level queryability).

### DA-side new atoms (customer-zero driven)

#### `sheet-content-extraction`
- **Purpose.** Extracted graphic content and annotation text from sheet PDFs (L2 fix). Goes beyond existing `sheet` atom (metadata only) and `reviewer-annotation` atom (reviewer's markup only).
- **Producer.** DA sheet ingest pipeline (PDF parse + OCR + annotation extraction).
- **Consumer.** DA `plan-review` artifact (compare-against-comments workflow), Codex (when reviewer-side sees architect's sheet content).
- **Key fields.** `sheetId`, `extractedText`, `annotations[]`, `dimensionCallouts[]`, `revisionClouds[]`, `attachedDocRefs[]`.
- **Status note (2026-05-20, post-Lane-C.4).** Atom shape locked at `@hauska-engine/atoms@0.2.0`; legacy persistence + endpoints live in legacy-design-tools (PR #51). **v1 producer is stub** per PR #51 note 4: `extractedText` is populated from flat OCR mapped to a single annotation segment; structured annotation extraction (dimension callouts, revision clouds, drawn annotations) is not yet implemented. Engine-side L2a structured-annotation extractor is a post-sprint follow-on in this stream. Same applies to `attached-document` (no producer yet — atom shape ships, ingest pipeline is the engine follow-on).

#### `attached-document`
- **Purpose.** Supporting docs attached to a submission (ICC-ES reports, Rescheck, structural calcs). Today these are inert PDFs; this atom makes them queryable.
- **Producer.** DA submission ingest.
- **Consumer.** DA `plan-review` (cross-reference findings against supporting docs), Codex (same).
- **Key fields.** `documentType`, `extractedText`, `referencedStandards[]`, `submissionId`.

#### `detail-callout-spec`
- **Purpose.** Structured detail specification (layer-by-layer precision, dimension callouts, scale) generable as Revit content (L4 fix).
- **Producer.** DA `design-tools` artifact (engine generates detail spec).
- **Consumer.** Revit add-in (push to Revit via APS Design Automation API).
- **Open.** Detail library backing — pull from manufacturer/AWI/WDMA/NFRC libraries or generate from scratch?

#### `product-spec-reference`
- **Purpose.** Product spec with live ICC-ES Report verification (L5 fix). E.g., Tremco TREMproof 6100 XT with current ESR status.
- **Producer.** DA engine (product recommendation) + ICC-ES integration (verification).
- **Consumer.** DA `design-tools`, DA `plan-review`.
- **Key fields.** `productName`, `manufacturer`, `esrNumber`, `esrStatus`, `esrExpirationDate`, `lastVerified`.
- **Open.** ICC-ES integration mechanism (API vs scrape vs manual refresh).

#### `deliverable-letter`
- **Purpose.** Multi-section deliverable (comment response letter, plan review letter) with structured sections and recipient metadata (L6 fix). Decouples document assembly from token limits.
- **Producer.** DA `design-tools` (architect-side) or Codex (reviewer-side).
- **Consumer.** DA render pipeline (DOCX/PDF generation).
- **Key fields.** `sections[]`, `recipient`, `jobReference`, `attachmentRefs[]`.

#### `response-task`
- **Purpose.** Interactive persistable task state (L1 fix). Today checklists are markdown-only; this atom makes the workflow queryable and addressable.
- **Producer.** DA `design-tools` (architect interaction).
- **Consumer.** DA `design-tools` (workflow UI).
- **Key fields.** `taskText`, `status` (`open|in_progress|done`), `parentEngagementId`, `linkedFindingIds[]`.

#### `deliverable-letter-render`
- **Purpose.** The rendered DOCX/PDF of a `deliverable-letter` (L3 atom) as a first-class atom (L6 fix). Per Sprint Amendment 6 (2026-05-19): render output IS its own atom — queryable, addressable, version-pinned — not ephemeral bytes returned by a render API call. Multi-render off one letter is 1-to-many and each render is independently addressable for downstream consumers (audit, archive, recipient delivery tracking).
- **Producer.** DA render pipeline in `legacy-design-tools` (runtime-layer work — out of engine atom-registry scope; engine declares the shape, runtime emits instances).
- **Consumer.** DA `design-tools` + `plan-review` UI (download / preview), Codex audit export, agent workflows via `cortex/deliverable_letter_render` MCP tool.
- **Key fields.** `sourceLetterRef` (DID-validated reference to the source L3 `deliverable-letter` atom), `sourceLetterVersion` (pins the rendered-against version per [ADR-011](80_adrs/adr_011_atom_identity_across_versions.md) chain semantics — re-rendering against a later letter version produces a new render atom, not a mutation), `format` (`DOCX | PDF` enum), `blobRef` (opaque pointer to the stored bytes; storage substrate per Stream A's `storage/` module), `renderedAt`, `renderedBy` (actor DID per ADR-015). `accessPolicy: "tenant-private"`.
- **Open.** Render fidelity acceptance bar (typography, page breaks, signature blocks) — runtime concern, not atom-shape concern. ICC-ES-style auto-refresh on the source letter (re-render when the source letter changes version) is a runtime policy decision; the atom shape supports either eager or lazy.

### Code-pipeline atoms (sourced from [`49_code_ingestion_pipeline.md`](49_code_ingestion_pipeline.md))

Produced by the Code Ingestion Pipeline (B.3 atomization stage). Bare reference atoms — free-tier substrate per [`08_tiered_access_model.md`](08_tiered_access_model.md). Consumed by Codex (citation), Cortex (design-time grounding), SmartCity OS (parcel-briefing context). Detailed pipeline design in 49; atom contract specified here for registry coordination.

#### `code-section`
- **Purpose.** A normative rule unit of municipal code (a section / subsection). The leaf for plan-review citation; the anchor for adjudication-record attachment.
- **Producer.** Code Ingestion Pipeline B.3 (per 49). One atom per section per code edition.
- **Consumer.** Codex (finding citation), Cortex (design-time grounding), SmartCity OS (parcel-briefing constraint resolution), `comparable-project-precedent` (link target), `adjudication-record` (link target).
- **Key fields.** `sectionNumber`, `subsectionPath`, `bodyText`, `jurisdictionTenant`, `codeEditionDid` (per ADR-011), `crossReferenceCids[]` (typed links to other code-sections, per ADR-010), `definedTermCids[]` (typed links to `code-definition` atoms), `sourceAdapter`, `sourceFetchedAt`.
- **Open.** Subsection granularity — one atom per section root with subsection sub-content inline, vs. atom-per-subsection. 49 spec leans toward the former; refine empirically against Bastrop UDC reverse pass (B.6).

#### `code-definition`
- **Purpose.** A defined term in municipal code. Referenced by sections that use the term; resolves consistently across the corpus.
- **Producer.** Pipeline B.3.
- **Consumer.** Codex (definition resolution in citations), Cortex (definition lookup at design time), retrieval index for "what does this term mean."
- **Key fields.** `term`, `definitionText`, `jurisdictionTenant`, `codeEditionDid`, `definingSectionCid` (the section the definition is published in), `usingSectionCids[]` (sections that reference this term), `scope` (defined for this section / chapter / whole code).
- **Open.** Cross-jurisdictional term unification — when two jurisdictions define the same term identically, is that one atom referenced from both, or per-jurisdiction copies? Architecturally cleaner as per-jurisdiction (the atom is jurisdiction-scoped); ergonomics may push toward unified. Resolve at B.4 retrieval-tuning.

#### `code-amendment`
- **Purpose.** An ordinance modifying a section. Linked to the original; carries date, authority, effective range. Drives version-tracking (B.5) and the chain that supports `code-edition` queries.
- **Producer.** Pipeline B.3 (when ingesting amendments); Pipeline B.5 (when drift detection surfaces a new amendment).
- **Consumer.** Codex (amendment-aware citation), `code-edition` atom (composition), drift dashboard (B.6).
- **Key fields.** `amendmentOrdinanceId`, `affectedSectionCids[]`, `effectiveDate`, `authority`, `amendmentText`, `replacesSectionCid` (the prior CID being superseded, per ADR-011 chain semantics).
- **Open.** Repeals — an amendment that removes a section. Modeled as a `code-amendment` whose target now resolves to "repealed" sentinel atom, or a separate `code-repeal` event? 49 doesn't settle this; flag for B.5.

#### `code-cross-reference`
- **Purpose.** A typed link from one section to another ("see § 5.04(b)"). Materializes as a first-class atom rather than only a field on `code-section` so retrieval (per ADR-010) can traverse cross-references as edges in the atom graph.
- **Producer.** Pipeline B.2 (structural extraction) → B.3 (atomization).
- **Consumer.** Codex retrieval (engine pre-expansion follows cross-references; LLM tool-call traversal extends further per ADR-010), Cortex.
- **Key fields.** `fromSectionCid`, `toSectionCid`, `referenceText` (the as-printed citation string), `referenceContext` (sentence/clause the reference appears in), `referenceType` (`see`, `notwithstanding`, `subject-to`, `as-defined-in`, …; initial taxonomy seed per ADR-010 link taxonomy).
- **Open.** Reference resolution failures — when the printed citation doesn't resolve to a known section. Quality-bar gate per 49 B.4 specifies 95% resolution; the remaining 5% need a graceful policy (unresolved atom with a flag, or excluded from the graph).

#### `code-edition`
- **Purpose.** A version of a code as adopted at a point in time. The pack-level pointer to which sections + amendments compose the jurisdiction's adopted code on a given date. Enables as-of-time queries ("Bastrop UDC as of 2024-01-01") per ADR-011's chain semantics.
- **Producer.** Pipeline B.5 (when a new edition publishes).
- **Consumer.** Codex (edition selection on submittal intake), Cortex, the `jurisdiction-corpus` aggregator atom, `.atompack` export (per ADR-012 — a pack is a snapshot of an edition).
- **Key fields.** `jurisdictionTenant`, `editionLabel` (`"2024 Bastrop UDC"`), `effectiveFrom`, `effectiveTo` (nullable for current edition), `sectionCids[]` (composition: every section in this edition), `amendmentCids[]`.
- **Open.** Multiple-codes-per-jurisdiction (e.g., Bastrop adopts the UDC + the IRC). One `code-edition` per code, with a jurisdiction-level composition above them, or a single `code-edition` per jurisdiction with multiple code roots? Resolve with B.5 — leaning toward one edition per code, composed under `jurisdiction-corpus`.

#### `jurisdiction-corpus`
- **Purpose.** Pack-level atom referencing all code editions a jurisdiction has adopted. The atom that an `.atompack` export targets (per ADR-012); the discovery anchor for cross-jurisdictional queries.
- **Producer.** Pipeline B.5 / B.6 (when a jurisdiction's first edition lands and on every edition refresh).
- **Consumer.** `.atompack` exporter, Codex jurisdiction switcher, Cortex jurisdiction selection, SmartCity OS jurisdiction-binding logic, public Codex 1a (free-tier consumer).
- **Key fields.** `jurisdictionTenant`, `jurisdictionName`, `adoptedEditionCids[]` (composition), `currentEditionCid` (latest), `coverageQualityBar` (B.4 eval-harness pass state), `lastRefreshedAt`.
- **Open.** "Loaded" status semantics — when is a jurisdiction-corpus atom considered usable for production retrieval? Coupled to B.4's eval-harness quality bar; specifics are 49's open decision (default-quality-bar-threshold), not this atom's.

### Parcel Intelligence atoms (sourced from [`46_smartcity_parcel_intelligence.md`](46_smartcity_parcel_intelligence.md))

Atoms supporting the Parcel Intelligence capability in SmartCity OS Operations Dashboard. Same engine, jurisdiction-scoped. Producer surface and timing depend on Parcel Intelligence's sequencing decision (see 46 Open questions #1) — this section specifies the atoms; their bump timing tracks that decision (see [Contract version bump](#contract-version-bump) below).

**Skipped (already in registry).** `parcel-briefing` is already among the 19 registered atoms (see [Current state](#current-state) atom list). The 46 doc lists it among Parcel-Intelligence-involved atom types but as an *existing* composition target, not a net-new registration. Adding it here would duplicate. Flagged: 46's open spec may need a refresh pass to specify how the existing `parcel-briefing` atom's composition extends to absorb Parcel Intelligence's full source-set (FEMA / USFWS / USGS / USDA / TCEQ / city zoning / city permit history); that's a 46 follow-up, not a registry change.

**Possible overlap (open).** The existing registry has `neighboring-context`. The new `constraint-overlay` and `infrastructure-proximity` atoms below may overlap it. Without a settled spec on `neighboring-context` in the canonical docs, we register the new types and defer dedup to a follow-up pass that reviews `neighboring-context`'s actual contract in code and decides whether to refactor.

#### `parcel-record`
- **Purpose.** Anchoring atom for a parcel. The data-level atom that all Parcel-Intelligence-derived atoms attach to. The `applies-to` target for findings and adjudication-records.
- **Producer.** SmartCity OS parcel-record ingest (initial atomization from county cadastral + city GIS); ongoing extension via Parcel Intelligence pipeline.
- **Consumer.** Codex (parcel context on submittal intake), Cortex (design-time parcel grounding), SmartCity OS Operations Dashboard, every constraint-overlay / infrastructure-proximity / permit-precedent atom (composition target).
- **Key fields.** `parcelDid` (per ADR-011, e.g., `did:hauska:parcel:bastrop-1042-pine`), `jurisdictionTenant`, `cadastralReference` (county parcel ID + book/page if relevant), `geometry` (parcel boundary), `ownerTenantDid` (per ADR-007 tenant-of-record), `currentZoningCid` (link to a `code-section` atom), `extantImprovements` (summary of existing structures), `lastTouchedAt`.
- **Open.** PII handling — parcel ownership exposes citizen identity. Per ADR-001 `piiFields`, ownerTenantDid is scope-filtered. Specifics per ADR-007 unresolved (e.g., unbuilt-parcel ownership lookup); tracked in ADR-007 Open decisions.
- **Note.** This is the long-term anchor data-level atom for the construction-lifecycle domain. Its DID becomes the durable identity that adjudication-records and findings reference. Day-one design matters — see "Compounding-context atoms" section below.

#### `constraint-overlay`
- **Purpose.** A typed atom for each environmental / regulatory overlay applicable to a parcel (FEMA flood, USFWS habitat, TCEQ aquifer zone, city zoning overlay district, etc.). One atom per (parcel × overlay layer) instance.
- **Producer.** Parcel Intelligence ingestion pass — national datasets (FEMA / USFWS / USGS / USDA) atomized once for all jurisdictions; jurisdiction-local overlays atomized per-jurisdiction.
- **Consumer.** `parcel-briefing` composition, Codex (constraint awareness), Cortex (design-time constraint surfacing), `comparable-project-precedent` (matching parcels by overlay profile per ADR-010 `relationship-basis: same-constraint-overlay-profile`).
- **Key fields.** `parcelDid` (link), `overlayType` (`fema-flood-100yr` | `usfws-habitat` | `tceq-edwards-recharge` | `city-zoning-overlay-X` | …), `overlaySource`, `overlayExtentWithinParcel` (geometry intersection), `regulatoryAuthority`, `evaluatedAt`.
- **Open.** Jurisdiction-keyed source-set per 46 Open questions #4 — when the second city is non-TX, TCEQ Edwards isn't applicable. Source-set configuration is per-jurisdiction; the atom type stays uniform.

#### `infrastructure-proximity`
- **Purpose.** A typed atom describing the parcel's relationship to existing public infrastructure (water main, sewer main, road, electrical service). Drives "what's serviceable" briefing content.
- **Producer.** Parcel Intelligence ingestion pass over jurisdiction GIS.
- **Consumer.** `parcel-briefing`, Codex (infrastructure-dependent finding surfacing — e.g., "this parcel lacks sewer connection within 200 ft"), Cortex.
- **Key fields.** `parcelDid` (link), `infrastructureType` (`water-main` | `sewer-main` | `road-public` | …), `distanceFt`, `serviceAvailability` (`connected` | `available-with-extension` | `unavailable`), `gisSource`, `evaluatedAt`.
- **Open.** Telemetry-grade vs. snapshot. This atom is presently a pre-application snapshot; live infrastructure status (boil-water notice, outage, capacity constraint) is out of scope per 46. Spec a separate atom if/when monitoring is in scope.

#### `permit-precedent`
- **Purpose.** A typed link atom surfacing comparable permits / projects in the jurisdiction's own permit history. The "this kind of project went through these review patterns" capability for `parcel-briefing`.
- **Producer.** Parcel Intelligence ingestion pass over jurisdiction permit corpus (MyGov / OpenGov historicals).
- **Consumer.** `parcel-briefing`, Codex 1b reviewer-side, eventually `comparable-project-precedent` (more general cross-finding link atom; `permit-precedent` is the parcel-scoped restriction).
- **Key fields.** `anchorParcelDid`, `comparableParcelDids[]`, `relationshipBasis` (`same-zoning` | `same-overlay-profile` | `similar-improvement-type` | `same-applicant` | …), `comparablePermitCids[]`, `confidence`.
- **Open.** Relationship to `comparable-project-precedent` (specified below in Compounding-context atoms). `permit-precedent` is jurisdiction-local and parcel-anchored; `comparable-project-precedent` is finding-anchored and may be cross-jurisdictional. Both can exist; clarify before implementation that they're not synonyms.

#### `pre-application-input`
- **Purpose.** App-level atom capturing optional pre-application user input (free text, photo of napkin sketch, drawn outline on map). Refines the `parcel-briefing` toward proposed use.
- **Producer.** SmartCity OS Operations Dashboard (city staff / planner / engineer pre-application interaction).
- **Consumer.** Engine (briefing refinement pass), `parcel-briefing` composition.
- **Key fields.** `parcelDid` (link), `inputType` (`text` | `photo` | `sketch-outline-geojson` | `text-with-attachments`), `inputContent` (CID-addressed payload for non-text), `authorTenant`, `submittedAt`, `parsedIntent` (LLM-extracted structured summary).
- **Open.** Per 46 Open questions #2 — MVP scope. Probably `text` only at MVP; `photo` and `sketch-outline-geojson` as type variants pre-declared so adding them later doesn't break the atom contract.

### Engine atom-registry version bump (reframed 2026-05-19 per option β)

**Scope note.** Per cc-agent-AC's 2026-05-18 scope correction at
[`_sessions/2026-05-18_hauska_atom_contract_bootstrap_and_port_cc-agent-AC.md`](_sessions/2026-05-18_hauska_atom_contract_bootstrap_and_port_cc-agent-AC.md),
the new atom types below register in `hauska-engine/packages/atoms/`
against the published `@hauska/atom-contract@1.0.0` framework, NOT
inside the contract package. The contract package stays at 1.0.0
absent unrelated framework changes (new render modes,
`ContextSummary` field additions, etc.). What bumps when new atom
types arrive is the engine atom-registry version. Earlier framing in
this section ("Adding atoms triggers an `@hauska/atom-contract`
version bump") reflected the pre-option-β scope.

**Cortex L1-L6 trajectory landed 2026-05-19.** All seven Cortex atom types shipped across six Sync B fires from Lane A.2 (cc-agent-E), each as its own PR per the dispatch's anti-batching rule. `@hauska-engine/atoms` 0.0.0 → 0.6.0:

| Sync | Atom(s) | hauska-engine PR | atoms version | HEAD |
|---|---|---|---|---|
| B(L1) | `response-task` | #9 | 0.0.0 → 0.1.0 | `31a8f1f` |
| B(L2) | `sheet-content-extraction` + `attached-document` | #10 | 0.1.0 → 0.2.0 | `30b8047` |
| B(L3) | `deliverable-letter` | #11 | 0.2.0 → 0.3.0 | `99d4f5f` |
| B(L4) | `detail-callout-spec` | #12 | 0.3.0 → 0.4.0 | `918f4eb` |
| B(L5) | `product-spec-reference` | #13 | 0.4.0 → 0.5.0 | `b030570` |
| B(L6) | `deliverable-letter-render` | #14 | 0.5.0 → 0.6.0 | `7ed915c` |

194 workspace tests green at HEAD; 112 of them are the L-surface conformance suites (16 + 20 + 23 + 20 + 17 + 16). Per option β the L-surface atoms are catalog-data atoms in the engine atom-registry, not the `@hauska/atom-contract` framework package — the framework stays at 1.1.0 (accessPolicy reuse from Lane Foundation Sync A) absent further primitive changes.

Per-consumer dependency migration to `@hauska/atom-contract@^1.0.0`
runs at each consumer's pace (the framework shape did not change at
extraction; only the package name and home moved):

- `legacy-design-tools` api-server — uses framework primitives for the 19 existing atom-type registrations. Import migration from `@workspace/empressa-atom` to `@hauska/atom-contract` queued as a dedicated cc-agent session within 1-2 weeks per 2026-05-19 planner correction.
- `smartcity-os` api-server — defer pin until Codex 1b actually consumes engine atoms.
- `legacy-revit-sensor` — consumer of `detail-callout-spec`; ~10-minute recon pending to confirm framework import shape.
- `hauska-engine` — published-framework dependency landed 2026-05-19 via PR #1 (atom-contract-pin shim flip).
- Hauska SDK packages — consumer of `audit-trail-anchor` via `EventAnchoringService`; gating on Stream E SDK closure (see audit-trail-anchor note below).

**Renderer obligation.** Every new atom type below ships with all five render modes per [ADR-001](80_adrs/adr_001_atom_architecture.md) (`inline` / `compact` / `card` / `expanded` / `focus`); the `focus` renderer must produce a polished, brand-consistent, offline-capable HTML view per [ADR-012](80_adrs/adr_012_atom_export_format.md) §4 (it's what `.atom` export packages). A net-new atom type that ships without a `focus` renderer cannot be downloadable. This is real engineering cost per atom; budget for it in Stream B implementation.

**Engine atom-registry bump strategy.** Earlier guidance was a single mega-bump for all new atoms. The 2026-05-12 absorption split this into two coordinated minor bumps of the engine atom-registry version (NOT the contract package version, per the scope reframe above):

| Bump | Atom set | Trigger | Rationale |
|---|---|---|---|
| **Bump 1** | Adjudication-context atoms (3, specified in [Compounding-context atoms](#compounding-context-atoms-bastrop-live-capture) below) + code-pipeline atoms (6, this section) + DA-side new atoms (6, this section) + Codex-side new atoms minus deferred (3, this section) | Start of Sprint A.1 in [`11a_bastrop_live_roadmap.md`](11a_bastrop_live_roadmap.md). | Adjudication-context atoms **must capture from A.1 day-one** — retrofitting compounding context is expensive. Code-pipeline atoms ship at B.3 which runs concurrent with A.1+. DA-side new atoms drive customer-zero L1–L6 fixes. Codex-side new atoms (firm-precedent, per-reviewer-learning, version-drift, etc.) ship in A.2 / A.3 windows. All fit one coordinated bump. |
| **Bump 2** | Parcel Intelligence atoms (5, this section) | When [`46_smartcity_parcel_intelligence.md`](46_smartcity_parcel_intelligence.md) Open question #1 resolves (Parcel Intelligence sequencing vs. Bastrop-live). | Parcel Intelligence's producer surfaces don't exist yet; sequencing decision is open. Bundling these into Bump 1 risks shipping unused atom types whose contracts may need to shift once the surface is real. Defer until producer is scoped in. |

**Why two bumps, not one or three.** One bump (status quo): forces parcel atoms to ship before their producer exists; locks in atom contracts against incomplete design. Three bumps (adjudication-context / pipeline / parcel separate): triples coordination overhead for atoms whose A.1-window shipping is already coupled. Two is the minimum cuts the timing properly.

**Audit-trail-anchor remains gated.** `audit-trail-anchor` (Codex-side new atoms) stays held against Stream E SDK gap closure independent of either bump above. When SDK closure lands, audit-trail-anchor can ship in a patch or follow-on minor; coordination is bounded since it's one atom.

Atom additions are non-breaking per ADR-001; existing consumers ignore unknown atoms per the contract's forward-compatibility rules.

**Design decisions captured at L-surface atom-shape lock (2026-05-19, cc-agent-E Phase G close-out).** Five cross-cutting decisions establish the pattern for future atom-shape work in the engine atom-registry:

- **State-as-field with declared event types beats inline event-sourcing for workflow atoms.** L1 (`response-task`), L3 (`deliverable-letter`), L4 (`detail-callout-spec`) carry current state as a field; the atom record is the single source of truth, and the storage event log carries the audit chain via declared `eventTypes` on the registration. Consumers wanting an event-sourced view compose it from the storage event log, not the atom shape. The one inline-history exception is L5 (`product-spec-reference`)'s `statusHistory` chain — the dispatch explicitly asked for a queryable ESR-status chain on the atom because a verifier holding one atom version benefits from not walking the version chain.

- **Discriminated unions key on the discriminant — no redundant flat field.** L4's `spec` payload is a Zod `discriminatedUnion` keyed on `detailType` (`door-schedule` / `wall-section` / `wall-type` / `room-finish`). The enum IS the discriminant, no parallel top-level field carries it — zero drift risk between the atom-level type tag and the spec shape, Zod-native validation. The generalized principle: when a payload varies by a type tag, make the tag the union discriminant and don't also carry it as a top-level field.

- **Advisory helpers, not runtime enforcement.** `deliverableLetterCompleteness` (L3) and `isLegalPushTransition` (L4) are exported helpers consumers consult; the engine atom-registry enforces nothing at runtime. Keeps the registry a pure declarative surface; legality / completeness gating happens at the consumer boundary (server-side for MCP tools, UI-side for direct UI use) — consistent with how the code-corpus atoms behave.

- **Leaf composition throughout.** All six L-atoms use `composition: []`. Cross-atom references (`findingId`, `sourceLetterRef`, per-section provenance) are data fields consumers resolve themselves, not declared composition edges. The atom-contract's flat `dataKey` composition model doesn't fit nested or single-ref provenance cleanly; keeping these atoms leaf-composition is consistent and simple. Composition is for actual pack-level aggregation (e.g., `jurisdiction-corpus` over `code-edition`), not for cross-atom data references.

- **`accessPolicy: "tenant-private"` for every L-atom.** Engagement workflow data is never public-catalog (per [ADR-017](80_adrs/adr_017_atom_access_control.md)). Cross-tenant scope for these atoms is shaped via the per-engagement actor / principalActor links (ADR-015), not via the contract-level access policy field.

**Runtime-layer deferrals.** Two pieces of L-surface work are explicitly out of engine atom-registry scope and land in `legacy-design-tools` instead per Sprint Amendment 6:

- **L5 ICC-ES poller** — live-verification of `product-spec-reference` ESR status against ICC-ES is runtime concern. The atom shape carries `statusHistory` to support the eventual poller; the poller itself lives at the consumer boundary.
- **L6 DOCX/PDF render pipeline** — the atom shape declares the render output as a first-class atom (`deliverable-letter-render`); the actual rendering (document assembly, template engine, byte output) is runtime-layer work in legacy-design-tools. The atom shape supports either eager or lazy render policy.

**Bump 1 window — behavior fixes (not contract changes; NOT part of the substrate-v1 5-repo cross-PR rollout).** Two fixes land in the post-Sync-1 unlock window without changing the contract shape, surfaced by the 2026-05-18 plan-review engine recon at [`_sessions/2026-05-18_plan_review_engine_inventory_cc-agent-PR.md`](_sessions/2026-05-18_plan_review_engine_inventory_cc-agent-PR.md). **Disambiguation per 2026-05-19 cross-planner sync**: "Bump 1 window" here is the post-publish unlock window for downstream Cortex-track work. The **substrate-v1 planner's Bump 1 cross-PR rollout** is separate scope (5 repos: legacy-design-tools, smartcity-os, legacy-revit-sensor, hauska-engine, hauska-mcp-server pinning consumers to `@hauska/atom-contract@^1.0.0`, atomically merged per §Bump 1 atom contract coordination above). These behavior fixes ship as their own targeted PRs and do not enter the cross-PR rollout.

- **`bim-model` produced symmetrically on IFC ingest. SHIPPED 2026-05-19** via legacy-design-tools PRs #28 + #29. `ensureBimModelAndEmitIfcIngestEvent` UPSERT preserves Push-to-Revit state; new `bim-model.ingested-from-ifc` event type appended (append-only order restored in PR #29 after PR #28 regression). Neon prod Track B IFC schema applied 2026-05-19 (`snapshot_ifc_files` + `materializable_elements` Track B columns + 2 CHECK constraints + 4 FKs + 2 partial indexes). Revit IFC retry verification operator-pending. No contract change — `bim-model` already in the 19-atom registry.
- **Open: materializable-element re-ingest semantics.** Current `ifcIngest.ts:260-314` delete-prior-rows-then-reinsert breaks ADR-001 atom history. Append + supersede chain per ADR-011 is the resolution path; lands as follow-on after Bump 1, not gating.

### Compounding-context atoms (Bastrop-live capture)

The substantive design pass from the 2026-05-12 brainstorm. These atoms are what makes use of the platform *compound* — every Sylvia / Jaime adjudication becomes durable, retrievable, cross-jurisdictionally-precedent-eligible context attached to the underlying `code-section` and `finding` atoms. They are the **depth moat** complement to the Code Ingestion Pipeline's **width moat** (per [`49_code_ingestion_pipeline.md`](49_code_ingestion_pipeline.md) §Strategic role).

**Why design them now.** Capture from Sprint A.1 day-one is the highest-leverage move of the session. Retroactive migration of right-shaped adjudication context is expensive; right-shape capture is cheap if the atom contract is settled before the engine starts writing data. These atoms are in **Bump 1** of the version bump strategy above.

**Existing-registry overlaps flagged (resolved here).**

- **`per-reviewer-learning`** (existing Codex-side entry above) and `per-reviewer-pattern` (below) are conceptually the same atom — aggregated patterns across one reviewer's adjudications. The Bastrop-live framing supersedes the CDX-12-only framing. **Resolution:** treat `per-reviewer-pattern` below as the canonical spec; retire `per-reviewer-learning` as a separate registry entry on Bump 1 (or rename in code; one atom type either way). The existing entry remains above for revision-history continuity until Bump 1 lands.
- **`jurisdictional-precedent`** (existing Codex-side entry above) is a city-to-city aggregation atom; `comparable-project-precedent` (below) is a per-finding link atom. **Resolution:** keep both. `jurisdictional-precedent` is a higher-order aggregation over many `comparable-project-precedent` atoms once enough cross-jurisdictional precedent material exists. `comparable-project-precedent` is the primitive; `jurisdictional-precedent` may be reframed as an aggregation pass output rather than a directly-produced atom at the next refresh of this doc.

**Tiering.** All three atoms below are paid-tier per [`08_tiered_access_model.md`](08_tiered_access_model.md) Layer 2 (context-enriched atoms). The free-tier `.atompack` export per [ADR-012](80_adrs/adr_012_atom_export_format.md) **must exclude** adjudication-context atoms by default; a paid-tier pack variant can include them under licensee scope.

**Privacy & cross-jurisdictional scope.** Per [ADR-007](80_adrs/adr_007_cross_stakeholder_atom_access.md) and the Bastrop-pioneering framing (Bastrop is first city in a *network*, not data source feeding other cities), cross-jurisdictional surfacing of these atoms is **opt-in by source jurisdiction**. Default scope is jurisdiction-local; network publish is a separate flag, gated by ADR-007's open decisions on prior-owner / cross-tenant policy.

#### `adjudication-record`
- **Purpose.** Captures a single reviewer adjudication event (accept / edit / reject + reasoning + outcome) attached to a `finding`. Per-edit; high-volume. The substrate atom from which `per-reviewer-pattern` and `comparable-project-precedent` are derived.
- **Producer.** Codex 1b reviewer-side surface in `smartcity-os` (Sylvia / Jaime clicks). One atom per adjudication action. Write-path goes through `audit/` (event chain) + `storage/` (Postgres index + IPFS pin) + `identity/` (DID resolution) modules per Stream A.
- **Consumer.** Codex engine (retrieval for similar findings, per-reviewer-pattern aggregation pass, comparable-project-precedent computation pass), Codex web companion (drill-down on a finding's adjudication history), eventually the "see it in practice" inline UX (its own ADR, deferred). Reads honor [ADR-007](80_adrs/adr_007_cross_stakeholder_atom_access.md) scope at the Postgres index per [ADR-010](80_adrs/adr_010_atom_graph_traversal.md) §4.
- **Key fields.**
  - `adjudicationDid` (per [ADR-011](80_adrs/adr_011_atom_identity_across_versions.md)) — identity-across-time
  - `adjudicationCid` (per [ADR-010](80_adrs/adr_010_atom_graph_traversal.md)) — content identifier this version
  - `findingCid` — link to the finding being adjudicated (typed link `adjudicates` per ADR-010 link taxonomy)
  - `reviewerDid` — link to the reviewer `person` atom (typed link `authored-by`)
  - `jurisdictionTenant` — the property's jurisdiction at time of adjudication (per ADR-007)
  - `parcelDid` — link to the `parcel-record` (typed link `applies-to`, transitively via the finding)
  - `interpretsCodeSectionCids[]` — links to the `code-section` atoms this adjudication interprets (typed link `interprets`); derived from the finding's citations but materialized explicitly so retrieval doesn't have to chase
  - `adjudicationType` — `accept | edit | reject` (initial taxonomy; refinement open — see below)
  - `outcomeDisposition` — workflow-level outcome (`approved` | `approved-with-note` | `denied` | `revision-required` | `deferred`). Distinct from `adjudicationType` (which captures the click); `outcomeDisposition` captures the finding's resulting workflow state.
  - `reasoningProse` — free-text reviewer reasoning. The **substantive content** of the adjudication; LLM-readable; the compounding signal. (Non-obvious rationale: without this, `accept | edit | reject` is a click count, not a pattern; with it, the same accept on the same section by two reviewers differentiates by *why*. The moat lives here.)
  - `editedFinding` (when `adjudicationType = edit`) — the new finding content/citation. Atomic edit (not delta); the edited finding is a new version of the finding per ADR-011 chain semantics. Stored on this atom for write-amplification reasons (the edit and the reasoning belong together).
  - `scopeFlags` — anonymization-relevant flags per ADR-007: `publishToNetwork: bool` (jurisdiction has opted into cross-jurisdictional precedent surfacing); `reviewerAnonymous: bool` (publish but redact reviewer identity); `reasoningRedactionPolicy` (`full` | `prose-redacted` | `none`). (Non-obvious rationale: these flags are *on the atom* not in a separate ACL table because access is content-addressed — a downloaded `.atom` file per ADR-012 must carry its own publishing posture.)
  - `adjudicatedAt` — when the reviewer's action happened
  - `actor` — `person` atom DID; same as `reviewerDid` for ordinary adjudications; differs when the adjudication is system-imposed (rare; e.g., bulk approval workflow)
  - Standard ADR-001 four layers: identity (DID + CID), context interface (`contextSummary(scope)`), composition (links), history (event chain — every state change to this atom, e.g., a reviewer correcting their own prior adjudication, is an event)
- **Links (per [ADR-010](80_adrs/adr_010_atom_graph_traversal.md) link taxonomy).**
  - **Outbound:**
    - `adjudicates` → `finding` (1, required)
    - `interprets` → `code-section` (many; the section(s) the finding cites + any the reviewer adds in reasoning)
    - `applies-to` → `parcel-record` (1; transitively via finding)
    - `authored-by` → `person` (1; the reviewer)
    - `derives-from` → previous `adjudication-record` (0..1; only when this is a re-adjudication / correction of a prior one)
  - **Inbound (the graph as it grows):**
    - `precedent-of` ← future `adjudication-records` on similar findings (the link is materialized on the precedent atom, not here; this is the graph-traversal target)
    - `informs` ← `per-reviewer-pattern` (the pattern derives from this adjudication)
    - `informs` ← `comparable-project-precedent` (the precedent surfaces this adjudication as comparable)
- **Cross-tenant scope (per [ADR-007](80_adrs/adr_007_cross_stakeholder_atom_access.md)).**
  - **Owning tenant:** the jurisdiction's **reviewer tenant** (e.g., Bastrop reviewer tenant in the Bastrop-live case). The reviewer wrote the adjudication; the jurisdiction owns the artifact.
  - **Read scopes:**
    - Reviewer-self — full read including `reasoningProse`
    - Jurisdiction city-manager tenant — full read within own jurisdiction
    - Architect tenant whose submission the adjudication's finding affects — read on `outcomeDisposition` + `interpretsCodeSectionCids` + (optionally, per jurisdiction policy) `reasoningProse`; this is the architect's path to learning *why* their submission got the answer it did. Whether `reasoningProse` flows to the architect by default is jurisdiction policy — Bastrop policy TBD, default conservative (redacted).
    - Cross-jurisdictional read — gated by `scopeFlags.publishToNetwork`. When true, comparable jurisdictions can read via `comparable-project-precedent` traversal. Reviewer anonymization per `reviewerAnonymous`; reasoning redaction per `reasoningRedactionPolicy`.
  - **Free-tier guardrail per [`08_tiered_access_model.md`](08_tiered_access_model.md):** paid-tier. Default `.atompack` exports per ADR-012 exclude these atoms.
- **Open questions.**
  - **Edit semantics.** Is an `edit`-type adjudication a *replacement* finding (new finding version, this adjudication links to both) or a *delta* (this adjudication carries the diff)? Affects whether the underlying finding atom's DID resolves to a new CID per ADR-011 or whether the finding is stable and the edit lives only here. **Recommendation pending Nick:** atomic-replacement (finding versions per ADR-011 chain), because adjudication-records should be append-only history, not the finding-content custodian.
  - **Multi-action adjudications.** A reviewer may approve part of a finding and reject part. One adjudication-record with structured `partial[]` outcomes, or multiple atoms? Probably one with structured `partial[]` (a multi-event single click is a single user intent); needs spec.
  - **Anonymization mechanics.** Per [ADR-007](80_adrs/adr_007_cross_stakeholder_atom_access.md) open decisions. Pseudonym mapping (per-reviewer stable hash); K-anonymity threshold for cross-jurisdictional publish (below K, suppress); redaction pattern for `reasoningProse` (LLM-driven scrubber on publish; out-of-scope for write path). The minimum viable shape needs to lock before A.1 captures the first adjudication, because retroactive anonymization is harder than designed-in scope.
  - **IPNS update cadence.** Per [ADR-011](80_adrs/adr_011_atom_identity_across_versions.md) open decision on rotation policy. Per-adjudication IPNS update (every Sylvia click) is the obvious naive choice but may overwhelm the resolver. Per-hour batched republish is the obvious alternative. A.1 implementation needs a provisional answer; refine empirically against measured Bastrop click cadence.
  - **Reasoning capture quality.** Is `reasoningProse` a text field the reviewer fills (highest fidelity, lowest capture rate), or auto-captured from an adjacent reviewer-AI chat (lower fidelity, higher capture rate), or hybrid? UX decision out of scope here; flag for A.2 QA loop. The atom contract supports any source; the capture-rate question is what determines compounding value.
  - **Revoke / correct semantics.** A reviewer realizes a prior adjudication was wrong. Per [ADR-001](80_adrs/adr_001_atom_architecture.md) §10 anti-patterns, this is a new event in the chain (not a delete). Spec the event type — `adjudication-revoked` + a new `adjudication-record` with `derives-from` link, or a `state_change` event in the original's chain? Both work; pick for consistency with finding-revision pattern.
  - **Free-tier teaser of paid-tier per [08](08_tiered_access_model.md) Open for refinement.** Aggregate anonymous adjudication patterns ("most jurisdictions interpret § X this way") at the free tier as a paid-tier teaser. Mechanics interact with `scopeFlags` here; resolve at 08 refinement time.

#### `per-reviewer-pattern`
- **Purpose.** Aggregated patterns across one reviewer's adjudications. Surfaces interpretation tendencies ("Reviewer X enforces setback strictly when the parcel touches an aquifer recharge zone"). Powers Codex retrieval ("what does this reviewer typically rule on this section?"), adaptive UI (the original CDX-12 driver, formerly `per-reviewer-learning`), and is the *substrate of the moat narrative*: every adjudication compounds into the reviewer's pattern.
- **Producer.** Codex engine — background aggregation pass over `adjudication-record` atoms for a given (reviewer × code-section) cell. Cadence open (see below). Write-path through `storage/` + `identity/` per Stream A.
- **Consumer.** Codex engine retrieval (anchor for finding generation: "this reviewer typically rules X for this section, so surface that to the architect"). Codex adaptive UI tier (CDX-12 successor — adaptive verbosity per reviewer's prior patterns). Codex web companion. Eventually the "see it in practice" UX (its own ADR, deferred).
- **Key fields.**
  - `patternDid` (per [ADR-011](80_adrs/adr_011_atom_identity_across_versions.md))
  - `patternCid` (per [ADR-010](80_adrs/adr_010_atom_graph_traversal.md))
  - `reviewerDid` — link to the `person` atom this pattern is *about* (subject, not author)
  - `jurisdictionTenant`
  - `codeSectionContextCid` — the `code-section` atom this pattern is about. (Non-obvious rationale: patterns are tied to specific sections rather than across-the-board, because reviewer tendencies are section-specific — "Sylvia is strict on setbacks" doesn't tell you what she does on use classifications. Per (reviewer × section) is the natural grain.)
  - `patternSummary` — LLM-generated prose describing the tendency. The consumable form. Regenerated on aggregation refresh.
  - `supportingAdjudicationCids[]` — the underlying `adjudication-record` atoms this pattern derives from. **Required.** This is the verifiability hook per ADR-012 §6 — the pattern's claim is auditable.
  - `confidence` — heuristic measure (sample size, consistency); not a guarantee. (Non-obvious rationale: published patterns based on N=2 adjudications are dangerous; consumers must filter on this.)
  - `aggregationVersion` — version string of the aggregation pass that produced this snapshot; lets future re-aggregation supersede via new event in the chain.
  - `aggregatedAt`
  - `scopeFlags` — same shape as `adjudication-record.scopeFlags`; whether the pattern is publishable to network, reviewer-anonymized, etc. Inherits the strictest setting from constituent adjudication-records.
  - Standard ADR-001 four layers.
- **Links (per ADR-010).**
  - **Outbound:**
    - `derives-from` → `adjudication-record` (many; the underlying data)
    - `interprets` → `code-section` (1; the section the pattern is about)
    - `authored-by` → `person` (1; the reviewer this pattern is *about* — note: subject, not author of this atom; semantic gloss inherits ADR-010's `authored-by` link type since no dedicated `pattern-of` link exists yet)
  - **Inbound:**
    - `informs` ← `finding` (a freshly-generated finding cites this pattern atom for "your jurisdiction's reviewer typically rules X")
    - `derives-from` ← cross-reviewer aggregation atoms when introduced (deferred)
- **Cross-tenant scope (per ADR-007).**
  - **Owning tenant:** jurisdiction's reviewer tenant.
  - **Read scopes:**
    - Reviewer-self — full read
    - Jurisdiction city-manager — full read within own jurisdiction
    - Architect whose work this jurisdiction reviews — read on `patternSummary` (so they can pre-emptively address the tendency in their design); `supportingAdjudicationCids` redacted by default (the architect doesn't need to drill into every constituent adjudication)
    - Cross-jurisdictional — only with `scopeFlags.publishToNetwork`. Reviewer-anonymized variant ("Bastrop reviewers tend to X" — no specific reviewer named) is a separate atom type (deferred); per-reviewer patterns publish only with `reviewerAnonymous` and only at K-anonymity thresholds.
  - Paid-tier per 08.
- **Open questions.**
  - **Aggregation cadence.** Real-time (each adjudication triggers a pattern recompute for the affected reviewer × section cell), nightly batch, on-demand (computed at retrieval time, cached). Shape is the same open decision as the existing `firm-precedent` aggregation-cadence open question above; resolve together.
  - **Pattern segmentation grain.** Per (reviewer × code-section), per (reviewer × code-area / chapter), or one atom per reviewer with structured sub-patterns? Affects atom count, retrieval granularity, and aggregation cost. Recommendation: per (reviewer × section); refine if cardinality blows up (Bastrop UDC has 189 sections, two reviewers — ~378 max pattern atoms, manageable).
  - **Stale-pattern decay.** A reviewer's tendencies evolve. How does a pattern atom *expire*? Probably: aggregation pass produces a new version of the pattern atom (chain extension per ADR-011); old version remains queryable for as-of-time; explicit `staleAfter` field optional. Spec at A.2.
  - **Cross-reviewer aggregation atom.** "This jurisdiction's typical interpretation of § X" — separate atom type that aggregates over per-reviewer-patterns. Distinct producer pass; spec when cross-reviewer surfacing is in scope (currently deferred to post-Bastrop-live).
  - **Anonymity in cross-jurisdictional patterns.** Reviewer-anonymous patterns need their own visibility flag pattern. Same minimum-viable-shape constraint as adjudication-record's anonymization mechanics.
  - **Capture-rate dependence.** Pattern quality scales with `reasoningProse` capture rate on constituent adjudication-records. If reviewers don't write reasoning, patterns degrade to "Sylvia approves 70% / rejects 30%" — true but not interpretive. Flag tightly: pattern fidelity is downstream of capture UX.

#### `comparable-project-precedent`
- **Purpose.** Link atom surfacing precedent relationships across submittals — "this finding on this parcel resembles findings on these other parcels, in-jurisdiction by default and cross-jurisdictional when scopes permit." The atom-graph realization of the *data* behind "see it in practice" without committing to the UX (UX deferred to its own ADR per session §5 strategic context).
- **Producer.** Codex engine — precedent-discovery pass triggered by finding generation, retrieval, or adjudication. Computes similarity over the atom graph (graph traversal per [ADR-010](80_adrs/adr_010_atom_graph_traversal.md)) optionally supplemented by vector-similarity over atom bodies (per ADR-010 Alt 1 — vector as a fuzzy candidate selector feeding the graph layer).
- **Consumer.** Codex engine retrieval (finding generation context — "comparable projects ruled X"). Codex web companion (precedent traversal queries). The "see it in practice" inline UX when its ADR lands. SmartCity OS Operations Dashboard (comparable-project surfacing on a parcel-briefing).
- **Key fields.**
  - `precedentDid` (per ADR-011)
  - `precedentCid` (per ADR-010)
  - `anchorFindingCid` — the finding this precedent is computed against (the "this is what you're looking at" side)
  - `comparableFindingCids[]` — findings on other parcels/submittals deemed comparable
  - `comparableAdjudicationCids[]` — when the substantive precedent material is the *adjudication* on the comparable (not just the finding), surface the adjudication-record directly. (Non-obvious rationale: a finding without adjudication context is "AI flagged setback noncompliance"; with adjudication it's "AI flagged it and Sylvia ruled X with reasoning Y" — the latter is the precedent material.)
  - `parcelContextSummaries[]` — for each comparable, a bounded summary of the parcel's overlay profile (constraint-overlay atoms in compact form). Bounded to avoid blowing the LLM context window during pre-expansion per ADR-010 §4.
  - `relationshipBasis` — typed reason, drawn from initial taxonomy seed: `same-code-section` | `same-constraint-overlay-profile` | `same-improvement-type` | `same-permit-pattern` | `cross-jurisdiction-analogous`. Enables filtering at retrieval ("show me only same-overlay-profile comparables").
  - `crossJurisdictional` — boolean. If true, comparables span jurisdictions and additional scope and anonymization apply.
  - `confidence` — heuristic; sample size × relationship strength
  - `computedAt` — snapshot timestamp
  - `aggregationVersion` — version of the precedent-discovery pass
  - Standard ADR-001 four layers.
- **Links (per ADR-010).**
  - **Outbound:**
    - `precedent-of` → `finding` (1 anchor + many comparable findings; ADR-010 link type `precedent-of`)
    - `applies-to` → `parcel-record` (1 anchor + many comparable parcels, transitively via findings)
    - `interprets` → `code-section` (the section(s) the precedent is about — typically the anchor finding's cited sections)
    - `derives-from` → `adjudication-record` (when the substantive precedent material is the adjudication on the comparable, not just the finding)
  - **Inbound:**
    - `informs` ← `finding` (a newly-generated finding references this precedent for "this is what other projects looked like")
- **Cross-tenant scope (per ADR-007).**
  - **Owning tenant.** Computed by Codex engine on behalf of the requester. The precedent atom itself is engine-owned (an aggregation artifact), but each link target carries its own scope. The Postgres index per ADR-010 §3 enforces scope on every traversal — the engine cannot emit a precedent that traverses to atoms the requester can't read.
  - **Read scopes:**
    - Architect — read on precedents drawn from their own jurisdiction's work; `crossJurisdictional` precedents read only when source jurisdictions have opted in via `scopeFlags.publishToNetwork` on the constituent adjudication-records
    - Reviewer — read on all in-jurisdiction precedents; cross-jurisdictional reads gated identically
    - Cross-jurisdictional emission — only includes comparables from jurisdictions opted into the network publish policy. K-anonymity threshold applies (below K, the cross-jurisdictional comparable is suppressed). Bastrop is the first city in the network (per Bastrop-pioneering frame); their opt-in is the contract.
  - Paid-tier per 08 (cross-jurisdictional traversal is the paid feature).
- **Open questions.**
  - **Precedent freshness.** When does a precedent atom get recomputed? On every new comparable adjudication, on a schedule, on retrieval. Affects index churn and write amplification. Recommendation: on-retrieval with TTL'd cache (engine computes on the first request after any constituent atom's change; cached results serve subsequent requests within the TTL). Spec at A.2.
  - **K-anonymity for cross-jurisdictional.** Minimum sample size before cross-jurisdictional precedent surfaces. K=3 is a common starting point but is per-policy; resolve in coordination with ADR-007 anonymization-policy refinement.
  - **Relationship-basis taxonomy.** Initial values above are a seed per ADR-010 §Initial design seeds. Refine empirically against Bastrop adjudication corpus (post A.3).
  - **Vector-similarity layer.** Per ADR-010 Alt 1: vector-similarity as a fuzzy candidate selector feeding the graph layer. Specifically here: vector-similarity over finding-body text might surface a comparable that graph-traversal alone wouldn't (the comparable cites a *different* code-section but the underlying issue is the same). Spec the integration point.
  - **Relationship to existing `jurisdictional-precedent`.** That atom is a city-to-city aggregation (per existing Codex-side new atoms above). `comparable-project-precedent` is a per-finding link. The cleanest path forward: treat `comparable-project-precedent` as primitive; reframe `jurisdictional-precedent` as an aggregation pass over many `comparable-project-precedent` atoms at the next refresh of this doc. Don't migrate now; flag for review when network publishing is in scope.
  - **Relationship to `permit-precedent`** (Parcel Intelligence atoms above). `permit-precedent` is jurisdiction-local and parcel-anchored; this atom is finding-anchored and may be cross-jurisdictional. Both are kept; explicit cross-doc note in 46 needs updating to flag this when Parcel Intelligence sequences in (Bump 2).
  - **"See it in practice" UX consumption.** UX is deferred; the atom is designed to support graph-traversal consumption (per ADR-010 hybrid retrieval) without optimizing for any particular UX. Inline-mention + expand-link is the likely-default UX per session strategic context; this atom doesn't preclude it.

### New open decisions (this section's atoms)

Beyond the per-atom open questions above, three cross-cutting decisions need round-tripping with Nick before A.1 implementation lands the adjudication-context capture:

1. **Minimum-viable anonymization scope.** Per `adjudication-record.scopeFlags` and the cross-jurisdictional read paths above. Lock the minimum shape before A.1 starts capturing — retroactive anonymization is harder than designed-in.
2. **`reasoningProse` capture UX (A.2 scope).** Pattern fidelity (and therefore moat compounding value) is downstream of how reasoning gets captured. Hybrid (button-click + optional prose + LLM-extract from reviewer chat) likely; concrete decision needed for A.2 QA-loop scope.
3. **`per-reviewer-learning` consolidation.** The existing Codex-side new atom entry (`per-reviewer-learning`, above) and the new `per-reviewer-pattern` here are the same atom under different names. Code registration should land one type. Confirm renaming approach (drop the old name; rename in registry; or keep both with a deprecation comment) before Bump 1.

## Engine work streams

Seven streams. Some parallel-eligible; some gated.

### A. Module boundary refactor (pre-factor-out)

Reorganize `artifacts/api-server/src/` into clear modules so ADR-008 factor-out is `git mv` rather than recursive untangle:

- `engine/` — compliance pass, briefing generation, context retrieval, AI gateway
- `corpus/` — code atom ingestion, parcel intelligence; placeholders for firm precedent + per-reviewer-learning
- `adapters/` — host tool adapters; placeholder ahead of Bluebeam ToS clearance
- `audit/` — audit trail; placeholder ahead of SDK closure
- `atoms/` — atom registry (existing location moves here)
- `storage/` — IPFS pinning adapter, Postgres index access layer, hot cache (Redis or in-process; choice deferred per [ADR-010](80_adrs/adr_010_atom_graph_traversal.md) open decisions). Atom bodies live in IPFS per ADR-010; the Postgres index sits behind a uniform access layer so consumers don't reach into the index directly; the cache enforces the latency contract for traversal-heavy retrieval. Added per [ADR-010](80_adrs/adr_010_atom_graph_traversal.md).
- `identity/` — DID resolver (per [ADR-011](80_adrs/adr_011_atom_identity_across_versions.md)), IPNS update + lookup, key custody hooks (DID method, IPNS rotation policy, and custody model are refinement-deferred per ADR-011 Open for refinement; module exists to localize those choices). Added per [ADR-011](80_adrs/adr_011_atom_identity_across_versions.md).

**Eligibility: starts now. Owner: 1 agent. Effort: M (1–2 sprints).**

### B. Atom registry implementation (pre-factor-out)

Implement the atoms specified above in `artifacts/api-server/src/atoms/registry.ts` and downstream consumers. Includes contract version bump coordination.

**Eligibility: starts now. Owner: 1 agent. Effort: L (multi-sprint due to coordination cost).**

### C. Engine output quality (ongoing)

Improvements to the compliance pass and briefing engine. Driven by QA findings from both surfaces. Customer-zero feedback in `40a_customer_zero_observations_arena_roja_2026_05_06.md` is the seed input (L2 sheet content rendering improves engine context; L5 product-spec verification improves recommendation accuracy).

**Eligibility: starts now, continues indefinitely. Owner: 1 agent at a time, scoped per QA cycle.**

### D. Corpus depth (ongoing)

Code atom corpus expansion and tuning. Near-term needs:

- Grand County IRC residential code (currently only R301.2.1 = 14 atoms; full IRC ingestion pending)
- Bastrop UDC tuning (189 atoms today; depth check needed against real Bastrop submittals)
- Florida Building Code for Miami Beach (Alexander 404 project) — currently zero atoms

Customer-zero feedback references 2021 IBC/IRC/IPC/IMC/IFGC/IECC/IFC + 2023 NEC — that's the actual corpus depth needed for Moab projects.

**Eligibility: starts now per jurisdiction. Owner: 1 agent at a time within a jurisdiction (corpus tuning isn't easily parallelized inside a single code).**

### E. SDK gap closure (gates CDX-15)

Hauska SDK gaps that block `audit-trail-anchor` atom production. Specific gaps live in `33_hauska_sdk_roadmap.md` (queued for migration).

**Eligibility: blocked on 33 migration. Owner: TBD (likely 1 agent on SDK side after migration).**

### F. Performance work (gated on baseline)

Engine performance at firm-tenant scale (per `47_codex_plan_review.md` outstanding verifications). No work until baseline is established at pilot scale.

**Eligibility: deferred until pilot data exists. Owner: TBD.**

### G. Brand migration (Plan Review → Codex; Design Accelerator → Cortex)

Cross-cutting code rename in `legacy-design-tools`. Brand-only change; no functional impact. Codex and Cortex appear zero times in the repo today. Existing references:

- **"Plan Review"** appears in: file paths (`artifacts/plan-review/`, `lib/plan-review-pdf/`), package names (`@workspace/plan-review-pdf`), UI copy (`brandProductName="Plan Review"` on every reviewer-side page), route URL (`/plan-review/`), code identifiers (route handlers, test descriptions), system prompts (`FINDING_SYSTEM_PROMPT` literal "AI plan reviewer"), docs (`AGENTS.md`, `DESIGN.md`, `replit.md`, `docs/wave-*` reports). 2 open PRs (#17, #19), ~10 active branches.
- **"Design Accelerator"** appears once: `AGENTS.md:11`. Smaller migration.

New code and UI use Codex / Cortex going forward; this stream migrates existing references.

**Sequencing.** UI copy first (most visible, lowest blast radius — string changes in `brandProductName` and similar), then internal identifiers (route paths, package names, file paths, code identifiers, system prompt literals). UI copy changes are isolated; package and file path renames are coordination-cost-heavy (consumers update).

**Gating.** Hold until open PR #17 lands to avoid merge conflicts on touched paths. Check PR #19 status before starting (also touches affected surfaces). Coordinate with active branches.

**Feature flag.** Not needed. Brand-only, no functional change. Visual diff on UI copy; structural diff on identifier rename. Standard PR review surfaces both.

**Additional in-scope items bundled here:**

- `AGENTS.md` correction: remove claim that `gh` CLI is unavailable (recon 2026-05-11 confirmed it works — gh 2.92.0, authenticated).
- `docs/wave-*` reports — historical artifacts; lighter touch (one-line note acknowledging rename, don't rewrite history).

**Out of scope for this stream.** Doc filename renames in doc_repo (e.g., `42_design_accelerator_program_plan.md` → `42_cortex_program_plan.md`) are a separate coordination step after canonical product home docs (`40_design_accelerator.md`, `47_codex_plan_review.md`) migrate naming. This stream is `legacy-design-tools` rename only.

**Eligibility: starts after PR #17 lands. Owner: 1 agent. Effort: M.**

## Phasing

```
NOW (pre-factor-out, in legacy-design-tools):
  Stream A — Module boundary refactor      [parallel]
  Stream B — Atom registry implementation  [parallel]
  Stream C — Engine output quality         [parallel]
  Stream D — Corpus depth                  [parallel, 1 at a time within a jurisdiction]
  Stream G — Brand migration               [parallel, gated on PR #17 landing]

GATED on 33 migration:
  Stream E — SDK gap closure

GATED on Phase 2C closure (ADR-008 trigger):
  Engine factor-out sprint (separate doc, drafted when gate clears)

POST-FACTOR-OUT (in hauska-engine):
  All streams continue in new repo
  Stream F — Performance work (post-pilot)
```

## Gates and dependencies

- **Phase 2C closure** (migration sprint) → unblocks ADR-008 engine factor-out → unblocks stream consolidation in `hauska-engine` repo.
- **33 migration** → unlocks Stream E (SDK gap closure) → unblocks `audit-trail-anchor` atom production → unblocks CDX-15.
- **Atom contract version bump** → coordinated across legacy-design-tools + smartcity-os + legacy-revit-sensor + Hauska SDK. Cannot be done piecemeal.
- **Bluebeam ToS verification** → unblocks `adapters/` module having actual content (currently a placeholder for Stream A).
- **PR #17 landing** → unblocks Stream G start. Check PR #19 also.

## Verification criteria per stream

| Stream | Verification |
|---|---|
| A. Module boundary refactor | `artifacts/api-server/src/` directory listing matches target structure (incl. `storage/` and `identity/` per ADR-010/011); existing tests pass; no engine code left in `src/` root; `storage/` exposes a uniform access layer over Postgres index + IPFS pin operations, with a hot-cache seam; `identity/` exposes a DID resolver + IPNS read/write surface, with hooks for the deferred custody model |
| B. Atom registry implementation | New atoms appear in `hauska-engine/packages/atoms/` (option β; engine atom-registry version bumps, not `@hauska/atom-contract` framework version); all consumers pin against the appropriate `^x.y.0` range; existing atom tests pass; new atoms ship the full ADR-001 four-layer contract (Zod schema, contextSummary, composition, history) plus five render modes plus conformance suite. **L1-L6 Cortex atom set complete 2026-05-19** at `@hauska-engine/atoms@0.6.0` (7 atom types, 194 workspace tests green). Remaining Stream B scope: Bump 1 code-corpus atoms (6) + adjudication-context atoms (3) + Codex-side atoms (minus deferred `audit-trail-anchor` and the consolidated `per-reviewer-learning` ↔ `per-reviewer-pattern`); Bump 2 Parcel Intelligence atoms (5) gated on 46 sequencing decision. |
| C. Engine output quality | QA scenarios in DA and Codex program plans pass with engine output Nick can evaluate (specific scenarios defined in each program plan) |
| D. Corpus depth | Corpus count per jurisdiction grows to defined target; retrieval tests pass for representative queries; production Neon corpus count verified |
| E. SDK gap closure | `audit-trail-anchor` atoms produced for test scenarios; CDX-15 audit export workflow ends with a verifiable artifact |
| F. Performance work | Engine pass under 5s incremental + under 120s full-pass at firm-tenant scale (target tied to pilot firm metrics) |
| G. Brand migration | Zero "Plan Review" string occurrences in UI copy (post UI-copy phase); zero "Plan Review" identifier occurrences in code (post identifier phase); `AGENTS.md:11` updated to "Cortex"; `gh` CLI availability note corrected; route URL serves at new path with redirect from `/plan-review/`; no functional regressions |

## Open decisions

- **ICC-ES integration mechanism** for `product-spec-reference` atom (Stream C / DA-side). API vs scrape vs manual refresh? Decision needed before Stream C touches L5 fix.
- **Firm-precedent aggregation cadence** for `firm-precedent` atom (Stream B / Codex-side). Real-time vs nightly batch?
- **Jurisdictional-precedent privacy model** for `jurisdictional-precedent` atom (Stream B / Codex-side). Property-level anonymization specifics — review by counsel before production aggregation runs.
- **Detail library backing** for `detail-callout-spec` atom (Stream B / DA-side). Pull from manufacturer/AWI/WDMA/NFRC libraries or generate from scratch?
- **Anchoring substrate** for `audit-trail-anchor` atom (Stream E / Codex-side). Polygon CDK vs public TSA vs Hauska cluster vs customer-controlled. Settled in deferred ADR-006.
- **Module boundary final shape** for Stream A. Sketch above is starting point; refactor may surface additional modules (e.g., `inference/` for AI gateway specifically) or merge some.
- **Brand migration sequencing within UI-copy phase** for Stream G. Which screens go first; whether a single all-screens PR or page-by-page. Sprint-level call.
- **Route URL strategy for Stream G.** `/plan-review/` → `/codex/` with redirect, or net-new `/codex/` with `/plan-review/` retained as alias? SEO and bookmark continuity vs clean cutover.

## References

- [`25_atom_architecture_reference.md`](25_atom_architecture_reference.md) — atom architecture reference (the existing 19 DA atoms documented in §5)
- [`26_atom_upgrade_guide.md`](26_atom_upgrade_guide.md) — atom contract version bump procedure
- [`80_adrs/adr_001_atom_architecture.md`](80_adrs/adr_001_atom_architecture.md) — atom contract
- [`80_adrs/adr_007_cross_stakeholder_atom_access.md`](80_adrs/adr_007_cross_stakeholder_atom_access.md) — access scopes that govern atom reads/writes
- [`80_adrs/adr_008_engine_factor_out.md`](80_adrs/adr_008_engine_factor_out.md) — engine factor-out timing
- [`40_design_accelerator.md`](40_design_accelerator.md) — DA product home (current engine consumer)
- [`47_codex_plan_review.md`](47_codex_plan_review.md) — Codex product home (engine consumer)
- [`42_design_accelerator_program_plan.md`](42_design_accelerator_program_plan.md) — DA program plan (consumes this doc)
- [`48_codex_program_plan.md`](48_codex_program_plan.md) — Codex program plan (consumes this doc)
- [`40a_customer_zero_observations_arena_roja_2026_05_06.md`](40a_customer_zero_observations_arena_roja_2026_05_06.md) — customer-zero feedback driving DA-side atom additions
- [`12_migration_sprint.md`](12_migration_sprint.md) — Phase 2C gate state

## Revision history

- **2026-05-11 (origin):** drafted during comprehensive planning session. Six streams (A–F) plus brand migration (Stream G, added in same-session audit pass). Establishes shared engine work stream + atom registry expansion. Gating dependencies and verification criteria. Companion to `42_design_accelerator_program_plan.md` and `48_codex_program_plan.md`.
- **2026-05-12 (velocity-through-2026 brainstorm absorption):** Sprint-prep update absorbing the 2026-05-12 session outputs (atom-substrate ADRs 010 / 011 / 012, `49_code_ingestion_pipeline.md`, `46_smartcity_parcel_intelligence.md`, `08_tiered_access_model.md`). **Stream A** target module structure adds `storage/` (IPFS pinning adapter + Postgres index access + hot cache per ADR-010) and `identity/` (DID resolver + IPNS + key custody hooks per ADR-011); verification criterion updated. **Stream B** atom roster grows by 11 net-new types: 6 code-pipeline atoms (`code-section`, `code-definition`, `code-amendment`, `code-cross-reference`, `code-edition`, `jurisdiction-corpus`) sourced from 49, and 5 Parcel Intelligence atoms (`parcel-record`, `constraint-overlay`, `infrastructure-proximity`, `permit-precedent`, `pre-application-input`) sourced from 46. `parcel-briefing` skipped (already in 19-atom registry); `neighboring-context` overlap with `constraint-overlay` / `infrastructure-proximity` flagged for dedup. Renderer obligation per ADR-012 noted on Contract version bump. Version bump strategy split into two bumps (Bump 1: A.1-window atoms incl. adjudication-context; Bump 2: parcel-intelligence atoms when 46 sequencing resolves). New **Compounding-context atoms** section appends three substrate atom specs for Bastrop-live capture: `adjudication-record`, `per-reviewer-pattern`, `comparable-project-precedent`. Three round-trip-to-Nick decisions surfaced (anonymization minimum-viable scope; `reasoningProse` capture UX; `per-reviewer-learning` ↔ `per-reviewer-pattern` consolidation). Companion 49 / 46 / 08 / 11a remain authoritative on their domain; 27 absorbs the atom-registry and engine-module implications.
- **2026-05-18 (ADR-018 doc-set sweep):** Contract-version-bump reference (Stream B) renamed from `@empressaio/atom` to `@hauska/atom-contract` per [ADR-018](80_adrs/adr_018_atom_contract_substrate_layer.md). Atom contract is Hauska commercial substrate, peer to the Hauska SDK. `related` field extended to ADR-018. No engineering-content changes.
