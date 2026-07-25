---
id: 2026-07-25_setback_correctness_corner_lots_checkin
title: Setback correctness + corner lots — diagnosis confirm + fix check-in
status: checkin
date: 2026-07-25
applies_to: hauska-map (PE), hauska-engine, legacy-design-tools (buildableEnvelope)
owner: nick
related: [2026-07-25_setback_correctness_and_corner_lots_pickup]
---

# Setback correctness + corner lots — check-in

## Confirmed code questions (live + source)

1. **not_specified honored?** No (before this fix).
   - LDT `derive.ts` / `insetFeetForLabeling` treated `front/side/rear` as bare numbers.
   - PE `mapSetbacks` + `baked-facets` rendered `F 25′ · S 0′ · R 0′` and mapped atom outcome `no-buildable-area` to "setbacks consume the lot".
   - Live atom-chain for `48021:141209` (P-3): `F=25 S=0 R=0`, outcome `no-buildable-area`, **no** `not_specified` on the wire. Planner was right that the B3 table carries `not_specified: true` on side/rear (`bastrop-city-tx.json`); the flag was dropped in `fieldFrom` / `emitSetbackRule` before the atom wire. PE facets path `atom-chain` served the false consume-lot copy.

2. **side_corner_ft + corner detection?** Partially modeled, not applied (before this fix).
   - Table column exists; `edgeLabeling` comment said corner handling deferred; single front edge only.
   - Multi-road candidates existed for cul-de-sac defense, but no second named-street frontage → `side_corner` label.

## Fixes landed

| Layer | Change |
|-------|--------|
| **PE (display, widespread)** | Re-attach B3 `not_specified` by district; remap stale `no-buildable-area` + silent axes → honest build-to-line disclosure; never show `S 0′` / consume-lot for those parcels. |
| **Engine** | Port `bastrop-city-tx.json` + `getSetbackTableForZoning`; preserve `not_specified` through descriptor/emit; fix `0` treated as missing row; refuse consume-lot outcome when silent axes. |
| **LDT derive** | Honor provenance `not_specified` on inset; corner lot: 2+ distinct **named** road frontages → `side_corner` + `side_corner_ft`; unresolved second frontage disclosed, never fabricated. |

## Live verify (post-PE deploy) — MET 2026-07-25

`GET https://property-explorer-xi.vercel.app/api/spine/property-atoms/48021%3A141209/facets`

- `X-PE-Read-Path: atom-chain`, HTTP 200
- `envelope.status=ok` (was `no-buildable-area`)
- `setbacks.not_specified={side,rear,sideCorner:true}`; front 25 retained
- disclosure: build-to-line / silent axes; **no** "consume the lot"
- buildableAreaPct omitted (pending honest geometry)

PRs: hauska-map [#67](https://github.com/empressaioemail-tech/hauska-map/pull/67) MERGED+deployed; hauska-engine [#120](https://github.com/empressaioemail-tech/hauska-engine/pull/120) MERGED; LDT [#355](https://github.com/empressaioemail-tech/legacy-design-tools/pull/355) MERGED.

## Cortex deploy + traffic trap (MET)

- Image for merge `b34a0387` was in Artifact Registry as `latest` while prod still served `cortex-api-00432-bob` (Jul 24 digest) — classic trap #1/#traffic.
- Canary deploy → health 200 on `canary---cortex-api-…` with digest `63b1642c…` (= `#355`).
- `shift-traffic` → **`cortex-api-00434-nej` @ 100%** (verified via `gcloud run services describe`).

## Live corner-lot verify (MET 2026-07-25)

Product HTTP `buildable-envelope` remains atom-chain-only (anti-zombie); it does not re-run `labelEdges` on request. Live verify therefore ran the **shipped #355 labeling** against **live county GIS ring + live Overpass named roads**:

| Parcel | Situs | Named roads | Result |
|--------|-------|-------------|--------|
| `48021:33722` | 1002 MAIN ST | Main, Chestnut, … | `cornerLot=true`; street edges `front` + `side_corner` both street-side inset |
| `48021:33415` | 1001 MAIN ST | Main, Water, Chestnut | `cornerLot=true`; `front` + `side_corner` both street-side; derive disclosure names corner lot |

Probe: `legacy-design-tools/artifacts/api-server/scripts/live-corner-probe.ts` (operator one-shot).

**Close:** display fix live on PE; cortex serving #355; corner detection live-verified on real Main St corner lots with two street-side setbacks.

## Discipline

- Table values not re-transcribed (B3 JSON ported as-is).
- Anti-fabrication 422 for missing setback-rule unchanged.
- Watch Cloud Run / Vercel traffic traps on deploy.
