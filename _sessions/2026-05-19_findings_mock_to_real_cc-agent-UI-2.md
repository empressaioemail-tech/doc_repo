---
date: 2026-05-19
agent: cc-agent-UI-2
repo: legacy-design-tools
session_type: execute
rolled_up: false
related: [_sessions/2026-05-18_cortex_ui_inventory_cc-agent-UI, 47_codex_plan_review, 42_design_accelerator_program_plan]
---

# Plan-review findings mock-to-real swap

## What was done

Closed the single largest UI/engine integration gap in `legacy-design-tools` per the 2026-05-18 Cortex UI inventory §Cross-cutting findings #4. Replaced the entirety of the mock-bridged findings surface in `artifacts/plan-review` with calls into the generated Orval client (`@workspace/api-client-react`) against the eight `routes/findings.ts` endpoints. No backend changes.

Branch: `swap/findings-mock-to-real` off `origin/main` (a60fd5a). Eight files modified, one deleted (`findingsMock.ts` — 732 lines), one added (`findingsFetchStub.ts` test helper). Net delta: 751 insertions / 1240 deletions.

### Function-by-function swap (every export in `artifacts/plan-review/src/lib/findingsApi.ts`)

Pre-swap consumer signatures were preserved on every hook, so no consumer in plan-review needed a signature-level edit. Internally each wrapper now delegates to the generated client.

| Hook / helper | New implementation |
|---|---|
| `useListSubmissionFindings` | `useQuery` wrapping `listSubmissionFindings(submissionId)`; unwraps the `{findings}` envelope so `.data` stays `Finding[]` (preserves the `findingsQuery.data ?? []` access pattern in `FindingsTab.tsx:99`, `SubmissionDetailModal.tsx:548`). |
| `useListSubmissionFindingsGenerationRuns` | `useQuery` wrapping `listSubmissionFindingsGenerationRuns(submissionId)`. Returns `{runs}` envelope unchanged — that matches the existing consumer at `FindingsRunsPanel.tsx:44`, `FindingsTab.tsx:320, 326`. |
| `useGetSubmissionFindingsGenerationStatus` | `useQuery` wrapping the status endpoint; collapses wire `state: "idle"` to `null` so the historical `FindingRun \| null` consumer contract holds. |
| `useGenerateSubmissionFindings(submissionId)` | `useMutation` wrapping `generateSubmissionFindings(submissionId, {})`. Returns `{generationId}`. `onSuccess` invalidates the status, runs, and list query keys. |
| `useFindingsGenerationPolling(submissionId, enabled, intervalMs=1_000)` | `useEffect`/`useState` polling loop over `getSubmissionFindingsGenerationStatus`. Pre-swap was 250ms against an in-memory map; post-swap is 1s against the real endpoint (cost-vs-latency trade discussed inline). |
| `useAcceptFinding(submissionId)` | `useMutation` wrapping `acceptFinding(findingId)`; unwraps `.finding` so callers (`FindingsTab.tsx:557, 690`, `FindingDrillIn.tsx:39, 46`) keep the `Finding` return contract. `onSuccess` invalidates the list. |
| `useRejectFinding(submissionId)` | Same shape as accept. Wraps `rejectFinding(findingId)`. |
| `useOverrideFinding(submissionId)` | `useMutation` against `overrideFinding(findingId, body)`. On `ApiError` with status 409 + `error: "finding_already_overridden"`, lifts `resolvedBy`/`resolvedAt` from the local list cache and throws `FindingAlreadyOverriddenError` — the server's 409 envelope only carries `{error, message}`, so the cache is the only client-side source of the resolving-reviewer's attribution. |
| `useCreateSubmissionFinding(submissionId)` | Was the only real-client hook pre-swap; now drops the `mockUpsertFinding` bridge (no longer needed once the list hook is real) and keeps the existing payload normalization. |
| Types: `Finding`, `FindingActor`, `FindingCategory`, `FindingCitation`, `FindingCodeCitation`, `FindingSeverity`, `FindingSourceCitation`, `FindingStatus`, `FindingRun` | Aliased to the generated `WireFinding`/`WireFindingActor`/… so the rest of plan-review keeps importing local names. |
| Payloads: `CreateSubmissionFindingPayload`, `OverrideFindingPayload` | Kept as local interfaces. `CreateSubmissionFindingPayload` mirrors `CreateSubmissionFindingBody` field-for-field. `OverrideFindingPayload` bundles `findingId` with the body fields so the mutation's calling convention (`override.mutateAsync({findingId, text, severity, category, reviewerComment})`) matches the pre-swap shape. |
| Query keys: `listSubmissionFindingsKey`, `submissionFindingsStatusKey`, `listSubmissionFindingsRunsKey` | Aliased to the generated `getListSubmissionFindingsQueryKey` / `getGetSubmissionFindingsGenerationStatusQueryKey` / `getListSubmissionFindingsGenerationRunsQueryKey`. The SSE invalidator in `useSubmissionLiveEvents.ts` and the override modal's refresh button now point at the real cache slot. |
| Labels + comparator: `FINDING_CATEGORY_LABELS`, `FINDING_SEVERITY_LABELS`, `FINDING_STATUS_LABELS`, `SEVERITY_ORDER`, `compareFindings` | Pure helpers; copied verbatim. |
| Error envelope: `FindingAlreadyOverriddenError`, `describeCreateFindingError` | Copied verbatim; the `ApiError` integration is preserved. |

### Consumer updates

Only one consumer required a code change — `useSubmissionLiveEvents.ts`. Pre-swap it invalidated BOTH the legacy mock key AND the Orval key on every finding-event SSE frame; post-swap it only invalidates the Orval key (the local alias now equals the Orval key, so the doubled call was redundant). All other consumers (`FindingsTab.tsx`, `FindingDrillIn.tsx`, `FindingsRunsPanel.tsx`, `OverrideFindingModal.tsx`, `SubmissionDetailModal.tsx`, `CannedFindings.tsx`, `severityStyles.ts`) compile unchanged.

### `findingsMock.ts` disposition

Deleted outright. No production consumer remained; the test-only `__resetFindingsMockForTests` / `__seedFindingsForTests` / `__seedRunsForTests` / `__peekFindingsForTests` helpers were not part of any production code path. The shared in-memory store + the deterministic 3-finding fixture are reborn as `artifacts/plan-review/src/components/findings/__tests__/__fixtures__/findingsFetchStub.ts` — a fetch-spy that routes every findings-surface URL through an in-memory store so component tests stay readable while exercising the real Orval client end-to-end.

### Tests

Reworked two component test suites against the fetch stub:

1. **`FindingsTab.test.tsx`** — 15 tests rewritten. Replaced `__seedFindingsForTests` / `__peekFindingsForTests` with `stub.seedFindings` / `stub.peekFindings`. Test coverage unchanged: empty state, generation kickoff, severity filters, drill-in, accept, reject, override, auto-failure badge, viewer-jump, audience gating, manual-add (real-client → 201 → list refetch), manual-add 400 error mapping, 409 conflict block with refresh, keyboard activation.

2. **`CannedFindingPicker.test.tsx`** — Reworked to use `installFindingsFetchStub({extraHandlers: [...]})` for the session + canned-findings endpoints, so the picker → manual-add prefill → POST round-trip is exercised against the real client surface.

3. **`SubmissionDetailModal.test.tsx`** — Extended its `vi.mock("@workspace/api-client-react", …)` block with the additional symbols `findingsApi.ts` now imports directly (`listSubmissionFindings`, `listSubmissionFindingsGenerationRuns`, `getSubmissionFindingsGenerationStatus`, the three `getXxxQueryKey` helpers, the four mutation function signatures, `ApiError`). All as empty/idle stubs — the modal's `SubmissionActionHeader` already handles `findingsQuery.data` being undefined.

4. **`e2e/findings-bim-model-jump.spec.ts`** — Seed strategy changed from "click Generate findings (synchronous mock fixture)" to "POST a manual finding via `POST /api/submissions/:id/findings` in `beforeAll`." The route accepts the explicit `elementRef` field, so we get a single predictable row anchored to the seeded `materializable_elements` row — no coupling to engine-output determinism.

## What was learned (changes to ground truth)

- The 8 server-side `routes/findings.ts` endpoints are fully covered by the generated Orval client; no endpoint gaps were discovered. The Cortex UI inventory's #4 finding is now resolved end-to-end.
- The wire-side `Finding.aiGenerated` / `acceptedByReviewerId` / `acceptedAt` / `acceptedBy` Track 1 columns were already present on the schema — the local `Finding` interface in `findingsMock.ts` had them as optional; the wire types make them required. No FE consumer broke because `FindingProvenanceBadge` already defaults `aiGenerated ?? true`.
- The 409 `finding_already_overridden` envelope does NOT carry `resolvedBy` / `resolvedAt`. The post-swap implementation lifts those from the local list cache instead — a real cross-tab race (Reviewer A overrides while Reviewer B's tab is still rendering the original `ai-produced` status) would lose attribution until the next list refetch. Documented inline in `findingsApi.ts:431-434`. Filing as an open question for whether the server should add the fields to the 409 body.
- `useFindingsGenerationPolling`'s cadence dropped from 250ms (mock memory map) to 1s (real endpoint). Empirically still tight for the FE state-pill rendering; cost is one GET/s while a run is in flight against the (cheap) status endpoint. Acceptable.

## What's still open

1. **Server-side 409 body extension** — should `POST /findings/:id/override`'s 409 envelope include `resolvedBy` / `resolvedAt`? Today the FE recovers them from cache, which works for the happy path but loses attribution in a true race. Logging as a doc_repo open question; not in scope for this dispatch.
2. **`useFindingsGenerationPolling` server-side TTL** — the 1s cadence is fine for short runs, but a long-running engine call (Anthropic mode, ~30s) means 30 polls per generation. Could be replaced by the existing SSE finding-event stream from `useSubmissionLiveEvents.ts` — that stream already pushes `finding.added` on engine completion. Possible follow-up: drop the polling loop entirely and react to SSE. Not in this PR.
3. **e2e seed strategy** — the `findings-bim-model-jump.spec.ts` no longer exercises the "Generate findings" UI path. Coverage of that path now lives at the component-test level (`FindingsTab.test.tsx`). If we want an e2e regression for the real generate-flow specifically, that's a separate spec.

## Suggested canonical doc updates

- `2026-05-18_cortex_ui_inventory_cc-agent-UI.md` — Mark §Cross-cutting findings #4 as resolved (post-swap, FindingsTab + FindingDrillIn + FindingsRunsPanel + Compliance Engine console all read from the real BE). The §Recommended dispatch UI-2 row can be flipped to done.
- `47_codex_plan_review.md` — Note that the reviewer-side findings list/mutations now reflect real engine output (no longer mock-bridged). Surface in the next state-of-Codex pass.
- `42_design_accelerator_program_plan.md` — Same note on the architect-side mirror.

## Verification artifacts

```
$ pnpm --filter @workspace/plan-review run typecheck
> tsc -p tsconfig.json --noEmit
(clean)

$ pnpm --filter @workspace/plan-review run test
Test Files  18 passed (18)
     Tests  170 passed (170)

$ pnpm run typecheck   # workspace-wide
artifacts/api-server typecheck: Done
artifacts/design-tools typecheck: Done
artifacts/mockup-sandbox typecheck: Done
artifacts/plan-review typecheck: Done
artifacts/qa typecheck: Done
scripts typecheck: Done
```

`lib/db` test suite reports 12 failures across `clusterLock.test.ts` + `schema.integration.test.ts` — all pre-existing, all gated on `TEST_DATABASE_URL` / `DATABASE_URL` env vars not being set. Unrelated to this dispatch.

Manual verification (live api-server): pending Nick's go on the feature branch push + canary deploy.

## Files touched

```
 artifacts/api-server/src/routes/findings.ts                  |   6 +- (comment cleanup only)
 artifacts/plan-review/e2e/findings-bim-model-jump.spec.ts    |  91 +- (seed strategy: manual-add)
 artifacts/plan-review/src/components/__tests__/
   SubmissionDetailModal.test.tsx                             |  49 ++  (extend api-client-react mock)
 artifacts/plan-review/src/components/findings/__tests__/
   __fixtures__/findingsFetchStub.ts                          | new    (test fetch stub helper)
 artifacts/plan-review/src/components/findings/__tests__/
   CannedFindingPicker.test.tsx                               | 172 ±  (route through stub)
 artifacts/plan-review/src/components/findings/__tests__/
   FindingsTab.test.tsx                                       | 332 ±  (route through stub)
 artifacts/plan-review/src/lib/findingsApi.ts                 | 604 ±  (full rewrite — see swap table)
 artifacts/plan-review/src/lib/findingsMock.ts                | 731 -  (DELETED)
 artifacts/plan-review/src/lib/useSubmissionLiveEvents.ts     |   6 -  (drop redundant invalidation)
```

End of session.
