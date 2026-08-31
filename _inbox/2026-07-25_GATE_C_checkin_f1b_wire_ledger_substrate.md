---
id: 2026-07-25_GATE_C_checkin_f1b_wire_ledger_substrate
title: Gate C CLOSED — F1b wire ledger + substrate (GTM 403 was the last item)
status: closed
date: 2026-07-25
applies_to: hauska-map/apps/command-center, hauska-map/apps/property-explorer, hauska-mcp-server
implements: [27a_jurisdiction_factory_engine_spec, 27b_f1_command_center_completion_program]
wdll_items: [3, 4, 5, 6]
owner: nick
related: [2026-07-25_GATE_B_checkin_f1a_console_audit, 2026-07-25_f1a_console_audit, 2026-07-25_setback_correctness_and_corner_lots_pickup]
---

# Gate C CLOSED — F1b complete

Closed 2026-07-25. Last item was GTM consent 403 (misdiagnosed as data bounce). Facets/atom-chain were already clean.
## Step 1 status (2026-07-25) — PRs merged, preview/canary live

| Repo | PR | CI | Deploy |
|---|---|---|---|
| hauska-map | [#57](https://github.com/empressaioemail-tech/hauska-map/pull/57) MERGED `b14d500` | PE Test+Typecheck green | **PE preview (canary)** `https://property-explorer-mjrbkwvrj-empressaioemail-techs-projects.vercel.app` — NOT promoted to `property-explorer-xi` (WDLL 5 held) |
| hauska-map | same | — | **CC production canary** `https://cmdcenter-blush.vercel.app` (operator console; Node&Graph + `fetchAtomTrace` + tally artifact confirmed in shipped bundle) |
| hauska-mcp-server | [#49](https://github.com/empressaioemail-tech/hauska-mcp-server/pull/49) MERGED `1ccf123` | build-test green | Cloud Run **`hauska-mcp-server-00029-9xn` @ 100%** image `:1ccf123` |

**WDLL 5 still held** — PE customer Map\|Ledger not flipped; PE stays on preview only.

### Jest-dom baseline (not masking F1b)

`origin/main` with built renderer: LiveMapTile+ReportTile **20/20 pass**. F1b branch initially failed `toBeInTheDocument` because `@testing-library/jest-dom/vitest` side-effect import silently failed to attach matchers in the monorepo (vitest 3+4 present). Fixed via explicit `expect.extend(matchers)` in `apps/command-center/src/test/setup.ts`. After fix: CC F1b-touched suites **30/30**. Not pre-existing test rot — an environment attach bug, now closed.

## What landed (by WDLL / QA)

| Item | Deliverable | Evidence |
|---|---|---|
| WDLL 3 | Node & Graph STUB → LIVE; reuses Parcel Trace `fetchAtomTrace` | `apps/command-center/src/admin/api/atomTrace.ts` + `panels/NodeGraph.tsx`; PanelRegistry `live: true` |
| WDLL 4 | Bidirectional parcel↔node on ONE id (`node=` hash) | `parcelNodeBinding.tsx`; `CONTEXT_PARAM_KEYS` includes `node`; LiveMapTile locks via `parcelNodeIdFromSelection`; NodeGraph "Lock on map" |
| WDLL 6 | De-fork `liveGis.ts` → `packages/map-renderer/src/live-gis.ts` | PE + CC thin re-exports; dogfood `oneReadPath.test.ts` |
| G6 | MCP + PE regex unified `^\d{5}:[^/\s]+$` + CI assert | PE `parcel-node-id.test.ts`; MCP `tests/parcel-node-id-g6.test.ts` (3/3 pass) |
| QA-2 | Site-plan id-flow: forward `isError`, request-id fallback | `mcp-server-client.ts`, `mapMcpSitePlanPayload(..., requestParcelNodeId)` |
| QA-3 | Vocabulary: present / absent / pending | `baked-facets.ts` + InspectCard FacetRow + personaRegister; tests green |
| Calibration | Honest STUB (no lying LIVE) | PanelRegistry `stub: true`; panel copy says STUB |
| WDLL 8 | Dogfood smoke + one-read-path | `NodeGraph.smoke.test.tsx` (5 tests with oneReadPath); PE vitest 67/67 |

## Branches / worktrees

- `hauska-map` worktree: `P:\hauska-map-worktrees\f1b-wire` · branch `feat/f1b-wire-ledger-substrate`
- `hauska-mcp-server` worktree: `P:\hauska-mcp-worktrees\f1b-g6-id` · branch `feat/f1b-g6-parcel-id-regex`

## Local verification (verbatim)

```
# PE
> property-explorer test
Test Files  10 passed (10)
Tests  67 passed (67)

# CC dogfood
> vitest run oneReadPath + NodeGraph.smoke
Test Files  2 passed (2)
Tests  5 passed (5)

# MCP G6
> node --import tsx --test tests/parcel-node-id-g6.test.ts
tests 3 / pass 3 / fail 0
```

Note: full CC vitest suite still has pre-existing `toBeInTheDocument` matcher failures (jest-dom setup) unrelated to F1b; LiveMapTile `toLiveOverlays is not a function` from the barrel-mock was fixed by relative re-export of live-gis.

## Planner live probes owed before Gate C go

1. Deploy / preview CC → open `#panel=node-graph` → Travis row shows Gate A shape; inspect `48209:156346` → slot pills + shared trace JSON.
2. Map click (feature with `parcel_node_id`) → hash gains `&node=…`; Node & Graph shows Locked.
3. PE named parcels (P-3 `48021:34169`, Travis SF-2): Buildable row says pending / honest-zero — **not** "not verified here" when setbacks present.
4. Site-plan export for a known id: no false "MCP response missing parcelNodeId" when tool errors (isError surfaced).
5. Grep PE for engines/governance panels: still zero (two-products guardrail).

## Step 2 live bugs (operator-found) — CLOSED 2026-07-25

| Bug | Root cause | Fix | PR / deploy | Live probe |
|---|---|---|---|---|
| CC Node&Graph "not valid JSON" | Gate A tally UTF-16 LE + BOM | UTF-8 rewrite + BOM strip | [#58](https://github.com/empressaioemail-tech/hauska-map/pull/58) `1dbe166` | Tally `7b0a2020`; Travis **61.23%** |
| PE export 500 | Vercel ESM missing `.js` on `parcel-node-id` | `./parcel-node-id.js` | #58 → then prod | Unauth **401** (not 500) |
| CC node-inspect MISSING on full-chain parcels | (1) SPA rewrite stole `/api/spine/*` → HTML 200; (2) inspect used `/atoms/trace` which **404s** for property atoms that exist on StoragePort / atom-chain | Restore `/api/spine/(.*)→?upath=` rewrite; Node&Graph → `fetchPropertyAtomChain` (same path as PE/Gate C); HTML fail-closed in `getJson` | [#59](https://github.com/empressaioemail-tech/hauska-map/pull/59) `9fe18fe` → **CC + PE prod** | See step-2 close probes below |

Cold-start retry: folded into PE `fetchAtomChain` + CC `fetchPropertyAtomChain` (one retry after 1.2s on unreachable/502/503/504).

## Step 2 close — WDLL 5 FLIPPED TO PROD (2026-07-25)

| Surface | URL | Deploy |
|---|---|---|
| **CC prod** | https://cmdcenter-blush.vercel.app `#panel=node-graph` | `dpl_31TdDjPBk81ynAac6tKm6Pj4MxME` (root `vercel.json` spine rewrites) |
| **PE prod** | https://property-explorer-xi.vercel.app | `dpl_5iDAcMChuP8qYABA64chBopDLhKW` — Map\|Ledger dock live (`pe-parcel-ledger`) |

### Verbatim prod probes (planner, 2026-07-25)

```
# CC spine rewrite restored (was HTML)
/api/spine/retrieval/health -> 200 application/json
/api/spine/retrieval/property-nodes/48209%3A156346/atom-chain -> 200 JSON
/api/spine/retrieval/property-nodes/48029%3A410119/atom-chain -> 200 JSON

# Slot status (atom-chain — what Node&Graph pills now read)
48209:156346 zf=present sr=present be=present
48029:410119 zf=present sr=present be=present

# PE prod WDLL 5 + two-products
bundle~=pe-parcel-ledger : True
bundle~=Parcel ledger : True
bundle~=engine-console / license-access / Autonomous Engines / Node & Graph : False

# PE facets
48209:156346 path=atom-chain zoning=HC setbacks=True
48029:410119 path=atom-chain zoning=R-4 setbacks=True
48021:34169  path=atom-chain zoning=P-3 setbacks present buildablePct=0
bundle has 'setbacks on file': True

# PE export unauth
/api/pe-terrain-export -> 401
/api/pe-site-plan-export -> 401
```

Operator still owes (browser, signed-in on prod): node-inspect pills in the CC UI; parcel↔node lock both directions; signed-in export downloads real DXF/IFC/PDF.

## Explicitly NOT done (post–Gate C)

- Mechanical LIVE/STUB badge (F1c / WDLL 7)
- Live re-SELECT tally endpoint (UI still serves Gate A committed artifact)
- Retrieval min-instance warmth (retry landed; warmth optional)

## Customer-ready punch-list (post flip) — CLOSED 2026-07-25

Operator held WDLL 5 customer-complete on three items after node-inspect verified. Closed on prod via hauska-map [#60](https://github.com/empressaioemail-tech/hauska-map/pull/60) `2cad1f4` → `property-explorer-xi`.

| # | Item | Fix | Live probe |
|---|---|---|---|
| 1 | Site-plan paywall blocks operator QA | Same operator/dev bypass as terrain: signed-in + `PE_EXPORT_DEV_BYPASS=1` (set on PE Production) or `X-PE-Export-Dev-Bypass` secret; anonymous still 401; customers without bypass still 402 | Unauth export still **401** |
| 2 | PE showed county "Parcel ledger" dock (two-products regression) | Removed `ParcelLedger` + tally artifact from PE; CC keeps the balance sheet | Bundle: `pe-parcel-ledger` / `Parcel ledger` / `Bastrop` = **False** |
| 3 | Data bounce — same parcel different answers (cold-start rendered as "not verified") | BFF retries atom-chain 5x then **503 retryable** (never 200 empty zoning); client retries + loading vocab; `atom_path_pending` → pending/Loading, never honest-absence | `48021:141209` ×5 → always `atom-chain` zoning=P-3 setbacks=F25/S0/R0 |

### Verbatim prod re-probe (2026-07-25)

```
bundle~=pe-parcel-ledger : False
bundle~=Parcel ledger : False
bundle~=Bastrop : False

# Bounce — same answer every reload
48021:141209 #1..#5 status=200 path=atom-chain zoning=P-3 setbacks=F25/S0/R0
48021:60987  #1..#3 path=atom-chain zoning=P-3 setbacks=True

# Customer paywall still real when unsigned
/api/pe-terrain-export -> 401
/api/pe-site-plan-export -> 401
```

Operator QA: sign in on prod (bypass armed) → site-plan export should skip Stripe 402 and return real DXF/IFC/PDF.

## False-402 follow-up (2026-07-25) — CLOSED pending prod redeploy

Same-session live logs: `POST /api/pe-terrain-export` **200**, `POST /api/pe-site-plan-export` **402**, with `PE_EXPORT_DEV_BYPASS=1` armed. PE entitlement bypass was not the failure; the site-plan BFF mapped **every** MCP `isError` to HTTP 402, so the client opened the Stripe modal for engine/upstream failures.

Fix: hauska-map [#61](https://github.com/empressaioemail-tech/hauska-map/pull/61) `412e0ec` — classify setback → 422, real payment messages → 402 (503 under bypass), else → 502 with real message; mirror on terrain; pass address into site-plan refresh. Prod redeployed manually (`vercel deploy --prod`) → aliased `property-explorer-xi` (`dpl_BDGwLxZ9ow9yMMe9SRE8u41R8gUZ`).

Re-probe: signed-in Export site plan → **200 + download** or honest **422/502** notice — never Stripe for non-payment failures.

## Planner ruling (2026-07-25) — bounce was a MISDIAGNOSIS; real issue was GTM 403

**Bounce dropped.** Planner + operator console confirmed: parcel-data path is clean and deterministic — `/api/spine/property-atoms/48021:34737/facets` → HTTP 200, `X-PE-Read-Path: atom-chain`, same answer every call. There was **no data bounce**. The console error on every hard refresh was a different endpoint:

`POST /api/spine/cortex/api/brokerage/v1/gtm/property-explorer/consent` → **403**

(Confirmed live: gtm/consent via spine = 403, facets = 200.) Do not add more retrieval retry or min-instance warmth under F1 for this symptom.

### Root cause

`gtmClient` posted funnel consent through `CORTEX_PROXY_BASE` (`/api/spine/cortex/...`). PE `spine.ts` anonymous browse gate correctly allows only facet/envelope/map-data — GTM is forbidden → **403**. The dedicated BFF `/api/pe-gtm` already existed and worked (service key → cortex PE funnel): consent **200**, events **201**.

### Fix

hauska-map [#63](https://github.com/empressaioemail-tech/hauska-map/pull/63) `b46c471` — point `gtmClient` at `/api/pe-gtm?path=consent|events`. Prod redeployed → `property-explorer-xi` (bundle `index-07ku9ef9.js`).

### Clean-console verification (browser CDP, live)

Parcel `48021:34737` load:

| Request | Status |
|---|---|
| `/api/pe-gtm?path=consent` | **200** |
| `/api/pe-gtm?path=events` | **201** (×2) |
| `/api/spine/property-atoms/.../facets` | **200** |
| spine GTM / 4xx on gtm|consent|spine/cortex | **none** |

Consent body: `ok:true`, `sourceSurface:"property-explorer"`, `consentVersion:"2026-07-21-property-explorer-v1"`.

## GATE C — CLOSED 2026-07-25

| Item | Status |
|---|---|
| Data true+available (facets 200 / atom-chain) | **Met** |
| Ledger in CC only (two-products) | **Met** |
| Exports auth-gated; soft-422 copy; no false-402 | **Met** |
| No data bounce (misdiagnosis withdrawn) | **Met** (N/A — was GTM 403) |
| GTM consent on load (no console 403) | **Met** — [#63](https://github.com/empressaioemail-tech/hauska-map/pull/63) |

**Out of F1:** setback S0'/R0' + corner lots → `_inbox/2026-07-25_setback_correctness_and_corner_lots_pickup.md`.

**Next:** F1c (WDLL 7 mechanical badge) when operator queues it. Gate C / F1b customer path is closed.
