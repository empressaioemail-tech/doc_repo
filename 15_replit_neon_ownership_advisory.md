---
id: 15_replit_neon_ownership_advisory
title: Replit-managed Neon ownership — cross-project advisory
status: active
last_updated: 2026-05-10
applies_to: portfolio
related: [10_ground_truth, 2026-05-05_track_b_deploy_saga, 30_smartcity_os, 40_design_accelerator]
---

# Replit-managed Neon ownership — cross-project advisory

> **Living advisory.** This doc captures both the historical discovery
> context (Track B saga, 2026-05-05) and the active migration plan that
> hasn't shipped yet. The narrative below stays roughly verbatim from
> the original because the discovery context is load-bearing for the
> argument; the action sections update in place as the migration
> progresses. When both apps are on Empressa-owned Neon, this doc
> moves to `status: superseded` and points at a closeout postmortem.

**Date originated:** 2026-05-05
**Scope:** Both `legacy-design-tools` and `smartcity-os-prod` deployment Neon databases.
**Status:** Active risk. Migration sprint planned, not yet executed.

---

## TL;DR

Replit auto-provisioned the production Neon databases for both
`legacy-design-tools` and `smartcity-os-prod`. These Neon projects sit
under **Replit's** ownership account, not Empressa's / Legacy Group's.
We pay for them indirectly via Replit's bill, but we cannot log into
Neon's console for these databases, cannot manage their branches,
cannot do native Neon backups, cannot move them, cannot grant team
access, cannot rotate credentials, and cannot migrate them away from
Replit without a full dump/restore.

This is a vendor lock-in we did not consciously choose. It needs to be
remediated before — or paired with — the Cloud Run migration sprint.

---

## How we discovered the problem

Track B server-side IFC ingest landed on `origin/main` at `cc034c9`. The
schema migration (`lib/db/scripts/track-b-ifc-ingest.sql`) needed to apply
to deployment Neon for the new endpoint to work.

We tried:

1. **A custom `deploy:track-b apply` script** that ran against
   `ep-little-base-amyyxjca`. The script reported success; the audit log
   was written. **But the columns and tables it added did NOT appear on
   the Neon that the deployed app reads from.** Most likely the script
   ran against a dev branch on the same Neon project, not the production
   branch — but we couldn't verify because we couldn't open Neon's console.

2. **Manual SQL via Neon's web SQL editor.** Standard Neon migration
   practice. **Blocked because Nick is not the owner** of the Neon
   account that holds the production database. There is no way for Nick
   to log into `console.neon.tech` and reach the production branch
   directly.

3. **Apply via the Replit Agent using the `DEPLOYMENT_DATABASE_URL`
   Replit secret.** This works — the secret is already wired into the
   Repl's environment. The Replit Agent can connect via Node `pg` and
   execute the migration script directly. This is what we ended up
   doing for Track B.

**Path 3 worked, but it's the wrong long-term answer.** It only works
because the Replit Agent has access to a secret we don't have visibility
into. If the Replit Repl is ever down, suspended, or migrated away from,
we lose the connection path to our own data.

Full Track B saga context lives in [`91_postmortems/2026-05-05_track_b_deploy_saga.md`](91_postmortems/2026-05-05_track_b_deploy_saga.md).

---

## What we know about the database state

For `legacy-design-tools`'s production Neon:

- **Connection target:** `ep-little-base-amyyxjca.c-5.us-east-1.aws.neon.tech` (region `us-east-1`)
- **Database name:** `neondb`
- **User:** `neondb_owner`
- **Branch (suspected):** `br-calm-bird-amomghoo`
- **Replit secret name holding the connection string:** `DEPLOYMENT_DATABASE_URL`
- **Owner:** Replit (auto-provisioned)
- **Nick's access via Neon console:** None
- **Schema management:** Drizzle TS schema in `lib/db/src/schema/` is the source of truth; `drizzle-kit push` applies (production via `DEPLOYMENT_DATABASE_URL`). Hand-rolled SQL in `lib/db/scripts/` exists for one-off migrations like `track-b-ifc-ingest.sql`. The Replit Agent confirmed there are zero migration tracking tables in the production Neon — schema state is whatever someone last applied.

For SmartCity OS's production Neon (verified during 2026-05-05 recon):

- **Connection target:** `ep-floral-sound-afocvkct.c-2.us-west-2.aws.neon.tech` (region `us-west-2`)
- **Replit secret name holding the connection string:** `PROD_DATABASE_URL` (also stored in GCP Secret Manager as `smartcity-DATABASE_URL`)
- **Owner:** Replit (auto-provisioned, same pattern as legacy-design-tools)
- **Nick's access via Neon console:** None
- **Cross-region hop:** Cloud Run is in `us-central1`; Neon is in `us-west-2`. Every query crosses a region.
- **Schema management:** TS schema in `shared/schema.ts` (95 KB) plus hand-rolled SQL in `migrations/`. `drizzle.config.ts` reads `DATABASE_URL`. NO journaled migrations folder. `scripts/post-merge.sh` uses idempotent `CREATE … IF NOT EXISTS` DDL with a `[ -n "$DATABASE_URL" ]` guard, exits 0 on error — safer than the legacy-design-tools equivalent (no `--force` flag).

These are the same problem on two different products, with the SmartCity
OS instance carrying the additional cross-region-hop concern.

---

## Why this matters

Four concrete operational risks:

### Risk 1 — Schema drift goes undetected

Without console access, we have no way to inspect the actual production
schema state visually. We have to rely on agent-mediated SQL queries,
which means agent state drift, agent contradictions, and a long
debugging chain whenever something doesn't match expectations. During
the Track B saga we lost ~3 hours specifically because the production
schema state contradicted what we believed the deploy:track-b script had
applied — and we couldn't just open the console and look.

### Risk 2 — No native backups under our control

Neon has built-in branching, point-in-time recovery, automated backups.
All of those are exposed via the Neon console. Without console access,
we have:

- No ability to take a manual snapshot before a risky migration
- No ability to time-travel to a prior state if a migration corrupts data
- No ability to verify automated backups are even running
- No way to export the data for cross-cloud disaster recovery

Currently if a production Neon gets corrupted, our only recovery path
goes through Replit support. That's not a recovery plan, that's hope.

### Risk 3 — Vendor lock-in compounds

Every day this stays in place, more data accumulates inside a database
we don't own. Migration cost grows linearly. If we ever need to leave
Replit (cost, performance, an outage, a policy change), the migration
becomes an emergency rather than a planned move. Better to do it now
while the data volume is still small — Bastrop production data is
probably <1GB; legacy-design-tools is empty Track B tables + a handful
of test snapshots.

### Risk 4 — Team access

Once Valerie or Kendra need DB access for any reason, there's no way to
grant it. The credential lives in a Replit secret accessible only via
the Repl shell — not as a per-person granted role with audit logging.
That's fine for a solo founder but breaks the moment a second person
needs to operate against the data.

---

## Remediation plan — paired Neon migration sprint

Goal: move both `legacy-design-tools` production Neon AND `smartcity-os-prod`
Neon under an Empressa-owned Neon account, with no data loss and no
production downtime.

Prerequisites:

1. **Empressa creates a Neon Pro account** under a Legacy Group /
   Empressa email (NOT `empressaioemail-tech` since GitHub auth is
   sometimes tied to that — use a distinct billing email).
2. **Set up an Empressa-owned Neon project** for each app. Naming:
   `legacy-design-tools-prod`, `smartcity-os-prod`. Match production
   read latency: `us-east-1` for legacy-design-tools (current),
   **change to `us-central1`** for SmartCity OS to colocate with Cloud
   Run and close Fire 5 from
   [`10_ground_truth.md`](10_ground_truth.md).
3. **Plan the migration window per app.** SmartCity OS has live Bastrop
   users and zero-downtime windows are constrained. Legacy-design-tools
   is pre-launch — anytime is fine.

### Migration sequence per app

**Step 1 — Provisioning.** Create the new Empressa-owned Neon project.
Copy schema from current production:

```bash
# From any host with both connection strings:
pg_dump --schema-only --no-owner --no-acl "$REPLIT_NEON_URL" > schema.sql
psql "$EMPRESSA_NEON_URL" -f schema.sql
```

Verify schema parity with `\d+` per table on both.

**Step 2 — Initial data sync.** Dump and restore production data:

```bash
pg_dump --data-only --no-owner --no-acl "$REPLIT_NEON_URL" > data.sql
psql "$EMPRESSA_NEON_URL" -f data.sql
```

For SmartCity OS at low-traffic hour. Volume estimate: <1GB; should take
<5 minutes.

**Step 3 — Application cutover.** Update the production app's connection
string to point at the Empressa Neon. For legacy-design-tools (Replit):

- Update `DEPLOYMENT_DATABASE_URL` Replit secret to the new Empressa
  Neon URL
- Redeploy

For SmartCity OS (Cloud Run): update the GCP Secret Manager value
`smartcity-DATABASE_URL` and roll the service.

**Step 4 — Verify and observe.** For 24 hours, monitor:

- Application response times (should match prior baseline; SmartCity OS
  should improve once the cross-region hop is closed)
- Error rates
- Any rows being written to BOTH databases (would indicate a missed
  connection-string update)

**Step 5 — Decommission Replit-owned Neon.** Once comfortable (1 week
observation), delete the Replit-owned Neon project. This may require
asking Replit support to deprovision — they may not let you do it via
UI. Alternative: leave the old Neon empty and ignore (it's auto-paused
so cost is near zero).

### Estimated effort

- Per app: ~4 hours of focused work + 24 hours of observation
- Both apps in parallel: 1 dev-day + observation
- Risk: low if migration window is well-chosen and connection-string
  update is atomic

### Best done WITH the Cloud Run migration sprint

Both sprints touch the same connection-string boundaries. Doing them
together avoids touching production twice. Sequence:

1. Set up Empressa Neon for both apps (provisioning, schema sync) — 2 hours
2. Set up Cloud Run + GitHub Actions for legacy-design-tools — 4 hours
3. Cutover legacy-design-tools: new Neon + new Cloud Run, in one deploy — 30 minutes
4. Verify legacy-design-tools for 24 hours
5. Repeat steps 2-4 for SmartCity OS (Cloud Run already in place; just the Neon swap)

Total combined sprint: ~2.5 dev-days plus ~48 hours observation.

---

## SmartCity OS verification — what 2026-05-05 recon confirmed

The original advisory listed three checks to run on SmartCity OS to
confirm the same problem applied. The 2026-05-05 multi-repo recon
answered all three; results below. Findings are now codified in
[`10_ground_truth.md`](10_ground_truth.md).

**Check 1 — Is the SmartCity OS production Neon owned by Replit?**
**Confirmed.** `PROD_DATABASE_URL` in the SmartCity OS Repl points at
`ep-floral-sound-afocvkct.c-2.us-west-2.aws.neon.tech`. Nick has no
Neon Console access. The same credential lives in GCP Secret Manager
as `smartcity-DATABASE_URL` and is consumed by Cloud Run.

**Check 2 — How are migrations being applied?**
**Mixed pattern.** TS schema in `shared/schema.ts` is the canonical
source. `drizzle.config.ts` reads `process.env.DATABASE_URL`. Hand-rolled
SQL in `migrations/` exists with prefix collisions (two `0003_*`, two
`0004_*`). No journaled migrations folder. `scripts/post-merge.sh`
applies idempotent DDL via `[postMerge]` Replit hook with a
`DATABASE_URL` guard and `set -e` discipline — safer than
legacy-design-tools' equivalent. Migration ergonomics still need
upgrading, but the immediate-disaster risk is lower.

**Check 3 — How does production currently authenticate to Neon?**
**Via GCP Secret Manager.** Cloud Run service `smartcity-api` reads
`DATABASE_URL` from secret `smartcity-DATABASE_URL` (versions 1+2). The
secret value is the same connection string that's also in the Repl as
`PROD_DATABASE_URL`. No hardcoded strings in source. Trace verified.

The conclusion: SmartCity OS belongs in the same migration sprint as
legacy-design-tools. Cross-region hop adds one extra reason to do it.

---

## What changed in the immediate operational picture

Track B's fix worked around the access problem by using the Replit
Agent's secret-mediated connection. That's a one-time tactical move.
**It is not the deploy pattern going forward.**

Future schema migrations on the Replit-managed Neons (until the
migration sprint completes):

- The Replit Agent path remains the only option for legacy-design-tools
  (paired with `drizzle-kit push` against `DEPLOYMENT_DATABASE_URL`)
- For SmartCity OS, the safer `[postMerge]` pattern handles most cases;
  one-off SQL still goes through agent paths
- Each migration must be reviewed manually by Nick before fire (paste the
  SQL into chat for review, agent applies after explicit "go")
- Each migration must run inside an explicit `BEGIN; ... COMMIT;`
  transaction
- Each migration must use idempotent `IF NOT EXISTS` / `IF EXISTS`
  clauses so reapplying is safe
- After each migration, agent shows verification queries to prove the
  schema is in expected state

Once the migration sprint completes:

- Schema migrations go through `psql` from local against the
  Empressa-owned Neon URL
- Or through Drizzle migrate (if we adopt it) running in CI as part of
  the GitHub Actions deploy pipeline
- Or through manual review in Neon's web SQL editor — accessible
  because it's our account

### 2026-05-07 incident — dev DB wedge

Workspace `SmartCityOSMain` dev DB hit 20 GiB cap (3 MyGov tables
responsible: `mygov_raw_records` ~20 GB, `mygov_raw_sync_pages`
~9.3 GB, `mygov_work_orders` ~1.2 GB). Replit pre-flight blocked the
publish orchestrator on dev-DB health, requiring an eight-day support
cycle (VLR91Y-M3XRE) to root-cause. Cloud Run production was
unaffected throughout — the failure was confined to the Repl's
publish flow.

Decision: **Option B — retire the Repl, do not apply Replit's
cleanup recipe.** The wedged dev DB is an inadvertent safety against
accidental autoscale deploy of the 10 unreviewed local-Repl commits.
Fixing it would unblock that risk; retiring the Repl closes Fire 4
(Repl drift cleanup) cleanly and codifies Phase 0 Stage 8 (Repl
detach) for the first time.

This is the second consecutive Replit-platform incident in two weeks
(Track B saga 2026-05-05 + this 2026-04-29 wedge). Both are deploy
abstraction failures; both are invisible from outside the platform.
Strengthens the ADR-002 migration thesis. Full postmortem:
[`91_postmortems/2026-05-07_replit_dev_db_wedged.md`](91_postmortems/2026-05-07_replit_dev_db_wedged.md).

---

## Decisions captured (queued for ADR registry)

These belong in `80_adrs/` once that directory is populated. Until then
they live here as the canonical record.

**ADR-Replit-Neon-001:** Both `legacy-design-tools` and `smartcity-os-prod`
will migrate from Replit-managed Neon to Empressa-owned Neon as a paired
sprint, scheduled to coincide with the Cloud Run + GitHub Actions
migration sprint. Estimated sprint: ~2.5 dev-days plus 48 hours
observation.

**ADR-Replit-Neon-002:** Until the migration sprint completes, schema
migrations on Replit-managed Neons are applied via Replit Agent
connecting through the `DEPLOYMENT_DATABASE_URL` (legacy-design-tools)
or `PROD_DATABASE_URL` (smartcity-os) secret, with explicit
human-in-loop review of the SQL and verification of the resulting schema
state. This is a tactical workaround, not a pattern to extend or codify.

**ADR-Replit-Neon-003:** Future production databases for new Empressa
products will be provisioned by Empressa on `neon.tech` under our own
account. Replit's auto-provisioning of databases is to be avoided.

---

## Punch-list (active backlog for this advisory)

- [ ] Migrate `legacy-design-tools` production Neon to Empressa-owned
      Neon (paired with Cloud Run sprint)
- [ ] Migrate `smartcity-os-prod` production Neon to Empressa-owned
      Neon (paired with Cloud Run sprint, region `us-central1` to close
      the cross-region hop)
- [ ] Document Empressa Neon billing email and credentials in 1Password
      (or whatever Empressa adopts for shared credentials — see
      [`22_workstation_inventory.md`](22_workstation_inventory.md) note
      about credential vault)
- [ ] Decide on schema migration framework for both apps post-migration
      (Drizzle migrate vs raw SQL scripts in CI vs manual)
- [ ] Migrate ADR-Replit-Neon-001/002/003 from this advisory into
      `80_adrs/` when that directory is populated

Resolved during 2026-05-05 recon (struck through):

- ~~Verify SmartCity OS schema-management practice~~ — answered above; mixed pattern, post-merge.sh has guard
- ~~Update existing memory entries about SmartCity OS Neon~~ — done in [`10_ground_truth.md`](10_ground_truth.md) Planner-belief corrections

---

## What we did NOT do during the 2026-05-05 saga and why

- **We did not migrate legacy-design-tools' Neon.** We applied the
  Track B schema migration to the existing Replit-managed Neon
  instead. Migrating the database itself is a separate sprint that
  needs planning.
- **We did not touch SmartCity OS DB during the saga.** Same pattern
  presumably applies; verification was completed during 2026-05-05
  recon (see Check 1/2/3 results above).
- **We did not switch the Track B endpoint to a different Neon.** The
  migration applied to the Neon Replit reads from. The IFC handler
  works correctly post-saga.

---

## When to revisit

Re-read this doc:

- Before starting the Cloud Run + Empressa Neon migration sprint
- Before any new schema migration on either app's production Neon
- If a new Empressa product is being scoped (decide: Empressa-owned Neon
  from day 1, not Replit-auto-provisioned)
- If any team member beyond Nick needs database access
- When the migration sprint completes — at which point this doc moves
  to `status: superseded` with a closeout footnote

## Where the action items track

- **Migration sprint** — [`10_ground_truth.md`](10_ground_truth.md)
  Outstanding (smartcity-os) and Outstanding (design-accelerator)
- **Schema management discipline** — [`20_agent_operating_rules.md`](20_agent_operating_rules.md) HR-4, HR-5, HR-6
- **Verbatim verification on DB state** — [`20_agent_operating_rules.md`](20_agent_operating_rules.md) HR-8
- **Agent-mediated migration discipline** (BEGIN/COMMIT, idempotent,
  reviewed) — operational pattern; should land in
  [`90_runbooks/`](90_runbooks/) as a schema-migration runbook eventually
