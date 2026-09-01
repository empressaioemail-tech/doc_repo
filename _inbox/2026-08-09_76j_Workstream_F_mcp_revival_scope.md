---
id: 2026-08-09_76j_Workstream_F_mcp_revival_scope
title: 76j Workstream F — MCP revival scope (recon only)
date: 2026-08-09
status: recon complete — gates revival dispatch
owner: planner
memory_graded: pending
related:
  [
    76j_smartsite_launch_readiness_program,
    90_operations/OPS-14_texas_flush_game_plan,
    _scratch/76j-f-introspection.json,
    _scratch/76j-f-mcp-probes.json,
  ]
---

# 76j Workstream F — MCP revival scope

Recon lane only. No code changes in `hauska-mcp-server`. All claims traced to live probes (2026-08-09 ~21:30Z UTC) or repo source at deployed revision `hauska-mcp-server-00040-ctj` / main `b5f26de`.

## Executive verdict

The MCP gate is **structurally alive** (71 tools registered, Postgres rate limiter OK, reporting brief path returns HTTP 200) but **functionally broken on the substrate catalog path** that is the MCP-first thesis: every `hauskaClient` call from MCP to retrieval-api returns **401** because the Bearer keys on the two services **do not match**. Store truth for Bastrop certified parcels **exists and is correct** when retrieval-api is called with its deployed key; MCP never reaches it.

Secondary gaps: contract pin **^1.9.0** on deployed MCP (program at **1.15.0**); property chain advertises four entity types and ignores three new families; map hazard/parcel tools still describe **Cotality** (extinguished); doc canon still cites **63 tools**.

**Revival is a P0 auth-alignment deploy + P1 catalog/fabric consumption wave**, not a greenfield build.

---

## I1 — Live introspection

**Serving revision:** `hauska-mcp-server-00040-ctj` @100% (`postgres-limiter`), URL `https://hauska-mcp-server-h7gvu7rgcq-uc.a.run.app`.

**Admin endpoint auth note:** `/admin/introspection/tools` requires **`X-Hauska-Admin-Key`** (bootstrap secret), not `X-Hauska-Key`. Local `.env` bootstrap key did not match prod; prod secret from Secret Manager worked.

**Rate limiter (I4 confirm):**

```json
"rate_limit_store": { "state": "ok", "latency_ms": 272, "detail": "postgres" }
```

(from `GET /health` on live MCP)

**Tool count vs canon:**

| Gate | Live (2026-08-09) | Canon record |
|---|---|---|
| **Total** | **71** | 63 |
| public | 13 | 6 (+ export download siblings) |
| codex | 5 | 5 |
| reporting | 46 | 46 |
| map | 7 | 6 |

Delta vs 63: **+8 tools** — chiefly `download_parcel_{terrain,site_plan,dossier}_export` (3), extra public/export gate entries, and map gate +1. Full catalog: `_scratch/76j-f-introspection.json`.

**Auth ladder (unchanged, verified in code):** MCP `/mcp` uses `X-Hauska-Key`; missing header → anonymous `public`; malformed key → HTTP 401; `Authorization: Bearer` does **not** authenticate MCP (silent public).

---

## I2 — Per-tool store trace (by backend family)

Deployed MCP routes every tool through one of three HTTP clients (`src/tools.ts`, `src/product-gates.ts`). Contract assumed at build: **`@empressaio/atom-contract` ^1.9.0** (+ legacy `@hauska/atom-contract` ^1.6.1 duplicate dep) — **not 1.15.0**.

### Family A — Public catalog → `hauskaClient` → **retrieval-api**

| Tools (10 access_policy) | Upstream route | Storage / era |
|---|---|---|
| `search_atoms`, `get_atom`, `query_jurisdiction`, `search_permit_atoms`, `list_jurisdictions`, `atom_trace` | `GET /search`, `/atoms/:did`, `/jurisdictions*` | **Pre-fabric corpus era:** in-memory / `corpus/snapshot.json` + optional `PHASE1A_STORAGE_PORT` Neon `atoms` table on retrieval-api `DATABASE_URL` (hauska_mcp). Code corpus ~41 TX jurisdictions; **not** statewide `txgio_parcel` fabric. |
| `get_property_atom_chain` | `GET /property-nodes/:id/atom-chain` (fallback: per-DID `/atoms/:did`) | **Mixed:** depth-warm promoted atoms (`zoning-fact`, `setback-rule`, `buildable-envelope`) for ~119 counties with parcel-node writers; chain schema hard-coded to **four** entity types only (`property-atom-chain.ts`). **Does not read** `tx_fema_nfhl_flood_zone`, `cad_property`, or land-use atoms. |
| `refresh_parcel_{terrain,site_plan,dossier}_export` | MCP gate only; delegates refresh to Family C | Reads chain via Family A first; fails if A is 401. |

**Pre-fabric flag:** All code-corpus tools (search/get/list jurisdiction) serve the **34-jurisdiction engine snapshot** model, not statewide fabric. Property chain reads **promoted atom rows**, not `txgio_parcel` geometry directly (geometry is referenced by atom provenance only).

### Family B — Reporting / Codex workspace → `legacyClient` → **cortex-api**

| Tools (~51) | Typical routes | Storage / era |
|---|---|---|
| `generate_property_brief`, `get_place_*`, `resolve_place`, `compose_workspace`, all `cortex_*`, `codex_*`, encumbrances, workspaces | `/api/brokerage/v1/*`, `/api/submissions/*`, etc. | **legacy-design-tools** Postgres (CORTEX_DATABASE_URL): engagements, brief runs, place layers, Cotality-era adapters. Brief path **does not consume** `parcel_node_id` on the wire when given fake address — see I3. |
| `get_property_detail`, `get_replacement_cost` | Cotality adapters | **EXTINGUISHED** — tool copy says "credential-pending"; standing decision violated if any live OAuth path remains. |
| `read_atom_calibration` | cortex-api / engine overlay | Calibration overlay on cortex Neon; not fabric. |

### Family C — Map + paid exports → `engineApiClient` → **engine-api**

| Tools | Route | Storage / era |
|---|---|---|
| `assemble_map_layers` | `POST /v1/map-layers/assemble` | Gate-front; can compose layers from engine reasoning — **should** be fabric-aware when engine routes to deployment DB, but MCP cannot test while Family A is 401. |
| `refresh_parcel_*` / `download_parcel_*` | `/v1/property-nodes/:id/*-export/*` | Engine-api + GCS exports; depends on promoted atoms (Family A). |
| `get_hazard_profile`, `get_parcel_polygon` | cortex-api map adapters | Tool descriptions still say **Cotality / CoreLogic OAuth** — **stale and wrong** post-extinguish; should route to NFHL bulk + `txgio_parcel` when revived. |
| `get_site_drainage`, `get_site_topography`, `simulate_site_drainage`, `generate_parcel_terrain_model` | cortex-api engagement routes | Engagement-scoped; not parcel-key statewide fabric. |

### Family D — MCP-local

| Tools | Store |
|---|---|
| Rate limit, api_keys, request_log | MCP Postgres (`DATABASE_URL` hauska_mcp) |

---

## I3 — Wrong-information reproduction

Probe method: live MCP `POST /mcp` `tools/call` vs direct retrieval-api `GET /property-nodes/:id/atom-chain`. Reporting brief via minted probe key (revoked after session). Artifacts: `_scratch/76j-f-mcp-probes.json`.

### P0 — Auth mismatch (all catalog reads)

**retrieval-api deployed env (Cloud Run describe, verbatim):**

```
RETRIEVAL_API_KEY=hauska_ret_4a24ec4ec6f11e704497b81094375   # 40 chars, plaintext env
CORPUS_SNAPSHOT_PATH=C:/Program Files/Git/app/services/retrieval-api/corpus/snapshot.json
```

**Secret Manager `HAUSKA_ENGINE_API_KEY`:** 59 chars; **does not authenticate** to retrieval-api.

**Proof:**

```
# truncated deployed key → 200 + full Bastrop chain
curl -H "Authorization: Bearer hauska_ret_4a24ec4ec6f11e704497b81094375" \
  .../property-nodes/48021%3A34145/atom-chain
→ zoningFact.district=GC, setbackRule front=20, buildableEnvelope present

# Secret Manager / MCP key → 401
curl -H "Authorization: Bearer <HAUSKA_ENGINE_API_KEY secret>" \
  .../property-nodes/48021%3A34145/atom-chain
→ {"error":"unauthorized"}
```

**MCP surface (all six parcels, public + reporting gate, identical):**

```
Hauska Engine rejected the request (401): {"error":"unauthorized"}
```

(from `get_property_atom_chain` via live MCP — HTTP 200 MCP envelope, `isError: true`)

**Store vs MCP:** Store has certified Bastrop data; MCP reports hard failure. **Wrong information class: false-negative / total outage**, not stale values.

### Bastrop certified set (block13 sample)

| parcel | STORE (retrieval, truncated key) | MCP `get_property_atom_chain` |
|---|---|---|
| `48021:34145` | GC, F/R/S 20/20/5, envelope buildable | 401 error |
| `48021:34121` | GC chain present | 401 error |
| `48021:34153` | GC chain present | 401 error |

**Neon atoms row check (DATABASE_URL hauska_mcp):** all three carry `zoning-fact`, `setback-rule`, `buildable-envelope` hashes matching store wire.

### Fabric-only counties (txgio loaded, no parcel-node county)

Top fabric-only by row count: Harris 48201 (1,602,031 rows), Travis 48453, Tarrant 48439, Bexar 48029, Dallas 48113.

| parcel | STORE | MCP chain | Notes |
|---|---|---|---|
| `48201:0010020000001` | `"zoningFact":null,"setbackRule":null,"buildableEnvelope":null,"atoms":[]` | 401 error | **Honest empty in store**; MCP cannot distinguish empty vs auth failure |
| `48453:0100123456789` | (not in txgio — probe id fake) | 401 | Travis prop_id `0` dominates samples — key hygiene issue for agents |
| `48491:R000009` | `zoningFact.district=RS` | 401 error | Williamson has parcel-node atoms; not fabric-only — included as contrast |

### Reporting gate — `generate_property_brief`

Called with `parcel_node_id` + placeholder address `"76j recon probe"`. **HTTP 200**, but response shows:

- `"substrateStatus": "not_used"`
- `"corpusStatus": "no_match"`
- `"provenance.lineage.atomIds": []`
- `"property.parcelKeyKind": null`, `"countyFips": null`
- Lay summary flood/soils/wetlands all **`unknown`** despite NFHL table live (198k rows) and statewide fabric program

Brief path **never wired parcel_node_id into brokerage brief API** for this probe shape; returns degraded Anthropic/rules copy that reads like coverage failure. **Wrong information class: silent substrate bypass** — agent sees a confident brief shell with empty atom lineage.

---

## I4 — New atom families (contract 1.15.0) — no MCP slots

Families on npm / engine **#291 merged** (program state): `flood-hazard-fact`, `cad-parcel-roll`, `land-use-fact`.

**Current MCP property surface knows only:** `parcel-node`, `zoning-fact`, `setback-rule`, `buildable-envelope` (`property-atom-chain.ts` `PROPERTY_CHAIN_ENTITY_TYPES`).

**What serving requires (sized):**

| Gap | Work | Size |
|---|---|---|
| **F1 Chain schema** | Extend `get_property_atom_chain` + retrieval-api `/atom-chain` wire to optional slots for three families; honest `atom_path_pending` per slot | M — 2 repos (engine retrieval route + MCP envelope) |
| **F2 Read tools** | Either extend chain or add `get_flood_hazard_fact`, `get_cad_parcel_roll`, `get_land_use_fact` catalog tools with accessPolicy | S — MCP only if retrieval exposes rows |
| **F3 Map/reporting** | Rewire `get_hazard_profile` / `assemble_map_layers` flood layer from Cotality stub → `tx_fema_nfhl_flood_zone` + `flood-hazard-fact` atoms | M — cortex-api + engine-api + MCP copy |
| **F4 CAD roll** | `cad_property` (4.6M rows / 15 counties) → `cad-parcel-roll` atom reads; no MCP tool today | M — engine read path + MCP |
| **F5 Land use** | `land-use-fact` writer exists; MCP + brief must cite `property_use_code` roll | M |
| **F6 Contract pin** | Bump MCP `package.json` to `@empressaio/atom-contract@1.15.0`; regenerate conformance tests | S |
| **F7 Tool copy / GTM** | Remove Cotality from `get_hazard_profile`, `get_parcel_polygon`, `get_property_detail` descriptions; update 63→71 in canon | S — doc + MCP deploy |

No writers needed for MCP slot **definition**; writers merged per `_STATE.md` 2026-08-09. Consumption is the gap.

---

## Additional infra defects (recon)

1. **`CORPUS_SNAPSHOT_PATH`** on retrieval-api points at a **Windows Git path** inside Linux Cloud Run — likely breaks corpus reload paths (health/search still passes via live Neon search path).
2. **`HAUSKA_ENGINE_API_KEY` secret vs `RETRIEVAL_API_KEY` env** — two names, two values, MCP uses the wrong one for retrieval.
3. **Parcel-node coverage:** 119 counties with atoms (live SELECT 2026-08-09); `_STATE.md` still says 79 — doc drift.
4. **MCP `/health` dependency probe:** reports retrieval `HTTP 404` on dependency check while `/health/search` on retrieval is OK — misleading green.

---

## Revival scope (sized, ordered)

### P0 — Unblock catalog (1 deploy wave, hauska-mcp-server + hauska-retrieval-api)

1. Align retrieval auth: mount `RETRIEVAL_API_KEY` from Secret Manager **same value MCP sends** (or teach MCP to use `RETRIEVAL_API_KEY` name explicitly — today it sends `HAUSKA_ENGINE_API_KEY`).
2. Fix `CORPUS_SNAPSHOT_PATH` to container path `/app/services/retrieval-api/corpus/snapshot.json` (or remove if Neon-only).
3. Post-deploy probe: anonymous `get_property_atom_chain` for `48021:34145` returns GC/20/20/5 matching store verbatim.
4. Add mechanical gate: MCP gate-probe includes `get_property_atom_chain` on gold parcel (not just codex product gate).

**Acceptance:** Bastrop block13 sample 3/3 chain match store; MCP 401 class eliminated.

### P1 — Fabric honesty (1–2 sprint slices)

1. Extend chain or map tools to read NFHL + `txgio_parcel` for fabric-only counties (honest null, not 401).
2. Wire `generate_property_brief` to pass through `parcel_node_id` and attach atom lineage when substrateStatus should be `used`.
3. Extinguish Cotality copy on map/reporting tools; point to public-record adapters only.
4. Bump contract to 1.15.0; register three new families in chain or sibling tools.

**Acceptance:** Harris fabric parcel returns honest empty chain + optional flood fact from NFHL intersect; brief shows non-empty `atomIds` on Bastrop certified parcel.

### P2 — Market surface (post-launch)

1. Re-enumerate canon (71 tools), `mcp.hauska.dev` domain mapping, GTM collateral refresh.
2. Agent onboarding: self-serve key + parcel-first docs (resolve_place still reporting-gated — known blocker from 2026-07-29 audit).
3. SDK metering on new catalog reads per OPS-14 pricing ladder.

---

## Files produced (recon artifacts)

| Path | Contents |
|---|---|
| `_scratch/76j-f-introspection.json` | Live 71-tool admin catalog |
| `_scratch/76j-f-mcp-probes.json` | Six-parcel MCP vs store probe log |
| `_scratch/76j-f-db-query2.mjs` | Dual-DB query script (local use) |

Probe API key minted for session **revoked** (`key_id` `a8463ff3-5c94-4e9e-96a0-e7f91369001f`).

---

## Recommendation

**Do not dispatch MCP feature work until P0 auth is merged and live-verified.** The operator report ("way behind and reading wrong information") is **directionally correct**: the gate advertises a statewide substrate product while the catalog path is **hard-down 401**, and the reporting brief **bypasses substrate entirely**. Revival is bounded (auth + wiring + copy + 1.15.0 slots), not a rewrite.

Next dispatch: **76j-F-P0** — retrieval/MCP key alignment + gold-parcel gate probe WDLL item.
