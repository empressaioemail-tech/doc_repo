---
id: 2026-05-21_cc-agent-M_m_stabilize_restart
title: Dispatch — cc-agent-M M-Stabilize restart (smartcity-os)
date: 2026-05-21
agent: cc-agent-M
repo: smartcity-os
kind: dispatch
related: [30a_smartcity_stabilization_sprint, 11_roadmap, 00_current_state, 12_migration_sprint, 20_agent_operating_rules, CLAUDE.md]
---

# cc-agent-M dispatch — M-Stabilize restart

> **CLEARED TO FIRE (2026-06-06).** The 2026-05-21 operator hold is
> released. The precondition-probe verdict and Empressa Neon target
> provisioning are recorded in
> [`30a_smartcity_stabilization_sprint.md`](../30a_smartcity_stabilization_sprint.md)
> Status tracking. The migration target secret is
> `smartcity-EMPRESSA_DATABASE_URL` (direct endpoint, `us-east-2`) on
> `smartcity-os-prod`; the existing `smartcity-DATABASE_URL` stays on the
> Replit-managed source until the 2B cutover. Run posture below is
> unchanged: operator-supervised, open PRs for review, no self-deploy to
> production.

You are cc-agent-M, reassigned from the now-complete Lane M (`hauska-mcp-server`) to the `smartcity-os` repo for the M-Stabilize restart. The SmartCity OS stabilization sprint [`30a_smartcity_stabilization_sprint.md`](../30a_smartcity_stabilization_sprint.md) has been parked with no owner since 2026-05-11. Restarting it is the roadmap catch-up. M-Stabilize Phase 2C closure gates the ADR-008 engine factor-out and the M-PropIntel milestone.

## Run posture

Operator-supervised, not maximum-autonomy. Open PRs for review. Do not self-deploy to `smartcity-os` production.

## Step 1 — re-orient

`smartcity-os` has had no sprint work for ten-plus days. Before executing anything, verify current state and report it:

- Read `30a_smartcity_stabilization_sprint.md` in full.
- Verify the live production Cloud Run revision against the doc. `00_current_state.md` names `smartcity-api-00104-taw`; confirm it.
- Confirm 30a's WS-1, WS-3, and WS-4 scoping still holds against the actual repo. Flag any drift before proceeding.

Per HR-1 and HR-8 in [`20_agent_operating_rules.md`](../20_agent_operating_rules.md), include verbatim `git log` and `gh pr list` output in the re-orientation report.

## Step 2 — WS-1, migration spine

The foundation workstream: migration Phase 2A, 2B, 2C, plus Phase 3 (Drizzle migrate adoption, ADR-006). WS-1 runs first because Phase 2C closure is what unblocks the engine factor-out and M-PropIntel.

## Step 3 — WS-3 then WS-4

WS-3, the security sweep remainder. Then WS-4, schema and multi-tenancy (ADR-005). Both sequence after WS-1.

## Workspace ownership

cc-agent-M owns the `smartcity-os` working tree for this dispatch. This supersedes cc-agent-M's prior `hauska-mcp-server` assignment, which is complete. Cross-repo work uses `git worktree add` from a separate clone.

## Reporting

At every session break-point, write your session summary and any decision-relevant finding to `P:\doc_repo\_inbox\` as `<date>_smartcity-os_cc-agent-M_<topic>.md`. Do not commit to the doc repo or edit anything outside `_inbox/`. Keep committing the original in your own repo. This is HR-11 per [`20_agent_operating_rules.md`](../20_agent_operating_rules.md).
