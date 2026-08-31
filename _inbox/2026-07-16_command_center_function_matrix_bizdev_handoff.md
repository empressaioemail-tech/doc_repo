---
id: 2026-07-16_command_center_function_matrix_bizdev_handoff
title: Command Center function + persona matrix — marketing / bizdev handoff
status: active
last_updated: 2026-07-16
applies_to: portfolio, marketing, bizdev
owner: nick
related: [48_cortex_reporting_function_dashboard_spec, 00c_portfolio_master_map, 07_product_line_summary, 08_tiered_access_model, 76_empressa_wedge_90d_operating_plan]
---

# Command Center function + persona matrix

Handoff for the marketing and business-development repo. This is the complete inventory of functions the platform can pull together, plus the customer profiles we serve and starter workspace combinations for each. Written so a collateral writer can build sell-sheets, landing pages, and pitch decks without needing to read the engineering docs.

## How to read this doc

Think of the Command Center as a **sandbox of functions**. Every capability below is a self-contained tile. A workspace is just a chosen set of tiles laid out together on one screen, tied to one property or one project. We assemble different workspaces for different people by picking different tiles. Swap the tile set and you have a product for a different customer. Nothing is rebuilt per customer; it is composed.

Two consequences for how you write collateral:

The same underlying engine serves the plan reviewer, the architect, and the real estate agent. When you sell to one persona you are selling a lens onto one shared intelligence platform, not a separate product. That is the story: one spine, every seat at the table.

Every function's output carries the same four things regardless of who is looking at it: a reasoning chain, a source citation, a confidence signal, and a timestamp. This is the core differentiator. We sell reasoning, not raw data. A competitor can show you a flood zone; we show you the flood zone, where it came from, how confident we are, and when we checked. Lead with that.

## A note on status (read before writing any promise)

Per your instruction, this matrix assumes the full sandbox is complete by the time collateral ships, so treat everything here as sellable capability. The Status column exists only so nobody promises a specific function as live-today in a demo that would then fail in front of a customer. Statuses:

- **Live** — working in production now, safe to demo today.
- **Building** — designed and partially built; safe to sell as roadmap, confirm before a live demo.
- **Planned** — designed, not yet built; sell as roadmap only.

When in doubt, sell the workspace and the outcome, not the individual tile status. If a specific customer needs a specific function demonstrated live, check the current state with Nick or the planner before committing a date.

---

## Part 1 — The complete function sandbox

Six categories. Every function is a tile that can appear in any workspace.

### Category A — Code Compliance

What the platform knows about the rules a property or project must follow.

| Function | Status | What it does (customer-facing) |
|---|---|---|
| Plan review run | Live | Generates compliance findings against the jurisdiction's adopted code, one finding per code section, each citing the exact section. |
| Finding calibration overlay | Live | Captures the real outcome of each finding so confidence scores get sharper with use. This is the "confidence is earned" mechanism. |
| Precedence / reconciliation engine | Building | Resolves conflicts across city, model-code (I-Code), and federal layers to the most-stringent-governs answer. |
| ICC Code Connect | Building | Licensed display of official I-Codes (IBC / IPMC) with deep links to the source section. |
| Permit approval precedent | Planned | What actually got approved or denied at this jurisdiction before. The designer's number-one question. |
| Code-change broadcast | Planned | Alerts when a watched code section changes or a new edition is adopted. |

### Category B — Site Analysis

What the platform knows about the physical ground.

| Function | Status | What it does (customer-facing) |
|---|---|---|
| Site topography | Live | Elevation, slope, contours, and hillshade from USGS survey-grade elevation data. |
| Site drainage | Live | Water flow direction, rainfall return periods (2 / 10 / 25 / 100 year), and flood-depth mapping. The "where does 4 inches of rain go" answer. |
| Hydrology / watershed | Building | Full watershed and catchment delineation with flow lines. |
| Subsurface suitability | Building | Soils, geology, groundwater, and mineral profile for the parcel. |
| Stormwater / detention sizing | Planned | Estimates required detention and impervious-cover limits. |
| Grading / cut-fill volume | Planned | Earthwork volume and cost estimate from the terrain. |
| Solar / aspect | Planned | Sun-path orientation and solar exposure. |
| Viewshed | Planned | View-premium analysis from the parcel's elevation. |

### Category C — Property Intelligence

The synthesis layer: everything known about a property, assembled into one briefing.

| Function | Status | What it does (customer-facing) |
|---|---|---|
| Property brief | Live | The flagship. Full synthesis of site context, parcel, code, hazard, and market into one cited briefing. |
| Hazard profile | Live | FEMA flood plus fire / wind / hail / earthquake perils, with an insurance-cost estimate. |
| Place dossier | Live | Comprehensive location briefing, snapshot-first. |
| Encumbrance report | Live | Liens, deed restrictions, CC&Rs, and special-district membership. |
| Local setbacks | Live | Dimensional zoning requirements by jurisdiction. |
| Climate risk trajectory | Planned | Forward-projected hazard out to 2030 / 2040 / 2050. |
| Insurance cost estimate | Planned | Composite hazard plus replacement value to an estimated insurance cost. |
| Comparative jurisdiction | Planned | The same build type across adjacent jurisdictions, ranked by how approval-friendly each is. |

### Category D — Design Accelerator

What the platform does with a set of drawings or a building model.

| Function | Status | What it does (customer-facing) |
|---|---|---|
| Sheet content extraction | Live | Reads and structures submitted plan sheets automatically. |
| Attached document parsing | Live | Parses specs, calculations, product data, and narratives into structured text. |
| Product spec reference | Live | ICC-ES product verification lookup. |
| Detail callout specs | Live | Drawing markup and detail callouts. |
| Response tasks | Live | Turns review results into a design-accelerator action list. |
| BIM model query | Live | Query geometry and elements from a building model. |
| IFC ingest | Live | Turns an IFC building-model file into queryable elements. |
| Engagement match | Live | Resolves a Revit file to the right project automatically. |
| Renders | Live | Stills, elevation sets, and video from the model. |
| Collateral export | Live | Branded PDF template-pack export. |

### Category E — Deliverable

What the platform produces to send to a client, applicant, or counterparty.

| Function | Status | What it does (customer-facing) |
|---|---|---|
| Deliverable letter | Live | Composes a formal letter (cover, intro, findings responses, signature) with source provenance on every section. |
| Letter completeness gate | Live | Validates that required sections are present before it can be sent. |
| Letter render | Live | Renders to DOCX or PDF with the right letterhead per tenant / jurisdiction. |
| Letter send | Live | Draft-to-sent handoff to the applicant. |

### Category F — Market / Investor

What the platform knows about value, income, and deal quality.

| Function | Status | What it does (customer-facing) |
|---|---|---|
| AVM / valuation | Building | Automated property valuation. |
| Rent / comps | Building | Rent estimates and comparable sales. |
| Cash-flow pro forma | Planned | Rent minus tax, insurance, and HOA to net operating income, with cap-rate derivation. |
| Deal score | Planned | Valuation-vs-asking plus yield plus propensity, minus a hazard penalty, in one score. |
| Motivated-seller heat | Planned | Blends seller propensity, absentee ownership, equity, and tax delinquency into a lead signal. |
| Rehab opportunity | Planned | Flags older properties with no recent permits, below-median value, in a rising-rent zone. |

### The map (spans every category)

Every workspace can include a live parcel **map** tile. It centers on the active property and draws whatever the other tiles produce as overlays: flood extent, contours, drainage flow, zoning, setbacks, utility corridors, parcel geometry. Any function that produces something spatial shows up on the map automatically. Treat the map as the connective surface in every workspace, not a separate product.

---

## Part 2 — The people we serve

Customer profiles the sandbox is built to serve. Each is a real seat at the table around the same artifact: a project against a jurisdiction's rules and ground.

**Plan reviewer (city-side).** Works inside a city or jurisdiction. Reviews submitted plans against the adopted code, issues findings, writes comment letters. Wants to move faster without losing rigor, and wants every finding to cite a real section so it holds up. This is the Codex 1b seat.

**Architect / engineer / designer.** Designs buildings and sites. Wants the jurisdiction's actual code as a live design partner, wants to catch code and site problems before submitting, and wants deliverables (renders, letters, exports) out of the same tool. This is the AEC-cortex seat, plus Revit Connector for those already in Revit.

**Design firm / contractor (pre-submission).** Wants to run the same review the city will run, before submitting, to kill resubmission cycles. This is the Codex 1a self-check seat.

**Real estate agent / broker.** Represents buyers and sellers. Wants a fast, credible, cited property briefing to hand a client, and wants to look like the most informed person in the room. This is the Property Brief wedge, the primary commercial motion.

**Real estate investor.** Buys for return. Wants valuation, income modeling, hazard-adjusted risk, and a deal score, all with the reasoning shown so they can trust it. This is the Radar / investor seat.

**Property developer / land buyer.** Evaluating raw or improvable land. Wants site feasibility (drainage, grading, subsurface, setbacks), code and approval friendliness, and hazard exposure before committing capital. Draws across Site Analysis, Property Intelligence, and Code Compliance.

**City manager / department head.** Runs the jurisdiction. Wants one operational platform with jurisdiction-aware intelligence built in, rather than a patchwork of GIS, permit software, and spreadsheets. This is the SmartCity OS seat.

**Agent builder / developer (technical buyer).** Building their own permit, zoning, or diligence workflows on top of our intelligence. Wants API and agent-tool access to the atomized corpus rather than building their own. This is the Hauska MCP / SDK seat and the primary substrate buyer.

**Insurance / risk analyst (emerging).** Wants hazard exposure, climate trajectory, and replacement-cost-based insurance estimates on a property or a portfolio. Draws on the Hazard and Property Intelligence categories.

---

## Part 3 — Suggested starter workspaces per persona

Starting-point tile combinations. These are the workspaces we would pre-configure for each customer type. They are a menu to sell from, not a fixed product; any tile can be added or removed. Several of these ship as named preset spaces today.

### Plan reviewer — "Plan Review" workspace

Intake queue, Plan review run, Deliverable letter, Map.

The reviewer picks a submittal from the queue, runs compliance, sees findings citing real code sections, accepts or overrides each one, and the letter composes itself from the accepted findings. The map shows the parcel with regulatory overlays. This is the day-in-the-life workspace for the city seat. (Ships as a preset today.)

### Architect / engineer — "Design Accelerator" workspace

Sheet content extraction, Response tasks, Plan review run (self-check), Renders, Map.

The designer pulls their sheets in, gets them read and structured, runs the city's own review against their own drawings before submitting, turns the results into an action list, and can generate renders from the same project. Add Collateral export to produce a client-ready deliverable.

### Contractor (pre-submission) — "Submit Clean" workspace

Plan review run, Precedence / reconciliation engine, Product spec reference, Deliverable letter.

Run the review the city will run, resolve any code-layer conflicts to the governing requirement, verify product specs, and produce the corrected package. The sell is fewer resubmission cycles.

### Real estate agent / broker — "Property Brief" workspace

Property brief, Hazard profile, Local setbacks, Map.

One cited briefing per property: site context, parcel, code, hazard, market, all in one document the agent can hand a client. This is the wedge. The agent looks like the most informed person in the room, and every claim is sourced. Add Encumbrance report for listings with title or deed-restriction questions.

### Real estate investor — "Deal Desk" workspace

AVM / valuation, Rent / comps, Cash-flow pro forma, Deal score, Hazard profile, Map.

Value, income, and risk on one screen, ending in a hazard-adjusted deal score. Add Motivated-seller heat and Rehab opportunity for sourcing rather than evaluating. The differentiator is that every number shows its reasoning.

### Property developer / land buyer — "Site Feasibility" workspace

Site topography, Site drainage, Subsurface suitability, Local setbacks, Comparative jurisdiction, Hazard profile, Map.

Everything that decides whether the ground can be built on and whether the jurisdiction will let you: terrain, water, soils, dimensional limits, cross-jurisdiction approval friendliness, and hazard exposure. The "where does 4 inches of rain go" workspace.

### City manager — "City Operations" workspace

This persona runs inside SmartCity OS rather than a single Command Center workspace, but the property-facing lens is: Property brief, Plan review queue, Hazard profile, Map, with the jurisdiction's own code loaded. Sell the operational platform; the sandbox functions are what make its property intelligence real.

### Agent builder / developer — no workspace, API access

This persona does not use the visual workspace. They consume the same functions as agent tools and API endpoints (search the corpus, get an atom, run a brief, run a review) through the Hauska MCP gate. Sell direct programmatic access to the same cited intelligence, free at the base tier and paid for context-enriched output.

### Insurance / risk analyst — "Risk Profile" workspace

Hazard profile, Climate risk trajectory, Insurance cost estimate, Encumbrance report, Map.

Present hazard exposure, forward-projected climate risk, and an insurance-cost estimate on any property or across a portfolio.

---

## Part 4 — Persona-to-function quick reference

One grid, for building comparison tables and sell-sheets fast. Each cell marks whether the function category is the persona's core draw (●) or a useful add-on (○).

| Persona | Code Compliance | Site Analysis | Property Intel | Design Accel | Deliverable | Market / Investor |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| Plan reviewer | ● | ○ | ○ | ○ | ● | |
| Architect / engineer | ● | ○ | ○ | ● | ● | |
| Contractor (pre-submit) | ● | | ○ | ● | ● | |
| Real estate agent | ○ | ○ | ● | | ○ | ○ |
| Real estate investor | ○ | ○ | ● | | | ● |
| Developer / land buyer | ● | ● | ● | ○ | ○ | ○ |
| City manager | ● | ○ | ● | ○ | ● | |
| Agent builder (API) | ● | ● | ● | ○ | ○ | ○ |
| Insurance / risk | ○ | ○ | ● | | | ○ |

---

## Part 5 — The one-line pitch per persona (for headlines)

- **Plan reviewer:** Every finding cites a real code section. Review faster without losing rigor.
- **Architect / engineer:** The jurisdiction's actual code as a live design partner. Catch it before you submit.
- **Contractor:** Run the city's review before the city does. Submit clean, resubmit less.
- **Real estate agent:** The most informed person in the room, with every claim sourced.
- **Investor:** A hazard-adjusted deal score that shows its work.
- **Developer:** Know whether the ground can be built on, and whether they'll let you, before you buy.
- **City manager:** One platform to run the city, with property and code intelligence built in.
- **Agent builder:** Jurisdiction-aware reasoning as an API. Don't build your own corpus.

## The through-line for every piece of collateral

We sell reasoning, not data. Every output carries its reasoning chain, its source, a confidence signal, and a timestamp. One shared intelligence platform, surfaced as the right workspace for every seat at the table. That is the whole story; everything above is how it shows up for each customer.
