Planner execute for P-53 cortex. You commit by pathspec in the isolated LDT worktree only. You MAY open the PR, merge on CI conclusion success, canary, shift traffic, and probe. You MUST NOT occupy P:/legacy-design-tools. You MUST NOT image_tag=latest. You MUST NOT vercel. You MUST NOT flip texas-rrc. You MUST NOT atoms --apply. You MUST NOT start P-52 / P-54. PE card is a later spawn.

Worktree: P:/legacy-design-tools-worktrees/serve-p53 branch serve-p53 HEAD 1a0701f9 plus uncommitted boundaryEdgeFactRead.ts, boundaryEdgeFactRead.test.ts, brokerageNodeFacets.ts, brokerageNodeFacets.test.ts.

WDLL: `_inbox/2026-08-22_serve_ident_qa_WDLL.md` item 6. Review ACCEPT `_inbox/2026-08-22_serve-p53_planner_review.json`. Playbook `_inbox/2026-08-21_s1-deploy-prep_playbook.json`. Scout close `_inbox/2026-08-22_serve-p53_close.json`.

## Commit and PR

Pathspec only those four files. Commit message: `fix(inspect): boundaryEdgeFact from property-boundary-edge atoms`. Push and `gh pr create` on empressaioemail-tech/legacy-design-tools. Body cites P-53 and WDLL item 6.

L17: the refuse probe already uses lowercase `from cad_property`. Do not add `FROM cad_property`. Do not add `CAD_PROPERTY_MULTI_YEAR_INVENTORY`. If L17 fails, keep the throw and change only the token.

## Merge and image

Merge only when Typecheck, Test, and L17 check-run **conclusion** strings are `success`. Not `gh pr checks` wording. After merge, wait for job **Build & push image** conclusion `success` on the **landed main-push SHA**. That full SHA is `image_tag`. Never `latest`. Never the open-PR merge ref.

## Canary then 100%

`gh workflow run "Cloud Run Deploy (cortex-api)" --repo empressaioemail-tech/legacy-design-tools --ref main -f action=deploy-canary -f image_tag=<FULL_SHA>`

gcloud `--format=json`. Traffic percent by field name. Digest from the new revision, not `latestReadyRevisionName`. Confirm `ATOMS_DATABASE_URL` is mounted. Canary URL: `https://canary---cortex-api-tds7av26va-uc.a.run.app`

Probe canary first. Then shift-traffic only if gold present matches. Then confirm serving revision @100% is the new one.

## Live GET (field names)

Gold `https://cortex-api-tds7av26va-uc.a.run.app/api/brokerage/v1/place/node/48021%3A34137/facets`

Must have `boundaryEdgeFact.state=present` `source=property-boundary-edge` `entityId=48021:34137:boundary:2` `role=front` and four edges. Geometry from the atom body. Must NOT copy `txgio_parcel` / bake ring / GIS outline onto this field. Pipeline on gold stays present-outside (P-49). wellFact on gold stays atom-miss (P-50). buildingFootprintFact on gold stays atom-miss (P-51).

Confirmatory optional: `.../48021%3A28286/facets`. If HTTP 404, quote `not_baked`. If HTTP 200, `boundaryEdgeFact.source=property-boundary-edge`.

## Return

File `_inbox/2026-08-22_p53_cortex_execute.json` with PR number, merge SHA, CI conclusion strings, Build & push run, image_tag, revision name, digest, traffic percent by field name, gold GET boundaryEdgeFact fields, HTTP status. leave_behind: PE card. Do not compile PE yourself. Do not start P-52 / P-54.
