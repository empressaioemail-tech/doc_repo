---
decision_id: 2026-05-22_codex_review_surface_relocation
date: 2026-05-22
owner: Nick
status: active
related_canonical: [48_codex_program_plan, 43_cortex_qa_backlog, 28_mcp_first_product_design, 44_mcp_cortex_architecture_map]
---

## Decision

The pre-submittal compliance review surface relocates into the Design Tools app, on the engagement's existing Findings tab. The run-review trigger, the finding cards, and the accept / edit / reject adjudication move from the standalone `codex-reviewer-qa` artifact (served at `/codex-reviewer-qa`) into the `design-tools` artifact. This reverses CDX-Phase1-1, the 2026-05-21 decision that placed the reviewer-side QA surface as a standalone artifact.

## Context

CDX-Phase1-1 (`_decisions/2026-05-21_codex_reviewer_qa_surface_location.md`) placed the Codex 1b reviewer-side QA surface as a new dedicated `codex-reviewer-qa` artifact in `legacy-design-tools`, rejecting both "extend plan-review" and "extend qa". Streams CDX-3/4/5/9 built the one-click review pass, the adjudication loop, the jurisdiction switcher, and the comment-letter auto-draft into that artifact (PRs #69/#70/#71/#72).

The 2026-05-22 operator QA pass established that the review the customer-zero loop actually needs is the architect's pre-submittal self-check: an architect runs a compliance review on their own engagement before submitting to the jurisdiction. That is an architect-workflow feature, and the architect works in the Design Tools dashboard, not at a separate `/codex-reviewer-qa` URL. A review surface the architect must leave their engagement to reach is the wrong placement.

## Structural commitment check

Pre-mortem run 2026-05-22 on the full QA-run plan, cleared green. Commitment 4 (dual interface): the review capability's engine path and L-surface are shared and unchanged; this is a UI relocation within an existing UI-first product. The Codex MCP retrofit (CDX-MCP, the `codex/*` tool surface) is tracked separately in `48_codex_program_plan.md` Phase 2 and is unaffected. No load-bearing commitment is touched.

## Reasoning

The customer-zero loop is push a model, see the site, run analysis, run a compliance review, submit. The review is one step in a single continuous architect workflow on one engagement. Splitting that step onto a separate artifact at a separate URL breaks the loop's continuity for the exact user the loop is built for. The Findings tab already exists on the engagement as the natural home for review output. The L-surface and engine review path are shared, so relocating the surface is a UI move, not an engine rebuild.

The standalone `codex-reviewer-qa` artifact is not deleted. It stays as the reference implementation for the eventual `smartcity-os` production reviewer surface (Codex Phase 4), which serves the city-reviewer audience, a different audience from the architect. CDX-Phase1-1's own reversal criteria anticipated this: it flagged revisiting if the reviewer-side and architect-side surfaces converge. They converged — for the architect's pre-submittal use, the review belongs in the architect's app.

## Reversal criteria

Revisit if the city-reviewer-side experience (Codex 1b production, Phase 4) and the architect-side pre-submittal review diverge enough that a shared in-app Findings surface no longer serves both, or if the Findings tab becomes overloaded enough that the review needs its own surface within the Design Tools app.

## Dependencies

Relocation is Phase 1 stream P1-4 of `_dispatches/2026-05-22_cc-agent-C_cortex_qa_build.md`. Updates `48_codex_program_plan.md` (the CDX-Phase1-1 row and the reviewer-side QA surface open decision). The standalone-artifact scaffold and the CDX-3/4/5/9 work are retained as the smartcity-os reference; no rework of that merged code, only a UI relocation into `design-tools`.

## Counterparties

Internal. Affects the M-CodexQA milestone path and the Codex Phase 2 surface placement.
