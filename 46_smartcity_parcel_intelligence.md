---
id: 46_smartcity_parcel_intelligence
title: Parcel Intelligence — environmental + geographical awareness
status: active
last_updated: 2026-05-11
applies_to: smartcity-os
related: [07_product_line_summary, 11_roadmap, 11a_bastrop_live_roadmap, 27_engine_evolution_plan, 30_smartcity_os, 42_design_accelerator_program_plan, 47_codex_plan_review, 48_codex_program_plan]
owner: nick
---

# Parcel Intelligence

> **Purpose.** Independent scope doc for the Parcel Intelligence capability:
> a structured AI-produced briefing on what a parcel can support, what
> constraints apply, and what the city's approval path will look like.
> Built on the Hauska Engine. Surfaced in SmartCity OS Operations
> Dashboard. Sits between the existing property intelligence layer and
> Codex 1b plan review — supplies the parcel-record context that Codex
> needs to differentiate.

## What it is

A natural next stage of the property intelligence Bastrop staff already
use in the Operations Dashboard.

A city manager, planner, or engineer:

1. Selects a parcel.
2. Optionally describes a proposed use — free text, a photo of a napkin
   sketch, or a rough outline drawn on the map.
3. Receives a **structured AI-produced briefing** on:
   - What the parcel can support
   - What constraints apply
   - What the path through the city's approval process will look like

The briefing is composed of classified atoms — same atom contract as
Cortex and Codex. Findings are pointable-at, not free-form chat.

## Customer + surface

**For:** City managers, planners, engineers, inspectors using the
SmartCity OS Operations Dashboard. Same audience as the existing
property intelligence layer.

**Surface:** Operations Dashboard parcel search. The structured briefing
renders inline when a parcel is selected. Optional pre-application
inputs (text / photo / map outline) refine the briefing.

## Data sources

The briefing draws on, at minimum:

| Source | Provider | Layer |
|---|---|---|
| Floodplain | FEMA | Flood exposure |
| Wetlands | USFWS | Habitat / regulated waters |
| Elevation + slope | USGS | Terrain / drainage path |
| Soils | USDA | Soil class / suitability |
| Endangered species habitat | USFWS | Critical habitat overlay |
| Edwards Aquifer zones | TCEQ | Aquifer recharge / contributing zones (TX-specific) |
| City zoning | Bastrop (jurisdiction-local) | Zoning + overlay districts |
| Existing infrastructure proximity | Bastrop GIS | Water, sewer, road network |
| Permit + finding history | Bastrop's own records | Precedent from comparable projects |

Each source becomes one or more atom types in the registry. Where a
source is jurisdiction-local (zoning, infrastructure, permit history),
the Parcel Intelligence pipeline reads from that jurisdiction's data
plane; where it's national (FEMA, USFWS, USGS, USDA), one ingestion
serves all jurisdictions.

## Why it sits where it sits

**Codex 1b (city-side plan review) needs parcel context to differentiate.**

Codex 1b's value over generic AI plan review tools is surfacing
**relevant city history and constraints** alongside code-compliance
findings — "this parcel sits in the floodplain," "comparable projects
in this overlay district triggered a variance," "the aquifer zone
applies here." Without parcel context in the record, Codex 1b becomes
just code-compliance findings, which any plan-review AI can produce.

Parcel Intelligence is **the product that builds that context during
pre-application**, which is when the context naturally gets captured.
Plan Review then operates on the layer Parcel Intelligence laid down.

This is the argument for sequencing Parcel Intelligence ahead of Codex
1b activation (or alongside it as a coupled scope). See
[Open questions](#open-questions).

## Why Bastrop feels the value immediately

Independent of Codex 1b:

- **Reduces reliance on 3rd-party inspections.** Briefing narrows the
  scope of review to only what truly requires human verification.
- **Inspectors operate within a tightly defined framework** — they're
  not re-discovering site context for every parcel.
- **Faster review.** Pre-application briefing front-loads the
  constraint discovery.
- **Lower fees for the city.** Less external consultant spend on
  routine site-context work.

These are independently valuable — Parcel Intelligence has a standalone
ROI story even if Codex 1b never ships.

## What you'll notice

> A parcel search in the Operations Dashboard produces a structured
> briefing: flood exposure, drainage path, habitat, soils, infrastructure
> proximity, zoning, and precedent from comparable projects.

Optional pre-application input refines the briefing toward the proposed
use:

- "Single-family residential, 0.4 acres" → briefing prioritizes lot
  coverage, setbacks, septic suitability.
- Napkin sketch photo → briefing prioritizes orientation, slope cuts,
  setback envelope.
- Drawn outline on map → briefing prioritizes footprint vs constraint
  overlays.

## Engine + atom relationship

Parcel Intelligence is **a slice of the same engine** that powers
Cortex's parcel briefing for architects + engineers (per
[`27_engine_evolution_plan.md`](27_engine_evolution_plan.md) and
[`42_design_accelerator_program_plan.md`](42_design_accelerator_program_plan.md)),
**scoped at jurisdiction level**. Same atoms, different audience and
different surface:

- Cortex parcel briefing serves architects + engineers designing
  against the parcel.
- SmartCity OS Parcel Intelligence serves city staff evaluating the
  parcel.
- Codex 1b reviewer-side parcel intelligence (CDX-6 in
  [`48_codex_program_plan.md`](48_codex_program_plan.md)) is a third
  surface on the same engine layer, presenting parcel context to the
  reviewer during plan review.

One engine, one set of atoms, three audiences.

Likely atom types involved (subset of Codex/Cortex atom expansion in
[`27_engine_evolution_plan.md`](27_engine_evolution_plan.md) Stream B):

- `parcel-record` — anchoring atom for a parcel.
- `constraint-overlay` — FEMA / USFWS / TCEQ / zoning / etc. instances.
- `infrastructure-proximity` — water, sewer, road relationships.
- `permit-precedent` — comparable projects in the jurisdiction.
- `pre-application-input` — free text, photo, or sketch.
- `parcel-briefing` — composed output, deliverable atom.

## Dependencies

- **Hauska Engine + atom registry.** Same as Cortex / Codex. Engine
  work in [`27_engine_evolution_plan.md`](27_engine_evolution_plan.md)
  Streams A and B is upstream.
- **Bastrop GIS access.** Zoning, infrastructure, parcel cadastral
  layers must be reachable from SmartCity OS. Existing Operations
  Dashboard property intelligence already touches some of this; the
  surface area expands.
- **Bastrop permit + finding history.** Already in SmartCity OS
  (MyGov / OpenGov data). Atom-classification of historical records is
  net-new work.
- **National datasets.** FEMA / USFWS / USGS / USDA — all public; one
  ingestion serves every jurisdiction. Belongs alongside the Code
  Ingestion Pipeline (`49_code_ingestion_pipeline.md`, to be created)
  as a sister capability — same shape, different data type.
- **Code Ingestion Pipeline (Track B in [`11a_bastrop_live_roadmap.md`](11a_bastrop_live_roadmap.md))**
  — when zoning is loaded via the pipeline rather than one-off, Parcel
  Intelligence picks it up automatically.
- **M-Stabilize closeout** ([`30a_smartcity_stabilization_sprint.md`](30a_smartcity_stabilization_sprint.md))
  — multi-tenancy verified before Parcel Intelligence ships into
  SmartCity OS production.

## What's deliberately absent

- **Decision-making.** Parcel Intelligence produces a briefing; it
  doesn't approve, deny, or assign. Humans decide; the briefing
  informs.
- **Code-compliance findings.** That's Codex 1b's job. Parcel
  Intelligence supplies the context Codex draws on; it doesn't itself
  evaluate code compliance.
- **Real-time monitoring.** This is a pre-application briefing tool,
  not an IoT / telemetry surface.
- **Cross-jurisdictional comparison.** Each briefing is scoped at the
  jurisdiction level. Cross-jurisdictional precedent is a Codex GA-era
  feature ([`47_codex_plan_review.md`](47_codex_plan_review.md)
  fabric play).

## Open questions

- **Sequencing vs. Bastrop-live (Codex 1b).** Today
  [`11a_bastrop_live_roadmap.md`](11a_bastrop_live_roadmap.md) treats
  Parcel Intelligence as out of scope for "Bastrop live." But the
  "Why it sits where it sits" argument above suggests Codex 1b's
  differentiator depends on parcel context already being captured.
  Three options:
  1. Add Parcel Intelligence as a coupled scope to Bastrop-live (Codex
     ships with parcel context).
  2. Sequence Parcel Intelligence before Bastrop-live (parcel context
     captured first, Codex follows).
  3. Ship Codex 1b without parcel context (degraded differentiator)
     and add Parcel Intelligence after.
  Nick decides.
- **Pre-application input handling.** Photo / sketch / drawn outline
  → atoms is non-trivial. MVP scope: text only? Or all three from day
  one?
- **Permit + finding history atom-classification scope.** Bastrop has
  a deep history of MyGov / OpenGov records. Atom-classifying all of
  it is a corpus job; sampling vs. exhaustive is a decision.
- **TCEQ / state-specific layers.** Edwards Aquifer is TX-specific.
  When the second city is Jarrell or M9 (TX), this is reusable; for
  out-of-state, the state-specific layer set differs. Architecture
  needs to handle jurisdiction-keyed source sets.
- **Doc location.** Slot `46_` is in the 40-49 Design Accelerator +
  Revit Connector band, but the surface is SmartCity OS. Filename
  reflects the engine-substrate shared with DA. Could move to a 30-band
  slot when active development begins; tracked here for now.

## Relationship to existing docs

- [`11_roadmap.md`](11_roadmap.md) P2 "Bastrop property intelligence"
  resolves to this doc.
- [`11a_bastrop_live_roadmap.md`](11a_bastrop_live_roadmap.md) — see
  Open questions; sequencing relative to Bastrop-live is unresolved.
- [`48_codex_program_plan.md`](48_codex_program_plan.md) Phase 3 CDX-6
  "Parcel intelligence pull" — Codex 1b reviewer-side surface of the
  same capability.
- [`42_design_accelerator_program_plan.md`](42_design_accelerator_program_plan.md)
  Cortex parcel briefing — same engine slice, architect-side surface.
- [`27_engine_evolution_plan.md`](27_engine_evolution_plan.md) Streams
  A + B — engine work and atom expansion this depends on.
- [`30_smartcity_os.md`](30_smartcity_os.md) — Operations Dashboard
  product home; Parcel Intelligence is an extension of the existing
  property intelligence surface.
- [`07_product_line_summary.md`](07_product_line_summary.md) — product
  line context. Parcel Intelligence is a capability inside SmartCity OS,
  not a separate product on the line.
- **M-PropIntel** milestone in [`11_roadmap.md`](11_roadmap.md) — this
  capability is what M-PropIntel resolves to.

## Revision history

- **2026-05-11 (origin).** Drafted from commercial-deliverable framing
  ("Phase 2 — Parcel Intelligence" before AI Plan Review). Establishes
  Parcel Intelligence as an independent scoped capability with its
  own customer value, distinct from but coupled to Codex 1b. Open
  question on sequencing vs. Bastrop-live is the call to make next.
