---
id: 2026-07-31_C7a_re_apps_inline_atom_chip_ux
title: Dispatch — C7a RE-apps inline atom-chip cited-citation UX
date: 2026-07-31
agent: extension-agent (+ cortex-api read-only unless backend gap found)
repos: hauska-brief-extension (primary), legacy-design-tools (verify backend only)
kind: dispatch
status: MERGED — build green 2026-07-31 (manifest 0.6.33); deploy + live verify WDLL 3–7,11 owed (planner)
wdll: _inbox/2026-07-31_C7_re_apps_chip_ux_and_radar_entitlement_WDLL.md
wdll_items: [3, 4, 5, 6, 7, 11]
related: [2026-07-29_pe_ai_chat_atom_citations_spec, 75a_hauska_brief_extension]
parallel_with: _dispatches/2026-07-31_C7b_radar_user_aware_entitlement
excludes: [hauska-map, hauska-engine]
---

# C7a — RE-apps inline atom-chip cited-citation UX

You are the **extension-agent** (or assigned executor on `hauska-brief-extension`). **Build + verify only — deploys are planner-owned.** Coordinate with C7b on shared auth headers (`apiAuthHeaders`) but do not change entitlement resolution unless C7b dispatch says so.

## STANDING DECISIONS (verbatim — govern every action)

Deploys/commits PLANNER-OWNED; executors build+verify, never deploy.

CODE-DONE ≠ CUSTOMER-DONE: verify on the deployed surface, not a merged PR or self-report.

MERGE ONLY ON GREEN CI (verify on the ACTUAL head SHA — compare headRefOid, not a stale run).

Verify identifiers/paths against LIVE source before dispatching a fix; enumerate a fix's full dependency set from code.

Stage EXPLICIT paths (shared clone carries other agents' dirty files); never git add -A.

ANTI-FABRICATION (C7a): the citation layer constrains the model/UI to cite ONLY real atoms on the property — the load-bearing rule from the PE citation spec. Never render a chip for an atom that isn't on the property.

Also: Cotality is EXTINGUISHED — re-route, never rotate credentials. No privileged data. CTX/national HELD.

---

## MEMORY PASTE (fresh agents do not get fleet memory)

### re-apps-inline-atom-chip-ux-catchup

The RE apps (hauska-brief-extension / Deal Radar) shipped a **partial** atom-chip UX in wave 7 (v0.5.2): `src/lib/inline-atoms.js` renders `atoms.inlineRefs` and deprecated `{{atom:type:id:label}}` markup with snippet-only expand-in-thread. PE later proved the **full** pattern on Property Explorer Workbench chat (2026-07-29): numbered `[n]` in answer text → parallel `citations[]` array → inline chips → fetch-on-tap BRIEF/FULL accordion → client-composed lineage walk (envelope←setback←zoning←code) → `presentationMode: "professional"` (consumer strip is wrong for pro/Max ICP). The `{{atom:...}}` wire format is **DEPRECATED corpus-wide** — do NOT resurrect it. Port the **discipline** onto `[n]` + `citations[]`. Backend anti-fabrication (`parseInlineCitations` drops invented `[n]`) is already in legacy-design-tools `brokerageBriefLlm.ts` with tests. Extension still sends `presentationMode: "consumer"`, which strips `[n]` from answers and hides the citation layer. Catch-up = finish chip→brief→full-detail on RE surfaces, professional mode, same honesty rules as `_inbox/2026-07-29_pe_ai_chat_atom_citations_spec.md` adapted to `[n]`/citations[] (not markup).

### standalone-deep-dive-portal-direction (alignment only — do not build)

Deferred program (`_inbox/2026-07-20_map_first_shell_and_web_app_first_onboarding.md`): web-app-first onboarding, standalone PWA as primary front door, extension as optional desktop capture. That direction **requires** user-aware entitlement/history (C7b). C7a shares the identity surface but does not build the portal.

---

## Read first

1. `_inbox/2026-07-29_pe_ai_chat_atom_citations_spec.md` — honesty rules + anti-fabrication intent (adapt to `[n]`, not `{{atom}}`)
2. `_inbox/2026-07-29_pe_workbench_coordinated_session_handoff.md` — PE live architecture note (deprecated markup)
3. `75a_hauska_brief_extension.md` — extension surfaces
4. PE reference (read-only, do not edit): `P:\hauska-map\apps\property-explorer\src\workbench\tools\chat-citations.ts`, `chat-atom-card.ts`, `ChatTool.tsx`

---

## Recon gap map (verified 2026-07-31 — do not re-assume)

| Surface | Path | Claims | Plumbing today | Gap |
|---------|------|--------|----------------|-----|
| Intel panel | `src/content/intel-panel.js`, `src/lib/lay-render.js` | Verdict, factors, panel chat | Consumer mode; chat refs empty; no expand wire | No chips on brief body; chat ignores `citations[]` |
| Deep Research | `src/research/research-app.js` | Chat + brief rail | Partial `inline-atoms.js`; `PRESENTATION_MODE = "consumer"` | No `refsFromChatResponse`; snippet-only expand |
| Popup / side panel | `src/popup/popup-app.js`, `src/panel/index.js` | Verdict cards | `lay-render` only | No chip layer; dead `#hauska-pro-panel` |
| Shared module | `src/lib/inline-atoms.js` | Chat HTML | Legacy `{{atom}}` + snippet expand | Missing PE fetch + BRIEF/FULL + lineage |
| Backend (shared) | `legacy-design-tools/.../brokerageBriefLlm.ts` | JSON | `[n]` parse + anti-fab tests | **Ready** — client gap |
| CC PropertyBriefTile | `packages/cortex-tiles/.../PropertyBriefTile.tsx` | Cortex report prose | No brokerage citations | **Out of scope** (different API) |

**Highest volume, zero full UX:** intel panel brief body, Deep Research chat, panel chat.

---

## Build scope (WDLL items 3–7)

### Phase 1 — Citation merge + professional mode (items 3, 6)

1. Port PE `refsFromChatResponse` / `parseAnswerSegments` into extension (`src/lib/chat-citations.js` or extend `inline-atoms.js`).
2. Wire in `research-app.js` (`formatAssistantReply`) and `intel-panel.js` (panel chat) — merge `result.citations[]`, `sources[]`, `atoms.inlineRefs`.
3. Set `presentationMode: "pro"` on `/api/brokerage/v1/research/chat` from `research-api.js` and intel-panel chat (RE serves pros; do not strip citations).
4. Tests: every rendered chip id ∈ response `citations[]`; out-of-range `[n]` never becomes chip.

### Phase 2 — Fetch-on-tap accordion (item 4)

5. Upgrade expand from `wireInlineAtomExpand` snippet-only to PE pattern: `GET` atom by did (same retrieval path PE uses via cortex/BFF — verify live route in extension proxy allowlist).
6. BRIEF/FULL levels in-thread; one card open at a time; 404 → plain label degrade.
7. Reuse `atom-freshness.js` for read-time freshness badges.

### Phase 3 — Lineage walk (item 5)

8. Client-compose lineage from brief atom chain (envelope←setback←code); COMPUTED-FROM chips clickable with back stack (port logic from `chat-atom-card.ts`).

### Phase 4 — Brief-body surfaces (item 7)

9. `lay-render.js` factor/verdict cards: replace raw `factor__did` with shared chip component; wire inert `[n]` buttons in `reasoning-summary.js` if still emitted.

### Cleanup

10. Fix or remove dead `#hauska-pro-panel` / `showProSources` in popup HTML.
11. Do not touch `{{atom:...}}` except to gate legacy path behind explicit deprecation comment.

---

## Verification (executor local; planner live)

- Central-TX property with known brief citations: chat question → chips match `citations[]` verbatim ids.
- Tap chip → BRIEF then FULL; lineage back-stack works.
- Consumer-only code paths: confirm pro mode on RE surfaces (not PE consumer strip).
- Manifest version bump per extension release convention.

Write close to `_inbox/2026-07-31_C7a_re_apps_inline_atom_chip_ux_close.md`: gap map confirmation, PR URLs + head SHA, CI green proof, local verification notes, explicit list of paths staged.

**Planner** owns merge on green, extension pack/submit, live verification on deployed surface (WDLL item 11).
