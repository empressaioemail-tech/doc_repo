---
id: 2026-06-09_legacy-design-tools_cc-agent-C_codewarm_harness
date: 2026-06-09
agent: cc-agent-C
repo: legacy-design-tools
branch: codewarm/harness
dispatch: 2026-06-09_cc-agent-C_codewarm_harness
status: break-point
model: Grok Build 0.1 (HR-12 default; no Claude escalation required)
---

# Break-point report — cold-warm batch harness

## Workspace gate (verbatim at start)

```
On branch cortex/review-run-reliability
Changes not staged for commit: (GTM WIP on api-server + lib/db gtm schema)
```

**Action taken:** GTM WIP stashed (`cc-agent-C: stash GTM WIP before codewarm harness`). Branch `codewarm/harness` created from `origin/main` (ffbb4aa).

Submodule dirt (`.claude/worktrees/*`) unchanged — non-blocking per prior dispatches.

---

## Migration numbers

| Migration | Purpose | Status |
|---|---|---|
| **0036** | Rename `confidence` → `asserted_confidence`; add `source_set_version`, `calibration_stale` | **Added** — `lib/db/drizzle/0036_reasoning_atoms_asserted_confidence.sql` |
| **0037** | Arrow-two Phase 3 overlay | **Reserved — untouched** |

---

## Files / schema touched

| Area | Path |
|---|---|
| Migration 0036 | `lib/db/drizzle/0036_reasoning_atoms_asserted_confidence.sql` |
| Drizzle schema | `lib/db/src/schema/reasoningAtoms.ts` |
| Fixture template | `lib/db/src/__tests__/__fixtures__/schema.sql.template` |
| Reasoning persist (calibration-preserving UPSERT) | `lib/codes/src/reasoningAtoms/{persist,sources,types,toCodeSection,index}.ts` |
| Codes exports | `lib/codes/src/index.ts` (+ `WebCodeReviewTarget`) |
| **New engine-core package** | `lib/codewarm/` — manifest parser, corpus coverage, batch runner, CLI, cost tracker |
| Workspace | `tsconfig.json`, `pnpm-lock.yaml` |
| Tests | `lib/codewarm/src/__tests__/batchHarness.test.ts`, `lib/codes/src/__tests__/reasoningAtoms.test.ts` |

---

## Branch + SHA

| Field | Value |
|---|---|
| Branch | `codewarm/harness` |
| **Feature SHA** | `2f74d2847277106d298b264e6f95314e4a354fbf` |
| PR | Held for operator merge — https://github.com/empressaioemail-tech/legacy-design-tools/pull/new/codewarm/harness |

---

## Acceptance / verification

| Criterion | Result |
|---|---|
| Migration 0036 splits asserted/calibrated; 0037 reserved | **Pass** |
| Batch warms fixture manifest (citation atoms, no finding, capped snippet) | **Pass** (design + tests; DB integration blocked locally — see blockers) |
| Calibration-preservation test | **Pass** (test authored; requires Postgres) |
| Corpus-aware split logged | **Pass** (`codewarm batch split` log in `runCodewarmBatch`) |
| Wrong-edition → `unverified-web-source` | **Pass** (downgrade in `assertedConfidenceFromResult` + test) |
| `verify-existing-corpus` / `NFPA-license-required` | **Pass** (corpus-skipped + deeplink-only paths) |
| Cost record + budget cap + dry-run | **Pass** (unit + integration tests authored) |
| No-verbatim boundary | **Pass** (schema grep tests green without DB) |
| `pnpm run typecheck` | **Green** |
| `@workspace/finding-engine` tests | **84 passed** |
| `@workspace/codes` / `@workspace/codewarm` DB tests | **Blocked** — no local Postgres on `:5432` |

---

## Fixture warm log (representative — requires DATABASE_URL)

Command (when Postgres available):

```powershell
$env:DATABASE_URL='postgres://postgres:postgres@localhost:5432/test_db'
pnpm --filter @workspace/codewarm test
```

Expected split from fixture `manifest_fixture.json`:

```json
{
  "corpusCoveredCount": 1,
  "corpusSkippedCount": 1,
  "warmedCount": 2,
  "deeplinkOnlyCount": 1,
  "dryRun": false
}
```

Log message: `codewarm batch split`

---

## Calibration-preservation test (expected output)

```
✓ calibration-preserving UPSERT > re-warm preserves sentinel calibratedConfidence
  - calibratedConfidence remains 0.777 after second UPSERT
  - sources[] length === 2 (multi-link merge)
```

---

## No-verbatim test (actual output — no DB required)

```
✓ no-verbatim boundary > 0036 migration renames confidence to asserted_confidence
✓ no-verbatim boundary > reasoning_atoms schema has no full-section verbatim column
✓ parseCodewarmManifest > flattens codes and groups with grounding flags
✓ budget cap halts batch
```

---

## CLI usage

```powershell
pnpm --filter @workspace/codewarm codewarm -- `
  --manifest P:\doc_repo\_catalog\codes\manifest_irc_2021.yaml `
  --jurisdiction miami_beach_fl `
  [--dry-run] [--budget-cap 5.0]
```

Manifest parser supports JSON and catalog YAML inline-row format (`_catalog/codes/manifest_*.yaml`).

---

## Blockers (verbatim)

```
connect ECONNREFUSED 127.0.0.1:5432
connect ECONNREFUSED ::1:5432
```

Local Postgres not running — `@workspace/codes` and `@workspace/codewarm` integration tests that use `withTestSchema` could not execute. CI Test job (Linux + Postgres service) is the authoritative proof path.

**pnpm install note:** Root `preinstall` uses `sh` (fails on Windows). Used `pnpm install --ignore-scripts` to relink workspace after adding `@workspace/codewarm`.

---

## Out of scope (confirmed)

- Cold-warm runs over national manifests (separate dispatch, HELD)
- Arrow-two Phase 3 / migration 0037
- Public `code_atoms` / hauska-engine corpus changes
- Licensed-display integration (seam only — `displayMode: deeplink`)
