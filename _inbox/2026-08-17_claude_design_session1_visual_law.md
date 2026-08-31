---
id: 2026-08-17_claude_design_session1_visual_law
title: Claude Design session 1 — visual law capture (operator loved)
status: active
last_updated: 2026-08-17
applies_to: smartcity
owner: nick
related:
  [
    _decisions/2026-08-17_smartcity_visual_law,
    _decisions/2026-08-17_smartcity_product_line_design_system,
    2026-08-17_claude_design_prompt_1_design_system,
    2026-08-17_claude_design_prompt_2_platform,
  ]
---

# Session 1 visual law (capture)

Operator 2026-08-17: "i love it."

Preview (ephemeral): https://claude.ai/code/artifact/33da8c37-a435-4c59-b9a1-856deda16a33

Theme toggle: Auto / Light / Dark, top right. Shell mock and citizen surface each have their own flip.

This file is the in-repo copy of the session-1 close. The artifact is not the control. Decision `_decisions/2026-08-17_smartcity_visual_law.md`. Token CSS still owed from the artifact before G-66 build.

## Positioning

Internal one-liner: **Quiet surfaces, loud exceptions, honest absence.**

Longer form: SmartCity looks like the city's book of record with an operator's console around it. The metaphor is a **register**, not a card deck. Panels are a 1px hairline. Elevation is a surface step in dark, a shadow in light. A resting screen has no shadow at all.

## Hard calls (do not silently reverse)

1. **Applicability matrix inverts status.** Pass is the quietest row (gray text, no rail, no fill). Uncertain is amber. Unchecked is a diagonal hatch (plat convention: nobody has been here yet). Unreviewed is more dangerous than failed and must never read as clean. Green-for-good is refused.
2. **Type.** One sans: Inter for language. IBM Plex Mono for identifiers. Rule: read it aloud as a number, it's mono; read it aloud as a sentence, it's Inter. **12px floor, hard.**
3. **Shell is a sidebar.** Seven top-nav items was already the ceiling. Roster must hold six-plus department lenses, Plan Review as its own path, Smart Files and Asset Management mounts. Top nav overflow is where features die.
4. **Environment badge** in the top bar. Demo / template-city, live Bastrop, next city must never look identical. Only place amber appears in the chrome.
5. **"Not built" is a designed nav state.** Dim, non-interactive, outlined badge. Public works and Police as examples. Hiding the roster is dishonest.
6. **Provenance chip + basis line.** Every outside value carries source and last-read. Nav footer is `4 of 6 sources read`, not a green dot next to hardcoded "7 integrations." Confidence always carries state: baseline / provenance-backed / earned. A bare number is a shape violation.
7. **Code citation has no body slot.** Licensed ICC text cannot leak into a screenshot or PDF because the component cannot carry it. Local UDC may be quoted; the chip marks it local.

## Added beyond the brief (keep)

Environment badge, not-built nav, provenance chip. Load-bearing for session 2. Pulled from the Bastrop layout inventory and prompt 2.

## Deferred on purpose (do not treat as missing)

- **No chart language.** Nothing this wave needed one. Inherits semantic set and tabular-figures when a real finance record exists.
- **Comment-letter composition and print.** Finding row is the unit. The letter is a layout. Session 2.

## Anti-patterns

Numbered **A1–A10** in the artifact. A PR that reintroduces one is rejected by number. Extract the numbered list into the canonical spec when tokens land. Until then, treat glass/glow/hero PNG/nested product header/iframe-as-page/sub-12px type/four accents on one tile/fake integration count/green-for-pass/ICC body in citation as refused.

## Filing rule (planner)

Do not file the React kitchen-sink as a `_smartcity_masters/` claims register. Masters are what may be said. This is how it looks.

Do not wait for the platform session to freeze these rulings. Waiting is how claude.ai artifacts die.

Canonical INTERNAL spec is owed as `_smartcity_masters/36_smartcity_design_system.md` (or a `design_system/` sibling under that folder) **after** the token block is extracted from the artifact, not after session 2 layouts. Session 2 designs all four products (Dashboards, Smart Files, Plan Review, Asset Management) and produces one kit package copied into those repos. Prompt `_inbox/2026-08-17_claude_design_prompt_2_platform.md`.
