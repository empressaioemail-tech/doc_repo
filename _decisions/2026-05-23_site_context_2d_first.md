---
decision_id: 2026-05-23_site_context_2d_first
date: 2026-05-23
owner: Nick
status: active
related_canonical: [40_design_accelerator, 40d_cortex_site_context_sprint, 42_design_accelerator_program_plan, 43_cortex_qa_backlog, 46_smartcity_parcel_intelligence, 28_mcp_first_product_design, 11_roadmap]
---

## Decision

Reorder the deferred 3D-site-assembly capability (cc-agent-C Phase 1
P0-3 flag) into a 2D-first site-context sprint, scoped in
[`40d_cortex_site_context_sprint.md`](../40d_cortex_site_context_sprint.md).
The 3D site assembly becomes a follow-on visual layer, not a fold-in,
queued behind the 2D scope.

Phase 3 features (QA-27 link-drop intake, QA-28 deliverable letter,
QA-29 client presentations) yield until the 2D site-context sprint
closes. They remain dispatch-ready in
[`_dispatches/2026-05-22_cc-agent-C_cortex_qa_build.md`](../_dispatches/2026-05-22_cc-agent-C_cortex_qa_build.md)
Phase 3 and fire after.

Execution order on cc-agent-C, sequential:

1. Cleanup batch — QA-33 (BIM viewport renders empty despite 101
   elements) + QA-22 reopen (four of five Grand County / federal
   layers still failing after PR #76's 45s floor). Small, fast, closes
   the customer-zero loop gaps surfaced in the 2026-05-23 operator
   verify. QA-34 tabled, not in scope.
2. 2D site context sprint — `40d_cortex_site_context_sprint.md`, four
   phases (DEM ingest + topo overlay; hydrology / drainage analysis;
   rainfall simulation UI + briefing integration;
   address-to-parcel auto-resolve polish).
3. Phase 3 features — QA-27 / QA-28 / QA-29 per the existing dispatch.

## Context

The 2026-05-22 cc-agent-C Phase 1 diagnosis flagged P0-3 as a missing
capability rather than a Phase 1 bug: no code assembles terrain +
parcel + building into a georeferenced scene; `ugrc:dem` returns
contour attributes rather than a terrain mesh; no
hydrology / runoff / rainfall code exists anywhere. The original
recommendation was to scope it as its own roadmap line.

The 2026-05-23 operator QA verify on the cleanly-deployed
`cortex-api-00019-bxf` (carrying QA-32 fix + LLM-mode live)
re-surfaced the same gap with operator framing: the architect needs
the Site tab to actually be useful before more features are layered on
top. The architect cares first about a working parcel-intelligence
story (what does this parcel support, what flood / drainage / topo
constraints apply, what's the briefing) and second about presentation
of that story in 3D.

The operator reordering: prioritize 2D site context completeness +
drainage analysis on the 2D map first; 3D becomes a follow-on visual
layer once the analytical substrate is real.

## Structural commitment check

Pre-mortem run 2026-05-23, cleared **green**. Three load-bearing
commitments all clean: site-topography + site-drainage atoms carry
full provenance (DEM raster ref, hydrology lib + version + seed,
rainfall input parameters, AI-origin / computed-origin marker per
ADR-001); USGS 3DEP is federal public-domain national data, not a
jurisdictional licensor, so partnership-first does not apply;
per-engagement DEM clip + flow-accumulation calc is product COGS, not
jurisdiction-onboarding cost, and falls well within product-COGS norms
(~1-5 dollars compute estimate per engagement).

Two operational yellows, both absorbable per operator standing
framing:

- Dual interface (commitment 4) — this builds UI-first on Cortex
  (existing UI-first product), with `cortex/site_context_*` MCP
  retrofit recorded as a tracked follow-on on doc 42's watch line per
  [`28_mcp_first_product_design.md`](../28_mcp_first_product_design.md).
  Same pattern as Renders (`cortex/render_*`) and the rest of Cortex.
- Hauska spine rule (rule 5) — this is Cortex product, not Hauska
  substrate. But site-context atoms ARE substrate-adjacent (parcel
  data, federal overlays, jurisdiction-local zoning), and drainage
  analysis feeds findings which feed deliverables. Parcel intelligence
  is a sanctioned Empressa product surface per
  [`46_smartcity_parcel_intelligence.md`](../46_smartcity_parcel_intelligence.md);
  the Cortex-side 2D site context is the architect-facing analog.

Focus-queue (rule 6) is green: Phase 3 features explicitly yield until
2D-site-context closes, and the cleanup batch runs first regardless.
Quality-gate (rule 7) is green: drainage findings cite back to
site-topography + site-drainage source atoms with full reasoning
chains.

Catalog-thesis-check 2026-05-23, passes. Site-topography and
site-drainage are Cortex tenant-private workflow atoms (`accessPolicy:
tenant-private` per ADR-017), not Layer 1 or Layer 2 catalog atoms, so
no tier inversion. USGS 3DEP raster is a vendor / source dependency
(public-domain federal data, no commercial exposure). UI-first is
correct for the existing UI-first product; the
`cortex/site_context_*` MCP retrofit is a tracked follow-on, not a
blocker.

## Reasoning

**Lower engineering cost.** Skips the terrain-mesh build, the
georeferenced scene-assembly stage, and the Three.js viewer extension.
Hydrology is the hard part either way; doing it in 2D first defers
the 3D rendering work without losing the analytical value.

**Customer-zero usable sooner.** Architects can act on a 2D
flood / drainage overlay + a real briefing today. The 3D viewer is
presentation polish; it does not change the reasoning the architect
makes.

**Honest scope.** Calling 3D-site-assembly a follow-on rather than a
Phase 1 fold-in matches reality. The work is real and deserves its
own line, not a quietly-extended QA sprint.

**Sequencing the cleanup batch first.** QA-33 (BIM viewport empty
despite 101 elements) and QA-22 reopen (4 of 5 layers still failing
after PR #76) are small, surgical, and close the customer-zero loop
gaps surfaced in the same operator verify. They land before the
larger sprint to keep the loop verifiable while 2D-site-context is in
flight.

**Phase 3 features deferred, not killed.** QA-27 / QA-28 / QA-29 are
scoped, premortem-cleared, and dispatch-ready. They build on top of
the engagement state — link-drop intake creates engagements; letter
generation produces deliverables off engagement findings; presentation
packets bundle the engagement's outputs. Doing them before the Site
tab is actually useful would put intake / letter / presentation tools
on top of a half-blank parcel-intelligence story — backwards.

## Reversal criteria

Revisit the 2D-first reordering if the hydrology library integration
proves significantly harder than scoped (more than a small sprint —
multiple integration weeks), in which case the call shifts to: ship
Phase 3 features first while the 2D site-context sprint continues in
parallel. Revisit the Phase 3 deferral if the operator surfaces named
customer demand for link-drop / letter / presentation that overrides
the 2D-site-context priority. Revisit the 3D-as-follow-on framing if
external pilot firms specifically demand the 3D presentation layer
before the 2D analytical substrate is complete (unlikely given the
architect ICP).

## Dependencies

The sprint is one phased dispatch to cc-agent-C, queued behind the
cleanup batch. New canonical doc
[`40d_cortex_site_context_sprint.md`](../40d_cortex_site_context_sprint.md)
spec'd. Atom registry impact: two new tenant-private atom types
(`site-topography`, `site-drainage`) under
[`@hauska-engine/atoms`](../27_engine_evolution_plan.md) Stream B,
following the L1-L6 + render-output pattern. Doc 42 DA-12-style watch
line entry for the `cortex/site_context_*` MCP retrofit follow-on.

External vendor / source dependencies: USGS 3DEP (federal,
public-domain, stable); hydrology library choice (whitebox-tools Rust
binding or richdem — cc-agent-C verifies + picks during Phase 2D.2).
No partnership commitments required.

## Counterparties

Internal. Adds 2D-site-context to cc-agent-C's legacy-design-tools
queue, sequential behind the cleanup batch and ahead of Phase 3
features. Affects the M-CortexQA milestone path: pushes Phase 3
shipping later, advances customer-zero parcel-intelligence
completeness sooner.

USGS 3DEP is a federal national dataset, public domain. mnml.ai
(rendering vendor) is unrelated to this scope. No third-party
commercial commitments.
