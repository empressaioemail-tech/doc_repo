---
id: 2026-05-21_cc-agent-C_codex_phase2_reviewer_surfaces
title: Dispatch — cc-agent-C Codex Phase 2 reviewer surfaces (CDX-3, CDX-4, CDX-5)
date: 2026-05-21
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
related: [48_codex_program_plan, 47_codex_plan_review, _decisions/2026-05-21_codex_reviewer_qa_surface_location, 28_mcp_first_product_design, 11_roadmap, 00_current_state, 20_agent_operating_rules]
---

# cc-agent-C dispatch — Codex Phase 2 reviewer surfaces

You are cc-agent-C. This dispatch builds the Codex 1b reviewer-side QA surfaces onto the `codex-reviewer-qa` artifact scaffold you shipped in PR #66. It is [`48_codex_program_plan.md`](../48_codex_program_plan.md) Phase 2, streams CDX-3, CDX-4, and CDX-5. This is the work that turns "engine produces output" into "Nick can structurally QA the reviewer experience" — the Codex 1b QA-readiness milestone, M-CodexQA.

## Activation gate

Fires after the cleanup-batch dispatch ([`2026-05-21_cc-agent-C_ldt_cleanup_batch.md`](2026-05-21_cc-agent-C_ldt_cleanup_batch.md)) merges. Same clone. Re-orient onto `main` and pull first.

## Foundation already in place

PR #66 shipped `artifacts/codex-reviewer-qa/`: a Vite/React SPA with the `QueryClientProvider` and wouter router wired, served at `/codex-reviewer-qa`. Your #66 session report confirmed the data path: this artifact consumes cortex-api's in-process L-surface (the L-routes already on api-server) via the generated `@workspace/api-client-react` client that `plan-review` and `design-tools` already use. It does NOT go through the MCP server — the in-app reviewer surface lives inside cortex-api. Add `@workspace/api-client-react` as the dependency with the first data-bound page, CDX-3.

## Scope — three streams, sequenced

Verify the cortex-api L-surface against source before building each stream, the same diagnose-first discipline as the WS-A/B/C dispatches. Do not trust this dispatch's description of the routes over what the code says; report any divergence in your `_inbox/` summary.

**CDX-3 — One-click AI review pass.** A reviewer-side trigger that runs the engine full-pass on a submission and renders the output as findings in the UI. This is the first data-bound page; it wires `@workspace/api-client-react`. Per `47_codex_plan_review.md` Wave 1 CDX-3.

**CDX-4 — Finding accept/edit/reject loop.** Per-finding adjudication UI: accept, edit (the reviewer can change finding text before accepting), reject. Adjudication state persists as atoms. Builds on CDX-3's rendered findings.

**CDX-5 — Jurisdiction switcher.** Runtime jurisdiction selection (Grand County, Bastrop UDC, and others as the corpus exists); findings update on switch.

## Hard requirement — sell reasoning, not data

Structural commitment 1 governs this surface. Every finding the UI renders carries its reasoning chain, source citation, confidence score, and timestamp, shown visibly rather than collapsed away to a bare pass-or-fail verdict. The engine produces these on every finding; the reviewer surface must surface them. A findings UI that shows verdicts without the reasoning chain fails the commitment and fails this dispatch. Adjudication atoms written by CDX-4 carry reviewer attribution and a timestamp.

## Out of scope — gated or other-owner Phase 2 streams

- **CDX-9** (comment-letter auto-draft) is gated on DA Phase 2 DA-5 (the `deliverable-letter` atom plus the DOCX/PDF pipeline). Not in this dispatch; it fires when DA-5 lands.
- **CDX-EngineHook-prep** is gated on the 27-A engine module-boundary refactor.
- **CDX-QA-1** (QA scenario documentation) is a planner deliverable that follows once CDX-3/4/5 produce evaluable output.
- **CDX-MCP** is `hauska-mcp-server` work, cc-agent-M Lane B. Not this repo.

## Verification

typecheck green; CI green; vitest coverage for the new surfaces. CI (Linux) is authoritative: the Windows workstation cannot run the vitest/esbuild toolchain. Verify on the CI run ID.

## Run posture

Operator-supervised, not maximum-autonomy. Open a PR for review. Do not self-deploy cortex-api. If CDX-3/4/5 together would make one PR too large to review, split by stream (CDX-3, then CDX-4, then CDX-5) and open them in sequence; note the split in your `_inbox/` report.

## Workspace ownership

cc-agent-C's `legacy-design-tools` clone. Branch under `codex-reviewer-qa/*`. Keep file overlap with cc-agent-AC at zero. If you enter a working directory and see another agent's uncommitted changes, stop and surface to the planner.

## Reporting

At every session break-point, write your session summary and any decision-relevant finding to `P:\doc_repo\_inbox\` as `<date>_legacy-design-tools_cc-agent-C_<topic>.md` per HR-11 in [`20_agent_operating_rules.md`](../20_agent_operating_rules.md). Do not commit to the doc repo. Keep the durable record in your own repo.
