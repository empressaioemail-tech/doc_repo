---
id: 71_pipeline
title: Pipeline â active prospects, leads, funnel state
status: active
last_updated: 2026-05-18
applies_to: portfolio
related: [13_risk_register, 14_pricing_framework, 18_stakeholder_graph, 30_smartcity_os, 70_bizops_overview, 73_partnerships, 74_commercial_agreements]
owner: nick
---

# Pipeline

> **Operational tracker.** Active prospects, leads, and funnel state. One-line per entity; deeper artifacts live in [`_prospects/<name>/`](_prospects/) subdirectories. Edit in place as state changes; bump `last_updated` on substantive updates.

## Funnel state framework

| Stage | Definition | Typical artifacts |
|---|---|---|
| **Lead** | Identified target; no two-way contact yet | Name, source, target product surface, briefing draft |
| **Prospect** | Two-way contact opened; introductory call complete | Briefing, project instructions, executive summary |
| **Opportunity** | Concrete scope discussed; proposal drafted or in flight | Proposal, scoping notes, pricing application per [`14`](14_pricing_framework.md) |
| **Contract** | Agreement signed; engagement underway | Signed agreement, deployment plan, success criteria |
| **Customer** | Contract executing; recurring engagement | Per-product canonical doc (e.g. [`30_smartcity_os.md`](30_smartcity_os.md) for Bastrop) |

Promotion between stages is operator-driven, not automatic. A prospect that has gone dark stays at Prospect until it reactivates or gets killed. A killed prospect moves to the bottom of this doc with a one-line outcome note, not deleted.

## Active

### Customer â Bastrop (anchor)

- **Status.** Live customer, anchor of the SmartCity OS deployment per [`30_smartcity_os.md`](30_smartcity_os.md).
- **Primary contact.** Sylvia Carrillo per [`18_stakeholder_graph.md`](18_stakeholder_graph.md).
- **Pipeline relevance.** Bastrop is the partnership-first sourcing template per [`73_partnerships.md`](73_partnerships.md); also the active commercial conversation per the Sylvia $1M proposal tracked in [`74_commercial_agreements.md`](74_commercial_agreements.md).
- **Watch state.** Sylvia $1M proposal Path A response in flight per [`14_pricing_framework.md`](14_pricing_framework.md) "Application â Sylvia $1M proposal" section.

### Prospect â Mox Living

- **Status.** Post-call-1; awaiting CEO meeting. 300 people / 45 locations / 12k units Austin multifamily; Miguel Arce decision maker. Lead Phase 1 with accounting close, not parcel intel. Per `_prospects/mox/`.
- **Working artifacts.** [`_prospects/mox/mox_executive_summary_v2.md`](_prospects/mox/), [`_prospects/mox/mox_prospect_briefing.md`](_prospects/mox/), [`_prospects/mox/mox_prospect_project_instructions.md`](_prospects/mox/).
- **Open gate.** Mox CEO meeting timing (per CLAUDE.md "What is open"). Reframes pilot urgency once meeting lands.
- **Pipeline relevance.** Validates the bring-your-own-agent / per-product MCP-surface tier model per [`29_mcp_surface_tier_model.md`](29_mcp_surface_tier_model.md). Second customer signal for [`30_smartcity_os.md`](30_smartcity_os.md) post-Bastrop.

### Lead / deferred â EdgeConneX

- **Status.** Deferred partnership outreach per [`11_roadmap.md`](11_roadmap.md) "Items not on this roadmap because it's a software roadmap."
- **Pipeline relevance.** Potential anchor for a future SmartCity OS deployment outside the Bastrop-Jarrell corridor; decision pending whether to absorb into this roadmap or run as a separate sales pipeline.
- **No active artifacts.**

### Open leads

No additional leads tracked at this band level today. Per [`11_roadmap.md`](11_roadmap.md) Open strategic questions, the "Which second customer, and what the referral funnel looks like" question is owned by Valerie + Sylvia and resolves with market signal.

## Killed / dormant

None tracked yet. When an entry moves here, retain the one-line outcome note for audit; do not delete.

## Cross-references

- [`14_pricing_framework.md`](14_pricing_framework.md) â Path A / Path B applied to prospect-specific proposals.
- [`18_stakeholder_graph.md`](18_stakeholder_graph.md) â relationship graph that informs primary-contact assignments.
- [`73_partnerships.md`](73_partnerships.md) â formal partnership state when a customer becomes a partnership-first source.
- [`74_commercial_agreements.md`](74_commercial_agreements.md) â contracts and proposals in flight per prospect.
- [`13_risk_register.md`](13_risk_register.md) â Risk 5 (single-customer) drives the second-customer urgency.

## Revision history

- **2026-05-18 (origin):** doc seeded as part of the 70-band design session. Three active entries (Bastrop customer, Mox prospect, EdgeConneX lead/deferred); funnel-state framework specified; cross-references to 14 / 18 / 73 / 74 / 13 wired.
