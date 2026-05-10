---
id: 06_cities_value_narrative
title: Cities value narrative — what plan review modernization means for a city manager
status: active
last_updated: 2026-05-10
applies_to: portfolio
related: [05_living_lineage_thesis, 30_smartcity_os, 47_codex_plan_review, 14_pricing_framework]
owner: nick
---

# Cities value narrative

> **Audience.** City managers, planning directors, and elected officials evaluating modern plan review options. Written for the Sylvia / Bastrop / Jarrell type of conversation specifically. Not marketing copy — operational framing the city's leadership can use to evaluate whether modernizing plan review is worth the displacement cost.

## The shape of the problem

Most cities review building plans the way they did in 2005. Plans arrive as PDFs (sometimes paper); reviewers mark them up in Bluebeam (or Adobe, or with a pen); findings go into comment letters that sit in email; the city's operational systems get the *outcome* (a permit decision) but not the *substance* (which findings, against which code, with what reasoning).

This works, after a fashion. It also leaves a city's most information-dense regulatory function — the function where institutional knowledge is created — almost completely outside its operational data. When a property comes back for permit renewal fifteen years later, the city has a permit number and possibly a PDF. The reasoning is gone.

The cost of this gap shows up in three places:

1. **Reviewer turnover resets institutional knowledge.** A senior plans examiner retires and twenty years of judgment leaves with them. The next reviewer rebuilds from scratch.
2. **Decision context is locked in PDFs.** When the city wants to ask a portfolio question — "which projects in the floodway have we approved variances for?" — the answer requires manual review of years of files.
3. **Cross-jurisdictional learning is impossible.** Bastrop's experience with a tricky drainage interpretation can't help Jarrell. Each city solves the same problems independently.

## What changes

The fabric we're building integrates plan review into the city's operational substrate. Reviewer findings stop being PDF artifacts and become structured records in the same data graph the city's other operations run on. Three concrete things flip.

### 1. Reviewer experience matches operational reality

If your reviewers are city employees, they get an intelligence layer that pulls relevant code sections, parcel context, and similar past findings into every review automatically. Junior reviewers operate at senior reviewer effectiveness on day one — not because the AI replaces judgment, but because it surfaces the context a junior would otherwise spend hours collecting.

If your city outsources plan review (to a SAFEbuilt-class contractor firm), the firm uses the same intelligence layer in its own preferred tools — Bluebeam, Acrobat, ProjectDox. The city doesn't change vendors or workflows. The firm's outputs become *better*, with findings that are atomized rather than buried in PDF markups, and those atomized findings flow back into the city's operations automatically.

Either way, reviewer findings feed your city's data. Not after the fact, not via manual data entry, not as PDF attachments. Natively.

### 2. Findings become operational data

Every finding produced during plan review is a structured atom in your city's data graph. Severity, code section, location on plan, reviewer adjudication, decision rationale — all queryable.

This unlocks operational questions that today require staff hours to answer:

- "How many drainage variances have we issued in the last five years, and where are they concentrated?"
- "If we get four inches of rain, which approved projects in the floodplain might have inadequate detention?"
- "What's our most common reviewer finding by code section, and is it a code-clarity problem or a recurring design pattern?"

These aren't reporting features bolted on after the fact. They fall out of the data shape. Compass V4 (the AI surface across SmartCity OS) reasons over the same atom graph, so a city manager can ask these questions in natural language.

### 3. Property records compound across decades

Properties sell. Reviewers turn over. Software vendors come and go. The atom-level lineage stays.

When a development comes back for permit renewal in fifteen years, the city has a complete record: which plans were reviewed, by whom, against which code edition, with what findings, with what adjudications, with what permit conditions. The reasoning isn't reconstructed from email and PDFs. It's queryable.

When a property changes ownership, the lineage transfers with the property. Owner #3 in 2041 sees the same record owner #1 created in 2026 — the property is the durable thing, not the software that touches it.

This isn't backup or archival. It's a structurally different relationship between cities and the records they generate.

## How this fits with what Bastrop already has

Bastrop is already operating on the fabric for SmartCity OS operations. Plan review modernization is the next surface to populate, not a separate system to integrate.

What this means concretely:

- **Today**: SmartCity OS runs Bastrop's operational dashboards, permit workflow, integrations with city systems, and the Compass AI surface.
- **Next**: Codex (the plan review surface) ships into the same SmartCity OS deployment for reviewers to use directly, OR is used by the firm Bastrop chooses if Bastrop ever moves to an outsourced model. Either way, plan review findings flow into the same atom graph.
- **After**: The architect side — Design Accelerator — ships for architects designing for Bastrop. Architect-side context (parcel briefings, neighboring context, BIM models) flows into Bastrop's atom graph at submittal time, so reviews inherit context the city already has on the parcel.
- **Eventually**: Inspectors and contractors get their own surfaces, also feeding the same graph.

The investment compounds. Adding Codex doesn't replace SmartCity OS — it extends it. Findings that today live nowhere operational become first-class data Sylvia can query, dashboards can aggregate, and Compass can reason over.

## City-to-city knowledge sharing

A specific feature worth naming: when Jarrell joins the platform (or any future city), Bastrop's plan review history becomes available as jurisdictional precedent that Jarrell's reviewers can query, with appropriate privacy controls.

Not "Bastrop's data flows to Jarrell." Bastrop owns Bastrop's data; Jarrell owns Jarrell's. But a Jarrell reviewer can ask "how have similar jurisdictions handled this kind of interpretation?" and get aggregate guidance — anonymized at the property level, queryable at the pattern level.

This is impossible without a shared substrate. Two cities on two unrelated software platforms cannot do this; two cities on the same atom-graph fabric can.

The downstream version: when Bastrop, Jarrell, and the next five cities are all on the fabric, the platform itself becomes a learning system for municipal plan review craft. Every additional city makes every existing city's reviewers more effective.

## What adoption requires

Honest framing of the displacement cost:

- **In-house review path.** Reviewers learn a new interface (modest — the AI surfaces; the rest is similar to existing tools). The city needs to commit to feeding its code corpus into the platform (one-time onboarding, ongoing as amendments happen).
- **Outsourced review path.** The chosen firm needs to use Codex 1a (invited participant) in their existing tooling. This is a firm-side adoption decision, not a city-side one, but the city benefits.
- **Either path.** SmartCity OS deployment continues as it does today. Plan review surfaces are additive.

Adoption is reversible. The atom-level lineage is portable — the contract is open enough that data can leave the platform if needed. The lock-in we offer is the value of having the data structured in the first place, not the platform's ability to hold it hostage.

## Pricing — directional

Pricing for the city-direct standalone surface (Codex 1b) sits inside the existing SmartCity OS commercial relationship. Cities already on SmartCity OS extend their existing contract to include plan review surface; new cities buy the integrated package. Detailed pricing in [`14_pricing_framework.md`](14_pricing_framework.md).

The contractor-firm pathway (Codex 1a invited mode) is a separate commercial product sold to firms; cities benefit indirectly when they outsource to a Codex-enabled firm. No direct city pricing on this path.

## What's available to demo today vs what's near-term

- **Today**: SmartCity OS in production at Bastrop. Compass V4 reasoning over operational atoms. Atom-graph foundation proven at production scale.
- **Near-term**: Codex 1b standalone in the SmartCity OS Plan Review surface. First-cut engine pass against Bastrop's code corpus on real submittals. Findings flowing into SmartCity OS dashboards.
- **6-12 months**: Codex 1a invited mode for contractor firms; cross-jurisdictional precedent queries; comprehensive audit trail; architect-side Design Accelerator integration.
- **18+ months**: Inspector surface; owner surface; full lifecycle fabric.

## Cross-references

- [`05_living_lineage_thesis.md`](05_living_lineage_thesis.md) — strategic foundation underneath this narrative
- [`30_smartcity_os.md`](30_smartcity_os.md) — current SmartCity OS product, what's already deployed at Bastrop
- [`47_codex_plan_review.md`](47_codex_plan_review.md) — the plan review product that delivers what's described here
- [`14_pricing_framework.md`](14_pricing_framework.md) — commercial framework for cities

## Revision history

- **2026-05-10 (origin):** drafted as part of plan review product framing work session. Audience-targeted at city manager / planning director conversations. Companion to living lineage thesis.
