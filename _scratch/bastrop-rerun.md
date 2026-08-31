# BASTROP-RERUN scratch (F-01)

OPEN 2026-08-31T19:15Z — operator image correction. 56a8ee75 is the Hays image. F2 not testable on it. 2287e9e8 does not license 62256. Build 5f9acc3c next.

DEAD-END — treating 56a8ee75 as Factory #49 because build 460457f1 started 16s after merge. Provenance is a storage tarball with no COMMIT_SHA. Timing is not a source SHA.

GROUND-TRUTH 2026-08-31T19:09Z — factory-p2-juris generation 3 digest sha256:56a8ee75. Not gzr6z 6daf83a1. Do not call this the #49 image.

LESSON (from writepath-proof) — Windows gcloud --args comma collapses. Use Admin API JSON array.

GROUND-TRUTH 2026-08-31T19:08:39Z — execute factory-p2-juris-gq4r8 args p2-juris --county=48021 --apply image sha256:56a8ee75. Run 2287e9e8-a389-49bd-acae-4678242d8469 started 19:09:02.057Z.

GROUND-TRUTH 2026-08-31T19:09:54Z — six chunks written, 48000 rows. Last wallMs 8284. Expected eight pages. F1/F2 unmeasured.

OPEN — wait for persist close. F1 exact 50264/11992/62256. F2 unaided exit. Do not cancel.

GROUND-TRUTH 2026-08-31T19:10:33Z — factory-p2-juris-gq4r8 on sha256:56a8ee75: F1 50264/11992/62256. Cloud Run succeededCount=1 1m50.2s unaided. termination success recorder=containment-persist. F2-as-#49 NOT TESTABLE. Retracted. Rows not licensed.

GROUND-TRUTH 2026-08-31T19:14Z — persist tree c55baa69 and origin/main 5f9acc3c share tree 40d434b9. Live job digest is still 56a8ee75 from tarball 460457f1. Digest is the discriminator, not the tree id on disk.

GROUND-TRUTH 2026-08-31T19:11:28Z — fancy-fire neondb landing_parcel_jurisdiction 48021: unincorporated 50264, in-city 11992, total 62256. All 62256 rows run_id=2287e9e8. n_zero=0. F1 MET from store, not chunk sum.

GROUND-TRUTH 2026-08-31T19:12:03Z — McLennan 48309 sentinel census BEFORE execute. n_zero_rows=117, distinct_all=114255, distinct_ex_zero=114254, n_rows=130636. Instrument: COUNT DISTINCT on txgio_parcel WHERE county_fips=48309 AND prop_id IS NOT NULL. db=neondb.

GROUND-TRUTH 2026-08-31T19:12:30Z — McLennan sentinel 0 disposition: unincorporated, method ring, place_fips null. Same persist SQL as CHUNK_PERSIST (county equality, 1e-8 ring floor) scoped to prop_id=0. Unlike Caldwell (in-city Mustang Ridge). Like Bastrop/Hays (unincorporated). No interactive 01 triple exists (01 cancelled 263s). Falsifier is completion against denom 114254. Do not invent a triple.

GROUND-TRUTH 2026-08-31T19:16Z — Cloud Build ca28f837 from detached 5f9acc3c. Image sha256:cb278eb5a9a29bdf252f9992a1e5197ae0683b4946be80849a67342079a8d201. Job generation 4. IMAGE_DIGEST env matches. Differs from 56a8ee75.

GROUND-TRUTH 2026-08-31T19:12:51Z — McLennan factory-p2-juris-cbt28 started before the correction, still on sha256:56a8ee75. Do not cancel. Bastrop F2 re-run waits for this execution to leave RUNNING.

GROUND-TRUTH 2026-08-31T19:42:14Z — McLennan cbt28 on sha256:56a8ee75: 15 chunks, 114254 rows, landing 32422/81832/114254 all run 82c26c82. Cloud Run succeededCount=1 29m19s unaided. F2-as-#49 NOT TESTABLE. Not cancelled.

GROUND-TRUTH 2026-08-31T19:46:11Z — factory-p2-juris-krckc on sha256:cb278eb5. Run 1dda40f7. F1 50264/11992/62256 all rows this run_id at 19:47:03Z. F2 succeededCount=1 2m6.33s unaided recorder=containment-persist. Was the bind. Upsert later moved it.

GROUND-TRUTH 2026-08-31T19:45:30Z — Cloud Build 6c7700ec from persist HEAD 5f9acc3. Digest sha256:dd7c2a94. Job generation 5. IMAGE_DIGEST matches. Tarball, no COMMIT_SHA. Differs from 56a8ee75 and cb278eb5.

GROUND-TRUTH 2026-08-31T19:48:42Z — factory-p2-juris-hwzq5 args p2-juris --county=48021 --apply image sha256:dd7c2a94. Falsifiers stated: F1 50264/11992/62256 exact; F2 unaided exit. Do not cancel.

GROUND-TRUTH 2026-08-31T19:50:47Z — hwzq5 run 85f984c2. F1 store 50264/11992/62256 all this run_id, n_zero=0. F2 succeededCount=1 1m58.18s unaided recorder=containment-persist reason matched. Licenses 62256. Cite this run.

OPEN — Travis/Williamson COUNTY_HELD. TOTALS UNMEASURED. Setback bake not started (P4-QUARANTINE). McLennan 82c26c82 completed on Hays image only. Bake may cite 85f984c2.

## SUPERVISION 2026-08-31T19:14Z (this chat)
Did not start gq4r8 or cbt28. Sibling chat did. Image sha256:56a8ee75 carries #49 by success-termination behavior (recorder containment-persist, max_duration_s 21600, process exit 0). Did not rebuild under live cbt28. Bastrop F1+F2 already met on run 2287e9e8. McLennan 82c26c82 started 19:13:08Z, 0 chunks at first poll. Do not start a second heavy op. Do not hand-cancel.
