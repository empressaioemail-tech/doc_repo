---
id: 2026-05-28_dispatch-A_ldt_place-graph-brief
title: Dispatch A — LDT place graph + brief (wave 0–2 continue)
date: 2026-05-28
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
related: [2026-05-28_central-tx-property-brief-scope, 75_hauska_brokerage_workflow_plan, 75b_brief_coverage_v0, 90_runbooks/property_brief_cortex_deploy]
---

# Dispatch A — LDT place graph + brief (wave 0–2 continue)

You are **cc-agent-C**, single owner of `legacy-design-tools` for this run.

**Scope ref:** [`2026-05-28_central-tx-property-brief-scope.md`](2026-05-28_central-tx-property-brief-scope.md)  
**Planning kickoff:** `_inbox/2026-05-28_legacy-design-tools_cursor-auto_central-tx-property-brief_planning_kickoff.md` §8 (git hygiene — mixed worktree)

## Model (HR-12)

Default: **Grok Build 0.1**. Use **grok-code-fast-1** for narrow tasks. Escalate to Claude only on retry failure.

## Already landed (2026-05-28, uncommitted on cente worktree)

- Migration `0030_place_layer_snapshots.sql` + `brokerage_workspaces` geo columns
- `fetchBrokerageSiteContext`: snapshots → adapter cache → live
- Central TX geocode registry (`lib/codes/src/centralTexasPilot.ts`)
- `GET /api/brokerage/v1/coverage`
- `/brief` emits `atoms` projection (`workspaceDid`, `briefRunDid`, `placeLayers`, `inlineRefs`)

## Your tasks (ordered)

1. **Commit + PR** property-brief slice only (verify with `git diff` — worktree mixes encumbrances, GTM schema, design-tools panel).
2. **Deploy gates** — apply `0030` on prod + staging Postgres; redeploy `cortex-api` per [`90_runbooks/property_brief_cortex_deploy.md`](../90_runbooks/property_brief_cortex_deploy.md).
3. **Fixture refresh** — `cd lib/db && pnpm db:push:test && pnpm db:dump:test-fixture`.
4. **Neon warmup** — export substrate `code_atoms` for `engine_only` keys; operator runbook step in `90_runbooks/`.
5. **`atom_events`** — append `property-workspace.created` / `brief-run.generated` via `PostgresEventAnchoringService` (mirror `parcelBriefings.ts`).
6. **Register brokerage atoms** on `artifacts/api-server/src/atoms/registry.ts` when contract pin allows.
7. **Substrate MCP path** — optional `BRIEF_CODE_RETRIEVAL=mcp|neon` env for `retrieveAtomsForQuestion`.
8. **Integration test** — second `/brief` same coords does not call Regrid when snapshots exist (requires `DATABASE_URL`).

## Acceptance

- Plano/Round Rock geocode → `*_tx` key; corpus empty until warmed.
- `atoms.inlineRefs` max 3 code + parcel when Regrid ok.
- Second `/brief` same address: 0 Regrid HTTP on repeat (snapshots + cache).
- Fixture drift cleared after migration.
- PR held for operator merge.

## Do NOT

- Paywall / Stripe
- Enterprise Regrid endpoints
- Dallas city corpus mapping

## Report back

`P:/doc_repo/_inbox/2026-05-28_legacy-design-tools_cc-agent-C_place-graph-brief_close.md`

Include PR URL, branch SHA, migration apply evidence, test output, blockers verbatim.
