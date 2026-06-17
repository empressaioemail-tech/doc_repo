---
id: 2026-06-17_extension-agent_investor_radar_capture_signup
title: extension-agent — investor verdict reframe, universal capture, signup, asserted-confidence (hauska-brief-extension)
date: 2026-06-17
agent: extension-agent
repo: hauska-brief-extension
kind: dispatch
related: [75i_investor_radar_prelaunch_sprint, 75g_investor_deal_radar, 2026-06-17_cc-agent-C_investor_radar_cotality_depth]
supersedes: 2026-06-16_extension-agent_investor_deal_radar_surfaces (lead feed cut; capture model added)
blocked_on: live verdict/profile data from cc-agent-C; the UI shell + capture + signup can start against the approved mockups.
---

# extension-agent — investor radar surfaces (re-issued per the 2026-06-17 handoff)

> **RESKIN RELEASED 2026-06-17.** The task-6 reskin HOLD clears: claude design delivered stable tokens at `P:\hauska-brief-extension\Hauska site\hauska.css` (editorial palette, Hauska wordmark + radar-sweep mark, verdict colors, 380px-proven). Reskin the panel + profile workspace to `hauska.css` now — the current build is structure-only functional CSS and looks unbranded. Keep the asserted-confidence renderer. The hosted auth page (cortex-api, cc-agent-C task 8) consumes the SAME tokens so the panel and the sign-in/signup page match.

Single owner of `hauska-brief-extension`. Spec: [`75i`](../75i_investor_radar_prelaunch_sprint.md). Mockups (design contract): `p:\tmp\extension-proposal\` (1 deal radar panel, 2 profile workspace; the lead-feed mock `3_identity_and_leads.html` is **deprioritized** — the lead feed is CUT; owned-identity export is an optional stretch only).

Model (HR-12): Grok Build 0.1; grok-code-fast-1 for CSS reskin.

**First:** merge the `extension/unified-signin-v067` baseline; unify the version drift; rebuild bundles.

## Tasks (75i numbering)

6. **Investor verdict reframe**: headline deal / worth a look / dead + the investor cards (`lay-summary.js`, `lay-render.js`, `intel-panel.js`), keyed to the canonical Cotality parcel id from the backend. The profile / "who you are" workspace (reskin `research/research.html`). **No lead feed surface.**
   - **Confidence renders as ASSERTED-with-provenance**, not a bare earned number, until calibration is live (read the `kind` field off the sealed envelope; commitment #2). No `1.0`/"100%" shown.
7. **Universal capture**: works on any page, not just listing hosts. Implement select-to-analyze (`contextMenus` on text selection), auto-detect (address pattern on the active page), and manual paste into the panel; hotkey already exists. Site adapters (Zillow/Redfin/Matrix) stay as optional enrichment only. Use `activeTab` + `contextMenus` for everywhere-mode so no broad host permission is needed (this also serves G4).
8. **Signup + sign-in**: add a signup path (today sign-in only) and style the flow; surface both in the panel.
11. **Site map (Max), rough render**: in the workspace (not the 380px panel), render the parcel-keyed layers from cc-agent-C's seam-fronted layer capability with a light map lib (Mapbox/Leaflet/deck.gl). Build the render as the **rough cut of a shared component** (Chris polishes it into the publishable package later); structure it so Cortex/SmartCity can reuse it. **Cited reasoning rendered spatially** (verdicts/findings/floodway-vs-buildable/OZ pinned to locations), free federal geometry as the canvas, never sold as raw geometry. Each layer shows **vintage + confidence-kind** off the sealed envelope. **Max-tier gated.** Sequenced after the backend layer capability lands; the verdict/capture/signup work is not blocked on it. Hold any panel reskin until the claude-design tokens are stable (avoid a double reskin).

## Constraints

Reasoning, not raw fields; never "value"; carry the not-an-appraisal disclaimer (G3). No model keys in the extension. Remove any remaining Regrid copy.

## Report back

`P:/doc_repo/_inbox/2026-06-17_hauska-brief-extension_extension-agent_investor_radar_capture_signup_close.md` — version bump, screen recording of the verdict + capture (select-to-analyze on a non-listing page) + signup, and the confidence-rendering proof (asserted, not bare).
