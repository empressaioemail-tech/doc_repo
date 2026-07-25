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

## Live verify (post-PE deploy)

- Target: `48021:141209` via `GET /api/spine/property-atoms/48021%3A141209/facets`
- Expect: envelope status `ok` (not consume-lot); setbacks line with "not specified" / build-to-line; no "consume the lot" string.
- Corner: unit-covered in LDT; live corner parcel dogfood after cortex redeploy with road candidates.

## Discipline

- Table values not re-transcribed (B3 JSON ported as-is).
- Anti-fabrication 422 for missing setback-rule unchanged.
- Watch Cloud Run / Vercel traffic traps on deploy.
