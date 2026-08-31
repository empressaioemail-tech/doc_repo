---
id: 2026-08-31_c4_buildable_pct_finding
title: C4 — a known 9,350 sq ft buildable area renders as not-stamped on the gold parcel
date: 2026-08-31
status: diagnosed
plan_row: F-06
owner: integration (serve-side; hauska-map PE property-atoms path)
source: _inbox/2026-08-31_gate8_live_1437_48021.json (Gate 8 inhabited dayOne, 14:37Z, SHA 3a0dc9a)
snapshot: doc_repo main e904a2b; production arm; PE and smartsite.cloud facets route
---

# The finding

Gate 8's first honest inhabited run failed C4 on the gold parcel. It is the only
one of the three failures that is not already tracked, and it is the only one that
is a wrong answer visible to a customer today.

| node | envelope.status | buildableAreaSqFt | summary.buildableAreaPct | C4 |
|---|---|---|---|---|
| 48021:34137 | `ok` | **9350** | **null** | fail |
| 48055:20478 | `no-buildable-area` | 0 | null | pass |
| 48453:227161 | `declined` | null | null | pass |

The two passes are correct: neither envelope claims a positive buildable area, so a
null percentage is consistent. The gold parcel is different. The envelope status is
`ok`, the buildable area is a real 9,350 sq ft, and the derived percentage is null.
PE's `liveBuildablePct` renders that as **not stamped**.

So the surface tells a customer we have nothing, on a parcel where we have 9,350
square feet. That is not honest absence. Honest absence is what 48055 and 48453 are
doing.

# Mechanism A (lot area known; derivation absent)

**A. The derivation is broken or absent.** `buildableAreaPct` is presumably
`buildableAreaSqFt` over a lot area, and the computation is missing from the serve
path or is failing silently to null. If so the fix is the derivation.

**B. The lot area is genuinely unknown**, so the percentage cannot be computed and
null is the correct value for that field. If so the field is right and **the defect
is the rendering**: PE collapses "percentage not computable" into the same
not-stamped state as "no buildable area", and it discards the 9,350 sq ft it holds.

Ruled **A**. Lot area is known. The percentage is computable and is not computed.

Live body this session (2026-08-31, HTTP 200, 10744 bytes, same size as Gate 8):
`https://smartsite.cloud/api/spine/property-atoms/48021%3A34137/facets`. Extract
`_inbox/2026-08-31_c4_gold_facets_measure.json`.

| field | live value |
|---|---|
| `envelope.status` | `ok` |
| `envelope.buildableAreaSqFt` | 9350 |
| `envelope.buildableAreaPct` | absent |
| `envelope.summary` | absent |
| `baseFacts.acreage.sqft` | **16673** |
| `facetCoverage.acreage` | true |

9350 / 16673 * 100 rounds to **56.1** (one decimal, same as `derive.ts`).

The atom-chain serve path (`atom-chain-to-facets.ts` status-ok branch) copies
`envAtom.outcome.buildableAreaPct` onto the envelope root when that field is a
number. It never divides. The gold envelope atom outcome is `{ kind: "buildable",
areaSqFt: 9350 }` with no percent field (`_inbox/_tmp_s5_gold_chain.json`).
Acreage arrives later via `mergeBakedBaseFacts` from the cortex bake. Nothing
after the merge computes the ratio. `envelope.summary` is not in the
`PeBakedFacetPayload` type and is never written. Gate 8 C4 and PE
`liveBuildablePct` both read `summary.buildableAreaPct`.

Mechanism B is rejected because a finite lot area is on the same body. A
render-only fix (show 9,350 sq ft when percent is null) would still leave C4
red. Amendment 4 on the baked card path already does that render; it is not
this defect.

Falsifier for A: acreage absent or non-finite on the live gold body. Observed
the opposite.

# Why this is not blocked and will be skipped anyway

C4 is serve-side, not write-side. P4's rails do not touch it, so it does not gate
P4, and that is precisely why it needs an owner now: nothing downstream will trip
over it. It is not on the board, not in the P2b PE wiring card's four defects, and
not in the ledger.

It is also a member of a class the board already carries under "known lies in prod":
PE saying not-stamped where data exists. This is a second instance with an exact
measurement attached.

# What would close it

Derivation lands on the property-atoms body after `mergeBakedBaseFacts`: when
status is ok, sqft > 0, and acreage is a finite positive number, write
`envelope.buildableAreaPct` and `envelope.summary.buildableAreaPct` as
round(sqft / lot * 100, 1). If lot area is unknown, leave both absent. Never
write 0 for a missing denominator. Re-run Gate 8 dayOne on 48021:34137 and
watch C4 move from fail to pass on an inhabited body. Do not close it on a
code change alone.

```
leave_behind:
  - item: C4 derivation on property-atoms after merge (write root + summary pct from known acreage; fail closed if lot area unknown)
    owner: integration
    plan_row: F-06
  - item: Gate 8 dayOne C4 on deployed 48021:34137 (close test; code-done is not customer-done)
    owner: integration
    plan_row: F-06
```
