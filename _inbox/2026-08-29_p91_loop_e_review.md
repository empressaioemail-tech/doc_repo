---
id: 2026-08-29_p91_loop_e_review
title: Wave E adversarial review (address paste)
date: 2026-08-29
status: accepted-uncommitted
plan_row: P-91
wdll: 18, 27, A5
lane_worktree: P:/seat-worktrees/property/legacy-design-tools-p91-address
head: c601f2bbc70c8a23d7b66c9555cbd12d5afda21f
---

# Wave E review

Reviewed the diff, not the lane summary. Uncommitted on `feat/p91-address-paste`. No merge. No deploy. Staging `00646-luj` not in this tree.

## Verdict

Accept the code. Do not treat A5 or item 18 as closed. Live situs-search on a serving image still scores Pine / Rainmaker / zzzz.

## What I read

Eight files, +222 / -108, against `_lane_return.md`.

`searchSitusByStreetKeys`, `searchSitusByPrefix`, `searchSitusByPrefixWithLocality`, and `searchAddressPointsByPrefix` all add `storeCountyFipsBound` = `inArray(county_fips, texasCountyFipsList())`. That list is the 254 odd Census Texas codes, includes `48021`, and is not `allStoreCounties()`. `searchPlaceByPrefix` returns `missClass` `no-hit` or `situs-search-budget-exceeded` on empty. The HTTP route forwards it.

`cortexQueryResolver` now reads `result.hits` and drops `missClass`. `resolveScreenQuery` still sees an array. A budget miss and a junk miss are the same unresolved screen row.

B1 locality tests still keep Georgetown off gold. Street-type maps were not expanded.

## CP1 falsifiers

1. 20 s empty on serving and staging is not environment drift. The write path before this change omitted the leading `county_fips` of `txgio_parcel_situs_norm_idx`. Node-id uses a different index. Staging emptying the same way is predicted by that omit. Held.

2. Identical unresolved rows for Pine and zzzz is a false assertion. Held at `searchPlaceByPrefix` and HTTP: zzzz is `no-hit` without touching the table; a budget empty is `situs-search-budget-exceeded`. Not held on `create_screen`. If Pine still budgets after deploy, the board still draws two unresolved rows. The intended close is a Pine hit, not a prettier empty.

3. Matcher work before index confirmation is the wrong first move. The return names store coverage (74,729 Bastrop situs rows, gold `908 PINE , BASTROP, TX 78602`, valid norm index) before the query change. This tree does not expand Cv/Cove. Held. I did not re-run Neon EXPLAIN this turn. Prior scratch already had `txgio_parcel` at 16,428,786. The missing `county_fips` predicate is in the code I read.

## Rejected alternate reading

That 23 mock tests prove Pine will hit on serving `00654-lom`. Rejected: the mocks never emit SQL. The FIPS roster test proves `48021` is in the bound. The live probe is still the second derivation.

## leave_behind

- Live `GET /api/brokerage/v1/place/situs-search` on serving after this cortex image: Pine and Rainmaker must be hits; zzzz must be `missClass=no-hit`. A budget class on Pine is a fail.
- `create_screen` still cannot name a budget miss. Only plumb that if the live probe still empties.
- A5 forty stays blocked until the probe.
- Wave D stays a separate uncommitted tree. Wave F is still an operator save click.
