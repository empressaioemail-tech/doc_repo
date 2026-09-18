---
id: 2026-09-18_phase0_closeout_REGISTER
title: Phase 0 close-out register (living)
date: 2026-09-18
last_updated: 2026-09-18 (12:10Z, A-216: rulings 9 and 19)
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
| 1 Ledger | `scripts/six-county-completeness.mjs` exits 0 | **67 open, 12 unmeasured.** Open: 30 mid-cutover (5 rails x 6 counties), 30 setback (5 rails x 6 counties), 6 Williamson-only (`acreageSqft`, `landUseVintage`, `situsState` 282,570 each, `exemptionCodes` 187,186, `landUseSource` 25,775, `buildingFootprint` 1), 1 McLennan (`situsState`, 1 parcel). Unmeasured: `roads` and `edgeSignal` in all six, waiting on P-264. `false-earned: none` | 2026-09-17 22:03:12Z; nothing applied since | P-336, P-337, P-300 with P-338, P-335 then Williamson's fill, P-348, P-264 with ruling 8 |
| 2 Customer | `scripts/surface-probe.mjs` passes on map, MCP and PDF; XD/X open count zero or ruled | **45 buckets: 0 PASS, 17 FAIL, 28 UNMEASURED; 11 of 23 XD/X defects OPEN.** Measured BEFORE the engine deploy (P-260) and the 2026-09-18 Property Explorer deploy (P-257, P-270 map halves), so it overstates what is open today | 2026-09-17 19:20:35Z, doc_repo `699f886b` | P-347 (the re-run and its inputs), P-323 then the LDT deploy, P-339 to P-341, P-342's apply, P-335 (XD-7), P-349 |
| 3 Coverage | P-205, P-210 | Recorded live (roadmap Done) | 2026-09-17 | A grade at exit (P-347) |
| 4 Road residual | P-264's per-city artifact | Lane still running | 2026-09-17 | P-264 lands; the operator rules per city (ruling 8) |
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
| 8 | Roads and edgeSignal ruled per city when P-264 lands | open, waits on P-264 |
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
| 19 | San Marcos served from corpus 1.4.0 after the coverage re-check holds; Georgetown withheld until 2026-11-01 and never cited from the not-yet-effective rewrite (A-216) | P-349 |
| + | `dblink` dropped; PITR branch deleted after 48491 republishes; P-321's watch runs hourly | seat; P-350; P-334 then the seat |

## 3. Everything that must be done

`Exit` names the leg a row moves; `off` means it is off the exit path and still gets done. `Wave` is
when it starts; a row's own `Depends` in OPS-16 is the authority where they differ.

### 3a. Lanes (dispatched work)

| Row | What | Repo | Exit | Wave | State |
|---|---|---|---|---|---|
| P-323 | Tag hygiene; unblocks every LDT deploy | legacy-design-tools, gcloud | 2 | 1 | compiled |
| P-332 | Panel serves the ETJ determination, declares the conflict | hauska-map | walk | 1 | compiled |
| P-335 | Williamson WCAD crosswalk loader | hauska-factory | 1, 2 | 1 | compiled |
| P-327 | P-319's gate measured against the roll the bake retires from | hauska-factory | before P-350 | 1 | compiled |
| P-342 | P-263's apply writer; the 30,434 withheld | hauska-engine | 2 | 1 | compiled |
| P-328 | The engine's parcel-node reconcile under the shared threshold | hauska-engine | off (safety) | 1 | compiled |
| P-336 | P-204 A and B cut over: cells written, graded, served | hauska-factory, hauska-engine, doc_repo | 1 | 2 | carded |
| P-339, P-340, P-341 | Surface agreement: envelope reason, table disagreement, impervious; Waco XD-2 | hauska-map, legacy-design-tools | 2 | 2 (after P-332 merges) | carded |
| P-300 with P-338 | Jurisdiction-default line, broadly; district-miss refusal names district and city | corpus, hauska-factory, surfaces | 1, 2 | 2 (after P-258's re-run) | carded |
| P-333 | Genuine join-miss absences restored per population | hauska-factory | off (accuracy) | 2 (after P-335) | carded |
| P-351 | The bake's retirement arm made keyspace-aware | legacy-design-tools | before P-350 | 2 (after P-335) | carded |
| P-334, P-329, P-330 | Watch can run; `ldt-sha` check; runner continues past a declared refusal | hauska-factory | off (controls) | 2 | carded |
| P-331 | A cross-repo drift check that can fail | hauska-map, legacy-design-tools | off (controls) | 2 | carded |
| P-324 | Pixel attribution deploy | legacy-design-tools | off | 2 (after P-323) | compiled 2026-09-17 |
| P-286, P-317 | Burnet preconditions | hauska-factory | off (Phase 1 prep) | 2 | compiled 2026-09-17 |

**Factory merge order in wave 2**, one at a time, each re-greened against the base it merges into:
P-333, then P-334/P-329/P-330, then P-300/P-338's writer half, then P-336's writer half.

### 3b. Integration seat

| Row | What | Exit | Wave |
|---|---|---|---|
| P-347 | Probe corrected to ruling 13; `--use-system-ca`; engine key for the PDF leg; PDFs built for the 45 fixture parcels; re-run; P-270 X2 confirmed or reopened; coverage graded | 2, 3 | 1, and again at exit |
| P-348 | McLennan `situsState` (1 parcel), Williamson `buildingFootprint` (1 parcel) | 1 | 1 |
| P-337 | `RAIL_POLICY` exclusions for rulings 3 and 4, with couplings and self-tests | 1 | 1 |
| P-258 | Setback writer re-run and census re-grade (precedes P-300) | 1 | 1 |
| #175 | Deploy `cloudbuild.parcel-record-fill.yaml` under the gate-scheduler procedure (pause the hourly trigger, deploy, grade a cycle, resume); no fill `--apply` before it | 1 | 1 |
| dblink | Confirm no dependents, then drop the extension on production | off | 1 |
| LDT deploy | After P-323: carries P-257, P-270 and P-322's LDT halves and P-206's XD-6 fix | 2 | 2 |
| P-263 apply | Run P-342's writer county by county, dry run first, each capped at its measured share | 2 | 2 |
| P-321 schedule | After P-334; **hourly** (operator, 2026-09-18) | off | 2 |
| P-294 | Schedule created disabled, one dry cycle, graded | off | 2 |
| Austin stamp | Session CLI under a production lease, then the P-255 census | 1 | 2 |
| Hays join-miss delta | 2,770 cells applied against 1,069 measured, read before P-308's re-vendor | off | 2 |
| P-350 | Williamson fill applied, staging publish, production on the operator's go, PITR branch deleted | 1, 2 | 3 |
| P-349 | San Marcos coverage re-check, then served from 1.4.0; Georgetown kept withheld and uncited until 2026-11-01; then the Hays bake; P-260 customer-closed | 2 | 2 to 3 |
| Roads | P-264's artifact read; ruling 8 taken; any road work carded | 1, 4 | 3 |
| Exit re-run | Ledger to COMPLETE, customer to zero open or ruled, coverage graded, then the walk | all | 3 |

### 3c. Owed by the operator

| Item | Blocks | Note |
|---|---|---|
| Sign in when the probe runs (ruling 9, A-216) | Exit leg 2 | The seat will say when; converts 28 UNMEASURED buckets |
| Roads per city (ruling 8) | Exit legs 1 and 4 | After P-264 |
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
- A county's served keys, its parcel index and its CAD roll can sit in three different keyspaces
  (Williamson). A control that reads one of them does not protect the others.

## 5. Change log

| When (UTC) | Change |
|---|---|
| 2026-09-18 12:10 | Operator rulings 9 (sign in per run) and 19 (San Marcos served, Georgetown withheld to 2026-11-01) recorded as A-216. |
| 2026-09-18 11:40 | Created from A-215. Wave 1 compiled: P-323 (recompiled with ruling 10), P-332, P-335, P-327, P-342, P-328. |
