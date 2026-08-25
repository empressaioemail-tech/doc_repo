---
id: 2026-08-24_parcel_facts_write_path_WDLL
title: WDLL — parcel public-facts write-path program
date: 2026-08-24
status: approved
operator_approval: verbal 2026-08-24 (Lane 3 ETJ + who-serves in flight; Wave 1 items 4-5 only)
plan_row: P-73
related:
  - _inbox/2026-08-24_parcel_facts_write_path_game_plan.md
---

# WDLL: Parcel public-facts write-path program

Date: 2026-08-24  Status: approved  Operator approval: 2026-08-24 Wave 1 (P-75, P-76). CAMA and footprint remain held.

## Done looks like

A dispatcher can compile `node scripts/dispatch.mjs --plan OPS-16 --lane <ID> --plan-row P-7x` against a named wave and cite the acceptance items below. Wave 0 has mapped dest/join/authority for the ingest-bound set. Wave 1 binds stores we already hold (situs, who-serves, city limits) without inventing facts. Wave 2 makes Travis join misses visible. No CAMA or REST harvest has run without that map and without the CAMA-vs-StratMap authority rule. Heavy drains (footprint atoms, Travis join fix, remaining-metro parsers) are still named and still last.

## Acceptance items

1. **P-73 map exists.** `_inbox/2026-08-24_p73_ingest_bound_field_map.md` has source, dest, join key, vintage, authority, and empty/sentinel/unmeasured for every ingest-bound canvas. No empty dest/join/authority cell. Deficit canvas folklore (parse vs landuse, L20 vs footprint, city limits vs ETJ) is corrected. | check: every map row has those six cells filled; two-column job list does not count | grade: [ ]

2. **OPS-16 rows exist.** A-026 adds P-73 through P-80. A dispatch for P-74 compiles; a fabricated P-81 refuses. | check: `node scripts/dispatch.mjs --plan OPS-16 --lane X --plan-row P-74` compiles; `--plan-row P-81` exits nonzero | grade: [ ]

3. **P-74 situs sentinel.** Live inspect title on `48453:280239` is not `, TX` when `txgio_parcel.situs_address` has a street. Gold `48021:34137` still `908 PINE`. Find/Photon string is not copied onto the county record. | check: live facets + txgio row for both nodes; PE from isolated worktree not A2 | grade: [ ]

4. **P-75 who-serves.** Inspect or assembler section returns territory holders or the SERVICE-LETTER-REQUIRED sentence. A fixture with no polygon hit returns the residual, never blank. No atoms `--apply`. | check: live probe + fixture; 0076 on the serving revision | grade: [ ]

5. **P-76 city limits.** Gold Bastrop city parcel is incorporated. A named unincorporated control is unincorporated. ETJ chip is unresolved, not a derived buffer. | check: live probe on two named parcels; containment code path named | grade: [ ]

6. **P-77 measure.** File-based instrument reports hit/miss/unmeasured on the Simsbrook-Dashwood block and a stated Travis sample at `2026/cad-export`. Self-test both directions, including a not-vacuous case. | check: instrument file + output with snapshot | grade: [ ]

7. **P-77 honest miss.** `48453:280238` facets name lookup-failed (or equivalent) and the declared vintage. `48453:280239` stays joined. HTTP 200 is not treated as a CAD bind. | check: live facets both nodes | grade: [ ]

8. **P-78 authority.** A fixture where CAMA lacks legal and StratMap has legal does not wipe legal on same `(fips, prop_id, tax_year)`, or the load writes a new vintage and L17 readers stay on declared. Verified by violation. | check: failing-first test in cad-ingest | grade: [ ]

9. **P-78 leftover StratMap fields.** `landuse.ts` no longer hard-nulls `year_built` / `land_acres` when DBF has the source fields. One-county dry-run artifact filed. | check: parser test + dry-run JSON | grade: [ ]

10. **P-25 Dallas/Tarrant.** Full loads announced, run, vintage flipped after complete. Store sqft % on those two FIPS is measured from `cad_property`, not asserted. Travis CAMA not started before item 6. | check: announce note + store query JSON + registry vintage | grade: [ ]

11. **No silent scope.** Footprint drain, Travis join fix, REST harvest writer, Bexar/Collin/Denton parsers, HOA, COVER roads are not started inside items 1-10. | check: git log pathspecs on those writers during Waves 0-4 | grade: [ ]

12. **Close hygiene.** leave_behind declared; thesis parity ledger entry if atoms / access policy / capture jobs moved. | check: close artifact | grade: [ ]

## Amendments

- 2026-08-24: operator go is Wave 1 items 4-5 (P-75 who-serves, P-76 city-limits) plus dest names already filed for those two. Items 10 (P-25 CAMA) and Wave 6 (P-09 footprint, P-80 Travis join fix) stay held. Full ETJ derivation is not this go; P-76 ships incorporated / unincorporated / ETJ-unresolved. Reason: screenshot go named ETJ adapter and who-serves promotion; "then footprint / CAMA, not parallel."

## Finish card (graded at close)

(not yet)
