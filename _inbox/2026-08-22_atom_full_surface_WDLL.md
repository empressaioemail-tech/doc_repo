---
id: 2026-08-22_atom_full_surface_WDLL
title: Full atom surface — SmartSite map + inspect + Command Center Manifest
status: approved
date: 2026-08-22
plan_row: P-57 through P-62
operator_approval: 2026-08-22 verbal. All atoms wired and rendering on map and displaying in CC is the goal.
related:
  - _inbox/2026-08-22_serve_ident_qa_WDLL.md
  - _inbox/2026-08-21_ops18_all_board_WDLL.md
  - _inbox/2026-08-21_a1-coverage_close.json
  - _inbox/2026-08-21_s2-family-scout_close.json
  - 90_operations/OPS-18c_parallel_execution.md
  - 90_operations/OPS-16_texas_market_plan_of_record.md A-020
---

# WDLL: full atom surface (map + inspect + Command Center)

Date: 2026-08-22  Status: approved
Operator approval: 2026-08-22 verbal

## Done looks like

Every property-spine family that has atoms in the store is honestly reachable on SmartSite and honestly represented on Command Center. SmartSite **inspect** cites the atom (or a typed refusal that names the atom). SmartSite **map** shows spatial families from atom reads or an honest empty layer, never a dormant GIS slot pretending to be the atom. Command Center **County Manifest** cells for each rail reflect checked-in scorer output from the store, not invented percents; unspecified rails stay `not-yet` until a scorer spec lands. Gold `48021:34137` (908 PINE) is the regression anchor; four additional counties prove the pattern is not gold-only. COVER `--apply` and roads remainder stay parked until this card's audit closes and operator re-goes fill work.

This is the program card for "all atoms everywhere." The near-term SERVE card (`_inbox/2026-08-22_serve_ident_qa_WDLL.md`) remains the P-48..P-54 slice; this card supersedes the implicit assumption that inspect-only SERVE equals customer-done.

## Fifteen families (in scope)

parcel-node, flood-hazard-fact, special-district-fact, rail-corridor-fact, rrc-pipeline-fact, well-fact, cad-parcel-roll, zoning-fact, land-use-fact, owner-fact, building-footprint, buildable-envelope, setback-rule, road-node, property-boundary-edge.

code-section / code-cross-reference are Codex-only; out of scope.

## Operator stamps

- **CC ≠ inspect.** Manifest cells move only when scorers write `county_facet_coverage` and ledger recomputes. Wiring inspect does not green a CC column.
- **Honest miss is success.** Typed refusal or layer verdict (`absent-verified` | `lookup-failed` | `not-applicable` per `19_the_instrument_contract.md`) is success. HTTP 200 with zero facts and no declaration is a defect (empty-success class). `atom-miss` without verdict fields is incomplete, not sufficient. A bake row or GIS layer presented as the atom is a defect.
- **Owner:** identified-session inspect only on SmartSite. Anonymous never sees owner body.
- **A-017:** Harris PBF stays NO. Roads scorer does not imply statewide PBF apply.
- **COVER / roads:** PARKED until audit finish card is filed and operator re-goes. Resume only from `_inbox/2026-08-22_p17_roads_park_pickup.md`.
- **P-52 rail:** stays parked until contamination scout says GO.

## Phase 1 — audit (P-57, P-58; no product edits)

1. File-based audit instrument `scripts/atom-full-surface-audit.mjs` self-tests both directions (invented green CC cell without scorer FAILS; honest not-yet PASSES). | check: run `--self-test` exit 0 | grade: [x]
2. Live probe matrix: gold `48021:34137` plus Travis `48453`, Harris `48201`, Williamson `48491`, and one named rural FIPS from the county manifest. Per family quote PE inspect state, cortex field state, and whether map layer registry slot exists and `live` flag. | check: `_inbox/2026-08-22_p57_live_audit_close.json` | grade: [x]
3. Code-read matrix: per family {writePath, cortexRead, peInspect, peMapLayer, ccRailKey, scorerPath, gapClass}. Post-SERVE truth, not Aug-21 s2 scout. | check: `_inbox/2026-08-22_p58_code_audit_close.json` | grade: [x]
4. CC baseline GET by field name: all fourteen rails quoted; six A-020 unspecified rails stay `not-yet` on dated GET. | check: reuse `scripts/p47-manifest-instrument.mjs --live` in close | grade: [x]
5. Ranked gap backlog with dependencies: scorer-before-CC, map-layer, land-use-atom, bake-hole, P-52 rail. Execution order stack, no time estimates. | check: `_inbox/2026-08-22_atom_full_surface_gap_backlog.json` | grade: [x]

## Phase 2 — scorers (P-59; property / LDT)

**Gate (2026-08-22):** Scorer **plumbing** may proceed in parallel with verdict serve (P-63). Scorer **semantics** that count families present/absent must not ship until inspect returns verdict fields; scorers read verdict as input, not boolean. Building against null = rebuild.

6. Checked-in scorer spec + CLI for each A-020 unspecified rail: roads, footprint, easement, rrc-wells, rrc-pipelines, rail-corridor. `countyRailScoreCli` accepts each. Scorer input includes layer verdict when family absent. | check: file paths + `--dry-run` on one county per rail | grade: [ ]
7. After apply + recompute on a bounded county set, CC GET shows non-`not-yet` cells only where scorer ran. `not-applicable` verdict counties do not inflate gap counts. No invented percent on roads. | check: live GET field names before/after | grade: [ ]

## Phase 3 — SmartSite map layers (P-60; property / hauska-map)

8. Spatial HOLD families have map layers that read atoms (or honest refusal), `live:true` where store has statewide atoms: rrc-pipeline-fact, well-fact, building-footprint, rail-corridor-fact, special-district-fact (`mud-pid` policy unchanged: type not second build). | check: live map probe on gold + one hit parcel per family | grade: [ ]
9. Map layer never presents GIS bake as the atom when inspect cites `atom-miss` for the same family on the same parcel. | check: paired inspect + map on gold and substitutes | grade: [ ]

## Phase 4 — inspect remainder (P-61; property)

10. `land-use-fact` inspect reads the atom on integer grammar; bake/CAD is not the cited source. | check: live gold GET `source=land-use-fact` | grade: [ ]
11. P-52 rail-corridor inspect (and map if scout GO) cites `rail-corridor-fact` or stays parked with scout close. | check: scout close or live probe | grade: [ ]

## Phase 5 — CC parity (P-62; planner)

12. County Manifest grid columns for atom-backed rails match scorer output on a dated GET after recompute. Heartbeat stays live. STALE banner honest. | check: CC panel stamps vs GET `computedAt` + per-rail counts | grade: [ ]
13. End-to-end regression: gold 908 PINE inspect rows + map layers + Bastrop county row in CC all consistent on one timestamped snapshot. | check: single close JSON cites all three surfaces | grade: [ ]
14. **Inspect/manifest divergence guard.** File-based instrument fails when a family is served on inspect (populated or verdict) and CC manifest scores zero for that rail on the same county beyond a stated time window (same defect class as flood present on inspect / absent on compare). Violation test both directions. | check: instrument self-test exit 0 | grade: [ ]

## Amendments

- 2026-08-22: opened at operator verbal after SERVE visual QA revealed CC unchanged and random-parcel incompleteness. Phase 1 audit dispatches immediately. Phases 2–5 blocked on audit close.
- 2026-08-22 (thesis planner): narrow "honest miss" to typed verdicts per doc 19; empty-success is defect. Verdict serve P-63 authorized (`_inbox/2026-08-22_verdict_layer_serve_WDLL.md`).
- 2026-08-23: P-63 closed; P-59 semantics unblocked (A-025). Atom surface WDLL items 6–7 dispatch under `_inbox/2026-08-23_p59_scorer_specs_WDLL.md`.

## Finish card (graded at close)

1. met: `scripts/atom-full-surface-audit.mjs` 8-case self-test pass. Evidence `_inbox/2026-08-22_p57-live-audit_close.json`.
2. met: 7-parcel live matrix `_inbox/2026-08-22_p57_full_surface_grade.json` probedAt 2026-08-22T19:46Z. Rural Crane 48103:1.
3. met: 15-family matrix post-SERVE ecfaac4/712f56e5. Evidence `_inbox/2026-08-22_p58-code-audit_close.json`. Nine families changed vs s2 scout.
4. met: CC baseline in P-57 grade; roads 254/254 not-yet; six unspecified rails zero satisfied-present.
5. met: Ranked backlog P-59..P-62 stack `_inbox/2026-08-22_atom_full_surface_gap_backlog.json`.
6. pending
7. pending
8. pending
9. pending
10. pending
11. pending
12. pending
13. pending

## Phase 1 status

**CLOSED 2026-08-22.** Phase 2 (P-59 scorers) unblocked for operator go. COVER roads still parked.
