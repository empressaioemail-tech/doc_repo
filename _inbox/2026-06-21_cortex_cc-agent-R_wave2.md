---
id: 2026-06-21_cortex_cc-agent-R_wave2
title: cc-agent-R — Wave 2 F4 Cortex propagation + S5 routing + R1 embed adapter
date: 2026-06-21
agent: cc-agent-R
repo: legacy-design-tools (Cortex runtime)
branch: map/track123-free-federal-layers (working tree)
dispatch: Calibrated Spine Wave 2 — F4 Cortex UI/API/chat, S5 consequence-gated routing, R1 embed host adapter, OpenAPI briefing drift
tasks: [F4-Cortex-UI, F4-Cortex-API, F4-chat-agent, S5, R1-impl, OpenAPI-drift]
blocks_unblocked: [R3 report embeds, V4 map read-contract consumption in Cortex, R6 per-app allocation wiring]
---

# Close — Wave 2 F4 Cortex propagation + S5 + R1 embed adapter

## Summary

Landed Wave 2 cc-agent-R lane in `legacy-design-tools`:

| Task | Status | Notes |
|---|---|---|
| **F4 Cortex UI** | ✅ | `ReadContractChrome`; `EngineHonestyChrome` delegates to read-contract; `EncumbrancesPanel` bare `%` removed |
| **F4 Cortex API** | ✅ | `readContract` on findings, encumbrances, private-restrictions briefing; deprecated scalar `confidence` retained for compat |
| **F4 chat agent** | ✅ | `list_findings` emits `readContract`; `create_response_tasks` prefers `readContractSummary` |
| **S5 consequence-gated routing** | ✅ | Asserted high/low Grok model tier from F2-shaped `consequence` on code sections; optional ensemble |
| **R1 embed host adapter** | ✅ | New `@workspace/map-embed` — contract types, `resolveLayerAllocation`, `embedded-static` lifecycle |
| **OpenAPI drift** | ✅ | `engineHonesty` on briefing status/runs; `ReadContract` schema family; finding/briefing encumbrance fields |

**Explicitly not built (Decision 4):** Cortex Leaflet → MapLibre migration. No report embed instances in Cortex UI — contract + adapter only.

**Dependency:** `@hauska/atom-contract@1.4.0` via `vendor/hauska-atom-contract-1.4.0.tgz`.

---

## F4 — Cortex UI

### ReadContractChrome (`lib/portal-ui`)

Primary buyer-facing confidence renderer. Shows **interval width + provenance label** (`Asserted`, `Backtest`, `Seed`, `Live-earned`); never a standalone `NN%` chip without width.

- `EngineHonestyChrome` — transitional wrapper; converts legacy `EngineHonesty` via `legacyHonestyToReadContract` when `readContract` absent
- `FindingDetailPanel` — prefers `finding.readContract`, falls back to `engineHonesty`
- `EncumbrancesPanel` — clause rows + private-restrictions briefing block use `ReadContractChrome`; removed `(confidence * 100).toFixed(0)%` formatters

### UI render sites migrated (Wave 1 inventory A1–A3)

| Site | Before | After |
|---|---|---|
| Findings detail | `EngineHonesty {value, kind} NN%` | `readContract` widthed interval |
| Encumbrance clauses | bare `NN%` | `readContract` or hidden if absent |
| Private restrictions briefing | aggregate bare `%` | aggregate `readContract` |

---

## F4 — Cortex API + chat agent

### Findings wire (`artifacts/api-server/src/routes/findings.ts`)

- `readContract` derived at read via `deriveFindingReadContract` (F9 raw-adjudication loop)
- `lowConfidence` from `isLowConfidenceReadContract`
- `confidence` scalar marked **deprecated** — still emitted for backward compat; OpenAPI `deprecated: true`
- `engineHonesty` retained as transitional slice on run-attributed rows

### Encumbrances + briefing (`encumbranceWire.ts`, `encumbranceService.ts`)

- Clause + aggregate briefing `readContract` from `readContractFromExtractConfidence`
- Human-verified clauses bump `n` in widthed object

### Chat agent (`chatAgentTools.ts`)

- `list_findings` — returns `readContract` per finding (no raw DB scalar in tool JSON)
- `create_response_tasks` — `readContractSummary` in tool schema + provenance footer; `confidence` deprecated in schema/guidance

---

## S5 — Consequence-gated routing (LABELED ASSERTED)

**Module:** `lib/engine-core/src/consequenceGatedRouting.ts`

| Stratum | Model tier | Default Grok model env |
|---|---|---|
| `routine` | low | `XAI_FINDING_LOW_MODEL` → `grok-3-mini` |
| `elevated`, `critical`, `essential` | high | `XAI_FINDING_HIGH_MODEL` → `grok-3` |

- Routing provenance: **`asserted`** (earned weights replace after S3)
- Optional ensemble: `AIR_FINDING_ENSEMBLE_HIGH_CONSEQUENCE=1` — second Grok pass on high stratum (`lib/finding-engine/src/engine.ts`)
- Gated on F2 typed fields: `CodeSectionInput.consequence` (`asce7RiskCategory`, IBC occupancy/importance, jurisdiction)
- Wired in `runFindingGeneration` before engine call; logged with `routingLabel`

**Blocker note:** F2 corpus join (cc-agent-E) not required for routing stub — defaults to ASCE VII Category II / routine when `consequence` absent on retrieved sections.

---

## R1 — Embed host adapter (`lib/map-embed`)

Contract + adapter only — **no embedded map instance in Cortex reports**.

| Export | Role |
|---|---|
| `ReportEmbedMapHost`, `ReportEmbedContext`, `ReportEmbedLifecycle` | R1 static mount contract (Wave 1 §3) |
| `resolveLayerAllocation({ appId, reportType, tier })` | V3 seed from endstate D binding table |
| `createEmbeddedStaticHost({ createRenderer, tier })` | Lifecycle: mount, ResizeObserver, visibility handoff, destroy |

**Allocation examples (verified in tests):**

- `cortex:property-brief` — parcel, zoning, flood, consequence†, triage†, contested†
- `radar:property-brief` — parcel, flood, motivated-seller (distinct from Cortex)

Map-agent remains renderer owner; Cortex report hosts will import `@workspace/map-embed` in R3.

---

## OpenAPI drift fix

| Schema | Fix |
|---|---|
| `BriefingGenerationStatusResponse` | Added nullable `engineHonesty` (was persisted on `briefing_generation_jobs` but absent from spec) |
| `BriefingGenerationRun` | Same |
| `ReadContract`, `WidthedConfidence`, `ConsequenceAxis`, `ThreeAxisConfidence` | New component schemas |
| `Finding` | `readContract` required; `confidence` deprecated |
| `PrivateRestrictionsBriefing` / `PrivateRestrictionBriefingItem` | `readContract` required; scalar deprecated |

Codegen: `pnpm --filter @workspace/api-spec codegen` — regenerated zod + api-client-react.

---

## Verified commands

```text
cd P:\legacy-design-tools
pnpm --filter @workspace/api-spec codegen
→ orval ok; typecheck:libs pass

cd lib/engine-core
pnpm exec vitest run src/__tests__/consequenceGatedRouting.test.ts
→ 3 passed

cd lib/map-embed
pnpm exec vitest run
→ 2 passed

cd lib/portal-ui
pnpm exec vitest run src/components/__tests__/ReadContractChrome.test.tsx
→ 2 passed

cd artifacts/api-server
pnpm exec tsc -p tsconfig.json --noEmit
→ clean
```

---

## Gap analysis update (Wave 2)

| Row | Wave 1 | Wave 2 ground truth |
|---|---|---|
| **F4 Cortex UI** | 3 bare-% sites | **Migrated** — read-contract chrome; no bare % without width |
| **F4 Cortex API** | 13 route families | **Findings + encumbrances + briefing + chat** on read-contract; scalar deprecated |
| **F9 findings scalar** | LLM scalar on wire | **Derived readContract at read**; scalar deprecated not removed |
| **Briefing status drift** | handler-only `engineHonesty` | **OpenAPI aligned** |
| **S5 routing** | absent | **Asserted high/low tier + optional ensemble** |
| **R1 embed** | contract text only | **`@workspace/map-embed` adapter + allocation resolver** |
| **R3 report embeds** | absent | Still blocked on R3 build wave — adapter ready |
| **Cortex Leaflet → MapLibre** | deferred | **Still deferred** (Decision 4) |

---

## Handoff

### map-agent (V3)

`resolveLayerAllocation` seed lives in `lib/map-embed/src/layerAllocation.ts`. When map-agent ships dynamic V3 registry, either:

1. Re-export map-agent resolver from `@workspace/map-embed`, or
2. Replace seed table with import from `@hauska/map-registry`

Binding table in Wave 1 close §5 remains authoritative for R6 overrides.

### cc-agent-E (F2)

When consequence metadata joins land on code-section atoms, populate `CodeSectionInput.consequence` in `findings.ts` `toCodeSectionInput` / retrieval projection — S5 routing will automatically escalate stratum without further routing changes.

### cc-agent-C (F9 full loop)

Finding read-contract already derives from ledger + overlay cache at read. Live earned calibration thickening remains on C2/S-track after M1.

---

## What this wave did **not** build

- No embedded map in any Cortex report or deliverable letter (R3)
- No Cortex renderer migration to shared MapLibre (Decision 4)
- No removal of deprecated `confidence` scalar from wire (compat window)
- No earned model weights (S3) — routing stays **asserted**
