---
id: 2026-05-29_hauska-brief-extension_extension-agent_brief_ux_polish_close
title: Close — Extension brief UX polish (post v0.5.2)
date: 2026-05-29
agent: extension-agent
repo: hauska-brief-extension
dispatch: 2026-05-29_extension-agent_brief_ux_polish
---

# Close — Extension brief UX polish

**Repo:** `P:\hauska-brief-extension`  
**Version:** `0.5.3` (from `0.5.2`)  
**Build:** `node scripts/build.mjs` — OK  
**Prod target:** `briefApiUrl` = `https://cortex-api-tds7av26va-uc.a.run.app` + `hauskaKey`

## Shipped

### 1. Honest empty / low-confidence replies

**`src/research/research-app.js`**

- Detects sparse replies: low `confidence` (&lt; 0.45), generic copy (“not in provided sections”, etc.), or missing `citations` / `sources`.
- Consumer mode appends collapsed **“View sources from this brief”** (`<details>`) built from `result.sources[]`, `result.citations[]`, or brief citation index.
- **Upload CC&Rs or HOA docs** button — stub: alert + `chrome.runtime.openOptionsPage()` (PB-301 backend out of scope).

### 2. Inline refs — `/brief` + chat merge

**`src/lib/inline-atoms.js`**

- `enrichAssistantHtml(messageHtml, { briefRefs, chatRefs })` merges brief + chat + parsed `{{atom:…}}` markup.
- Normalizes refs with `did`-only payloads (parses `entityType` / `entityId` from DID).
- Renders chip row when merged refs are non-empty (including a single ref).

**`src/lib/brief-engine.js`**

- Persists top-level `inlineRefs` from `atoms.inlineRefs` on API brief for stable consumer access.

**`src/research/research-app.js`**

- `formatAssistantReply()` passes `briefRefs` + `chatRefs` into enrich path on every assistant message.

### 3. Schools starter — no hallucination

**`src/research/research-app.js`**

- `starterPromptId === "schools"` short-circuits live Grok call.
- Static honest template: municipal code does not include school assignments; verify with ISD / district maps.

### 4. Version + build

- `manifest.json` → **0.5.3**
- `research/research.css` — consumer sources accordion + upload hint styles

## Acceptance

| Criterion | Status |
|-----------|--------|
| Consumer empty citation path → sources link + upload hint | Done (`isSparseReply` + `consumerSparseSourcesHtml`) |
| `inlineRefs` from prod `/brief` render as chips when non-empty | Done (briefRefs merge + single-ref row) |
| Build green | Done |

## Operator smoke (manual)

1. Reload unpacked **0.5.3**; confirm prod API + key in options.
2. Run brief on Central TX listing → Deep research.
3. Ask a question that returns generic / low-confidence copy → **View sources from this brief** + upload CTA appear.
4. If `/brief` returns `atoms.inlineRefs`, chips show under assistant reply (tap to expand in-thread).
5. Tap **What schools are nearby?** starter → honest schools template (no fabricated campus names).

## Out of scope (unchanged)

- Paywall UI
- Encumbrance upload backend (cc-agent-C PB-301)

## Files touched

- `manifest.json`
- `src/research/research-app.js`
- `src/lib/inline-atoms.js`
- `src/lib/brief-engine.js`
- `research/research.css`
- Built: `research/research-bundle.js`, `dist/*`
