---
id: regenerate_schema_fixture_windows
title: Regenerate lib/db schema fixture on a Windows host
status: active
last_updated: 2026-05-06
applies_to: legacy-design-tools
related: [12_migration_sprint, 20_agent_operating_rules]
---

# Regenerate `lib/db` schema fixture on a Windows host

> **When you need this.** A PR's Test job fails on `pnpm --filter @workspace/db run test:fixture:drift` (CI message includes "Schema fixture drift detected"). The fixture at `lib/db/src/__tests__/__fixtures__/schema.sql.template` has drifted from current Drizzle TS schema state. Canonical fix is to regenerate the fixture against a postgres+pgvector instance running the current schema.

## Why this needs a runbook

The naive path — `pnpm --filter @workspace/db run test:fixture:schema` directly on the Windows host — fails for several reasons:
- Host `drizzle-kit push` reports "No schema files found" (TypeScript resolution differences vs container)
- Repo helper scripts (`refresh-schema-fixture.sh`, `check-fixture-drift.sh`) are CRLF, so Linux-side bash inside any container can't run them
- Running pnpm install inside a Linux container rewrites the workspace root `node_modules` for Linux, which then breaks subsequent Windows-side commands until restored

This runbook captures the working sequence that handles all three.

## Prerequisites

- Docker Desktop running on the Windows box (with Linux container support)
- Repo cloned at `P:\legacy-design-tools` (or wherever your local mirror is)
- Free TCP port for the postgres container (5432 is typically taken; 5433 is the default below)
- About 1GB free disk for the temporary postgres image + node_modules layers

## Sequence

### 1. Start postgres+pgvector with explicit platform

On ARM hosts (Apple Silicon, ARM Windows), the default amd64 image fails with `exec format error`. Match the host platform:

```bash
docker run -d --name ldt-fixture-pg \
  --platform linux/arm64 \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=test_db \
  -p 5433:5432 \
  pgvector/pgvector:pg14
```

On x86_64 hosts, drop `--platform linux/arm64`.

Verify the container is healthy:

```bash
docker exec ldt-fixture-pg pg_isready -U postgres
```

### 2. Push current schema via a node:20-bookworm container

The Windows host's drizzle-kit can't resolve workspace TS sources. Run drizzle-kit push from inside a Linux container that mounts the repo:

```bash
docker run --rm \
  -v "P:/legacy-design-tools:/workspace" \
  -w /workspace \
  --add-host=host.docker.internal:host-gateway \
  -e DATABASE_URL="postgres://postgres:postgres@host.docker.internal:5433/test_db" \
  node:20-bookworm \
  bash -c "corepack enable && pnpm install --frozen-lockfile && pnpm --filter @workspace/db run push"
```

This rewrites `node_modules/` Linux-side. We'll restore Windows-side later.

### 3. Regenerate the fixture from inside a container in the DB's network namespace

The repo's `refresh-schema-fixture.sh` is CRLF, so it can't be run directly inside Linux bash. Use an LF-only helper that just inlines the same `pg_dump` → `grep` → `sed` flow:

```bash
# In Windows shell, write an LF-only helper script
# Save as P:\refresh-helper.sh with LF line endings (use VS Code or notepad++ with explicit LF)
```

Helper content:

```bash
#!/usr/bin/env bash
set -euo pipefail
pg_dump --schema-only --no-owner --no-privileges \
  -h 127.0.0.1 -p 5432 -U postgres -d test_db \
  | grep -v '^--' \
  | sed 's/public\./@@SCHEMA@@\./g' \
  > /workspace/lib/db/src/__tests__/__fixtures__/schema.sql.template
```

Run the helper inside a container sharing `ldt-fixture-pg`'s network namespace:

```bash
docker run --rm \
  -v "P:/legacy-design-tools:/workspace" \
  -v "P:/refresh-helper.sh:/refresh-helper.sh" \
  --network container:ldt-fixture-pg \
  -e PGPASSWORD=postgres \
  postgres:14 \
  bash /refresh-helper.sh
```

Note `--network container:ldt-fixture-pg` reuses the postgres container's networking; `pg_dump` connects to `127.0.0.1:5432` inside that namespace.

### 4. Restore Windows-side node_modules

Step 2 left `node_modules/` in a Linux-built state. Restore for Windows:

```powershell
$env:CI = "true"
pnpm install --frozen-lockfile
```

If pnpm fails on the root preinstall script with a `sh not found` error, retry once with:

```powershell
pnpm install --frozen-lockfile --ignore-scripts
```

### 5. Verify and clean up

```bash
git status   # should show only lib/db/src/__tests__/__fixtures__/schema.sql.template modified
git diff --stat lib/db/src/__tests__/__fixtures__/schema.sql.template
```

Stop and remove the postgres container:

```bash
docker stop ldt-fixture-pg
docker rm ldt-fixture-pg
```

### 6. Move the change to a clean branch off origin/main

Standard one-file PR pattern; not Windows-specific. Stash the fixture change, switch to main, branch off, pop, commit, push, open PR with base `main`.

## Other tests that may need updating in lockstep

When schema drift surfaces, also check:
- `lib/db/src/__tests__/integration/schema.integration.test.ts` — has a hardcoded table allowlist (separate from the fixture). Add new tables there too if drift introduced them.
- Any other `*.test.ts` that asserts against a literal schema dump or column ordering.

Schema-touching PRs should default to grepping the codebase for hardcoded schema references before merge.

## Future cleanup

This runbook is a workaround. A native Windows-host schema regen path (no Docker) would be cleaner. Two possible future improvements:
- Convert repo bash scripts to LF line endings universally (requires `.gitattributes` enforcement)
- Provide a PowerShell-native `refresh-schema-fixture.ps1` that doesn't depend on bash
