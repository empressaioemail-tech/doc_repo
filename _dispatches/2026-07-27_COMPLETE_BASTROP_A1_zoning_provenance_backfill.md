---
id: 2026-07-27_COMPLETE_BASTROP_A1_zoning_provenance_backfill
title: Dispatch A1 — Bastrop zoning provenance backfill (S-01/S-02/S-04/S-12) GO
date: 2026-07-27
status: GO
owner: executor (hauska-engine + legacy-design-tools)
planner: adversarial-audit (CTX HELD — planner grades live)
wdll: 2026-07-27_COMPLETE_BASTROP_hardening_WDLL items 2,3,4,5
audit: _inbox/2026-07-27_COMPLETE_BASTROP_hardening_audit.md
---

# Dispatch A1 — Zoning provenance backfill — GO

Operator approved WDLL 2026-07-27. No S0/S1 knowingly accepted. You build; planner live-verifies. Do NOT claim WDLL MET.

## Origin (do not invent)

```
https://services7.arcgis.com/qOeXJdBtGknaCJC4/arcgis/rest/services/Zoning_Place_Type/FeatureServer/0
codeField: PlaceTypeClass
cityKey: bastrop-city-tx
registry: legacy-design-tools/lib/cad-ingest/src/txgio/zoning-layers.ts
```

## Do (WDLL 2,3,4,5)

1. **Tier-1 writer** (`nodeFacetBakeTier1Cli.ts` / payload builder): when `zoning.district` present, set
   - `zoning.provenance = { sourceUrl, codeField, cityKey, layerName, stampedAt }`
   - `provenance.zoningSource` = same sourceUrl (or structured twin)
2. **Backfill existing** Bastrop `place_layer_snapshots` where adapter_key=`node-facets:tier1` and zoning.district present (~5769).
3. **Zoning-fact atoms** (hauska_mcp): UPDATE/re-emit so
   - `sourceAdapter` = stamp/AGOL adapter id (e.g. `txgio-zoning-stamp:bastrop-city-tx`)
   - `sourceUrl` = AGOL layer URL above
   - `sourceCitation` cites PlaceTypeClass + cityKey + vintage
   - `reasoningChain` may keep breadth bake as a **TRANSFORM** step — bake is NOT the source
4. **Re-stamp jurisdiction**: `txgio_parcel.zoning_jurisdiction='bastrop-city-tx'` for county_fips=48021 where zoning_district present (SQL UPDATE or re-run `stampCountyZoning`).
5. **M0 guard**: bake/emit FAILS (throw / honest refusal) if district present && `zoning.provenance.sourceUrl` empty. Vitest: stripped fixture RED, cited fixture GREEN. Promote to main.

## Repos

- Primary: `P:\legacy-design-tools` (Tier-1 writer, zoning stamp)
- Primary: `P:\hauska-engine` (emit-zoning-fact / bake-from-tier1-snapshot guard + atom backfill script)
- Neon: cortex-prod `fancy-fire-06136146` — neondb (snapshots, txgio) + hauska_mcp (atoms)

## Do NOT

- Touch depth-warm / boundary write path
- Treat SmartCity OS as data source
- Re-enable dead `bastrop-tx:zoning` as live
- Self-grade WDLL or merge without planner live SELECT

## Close artifact

Write `_inbox/2026-07-27_COMPLETE_BASTROP_A1_executor_close.md` with: PR URLs, SHAs, vitest counts, SQL you ran (not results graded), backfill row counts. Planner pastes live SELECT for gold parcels.
