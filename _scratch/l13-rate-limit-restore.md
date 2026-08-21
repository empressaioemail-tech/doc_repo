# L13 P-29 rate-limit store restore (scratch)

## GROUND-TRUTH (2026-08-12T23:44Z serving)

Serving MCP `hauska-mcp-server-00063-fic` @100% tag `l13-57fa819`:
`rate_limit_store.state=ok primary=postgres memory_fallback=false outage_policy=fail-degraded`.

Inventory-time serving `00042-25d` was already postgres-ok; the pin + explicit outage fields landed on `00063-fic`. Non-serving `ratelimit-smoke` / `00050-fej` still reports Upstash degraded + memory fallback.

Literal DC-11a (cortex `/health`) returns HTML; `/api/health` is `{"status":"ok"}` with no `rate_limit_store`. Cortex does not share the MCP limiter seam.

## OPEN

- DC-11b load-test artifact freshness and DC-11c capacity-doc `last_updated` remain P-29 residue (not this restore).
- Literal DC-11a still points at cortex `/health`. Recommended instrument: MCP `/health`. Filed as OPS-16 A-010.

## LESSON

A tagged leftover revision (0% traffic) can keep a dead-store health body alive and poison plan-of-record prose. Grade the SERVING revision, not the newest tag number (`00050` > `00042` but 00050 is not serving).
