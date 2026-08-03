---
id: 2026-08-03_SWEEP_deployed_final_state
title: FINAL STATE — full design sweep + coverage + serve-fix + guardrail all LIVE on PE prod
date: 2026-08-03
status: DEPLOYED + verified live — ready for operator re-QA
owner: nick
related: [REBRAND_SWEEP_full_design_consistency, 2026-08-03_PE_design_consistency_audit, 2026-08-03_BASTROP_CITY_GATE_C_reached]
---

# FINAL STATE — everything live on PE prod (property-explorer-xi.vercel.app)

Deployed from `rebrand/design-sweep` (52611070 + the api-narrowing commits). The prior 4 "failed" CLI deploys actually SUCCEEDED (exit 255 was the non-blocking api typecheck; the app shipped — see memory vercel-cli-exit-code-vs-deployment-state). Live-verified:

## DATA (the factory output, serving correctly)
- 34137 (SF-1): source atom-chain, envelope ok, setbacks F25/S5/R25/corner15.
- 141364 (superseded): source atom-chain, declined, declineReason superseded-prop-id (the named honest decline — the whole R6-gate saga, resolved).
- GC/MU/RR spot-checks: atom-chain ok. Full Bastrop-city coverage (Phase D layer-23 cohort) serving.
- retrieval R27 fix live; PE serve-fix (mapWarmVerifyDecline) + 503-on-401 guardrail deployed.

## BRANDING / DESIGN SYSTEM (the sweep — all ~11 surfaces now token-compliant)
- BLUE #3B82F6 primary/interactive (was cyan #7dd3fc in 15 files → 0); GOLD brand+hero only (fewer heavy gold buttons per operator).
- Honest-absence → slate #7C8BA0 (in the CSS asset index-*.css, NOT index.js — a var); title "Empressa"→"Smart Site"; MUTED single value; #text-body token; atom chips teal.
- Oxygen dropped to system-ui (no inlinable font, CSP-safe; it never rendered anyway).
- CARTO badge moved bottom-left→bottom-right; MapSourceInfo ⓘ moved beside (left of) the layers bubble.
- Default layers: aerial/satellite ON + all layers ON EXCEPT zoning/land-use (operator's better-first-impression).

## KNOWN / FLAGGED (not blockers — for a later pass)
- Chat citations: UPSTREAM (Cortex research/chat doesn't return citations arrays; PE renders them when present). Route to Cortex/backend planner. NOT a PE fix.
- Hydrology/flood water palette: separate map-renderer CONTEXT teal (cross-package) — left as a design decision (reconcile-vs-deliberately-muted).
- ChatTool's 17 native buttons: color/radius-compliant but not structurally migrated to <Button> (would break dense layout + ~903 test data-testid hooks) — flagged, deferred.
- Button component has only a gold primary variant; blue dense-CTAs styled inline. A blue-primary Button variant is a clean follow-up.
- The superseded-prop-id cohort (58/4479 = 1.3% city-wide) honest-declines with a NAMED reason (correct). R15 successor re-key = tracked follow-up.

## NEXT
Operator re-QA on the complete live state. Then: PR #213 merge decision (retrieval/Phase D window); the flagged follow-ups (chat citations upstream, blue Button variant, hydro decision, ChatTool button migration) as a future polish pass; Bastrop county + Elgin + Smithville (the generalization test) built on the onboard(fips)/registry-cohort foundation Phase D laid.

## UPDATE — blue buttons + one-attribution-place DEPLOYED (rebrand/blue-buttons @ efc5f31)
Two operator-flagged fixes landed + live-verified on prod (deploy exit-255 was the non-blocking api typecheck; alias went Ready — checked live, not the exit code):
- ZERO GOLD BUTTONS: Button component reworked to blue-primary (all variants blue/neutral); gold #E8963B now survives ONLY on the SmartSite crosshair mark + SITE wordmark + the PDF print doc. Live bundle: 1 gold ref (the mark), brand-blue button fills present. Operator's "no gold buttons" ratified + shipped.
- ONE ATTRIBUTION PLACE: the doubled/piled bottom-right attribution fixed. MapLibre AttributionControl now GATED (options.suppressAttributionControl) — PE suppresses it + folds the REQUIRED credits (© OSM © CARTO + the exact SATELLITE_ATTRIBUTION Esri line) into the MapSourceInfo ⓘ "Sources" panel. CC's LiveMapTile does NOT suppress (keeps the control for its required credit) — no CC regression (14/14). Bottom-right now = ⓘ + layers bubbles only, no floating strip. No credit dropped.
Data intact (34137 atom-chain ok). This is the current live prod. Cross-package handled (gated not deleted). Pre-existing CC tsc errors (jest-dom types) confirmed not introduced.
