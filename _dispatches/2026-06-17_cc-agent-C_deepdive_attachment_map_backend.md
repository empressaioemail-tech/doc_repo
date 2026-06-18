---
id: 2026-06-17_cc-agent-C_deepdive_attachment_map_backend
title: cc-agent-C — research-chat contract + attachment complete-upload robustness + map-data for the Max hero
date: 2026-06-17
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
related: [2026-06-17_extension-agent_panel_ux_deepdive_attachment_map, _decisions/2026-06-17_map_extraction_shared_capability]
priority: pairs with the extension panel/deep-dive/attachment/map dispatch
---

# cc-agent-C — backend support for the deep-dive / attachment / map pass

The extension is wiring the panel inline chat, deep-research brief, attachment UI, and Max map hero. Backend support needed:

## 1. research-chat contract (deep-dive + inline panel chat)

`POST /api/brokerage/v1/research/chat` rejected a `{message, address}` body with `400 invalid_request "Invalid research chat body"`. The endpoint is alive; the extension needs the exact accepted contract. **Document and confirm** the required body shape (workspaceId? listingKey? starterPromptId enum? message field name?) and hand it to extension-agent so the inline panel chat and the deep-dive composer both post correctly. If the schema is stricter than it needs to be for a free-text follow-up, loosen it to accept a plain `message` + address/workspace.

## 2. Attachment complete-upload robustness

`POST /api/brokerage/v1/workspaces/encumbrances/complete-upload` **500s** on some PDFs (a minimal test PDF failed extract). Two fixes:
- A bad/unparseable PDF must return a graceful **4xx with a clear reason**, never a 500. The extension surfaces that inline.
- Confirm a real CC&R PDF completes (201) and the doc attaches to the workspace, tenant-private by installId + listingKey. Provide a known-good test PDF or steps so extension-agent can verify the ATTACHMENTS row end to end.

## 3. map-data for the Max hero

The extension is building the Max map as a hero section. Confirm `POST /api/brokerage/v1/map-data` (Max-gated; 403 tier_required below Max) returns the assembled **cited reasoning layers** (not raw geometry) the hero needs, on a real Bastrop parcel for a Max session. Confirm the response carries per-layer provenance/citation so the render stays commitment-#1-compliant (reasoning rendered spatially). Note any layer that's still stubbed. If a Max test entitlement is needed for extension-agent to see a 200, provide the path.

## Deploy

Only if a code change is required (the research-chat schema loosen, the complete-upload graceful error). Use the cortex-api canary sequence; --set-secrets names only existing secrets. If it's documentation/contract-only, no deploy — just hand the contracts to extension-agent in the close.

## Report back

`P:/doc_repo/_inbox/2026-06-17_legacy-design-tools_cc-agent-C_deepdive_attachment_map_backend_close.md` — the research-chat body contract (verbatim accepted example), the complete-upload graceful-error fix + a verified real-PDF 201, the map-data Max response shape + any stubbed layers, and any deploy revision.
