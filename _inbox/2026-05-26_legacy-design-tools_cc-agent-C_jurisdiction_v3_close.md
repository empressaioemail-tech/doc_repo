---
id: 2026-05-26_legacy-design-tools_cc-agent-C_jurisdiction_v3_close
title: Close — Jurisdiction surfacing v3 (substrate filter + cache)
date: 2026-05-26
agent: cc-agent-C
repo: legacy-design-tools
branch: fix/jurisdiction-surfacing-v1.5-v3
---

# v3 close — substrate API filter + cache

## Delivered

- `GET /api/substrate/jurisdictions?states=TX,UT&keys=&q=` via `substrateFilter.ts`.
- In-memory TTL cache (default 10m) on full `listJurisdictions` before MCP call (`hauskaSubstrateClient.ts`).
- Response includes `total` / `filtered` counts.
- FE `SubstrateCatalogPanel` passes `states` from engagements ∪ `practiceStates`; summary line for filtered vs nationwide.
- Route test: states query param filter.

## Operator prod sign-off (before v3 sign-off)

1. Create `HAUSKA_MCP_KEY` in Secret Manager; mount on cortex-api.
2. Set `HAUSKA_SUBSTRATE_MODE=mcp` and `HAUSKA_MCP_URL`.
3. Network: Code Library calls `/api/substrate/jurisdictions?states=TX,UT` with smaller payload; repeat within TTL → cache hit in logs.

## Out of scope

No migration.
