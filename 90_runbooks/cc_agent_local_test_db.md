---
id: cc_agent_local_test_db
title: Runbook — local test database for cc-agents (kill the CI-blind PR)
status: active
last_updated: 2026-06-14
applies_to: portfolio
related: [20_agent_operating_rules, _dispatches/_template, 90_runbooks/agent_workspace_hygiene]
---

# Local test database for cc-agents

> **Why this exists.** The `legacy-design-tools` api-server integration suites read `process.env.DATABASE_URL` (the vitest `test-env.ts` setup file leaves it untouched; the schema lifecycle in `@workspace/db/testing` reads it and pushes the schema). CI (`.github/workflows/pr-checks.yml`) hands the suites a throwaway Postgres service container. The cc-agent workstation has no such database, so the agent physically cannot run those suites and reports "committed, expected green in CI." Three times in the 2026-06-14 anonymous-owner-isolation work, an artifact claimed done while the wire disagreed; each traced to this one gap (per-user auth shipped a live data leak; PR #180 opened labeled "expected green" while the Test job was red with ~30 failures). This runbook closes it: give the workstation the same disposable Postgres CI uses, so the agent verifies before it opens a PR.

## The one hard guardrail

`DATABASE_URL` on a cc-agent workstation must point at a **local, disposable Postgres** — never a Neon host, never the deployment/prod database. The integration suites truncate and seed tables. Pointing them at a real Neon would corrupt live data, and we are one keystroke from the data the isolation fix exists to protect. If a `DATABASE_URL` resolves to anything containing `neon.tech` or a deployment-suffixed host, stop and fix it before running tests. This is the test-side companion to HR-6 (verify env bindings before destructive ops).

## Setup (mirrors CI exactly)

CI uses a Postgres service at `postgres://postgres:postgres@localhost:5432/test_db` with the `vector` extension. Reproduce it locally with a pgvector-capable image (plain `postgres` lacks the extension):

```bash
docker run --name cortex-testdb -d -p 5432:5432 \
  -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=test_db \
  pgvector/pgvector:pg16
docker exec cortex-testdb psql -U postgres -d test_db -c "CREATE EXTENSION IF NOT EXISTS vector;"
```

Set the env on the workstation (a gitignored `.env.test`, or the Cursor agent shell). Keep it out of any committed file:

```bash
export DATABASE_URL=postgres://postgres:postgres@localhost:5432/test_db
```

Run the suites the same way CI does:

```bash
cd P:/legacy-design-tools
pnpm --filter @workspace/api-server test
# or a single suite while iterating:
pnpm --filter @workspace/api-server test -- src/__tests__/anonymous-sees-no-migration-owner-data.test.ts
```

The test harness pushes the schema itself on each run, so a blank database is correct. There is no manual migration step and no "migration merged != applied" trap here — the harness applies whatever the branch's TS schema declares, including a PR's new migration.

## Verifying the wiring works

```bash
docker exec cortex-testdb psql -U postgres -d test_db -c "\dx"   # vector extension present
pnpm --filter @workspace/api-server test -- src/__tests__/session.test.ts   # a DB-touching suite runs, not skipped
```

If suites error with `DATABASE_URL must be set` or `Did you forget to provision a database?`, the env var is not reaching the agent shell. If they error connecting to `localhost:5432`, the container is not running (`docker start cortex-testdb`).

## Reset / housekeeping

The container is disposable. To get a clean database (e.g. after a corrupted run) recreate it:

```bash
docker rm -f cortex-testdb
# then re-run the docker run + CREATE EXTENSION block above
```

Nothing in this container is precious. It holds only ephemeral test fixtures.

## Windows note

The cc-agent workstation is Windows. This needs Docker Desktop (WSL2 backend) or a WSL2-hosted Postgres. The host has a TLS-intercepting proxy that affects outbound HTTPS (see the UpCodes `NODE_OPTIONS=--use-system-ca` note in the codewarm runbook), but local Postgres on `localhost:5432` does not traverse the proxy, so it is unaffected.

## Parity source

The authoritative definition of what the suites need is `.github/workflows/pr-checks.yml` in `legacy-design-tools` (the `postgres` service block, the `DATABASE_URL` env, and the `CREATE EXTENSION vector` step). If CI's database setup changes, reconcile this runbook against it.

## Enforcement

Wiring the database is the enabler; the behavior change is the rule. Per [`20_agent_operating_rules.md`](../20_agent_operating_rules.md) HR-13, any dispatch touching api-server routes, DB schema, or integration-tested code requires a pasted local test run; "expected green in CI" is not an acceptable verification artifact. The dispatch template carries the criterion.
