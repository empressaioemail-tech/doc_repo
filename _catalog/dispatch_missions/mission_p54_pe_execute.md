Planner execute for P-54 PE. You commit by pathspec in the isolated hauska-map clone only. You MAY open the PR, merge on CI conclusion success, vercel --prod, and probe. You MUST NOT occupy P:/hauska-map or P:/seat-worktrees/property/hauska-map. You MUST NOT occupy P:/legacy-design-tools. You MUST NOT atoms --apply. You MUST NOT start P-52. You MUST NOT flip texas-rrc. You MUST NOT image_tag=latest. You MUST NOT deploy cmdcenter.

Worktree: P:/hauska-map-worktrees/serve-pe-p54 branch serve-pe-p54 HEAD 3f7a048aa4f2850adc3dbba86b41e30cc67f382b plus uncommitted 13-file PE copy. Review ACCEPT `_inbox/2026-08-22_serve-pe-p54_planner_review.json`. WDLL `_inbox/2026-08-22_serve_ident_qa_WDLL.md` item 7.

## Commit and PR

Pathspec the 13 PE files named in `_inbox/2026-08-22_serve-pe-p54_close.json` filesChanged. If Command Center CI will not fire on a PE-only diff, add a one-line comment to `.github/workflows/command-center-ci.yml` so the pull_request event reports required check-run name `test`. Do not `--admin` around a missing `test`.

Commit message: `fix(pe): copy cortex ownerFact onto inspect Owner, identified session only`. Push and `gh pr create` on empressaioemail-tech/hauska-map. Body cites P-54 and WDLL item 7.

## Merge

Merge only when check-run **conclusion** strings are `success` for PE Typecheck, PE Test, and required context `test` (Command Center CI, pull_request event). Not `gh pr checks` wording. Do not merge on Typecheck/Test alone.

## Deploy

Vercel does not auto-deploy hauska-map main. From `P:/hauska-map-worktrees/serve-pe-p54` repo root after merge:

1. Read `.vercel/project.json` by field name. Must be `projectName=property-explorer` `projectId=prj_vcZGXbqdffk5C20WzaplEpzFynK3`. Stop if it is cmdcenter `prj_M9jNh8nBEHW0CnaUKlNT4pp4ebpe`.
2. `npx vercel --prod` from repo root. Never `--cwd apps/property-explorer`. `NODE_OPTIONS=--use-system-ca` if needed.
3. Wait READY. Alias must include `https://smartsite.cloud`.

## Live GET (field names)

Gold `https://smartsite.cloud/api/spine/property-atoms/48021%3A34137/facets`

Anonymous (no cookie): must have `ownerFact.state=refused` `code=identified-session-required` `source=owner-fact`. Must NOT have `ownerName` or mailing. Must NOT be present. Quote `X-Pe-Read-Path`. Keep unbroken: `pipelineFact` present-outside (P-49), `wellFact` atom-miss (P-50), `buildingFootprintFact` atom-miss (P-51), `boundaryEdgeFact` present `property-boundary-edge` role=front (P-53). `texas-rrc` stays `live:false`.

Identified: only if you can obtain a real `pe_session` cookie without inventing Clerk/Stripe and without printing secrets. Then gold must be `ownerFact.state=present` `source=owner-fact` `entityId=48021:34137:2025` `taxYear=2025`. Never treat service key / `X-Hauska-Key` as identified. If you cannot obtain a session, file identified as leave_behind. Do not skip the anonymous probe.

Do not paste a live ownerName or mailing into the execute JSON. Redact.

## Return

File `_inbox/2026-08-22_p54_pe_execute.json` with PR number, merge SHA, CI conclusion strings, vercel deploy id, projectId, anonymous gold GET ownerFact fields, HTTP status, X-Pe-Read-Path, texas-rrc live value, and identified GET if you ran it. leave_behind: P-52 not started. Do not compile P-52.
