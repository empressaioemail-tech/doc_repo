---
title: Map renderer publish + MapTile swap + prod deploy — close report
date: 2026-07-02
agent: claude_code (doc_repo planner)
status: COMPLETE
related: [80_adrs/adr_024_shared_surface_package_architecture, _sessions/2026-07-02_shared_surface_sprint_execution_claude_code]
---

# Map renderer publish + MapTile swap + prod deploy

Closes the sole residual from the Shared Surface Sprint (ADR-024): `@hauska/map-renderer` is published to npm, the cortex workspace map tile consumes it as a package (not an iframe), and the change is live on production `cortex-api`.

## What shipped

### 1. npm publish — `@hauska/map-renderer@0.1.0`

- **Package:** `hauska-map/packages/map-renderer` (Track A extraction, PR #2 on `empressaioemail-tech/hauska-map`, merge `2dc06a9`)
- **Registry:** https://www.npmjs.com/package/@hauska/map-renderer
- **Publish account:** `hauska-sdk`
- **Tarball:** 8 files (cjs + esm + dts + sourcemaps + styles.css), 145.5 kB packed
- **Verified:** repeat publish returned `E403 — cannot publish over previously published versions: 0.1.0`

**Environment note:** This Windows network runs a TLS-intercepting proxy. npm publish succeeded only when using the operator's real `~/.npmrc` (`strict-ssl=false`). Overriding with `--userconfig` dropped that setting and failed with `UNABLE_TO_VERIFY_LEAF_SIGNATURE`.

### 2. Consumer swap — legacy-design-tools PR #219

- **PR:** https://github.com/empressaioemail-tech/legacy-design-tools/pull/219
- **Merge:** `f69f8c4ad8f36f5294e5682dd468527466fbb696` (2026-07-02T11:55:54Z)
- **Change:** `packages/cortex-tiles/src/map/MapTile.tsx` replaces iframe `MapSurface` with `FloatingMap` from `@hauska/map-renderer` (`floating={false}`)
- **Deps added:** `@hauska/map-renderer@^0.1.0`, `maplibre-gl@^5.24.0`
- **tsup:** externalized both new deps (consumers own bundling)
- **pnpm:** added `@hauska/map-renderer` to `minimumReleaseAgeExclude` (first-party package; mirrors `stripe-replit-sync`)

### 3. Production deploy — cortex-api

Canonical canary sequence on merge SHA `f69f8c4`:

| Step | Workflow run | Result |
|------|-------------|--------|
| build-and-push (push to main) | 28588067305 | success (3m35s) |
| deploy-canary | 28588278339 | success (1m48s) |
| run-migrations | 28588404030 | success (45s; no new migrations for this PR) |
| shift-traffic + healthz smoke | 28588463739 | success (26s) |

**Serving revision:** `cortex-api-00277-gun` at **100%** traffic (prior sprint revision: `00275-hij`)

**Prod URL:** https://cortex-api-tds7av26va-uc.a.run.app

**Workspace UI mount:** `/codex-reviewer-qa/` (static SPA bundled inside cortex-api image)

## Why this is a net improvement (not a regression)

Investigation during swap prep found the prior iframe path was inert:

- `map.hauska.io` vanilla console (`hauska-map/src/config.js`) reads only `fixture`/`api`/`mcp`/`retrieval`/`app`/`report` query params. It never read `apn`/`jurisdiction`/`lat`/`lng`.
- No `message` event listener exists anywhere in hauska-map. The tile's `ADD_OVERLAY`/`SET_PARCEL` postMessages hit no receiver.

Net: the live tile showed a fixed Bastrop fixture demo and ignored engagement context. The package `parcel` prop drives a real `map.flyTo(lat/lng, 16)`, so the tile now recenters on the engagement parcel for the first time.

## Tracked follow-up (not blocking)

**Overlay rendering (`@hauska/map-renderer@0.1.1`).** `FloatingMap`'s `overlays` prop is reserved and unwired in 0.1.0 (no `setOverlays` on `createMapRenderer`). SpatialProvider overlays still do not draw on the map — unchanged from the iframe (which also never rendered them). Wire `OverlaySpec[]` to MapLibre sources+layers, publish 0.1.1, bump consumer.

**npm CI publish.** hauska-map has no `NPM_TOKEN` Actions secret yet. Future map-renderer releases are manual publish until that secret is set.

**Operator security.** npm automation token was pasted in a Cursor session transcript during publish setup. Rotate if that matters.

## Residual status vs sprint close

| Sprint residual | Status |
|----------------|--------|
| Publish `@hauska/map-renderer` to npm | **CLOSED** — 0.1.0 live |
| Swap import in MapTile.tsx | **CLOSED** — PR #219 merged |
| Retired `map.hauska.io` DNS action | **SUPERSEDED** — package model needs no running map server |
| Live overlay rendering | **OPEN** — 0.1.1 follow-up |

## Verification

- gcloud: `cortex-api-00277-gun` Ready, 100% traffic
- CI shift-traffic job: production `/api/healthz` smoke passed
- Local curl from planner shell blocked by Windows cert revocation check (same proxy/TLS environment as npm); prod health rests on CI smoke + gcloud revision state
