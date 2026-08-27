# p81-drain

OPEN: next card OPS-19 F-15 to F-18. Ask the planner for a compiled dispatch before starting. Nothing on it is compiled yet.

GROUND-TRUTH (2026-08-27T10:25Z): drain card closed. Finish `_inbox/2026-08-27_p81-drain_close.json`. Salvage deleted (factory-atoms-writer scripts + untracked Dockerfile); tracked factory files restored to 625f3a8. Item 7 FAILED 149.0 and 67.4. Item 26 complete without resume. No further old-shape --apply.

GROUND-TRUTH (2026-08-27T01:31:54Z): factory #6 MERGED 1f94f8d. Check-run test conclusion SUCCESS (runs 33030352513 and 33030337665). CLI `bexar-cad` startRun then `gcloud run jobs execute factory-atoms-cad --update-env-vars=RUN_ID=`. seat/property-writer kept.

GROUND-TRUTH (2026-08-27T01:32Z): secret hosts (direct, not pooler): ATOMS_DATABASE_URL ep-lucky-truth-apodo8hr / hauska_mcp; SOURCE_DATABASE_URL ep-lucky-truth-apodo8hr / neondb with cad_property present and a 48029 row; FACTORY_DATABASE_URL ep-round-base-au0jofwp / neondb. DATABASE_URL and CORTEX_DATABASE_URL secrets are pooler; the job binds the de-poolered ATOMS/SOURCE names.

GROUND-TRUTH (2026-08-27T01:35:48Z): factory-atoms-cad Ready in us-east4. Image us-east4-docker.pkg.dev/hauska-prod-497015/hauska-factory/atoms-writer@sha256:afdef0bbdf8ab6d1dfd24fb6e8c172632394645ef6f6b53b717382f7f7c13733 (same string on IMAGE_DIGEST env). Secrets ATOMS/SOURCE/FACTORY bound. COUNTY=48029 APPLY=1 baked. timeout 21600 maxRetries 0. Cloud Build 3fcd9705 SUCCESS. This is the thinner wrapper path from #364.

GROUND-TRUTH (2026-08-27T01:35:27Z): engine #364 typecheck + test FAILURE. Cause: vitest found scripts/atoms-writer-job.test.mjs and reported "No test suite found" (node:test file, not a vitest suite).

GROUND-TRUTH (2026-08-27T02:20:30Z): factory-atoms-cad canary factory-atoms-cad-zkwd6 / run 7fd24437 succeeded. before=after 703257, since=999, writer wallMs 14821, 67.4 atoms/s. Floor 150. STOP. No full resume. Lease after null. Writer stdout lease holder_token 50606b47 scope write / cad-parcel-roll / 48029. Close rewritten at _inbox/2026-08-27_f02-writer-job_close.json (supersedes stood-down factory-atoms-writer close).

GROUND-TRUTH (2026-08-27T02:19Z): factory #8 MERGED 7d5f50d. Laptop TLS breaks Node fetch to run.googleapis.com; CLOUD_RUN_JOBS_VIA_GCLOUD=1 is the recorded path. Job pinned to atoms-writer@sha256:5a3bf94da8fd9951c280616afd459f499d1c4a85fda44d0eaaa9f3ccf83a7941, ENGINE_SHA 2c90b993. Recorded runs: no-args da0a1dae / factory-atoms-cad-5mxw8 (FATAL missing --county, container exit 1); lease da530b8b / factory-atoms-cad-sptb8 (inner write-cad exit 2 LEASE_REQUIRED, outer pnpm exit 1); old-shape c4daef6e / factory-atoms-cad-rxb6w (inner exit 2 OLD_SHAPE_FILL_FROZEN, outer pnpm exit 1); dry-run 44d0b840 / factory-atoms-cad-rq4t6 success 48.99s, before=after 703257, lease null. Unexpected 2zdgw is not the canary. Store already holds 703257 48029 cad-parcel-roll atoms; canary grades via updated_at >= apply_start, not a new-row delta.

OPEN: F-15..F-18 after a compiled dispatch. Drain worktree P:/seat-worktrees/property/hauska-engine-drain on seat/property-drain. Writer worktrees stay this lane. Never the primary engine worktree.

GROUND-TRUTH (2026-08-26T23:46:18Z): FACTORY_CONTROL_API_KEY rotation run 0fdaf217. factory-control-00002-gjr @100%. Secret v2 enabled, v1 disabled. Unauth /health and /counts 401 UNAUTHENTICATED. Old key 401. New key 200. Unauth POST /start 401. Console Vercel env is VITE_FACTORY_CONTROL_API only. Browser innerText on https://smart-site-factory.vercel.app shows {"error":"UNAUTHENTICATED"}. Fingerprints only: old 71bf9818ff7c, new e7b6d6256613.

GROUND-TRUTH (2026-08-26T23:53:53Z): hauska_mcp access-policy pre-step run 1186086b. Host ep-lucky-truth-apodo8hr.c-7.us-east-1.aws.neon.tech, database hauska_mcp, not pooler, never neondb. Before: atoms and jurisdiction_status DEFAULT 'public-free', schema_migrations_010 empty, icc_public_free=8731, icc_platform_internal=0. After: both defaults null, schema_migrations 010_drop_access_policy_defaults.sql applied_at 2026-08-26T23:53:53.551Z, backfill_updated=8731, icc_public_free=0, icc_platform_internal=8731. Probe-only precursor run 6905003a.

GROUND-TRUTH (2026-08-26T23:47Z first handback, import_ledger on ep-round-base-au0jofwp):
- tx_rrc_pipeline 491178=491178 run ccd8af7c 22:39:06Z / 22:44:54Z execution factory-landing-pipeline-mrxbd Completed True
- tx_rrc_well 1396049=1396049 run 2579a562 22:39:27Z / 22:46:07Z execution factory-landing-wells-9f846 Completed True
- cad_property 8021862=8021862 run d474c4b9 22:39:49Z / 23:24:09Z execution factory-landing-cad-dq7md Completed True
- tx_building_footprint 10674975=10674975 run 3a24692d 22:40:06Z / 23:46:43Z execution factory-landing-footprint-ppdgr Completed True
- txgio_parcel absent from import_ledger; factory-landing-parcel-wqdzv still running (Completed Unknown, no completionTime). Live COUNT(*) snapshots: 8,240,950 at 23:48:09Z then 8,407,150 at 23:48:15Z on ep-round-base-au0jofwp. Do not treat either as the ledger two-count until the job writes import_ledger.

LESSON: COUNT(*) on landing_* from the laptop hangs. Grade landing from import_ledger two-count rows plus gcloud execution completionTime.

DEAD-END: do not import pg from a Temp script. ESM resolves from the file, not cwd. Run factory jobs from hauska-factory/src.

OPEN: item 20 / published_at is F-05 LDT. F-04 proxy is the next console card. Drain card itself is closed.

GROUND-TRUTH (2026-08-27T01:05:41Z): hauska-engine #363 MERGED b402c8b. Check-run typecheck + test conclusion success (run 33028751986 / job 98376113777) on 51497d6. Local pnpm -r typecheck passed first. seat/property-drain kept at 51497d6.

GROUND-TRUTH (2026-08-27T01:05:58.913Z): lease v2 migrate Factory run bcf3776f. Host ep-lucky-truth-apodo8hr.c-7.us-east-1.aws.neon.tech, database hauska_mcp, not pooler, never neondb. Catalog read-back: schema_migrations 011_atoms_writer_lease_v2.sql applied_at 2026-08-27T01:05:58.913Z; pg_class public.atoms_writer_lease_v2 relkind r; PK (scope_type, scope_id). Job counts.after agrees. Termination success.

GROUND-TRUTH (2026-08-27T01:04:36Z): factory-landing-parcel-wqdzv Completed True. import_ledger txgio_parcel source_count=16428786 factory_count=16428786 run 63436483 source_counted_at 2026-08-26T22:40:18.911Z factory_counted_at 2026-08-27T01:03:09.995Z. Match. unknown_fields vintage, adapter_version. Do not COUNT(*) the landing table.

GROUND-TRUTH (2026-08-27T00:30:22Z): hauska-engine #362 typecheck + test conclusion SUCCESS on 22cf19d (run 33026887880 / job 98370239936). Merged 7012ac73 at 00:31:24Z. seat/property-drain preserved.

GROUND-TRUTH (2026-08-27T00:06Z): factory #4 MERGED 9040087. Map #226 MERGED 4217a57 after origin/main catch-up; both required checks SUCCESS. seat/property and seat/property-factory preserved.

GROUND-TRUTH (2026-08-27T00:10Z): engine #362 typecheck on 629217e SUCCESS; Test FAILURE. First cause: write-boundary.test.ts untyped fixtures (planner). Then storage: 17031:STUB and fhfact_* DID. Then engine-core: 48021:ROUND:boundary:0 and _feature-* parcel-node ids. Binding now refuses bare keys and sentinels and foreign did: methods; feature-id and boundary suffixes pass. Head f8e8ba7. Merge #362 only on conclusion SUCCESS. Bexar not started.

OPEN: substrate retires access-policy.ts:87 after this pre-step. Their card.

GROUND-TRUTH (2026-08-27T01:00Z): body.atomDid consumer named before first Bexar write. Admission of writer-local non-DID atomDid (fhfact_*) is FINE.

Consumer: AtomRetrievalService.withGuaranteedAtomDid and the atoms-list `did` mapper in packages/retrieval/src/index.ts (also assembleChain.didOf in serving-sweep/chain-assembly.ts). Storage getAtomByDid / listPropertyAtomsByParcelNodeId / search SELECT body only and never overlay atoms.atom_did onto the payload. Search builds the DID from entityType+entityId and ignores body.atomDid.

What they do with it: treat body.atomDid as served identity ONLY when it starts with `did:`. A writer-local fhfact_* / cadroll_* / railfact_* does not, so serve backfills buildAtomDid(entityType, entityId), which is the same derivation writePropertyAtom used for the column. LDT PE reads atomDid off the already-wired chain (zoningFact.atomDid), not body->>'atomDid'. Writer verify scripts that mention body->>'atomDid' are the opposite control: cad-parcel-roll and road-node lookup MUST use the atom_did PK; matching the jsonb expression is unindexed and is not identity.

Rejected second mechanism: "serve path reads body.atomDid as identity for every stored string." Rejected because withGuaranteedAtomDid and the list mapper both require startsWith("did:") before preserving; the fhfact_* fixture would be overwritten, not served. The DID_NAMESPACE refuse already covers the remaining bad case (a did: method that is not hauska, or a type mismatch). BP-WRITE-01 does not need to refuse writer-local non-DID ids. Bexar resume unblocked on this question.
