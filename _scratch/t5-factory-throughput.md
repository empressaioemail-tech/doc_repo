# T5 factory throughput scratch (2026-08-05)

## GROUND-TRUTH
- Comal 48091: **CLOSED** (2026-08-06 relay) — cascade 76,525 verified; cert **20/20** on main @ `1256277` (`2026-08-06_comal_cert.json`); warden **CLEAN** cohort 92,549 (`2026-08-06_comal_warden.json`); ledger POST ok (cert+warden)
- Hays 48209: **CLOSED** — dry=apply 116,421 scanned / 67,689 cascaded / 0 errors; cert 20/20 blockPass; gate 7/8; warden 1 flag (`48209:100011` CASCADE-STATE-MISMATCH, mixed-city triage); block13 6/7 pre-existing (matches T1 pre-rewarm); ledger POST ok; 27 CAD roster drift swaps
- Williamson 48491: **CLOSED** — dry=apply 282,570/157,937/0; cert **20/20 reproducible on main** @ engine `634a2a4` (PR #261 merged; re-cert `_inbox/2026-08-05_williamson_cert_main_repro.json`); gate 7/8; warden CLEAN; block13 6/7 unchanged vs T1 pre-rewarm
- Bell 48027: **CLOSED** — dry=apply 165,574 scanned / 104,404 cascaded / 0 errors; cert 20/20 blockPass; gate 7/8 (PARCEL-LAYER-UNWIRED standing); warden CLEAN+ledger POST; block13 **6/7 STOP** on 48021:34177 perEdgeInset (re-run reproduced; Bell writes 48027 only — likely Bastrop drift, same class as Hays pre-rewarm)
- Sharding: **CLOSED** — PR #259 merged; **McLennan ntile diff PASS is canonical** (`2026-08-05_mclennan_sharding_diff_proof.json`); Bell naive-bounds diff FAIL accepted/disposed (lexicographic keyspace); runbook law = SQL `ntile` min/max bounds only
- Bexar 48029: **HELD** — operator 2026-08-05: no start until (a) ~~Williamson PARCELID PR merged~~ **DONE #261**, (b) block13 7/7 unambiguous on main (T1 resolving 34177), (c) heavy-scan slot released — order **T1 (WS1 close + Elgin) → T3 pilot → Bexar**
- block13: **clean on main** (2026-08-06 operator relay) — T5 data-run freeze **LIFTED**; heavy-scan slot order still **T1 → T3 pilot → Bexar**

## OPEN
- **QUEUED (slot):** Bexar sharded cascade — after T1 WS1/Elgin → T3 pilot
- **QUEUED (slot):** Hays/Bell — cascade+cert closed 2026-08-05; re-verify only if operator requests post-block13

## LESSON
- Keyspace bounds (live probe 2026-08-05): McLennan 48309 min=48309:0 max=48309:999999 (114,255 parcels); Bell 48027 min=48027:0 max=48027:99999 (165,574 parcels). Use for quartile shard splits.
- Warden full-cohort adjacency load on Comal (~92k parcels) ~34 min wall; truncated logs at "cohort size=" mean sweep still running, not done.
- Bell sharding diff FAIL (naive numeric bounds) **disposed** — McLennan ntile method is canonical runbook law; do not re-run Bell diff
- Williamson StratMap ids are **`R*` PARCELID** strings — #254 `PropertyID` alone insufficient; need quoted-string `IN` + registry `propIdField: PARCELID` (engine PR in flight)
