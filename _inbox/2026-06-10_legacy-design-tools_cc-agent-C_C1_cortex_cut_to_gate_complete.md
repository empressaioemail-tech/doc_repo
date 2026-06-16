---
id: 2026-06-10_legacy-design-tools_cc-agent-C_C1_cortex_cut_to_gate_complete
title: C1 — cut Cortex to the gate (COMPLETE)
date: 2026-06-10
agent: cc-agent-C
repo: legacy-design-tools
kind: session
status: complete — PR held for operator merge
model: Grok Build 0.1 — no escalation
related: [_dispatches/2026-06-10_cc-agent-C_C1_cortex_cut_to_gate, 58_gtm_readiness_sprint, 56_engine_extraction_sprint]
---

# C1 — cut Cortex to the gate (COMPLETE)

## Workspace

```
P:\ldt-cortex-cut-to-gate
branch: cortex/cut-to-gate
base: origin/main @ 396312b (post #168 auth-fix)
HEAD: c7c40eb
```

## PR

- **URL:** https://github.com/empressaioemail-tech/legacy-design-tools/pull/169
- **SHA:** `c7c40eb`
- **Merge:** held for operator

## Per-engine cut state (flags default OFF)

| Flag | Default | Call site | Spine endpoint |
|---|---|---|---|
| `ENGINE_SPINE_BRIEFING` | `0` | `parcelBriefings.ts` → `routeGenerateBriefing` | `POST /v1/briefing/generate` |
| `ENGINE_SPINE_FINDINGS` | `0` | `findings.ts` → `routeGenerateFindings` | `POST /v1/findings/generate` |
| `ENGINE_SPINE_FINDINGS_ORCHESTRATED` | `0` | `findings.ts` → `routeGenerateOrchestratedFindings` | `POST /v1/findings/generate-orchestrated` |
| `ENGINE_SPINE_HYDROLOGY` | `0` | `siteDrainageIngest.ts` → `routeRunHydrologyWorker`, `routeResolveRainfallForcing` | `POST /v1/hydrology/drainage`, `/rainfall-forcing` |
| `ENGINE_SPINE_TOPOGRAPHY` | `0` | `siteTopographyIngest.ts` → `routeFetchUsgs3depDem` | `POST /v1/hydrology/dem` |

Env (required only when a flag is on):

```
ENGINE_API_URL=https://hauska-engine-api-h7gvu7rgcq-uc.a.run.app
ENGINE_API_GATE_TOKEN=<HAUSKA_ENGINE_API_KEY secret>
```

Boot validation: `validateEngineSpineEnvAtBoot()` refuses start if any `ENGINE_SPINE_*` flag is on without `ENGINE_API_URL`.

## Gate-front seam

cortex-api constructs gate-front context (`X-Hauska-*` + bearer) on outbound engine-api calls. Inbound briefing generate now uses `requireGateEngineServiceAuth` + `assertEngagementServiceTenantScope`.

**cc-agent-M companion still required** for external MCP agents: gate does not yet proxy `/v1/*` (only retrieval-api + legacy cortex-api paths).

## S1 precedence — production wire

**Wire point:** `lib/finding-engine/src/engine.ts` → `buildPrecedenceFindingDrafts()` before LLM drafts, merged in `finalizeDrafts`.

**Integration test (verbatim):**

```
pnpm --filter @workspace/finding-engine test -- --run src/__tests__/precedenceProductionWire.test.ts

 ✓ precedenceProductionWire.test.ts (2 tests)
 Test Files  1 passed (1)
      Tests  2 passed (2)
```

Full finding-engine: **86 passed**.

## Lineage proof (HARD)

S1 test asserts ADA+FHA+A117.1 input produces governing finding with:

```json
"citations": [
  "federal-accessibility-standards/2010-ada-standards-for-accessible-design/404.2.3-clear-width",
  "federal-accessibility-standards/fair-housing-act-design-manual-april-1998/ch4-door-clear-width",
  "icc-model-code/a117.1-2021/404.2.3.2-clear-width-stub"
]
```

(all three `atomId`s on emitted finding `citations[]`). Local engine path unchanged when spine flags off.

## Provenance envelope wiring

| Surface | Field | Builder |
|---|---|---|
| `GET /submissions/:id/findings` | `finding.provenance` | `buildProvenanceFromFindingRow` (DB-hydrates corpus + reasoning atoms) |
| `GET /engagements/:id/briefing` | `briefing.provenance` | `buildProvenanceFromBriefing` |
| `GET /codes/atoms/:id` | `provenance` | `buildProvenanceFromCodeAtom` |

Shape (rail-quiet — no calibration grade):

```typescript
{
  lineage: { atomIds: string[] };
  sources: Array<{ atomId; deeplink; edition; retrievedAt; verificationState }>;
  reasoning: { rule?; precedenceChain?; projectFacts? };
  confidence: number;
  evaluatedAt: string;  // ISO-8601
  edition: string | null;
}
```

Precedence findings populate `reasoning.rule` + `reasoning.precedenceChain` from reconciliation text.

## Topology-A calibration port verification

| Check | Result |
|---|---|
| engine-api deployed | `GET /health` → `{"status":"ok","service":"engine-api","adapters":true,"engineCore":true}` |
| Ungated `/v1/*` rejected | `POST /v1/findings/generate` without bearer → `{"error":"unauthorized"}` |
| Overlay store location | cortex Neon `atom_calibration_overlay` (migration 0037) — unchanged |
| cortex-api calibration routes | `findingsCalibrationOverlay.ts` still reads/writes via `@workspace/engine-core` on cortex Neon |
| Spine `CalibrationRepositoryPort` | Bound on engine-api deploy to cortex `DATABASE_URL` (operator topology per PR #71) |

Arrow-two deposit loop remains gate-independent server-side on cortex Neon; spine cut does not relocate overlay rows.

## Verification artifacts (HR-8)

```
pnpm run typecheck → exit 0

pnpm --filter @workspace/finding-engine test -- --run
 Test Files  12 passed (12)
      Tests  86 passed (86)
```

## Operator flip checklist (post-merge)

1. Set `ENGINE_API_URL` + `ENGINE_API_GATE_TOKEN` on cortex-api Cloud Run
2. Flip one flag at a time: `ENGINE_SPINE_FINDINGS=1` first, verify lineage on a Bastrop submission
3. Then briefing, orchestrated, hydrology, topography
4. cc-agent-M: add gate `/v1/*` proxy for external agents (separate dispatch)

## Blockers

None for merge. Live gated smoke with production bearer requires operator secret bind on cortex-api deploy (documented above).
