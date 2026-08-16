# _scratch/icc_demo

Workstream: ICC demo program (MCP + plan review + Smart Files on one done line).
Date opened: 2026-08-16.

## GROUND-TRUTH

- 2026-08-16T11:45-05: Origin clean-spot. MCP PR #68 MERGED squash 12156a024223bf4ec32ce586857e7c3c496a8a3b at 2026-08-16T16:35:43Z. LDT PR #436 MERGED squash 85c5d1a8c12a4a70e81323a907ca252b802266b8 at 2026-08-16T16:45:07Z (Test conclusion success). plan-review origin main e0c8e9d pushed. Serving already matched these SHAs before merge.
- 2026-08-16T11:33-05: Cortex remount live. Serving cortex-api-00519-muq @100% tag g60. Prod GET /api/plan-review/queue 200 x-plan-review-proxied:1 plan-review fixtures total=2. Files still 404. Ledger 200 satisfiedCells=616. Image sha256:d20815fe45e45306ce1d08d127ba00dde0f21b0bc265282067a26d72fa7eb679. LDT PR https://github.com/empressaioemail-tech/legacy-design-tools/pull/436. Dirty feat/s1-instrument-hardening untouched. Residual: queue shape is buckets not BFF QueueRow[].
- 2026-08-16T11:20-05: MCP PR https://github.com/empressaioemail-tech/hauska-mcp-server/pull/68 opened. CI build-test + four gate greps SUCCESS. Serving already 00072-puy from this branch.
- 2026-08-16T11:02-05: MCP serving hauska-mcp-server-00072-puy @100% tag g60. Tools 82 = 13/9/53/7. Health retrieval ok no 404. Cotality extinguished. Codex tools hit plan-review-00003-ws8. icc_activity_list live. Keys reviewer fda41e99-190b-4d8e-abe8-3048f1e9a1d6 observer 5f180044-f15c-4800-82da-d281a424aab3. Worktree P:\hauska-mcp-server-worktrees\g60-codex-plan-review branch g60/codex-plan-review.
- 2026-08-16T10:47-05: Vercel project plan-review-app prj_zn2fPbov1Egj8hyym8Qu3HTKixQJ dpl_AgkR2g68VF3J5V4FwpdKNqCjSvjs production https://plan-review-app-ten.vercel.app. Unauthed GET /icc/activity 401. Queue total=2 Submitted=2. Global alias plan-review-app.vercel.app taken, not ours. Env four keys only.
- 2026-08-16T10:45-05: A-027 plan-review is Smart Files first product consumer. Cloud Run plan-review-00002-nbr. Intake 201 folder folder:tenant:icc-demo:plan-review-48021-28286. Upload smartfile:tenant:icc-demo:site-plan-sheet.txt. dataroom-atoms store=smart-files. Files smart-files-00004-npd.
- 2026-08-16 later: Operator correction. Plan review must be functionally complete (not a stub). MCP must be finished (not an ICC allowlist toy). Those two combined equal ICC. Portal is where ICC sees their activity (`/icc/activity`). First-pass F10 reversed (A-003). Second fixture parcel `48021:27303` for F5.
- 2026-08-15: Smart Files isolation G-58 CLOSED serving path. G-59 QA rooms CLOSED serving path. Write MCP tools were OPEN; this program absorbs them. Cortex `/api/smart-files` 404 unmounted. Files URL `https://smart-files-padrd77ava-ue.a.run.app`. QA UI `https://smart-files-app.vercel.app`.
- 2026-08-16 morning MCP probe: `/health` 200, retrieval dependency `state=ok` `detail=HTTP 404` (health lie). Anon initialize 200. `mcp.hauska.dev` NXDOMAIN. Cursor `user-hauska-cortex` in error.
- 2026-07-29 ICC verify: IBC sections ingested; IPMC 0; G-30 public-free hardcode live; meter exists rate null; actor ref heuristic; fixture `did:hauska:actor:org:icc`. Re-count before quoting.

## LESSON

- Spec 48 F2 still names Cotality. Wrapping it as an MCP tool advertises a dead dependency.
- Smart Files org list is tenant-scoped. `empressa/reviewer` + `icc/observer` would hide the room. Personas must share `icc-demo`.
- GFE on `*.run.app` intercepts exact `/healthz`. Probe `GET /`.
- Deleting 46 reporting tools strands PE/CC. Dead ends = fail-close + allowlist, not registry amputation.
- A one-engagement meter pane is not an ICC activity portal.
- "Basic UI" means housing/visual, not cutting F5/F6/F7/map/letter.
- Vercel project name is the housing lock. The `*.vercel.app` short alias can already be taken globally (`plan-review-app.vercel.app` was). Grade the project name, then record the actual production URL.

## DEAD-END

- Morning WDLL `_inbox/2026-08-16_c_wdll_lane_c_plan_review.md`: too wide (full spec 48) and too narrow (LDT housing). Do not execute.
- Morning WDLL `_inbox/2026-08-16_mcp_wdll_monetizable_tested_discoverable.md`: buyable-gate altitude (Circle, DNS, directory). Wrong for this demo. Do not execute.
- First-pass ICC WDLL that stubbed spec 48 functions. Operator rejected. Do not re-stub.

## OPEN

- G-30 code fix slot-free. Bounded ICC UPDATE only when L26 `--apply` is not live. E6 map from a clean hauska-map worktree. Origin PRs merged (MCP #68, LDT #436, plan-review e0c8e9d).
- L26 still holds `--apply`. G-30 bounded UPDATE waits if a drain is live. IPMC `--apply` not this card.
- G-58b DROP still OPEN. Do not do it here.
