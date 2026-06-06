---
id: TEMPLATE_replit_property_brief_ui_close
title: TEMPLATE — Replit export drop (operator)
date: YYYY-MM-DD
agent: replit-agent
repo: none
kind: close
related: [75f_replit_ui_export_package_spec, _dispatches/2026-05-29_extension-agent_replit_ui_port]
---

# Operator note — Replit UI export received

> Replit has **no repo access**. It ships a zip per [`75f_replit_ui_export_package_spec.md`](../75f_replit_ui_export_package_spec.md).
>
> **Unzip to:** `P:\doc_repo\_exports\replit-property-brief-ui\`
>
> **Then fire:** extension-agent on [`_dispatches/2026-05-29_extension-agent_replit_ui_port.md`](../_dispatches/2026-05-29_extension-agent_replit_ui_port.md)

## Received

| Item | Path | OK |
|------|------|-----|
| Zip extracted | `_exports/replit-property-brief-ui/` | |
| `index.html` opens in browser | | |
| `CLOSE.md` | | |
| `DELTA.md` | | |
| `components.md` | | |
| `screenshots/desktop-1280.png` | | |
| `screenshots/mobile-390.png` | | |

## Operator smoke (2 min)

1. Open `_exports/replit-property-brief-ui/index.html` in Chrome
2. Confirm property nav, starter chips, chat seed, disclaimer footer render
3. Confirm no console errors

## Next agent

Extension-agent ports from `_exports/replit-property-brief-ui/` → `P:\hauska-brief-extension`
