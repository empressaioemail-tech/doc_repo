---
id: 2026-09-16_texas_scaleup_ROADMAP
title: Texas scale-up roadmap, done and left (living)
date: 2026-09-16
last_updated: 2026-09-17 (18:10Z, integration session after 06a91261)
status: living. The integration seat updates it whenever a row changes state (dispatched, PR open, merged, deployed, verified, closed) and records the change in the log at the bottom. This page now also carries the live queue (it replaces the ordered queue in the 2026-09-16 handoff).
kind: roadmap
owner: nick
maintained_by: integration seat
programs: [OPS-24]
related:
  - _inbox/2026-09-16_texas_scaleup_program_scope.md (the plan, rev 4; this file tracks its rows)
  - 90_operations/OPS-24_county_to_serving_program.md
  - 90_operations/OPS-16_texas_market_plan_of_record.md (row text is the authority; A-191 to A-210 cover 2026-09-16 and 2026-09-17)
  - _decisions/2026-09-16_county_verdict_is_not_the_serve_switch.md
snapshot: Cloud Run and Vercel state read by field, GitHub mains, and doc_repo main 699f886b, 2026-09-17 18:10Z
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

## Where things stand (2026-09-17 18:10Z)

| Area | State |
|---|---|
| **Gate (P-252, P-292, P-293, P-298)** | **Live and graded.** A six-county apply takes 26 to 33 minutes on the P-298 index (was 8h13m). The hourly trigger is enabled; the 14:00Z run succeeded in 26m. Runs refuse `LEASE_HELD` while a lane holds the factory store, which skipped 12:00Z and 13:00Z; that is the design. |
| **Cell serving (P-297)** | **Live**, both halves (retrieval `00098-cat`, cortex `00820-jex`). All 152 slated pairs read `pass` today, so answers changed only for empty or refused slated cells, which now refuse with a reason. |
| **Engine-api surfaces (P-302)** | **Live and graded** (engine-api `00249-kiw`). A slated refusal is printed as a refusal in the feasibility report and PDF, never the baked value. |
| **Area figure (P-304)** | **Live and graded** (cortex `00822-wef`): an anonymous caller gets no buildable-area figure without a verified atom, while an entitled parcel keeps it. `maxFootprintSqFt` still carries the same number (P-314). |
| **Envelopes (P-249)** | **Live** (cortex `00820-jex`, Property Explorer `k8hha93vj`). Reasonless and shape-only zeros (Hays `48209:97658`) draw on the panel with the figure withheld. The "not onboarded" class (Waco `48309:103015`) now draws on the panel too (**P-303 live and graded**, Property Explorer `mfesp954e`). P-314 carries the same figure's third name (`maxFootprintSqFt`). |
| **Setbacks (P-256, P-258, P-299, P-300)** | P-258's tables and P-299's height guard are **live**; corpus 1.4.0 published. **P-256b merged** (factory `c5622d0b`); the setback writer (`208fb315`, generation 8) and envelope writer (`e6bc2808`, generation 9) are rebuilt from that commit, env unchanged, no trigger. Next: dry-run and apply per county within A-199's ceilings once P-266 releases the stores, then re-run P-258's writer and fire P-300. |
| **Walk (P-301)** | **Graded on production.** Hays walk `20f5e98e` reads `pass` (96 parcels, 79 served, 16 retired, 16 of 16 declined retirements accepted), 17:00Z. The separate `factory-verify-walk` job still cannot run production walks (template gap). |
| **Six-county republish** | **5 of 6 done and graded** (Bastrop, Caldwell, McLennan, Travis, and Hays: retry `m22ql`, run `086fa515`, 17:01Z, after `gf8rv` crashed mid-county). **Williamson held:** P-306 found the floor compares two id keyspaces; the fix is factory #170. |
| **Serving path (P-294, P-295)** | P-294 **merged and deployed as a job** (`factory-republish-on-change`, dry-run arguments, no schedule). Its schedule and first dry cycle wait for the republish. P-295's build is not started. |
| **Farm (P-284, P-285)** | Stage records live; the county runner is merged; Burnet dry run recorded (5 of 13 stages have a runner). |
| **Controls** | P-276's drift check is merged; its scheduled home is P-316 (the operator's IAM grant first). P-305's check, inventory and runbook are on main; hauska-map #410 is green and BLOCKED. P-307 (lease keys) is factory #169. |
| **Austin zoning (P-259)** | P-259b **merged** (LDT `8e7218f7`). Cortex is deployed (`00822-wef`). Next, on the production store: count and apply `0103` by hand, dry-run and apply the Austin stamp, rerun the P-255 census. |

## Live services (read by field, 18:10Z)

| Service | Revision | Built from | Carries | Rollback |
|---|---|---|---|---|
| hauska-retrieval-api (us-central1) | `00098-cat` (digest `b1489722`) | engine `3e6bbe95` | P-297 engine half, P-293, P-205, P-210 | `00096-div` |
| hauska-engine-api (us-central1) | `00249-kiw` (digest `29c46cc2`) | engine `1d9e4752` | P-302, P-248, P-261. Tag `envelope-canary` follows the latest revision | `00247-san` |
| cortex-api, LDT (us-central1) | `00822-wef` (digest `ddb04787`) | LDT `f5fd0946` | P-304, P-259b's parser and schema, P-249 cortex half, P-297 LDT half, P-299, P-258 tables, P-293 | `00820-jex` |
| smartsite-mcp (us-central1) | `00134-wad` | LDT `ba6a5a69` | Reads cortex over HTTP, so it carries the cortex changes without a deploy | |
| Property Explorer (smartsite.cloud, Vercel) | deployment `mfesp954e` (asset `index-ARwxD9wN.js`) | map `3ee35d5e` | P-249 map half, P-303 | deployment `k8hha93vj` |
| factory-control (us-east4) | `00010-hax` (digest `03a260ab`) | factory `d2e6cb03` | P-281 lease routes, P-307 (a non-host or pooler key is refused) | `00008-vid` |
| Factory jobs | gate scheduler (generation 15), parcel-record-fill, flood-ingest, r4-companions: `1fa850e7` (digest `28066cef`); r5-zoning `1fa850e7` (`dfc2d440`). publish, migrate, staging-reset, verify-walk, dollar-fields-patch, republish-on-change: `d2e6cb03` (digest `9760ff71`, carries P-306 and P-307). Setback writer `c5622d0b` (`208fb315`), envelope writer `c5622d0b` (`e6bc2808`). Conformant: `47c7dfc` | | P-252, P-292, P-281, P-284, P-294, P-298, P-301, P-256b, P-266/P-268 | previous digests |
| Factory store | index `parcel_record_cell_rail_place_idx`, 2.83 GB | | P-298 | |
| npm | `@empressaio/setback-corpus@1.4.0` (latest) | corpus `f43cf4b7` | P-299 | |
| Cloud Scheduler | `factory-publish-gate-sched-hourly` ENABLED | | | |

Mains at 18:10Z: engine `7b3dda0b`, LDT `f5fd0946`, map `3ee35d5e`, factory `d2e6cb03`, corpus `f43cf4b7`. Everything merged today is deployed.

## Done

| Row | What | State |
|---|---|---|
| Teardown, P-252 to P-296 carded | Final review, plan rev 4 | Done (A-183, A-185, A-186) |
| A-184, A-190, A-193, A-199, A-201 to A-205 | Operator rulings recorded | Done |
| P-205 | Un-onboarded counties name themselves | **Customer-done** |
| P-210, P-248, P-261, P-293, P-280 | Coverage endpoint, footprints, PDF area, verdict readers, commit checks | Live |
| P-252, P-292 | Empty counties refuse at the gate | **Live and graded** |
| P-298 | The scheduler reads one rail's slice and takes the lease | **Live and graded** |
| P-297 (both halves, with P-269) | Each slated parcel served from its own cell | **Live** (graded on 7 parcels; customer grade owed to P-254) |
| P-299 | Height flag has one meaning; no placeholder height served | **Live** (Round Rock: 24 districts, none at 999). Engine bump to 1.4.0 still open |
| P-258 (tables) | Setback campaign tables | **Live**; writer re-run waits on P-256 |
| P-249 | Unverified zero atoms stop hiding envelopes | **Live** (canary proof `_inbox/2026-09-17_p249_canary_proof.md`); the not-onboarded class is P-303 |
| P-302 | Engine-core shows a declared refusal, never the baked value | **Live and graded** (`_inbox/2026-09-17_p302_live_grade_48453-941709_export.txt`) |
| P-303 | The panel draws Waco-type parcels | **Live and graded** (A-208) |
| P-301 | The walk reads `record_retired` | **Graded on production** (Hays walk `20f5e98e`, A-209) |
| A-190 republish | Bastrop, Caldwell, McLennan, Travis, Hays | **Done and graded**; Williamson held |
| P-281, P-284 | Leases; stage cost records | Live and proven |
| P-253, P-255, P-277, P-251 | Ledger leg, setback census, amendment ids, key rotation | Done |
| P-246, P-247, P-238, P-213, P-242b, P-242c, P-206 | Reports rows | Closed (A-190) |

## Merged, not yet running

| Row | What | Runs when |
|---|---|---|
| P-294 | Republish a county when its ledger changed (job deployed with dry-run arguments) | After the republish: create the schedule (not enabled), one dry cycle; the first automated production run needs the operator's go |
| P-285 | County runner | Burnet run, after the Phase 0 exit |
| P-276 | Staging secret drift check | Needs a scheduled venue (proposal: a Cloud Run job under a dedicated service account with Run Viewer and Secret Accessor in both projects; the IAM grant is the operator's) |

## In flight

| Row | What | State | Next |
|---|---|---|---|
| Williamson republish | A-190 | **Held (A-209).** Staging `99pbp` refused `COUNTY_COVERAGE_COLLAPSE`, nothing written. P-306: the floor counts every id namespace on the served side and only the source's R-prefixed one on the source side; scoped, retention is 1.1666; the bake reaches the numeric nodes by situs-address recovery, so it strips nothing | Review and merge factory #170, rebuild the publish image, then Williamson staging and production (`--gold=48491:76149`, a non-retired probe) |
| P-259b | Interim districts read as base; no-account features skipped (LDT #712) | **Merged** (LDT `8e7218f7`, 15:37:50Z; 12 of 12 checks SUCCESS on head `b89b26f6`; write path reviewed). Cortex's store is the production neondb host (`ep-lucky-truth-apodo8hr`), the one the Hays publish holds | After Hays: count 0103's backfill rows, apply 0103 **by hand** with its tracker row under a production lease (A-207 ruling 3), dry-run the Austin stamp on production against the staging figures, apply it, deploy cortex (canary, smoke, shift; **never** `run-migrations`), then the P-255 census |
| P-306 | Williamson floor: two keyspaces, or a zoning strip | **Closed partial.** Reading (a) holds, (b) false; A-207's attribution corrected in A-209. factory #170 green (`7b8dbe70`) | Review, merge, publish image rebuild, Williamson publish |
| P-307 | A lease keyed on a non-host name (or a pooler host) contends with nothing | **Closed partial.** factory #169 green (`9a3df5f6`): non-host keys refuse `LEASE_STORE_INVALID`, pooler keys to direct. Only `factory-store` was ever taken (2 leases, 6 refusals). Client patch filed (`_inbox/2026-09-17_p307-lease-key-is-a-host_client.patch`) | Review, merge, deploy factory-control, grade a live refused take, apply the client patch |
| P-266 with P-268 | Open trivial rails; must-pass refusals (factory #168) | **Merged** (factory `1fa850e7`, 15:51:06Z; updated to main, 6 of 6 checks green; source reviewed). The lane's dry runs (14:55Z to 15:24Z) are the measured apply effect. parcel-record-fill (4 jobs, including the gate scheduler; its 21-file import graph is unchanged since `34cf39e`) and r5-zoning images building | Per county, after the production lease frees: `parcel-record-fill --apply` for Bastrop, Caldwell, Hays, McLennan and Travis, and `parcel-r5-zoning --apply` once; then the gate scheduler by hand and `six-county-completeness.mjs`. **Williamson is HELD**: the apply writes CAD absent-verified on all 282,569 parcels (a mass join miss, the same keyspace as P-306) and replaces store values. Two situsState refusals (`48209:88885`, `48309:417476`) need a ruling |
| P-275 | Live-currency checks for five counties (engine #467) | **Closed partial; #467 green** on its updated head (`3c1035ac`), source reviewed. The reactivation count is 0 in every county, so nothing needs authorising | Merge (a hand-run review CLI; nothing deploys) |
| P-254 | The customer leg's instrument (doc_repo) | **Compiled, ready to fire** (`_dispatches/2026-09-17_p254-customer-leg-probe_dispatch.md`) | Operator fires; the integration seat commits the instrument |
| P-305 | Key rotation reaches every environment | **Closed partial.** map #410 is a DRAFT (sync workflow writes every environment); doc_repo edits (`scripts/check-preview-key-drift.mjs`, `scripts/inventory-key-consumers.mjs`, fixtures, `90_runbooks/key_rotation_all_environments.md`) uncommitted in `P:/seat-worktrees/p305-key-drift/doc_repo` | Review, commit the doc_repo files, mark #410 ready and merge, run the check once |
| P-304 | The envelope route withholds the area figure from anonymous callers | **Closed partial.** LDT #713 updated with main at 15:45Z (head `d1308ef2`), CI running. Lane notes `maxFootprintSqFt` carries the same number on an unverified parcel (a third name for the figure, not closed) | Merge on green, deploy cortex with P-259b, then the live probe (entitled leg first: `48021:34049` keeps 19052 and 63.5; then `48209:97658` carries neither) |
| P-256b | #160 on main, corpus pin 1.4.0, P-146 table regenerated (factory) | **Merged** (factory `c5622d0b`, 15:22:57Z). Setback and envelope writer images building from a clean clone at that commit | Dry-run each county, apply within A-199's ceilings once the stores are free (the lane measured 99,718 parcels moving to a value, inside every ceiling) |
| P-303 | The panel draws Waco-type parcels | **LIVE AND GRADED.** map #411 reviewed and merged (`3ee35d5e`); Property Explorer production `mfesp954e` (asset `index-ARwxD9wN.js`; rollback `k8hha93vj`). Waco `48309:103015` read `declined/no-zoning-stamp` at 15:47:34Z and `ok/envelope-unverified/figureWithheld`, no area figure, at 15:49:48Z; three no-district Bastrop controls (`48021:10001`-`10003`) still decline; Hays `97658` and Travis `367134` unchanged (file instrument, self-test 7 of 7). The lane declares a label change for a sub-cohort ("no zoning stamp here" where it read "no zoning here") | Customer-surface screenshot leg belongs to P-254 |

## Ready, waiting on something

| Row | What | Waiting on |
|---|---|---|
| P-303 | The panel declines the not-onboarded zero with `no-zoning-stamp` | **Compiled**; its dispatch and mission are uncommitted at close. Commit, then the operator fires |
| P-304 | The envelope route exposes the withheld area figure to anonymous callers | **Compiled**, uncommitted at close |
| P-305 | A rotated key reaches Production but not Preview, unnoticed | **Compiled**, uncommitted at close (the Preview key itself was fixed 13:37Z) |
| P-296 | ETJ rollout | **Compiled, ready to fire** (`_dispatches/2026-09-17_p296-etj-rollout_dispatch.md`). Staging `0102` and ingest in the lane; production `0102` (the only unrecorded file there) and ingest are the integration seat's |
| P-300 | City-wide default setback lines | P-256 applied |
| P-258 re-grade | Setback writer re-run and census re-grade | P-256 applied |
| P-299 engine half + P-282 slate | Engine to corpus 1.4.0 (23 heights, 98 state changes) and the slate re-vendored from LDT with a drift test that can fail | **Compiled, ready to fire** (`_dispatches/2026-09-17_p299-engine-corpus-and-slate_dispatch.md`) |
| P-308 | The engine's CAD join-miss path stamps its two companions | **Compiled, ready to fire** (`_dispatches/2026-09-17_p308-join-miss-companions_dispatch.md`) |
| P-309 | Review the served retirements against the counties' own sources (read-only) | **Compiled, ready to fire** (`_dispatches/2026-09-17_p309-served-retirement-review_dispatch.md`) |
| P-310 | Williamson's parcel-record-fill join (D1) | Carded; depends on P-306 |
| P-311 | situsState conflicting-evidence outcome (D2) | Carded |
| P-312 | A dropped connection crashes a publish mid-county (D3) | Carded |
| P-313 | The reaper releases a dead run's heavy-scan lease (D3) | Carded |
| P-314 | `maxFootprintSqFt` carries the withheld area (D4) | Carded; depends on P-304 |
| P-315 | The read-only factory role reads the lease tables (D5) | Carded, low priority |
| P-316 | The staging secret drift check gets a scheduled home | Carded; waits on the operator's IAM grant |
| verify-walk production template | `factory-verify-walk` lacks the production store secrets | A small factory change (`cloudbuild.publish.yaml`) |
| Empty `utilityService` value cells | `48453:941709` has a `value` cell with no payload; population unmeasured | A read-only measurement once no lane holds the factory store |
| P-262 | One edge labeller (merged) | Graded by P-264 |

## Owed by the operator

| Item | Note |
|---|---|
| Fire P-303, P-304, P-305 | After the close commit lands |
| IAM grant for P-276's drift-check venue | Run Viewer and Secret Accessor in both projects for a dedicated service account |
| State files | `_STATE.md` and `_state/shared/STANDING_DECISIONS.md` hold someone's uncommitted 13:28Z edit (a DigitalOcean standing decision). The source file's Cotality line still reads "EXTINGUISHED", so any regeneration reverts the 09-16 "re-engaged" wording. Operator ruled "don't touch" this session |
| P-278 production credential rotation | Before Burnet's first production publish |
| Cotality contract and credentials (P-267, P-283) | Open |
| Account check for P-243 and P-244a | Open |
| First automated production run of P-294 | After its dry cycle is graded |

## Owed by the integration seat (in order)

| # | Item |
|---|---|
| 1 | Finish the republish: grade Travis production, run Williamson (staging then production), then the Hays production-only re-grade for P-301 |
| 2 | Review and merge the lane closes as they land: P-259b, P-266/P-268, P-275, P-256b, then P-303 to P-305 |
| 3 | P-256: dry-run each county, apply within the ceilings, re-run P-258's writer, re-grade the census, fire P-300 |
| 4 | P-294: create its schedule without enabling it, run one dry cycle, grade it |
| 5 | After P-266/P-268 apply: run the gate scheduler once by hand and rerun `scripts/six-county-completeness.mjs` |
| 6 | Apply the Austin stamp after P-259b; rerun the P-255 census |
| 7 | Deploy P-303 and P-304 when they land; grade Waco on the live panel and an anonymous POST |
| 8 | Build P-254 (customer-surface legs graded on `get_smart_site` and the served row, never the panel `bakedAt`) and P-286 |
| 9 | Dispatch as lanes free: P-296, the engine corpus bump, the engine slate re-vendor (P-282), P-260, P-263 and P-264, P-270 to P-274, P-279, P-282, P-287, the P-291 note |

## Left for Phase 0 (the six counties)

| Group | Rows | Blocked on |
|---|---|---|
| Finish-line checks | P-254, P-286 | Nothing |
| Setbacks | P-256 (running), P-257, P-260, P-156, P-300 | P-257 needs P-256; P-260 needs P-258's re-grade |
| Zoning | P-259b (running), the Austin stamp | The lane |
| Envelopes | P-303, P-304 (compiled), P-263, P-264 | P-264 needs P-260 |
| Open rails | P-266, P-268 (running) | The lane |
| Hays and the ledger | P-211, P-265, P-204 | P-265 needs P-211 |
| Ag valuation | P-267 | The Cotality contract |
| What customers see | P-270, P-271, P-272, P-217, P-209 | Nothing |
| Walk and republish | P-301 grade, Travis, Williamson | In flight |
| Controls and cleanup | P-273, P-274, P-275 (running), P-276 venue, P-279, P-282, P-305, R-11 | Nothing |
| Earlier rows | P-175, P-183, P-184, P-176, site-plan compose timeouts | Nothing |
| Serving path | P-294 dry cycle, P-295 build | The republish; a P-295 design review |
| From the reports session | P-296, P-243 and P-244a checks | Dispatch; operator account check |
| **Phase 0 exit** | Ledger complete, customer checks pass, coverage, road residual, operator walk | Everything above |

## Farm and Burnet (Phase 1)

| Row | What | State |
|---|---|---|
| P-284 | Stage cost and timing records | Live and graded |
| P-285 | County runner | Merged; Burnet dry run recorded (5 of 13 stages have a runner) |
| P-286 | Blocker list as the pre-bake checklist | Not started |
| P-287 | Burnet's unreconciled parcels; address points | Not started |
| P-186 to P-198 (unbuilt stages) | Source recon, pre-bake audit, acquire, identity, atoms, completeness, probe, merge gate | Not built |
| P-278 | Production credential rotation | Operator go owed |
| Burnet run | Burnet through the farm | Waits on the Phase 0 exit (the depth pair refuses 48053 until P-256 widens its county list) |

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
| 2026-09-17 14:33 | **Session close (06a91261).** All sections above rewritten to state at 14:31Z. The 14:00Z gate run succeeded in 26m. Travis production is still running and Williamson has not started. The closing session's background scripts that would start Williamson and the Hays re-grade may not survive, so the scripts are copied to `P:/tmp/integration-handoff/`. P-303 to P-305 are compiled; their dispatches go in the close commit. Handoff: `_inbox/2026-09-17b_HANDOFF_integration_seat.md`. |
| 2026-09-17 15:27 | **New integration session; session 06a91261 was reopened only to restart the republish.** **Travis graded MOVED** by this session: `g68rt` succeeded at 14:54:42Z (2h6m, walk pass, 873,766 written, run `f9e98352`); probe rows `node:48453:367134` and `node:48453:493738` rewritten at 13:46Z and 13:55Z under that run; `get_smart_site` serves `bakedAt` 13:46:17.616Z. **Williamson held** (staging `99pbp`, `COUNTY_COVERAGE_COLLAPSE`, nothing written; operator ruling owed). **Hays re-grade waiting** (`mxkft` refused `LEASE_HELD`; the 06a91261 waiter runs it when the store frees). **P-256b merged** (factory `c5622d0b`) and both writer images rebuilt and read back. **P-259b's #712** updated with main. The P-256b and P-259b closes were copied from the dispatch-planner worktree. **Lease finding:** P-266's census lease is keyed `factory-store` (alias `FACTORY_DATABASE_URL_RO`), while the 15:00Z gate run `jcljc` holds its lease on the host `ep-round-base-au0jofwp`. Both aliases resolve to that one host, and both leases are live at once, so a lease taken under a non-host name contends with nothing and still reports as taken. **P-259b migration:** LDT's runner applies every file missing from `_schema_migrations`, so 0103 goes in by hand with its tracker row, and 0102 stays pending for P-296. P-303, P-304 and P-305 were fired by the operator. |
| 2026-09-17 15:43 | Commit `6735837d` (A-207). Operator fired P-306 and P-307; P-254 compiled. |
| 2026-09-17 15:58 | **P-303 live and graded** (map `3ee35d5e`, Property Explorer `mfesp954e`; Waco draws with the figure withheld). **P-266/P-268 merged** (factory `1fa850e7`) and five factory jobs rebuilt; the gate scheduler's code is unchanged, and the 16:00Z run is its first on `28066cef`. **P-275 merged** (engine `7b3dda0b`). **P-305** instruments and runbook copied to main; #410 ready. **P-304** #713 in CI. **Hays re-grade `gf8rv` crashed** mid-county (A-208); the retry waits on the dead run's lease. Closes for P-303, P-304, P-305, P-275 and P-266/P-268 copied into `_inbox`. Williamson's parcel-record-fill apply held with P-306. |
| 2026-09-17 16:03 | Commit `9584d503` (A-208). |
| 2026-09-17 18:10 | **P-304 live and graded** (cortex `00822-wef`, canary first, then the customer surface; P-303 and P-249 unchanged). **P-307 live and graded** (factory-control `00010-hax`; `factory-store` refused on the service URL; client patch applied). **P-306 merged** (`05e5de7b`) and the publish image rebuilt to `9760ff71`. **P-256's apply bound measured**: movable parcels equal A-199's ceilings exactly in all six counties, all false absences, zero unaccounted setback cells; Hays additionally has 27,949 parcels of unaccounted envelope cells. Dry runs clean so far. **Williamson republishing** on the new image. P-317 carded (a first-ever publish would refuse `COVERAGE_UNMEASURED`). |
| 2026-09-17 17:25 | **Hays done; P-301 graded on production** (retry `m22ql`, run `086fa515`, walk `20f5e98e` pass, 16 of 16; read independently). A-190's republish is at five of six. The 16:00Z gate run `mkjp4`, the first on the new scheduler image, succeeded in 34m; `c5p8r` (17:00Z) is running. **P-306 and P-307 closed partial** with factory #170 and #169 green; A-207's Williamson attribution corrected. **Operator rulings D1 to D5 (A-209)**; rows P-308 to P-316 added. **Compiled, ready to fire:** P-254, P-296, P-299 engine half with P-282 slate, P-308, P-309. P-316 waits on the operator's IAM grant. |
