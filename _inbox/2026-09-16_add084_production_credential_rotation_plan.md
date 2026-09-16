---
id: 2026-09-16_add084_production_credential_rotation_plan
title: ADD-084 production database credential rotation, planned for later (P-278)
date: 2026-09-16
last_updated: 2026-09-16
status: planned, not executed. Operator 2026-09-16: "plan it for later". Execution is an operator stop point (credentials) and must finish before Burnet's first production publish (P-278, teardown T9).
kind: runbook-plan
owner: integration seat; operator go required
plan_row: P-278
snapshot: secret metadata and Cloud Run specs read 2026-09-16T17:37Z from hauska-prod-497015 and legacy-design-tools-prod. Secret values were read in memory only to extract endpoint id, role and database; no password or full connection string was printed or stored. Instruments are scratchpad scripts `prod_role_bindings.mjs` (self-tests its parser against a synthetic string and its reference against itself) and `prod_role_consumers.mjs`; promote them to `scripts/` when this runs.
related:
  - _decisions/2026-09-16_engine_api_key_rotation_and_tag_cleanup.md (the template the reports lane used for the engine key)
  - 90_operations/OPS-16_texas_market_plan_of_record.md (A-182, P-278)
---

# ADD-084: rotating the production database credential

## What was exposed

On 2026-09-04 a CTX lane's debugging output printed the live `PRODUCTION_NEONDB_URL`. The
rotation it recommended never happened; the secret is still at version 1 (2026-08-28). The value
is a read-write connection for Neon role `neondb_owner` on endpoint `ep-lucky-truth-apodo8hr`, the
cortex-prod production branch, which holds the serving store (`neondb`) and the atoms store
(`hauska_mcp`).

## Everything that uses the same endpoint and role

**Nine secrets** (19 database-shaped secrets read; no secret on this endpoint uses another role):

| Project | Secret | Database | Versions (newest first) |
|---|---|---|---|
| hauska-prod | `PRODUCTION_NEONDB_URL` | neondb | v1 2026-08-28 |
| hauska-prod | `PRODUCTION_HAUSKA_MCP_URL` | hauska_mcp | v1 2026-08-28 |
| hauska-prod | `ATOMS_DATABASE_URL` | hauska_mcp | v1 2026-08-26 |
| hauska-prod | `CORTEX_DATABASE_URL` | neondb | v2 2026-08-05, v1 2026-06-10 |
| hauska-prod | `DATABASE_URL` | hauska_mcp | v2 2026-08-05, v1 2026-05-21 |
| hauska-prod | `SOURCE_DATABASE_URL` | neondb | v1 2026-08-26 |
| legacy-design-tools-prod | `ATOMS_DATABASE_URL` | hauska_mcp | v1 2026-08-21 |
| legacy-design-tools-prod | `DEPLOYMENT_DATABASE_URL` | neondb | v3 2026-08-05, v2 2026-05-20, v1 2026-05-06 |
| legacy-design-tools-prod | `DEPLOYMENT_DATABASE_URL_DIRECT` | neondb | v1 2026-08-31 |

Several older versions are still enabled. Whether they hold the same password is not known
without reading them; the rotation disables every version except the new one.

**Forty Cloud Run consumers** (all reference `:latest`):

- **Services (6).** hauska-prod: `hauska-engine-api`, `hauska-mcp-server`,
  `hauska-retrieval-api`. legacy-design-tools-prod: `cortex-api`, `smartsite-mcp`,
  `records-request-worker`.
- **Jobs (34), all in hauska-prod.**
  - The factory jobs on `PRODUCTION_NEONDB_URL`: acquire-* (7), `bake-migrate`,
    `bastrop-publish`, `dollar-fields-patch`, `flood-ingest`, `p2-juris`, and the parcel-*
    writers (11).
  - The atoms jobs on `ATOMS_DATABASE_URL`: `atoms-cad`, `bexar-edges`, `conformant`,
    `f10-cad-loop`, `parcel-building-footprint-reconcile`, `restamp-access`.
  - `landing-import` on `SOURCE_DATABASE_URL`.
  - The engine jobs `hauska-engine-atoms-writer`, `hauska-engine-depth-warm-remint` and
    `hauska-engine-footprint-retag`.
  - `ldt-cad-ingest`.

  The full list, with each variable mapping, is reproduced by `prod_role_consumers.mjs`.

**Not yet enumerated, and required before the go:** consumers outside Cloud Run. That means
Vercel projects (hauska-map apps, the command center), GitHub Actions secrets in every product
repo, Replit, and local `.env` files on the workstation. Also the grants `neondb_owner` holds
that a replacement role would need.

## The approach: a new role, moved to one consumer group at a time, then retire the old password

A Neon password reset takes effect at once. Resetting `neondb_owner` in place would break all 40
consumers until each was redeployed, including the six customer-facing services. So:

1. **Create a new role** on the production branch (for example `app_prod_202609`) with the grants
   the consumers need, read from the current role's grants and diffed. This is an operator stop
   point: a new credential.
2. **Mint new secret versions** holding the new role's connection string, in both projects, one
   per secret above (nine). Record lengths and endpoint ids only.
3. **Move consumers in groups**, each verified before the next.
   - The six services, canary then shift, each with a live read that touches the database.
   - The 34 jobs, by updating each job so its next execution resolves the new version. Verify
     with a dry-run execution per job family where a dry run exists. Otherwise verify at the
     next scheduled run, and keep no job paused longer than its schedule allows.
   - Then every non-Cloud-Run consumer found in the enumeration above.
4. **Prove the old credential is unused**: Neon's connection log, or `pg_stat_activity` by role,
   shows no `neondb_owner` sessions from application hosts over a declared window.
5. **Reset `neondb_owner`'s password** to a value stored only in the operator's admin vault, and
   disable every old secret version. Prove the exposed string is refused.

**Rollback:** until step 5, each group moves back by re-enabling the old secret version and
redeploying that group; nothing about the old role changes before step 5.

**Least privilege is a separate decision.** Most services only read; a read-only role for them
would shrink what any future exposure gives away. It is not required for this rotation, and it
should not be folded in without a ruling.

## When

Planned for later, on the operator's go. **It must complete before Burnet's first production
publish** (P-278): that publish is operator stop point 2, and it should not be authorised on a
read-write credential that has been exposed since 2026-09-04. Nothing else in Phase 0 waits on it.
