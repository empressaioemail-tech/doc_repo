# MCP1 atom-chain widening — planner scratch

## CP1 (pre-registered 2026-08-12, before executor land)

- Engine `PROPERTY_ENTITY_TYPES` count on origin/main: **16**
- Expected reachable after derive (parcel-keyed): **15**
- Intentionally out: **`road-node`** only — `roadNodeId`-keyed; `isPropertyAtomInstance` correctly excludes it (P2.5)
- slotsBefore (entity types on MCP chain path): **4**
- slotsAfter (expected): **15**
- typesReachableBefore: parcel-node, zoning-fact, setback-rule, buildable-envelope
- typesReachableAfter: all PROPERTY_ENTITY_TYPES except road-node
- typesStillUnreachable: [{ type: road-node, why: intentionally-out roadNodeId-keyed not parcelNodeId-keyed }]

## Blocker found at planner recon (must fix for live probe)

Engine `listPropertyAtomsByParcelNodeId` (`pg-storage.ts`) hardcodes entity_type IN (zoning-fact, setback-rule, buildable-envelope, parcel-terrain-model). Retrieval `getPropertyAtomChain` only projects three slots. MCP prefers that wire and never falls back per-DID for other families. Owner/land-use/cad-roll entityIds are `parcelNodeId:taxYear`, so bare DID mint also fails. Engine read-path must derive from PROPERTY_ENTITY_TYPES (exclude road-node); do NOT change the registered type list contents.

## Standing

- No atoms writes / no --apply / do not take A2 bulk-writer slot
- Auth header: X-Hauska-Key (not Bearer)
- owner-fact is public-paid — widening must not leak on public/anonymous

## LIVE PROBE CANDIDATES (retrieval API 2026-08-12)

Verified via GET /atoms with HAUSKA_ENGINE_API_KEY (retrieval Bearer):

| parcelNodeId | flood (bare DID) | owner:2025 | land-use:2025 | cad:2025 |
|---|---|---|---|---|
| 48021:34137 | yes | yes | yes | yes |
| 48021:27303 | yes | (check) | (check) | (check) |
| 48021:28286 | yes | (check) | (check) | (check) |

Live atom-chain wire already has `atoms[]` but only the four PARCEL_ANCHOR families (zoning/setback/envelope/terrain) — confirms storage IN-list is the serve bottleneck. Bare owner/land-use/cad DIDs 404; taxYear 2025 works.

MCP URL: https://hauska-mcp-server-h7gvu7rgcq-uc.a.run.app
Auth for MCP tools: X-Hauska-Key (product key), not Bearer.

## CLOSED 2026-08-12T19:48Z

Close: `_inbox/2026-08-12_MCP1_atom_chain_widening_close.json`
PRs: eng #318 + #320 (entity_id hotpath), mcp #59
Deployed: retrieval-api-00067-gow, mcp-server-00042-25d
CP2: 48021:34137/27303/28286 — flood+owner+land-use+cad on entitled path; anon withholds owner-fact.

## LESSON

Widening a PARTIAL-index-backed `entity_type IN (...)` without changing the predicate to an index that covers the new types is a silent prod timeout. Prefer entity_id composite unique (or widen the partial index CONCURRENTLY) before shifting traffic.
