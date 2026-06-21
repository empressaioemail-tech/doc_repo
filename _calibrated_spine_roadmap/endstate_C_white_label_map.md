---
id: endstate_C_white_label_map
title: End-state C — white-label configurable map
status: active
last_updated: 2026-06-21
applies_to: hauska
owner: nick
related: [calibrated_spine_task_roadmap, endstate_D_reporting_surface, endstate_E_spine_console, calibration_architecture_addendum]
---

# End-state C: white-label, configurable, pluggable map

## Definition of done

One decoupled map renderer, a floating window manager, a dynamic layer registry, and a per-app allocation config, so the same map plugs into Cortex, Radar, the Brief extension, and SmartCity OS with a different set of layers and features allocated to each. The renderer knows nothing about windows; the window manager knows nothing about tiles. They communicate through a thin contract: mount slot, resize signal, layer-visibility set, context binding. Chris owns the visual design; the agents own the function.

## Tasks

V1 decoupled renderer (thin contract), V2 floating window manager (FSM: floating, snapped, minimized, maximized, closed; drag, edge-snap, resize, hover chrome; each transition preserves the geometry of the state it leaves), V3 dynamic layer registry plus per-app allocation config, V4 EngineEnvelope read-contract consumption, V5 now-buildable reasoning layers (consequence choropleth, width-as-uncertainty saturation, contested-ground overlay, triage state), V6 fuel-gated calibrated-accuracy layer, V7 development-pulse layer, V8 vintage-decay rendering, V9 positioning fix.

## Acceptance criteria

- The renderer mounts into a single content slot and is reused, not re-initialized, across every window-state transition and across both the floating overlay and the embedded report slot (End-state D). Map view state (center, zoom, active layers) is preserved across every transition.
- The window manager is a finite state machine in exactly one of floating, snapped, minimized, maximized, closed; transitions preserve the geometry of the state being left so moves are reversible.
- The map advertises its available layers and features as a registry; a per-app entitlement config controls which the consuming surface receives when it plugs in. The same report or surface can be allocated different layers in different apps.
- The map consumes the read-contract object on every layer, so a dishonest scalar fill is physically unrenderable. Interval width is encoded as saturation: earned tight-interval layers fully saturated, thin wide-interval layers muted or textured.
- The contested-ground overlay renders where layers disagree, with the hydrology D8-versus-FEMA case as the headline.
- Clicking a parcel opens its full info and supports click-through tracing of every atom behind it: from the parcel to its composed atoms, each atom's context summary, provenance, citations, and cross-references, down to the source atom, with no display limit on the operator surface.
- The triage state renders parcels that are thin on accuracy and high on consequence as verify or human-required.
- The calibrated-accuracy layer renders asserted-with-provenance until Measurement A shows regional thickening, then lights region by region. It never renders a saturated calibrated fill where thickening has not been shown.
- The footer and every map surface use the shows-its-work, built-to-earn-calibration language, not the calibrated-source line.

## Interface with Chris's design

The function is built to the thin contract regardless of styling. Chris's design plugs into the renderer's mount and the registry's layer list; the function does not block on, and is not blocked by, the visual pass. The spine console (End-state E) is the all-white function-only surface that exercises every layer and feature before styling lands.

## Reports back

V closes to `_inbox/` with the contract surface (the four signals), the registry's current layer list, the per-app allocation schema, and which reasoning layers are live versus fuel-gated.
