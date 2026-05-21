---
id: 49_code_ingestion_pipeline
title: Code Ingestion Pipeline — any jurisdiction's code in, atomized corpus out
status: active
last_updated: 2026-05-21 (Layered code substrate section added per ADR-019; cross-jurisdictional-code-reuse and custom-amendment-handling open-design items resolved)
applies_to: portfolio
related: [07_product_line_summary, 08_tiered_access_model, 11_roadmap, 11a_bastrop_live_roadmap, 25_atom_architecture_reference, 27_engine_evolution_plan, 46_smartcity_parcel_intelligence, 47_codex_plan_review, 48_codex_program_plan, 73_partnerships, adr_001_atom_architecture, adr_010_atom_graph_traversal, adr_011_atom_identity_across_versions, adr_019_layered_code_substrate]
owner: nick
---

# Code Ingestion Pipeline

> **Purpose.** Pipeline that takes any jurisdiction's municipal code in
> (PDF, Municode HTML, eCode360 API, raw download, manually-curated
> source) and produces a queryable atomized corpus out. The capability
> that turns "atomizing the next jurisdiction" from a sprint into a
> pipeline run.

> **Status posture.** Active design (this doc) — canonical reference
> for pipeline architecture. **Active execution lives in
> [`51_substrate_v1_sprint.md`](51_substrate_v1_sprint.md)** (combined
> with the MCP server v1 ship), which executes B.1–B.6 against this
> design across four parallel streams in the new `hauska-engine` repo.
> Bastrop UDC + Grand County IRC are loaded one-off during 11a Sprint
> A.1 to unblock Bastrop-live; the pipeline regenerates them as a
> validation pass (B.6) per 51's Stream 1D, then handles every
> jurisdiction after.

## Why this exists

Onboarding a city today means atomizing its municipal code from scratch — a custom-engineering project per jurisdiction. The Bastrop UDC + Grand County IRC corpus work happens once because we control the timeline; every subsequent jurisdiction has to wait for the same engineering attention. That doesn't scale, and it makes the consultant-channel plays (code rewrite firms publishing atom packs, outsourced plan review firms operating across many cities) economically impossible.

The pipeline is what turns "atomizing the next jurisdiction" into a pipeline run with a known cost, known quality bar, and known time. Without it, the network play described in the velocity-through-2026 brainstorm has no engine.

## Strategic role

- **The width moat.** Adjudication-context atoms in Bastrop are the *depth* moat (per the compounding-atoms thesis). The pipeline is the *width* moat — every jurisdiction loaded into the network becomes a gravity well pulling inbound demand.
- **The consultant-channel enabler.** Code rewrite firms (Code Studio, ZoneCo, Camiros) cannot co-publish jurisdictional atom packs without this pipeline. Outsourced plan review firms cannot operate across cities without it. Both channels are vapor without it.
- **The free-tier substrate.** Per [`08_tiered_access_model.md`](08_tiered_access_model.md), the bare code reference atoms (no context layer) are the free tier. The pipeline produces them. Distribution at scale requires the pipeline.
- **The atom-pack product enabler.** Per [`adr_012_atom_export_format.md`](80_adrs/adr_012_atom_export_format.md), a `.atompack` is a collection of atoms for a jurisdiction. The pipeline is what populates packs.

## Architectural overview

The pipeline sits between **raw code sources** (external — PDFs, Municode, eCode360, etc.) and **the atom substrate** (per ADRs 010 + 011 + 012, IPFS storage + DID identity + Postgres index).

```
┌──────────────────────────────────────────────────────────────────┐
│  RAW CODE SOURCES                                                │
│  ─────────────────                                               │
│  Municode HTML · eCode360 API · raw PDF · jurisdiction direct    │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│  PIPELINE                                                        │
│  ────────                                                        │
│  B.1 Input adapter framework        (source-specific ingestion)  │
│  B.2 Structural extraction          (sections, definitions, …)   │
│  B.3 Atomization                    (typed atoms in registry)    │
│  B.4 Retrieval index + eval         (quality-gated discovery)    │
│  B.5 Version tracking               (amendment handling)         │
│  B.6 Coverage dashboard             (which jurisdictions where)  │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│  ATOM SUBSTRATE (per ADR-010 / 011 / 012)                        │
│  ──────────────                                                  │
│  IPFS storage · DID + IPNS identity · Postgres index · .atompack │
└──────────────────────────────────────────────────────────────────┘
```

Each pipeline stage produces durable atoms in the substrate. There's no in-pipeline state separate from the substrate — once stage B.3 atomizes, the atoms are first-class and queryable. Later stages (B.4 eval, B.5 versioning) operate on the atoms in the substrate, not on intermediate pipeline state.

## Layered code substrate

A jurisdiction's municipal code is not a monolith. Per [ADR-019](80_adrs/adr_019_layered_code_substrate.md), the pipeline decomposes it into three layers, which closes two of the open design items below and reshapes the cost model.

Layer 1 is the model-code base: the ICC I-Codes (IRC, IBC, IFC, IMC, IPC, IFGC, IECC) and the NEC, by edition. Roughly 30 to 40 documents cover essentially every Texas city. The base is ingested once into shared `code-edition` and `code-section` atoms and referenced by every jurisdiction that adopts that edition, so it is a one-time capability-and-corpus investment amortized across the catalog rather than a per-jurisdiction cost.

Layer 2 is the jurisdiction amendment overlay: jurisdiction-scoped `code-amendment` atoms, each linked to the model-code section it modifies. Jurisdiction-authored, hosted in full.

Layer 3 is the bespoke local code: `code-section` atoms for zoning, the UDC, subdivision regulations, and local-only chapters with no model-code parent. Jurisdiction-authored, hosted in full. This is what the Hutto UDC ingest produced.

A `jurisdiction-corpus` atom references the shared Layer 1 editions a city adopts plus its own Layer 2 overlay and Layer 3 sections. The effective rule for a jurisdiction is the model-code base section composed with that jurisdiction's overlay. This is why the layered substrate reshapes the cost model: ingest the base once, and each new city becomes a cheap amendment-plus-zoning ingest. It is the structural answer to the cost-per-jurisdiction commitment as the catalog scales.

The substrate proceeds now on an interim footing. The Layer 1 base atoms host structure, cross-references, and the reasoning layer, and deep-link the verbatim model-code text to the publishers' free public viewers rather than hosting it; the Layer 2 and Layer 3 jurisdiction-authored text is hosted in full. Full licensed hosting of the base text is an upgrade gated independently on the IP attorney memo or an ICC and NFPA partnership, and neither gates the interim substrate. See ADR-019 for the decision, alternatives, and open implementation choices, and [`73_partnerships.md`](73_partnerships.md) for the ICC and NFPA standards-body partnership track.

## Sprint plan

### B.1 — Input adapter framework

**Goal:** Any jurisdiction's code source flows into the pipeline through a single adapter shape.

**Adapter contract.** Every input source implements a common interface:
- `discover()` — list available codes / editions / amendments for the source
- `fetch(reference)` — pull raw content for a specific code/edition
- `metadata(reference)` — extract source-level metadata (publication date, jurisdiction, edition string, source URL)
- `normalize(raw) → structured` — convert source-specific format into the common intermediate structure consumed by B.2

**First implementations:**

| Source | Auth shape | Output format | Priority |
|---|---|---|---|
| Municode HTML | Public web | HTML scrape → DOM walk | **P1** (most TX cities are on Municode) |
| eCode360 | Public web / API | JSON API where available, HTML fallback | **P1** (broad coverage) |
| Raw PDF | Public download | PDF parse + OCR (where needed) | **P2** (catchall) |
| Jurisdiction direct | Per-city auth (vary) | Whatever the city publishes | **P3** (one-off, doesn't scale) |
| Manual curation | n/a | Operator-supplied structured input | **P3** (escape hatch) |

**Exit:** First adapter (Municode) running end-to-end against one test jurisdiction (probably Bastrop UDC if not already done in A.1, otherwise a second TX city for validation).

### B.2 — Structural extraction

**Goal:** Adapter output → typed structural tree.

The tree captures the hierarchical structure of municipal code — chapters, articles, divisions, sections, subsections, definitions, amendments, cross-references. Different sources express the same structure differently; B.2 normalizes them.

**Extracted structure types:**

- `chapter` / `article` / `division` — hierarchical containers
- `section` — leaf rule unit
- `subsection` — subordinate rule unit under a section
- `definition` — defined term inside a section or definition glossary
- `cross-reference` — pointer from one section to another ("see § 5.04")
- `amendment` — ordinance modifying a section, with date and authority
- `note` / `commentary` — non-normative annotation

**Why this matters:** Without proper structural extraction, code atoms are blobs of text. With it, every cross-reference becomes a typed link (per ADR-010) that the engine can traverse. "Section 5.04(b)(2) cross-references Section 3.12(a)" becomes a queryable relationship, not a text fragment.

**Exit:** Structural tree for one test jurisdiction matches manual ground-truth verification at >95% accuracy on a sample of 50 sections.

### B.3 — Atomization

**Goal:** Structural tree → atoms registered against the contract.

**New atom types** (added to atom registry per [`27_engine_evolution_plan.md`](27_engine_evolution_plan.md) Stream B; coordinated minor version bump):

| Atom type | Layer | Purpose |
|---|---|---|
| `code-section` | data-level | A normative rule unit; the leaf for plan-review citation |
| `code-definition` | data-level | A defined term; referenced by sections that use it |
| `code-amendment` | data-level | An ordinance modifying a section; chained to the original |
| `code-cross-reference` | data-level | A typed link from one section to another |
| `code-edition` | data-level | A version of a code as adopted at a point in time |
| `jurisdiction-corpus` | data-level | Pack-level atom referencing all sections in a jurisdiction's adopted edition |

Each atom carries:
- Standard ADR-001 four-layer contract (identity, context, composition, history)
- CID per ADR-010
- DID per ADR-011
- Jurisdiction scope (the jurisdiction whose code this is part of)
- Source provenance (which adapter, which fetch, when)
- Cross-references as typed links (per ADR-010 graph)

**Exit:** Test jurisdiction's code expressed as atoms; spot-check 100 sections for accurate text content, accurate hierarchy placement, accurate cross-reference resolution.

### B.4 — Retrieval index + eval harness

**Goal:** Atoms are discoverable; quality bar is enforced before any jurisdiction is "declared loaded."

**Index layer** — Postgres index per ADR-010 holds `(atom_did, cid, atom_type, jurisdiction_tenant, section_number, subsection_path, …)`. Queries from consumers (Codex, Cortex, SmartCity OS) hit the index first; IPFS fetch follows when content is needed.

**Eval harness** — A known-answer test suite per jurisdiction:

1. **Curated query set.** ~50-100 reviewer-realistic queries per jurisdiction. Example: "What's the setback requirement for an R-1 lot in Bastrop?" — known answer: § 5.04(b).
2. **Retrieval test.** Engine retrieves; pass if top-3 results contain the known answer.
3. **Coverage test.** Sample N random sections; check each is retrievable by its section number.
4. **Cross-reference test.** Sample N cross-references; check each resolves to a valid target atom.

A jurisdiction is "declared loaded" when the eval harness passes at the configured quality bar (initial proposal: 90% top-3 retrieval on curated queries, 100% section-number retrievability, 95% cross-reference resolution).

**Exit:** Eval harness runs against the test jurisdiction; quality bar passes or is empirically adjusted.

### B.5 — Version tracking

**Goal:** Codes change. The pipeline handles amendments without re-ingesting from scratch.

**Amendment ingestion.** New ordinance → `code-amendment` atom → linked to the affected `code-section` → new edition of that section published as a new CID. The DID for the section resolves through IPNS to the latest CID; old CIDs remain queryable for as-of-time queries.

**Edition tracking.** A jurisdiction's `code-edition` atom names which sections are at which CID. New edition = new `code-edition` atom. Multiple editions can be live simultaneously (e.g., "Bastrop UDC as of 2024-01-01" and "Bastrop UDC as of 2026-05-01" both queryable).

**Drift detection.** Periodic re-fetch from source. If structural extraction surfaces changes not yet captured as amendments, flag for operator review.

**Exit:** Test jurisdiction has at least two editions live; queries can specify edition; drift detection runs on a schedule.

### B.6 — First validation pass + coverage dashboard

**Goal:** Pipeline matches or exceeds the quality of the one-off Bastrop UDC + Grand County IRC load from A.1.

**Validation.** Regenerate Bastrop UDC + Grand County IRC entirely through the pipeline. Diff against A.1's one-off output. Quantify deltas; investigate any reduction in quality; iterate on adapters / extraction until parity or improvement.

**Coverage dashboard.** A first-class operational surface showing:
- Which jurisdictions are loaded
- Which edition of each
- When each was last refreshed
- Quality bar status (passing / failing / not yet evaluated)
- Drift status (clean / amendments pending)

**Exit (= pipeline MVP):** Pipeline produces output matching A.1's one-off load; new jurisdictions can be added via pipeline run with no engineering work.

## Tooling — what to build first

Concrete steps to start setting up the data sets, in order:

1. **Adapter framework skeleton.** Define the interface in code; stub implementations for each source type. Forces the contract early.
2. **Municode adapter MVP.** Pick one TX city on Municode (not Bastrop — preserve A.1's clean run). Fetch + normalize. Confirms the contract.
3. **Structural extraction baseline.** Build the structural tree extractor against Municode's HTML schema. Test against the same city.
4. **Atom-type registrations.** Land the new atom types in the registry. Land schema. Land contract tests.
5. **First atomization run.** End-to-end: Municode adapter → structural extraction → atom registration → IPFS pin → Postgres index entry. Validate against a small section of the test city.
6. **Eval harness skeleton.** ~10 known-answer queries against the test city. Run; measure; calibrate.
7. **Bastrop UDC pipeline run.** With confidence from steps 1-6, run the pipeline against Bastrop UDC. Compare to A.1's one-off output.

Steps 1-6 are roughly 2-3 sprint-weeks with focused effort. Step 7 is the milestone — by the time it's done, the pipeline can ingest the next jurisdiction by configuration alone.

## Open decisions

- **Default quality bar threshold.** 90% top-3 retrieval, 100% section-number retrievability, 95% cross-reference resolution are proposals. Refine after first jurisdiction's eval data.
- **Curated query set authoring.** Who writes the ~50-100 known-answer queries per jurisdiction? Reviewer-zero (Sylvia / Jaime for Bastrop)? Consultant partner? Operator? Hybrid.
- **Adapter authentication for paywalled sources.** Some jurisdictions sit behind paywalled code-publishing services. License terms, scrape ethics, formal partnerships all open.
- **Cross-jurisdictional code reuse. Resolved 2026-05-21 per [ADR-019](80_adrs/adr_019_layered_code_substrate.md).** The layered code substrate makes shared code the ordinary case rather than a condition to detect: many jurisdictions reference the same shared Layer 1 `code-edition` atoms by design. See the Layered code substrate section above.
- **Custom-amendment handling. Resolved 2026-05-21 per [ADR-019](80_adrs/adr_019_layered_code_substrate.md).** The explicit pattern is the Layer 2 amendment overlay: a base `code-section` atom plus a jurisdiction-scoped `code-amendment` link. Whether that reuses the existing temporal-amendment type or warrants a distinct type is an ADR-019 open implementation choice for cc-agent-E. See the Layered code substrate section above.
- **OCR quality for raw PDF.** PDF-OCR pipeline (Tesseract, AWS Textract, Google Document AI, Claude vision) — pick one or composable. Some PDFs are scanned poorly; salvage policy needed.
- **Multilingual codes.** Some jurisdictions publish in multiple languages. Out of scope for MVP; surface later when relevant.
- **Pipeline orchestration.** Cron + Postgres job table? Temporal? Dagster? Airflow? The pipeline is a multi-stage workflow with retries, observability, and human-in-loop steps. Operational choice; defer until tooling step 4.
- **Consultant-firm contributions.** Code rewrite firms could publish atom packs via the pipeline (or via direct atom registration). Trust model, signing requirements, review gate all open.

## Dependencies

- **[ADR-001](80_adrs/adr_001_atom_architecture.md)** — atom contract this pipeline produces against
- **[ADR-010](80_adrs/adr_010_atom_graph_traversal.md)** — IPFS storage + Postgres index this pipeline writes to
- **[ADR-011](80_adrs/adr_011_atom_identity_across_versions.md)** — DID + IPNS identity layer for atom thread-of-versions
- **[`27_engine_evolution_plan.md`](27_engine_evolution_plan.md) Stream B** — atom registry expansion that adds the code atom types; coordinated minor version bump
- **[`11a_bastrop_live_roadmap.md`](11a_bastrop_live_roadmap.md)** — Track B home that this doc supersedes; Sprint A.1's one-off Bastrop load is upstream of B.6's validation pass
- **Code Ingestion Pipeline staffing** — cc-agent capacity post-A.1; see open decision on parallelism in 11a

## Cross-cutting

- **Tiered access model.** Per [`08_tiered_access_model.md`](08_tiered_access_model.md), the bare code reference atoms produced by this pipeline are the free-tier substrate. The pipeline produces them; pricing / access control happens downstream.
- **Atom packs.** Per [ADR-012](80_adrs/adr_012_atom_export_format.md), `.atompack` exports bundle jurisdictional atoms. The pipeline is what populates packs.
- **Parcel Intelligence.** Per [`46_smartcity_parcel_intelligence.md`](46_smartcity_parcel_intelligence.md), the parcel briefing draws on jurisdiction zoning + permit history. Zoning atoms produced by this pipeline are upstream of Parcel Intelligence.
- **Adjudication context (separate).** Reviewer adjudications captured during Bastrop use *attach to* code-section atoms produced by this pipeline. The pipeline doesn't produce adjudication atoms (those come from Codex 1b use); but the section atoms are the substrate adjudications anchor to.

## References

- [`07_product_line_summary.md`](07_product_line_summary.md) — product line context; pipeline is the capability under all products
- [`08_tiered_access_model.md`](08_tiered_access_model.md) — commercial framing for what's free vs. paid
- [`11_roadmap.md`](11_roadmap.md) — portfolio roadmap
- [`11a_bastrop_live_roadmap.md`](11a_bastrop_live_roadmap.md) — Track B home; this doc replaces Track B's placeholder content
- [`25_atom_architecture_reference.md`](25_atom_architecture_reference.md) — atom architecture spec; new atom types extend this
- [`27_engine_evolution_plan.md`](27_engine_evolution_plan.md) — engine evolution plan; Stream B atom-registry expansion includes code atoms
- [`46_smartcity_parcel_intelligence.md`](46_smartcity_parcel_intelligence.md) — Parcel Intelligence; consumes zoning atoms from this pipeline
- [`47_codex_plan_review.md`](47_codex_plan_review.md) — Codex product home; consumes code-section atoms via Codex 1b
- [`48_codex_program_plan.md`](48_codex_program_plan.md) — Codex program plan; Phase 1 Stream 27-D corpus depth resolves into this pipeline
- [`80_adrs/adr_001_atom_architecture.md`](80_adrs/adr_001_atom_architecture.md) — atom contract
- [`80_adrs/adr_010_atom_graph_traversal.md`](80_adrs/adr_010_atom_graph_traversal.md) — IPFS storage substrate
- [`80_adrs/adr_011_atom_identity_across_versions.md`](80_adrs/adr_011_atom_identity_across_versions.md) — DID + IPNS identity
- [`80_adrs/adr_012_atom_export_format.md`](80_adrs/adr_012_atom_export_format.md) — `.atom` and `.atompack` export format

## Revision history

- **2026-05-12 (origin):** Drafted during velocity-through-2026 brainstorm session. Replaces the Track B placeholder in [`11a_bastrop_live_roadmap.md`](11a_bastrop_live_roadmap.md) with a substantive design. Captures B.1-B.6 sprint structure with technical depth sufficient to start setting up tooling. Marked active; refinement-deferred items in Open decisions section.
