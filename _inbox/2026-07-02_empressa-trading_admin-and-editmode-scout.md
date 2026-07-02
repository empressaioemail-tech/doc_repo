---
title: empressa-trading scout — admin panel + edit/view fuse mode for Cortex Workspace Phase 2
status: active
last_updated: 2026-07-02
owner: planner (doc_repo)
audience: cortex workspace Phase 2 builder (layout-v2 + admin capture)
source_repo: empressaioemail-tech/empressa-trading @ e31c407 (2026-07-01, fresh read-only clone)
---

# Scout report: adopting the trading app's admin panel + edit/view "fuse" dashboard for the Cortex Workspace

Read-only scout of `empressaioemail-tech/empressa-trading` (fresh clone, tip commit `e31c407`, last commit 2026-07-01, NOT stale). Purpose: feed Phase 2 of the cortex tile-grid workspace in legacy-design-tools, which will adopt (1) the trading app's admin panel structure for a spine operator console, and (2) the trading dashboard's edit-vs-view "fuse" UX plus popout/docking.

Stack (detected): React 18 + Vite 5 + TypeScript 5 + Zustand 4 (with `zustand/middleware` `persist`) + Clerk auth + TanStack Query. No layout library at all — no react-grid-layout, react-mosaic, golden-layout, dockview, rc-dock, react-resizable, or flexlayout in any package.json. Every grid/drag/resize/dock behavior is hand-rolled over CSS Grid + pointer handlers. This is a positive for adoption: nothing exotic to vendor, and the mechanism is small enough to lift.

Repo shape: a monorepo (npm workspaces). Two live frontends matter:
- `apps/empressa/frontend` — the base trading app (aliased `@empressa/*`). Owns the real component library, the layout store, and the floating/detached-window machinery.
- `apps/cockpit/frontend` — a thin alternate shell ("FocusShell", gated by `VITE_SHELL=focus`) layered on top of `@empressa/*`. This is where the tile-grid + edit/view fuse UX actually lives.
- `apps/cockpit/admin` — a SEPARATE internal operator app ("Control Tower / Spine Command Center"). This is the admin-panel source.
- `apps/web` is DEPRECATED (has `DEPRECATED.md`); ignore it.
- `empressa-shell-template/` is a stripped starter template (simpler, older `layoutStore.ts` + a `TitleBar.tsx`); useful only as a minimal reference, not the live implementation.

---

## 1. Admin panel — the Spine Command Center (Control Tower)

Lives in `apps/cockpit/admin/`. It is explicitly framed as an INTERNAL operator console, separate from the consumer app, deployed to a separate URL (`apps/cockpit/admin/package.json` description: "Empressa Cockpit — INTERNAL operator admin app (Control Tower). Not part of the consumer cockpit; deploys to a separate internal URL"). This is almost exactly the shape the doc-repo spine command center wants.

### Structure (3-column shell driven by a registry)

Top-level app: `apps/cockpit/admin/src/App.tsx` — Clerk `SignedIn`/`SignedOut` gate, a `TokenBridge` that wires the Clerk JWT into `apiClient` (`Authorization: Bearer <token>`), a header ("EMPRESSA · CONTROL TOWER" + an "Internal" pill), then renders `ControlCenterLayout`.

Shell: `apps/cockpit/admin/src/control/center/ControlCenterLayout.tsx` — a flex 3-column console:

    [ NavRail (left, 208px) ] [ active inspector (center, flex) ] [ StateLegend (right) ]

Only the center inspector swaps; the rail and legend are persistent and scroll independently. The active panel is a hash route (`#panel=<id>&key=value`), so it survives reload and is linkable.

Key files (all under `apps/cockpit/admin/src/control/`):
- `center/ControlCenterLayout.tsx` — the 3-column shell.
- `center/NavRail.tsx` — left rail; renders `PANELS` grouped by `PANEL_GROUPS`, active item highlighted, own scroll.
- `center/PanelRegistry.ts` — THE manifest. A `PanelDef[]` (`id`, `label`, `group`, `Component`). Adding a panel here makes it appear in the rail and become routable. Groups: `Substrate | Engines | Governance`. Default panel + `panelById()` lookup with fallback.
- `center/useActivePanel.tsx` — hash-route hook + `PanelProvider` context (`parseHash`, `buildPanelHash`, `selectPanel`). Single shared panel state for the whole shell.
- `center/StateLegend.tsx` — persistent right column; a static reference glossary of the substrate's shared vocabulary (confidence basis, severity pills). Reference-only, reads nothing from backend.
- `primitives.tsx` — the shared visual kit: `Panel` (header + scrollable body shell every panel uses), `Pill`, `sevColors()`, `sectionHeader`, `mono`, `Loading`/`ErrorState`/`Empty`/`Centered`, `fmtTime`/`fmtNum`. All-token styling (`var(--color-*)`), honest loading/empty/error states (never a white screen).
- `api/apiClient.ts` — self-contained get/put/post/delete client with a hard per-request timeout and a `registerTokenGetter` seam for the Clerk token. No imports reach into the consumer frontend (clean to lift).
- `components/ErrorBoundary.tsx` — per-panel boundary (re-keyed on panel id so a thrown panel resets on nav).

### What it manages (the nine registered panels)

From `PanelRegistry.ts`, grouped:
- Substrate: `NodeGraphBrowser` (node & graph), `AtomInspector` (atoms), `CalibrationTracker` (calibration), `LineageAudit` (lineage & audit).
- Engines: `ResolverConsole` (resolver), `EngineConsole` (autonomous engines), `RunMonitor` (runs).
- Governance: `SurfaceGateInspector` (surface & gate), `LicenseAccessView` (license & access).

Each is a real inspector in `control/panels/*.tsx`. Several older panels also exist directly under `control/` (`SystemHealthPanel`, `QueuePanel`, `DigestPanel`, `ConformancePanel`, `SpinePanel`, `AccountPanel`, plus the legacy 6-panel `ControlTower.tsx` grid, now superseded by the Command Center shell).

Crucially, `AtomInspector.tsx` is built directly against a spine backend and documents its endpoints inline (`apps/cockpit/backend/app/routers/admin_spine.py`): `GET /admin/atoms?...` (bitemporal atom log query by entity/family/claim_type/worker/scope/knowledge-time), `GET /admin/atoms/{id}`, `GET /admin/atoms/as-of`, `GET /admin/atoms/lineage`. It renders the confidence figure as an OBJECT `{value, n, width, basis, scope}` and enforces a "never a bare float" rule — n + width + basis shown together. This is already aligned with the doc-repo commitments (#1 sell reasoning not data, #2 confidence earned not asserted; the StateLegend even glosses "asserted" as "declared, not yet checked against outcomes — treat as a prior"). The panel taxonomy (atoms, lineage/audit, calibration, resolver, runs, surface-gate, license-access) maps almost 1:1 onto the Hauska spine / cortex-api operator surface.

### Reusable in a spine/operator console

Directly liftable, near unchanged: `primitives.tsx` (Panel/Pill/sevColors/loading-empty-error), `center/PanelRegistry.ts` pattern, `center/NavRail.tsx`, `center/useActivePanel.tsx` (hash-routing), `center/ControlCenterLayout.tsx`, `center/StateLegend.tsx`, `api/apiClient.ts` (retarget BASE + token getter). The panel COMPONENTS themselves are trading/spine-shaped and would be re-authored against cortex-api, but their SHAPE (query form + paginated log + detail inspector + as-of/lineage time controls + `{n,width,basis}` confidence block) is exactly what a cortex atom/run/lineage console needs. Trading-specific: nothing structural — only the individual panels' backend contracts and vocabulary.

---

## 2. Edit vs view "fuse" dashboard UX

All in ONE file: `apps/cockpit/frontend/src/focus/FocusShell.tsx` (~3184 lines; the tile system is roughly lines 100-460 for the model and 1440-2700 for the runtime + inline CSS). This is the primary artifact for cortex layout-v2. Library: none — custom CSS Grid + native HTML5 drag + mouse-drag pointer handlers. State: local React `useState` in the shell; persistence via `localStorage` helpers.

### The layout model (this is the important part)

Tiles are a registry (`TILE_DEFS`): `{ id, label, category, engine?, el?, minColShare? }`. The active workspace is an ORDERED list of tile ids (`const [tiles, setTiles] = useState<string[]>(['chart'])`).

Layouts are named CSS-Grid templates keyed by tile COUNT (`LAYOUTS: Record<number, Layout[]>`), each `{ id, label, glyph, cols, rows, areas }` where `areas` is a literal `grid-template-areas` string (e.g. tall-left-plus-two-stacked = `'"a b" "a c"'`). Tiles fill grid areas `a,b,c…` by their order (`AREA_LETTERS = 'abcdefgh'`). This gives deterministic, GAP-FREE arrangements including asymmetric ones (one tall tile beside two stacked) without any layout library. There is also a curated set of preset "Spaces" (`SPACES`: a tile set + a layoutId) and user "Saved Views" — both share one model and stay fully editable after applied.

The grid element:

    <div className={'fs-tilegrid' + (solo) + (!customizing && !maxTile ? ' fs-seamless' : '') + (choreo)}
         style={{ gridTemplateColumns: colFr.map(w=>`${w}fr`).join(' '),
                  gridTemplateRows: rowFr.map(w=>`minmax(248px, ${w}fr)`).join(' '),
                  gridTemplateAreas: curLayout.areas }}>

Each tile is `<section className="fs-tile" style={{ gridArea: AREA_LETTERS[i] }}>` with a header (`fs-tile-head`, the drag grip + maximize + remove) and a body (`renderTileBody(id)`).

### Edit mode (`customizing === true`)

- Full chrome: each tile shows its `fs-tile-head` (grip `⠿`, title, maximize `⤢`, remove `✕`); the grid has `gap:8px`, `padding:8px`, and each tile has a border, radius, and shadow (`.fs-tile`).
- Add/remove: a catalog (grouped by category) toggles tiles in/out (`toggleTile`/`addTile`); active tiles shown as removable chips.
- Reorder by drag: native HTML5 DnD — the tile HEADER is `draggable={customizing}`; `onDragStart` sets `dragTile`; dropping onto another tile calls `reorderTiles(dragId, dropId)` which SWAPS their slots in the `tiles` array. Because tiles fill grid areas by array order, a swap re-places them in the template.
- Resize: `startTrackResize('col'|'row', i, e)` — a mouse-drag on a hairline handle (`fs-colhandle` / `fs-rowhandle`) that rewrites the `colFr`/`rowFr` fractional-track arrays (each track is a min 0.3fr; the two adjacent tracks trade fr as you drag). This mutates `gridTemplateColumns`/`gridTemplateRows`. Resize handles are AVAILABLE in view mode too (they just fade in on hover) — customize is only for add/remove/reorder/save.
- Maximize: `maxTile` state — a tile can go full-grid (`gridTemplateColumns:'1fr'`, others `display:none`); Esc or double-click restores.

### View mode fuse (`!customizing && !maxTile` → class `fs-seamless`)

This is the "components fuse into one seamless screen" behavior, and it is pure CSS — the SAME DOM, just a class toggle:

    .fs-tilegrid.fs-seamless { padding:0; gap:1px; background:var(--line); overflow:hidden; }
    .fs-tilegrid.fs-seamless .fs-tile { border:none; border-radius:0; box-shadow:none; }
    .fs-tilegrid.fs-seamless .fs-tile-head { display:none; }
    .fs-tilegrid.solo { padding:0; gap:0; overflow:hidden; }   /* single tile: fully chrome-free */

Mechanism: dropping padding to 0, gap to 1px, and painting the grid background the border color turns the inter-tile gaps into hairline dividers, while each tile loses its own border/radius/shadow and its header. The result reads as one continuous screen instead of a set of windowed cards. The tile headers are still RENDERED (hidden via CSS) so flipping back to customize is a single class toggle with zero remount. A faint `fs-tile-maxhint` button and `onDoubleClick` maximize keep discoverability while headers are hidden. Resize splitters (`fs-colhandle`/`fs-rowhandle`) are `opacity:0` and fade in on grid hover, so you can still resize a fused view without entering edit mode.

Note on remount-free portaling: the heavy chart is mounted ONCE and `createPortal`'d into whichever tile hosts it (or into a hidden park node when off), so adding/removing/reordering/resizing never re-inits it. The four options panels are portaled from one hidden source component into `data-quad-host` tiles. This "mount once, portal into the active slot" trick is worth copying for any expensive cortex tile (a map, a heavy chart).

### AI-composed layouts (bonus, relevant to cortex)

FocusShell can take a natural-language intent and emit `{ tiles, layoutId }` — via the Claude envelope (`/claude/chat`, system prompt `COMPOSE_ANS_SYS`) with a deterministic local fallback (`localCompose`/`pickComposition`). The layout templates ARE the schema the model targets: it picks a "hero" tile for the dominant cell and ranks the rest, capped at 4 tiles so nothing crowds. For cortex this is a ready pattern for "assemble a brief workspace from a question."

### Popout / docking / reflow

Two distinct docking notions in the repo:

1. In-shell "dock beside the anchor" (soft dock/reflow): the Trade area treats the chart as an ANCHOR always in view; option/research tiles "dock" beside it rather than swapping it out, and the grid reflows via the count-keyed layout templates. That IS the reflow behavior — adding a docked tile bumps the workspace to the next `LAYOUTS[n]` template and the CSS Grid re-places everything gap-free. There is no free-floating snap-to-neighbor collision engine; reflow is template-driven, which is simpler and more predictable.

2. True floating/detached windows: `apps/empressa/frontend/src/components/charts/FloatingChartLayer.tsx` renders `position:fixed` draggable+resizable panes (custom mouse handlers `startDrag`/`startResize`, z-index via `bringFloatToFront`), each with a "Dock" button that calls `dockChartFloat(id)` to return it to the grid. State lives in `layoutStore` (`floatingCharts: FloatingChartPane[]` with `{id, slot, rect:FloatRect, zIndex}`; actions `dockChartFloat`, `updateFloatRect`, `updateFloatSlot`, `bringFloatToFront`). There is ALSO a heavier multi-BROWSER-WINDOW detach path (`activeDetachedWindows` / `detachedWindows` in saved layouts, popout hash in `apps/empressa/frontend/src/utils/chartHash.ts`, scrubbed from the main window in FocusShell) — real OS-window popouts synced across windows. The simple in-app FloatingChartLayer is the one to copy for cortex; the multi-window detach is heavier and probably out of scope for Phase 2.

Honest gap vs the brief: the brief describes "a popped-out panel snaps next to on-screen components and the others reflow." What the trading app actually implements is (a) template-driven reflow when you add/remove a docked tile, and (b) free-floating panes that DOCK BACK to the grid (returning to the template flow) — not a magnetic snap-to-neighbor-with-live-reflow. The dock-back-into-template model is what exists and is the cleaner thing to adopt; a true snap engine would be net-new work.

---

## 3. Layout persistence

Two layers, both localStorage, both client-side/per-browser (no server-side or per-user layout sync found):

FocusShell (`apps/cockpit/frontend/src/focus/FocusShell.tsx`) — hand-rolled localStorage helpers:
- `empressa-focus-views` — user "Saved Views" (`{ name, tiles, layoutId }[]`), via `loadViews`/`persistViews`; created by `saveCurrentView()` (prompts for a name), applied by `applyView`, removed by `removeView`.
- `empressa-focus-flowmem` — per-ticker resume memory (`{tiles, layoutId, space, ts, pnlAtView}` keyed by symbol).
- `empressa-focus-aiworkspace` — last AI-composed workspace, so the tab survives reload.
- `empressa-focus-nav` — sessionStorage; keeps the active area/verb/space across a detach.
- Built-in `SPACES` (presets) are in-code constants, not persisted.

Base app (`apps/empressa/frontend/src/store/layoutStore.ts`) — Zustand `persist` middleware, localStorage key `empressa-layouts`, `partialize`d to `{ gridLayout, slots, syncSymbol, savedLayouts, activeLayoutId, splitConfig, chartView, activeDetachedWindows }`. `savedLayouts: NamedLayout[]` is the richer "named template" store (`{id, name, gridLayout, slots, splitConfig, detachedWindows, createdAt, updatedAt}`) with `saveLayout(name)`, `updateLayout(id)`, `loadLayout(id)`, delete. This is the pattern to copy if cortex wants named, updatable layout templates.

Sharing: none built. Layouts are local to the browser. There is no share-link, no server persistence, no per-user account binding of layouts. For cortex, per-user/per-tenant server persistence + share would be net-new (and should route through the tenant-sovereignty gate, not localStorage).

---

## 4. Reusability — adopt-this list for cortex/spine

Concrete recommendations, ordered by leverage. Target: a shared `@hauska/tile-shell` package + the spine command center.

Lift into `@hauska/tile-shell` (workspace/dashboard side):
1. The COUNT-KEYED CSS-Grid template model (`LAYOUTS` + `AREA_LETTERS` + `gridTemplateAreas` + `colFr`/`rowFr` fractional tracks). This is the whole gap-free, library-free layout engine. Port it verbatim; it has no trading coupling.
2. The edit/view FUSE toggle — the `fs-seamless` CSS (padding:0 / gap:1px / background:border-color / strip per-tile chrome + hide headers) plus the `solo` variant. This is the entire "components fuse into a seamless screen" effect and is ~10 lines of CSS over a single class toggle.
3. Drag-to-reorder (`reorderTiles` swap on native HTML5 DnD off the tile header) and mouse-drag track resize (`startTrackResize` rewriting `colFr`/`rowFr`), plus hover-reveal resize handles in view mode.
4. Maximize/restore (`maxTile` + Esc + double-click) and the "mount-once, `createPortal` into the active slot" pattern for expensive tiles (map, chart) so reorders/resizes never remount.
5. The tile REGISTRY shape (`TILE_DEFS` with `category`, `minColShare`, optional `engine` grouping) and the `minColShare` "too narrow in this layout" warning system.
6. The FloatingChartLayer pane (position:fixed, custom drag/resize, z-index bring-to-front, "Dock" back to grid). Generalize "chart pane" to "tile pane."
7. Optional: the AI-compose-a-workspace pattern (intent → `{tiles, layoutId}` with hero pick + cap, deterministic fallback) — natural fit for "compose a brief workspace from a question."

Lift into the spine command center (admin side):
8. The whole `apps/cockpit/admin/` shell pattern: `App` (Clerk gate + TokenBridge) + `ControlCenterLayout` (NavRail | inspector | StateLegend) + `PanelRegistry` + `useActivePanel` hash-routing + `primitives.tsx` (Panel/Pill/sevColors/loading-empty-error) + a self-contained `apiClient` with a token-getter seam. This is a near drop-in operator-console skeleton.
9. The panel taxonomy (atoms / lineage-audit / calibration / resolver / runs / surface-gate / license-access, grouped Substrate/Engines/Governance) as the cortex-api operator surface. Re-author each panel against cortex-api, but keep the query-form + paginated-log + detail-inspector + as-of/lineage time-controls + `{value,n,width,basis,scope}` confidence-block shape.
10. The StateLegend "shared vocabulary" reference column and the "confidence is never shown without n + width; asserted = a prior" discipline — already matches doc-repo commitments #1/#2; adopt it as-is so the operator console teaches the same vocabulary the product enforces.

Persistence recommendation: adopt the Zustand-`persist` `savedLayouts: NamedLayout[]` model (named, updatable templates) for local scratch, but for cortex do NOT stop at localStorage — layouts that are per-user or per-tenant must persist server-side through the tenancy/auth + sovereignty gate (tenant-private), not the browser. Sharing is net-new; the trading app has none.

Trading-specific / do NOT lift: the individual tile bodies (chart/chain/payoff/options/DOM/level2/FX/scanner/etc.) and their data contracts; the KNOWN_SYMS / assetCaps / option-panel-portal specifics; the multi-browser-window detach (`activeDetachedWindows` + popout hash) unless cortex explicitly wants OS-window popouts (heavy). The base app's `slots`/`ChartSlot` model is chart-specific; cortex should define its own tile-slot shape.

---

## Staleness / access note

Repo is CURRENT (tip 2026-07-01), not stale, and ALL the relevant code is present in the clone — no need to relay from the trading-app agent. Everything cited above was read directly from files at commit `e31c407`. The two primary artifacts for Phase 2 are `apps/cockpit/frontend/src/focus/FocusShell.tsx` (edit/view fuse + tile grid, self-contained incl. inline CSS) and the `apps/cockpit/admin/src/control/` tree (operator console). Both are readable standalone by a builder who has never seen the repo.
