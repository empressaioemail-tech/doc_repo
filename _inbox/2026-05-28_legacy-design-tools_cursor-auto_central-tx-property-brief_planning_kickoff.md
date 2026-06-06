---
date: 2026-05-28
agent: cursor-auto (Cursor, cente workstation)
repo: doc_repo
type: recon
topic: central_tx_property_brief_planning_kickoff
status: ready_for_planner
audience: planning-agent
---

# Planning kickoff — Central TX Property Brief + place graph (paywall deferred)

**Purpose:** Hand planning agent a single sweep target for scope, wave status, dispatches, atom-vision alignment, and deploy gates. Operator requested paywall **off** for this wave.

**Related inbox (same day):**
- `2026-05-28_legacy-design-tools_cursor-auto_regrid_api_key_mount.md` — prod `REGRID_API_KEY` mounted on `cortex-api`
- `2026-05-28_doc_repo_cursor-auto_central-tx-property-brief_scope.md` — full scope + missed-items register
- `2026-05-28_legacy-design-tools_cursor-auto_dispatch-A_place-graph-brief.md`
- `2026-05-28_hauska-brief-extension_cursor-auto_dispatch-B_brief-atom-ux.md`
- `2026-05-28_hauska-engine_cursor-auto_dispatch-C_central-tx-corpus-icc.md`

**Draft dispatches also on disk (not committed):** `_dispatches/2026-05-28_central-tx-property-brief-scope.md`, `_dispatches/2026-05-28_dispatch-A_*`, `_dispatches/2026-05-28_dispatch-B_*`

---

## 1) Product thesis (atom vision — confirmed with operator)

**Canonical:** `25_atom_architecture_reference.md` §5 (inline → card → focus) + §9 (AI gateway).

**Property Brief UX target (operator-aligned, 2026-05-28):**

| Surface | Target |
|---------|--------|
| Deep research | **Property list** = primary nav (compact `property-workspace` list) |
| Chat | Center; atom refs as **links in chat** that **expand in-thread** |
| Citations sidebar | **Remove/hide** in consumer mode — not the Compass right-rail model |
| Listing panel morph | **Remove** pill→rectangle animation; normal open/close |

**Backend composition target:**

```text
property-workspace (listingKey + geocode + ll_uuid)
  ├── place-layer-regrid / place-layer-fema (full Premium payload, permanent store)
  ├── brief-run (citationRefs[] → code-section DIDs)
  └── API projection + wallet/GTM (not payload_json alone)
```

---

## 2) Engineering waves — status

| Wave | ID | Deliverable | Status | Owner repo |
|------|-----|-------------|--------|------------|
| 0 | 0a | `place_layer_snapshots` + read/write in brief path | **Implemented (uncommitted LDT)** | legacy-design-tools |
| 0 | 0b | Adapter cache wired into `fetchBrokerageSiteContext` | **Implemented** | legacy-design-tools |
| 0 | 0c | Central TX geocode registry from engine snapshot | **Implemented** | legacy-design-tools |
| 0 | 0d | `GET /api/brokerage/v1/coverage` | **Implemented** | legacy-design-tools |
| 0 | 0e | Partnership rule: MOU → Plane E/B on place node only | **Not written** | doc_repo `73` |
| 1 | 1 | Atom projections from `/brief` (`atoms.*`) | **Implemented** | legacy-design-tools |
| 1 | 2 | `ll_uuid` + lat/lon on `brokerage_workspaces` | **Implemented** | legacy-design-tools |
| 1 | 3 | Richer Regrid summaries + full payload in snapshots | **Partial** (payload stored; UI/Grok expand ongoing) | LDT + extension |
| 2 | 4 | Substrate MCP or Neon warm for all Central TX keys | **Not started** | LDT + hauska-engine |
| 2 | 5 | Register brokerage atoms + `atom_events` | **Not started** | legacy-design-tools |
| 2 | 6 | ICC L1 ingest → effective-code in brief | **Blocked on creds** | hauska-engine |
| 3 | 7a–7c | Extension: no morph, list nav, inline chips | **Not started** | hauska-brief-extension |
| — | — | **Paywall / Stripe** | **Explicitly deferred** | — |

---

## 3) LDT implementation manifest (2026-05-28, uncommitted)

**Migration:** `lib/db/drizzle/0030_place_layer_snapshots.sql`

**New files:**
- `lib/db/src/schema/placeLayerSnapshots.ts`
- `lib/codes/src/centralTexasPilot.ts` (+ test)
- `artifacts/api-server/src/lib/placeLayerUtils.ts`
- `artifacts/api-server/src/lib/placeLayerSnapshots.ts`
- `artifacts/api-server/src/lib/brokerageBriefAtoms.ts`
- `artifacts/api-server/src/lib/brokeragePilotCoverage.ts`
- `artifacts/api-server/src/routes/brokerageCoverage.ts`
- `artifacts/api-server/src/__tests__/brokerageBriefAtoms.test.ts`

**Modified (property-brief slice):**
- `artifacts/api-server/src/lib/brokerageSiteContext.ts` — snapshot → cache → live
- `artifacts/api-server/src/routes/brokerageBrief.ts` — `atoms` in response, coverage route mount
- `artifacts/api-server/src/lib/brokerageWorkspace.ts` — `ll_uuid`, lat/lon upsert
- `lib/codes/src/jurisdictions.ts` — Central TX geocode fallback
- `lib/db/src/schema/brokerageWorkspaces.ts` — geo columns

**Engine corpus keys registered for geocode (~30):** from `hauska-engine/services/retrieval-api/corpus/snapshot.json` — e.g. `austin_tx`, `round_rock_tx`, `cedar_hill_tx`, `watauga_tx`. **Neon warmed today:** `bastrop_tx`, `cedar_hill_tx`, `grand_county_ut` only. Coverage endpoint exposes `neon` vs `engine_only`.

**API additions:**
- `GET /api/brokerage/v1/coverage` — pilot manifest
- `POST /brief` response field `atoms`: `{ workspaceDid, briefRunDid, placeLayers, inlineRefs }`
- `property.llUuid` when Regrid returns parcel

---

## 4) Deploy gates (before pilot honesty)

1. **Apply `0030`** on cortex-api Postgres (prod + staging).
2. **Redeploy `cortex-api`** with uncommitted LDT branch once merged.
3. **Fixture refresh:** `cd lib/db && pnpm db:push:test && pnpm db:dump:test-fixture` (CI drift).
4. **Smoke:** repeat `/brief` same address → verify 0 Regrid HTTP on second call (snapshots + cache).
5. **Regrid license:** confirm order form allows permanent `place_layer_snapshots` retention.

`REGRID_API_KEY` already on prod per same-day mount courier.

---

## 5) Items easy to miss (planner should track)

1. Permanent store ≠ 24h `adapter_response_cache` — both are wired now.
2. Substrate has ~30 Central TX keys; LDT Neon subset — coverage must stay honest.
3. `inlineRefs` API field required for extension inline-atom UX (dispatch B).
4. Cortex `bootstrapAtomRegistry` does not yet register brokerage atom types.
5. Dallas **city** blocked (`dallas|tx`); suburbs OK.
6. Partner GIS (Bastrop) = Generate Layers only; Brief = FEMA + Regrid national baseline.
7. Extension `defaultJurisdiction` ignored when server geocodes — document in `75a`.
8. Consumer vs pro: lay verdicts + inline atoms; pro may keep collapsed sources.

---

## 6) V1 Central TX pilot — still open after this wave

| Area | Notes |
|------|--------|
| Corpus in Neon | Operator warmup / substrate export per `engine_only` key |
| Extension UX | Dispatch B (7a–7c) |
| ICC L1 | Dispatch C when API credentials land |
| `atom_events` + registry | Dispatch A follow-up |
| GTM share cards / steward digest | Post graph registration |
| `place_dossier` MCP | G3 — later |
| Enterprise Regrid | Sales-gated |
| **Paywall** | Deferred per operator 2026-05-28 |

---

## 7) Suggested planner actions

1. File scope doc → `_dispatches/` or `77_place_graph_strategy.md` addendum.
2. Assign **Dispatch A** → cc-agent-C (LDT), **Dispatch B** → extension agent, **Dispatch C** → cc-agent-E (engine).
3. Add **75b** coverage honesty table synced to `GET /coverage` manifest.
4. Append partnership place-node rule to `73_partnerships.md`.
5. Sequence: merge LDT 0030 → deploy → extension B (morph quick win) → Neon warmup batch → atom_events.
6. **Do not** schedule paywall/Stripe in this cascade.

---

## 8) Git hygiene note for orchestrator

`legacy-design-tools` working tree on cente workstation mixes **this property-brief slice** with other in-flight edits (encumbrances, GTM schema, design-tools panel). Planning agent should treat property-brief files in §3 as the scoped commit; other modified paths may belong to parallel work — verify with `git diff` before merge.

**No commits made** to legacy-design-tools or doc_repo from this session (courier only).

---

## 9) Confidence

| Claim | Confidence |
|-------|------------|
| Wave 0–1 LDT code written and typechecks | High (local `tsc` api-server green; unit tests pass without DATABASE_URL) |
| Atom vision alignment with operator | High (explicit discussion + `25_atom` refs) |
| Engine corpus key list | High (parsed from snapshot.json 2026-05-26) |
| Prod Regrid mount | High (separate courier + smoke) |
