# _scratch/icc_demo

Workstream: ICC demo program (MCP + plan review + Smart Files on one done line).
Date opened: 2026-08-16.

## GROUND-TRUTH

- 2026-08-16T16:11-05: A-031 live. plan-review-00010-cey @100% tag g60f origin 5952846. UI dpl_5rjkGcE44C2FFLVhDHE7C8BUbGr5. GET / 200. GET applicant/room no token 400. Bogus token share_not_found. Unauthed /applicant 200 Applicant nav. Unauthed /icc/activity 401. HAUSKA_MCP_URL inherited. Planner POSTed zero new files or shares. Premature site-plan-sheet.txt and mcp-g60-probe.txt still listed on engagement A (read only). Rollback 00008-pol tag g60e @0%. No --apply.
- 2026-08-16T16:00-05: A-009/A-030 live. plan-review-00008-pol @100% tag g60e origin 534589d. UI dpl_GB87Rq19HMiShTRdH9sbWXKa6ixc. map-feature host=smartsite smartSiteUrl smartsite.cloud/?parcelNodeId=48021:28286. Share kind=data-room dataRoomUrl smart-files-app #share=. Unauthed BFF resolve 200 folder plan-review-48021-28286 n_files=2. Dirty hauska-map not touched. No --apply. **A-031 reverses the share host.**
- 2026-08-16T14:54-05: G-60 walk/close. MCP 00074-tar @100% g60d. plan-review 00006-duj @100% g60c. Queue total=2 A In Review B Submitted. Anon list omits icc-model-code. Anon get_atom corpus DID access-deny. query_jurisdiction icc-model-code atomCount=4966 accessPolicy=public-free. Ledger 200 computedAt=2026-08-14T17:41:22.500Z satisfiedCells=616 (nested under summary; 2,121,656 bytes). Cortex queue unauth 200 x-plan-review-proxied:1. Files 404. Observer read_smart_file tenant-private denied. F4 DID pending:plan-review:f361bc78-6feb-47e9-b594-ae5162a948fe. Close `_inbox/2026-08-16_icc_demo_close.json`.
- 2026-08-16T13:27-05: MCP PR #69 MERGED squash 0316d0a41e7c7f7dcf5a4908324d1f6d7c09ed5f. Serving hauska-mcp-server-00074-tar @100% tag g60d. Anon list_jurisdictions tenants bastrop_tx, grand_county_ut (icc-model-code omitted; before: 3 tenants including icc). Anon get_atom did:hauska:jurisdiction-corpus:icc-model-code isError access-deny no body. Reviewer key still reads entityId icc-model-code. Health retrieval ok. Anon get_property_atom_chain 48021:28286 status=ready. Store still public-free atomCount 4966. No --apply. Rollback 00072-puy tag g60 @0%.
- 2026-08-16T12:05-05: Share hotfix + escapeHtml on serving. plan-review-00006-duj @100% tag g60c. HAUSKA_MCP_URL inherited. POST share 201 store=smart-files folder folder:tenant:icc-demo:plan-review-48021-28286. Origin 8cf82e7. Vercel dpl_GKnnEH6Z38yPDfJQB9NtuX3FkwzX aliased plan-review-app-ten.vercel.app. Unauthed /icc/activity 401.
- 2026-08-16T11:45-05: Origin clean-spot. MCP PR #68 MERGED squash 12156a024223bf4ec32ce586857e7c3c496a8a3b at 2026-08-16T16:35:43Z. LDT PR #436 MERGED squash 85c5d1a8c12a4a70e81323a907ca252b802266b8 at 2026-08-16T16:45:07Z (Test conclusion success). plan-review origin main was e0c8e9d then 09a4392 atom-chain then 1a6ac83/8cf82e7.
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
- `rest.endsWith("/share")` does not match `rest === "share"`. Probe the share route with a JSON file; PowerShell `curl.exe -d "{...}"` mangles braces.
- Cloud Run `--set-env-vars` drops secrets. Use `--update-env-vars` or inherit. Confirm `HAUSKA_MCP_URL` after every deploy.
- Splicing map helpers into `app.js` ate `function escapeHtml`. `node --check web/app.js` before Vercel.
- PowerShell splits `--substitutions=_TAG=x,_CANARY=1` on the comma. Quote the whole substitutions value.
- `AtomSearchResult` has no `sourceAdapter`. ICC withhold on search uses `jurisdictionTenant` only.
- Walk `cited_atom_did = icc:ibc-2018:R311.7` is not a Hauska DID. Probe withhold on `did:hauska:jurisdiction-corpus:icc-model-code`. Do not silently rewrite the fixture.
- County ledger `computedAt` lives under `summary`. A truncated body parses as empty and looks like a missing stamp.
- Plan review owns the files UI. Smart Files is the store. Sending the applicant to smart-files-app makes plan review not the product. Planner POSTs into the files store are premature residue.

## DEAD-END

- Morning WDLL `_inbox/2026-08-16_c_wdll_lane_c_plan_review.md`: too wide (full spec 48) and too narrow (LDT housing). Do not execute.
- Morning WDLL `_inbox/2026-08-16_mcp_wdll_monetizable_tested_discoverable.md`: buyable-gate altitude (Circle, DNS, directory). Wrong for this demo. Do not execute.
- First-pass ICC WDLL that stubbed spec 48 functions. Operator rejected. Do not re-stub.

## OPEN

- G-60 CLOSED_ON_DEMO_PATH 2026-08-16 plus A-031. Close `_inbox/2026-08-16_icc_demo_close.json`. Files UI + applicant view on plan-review. Token-room after reviewer share still owed for WDLL 13.
- Store UPDATE (G-30 / G-17 existing atoms) and F4 engine ingest remain residuals. MCP read-path withhold is live on 00074-tar.
- E6 from a clean hauska-map worktree is superseded by A-009: live SmartSite embed.
- L26 still holds `--apply`. No second writer. IPMC `--apply` not this card.
- G-58b DROP still OPEN. Do not do it here.
- Nested `/engagements/:id/findings` is 501 leftover. F5 path is global `/findings?sectionId=`.
