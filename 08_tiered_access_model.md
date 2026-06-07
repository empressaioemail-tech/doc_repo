---
id: 08_tiered_access_model
title: Tiered access model — free substrate, paid context, integrated products
status: active
last_updated: 2026-06-07
applies_to: portfolio
related: [05_living_lineage_thesis, 07_product_line_summary, 11_roadmap, 11a_bastrop_live_roadmap, 14_pricing_framework, 47_codex_plan_review, 49_code_ingestion_pipeline, 55_spine_data_intelligence_stack, _decisions/2026-06-07_full_engine_extraction_and_data_packages]
owner: nick
---

# Tiered access model

> **Purpose.** Commercial structure for the product line: what's free,
> what's paid, what triggers conversion, and how the tiers interact with
> the consultant channels. Companion to [`07_product_line_summary.md`](07_product_line_summary.md)
> (what the products are) and [`14_pricing_framework.md`](14_pricing_framework.md)
> (how to negotiate price within tiers). This doc settles the *structure*;
> 14 settles the *negotiation*.

> **Status posture.** Accepted as a high-level commercial commitment;
> specific pricing numbers, exact tier boundaries, and per-channel
> pricing mechanics are flagged as [Open for refinement](#open-for-refinement)
> and resolve as the first paid conversions land.

## The two-axis tiering

Tiering operates on two axes simultaneously:

| Axis | Question |
|---|---|
| **What** | Is the user accessing bare reference data, contextual intelligence, or integrated workflows? |
| **Who** | Architect / engineer · contractor · city · consultant / partner · PropTech embedder |

The same buyer can sit in multiple tiers depending on which products they use. A city using SmartCity OS pays at the integrated-workflow tier; the city's contractors using public Codex 1a are on the free tier; the city's plan-review consultant is on a partner tier. One substrate, many points of entry.

**Refinement (2026-06-07): the entitlement unit is a composable data package, not a persona.** The "Who" segments below describe who buys; they do not bound what a buyer can access, because buyers overlap (a landman is also a broker; a city operator is also a reviewer). So the operative unit is a data package the buyer composes freely, crossed with the access layer. See "Data packages" below. This reshapes Decision B per [`_decisions/2026-06-07_full_engine_extraction_and_data_packages.md`](../_decisions/2026-06-07_full_engine_extraction_and_data_packages.md).

## What axis — three layers

### Layer 1 — Free: bare code reference atoms

The pipeline-produced atoms ([`49_code_ingestion_pipeline.md`](49_code_ingestion_pipeline.md)) representing "what the code says." Things like:

- `code-section` atoms
- `code-definition` atoms
- `code-amendment` atoms
- `code-cross-reference` atoms
- `code-edition` atoms

These are publishable as `.atompack` files (per [ADR-012](80_adrs/adr_012_atom_export_format.md)) and usable in any LLM. **Maximum distribution.** Code is public information; atomizing it doesn't change that. Free.

The atom contract is open. The format spec is public. Cities, consultants, architects can all consume the free tier without a relationship to the platform.

### Layer 2 — Paid: context-enriched atoms

Atoms that compound from use of the platform. The things bare code reference doesn't have:

- `adjudication-record` atoms (how reviewers actually applied a section)
- `per-reviewer-pattern` atoms (this jurisdiction's interpretation patterns)
- `comparable-project-precedent` atoms (which past projects this resembles)
- `finding` atoms (with full citation + adjudication chain)
- `parcel-record` atoms with full lineage (decisions made on the property over time)
- Cross-jurisdictional precedent traversals ("here's how Round Rock handles this")

These are what makes Codex / Cortex / SmartCity OS materially better than chatbot + free-tier atoms. They're also what cannot be replicated by anyone without the use history. **Paid because they're the moat.**

The free-tier user gets "what the code says." The paid-tier user gets "what the code means, in practice, for this jurisdiction, given five years of submittals."

### Layer 3 — Integrated workflows: the products

State persistence, multi-user collaboration, system integrations (Revit / MyGov / OpenGov / county records), deterministic pipelines, branded deliverables, eval infrastructure. **The product wrappers** — SmartCity OS, Cortex, Codex 1a, Codex 1b, Revit Connector. Paid at the product level.

What this layer adds over Layer 2:

- Workflow gates and approvals (comment letter signed off, finding queued for review)
- Cross-session state (last week's adjudications still there)
- Multi-user (Sylvia and Jaime working the same submittal)
- External system integration (atoms write back into MyGov; Revit consumes findings)
- Branded artifacts (city-signed comment letter as legal of record)
- Eval / regression infrastructure (did our output get worse?)

Layer 3 is *not* substitutable by bring-your-own-LLM. Even with the best paid-tier atom access, a bring-your-own-LLM user doesn't get persistence, integration, or workflow.

## Who axis — five segments

### Architects + engineers

**Free tier access:** bare code reference atoms for any atomized jurisdiction. Drag a `.atompack` into Claude / ChatGPT; ask design questions; get jurisdiction-grounded responses. No platform login required.

**Paid tier path:** Cortex (subscription per seat / per firm). Adds incremental compliance during design, atom-write-back to Revit, paid-tier context atoms surfaced through the Cortex UI, project-level state and collaboration.

**Conversion trigger:** when the user's prompting volume or context-need exceeds what's comfortable to bootstrap from a `.atompack` paste each session. When they need state. When they're working on a real project against a real submittal date.

### Contractors / design firms (pre-submission)

**Free tier access:** public Codex 1a. Upload a submittal; receive bare-finding outputs against the jurisdiction's code (when the jurisdiction is atomized). Useful for catching obvious issues before submission.

**Paid tier path:** Codex 1a *paid* (when shipped) — adds paid-tier context atoms (comparable-project precedent, per-jurisdiction adjudication patterns, firm-precedent layer). Findings become substantially higher fidelity.

**Conversion trigger:** firm size + project value. A solo contractor on a $50K residential job lives on free 1a. A firm doing $5M commercial work that can't afford a resubmission cycle wants the paid version.

### Cities

**Free tier access:** atomized public code (the city's own code visible to its own staff and constituents). No commercial obligation.

**Paid tier path:** SmartCity OS + Codex 1b at the city-integrated tier (Layer 3). City pays for the operational platform plus the paid-tier intelligence under it.

**Conversion trigger:** the city needs an operational tool. Free atoms alone don't run their permits, dashboards, or plan review.

### Consultants / partners

Four sub-segments per the velocity-through-2026 brainstorm:

| Sub-segment | Relationship | Tier model |
|---|---|---|
| Code rewrite firms (Code Studio, ZoneCo, Camiros) | Publish jurisdictional atom packs as part of their deliverable | Revenue share or per-jurisdiction co-publishing fee; specifics open |
| Outsourced plan review firms (SAFEbuilt, Bureau Veritas, Charles Abbott, NV5) | Use Codex 1b across the cities they serve | Per-seat or per-jurisdiction license; layers on top of city's payment to them |
| Big design + engineering firms (Freese & Nichols, Halff, Kimley-Horn, HR Green, HOK, Page) | Use Cortex + Revit Connector firm-wide | Per-seat subscription; firm-level enterprise terms |
| PropTech SDK partners (Accela, Tyler, CompStak, Crexi, Reonomy, AppFolio, Yardi) | Embed atom packs in their LLM features | Per-jurisdiction or per-call licensing; specifics open |

### PropTech embedders

Distinct enough from generic consultants to call out. Atom-pack embedding in third-party products is its own commercial relationship:

- **Free tier:** atom-pack format spec + bare code atoms for evaluation / proof-of-concept use. Read-only.
- **Paid tier:** production licensing for atom packs in shipped products; potentially per-jurisdiction or per-end-user-call.
- **Conversion trigger:** when their LLM features go from prototype to production with end-user volume.

## Data packages (composable entitlement unit)

The unit a buyer entitles to is a data package, mixed and matched, persona-agnostic. The gate enforces accessPolicy + package-entitlement + tier. Each package spans the access layers: Layer 1 is the free public-records baseline for that domain; Layer 2 is calibrated, cited reasoning over it.

| Package | Domain contents | Example overlapping buyers |
|---|---|---|
| Subsurface | soils (SSURGO), geology, seismic, groundwater, mineral | geotech, civil, landman, O&G |
| Hydrology / flood | drainage, NOAA design storms, FEMA, flood depth | civil, insurer, developer |
| Parcel / property | parcel, zoning, ownership, encumbrances | broker, landman, appraiser |
| Code / plan-review | municipal codes, I-Codes, accessibility (A117.1/ADA/FHA), precedence, decomposition | architect, reviewer, AHJ |
| Environmental | EJ, wetlands, species, air | planner, ESG |

**Binding constraint (sell reasoning, not data).** A package's Layer 2 is reasoning over the domain, cited and calibrated. The raw national/federal data underneath (SSURGO, USGS, FEMA, code text) stays Layer 1 free. A package must never become a raw-data resale SKU; that would break structural commitment 1.

A landman who is also a broker composes Subsurface + Parcel; an architect composes Code + Hydrology; a city tenant gets all of them, jurisdiction-scoped and tenant-private. One spine, one gate, any composition.

## Conversion mechanics

Free-tier use produces signal that informs paid-tier conversion conversations:

- **Atom-pack download counts per jurisdiction** → which jurisdictions have organic demand → which to atomize next; which to upsell to.
- **Public Codex 1a usage** → which contractors are using it heavily, against which jurisdictions → contractor-side paid-tier upsell candidates.
- **Cross-jurisdictional query patterns** → which cities' patterns are being asked about → demand signal for adjacent-jurisdiction onboarding.

The free tier doesn't just live as marketing — it produces commercial signal that informs paid-tier strategy.

## Tier guardrails

What protects the moat between tiers:

- **Adjudication context is non-publishable in atom-pack form.** A free-tier `.atompack` for Bastrop carries the city's code; it does not carry Sylvia's adjudication patterns. The pipeline can produce paid-tier atom-pack variants for licensed consumers, but the default `.atompack` is bare-tier-only.
- **PII / privacy scope.** Per [ADR-007](80_adrs/adr_007_cross_stakeholder_atom_access.md) and ADR-001 PII handling, any atom carrying PII or sensitive interpretation context is access-controlled regardless of tier. Tier doesn't override scope.
- **Cross-jurisdictional precedent is paid-only.** "See how Round Rock handles this" requires aggregating across jurisdictions; that aggregation is a paid-tier feature.
- **Verifiability cuts both ways.** Free-tier atoms are verifiable end-to-end (per ADR-012). Paid-tier atoms inherit the same verifiability; the moat isn't secrecy, it's the cost of generating the use context in the first place.

## Channel implications

Each consultant channel maps onto tier mechanics:

- **Code rewrite firms** publish free-tier atom packs as part of their deliverable. Their revenue is from the city (for the rewrite); ours is from the network effect of every code they rewrite being on our substrate. Could layer a per-jurisdiction co-publishing fee, or treat it as free-to-them-revenue-to-us-via-pull.
- **Outsourced plan review firms** consume paid-tier Codex 1b for their operations across many cities. Per-seat licensing. They make their cities Hauska-resident as a side effect of using our tool, which becomes SmartCity OS upsell ammunition later.
- **Big design firms** consume paid-tier Cortex + Revit Connector at firm-wide enterprise scale. Per-seat subscription with volume discounts. Their projects pull cities onto the substrate as a side effect.
- **PropTech embedders** license atom packs (free for eval, paid for production). Bring substrate to adjacent verticals without us building those verticals ourselves.

## Relationship to existing pricing framework

[`14_pricing_framework.md`](14_pricing_framework.md) is about *negotiation posture* within a deal — Path A (tighten scope to hit anchor) vs Path B (price honestly even if it exceeds anchor). This doc is about *what tier the deal is in to begin with*.

The two compose:
- Tier determines what's being sold.
- Path determines how it's priced and negotiated.
- A Layer 3 (integrated workflow) deal with a small TX city is a Path A negotiation (tighten scope to match anchor).
- A Layer 3 deal with an enterprise PropTech embedder is a Path B negotiation (price honestly; let scope speak).

`14_pricing_framework.md` is unchanged by this doc; this doc gives it more structure to operate within.

## Open for refinement

Specific items deferred until first paid conversion data lands:

- **Pricing numbers.** No specific dollar amounts in this doc. First paid conversions of Codex 1a (contractors) and SmartCity OS (cities) set the market reference. Defer to [`14_pricing_framework.md`](14_pricing_framework.md) revisions.
- **Free / paid Codex 1a boundary.** Exactly which findings are free-tier vs paid-tier. Probably: free = code-citation-only; paid = code-citation + comparable precedent + per-jurisdiction interpretation patterns. Sharpen with use data.
- **Atom-pack licensing terms.** PropTech embedder pricing model: per-jurisdiction, per-call, per-end-user-MAU, hybrid. Resolve with first PropTech design-partner conversation.
- **Code-rewrite-firm co-publishing economics.** Revenue share, flat fee, in-kind (their rewrite work feeds the network), or hybrid. Resolve in first firm MOU.
- **Cross-tier downgrade / upgrade mechanics.** A paid-tier customer who lapses — do they retain their stored paid-tier atoms or lose access? Probably retain read-only; spec needs design.
- **Anonymous / aggregated free tier.** Should we expose anonymous aggregate adjudication patterns ("most jurisdictions interpret § X this way") as a free-tier teaser of the paid tier? Probably yes, with care; spec deferred.
- **Bastrop-pioneering implications for tier.** Bastrop as the first city in the network has unusual leverage. Special-case terms (founder pricing, perpetual paid-tier-included status, revenue share) are open per the pioneering framing.
- **Firm-tenancy interaction with tier (ADR-009).** Per-firm-engagement metadata interacts with tier in ways not yet specified. Resolves when ADR-009 lands.
- **Public-good carveouts.** Some uses (academic research, free legal aid, citizen access to their own property's lineage) probably warrant paid-tier access at no cost. Policy needs framing.

## Cross-references

- [`05_living_lineage_thesis.md`](05_living_lineage_thesis.md) — strategic foundation; tiering operationalizes the "lineage is portable substrate" claim
- [`07_product_line_summary.md`](07_product_line_summary.md) — products this tier model commercializes
- [`14_pricing_framework.md`](14_pricing_framework.md) — negotiation posture within tiers
- [`11_roadmap.md`](11_roadmap.md) — portfolio roadmap; open commercial questions (per-city price envelope, tenth-deal economics) feed into tier refinement
- [`11a_bastrop_live_roadmap.md`](11a_bastrop_live_roadmap.md) — Bastrop-live milestone unlocks first real tier-conversion data
- [`47_codex_plan_review.md`](47_codex_plan_review.md) — Codex product home; commercial wave structure aligns with this tier model
- [`49_code_ingestion_pipeline.md`](49_code_ingestion_pipeline.md) — pipeline that produces free-tier substrate atoms
- [`80_adrs/adr_007_cross_stakeholder_atom_access.md`](80_adrs/adr_007_cross_stakeholder_atom_access.md) — access scopes; tier doesn't override scope
- [`80_adrs/adr_012_atom_export_format.md`](80_adrs/adr_012_atom_export_format.md) — `.atom` and `.atompack` formats that carry tier boundaries

## Revision history

- **2026-06-07:** Added the data-package framing (composable entitlement unit, package x access-layer; Subsurface / Hydrology / Parcel / Code-plan-review / Environmental) refining the persona-based "Who" axis, with the binding sell-reasoning-not-raw-data constraint. Per [`_decisions/2026-06-07_full_engine_extraction_and_data_packages.md`](../_decisions/2026-06-07_full_engine_extraction_and_data_packages.md); reshapes Decision B. Frontmatter `related` + `last_updated` bumped.
- **2026-05-12 (origin):** Drafted during velocity-through-2026 brainstorm session in response to the compounding-atoms / free-vs-paid insight. Establishes two-axis tiering (what + who) with three layers on the "what" axis (free reference / paid context / paid integrated workflow) and five segments on the "who" axis. Pricing numbers explicitly deferred to [`14_pricing_framework.md`](14_pricing_framework.md) revisions after first paid conversions. Companion to [`07_product_line_summary.md`](07_product_line_summary.md) (product line) and [`14_pricing_framework.md`](14_pricing_framework.md) (negotiation framework).
