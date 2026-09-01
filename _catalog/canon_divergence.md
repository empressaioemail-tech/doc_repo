---
id: canon_divergence
title: Canon-vs-reality divergence report (M2)
status: clear
last_updated: 2026-08-21
generated_by: scripts/canon-divergence.mjs
checks: P:/doc_repo/_catalog/repo_intents_checks.json
---

# Canon divergence (M2)

Generated 2026-08-21. Runtime 4079 ms. Window: since=per-row last_verified until=now. Fetch=yes.

**Summary:** 0 divergent · 0 acknowledged · 8 ok · 0 skipped · 11 repos unmonitored · 0 empty-posture rows.

Alarm surface: this file. `_STATE.md` GOVERNANCE links here. Not Command Center — the watcher must not carry a five-service deploy dependency.

Cadence: `.claude/hooks/canon-divergence-run.ps1` on Read of `_STATE.md` (stale-report refresh, fail-open). Manual: `node scripts/canon-divergence.mjs`.

## DIVERGENT

_none_

## OK

| Check | Repo | Posture | Commits | Last verified |
|---|---|---|---:|---|
| legacy-design-tools::repo | legacy-design-tools | factory | 0 | 2026-08-21 |
| ldt-clock1-root-spa | legacy-design-tools | zero-new-work | 0 | 2026-08-21 |
| ldt-clock2-cortex-console | legacy-design-tools | zero-new-work | 0 | 2026-08-21 |
| hauska-engine::repo | hauska-engine | active | 0 | 2026-08-21 |
| hauska-map::repo | hauska-map | active | 0 | 2026-08-21 |
| hauska-atom-contract::repo | hauska-atom-contract | active | 0 | 2026-08-21 |
| hauska-mcp-server::repo | hauska-mcp-server | active | 0 | 2026-08-21 |
| smartcity-os::repo | smartcity-os | no-touch | 0 | 2026-08-21 |

## UNMONITORED (in portfolio_repos, absent from repos[])

- hauska-sdk
- smart-files
- hauska-brief-extension
- radar
- AEC-cortex
- icc-demo
- mox_demo
- slb_prototype
- empressa-trading
- hauska-platform
- legacy-revit-sensor

## Meta

- checks_schema: 1
- as_of_intent: live
- unmonitored_empty_posture: 0
- unmonitored_absent_repos: 11
- per_repo_last_verified: yes (repo_intents_checks.json, not doc-level last_updated)

To acknowledge without changing posture: set `acknowledged_until: YYYY-MM-DD` on the check or repo row. Never a permanent mute. A row red >30d with no ack appears under ESCALATED.
