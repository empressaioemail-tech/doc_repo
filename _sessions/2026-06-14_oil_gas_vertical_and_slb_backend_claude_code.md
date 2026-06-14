---
id: 2026-06-14_oil_gas_vertical_and_slb_backend
title: Oil and gas vertical opened; SLB backend built and shipped
status: complete
last_updated: 2026-06-14
applies_to: [hauska, empressa]
owner: nick
related: [_verticals/oil_gas/00_oil_gas_index, _verticals/oil_gas/80_slb_engagement_and_operator_product_path, 53a_noncustodial_settlement_rail, 30_smartcity_os, 05_living_lineage_thesis, _prospects/mox/2026-06-13_mox_demo_build_plan]
---

# Session: oil and gas vertical opened; SLB backend built and shipped

## What happened

Opened the oil and gas vertical and, by the end of the session, built and shipped a working backend for it. The arc: a question about what to do with the dormant Western Midstream / O&G material became a market-discovery pass, which surfaced a drastically underserved segment (the small-and-mid operator and dealmaker long tail), which then crystallized into a product thesis and a real build for a live opportunity.

The live opportunity is Chris's app, Permian Field Health, a surveillance-to-intervention field-health surface whose customer is SLB. We were positioned to win the backend and did: we built `slb_prototype` (separate GitHub repo, Nick-owned) and sent it to Chris.

## The thesis that emerged

The product is one thing across all domains: a revenue-producing asset turned into a verified digital twin, the inverted kind where the asset owns its data and geometry is one optional lens (Living Lineage / Inverted Pyramid). It stands on four layers, spine, twin, connect operational systems, monetize, and is read through three lenses, operations/surveillance, land/obligations, capital. The well produces revenue directly, so operations is a revenue lens and revenue is the through-line that fuses the three lenses into one product. This is the same four-layer offering as Mox (building twin, revenue is rent) and SmartCity (city twin, the connect-and-unify pattern proven live in production). O&G is the same product with the asset swapped.

The wedge debate resolved: there is no single feature wedge, the product is the integration, and the entry is whichever lens the specific customer is already walking through.

## Decisions and corrections

- SLB is the customer, not an incumbent we route around. An earlier draft framed an operator-owned, conflict-of-interest wedge against SLB; that inverted the moment SLB was confirmed as the customer and was retired from [`40`](_verticals/oil_gas/40_chris_app_overlay.md).
- Two tracks on one substrate, non-conflicting because of the segment split: SLB as a funded vendor/services entry (serves majors and NOCs) and our own operator-owned revenue-twin product for the SMB long tail (the moat). [`80`](_verticals/oil_gas/80_slb_engagement_and_operator_product_path.md).
- The custodial wallet in the Hauska SDK must be removed regardless of O&G; the capital lens needs a non-custodial, verify-only, bank-to-bank settlement rail (we take a technology fee, never custody). Spec filed: [`53a`](53a_noncustodial_settlement_rail.md).
- Let the SLB track run its course for now. The operator-product track is captured but not dispatched; its gating dependency is a real SMB operator design partner, not more building.

## Artifacts produced

Oil and gas folder ([`_verticals/oil_gas/`](_verticals/oil_gas/00_oil_gas_index.md)): 00 index, 10 prior-visions digest (non-verbatim, historical), 20 tech-to-O&G map, 30 brainstorm, 40 the Chris slice (corrected this session), 50 complete product plan (revenue-twin organizing model), 60 data package and providers (cited research), 70 market thesis (cited research), 80 SLB engagement and operator-product path (new).

Main band: [`53a_noncustodial_settlement_rail.md`](53a_noncustodial_settlement_rail.md), grounded against the live SDK code.

External repo (not in doc_repo): `slb_prototype` at `P:\slb_prototype`. AI-native backend, atom graph plus computed intelligence (bounded health index, decline-curve anomaly detection, root-cause attribution, intervention recommendations with provenance and confidence, BOE-and-dollar downtime exposure, conversational ask), with the seven bounded operational layers, well-log correlation, and directional surfaces matched to Chris's UI. Mock-mode fallback so it runs keyless; live with a Grok or Anthropic key. Verified in both modes; committed on branch `feat/ai-native-backend`; agent-bootstrap instructions in its `CLAUDE.md` so Chris's Claude Code installs, runs, and wires it unattended. Bug caught and fixed during live testing (conversational retrieval scoping).

## Open and next

- Name the first SMB operator design partner; the operator-product build is gated on it.
- Graduate the cross-domain four-layer thesis to its own portfolio-level canonical doc, peer to [`09`](09_post_saas_substrate_thesis.md).
- Run catalog-thesis-check (Empressa brand placement) and premortem-check before the operator product hardens.
- SLB engagement open items: internal tool vs operator-facing product, which part of SLB, durability ([`40`](_verticals/oil_gas/40_chris_app_overlay.md)).
