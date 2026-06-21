# Wave 2 close — extension F4 read-contract migration

**Agent:** extension agent (Calibrated Spine)  
**Date:** 2026-06-21  
**Program:** End-state C · Task F4 propagation (extension slice)  
**Contract pin:** `@hauska/atom-contract@1.4.0`

---

## Outcome

**PASS** — Extension map stack now consumes the F4 read-contract object end-to-end. Scalar confidence fallback is removed from the GIS envelope normalizer. Choropleth fills are withheld when width is absent. Interval width drives fill saturation in the portable renderer (`gis-map-render.js` / `gis-map-paint.js`). Map honesty UI shows calibration provenance and width. Selection objects thread `readContract`, `atomIds`, and `atomTrace` for click-through.

---

## What changed

### 1. Read-contract normalizer (no scalar fallback)

**New module:** [`src/lib/read-contract-envelope.js`](../../hauska-brief-extension/src/lib/read-contract-envelope.js)

- `envelopeFromJson()` — validates `readContract` via `READ_CONTRACT_SCHEMA` from `@hauska/atom-contract/read-contract`
- Accepts `json.readContract`, `json.envelope.readContract`, or `json.honesty.readContract`
- **Does not** map legacy `{ confidence: { value, kind } }` — `contractValid: false`, `readContract: null`
- `canRenderHonestFill()` — refuses choropleth/heatmap/extrusion/flow when width missing
- `widthToSaturation()` — maps interval width → fill opacity multiplier (1.0 tight → 0.35 wide)
- `createFixtureReadContract()` — contract-shaped fixture builder

**Updated:** [`src/lib/gis-proxy-api.js`](../../hauska-brief-extension/src/lib/gis-proxy-api.js) — imports `envelopeFromJson` from read-contract module; removed inline scalar normalizer.

### 2. Portable renderer — width-as-saturation (map agent merge surface)

**Updated:** [`src/lib/gis-map-paint.js`](../../hauska-brief-extension/src/lib/gis-map-paint.js)

- `fillOpacityWithContract(layerKey, meshMode, contractSaturation)` — scales fill opacity by width-derived saturation

**Updated:** [`src/lib/gis-map-render.js`](../../hauska-brief-extension/src/lib/gis-map-render.js)

- `upsertGisLayer` / `upsertExtrusionLayer` / hydrology ceiling — gate on `canRenderHonestFill`
- Applies `readContractSaturation(slot.envelope.readContract)` to fill opacity
- `selectionFromParcelFeature` — threads `readContract`, `atomIds`, `atomTrace` (no scalar `confidence`)

Map agent should import these modules from Wave 1 baseline paths; paint logic stays out of `site-map.js` shell.

### 3. Map honesty UI

**Updated:** [`src/lib/envelope-confidence.js`](../../hauska-brief-extension/src/lib/envelope-confidence.js)

- `readContractHtml()` — source provenance badge, width meter (saturation-encoded), optional accuracy/consequence stratum
- `readContractPinSaturation()` — pin ring `--confidence` from width, not scalar
- `confidenceAssertedHtml()` — prefers read-contract when present; legacy scalar path retained for unmigrated brief headline only

**Updated:** [`src/lib/site-map.js`](../../hauska-brief-extension/src/lib/site-map.js) (shell only)

- Legend meta: provenance + interval width; marks layers **withheld** when contract missing
- Detail panel: `readContractHtml` + atom trace `<code>` list
- Pin rings: width-derived saturation
- Selection objects: `readContract`, `atomIds`, `atomTrace` on parcel, slot, and overlay clicks

### 4. Contract-shaped fixtures + tests

**Updated:** [`src/lib/gis-fixture-data.js`](../../hauska-brief-extension/src/lib/gis-fixture-data.js) — every fixture slot carries a validated `readContract` with per-layer width/provenance variants.

**New:** [`scripts/test-read-contract-envelope.mjs`](../../hauska-brief-extension/scripts/test-read-contract-envelope.mjs)

- Rejects legacy scalar payloads
- Validates honest envelope parsing
- Asserts fixture slot contract validity
- Width saturation mapping

**Dependency:** `@hauska/atom-contract@1.4.0` added to `package.json`.

---

## EngineEnvelope shape (post-migration)

GIS slot envelope (normalized):

```js
{
  payload: { geojson | geometry | demFixture },
  source: { provider, adapterKey, adapter? },
  dataVintage,
  coverage?,
  readContract: ReadContract | null,   // F4 — validated
  contractValid: boolean,
  atomIds: string[],
  atomTrace: { rootAtomIds, layerKey, summary? } | null,
}
```

`ReadContract` per `@hauska/atom-contract/read-contract`:

```js
{
  axes: {
    calibratedConfidence: { estimate, n, intervalWidth, provenance },
    assertedConfidence:   { estimate, n, intervalWidth, provenance },
    consequence:          { derivation, stratum, assertedAt, auditRef? },
  },
  assembledAt: string,
  modelAttribution?: ModelAttributionStamp,
}
```

**Display axis for GIS layers:** `assertedConfidence` (source-quality). **Fill saturation:** `1 - intervalWidth * 0.65`, clamped `[0.35, 1]`.

---

## Coordination notes

| Partner | Expectation | Status |
|---|---|---|
| **cc-agent-C** | Emit `envelope.readContract` on `POST /map-data/gis-layer` and `/map-data` before live layers render | **Required for live Cotality path** — extension refuses scalar-only responses |
| **Map agent** | Import `read-contract-envelope.js`, `gis-map-render.js`, `gis-map-paint.js` into V1 decoupled renderer; do not duplicate saturation in shell | Ready — paint in portable modules |
| **cc-agent-AC** | `@hauska/atom-contract@1.4.0` published | **Unblocked** — pinned |

**Merge order:** Backend ships read-contract on GIS endpoints → live map layers render. Until then, fixture fallback (`getGisFixtureSlots`) remains fully contract-shaped for localhost QA.

---

## Reconciliation with `03_gap_analysis.md`

| Row | Before | After this close |
|---|---|---|
| **F4** | Scalar `{ value, kind }` on extension map | **Extension slice resolved** — normalizer + renderer + UI on read-contract; backend emission still GAP |
| **V4** | EngineEnvelope read-contract consumption absent | **Partial** — extension map consumes contract; map repo V1/V4 still pending decoupled renderer |
| **V5** | Width-as-saturation absent | **Partial** — fill opacity encoding live; contested-ground/triage choropleths still absent |

No contradiction with gap analysis; F4 row moves from GAP to **PARTIAL** for extension, still **GAP** for cortex-api/MCP until cc-agent-C lands.

---

## Validation

```text
npm test   ✅ (includes test-read-contract-envelope.mjs)
npm run build   ✅ (research-bundle + dist rebuilt with atom-contract + zod bundled)
```

---

## Blockers remaining

| Blocker | Owner | Impact |
|---|---|---|
| Live `/map-data/gis-layer` without `readContract` | cc-agent-C | Live Cotality/FEMA layers **withheld** (no dishonest fill) until backend migrates |
| Brief headline still scalar on unmigrated `/brief` response | cc-agent-C | Lay summary uses legacy `confidenceAssertedHtml` fallback — map paths do not |
| Map agent V1 decoupled renderer | map agent | Shell still coupled in `site-map.js`; portable modules ready to extract |
| V5 contested-ground / triage layers | map agent + F5 | Not in scope for Wave 2 extension slice |

---

## Proposed Wave 3 (extension)

1. **Brief `/map-data` + `/brief` read-contract** — remove legacy scalar path from `envelope-confidence.js` once cc-agent-C confirms emission on all Max surfaces.
2. **Atom click-through panel** — expand `atomTrace` into full atom summary fetch via brokerage read API (operator-surface prep for End-state E).
3. **Co-bump** with map agent when V1 renderer mounts — single import graph for `read-contract-envelope.js` shared or copied into map localhost app.

---

## Files touched

| File | Change |
|---|---|
| `package.json` | `@hauska/atom-contract@1.4.0`, test script |
| `src/lib/read-contract-envelope.js` | **NEW** — normalizer + saturation + fixtures |
| `src/lib/gis-proxy-api.js` | F4 envelope import |
| `src/lib/gis-fixture-data.js` | Contract-shaped fixture envelopes |
| `src/lib/gis-map-paint.js` | `fillOpacityWithContract` |
| `src/lib/gis-map-render.js` | Honest fill gate + saturation paint |
| `src/lib/envelope-confidence.js` | `readContractHtml`, pin saturation |
| `src/lib/site-map.js` | Legend, detail, pins, selections |
| `scripts/test-read-contract-envelope.mjs` | **NEW** |
| `research/research-bundle.js` | Rebuilt |

**Operator:** reload extension after `npm run build`. Fixture mesh renders with width-varied saturation; live layers appear only when backend emits `readContract`.
