---
id: adr_020_recorded_instruments_and_restriction_clauses
title: ADR-020 — Recorded instruments and restriction clauses (private encumbrances)
status: accepted
last_updated: 2026-05-26
applies_to: portfolio
related: [adr_001_atom_architecture, adr_007_cross_stakeholder_atom_access, adr_010_atom_graph_traversal, adr_011_atom_identity_across_versions, adr_012_atom_export_format, adr_015_actor_atoms, adr_017_atom_access_control, adr_021_constraint_resolution_and_precedence, 27_engine_evolution_plan, 46_smartcity_parcel_intelligence, 49b_encumbrance_ingestion_pipeline, _decisions/2026-05-26_recorded_restrictions_phase_0_scope]
owner: nick
---

# ADR-020 — Recorded instruments and restriction clauses

## Status

**Accepted** 2026-05-26. Phase 0 architecture for the recorded private-land-use layer (deed restrictions, CC&Rs, plat restrictions, easements). Implementation phases 1–6 are sequenced in [`_decisions/2026-05-26_recorded_restrictions_phase_0_scope.md`](../_decisions/2026-05-26_recorded_restrictions_phase_0_scope.md). Atom contract registration is cc-agent-AC follow-on.

## Context

The Hauska public code catalog (`code-section`, `jurisdiction-corpus`) answers what a jurisdiction requires by adopted law. Parcel intelligence today models **regulatory** overlays (`constraint-overlay`: FEMA, habitat, city zoning districts) per [`27_engine_evolution_plan.md`](../27_engine_evolution_plan.md) and [`46_smartcity_parcel_intelligence.md`](../46_smartcity_parcel_intelligence.md). It does not model **private recorded encumbrances**: CC&Rs, subdivision plat restrictions, supplemental deed restrictions, and easements recorded with the county clerk or supplied via title commitment.

Cortex architects and Codex reviewers need both layers composed at a parcel. The dossier vision ([`_sessions/2026-05-24_claude_parallel_planning_carryover_claude_code.md`](../_sessions/2026-05-24_claude_parallel_planning_carryover_claude_code.md)) lists deed records as layer atoms. Extending the Code Library UI to host private restrictions would conflate public law with private instruments and mislead users about enforcement authority.

This ADR introduces atom types for private encumbrances, distinct from `constraint-overlay` and from `code-section`.

## Decision

Introduce four atom types for the private encumbrance layer. All are Hauska substrate atoms per [ADR-018](adr_018_atom_contract_substrate_layer.md). All full-text and clause bodies default to **Layer 2 paid** or **engagement-scoped tenant-private** per [ADR-017](adr_017_atom_access_control.md); they are never `public-free`.

### 1. `recorded-instrument`

Parent atom for one recorded or uploaded instrument.

**Required fields:**

- `instrumentDid` (per ADR-011)
- `instrumentType`: `plat-restriction` | `cc-r-declaration` | `deed-restriction` | `easement` | `lien` | `other`
- `recording`: `{ county, state, book?, page?, instrumentNumber?, recordedAt? }` (nullable when source is upload-only)
- `issuerActorDid` → `actor-record` (HOA, developer, individual grantor, county as recorder)
- `sourceDocumentCid` (IPFS CID of wet PDF or authoritative scan; mandatory)
- `appliesTo`: `{ parcelDids[]?, platId?, legalDescription? }` (at least one anchor)
- `accessPolicy`: `tenant-private` | `tenant-shared` (default `tenant-private` on creating tenant)
- `legalWeight`: `recorded` (fixed for this type)
- `verificationStatus`: `machine` | `human` | `title-company`
- `extractedAt`, `sourceAdapter` (R1–R5 track per [`49b_encumbrance_ingestion_pipeline.md`](../49b_encumbrance_ingestion_pipeline.md))

**Optional:** `supersedesInstrumentDid`, `amendedByInstrumentDid[]` for amendment chains.

**Graph:** `parcel-record` —`subject-to`→ `recorded-instrument` (composition or typed link per ADR-010).

### 2. `restriction-clause`

Enforceable snippet extracted from an instrument.

**Required fields:**

- `clauseDid`
- `parentInstrumentCid` (→ `recorded-instrument`)
- `clausePath` (human label: "Article VII § 4.2" or plat note id)
- `bodyText` (normative text)
- `structuredFields?` (typed extract: `maxHeightFt`, `prohibitedUses[]`, `setbackFt`, `materialAllowlist[]`, etc.)
- `confidence` (0–1), `extractedBy` (model + version or adapter id)
- `humanVerifiedAt?`, `verifiedByActorDid?`
- `accessPolicy` (inherits parent instrument scope)
- `legalWeight`: `recorded`
- Quality gate: `reasoningSummary?`, `sourceCitation` (instrument + page), `confidence`, `evaluatedAt` per structural commitment 1

**Optional graph:**

- `references` → `code-section` when clause cites zoning or code
- `constrains` → geometry CID when buildable envelope or easement corridor is parsed (spatial follow-on)

### 3. `restriction-corpus`

Subdivision- or development-scoped pack (many parcels inherit one CC&R set).

**Required fields:**

- `corpusDid`, `displayName`, `platId?`, `subdivisionName`
- `instrumentCids[]` (composition to `recorded-instrument`)
- `coverageParcelCount?`, `lastRefreshedAt`
- `accessPolicy` (typically `tenant-shared` with explicit shared-with for HOA + Hauska)

Analogous to `jurisdiction-corpus` but scoped to private development, not municipal code. Target for `.atompack` export per [ADR-012](adr_012_atom_export_format.md) (title-channel distribution).

### 4. `administrative-rule`

Unrecorded HOA design guidelines or management rules.

**Required fields:** same shape as `restriction-clause` where applicable, but `legalWeight`: `advisory` (required). `sourceDocumentCid` optional. Must not use municipal branding in render templates.

UI and findings must label these as **HOA advisory**, not code or recorded covenant.

### Relationship to existing types

| Existing type | Relationship |
|---|---|
| `constraint-overlay` | Public regulatory overlay; keep separate. Do not store CC&Rs as overlay. |
| `code-section` | Public law; may be referenced by `restriction-clause`. |
| `parcel-record` | Anchor; gains `subject-to` instruments. |
| `parcel-briefing` | Consumer; composes private restriction summary from clauses + [`adr_021`](adr_021_constraint_resolution_and_precedence.md). |

### Wet PDF belt-and-suspenders

Every `recorded-instrument` and every human-facing `restriction-clause` citation must resolve to `sourceDocumentCid`. DID on the clause is derivation attestation only, not a substitute for the recorder's instrument. Aligns with dossier pressure test #2.

## Alternatives considered

**Store encumbrances as `code-section` with a private flag.** Rejected. Collapses public law and private covenant in one type; breaks Layer 1 free-tier semantics and Codex citation semantics.

**Single blob atom per PDF.** Rejected. No clause-level findings, adjudication, or graph traversal; fails sell-reasoning and plan-review use cases.

**Only `constraint-overlay` with a private overlayType.** Rejected. Overloads regulatory overlay semantics and accessPolicy patterns built for FEMA/zoning.

## Consequences

**Positive:**

- Clear product semantics: Code Library = public code; Encumbrances = private instruments.
- Plan review can cite `restriction-clause` separately from `code-section` (Phase 3).
- Title and HOA partnership tracks have a substrate shape ([`73_partnerships.md`](../73_partnerships.md)).

**Negative:**

- Atom contract minor bump and engine registry work (cc-agent-AC).
- Ingest cost is per parcel/subdivision, not per jurisdiction ([`49b`](../49b_encumbrance_ingestion_pipeline.md)).
- OCR and legal-risk require human verify before Layer 2 promotion.

## Open decisions

- Engagement-scoped `accessPolicy` refinement: use `tenant-private` with `engagementId` metadata vs new scope value. Resolve at MCP enforcement implementation.
- PII on `recorded-instrument` (grantor names): align with ADR-007 `piiFields` on `parcel-record`.
- Spatial `constrains` geometry: defer to spatial-layer ADR in dossier queue.

## Reversal criteria

Revisit if (a) atom volume from clause-level atomization blocks index at scale, in which case tighten to instrument-level atoms with clause arrays inside the instrument body; or (b) legal counsel directs recorded text not be hosted on IPFS, in which case store hash + pointer to partner title vault only.

## References

- [`_research/2026-05-26_recorded_restrictions_full_vision.md`](../_research/2026-05-26_recorded_restrictions_full_vision.md)
- [`49b_encumbrance_ingestion_pipeline.md`](../49b_encumbrance_ingestion_pipeline.md)
- [`adr_021_constraint_resolution_and_precedence.md`](adr_021_constraint_resolution_and_precedence.md)
