---
id: 74_commercial_agreements
title: Commercial agreements â contracts, proposals, templates
status: active
last_updated: 2026-05-26
applies_to: portfolio
related: [14_pricing_framework, 18_stakeholder_graph, 30_smartcity_os, 70_bizops_overview, 71_pipeline, 73_partnerships]
owner: nick
---

# Commercial agreements

> **Operational tracker.** Active contracts, proposals in flight, and templates (NDA / revenue-share / MSA). Strategic pricing-framework decisions live at [`14_pricing_framework.md`](14_pricing_framework.md); this doc tracks the specific commercial instances and the templates that scale them.

## Active proposals

### Sylvia $1M proposal (Bastrop)

- **Counterparty.** Bastrop / Sylvia Carrillo (per [`18_stakeholder_graph.md`](18_stakeholder_graph.md)).
- **Origin.** 2026-05-05 inbound email from Sylvia signaling sticker shock on a $1M proposal.
- **Path.** Path A applied per [`14_pricing_framework.md`](14_pricing_framework.md) "Application â Sylvia $1M proposal" section. Phase the work; Y1 anchored on what's load-bearing for Bastrop with Y2-Y3 expansion via change orders. Walk Sylvia through line items in a working session.
- **Status.** Response in flight (per CLAUDE.md "What is open"-adjacent state). Working session pending.
- **Cross-references.** [`14_pricing_framework.md`](14_pricing_framework.md), [`30_smartcity_os.md`](30_smartcity_os.md), [`73_partnerships.md`](73_partnerships.md) (Bastrop pioneering-city partnership).

## Active contracts

None signed and tracked at the band level today. When a contract is signed, log here with counterparty, scope, term, revenue terms, and pointer to canonical product doc.

## Templates

Templates are TBD. The shape they need to take is informed by 14_pricing_framework v1 canonical (Layer 1 free; Layer 2 per-call default; optional stream subscription; reasoning-call as unifying frame) plus the partnership-first sourcing pattern from [`73_partnerships.md`](73_partnerships.md).

| Template | Status | Trigger to author |
|---|---|---|
| **NDA** | TBD | First counterparty conversation requiring confidentiality before scoping. None pending today. |
| **Master services agreement (MSA)** | TBD | First contract beyond Bastrop. Currently no second contract in flight. |
| **Revenue-share template** | TBD | Bastrop revenue-share contract operational pilot (per [`14_pricing_framework.md`](14_pricing_framework.md) substrate-state subsection). The pilot informs the template before the template is generalized. |
| **Layer 2 paid agent-consumption agreement** | TBD | First paid Layer 2 call. Likely thin (substrate side does the metering and routing per the SDK payment substrate); legal posture per [`72_hauska_inc_operations.md`](72_hauska_inc_operations.md) regulatory items. |
| **Empressa wedge ToS + Privacy Policy** | TBD | Before external extension users (day 30 target). [`76_empressa_wedge_90d_operating_plan.md`](76_empressa_wedge_90d_operating_plan.md) legal track. |
| **Brokerage pilot agreement** | TBD | Before first paid pilot invoice (day 45–60). Flat fee maps to Team tier per [`_decisions/2026-05-26_empressa_wedge_operating_commitments.md`](_decisions/2026-05-26_empressa_wedge_operating_commitments.md). |
| **Extension subscription terms** | TBD | Stripe live (day 60 target). Auto-renew, acceptable use, refund policy. |
| **Share card + graph consent exhibit** | TBD | Before public share URLs (day 46+). Graph opt-in copy reviewed by counsel. |
| **Institutional data product term sheet** | TBD | Design-partner meetings (day 76–90). Anonymized activity feed; k-anonymity posture. |

## Pricing application reference

The framework lives at [`14_pricing_framework.md`](14_pricing_framework.md). For commercial instances tracked here, the relevant calls (settled 2026-05-18):

- **Take rate range (v1):** 1.5 to 2.5 percent depending on transaction type. Exact number sets at first paid Layer 2 call.
- **Pricing model (v1 canonical):** Layer 1 free; Layer 2 per-call default with optional stream subscription; composition royalty deferred; reasoning-call as unifying frame; marketplace dynamics future.
- **v1 fiat rail:** Stripe Connect.
- **v1 crypto rail:** USDC on Base / Ethereum / Polygon (already built in `@hauska-sdk/payment` v0.1.0).
- **Path A vs Path B per customer segment:** municipal accounts default Path A (tighten scope, keep pricing familiar; change orders for expansion); enterprise / well-funded default Path B (price at honest scope-calibrated ranges).

## Killed / dormant

None tracked yet.

## Cross-references

- [`14_pricing_framework.md`](14_pricing_framework.md) â the framework these instances apply.
- [`71_pipeline.md`](71_pipeline.md) â prospects upstream of proposals; status flow.
- [`73_partnerships.md`](73_partnerships.md) â partnership terms that the revenue-share template operationalizes.
- [`72_hauska_inc_operations.md`](72_hauska_inc_operations.md) â regulatory posture gating paid Layer 2 surfaces.
- [`30_smartcity_os.md`](30_smartcity_os.md) â Bastrop customer context.

## Revision history

- **2026-05-26:** Empressa wedge template rows (ToS, pilot agreement, subscription, share consent, institutional term sheet).
- **2026-05-18 (origin):** doc seeded as part of the 70-band design session. Sylvia $1M proposal tracked as the one active commercial instance; templates section laid out with triggers to author; pricing-application reference inlined from [`14`](14_pricing_framework.md) close-the-loop pass landed same session.
