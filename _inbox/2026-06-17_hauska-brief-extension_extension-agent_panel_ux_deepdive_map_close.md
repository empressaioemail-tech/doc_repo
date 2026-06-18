---
date: 2026-06-17
agent: extension-agent
repo: hauska-brief-extension
branch: extension/unified-signin-v067
version: 0.6.15
dispatch: 2026-06-17_extension-agent_panel_ux_deepdive_attachment_map
status: verified on prod cortex-api-00197-hex (#193) — committed + pushed
---

# Close — panel UX + deep research + attachment + Max map hero (v0.6.15)

## Version

| Field | Value |
|-------|-------|
| **Version** | **0.6.15** |
| **Prod API** | `https://cortex-api-tds7av26va-uc.a.run.app` (**cortex-api-00197-hex**, #193) |
| **Branch** | `extension/unified-signin-v067` |

## Live prod verification (#193, fresh install ids)

### `node scripts/verify-prod-193-live.mjs`

Fresh install: `qa-v015-<timestamp>` (not exhausted `qa-verify-install-001`).

| Check | Result |
|-------|--------|
| `POST /brief` | **200** `bastrop_tx`, `entitlement.freeBriefsRemaining=2` |
| `POST /research/chat` `{address, message, history:[]}` | **200** (was 400 pre-#193) |
| `POST /map-data` install `extension-agent-map-max-qa` | **200** — **7 layers**, **3 reasoningOverlays**, `packageTier=max` |
| `POST /map-data` fresh install | **403** `tier_required` |
| Attachment presign → PUT → complete (bad PDF) | **422** `pdf_unparseable` (not 500) |

### `node scripts/verify-prod-live.mjs`

Fresh install: `qa-verify-v015-<timestamp>` — **all PASS** including research chat (address body, 239-char reply).

## Per-item status (A–G)

### A. Panel sizing — DONE

420px panel, scrollable body, verdict card max-height 148px.

### B. Expandable signal cards — DONE

Click-to-expand factor cards with section hits/citations from brief payload.

### C. Inline panel chat — DONE + verified prod

Posts `{address, message, history}` to `/research/chat` when property address is known (no longer requires `runId`). Panel composer visible after brief with address.

### D. “+ Research a property” — DONE

Research CTA → `enterNewPropertyResearch()`; panel **+ Research property** → `#fresh=1` deep link.

### E. Deep research blank landing — DONE + verified prod

- Fixed missing imports (`escapeHtml`, `enrichAssistantHtml`, etc.) that caused blank `#chat-inner`.
- `renderBriefToChat()` populates headline + factors + sections on landing.
- `hydrateBriefOnLanding()` auto-runs brief when incomplete; merges `lastProperty`.
- Research chat uses **address-based** body per #193 contract.

### F. Attachment upload — DONE + verified prod

Presign → GCS PUT → complete; **422 `pdf_unparseable`** surfaced inline via `formatEncumbranceUploadError`. Complete response renders attachment row when instrument returned.

### G. Max map hero — DONE + verified prod

Hero layout (960×400 canvas, `.hauska-site-map--hero`). Max allowlist install `extension-agent-map-max-qa` returns layers + reasoningOverlays; free tier sees tier gate.

## Code changes (v0.6.15 vs v0.6.14)

- `src/lib/research-api.js` — address/workspaceDid/runId union body for `/research/chat`
- `src/research/research-app.js`, `src/content/intel-panel.js` — address-first live chat
- Panel UX A–D, deep research E, attachment F, map hero G (see prior close draft)
- `scripts/verify-prod-live.mjs` — fresh install id per run
- `scripts/verify-prod-193-live.mjs` — #193 contract smoke

## Operator screen captures still owed

Reload unpacked **v0.6.15** and attach chrome-extension:// PNGs:

1. Panel — un-clipped verdict + expanded signal card
2. Panel — inline chat reply from live `/research/chat`
3. Deep research — populated brief on landing + follow-up chat
4. ATTACHMENTS — uploaded PDF row (real CC&R PDF for 201)
5. Max map hero with reasoning overlay pins (`extension-agent-map-max-qa` or Max entitlement)

Zillow spot-check: [205 Javelina Trl](https://www.zillow.com/homedetails/205-Javelina-Trl-Bastrop-TX-78602/90242388_zpid/) for address + entitlement strip (v0.6.14+).
