---
id: 2026-09-16_texas_scaleup_ROADMAP
title: Texas scale-up roadmap, done and left (living)
date: 2026-09-16
last_updated: 2026-09-17 (12:40Z, P-297/P-299/P-258 deployed and verified)
status: living. The integration seat updates it whenever a row changes state (dispatched, PR open, merged, deployed, verified, closed) and records the change in the log at the bottom. This page now also carries the live queue (it replaces the ordered queue in the 2026-09-16 handoff).
kind: roadmap
owner: nick
maintained_by: integration seat
programs: [OPS-24]
related:
  - _inbox/2026-09-16_texas_scaleup_program_scope.md (the plan, rev 4; this file tracks its rows)
  - 90_operations/OPS-24_county_to_serving_program.md
  - 90_operations/OPS-16_texas_market_plan_of_record.md (row text is the authority; A-191 to A-203 cover 2026-09-16 and 2026-09-17)
  - _decisions/2026-09-16_county_verdict_is_not_the_serve_switch.md
snapshot: GitHub PR state, Cloud Run state (by field) and doc_repo main (191825d7) read 2026-09-17 between 11:53Z and 12:00Z
---

# Texas scale-up roadmap

The sequence is ruled: **Phase 0** (the six counties complete and verified), **Phase 1** (Burnet
through the farm, the farm built during that run), **Phase 2** (Bell and Milam in parallel),
then the rest of Texas. The road-node pass waits until after Phase 2. Row text in OPS-16 is the
authority; this page is the at-a-glance state.

**State words.** *Customer-done* means verified on the surface a customer uses. *Live* means
deployed and verified at its own instrument. *Merged* means on main and not yet running.
*In flight* means a lane or a job is working it. *Held* means ready and deliberately not applied.
*Not started* means carded and not dispatched.

## Where things stand (2026-09-17 12:20Z)

| Area | State |
|---|---|
| **Gate (P-252, P-292, P-293, P-298)** | **Live.** The apply graded PASS (06:55Z). P-298's index and scheduler image are deployed, a full six-county apply now takes 33 minutes (was 8h13m), and the scheduler takes its own lease. The hourly trigger was **resumed 11:54Z**; the 12:00Z run is watched and must end before 13:00Z. |
| **Serving semantics (P-297)** | **LIVE (12:33Z)**, both halves: each slated parcel is served from its own cell. All 152 slated pairs read `pass` today, so no answer changed except empty or refused slated cells, which now refuse with a reason (graded on 7 parcels, 455 rails). Law 7's bake fallback is retired for slated rails. |
| **Six-county republish** | **4 of 6 done.** Bastrop, Caldwell, McLennan: green walks, graded on the served row. Hays: written and store-accepted; its walk is red for a known reason (P-301). Travis: staging running. Williamson: queued, walk red expected, accepted store-side (operator call). |
| **Setbacks (P-256, P-258, P-299, P-300)** | P-258 tables and P-299's height guard are **LIVE** (Round Rock: 24 districts served, no 999 height, 21 flagged not-specified; was 10 districts all serving 999). Corpus **1.4.0** published. P-256 is **held** until P-297 is live (apply authorised with per-county ceilings, A-199). P-300 waits on P-256. |
| **Walk (P-301)** | Defect found today: the walk does not recognise P-206's `record_retired` 404, so Hays and Williamson walks cannot be green. **Fired** by the operator. |
| **Austin zoning (P-259)** | Built and dry-run; **two rulings made** (A-202): interim `I-<X>` reads as `<X>` with a note; no-account features skipped. **Follow-up cleared to fire.** |
| **Serving path (P-294, P-295)** | P-294 **merged, not deployed** (waits for the republish to finish). P-295's three rulings are made (A-199); its build is not started. |
| **Farm (P-284, P-285)** | Stage records live. County runner **merged**; Burnet dry run recorded (5 of 13 stages have a runner). |
| **Coverage (P-205, P-210)** | **Customer-done.** |
| **Envelopes (P-249, P-262)** | P-262 merged. P-249's PRs are reviewed; its staging proof is owed by the integration seat. |

## Live services (what is serving, read by field at 11:59Z)

| Service | Revision | Built from | Carries |
|---|---|---|---|
| hauska-retrieval-api (us-central1) | `00098-cat` (digest `b1489722`, 12:32Z) | engine `3e6bbe95` | P-297 engine half, P-293 vocabulary, P-205, P-210. Rollback: `00096-div` |
| hauska-engine-api (us-central1) | `00249-kiw` (digest `29c46cc2`, 14:00Z) | engine `1d9e4752` | P-302, P-297 engine-core reader, P-248, P-261. Rollback: `00247-san`. Note: tag `envelope-canary` follows the latest revision |
| cortex-api, LDT (us-central1) | `00820-jex` (digest `950e4eb0`, 13:46Z) | LDT `c40423a5` | P-249 (cortex half), P-297 LDT half, P-299 height guard, P-258 tables, P-293 reader. Rollback: `00817-niq`. smartsite-mcp (`00134-wad`) reads cortex over HTTP, so it carries these without a deploy |
| Property Explorer (smartsite.cloud, Vercel) | deployment `k8hha93vj` (asset `index-P6PwqVA_.js`, 13:47Z) | map `93f832b6` | P-249 (map half). Rollback: deployment `fyn3qud4j` |
| factory-control | `00008-vid` | factory `35007fb` | P-281 lease routes |
| Factory jobs | gate scheduler, parcel-record-fill, flood-ingest, r4-companions: `34cf39e` (digest `83ab81e7`); publish, migrate, staging-reset, verify-walk, dollar-fields-patch, republish-on-change (new, dry-run args, no schedule): `b65f61b` (digest `f476f438`, 12:55Z); setback and envelope writers, conformant: `47c7dfc` | | P-252, P-292, P-281, P-284, P-298. Factory main is `3f3e8be` (P-294 and P-285 merged, not built) |
| Factory store | index `parcel_record_cell_rail_place_idx`, 2.83 GB, valid | | P-298 |
| npm | `@empressaio/setback-corpus@1.4.0` (latest) | corpus `f43cf4b7` | P-299 |
| Cloud Scheduler | `factory-publish-gate-sched-hourly` **ENABLED** (resumed 11:54:05Z) | | |

## Done

| Row | What | State |
|---|---|---|
| Teardown, P-252 to P-296 carded | Final review, plan rev 4, every Phase 0 item on a row | Done (A-183, A-185, A-186) |
| A-184, A-190, A-193, A-199, A-201, A-202 | Operator rulings recorded | Done |
| P-205 | Un-onboarded counties name themselves; Marble Falls names Burnet | **Customer-done** (A-197) |
| P-210 | "Is this county covered" endpoint | Live (A-188) |
| P-248, P-261 | Footprints on every sheet; the PDF prints an area only when verified | Live (A-188) |
| P-251 | Engine key rotated; 37 side-door URLs removed | Done (reports session) |
| P-252, P-292 | Empty counties refuse at the gate | **Live and graded** (apply PASS 06:55Z, `_inbox/2026-09-17_p252_apply_grade.json`; regraded PASS on the P-298 image 11:53Z) |
| P-253 | Phase 0 ledger leg repaired | Done (A-187). Completeness rerun 07:29Z: INCOMPLETE, unchanged (`_inbox/2026-09-17_six_county_completeness_post_apply.json`) |
| P-255 | Setback census | Done: 131,357 is P-249's real target |
| P-277 | Amendment ids gated | Done (A-194) |
| P-280 | Commit checks run in every worktree and on merges | Live |
| P-281 | Job and heavy-scan leases | **Live and proven** (A-195); the gate scheduler now takes one too |
| P-284 | Stage cost and timing records | **Live and graded** |
| P-293 (both halves) | Both verdict readers read all six verdict strings | Live |
| P-297 (both halves, with P-269) | Each slated parcel served from its own cell | **Live** (retrieval `00098-cat`, cortex `00817-niq`, 12:33Z); graded on 7 parcels. Customer grade owed to P-254's legs |
| P-299 | Height flag has one meaning; no placeholder height served | **Live** (cortex `00817-niq`; corpus 1.4.0). Engine bump to 1.4.0 still open |
| P-258 (tables) | Setback campaign tables | **Live** (cortex `00817-niq`); writer re-run and census re-grade wait on P-256 |
| P-249 | Unverified zero atoms stop hiding envelopes | **Live** (cortex `00820-jex`, Property Explorer `k8hha93vj`); Hays `48209:97658` draws on the live panel with the figure withheld. Waco (not-onboarded class) still declines on the panel: P-303 |
| P-302 | Engine-core site plan shows a declared refusal, never the baked value | **Live and graded** (engine-api `00249-kiw`): a fresh feasibility export for `48453:941709` prints no setback and states the ledger's refusal, and utilities show a declared refusal with no holder names (`_inbox/2026-09-17_p302_live_grade_48453-941709_export.txt`) |
| P-298 | The scheduler reads one rail's slice and takes the lease | **Live and graded** (A-202): index built, image deployed, live plan uses the index, six counties in 33 minutes |
| P-246, P-247, P-238, P-213, P-242b, P-242c, P-206 | Reports rows | Closed by the retired reports session (A-190) |

## Merged, not yet running

| Row | What | Runs when |
|---|---|---|
| P-294 | Republish a county when its ledger changed (factory `92c468e`) | After the republish: publish-image rebuild, schedule created (not enabled), one dry cycle; first automated production run on the operator's go |
| P-285 | County runner (factory `3f3e8be`); Burnet dry run recorded | Burnet run, after the Phase 0 exit |

## In flight

| Row | What | State | Next |
|---|---|---|---|
| P-259 follow-up | Interim districts read as base; no-account features skipped | **Cleared to fire** (`_dispatches/2026-09-17_p259b-interim-and-accounts_dispatch.md`); operator fires | Review, merge; the integration seat applies the Austin stamp and reruns the census |
| P-266 with P-268 | Open trivial rails and must-pass refusals (factory) | **Compiled** (`_dispatches/2026-09-17_p266-p268-factory-open-rails_dispatch.md`); operator fires | Review, merge; the integration seat runs the writers per county |
| P-275 | Live-currency checks for the other five counties (engine) | **Compiled** (`_dispatches/2026-09-17_p275-live-currency-five-counties_dispatch.md`); operator fires | Review; any reactivation needs the operator's authorisation of its count |
| P-276 | Every consumed staging secret is rotated or provably stable (factory) | **Compiled** (`_dispatches/2026-09-17_p276-staging-secret-targets_dispatch.md`); operator fires. Premise measured: six resets today left LDT's copy byte-identical and working | Review, merge, deploy the reset image |
| P-302 | Engine-core site plan shows a declared refusal, not the baked value (new row, A-203) | **Compiled** (`_dispatches/2026-09-17_p302-site-plan-refusal_dispatch.md`); fire after the commit that adds its row | Review, merge; engine-api deploy |
| P-301 | The walk recognises `record_retired` | **Fired** 2026-09-17 | Review, merge; rebuild the publish image; re-walk Hays run `eb1d2676` and Williamson |
| Six-county republish | A-190 | 4 of 6 done; Travis staging running; Williamson queued | Finish, grade each on the served row |
| Hourly gate trigger | P-298 image | Resumed 11:54Z | Confirm the 12:00Z run ends inside the hour |

## Ready, waiting on something

| Row | What | Waiting on |
|---|---|---|
| P-303 | Panel declines the "not onboarded" zero with `no-zoning-stamp` though its zoning facet holds the district (XD-2 Waco) | Dispatch owed (hauska-map); depends on P-249 deployed |
| P-304 | The envelope route exposes the withheld area figure to anonymous callers | Dispatch owed (LDT, hauska-map) |
| P-305 | A rotated key reaches Production but not Preview, unnoticed | Preview key fixed 13:37Z and confirmed by a plain preview (panel 200); the check is a dispatch owed |
| P-276 control venue | `scripts/check-staging-secret-drift.mjs` (merged `c7bd819b`) needs a scheduled home under an identity with Run Viewer and Secret Viewer in both projects; a third rotation target needs an IAM grant (operator stop point) | Integration seat to propose |
| P-249 | Unverified zero atoms stop hiding envelopes (LDT #701, map #409) | The integration seat's staging proof |
| P-256 | Stop false "no setbacks required" (factory #160) | **Unblocked** (P-297 live). Integration seat: rebase on factory main, corpus pin to 1.3.0, apply within the per-county ceilings |
| P-258 re-grade | Writer re-run and census re-grade | P-256's apply |
| P-300 | City-wide default setback lines (Gholson first) | P-256 |
| P-296 | ETJ rollout | **Unblocked** (P-297 live); dispatch owed. Its migration `0102` is still unapplied on production (deliberately skipped in the 12:33Z deploy) |
| P-262 | One edge labeller (merged) | Graded by P-264 |
| verify-walk production template | `factory-verify-walk` carries only `FACTORY_DATABASE_URL`, so `--target=production` refuses `TARGET_ENV_MISSING` and the documented `--skip-walk` then re-walk path cannot run (found 2026-09-17 12:57Z). Fix belongs in `cloudbuild.publish.yaml` (the production store secrets on that stanza), then a publish-image rebuild | Unassigned; a small factory change |
| Engine corpus bump | Engine to corpus 1.4.0 with its 14 vendored tables corrected | Unassigned; from P-299's close |

## Owed by the operator

| Item | Note |
|---|---|
| Fire five lanes | P-259b, P-266 with P-268, P-275, P-276 and P-302, once commit A-203 is on main |
| P-278 production credential rotation | Before Burnet's first production publish |
| Cotality contract and credentials (P-267, P-283) | Open |
| Account check for P-243 and P-244a | Open |
| First automated production run of P-294 | After its dry cycle is graded |

## Owed by the integration seat (in order)

| # | Item |
|---|---|
| 1 | Confirm the 12:00Z gate run ends inside the hour; pause the trigger if not |
| 2 | Finish the republish (Travis, Williamson), then rebuild the publish images (P-294), create its schedule without enabling it, run one dry cycle |
| 3 | Review and merge P-301, P-259b, P-266/P-268, P-275, P-276 and P-302 as they close; re-walk Hays and Williamson after P-301; engine-api deploy after P-302 |
| 4 | P-249 staging proof, then its cortex and map deploy (P-297, P-299 and P-258 deployed 12:33Z) |
| 5 | **Now unblocked:** P-256 integration and apply within the ceilings, then P-258's writer re-run and census re-grade; then dispatch P-300 and P-296 |
| 6 | Apply the Austin stamp after the P-259 follow-up; rerun the P-255 census |
| 7 | Build P-254 (customer-surface legs, graded on `get_smart_site` and the served row, not the panel `bakedAt`) and P-286 |
| 8 | Dispatch as lanes free: P-260, P-263 and P-264, P-266, P-268, P-270 to P-276, P-279, P-282, P-287, the P-291 note, the engine corpus bump |

## Left for Phase 0 (the six counties)

| Group | Rows | Blocked on |
|---|---|---|
| Finish-line checks | P-254, P-286 | Nothing |
| Setbacks | P-256, P-257, P-260, P-156, P-300 | P-257 needs P-256 and P-249; P-260 needs P-258 |
| Zoning | P-259 follow-up and the Austin stamp | The follow-up lane |
| Envelopes | P-249, P-263, P-264 | P-264 needs P-260 |
| Hays and the ledger | P-211, P-265, P-266, P-268, P-204 | P-265 needs P-211 |
| Ag valuation | P-267 | The Cotality contract |
| What customers see | P-270, P-271, P-272, P-217, P-209 (P-297 live) | Nothing |
| Walk and republish | P-301, the six-county republish | In flight |
| Controls and cleanup | P-273, P-274, P-275, P-276, P-279, P-282, R-11 | Nothing |
| Earlier rows | P-175, P-183, P-184, P-176, site-plan compose timeouts | Nothing |
| Serving path | P-294 deploy, P-295 build | The republish; a P-295 design review |
| From the reports session | P-296, P-243 and P-244a checks | P-297 live; operator account check |
| **Phase 0 exit** | Ledger complete, customer checks pass, coverage, road residual, operator walk | Everything above |

## Farm and Burnet (Phase 1)

| Row | What | State |
|---|---|---|
| P-284 | Stage cost and timing records | Live and graded |
| P-285 | County runner, all thirteen stages | **Merged**; Burnet dry run recorded (5 of 13 stages have a runner) |
| P-286 | Blocker list as the pre-bake checklist | Not started |
| P-287 | Burnet's unreconciled parcels; address points | Not started |
| P-186 to P-198 (the unbuilt stages) | Source recon, pre-bake audit, acquire, identity, atoms, completeness, probe, merge gate | Not built (named by the Burnet dry run) |
| P-278 | Production credential rotation | Operator go owed |
| Burnet run | Burnet through the farm | Waits on the Phase 0 exit |

## Bell, Milam and after (Phase 2 and later)

| Row | What | State |
|---|---|---|
| P-290 | Two counties publishing at once | Not started; P-285 is merged |
| P-288, P-289 | Separate storage per county | Only if Burnet's records call for it |
| P-291 | "Not yet verified" note on the 13 July-bake counties; move Bell | Note can start now |
| P-283 | Read Cotality's contract | Waits on the contract |
| Road-node pass, rest of Texas | | After Phase 2 |

## Change log

| When (UTC) | Change |
|---|---|
| 2026-09-16 18:45 | Created from the roadmap given to the operator in session. |
| 2026-09-16 18:55 | P-253 done (A-187); P-254 next. |
| 2026-09-16 19:15 | Engine and retrieval deployed and verified (A-188); P-248/P-261, P-249, P-284 closes landed. |
| 2026-09-16 19:40 | P-292, P-293, P-230 closed partial (A-189); the bake has no trigger; decision owed. |
| 2026-09-16 20:00 | Operator rulings (A-190): both serving-path fixes, republish the six; P-258, P-256, P-262, P-281 dispatched; reports session retired and merged in; P-294 to P-296 carded; session closed with a handoff. |
| 2026-09-16 20:22 | New integration session. P-292 merged (factory `e86bc51`), P-293 merged (LDT `9ce30b8`), P-252 merged (factory `28cec4c`). The engine vocabulary lane is compiled. Two rollout findings: the gate scheduler runs hourly with `--apply` on the one verdict table production reads, so there is no staging step for it and deploying its image is the apply; and migration `0011a` (the new verdict strings) is not applied to the factory store, so the new scheduler would fail its writes. Publish image build started at `28cec4c`. |
| 2026-09-16 20:58 | LDT P-293 deployed (`cortex-api-00815-fiw`). Migration `0011a` applied. P-284 merged (`afdda42`), migration `0012` applied, writer images deployed, and a real dry run wrote its stage record; its compute cost is unmeasurable (wrong job name, proven both ways), remainder lane compiled. P-249 PRs reviewed. P-205 Marble Falls rule decided and its engine lane compiled; P-269 and P-295 (phase 1) compiled. P-256 closed partial with PR #160. A-191 records it. |
| 2026-09-16 21:02 | P-256 held (A-192): its apply would switch all six counties' setbacks from the ledger back to the bake, because the county verdict is the serve switch. P-213's blast-radius guard exists only in the engine. Serve-semantics ruling owed. |
| 2026-09-16 21:18 | Operator ruling A-193: the county verdict is a grade, not the serve switch (decision record, OPS-24 law 7, row P-297). P-297's LDT half compiled together with P-269; the separate P-269 dispatch withdrawn. P-293 remainder fired. P-281 closed partial (factory #161); P-256 landed earlier; P-258 and P-262 still in flight. |
| 2026-09-16 21:24 | P-277 done (A-194). P-281 merged (factory `35007fb`, doc_repo `9c0881cb`); its images and migration are in progress. |
| 2026-09-16 21:27 | Engine #462 (P-293 remainder) merged as `9e5e793`; retrieval-api image building. P-262 closed partial (engine #461). P-297 engine half compiled. Earlier change-log times corrected to the commit times. |
| 2026-09-16 21:45 | Retrieval-api deployed (`00094-wed`): both verdict readers live. P-281 live and proven by a refused job. Scheduler image deployed with its hourly trigger paused; apply pending (A-195). |
| 2026-09-16 23:06 | Old-code scheduler run cancelled; apply running and four counties grade clean (A-196). P-258 integrated: corpus 1.3.0 published, LDT #709 open. P-262 merged. P-298 carded. |
| 2026-09-16 23:18 | LDT #709 (P-258 tables) merged; P-205 follow-on, P-284 remainder and P-295 phase 1 fired; P-297 LDT half cleared to fire. |
| 2026-09-16 23:47 | P-205 customer-done (retrieval `00096-div`, `find_parcel` names Burnet). P-295 phase 1 and P-284 remainder closed; #162 merged with a planner call on the cost quantity. A-197. |
| 2026-09-17 00:04 | Regrouped. P-284 remainder deployed (migration `0014`, publish, writers and reaper on `47c7dfc`; first reaper tick clean). P-297's LDT lane opened PR #710. This page rewritten to current state and now carries the live queue (A-198). |
| 2026-09-17 00:12 | P-284 graded: the reaper backfilled a real dry run's record with a measured $0.000484. P-258 corpus rulings explained to the operator; decision pending. |
| 2026-09-17 00:26 | Operator rulings recorded (A-199): corpus OT-1/2/3/10, P-295's three, P-256's apply with a per-county ceiling, P-284's basis. P-299 and P-300 carded; OPS-24 range to 320. Five lanes compiled: P-299, P-298, P-294, P-285, P-259. LDT deploy now waits on P-299's height guard. |
| 2026-09-17 00:44 | Session closed at the context limit (A-200). Six lanes running (P-297 LDT, P-299, P-298, P-294, P-285, P-259). Gate apply still running with the trigger paused. Handoff: `_inbox/2026-09-17_HANDOFF_integration_seat.md`. |
| 2026-09-17 04:54 | New integration session. Gate apply still running after 6h12m. Interim grade UNMEASURED: 26 Williamson pairs unwritten, zero failures on the other 364. The factory-store lease `c52a88cf` expired unrenewed and the reaper closed it at 02:40:19Z, so the store was unleased from then until 04:53Z. The lease service records no other factory-store lease or refusal in that window, but session leases are voluntary. Retook as `cdcf84fd`, expiring 08:53:17Z. The operator reports all six lanes closed; their closes have not been reviewed yet. |
| 2026-09-17 06:56 | Gate apply completed and graded PASS (all six counties, 25 predicted flips). Trigger still paused for the next session to resume. |
| 2026-09-17 06:57 | Fresh integration session (06a91261) holds the seat. The 06:56 line above was written by the closed session (9d27b9bd) without knowledge of this session. This session graded independently at 06:55:24Z (PASS; self-test 8 of 8 including the not-vacuous case) and **resumed the hourly trigger at 06:56:34Z**, on job generation 13 with the same image digest `2c23c52` as the graded apply. The 07:00Z run is watched. Prediction: it finishes in under 55 minutes. Earlier old-code hourly runs took 34 to 150 minutes and already overlapped, and this apply took 8h13m, with the two large counties dominating. Lease `cdcf84fd` stays live until that run is graded. |
| 2026-09-17 07:35 | **Prediction falsified; the trigger is paused again (07:27:49Z).** At 07:27Z the 07:00Z run (`kxt28`) had rewritten Bastrop and Caldwell (65 each) but only 9 Hays pairs in 20 minutes, with McLennan, Travis and Williamson (about 8 hours in the apply) still ahead. Mechanism: a cold cache, because the apply's Travis and Williamson reads evicted the smaller counties' pages. Second mechanism considered: a competing heavy reader. It was rejected because `kxt28` was the only unfinished job execution in either project and no lease was live other than this seat's, though the read-only role cannot see other sessions' queries. The regrade still read PASS with `kxt28`'s rewrites included, so `kxt28` was **cancelled at 07:29Z** (the rewrite is idempotent and the trigger path is proven: it fired on schedule, on the right image and arguments, and wrote correct rows). **The trigger stays paused until P-298 is merged, its index built and its image deployed.** Completeness rerun at 07:29Z: **INCOMPLETE**, with the same pass count and the same open rails as the rev 4 baseline in every county. The apply changed the verdict strings, not the open set. Lease `cdcf84fd` released at 07:34:06Z; none live. Six-county republish started: staging reset, then Bastrop staging (publish image `6e55a2c7` = factory `47c7dfc`, A-198). The dry run predicts no floor rail refuses in any county. |
| 2026-09-17 08:10 | **Bastrop republished.** Staging `wbtj6` (15m, walk pass, 77,799 tier-1 rows, coverage retention 1.078, readiness gate cleared as predicted), then production `jlqwj` (11m54s, walk pass, sibling `d9c5ae1b`, run `cafeca91`, stamp 08:02:50Z). Graded at the authoritative row: `place_layer_snapshots` (`node-facets:tier1`, `node:48021:34049`) was rewritten at 07:56:58Z, and `get_smart_site` (node depth) serves `bakedAt` 2026-09-17T07:56:21.772Z. **Instrument finding:** the handoff's check, served `bakedAt` on the smartsite.cloud panel facets, cannot grade a republish. The panel is built by hauska-map's `property-atom-chain` adapter, not from this row, and its `facets.bakedAt` still reads 2026-09-10T22:33:31.180Z. That value matches the parcel's `setbackRulesFact.sourceVintage` to the millisecond, and four counties share the identical 2026-09-10T22:36:30.509Z, so it tracks a setback-cell write, not a bake. The same probe shows some parcels never moved on the 09-10 publishes (Travis `113408` and `474034` still read 2026-07-24; several Williamson R-ids read August or July), so "each run rewrites the whole county" is unproven for the panel. This bears on P-254's and P-294's bakedAt legs and on `scripts/surface-probe.mjs`. Only Bastrop has a registered gold parcel (`verify-walk.mjs` `GOLD_PARCELS`); the other five need `--gold`, taken from their last successful production publish. One Caldwell staging run without it (`8sfhn`) refused `GOLD_REQUIRED` at flag parse, before any store work. |
| 2026-09-17 09:06 | **Caldwell and McLennan republished and graded MOVED.** Caldwell (gold `48055:20478`): staging `psjml` (11m, walk pass), production `274fb` (9m20s, walk pass, sibling `c1406eef`, run `2c2d64fb`); 48,649 conformant rows and 73,371 written in both runs; probe row `node:48055:20478` rewritten 08:27:15Z. McLennan (gold `48309:176914`): staging `7t95w` (18m44s, walk pass), production `9ppnq` (15m16s, walk pass, sibling `5185e11c`, run `76fdaed6`); 114,255 rows; probe row `node:48309:408041` rewritten 09:04:15Z. Hays (gold `48209:135570`), Williamson (`48491:76149`) and Travis (`48453:493738`) started in sequence; their last production publishes took 42m, 1h20m and 1h33m. |
| 2026-09-17 10:33 | **Hays republished; its production walk is red for a known reason with a newly found cause.** Staging `hhrlb` (40m42s, walk pass, 173,050 conformant rows, 194,538 written). Production `g874s` (40m48s) wrote the county (run `eb1d2676`; probe rows `node:48209:100226` rewritten 09:50:46Z and `node:48209:135570` rewritten 09:57:49Z, both carrying that run id), then exited `WALK_FAILED`: walk `d4c2a12c` graded 80 pass and 16 `BP-MEANING-01` "HTTP 404", with `retiredCount` 0 and clean S-families. This is A-175's shape from 09-14 (`t7dtd`: the same 16-of-N split, bake landed, walk red). The 16 are P-180's account-keyed retirements (`135570` is not in `txgio_parcel`; the Hays node id is the map id, per the 2026-09-13 ruling), which production cortex declines with a 404 by design (A-174). **New cause:** factory `d249ba1` (#151) grades a declined earned retirement as RETIRED only when the 404 body reads `error: "not_baked"` (`verify-walk.mjs` `isTypedNoCoverageRefusal`), but LDT P-206 (#699, `ba6a5a69`) changed that body to `record_retired`, so the typed check never matches and the store half never runs (`declinedRetirement.accepted` 0, `storeErrors` 0). Second mechanism considered: a failed or empty store read. Rejected, because either would have written a different reason string than the bare "HTTP 404". **Consequence:** no production walk in Hays or Williamson (the two gate-blocked counties) can be green until the walk's typed check accepts `record_retired`. That needs a factory fix, not yet carded. The chain stopped at Hays as designed. Travis (not gate-blocked) started 10:32Z; Williamson is held for an operator call. |
| 2026-09-17 11:08 | **Operator calls:** Williamson is published now and accepted store-side, with the red walk recorded against the fix; the walk fix is carded as **P-301** and compiled (`_dispatches/2026-09-17_p301-walk-record-retired_dispatch.md`, FAN-DEPTH 0, OPS-24 preamble). OPS-16 **A-201** records this session's gate, lease, trigger, completeness and republish state plus the two instrument defects. Williamson is queued behind Travis (the staging reset is county-agnostic, so the two cannot overlap). The republish script now accepts a production `WALK_FAILED` only when the flag is set and the execution's log carries exactly that line; checked against `g874s` (match), `274fb` (no match) and `8sfhn` (`GOLD_REQUIRED`, no match). Travis staging is still running at 35 minutes. |
| 2026-09-17 11:27 | **Four lane closes integrated (A-202).** P-298 merged (`34cf39e`); its index was built under lease `01172997` (235 s, 2.83 GB, valid and ready; the plan's 3.78 GB estimate came from production statistics, the lane's 1.2 GB from its rig); the parcel-record-fill build moved four jobs to `83ab81e7`; live EXPLAIN uses the index; a timed apply (`cmtsb`) started 11:20Z and holds its own lease. P-299 merged in both repos, corpus **1.4.0** published. P-294 merged (`92c468e`). P-285 merged (`3f3e8be`) after the integration seat merged main in, resolved the `cli.mjs` usage conflict and declared P-298's lease on stage 9 (P-285's own divergence test caught it). Burnet dry run recorded. P-297's #710 updated to main, CI running. P-259 rulings recorded and its follow-up compiled. All six closes copied into `_inbox`. |
| 2026-09-17 11:30 | **P-297's LDT half merged** (LDT `dca5ec2e`; 11 of 11 green on the integrated head). LDT main now carries P-258, P-299 and P-297, none deployed. The engine half is ready to fire. The timed gate run has finished four counties by 11:30Z (McLennan 50 of 65), with Travis and Williamson ahead. |
| 2026-09-17 11:54 | **P-298 graded and the hourly trigger resumed.** The timed apply `cmtsb` on the P-298 image finished at 11:53:18Z in **33m08s** (Travis about 13 minutes, Williamson 9; against 8h13m for the pre-index apply). A regrade since 11:20Z reads PASS on all 390 pairs. The run held its own heavy-scan lease on the factory store throughout. The prediction (inside 55 minutes) held, so the trigger was resumed at 11:54:05Z; the 12:00Z run is watched and must end before 13:00Z. The Travis republish (staging `758qd`) is still running at 80 minutes. |
| 2026-09-17 11:59 | Operator fired the P-297 engine half and P-301, and stopped the closed session 9d27b9bd. Commit `191825d7` records A-202 and the six lane closes (with P-299's 18 cited evidence files). All sections above the log rewritten to current state; a "Merged, not yet running" table added. The P-259 follow-up is ready to fire. |
| 2026-09-17 12:01 | **The 12:00Z hourly gate run (`wspq2`) refused `LEASE_HELD` in 15 s**: the P-301 lane held a heavy-scan lease on the factory store for its read-only sweep measurement (refusal recorded 12:00:15.648Z). This is the first production contention since P-298, and the control behaved as designed: no scan and a recorded refusal. The cost is one skipped hourly verdict refresh; lane scans will keep causing that while they run. The lane's lease is released. The 13:00Z run is watched. |
| 2026-09-17 12:19 | **P-297 engine half merged** (engine `3e6bbe95`); both halves on main, the deploy is next. P-259b cleared to fire (an earlier line here said fired; it was not). Operator chose four more lanes; P-266 with P-268, P-275, P-276 and the new P-302 are compiled (A-203). P-276's premise measured: six staging resets today left LDT's staging atoms secret byte-identical and connecting. The canon preamble's "unslated rails refuse" line is settled by the 2026-09-16 decision record ("until it is cut over"). |
| 2026-09-17 12:35 | **Deployed and verified: P-297 (both halves), P-299, P-258 tables.** retrieval-api `00098-cat` (engine `3e6bbe95`) and cortex-api `00817-niq` (LDT `dca5ec2e`), each canary first under a traffic lease, with identical env and a new digest, then shifted. Serving revisions read by field; leases removed. Grades: `scripts`-style file instrument `record-compare.mjs` (self-test 7 of 7) PASS on 7 parcels canary and 5 live, with only the intended transitions (empty or refused slated cells record->refused); Round Rock local-setbacks live 24 districts, 0 at 999; facets identical on 7 parcels (every slated pair passes today); `get_smart_site` all sections present on 5. `run-migrations` skipped deliberately: no new migration since the serving commit, and it would have applied P-296's unapplied `0102_tx_etj_boundary` ahead of its staging step. **Findings:** the engine's vendored slate (152 pairs, vendored 2026-09-13) lacks LDT's six Hays record-overlay rails (P-177 hold lifted in LDT only), a paired-copy drift for P-282. Williamson probe `R352566` is a retired node (roll-membership retirement 2026-09-10). **Unblocked:** P-256 (needs P-297 live) and P-296. |
| 2026-09-17 12:55 | **P-301 merged** (factory `b65f61b`) and the **publish images rebuilt** (build `0f4d9baf`, digest `f476f438`) on six jobs, read back by field; this creates `factory-republish-on-change` (P-294) with dry-run args and no schedule. Travis staging passed (2h14m, walk green, 873,766 rows); Travis production running. **Operator ruling (A-204):** P-256's pin moves to 1.4.0 and its integration is a seventh lane (`_dispatches/2026-09-17_p256b-pin-and-classification_dispatch.md`). LDT #701 (P-249) updated to main, CI running; map #409 current. |
| 2026-09-17 12:59 | **Hays re-walk refused** (`factory-verify-walk-hzkdv`, `TARGET_ENV_MISSING` at 12:57:22Z, before any store work; one unlinked `in_progress` walk row `604ae05d` left): the verify-walk template has no production store secrets. P-301 will instead be graded by a production-only Hays publish on the new image (inline walk; staging sibling `hhrlb` passed today), queued behind the Williamson chain. Template gap carded under Ready. LDT #701 at 10 of 11 checks. |
| 2026-09-17 13:39 | **P-249 proven on a canary** (`_inbox/2026-09-17_p249_canary_proof.md`). Unverified zero (Hays): PASS on cortex and panel, figure withheld. Pflugerville: PASS. **Waco (XD-2): FAIL at the panel** (cortex draws; panel declines `no-zoning-stamp` with the district on the payload). Validation-failed: UNMEASURED. Verified zero: graded on tests. Identity and alias rollback: converged within 20 s, with a 5 to 20 s stale-HTML window. **Operator ruling (A-205):** ship both; card the map fix (P-303), the anonymous area exposure (P-304) and the Preview key drift (P-305). #701 merged (`c40423a5`) and #409 merged (`93f832b6`). Preview `HAUSKA_RETRIEVAL_API_KEY` replaced. Cortex image building; deploys next. |
| 2026-09-17 13:52 | **P-249 deployed and verified live.** cortex `00820-jex` (LDT `c40423a5`), canary first, env identical, same results as the proof canary, then shifted under a lease (lease removed). Property Explorer production `k8hha93vj` (map `93f832b6`, only #409 since the previous deploy); smartsite.cloud serves the new asset and the live panel draws Hays with the figure withheld. **P-276** merged (factory `c7bd819b`): the written secret changes only on the branch-create path; nothing consumes LDT's staging secrets; the third target was deliberately not added (IAM), and the drift check needs a scheduled venue. **P-302** merged (engine `1d9e4752`); engine-api image building for a canary deploy. Preview retrieval key fix confirmed. |
| 2026-09-17 14:09 | **P-302 deployed and graded live.** engine-api `00249-kiw` (engine `1d9e4752`, image tag `p302-1d9e475` to avoid the `:latest` race), deployed with no traffic, env identical, new digest, gate enforced on the tag URL (401 without a key), keyed smoke 200, then shifted under a lease (lease removed). Graded with one customer-path feasibility export refresh for Travis `48453:941709`, whose slated `setbackFrontFt` cell is refused: the PDF prints no setback and states the ledger's reason, and utilities read a declared refusal with no holder names. **Finding:** that parcel's `utilityService` cell is kind `value` with no payload (the reader now refuses it); the population is unmeasured and it looks like a writer defect. Grading the export needed the gate-front headers (`x-hauska-product`, `x-hauska-tenant-id`, `x-hauska-package-id`, `x-hauska-gate-credential-id`, `x-hauska-access-tier`, `x-hauska-request-id`) and a JSON body on the refresh POST. |
