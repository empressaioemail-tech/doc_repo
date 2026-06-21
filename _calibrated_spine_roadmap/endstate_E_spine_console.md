---
id: endstate_E_spine_console
title: End-state E — spine console (operator localhost dashboard)
status: active
last_updated: 2026-06-21
applies_to: hauska
owner: nick
related: [calibrated_spine_task_roadmap, endstate_C_white_label_map, endstate_B_warm_report_ready, calibration_architecture_addendum]
---

# End-state E: spine console

## Definition of done

A function-only operator dashboard that lives on the map app's localhost, all white, no design, built purely for visibility and control of the spine. It gives full operator visibility into the MCP surface, all atoms, all map layers, and the calibration state of every property, so the operator can confirm that every property has been calibrated (to base level via backtest, then live over time). Layout: a left rail for files and artifacts, a right rail showing the styling legend for everything represented on the map, and the floating map over everything, behaving exactly as the floating viewer in End-state C. This is the operator's spine management surface and it doubles as the function-only proving ground for the white-label map before Chris's styling lands.

## Layout

Left rail: files and artifacts (atom files, layer config, report templates, acquisition datasets, run logs). Browse and inspect.

Right rail: the styling legend. For every layer represented on the map, show its styling and what it encodes: consequence choropleth colors, width-as-uncertainty saturation, the contested-ground overlay, the triage state, calibration-provenance shading (asserted, backtest, seed, live), vintage decay. The legend is the human-readable key to the read-contract made visual.

Center and floating: the map, floating over everything, full window-state behavior from End-state C (float, snap, minimize, maximize), preserving view state across transitions.

## Visibility surfaces (tasks)

- E1 MCP inspector. List and inspect all MCP tools (the 46-tool surface), their product gating, and live call results. Full visibility into what the agent-facing surface exposes.
- E2 Atom browser. Browse and inspect all atoms across families (code-section, cross-reference, edition, amendment, encumbrances, workspace, reasoning), with their context summary, provenance, and read-contract confidence object (n, width, provenance), never a bare number.
- E3 Layer registry view. Every map layer the registry advertises, its allocation per app, live or fuel-gated status, and its styling (mirrored in the right-rail legend).
- E4 Calibration tracker. Per-property calibration state: warmed or not, calibration provenance (asserted, backtest, seed, live), n and width, and whether it has reached base calibration. This is the surface that answers has every property been calibrated. Filter and sort by jurisdiction, consequence stratum, and provenance; surface the uncalibrated and the thin-high-consequence sets directly.
- E5 Run monitor. The warming-and-QA run state: parcels warmed, coverage holes, adapter failures, contested-ground and triage counts, and running compute cost against budget.
- E6 Floating map host. The End-state C renderer and window manager hosting the layers, with the left files rail and right legend rail around it.
- E7 Parcel drill-through and atom trace. Clicking a parcel opens all of its info and lets the operator click through and trace every atom behind it: parcel to its composed atoms, each atom's context summary, provenance, read-contract confidence (n, width, provenance), citations, and cross-references, down to the source atom, traversing the cross-reference graph with no display limit on the operator surface. This is full atom visibility from the map, the operator-grade version of the atom drill-in.

## Acceptance criteria

- All white, function over form; no design dependency on Chris's pass.
- The operator can see, in one place, the MCP surface, any atom, every map layer and its styling, and the calibration state of every property.
- The calibration tracker makes the uncalibrated set and the thin-high-consequence set one click away, and never shows a confidence number without its width and provenance.
- The map floats over everything with full window-state behavior and preserved view state.
- The right-rail legend stays in sync with the layer registry: a layer added to the registry appears in the legend with its styling and what it encodes.

## Owner

map agent (function). Reuses End-state C renderer, registry, and window manager, and the read APIs for the calibration overlay, the atom store, and MCP introspection. No design work; Chris's styling can plug in later without changing function.

## Reports back

E closes to `_inbox/` with the live visibility surfaces, the calibration-tracker coverage numbers (properties at each provenance level), and any spine state the console surfaced that the roadmap did not anticipate.
