---
id: 2026-05-28_codex_brokerage_v1_memory_rollup
title: Brokerage v1 memory rollup (last 3-5 days)
status: active
date: 2026-05-28
agent: codex
---

# Brokerage v1 memory rollup

## 1) Claims

- **C1:** A 90-day wedge operating scaffold and dual-loop model were drafted and committed in `doc_repo` on 2026-05-28.
  - **Source chat date:** 2026-05-28
  - **Evidence:** commit `00eb515` includes `76_empressa_wedge_90d_operating_plan.md` and `76a_operator_autonomous_loops.md`.

- **C2:** A cc-agent-C handoff dispatch was created for merge/deploy sequencing on GTM observation layer plus parcel-layer follow-up.
  - **Source chat date:** 2026-05-28
  - **Evidence:** commit `623f3c6` adds `_dispatches/2026-05-26_cc-agent-C_wedge_merge_handoff.md`.

- **C3:** GTM observation layer backend code was implemented in `legacy-design-tools` on a feature branch.
  - **Source chat date:** 2026-05-28
  - **Evidence:** branch commit `c95c67a` adds migration `lib/db/drizzle/0028_gtm_observation_layer.sql`, new schema files (`gtmEvents`, `gtmConsent`), and new route `artifacts/api-server/src/routes/brokerageGtm.ts`.

- **C4:** Brokerage brief API was instrumented to emit GTM events when an install identifier header is provided.
  - **Source chat date:** 2026-05-28
  - **Evidence:** `artifacts/api-server/src/routes/brokerageBrief.ts` was updated (in `c95c67a`) to read `X-Hauska-Install-Id` and record `brief_started`, `brief_completed`, and `research_chat_turn`.

- **C5:** Extension-side consent/telemetry and install ID plumbing were implemented locally for Property Brief.
  - **Source chat date:** 2026-05-28
  - **Evidence:** local files added/updated under `P:/hauska-brief-extension` including `src/lib/gtm-client.js`, `src/lib/install-id.js`, `src/options/index.js`, and manifest bump to `0.4.3`.
  - **Assumption flagged:** this extension directory was reported as not a git repo in-session, so state is local and unversioned unless manually copied/committed elsewhere.

- **C6:** Testing for the new GTM route was added but not validated in-session due missing DB env.
  - **Source chat date:** 2026-05-28
  - **Evidence:** `artifacts/api-server/src/__tests__/brokerageGtm.test.ts` created; vitest attempt failed with `DATABASE_URL must be set`.

## 2) Decisions proposed or made

- **Made in-session:** Treat Property Brief wedge as distribution surface; place graph depth remains moat (discussion + filed docs/dispatches on 2026-05-28).
- **Made in-session:** Keep legal/protection gating upfront for paid pilot and sharing graph (codified in `76_*` docs and decision record committed in `00eb515` set).
- **Proposed (not yet operator-confirmed in this file):** sequence cc-agent-C as two-track: (1) GTM observation layer PR/deploy, (2) parcel layers PR/deploy.

## 3) Open questions / unresolved conflicts

- Should GTM observation layer and parcel-layer enrichment ship as two PRs or one combined deployment batch?
- What is the authoritative git home for extension `v0.4.3` changes, given local non-repo status in-session?
- For paywall/metering: should free quota be keyed to `brief runs`, `lookups`, or `chat turns` for enforcement parity across extension and API?
- For sharing graph: should `graphOptIn` gate only share events or all non-essential telemetry?

## 4) Suggested canonical doc patches

- `P:/doc_repo/75a_hauska_brief_extension.md`
  - **Section:** API contracts + version history
  - **Patch suggestion:** add explicit `v0.4.3` extension telemetry/consent behavior and `X-Hauska-Install-Id` header contract.

- `P:/doc_repo/76_empressa_wedge_90d_operating_plan.md`
  - **Section:** Phase 0/Phase 1 execution status
  - **Patch suggestion:** mark GTM observation layer code as landed on feature branch; list deploy/migration as remaining operator steps.

- `P:/doc_repo/76a_operator_autonomous_loops.md`
  - **Section:** G0 implementation status
  - **Patch suggestion:** append concrete route/migration references (`/gtm/consent`, `/gtm/events`, `/gtm/digest`, migration `0028`).

- `P:/doc_repo/75_hauska_brokerage_workflow_plan.md`
  - **Section:** Near-term build plan
  - **Patch suggestion:** add explicit dependency note: parcel-layer PR still required for Valerie-grade demo completeness.

## 5) Confidence per claim

- **C1:** **high**
- **C2:** **high**
- **C3:** **high**
- **C4:** **high**
- **C5:** **med** (local filesystem evidence in chat; not git-anchored)
- **C6:** **high**
