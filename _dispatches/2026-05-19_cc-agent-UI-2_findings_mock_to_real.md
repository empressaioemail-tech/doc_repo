---
id: 2026-05-19_cc-agent-UI-2_findings_mock_to_real
title: Dispatch — cc-agent-UI-2 plan-review findings mock-to-real swap
date: 2026-05-19
agent: cc-agent-UI-2
repo: legacy-design-tools
kind: dispatch
related: [_sessions/2026-05-18_cortex_ui_inventory_cc-agent-UI, _sessions/2026-05-18_plan_review_engine_inventory_cc-agent-PR, _sessions/2026-05-19_findings_mock_to_real_cc-agent-UI-2, 47_codex_plan_review, 42_design_accelerator_program_plan]
---

# Plan-review findings mock-to-real swap

You are cc-agent-UI-2. You operate in `P:\legacy-design-tools` and are authorized to read `P:\doc_repo` for canonical specs. **This dispatch ships code** — closes the largest UI/engine integration debt in the repo per the 2026-05-18 Cortex UI inventory.

## Why this exists

The 2026-05-18 cc-agent-UI Cortex UI inventory at `P:\doc_repo\_sessions\2026-05-18_cortex_ui_inventory_cc-agent-UI.md` §Cross-cutting findings #4 surfaced: **"Plan-review's findings list is mock-bridged."** Despite a full server route surface in `routes/findings.ts` (8 endpoints, tests passing), `plan-review/src/lib/findingsApi.ts:11-66, 145-160` bridges through `lib/findingsMock.ts`. Only `useCreateSubmissionFindings` is real. This is the single largest UI/engine integration gap in the repo.

User-visible consequence: the findings list in the plan-review artifact does not reflect real engine output. Reviewers see mock data, not the actual findings that the finding-engine produces on submission. Every other plan-review feature touching findings (FindingsTab, FindingDrillIn, FindingsRunsPanel, the Compliance Engine console) inherits the mock.

Fix: swap the mock-bridge for the generated Orval client. The server endpoints are real; the API surface is stable; the change is a single-file rewrite plus call-site verification. Per the UI inventory's recommended dispatch UI-2 sketch, this is S-effort.

## Read first

In order:

1. `P:\doc_repo\CLAUDE.md` — operating instructions.
2. `P:\doc_repo\_sessions\2026-05-18_cortex_ui_inventory_cc-agent-UI.md` — §Cross-cutting findings #4 (the mock-bridge gap); the inventory entries for the Findings UI surfaces (FindingsTab, FindingDrillIn, FindingsRunsPanel, ComplianceEngine console). Note: §Recommended dispatch shape UI-2 is the source-of-truth scope sketch — "single-file change in `plan-review/src/lib/findingsApi.ts`" + downstream consumers verify clean.
3. `P:\doc_repo\47_codex_plan_review.md` — reviewer-side product home; this dispatch closes a real reviewer experience gap.
4. `P:\doc_repo\42_design_accelerator_program_plan.md` — the architect-side `plan-review` artifact mirrors what reviewers see; this fix benefits both sides.

Then survey this repo:

5. `artifacts/plan-review/src/lib/findingsApi.ts` — the file you rewrite. Identify every export currently going through the mock-bridge.
6. `artifacts/plan-review/src/lib/findingsMock.ts` — the mock module being replaced. Identify the mock data shapes — they tell you what the real types need to look like.
7. `artifacts/api-server/src/routes/findings.ts` — the 8 real endpoints. This is your target API surface. Note: code is on main post-Bump 1 cross-PR rollout; finding-engine consumes `@hauska/atom-contract@^1.0.0`.
8. **Generated Orval client location** — likely `lib/api-client` or `lib/findings-api-client` or generated under `artifacts/plan-review/src/api/`. Find it. If it doesn't exist for findings, that's a real blocker — stop and report rather than handwrite a client.
9. `artifacts/plan-review/src/components/` — consumers of `findingsApi.ts`:
   - FindingsTab
   - FindingDrillIn
   - FindingsRunsPanel
   - Compliance Engine console (path per inventory)
   - Any other consumers your grep surfaces
10. `artifacts/plan-review/src/__tests__/` — existing tests of findings flows. Identify which tests use the mock and which test the real path (the inventory mentions API tests are passing for the real surface).
11. `git log --oneline -30 artifacts/plan-review/` — recent velocity. If active development is on a hot path you'd otherwise modify, rebase often.

## Scope

Three deliverables:

### Deliverable 1: `findingsApi.ts` rewrite

Replace every mock-bridged export in `plan-review/src/lib/findingsApi.ts` with a call into the generated Orval client. Per the inventory, this is the single critical file.

Functions to swap (verify via your grep — list is from the inventory but confirm fresh):

- `useListSubmissionFindings` (and its plain-function or query-hook variants)
- All `useGet*`, `useList*`, `useUpdate*`, `useDelete*` for findings
- Any mutation helpers (`acceptFinding`, `rejectFinding`, `editFinding`, `reclassifyFinding`, etc.)

`useCreateSubmissionFindings` is already real per the inventory — don't touch unless it's also calling through the mock somehow.

Preserve the existing function signatures so consumers don't need to change. The internal implementation flips from mock to real; the external contract holds. If a consumer DOES need to change (e.g., the mock returned synchronous data and the real client is async), update the consumer.

### Deliverable 2: Consumer verification + remove `findingsMock.ts`

Grep for every import of `lib/findingsMock.ts` and `lib/findingsApi.ts`. For each consumer:

- Verify the consumer compiles + typechecks against the rewritten `findingsApi.ts`.
- If `findingsMock.ts` has any remaining direct consumers (not via `findingsApi.ts`), surface them and decide: refactor them to use `findingsApi.ts`, or keep the mock module for that specific use case.

If `findingsMock.ts` has no remaining production consumers, **delete it.** If it has test-only consumers, move it to `__tests__/__fixtures__/` so its purpose is unambiguous.

### Deliverable 3: Tests

- Update existing findings-flow tests to expect real-client behavior. Mock the network layer (MSW handlers or similar) rather than mocking `findingsApi.ts`.
- Add at least one new integration test covering: list findings → select finding → mutate (accept/edit/reject) → verify mutation reflects in subsequent list query.
- If the existing test infrastructure uses MSW or equivalent, reuse. Don't introduce a new mock layer.

## Test plan (for PR body)

- [ ] `pnpm --filter @workspace/plan-review run typecheck` clean
- [ ] `pnpm --filter @workspace/plan-review run test` passes; no regression in any prior-green test
- [ ] Manual verification (or staged): findings list in plan-review artifact UI reflects real server data, not mock
- [ ] Manual verification: accept/edit/reject mutations persist and re-fetch reflects the change
- [ ] `findingsMock.ts` removed (or relocated to fixtures) with no consumers broken

## Coordination

- **Substrate-v1 planner's Bump 1 rollout merged** — `@hauska/atom-contract@^1.0.0` is pinned on main; finding-engine consumes it. No coordination needed.
- **cc-agent-BIM PR #28 + PR #29 merged** — BIM symmetry + ULID/UUID column-type fix on main. No overlap with findings.
- **cc-agent-EVAL PR #26 status unknown at dispatch time** — verify open/merged. If still open and approaching merge, no conflict expected (different files), but rebase awareness on main matters.
- **TS6305 eval-workflow build-order bug** — known pre-existing, not your scope, doesn't affect plan-review CI.
- **Active velocity in `artifacts/plan-review/`** — check `git log` for hot spots. The Compliance Engine console was a recent ship (Task #493 per the engine recon §58); coordinate timing if that work is still landing.

## Out of scope

- **Backend / routes/findings.ts changes** — endpoints exist + tested. Don't touch.
- **Atom contract changes** — `@hauska/atom-contract@1.0.0` is published. Don't touch.
- **FindingsTab / FindingDrillIn / FindingsRunsPanel UI** — visual surfaces unchanged. Only update if consumer signature changes force it.
- **Compliance Engine console UI** — same. Touch only if consumer signature forces it.
- **Reclassify endpoint UI affordance** — separate UI-4 stream per the inventory. Don't bundle.
- **Findings-related atom shape changes** — out of scope; the contract holds.
- **Adding new endpoints to routes/findings.ts** — out of scope.

## Done criteria

- `findingsApi.ts` uses real Orval client for every export.
- `findingsMock.ts` removed or relocated to fixtures; no production consumers.
- All plan-review tests pass; no regression.
- PR opened against `legacy-design-tools` main with test-plan checklist.
- Session summary at `P:\doc_repo\_sessions\2026-05-19_findings_mock_to_real_cc-agent-UI-2.md`:
  - Function-by-function swap list with file:line
  - Consumer-update list (if any signatures changed)
  - findingsMock.ts disposition (removed / relocated / partially retained)
  - Any new endpoint gaps discovered (server endpoint exists but client wrapper missing — log; do not implement)
  - Any signature mismatches surfaced (mock returned sync, real is async, etc.)

## Method discipline

- **Surgical, not refactor.** Single file is the main change; consumers update only when signature forces it.
- **Don't generate a new Orval client.** Use the existing generated client. If it doesn't have findings coverage, stop and report — generating new client surfaces is out of scope.
- **Preserve test infrastructure patterns.** If the repo uses MSW for API mocking in tests, use MSW. Don't introduce a new mock library.
- **Coordinate timing on plan-review hot spots.** If you rebase and find recent work on `findingsApi.ts` or its consumers, slow down and integrate cleanly.

## Session protocol

Per `P:\doc_repo\CLAUDE.md`. Two commits expected:

1. `legacy-design-tools` feature branch: `findingsApi.ts` rewrite + consumer updates + test updates + `findingsMock.ts` disposition.
2. `doc_repo`: session summary + 00 bump.

Push of the feature branch gated on Nick's explicit go per session protocol.

If you find the Orval client doesn't cover the findings endpoints, **stop and report**. Client generation is its own dispatch.
