# P2-JURIS-PERSIST scratch (F-01)

## LESSON
Factory `writer-allowlist.mjs` is job-level. Engine `atoms-writer-allowlist.mjs` is spawn-level. Not one rule twice. containment-persist stays off the engine list.

## LESSON
PERSIST_NOT_THIS_CARD after this card is a lie. Removed.

## DEAD-END
Importing publish-bake-chunks.mjs in file-side tests loads pg. pagePropIds lives in prop-id-pages.mjs and is re-exported. One chunker.

## GROUND-TRUTH
2026-08-31T16:05Z: persist tree from origin/main 3a0dc9a. `node --test test/p2-job.test.mjs test/p2-juris-persist.test.mjs` 23 pass / 0 fail. Bastrop/Caldwell exact triples pass. Off-by-one Bastrop refuses. Sentinel unnamed refuses. Travis held. Laptop apply frozen.

## GROUND-TRUTH
2026-08-31T16:46:46Z: Factory #46 merged as c643426. CI four conclusions SUCCESS on d665989. factory-p2-juris image sha256:6daf83a1.

## DEAD-END
2026-08-31T16:50:53Z factory-p2-juris-tm24v exit 2. Args arrived as one token `p2-juris --county=48021 --apply`. CLI printed usage. Not a partition miss. Windows `--args=a,b,c` collapsed. Next execute uses `^|^` delimiter. Job not adjusted.

## GROUND-TRUTH
2026-08-31T16:53:23Z factory-p2-juris-gzr6z PARTITION_MISMATCH. Job 50264/11992/62256. Oracle 50265/11992/62257. Bastrop prop_id '0': 168 rows, 1 distinct. 01 includes it. Job excludes it. in_city 11992 agrees.

## DEAD-END
Do not write sentinel 0 to chase 62257. That absorbs the named exclusion.

## OPEN
Stale. Ruling accepted. See OPEN at bottom.

## GROUND-TRUTH
2026-08-31T18:20Z: ruling d86b6cb accepted. 48021 restated 50264/11992/62256 as DERIVED CORRECTION. Cause: interactive 01 counted distinct prop_id including sentinel 0; card excludes txgio_parcel_sentinel_zero; 168 rows at 0 = one key; distinct_all 62257 minus that key = 62256. in_city unchanged.

## GROUND-TRUTH
2026-08-31T18:22Z: 48055 sentinel census. n_zero_rows=227, distinct_all=24989, distinct_ex_zero=24988. Disposition of 0: in-city, Mustang Ridge place_fips 50200, method ring. RESTATED Caldwell 14361/10627/24988. Absence of a sentinel would have left 14361/10628/24989; this is a measurement.

## GROUND-TRUTH
2026-08-31T18:22Z: 48209 sentinel census. n_zero_rows=375, distinct_all=116421, distinct_ex_zero=116420. Disposition of 0: unincorporated, method ring. No interactive unincorporated/in_city split exists. Hays falsifier is completion; denom 116420 from the start. Do not invent a triple.

## GROUND-TRUTH
2026-08-31T18:25Z: fa457af1 disposition NAMED, not left for A-022(5). Planner terminate script found the run ALREADY closed by the reaper at 2026-08-31T17:00:41.711Z. status=crashed, exit_kind=crashed, recorder=reaper, reason=execution-finished, execution=factory-p2-juris-gzr6z, matched_by=execution-name, refuse_code=null, max_duration_s=3600. Second writeTermination refused ALREADY_TERMINATED path (script exited alreadyTerminated). Planner did not overwrite. Execution gzr6z is dead (failedCount=1). PARTITION_MISMATCH lives in the Cloud Run log and the live close, not on refuse_code.

## GROUND-TRUTH
2026-08-31T18:54:27Z: Hays factory-p2-juris-kjcrx COMPLETED. 15 chunks, 116420 rows, 61585/54835, each got===n. Run bdcf534f success, termination by containment-persist. Cloud Run 14m16s succeededCount=1. Image sha256:56a8ee75. Operator 180s-was-the-instrument claim CONFIRMED. wallMs 52.0/56.3/51.1/62.5/61.0/58.1/53.7/51.6/40.2/42.1/92.9/82.4/49.9/48.0/36.4. The 92.9 licenses nothing.

## OPEN
Travis/Williamson stay COUNTY_HELD (operator: do not run). McLennan 48309 not run. TOTALS UNMEASURED. Bastrop landing 62256 from crashed fa457af1 is unlicensed for setback bake unless operator says so.

## GROUND-TRUTH
2026-08-31T18:28:07Z: Caldwell factory-p2-juris-cqgnd four chunks, each got===n. Totals 14361/10627/24988. Landing 24988 for run bd9580d1. MATCH against restated oracle. wallMs 10.6 / 19.2 / 22.0 / 2.5. No curve.

## DEAD-END
2026-08-31T18:28:07Z-18:33:50Z: success path left Factory pg client open; Node event loop stayed alive; Cloud Run never completed. Bastrop only exited because throw → process.exit(1). Planner cancelled cqgnd (cancelledCount=1). Not a 180s miss. Not a partition miss.

## GROUND-TRUTH
2026-08-31T18:35:04Z: bd9580d1 terminated success by planner-p2-juris-persist. Factory #49 is the close-path fix (end client + writeTermination). Hays waits for that image.
