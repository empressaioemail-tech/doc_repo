---
title: "SURVEY — hauska-map atom-contract usage and stale-pin exposure"
status: active
last_updated: 2026-08-08
owner: planner
type: survey
scope: P:\hauska-map
---

# SURVEY: hauska-map `@hauska/atom-contract` usage

Read-only survey of `P:\hauska-map` at commit `83553f6`. Every claim below is cited to `file:line` or to raw command output captured during the survey.

## VERDICT (question 5 first)

**DROP the dependency. Do not migrate it.**

The contract is providing exactly one thing to this repo: a Zod schema (`READ_CONTRACT_SCHEMA`) and a type-guard (`isWidthedConfidence`) used to decide whether a map fill is renderable. That is 2 runtime symbols doing real work, plus 5 more symbols that are re-exported through a barrel and **never called by either deployed app**. Nothing in this repo constructs, validates, or persists an atom. Both apps are HTTP clients that already type every response shape locally.

Counts:

- **4 source files** import from `@hauska/atom-contract` (2 JS source files with real imports, 1 `.d.ts` shim declaring the symbols, 1 built `dist` artifact). Only **2 are hand-written source imports**.
- **7 distinct symbols** imported from the contract.
- **2 of 7** are actually invoked at runtime anywhere in the repo (`READ_CONTRACT_SCHEMA`, `isWidthedConfidence`).
- **4 of 7** (`createReadContract`, `createThreeAxisConfidence`, `createWidthedConfidence`, `createConsequenceAxis`) are used **only to build test/demo fixture data** in `gis-fixture-data.js`.
- **1 of 7** (`WIDTHED_CONFIDENCE_SCHEMA`) is re-exported and **never referenced anywhere**.
- **0 files** in `apps/command-center` or `apps/property-explorer` import the contract directly.

The migration itself would be mechanical (all 7 symbols still exist at 1.12.0, same subpath), so "migrate" is cheap. But migrating buys nothing: it would pull a heavier package plus its Zod dependency into two front-end bundles to keep running a renderability check whose entire real-world input is a number between 0 and 1. Dropping it is the smaller, more honest surface. Detail in section 5.

The urgency framing in the prompt is **not** borne out for this repo specifically: hauska-map never consumed the property atom family, so being frozen at 1.6.1 costs it no property-atom shapes it was using. What it does cost is section 7 — the drift surfaces, which are real and independent of the pin.

## 1. THE IMPORT SURFACE

Every file importing from an atom-contract package:

| File | Line | Import specifier |
|---|---|---|
| `packages/map-renderer/src/read-contract/index.js` | 13 | `@hauska/atom-contract/read-contract` |
| `packages/map-renderer/src/read-contract/envelope.js` | 8 | `@hauska/atom-contract/read-contract` |
| `packages/map-renderer/src/vanilla.d.ts` | 169-184 | ambient declarations mirroring the symbols (no import statement) |
| `packages/map-renderer/dist/index.d.ts` | 6 | `@hauska/atom-contract/read-contract` (build artifact, not source) |

Declared dependency (not an import, but the pin):

- `package.json:15` — `"@hauska/atom-contract": "^1.5.0"`
- `packages/map-renderer/package.json:25` — `"@hauska/atom-contract": "^1.5.0"`
- `pnpm-lock.yaml:686,690` — resolves `1.5.0` and `1.6.1`
- Installed on disk: **1.5.0** at both `node_modules/@hauska/atom-contract` and `packages/map-renderer/node_modules/@hauska/atom-contract` (verified via `package.json` version field on the resolved pnpm store path).

Also worth noting: `README.md:70` documents the dependency in prose ("Read-contract parsing via `@hauska/atom-contract`").

### Full symbol inventory

`packages/map-renderer/src/read-contract/index.js:6-13` imports and re-exports seven symbols:

```
createReadContract              (index.js:6)
createThreeAxisConfidence       (index.js:7)
createWidthedConfidence         (index.js:8)
createConsequenceAxis           (index.js:9)
isWidthedConfidence             (index.js:10)
READ_CONTRACT_SCHEMA            (index.js:11)
WIDTHED_CONFIDENCE_SCHEMA       (index.js:12)
```

`packages/map-renderer/src/read-contract/envelope.js:6-7` imports two (a subset of the above):

```
isWidthedConfidence             (envelope.js:6)
READ_CONTRACT_SCHEMA            (envelope.js:7)
```

**Distinct symbol set: 7.** No types are imported — every one is a value.

### Where each symbol is actually consumed

| Symbol | Consumed at | Real runtime work? |
|---|---|---|
| `READ_CONTRACT_SCHEMA` | `envelope.js:11` (`.safeParse`) | **Yes** — Zod validation |
| `isWidthedConfidence` | `envelope.js:19,36,44,63` | **Yes** — type guard |
| `createReadContract` | `map/gis-fixture-data.js:231,433` | Fixture construction only |
| `createThreeAxisConfidence` | `map/gis-fixture-data.js:2` (imported) | Fixture construction only |
| `createWidthedConfidence` | `map/gis-fixture-data.js:2` (imported) | Fixture construction only |
| `createConsequenceAxis` | `map/gis-fixture-data.js:2` (imported) | Fixture construction only |
| `WIDTHED_CONFIDENCE_SCHEMA` | re-exported at `index.js:12` | **Never referenced** |

## 2. TYPE-ONLY OR RUNTIME?

**All seven are runtime value imports. Zero are `import type`.** There is no `import type` statement against the contract anywhere in the repo.

This raises the severity above "untidy". The concrete runtime path:

`packages/map-renderer/src/read-contract/envelope.js:10-12`

```js
export function isReadContract(value) {
  return READ_CONTRACT_SCHEMA.safeParse(value).success;
}
```

That is a live Zod parse executing in the browser. It gates rendering at `packages/map-renderer/src/map/gis-map-render.js:279`:

```js
if (!isRenderableEnvelope(slot?.envelope)) {
```

and drives fill saturation at `gis-map-render.js:292` (`envelopeSaturation`) and the summary string at `gis-map-render.js:557` (`formatReadContractSummary`).

So a stale `READ_CONTRACT_SCHEMA` is not a cosmetic problem: if the authoritative read-contract shape gained a required field after 1.6.1, `safeParse` returns `success: false` here, `isReadContract` returns false, `isRenderableEnvelope` falls through to the scalar-confidence branch, and **a map fill silently stops rendering or renders at wrong saturation**. This is the divergent-behavior class, not the untidy class.

Mitigating fact, stated plainly: the schema at 1.5.0 and at 1.12.0 both still parse the same core shape (`axes.calibratedConfidence` etc. — `envelope.js:41,69-71`), and I found no evidence of an actual required-field addition that would break it. The risk is structural, not currently firing. See "WHAT I COULD NOT DETERMINE".

## 3. WHICH APPS ARE AFFECTED?

Dependency topology:

- `apps/command-center/package.json` — depends on `@hauska/map-renderer: workspace:*`. **No `@hauska/atom-contract` entry.**
- `apps/property-explorer/package.json` — depends on `@hauska/map-renderer: workspace:*`. **No `@hauska/atom-contract` entry.**
- `packages/map-renderer/package.json:25` — **the only workspace package with a direct contract dependency.**
- Root `package.json:15` also pins it (the root is a Vite app shell in its own right).

So the contract reaches both apps **transitively, through map-renderer only**. Neither app imports it directly.

map-renderer re-exports the read-contract helpers from its public barrel at `packages/map-renderer/src/index.ts:80-89`:

```
isReadContract, isRenderableEnvelope, envelopeSaturation, envelopeIntervalWidth,
isLegacyScalarConfidence, isWidthedConfidence, formatWidthedConfidence,
formatReadContractSummary
```

Consumers of map-renderer:

- `apps/command-center` — 8 source files import from `@hauska/map-renderer` (`src/admin/control/panels/LayerRegistryView.tsx`, `src/admin/workspace/tileRegistry.tsx`, `src/admin/workspace/tiles/liveGis.ts`, `src/admin/workspace/tiles/LiveMapTile.tsx`, plus 4 test files).
- `apps/property-explorer` — 12 source files import from `@hauska/map-renderer` (`src/browse/ExplorerMap.tsx`, `src/browse/liveGis.ts`, `src/browse/consumer-layers.ts`, `src/browse/envelope-overlay.ts`, `src/browse/road-overlay.ts`, `src/browse/mapToolsController.ts`, `src/browse/MapToolset.tsx`, `src/browse/satelliteBase.ts`, `src/browse/geoMeasure.ts`, `src/browse/SavedPropertyPins.tsx`, `src/lib/config.ts`, plus a test).

Critically: I grepped both `apps/` trees for every one of the eight re-exported read-contract symbol names. **No app source file calls any of them.** The only hits inside `apps/` are in `apps/command-center/dist/assets/index-BhrwlQ4M.js` — the built bundle, where the code arrives via the barrel, not via an app-level call site.

### County Manifest panel — explicit finding

**The County Manifest panel does not touch the contract package at all.** Stated explicitly as requested.

- `apps/command-center/src/admin/control/panels/CountyManifestGrid.tsx:8-22` — imports only React, `../../api/spineClient`, and local panel modules.
- `apps/command-center/src/admin/control/panels/CountyLedger.tsx:14-16` — imports only React, `../../api/spineClient`, and `../primitives`.
- `apps/command-center/src/admin/control/panels/countyManifestTypes.ts:8` — its single import is `import type { Severity } from '../primitives'`.

The panel's data shapes (`ManifestCell`, `ManifestSummary`, `ManifestCountyRow`, `ManifestLedgerResponse`, `RailDef`) are all declared locally in `countyManifestTypes.ts:16-72`, and the 13-rail metadata is the local constant `MANIFEST_RAILS` at `countyManifestTypes.ts:75-89`. Data arrives over HTTP; the file's own header comment (`countyManifestTypes.ts:3-6`) says cell state "comes from GET /api/county-ledger `manifestCells`, not from this table."

This is a clean example of the pattern that makes the drop-the-dependency verdict credible: the newest, most data-heavy panel in the Command Center was built with **zero** contract coupling and works fine.

## 4. THE MIGRATION SURFACE

If the pin moved to `@empressaio/atom-contract@^1.12.0`:

**Every one of the 7 imported symbols still exists at 1.12.0, on the same `./read-contract` subpath.** Verified against source at `P:\hauska-atom-contract` (version confirmed 1.12.0 via `package.json`):

| Symbol | 1.12.0 location | Status |
|---|---|---|
| `createReadContract` | `src/read-contract/read-contract.ts:96` | present |
| `createThreeAxisConfidence` | `src/read-contract/read-contract.ts:79` | present |
| `createWidthedConfidence` | `src/read-contract/common.ts:75` | present |
| `createConsequenceAxis` | `src/read-contract/consequence.ts:84` | present |
| `isWidthedConfidence` | `src/read-contract/common.ts:88` | present |
| `READ_CONTRACT_SCHEMA` | `src/read-contract/read-contract.ts:65` | present |
| `WIDTHED_CONFIDENCE_SCHEMA` | `src/read-contract/common.ts:45` | present |

**(a) No longer exists: none. (b) Changed shape: none detected. (c) Moved export path: none that affect this repo.**

The `./read-contract` subpath is still declared in the 1.12.0 `exports` map. The barrel at `src/read-contract/index.ts:10-15` re-exports `common.js`, `consequence.js`, `model-attribution.js`, `read-contract.js`, `reasoning-axes.js`, `fixtures.js` — a superset of the 1.5.0 barrel (`dist/read-contract/index.d.ts`), which lacked only `reasoning-axes.js`. Purely additive at the barrel level.

On the flagged `GEO_COORD_SCHEMA` / `GeoCoord` relocation: **it does not affect this repo.** Those live at `src/property/common.ts:114,116` and are re-exported via the `./property` barrel (`src/property/index.ts:11` re-exports `road-node.js`, which imports `GEO_COORD_SCHEMA` from `common.js` at `src/property/road-node.ts:10`). hauska-map never imports the `./property` subpath and never referenced `GeoCoord`. Non-issue here.

**Mechanical or code changes?** Purely mechanical.

**Files touched by a straight migration: 5.**

1. `package.json:15` — rename + bump
2. `packages/map-renderer/package.json:25` — rename + bump
3. `packages/map-renderer/src/read-contract/index.js:13` — specifier rename
4. `packages/map-renderer/src/read-contract/envelope.js:8` — specifier rename (plus the comment on line 2 naming the old package)
5. `pnpm-lock.yaml` — regenerate

Plus optionally `README.md:70` (prose) and `packages/map-renderer/src/vanilla.d.ts:169-184` (ambient declarations reference the symbols but not the package name, so no change strictly required).

One real consideration if migrating: 1.12.0 is a substantially larger package (adds `temporal`, `og`, `reasoning`, `property` subpaths per its `exports` map). Subpath imports plus `"sideEffects": false` should keep tree-shaking effective, but this repo would be pulling a much bigger dependency to use the same 2 working symbols.

## 5. IS THE CONTRACT EVEN NEEDED HERE?

**No.** Assessment with evidence.

What the contract actually provides this repo:

1. **`READ_CONTRACT_SCHEMA.safeParse()`** at `envelope.js:11` — runtime structural validation of a read-contract object.
2. **`isWidthedConfidence()`** at `envelope.js:19,36,44,63` — a type guard.
3. **4 fixture-builder functions** used only in `map/gis-fixture-data.js:231,433` to construct the Bastrop demo corpus — that is test/demo data, not production reasoning.
4. **`WIDTHED_CONFIDENCE_SCHEMA`** — dead re-export.

Could this be provided another way? Yes, and cheaply. The consuming logic is entirely shape-shallow. Everything `envelope.js` does with a parsed read-contract is read two or three fields:

- `envelope.js:41` — `rc.axes.calibratedConfidence.intervalWidth`
- `envelope.js:69-71` — `contract.axes.calibratedConfidence`, `.assertedConfidence`, `.axes.consequence`
- `envelope.js:63` — `conf.estimate`, `conf.n`, `conf.intervalWidth`, `conf.provenance`

And the sole numeric consumer reduces all of it to one clamp (`envelope.js:52-55`):

```js
const w = Math.max(0, Math.min(1, intervalWidth));
return Math.max(0.35, 1 - w * 0.65);
```

A local predicate checking `typeof envelope.confidence.intervalWidth === "number"` would drive that rendering decision identically without a Zod dependency or a cross-repo version coupling.

**Does any runtime validation depend on it?** Yes — exactly one call, `READ_CONTRACT_SCHEMA.safeParse` at `envelope.js:11`. That is the honest counterweight to the drop recommendation, and it deserves to be named rather than waved off: dropping the package means replacing a schema-backed check with a hand-written one, which trades authoritative validation for local approximation. Whether that trade is right is the planner's call. What the evidence supports is that the check is **defensive rendering logic, not contract enforcement** — this repo neither emits nor persists atoms, so there is no atom whose conformance this parse protects. It is a front-end guard against malformed API responses.

Supporting evidence that the front-end pattern here is already "type responses locally":

- The County Manifest panel does exactly this with zero contract coupling (`countyManifestTypes.ts:16-72`).
- `apps/command-center/src/admin/api/atomTrace.ts` declares ~15 local response interfaces (lines 13, 21, 40, 74, 88, 127, 136, 293, 302, 326, 403, 410, 419, 459, 473, 482) covering atom-shaped data — **including atom payloads** — without importing the contract.
- `apps/property-explorer/src/lib/baked-facets.ts:38` declares `BakedFacetPayload` with a comment at line 37 that says outright: "mirrored from the backend contract."

The repo has already, in practice, chosen local typing everywhere except this one 2015-era corner of map-renderer.

## 6. DEPLOYMENT REALITY

**Command Center — confirmed deployed, and the contract runtime IS in the shipped bundle.**

- Vercel project: `cmdcenter` (`.vercel/project.json` → `{"projectId":"prj_M9jNh8nBEHW0CnaUKlNT4pp4ebpe","projectName":"cmdcenter"}`; identical file at `apps/command-center/.vercel/project.json`).
- Build: root `vercel.json` runs `pnpm --filter ./apps/command-center build`, output `apps/command-center/dist`.
- Live served bundle: `https://cmdcenter-blush.vercel.app/` references `assets/index-BhrwlQ4M.js`.
- **The served bundle is byte-identical to the local build.** md5 of both local `apps/command-center/dist/assets/index-BhrwlQ4M.js` and the fetched live copy: `b890e72f8b372fc2af4820e504db9b22`.

Is the contract reaching the shipped bundle? **Yes — not tree-shaken out.** Direct evidence from the live downloaded bundle:

```
unrenderable (scalar-only)     1
No read-contract object        1
ZodError                       1
```

Those first two strings come from `envelope.js:63` and `envelope.js:68`. The `ZodError` hit (alongside `invalid_union`, `unrecognized_keys`, `invalid_string`, `too_small`, each 1 occurrence in the local bundle) confirms **Zod itself is bundled and shipping to browsers**. The contract's runtime is live in production on the Command Center.

Corroborating in the built artifact: `packages/map-renderer/dist/index.js:340-346` shows all seven symbols imported into the built bundle, and `dist/index.js:354-407` contains the compiled envelope helpers with the `safeParse` call at line 355.

**Property Explorer — deployed as a separate Vercel project; live bundle not verified.**

- Vercel project: `property-explorer` (`apps/property-explorer/.vercel/project.json` → `{"projectId":"prj_vcZGXbqdffk5C20WzaplEpzFynK3","projectName":"property-explorer"}`) — a distinct projectId from cmdcenter, confirming two separate Vercel projects from one repo.
- Build: `apps/property-explorer/vercel.json` runs `cd ../.. && pnpm --filter property-explorer build`, output `dist`.
- Local build artifact `apps/property-explorer/dist/assets/index-D33709IW.js` (dated Jul 29) contains the same markers: `unrenderable (scalar-only)` 1, `No read-contract object` 1, `intervalWidth` 1. So the contract runtime reaches PE's bundle too.
- I could not resolve PE's live alias (see below), so the PE claim is **inferred from the local build artifact**, not from a served bundle.

## 7. DRIFT RISK

Places where this repo defines a shape locally that also exists authoritatively elsewhere. This is the section with the most durable value, and the findings are independent of the contract pin.

**1. County rail metadata — 13 rails as a local TS constant.**
`apps/command-center/src/admin/control/panels/countyManifestTypes.ts:75-89` defines `MANIFEST_RAILS` with 13 entries (`geometry`, `cad`, `join`, `zoning`, `roads`, `flood`, `envelope`, `landuse`, `footprint`, `easement`, `owner`, `rrc`, `mud`), each with `key`, `label`, `short`, `kind`. `county_rail` is a real DB table in another repo. The file's own comment (lines 3-4) admits it "mirrors" a doc_repo decision record. `RAIL_COUNT` (line 91) is derived from array length, and `groupCellsByCounty` (line 152) sorts by `MANIFEST_RAILS.findIndex(...)` — so a rail added or reordered upstream silently mis-sorts or drops from the grid rather than erroring. **Highest-traffic drift surface.**

**2. PE buildable-envelope result type vs the contract's envelope atom.**
`apps/property-explorer/src/lib/buildable-envelope.d.ts:82` defines `BuildableEnvelopeResult`. The contract defines `BuildableEnvelopeAtomInstance` at `/p/hauska-atom-contract/src/property/buildable-envelope.ts:29` with `BUILDABLE_ENVELOPE_SCHEMA` at line 45. These are genuinely different objects — the local one is an API response envelope (`ok`, `status`, `empty`, `reason`, `geometry`, `setbacks`), the contract one is an atom instance (`atomDid`, `parcelNodeId`, `reasoningChain`, `accessPolicy`, `atomTier`). Not a naive duplicate, but the same domain concept modeled twice across a network boundary. The local file's header (line 1) calls itself a "Type shim."

**3. Setback governed-by shapes hand-mirrored from the engine.**
`buildable-envelope.d.ts:34` (`GovernedByCondition`), `:51` (`GovernedBy`), `:63` (`SetbackFieldProvenance`), `:75` (`SetbackFieldNotes`). Comment at line 40-42 says these "Mirror the engine's `governed_by` shape on setback-table cells." Hand-written mirrors of an engine-side shape, in a `.d.ts` with no runtime validation — the classic silent-drift configuration.

**4. Baked facet payload — explicitly self-described as a mirror.**
`apps/property-explorer/src/lib/baked-facets.ts:38` declares `BakedFacetPayload`; line 37 comment: "mirrored from the backend contract." Includes `zoning`, `envelope`, `baseFacts.landUse`, `acreage` sub-shapes (lines 42-60), all duplicating server-side truth.

**5. Scalar confidence in PE vs widthed confidence in the contract.**
`apps/property-explorer/src/lib/baked-facets.ts:58` declares `confidence?: number` — a bare scalar. The contract's whole read-contract premise is that scalar confidence is *unrenderable* (`envelope.js:14` comments "Legacy EngineEnvelope confidence — not renderable under V4"; `isLegacyScalarConfidence` at `envelope.js:15` exists specifically to reject it). So PE's baked-facets path types confidence in exactly the shape the sibling package classifies as legacy-and-unrenderable. **This is a live contract-says-X-product-does-Y instance**, and it is not caused by the stale pin — it would persist after any migration.

**6. Road wire shape vs contract road-node atom.**
`apps/property-explorer/src/browse/road-overlay.ts:74` defines `AttachingRoadWire` (`roadNodeId`, `displayName`, `isPedestrianWay`, `centerline`, `row.assumedWidthFt`, `row.provenance.osmHighwayTag`, `row.leftEdge`/`rightEdge`, `sourceCitation`). The contract defines `RoadNodeAtomInstance` at `/p/hauska-atom-contract/src/property/road-node.ts:93` with `ROAD_ROW_SCHEMA` (line 68: `assumedWidthFt`, `provenance`, `leftEdge`, `rightEdge`) and `ROW_PROVENANCE_SCHEMA` (line 58: `kind`, `assumedWidthTableKey`, `osmHighwayTag`, `note`). Field-for-field near-identical, independently declared. The comment at `road-overlay.ts:70` explains why: "Literal (not a runtime import) so PE vitest does not require renderer dist" — drift accepted deliberately for test ergonomics.

**7. `accessPolicy` handled as a bare string with defensive fallbacks.**
`apps/command-center/src/admin/control/panels/AtomInspector.tsx:59` types `accessPolicy: string`, and lines 87/112 read `atom.accessPolicy ?? atom.policy ?? atom.access_policy ?? cal.scope`. The contract has an authoritative five-value union. Lines 215/343/482 branch on `accessPolicy.includes('public')` — substring matching against a closed enum. A new policy value containing "public" would be silently classed as safe.

**8. `SEARCH_ATOMS_ENTITY_TYPES` local enum.**
`apps/command-center/src/admin/api/searchAtomsContract.ts:20-27` hardcodes 6 entity types (`code-section`, `code-definition`, `code-amendment`, `code-cross-reference`, `code-edition`, `jurisdiction-corpus`). Authoritative entity types live in the contract; the file name itself says "Contract" while defining a local copy.

**9. ID-format regexes duplicated from the atom identity spec.**
`apps/command-center/src/admin/api/atomTrace.ts:278-279`:
```
BOUNDARY_EDGE_ID_RE = /^\d{5}:[A-Za-z0-9._-]+:boundary:\d+$/
PARCEL_NODE_ID_STRICT_RE = /^\d{5}:[A-Za-z0-9._-]+$/
```
The contract enforces the same `{county_fips}:{prop_id}` format in `BUILDABLE_ENVELOPE_SCHEMA` (`/p/hauska-atom-contract/src/property/buildable-envelope.ts:54-58`) and `atomDid` prefix rules (line 48-52). Two independent encodings of one identity grammar.

**10. Panel-level atom response shapes in `atomTrace.ts`.**
~15 interfaces at lines 13, 21, 40, 74, 88, 127, 136, 293, 302, 326, 403, 410, 419, 459, 473, 482 — including `PropertyAtomChainBody` (136), `PropertyChainSlotKey` (133, a 3-value literal union of `zoning-fact` / `setback-rule` / `buildable-envelope`), `NodeAtomSummary` (459), `AtomByDidBody` (482). Note `PropertyChainSlotKey`'s three values are exactly three of the contract's property atom kinds (`src/property/index.ts:12-14` re-exports `zoning-fact.js`, `setback-rule.js`, `buildable-envelope.js`) — a local literal union tracking an authoritative family that has since grown to include `parcel-terrain-model`, `road-node`, `building-footprint`, `utility-easement`.

Pattern across all ten: this repo consistently hand-mirrors authoritative shapes at the HTTP boundary. Items 1, 5, and 7 are the ones where a silent wrong answer is most plausible today.

## WHAT I COULD NOT DETERMINE

- **Whether the read-contract shape actually changed between 1.6.1 and 1.12.0 in a way that breaks `safeParse`.** I confirmed all seven symbols still exist and the barrel is additive, but I did not diff the `READ_CONTRACT_SCHEMA` field-by-field across versions. The 1.6.1 artifact is not installed locally (only 1.5.0 is on disk, despite the lockfile resolving both), so I could not compare 1.6.1 directly. The severity claim in section 2 is therefore structural risk, not a demonstrated live break.
- **Property Explorer's live URL and served bundle.** `property-explorer.vercel.app`, `property-explorer-blush.vercel.app`, `property-explorer-git-main.vercel.app`, `smartsite.hauska.dev`, and `smartsite.empressa.io` all failed to resolve or returned 404/000. The repo contains no deploy-alias documentation I could find. PE's shipped-bundle claim is inferred from the local `dist` artifact dated Jul 29, which may lag the deployed version.
- **Whether the PE `dist` artifact I inspected corresponds to what is currently deployed.** Local build is Jul 29; repo tip is `83553f6`. Unverified.
- **Whether the `county_rail` DB table's current rail set matches the local 13.** The table lives in a different repo which I did not inspect; I only confirmed the local constant's contents and that it self-describes as a mirror.
- **Whether root `package.json`'s Vite app shell (the `dev`/`build` scripts at root) is itself deployed anywhere,** or is vestigial now that both apps have their own Vercel projects. Its contract pin at line 15 may be dead weight.
- **Runtime behavior under an actually-divergent read-contract payload.** I did not execute the app or feed it a 1.12.0-shaped read-contract object; the render-gating analysis is from reading `gis-map-render.js:279,292,557` and `envelope.js`, not from observed behavior.
