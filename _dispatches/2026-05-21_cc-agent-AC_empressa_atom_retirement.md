---
id: 2026-05-21_cc-agent-AC_empressa_atom_retirement
title: Dispatch — cc-agent-AC retire @workspace/empressa-atom (final two consumers + staging package)
date: 2026-05-21
agent: cc-agent-AC
repo: legacy-design-tools
kind: dispatch
related: [2026-05-21_cc-agent-AC_api_server_import_migration, 25_atom_architecture_reference, 80_adrs/adr_018_atom_contract_substrate_layer, 20_agent_operating_rules, CLAUDE.md]
---

# cc-agent-AC dispatch — retire @workspace/empressa-atom

> **COMPLETE 2026-05-21.** Delivered as PR #67 (open, CI green). Re-enumeration confirmed `lib/submission-classifier` and `scripts` as the only importers; both migrated and `lib/empressa-atom/` removed (34 files, 3343 deletions). The ADR-018 atom-contract transition for legacy-design-tools is complete across #64/#65/#67. cc-agent-AC's dispatch queue is empty.

You are cc-agent-AC. This dispatch finishes the `legacy-design-tools` migration off the workspace-private `@workspace/empressa-atom` staging package onto the published `@hauska/atom-contract`, and removes the staging package. It is the scoped follow-on you enumerated yourself when PR #65 landed.

## Activation gate

Fires now. PR #65 (api-server import migration) merged to `main` on 2026-05-21, merge commit `f6f4145`. Re-orient your clone `P:\ldt-ac-qa17` onto `main` and pull before branching, so you build on the merged api-server migration.

## Why this exists

PR #65 migrated `artifacts/api-server` off `@workspace/empressa-atom` onto `@hauska/atom-contract@^1.1.0`. Your #65 session report enumerated the only two remaining real importers of `@workspace/empressa-atom`:

- `lib/submission-classifier`: `src/upsert.ts` (an `EventAnchoringService` type import) and `src/__tests__/upsert.test.ts`. `package.json` declares the `workspace:*` dep.
- `scripts`: `src/backfillTrack1Classifications.ts`, `src/backfillSheetCreatedEvents.ts`, and their tests. `package.json` declares the `workspace:*` dep.

With those two migrated, nothing imports the staging copy and `lib/empressa-atom/` can be removed. That fully completes the ADR-018 atom-contract transition for legacy-design-tools.

## Scope

1. Re-enumerate the importers first. Do not trust the pre-#65 list blindly. Grep the whole repo on current `main` for `@workspace/empressa-atom` and confirm `lib/submission-classifier` and `scripts` are the only real importers. Doc-comments, generated files, and `openapi.yaml` prose do not count. If the live set differs from the list above, report the difference and migrate the actual set.
2. Migrate `lib/submission-classifier` and `scripts` off `@workspace/empressa-atom` onto `@hauska/atom-contract` (`^1.1.0`), the same drift-safe pattern as #65: swap the `package.json` dep, swap the import specifiers (the `/testing` subpath included), and drop any now-unused `lib/empressa-atom` tsconfig project references.
3. Remove `lib/empressa-atom/`: delete the package directory, its `pnpm-workspace.yaml` entry, and any remaining project references. Do this only after step 1 confirms zero remaining importers.
4. typecheck, build, and the full test suite green. One PR for the whole change set. Migration and removal are atomic: the package can only be deleted once nothing imports it.

## Out of scope

- Any behavior change. This is a dependency swap and a dead-package removal, nothing else.
- cortex-api and api-server, already migrated by #65. Touch api-server only if step 1's re-enumeration surprises you.

## Run posture

Operator-supervised, not maximum-autonomy. Open a PR for review. Do not self-deploy. CI (Linux) is authoritative for the test suite: the Windows workstation cannot run the vitest/esbuild toolchain, so verify on CI run ID as in #64 and #65.

## Workspace ownership

cc-agent-AC's dedicated clone `P:\ldt-ac-qa17`. Branch `import-migration/empressa-atom-retirement`. cc-agent-C is on the codex-reviewer-qa scaffold in its own clone; keep file overlap at zero. If you enter a working directory and see another agent's uncommitted changes, stop and surface to the planner.

## Reporting

At every session break-point, write your session summary and any decision-relevant finding to `P:\doc_repo\_inbox\` as `<date>_legacy-design-tools_cc-agent-AC_<topic>.md`. The `_inbox/` write is the one explicitly permitted cross-repo write per HR-11 in [`20_agent_operating_rules.md`](../20_agent_operating_rules.md). Do not commit to the doc repo. Keep the durable record in your own repo.
