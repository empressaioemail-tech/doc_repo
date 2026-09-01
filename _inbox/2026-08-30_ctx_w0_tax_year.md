---
id: 2026-08-30_ctx_w0_tax_year
title: W0 tax-year selection rule (CTX facts-complete item 5)
date: 2026-08-30
status: draft
plan_row: F-06
wdll: _inbox/2026-08-30_ctx_facts_complete_WDLL.md item 5
---

# Tax year at bake

The defect is silent last-wins. Travis close lines show `written` 873766 against `conformantCadRows` 500307 because the CLI increments `written` once per atom and `ON CONFLICT` overwrites the snapshot. Those are different units (`_inbox/2026-08-29_ctx_travis_recon.json`). The store is not duplicated. The year is unselected.

## Rule

For each `countyFips:prop_id` the bake loads every matching conformant atom, then:

1. Drop atoms that fail the existing situs refuse (punctuation-only situs).
2. Read `sourceIdentifiers.taxYear` as an integer. An atom with no year is kept in an `unyeared` set.
3. If one or more yeared atoms exist, keep only those whose year equals the maximum year in that set.
4. If that remaining set has one atom, that atom is the claim body. Provenance records `taxYear` and `taxYearRule: max-year`.
5. If that remaining set has more than one atom, compare load-bearing fields (`situsAddress`, `situsCity`, `propertyUseCode`, `landAcres`). If they agree, keep one and record `taxYearRule: max-year-agree`. If they disagree, refuse the claim fields (`unmeasured` / explicit absent) and record `taxYearRule: max-year-disagree`. Do not overwrite.
6. If no yeared atom exists and exactly one unyeared atom remains, use it and record `taxYearRule: unyeared-singleton`. If more than one, refuse (`taxYearRule: unyeared-disagree`).

`written` on the close line stays upsert attempts. `conformantCadRows` stays distinct prop_ids. They will still differ. The snapshot body will name the year that won or the refuse.

## Do not

Re-bake only to make `written` equal `conformantCadRows`. Pick a year by page order. Default a missing year to the current calendar year.
