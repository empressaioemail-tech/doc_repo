---
decision_id: 2026-05-21_codex_reviewer_qa_surface_location
date: 2026-05-21
owner: Nick
status: active
related_canonical: [48_codex_program_plan, 11_roadmap, 28_mcp_first_product_design, 43_cortex_qa_backlog]
---

## Decision

The Codex 1b reviewer-side QA surface lives as a new dedicated `codex-reviewer-qa` artifact in the `legacy-design-tools` repo. This resolves CDX-Phase1-1, the open Phase 1 design call in `48_codex_program_plan.md`.

## Context

`48_codex_program_plan.md` Phase 1 carried CDX-Phase1-1 as an open sprint-level design call: decide where the Codex 1b reviewer-side QA surface lives in `legacy-design-tools`. Three options were on the table: extend the existing `plan-review` artifact with a reviewer-mode, create a new artifact, or extend the `qa` artifact.

Two facts shape the call. First, per `48_codex_program_plan.md`, the `plan-review` artifact today is the architect-side window onto what the reviewer will see, not the reviewer surface itself; the reviewer-side surface is unbuilt. Second, the production reviewer surface for Codex 1b eventually ships into the `smartcity-os` Plan Review surface (Phase 4); the `legacy-design-tools` reviewer surface is a QA-readiness surface, not the production home.

## Structural commitment check

Pre-mortem run 2026-05-21, cleared green. Commitment 4 (dual interface): Codex is an existing UI-first product and its MCP retrofit already shipped as the `codex/*` tool surface (combined Cortex/Codex sprint Lane B); the new artifact is the UI side of an existing product, consistent with the principle. No load-bearing commitment is touched. One operational flag on the focus-queue rule: `legacy-design-tools` already has two concurrent agents (cc-agent-C on the Cortex QA close-out, cc-agent-AC on QA-17). That is resolved by activation-gating the build dispatch behind cc-agent-C's close-out merge, so cc-agent-C owns the scaffold as the repo expert with no third clone.

## Reasoning

Extending `plan-review` was rejected: it entangles a permanent architect-side artifact with a temporary QA surface and accretes mode flags across two audiences. Extending `qa` was rejected: `qa` is a test harness, and the reviewer QA surface must be the reviewer experience itself (findings, adjudication, jurisdiction switcher, comment letter) so Nick can structurally evaluate every output per the 8-point QA-readiness definition. A test harness is the wrong shape for that.

A dedicated `codex-reviewer-qa` artifact gives clean separation by audience (reviewer, not architect) and a clean lifecycle: QA-readiness now, and a reference for the eventual `smartcity-os` production reviewer surface later. The repo is already modular (`api-server`, `design-tools`, `mockup-sandbox`, `plan-review`, `qa`); a sixth artifact fits the structure. The name `codex-reviewer-qa` is Codex-branded, where `plan-review` carries the legacy "Plan Review" name that brand-migration Stream G renames. It was chosen over the `codex-1b-qa` form floated in `48_codex_program_plan.md`: doc conventions discourage version and phase numbers in names, and "1b" is a phase marker, not a permanent product distinction.

## Reversal criteria

Revisit if the eventual `smartcity-os` production reviewer surface (Codex Phase 4) makes a separate `legacy-design-tools` artifact redundant rather than a useful reference; or if the reviewer-side and architect-side surfaces converge enough in practice that a single artifact with a mode toggle becomes genuinely simpler than two.

## Dependencies

Resolves CDX-Phase1-1 in `48_codex_program_plan.md` Phase 1. The scaffold build is dispatched to cc-agent-C at `_dispatches/2026-05-21_cc-agent-C_codex_reviewer_qa_scaffold.md`, activation-gated behind cc-agent-C's Cortex QA close-out (PRs #59-62) merging, so no third agent runs concurrently in `legacy-design-tools`. The reviewer-surface build proper (CDX-3 one-click review, CDX-4 adjudication loop, CDX-5 jurisdiction switcher) is `48_codex_program_plan.md` Phase 2 and a later dispatch. Advances the M-CodexQA milestone in `11_roadmap.md`.

## Counterparties

Internal. Affects the M-CodexQA milestone path and cc-agent-C's dispatch queue.
