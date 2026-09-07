---
id: 2026-09-07_button_fill_translucent_to_solid
title: Property Explorer buttons move from translucent/hairline to a solid fill
status: active
date: 2026-09-07
plan_row: none (hand-carried UI QA lane, Batch 1)
owner: Nick (operator)
supersedes: partial reversal of the 2026-08-27 button-styling ruling referenced below
---

# Property Explorer buttons move from translucent/hairline to a solid fill

## Decision

Property Explorer's shared `Button.tsx` component (primary/secondary/ghost/subtle
variants) drops the translucent/glass fill treatment. Buttons render with a solid
(dark) background instead. Ruled verbally by the operator this session: "I want to
remove the translucent part, it doesn't look good."

This reverses only the translucency/opacity choice, not the color rule sitting
underneath it. The still-binding constraint, per the Stone/Smart-Site design
system (`_inbox/2026-08-29_smartsite_mcp_app_design_handoff.md` rule 2, CI-enforced
in at least the MCP app): no solid BLUE fill on a button, primary included. The fix
is opacity going from translucent to opaque; it is not a license to reintroduce a
solid blue fill. If the dark solid fill needs a hue, it comes from the existing
Stone neutral/ink ramp, not `--ss-blue`.

## Why

The operator found the current translucent/hairline button treatment ugly in
practice, surfaced independently by both the 9-4 UI review (Tab 2 item 1: "change
all of the buttons to the darker background") and this session's UI QA lane
(`cente-7d`, which found the shared component already matched the old ruling and
flagged the conflict before touching it rather than guessing). Two independent
reports of the same problem is enough to act on without further design review.

## What this rests on

`cente-7d` (hauska-map-ui-qa lane) read `Button.tsx` directly and reports all
variants currently render translucent/hairline, attributed in-repo to an
2026-08-27 operator ruling that killed an earlier garish solid blue fill. This
record has not independently verified that exact prior ruling's source location;
the lane is closer to that evidence than the doc_repo integration seat is. The
Stone palette port (`_decisions/2026-08-28_stone_palette_exact_port.md`) made the
app's general chrome tokens opaque the same week but did not touch button-variant
styling specifically, which is a separate component, not a `pe-tokens.css` token.

## Reversal criteria

Reverse if the resulting solid-fill buttons read as the garish treatment the
2026-08-27 ruling was reacting to in the first place, i.e. if solving translucency
just reintroduces the original complaint from the other direction. The instrument
is the operator looking at it rendered, not a metric.

## Evidence

Not yet independently rendered/screenshotted as of this record; `cente-7d` was
mid-investigation (had not yet located the actual dark-background outliers vs. the
shared component) when this ruling landed. Before/after evidence to follow when
the lane reports the close.
