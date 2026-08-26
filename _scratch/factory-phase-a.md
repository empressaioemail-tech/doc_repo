# factory-phase-a

OPEN: Phase A in flight. Property product writes at P:/seat-worktrees/property/hauska-factory and hauska-map/apps/factory. Inbox artifacts in P:/doc_repo, uncommitted.

GROUND-TRUTH (2026-08-26T19:12Z): gh repo view empressaioemail-tech/hauska-factory exists private created 2026-08-26T15:50:05Z. Property worktree 3653f12 on seat/property. README only.

GROUND-TRUTH (2026-08-26T19:12Z): P:/doc_repo main 5504c00. Hook seat integration. Dispatch seat property.

GROUND-TRUTH (2026-08-26T19:15Z): gcloud run jobs list us-east4 = 0 items on hauska-prod-497015 and legacy-design-tools-prod. First job is this card.

GROUND-TRUTH (2026-08-26T19:15Z): No hauska-factory Neon project. cortex-prod fancy-fire-06136146 ~252 GB. smartcity-os-prod is no-touch.

GROUND-TRUTH (2026-08-26T19:16Z): county dump quotes 667/3556 computedAt 2026-08-25T23:40:18.231Z. Dump does not embed all cells.

LESSON: WDLL item 19 777 unprobed is wrong against texas_roster_v1.json. Measured 735 unprobed / 488 probed / 1223 total. Grade the roster.

LESSON: LDT scorers do not refuse pooler. Factory connect must refuse, not strip-and-continue.

DEAD-END: do not COPY Texas landing tables from the laptop. Ingest freeze. Cloud Run us-east4 only.

OPEN: item 7 needs live GET /api/county-ledger for the full 3556 cells; dump is quotes + watch sample.

OPEN: defect seed 71 rows (V1-V15 + M1-M38 + 11 F-10 + T1.1-T1.7), none closed.

GROUND-TRUTH (2026-08-26T19:20Z): Neon MCP create_project defaulted to aws-us-west-2 project delicate-lake-78875790 named hauska-factory. neon CLI create --region-id aws-us-east-1 failed (fetch failed, no NEON_API_KEY). Schema applied. Pooler refused in code. Direct host ep-frosty-mouse-a6it44xf.us-west-2.aws.neon.tech.

GROUND-TRUTH (2026-08-26T19:22Z): snapshot run e178f968 rtt_ms=457 (prediction was under 5 ms). Region is the cause, not the connect path.

GROUND-TRUTH (2026-08-26T19:22Z): seed holds=17 defects=71 cities=1223 cityRails=8561 unprobed=735. Roster 777 was wrong.

GROUND-TRUTH (2026-08-26T19:23Z): hold refuse run 026b2c31 refuse_code hold:Footprint apply bbox...

GROUND-TRUTH (2026-08-26T19:24Z): landing UPDATE and empty class refuse live on Factory store.

LESSON: per-row INSERT of 1,223 cities to a distant Neon host hung. Batch VALUES.

DEAD-END: do not use Neon MCP create_project when region matters. It has no region field and landed us-west-2.

OPEN: recreate Neon project in aws-us-east-1; delete west-2 empty leftover after cutover.
GROUND-TRUTH (2026-08-26T19:26:43Z): factory-snapshot-nbv69 succeeded us-east4. Run ea7c3dc6 fields written. rtt_ms=1077. image digest sha256:df0268b203b149420b2a09b42b43ce40248fc23df3c8a94e42fcae502f30c36e. Recorded IMAGE_DIGEST was the tag.

LESSON: PowerShell splits --set-secrets on comma unless quoted.

LESSON: Cloud Run job SA 172690833726-compute@developer.gserviceaccount.com needs secretAccessor on each secret or deploy fails.
OPEN: Texas landing copies, live county-ledger import, Vercel console, CC publish, us-east4 job execute.
OPEN: west-2 project delicate-lake-78875790 is leave_behind until deleted.

GROUND-TRUTH (2026-08-26T19:36:27Z): Cloud Build 7da0f88d SUCCESS. Image c36c1f5 digest sha256:ae25421ac6a0bcd89369bddc14f9b729eae7295ab50f6db90942b0770e0c92f4.

GROUND-TRUTH (2026-08-26T19:39:57Z): factory-snapshot-rmmnm succeeded. Job image and IMAGE_DIGEST are the digest ref, not a tag. Run 59f00cde scope.image_digest_env == scope.image_digest_execution == image_digest. rtt_ms=555 on west-2. Termination recorded.

GROUND-TRUTH (2026-08-26T19:40Z): NEON_API_KEY unset. neon 2.22.0 projects list still ERROR: fetch failed. No NEON_API_KEY in Secret Manager. East-1 create blocked. Items 6/7/20 not run against west-2.

LESSON: Cloud Build that deploys --image=${_IMAGE}:$COMMIT_SHA fails item 2 even when the later run row is right. Pin --image and IMAGE_DIGEST to fully_qualified_digest.

GROUND-TRUTH (2026-08-26T19:36:40Z): hauska-factory PR #1 CI conclusion SUCCESS (two CheckRun strings). Branch seat/property at 1284c8b after cloudbuild digest-pin fix.

OPEN: operator must set NEON_API_KEY, then create aws-us-east-1, swap FACTORY_DATABASE_URL (direct host), migrate, seed, re-run item 2 for the under-5ms prediction.

GROUND-TRUTH (2026-08-26T19:54Z): User env NEON_API_KEY length 69 prefix napi_. neon CLI still fetch-failed. REST GET /api/v2/projects worked.

GROUND-TRUTH (2026-08-26T19:55Z): REST POST created withered-surf-26870298 name hauska-factory region aws-us-east-1 pg 18. Direct host ep-round-base-au0jofwp.c-10.us-east-1.aws.neon.tech (pooler=false). FACTORY_DATABASE_URL secret version 2.

GROUND-TRUTH (2026-08-26T19:56:17Z): east-1 counts holds=17 defects_open=71 cities=1223 rails=8561 unprobed=735. west-2 same counts at 19:56:20Z. Match.

GROUND-TRUTH (2026-08-26T19:56:46Z): factory-snapshot-p8skf run faa20383 on east-1. rtt_ms=144. Digest match both derivations. Prediction under 5 ms failed. Cause is no longer region; TCP+TLS from us-east4 to Neon east-1 is 144 ms.

GROUND-TRUTH (2026-08-26T19:57Z): west-2 delicate-lake-78875790 DELETE then GET 404. Retire run 63f63371 on east-1.

LESSON: neon 2.22.0 on this Windows box fails even with a valid NEON_API_KEY. Invoke-RestMethod against console.neon.tech/api/v2 works. Do not treat CLI fetch-failed as a missing-key verdict when REST succeeds.

DEAD-END: Neon MCP create_project still has no region_id. REST project.region_id is the create path.

OPEN: items 6, 7, 11 service, 12-15 Vercel, 14 Bexar job, 20 CC publish. Store is east-1.
