---
id: inbox/2026-07-02_chris-onboarding-doc_adversarial-review
title: Adversarial review — Chris onboarding doc (design system + Property Brief)
status: review
date: 2026-07-02
reviewer: independent adversarial reviewer (read-only)
target: _dispatches/2026-07-02_chris_design_system_and_property_brief_onboarding.md
method: live source read against clones at repo tips legacy-design-tools c6ba01f, hauska-map 678517d, hauska-brief-extension 2ed91cb; gh api; npm view
---

# Adversarial review — Chris onboarding doc

Read-only review. No repo modified. Verdict at the end. Two things I could NOT verify from this environment (network egress to Cloud Run / hauska.io is TLS-blocked, curl exit 35/000): the live workspace URL response and the hauska.io 525. Those are marked UNVERIFIED, not wrong.

## 1. FACT-CHECK

### Repos and access

WRONG (access framing). The doc header says "all private unless noted." Live: only `hauska-brief-extension` is private. `legacy-design-tools`, `hauska-map`, `hauska-mcp-server`, `hauska-engine`, `hauska-atom-contract`, `doc_repo`, and `radar` are all PUBLIC on GitHub. This inverts the access story: Chris can clone six of the eight without any grant; only the extension needs a collaborator invite. The "operator must add Chris before anything can be cloned" line overstates the blocker.

CONFIRMED. All eight repo URLs exist under `empressaioemail-tech/`. `legacy-design-tools` carries `artifacts/{codex-reviewer-qa, api-server}` and `packages/{design-tokens, tile-shell, cortex-client, cortex-tiles, document-viewer}`. `hauska-map` carries `packages/map-renderer` and `apps/command-center`.

### Repo tips (live coordinates)

CONFIRMED. legacy-design-tools c6ba01f, hauska-map 678517d, hauska-mcp-server 080eb01, hauska-engine 7e15710 all match `gh api .../commits/main` exactly.

### The six packages

CONFIRMED. All six names and homes exist: `@hauska/design-tokens`, `@hauska/tile-shell`, `@hauska/cortex-client`, `@hauska/cortex-tiles`, `@hauska/document-viewer` (all in legacy-design-tools/packages), `@hauska/map-renderer` (hauska-map/packages).

### Dependency graph

WRONG (edges misstated; "no cycles" is right, the roots are not). The doc states: `atom-contract -> cortex-client + design-tokens -> tile-shell + map-renderer + document-viewer -> cortex-tiles`. Live package.json deps say otherwise:
- `design-tokens`: zero deps (leaf).
- `cortex-client`: zero deps (leaf). It does NOT depend on atom-contract.
- `tile-shell`: depends only on `@hauska/design-tokens` (+ react/react-dom peers).
- `document-viewer`: depends on `pdfjs-dist` only — NO @hauska deps. It is not downstream of design-tokens in package terms.
- `map-renderer`: depends on `@hauska/atom-contract` + `maplibre-gl`.
- `cortex-tiles`: depends on `cortex-client`, `tile-shell`, `design-tokens`, `map-renderer`, `maplibre-gl`.

So `atom-contract` feeds only `map-renderer` (and cortex-tiles transitively), NOT cortex-client or design-tokens. No cycles is correct, but the graph as drawn will mislead Chris's agent about what pulls what.

### design-tokens

CONFIRMED. `tokens.css` exists at `packages/design-tokens/tokens.css`, is the only real file (plus package.json), exports map is `{".": "./tokens.css"}`, no JS. It is a dark operator theme (`--h-surface-0: #111318`, `--h-text-primary: #e8eaf0`, etc.), all `--h-*` custom properties, includes confidence-tier colors (`--h-confidence-calibrated/asserted/deterministic`), spacing, radius, type. Minor: doc says "~2KB"; actual is 872 bytes. Not load-bearing.

### Tile lists and categorization

The authoritative registry is `@hauska/cortex-client/src/tileCapabilities.ts` (`TILE_CAPABILITIES`), NOT `cortex-tiles`. The doc's pointer "cortex-tiles ... or TILE_CAPABILITIES" is loose; the array lives in cortex-client and the app derives its `TILE_REGISTRY` from it.

WRONG (count). The doc says "46 entries" (twice: "the tile registry (46 entries...)" and "the full internal 46-tile surface"). Live registry has 47 entries. The 46 figure is from the 2026-07-01 Track-C close; the DataroomTile shipped after in PR #222 (commit c6ba01f, the live tip). Live status breakdown: 18 live, 2 degraded, 14 partial, 13 planned = 47.

WRONG (omits a live, package-resident tile). The doc never mentions the DataroomTile, which is `live`, exported from cortex-tiles, and is exactly the file->atom UI that a Property Brief "attach a plan" flow would reuse. Chris should know it exists.

PARTLY WRONG (the "12 migrated tiles ... render real UIs"). Of the doc's 12 migrated tiles, two are NOT live in the registry: `hydrology` is `degraded` (pysheds not installed in the Cloud Run worker) and `subsurface` is `partial` (SSURGO ECONNRESET). The doc simultaneously lists `subsurface` as a "migrated tile that renders a real UI" AND is silent that it is a partial. Internal contradiction with its own "be honest about what is real" section.

CONFIRMED (the 4 shell tiles). Findings Library (`findings-library`), Local Setbacks (`setbacks`), Document Parsing (`doc-parsing`), Product Spec (`product-spec`) are all `live`, all exported from cortex-tiles. Nit: calling them "shell tiles" is a misnomer — they live in `@hauska/cortex-tiles`, not `@hauska/tile-shell`.

CONFIRMED (the 10 stub/partial tiles). calibration, place-dossier, detail-callouts, bim-query, ifc-ingest, engagement-match, renders, collateral-export, letter-render, letter-send are all `status: 'partial'` with the identical "workspace tile UI not built (stub)" degradedReason. Accurate.

WRONG (the partial set is incomplete). The doc frames "10 stub/partial tiles," but the registry has 14 partials. It omits four partials Chris will encounter: `icc-ingest` (partial), `subsurface` (partial), `avm` (partial, "Cotality AVM keys present; not fully wired"), and `rent-comps` (partial, "Cotality demo quota 100/day, expires ~2026-07-06"). The two Market partials (avm, rent-comps) are especially relevant to a consumer investor brief and are silently missing from the doc's picture. The doc also never mentions the `Market` category (avm, rent-comps, pro-forma, deal-score, motivated-seller, rehab) or the two `degraded` tiles (`precedence`, `hydrology`).

CONFIRMED (the ~13 planned). All 13 named planned tiles match registry `planned` entries exactly.

CONFIRMED (two tiles stayed app-side). `compliance-run` and `letter` are app-resident (Option-3) in `artifacts/codex-reviewer-qa/src/tile-shell/tiles.tsx`, both error-boundary-wrapped. Note document-viewer is ALSO app-side (Track D), which the doc does not say.

### PropertyBriefTile / HazardProfileTile render modes

CONFIRMED. Both exist in cortex-tiles (`property-intel/PropertyBriefTile.tsx` 397 lines, `HazardProfileTile.tsx` 290 lines). Both registry entries carry `modes: ['full','card','inline','raw']`. Both are `live`. So the doc's render-mode claim is accurate.

CAVEAT (load-bearing, feeds Plan section). Both registry entries require `engagementId: true` AND `apn: true`. PropertyBriefTile internally uses `useEngagement()` + `useCortexClient()` and POLLs a BFF report job (`runReport` then poll). It is NOT a "give it an address and it renders" component; it needs a server-side engagement to exist and an APN resolved. The doc's "the tiles then just work" understates the contract.

### FloatingMap props

CONFIRMED. `hauska-map/packages/map-renderer/src/FloatingMap.tsx` `FloatingMapProps` has `center`, `visibleLayers`, `parcel`, `onParcelSelect`, `overlays`, `floating` — all as documented. `floating` defaults to `true`; `floating={false}` gives a plain filled container. CAVEAT: it also has `useFixture?: boolean` that DEFAULTS TO TRUE ("the E6 demo corpus"). A consumer surface that forgets to set `useFixture={false}` renders demo data, not the live parcel. The doc does not mention this.

### createCortexClient signature

CONFIRMED. `createCortexClient(config: { baseUrl: string; getToken: () => string | Promise<string> })`. Matches the doc.

### Hosting / npm publish status

CONFIRMED. `npm view`: `@hauska/map-renderer` = 0.1.0 (published), `@hauska/atom-contract` = 1.5.0 (published). `@hauska/cortex-tiles`, `@hauska/design-tokens`, `@hauska/tile-shell`, `@hauska/cortex-client` all E404 (workspace-only). `@hauska/document-viewer` is ALSO E404 (unpublished) — the doc's "workspace-only" list omits document-viewer but it is in the same state.

CONFIRMED. Local `map-renderer` package.json is version 0.1.1 while npm has 0.1.0 — matches "0.1.1 built/merged but not yet published (NPM_TOKEN gate)."

CONFIRMED. Extension `manifest.json` and `package.json` are v0.6.32. Extension `dependencies` are exactly `@hauska/atom-contract@^1.4.0` and `maplibre-gl@^5.24.0` — it imports only atom-contract + maplibre-gl, no component library. Matches the doc. (Nit: it pins atom-contract ^1.4.0 while npm is at 1.5.0; not a problem, just noted.)

### Live coordinates / serving

UNVERIFIED (network egress blocked in review environment, curl exit 35). Could not independently confirm the workspace URL `https://cortex-api-tds7av26va-uc.a.run.app/codex-reviewer-qa/` responds, the three Cloud Run serving revisions, or the hauska.io Cloudflare 525. These rest on operator observation. The workspace URL string itself matches the extension's `host_permissions`, which is corroborating but not a liveness check.

## 2. PLAN CHALLENGES (ranked by severity)

### C1 (highest) — "Rebuild the extension to consume @hauska/cortex-tiles + tile-shell" fights the extension's actual architecture and MV3 realities

The current extension is VANILLA JS. It has no react/react-dom anywhere (confirmed: not in deps, not in devDeps beyond esbuild). Its brief UI is content-script DOM string building (`lay-render.js`, `siteContextSectionHtml`, HTML template strings) injected into arbitrary listing pages via a single `content-bundle.js` matching `https://*/*` at document_idle. "Consume PropertyBriefTile" is not a refactor; it is a re-platform to React inside a content script. Concretely:
- The content script runs in the page's world on every site. Mounting React + MapLibre + cortex-tiles there means bundling that whole tree into a content-script IIFE and shadow-DOM-isolating it. Bundle size and per-page injection cost are real; the extension already ships a MapLibre CSP worker as a web-accessible resource for a reason.
- MV3 CSP for extension pages here is `script-src 'self' 'wasm-unsafe-eval'` (no `unsafe-eval`). Bundled React is fine, but any tile path that eval's or uses dynamic Function will break. MapLibre already needs the CSP worker; adding a second MapLibre instance via FloatingMap risks duplication with the extension's own maplibre-gl.
- The realistic path is `raw`/headless mode (the doc's own escape hatch) or a lighter contract, NOT dropping the full `PropertyBriefTile` + `tile-shell` grid into a content script. The doc buries this as "raw mode if you need full layout control"; it should be the lead recommendation, and the doc should say the extension is being re-platformed to React, not "rebuilt to consume the library."

### C2 (high) — The auth seam does not fit the extension's real auth, as drawn

The doc says: inject the extension's brokerage-key auth into `createCortexClient({ getToken })` and the tiles work. But `createCortexClient` only sends `Authorization: Bearer <getToken()>` (or falls to same-origin cookie); it sends NO custom headers. The live extension authenticates with `X-Hauska-Key` (brokerage key) + `X-Hauska-Install-Id`, PLUS a separate `chrome.identity.launchWebAuthFlow` OAuth token. And the tiles' client hits `/plan-review/*` on the cortex BFF (`requireServiceTokenOrSession`), which is a DIFFERENT gate than the `mcp.hauska.dev` MCP endpoint the extension currently calls for briefs. So "inject brokerage-key auth here and tiles just work" is false as written: either `cortex-client` needs a custom-header extension, or the cortex BFF plan-review routes need to accept the brokerage key + install id, or the extension needs to obtain a Bearer token the plan-review gate accepts. This is unscoped work, and it is on the critical path for the whole rebuild.

### C3 (high) — PropertyBriefTile needs an engagement + APN, not an address

The tile requires `engagementId` and `apn` and polls a report job. The extension today resolves an address to a brief via its own MCP path. To reuse PropertyBriefTile the extension must first create/resolve a cortex engagement and an APN for the listing address against the same BFF, then poll. That server round-trip contract (create engagement -> resolve APN -> run report -> poll) is the actual integration, and the doc does not name it. Without it, "consume PropertyBriefTile" is not buildable.

### C4 (medium) — The cortex workspace as the consumer "full-page dashboard" is oversold

`codex-reviewer-qa` is a 47-tile internal reviewer/architect tool with Compliance / Deliverable / Design-Accelerator / Site-Analysis surfaces (letter send, IFC ingest, compliance runs, engagement queues). A consumer investor dashboard is a small curated subset (Property Brief, Hazard, Map, comps). Making the internal workspace serve as the consumer dashboard requires, at minimum: a dedicated consumer space/preset, hiding every internal/partial/planned tile, an anonymous-or-consumer auth path (the workspace is service-token/cookie gated), and probably a separate build or route. The doc flags this as an open item ("likely a dedicated consumer space/preset") but the mandate (#4) states it as a done concept ("a consumer-themed, curated view of the cortex workspace"). It should be framed as net-new UX work with an unresolved auth model, not a re-skin.

### C5 (medium) — Publish is necessary but not sufficient; the "workspace" export condition will bite an external consumer

The doc's "publish the packages to npm and the extension can import them" is directionally right but incomplete. Per the Track-C close, tile-shell/cortex-client/cortex-tiles carry a `"workspace"` export condition that resolves to `./src/index.ts`, and the repo's own vite needs `resolve.conditions:["workspace"]` to build. An EXTERNAL consumer (Chris's extension) resolving the published tarball will hit the `dist/` branch — so the packages must be built to working `dist` (types + import + require) AND published in dependency order (design-tokens, then tile-shell/cortex-client/map-renderer, then cortex-tiles), with react/react-dom + maplibre-gl as satisfied peers, AND the `atom-contract` version aligned (extension pins ^1.4.0; cortex-tiles/map-renderer pull their own). If any inner package publishes with the src-only export or an unbuilt dist, the external install breaks. "Set NPM_TOKEN" alone does not de-risk this.

### C6 (low) — Token theming is coherent, with one wrinkle

"One token system + Property Brief as a themed `:root` override" is coherent: tokens.css is pure CSS custom properties, and overriding `--h-*` in a consumer `:root` is exactly how it is designed. No conflict in principle. Wrinkle: the current tokens.css has ONLY the dark operator `:root` set — there is no consumer/PB variant yet, and the confidence-tier and status colors are operator-tuned. Chris owns creating that variant (the doc says so). Also worth stating: the extension injects into arbitrary listing pages, so the PB theme must be shadow-DOM-scoped or it will leak/inherit host-page variables. Not a blocker, but name it.

## 3. GAPS (info Chris genuinely needs that the doc omits)

- How the extension actually authenticates TODAY: `chrome.identity.launchWebAuthFlow` OAuth token + `X-Hauska-Key` brokerage key + `X-Hauska-Install-Id`, against `mcp.hauska.dev` (MCP) and `cortex-api-...` (BFF). Entitlement/history is install-keyed (`install:<installId>`). This is the single most important context for a "rebuild + consume cortex-client" mandate and it is absent.
- The two backends and two gates: the extension calls both the MCP server and the cortex BFF; cortex-client targets the BFF `/plan-review/*` gate. The doc treats "the BFF" as one thing.
- The BFF base URL / MCP base URL the tiles must point at (`cortex-api-tds7av26va-uc.a.run.app` per the extension host_permissions; the workspace URL is given but not labeled as the BFF origin for cortex-client `baseUrl`).
- That the extension is vanilla JS with no React — the rebuild is a re-platform, and Chris should know the current code is content-script DOM building, not components.
- The engagement/APN precondition for PropertyBriefTile (see C3) and the report-poll contract.
- `FloatingMap` defaults `useFixture` to TRUE — a live consumer map must set `useFixture={false}`, and the doc's `floating={false}` note omits it.
- DataroomTile exists and is live (the file->atom UI), directly relevant if the consumer brief lets a user attach a plan.
- MapTile is currently an iframe embed of the hauska-map surface (MapboxGL fallback), not FloatingMap; the FloatingMap swap awaits map-renderer publish. So "consume FloatingMap" is genuinely new integration, not reusing what the workspace does today.
- Cotality display/licensing constraints on the consumer brief: rent-comps is on a demo quota (100/day, expires ~2026-07-06) and avm is "not fully wired"; a consumer-facing brief showing comps/valuation is gated on the production Cotality key + display license (a named launch gate elsewhere in the doc set). The doc says nothing about what the consumer brief is allowed to SHOW.
- How to run the packages locally for an external dev: the `pnpm -r build` line is right, but the `workspace` export condition means an external repo consuming published tarballs needs the built dist; there is no local-link/verify recipe.
- Access reality correction: six of eight repos are public; only the extension needs a grant.

## VERDICT

NOT safe to hand to Chris as-is. It is a strong orientation doc and most repo/package/tile/version facts check out, but four load-bearing items are wrong or missing in a way that will send Chris's agent down a broken path:

1. The dependency graph edges are wrong (atom-contract does not feed cortex-client or design-tokens).
2. The auth story is wrong: brokerage-key auth does NOT flow through `createCortexClient({getToken})`, and the tiles hit a different gate/backend than the extension uses today (C2) — this is unscoped critical-path work.
3. "Consume PropertyBriefTile" as drawn ignores that the extension is vanilla JS (a React re-platform), that the tile needs an engagement + APN + report-poll (C1, C3), and that MV3 content-script bundling of the full tile tree is the hard part.
4. The tile counts/status are stale and incomplete (46 vs live 47; DataroomTile and the Market partials omitted; subsurface/hydrology mislabeled as live).

Fix before handoff: (a) correct the dependency graph and the 46->47 / partial-set counts; (b) rewrite the auth section to state the real header/gate/backend seam and name the work to close it; (c) reframe the extension rebuild as a React re-platform whose realistic first step is raw/headless PropertyBriefTile, and name the engagement+APN+poll precondition; (d) reframe the "consumer dashboard = curated cortex workspace" as net-new UX + auth work; (e) correct the access line (most repos are public); (f) add the gaps in section 3, especially current extension auth and the Cotality display constraint. The publish-NPM_TOKEN unblock is real but insufficient (C5) — say so.
