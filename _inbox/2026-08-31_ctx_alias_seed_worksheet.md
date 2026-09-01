---
id: 2026-08-31_ctx_alias_seed_worksheet
title: Alias seed — the long pole is four rulings plus 36 rows, not 99 hand judgements
date: 2026-08-31
status: filed
plan_row: F-11
source: _catalog/2026-08-30_breadth_place_alias_seed.json (225 rows)
snapshot: doc_repo main 54e5373; seed file read 2026-08-31; no store connected
---

# The long pole, measured

The roadmap calls the `breadth_*` to `place_fips` alias table the long pole and
records it as needing a 61-row confirm. The seed file grades **225 rows: 33
certain, 93 likely, 99 needs-human**. So the hand-work is larger than 61 rows by
count. It is much smaller than 99 by decision.

The 99 needs-human rows carry 566,223 parcels. **Four rulings dispose of
63 of those rows and 564,090 parcels, 99.6% of the
needs-human parcel weight.** What is left needing row-by-row judgement is
**36 rows carrying 2,133 parcels**.

## STATUS: rulings APPROVED 2026-08-31

All four approved by the operator. Record:
`_decisions/2026-08-31_alias_seed_four_rulings.md`.

**R2 and R3 carry a carve-out.** Four rows graded into them are wrongly graded:
`breadth_48309_eddy` (1,274), `breadth_48309_bruceville` (1,012),
`breadth_48309_brucevill` (1) and `breadth_48309_brucville` (1).
**Bruceville-Eddy is incorporated, `place_fips` 10828.** They resolve to that
`place_fips` and must not receive an `unincorporated` disposition. The error was
recorded in `_decisions/2026-08-30_unincorporated_is_the_disposition.md` but the
seed JSON was never regenerated, so it is still live in the seed file and would
have been picked up by the rulings as approved. Seed regeneration is a leave-behind
for the property seat; the seed is not hand-patched.

## The four rulings

| Ruling | Kind | Rows | Parcels | Disposition |
|---|---|---|---|---|
| not-a-jurisdiction | `not-a-jurisdiction` | 21 | 509,928 | `unknown` under the four-state contract. Not an alias row. |
| unincorporated-place-no-place-fips | `unincorporated-place-no-place-fips` | 25 | 36,270 | `unincorporated`. No `place_fips`; a CDP never gets one. |
| misspelling-of-unincorporated-place | `misspelling-of-unincorporated-place` | 15 | 17 | Normalise, then same as above. |
| mixed-scope-key | `mixed-scope-key` | 2 | 17,875 | Split the scopes before aliasing. See below. |

**R1 carries almost all the weight and is nearly one token.** Of its
509,928 parcels, 509,911 are six literal `unknown` rows, one per county:

| breadth key | county | parcels |
|---|---|---|
| `breadth_48491_unknown` | Williamson | 282,570 |
| `breadth_48453_unknown` | Travis | 169,688 |
| `breadth_48021_unknown` | Bastrop | 52,869 |
| `breadth_48209_unknown` | Hays | 2,806 |
| `breadth_48309_unknown` | McLennan | 1,739 |
| `breadth_48055_unknown` | Caldwell | 239 |

These are parcels whose CAD situs city is the literal string `unknown`. They
carry no jurisdiction attribution at all, which is precisely why P2-JURIS
resolves jurisdiction geometrically by containment rather than from `breadth_*`.
They are not alias candidates and no amount of hand-seeding produces one.

**R4, mixed-scope, is the only ruling of the four that is not mechanical.**
Two rows serve two scopes under one string:

- `breadth_48021_bastrop` (Bastrop): 17,538 parcels **and** county-scoped road-node atoms under the same key. Cannot alias to a single `place_fips` until the two scopes are split.
- `breadth_48055_caldwell` (Caldwell): 337 parcels **and** county-scoped road-node atoms under the same key. Cannot alias to a single `place_fips` until the two scopes are split.

## The residue — 36 rows, 2,133 parcels

This is the actual hand-judgement queue. It is 0.4% of the needs-human parcel
weight, so it does not gate anything by volume; it gates correctness only.

| breadth key | county | parcels | kind |
|---|---|---|---|
| `breadth_48055_kyle` | Caldwell | 1,017 | c-undecidable |
| `breadth_48055_harwood` | Caldwell | 456 | c-undecidable |
| `breadth_48055_buda` | Caldwell | 118 | c-undecidable |
| `breadth_48021_flatonia` | Bastrop | 111 | c-undecidable |
| `breadth_48021_waelder` | Bastrop | 62 | b-cad-error |
| `breadth_48055_waelder` | Caldwell | 56 | c-undecidable |
| `breadth_48209_new_braunfels` | Hays | 48 | c-undecidable |
| `breadth_48021_giddings` | Bastrop | 41 | c-undecidable |
| `breadth_48021_manor` | Bastrop | 40 | c-undecidable |
| `breadth_48209_fischer` | Hays | 37 | unresolved |
| `breadth_48209_round_mountain` | Hays | 32 | c-undecidable |
| `breadth_48021_la_grange` | Bastrop | 25 | c-undecidable |
| `breadth_48209_henly` | Hays | 25 | unresolved |
| `breadth_48309_aquilla` | McLennan | 14 | c-undecidable |
| `breadth_48209_blanco` | Hays | 11 | c-undecidable |
| `breadth_48309_birome` | McLennan | 10 | unresolved |
| `breadth_48309_oglesby` | McLennan | 7 | c-undecidable |
| `breadth_48021_austin` | Bastrop | 4 | c-undecidable |
| `breadth_48209_martindale` | Hays | 3 | c-undecidable |
| `breadth_48309_abbott` | McLennan | 2 | c-undecidable |
| `breadth_48021_dael` | Bastrop | 1 | unresolved |
| `breadth_48021_lexington` | Bastrop | 1 | c-undecidable |
| `breadth_48055_bastrop` | Caldwell | 1 | c-undecidable |
| `breadth_48055_wealder` | Caldwell | 1 | c-undecidable |
| `breadth_48209_henley` | Hays | 1 | unresolved |
| `breadth_48209_johnson_city` | Hays | 1 | c-undecidable |
| `breadth_48209_kylr` | Hays | 1 | unresolved |
| `breadth_48209_new_bruanfels` | Hays | 1 | c-undecidable |
| `breadth_48309_aaquilla` | McLennan | 1 | c-undecidable |
| `breadth_48309_cavitt` | McLennan | 1 | unresolved |
| `breadth_48309_moddy` | McLennan | 1 | unresolved |
| `breadth_48309_mount_calm` | McLennan | 1 | c-undecidable |
| `breadth_48309_mt_calm` | McLennan | 1 | unresolved |
| `breadth_48309_shadow_ridge` | McLennan | 1 | unresolved |
| `breadth_48209_hays` | Hays | 0 | county-level-key |
| `breadth_48309_mclennan` | McLennan | 0 | county-level-key |

## The 93 `likely` rows are a validation pass, not authoring

69 `misspelling-of-roster-place`, 19 `roster-exact`, 5 `straddle`. Each already
carries a proposed `place_fips`. That is a confirm-or-reject sweep and it
parallelises; it is not the long pole.

## One lead, explicitly not adopted

`breadth_48021_waelder` (62 parcels) is graded `b-cad-error`: Waelder is roster
place 76024 in Gonzales 48177, which is **not adjacent** to Bastrop 48021. The
open Bastrop 6 question asks whether a ring leaves 48021 and hits a city that
does not intersect the county polygon, so an out-of-county city name appearing
in Bastrop keys looks related.

**It is a different instrument and must not be conflated.** `breadth_*` is CAD
situs free text; the Bastrop 6 is a geometric containment result. A CAD
transcription error and a ring straddle produce the same smell and are not the
same finding. Recorded as a lead for the P2-JURIS lane, not as evidence.

```
leave_behind:
  - item: four alias rulings (R1-R4) awaiting the operator
    owner: nick
    plan_row: F-11
  - item: 36-row alias residue needing row-by-row judgement
    owner: property seat
    plan_row: F-11
```
