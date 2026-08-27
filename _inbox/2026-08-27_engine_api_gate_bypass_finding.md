---
id: 2026-08-27_engine_api_gate_bypass_finding
title: Finding: hauska-engine-api accepts self-declared gate-front headers from the public internet (no service token, allUsers invoker)
date: 2026-08-27
last_updated: 2026-08-27
status: open
severity: high
owner: substrate seat (hauska-mcp-server sends the token) and property seat (engine-api config; any other caller); planner records
snapshot: hauska-engine-api serving revision hauska-engine-api-00174-zus (image ws1-serve-truth-12, built 2026-08-06); engine main cfa18bc; probes 2026-08-27T00:18Z from the planner's shell against https://hauska-engine-api-h7gvu7rgcq-uc.a.run.app
related: 80_adrs/adr_017_atom_access_control.md; _inbox/2026-08-24_property_accesspolicy_close.json; 90_operations/OPS-16_texas_market_plan_of_record.md (A-039; found during the A-038 deploy)
---

# Finding: engine-api's gate is a header the caller writes

Found while preparing the E-1/E-2 canary smoke, not while looking for it. Recorded before the deploy so the deploy record does not bury it.

## What was observed

`hauska-engine-api` runs with `run.googleapis.com/ingress: all` and an IAM binding `roles/run.invoker: allUsers`. Its request middleware (`services/engine-api/src/server.ts`) checks a Bearer service token only when `ENGINE_API_GATE_TOKEN` is set, and the production revision's environment does not set it. After that check it requires "gate-front headers", parsed by `parseGateFrontHeaders` in `gate-front-context.ts`: six plain headers (`x-hauska-product`, `x-hauska-tenant-id`, `x-hauska-package-id`, `x-hauska-access-tier`, `x-hauska-gate-credential-id`, `x-hauska-request-id`) validated by shape only, with no signature and no lookup. The file's own comment says the gate is the sole authority for tenant and package resolution and engine-api does not re-resolve.

Verified by violation, read-only endpoint `GET /v1/site-context/registry`:

    no headers                                              -> 401 gate_front_context_required
    headers with product=reporting (not in the enum)        -> 401
    headers with product=cortex, access-tier=public-free    -> 200 (payload.adapterCount 30)
    headers with product=cortex, access-tier=platform-internal -> 200

So any internet caller who knows five enum values is accepted as a gate-proxied caller at any tier, for any tenant id they type, and engine-api will not re-resolve. The tier a caller declares is the tier the reads and the LLM routes will honour. The reachable surface is every `/v1/*` route: findings and briefing generation (LLM spend on the project's keys), chat, document ingest, encumbrance queries, terrain and hydrology jobs, map layers.

## Mechanism, and the second mechanism rejected

Mechanism: the service token is the only unforgeable input in the middleware, and it is unset in production, so the middleware degrades to a shape check on caller-supplied headers. Second mechanism considered: an upstream layer (load balancer, Cloud Armor, IAM) that the probe bypassed. Rejected because the probe hit the `run.app` URL directly and the invoker binding is `allUsers`; there is no upstream layer on that path. Third mechanism considered: the registry endpoint is deliberately public. Rejected because the same endpoint returns 401 without headers, so the gate check applies to it, and the `platform-internal` acceptance shows the tier is not checked against anything.

## Why it matters

ADR-017 access control and the tenant-sovereignty rule are enforced at the MCP gate. This path goes around the gate. Every "withheld is not absence" guarantee on engine-served content, and every LLM key behind findings and briefing, rests on a header the caller writes. It is a control whose scope is narrower than its claim, and it has been in production since the header contract shipped; the E-1/E-2 work hardened `access_policy` inside the store while the front door stayed open.

## Fix, in order (repoint callers first, then close the door)

1. Every caller of engine-api sends `Authorization: Bearer <ENGINE_API_GATE_TOKEN>`. Enumerated by grep across the seat worktrees on 2026-08-27, four callers, and every one already sends a Bearer when its environment carries the token, so this is configuration, not code: `hauska-mcp-server` `src/engine-api-client.ts` reads `HAUSKA_ENGINE_API_GATE_TOKEN` or `HAUSKA_ENGINE_API_KEY` (substrate seat; the deployed revision `hauska-mcp-server-00082-mat` does not set the first, the second was not checked); `legacy-design-tools` `artifacts/api-server/src/lib/engineSpineClient.ts` reads `ENGINE_API_GATE_TOKEN` (property, cortex-api deploy config); `hauska-map` `apps/property-explorer/api/pe-map-layers.ts` and `_lib/pe-flood-drainage-core.ts` read `HAUSKA_ENGINE_API_KEY` or `ENGINE_API_GATE_TOKEN` (property, Vercel env); `smartcity-dashboards` `src/compose.mjs` sends a Bearer from its own env (govtech). `hauska-retrieval-api` is not affected: `/search` returns 401 without its key and 401 with self-declared gate headers. Mint one secret, set it on the four callers through their deploy configs, deploy them, then enforce on engine-api. Enforcing first is an outage.
2. Set `ENGINE_API_GATE_TOKEN` as a Secret Manager secret on engine-api through its deploy config (not a manual env var, which the next deploy reverts) and enforce.
3. Verify by violation from the public internet: the four probes above must all return 401, and a token-bearing call from the gate must return 200. Record the probes with the serving revision.
4. Then decide whether the header contract should also carry a signature over `(tenantId, accessTier, requestId)` with `GATE_CONTEXT_SIGNING_KEY`, which already exists in the environment and appears unused for this purpose.

Not done in this session: no fix was applied, because the caller side belongs to another seat and enforcing the token alone would cut the gate off. The E-1/E-2 canary proceeded because it neither widens nor narrows this path.

## Three question gate for the fix

Executes: engine-api middleware (`gateServiceToken` check, already written). Triggers: every non-health request. Fails: 401 on a missing or wrong token, in production, once the secret is set. Bypasses: none on the `run.app` path once set; an internal caller with the token is trusted by possession, which is the intended shape.
