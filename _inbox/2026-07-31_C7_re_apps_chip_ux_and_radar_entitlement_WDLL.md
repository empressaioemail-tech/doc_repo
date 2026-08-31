---
id: 2026-07-31_C7_re_apps_chip_ux_and_radar_entitlement_WDLL
title: WDLL — C7 RE-apps inline atom-chip UX + Radar user-aware entitlement
date: 2026-07-31
status: approved
operator_approval: 2026-07-31 (operator: approved proceed)
related: [_sessions/2026-07-31_FULL_SESSION_CAPTURE_all_threads_and_open_items, 2026-07-29_pe_ai_chat_atom_citations_spec, 75a_hauska_brief_extension]
dispatches: [_dispatches/2026-07-31_C7a_re_apps_inline_atom_chip_ux, _dispatches/2026-07-31_C7b_radar_user_aware_entitlement]
---

# WDLL: C7 — RE-apps cited-citation UX + Radar user-aware entitlement

Date: 2026-07-31  
Status: approved  
Operator approval: 2026-07-31 (operator: approved proceed)

## Done looks like

A signed-in Radar / Brief extension user sees property claims with the same cited-citation discipline PE proved: tappable chips from real on-property atoms, brief then full detail on tap, professional presentation (citations not stripped). Entitlement and workspace history follow the **user** across browser installs; anonymous users still work via `install_id`. Both workstreams verified on deployed surfaces (cortex-api + extension Web Store build or planner-loaded unpacked), not merged PRs alone. Does not touch hauska-map/PE #118, the engine, or the standalone deep-dive portal build.

## Acceptance items

1. **C7a recon gap map filed** | check: planner dispatch cites surface table with live file paths | grade: [ ]
2. **C7b recon resolution seam filed** | check: planner dispatch names exact functions + install-keyed vs user-aware split | grade: [ ]
3. **RE chat: `[n]` → `citations[]` → chips (professional mode)** | check: Deep Research + intel-panel chat on deployed extension; assistant answer shows inline citation chips; `presentationMode: "pro"` on `/research/chat` | grade: [ ]
4. **Fetch-on-tap BRIEF/FULL accordion + honest 404 degrade** | check: tap chip on live chat → accordion expands in-thread; gated/missing atom degrades to label text, not broken chip | grade: [ ]
5. **Client-composed lineage walk (envelope←setback←code)** | check: FULL level shows COMPUTED-FROM chips; tap swaps card with back step on a Central-TX brief property | grade: [ ]
6. **Anti-fabrication holds on RE chat** | check: every emitted chip id appears in response `citations[]`; out-of-range `[n]` never renders as chip (backend + UI) | grade: [ ]
7. **Brief-body surfaces (verdict/factors) show chips not raw DIDs** | check: intel panel brief rail: factor expand or verdict line uses chip UX, not bare `<code class="factor__did">` | grade: [ ]
8. **Signed-in Max entitlement follows user across fresh install** | check: user with Max on install A; new install B + same session → `GET /entitlement` shows Max; `POST /brief` gets Max adapter depth | grade: [ ]
9. **Signed-in workspace history follows user across fresh install** | check: property in `/workspaces/recent` from install A opens via `GET /workspaces/:id` when request uses install B + same session | grade: [ ]
10. **Anonymous wedge unchanged** | check: no session Bearer → entitlement + `/recent` keyed to request install only; brief still runs | grade: [ ]
11. **Ship gate** | check: green CI on actual head SHA; planner deploys cortex-api + extension; live probes for items 3–10 | grade: [ ]

## Out of scope (explicit)

- hauska-map / PE workbench / PE #118
- hauska-engine
- Standalone deep-dive portal / web-app-first onboarding shell (C7b aligns; does not build)
- Stripe user-grain billing migration (checkout may remain install-bound)
- Command Center `PropertyBriefTile` cortex-report path (separate API; optional follow-on)
- `{{atom:...}}` markup resurrection (deprecated corpus-wide; use `[n]` + `citations[]`)

## Dependencies

- C7a backend anti-fabrication already merged in legacy-design-tools (`brokerageBriefLlmCitationConstraint.test.ts`); client is the gap.
- C7b-A (brief tier) should land before or with extension Max verification; C7b-B (workspace ACL) independent of C7a.
- PE reference implementation (read-only): `hauska-map/apps/property-explorer/src/workbench/tools/{chat-citations,chat-atom-card}.ts`, `ChatTool.tsx`.

## Amendments

(none)

## Finish card (graded at close)

(filled at session close)
