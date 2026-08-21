# R-09 finish scratch (property seat)

## OPEN
- Non-dry recompute from R-09 revision is operator-owned (shared snapshot). Traffic shift is operator-owned. DC-4/DC-5 vs derivation-indeterminate is an OPS-16 question.

## GROUND-TRUTH (session start)
- Cursor checkout: `P:/doc_repo` `main` `1ff4040f42d00318ad21d93001faa92b7f3d912a` (hook: integration). Operator assigned this session as property executor.
- Property LDT: `P:/seat-worktrees/property/legacy-design-tools` `seat/property` `164378da2b09c68e8c1797e7b796538aae39dd4f`.
- Dispatch: `_dispatches/2026-08-21_r09-finish_dispatch.md` PLAN-ROW R-09. Shared LDT checkout not touched.

## GROUND-TRUTH (2026-08-21T13:03:32Z traffic JSON + GET control)
- `status.traffic[]`: 100% `cortex-api-00522-row`; `cortex-api-00524-pit` tag=canary no percent (zero). `latestReadyRevisionName=cortex-api-00524-pit` (not serving). `timeoutSeconds=300`.
- Canary GET and prod GET both http=200 size=2121675 `computedAt=2026-08-21T12:48:59.242Z`. 3556 cells, hasWriter true all, atomFamilyState present all, isPartial false all. SHA256 differs only because `servedAt` is stamped at read. No negative sample on either read.

## DEAD-END
- Do not send `dryRun` in the JSON body. `firstQueryValue` only reads the query string. Body flag is silently ignored and starts a real recompute.
- Do not read serving revision from `gcloud --format="value(...)"` semicolon columns. Use `--format=json` `status.traffic[]` or the request log `resource.labels.revision_name`.
- Node fetch to the canary POST failed in 143ms (`TypeError: fetch failed`). curl.exe worked. Do not retry node fetch.
- Do not treat `latestReadyRevisionName` or a new canary revision name as R-09. Pin `spec.containers[0].image` digest and its Artifact Registry tag. 00524-pit is 1a55566b, not 4a52dee1.
- Do not dispatch deploy-canary with `image_tag=latest` while build-and-push for that SHA is still running. latest moves when the push finishes; the revision freezes the digest it started with.

## GROUND-TRUTH (2026-08-21T13:10:08Z dryRun probe=skip on 00524-pit)
- HTTP 200, dryRun true, applied false, store computedAt unmoved at 2026-08-21T12:48:59.242Z, cells.changed=0.
- After GET computedAt still 12:48:59.242Z.
- Image on 00524-pit: sha256:c88c0330 tag 1a55566b (2026-08-20). R-09 image sha256:fb022229 tags 4a52dee1 + latest, pushed 12:36:15Z, seven seconds after canary deploy completed.

## LESSON
- Push to main builds the image. workflow_dispatch deploy-canary deploys inputs.image_tag (default latest) and does not wait for that push. A canary created in the build window is a new revision of the previous image. Pin the git SHA tag.

## GROUND-TRUTH (2026-08-21T13:18:54Z dryRun probe=skip on 00525-bev)
- Image sha256:fb022229 tag 4a52dee1. HTTP 200, applied false, store unmoved at 12:48:59.242Z.
- delta.cells.changed=3066/3556. easement 254, geometry 254, zoning 18, envelope 0. revision_name=cortex-api-00525-bev trace 0262057411da0ffef0efe2b538ebf147.
- After GET still hasWriter true 3556/3556. Served surface unchanged.

## LESSON
- DC-4/DC-5 count displayState no-atom/no-writer. applyDerivationIndeterminateOverlay then stamps derivation-indeterminate on engine-script rails, so those DCs may still read zero after R-09 compute. Indicator fields fire; the DC strings may not.
