---
id: 2026-05-26_cc-agent-C_jurisdiction_surfacing_v3
title: Dispatch — Jurisdiction surfacing v3 (substrate API filter + cache)
date: 2026-05-26
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
related: [41a_cortex_jurisdiction_surfacing, 43_cortex_qa_backlog, QA-17, QA-38]
prerequisite: v2 recommended (coverage fields on engagement); MCP env live on prod
---

# Jurisdiction surfacing v3 — substrate API filter + cache

**Owner:** cc-agent-C (`artifacts/api-server` + thin FE cleanup).

**Canonical:** [`41a_cortex_jurisdiction_surfacing.md`](../41a_cortex_jurisdiction_surfacing.md) § v3.

## Goal

Stop shipping the full MCP jurisdiction list to every browser on every page load. Filter server-side; cache `list_jurisdictions` on cortex-api.

## API — extend `GET /api/substrate/jurisdictions`

Query params (all optional):

| Param | Example | Behavior |
|-------|---------|----------|
| `states` | `TX,UT` | Comma-separated 2-letter codes; filter `displayName` + `key` |
| `keys` | `bastrop-tx,grand-county-ut` | Exact substrate key allowlist |
| `q` | `bastrop` | Case-insensitive substring on key + displayName |

Response shape unchanged: `{ source: "mcp"|"mock", jurisdictions: [...] }`.

Add response header or field:

```json
{ "source": "mcp", "total": 698, "filtered": 12, "jurisdictions": [...] }
```

## Cache — `lib/hauskaSubstrateClient.ts`

- In-memory cache keyed by `HAUSKA_SUBSTRATE_MODE` + product key fingerprint.
- TTL **10 minutes** (configurable env `SUBSTRATE_CATALOG_CACHE_TTL_MS`).
- `listJurisdictions()` checks cache before MCP round-trip.
- Log cache hit/miss at info level.
- Invalidate: none required v3 (TTL sufficient).

**Do not cache per-filter results** in v3; filter in-process from full cached list (list is ~hundreds of rows, cheap).

## FE — thin update

- `SubstrateCatalogPanel` + Code Library pass `?states=` derived from engagement union + `practiceStates` (v1.5).
- Remove redundant client-side filtering where server now filters (keep client filter as fallback for cortex-local codes route if unchanged).

## Optional — `GET /api/workspace/jurisdiction-summary`

Single call for Code Library boot:

```json
{
  "practiceStates": ["TX","UT"],
  "engagementStates": ["TX","UT"],
  "substrate": { "total": 698, "filtered": 4 },
  "cortexLocal": { "keys": ["grand_county_ut","bastrop_tx"] }
}
```

Only add if it saves duplicate fetches; otherwise defer.

## Performance acceptance

- [ ] Code Library load with `?states=TX,UT` returns << full catalog; p95 latency improves vs unfiltered on warm cache.
- [ ] Second request within TTL does not call MCP (verify via log `cache hit`).
- [ ] Mock mode unchanged.

## Deploy note

No new migration. Requires `HAUSKA_SUBSTRATE_MODE=mcp` on prod for real cache population.

## Reporting

`P:\doc_repo\_inbox\2026-05-26_legacy-design-tools_cc-agent-C_jurisdiction_v3_close.md`
