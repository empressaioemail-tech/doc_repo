---
id: adr_002_replit_neon_migration
title: "ADR-002 â Migrate both apps off Replit-managed Neon to Empressa-owned Neon"
status: active
last_updated: 2026-05-05
applies_to: portfolio
related: [adr_001_atom_architecture, 15_replit_neon_ownership_advisory, 23_dev_setup_assessment, 2026-05-05_track_b_deploy_saga]
---

# ADR-002 â Migrate both apps off Replit-managed Neon to Empressa-owned Neon

## Status

**Accepted, scheduled.** Paired with the Cloud Run + GitHub Actions
migration sprint. Migration window not yet committed; estimated 2.5
dev-days execution + 48 hours observation. Originally captured as
"ADR-Replit-Neon-001" in the body of
[`15_replit_neon_ownership_advisory.md`](../15_replit_neon_ownership_advisory.md);
formalized as a standalone ADR 2026-05-05.

## Context

Both `legacy-design-tools` and `smartcity-os-prod` production Neon
databases were auto-provisioned by Replit and sit under Replit's
ownership account, not Empressa's. This was discovered during the
2026-05-04 Track B deploy saga when a schema migration needed to
apply to deployment Neon and three paths were attempted:

1. Custom `deploy:track-b apply` script â reported success but
   columns didn't appear on the Neon the deployed app reads from
2. Manual SQL via Neon's web SQL editor â blocked because Nick is
   not the owner of the Neon account
3. Replit Agent connecting through the `DEPLOYMENT_DATABASE_URL`
   secret â worked tactically, became the saga's resolution

Path 3 worked but is a tactical workaround captured separately in
[`adr_003_replit_neon_tactical.md`](adr_003_replit_neon_tactical.md).
The four risks of leaving the data under Replit ownership â schema
drift undetected, no native backups under our control, vendor
lock-in compounding, no team access â are detailed in
[`15_replit_neon_ownership_advisory.md`](../15_replit_neon_ownership_advisory.md)
and not re-litigated here.

The cost of remediation is bounded (~3 days, see Decision below).
The cost of inaction grows with every day of accumulating production
data.

## Decision

**Migrate both apps' production Neon databases to Empressa-owned
Neon, paired with the Cloud Run + GitHub Actions migration sprint.**

Concrete commitments:

- **Empressa creates a Neon Pro account** under a Legacy Group /
  Empressa email (distinct from any GitHub-tied address â see
  Empressa credentials vault decision in
  [`11_roadmap.md`](../11_roadmap.md)).
- **Two new Empressa-owned Neon projects** named
  `legacy-design-tools-prod` and `smartcity-os-prod`. Region:
  `us-east-1` for legacy-design-tools (matches current); **`us-central1`
  for SmartCity OS** to colocate with Cloud Run and close Fire 5 in
  [`10_ground_truth.md`](../10_ground_truth.md).
- **Migration sequence per app**: schema-only `pg_dump`/restore â
  data-only `pg_dump`/restore at low-traffic hour â application
  cutover by updating the connection-string secret â 24-hour
  observation â decommission Replit-owned Neon (or leave empty).
- **Sequence between apps**: legacy-design-tools first (pre-launch,
  lower risk); SmartCity OS second (live Bastrop users, narrower
  window).
- **Pair with Cloud Run sprint**: both sprints touch the same
  connection-string boundaries; doing them together avoids
  touching production twice.

## Alternatives considered

**Alternative 1 â Continue with the tactical Replit Agent workaround
indefinitely.** Rejected because (a) it's tactical by design â see
[`adr_003`](adr_003_replit_neon_tactical.md) â and (b) the four
risks (drift detection, backups, lock-in, team access) compound
daily.

**Alternative 2 â Migrate one app, leave the other.** Rejected
because the lock-in problem is identical for both apps; partial
migration leaves the same compound risk on the other half of the
portfolio. Doing them together is only marginally more work
(~half-day vs sequential separate sprints).

**Alternative 3 â Switch to a non-Neon Postgres provider as part
of the migration.** Considered (RDS, Cloud SQL, Supabase). Rejected
for now because Neon's branch model and serverless architecture
match the dev workflow well, and the migration cost from Replit-Neon
to Empressa-Neon is bounded (`pg_dump` across the same Postgres
dialect). Provider switch is a separable, larger decision with its
own ADR if it ever surfaces.

**Alternative 4 â Defer until forced.** Rejected. The forcing
function is unpredictable (Replit policy change, support escalation,
team-access need, audit). Better to control the timing than wait for
it to be forced.

## Consequences

**Positive:**

- DB console access. Schema inspection, branch operations, backup
  management all become first-class.
- Native Neon backups under our control. Point-in-time recovery
  becomes a real capability.
- Team auth. Per-person granted roles with audit logging; Valerie
  and Kendra can be granted access without sharing a Replit secret.
- Migration ergonomics. Schema migrations can run via `psql` from
  local, via Drizzle migrate in CI, or via Neon's web SQL editor
  with proper review flow.
- SmartCity OS cross-region hop closes (Fire 5 in
  [`10_ground_truth.md`](../10_ground_truth.md)).
- Lock-in stops compounding. Future migration cost grows with data
  volume; bounding it now is cheaper than letting it grow.

**Negative:**

- Migration window. SmartCity OS has live Bastrop users; the cutover
  needs a low-traffic window. Risk: data drift between
  dump-and-restore moments. Mitigated by short window + connection
  string atomic update.
- Coordination cost. Both apps + the credentials vault decision +
  the Cloud Run sprint must align. If any of those slip, the
  Empressa-Neon work either ships incomplete or waits.
- One-time complexity. New Neon Pro account, new credentials, new
  vault entries, new CI secret bindings. Documentation needs updating
  in [`22_workstation_inventory.md`](../22_workstation_inventory.md)
  and [`90_runbooks/`](../90_runbooks/).

**Neutral:**

- The Replit Repls remain accessible as IDE/agent sandboxes. They
  just no longer hold connection strings to production data.

## Abort / rollback criteria

- If the schema-only restore reveals incompatibility (extension
  missing, column mismatch), abort before data restore. Re-evaluate
  Neon Pro account configuration.
- If 24-hour observation shows latency regression on SmartCity OS
  (vs. cross-region baseline), investigate. Rollback path: revert
  the GCP Secret Manager value to the Replit-Neon URL and roll the
  Cloud Run service.
- If team access controls don't materialize as expected on the new
  account, the win on that axis is partial. Migration proceeds
  anyway â the DB-ownership win is independently valuable.

## References

- [`15_replit_neon_ownership_advisory.md`](../15_replit_neon_ownership_advisory.md)
  â full discovery context, four risks, migration plan with `pg_dump`
  commands, Empressa credentials vault decision
- [`adr_003_replit_neon_tactical.md`](adr_003_replit_neon_tactical.md)
  â the tactical workaround used until this ADR ships
- [`adr_004_future_neon_provisioning.md`](adr_004_future_neon_provisioning.md)
  â forward-looking commitment for new products
- [`91_postmortems/2026-05-05_track_b_deploy_saga.md`](../91_postmortems/2026-05-05_track_b_deploy_saga.md)
  â the saga that surfaced the ownership problem
- [`23_dev_setup_assessment.md`](../23_dev_setup_assessment.md) â
  Layer 2 (this week) recommendation that includes this migration
- [`11_roadmap.md`](../11_roadmap.md) â P1 entry tracking this work

## Revision history

- **2026-05-05 (origin):** captured in
  [`15_replit_neon_ownership_advisory.md`](../15_replit_neon_ownership_advisory.md)
  as "ADR-Replit-Neon-001"
- **2026-05-05 (this ADR):** formalized as standalone ADR-002 in
  `80_adrs/`. Content unchanged; structure aligned with ADR-001
  (Status / Context / Decision / Alternatives / Consequences / Abort
  / References / Revision history).
