---
id: 2026-05-26_cc-agent-C_wedge_merge_handoff
title: HANDOFF — cc-agent-C wedge (GTM PR + parcel layers)
date: 2026-05-26
agent: cc-agent-C
repo: legacy-design-tools
priority: P0
---

# cc-agent-C handoff — Property Brief wedge (merge + ship)

Paste this block into a **cc-agent-C** session on `P:\legacy-design-tools` (Grok Build 0.1). Nick merges after CI green.

---

## Context

Property Brief brokerage API merged in PR #128. Planner landed **GTM observation layer** on branch `cortex/gtm-observation-layer` (commit `c95c67a` locally; push and open PR). **Parcel layers** for brokerage brief are still required before external demos (Valerie).

Canonical docs (read first):

- `P:\doc_repo\76_empressa_wedge_90d_operating_plan.md`
- `P:\doc_repo\76a_operator_autonomous_loops.md`
- `P:\doc_repo\_dispatches\2026-05-26_cc-agent-C_gtm_observation_layer.md`
- `P:\doc_repo\_dispatches\2026-05-26_cc-agent-C_brokerage_site_context_layers.md`
- `P:\doc_repo\90_runbooks\brokerage_cortex_deploy_checklist.md`

Extension (operator machine, not in git): `P:\hauska-brief-extension` **v0.4.3** — consent UI + `gtm-client.js`. Reload unpacked after API deploy.

---

## Your mission (sequenced)

### Track 1 — GTM observation layer (branch already exists)

1. `cd P:\legacy-design-tools`
2. `git fetch origin` (if remote exists); confirm branch `cortex/gtm-observation-layer` at `c95c67a` or cherry-pick from Nick's machine.
3. If branch missing: create from `main` with files listed in `_dispatches/2026-05-26_cc-agent-C_gtm_observation_layer.md`.
4. `pnpm install` if needed; run tests:
   - `pnpm --filter api-server exec vitest run src/__tests__/brokerageGtm.test.ts`
   - `pnpm --filter api-server exec vitest run src/__tests__/brokerageBrief.test.ts`
5. Refresh schema fixture: `lib/db/scripts/refresh-schema-fixture.sh` (or document operator step if no local Postgres).
6. Open PR: **title** `feat(cortex-api): GTM observation layer for Property Brief wedge`
7. **Do not merge** — Nick merges.

**Acceptance:** CI green; migration `0028_gtm_observation_layer.sql` in PR; routes:

- `POST /api/brokerage/v1/gtm/consent`
- `POST /api/brokerage/v1/gtm/events`
- `GET /api/brokerage/v1/gtm/digest`
- Brief emits events when header `X-Hauska-Install-Id` set

### Track 2 — Parcel site-context layers (net-new branch after Track 1 PR open)

1. Branch: `cortex/brokerage-site-context` from `main` (rebase on GTM PR if merged first).
2. Implement per `_dispatches/2026-05-26_cc-agent-C_brokerage_site_context_layers.md`:
   - `artifacts/api-server/src/lib/brokerageSiteContext.ts`
   - Wire `brokerageBrief.ts` + `brokerageBriefLlm.ts` prompts
   - Tests with mocked `fetchBrokerageSiteContext`
3. Open **separate PR** (smaller review) or same PR if Nick prefers one deploy; default **separate PR**.

**Acceptance:** `POST /brief` returns `siteContext.layers` with FEMA and/or Regrid for Bastrop pilot address when tokens configured.

### Track 3 — Post-merge operator checklist (document in PR body)

Nick will:

1. Merge PR(s)
2. Run GHA `run-migrations` (includes 0026 + 0028)
3. Deploy cortex-api; **shift 100% traffic to new revision**
4. Smoke per `90_runbooks/brokerage_cortex_deploy_checklist.md`
5. Reload extension v0.4.3; accept terms in options; run brief

---

## Policy tiers (maintenance loop)

| Tier | You may |
|------|---------|
| 0 | Logging, tests, type fixes |
| 1 | PR with green CI; propose merge |
| 2 | Architecture changes — ask in PR description |
| 3 | New env vars, partnership claims — stop, flag Nick |

---

## Out of scope this dispatch

- Stripe billing
- Share card public URLs
- SkySlope connector
- Chrome Web Store publish

---

## Report back

When PR(s) open, file close note at `P:\doc_repo\_inbox\2026-05-26_legacy-design-tools_cc-agent-C_wedge_gtm_parcel.md` with:

- PR URL(s)
- CI status
- Migration numbers included
- Smoke commands run locally (Y/N)

---

End handoff.
