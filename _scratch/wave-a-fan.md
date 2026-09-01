# Wave A fan 2026-08-31

Planner seat: integration at P:/doc_repo on main `17555ce`.

OPEN 2026-08-31T21:00Z — Operator: spawn and supervise four compiled dispatches. Sub-agents do not commit. Verification stays with the planner.

| lane | plan row | store | worktree | branch | send |
|---|---|---|---|---|---|
| A1 containment | F-01 | neondb | P:/tmp/hauska-factory-a1-containment | feat/a1-containment | now, first in store queue |
| A2 wellfact gap | F-02 | none | P:/tmp/hauska-engine-a2-wellfact | feat/a2-wellfact-gap | now |
| A3 F1 chunked | F-11 | hauska_mcp | P:/tmp/hauska-engine-a3-f1-chunked | feat/a3-f1-chunked | HELD until A1 clear |
| A4 P3 build | F-05, F-06 | none | P:/tmp/hauska-factory-a4-p3-build | feat/a4-p3-build | now |

## GROUND-TRUTH 2026-08-31T20:54Z Neon compute share

Instrument: Neon MCP `list_postgres_databases` + `list_branch_computes` + `list_postgres_endpoints` on project `fancy-fire-06136146` (cortex-prod).

- Branch `br-crimson-feather-aphfmy91` holds BOTH databases: `neondb` (id 261796) and `hauska_mcp` (id 262847).
- That branch has ONE compute: `ep-lucky-truth-apodo8hr`, group size min=1 max=1, state active.
- Staging endpoints `ep-blue-unit` and `ep-wispy-fire` are idle and are not production.

Falsifier that would have proven they do not share: two databases on different branches or different endpoint ids. Observed: same branch, same endpoint id. They share compute.

Consequence: A3 does not start while A1 holds the store. A2 stays off hauska_mcp until A1 is idle. A4 is file-only and free.

## Serialization

A1 is the only heavy store lane in flight. One factory-p2-juris execute at a time. A3 clone is prepared and not started.

## Agents in flight 2026-08-31T21:02Z

- A1 d115dc91-fb7c-4e6a-83cc-9afe66b0bb94
- A2 19322ace-c930-4f1d-8431-528afe8ec5e8
- A4 c52feafe-0ebf-43a7-a05a-8ef1efac4949
- A3 418e8516-1e4f-4c68-ab72-5c24640252c3 started 2026-08-31T21:53Z after A1 released the store

Clones verified: factory A1/A4 at 5f9acc3, engine A2/A3 at 0e96e6a.

## A1 containment

OPEN 2026-08-31T21:08Z — Lane executing. CP1 filed. Order Caldwell, McLennan, Williamson, Travis. One execute at a time.

GROUND-TRUTH 2026-08-31T21:05Z — factory-p2-juris generation 5 image sha256:dd7c2a940fc57c4a91349749505458a502eda24d5d3d4b01584d514e2fc01acf. Field names: spec.template.spec.template.spec.containers[0].image and env IMAGE_DIGEST. Latest execution hwzq5 succeededCount=1. No running execution.

GROUND-TRUTH 2026-08-31T21:06Z — landing GROUP BY run_id on fancy-fire neondb. 48021 85f984c2 50264/11992/62256 bind holds. 48209 bdcf534f 61585/54835/116420 bind holds. 48055 bd9580d1 14361/10627/24988 present but HAND-CANCELLED, not a license. 48309 82c26c82 32422/81832/114254 on old digest. 48453 and 48491 zero rows.

GROUND-TRUTH 2026-08-31T21:07Z — Caldwell 48055 sentinel BEFORE execute. n_zero_rows=227, distinct_all=24989, distinct_ex_zero=24988. Disposition in-city Mustang Ridge place_fips 50200 method ring. Restated triple 14361/10627/24988. Not extrapolated from Bastrop.

LESSON — HELD_FIPS still 48453/48491 and runP2Juris never passes replay. Williamson/Travis will refuse COUNTY_HELD on this digest unless a later patch is deployed. Not patched before Caldwell.

DEAD-END — licensing Caldwell from bd9580d1. Planner ruling: re-run. A hand-cancelled run is not a write license.

GROUND-TRUTH 2026-08-31T21:04:37Z — execute factory-p2-juris-6gc9j args p2-juris --county=48055 --apply image sha256:dd7c2a94 jobGeneration 5. F1 14361/10627/24988. F2 unaided. Do not cancel.

GROUND-TRUTH 2026-08-31T21:05:51Z — Caldwell 6gc9j F2 succeededCount=1 duration 1m14.23s completionTime 21:05:51.415807Z. Unaided. Not cancelled.

GROUND-TRUTH 2026-08-31T21:06:00Z — Caldwell landing all 24988 on run 1e2529a3. 14361/10627/24988. F1 MET. Prior bd9580d1 binds zero 48055 rows. License is 1e2529a3 on sha256:dd7c2a94.

GROUND-TRUTH 2026-08-31T21:07:00Z — McLennan 48309 sentinel BEFORE execute. n_zero_rows=117, distinct_all=114255, distinct_ex_zero=114254, n_rows=130636. Disposition unincorporated method ring place_fips null. No restated interactive triple (01 cancelled). F1 is completion against 114254. Do not invent 32422/81832 as an oracle. F2 unaided.

## A4 P3 build

OPEN 2026-08-31T21:22Z — Build done, uncommitted. Planner commits. 0006 not applied. Live PE wire not this card.

LESSON — in-city with no landed setback table is unmeasured. not-applicable on that population is refused at classify, write, serve, and SQL CHECK. That is the 2026-08-31 ruling.

LESSON — L7 satisfied-absent is county SCORE vocabulary. Parcel rails use not-applicable / unmeasured / absent-verified. Copying the SCORE token is L7_VOCAB_ON_PARCEL.

LESSON — county-coverage easement is one row per T3 FIPS (48021, 48055, 48209, 48491). Serve projects it onto the parcel with a per-parcel basis. A basis identical across two parcels is BASIS_COLLISION.

DEAD-END — inferring absence from a zero atom count or from county_manifest display_state. That is ADR-029 stored-but-not-served.

GROUND-TRUTH 2026-08-31T21:04Z — clone P:/tmp/hauska-factory-a4-p3-build on feat/a4-p3-build at 5f9acc3. rail_absence and collect_close were zero files (glob and grep).

GROUND-TRUTH 2026-08-31T21:18Z — node --test test/p3-absence.test.mjs test/p2-job.test.mjs -> 26 pass, 0 fail. Arm 2 poison: emitOverride not-applicable on 48021:INCITY-NOTABLE throws IN_CITY_NOT_APPLICABLE. Stuffed serve row throws the same. Arm 1: 48055:RURAL-1 names utility-easement absent-verified at T3 asOf 2026-08-05T19:30:00.000Z; empty rail without the county row is EMPTY_RAIL.

OPEN — planner commits feat/a4-p3-build by explicit pathspec. 0006 apply is a recorded migrate job. PE/brief must call serveParcelBrief or ADR-029 returns.

## A2 well-fact gap

OPEN 2026-08-31T21:02Z — Executing compiled dispatch `_dispatches/2026-08-31_a2-wellfact-gap_dispatch.md`. Clone `P:/tmp/hauska-engine-a2-wellfact` on `feat/a2-wellfact-gap` at `0e96e6a`.

LESSON — well-fact persist PK is `did:hauska:well-fact:{parcelNodeId}:{wellKey}`. body.atomDid is `wlfact_<fnv>` of the same pair. Duplicate (parcel, wellKey) verifies 2 and stores 1. atomsWritten is slice.length. A count is not a record.

LESSON — `planCountyWellFacts` commented "On-parcel takes precedence over near-parcel for the same well" and the unit test only asserted pointInGeoJson. The planner emitted one row per well FEATURE. Two features with the same `buildApiNumber14(api)` on one parcel collapsed at upsert.

DEAD-END — Explaining 2087 from skippedUnusableKey or silent parcel skip. Those rows never enter planned[]. Job atomsWritten was 69000. Rejected.

DEAD-END — Re-running 48021 or reading neondb/hauska_mcp for unique (parcel, wellKey) while A1 holds ep-lucky-truth. Dispatch: write OPEN and stop.

GROUND-TRUTH 2026-08-31T21:09:47Z — vitest plan-county-well-facts + symnum-failclosed: 20 passed. Two same-API wells on one parcel: present=1, collapsedDuplicateWellKeys=1. Arithmetic 12079-2087=9992; 9992+56921=66913.

GROUND-TRUTH 2026-08-31T18:37Z (writepath-proof, reused): 48021 plan parcelsRead=63357 wellsIndexed=8751 present=12079 absent=56921 onParcel=2491 nearParcel=9588. Same plan as run 3dc46ece.

OPEN — |unique (parcelKey, wellKey)| on the 48021 well features is unmeasured. Predicted 9992. Check is a source read of tx_rrc_well x txgio_parcel after A1 releases ep-lucky-truth. Do not scan under A1.

OPEN — Uncommitted patch on feat/a2-wellfact-gap: planner wellKey dedupe (on-parcel wins), collapsedDuplicateWellKeys count, per-chunk plannedIn/writtenOut, CHUNK_PK_COLLAPSE refuse. Planner commits. Do not deploy. Do not execute factory-atoms-cad.

PLANNER REVIEW 2026-08-31T21:13Z — Accept collapse CLASS. Reject 2087 as predicted. 9992 = 12079-2087 is the known gap rewritten; the test that asserts it converts a defect into a spec. Source unique count still UNMEASURED. Re-read writer/batch/planner. Re-ran 20/20. CHUNK_PK_COLLAPSE is intra-chunk only. No commit. Review `_inbox/2026-08-31_a2-wellfact-gap_supervisor_review.md`.

LESSON — buildApiNumber14 empty/null -> 42000000000000. 14-digit APIs that already carry 42 lose the event suffix. Caldwell stored keys match the 8-digit path (`05534595` -> `42055345950000`). Empty-API merge is a leftover after wellKey dedupe.

PLANNER REVIEW 2026-08-31T21:28Z — Accept A4 as code-done. Re-read classify/write/serve and 0006. Re-ran 26/26. Arm 2 poison observed. SQL CHECK unfired (0006 unapplied). serveParcelBrief returns empty rails; assertNamedAbsence is the gate. No commit. Review `_inbox/2026-08-31_a4-p3-build_supervisor_review.md`.

GROUND-TRUTH 2026-08-31T21:07:43Z — execute factory-p2-juris-bbqmg args p2-juris --county=48309 --apply image sha256:dd7c2a94 jobGeneration 5. F1 completion vs 114254. F2 unaided. Do not cancel. One heavy op.

GROUND-TRUTH 2026-08-31T21:15:00Z — bbqmg still runningCount=1. Landing 48309 run a62e3fce 48000 rows (19531/28469) last_at 21:14:58Z. Old 82c26c82 still holds 66254. Progress not a size law. Do not cancel.

GROUND-TRUTH 2026-08-31T21:37:41Z — McLennan bbqmg F2 succeededCount=1 duration 29m58.19s completionTime 21:37:41.371216Z. Unaided. Not cancelled.

GROUND-TRUTH 2026-08-31T21:38:00Z — McLennan landing all 114254 on run a62e3fce. 32422/81832/114254 unresolved 0. F1 MET (completion vs measured 114254). Prior 82c26c82 binds zero 48309 rows. License is a62e3fce on sha256:dd7c2a94. Observed split equals old-digest emit; that is not a pre-stated oracle.

GROUND-TRUTH 2026-08-31T21:39:00Z — Williamson 48491 sentinel BEFORE execute. n_zero_rows=0, distinct_all=282570, distinct_ex_zero=282570, n_rows=304164. No sentinel. No restated split. F1 is completion against 282570. F2 unaided.

OPEN — CP2 filed. Live job requireReplayGate will likely refuse COUNTY_HELD on 48491 because runP2Juris never passes replay. Execute anyway as the card orders. Fast refuse is a proof. Do not deploy a patch.

GROUND-TRUTH 2026-08-31T21:45:09Z — execute factory-p2-juris-hcx7x args p2-juris --county=48491 --apply image sha256:dd7c2a94. F1 completion vs 282570. F2 unaided. COUNTY_HELD predicted. Do not cancel.

GROUND-TRUTH 2026-08-31T21:45:35Z — hcx7x failedCount=1 exit 1 textPayload COUNTY_HELD. Landing 48491 still 0. Write path confirmed live. Travis not started.

LESSON — requireReplayGate is starved: the trigger exists, the caller never supplies replay. A3-style dormant/starved split. File-side test already refused Travis without replay; the live job is the same.

PLANNER REVIEW 2026-08-31T21:52Z — Accept A1 as honest partial. Re-read landing GROUP BY disposition (in-city hyphen). Binds match. hcx7x failedCount=1 COUNTY_HELD. 32/32 tests. Hays complete>0 is presence-shaped; rewrite before commit. Store released. A3 may start. Review `_inbox/2026-08-31_a1-containment_supervisor_review.md`.

DEAD-END — executing Williamson/Travis on sha256:dd7c2a94 expecting TOTALS. The gate fires before chunks. Do not retry on this digest.

OPEN — uncommitted replayFromLandingRows patch. Planner commits, builds, pins a new digest, then Williamson then Travis. TOTALS UNMEASURED. A1 leaves the store.

## A3 F1 chunked

OPEN 2026-08-31T21:58Z — Store released by A1. Executing compiled dispatch `_dispatches/2026-08-31_a3-f1-chunked_dispatch.md`. Clone `P:/tmp/hauska-engine-a3-f1-chunked` on `feat/a3-f1-chunked` at `0e96e6a`. CP1 filed before first live chunk.

FALSIFIER (pre-registered, before any live chunk): Adding side, rear and sourceCodeAtomRef must not move 188103 or 158573. If either moves, the published figures were wrong. A timed-out chunk is UNMEASURED, never zero.

GROUND-TRUTH 2026-08-31T21:54Z — git rev-parse HEAD `0e96e6a2eb54a0563b23eaf9fb347191b3aa87ab` on feat/a3-f1-chunked. Instrument still reads sourceCodeAtomRef plus fieldProvenance front AND side AND rear.

DESIGN — chunk predicate `entity_id >= lo AND entity_id < hi` (and matching atom_did prefix). Never IN (SELECT LIMIT). Page size 8000 borrowed from DEFAULT_BAKE_PAGE_SIZE. Timeout stays 15s. Ledger `packages/retrieval/scripts/f1-chunk-ledger.jsonl`. Resume skips scored chunks.

One heavy scan. A2 unique-key read stays behind this lane.

GROUND-TRUTH 2026-08-31T22:00Z — current_database() = hauska_mcp via Neon MCP on fancy-fire / br-crimson-feather. Chunked --self-test pass. Timeout 15s. Starting 48021. Announced before first live chunk.

GROUND-TRUTH 2026-08-31T22:01:05Z — 48021 complete. placeholder 1969, layer-23 2315, other-dimensional 5219, nonPlaceholder 7534, nKeys 9503. entity_id and atom_did agree. Anchors HOLD. Two ranges, wallMs 3771 and 682. Timeout unraised. CP2 filed. Published 188103/158573 still UNMEASURED.

OPEN — continuing one scan: 48055, 48209, 48309, 48453, 48491.

GROUND-TRUTH 2026-08-31T22:02:15Z — six counties complete on hauska_mcp. Timeout 15s unraised. Zero UNMEASURED ranges.

| FIPS | placeholder | nonPlaceholder | nKeys | envelopes |
|---|---:|---:|---:|---:|
| 48021 | 1969 | 7534 | 9503 | 62260 |
| 48055 | 5170 | 337 | 5507 | 24006 |
| 48209 | 34454 | 0 | 34454 | 102143 |
| 48309 | 0 | 0 | 0 | 65814 |
| 48453 | 22011 | 150702 | 172713 | 172713 |
| 48491 | 124499 | 0 | 124499 | 282436 |

188103 stayed. 158573 stayed. Deltas 0. entity_id equals atom_did. McLennan 0 is scout nKeys=0 in 90ms, not a timeout zero. F4 not run. SETBACK_APPLY_HELD unlifted.

LESSON — A successful empty scout is a measured zero. Treating ranges.length===0 as missing plan would have left the published split UNMEASURED after Travis and Williamson scored.

LESSON — County-wide JSON CASE was the 15s miss. 8000-row range chunks ran 0.3-1.3s. wallMs is data. Do not fit a size.

DEAD-END — Neon get_connection_string returned the pooler host. Direct is ep-lucky-truth-apodo8hr without -pooler.

CLOSE filed `_inbox/2026-08-31_a3-f1-chunked_close.json`. Uncommitted runner on feat/a3-f1-chunked. Planner commits. Store released.

PLANNER REVIEW 2026-08-31T22:08Z — Accept A3. Independently re-read the runner. Re-ran `--self-test` and vitest 2/2. Live `hauska_mcp` nKeys and envelopes matched all six counties. Bastrop CASE 1969 / 2315 / 5219. Four ledger chunks re-scored (Travis first, mid, last; Williamson first and last) matched. County-wide Travis/Williamson CASE not re-run (that is the 15s miss). `SETBACK_APPLY_HELD` unlifted. No commit. Review `_inbox/2026-08-31_a3-f1-chunked_supervisor_review.md`.

OPEN — A2 unique-key read on `neondb` is unblocked. One heavy scan. Do not overlap another consumer of `ep-lucky-truth`.

## A6 totals

OPEN 2026-08-31T22:20Z — Operator: execute compiled dispatch `_dispatches/2026-08-31_a6-totals_dispatch.md`. Clipboard 16699 bytes. Clone `P:/tmp/hauska-factory-a6-totals` on `feat/a6-totals` at `5f9acc3`. Store `neondb` on `ep-lucky-truth`. A2 unique-key HELD behind this lane. Lane agent 1b2e30c6-5a9f-4d60-b50b-a0cd5eec3e00.

DEAD-END — retrying Williamson/Travis on `sha256:dd7c2a94`. Gate fires before chunks. Do not.

DEAD-END — shipping A1 `replayFromLandingRows` as-is. Hays `complete` is `total > 0`. A one-row Hays landing would lift Williamson. Rewrite to licensed Hays total 116420 on `bdcf534f`.

FALSIFIER (pre-registered): `complete.48209` true on a Hays landing total other than 116420. If that fixture passes, the gate is still presence-shaped.

LESSON — lane agent 1b2e30c6 hit monthly usage limit after confirming the starve. Planner continued in this seat.

GROUND-TRUTH 2026-08-31T22:23Z — landing GROUP BY run_id: 48021 85f984c2 50264/11992/62256; 48055 1e2529a3 14361/10627/24988; 48209 bdcf534f 61585/54835/116420; 48309 a62e3fce 32422/81832/114254; 48491 0; 48453 0.

GROUND-TRUTH 2026-08-31T22:24Z — node --test persist+job 36 pass 0 fail. Hays total 2 => complete false, Williamson COUNTY_HELD.

GROUND-TRUTH 2026-08-31T22:25Z — factory-p2-juris generation 5 still sha256:dd7c2a94. latestCreated hcx7x.

GROUND-TRUTH 2026-08-31T22:26Z — 48491 sentinel n_zero_rows=0, distinct_all=282570, distinct_ex_zero=282570 (n_zero=0). n_rows=304298 (A1 had 304164; denom held). F1 total === 282570.

CP1 filed. Cloud Build 741c5334-d5ad-4b0b-b31b-dcbff382da03 SUCCESS 1m54s. Job generation 6 image sha256:70e3f714. Not dd7c2a94.

F1 (stated before Williamson execute): unincorporated + in_city + unresolved === total AND total === 282570 AND unresolved === 0. F2 succeededCount=1 unaided.

DEAD-END — PowerShell `gcloud --args=p2-juris,--county=48491,--apply` collapsed to one argv `p2-juris --county=48491 --apply`. Execution `fxh2g` failedCount=1 exit 2 in 20s on sha256:70e3f714. Not COUNTY_HELD. Re-ran via cmd.exe.

GROUND-TRUTH 2026-08-31T22:30:29Z — execute factory-p2-juris-rrn5h args [p2-juris, --county=48491, --apply] jobGeneration 6 image sha256:70e3f714. F1 vs 282570. F2 unaided. Do not cancel.

GROUND-TRUTH 2026-08-31T22:31:28Z — 48491 landing run 713aad7f first chunk 4306/3694/8000. Gate opened. Progress not a size law. Do not cancel. Do not start Travis.

F1 (stated before execute): unincorporated + in_city + unresolved === total AND total === 282570 AND unresolved === 0. F2 succeededCount=1 unaided.

GROUND-TRUTH 2026-08-31T22:45:35Z — rrn5h failedCount=1 exit 1 completion 22:45:35Z. Operator: Postgres administrator command, unhandled pg Client error. First chunk 4306/3694/8000 on 713aad7f held. Not COUNTY_HELD. Not a timeout. Do not chase CU.

## Small reads 2026-09-01T00:12Z (hauska_mcp, before Williamson re-run)

Instrument: Neon MCP run_sql, fancy-fire br-crimson-feather, entity_type cad-parcel-roll, half-open entity_id FIPS ranges. Store present. Type present. A missing store would have been reported as absent, not zero.

Owner coverage (key vs nonempty):

| FIPS | n_roll | ownerName key/nonempty | mail key/nonempty |
|---|---:|---:|---:|
| 48021 | 77078 | 77078 / 77078 | 77048 / 77048 |
| 48055 | 48384 | 48384 / 48384 | 48170 / 48170 |
| 48209 | 265881 | 29 / 29 | 0 / 0 |
| 48309 | 114280 | 113386 / 113384 | 114254 / 114254 |
| 48453 | 492851 | 3 / 3 | 0 / 0 |
| 48491 | 319487 | 7 / 7 | 0 / 0 |

MCP catalog question: serving paid-class owner on public-free roll TODAY in Bastrop, Caldwell, McLennan. Path open and empty in Hays, Travis, Williamson.

CAD value columns (key / positive / stored-zero):

| FIPS | land | imp | market | assessed |
|---|---|---|---|---|
| 48021 | 77078 / 63095 / 13981 | 77078 / 50523 / 26553 | 77078 / 77058 / 20 | 77078 / 77053 / 20 |
| 48055 | 48384 / 27281 / 21103 | 48384 / 23832 / 24552 | 48384 / 41239 / 7145 | 48384 / 41237 / 7145 |
| 48209 | 29 / 17 / 6 | 29 / 16 / 5 | 29 / 29 / 0 | 29 / 0 / 0 |
| 48309 | 113348 / 113339 / 3 | 91074 / 91061 / 4 | 113386 / 113382 / 1 | 26 / 0 / 0 |
| 48453 | 3 / 2 / 0 | 3 / 2 / 0 | 3 / 3 / 0 | 3 / 0 / 0 |
| 48491 | 7 / 7 / 0 | 7 / 6 / 0 | 7 / 7 / 0 | 7 / 0 / 0 |

Hays / Travis / Williamson value keys are absent on nearly all rolls, not stored zeros. McLennan assessed is absent (26 keys, 0 positive). Bastrop/Caldwell land and improvement carry the stored-zero class.

OPEN — re-run Williamson on sha256:70e3f714. Resume from ledger. If it dies again, STOP and pull Neon operations log. No third run.

F1 (stated before Williamson re-run): unincorporated + in_city + unresolved === total AND total === 282570 AND unresolved === 0. F2 succeededCount=1 unaided. Image sha256:70e3f714 generation 6. Landing 713aad7f still holds 8000. Resume, do not restart.

GROUND-TRUTH 2026-09-01T00:13:31Z — execute factory-p2-juris-8qn9d args [p2-juris, --county=48491, --apply] jobGeneration 6 image sha256:70e3f714. F1 vs 282570. F2 unaided. Do not cancel.

GROUND-TRUTH 2026-09-01T00:14:59Z — new run f5ae0df0 wrote 4306/3694/8000. Same first-page split as 713aad7f's first chunk. 713aad7f still holds 8000 (3141/4859, last_at 22:32:52Z). Completed chunks are keyed by run.id. A new execute mints a new run, so the ledger did not resume. Do not cancel 8qn9d. Do not start a third execute.

LESSON — loadCompletedChunks(factory, run.id). Without --run-id of the failed run, Cloud Run apply is a restart, not a resume.
