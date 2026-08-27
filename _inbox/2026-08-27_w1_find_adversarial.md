---
id: 2026-08-27_w1_find_adversarial
title: Adversarial review — W1 Find disambiguation
status: filed
last_updated: 2026-08-27
---

# W1 review

Branch `fix/qa-w1-find` on `P:/tmp/hauska-map-qa-w1`. Planner read mergeSearchSuggestions, parcel-lookup, and the violate tests.

## What holds

House number is no longer identity. `1308 Pecan` merge keeps Bastrop ST and Guadalupe DR. Bare house+street refuses `uniqueSitusPin` lock (`AMBIGUOUS_FIND_REASON`). City token expands situs prefix. `48021:27479` is a client parcel-id row with no geocoder call. History lookup target is the situs address. Enter on an ambiguous list without an explicit highlight does not pick hits[0].

Second mechanism (missing Bastrop situs row as the only cause) is rejected for the Guadalupe lock. The PE collapse would hide Bastrop even if both rows existed. Live store presence of `1308 PECAN ST` remains unmeasured.

## Grade

W1.1–W1.8 met in unit tests. Live four-string probe waits on deploy.
