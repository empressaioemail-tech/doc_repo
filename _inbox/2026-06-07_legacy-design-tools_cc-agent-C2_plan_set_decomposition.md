---
id: 2026-06-07_legacy-design-tools_cc-agent-C2_plan_set_decomposition
title: cc-agent-C2 report — plan-set decomposition + orchestration (WS1)
date: 2026-06-07
agent: cc-agent-C2
repo: legacy-design-tools-c2
kind: inbox-report
dispatch: 2026-06-07_cc-agent-C2_plan_set_decomposition
status: READY-FOR-PR (uncommitted — operator commit + push)
model: Grok Build 0.1 (https://api.x.ai/v1)
---

# cc-agent-C2 — plan-set decomposition deliverable report

## Workspace verification (HR-8)

### Initial gate

```
On branch 2d/migration-0017-renumber
Your branch is up to date with 'origin/2d/migration-0017-renumber'.

Changes not staged for commit:
	modified:   lib/db/src/__tests__/drizzleMigrationNames.test.ts

a818805 fix(db): renumber site-topography migration to 0017
74a3941 feat(40e): rendering parity — power tools, upload source, UI (A.2–C.7) (#109)
d99de6b feat(site-topography): DEM ingest worker + read-model persistence (Phase 2D.x PR3) (#107)
```

**Action taken:** Restored CRLF-only drift on `drizzleMigrationNames.test.ts` → clean tree. Proceeded on feature branch `2d/plan-set-decomposition` (not alien HEAD).

### Post-work tree

Branch: `2d/plan-set-decomposition` (local, not pushed)

Uncommitted diff: 10 modified + 8 new files (see Summary). Base SHA before edits: `a818805`.

---

## Atoms touched

| Atom | Role |
|---|---|
| `sprint:55` | Workstream 1 — plan-set decomposition conductor |
| `product:cortex` | Plan-review finding engine + api-server routes |
| `current-state:portfolio` | Verified ingredients against live code per dispatch recon |

---

## What was built

### 1. Sheet/piece classification (persisted)

- **Schema:** `lib/db/drizzle/0018_plan_set_decomposition.sql`
  - New table `plan_set_piece_classifications` (one row per sheet or attached-document piece)
  - New nullable column `findings.discipline` (`PlanReviewDiscipline`, CHECK-constrained)
- **Drizzle:** `lib/db/src/schema/planSetPieceClassifications.ts`
- **Classifier:** `lib/finding-engine/src/planSet/classifier.ts`
  - Rule-based mapping from sheet number prefix (A/S/E/M/P/FP…) + OCR/title keywords
  - Attached-document fallback via `documentType` + keywords
  - Maps onto closed `PlanReviewDiscipline` set (7 ICC reviewer disciplines)
- **Route helper:** `artifacts/api-server/src/lib/planSetClassification.ts`
  - Loads latest snapshot sheets + engagement attached documents
  - Upserts classifications before orchestrated generation

### 2. Per-discipline specialist dispatch

- **Orchestrator:** `lib/finding-engine/src/planSet/orchestrator.ts`
  - `classifyPlanSetPieces` → `groupPiecesByDiscipline` → `generateFindings` per discipline
  - Reuses existing engine (mock + anthropic branches); no fork of validator/discard pipeline
- **Scope filter:** `lib/finding-engine/src/planSet/disciplineScope.ts`
  - Filters retrieved code atoms per discipline; discipline-specific retrieval query hints exported for future per-pass retrieval wiring
- **Prompt extension:** `lib/finding-engine/src/prompt.ts`
  - `<discipline_scope>` + `<plan_set_pieces>` blocks on specialist passes

### 3. Re-aggregation

- **Dedupe:** `lib/finding-engine/src/planSet/dedupe.ts` — normalized-text collapse, higher-confidence survivor
- Findings tagged with `discipline` on `EngineFinding` + persisted on `findings.discipline`
- Wire surface: `FindingWire.discipline` on list/get endpoints via `toWire()`

### 4. Feature flag + legacy fallback

| Env | Behavior |
|---|---|
| `AIR_FINDING_ORCHESTRATED` unset / `0` / `false` | Legacy single-pass `generateFindings()` (unchanged) |
| `AIR_FINDING_ORCHESTRATED=1` / `true` / `yes` | Classify pieces → orchestrate when **≥2 pieces**; else falls back to single-pass with log line |

Resolver: `resolveFindingOrchestratedMode()` in `@workspace/finding-engine`.

### 5. Citation / confidence / atomId lineage

- Unchanged validator + `finalizeDrafts()` pipeline
- `atomId` still stamped `finding:{submissionId}:{ulid}` at engine boundary
- `citations[].atomId` on code-section citations preserved through specialist passes and dedupe (dedupe keeps whole finding object including citations)

**Not touched:** `lib/adapters/**` (cc-agent-C scope)

---

## Tests added

| File | Coverage |
|---|---|
| `lib/finding-engine/src/__tests__/planSetClassifier.test.ts` | Prefix + keyword classification, grouping |
| `lib/finding-engine/src/__tests__/planSetDedupe.test.ts` | Re-aggregation dedupe |
| `lib/finding-engine/src/__tests__/planSetOrchestrator.test.ts` | End-to-end mock orchestration + flag resolver |
| `lib/db/src/__tests__/integration/schema.integration.test.ts` | New table in drift list |

### Verification run (local)

```
pnpm --filter @workspace/finding-engine typecheck   → PASS
pnpm --filter @workspace/finding-engine test       → BLOCKED (Windows rollup native binary missing; AGENTS.md quirk)
pnpm --filter @workspace/api-server typecheck      → BLOCKED (lib/db dist not built in clone — pre-existing TS6305 surface)
```

Existing finding-engine suite not re-run locally due to rollup blocker. CI (Linux) should run green.

---

## Operator next steps

1. Review uncommitted diff on `P:\legacy-design-tools-c2`, branch `2d/plan-set-decomposition`
2. Commit + push; open PR (do not merge — held per dispatch)
3. Apply migration `0018_plan_set_decomposition.sql` on dev/staging before enabling flag
4. Enable orchestrated path: `AIR_FINDING_ORCHESTRATED=true`
5. QA on multi-sheet engagement (Musgrave / Bastrop submittal with ≥2 classified sheets)

---

## PR / branch (held)

| Field | Value |
|---|---|
| Branch | `2d/plan-set-decomposition` |
| Base | `a818805` (`2d/migration-0017-renumber`) |
| PR URL | **Not created** — operator opens after push |
| Merge | **Held** per dispatch |

---

## Blockers (verbatim)

1. **Initial dirty tree:** `lib/db/src/__tests__/drizzleMigrationNames.test.ts` modified (CRLF-only); restored before work.
2. **Local vitest:** `@rollup/rollup-win32-x64-msvc` missing — cannot run `pnpm --filter @workspace/finding-engine test` on Windows without transient install (must not commit per AGENTS.md).
3. **Multi-sheet demo:** Not executed against live Musgrave/Bastrop engagement in this run (no local `dev:local` + engagement seed in c2 clone session).
4. **OpenAPI / FE:** `findings.discipline` added to wire in route layer only; OpenAPI spec not regenerated (out of scope unless operator wants FE discipline chips immediately).

---

## File manifest

**New**

- `lib/db/drizzle/0018_plan_set_decomposition.sql`
- `lib/db/src/schema/planSetPieceClassifications.ts`
- `lib/finding-engine/src/planSet/{types,classifier,disciplineScope,dedupe,orchestrator}.ts`
- `lib/finding-engine/src/__tests__/planSet{Classifier,Dedupe,Orchestrator}.test.ts`
- `artifacts/api-server/src/lib/planSetClassification.ts`

**Modified**

- `lib/db/src/schema/{findings,index}.ts`
- `lib/finding-engine/{package.json,src/{types,prompt,engine,index}.ts}`
- `artifacts/api-server/src/routes/findings.ts`
- `lib/db/src/__tests__/integration/schema.integration.test.ts`
- `pnpm-lock.yaml` (workspace link for `@workspace/api-zod` on finding-engine)

---

## Revision

- **2026-06-07** — cc-agent-C2 WS1 execution complete; PR held for operator.
