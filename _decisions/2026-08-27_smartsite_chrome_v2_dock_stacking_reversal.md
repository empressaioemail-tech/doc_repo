---
title: Dock stacking ships; the one-dock ruling is reversed
date: 2026-08-27
type: decision
status: active
owner: Nick
last_updated: 2026-08-27
repos: [hauska-map]
supersedes: _decisions/2026-08-27_smartsite_chrome_v2_one_dock_ruling.md
---

# Dock stacking ships; the one-dock ruling is reversed

## Decision

Property Explorer ships **multi-dock stacking with fold-to-header**, per chrome
v2 `SPEC.md` section 2. Opening a tool folds every other open tool to its 36px
header instead of replacing it. The one-dock ruling taken earlier the same day
is reversed, and the guard tests that enforced it are replaced.

The dock column stays on the **right**. Moving it to the left, as the drop
draws it, was not part of the ask and remains unsettled.

## Context

The one-dock ruling was taken before the operator had used the shipped v2
chrome. After using it, the operator asked for stacking, reporting two
symptoms: missing animation, and docks that looked like some had received only
a partial treatment.

**The assumed cause was wrong, and saying so mattered more than shipping the
request quietly.** Stacking could not have produced either symptom. Both were
defects in the wave-1 delivery, and both were measured before anything was
changed:

1. **Six primitives shipped with zero call sites** — `ss-pulse`,
   `LabelledSkeleton` (and with it the shimmer), `LoadingCount`, `Rule`,
   `FieldError`, `UnverifiedSource`. A motion system was delivered and then
   largely left unreachable. Dormant mechanisms report as success, which is why
   this survived a green suite, a clean build and a live bundle check.

2. **Two of eighteen dock surfaces were actually ported.** The dock shell was
   v2 while the bodies were still on the v1 half-steps —
   `PropertyDossierDetail` carried 30 v1 values, `ChatTool` 43. Renaming the
   legacy `PE.*` keys would have changed nothing a person could see, because
   they already resolve to v2 values; the visible gap was the type ramp and the
   radii.

Stacking was shipped because it was asked for and is a real improvement. It was
not shipped as the fix for those two, which were fixed on their own terms.

## Consequences

- `workbench/dock-stack.ts` holds the rules as pure functions, matching this
  repo's stated idiom (vitest runs in a node environment with no click
  harness).
- The two guards that enforced one-dock were **replaced, not deleted quietly**,
  which is what the superseded record said reversing would require: 16 rule
  tests plus 6 render tests, including the invariant the old rule could not
  hold — no operation except an explicit close ever reduces what is open. Three
  render tests were verified by violation.
- The app shell still owns a single `openToolId`, so `ExplorerMap` and every
  `ensureWorkbenchTool` caller are untouched.
- The v2 type ramp is now **enforced** by the chrome-kit gate rather than swept
  once by a codemod, because a codemod that runs once and is not enforced
  drifts back.
- Live on smartsite.cloud; hauska-map #261 (`bd3ffac`) and #262 (`0cb8758`).

## Reversal criteria

Reverse if a column of folded headers proves to cost more than it saves — if
the operator finds the stack accumulates docks nobody closes and the useful
map area shrinks in practice. That is the concrete failure the single-dock
model prevented, and observing it is the evidence that would flip this back.

Reversing means restoring `nextOpenToolId` as the only rule and deleting
`dock-stack.ts` with its 22 tests, deliberately, in a card that names them.

## The lesson worth keeping

A symptom report can be right about the symptom and wrong about the cause. The
right response was to measure both before touching either, ship the request,
and say plainly that it was not the fix. Had the request been shipped as the
fix, both real defects would still be live and would have been credited as
solved.
