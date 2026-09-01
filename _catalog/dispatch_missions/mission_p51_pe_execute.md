Planner execute for P-51 PE. You commit by pathspec in the isolated hauska-map clone only. You MAY open the PR, merge on CI conclusion success, vercel --prod, and probe. You MUST NOT occupy P:/hauska-map or P:/seat-worktrees/property/hauska-map. You MUST NOT occupy P:/legacy-design-tools. You MUST NOT atoms --apply. You MUST NOT footprints apply. You MUST NOT start P-52 / P-53. You MUST NOT flip texas-rrc. You MUST NOT image_tag=latest. You MUST NOT deploy cmdcenter.

Worktree: P:/hauska-map-worktrees/serve-pe-p51 branch serve-pe-p51 HEAD c338a1e plus uncommitted 12-file PE copy. Review ACCEPT `_inbox/2026-08-22_serve-pe-p51_planner_review.json`. WDLL `_inbox/2026-08-22_serve_ident_qa_WDLL.md` item 5.

## Commit and PR

Pathspec the 12 PE files named in `_inbox/2026-08-22_serve-pe-p51_close.json` filesChanged. If Command Center CI will not fire on a PE-only diff, add a one-line comment to `.github/workflows/command-center-ci.yml` so the pull_request event reports required check-run name `test`. Do not `--admin` around a missing `test`.

Commit message: `fix(pe): copy cortex buildingFootprintFact onto inspect Footprint`. Push and `gh pr create` on empressaioemail-tech/hauska-map. Body cites P-51 and WDLL item 5.

## Merge

Merge only when check-run **conclusion** strings are `success` for PE Typecheck, PE Test, and required context `test` (Command Center CI, pull_request event). Not `gh pr checks` wording. Do not merge on Typecheck/Test alone.

## Deploy

Vercel does not auto-deploy hauska-map main. From `P:/hauska-map-worktrees/serve-pe-p51` repo root after merge:

1. Read `.vercel/project.json` by field name. Must be `projectName=property-explorer` `projectId=prj_vcZGXbqdffk5C20WzaplEpzFynK3`. Stop if it is cmdcenter `prj_M9jNh8nBEHW0CnaUKlNT4pp4ebpe`.
2. `npx vercel --prod` from repo root. Never `--cwd apps/property-explorer`. `NODE_OPTIONS=--use-system-ca` if needed.
3. Wait READY. Alias must include `https://smartsite.cloud`.

## Live GET (field names)

Gold `https://smartsite.cloud/api/spine/property-atoms/48021%3A34137/facets`

Must have `buildingFootprintFact.state=refused` `code=atom-miss` `source=building-footprint`. Must NOT invent `structureRole`, `:primary`, or a footprint. Quote `X-Pe-Read-Path`. `pipelineFact` on gold must remain present-outside (do not break P-49). `wellFact` on gold must remain atom-miss (do not break P-50).

Do not use Anderson `48001:10136` as the live present probe. That GET is a bake 404. Quote it only if you hit it; do not treat 404 as a footprint miss.

## Return

File `_inbox/2026-08-22_p51_pe_execute.json` with PR number, merge SHA, CI conclusion strings, vercel deploy id, projectId, gold GET buildingFootprintFact fields, HTTP status, X-Pe-Read-Path, texas-rrc live value. leave_behind: P-52 / P-53 not started. Do not compile P-52 / P-53.
