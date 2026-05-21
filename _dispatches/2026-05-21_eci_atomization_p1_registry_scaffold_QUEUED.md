---
id: 2026-05-21_eci_atomization_p1_registry_scaffold_QUEUED
title: Dispatch (QUEUED, not active) — ECI atomization P1 registry scaffold
date: 2026-05-21
agent: TBD
repo: empressa-atom-internal
kind: dispatch
related: [60a_eci_atomization_sprint, 60_eci_atomization, _decisions/2026-05-18_eci_registry_naming, 20_agent_operating_rules, CLAUDE.md]
---

# QUEUED dispatch — ECI atomization P1 registry scaffold

> **This dispatch is QUEUED, not active.** It is filed ready-to-fire so the work is teed up, not lost. Do not start it until both activation gates below clear. The planner assigns the agent and fires it at that point.

## Activation gates

Both must clear before this fires:

1. **Repo exists.** Nick creates `empressaioemail-tech/empressa-atom-internal` (a Nick action per [`_decisions/2026-05-18_eci_registry_naming.md`](../_decisions/2026-05-18_eci_registry_naming.md)).
2. **Capacity.** A cc-agent seat frees up. As of 2026-05-21 all four cc-agents have deep queues (M-Stabilize, Lane E, and the legacy-design-tools lane). Per the 2026-05-21 allocation call, ECI P1 queues behind the Hauska commercialization spine: ECI is the internal dogfood instance, not Hauska commercialization, so the Hauska-spine rule and the focus-queue rule put spine work first. No fifth cc-agent seat is opened for it now.

## Scope

ECI atomization P1, the minimum-viable registry, exactly per [`60a_eci_atomization_sprint.md`](../60a_eci_atomization_sprint.md) Phase P1. That plan is the authoritative scope and this dispatch does not restate it: bootstrap `empressa-atom-internal`, register all twelve v1 atom types against the contract's typed `register()` signature, Zod schemas, render-mode stubs, ADR-017 accessPolicy at register-time, ADR-015 actor-link fields, ADR-013 procedure-execution chain with the v1 purpose-field rider, and the conformance suite. Exit: all twelve atom types pass conformance, CI green.

The ADR-015 / ADR-017 dependency that 60a named is satisfied: both ADRs are accepted (2026-05-16; the stale "proposed" status in `60_eci_atomization.md` was corrected 2026-05-21).

Contract dependency note: 60a P1 specifies a path-pin dev dependency on the workspace-private contract at `legacy-design-tools/lib/empressa-atom/`. `@hauska/atom-contract@1.0.0` is now published on npm (Sync 1, 2026-05-19), so P1 can depend on the published package directly. Confirm with the planner at fire time whether to path-pin or consume the npm package; this simplifies the P1-to-P3 transition either way.

## When fired

The planner assigns the cc-agent, confirms the `empressa-atom-internal` repo exists, fills the `agent:` frontmatter field, renames this file to drop the `_QUEUED` suffix, and updates the `60a_eci_atomization_sprint.md` P1 status line.

## Reporting

At every session break-point, write your session summary and any decision-relevant finding to `P:\doc_repo\_inbox\` as `<date>_empressa-atom-internal_<agent>_<topic>.md`. The `_inbox/` write is the one explicitly permitted cross-repo write per HR-11 in [`20_agent_operating_rules.md`](../20_agent_operating_rules.md). Do not commit to the doc repo. Keep committing the original in your own repo.
