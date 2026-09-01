Planner execute for P-49 cortex. You commit by pathspec in the isolated LDT worktree only. You MAY open the PR, merge on CI conclusion success, canary, shift traffic, and probe. You MUST NOT occupy P:/legacy-design-tools. You MUST NOT image_tag=latest. You MUST NOT vercel. You MUST NOT flip texas-rrc. You MUST NOT atoms --apply. You MUST NOT start P-50. PE card is a later spawn.

Worktree: P:/legacy-design-tools-worktrees/serve-p49 branch serve-p49. Uncommitted: pipelineFactRead.ts, pipelineFactRead.test.ts, brokerageNodeFacets.ts, brokerageNodeFacets.test.ts.

WDLL: `_inbox/2026-08-22_serve_ident_qa_WDLL.md` item 2. Review ACCEPT `_inbox/2026-08-22_serve-p49_planner_review.json`. Playbook `_inbox/2026-08-21_s1-deploy-prep_playbook.json`.

## Commit and PR

Pathspec only those four files (plus tests). Commit message: `fix(inspect): pipelineFact from rrc-pipeline-fact atoms`. Push and `gh pr create` on empressaioemail-tech/legacy-design-tools. Body cites P-49 and WDLL item 2.

## Merge and image

Merge only when Typecheck and Test check-run **conclusion** strings are `success`. Not `gh pr checks` wording. After merge, wait for job **Build & push image** conclusion `success` on the **landed main-push SHA**. That full SHA is `image_tag`. Never `latest`. Never the open-PR merge ref.

## Canary then 100%

`gh workflow run "Cloud Run Deploy (cortex-api)" --repo empressaioemail-tech/legacy-design-tools --ref main -f action=deploy-canary -f image_tag=<FULL_SHA>`

gcloud `--format=json`. Traffic percent by field name. Digest from the new revision, not `latestReadyRevisionName`. Confirm `ATOMS_DATABASE_URL` is mounted. Canary URL: `https://canary---cortex-api-tds7av26va-uc.a.run.app`

Probe canary first. Then shift-traffic only if both parcels match expect. Then confirm serving revision @100% is the new one.

## Live GET (field names)

Gold `https://cortex-api-tds7av26va-uc.a.run.app/api/brokerage/v1/place/node/48021%3A34137/facets`

Must have `pipelineFact.state=present` `source=rrc-pipeline-fact` `entityId=48021:34137` `nearPipeline=false`. `t4permit` null. Must NOT invent ENERGY TRANSFER.

Nearby `.../48021%3A10048/facets`

If HTTP 404, that is a bake miss. Quote status. Do not treat as pipeline miss. Item 2 can still met on gold if gold is present-outside. Nearby then stays a named hole for PE.

If HTTP 200: `pipelineFact.state=present` `nearPipeline=true` `t4permit=05781` `operatorName=ENERGY TRANSFER COMPANY`.

## Return

File `_inbox/2026-08-22_p49_cortex_execute.json` with PR number, merge SHA, CI conclusion strings, Build & push run, image_tag, revision name, digest, traffic percent by field name, both GET bodies' pipelineFact fields, HTTP statuses. leave_behind: PE card. Do not compile PE yourself.
