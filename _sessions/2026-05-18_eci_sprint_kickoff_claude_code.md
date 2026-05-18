---
id: 2026-05-18_eci_sprint_kickoff_claude_code
title: Session — ECI atomization sprint kickoff (60a; registry naming + repo placement)
date: 2026-05-18
agent: claude_code
repo: docs
session_type: planning
rolled_up: true
rolled_up_into: [60a_eci_atomization_sprint, _decisions/2026-05-18_eci_registry_naming, 60_eci_atomization, 80_adrs/adr_018_atom_contract_substrate_layer, CLAUDE.md, 00_current_state]
---

## What was done

Resumed the ECI atomization sprint kickoff that opened the 2026-05-18 evening session and was deferred behind substrate v1 sprint work earlier this turn. Two paired decisions ratified after premortem and catalog-thesis checks both cleared. First, `@empressaio/atom-internal` confirmed as the canonical package name for the ECI internal atom registry. Second, dedicated repo at `empressaioemail-tech/empressa-atom-internal` decided as the home for the registry's source code (mirrors the 2026-05-18 hauska-mcp-server precedent).

Produced sprint plan doc at [`60a_eci_atomization_sprint.md`](../60a_eci_atomization_sprint.md). Twelve-atom-type inventory enumerated (actor-record, procedure-execution, decision-record, sprint-item, open-question, commercial-record, lead-record, knowledge-document, knowledge-chunk, conversation-record, meeting-extraction, daily-update) with source-of-truth, net-new vs existing, and accessPolicy per atom. Four-phase structure: P0 decisions (this session); P1 minimum-viable registry (pre-M2-C feasible via path-pin to workspace-private contract); P2 backfill of [`_decisions/`](../_decisions/), [`_sessions/`](../_sessions/), and ECI Replit DB (pre-M2-C); P3 M2-C sync plus internal MCP wiring (post-M2-C; gated on cc-agent-2 publishing `packages/atoms/` plus planner-coordinated Bump 1).

Combined decision record at [`_decisions/2026-05-18_eci_registry_naming.md`](../_decisions/2026-05-18_eci_registry_naming.md) covers both decisions with reasoning, structural-commitment checks, three rejected alternatives for repo placement, and per-decision reversal criteria.

Bonus cleanup: removed the stale What-is-open bullet about per-product MCP surfaces tier model from CLAUDE.md (resolved 2026-05-16 per [`29_mcp_surface_tier_model.md`](../29_mcp_surface_tier_model.md); 00 watch list already showed it as resolved).

## What was learned

ECI P1 and P2 are pre-M2-C feasible. The atom contract is workspace-private at `legacy-design-tools/lib/empressa-atom/` as `@workspace/empressa-atom`; the ECI registry can dev-time-pin to that via `file:../legacy-design-tools/lib/empressa-atom` while M2-C extraction is in flight. This means three of four phases can land before substrate v1 Bump 1 ships, which is good sprint-parallelism for the ECI work.

The 60_eci_atomization spec already self-referenced `60a_eci_atomization_sprint.md` as the future executable plan slot. Producing the sprint plan at 60a matched the convention without inventing a new slot.

`accessPolicy` per ADR-017 for ECI atoms is constrained to `platform-internal` or `tenant-private` only. ECI atoms never carry `public-free` or `public-paid`; the internal MCP endpoint at `mcp.internal.hauska.dev` is non-commercial per [`29_mcp_surface_tier_model.md`](../29_mcp_surface_tier_model.md). This simplifies the registry's enforcement story.

## What's still open

Nick to create the `empressaioemail-tech/empressa-atom-internal` repo when ready to start P1 (mirrors the 2026-05-18 hauska-mcp-server bootstrap pattern). The cc-agent allocation for ECI P1 is a separate session decision; current substrate v1 dispatch (four cc-agents doubled across eight streams per [`_decisions/2026-05-18_substrate_v1_dispatch_allocation.md`](../_decisions/2026-05-18_substrate_v1_dispatch_allocation.md)) saturates the fleet, so ECI P1 dispatch either reuses a cc-agent after their substrate v1 work stabilizes or expands to a fifth agent.

P3 timing depends on cc-agent-2's Stream 1B work (publishes `hauska-engine/packages/atoms/`) and the planner-coordinated Bump 1 cross-repo PR rollout that publishes `@hauska/atom-contract@1.0.0`. Neither has started; both wait on substrate v1 sprint progress.

Internal MCP endpoint codebase decision (separate codebase vs reuse hauska-mcp-server with separate-tenant config) deferred to P3 scoping. The recommendation in [`60_eci_atomization.md`](../60_eci_atomization.md) Open questions is a separate endpoint; final call lives in P3 design.

ADR-016 intent atoms remain deferred. The v1 purpose-field rider on procedure-execution atoms covers v1 intent semantics; promotion to a dedicated intent-record atom type happens only if usage patterns justify post-P3.

## Suggested canonical doc updates

All applied this session.

- `60a_eci_atomization_sprint.md` (new): sprint plan.
- `_decisions/2026-05-18_eci_registry_naming.md` (new): combined decision record for package name plus repo placement.
- [`CLAUDE.md`](../CLAUDE.md): What-is-settled gains ECI ratification bullet; What-is-open loses the stale tier-model bullet (cleanup).
- [`60_eci_atomization.md`](../60_eci_atomization.md): Routing decisions section flips "Likely `60a_eci_atomization_sprint.md` when scoped" to definitive pointer at 60a plus decision-record link; Open questions ECI sprint slot item resolved; `related` field gains 60a, ADR-013, ADR-018, decision record; status flips from draft to active; revision history; `last_updated` bump.
- [`80_adrs/adr_018_atom_contract_substrate_layer.md`](../80_adrs/adr_018_atom_contract_substrate_layer.md): Neutral section flips "is unchanged by this ADR" framing to ratification pointer; `related` field gains 60a; revision history.
- [`00_current_state.md`](../00_current_state.md): §5 prepends this session, drops oldest 2026-05-18 entry to maintain "last 5" cap; §6 gains a new ECI atomization watch entry.
