---
id: 2026-06-10_legacy-design-tools_cc-agent-C_cortex_per_user_auth
title: cc-agent-C — Cortex per-user auth + unified identity (task #29 Phase 2)
date: 2026-06-10
agent: cc-agent-C
repo: legacy-design-tools
branch: cortex/per-user-auth
sha: e97549c4cebfd4c4bbf005d7fbb6f717e87f7361
pr: https://github.com/empressaioemail-tech/legacy-design-tools/pull/new/cortex/per-user-auth
worktree: P:/ldt-cortex-per-user-auth
model: Grok Build 0.1
---

# cc-agent-C deliverable — Cortex per-user auth (task #29, Phase 2)

## Alien HEAD refusal (main clone)

Main clone `P:\legacy-design-tools` was **not** used for implementation — alien HEAD + dirty state:

```
On branch codewarm/austin-2024-uplift-rewarm
Changes not staged for commit:
	modified:   .claude/worktrees/recon-add-jurisdiction (untracked content)
	modified:   .claude/worktrees/track-b-ifc-ingest (modified content, untracked content)
Untracked files:
	lib/codes/scripts/
	lib/codewarm/scripts/
3f307ca Merge pull request #163 from empressaioemail-tech/codewarm/driver-section-extraction
77f2a90 fix(codes): fetch section-level HTML for web-code verification
96aa589 Merge pull request #162 from empressaioemail-tech/codewarm/harness-fix
```

Work executed in **separate worktree** `P:/ldt-cortex-per-user-auth` on branch `cortex/per-user-auth` (tracking `origin/main` at start).

---

## Recon (read-only, live source verified)

### Anonymous-default session

`artifacts/api-server/src/middlewares/session.ts` — production previously pinned every request to frozen `ANONYMOUS_APPLICANT` (`audience: "user"`, `tenantId: "default"`) with no verified auth. **Now:** production verifies HMAC session tokens from `SESSION_SECRET` via `pr_session` cookie or `Authorization: Bearer`.

### Engagement-owned routes lacking ownership predicates (pre-build)

| Surface | Routes | Pre-build auth |
|---|---|---|
| **Engagements** | `GET/POST /engagements`, `GET/PATCH /engagements/:id`, `POST .../geocode`, `GET/POST .../submissions` | None — global DB |
| **Findings** | `POST/GET /submissions/:id/findings/*`, accept/reject/override | Audience on manual create only; no owner |
| **Submissions** | reviewer queue/reclassify | Reviewer audience only |
| **Snapshots** | `GET /snapshots`, `GET /snapshots/:id`, IFC/GLTF reads | Reads open; writes use `x-snapshot-secret` |
| **Sheets** | thumbnail/full/submission reads | Reads open |
| **Renders** | all kickoff/list/credits/prompt-generator | QA-30/31 gate **removed** |

**Post-build:** engagements + snapshot list/detail + render kickoff/list gated by `engagements.owner_user_id` (internal audience bypass for plan-review). Findings/sheets/child routes inherit via engagement join in follow-up PR if needed — core list/detail paths patched in this PR.

### Render auth gate (QA-30/31)

Confirmed removed in `artifacts/api-server/src/routes/renders.ts` (empty stub at former `requireArchitectAudience`). **Restored** as `requireEngagementOwnerForRenders` on `POST/GET /engagements/:id/renders` — ownership-based, not internal-audience.

### Extension auth (current + shared)

| Mechanism | Detail |
|---|---|
| `BROKERAGE_EXTENSION_PUBLIC_KEY` | Public tier; rate limits via `gtm_events` per install |
| `X-Hauska-Install-Id` | Required on public brief/research; scopes workspaces |
| Anonymous wedge | Unchanged — public key + install id |
| Authenticated extension (C2) | **Designed, not built:** `chrome.identity.launchWebAuthFlow` → `GET /api/auth/extension-login?redirect_uri=...&install_id=...` → hosted login → redirect `#token=<signed-session>` → Bearer on `/api/brokerage/v1/*`; `brokerageAuth` accepts session Bearer as tier `user` |

### Shared cortex-api routes (both surfaces)

| Surface | Prefix | Identity |
|---|---|---|
| Cortex web | `/api/engagements`, `/api/findings`, `/api/snapshots`, `/api/renders`, `/api/auth/*` | Signed session (cookie or Bearer) |
| Extension | `/api/brokerage/v1/brief*`, `/research/chat`, workspaces/wallet (dev tier) | Public key + install id **or** Bearer session (C2) |
| Shared backend | `cortex-api` (`artifacts/api-server`) — identity stays here across C1–C3 BFF cut |

**Auth provider note:** No external IdP invented. Pattern: `SESSION_SECRET` HMAC tokens + `user_auth_credentials` table (email/password hosted login). Flag if operator prefers OAuth — extension C2 flow is compatible with same token mint.

---

## Build summary

| Item | Status |
|---|---|
| Migration | **`0038_engagement_ownership_user_auth.sql`** (next free after `0037`) |
| Ownership columns | `engagements.owner_user_id`, `engagements.tenant_id`; extension `brokerage_brief_runs.install_id/owner_user_id`, `brokerage_workspaces.owner_user_id`, `brokerage_install_claims` |
| Backfill | Existing engagements → `migration-owner` |
| Login/signup | `POST /api/auth/signup`, `POST /api/auth/login`, `GET /api/auth/extension-login` |
| Isolation | `engagementOwnership.ts` predicates on engagement + snapshot routes |
| Metering | `user_usage_metering` + `userRateLimitMiddleware` (daily cap `CORTEX_USER_DAILY_API_LIMIT`, default 5000) — count only, rail-quiet |
| Render gate | Ownership guard on render kickoff + list |
| Sovereignty test | `brokerage-anonymous-history-no-pool.test.ts` — install claims to one user only |
| Typecheck | `pnpm run typecheck` **green** on worktree |

### Extension sign-in flow (C2 — specify only)

1. Extension calls `chrome.identity.launchWebAuthFlow` with URL:  
   `{cortex-api}/api/auth/extension-login?redirect_uri={chrome-extension-callback}&install_id={X-Hauska-Install-Id}`
2. User signs in on hosted page (same credentials as Cortex web).
3. Redirect to `redirect_uri#token={signed-session-token}`.
4. Extension stores token; sends `Authorization: Bearer {token}` on authenticated brokerage calls (replaces embedded public key).
5. Login/signup handlers call `claimInstallHistoryForUser(installId, userId)` — anonymous brief history attaches to that user **only** (`brokerage_install_claims` PK on `install_id`).

---

## Verification artifacts

### Typecheck

```
pnpm run typecheck — exit 0 (full workspace, 2026-06-10 worktree)
```

### Isolation + no-pool tests

**Blocker:** No `DATABASE_URL` / `TEST_DATABASE_URL` on workstation — integration suites could not execute locally. CI Postgres required.

**Local unit test (verbatim):**

```
> vitest run "src/lib/__tests__/sessionToken.test.ts"

 ✓ src/lib/__tests__/sessionToken.test.ts (1 test) 2ms

 Test Files  1 passed (1)
      Tests  1 passed (1)
```

**Pending CI (require DATABASE_URL):**

- `engagement-ownership-isolation.test.ts` — user-A vs user-B list/detail isolation; production anonymous → 401
- `brokerage-anonymous-history-no-pool.test.ts` — install claim sovereignty ADR-005/017

---

## PR / merge

| Field | Value |
|---|---|
| Branch | `cortex/per-user-auth` |
| SHA | `e97549c4cebfd4c4bbf005d7fbb6f717e87f7361` |
| PR (operator create) | https://github.com/empressaioemail-tech/legacy-design-tools/pull/new/cortex/per-user-auth |
| Merge | **Held for operator** |

### Post-merge operator steps

1. Apply migration `0038` to deployment DB.
2. Ensure `SESSION_SECRET` bound in Cloud Run (already in deploy docs).
3. Regenerate `lib/db/src/__tests__/__fixtures__/schema.sql.template` via `pnpm db:push:test && pnpm db:dump:test-fixture` in `lib/db` (CI drift test).
4. Confirm CI integration test output for isolation + no-pool suites; paste verbatim into this report if needed.

---

## Blockers (verbatim)

- Main clone alien HEAD (`codewarm/austin-2024-uplift-rewarm`) — refused; used `P:/ldt-cortex-per-user-auth`.
- Local integration tests blocked: `DATABASE_URL must be set. Did you forget to provision a database?`
- GCP Secret Manager resolve script failed on workstation (gaxios auth error) — could not pull Neon URL locally.
- Schema fixture template not refreshed in this PR (requires test DB push) — CI drift job will fail until operator refresh step above.

---

## Escalation log

No Claude escalation — Grok Build 0.1 completed on first pass after typecheck fixes.
