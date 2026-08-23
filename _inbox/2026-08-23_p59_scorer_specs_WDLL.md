---
id: 2026-08-23_p59_scorer_specs_WDLL
title: WDLL — P-59 A-020 scorer specs (six unspecified rails)
date: 2026-08-23
status: approved
operator_approval: 2026-08-23
plan_row: P-59
related: [_inbox/2026-08-22_atom_full_surface_WDLL.md, _inbox/2026-08-23_p63_interim_applicability_table.json]
---

# WDLL: P-59 scorer specs

## Done looks like

The six A-020 unspecified rails in `lib/railScoring/registry.ts` (roads, footprint, easement, rrc-wells, rrc-pipelines, rail-corridor) each have a checked-in measurement kind, not `unspecified`. `countyRailScoreCli.ts --dry-run` scores at least one county per rail without exit 2. Scorers read layer verdict as input where a family can be `not-applicable`; unzoned unincorporated counties do not inflate gap counts as zero-percent covered.

## Acceptance items

1. Registry: each of the six rails moves from `kind: unspecified` to a declared measurement kind with denominator basis prose and `instrument: countyRailScoreCli.ts:<rail>`. | check: `registry.test.ts` partition + no unspecified in the six keys | grade: [ ]
2. `countyRailScoreCli.ts --list` shows six scoreable rails; `--rail=<each> --county=48021 --dry-run` exits 0 for atom-backed rails (rrc-pipelines, rail-corridor, footprint where store has atoms). | check: CLI output in close artifact | grade: [ ]
3. Verdict semantics: `classifyFacet` / `scoreRailCell` accepts `verdict: not-applicable` and does not classify as gap (not `satisfied-present` at 0% nor false absent). | check: `engine.test.ts` violation case both directions | grade: [ ]
4. rrc-wells rail carries `absenceProbe` with `reach: enumerated-counties` (Harris-only source); statewide absence refused. | check: registry entry + dry-run refusal outside Harris | grade: [ ]
5. Footprint denominator is NOT raw parcel-feature count when it would exceed 100%; declared numerator/denominator documented in registry notes. | check: registry notes + one county dry-run ratio | grade: [ ]
6. Bounded apply: `--apply` on Bastrop 48021 for rrc-pipelines + rail-corridor only (no statewide apply this card). | check: SQL COUNT on county_facet_coverage for those facets | grade: [ ]
7. CC GET: after recompute on 48021, at least one previously `not-yet` cell for an applied rail shows non-not-yet with honest artifact_path citing countyRailScoreCli. | check: live GET or manifest instrument | grade: [ ]

## Amendments

- 2026-08-23: P-59 semantics unblocked after P-63 close (`_inbox/2026-08-23_p63-verdict-serve_close.json`).

## Dependencies

- P-58 audit closed. P-63 verdict fields live on inspect (complete).
- Substrate write-refusal (substrate-req-property-003): ordering preference before Dallas/Tarrant CAMA, not a gate on this card.
