---
date: 2026-05-21
agent: planner
repo: docs
session_type: planning
rolled_up: true
rolled_up_into: [49_code_ingestion_pipeline, 51_substrate_v1_sprint, 73_partnerships, adr_019_layered_code_substrate]
---

# Layered code substrate ADR + ICC/NFPA pitch framing

## What was done

Dedicated strategic session acting on the two connected moves cc-agent-E surfaced during the Hutto TX UDC ingest (session summary `_sessions/2026-05-20_hutto_tx_udc_ingest_cc-agent-E.md`, sections "What's still open" items 2 and 3).

**Move 1, the layered code substrate, ratified as ADR-019.** A municipal code decomposes into three layers: a shared model-code base (the ICC I-Codes plus the NEC, by edition, roughly 30 to 40 documents covering essentially every Texas city), a per-jurisdiction amendment overlay, and the bespoke local code (zoning, UDC, local-only chapters). The pipeline ingests the base once into shared `code-edition` and `code-section` atoms, and each new city becomes a cheap amendment-plus-zoning ingest. The substrate proceeds now on an interim footing: the Layer 1 base atoms host structure and the reasoning layer and deep-link the verbatim model-code text to the publishers' free viewers; Layer 2 and Layer 3 jurisdiction-authored text is hosted in full. Full licensed hosting of the base text is an upgrade gated independently on the IP attorney memo or an ICC and NFPA partnership, and neither gates the interim substrate. New doc: `80_adrs/adr_019_layered_code_substrate.md`, status accepted.

**Move 2, the ICC and NFPA commercial-layer pitch, scaffolded.** Pitch the Hauska commercial layer to ICC and NFPA as the metered agent-retrieval channel they cannot currently bill, making them paying licensors with revenue share. One ICC deal is the legally-clean base layer for the whole catalog and moots the model-code copyright question. The pitch framing is scaffolded in `73_partnerships.md`; the decision to pitch and the pitch itself remain a Nick and bizops action. The planner does not decide it.

**Checks run.** Pre-mortem on both moves: both cleared green (all load-bearing commitments clear, commitment 3 materially improved by the layered substrate; one operational yellow each on the focus queue, resolved on idle-capacity and bizops-cycle acknowledgment). Catalog-thesis-check on the ICC and NFPA pitch: passes, with one partial (standards-body revenue-share mechanics, as distinct from the city template, route to docs 74 and 14 when the deal shapes up).

**Doc updates applied.** Doc 49: new "Layered code substrate" section; the cross-jurisdictional-code-reuse and custom-amendment-handling open-design items resolved in place, pointing to ADR-019. Doc 73: new "Standards-body licensor partnerships (ICC, NFPA)" section with the partnership-target rows and pitch framing. Doc 51: Hutto UDC rollup, Tier 1 Hutto checked off as a prioritized one-off, removed from the Sync 5 deferred list, running catalog total 2414 atoms.

## What was learned (changes to ground truth)

The layered substrate is the structural answer to the cost-per-jurisdiction commitment as the catalog scales. The monolith pipeline re-ingests the shared model-code base for every city; the layered substrate ingests it once and amortizes it. Doc 49's two open-design items were not separate problems; they are the same three-layer decomposition viewed from two angles.

The Hutto ingest already proved the shape: the bespoke UDC (Layer 3) was a cheap clean ingest, and the model-code-bearing general code (Layers 1 and 2) is exactly the part that was access-blocked and copyright-implicating. The expensive and constrained part of any city's code is the shared base that should be ingested once.

The substrate and the ICC and NFPA pitch are deliberately decoupled. The substrate proceeds on the interim deep-link footing regardless of the pitch's slow sales cycle; the pitch is upside, not a dependency.

## What's still open

The ICC and NFPA pitch is a Nick and bizops decision, not yet made. The framing is scaffolded in doc 73.

ADR-019 carries six implementation-mechanism open decisions for cc-agent-E, who executes the layered-substrate pipeline work: whether to reuse the `code-amendment` atom type or add a distinct jurisdictional-amendment type; which model-code editions to ingest first; deep-link granularity; effective-rule composition (query-time merge versus materialized); deep-link health and drift detection; the full-text-hosting upgrade trigger.

Standards-body revenue-share mechanics need specification in docs 74 and 14 when an ICC or NFPA deal shapes up.

The layered-substrate pipeline execution is cc-agent-E idle-capacity work, sequenced after this ADR, not displacing the combined Cortex/Codex sprint. The dispatch for that work is a separate session decision.

## Canonical doc updates applied

- New: `80_adrs/adr_019_layered_code_substrate.md` (status accepted).
- `49_code_ingestion_pipeline.md`: "Layered code substrate" section added; two open-design items resolved; frontmatter `related` and `last_updated` bumped.
- `73_partnerships.md`: "Standards-body licensor partnerships (ICC, NFPA)" section added; cross-reference and revision-history entries added; `last_updated` bumped.
- `51_substrate_v1_sprint.md`: Hutto UDC rollup applied; `last_updated` bumped.
- `00_current_state.md`: ADR-019 added to Open ADRs; recent-sessions and cross-cutting watch list updated.
- Folded into this session's commit: the prior session's uncommitted Hutto rollup of `43_cortex_qa_backlog.md` and `_decisions/2026-05-20_hutto_tx_prioritized_ingest.md` (decision flipped provisional to active).
