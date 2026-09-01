---
date: 2026-08-28
topic: Smart Site design system upgrade; Stone palette exact port opened as P-95; chrome defect pile opened as P-96; the design system folder rebuilt and swapped in
agent: claude_code (planner, six subagents, adversarially reviewed)
plan_row: P-95, P-96
---

# Session: the Stone palette, and six controls that were reporting success

## Summary

The operator asked for a complete design system upgrade of `P:/tmp/Smart Site Design
System` and for the work to be fanned to agents and adversarially reviewed. What the
folder turned out to be reframed the whole engagement: not a disconnected mock, but a
proposed re-valuation of the exact 63-token `--ss-*` contract the production Property
Explorer already implements. Same names, different values. The port is therefore a
value migration, not a rewrite.

The planner established that from the wrong tree first. `P:/hauska-map` was 222
commits behind `origin/main`, and against that stale checkout the planner reported
that the app shared zero token names with the design system and that the folder's
central claim was false. Both were wrong. At the real tip (`be60021`) the name sets
match 63 of 63 and the folder adds exactly one, `--ss-brand`. The correction was
issued to the operator and to the three subagents already reading the stale tree
before their findings hardened.

Four operator rulings shaped the card. Go all the way into `hauska-map`. Do NOT keep
the translucent chrome. Ship the exact look in one card rather than splitting colour
from scale. And convert the 470 inline font sizes to kit references rather than only
changing their values. The planner recommended against the second and third and was
overruled on both; the decision record says so, because a record that reads as though
the planner agreed is useless later.

The palette author was then relayed a question list and ruled on contrast values, a
seventh type step with a four-site allow-list, the two map hues and their casings,
and the derived-wash pattern. Their line-28 value missed its own threshold at 2.974
against `--ss-raised` and was corrected to `#86867D` on measurement and their
confirmation. They also withdrew their own first wash prescription as the same defect
it was meant to fix, which is the strongest single move in the session: a wash is now
`color-mix(in oklab, var(--ss-warn) 13%, transparent)`, derived and therefore unable
to desync, rather than a literal alpha that becomes the 170th copy of a token value.

Two cards were opened. P-95 is the exact port, sixteen acceptance items, sequenced
after P-93 because both change `pe-chrome-kit-gate.mjs`. P-96 is everything found
while scoping that is not palette work, kept out deliberately.

## What the port is actually made of

The token file governs colour and nothing else. All six `--ss-fs-*` and all five
`--ss-h-*` tokens have zero consumers; the type ramp lives as raw numbers in 470
inline sites plus the `TYPE` object, and geometry as plain numbers in `PE`. A
"paste the `:root` block" migration, which is what the design system's own readme
instructed, changes colour and silently no-ops on roughly nineteen of its tokens.
That is the defect class ENFORCEMENT names first, and it was sitting inside the
instruction sheet.

The app's own gate refuses the Stone scale, which is the gate working: `LEGAL_RADII`
is `{0,4,6,8,10,14,999,50}` and Stone needs 12 and 18.

## Findings, each verified by the planner before recording

**The chrome gate sees 7.1% of the colour literals it appears to police.** 25 lines
seen, 327 blind. `chromeFiles()` walks `.tsx` only, so 80 hex lines in `.ts` are
invisible, and no rule matches any non-hex form, so 198 `rgb`/`rgba`/decimal-triple
lines pass unseen along with 84 named-colour sites. The palette author's instruction
to ask what else the instrument is blind to produced this; it was not on the planner's
list.

**169 literal-beside-token colour sites**, splitting into 122 standalone literals that
will desync on the swap and 44 `var(--token, <literal>)` fallbacks. They are decimal
rgb triples inside template strings, so a hex grep finds none. `StatusChip` passes the
token for its label and a hardcoded rgb for its fill; `StateNote` does it across all
four registers. Ruled: the fallback form is banned outright, being a second source of
truth that surfaces only when the first is missing.

**`pe-dock-in` is a dead animation**, referenced once at `Dock.tsx:54` and declared
nowhere, while `IMPLEMENTED.md:29` records it shipped.

**Oxygen ships at two live call sites** where it cannot load, while three tests assert
its absence and none of them reads either file, and the gate has no font-family rule.
Armed, correct, and pointed away from the violation.

**Zero focus-trap logic app-wide** behind five dialogs, with no Escape on the kit
Modal, so Settings, Pricing, Checkout and SignUp are keyboard-undismissable over a
live map.

**The basemap is bright aerial imagery, not a dark vector map.** Established by
driving headless Chrome to the live app past the cold open. This retired the planner's
own argument for translucency: at `.94` a panel over that imagery already reads
opaque, so the delta is about 6% and the "dimming to occluding" claim was withdrawn.
The same capture surfaced `LANDUSE_JOIN_HOLD county 48491 — TxGIO prop_id does not
join CAD property_use_code` printed to customers in the ZONE slot, which became P-96
item 7.

## Shipped

| Artifact | Evidence |
|---|---|
| P-95 opened | OPS-16 A-049; `8323958` |
| P-96 opened | OPS-16 A-050; `2f3d315` |
| Decision record | `_decisions/2026-08-28_stone_palette_exact_port.md` |
| P-95 WDLL, 16 items | `_inbox/2026-08-28_p95_stone_palette_WDLL.md` |
| P-96 WDLL, 8 items | `_inbox/2026-08-28_p96_chrome_defect_pile_WDLL.md` |
| Compiled dispatch | `_dispatches/2026-08-29_p95-stone_dispatch.md` (preamble `v6f9d139b`, contract `v1890f0bb`, fleet-memory `v2a98086b`) |
| Design system rebuilt and swapped in | `P:/tmp/Smart Site Design System`, `npm run check` self-tests both directions |
| Original preserved | `P:/tmp/Smart Site Design System (original 2026-08-28)` |
| Ported token candidate and evidence | `P:/tmp/ss-ds-v3/` |
| Palette comparison harness | `P:/tmp/ss-ds-proof/palette-proof.html` |
| Live-app evidence | `P:/tmp/ss-map-shot/live-map-parcel.png` |

The rebuilt system ships 16 components with real `:focus-visible` and a focus-trapping
Modal, 11 ESLint rules each proved by violation, a contrast checker whose palette and
component sections are separated so it gates only on what the system owns, and a
token-consumer check that fails if the readme ever claims a documentation-only token
band is live. The previous folder's lint could never have run at all: every rule was
`no-restricted-syntax`, which oxlint does not implement. That claim is the subagent's,
evidenced by the runner's refusal, and was not independently reproduced by the planner.

## The planner's own instrument failures

Six, and the pattern is the one ENFORCEMENT added on 2026-08-21: every wrong statement
came from an ad hoc instrument whose failure mode was a plausible answer, and none was
caught by re-reading the conclusion.

1. Measured the app against a 222-commit stale tree and reported two load-bearing
   claims backwards.
2. Removed the pinned worktree while two subagents were still reading it, emptying it
   under them. A grep over an emptied directory returns zero matches and looks exactly
   like a clean result.
3. Used plain `grep` with `?`, which is literal in BRE, so `"fontSize: ?34"` searched
   for that string and returned a false zero.
4. Used `13\b`, which matches inside `13.5`, producing a list full of the wrong sites.
5. Truncated a grep with `head` and came within one command of reporting a subagent's
   correct Oxygen finding as wrong.
6. Suspected the contrast binding gate was dormant when its narrower scope was
   declared in its own header.

The subagent returns were graded the same way and two were sent back. The proof
harness had invented nine values on a premise that measurement contradicted, rendering
Stone better than a faithful port in the direction its own limits section claimed to
lean against; it was caught only because the agent disclosed the invention. The token
agent's checker initially hardcoded a focus-ring colour not present in the file under
test, a proxy for the record rather than the record.

## Open

`Button / hover fill vs panel` at 1.20:1 is left failing rather than exempted, because
it is neither a border nor a separator and whether a hover tint owes 3:1 is a design
call. One line from the palette author settles it.

Three `--ss-err` pairings at 4.47:1 sit in the palette section awaiting an operator
ruling, listed with their minimum clearing values.

P-95 cannot start until P-93 closes.

## leave_behind

    leave_behind:
      - item: local branch ss/design-system-upgrade in P:/hauska-map, worktree
              removed and pruned, branch deletion denied by permission
        owner: doc_repo planner
        plan_row: P-95
      - item: P:/tmp/ss-app-be60021, P:/tmp/ss-ds-v3, P:/tmp/ss-ds-proof,
              P:/tmp/ss-map-shot, and the dated original palette folder
        owner: doc_repo planner
        plan_row: P-95
