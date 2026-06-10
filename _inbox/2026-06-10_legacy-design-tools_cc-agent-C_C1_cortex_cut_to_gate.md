---
id: 2026-06-10_legacy-design-tools_cc-agent-C_C1_cortex_cut_to_gate
title: C1 — cut Cortex to the gate (recon + cut progress)
date: 2026-06-10
agent: cc-agent-C
repo: legacy-design-tools
kind: session
status: in_progress — recon complete; S1 + findings spine routing landed on branch
model: Grok Build 0.1
related: [58_gtm_readiness_sprint, 56_engine_extraction_sprint, 54_tenant_leg_sprint, _dispatches/2026-06-10_cc-agent-C_C1_cortex_cut_to_gate]
---

# C1 — cut Cortex to the gate

## Workspace hygiene

PR #29 merged on `origin/main` (`b1575ef`). Clean branch created:

```
P:\ldt-cortex-cut-to-gate
branch: cortex/cut-to-gate (from origin/main @ b1575ef)
```

Main clone `P:\legacy-design-tools` remains on `codewarm/austin-2024-uplift-rewarm` (not used for C1).

## Recon — per-engine spine readiness

| Engine | Local call site | Gate-front inbound auth | Spine endpoint (hauska-engine `origin/main` @ `b4cf80f`) | Spine parity | Cut readiness |
|---|---|---|---|---|---|
| **Briefing** | `parcelBriefings.ts` → `generateBriefing()` | **No** `requireGateEngineServiceAuth` on briefing route yet | `POST /v1/briefing/generate` (#70) | 142 engine-core tests pass (lift report) | **Ready** — needs gate auth on briefing route + spine client |
| **Findings** | `findings.ts` → `generateFindings()` | Yes — `requireGateEngineServiceAuth` | `POST /v1/findings/generate` (#70) | Same lift | **Ready** |
| **Findings-orchestrated** | `findings.ts` → `generateOrchestratedFindings()` | Yes | `POST /v1/findings/generate-orchestrated` (#70) | Same lift | **Ready** — plan-set classification/decomposition stays BFF-side |
| **Hydrology** | `siteDrainageIngest.ts` / `siteDrainage.ts` | Yes on engagement routes | `POST /v1/hydrology/dem`, `/drainage`, `/rainfall-forcing` (#70) | Same lift + pysheds sidecar | **Ready** — ingest orchestration stays BFF |
| **Topography** | `siteTopographyIngest.ts` / `siteTopography.ts` | Yes | `POST /v1/site-context/*` + USGS 3DEP client lifted (#70) | Contour ingest orchestration stays BFF | **Ready** — partial (derivation on spine, ingest on BFF) |
| **Decomposition** | `planSetClassification.ts` (BFF) | N/A — not an engine-api route | Orchestrator in engine-core; classifier stays cortex | Plan-set classifier is BFF cargo | **N/A for spine cut** — orchestrated pass only |
| **Precedence** | `lib/finding-engine/src/precedence/` — library only | N/A | Exported in engine-core (#70) | Unit tests pass | **S1 wire** — production path in `engine.ts` does not call reconcile today |

### Spine lift status (verified `origin/main`)

```
b4cf80f feat(engine-core): calibration overlay I/O + site-topo derivation (PR2) (#71)
53d1743 feat(engine): lift reasoning engines into engine-core (ADR-008 step 4 / GTM A2). (#70)
91ab5d4 feat(engine): lift site-context adapters into spine (ADR-008 step 3 / GTM A1) (#69)
```

engine-api on main registers live routes (not scaffold):

- `/v1/site-context/*`
- `/v1/briefing/*`
- `/v1/findings/*`
- `/v1/hydrology/*`

## Gate-route answer (OPEN QUESTION RESOLVED)

**Does `hauska-mcp-server` already proxy engine-api `/v1/*` endpoints?**

**No.** Verified against production gate clone `P:\tmp\hauska-mcp-server-recon` (HEAD `392884c`):

| Client module | Target | Endpoints |
|---|---|---|
| `hauska-client.ts` | `HAUSKA_BACKEND_URL` → **retrieval-api** | `GET /search`, `/atoms/:did`, `/jurisdictions` |
| `legacy-client.ts` | cortex-api | `POST /api/submissions/:id/findings/generate`, `POST /api/engagements/:id/briefing/generate`, brokerage `/api/brokerage/v1/*` |
| (none) | engine-api `/v1/*` | **Absent** |

`HAUSKA_ENGINE_API_KEY` exists for retrieval-api bearer auth, not reasoning proxy.

### C1 cut pattern (this repo)

cortex-api calls spine `engine-api` **directly** using the gate-front seam contract (`X-Hauska-*` headers + `Authorization: Bearer <ENGINE_API_GATE_TOKEN>`). cortex-api constructs gate-front context from:

- Inbound `req.serviceAuth.jurisdictionTenant` (MCP gate service calls)
- Engagement-resolved `jurisdictionTenant` (browser session path)
- Fixed product=`cortex`, package per engine surface

This matches Topology A (PR #71 recon): calibration overlay I/O on cortex Neon via `CalibrationRepositoryPort` wired on engine-api deploy (`DATABASE_URL` → cortex Neon).

### cc-agent-M companion (FLAGGED)

New gate routes required for **external MCP agents** to reach reasoning without cortex-api BFF hop:

1. Proxy `POST /v1/briefing/generate`, `/v1/findings/*`, `/v1/hydrology/*`, `/v1/site-context/*` through gate with gate-front header injection
2. Point `HAUSKA_ENGINE_API_URL` (new) at engine-api Cloud Run (distinct from retrieval-api `HAUSKA_BACKEND_URL`)
3. S2: `resolve_precedence` gate tool (separate fast-follow dispatch)

**Not built from this repo** per dispatch scope.

## Per-engine feature flags (planned)

| Flag | Default | Engine |
|---|---|---|
| `ENGINE_SPINE_BRIEFING` | `0` | Briefing |
| `ENGINE_SPINE_FINDINGS` | `0` | Findings single-pass |
| `ENGINE_SPINE_FINDINGS_ORCHESTRATED` | `0` | Orchestrated findings |
| `ENGINE_SPINE_HYDROLOGY` | `0` | Site drainage DEM/rainfall |
| `ENGINE_SPINE_TOPOGRAPHY` | `0` | Site topography derivation |

Env: `ENGINE_API_URL`, `ENGINE_API_GATE_TOKEN` (shared secret with engine-api).

Local engines stay in place behind flags (reversible).

## S1 precedence — production wire point

**File:** `lib/finding-engine/src/engine.ts` → `finalizeDrafts()`

**Gap:** No import/call to `reconcileRequirementsByTopic` or `formatPrecedenceFindingText`.

**Wire plan:** After LLM drafts, before `finalizeDrafts` projection:

1. Group `input.codeSections` by accessibility topic+dimension (start accessibility domain only)
2. Build `ApplicableRequirement[]` via `codeSectionToRequirementShell`
3. Call `reconcileRequirementsByTopic` when ≥2 standards on same topic+dimension
4. Emit governing finding via `formatPrecedenceFindingText` with **all** compared `citations[].atomId`
5. Skip LLM draft for reconciled topics; scope claim to federal + model + local amendments only

## Provenance envelope shape (architect-facing)

```typescript
{
  lineage: { atomIds: string[] };           // cited atom-id[s]
  sources: Array<{
    atomId: string;
    deeplink: string;
    edition: string;
    retrievedAt: string;
    verificationState: "verified" | "unverified-web-source";
  }>;
  reasoning: {
    rule?: string;                          // precedence rule when applicable
    precedenceChain?: string[];             // reconciliation steps
    projectFacts?: Record<string, unknown>;
  };
  confidence: number;
  evaluatedAt: string;                      // ISO-8601
  edition: string | null;
  // calibration GRADE intentionally absent (rail-quiet I7)
}
```

## Calibration port (Topology A)

- Overlay table: cortex Neon `atom_calibration_overlay` (migration 0037)
- Spine: `CalibrationRepositoryPort` in `hauska-engine/packages/engine-core` (#71)
- C1: engine-api deploy binds port to cortex `DATABASE_URL`; cortex-api removes direct overlay compute when findings flag on
- Arrow-two deposit loop: gate-independent server-side; verify post-cut via existing `findingsCalibrationOverlay.ts` health route

## Blockers

| Blocker | Severity | Owner |
|---|---|---|
| engine-api not deployed to prod with `DATABASE_URL` → cortex Neon | Deploy | Operator / cc-agent-E |
| Gate lacks `/v1/*` proxy for external agents | Fast-follow | cc-agent-M |
| Briefing route lacks `requireGateEngineServiceAuth` | C1 fix | cc-agent-C (this cut) |

## Cut progress (branch `cortex/cut-to-gate`)

| Item | Status |
|---|---|
| `engineSpineClient.ts` + `engineSpineFlags.ts` | **Landed** — gate-front HTTP client + per-engine flags |
| `engineSpineRouting.ts` | **Landed** — findings + orchestrated + briefing routing helpers |
| Findings route spine cut | **Landed** — `routeGenerateFindings` / `routeGenerateOrchestratedFindings` behind flags |
| S1 precedence production wire | **Landed** — `productionWire.ts` + `engine.ts` merge before finalize |
| Provenance envelope helper | **Landed** — `provenanceEnvelope.ts` (not yet wired to API responses) |
| Briefing route spine cut | **Pending** — helper exists; `parcelBriefings.ts` not yet switched |
| Hydrology / topography spine cut | **Pending** |
| Briefing `requireGateEngineServiceAuth` | **Pending** |
| Calibration port Topology A verify | **Pending** — engine-api deploy binding (operator) |

### Feature flag defaults (all off)

```
ENGINE_SPINE_BRIEFING=0
ENGINE_SPINE_FINDINGS=0
ENGINE_SPINE_FINDINGS_ORCHESTRATED=0
ENGINE_SPINE_HYDROLOGY=0
ENGINE_SPINE_TOPOGRAPHY=0
ENGINE_API_URL=          # required when any flag on
ENGINE_API_GATE_TOKEN=   # shared secret with engine-api
```

## S1 integration test — verbatim output

```
pnpm --filter @workspace/finding-engine test -- --run src/__tests__/precedenceProductionWire.test.ts

 ✓ src/__tests__/precedenceProductionWire.test.ts (2 tests) 4ms
 Test Files  1 passed (1)
      Tests  2 passed (2)
```

Full finding-engine suite: **86 passed** (12 files).

## Typecheck

```
pnpm run typecheck → exit 0
```

## PR / SHA

*Pending push — work on `cortex/cut-to-gate` at `b1575ef` base, uncommitted.*
