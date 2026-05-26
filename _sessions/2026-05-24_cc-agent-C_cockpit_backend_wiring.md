---
id: 2026_05_24_cc_agent_c_cockpit_backend_wiring
title: cc-agent-C Cockpit backend wiring (PR #115)
status: active
last_updated: 2026-05-24
agent: cc-agent-C
repo: legacy-design-tools
type: session
related: [40g_cortex_cockpit_backend_wiring_sprint, 43_cortex_qa_backlog, _sessions/2026-05-24_cockpit_ia_deploy_prod_claude_code]
---

# Session — Cockpit Track B backend wiring (cc-agent-C)

**Date:** 2026-05-24  
**PR:** [#115](https://github.com/empressaioemail-tech/legacy-design-tools/pull/115) — squash-merged to `main`  
**Merge SHA:** `15c9349`  
**Branch:** `feat/cockpit-backend-wiring`

## Outcome

All **40g** phases **P0–P3** landed in one PR. CI green after fixup (publisher intake workbench mount when no saved package).

| Phase | Delivered |
|-------|-----------|
| P0 | OpenAPI packages + intake; orval codegen; `packagesApi.ts` re-exports generated client |
| P1 | `formSnapshot.publisherIntake` via `PATCH /packages/{id}` (debounced PublisherIntakeWorkbench) |
| P2 | Selection sanitization; share viewer `assets` hydration (renders + sheet thumbnails) |
| P3 | Intake on `PATCH /engagements/{id}`; brief editable in EngagementDetailsModal; `docs/deploy.md` canary discipline |

## Key paths

- `lib/api-spec/openapi.yaml`, `scripts/splice-openapi-packages-intake.mjs`
- `artifacts/api-server/src/routes/packages.{ts,logic.ts,hydration.ts}`, `engagements.ts`
- FE: `packagesApi.ts`, `PublisherIntakeWorkbench.tsx`, `PackageShareViewerPage.tsx`, `EngagementDetailsModal.tsx`

## Operator handoff (post-merge)

Prod is still on **`cortex-api-00045-pas`** (`c8d7fce`, #114 only) until operator deploys **`15c9349`**:

1. Wait for green **Build & push image** on `15c9349`
2. `deploy-canary` with `image_tag=15c9349`
3. Smoke: healthz, `POST …/packages` → 201, publisher PATCH round-trip, share viewer assets
4. Skip `run-migrations` unless new SQL (0018 already on prod)
5. `shift-traffic`
6. Re-run [`40g_cortex_cockpit_backend_wiring_sprint.md`](../40g_cortex_cockpit_backend_wiring_sprint.md) §J QA on default URL
