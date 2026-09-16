---
id: 2026-09-16_texas_scaleup_ROADMAP
title: Texas scale-up roadmap, done and left (living)
date: 2026-09-16
last_updated: 2026-09-16 (20:00Z)
status: living. The integration seat updates it whenever a row changes state (dispatched, PR open, merged, deployed, verified, closed) and records the change in the log at the bottom.
kind: roadmap
owner: nick
maintained_by: integration seat
programs: [OPS-24]
related:
  - _inbox/2026-09-16_texas_scaleup_program_scope.md (the plan, rev 4; this file tracks its rows)
  - 90_operations/OPS-24_county_to_serving_program.md
  - 90_operations/OPS-16_texas_market_plan_of_record.md (row text is the authority)
snapshot: GitHub PR state and doc_repo main read 2026-09-16 around 18:45Z
---

# Texas scale-up roadmap

The sequence is ruled: **Phase 0** (the six counties complete and verified), **Phase 1** (Burnet
through the farm, the farm built during that run), **Phase 2** (Bell and Milam in parallel),
then the rest of Texas. The road-node pass waits until after Phase 2. Row text in OPS-16 is the
authority; this page is the at-a-glance state.

**State words.** *Done* means verified at its instrument. *Merged* means the code is on main and
not yet proven on the served surface. *Deploy owed* means merged and not yet running.
*In flight* means a lane is working it. *Not started* means carded and not dispatched.

## Done

| Row | What | State |
|---|---|---|
| Teardown | Final plan review landed and its main claims rechecked; plan revised to rev 4 | Done (A-183) |
| P-252 to P-293 | Every Phase 0 item has a numbered row | Done (A-183, A-185, A-186) |
| A-184 | The operator's four answers recorded | Done |
| P-278 | Plan to rotate the production database password (9 secrets, 40 consumers) | Planned; runs later, before Burnet's first production publish |
| P-251 | Engine key rotated; 37 open side-door URLs removed (reports session) | Done |
| P-280 | Commit checks run in every worktree and on merges | Live; already checked a lane's close |
| P-253 | Phase 0 completeness check repaired (every setback rail, acceptances tied to their reasons, new verdict strings, rail-list check) | Done (A-187); live baseline INCOMPLETE, roads and edgeSignal unmeasured until P-264 |
| P-255 | Setback count tool built and run | Done: 131,357 is P-249's real target; half the district gaps are planned developments |
| P-201 | Gate verdicts split into three kinds | Merged; did not close the zero-earned gap (P-252 does) |
| P-252 dry run | What P-252 changes in the six counties | Done: 25 verdicts flip; publishing unaffected once P-292 lands |
| P-248, P-261 | Footprints on every sheet; PDF prints an area only when verified | **Deployed and verified live** (engine `00247-san`, A-188); one P-261 leg rests on the lane's probe because candidate exports fail on both old and new code |
| P-210 | "Is this county covered" endpoint | **Deployed and verified live** (retrieval `00092-lag`, A-188); Marble Falls reads indeterminate (ZIP split), a Burnet finding |
| P-246, P-247, P-238, P-213, P-242b, P-242c, P-206, P-251 | Reports rows (reports session, retired; A-190) | Closed by that session, deployed and verified where applicable |
| P-241 | ETJ acquisition build | Merged; reaches no customer yet (P-296) |

## In flight

| Row | What | State | Next step |
|---|---|---|---|
| P-258 | Setback table campaign (planner wave) | Dispatched 2026-09-16 | Grade by the census after the writer run |
| P-256 | Stop false "no setbacks required" | Dispatched 2026-09-16 | Merge after P-252 is live; staging apply |
| P-262 | One edge labeller and ring scrub | Dispatched 2026-09-16 | Feeds P-264 |
| P-281 | Job and heavy-scan leases | Dispatched 2026-09-16 | Unblocks P-263, P-264, P-294 |
| P-252 | Empty counties refuse at the gate | Lane closed partial; PR factory #157 open, green | Merge after P-292 and P-293; run on staging, then production |
| P-292 | Impervious-cover rail required for publishing only in Travis | Lane closed partial; PR factory #159 open, green | Merge first |
| P-293 | LDT reads the factory's new verdict strings | Lane closed partial; PR LDT #702 open; **the retrieval service has the same gap** (`parcel-record-db.ts:160`), one-line engine fix owed | Merge first, with the engine fix |
| P-249 | Unverified "no buildable area" data stops hiding envelopes | Lane closed partial; PRs LDT #701, map #409 open | Integration seat: review, then staging proof on the served surface |
| P-284 | Cost and timing records for every stage | Lane closed partial; PR factory #158 open | Integration seat: review; apply the migration on staging |
| P-230 | Map and MCP serve current data, not an old snapshot | Lane closed partial: **nothing re-runs the bake**; five counties serve 09-10 data, Hays 09-14 | **Operator decision:** the refresh path (A-189) |

## Left for Phase 0 (the six counties)

| Group | Rows | Blocked on |
|---|---|---|
| **Finish-line checks (integration seat)** | P-254 customer-surface checks (next), P-277 duplicate-id check, P-286 blocker list as a checklist | Nothing |
| **Setbacks** | P-257 decline wording and the PUD message (P-256 and P-258, the longest task, are in flight); P-259 Austin zoning source; P-260 one setback registry; P-156 per-city declarations | P-256 needs P-252; P-257 needs P-256 and P-249; P-260 needs P-258 in part |
| **Envelopes** | P-263 clean up bad envelope data (P-262 in flight); P-264 re-derive every envelope (also measures whether road data blocks envelopes) | P-263 and P-264 need P-281; P-264 needs P-260 and P-262 |
| **Hays and the ledger** | P-211 Hays envelope rails; P-265 Hays reader lists; P-266 three simple rails and `citationUrl`; P-268 unexplained refusals; P-204 rails still read from old sources | P-265 needs P-211; P-266 needs P-252 |
| **Ag valuation** | P-267, from Cotality | **The Cotality contract and credentials** |
| **What customers see** | P-269 dollar rails fall back to old values; P-270 card names the city and the citation date; P-271 Williamson missing snapshot and address; P-272 malformed address breaks the envelope; P-217 contradictory answers; P-209 sales history labelled Unavailable | Nothing |
| **Controls and cleanup** | P-273 dead controls; P-274 P-195 leftovers; P-275 retirement checks in the other five counties; P-276 staging password rotation; P-279 stop stale tagged revisions; P-282 paired-code consistency tests; R-11 doc_repo seat-gate scope (P-281 in flight) | P-274 needs P-252 |
| **Earlier rows still open** | P-175, P-183, P-184 (Hays and Williamson identity); P-176 Cotality accuracy test; P-205 deploy; site-plan compose timeouts in Travis and Williamson (P-244 class) | P-205 can deploy now that P-210 is live |
| **Serving path (A-190: both)** | P-294 republish a county when its ledger changed (stopgap); P-295 the surfaces read the ledger (direction; measure the atoms question first); republish the six now (operator go, after the gate fix) | P-294 needs P-252 and P-281 |
| **From the retired reports session** | P-296 ETJ rollout (P-241 merged, reaches no customer); P-243 and P-244a need an operator account check | Nothing |
| **Phase 0 exit** | Stored data complete, customer checks pass, coverage, road measurement, the operator's walkthrough | Everything above |

## Farm and Burnet (Phase 1)

| Row | What | State |
|---|---|---|
| P-284 | Stage cost and timing records | In flight |
| P-285 | County runner: all thirteen stages, with records | Not started; needs P-284 and P-281 |
| P-286 | Blocker list as the pre-bake checklist | Not started |
| P-287 | Burnet's unreconciled parcel count; address points | Not started |
| P-187, P-196, P-198, P-197 | Manifest, retract a run, merge gate, per-stage checks | Not started |
| P-278 | Production password rotation | Planned; must finish before Burnet's first production publish |
| Burnet run | Burnet through the farm | Waits on the Phase 0 exit and the rows above |

## Bell, Milam and after (Phase 2 and later)

| Row | What | State |
|---|---|---|
| P-290 | Two counties publishing at once, tested | Not started; needs P-281 and P-285 |
| P-288, P-289 | Separate storage per county (target pair, branch lifecycle) | Only if Burnet's records call for it |
| P-291 | "Not yet verified" note on the 13 counties served from July data; move Bell off that data | Note can start now; Bell's move is Phase 2 |
| P-283 | Read Cotality's contract terms | Waits on the contract |
| Road-node pass | Full road data work | After Phase 2 |
| Rest of Texas | | After Phase 2 |

## Open with the operator


- The "waiting on vendor" acceptance for ag valuation stands unless the operator wants Burnet to wait for the Cotality data.
- An account check for P-243 (the MCP app in a real Claude client) and P-244a.
- The Cotality contract and credentials unblock P-267 and P-283.
- The production password rotation (P-278) runs on the operator's go.

## Owed by the integration seat

- The LDT deploy for P-205 (P-210 is live). Burnet finding first: Marble Falls reads indeterminate.
- The P-252 rollout in order: P-292 and P-293 merged (plus the retrieval-api one-line vocabulary fix), P-252 merged, the gate scheduler dry run and apply on staging, then production.
- Republish the six counties after the gate fix (operator go, A-190).
- P-284 staging migration; P-205 with the Marble Falls fix; P-254, P-277, P-286.
- The full ordered queue is in `_inbox/2026-09-16_HANDOFF_integration_seat.md`.
- Staging proof for P-249 once its PRs are reviewed.

## Change log

| When (UTC) | Change |
|---|---|
| 2026-09-16 18:45 | Created from the roadmap given to the operator in session. |
| 2026-09-16 18:55 | P-253 done (A-187); P-254 next. |
| 2026-09-16 19:15 | Engine and retrieval deployed and verified (A-188); P-248/P-261, P-249, P-284 closes landed. |
| 2026-09-16 19:40 | P-292, P-293, P-230 closed partial (A-189); the bake has no trigger; decision owed. |
| 2026-09-16 20:00 | Operator rulings (A-190): both serving-path fixes, republish the six; P-258, P-256, P-262, P-281 dispatched; reports session retired and merged in; P-294 to P-296 carded; session closed with a handoff. |
