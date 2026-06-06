---
id: 75f_replit_ui_export_package_spec
title: Replit UI export package spec (no repo access required)
status: active
last_updated: 2026-05-29
applies_to: portfolio
related: [75d_property_brief_ui_replit_handoff, 75e_property_brief_collaboration_sharing_handoff, _dispatches/2026-05-29_extension-agent_replit_ui_port]
owner: nick
---

# Replit UI export package spec

> **Give this entire document to the Replit agent.** It has no access to our repos. Your job is to produce a **self-contained zip** that Nick drops into `P:\doc_repo\_exports\replit-property-brief-ui\`. Extension-agent ports from that folder later.

---

## 1. What you are designing

**Hauska Property Brief** — a property research chat UI for Texas real estate agents.

**Primary surface:** Deep Research page (full-screen chat + property list + starter question chips).

**Reference layout (target):**

- Header: brand dot + "hauska property brief", large address, subtitle with jurisdiction + corpus status
- Left column: **PROPERTIES** list (recent addresses, active card highlighted, "View listing" links)
- Main column: starter chips ("Start with a question"), chat thread, input bar ("Ask about this property…")
- **No permanent citations sidebar** in consumer mode (citations expand inline in chat)
- Footer on AI messages: disclaimer + confidence percent

**Brand:** lowercase "hauska property brief", light blue accents, white cards, soft shadows, rounded corners. Not legal advice copy on every AI reply.

**Out of scope for you:** Chrome extension wiring, API calls, backend, paywall Stripe UI.

---

## 2. Current baseline (what you are improving)

This is the **production HTML shell today**. Your export replaces the visual design while preserving the DOM hook IDs in §4.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Hauska Property Brief — deep research</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <div class="hauska-research" id="app">
      <header class="hauska-research-hdr">
        <div class="hauska-research-brand">
          <span class="hauska-dot" aria-hidden="true"></span>
          <span class="hauska-brand-label">property intel</span>
        </div>
        <div class="hauska-research-meta">
          <h1 id="address">Loading…</h1>
          <p id="jurisdiction" class="hauska-sub"></p>
        </div>
      </header>

      <div class="hauska-research-layout">
        <main class="hauska-chat" id="chat" aria-live="polite"></main>
        <aside class="hauska-citations-panel" id="citations-panel">
          <h2>Atom sources</h2>
          <ul id="citation-list" class="hauska-citation-list"></ul>
        </aside>
      </div>

      <footer class="hauska-chat-composer">
        <div class="hauska-suggestions" id="suggestions"></div>
        <form id="chat-form" class="hauska-chat-form">
          <input type="text" id="chat-input" placeholder="Ask about this property…" autocomplete="off" />
          <button type="submit" class="hauska-btn">Ask</button>
        </form>
      </footer>
    </div>
  </body>
</html>
```

**Target layout change:** Replace `.hauska-research-layout` (chat + right citations rail) with a **two-column body**: left `#property-nav` + right chat. Hide `#citations-panel` when `body` has class `hauska-consumer-mode`.

**Current design tokens (starting point):**

```css
:root {
  --hauska-blue: #38bdf8;
  --hauska-blue-dark: #0284c7;
  --hauska-slate: #0f172a;
  --hauska-muted: #64748b;
  --hauska-border: #e8ecf0;
  --hauska-bg: #f8fafc;
  --hauska-card: #ffffff;
  --hauska-shadow:
    0 1px 2px rgba(15, 23, 42, 0.06),
    0 6px 16px rgba(15, 23, 42, 0.08),
    0 16px 40px rgba(15, 23, 42, 0.1);
}
```

You may evolve tokens. Document final values in `DELTA.md`.

---

## 3. Required export package structure

Zip this exact tree. Every file required unless marked optional.

```text
replit-property-brief-ui/
├── README.md                 ← operator instructions (§8)
├── CLOSE.md                  ← your wrap-up summary (§9)
├── DELTA.md                  ← what changed vs §2 baseline
├── components.md             ← region → DOM ID map (§5)
├── mock-data.json            ← full sample payload (§6)
├── index.html                ← Deep Research (standalone, double-click to open)
├── styles.css                ← all styles for index.html
├── preview.js                ← loads mock-data.json, renders static UI (no API)
├── screenshots/
│   ├── desktop-1280.png
│   └── mobile-390.png
├── panel/                    ← OPTIONAL: listing panel mock
│   ├── panel.html
│   └── panel.css
└── collaboration/            ← OPTIONAL: share + attachments mock
    ├── share-modal.html
    └── share-modal.css
```

**Validation before handoff:** Open `index.html` in a browser with `preview.js` wired. Page must render fully with mock data, no console errors, no external CDN required (or document CDN deps in README).

---

## 4. DOM hook contract (preserve these IDs)

Extension-agent wires production JS to these hooks. **Do not rename** without listing the change in `DELTA.md`.

| ID / class | Required | Purpose |
|------------|----------|---------|
| `#app` | Yes | Root |
| `#address` | Yes | Property address headline |
| `#jurisdiction` | Yes | Subtitle line |
| `#property-nav` | Yes | Left properties column wrapper |
| `#recent-list` | Yes | `<ul>` for property cards |
| `#chat` | Yes | Chat message mount |
| `#citations-panel` | Yes | Pro sources rail (hidden in consumer mode) |
| `#citation-list` | Yes | Citation list inside rail |
| `#suggestions` | Yes | Starter chip container |
| `#chat-form` | Yes | Composer form |
| `#chat-input` | Yes | Text input |
| `.hauska-consumer-mode` on `body` | Yes | Hides `#citations-panel` |
| `#hauska-share-btn` | Optional | Copy share link button |
| `#hauska-attachments` | Optional | Attachments drawer/list |

**New elements:** use IDs prefixed `hauska-` and document in `components.md`.

---

## 5. `components.md` template (fill in and ship)

```markdown
# Component map

| Region | Your selector | Extension ID | Notes |
|--------|---------------|--------------|-------|
| Brand + address | | `#address`, `#jurisdiction` | |
| Property nav | | `#property-nav`, `#recent-list` | |
| Starter chips | | `#suggestions` | 6 chips |
| Chat thread | | `#chat` | user + assistant bubbles |
| Composer | | `#chat-form`, `#chat-input` | |
| Share button | | `#hauska-share-btn` | if present |
| Attachments | | `#hauska-attachments` | if present |
```

---

## 6. `mock-data.json` (ship this shape, fill with realistic content)

```json
{
  "address": "302 Pack Horse Dr, Bastrop, TX 78602",
  "jurisdictionLabel": "Bastrop Texas · in_corpus · AI research on · ws_abc123",
  "corpusStatus": "in_corpus",
  "brandLabel": "hauska property brief",
  "starterChips": [
    { "id": "adu", "label": "Can I add an ADU here?" },
    { "id": "flood", "label": "Will this property flood?" },
    { "id": "schools", "label": "What schools are nearby?" },
    { "id": "str", "label": "Could this work as a short-term rental?" },
    { "id": "setbacks", "label": "What are setback rules for an addition?" },
    { "id": "redflags", "label": "Biggest red flags for this lot?" }
  ],
  "recentWorkspaces": [
    {
      "id": "ws_1",
      "address": "106 Double Barrel Ct, Bastrop, TX 78602",
      "listingUrl": "https://example.com/listing/106",
      "active": false
    },
    {
      "id": "ws_2",
      "address": "302 Pack Horse Dr, Bastrop, TX 78602",
      "listingUrl": "https://example.com/listing/302",
      "active": true
    }
  ],
  "seedMessage": {
    "role": "assistant",
    "sections": [
      { "title": "Accessory dwelling units", "body": "ADUs may be allowed with limits." },
      { "title": "Flood risk", "body": "Low flood risk on this site." },
      { "title": "Major restrictions", "body": "Not enough data to flag big limits." },
      { "title": "Local rules coverage", "body": "Rules for this area are included." }
    ],
    "disclaimer": "Property intel from Hauska municipal code catalog. Not legal advice. Verify with city staff.",
    "confidence": 0.5
  },
  "messages": [
    {
      "role": "user",
      "content": "Can I add an ADU here?"
    },
    {
      "role": "assistant",
      "content": "Bastrop allows accessory dwelling units in many residential districts with size and setback limits.",
      "disclaimer": "Property intel from Hauska municipal code catalog. Not legal advice.",
      "confidence": 0.72,
      "inlineRefs": [
        { "label": "ADU requirements", "snippet": "§ 3.2.1 Accessory dwelling units…" }
      ]
    }
  ]
}
```

---

## 7. `preview.js` requirements

Ship a small vanilla JS file (no React/Vue build step) that:

1. Fetches `mock-data.json`
2. Sets `#address`, `#jurisdiction`, brand label
3. Renders `#recent-list` property cards (active state on `active: true`)
4. Renders `#suggestions` chips (click prefills `#chat-input` only; no API)
5. Renders `#chat` with seed message + `messages[]`
6. Renders assistant footer: disclaimer + `(Hauska AI · confidence N%)`
7. Renders inline ref chips on assistant messages when `inlineRefs` present (tap expands snippet below chip)

Wire in `index.html`:

```html
<script src="preview.js" defer></script>
```

---

## 8. `README.md` (operator drop instructions — you write this)

Include verbatim:

```markdown
# Replit Property Brief UI export

## Drop location
Unzip to: P:\doc_repo\_exports\replit-property-brief-ui\

## Preview locally
Open index.html in Chrome. Requires preview.js + mock-data.json in same folder.

## Next step
Nick notifies extension-agent. Dispatch:
P:\doc_repo\_dispatches\2026-05-29_extension-agent_replit_ui_port.md

## Do not
- Commit node_modules
- Include API keys
```

---

## 9. `CLOSE.md` (your wrap-up — fill in)

```markdown
# Replit close — Property Brief UI

## Date
YYYY-MM-DD

## Summary
(one paragraph: visual direction chosen)

## Surfaces shipped
- [ ] index.html + styles.css + preview.js
- [ ] panel/ (or "skipped")
- [ ] collaboration/ (or "skipped")

## Screenshots included
- desktop-1280.png
- mobile-390.png

## Open questions for extension-agent
(list any unresolved UX decisions)

## Deferred
(list ideas explored but not in export)
```

---

## 10. `DELTA.md` (required)

Document against §2 baseline:

**Changed:** layout, typography, colors, new components, renamed copy ("property intel" → "hauska property brief")

**Preserved:** DOM IDs from §4, 6 starter chips, consumer mode hides citations rail, disclaimer on AI messages

**Deferred:** anything not in the zip

---

## 11. Starter chip labels (default — change only if noted in DELTA)

1. Can I add an ADU here?
2. Will this property flood?
3. What schools are nearby?
4. Could this work as a short-term rental?
5. What are setback rules for an addition?
6. Biggest red flags for this lot?

---

## 12. Anti-patterns (do not ship)

- Permanent right-hand citations rail visible in consumer layout
- User-visible word "brokerage"
- Hallucinated school names or flood zones in mock copy
- React/Next app that requires `npm run build` to preview (static HTML only)
- Missing `mock-data.json` or broken `preview.js`

---

## 13. Collaboration UI (optional second surface)

If you explore sharing, mock these in `collaboration/share-modal.html`:

- **Copy share link** button
- **Shared read-only banner** ("Viewing shared workspace")
- **Attachments list** (link, PDF, note rows)

No real API. Static HTML/CSS only. Document hooks in `components.md`.

---

## 14. Handoff checklist (Replit agent signs off)

- [ ] Zip matches §3 tree
- [ ] `index.html` opens locally with full render
- [ ] All §4 DOM IDs present
- [ ] `mock-data.json` populated with Bastrop example
- [ ] `components.md` complete
- [ ] `DELTA.md` complete
- [ ] Two screenshots included
- [ ] No secrets, no node_modules in zip

**Deliverable:** one zip file named `replit-property-brief-ui-YYYY-MM-DD.zip` for Nick to unzip.

**Received 2026-05-29:** `P:\replit-property-brief-ui-2026-05-29\replit-property-brief-ui\` (validated — see `_inbox/2026-05-29_replit_property_brief_ui_close.md`). Screenshots folder empty; use local `index.html` preview for visual sign-off.

---

*Spec for Replit agents with no repo access. Extension port dispatch: [`_dispatches/2026-05-29_extension-agent_replit_ui_port.md`](_dispatches/2026-05-29_extension-agent_replit_ui_port.md).*
