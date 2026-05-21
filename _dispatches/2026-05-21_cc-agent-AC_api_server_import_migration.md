---
id: 2026-05-21_cc-agent-AC_api_server_import_migration
title: Dispatch — cc-agent-AC api-server import migration to @hauska/atom-contract
date: 2026-05-21
agent: cc-agent-AC
repo: legacy-design-tools
kind: dispatch
related: [25_atom_architecture_reference, 16_commercialization_roadmap, 80_adrs/adr_018_atom_contract_substrate_layer, 20_agent_operating_rules, CLAUDE.md]
---

# cc-agent-AC dispatch — api-server import migration

You are cc-agent-AC. This dispatch migrates the `legacy-design-tools` api-server's atom-contract imports from the workspace-private `@workspace/empressa-atom` to the published `@hauska/atom-contract`. It is the one named can-kick carried forward from the 2026-05-19 doc-sweep per CLAUDE.md.

## Activation gate

Fires after your QA-17 framework-proving pass is complete and its PR is open for review. Same `legacy-design-tools` clone you used for QA-17; no new clone. cc-agent-C may be running QA-22 or the codex-reviewer-qa scaffold in the other clone; keep file overlap at zero, as in the QA-17 dispatch.

## Why this exists

`@hauska/atom-contract@1.0.0` was published to npm on 2026-05-19 (substrate v1 Sync 1). The `legacy-design-tools` api-server still imports the atom contract from the workspace-private staging copy `@workspace/empressa-atom` at `lib/empressa-atom/` (renamed from `@empressaio/atom` on 2026-05-18 per [ADR-018](../80_adrs/adr_018_atom_contract_substrate_layer.md)). The workspace-private path stays valid through the transition, so this is a clean, non-breaking migration, not a hard cutover. It is hygiene, not commercialization, per [`16_commercialization_roadmap.md`](../16_commercialization_roadmap.md).

## Scope

- Migrate the api-server's atom-contract dependency and imports from `@workspace/empressa-atom` to the published `@hauska/atom-contract`.
- Confirm the published package version matches the contract the api-server expects. If the published `@hauska/atom-contract` and the workspace-private `lib/empressa-atom/` have drifted, report the drift before migrating rather than papering over it.
- The workspace-private path stays valid through the transition. Do not remove `lib/empressa-atom/` itself: other workspace packages may still consume it. Verify which packages still import it and report; removing the staging package is a separate later step, not this dispatch.
- typecheck, build, and the api-server test suites green. Open a PR for review.

## Out of scope

- Removing or retiring the `lib/empressa-atom/` workspace package.
- Migrating other workspace consumers of `@workspace/empressa-atom` beyond the api-server. This dispatch is the api-server only; enumerate the rest in your session summary so the follow-on is scoped.

## Run posture

Operator-supervised, not maximum-autonomy. Open a PR for review. Do not self-deploy cortex-api.

## Workspace ownership

cc-agent-AC owns its dedicated `legacy-design-tools` clone. Branch under `import-migration/*`. If you enter a working directory and see another agent's uncommitted changes, stop and surface to the planner.

## Reporting

At every session break-point, write your session summary and any decision-relevant finding to `P:\doc_repo\_inbox\` as `<date>_legacy-design-tools_cc-agent-AC_<topic>.md`. The `_inbox/` write is the one explicitly permitted cross-repo write per HR-11 in [`20_agent_operating_rules.md`](../20_agent_operating_rules.md). Do not commit to the doc repo. Keep committing the original in your own repo.
