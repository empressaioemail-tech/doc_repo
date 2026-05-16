---
name: project-refresh
description: "Audit the canonical doc set for staleness and propose specific refresh actions. Use this skill when the operator says 'audit the docs', 'is anything stale', 'check the doc set', 'project refresh', 'are the active sprints current', or when returning to the repo after a gap of more than a week. Also run before any major strategic conversation so the operator enters the conversation knowing what is current."
---

# Project Refresh

Audits the canonical doc set for staleness and surfaces what needs updating.

## When this triggers

Weekly review cadence, or whenever significant activity has happened outside the repo that should be reflected in canonical docs. Also trigger when the operator returns to the repo after a gap of more than seven days, or before any major strategic conversation.

## What this checks

### File freshness

Run `ls -la` on the repo root and `80_adrs/`. For each canonical doc, check `last_updated` in frontmatter against the file age and against `00_current_state.md`. Flag docs where:

- `status: active` and `last_updated` more than 60 days old (staleness signal per `01_doc_conventions.md`)
- The doc is referenced in `00_current_state.md` as in-flight but its `last_updated` predates the most recent session that touched it
- The doc references other docs that have since been superseded

### Snapshot freshness

`00_current_state.md` should be regenerated at every session close per `90_runbooks/current_state_protocol.md`. Check:

- `last_updated` matches or is newer than the most recent session in `_sessions/`
- Active fires section reflects current state (any closed fires still listed? any new fires not yet captured?)
- In-flight sprints section matches the actual state of work
- Open ADRs list matches the `80_adrs/` directory

### Open ADR status

For each ADR with `status: proposed`:
- Is it ready to ratify (decision is settled in conversation)?
- Is it blocked on a verification or a dependency? Note.
- Was a session held that should have moved it to accepted but didn't update the doc?

As of the most recent recon: ADRs 013, 015, 017 are proposed status awaiting Nick's ratification.

### Decision register

Check `_decisions/` for decisions that:
- Have been reversed but not marked reversed
- Have been superseded but not marked superseded
- Reference reversal criteria that have been met (reversal should have been triggered)
- Have status provisional with verification items that have cleared since (should flip to active)

### Stakeholder freshness

Reference `18_stakeholder_graph.md`. For each strategic stakeholder, when was the last meaningful interaction or update?

- Sylvia: last municipal touchpoint
- Valerie: last commercial update
- Nick: any pending decisions blocking work (proposed ADRs awaiting ratification, open architectural calls)
- Mox CEO: status of reframing conversation
- Bastrop city contacts: status of partnership template work

### Untracked drift

Run `git status` and flag untracked files at the repo root that fall outside the band convention. Files at root that are neither numbered band docs nor the standard `00_README.md`, `00_current_state.md` family are drift candidates.

As of the most recent recon: `MCP Server/`, `mox_executive_summary_v2.md`, `mox_prospect_briefing.md`, `mox_prospect_project_instructions.md` are untracked. Need disposition.

### Sprint scope drift

Cross-reference active sprints (per `00_current_state.md` section 2) against the doc set. Flag:
- Work that has crept in without being scoped
- Work that has been scoped but not landed in the right sprint
- Sprint exit criteria that have been met but not formally closed

## What this produces

A refresh report committed at `_sessions/<YYYY-MM-DD>_doc_audit_<topic>.md`:

```
# Doc Set Refresh Report

Date: YYYY-MM-DD
Last refresh: YYYY-MM-DD (N days)

## Stale docs
[List of files and their status: current / stale / needs update]

## Snapshot drift
[Items where 00_current_state.md does not match canonical state]

## Open ADRs needing ratification
[ADRs in proposed status with current routing]

## Decisions to update
[Status changes needed in _decisions/]

## Open questions status
[Each open question from CLAUDE.md or 00_current_state.md with current state]

## Stakeholders needing touch
[Names and recommended action]

## Untracked drift
[Files at root outside the band convention]

## Sprint scope drift
[Items that have crept in or out]

## Proposed refresh actions
[Ranked list; operator picks which to execute]
```

## What this skill does not do

Does not execute refreshes without operator approval. Reports state and proposes; operator authorizes via plan mode before any commits.

Does not generate new strategic content. If a doc is stale because the underlying thesis has evolved, that warrants a strategic conversation, not a refresh.

Does not replace session close. Session-close handles per-session capture; project-refresh handles cross-session staleness audit.

## Suggested cadence

Run weekly on a fixed day (operator preference; suggest Monday morning).

Run on demand when the operator returns to the repo after a gap.

Run before any major strategic conversation, so the operator enters the conversation knowing what is current.

End of skill.
