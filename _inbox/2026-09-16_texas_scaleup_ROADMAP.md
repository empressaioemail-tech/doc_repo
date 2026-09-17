---
id: 2026-09-16_texas_scaleup_ROADMAP
title: Texas scale-up roadmap, done and left (living)
date: 2026-09-16
last_updated: 2026-09-17 (04:54Z, new integration session: apply graded interim, lease retaken)
status: living. The integration seat updates it whenever a row changes state (dispatched, PR open, merged, deployed, verified, closed) and records the change in the log at the bottom. This page now also carries the live queue (it replaces the ordered queue in the 2026-09-16 handoff).
kind: roadmap
owner: nick
maintained_by: integration seat
programs: [OPS-24]
related:
  - _inbox/2026-09-16_texas_scaleup_program_scope.md (the plan, rev 4; this file tracks its rows)
  - 90_operations/OPS-24_county_to_serving_program.md
  - 90_operations/OPS-16_texas_market_plan_of_record.md (row text is the authority; A-191 to A-198 cover this session)
  - _decisions/2026-09-16_county_verdict_is_not_the_serve_switch.md
snapshot: GitHub PR state, Cloud Run state and doc_repo main read 2026-09-17 between 00:01Z and 00:04Z
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

## Where things stand (2026-09-17 00:42Z, at session close)

| Area | State |
|---|---|
| **Gate (P-252, P-292, P-293)** | All three merged and every reader is live. Migration `0011a` applied. The new gate scheduler is **applying now** (`factory-publish-gate-sched-8x4jk`). At 04:53Z five of six counties are fully rewritten with zero failures and 24 of the 25 predicted flips landed with their counts; Williamson is 39 of 65, about 4.7 minutes a pair, so the run should end around 07:00Z (timeout 10:40Z). The hourly trigger is **paused** until the grade passes. The first lease (`c52a88cf`) was reaped unrenewed at 02:40:19Z; the integration seat retook it at 04:53Z as `cdcf84fd`, expiring 08:53:17Z (handle in `P:/tmp/integration-handoff/p252-apply-lease.json`). |
| **Serving semantics (P-297)** | **Ruled** (A-193): the county verdict is a grade, not the serve switch. The LDT half is in flight (PR #710 open); the engine half waits for its fixture. |
| **Setbacks (P-256, P-258)** | P-258's 258 new rows are merged everywhere and published as corpus **1.3.0**. P-256 is **held** until P-297 is live, and its apply needs an explicit authorisation (about 1.1M cells). |
| **Coverage (P-205, P-210)** | **Customer-done.** An un-onboarded county names itself on `find_parcel`; Marble Falls names Burnet. |
| **Controls (P-277, P-281, P-284)** | Amendment ids gated (P-277). Heavy-scan leases live and proven (P-281). Stage records live with a measured compute cost (P-284). |
| **Serving path (P-230, P-294, P-295)** | The bake still has no trigger. P-295 measured that no ledger cell carries an atom pointer; three rulings are owed before its build. |
| **Envelopes (P-249, P-262)** | P-262 merged. P-249's two PRs are reviewed and wait on the staging proof. |

## Live services (what is serving)

| Service | Revision | Built from | Carries |
|---|---|---|---|
| hauska-retrieval-api | `00096-div` | engine `b8ae82f` | P-293 vocabulary, P-205 coverage narrowing, P-210 |
| hauska-engine-api | `00247-san` | engine `d88cf65` | P-248, P-261 |
| cortex-api (LDT) | `00815-fiw` | LDT `9ce30b8` | P-293 reader. **Not yet:** P-258 tables (`44029db`), P-297, P-249 |
| factory-control | `00008-vid` | factory `35007fb` | P-281 lease routes |
| Factory jobs | publish, migrate: `47c7dfc`; setback and envelope writers: `47c7dfc`; conformant (reaper): `47c7dfc`; gate scheduler: `35007fb` | | P-252, P-292, P-281, P-284 |

## Done

| Row | What | State |
|---|---|---|
| Teardown, P-252 to P-296 carded | Final review, plan rev 4, every Phase 0 item on a row | Done (A-183, A-185, A-186) |
| A-184, A-190, A-193 | Operator rulings recorded | Done |
| P-205 | Un-onboarded counties name themselves; Marble Falls names Burnet | **Customer-done** (A-197) |
| P-210 | "Is this county covered" endpoint | Live (A-188) |
| P-248, P-261 | Footprints on every sheet; the PDF prints an area only when verified | Live (A-188) |
| P-251 | Engine key rotated; 37 side-door URLs removed | Done (reports session) |
| P-253 | Phase 0 ledger leg repaired | Done (A-187); baseline INCOMPLETE until the gate apply and P-264 |
| P-255 | Setback census | Done: 131,357 is P-249's real target |
| P-277 | Amendment ids gated; seven collisions annotated; C15 is 7 | Done (A-194) |
| P-280 | Commit checks run in every worktree and on merges | Live |
| P-284 | Stage cost and timing records | **Live and graded**: the 00:10Z reaper tick (`factory-conformant-tr9j9`) filled dry run `dr7bf`'s record with a measured $0.000484 (execution window at the tier-1 jobs rate). Reconcile against the billing export later |
| P-281 | Job and heavy-scan leases | **Live and proven** (A-195); eleven heavy jobs still take no lease |
| P-293 (both halves) | Both verdict readers read all six verdict strings | Live (LDT `00815-fiw`, retrieval `00094-wed` then `00096-div`); seen returning `excluded-no-acquisition-path` on real data |
| P-246, P-247, P-238, P-213, P-242b, P-242c, P-206 | Reports rows | Closed by the retired reports session (A-190) |

## In flight

| Row | What | State | Next |
|---|---|---|---|
| P-252 (with P-292) | Empty counties refuse at the gate | **Applied and graded PASS** (`8x4jk` completed 06:54Z; `_inbox/2026-09-17_p252_apply_grade.json`); hourly trigger resumed 06:56Z and **paused again 07:27:49Z** (the first run could not finish in an hour; it was cancelled after its 140 rewrites still graded PASS). Completeness rerun: INCOMPLETE, unchanged from the rev 4 baseline (`_inbox/2026-09-17_six_county_completeness_post_apply.json`) | Trigger stays paused until P-298 (one-rail read plus the lease) is merged, indexed and deployed; six-county republish in progress |
| P-297 LDT half (with P-269) | Each slated parcel served from its own cell | Lane working; LDT PR #710 open (behind main at close) | Review, merge; then fire the engine half |
| P-299 | Height flag has one meaning; a transcribed-source state; no placeholder height served (corpus and LDT) | Fired 2026-09-17; lane working | Gates the LDT deploy of P-258's tables |
| P-298 | The scheduler reads one rail and takes the lease | Fired 2026-09-17; lane working | Index built by the integration seat after the lane |
| P-294 | Republish a county when its ledger changed | Fired 2026-09-17; lane working | Built dry-run first; first production run on the operator's go |
| P-285 | County runner, thirteen stages | Fired 2026-09-17; lane working | Skeleton before Burnet |
| P-259 | Austin zoning from the public layer with a base-code parser | Fired 2026-09-17; lane working | Stamp applied by the integration seat after the dry run |

## Ready, waiting on something

| Row | What | Waiting on |
|---|---|---|
| P-297 engine half | retrieval-api `/record` serves from the cell | The LDT half's shared fixture. Dispatch `_dispatches/2026-09-16_p297-cell-serve-engine_dispatch.md` |
| P-256 | Stop false "no setbacks required" (factory #160, green) | P-297 live; an explicit share authorisation or a factory blast-radius guard; the factory corpus pin moves to 1.3.0 with it |
| P-258 | Setback campaign (corpus 1.3.0 published, LDT merged) | P-256's apply, then the writer re-run and the census re-grade; four corpus rulings (OT-1, OT-2, OT-3, OT-10) |
| P-249 | Unverified zero atoms stop hiding envelopes (LDT #701, map #409) | The integration seat's staging proof |
| P-262 | One edge labeller (merged `e7cd0ae`) | Graded by P-264 |
| Six-county republish | Operator go (A-190) | **In progress** (gate PASS 06:55Z). Bastrop, Caldwell and McLennan done and graded; Hays written and store-accepted with a red walk (the walk predicate does not recognise P-206's `record_retired` body); Travis running; Williamson held for an operator call |
| LDT deploy | P-258 tables, P-299's height guard, P-297, P-249 | P-299 first (LDT's envelope serves a flagged 999 height as a number today: 10 district rows at the serving commit, 39 at main); then one `cortex-api` deploy |
| P-300 | City-wide default setback lines (Gholson first) | P-256 (same factory writer) |
| P-301 | The walk recognises P-206's `record_retired` body, so Hays and Williamson production walks can be green | **Compiled** 2026-09-17 (`_dispatches/2026-09-17_p301-walk-record-retired_dispatch.md`); the operator fires it. Afterwards the integration seat rebuilds the publish image and re-walks Hays run `eb1d2676` and Williamson's run |

## Rulings and decisions

**Ruled 2026-09-17 (A-199):** the four corpus rulings (`_decisions/2026-09-17_setback_corpus_flag_state_and_default_line_rulings.md`), the three P-295 rulings (`_decisions/2026-09-17_ledger_serving_transition_and_retirement_order.md`), P-256's apply authorised with a per-county ceiling (22.4 percent of the six counties' parcels in total; applies after P-297 is live), and P-284's cost basis.

| Still owed by the operator | Note |
|---|---|
| P-278 production credential rotation | Before Burnet's first production publish |
| Cotality contract and credentials (P-267, P-283) | Open |
| Account check for P-243 and P-244a | Open |
| First automated production run of P-294 | When P-294 is built |

## Owed by the integration seat (in order)

| # | Item |
|---|---|
| 1 | Done 07:34Z: apply graded PASS, completeness rerun (INCOMPLETE, unchanged), lease released. The hourly trigger is **paused until P-298 is deployed**; resume it then and confirm one run ends inside the hour |
| 2 | Republish the six counties, one at a time, staging first. Grade each on the `node-facets:tier1` row and `get_smart_site` `bakedAt`, never the panel facets (A-201). Bastrop, Caldwell, McLennan and Hays done; Travis running, Williamson queued behind it. After P-301 merges: rebuild the publish image and re-walk Hays and Williamson |
| 3 | P-297: review and merge LDT #710, then release the engine half |
| 4 | P-249 staging proof, then one `cortex-api` deploy (P-258 tables, P-297, P-249) and the map deploy |
| 6 | P-256 integration (rebase on `47c7dfc`, corpus pin to 1.3.0) and its apply, after P-297 and the authorisation |
| 7 | Build P-254 (customer-surface legs reading the cell, per A-193) and P-286 |
| 8 | Dispatch as lanes free: P-296 (after P-297), P-300 (after P-256), P-260, P-263 and P-264, P-266, P-268, P-270 to P-276, P-279, P-282, P-287, the P-291 note |

## Left for Phase 0 (the six counties)

| Group | Rows | Blocked on |
|---|---|---|
| Finish-line checks | P-254, P-286 | Nothing |
| Setbacks | P-257 (decline wording, PUD message), P-260 (one registry), P-156, P-300 (default lines); P-259 and P-299 compiled | P-257 needs P-256 and P-249; P-260 needs P-258 |
| Envelopes | P-263 (clean bad data), P-264 (re-derive; measures road blocking) | P-264 needs P-260 |
| Hays and the ledger | P-211, P-265, P-266, P-268, P-204 | P-265 needs P-211 |
| Ag valuation | P-267 | The Cotality contract |
| What customers see | P-297, P-269, P-270, P-271, P-272, P-217, P-209 | P-297 in flight |
| Controls and cleanup | P-273, P-274, P-275, P-276, P-279, P-282, R-11 (P-298 compiled) | Nothing |
| Earlier rows | P-175, P-183, P-184 (identity), P-176 (Cotality accuracy), site-plan compose timeouts | Nothing |
| Serving path | P-294 (republish on change), P-295 build, the six-county republish | P-295 rulings; the gate PASS |
| From the reports session | P-296 (ETJ rollout), P-243 and P-244a checks | Nothing |
| **Phase 0 exit** | Ledger complete, customer checks pass, coverage, road residual, operator walk | Everything above |

## Farm and Burnet (Phase 1)

| Row | What | State |
|---|---|---|
| P-284 | Stage cost and timing records | Live and graded |
| P-285 | County runner, all thirteen stages | Fired 2026-09-17 |
| P-286 | Blocker list as the pre-bake checklist | Not started |
| P-287 | Burnet's unreconciled parcels; address points | Not started |
| P-187, P-196, P-198, P-197 | Manifest, retract, merge gate, per-stage checks | Not started |
| P-278 | Production credential rotation | Operator go owed |
| Burnet run | Burnet through the farm | Waits on the Phase 0 exit |

## Bell, Milam and after (Phase 2 and later)

| Row | What | State |
|---|---|---|
| P-290 | Two counties publishing at once | Not started; needs P-285 |
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
