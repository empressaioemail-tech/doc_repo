---
id: 2026-07-29_pe_workbench_concept_spec
title: PE Workbench — concept spec (bubble cluster + shared persistent dock + atom-cited AI chat)
date: 2026-07-29
status: spec (for the QA planner to run as a planner-manages-background-agents build)
owner: nick
related: [_STATE.md, 28_THE_BASTROP_MOLD_engine_build_spec, 2026-07-27_app_vs_cc_report_audit, 75a_hauska_brief_extension, 75j_property_explorer_destination_ledger]
origin: PE was born from the hauska-brief-extension (P:\hauska-brief-extension). This spec recaptures the extension's ESSENCE (personal, verdict-first, conversational, accumulating, shareable) onto PE's clean map-first UX — WITHOUT the extension's cluttered split-screen look/feel.
---

# PE Workbench — concept spec

Turn Property Explorer from a VIEWER into a WORKBENCH. The clean, map-first, property-led UX we have now is RIGHT and stays. Every capability lives as a bubble in the top-right cluster that opens into the ONE shared dock — the same space the property brief uses today — one tool open at a time, state persistent across open/close, all scoped to the active property.

## THE DESIGN LAW (non-negotiable — this is what keeps it from becoming the old split-screen extension)

The brief extension's essence was right but its LOOK/FEEL was a cluttered split-screen. PE keeps the clean map and recaptures the essence as AMBIENT capability:
- THE MAP + PROPERTY STAY THE CLEAN STAR. No permanent second surface. Leading with properties is a visual exercise; keep it visual.
- ONE DOCK, ONE OPEN TOOL AT A TIME. Every bubble opens into the SAME dock the brief uses now. Opening a bubble replaces what's in the dock. There is never a split screen and never two docks.
- PERSISTENT PER-PROPERTY. Each tool remembers its state across open/close for the active property (close chat mid-conversation, open the brief, reopen chat — the conversation is still there). Switching properties re-scopes every tool.
- SUMMONABLE + DISMISSABLE. Bubbles expand on tap, collapse away. The only always-on element is the bubble cluster itself.
- If a feature wants a permanent panel or a split screen, it is designed WRONG — redesign it as a bubble-into-the-dock. Judge every feature against this law.

## THE BUBBLE CLUSTER (top-right) — the tools

Each is a bubble; each opens the shared dock; one at a time; persistent.

### 1. PROPERTY BRIEF (exists today — becomes one bubble)
The Alder-style cited brief already in PE. Changes: it becomes a bubble in the cluster (not the default-and-only dock content), and it LEADS with a plain-English VERDICT LINE (the Carfax glance — "buildable, low flood risk, standard residential lot — no red flags") before the cited detail. Close + export-PDF stay.

### 2. AI CHAT (Deep Research) — the highest-value recapture
A conversation about the active property. START FROM WHERE THE OLD EXTENSION'S CHAT WAS in FUNCTION + FLOW (not look/feel — that gets revised after v1). The reference implementation is in the brief extension:
- STARTER CHIPS seeded per property (extension: `INVESTOR_STARTER_PROMPTS` in `src/lib/lay-render.js` — e.g. "What are the top deal killers on this parcel?"). v1 can start from those; later revise to seed from the property's actual atoms.
- ATOM-CITED ANSWERS THAT EXPAND INLINE (the specific behavior the operator wants as the starting point): the AI's answer text carries atom markup `{{atom:entityType:entityId:label}}` which renders as an inline CHIP; clicking the chip EXPANDS THE ATOM IN-THREAD (the cited code/zoning/setback atom, with a FRESHNESS BADGE) — not a separate panel, expanded inline in the conversation. Reference mechanism: `src/lib/inline-atoms.js` (`inlineRefsFromBrief`, `parseAtomMarkupInHtml`, `wireInlineAtomExpand`) + `atom-freshness.js`. This is "sell reasoning not data" in conversation form: the chat doesn't just answer, it cites the zoning/code/setback atom and lets you expand the receipt inline.
- Persistent chat history per property.
Port the FUNCTION + FLOW (starter chips → chat → atom-markup answers → inline-expand-with-freshness). Look/feel is PE-native + revised post-v1.

### 3. REPORTS / TOOLS
The run-a-report actions on the active property, as bubble content: site-plan export, terrain export, + the reports PE offers. This is the "which reports does PE surface" question made visual — start with what PE already exports; the broader report set is a later product decision (do NOT balloon this into building new reports).

### 4. MY PROPERTIES (Workspace)
Saved properties the user is tracking (extension had recent/reopen/workspace). Each holds its brief + drawings + notes. Reopening navigates the map + dock to that property. Save-property is the accumulation loop.

### 5. SHARE
A link that carries the user's ANALYSIS, not just a parcel link: the brief + the DRAWINGS + the site plan travel with it (the realtor-hands-a-client wedge — "look like the most informed person in the room"). Drawings share too.

## WHAT'S NEW vs SURFACING-EXISTING (scope honesty)

- NEW UX: the bubble cluster + the shared-persistent-dock mechanic (generalize the brief dock so any tool opens into it, one at a time, persistent); the verdict line; save/workspace; share-with-drawings.
- NEW CAPABILITY: property-scoped AI chat with atom-markup answers + inline-atom-expand + freshness (ported function/flow from the extension).
- SURFACING EXISTING: brief (move into a bubble), reports/exports (move into a bubble), drawings.

## NOT IN THIS BUILD (noted, deferred)
- The browser EXTENSION as top-of-funnel (Carfax glance on Zillow/Redfin → "open in PE"). Later.
- County-records docs on the parcel (Vertosoft channel) — they LAND in the share/workspace when that program delivers; not built here.
- The broader PE report-set product decision (which of the ~15 spine functions PE offers) — later; this build surfaces what PE already exports.
- Seeding chat starter chips from the property's live atoms (v1 uses the extension's starter set; operator revises post-v1).

## EXECUTION

Give this to the QA planner to run as a PLANNER-MANAGES-BACKGROUND-AGENTS build (planner plans/dispatches/verifies-live/owns-deploys; never sub-agent self-grade; standing-decisions block pasted into every sub-dispatch). Verify on the LIVE PE surface across multiple properties (code-done != customer-done). Update _STATE.md as state changes.

Suggested decomposition:
- W1: the shared-persistent-dock mechanic + bubble cluster (the chassis every tool plugs into — build first).
- W2: move Brief + Reports into bubbles; add the verdict line to the brief.
- W3: AI chat bubble — port the extension's function/flow (starter chips → chat → atom-markup → inline-expand-with-freshness; reference src/lib/inline-atoms.js + lay-render.js). Wire to the live cited spine.
- W4: My Properties (save/workspace/reopen) + Share (link carries brief + drawings).

Design law governs every unit. If a sub-agent proposes a permanent panel or split screen, reject it — bubble-into-the-dock only. CTX HELD (this is PE product work, unrelated to the fan-out).
