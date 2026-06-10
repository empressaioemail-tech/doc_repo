---
id: 2026-06-10_cc-agent-C_cortex_intake_chat_wedge_fixes
title: Dispatch — Cortex intake + chat wedge fixes (pre-model chat, multi-attach, image reading)
date: 2026-06-10
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
status: FIRE-READY — HIGH PRIORITY (blocks the web-first wedge + a live customer); folds into the product-polish / C1 lane
related: [58_gtm_readiness_sprint, _decisions/2026-06-08_reasoning_not_text_grounding_and_web_first_gtm, _decisions/2026-06-08_cortex_7k_launch_phased_demo_first, _decisions/2026-06-08_buy_not_build_cortex_cockpit, 20_agent_operating_rules]
---

# Cortex intake + chat wedge fixes

> Operator dogfooding on a real customer bid (a 3-story San Marcos triplex) surfaced three intake/chat bugs that each break the **web-first wedge** the FB-group launch depends on: the wedge is "upload a plan and chat/review it before any model exists," and the FB audience are builders/designers who upload IMAGES and PDFs, not Revit models. The live product blocks exactly that flow. These are not generic polish — they gate the launch wedge, so they ride near the front of the cc-agent-C product lane. Each is a contained cortex-api / Cortex-web fix; none requires the engine.

You are **cc-agent-C**, single owner of the `P:\legacy-design-tools` clone (use a separate worktree on a `cortex/` branch if the main clone is busy on another run). Model: **Grok Build 0.1** (multi-file/agentic); escalate to Claude only on failure after retry, log it.

## Read first

1. [`58_gtm_readiness_sprint.md`](../58_gtm_readiness_sprint.md) — the launch gate + the web-first wedge
2. [`_decisions/2026-06-08_reasoning_not_text_grounding_and_web_first_gtm.md`](../_decisions/2026-06-08_reasoning_not_text_grounding_and_web_first_gtm.md) — the web-first wedge ("any architect anywhere, day one, no onboarding")
3. [`_decisions/2026-06-08_buy_not_build_cortex_cockpit.md`](../_decisions/2026-06-08_buy_not_build_cortex_cockpit.md) — the Opus-4.8 per-discipline VISION capability already in the finding engine (the Miami keystone read PDF + images); fix 3 REUSES this, it is not greenfield
4. [`20_agent_operating_rules.md`](../20_agent_operating_rules.md) — HR-1, HR-2, HR-3, HR-8, HR-11

## The three fixes

1. **Decouple AI/chat + attachment upload from the Revit push.** Today the chat/AI is gated until a project is pushed from Revit, even after the operator completed project creation. A user must be able to upload attachments and chat with the engagement BEFORE (and without) any Revit/IFC geometry. Recon the gate (where the chat/finding path requires a pushed snapshot/geometry), and allow the engagement chat + attachment intake to function on an engagement that has zero geometry — the brief/finding/chat path grounds on the uploaded documents + web-first code reasoning, not the Revit model. Geometry, when it arrives, enriches; it must not be a precondition. (This is the exact web-first wedge: address + uploaded plan → grounded review, no model required.)

2. **Multi-attachment select.** The chat attachment picker accepts one file at a time; a user must be able to select and attach MULTIPLE files in one action (a typical plan set is 5+ images/sheets). Fix the attach control + the upload handler to accept a multi-file selection and carry all attachments into the chat context.

3. **Chat reads images (wire VISION into the chat-attachment path).** Image attachments (PNG/JPG) currently reach the chat with no OCR/vision — the model reports it cannot read them. The Opus-4.8 per-discipline vision capability already exists in the finding engine (it read the Miami PDF + images for the keystone). Wire that vision/extraction path into the chat-attachment read so an uploaded image is actually interpreted (sheet content, dimensions, schedules), not just listed. Respect the quality gate: extracted content carries its source + verification state; never present an unverified image read as authoritative. PDFs should use the existing PDF text/vision extraction; images use the vision path.

## Acceptance criteria

- An engagement with NO Revit geometry can upload attachments and run the chat/AI; the gate that required a pushed model is removed for the chat/intake path (geometry enriches, never gates).
- The chat attachment picker accepts a multi-file selection in one action; all attached files enter the chat context.
- Image attachments are read via the existing Opus-4.8 vision path (sheet content/dimensions extracted); PDFs via the existing extraction; extracted content carries source + verification state (quality gate); no unverified read presented as authoritative.
- The three fixes verified end-to-end on a real image plan set (the operator's San Marcos set is the live test case): upload 5 images pre-Revit, chat reads them.
- CI green. PRs held for operator merge. Verbatim verification artifacts (HR-8).

## Reporting

Write to `P:\doc_repo\_inbox\` as `2026-06-10_legacy-design-tools_cc-agent-C_cortex_intake_chat_wedge_fixes.md`: the recon (where each gate/limit lived), the fix per item, the end-to-end verification on an image plan set, PR URL(s) + SHA(s), and blockers verbatim.
