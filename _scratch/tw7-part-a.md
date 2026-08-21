# TW-7 Part A — operator-box run

GROUND-TRUTH 2026-08-18T00:52Z: Part A ran on this residential host. SEC probe HTTP 200. Dry-run then real run both `ok: true`, documents 171, skipped 24, bytes 165948963, verified_locally 171. Real run `uploaded: true` to `gs://empressa-sec/documents/` (158.44 MiB). VM `/var/lib/cockpit/sec_documents` now holds 171 bodies + 171 sidecars, verifier `ok: true` verified=171 missing_sidecars=0. TW-6 is unblocked.

GROUND-TRUTH 2026-08-18T00:52Z: running cockpit-api is still image `d63d83dc…` started 2026-08-17T22:15:53Z. A concurrent deploy built `a70595d19177` at 00:51Z and did not cut over. `/var/lib/cockpit` is bind-mounted so the live process sees the new tree.

LESSON: do not `git checkout main` on `P:\Empressa Trading` (it sits on `fix/zone-mark-death-clip`). Use an isolated worktree. IAP tunnel from this network is dead; `--no-tunnel-through-iap` works.

DEAD-END: `gcloud compute ssh --tunnel-through-iap` → `FATAL ERROR: Remote side unexpectedly closed network connection`.

OPEN: image cutover of `a70595d19177` still owed under D-080 if anyone wants the new image serving. Step 9 daily schedule not created. Worktree `P:\tmp\tw7-part-a` disposable.
