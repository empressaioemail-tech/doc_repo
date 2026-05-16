---
id: 2026-05-16_claude_code_migration_test_close
title: Claude Code migration test session — ADR ratifications, skill refinement, hook conversion
date: 2026-05-16
agent: claude_code
repo: doc_repo
session_type: execute
last_updated: 2026-05-16
applies_to: portfolio
rolled_up: true
rolled_up_into: [00_current_state, CLAUDE.md, adr_013_procedure_execution_atoms, adr_015_actor_atoms, adr_017_atom_access_control]
---

# Claude Code migration test session — ADR ratifications, skill refinement, hook conversion

First session under the new Claude Code in-repo strategic-agent pattern. Replaces the prior two-agent setup (claude.ai strategic Project plus Cursor Claude Code courier in `P:\doc_repo`). Treated as a test run with three goals: verify migration scaffolding landed correctly, do light orientation against the canonical doc set, surface decisions before regular operation resumes.

## What was done

Stage 1 verification: read CLAUDE.md, `.claude/settings.json`, all eight skill files under `.claude/skills/`, `01_doc_conventions.md`, `90_runbooks/session_close_template.md`, `90_runbooks/current_state_protocol.md`. Reported on contradictions, claude.ai residue, settings permissiveness, and missing items.

Stage 2 orientation: read `00_current_state.md`, sampled four most recent session summaries (2026-05-16 strategic brainstorm, 2026-05-16 Q4/Q5/Q6 resolution, 2026-05-15 doc audit, 2026-05-15 catalog roadmap followon). Reported in-flight sprints, open architectural questions, status of three proposed ADRs (013/015/017), and untracked file disposition.

Stage 3 surfacing: presented decisions, drift, skill assessment, and recommended first two pieces of work to prove the pattern.

Execution (after Nick's directives, all read-only mode lifted for the specific items below):

1. **Ratified ADRs 013, 015, 017** to `status: accepted`, `last_updated: 2026-05-16`. Status-line text updated on each to record ratification origin (Claude Code migration test session). [80_adrs/adr_013_procedure_execution_atoms.md](../80_adrs/adr_013_procedure_execution_atoms.md), [80_adrs/adr_015_actor_atoms.md](../80_adrs/adr_015_actor_atoms.md), [80_adrs/adr_017_atom_access_control.md](../80_adrs/adr_017_atom_access_control.md).
2. **Find-and-replaced legacy `view` tool references with `Read`** across CLAUDE.md (line 41), [.claude/skills/source-required/SKILL.md](../.claude/skills/source-required/SKILL.md) (six instances; also updated `web_search` → `WebSearch` and `web_fetch` → `WebFetch` and "view the relevant section" → "read the relevant section by offset and limit"), and [.claude/skills/decision-log/SKILL.md](../.claude/skills/decision-log/SKILL.md) (two instances). The `view` name was the claude.ai legacy tool; Claude Code's read tool is `Read`.
3. **Refactored repo-sync and project-refresh skills** to stop hard-coding recon data. [.claude/skills/repo-sync/SKILL.md](../.claude/skills/repo-sync/SKILL.md) no longer pre-lists ADR free slots; points at `80_adrs/` directly and the band table in `00_README.md`. [.claude/skills/project-refresh/SKILL.md](../.claude/skills/project-refresh/SKILL.md) no longer hard-codes "ADRs 013/015/017 are proposed" or specific untracked files; points at `00_current_state.md` and CLAUDE.md as the moving authoritative state.
4. **Converted the PreToolUse branch-protection hook** from a bash one-liner (which would not have fired correctly on Windows/PowerShell) to a PowerShell script at [.claude/hooks/branch-guard.ps1](../.claude/hooks/branch-guard.ps1), invoked via `powershell -NoProfile -ExecutionPolicy Bypass -File ...`. Same behavior: refuses `git commit` or `git push` when the working tree is not on `main`. Cleaner than escaping bash inside JSON inside PowerShell.
5. **Added a one-line `_decisions/` pointer** to CLAUDE.md Conventions section.
6. **Corrected Cortex/Design Accelerator framing** in CLAUDE.md Identity section: Cortex is the new name and supersedes "Design Accelerator" in product framing (single surface, not two siblings). The legacy "Design Accelerator" name remains in pre-migration doc references (27 Stream G brand migration tracks this).
7. **Removed the false-positive "adjudication-record atom spec gap"** from CLAUDE.md "What is open". The 2026-05-15 audit claimed the gap; verbatim read of [27_engine_evolution_plan.md:263](../27_engine_evolution_plan.md#L263) found a complete spec (Purpose, Producer, Consumer, Key fields, Links, Cross-tenant scope, Open questions). The audit was wrong; no actual spec work needed.
8. **Gitignored `MCP Server/`** with a comment noting migration plan to a dedicated `hauska-mcp-server` product repo per [`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md). Local code stays in place until that repo is set up (Nick action); after migration, local files delete and a cross-repo pointer lands in [`50_hauska_mcp_server.md`](../50_hauska_mcp_server.md).
9. **Filed three mox_*.md docs at repo root** as portable artifacts pending bizops 70-band design session. They carry valid frontmatter (`status: active`, `owner: nick`, `applies_to: portfolio`) and their portable nature (per `mox_prospect_briefing.md`'s "intended to be droppable into another Claude project") matches their root placement for now. Relocate into proper 70-band slots after the bizops session.
10. **Updated CLAUDE.md "What is settled"** to record ADR-013/015/017 ratifications; updated "What is open" to remove ratified ADRs and the adj-rec false positive, add MCP server migration note and the explicit pointer that mox_*.md docs are committed at root pending 70-band.
11. **Regenerated `00_current_state.md`**: bumped `last_updated` to 2026-05-16; added this session to section 5; added cross-cutting watchlist entries for the Claude Code pattern adoption, MCP server migration, bizops session schedule, and per-product MCP tier model session schedule; dropped the oldest 2026-05-11 entry from section 5 to keep the count at 5.

## What was learned (changes to ground truth)

- The 2026-05-15 doc audit's "adjudication-record gap" was a false positive. The atom is fully specced at `27_engine_evolution_plan.md:263` under Compounding-context atoms (Bastrop-live capture). The audit report is `status: archived-audit` (point-in-time artifact); CLAUDE.md no longer carries the false claim.
- The 2026-05-15 doc audit's "Codex correctly refers exclusively to plan review product" claim was superseded by the 2026-05-16 alignment session (Codex = plan review + code intelligence). CLAUDE.md line 83 carries the corrected framing; the audit remains as historical record under its `archived-audit` status. Note: audit reports are by nature point-in-time; this hazard repeats across any future audit.
- Cortex and Design Accelerator are the same product. Cortex is the new name. Brand migration tracked in `27_engine_evolution_plan.md` Stream G.
- The bash PreToolUse hook in `.claude/settings.json` from initial migration would not have fired correctly on Windows/PowerShell; the branch-protection net was paper. Now converted to PowerShell-script invocation. Operator should test the new hook by attempting a commit on a non-main branch to confirm the block fires.
- `view` tool name (claude.ai legacy) was sprinkled across CLAUDE.md and two skills. All instances replaced with `Read` (Claude Code's tool name). Same for `web_search` → `WebSearch` and `web_fetch` → `WebFetch` in source-required.

## What's still open

- **Bizops 70-band structural design session.** Scheduled. Will create 70-band slots and re-file the three mox_*.md docs into proper places.
- **Per-product MCP surface tier model session.** Separate from bizops. Blocks Codex 1a MCP and SmartCity OS MCP retrofits.
- **MCP server code migration to `hauska-mcp-server` repo.** Nick action: set up the repo, migrate code from local `MCP Server/`, delete local files, add cross-repo pointer to `50_hauska_mcp_server.md`. Currently gitignored locally so it stops cluttering git status.
- **Mox CEO meeting timing.** Gates Mox pilot reframing urgency.
- **IP attorney memo and Tech E&O insurance routing dates.** Mentioned in CLAUDE.md "What is open"; remain pending.
- **SDK take rate.** Per the 2026-05-16 brainstorm decision, defer until Bastrop revenue-share operational tests inform.
- **PreToolUse hook verification.** Operator should test the branch-guard.ps1 by attempting a commit on a non-main branch to confirm the block fires.

## Suggested canonical doc updates

All updates applied this session. No deferred updates.

## References

- Migration scaffolding commit: `0c47e95` (prior session)
- ADRs ratified: `80_adrs/adr_013_procedure_execution_atoms.md`, `80_adrs/adr_015_actor_atoms.md`, `80_adrs/adr_017_atom_access_control.md`
- Skills updated: `.claude/skills/source-required/SKILL.md`, `.claude/skills/decision-log/SKILL.md`, `.claude/skills/repo-sync/SKILL.md`, `.claude/skills/project-refresh/SKILL.md`
- New artifact: `.claude/hooks/branch-guard.ps1`
- Updated: `CLAUDE.md`, `.claude/settings.json`, `.gitignore`, `00_current_state.md`
- Committed at root: `mox_executive_summary_v2.md`, `mox_prospect_briefing.md`, `mox_prospect_project_instructions.md`
- Q4/Q5/Q6 source-of-truth session: `_sessions/2026-05-16_q4_q5_q6_master_roadmap_resolution_claude_ai_strategic.md`
- 2026-05-16 strategic brainstorm: `_sessions/2026-05-16_strategic_brainstorm_dual_interface_sdk_post_saas_claude_ai_strategic.md`
