# CTX-B4 — make the Property Explorer valuation label say what the value actually is

repo: hauska-map

## Why this lane exists

CTX-B1 (legacy-design-tools PR #650) implemented operator ruling A1: a served dollar now
carries a `valueBasis` derived from the row rather than asserted by a constant. A row whose
`assessed_value` is absent at the declared vintage serves `valueBasis: "stratmap-redistributed"`.
A genuine county-appraisal-export row still serves `"county-assessed"`.

CTX-B1 reached three of four serve paths and **named the fourth as out of its scope rather than
silently dropping it**: the Property Explorer label lives in this repo. That is this lane.

## What a customer is served today, measured

Read on the production Smart Site connector at paid depth, 2026-09-10:

    48309:184293  311 Austin Ave, Waco    market 6,506,490   StratMap-redistributed
    48055:32541   308 W San Antonio       market 1,884,580   genuine county export

Both render identically. The relevant code:

- `fact-sheet-resolver.ts` around 289-298 builds `cadProvenance` and labels the row
  `"${countyName} County appraisal roll"`, with `source: facets.provenance?.parcelSource ?? "cad-roll"`.
  `parcelSource` is the bake constant `"conformant-v1-cad-parcel-roll"` on every row.
- `InspectCard.tsx` around 1128-1133 renders the row under the fixed heading "Tax-assessed value".
- `tax-valuation-paint.ts` around 24-31 carries a module comment asserting the figure is
  "A REAL, SOURCED FIGURE FROM THE COUNTY APPRAISAL DISTRICT".

For a StratMap-redistributed dollar every one of those three statements is false.

## The question, not a conclusion

`valueBasis` now arrives on the wire on each of the four dollar fields. **Decide and justify how
the panel should express the two bases** so that a viewer can tell them apart without being told
the value is missing. Name at least two candidate treatments and say why you rejected the one you
did not take. Consider at minimum whether the distinction belongs in the row heading, in the
provenance chip, or in both, and what a viewer who never opens a tooltip will take away.

Constraints that bind the answer:
- The value is **present and usable**. Ruling A1 explicitly rejected turning it into an absence.
  Do not render it as missing, unknown, degraded, or refused.
- Do not invent a confidence number. The house rule is a provenance chip, never a bare score.
- `valueBasis` may be absent on an older baked payload. Decide what an absent basis renders as,
  and make that decision explicit rather than defaulting.

## Verify by violating

A fixture carrying `valueBasis: "stratmap-redistributed"` must not render the county-appraisal
wording. Observe that failing against current code before your change, and passing after. Keep a
genuine `county-assessed` fixture as the control and show it unchanged.

Also correct the `tax-valuation-paint.ts` comment. It is a load-bearing false statement about
provenance sitting in the source.

## Scope

`hauska-map` only. Do not write to legacy-design-tools, hauska-factory or hauska-engine.
Do not deploy. The integration seat owns every deploy and execution.

Register your worktree in `_catalog/seat_register.json` before working, confirm seat, branch and
commit, and declare that snapshot in your close.

## Close contract

Standard lane close JSON, plus: the treatments you considered and why you chose one; what an
absent `valueBasis` renders as and why; both violation runs; the exact files and line ranges you
changed; and `leave_behind`. Commit on your branch, push, and open a PR. Do not merge; report the
PR number and the head SHA.
