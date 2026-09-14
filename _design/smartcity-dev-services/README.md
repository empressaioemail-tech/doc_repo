# SmartCity Development services lens

**Artifact:** https://claude.ai/code/artifact/1ed0733e-e10c-4ec6-948e-66d2b24e562e
**Decision:** pending operator ratification
**Status:** IN REVIEW, 2026-09-14
**Source:** v1 capture `SmartCity OS Screenshots (1).pdf`, 18 pages, read frame by frame.

This is the DENSEST lens, so it is where the lens pattern gets fixed. Fourteen of fifteen v2
destinations inherit it. Three artboards: Pipeline (default tab), Work orders (the hard case:
load strip, view modes, pagination, PII), and an empty pack.

## The moves

- **Three tiers, not two walls.** v1 stacks six lens tiles plus five tab metrics before content.
  Tier 1 attention row (entry points, primary), tier 2 tab strip with inline counts, tier 3
  compact tab metric strip (secondary, no cards).
- **One table treatment.** v1's Code enforcement table is the most scannable view in the app;
  everything else is stacked rich rows. The table wins and every tab inherits it.
- **The free-text description is not a list column.** See PII below.
- **One load pattern.** Inspector / Manager / Officer load are one component, not three panels.
- **Service performance is a view mode** (List / Map / Performance), not a stray button.
- **Plan review is a named tab and a separate scope** (operator ruling 2026-09-14).

## PII — read this before implementing

v1 work-order and licence free-text fields carry **citizen names and personal phone numbers**,
verbatim from the capture: `DEBORAH MOORE, PH#737-762-6252`, `CONTACT LISA BOE - CONTACT#:
504-401-1765`, `REBECCA GARNER-LOZOYA - CONTACT#: 916-620-8091`. Code-enforcement rows carry
officer names and complaint addresses.

The design answers this by not rendering the description in a scannable list at all. That is
a design decision and **not a control**. The field still needs a real gate before any surface
renders it, and none of it may reach a public parcel rail.

## Carved out, deliberately

Plan review (its own design, next session). The Place tab's map (shares G-121's pinned work).

## Regenerate

    node gen.mjs
