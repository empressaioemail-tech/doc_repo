---
decision_id: 2026-08-24_plan_review_engine_home_r_d
date: 2026-08-24
owner: nick
status: provisional
verification_pending:
  - Operator ratifies `_inbox/2026-08-24_adr023_amendment_draft.md` or edits it
  - ADR-023 body updated in place after ratification
related_canonical:
  [
    80_adrs/adr_023_cortex_reporting_repo_designation,
    _inbox/2026-08-24_govtech_program_scope,
    _inbox/2026-08-24_govtech_engine_migration_plan,
    80_adrs/adr_008_engine_factor_out,
  ]
---

## Decision

The city plan review finding engine is product logic in `empressaioemail-tech/plan-review`, not in `hauska-engine` or `legacy-design-tools`, superseding ADR-023's single-home designation for that function.

## Context

Nine-repo read-only scope pass (2026-08-24) found plan review reasoning on the read path fabricating citations while write paths refused. Ruling R-D collapses four homes in the right direction: Hauska stays substrate; Empressa owns plan review. ADR-023 still names `legacy-design-tools` as the engine home, which contradicts G-60 serving isolation and the migration plan already filed.

## Structural commitment check

ADR-008 (Hauska = substrate): **green** — engine leaves substrate repo.
MCP-first: **neutral** — migration does not block MCP tools.
Tenant sovereignty: **green** — no pooling change.

## Reasoning

The only production consumer of the finding engine today is `legacy-design-tools/api-server/routes/findings.ts`, but the **city product surface** already lives in `plan-review` (G-60, G-64). Keeping reasoning in `hauska-engine` misplaces Empressa product logic in the substrate layer. Moving it to `plan-review` aligns repo ownership with the govtech seat and the Wave 1 transaction contract. Architect surface (home A) stays deferred (R-J) as a separate client.

## Reversal criteria

Revisit if a measured migration shows the decoupling cost exceeds building a standalone function package in SmartCity OS (ADR-023 original reversal test), or if Wave 1 can ship with a documented temporary HTTP hop to engine-api and migration is explicitly deferred with a named sunset date.

## Dependencies

Depends on: `_inbox/2026-08-24_govtech_transaction_contract.md` (filed). Blocks: S2-1 execution, S2-7/8/9 full honesty path without interim engine hop.

## Counterparties

Internal: govtech seat (execution), property seat (engine-api, backfill), substrate seat (MCP meter).
