---
id: 70_bizops_overview
title: Bizops overview â 70-band pointer doc
status: active
last_updated: 2026-05-18
applies_to: portfolio
related: [00_current_state, 14_pricing_framework, 18_stakeholder_graph, 71_pipeline, 72_hauska_inc_operations, 73_partnerships, 74_commercial_agreements]
owner: nick
---

# Bizops overview

> **Pointer doc.** This is the entry point for the 70-band, which houses business-operations workstreams. Strategic theses live in the 09 / 10 band; pricing-framework decisions live at [`14_pricing_framework.md`](14_pricing_framework.md); the relationship graph lives at [`18_stakeholder_graph.md`](18_stakeholder_graph.md); product surfaces live in the 30 / 40 / 50 / 60 bands. The 70-band is where the operational, non-product, non-engineering work of running the portfolio gets tracked.

## What lives in this band

- [`71_pipeline.md`](71_pipeline.md) â active prospects, leads, funnel state.
- [`72_hauska_inc_operations.md`](72_hauska_inc_operations.md) â Hauska Inc. corporate state: entity separation, banking, IP attorney memo, Tech E&O insurance, money-transmitter posture, KYC/AML thresholds, settlement-rail status.
- [`73_partnerships.md`](73_partnerships.md) â formalized partnerships and the partnership-first sourcing template applied through Bastrop.
- [`74_commercial_agreements.md`](74_commercial_agreements.md) â active contracts, proposals in flight, NDA / revenue-share / MSA templates.
- [`_prospects/`](_prospects/) â per-prospect working files. Series subdirectory per [`01_doc_conventions.md`](01_doc_conventions.md). Today: `_prospects/mox/` carries three Mox engagement artifacts moved from root 2026-05-18.

## Hauska spine rule applied to bizops

Per CLAUDE.md decision rules: if a bizops workstream does not feed or express Hauska, do not consume cycles on it. 70-band content stays load-bearing only when it traces back to Hauska substrate momentum (Hauska Inc. corporate readiness, partnerships that source jurisdiction atoms, commercial agreements that route Layer 2 revenue, prospects that consume the substrate).

The portfolio also includes work that does not feed Hauska â real estate development at Jarrell, for instance â and that work explicitly stays out of scope per CLAUDE.md. The 70-band is not a catch-all for non-engineering work; it is the bizops layer of the Hauska / Empressa portfolio specifically.

## Cross-band relationships

The 70-band is read by other bands but does not own their canon.

- [`14_pricing_framework.md`](14_pricing_framework.md) Open-questions section #5 (regulatory posture: money-transmitter, KYC/AML) gates on items tracked in [`72_hauska_inc_operations.md`](72_hauska_inc_operations.md) (IP attorney memo delivered AND operating banking established).
- [`51_substrate_v1_sprint.md`](51_substrate_v1_sprint.md) sync point #6 (non-Bastrop ingestion gated on Texas IP attorney memo delivery) reads memo-status from [`72`](72_hauska_inc_operations.md).
- [`13_risk_register.md`](13_risk_register.md) Risk 5 (single-customer dependency) and Risk 6 (velocity tax) inform the [`71_pipeline.md`](71_pipeline.md) prioritization posture.
- [`18_stakeholder_graph.md`](18_stakeholder_graph.md) carries the relationship graph; [`73_partnerships.md`](73_partnerships.md) carries the formalized partnership state and is the operational counterpart.
- Product bands (30 SmartCity OS, 40 Cortex / Design Accelerator, 47 Codex plan review, 48 Codex program plan, 49 code ingestion pipeline) own customer / prospect engagement at the product level; the 70-band aggregates across products for portfolio-level pipeline and ops view.

## What this band is not

- Not the strategic theses (those live in 09 / 10).
- Not the pricing framework (that lives in 14).
- Not the stakeholder graph (that lives in 18).
- Not product roadmaps (those live in the product bands).
- Not legal or corporate execution itself â per CLAUDE.md "What is out of scope," legal and corporate execution items route to Nick and do not get worked inside strategic sessions. The 70-band tracks operational state; Nick executes.

## Origin

Band designed 2026-05-18 in the doc-set-sweep + bizops session ([`_sessions/2026-05-18_doc_set_sweep_adr018_claude_code.md`](_sessions/2026-05-18_doc_set_sweep_adr018_claude_code.md)). Forcing function was three Mox engagement artifacts living at repo root pending proper-slot placement; structural design absorbed that placement plus Hauska Inc. corporate-readiness tracking plus partnership / agreements / pipeline operational state into a coherent band.

## Revision history

- **2026-05-18 (origin):** band designed and seeded. Five canonical docs (70â74) plus `_prospects/` subdirectory. Three Mox artifacts relocated from root to `_prospects/mox/`. CLAUDE.md "What is open" bizops bullet and Mox-at-root bullet both drop. [`14_pricing_framework.md`](14_pricing_framework.md) Open-question #5 regulatory-posture gating points at [`72`](72_hauska_inc_operations.md).
