---
date: 2026-05-21
agent: cc-agent-AC
repo: legacy-design-tools
session_type: execute
rolled_up: true
rolled_up_into: [00_current_state]
---

> Filed by the doc_repo planner from the cc-agent-AC `_inbox/` courier
> drop per HR-11. PR #65 verified **OPEN** via `gh pr view 65`
> (`state: OPEN`, `mergeable: MERGEABLE`, `mergeStateStatus: CLEAN`,
> commit `691fed8`). CI run `26264668165` (`PR Checks`) `conclusion:
> success`, `headSha` matches `691fed8`. **Awaiting operator merge.**
> Not a QA-backlog item, so `43` is untouched; `11_roadmap.md` carries
> no api-server-migration line, so only `00_current_state.md` rolled.

# api-server import migration — `@workspace/empressa-atom` → `@hauska/atom-contract`

**Outcome: PR #65 open for review.** The 2026-05-19 doc-sweep can-kick is
done. Operator-supervised; not deployed.

PR: https://github.com/empressaioemail-tech/legacy-design-tools/pull/65
Branch: `import-migration/api-server-atom-contract` · commit `691fed8`
Clone: `P:\ldt-ac-qa17` (cc-agent-AC's own; re-oriented onto `main` at
`993c7e9` — QA-17 #64 merged — before branching).

## Drift check — clean, no breaking drift

The dispatch required a drift check before migrating. Compared the
workspace package `lib/empressa-atom/src/` against the published
package's source (`@hauska/atom-contract@1.1.0`, repo commit `6b2c497`).

**`@hauska/atom-contract@1.1.0` is a clean, backward-compatible superset
of `@workspace/empressa-atom`.** The two source trees differ only in:

1. **Doc-comment genericization** — the published package dropped
   internal "A0" / "Spec 20" / "Recon Cn/Dn" / "Empressa Demo"
   references. No code change.
2. **Package-internal `.js` import extensions** — the published package
   uses `from "./registration.js"` etc. for NodeNext ESM resolution.
   Invisible to consumers.
3. **The v1.1.0 `AccessPolicy` feature** — purely additive: a new
   `AccessPolicy` export, optional `accessPolicy?` fields on
   `AtomRegistration` and `ContextSummary`, and a normalized
   `accessPolicy` on the `AtomPromptDescription` *return* type.

Every symbol the api-server imports exists in `@hauska/atom-contract`
with an identical type shape. No breaking drift, nothing papered over.
`pnpm run typecheck` confirms (see Verification).

(First-principles note: this matches the `@hauska/atom-contract`
CHANGELOG — v1.0.0 was a verbatim M2-C extraction of
`@workspace/empressa-atom`; v1.1.0 added `AccessPolicy` as a
backward-compatible minor.)

## What changed

- `artifacts/api-server/package.json` — `@workspace/empressa-atom`
  (`workspace:*`) → `@hauska/atom-contract` (`^1.1.0`).
- `artifacts/api-server/tsconfig.json` — dropped the now-unused
  `lib/empressa-atom` project reference.
- **46 api-server source + test files** — `@workspace/empressa-atom` →
  `@hauska/atom-contract` (the `/testing` subpath migrates with it).
- `pnpm-lock.yaml` — resolution swap (41 ins / 3 del).

49 files changed, 96 insertions, 61 deletions.

## Verification — CI green on PR #65

GitHub Actions run `26264668165`, both jobs pass:

- **Typecheck:** pass (1m24s) — `pnpm run typecheck` across all libs and
  artifacts including api-server. The drift-safety gate: any type
  incompatibility between the two packages would have failed here. Also
  confirmed green locally.
- **Test:** pass (4m5s) — the full `pnpm test` suite against the CI
  postgres service, including the ~14 api-server atom tests that import
  `@hauska/atom-contract` / `@hauska/atom-contract/testing`
  (`runAtomContractTests`, `PostgresEventAnchoringService`, etc.). Green
  confirms runtime behavior is identical to the workspace package.

Tests verified on CI rather than locally: the repo's
`pnpm-workspace.yaml` strips non-Linux native binaries, so the
esbuild/vitest toolchain cannot run on a Windows dev box (standing repo
constraint, also hit on QA-17).

## Scope and the follow-on

api-server only, per dispatch. `lib/empressa-atom/` is **retained** — not
removed — because two other workspace packages still import
`@workspace/empressa-atom`:

- **`lib/submission-classifier`** — `src/upsert.ts` (`EventAnchoringService`
  type import) and `src/__tests__/upsert.test.ts`. `package.json`
  declares the `workspace:*` dep.
- **`scripts`** — `src/backfillTrack1Classifications.ts`,
  `src/backfillSheetCreatedEvents.ts`, and their tests. `package.json`
  declares the `workspace:*` dep.

These two are the **only** remaining `@workspace/empressa-atom` importers
in the repo (other hits are doc-comments / generated files / openapi.yaml
prose — not real imports). The scoped follow-on: migrate those two the
same way, then retire `lib/empressa-atom/`. That retirement is a separate
later step — not this dispatch.

## Notes for the planner

- No new clone; same `P:\ldt-ac-qa17` as QA-17, branched
  `import-migration/api-server-atom-contract`. No file overlap with
  cc-agent-C (which is on the codex-reviewer-qa scaffold, a separate
  artifact).
- cc-agent-AC's dispatch queue is now empty after this PR merges. The
  follow-on (submission-classifier + scripts migration, then
  `lib/empressa-atom/` retirement) is unassigned — flagging it for the
  planner to schedule if/when wanted.
- QA-26 (`core.autocrlf=true`, no root `.gitattributes`) produced the
  expected LF↔CRLF warnings on the 46-file `sed` migration; the
  committed diff is clean (import-line changes only — git's autocrlf
  normalizes). Still a standing ops-cleanup item, untouched here.
