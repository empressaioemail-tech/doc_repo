# f16-f18-conformant

OPEN: CP1 filed 2026-08-27T11:20Z. Items 3-8 unit-tested; live 100k MERGE and Bastrop landing apply not yet run. Cloud job not deployed.

GROUND-TRUTH (2026-08-27T11:05Z): worktrees created from origin/main. factory-conform 7d5f50d seat/property-conform. engine-conform 2c90b99 seat/property-conform.

GROUND-TRUTH (2026-08-27T11:05Z): retired salvage gone. factory-writer named files exist=false. engine-writer services/atoms-writer exist=false. Drain and primary factory status empty.

GROUND-TRUTH (2026-08-27T11:15Z): @empressaio/atom-contract published 1.22.0. No Track 2 named exports (NodeId, ProvenanceClass, Derivation, AbsenceVerdict, SupersessionEdge, AliasAtom, SelectorPredicate, AccessPair). Shim check ok. Fixture export of NodeId fails SHIM_OUTLIVED.

LESSON: replay identity requires the same alias store. mint() is random (substrate grammar). A second pipeline on a fresh store remints and cannot byte-diff to zero. Share resolveStore.

LESSON: hauska_mcp MERGE cannot SELECT Factory write_stage_* (different database). Stage stays on Factory; target gets a TEMP table then one INSERT ON CONFLICT. That is the MERGE.

DEAD-END: do not open hauska-engine-drain, hauska-engine-writer, hauska-factory-writer, or primary hauska-factory. Salvage was already deleted.

OPEN: F-15 still open at the substrate seat. Re-probe published exports at CP2 and close.

OPEN: 100k in-region rate. Do not tune if under 150. Per-leg: adaptResolveMs, copyMs, mergeMs, countMs.

GROUND-TRUTH (2026-08-27T10:58:48Z): Cloud Build e5b1a72b SUCCESS. Image hauska-factory@sha256:09f7dfff43b853a5a137943a7885141b8be9f3cda7d956b55d1b3a37184c617e. Jobs factory-conformant and factory-conformant-migrate deployed us-east4.

GROUND-TRUTH (2026-08-27T11:00Z): factory-conformant-migrate-kbv9d successfully completed (0002_conformant_l3.sql).

DEAD-END: gcloud run jobs execute --args on PowerShell. Unquoted `--args=conformant,--apply,...` becomes one argv token; bracket form `[...]` is a PowerShell wildcard. Quoted `--args='conformant,--apply,--rate-probe,--rate-rows=100000'` is the Phase A form that splits. Evidence: factory-conformant-q67j4 and factory-conformant-mnjld both exit 2 usage. Same class as factory-landing-import-knl7d.

GROUND-TRUTH (2026-08-27T11:19:20Z): Factory run e8823e11 stage-e-rate. write_stage_atoms cad-parcel-roll/48021 = 100000. run_events rate: rows=100000 wallMs=85823 atomsPerSec=1165.19 vsFloor=met vsPrediction=met perLeg adaptResolveMs=1742 copyMs=6771 mergeMs=77256 countMs=54. hauska_mcp conformant-v1=100000. termination success lease_released. execution factory-conformant-kjzhx. Image sha256:09f7dfff43b853a5a137943a7885141b8be9f3cda7d956b55d1b3a37184c617e. CP2 filed.

GROUND-TRUTH (2026-08-27T11:22Z): item 7 baselines before landing apply. old cad-parcel-roll entity_id LIKE 48021% and not conformant-v1 = 77073. parcel-node 48021 = 62394. flood-hazard-fact 48021 = 62256. landing_cad_property 48021 = 77799. payload keys county_fips + prop_id verified (prop_id 87391, 10001 present).

LESSON: PowerShell gcloud --args must be --args='a,b,c'. Unquoted joins to one argv; [brackets] are a wildcard. Same class as knl7d.

DEAD-END: landing SELECT with OR on two jsonb keys seq-scans 8.02M rows / 7.6GB. Index landing_cad_property_county_fips_idx added. Query is payload->>'county_fips' = $1 only.

DEAD-END: T2 scans every node when address normalizes to empty and centroid is null. 77k^2. Cancelled factory-conformant-57lxt. Skip T2 unless address or centroid is usable.

DEAD-END: reconcileCandidate filtered store.atoms on every row. Same 77k^2. Cancelled factory-conformant-fpt7z. openByKey Map.

DEAD-END: takeScopedLease INSERT-only. Cancelled 57lxt left an expired row; dzhj9 died LEASE_HELD. Steal on expires<=now. Orphan deletes for 151de588 and 2e7a6ce7.

GROUND-TRUTH (2026-08-27T11:32Z): 57lxt cancelled after landing query went idle and JS sat in T2. 151de588 unterminated.

GROUND-TRUTH (2026-08-27T12:56Z): amendment (a) composition. write_stage_atoms county_fips 48021=100000 only. hauska_mcp conformant-v1 48021=100000 only. body.rateProbe=true on samples. No cleanup run. F-10 excludes rateProbe=true, not county.

GROUND-TRUTH (2026-08-27T12:56Z): npm @empressaio/atom-contract still 1.22.0. F-15 open. Shim check stays.

OPEN: 5j4mc still persist-zero at run_age ~1990s (started 12:23:51Z, timeout 13:23:51Z). Stay. If persist-zero at timeout, report where it sat. Flood only if old 48021 cad-parcel-roll still 77073.

GROUND-TRUTH (2026-08-27T13:01Z): factory-control serving factory-control-00004-jin @100% digest sha256:2af32780. Canary smoked then traffic shifted. Serving /queues 401 unauth; auth owner property-seat-resolution depth 0. /gates bastrop-cad-promote owner + throughput 500. Record _inbox/2026-08-27_f16-f18-factory-control-serving.md.

GROUND-TRUTH (2026-08-27T13:02Z): npm @empressaio/atom-contract still 1.22.0 (published 2026-08-12). F-15 open. Shim check stays.

GROUND-TRUTH (2026-08-27T13:03Z): 5j4mc run 80d375af phase stage-e-conformant status started age ~2313s persist still zero. Factory pg_stat_activity idle (control /gates only). Last job log 12:24:02Z pg SSL warning. Sit is in-memory after landing SELECT, before persistAliases. Hypothesized remaining O(n squared): store.aliases.find on every row in resolveCandidate (aliasesByKey already exists for match; dedupe still scans the full array). Replay runs pipelineFromRows a second time on the shared store. Do not retune until timeout. Next execute waits for per-leg of this sit.

GROUND-TRUTH (2026-08-27T13:24:12Z): 5j4mc timeout. completion 13:24:12Z. Cloud Run failed exit 0 "The configured timeout was reached." persist aliases 0 staged_since 0 events 0. Run 80d375af left status started. Sit: in-memory pipelineFromRows after landing, before persist. Record _inbox/2026-08-27_f16-f18-5j4mc-timeout.md.

GROUND-TRUTH (2026-08-27T13:24Z): old cad-parcel-roll 48021 not conformant-v1 still 77073.

GROUND-TRUTH (2026-08-27T13:25Z): expired lease for 80d375af deleted (taken 12:24:02Z, expired 12:39:02Z).

GROUND-TRUTH (2026-08-27T13:35Z): t85jf per-leg on 2000 rows. landing 194ms, pipeline1 2619ms / 4000 atoms, replay 209ms identical. Merge 42P07 TEMP table twice in one tx. aliases 2000 staged 4000. Record _inbox/2026-08-27_f16-f18-t85jf-per-leg.md.

GROUND-TRUTH (2026-08-27T13:41Z): factory-conformant gen 7 digest sha256:c9c80153. Execution npg6c --apply --replay run c7686690. Landing 1268ms / 77799 rows written. At age 1677s still no pipeline1 event, aliases still 2000, staged_since 0. Stay. Old 48021 still 77073 at execute start.

GROUND-TRUTH (2026-08-27T14:19Z): npg6c cancelled. Same sit as 5j4mc: landing event only, no pipeline1, persist still t85jf 2000 aliases. Expired lease left for F-03 reaper (run c7686690). Do not hand-delete.

GROUND-TRUTH (2026-08-27T14:25Z): landing 48021 usable situs_address 58716 of 77799, centroid 0. Remaining quadratic is T2 full-node scan on usable addresses.

GROUND-TRUTH (2026-08-27T14:29:43Z): reaper rkk9n wrote termination for 5j4mc timeout, t85jf crashed, npg6c killed. Leases 0. Live violation: cancel npg6c, reaper produced the row without a hand fix.

GROUND-TRUTH (2026-08-27T14:31Z): (h) dhvb4 limit=10000 pipeline1 1298ms (resolve 761, stage 435, t2Considered 57) vs 5x of 2619 = 13095. Clears. mergeMs 265540 because MERGE still read the 100k probe stage. Exit 3 rate-floor 58.2 atoms/s. Record _inbox/2026-08-27_f16-f18-h-limit-10000.md.

GROUND-TRUTH (2026-08-27T14:40:46Z): (f) cleanup n5xm6 keyed e8823e11. Deleted 100000 stage + 100000 hauska_mcp rateProbe. probe_left 0. old 48021 still 77073. Record _inbox/2026-08-27_f16-f18-cleanup-e8823e11.md.

OPEN: (h) cleared. Full --apply --replay is allowed. No flood until that persist lands and old 48021 is still 77073. F-15 still 1.22.0.

GROUND-TRUTH (2026-08-27T15:05Z): persist counts for run 15c5c397 / jmwdp. Factory aliases 89799 rows / 77799 distinct keys / 77799 nodes (2k+10k+full eras). write_stage_atoms 155598 (77799 cad + 77799 alias). write_stage_edges 0; applies-to / subject-to / derivesFrom 0 from this persist. hauska_mcp updated_at in 14:43-14:46Z: 77799 cad-parcel-roll + 77799 identity.alias. Old-shape cad-parcel-roll 48021 still 77073. rate event rows 135598 wallMs 116603 atomsPerSec 1162.90 vsFloor met. Replay identical 10219 ms.

GROUND-TRUTH (2026-08-27T15:05Z): rule_grades 48021:15c5c397 V1/V3/V7/V11/V14 PASS; V2/V4/V5/V6/V8/V9/V10/V12/V13/V15 UNMEASURED. V11 PASS is job-asserted; store edges for applies-to are 0.

GROUND-TRUTH (2026-08-27T15:08:09Z): flood-only f2gln exit 1 FLOOD_ZONE_MISSING. Raw enumerated 62256; zoned 62254 (A 2668, AE 1309, AO 42, X 58235); unzoned named 48021:8720001 and 48021:8725799 (floodZone null). Run 70ee9733 started, no termination (reaper sit). Old 48021 still 77073 at execute.

GROUND-TRUTH (2026-08-27T15:11:28Z): scheduler factory-conformant-reap us-east4 */10 Etc/UTC next 15:20:00Z. Body JSON overrides args reap. No hand execute.

GROUND-TRUTH (2026-08-27T15:12:16Z): cancelled v6bzf; SIGTERM wrote killed + lease_released on 2832934d. That is not the scheduled reap. f2gln 70ee9733 still unterminated.

GROUND-TRUTH (2026-08-27T15:16:08Z): flood nm9zb SUCCESS on gen 9 sha256:552694bd. raw 62256, zoned 62254, unzoned 48021:8720001 and 8725799. selectors 4 (A AE AO X). derivations staged 62254 with derivesFrom. re-point 62254 equal, reFetched false. floodMs 60192 wallMs 60222 atomsPerSec 1033.74. old cad still 77073.

GROUND-TRUTH (2026-08-27T15:20:12Z): scheduled reap factory-conformant-4z9lb (scheduler lastAttempt 15:20:00.932Z) wrote f2gln 70ee9733 crashed lease_released. No hand execute. leases 0. v6bzf killed was SIGTERM at 15:12:16, not the scheduled reap.

GROUND-TRUTH (2026-08-27T15:27Z): hauska-factory PR 9 merged 53c2342. Both test check-runs conclusion SUCCESS. Job remains gen 9 digest 552694bd.

OPEN: F-10 and F-06 not started. Next two cards from the planner. F-15 still 1.22.0.
