---
id: 2026-08-01_PE_ui_polish_qa_batch
title: PE UI polish — operator QA batch 2026-08-01 (3 fleets dispatched + mobile held)
date: 2026-08-01
status: in-progress (3 fleets running; mobile HELD as own pass)
owner: nick
related: [40_hauska_map_3d_implementation_brief, 2026-07-31_smart_site_smart_city_positioning]
purpose: Track the operator UI-polish QA batch. 3 parallel fleets dispatched (quick-paint+rename, report-UX+citations+cleanup, subjectResolveCleanup bug); mobile is its own held workstream.
---

# PE UI polish — QA batch 2026-08-01

Operator QA pass on live PE (property-explorer-xi). Planner fanned 3 parallel fleets + held mobile.

## FLEET 1 — quick UI paint + X-ray rename (hauska-map, dispatched)
1. REMOVE 3D-terrain toggle from layer list (3D push PAUSED — doc 40; `dem-hillshade` key in consumer-layers.ts). Underlying terrain code stays (banked); only hide the toggle.
2. Bubbles overlap zoom/north control (upper-right) → move bubble stack BELOW the control.
3. Flood-study flow line too thin + arrow too small → increase line-width + arrow size (no dash-animate, no data-driven-color-on-dashed — landmines).
4. Compare dropdowns have white backgrounds → dark theme.
5. Small-container-in-front-of-large z-index rule (tool console / bubbles must sit ABOVE the large detail/report panels). General rule.
6. RENAME "dossier/property detail" → "X-RAY" (copy/labels only, NOT code symbols): Export dossier PDF → Export X-ray; the detail tab → X-ray. Thesis-aligned (smart site X-ray).

## FLEET 2 — report-panel UX + citations + stale cleanup (hauska-map, dispatched)
A. EXPANDABLE REPORT PANELS — right-side report containers (flood study esp.) too small; add click-to-expand to a LARGE FLOATING BOX (not full-screen, map still visible). General pattern for right-side reports.
B. AI CHAT CITATIONS MISSING (regression) — zoning/code refs in chat answers should be atom-chip [n] citations (the layer PE proved for the brief); currently plain text. Wire chip citations to chat (anti-fabrication: only real on-property atoms; PRO mode does NOT strip). Root-cause + fix.
C. CLEAR STALE OLD-STYLED FLOOD STUDIES — old cached studies (from earlier QA) still render pre-current styling; cache-bust/version or re-refresh so none serve old look. (Fix C may need a planner data-op vs pure code — agent to report.)

## FLEET 3 — subjectResolveCleanup bug (hauska-map, dispatched)
`subjectResolveCleanup is not defined` ReferenceError shown live on property search/select. map-renderer.js references it (~L577/579/583/959/962) but it's not declared in a covering scope. Declare it correctly (preserve cleanup logic), confirm ReferenceError gone + subject-resolve.test passes.

## HELD — MOBILE PASS (own workstream, NOT this batch)
Operator: the map works fine on mobile, but searching a property / using controls makes the screens OVERLAP each other — "just a mess." Operator does NOT want to QA mobile until it gets a SOLID dedicated pass. This is its OWN workstream (responsive layout / panel-stacking / control overlap on small viewports), not a quick fix. DISPATCH SEPARATELY when ready — needs a real responsive-design pass (panel z-stacking, single-panel-at-a-time on mobile, control repositioning), likely its own fleet with a mobile-viewport test loop. Do NOT fold into the quick-paint batch.

## PLANNER LEGS (after fleets hand back)
Merge each on green (verify head SHA); deploy PE (Vercel CLI, new-timestamp + bundle marker); operator re-QA. Fix C may need a planner cache/data-op — handle per agent's report. The subjectResolveCleanup fix should ship promptly (live error).
