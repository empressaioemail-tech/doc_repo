# F-10 wave 1 scratch

## GROUND-TRUTH (2026-08-27T19:40Z)
PR #12 merged 99b2cb3. Image digest sha256:d0232cccc06d5545f4d27f0ffcd434a1bbf7403754fdd7433f78fbac04a7a254. Cloud Build 7e7a0c77.

First factory-f10-cad-loop Cloud Run execution: factory-f10-cad-loop-9hqxp, loop run b4234513, succeeded 2273s wall. CP2 filed _inbox/2026-08-27_f10-wave1_cp2.json.

CP2 counts: 5 pass, 1 skip (48021), 4 defects (48029, 48031, 48055 replay-not-identical, 48085). Rate distribution n=6 min 355 max 724 atoms/s.

## LESSON
PowerShell gcloud deploy: quote '--command=node,src/cli.mjs' and '--args=f10-cad-loop,--apply' or command collapses to invalid single executable.

## LESSON
Laptop abort duplicate launches: planCadWorkList lacks idempotency; two loop runs 8b27+bb4d both succeeded overlapping conformant jobs.

## OPEN
Reaper: Cloud Run "signal terminated" exit 0 classified crashed not killed (8njc9, kzzhx). Amendment before full loop.

## OPEN
Wait planner go before factory-f10-cad-loop --apply full 254.
