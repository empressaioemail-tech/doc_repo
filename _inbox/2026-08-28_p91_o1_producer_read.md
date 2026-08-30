---
id: 2026-08-28_p91_o1_producer_read
title: P-91 O1 — X-ray 42% producer read (48021:33223)
date: 2026-08-28
status: accepted-ruling-b
planner_decision: _decisions/2026-08-28_p91_o1_envelope_xray_must_refuse.md
plan_row: P-91
wdll_item: 7
snapshot: legacy-design-tools-p91-cite origin/main 5a20f61d; hauska-map parcel-fact-sheet + fact-sheet-resolver read for X-ray seam (not in LDT tree)
---

# O1 producer read — Buildable (approximate), 42% on 48021:33223

## Ruling

**B — X-ray must refuse envelope the same way MCP refuses (`atom_path_pending`).** Planner accepted 2026-08-28 after re-reading the write paths. Decision `_decisions/2026-08-28_p91_o1_envelope_xray_must_refuse.md`.

MCP is correct on this fact today. The X-ray reaches a live geometry derive side path that MCP R1/draw deliberately does not call. There is no buildable-envelope atom or bake facet MCP can serve with matching provenance.

## Producer (write path)

The headline string **"Buildable (approximate), 42% of the lot"** is not stored anywhere. It is composed at render time.

| Step | Function | File |
|------|----------|------|
| 1 — verdict text | `composeVerdict` → `envelopeSegment` | `hauska-map/packages/parcel-fact-sheet/src/index.ts` (~567–591) |
| 2 — sheet envelope | `envelopeValue` | `hauska-map/apps/property-explorer/src/lib/fact-sheet-resolver.ts` (~1096–1201) |
| 3 — live geometry merge | `patchFacetsEnvelopeFromLive` → `augmentFacetsWithLiveEnvelope` → `applyLiveDeriveToFacets` | `hauska-map/apps/property-explorer/src/lib/live-envelope-augment.ts` |
| 4 — live POST client | `fetchLiveEnvelopeDerive` → `fetchBuildableEnvelope` | `live-envelope-augment.ts` + `buildable-envelope.js` |
| 5 — HTTP derive tail | `deriveAndRespond` | `legacy-design-tools-p91-cite/artifacts/api-server/src/routes/brokeragePlaceBuildableEnvelope.ts` (~887+) |
| 6 — **pct computation** | **`deriveBuildableEnvelope`** | **`legacy-design-tools-p91-cite/artifacts/api-server/src/lib/buildableEnvelope/derive.ts` (~170–221, `buildableAreaPct`) |
| 7 — per-edge inset feet | `insetFeetForLabeling` → `roadClassSetbackFt` (when table matches) | `derive.ts` + `edgeLabeling.ts` + `roadClassSetbacks.ts` |

**Resolver entry:** `DefaultFactSheetResolver.resolveUncached` calls `fetchLiveEnvelopeDerive` when `facetsNeedLiveEnvelopeDerive(facets)` is true (atom-chain facets carry `envelope.status === "ok"` + setback scalars, geometry withheld). Then `envelopeValue` reads `facets.envelope.buildableAreaPct` populated by the live derive response.

**Road-class setback table:** `deriveBuildableEnvelope` loads `roadClassSetbackTableForJurisdiction` internally (`roadClassSetbacks.ts`). For Bastrop it returns a table only when the district matches **P-5** (`BASTROP_P5_ROAD_CLASS_SETBACKS`). Other districts use flat district scalars from the codified setback table, still via `labelEdges` + `insetFeetForLabeling`. The pct is always a geometry inset product of edge labeling + setback feet, not a stored atom outcome.

## MCP refuse path (different route, same fact class)

| Step | Function | File |
|------|----------|------|
| Tier-1 bake | `computeTier1Envelope` — always `declined` / `atom_path_pending` | `artifacts/api-server/src/lib/nodeFacetBakeTier1.ts` (~92–121) |
| R1 brief | `loadBakedNodeFacetSnapshot` → `extractEnvelopeBriefRefusal` → section `data: null` + refusal | cortex `propertyExplorer` research/brief route (bake-only read) |
| Draw overlay | `tryAssembleParcelDrawFromReads` → `assembleParcelDraw` | `parcelDrawFromReads.ts` + `parcelDrawStub.ts` (~294–301) |

`assembleParcelDraw` **always** emits envelope overlay `state: "refused"` with `reason: envelopeRefusalReason ?? "atom_path_pending"`. It never calls `deriveBuildableEnvelope` and never reads live derive pct.

`get_smart_site` POSTs cortex R1 and passes `draw` from this assembler. Envelope pct is absent by design.

## Same fact or different path?

**Different path, same customer-facing fact class (buildable envelope / lot share).**

- **X-ray / inspect:** atom-chain BFF facets → optional live `POST …/place/buildable-envelope` → `deriveBuildableEnvelope` → pct on sheet → `composeVerdict`.
- **MCP:** baked snapshot only → tier-1 envelope declined → brief refusal + draw overlay refused. No live derive.

The anti-zombie cut (`computeTier1Envelope`, 2026-07-23) explicitly retired bake-authored envelope pct. Product envelope was re-homed to atom chain + live derive (WDLL 3.7). MCP correctly honors the decline on the R1/draw wire. X-ray honors the atom-chain setback scalars but **side-doors geometry** through live derive, producing a pct MCP will not emit.

There is no second authoritative producer (no `buildable-envelope` atom with verified pct on the MCP serve path). The 42% is not read from bake; it is derived on demand in the X-ray resolve path only.

## Second mechanism considered and rejected

**Mechanism 2 (rejected):** the 42% comes from baked `facets.envelope.buildableAreaPct` or a proof-atom outcome without live derive.

**Why rejected (code read):**

- `computeTier1Envelope` returns `status: "declined"`, `declineReason: "atom_path_pending"` for every stamped parcel; no pct is baked.
- `adaptAtomChainToBakedFacets` (`atom-chain-to-facets.ts` ~1311–1342) may set `envelope.status: "ok"` with setbacks but **withholds geometry**; pct from atom is optional and blocked when silent axes exist; disclosure says geometry comes from live derive.
- `facetsNeedLiveEnvelopeDerive` is true exactly when setbacks are present without trusting atom geometry; `resolveUncached` then **must** call `fetchLiveEnvelopeDerive` before `envelopeValue`.
- MCP R1 reads bake after strip; `extractEnvelopeBriefRefusal` yields `atom_path_pending` — no baked pct on wire.

So the 42% on the X-ray is from the live derive branch, not a durable atom/bake field MCP already has.

## Recommended ruling detail

**B.** Until the buildable-envelope atom path is live and MCP can serve the same `buildableAreaPct` with the same provenance refs, the X-ray must not print a lot-percentage headline. It should land in `envelope.kind: "not-derived"` with `atom_path_pending` (or equivalent), matching MCP draw + brief refusal. Serving 42% on MCP without settling O2 corner-lot / road-class inset would violate WDLL I2 and item 8.

Ruling A would require MCP to call the same live derive and expose pct — that re-opens the corner-lot and road-class table defects O2 holds, and contradicts the current honest refuse on gold.

## Paired live probe (for planner grade)

Run on **`48021:33223`** (927 MAIN ST, Bastrop) with PE auth / Studio session:

1. **`get_smart_site`** (smartsite-mcp, depth node or full): assert `draw.overlays` envelope id has `state: "refused"` and `reason` contains `atom_path_pending`; assert R1 brief section `setbacks-envelope` has `data: null` and refusal `declineReason: atom_path_pending` (or `declined-in-bake` mapped to same).

2. **Fact sheet resolve** (same session): `GET /api/spine/property-atoms` or internal `FactSheetResolver.resolve("48021:33223")` — capture `envelope.kind`, `envelope.areaPctOfLot`, and `verdict`. If probe reproduces scope doc, expect `kind: "derived"`, pct ≈ 42, verdict contains `Buildable (approximate), 42% of the lot`.

3. **Live derive witness** (optional, ties producer): `POST {cortex}/brokerage/v1/place/buildable-envelope` with `{ "address": "927 MAIN ST, BASTROP, TX" }` — capture `derivePath: "labelEdges+derive"`, feature properties `buildableAreaPct`, and whether `insetFeetForLabeling` used road-class table (P-5) or flat district scalars.

**Pass B:** steps 1 and 2 disagree on envelope (refused vs derived pct). **Pass A:** step 3 pct matches step 2 and MCP step 1 would need amendment to serve the same payload (not recommended before O2).

## Evidence gaps

- No filed raw X-ray JSON for 33223 in `_inbox` (prototype cites `PD-48021-33223` sheet 2026-08-27 only). The 42% figure is taken from WDLL item 7 / v1 scope operator observation; this read is code-path only.
- Live HTTP for `get_smart_site` on 33223 remains unmeasured (O5 leave_behind).
