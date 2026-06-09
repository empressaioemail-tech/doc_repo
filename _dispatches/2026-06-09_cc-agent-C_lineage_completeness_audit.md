---
id: 2026-06-09_cc-agent-C_lineage_completeness_audit
title: Dispatch — lineage-completeness audit across all emission surfaces (recon)
date: 2026-06-09
agent: cc-agent-C
repo: legacy-design-tools (cross-repo read: hauska-mcp-server, hauska-brief-extension)
kind: recon
status: READY - parallel-safe, read-only
related: [57_national_code_warming_sprint, 04a_arrow_two_calibration_capture, _decisions/2026-06-09_codewarm_arrow_two_combined, 50_hauska_mcp_server, 55_spine_data_intelligence_stack, 20_agent_operating_rules]
---

# Lineage-completeness audit across all emission surfaces

> Recon, read-only, no code. Arrow-two can only return a deposit where the outbound emission carried an attributable atom id. Phase 0 confirmed the lineage on Cortex findings (`findings.citations[].atomId`). This audit checks every OTHER surface that emits a code citation, because any surface that emits without an attributable atom id is arrow-one-only withdrawal that can never become a deposit. This is a launch-readiness gate for the clean-base / arrow-two theology. Frame: [`57_national_code_warming_sprint.md`](../57_national_code_warming_sprint.md), [`_decisions/2026-06-09_codewarm_arrow_two_combined.md`](../_decisions/2026-06-09_codewarm_arrow_two_combined.md).

You are **cc-agent-C**, reading across legacy-design-tools plus cross-repo reads of hauska-mcp-server and hauska-brief-extension. No writes, no PR.

## Model (HR-12)

Grok Build 0.1 default.

## Scope (read-only, cite by file plus symbol, HR-8)

For each emission surface below, determine: does the emitted artifact carry an attributable atom id (the corpus atom id or the `websearch:`/`reasoning:` id) on every code citation, end to end, such that a downstream adjudication or outcome can be routed back to the exact atom(s) via lineage? Report yes/no/partial with the file and symbol that carries (or drops) the id.

1. **Cortex findings (baseline, confirm still true).** `findings.citations[].atomId` and the `[[CODE:<atomId>]]` token path; confirm `invalidCitationCount` behavior (token-stripping can silently drop a citation and starve the ledger). Report recent invalid-citation rates if observable.
2. **Codex.** The Codex building-code-lookup and reviewer surfaces and their MCP tools (`codex_finding_generation`, `codex_briefing_fetch`, `codex_snapshot_ingest`, `codex_override_write`). Do Codex outputs carry the atom-id lineage, or do they return text/citation without an attributable id?
3. **MCP tools (the gate).** The public (11) + Codex (4) + Cortex (31) tool outputs in hauska-mcp-server `src/tools.ts`. Which tool outputs carry atom ids on citations and which return prose/section-number only? Note: rail-quiet (I7) means the calibration GRADE stays out of outputs, but the atom-id lineage is what arrow-two needs and is distinct from the grade.
4. **Brief extension.** The brokerage/brief path (`/api/brokerage/v1`, the extension ingress) and its briefing outputs. Do brief citations carry attributable atom ids?
5. **Briefing-source citations.** The `briefing-source` id path alongside `code-section` atomId (per 55 §4): is it attributable for arrow-two, or reference-only?

## Deliverable

A surface-by-surface table: surface, emits-citations (y/n), carries-attributable-atom-id (y/n/partial), file+symbol of record, and the gap if any. Then a prioritized close-list: which surfaces are arrow-one-only withdrawal today and what the minimal lineage fix is for each (so it can be scoped as build work before launch). Flag any surface where closing the gap is non-trivial (e.g. requires the gate to thread atom ids it currently strips).

## Acceptance criteria

- All five surfaces covered, each cited by file plus symbol, verified against live source (HR-8).
- Clear verdict per surface (attributable / partial / arrow-one-only) with the gap named.
- Prioritized close-list with minimal-fix-per-surface.
- No code, no schema, no PR.

## Reporting

Write to `P:\doc_repo\_inbox\` as `2026-06-09_legacy-design-tools_cc-agent-C_lineage_completeness_audit.md`: the surface-by-surface table, the close-list, and blockers verbatim.
