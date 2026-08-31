---
id: 2026-08-25_review_p78_write_path
title: Adversarial code review — P-78 write path (WDLL 8 and 9)
date: 2026-08-25
status: filed
author: integration reviewer (no commit, no product write)
plan_row: P-78
seat: integration on P:/doc_repo
related:
  - _inbox/2026-08-24_parcel_facts_write_path_WDLL.md
  - _inbox/2026-08-24_p78_cad_property_merge_SPEC.md
  - _inbox/2026-08-25_factory_operating_instructions.md
  - _scratch/parcel-facts-write-path.md
---

# Adversarial review: P-78 write path (WDLL items 8 and 9)

Code reading outranks close prose. No cad-ingest, atoms --apply, rematerialize, L17 flip, or tad.org. No vitest run. The named selftest was attempted in the isolated tree and is UNMEASURED (file absent).

## Snapshot

| Tree | Path | Branch | Commit | Notes |
| --- | --- | --- | --- | --- |
| Reviewer seat | `P:/doc_repo` | `main` | `11763c0d13f0f3b7d622ce637f477e21b8953bb9` | Integration checkout. Dirty working tree ignored. |
| Isolated (graded for item 9) | `P:/tmp/ldt-p78-landuse` | `feat/p78-landuse-year-gis` | `46e1a5a1b52a14953e9eb242fd1c908ea24b13ce` | Equals this clone's `origin/main`. Zero commits ahead. Dirty: none on `lib/cad-ingest`. |
| GitHub LDT `origin/main` | `empressaioemail-tech/legacy-design-tools` | `main` | `46e1a5a1b52a14953e9eb242fd1c908ea24b13ce` | `gh api` parents: single parent `72cffc8bf3c5660a0d7b756468073859f2583142`. |
| P-78 product commit | same repo | on `main` | `72cffc8bf3c5660a0d7b756468073859f2583142` | Subject `feat(cad-ingest): P-78 cad_property merge authority rule`. No PR number. Parent `403d8010` (P-75). |
| Local LDT checkout (not shipped) | `P:/legacy-design-tools` | `feat/s1-instrument-hardening` | `10069854f5aa840cc94e6eadbd625c61d3e48010` | Still hard-nulls `yearBuilt`/`landAcres` and last-wins `excluded.*`. Do not treat as `origin/main`. |

`git ls-remote origin refs/heads/main` from the isolated tree returned `46e1a5a1`. GitHub agrees. P-78 is already on shipped main. The "in-flight isolated tree" has no unique commit.

Factory operating instructions said P-78 belongs on an isolated LDT tree from `origin/main`. The implementing agent pushed `72cffc8b` onto main, then #478 (`46e1a5a1`) landed on top of it.

## WDLL 8 grade: met

Item: a fixture where CAMA lacks legal and StratMap has legal does not wipe legal on the same `(fips, prop_id, tax_year)`, verified by violation. Check: failing-first test in cad-ingest.

On isolated / GitHub `origin/main` `46e1a5a1` (via `72cffc8b`): **met**.

Evidence: `upsertCadProperties` SET uses `COALESCE(excluded.legal_description, cad_property.legal_description)` at `lib/cad-ingest/src/ingest.ts:92`. Fixture F1 incoming legal is null, expect keeps `LOT 12 BLK 3 HIGHLAND PARK`. Test `last-wins fails F1 and F3` at `lib/cad-ingest/src/__tests__/p78-merge.test.ts:67-71` asserts `applyLastWins(F1)` is not F1 expect. Last-wins of F1 yields `legalDescription: null`. That is the fixture that fails last-wins.

Local `P:/legacy-design-tools` at `10069854` still has `legalDescription: sql\`excluded.legal_description\`` (`ingest.ts:91`). That checkout is not the grade target.

Caveat (does not drop the grade to partial): the failing-first test exercises `applyPathAMerge` in JS, not the drizzle SQL. SQL was graded by reading. It matches the spec CASE and COALESCE list. A drizzle interpolation bug would not fail `p78-merge.test.ts`.

## WDLL 9 grade on isolated tree: partial

Item: `landuse.ts` no longer hard-nulls `year_built` / `land_acres` when the DBF has the source fields. One-county dry-run artifact filed. Check: parser test + dry-run JSON.

**partial.**

Parser half is implemented, not merely imported.

`lib/cad-ingest/src/txgio/landuse.ts:42` imports `landAcresFromGis` and `parseYearBuilt` from `../p78Merge`.
`landuse.ts:147` `yearBuilt: parseYearBuilt(properties.YEAR_BUILT)`.
`landuse.ts:149-153` `landAcres` from `landAcresFromGis(properties.GIS_AREA, properties.GIS_AREA_U)`, refuse maps to null.
Parser tests at `p78-merge.test.ts:85-120` (comma list `1962`, unknown `SQM` null acres, `AC` writes `"2.5000"`).

`livingAreaSqft` stays null at `landuse.ts:148`. Correct. StratMap schema in `txgio/parse.ts:10-15` lists `YEAR_BUILT`, `GIS_AREA`, `GIS_AREA_U`, `Shape_Area`. No living-area / sqft attribute. `Shape_Area` is geometry. Do not invent a column.

Dry-run half is absent. No one-county dry-run JSON in the isolated tree or in `P:/doc_repo/_inbox` under a P-78 leftover name. `landuse-cli.ts:249-252` `--dry-run` only increments `coded` when `propertyUseCode` is set. It does not emit year/acres counts or a file.

## Defect-class hunt (read, not measured)

1. Hard-null leftover: gone on `46e1a5a1` / `72cffc8b`. Present on stale local LDT `10069854` `landuse.ts:146-148` (`yearBuilt: null`, `livingAreaSqft: null`, `landAcres: null`).
2. `Number(YEAR_BUILT)` on comma lists: `parseYearBuilt` walks comma tokens and takes the first `^\d{4}$` in `[1800, 2027]` (`p78Merge.ts:15-29`). F8 incoming is the string `"1962,2011,2023"`, expect integer `1962`. Test also asserts `Number("1962,2011,2023")` is NaN (`p78-merge.test.ts:75-77`).
3. `GIS_AREA_U` missing/unknown: `landAcresFromGis` refuses blank unit and unknown tokens (`p78Merge.ts:45-59`). `SQM` refuse. Does not assume acres.
4. Last-wins residual on `cad_property`: none on isolated SET. Owner/situs/legal/values/use/acres are COALESCE. `source_file` / `source_vintage` stay `excluded.*` (spec). `txgio/ingest.ts:202-206` still `excluded.*` on `txgio_parcel` situs/owner. Different table, different PK. Not the F1 wipe.
5. CAMA-wins CASE: SQL `LIKE 'tier:cad-export;%'` at `ingest.ts:103-104` and `110-111`. JS `startsWith("tier:cad-export;")` at `p78Merge.ts:62-63`. Not unstructured vintage. Arms are not inverted vs spec.
6. `year_built` 0: `parseYearBuilt(0)` null; `toInsertRow` runs it (`ingest.ts:44`); SQL `NULLIF(..., 0)`. F6 expect `yearBuilt: null`.
7. `living_area_sqft` invented: not in `landuse.ts`. Stays null.
8. Value columns on `txgio_parcel`: `parse.ts:611-624` returns identity + situs + geometry only. Values stay on `cad_property` via landuse.
9. Fixture suite: not happy-path-only. Last-wins is asserted on F1 and F3. Thinner than the doc_repo spec runner (see findings).
10. Diff isolated vs `origin/main`: leftover is implemented on both, because they are the same SHA. Not import-only.

## Findings

| Severity | File:line | Mechanism | Second mechanism that would look the same, and why rejected |
| --- | --- | --- | --- |
| note | GitHub `72cffc8b` parent of `46e1a5a1` | P-78 already shipped on `origin/main` with no PR number. Isolated branch has no delta. Factory card said isolated tree. | Local ref rewrite with a colliding SHA. Rejected: `gh api` returns the same SHA and parent `72cffc8b`. Content-addressed. |
| fix-before-prod-upsert | WDLL 9 check; `landuse-cli.ts:249-252` | No one-county dry-run JSON. `--dry-run` counts STAT_LAND_ only. Leftover year/acres unmeasured on a real DBF. | Dry-run exists under another name. Searched isolated tree and `_inbox/*p78*`. Only the spec file. Rejected. |
| note | `p78-merge.test.ts:60-71` vs `scripts/p78-merge-fixtures-selftest.mjs` | Isolated vitest asserts fixture expect match + last-wins fails F1/F3. Spec runner also requires keep-existing fails F2, assume-acres differs from F5 refuse, write-0 fails F6, mutated F7 expect fails, GIS unit table both directions. Those violation legs are not in cad-ingest. | Fixtures F2/F5/F6/F7 being absent. Rejected: the JSON files exist under `__fixtures__/p78-cad-merge/`. The extra falsifiers are missing, not the fixtures. |
| note | `scripts/p78-merge-fixtures-selftest.mjs` in LDT tree | Named instrument UNMEASURED. File absent. Doc_repo copy exists and was not run as the product grade. | File gitignored. Rejected: `Test-Path` false; `git ls-files` does not list it. |
| note | `ingest.ts:86-116` vs `p78-merge.test.ts` | SQL SET is unread by the fixture suite. JS reference can stay green while drizzle SQL drifts. | SQL already wrong on this tree. Rejected by reading: COALESCE list and both CASE blocks match the spec, including `cad_property.source_vintage LIKE 'tier:cad-export;%'`. |
| note | `p78-merge.test.ts:37-41` + F5 JSON | Fixture runner returns whole-result `{refuse, reason}` and never merges the rest of the row. Spec says F5 is field refuse, not whole-row abort. Product path (`landuse.ts:149-153`) nulls acres and still emits owner/legal/values. | Product aborts the row. Rejected: `normalizeStratMapLandUse` still returns a full record when the gate refuses. |
| note | `landuse-cli.ts:222-230` | Non-bulk leftover default vintage is DBF basename, not `tier:stratmap-roll;...`. Unstructured is correctly not CAMA. A reader that requires the stratmap prefix would miss the leftover stamp. | CASE inverted because of this. Rejected: unstructured fails `LIKE 'tier:cad-export;%'`, so it is "not CAMA" as the spec requires. |
| note | `landuse-cli.ts:173-179` | `bulk_primary` (Dallas 48113, Tarrant 48439) refuses stratmap-landuse without `--allow-stratmap-fallback`. Error text still calls year_built / land_acres CAD-only. Blocks leftover apply on those two FIPS. | Gate still hard-nulls parser output. Rejected: parser writes the fields; the CLI never reaches upsert on those two FIPS without the flag. |
| note | `P:/legacy-design-tools` `landuse.ts:146-148`, `ingest.ts:86-100` | Stale seat checkout still hard-nulls and last-wins. An agent that reads that tree will report leftover unfixed. | origin/main still last-wins. Rejected: GitHub `46e1a5a1` parent is `72cffc8b`; `git show 403d8010:lib/cad-ingest/src/txgio/landuse.ts` is the last shipped hard-null, and that SHA is behind main. |
| note | `txgio.test.ts:343-346` | Bexar fixture omits `YEAR_BUILT` / `GIS_AREA`. Expects null year/acres. Comment "Fields StratMap does not carry stay null" is stale. The assertion is still true for this fixture (`parseYearBuilt(undefined)` null; blank unit refuse). | Test proves leftover still hard-nulls even when fields are present. Rejected: `BEXAR_ROW` has no those keys. Separate tests in `p78-merge.test.ts` pass the fields in. |
| note | `p78Merge.ts:32-34` | `formatAcres` uses `Math.round(n * 10000 + Number.EPSILON)`. Spec asked half-away-from-zero. Spec examples `1.00004 -> 1.0000` and `1 ha -> 2.4711` hold under this formula. Isolated suite does not assert SQFT/HA. | Acres assumed without unit. Rejected: unit table is checked first. |
| note | `txgio/ingest.ts:202-206` | Last-wins on `txgio_parcel` owner/situs. | Same SET wipes StratMap legal on `cad_property`. Rejected: `parse.ts:611-624` does not write legal or values onto `txgio_parcel`. |

## Selftest

In `P:/tmp/ldt-p78-landuse`: `node scripts/p78-merge-fixtures-selftest.mjs` → **UNMEASURED**. File absent.

The fixture that fails last-wins is **F1** (incoming CAMA `legalDescription: null` vs StratMap legal). **F3** also fails last-wins (incoming StratMap `yearBuilt: null` vs CAMA `1978`). Those are the two named in `p78-merge.test.ts:67-71`.

## leave_behind (implementing agent)

```
leave_behind:
- item: one-county leftover dry-run JSON (parser counts for YEAR_BUILT / GIS_AREA / GIS_AREA_U, not STAT_LAND_ only). Caldwell 48055 is the leftover county. Dallas/Tarrant stay behind the bulk_primary flag.
  owner: property / P-78 implementer
  plan_row: P-78
- item: do not re-implement P-78 on a fresh branch from an old SHA. It is already on origin/main as 72cffc8b.
  owner: property / P-78 implementer
  plan_row: P-78
- item: do not run stratmap-landuse apply until the dry-run JSON exists. WDLL 9 is partial without it.
  owner: property / P-78 implementer
  plan_row: P-78
- item: optional, not a merge block: port spec-runner falsifiers (F2 keep-existing, F5 assume-acres, F6 write-0, F7 mutated expect) into cad-ingest, or add a SQL F1 wipe probe. JS last-wins F1/F3 already exist.
  owner: property / P-78 implementer
  plan_row: P-78
- item: do not invent living_area_sqft from GIS_AREA or Shape_Area. Null is correct.
  owner: property / P-78 implementer
  plan_row: P-78
- item: do not whole-row-abort on GIS_AREA_U refuse. Field-null only.
  owner: property / P-78 implementer
  plan_row: P-78
- item: do not grade leftover from P:/legacy-design-tools HEAD 10069854. That branch is last-wins + hard-null.
  owner: any later reviewer
  plan_row: P-78
```

No atoms / access policy / capture-job move. No thesis-parity claim from this review.

## What this review did not do

Did not run vitest. Did not execute SQL. Did not fetch a StratMap zip. Did not write product code. Did not commit.
