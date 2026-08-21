# G-71 municode calendar onto files

GROUND-TRUTH 2026-08-17T23:46:30Z — Dashboards `00010-vbs` @100%. Files `00005-fdr` @100%. PR #10 squash `570556c3`. Files PR #4 squash `abd77f34`. template-city grant municode calendar writesTo=files public-free. POST run fetched 25 wrote 5 to `folder:tenant:template-city:public-meetings`. Compose meetings status ok recordCount 5. Source `https://bastrop-tx.municodemeetings.com/`. City `00118-qox`. Catalog municode still writesTo=spine.

LESSON — Files POST requires a QA persona. `template-city/g71-calendar` is that actor. Serving already had icc-demo personas that were only in the dirty `P:\smart-files` checkout; a deploy from origin/main without them would have dropped ICC writes. Record serving personas into git before any files Cloud Run deploy.

LESSON — Rebase G-71 onto G-70 main before merge. Both touch compose/app.js. Auto-rebase kept smartFiles embed and Files nav.

OPEN — filesRoom compose still `files auth refused` on the unauthenticated list. Meetings read uses the keyed client. Files QA Vercel fixture list not redeployed.
