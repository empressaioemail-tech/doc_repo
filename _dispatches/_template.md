---
id: dispatch_template
title: Dispatch template — cc-agent work order
status: active
last_updated: 2026-05-27
applies_to: portfolio
kind: template
related: [01a_atom_conventions, 20_agent_operating_rules, 21_ai_first_dev_flow, 90_runbooks/agent_workspace_hygiene]
---

# Dispatch template — cc-agent work order

Copy this skeleton when authoring a new file in `_dispatches/`. Replace
`{{placeholders}}`. Filename pattern:
`_dispatches/YYYY-MM-DD_cc-agent-{{AGENT}}_{{slug}}.md`

Do not commit this file as a dispatch; it is the boilerplate only.

---

```markdown
---
id: {{YYYY-MM-DD}}_cc-agent-{{AGENT}}_{{slug}}
title: Dispatch — {{one-line title}}
date: {{YYYY-MM-DD}}
agent: cc-agent-{{AGENT}}
repo: {{repo-name}}
kind: dispatch
related: [00_current_state, 01a_atom_conventions, 20_agent_operating_rules, {{sprint-or-backlog-docs}}]
---

# {{Title}}

You are **cc-agent-{{AGENT}}**, the single owner of `{{repo}}` for this run.

## Model (HR-12)

Default: **Grok Build 0.1** (multi-file / agentic). Use **grok-code-fast-1** for
narrow, speed-only tasks. Escalate to Claude only if Grok fails after retry;
log the escalation in your session summary.

Cursor: base URL `https://api.x.ai/v1`.

## Atoms to resolve

Resolve these before reading full canonical docs (catalog:
[`01a_atom_conventions.md`](../01a_atom_conventions.md)):

- `current-state:portfolio` — fleet status, blockers
- `{{entity_type}}:{{entity_id}}` — {{why this atom}}
- `{{entity_type}}:{{entity_id}}` — {{why this atom}}

Optional additive ops atoms (R and D process only):

- `strategy-module:competitive-execution-system`
- `ops-scoreboard:weekly`

## Read first (after atoms)

1. [`00_current_state.md`](../00_current_state.md) — § relevant to this dispatch only
2. {{canonical doc path}} — {{section or purpose}}
3. [`20_agent_operating_rules.md`](../20_agent_operating_rules.md) — HR-1, HR-2, HR-3, HR-8, HR-11

## Workspace ownership

- Clone: `{{P:\path\to\clone}}`
- Branch prefix: `{{cortex/|2d/|render/|stream-1d/}}`
- One agent per clone per [`agent_workspace_hygiene`](../90_runbooks/agent_workspace_hygiene.md)
- Refuse alien HEAD or uncommitted state; report verbatim `git status` + `git log -3`

## Scope

**In scope:** {{bullets}}

**Out of scope:** {{bullets}}

## Acceptance criteria

- {{measurable outcome}}
- Tests: {{command}}
- If this touches api-server routes, DB schema, or integration-tested code: run the suites against the local test DB ([`90_runbooks/cc_agent_local_test_db.md`](../90_runbooks/cc_agent_local_test_db.md)) and paste the ACTUAL run output. "Expected green in CI" is not an acceptable verification artifact (HR-13). If you have no local test DB, that is a blocker to report, not a reason to ship.
- PR held for operator merge (do not merge)
- Verbatim verification artifacts in report (HR-8)

## Reporting

At session break-point, write to `P:\doc_repo\_inbox\` as
`{{YYYY-MM-DD}}_{{repo}}_cc-agent-{{AGENT}}_{{topic}}.md`.

Include:
- Atom refs touched
- Model used (if not default Grok Build 0.1)
- PR URL + branch SHA
- Blockers verbatim
```

## Revision history

- **2026-05-27:** Added optional additive ops atoms for execution discipline and weekly scoreboard.
- **2026-05-23:** Phase 2 Grok migration. Atoms block + HR-12 model line added.
