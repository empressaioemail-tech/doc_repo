---
id: 2026-06-08_legacy-design-tools_cc-agent-C_cortex_websearch_code_retrieval
date: 2026-06-08
agent: cc-agent-C
repo: legacy-design-tools
dispatch: 2026-06-08_cc-agent-C_cortex_websearch_code_retrieval
status: break-point
---

# Break-point report — web-search code retrieval + Step 1 merge

## Workspace gate (verbatim)

```
On branch cortex/whole-review-vision-miami
Your branch is up to date with 'origin/cortex/whole-review-vision-miami'.

Changes not staged for commit:
	modified:   .claude/worktrees/recon-add-jurisdiction (untracked content)
	modified:   .claude/worktrees/track-b-ifc-ingest (modified content, untracked content)

commit 76c0bcb738bcca761ca7b5b49c6b3fbd40a8a9b4 feat(cortex): Miami Beach whole-review P1 grounding + P2 Opus vision pipeline
commit 3aa33a9d2ec512350e0a12966675e4aa1ae3410f feat(finding-engine): ADR-019/021 precedence reconciliation primitive (WS2) (#147)
commit d4870682b4165ba6d4ea56511f715db0fa89c7b8 feat(finding-engine): plan-set decomposition + per-discipline orchestration (WS1) (#146)
```

Submodule-only dirt; HEAD matched dispatch SHA. Proceeded after stash-free gate on feature branch.

---

## STEP 1 — Merge `cortex/whole-review-vision-miami`

| Item | Value |
|------|-------|
| PR | **#150** — https://github.com/empressaioemail-tech/legacy-design-tools/pull/150 |
| Branch commits | `76c0bcb` (feature) + `45cfaf8` (CI fix: codes jurisdiction test) |
| Merge commit SHA | **`658dbe9814165ac2a2583f08649e49ef8839d620`** |
| CI | Initial Test **fail** (verbatim): `codes.test.ts` expected 3 jurisdictions, received 5 (`miami_beach_fl`, `miami_dade_fl`). Fixed in `45cfaf8`. Re-run: Typecheck ✓ Test ✓ Rubric ✓ → merged. |

---

## STEP 2 — Web-search code retrieval

| Item | Value |
|------|-------|
| Branch | `cortex/websearch-code-retrieval` |
| SHA | **`12a264d`** (full: `12a264d…` — `git rev-parse HEAD` on branch) |
| PR | **#151** — https://github.com/empressaioemail-tech/legacy-design-tools/pull/151 |
| Merge | **Held** per dispatch (operator merge) |

### Model (HR-12)

- Agentic + finding synthesis: **Grok Build 0.1** (unchanged)
- Per-sheet vision: **Claude `claude-opus-4-8`** (from merged #150; no change this step)
- No escalation off Grok for this dispatch

### Files touched

| Area | Files |
|------|-------|
| Web fetch module | `lib/codes/src/webCodeFetch/{types,reviewTargets,drivers,extract,index}.ts` |
| Tests | `lib/codes/src/__tests__/webCodeFetch.test.ts`, `webCodeNoPersist.test.ts` |
| Wiring | `artifacts/api-server/src/routes/findings.ts` (`resolveEngineInputs` fallback) |
| Engine contract | `lib/finding-engine/src/types.ts` (`CodeSectionWebProvenance`), `prompt.ts` |
| Retired | `scripts/seed-florida-interim-atoms.mjs`, `lib/codes/src/interimReferenceAtoms.ts`, `florida_interim_reference` source row |
| Exports | `lib/codes/src/index.ts` |

### Boundaries enforced

1. **No corpus persistence** — `websearch:` ids only in transient `codeSections`; orchestrator unchanged; `webCodeNoPersist.test.ts` asserts seed script deleted and no `websearch:` in `orchestrator.ts`.
2. **Edition verification** — `verifyAndExtract` requires requested year present in page text; wrong adjacent edition → `verified: false`, `unverifiedWebSource: true`, confidence ≤ 0.35.

### Wrong-edition refusal test output (verbatim)

```
pnpm test -- src/__tests__/webCodeFetch.test.ts -t "refuses wrong edition"

✓ verifyAndExtract > refuses wrong edition FBC 2020 when 2023 requested
✓ verifyAndExtract > refuses wrong edition NEC 2020 when 2017 requested
✓ fetchCodeSection > returns verified:false for wrong edition

Test Files  1 passed (1)
Tests  2 passed | 8 skipped (10)
```

Assertions:
- FBC 2020 page + request `FBC 2023` → `verified: false`, `unverifiedWebSource: true`, `confidence < 0.5`
- NEC 2020 page + request `NEC 2017` → `verified: false`, `unverifiedWebSource: true`

### Verification (HR-8)

```
pnpm run typecheck                         → green
pnpm --filter @workspace/finding-engine test → 84 passed
pnpm --filter @workspace/codes test -- webCodeFetch webCodeNoPersist → 13 passed
```

### Live whole review on 404 Remodel_B

**Not executed this session.** Requires deployment Neon + api-server + plan set on engagement `15d1d314-c2fa-42d1-81f9-24eb06d94e3d`.

**Expected log lines after unblock:**

```
finding generation: retrieval populated codeSections { jurisdictionKey: miami_beach_fl, … }
web code fetch: section retrieved { codeRef: "FBC-M601.6", verified: true, sourceUrl: "https://codes.iccsafe.org/…", confidence: 0.85 }
finding generation: web code retrieval supplemented codeSections { webSectionCount: N, verifiedCount: M }
finding vision read: claude-opus-4-8 escalation starting …
finding generation: orchestrated pass completed { disciplinesRun: […] }
```

**Illustrative web-grounded finding (post-unblock):**

> The mechanical return-air grille on M-101 appears undersized relative to the 1,020 CFM balanced return required per the CHVAC calc. [[CODE:websearch:fbc-2023:fbc-m601-6]] — source: `https://codes.iccsafe.org/content/FLMECH2023P1` retrieved 2026-06-08T…, edition FBC 2023.

### Proof: no verbatim model-code as public-free atoms

- Deleted `scripts/seed-florida-interim-atoms.mjs`
- Removed `florida_interim_reference` from `sourceRegistry.ts`
- `grep websearch` in `orchestrator.ts` → no matches
- Web sections use `websearch:` prefix only in runtime `codeSections`, never `INSERT INTO code_atoms`

---

## Blockers (verbatim)

1. **Step 1 CI initial failure** — `codes.test.ts` jurisdiction list stale (fixed before merge).
2. **Step 2 live E2E** — no `DATABASE_URL` / running api-server / engagement upload in agent session; cannot paste live web-grounded finding with real `sourceUrl` + `retrievedAt` from production run.
3. **Submodule dirt** — `.claude/worktrees/*` untracked content (non-blocking).
4. **PR #151 held** — operator merge per dispatch.

---

## Operator next steps

1. Review + merge **PR #151** after CI green.
2. Warm Miami jurisdictions (`scripts/warmup-miami-jurisdictions.ps1`).
3. Re-run whole review on 404 Remodel_B; confirm `websearch:` citations show live URL + retrieved-at in finding text/chips.
4. Paste live run log + one web-grounded finding back into this inbox file.
