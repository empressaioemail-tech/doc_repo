## Mission — P-296: ETJ reaches a customer

You launch no sub-agents (FAN-DEPTH 0). You build in `legacy-design-tools` and open a PR. You apply
nothing to production and deploy nothing; the integration seat does both after merge.

### Where you work

`legacy-design-tools`, fresh clone from `origin/main` under `P:/tmp/` into a NEW directory, branch
`feat/p296-etj-rollout`. Declare the start commit (LDT main `8e7218f7` at compile, which carries
P-259b and P-249). Register the clone under the property seat and remove the entry at close. LDT
#713 (P-304) is open and touches `artifacts/api-server/src/lib/buildableEnvelope/`; stay out of it.

### What exists (P-241, merged `62e7349b`; close `_inbox/2026-09-16_p241-etj-acquisition_close.json`)

- Migration `lib/db/drizzle/0102_tx_etj_boundary.sql`, applied on NEITHER staging nor production.
  Production's `_schema_migrations` records `0103` by hand (A-207 ruling 3), so `0102` is the one
  pending file there.
- `ETJ_REGISTRY` (20 publishers), `etjIngest`, `etjCli`, `etjVerify`, and the read path
  `artifacts/api-server/src/lib/etjFactRead.ts` `loadEtjFact()`, which has NO caller.
- `etjStatus` still reads a hardcoded `unresolved` at: `lib/cad-ingest/src/boundary/cityLimitsFact.ts:53`;
  `lib/cad-ingest/src/boundary/containment.ts` (four sites near 225, 244, 251, 268);
  `artifacts/api-server/src/lib/cityLimitsFactRead.ts:93`;
  `artifacts/api-server/src/lib/cityLimitsFactFromParcelRecord.ts` (35, 64, 98, 115);
  `artifacts/api-server/src/lib/parcelConstraintProjection.ts:393`, whose reason string
  `no-etj-source-in-store` is now false. Line numbers are from the P-241 close; re-read them.
- hauska-engine's `report-model.ts:966` and `pdf/feasibility.ts:210-212` also hardcode ETJ. They are
  NOT in this lane; name them in your close.

### What to build

1. **Staging first.** Apply `0102` to LDT staging (`STAGING_DEPLOYMENT_DATABASE_URL`, host
   `ep-gentle-star-appmbu2q`) and run the ETJ ingest there for all 20 publishers. Take a heavy-scan
   lease keyed on that HOST first (never a nickname; P-307). Record per publisher: features read,
   rows written, and any publisher that refused, with its reason.
2. **Wire `loadEtjFact` as the source of `etjStatus`** (the scope's L1 plan), not as a parallel path.
   Decide at CP1, from code, which of the sites above are serve paths today, and wire those. The
   city-limits path stays as is unless you find it must delegate; if so, say why and stop for a
   ruling. `present`, `absent-verified` and `unresolved` stay three distinct values end to end; an
   unread ETJ is never `absent`.
3. **Say how production should run the ingest.** The canon says laptop ingest is frozen and the
   factory is the only writer path (OPS-19). Zoning stamps have been run from a session against
   production under operator rulings (A-202). Read the freeze decision
   (`_decisions/2026-08-26_ingest_freeze_and_cloud_loader.md`) and state in your close which path
   the production ETJ ingest must take (a session CLI under a lease, or a Cloud Run job), with the
   exact commands. Do not run it.
4. Refresh the schema fixture if you touch `lib/db` (P-259b's trap), and never export `DATABASE_URL`
   for a dry run; use `TEST_DATABASE_URL` or a throwaway container.

### Falsifiers — pre-register your predictions before building

1. On staging, a parcel inside a registered city's ETJ (name it) reads `etjStatus: present`, a
   parcel inside the city limits reads what the city-limits path says, and a parcel outside every
   registered ETJ in a registered county reads `absent-verified`.
2. A parcel in a county with no registered publisher reads `unresolved`, never `absent-verified`.
3. Reverting the wiring makes a test fail.
4. `surface-probe.mjs`'s P-241 row still passes against your tree.

### Do not

- Apply anything to production, deploy, merge, or run `run-migrations`.
- Touch hauska-engine, the buildable-envelope files, or another lane's checkout.
- Launch sub-agents.

### Close

Snapshot; files touched; the PR with every CI check's literal conclusion string; the staging
per-publisher table; the sites you wired and the ones you left, each with its reason; the production
path and commands; the falsifiers with evidence. `status`: `closed-partial` until the integration
seat applies `0102` and the ingest on production, deploys cortex, and a live parcel reads a real
`etjStatus`. `probe`: cite a `surface-probe.mjs` artifact for the P-241 row. `subAgents`.
`leave_behind`.
