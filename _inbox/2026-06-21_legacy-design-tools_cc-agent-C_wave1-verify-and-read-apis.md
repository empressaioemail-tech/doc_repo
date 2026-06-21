---
id: 2026-06-21_legacy-design-tools_cc-agent-C_wave1-verify-and-read-apis
title: cc-agent-C — Wave 1 F0 verify-first + read-API confirmation (Calibrated Spine)
date: 2026-06-21
agent: cc-agent-C
repo: legacy-design-tools
branch: map/track123-free-federal-layers (verify read against live tree; not merged)
dispatch: Calibrated Spine Wave 1 — F0 verify-first, expose/confirm spine-console read APIs
tasks: [F0]
blocks_unblocked: [F3, F4-cortex-side, F5, F9, W1, K2 — design only until Wave 2 build]
---

# Close — Wave 1 F0 verify-first + read-API confirmation

## Summary

Re-verified live `legacy-design-tools` tree (2026-06-21) against [`03_gap_analysis.md`](../_calibrated_spine_roadmap/03_gap_analysis.md) hypotheses. **No Wave 1 build landed in this close** — warming harness, backtest, and calibration loop explicitly deferred per dispatch. Read APIs the spine console needs **already exist** on the brokerage place graph and codes/atom surfaces; there is **no dedicated `atoms-for-parcel` route name** — `GET …/place/:placeKey/dossier` is the de facto parcel→atoms read surface (capped). EngineEnvelope confidence is **`{ value, kind }` plus honesty siblings**, not the F4 read-contract `{ confidence, n, width, provenance }` object.

---

## F0 — Raw ground truth (live main tree)

### F3 — Evidence ledger (`atom_events`, `findings.citations[].atomId`)

**`atom_events` table** (append-only; no FK to entity tables):

```sql
-- lib/db/src/__tests__/__fixtures__/schema.sql.template:59-70
CREATE TABLE @@SCHEMA@@.atom_events (
    id text NOT NULL,
    entity_type text NOT NULL,
    entity_id text NOT NULL,
    event_type text NOT NULL,
    actor jsonb NOT NULL,
    payload jsonb NOT NULL,
    prev_hash text,
    chain_hash text NOT NULL,
    occurred_at timestamp with time zone DEFAULT now() NOT NULL,
    recorded_at timestamp with time zone DEFAULT now() NOT NULL
);
```

**OpenAPI wire shape** (`AtomHistoryEvent` — chain hashes omitted on HTTP):

```yaml
# lib/api-spec/openapi.yaml:12630-12655 (abridged)
AtomHistoryEvent:
  properties:
    id: { type: string }
    eventType: { type: string }
    actor: { $ref: "#/components/schemas/AtomEventActor" }
    occurredAt: { type: string, format: date-time }
    recordedAt: { type: string, format: date-time }
  required: [id, eventType, actor, occurredAt, recordedAt]
```

**`findings.citations[]`** — discriminated union stored verbatim on the finding row:

```typescript
// lib/db/src/schema/findings.ts:49-53, 143
//   {kind: "code-section", atomId}
//   {kind: "briefing-source", id, label}
citations: jsonb("citations").notNull().default(sql`'[]'::jsonb`),
```

**Adjudication events captured today** (plan-review / Codex reviewer path — event types are `finding.*`, not `codex.*`):

| Event type | Emitted from | Payload stamps (representative) |
|---|---|---|
| `finding.generated` | `findings.ts` engine insert | `findingId`, `atomId`, `submissionId`, `severity`, `category`, **`confidence` (numeric)**, `generationId` |
| `finding.accepted` | `POST /findings/:id/accept` | `findingId`, `atomId`, `submissionId`, `previousStatus` |
| `finding.rejected` | `POST /findings/:id/reject` | same pattern |
| `finding.overridden` | override route | original + revision atom ids |

```typescript
// artifacts/api-server/src/routes/findings.ts:732-745 (finding.generated payload)
payload: {
  findingId: finding.id,
  atomId: finding.atomId,
  submissionId: finding.submissionId,
  severity: finding.severity,
  category: finding.category,
  confidence: Number(finding.confidence),
  generationId,
},
```

**Calibration signal join** reads `atom_events` × `findings.citations` at code-section grain:

```typescript
// lib/engine-core/src/signals.ts:29-33, 165-179
const ADJUDICATION_EVENT_TYPES = [
  "finding.accepted",
  "finding.rejected",
  "finding.overridden",
] as const;
// … innerJoin(findings, eq(findings.atomId, atomEvents.entityId))
```

**F3 gap vs reality:** Phase-1 ledger exists. **Missing for F3 rich-raw spec:** model-attribution stamp, adjudicator role-at-judgment, source-event-type field, success/trial counts at finest grain. Accept/reject payloads carry **actor** on the event row but not role-at-judgment in payload.

---

### F4 — EngineEnvelope confidence shape

**Authoritative TypeScript contract** (`@workspace/engine-core`):

```typescript
// lib/engine-core/src/envelope.ts:8-41
export type EngineConfidenceKind = "calibrated" | "asserted" | "deterministic";

export interface EngineEnvelopeConfidence {
  value: number;
  kind: EngineConfidenceKind;
}

export interface EngineEnvelope<TPayload = unknown> {
  payload: TPayload;
  confidence: EngineEnvelopeConfidence;
  dataVintage: string | null;
  coverage: EngineEnvelopeCoverage;
  source: EngineEnvelopeSource;
}
```

**OpenAPI `EngineHonesty`** (buyer-facing slice — same confidence shape, no n/width/provenance):

```yaml
# lib/api-spec/openapi.yaml:14524-14569 (abridged)
EngineHonesty:
  properties:
    confidence:
      properties:
        value: { type: number, minimum: 0, maximum: 1 }
        kind: { enum: [calibrated, asserted, deterministic] }
      required: [value, kind]
    dataVintage: { type: string, nullable: true }
    coverage: { properties: { degraded: boolean, reason: string } }
    source: { properties: { adapter: string, citationIds: array } }
```

**Verified test output** (local, no DB):

```
pnpm exec vitest run src/__tests__/envelope.test.ts --reporter=verbose
✓ unwraps cc-agent-E shaped envelope … honesty.confidence = { value: 0.87, kind: "calibrated" }
Test Files  1 passed (1) | Tests  4 passed (4)
```

**F4 verdict:** Gap analysis **confirmed** — confidence is scalar **`value` + `kind`**, plus `dataVintage`, `coverage`, `source`. **No `n`, no `width`, no calibration-provenance object**, no type-level prohibition on bare scalar access. Separate **`atom_calibration_overlay`** table holds `asserted_confidence` / `calibrated_confidence` numerics but is **not** folded into EngineEnvelope on consumer surfaces.

---

### Brief pipeline (Property Brief / brokerage path)

**Route surface** (`brokerageBrief.ts` header + mount):

```
POST /api/brokerage/v1/brief          — full compute (geocode → local code → site-context → LLM → persist run)
GET  /api/brokerage/v1/brief/:runId   — read persisted run
POST /api/brokerage/v1/brief/summarize
POST /api/brokerage/v1/research/chat
```

**Cascade inside `POST /brief`** (verified read of handler):

1. `geocodeAddress(address)`
2. `resolveBriefLocalCodeLayer` → `retrieveAtomsForQuestion` / substrate gate / web supplement
3. `captureParcelKey` (CLIP / ll_uuid)
4. `fetchBrokerageSiteContext` (federal + Cotality adapters by investor tier)
5. `generateReasoningSummary` + `generateLaySummary` (LLM)
6. `buildBriefAtomProjection` + `buildBrokerageBriefProvenanceEnvelope`
7. Persist `brokerage_brief_runs` + workspace upsert + GTM events

**Engagement briefing path** (architect / plan-review, separate from extension brief):

```
GET  /engagements/{id}/briefing
POST /engagements/{id}/briefing/generate
GET  /engagements/{id}/briefing/status
POST /engagements/{id}/briefing/fetch-adapters
```

Documented in `lib/api-spec/openapi.yaml` § `/engagements/{id}/briefing*`. Uses `parcel_briefings` + `briefing_sources` + async generation jobs — **not** the brokerage `brokerage_brief_runs` table.

**`reasoning_atoms` cold-warm UPSERT** exists (`lib/codes/src/reasoningAtoms/persist.ts`); **`scripts/warm-codewarm-jurisdiction.mjs`** drains jurisdiction manifests into Neon. **No W1 parcel-universe orchestration.**

---

### Site-context data per parcel today

**Fetcher:** `fetchBrokerageSiteContext` (`brokerageSiteContext.ts`). Read order: `place_layer_snapshots` → adapter cache → live upstream. Cotality is sole national parcel spine (Regrid purged 2026-06-17 per file header).

**Layers by investor tier** (`brokerageTierGate.ts`):

| Tier | Adapter keys (representative) |
|---|---|
| **free** | `fema:nfhl-flood-zone`, `cotality:parcels`, `cotality:zoning`, `national:opportunity-zone` |
| **pro** | + `usgs:ned-elevation`, `epa:ejscreen`, `cotality:property`, `cotality:rent-avm`, `cotality:liens-mortgage-tax`, `cotality:permits`, `cotality:propensity`, `cotality:owner-occupancy`, `cotality:hoa`, `cotality:comparables` |
| **max** | + `usda:ssurgo-soils`, `usgs:geology`, `usgs:seismic`, `cotality:climate`, `cotality:hazards`, `cotality:replacementcost`, `cotality:mineral`, `cotality:utility`, `cotality:sinkhole`, `cotality:foundation`, `tceq:edwards-aquifer` (feature-flagged) |

**Per-layer wire shape:**

```typescript
// brokerageSiteContext.ts:48-61
export interface BrokerageSiteContextLayer {
  layerKind: string;
  adapterKey: string;
  tier: string;
  status: "ok" | "no-coverage" | "failed";
  provider?: string;
  summary?: string | null;
  snapshotDate?: string;
  payload?: Record<string, unknown>;
  fromArchive?: boolean;
  engineHonesty?: EngineHonesty | null;  // asserted 0.72 default when synthesized
}
```

**Parcel identity fields:** `parcelClip`, `ll_uuid` (from Cotality parcel layer), APN/PIN via `COTALITY_PARCEL_ID_KEYS`.

**Operator auth:** `brokerageAuth` tier `operator` → `resolveInvestorPackageTier` returns **`max`** (`brokerageTierGate.ts:80`).

---

### F1 — Per-atom read attribution (verify-first)

**Finding:** No atom-grain retrieval or MCP read-attribution instrumentation in this repo. Closest pieces:

- `POST /dev/atoms/retrieve` — operator probe, returns full retrieval set for a query (not per-read logging)
- GTM `mcp_tool_call` events aggregate tool name counts (`brokerageGtm.ts` digest) — **tool grain**, not atom grain
- `computeAttributionCoverage` — joins finding citations to overlay rows, not retrieval logs

**Verdict:** Gap row **confirmed GAP** — F1 remains unverified in hauska-mcp-server (cc-agent-M lane); legacy-design-tools has no atom-grain read attribution.

---

### F2 — Consequence metadata on atoms (verify-first)

**Finding:** `code_atoms.metadata` is generic `jsonb` with **no schema fields** for ASCE 7 risk category, IBC occupancy, or importance factor in Drizzle schema (`code_atoms.ts:36`). Findings carry **`discipline`** (plan-review enum: building, electrical, …) — not building consequence / risk category.

**Verdict:** Gap row **confirmed GAP** — consequence metadata join not present on corpus atoms in this repo (cc-agent-E lane).

---

### F9 — Present-tense violation (plan-review confidence)

**Finding:** Plan-review findings store LLM-emitted **`findings.confidence` numeric**; wire mapper uses `Number(row.confidence)` with no overlay lookup:

```typescript
// artifacts/api-server/src/routes/findings.ts:337
confidence: Number(row.confidence),
```

Finding engine requires model-emitted confidence:

```typescript
// lib/finding-engine/src/anthropicGenerator.ts:169-176
const confidenceRaw = obj.confidence;
// … findings[n].confidence must be a finite number
```

**Calibration overlay read API exists** but is **not wired to displayed finding confidence**:

```
GET /findings/calibration-overlay?jurisdictionTenant=&atomId=
GET /findings/calibration-overlay/health
```

(internal audience gate in `findingsCalibrationOverlay.ts`).

**Verdict:** Gap row **confirmed GAP** — overlay 0037 substrate exists; displayed plan-review number is still LLM-emitted scalar.

---

## Read APIs — confirmed for spine console (Wave 1)

No new routes added this wave. Below is the **confirmed read surface** the map-agent spine console can call on localhost (cortex-api / `dev:local`).

### 1. Parcel resolve (address → parcel + jurisdiction)

```
POST /api/brokerage/v1/place/resolve
Authorization: Bearer <BROKERAGE_OPERATOR_API_KEY>
Content-Type: application/json

{ "address": "17003 Simsbrook Dr, Pflugerville, TX 78660" }
```

**Success shape** (`placeResolve.ts:20-32`):

```json
{
  "placeKey": "coord:30.43972:-97.62028",
  "jurisdiction_key": "pflugerville_tx",
  "ll_uuid": "<cotality clip or null>",
  "workspaceDid": "did:hauska:property-workspace:<listingKey>",
  "geocode": {
    "lat": 30.43972,
    "lng": -97.62028,
    "city": "Pflugerville",
    "state": "TX",
    "confidence": "high"
  }
}
```

Also accepts `{ "lat", "lng", "address?" }`. Implementation: `artifacts/api-server/src/routes/brokeragePlace.ts` → `resolvePlace()`.

**Not in OpenAPI** — brokerage routes are implementation-only today.

---

### 2. Site-context layers (per parcel / placeKey)

```
GET /api/brokerage/v1/place/{placeKey}/layers
Authorization: Bearer <BROKERAGE_OPERATOR_API_KEY>
```

Returns `{ placeKey, layers: [{ layerKind, adapterKey, tier, status, provenance, did, provider, summary, asOf, citation }] }`.

Operator tier resolves **max** adapter set when fetching live.

---

### 3. Atoms-for-parcel (de facto — dossier, capped)

**There is no route named `atoms-for-parcel`.** Closest read-only aggregate:

```
GET /api/brokerage/v1/place/{placeKey}/dossier
Authorization: Bearer <BROKERAGE_OPERATOR_API_KEY>
```

Built by `buildPlaceDossier()`:

- Runs top **`BROKERAGE_CODE_QUERIES`** (5 queries, **max 3** code inline refs) via `retrieveAtomsForQuestion`
- Embeds parcel inline ref when CLIP/APN available
- Returns `layers`, `inlineRefs`, `federalSummaries`, `jurisdiction_key`

**Full jurisdiction atom browse** (not parcel-scoped, read-only):

```
GET /codes/jurisdictions/{key}/atoms?limit=50
GET /codes/atoms/{id}
GET /atoms/{slug}/{id}/summary
GET /atoms/{slug}/{id}/history?limit=50
```

**Operator retrieval probe** (same module as chat):

```
POST /dev/atoms/retrieve
x-snapshot-secret: <SNAPSHOT_SECRET>
{ "jurisdiction": "pflugerville_tx", "query": "setback requirements" }
```

**Reasoning atoms** — DB helpers exist (`countReasoningAtomsForJurisdiction`, `retrieveReasoningAtomsForRefs`) but **no HTTP list-by-jurisdiction route** in OpenAPI. Console must query DB via future route or use codes retrieval + overlay.

---

### 4. Calibration overlay read (internal session)

```
GET /findings/calibration-overlay?jurisdictionTenant=pflugerville_tx&atomId=<id>
GET /findings/calibration-overlay/health?jurisdictionTenant=pflugerville_tx
```

Requires **`req.session.audience !== "internal"`** guard (reviewer internal audience). Returns overlay rows with `assertedConfidence`, `calibratedConfidence`, `effectiveConfidence`, `signalCount` — still **scalars**, not F4 read-contract.

---

### 5. Map-data / GIS (auxiliary for console map host)

```
POST /api/brokerage/v1/map-data
POST /api/brokerage/v1/map-data/gis-layer
GET  /api/brokerage/v1/map-data/gis-layers
POST /api/brokerage/v1/map-data/composite-layer
```

Gate-fronted; documented in `brokerageMapData.ts` header.

---

## Gap analysis contradictions (F0 rewrites)

| Gap row | Hypothesis in `03_gap_analysis.md` | Live ground truth (2026-06-21) | Rewrite |
|---|---|---|---|
| **F3** | "Codex accept/edit/reject captured" | Events are **`finding.accepted/rejected/overridden`** on `entity_type=finding`; no `codex.*` event types; accept payload lacks adjudicator role-at-judgment | PARTIAL → **extend**, not rename; Codex is the UI, finding events are the ledger |
| **F3** | "confirm source-event-type and raw counts stamped" | `atom_events.event_type` exists; **no** `source-event-type` column; **no** trial/success counts in adjudication payloads | **GAP** for F3 build — ledger shell only |
| **F4** | "Confidence is a scalar; EngineEnvelope carries confidence plus kind" | **Confirmed** — `{ value, kind }` + honesty siblings; overlay is separate table | **Confirmed GAP** vs target read-contract; kind≠provenance |
| **F4** | "not n plus width plus provenance as one object" | No `n`, `width`, or `calibrationProvenance` anywhere on EngineEnvelope or finding wire | **Confirmed GAP** |
| **F6** | "assertedConfidence and calibratedConfidence split exists (0036/0037)" | On `reasoning_atoms` + `atom_calibration_overlay`; **not** exposed as three-axis contract; **no severity axis** | PARTIAL **confirmed** |
| **F9** | "overlay (0037) not wired to displayed number" | **Confirmed** — findings wire uses `findings.confidence` only | **Confirmed GAP** |
| **F1** | "grain unconfirmed, probably tool or finding level" | Retrieval: **no atom-grain logs** in LDT; GTM MCP: **tool grain** | **Confirmed GAP** |
| **F2** | "ASCE 7 and IBC occupancy and importance not known on atoms" | **Confirmed GAP** — no such fields on `code_atoms` | **Confirmed GAP** |
| **W** | "Brief pipeline exists; reasoning_atoms cold-warm UPSERT exist" | **Confirmed**; brokerage brief + engagement briefing are **two pipelines**; no W1 harness | PARTIAL **confirmed** |
| **V/R recon** | Map mentions Regrid parcel | **Stale** — `brokerageSiteContext.ts` header: Regrid purged; Cotality sole parcel spine | Update recon refs |
| **E** | "no operator console" | **Confirmed NEW** | unchanged |
| **Brokerage APIs** | (implicit in E console) | Place/brief/map-data routes **exist** but are **absent from OpenAPI** | Document for console; optional OpenAPI pass later |

---

## Proposed Wave 2 task list — cc-agent-C lane

Ordered by dependency. **Blocked items named.**

| Task | Wave 2 unit | Depends on | Blocks | Notes |
|---|---|---|---|---|
| **F3** | Rich raw ledger extension — model-attribution stamp, adjudicator role-at-judgment, source-event-type in payload, trial/success counts | F0 ✓ | F9, K2, S3 | Touch `findings.ts` emit helpers + event payload schema; no derived numbers persisted |
| **F4** | Cortex-api propagation of hauska-atom-contract read-contract type | **cc-agent-AC** lands type first | F9, K6, W3, V4 | Long pole; LDT side: brokerage provenance envelope, site-context layer honesty, brief response |
| **F5** | Raw-conflict log — disagreeing synthesis inputs + provenance/vintage | F0 ✓ | K5, W3 | New append-only event family or table; derive conflict type at read |
| **F9** | Close present-tense violation — plan-review displayed confidence from overlay/adjudication loop via F4 | F3, F4 | M1 credibility | Replace `Number(row.confidence)` wire path; keep LLM number in ledger as raw signal only |
| **W1** | Warming-and-QA harness — idempotent cascade (geocode → resolve → retrieve → site-context → synthesis → reasoning_atoms UPSERT) | F4 shape (honest confidence on cache), F2 (consequence for QA assertions) | W2–W5 | **Blocked on F4 read-contract** for honest cached confidence; can scaffold controller without quota/backtest |
| **K2** | Edition-correct retrodiction harness | K1 acquisition (**dedicated agent**), F3, F7 (**cc-agent-E**) | M1 | **Blocked on K1** — no historical permit data in repo |
| **X1** | Tenant leg (authenticated reviewers + partitions) | F-track schema lock | X2, X3, S-track | Parallel once F3/F4 land |
| **Expose** | `GET /api/brokerage/v1/place/:placeKey/atoms` — uncapped code + reasoning atom list with overlay join | Wave 1 dossier gap | E7 console | Small read route; optional Wave 2 quick win for map agent |
| **Expose** | `GET /codes/jurisdictions/{key}/reasoning-atoms` or extend dossier | — | E2/E7 | Reasoning atoms currently DB-only |

**Wave 2 blockers for cc-agent-C:**

1. **F4 type from cc-agent-AC** — cannot honestly migrate surfaces until read-contract type exists.
2. **K1 acquisition** — K2 retrodiction has no fallback.
3. **F2 consequence metadata (cc-agent-E)** — W3 QA assertions and S5 early routing need it.
4. **F7 granular invalidation (cc-agent-E)** — K2 edition-correct scope.

---

## Verified commands

```text
# EngineEnvelope shape (passed)
cd P:\legacy-design-tools\lib\engine-core
pnpm exec vitest run src/__tests__/envelope.test.ts --reporter=verbose
→ Test Files 1 passed | Tests 4 passed

# Calibration overlay integration (requires local Postgres — NOT run)
pnpm exec vitest run src/__tests__/calibration-overlay.test.ts
→ ECONNREFUSED 127.0.0.1:5432 (expected on this workstation without test DB)
```

---

## What did not ship

- Warming harness (W1), backtest (K2), calibration loop (recompute batch)
- New HTTP routes (confirmed existing surfaces sufficient for Wave 1 shell wiring; dossier cap documented)
- OpenAPI entries for `/api/brokerage/v1/place/*`

---

## Unblocks

- **Map agent (E console):** can wire parcel drill-through to `place/resolve` → `place/layers` → `place/dossier` + `/atoms/{slug}/{id}/summary|history` with operator API key.
- **cc-agent-AC:** F4 type draft can proceed against verified `{ value, kind }` baseline and overlay table fields.
- **Planner:** rewrite `03_gap_analysis.md` F1/F2/F3/F4/F9 rows per contradiction table above.
