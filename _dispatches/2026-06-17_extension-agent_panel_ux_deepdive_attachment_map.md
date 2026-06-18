---
id: 2026-06-17_extension-agent_panel_ux_deepdive_attachment_map
title: extension-agent — panel UX polish + inline chat + deep-research brief + attachment UI + nav + Max map hero
date: 2026-06-17
agent: extension-agent
repo: hauska-brief-extension
branch: extension/unified-signin-v067
kind: dispatch
related: [2026-06-17_cc-agent-C_deepdive_attachment_map_backend, 75i_investor_radar_prelaunch_sprint, _decisions/2026-06-17_map_extraction_shared_capability]
---

# extension-agent — panel UX + deep research + attachment + map

Live QA on v0.6.14 (great progress — correct address, free briefs, real verdict). Fine-tuning batch, in priority order. The core interaction loop (A-D) first; deep research (E) is the hard blocker; attachment (F) and Max map (G) after.

## A. Panel: the verdict header card is too big / clips

The "Workable, verify a few things" card (intel-panel) is oversized and the **bottom is cut off**. Fix the card sizing/overflow so nothing clips — let the panel scroll, cap the header card height, ensure the full card + the cards below are reachable. Make the overall brief panel **slightly wider**.

## B. Panel: make the signal cards expandable inline

The cards below the header (Rehab reality, Can I add a unit?, ADU / guest house, Wetlands / habitat, Soils, Flood risk, Major restrictions) are currently static. Make each **clickable to expand** its detail inline (the reasoning + citation/provenance for that signal), collapse on second click. The data is already in the brief payload (the per-section reasoning that today only shows on the deep-dive page) — surface it here on demand.

## C. Panel: continue the conversation inline

The user should be able to **keep researching in the panel** without leaving for the deep-dive page. Add an inline composer to the panel (same `/research/chat` the deep-dive page uses, via the existing research-api). Render the back-and-forth in the panel. "Deep research" stays as the full-page escape hatch, not the only way to ask a follow-up.

## D. "Research a property" does nothing

The "+ Research a property" control (deep-research left rail; research-app.js around the `"Research a property"` label at :1413, and the panel equivalent) is dead. Wire it: it should open a fresh research workspace / address-entry that runs a brief. Confirm the click handler is bound and the action fires.

## E. Deep research lands blank — HARD BLOCKER ("not working at all")

Landing on research.html shows the address + `in_corpus` + chips but an **empty brief body** ("Run a brief to start your profile"). The page has all the machinery (`renderBrief`, the loading/terminal states, `saveLastBriefToStorage` imported at :27) but never populates.

- **On landing, show a high-level property brief already set up.** Carry the brief the panel just ran (via `saveLastBriefToStorage` / shared storage) into the deep-dive page and `renderBrief` it immediately; if none exists for this workspace, auto-run one (RUN_BRIEF at :954) and render. Never land on a blank body.
- Confirm the chat composer actually posts to `/research/chat` and renders replies (backend is alive; if the body shape is rejected use cc-agent-C's contract — see the paired backend dispatch). The deep-dive must be functional end to end before this closes.

## F. Attachment: file picker opens, then nothing

Selecting a file does nothing visible. Wire the full flow through `encumbrance-upload-api.js`: presign → PUT to GCS → complete-upload → **show progress, then the attached doc row in ATTACHMENTS, or an inline error**. Today the bytes may upload but the UI never reflects it. Pair with cc-agent-C (complete-upload currently 500s on some PDFs — handle a non-2xx complete gracefully with a visible error, don't swallow it).

## G. Max tier: where is the map? Build the hero

In Max tier the map should be a **hero section with strong visuals**, not absent. The map-data BFF is live (cc-agent-E `00008-qaw`, Max-gated via cc-agent-M; `POST /map-data` returns 403 tier_required below Max — expected). Build/finish the Max map render as a hero at the top of the brief (panel and/or deep-dive), consuming `/map-data`, rendering the cited reasoning layers spatially (per the map-extraction decision: cited reasoning rendered spatially, NOT raw geometry). Gate it to Max; free/Pro see the upgrade affordance. Report the current state of the map render component if one already exists.

## Report back

`P:/doc_repo/_inbox/2026-06-17_hauska-brief-extension_extension-agent_panel_ux_deepdive_map_close.md` — version bump; per-item status A-G; screen captures of (1) the panel with the header card no longer clipped + expandable cards open, (2) inline panel chat working, (3) deep-research landing with a populated brief, (4) an attachment showing in ATTACHMENTS, (5) the Max map hero (or its current state); prod-verify re-run.
