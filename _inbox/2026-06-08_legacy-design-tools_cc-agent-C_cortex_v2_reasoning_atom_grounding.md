---
id: 2026-06-08_legacy-design-tools_cc-agent-C_cortex_v2_reasoning_atom_grounding
date: 2026-06-08
agent: cc-agent-C
repo: legacy-design-tools
branch: cortex/v2-reasoning-atom-grounding
dispatch: 2026-06-08_cc-agent-C_cortex_v2_reasoning_atom_grounding
status: break-point
model: Grok Build 0.1 (HR-12); Opus-4.8 vision unchanged
---

# Break-point report — Cortex v2 reasoning-atom grounding

## Workspace gate (verbatim)

```
On branch cortex/v2-reasoning-atom-grounding
Changes not staged for commit:
	modified:   .claude/worktrees/recon-add-jurisdiction (untracked content)
	modified:   .claude/worktrees/track-b-ifc-ingest (modified content, untracked content)

c33660a Merge pull request #151 from empressaioemail-tech/cortex/websearch-code-retrieval
12a264d feat(codes): web-search code retrieval fallback for finding engine
658dbe9 Merge pull request #150 from empressaioemail-tech/cortex/whole-review-vision-miami
```

Submodule dirt only (non-blocking). v2 work committed on `cortex/v2-reasoning-atom-grounding`.

---

## Step 1 — PR #151 merge

| Field | Value |
|---|---|
| PR | https://github.com/empressaioemail-tech/legacy-design-tools/pull/151 |
| **Merge SHA** | `c33660abe0308c32c96cf458d4a27a16964f7c53` |
| CI at merge | Green (Typecheck, Test, Rubric) |

---

## Step 2 — v2 build

| Field | Value |
|---|---|
| Branch | `cortex/v2-reasoning-atom-grounding` |
| **Feature SHA** | `7689a056beae7cef248ae871c97cbe9784ffb048` |
| PR (held for operator merge) | https://github.com/empressaioemail-tech/legacy-design-tools/pull/152 |

### Schema / files touched

| Area | Path |
|---|---|
| Migration | `lib/db/drizzle/0035_reasoning_atoms.sql` |
| Drizzle schema | `lib/db/src/schema/reasoningAtoms.ts` |
| Fixture | `lib/db/src/__tests__/__fixtures__/schema.sql.template` (+ `schema.integration.test.ts`) |
| Persistence + UPSERT | `lib/codes/src/reasoningAtoms/{types,snippet,sources,ids,persist,toCodeSection,grounding,index}.ts` |
| Retrieve-first wire | `artifacts/api-server/src/routes/findings.ts` → `supplementCodeSectionsWithReasoningGrounding` |
| Citation UX seam | `lib/finding-engine/src/types.ts` (`ReasoningSourceLink`, `displayMode`), `prompt.ts` (multi-source deeplinks) |
| Tests | `lib/codes/src/__tests__/reasoningAtoms.test.ts`, inverted `webCodeNoPersist.test.ts` |

### `reasoning_atoms` shape (OUT of public `code_atoms`)

- `id` — `reasoning:<edition-slug>:<section>`
- `jurisdictionKey`, `codeRef`, `edition`, `editionSlug`
- `sources[]` — `{ url, sourceName, edition, retrievedAt, verified }` (multi-link UPSERT)
- `reasoning`, `confidence`, `verificationState`, `snippet` (≤600 chars, app-enforced)
- `displayMode` — `deeplink | licensed` (seam only)
- `calibratedConfidence` — nullable arrow-two seam
- `accessPolicy` — `platform-internal` default
- **No** `full_text` / `body` / `section_text` column

---

## Retrieve-first proof (integration test — two-run)

Run: `DATABASE_URL=postgres://postgres:postgres@localhost:5432/test_db pnpm --filter @workspace/codes test`

```
✓ retrieve-first grounding > second run retrieves persisted atoms without web fetch
  - first.webFilledCount > 0
  - second.reasoningRetrievedCount > 0
  - second.webFilledCount === 0
  - fetchCount unchanged between runs (no additional HTTP fetches)
  - logs include "reasoning atom retrieved (retrieve-first)"
```

`resolveEngineInputs` logs split as:

```json
{
  "reasoningRetrievedCount": <n>,
  "webFilledCount": <m>,
  "sectionCount": <n+m>,
  "verifiedCount": <k>
}
```

Message: `finding generation: reasoning grounding supplemented codeSections`

---

## Multi-link UPSERT proof

```
✓ reasoning atom persistence > multi-link UPSERT merges second source into one atom
  - rows in reasoning_atoms === 1
  - atom.sources.length === 2
  - sourceNames: ["nfpa", "upcodes"]
```

---

## No-verbatim-text boundary proof

**Schema grep (test):**

```
✓ reasoning_atoms migration has snippet only — no full_text/body/section_text
✓ reasoning_atoms drizzle schema has no verbatim catalog field
```

**Runtime (test):**

```
✓ persists reasoning atom with capped snippet — NOT full section text
  - fullText length 3200+ chars fetched
  - persisted snippet.length <= 600
  - snippet !== fullText
```

**Inverted posture (`webCodeNoPersist.test.ts`):**

```
✓ reasoningAtoms module documents persist-reasoning boundary
✓ web fetch entry delegates persistence to reasoningAtoms
✓ retired interim seed script is gone
```

---

## Test / typecheck status

| Command | Result |
|---|---|
| `pnpm run typecheck` | **Green** |
| `pnpm --filter @workspace/codes test` | **154 passed** (with local Postgres) |
| `pnpm --filter @workspace/finding-engine test` | **84 passed** |
| `lib/db` schema.integration | **8 passed** (reasoning_atoms in table list) |

---

## Blockers (verbatim)

1. **Live whole-review E2E on 404 Remodel_B** (`15d1d314-c2fa-42d1-81f9-24eb06d94e3d`) — not executed in this agent session. Requires operator `dev:local` + migration `0035` applied to target DB + two sequential finding-generation runs with api-server logs captured. Integration tests prove retrieve-first mechanics; acceptance log from production engagement is pending operator run.

2. **`fixture-drift.test.ts` on Windows** — `check-fixture-drift.sh` invokes bash/WSL; fails locally with `execvpe(/bin/bash) failed` (pre-existing Windows quirk). Fixture manually patched for `reasoning_atoms`; CI (Linux) should validate drift on PR #152.

3. **PR #152 held** — do not merge until operator reviews + CI green.

---

## Operator next steps

1. Merge PR #152 after CI green.
2. Apply `0035_reasoning_atoms.sql` to Neon/prod.
3. Run whole-review twice on `404 Remodel_B` / `15d1d314-c2fa-42d1-81f9-24eb06d94e3d`; confirm log shows `reasoningRetrievedCount > 0` on run 2 and `webFilledCount === 0`.
