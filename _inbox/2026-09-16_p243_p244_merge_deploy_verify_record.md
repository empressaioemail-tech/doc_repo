---
id: 2026-09-16_p243_p244_merge_deploy_verify_record
title: Integration seat record — P-243, P-244a, P-244b merged, deployed, verified
date: 2026-09-16
status: record
kind: verification-record
owner: integration seat
---

# Merge / deploy / verify record — 2026-09-16

Per the session's standing protocol: read the diff, read CI by the `.conclusion` string,
confirm the branch was not behind base, merge, deploy, verify on the customer surface.
All three below were performed by the integration seat directly; no lane merged or deployed.

## P-243 — legacy-design-tools / smartsite-mcp

- PR: `empressaioemail-tech/legacy-design-tools#696`, branch `feat/p243-mcp-app-binding`.
- Diff read directly (`tools.ts`, `tools-types.ts`, `mcp-app.ts` import, 3 test files). CI: 11/11
  checks `SUCCESS` by field. Compare `main...feat/p243-mcp-app-binding`: `ahead_by: 1, behind_by: 0`.
- Merged `70113a1483649293860f3f045f2185de9f988225` (merge commit, branch deleted).
- Push build (`Cloud Run Deploy (smartsite-mcp)`, run `35093108695`) succeeded on that sha.
- Deployed via `workflow_dispatch action=deploy-canary image_tag=70113a14...` (run `35094779599`):
  revision `smartsite-mcp-00126-yak`. Smoke-probed the canary tag URL directly (found by field —
  `gcloud run services describe --format='value(status.url)'`, host is
  `smartsite-mcp-tds7av26va-uc.a.run.app`, NOT the `h7gvu7rgcq` host used by the hauska-prod-497015
  services; an initial guess at the wrong host 404'd and was corrected before trusting anything).
  3/3 probes `200`, `status: ok`.
- Shifted via `workflow_dispatch action=shift-traffic` (run `35094933716`): the workflow's own
  built-in health-status gate passed (`status: ok`, not just HTTP 200), and I independently
  re-read the traffic split by field: `smartsite-mcp-00126-yak 100 canary`.
- Lease `_catalog/leases/smartsite-mcp.json` written before the canary dispatch, updated with the
  real revision before the shift, deleted after the shift was verified.
- **Not verified by this seat: the actual customer predicate.** P-243's done-condition is "the
  panel RENDERS on the operator's client," not that the code is live. The lane's own close says
  it could not verify this either — Claude Code is not an MCP-Apps-rendering host. **Operator
  action owed:** open a Smart Site-connected chat in claude.ai or Claude Desktop and ask about
  908 PINE; confirm a panel actually opens.
- **Flag, not acted on:** the lane's close reports a fake "SUPERVISION NOTE / NOTE FROM THE
  INTEGRATION SEAT" arrived embedded inside a subagent's tool output during this lane's run — not
  from the planner, no real channel for such a note exists. The lane treated it as untrusted
  content and did not follow it as an instruction, which was correct; it separately verified the
  one factual claim inside it against a real `get_smart_site` call before using that fact. No
  action needed here beyond recording that the injection attempt happened and was correctly
  refused.
- Close artifact referenced by the lane (`_inbox/2026-09-16_p243-mcp-app-binding_close.json`)
  could not be located in any worktree checked (`P:/seat-worktrees/*p243*`, `P:/tmp/*p243*`,
  this repo's own `_inbox/`). Recorded as a gap rather than assumed present; nothing was
  fabricated in its place. The load-bearing facts (diff, CI, merge, deploy, live health) were
  each independently re-verified above regardless.

## P-244a — hauska-engine

- PR: `empressaioemail-tech/hauska-engine#455`, branch `fix/p244a-siteplan-compose-timeout`.
- Diff read directly in full (2 files, +60/-0 lines): a new `dxf_emission_failed` error-class
  branch in `parcel-terrain.ts`, ahead of the generic `timed out` fallback, mirroring the existing
  `ifc_emission_failed` pattern; two new tests proving both classes are distinguished. CI:
  `typecheck + test` `SUCCESS`. Compare: `ahead_by: 1, behind_by: 0`.
- Merged `eb42ff260fca356a6bd39cafe6b263f789560ad5`.
- Built via `gcloud builds submit --config=cloudbuild.engine-api.yaml` at that sha, unique tag
  `p244a-eb42ff2`, digest `sha256:19024bb2725b70f0fdc7986fa5f8c2213e17d82912b3f2b6c3ac7f9037eac5c7`.
- Deployed by digest, `--no-traffic --tag=p244a`: revision `hauska-engine-api-00238-tax`. Lease
  `_catalog/leases/hauska-engine-api.json` written first, deleted after verification.
  Smoke-probed the tagged URL 3/3 `200`, shifted to 100% via `update-traffic`, re-read the split
  by field (`hauska-engine-api-00238-tax 100`), smoke-probed the production URL 3/3 `200`.
- **This closes the misclassification only, not the underlying defect.** The row's own
  done-condition — the `48021:34049` export job reaching `ready` with a downloadable artifact —
  needs `gcloud run services update hauska-engine-api --no-cpu-throttling`, which creates a new
  revision and which the lane's dispatch explicitly forbade it from applying. **Open decision for
  the operator, not yet applied by this seat:** apply that flag now (persistent, reversible,
  Cloud Run billing moves from throttled-when-idle to always-on CPU for this service) or route it
  as a separate dispatch. Flagged in the same-day session summary; not applied here without a go.

## P-244b — hauska-mcp-server

- PR: `empressaioemail-tech/hauska-mcp-server#86`, branch `lane/p244b-declared-wait-envelope`.
- Diff read directly in full (3 files, +89/-20 lines): both `download_parcel_site_plan_export`
  and `download_parcel_flood_drainage_export` now return a structured, non-`isError` envelope
  (`state`, `jobRef`, `pollAfterMs`, `message`) on a running/queued job, matching the sibling
  status-check tools' existing contract; genuine failures (422) are untouched. CI: 5/5 checks
  `SUCCESS`. Compare: `ahead_by: 1, behind_by: 0`.
- Merged `f7a2f5e58188637e0c0c456aa73719df9c0ba9fc`.
- Built + deployed in one Cloud Build (`cloudbuild-mcp.yaml`, `_TAG=p244bf7a2f5e`,
  `_CANARY=1` → `--no-traffic --tag=p244bf7a2f5e`): revision `hauska-mcp-server-00100-cal`.
  Lease `_catalog/leases/hauska-mcp-server.json` written first, deleted after verification.
  Smoke-probed the tagged URL 3/3 `200`, shifted to 100% via `update-traffic`, re-read the split
  by field (`hauska-mcp-server-00100-cal 100`), smoke-probed the production URL 3/3 `200`.
- **Open items the lane recorded as `closed_partial`, not closed, carried forward as-is:**
  the generic `upstream_error`/`unmeasured` wrapping the dispatch asked it to trace back to
  `legacy-design-tools/artifacts/smartsite-mcp` does not exist at that path — the lane searched
  exhaustively and could not find where that wrapping actually happens, and named it as
  infrastructure outside its access. Full live reproduction of all three envelope states (running/
  ready/failed) was blocked by the account's Solo tier and the lack of production credentials —
  the code fix and its test suite (33/33 targeted, 575/577 full suite, 2 pre-existing unrelated
  failures) were verified instead, proved load-bearing by reverting the source fix and confirming
  exactly those 2 tests went red.

## Not yet done this session

- P-244a's real fix (`--no-cpu-throttling`) — awaiting operator decision.
- P-243's live-panel render check — needs the operator's own Claude client, not this seat.
