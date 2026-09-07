---
lane: integration
item: "setback-rule atoms actively mislabel verification tier, not just fail to carry it — a mapping bug collapses primary-source-verified (the highest tier) into the same 'asserted' bucket as transcribed-only data, so a Round Rock value and a Taylor value read identically confident today"
checkpoint: "Root cause fully traced to an active mapping bug (not an absent or unfed field). Not fixed. Sizing: a mapping-function fix plus a payload-vocabulary widening, smaller than a from-scratch contract field but not a one-line patch either. No owner assigned yet."
date: 2026-09-07
---

## What happened

While closing item 6 of the boundary-envelope program (nine-city setback
onboarding), the coordinator thread (doc-repo-6f) asked a real question about
data quality: two of the newly-onboarded cities (Taylor, Liberty Hill) carry
`asserted`-tier data only in the published `@empressaio/setback-corpus`
package, versus `primary-source-verified` or `human-verified` for the other
nine. The integration seat's initial ruling — that this is acceptable as long
as the tier distinction travels with the data rather than flattening to look
uniform — was correct as far as it went, but rested only on confirming the
corpus package itself carries the field. doc-repo-6f pushed further: does the
distinction actually survive to a customer-facing surface (an inspect card, a
PDF report), or does the honest labeling only exist at the corpus layer where
it's trivially true?

## Root cause, traced to the actual code (Engine, 2026-09-07; corrected same day
## by the cross-thread coordinator, doc-repo-6f, reading the published contract
## source directly rather than accepting the trace as given)

Engine's first pass found: the writer
(`packages/engine-core/src/setback-writer/plan-city-setback.ts`,
`resolveDistrictRow`) reads only `districtCode` and `citation_url` off the
matched district, never `district.provenance[field].verification_state`; the
`PlannedSetbackRow` type it builds has no field for it. That part stands.

Engine's second claim — that the atom contract itself "has no slot to carry
the value" — was too strong, and doc-repo-6f corrected it against the actual
published source rather than the trace: `SetbackRuleAtomInstance` already
carries `fieldProvenance?: SetbackFieldProvenance`, a purpose-built per-field
provenance channel (`front`/`side`/`rear`, each `{atomDid, confidence:
WidthedConfidence}`), documented verbatim in `src/property/setback-rule.ts`:
"Consumed from setback JSON; do not invent tiers." The author's intent for
tiers to flow through exactly this channel is explicit, not inferred.

What remains genuinely true: the channel's actual payload can't carry the
corpus's vocabulary faithfully even if fed. `WidthedConfidence.provenance` is
`CalibrationProvenance` (`asserted | backtest | seed | live`) — a calibration
axis describing how the atom's own confidence score was earned, not a
source-verification axis. It collides with the corpus's `verification_state`
vocabulary (`asserted` / `human-verified` / `primary-source-verified`) at
exactly one value and has no way to express the other two.

**Resolved, traced to the real code (Engine, second pass): the channel is fed,
and the bug is worse than starvation.** The first trace checked the wrong
file (`plan-city-setback.ts`, the county-planning layer). The actual per-parcel
atom assembler, `packages/engine-core/src/property-reasoning/emit-setback-rule.ts:217-239`,
does populate `fieldProvenance` on every setback-rule atom, front/side/rear.
The defect is one function downstream of that:
`packages/engine-core/src/property-reasoning/confidence.ts:90-101`,
`widthedFromFieldProvenance()`. Its `CalibrationProvenance` mapping is a
single binary check — `verification_state === "human-verified" ? "backtest"
: "asserted"` — so every other value, **including `primary-source-verified`,
the highest tier**, falls through to `"asserted"`, the same bucket as
genuinely transcribed-only data. A Round Rock or Waco primary-source-verified
value and a Taylor asserted-only value produce the identical `"asserted"` tag
on the final atom today. This is not silence; it is an active mislabel that
reads equally confident either way, closer to ENFORCEMENT's "fabricated
value" class than to a starved mechanism.

**Consequence, unchanged from the original finding**: nothing downstream —
Property Explorer's inspect card, any PDF report, the MCP app's brief
assembly — could be showing an honest verification-tier distinction to a
user today, because the atom itself no longer carries one past this mapping
step. No rendering-side investigation was needed to establish that.

**Sizing, corrected a second time**: smaller than "add a field to a published
contract from scratch" (Engine's first estimate) — this is fixable as a
mapping-function change plus widening what a `fieldProvenance` entry can
hold, not an entirely new top-level field. But it is not a one-line fix
either: `CalibrationProvenance`'s four values (`asserted`/`backtest`/`seed`/
`live`) cannot cleanly hold three real verification tiers without either an
honest, explicit collision or overloading values for a meaning they weren't
designed to carry. A real fix needs a genuine remap plus (probably) a
distinct verification_state slot on `fieldProvenance` separate from the
calibration axis.

## A live illustration of ENFORCEMENT's opening line, found the same day

`hauska-engine` PR #393 (merged 2026-09-07, 01:59Z), titled "correct
overclaimed verification_state on Waco/Kyle/Round Rock setback provenance,"
touched exactly three files (`kyle-tx.json`, `round-rock-tx.json`,
`waco-tx.json`). Real effort was spent correcting the honesty of a field
that — per the finding above — the writer never reads, that reaches no
atom, and that reaches no customer. The correction itself was right and
remains right; it changed nothing observable. This is ENFORCEMENT.md's
opening sentence ("an artifact that exists, is correct, and does nothing is
the defect class this operation actually suffers from") caught in the wild,
same day, in this operation's own work.

## Why this matters against standing doctrine

Directly engages the portfolio's second structural commitment
(`CLAUDE.md`): "Confidence is earned, not asserted... confidence falling back
to an asserted baseline carrying provenance and verification state, never a
bare or unearned number presented as earned." Today, for setback data, the
asserted baseline's provenance and verification state does not fall back
anywhere visible — it is fully lost before the atom exists. This is a real,
pre-existing gap that tonight's Taylor/Liberty Hill onboarding surfaced
incidentally, not a defect introduced by tonight's corpus-merge work.

## Ruling on item 6 (boundary-envelope program), separate from this gap

This finding does not retroactively unland item 6's nine-city setback
onboarding — the underlying ordinance data is real, present, and correctly
tiered at the corpus-package layer, which is what item 6 required. This is a
separate, broader gap about whether that tiering is ever surfaced past the
corpus, and should be tracked as its own item rather than folded into or used
to block item 6.

## Not done

Sizing or building the fix. Real shape, per Engine's own estimate: an
`@empressaio/atom-contract` field addition (a real published-package version
bump, same class of change as tonight's `property-boundary-edge` orphan-type
work) plus a writer change in hauska-engine to actually read and forward the
corpus's `verification_state`. No owner assigned; needs an operator or
coordinator call on priority given it's a portfolio-wide gap, not scoped to
any single city or program.
