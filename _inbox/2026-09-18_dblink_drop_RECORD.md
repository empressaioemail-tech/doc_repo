---
id: 2026-09-18_dblink_drop_RECORD
title: dblink dropped from the production database, record
date: 2026-09-18
last_updated: 2026-09-18
status: done; dropped 2026-09-18 14:00:23.619Z, verified from a separate read-only session
kind: production-write record
owner: nick
maintained_by: integration seat
programs: [OPS-24, OPS-16]
authority: A-215 "also accepted" (`_decisions/2026-09-18_phase0_closeout_rulings.md`): dblink is dropped from the production database once the seat has confirmed nothing depends on it. Register section 3b row "dblink". Leave-behind of `_inbox/2026-09-17_williamson_mass_retirement_INCIDENT.md`.
target: PRODUCTION_NEONDB_URL (hauska-prod-497015 secret), database neondb, user neondb_owner, PostgreSQL 17.11
---

# dblink drop, 2026-09-18

## Why it existed

Created on 2026-09-17 to copy Williamson 48491's pre-incident payloads back from PITR branch
`br-late-rain-apffmnp2` (the restore in the incident record). It was created for that restore
and nothing else.

## Dependency check (read-only, 2026-09-18 13:41:18Z)

- `pg_extension`: `dblink` 1.2 in `public`, owner `neondb_owner`; 44 member objects.
- Objects outside the extension depending on a member: none. The one row the first query returned
  was the `pg_class` entry of the member composite type `dblink_pkey_results`, which is internal
  to that type.
- Foreign servers: none. User mappings: 0.
- Function bodies mentioning `dblink` outside the extension: none. Views and materialized views
  mentioning it: none. Triggers on such functions: none.
- Live sessions whose query mentions it: none. `pg_stat_statements` is not installed, so past use
  cannot be read from the database; the code search below covers that.
- Code at origin/main: legacy-design-tools has one mention, a comment in
  `artifacts/api-server/src/countyGeometryScoreCli.ts:23` saying it does NOT use dblink;
  hauska-engine, hauska-factory, hauska-map and hauska-mcp-server have none; doc_repo `scripts/`
  and `.claude/` have none.
- P-350 (the Williamson republish) runs through the publish lane, not a copy from the PITR branch.
  If a copy from that branch is ever needed again, `create extension dblink` is one statement that
  `neondb_owner` can run, as it did on 2026-09-17.

Second explanation considered and rejected: that a job outside these five repositories calls it.
Every writer to this database is a Cloud Run service or job built from one of them, and no
session is using it now.

## The statement

    begin;
    drop extension dblink;            -- RESTRICT (the default): refuses if anything depends on it
    select count(*) from pg_extension where extname = 'dblink';           -- expect 0
    select count(*) from pg_proc where proname like 'dblink%';            -- expect 0
    commit;

The drop is RESTRICT, so it refuses on its own if any dependent exists that the check missed.

## Outcome

Run by the integration seat, `psql` against `PRODUCTION_NEONDB_URL`, verbatim:

    started_at 2026-09-18 14:00:23.140735+00   db neondb   usr neondb_owner
    extname dblink  extversion 1.2
    BEGIN
    DROP EXTENSION
    dblink_extension_rows 0
    dblink_functions 0
    COMMIT
    committed_at 2026-09-18 14:00:23.619059+00
    extensions after: btree_gist 1.7, plpgsql 1.0, postgis 3.5.0, vector 0.8.0
    psql exit 0

RESTRICT raised no dependent, which agrees with the read-only check. Independent verification from a
fresh read-only session (pid 6535, 14:00:35.589Z): `pg_extension` rows named dblink 0, `pg_proc`
rows named dblink* 0, foreign-data wrappers named dblink* 0.

The incident's leave-behind for dblink is closed. The PITR branch `br-late-rain-apffmnp2` is not
touched here; it is deleted only after 48491 republishes (P-350).
