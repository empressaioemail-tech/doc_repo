---
id: 2026-05-26_cc-agent-C_jurisdiction_surfacing_v2
title: Dispatch — Jurisdiction surfacing v2 (coverage status + request coverage)
date: 2026-05-26
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
related: [41a_cortex_jurisdiction_surfacing, 43_cortex_qa_backlog, QA-20, QA-23]
prerequisite: v1.5 merged recommended; v1 required
coordination: cc-agent-E for QA-20 engine hook (separate session)
---

# Jurisdiction surfacing v2 — coverage on engagement

**Canonical:** [`41a_cortex_jurisdiction_surfacing.md`](../41a_cortex_jurisdiction_surfacing.md) § v2.

## Goal

After geocode, every engagement exposes **honest code coverage** to UI and agent. No fabricated citations when status is `not_in_catalog` (QA-23). Operator can **Request coverage** (queues QA-20 path).

## Data model — migration `0021_engagement_coverage.sql`

Add to `engagements`:

| Column | Type | Notes |
|--------|------|-------|
| `substrate_jurisdiction_key` | `text` nullable | Best match from Hauska MCP `list_jurisdictions` keys |
| `cortex_jurisdiction_key` | `text` nullable | Existing `keyFromEngagement()` from `@workspace/codes` |
| `coverage_status` | `text` not null default `'unknown'` | enum below |
| `coverage_requested_at` | `timestamptz` nullable | Set when user clicks Request coverage |

**`coverage_status` values:**

| Value | Meaning |
|-------|---------|
| `unknown` | No geocode yet |
| `not_in_catalog` | Geocoded; no substrate + no cortex warmup key |
| `substrate_only` | On Hauska MCP catalog; cortex-local not warmed / no atoms |
| `warming` | Cortex warmup in progress (optional: tie to existing warmup status API) |
| `ready` | `cortex_jurisdiction_key` set and atoms available |

Recompute on: address PATCH geocode, manual jurisdiction PATCH, engagement create with address.

## Resolver — new module `lib/coverage/resolveEngagementCoverage.ts`

Inputs: engagement row + optional `listJurisdictions()` snapshot (cache per request).

Steps:

1. If no `jurisdictionState` (and no resolvable city/state): `unknown`.
2. `cortexKey = keyFromEngagement(engagement)` from `lib/codes/src/jurisdictions.ts`.
3. `substrateKey = matchSubstrateJurisdiction(mcpList, city, state, fips)`:
   - Match MCP jurisdiction `key` / `displayName` against state (normalize `bastrop-tx` vs `bastrop_tx`).
   - Prefer FIPS/county name when available; document heuristic in PR.
4. If neither key: `not_in_catalog`.
5. If `substrateKey` but no `cortexKey`: `substrate_only`.
6. If `cortexKey` and warmup complete (use existing codes jurisdiction atom count or warmup status): `ready` else `warming`.

Persist all three fields on engagement update after geocode in `engagements.ts`.

## API

- Include `substrateJurisdictionKey`, `cortexJurisdictionKey`, `coverageStatus`, `coverageRequestedAt` on engagement GET/list/detail wire types.
- **`POST /api/engagements/:id/request-coverage`**
  - Sets `coverage_requested_at = now()`.
  - Inserts row into `coverage_requests` table (optional v2 minimal) OR append atom event / log for cc-agent-E.
  - Body optional: `{ note?: string }`.
  - Returns 202 `{ status: "queued", engagementId }`.
  - Idempotent if already requested within 24h.

**Minimal `coverage_requests` table (recommended):**

```sql
CREATE TABLE coverage_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  engagement_id uuid NOT NULL REFERENCES engagements(id),
  jurisdiction_state text,
  jurisdiction_city text,
  jurisdiction_fips text,
  note text,
  status text NOT NULL DEFAULT 'open',
  created_at timestamptz NOT NULL DEFAULT now()
);
```

cc-agent-E consumes `open` rows later (QA-20); v2 only creates queue + operator-visible confirmation.

## UI

| Surface | Behavior |
|---------|----------|
| Site tab | Banner from `coverageStatus` (not spinner forever when `not_in_catalog`) |
| Code Library | **Active project** section shows status badge |
| Findings | Block self-run or show warning when `not_in_catalog` / `unknown` (QA-49) |
| Engagement settings / Site | **Request coverage** button when `not_in_catalog` or `substrate_only` |

Copy must follow quality gate: "No ingested code corpus for this location yet" — not "coming soon" without backend.

## Agent (chat)

- Extend grounding in `chat.ts` / tools: when `coverageStatus` is `not_in_catalog`, refuse code citations; point to Request coverage (QA-23 pattern already started in PR #60 — wire to new field).

## QA-20 hook (coordination only in this PR)

- Document contract in PR body for cc-agent-E:
  - Read `coverage_requests` where `status = 'open'`.
  - Engine Lane E ingest is out of scope for cc-agent-C; do **not** implement ingest pipeline here.
- Optional: emit structured log `coverage_request.queued` for operator visibility.

## Out of scope

- Automatic ingest on request (cc-agent-E).
- Substrate server-side filter (v3).
- Multi-tenant workspace.

## Acceptance

- [ ] Musgrave engagement after geocode: `coverageStatus` = `ready`, keys populated.
- [ ] Address in uningested state (e.g. Pagosa): `not_in_catalog`; agent does not cite IRC sections; Request coverage sets timestamp.
- [ ] Dallas + substrate match: appropriate status (ready or substrate_only per warmup).
- [ ] Tests: resolver unit tests + engagement PATCH integration test.

## Reporting

`P:\doc_repo\_inbox\2026-05-26_legacy-design-tools_cc-agent-C_jurisdiction_v2_close.md`
