# A5 active-context design (survey verdict + work packages)

Planner-commissioned read-only survey (2026-07-07, Plan agent over hauska-map + ldt mains) for the operator's A5 requirement: one active project/address across all nodes and workspaces, persona-lens views ("123 Main as plan reviewer / architect / property investor"). This file is the build spec of record; WP1+WP2 dispatched same day (ldt branch `feat/a5-active-context-provider`).

## Survey verdict (file:line evidence verified on main)

The mechanism EXISTS: `@empressaio/tile-shell`'s `EngagementProvider` / `ActiveParcel` (`packages/tile-shell/src/providers/EngagementProvider.tsx:22-29`) is the declared single subject authority, and published tiles already consume it via `useEngagement()`/`useActiveParcel()`. The defect is mounting: the command center mounts a fresh provider PER PANEL (`apps/command-center/src/admin/workspace/SpacePanel.tsx:46`) and only the active panel renders (`ControlCenterLayout.tsx:23-36`), so the subject dies on every panel switch. State is React-only (no URL/localStorage/server). Saved spaces: command center uses localStorage only (`savedSpaces.ts`, key `cortex-saved-spaces`); a server store exists (`saved_workspace_spaces`, JSONB snapshot, permissive validator at `planReviewBff.ts:2392-2404` — additive `context` field passes through free); the SpaceBar path in the command center is currently dead code. Identity: single-operator (proxy service key; anonymous/internal owner server-side) — per-browser persistence is consistent.

Chosen store location: tile-shell itself (published tiles already subscribe; one installed instance == shared React context). A5 = hoist ONE provider to the command-center shell root + additive provider capabilities + persona lenses as preset spaces.

## Work packages

- **WP1 (ldt, tile-shell → 0.2.0, DISPATCHED)**: `ActiveParcel` + `projectDid?`/`label?`; `ActiveContext` alias; `initialParcel?` + `onActiveParcelChange?` props; context ADOPTION when a parent provider exists (defuses `CortexShell.tsx:499` shadowing); `contextEpoch` in the context value (stale-fetch guard); `SpaceSnapshot.context?` (pin-only, never auto-applied on load). All additive.
- **WP2 (ldt, cortex-tiles → 0.1.3, DISPATCHED with WP1)**: dep pin tile-shell `^0.2.0` — MANDATORY or pnpm dual-instances tile-shell and the React context silently splits (the #1 risk); epoch guards in PropertyBriefTile + MapTile as the exemplar pattern.
- **WP3 (hauska-map)**: upgrade to the published 0.2.0/0.1.3 (verify EXACTLY ONE `@empressaio+tile-shell` in `.pnpm` post-install); mount one `CortexProvider`+`EngagementProvider` in `main.tsx` around `ControlCenterLayout`, hydrated from hash/localStorage (`initialParcel`) and persisted via `onActiveParcelChange` (new `activeContext.ts`: hash params `addr/apn/eng/j/lat/lng`, localStorage `cc-active-context`); remove the per-panel `EngagementProvider` from `SpacePanel.tsx` (keep the other four per-panel providers) and `WorkspacePanel.tsx`.
- **WP4 (hauska-map)**: `ActiveContextBar` in the header (embed tile-shell `HeaderSearchBar` with `onGeocode` from `cortexClient.geocode`; context chip + clear); make `selectPanel` re-append the reserved context params (today `useActivePanel.tsx:88-94` WIPES hash params — deep links die without this; avoid collision with atom-inspector's `&id=`); persona lens presets `lens-reviewer`/`lens-investor`/`lens-architect` in `presets.ts` + `PanelRegistry.ts` + a context-preserving persona switcher (tile sets per `personaForTile`, `ModuleMap.tsx:8,32`).
- **WP5 (hauska-map, api/spine.ts)**: geocode path allowlist verification — cortex-client v0.1.1 POSTs `plan-review/geocode` but the proxy allowlists `api/place/geocode`; verify against deployed cortex-api and extend the allowlist (+ pre-add `api/plan-review/spaces` for WP6); update PROXY_CONTRACT.md + proxyContract.test.ts.
- **WP6 (optional, both repos)**: saved workspaces carry pinned context ("pin context" on save, "adopt pinned context" on load; server needs NO schema change).

## Risks to enforce at review

1. Two tile-shell instances = silent context split (check `.pnpm` after every install; long-term: tile-shell as peerDependency of cortex-tiles — out of A5 scope).
2. Mid-flight fetches committing stale data after a context switch → contextEpoch discipline.
3. `selectPanel` param wipe kills deep links (WP4 item b is load-bearing).
4. compose_workspace precedence: global ActiveContext wins; a composition's engagementId is APPLIED to the global context via setEngagement, never a parallel subject.
5. Panel remount churn on lens switch is accepted for v1 (caching lives in cortex-client if it hurts).

## Acceptance (whole feature)

Set "123 Main St" in the header → every Workspace panel AND each persona lens shows that parcel; reload restores it; `#panel=lens-investor&addr=123%20Main%20St` deep-links it; clearing returns all tiles to honest-empty.
