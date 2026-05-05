---
id: 00_README
title: Empressa portfolio docs — README
status: active
last_updated: 2026-05-05
applies_to: portfolio
---

# Empressa portfolio docs

Canonical project knowledge for the software portfolio: SmartCity OS, Design
Accelerator, Revit Connector, Hauska SDK, ECI. This is the source of truth
every agent (Cursor Claude Code, Claude.ai planner, Cursor manual, Replit
Agent) reads at session start and writes back to at session end.

## Scope

Software development only. Not brand assets, not sales/marketing material,
not customer-facing deliverables — those have separate lifecycles. What
lives here:

- Architecture references and decision records (ADRs)
- Per-product state of reality and roadmaps
- Agent operating rules and the AI-first dev flow
- Workstation conventions and deployment runbooks
- Postmortems and incident records

## Repos covered

Active development on:

| Repo | Local path | Production target |
|---|---|---|
| `empressaioemail-tech/smartcity-os` | `p:\smartcity-os` | Cloud Run `smartcity-api` (us-central1), live at `smartcityos.io` |
| `empressaioemail-tech/legacy-design-tools` | `p:\legacy-design-tools` | Replit autoscale at `prompt-agent-accelerator.replit.app` (migration to Cloud Run pending) |
| `empressaioemail-tech/legacy-revit-sensor` | `p:\legacy-revit-sensor` | C# Revit add-in, distributed via `%APPDATA%\Autodesk\Revit\Addins` |

Additional products tracked in `50_*` (Hauska SDK npm packages) and `60_*`
(ECI) when active. Their working-repo paths get added to this table when
they re-enter active development.

This docs repo lives at `p:\doc_repo`, sibling to the working repos. Agents
read from `..\doc_repo` and write session summaries to
`..\doc_repo\_sessions\`.

## Numbering bands

```
00-09  Meta — README, conventions, lifecycle
10-19  Ground truth, portfolio architecture, roadmap
20-29  Agent operating rules, AI-first dev flow, workstation, deploy rules
30-39  SmartCity OS
40-49  Design Accelerator + Revit Connector
50-59  Hauska SDK
60-69  ECI
70-79  Reserved
80-89  ADRs (architecture decision records)
90-99  Runbooks, postmortems, incident records
```

See [`01_doc_conventions.md`](01_doc_conventions.md) for full naming rules
and frontmatter format.

## Read / write rules for agents

- **Read everything relevant.** Canonical docs are authoritative for any
  topic they cover. If you find a contradiction between a canonical doc and
  what you observe in code or production, treat the doc as suspect — flag
  it in your session summary so the planner can investigate before patching.

- **Never edit canonical docs directly.** Write append-only summaries to
  `_sessions/<date>_<repo>_<agent>.md` instead. The planner rolls session
  summaries into canonical docs end-of-day. Direct edits skip human-in-loop
  review and create merge conflicts.

- **One session file per agent per repo per day.** Format:
  `_sessions/2026-05-05_smartcity-os_cc-agent-1.md`. If multiple sessions
  same day, append `-01`, `-02`.

- **Frontmatter is required.** Every canonical doc has frontmatter (see
  [`01_doc_conventions.md`](01_doc_conventions.md)). Session summaries also
  have frontmatter — that's how rollup status is tracked.

## First-time orientation order

1. [`01_doc_conventions.md`](01_doc_conventions.md) — naming, frontmatter,
   write patterns, lifecycle
2. [`10_ground_truth.md`](10_ground_truth.md) — current state of all active
   repos, open fires, planner-belief corrections
3. [`20_agent_operating_rules.md`](20_agent_operating_rules.md) — hard
   rules, soft rules, agent role taxonomy
4. [`21_ai_first_dev_flow.md`](21_ai_first_dev_flow.md) — per-repo Cursor +
   Claude Code + planner pattern
5. Per-product state docs in `30_*` / `40_*` / `41_*` as relevant to your
   task

## Lifecycle

This repo's contents drift. The discipline that keeps it accurate:

- Session summaries end every working session, no exceptions
- Rollups happen end-of-day or when a session reveals something materially
  new
- Periodic ground-truth recon sprints across all active repos confirm
  canonical docs match reality
- Anything older than ~60 days without a `last_updated` bump gets flagged
  for review

If you're reading this and something looks stale, write a session summary
saying so. The repo only stays accurate if drift gets surfaced.
