---
date: 2026-05-21
agent: cc-agent-AC
repo: legacy-design-tools
session_type: execute
rolled_up: true
rolled_up_into: [00_current_state]
---

> Filed by the doc_repo planner from the cc-agent-AC `_inbox/` courier
> drop per HR-11. PR #67 verified **OPEN** via `gh pr view 67`
> (`state: OPEN`, `mergeable: MERGEABLE`, `mergeStateStatus: CLEAN`,
> commit `3b4c20f`). CI run `26265360040` (`PR Checks`) `conclusion:
> success`, `headSha` matches `3b4c20f`. **Awaiting operator merge.**
> Not a QA-backlog item and `11_roadmap.md` carries no empressa-atom
> line, so only `00_current_state.md` rolled. Residual cosmetic
> doc-comment debt noted in §6 of `00_current_state.md`.

# Retire `@workspace/empressa-atom` — final consumers + staging package removal

**Outcome: PR #67 open for review.** The ADR-018 atom-contract
transition for `legacy-design-tools` is complete — nothing in the repo
imports the workspace-private staging package anymore, and it is removed.
Operator-supervised; not deployed.

PR: https://github.com/empressaioemail-tech/legacy-design-tools/pull/67
Branch: `import-migration/empressa-atom-retirement` · commit `3b4c20f`
Clone: `P:\ldt-ac-qa17` — re-oriented onto `main` at `f6f4145` (PR #65
merged) before branching.

## Step 1 — re-enumeration (did not trust the pre-#65 list)

Re-grepped the whole repo on current `main` for `@workspace/empressa-atom`.
Confirmed `lib/submission-classifier` and `scripts` are the **only** real
importers — matches the #65 enumeration exactly, no surprises. Every
other hit is a doc-comment, a generated file, or `openapi.yaml` prose;
none are imports.

## Step 2 — migrated the two consumers

Onto `@hauska/atom-contract@^1.1.0`, same drift-safe swap as #65 (the
#65 drift check established `@hauska/atom-contract@1.1.0` is a clean,
backward-compatible superset; both consumers import a strict subset of
what the api-server did):

- **`lib/submission-classifier`** — `package.json` dep, `src/upsert.ts`
  (`EventAnchoringService` type), `src/__tests__/upsert.test.ts`.
- **`scripts`** — `package.json` dep, `backfillSheetCreatedEvents.ts`,
  `backfillTrack1Classifications.ts`, and their two tests.

## Step 3 — removed the staging package

With zero importers left, deleted `lib/empressa-atom/` (24 tracked
files) and the root `tsconfig.json` project reference to it.

Note for the planner: the dispatch anticipated a `pnpm-workspace.yaml`
entry to remove — there was **none**. `lib/empressa-atom` was matched by
the `lib/*` packages glob, with no explicit line and no catalog /
overrides / `onlyBuiltDependencies` reference. Deleting the directory
was sufficient. Only one project reference existed repo-wide (the root
tsconfig); api-server's was already dropped in #65, and
submission-classifier / scripts never had one.

34 files changed, 14 insertions, 3343 deletions.

## Verification — CI green on PR #67

GitHub Actions run `26265360040`, both jobs pass:

- **Typecheck:** pass (1m14s) — `pnpm run typecheck`, including
  `tsc --build` (`typecheck:libs`) with the `lib/empressa-atom`
  reference removed and the directory gone. `lib/submission-classifier`
  typecheck also run explicitly (green) since it is not in the root
  typecheck reference graph.
- **Test:** pass (4m12s) — full `pnpm test` suite against the CI
  postgres service, including the `lib/submission-classifier` and
  `scripts` tests that import the migrated modules.

Verified on CI rather than locally: the repo's `pnpm-workspace.yaml`
strips non-Linux native binaries, so the esbuild/vitest toolchain cannot
run on a Windows dev box — standing constraint, same as #64/#65.

## Out of scope / residual

No behavior change — dependency swap and dead-package removal only.

Residual cosmetic debt: stale doc-comments still naming
`@workspace/empressa-atom` remain in `lib/codes/src/promptFormatter.ts`,
`artifacts/design-tools/src/pages/DevAtomsProbe.tsx`,
`lib/comment-letter/src/index.ts`, the generated `lib/api-zod` /
`lib/api-client-react` files, `lib/api-spec/openapi.yaml`, and
`docs/deploy.md`. These are prose references, not imports — left
untouched to keep this PR scoped to the migration + removal, and because
the generated files / openapi prose should be fixed at their source
(the api-spec), not hand-edited. A small follow-up cleanup if the
planner wants the name fully gone from the tree.

## Status

ADR-018 atom-contract transition for `legacy-design-tools` is now
complete across all three PRs: #64 (QA-17 Code Library), #65 (api-server
imports), #67 (final consumers + staging-package removal). cc-agent-AC's
dispatch queue is empty after #67 merges.
