# F-10 wave 1 scratch

## GROUND-TRUTH (2026-08-27T19:40Z)
PR #12 merged 99b2cb3. Image digest sha256:d0232cccc06d5545f4d27f0ffcd434a1bbf7403754fdd7433f78fbac04a7a254. Cloud Build 7e7a0c77.

First factory-f10-cad-loop Cloud Run execution: factory-f10-cad-loop-9hqxp, loop run b4234513, succeeded 2273s wall. CP2 filed _inbox/2026-08-27_f10-wave1_cp2.json.

CP2 counts: 5 pass, 1 skip (48021), 4 defects (48029, 48031, 48055 replay-not-identical, 48085). Rate distribution n=6 min 355 max 724 atoms/s.

## LESSON
PowerShell gcloud deploy: quote '--command=node,src/cli.mjs' and '--args=f10-cad-loop,--apply' or command collapses to invalid single executable.

## LESSON
Laptop abort duplicate launches: planCadWorkList lacks idempotency; two loop runs 8b27+bb4d both succeeded overlapping conformant jobs.

## GROUND-TRUTH (2026-08-28T01:00Z)
CP3 planner ruling filed `_inbox/2026-08-28_f10-wave1_cp3.json`. Criteria 1,2,6 MET; 3 NOT MET (re-run disposition rejected); 4 OPEN (A-016 chunking, not RAM); 5 deferred until chunking. Full 254 loop NOT GO.

254-county dry-run `factory-f10-cad-loop-4j6pr` run `23b956fb`: execute 25, idempotent 6, skip-by-class 6, noLanding 217 (TX-LANDING-ABSENT), defects 217 total in loop counts.

Bexar wrn26: 16Gi/4CPU, signal kill at 3.6 min (run `87078753`). 48085 4s977: signal after pipeline1 on 8Gi, 387334 landing / 774668 atoms in memory. Cause: whole county held in memory, not OOM exit.

## OPEN
A-016 code landed seat/property-f10: chunk ~50k, run_event per chunk, merge per chunk stagedSince, peakMemoryMb in chunk events. **Next: rebuild factory-conformant image + Bexar 48029 execute.**

## GROUND-TRUTH (2026-08-28T03:02Z)
Bexar chunked execute in flight: `factory-conformant-2nd9z` on digest `sha256:8fd1cd3af664db0b3bc8b52e9a15fabfebdca090b607a0eb1899c23cd8634bdc` (build f484e6a7). Commit `694c286` on seat/property-f10.

## LESSON
A-017: 217 no-landing counties are absent sources (lookup-failed on manifest), not loop defects; wave 1 = 31 with landing.

## OPEN
Criterion 5: CP2 list 10/10 once after chunking + criterion 3.

## OPEN
Wait planner go before factory-f10-cad-loop --apply full 254.
