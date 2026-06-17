---
id: 75g_investor_deal_radar
title: Investor Deal Radar — the property-intel extension as an investor co-pilot
status: active
last_updated: 2026-06-16
applies_to: portfolio
owner: nick
related: [75a_hauska_brief_extension, 75b_brief_coverage_v0, 61_property_intelligence_master_plan, 08_tiered_access_model, 28_mcp_first_product_design, 09_post_saas_substrate_thesis, 18_stakeholder_graph, _research/2026-06-06_cotality_api_surface_catalog, _decisions/2026-06-16_investor_first_actor, _decisions/2026-06-16_cotality_consumer_display_license_gate]
---

# Investor Deal Radar

> **Supersedes the framing in [`75a_hauska_brief_extension.md`](75a_hauska_brief_extension.md)** (which remains the API-contract reference, marked superseded on product framing). 75a described a generic consumer property-brief extension. This doc reframes the same codebase and backend toward a single sharp first actor: the real estate investor.
>
> **Approved mockups:** `p:\tmp\extension-proposal\` (deal radar panel, profile workspace, identity + leads). Build plan of record: the approved plan at `C:\Users\cente\.claude\plans\joyful-conjuring-wozniak.md`.
>
> **Build spec + scope cuts (2026-06-17):** [`75i_investor_radar_prelaunch_sprint.md`](75i_investor_radar_prelaunch_sprint.md) governs the build. The inverted lead feed is **CUT** (Cotality permits/propensity/owner-occupancy become underwriting depth on the viewed property); provider is **frozen to Cotality** until the contracted surface is consumed; tiers are **Free / Pro / Max**; G2 (Cotality consumer-display license) is **launch-blocking**. Decision: [`_decisions/2026-06-17_investor_radar_scope_cuts.md`](_decisions/2026-06-17_investor_radar_scope_cuts.md).

## What it is

The browser extension is the ambient surface of the property-intelligence spine. Its highest and best use is not a generic property notetaker, which the browser-native AI assistants will commoditize. It is a per-user real estate co-pilot whose private memory of what the user is working on lets it push the spine's calibrated property intelligence at the exact deal in front of them, before they ask, and whose keep/reject feedback both sharpens the user and calibrates the spine.

Three layers, one thesis.

1. **Deal radar (the surface).** Rides on the listing page (and any page, via universal capture). Auto-runs a cheap deterministic pass the moment the user lands, returns one headline verdict (deal, worth a look, or dead) tuned to the user's buy box, with the deal-killers and the upside cited, plus a "pencils at $X" basis run from the user's own buy-box math over our cited inputs. The full cited brief runs on click. Keep or pass sharpens the profile.

2. **Profile and running dialogue (the depth).** Every property the user touches is one continuous, never-resetting dialogue. The system translates that dialogue into who they are as an investor: their thesis, their buy box, and their blind spots. The buy box is not just geography and price, it carries the user's game (flip, hold, develop, wholesale) and their underwriting posture (spread tolerance, cap-rate floor, rehab budget, insurance ceiling), which selects which data lens the radar foregrounds.

3. **Owned profile (optional stretch).** The profile becomes a provenance-backed, portable investor profile the user owns and can carry to lenders and partners. The inverted lead feed is **cut for launch**; profile export is a thin optional stretch, not a blocker (per the 2026-06-17 scope cuts).

## Why the investor, and why Austin first

Austin's largest, most data-fit, and most reputation-driven real estate communities are investor-centric (Austin RENC ~15.7k, Texas REIAs 20k+, plus a dense fix-and-flip, wholesale, and buy-and-hold meetup network), not architects or pure consumer buyers. The investor workflow is a near-perfect fit for proactive push plus a lightweight profile over our spine: their whole edge is answering, fast and across many properties, what a property can become and what kills it, which is exactly the calibrated intelligence we sell. High view volume means rich per-user signal, and their keep/reject decisions are outcome-tied, which makes them the best calibration fuel we have. They are also loud in tight communities, so the tool spreads itself. Treat investors as the distribution-and-calibration wedge; monetization graduates upward to the agent and operator tiers. First-actor decision: [`_decisions/2026-06-16_investor_first_actor.md`](_decisions/2026-06-16_investor_first_actor.md).

## The data: the spine already carries the investor underwriting stack

Cotality (the launch parcel and property provider, Regrid dropped per [`61`](61_property_intelligence_master_plan.md)) already exposes nearly the entire investor underwriting stack. Most of it is available on our contract but not yet wired into the brief path. Mapped to the investor's real questions:

| Investor question | Data | Status |
|---|---|---|
| Is it priced right | Sale AVM + comparables (ARV) | AVM wired, comps available |
| Seller basis and motivation | Transaction history, ownership transfers, propensity-to-sell/refinance, owner-occupancy (absentee) | tx-history wired, rest available |
| Will it cash flow | Rent AVM + rental trends + rent propensity | available, not wired |
| Debt and distress | Mortgage, liens, tax assessment | available |
| What has been done to it | Building permit history | available |
| What kills it | Liens, HOA, deed/easement, flood depth at return period, floodway | partly wired |
| Insurance cost | Peril scores (wildfire/wind/hail/quake), first-floor-height, roof condition, weather verification, replacement cost | hazards/RCV wired, roof/weather available |
| How risk trends | Climate AR6, 2030/2040/2050 horizons | wired |
| Can I build or add density | Zoning, soils, geology, groundwater, seismic, topography, drainage, utility readiness | mostly wired |
| Mineral and surface estate | O&G leases, wells | wired |

The standout investor-unique signals, none yet surfaced, are propensity-to-sell, refinance scores, owner-occupancy, and building permits. Those are the engine of the lead feed (the motivated-seller and development signals that turn the profile into deal flow), and they are available, not gaps. Source catalog: [`_research/2026-06-06_cotality_api_surface_catalog.md`](_research/2026-06-06_cotality_api_surface_catalog.md).

## Commitments and constraints

**Sell reasoning, not data.** The radar shows derived, cited, confidence-scored verdicts, never a raw Cotality field passed through. This is both the constitutional posture and the legally safer one.

**Confidence is earned.** Keep/reject feeds the arrow-two calibration overlay and the profile. Texas being a non-disclosure state forces honest confidence on valuation rather than false precision.

**Tenant sovereignty.** The per-user profile is tenant-private and never pools. Only anonymous and public-tier signal feeds shared calibration.

**Tier.** Free (radar, Layer 1, the public wedge) / **Pro** (cited brief + profile + comps/rent) / **Max** (subsurface + insurability + minerals), as accessPolicy + package entitlement with a metered depth allowance to protect Cotality COGS. Pro is a flat monthly subscription ($49, provisional). Per [`08_tiered_access_model.md`](08_tiered_access_model.md), [`_decisions/2026-06-16_investor_radar_name_and_pricing.md`](_decisions/2026-06-16_investor_radar_name_and_pricing.md), and the 2026-06-17 scope cuts.

**Brand (decided 2026-06-16).** The consumer investor surface keeps the **Hauska** name, a conscious override of ADR-008's placement of product surfaces under Empressa (the operator's call; logged, not silent). The substrate and engine remain Hauska. Decision: [`_decisions/2026-06-16_investor_radar_name_and_pricing.md`](_decisions/2026-06-16_investor_radar_name_and_pricing.md).

### Gates

- **G1 prod brokerage key** (blocks everything). `/brief` 503s because the brokerage key env is absent on the live cortex-api revision; the deploy workflow drops it each deploy. Durable fix is one line in `cloud-run-deploy.yml`. Folded into the cc-agent-C dispatch.
- **G2 Cotality consumer-redisplay license** (blocks public display of comps, AVM, rent). Internal and dev-tier pilot proceeds; public display of derived Cotality-sourced numbers is gated. Route to bizops. Decision: [`_decisions/2026-06-16_cotality_consumer_display_license_gate.md`](_decisions/2026-06-16_cotality_consumer_display_license_gate.md).
- **G3 Texas legal framing** (blocks public, cheap). Outputs are automated informational estimates, never an appraisal or opinion of value; use estimated sale price, rent, or worth, not value; the fee is for the tool, not a valuation; attach a TREC-style not-an-appraisal disclaimer. One-sentence question to a Texas real estate attorney before public.
- **G4 Web Store readiness** (blocks public listing). Narrow the host permissions, privacy policy, store metadata, merge the unified-signin baseline.

## Go to market

Partially staged, with the measurement spine (the existing GTM observation layer) instrumented for the investor funnel. Operator and insider pilot, then a closed investor design-partner cohort from the RENC and REIA network, then a gated community launch and Web Store public. The automated distribution engine is deferred until the funnel converts. Full plan: the GTM engine doc (76-band, this session) and the staged motion in the approved plan.

## Status

Reframe approved 2026-06-16. Build dispatched across `legacy-design-tools` (backend data wiring, investor verdicts, per-user profile, lead engine) and `hauska-brief-extension` (the three surfaces on the approved mockups). Wave 0 unblock (G1 prod key, unified-signin baseline) precedes all. The extension's current real state, version drift, and the unmerged signin branch are documented against live code in the session record.
