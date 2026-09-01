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

GROUND-TRUTH (2026-08-26T20:26:47Z): factory-snapshot-lmpfx run 07283063 connect_ms=773 query_rtt_p50_ms=5. Under-5ms query prediction failed. 5 is not under 5. Not far above 5.

GROUND-TRUTH (2026-08-26T20:29:21Z): landing tx_city_boundary 1222=1222 unknown vintage. Run 01357975.

GROUND-TRUTH (2026-08-26T20:30:16Z): manifest-import-n2x8c run 33dbdabf county_rail=3556 county_manifest=254. Live GET 667/3556 computedAt 2026-08-26T20:30:14.362Z. Dump computedAt 2026-08-25T23:40:18.231Z. Watch displayState diffs 0. Dump does not embed 3556 cells.

GROUND-TRUTH (2026-08-26T20:33:36Z): bexar-edges-rwfh7 run 005e9419 links=660000 rewritten=660000 total=703257.

GROUND-TRUTH (2026-08-26T20:34:33Z): landing tx_special_district 2775=2775. Run 6d4c46f5.

GROUND-TRUTH (2026-08-26T20:37:26Z): landing tx_utility_territory_staging 10196=10196. Run 8750f5ab.

GROUND-TRUTH (2026-08-26T20:37:29Z): cc-publish-6nznt run 51d0409b servingPublishedAt=2026-08-26T20:37:29.076Z. Live GET carries published_at. Shape otherwise unchanged.

GROUND-TRUTH (2026-08-26T20:37:59Z): factory-missing-env-8vhxv exit 1 MISSING_ENV FACTORY_CONTROL_API_KEY. Unauth GET /health 401 {"error":"UNAUTHENTICATED"}.

GROUND-TRUTH (2026-08-26T20:39:28Z): console-audit differences []. Console https://smart-site-factory.vercel.app from worktree P:/seat-worktrees/property/hauska-map-factory. /site is the F-07 placeholder.

GROUND-TRUTH (2026-08-26T20:32:04Z): hauska-factory PR #2 CheckRun conclusion SUCCESS.

OPEN: item 6 remaining tables (FEMA factory-landing-import-5t46m in flight; then parcels, cad, wells, pipelines, footprints). Item 19 still open.

GROUND-TRUTH (2026-08-26T21:09:56Z): FEMA landing 198178=198178 defaulted_provenance=0 run 71b7cc01 execution factory-landing-import-5t46m.

GROUND-TRUTH (2026-08-26T20:28:27Z): factory-landing-import-knl7d exit 1 MODULE_NOT_FOUND Cannot find module '/app/src/cli.mjs landing-import'. Unquoted PowerShell --args joined the two argv.

GROUND-TRUTH (2026-08-26T22:30:28Z): GET https://cortex-api-tds7av26va-uc.a.run.app/api/county-ledger has no published_at. Job factory-cc-publish-6nznt wrote Factory county_ledger_published and neondb.county_ledger_snapshot. GET handler is countyLedger.ts router.get and does not read that table.

GROUND-TRUTH (2026-08-26T22:43Z): hauska-map commits/b959886/check-runs total_count=0 after push, #223 reopen, and #224. Factory PR #3 CheckRun test conclusion SUCCESS. PR #223 CLOSED. PR #224 OPEN draft.

GROUND-TRUTH (2026-08-26T22:40Z): five landing jobs started on image f66dbe99: pipeline-mrxbd wells-9f846 cad-dq7md footprint-ppdgr parcel-wqdzv.

OPEN: item 6 five copies in flight. Item 20 not-met. Map PR 224 waiting on Actions.

DEAD-END: do not treat a GET that once appeared to carry published_at as the served contract. The route source is the second derivation.

LESSON: 144 ms and 773 ms are TLS connect. query_rtt_p50_ms on the same connection is 5.

LESSON: PowerShell splits gcloud --args on commas unless the whole list is quoted.

DEAD-END: do not git switch P:/seat-worktrees/property/hauska-map. It carries PE pricing dirty files. Console lives on hauska-map-factory / seat/property-factory.

GROUND-TRUTH (2026-08-26T23:10Z planner): Phase A close ACCEPTED as honest partial. Map PR #224 green 22:49Z, merged be8b7eb 22:57Z. Item 20 not-met routed to F-05 LDT. pipeline-mrxbd and wells-9f846 completed unread at close.

GROUND-TRUTH (2026-08-26T23:47Z first drain handback, import_ledger): pipeline 491178=491178 run ccd8af7c; wells 1396049=1396049 run 2579a562; cad 8021862=8021862 run d474c4b9; footprint 10674975=10674975 run 3a24692d. parcel-wqdzv still running. unknown_fields vintage+adapter_version declared.

GROUND-TRUTH (2026-08-26T23:46Z): key rotation run 0fdaf217. factory-control-00002-gjr @100%. Vercel VITE_FACTORY_CONTROL_API only. Console bundle live 401. Map PR #226 3c447de removes the VITE key binding.
