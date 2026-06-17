---
id: 61a_central_tx_coverage_program
title: Central Texas coverage program — proactive within the wedge footprint
status: active
last_updated: 2026-06-17
applies_to: hauska
owner: nick
related: [61_property_intelligence_master_plan, 75g_investor_deal_radar, 75i_investor_radar_prelaunch_sprint, 75b_brief_coverage_v0, 08_tiered_access_model, _decisions/2026-06-10_texas_coverage_demand_driven, _decisions/2026-06-17_central_tx_coverage_proactive_within_footprint, icc-contract]
---

# Central Texas coverage program

> **Purpose.** The execution board for closing jurisdiction-specific data coverage across the investor wedge's transaction footprint. Child of the engine master plan [`61`](61_property_intelligence_master_plan.md) (this is Wave 3 coverage, pulled into a named program because the investor radar's first impression depends on it). Working enumeration and gap matrix: `p:\tmp\central_tx_coverage\registry_and_gaps.md`; platform recon: `p:\tmp\central_tx_coverage\platform_recon.md`. Strategy decision: [`_decisions/2026-06-17_central_tx_coverage_proactive_within_footprint.md`](_decisions/2026-06-17_central_tx_coverage_proactive_within_footprint.md).

## The reframe

Coverage is a matrix, jurisdictions by data layer, not one number per city. The national layers (FEMA NFHL, USGS soils and geology, EPA, Cotality parcel and property, Opportunity Zones) are coverage-complete by default and are not where the gaps live. The gaps concentrate in the jurisdiction-specific layers, and each closes by a different mechanism. The code substrate itself is three layers (ADR-019): Layer 3 is local ordinance, zoning, and UDC text (what the corpus and the deployment Neon hold); Layer 1 is the model I-Codes and Layer 2 the local amendments to them (the reasoning layer, web-warmed). "We hold a city's code" usually means Layer 3 only; the building-code adoption layer is essentially un-warmed everywhere except Austin, and Austin is on the wrong edition (warmed 2021, in force 2024). That adoption layer is the largest grounded-value gap and the thing the radar's cited rehab and can-I-build reasoning depends on.

## Current coverage (from the engine snapshot)

Per the 2026-05-26 engine snapshot re-confirmed live 2026-06-09 (21,126 atoms): roughly 24 Central Texas jurisdictions hold Layer-3 local code (8 on the deployment Neon, ~16 engine-only). Only Austin is reasoning-warmed (725 atoms, 0% verified against section bodies, the driver-quality gap). Portfolio-wide only two jurisdictions are public-free (Bastrop TX, Grand County UT); the rest are platform-internal. Any external-facing figure must carry the public-versus-internal split.

## Strategy: proactive within the footprint, demand-driven tail

Amends the 2026-06-10 demand-driven decision (premises changed: the wedge footprint is now defined, warming is reliable once the driver-quality fix lands, and ICC has landed). For a deal radar, a coverage gap inside the market is a broken first impression, and in tight investor communities a broken first impression does not come back. So:

- **Tier A, proactive warm.** Every incorporated city with zoning and real deal volume across the ten core counties (Travis, Williamson, Hays, Bastrop, Caldwell, Comal, Guadalupe, Bexar, Bell, McLennan), practically the metro core plus the corridor plus the San Antonio suburbs plus Waco metro plus Killeen and Temple. On the order of 40 to 50 jurisdictions. Pre-warmed so the radar is never empty in the wedge's footprint.
- **Tier B, demand-driven.** The sub-5,000 and no-zoning small-town tail and the rural ring. Warmed on first user hit. The 2026-06-10 logic still holds here.
- **Not coverage.** County zoning is N-A-by-law (Texas counties cannot zone); permit and AHJ is a connector build; HOA is a parcel-level lookup. None is a per-jurisdiction warm.

## Platform recon (2026-06-17)

Resolved all 27 Tier-A cities the enumeration left platform-unverified to a citable code-of-ordinances URL; all have zoning. Result: **18 are Municode-warmable now** (no partnership), including the headline pull-forwards Waco (145k, the largest unwarmed metro) and Temple (81k, has a UDC), plus Seguin, Cibolo, Belton, Universal City. **13 are eCode360/General Code partnership-gated** (the four known corridor cities Pflugerville/Kyle/Buda/Smithville plus net-new Lakeway, Bee Cave, Cedar Park, Liberty Hill, Bulverde, Granite Shoals, Giddings, Cameron, Rockdale), which turns the General Code ask from soft into a quantified 13-city unblock. Zero self-hosted, zero still-unverified in Tier A. (Correction to prior records: Cedar Park is eCode360, not American Legal.) Full table: `p:\tmp\central_tx_coverage\platform_recon.md`.

## The keystone and the workflow

The single highest-leverage item is the **driver-quality fix** (UpCodes section-HTML extraction), so warmed building-code atoms verify against real section bodies. It is the prerequisite for trustworthy building-code reasoning anywhere, it is launch-gating for Austin, and it gates the radar's marquee reasoning quality. It is dispatch one of the program.

Going wide is tractable only if the per-jurisdiction human review is batchable. Compute is trivial (one to two dollars each); the real constraint is the one-hour review times forty-plus. So the program builds a **batched edition-verification workflow** that checks the adopted I-Code edition and local amendments systematically against ICC and the SECO statewide floors, instead of forty separate deep reviews. Each jurisdiction still stays inside the under-$200-plus-one-hour commitment (commitment #3); the batched workflow is what keeps the cumulative review labor inside reach.

## The proof wave and the fan-out

Dependency-ordered, no time estimates. The proof wave validates the keystone and the workflow on jurisdictions we already hold or have config-ready, then Tier A fans out by county.

1. Driver-quality fix (cc-agent-E; sequenced after the radar seam seal).
2. Austin 2024 edition uplift (correct the flagship edition drift).
3. San Marcos warm (live customer, config-ready, the first net-new on-demand proof).
4. San Antonio reasoning-warm plus Neon warmup (largest metro already held in engine Layer 3, adoption verified).
5. Williamson corridor adoption-warm (Round Rock, Georgetown, Hutto, Leander, already on Neon).
6. Tier A county batches on the batched-verification workflow.

## The three horizontals (not per-jurisdiction)

- **MUD/PID special districts.** A single TX Comptroller special-district registry ingest closes it broadly; it also feeds the radar's "what kills it" set (a Texas cash-flow killer). Build now; folded into the cc-agent-C radar dispatch since C already verifies MUD/PID there.
- **Permit / AHJ.** A per-AHJ connector build (Accela, MyGov, MyPermitNow, CSS). Stays the post-C4 connector line.
- **HOA / CCR.** Recorded at county-clerk level, often not digitized, parcel-specific. Explicit best-effort per-parcel lookup, never jurisdiction-complete, and stated as such to users.

## Partnerships and external

- **General Code partnership** unblocks the eCode360 cluster, now quantified at **13 Central-TX cities** (Pflugerville, Kyle, Buda, Smithville, Lakeway, Bee Cave, Cedar Park, Liberty Hill, Bulverde, Granite Shoals, Giddings, Cameron, Rockdale). Routes to bizops [`73`](73_partnerships.md); operator action.
- **American Legal** blocks Harker Heights; partnership track.
- **ICC** (contract landed ~2026-06-17) unblocks the credential-gated I-Code layer (licensed I-Code display, IFC/IPMC), strengthening every adoption warm. Distinct from the General Code / eCode360 block.

## Cross-references

- [`61`](61_property_intelligence_master_plan.md) — parent engine plan; this is Wave 3 coverage as a named program
- [`_decisions/2026-06-10_texas_coverage_demand_driven.md`](_decisions/2026-06-10_texas_coverage_demand_driven.md) — the prior posture this amends
- [`_decisions/2026-06-17_central_tx_coverage_proactive_within_footprint.md`](_decisions/2026-06-17_central_tx_coverage_proactive_within_footprint.md) — the amending decision
- [`75i`](75i_investor_radar_prelaunch_sprint.md) — the radar sprint whose reasoning quality this coverage gates

## Revision history

- **2026-06-17 (origin):** Created from the Central TX enumeration and gap analysis. Proactive-within-footprint strategy, the driver-quality keystone, the batched edition-verification workflow, the proof wave, the three horizontals, and partnership routing.
