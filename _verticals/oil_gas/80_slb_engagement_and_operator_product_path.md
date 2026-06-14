---
id: 80_slb_engagement_and_operator_product_path
title: SLB engagement, the slb_prototype asset, and the two-track path to our O&G product
status: exploration
last_updated: 2026-06-14
applies_to: [hauska, empressa]
owner: nick
related: [00_oil_gas_index, 20_tech_to_og_map, 40_chris_app_overlay, 50_complete_product_plan, 60_data_package_and_providers, 70_market_thesis, 53a_noncustodial_settlement_rail, 30_smartcity_os, _prospects/mox/2026-06-13_mox_demo_build_plan]
---

# SLB engagement, the asset, and the path to our own O&G product

> **Status: exploration.** Captures where the O&G vertical actually stands after the 2026-06-14 session: SLB is a customer, we built and shipped a working backend, and that backend is the first owned piece of our own O&G offering. Two tracks now exist on one substrate. The operator-product track stays gated on a real operator design partner; do not fire build cycles on it before that.

## What happened

Chris (product designer) is building a surveillance-to-intervention field-health app, Permian Field Health, and the customer is SLB. We were positioned to win the backend. This session we built it: `slb_prototype`, an AI-native backend that turns well and surveillance data into an atom graph and computes the intelligence layer (bounded health index, decline-curve anomaly detection, root-cause attribution, intervention recommendations with provenance and confidence, downtime exposure in barrels and dollars, a conversational ask, and the seven bounded operational layers, well-log correlation, and directional surfaces matched to Chris's UI). It runs in mock mode with no keys and goes live with a Grok or Anthropic key. Verified in both modes; committed on branch `feat/ai-native-backend`; sent to Chris with agent-bootstrap instructions in its `CLAUDE.md` so his Claude Code installs, runs, and wires it unattended.

The repo lives at `P:\slb_prototype` (separate GitHub repo, Nick-owned). It is our IP; Chris's frontend and SLB's data are theirs.

## The corrected positioning

An earlier draft of [`40`](40_chris_app_overlay.md) framed an operator-owned, cross-vendor twin that SLB "structurally cannot occupy," with a conflict-of-interest wedge against SLB. With SLB as the customer, that inverts and is retired. We are SLB's backend vendor for this surface. We win on speed, on the provenance-and-calibrated-certainty discipline that turns measurement into a defensible decision, and on a proven substrate, not by out-platforming SLB's Digital division. The honest read is that as SLB's backend we are closer to a services-and-software position than a moat; the moat is the other track.

## Two tracks, one substrate, non-conflicting

| Track | Customer | Our position | What it gives us |
|---|---|---|---|
| 1. SLB backend | SLB (serves supermajors and NOCs) | Vendor and services under Chris's frontend | Funded entry, a marquee logo, domain learning, a working O&G demo, and the IP we own |
| 2. Our O&G product | The underserved SMB operator and dealmaker long tail | Operator-owned revenue-twin platform, our brand (Empressa) | The moat: the loop in [`50`](50_complete_product_plan.md) on our own substrate |

They do not collide because the segments are opposite ends of the market. SLB and the enterprise stack (Quorum, IFS, Enverus) serve majors and large independents; our product targets the ~9,000-operator long tail those tools price out (the thesis in [`70`](70_market_thesis.md)). Same substrate, different customers, little direct conflict. Keep them distinct: do not pitch SLB on an operator-neutral posture, and do not let the SLB relationship shape the operator product.

## How the SLB work feeds our offering

The `slb_prototype` is not just Chris's demo. It is the operations lens of our own revenue-twin product, already built and owned: the well-twin atom model, the scoring engine, the intelligence layer, and the surfaces are reusable IP. It also gives us a working O&G demo to show any operator or partner, real domain learning, and SLB-funded runway. Our product is that same substrate with the other two lenses added (land-and-obligations, capital) and pointed at a real operator instead of SLB.

## The path to start the operator product (dependency order, no timelines)

1. Generalize the `slb_prototype` substrate from a single seeded demo into a reusable O&G core with pluggable data adapters, so it takes a real operator's data rather than the planted scenario.
2. Build the land-and-obligations lens on that core (lease, obligation, and payment atoms plus the never-miss-a-payment surface). This is the wedge that acquires the operator's book onto the twin.
3. Wire the public-records spine for real ground truth (RRC production and permits, county records) per [`60`](60_data_package_and_providers.md).
4. Land one SMB operator as a design partner, the first real operator on the platform. This is the gating dependency; the product has no ground truth and no pull without it.
5. Add the capital lens and finish the non-custodial settlement rail ([`53a`](53a_noncustodial_settlement_rail.md)) behind the land entry.
6. Before it hardens: catalog-thesis-check for the Empressa brand placement and premortem-check against the structural commitments.

## Discipline and current posture

This is a net-new product workstream and competes for fleet cycles with Mox, Cortex, SmartCity, and the spine roadmap; the focus-queue rule applies. The mitigant is that it rides the shared substrate (spine, twin pattern, data rooms, SDK) we are building anyway, so the marginal build is the O&G lenses and adapters. But the land lens and the operator pilot are genuine incremental work that has to earn its slot.

**Operator decision (2026-06-14): let the SLB track run its course for now.** The operator-product track is captured here but not dispatched. The first real move is not building, it is naming the first SMB operator design partner (the equivalent of Bastrop for SmartCity, Mox for multifamily). Until that exists, track two stays a funded-by-SLB exploration.

## Open

- The first SMB operator design partner: who, and is one in reach.
- Whether the cross-domain four-layer thesis (spine, twin, connect, monetize) graduates to its own portfolio-level canonical doc, peer to [`09`](../../09_post_saas_substrate_thesis.md). Flagged for a future session.
- The SLB engagement's own open items (internal tool vs operator-facing product; which part of SLB; durability) in [`40`](40_chris_app_overlay.md).
