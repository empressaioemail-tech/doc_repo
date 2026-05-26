---
decision_id: 2026-05-26_recorded_restrictions_phase_0_scope
date: 2026-05-26
owner: Nick
status: active
related_canonical: [80_adrs/adr_020_recorded_instruments_and_restriction_clauses, 80_adrs/adr_021_constraint_resolution_and_precedence, 49b_encumbrance_ingestion_pipeline, 27_engine_evolution_plan, 73_partnerships, _research/2026-05-26_recorded_restrictions_full_vision, _dispatches/2026-05-26_cc-agent-AC_recorded_restriction_atom_types, _dispatches/2026-05-26_cc-agent-C_encumbrances_phase_1_upload]
related_skill: [premortem-check, catalog-thesis-check]
---

## Decision

Phase 0 is **complete in doc_repo**. Phases **1–3** are approved in sequence: (1) engagement PDF upload + Encumbrances UI + briefing section (R4 only); (2) subdivision `restriction-corpus` + MCP `get_encumbrances_for_parcel`; (3) plan-review covenant findings. Phases **4–6** (county recorder, title plant, shared engine resolver) remain **queued** behind Cortex QA closeout and operator partnership outreach. Private encumbrances are **not** an extension of the Code Library corpus.

## Context

2026-05-26 strategic session defined full vision for recorded restrictions (deed restrictions, CC&Rs, plat notes). Vision filed in `_inbox/` then promoted to `_research/`. Municipal code pipeline and Code Library IA are the wrong host for private instruments. Dossier thread (2026-05-24) already placed deed records as layer atoms; Phase 0 lands ADRs and pipeline design so product agents can execute.

## Structural commitment check (premortem-check)

| # | Commitment | Result |
|---|---|---|
| 1 | Sell reasoning, not data | **Green.** ADR-020/021 require provenance, confidence, timestamp, `constraint-resolution` reasoning. |
| 2 | Partnership-first sourcing | **Green with operational note.** R1/R2/R3 are partnership tracks; R4 upload allowed; no national recorder scrape. County/clerk = licensors (same class as operational county data). |
| 3 | Cost per jurisdiction | **Green.** Separate cost model in 49b; does not change $200/jurisdiction code ingest. Hard kill on manual-transcription counties. |
| 4 | Dual interface | **Green.** MCP tools in Phase 2; UI in Phase 1; sequenced per 28. |
| 5 | Hauska spine | **Green.** Substrate atom types + engine resolver express Hauska catalog thesis for place-bound intelligence. |
| 6 | Focus queue | **Yellow, acknowledged.** Not on active sprint; queues after Cortex QA / Dallas E2E. Phase 1 dispatch is operator-triggered, not displacing cc-agent-E Sync 5. |
| 7 | Quality gate | **Green.** Wired into ADR-020 clause fields and eval harness. |

**Overall: green.** Operational yellow on focus queue acknowledged; Phase 1 does not auto-start without operator dispatch to cc-agent-C.

## Catalog thesis check

| Check | Result |
|---|---|
| Brand placement (ADR-008) | **Aligned.** Atom types on Hauska substrate; Cortex/Codex are consumers. |
| Codex naming | **Aligned.** Covenant findings under Codex plan review, not code intelligence Layer 1. |
| Tier model (08) | **Aligned.** Never `public-free` for full instrument text; Layer 2 / engagement-private. |
| MCP architecture (51) | **Aligned.** New tools on existing hauska-mcp-server in Phase 2, not per-atom servers. |
| MCP-first (28) | **Aligned.** Phase 2 MCP follows Phase 1 UI for this existing UI-first product. |
| Web UI per atom (catalog) | **Aligned.** No catalog-level web UI; product Encumbrances tab only. |
| Active sprint competition | **Partial.** Sequencing note only; operator gates Phase 1 dispatch. |

**Overall: aligned.**

## Reasoning

Private encumbrances are parcel-scoped and issuer-attested, not jurisdiction-published code. Separate atom types prevent tier and citation confusion. Upload-first (R4) delivers customer value without county MOU while partnership tracks mature. Constraint resolver (ADR-021) is specified early so Phase 1 briefing does not entrench LLM-only merge logic.

## Reversal criteria

- Revisit if legal counsel blocks hosting recorded PDFs on IPFS (ADR-020 reversal path).
- Pause Phase 4+ if three counties fail cost/human-review hard kill in 49b.
- Collapse atom types into instrument-only blobs if clause-level index blocks scale (ADR-020 reversal).

## Dependencies

- **Depends on:** ADR-017 accessPolicy, ADR-010 graph, published `@hauska/atom-contract` (for formal types).
- **Enables:** cc-agent-AC atom registration, cc-agent-C Phase 1, future cc-agent-M MCP tools.
- **Does not depend on:** Sync 5 completion, substrate v1 launch gates.

## Counterparties

- **Phase 4+:** County clerks (Bastrop, Dallas County templates), title underwriters (Stewart, First American, Fidelity), HOAs.
- **Phase 1:** Empressa operator + architect users via engagement upload.
