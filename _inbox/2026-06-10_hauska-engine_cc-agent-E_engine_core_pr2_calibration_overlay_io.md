---
id: 2026-06-10_hauska-engine_cc-agent-E_engine_core_pr2_calibration_overlay_io
title: Session — engine-core PR2 calibration overlay I/O + site-topo derivation
date: 2026-06-10
agent: cc-agent-E
repo: hauska-engine
model: Grok Build 0.1 (Cursor base URL https://api.x.ai/v1)
dispatch: 2026-06-10_cc-agent-E_engine_core_pr2_calibration_overlay_io
status: complete — PR #71 held for operator merge
---

# Engine-core PR2 — calibration overlay I/O + site-topography derivation

## Model

**Grok Build 0.1** (`https://api.x.ai/v1`). No Claude escalation.

## Workspace hygiene

Primary clone `P:\hauska-engine` refused (dirty on orphaned `chore/retrieval-api-healthz`; PR #68 merged — dirt ignored).

Work executed in:

```
P:\hauska-engine-worktrees\engine-core-pr2-calibration
branch: engine/core-pr2-calibration-overlay-io (from origin/main @ 53d1743)
```

### Primary clone — verbatim `git status` + `git log -3`

```
On branch chore/retrieval-api-healthz
Your branch is based on 'origin/chore/retrieval-api-healthz', but the upstream is gone.

Changes not staged for commit:
	modified:   services/retrieval-api/DEPLOY.md
	modified:   tools/migrate-legacy-codes/src/index.ts

c175d6f fix(retrieval-api): expose /healthz/ for Cloud Run GFE reserved path
9b6e3f6 feat(retrieval-api): add /healthz with corpus count and substrate Neon probe
88e51d9 feat(engine): scaffold engine-api home (ADR-008 step 1) (#67)
```

## Recon — overlay store topology

### Where `atom_calibration_overlay` lives today

| Artifact | Location | Evidence |
|---|---|---|
| Migration `0037_atom_calibration_overlay.sql` | `legacy-design-tools/lib/db/drizzle/` | PK `(atom_id, jurisdiction_tenant)` |
| Drizzle schema | `legacy-design-tools/lib/db/src/schema/atomCalibrationOverlay.ts` | `PUBLIC_CALIBRATION_TENANT = "__public__"` |
| Phase-3 overlay I/O (pre-lift) | `legacy-design-tools/lib/engine-core/src/overlay.ts` | Direct `@workspace/db` reads/writes |
| Adjudication signal sources | Same cortex Neon: `atom_events`, `findings`, `submissions`, `engagements`, `reasoning_atoms`, `code_atoms` | `signals.ts` joins |
| Cortex route consumer | `legacy-design-tools/artifacts/api-server/src/routes/findingsCalibrationOverlay.ts` | Internal cortex route |

The table is on the **cortex / legacy-design-tools deployment Neon**, not the spine retrieval substrate.

### What DB access the spine has

| Service | DB binding | Overlay tables? |
|---|---|---|
| `retrieval-api` | `SUBSTRATE_DATABASE_URL` / `DATABASE_URL` — substrate Neon probe (#68) | **No** — `packages/storage/src/schema.ts` has atoms/links/embeddings/ingest_jobs only; no `atom_calibration_overlay` |
| `engine-api` | **None** — no DATABASE_URL binding in service code | N/A |

Spine substrate Neon (when wired) is the rebuilt-immutable corpus index per ADR-010. Calibration overlay + adjudication ledger remain cortex-side today.

### Candidate topologies

**A — Spine reaches cortex Neon via repository port (RECOMMENDED)**

- Overlay stays one table, one store on cortex Neon.
- `CalibrationRepositoryPort` in `packages/engine-core` abstracts all overlay/signal/attribution I/O.
- `engine-api` (or cortex BFF during C1 transition) wires the port to cortex `DATABASE_URL`.
- Arrow-two deposit loop preserved: adjudication capture stays cortex-side; compute moves to spine; same Neon rows.
- C1 cut unchanged: cc-agent-C removes cortex `lib/engine-core` overlay code and calls spine `engine-api` through the gate; cortex-api keeps DB credentials for the port adapter until ledger migration (if ever) is a separate decision.

**B — Overlay moves to spine/retrieval store**

- Requires migration 0037 + ledger tables to substrate Neon or a new spine DB.
- cortex-api would reach overlay through the gate — cross-service read/write on every calibration resolve.
- Breaks the gate-independent server-side ledger join arrow-two relies on during C1.
- Would change C1 cut scope and operator topology; **not recommended for this PR**.

### Recommendation

**Topology A.** Evidence is unambiguous: overlay table, adjudication ledger, and `reasoning_atoms` all co-locate on cortex Neon; spine retrieval substrate is a different schema without overlay cargo. Building proceeded on A.

## PR

- **URL:** https://github.com/empressaioemail-tech/hauska-engine/pull/71
- **Branch:** `engine/core-pr2-calibration-overlay-io`
- **SHA:** `504cb468c033ecf4927e638e3c518ada4e019331` (CI green)
- **Merge:** held for operator

## Lift summary

| Cargo | Target | Notes |
|---|---|---|
| `overlay.ts` | `packages/engine-core/src/calibration/overlay.ts` | Port-injected `CalibrationRepositoryPort` |
| `signals.ts` | `packages/engine-core/src/calibration/signals.ts` | Adjudication + outcome signal collection |
| `attribution.ts` | `packages/engine-core/src/calibration/attribution.ts` | Coverage health |
| `overlayAtomKey.ts` | `packages/engine-core/src/calibration/overlayAtomKey.ts` | Lifted from `@workspace/codes` |
| Repository ports | `ports.ts` + `inMemoryPorts.ts` | Topology A seam; drizzle adapter lands at wire time (C1) |
| Site-topo derivation | `packages/engine-core/src/site-topography/derivation.ts` | `parseDemBytes`, `deriveContoursGeoJson` pure compute |
| Rail-quiet | `services/engine-api/src/__tests__/rail-quiet.test.ts` | No `calibrationGrade` on `/v1/findings/generate` |

Contour ingest orchestration (`siteTopographyIngest.ts` DB/GCS/atom events) **not** lifted — stays cortex BFF.

## HR-8 verification artifacts

### Phase-3 no-pool fixtures — verbatim

```
pnpm --filter @hauska-engine/engine-core test -- src/calibration/__tests__/calibration-overlay.test.ts

 RUN  v2.1.9 P:/hauska-engine-worktrees/engine-core-pr2-calibration/packages/engine-core

 ✓ src/calibration/__tests__/calibration-overlay.test.ts (8 tests) 5ms

 Test Files  1 passed (1)
      Tests  8 passed (8)
```

Fixture coverage:

- structured-ref overlay resolution
- overlay covers reasoning + corpus atoms (no corpus mutation)
- cold-start fallback (asserted, never zero)
- **tenant sovereignty — two-tenant no leakage**
- **tenant-shared no-pool into public**
- source-set drift invalidation (all three stamp fields)
- recompute from adjudication lineage
- attribution coverage

### Full workspace

```
pnpm --filter @hauska-engine/engine-core test
 Test Files  24 passed (24)
      Tests  158 passed (158)

pnpm typecheck → exit 0
pnpm test       → exit 0 (workspace)
```

### Rail-quiet confirmation

`engine-api` has no calibration routes or response fields. New test asserts `/v1/findings/generate` response body contains no `calibrationGrade`, `calibration_grade`, or `effectiveConfidence`. Calibration overlay exports are engine-core library surface only — not mounted on buyer-facing engine-api routes in this PR.

## Blockers

**None** for PR #71 merge (CI green).

**Follow-on (C1 / cc-agent-C):**

- Wire `CalibrationRepositoryPort` drizzle adapter in `engine-api` with cortex `DATABASE_URL` at deploy.
- Cortex-api consumer cutover to gate + engine-api seam (paired C1 dispatch).

## Next

- Operator merge PR #71 after CI green
- cc-agent-C: cortex-api cut removes duplicated overlay code; calls spine through gate
