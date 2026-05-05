---
id: 21_ai_first_dev_flow
title: AI-first dev flow
status: active
last_updated: 2026-05-05
applies_to: portfolio
related: [20_agent_operating_rules, 22_workstation_inventory]
---

# AI-first dev flow

How work gets done across the portfolio. Captures the agent fleet, who
owns what, the standard work cycle, and how documentation flows through
session summaries back into canonical docs. Pairs with
[`20_agent_operating_rules.md`](20_agent_operating_rules.md) (the rules
the fleet operates under) and
[`22_workstation_inventory.md`](22_workstation_inventory.md) (the
machine-specific paths and tooling).

## The fleet

Six agents work the portfolio at various levels of engagement. Not all
are active at once.

| Agent | Surface | Primary role | Ships code |
|---|---|---|---|
| Claude.ai planner | Browser tab | Architecture, planning, prompt generation, cross-agent coordination, doc rollup | No — non-executing by design |
| `cc-agent-1` through `cc-agent-4` | Cursor (4 parallel) | Backend, SDK, GCP, code changes; soft specialization | Yes — origin push + `gh pr create` |
| `cursor-manual` | Cursor terminal (Nick at the keyboard) | Human-in-loop fixes, ambiguous cases, ops the agents can't reach | Yes — but slow; deliberate use |
| `replit-agent` | Replit Repl (per-repo, when one exists) | In-IDE exploration, runtime log inspection, DB queries via Replit Secrets | No — repl-local ops only per HR-2 |
| Comet browser | Nick driving | Browser-manual ops (Search Console, GoDaddy UI, screenshots) | No — no live credentials in agent context |
| Nick | Everywhere | Final say, merge button, deploy button, hardware keys | Yes — sole holder of merge + deploy authority |

**6 agents + Nick = 7 working seats.** This calibration is intentional.
Adding agents past this superlinearly increases coordination overhead
with diminishing throughput gains. Specializing one of the existing
agents harder is almost always the right move over adding a new one.

## Per-repo Cursor workspace

One Cursor workspace per active working repo:

- `p:\smartcity-os` — its own Cursor workspace
- `p:\legacy-design-tools` — its own
- `p:\legacy-revit-sensor` — its own
- `p:\doc_repo` — its own (this docs repo, lower-volume but worth its
  own workspace for rollup work)

Each workspace runs up to 4 Claude Code agents in parallel plus 1 Cursor
manual session for Nick's keyboard. Soft specialization within a
workspace:

- One agent on the dominant active workstream (e.g. the auth-fix sprint)
- One on independent recon or tests
- One on infrastructure / config / GCP
- One held in reserve or doing parallel-eligible work

Specialization is soft because the work shifts. The point is parallel
forward motion across independent codebases, not strict role boundaries.

## The Claude.ai planner role

The planner runs in a browser, separately from Cursor. It holds the
long-form planning context: project knowledge synced from `doc_repo`,
conversation history, and the cross-agent coordination layer.

What the planner does:

- Drafts agent prompts in fenced markdown blocks (Copy button) per the
  prompt-format convention
- Reviews PR diffs and comments back with approve / change requests
- Synthesizes recon reports across multiple agents into canonical doc
  patches
- Maintains the active-fires list and the migration sprint plan
- Resolves contradictions between agent reports per HR-1 (GitHub web
  UI as tiebreaker) and HR-8 (verbatim verification artifacts)

What the planner does NOT do:

- Push code, open PRs, merge PRs, run deploys
- Execute commands against any production system directly
- Generate output other than text + drafted prompts + doc patches

The planner stays browser-based deliberately. Adding execute capability
to the planner would collapse the architect / executor separation that
the verification chain depends on.

## Standard work cycle

Per [`20_agent_operating_rules.md`](20_agent_operating_rules.md) SR-3
(recon-only first when ambiguous):

1. **Recon.** Planner drafts a read-only recon prompt in a fenced
   block. Nick pastes into a Cursor Claude Code agent. Agent runs,
   returns verbatim verification artifacts (HR-8) and findings.
2. **Triage.** Planner reads the recon report, decides next action.
   Common branches: dispatch an execute prompt, ask follow-up recon,
   pause for Nick to clarify scope.
3. **Execute.** Planner drafts the execute prompt with explicit
   stage-gates (PAUSE for "go" before code changes; PAUSE before
   push; PAUSE before PR open). Nick pastes; agent works.
4. **PR open.** Agent runs `gh pr create` after pushing. PR sits
   open for review.
5. **Review.** Planner reads diff, comments. Nick weighs in if
   architecture or product decisions are involved.
6. **Merge.** Nick squash-merges via GitHub web UI. No agent merges.
7. **Deploy.** Nick deploys via Cloud Shell (or Replit dashboard for
   legacy-design-tools until migration). Planner inlines pre-deploy
   sync commands and post-deploy curl probes per HR-3 and PC-3.
8. **Verify.** Curl probe + 1-hour stability watch before any next
   deploy.
9. **Report.** Agent (or Nick, or planner) writes a session summary
   to `..\doc_repo\_sessions\<date>_<repo>_<agent>.md` per
   [`01_doc_conventions.md`](01_doc_conventions.md).

The planner watches for the failure modes named in HR-7 (three
deploys in 4 hours = stop) and PC-2 (third distinct failure =
escalate).

## Tool access map

Who has what access:

| Tool | Planner | Cursor CC | Cursor manual | Replit Agent | Nick |
|---|---|---|---|---|---|
| `git` push to origin | No | Yes | Yes | Effectively no (per HR-2) | Yes |
| `gh pr create` | No | Yes | Yes | No | Yes |
| `gh pr merge` | No | No (per rules) | No | No | Yes |
| GitHub web UI | Via screenshots | No direct | No direct | No direct | Full |
| `gcloud` | No | Yes (terminal) | Yes | No | Yes |
| GCP Cloud Shell | No | No | No | No | Yes |
| Neon Console | No | No | No | No | Yes (post-Empressa-migration) |
| Replit shell | No | No | No | Yes | Yes |
| Production DB | No | No | No | Yes (via secrets) | Yes |
| `doc_repo` read | Project knowledge sync | Sibling clone at `..\doc_repo` | Same | Same | Same |
| `doc_repo` write | Drafts patches inline | Session summaries to `_sessions/` | Session summaries | Session summaries | Rollups |

## Documentation flow

Read access:

- All Cursor agents read from `..\doc_repo` (sibling clone). They get
  full visibility into canonical docs by treating the path as part of
  their context.
- Claude.ai planner reads from project knowledge manually synced from
  `doc_repo`. GitHub MCP wiring (deferred) will eventually replace
  manual sync.

Write access:

- Agents never edit canonical docs directly (per
  [`01_doc_conventions.md`](01_doc_conventions.md)).
- Every working session ends with a session summary appended to
  `..\doc_repo\_sessions\<date>_<repo>_<agent>.md`. Frontmatter shape
  per the conventions doc.
- Rollup happens end-of-day or when a session reveals something
  materially new. Planner (or Nick) reads accumulated session files,
  patches canonical docs, flips `rolled_up: true` on absorbed sessions.

## Fleet sizing rationale

Why 6 agents and not more or fewer:

- **Adding agents past 6** runs into coordination overhead. The planner
  spends increasing time reconciling reports rather than synthesizing
  insights. Wrong-routing errors increase (the planner asks the wrong
  agent for the wrong thing).
- **Reducing below 6** loses parallelism. With 4 Cursor Claude Code
  agents you can keep recon, execute, tests, and infra all moving
  concurrently across a sprint. Drop to 2 and you're serializing what
  doesn't have to be serial.
- **Specialize harder, don't hire more.** If a particular workstream
  needs more attention, dedicate one of the existing 4 to it for the
  duration. Don't introduce a 5th.

This calibration assumes one architect (Nick). If a second human-in-loop
ever joins (Valerie, Kendra, contractor), the agent count probably
stays the same but the human routing layer gets richer — Cursor manual
splits into per-human sessions, Replit Agent authentication has to
become per-person, etc.

## Routing decisions — what goes where

Common routing patterns the planner should default to:

- **Code change that needs to ship** — Cursor Claude Code agent. Never
  Replit Agent (per HR-2 and SR-1).
- **In-Repl exploration / runtime log fetch / DB query via Repl secret**
  — Replit Agent. Never Cursor (no shell access to the Repl).
- **Browser-manual op** (DNS, Search Console, GoDaddy UI, dashboards)
  — Comet browser, Nick driving.
- **Cloud Shell op** (`gcloud`, big SELECT against prod) — Nick directly,
  in his Cloud Shell session. Planner provides the commands inline.
- **Doc rollup / session synthesis** — Planner. Cursor agents shouldn't
  edit canonical docs directly.
- **Architecture decision or scope question** — Planner with Nick.
  Agents propose, planner synthesizes, Nick decides.

When a request lands and the right agent isn't obvious, the planner
asks before routing. Wrong-routing wastes a turn.

## What's coming next (deferred items)

Items that improve the flow but aren't urgent:

- **GitHub MCP for Claude.ai planner** — replaces manual project
  knowledge sync. Planner reads doc_repo directly through the
  connector. Worth wiring once the seed doc set is stable.
- **Neon MCP for Cursor agents** (post-Empressa-Neon migration). Lets
  agents introspect schemas, list branches, run migrations from chat
  without shell intermediation.
- **Devcontainer for workstation parity** — eliminates the Nick-box
  vs cente-box `gcloud`-path divergence. About a day to set up
  properly.
- **Cloud Code extension** in Cursor — browse Cloud Run revisions,
  Secret Manager values, logs without leaving the editor. Nice to
  have, not essential.

These all live in the migration sprint backlog or beyond. The current
flow works without them.

## What this document is NOT

Not a sequence of commands or recipes — see [`90_runbooks/`](90_runbooks/)
for those. Not the rules — see
[`20_agent_operating_rules.md`](20_agent_operating_rules.md). Not the
machine-specific paths — see
[`22_workstation_inventory.md`](22_workstation_inventory.md). This is
the structural picture: who, where, why.
