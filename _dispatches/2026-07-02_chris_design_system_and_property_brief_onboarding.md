---
id: dispatches/2026-07-02_chris_design_system_and_property_brief_onboarding
title: Onboarding — Chris (design system owner + Property Brief rebuild)
status: active
date: 2026-07-02
audience: Chris and his AI agent
reviewed: adversarially reviewed 2026-07-02 (_inbox/2026-07-02_chris-onboarding-doc_adversarial-review.md); corrections applied
related: [_architecture_homes/shared_surface_principle, 80_adrs/adr_024_shared_surface_package_architecture, _dispatches/2026-07-02_next-planning-agent-handoff, 76g_investor_radar_landing_and_webstore]
---

# Hauska design system + Property Brief — onboarding for Chris

Drop this whole file into Claude to catch your agent up. Self-contained: repos, docs, current state, the stubs, what to build, the real integration constraints, and orientation. This doc was adversarially fact-checked against live source; the caveats below are load-bearing, not hedging.

## Your mandate

1. Own and refine ONE unified Hauska design system across every surface. `@hauska/design-tokens` is the single source of truth (CSS custom properties, all prefixed `--h-*`). Shared components reference those tokens; no hardcoded colors inside a package; consumers override by re-setting variables in their own `:root`.
2. The Property Brief keeps its own consumer colors and branding as a THEME VARIANT layered on `@hauska/design-tokens`, not a separate design language. (You create that variant; today `tokens.css` has only the dark operator theme.)
3. Re-platform and polish the Property Brief browser extension. Its intended purpose is correct (an on-listing investor property brief); it is broken and needs rework. IMPORTANT: the extension is currently VANILLA JS (content-script DOM string-building, no React). "Consume the component library" is therefore a React re-platform, not a reskin. Read the "Property Brief rebuild" section below before scoping anything.
4. Build the consumer onboarding flow: a Hauska-branded landing page, then a full-page dashboard, then a download-the-extension step, with a persistent header CTA that stays until the extension is installed. NOTE: the "full-page dashboard" is intended to be a consumer view of the cortex workspace, but that is NET-NEW UX plus an unresolved auth model (the workspace is a 47-tile internal tool, service-token/cookie gated) — not a reskin. See the caveat under "The onboarding flow."

Consumer brand: Hauska (the extension is "Hauska Property Brief"). Hauska is both the substrate and the front brand for this consumer surface.

## The architecture in one paragraph

Shared UI ships as versioned npm packages under `@hauska` (the "shared surface principle" / ADR-024). Six packages make up the component library. Auth is injected by the consuming app through a client factory. Every tile is a self-contained React component with an error boundary and render modes (full/card/inline/raw). A tile registry carries machine-readable capability metadata. The surfaces you touch: the cortex workspace (React), the Property Brief extension (currently vanilla JS), and a new landing page.

## Repos and access

Access reality: six of these are PUBLIC on GitHub (clone freely); only `hauska-brief-extension` is private (needs a collaborator invite from the operator).

- Design system + workspace + 4 packages (PUBLIC): https://github.com/empressaioemail-tech/legacy-design-tools — the cortex workspace app `artifacts/codex-reviewer-qa`, the BFF `artifacts/api-server`, and `packages/{design-tokens,tile-shell,cortex-client,cortex-tiles,document-viewer}`.
- Map package + spine console (PUBLIC): https://github.com/empressaioemail-tech/hauska-map — `packages/map-renderer` = `@hauska/map-renderer`; operator console `apps/command-center`.
- Property Brief extension (PRIVATE — needs a grant): https://github.com/empressaioemail-tech/hauska-brief-extension — Chrome MV3, v0.6.32, vanilla JS.
- MCP tools / agent data (PUBLIC): https://github.com/empressaioemail-tech/hauska-mcp-server
- Spine / engine (PUBLIC): https://github.com/empressaioemail-tech/hauska-engine
- Atom contract (PUBLIC): https://github.com/empressaioemail-tech/hauska-atom-contract
- Strategy + docs (PUBLIC — this file): https://github.com/empressaioemail-tech/doc_repo
- Candidate consumer app, verify with operator (PUBLIC): https://github.com/empressaioemail-tech/radar

## The component library

Dependency graph (verified from package.json; no cycles):
- `@hauska/design-tokens` — zero deps (pure CSS leaf).
- `@hauska/cortex-client` — zero deps (typed client leaf; does NOT depend on atom-contract).
- `@hauska/document-viewer` — depends on `pdfjs-dist` only (no `@hauska` deps).
- `@hauska/tile-shell` — depends on `@hauska/design-tokens` (+ react/react-dom peers).
- `@hauska/map-renderer` — depends on `@hauska/atom-contract` + `maplibre-gl`.
- `@hauska/cortex-tiles` — depends on `cortex-client` + `tile-shell` + `design-tokens` + `map-renderer` + `maplibre-gl`. This is the top of the tree.

What each is:
- @hauska/design-tokens — the source of truth. `packages/design-tokens/tokens.css` (872 bytes, no JS, exports `{".": "./tokens.css"}`). Dark operator theme: `--h-surface-*`, `--h-text-*`, `--h-border-*`, `--h-accent*`, `--h-status`, `--h-confidence-{calibrated,asserted,deterministic}`, spacing/radius/type. You define the consumer/Property-Brief `:root` variant here.
- @hauska/tile-shell — CortexShell, GridCanvas, SpaceBar, HeaderSearchBar, ModuleMap, FloatingTileLayer (pop-out + dock-back), the edit/view `.ts-seamless` fuse toggle, mount-once portal-into-slot, TileErrorBoundary, layouts, and the providers (the shared active-parcel `EngagementProvider`/`useActiveParcel`, plus Spatial, Code, AnnotationSelection, DocumentViewerNavigation).
- @hauska/cortex-client — the typed BFF client, no React. `createCortexClient({ baseUrl, getToken })`. IMPORTANT: it sends only `Authorization: Bearer <getToken()>` (or same-origin cookie) — it sends NO custom headers today. It also holds the authoritative tile registry: `src/tileCapabilities.ts` `TILE_CAPABILITIES`.
- @hauska/cortex-tiles — the tile components, including PropertyBriefTile, HazardProfileTile, MapTile, the 4 built tiles (Findings Library, Local Setbacks, Document Parsing, Product Spec), the new DataroomTile (the file->atom UI, live), TileErrorBoundary, ReportTileShell, and the atom/citation/confidence chip rendering.
- @hauska/map-renderer — `FloatingMap` (MapLibre, main-thread canvas). Props: `center`, `visibleLayers`, `parcel`, `onParcelSelect`, `overlays`, `floating` (default true; `floating={false}` = plain filled container), and `useFixture` (DEFAULTS TO TRUE — a live surface MUST pass `useFixture={false}` or it renders the demo corpus). Published `@hauska/map-renderer@0.1.1` (0.1.1 adds working overlays).
- @hauska/document-viewer — PDFViewer, DWGViewer, AnnotationLayer, MarkupToolbar. Unpublished (workspace-only).

## Current state — tiles and polish (be honest about what is real)

The live tile registry (`TILE_CAPABILITIES`, at repo tip c6ba01f) has 47 entries: 18 live, 2 degraded, 14 partial, 13 planned. Categories include Compliance, Site Analysis, Property Intel, Design Accelerator, and Market.

- Real, live tiles include: Property Brief, Hazard, Map, Intake, Intake Queue, Encumbrance, Sheet Extraction, Response Tasks, Topography, Drainage, Place Dossier, plus the 4 built tiles (Findings Library `findings-library`, Local Setbacks `setbacks`, Document Parsing `doc-parsing`, Product Spec `product-spec`) and DataroomTile. (Those 4 live in `@hauska/cortex-tiles`, not tile-shell — "shell tiles" was a misnomer.)
- Degraded (backend, not UI): `precedence`, `hydrology` (pysheds not in the Cloud Run worker).
- Partial — 14 total, two kinds: (a) 10 UI-STUBS (registered, "workspace tile UI not built"): calibration, place-dossier detail vs summary, detail-callouts, bim-query, ifc-ingest, engagement-match, renders, collateral-export, letter-render, letter-send; (b) 4 BACKEND-partials: `subsurface` (SSURGO upstream), `icc-ingest` (contract unverified), and the two Market tiles `avm` (Cotality AVM not fully wired) and `rent-comps` (Cotality demo quota, expires ~2026-07-06). The Market partials matter for a consumer investor brief — they are not ready.
- Planned (~13, need engine capability that does not exist): stormwater, cut-fill, solar, viewshed, climate-risk, insurance, pro-forma, deal-score, motivated-seller, rehab, permit-AHJ-precedent, code-change-broadcast, jurisdiction-comparison.
- App-side (not in the package): compliance-run, letter, and document-viewer (Track D). Error-boundary-wrapped.
- Map: MapTile consumes `@hauska/map-renderer` `FloatingMap` (swapped in PR #219). Spatial overlays draw once the `0.1.1` bump lands (in progress at handoff time).
- Spine console (operator surface, separate from the consumer flow): a Control Tower with 3 live panels + 5 stubs.

## The Property Brief rebuild — the real constraints (read before scoping)

The extension today imports only `@hauska/atom-contract` + `maplibre-gl`. Its brief UI is content-script DOM string-building injected into arbitrary listing pages. Three hard realities shape the rebuild:

1. It is a React RE-PLATFORM. To use `PropertyBriefTile`/`tile-shell` you are mounting React (shadow-DOM-isolated) inside an MV3 content script, bundling that tree into the content bundle. MV3 page CSP here is `script-src 'self' 'wasm-unsafe-eval'` (no `unsafe-eval`); MapLibre already ships via a CSP worker. The REALISTIC first path is `raw`/headless consumption of the tiles (the tile handles data/state; you render), or a lighter shared contract — NOT dropping the full tile grid into a content script. Design the consumer brief UI; consume the tiles' logic/data and the tokens, not necessarily their full DOM.
2. Auth does NOT "just work" through `createCortexClient`. The extension authenticates today with `chrome.identity.launchWebAuthFlow` (OAuth) + `X-Hauska-Key` (brokerage key) + `X-Hauska-Install-Id`, against TWO backends: the MCP server (`mcp.hauska.dev`) for briefs and the cortex BFF (`cortex-api-...`). `createCortexClient` only sends `Bearer`/cookie and no custom headers, and the tiles call `/plan-review/*` on the BFF (`requireServiceTokenOrSession`) — a different gate than the extension uses. Closing this seam (extend cortex-client with custom headers, OR have the BFF plan-review routes accept the brokerage key + install id, OR mint a Bearer the plan-review gate accepts) is UNSCOPED, critical-path work. Name it before you build.
3. `PropertyBriefTile` needs an engagement + APN, not an address. It requires `engagementId: true` + `apn: true`, calls `useEngagement()` + `useCortexClient()`, and POLLS a report job (`runReport` then poll). The extension resolves an address to a brief via its own MCP path. To reuse the tile you must first create/resolve a cortex engagement and an APN for the listing address against the BFF, then poll — that server round-trip is the actual integration.

What the rebuilt brief should consume from the library, lowest-friction first:
- @hauska/design-tokens — the Property-Brief consumer theme variant (shadow-DOM-scoped, since the extension injects into arbitrary host pages). This is the clean, immediate win.
- @hauska/map-renderer `FloatingMap` (`floating={false}`, `useFixture={false}`) — the map. This replaces the extension's hand-rolled MapLibre once you accept a second React island or mount it standalone.
- The atom/citation/confidence chip rendering and the data contracts (from cortex-tiles/atom-contract) — so consumer output carries reasoning + citation + confidence, consistent with the workspace.
- PropertyBriefTile / HazardProfileTile — via `raw`/headless mode, AFTER the auth seam and the engagement/APN/poll contract are solved. Treat these as phase 2, not the opening move.
- DataroomTile / document-viewer — only if the consumer brief lets a user attach a plan.

Publish prerequisite (necessary but NOT sufficient): to consume any of these cross-repo, the packages must be published to npm. Today only `@hauska/map-renderer@0.1.1` and `@hauska/atom-contract@1.5.0` are published; `design-tokens`, `tile-shell`, `cortex-client`, `cortex-tiles`, `document-viewer` are workspace-only. Beyond setting NPM_TOKEN: the inner packages carry a `"workspace"` export condition that resolves to `./src` (the repo's vite passes `resolve.conditions:["workspace"]`); an EXTERNAL consumer resolving the published tarball hits the `dist` branch, so each package must be built to a working `dist` (types + import + require), published in dependency order (design-tokens, then tile-shell/cortex-client/map-renderer, then cortex-tiles), with react/react-dom + maplibre-gl as satisfied peers and atom-contract versions aligned. A publish workflow for legacy-design-tools does not exist yet.

## The onboarding flow to build

Landing page (new, Hauska-branded) -> full-page dashboard -> download the extension, with a persistent header CTA ("Install the Hauska extension") that stays until the extension is detected (content-script handshake / installed flag).

Reality check on the dashboard: the cortex workspace (`codex-reviewer-qa`) is a 47-tile internal reviewer/architect tool, service-token/cookie gated. Using it as the consumer dashboard is NET-NEW UX plus an unresolved auth model: it needs a dedicated consumer space/preset showing only the consumer-relevant tiles (Property Brief, Hazard, Map, comps), every internal/partial/planned tile hidden, and a consumer/anonymous auth path. Treat it as new work, not a reskin.

Hosting status (checked 2026-07-02 — NOT done, this is scope): the extension is v0.6.32, dev-loaded only (no GitHub releases, no Web Store listing). `hauska.io` returns Cloudflare 525 (no live origin; landing copy drafted in `76g` but never stood up). Standing up the landing origin and publishing the extension (Web Store or a hosted zip) are part of this scope.

## Key docs to read (in doc_repo)

- 00_current_state.md — portfolio snapshot (first).
- _architecture_homes/shared_surface_principle.md — THE design-system architecture doc (packages, the full `--h-*` token set, render modes, auth injection). Second.
- 80_adrs/adr_024_shared_surface_package_architecture.md — the ADR.
- _dispatches/2026-07-02_next-planning-agent-handoff.md — the build/deploy process, repo tips, local-vs-prod note.
- The Phase-2 close reports: _inbox/2026-07-02_legacy-design-tools_phase2-shell-experience-close.md, _inbox/2026-07-01_legacy-design-tools_cc-agent-C_track-C-close.md (the tile registry table), _inbox/2026-07-02_legacy-design-tools_phase2-dataroom-tile-close.md.
- 76g_investor_radar_landing_and_webstore.md; 75g/75i (consumer vision + prelaunch).
- 25_atom_architecture_reference.md, 01a_atom_conventions.md — atoms + the cited-chip UX.
- The extension repo itself (once granted) — read how it authenticates (`chrome.identity`, X-Hauska-Key, X-Hauska-Install-Id) and how the content script renders today, before touching it.

## Orientation for the agent

- Clone the repos (six public; extension needs a grant). legacy-design-tools and hauska-map are pnpm workspaces — `pnpm install`, then `pnpm -r build`. External consumption of the packages needs the built `dist` (the `workspace` export condition resolves to src locally).
- SOURCE OF TRUTH is origin/main and production, NOT local dev servers. Local dev servers (cortex workspace localhost:19592, spine console localhost:5174) run from local clones that lag main and often sit on feature branches, so they show stale UI. See the deployed workspace at https://cortex-api-tds7av26va-uc.a.run.app/codex-reviewer-qa/ (hard-refresh); that origin is also the cortex-client `baseUrl`. Before doubting a change landed, check the local clone's branch/commit vs origin/main.
- Design-token workflow: refine `@hauska/design-tokens`; components read `--h-*`; a surface themes by overriding `--h-*` in its `:root`. The Property Brief theme is such an override set, shadow-DOM-scoped in the extension.
- Constraints: keep the Property Brief's colors/brand; one token system; no hardcoded colors in packages; every tile keeps an error boundary and supports render modes. Consumer briefs showing comps/valuation are gated on the production Cotality key + consumer display license (a named launch gate) — do not assume avm/rent-comps can be shown publicly.

## Record your work in the repos (same discipline as the engineering fleet)

Everything you and your agent do must be recorded so the planner and operator can track it. Hard requirement:
- Branch, PR, CI green, squash-merge. Never commit straight to main on product repos. Push your branch to origin right after the first commit (do not leave work only on a local/tmp clone).
- File a close report to doc_repo `_inbox/<YYYY-MM-DD>_<repo>_<topic>_close.md` for each meaningful piece of work: what shipped, PR links, any deploy revision, decisions, what remains. That is how the planner picks up your work.
- Update canonical docs on design-state change: the design-system home is `_architecture_homes/shared_surface_principle.md` (the token set lives there); bump `last_updated`.
- Log design DECISIONS (consumer theme, brand, token changes) as `_decisions/<YYYY-MM-DD>_<slug>.md` so they enter company memory.
- Clear commit messages; keep `--h-*` discipline. In doc_repo, stage explicit paths (never `git add -A` — shared clone) and check `git log -1` first.
- Every published-package change is a version bump + re-publish; record the version in your close report.

## Operator-owed unblocks

- Grant Chris/his agent access to the private `hauska-brief-extension` repo (the other repos are public).
- A publish workflow + `NPM_TOKEN` on legacy-design-tools so the component library packages publish to npm with working `dist` in dependency order (NPM_TOKEN is now set; the workflow is not built yet).
- Chrome Web Store publish (or a hosted downloadable zip) for the extension.
- Stand up the landing origin (hauska.io / Vercel).
- Resolve the consumer auth model for the workspace-as-dashboard and the extension->plan-review-gate seam.
- Production Cotality key + consumer display license before the consumer brief can show comps/valuation.

## Live coordinates (2026-07-02)

Repo tips: legacy-design-tools c6ba01f, hauska-map 678517d, hauska-mcp-server 080eb01, hauska-engine 7e15710. Serving: cortex-api-00284-zuq (workspace + BFF), hauska-engine-api-00029-buy (engine + document-ingest), hauska-mcp-server-00008-mcr. Published packages: @hauska/map-renderer@0.1.1, @hauska/atom-contract@1.5.0. Workspace URL: https://cortex-api-tds7av26va-uc.a.run.app/codex-reviewer-qa/.
