---
id: 2026-06-16_extension-agent_investor_deal_radar_surfaces
title: extension-agent — Investor Deal Radar surfaces (radar panel, profile workspace, identity card)
date: 2026-06-16
agent: extension-agent
repo: hauska-brief-extension
kind: dispatch
related: [75g_investor_deal_radar, 2026-06-16_cc-agent-C_investor_deal_radar_backend]
blocked_on: Wave 1/2 API shape (investor verdicts + headline + profile) from cc-agent-C for live data; UI shell can start immediately against the approved mockups.
---

# extension-agent — Investor Deal Radar surfaces

You are the **extension-agent**, single owner of `hauska-brief-extension` for this run. Product context: [`75g_investor_deal_radar.md`](../75g_investor_deal_radar.md). Build the three approved surfaces.

**Approved mockups (build to these, they are the design contract):** `p:\tmp\extension-proposal\` — `1_deal_radar_panel.html`, `2_profile_workspace.html`, `3_identity_and_leads.html`. They reuse the live tokens (Replit blue `#2196f3`, the green/amber/red verdict system, the confidence meter), so this is a reskin and reframe, not a new design system.

## Model (HR-12)

Default **Grok Build 0.1**. `grok-code-fast-1` fine for the CSS-heavy reskin passes.

## First

Confirm the working baseline. The repo is on branch `extension/unified-signin-v067`, two commits ahead of `main` with uncommitted edits (the content-script to background `SIGN_IN` delegation). Commit/merge that baseline first so you build on a clean ref. Re-run `node scripts/build.mjs` after each source change to refresh the in-place bundles (`content-bundle.js`, `panel-bundle.js`, `popup.js`, `research-bundle.js`), which are committed.

## Task 1 — Deal radar panel (mockup 1)

Reframe the on-listing panel from consumer verdict rows to the investor radar: a headline verdict (deal / conditions / dead) with a confidence meter, the investor verdict cards, a fits-your-box signal, and Keep / Pass actions.

- Edits: `src/lib/lay-summary.js` (consume the new investor verdict set + headline from the API; keep the rules fallback), `src/lib/lay-render.js` (headline card + investor cards + Keep/Pass), `src/content/intel-panel.js` (panel layout).
- Keep/Pass posts to the profile capture endpoint (Wave 2) and reflects the running count.

## Task 2 — Proactive cheap auto-run (cost control is mandatory)

Today the brief runs manually. The background worker already detects listing pages (`property-detect.js`) and glows the icon. On listing detect, auto-run a **cheap deterministic radar pass** (parcel + flood + zoning + deed/HOA flags, no LLM, served from cache/snapshots where possible) and render the headline verdict. The **full cited brief** (LLM) runs only on click.

- Do NOT auto-fire the full LLM brief on every page view. The radar pass must be cheap and fast. Wire it as a distinct lightweight call, confidence-gated, so a low-confidence radar result degrades honestly rather than interrupting.
- Respect consent: no auto-run before terms acceptance (existing `hasLocalConsent` gate).

## Task 3 — Profile / who-you-are workspace (mockup 2)

Reskin the existing three-column research page (`research/research.html` + `research-app.js`), do not rebuild it. Left rail becomes "your research" history with verdict dots; center becomes the continuous dated dialogue thread; right rail flips from attachments to "who you are" (thesis, learned buy box, blind spots), fed by the Wave 2 profile synthesis.

## Task 4 — Identity card (mockup 3)

The only net-new surface. A provenance-backed investor identity card (thesis, the researched/pursued/offered stats, share + export) and the "new in your box" lead feed (Wave 4). Gate the raw Cotality-derived figures behind the same display posture as the panel.

## Constraints

- Reasoning, not raw data: render derived verdicts with citations + confidence; never a raw Cotality field. Use "estimated sale price / rent / worth," never "value." Carry the not-an-appraisal disclaimer (G3).
- No model keys in the extension. All LLM runs server-side.
- Web Store readiness (G4) is a later pass; note but do not yet narrow host permissions in this dispatch unless trivial.

## Report back

`P:/doc_repo/_inbox/2026-06-16_hauska-brief-extension_extension-agent_investor_deal_radar_surfaces_close.md`. Include the version bump, screenshots or a screen recording of each surface, and the cheap-radar-pass latency on a real Zillow listing.
