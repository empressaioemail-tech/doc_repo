---
id: REBRAND_IMPL_design_system_wiring
title: REBRAND IMPL — wire the Smart Site design-system tokens into the PE app (honest-absence off yellow, atom chip off purple, one Button)
date: 2026-08-03
status: dispatch (design landed + committed on rebrand/design-system; this is the IMPLEMENTATION pass that makes it live)
owner: nick
related: [smart-site-rebrand-live-pe-prod, hauska-map-vercel-no-autodeploy]
---

# REBRAND IMPL — wire the design-system tokens into the app

The design system is DONE and committed to hauska-map branch `rebrand/design-system` (pe-tokens.css at `apps/property-explorer/src/styles/pe-tokens.css`; the brand package + README implementation notes at `apps/property-explorer/docs/smart-site-brand/`). Nothing is wired yet. This pass wires it in so the operator's QA items (too much yellow, purple atom chips, inconsistent buttons) actually change in the live app. This is a TOKENS + ONE COMPONENT pass — NOT a re-skin.

## BRANCH
Work on `rebrand/design-system` (extend it) OR a child branch off it — do NOT branch off main (main lacks pe-tokens.css). Isolated fresh clone/worktree (shared-clone hazard — the Phase D zoning agent is working the shared hauska-map clone; do NOT collide). No merge, no deploy without operator go.

## THE FOUR WIRING TASKS (follow the committed README notes exactly — docs/smart-site-brand/README.md "Design system pass" section)

### 1. Honest-absence recolor — HIGHEST IMPACT, but DO NOT blanket find-and-replace
`#fcd34d` / `#c98b3a` is used for TWO different things and they must be sorted BEFORE recoloring:
- (a) genuine "we don't have this data" honest-absence ("not verified here") → recolor to `--semantic-absence` (`#7C8BA0` text, `--semantic-absence-bg` / `--semantic-absence-border` for chip fills).
- (b) genuine warning/caution state → LEAVE amber / `#F59E0B` alone (it is NOT the collision).
The README notes name the files carrying amber (InspectCard ABSENT, Workbench, BriefTool, ChatTool, SearchBar, UnlockFlow, ShareView, SharedDossierDock, ShareLandingOverlay, saved-pins, PropertyDossierDetail, PropertiesTool, CompareTool, LockedToolPanel, FloodTool, PropertyBriefPanel, TransientChips, SitePlanExportSection, TerrainExportSection, SignUpCard) and point to `chat-citations.ts:228-229` as the authoritative map of which family is which. USE THAT COMMENT as the sorting guide. Per file: classify each amber use as absence vs warning, recolor only the absence ones. If a use is ambiguous, STOP + flag it, don't guess.

### 2. Atom chip recolor — clean, source-level
`ATOM_ACCENT` `#c4b5fd` → `--atom-accent` `#4CC9C0`; `ATOM_ACCENT_BORDER` → `--atom-accent-border`; `ATOM_ACCENT_BG` → `--atom-accent-bg`; `ATOM_ACCENT_CONTRAST` stays `#0b0f14` (= `--atom-accent-contrast`). All ~27 usages flow through these four constants (in ChatTool.tsx / the workbench tool constants) — recolor AT THE SOURCE, no per-usage edits. Do NOT touch the map's interaction-cyan `#7dd3fc` (search-highlight, semantic, leave it).

### 3. Button component — one component, four variants
Build ONE Button (primary / secondary / ghost / subtle) per pe-tokens.css: `--btn-radius` 9px, default + dense padding scales, `--btn-focus-ring` (uses `--brand-blue`, visible + keyboard-accessible). Replace the ad-hoc buttons in InspectCard.tsx, SearchBar.tsx, the workbench tool panels, and the export sections. Every PE button resolves to one of the four variants. Match existing button TEXT/labels exactly — this is styling, not copy changes.

### 4. Import the tokens
Wire `src/styles/pe-tokens.css` into the app entry (the global stylesheet import) so the CSS vars are available app-wide. It ADDS to the existing colors.css, does not replace it.

## BOUNDARIES (hold — same as the branding pass)
- PE keeps `--surface-ink` `#0b0e13` (its own near-black) — do NOT apply Smart City navy surface tokens to the map.
- Leave the map interaction-cyan `#7dd3fc`, the PDF print blue `#00b4d8`, and genuine error/warning states alone.
- Do NOT touch the `empressa-pe-install-id` storage key.
- Do NOT change card radii, shadows, blur, or the system-ui body font in the map chrome. Oxygen is display/headings only.
- Copy/headline text is a SEPARATE pass — do not change wording.
- OUT OF SCOPE (separate workstreams — do NOT do here): citation/link dead-end audit, map default layers, lower-left chrome cleanup, PDF X-ray template.

## VERIFY BEFORE FINISH
- `grep -rn "c4b5fd" apps/property-explorer/src` → zero (all atom chips now via `--atom-accent`).
- The amber sort is documented: for each `#fcd34d`/`#c98b3a` use, state absence-recolored vs warning-left. No blanket replace.
- Typecheck green (tsc --noEmit after building @hauska/map-renderer). Do NOT run a non-exiting dev server.
- Visual sanity: build the app; confirm honest-absence now reads slate (not yellow), atom chips read teal (not purple), buttons are consistent. (A screenshot or the built CSS grep is fine — no live deploy in this pass.)
- Commit to `rebrand/design-system` (or the child branch) + push. NO merge, NO deploy. Report the per-file amber classification, the atom-chip grep, the Button replacements, and typecheck result.

## STANDING DECISIONS (paste into any sub-dispatch)
Operate/extend the committed artifact (the tokens exist — wire them, don't re-invent). Verification never delegated (planner confirms the grep + built CSS, not the agent's word). Anti-fabrication (do NOT recolor a warning as absence to make a count — sort honestly; ambiguous → STOP + flag). Isolated clone (shared-clone hazard — Phase D agent is on the shared clone). No special data access N/A. Merge only on green CI. No deploy without operator go (PE does NOT auto-deploy; a deploy is a separate operator-authorized step per hauska-map-vercel-no-autodeploy). No timeframe estimates. Paste raw grep/typecheck output.

## AFTER THIS LANDS
Operator reviews the branch (or a preview), then the merge + prod deploy is a separate operator-go step (link --project property-explorer, deploy --prod, verify the slate/teal in the live bundle). THEN the remaining UI workstreams (map default layers, lower-left cleanup, citation sweep, PDF template) — each its own dispatch.
