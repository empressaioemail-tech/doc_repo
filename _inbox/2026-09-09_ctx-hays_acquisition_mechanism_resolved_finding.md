---
id: 2026-09-09_ctx-hays_acquisition_mechanism_resolved_finding
title: Hays' 2026 CAD roll is genuinely ~134,600 accounts -- Hays CAD's own export, not an ingest defect
date: 2026-09-09
last_updated: 2026-09-09
status: resolved
applies_to: legacy-design-tools
plan_rows: [P-124]
seat: property (fix/ctx-hays-2026-cad-reacquire)
severity: informational
snapshot:
  store: f06-staging-neondb
  measured_at: 2026-09-09T15:00Z
related:
  - _inbox/2026-09-09_hays_2026_cad_roll_is_incomplete_finding.md
  - _inbox/2026-09-09_ctx-hays_cp1.json
  - _inbox/2026-09-09_ctx-hays_cp2.json
  - _inbox/2026-09-09_ctx-hays_close.json
  - _inbox/2026-08-25_p78_announce_hays_48209.md
  - _dispatches/2026-09-09_ctx-hays_dispatch.md
---

# Resolution: mechanism B, not A -- and the 172,116 comparator was never a clean CAD count

The prior finding (`2026-09-09_hays_2026_cad_roll_is_incomplete_finding.md`) established that Hays'
2026 roll (134,606 accounts) is 21.8% smaller than its 2025 roll (172,116) and left open which of two
mechanisms explains it: our own 2026 acquisition running incomplete (A), or Hays CAD's own 2026 export
genuinely being that size (B). This dispatch's mandate was to read the acquisition-side record and
settle that question with evidence before doing anything else. It is now settled.

## No acquisition-run record exists to read

There is no `cad_ingest_runs` table, log file, or any per-run artifact anywhere in this program --
checked every table in `lib/db/src/schema/`, the cad-ingest CLI (`lib/cad-ingest/src/cli.ts`, which only
`console.log`s), and doc_repo's `_catalog/`. The only durable trace of a run is `cad_property`'s own
`source_file` / `source_vintage` / `ingested_at` columns, bumped on every upsert -- a row-level
fingerprint, not a run record. This is itself worth naming as a gap: nothing in this program can answer
"did an ingest run complete" without either re-deriving it from the store (the exact proxy-reading the
dispatch warned against) or re-fetching the source and recounting, which is what this lane did.

## The fingerprint that exists

`cad_property` for county 48209, tax_year 2026: one source, `source_file =
'2026-PRELIMINARY-DATA-EXPORT-FILES.zip'`, `source_vintage = '2026-preliminary-data-export-files'`, all
134,606 rows ingested inside one 33-second window on 2026-07-16. One file, one pass, no gap or retry
signature.

## The falsifying test: recount the source directly, three independent ways

Fetched `https://hayscad.com/data-downloads/` directly (a plain browser User-Agent gets a 200; the page
403s a bare programmatic fetch with no UA, matching `lib/cad-ingest/src/sources.ts`'s documented WAF
note -- no credential or access-control bypass involved, this is a public page). Downloaded and counted
distinct `PropertyID` values in the record-1 Property file using an exact reproduction of
`lib/cad-ingest/src/csv.ts` + `lib/cad-ingest/src/orion/parser.ts`'s own dedup logic, run cold against
freshly downloaded bytes, from three separate Hays CAD drops:

    drop                                                          published    distinct accounts
    2026-PRELIMINARY-DATA-EXPORT-FILES.zip (the file we ingested)  2026-03      134,606  (EXACT match)
    2026_07_18_2127-Orion-2026-Certified-Export.zip (different     2026-07-18   134,600  (raw row count,
      schema -- PropertyQuickRefID, no PropertyID column)                                 different schema)
    2026-PROPERTY-DATA-EXPORT-FILES-AS-OF-8-26-2026.zip (freshest  2026-08-27   134,591
      available today)

Three independent counts, five months apart, two different export mechanisms, a spread of 15 rows
(0.01%). None approaches 172,116 or any materially larger neighborhood. **This is mechanism B.** Hays
CAD's own 2026 roll genuinely contains approximately 134,600 accounts. Re-acquiring under the current
source registration -- or under the certified/as-of variants, once a parser exists that reads their
schema -- would not close the gap to 172,116, because there is no larger 2026 population sitting
unread on Hays CAD's site. The as-of-8-26-2026 recount is the direct proof: it is what a re-acquire
today would produce, and it is 15 rows SMALLER than what we already have.

## The 172,116 comparator was never a clean number to begin with

`_inbox/2026-08-25_p78_announce_hays_48209.md` documents a StratMap parcel-geometry fallback applied to
Hays' tax_year **2025** on 2026-08-25 (`Declared 2026 rows unchanged`), explicitly because the original
2025 CAD-only population (131,246) was already known incomplete. 116,421 rows were touched (40,870 net
new); the result is the 172,116 the original finding used as its baseline. `cad_property` today shows
this as two source lineages for tax_year 2025: `hays-export2.zip` (55,695 rows, the genuine CAD export)
and `stratmap25-landparcels_48209_lp.zip` (116,421 rows, non-CAD parcel geometry used as a coverage
fallback). 172,116 was a CAD export padded with a geometry-source supplement, applied for a different
reason (coverage) than appraisal completeness. Comparing a single-source, single-pass 2026 CAD export
(134,606) against that composite is not an apples-to-apples measure of roll shrinkage -- it does not
change the A-vs-B verdict (which rests on the independent source recount above, not on this comparison),
but it is a real, separate reconciliation gap and is filed here rather than silently absorbed
(DEV_PROCESS 1.3/1.4).

## Disposition, per the dispatch's own instruction under mechanism B

STOP. No re-acquisition, no apply, no bake, no `MAX_MISS_RATE` change, no backfill from 2025. Handing
back to the operator/integration seat: **Hays' own appraisal district has not published (and per the
as-of-8-26-2026 recount, still has not published as of five weeks ago) a 2026 roll larger than
~134,600 accounts.** The `CADROLL_RENULLED` gate refusing Hays at a 22.22% dollar-miss rate is correct
and should stay refusing -- the 38,444-or-so parcels that would publish with no dollar values are real
2025-vintage accounts absent from the current 2026 roll, and serving them silently would be exactly the
fabrication the gate exists to prevent. This is now an operator-ruling question, not a code or
acquisition question: whether Hays launches on its true, smaller 2026 population (with the ~37,510
absent accounts handled by the CTX-RETIRE `recordRetirement` declared-absence mechanism this same
program just built), whether it waits for a hypothetical future Hays export that never actually grows to
172K, or whether some other resolution applies. This lane does not have standing to make that call.

## Also found: two more counties in the same latent shape as Caldwell

Broadening the vintage sweep past the six counties the original finding named (the staging store holds
40 total), two more counties carry a smaller prior (2025) vintage than their current (2026) one -- the
same asymmetry class as Caldwell, currently harmless only because the newer vintage is what serves:
**Dallas (48113)**, 693,556 to 806,563 (+16.3%), and **Tarrant (48439)**, 689,838 to 975,885 (+41.5%).
Tarrant's jump is large enough that it may be worth the integration seat checking whether Tarrant's own
2025 vintage was itself a partial acquisition the way Hays' 2026 turned out NOT to be -- flagged, not
investigated, out of this lane's scope.
