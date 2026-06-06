---
id: 2026-05-29_extension-agent_brief_ux_polish
title: Dispatch — Property Brief extension UX polish (sources + inline refs)
date: 2026-05-29
agent: extension-agent
repo: hauska-brief-extension
kind: dispatch
related: [75c_property_brief_data_backlog, 2026-05-28_dispatch-B_extension_brief-atom-ux, 75a_hauska_brief_extension]
---

# Extension — brief UX polish (post v0.5.2)

You are **extension-agent** on `hauska-brief-extension`.

**Context:** Prod deploy PR #134 + v0.5.2 shipped. Operator feedback: chat replies too generic ("not in provided sections"); inline chips may not appear when `inlineRefs` empty.

## Model (HR-12)

**grok-code-fast-1** OK for copy-only; **Grok Build 0.1** if touching research-app flow.

## Tasks

1. **Honest empty-state copy** — When assistant reply has no matching citations / low confidence:
   - Link to collapsed **sources** (use `sources[]` from research chat API when present).
   - CTA: "Upload CC&Rs or HOA docs" → stub handler or `chrome.runtime.openOptionsPage` note until PB-301 UI lands.
2. **Inline refs** — Ensure `response.atoms.inlineRefs` from `/brief` and chat are merged in `enrichAssistantHtml()`; show chip row even for single ref.
3. **Schools / neighborhood starter** — If API returns no school data, reply template: "Municipal code does not include schools; verify with district maps" (no hallucination).
4. Bump manifest patch (e.g. `0.5.3`); `node scripts/build.mjs`.

## Out of scope

- Paywall UI
- Encumbrance upload backend (cc-agent-C PB-301)

## Acceptance

- [ ] Consumer mode: empty citation path shows sources link + upload hint.
- [ ] `inlineRefs` from prod `/brief` render as chips when non-empty.
- [ ] Build green.

## Report back

`P:/doc_repo/_inbox/2026-05-29_hauska-brief-extension_extension-agent_brief_ux_polish_close.md`
