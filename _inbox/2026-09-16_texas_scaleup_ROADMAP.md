---
id: 2026-09-16_texas_scaleup_ROADMAP
title: Texas scale-up roadmap, done and left (living)
date: 2026-09-16
last_updated: 2026-09-17 (00:12Z)
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

## Where things stand (2026-09-17 00:04Z)

| Area | State |
|---|---|
| **Gate (P-252, P-292, P-293)** | All three merged and every reader is live. Migration `0011a` applied. The new gate scheduler is **applying now** (`factory-publish-gate-sched-8x4jk`): four of six counties grade clean against the prediction, Travis is two-thirds done, Williamson is next. The hourly trigger is **paused** until the grade passes. |
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
| P-252 (with P-292) | Empty counties refuse at the gate | **Applying** (`8x4jk`); graded by `scripts/p252-apply-compare.mjs` | Grade PASS, resume the hourly trigger, rerun the completeness check, then the six-county republish |
| P-297 LDT half (with P-269) | Each slated parcel served from its own cell | Lane working; LDT PR #710 open | Review, merge; then fire the engine half |

## Ready, waiting on something

| Row | What | Waiting on |
|---|---|---|
| P-297 engine half | retrieval-api `/record` serves from the cell | The LDT half's shared fixture. Dispatch `_dispatches/2026-09-16_p297-cell-serve-engine_dispatch.md` |
| P-256 | Stop false "no setbacks required" (factory #160, green) | P-297 live; an explicit share authorisation or a factory blast-radius guard; the factory corpus pin moves to 1.3.0 with it |
| P-258 | Setback campaign (corpus 1.3.0 published, LDT merged) | P-256's apply, then the writer re-run and the census re-grade; four corpus rulings (OT-1, OT-2, OT-3, OT-10) |
| P-249 | Unverified zero atoms stop hiding envelopes (LDT #701, map #409) | The integration seat's staging proof |
| P-262 | One edge labeller (merged `e7cd0ae`) | Graded by P-264 |
| Six-county republish | Operator go (A-190) | The gate apply's PASS |
| LDT deploy | P-258 tables, P-297, P-249 | P-297 merge and P-249's proof, so one `cortex-api` deploy carries them |

## Rulings and decisions owed by the operator

| Item | Recommendation |
|---|---|
| P-295 rule 1: copied values allowed only while a cell has no pointer, counted as a defect | Yes |
| P-295 rule 2: retirement order (writer with pointer and version, LDT reader, map adapter, bake per rail, legacy derive) | Yes |
| P-295 rule 3: a content version in P-163's scope | Yes |
| P-258 OT-1: run rule G7 over the shipped tables (120 rows would block; the not-specified flag means two things) | Needs a corpus-owner call |
| P-258 OT-2: an honest state for transcribed sources (`asserted` is unreachable without an atom) | Needs a corpus-owner call |
| P-258 OT-3 and OT-10: a located-not-extracted state; a city-wide default line with no district | Needs a corpus-owner call |
| P-256 apply authorisation (about 1.1M cells) | Authorise after P-297 is live |
| P-284 cost quantity (planner call: the execution window) | Override if you want a different basis |
| P-278 production credential rotation | Before Burnet's first production publish |
| Cotality contract and credentials (P-267, P-283) | Open |
| Account check for P-243 and P-244a | Open |

## Owed by the integration seat (in order)

| # | Item |
|---|---|
| 1 | Grade the gate apply; resume the trigger; rerun `scripts/six-county-completeness.mjs`; renew or release the factory-store lease (expires 02:40Z) |
| 2 | Republish the six counties, one at a time, staging first, checking served `bakedAt` |
| 3 | P-297: review and merge LDT #710, then release the engine half |
| 4 | P-249 staging proof, then one `cortex-api` deploy (P-258 tables, P-297, P-249) and the map deploy |
| 6 | P-256 integration (rebase on `47c7dfc`, corpus pin to 1.3.0) and its apply, after P-297 and the authorisation |
| 7 | Build P-254 (customer-surface legs reading the cell, per A-193) and P-286 |
| 8 | Dispatch as lanes free: P-298 (scheduler read shape), P-294, P-296, P-259, P-260, P-263 and P-264, P-266, P-268, P-270 to P-276, P-279, P-282, P-285, P-287, the P-291 note |

## Left for Phase 0 (the six counties)

| Group | Rows | Blocked on |
|---|---|---|
| Finish-line checks | P-254, P-286 | Nothing |
| Setbacks | P-257 (decline wording, PUD message), P-259 (Austin source), P-260 (one registry), P-156 | P-257 needs P-256 and P-249; P-260 needs P-258 |
| Envelopes | P-263 (clean bad data), P-264 (re-derive; measures road blocking) | P-264 needs P-260 |
| Hays and the ledger | P-211, P-265, P-266, P-268, P-204 | P-265 needs P-211 |
| Ag valuation | P-267 | The Cotality contract |
| What customers see | P-297, P-269, P-270, P-271, P-272, P-217, P-209 | P-297 in flight |
| Controls and cleanup | P-273, P-274, P-275, P-276, P-279, P-282, P-298, R-11 | Nothing |
| Earlier rows | P-175, P-183, P-184 (identity), P-176 (Cotality accuracy), site-plan compose timeouts | Nothing |
| Serving path | P-294 (republish on change), P-295 build, the six-county republish | P-295 rulings; the gate PASS |
| From the reports session | P-296 (ETJ rollout), P-243 and P-244a checks | Nothing |
| **Phase 0 exit** | Ledger complete, customer checks pass, coverage, road residual, operator walk | Everything above |

## Farm and Burnet (Phase 1)

| Row | What | State |
|---|---|---|
| P-284 | Stage cost and timing records | Live and graded |
| P-285 | County runner, all thirteen stages | Not started (P-284 and P-281 are now live) |
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
