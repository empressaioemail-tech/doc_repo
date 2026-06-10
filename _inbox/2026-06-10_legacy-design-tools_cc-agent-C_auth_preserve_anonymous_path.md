---
id: 2026-06-10_legacy-design-tools_cc-agent-C_auth_preserve_anonymous_path
title: cc-agent-C — restore Phase 1 anonymous demo path (task #29 auth regression fix)
date: 2026-06-10
agent: cc-agent-C
repo: legacy-design-tools
branch: cortex/auth-preserve-anonymous-path
sha: 1d720b5a249a65ab1330365db02085d2364d5398
pr: https://github.com/empressaioemail-tech/legacy-design-tools/pull/168
status: PR OPEN — held for operator merge
worktree: P:/ldt-cortex-auth-anonymous
model: Grok Build 0.1
ci_run: https://github.com/empressaioemail-tech/legacy-design-tools/actions/runs/27298289702
---

# cc-agent-C deliverable — auth regression fix (preserve anonymous demo path)

## Alien HEAD refusal (main clone)

Main clone `P:\legacy-design-tools` was **not** used — alien HEAD `codewarm/austin-2024-uplift-rewarm` + untracked codewarm scripts.

Work executed in worktree **`P:/ldt-cortex-auth-anonymous`** on branch **`cortex/auth-preserve-anonymous-path`** from `origin/main` at `b1575ef` (post-merge #166 + #167).

---

## Recon — lockout cause (confirmed against merged #167 source)

### Root cause chain

1. **`engagementOwnerWhere`** — anonymous sessions (no `requestor`) filtered to `owner_user_id = '__no_such_owner__'` in production → empty lists / 404 on detail.
2. **`requireAuthenticatedUser`** — returned **401** on engagement/snapshot list/detail/create paths when no signed-in user.
3. **`effectiveOwnerUserId`** — returned `null` in production for anonymous → `denyEngagementAccess` / `POST /engagements` blocked.
4. **Migration 0038 backfill** — existing engagements have `owner_user_id = 'migration-owner'` (`MIGRATION_OWNER_USER_ID`), unreachable by anonymous filter.

### Login UI state (pre-fix)

- API existed: `POST /api/auth/signup`, `POST /api/auth/login`, `POST /api/auth/logout`, cookie `pr_session`.
- Cortex-web **`AuthChip`** was a stub: hardcoded "Operator" + gateway logout redirect — **no login/signup UI**.
- `AppShell` already rendered `<AuthChip />`; `useGetSession` gated notifications poll only.

### Production impact

Operator locked out of backfilled engagements with no way to sign in as `migration-owner`. Prod rolled back to rev `00140-dax` per dispatch.

---

## Fix — anonymous path restoration (Phase 1)

### Ownership model (`artifacts/api-server/src/lib/engagementOwnership.ts`)

| Caller | `effectiveOwnerUserId` | List/detail scope |
|---|---|---|
| Anonymous (no `requestor`) | `migration-owner` | Only demo/backfill rows |
| Signed-in user | `requestor.id` | Only that user's rows |
| Internal (`audience: internal`) | bypass | Plan-review (unchanged) |

- Removed production `__no_such_owner__` sentinel.
- Added `anonymousOwnerUserId()` → `MIGRATION_OWNER_USER_ID`.
- `requireAuthenticatedUser` retained **only** for Phase 2 personal surfaces (`/me/*`, notifications, etc.) — **not** demo wedge routes.

### Routes opened for anonymous demo wedge

Removed `requireAuthenticatedUser` from:

- `GET/POST /engagements`, `GET/PATCH /engagements/:id`
- `POST /engagements/:id/geocode`
- `GET/POST /engagements/:id/submissions`
- `GET /snapshots`, `GET /snapshots/:id`

`POST /engagements` and snapshot create-new branch use `effectiveOwnerUserId(req.session)` so anonymous creates land on `migration-owner`.

### No whole-DB leak

Anonymous callers see **only** `migration-owner` engagements — not user-A/user-B rows. Isolation tests updated to assert this in production `NODE_ENV`.

---

## Phase 2 gates unchanged

Still require signed-in user (`requireAuthenticatedUser` / session owner checks):

- `GET/PATCH /me/*` (profile, PDF header, notifications)
- Per-user workspace history / wallet (brokerage user tier)
- Signed-in user-to-user isolation on user-owned engagements

---

## Login affordance (minimal)

**`artifacts/design-tools/src/components/AuthChip.tsx`**:

- Anonymous: shows **Guest** + sign-in button.
- Signed-in: shows `requestor.id` + logout (`POST /api/auth/logout` + query invalidation).
- Modal dialog: email/password login + signup toggle, wired to `/api/auth/login|signup` with `credentials: "include"`.

Not full account UX — enough to reach authenticated isolation per dispatch.

---

## Verification artifacts (HR-8)

### Local

```
pnpm run typecheck                                    → PASS (worktree)
vitest engagementOwnership.test.ts                    → 3/3 PASS
vitest AuthChip.test.tsx                              → 3/3 PASS
vitest engagement-ownership-isolation.test.ts         → SKIP (no local Postgres :5432)
vitest brokerage-anonymous-history-no-pool.test.ts    → SKIP (no local Postgres :5432)
```

### CI (PR #168, run `27298289702`)

| Job | Result | Duration |
|---|---|---|
| Typecheck | **pass** | 1m47s |
| Test | **pass** | 5m52s |

Includes `engagement-ownership-isolation`, `brokerage-anonymous-history-no-pool`, fixture drift, and full api-server/design-tools suites.

### Test updates

- `engagement-ownership-isolation.test.ts` — anonymous production sees only `migration-owner`; cannot read user-owned by id; can create with `migration-owner` owner.
- New `engagementOwnership.test.ts` — unit coverage for anonymous → `migration-owner` in production.
- `AuthChip.test.tsx` — Guest label, signed-in state, login submit.

---

## PR

**https://github.com/empressaioemail-tech/legacy-design-tools/pull/168**

- Branch: `cortex/auth-preserve-anonymous-path`
- HEAD: `1d720b5a249a65ab1330365db02085d2364d5398`
- **Held for operator merge** (per dispatch)

---

## Post-merge operator steps

1. Merge PR #168.
2. Redeploy cortex-api with full session bundle (#163–167) — anonymous path restored, no lockout.
3. Confirm migration 0038 applied if not already (`gh workflow run cloud-run-deploy.yml -R empressaioemail-tech/legacy-design-tools -f action=run-migrations`).
4. Smoke: unauthenticated browser loads `migration-owner` engagements; wedge (plans/chat/review/letters) works; sign-in via AuthChip isolates to user-owned rows.

---

## Blockers

None. CI green. No Claude escalation (Grok Build 0.1 completed without retry failure).
