---
id: 2026-05-28_hauska-brief-extension_extension-agent_brief-atom-ux_close
title: Close — Extension brief atom UX (Dispatch B, wave 7)
date: 2026-05-28
agent: extension-agent
repo: hauska-brief-extension
dispatch: 2026-05-28_dispatch-B_extension_brief-atom-ux
---

# Close — Extension brief atom UX (wave 7)

**Repo:** `P:\hauska-brief-extension`  
**Version:** `0.5.2` (manifest bump from `0.5.1`)  
**Build:** `node scripts/build.mjs` — OK

## Shipped

### 7a — Remove listing morph

- **`src/content/inject.css`:** Removed `border-radius` transition on `.hauska-intel-panel-inner`; expanded host uses `transition: none` so panel snaps to `18px` radius (no pill→rectangle animation).
- **`src/content/intel-panel.js`:** `setPanelRadius()` sets inner `borderRadius` to `18px` on expand and `999px` on collapse immediately (no CSS morph).

### 7b — Research layout (property list nav; no consumer citations rail)

- **`research/research.html`:** Two-column `hauska-research-body` — left `nav#property-nav` (recent properties), right main chat column.
- **`research/research.css`:** Property nav column styles; `.hauska-consumer-mode .hauska-citations-panel { display: none !important }`.
- **`src/research/research-app.js`:** `GET /workspaces/recent` via `fetchRecentWorkspaces()` populates left nav; `#citations-panel` hidden for `presentationMode: "consumer"`. Pro citation rail code path retained but gated off in consumer mode.

### 7c — Inline atoms in chat

- **`src/lib/inline-atoms.js`:** Renders `atoms.inlineRefs` as tappable chips; parses `{{atom:type:id:label}}` in `messageHtml`; expand-in-thread detail block (not right panel).
- **`src/research/research-app.js`:** Assistant replies and seed message use `enrichAssistantHtml()` + `wireInlineAtomExpand()`; merges API `inlineRefs`, brief `atoms.inlineRefs`, and parsed markup.

### Deep-link — `atoms.workspaceDid`

- **`src/lib/brief-engine.js`:** Persists `atoms`, `workspaceDid`, `briefRunDid`, `property.llUuid` from `POST /brief` response.
- **`src/background/index.js`:** Workspace match prefers `atoms.workspaceDid`; stores `lastWorkspaceDid`; deep research tab URL includes `#ws=<workspaceDid>` when known.
- **`src/content/intel-panel.js`:** Deep research open passes workspace DID hash; fixed missing `fetchWorkspace` import.

## Acceptance (self-check)

| Criterion | Status |
|-----------|--------|
| No pill→rectangle morph on listing page | CSS transition removed + instant radius in JS |
| Consumer deep research: no permanent citations sidebar | `#citations-panel` hidden in consumer mode |
| Inline ref tap expands inside chat thread | `wireInlineAtomExpand` in message body |
| Property list replaces sidebar as primary nav | Left `property-nav` column from `/workspaces/recent` |
| Extension version bumped | `0.5.2` |

## Visual verification notes (operator)

Screenshots/screen recording not captured in-agent. Suggested manual pass:

1. **7a:** Zillow homedetails → property intel tab → expand panel — panel should open as rounded rectangle immediately (no oval morph).
2. **7b:** Deep research with API configured — left column lists recent properties; no right-hand “For your agent” citations column.
3. **7c:** After prod `/brief` returns `atoms.inlineRefs` or chat returns `{{atom:…}}` markup — chips appear in assistant bubbles; tap expands snippet block below chip in chat.

## Blockers (verbatim from dispatch / scope)

From **Dispatch B** `blocked_on`:

> LDT `/brief` atoms field merged + deployed (7a morph can start immediately)

From **scope** item 4:

> **`inlineRefs` API field** — extension needs structured refs, not only `payload_json`

**Current state:** Extension consumes `atoms.inlineRefs` and `messageHtml` markup when present. Until Dispatch A deploys full `atoms` projection on prod `POST /brief` and research chat, inline chips fall back to brief-section hits + parsed markup only (stub/mock behavior acceptable per dispatch).

## Files touched (summary)

- `manifest.json` (version)
- `src/content/inject.css`, `src/content/intel-panel.js`
- `src/lib/brief-engine.js`, `src/lib/inline-atoms.js` (new)
- `src/research/research-app.js`
- `src/background/index.js`
- `research/research.html`, `research/research.css`
- Built: `src/content/content-bundle.js`, `research/research-bundle.js`, `dist/*`

## Out of scope (unchanged)

- Paywall UI
- Compass-style permanent citation rail for consumer mode
