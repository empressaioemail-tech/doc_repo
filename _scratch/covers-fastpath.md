# COVERS-FASTPATH scratch (F-01)

## GROUND-TRUTH
2026-09-01T04:24:10Z: fb490620 already terminated by reaper as killed/execution-finished at 04:20:29Z. writeTermination would refuse ALREADY_TERMINATED. Named operator-cancellation event written on control store. 9 chunks / 72000 rows.

## GROUND-TRUTH
2026-09-01T04:14:11Z: factory-p2-juris-hzkqk cancelledCount=1, no failedCount. Store free.

## GROUND-TRUTH
2026-09-01T04:30Z: live factory-p2-juris image sha256:9e417502 (gen 7) is the uncommitted 57p01+replay tree, not origin/main 5f9acc3.

## LESSON
origin/main 5f9acc3 is behind the serving p2-juris image. A covers image built from main alone regresses heartbeat and HELD replay.

## DEAD-END
Relaunching --run-id=fb490620 under covers-v1 must refuse METHOD_VERSION_MISMATCH, not skip and not re-write. Silent skip would interchange methods. Silent re-run is a Williamson resume, which this card forbids.

## GROUND-TRUTH
2026-09-01T04:31:49Z: McLennan 100000-112364 measure wallMs=1097 emit 5876/2124/0/8000 identical. 55.7x. 9ttzj sha256:24e0fd9a.

## GROUND-TRUTH
2026-09-01T04:34:20Z: Williamson PRIVATE ROAD-R014834 measure wallMs=2105 emit 4306/3694/0/8000 identical. 40.2x. f6cmj.

## GROUND-TRUTH
2026-09-01T04:35:27Z: Williamson R014834-R031819 measure wallMs=1838 emit 3141/4859/0/8000 identical. 79.0x. wljqk. 80s falsifier did not fire.

## LESSON
Corridor overlay cost is gone. Uniform 8000-row pages are enough. Cost-budget chunking is not required for termination.

## OPEN
Planner commits feat/covers-fastpath. Next persist uses a new run id under covers-v1. Travis unblocked by numbers, still a separate card.
