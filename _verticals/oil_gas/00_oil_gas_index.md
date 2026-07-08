---
id: 00_oil_gas_index
title: Oil and gas vertical - working index and orientation
status: exploration
last_updated: 2026-07-07
applies_to: [hauska, empressa]
owner: nick
related: [55_spine_data_intelligence_stack, 53_hauska_sdk_completion_sprint, 09_post_saas_substrate_thesis, 28_mcp_first_product_design, 80_adrs/adr_008_engine_factor_out, _prospects/mox/2026-06-11_mox_master_dossier]
---

# Oil and gas vertical, working index

> **Status: exploration, not canon.** Nothing in this folder is a settled decision, a committed workstream, or current product state. It is a working space for organizing oil and gas thinking and mapping it to the Hauska spine. Other agents: do not cite anything here as portfolio truth. Material graduates to a numbered canonical band only after it survives ratification, premortem-check, and catalog-thesis-check.

## Why this folder exists

Chris (product designer) is building a surveillance-to-intervention field-health app, Permian Field Health, and the customer is SLB. We were positioned to win the backend, and as of 2026-06-14 we built and shipped it: the `slb_prototype` repo, an AI-native backend on our atom substrate (the full story in [`80_slb_engagement_and_operator_product_path.md`](80_slb_engagement_and_operator_product_path.md)). That backend is the first owned piece of our own oil and gas offering.

The folder began as the place to organize prior oil and gas thinking and map our tech to the industry so we could win Chris's backend. It now also holds the two-track strategy that came out of that: SLB as a funded customer for the operations lens, and our own operator-owned revenue-twin product for the underserved SMB segment as the separate, gated moat track. Still exploration, not canon.

## The organizing model: the revenue-producing well twin

The product is one thing: a revenue-producing asset (the well or pad) turned into a verified digital twin. The twin is the inverted kind, the asset owns its data and the geometry is an optional lens, per Living Lineage and the Inverted Pyramid. It stands on four layers, shared across Mox and SmartCity, and is read through three lenses. Full detail in [`50_complete_product_plan.md`](50_complete_product_plan.md).

Four layers: the spine (shared ground truth), the well twin (tenant-private), connect operational systems (ride on top of SCADA, historian, Quorum, Enverus; no rip and replace), and monetize (the verified twin becomes transactable).

Three lenses on the same twin: operations and surveillance (Permian Field Health, the Chris app), land and obligations (the payments that protect the revenue), and capital (who owns the revenue stream). The well produces revenue directly, so operations is a revenue lens and revenue is the through-line that makes this one product, not three.

This is the cross-domain thesis instantiated, the same four-layer offering as Mox (building twin, revenue is rent) and SmartCity (city twin, the connect pattern proven live). The cross-domain thesis deserves its own portfolio-level canonical doc (peer to [`09`](../../09_post_saas_substrate_thesis.md)); flagged for a future session. The backend under Chris's surface is layers 1 through 3; his app is the operations lens, now built.

## What is in this folder

- `00_oil_gas_index.md` (this file): orientation and status.
- `10_prior_visions_digest.md`: the essence of every prior oil and gas vision, in synthesized form, with pointers to where the original documents live. Explicitly historical.
- `20_tech_to_og_map.md`: every piece of our current tech mapped to what an oil and gas product needs. The backend pitch in raw form.
- `30_brainstorm.md`: open space for the live brainstorm of the full possibility set.
- `40_chris_app_overlay.md`: the surveillance-to-intervention slice Chris needs for Permian Field Health (the operations lens), with the own-versus-reuse split and the certainty-layer pitch.
- `50_complete_product_plan.md`: the whole platform end to end, by capability domain, holistic and deliberately unphased.
- `60_data_package_and_providers.md`: the complete external data package and provider landscape (Enverus and alternatives, public records).
- `70_market_thesis.md`: supporting market research and the thesis for the underserved small and mid operator segment.
- `80_slb_engagement_and_operator_product_path.md`: SLB is the customer; the `slb_prototype` backend we built and shipped; the two-track strategy (SLB vendor entry vs our own operator product); and the dependency-ordered path to the operator product, gated on a design partner.
- `85_landman_data_model_review.md` / `85a_herbert_review_answers.md`: the landman review of the data model and Herbert's answers (2026-07-06) that drove ADR-025's revenue-allocation-unit ruling.
- `85b_title_artifact_exemplars.md`: Herbert's professional title artifacts (DOTO, working-interest report, county index runsheet; PDFs in `assets/title_exemplars/`) — the ground-truth formats the C7 title slice is graded against, plus a flagged Winkler-based option for the graded-truth leg.
- `86_executive_summary.md`: executive summary of the vertical.

Substrate work this vertical surfaced, filed in the main band because it is not oil-and-gas-specific:

- `53a_noncustodial_settlement_rail.md`: remove the custodial facilitator wallet from the SDK, move to a verify-only party-to-party rail. Required regardless of oil and gas; urgent for it because the capital transactions are large, bank-to-bank, and not crypto.

## Decision-rule posture

This sits inside the Hauska spine rule as a vertical expression of the existing substrate, not a new company. It stays planning altitude until it becomes a build commitment, at which point it must name what gets queued or killed (focus-queue rule), and run premortem-check and catalog-thesis-check formally before anything hardens.

## Open flags carried into the work

1. "Empressa Land" and "Empressa Marketplace" are working names inherited from the prior documents. They predate current product canon. Treat as labels pending a catalog-thesis-check, not committed surface names.
2. Western Midstream is a midstream operator (gathering, processing, pipelines, produced water). Its relevant surface is land administration plus right-of-way, easement, and produced-water permitting. The asset marketplace is an upstream motion (minerals, working interests) aimed at different buyers. Do not conflate the two when mapping Chris's design.
3. The marketplace vision carries a blockchain settlement and tokenization assumption from its 2025 origin. Our current payment substrate is real (USDC plus Circle fiat via the Hauska SDK), so part of that assumption is now buildable. Verify exactly what is wired versus planned before showing settlement claims externally.
4. SLB is the customer for the Chris app, not an incumbent we route around. Any operator-owned, anti-SLB, cross-vendor-neutral framing belongs only to the separate operator-product track ([`80`](80_slb_engagement_and_operator_product_path.md)), never to the SLB engagement. The `slb_prototype` code is our IP; Chris's frontend and SLB's data are theirs.
