---
id: 2026-06-08_legacy-design-tools_cc-agent-C_cortex_v2_fixture_drift_fix
date: 2026-06-08
agent: cc-agent-C
repo: legacy-design-tools
branch: cortex/v2-reasoning-atom-grounding
pr: 152
status: break-point
---

# Fixture drift fix — reasoning_atoms (PR #152)

## Diagnosis (confirmed)

Migration `0035_reasoning_atoms.sql` is correct: table + 3 CHECK constraints + unique index `reasoning_atoms_jurisdiction_ref_edition_unique` on `(jurisdiction_key, code_ref, edition)`.

CI failure root cause: `lib/db/src/schema/reasoningAtoms.ts` declared only `reasoning_atoms_jurisdiction_idx` — no checks, no unique index. CI materializes schema via `drizzle-kit push` from Drizzle TS, so pg_dump lacked constraints/index while the hand-edited fixture had them → drift.

## Fix applied

| Step | Action | Result |
|---|---|---|
| 1 | Added to `reasoningAtoms.ts`: `uniqueIndex("reasoning_atoms_jurisdiction_ref_edition_unique")` on `(jurisdictionKey, codeRef, edition)` + 3 `check()` constraints matching migration 0035 | Drizzle push now materializes full shape |
| 2 | Regenerated fixture via Git Bash: `pnpm --filter @workspace/db run test:fixture:schema` against drizzle-pushed `test_db` | No hand-edit; pg_dump ordering (alphabetical) corrected |
| 3 | Local drift verify via Git Bash: `pnpm --filter @workspace/db run test:fixture:drift` | **Exit 0** — `Schema fixture matches live DB.` |
| 4 | `pnpm run typecheck` | Green |
| 5 | `lib/db` integration tests (`schema.integration`) | 8/8 green |

### Ancillary

`lib/db/drizzle.config.ts`: `schema` path changed from `path.join(__dirname, "./src/schema/index.ts")` → `"./src/schema"` so `drizzle-kit push` works on Windows (was blocking local regeneration).

## Commit

| Field | Value |
|---|---|
| Branch | `cortex/v2-reasoning-atom-grounding` |
| SHA | `d61adc3caa2caa1b75c084af32b6a713cd546d5f` |
| Message | `fix(db): align reasoning_atoms drizzle schema with migration 0035` |
| PR | https://github.com/empressaioemail-tech/legacy-design-tools/pull/152 |

## CI status — GREEN

| Check | Result | Duration |
|---|---|---|
| Typecheck | pass | 1m41s |
| Test (incl. fixture-drift) | pass | 5m32s |
| Rubric unit tests | pass | 1m3s |

Run: https://github.com/empressaioemail-tech/legacy-design-tools/actions/runs/27208444425

PR #152 held for operator merge.

## Windows note

`pnpm test` fixture-drift vitest wrapper still fails locally when `bash` resolves to broken WSL (`execvpe(/bin/bash) failed`). Use Git Bash explicitly for drift verification:

```bash
export DATABASE_URL=postgres://postgres:postgres@localhost:5432/test_db
pnpm --filter @workspace/db run test:fixture:drift
```

CI runs on Linux bash — unaffected.
