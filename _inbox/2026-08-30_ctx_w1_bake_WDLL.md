---
id: 2026-08-30_ctx_w1_bake_WDLL
title: WDLL — CTX W1: situs-extend leftover no-row + named tax year on the conformant bake
date: 2026-08-30
last_updated: 2026-08-30
status: approved
applies_to: legacy-design-tools (conformant tier 1 bake)
plan_row: F-06, F-08
depends_on: _inbox/2026-08-30_ctx_facts_complete_WDLL.md items 6 and 5, _inbox/2026-08-30_ctx_w0_point_source.md, _inbox/2026-08-30_ctx_w0_tax_year.md
operator_go: 2026-08-30 (parent facts-complete go; W0 items 2-5 exist)
snapshot: integration P:/doc_repo; live remainder 232770 unstamped 0,0; Travis 119389 no-row; seed unlifted
owner: property-seat subagent produces the diff; planner commits
---

# CTX W1 bake

Date: 2026-08-30  Status: approved

Parent items 6 and 5. One LDT PR. No publish. No P-80.

## Done looks like

The conformant bake, on 48021 / 48055 / 48453 leftover `no-row` parcels that carry a situs key, runs the same owner-gated situs path card H already uses for 48209 / 48491. A recovered row is `joined-situs`. A refused row stays `no-row` or `gate-blocked` with the basis named. 48209 and 48491 still fail a `prop_id` join in tests. Tax year follows `_inbox/2026-08-30_ctx_w0_tax_year.md`. Silent last-wins is gone.

## Acceptance items

1. **Situs-extend.** Leftover no-row on 48021, 48055, 48453 may fetch `txgio_parcel` by normalized situs and pass the row only after `ownersAgree`. Fixtures: situs match used, `prop_id` match on a blocked FIPS ignored, punctuation-only situs still refused. | check: fail-then-pass fixtures | grade: [ ]

2. **Seed stays.** Tests still fail a `prop_id` join on 48209 and 48491. `LANDUSE_JOIN_DISABLED_FIPS_SEED` unchanged. | check: existing seed tests plus a new not-vacuous case | grade: [ ]

3. **Tax year.** Max-year rule from the W0 draft. Disagree refuses. Provenance records `taxYear` and `taxYearRule`. | check: fixtures for singleton, agree, disagree, unyeared | grade: [ ]

4. **Handback.** Diff by file; typecheck; vitest for files touched; `leave_behind`. No commit, push, bake. | check: handback | grade: [ ]

## Do not

- Lift the seed or join 48209 / 48491 on `prop_id`.
- Invent a Travis `geo_id` join.
- Bake or publish.
- Touch hauska-map or Factory product code (Factory point index is a sibling card).
---
