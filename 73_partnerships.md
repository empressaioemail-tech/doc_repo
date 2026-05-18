---
id: 73_partnerships
title: Partnerships â formalized partnership state
status: active
last_updated: 2026-05-18
applies_to: portfolio
related: [09_post_saas_substrate_thesis, 13_risk_register, 18_stakeholder_graph, 30_smartcity_os, 49_code_ingestion_pipeline, 51_substrate_v1_sprint, 70_bizops_overview, 71_pipeline, 74_commercial_agreements]
owner: nick
---

# Partnerships

> **Formal partnership state.** Operational counterpart to [`18_stakeholder_graph.md`](18_stakeholder_graph.md) (which is the relationship graph). This doc tracks which counterparties are formal Hauska partners under the partnership-first sourcing commitment, what the partnership terms look like, and what the partnership template should look like as the pattern scales.

## Partnership-first sourcing commitment

Per the [four structural commitments](../CLAUDE.md) (commitment #2): cities, counties, and firms are licensors with structural revenue share, not data sources to be scraped. Bastrop is the template. Every new jurisdiction onboarded under the public catalog stack should follow the Bastrop-shaped partnership pattern unless explicitly justified otherwise.

The partnership-preferred rule (per CLAUDE.md decision rules) reads: target partnership cities go through Sylvia, not scraping. Scraping is the fallback for jurisdictions that decline partnership; partnership is the default.

## Active partnerships

### Bastrop â pioneering city (template)

- **Status.** Active. Anchor customer (per [`30_smartcity_os.md`](30_smartcity_os.md)) and partnership template per the partnership-first sourcing commitment.
- **Primary contacts.** Sylvia Carrillo (city manager); Valerie. Per [`18_stakeholder_graph.md`](18_stakeholder_graph.md).
- **Narrative framing.** Per the user-memory `bastrop_pioneer_narrative`: frame Bastrop as the pioneering first city in a network, not as a data source feeding other cities. The narrative matters for both Bastrop-facing communication and the broader partnership pattern.
- **Revenue share.** Structural revenue share contemplated; specific terms gated on the Bastrop revenue-share contract operational pilot per [`14_pricing_framework.md`](14_pricing_framework.md) substrate-state subsection. First real money movement through this partnership gates Phase 3 of the SDK payment substrate.
- **Cross-jurisdictional surfacing.** Per [ADR-007](80_adrs/adr_007_cross_stakeholder_atom_access.md) and the pioneering-city framing, cross-jurisdictional surfacing of Bastrop atoms is opt-in by the source jurisdiction. Default scope is jurisdiction-local; network publish is a separate flag.

## Partnership template

Working draft of the pattern Bastrop establishes for future partnerships. Refined as more partnerships land.

| Element | Bastrop instance | Generalized |
|---|---|---|
| **Anchor product** | SmartCity OS deployment | First product surface running in the partner's environment |
| **Source obligation** | Jurisdiction provides MyGov / permit / parcel / GIS data | Partner contributes the jurisdiction-specific source data |
| **Atomization rights** | Hauska atomizes; jurisdiction co-owns | Hauska atomizes; partner retains source-data ownership; atoms carry licensing metadata per the atom contract |
| **Revenue share** | Structural percentage on Layer 2 paid calls touching partner-sourced atoms | Same shape; specific percentages per partnership |
| **Network surfacing** | Opt-in per ADR-007 | Opt-in by default; partner controls cross-jurisdictional exposure |
| **Pioneering narrative** | Bastrop as first in a network | Each new partnership joins the network; not "another data source" |
| **Cost discipline** | Under 200 dollars compute + one hour human review per jurisdiction (CLAUDE.md commitment #3) | Same discipline; hard kill at three counties if not achievable |

## Pipeline of future partnerships

Sourced from [`49_code_ingestion_pipeline.md`](49_code_ingestion_pipeline.md) and [`51_substrate_v1_sprint.md`](51_substrate_v1_sprint.md). These are jurisdictions on the target list; partnership status is not yet established.

| Jurisdiction | Source | Status |
|---|---|---|
| **Grand County** | [`51`](51_substrate_v1_sprint.md) | One-off + B.6 validation pass; Bastrop-equivalent unblocked posture; partnership terms TBD |
| **Texas-first 25-city list** | [`51`](51_substrate_v1_sprint.md) Stream 1D | Gated on Texas IP attorney memo delivery (tracked in [`72_hauska_inc_operations.md`](72_hauska_inc_operations.md)) |

## Cross-references

- [`09_post_saas_substrate_thesis.md`](09_post_saas_substrate_thesis.md) â strategic foundation for the partnership-first commitment.
- [`14_pricing_framework.md`](14_pricing_framework.md) â revenue-share routing through the SDK payment substrate; Bastrop manual reconciliation pilot gates Phase 3.
- [`18_stakeholder_graph.md`](18_stakeholder_graph.md) â relationship graph; this doc carries operational partnership state, 18 carries the relationship topology.
- [`49_code_ingestion_pipeline.md`](49_code_ingestion_pipeline.md) â code-ingest pipeline depends on partnership-first sourcing for jurisdictions beyond Bastrop / Grand County.
- [`74_commercial_agreements.md`](74_commercial_agreements.md) â revenue-share template lives there; this doc references the template, 74 owns it.
- [`80_adrs/adr_007_cross_stakeholder_atom_access.md`](80_adrs/adr_007_cross_stakeholder_atom_access.md) â cross-jurisdictional surfacing model.
- [`13_risk_register.md`](13_risk_register.md) â Risk 7 (regulatory posture vs TCEQ) ties to Sylvia conversations on the partnership-narrative arc.

## Revision history

- **2026-05-18 (origin):** doc seeded as part of the 70-band design session. Bastrop pioneering-city instance documented; partnership template draft populated from the Bastrop instance; pipeline of future partnerships imported from 49 / 51 sources.
