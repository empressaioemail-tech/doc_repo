---
id: 2026-05-22_cc-agent-C_cdx9_comment_letter
title: Dispatch — cc-agent-C CDX-9 Codex comment-letter auto-draft
date: 2026-05-22
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
related: [48_codex_program_plan, 47_codex_plan_review, 42_design_accelerator_program_plan, 28_mcp_first_product_design, 00_current_state, 11_roadmap, 20_agent_operating_rules]
---

# cc-agent-C dispatch — CDX-9 Codex comment-letter auto-draft

You are cc-agent-C. This dispatch builds CDX-9: comment-letter auto-draft on the Codex reviewer surface (`codex-reviewer-qa`). It is [`48_codex_program_plan.md`](../48_codex_program_plan.md) Phase 2, stream CDX-9, and it is the next fireable cc-agent-C piece of M-CodexQA after the CDX-3/4/5 reviewer surfaces shipped (PRs #69/#70/#71).

## Status verified against the live repo

This dispatch was scoped against the live `legacy-design-tools` repo, not the doc set:

- CDX-9's gate (DA-5: the `deliverable-letter` atom plus the DOCX/PDF render pipeline) is satisfied. Lane C.4 shipped DA-5's runtime: the L3 endpoints (`routes/deliverableLetters.ts`, PR #48) and the L6 render pipeline (`routes/deliverableLetterRenders.ts`, PR #51), both merged to `main` 2026-05-20. The `deliverable-letter` and `deliverable-letter-render` atom shapes are locked.
- CDX-9 itself is not built: no codex-reviewer-qa PR (#66/#69/#70/#71) touches it.
- The codex-reviewer-qa artifact (CDX-3/4/5: `ReviewPage`, `FindingCard`, the adjudication loop, the jurisdiction switcher) is the surface CDX-9 extends.

## What CDX-9 is

Per 48: generate a comment letter as a `deliverable-letter` atom plus a DOCX/PDF render, **reusing the DA-side pipeline** (the shared `deliverable-letter` implementation from DA-5). Do not build a second deliverable-letter pipeline. CDX-9 wires the codex-reviewer-qa review surface to the existing L3/L6 endpoints.

The reviewer flow: a Codex review produces findings (CDX-3) which the reviewer adjudicates accept / edit / reject (CDX-4). CDX-9 turns the adjudicated finding set for a submission into a comment letter, the reviewer-side deliverable an AHJ or plan reviewer sends back.

## Scope

Diagnose-first, as on CDX-3/4/5: read the L3 (`routes/deliverableLetters.ts`) and L6 (`routes/deliverableLetterRenders.ts`) endpoints and the `deliverable-letter` / `deliverable-letter-render` atom shapes against source before building, and report any divergence in your `_inbox/` summary.

- A "draft comment letter" action on the codex-reviewer-qa review surface: from the current submission's adjudicated findings, generate a `deliverable-letter` atom via the existing L3 endpoints. The letter's sections are composed from the accepted and edited findings; rejected findings are excluded.
- A letter view on the codex-reviewer-qa surface: render the drafted letter, editable per section before finalizing, consistent with the L3 deliverable-letter UI conventions.
- Render to DOCX and PDF via the existing L6 render endpoints; a download action.
- Reuse `@workspace/api-client-react` (the L-surface client CDX-3 already wired into the artifact). No new deliverable-letter backend.

## Hard requirement — per-section provenance and sell reasoning

Structural commitment 1 governs the letter. The `deliverable-letter` atom already carries per-section provenance (each section names the L1 / L2 / finding / adjudication atoms that fed it). CDX-9 must populate that provenance honestly: every comment-letter section names the exact Codex finding and adjudication atom it was generated from. The letter is reviewer reasoning made into a deliverable; it carries its source findings, citations, and confidence, not bare assertions. A letter that drops provenance fails the commitment and fails this dispatch.

## MCP surface

CDX-9 needs no new MCP tool. The shared `deliverable-letter` implementation already has the `cortex/deliverable_letter_*` MCP tool surface (shipped Lane B). A `deliverable-letter` is the same atom regardless of which product drafts it, so the dual-interface principle is already satisfied through the shared pipeline. If diagnosis shows a real gap (a Codex-specific operation the existing tools cannot express), flag it for a planner call rather than building a tool unprompted.

## Out of scope

- Rebuilding the deliverable-letter pipeline, the L3/L6 endpoints, or the render pipeline: all shipped in Lane C.4.
- CDX-QA-1 (the QA scenario spec): a planner deliverable.
- CDX-EngineHook-prep (gated on the 27-A engine refactor) and CDX-MCP (cc-agent-M).

## Run posture

Operator-supervised, not maximum-autonomy. Open a PR for review; split if it grows large. Do not self-deploy cortex-api. CI (Linux) is authoritative; verify on the CI run ID, since the Windows workstation cannot run the vitest/esbuild toolchain.

## Workspace ownership

cc-agent-C's `legacy-design-tools` clone. Branch under `codex-reviewer-qa/*`. Re-orient onto `main`, pull, and run `pnpm install` before building (dependencies changed since #65/#67). Keep using explicit per-path `git add`: the four stray pre-existing modified test files in this clone must stay out of your branches.

## Reporting

At every session break-point, write your session summary and any decision-relevant finding to `P:\doc_repo\_inbox\` as `<date>_legacy-design-tools_cc-agent-C_<topic>.md` per HR-11 in [`20_agent_operating_rules.md`](../20_agent_operating_rules.md). Do not commit to the doc repo. Keep the durable record in your own repo.
