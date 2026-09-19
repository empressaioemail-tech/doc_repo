---
id: 2026-09-18_phase0_closeout_REGISTER
title: Phase 0 close-out register (living)
date: 2026-09-18
last_updated: 2026-09-19 (05:40Z, A-230: six lanes landed; next wave compiled; earlier A-227 to A-229)
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
| 2 Customer | `scripts/surface-probe.mjs` passes on map, MCP and PDF; XD/X open count zero or ruled | **45 buckets: 25 PASS, 10 FAIL, 10 UNMEASURED; 7 of 24 XD/X OPEN (X2-address new, 11 of 40 subjects), 10 CLOSED, 7 UNMEASURED; MCP signed in (tier still not recorded).** After the Wave 2 PE and cortex-api deploys. Moved since 15:58Z: Bastrop and Pflugerville FAIL to PASS; three Williamson buckets FAIL to UNMEASURED (P-339 removed their only violation; the draw leg has no address to use, XD-7). The 10 FAILs: 7 codified fixtures the drawing route declines (`declined` or `geometry-validation-failed`, unchanged since 15:58Z), 3 where the MCP says "setbacks unruled" beside a ruled table (P-339's MCP half, not built; Kyle is in both groups), and Waco XD-2 | 2026-09-18 22:13:32Z (`_inbox/2026-09-18_221332_surface_probe.json`) | P-347's MCP leg, P-323 then the LDT deploy, P-339 to P-341, P-342's apply, P-335 (XD-7), P-349, P-354, P-270's address half |
| 3 Coverage | P-205, P-210 | **HOLDS: P-210 PASS 3 of 3; P-205 PASS 4 of 4 on BOTH halves (map Find box and MCP), after P-353 deployed** | 2026-09-18 22:13:32Z (`_inbox/2026-09-18_221332_surface_probe.json`) | done; re-graded at the exit re-run |
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
| P-335 | Williamson WCAD crosswalk loader | hauska-factory | 1, 2 | 1 | **merged #178 `0f4558a4`;** binds 282,219 of 282,569; movement bound needs a ruling before P-350's apply; record-fill image rebuild to be combined with P-352's. **DEPLOYED AND APPLIED 2026-09-19:** record-fill image `4138ecfd` (graded 390 of 390); Williamson fill `wt4pb` bound 282,219, moved value to absent on 20 cells of 10 named parcels (the accepted bound), zero drift on the second pass. Record `_inbox/2026-09-19_p350_williamson_RECORD.md` |
| P-327 | P-319's gate measured against the roll the bake retires from | hauska-factory | before P-350 | 1 | **merged #177 `807cbad8`;** publish-lane image rebuild owed (with the bake pin); P-351 scope widened (the account-keyed pass inside the bake) |
| P-342 | P-263's apply writer; the 30,434 withheld | hauska-engine | 2 | 1 | **merged #475 `c41a1482` (and map #420);** migration 018 then the seat's county-by-county apply (Wave 2) |
| P-328 | The engine's parcel-node reconcile under the shared threshold | hauska-engine | off (safety) | 1 | **closed; #474 HELD:** it loosens the engine's live 0.05 to the program's 0.5; operator decision owed |
| P-336 | P-204 A and B cut over: cells written, graded, served | hauska-factory, hauska-engine, doc_repo | 1 | 2 | carded |
| P-339, P-340, P-341 | Surface agreement: envelope reason, table disagreement, impervious; Waco XD-2 | hauska-map, legacy-design-tools | 2 | 2 (after P-332 merges) | **P-339 map half and P-341 MERGED (map #422 `d582e0b3`) and LIVE on Property Explorer `fohg2os70` 2026-09-18 21:12Z,** graded on `48453:367134` (30 governs with both sources; the route-owned sentence). **NOT IMPLEMENTED by the lane: P-339's MCP half and all of P-340** (repair designed in `_inbox/2026-09-18_p339-p341-surface-agreement_close.json` `leave_behind[0]`); needs a dispatch. Findings: the panel sentence asserts a drawn outline without the route's answer; a 0 percent watershed limit reads as absent. Records `_inbox/2026-09-18_wave2_merges_RECORD.md`, `_inbox/2026-09-18_wave2_deploys_RECORD.md` |
| P-300 with P-338 | Jurisdiction-default line where the city's ordinance sets one (A-224); district-miss and zoning-not-acquired refusals name the district or city | corpus, hauska-factory, surfaces | 1, 2 | 2 | **compiled 2026-09-18 in two halves:** writer `_dispatches/2026-09-18_p300-p338-setback-residual-writer_dispatch.md`, surfaces `_dispatches/2026-09-18_p338-refusal-surfaces_dispatch.md`; population 58,339 (9,510 district misses, 48,829 in 40 no-layer cities) |
| P-333 | Genuine join-miss absences restored per population | hauska-factory | off (accuracy) | 2 (after P-335) | **MERGED 2026-09-18 22:28Z** (#186, `07a1215b`, re-greened on `6f422f6c`) under the operator's threshold ruling **0.95** (A-226); A-214 superseded in scope. Restore population empty in all six counties at merge; no stored cell moves until the record-fill image deploys (with P-335 and P-352, gate-scheduler procedure). Hays and Williamson stay excluded by their join. **DEPLOYED 2026-09-19** (`4138ecfd`); Williamson's fill read restore 0, reason `crosswalk-county-identifier-miss`, as predicted. The other five counties' fills on the new image are owed |
| P-351 | The bake's retirement arm made keyspace-aware | legacy-design-tools | before P-350 | 2 (after P-335) | **MERGED 2026-09-19** LDT #723 `03bb424a`, factory #188 `f5f758d6` (the seat re-pointed the pin to the merge commit; staleness PASS, old pin FAIL). **Publish image rebuilt** `502e9734` (bake = LDT `03bb424a`). Accepted by the seat: the 810 live Hays nodes take their dollars from their own R account (a change of served values at the next Hays bake); the 232 contradicted stay declared. Open for a card: writer (b)'s 2,364 live-register keys in Hays. Record `_inbox/2026-09-19_record_fill_and_publish_deploys_RECORD.md` |
| P-334, P-329, P-330 | Watch can run; `ldt-sha` check; runner continues past a declared refusal | hauska-factory | off (controls) | 2 | **CLOSED (lane); MERGED 2026-09-18:** #183 `5ead5564`, #184 `dec5493e`, #185 `6f422f6c` (ahead of P-333: disjoint files, measured by the lane). **Not deployed:** P-334's deploy is a `cloudbuild.publish.yaml` rebuild that redeploys seven jobs and also ships P-325, P-327 and P-335, with the stale bake pin until P-351 moves it. P-330's live proof is the first walk that continues past a declared refusal |
| P-331 | A cross-repo drift check that can fail | hauska-map, legacy-design-tools | off (controls) | 2 | **MERGED 2026-09-19** in three repos: map #425 `252a40f5`, LDT #725 `b5d8f355`, factory #189 `e6ca09de`. Owed: watch the first nightly runs (07:17Z / 07:23Z); add the `check-script-copies` row now that both mains carry the script; two divergences found and not adjudicated (P-270's punctuation-only address; P-354's date strictness) |
| P-324 | Pixel attribution deploy, with the four conversion events, CAPI and share-URL scrubbing (A-222) | hauska-map, legacy-design-tools | off | 2 (after P-323) | **recompiled 2026-09-18 under A-222** `_dispatches/2026-09-18_p324-pixel-events-attribution_dispatch.md`; both halves ship together; the seat deploys; `META_CAPI_ACCESS_TOKEN` set by the operator at a masked prompt (Sensitive, Production only), verified listed at 18:37:24Z; all three P-324 variables are in place and unused until P-324's code deploys. |
| P-286, P-317 | Burnet preconditions | hauska-factory | off (Phase 1 prep) | 2 | **recompiled 2026-09-18** `_dispatches/2026-09-18_p286-p317-burnet-preconditions_dispatch.md` (the P-319 precondition is met; P-317's defect still live at `0f4558a4`) |
| P-354 | Georgetown's adopted rewrite is served (A-218) and every surface names its adoption and effective dates, never "vintage unknown"; a rule row carries both dates as fields | setback-corpus, legacy-design-tools, hauska-factory, hauska-map | 2 | **now (A-218: compile ahead of Wave 2)** | **closed-partial (lane). Map #421 (`b1b67641`) and LDT #720 (`2e7ca7c4`) MERGED and DEPLOYED 2026-09-18, inert until row dates are served;** factory #179 waits to be read against P-363 and the P-300 writer; corpus #11 and the 1.5.0 publish go with the consumer pin bumps after #179; the writer re-run for 48491 then P-350. Finding: `todayIso()` is the UTC date |
| P-352 | situsState conflict outcome (McLennan `48309:417476`, Hays `48209:88885`); phantom `48491:PRIVATE ROAD` retired and instantiation guarded | hauska-factory | 1 | 2 (after #175 deploys and P-335 merges; factory order after P-333) | **CLOSED (lane) 2026-09-18:** both named cells refuse with both readings; the two-county dry run moved exactly those two; six-county conflict count 2, equal to an independent reading. **MERGED 23:20Z** (#181, `94fd6d53`) after the seat merged main into it: four additive hunks in `parcel-record-fill.mjs` and one fixture line in P-333's test (its fake store now answers P-352's geometry query, since a real join-miss parcel has one geometry). Its deploy rides the record-fill image with P-333 and P-335 under the gate-scheduler procedure; then `factory-retire-phantom-record`, dry first. Note: a county-wide fill after deploy starts resolving Williamson's 282,570 unasserted `situsState` cells (P-350's territory). Finding: `CO` (county) is not in `ADDRESS_TOKEN_NOT_A_STATE`, so "GUAD CO" reads as Colorado at rung 1. **DEPLOYED 2026-09-19** (`4138ecfd`). **Phantom retired** (`wmm8k`, run `434b2d7f`: 1 record, 65 cells, 3 companion rows; read back 0; control intact). Williamson's fill resolved 282,487 `situsState` cells. **Finding (P-368):** the instantiation guard refused 82 Williamson keys that are real multipart R accounts with a CAD miss, not label keys; benign today (the records exist), a false refusal as a class. McLennan and Hays fills for the two named conflict cells are owed |
| P-353 | The map's Find box passes the coverage answer through (P-205's map half) | hauska-map | 3 | 2 | **MERGED (map #423 `0ac74348`) and LIVE (`fohg2os70`) 2026-09-18;** the BFF serves all four classes on the live alias (before: none). The P-205 probe re-run (`--rows P-205`) is owed to grade the Find box itself. A cortex outage now answers 200 `coverage_check_unavailable`, not 502 (operator's monitoring note in the close) |
| P-270 address half | The card's address line takes city and ZIP from the ledger (reopened on `48453:445501`); the X2 grader gains an address predicate | hauska-map, legacy-design-tools, doc_repo | 2 | 2 | **CLOSED-PARTIAL. Map #424 (`b08f4b89`) and LDT #721 (`bb3b5d06`) MERGED and DEPLOYED 2026-09-18** (PE `fohg2os70`, cortex-api `00843-yir`); the probe patch applied (repaired from a BOM, CRLF and mojibake copy; self-test 310 of 310; verified by violation). Live on `48453:445501`: the ZIP 78660 is served, **the city is not**, because the ledger serves `situsZip`/`situsCity`/`situsState` as `legacy-transitional` there and the fallback fires only on a record-served, absent-verified `situsCity`. Cut the situs rails over or let the fallback read the baked declaration: needs a card. The MCP label waits on the signed-in probe. Close `_inbox/2026-09-18_p270-address-half_close.json` |
| P-358 | The PDF forwards the ETJ determination (report-model, pdf/feasibility hardcode it) | hauska-engine | walk | 2 | **CLOSED (lane); MERGED engine #476 `cff8d882` 2026-09-18; not deployed** (engine-api follows latest: deploy `--no-traffic` and shift). Customer grade waits on P-336's apply. Findings: a declared `conflicting` reading with no body beside a non-incorporated city-limits reading falls to `present`; `composeConflict` defaults the source to `tx_etj_boundary` (both on the bodiless cell shapes to reconcile against P-336) |
| P-359 | ETJ rings that contain their own city; 24 invalid rings | legacy-design-tools (tx_etj_boundary) | walk | 2 | **MERGED 2026-09-19** LDT #724 `25bde5a8`. **Deploy gate (the seat's):** migration 0104 adds `served_status` defaulting to `underived`, and the reader refuses every `underived` ring. So the next cortex-api deploy (whatever it carries) must follow 0104 applied AND the ETJ re-ingest (dry run first); otherwise every ETJ determination in six counties reads `unresolved`. Then P-336's apply |
| P-360 | Probe legs for P-332 (etjStatus) and P-327 (retirement verdict) | doc_repo | 2 | 2 (after P-332 deploys) | carded 2026-09-18 (seat) |
| P-361 | Threshold 0.05 program-wide (A-220): factory declaration, #474 re-pinned and merged, factory CI reads the engine's copy | hauska-factory, hauska-engine | off (controls) | 2 | **MERGED 2026-09-18:** factory #182 `5a3877f9` then engine #474 `7c42e1c8`, in the lane's order. After main was merged in, P-352's new unwired writer broke two checks (its reason lacked the RE-READ AT 0.05 verdict; the guard's content moved under #474's pin); the seat added the verdict (HOLDS: one key) and re-pinned #474, both directions shown with each repo's own check. The factory pin job now reads engine MAIN and passes. #474 renames the override variable to `DESTRUCTIVE_WRITE_AUTHORISATION`. Not deployed: the factory half ships with the publish rebuild (after P-351) |
| P-362 | The LDT shift job's post-shift credential check can never run and reads its failure as a violation | legacy-design-tools | off (controls) | 2 | **CUSTOMER-CLOSED 2026-09-18 21:47Z:** merged #722 `85c63841` (the red `Test` was Postgres 53200 in an untouched suite; one re-run passed); the cortex-api shift (run 35398447652) checked out the repo and its post-shift step printed `RESULT=clean`, serving `00843-yir`, 4 tags, 39 required, 0 failing |
| P-363 | Setback cells written under an older corpus are re-resolved under the pinned one (387,237 citing 1.1.0; 6 San Marcos N-CM parcels on the wrong row) | hauska-factory | 1, 2 | 2 | **MERGED 2026-09-18 23:35Z** (#187, `415d3212`). Six per-county dry runs MATCH the prediction exactly (387,231 re-stamps, 6 value changes on the San Marcos N-CM parcels, 24 rail cells, 0 refusals), copied to `_inbox/2026-09-18_p363_dryrun/`. **Seat apply owed:** after the record-fill/setback image deploys, county by county, dry run first; snapshot the re-stamp population from the store before applying (the run record names value changes only; a count is not a record); Williamson dry-run only (P-350). Finding for a card: the envelope writer has the same frozen-older-corpus shape, citation-only (709,945 cells, re-resolving moves 0 values) |
| P-365 | The P-263 apply renews its write lease every batch and refuses when it is lost; the reversal takes one too | hauska-engine | 1 (Williamson's P-263) | 2 | **MERGED 2026-09-19** engine #477 `21375ef9`; apply image rebuilt `f5d0691e`; **Williamson applied on it** (see P-263 apply): 2,395 heartbeats for 2,395 batches, write lease held 2,424.5 s against a 15-minute TTL, released normal |

**Factory merge order in wave 2**, one at a time, each re-greened against the base it merges into:
P-333, then P-334/P-329/P-330, then P-300/P-338's writer half, then P-336's writer half.

### 3b. Integration seat

| Row | What | Exit | Wave |
|---|---|---|---|
| P-347 | Probe corrected to ruling 13; `--use-system-ca`; engine key for the PDF leg; PDFs built for the 45 fixture parcels; re-run; P-270 X2 confirmed or reopened; coverage graded | 2, 3 | 1, and again at exit. **PARTIAL 2026-09-18:** all done but the MCP leg (sign-in helper built; needs a client identity, then the operator's sign-in). 52 PDFs served. Record `_inbox/2026-09-18_p347_customer_leg_wave1_record.md` |
| P-348 | McLennan `situsState` (1 parcel), Williamson `buildingFootprint` (1 parcel) | 1 | 1. **DONE (read) 2026-09-18:** both named and read, plus a third cell the ledger scored as passing; fix carded as P-352. Record `_inbox/2026-09-18_p348_two_open_cells_read.md` |
| P-337 | `RAIL_POLICY` exclusions for rulings 3 and 4, with couplings and self-tests | 1 | 1. **DONE 2026-09-18:** 47 of 47 self-tests, acceptance tests seen failing before the register entries existed; live run 13:52Z moved both rails to ruled in all six counties (prediction held exactly) |
| P-258 | Setback writer re-run and census re-grade (precedes P-300) | 1 | 1. **CLOSED AS MEASURED, NOT RUN (2026-09-18 17:45Z):** the San Marcos re-check HOLDS (88.38 percent under 1.4.0); a re-run would move zero cells in all six counties (dry runs `9pg2r`, `v7xfd` equal the stored counts), because the writer never reopens an earned value. San Marcos's switch is P-363 (387,237 cells still cite 1.1.0; 6 N-CM parcels hold the wrong row) plus P-349's Hays bake. Records `_inbox/2026-09-18_san_marcos_coverage_recheck_RECORD.md`, `_inbox/2026-09-18_p258_rerun_check_RECORD.md`. Next: the P-255 census re-grade, then P-300 with P-338 (needs a dispatch) |
| #175 | Deploy `cloudbuild.parcel-record-fill.yaml` under the gate-scheduler procedure (pause the hourly trigger, deploy, grade a cycle, resume); no fill `--apply` before it | 1 | 1. **DONE 2026-09-18:** deployed `7152d3b0`; gate cycle reproduced 390 of 390 verdicts; trigger resumed 15:24:53Z. Record `_inbox/2026-09-18_p325_175_deploy_RECORD.md` |
| dblink | Confirm no dependents, then drop the extension on production | off | 1. **DONE 2026-09-18 14:00:23Z**, verified from a separate session. Record `_inbox/2026-09-18_dblink_drop_RECORD.md` |
| LDT deploy | After P-323: carries P-257, P-270 and P-322's LDT halves and P-206's XD-6 fix | 2 | **DONE 2026-09-18 15:54Z:** cortex-api `00841-jeh` (LDT `25d1782f`), canary 90/90 PASS; P-206 was already live; the workflow's post-shift check is broken (P-362). Record `_inbox/2026-09-18_ldt_cortex_api_deploy_RECORD.md` |
| P-263 apply | Run P-342's writer county by county, dry run first, each capped at its measured share | 2 | 2. **FIVE OF SIX APPLIED 2026-09-18 20:40Z to 21:23Z** (Travis, Caldwell, Bastrop, Hays, McLennan; 220,260 atoms), job `hauska-engine-p263-apply` on engine `c41a1482`, six fresh dry runs identical to the lane's; each county read back from the store (journal equals the dry run, every stored hash equals the after-hash, one lease holder) with its reversal named; McLennan on its printed token; the 30,434 withheld untouched. **Williamson APPLIED 2026-09-19** on the P-365 image (`4hr57`, 239,491 atoms; fresh dry run `r577x` reproduced digest `e53c197f`; stored hash equals after-hash 239,491 of 239,491). **ALL SIX DONE: 459,751 atoms, the lane's census.** Record `_inbox/2026-09-18_p263_apply_RECORD.md` section 6 |
| P-321 schedule | After P-334; **hourly** (operator, 2026-09-18) | off | 2 |
| P-294 | Schedule created disabled, one dry cycle, graded | off | 2 |
| Austin stamp | Session CLI under a production lease, then the P-255 census | 1 | 2 |
| Hays join-miss delta | 2,770 cells applied against 1,069 measured, read before P-308's re-vendor | off | 2 |
| P-350 | Williamson fill applied, staging publish, production on the operator's go, PITR branch deleted | 1, 2 | 3. **2026-09-19: all four preconditions shipped (P-327, P-333, P-335, P-351); publish image `502e9734` (bake LDT `03bb424a`); census re-taken; fill APPLIED 03:52Z; phantom retired 03:55Z.** The 04:00Z cycle graded the county: **16 of 16 floor rails pass** post-fill. **Staging publish `cswmw` REFUSED** in the bake (`BAKE_FAILED`, nothing written) after readiness, the coverage floor and the retirement gate all passed: P-351's writer-(b) guard refused because `txgio_parcel` holds no numeric Williamson ids, so the account-keyed prepass excludes the whole live numeric keyspace (the 09-17 mechanism, refused). **Blocked on P-370** (writer (b) resolves membership through the published pair); P-371 so the next refusal carries its reason. Production not requested; PITR branch kept. Record `_inbox/2026-09-19_p350_williamson_RECORD.md` |
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
| P-364 | Zoning layers and district tables for the zoned cities A-224 class (a) finds among the 40 no-layer cities (Manor and Lago Vista at least: 20,826 parcels) |
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
| 2026-09-19 05:40 | A-230. **Six lanes landed, awaiting the seat:** P-367 (factory #190, closed; apply is the seat's: 709,945 cells re-stamped, 0 value changes predicted), P-339 MCP half (LDT #728), P-366 (LDT #726; re-enables a dead atom-chain read path, to be graded), P-340 (map #427, LDT #729; needs the card re-baked after deploy), P-270 city half (map #426, LDT #727), P-300 city classification (table filed; 8 cities unclassified). **Next wave compiled:** the P-300/P-338 writer build (recompiled against the table), P-368, P-369 (now all owed drift-check rows; after the seat's merges), P-370, P-371, P-372, P-373, P-374 (these three after the seat merges #726/#728), P-375. |
| 2026-09-19 04:55 | A-228, A-229. **Dispatches compiled** for P-339 MCP half, P-340, P-270 city half, P-366, the P-300 split, P-367 (A-228), then P-368 to P-371 (A-229). **Merged** P-365, P-351 (both repos, pin re-pointed), P-359, P-331 (three repos). **Deployed** the record-fill image (graded 390 of 390), the publish image, the P-263 apply image and the phantom-retirement job. **Applied** P-263 Williamson (all six counties done), Williamson's fill (20 value-to-absent cells, named) and the phantom retirement. **Williamson's staging publish refused** by P-351's writer-(b) guard; P-350 waits on P-370. Cortex-api deploys now gated on 0104 plus the ETJ re-ingest (P-359). |
| 2026-09-18 23:40 | A-227. **The rest of the factory order merged:** P-352 (#181 `94fd6d53`, after the seat merged main into it), P-361 (factory #182 `5a3877f9` then engine #474 `7c42e1c8`, after the seat reconciled it with P-352), P-363 (#187 `415d3212`). P-361 and P-363 closes recovered from `C:\Users\cente` (the lanes' standalone windows rooted there). P-331 and the P-300/P-338 writer half recompiled and fired by the operator: P-331 reported done (close not yet read by the seat), the writer half in flight. Nothing deployed: the record-fill image (P-333, P-335, P-352), the setback writer (P-363) and the publish rebuild (P-334, P-361's factory half, after P-351) are the seat's next deploys. |
| 2026-09-18 22:25 | Signed-in probe after the Wave 2 deploys (`_inbox/2026-09-18_221332_surface_probe.json`): 38 PASS, 11 FAIL, 10 UNMEASURED over 59. **Coverage leg holds** (P-205 4 of 4 on map and MCP; P-210 3 of 3). Customer buckets 25/10/10 (was 23/15/7); X2-address opens on 11 of 40 subjects (the situs rails serve `legacy-transitional`, so the city-limits fallback never fires). P-333 and P-352 closed; P-333's merge waits on the operator's threshold ruling. |
| 2026-09-18 21:50 | A-225. **P-263 applied in five counties** (220,260 atoms, each capped at its exact measured share, verified from the store); **Williamson held by the operator** until the apply renews its write lease: **P-365** carded and compiled, OPS-24's fifth span extended to 358-365 (registry and gate together; self-test passes; the old literal fails the drift check). **Ten PRs merged:** map #421 to #424, factory #183 to #185, LDT #720 to #722, engine #476. **Deployed:** Property Explorer `fohg2os70` (Vercel held it STAGED through its own incident, then promoted it; graded live: P-353, P-341, P-339 PASS; P-270 ZIP served, city not) and cortex-api `00843-yir` (canary 93 of 93 identical; P-362 customer-closed on the shift). P-270's probe patch applied. Lane closes and artifacts for P-336, P-339/P-341, P-353, P-354, P-334/P-329/P-330, P-358 and P-362 copied to `_inbox`, verified identical. Still in flight: P-333, P-352, P-361, P-363, P-351, P-359, P-365. |
| 2026-09-18 18:30 | Operator status: nine Wave 2 dispatches fired and in flight (P-333, P-334/P-329/P-330, P-352, P-361, P-351, P-358, P-359, P-362, P-363); P-270's address half landed (closed-partial, PRs map #424 and LDT #721 open, artifacts brought from its seat worktree). Not yet fired: P-324, P-300/P-338 writer, P-338 surfaces, P-331 (held), P-286/P-317 (optional). Open lane PRs at close: map #421 to #424; LDT #720 to #722; factory #179 to #182; setback-corpus #11. P-324's Property Explorer env: `META_PIXEL_ID` and `PE_SITE_ORIGIN` added to Production by the seat; `META_CAPI_ACCESS_TOKEN` owed by the operator (command given: `vercel env add META_CAPI_ACCESS_TOKEN production --sensitive --cwd "P:\tmp\pe-vercel-env"`; not set at 18:29:42Z). |
| 2026-09-18 18:15 | P-342 migration 018 applied to the atoms store and verified by violation (DELETE and illegal UPDATE refused, PT342). P-263's apply needs an engine apply job first. |
| 2026-09-18 18:05 | P-255 census re-graded (false absences 219,472 to 0; 58,339 unaccounted equal P-326's population). A-224: ruling 5 amended by the operator, so a default line applies only where the city's ordinance sets one; P-300/P-338 compiled in two halves; P-364 carded (Phase 1). |
| 2026-09-18 17:45 | A-223: P-258's re-run checked before it ran and closed as a no-op (zero cells in all six counties); the handoff's premise that a Hays run switches San Marcos is wrong; P-363 carded and compiled; OPS-24 range extended to 363. |
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
