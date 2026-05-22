---
id: 2026-05-22_cc-agent-C_ifc_ingest_schema_migration
title: Dispatch — cc-agent-C apply outstanding DB migrations to cortex-api prod (IFC ingest 500)
date: 2026-05-22
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
related: [43_cortex_qa_backlog, 90_runbooks/neon_schema_migration_via_cloud_shell, 90_runbooks/cloud_run_canary_deploy, 00_current_state, 20_agent_operating_rules]
---

# cc-agent-C dispatch — cortex-api production schema migration (IFC ingest 500)

> **Folded into the cc-agent-D fix session 2026-05-22.** The operator consolidated the 2026-05-22 QA bugs into one fix session, [`2026-05-22_cc-agent-D_cortex_functionality_fix_session.md`](2026-05-22_cc-agent-D_cortex_functionality_fix_session.md), where the IFC schema migration is P0-1. Do not run this as a separate cc-agent-C dispatch; the verified diagnosis below is carried into P0-1 of that session.

You are cc-agent-C. This dispatch closes the IFC-ingest 500 surfaced in the 2026-05-22 operator QA pass. The cause is verified from the cortex-api production logs: a database schema-drift gap, not a code bug.

## The verified cause

A real Revit IFC upload to `POST /api/snapshots/{id}/ifc` on the deployed revision `cortex-api-00017-gex` returns HTTP 500. The production log (`legacy-design-tools-prod`, `run.googleapis.com/stdout`) shows:

```
ifc ingest: atom insert failed
caused by: error: column materializable_elements.superseded_at does not exist
    at ingestSnapshotIfc (/app/artifacts/api-server/src/lib/ifcIngest.ts:389)
    ... /app/artifacts/api-server/src/lib/ifcIngest.ts:394
    ... /app/artifacts/api-server/src/routes/snapshots.ts:1019
```

The IFC ingest code queries `materializable_elements` filtering on `superseded_at is null`, but the production database has no `superseded_at` column on that table. The table exists; the column does not. The code is correct; the database schema is behind it. Every IFC upload fails identically.

`materializable_elements.superseded_at` is the column added by the supersede-and-append-on-re-ingest feature (legacy-design-tools PR #33, merged 2026-05-19). The QA-04 session (2026-05-21) applied drizzle migrations 0009-0014 plus `track-b-ifc-ingest.sql` to the production database manually. The migration that adds `superseded_at` was not in that set, and neither were any migrations merged since.

## Scope

1. **Audit the migration gap.** Compare the production database's applied-migration state against the current drizzle migration head in `legacy-design-tools` `main`. The QA-04 baseline is "0009-0014 plus `track-b-ifc-ingest.sql` applied." Identify every migration since, not only the one that adds `superseded_at`. The deploy does not run migrations, so other post-0014 schema-touching PRs (the L-surface tables, the codex-reviewer-qa work) may also be under-migrated on prod; the IFC column is just the first drift to surface.
2. **Propose the apply plan.** Produce the exact ordered list of migrations to apply, and surface it for operator approval before any production-database write. This is a production DB change, operator-supervised.
3. **Apply the gap** to the cortex-api production database (`legacy-design-tools-prod`), per [`90_runbooks/neon_schema_migration_via_cloud_shell.md`](../90_runbooks/neon_schema_migration_via_cloud_shell.md), the same path as the QA-04 apply.
4. **Verify.** After the apply, a real Revit IFC upload, or an equivalent `POST /api/snapshots/{id}/ifc` call, returns 201 against `cortex-api-tds7av26va-uc.a.run.app`. Confirm against the logs that `ingestSnapshotIfc` completes without a `DrizzleQueryError`.

## The root cause, flag for a follow-on

The cortex-api Cloud Run deploy (`cloud-run-deploy.yml`) ships code but never runs database migrations. Every schema-touching PR since the cutover has created drift that only a manual apply closes; this IFC 500 is that drift surfacing. Recommend a follow-on in your `_inbox/` summary: a migration step in the deploy process (a workflow job, or a documented mandatory pre-shift step) so this stops recurring. Do not build it in this dispatch; this dispatch closes the immediate gap.

## Run posture

Operator-supervised. The migration plan is surfaced for operator approval before any production-database write. No code change is expected. If the audit finds that the repo's migration files and the code's schema expectations themselves disagree, stop and surface to the planner.

## Reporting

Write your session summary and the migration audit to `P:\doc_repo\_inbox\` as `<date>_legacy-design-tools_cc-agent-C_<topic>.md` per HR-11 in [`20_agent_operating_rules.md`](../20_agent_operating_rules.md). Do not commit to the doc repo.
