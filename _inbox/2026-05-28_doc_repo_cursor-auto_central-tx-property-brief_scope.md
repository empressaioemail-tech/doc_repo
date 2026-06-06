---
date: 2026-05-28
agent: cursor-auto (Cursor, cente workstation)
repo: doc_repo
type: recon
topic: central_tx_property_brief_scope
status: ready_for_planner
file_to: _dispatches/2026-05-28_central-tx-property-brief-scope.md
---

# Central TX Property Brief — execution scope (paywall deferred)

**Status:** Active dispatch — 2026-05-28  
**Repos:** `legacy-design-tools` (primary), `hauska-brief-extension` (UI wave 7), `hauska-engine` (ICC when creds)  
**Explicitly out of scope this wave:** Stripe / production paywall, Enterprise Regrid add-ons, `place_dossier` MCP

---

## Product thesis (atom vision alignment)

Per `doc_repo/25_atom_architecture_reference.md` §5 + §9:

- Users speak; AI surfaces **inline** atom refs in chat (expand in-thread, not a permanent citations sidebar).
- **Property list** = compact `property-workspace` nav (replaces research citations sidebar).
- **Composition:** `property-workspace` → `brief-run` + `place-layer-*` + `code-section` citations.
- Listing panel: **no morph** — normal open/close (`hauska-brief-extension`).

---

## Engineering sequence (ordered)

| Wave | ID | Deliverable | Unblocks |
|------|-----|-------------|----------|
| 0 | 0a | `place_layer_snapshots` + read-before-fetch + write-after-adapter | Forever retention, COGS |
| 0 | 0b | Wire `createAdapterResponseCache()` into brief site context | Same-day hot path |
| 0 | 0c | Central TX geocode registry from engine corpus snapshot | Jurisdiction resolution |
| 0 | 0d | `GET /api/brokerage/v1/coverage` + 75b honesty manifest | Pilot UX honesty |
| 0 | 0e | Partnership rule: MOU → Plane E/B enrichment on place node only | Governance |
| 1 | 1 | Emit `property-workspace` + `brief-run` atom projections from `/brief` | Property = atom |
| 1 | 2 | `ll_uuid` + lat/lon on `brokerage_workspaces`; place-layer entityIds in response | Cross-session identity |
| 1 | 3 | Full Regrid payload in snapshots; richer `formatSiteContextForLlm` | Grok + UI beyond 3 lines |
| 2 | 4 | Substrate MCP or Neon warm for all Central TX `jurisdiction_key`s | Code in research |
| 2 | 5 | Register brokerage atoms on cortex registry + `atom_events` | MCP / metering |
| 2 | 6 | ICC L1 ingest on engine → effective-code in brief prompts | Statewide law plane |
| 3 | 7a | Extension: remove listing morph | Chrome polish |
| 3 | 7b | Extension: property list primary; hide consumer citations sidebar | Atom UX |
| 3 | 7c | Extension: inline atom chips from `inlineRefs` / `messageHtml` | Chat-native atoms |

---

## Items captured (previously easy to miss)

1. **`place_layer_snapshots`** — permanent store; not only 24h `adapter_response_cache`.
2. **Brief adapter cache** — `fetchBrokerageSiteContext` must pass `cache` to `runAdapters` (Generate Layers already does).
3. **Substrate ↔ cortex sync** — engine has ~30 Central TX keys; LDT Neon may only have subset; coverage manifest must say `engine_only` vs `neon`.
4. **`inlineRefs` API field** — extension needs structured refs, not only `payload_json`.
5. **Cortex `bootstrapAtomRegistry`** — brokerage atom types not registered yet (projection first, registry wave 2).
6. **Regrid license** — confirm order form allows permanent snapshot retention.
7. **Consumer vs pro** — lay verdicts + inline atoms; pro may keep collapsed sources.
8. **`defaultJurisdiction` ignored** when server geocodes — document for extension.
9. **Dallas city** — blocked (`dallas|tx`); Dallas County / suburbs OK per partnership rule.
10. **Partner GIS** — Bastrop enrichment on Generate Layers only; Brief = FEMA + Regrid national baseline.
11. **GTM on graph** — consent exists; share cards / steward digest later.
12. **Valerie pilot flows** — Matrix/SkySlope per plan 75 (not this wave).

---

## Target brief flow (end state)

```
resolve_or_create property-workspace (listingKey + geocode + ll_uuid)
  → fetch Regrid/FEMA (snapshots → cache → live)
  → emit place-layer atoms (full Premium payload)
  → retrieve code-section DIDs (substrate / Neon)
  → brief-run under workspace with citationRefs[]
  → API = atom projection + wallet/GTM (not payload_json alone)
```

---

## V1 Central TX pilot — remaining after this scope

| Area | Notes |
|------|--------|
| Paywall | Deferred — wallet sim OK for pilot |
| Extension UX | Waves 7a–7c |
| Full corpus in Neon | Operator warmup / substrate export per key |
| ICC L1 | Blocked on API credentials |
| `place_dossier` MCP | G3 |
| Enterprise Regrid | Sales-gated |
| Production Regrid 2k/mo monitoring | Ops |

---

## Acceptance (wave 0–1 in LDT)

- [ ] Second `/brief` same coords: 0 Regrid HTTP (logs); snapshots served.
- [ ] `/brief` response includes `atoms.workspaceDid`, `atoms.briefRunDid`, `atoms.placeLayers`, `atoms.inlineRefs`.
- [ ] Plano / Round Rock / Cedar Hill addresses resolve `jurisdiction` key (geocode).
- [ ] `GET /coverage` lists pilot keys with `neon` / `engine_only` / `blocked`.
- [ ] `brokerage_workspaces.ll_uuid` set when Regrid returns parcel.

---

## Wiring summary (implementation reference)

Brief + Generate layers: read permanent store first; pass cache for same-day hot path.

On Regrid miss: call API → write `place_layer_snapshots` + cache put.

Emit atoms from snapshots (`property-workspace` + place-layer children) for MCP/graph.

Do not rely on `payload_json` alone — normalize parcel identity (`ll_uuid`, APN, geocode).
