---
id: 49b_encumbrance_ingestion_pipeline
title: Encumbrance ingestion pipeline — recorded private land-use instruments in, clause atoms out
status: active
last_updated: 2026-05-26
applies_to: portfolio
related: [49_code_ingestion_pipeline, adr_020_recorded_instruments_and_restriction_clauses, adr_021_constraint_resolution_and_precedence, 27_engine_evolution_plan, 73_partnerships, 08_tiered_access_model, _decisions/2026-05-26_recorded_restrictions_phase_0_scope]
owner: nick
---

# Encumbrance ingestion pipeline

> **Purpose.** Pipeline that takes recorded private land-use instruments (CC&Rs, plat restrictions, deed restrictions, easements) and produces queryable `recorded-instrument` and `restriction-clause` atoms per [ADR-020](80_adrs/adr_020_recorded_instruments_and_restriction_clauses.md). Parallel in shape to [`49_code_ingestion_pipeline.md`](49_code_ingestion_pipeline.md) but scoped to **parcel and subdivision**, not jurisdiction-wide municipal code.

> **Status posture.** Active design. Phase 1 execution is **upload-only (track R4)** in Cortex per [`_decisions/2026-05-26_recorded_restrictions_phase_0_scope.md`](_decisions/2026-05-26_recorded_restrictions_phase_0_scope.md). County recorder (R1) and title plant (R2) are partnership-gated.

## Why this exists

Municipal code ingest ([`49`](49_code_ingestion_pipeline.md), [`51_substrate_v1_sprint.md`](51_substrate_v1_sprint.md)) does not produce private encumbrances. Regrid and federal overlays produce regulatory context, not CC&R text. Architects and reviewers discover deed restrictions late, often from title commitments, not from the Code Library.

The encumbrance pipeline is the width complement for **place-bound** intelligence: one subdivision CC&R corpus amortized across hundreds of lots; one supplemental deed restriction scoped to a single parcel.

## Architectural overview

```
┌──────────────────────────────────────────────────────────────────┐
│  RAW SOURCES (R1–R5)                                             │
│  County recorder · Title plant · HOA · Upload · Title PDF        │
└────────────────────────────┬─────────────────────────────────────┘
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│  PIPELINE                                                        │
│  E.1 Input adapter framework                                     │
│  E.2 Structural extraction (instruments → clauses)               │
│  E.3 Atomization (ADR-020 types)                                 │
│  E.4 Index + eval + human verify queue                           │
│  E.5 Amendment / supersession linking                            │
│  E.6 Coverage dashboard (parcel / subdivision)                   │
└────────────────────────────┬─────────────────────────────────────┘
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│  ATOM SUBSTRATE + constraint-resolution (ADR-021)                │
└──────────────────────────────────────────────────────────────────┘
```

## Source tracks

| Track | Source | Partnership | Phase |
|---|---|---|---|
| **R1** | County clerk / official records API or bulk | County MOU; partnership-first | 4+ |
| **R2** | Title plant (Stewart, First American, Fidelity) | Enterprise; see [`18_stakeholder_graph.md`](18_stakeholder_graph.md) | 5+ |
| **R3** | HOA / management company | Per-subdivision | 2+ |
| **R4** | Engagement / firm upload | None (customer-supplied) | **1** |
| **R5** | Title commitment PDF on project | Same as R4 | 1 |

Scraping county recorder websites at national scale is **out of policy** per partnership-first commitment. R1 requires licensor terms.

## Sprint plan

### E.1 — Input adapter framework

**Adapter contract** (mirrors B.1):

- `discover(anchor)` — list instruments for `parcelDid`, `platId`, or legal description
- `fetch(reference)` — pull PDF or structured record
- `metadata(reference)` — recording info, issuer, dates
- `normalize(raw) → structured` — instrument tree + clause candidates

| Adapter | Priority | Notes |
|---|---|---|
| R4 Upload | **P1** | Multipart PDF; cortex-api or engine worker |
| R5 Title commitment | P1 | Often multi-instrument PDF; split heuristics |
| R1 County API | P2 | Per-county; Bastrop / Dallas County templates |
| R2 Title plant | P3 | Commercial API |
| R3 HOA feed | P3 | Low structure; high advisory mix |

### E.2 — Structural extraction

**Goal:** PDF/HTML → instrument + clause tree.

Extracted types:

- `instrument` (parent)
- `clause` (normative unit)
- `exhibit` (attachment reference)
- `amendment` (modifies prior instrument)
- `cross-reference` (clause → plat sheet, code section, or other clause)

OCR required for scanned recordings. Store page anchors for citation (`sourcePage` on clause).

**Exit:** 20-clause sample from one test PDF matches human markup at >90% clause boundary accuracy before Layer 2 promotion.

### E.3 — Atomization

Emit `recorded-instrument`, `restriction-clause`, `restriction-corpus` (when subdivision-scoped), `administrative-rule` when source is unrecorded HOA guidelines.

Link to `parcel-record` via `subject-to`. Pin `sourceDocumentCid` on IPFS before index write per ADR-010 atomic write protocol.

### E.4 — Eval + human verify

**Encumbrance eval harness** (not identical to code 1.0/1.0/1.0):

| Metric | Bar |
|---|---|
| Instrument coverage | All known instruments for parcel discovered or explicitly marked absent |
| Clause sample audit | Operator-reviewed sample passes boundary check |
| Conflict flags | Clause vs zoning vs code conflicts surfaced, not silently merged |
| Verification | No `human` promotion without `humanVerifiedAt` on clause |

Default ship state: `verificationStatus: machine`. Layer 2 paid queries prefer `human` or `title-company`.

### E.5 — Amendment linking

`supersedesInstrumentDid` / `amendedByInstrumentDid` on `recorded-instrument`. Re-run resolver (ADR-021) on amendment ingest.

### E.6 — Coverage dashboard

Per parcel: instruments found, clauses atomized, verify queue depth, last refresh. Per subdivision: `restriction-corpus` status.

## Cost model (separate from $200/jurisdiction)

Proposed targets for decision record; not yet operator-ratified:

| Unit | Compute + human review target |
|---|---|
| Subdivision CC&R corpus (once, ~200 lots) | < $500 + 2 hr review |
| Single-lot supplemental deed (corpus exists) | < $50 + 15 min review |
| Net-new parcel, no corpus, upload only | R4 only; no R1 until partnership |

**Hard kill:** three consecutive parcels in one county require full manual transcription with no R1/R2 partnership → pause scaled ingest for that county.

## Tier placement

Per [`08_tiered_access_model.md`](08_tiered_access_model.md):

- Metadata ("3 instruments on file") — engagement-private / Layer 2
- Full clause text + `constraint-resolution` — Layer 2 paid or product-embedded (Cortex/Codex)
- Subdivision `.atompack` — embedder / title enterprise channel

Never `public-free` for full instrument text.

## Execution ownership

| Phase | Repo | Agent |
|---|---|---|
| 0 (ADRs, this doc) | doc_repo | planner |
| 1 Upload + UI | legacy-design-tools | cc-agent-C |
| 1b Atom types | hauska-atom-contract, hauska-engine | cc-agent-AC, cc-agent-E |
| 2 MCP | hauska-mcp-server | cc-agent-M |
| 4+ R1 ingest | hauska-engine | cc-agent-E |

## Open questions

1. First canonical test subdivision (Bastrop walk vs Cedar Hill HOA community).
2. Whether Phase 1 stores provisional JSON in Postgres before `@hauska/atom-contract` bump ships.
3. `variance-record` atom vs `decision-event` for covenant waivers.

## References

- [`_research/2026-05-26_recorded_restrictions_full_vision.md`](_research/2026-05-26_recorded_restrictions_full_vision.md)
- [ADR-020](80_adrs/adr_020_recorded_instruments_and_restriction_clauses.md)
- [ADR-021](80_adrs/adr_021_constraint_resolution_and_precedence.md)
