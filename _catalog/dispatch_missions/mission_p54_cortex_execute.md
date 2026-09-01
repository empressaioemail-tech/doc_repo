Planner execute for P-54 cortex. You commit by pathspec in the isolated LDT worktree only. You MAY open the PR, merge on CI conclusion success, canary, shift traffic, and probe. You MUST NOT occupy P:/legacy-design-tools. You MUST NOT image_tag=latest. You MUST NOT vercel. You MUST NOT flip texas-rrc. You MUST NOT atoms --apply. You MUST NOT start P-52. PE card is a later spawn.

Worktree: P:/legacy-design-tools-worktrees/serve-p54 branch serve-p54 HEAD d9c04f06339c0537b3ae5910dd45f6a61b0e2116 plus uncommitted ownerFactRead.ts, ownerFactRead.test.ts, brokerageNodeFacets.ts, brokerageNodeFacets.test.ts.

WDLL: `_inbox/2026-08-22_serve_ident_qa_WDLL.md` item 7. Review ACCEPT `_inbox/2026-08-22_serve-p54_planner_review.json`. Playbook `_inbox/2026-08-21_s1-deploy-prep_playbook.json`. Scout close `_inbox/2026-08-22_serve-p54_close.json`.

## Commit and PR

Pathspec only those four files. Commit message: `fix(inspect): ownerFact from owner-fact atoms, identified session only`. Push and `gh pr create` on empressaioemail-tech/legacy-design-tools. Body cites P-54 and WDLL item 7.

L17: the refuse probe already uses lowercase `from cad_property`. Do not add `FROM cad_property`. Do not add `CAD_PROPERTY_MULTI_YEAR_INVENTORY`. If L17 fails, keep the throw and change only the token.

## Merge and image

Merge only when Typecheck, Test, and L17 check-run **conclusion** strings are `success`. Not `gh pr checks` wording. After merge, wait for job **Build & push image** conclusion `success` on the **landed main-push SHA**. That full SHA is `image_tag`. Never `latest`. Never the open-PR merge ref.

## Canary then 100%

`gh workflow run "Cloud Run Deploy (cortex-api)" --repo empressaioemail-tech/legacy-design-tools --ref main -f action=deploy-canary -f image_tag=<FULL_SHA>`

gcloud `--format=json`. Traffic percent by field name. Digest from the new revision, not `latestReadyRevisionName`. Confirm `ATOMS_DATABASE_URL` is mounted. Canary URL: `https://canary---cortex-api-tds7av26va-uc.a.run.app`

Probe canary first. Then shift-traffic only if anonymous gold matches. Then confirm serving revision @100% is the new one.

## Live GET (field names)

Gold `https://cortex-api-tds7av26va-uc.a.run.app/api/brokerage/v1/place/node/48021%3A34137/facets`

Anonymous (no Authorization): must have `ownerFact.state=refused` `code=identified-session-required` `source=owner-fact`. Must NOT have `ownerName` or mailing. Must NOT be present. Pipeline on gold stays present-outside (P-49). wellFact on gold stays atom-miss (P-50). buildingFootprintFact on gold stays atom-miss (P-51). boundaryEdgeFact on gold stays present `property-boundary-edge` role=front (P-53).

Identified: only if you can mint a session Bearer from the existing `verifySessionToken` / session-token test helper without printing `SESSION_SECRET` and without inventing Clerk/Stripe. Then gold must be `ownerFact.state=present` `source=owner-fact` `entityId=48021:34137:2025` `taxYear=2025`. Never treat `X-Hauska-Key` / operator key as identified. If you cannot mint a session without printing a secret, file identified live GET as leave_behind for PE. Do not skip the anonymous probe.

Do not paste a live ownerName or mailing into the execute JSON. Redact.

## Return

File `_inbox/2026-08-22_p54_cortex_execute.json` with PR number, merge SHA, CI conclusion strings, Build & push run, image_tag, revision name, digest, traffic percent by field name, anonymous gold GET ownerFact fields, HTTP status, and identified GET if you ran it. leave_behind: PE card with paired anonymous vs identified smartsite.cloud probes. Do not compile PE yourself. Do not start P-52.
