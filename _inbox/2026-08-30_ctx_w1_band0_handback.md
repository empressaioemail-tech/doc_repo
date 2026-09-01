---
id: 2026-08-30_ctx_w1_band0_handback
title: Handback — CTX W1 band 0 (last bake inputs)
date: 2026-08-30
status: handback
plan_row: F-06, F-08
parent: _inbox/2026-08-30_ctx_w1_bake_WDLL.md items 2, 3, 4, 6, 8, 7
cards:
  - _inbox/2026-08-30_ctx_w1_bake_WDLL.md
  - _inbox/2026-08-30_ctx_w1_alias_WDLL.md item 5
depends_on:
  - _inbox/2026-08-30_ctx_w0b_landuse_source.json
  - _inbox/2026-08-30_ctx_w0b_owner_agree.json
  - _inbox/2026-08-30_ctx_w0_tax_year.md
seat: property
worktree: P:/seat-worktrees/property/legacy-design-tools-ctx-join
repo: P:/legacy-design-tools
branch: seat/property-ctx-w1-bake
snapshot: origin/main 7cbe0bc4; uncommitted W1 diff; no commit
owner: property-seat executor produced the diff; planner reviews and commits
---

# CTX W1 band 0 handback

Date: 2026-08-30  Seat: property  Status: diff ready, uncommitted

Planner commits. This seat did not commit, push, open a PR, bake, publish, or run laptop `--apply`.

## Snapshot

- Worktree: `P:/seat-worktrees/property/legacy-design-tools-ctx-join`
- Branch: `seat/property-ctx-w1-bake` (created from `origin/main` `7cbe0bc4`)
- HEAD: `7cbe0bc446940115e059f1bd78ef9f93d065b7ce`
- Working tree on arrival: clean. Dirty files now are only this card.
- Seat: property. Registered worktree `legacy-design-tools-ctx-join`.

## W0b grades that bound the bake

- landUse source: `land-use-fact.landUseCode` / `cad_property.property_use_code`. Pine and Rainmaker A1. Bake null + coverage false is the miss.
- Situs-extend OFF. 48021 leftover owner-agree 0.688 (n=32) no-go. 48055 0.721 (n=43) no-go. 48453 unmeasured. `addressJoinKey` not reversed for those FIPS. Item 5 non-vacuous recovery does not apply.
- Seed stays. `LANDUSE_JOIN_DISABLED_FIPS_SEED` is still `{48209, 48491}`. Tests still fail a `prop_id` join on both.

## Files changed

Modified:

- `artifacts/api-server/src/lib/nodeFacetBakeTier1Conformant.ts` — named landUse or absent-verified; `landUseGateBlocked` from the join gate; alias-first `joined-situs` source `cad-txgio-alias`; tax-year provenance; claim refuse wipes load-bearing fields
- `artifacts/api-server/src/lib/nodeFacetTier1Assemble.ts` — landUse union (code or absent-verified); coverage true only on a code
- `artifacts/api-server/src/nodeFacetBakeTier1ConformantCli.ts` — max-year grouping; named-source fetch; alias READ; honest upsert; bind emit (may be empty)
- `artifacts/api-server/src/nodeFacetBakeTier1Conformant.test.ts` — items 2, 3, 4, 6, 8 fixtures
- `artifacts/api-server/src/parcelsPmtilesBakeCli.ts` — blast-radius note only (W1 item 6). No PMTiles behavior change.

Added:

- `artifacts/api-server/src/lib/taxYearSelect.ts`
- `artifacts/api-server/src/lib/honestPointUpsert.ts`
- `artifacts/api-server/src/lib/namedLandUseSource.ts`
- `artifacts/api-server/src/lib/namedLandUseSourceFetch.ts`
- `artifacts/api-server/src/lib/cadTxgioAliasRead.ts`

Not touched: hauska-map, Factory walk, `LANDUSE_JOIN_DISABLED_FIPS_SEED`, `addressJoinKey` invert, P-80 `geo_id`, `identity.alias` writer.

## Cards graded (this lane)

Parent `_inbox/2026-08-30_ctx_w1_bake_WDLL.md`:

| Item | Grade | Evidence |
|---|---|---|
| 1 Situs-extend | not coded | W0b no-go on 48021 / 48055; 48453 unmeasured. `SITUS_EXTEND_GO_FIPS` is empty. |
| 2 Seed stays | met | Existing seed tests plus not-vacuous: 48021 still joins; 48209 / 48491 `landUseJoinKey` still null; seed size 2. |
| 3 Tax year | met | Fixtures: singleton `max-year`, agree `max-year-agree` (winner `entity_id` ASC), disagree refuses, unyeared singleton, unyeared disagree. Provenance `taxYear` + `taxYearRule`. |
| 4 landUse | met | `landUse: null` + `coverage: false` fails `landUseBakeLegal`. Pine / Rainmaker named A1 pass. Travis with source present cannot emit the miss. `landUseGateBlocked` follows the join gate. |
| 5 Non-vacuous recovery | n/a | No go FIPS. |
| 6 Honest point | met | Sentinel / gate-blocked-no-ring writes 0,0. CLI uses `HONEST_POINT_COORD_SET_SQL` (always EXCLUDED). Retired CASE string absent. `parcelsPmtilesBakeCli` named in the blast-radius note. |
| 7 Handback | met | this file |
| 8 Alias first | met | Alias hit sets `joined-situs` / `cad-txgio-alias` and skips situs fetch. New bind emit may be empty. No `identity.alias` writer. |

Alias `_inbox/2026-08-30_ctx_w1_alias_WDLL.md` item 5 (READ only): met as bake-side. Items 1–4 and 6–8 are Factory persist; not this diff.

## Tests run and the violation each proved

Command (api-server, dummy `DATABASE_URL` for `@workspace/cad-ingest` import): `pnpm exec vitest run src/nodeFacetBakeTier1Conformant.test.ts src/lib/joinNormalize.test.ts src/nodeFacetBakeTier1.test.ts`. Result: 142 pass, 0 fail. Typecheck: `pnpm exec tsc -p tsconfig.json --noEmit` exit 0. Snapshot: HEAD `7cbe0bc4`.

W1 fixtures (fail-then-pass):

1. **Item 2 seed** — violated by an empty seed (`landUseJoinKey("48209")` would return a key) or a total block (`landUseJoinKey("48021")` would be null). Pass: seed `{48209,48491}` and Bastrop still joins.
2. **Item 3 tax year** — violated by page-order pick (`z:2026` before `a:2026` would win) and by silent overwrite on disagree. Pass: winner `a:2026`; disagree writes absent-verified claim fields.
3. **Item 4 landUse** — violated by `{ landUse: null, coverage: false }` (Pine/Rainmaker live miss). Pass: named A1 on 48021:34137 and 48021:8720522; Travis with source present emits A1.
4. **Item 6 honest point** — violated by keep-prior on 0,0 (prior 30.11,-97.31 kept). Pass: write is 0,0; CLI has no retired CASE.
5. **Item 8 alias** — violated by running situs fetch when an open alias exists. Pass: `situsKeysNeedingFetch` empty on an alias hit; payload source `cad-txgio-alias`. Empty emit set is legal.

Card H seed tests still fail a `prop_id` join on 48209 / 48491.

## leave_behind

```
leave_behind:
- item: alias persist job (card H backfill, W1 bind consume, two-count)
  owner: property seat
  plan_row: F-10 / F-16
  card: _inbox/2026-08-30_ctx_w1_alias_WDLL.md items 3, 4, 6, 7, 8
- item: landing_cad_txgio_alias may be absent on DATABASE_URL (Factory 0005 not applied)
  owner: property seat
  plan_row: F-06 / F-16
  note: bake READ returns tableState absent and empty emit; persist must write where the bake reads
- item: leftover no-row on 48021 / 48055 / 48453 (situs-extend no-go)
  owner: property seat
  plan_row: F-10 / P-80
- item: Wave R pin + bake + publish
  owner: planner
  plan_row: F-06 / F-08
- item: parcelsPmtilesBakeCli query-point rebuild if a later PMTiles run re-derives from inherited centroids
  owner: property seat
  plan_row: F-06
```
