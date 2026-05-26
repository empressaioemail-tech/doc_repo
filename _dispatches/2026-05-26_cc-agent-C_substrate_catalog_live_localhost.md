---
id: 2026-05-26_cc-agent-C_substrate_catalog_live_localhost
title: Dispatch — Substrate catalog live on localhost (Sync 5 metros visible)
date: 2026-05-26
agent: cc-agent-C
repo: legacy-design-tools
branch: cortex/substrate-catalog-live-local
related: [QA-61, 41a_cortex_jurisdiction_surfacing, _sessions/2026-05-23_sync5_tx_metro_batch_cc-agent-E]
---

# Substrate catalog live on localhost — QA-61

## Problem

**~5,690 atoms / 10 TX metros** ingested on `hauska-engine` main (PRs #38–#47: San Antonio, Boerne, Brownsville, Mission, Schertz, Saginaw, Live Oak, Keller, Crowley, Converse) plus prior Sync 4/5 corpus.

**Localhost Code Library** still shows only **5 fixture** jurisdictions (`fixture` badge) or a TX-filtered subset that does not match engine reality.

Root cause is **not** missing ingest — it is **Cortex read path**:

| Gap | Fix owner |
|-----|-----------|
| Default `HAUSKA_SUBSTRATE_MODE=mock` | Operator `.env` + api-server boot log |
| No `HAUSKA_MCP_KEY` / URL locally | Operator secrets |
| MCP server not deployed with latest corpus | cc-agent-M / operator deploy `hauska-mcp-server` against current engine |
| UI hides nationwide catalog | cc-agent-C: **Show all jurisdictions** + fix summary counts (see jurisdiction v1 follow-up) |
| Confusion: substrate vs cortex-local | In-app copy + dev banner |

**Out of scope for this ticket:** Auto-warm all 10 cities into cortex `code_atoms` (separate bulk-warmup or per-city `JURISDICTIONS` work). Plan review still needs cortex-local mapping per city.

## Deliver (cc-agent-C)

1. **`docs/deploy.md` — Local dev: live substrate**
   - Required env block:
     ```text
     HAUSKA_SUBSTRATE_MODE=mcp
     HAUSKA_MCP_URL=https://<mcp-host>/mcp
     HAUSKA_MCP_KEY=<cortex product key>
     ```
   - Verify: `GET /api/substrate/jurisdictions` returns `source: "mcp"` and count >> 5

2. **Code Library / `SubstrateCatalogPanel`**
   - Prominent banner when `source === "mock"`: "Showing fixture catalog — set HAUSKA_SUBSTRATE_MODE=mcp for live Hauska ingest"
   - **Show all jurisdictions** toggle → fetch without `?states=` (v3 API already supports)
   - Fix summary line: use API `filtered` / `total` only (remove `jurisdictions?.length` conflation from cortex-local count)

3. **Optional dev helper** `GET /api/substrate/health` or extend existing route with `{ mode, jurisdictionCount, cacheAgeMs }` for operator QA

4. **Test:** substrate route integration test asserts live client called when mode=mcp (mocked HTTP)

## Operator acceptance (with cc-agent-C PR)

- [ ] Code Library badge reads **live** (not fixture)
- [ ] With practice states `TX`, panel lists **San Antonio, Crowley, Converse, …** (10 metros + prior TX corpus), not only Bastrop/Hutto/Elgin
- [ ] **Show all** reveals full catalog count matching MCP `list_jurisdictions` (order of magnitude: thousands of atoms / dozens+ jurisdictions — confirm against engine)
- [ ] Network: `/api/substrate/jurisdictions?states=TX` payload includes metro cities

## Dependencies

- **cc-agent-M / operator:** Deploy MCP server wired to **current** `hauska-engine` DB/catalog (merged PRs through #47). Without this, mcp mode returns stale or empty list.

## Close

`P:\doc_repo\_inbox\2026-05-26_legacy-design-tools_cc-agent-C_substrate_catalog_live_localhost.md`
