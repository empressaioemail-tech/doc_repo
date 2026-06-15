---
id: 2026-06-14_cc-agent-C_cortex_anonymous_owner_isolation_fix
title: Dispatch — Cortex anonymous-owner data-isolation regression fix (task #29 follow-up)
date: 2026-06-14
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
related: [00_current_state, 01a_atom_conventions, 20_agent_operating_rules, 58_gtm_readiness_sprint, 80_adrs/adr_005_multitenancy, _inbox/2026-06-10_legacy-design-tools_cc-agent-C_cortex_per_user_auth]
---

# Cortex anonymous-owner data-isolation regression fix (task #29 follow-up)

You are **cc-agent-C**, the single owner of `legacy-design-tools` for this run.

This is an urgent data-exposure fix. Task #29 (per-user auth, PR #167) plus its lockout fix (#168) left a live hole: an unauthenticated caller reads the entire engagement/snapshot/sheet surface in production. The per-user isolation between two authenticated users is fine; the anonymous path is the hole. Close it without re-breaking the Phase 1 anonymous demo.

## Model (HR-12)

Default: **Grok Build 0.1** (multi-file / agentic). Use **grok-code-fast-1** for narrow, speed-only tasks. Escalate to Claude only if Grok fails after retry; log the escalation in your session summary.

Cursor: base URL `https://api.x.ai/v1`.

## The defect (verified live in prod, 2026-06-14)

Against serving revision `cortex-api-00169-jep` (`https://cortex-api-tds7av26va-uc.a.run.app`), with NO session cookie, NO `Authorization` header, NO `x-requestor`:

```
GET /api/healthz                                   -> HTTP 200   (control)
GET /api/engagements                               -> HTTP 200   returned all 57 real engagements
GET /api/engagements/6d9cd127-...-b5794c2f01a2      -> HTTP 200   (1437 B; exposes revitDocumentPath
                                                                   "P:\Projects\Hector Martinez\613 Sturgeon\...")
GET /api/engagements/6d9cd127-.../submissions       -> HTTP 200   (1876 B)
GET /api/snapshots                                  -> HTTP 200   (17.8 KB)
GET /api/snapshots/3acf3617-...-4cb0faa327a7         -> HTTP 200   (8.8 KB)
GET /api/snapshots/3acf3617-.../sheets              -> HTTP 200   (6.4 KB)
```

There are **two independent root causes**, both must be fixed:

1. **Anonymous resolves to the owner of everything.** PR #167 backfilled all pre-existing engagements to a single `migration-owner` identity, and PR #168 restored the demo path by mapping the anonymous/unauthenticated session to that same `migration-owner`. So the ownership predicate runs correctly and returns the whole backfilled set to any anonymous caller. Confirm in `artifacts/api-server/src/middlewares/session.ts` (anonymous resolution) and the migration `0038` backfill target.
2. **Child routes never got ownership predicates.** PR #167 patched engagement list/detail + render routes only; the close note explicitly deferred findings/sheets/submissions/snapshots to a "follow-up PR if needed" that was never done. `GET /api/snapshots`, `/api/snapshots/:id`, `/api/snapshots/:id/sheets`, and `/api/engagements/:id/submissions` enforce no ownership at all.

## Atoms to resolve

Resolve these before reading full canonical docs (catalog: [`01a_atom_conventions.md`](../01a_atom_conventions.md)):

- `current-state:portfolio` — fleet status, blockers
- `engagement:6d9cd127-4bd8-4ce7-a6ae-b5794c2f01a2` — a live engagement that leaks unauth; use as a fixture for the repro
- `snapshot:3acf3617-04d8-44ce-bb32-4cb0faa327a7` — a live snapshot that leaks unauth via the child routes

## Read first (after atoms)

1. [`00_current_state.md`](../00_current_state.md) — the 2026-06-10 auth section + the 2026-06-11 engine-cut deploy state
2. [`_inbox/2026-06-10_legacy-design-tools_cc-agent-C_cortex_per_user_auth.md`](../_inbox/2026-06-10_legacy-design-tools_cc-agent-C_cortex_per_user_auth.md) — what #167 built and what it deferred (the child-route table)
3. [`80_adrs/adr_005_multitenancy.md`](../80_adrs/adr_005_multitenancy.md) — Layer A ownership/isolation intent
4. [`20_agent_operating_rules.md`](../20_agent_operating_rules.md) — HR-1, HR-2, HR-3, HR-8, HR-11

## Workspace ownership

- Clone: `P:\legacy-design-tools` (refuse if alien HEAD; the main clone has been dirty on `codewarm/*` and `cortex/cut-to-gate` branches recently — use a clean worktree off `origin/main` if so)
- Branch prefix: `cortex/`
- One agent per clone per [`agent_workspace_hygiene`](../90_runbooks/agent_workspace_hygiene.md)
- Refuse alien HEAD or uncommitted state; report verbatim `git status` + `git log -3`

## Scope

**In scope:**

- The anonymous/demo session must resolve to a **per-session ephemeral owner that owns nothing**, never the `migration-owner` identity that owns the backfilled production engagements. The Phase 1 anonymous demo must keep working (a fresh anonymous visitor can create and see only their own ephemeral-session engagement), but must NOT see any pre-existing or other-session data.
- **Reassign the backfilled engagements off `migration-owner`** (or off whatever identity the anonymous path resolves to) so that even if an anonymous resolution leaks, it maps to an owner that holds no real data. Decide the cleanest mechanism (a dedicated non-anonymous system/internal owner for the backfill, distinct from the anonymous demo identity) and state it in the report.
- **Add ownership predicates to the child routes** that #167 deferred: `GET /api/snapshots`, `GET /api/snapshots/:id`, `GET /api/snapshots/:id/sheets` (+ full/thumbnail reads), `GET /api/engagements/:id/submissions`, and the findings read/list routes. They inherit ownership via the engagement join. Internal/plan-review audience bypass stays as designed; the anonymous audience must not bypass.
- Preserve the existing authenticated user-A/user-B isolation behavior (do not regress the green `engagement-ownership-isolation` test).
- **Regression tests** that lock the repro: an unauthenticated request to each of the routes above returns no other-owner data (401/403, or 200 with an empty/own-only set for the demo-creatable routes). Add an explicit `anonymous-sees-no-migration-owner-data` test — the gap that let this through CI the first time.

**Out of scope:**

- The C3 thin-BFF cut (#179) and the spine flag bake (#178). Do NOT stack this fix on those. This ships as its own PR and its own canary, ahead of C3. (Rationale: C3 is a one-way door needing full-product regression; this is an urgent isolation patch with a single acceptance test. Coupling them forces all-or-nothing rollback and reopens the hole if C3 misbehaves.)
- The extension unified sign-in (C2) flow. Separate dispatch.
- Any new migration of engine code, tier, or pricing logic.

## Acceptance criteria

- The verified-live repro above is **reproduced as a failing test first, then made to pass.** Paste the before/after of the exact unauthenticated `curl` sequence against the `canary---` revision URL in the report; the agent cannot mark this done without showing the unauth calls now deny (or return own-only/empty for the demo-creatable routes).
- `engagement-ownership-isolation` and `brokerage-anonymous-history-no-pool` still pass.
- New regression test `anonymous-sees-no-migration-owner-data` (or equivalent) committed and green in CI.
- Typecheck green: `pnpm run typecheck`.
- Migration (if backfill reassignment needs one) is the next free number after `0038`, idempotent, and named in the report with its apply step.
- PR held for operator merge (do not merge). Deploy path is its own `deploy-canary` -> verify on `canary---` URL -> `shift-traffic`, NOT bundled with #178/#179.
- Verbatim verification artifacts in report (HR-8).

## Reporting

At session break-point, write to `P:\doc_repo\_inbox\` as `2026-06-14_legacy-design-tools_cc-agent-C_anonymous_owner_isolation_fix.md`.

Include:
- Atom refs touched
- Model used (if not default Grok Build 0.1)
- PR URL + branch SHA
- The before/after unauthenticated curl repro, verbatim
- The backfill-reassignment mechanism chosen and any new migration number
- Blockers verbatim

---

## FIXUP ROUND — PR #180 CI is RED, do not merge (added 2026-06-14)

Your first pass (PR #180, branch `cortex/anonymous-owner-isolation-fix`, SHA `9b55b0b`) **closed the security hole** — the core isolation assertions pass in CI:

```
✓ anonymous-sees-no-migration-owner-data > unauthenticated caller sees no legacy-internal engagements
✓ ... gets 404 on legacy engagement by id / submissions
✓ ... sees no legacy snapshots / gets 404 on legacy snapshot sheets
✓ ... authenticated user-A still cannot read legacy-internal engagement
✓ engagement-ownership-isolation.test.ts (5 tests) all pass
```

But the report's "expected green in CI" was wrong. The `Test` job is **RED, exit 1** (`gh run 27518430192`). You could not run the suites locally (no `DATABASE_URL`); you must get them green in CI before this is mergeable. Three problems, in priority order:

**F1 — Your own demo-path test fails. The Phase 1 launch demo depends on it.**
```
× anonymous-sees-no-migration-owner-data > anonymous production caller can create and read only their own engagement
  AssertionError: expected [] to have a length of 1 but got 0   (test line 157:25)
```
An anonymous caller creates an engagement and then sees an empty list. The `pr_anon_owner` cookie minted on the create request is not being read back on the subsequent list (cookie not propagated by the same agent in the test, or the middleware mints a *new* anon owner per request instead of reusing the cookie). Fix so an anonymous session reliably reads back only its own freshly created engagement. This is load-bearing: if anonymous can't see its own upload, the web-first demo is broken.

**F2 — You added ownership predicates without updating the existing route tests' session seeding (~30 failures).** Same fixup class PR #167 needed ("align ownership checks with legacy test sessions"). The new joins return 404 because these tests seed a fixture owned by a different identity than the test session:
```
× engagements.test.ts (20 failed)        — submissions list/create, geocode/lifecycle events
× snapshot-sheet-history.test.ts (6)     — expected 404 to be 200
× snapshot-sheets-get.test.ts            — expected 404 to be 200
× submission-sheets.test.ts (2)          — expected 404 to be 200
× submission-comments.test.ts            — expected 201 to be 400
× renders-source-upload.test.ts (4)      — expected 404 to be 202
× bim-models.test.ts (1), reviewer-requests.test.ts (1)
```
Seed each route test's fixtures under the same owner as its session (or grant the test session ownership), so a legitimately-owning caller still gets 200/201/202. Do NOT loosen the production predicate to make tests pass. Also: you changed the snapshot error string `"Snapshot not found"` → `"snapshot_not_found"` (`snapshot-sheet-history.test.ts:346`) — either revert it or update the asserting test; do not leave it as incidental drift.

**F3 — Anonymous now passes auth gates it used to fail. Confirm this is not a NEW hole.**
```
× me.test.ts (6 failed):  PATCH /api/me/profile / architect-pdf-header — "rejects anonymous callers with 401"
                          → expected 200 to be 401  (received 200)
× notifications.test.ts:  POST /api/me/notifications/mark-read — "rejects anonymous with 401"
                          → expected 200 to be 401  (received 200)
```
The new ephemeral `anon_*` owner likely now looks like a legitimate requestor to routes that gate on "is there a requestor," so anonymous slipped past auth gates it used to fail. Determine whether anonymous can now mutate profile/notifications. If yes, that is a privilege regression your fix introduced and must be closed (these routes require a real authenticated user, not an ephemeral anon owner). Turn the resolution into an explicit assertion: an ephemeral anonymous owner must NOT satisfy any real-auth (`requireUser`) gate.

### Fixup acceptance criteria

- The `Test` CI job is **green** (not "expected green" — the actual job, pasted run URL + status).
- F1 demo read-back test passes.
- F3 resolved with a new assertion that ephemeral-anon cannot pass a real-auth gate.
- The 6/7 isolation assertions + `engagement-ownership-isolation` stay green (no regression of the part that already works).
- Still standalone — not stacked on #178/#179. Deploy path unchanged: merge → deploy-canary → apply 0039 → verify the unauth curl on the `canary---` URL → shift-traffic.
- Report appended to the same `_inbox/` file with the green CI run URL.
