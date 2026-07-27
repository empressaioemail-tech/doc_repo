---
id: 2026-07-27_QA3_command_center_majors
title: QA3 dispatch — Command Center three major adjustments + legibility
date: 2026-07-27
status: dispatched
owner: nick
planner: qa
repo: hauska-map
related: [2026-07-27_bastrop_qa_defect_register]
---

# QA3 — Command Center: three major adjustments, then legibility

You are a build agent. Improve the Command Center operator console (`apps/command-center`). Two waves: the three MAJOR structural adjustments first, then the legibility pass. The CC-A node/atom/edge walk and the B1 Spine Health panel are correct and integrated — do not rip them out; improve their layout and the shell around them.

## M0 warm-start
- Repo: hauska-map. Work off origin/main (tip `f386190`). Branch `qa/cc-majors`.
- Shell: `apps/command-center/src/admin/control/center/ControlCenterLayout.tsx` (3-column: NavRail | main | StateLegend). Panels registered in `admin/control/PanelRegistry.ts`. Node walk in `admin/control/panels/NodeGraph.tsx` + `AtomInspector.tsx`. Spine Health `panels/SpineHealth.tsx`. Tokens `admin/tokens.css`.
- All styling is inline `style={{}}` referencing CSS custom properties; no Tailwind.

## WAVE 1 — the three MAJORs
1. RECLAIM THE 504px FIXED SIDE CHROME. NavRail is 208px (`NavRail.tsx:69`); StateLegend is 296px (`StateLegend.tsx`) and is REFERENCE-ONLY — its own header says "it explains state; it does not show it." A static glossary permanently eating ~20% of the viewport is the biggest space-waste. Make StateLegend a collapsible drawer / toggle (default collapsed or narrow), and give the reclaimed width to the center inspector/map column. Keep it reachable, just not always-on.
2. UN-BURY THE NODE WALK. `NodeGraph.tsx:729-779` front-loads a 12-column Central-TX stats table (horizontal-scroll spreadsheet) ABOVE the actual node-inspect card — the flagship CC-A walk is below the fold. Promote NodeInspect to the top of the panel; move the tally into its own collapsible section (or its own panel) below. The operator should land on the walkable node card, not a metrics table.
3. UNIFY THE DESIGN TOKENS. `--color-background-tertiary` is referenced in 4 places (`SpacePanel.tsx:721,814`, `ActiveContextBar.tsx:75`, `ReportTile.tsx:265`) but NEVER defined in `tokens.css` → those elements render with no background. LiveMapTile uses a parallel `--h-*` token family with hardcoded hex fallbacks because the shell (`main.tsx:19`) imports only `tokens.css`, not `@empressaio/design-tokens`. Pick ONE namespace: either define the missing token(s) in `tokens.css` and migrate `--h-*`/LiveMapTile onto `--color-*`, or import design-tokens at the shell root and standardize. One namespace, defined once, imported at the root. No transparent-background elements, no fallback-hex parallel palette.

## WAVE 2 — legibility (after Wave 1)
4. TYPE SCALE — 9.5-11px mono everywhere (`primitives.tsx:24-31,71`; `NodeGraph.tsx:235`; `AtomInspector.tsx:138`); only the node name (14px) is larger. Introduce a real type scale and lift the atom-id/caption floor off 9.5px. Primary/secondary/tertiary info should differ at a glance.
5. BREADCRUMB — the return nav shows ONE hop (`← back to node`, `AtomInspector.tsx:642-643`; `NodeGraph.tsx:681-689`). Render the full traversal trail (node › family › atom, e.g. `48021:28286 › zoning-fact › did:hauska:…`) so a deep walk shows where you are.
6. STANDARDIZE ONE CARD PRIMITIVE — four container idioms today (NodeGraph rows / tally table / SpineHealth grid / SpacePanel tiles). Consolidate to one card component.
7. HYGIENE — two atom-row renderers (`NodeGraph.tsx:182-243` vs `AtomInspector.tsx:151-180`) → one; raw truncated `JSON.stringify(...).slice(0,120)` in cells (`SpineHealth.tsx:64`, tally) → a readable summary; stale NavRail group comment (`NavRail.tsx:3-4`); SpineHealth hand-rolled buttons → shared button primitive.

## Verify (you do NOT grade MET)
1. `pnpm -C apps/command-center build` clean; existing panel smoke tests pass (NodeGraph.smoke, SpineHealth smoke, tileRegistry).
2. No panel loses function; the node walk + breadcrumb + spine-health probe still work.
3. Deploy a Vercel PREVIEW of command-center; give the planner the preview URL. Do NOT shift production.
4. Report: branch, PR, SHA, build/test, preview URL. Operator LOOKS at the preview (node walk, reclaimed width, tokens) before MET. You do not claim MET.

Note: CC "first-class/expanded map default" (register CC-6) OVERLAPS the separately-HELD Track-C map-swap — do NOT do the map-swap here; leave the map tile where it is, just ensure it inherits the unified tokens (Wave 1 item 3). Flag anything Track-C-shaped to the planner rather than building it.

Deploys are agent-owned; fix a failed preview deploy yourself.
