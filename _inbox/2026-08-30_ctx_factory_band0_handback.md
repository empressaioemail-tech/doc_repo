---
id: 2026-08-30_ctx_factory_band0_handback
title: Handback — CTX Factory band 0 (walk grades + alias/F-11/easement schema)
date: 2026-08-30
status: handback
plan_row: F-08, F-10, F-11, F-16
parent: _inbox/2026-08-30_ctx_facts_complete_WDLL.md items 7 and 13
cards:
  - _inbox/2026-08-30_ctx_walk_scrub_WDLL.md items 1-10
  - _inbox/2026-08-30_ctx_w1_alias_WDLL.md items 1-2 only
  - _inbox/2026-08-30_ctx_w3_rail_inventory_WDLL.md F-11 setback landing SCHEMA and easement GIS landing SCHEMA only
seat: property
worktree: P:/seat-worktrees/property/hauska-factory-ctx-publish
repo: P:/hauska-factory
snapshot: hauska-factory origin/main 7f41f523; branch seat/property-ctx-walk-alias-schema; uncommitted diff; no commit
---

# CTX Factory band 0 handback

Date: 2026-08-30  Seat: property  Status: diff ready, uncommitted

Planner commits. This seat did not commit, push, open a PR, bake, publish, or run laptop `--apply`.

## Snapshot

- Worktree: `P:/seat-worktrees/property/hauska-factory-ctx-publish`
- Branch: `seat/property-ctx-walk-alias-schema` (created from `origin/main`)
- HEAD: `7f41f52328ec40da0480d5eb65aad09ca3d4c3f9` (`Merge pull request #36`)
- Working tree was clean on arrival (prior branch `seat/property-ctx-ldtpin-h` at the same HEAD). No other lane's dirty work was present.

## Files changed

Modified:

- `src/jobs/verify-walk.mjs` — `hasKeyPath` no longer treats null as present; BP-ABSENCE-01, S1, S2b, S4, S5, S8, S11 wired into `gradeParcelResponse`; item 9 dropped in the header
- `test/publish.test.mjs` — all-null fixture now fails; legal bodies use absent-verified; S8-safe stamped zoning

Added:

- `test/walk-scrub.test.mjs`
- `test/alias-landing-schema.test.mjs`
- `src/lib/cad-txgio-alias.mjs` — landing row + `identity.alias` writer shape (no persist)
- `src/lib/setback-landing.mjs` — F-11 registry + row parser
- `src/lib/easement-gis-landing.mjs` — four layers + four county-absence rows
- `migrations/0005_ctx_alias_setback_easement.sql`
- `fixtures/d4-refused-roster-s5.json` — Rainmaker `48021:8720522` / `no-setback-row` (copied from the D4 roster, not the full 3747)

## Cards graded (this lane)

Parent `_inbox/2026-08-30_ctx_facts_complete_WDLL.md`:

- Item 7 (W1-walk Factory grades): walk grades are in `verify-walk.mjs`. Ready for planner commit.
- Item 13 (alias persist): items 1-2 of the alias card only (schema + writer shape). Persist `--apply` was not run and is not in this diff.

Walk scrub `_inbox/2026-08-30_ctx_walk_scrub_WDLL.md`:

| Item | Grade | Evidence |
|---|---|---|
| 1 Null is not present | met | `hasKeyPath({a:{b:null}},"a.b")` is false; all-null fixture fails BP-CONTENT-01 |
| 2 Absent-verified only | met | legal five-field pair passes; `landUse: null` + `coverage: false` fails BP-ABSENCE-01 |
| 3 S2b asOf = bakedAt | met | request-clock asOf fails S2b; bake-clock asOf passes |
| 4 S1 sentinel sweep | met | one poisoned row each for `, ,`, `, TX 78660`, `0,0` usable, `UNKNOWN`, `1900` yearBuilt, `A1 — A1` |
| 5 S4 ST_Contains | met | gate-blocked point outside ring fails; joined point inside ring passes |
| 6 S5 Rainmaker | met | silent Rainmaker body fails; body naming `no-setback-row` passes |
| 7 S11 version leaves | met | Travis omitting `zoning.district` / `yearBuilt` vs Bastrop fails; matched sets pass |
| 8 S8 provenance | met | bare `district: SF-1` fails; source+timestamp passes |
| 9 Factory point index | dropped | S4 (query point inside the bound ring) is the second derivation. Constant `ITEM_9_FACTORY_POINT_INDEX`. Not a hole. |
| 10 Handback | met | this file |

Alias `_inbox/2026-08-30_ctx_w1_alias_WDLL.md`:

| Item | Grade | Evidence |
|---|---|---|
| 1 Landing schema | met | `landing_cad_txgio_alias` columns + open-era unique + `owners_agree IS TRUE`; fixture refuses false/null |
| 2 Alias atom | met | `parseCadTxgioAliasAtom` requires subject CAD node, TxGIO value, authority, provenance class, clocks, access; missing clocks or authority refuses; A-022 reuse of earliest era |
| 3-8 | not this card | persist, backfill, bake-read, two-count. See leave_behind |

W3 `_inbox/2026-08-30_ctx_w3_rail_inventory_WDLL.md`:

- F-11 setback landing SCHEMA: `landing_setback_registry` + `landing_setback_record`, keyed by cityKey+district or record URL, registry-loaded, PDD feet CHECK refuses. No ingest.
- Easement GIS landing SCHEMA: four layers (Bastrop Easements_/43, Round Rock, Cedar Park, McLennan CAD 9/10) plus county-absence rows for 48021/48055/48209/48491. Feature rows on those four FIPS refuse. No ingest. No PDD table.

## Tests run and the violation each proved

Command: `node --test test/*.test.mjs` in the worktree. Result: 281 pass, 2 skipped (live landing, no `FACTORY_DATABASE_URL`), 0 fail. Snapshot: HEAD `7f41f523`.

Walk grades (`test/walk-scrub.test.mjs`), each fail-then-pass:

1. **hasKeyPath / BP-CONTENT-01** — violated by `{a:{b:null}}` and by `zoning: null` on an otherwise legal body. Pass: absent-verified objects on every required null leaf.
2. **BP-ABSENCE-01** — violated by `landUse: null` plus `facetCoverage.landUse: false`. Pass: five-field absent-verified pair.
3. **S2b** — violated by `asOf` = request clock `2026-08-30T15:00:00.000Z` while `bakedAt` is `2026-08-28T14:00:00.000Z`. Pass: `asOf === bakedAt` and basis names a shared documented rule.
4. **S1** — violated by one row per token (`, ,`, `, TX 78660`, usable `0,0`, `UNKNOWN`, `1900`, `A1 — A1`). Pass: legal body with none of those.
5. **S4** — violated by gate-blocked `48021` body whose query point sits outside the bound ring. Pass: joined point inside the same ring.
6. **S5** — violated by Rainmaker `48021:8720522` served without `no-setback-row` in the body. Pass: envelope basis names `no-setback-row`. Roster fixture copies the D4 reason.
7. **S11** — violated by same version string with Bastrop emitting `zoning.district` + `structuralFact.yearBuilt` and Travis omitting both. Pass: both counties emit the same leaf set (as values or absent-verified).
8. **S8** — violated by `{ district: "SF-1" }` with no source and no timestamp. Pass: those two fields present, or the leaf is absent-verified (not a served value).
9. **Item 9 drop** — asserted `ITEM_9_FACTORY_POINT_INDEX.status === "dropped"` with the S4 reason.

Schema (`test/alias-landing-schema.test.mjs`):

- Alias landing: `owners_agree: false` and `null` throw `ALIAS_OWNERS_REFUSED`. Legal true row parses.
- Alias atom: empty authority, missing `validFrom`, missing `knowledgeAt`, non-CAD subject throw `ALIAS_SHAPE_REFUSED`. Legal atom parses. Unchanged binding reuses the earliest era.
- Setback: unknown cityKey throws `SETBACK_UNREGISTERED`; no district and no record URL throws `SETBACK_SHAPE_REFUSED`; `PDD-12` with `front_ft: 25` throws `SETBACK_PDD_FEET_REFUSED`. SF-1 sourced and Austin absence parse.
- Easement: invented layerKey throws `EASEMENT_UNKNOWN_LAYER`; Bastrop city layer forced onto county `48021` throws `EASEMENT_COUNTY_SENTINEL`. Four registered layers and four county-absence rows parse.

## leave_behind

```
leave_behind:
- item: alias persist job execute (card H backfill, W1 new binds, two-count instrument)
  owner: property seat
  plan_row: F-10 / F-16
  card: _inbox/2026-08-30_ctx_w1_alias_WDLL.md items 3, 4, 6, 7, 8
- item: bake reads alias first (LDT conformant tier 1)
  owner: property seat
  plan_row: F-06
  card: _inbox/2026-08-30_ctx_w1_alias_WDLL.md item 5
- item: F-11 setback ingest (one row per incorporated city; apply after schema)
  owner: property seat
  plan_row: F-11
  card: _inbox/2026-08-30_ctx_w3_rail_inventory_WDLL.md item 2
- item: easement GIS ingest (counts vs T3 probe; clerk-index stays P-85)
  owner: property seat
  plan_row: F-11 / P-85
  card: _inbox/2026-08-30_ctx_w3_rail_inventory_WDLL.md item 3
- item: Round Rock and Cedar Park layer URLs filled from T3 ellipsis as /arcgis/rest/services/; confirm host path before ingest
  owner: property seat
  plan_row: F-11
- item: migration 0005 not applied to any live Factory store
  owner: planner
  plan_row: F-01 / F-10
```

Item 9 is dropped, not leave_behind.

## What this lane did NOT do

- Commit, push, open a PR
- Bake, publish, deploy
- Laptop `--apply` or any store write
- Alias persist job execute (items 3-8)
- F-11 ingest or a PDD setback table
- Easement feature ingest
- Lift `LANDUSE_JOIN_DISABLED_FIPS_SEED` or join 48209/48491 on `prop_id`
- PE or LDT bake code
- Wave R
- A standalone scrub script beside the walk
