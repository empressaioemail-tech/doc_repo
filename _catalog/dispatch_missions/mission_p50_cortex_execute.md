Planner execute for P-50 cortex. You commit by pathspec in the isolated LDT worktree only. You MAY open the PR, merge on CI conclusion success, canary, shift traffic, and probe. You MUST NOT occupy P:/legacy-design-tools. You MUST NOT image_tag=latest. You MUST NOT vercel. You MUST NOT flip texas-rrc. You MUST NOT atoms --apply. You MUST NOT wells apply. You MUST NOT start P-51. PE card is a later spawn.

Worktree: P:/legacy-design-tools-worktrees/serve-p50 branch serve-p50 HEAD ae6bdea9 plus uncommitted wellFactRead.ts, wellFactRead.test.ts, brokerageNodeFacets.ts, brokerageNodeFacets.test.ts.

WDLL: `_inbox/2026-08-22_serve_ident_qa_WDLL.md` item 4. Review ACCEPT `_inbox/2026-08-22_serve-p50_planner_review.json`. Playbook `_inbox/2026-08-21_s1-deploy-prep_playbook.json`.

## Commit and PR

Pathspec only those four files. Commit message: `fix(inspect): wellFact from well-fact atoms`. Push and `gh pr create` on empressaioemail-tech/legacy-design-tools. Body cites P-50 and WDLL item 4.

L17: the refuse probe already uses lowercase `from cad_property`. Do not add `FROM cad_property`. Do not add `CAD_PROPERTY_MULTI_YEAR_INVENTORY`. If L17 fails, keep the throw and change only the token.

## Merge and image

Merge only when Typecheck, Test, and L17 check-run **conclusion** strings are `success`. Not `gh pr checks` wording. After merge, wait for job **Build & push image** conclusion `success` on the **landed main-push SHA**. That full SHA is `image_tag`. Never `latest`. Never the open-PR merge ref.

## Canary then 100%

`gh workflow run "Cloud Run Deploy (cortex-api)" --repo empressaioemail-tech/legacy-design-tools --ref main -f action=deploy-canary -f image_tag=<FULL_SHA>`

gcloud `--format=json`. Traffic percent by field name. Digest from the new revision, not `latestReadyRevisionName`. Confirm `ATOMS_DATABASE_URL` is mounted. Canary URL: `https://canary---cortex-api-tds7av26va-uc.a.run.app`

Probe canary first. Then shift-traffic only if gold atom-miss matches. Then confirm serving revision @100% is the new one.

## Live GET (field names)

Gold `https://cortex-api-tds7av26va-uc.a.run.app/api/brokerage/v1/place/node/48021%3A34137/facets`

Must have `wellFact.state=refused` `code=atom-miss` `source=well-fact`. Must NOT invent `apiNumber14`, `:none`, or a well. Pipeline field on gold stays present-outside (do not break P-49).

Substitute `.../48103%3A100/facets`

If HTTP 404, that is a bake miss. Quote status. Do not treat as a well miss. Gold atom-miss still stands. Named hole for PE.

If HTTP 200: `wellFact.state=present` `source=well-fact` `entityId=48103:100:42000001030000` `parcelRelation=on-parcel` `apiNumber14=42000001030000` `operatorName` null.

## Return

File `_inbox/2026-08-22_p50_cortex_execute.json` with PR number, merge SHA, CI conclusion strings, Build & push run, image_tag, revision name, digest, traffic percent by field name, both GET bodies' wellFact fields, HTTP statuses. leave_behind: PE card. Do not compile PE yourself. Do not start P-51.
