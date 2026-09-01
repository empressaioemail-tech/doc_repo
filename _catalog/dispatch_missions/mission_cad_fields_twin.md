# Mission — put the CAD value fields on the twin, before Wave R closes the door

## Why this card exists, and why it is time-boxed

Nine customer-facing CAD fields are landed, correct, and unreachable from the twin.
The Tier-1 conformant bake's claim reader (`readConformantCadClaim`,
`nodeFacetBakeTier1Conformant.ts:175-185`) takes only `countyFips`, `propId`,
`situsAddress`, `situsCity`, `situsZip`, `landAcres` and `propertyUseCode`. Its own
docblock at line 40 says plainly: *"The claim carries `ownerName`. This module never
reads it."* Everything else on the row is dropped before the bake.

So the values exist, they are already `public-free` on the atom, and the brief already
serves several of them. The twin cannot reach them because nothing reads them.

**The deadline is real and easy to miss.** New fields appear on the twin only after a
bake runs, and the standing ruling is one more production bake, Wave R, then no
re-bake. **Merged before Wave R, these ride a bake that is already happening and cost
nothing. Missed, they wait for a bake the operator has ruled against.**

## In scope

Add to the claim reader, serialize, and serve:

| Field | Today |
|---|---|
| `marketValue` | brief only (`cad:property`, FREE) |
| `assessedValue` | brief only (`cad:tax`, FREE) |
| `landValue` | brief only (`cad:property`) |
| `improvementValue` | brief only (`cad:property`) |
| `livingAreaSqft` | brief only (`cad:property`) |

**Also sweep the second category while you are in here.** Section 2b of
`_inbox/2026-08-31_capability_inventory.md` lists fields the bake already **reads** and
never **serialises**. Those are cheaper than the ones above, because they need no
reader change. Report what you found and take the ones that carry no policy question.

## Explicitly out of scope

**`ownerName` and `ownerMailingAddress`.** Deliberate policy. The twin serves owner
via `owner-fact` at studio/team entitlement and strips owner-shaped keys at any depth.
Do not route them through this path.

**`exemptionCodes`.** Texas Tax Code 25.027 restricts posting appraisal information
that indicates an owner is 65 or older, and `cad:tax` currently decodes those codes
into labelled prose. That is a question for counsel and it is unanswered. **Serve the
values, hold the exemption decode.** They separate cleanly and the values are the
valuable half.

**`legalDescription`.** It needs a working parser, and the shipped regexes are wrong on
8 of 8 real forms and return wrong non-nulls on two. That is its own card.

**`yearBuilt`.** Already served via `structuralFactRead.ts`.

## Build tier-aware, do not allocate tiers

The operator is settling the pricing tier structure in a separate workstream.
**Default each field to the access policy its atom already carries** and route it
through the existing gate, so a later tier decision is a configuration change and not
a code change.

Do not hardcode a tier. Do not invent a new gate. The failure mode this avoids is
every future pricing decision becoming an engineering ticket.

## Honesty requirements, which are not optional here

These are money numbers on a customer surface.

Every field carries its **source and vintage**. The tax year is already on the claim,
so vintage is free; use it rather than the request clock.

A field the row does not carry is **absent with a basis**, never `0`. A zero dollar
value is a claim about the world and a missing one is a claim about us, and `0` is the
single easiest way to fabricate a fact here. The refusal path already exists and is
tested; use it rather than writing a new one.

**Do not derive.** Do not compute a value the CAD row does not state, and do not sum
land plus improvement to synthesise a market value. If two CAD fields disagree,
declare the disagreement rather than picking.

## Falsifier, stated before you run it

A live twin response for a parcel with known CAD values shows those values with source
and vintage attached, and a parcel whose row lacks them shows **absent with a basis and
never `0`**. Both arms. A field observed only appearing has not been observed
refusing.

Confirm on a parcel in more than one county, since the claim row shape has already
differed across counties.

## Do not

- Do not run a bake or a publish from this card. It rides Wave R.
- Do not emit `0` for a missing value.
- Do not serve owner fields or decoded exemption codes.
- Do not hardcode a pricing tier.
- Do not touch the store; this is a code change.
- Do not touch any repository other than the registered LDT worktree you open.

## Close

Use the exact CP1 / CP2 / CLOSE paths named at the end of this dispatch. Declare
snapshot in the first output. State the falsifier before running it and report both
arms. Report what section 2b's sweep found. `leave_behind` named. Subagents do not
commit.
