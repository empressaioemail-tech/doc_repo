---
decision: replit_agent_seat_decommissioned
date: 2026-08-19
status: active
owner: operator
supersedes: fleet inventory "replit-agent unknown"
related: [adr_002_replit_neon_migration, adr_003_replit_neon_tactical, 90_runbooks/legacy_design_tools_replit_to_cloud_run_cutover]
---

# Replit Agent seat decommissioned

## Decision

The Replit Agent seat is **decommissioned**. It is not unknown, not dormant-without-record, and not an active harness. No dispatch, plan row, or close artifact may assign work to Replit Agent.

## Evidence

**Operator ruling (2026-08-19):** declared unused for a long period.

**Migration complete:** Cloud Run cutover landed 2026-05-20 per `90_runbooks/legacy_design_tools_replit_to_cloud_run_cutover.md` Stage 9. Production cortex-api and smartcity-api run on Cloud Run against cortex-prod Neon; the Replit data dependency was severed.

**Revit / add-in repoint done (2026-05-21):** `legacy-revit-sensor` no longer targets `prompt-agent-accelerator.replit.app`; data-scatter risk closed per `43_cortex_qa_backlog.md`.

**Repl neutralization:** smartcity-os origin/main includes `602f599` ("chore(repl): neutralize .replit + scripts/post-merge.sh with loud-fail (Fire 4)").

**No active fleet routing:** No product repo on this machine lists Replit Agent in a compiled dispatch after 2026-05 cutover. `20_agent_operating_rules.md` HR-2 already routes shipping work to Cursor cc-agents.

**Live reach probe (2026-08-19):** HTTPS fetch to `https://prompt-agent-accelerator.replit.app/` timed out from the systems agent environment. Timeout is not proof of deletion; combined with cutover completion and operator ruling, the seat is decommissioned regardless of whether the Repl URL still resolves.

**ADR-003:** status remains `active` in frontmatter but its precondition ("until ADR-002 ships") is satisfied. Planner action: flip ADR-003 to superseded on next constitution pass (not blocked on this decision).

## What Replit cannot reach

- Production cortex-api, smartcity-api, hauska-engine, or MCP serving paths (all Cloud Run / Vercel / GCP as of cutover).
- No credential rotation or deploy pipeline depends on Replit Agent checkpoint commits.

## Follow-up (planner-owned, not this lane)

- Retire Replit Agent mentions from `CLAUDE.md`, `09_post_saas_substrate_thesis.md`, `18_stakeholder_graph.md`, `20_agent_operating_rules.md` HR-2 table row, and `01_doc_conventions.md` author enum — status flip to superseded wording, not silent deletion.
- Mark Replit-era runbooks already listed in `90_operations/QUEUE_parked_work_index.md` status-flip pass.

## Reversal criteria

Recommission only with: a new plan row, a named Repl project with verified non-production scope, and a WDLL whose acceptance items include decline/404 proof for any retired path Replit would replace.
