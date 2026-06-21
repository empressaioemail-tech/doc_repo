# Close — Wave 1 read-contract type (cc-agent-AC)

Date: 2026-06-21  
Repo: `hauska-atom-contract`  
Agent: cc-agent-AC  
Tasks: **F0** (verify-first, contract slice), **F4** (read-contract type), **F6** (three-axis contract), **K6** (calibration provenance on widthed confidence)

## Outcome

Landed the Calibrated Spine read-contract substrate as a new `@hauska/atom-contract/read-contract` subpath at **v1.4.0** (local; not yet published to npm). Contract-only: TypeScript interfaces, Zod schemas, branded constructors, fixtures, and type-level tests. No derived numbers stored. Main barrel unchanged — existing v1.3.0 consumers unaffected until they opt in.

---

## F0 verify-first findings

### Published contract version

| Source | Version | Verified |
|---|---|---|
| npm registry (`npm view @hauska/atom-contract version`) | **1.3.0** | 2026-06-21 |
| Local `package.json` (pre-bump) | 1.3.0 | matches npm |
| Local `package.json` (post-Wave 1) | **1.4.0** | unpublished |

Latest published release is **1.3.0** (2026-05-28 workspace packaging). No read-contract or confidence types existed in any published atom-contract version.

### Confidence / provenance field shapes in atom-contract (live tree)

| Location | Shape | F4-aligned? |
|---|---|---|
| Main barrel (`src/index.ts`) | No confidence types | N/A — greenfield |
| `./encumbrances` `QUALITY_GATE_FIELDS` | `confidence: number` (0–1 scalar) | **No** — legacy scalar |
| `./workspace` `BriefRun` | `confidence: number` (0–1 scalar) | **No** — legacy scalar |
| `HistoryProvenance` (main barrel) | Event ledger provenance (`latestEventId`, `latestEventAt`) | Unrelated — not calibration provenance |

### Cross-repo confidence shape (F0 corroboration)

cc-agent-C Wave 1 close ([`2026-06-21_legacy-design-tools_cc-agent-C_wave1-verify-and-read-apis.md`](2026-06-21_legacy-design-tools_cc-agent-C_wave1-verify-and-read-apis.md)) independently confirmed:

- **EngineEnvelope** (`@workspace/engine-core`): `{ value: number; kind: "calibrated" \| "asserted" \| "deterministic" }` — scalar + kind, no `n`, no `intervalWidth`, no calibration provenance object.
- **`atom_calibration_overlay`** (LDT DB): separate `assertedConfidence` / `calibratedConfidence` numerics — not folded into envelope on consumer surfaces.
- **F6 partial**: split exists at DB layer; no three-axis contract; no severity axis on wire.

**F0 verdict (contract repo):** Gap analysis F4 hypothesis **confirmed** for emission surfaces. atom-contract itself had **no** canonical confidence type before this close — scalars were scattered in encumbrance/workspace subpaths and in engine-core `EngineEnvelope`.

---

## New type definitions (v1.4.0)

Import path: `@hauska/atom-contract/read-contract`

### Calibration provenance (K6)

```typescript
type CalibrationProvenance = "asserted" | "backtest" | "seed" | "live";
```

Rides on each `WidthedConfidence`. Base calibration (`backtest`, `seed`) is structurally distinct from `live`-earned.

### Widthed confidence (F4 core)

```typescript
type WidthedPointEstimate = number & { readonly [WidthedPointEstimateBrand]: true };

interface WidthedConfidence {
  readonly estimate: WidthedPointEstimate;
  readonly n: number;
  readonly intervalWidth: number;
  readonly provenance: CalibrationProvenance;
}
```

Constructed only via `createWidthedConfidence()`. Zod schema `WIDTHED_CONFIDENCE_SCHEMA` rejects partial objects and bare numbers at runtime.

### Three-axis contract (F6)

```typescript
interface ThreeAxisConfidence {
  readonly calibratedConfidence: WidthedConfidence;  // accuracy, earned
  readonly assertedConfidence: WidthedConfidence;      // source-quality, asserted
  readonly consequence: ConsequenceAxis;             // severity, asserted-audited
}

interface ConsequenceAxis {
  readonly derivation: {
    source: "asce7-risk-category" | "ibc-occupancy-importance" | "derived-composite";
    asce7RiskCategory: "I" | "II" | "III" | "IV";
    ibcOccupancyGroup?: string;
    ibcImportanceFactor?: number;
    jurisdictionCode?: string;
  };
  readonly stratum: "routine" | "elevated" | "critical" | "essential";
  readonly assertedAt: string;
  readonly auditRef?: string;
}
```

No invented severity scalar — discrete stratum + classification inputs only.

### Read-contract object (F4)

```typescript
interface ReadContract {
  readonly axes: ThreeAxisConfidence;
  readonly assembledAt: string;
  readonly modelAttribution?: ModelAttributionStamp;
}
```

### Model-attribution stamp (F3 ledger shape; not stored derived numbers)

```typescript
interface ModelAttributionStamp {
  readonly modelId: string;
  readonly modelVersion: string;
  readonly promptTemplateVersion: string;
  readonly contextTemplateVersion: string;
  readonly samplingParams: SamplingParams;
  readonly retrievedAtomSetId: string;
}
```

Agreement, posterior, and per-model reliability are **not** in this package — derived at read from ledger joins.

### Migration reference only

```typescript
interface LegacyEngineEnvelopeConfidence {
  readonly value: number;
  readonly kind: "calibrated" | "asserted" | "deterministic";
}
```

Documented for consumer migration; not a valid emission shape once F4 propagation lands.

### Files added

- `src/read-contract/common.ts` — provenance, branded estimate, widthed confidence
- `src/read-contract/consequence.ts` — severity axis
- `src/read-contract/model-attribution.ts` — ledger stamp
- `src/read-contract/read-contract.ts` — `ThreeAxisConfidence`, `ReadContract`
- `src/read-contract/fixtures.ts` — `SAMPLE_READ_CONTRACT`
- `src/read-contract/__tests__/read-contract.test.ts` — 13 tests (Zod + `@ts-expect-error`)

---

## No-scalar-accessor guarantee — how enforced

1. **No exported scalar type.** There is no `ConfidenceScalar`, `confidence: number`, or top-level `value` on `ReadContract`. The only numeric estimate is `WidthedPointEstimate`, a branded nominal not assignable from bare `number` (compile-time `@ts-expect-error` tests in `read-contract.test.ts`).

2. **Inseparable object.** `WidthedConfidence` requires `estimate`, `n`, `intervalWidth`, and `provenance` together. Zod rejects `{ estimate: 0.87 }`, bare `0.87`, and objects missing any field. Type-level test rejects `{ estimate }` without siblings.

3. **Constructor gate.** `createWidthedConfidence()` is the sole public constructor; it brands the estimate after schema validation.

4. **ReadContract has no `.confidence`.** Type error + runtime `undefined` on `contract.confidence` (tested).

5. **Display helper is not a scalar accessor.** `asWidthedConfidenceRecord()` returns the full frozen widthed object, not a lone number.

**Limitation (explicit):** TypeScript cannot prevent a consumer from reading `axes.calibratedConfidence.estimate` and using it alone at runtime. The contract makes dishonest emission a **type error** at API boundaries; discipline at render sites is Wave 2 propagation + lint rules in consumers. Runtime JSON from untyped endpoints can still carry legacy scalars until cortex-api migrates.

---

## Contradictions / updates to `03_gap_analysis.md`

| Gap row | Hypothesis | Reality after F0 + this close | Action |
|---|---|---|---|
| **F4** | "Confidence is a scalar; EngineEnvelope carries confidence plus kind" | **Confirmed** on engine-core / extension / map. atom-contract had **no** F4 type until this close. | Gap stands for consumers; **resolved for contract substrate** |
| **F4** | "Wide refactor across 46 MCP tools…" | Type now exists; refactor **not started** in consumers | Wave 2 |
| **F6** | "assertedConfidence and calibratedConfidence split exists (0036/0037); severity axis absent" | **Confirmed** at LDT DB overlay layer. Severity axis **type now exists** in atom-contract; atom metadata (F2) still absent on corpus | Update F6: type **PARTIAL→type landed**, instance population still GAP |
| **F6** | "depends F2" for severity | Consequence **type** shipped; **values** require F2 enrichment on code-section atoms | F2 still blocks honest consequence *instances*, not the contract |
| **F3** | "PARTIAL" ledger | Unchanged; `ModelAttributionStamp` shape now defined here for ledger consumers to adopt | cc-agent-C Wave 2 |
| **Within atom-contract** | *(not in gap analysis)* | `./encumbrances` and `./brief-run` still expose scalar `confidence: number` | **New gap** — migrate in Wave 2 or mark deprecated |

No contradiction on published version (1.3.0) or EngineEnvelope shape. Main correction: gap analysis implied F4 lived in atom-contract; it did not — it lived in engine-core and product surfaces. This close establishes atom-contract as the **canonical** F4/F6/K6 source of truth.

---

## Validation run

```
npm run lint       ✅
npm run typecheck  ✅
npm test           ✅ (90 tests, +13 read-contract)
npm run build      ✅
```

---

## Published version / release status

- Package version: **1.4.0** (local bump; `CHANGELOG.md` updated)
- npm: still **1.3.0** — publish required before consumer co-bump
- Git: changes uncommitted in workspace (planner or operator to commit/tag/publish)

**Operator publish:**

```bash
cd P:/hauska-atom-contract
npm login   # if needed
npm publish
git tag v1.4.0 && git push origin v1.4.0
```

---

## Proposed Wave 2 task list + co-bump coordination

All tasks assume `@hauska/atom-contract@^1.4.0` published first.

| Order | Task | Owner | Depends | Co-bump with |
|---|---|---|---|---|
| W2-0 | **Publish** `@hauska/atom-contract@1.4.0` to npm | operator / cc-agent-AC | this close merged | — |
| W2-1 | **engine-core** — replace `EngineEnvelopeConfidence` with nested `ReadContract` or `ThreeAxisConfidence`; deprecate `{ value, kind }` | cc-agent-E | W2-0 | W2-2, W2-3 |
| W2-2 | **cortex-api / LDT** — OpenAPI `EngineHonesty` → read-contract; map-data and briefing endpoints emit `ReadContract` | cc-agent-C | W2-1 | W2-3, W2-4, W2-5 |
| W2-3 | **MCP server** — 46 tool response schemas adopt `ReadContract` | cc-agent-M | W2-0 | W2-2 |
| W2-4 | **extension** — `gis-proxy-api.js` normalizer; width-as-saturation inputs; remove scalar fallback | extension agent | W2-2 | W2-5 |
| W2-5 | **map repo** — V4 EngineEnvelope read-contract consumption; V5 width/consequence layers | map agent | W2-2 | W2-4 |
| W2-6 | **Cortex UI** — render three axes + provenance badges; no bare confidence display | cc-agent-R | W2-2 | — |
| W2-7 | **R1** report-rendering contract — read-contract on every claim | cc-agent-R + map | W2-2, V1–V3 | — |
| W2-8 | **atom-contract legacy subpaths** — deprecate scalar `confidence` on `brief-run` and encumbrance quality gate; reference widthed shape or `ReadContract` | cc-agent-AC | W2-0 | W2-2 |
| W2-9 | **F3 ledger deposit** — stamp `ModelAttributionStamp` on writes | cc-agent-C | W2-0 | — |
| W2-10 | **F9** — wire raw-adjudication loop output through `ReadContract` (plan-review) | cc-agent-C | W2-2, F3 | — |

### Co-bump rule

Pin the same `@hauska/atom-contract@^1.4.0` (or exact patch) across **engine-core → cortex-api → MCP → extension → map → Cortex** in one coordinated release window. Partial migration reintroduces scalar honesty violations at JSON boundaries. Suggested sequence:

1. Publish atom-contract 1.4.0  
2. engine-core envelope type change + semver minor  
3. cortex-api + MCP (same sprint)  
4. extension + map (same sprint, can trail api by hours not weeks)  
5. Migrate atom-contract `./workspace` and `./encumbrances` scalars last or in same PR as cortex-api brief/encumbrance paths

### Blocked until Wave 2 (not this close)

- W1 warming harness honest cached confidence  
- V4/V5/V6 map layers  
- F9 present-tense violation close  
- K2 backtest deposits tagged with `provenance: "backtest"`

---

## Consumer migration (one-liner)

```typescript
import {
  createReadContract,
  createWidthedConfidence,
  READ_CONTRACT_SCHEMA,
  type ReadContract,
} from "@hauska/atom-contract/read-contract";
```

Replace `{ confidence: { value, kind } }` emissions with `ReadContract`. Use `createWidthedConfidence` — never assign a bare number to an estimate field.
