---
id: 2026-05-28_legacy-design-tools_cc-agent-C_brokerage_v1_workspace_metering_graph_close
title: Close — Brokerage V1 workspace, paywall-wallet, admin graph (cc-agent-C)
date: 2026-05-28
agent: cc-agent-C
repo: legacy-design-tools
dispatch: 2026-05-28_cc-agent-C_brokerage_v1_workspace_metering_graph
---

# Close — Brokerage V1 workspace, paywall-wallet, admin graph

## PR

| Item | Value |
|------|-------|
| PR | https://github.com/empressaioemail-tech/legacy-design-tools/pull/132 |
| Branch | `cortex/brokerage-v1-workspace-metering-graph` |
| SHA | `1109f02` |

## Migrations

| File | Purpose |
|------|---------|
| `lib/db/drizzle/0029_brokerage_workspace_wallet.sql` | `brokerage_workspaces`, `brokerage_workspace_attachments`, `brokerage_workspace_shares`, `brokerage_wallets`, `brokerage_wallet_ledger` |

**Deploy:** run migration `0029` on cortex-api DB after merge (alongside existing `0026` / `0028`).

## API surface (extension v0.4.x compatible)

| Area | Routes |
|------|--------|
| **3b Workspace** | `GET /api/brokerage/v1/workspaces/recent`, `GET /api/brokerage/v1/workspaces/:id`, `POST /api/brokerage/v1/workspaces/open`, attachment CRUD under `/workspaces/:id/attachments`, `POST /workspaces/:id/share`, `GET /workspaces/shared/:shareToken` |
| **3d Wallet** | `GET /api/brokerage/v1/wallet`, `POST /api/brokerage/v1/wallet/top-up` ($5 default), `POST /api/brokerage/v1/wallet/settings` (auto-refill) |
| **3d Paywall** | `POST /api/brokerage/v1/brief`, `POST /api/brokerage/v1/research/chat` → `402 insufficient_balance` when install wallet cannot cover compute; reads unchanged |
| **3e Admin graph** | `GET /api/brokerage/v1/admin/graph` (JSON); `?format=html` for operator page; header `X-Brokerage-Admin-Key` |

**Headers:** existing `Authorization` / `X-Hauska-Key`; workspace/wallet routes require `X-Hauska-Install-Id`. CORS allows install-id header.

**Env (server-side only):**

| Variable | Default | Role |
|----------|---------|------|
| `BROKERAGE_COMPUTE_COST_CENTS` | `100` | Debit per brief/chat turn |
| `BROKERAGE_TOP_UP_INCREMENT_CENTS` | `500` ($5) | Top-up / auto-refill unit |
| `BROKERAGE_WALLET_START_BALANCE_CENTS` | `0` | New install starting balance |
| `BROKERAGE_WALLET_BYPASS` | off | Skip paywall (dev) |
| `BROKERAGE_ADMIN_API_KEYS` | — | Admin graph auth |
| `BROKERAGE_WALLET_AUTO_REFILL_FAIL` | off | Test hook to simulate refill failure |

## Acceptance checklist

| Criterion | Status | Notes |
|-----------|--------|-------|
| `GET recent workspaces` with listing URL | **PASS** (code) | Upsert on brief completion; `sourceListingUrl` from `page_url` |
| `GET workspace/:id` restores brief/research context | **PASS** (code) | Returns `brief` payload from latest run |
| Attachment CRUD link/image/pdf/note | **PASS** (code) | Kind guardrails enforced |
| Share → collaborator full package read | **PASS** (code) | `GET /workspaces/shared/:shareToken` |
| Zero balance blocks brief/chat; reads OK | **PASS** (code) | `402` on compute; workspace GET unaffected |
| Wallet $5 top-up + auto-refill | **PASS** (code) | Simulated top-up API (no Stripe in V1) |
| Admin graph consent-filtered | **PASS** (code) | Nodes/edges only for `graphOptIn=true` |
| Tests green | **BLOCKED** (local) | No `DATABASE_URL` on workstation |
| Typecheck green | **PASS** | `pnpm run typecheck` exit 0 |

## Test output

### Typecheck (pass)

```
pnpm run typecheck
# exit 0 — all artifacts + libs
```

### Integration tests (not run — blocker)

```
pnpm --filter @workspace/api-server exec vitest run \
  src/__tests__/brokerageWorkspaceWallet.test.ts \
  src/__tests__/brokerageBrief.test.ts \
  src/__tests__/brokerageGtm.test.ts

# Error: DATABASE_URL must be set. Did you forget to provision a database?
```

New suite: `artifacts/api-server/src/__tests__/brokerageWorkspaceWallet.test.ts` covers paywall, attachments/share, auto-refill, admin graph consent filtering. **CI should run with DATABASE_URL.**

## Out of scope (unchanged)

- **3c atomization pipeline** — cc-agent-E / AC contract (not in this PR)
- SkySlope, marketplace, non-brokerage surfaces
- Real payment processor (top-up is server-simulated for V1)

## Blockers / follow-ups

1. **Apply migration `0029`** on cortex-api before extension wallet/workspace QA.
2. **Set `BROKERAGE_ADMIN_API_KEYS`** on Cloud Run for operator graph access.
3. **Extension wiring** — point workspace/wallet UI to new routes; send `X-Hauska-Install-Id` on all metered calls.
4. **CI verification** — re-run api-server brokerage tests once `DATABASE_URL` is available in CI (expected green).
5. **Optional:** regenerate `schema.sql.template` via `pnpm --filter @workspace/db run test:fixture:schema` after `drizzle push` on a live DB (manual fixture edit included in PR; drift check should pass).

## Files touched (commit `1109f02`)

- Routes: `brokerageBrief.ts`, `brokerageWorkspace.ts`, `brokerageWalletRoute.ts`, `brokerageAdminGraph.ts`
- Lib: `brokerageWorkspace.ts`, `brokerageWallet.ts`, `brokerageInstallId.ts`
- Middleware: `brokerageCors.ts`, `brokerageAdminAuth.ts`
- DB: `0029_*.sql`, `brokerageWorkspaces.ts`, `brokerageWallets.ts`, fixture + integration table list
- Tests: `brokerageWorkspaceWallet.test.ts`, `setup.ts` truncate list
