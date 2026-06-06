---
date: 2026-05-30
agent: cc-agent-C
repo: legacy-design-tools
dispatch: 2026-05-30_cc-agent-C_brief_api_slim_and_workspace_id
branch: cortex/brief-api-slim-workspace-id
---

# Close — Brief API slim response + workspaceId + REGRID mount

## PR

| Field | Value |
|-------|-------|
| URL | https://github.com/empressaioemail-tech/legacy-design-tools/pull/138 |
| SHA | `21cc4c7` |
| Branch | `cortex/brief-api-slim-workspace-id` |

**Do not merge** — operator review + canary deploy.

## Migrations

None in this PR.

## Changes shipped

### Task 1 — `workspaceId` on brief completion

After `upsertWorkspaceFromBrief`, `POST /brief` SELECTs workspace by `(installId, listingKey)` and returns:

```json
{
  "workspaceId": "<uuid>",
  "workspaceDid": "did:hauska:property-workspace:<listingKey>",
  "runId": "…",
  …
}
```

`POST /research/chat` also returns `workspaceId` + `workspaceDid` when the install has a workspace for the run's listing key.

### Task 2 — Slim siteContext

- `stripSiteContextForClient()` / `stripBriefPayloadForClient()` in `brokerageSiteContext.ts`
- Applied on `POST /brief` response (full context stored in DB for research chat LLM)
- Applied in `serializeWorkspacePackage()` for GET workspace / shared / open paths

### Task 3 — `POST /workspaces/open` contract

No code change. Documented in PR #138 for extension-agent:

- Body: `{ address, mls_id?, page_url?, run_id? }`
- Response: `{ id, listingKey, address, …, brief, attachments[] }` via `serializeWorkspacePackage`
- `listingKey` matches brief upsert hash (`listingKeyFromAddress`)

### Task 4 — REGRID prod mount

Runbook added: `legacy-design-tools/docs/deploy.md` § **Property Brief — Regrid on prod**

```powershell
gcloud run services update cortex-api `
  --region us-central1 `
  --project legacy-design-tools-prod `
  --update-secrets REGRID_API_KEY=REGRID_API_KEY:latest
```

Operator action pending — prod QA 2026-05-30 confirmed key not mounted.

### Task 5 — Coverage doc drift

Updated `doc_repo/75b_brief_coverage_v0.md` (outside repo): six keys → `neon`:

- `austin_tx`, `georgetown_tx`, `hutto_tx`, `leander_tx`, `new_braunfels_tx`, `round_rock_tx`

Source: `_inbox/2026-05-28_operator_neon_warmup_report.md`

## Before/after brief JSON byte size

Round Rock fixture with fat Regrid + FEMA layer payloads (80 × 400-char blobs per layer):

| Shape | UTF-8 bytes |
|-------|------------:|
| **Before** (full `layers[].payload`) | 70,145 |
| **After** (slim client response) | 315 |

Reduction ~99.6% on this fixture; extension `chrome.storage.local` quota failure class addressed server-side.

## Test output

### `pnpm run typecheck` — PASS

```
> workspace@0.0.0 typecheck P:\legacy-design-tools
> pnpm run typecheck:libs && pnpm -r --filter "./artifacts/**" --filter "./scripts" --if-present run typecheck

> workspace@0.0.0 typecheck:libs P:\legacy-design-tools
> tsc --build

Scope: 7 of 33 workspace projects
artifacts/api-server typecheck: Done
artifacts/codex-reviewer-qa typecheck: Done
artifacts/design-tools typecheck: Done
artifacts/mockup-sandbox typecheck: Done
artifacts/plan-review typecheck: Done
artifacts/qa typecheck: Done
scripts typecheck: Done
```

### `brokerageSiteContext.test.ts` — PASS (verbatim)

```
 RUN  v3.2.4 P:/legacy-design-tools/artifacts/api-server

 ✓ src/__tests__/brokerageSiteContext.test.ts (7 tests) 15ms

 Test Files  1 passed (1)
      Tests  7 passed (7)
   Start at  09:05:16
   Duration  620ms (transform 203ms, setup 15ms, collect 286ms, tests 15ms, environment 0ms, prepare 107ms)
```

Includes new `stripSiteContextForClient` test (payload removal + byte size assertion).

### `brokerageWorkspaceWallet.test.ts` — not run locally

No local Postgres `test_db` on workstation. New integration test added:

- `returns workspaceId matching recent list and omits layer payloads`

Expect green on CI Test job.

## REGRID smoke

Not executed — requires prod deploy + secret mount. Post-deploy smoke command in `docs/deploy.md`.

## Notes

- Removed stray untracked `brokerageExtensionPublic.ts` WIP from worktree (separate Wave 3 dispatch); restored on `cortex/property-brief-data-wave` via stash.
- Migration `0032` / GTM unrelated — not in this PR scope.
- Extension-agent (Wave 1b): consume `workspaceId` from brief response; optional server-side storage slim still recommended in v0.6.4 bundle.
