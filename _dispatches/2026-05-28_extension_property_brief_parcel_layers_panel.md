---
id: 2026-05-28_extension_property_brief_parcel_layers_panel
title: Dispatch — Property Brief extension shows parcel layers on brief panel
date: 2026-05-28
agent: cursor-auto
repo: hauska-brief-extension
kind: dispatch
related: [75a_hauska_brief_extension, _dispatches/2026-05-28_cc-agent-C_brokerage_fema_regrid_brief_layers]
---

# Extension — parcel layers on brief panel (Carfax step 4)

You own **`P:\hauska-brief-extension`** (Chrome MV3). Backend FEMA/Regrid enablement is **cc-agent-C** in a separate dispatch; assume `POST /api/brokerage/v1/brief` returns `siteContext.layers` and `laySummary` when prod is configured.

## Problem

- API may return `siteContext.layers` (Regrid parcel/zoning, FEMA flood) but the extension **does not read or render** `siteContext` today.
- Client rules fallback in `src/lib/lay-summary.js` hard-codes flood verdict to `unknown` ("Flood zone data was not loaded") even when the API sent `laySummary` with flood populated.

## Goal

After **Run brief**, the panel shows:

1. Existing traffic-light **verdict cards** from `laySummary` (API-first).
2. A **Parcel & site data** section listing ok layers from `brief.siteContext.layers` (plain English, no GeoJSON dump).
3. Rules fallback uses `brief.siteContext` for flood (and optional zoning line) when `laySummary` is missing.

## Read first

1. [`75a_hauska_brief_extension.md`](../75a_hauska_brief_extension.md) — response contract
2. `src/content/content-bundle.js` (or `src/panel/`) — verdict rendering
3. `src/lib/lay-summary.js` — `buildRulesLaySummary` / `resolveLaySummary`

## API shape (consume as-is)

```json
"siteContext": {
  "layers": [
    {
      "layerKind": "fema-nfhl-flood-zone",
      "adapterKey": "fema:nfhl",
      "status": "ok",
      "summary": "Zone AE — Special Flood Hazard Area",
      "provider": "FEMA NFHL"
    },
    {
      "layerKind": "regrid-parcel",
      "status": "ok",
      "summary": "APN 12345 · 0.42 ac"
    }
  ]
}
```

Show only `status === "ok"` with `summary` in the default consumer panel. Collapse failed/no-coverage layers behind "Data unavailable" one-liner (optional).

## Implementation

### 1. `src/lib/site-context-render.js` (new)

- `formatLayerLabel(layerKind)` → "Flood zone", "Parcel", "Zoning"
- `siteContextSectionHtml(siteContext)` → compact `<ul>` or cards

### 2. Panel / content bundle

- After verdict cards, inject `siteContextSectionHtml(brief.siteContext)` when layers exist.
- CSS in shadow root: match existing `hauska-verdict` spacing; no brokerage branding in user-visible strings.

### 3. `src/lib/lay-summary.js`

- `floodFromSiteContext(siteContext)` — mirror cortex `floodLayerSummary` logic (find fema/flood layer summary).
- `buildRulesLaySummary(brief)` — set flood verdict from site context when present; add optional **Zoning** verdict card when `regrid-zoning` summary exists.

### 4. Build

- `node scripts/build.mjs`
- Bump `manifest.json` version patch (e.g. `0.5.1`)

## Out of scope

- New API routes or MCP path changes.
- Map tiles / GeoJSON map view.
- Deep research page layout (may consume same helper later).

## Acceptance criteria

- [ ] Zillow homedetails → Run brief → panel shows **Parcel & site data** with at least flood and/or parcel line when prod API returns ok layers.
- [ ] Flood verdict card matches API `laySummary` when present (not overridden by stale rules fallback).
- [ ] With `briefApiUrl` unset (MCP dev), section hidden or shows honest "not available in dev mode" (no crash).
- [ ] No dynamic `import()` in service worker (static imports only).
- [ ] Operator reload unpacked extension and confirms on `245 Flaming Oak Dr, Bastrop, TX 78602`.

## Reporting

Planner inbox optional; primary proof is screenshot + extension version in operator chat. If committing extension repo: conventional commit `feat(panel): render siteContext parcel layers on brief`.
