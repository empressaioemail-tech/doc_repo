You MUST NOT spawn sub-agents. Do not git add / commit / push. Do not deploy. Do not gcloud run deploy / services update / services replace-traffic. Do not gh workflow run. Do not atoms --apply. Do not Harris PBF. Do not touch P:/legacy-design-tools.

Plan row P-08. Occupancy: gh + gcloud READ + doc_repo spec only.

WDLL: P:/doc_repo/_inbox/2026-08-21_sellable_WDLL.md item 3.

## Mission

Prepare the cortex-api deploy of LDT PR 449 so the planner can execute it after CI `success` on the conclusion STRING (not `gh pr checks` printing pass).

PR: https://github.com/empressaioemail-tech/legacy-design-tools/pull/449
Repo: empressaioemail-tech/legacy-design-tools
Serving today: cortex-api-00527-yic @100% project legacy-design-tools-prod region us-central1 URL https://cortex-api-tds7av26va-uc.a.run.app
Never image_tag=latest. Read gcloud as JSON by field name. Digest on the revision, not the tag.

1. Poll PR 449 until Typecheck and Test have conclusion strings, or 25 minutes. File the SHA that those conclusions belong to. A typecheck fix may land after 682d56f1; the SHA you pin is HEAD of s1-flood-inspect at close, not the SHA in this paragraph.

2. File `_inbox/2026-08-21_s1-deploy-prep_playbook.json`: exact `gh workflow run` for Cloud Run Deploy (cortex-api) `deploy-canary` with `image_tag=<sha>`, then smoke canary URL, then `shift-traffic` 100%. Include the live GET: `GET /api/brokerage/v1/place/node/48021%3A34137/facets` expecting floodHazardFact.state=present floodZone=X and tier2.flood null. Name ATOMS_DATABASE_URL as required on the revision (secret already created in legacy-design-tools-prod; workflow yaml on the PR adds it to --set-secrets).

3. Do not execute any of those commands. Bypass of this lane is the planner running them.

## Return

CP1/CP2/CLOSE plus the playbook. leave_behind: planner executes canary then traffic then live GET.
