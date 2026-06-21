---
id: endstate_D_reporting_surface
title: End-state D — reporting surface with embedded map visualizations
status: active
last_updated: 2026-06-21
applies_to: hauska
owner: nick
related: [calibrated_spine_task_roadmap, endstate_B_warm_report_ready, endstate_C_white_label_map]
---

# End-state D: reporting surface

## Definition of done

Every report type emits through the read-contract (three axes, widthed, sourced) and most carry an embedded map visualization composed per consuming app from the same registry as End-state C. Warming and reporting are two mount contexts on one pipeline: a report is the cascade rendered for a present user, warming is the same cascade rendered to cache. The embedded map is the decoupled renderer in a static (non-floating) mount, not a second renderer.

## Tasks

R1 report-rendering contract (composed atoms plus reasoning plus lay summary plus embedded map allocation plus read-contract on every claim), R2 unify warming and reporting on one pipeline, R3 now-buildable map-embedded reports, R4 fuel and credential-gated report maps, R5 planned-corpus reports, R6 per-report per-app layer allocation.

## Report-to-map-layer binding

Now-buildable (R3): Property Brief (parcel, zoning, flood, consequence choropleth, triage, contested-ground); site-context report (flood, topography and contours, EJ, parcel); hydrology report (D8 drainage, flood-depth overlay, contours, contested-ground versus FEMA); Codex plan review (site-context locator, zoning and setback overlay, finding pins; comment letter embeds the site map); Cortex L1 to L6 deliverables (site-context map where site-bound); Radar (national baseline map, area heat).

Fuel and credential-gated (R4): Cotality property intelligence (comps, risk choropleth, rent-heat); Radar Cotality property layers; hydrology Cotality forcing; the calibrated-accuracy surface on any report.

Planned-corpus (R5): subsurface report (SSURGO soils choropleth, geology, groundwater); precedence-engine output (jurisdiction-boundary overlay showing which standard governs where); plan-set decomposition (document and sheet centric, at most a site locator).

## Acceptance criteria

- Every report emits its claims through the read-contract object; no report can display a bare confidence number.
- Most reports embed a map; the embedded map uses the same renderer and registry as the floating map, in a static mount.
- The same report embedded in different apps is allocated different layers via the V3 registry (a Radar brief and a SmartCity brief share a pipeline, not a layer set).
- Embedded report maps inherit the uncertainty-width styling and the do-not-render-calibrated-as-earned rule for free from the read-contract, with no per-report work.
- Warming and reporting run on one pipeline; a warmed property renders its report instantly, and a report generated on demand for a cold property warms it as a side effect.

## Reports back

R closes to `_inbox/` with the report-to-layer binding as built, the per-app allocation schema, and which report maps are live versus fuel-gated.
