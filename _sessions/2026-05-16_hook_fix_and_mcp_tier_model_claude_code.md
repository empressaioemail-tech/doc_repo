---
id: 2026-05-16_hook_fix_and_mcp_tier_model_claude_code
title: Claude Code session — branch-guard hook fix + per-product MCP surface tier model
date: 2026-05-16
agent: claude_code
repo: doc_repo
session_type: execute
last_updated: 2026-05-16
applies_to: portfolio
rolled_up: true
rolled_up_into: [00_current_state, 29_mcp_surface_tier_model, 50_hauska_mcp_server, 28_mcp_first_product_design]
---

# Hook fix + per-product MCP surface tier model

Second session under the new Claude Code in-repo strategic-agent pattern. Picked up the four-item carry list from the 2026-05-16 migration test session (commit `4dc8dd7`). Tackled the highest-urgency mechanical item first (branch-guard hook fix), then the highest-priority strategic item (per-product MCP tier model). Two items remain queued for future sessions: bizops 70-band structural design, and MCP server code migration (Nick action).

## What was done

### Item 1 — Branch-guard hook fix

Diagnosed and shipped the fix for the PreToolUse branch-protection hook at [`.claude/hooks/branch-guard.ps1`](../.claude/hooks/branch-guard.ps1). Two root causes uncovered, not just the one the handoff named.

Root cause A (per handoff): the original script read `$env:CLAUDE_TOOL_INPUT`, but Claude Code's PreToolUse protocol passes the tool payload as JSON on stdin. The env var read returned null, the script exited 0 unconditionally, the hook never blocked anything.

Root cause B (uncovered this session via diagnostic logging): the original regex `git (commit|push)` required `commit`/`push` as the very next token after `git`, but real-world git invocations include git-level flags like `git -C P:/doc_repo commit`. The flags between `git` and the subcommand broke the match. This bug was masked by root cause A; once stdin parsing worked, the regex still failed to fire.

Fix: rewrote the script to read stdin via `[Console]::In.ReadToEnd()`, parse JSON via `ConvertFrom-Json`, extract `.tool_input.command`, and run a loosened regex `\bgit\b[^&|;]*?\b(commit|push)\b` that matches `git ... commit/push` within a single shell-command segment (won't cross `&&`, `|`, or `;` into a different shell command). Fails open on any parse error so a hook bug never breaks routine Bash use.

Verified empirically:
1. Diag-logged a benign `git -C P:/doc_repo status --short` call to confirm hook invocation, payload shape, and the `$env:CLAUDE_TOOL_INPUT` null vs stdin presence.
2. Created `hook-test-2026-05-16-02` branch, attempted `git commit --allow-empty -m "..."`, observed exit 2 with verbatim block message: `{"block": true, "message": "git commit/push refused: current branch is hook-test-2026-05-16-02, not main. Switch to main explicitly or override."}`
3. Switched back to main, deleted the diag log, deleted the test branch via one-time-approved `git branch -D` (deny-list entry preserved).

### Item 4 — Per-product MCP surface tier model

Substantive strategic work. Resolved the "Tier model for product MCP surfaces" open question from [`28:108`](../28_mcp_first_product_design.md#L108) that was blocking post-Sprint-51 MCP retrofits.

Four cross-cutting principles pinned and premortem-cleared (all four structural commitments green; all three operational rules green):
1. Layer 1/2 at the MCP surface mirrors 08 atom-tier.
2. Within-tenant vs cross-tenant as second axis. Refinement: substrate MCPs (Layer 1 only by design) use volume-tier model; principle 2 applies to mixed-Layer-1+2 product MCPs.
3. SDK is settlement, not metering. Metering at each product's MCP server; SDK routes via accessPolicy per 14's payment substrate section.
4. Reasoning-call as unifying accounting unit.

Per-product rulings landed for all eight product MCP surfaces:
- **Hauska MCP Server / Codex code intelligence** (one technical surface, two brand hats per ADR-008): Layer 1 only by design, four-tier shape confirmed (Free / Developer Pro / Team / Embedder License), API-key gated with generous daily cap.
- **ECI MCP**: non-commercial, access-control only via ADR-017 platform-internal scope, separate endpoint recommended.
- **Codex 1a MCP**: per-seat ($300/seat/month default per 47) with bundled submissions plus cross-tenant Layer 2 overage; agent calls meter against firm's seat.
- **Codex 1b MCP**: two buyer paths (city-direct via SmartCity OS subscription; firm-direct per-seat-or-per-jurisdiction deferred to ADR-009). Cross-jurisdictional buyer = whoever makes the call.
- **SmartCity OS MCP**: within-tenant scope includes city's own Layer 2 atoms; cross-tenant city buyer only at v1; cross-city queries as advanced Layer 2 opt-in with per-query overage.
- **Cortex MCP**: per-seat default with per-firm enterprise option; cross-firm precedent opt-in only (deviates from principle 2 due to design-IP sensitivity); Revit add-in calls use same metering as direct MCP.
- **Revit Connector MCP**: union of two existing rulings (internal Cortex add-in path uses Cortex seat metering; external multi-host embedder license per Hauska MCP Server Embedder License pattern, opportunistic).

Produced [`29_mcp_surface_tier_model.md`](../29_mcp_surface_tier_model.md) carrying cross-cutting principles, per-product matrix, conversion triggers summary, open numeric questions, dependencies, and sequencing implications for MCP retrofits.

Side-effect decision: Hauska MCP Server Phase 0 decision #1 (revenue scenario A / B / C) resolved as **Scenario B (self-serve paid tier)**. Decision record at [`_decisions/2026-05-16_hauska_mcp_server_scenario_b.md`](../_decisions/2026-05-16_hauska_mcp_server_scenario_b.md). Sprint 51 Phase 8 (self-serve paid tier infrastructure) moves from conditional to in-scope per this decision; Phase 9 (BD enablement materials) remains conditional and out of Scenario B scope.

Per-product roadmap docs updated with MCP-tier line items:
- [`47_codex_plan_review.md`](../47_codex_plan_review.md) — added MCP tier ruling to Open decisions section; added 29 and ADR-009 to related.
- [`30_smartcity_os.md`](../30_smartcity_os.md) — added MCP surface tier model subsection before Current state.
- [`40_design_accelerator.md`](../40_design_accelerator.md) — added MCP surface tier model subsection plus Cortex naming note.
- [`41_revit_connector.md`](../41_revit_connector.md) — added MCP surface tier model subsection covering both paths.
- [`60_eci_atomization.md`](../60_eci_atomization.md) — added MCP surface tier model subsection noting non-commercial ruling.

[`28_mcp_first_product_design.md`](../28_mcp_first_product_design.md) doc-drift fixes:
- Codex 1a product-by-product status row corrected from "architect-side" to "contractor-side" per [`47:42-49`](../47_codex_plan_review.md#L42-L49) and [`47:124-128`](../47_codex_plan_review.md#L124-L128).
- "Pay per submission" framing aligned with per-seat + per-call overage shape settled in 29.
- "Tier model for product MCP surfaces" open question marked resolved with pointer to 29.

[`50_hauska_mcp_server.md`](../50_hauska_mcp_server.md) Open Decisions: decision #1 marked resolved with pointer to decision record and 29. Phase 8 in-scope vs conditional note added.

## What was learned (changes to ground truth)

- **Branch-guard hook had two bugs, not one.** The handoff correctly diagnosed the stdin-vs-env-var bug but did not catch the regex bug. The combination meant the original hook silently passed everything; once one was fixed, the other still failed. Lesson: when an empirical test fails after a fix that "should work," add diagnostics before guessing the next fix. The diagnostic log added in mid-session was the only way to confirm root cause A was actually fixed before discovering root cause B.

- **Codex 1a is contractor-side, not architect-side.** [`28:63`](../28_mcp_first_product_design.md#L63) carried "architect-side plan review" framing that was inconsistent with [`47:42-49`](../47_codex_plan_review.md#L42-L49) and [`47:124-128`](../47_codex_plan_review.md#L124-L128) (1a is firms doing reviews on a city's behalf or self-review pre-submission, not architects). Fixed in 28 this session.

- **Codex code intelligence MCP and Hauska MCP Server are one technical surface with two brand hats.** Per [`07:60-72`](../07_product_line_summary.md#L60-L72), Codex code intelligence agent surface IS the Hauska MCP Server tools (`search_atoms` / `get_atom` / `list_jurisdictions`). The brand differentiation is marketing layer per ADR-008. Treating them as two separate products in the tier matrix was wrong; reconciled to one ruling, two brand hats. Captured in 29.

- **Principle 2 needs a substrate-MCP refinement.** The within-vs-cross-tenant rule applies cleanly to mixed-Layer-1+2 product MCPs (SmartCity OS, Codex 1a/1b, Cortex). Substrate MCPs that are Layer 1 only by design (Hauska MCP Server) have no Layer 3 subscription wrapping them and no within/cross-tenant distinction; they use the volume-tier model from 50 with accessPolicy routing revenue share to source actors. Refinement captured in 29 principle 2 statement.

- **Cortex MCP deviates from principle 2's default on cross-firm precedent.** Design firms compete on design quality and IP; precedent sharing is high-friction enough that the default-cross-tenant-meters posture from principle 2 does not fit. Cross-firm precedent is opt-in only for Cortex. Captured as an explicit deviation in 29.

## What's still open

- **Bizops 70-band structural design.** Carried forward from the prior session. Forcing function intact (three mox_*.md docs at repo root; Hauska Inc. corporate paperwork without a slot). Substantive strategic session, 60-90 min, plan-mode territory.

- **MCP server code migration to dedicated `hauska-mcp-server` repo.** Nick action: set up the repo, then runbook drafting + cross-repo pointer for [`50:471`](../50_hauska_mcp_server.md#L471).

- **Mox CEO meeting timing.** Gates Mox pilot reframing urgency.

- **IP attorney memo and Tech E&O insurance routing dates.** Remain pending.

- **Specific numeric values for the MCP tier model** are explicitly deferred per 08 and 14 Open postures. Take rate within 1-3%; specific tier prices for Hauska MCP Server; specific seat price for Cortex; bundled call quotas; per-host or per-end-user-MAU terms for multi-host embedder; per-seat vs per-jurisdiction unit for Codex 1b firm-direct (ADR-009 dependency).

- **ADR-009 firm tenancy** remains deferred per [`00_current_state.md:50`](../00_current_state.md#L50); now also blocks Codex 1b firm-direct unit selection.

- **Two doc-rename items deferred.** The 40 doc is still titled "Design Accelerator" pending 27 Stream G brand migration; carry note added inline. The 60 doc still references ADRs 015 and 017 as "proposed" in one place; both are now accepted per the 2026-05-16 prior session — bump on next 60 touch.

## Suggested canonical doc updates

All updates applied this session. No deferred updates from the tier-model work.

## References

- Prior session: [`_sessions/2026-05-16_claude_code_migration_test_close.md`](2026-05-16_claude_code_migration_test_close.md)
- Prior session commit: `4dc8dd7`
- New canonical doc this session: [`29_mcp_surface_tier_model.md`](../29_mcp_surface_tier_model.md)
- New decision record this session: [`_decisions/2026-05-16_hauska_mcp_server_scenario_b.md`](../_decisions/2026-05-16_hauska_mcp_server_scenario_b.md)
- Hook script: [`.claude/hooks/branch-guard.ps1`](../.claude/hooks/branch-guard.ps1)
- Pre-reads consulted: [`08_tiered_access_model.md`](../08_tiered_access_model.md), [`28_mcp_first_product_design.md`](../28_mcp_first_product_design.md), [`14_pricing_framework.md`](../14_pricing_framework.md), [`07_product_line_summary.md`](../07_product_line_summary.md), [`50_hauska_mcp_server.md`](../50_hauska_mcp_server.md), [`60_eci_atomization.md`](../60_eci_atomization.md), [`47_codex_plan_review.md`](../47_codex_plan_review.md), [`30_smartcity_os.md`](../30_smartcity_os.md), [`40_design_accelerator.md`](../40_design_accelerator.md), [`41_revit_connector.md`](../41_revit_connector.md)
