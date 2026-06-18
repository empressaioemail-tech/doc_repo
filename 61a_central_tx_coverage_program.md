---
id: 61a_central_tx_coverage_program
title: Central Texas coverage program — proactive within the wedge footprint
status: active
last_updated: 2026-06-18
applies_to: hauska
owner: nick
related: [61_property_intelligence_master_plan, 75g_investor_deal_radar, 75i_investor_radar_prelaunch_sprint, 75b_brief_coverage_v0, 08_tiered_access_model, _decisions/2026-06-10_texas_coverage_demand_driven, _decisions/2026-06-17_central_tx_coverage_proactive_within_footprint, icc-contract]
---

# Central Texas coverage program

> **Purpose.** The execution board for closing jurisdiction-specific data coverage across the investor wedge's transaction footprint. Child of the engine master plan [`61`](61_property_intelligence_master_plan.md) (this is Wave 3 coverage, pulled into a named program because the investor radar's first impression depends on it). Working enumeration and gap matrix: `p:\tmp\central_tx_coverage\registry_and_gaps.md`; platform recon: `p:\tmp\central_tx_coverage\platform_recon.md`. Strategy decision: [`_decisions/2026-06-17_central_tx_coverage_proactive_within_footprint.md`](_decisions/2026-06-17_central_tx_coverage_proactive_within_footprint.md).

## Coverage status tracker (2026-06-18)

Captured vs to-do for the local code/zoning layer (the national layers fire everywhere by default; see the reframe below). Corridor deepen completed cheaply but at ~0% verified because the drivers can't verify those cities yet; ICC secrets + the UMC/UPC chapter driver are the levers that convert the corridor from atoms-present to verified.

| State | Jurisdictions | Verified | Note |
|---|---|---|---|
| Deepened, real verified rate | Austin | ~45.5% | Repaired; no-downgrade high-water-mark guard holds |
| Public-free, on Neon | Bastrop (193), Cedar Hill (206), Grand County/Moab (~285) | cited | Layer-1 public catalog |
| Deepen complete, ~0% verified | San Antonio, Round Rock, Georgetown, Hutto, Leander, New Braunfels, Dripping Springs, Killeen, Schertz, Boerne | ~0% | Atoms landed (~$23 total, 10 cities); verify-before-promote skipped unverified; **needs ICC secrets + UMC/UPC driver to lift** |
| Blocked — L3 Municode onboard | Waco, Temple, San Marcos, Seguin, Cibolo, Belton, Universal City | — | Class B; ingest before deepen |
| Blocked — General Code partnership (operator) | Kyle, Buda, Pflugerville, Cedar Park + ~9 eCode360 | — | Served by labeled websearch meanwhile |
| Blocked — ICC secrets (operator, awaiting ICC) | IFC/IPMC families, all Tier-A | — | The lever that lifts the corridor ~0% to verified |
| Everywhere else | all other US | n/a | National baseline + labeled websearch (live) |

**Map (spatial) coverage** rides Cotality national parcels now (not per-county GIS) per [`_decisions/2026-06-18_map_engine_maplibre_cotality_national.md`](_decisions/2026-06-18_map_engine_maplibre_cotality_national.md) — gated on Cotality production quota.

## The reframe

Coverage is a matrix, jurisdictions by data layer, not one number per city. The national layers (FEMA NFHL, USGS soils and geology, EPA, Cotality parcel and property, Opportunity Zones) are coverage-complete by default and are not where the gaps live. The gaps concentrate in the jurisdiction-specific layers, and each closes by a different mechanism. The code substrate itself is three layers (ADR-019): Layer 3 is local ordinance, zoning, and UDC text (what the corpus and the deployment Neon hold); Layer 1 is the model I-Codes and Layer 2 the local amendments to them (the reasoning layer, web-warmed). "We hold a city's code" usually means Layer 3 only; the building-code adoption layer is essentially un-warmed everywhere except Austin, and Austin is on the wrong edition (warmed 2021, in force 2024). That adoption layer is the largest grounded-value gap and the thing the radar's cited rehab and can-I-build reasoning depends on.

## Every Central TX parcel gets intel today (the national-layer baseline)

Coverage is not binary per jurisdiction, and the radar is never empty anywhere. Every parcel in Central Texas (and the US) already gets the full national-layer brief regardless of local-code coverage: FEMA flood plus floodway, USGS soils (expansive clay) plus geology plus karst, topography, EPA, and the Cotality stack (parcel, owner, sale/tax/AVM, comps, rent, liens, mortgage, building permits, propensity-to-sell, owner-occupancy, perils and insurance), plus Opportunity Zones and MUD/PID special districts. That is the bulk of an investor verdict and it fires on every parcel today, warmed jurisdiction or not. The jurisdiction-specific code/zoning/precedence layer is incremental depth on top of that baseline, not a gate on whether the radar is useful. And where there is no zoning (unincorporated land, no-zoning towns), "no zoning restrictions" is itself a positive build-freedom signal to surface, not an absence to apologize for. So the coverage program closes the local-code layer; it never decides whether a parcel is worth a verdict.

## Current coverage (from the engine snapshot)

Per the 2026-05-26 engine snapshot re-confirmed live 2026-06-09 (21,126 atoms): roughly 24 Central Texas jurisdictions hold Layer-3 local code (8 on the deployment Neon, ~16 engine-only). Only Austin is reasoning-warmed (725 atoms, 0% verified against section bodies, the driver-quality gap). Portfolio-wide only two jurisdictions are public-free (Bastrop TX, Grand County UT); the rest are platform-internal. Any external-facing figure must carry the public-versus-internal split.

## Strategy: proactive within the footprint, demand-driven tail

Amends the 2026-06-10 demand-driven decision (premises changed: the wedge footprint is now defined, warming is reliable once the driver-quality fix lands, and ICC has landed). For a deal radar, a coverage gap inside the market is a broken first impression, and in tight investor communities a broken first impression does not come back. So:

- **Tier A, proactive warm.** Every incorporated city with zoning and real deal volume across the ten core counties (Travis, Williamson, Hays, Bastrop, Caldwell, Comal, Guadalupe, Bexar, Bell, McLennan), practically the metro core plus the corridor plus the San Antonio suburbs plus Waco metro plus Killeen and Temple. On the order of 40 to 50 jurisdictions. Pre-warmed so the radar is never empty in the wedge's footprint.
- **Tier B, demand-driven.** The sub-5,000 and no-zoning small-town tail and the rural ring. Warmed on first user hit. The 2026-06-10 logic still holds here.
- **Not a per-jurisdiction code warm (but still on the baseline).** County zoning is N-A-by-law (Texas counties cannot zone) and many small towns have none, but those parcels still get the full national-layer brief above, and "no zoning" is itself a build-freedom signal to surface. Permit/AHJ is a connector build; HOA is a parcel-level lookup.

## Platform recon (2026-06-17)

Resolved all 27 Tier-A cities the enumeration left platform-unverified to a citable code-of-ordinances URL; all have zoning. Result: **18 are Municode-warmable now** (no partnership), including the headline pull-forwards Waco (145k, the largest unwarmed metro) and Temple (81k, has a UDC), plus Seguin, Cibolo, Belton, Universal City. **13 are eCode360/General Code partnership-gated** (the four known corridor cities Pflugerville/Kyle/Buda/Smithville plus net-new Lakeway, Bee Cave, Cedar Park, Liberty Hill, Bulverde, Granite Shoals, Giddings, Cameron, Rockdale), which turns the General Code ask from soft into a quantified 13-city unblock. Zero self-hosted, zero still-unverified in Tier A. (Correction to prior records: Cedar Park is eCode360, not American Legal.) Full table: `p:\tmp\central_tx_coverage\platform_recon.md`.

## Live coverage state (2026-06-17) and the two work classes

A live read of `/api/brokerage/v1/coverage` (the endpoint the extension's Test connection hits) reports **37 jurisdictions, but only 5 are warmed onto the deployment Neon** (Bastrop TX, Cedar Hill TX, Grand County/Moab UT, Miami Beach FL, Miami-Dade FL). The other **32 are `engine_only`** — present in the engine corpus and recognized by the geocoder, but not loaded into the live Neon, so local-code retrieval returns empty until warmed. Everything else in the footprint is missing entirely. That splits the work into two classes:

**Class A — flip `engine_only` to `neon` (cheap, no re-fetch).** Load atoms we already hold into the live Neon. Covers the ~32 (Austin, San Antonio, Round Rock, Georgetown, Hutto, Leander, New Braunfels, Killeen, Schertz, Boerne, Dripping Springs, Lockhart, Manor, Lago Vista, Rollingwood, Wimberley, Elgin, Taylor, Converse, Live Oak, Copperas Cove, plus non-Central-TX snapshot keys). Closes the "covered but thin" feeling fast.

**Class B — onboard net-new deal-volume cities not in the corpus at all (the wide gap).** Split by platform:
- *Municode, onboard now (no partnership):* Waco (145k), Temple (81k), San Marcos (74k, config-ready, live customer), Seguin (30k), Cibolo (35k), Belton (23k), Universal City (20k). The highest-leverage adds.
- *eCode360 / General Code, partnership-gated:* Kyle, Buda, Pflugerville, Cedar Park (+9), gated on the General Code partnership below, not engineering.

**Denominator correction.** The full Waco-to-San-Antonio corridor has ~120 incorporated places, but over half are sub-2,000 no-zoning towns (Mart, Moody, Coupland, Thrall, Von Ormy, and dozens more) that are correctly Tier-B demand-driven, and Texas counties cannot zone (N-A-by-law). So "covering 18% of 120" is the wrong metric; the target is the ~40-50 deal-volume Tier-A cities, and the live gap there is the Class-B Municode onboards plus the General Code unblock.

## The keystone and the workflow

The single highest-leverage item is the **driver-quality fix** (UpCodes section-HTML extraction), so warmed building-code atoms verify against real section bodies. **Status (2026-06-17 routing recon): substantially done.** cc-agent-C shipped it 2026-06-10 in legacy-design-tools (PR #163 section-HTML extraction, PR #164 Austin 2024 uplift); Austin moved 0% to ~35% web-verified on the in-force 2024 package at ~$2.55. The full 552-atom flip is not met; deepeners (UMC/UPC chapter-page, ICC-only IFC, TAS deeplink) are queued in the existing `2026-06-10_cc-agent-C_austin_verified_rate_deepeners` dispatch. **The cold-warm harness lives in legacy-design-tools (`lib/codewarm`, `lib/codes/src/webCodeFetch`), not hauska-engine, so all warm work is owned by cc-agent-C** (routing corrected 2026-06-17; the seam seal that gated it is already done).

Going wide is tractable only if the per-jurisdiction human review is batchable. Compute is trivial (one to two dollars each); the real constraint is the one-hour review times forty-plus. So the program builds a **batched edition-verification workflow** that checks the adopted I-Code edition and local amendments systematically against ICC and the SECO statewide floors, instead of forty separate deep reviews. Each jurisdiction still stays inside the under-$200-plus-one-hour commitment (commitment #3); the batched workflow is what keeps the cumulative review labor inside reach.

## The proof wave and the fan-out

Dependency-ordered, no time estimates. The proof wave validates the keystone and the workflow on jurisdictions we already hold or have config-ready, then Tier A fans out by county.

1. Driver-quality fix and deepeners (cc-agent-C, legacy-design-tools; ~35% web-verified already shipped via #163/#164, deepeners queued).
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
- **2026-06-17 (update):** Added the national-layer baseline reframe (every parcel gets intel regardless of code coverage; the code layer is incremental, never a gate; "no zoning" is itself a signal), the live coverage-state read (37 reported / 5 neon / 32 engine_only) and the two work classes (Class A flip engine_only->neon; Class B onboard net-new Municode cities Waco/Temple/San Marcos/Seguin/Cibolo/Belton/Universal City), and the denominator correction (target ~40-50 deal-volume Tier-A cities, not the ~120 incorporated places). Dispatch: `_dispatches/2026-06-17_cc-agent-C_central_tx_coverage_warm_and_onboard.md`.
