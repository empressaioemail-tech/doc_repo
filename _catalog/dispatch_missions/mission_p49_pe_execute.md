Planner execute for P-49 PE. You commit by pathspec in the isolated hauska-map clone only. You MAY open the PR, merge on CI conclusion success, vercel --prod, and probe. You MUST NOT occupy P:/hauska-map or P:/seat-worktrees/property/hauska-map. You MUST NOT occupy P:/legacy-design-tools. You MUST NOT atoms --apply. You MUST NOT start P-50. You MUST NOT flip texas-rrc. You MUST NOT image_tag=latest. You MUST NOT deploy cmdcenter.

Worktree: P:/hauska-map-worktrees/serve-pe-p49 branch serve-pe-p49 HEAD 0f658a2 plus uncommitted 12-file PE copy. Review ACCEPT `_inbox/2026-08-22_serve-pe-p49_planner_review.json`. WDLL `_inbox/2026-08-22_serve_ident_qa_WDLL.md` item 3.

## Commit and PR

Pathspec the 12 PE files named in `_inbox/2026-08-22_serve-pe-p49_close.json` filesChanged. If Command Center CI will not fire on a PE-only diff, add a one-line comment to `.github/workflows/command-center-ci.yml` so the pull_request event reports required check-run name `test`. That comment is the known hauska-map gate; do not `--admin` around a missing `test`.

Commit message: `fix(pe): copy cortex pipelineFact onto inspect Pipeline`. Push and `gh pr create` on empressaioemail-tech/hauska-map. Body cites P-49 and WDLL item 3.

## Merge

Merge only when check-run **conclusion** strings are `success` for PE Typecheck, PE Test, and required context `test` (Command Center CI, pull_request event). Not `gh pr checks` wording. Do not merge on Typecheck/Test alone. `workflow_dispatch` of CC CI does not satisfy the required context. `--admin` still refuses if `test` is missing.

## Deploy

Vercel does not auto-deploy hauska-map main. From `P:/hauska-map-worktrees/serve-pe-p49` repo root after merge (or from the clone once main is pulled):

1. Read `.vercel/project.json` by field name. Must be `projectName=property-explorer` `projectId=prj_vcZGXbqdffk5C20WzaplEpzFynK3`. Stop if it is cmdcenter `prj_M9jNh8nBEHW0CnaUKlNT4pp4ebpe`.
2. `npx vercel --prod` from repo root. Never `--cwd apps/property-explorer`. `NODE_OPTIONS=--use-system-ca` if this machine needs it.
3. Wait READY. Alias must include `https://smartsite.cloud`.

## Live GET (field names)

Gold `https://smartsite.cloud/api/spine/property-atoms/48021%3A34137/facets`

Must have `pipelineFact.state=present` `source=rrc-pipeline-fact` `nearPipeline=false` `t4permit` null. Must NOT invent ENERGY TRANSFER. Quote `X-Pe-Read-Path`.

Nearby `.../48021%3A10048/facets`

If HTTP 404 / bake miss, quote status. Item 3 can still met on gold present-outside plus a named nearby hole. If HTTP 200: `pipelineFact.state=present` `nearPipeline=true` `t4permit=05781` `source=rrc-pipeline-fact`.

Do not treat padded `48021:34137.00000000` 404 as a pipeline miss.

## Return

File `_inbox/2026-08-22_p49_pe_execute.json` with PR number, merge SHA, CI conclusion strings, vercel deploy id, projectId, both GET bodies' pipelineFact fields, HTTP statuses, X-Pe-Read-Path, texas-rrc live value. leave_behind: P-50 not started. Do not compile P-50.
