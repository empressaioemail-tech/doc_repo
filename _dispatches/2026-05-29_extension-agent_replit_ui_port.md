---
id: 2026-05-29_extension-agent_replit_ui_port
title: Dispatch — Port Replit UI prototype into hauska-brief-extension
date: 2026-05-29
agent: extension-agent
repo: hauska-brief-extension
kind: dispatch
related: [75d_property_brief_ui_replit_handoff, 75e_property_brief_collaboration_sharing_handoff, 75a_hauska_brief_extension]
blocked_on: none — export received 2026-05-29 at P:/replit-property-brief-ui-2026-05-29/replit-property-brief-ui/
---

# Port Replit UI prototype into extension

You are **extension-agent**, single owner of `P:\hauska-brief-extension`.

**Goal:** Bring production extension UI up to the Replit-approved design **without rewriting API wiring**. HTML/CSS structure + visual polish only; keep `brief-engine.js`, `research-api.js`, `workspace-api.js`, `brokerage-api.js`, and background SW behavior intact unless a new DOM hook requires a one-line selector update.

**Read first:**

- [`75f_replit_ui_export_package_spec.md`](../75f_replit_ui_export_package_spec.md) — export tree + DOM contract
- [`75d_property_brief_ui_replit_handoff.md`](../75d_property_brief_ui_replit_handoff.md) — product context, anti-patterns
- [`75e_property_brief_collaboration_sharing_handoff.md`](../75e_property_brief_collaboration_sharing_handoff.md) — if export includes collaboration/
- **Export folder:** `P:/replit-property-brief-ui-2026-05-29/replit-property-brief-ui/`
- Replit wrap-up: `CLOSE.md` + `DELTA.md` + `components.md` in export root
- Receipt: [`_inbox/2026-05-29_replit_property_brief_ui_close.md`](../_inbox/2026-05-29_replit_property_brief_ui_close.md)

## Model (HR-12)

**Grok Build 0.1** for multi-surface port. **grok-code-fast-1** OK for CSS-only passes.

---

## Replit export (operator unzips before you start)

Replit has **no repo access**. It delivers one zip per [`75f_replit_ui_export_package_spec.md`](../75f_replit_ui_export_package_spec.md).

**Unzip to:** `P:/replit-property-brief-ui-2026-05-29/replit-property-brief-ui/` (received 2026-05-29)

| File | Purpose |
|------|---------|
| `index.html` | Approved Deep Research shell → port to `research/research.html` |
| `styles.css` | Tokens + layout → port to `research/research.css` |
| `preview.js` | Reference render logic only; **do not ship** — rewire existing `research-app.js` |
| `mock-data.json` | Fixture for local HTML preview + test expectations |
| `components.md` | Region → DOM ID map |
| `DELTA.md` | What changed vs baseline embedded in 75f |
| `CLOSE.md` | Replit wrap-up summary |
| `screenshots/` | Visual acceptance |
| `panel/` | Optional listing panel mock |
| `collaboration/` | Optional share/attachments mock |

**Do not start** until operator confirms zip extracted and `index.html` opens locally with no console errors.

---

## Production file map (where Replit HTML/CSS lands)

| Replit export | Extension target | JS owner (touch only if hooks change) |
|---------------|------------------|--------------------------------------|
| `_exports/.../index.html` | `research/research.html` | `src/research/research-app.js` |
| `_exports/.../styles.css` | `research/research.css` | `src/research/research-app.js` |
| `_exports/.../panel/panel.html` | `panel/panel.html`, `panel/panel.css` | `src/panel/index.js` |
| `_exports/.../collaboration/*` | hooks in `research.html` + CSS | `research-app.js`, `workspace-api.js` |

After edits: `node scripts/build.mjs` → reload unpacked extension.

---

## DOM hook contract (preserve or migrate explicitly)

Replit **must not rename** these IDs without listing them in `DELTA.md`. Extension JS depends on them today:

### Deep Research (`research.html`)

| ID / class | Purpose |
|------------|---------|
| `#app` | Root mount |
| `#address` | Property address headline |
| `#jurisdiction` | Subtitle (jurisdiction · corpus · workspace) |
| `#property-nav` | Left recent-properties column |
| `#recent-list` | Workspace list UL |
| `#chat` | Message thread mount |
| `#citations-panel` | Pro-mode sources rail (hidden in `.hauska-consumer-mode`) |
| `#citation-list` | Citation UL |
| `#suggestions` | Starter chip row |
| `#chat-form` | Composer form |
| `#chat-input` | Text input |
| `.hauska-consumer-mode` on `body` | Hides citations rail |

### Listing panel (`intel-panel.js`)

Preserve button actions: Run brief, Deep research, See sources, Copy share link. Class hooks: `.hauska-intel-panel`, verdict card containers rendered by `lay-render.js`.

If Replit adds collaboration UI (share button, attachments drawer), use **new IDs** prefixed `hauska-` and wire in `research-app.js` / `workspace-api.js` — do not collide with above.

---

## Port sequence (ordered)

### 1. Reconcile drift (do first)

Known issue: `research/research.css` and `src/research/research-app.js` reference `#property-nav` / `.hauska-research-body` but `research/research.html` on disk may still show old two-column layout with citations rail. **Sync HTML to JS/CSS before applying Replit skin.**

### 2. Deep Research (highest leverage)

1. Replace `research/research.html` structure with Replit `prototype/index.html` body content.
2. Merge Replit CSS into `research/research.css` — keep `:root` tokens; dedupe conflicting rules.
3. Map Replit mock fields to existing render functions in `research-app.js` (do not duplicate chat logic).
4. Verify starter chips still call existing handlers (`starterPromptId` path).
5. Confirm `.hauska-consumer-mode` still hides `#citations-panel`.

### 3. Listing panel + popup + side panel

Apply same visual language (tokens, radius, typography). Verdict cards stay data-driven via `lay-render.js` — restyle, do not restructure JSON consumption.

### 4. Collaboration surfaces (if in Replit DELTA)

| UI | Wire to |
|----|---------|
| Copy share link | existing share handler / `workspace-api.js` |
| Attachments list | `GET/POST /workspaces/:id/attachments` |
| Shared-read banner | show when opening `#ws=` hash or share token route |
| Zero-balance banner | surface `402` from brief/chat gracefully |

Paywall top-up UI stays **out of scope** unless operator explicitly greenlights.

### 5. Brand copy pass

User-facing: **hauska property brief** (lowercase). Remove any user-visible "property intel" or "brokerage" strings Replit may have used. API paths stay `/api/brokerage/v1/*`.

### 6. Build + smoke

```powershell
cd P:\hauska-brief-extension
node scripts/build.mjs
```

Manual smoke with prod API + key:

1. Zillow listing → Run brief → verdict cards
2. Deep research → property nav → starter chip → chat reply + confidence footer
3. Copy share link (if UI present)
4. Reopen recent workspace
5. Consumer mode: no permanent citations rail

Bump manifest patch (e.g. `0.5.4`).

---

## Acceptance

- [ ] Deep Research matches Replit screenshots (layout, typography, colors) at 1280px and 390px width
- [ ] All DOM hook IDs preserved or migrated with JS updates listed in close file
- [ ] No regression: live `/brief` + `/research/chat` still work against prod API
- [ ] Consumer mode: inline citations in chat, no Compass-style permanent rail
- [ ] `node scripts/build.mjs` green; extension reloads unpacked without console errors
- [ ] Version bumped; DELTA items from Replit either shipped or explicitly deferred in close file

## Do NOT

- Reintroduce listing panel morph animation
- Add LLM keys or direct xAI calls in extension
- Rewrite `brief-engine.js` retrieval logic
- Ship paywall Stripe UI
- Break MV3 background → `tabs.create` deep research open path

## Report back

`P:/doc_repo/_inbox/2026-05-29_hauska-brief-extension_extension-agent_replit_ui_port_close.md`

Include: version, before/after screenshots, files touched, DELTA items shipped vs deferred, smoke results, blockers verbatim.
