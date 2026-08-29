---
id: 2026-08-28_stone_palette_exact_port
title: Stone palette ships as an exact port, opaque chrome included
status: active
date: 2026-08-28
plan_row: P-95
owner: Nick (operator)
supersedes: none
---

# Stone palette ships as an exact port, opaque chrome included

## Decision

The Smart Site Property Explorer moves from the shipped v2 dark palette to the
warm neutral Stone palette held in `P:/tmp/Smart Site Design System`. The port is
exact. Every one of the 63 token values is taken verbatim from that folder, plus
the one token it adds, `--ss-brand`. Colour, type ramp, radii and control heights
all move together as a single card. No value is adjusted on the way in.

Three sub-rulings were taken at the same time.

The map does not read through the chrome any more. The six translucent tokens
`--ss-ink-94`, `--ss-ink-92`, `--ss-ink-90`, `--ss-ink-96`, `--ss-raised-97` and
`--ss-raised-98` take the folder's opaque hex values. Only `--ss-scrim` stays
translucent, which is what the folder itself specifies. The planner recommended
preserving the alpha ladder and the operator declined.

The work is one card, not two. The planner proposed splitting colour from scale so
Stone could be seen in production before buying the expensive half. The operator
declined and asked for the exact look in one move.

Contrast failures are reported, never silently corrected. The Stone values fail
WCAG in 29 of 80 measured pairings. Correcting them would hand back a different
palette than the one chosen, so they are priced and listed individually in a
contrast annexe for separate operator ruling.

## Why

The operator authored the Stone palette as a deliberate design direction and asked
for that direction, not a negotiated approximation of it. A palette that arrives
adjusted for contrast, split across two releases and with its translucency
decision reversed is a different artifact than the one that was chosen. Where the
planner disagrees, the correct move is to price the consequence and surface it,
not to absorb it into the values.

The one exception is a component choosing a token outside the job that token's own
comment declares. That is a component defect and not a palette question. `Marks`
renders its off state at 1.54:1 by using a hairline token as a text colour, which
makes the coverage indicator invisible in a product whose stated promise is being
explicit about absence. Defects of that class are fixed without touching the
palette.

## What this rests on

The port is cheap in one dimension and expensive in another, and the split is not
where it looks.

The token name contract already matches. The app's `pe-tokens.css` and the Stone
folder declare the same 63 `--ss-*` names, verified by set difference at commit
`be60021`. The folder adds exactly one name.

Colour is a real token system and size is not. Colour reaches 73.2% tokenization.
The type ramp reaches 0.0%: all six `--ss-fs-*` tokens have zero consumers, and the
ramp is instead spelled as raw numbers roughly 470 times across the app, with only
two files reading the `TYPE` object. Geometry is the same shape, living as plain
JavaScript numbers in `src/styles/pe-chrome.ts`. Editing the token file alone
changes colour and nothing else.

The app's own gate refuses the Stone scale. `scripts/pe-chrome-kit-gate.mjs`
hardcodes `LEGAL_RADII` as `{0,4,6,8,10,14,999,50}` and a type ramp of
10/11.5/12.5/13.5/15/20. Stone needs radii 12 and 18 and steps 14.5, 15.5, 17.5
and 26. The gate constants move with the palette or the build fails, which is the
gate working correctly.

## Reversal criteria

Reverse if, once Stone is live, the opaque chrome measurably degrades the parcel
scanning task the dock exists to serve. The instrument is the operator using it,
not a metric. The revert is cheap for colour, since it is a token file, and
expensive for scale, since it is roughly 470 sites.

Reverse the exact-port discipline if a contrast failure in the annexe turns out to
block a customer commitment rather than an internal preference. In that case the
specific token moves and this record is amended with the ratio that forced it.

## Sequencing

P-95 starts after P-93 closes. P-93 is arming `pe-chrome-kit-gate.mjs`, and P-95
must change that same file's ramp and radii constants. Running both at once
collides on one file. P-93 puts "restyling the whole app" out of scope explicitly,
so P-95 is not smuggled into it and does not violate the P-93 kit freeze: freezing
`pe-tokens.css` as the only kit bars a competing kit, not a re-valuation of that
same file.

## Evidence

Snapshot for every measurement in this record: `hauska-map` at `be60021`, read as a
plain export at `P:/tmp/ss-app-be60021`.

Token name parity, gate constants, consumer counts and the inline literal count
were measured by the doc_repo planner. The surface inventory, token drift audit and
adversarial folder audit were produced by subagents and their load-bearing claims
were re-verified independently before entering this record.
