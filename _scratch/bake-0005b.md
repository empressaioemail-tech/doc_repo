# bake-0005b (F-08)

LESSON: applyMigrations readdir of migrations/ is non-recursive. bake/ is invisible unless a second list function reads that directory.

LESSON: resolveTargetStores requires the MCP URL pair. bake-migrate needs only the neondb URL.

DEAD-END: reuse factory-conformant-migrate with different --args. That job's secret is FACTORY_DATABASE_URL and its command is migrate.

GROUND-TRUTH 2026-08-31T03:24Z: HEAD a7a8042 on seat/property-ctx-bake-migrate. CLI bake-migrate with no --target= → BAKE_TARGET_REQUIRED. Factory-pointed URL → FACTORY_URL_REFUSED, connect 0. Dry --target=staging names 0005b_landing_cad_txgio_alias.sql and STAGING_NEONDB_URL. Suite 319 pass / 0 fail / 2 skipped. 0005b not applied.

OPEN: planner commits this tree, pins factory-bake-migrate via cloudbuild.publish.yaml, dry then --apply on staging then production. Never factory-conformant-migrate. Never laptop psql.
