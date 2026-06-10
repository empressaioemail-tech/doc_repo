---
id: 2026-06-10_cc-agent-C_cortex_artifact_ux
title: Dispatch — Cortex artifact UX (auto-navigate to artifact + letter document view + download/print)
date: 2026-06-10
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
status: FIRE-READY — HIGH (dogfooding on a live deliverable letter); pairs with the wedge fixes; fold into the product-polish / C1 lane
related: [58_gtm_readiness_sprint, _dispatches/2026-06-10_cc-agent-C_cortex_intake_chat_wedge_fixes, _decisions/2026-06-08_reasoning_not_text_grounding_and_web_first_gtm, 20_agent_operating_rules]
---

# Cortex artifact UX — land on the artifact, read it like a document, download it

> Operator dogfooding produced a real deliverable letter (the San Marcos triplex Pre-Bid Code & Scope Analysis) and hit a broken artifact flow: the chat creates the letter but does not navigate to it; the letter renders as a stack of editable section boxes (an editor, not a document); the pane will not scroll; and there is no download/print. The artifact flow — chat creates it → center lands on it → read it as a document → download/print/send — is core to the product's perceived value. Same lane as the wedge fixes; contained cortex-api / Cortex-web work; no engine.

You are **cc-agent-C**, single owner of the `P:\legacy-design-tools` clone (separate worktree on a `cortex/` branch if the main clone is busy). Model: **Grok Build 0.1**; escalate to Claude only on failure after retry, log it.

## Read first

1. [`_dispatches/2026-06-10_cc-agent-C_cortex_intake_chat_wedge_fixes.md`](2026-06-10_cc-agent-C_cortex_intake_chat_wedge_fixes.md) — the paired wedge fixes
2. The Cortex-web Review → Letters surface (`artifacts/codex-reviewer-qa` or the Cortex SPA letter components) + the chat artifact-event path + the briefing **Export PDF** pattern (reuse it)
3. [`20_agent_operating_rules.md`](../20_agent_operating_rules.md) — HR-1, HR-2, HR-3, HR-8, HR-11

## The three fixes

1. **Auto-navigate the center pane to the artifact on creation.** When the chat produces an artifact (deliverable letter, finding, brief, or any produced artifact), the chat's artifact-created event should carry a navigation target, and the center pane should auto-navigate to that artifact's view with it **opened/selected** (e.g. letter → Review → Letters with the new letter open). Generic across artifact types, not letter-only. At minimum a prominent one-click "Open <artifact> →" in the chat result that navigates; the preferred behavior is auto-land on completion.

2. **Render the letter as a DOCUMENT, not a form.** Today the letter is a stack of editable section boxes (per-section textarea + kind dropdown + "Save section") — an editor view only, and it does not scroll. Add a **read/preview mode** that assembles the letter sections (cover, intro, per-comment/sections, signature) into one continuous, business-letter-styled document that reads like a PDF, and make it the **default** landing view. Keep the existing section editor behind an **"Edit"** toggle. **Fix the scroll** (the letter pane needs proper bounded height + `overflow-y` so long letters scroll). Preserve the provenance display (the per-section provenance / confidence + verification) in the editor; the read view can show it compactly or on hover.

3. **Download + Print.** Add **Download PDF** and **Print** on the letter, reusing the briefing Export-PDF pattern. The read/preview document IS the print/PDF layout (clean letter styling, signature block, the jurisdiction-caveat disclaimer intact). The downloaded letter must carry its provenance/verification honestly (quality gate) — do not strip the unverified-status disclaimer on export.

## Acceptance criteria

- Creating an artifact from the chat auto-navigates the center pane to that artifact, opened (or a prominent one-click open that navigates); works for the letter and generalizes to other artifact types.
- The letter has a default read/preview document view (continuous, letter-styled, reads like a PDF) + an Edit toggle for the section editor; the pane scrolls.
- Download PDF + Print work and reuse the existing export pattern; the exported letter keeps its provenance + the unverified-jurisdiction disclaimer (quality gate).
- Verified end-to-end on the live San Marcos triplex letter (the operator's real deliverable).
- CI green. PR held for operator merge. Verbatim verification artifacts (HR-8).

## Reporting

Write to `P:\doc_repo\_inbox\` as `2026-06-10_legacy-design-tools_cc-agent-C_cortex_artifact_ux.md`: the recon (where the artifact-event nav, the letter render, and the export live), the fix per item, the end-to-end verification on the San Marcos letter, PR URL + SHA, and blockers verbatim.
