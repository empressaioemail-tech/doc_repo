---
id: 2026-08-28_p96_chrome_defect_pile_WDLL
title: WDLL — P-96 PE chrome defect pile (non-palette)
status: approved
last_updated: 2026-08-29
operator_approval: 2026-08-28 verbal go ("yes to p96")
plan_row: P-96
---

# WDLL: P-96 PE chrome defect pile (non-palette)

Date: 2026-08-28  Status: approved
Plan row: P-96
Repo: `hauska-map` `apps/property-explorer`. Property seat. Isolated worktree from
`origin/main`.

Everything here was found while scoping P-95 and is deliberately NOT in it. None of
it is palette work, and folding defects into a restyle is how both get harder to
review. Snapshot for every measurement: `be60021`, read as a plain export at
`P:/tmp/ss-app-be60021`.

This card is a list of controls that report success while doing nothing, plus two
user-facing defects. The common shape is the one ENFORCEMENT names: an artifact
that exists, is correct, and enforces nothing.

## Done looks like

Every mechanism below either bites or is deleted. Nothing in this card is closed by
a passing run alone; each item is graded by violating it and watching the failure.

## Acceptance items

1. **The chrome gate sees 7.1% of what it appears to police.** Measured
2026-08-28, test files and the token file excluded, comment-only lines excluded,
using the gate's own pattern `/#[0-9a-fA-F]{3,8}\b/`:

        hex    in .tsx      25 lines   SEEN
        hex    in .ts       80 lines   blind, chromeFiles() walks .tsx only
        nonhex in .tsx     198 lines   blind, no rule exists for the form
        nonhex in .ts       49 lines   blind, both reasons
        SEEN 25   BLIND 327   coverage 7.1%

   Two independent scope defects. The walk excludes `.ts`, which is where
   `mobile-layout.ts`, `stripeAppearance.ts` and the map overlays live. And no rule
   matches `rgb()`/`rgba()`, bare decimal triples, or CSS named colours (84 sites).
   Fix: extend the walk to `.ts`; add a decimal-triple rule, an `hsl()` rule and a
   named-colour rule. Verify each by violating it. Then RECORD the new coverage
   figure, because a coverage number that is never recomputed is the same defect one
   level up. Grade: [x] MET. Live reprint 2026-08-29T19:10Z on `7fdb21f`: walked 168
   billed files, measured 90 (hex 35 / triples 55 / hsl 0 / named 0). Old hex-in-tsx
   instrument would see 20/90 (22.2%). New instrument sees 90/90 of the four forms
   it names. Gate self-test 76/76 including violate cases for each form.

2. **`pe-dock-in` is a dead animation.** Referenced once at
`src/components/Dock.tsx:54` as `animation: pe-dock-in ...` and declared nowhere in
the repository. The dock's entrance animation has never run.
`docs/smart-site-brand/v2/IMPLEMENTED.md:29` records it as shipped. Fix: declare the
   keyframe or delete the reference, and correct IMPLEMENTED.md either way. Check: grep
   for the identifier returns either a declaration and a use, or neither. Grade: [x]
   MET. `pe-dock-in` is neither declared nor used. Dock animation is `ss-enter`.
   IMPLEMENTED.md corrected. Live bundle `index-Bt59CzqH.js` has `ss-enter`, no
   `pe-dock-in`.

3. **Five dialogs, zero focus traps.** Measured app-wide: no `activeElement`
handling, no Tab containment, no `autoFocus`, no focus restore, no `inert`. Escape
works in exactly two places (`PdfViewer.tsx:45`, `SearchBar.tsx:504`) and the kit
`Modal` has none, so Settings, Pricing, Checkout and SignUp are keyboard
undismissable while open over a live map. Fix: focus trap, Escape, and focus restore
in the kit `Modal`, so every dialog inherits it. Check: keyboard-only, open each
   dialog, Tab to the end and confirm focus cycles inside; press Escape and confirm
   dismissal; confirm focus returns to the invoking control. A unit assertion that the
   handler exists is not a grade. Grade: [~] PARTIAL. Amendment: Pricing / Checkout /
   SignUp are custom scrims, not kit Modal. They inherit via `useDialogFocus`, not
   the shell. Live 2026-08-29T19:16Z on `https://smartsite.cloud` (`dpl_G9YtZh9RrgQzHaPGvGDA3FSmP2RW`):
   SignUp Escape dismisses; Settings Escape dismisses and restores focus to Settings;
   Pricing Escape dismisses and restores focus to Settings (the opener). Tab wrap
   was not observed in the browser tool (Tab on Settings Close left focus on Close).
   Stripe Checkout was not opened.

4. **`.ss-focusable` is applied to nothing.** It appears in the focus-ring selector
in `pe-tokens.css` and on no element, so the four raw inputs, three selects and five
   checkboxes get no kit focus ring. Fix: apply it or delete it. A selector with no
   subject is a dormant mechanism. Grade: [x] MET. `ss-focusable` is on kit Input /
   TextArea and on the native selects and checkboxes in Share, Compare, Terrain,
   Site Plan, and dossier. The focus-ring selector also targets
   `input/select/textarea:focus-visible`. Live bundle contains `ss-focusable`.

5. **Eighteen of forty-eight legacy aliases carry their own literal**, against the
rule stated in the header of the file that declares them: an alias points at an
`--ss-*` value and never holds a value of its own. Five are colours
(`--atom-accent-bg`, `--atom-accent-border`, `--atom-accent-contrast`,
`--brand-blue-bg-soft`, `--semantic-absence-bg`) and the kit routes through four of
   them, so `PE.atomBg` never touches a token. The eight `--space-*` are defective and
   also dead, so they are deletable outright. Fix: repoint or delete. Check: no alias
   in the file resolves to a literal. Grade: [x] MET. `--btn-pad-*` deleted (zero
   consumers). Gate `legacyAliasLiteralHits` fails on a planted hex and on a planted
   px literal; live `pe-tokens.css` has zero hits. Colour aliases are `var()` or
   `color-mix`.

6. **`TransientChips.tsx` is an orphan.** 113 lines with its own keyframes, imported
   by nobody; three comment references only. Fix: wire it or delete it. Grade: [x]
   MET. `TransientChips.tsx` deleted. Live bundle has no `TransientChips`.
   `transient-chips.ts` stays (unit-tested lifecycle, not the orphan component).

7. **The zone field prints an internal error string to customers.** The live app
renders `LANDUSE_JOIN_HOLD county 48491 — TxGIO prop_id does not join CAD
property_use_code` in the ZONE slot, which the operator reads as a fact. The system
already has the right pattern and this is not it: a title naming the gap, then one
sentence in plain words. Prescribed by the palette author 2026-08-28, and it is the
house voice rule that absence is stated, never hidden, and never as a leaked
internal token:

        Not read — the county's parcel id does not match the appraisal record,
        so zoning is unavailable.

   Keep the join string, behind Sources. Evidence:
   `P:/tmp/ss-map-shot/live-map-parcel.png`. Check: no internal identifier
   (`LANDUSE_JOIN_HOLD`, a bare FIPS, a column name) reaches a customer-facing value
   slot. Grade: [x] MET on the write path. Planted
   `LANDUSE_JOIN_HOLD county 48491 — TxGIO prop_id does not join CAD property_use_code`
   becomes absent-covered with the prescribed sentence; the raw string is provenance.
   Live bundle contains the sentence. A live 48491 parcel was not opened this
   session (Georgetown search returned no inspect card).

8. **Geometry is not token-driven, and P-95 deliberately left it.** All nine
`--ss-h-*` / `--ss-bubble` / `--ss-inset` / `--ss-dock-w` / `--ss-find-w` /
`--ss-r-modal` tokens have zero consumers; the real values are plain numbers in
`pe-chrome.ts`. P-95 tethers the type ramp and proves the pattern; this item applies
   the same treatment to geometry. Do not start it before P-95's reference commit
   lands, or the two collide on the same file. Grade: [x] MET. `PE.hControl` /
   `hDense` / `hField` / `hFind` / `hHead` / `bubble` / `dockW` / `findW` / `inset`
   and the five radii read `var(--ss-*)`. No arithmetic consumers. P-95 is on main.

9. **Favicon still tiles the v2 ground.** Live `/icons/icon-192.svg` (and the
   root duplicate, the 512, `theme-color`, and the webmanifest) paint `#0b0e13`,
   the old cool-blue near-black. The in-app mark already sits on Stone
   `--ss-void` `#2A2A2B`. Operator 2026-08-29: add this to the P-96 pass.
   Check: served SVG `fill` is `#2A2A2B`; no `#0b0e13` and no `#3B82F6` on the
   icon tile. Grade: [x] MET. hauska-map #313 squash `b776f0b`. Live
   `https://smartsite.cloud/icons/icon-192.svg` fill `#2A2A2B`. `theme-color`
   and webmanifest match. Href cache-busted `?v=ss-void`.

## Amendments

- 2026-08-29: item 9 added because the operator saw the old blue favicon tile
  on the live tab after the P-96 ship and ruled it into this pass.

## Out of scope

The Stone palette and everything in P-95. The Oxygen ghost, which is P-95 item 9
because it interacts with `--ss-brand`. Any restyle.

## leave_behind at close

    leave_behind: none
    (item 9 is in this pass, not a leftover)
