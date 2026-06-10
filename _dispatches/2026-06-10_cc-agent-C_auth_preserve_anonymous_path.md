---
id: 2026-06-10_cc-agent-C_auth_preserve_anonymous_path
title: Dispatch — fix the task #29 auth regression (preserve the anonymous demo path)
date: 2026-06-10
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
status: FIRE-READY — HIGH (the auth deploy locked the operator out of existing engagements; blocks redeploying the session's fixes)
related: [58_gtm_readiness_sprint, _decisions/2026-06-08_cortex_7k_launch_phased_demo_first, _dispatches/2026-06-10_cc-agent-C_cortex_per_user_auth, 80_adrs/adr_005_multitenancy, 20_agent_operating_rules]
---

# Fix the task #29 auth regression — preserve the anonymous demo path

> Deploying task #29 (cortex-api rev 00142-xin) locked the operator out of his own engagements: it removed the anonymous default and added ownership predicates, so existing engagements (backfilled to `migration-owner` by migration 0038) no longer load for a browser session that is not signed in as that owner — and there is no surfaced Cortex-web login to become one. This violated the phased-7k plan ([`_decisions/2026-06-08_cortex_7k_launch_phased_demo_first.md`](../_decisions/2026-06-08_cortex_7k_launch_phased_demo_first.md)): Phase 1 stays ANONYMOUS (instant demo, no login), Phase 2 adds auth/isolation as an opt-in. The fix is to restore the anonymous path so the demo + existing engagements work, and gate only the per-user isolation FEATURES behind login. Prod was rolled back to 00140-dax to unblock the operator; this fix lets us redeploy the whole session's work (the wedge #165, letter #166, Austin driver #164, section-extraction #163) bundled with auth, without orphaning anonymous data.

You are **cc-agent-C**, single owner of `P:\legacy-design-tools` (worktree if busy). Model: **Grok Build 0.1**; escalate to Claude only on failure after retry, log it. Branch prefix `cortex/`.

## Read first

1. [`_dispatches/2026-06-10_cc-agent-C_cortex_per_user_auth.md`](2026-06-10_cc-agent-C_cortex_per_user_auth.md) — task #29; what it built (session.ts, ownership predicates, 0038 backfill to migration-owner)
2. [`_decisions/2026-06-08_cortex_7k_launch_phased_demo_first.md`](../_decisions/2026-06-08_cortex_7k_launch_phased_demo_first.md) — Phase 1 anonymous demo / Phase 2 auth — the intent this restores
3. The live regression: `artifacts/api-server/src/middlewares/session.ts` (removed anonymous default), the engagement ownership predicates, the 0038 migration-owner backfill
4. [`20_agent_operating_rules.md`](../20_agent_operating_rules.md) — HR-1, HR-2, HR-3, HR-8, HR-11

## Scope

1. **Recon (read-only, report first).** Confirm the exact lockout cause against live source: does an unauthenticated session resolve to nothing (so `GET /engagements` is empty + `GET /engagements/:id` denies), and are existing engagements owned by `migration-owner`? Confirm whether any Cortex-web login/signup UI is surfaced. Report before fixing.
2. **Restore the anonymous demo path (Phase 1).** An unauthenticated session must again be able to create and access engagements (the instant demo), reading/writing anonymously-owned engagements — the web-first wedge (upload plans, chat, review, letters) works with NO login. Do NOT re-introduce the original "returns the whole DB to any caller" bug: anonymous access is scoped to anonymous-owned / install-scoped data, not all users' data. The existing `migration-owner` engagements must be reachable on the anonymous path (treat the migration-owner backfill as the anonymous/demo owner, or make anonymous sessions resolve to it — decide and report).
3. **Gate only the per-user FEATURES behind login (Phase 2).** Workspace history, sharing, the wallet, cross-device persistence — these require sign-in; the ownership predicates apply to USER-owned data. Signing in (when the login UI lands) gives isolation; not signing in gives the anonymous demo. Both work.
4. **Surface a minimal login/signup affordance** in Cortex-web wired to the task #29 endpoints (`/api/auth/signup|login`) — even minimal, so authenticated isolation is reachable; not the full account UX, just enough that login is possible. If full UI is out of scope for this fix, at minimum ensure the anonymous path works so the app is usable without it, and flag the login-UI as the follow-up.
5. **Verify the isolation guarantees still hold** where they apply (a signed-in user A cannot see user B's user-owned data; the anonymous-history-no-pool test still passes). The fix restores anonymous ACCESS without breaking USER isolation.

## Acceptance criteria

- Recon report: the lockout cause confirmed; the login-UI presence/absence stated.
- Anonymous (no-login) sessions can create + access engagements and run the full wedge (plans/chat/review/letters); existing `migration-owner` engagements are reachable anonymously; no whole-DB leak.
- Per-user isolation features gated behind login; signed-in user-to-user isolation intact; anonymous-history-no-pool test green.
- A login/signup affordance is reachable (or the login-UI gap explicitly flagged with the anonymous path fully working without it).
- CI green. PR held for operator merge. Verbatim verification artifacts (HR-8). After merge, this redeploys with the full session bundle (#163–167) without the lockout.

## Reporting

Write to `P:\doc_repo\_inbox\` as `2026-06-10_legacy-design-tools_cc-agent-C_auth_preserve_anonymous_path.md`: the recon (lockout cause + login-UI state), the anonymous-path restoration, the isolation-still-holds proof, the login affordance (or the flagged gap), PR URL + SHA, and blockers verbatim.
