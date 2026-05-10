---
id: 2026-05-07_replit_dev_db_wedged
title: Replit dev DB wedged — workspace SmartCityOSMain (Apr 29 – May 7)
status: active
last_updated: 2026-05-10
applies_to: smartcity-os
related: [10_ground_truth, 15_replit_neon_ownership_advisory, adr_002_replit_neon_migration, 2026-05-05_track_b_deploy_saga]
---

# Replit dev DB wedged — postmortem

## Timeline

- **2026-04-29**: Republish click on Replit workspace `SmartCityOSMain` hung at "Preparing" stage; orchestrator never started pipeline. No deploy history entries. Logs tab showed only the live 17-day-old container's normal request logs. Multiple Republish attempts across multiple sessions all hung identically.
- **2026-04-29**: Diagnostic effort by Nick — `kill 1` workspace reboot, cleared `.git/index.lock` and `.git/objects/maintenance.lock`, set unrelated missing `VFD_JWT_SECRET`, `createDatabase` API returned `alreadyExisted: true`, `checkDatabase` returned `provisioned: false`. TCP to helium:5432 accepted but Postgres protocol timed out. Yellow banner: "Failed to fetch PostgreSQL major version for development database". Filed support ticket VLR91Y-M3XRE.
- **2026-04-29 → 2026-05-07**: Eight-day delay through Replit support tiers (Quinn → Alan → Bob).
- **2026-05-07**: Bob (Replit Support) replied with diagnosis and recipe.
- **2026-05-09**: Postmortem drafted in planner conversation.
- **2026-05-10**: Decision made (Option B — retire Repl, do not apply Replit's recipe). Postmortem committed to doc_repo.

## Root cause

Replit dev databases are sized at 20 GiB. The `SmartCityOSMain` workspace's helium dev DB had grown to ~30 GiB across three MyGov ingestion tables. The underlying Postgres engine failed to start with `could not create lock file 'postmaster.pid': Disk quota exceeded`, leaving the workspace in a "control-plane / data-plane split" state — metadata row fine (so `createDatabase` returned `alreadyExisted: true` and refused to re-instantiate), volume full (so engine dead, half-wedged TCP-accept-but-protocol-timeout symptom).

Replit's deploy orchestrator pre-flight waits on a healthy dev DB before invoking the deploy pipeline. The wedged dev DB blocked the publish flow from leaving "Preparing" indefinitely.

Three tables responsible for nearly all usage (per Bob's diagnostic):

| Table | Size |
|---|---|
| `mygov_raw_records` | ~20 GB |
| `mygov_raw_sync_pages` | ~9.3 GB |
| `mygov_work_orders` | ~1.2 GB |

These are the raw output of MyGov scrape pipelines (per `30_smartcity_os.md` integration table). They accumulated in dev because development cron-driven scrapers ran against the helium dev DB. Production Neon (smartcity-os Replit-managed Neon, `ep-floral-sound-afocvkct.c-2.us-west-2.aws.neon.tech`) was unaffected and continued serving Cloud Run traffic throughout.

## Replit's recommended fix (NOT executed — see Decision below)

Bob's recipe, captured verbatim for reference:

```bash
# Step 1: Backup the three large tables
pg_dump "$DATABASE_URL" -t mygov_raw_records -Fc -f mygov_raw_records.backup
pg_dump "$DATABASE_URL" -t mygov_raw_sync_pages -Fc -f mygov_raw_sync_pages.backup
pg_dump "$DATABASE_URL" -t mygov_work_orders -Fc -f mygov_work_orders.backup

# Step 2: Verify backups
ls -lh *.backup
pg_restore -l mygov_raw_records.backup | head

# Step 3: Drop tables
psql "$DATABASE_URL" -c "DROP TABLE mygov_raw_records;"
psql "$DATABASE_URL" -c "DROP TABLE mygov_raw_sync_pages;"
psql "$DATABASE_URL" -c "DROP TABLE mygov_work_orders;"

# Step 4: Reclaim disk space
psql "$DATABASE_URL" -c "VACUUM FULL;"
```

Bob noted: dev DB is intended for testing data and capped at 20 GiB; production DBs hold up to 100 GiB. If raw-records data needs durable home, write to production DB or external store, not workspace dev DB.

## Decision — Option B

**Do not apply Replit's recipe. Retire the Repl instead.**

Rationale:

1. **Repl is functionally orphaned.** `smartcityos.io` traffic is served by Cloud Run since 2026-05-03 deploy `00082-pog`. The Repl is no longer in production traffic.
2. **`.replit` `[deployment]` block remains intact** — autoscale-deployable from the Repl. 10 unpushed local-Repl commits exist, including `b67c333` ("Fix issue preventing users from publishing updates"), which based on timing and subject is almost certainly a local-only workaround for this exact wedge issue.
3. **Wedged dev DB is an inadvertent safety.** Fixing it would unblock Republish, which would allow accidental autoscale deploy of the 10 unreviewed local commits. Loaded gun.
4. **Phase 0 Stage 8 (Repl detach) was never codified.** Codifying it now closes Fire 4 (Repl drift cleanup) cleanly.
5. **This is the second Replit-platform incident in two weeks** — Track B saga 2026-05-05 (deploy build path failures) + this 2026-04-29 wedge. Strengthens ADR-002 migration thesis (move both apps off Replit-managed infrastructure).

## Operational close-out (Fire 4 dispatch — pending next session)

- Salvage `b67c333` for inspection: from Replit web shell, `git push origin local-main:archive/repl-local-main-20260510`. Preserves the 10 commits on origin without merging. Cursor agent in `P:\smartcity-os` can then inspect from local clone after `git fetch origin --prune`.
- PR against smartcity-os main: neutralize `.replit` `[deployment]` and `[postMerge]` blocks. Replace `[deployment]` with a loud-fail variant rather than silent removal:

```
[deployment]
deploymentTarget = "autoscale"
build = ["sh", "-c", "echo 'This Repl is retired. Production is on Cloud Run. See doc_repo/10_ground_truth.md.' && exit 1"]
run = ["sh", "-c", "exit 1"]
```

- Stop scheduled crons in the Repl (workspace cron config).
- Rename Replit workspace to `SmartCityOSMain-retired-20260510` for visual clarity.
- Do not delete the Repl (retain audit trail).

## Lessons

1. **Replit's deploy abstraction couples deploy-availability to dev-DB health.** Pre-flight blocks orchestrator on dev-DB failure. This is undocumented coupling — Nick's eight-day debug was rational given the symptom set (TCP accepts, protocol timeout, "alreadyExisted: true" with "provisioned: false") didn't immediately suggest a dev-DB quota issue. Adds to the case for ADR-002.
2. **Raw-record ingestion to dev DBs is a footgun.** The MyGov scrape pipeline writing to whatever `DATABASE_URL` resolves to means dev becomes prod-shaped if scrapers run there. Recommendation: audit production Neon for the same growth pattern (independent of Repl dev DB) — added to 11_roadmap.md backlog.
3. **Eight-day support cycle on a paying-customer-tier ticket.** Bastrop is under PSA. The "no urgency, production is unaffected" framing in the ticket softened the SLA expectation. For future Replit support tickets, lead with customer-impact framing more aggressively.
4. **`b67c333` exists only in Replit workspace filesystem.** Lesson generalizes: any commit not on origin is at risk. The 10 unpushed local-Repl commits should be pushed to an `archive/` branch on origin before retiring the Repl, even if their content is determined unimportant.

## References

- Replit support ticket: VLR91Y-M3XRE (Zendesk thread Apr 29 → May 7)
- 10_ground_truth.md — Repl section, Fire 4 description, Fire 1 closure
- 15_replit_neon_ownership_advisory.md — risk framing
- 80_adrs/adr_002_replit_neon_migration.md — migration thesis
- 91_postmortems/2026-05-05_track_b_deploy_saga.md — prior Replit-platform incident
- _sessions/2026-05-10_fire_1_closed_and_bar_c_kickoff_claude_ai_planner.md — session context
