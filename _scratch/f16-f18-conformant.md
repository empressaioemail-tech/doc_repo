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

OPEN: factory-control canary on digest 2af32780 before close; item 3 Queues/Gates grade on serving revision.
