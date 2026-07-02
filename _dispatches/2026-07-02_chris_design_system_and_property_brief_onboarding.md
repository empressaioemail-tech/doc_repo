---
id: dispatches/2026-07-02_chris_design_system_and_property_brief_onboarding
title: Onboarding — Chris (design system owner + Property Brief rebuild)
status: active
date: 2026-07-02
audience: Chris and his AI agent
related: [_architecture_homes/shared_surface_principle, 80_adrs/adr_024_shared_surface_package_architecture, _dispatches/2026-07-02_next-planning-agent-handoff, 76g_investor_radar_landing_and_webstore]
---

# Hauska design system + Property Brief — onboarding for Chris

Drop this whole file into Claude to catch your agent up. It is self-contained: repo links, docs, current state, the stubs, what to build, and orientation.

## Your mandate

1. Own and refine ONE unified Hauska design system across every surface. `@hauska/design-tokens` is the single source of truth (CSS custom properties, all prefixed `--h-*`). Every shared component references those tokens; no hardcoded colors live inside a package. Consumers override by re-setting variables in their own `:root`.
2. The Property Brief keeps its own consumer colors and branding. It is a THEME VARIANT layered on `@hauska/design-tokens`, not a separate design language.
3. Rebuild the Property Brief (browser extension) to consume the component library, and polish it. Its intended purpose is correct (an on-listing investor property brief); it is currently broken and needs the rebuild plus polish. Keep its brand.
4. Build the consumer onboarding flow: a Hauska-branded landing page, then the full-page dashboard (a consumer-themed, curated view of the cortex workspace), then a download-the-extension step. A persistent header CTA prompts install and stays visible until the extension is installed.

Consumer brand: Hauska (the extension is "Hauska Property Brief" today). Hauska is both the substrate and, for this consumer surface, the front brand.

## The architecture in one paragraph

Shared UI ships as versioned npm packages under the `@hauska` scope (the "shared surface principle" / ADR-024). Six packages make up the component library. Auth is injected by the consuming app through a client factory, never baked into a component. Every tile is a self-contained React component with its own error boundary and multiple render modes (full / card / inline / raw). A tile registry carries machine-readable capability metadata. Three product surfaces consume the library: the cortex workspace (the full-page dashboard), the Property Brief extension, and the new landing page.

## Repos (all private unless noted; you need access granted by the operator)

- Design system + workspace + 4 packages: https://github.com/empressaioemail-tech/legacy-design-tools  (the cortex workspace app `artifacts/codex-reviewer-qa`, the BFF `artifacts/api-server`, and `packages/{design-tokens,tile-shell,cortex-client,cortex-tiles,document-viewer}`)
- Map package + spine console: https://github.com/empressaioemail-tech/hauska-map  (`packages/map-renderer` = `@hauska/map-renderer`; the operator console app is `apps/command-center`)
- Property Brief extension: https://github.com/empressaioemail-tech/hauska-brief-extension  (Chrome MV3, currently v0.6.32)
- MCP tools / agent data layer: https://github.com/empressaioemail-tech/hauska-mcp-server
- Spine / engine (reasoning, atoms, document-ingest): https://github.com/empressaioemail-tech/hauska-engine
- Atom contract (data types): https://github.com/empressaioemail-tech/hauska-atom-contract
- Strategy + all docs (this file lives here): https://github.com/empressaioemail-tech/doc_repo
- Candidate consumer app (verify with operator): https://github.com/empressaioemail-tech/radar

Access note: these are private GitHub repos. The operator must add Chris (and his agent's token) as a collaborator before anything can be cloned.

## The component library (the design system) — what each package is

Dependency graph (no cycles): `@hauska/atom-contract` → `@hauska/cortex-client` + `@hauska/design-tokens` → `@hauska/tile-shell` + `@hauska/map-renderer` + `@hauska/document-viewer` → `@hauska/cortex-tiles`.

- @hauska/design-tokens — the source of truth. `tokens.css`, ~2KB, no JS. Surface/text/border/accent/status colors, confidence-tier colors, spacing, radius, type, all as `--h-*` custom properties. Currently a dark operator theme. Your job includes defining the consumer/Property-Brief theme variant here (its own `:root` override set) while keeping the operator theme for the internal tools.
- @hauska/tile-shell — the shell infrastructure. `CortexShell`, `GridCanvas`, `SpaceBar`, the new `HeaderSearchBar` (prominent address search), `ModuleMap` (persona-mapped catalog of every tile), `FloatingTileLayer` (pop-out + dock-back), the edit/view "fuse-together" mode (a `.ts-seamless` class toggle that turns gaps into hairlines and strips tile chrome for a seamless view), the mount-once portal-into-slot pattern, `TileErrorBoundary`, layouts, and the providers (the shared active-parcel `EngagementProvider` / `useActiveParcel`, plus Spatial, Code, AnnotationSelection, DocumentViewerNavigation).
- @hauska/cortex-client — the typed BFF client, no React. `createCortexClient({ baseUrl, getToken })` is the auth-injection seam; each surface constructs one client with its own auth strategy and provides it via context; tiles call `useCortexClient()` and never touch tokens. Also the response types.
- @hauska/cortex-tiles — the tile components. The 12 migrated tiles (IntakeTile, IntakeQueueTile, MapTile, TopographyTile, DrainageTile, HydrologyTile, SubsurfaceTile, PropertyBriefTile, HazardProfileTile, EncumbranceTile, SheetExtractionTile, ResponseTasksTile), plus the 4 newly-built shell tiles (Findings Library, Local Setbacks, Document Parsing, Product Spec), `TileErrorBoundary`, a shared `ReportTileShell`, the atom/citation/confidence chip rendering, and the tile registry (46 entries, each with capability fields requires/produces/modes/mcpTools).
- @hauska/map-renderer — `FloatingMap` (MapLibre, main-thread canvas), an `overlays` prop, `LayerRegistry`. Props: `center`, `visibleLayers`, `parcel`, `onParcelSelect`, `overlays`, `floating` (set `floating={false}` for a plain filled div, which is what a tile or a panel wants). Published to npm at `@hauska/map-renderer@0.1.0`. Version 0.1.1 (which actually draws overlays) is built and merged but NOT yet published (gated on the operator setting `NPM_TOKEN`).
- @hauska/document-viewer — `PDFViewer`, `DWGViewer`, `AnnotationLayer`, `MarkupToolbar`, annotation types. For plan/document surfaces.

## The stubs and current polish state (be honest about what is real)

- Real, built tiles: the 12 migrated + the 4 shell tiles above render real UIs. Property Brief and Hazard render (Property Brief takes an address; Hazard shows flood zone / layers / confidence with a raw toggle).
- Stub tiles (registered in the shell but "full tile UI pending" — status `partial`): calibration, place-dossier, detail-callouts, bim-query, ifc-ingest, engagement-match, renders, collateral-export, letter-render, letter-send. These have a placeholder body and need real UI. This is where a lot of your tile-design work lands.
- Planned tiles (~13, status `planned`): stormwater, cut-fill, solar, viewshed, climate-risk, insurance, pro-forma, deal-score, motivated-seller, rehab, permit-AHJ-precedent, code-change-broadcast, jurisdiction-comparison. These need engine capability that does not exist yet; they are a roadmap, not ready to design against.
- Two tiles stayed app-side (not in the package): compliance-run and letter (deeply coupled to the review page); both are error-boundary-wrapped.
- The map does not draw spatial overlays until `@hauska/map-renderer@0.1.1` is published (NPM_TOKEN gate).
- Spine console (operator surface, separate from the consumer flow): a 3-column Control Tower with 3 live panels (Atom Inspector, Run Monitor, Surface and Gate) and 5 stubbed (node-graph, lineage-audit, resolver, engine-console, license-access).

## The Property Brief rebuild — what it must consume from the library

Today the extension imports only `@hauska/atom-contract` plus `maplibre-gl` directly (its own map, its own brief UI). Rebuild it to consume the library. At minimum:

- @hauska/map-renderer (`FloatingMap`, `floating={false}`) — the map, instead of the extension's hand-rolled MapLibre.
- @hauska/cortex-tiles `PropertyBriefTile` — the brief itself, in `card` or `inline` render mode for the sidebar; `raw` mode is a headless escape hatch if you need full layout control.
- @hauska/cortex-tiles `HazardProfileTile` — hazard is part of a full property brief.
- @hauska/cortex-client (`createCortexClient`) — inject the extension's brokerage-key auth here; the tiles then just work.
- @hauska/design-tokens — apply the Property-Brief consumer theme variant (its colors/brand) by overriding `--h-*` in the extension's `:root`.
- @hauska/tile-shell — the shared active-parcel provider (so the brief is address-driven from the listing) and the render-mode plumbing; the extension likely does not need the full grid shell, just the providers + a tile or two.
- Recommended additions as the brief grows: the atom/citation/confidence chip components (from cortex-tiles) for cited, confidence-graded output; the Encumbrance / Place Dossier / Setbacks tiles if the brief surfaces those; and `@hauska/document-viewer` if the brief lets a user attach a plan.

Hard prerequisite: to consume any of these cross-repo, the packages must be PUBLISHED to npm. Today only `@hauska/map-renderer@0.1.0` and `@hauska/atom-contract` are on npm; `design-tokens`, `tile-shell`, `cortex-client`, `cortex-tiles` are workspace-only. Publishing them is gated on the operator setting `NPM_TOKEN` on the package repos. Until then the extension cannot import them. This is the first unblock for the rebuild.

## The onboarding flow to build

Landing page (new, Hauska-branded) -> full-page dashboard (a consumer-themed, curated view of the cortex workspace — likely a dedicated consumer "space"/preset that shows Property Brief + Hazard + Map + comps, not the full internal 46-tile surface) -> download the extension. A persistent header CTA ("Install the Hauska extension") stays visible until the extension is detected as installed (the page can detect the extension via a content-script handshake or an installed flag).

Hosting status (checked 2026-07-02 — NOT done, this is scope, not built):
- The extension is v0.6.32, dev-loaded only. No GitHub releases, no Chrome Web Store listing. To let anyone download it you need either a Web Store publish (the "G4" operator item) or a hosted downloadable zip.
- The landing origin `hauska.io` returns Cloudflare 525 (no live origin). The landing copy was drafted in `76g_investor_radar_landing_and_webstore.md` but never stood up (intended Vercel). Standing up the landing origin is part of this scope.

## Key docs to read (in doc_repo)

- 00_current_state.md — portfolio snapshot (read first).
- _architecture_homes/shared_surface_principle.md — THE design-system architecture doc (package families, the full `--h-*` token set, render modes, auth injection, the annotation model). Read this second.
- 80_adrs/adr_024_shared_surface_package_architecture.md — the ratified ADR.
- _dispatches/2026-07-02_next-planning-agent-handoff.md — the build/deploy process, repo tips, and the local-vs-prod source-of-truth note.
- The Phase-2 close reports for what shipped and how: _inbox/2026-07-02_legacy-design-tools_phase2-shell-experience-close.md (header search, fuse layouts, Module Map, spaces), _inbox/2026-07-01_legacy-design-tools_cc-agent-C_track-C-close.md (the tile migration + the full 46-tile registry table), _inbox/2026-07-02_legacy-design-tools_phase2-dataroom-tile-close.md (file-to-atom UI).
- 76g_investor_radar_landing_and_webstore.md — landing copy + Web Store listing draft.
- 75g_investor_deal_radar.md and 75i_investor_radar_prelaunch_sprint.md — the consumer product vision and prelaunch scope.
- 25_atom_architecture_reference.md and 01a_atom_conventions.md — atoms and the cited-chip UX (every output carries reasoning, citation, confidence, timestamp — design for that).

## Orientation for the agent

- Clone the repos above (after access is granted). legacy-design-tools and hauska-map are pnpm workspaces — run `pnpm install`, then `pnpm -r build`.
- SOURCE OF TRUTH is origin/main and production, NOT local dev servers. Local dev servers (e.g. the cortex workspace at localhost:19592, the spine console at localhost:5174) run from local clones that lag main and often sit on feature branches, so they show stale UI. To see the real, deployed workspace: https://cortex-api-tds7av26va-uc.a.run.app/codex-reviewer-qa/ (hard-refresh). Before doubting a change landed, check the local clone's branch/commit vs origin/main.
- Design-token workflow: refine `@hauska/design-tokens`; every package reads `--h-*`; a surface themes by overriding `--h-*` in its own `:root`. The Property Brief theme is such an override set.
- Contribution flow (from the handoff doc): work on a branch, PR, CI green, squash-merge; the workspace app deploys via a canary sequence. Push branches early. Never `git add -A` in the shared doc_repo.
- Constraints: keep the Property Brief's colors/brand; one token system; no hardcoded colors in packages; every tile keeps an error boundary and supports render modes.

## Record your work in the repos (same discipline as the engineering fleet)

Everything you and your agent do must be recorded in the repos so the planner and operator can track and reconcile it. This is a hard requirement, not optional:

- Work on a branch; open a PR; get CI green; squash-merge. Never commit straight to main on the product repos. Push your branch to origin right after the first commit (do not leave work only on a local/tmp clone).
- File a close report to doc_repo `_inbox/` for each meaningful piece of work — a short markdown note: what shipped, the PR link(s), any deploy revision, decisions made, and what remains. Name it `_inbox/<YYYY-MM-DD>_<repo>_<topic>_close.md`. This is how the planner picks your work up.
- When you change design state, update the canonical docs: the design-system home is `_architecture_homes/shared_surface_principle.md` (the `--h-*` token set lives there); bump its `last_updated`. If the tile registry status changes, reflect it.
- Log design DECISIONS (the consumer theme, brand choices, token changes, the Property-Brief theme variant) as a decision record in doc_repo `_decisions/<YYYY-MM-DD>_<slug>.md` so they enter company memory rather than living only in chat.
- Use clear commit messages. Keep the `--h-*` token discipline (no hardcoded colors inside packages). If you touch doc_repo, stage explicit paths (never `git add -A` — it is a shared clone) and check `git log -1` before committing.
- Every published package change is a version bump plus a re-publish; record which version shipped in your close report.

The planner (this doc_repo agent) will read your close reports and keep `00_current_state.md` current. If you file nothing, your work is invisible to the rest of the fleet.

## Operator-owed unblocks (so Chris is not stuck)

- Grant Chris/his agent access to the private repos.
- Set `NPM_TOKEN` so the library packages publish to npm (the extension rebuild depends on it).
- Chrome Web Store publish (or a hosted downloadable zip) for the extension.
- Stand up the landing origin (hauska.io / Vercel).
- Confirm the consumer "space"/curated view of the cortex workspace is the intended full-page dashboard.

## Live coordinates (as of 2026-07-02)

Repo tips: legacy-design-tools c6ba01f, hauska-map 678517d, hauska-mcp-server 080eb01, hauska-engine 7e15710. Serving: cortex-api-00284-zuq (workspace + BFF), hauska-engine-api-00029-buy (engine + document-ingest), hauska-mcp-server-00008-mcr. Workspace URL: https://cortex-api-tds7av26va-uc.a.run.app/codex-reviewer-qa/.
