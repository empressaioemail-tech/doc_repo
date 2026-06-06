---
id: cotality_mcp_setup
title: Cotality MCP server — connection setup (runbook)
date: 2026-06-06
kind: runbook
related: [_research/2026-06-06_cotality_api_surface_catalog, _research/cotality/2026-06-06_cotality_api_documentation_comet, 77b_cotality_integration_strategy, 50_hauska_mcp_server]
owner: nick
---

# Connecting the Cotality MCP server

**Status (2026-06-06): NOT connected.** Blocked on the same OAuth credential failure as the REST adapters (`Invalid client identifier`). The MCP authenticates with the same demo client_id/secret and bearer token — so it cannot connect until the token mints. Once the token works, setup is the config below.

Cotality MCP is the federation foothold for the Hauska-MCP-to-Cotality-MCP play (77b §5). Two consumers we'd connect:

1. **Cursor (cc-agents)** — so cc-agent-C/others can call Cotality tools directly during builds.
2. **This planner / Claude session** — so the planner can introspect (`tools/list`) and reason over Cotality data live.

## Endpoint + auth

- MCP server (streamable HTTP, JSON-RPC 2.0): `https://mcp.cotality.com/mcp`
- Token (MCP host): `POST https://mcp.cotality.com/oauth/token?grant_type=client_credentials`, HTTP Basic `-u key:secret`, header `Content-Length: 0`. ~3600s TTL. **OAuth discovery is NOT supported — the bearer must be configured manually.**

## Mint a token (once the credential issue clears)

```bash
curl -s -X POST "https://mcp.cotality.com/oauth/token?grant_type=client_credentials" \
  -u "$COTALITY_PROPERTY_KEY:$COTALITY_PROPERTY_SECRET" -H "Content-Length: 0" -A "hauska/1.0" | jq -r '.access_token'
```

## Cursor config — `P:\legacy-design-tools\.cursor\mcp.json`

```json
{
  "mcpServers": {
    "cotality": {
      "type": "http",
      "url": "https://mcp.cotality.com/mcp",
      "headers": { "Authorization": "Bearer <PASTE_FRESH_TOKEN>" }
    }
  }
}
```

Token is short-lived (~1h); paste a fresh one or wire a small refresh wrapper. Tools exposed: `clip-find_property_by_clip`, `clip-find_property_by_full_address`, `pc-characteristics_by_clips_tool`, `pacra-property_analytics_by_clips_tool` (+`_age_of_roof`, +`_climate_risk`), `pa-analytics_*` (listing/market/rental/HPI/HPI-forecast), `pa-unified-client-mobile_tool`, `pa-property-v2-clientside_tool`, `pac-climate-risk_tool`.

## Gate

Same as the data layer: internal/dev use is in scope; do not surface Cotality MCP results in the consumer extension until license terms clear. The credential fix (see the oauth-rework dispatch and the Comet read-back) unblocks both this and the REST adapters at once.
