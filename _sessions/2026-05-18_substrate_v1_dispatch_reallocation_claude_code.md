---
id: 2026-05-18_substrate_v1_dispatch_reallocation_claude_code
title: Session — substrate v1 dispatch reallocation (per-repo single-agent; @hauska/atom-contract dedicated repo)
date: 2026-05-18
agent: claude_code
applies_to: portfolio
related: [51_substrate_v1_sprint, 00_current_state, CLAUDE.md, _decisions/2026-05-18_substrate_v1_dispatch_reallocation, _decisions/2026-05-18_substrate_v1_dispatch_allocation, _decisions/2026-05-18_substrate_v1_phase_0_close]
---

# Substrate v1 dispatch reallocation

## Hand-off context

Sixth Claude Code session in `doc_repo` on 2026-05-18. The prior four 2026-05-18 commits landed Phase 0 close (`c37893f`), hauska.dev registered follow-on (`ec08d67`), substrate v1 dispatch allocation with four cross-repo doubled cc-agents and four pasteable kickoff prompts (`3321e4b`), and ECI atomization sprint kickoff (`b8d02f3`). The earlier same-day fifth session diagnosed the BeWith iCal outage and shipped smartcity-os PR #18 (`ce61807` plus `2ceb333`).

This session was a hand-off takeover. Nick reviewed the four dispatch prompts I produced in the prior session and surfaced that the cross-repo doubling axis was structurally incompatible with Cursor's execution model: each Cursor terminal holds one repo; a single Claude Code agent cannot work across two repos in parallel. The prior allocation assigned each cc-agent across both `hauska-engine` AND `hauska-mcp-server`. Wrong shape.

Nick also asked where `@hauska/atom-contract` should live as a source repo. ADR-018 named it as the M2-C extraction target and framed it as peer Hauska substrate but did not explicitly settle source-repo placement; current location is workspace-private inside `legacy-design-tools/lib/empressa-atom/`.

## What this session did

Two paired decisions reshaped the substrate v1 sprint dispatch.

**Decision 1.** Per-repo single-agent ownership replaces the prior cross-repo doubling. Planner (doc_repo) keeps Bump 1 cross-repo PR rollout plus sync points 4 and 5 launch gates. cc-agent-AC owns the new `empressaioemail-tech/hauska-atom-contract` repo (Nick to create; M2-C extraction plus `@hauska/atom-contract@1.0.0` publication). cc-agent-E owns all of Track 1 in `hauska-engine` (Streams 1A through 1D sequentially per within-track sync points). cc-agent-M owns all of Track 2 in `hauska-mcp-server` (Streams 2A through 2D against mocks until Sync 3 then real wiring). Four-terminal map: doc_repo (planner), hauska-atom-contract (cc-agent-AC), hauska-engine (cc-agent-E), hauska-mcp-server (cc-agent-M). Consumer-only pin-update PRs against legacy-design-tools, smartcity-os, legacy-revit-sensor remain planner-owned coordination (no dedicated cc-agent terminal needed for them).

**Decision 2.** `@hauska/atom-contract` source-repo placement ratified as a dedicated repo at `empressaioemail-tech/hauska-atom-contract`. Follows the 2026-05-18 hauska-mcp-server dedicated-repo precedent (`_decisions/2026-05-18_hauska_mcp_server_dedicated_repo.md`) and the 2026-05-18 ECI atomization `@empressaio/atom-internal` dedicated-repo precedent (`_decisions/2026-05-18_eci_registry_naming.md`). Substrate-shape does not fit naturally inside any product repo; published-consumer story is cleaner from day one.

Three reasons the per-repo allocation lands cleaner than within-repo doubling (the middle-ground option considered). First, single linear branch history per repo eliminates the within-repo coordination cost between parallel agents touching adjacent files. Second, the workspace hygiene risk class documented at `00_current_state.md` §6 (four wrong-branch / detached-HEAD / shared-working-tree incidents across cc-agent-1/2/3 in the smartcity sprint) disappears under per-repo single-agent ownership. Third, the Claude-Code-in-repo strategic-agent pattern adopted 2026-05-16 (proven across five sessions per `00_current_state.md` §6) is the natural shape for sprint-scoped per-repo ownership.

Counterweight: the 51-design eight-way parallelism contracts to four-way. Track 1 sync points 2 and 3 plus storage-from-atoms dependency already serialize most within-track Track 1 work. Track 2 streams all proceed against mocks until Sync 3 per `51_substrate_v1_sprint.md` §Sync points, so cc-agent-M's sequential ownership within hauska-mcp-server is a clean fit. Net timeline loss small; lean-shop posture wins.

## Files produced or modified

New artifacts:

- `_decisions/2026-05-18_substrate_v1_dispatch_reallocation.md` — combined decision record (per-repo allocation plus `@hauska/atom-contract` dedicated-repo placement); supersedes `_decisions/2026-05-18_substrate_v1_dispatch_allocation.md`.
- `_dispatches/2026-05-18_cc-agent-AC_hauska_atom_contract.md` — kickoff prompt for the M2-C extraction agent. Four-phase scope (bootstrap; port workspace-private contract; add nine Bump 1 atom types; publish v1.0.0). Drives Sync 1.
- `_dispatches/2026-05-18_cc-agent-E_hauska_engine.md` — kickoff prompt covering all four Track 1 streams (1A adapters and pipeline runner; 1B structural extraction and atomization and engine-side atom-instance registry; 1C storage, identity, retrieval API; 1D eval, curated queries, batch ingest, coverage dashboard, 3-county hard-kill checkpoint).
- `_dispatches/2026-05-18_cc-agent-M_hauska_mcp_server.md` — kickoff prompt covering all four Track 2 streams (2A backend coupling and tool surface; 2B auth, rate limit, Stripe; 2C logging, observability, dashboards; 2D deploy, docs, cross-client, launch).

Modified artifacts:

- `_decisions/2026-05-18_substrate_v1_dispatch_allocation.md` — `status: superseded`; `superseded_by` field added; top callout pointing at replacement decision.
- `_dispatches/2026-05-18_cc-agent-1_substrate_v1_1A_2A.md` — `status: superseded`; top callout pointing at cc-agent-E and cc-agent-M prompts.
- `_dispatches/2026-05-18_cc-agent-2_substrate_v1_1B_2B.md` — same.
- `_dispatches/2026-05-18_cc-agent-3_substrate_v1_1C_2C.md` — same.
- `_dispatches/2026-05-18_cc-agent-4_substrate_v1_1D_2D.md` — same.
- `51_substrate_v1_sprint.md` — Status-posture line at top updated to per-repo allocation framing; Phase 0 close pointer block updated to point at the reallocation decision plus the three new dispatch prompts; Track 1 framing line updated (`Four streams in hauska-engine, all owned by cc-agent-E`); Track 2 framing line updated; revision-history entry added for the reallocation.
- `00_current_state.md` — §4 agent fleet line rewritten to per-repo allocation (cc-agent-AC, cc-agent-E, cc-agent-M plus planner); §6 Hauska MCP Server v1 watch entry rewritten to reflect the reallocation and the dedicated-repo placement for `@hauska/atom-contract`.
- `CLAUDE.md` — Substrate v1 dispatch paragraph in "What is settled" rewritten; ECI atomization paragraph updated to point at cc-agent-AC publishing `@hauska/atom-contract@1.0.0` plus cc-agent-E shipping engine-side `packages/atoms/` (replacing the prior cc-agent-2 reference).

## Outstanding

- Nick creates `empressaioemail-tech/hauska-atom-contract` GitHub repo before cc-agent-AC starts. The kickoff prompt at `_dispatches/2026-05-18_cc-agent-AC_hauska_atom_contract.md` assumes the empty repo exists.
- Nick pastes the three new kickoff prompts into respective Cursor sessions (one each for the three non-planner cc-agents).
- Power BI cutover runbook addendum at `90_runbooks/cutover_env_var_bind_procedure.md` retains uncommitted local modifications from another agent's 2026-05-18 PBI CIP outage work; references `91_postmortems/2026-05-18_pbi_cip_shared_dataset_workspace_qualifier.md` which still does not exist in the tree. Surfaced in session-open status. Not this agent's work to commit; loose end belongs to the other agent.
- ECI P1 dispatch prompt drafting is a future-session task. Gates on Nick creating `empressaioemail-tech/empressa-atom-internal` repo; cc-agent allocation decision is its own session.
- Bump 1 cross-repo PR coordination becomes active once cc-agent-AC publishes `@hauska/atom-contract@1.0.0`. Planner will open five single-PR-per-repo pin updates atomically.

## Lessons or refinements

The cross-repo doubling allocation that landed in the prior session passed the catalog-thesis check and the premortem at the abstract level (each cc-agent's pair was thematically coherent) but missed an execution-environment constraint (one Cursor terminal per repo). Two refinements worth carrying forward.

First, premortem-check should explicitly include an execution-environment row: "does this allocation map to the actual terminal-and-process topology operator works in." The Hauska spine rule and the focus queue rule both checked clean for the prior allocation; the topology constraint was orthogonal. For per-agent dispatching decisions specifically, asking "where does each agent's process actually live" is a load-bearing check.

Second, when reading hand-off context from a prior agent, look for "current design" framings that compress an implementation assumption. The prior agent's hand-off note ("Each cc-agent in my four-agent doubling allocation works across both repos for their two streams; that's the current design") encoded the structural mismatch in one parenthetical. Surfacing was operator-driven, not agent-driven.

The fact that the four dispatch prompts each carried `repo: hauska-engine + hauska-mcp-server` in frontmatter was itself a red flag in retrospect; frontmatter `repo` is typically a single value across the rest of the corpus. A frontmatter-shape lint on new artifact types could catch this class.
