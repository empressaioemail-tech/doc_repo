# RETURN — worker A4 land-use / landuse orphaning

Snapshot: repo `legacy-design-tools` commit `1a55566b057f8db4b888d007009c7fcaf84031d7` worktree `P:/tmp/mp-a4-landuse-orphan` branch `fix/landuse-facet-key`.
DB (READ, then VERIFIED by SELECT): cortex-prod project `fancy-fire-06136146`, database **neondb**, user `neondb_owner`, 2026-08-20T19:45:34Z. `current_database()` returned `neondb`. No UPDATE / INSERT / DELETE / DDL / `--apply`. Not committed. Not pushed.

## Pre-registered ways this output could be wrong (checked before reporting)

1. Reporting the write key from the file header or from `evaluateJoinIntegrity({ facet: "land-use" })` instead of from the UPSERT. The dispatch itself named this trap. **Checked:** READ `upsertLedger` in `countyCoverageScoreCli.ts`. The INSERT binds `$2` to `f.facet`. `scoreCounty` sets that field via `classifyFacet({ facet: LANDUSE_JOIN_FACET_KEY })` with `LANDUSE_JOIN_FACET_KEY = "landuse-cad-join"`. The gate label is a report field, not a ledger key.
2. Missing a second writer of `county_facet_coverage` rows with facet `land-use` because a search looked empty. **Checked:** READ every scorer upsert found by glob of `*ScoreCli.ts` plus `railScoring/run.ts` plus `countyFacetKeyReconcileCli.ts`. I do **not** claim "no other writers exist". `score_cad_rails_fast.mjs` is named as the `landuse` rail writer and is not in this worktree.

## Decision

Planner leaning is **confirmed**. Do not overlay the 19 `land-use` rows onto `landuse`. On this commit the upsert is already `landuse-cad-join`. Remaining work is retirement of Y=`land-use` in the store (prepared, not applied) plus a test that fails if the writer constant returns to `land-use`.

## 1. Write key (READ of the upsert)

`artifacts/api-server/src/countyCoverageScoreCli.ts`:

- Constant: `export const LANDUSE_JOIN_FACET_KEY = "landuse-cad-join"` (line 228).
- `scoreCounty` passes that constant into `classifyFacet` (both the address-recovery branch and the prop_id branch).
- `upsertLedger` calls `assertWritableFacetKeys(score.facets.map((f) => f.facet))` then `INSERT ... VALUES ($1, $2, ...)` with `$2 = f.facet`.
- `evaluateJoinIntegrity({ facet: "land-use" })` still exists. That string is a **gate label** on the integrity report. It does not land in `county_facet_coverage.facet`.

Second mechanism for "the writer still writes land-use": comments updated, upsert unchanged. Rejected because the INSERT parameter list was read; `$2` is `f.facet` and `f.facet` is assigned from the constant.

### Writers READ (not a grep-absence claim)

| Module | What it writes to `county_facet_coverage.facet` | land-use? |
| --- | --- | --- |
| `countyCoverageScoreCli.ts` `upsertLedger` | `f.facet` = `LANDUSE_JOIN_FACET_KEY` (`landuse-cad-join`), plus literals `zoning` and `envelope` | **No, on this commit.** Historical writer of the 19. |
| `countyFloodScoreCli.ts` `upsertLedger` | literal `"flood"` | No |
| `countyGeometryScoreCli.ts` `upsertLedger` | literal `"geometry"` | No |
| `lib/railScoring/run.ts` `upsertCell` (via `countyRailScoreCli.ts`) | `score.facet` = `rule.railKey`. landuse rule is `railKey: "landuse"` | No. Writes the rail, not `land-use`. |
| `countyFacetKeyReconcileCli.ts` | UPDATE `facet` FROM retired TO `landuse-cad-join`. Default is dry-run. `--apply` is operator. | Does not INSERT `land-use`. Re-keys it away. |

`score_cad_rails_fast.mjs` is named in the scoring registry as the instrument on the 254 `landuse` rows (`source=land-use-fact-atom-count`). It is not in this worktree. Out-of-repo, so its write key is **unverified here**. Live rows it left behind are `facet=landuse`, not `land-use` (VERIFIED by SELECT).

Callers of `loadLedgerBlockedFips` that were READ (grep used only to find, then the call site was read): `parcelsPmtilesBakeCli.ts` and `nodeFacetBakeTier1Cli.ts`. Both call with no facet argument. They were reading the default `land-use` only. That is a **consumer of Y**. Doctrine: repoint consumers first. This card changed the default to query `landuse-cad-join` AND `land-use` so deploy and SQL apply can land in either order.

## 2. Overlay claim (VERIFIED by SELECT)

Settled figures were 19 / 254. Live on 2026-08-20T19:45:34Z, neondb / neondb_owner:

| facet | n | counties | state |
| --- | --- | --- | --- |
| `land-use` | 19 | 19 | present |
| `landuse` | 254 | 254 | present, complete TX |
| `landuse-cad-join` | 0 | 0 | **zero, measured** (not unmeasured, not absent-from-wrong-db) |

Second mechanism for successor n=0: queried `hauska_mcp` and got a false zero. Rejected: `current_database()` was `neondb`, and the same session returned the 19 and the 254 matching the settled figures.

All 19 `land-use` counties have a matching `landuse` rail row. 15/19 percentages disagree. Sources disagree (`cad-roll` or `cad-roll-address-join` vs `land-use-fact-atom-count`). Rail rows are newer (2026-08-12 vs 2026-07-21 to 2026-08-05). Verdicts on the 19: 14 `pass`/`real-at-ceiling`, 5 `insufficient-sample`/`true-source-gap`, **0 `block`**.

Named 19 FIPS: 48021 48027 48029 48055 48085 48091 48113 48121 48139 48187 48209 48251 48257 48309 48367 48397 48439 48453 48491.

Worst overlay cases:

- 48091 Comal: orphan 0.00 `true-source-gap` vs rail 99.68 `satisfied-present`. Overlay would drop a satisfied rail cell to a source-gap.
- 48439 Tarrant: orphan 99.38 `real-at-ceiling` vs rail 89.45 `needs-crosswalk` `not-yet`. Overlay would rewrite the rail the other direction.

Four counties agree at 0.00 (`true-source-gap` on both). Agreement on a zero is not evidence they measure the same thing; the sources still differ.

Second mechanism for the disagreement: stale copies of one measurement that later drifted. Rejected: `source` and `verified_by_instrument` differ on every disagreeing row (`cad-roll` / null vs `land-use-fact-atom-count` / `score_cad_rails_fast.mjs:landuse`).

**Do not overlay. Do not migrate onto `landuse`.** Successor occupancy of the 19 at `landuse-cad-join` is 0, so a re-key to the diagnostic is PK-clean **as of this snapshot**. Re-check occupancy at apply time.

## 3. Test that fails if the writer would upsert `land-use`

File: `artifacts/api-server/src/countyCoverageRailState.test.ts`

Check graded with its input type: `LANDUSE_JOIN_FACET_KEY` is the string literal `"landuse-cad-join"`. `expect(key).not.toBe("land-use")` would be satisfied by `"landuse"` (the rail) or by `""`. Those cheapest satisfiers are the overlay and the empty-key defects, so the predicate is equality to `"landuse-cad-join"` plus registry membership (`DIAGNOSTIC` yes, `RAIL` no, `RETIRED` no) plus `assertWritableFacetKeys` (the same guard `upsertLedger` calls before INSERT).

**VERIFIED by violating it** in this environment:

- Constant set temporarily to `"land-use"`.
- `pnpm vitest run src/countyCoverageRailState.test.ts` (dummy `DATABASE_URL` so `@workspace/db` can import; no query to cortex-prod).
- Result: **1 failed**. `expected 'land-use' to be 'landuse-cad-join'`.
- Constant restored to `"landuse-cad-join"`. Re-run: 9/9 pass.

## 4. Prepared retirement SQL (not applied)

`artifacts/api-server/sql/retire_land-use_facet_PREPARE.sql`

Contains SELECT of the three counts, SELECT naming the 19, SELECT comparing them to `landuse` (overlay-falsification), SELECT of successor occupancy. Then a **commented** UPDATE re-key to `landuse-cad-join` (preferred: explicit decline of the retired name, measurement preserved) and a **commented** DELETE alternative. Production apply is operator-authorised. The table cannot express a retired marker: `classification` is a closed CHECK, there is no retired column, `rail_state` is the acquisition axis and is NULL on these 19.

## 5. Retirement item for Y=`land-use` (same card)

- Registry already has `RETIRED_FACET_KEYS = {"land-use"}` and `assertWritableFacetKeys` throws on it. Existing tests pin that.
- **New:** `assertRailLedgerRowFixture({ facet })` in `lib/db/src/schema/facetKeyRegistry.ts`. A row-shaped fixture whose facet is `land-use` used as a rail cell throws. Test constructs `{ county_fips: "48021", facet: "land-use", honest_coverage_pct: "98.01" }` and expects `/RETIRED/`. Input type is `{ facet: string }`; cheapest satisfier of "is a rail key" is any member of `RAIL_FACET_KEYS`, so pinning `land-use` is load-bearing.
- **New:** `loadLedgerBlockedFips` default is now `["landuse-cad-join", "land-use"]` (ANY). Mock-pool test captures the bound array and requires both keys. Table-absent path is proven: SELECT does not run, returns empty (absence, not a fabricated zero-block from a missing table).

SQL file documents that production apply is operator-authorised.

## Tests run (VERIFIED)

Dummy `DATABASE_URL=postgres://unmeasured:unmeasured@127.0.0.1:5432/unmeasured` (local, not cortex-prod). Used only so `@workspace/cad-ingest` can import `@workspace/db` without throwing. No query issued against it.

```
artifacts/api-server: 53 passed (countyCoverageScore 9, countyCoverageRailState 9, joinIntegrityGate 35)
lib/db facetKeyRegistry.test.ts: 15 passed
violation (constant = land-use): 1 failed as required, then reverted
```

## leave_behind

- `item:` prepared SQL `artifacts/api-server/sql/retire_land-use_facet_PREPARE.sql` unapplied
  `owner:` operator
  `plan_row:` this card; apply is operator-authorised
- `item:` `LANDUSE_JOIN_LEDGER_BLOCK_FACETS` still lists `land-use` for transition
  `owner:` next lane after SQL apply verifies `land-use` n=0
  `plan_row:` drop `land-use` from the reader list only after that SELECT
- `item:` `score_cad_rails_fast.mjs` (landuse rail writer) not in this repo
  `owner:` planner
  `plan_row:` out of this worktree; not claimed absent, not opened

## Files touched (uncommitted)

- `artifacts/api-server/src/countyCoverageRailState.test.ts`
- `artifacts/api-server/src/lib/joinIntegrityGate.ts`
- `artifacts/api-server/src/lib/joinIntegrityGate.test.ts`
- `artifacts/api-server/src/lib/railScoring/registry.ts` (stale comment: CLI no longer writes `land-use`)
- `artifacts/api-server/sql/retire_land-use_facet_PREPARE.sql` (new)
- `lib/db/src/schema/facetKeyRegistry.ts`
- `lib/db/src/__tests__/facetKeyRegistry.test.ts`
- `RETURN.md`

`countyCoverageScoreCli.ts` write key was already `landuse-cad-join` at `1a55566b`. Not modified (constant was flipped only for the red-test proof, then restored).
