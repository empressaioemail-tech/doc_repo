---
id: 2026-09-01_parallel-five_WDLL
title: WDLL — five parallel items that never touch the store
date: 2026-09-01
status: approved
operator_approval: 2026-09-01 execute on compiled dispatch
plan_rows: [F-06, F-02, F-01, F-08]
dispatch: _dispatches/2026-09-01_parallel-five_dispatch.md
applies_to: legacy-design-tools, hauska-engine, hauska-factory, hauska-map
---

# WDLL: Parallel five

Date: 2026-09-01  Status: approved
Operator approval: 2026-09-01 (execute the compiled dispatch)

## Done looks like

Five items that do not take the atoms store from Williamson/Travis containment are landed as code, commit, or live proof. CAD value fields ride Wave R because the zero defect is fixed and the branch is merged before that bake. The wells writer refuses a silent PK collapse and does not apply. Factory alias SQL is committed without the CRLF dirties. Gold `48021:34137` serves `buildableAreaPct` 56.1 on the live PE property-atoms body and Gate 8 dayOne C4 passes on that inhabited body. C3 gains a second-derivation instrument built against fixtures and not run against the store. The presence-shaped C3 label stays.

## Acceptance items

1. CAD dollar fields serve three states per field (absent / zero / positive) with the per-field rulings in CP1; `positiveDollarOrNull` no longer collapses a stored 0 to absent for improvementValue, assessedValue, marketValue, or landValue; livingAreaSqft stays positive-only; tests cover both falsifier arms; branch `feat/p91-cad-fields-twin` is committed by explicit pathspec, PR green on the CI conclusion string `success`, and merged before Wave R. | check: vitest on the named cadRoll files; `gh pr checks` conclusion string; merge SHA on origin/main | grade: [ ]
2. Wells writer lands per-chunk `plannedIn`/`writtenOut` and `CHUNK_PK_COLLAPSE`; the `12079 - 2087 = 9992` identity test is dropped or rewritten so it does not convert a defect into a spec; a written recommendation chooses three atoms under distinct wellKeys over one atom carrying three wells; no county is applied. | check: diff on `P:/tmp/hauska-engine-a2-wellfact`; tests pass without the identity assertion; no `factory-atoms-cad` execute | grade: [ ]
3. Factory commit contains only `sql/p2-juris/_alias_seed.sql` and `sql/p2-juris/04_alias_reconcile.sql`; `03_all_county_fips.sql`, `_roster_six_touch.sql`, and `_file_side_counts.json` are clean; generator home recommendation is written; no hardcoded `SCR` scratchpad constant remains in the producer. | check: `git status --porcelain` in the alias-regen clone names those two paths only; `git diff --stat` is four-row content | grade: [ ]
4. Live GET `https://smartsite.cloud/api/spine/property-atoms/48021%3A34137/facets` returns `facets.envelope.buildableAreaPct` 56.1 and `facets.envelope.summary.buildableAreaPct` 56.1 with sqft 9350 and acreage 16673; Gate 8 dayOne C4 on that inhabited gold moves from fail to pass. A merged PR is not the close. Vercel exit code is not the close. | check: live JSON fields by name; Gate 8 production arm `dayOne.C4` | grade: [ ]
5. C3 second derivation exists as fixture-tested code comparing CAD landUse at source to served `landUseFact.landUseCode`; presence-shaped `assertC3` is unchanged; the new comparison is not executed against the store. | check: fixture tests fail on agreeing-and-wrong when source differs, pass when source matches; no store connection in the run | grade: [ ]

## Amendments

- None at start.

## Finish card (graded at close)

1. [ ]
2. [ ]
3. [ ]
4. [ ]
5. [ ]
