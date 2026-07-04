---
id: insurance_underwriting_market_approach
title: Insurance and underwriting — market approach thesis
status: thoughtbank
last_updated: 2026-06-30
applies_to: portfolio
owner: nick
related: [network_effects_use_cases_and_gaps, temporal_context_engine_spec, 09_post_saas_substrate_thesis, 75l_cotality_data_stack_catalog]
---

# Insurance and underwriting — market approach thesis

Filed 2026-06-30. Triggered by the LinkedIn thread (Mark Cuban / Kelly Sennholz MD) on MRI cost opacity: insurance pays $2,500 for a procedure that costs $350. The thread captures a structural problem the Hauska substrate is designed to solve: no verifiable provenance chain between real cost, billed cost, and paid cost. Adjacent use cases doc (network_effects_use_cases_and_gaps.md) already noted insurance/underwriting as "likely the largest adjacent market and closest to RE data in hand." This is the full dive.

## The structural problem the screenshot names

The Cuban/MRI moment is a specific instance of a general failure: cost opacity in insurance is not accidental. It is the product of a market where the buyer (insured or patient) is separated from price-setting by multiple intermediaries, each adding margin and obscuring source cost. The information asymmetry is structural and durable. Three variables exist in the same transaction, each with a different number attached: real cost (what it costs to produce the service or repair the property), billed cost (what the provider charges), and settled cost (what insurance actually pays). No participant in the chain has clean, sourced, calibrated visibility across all three. That is a Hauska-shaped problem.

The atoms already in the stack -- parcel data, climate/hazard overlays, code compliance state, encumbrance history -- are exactly the raw material that property and casualty underwriters need. The gap is that nobody serves them as calibrated, provenance-tracked, forward-looking facts. They get data dumps or point-in-time bureau pulls.

## Three wedges, ranked by proximity to what we already have

### Wedge 1 -- Property and casualty underwriting (nearest, highest priority if activated)

This is the most natural extension of the existing stack. Property underwriters need what we already hold: parcel characteristics, hazard exposure (flood zone, fire risk, climate trajectory), zoning/land-use state, code compliance posture, permit activity, and encumbrance/lien health. All of these are either live in the atom corpus or already planned.

The Hauska play is an MCP tool (or a small suite of tools) that returns a calibrated, sourced property risk profile on demand. The buyer is not the homeowner. The buyer is the MGA (managing general agent) writing the policy, or the reinsurer pricing the portfolio, or the insurtech building a parametric product that triggers on a flood zone threshold. These are B2B API buyers, which is exactly the buyer profile the substrate is built for.

What an MGA would actually pay for: a tool call that returns flood exposure (FEMA FIRM + Cotality Climate overlay + forward-looking climate trajectory), fire-risk score (Cotality fire-risk API, already in the stack), code compliance status at the jurisdiction level (is this parcel in a jurisdiction current on fire code?), last permit activity and any open/unpermitted work (code violation risk), and outstanding liens or encumbrances (loss-payee conflict risk). All sourced, confidence-scored, timestamped.

The Cotality climate layer (flood, fire, likely-to-sell) is already integrated into the legacy-design-tools stack. The gap is wiring it into an underwriting-specific tool shape and calling it what underwriters call it.

Cost and access angle: the Cuban thread points at procedure cost. Property insurance has the same problem. Replacement cost is opaque. Actual cash value is disputed. The atom for "estimated replacement cost at this address" with a provenance chain (construction data, local labor index, material cost index, permit history as a proxy for upgrade state) would be genuinely new in a market where most replacement-cost estimates come from a single proprietary model the insurer cannot inspect.

### Wedge 2 -- Title insurance and abstracting (near-term, requires the verified-absence atom)

Title insurance is calibrated encumbrance risk. The insurer bets that the title is clean; the product is the risk of being wrong. The key thing a title insurer needs that does not exist cleanly today: verified absence. "No liens found" is worth exactly nothing unless it means "we searched the authoritative record and found none," not "we did not look." This is gap 1 in the system-gaps section of network_effects_use_cases_and_gaps.md.

ADR-020/021 added encumbrance atoms to the schema. The verified-absence atom (gap 1 that is queued for the trading app first, then RE) is the title intelligence product. The tool call: `check_title_encumbrances(parcel_id)` returns either the encumbrances found with sources and recording dates, or a verified-absence atom saying the search was performed against specific authoritative records and nothing was found, with the search timestamp and source list as provenance.

Title companies and abstracting attorneys are a natural buyer. They currently do manual searches or pay for bureau data that comes with no provenance on the search itself. The Hauska version gives them a defensible, sourceable, calibrated result they can attach to the commitment or the opinion.

Lender-required title work for every residential transaction is roughly 1.5 million per year in Texas alone. At a per-search price point this is a volume play, not a value play, but the workflow entry point is clear.

### Wedge 3 -- Medical/health cost transparency (the Cuban angle, farther out, aperture only)

The MRI example is instructive but this is not where the substrate plays near-term. Medical cost atoms would require: a procedure code taxonomy (CPT/ICD-10 atoms), facility nodes (hospital and clinic entities), Medicare fee schedule as a sourced fact, commercial rate benchmarks (currently opaque, though some states require disclosure), and actual claim settlement data (likely never available publicly at the transaction level).

The substrate generalizes to this. A "procedure cost" atom with provenance (source: CMS fee schedule, year, HCPCS code, locality) is the same shape as a parcel-risk atom. But building the ingestion adapters, the facility node type, and the procedure taxonomy from scratch is a full vertical build. It would displace something real on the focus queue.

The observation to file: the structural problem is identical. If the medical-cost vertical is ever activated, the atom model does not change. Only the adapters and the taxonomy do. That is the value of the substrate.

## Why the unique Hauska features are the deciding advantage here

Per the adjacency analysis: the three markets where calibration, anchoring, and lineage are the deciding advantage, not nice-to-haves, are insurance, carbon/ESG, and RWA. For plain data (census, permit counts, sold prices), there is commodity competition. For calibrated, forward-looking, sourced, anchored risk facts, there is not.

Insurance specifically: an underwriter does not just need a risk score. They need to know how it was derived, what sources it rests on, when those sources were last verified, and how the model has performed historically (calibration). Those are the four things the substrate is built to provide and that nobody else in the property data market provides together. The risk score alone is a commodity. The sourced, calibrated, historically-grounded risk fact is not.

The contribution flywheel also applies directly: every policy written on a Hauska risk profile, resolved (paid claim or no-claim), is calibration signal on the risk atom. That makes the risk profile better for the next policy. That is the underwriting version of the contribution flywheel identified in the network-effects analysis.

## Buyer map

Property and casualty vertical:
- MGAs writing residential and commercial property policies. Volume buyers; they need speed and API access. Price sensitivity is high but they buy in bulk.
- Reinsurers and cat modelers (RMS, KCC, Air Worldwide). They model portfolio exposure at scale. They need the forward-looking climate layer and parcel-level hazard aggregation. This is a smaller number of buyers but much higher ACV per seat.
- Insurtechs building parametric products (flight cancellation, crop, event). They need calibrated forward-looking triggers, not historical claims data.

Title vertical:
- Title companies (First American, Old Republic, Fidelity, and the independents in Texas). The independents are the realistic first buyer.
- Abstracting attorneys in non-attorney-state markets.
- Lenders doing their own due diligence (common in commercial transactions).

Medical vertical (aperture only, not a near-term buyer map):
- Self-insured employers buying transparency tools for their plan members.
- Price-transparency aggregators (Healthcare Bluebook, Turquoise) -- potential data partners rather than buyers.

## What would have to be true to activate the P&C wedge

The Cotality climate data is in the stack. The parcel atoms are live. Jurisdiction code compliance atoms are in the Central TX corpus. The pieces are present. Activation requires:

1. A parcel-risk profile tool in the MCP server that composes the climate layer, parcel characteristics, and code compliance state into a single sourced output. This is a cortex-function-package build, not a new data build.
2. A product key for the insurance vertical (the MCP server already gates by product key; adding an insurance-vertical key is configuration, not architecture).
3. One pilot buyer willing to use it before the full packaging is done. The MGA channel is the right first door; they are tool-first buyers and the workflow entry point is clear.

The activation sequence does not require a new vertical decision. It requires recognizing that the property risk profile tool is a cortex function package deliverable that runs on atoms already in the catalog.

## Focus-queue discipline note

Per the adjacency analysis caveat: this is aperture, not a to-do list. Nothing here opens until the wedge ships and hits its gates. The property P&C play would displace something to enter the active focus queue; that displacement has not been decided and should not be assumed. This document is filed so the thinking does not evaporate and can be picked up cleanly when the moment is right.

The two things worth carrying forward into active docs when the time comes: (1) the P&C risk-profile tool is a natural cortex function package build on existing atoms, not a new vertical build, and (2) the verified-absence atom (already queued for the trading app) is also the title insurance product.
