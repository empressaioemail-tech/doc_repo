---
id: 2026-08-24_lane3_p75_who_serves_WDLL
title: Lane 3 — P-75 who-serves serve-time read
status: approved
date: 2026-08-24
plan_row: P-75
operator_go: verbal 2026-08-24 (who-serves promotion decision; then footprint / CAMA, not parallel)
parent_wdll: _inbox/2026-08-24_parcel_facts_write_path_WDLL.md item 4
decision: _decisions/2026-08-24_who_serves_promotion.md
depends_on: _inbox/2026-08-14_l22_close.json
---

# WDLL: P-75 who-serves read path

Operator go 2026-08-24 on the screenshot item "who-serves promotion decision; then footprint / CAMA, not parallel." The promotion decision is filed. This card is the build.

v1 is serve-time PIP over `tx_utility_territory_staging` (L22). Territory holders plus the residual `SERVICE-LETTER-REQUIRED — territory is not tap/capacity/extension commitment.` No atom family. No `--apply`. Mains are not a rail.

Isolated LDT tree only. Pin schema 0076 on the deploy branch. Do not write the property LDT checkout.

## Done looks like

Gold `48021:34137` returns a typed utilities section: zero or more territory holders (water CCN, sewer CCN, electric retail, PWS, additive TCEQ) with source_key, plus the residual sentence on every parcel. A fixture centroid that hits no staging polygon still returns the residual, never a blank section. Inspect or the assembler can consume that shape. Atoms writer slot stays idle.

## Acceptance items

1. **0076 is on the serving revision, or CP1 refuses.** Schema for `tx_utility_territory_staging` is present on the branch that will deploy. If absent, stop and file the miss. Do not query a guessed table name. | check: CP1 names the migration file and a describe of the live/serving table | grade: [met 2026-08-25T05:12Z] serving `cortex-api-00579-teh` runs SHA `403d8010` which includes drizzle `txUtilityTerritoryStaging` + 0076; gold returned six typed holders from those source_keys

2. **PIP over staging, not a new harvest.** Read path queries L22 rows (PUCT water, PUCT sewer, HIFLD electric, TWDB PWS, TCEQ additive). No new shapefile load on this card. | check: code read; no new source adapter | grade: [met] whoServesRead.ts + GET /api/who-serves; no new harvest

3. **Gold returns typed holders or residual.** Live gold section is non-empty and typed. A miss is residual, not HTTP 200 empty. | check: live probe after wire | grade: [met 2026-08-25T05:12Z] prod GET `/api/who-serves?lat=30.11&lng=-97.315` status measured, six holders (Bastrop water/sewer/electric/PWS + two HIFLD coops), residual present. Miss `lat=10&lng=10` holders [] + residual, never `{}`

4. **Outside-all-polygons fixture returns residual.** A fixture point with no polygon hit emits the residual sentence and zero holders. Never blank. Verified by violation: a handler that returns `{}` fails. | check: unit fixture both directions | grade: [met] 16 tests; `{}` throws; empty store is unmeasured (planner add)

5. **Residual on hits too.** A parcel inside a CCN still carries SERVICE-LETTER-REQUIRED. Territory is not tap, capacity, or extension. | check: fixture with a hit + residual assertion | grade: [met] hit fixture keeps residual; unmeasured must not

6. **No atoms `--apply`. No mains rail.** TCEQ rows stay complementary who-governs, not restated as who-serves water when they duplicate `tx_special_district`. | check: pathspec + code read | grade: [met] no apply; TCEQ-as-water throws

## Do not

- Start P-09 footprint or P-25 CAMA.
- Promote mains, laterals, or outage graphs.
- Invent a who-serves atom type.
- Treat L10 city-scoped mains as this card.

## leave_behind

- item: assembler utilities section consume (feasibility item 8)
  owner: later assembler card
  plan_row: P-75
- item: PE inspect utilities chip if desired
  owner: hauska-map isolated tree
  plan_row: P-75
