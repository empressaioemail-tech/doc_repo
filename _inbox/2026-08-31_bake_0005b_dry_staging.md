---
id: 2026-08-31_bake_0005b_dry_staging
title: factory-bake-migrate staging dry, read before apply
date: 2026-08-31
last_updated: 2026-08-31
status: filed
plan_row: F-08
---

# Staging dry

Pin: Cloud Build `6f505fcc-3ad2-430e-beb3-ff6f933b0a7f` SUCCESS. Job `factory-bake-migrate` generation 1. Image `sha256:4103d8d9`. Secrets `STAGING_NEONDB_URL` and `PRODUCTION_NEONDB_URL` only. Template args `bake-migrate` (no `--target=`).

First execute `factory-bake-migrate-qgv2q` failed. Execution log args were one string `bake-migrate --target=staging`. Container exit 2, usage line. PowerShell ate the comma. That execution is not a dry plan.

Second execute `factory-bake-migrate-klk48`. Execution log args: `bake-migrate`, `--target=staging`. Completed successfully. Stdout:

```
ok true
dry true
applied false
job factory-bake-migrate
store bake-neondb
target staging
urlVar STAGING_NEONDB_URL
files [0005b_landing_cad_txgio_alias.sql]
```

No Factory URL in the plan. Apply is a separate execute.
