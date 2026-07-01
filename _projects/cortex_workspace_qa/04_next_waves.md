---
id: cortex_workspace_qa/04_next_waves
title: Open items and next waves — cortex workspace QA
status: active
last_updated: 2026-07-01
applies_to: design-accelerator
---

# Open items and next waves

Work is ordered: each wave unblocks the next. Do not start Wave 2 until Wave 1 is merged and deployed.

## Wave 1 (in flight — cc-agent-C)

Three fixes in one PR:

1. **Map tile URL** — Set `VITE_HAUSKA_MAP_URL` fallback to `https://map.hauska.io/command-center` or the correct command center URL. The iframe currently resolves to a broken image because the env var is unset.

2. **Confidence NaN%** — The confidence value from the API is null/undefined. Add a guard in the FindingCard display layer:
   ```typescript
   const n = Number(value);
   const display = !isFinite(n) ? "—" : `${Math.round(n * 100)}%`;
   ```
   Do not change the API or data shape.

3. **Save this space (localStorage)** — Wire the dead "Save this space" button to `localStorage` key `cortex-workspace-spaces`. Prompt for a name (window.prompt), store `{ tileIds, layoutId, colFr, rowFr }`, merge saved spaces into SpaceBar alongside built-in presets.

After PR merges: trigger cortex-api canary deploy (see `03_deploy.md`).

## Wave 2 — Letter tile

The Letter tile is a stub. It needs:

- BFF route: `GET /api/plan-review/engagements/:id/letter` and `POST /api/plan-review/engagements/:id/letter/generate`
- Tile component: fetch existing letter draft, show editable textarea, "Generate letter" button, "Copy / Download" action
- Reviewer posture (same as compliance run BFF routes — no owner filter)

Dispatch to cc-agent-C after Wave 1 is verified working.

## Wave 3 — L3 route scoping (Compliance Run completeness)

The Compliance Run tile calls `/api/engagements/*` via `@workspace/api-client-react` for some sub-operations (findings list, submission detail). These L3 routes still apply `engagementOwnerWhere`. Findings are showing from the compliance run itself (BFF-routed), but any sub-fetch via api-client-react returns empty for anonymous sessions.

Fix: when `req.session.audience === "internal"` (set by devSession bootstrap), bypass `engagementOwnerWhere` on the relevant L3 engagement routes. This is broader than the BFF fix but follows the same reviewer-posture principle.

Dispatch to cc-agent-C after Wave 2.

## Wave 4 — Resize handle positioning

The resize handles are positioned at `50%` in the grid container, not at the actual cell boundary. This makes dragging disorienting — you drag the handle but the cell boundary is elsewhere.

Fix: calculate handle position from the colFr/rowFr values at render time and position handles at the actual `colFr[0] / (colFr[0] + colFr[1]) * 100%` offset. This is a UX polish fix, not a functional blocker.

## QA session target (after Wave 1 deployed)

Run these side by side:
- Cortex workspace at `localhost:19592/codex-reviewer-qa/`
- Hauska-map command center at its local port

QA checklist:
- [ ] Queue shows all engagements
- [ ] Click row → all tiles update with engagement context
- [ ] Compliance Run: pick submission → Run review → findings appear with code citations
- [ ] Accept/Edit/Reject a finding
- [ ] Map tile: loads real map, centers on parcel when engagement selected
- [ ] Preset switching: Plan Review → Site Analysis → back to Plan Review (undo)
- [ ] Save this space: save a custom tile arrangement, persist across refresh
- [ ] Hydrology / Precedence Engine: show degraded banners (expected)
- [ ] Property Intel preset: Property Brief, Hazard Profile, Encumbrance Report stubs visible
- [ ] Design Accelerator preset: Sheet Extraction, Response Tasks stubs visible, Map tile loads

## Hauska-map command center

The map command center is 1 commit ahead of origin/main. Push owed before integrating.

The Map tile embeds it via iframe. When an engagement is selected in the cortex workspace, the SpatialProvider calls `postMessage({ type: "ADD_OVERLAY", overlay })` on the iframe to push parcel geometry or report overlays (topography, drainage, SSURGO).

For local dev QA, set `VITE_HAUSKA_MAP_URL=http://localhost:<hauska-map-port>/command-center` in `.env.local` in `artifacts/codex-reviewer-qa/`.
