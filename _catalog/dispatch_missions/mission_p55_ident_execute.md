Planner execute for P-55 IDENT. You commit by pathspec in the isolated engine worktree only. You MAY push to existing PR 356, merge on CI conclusion success. You MUST NOT occupy P:/hauska-engine or P:/seat-worktrees/property/hauska-engine. You MUST NOT atoms --apply. You MUST NOT backfill. You MUST NOT rewrite 100 million atoms. You MUST NOT mint verified-absence pairs. You MUST NOT start P-52. You MUST NOT vercel. You MUST NOT image_tag=latest.

Worktree: P:/hauska-engine-worktrees/ident-p55 branch ident-p55 HEAD 1561fac380bb90b4135d0d8c67ea7c981a22518a (PR 356 open). Review close `_inbox/2026-08-21_ident_close.json`. WDLL `_inbox/2026-08-22_serve_ident_qa_WDLL.md` item 9.

## Typecheck debt (CI conclusion FAILURE)

PR 356 check-run `typecheck + test` run 32538990782 job 96945054112 conclusion FAILURE. Two `packages/atoms` errors:

1. `src/parcel-write-identity.ts:218` TS2367: comparison with `"road-node"` has no overlap against the parcel-fact union.
2. `src/property-instances.ts:237` TS2304: Cannot find name `ParcelExternalKey`.

Fix those. Do not widen C5. Do not change live store keys. SERVE keeps working on today's keys (`:sd:outside`, `:footprint:primary`, padded). New writes stay integer grammar, no `:outside` or `:primary` in new `entity_id`, `externalKeys` fed, `applies-to` written. `:sd:none` for new SD absence stays (already on this HEAD).

Prove typecheck locally: `pnpm --filter @hauska-engine/atoms typecheck` must exit 0. Re-run the named writer tests from the ident close. Leave C5 unfed.

## Commit and PR

Pathspec only the files you change to clear typecheck (expect parcel-write-identity.ts and property-instances.ts, plus a test if one is required). Commit message: `fix(atoms): clear Wave C typecheck so IDENT 356 can merge`. Push to `ident-p55` (PR 356 already open). Do not open a second PR.

## Merge

Merge only when check-run **conclusion** field string is `success` for `typecheck + test`. Read GET /check-runs JSON by field name. Not `gh pr checks` wording. After merge quote the merge SHA.

## Return

File `_inbox/2026-08-22_p55_ident_execute.json` with PR number, merge SHA, CI conclusion string, typecheck errors fixed, tests, zero `--apply`. leave_behind: backfill waits until COVER yields the slot. C5 unfed. Do not start P-52. Do not compile PE.
