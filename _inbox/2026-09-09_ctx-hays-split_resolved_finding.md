---
id: 2026-09-09_ctx-hays-split_resolved_finding
title: The Hays absent population is two populations, and 99% of it is not a CAD dropout
date: 2026-09-09
last_updated: 2026-09-09
status: resolved
applies_to: legacy-design-tools
plan_rows: [P-124]
seat: property (fix/ctx-hays-2026-cad-reacquire)
severity: high — blocks the pending recordRetirement ruling as currently scoped
snapshot:
  store: f06-staging-neondb
  measured_at: 2026-09-09T00:00Z (approximate, live query)
related:
  - _inbox/2026-09-09_ctx-hays_close.json
  - _inbox/2026-09-09_ctx-hays_acquisition_mechanism_resolved_finding.md
  - _inbox/2026-08-25_p78_announce_hays_48209.md
  - _inbox/2026-09-09_ctx-hays-split_cp1.json
  - _inbox/2026-09-09_ctx-hays-split_cp2.json
  - _inbox/2026-09-09_ctx-hays-split_close.json
  - _dispatches/2026-09-09_ctx-hays-split_dispatch.md
---

# Resolution: source_file cannot split the absent population, but assessed_value can — and the split changes the ruling

The CTX-HAYS close (`_inbox/2026-09-09_ctx-hays_close.json`) resolved mechanism B (Hays CAD's own
2026 roll is genuinely ~134,600 accounts) and handed the operator a ruling: launch Hays on its true
smaller population, with the ~37,510-account gap to 2025 handled by CTX-RETIRE's `recordRetirement`
declared-absence mechanism. That handback treated the whole gap as one population. **It is not one
population, and the difference changes what a correct ruling looks like.**

## The absent population, measured directly

Present at tax_year 2025, absent at tax_year 2026, county 48209 (an anti-join on `cad_property`'s own
primary key, live against f06-staging-neondb): **38,444 rows.** Grouped by each row's current
`source_file`: 38,304 read `stratmap25-landparcels_48209_lp.zip`, 140 read `hays-export2.zip`.

## Why that grouping is not the real split

`source_file` was overwritten in place by the 2026-08-25 P-78 StratMap apply, for every row it
touched, regardless of whether the row already existed. `lib/cad-ingest/src/p78Merge.ts:196-197` sets
`out.sourceFile = inc.sourceFile` unconditionally — never coalesced against the prior value. So a
genuine Hays CAD account that P-78 updated now carries the identical `source_file` string as a row
that never had a CAD account at all. This is confirmed two independent ways: the code says so
unconditionally, and the arithmetic says so exactly — the P-78 announce doc's own pre-apply count
(131,246 CAD-only rows at 2025) minus the 55,695 rows still legibly tagged `hays-export2.zip` today is
75,551, which is exactly the count this lane independently recovered by a live field query (below).
**`source_file` alone cannot distinguish the two populations, exactly as the dispatch warned.**

## The field that survives the overwrite

`assessed_value`. StratMap/TxGIO's own row mapper (`lib/cad-ingest/src/txgio/landuse.ts:146`) hardcodes
`assessedValue: null` on every row it produces — it carries land/improvement/market value fields, never
an assessed value. `assessedValue` is coalesced (`p78Merge.ts` `COALESCE_FIELDS`), so on an UPDATE the
original CAD assessed value survives untouched; on an INSERT (a prop_id with no prior row) it is written
directly from the incoming StratMap row and is null. Calibrated first against the untouched
`hays-export2.zip` lineage, which is 100% assessed-value-populated both overall (55,695/55,695) and
within its own 140-row absent subset — zero false negatives, so a NULL cleanly means "no prior CAD row
existed here to coalesce against."

Applied to the 38,304 stratmap-tagged absent rows: **244 have `assessed_value` populated** (real,
varied dollar amounts, $18 to $4,232,475) — genuine Hays CAD accounts whose `source_file` was
overwritten by P-78 and which are also genuinely absent from the 2026 roll. **38,060 have no
assessed_value, no exemption code, and no living-area figure** — no field this lane checked shows any
trace these rows were ever a Hays CAD appraisal account.

## The true split of the 38,444-row absent population

| Population | n | Basis |
| --- | --- | --- |
| Genuine CAD-lineage, confirmed absent | **384** | 140 still tagged `hays-export2.zip` + 244 recovered via `assessed_value` under the stratmap tag |
| StratMap geometry, no CAD signal ever found | **38,060** | stratmap-tagged, null on every CAD-native field checked |

384 + 38,060 = 38,444. Reconciles exactly against the anti-join total.

## What this means for the pending ruling

The CTX-HAYS handback proposed `recordRetirement` for the whole ~37,510-account gap. **That is correct
for 384 rows and a category error for 38,060 — 99% of the population it was proposed for.**
`recordRetirement` asserts an account left the roll; a StratMap geometry row that shows no evidence of
ever having an appraisal account cannot honestly carry that assertion. Writing it anyway would be the
fabrication class `ENFORCEMENT.md` exists to prevent, written at scale onto a launch county.

**Recommended honest state per population** (recommending, not implementing):
- The 384 genuine CAD-lineage absent accounts: `recordRetirement` is correct and honest here — these
  are real accounts confirmed present on the 2025 CAD roll and confirmed absent from the 2026 export.
- The 38,060 geometry-only absent rows: `recordRetirement` does not apply — nothing on the appraisal
  roll has been shown to exist for these prop_ids at any point, so they need a distinct, honestly-named
  non-appraisal-geometry absence state, not a retirement.

## Control: the instrument confirmed sound, but the dispatch's own control county was wrong

The dispatch named Bastrop (48021) as "a single clean lineage." Verified live: **false** — Bastrop's
2025 vintage carries two source_files (`stratmap25-landparcels_48021_lp.zip`, 62,257 rows;
`DATA-EXPORT-01.14.2026.zip`, 15,542 rows), the same StratMap-fallback shape as Hays. The prior sweep
that called 34 counties "single-vintage" only counted distinct tax_years per county, never distinct
`source_file`s within a vintage, so this went unflagged. Reported here per DEV_PROCESS 3.2 rather than
silently substituted.

Caldwell (48055) was used instead: its 2025 vintage (24,989 rows) is 100% one StratMap source and its
2026 vintage (48,382 rows) is 100% one genuine-CAD source — a real single-lineage-per-vintage case. The
identical anti-join-and-group-by-source_file query returned exactly one group (267/267 absent rows
under the single true source), with the `assessed_value` recovery check correctly finding nothing to
recover (0/267, because Caldwell's 2025 vintage was never overwritten in place). **The instrument does
not manufacture a split where none exists.**

## Pre-registered falsifier and its outcome

Stated before running the split (`_inbox/2026-09-09_ctx-hays-split_cp1.json`): `assessed_value` would be
trusted only if (a) it recovered a count near the independently-derived 75,551 in the full 2025
population and (b) the untouched lineage's own null rate stayed near zero. Both held, exactly, before
and after restricting to the absent subset specifically. It did not fire.

## Also found, out of scope, not investigated

The county-level `source_file` scan run to find a real single-lineage control surfaced that Bexar
(48029) — the county the CANON-PREAMBLE names as the Factory's "roll, complete" reference — is 100%
`stratmap25-landparcels_48029_lp.zip` with zero `assessed_value` populated anywhere in its 703,258 rows.
Flagged for whichever seat owns the Factory writer / Bexar; not investigated further, out of this
lane's P-124/48209 scope.

## Disposition

STOP. No `recordRetirement` or any absence state was written to any parcel. No code was written — this
is a read-only measurement lane, as scoped, and its output is a recommendation for the operator to rule
on, not an implementation.
