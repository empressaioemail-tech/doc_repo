---
id: 2026-05-29_replit_property_brief_ui_close
title: Close — Replit Property Brief UI export received
date: 2026-05-29
agent: replit-agent
repo: none
kind: close
related: [75f_replit_ui_export_package_spec, _dispatches/2026-05-29_extension-agent_replit_ui_port]
---

# Replit UI export — received and validated

## Drop location

```text
P:\replit-property-brief-ui-2026-05-29\replit-property-brief-ui\
```

(Operator path; canonical export root for extension-agent port.)

## Spec validation (75f §14)

| Item | Status | Notes |
|------|--------|-------|
| `index.html` | **PASS** | Standalone; embeds mock JSON for file:// preview |
| `styles.css` | **PASS** | Full token set; #2196F3 accent (see DELTA) |
| `preview.js` | **PASS** | Renders nav, chips, chat, share modal, attachments |
| `mock-data.json` | **PASS** | Bastrop example + extended fields |
| `components.md` | **PASS** | Region → DOM ID map complete |
| `DELTA.md` | **PASS** | Layout, tokens, new components documented |
| `CLOSE.md` | **PASS** | Summary + open questions |
| `README.md` | **PASS** | Present |
| `panel/panel.html` + CSS | **PASS** | Compact listing widget |
| `collaboration/share-modal.html` + CSS | **PASS** | Share + readonly banner reference |
| `screenshots/desktop-1280.png` | **MISSING** | CLOSE.md claims included; folder empty |
| `screenshots/mobile-390.png` | **MISSING** | Same |

**Verdict:** Export is **port-ready** except missing screenshot files. Visual acceptance can use local `index.html` preview instead.

## What Replit shipped (summary)

- **Layout:** Top action bar (collaborators, wallet, Share, Run brief, Settings) + header verdict pills + left property nav + chat-first main column
- **Collaboration:** Share modal (`#hauska-share-modal`), attachments drawer, collaborator avatars
- **Consumer mode:** `#citations-panel` hidden via `body.hauska-consumer-mode`
- **Brand:** "hauska property brief" (lowercase); accent `#2196F3` vs extension baseline `#38bdf8`
- **DOM hooks:** All §4 required IDs preserved per `components.md`

## Open questions (from Replit CLOSE.md — operator decide before port)

1. **Accent color:** Keep Replit `#2196F3` or revert to extension `#38bdf8`?
2. **Pro mode toggle:** Where does consumer/pro citations rail switch live?
3. **Share modal wallet copy:** Confirm final wording on collaborator billing

## Extension drift noted (pre-port)

`P:\hauska-brief-extension\research\research.html` on disk is **older** than `research.css` / `research-bundle.js` (missing `#property-nav`). Port should replace HTML + CSS from export and reconcile `src/research/research-app.js` (source may lag bundle).

## Next step

Fire **extension-agent** on:

[`_dispatches/2026-05-29_extension-agent_replit_ui_port.md`](../_dispatches/2026-05-29_extension-agent_replit_ui_port.md)

**Export root:** `P:\replit-property-brief-ui-2026-05-29\replit-property-brief-ui\`

**Target:** `P:\hauska-brief-extension` — port `index.html` → `research/research.html`, `styles.css` → `research/research.css`; wire new hooks in `research-app.js` to existing `workspace-api.js` / `brief-engine.js`.

**Do not copy:** `preview.js` (mock only). Wire live API paths instead.

## Operator smoke (30 sec)

Open in Chrome:

```text
P:\replit-property-brief-ui-2026-05-29\replit-property-brief-ui\index.html
```

Confirm: property nav, 6 chips, chat thread, share modal opens, attachments drawer expands.
