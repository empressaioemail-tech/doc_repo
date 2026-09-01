---
decision_id: 2026-08-31_alias_seed_four_rulings
date: 2026-08-31
owner: Nick (operator), recorded by doc_repo planner
status: active
related_canonical:
  - _inbox/2026-08-31_ctx_alias_seed_worksheet.md
  - _catalog/2026-08-30_breadth_place_alias_seed.json
  - _decisions/2026-08-30_unincorporated_is_the_disposition.md
  - _inbox/2026-08-30_ctx_road_to_prod_accurate.md
---

## Decision

Four rulings dispose of the `breadth_*` alias seed's `needs-human` bucket by rule
rather than by row. Approved by the operator 2026-08-31.

**R1. `not-a-jurisdiction` resolves to `unknown`, never to an alias.** 21 rows,
509,928 parcels. These are literal tokens (`unknown`, `houses_only`, zip codes,
road fragments). `unknown` is the four-state disposition; no `place_fips` exists
or can exist. 509,911 of those parcels are six literal `unknown` rows, one per
county, led by Williamson 282,570 and Travis 169,688. Those parcels carry no
jurisdiction attribution at all, which is why P2-JURIS resolves jurisdiction
geometrically by containment instead of from `breadth_*`.

**R2. `unincorporated-place-no-place-fips` resolves to `unincorporated`.** 25 rows,
36,270 parcels, less the carve-out below. No `place_fips` is assigned. A CDP never
gets one. This is the 2026-08-30 ruling applied to a graded bucket, not a new rule.

**R3. `misspelling-of-unincorporated-place` normalises, then follows R2.** 15 rows,
17 parcels, less the carve-out below.

**R4. `mixed-scope-key` splits the scopes before any aliasing.** 2 rows, 17,875
parcels. `breadth_48021_bastrop` carries 17,538 parcels AND 36,802 county-scoped
road-node atoms under one string; `breadth_48055_caldwell` carries 337 parcels AND
13,790 road-node atoms. One string serving two scopes cannot alias to a single
`place_fips`. Split first; alias after.

## Carve-out — R2 and R3 do NOT apply to Bruceville-Eddy

Four rows are graded into R2 and R3 and are **wrongly graded**:

| breadth value | graded kind | parcels |
|---|---|---|
| `breadth_48309_eddy` | unincorporated-place-no-place-fips | 1,274 |
| `breadth_48309_bruceville` | unincorporated-place-no-place-fips | 1,012 |
| `breadth_48309_brucevill` | misspelling-of-unincorporated-place | 1 |
| `breadth_48309_brucville` | misspelling-of-unincorporated-place | 1 |

**Bruceville-Eddy is an incorporated city, `place_fips` 10828, parent county
48309.** These four rows resolve to that `place_fips`. They must not receive an
`unincorporated` disposition.

This error was already found and recorded in
`_decisions/2026-08-30_unincorporated_is_the_disposition.md` on 2026-08-31, but
**the seed JSON was never regenerated**, so the bad grading is still live in
`_catalog/2026-08-30_breadth_place_alias_seed.json` and would have been picked up
by R2 and R3 as approved.

**CAUSE CORRECTED 2026-08-31 (planner). This record originally said the cause was
"an exact-name lookup missing a hyphenated name." That is WRONG, and building a fix
to it produces a no-op.** The generator's `nk()` already strips hyphens, and the
proof is inside the seed: `breadth_48309_lacy_lakeview` resolves to Lacy-Lakeview
`40168`, graded `certain`, kind `roster-exact`. Hyphenation is handled.

The actual mechanism is a **half-name**. CAD situs carries ONE COMPONENT of a
compound roster name (`eddy` and `bruceville` are halves of `Bruceville-Eddy`), and
the lookup has no component index, so no whole-key match exists for a half. The fix
is a **county-scoped, miss-only, single-hit component index**, not hyphen handling.

Each of those three qualifiers is load-bearing. `breadth_48309_west` is currently
`certain` on West `77332` in McLennan, and `West` is also a component of West Lake
Hills `77632` in Travis; a component rule that is not county-scoped or not
miss-only flips a row that is right today.

The seed file is generated property-seat output and is deliberately NOT hand-patched
here: a hand edit to generated data reads as a fix and drifts at the next
regeneration. The carve-out is authoritative until the seed is regenerated.

## Scope after the rulings

63 of the 99 `needs-human` rows and 564,090 of their 566,223 parcels (99.6%) are
disposed by R1 to R4. What remains needing row-by-row judgement is **36 rows
carrying 2,133 parcels** (`c-undecidable` 23, `unresolved` 10, `county-level-key` 2,
`b-cad-error` 1). The 93 `likely` rows are a confirm-or-reject sweep that
parallelises, not authoring.

The roadmap's record of this as "a 61-row confirm" is superseded: it is larger than
61 by count and far smaller by decision.

## Reversal criteria

Reverse R1 if a `breadth_*` token graded `not-a-jurisdiction` is shown to carry a
real jurisdiction binding recoverable from CAD.

Reverse R2 or R3 for any specific place shown to be incorporated with a live
`place_fips`, as Bruceville-Eddy already required. **The correct response to such a
finding is another carve-out plus a seed regeneration, never a silent widening of
the rule.**

Reverse R4 if the two scopes prove separable without a split, which would require a
second key rather than a ruling.

```
leave_behind:
  - item: regenerate _catalog/2026-08-30_breadth_place_alias_seed.json with the
      Bruceville-Eddy grading fixed and hyphenated-name lookup corrected
    owner: property seat
    plan_row: F-11
  - item: 36-row alias residue needing row-by-row judgement
    owner: property seat
    plan_row: F-11
```
