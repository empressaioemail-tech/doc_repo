---
id: 2026-06-07_legacy-design-tools_cc-agent-C_gtm_loop_discovery
title: Close report — GTM-loop discovery + observation + steward digest (cc-agent-C)
date: 2026-06-07
agent: cc-agent-C
repo: legacy-design-tools
dispatch: 2026-06-07_cc-agent-C_gtm_loop_discovery_automation_QUEUED
status: complete-pending-merge
---

# Close report — GTM-loop Tier-0 (cc-agent-C)

## Atoms resolved

| Atom | Use |
|---|---|
| `current-state:portfolio` | Confirmed build-out wave merged to `origin/main` (PRs #142–#147); prod deploy still pending per 76d §4 |
| `strategy-module:gtm-data-package-go-to-market` | Built only Tier-0 subset per 76d §5; Tier 1+ outbound held |
| `ops-scoreboard:weekly` | Digest exposes `external_callers`, `mcp_tool_calls`, `mcp_error_rate` for 79a |

Optional: `strategy-module:competitive-execution-system` — not touched (R/D additive only).

## Model

**Grok Build 0.1** (default per HR-12). No Claude escalation.

## Workspace / git gate

**Initial state refused** — clone was on alien HEAD `cortex/subsurface-data-layer` with submodule dirt. Checked out `main`, fast-forwarded to `origin/main`, branched `gtm/loop-discovery-automation`.

**Verbatim `git status` at close:**

```
On branch gtm/loop-discovery-automation
Your branch is up to date with 'origin/gtm/loop-discovery-automation'.

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
  (commit or discard the untracked or modified content in submodules)
	modified:   .claude/worktrees/recon-add-jurisdiction (untracked content)
	modified:   .claude/worktrees/track-b-ifc-ingest (modified content, untracked content)

no changes added to commit (use "git add" and/or "git commit -a")
```

**Verbatim `git log -3` at close:**

```
2ffc16e feat(gtm): Tier-0 loop — triage, scoreboard metrics, outbound gate
3aa33a9 feat(finding-engine): ADR-019/021 precedence reconciliation primitive (WS2) (#147)
d487068 feat(finding-engine): plan-set decomposition + per-discipline orchestration (WS1) (#146)
```

## 76b observation schema — verbatim verification (HR-8)

**Question:** Did migration 0029 gtm_events / mcp_usage extension already land?

**Answer: YES — observation layer already on `origin/main`. Do not re-build migration.**

| File | Status |
|---|---|
| `lib/db/drizzle/0028_gtm_observation_layer.sql` | **LANDED** — creates `gtm_consent`, `gtm_events` |
| `lib/db/drizzle/0029_brokerage_workspace_wallet.sql` | **Different migration** — brokerage wallet, NOT GTM observation |
| `lib/db/drizzle/0032_gtm_mcp_observation.sql` | **LANDED** — 76b Track C MCP extension (source_surface index, mcp tool payload index) |

**Verbatim `0032_gtm_mcp_observation.sql` on disk:**

```sql
-- GTM MCP observation extension (76b Track C).
-- Event types validated in api-server; payload may include tool_name, error_class,
-- jurisdiction_key, api_key_hash (sha256 prefix, no raw keys).

ALTER TABLE "gtm_events"
  ALTER COLUMN "source_surface" SET DEFAULT 'api';

COMMENT ON COLUMN "gtm_events"."source_surface" IS
  'extension | api | mcp | docs | share_page';

CREATE INDEX IF NOT EXISTS "gtm_events_source_surface_created_at_idx"
  ON "gtm_events" ("source_surface", "created_at" DESC);

CREATE INDEX IF NOT EXISTS "gtm_events_mcp_tool_payload_idx"
  ON "gtm_events" ((payload_json ->> 'tool_name'))
  WHERE event_type = 'mcp_tool_call';
```

**Pre-existing on main (not re-built this run):**

- `artifacts/api-server/src/routes/brokerageGtm.ts` — consent, events, mcp-event, digest
- `artifacts/api-server/src/lib/gtmErrorClass.ts` — unified taxonomy
- `artifacts/api-server/src/lib/gtmMcpEvents.ts` — event types + key hash
- `lib/db/src/schema/gtmEvents.ts` — Drizzle schema

## What this PR adds (Tier-0 delta only)

| Component | Path | Notes |
|---|---|---|
| Read-only triage | `artifacts/api-server/src/lib/gtmTriage.ts` | intent score, data package, conversion, friction |
| Scoreboard metrics | `artifacts/api-server/src/lib/gtmScoreboardMetrics.ts` | `external_callers`, `mcp_tool_calls`, `mcp_error_rate` |
| Policy tier gate | `artifacts/api-server/src/lib/gtmPolicy.ts` | `OUTBOUND_ENABLED` (default false), `GTM_EO_BOUND`, consent |
| Tier 1 outbound stub | `artifacts/api-server/src/lib/gtmOutbound.ts` | send path exists; blocked in v1 |
| Digest + routes | `brokerageGtm.ts` | `GET /gtm/triage`, `POST /gtm/outbound/attempt`, MCP section in digest |
| External caller fix | `gtmMcpEvents.loadInternalGtmApiKeys()` | only dev/service keys internal; customer keys in `BROKERAGE_API_KEYS` = external |

## Acceptance criteria

| Criterion | Status |
|---|---|
| MCP events in `gtm_events` with required fields | **Pre-landed** + external-caller fix in PR |
| Steward digest MCP section + 3 scoreboard metrics | **Done** — `GET /api/brokerage/v1/gtm/digest` → `mcp.scoreboard` |
| Triage classifies sample events | **Done** — `GET /api/brokerage/v1/gtm/triage` + auto `triage_signal` on external mcp-event |
| Outbound provably disabled | **Done** — test asserts 403 + `sent: false` when `OUTBOUND_ENABLED` unset |
| Tests | **Partial local** — see below |
| PR held for operator merge | **Yes** — not merged |

## Tests

**Suite:** `@workspace/api-server` vitest

**Passed locally (no DATABASE_URL):**

```
vitest run src/lib/__tests__/gtmTriage.test.ts src/lib/__tests__/gtmPolicy.test.ts
→ 9 tests passed
```

**Requires CI Postgres (`DATABASE_URL`):**

```
vitest run src/__tests__/brokerageGtm.test.ts
→ integration tests for digest scoreboard, triage route, outbound gate
```

Full monorepo: `pnpm test` (CI job Test in `.github/workflows/pr-checks.yml`).

## PR

- **URL:** https://github.com/empressaioemail-tech/legacy-design-tools/pull/148
- **Branch:** `gtm/loop-discovery-automation`
- **SHA:** `2ffc16e5474bb11c3d8beec87ab769de51e5912e`
- **Merge:** held for operator

## Blockers (verbatim)

1. **Submodule dirt** — `.claude/worktrees/*` show untracked content; not part of PR; operator may clean locally.
2. **Local integration tests** — `DATABASE_URL` / `TEST_DATABASE_URL` unset on cente workstation; Docker unavailable. CI is authoritative for `brokerageGtm.test.ts`.
3. **Prod deploy gate** — 76d §4 still pinned; loop observes live surface post-deploy. Tier-0 code can merge pre-deploy; E5 external caller validation waits on prod MCP traffic.
4. **Pre-existing typecheck noise on main** — `planSetClassification.ts` / `findings.ts` errors unrelated to this PR; CI typecheck job validates per-artifact.

## Escalation log

None (Grok Build 0.1 completed without retry failure).
