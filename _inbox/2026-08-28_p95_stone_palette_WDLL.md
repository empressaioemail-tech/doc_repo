---
id: 2026-08-28_p95_stone_palette_WDLL
title: WDLL — P-95 Stone palette exact port
status: approved
last_updated: 2026-08-28
operator_approval: 2026-08-28 verbal go (yes to the row, no to translucency, exact look)
plan_row: P-95
---

# WDLL: P-95 Stone palette exact port

Date: 2026-08-28  Status: approved
Operator approval: 2026-08-28
Plan row: P-95
Repo: `hauska-map` `apps/property-explorer`. Property seat. Isolated worktree from
`origin/main`. Starts only after P-93 closes.

Decision record `_decisions/2026-08-28_stone_palette_exact_port.md`.
Source palette `P:/tmp/Smart Site Design System`, plus the ported candidate and
evidence at `P:/tmp/ss-ds-v3`.

Do not start before P-93 closes. P-95 changes the ramp and radii constants inside
`scripts/pe-chrome-kit-gate.mjs`, which is the file P-93 is arming. Two cards on
one file is the collision this sequencing exists to prevent.

## Done looks like

The Property Explorer renders in the Stone palette exactly as authored: warm
neutral ground, opaque floating chrome, softer radii, the larger type ramp. A
reader cannot find a surface still drawn on the v2 scale. The chrome gate passes on
the new constants and still fails when violated. Every contrast failure the palette
carries is listed and priced rather than silently corrected, and every contrast
failure caused by a component picking the wrong token is fixed.

## Acceptance items

1. **Token parity, measured against the source.** The token set is **65**: the 63
original `--ss-*` names, plus `--ss-brand`, plus `--ss-fs-display` authorised by the
palette author on 2026-08-28. Every value equals the source palette's value, with
the four contrast rulings below applied. Check: a script that parses BOTH files
independently and diffs them, exiting non-zero on any disagreement. This is
deliberately two independently derived inputs, so no sentinel or partial edit can
satisfy it. Run it once against a deliberately altered value and confirm it fails.
Note this REPLACES the "update the gate to 65" instruction: the gate has no token
count check today, and a count is presence-shaped anyway. A count of 65 passes if
one token is deleted and another added. Parity catches that; a count does not.
**The diff carries a designated winner per key, and the direction is not
symmetric.** The design system folder wins on values. The app wins on nothing. A
disagreement means the app is wrong until the palette author rules otherwise.
Without a declared winner the check fails on an authored palette edit exactly as
loudly as on app drift, and a check that fires on correct work is a check people
silence. Grade: [ ]

1a. **The four ruled contrast values, verbatim.** `--ss-t6` `#9D9991`, `--ss-t5`
`#ADA9A1`, `--ss-line-28` `#86867D`, focus ring alpha `.67`. The author's first
line-28 value `#85857C` measured 2.974 against `--ss-raised` and was corrected to
`#86867D` (3.014) on our measurement and their confirmation. `--ss-line-06` and
`--ss-line-14` ship failing 3:1 by explicit ruling: they are row separators and
panel edges, decoration rather than affordance. Any control whose border is the
only thing identifying it as a control uses `--ss-line-28`. Check: run the contrast
script; these four values present and the decorative pair explicitly exempted rather
than silently skipped. Grade: [ ]

1b. **The t6 ground restriction.** `--ss-t6` is legal for mono metadata on
`--ss-ink` only. On `--ss-raised` it measures 3.90 even at the ruled value, so meta
on a raised surface uses `--ss-t5`. Check: enumerate every `--ss-t6` call site,
determine its ground, and confirm none sits on `--ss-raised`. This is the ruling
most likely to be lost, because nothing about the token name records it.
Grade: [ ]

2. **Opaque chrome, and only the scrim excepted.** `--ss-ink-94/-92/-90/-96` and
`--ss-raised-97/-98` carry opaque hex values. `--ss-scrim` remains translucent.
Check: grep the six for `rgba(` and expect zero matches; grep `--ss-scrim` and
expect one. Grade: [ ]

3. **The scale actually moved, in the place that controls it.** `PE` geometry and
the `TYPE` ramp in `src/styles/pe-chrome.ts` carry the Stone numbers. Check: read
the values. Note that changing `--ss-fs-*` alone is a no-op, because all six have
zero consumers at `be60021`; an item graded on the token file alone is not met.
Grade: [ ]

4. **No surface left on the old ramp.** The roughly 470 inline `fontSize` literals
are ported to the Stone steps. Check: enumerate every distinct inline `fontSize`
value in `src/` and confirm the set is exactly the Stone ramp plus any value
explicitly ruled in the port table. The 52 known off-ramp sites each land on a
named step or carry a written exception. A file-count is not a grade; the value set
is the grade. Grade: [ ]

5. **The gate moved with the palette and still bites.** `LEGAL_RADII` and the ramp
set in `scripts/pe-chrome-kit-gate.mjs` carry the Stone values. Check: introduce a
known violation on the NEW ramp, watch the gate fail, revert it. A pass-only run is
not a grade. Confirm the gate is still the check CI runs, by naming the workflow
job. Grade: [ ]

6. **Derived offsets re-checked.** Every hardcoded pixel offset arithmetically
derived from `inset`, `bubble`, `hFind`, `hHead` or the dock width is recomputed
for the new scale. Check: the breakage list in `P:/tmp/ss-ds-v3/MIGRATION.md`, each
site either changed or explicitly ruled unaffected. Tests that assert the OLD
literals must be updated or they stay green over a real regression. Grade: [ ]

7. **Contrast is reported, not absorbed.** A contrast annexe ships listing every
failing pairing with its measured ratio, the threshold missed, and the minimum
change that clears it, split into palette failures and component failures. Palette
failures are left alone. Component failures, where a component uses a token outside
its declared job, are fixed. `Marks` no longer renders its off state with a
hairline token, and absence carries a second non-colour channel. Check: run the
checker; component section must be empty. Grade: [ ]

8. **`--ss-brand` resolves to a font that loads.** The app CSP at
`apps/property-explorer/vercel.json` sets `style-src 'self' 'unsafe-inline'` and
`font-src 'self' data:`, so a Google Fonts import is blocked twice over. Either
self-host Oxygen, which OFL-1.1 permits, or point `--ss-brand` at the system stack
and say so in a comment. A token resolving to a font that cannot load is the dead
token defect this app has already been fixed for once. Grade: [ ]

9. **The Oxygen ghost is resolved before self-hosting anything.**
`src/workbench/tools/RecordsAcknowledgementPanel.tsx:83` and
`src/workbench/tools/RecordsRequestSection.tsx:610` declare
`fontFamily: "Oxygen, system-ui, sans-serif"` today, where the font cannot load and
silently falls back. Three tests assert Oxygen's absence and none of them reads
either file. If Oxygen is self-hosted under item 8, these two headings change
appearance with no one asking. Rule each site explicitly. Grade: [ ]

10. **No colour survives as a literal beside a token read of itself.** Found while
porting faithfully: `src/components/StatusChip.tsx` passes the token for the label
but a hardcoded rgb string for the fill and border, so `solid(PE.ok, RGB.ok)` reads
`--ss-ok` for `color` and `rgba(16,185,129,.10)` for `background`. `16,185,129` is
the v2 `--ss-ok`. After the swap the label is Stone's sage and the wash stays
emerald: a sage word in a green box, on all three tones, six sites. The rail's gold
dot has the same shape, carrying an `rgba(11,14,19,.95)` halo sized for near-black
that will sit on a warm grey capsule. Check: for every semantic and reserved hue,
assert the token value and any rgb literal of that same colour agree. This is two
derivations of one value and it is the check that catches a half-ported colour;
a grep for hex alone will not, because these are decimal rgb triples in template
strings. Enumerate and fix all of them. Grade: [ ]

11. **The display step, and its allow-list as the actual control.** `--ss-fs-display`
is 32px, the seventh size, authorised 2026-08-28. The size is not the rule. Display
is legal in exactly four places and nowhere else, never in a panel, dock, row, chip
or over the map:

        src/browse/PricingModal.tsx:220    32 sans  700  -.02em
        src/checkout/CheckoutPage.tsx:185  32 sans  700  -.02em
        src/coldopen/SignUpCard.tsx:113    32 sans  700  -.02em
        src/checkout/CheckoutPage.tsx:195  32 mono  400  -.01em   amount due

   Check: the gate refuses 32 anywhere outside those four files, verified by
   violating it in a fifth file and watching it fail. Enforce the allow-list, not
   the value; a rule that only checks the number permits a 32px headline in a dock,
   which is the thing the ruling exists to prevent. Model it on the existing
   five-file gold carve-out, which already works this way.
   Without this item the three headline sites silently collapse to the new title
   size of 26 and the hierarchy flattens with no diff to review, because the number
   never changes. That is the regression this card exists to catch. Grade: [ ]

12. **The tier price does not take a title step.** `src/browse/PricingModal.tsx:557`
goes 24 to **17.5 mono**, not 26 and not 32, because it repeats once per tier and a
repeated element never takes a title step. Check: read the site. Grade: [ ]

13. **Chip label, and the tracking leak.** The `StatusChip` label is `--ss-fs-label`
11.5, weight 600, tracking normal, sentence case. Confirmed unguarded today:
`src/components/StatusChip.tsx:92` and `:162` set `fontSize` and `fontWeight` and
declare neither `letterSpacing` nor `textTransform`, so a chip placed inside a dock
header inherits that header's `.13em` tracking and uppercase transform. Set both
explicitly. Check: render a chip inside a panel header and confirm it stays sentence
case. A unit assertion on the style object is enough; the leak is inheritance, so
test it in a header, not in isolation. The leak is not chip-specific: any `Button`
placed in a panel header inherits the same two properties, so the header slot resets
both at the container rather than each child guarding itself. `Chip` and `Pill` set
both explicitly in the design system as of 2026-08-28. Check the container reset and
the child declarations are both present; either alone leaves a path open.
Grade: [ ]

14. **Two map hues, separated by treatment.** Parcel geometry takes `--ss-sky`
`#A6CDEB` (data). Search highlight takes `--ss-blue` `#86ADDF` (interaction),
because interactions are blue everywhere else in the product and the map is not
where the product invents a fourth blue. The hardcoded `#7dd3fc` at
`src/browse/ExplorerMap.tsx:1200,1203` is retired. The two hues are close by
design: separate them by treatment, highlight taking a heavier stroke plus a fill
while geometry stays a stroke. Check: grep `#7dd3fc` returns zero; both hues read
from tokens or, failing that, are listed in the same allow-list mechanism as gold so
the next palette change cannot silently skip the renderer. Grade: [ ]

    `--ss-sky` `#A6CDEB` is **PROVISIONAL**, the only non-final value in this port.
    It was chosen against a near-black ground and Stone is roughly 30 points
    lighter. Final sign-off happens with Stone behind a flag against live tiles.
    Do not record it as settled.

15. **No literal font size outside the kit module.** RULED IN by the operator
2026-08-28. The palette author's position, which the ruling adopts:
"The 470 inline spellings are the real defect, not the off-ramp sizes. A rule that
no literal font size may appear outside the kit module is worth more than every
ruling in this port combined."

    This is correct and it is bigger than what P-95 currently scopes. Today the card
    changes 470 literals from old values to new ones, which leaves the ramp exactly
    as untethered afterwards as before, and guarantees this same port is re-run at
    the next palette change. The alternative is to replace those literals with kit
    references, which is comparable edit volume for a permanently token-driven ramp
    and makes every future ruling a one-line change.

    The gate refuses any numeric `fontSize` outside `src/styles/`, verified by
    adding one in a component and watching CI fail. Note the gate walks `.tsx` only
    today, so this rule must walk `.ts` too or it is blind to the kit module's own
    neighbours.

    **Land in two commits, not one.** Values first, references second. The values
    commit is mechanical and diffable. The references commit must produce zero
    visual change, so any pixel that moves in it is a bug with an obvious cause.
    Bundled, a site that changes value and indirection at once makes a regression
    hard to attribute, and 470 sites is too many to bisect by eye. Grade: [ ]

    Geometry has the identical shape and is deliberately NOT in this card. The type
    ramp proves the pattern first. Recorded so the omission reads as a decision
    rather than an oversight.

    Standing rule adopted regardless of the above, from the same ruling: a size is
    not ruled without naming its call sites. A token with zero consumers is a
    comment. Where a ruled value cannot reach the screen, the palette author is told
    and re-rules against what can.

## Out of scope

The non-Stone defect pile found while scoping this card. It is real and it is
separately actionable, and it is NOT part of a palette change: the dead `pe-dock-in`
animation referenced at `src/components/Dock.tsx:54` and declared nowhere; five
dialogs with no focus trap, no focus restore and no Escape on the kit Modal; the
gate walking `.tsx` only so raw hex in `.ts` files is invisible; 18 of 48 legacy
aliases carrying literals against the file's own header rule; the ramp rule
covering 32 files of 57. Proposed as its own row, not yet operator-ruled.

Also out: any change to gold. Any translucency restoration. Any adjustment of a
Stone token value to clear contrast. Importing the SmartCity kit. W8.

## leave_behind at close

    leave_behind:
      - item: doc_repo planner's read-only export P:/tmp/ss-app-be60021
        owner: doc_repo planner
        plan_row: P-95
      - item: build artifacts P:/tmp/ss-ds-v3, P:/tmp/ss-ds-v4, P:/tmp/ss-ds-proof
        owner: doc_repo planner
        plan_row: P-95
      - item: stale branch ss/design-system-upgrade in P:/hauska-map, worktree
              already removed, branch not yet deleted
        owner: doc_repo planner
        plan_row: P-95
