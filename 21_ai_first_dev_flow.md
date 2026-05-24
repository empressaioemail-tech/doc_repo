---
id: 21_ai_first_dev_flow
title: AI-first dev flow
status: active
last_updated: 2026-05-23
applies_to: portfolio
related: [20_agent_operating_rules, 21b_cursor_workflow_observatory, 21c_grok_atom_migration_plan, 01a_atom_conventions, 22_workstation_inventory]
---

# AI-first dev flow

How work gets done across the portfolio. Captures the agent fleet, who
owns what, the standard work cycle, and how documentation flows through
session summaries back into canonical docs. Pairs with
[`20_agent_operating_rules.md`](20_agent_operating_rules.md) (the rules
the fleet operates under, including HR-12 Grok + atom-first),
[`01a_atom_conventions.md`](01a_atom_conventions.md) (portfolio atom
catalog), and [`22_workstation_inventory.md`](22_workstation_inventory.md)
(the machine-specific paths and tooling).

Observed May 2026 behavior is documented in
[`21b_cursor_workflow_observatory.md`](21b_cursor_workflow_observatory.md).

## The fleet

Named cc-agents plus the doc_repo planner work the portfolio. Not all
are active at once. Default execution model per HR-12: **Grok** in Cursor
(`Grok Build 0.1` for agentic multi-file work; `grok-code-fast-1` for
speed); Claude only on explicit escalation.

| Agent | Surface | Primary role | Default model | Ships code |
|---|---|---|---|---|
| **planner** | Cursor in `P:\doc_repo` | Strategy, dispatches, `_inbox` sweep, session close, canonical doc commits | Grok Build 0.1 | Docs only (commits to doc_repo) |
| **rendering planner** (second doc_repo session) | Cursor in `P:\doc_repo` | Rendering sprint docs (40e); does not sweep `_inbox/` or edit `00` | Grok Build 0.1 | Docs only (scoped) |
| **cc-agent-C** | Cursor, `P:\legacy-design-tools` | Cortex QA build, adapters, Codex Phase 2 surfaces | Grok Build 0.1 | Yes |
| **cc-agent-C2** | Cursor, `P:\legacy-design-tools-c2` | Site context 2D (DEM, Regrid, topography) | Grok Build 0.1 | Yes |
| **cc-agent-R** | Cursor, `P:\legacy-design-tools-r` | Rendering parity sprint (40e) | Grok Build 0.1 | Yes |
| **cc-agent-E** | Cursor, `hauska-engine` clone | Sync 5 Texas ingest, ICC prebuild | Grok Build 0.1 | Yes |
| **cc-agent-M** | Cursor, `smartcity-os` | M-Stabilize (on hold 2026-05-21) | Grok Build 0.1 | Yes |
| **cc-agent-AC** | (dormant) | Atom contract migration complete | — | — |
| **cursor-manual** | Cursor terminal (Nick) | Human-in-loop fixes, ambiguous ops | N/A | Yes (deliberate) |
| **replit-agent** | Replit Repl | In-IDE exploration, Repl-local ops | N/A | No (per HR-2) |
| **Nick** | Everywhere | Merge, deploy, binary decisions | N/A | Yes (sole merge authority) |

**~7 working seats** including Nick. Retired: `cc-agent-D` (invented name,
2026-05-22). Legacy IDs `cc-agent-1` through `cc-agent-4` appear in older
sessions and dispatches; map to named agents per
[`21b_cursor_workflow_observatory.md`](21b_cursor_workflow_observatory.md).

Browser Claude.ai planner sessions are legacy for ad-hoc strategy; the
executing planner lives in doc_repo and commits directly per
[`CLAUDE.md`](CLAUDE.md).

## Per-repo Cursor workspace

One Cursor workspace per active working repo, often **multiple clones per
repo** for parallel agents (see
[`90_runbooks/agent_workspace_hygiene.md`](90_runbooks/agent_workspace_hygiene.md)):

| Path | Agent(s) |
|---|---|
| `P:\doc_repo` | planner, rendering planner |
| `P:\legacy-design-tools` | cc-agent-C |
| `P:\legacy-design-tools-c2` | cc-agent-C2 |
| `P:\legacy-design-tools-r` | cc-agent-R |
| `P:\smartcity-os` (or `P:\empressaio_tech_smartcity-os`) | cc-agent-M |
| `hauska-engine` clone | cc-agent-E |
| `p:\legacy-revit-sensor` | as needed |

Each cc-agent runs in an **isolated clone** with a branch prefix
(`cortex/`, `2d/`, `render/`, `stream-1d/`). Shared working trees between
agents are forbidden.

## The doc_repo planner role

The planner runs in Cursor on `P:\doc_repo` (Grok default per HR-12).
It holds portfolio context via [`00_current_state.md`](00_current_state.md),
canonical docs, dispatches, and decision records.

What the planner does:

- Resolves and maintains portfolio atoms per
  [`01a_atom_conventions.md`](01a_atom_conventions.md)
- Drafts cc-agent dispatches (paste-ready; template at
  [`_dispatches/_template.md`](_dispatches/_template.md))
- Sweeps `_inbox/` (QA planner only when two planners run)
- Regenerates `00_current_state.md` at session close
- Writes and commits canonical docs after Nick reviews the plan
- Files `_decisions/` with reversal criteria on load-bearing calls

What product cc-agents do NOT do:

- Edit canonical docs directly (HR-11 courier pattern)
- Merge PRs or deploy (Nick)

Two-planner split (2026-05-22): QA planner owns `_inbox/` + `00`;
rendering planner owns 40e docs only.

## Standard work cycle

Per [`20_agent_operating_rules.md`](20_agent_operating_rules.md) SR-3
(recon-only first when ambiguous):

0. **Atom resolve (new).** Planner lists named atoms in the dispatch
   (`current-state:portfolio`, `sprint:40e`, `qa-backlog-item:QA-32`, etc.).
   cc-agent reads atom summaries from the catalog in
   [`01a_atom_conventions.md`](01a_atom_conventions.md) before full
   canonical docs. Deep docs follow only when atoms are insufficient.
1. **Recon.** Planner drafts a read-only recon prompt. Nick pastes into
   a cc-agent Cursor session (Grok). Agent returns verbatim verification
   artifacts (HR-8) and findings.
2. **Triage.** Planner reads the recon report, decides next action.
3. **Execute.** Planner drafts the execute prompt with stage-gates.
   Nick pastes; cc-agent works (Grok Build 0.1 default).
4. **PR open.** Agent pushes and runs `gh pr create`. PR held for Nick.
5. **Review.** Planner or operator reads diff.
6. **Merge.** Nick squash-merges via GitHub web UI.
7. **Deploy.** Nick or agent-runnable workflow (`cloud-run-deploy.yml`
   on legacy-design-tools). Planner inlines probes per HR-3.
8. **Verify.** Curl probe or live UI verify before "done."
9. **Report.** Agent drops summary to `_inbox/` or `_sessions/` (HR-11).
   Include atom refs touched and model used if escalated from Grok.

## Tool access map

| Tool | Planner | cc-agent (Grok) | Cursor manual | Replit Agent | Nick |
|---|---|---|---|---|---|
| `git` push to origin | Yes (doc_repo) | Yes | Yes | Effectively no (HR-2) | Yes |
| `gh pr create` | No | Yes | Yes | No | Yes |
| `gh pr merge` | No | No | No | No | Yes |
| GitHub web UI | Yes | Via `gh` | Yes | No | Full |
| `gcloud` | Yes (doc_repo) | Yes | Yes | No | Yes |
| `doc_repo` canonical write | Yes (after plan review) | No (HR-11) | Session summaries | `_inbox/` only | Rollups |
| Atom catalog | Owns synthesis | Consumes | — | — | — |

## Documentation flow

Read access:

- cc-agents read `..\doc_repo` from product clones.
- Prefer atom refs from [`01a_atom_conventions.md`](01a_atom_conventions.md)
  over full-doc reads when dispatch lists them.

Write access:

- cc-agents: `_inbox/` or `_sessions/` only (HR-11).
- Planner: canonical docs, `_decisions/`, `_dispatches/`, `00_current_state.md`.
- Session summaries include `related_refs` atom list when applicable.

## Fleet sizing rationale

Why ~7 seats and not more:

- **Adding agents past ~7** increases coordination overhead (workspace
  collisions, migration numbering, `00` merge conflicts).
- **Multiple clones per repo** (C, C2, R on legacy-design-tools) replace
  the old "4 anonymous agents in one workspace" pattern.
- **Specialize by named agent**, not by adding seats. Replit Agent is
  scoped separately for UI overhaul experiments (2026-05-23).

## Routing decisions — what goes where

- **Code change that needs to ship** — named cc-agent on isolated clone
  (Grok default). Never Replit Agent (HR-2, SR-1).
- **Doc rollup / strategy / dispatch** — doc_repo planner (Grok).
- **In-Repl exploration** — Replit Agent.
- **Merge / deploy / secrets** — Nick.
- **Atom missing from catalog** — cc-agent asks planner; planner extends
  `01a` or files decision.

When routing is unclear, planner asks before dispatching.

## Model policy (HR-12 summary)

| Task type | Default model |
|---|---|
| Multi-file dispatch, autonomous loops | Grok Build 0.1 |
| Focused code, tests, small patches | grok-code-fast-1 |
| Heavy reasoning / architecture deadlock | grok-4.3 or grok-4.20-reasoning |
| Grok failure after escalation | Claude (logged in session summary) |

Cursor config: base URL `https://api.x.ai/v1`. Product runtime LLMs
(Cortex api-server Anthropic Sonnet) are separate; see
[`_research/2026-05-23_cortex_ai_model_inventory.md`](_research/2026-05-23_cortex_ai_model_inventory.md).

## What's coming next (deferred items)

- **ECI atomization P1/P2** — machine-readable doc_repo atom registry
  in `@empressaio/atom-internal`
- **GitHub MCP for planner** — replaces manual doc sync
- **Neon MCP for Cursor agents** (post-Empressa-Neon migration)
- **Devcontainer for workstation parity**
- **Phase 3 Grok migration** — fleet behavior, expand atom catalog
  ([`21c_grok_atom_migration_plan.md`](21c_grok_atom_migration_plan.md))

## What this document is NOT

Not runbooks — see [`90_runbooks/`](90_runbooks/). Not hard rules — see
[`20_agent_operating_rules.md`](20_agent_operating_rules.md). Not observed
behavior — see [`21b_cursor_workflow_observatory.md`](21b_cursor_workflow_observatory.md).

## Revision history

- **2026-05-11 (origin):** fleet and work-cycle baseline.
- **2026-05-23:** Phase 2 Grok + atom-first reconciliation. Named agents,
  dual planner, Grok defaults (HR-12), atom-resolve dispatch step, multi-clone
  map per 21b.
