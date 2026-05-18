---
id: 2026-05-18_hauska_mcp_stream_2b_cc-agent-M
title: Session — hauska-mcp-server Stream 2B foundations (auth, Postgres api_keys, Upstash Redis dual-window rate limit, admin endpoints)
date: 2026-05-18
agent: cc-agent-M
repo: hauska-mcp-server
session_type: engineering
rolled_up: false
rolled_up_into: []
---

## What was done

Session kickoff per [`_dispatches/2026-05-18_cc-agent-M_hauska_mcp_server.md`](../_dispatches/2026-05-18_cc-agent-M_hauska_mcp_server.md). cc-agent-M owns Track 2 (Streams 2A through 2D) on `empressaioemail-tech/hauska-mcp-server`. Nick selected Stream 2B foundations for this session with Stripe scaffold and self-serve signup explicitly deferred to a follow-up session.

The starter scaffold (commit `d00586b`) shipped with five MCP tools, Streamable HTTP transport, an in-memory rate limit, a stdout logger, and a comma-separated-env-var key list. This session replaced the auth and rate-limit substrate end to end.

New source files in [`hauska-mcp-server`](https://github.com/empressaioemail-tech/hauska-mcp-server):

- [`src/tiers.ts`](../../../hauska-mcp-server/src/tiers.ts). Four-band Tier enum (`free`, `developer_pro`, `team`, `embedder`) matching [`29_mcp_surface_tier_model.md`](../29_mcp_surface_tier_model.md) substrate-MCP table. Per-tier `RateLimits` struct carrying both an `rpm` and a `daily` cap; either set to 0 means unmetered on that axis. Env-var overrides per tier (`HAUSKA_FREE_KEY_RPM`, `HAUSKA_DEVELOPER_PRO_DAILY`, etc.). Defaults match 29's published daily caps (1K IP, 10K key, 50K Pro, 500K Team, unmetered Embedder) plus a derived RPM burst cap; Nick can shift any band without redeploy.
- [`src/keys.ts`](../../../hauska-mcp-server/src/keys.ts). Wire format `hk_<tier-prefix>_<43-char-base64url>`. `generateKey(tier)` returns `{raw, hash, tier}` with SHA-256 hex hash (raw key shown exactly once at mint). `parseKey()` validates shape and recovers tier via regex before the DB hit, so shape failures log distinctly from hash-miss failures. `constantTimeEquals()` wraps `crypto.timingSafeEqual` for the admin bootstrap comparison.
- [`src/db.ts`](../../../hauska-mcp-server/src/db.ts). `pg` pool with lazy init; `api_keys` CRUD (`insertKey`, `findKeyByHash`, `listKeys`, `updateKey`, `revokeKey`). `touchLastUsed(keyId)` is fire-and-forget so the auth hot path never blocks on a stat write. Row casting validates `tier` value via the tier enum before returning. `ApiKeyPublic` projection never includes `key_hash`.
- [`src/rate-limit.ts`](../../../hauska-mcp-server/src/rate-limit.ts). `RateLimitStore` interface with two implementations: `UpstashRateLimitStore` (REST client, Cloud-Run-friendly because no persistent connection) and `MemoryRateLimitStore` (test seam, injectable clock). `checkRateLimit()` enforces both windows atomically: a 60-second fixed window keyed by minute and a calendar-UTC-day fixed window. Either band tripping returns `allowed=false` with a `reason` of `"rpm"` or `"daily"` for client diagnostics. Both bands at 0 short-circuits the store completely (Embedder default).
- [`src/admin.ts`](../../../hauska-mcp-server/src/admin.ts). Express router for `/admin/keys`. `POST` mints a key and returns the raw value exactly once with an explicit warning field. `GET` lists keys (never returns `key_hash`). `PATCH /:key_id` accepts tier or status or notes changes. `DELETE /:key_id` soft-deletes (sets `status = 'revoked'`). Zod validates every body. All endpoints gated by `adminAuthMiddleware`.
- [`src/auth.ts`](../../../hauska-mcp-server/src/auth.ts) (refactored from the in-memory bucket). Async DB-backed key lookup. Shape-invalid keys, hash-miss, and inactive-status all log distinctly so triage can separate "fuzzer probing" from "user with stale key." Failed Redis ops on the free-tier anonymous path fail open with a logged error rather than denying legitimate free traffic during an Upstash outage; min-instances=1 plus REST means this should be rare. Authed-path Redis failures fail closed (503) so a misconfigured store cannot silently waive paid-tier caps. Per-request augmentation lives on `req.hauska` (not `req.auth`) to avoid colliding with the MCP SDK's `AuthInfo` augmentation on the same field.
- `migrations/001_api_keys.sql`. Single SQL file with `CHECK` constraints on `tier` and `status` plus indexes on `status`, `tier`, `owner_email`. Field set is exactly the dispatch list: `key_id`, `key_hash`, `tier`, `owner_email`, `owner_name`, `created_at`, `last_used_at`, `status`, `notes`.
- `scripts/migrate.ts`. Idempotent runner. Ensures a `schema_migrations` table, lists unapplied `.sql` files in lex order, applies each in its own transaction, records the filename on success. Safe to rerun; `[skip]` logs already-applied files.
- `tests/keys.test.ts` + `tests/rate-limit.test.ts`. 13 tests against the node:test runner via `node --import tsx --test`. Covers wire-shape regex per tier, hash determinism, parse-rejection of garbage, dual-window pass and trip cases, RPM window rollover, daily-cap trip with RPM headroom, Embedder unmetered short-circuit (asserts zero buckets created), identifier-bucket isolation, and a conformance loop that trips each tier band at its configured cap with `reason === "rpm"`.

Modified files:

- [`src/index.ts`](../../../hauska-mcp-server/src/index.ts). Builds the Upstash store, builds the auth middleware over it, mounts `/admin` (gated by bootstrap key) before `/mcp`, adds `trust proxy` config so `req.ip` reflects the real client behind Cloud Run.
- [`package.json`](../../../hauska-mcp-server/package.json). Adds `pg ^8.13`, `@upstash/redis ^1.34`, `@types/pg`. New scripts: `test` (node --test runner), `migrate`.
- [`.env.example`](../../../hauska-mcp-server/.env.example). Rewritten with sectioned blocks: backend, Postgres, Upstash, admin bootstrap, per-tier limits (10 vars), logging. Inline notes on how to provision each.

Validation: `tsc --noEmit` clean. `npm test` reports 13 pass / 0 fail / 312ms total.

## What was learned

Three things worth carrying forward.

**Tier model has two coordinate systems and both need to ship.** The cc-agent-M dispatch named "RPM config in env vars per tier" but the canonical [`29_mcp_surface_tier_model.md`](../29_mcp_surface_tier_model.md) substrate-MCP table is daily-cap-shaped (1K/IP/day, 10K/key/day, 50K/day, 500K/day, unmetered). These are not redundant. The daily cap is the customer-facing accounting unit per principle 4; the RPM cap is a burst defense against short-window abuse. Shipping both in [`tiers.ts`](../../../hauska-mcp-server/src/tiers.ts) with 0-means-unmetered semantics satisfies both docs. The Phase 0 close did not need to litigate this; the implementation just resolves it.

**MCP SDK augments `Express.Request.auth` with `AuthInfo` for OAuth.** Module-augmenting the same property with a custom shape (`AuthContext` here) is a hard `tsc` error. Resolved by augmenting `req.hauska` instead. Worth knowing for any other product MCP retrofit per [`28_mcp_first_product_design.md`](../28_mcp_first_product_design.md): pick a non-`auth` field name from the start. Codex 1a, Codex 1b, SmartCity OS, and Cortex MCP retrofits will all face this.

**The Windows dev box trips `UNABLE_TO_VERIFY_LEAF_SIGNATURE` against `registry.npmjs.org` unless `NODE_OPTIONS=--use-system-ca` is set.** Same finding cc-agent-E captured in [`2026-05-18_hauska_engine_foundation_cc-agent-E.md`](2026-05-18_hauska_engine_foundation_cc-agent-E.md). Confirmed independently in this repo: two npm installs failed silently with "Exit handler never called" before setting the flag. After the flag, install completes in 6 seconds. cc-agent-M memory captured at `project-node-system-ca.md`; would be worth a one-line entry in [`90_runbooks/`](../90_runbooks/) or each repo's `REPO_NOTES.md` as a permanent reference.

## What's still open

Stream 2B follow-ups deferred from this session:

- Stripe scaffold (50 §Phase 8). Products, prices catalog, checkout → webhook → key mint, subscription state sync (`active`, `past_due`, `canceled` → `key.status`).
- Self-serve signup endpoint, email verification, auto-key issuance on payment.
- Per-tier rate-limit integration tests hitting a real Postgres + Upstash (the unit tests cover the algebra against an in-memory store; integration is a follow-up once Nick provisions Cloud SQL + an Upstash dev DB).

Other open Track 2 work, in roughly the order each unblocks:

- **Stream 2A is unblocked.** cc-agent-E shipped Sync 3 this session per [`2026-05-18_hauska_engine_foundation_cc-agent-E.md:32`](2026-05-18_hauska_engine_foundation_cc-agent-E.md). Retrieval API contract is stable at `services/retrieval-api/src/server.ts` in `hauska-engine` with a 10-test contract suite. [`hauska-client.ts`](../../../hauska-mcp-server/src/hauska-client.ts) can swap from the mock stub to the real bearer-token-authed HTTP calls next session. The five endpoints map cleanly to the five tools post-rename (search → `search_atoms`, atoms/:did → `get_atom`, jurisdictions → `list_jurisdictions`, jurisdictions/:id → `query_jurisdiction`, jurisdictions/:id/permits → `search_permit_atoms`). Phase 0 tool-surface trim (drop `parcel_id`/`address` from `query_jurisdiction`, rename `get_permit_requirements`) plus atom-shape response normalization plus attribution metadata are the rest of 2A and can land in the same session.
- **Stream 2C structured logger upgrade.** Log shape per Phase 0 (`{ts, request_id, method, params, ip, key_hash, tier, response_status, atom_ids_returned, latency_ms, tool, jurisdiction}`); Postgres index + GCS raw payloads. This session laid the field plumbing (req.hauska carries key_id, key_hash, tier, rate_limit_id); 2C wires those into the logger and adds the request_id middleware.
- **Stream 2D Dockerfile + Cloud Run scaffold.** Independent infra plumbing per [`90_runbooks/cloud_run_canary_deploy.md`](../90_runbooks/cloud_run_canary_deploy.md). Secret Manager bindings now have a longer list: `DATABASE_URL`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `HAUSKA_ADMIN_BOOTSTRAP_KEY`, plus the backend creds.
- **Sync 4 + Sync 5.** Public launch sequence still gated on cc-agent-E publishing "first jurisdiction passes eval" (Sync 4) and "20-jurisdiction quality-gated corpus" (Sync 5). Planner co-owns the announcement.

Sync points consumed this session: none. Stream 2B is internally independent of every sync.

## Suggested canonical doc updates

Two light updates that keep the doc set in sync; both optional, neither changes sprint posture:

- **[`00_current_state.md`](../00_current_state.md) §5 (Recent session summaries).** Prepend a line pointing at this session.
- **[`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md) §Stream 2B.** The auth-plus-rate-limit-plus-key-issuance sub-bullets can flip from `[ ]` to `[x]`; the Stripe scaffold and self-serve signup sub-bullets remain `[ ]`. Defensible either way.

The MCP SDK `req.auth` collision finding above is worth a one-line note in [`28_mcp_first_product_design.md`](../28_mcp_first_product_design.md) so the Codex 1a, Codex 1b, SmartCity OS, and Cortex MCP retrofits do not re-litigate the same naming choice. Optional; the canonical fact lives in this session summary if not absorbed.

## Commit batch

Two commits land this session close:

- `hauska-mcp-server`: 9 new source files (`src/admin.ts`, `src/db.ts`, `src/keys.ts`, `src/rate-limit.ts`, `src/tiers.ts`, `migrations/001_api_keys.sql`, `scripts/migrate.ts`, `tests/keys.test.ts`, `tests/rate-limit.test.ts`), 4 modified (`src/auth.ts`, `src/index.ts`, `package.json`, `.env.example`), plus `package-lock.json`. Commit message: `feat(2b): auth + Postgres api_keys + Upstash dual-window rate limit + admin endpoints`.
- `doc_repo`: this session summary.

Neither commit pushed by default. Nick gates push.
