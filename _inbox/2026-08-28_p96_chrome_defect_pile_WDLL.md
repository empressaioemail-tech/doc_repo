---
id: 2026-08-28_p96_chrome_defect_pile_WDLL
title: WDLL — P-96 PE chrome defect pile (non-palette)
status: approved
last_updated: 2026-08-28
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
   level up. Grade: [ ]

2. **`pe-dock-in` is a dead animation.** Referenced once at
`src/components/Dock.tsx:54` as `animation: pe-dock-in ...` and declared nowhere in
the repository. The dock's entrance animation has never run.
`docs/smart-site-brand/v2/IMPLEMENTED.md:29` records it as shipped. Fix: declare the
keyframe or delete the reference, and correct IMPLEMENTED.md either way. Check: grep
for the identifier returns either a declaration and a use, or neither. Grade: [ ]

3. **Five dialogs, zero focus traps.** Measured app-wide: no `activeElement`
handling, no Tab containment, no `autoFocus`, no focus restore, no `inert`. Escape
works in exactly two places (`PdfViewer.tsx:45`, `SearchBar.tsx:504`) and the kit
`Modal` has none, so Settings, Pricing, Checkout and SignUp are keyboard
undismissable while open over a live map. Fix: focus trap, Escape, and focus restore
in the kit `Modal`, so every dialog inherits it. Check: keyboard-only, open each
dialog, Tab to the end and confirm focus cycles inside; press Escape and confirm
dismissal; confirm focus returns to the invoking control. A unit assertion that the
handler exists is not a grade. Grade: [ ]

4. **`.ss-focusable` is applied to nothing.** It appears in the focus-ring selector
in `pe-tokens.css` and on no element, so the four raw inputs, three selects and five
checkboxes get no kit focus ring. Fix: apply it or delete it. A selector with no
subject is a dormant mechanism. Grade: [ ]

5. **Eighteen of forty-eight legacy aliases carry their own literal**, against the
rule stated in the header of the file that declares them: an alias points at an
`--ss-*` value and never holds a value of its own. Five are colours
(`--atom-accent-bg`, `--atom-accent-border`, `--atom-accent-contrast`,
`--brand-blue-bg-soft`, `--semantic-absence-bg`) and the kit routes through four of
them, so `PE.atomBg` never touches a token. The eight `--space-*` are defective and
also dead, so they are deletable outright. Fix: repoint or delete. Check: no alias
in the file resolves to a literal. Grade: [ ]

6. **`TransientChips.tsx` is an orphan.** 113 lines with its own keyframes, imported
by nobody; three comment references only. Fix: wire it or delete it. Grade: [ ]

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
   slot. Grade: [ ]

8. **Geometry is not token-driven, and P-95 deliberately left it.** All nine
`--ss-h-*` / `--ss-bubble` / `--ss-inset` / `--ss-dock-w` / `--ss-find-w` /
`--ss-r-modal` tokens have zero consumers; the real values are plain numbers in
`pe-chrome.ts`. P-95 tethers the type ramp and proves the pattern; this item applies
the same treatment to geometry. Do not start it before P-95's reference commit
lands, or the two collide on the same file. Grade: [ ]

## Out of scope

The Stone palette and everything in P-95. The Oxygen ghost, which is P-95 item 9
because it interacts with `--ss-brand`. Any restyle.

## leave_behind at close

    leave_behind: none
