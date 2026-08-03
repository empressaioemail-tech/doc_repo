---
id: REBRAND_UI_map_chrome_cluster
title: REBRAND UI — map chrome cluster (default layers, lower-left cleanup, flood-study legend)
date: 2026-08-03
status: dispatch (3 map-chrome QA items that share ExplorerMap.tsx — one agent, sequential, no collision)
owner: nick
related: [REBRAND_IMPL_design_system_wiring, smart-site-rebrand-live-pe-prod]
---

# REBRAND UI — map chrome cluster

Three operator QA items that all live in / near `apps/property-explorer/src/browse/ExplorerMap.tsx` (+ its helpers). ONE agent handles all three sequentially in one worktree (they share the file — parallel would collide). Branch off `rebrand/design-system-impl` so the new design tokens (pe-tokens.css) are available. Styling should USE the design tokens where it adds color. No deploy.

## TASK 1 — Default layers: everything except aerial/satellite ON by default
Today the cold-open / default-visible set is minimal (`consumer-layers.ts`: `COLD_OPEN_VISIBLE_LAYERS` ≤3 layers, parcel-line only; `DEFAULT_VISIBLE` logic). OPERATOR WANT: when a user lands, EVERY layer is selected/visible by default EXCEPT aerial/satellite (which stays OFF by default). The layers per the UI: Contours (1ft/3DEP), FEMA flood zone, GIS Parcel Boundary, Hydrography, My properties, Opportunity Zone tract, Regulatory floodway, Sidewalks/footpaths, Zoning/land use — all ON; Satellite/aerial — OFF.
- Change the default-visible set (`DEFAULT_VISIBLE` / `consumerColdOpenVisible` / `COLD_OPEN_VISIBLE_LAYERS`) so all non-aerial layers initialize ON. Keep aerial/satellite default-OFF.
- Do NOT remove the toggles — a user can still turn any off; only the DEFAULT changes.
- Verify the layers panel opens with all-but-aerial checked.

## TASK 2 — Lower-left cleanup: kill the transient notifications; keep only the badge; move + collapse the source tag
The lower-left currently has: (a) the Smart Site logo badge, (b) TransientChips — appearing/disappearing scroll notifications (imported ExplorerMap.tsx:67; "Chips are now TRANSIENT notifications... appears... then fades" ~line 1075), (c) a required source tag behind the badge. OPERATOR WANTS:
- REMOVE the TransientChips scroll notifications ENTIRELY — not just from lower-left, from anywhere they appear (they're distracting, worse on mobile). Remove the `<TransientChips>` render + its state plumbing (the chip-spec state that feeds it). Keep the honest-absence INFO elsewhere (the inspect card already says "not verified here") — these transient toasts are redundant chrome, not the honest-absence signal. If removing the chip state is risky (it may gate other logic), STOP + flag rather than rip out shared state; at minimum stop it from RENDERING.
- KEEP ONLY the Smart Site logo badge in the lower-left (the corner brand chip added in the branding pass).
- The REQUIRED SOURCE TAG (the "Contours — 1ft LiDAR... / Hydrography — Bastrop County GIS... / not survey grade" attribution that currently sits behind/near the badge): MOVE it to the LOWER-RIGHT, next to the layers bubble. Collapse it by DEFAULT into a small circular bubble with an ⓘ (information) icon. Clicking/tapping ⓘ expands the source attribution; collapsed by default (it does NOT need to be open all the time). Style the ⓘ bubble to match the existing layers bubble (same size/shape/chrome). Use `--brand-blue` for the ⓘ per the design system (info affordance).

## TASK 3 — Flood-study legend: fix to match the render + improve readability
The flood & drainage study legend (drawn near the flood panel; render logic in `flood-map-overlay.ts`) does NOT match what the map actually renders, AND it's hard to read. THE MAP RENDER IS CORRECT — fix the LEGEND to match it.
- Compare the legend's swatches/labels to the ACTUAL rendered colors + symbols the flood overlay draws (Zone low/medium/high concentration, Ponding/standing water, Catchment boundary, Flow path, Exit point, Parcel, FEMA flood zone reference). Make each legend entry's color + symbol MATCH the real render.
- Improve legibility: the legend text is hard to read — increase contrast/size, use the design tokens (`--surface-muted` for labels on the dark panel, proper spacing). Keep it compact but readable.
- Do NOT change the map render — only the legend to match it. If a legend entry has no corresponding render (or vice versa), reconcile to the render and note it.

## BOUNDARIES
- Use design tokens (pe-tokens.css) for any color; `--surface-ink` #0b0e13 chrome unchanged. Do NOT re-skin.
- Do NOT touch: the map render itself (flood), the install-id key, interaction-cyan, copy/wording beyond the legend labels.
- Preserve all layer toggles (Task 1 changes defaults only).

## VERIFY + DELIVER
- Task 1: default-visible set = all-but-aerial (show the changed constant/logic).
- Task 2: TransientChips no longer renders anywhere (grep for its render); only the badge remains lower-left; source tag is a collapsible ⓘ bubble lower-right by the layers bubble.
- Task 3: legend entries match the render's colors+symbols; legibility improved.
- Typecheck green (build @hauska/map-renderer, tsc --noEmit). No non-exiting dev server.
- Commit to a child branch `rebrand/ui-map-chrome` off `rebrand/design-system-impl`; push. NO merge, NO deploy. Report each task's changes + any STOP-flag.

## STANDING DECISIONS
Isolated worktree (Phase D zoning agent + design-impl agent are elsewhere — do not collide). Verification never delegated (planner confirms grep/build). Anti-fabrication (legend matches the real render, not a guess — READ the render colors). If removing shared state is risky, STOP + flag, don't rip out. No deploy without operator go (PE no auto-deploy). No timeframe estimates. Paste raw grep/typecheck.
