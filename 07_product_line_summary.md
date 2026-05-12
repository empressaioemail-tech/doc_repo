---
id: 07_product_line_summary
title: Empressa product line — bizops handoff summary
status: active
last_updated: 2026-05-11
applies_to: portfolio
related: [05_living_lineage_thesis, 06_cities_value_narrative, 30_smartcity_os, 40_design_accelerator, 41_revit_connector, 47_codex_plan_review]
owner: nick
---

# Empressa product line

> **Purpose.** Standalone bizops-ready summary of the product line and value
> propositions. Describes the products themselves, not implementation state.
> Companion to [`05_living_lineage_thesis.md`](05_living_lineage_thesis.md)
> (strategic foundation) and [`06_cities_value_narrative.md`](06_cities_value_narrative.md)
> (cities-facing narrative); current build/ship status lives in
> [`00_current_state.md`](00_current_state.md) and [`11_roadmap.md`](11_roadmap.md).

## SmartCity OS

**For:** City managers, department heads, planners, inspectors.

**Value:** One operational platform to run a city — with jurisdiction-aware
intelligence about properties, codes, submittals, and infrastructure built
in. Replaces the patchwork of GIS + permit software + spreadsheets + email
that most cities live in.

## Cortex

**For:** Architects and engineers.

**Value:** AI-assisted design where the jurisdiction's actual code is a
live partner. Compliance is checked incrementally as you design, not as a
gate at the end. Outputs are structured (classified atoms), so every
recommendation traces back to a specific code section — not free-form chat.

## Codex

Plan review intelligence, two surfaces:

### Codex 1b — city-side

**For:** Plan reviewers inside cities.

**Value:** Real plan-review findings against the city's adopted code. Each
finding cites a real section, can be accepted / edited / rejected, and
rolls into a structured comment letter. The reviewer's existing workflow,
accelerated.

### Codex 1a — contractor-side

**For:** Design firms and contractors before submission.

**Value:** Run the same review the city will run — before you submit.
Catch what the reviewer would catch, fix it, submit clean. Reduces
resubmission cycles.

## Revit Connector

**For:** Architects and engineers already working in Revit.

**Value:** Cortex's intelligence inside the tool they already use. Atoms
flow back into Revit, not as a separate window to switch into.

## Hauska Engine

**For:** Internal product use today; external developers + PropTech
partners on the roadmap.

**Value:** Jurisdiction-aware code reasoning, surfaced through atoms —
structured, traceable intelligence units. The engine under Cortex and
Codex. As a published SDK it lets third-party PropTech products embed
jurisdiction-aware reasoning rather than building their own corpus +
retrieval + atom layer.

## Code Ingestion Pipeline

**For:** Internal capability — feeds Cortex, Codex, SmartCity OS.

**Value:** Any municipal code in, queryable atomized corpus out. The
capability that makes onboarding the next city cheap. Without it, every
new jurisdiction is a custom project; with it, every new jurisdiction is
a pipeline run.

## Connecting narrative

Cities, architects, engineers, contractors, and reviewers all touch the
same artifact: a project against a jurisdiction's code. Today they each
work in disconnected tools. Empressa's product line is one engine —
Hauska — surfaced at every role:

- **SmartCity OS** is the city's seat at the table.
- **Cortex** is the architect's and engineer's seat.
- **Codex** is the reviewer's seat (1b) and the contractor's self-check (1a).
- **Revit Connector** is the bridge from the designer's existing tool.
- **Hauska Engine** is the shared intelligence underneath every product.
- **Code Ingestion Pipeline** is what makes the engine work for every
  jurisdiction, not just the first.

Brand pattern: products are branded forward (SmartCity OS, Cortex, Codex);
the engine is acknowledged as the substrate — "Powered by Hauska Engine."

## References

- [`05_living_lineage_thesis.md`](05_living_lineage_thesis.md) — strategic
  foundation
- [`06_cities_value_narrative.md`](06_cities_value_narrative.md) — cities-facing
  application
- [`30_smartcity_os.md`](30_smartcity_os.md) — SmartCity OS product home
- [`40_design_accelerator.md`](40_design_accelerator.md) — Cortex product home
- [`41_revit_connector.md`](41_revit_connector.md) — Revit Connector home
- [`47_codex_plan_review.md`](47_codex_plan_review.md) — Codex product home
- [`80_adrs/adr_008_engine_factor_out.md`](80_adrs/adr_008_engine_factor_out.md)
  — Hauska Engine factor-out and "powered by" brand pattern
