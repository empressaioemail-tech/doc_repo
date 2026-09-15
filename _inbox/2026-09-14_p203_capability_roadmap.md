---
id: 2026-09-14_p203_capability_roadmap
title: P-203 — the eight rails no county has, and whether a source exists at all
date: 2026-09-14
status: lane returned read-only; filed by the integration seat because the lane had no write path
kind: research
owner: nick
programs: [OPS-24]
plan_rows: [P-203]
related:
  - 90_operations/OPS-24_county_to_serving_program.md
  - _inbox/2026-09-14_county_to_serving_WDLL.md
  - _dispatches/2026-09-14_p203-capability-roadmap_dispatch.md
---

# P-203 — the capability roadmap

> Filed by the integration seat. The lane was dispatched READ-ONLY with "no repo writes" and
> was also asked for a close artifact. It resolved that contradiction by writing nothing,
> which was the correct reading of the instruction it was given. **The mission was the
> defect and it is fixed**; see the provenance note at the end.

## Verification posture, stated before the findings

One claim was verified at source by this seat because it changes a roadmap item into a
permanent refusal: the `salesHistory` statutory basis. **The other seven rows are the lane's
research and are recorded as REPORTED, not confirmed.** They are good enough to order work
against and not good enough to quote externally. Anyone acting on a specific row verifies that
row first.

## The eight rails

| Rail | Source | Scope | Basis |
|---|---|---|---|
| `terrain` | exists | **statewide** | public, USGS 3DEP |
| `ossf` | exists | per-county but **bounded**, about 56 named holders | public |
| `permits` | exists, fragmented | per-municipality | public |
| `easements` | exists | per-county, 254 | public plus a licensed aggregator layer |
| `mineralRights` | structurally partial | per-county | public, incomplete by construction |
| `hoaDeedRestrictions` | split, see finding B | statewide for existence, per-county for text | public |
| `treeProtection` | no index known | per-municipality | public where an ordinance exists |
| `salesHistory` | **none, and none is possible** | n/a | see below |

## `salesHistory` is not a gap. It is a permanent refusal

Texas is a non-disclosure state. Verified at source by this seat, not taken from the lane:

Government Code 552.149 excepts real-property sales prices received from a private entity by
the comptroller or a chief appraiser from public-information disclosure. Tax Code 22.27 makes
information an owner gives an appraisal office confidential, including a sale price
voluntarily disclosed under a promise of confidentiality.

The underlying cause is broader than the two statutes: Texas imposes no mandatory
sale-price disclosure at all, so in most transactions there is nothing filed to protect, and
these sections close the remaining path through the appraisal district. **The deed record
carries the transfer EVENT; no public record in Texas carries the PRICE.**

**Consequence: `salesHistory` should be declared a permanent refusal with this statutory
citation, in the same shape as the envelope family's R-2, rather than sitting on a roadmap as
work someone might one day do.** A rail that cannot be acquired lawfully from public record is
not a backlog item. Any future price capability is a licensed-source decision with its own
terms, and that is a commercial question for the operator, not a capability build.

**The capability roster is therefore SEVEN, not eight.**

## Two findings that change the ordering

**A. `ossf` and `permits` share a source across most of Texas.** Texas counties generally
cannot require building permits for ordinary single-family construction outside city limits.
In unincorporated Texas the OSSF permit is effectively the permit record, so one acquisition
serves two rails over the large majority of the state's land area. Two rails from one build
is exactly the case the dispatch asked to be surfaced rather than buried in two rows.

**B. `hoaDeedRestrictions` is two mechanisms under one name.** SB 1588's statewide TREC
database answers "does an HOA exist here", which is statewide and cheap. It does not answer
"what does it restrict", which lives in per-county deed records. These are different builds
with different scope and should not share a roadmap line. The existence half is a statewide
one-time build; the restriction-text half is a 254-county problem.

## The ordering that follows from the facts

Ordering is justified by scope and legality only, per the dispatch. No costs and no
timeframes, per the operator ruling of 2026-09-13.

1. **`terrain`.** The only unambiguously statewide public source in the set. One build covers
   all 254 counties. Highest leverage available and it is not close.
2. **`ossf`, and `permits` with it.** Bounded rather than 254-wide, and finding A means one
   acquisition serves two rails across unincorporated Texas.
3. **`hoaDeedRestrictions`, existence half only.** Statewide, one build, partial answer. The
   restriction-text half drops to the per-county tier below.
4. **The per-county tier: `easements`, `mineralRights`, HOA restriction text.** Each is a
   254-county problem. `mineralRights` additionally cannot be made complete from public record
   because severance is recorded in deeds with no severance index, so its done-state must be a
   declared partial from the start rather than a target it will silently miss.
5. **`treeProtection`.** Per-municipality with no index, and only where an ordinance exists.
   Lowest leverage in the set.
6. **`salesHistory`.** Not on the roadmap. Declare the refusal.

## What this does not say

It does not propose a build for any rail, which was out of scope. It does not estimate cost or
time, which is ruled out. It does not touch the envelope family (`buildableAreaSqFt`,
`buildableAreaPct`, `envelopeStatus`, `envelopeDisclosure`), which reads zero BY RULING R-2 and
is not a capability gap. Cotality and Regrid were not considered; both are retired and the
acquisition posture is uniform public record.

## Provenance note, recorded so the defect does not recur

The dispatch told the lane "READ-ONLY. You build nothing, you write no code, you touch no
store... Do not acquire anything" and then required `_inbox/<date>_p203-capability-roadmap_close.json`.
The lane read "no repo writes" as covering doc_repo, wrote nothing, and said so plainly. That
is the correct reading of a contradictory instruction, and it is why `p203-capability-roadmap`
never appeared in `_catalog/lane_claims.json` while the other three lanes did.

**A read-only lane still has one write path: its own close.** The mission file is corrected to
say so explicitly, which matches the standing rule that even a read-only verifier needs the
full compiled header and an explicit `_inbox` close path.
