---
id: 2026-07-27_COMPLETE_BASTROP_A1_executor_close
title: Executor close — COMPLETE-BASTROP A1 zoning provenance backfill
date: 2026-07-27
status: executor-close
owner: executor-A1
planner: adversarial-audit (CTX HELD — planner grades live; executor does NOT claim WDLL MET)
wdll: 2026-07-27_COMPLETE_BASTROP_hardening_WDLL items 2,3,4,5
dispatch: _dispatches/2026-07-27_COMPLETE_BASTROP_A1_zoning_provenance_backfill.md
---

# COMPLETE-BASTROP A1 — executor close

Executor built and backfilled. Planner owns live verification and WDLL grading. This close does **not** claim WDLL MET.

## Origin (cited, not invented)

```
https://services7.arcgis.com/qOeXJdBtGknaCJC4/arcgis/rest/services/Zoning_Place_Type/FeatureServer/0
codeField: PlaceTypeClass
cityKey: bastrop-city-tx
registry: legacy-design-tools/lib/cad-ingest/src/txgio/zoning-layers.ts
```

## PRs / branches / SHAs

| Repo | Branch | SHA | PR |
|---|---|---|---|
| legacy-design-tools | `feat/complete-bastrop-a1-zoning-provenance` | `b27fe8bd74cf6744b2b8fa94b1918cb5c2a7b47e` | https://github.com/empressaioemail-tech/legacy-design-tools/pull/360 |
| hauska-engine | `feat/complete-bastrop-a1-zoning-provenance` | `efe740a69a4d2443050202d94080b539247001fd` | https://github.com/empressaioemail-tech/hauska-engine/pull/154 |

## Code shipped

**LDT (Tier-1 writer)**
- `artifacts/api-server/src/lib/zoningProvenance.ts` — resolve layer + build provenance
- `artifacts/api-server/src/nodeFacetBakeTier1Cli.ts` — when district present, set `zoning.provenance` + `provenance.zoningSource`
- `artifacts/api-server/scripts/backfill-bastrop-tier1-zoning-provenance.mjs` — snapshot + txgio zj backfill

**hauska-engine**
- `packages/engine-core/src/property-reasoning/bake-from-tier1-snapshot.ts` — M0 `assertZoningProvenancePresent`; GIS `sourceAdapter`/`sourceUrl`/`sourceCitation`; bake as `reasoningChain.transformSteps` TRANSFORM
- `packages/engine-core/src/property-reasoning/emit-zoning-fact.ts` — optional reasoningChain override
- `packages/engine-core/scripts/backfill-bastrop-zoning-fact-provenance.mjs` — atom body UPDATE for district facts
- M0 vitest: `packages/engine-core/src/property-reasoning/__tests__/zoning-provenance-m0.test.ts`

## Tests (executor-run)

| Suite | Result |
|---|---|
| LDT `zoningProvenance.test.ts` + `nodeFacetBakeTier1.test.ts` | 67 passed |
| Engine `zoning-provenance-m0.test.ts` + `bake-from-tier1-snapshot.test.ts` | 9 passed (4 M0 + 5 bake) |

## DB backfill executed (row counts — planner re-verify independently)

**DB backfill: EXECUTED** (not script-only). Neon cortex-prod `fancy-fire-06136146` neondb + hauska_mcp.

### Tier-1 snapshots + txgio (neondb)

Script: `node artifacts/api-server/scripts/backfill-bastrop-tier1-zoning-provenance.mjs --apply`

| Metric | BEFORE | AFTER |
|---|---|---|
| tier1 zoning_present | 5769 | 5769 |
| tier1 zoning_has_prov | 0 | 5769 |
| tier1 top_zoning_source | 0 | 5769 |
| txgio with_district | 6213 | 6213 |
| txgio zj bastrop-city-tx | 0 | 6213 |
| txgio zd_without_zj | 6213 | 0 |
| rows updated (snapshots) | — | 5769 |
| rows updated (txgio) | — | 6213 |

### Zoning-fact atoms (hauska_mcp)

Script: `pnpm --filter @hauska-engine/engine-core run backfill-bastrop-zoning-fact-provenance -- --apply`

| Metric | BEFORE | AFTER |
|---|---|---|
| with_district | 5769 | 5769 |
| district citing bake adapter | 5769 | 0 |
| district citing `txgio-zoning-stamp:bastrop-city-tx` + AGOL URL | 0 | 5769 |
| rows updated | — | 5769 |

Absence atoms (~56488) still cite tier1 bake — left as-is (no-district path; not blocking per planner resume).

### SELECTs executor ran (paste for planner re-run; no credentials)

```sql
-- neondb: Tier-1 provenance tally
SELECT
  count(*) FILTER (
    WHERE payload_json->'zoning'->>'district' IS NOT NULL
      AND btrim(payload_json->'zoning'->>'district') <> ''
  )::int AS zoning_present,
  count(*) FILTER (
    WHERE payload_json->'zoning'->>'district' IS NOT NULL
      AND btrim(payload_json->'zoning'->>'district') <> ''
      AND coalesce(btrim(payload_json->'zoning'->'provenance'->>'sourceUrl'), '') <> ''
  )::int AS zoning_has_prov,
  count(*) FILTER (
    WHERE coalesce(btrim(payload_json->'provenance'->>'zoningSource'), '') <> ''
  )::int AS top_zoning_source
FROM place_layer_snapshots
WHERE adapter_key = 'node-facets:tier1'
  AND place_key LIKE 'node:48021:%';
```

```sql
-- neondb: txgio jurisdiction
SELECT
  count(*) FILTER (
    WHERE zoning_district IS NOT NULL AND btrim(zoning_district) <> ''
  )::int AS with_district,
  count(*) FILTER (
    WHERE replace(lower(coalesce(zoning_jurisdiction,'')), '_', '-') = 'bastrop-city-tx'
  )::int AS with_jurisdiction_bastrop_city,
  count(*) FILTER (
    WHERE zoning_district IS NOT NULL AND btrim(zoning_district) <> ''
      AND (zoning_jurisdiction IS NULL OR btrim(zoning_jurisdiction) = '')
  )::int AS zd_without_zj
FROM txgio_parcel
WHERE county_fips = '48021';
```

```sql
-- hauska_mcp: gold zoning-facts
SELECT atom_did, body->>'district', body->>'sourceAdapter', body->>'sourceUrl',
       left(body->>'sourceCitation', 120)
FROM atoms
WHERE atom_did IN (
  'did:hauska:zoning-fact:48021:33512',
  'did:hauska:zoning-fact:48021:34785',
  'did:hauska:zoning-fact:48021:28286'
);
```

```sql
-- hauska_mcp: district citation tally
SELECT
  count(*) FILTER (WHERE coalesce(body->>'district','') <> '')::int AS with_district,
  count(*) FILTER (
    WHERE coalesce(body->>'district','') <> ''
      AND body->>'sourceAdapter' = 'txgio-zoning-stamp:bastrop-city-tx'
      AND body->>'sourceUrl' LIKE '%Zoning_Place_Type%'
  )::int AS district_agol_cited,
  count(*) FILTER (
    WHERE coalesce(body->>'district','') <> ''
      AND body->>'sourceAdapter' = 'cortex-tier1-snapshot-breadth-bake'
  )::int AS district_bake_remaining
FROM atoms
WHERE entity_type = 'zoning-fact'
  AND entity_id LIKE '48021:%';
```

## Out of scope (honored)

- Did not touch depth-warm / boundary write paths
- Did not treat SmartCity as data source
- Did not re-enable dead `bastrop-tx:zoning`
- No force push / amend of shared history
- No WDLL self-grade

## Return

- LDT PR: https://github.com/empressaioemail-tech/legacy-design-tools/pull/360
- Engine PR: https://github.com/empressaioemail-tech/hauska-engine/pull/154
- Branch (both): `feat/complete-bastrop-a1-zoning-provenance`
- DB backfill: **executed** (counts above; matches planner live tally)
- Close doc: `_inbox/2026-07-27_COMPLETE_BASTROP_A1_executor_close.md`
