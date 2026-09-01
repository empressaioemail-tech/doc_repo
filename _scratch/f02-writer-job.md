# f02-writer-job

OPEN: this stood-down seat is closed (A-004). factory-atoms-writer declined. 149.0 on the record. Do not recreate the job.

GROUND-TRUTH (2026-08-27T01:35Z): us-east4 jobs are the twelve factory-* landing/control jobs. No factory-atoms-writer. Engine main b402c8b. Factory main 07f48c2. Writer branches one commit ahead, both wrong vs the card.

LESSON: Prior seat/property-writer commits put FACTORY_DATABASE_URL on the engine image and added packages/engine-core/scripts/atoms-writer-job.mjs. Card forbids both. Revert packages/; Factory writes the run row.

LESSON: Lease v2 row is scope_type=write scope_id=cad-parcel-roll:48029, not cad_property/48029. Writer is the authority.

DEAD-END: bexar-cad.mjs + factory-atoms-cad + RUN_ID env. Counts from gcloud exit. Do not deploy that path.

GROUND-TRUTH (2026-08-27T01:46:55Z): engine build 79f7c704 SUCCESS. Digest us-east4-docker.pkg.dev/hauska-prod-497015/hauska-factory/hauska-atoms-writer@sha256:4fea88dae546876bee6d18ffab81e01f45fce5284767457a956944f26689a13d.

GROUND-TRUTH (2026-08-27T01:48Z): factory-atoms-writer created by scripts/jobs/atoms-writer.sh. Tag refuse exit 2. No FACTORY_DATABASE_URL. ATOMS=hauska_mcp direct. SOURCE=neondb direct.

GROUND-TRUTH (2026-08-27T01:53Z): refusals zcbtz exit 1 USAGE; gjhds exit 2 LEASE_REQUIRED; pq5nn exit 2 OLD_SHAPE_FILL_FROZEN.

GROUND-TRUTH (2026-08-27T02:09:50Z): dry run factory-atoms-writer-bp272 success. 703257=703257. lease null. built 999 written 0.

GROUND-TRUTH (2026-08-27T02:14:26Z): canary factory-atoms-writer-msmfx success. since=999 log written=999. wallMs 6706. 149.0 atoms/s. Under floor 150. Stop.

LESSON: local gcloud builds submit has empty COMMIT_SHA. Tag with _ENGINE_SHA.

LESSON: Node 24 fetch to run.googleapis.com on this laptop fails UNABLE_TO_VERIFY_LEAF_SIGNATURE. gcloud execute is the laptop orchestrator. Apply still runs only on the job.

LESSON: Bexar canary is a rewrite. count(*) stays 703257. atoms_built is updated_at >= run start.

DEAD-END: treating factory-atoms-writer as the A-003 runner. A-003 is factory-atoms-cad.

GROUND-TRUTH (2026-08-27T02:20:30Z): A-003 canary factory-atoms-cad-zkwd6 999 written, writer 67.4/s, under floor 150. Stop. No full resume.

GROUND-TRUTH (2026-08-27T10:25Z): planner accepted F-02. Drain finish filed. Salvage deleted. Next is F-15..F-18 after a compiled dispatch. No old-shape apply.

GROUND-TRUTH (2026-08-27T10:21Z): factory-atoms-writer deleted on A-004 / operator word. describe: Cannot find job. execute: NOT_FOUND. factory-atoms-cad still Ready. Image 4fea88da left unreferenced. 149.0 atoms/s stays on the record (msmfx, wallMs 6706, 999 rewritten). Commit nothing.

DEAD-END: recreate factory-atoms-writer. Retired by decline. Successor must not recreate or execute it.

OPEN: this stood-down seat is closed. No further apply on this path.
