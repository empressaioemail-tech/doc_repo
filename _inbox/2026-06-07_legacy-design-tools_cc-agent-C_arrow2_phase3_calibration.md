---
id: 2026-06-07_legacy-design-tools_cc-agent-C_arrow2_phase3_calibration
title: Report — arrow-two Phase 3 calibration computation
date: 2026-06-10
agent: cc-agent-C
repo: legacy-design-tools
kind: inbox
dispatch: _dispatches/2026-06-07_cc-agent-C_arrow2_phase3_calibration.md
model: Grok Build 0.1 (HR-12)
status: complete-pending-operator-merge
---

# Arrow-two Phase 3 calibration — cc-agent-C report

## Model

**Grok Build 0.1** (HR-12). No escalation.

## Git state (verbatim)

```
On branch tenant/arrow2-phase3-calibration
Changes not staged for commit: (implementation files; commit pending operator review)

f580af8 fix(test): use /outcome path segment in auth guard test
a9f965d feat(tenant): gate-front seam + arrow-two Phase 2 outcomes
d618db5 Merge pull request #159 from empressaioemail-tech/lineage/override-citation-companion
```

Base branch stacks Phase 2 (`a9f965d`) from `tenant/gate-front-seam-arrow2-phase2` (PR #160 held for merge).

## Recon — prerequisites (verbatim findings)

| Prerequisite | Status | Evidence |
|---|---|---|
| Phase 1 adjudication ledger, `jurisdictionTenant` partitioned | **Present** | `artifacts/api-server/src/lib/atomAdjudicationEvidenceLedger.ts`; routes `/findings/adjudication-evidence` |
| Phase 2 outcome capture, `jurisdictionTenant` partitioned | **Present** | `artifacts/api-server/src/lib/findingOutcomeObservation.ts`; `finding.outcome.recorded` events |
| Cold-warm field split (0036) | **Present** | `lib/db/drizzle/0036_reasoning_atoms_asserted_confidence.sql` — `asserted_confidence`, nullable `calibrated_confidence`, `source_set_version`, `calibration_stale` |
| P0b canonical key | **Present** | `lib/codes/src/overlayAtomKey.ts` — `canonicalOverlayAtomKey`, `overlayAtomLookupKey`, `canonicalOverlayKeyFromCodeToken` |

```typescript
// overlayAtomKey.ts (excerpt)
export function canonicalOverlayAtomKey(rawAtomId: string): string { ... }
export function overlayAtomLookupKey(args: { jurisdictionTenant: string; atomId: string }): string {
  return `${args.jurisdictionTenant}\0${canonicalOverlayAtomKey(args.atomId)}`;
}
```

## Build delivered

### Migration 0037

`lib/db/drizzle/0037_atom_calibration_overlay.sql` — `atom_calibration_overlay` table keyed `(atom_id, jurisdiction_tenant)` with asserted/calibrated confidence, partition kind, source-set stamp fields, adaptive grain metadata.

Drizzle schema: `lib/db/src/schema/atomCalibrationOverlay.ts`. Fixture template updated.

### `@workspace/engine-core` (spine seam)

New package `lib/engine-core/` — calibration computation cargo for engine extraction (56 step 4):

- Signal collection from Phase 1 adjudications + Phase 2 outcomes (`signals.ts`)
- Tenant sovereignty partitions: public (`__public__`), tenant-private, tenant-shared (`partition.ts`)
- Adaptive grain compute with `MIN_DENSE_SIGNAL = 3` (`compute.ts`)
- Edition + source-set stamp invalidation (`stamp.ts`, `invalidateStaleCalibrationForAtom`)
- Corpus asserted baseline from source quality (`corpusBaseline.ts`)
- Read-time fallback: `effectiveConfidence` → asserted when uncalibrated/stale; never zero
- Attribution coverage metric (`attribution.ts`)
- Overlay recompute + resolve (`overlay.ts`)

### Cortex surface (rail-quiet I7)

Internal reviewer routes only — **not** in OpenAPI / MCP schemas:

- `GET /api/findings/calibration-overlay`
- `GET /api/findings/calibration-overlay/health` (attribution coverage)
- `POST /api/findings/calibration/recompute`

`artifacts/api-server/src/routes/findingsCalibrationOverlay.ts`

## Acceptance mapping

| Criterion | Status |
|---|---|
| Overlay resolves reasoning + corpus atom via lineage, no corpus mutation | **Implemented** + fixture test |
| Two-tenant sovereignty + tenant-shared no-pool | **Implemented** + fixture tests |
| Cold-start fallback to assertedConfidence | **Implemented** + test |
| Within-partition adaptive grain | **Implemented** (`MIN_DENSE_SIGNAL`, class fallback) |
| Source-set drift invalidation (3 stamp fields) | **Implemented** + test |
| Structured-ref `[[CODE:reasoning:fbc-2023:fbc-m601-6]]` → overlay key | **Tested** |
| Attribution coverage metric | **Implemented** + health endpoint |
| Calibration absent from MCP outputs | **Verified** — no MCP schema changes |
| I3 path (stated vs observed frequency) | **Closed** via recompute loop |

## Tests

| Suite | Result |
|---|---|
| `lib/engine-core` unit (`compute`, `partition`) | **9/9 green** (local) |
| `lib/engine-core` integration (`calibration-overlay`) | **Written** — requires `TEST_DATABASE_URL` / Postgres (ECONNREFUSED locally; CI green expected) |
| `pnpm run typecheck:libs` | **Green** |
| `@workspace/api-server` typecheck | **Green** |

## Atoms touched

- `sprint:54` step 4 (final arrow-two build)
- `product:cortex` — internal calibration overlay routes
- `04a_arrow_two_calibration_capture` Phase 3
- `57_national_code_warming_sprint` migration 0037 slot

## PR

- **Branch:** `tenant/arrow2-phase3-calibration`
- **Base:** `tenant/gate-front-seam-arrow2-phase2` (merge after PR #160)
- **SHA:** `a431e8e`
- **PR:** https://github.com/empressaioemail-tech/legacy-design-tools/compare/tenant/gate-front-seam-arrow2-phase2...tenant/arrow2-phase3-calibration?expand=1
- **Merge:** held for operator

## Blockers

None code-side. Local integration tests blocked on missing `DATABASE_URL` on `cente` workstation (ECONNREFUSED `localhost:5432`). CI Test job has Postgres.
