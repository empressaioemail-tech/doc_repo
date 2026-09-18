---
id: 2026-09-18_phase0_closeout_REGISTER
title: Phase 0 close-out register (living)
date: 2026-09-18
last_updated: 2026-09-18 (17:25Z, A-222: P-324 recompiled; San Marcos re-check HOLDS)
status: living. The integration seat updates a row whenever its state changes and records the change in the log at the bottom. This is the durable list; the roadmap carries the live queue and points here.
kind: register
owner: nick
maintained_by: integration seat
programs: [OPS-24, OPS-16]
related:
  - _decisions/2026-09-18_phase0_closeout_rulings.md (A-215, the eighteen rulings this list implements)
  - _decisions/2026-09-18_join_miss_unaccounted_until_scoped_guard.md (A-214)
  - _inbox/2026-09-16_texas_scaleup_program_scope.md (section 5, the only definition of the exit)
  - _inbox/2026-09-16_texas_scaleup_ROADMAP.md (the live queue)
  - _inbox/2026-09-17_six_county_completeness_post_apply.txt (ledger leg of record)
  - _inbox/2026-09-17_192035_surface_probe.json and _inbox/2026-09-17_p254-customer-leg-probe_close.json (customer leg of record)
---

# Phase 0 close-out register

**The operator's instruction (2026-09-18):** everything on this list gets done, on the exit path or
not, and it is done properly. Phase 0 is not rushed to a close. Work runs in waves; nothing is held
because it is off the exit path.

## 1. The exit, and where each leg stands

Phase 0 is done when all five legs hold at once (scope rev 4, section 5). A close graded only on a
store instrument does not count.

| Leg | Instrument | Measured state | Snapshot | What closes it |
|---|---|---|---|---|
| 1 Ledger | `scripts/six-county-completeness.mjs` exits 0 | **55 open, 12 unmeasured, 1 false-earned.** Open: 18 mid-cutover (`parcelGeometry`, `pipelines`, `etjStatus` x 6; `landUseDescription` and `railCorridor` now ruled exclusions under P-337), 30 setback (5 rails x 6 counties), 6 Williamson-only (`acreageSqft`, `landUseVintage`, `situsState` 282,570 each, `exemptionCodes` 187,186, `landUseSource` 25,775, `buildingFootprint` 1, the phantom `48491:PRIVATE ROAD`), 1 McLennan (`situsState`, `48309:417476`). False-earned: Hays `situsState-retired-d1-constant=1` (`48209:88885`, newly measured by P-348). Unmeasured: `roads` and `edgeSignal` in all six (ruling 8) | 2026-09-18 13:52:10Z (`_inbox/2026-09-18_six_county_completeness_p337.txt`) | P-336, P-300 with P-338, P-335 then Williamson's fill, P-352, ruling 8 |
| 2 Customer | `scripts/surface-probe.mjs` passes on map, MCP and PDF; XD/X open count zero or ruled | **45 buckets: 23 PASS, 15 FAIL, 7 UNMEASURED; 6 of 23 XD/X OPEN, 10 CLOSED, 7 UNMEASURED; PDF SERVED 52 of 52; MCP measured 52 of 52 (signed in, ruling 9; tier not yet recorded).** After the LDT deploy and P-332 | 2026-09-18 15:58:40Z (`_inbox/2026-09-18_155840_surface_probe.json`, instrument `9eb49c5c`) | P-347's MCP leg, P-323 then the LDT deploy, P-339 to P-341, P-342's apply, P-335 (XD-7), P-349, P-354, P-270's address half |
| 3 Coverage | P-205, P-210 | **P-210 PASS 3 of 3. P-205: MCP half PASS 4 of 4; map half FAIL 4 of 4** (the Find box drops the coverage answer, P-353) | 2026-09-18 15:58:40Z | P-353, then P-347's MCP leg |
| 4 Road residual | P-264's per-city artifact | **P-264 closed PARTIAL (2026-09-18 00:34Z):** a per-city residual is measurable in 3 city rows only (Bastrop, Elgin, Lockhart); 4 of 6 counties have no warm runner. Road declines are 684 of 58,325 (1.17 percent) of Bastrop County's stored declines and 0 in the other five. Elgin: road-NAME is 20 of 37 verify failures, road-CLASS 0. hauska-engine #473 (taxonomy) is a draft | 2026-09-18 00:34Z (`_inbox/2026-09-17_p264-road-residual_close.json`) | **Ruled (A-218):** roads and edgeSignal accepted for Phase 0 in all six counties; `_inbox/2026-09-18_p264_road_residual.json` written (48021 measured, the other five null with the ruling); P-355 and P-356 carry the measurement to Phase 1 |
| 5 Walk | The operator | Not started | | Ruling 18: the 45 buckets, after a clean re-run |

Corrections to earlier records, trust these: the ledger is **67 open plus 12 unmeasured**, not "four
blocks" summing to 78; a single-FAIL probe run on 2026-09-17 22:47Z graded OPS-23 rows and says
nothing about the customer leg; **hauska-engine-api still FOLLOWS LATEST**: read by field
2026-09-18 11:45Z, its only live traffic entry is `latestRevision: true` at 100 percent on
`00253-qan`. The 2026-09-17 deploy lane's close says it pinned the service; the service says
otherwise, and the service is the authority. `hauska-retrieval-api` is the pinned one (`00102-ciz`,
explicit, 100 percent). A deploy to engine-api ships itself unless it uses `--no-traffic`.

## 2. The operator's rulings (A-215, A-216)

All as recommended: eighteen, then ruling 9's method and ruling 19 (A-216); full text in `_decisions/2026-09-18_phase0_closeout_rulings.md`.

| # | Ruling | Implemented by |
|---|---|---|
| 1 | P-204 group A (`parcelGeometry`, `pipelines`): cut over | P-336 |
| 2 | P-204 group B (`etjStatus`): cut over, panel fixed, conflict declared | P-336, P-332 |
| 3 | P-204 group C (`landUseDescription`): stays on the bake, named exclusion | P-337; Phase 1 P-345 |
| 4 | P-204 group D (`railCorridor`): deferred, named exclusion | P-337; Phase 1 P-344 |
| 5 | P-300 fires broadly (48,829 parcels) | P-300 |
| 6 | A district-miss refusal naming district and city is an accepted Phase 0 state | P-338; Phase 1 P-346 |
| 7 | Williamson adopts P-310's WCAD crosswalk | P-335 |
| 8 | Roads and edgeSignal: **taken (A-218)**, accepted for Phase 0 in all six counties on the measured share | the road residual artifact; Phase 1 P-355, P-356 |
| 9 | The probe's MCP leg signs in per run (A-216): the operator signs in with the paid Solo test account through a helper the seat adds; nothing stored | P-347; the operator signs in at each run |
| 10 | P-323 deletes the credential-missing accumulation except named keepers | P-323 |
| 11 | P-263 applies county by county, each capped at its measured share | P-342, then the seat |
| 12 | The 30,434 unclassifiable envelope atoms withheld as unverified; **come back to fix them** | P-342; **Phase 1 flag P-343** |
| 13 | P-304's figure rule governs; the probe is corrected to it | P-347 |
| 14 | Card vs draw table: most-current source wins, conflict row if unreadable | P-340 |
| 15 | The drawing route owns the envelope reason | P-339 |
| 16 | Impervious: the stricter figure governs, both cited | P-341 |
| 17 | The seat builds a PDF for each fixture parcel | P-347 |
| 18 | The operator walks the 45 buckets after a clean re-run | the exit |
| 19 | San Marcos served from corpus 1.4.0 after the coverage re-check holds (A-216). **Georgetown amended (A-218): served from its adopted rewrite ahead of 2026-11-01, and every surface names both dates** | P-349 (San Marcos); P-354 (Georgetown) |
| + | `dblink` dropped; PITR branch deleted after 48491 republishes; P-321's watch runs hourly | seat; P-350; P-334 then the seat |

## 3. Everything that must be done

`Exit` names the leg a row moves; `off` means it is off the exit path and still gets done. `Wave` is
when it starts; a row's own `Depends` in OPS-16 is the authority where they differ.

### 3a. Lanes (dispatched work)

| Row | What | Repo | Exit | Wave | State |
|---|---|---|---|---|---|
| P-323 | Tag hygiene; unblocks every LDT deploy | legacy-design-tools, gcloud | 2 | 1 | **closed partial 2026-09-18:** 45 failing tags deleted, 0 failing after, serving unchanged (Vercel leg unmeasured); generator still live (P-316); LDT deploy unblocked |
| P-332 | Panel serves the ETJ determination, declares the conflict | hauska-map | walk | 1 | **CUSTOMER-CLOSED 2026-09-18 15:28Z:** Property Explorer `m6wqid8u7`; both named parcels graded in both directions |
| P-335 | Williamson WCAD crosswalk loader | hauska-factory | 1, 2 | 1 | **merged #178 `0f4558a4`;** binds 282,219 of 282,569; movement bound needs a ruling before P-350's apply; record-fill image rebuild to be combined with P-352's |
| P-327 | P-319's gate measured against the roll the bake retires from | hauska-factory | before P-350 | 1 | **merged #177 `807cbad8`;** publish-lane image rebuild owed (with the bake pin); P-351 scope widened (the account-keyed pass inside the bake) |
| P-342 | P-263's apply writer; the 30,434 withheld | hauska-engine | 2 | 1 | **merged #475 `c41a1482` (and map #420);** migration 018 then the seat's county-by-county apply (Wave 2) |
| P-328 | The engine's parcel-node reconcile under the shared threshold | hauska-engine | off (safety) | 1 | **closed; #474 HELD:** it loosens the engine's live 0.05 to the program's 0.5; operator decision owed |
| P-336 | P-204 A and B cut over: cells written, graded, served | hauska-factory, hauska-engine, doc_repo | 1 | 2 | carded |
| P-339, P-340, P-341 | Surface agreement: envelope reason, table disagreement, impervious; Waco XD-2 | hauska-map, legacy-design-tools | 2 | 2 (after P-332 merges) | carded |
| P-300 with P-338 | Jurisdiction-default line, broadly; district-miss refusal names district and city | corpus, hauska-factory, surfaces | 1, 2 | 2 (after P-258's re-run) | carded |
| P-333 | Genuine join-miss absences restored per population | hauska-factory | off (accuracy) | 2 (after P-335) | **compiled 2026-09-18** `_dispatches/2026-09-18_p333-join-miss-scoped-guard_dispatch.md`; restores absences only in bare-key counties (Hays and Williamson join through crosswalks, and Hays' bare-id overlap of 172,377 of 173,050 is a collision count); threshold value to the operator before merge |
| P-351 | The bake's retirement arm made keyspace-aware | legacy-design-tools | before P-350 | 2 (after P-335) | **compiled 2026-09-18** `_dispatches/2026-09-18_p351-bake-retirement-keyspace_dispatch.md`; both bake writers, the 1,385 split, the dollar facts on the same bare lookup, and the factory pin move |
| P-334, P-329, P-330 | Watch can run; `ldt-sha` check; runner continues past a declared refusal | hauska-factory | off (controls) | 2 | **compiled 2026-09-18** `_dispatches/2026-09-18_p334-p329-p330-factory-controls_dispatch.md` (three PRs) |
| P-331 | A cross-repo drift check that can fail | hauska-map, legacy-design-tools | off (controls) | 2 | **compiled 2026-09-18** `_dispatches/2026-09-18_p331-cross-repo-literal-drift_dispatch.md` |
| P-324 | Pixel attribution deploy, with the four conversion events, CAPI and share-URL scrubbing (A-222) | hauska-map, legacy-design-tools | off | 2 (after P-323) | **recompiled 2026-09-18 under A-222** `_dispatches/2026-09-18_p324-pixel-events-attribution_dispatch.md`; both halves ship together; the seat deploys; `META_CAPI_ACCESS_TOKEN` owed by the operator |
| P-286, P-317 | Burnet preconditions | hauska-factory | off (Phase 1 prep) | 2 | **recompiled 2026-09-18** `_dispatches/2026-09-18_p286-p317-burnet-preconditions_dispatch.md` (the P-319 precondition is met; P-317's defect still live at `0f4558a4`) |
| P-354 | Georgetown's adopted rewrite is served (A-218) and every surface names its adoption and effective dates, never "vintage unknown"; a rule row carries both dates as fields | setback-corpus, legacy-design-tools, hauska-factory, hauska-map | 2 | **now (A-218: compile ahead of Wave 2)** | carded 2026-09-18, re-scoped by A-218 |
| P-352 | situsState conflict outcome (McLennan `48309:417476`, Hays `48209:88885`); phantom `48491:PRIVATE ROAD` retired and instantiation guarded | hauska-factory | 1 | 2 (after #175 deploys and P-335 merges; factory order after P-333) | **compiled 2026-09-18** `_dispatches/2026-09-18_p352-situs-conflict-phantom-record_dispatch.md` |
| P-353 | The map's Find box passes the coverage answer through (P-205's map half) | hauska-map | 3 | 2 | carded 2026-09-18 |
| P-270 address half | The card's address line takes city and ZIP from the ledger (reopened on `48453:445501`: ledger ZIP 78660 and city limits Pflugerville, card shows neither); the X2 grader gains an address predicate | hauska-map, legacy-design-tools, doc_repo | 2 | 2 | reopened 2026-09-18 by P-347; needs a mission |
| P-358 | The PDF forwards the ETJ determination (report-model, pdf/feasibility hardcode it) | hauska-engine | walk | 2 | **compiled 2026-09-18** `_dispatches/2026-09-18_p358-pdf-forwards-etj_dispatch.md`; reads the `etjStatus` rail, so its customer grade waits on P-336's apply |
| P-359 | ETJ rings that contain their own city; 24 invalid rings | legacy-design-tools (tx_etj_boundary) | walk | 2 | **compiled 2026-09-18** `_dispatches/2026-09-18_p359-etj-rings_dispatch.md`; its re-ingest and P-336's apply must be ordered |
| P-360 | Probe legs for P-332 (etjStatus) and P-327 (retirement verdict) | doc_repo | 2 | 2 (after P-332 deploys) | carded 2026-09-18 (seat) |
| P-361 | Threshold 0.05 program-wide (A-220): factory declaration, #474 re-pinned and merged, factory CI reads the engine's copy | hauska-factory, hauska-engine | off (controls) | 2 | **compiled 2026-09-18** `_dispatches/2026-09-18_p361-threshold-005_dispatch.md` (#474 updated in place) |
| P-362 | The LDT shift job's post-shift credential check can never run and reads its failure as a violation | legacy-design-tools | off (controls) | 2 | **compiled 2026-09-18** `_dispatches/2026-09-18_p362-post-shift-check_dispatch.md` |

**Factory merge order in wave 2**, one at a time, each re-greened against the base it merges into:
P-333, then P-334/P-329/P-330, then P-300/P-338's writer half, then P-336's writer half.

### 3b. Integration seat

| Row | What | Exit | Wave |
|---|---|---|---|
| P-347 | Probe corrected to ruling 13; `--use-system-ca`; engine key for the PDF leg; PDFs built for the 45 fixture parcels; re-run; P-270 X2 confirmed or reopened; coverage graded | 2, 3 | 1, and again at exit. **PARTIAL 2026-09-18:** all done but the MCP leg (sign-in helper built; needs a client identity, then the operator's sign-in). 52 PDFs served. Record `_inbox/2026-09-18_p347_customer_leg_wave1_record.md` |
| P-348 | McLennan `situsState` (1 parcel), Williamson `buildingFootprint` (1 parcel) | 1 | 1. **DONE (read) 2026-09-18:** both named and read, plus a third cell the ledger scored as passing; fix carded as P-352. Record `_inbox/2026-09-18_p348_two_open_cells_read.md` |
| P-337 | `RAIL_POLICY` exclusions for rulings 3 and 4, with couplings and self-tests | 1 | 1. **DONE 2026-09-18:** 47 of 47 self-tests, acceptance tests seen failing before the register entries existed; live run 13:52Z moved both rails to ruled in all six counties (prediction held exactly) |
| P-258 | Setback writer re-run and census re-grade (precedes P-300) | 1 | 1. **HELD 2026-09-18:** the live writer image carries corpus 1.4.0, so a Hays re-run IS San Marcos's switch (ruling 19's coverage re-check first) and a Williamson re-run widens P-354's breach. Order: the San Marcos coverage re-check, then the six counties (Williamson no longer waits on P-354 after A-218). **The re-check HOLDS (2026-09-18 17:16Z): 1.4.0 covers 88.38 percent of San Marcos's zoned area against 50.47 for the 1.1.0 table served today; SF-6 + SF-4.5 reproduce 12.93 exactly. Record `_inbox/2026-09-18_san_marcos_coverage_recheck_RECORD.md`. The re-run may proceed, Hays first, dry run first** |
| #175 | Deploy `cloudbuild.parcel-record-fill.yaml` under the gate-scheduler procedure (pause the hourly trigger, deploy, grade a cycle, resume); no fill `--apply` before it | 1 | 1. **DONE 2026-09-18:** deployed `7152d3b0`; gate cycle reproduced 390 of 390 verdicts; trigger resumed 15:24:53Z. Record `_inbox/2026-09-18_p325_175_deploy_RECORD.md` |
| dblink | Confirm no dependents, then drop the extension on production | off | 1. **DONE 2026-09-18 14:00:23Z**, verified from a separate session. Record `_inbox/2026-09-18_dblink_drop_RECORD.md` |
| LDT deploy | After P-323: carries P-257, P-270 and P-322's LDT halves and P-206's XD-6 fix | 2 | **DONE 2026-09-18 15:54Z:** cortex-api `00841-jeh` (LDT `25d1782f`), canary 90/90 PASS; P-206 was already live; the workflow's post-shift check is broken (P-362). Record `_inbox/2026-09-18_ldt_cortex_api_deploy_RECORD.md` |
| P-263 apply | Run P-342's writer county by county, dry run first, each capped at its measured share | 2 | 2 |
| P-321 schedule | After P-334; **hourly** (operator, 2026-09-18) | off | 2 |
| P-294 | Schedule created disabled, one dry cycle, graded | off | 2 |
| Austin stamp | Session CLI under a production lease, then the P-255 census | 1 | 2 |
| Hays join-miss delta | 2,770 cells applied against 1,069 measured, read before P-308's re-vendor | off | 2 |
| P-350 | Williamson fill applied, staging publish, production on the operator's go, PITR branch deleted | 1, 2 | 3 |
| P-349 | San Marcos coverage re-check (**HOLDS 2026-09-18 17:16Z**), then served from 1.4.0; Georgetown served from its adopted rewrite with both dates named (A-218, P-354); then the Hays bake (after P-351); P-260 customer-closed | 2 | 2 to 3 |
| Roads | P-264's artifact read; ruling 8 taken; any road work carded | 1, 4 | 3 |
| Exit re-run | Ledger to COMPLETE, customer to zero open or ruled, coverage graded, then the walk | all | 3 |

### 3c. Owed by the operator

| Item | Blocks | Note |
|---|---|---|
| ~~A client identity for the probe's sign-in helper~~ | done 2026-09-18 (A-218) | `client_01M2TETZ4K9N2Z48KBJRD46ABF`, "Smart Site MCP Probe", public, PKCE; the probe's default |
| Sign in when the probe runs (ruling 9, A-216) | Exit leg 2 | The seat will say when; converts 33 UNMEASURED buckets |
| ~~Roads (ruling 8)~~ | done 2026-09-18 (A-218) | Accepted for Phase 0 in all six counties |
| ~~P-328's threshold~~ | done (A-220) | 0.05 program-wide; P-361 carries it |
| ~~P-335's movement bound~~ | done (A-220) | The pair is authoritative; the 30 parcels are listed in P-350's apply record |
| ~~P-323's deleted retrieval tag~~ | done (A-220) | The deletion stands |
| Williamson production publish go (P-350) | Exit legs 1 and 2 | After staging passes |
| The walk (ruling 18) | Exit leg 5 | After the clean re-run |
| P-294's first automated production run | off | After its dry cycle |
| Burnet address points (48053, 0 of 35,857 loaded) | Phase 1 | A production write |
| P-278 credential rotation | Phase 1 | Before Burnet's first production publish |
| P-243 / P-244a account check | off | Reports |
| `_STATE.md` and standing decisions carry another writer's uncommitted edit and a pre-2026-09-16 Cotality line | off | Fix the source before regenerating |

### 3d. Phase 1, recorded so nothing is lost

| Row | What |
|---|---|
| P-343 | **The 30,434 unclassifiable envelope atoms, fixed properly (operator flag, ruling 12)** |
| P-344 | `railCorridor`'s first serve path, or a ruling to retire it |
| P-345 | `landUseDescription` cutover after the Hays join |
| P-346 | District tables for the 9,510 district-miss parcels |
| P-267, P-283 | Cotality agValuation and the contract read (A-212) |
| P-285 onward | Burnet through the farm, then Bell and Milam |

## 4. Traps that apply to this list

- A merged PR is not a customer fix; grade on the surface. Only Property Explorer and two factory
  job sets have deployed since 2026-09-17; every LDT half waits on P-323.
- `cloudbuild.parcel-record-fill.yaml` also rebuilds the hourly gate scheduler; it is not a
  fill-only deploy.
- The P-319 gate has never run against a real store; its first verdict is the next hand-run publish.
  P-321's watch has never run successfully (P-334).
- `surface-probe.mjs` measures nothing on the Windows host without `node --use-system-ca`.
- The map and LDT "pins" on shared literals cannot catch cross-repo drift until P-331.
- **The publish lane's bake pin is stale.** hauska-factory's `ldt-pin-staleness` check has failed on
  every main push since at least 2026-09-18 00:53Z: the bake pin `bae48d40` lacks LDT's P-304, P-297
  and P-258 lane-c commits. The next bake publish (P-349's Hays bake, P-350) bakes from stale LDT
  code unless the pin moves first (P-351 moves it).
- `scripts/p252-apply-compare.mjs` never compares a pair whose before verdict is an `excluded-*`
  string (it only notes it), so it is vacuous for a no-change gate cycle. Use
  `scripts/gate-cycle-compare.mjs`.
- The draw route answers 504 under load (`upstream aborted after 10000ms`). A 504 is not an answer
  about the envelope; the probe now treats it as unmeasured.
- Lane closes can sit on pushed `lane/*` branches and never reach main. On 2026-09-18 five lanes'
  artifacts were found that way (P-206, P-326, P-270 twice, P-264) and brought over byte-for-byte.
  Sweep `origin/lane/*` for `_inbox` files main lacks before citing a close.
- A county's served keys, its parcel index and its CAD roll can sit in three different keyspaces
  (Williamson). A control that reads one of them does not protect the others.

## 5. Change log

| When (UTC) | Change |
|---|---|
| 2026-09-18 17:20 | Seat Wave 2, item 1: the San Marcos coverage re-check HOLDS (88.38 percent under 1.4.0 against 50.47 under the 1.1.0 table served today; the 2026-09-07 figure reproduced at 12.93). New instrument `scripts/san-marcos-coverage-recheck.mjs`, self-tested and checked by violation. P-258's re-run may proceed. |
| 2026-09-18 17:25 | A-222: the operator ruled P-324 ships with its staged events, CAPI and scrubbing; recorded and recompiled. Wave 2 batch pushed `d6ab5e46`. |
| 2026-09-18 17:10 | Rest of Wave 2 compiled from source at factory `0f4558a4`, engine `c41a1482`, LDT `25d1782f`, map `163fde32`: P-333, P-334/P-329/P-330, P-352, P-361, P-351, P-331, P-358, P-359, P-362, and P-286/P-317 recompiled. P-324 held: a staged events-and-CAPI extension conflicts with its row. Found while compiling: Hays' bare-id overlap is a collision count (P-333, P-351); P-358's grade waits on P-336. |
| 2026-09-18 16:20 | Session close. Wave 2 dispatches compiled and pushed: P-354, P-339/340/341, P-353, P-270 address half, P-336 (operator to fire). Handoff `_inbox/2026-09-18b_HANDOFF_integration_seat.md`. |
| 2026-09-18 15:55 | A-221: #175 deployed and graded (trigger resumed); P-332 customer-closed on the panel; LDT deployed (cortex-api `00841-jeh`, canary 90/90); the customer leg measured with the MCP signed in (23 PASS / 19 FAIL / 3 UNMEASURED before the LDT deploy; two instrument defects fixed); P-362 carded. |
| 2026-09-18 15:20 | A-220: threshold 0.05 program-wide (P-361 widened; #474 stays held until it re-pins); P-335's pair authoritative; P-323's tag deletion stands; commit go on the Wave 1 batch. |
| 2026-09-18 15:10 | A-219: Wave 1 integrated. Merged map #420 and #419, engine #475, factory #177 then #178 (each re-greened); engine #474 held for the threshold decision. Probe-close gate ranges brought back in line with the registry (the wave had been ungated). P-354 compiled. P-358 to P-361 carded. Hays: 56,629 retired rows are hollow account nodes (no incident); 1,385 retired served keys go to P-351. |
| 2026-09-18 14:45 | A-218: ruling 8 taken (roads accepted in all six; road residual artifact written); Georgetown served from its adopted rewrite (P-354 re-scoped, compile now); the probe's OAuth client registered by the operator; commit go. All six Wave 1 lanes landed (operator); integration pending. #175: baseline taken 14:41Z, build started. P-355 to P-357 carded. |
| 2026-09-18 14:20 | Seat Wave 1, first part. P-348 read (fix carded P-352). P-337 built and run live (open 67 -> 55; Hays false-earned 1 newly measured). P-347 partial (52 PDFs built; probe corrected and re-run; X2 zoning half confirmed, address half reopened; coverage graded, P-205's map half FAIL carded P-353; MCP leg owes a client identity). dblink dropped. #175 in progress (trigger paused 14:01:34Z). P-264 found closed partial at 00:34Z. Georgetown found served from its not-yet-effective rewrite on 35,038 parcels, breaching ruling 19 (P-354). P-258's re-run held behind the San Marcos re-check and P-354. Five lanes' artifacts brought to main from their branches. |
| 2026-09-18 12:10 | Operator rulings 9 (sign in per run) and 19 (San Marcos served, Georgetown withheld to 2026-11-01) recorded as A-216. |
| 2026-09-18 11:40 | Created from A-215. Wave 1 compiled: P-323 (recompiled with ruling 10), P-332, P-335, P-327, P-342, P-328. |
