---
id: 2026-05-26_legacy-design-tools_cursor-auto_session_close
title: Session close — substrate QA, product-spec AI, UI polish, local dev restart
date: 2026-05-26
agent: cursor-auto (Cursor, cente workstation)
repo: legacy-design-tools
branch_at_close: feat/studio-prod-enable @ ce051cf (+ optional unstaged studio/renders churn)
worktree: p:\legacy-design-tools
transcript: 4d326437-081d-4121-b3d7-981a9e218b4e
status: closed — operator may archive thread
supersedes:
  - _inbox/2026-05-26_legacy-design-tools_cc-agent-C_since_inbox_handoff.md
  - _inbox/2026-05-26_operator_localhost_substrate_qa_runbook.md (partial execution noted below)
related:
  - _research/2026-05-25_bim-viewport-local-dev_session_close.md (in LDT repo — BIM / GCS / Model→Studio arc)
  - _inbox/2026-05-26_legacy-design-tools_cc-agent-C_placid_collateral_close.md (ce051cf collateral)
  - 43_cortex_qa_backlog.md (QA-55, QA-62)
---

# Session close — Cursor auto (2026-05-26)

Planner-facing summary of work completed in this thread. Code for most items is on **`ce051cf`** (`feat(studio-prod-enable` / `sprint/placid-collateral` lineage) unless noted as unstaged.

---

## Executive summary

| Track | Status |
|-------|--------|
| **QA-62** localhost substrate MCP wiring | **Partial pass** — `source:mcp`, env + local MCP OK; catalog still **5 jurisdictions** until engine #48 + retrieval snapshot redeploy |
| **QA-55** Product specs AI recommendations | **Shipped** — `POST …/generate-recommendations` + **Generate recommendations** UI |
| **UI** Ctrl+K badges beside search | **Removed** — keyboard shortcut still works globally |
| **Chat UX** (prior in same branch) | White-on-white user bubble fix; workspace chat N+1 batching |
| **40i A/B** (prior handoff) | Grok finding engine + Cedar Hill corpus on branch (see since-handoff delta) |
| **Local dev restart** | **Done** — `dev:local` on :8080, Vite :20295, healthz OK |
| **BIM / Studio / GCS** (parallel agent) | Documented in LDT `_research/2026-05-25_bim-viewport-local-dev_session_close.md` |

---

## 1. QA-62 — Operator localhost substrate runbook

### Done on cente workstation

- **`.env.local`** — `HAUSKA_SUBSTRATE_MODE=mcp`, `HAUSKA_MCP_URL=http://127.0.0.1:3000/mcp`, team MCP key minted (local `hauska-mcp-server` migrate + admin bootstrap).
- **Local MCP** — production retrieval backend (`hauska-retrieval-api` Cloud Run) + engine bearer from `doc_repo/Secrets.txt` (`RETRIEVAL_API_KEY`).
- **api-server** — rebuilt; `GET /api/substrate/health` → `mode: mcp`.
- **Curl** — `GET /api/substrate/jurisdictions?states=TX` → `source: mcp`, `total: 5` (Bastrop network + Grand County only).

### Not passed (upstream)

- Runbook expects `total >> 5`, San Antonio / Crowley / Converse / **`cedar_hill_tx`** after MCP refresh.
- **Root cause:** production retrieval snapshot still **2026-05-21** corpus.
- **Unblock:** merge **hauska-engine PR #48** (Cedar Hill) → `build-corpus-snapshot` + retrieval redeploy + MCP catalog refresh (cc-agent-M / E close file).

### Code Library UI (partial)

- **Hauska Substrate Catalog — LIVE** badge; yellow fixture banner gone; **Show all jurisdictions** toggle present.
- Cedar Hill under **Your firm** (cortex-local warmup) ≠ substrate catalog row.

---

## 2. QA-55 — AI product spec recommendations

### API

`POST /api/engagements/{engagementId}/product-spec-references/generate-recommendations`

- Context: sheets (incl. `contentBody` excerpts), existing L5 refs, recent findings.
- Env: `PRODUCT_SPEC_RECOMMENDATIONS_LLM_MODE=mock|anthropic` (default **mock** → ~5 draft rows, skips duplicate ESRs).
- OpenAPI + orval codegen updated.

### UI

**Deliver → Product specs → Generate recommendations**

- Panel lists suggestions with **Review & add** → existing AI-drafted create dialog (same as chat `draft_product_spec_reference`).
- Empty state CTA duplicates the button.

### Tests

- `productSpecRecommendations.logic.test.ts`
- `ProductSpecReferencesTab.test.tsx` — generate mutation smoke

### Key paths

| Layer | Path |
|-------|------|
| Generator | `artifacts/api-server/src/lib/productSpecRecommendations.ts` |
| Route | `artifacts/api-server/src/routes/productSpecReferences.ts` |
| Tab | `artifacts/design-tools/src/components/engagement-detail/ProductSpecReferencesTab.tsx` |

---

## 3. UI — sidebar search shortcut chips

Removed visible **Ctrl+K** / **⌘K** control next to engagement search (`CockpitShell.tsx`, `index.css`). **Ctrl+K** still focuses search from elsewhere on the page.

---

## 4. Local dev restart (this session end)

Recipe used:

```powershell
# Stop :8080 / :20295, then:
cd p:\legacy-design-tools
.\scripts\dev-local-windows.ps1
# api-server also started via dev:local with .env.local + GCS ADC
```

**Verified after restart:**

| URL | Result |
|-----|--------|
| `http://127.0.0.1:8080/api/healthz` | 200 |
| `http://127.0.0.1:8080/api/substrate/health` | 200 |
| `http://127.0.0.1:20295/` | 200 |

**Use `dev:local`**, not `pnpm --filter @workspace/api-server run dev` (Cloud Run proxy), for local GLB / Canva / Model→Studio / new API routes.

**Browser:** hard refresh **Ctrl+Shift+R** after api restart.

Prereqs: `DATABASE_URL` in `.env.local`; `GOOGLE_APPLICATION_CREDENTIALS` → `C:\Users\cente\google-cloud-sdk\smartcity-agent-key.json` (or equivalent).

See also: `docs/local-dev-windows.md`, `scripts/verify-local-pipeline.ps1`, `_research/2026-05-25_bim-viewport-local-dev_session_close.md`.

---

## 5. Prior work on same branch (reference only)

Already filed in `_inbox/2026-05-26_legacy-design-tools_cc-agent-C_since_inbox_handoff.md`:

- **40i Track A** — Grok finding engine (`AIR_FINDING_LLM_MODE=grok`, `XAI_API_KEY`)
- **40i Track B** — `cedar_hill_tx` corpus (clientId 1568, productId 11825); no `dallas|tx` mapping
- Workspace prefs / QA-61 substrate UI / jurisdiction v1.5–v3 (separate inbox closes)
- **ce051cf** — Placid collateral, Canva routes, cockpit/backend wiring — see placid collateral close inbox

---

## 6. Working tree at session end (do not assume clean)

**Branch:** `feat/studio-prod-enable` (ahead of `origin/main` by placid commit).

**Possible unstaged churn** (studio-prod / codegen — verify before next commit):

- `artifacts/api-server/src/routes/renders.ts`
- `lib/api-spec/openapi.yaml` (+ generated client/zod)
- `lib/db` fixture drift / `ViewCubeWidget.tsx`

**Do not commit:** `.env.local`, MCP keys, `Secrets.txt` references.

---

## 7. Next operator / agent actions

| Priority | Action |
|----------|--------|
| P0 infra | Merge hauska-engine **#48** → rebuild retrieval snapshot → redeploy MCP → re-run QA-62 curls |
| P1 product | Smoke **Generate recommendations** on 430 Evergreen Trl after hard refresh |
| P1 git | Split `ce051cf` mega-branch into reviewable PRs if not already (jurisdiction, QA-55, collateral, substrate) |
| P2 | Full `pnpm run typecheck` before push (known workspace prefs / portal-ui issues may pre-exist) |

---

## One-liner for next thread

**Localhost is on `dev:local` with healthz green; substrate MCP mode works but catalog is stale (5 keys); product-spec AI generate is wired in UI+API; full QA-62 pass waits on engine #48 + retrieval redeploy.**
