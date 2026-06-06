---
id: 2026-05-30_cc-agent-C_brief_api_slim_and_workspace_id
title: Dispatch — Brief API slim response + workspaceId + REGRID prod mount
date: 2026-05-30
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
related: [75a_hauska_brief_extension, 75e_property_brief_collaboration_sharing_handoff, 2026-05-30_property_brief_qa_fix_wave_index, 2026-05-29_cc-agent-C_extension_public_client_key]
blocked_on: none
---

# Brief API — slim extension payload, workspaceId, REGRID mount

You are **cc-agent-C**, owner of `legacy-design-tools` / cortex-api for this run.

**Context:** Manual QA (2026-05-30). Extension stores full `POST /brief` JSON in `chrome.storage.local` and hits **QuotaBytes exceeded** after federal/Regrid site-context layers ship (PR #137). Share fails because brief response omits **`workspaceId`** (UUID) even though `upsertWorkspaceFromBrief` runs server-side. Regrid parcel/zoning layers empty on prod — **`REGRID_API_KEY` not mounted** on Cloud Run.

## Model (HR-12)

**Grok Build 0.1** — multi-file API + deploy notes.

## Atoms to resolve

- `current-state:portfolio`
- `product:property-brief`
- `workflow:brokerage-brief-run`

## Read first

1. [`75e_property_brief_collaboration_sharing_handoff.md`](../75e_property_brief_collaboration_sharing_handoff.md) — share routes, workspace upsert
2. [`artifacts/api-server/src/routes/brokerageBrief.ts`](../../legacy-design-tools/artifacts/api-server/src/routes/brokerageBrief.ts) — brief handler
3. [`artifacts/api-server/src/lib/brokerageSiteContext.ts`](../../legacy-design-tools/artifacts/api-server/src/lib/brokerageSiteContext.ts) — layer payload shape
4. [`_inbox/2026-05-29_legacy-design-tools_cursor_property_brief_data_wave_deploy_close.md`](../_inbox/2026-05-29_legacy-design-tools_cursor_property_brief_data_wave_deploy_close.md) — prod rev + REGRID gap

## Workspace

- Clone: `P:\legacy-design-tools`
- Branch: `cortex/brief-api-slim-workspace-id`
- Do not merge — PR for operator

---

## Task 1 — Return `workspaceId` on brief completion

After `upsertWorkspaceFromBrief`, SELECT workspace row by `(installId, listingKey)` and include in `POST /brief` response:

```json
{
  "workspaceId": "<uuid>",
  "workspaceDid": "did:hauska:property-workspace:…",
  "runId": "…",
  …
}
```

Also expose on `POST /research/chat` response when run resolves to a workspace (optional but preferred for extension rehydrate).

**Tests:** extend `brokerageWorkspaceWallet.test.ts` — brief response includes `workspaceId`; recent list id matches.

---

## Task 2 — Slim siteContext for extension clients

Extension UI reads only `layers[].{status, layerKind, summary, provider}` (see `hauska-brief-extension/src/lib/site-context-render.js`). Full `layers[].payload` (GeoJSON, Regrid fields) is LLM-only.

**Implement one of:**

- **Preferred:** strip `payload` from each layer in brokerage brief JSON response (keep summaries). LLM path already uses internal `fetchBrokerageSiteContext` before strip.
- **Alternate:** honor header `X-Hauska-Client: extension` or query `?client=extension`.

Do **not** break MCP or internal admin consumers that need payload — scope strip to extension-facing brief + workspace package serialize if shared path also bloats storage.

**Tests:** brief response JSON size for Round Rock fixture drops materially; `summary` fields still present; reasoning/lay generation unchanged.

---

## Task 3 — `POST /workspaces/open` contract doc

Confirm handler returns `{ id, … }` and matches brief upsert listing key. No code change required if already correct — document in PR description for extension-agent.

---

## Task 4 — REGRID on prod (operator-ready)

Add or update runbook snippet (do not commit secrets):

1. Verify secret `REGRID_API_KEY` exists in GCP Secret Manager for cortex-api project.
2. Mount on Cloud Run service `cortex-api`:

```powershell
gcloud run services update cortex-api `
  --region us-central1 `
  --update-secrets REGRID_API_KEY=REGRID_API_KEY:latest
```

3. Smoke: brief for Round Rock address returns `siteContext.layers` with `regrid-parcel` or `regrid-zoning` status `ok` when key valid.

If PR #135 (GTM / migration 0032) required for place-layer archive path, note in close file — do not merge unrelated scope without operator ack.

---

## Task 5 — Coverage doc drift

Update [`75b_brief_coverage_v0.md`](../75b_brief_coverage_v0.md): flip six pilot keys from `engine_only` to `neon` if warmup report confirms (see `_inbox/2026-05-28_operator_neon_warmup_report.md`).

---

## Out of scope

- Extension chrome.storage slim (extension-agent)
- Demo UI purge (extension-agent)
- Chrome Web Store public key mint (separate dispatch `2026-05-29_cc-agent-C_extension_public_client_key`)
- Pflugerville / General Code partnership outreach

---

## Acceptance criteria

- [ ] `POST /brief` returns `workspaceId` for authenticated install with `X-Hauska-Install-Id`
- [ ] Brief JSON omits layer `payload` blobs (summaries retained)
- [ ] `brokerageWorkspaceWallet.test.ts` + `brokerageBrief.test.ts` green
- [ ] `pnpm run typecheck` green
- [ ] PR open with deploy notes for REGRID mount
- [ ] `75b` pilot tier rows updated if verified

## Report back

`P:/doc_repo/_inbox/2026-05-30_legacy-design-tools_cc-agent-C_brief_api_slim_and_workspace_id_close.md`

Include PR URL, SHA, migration list (if any), before/after brief JSON byte size sample, REGRID smoke output.
