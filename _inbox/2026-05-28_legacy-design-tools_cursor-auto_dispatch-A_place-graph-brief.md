---
date: 2026-05-28
agent: cursor-auto (Cursor, cente workstation)
repo: legacy-design-tools
type: session
topic: dispatch_A_place_graph_brief_wave2
dispatch_to: _dispatches/2026-05-28_dispatch-A_ldt_place-graph-brief.md
assignee: cc-agent-C
---

# Dispatch A — LDT place graph + brief (wave 0–1 continue)

**Repo:** `P:/legacy-design-tools`  
**Branch:** sprint branch per orchestrator  
**Scope ref:** `_inbox/2026-05-28_doc_repo_cursor-auto_central-tx-property-brief_scope.md`

## Already landed (2026-05-28, uncommitted on cente worktree)

- Migration `0030_place_layer_snapshots.sql` + `brokerage_workspaces` geo columns
- `fetchBrokerageSiteContext`: snapshots → adapter cache → live
- Central TX geocode registry (`lib/codes/src/centralTexasPilot.ts`)
- `GET /api/brokerage/v1/coverage`
- `/brief` emits `atoms` projection (`workspaceDid`, `briefRunDid`, `placeLayers`, `inlineRefs`)

## Your tasks (continue)

1. **Commit + PR** property-brief slice only (see planning kickoff §8 git hygiene — mixed working tree).
2. **Neon warmup** — export substrate `code_atoms` for `engine_only` keys; operator runbook step in `90_runbooks/`.
3. **`atom_events`** — append `property-workspace.created` / `brief-run.generated` via `PostgresEventAnchoringService` (mirror `parcelBriefings.ts`).
4. **Register brokerage atoms** on `artifacts/api-server/src/atoms/registry.ts` when contract pin allows.
5. **Substrate MCP path** — optional `BRIEF_CODE_RETRIEVAL=mcp|neon` env for `retrieveAtomsForQuestion`.
6. **Integration test** — second `/brief` same coords does not call Regrid when snapshots exist (requires `DATABASE_URL`).

## Acceptance

- Plano/Round Rock geocode → `*_tx` key; corpus empty until warmed.
- `atoms.inlineRefs` max 3 code + parcel when Regrid ok.
- Fixture drift: after migration, run `lib/db` `db:push:test` + `db:dump:test-fixture`.
- Deploy: apply `0030` on prod Postgres before traffic.

## Do NOT

- Paywall / Stripe
- Enterprise Regrid endpoints
- Dallas city corpus mapping
