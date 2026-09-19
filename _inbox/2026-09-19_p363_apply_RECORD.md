---
id: 2026-09-19_p363_apply_RECORD
title: P-363 applied county by county - setback cells written under corpus 1.1.0 re-resolved under the pin 1.4.0, record
date: 2026-09-19
last_updated: 2026-09-19
status: in progress. Image deployed; fresh dry run MATCHES yesterday's per county; snapshot of the re-stamp population next, then the applies
kind: production-write record
owner: nick
maintained_by: integration seat
programs: [OPS-24, OPS-16]
plan_rows: [P-363]
snapshot: hauska-factory ab7618cb (job image sha256:8fcc73e4); factory store ep-round-base-au0jofwp; cortex store ep-lucky-truth-apodo8hr; corpus pin 1.4.0
authority: register row P-363 ("Seat apply owed: ... county by county, dry run first; snapshot the re-stamp population from the store before applying (the run record names value changes only; a count is not a record); Williamson dry-run only (P-350)"); the operator's go on the list, 2026-09-19
---

# P-363 apply, 2026-09-19

## 1. The job

`cloudbuild.parcel-setback-cells.yaml` from a fresh clone of hauska-factory at `ab7618cb` (build
`d55493ab`, SUCCESS 12:28:11Z). `factory-parcel-setback-cells` read back by field: generation 9, image
`sha256:8fcc73e4...`, `IMAGE_DIGEST` equal, template args `["parcel-setback-cells"]` (no `--apply`).
The job takes its OWN heavy-scan lease on the cortex store (`cortex:neondb`) and writes the factory
store.

## 2. Fresh dry run against yesterday's

`factory-parcel-setback-cells-tkmkq` (started 13:05:37Z by a loop that waited for the cortex window,
completed 13:15:57Z), all six counties, `apply: false`. Report copied to
`_inbox/2026-09-19_p363_apply/dryrun_tkmkq_report.json`.

| County | Restamped (parcels) | Value changed | Changed rail cells | New refusal | Blocked | Newer than pin | 2026-09-18 |
|---|---|---|---|---|---|---|---|
| 48021 Bastrop | 6,421 | 0 | 0 | 0 | 0 | 0 | MATCH |
| 48055 Caldwell | 5,485 | 0 | 0 | 0 | 0 | 0 | MATCH |
| 48209 Hays | 35,359 | 6 | 24 | 0 | 0 | 0 | MATCH |
| 48309 McLennan | 37,513 | 0 | 0 | 0 | 0 | 0 | MATCH |
| 48453 Travis | 172,243 | 0 | 0 | 0 | 0 | 0 | MATCH |
| 48491 Williamson | 130,210 | 0 | 0 | 0 | 0 | 0 | MATCH (dry run only, P-350) |
| Total | 387,231 | 6 | 24 | 0 | 0 | 0 | MATCH |

Released corpus versions seen: `1.1.0` only. The store has not moved under P-363 since its lane's dry run.

## 3. The procedure, pre-registered

1. **Name the population before writing.** `q_p363_restamp_population.sql` selects, per county, every
   setback-rail VALUE cell whose source cites `@empressaio/setback-corpus` below 1.4.0, the job's own
   predicate (`corpusSourceOrder === -1`), with an md5 of its state. The version comparison was
   checked on literals first (1.1.0, 1.3.9 and 1.4 older; 1.4.0, 1.4.1, 1.10.0 and 2.0.0 not). Under
   the seat's own factory window, taken with its exit code checked.
2. **Apply one county at a time**, smallest first: Caldwell, Bastrop, Hays, McLennan, Travis. Each with
   `--county=<fips> --apply`. Williamson is not applied.
3. **Read back from the store after each county** (a second derivation from the job's report): every
   snapshot cell now cites 1.4.0, no cell outside the snapshot moved to 1.4.0, the six San Marcos N-CM
   parcels carry the new values (front 5, side 0, rear 0, corner 5), and the county's rail kinds are
   unchanged (a re-stamp never changes a kind).
4. **Falsifiers:** a job count that differs from the dry run's for the county; a snapshot cell still
   below the pin after its county applied; a kind change on any setback rail; a value change outside
   the six named parcels. Any of those stops the sequence.

## 4. The population, named (13:37:22Z to 13:39:41Z, the seat's factory window, take checked)

A first attempt read nothing: psql does not interpolate a `-v` variable inside `\copy`, every query
exited 1, and every file was empty (the instrument reported it rather than an empty population). The
county is now substituted into a per-county copy of the SQL, checked by grep before it runs, and a
failed query stops the run and releases the window.

| County | Parcels named | Dry run | Cells named | sha256 (first 16) |
|---|---|---|---|---|
| 48055 Caldwell | 5,485 | 5,485 | 27,425 | `160d6865247a6fe3` |
| 48021 Bastrop | 6,421 | 6,421 | 32,105 | `1290e1e0c8c8e71f` |
| 48209 Hays | 35,365 | 35,359 re-stamps + 6 value changes | 176,825 | `904d51fabda7d121` |
| 48309 McLennan | 37,513 | 37,513 | 187,565 | `73380eb54852326d` |
| 48453 Travis | 172,243 | 172,243 | 861,215 | `8b47722ff66ed903` |

1,285,135 cells named before any write, five per parcel. Files:
`_inbox/2026-09-19_p363_apply/<fips>.restamp_population.csv` (place_key, rail_key, from_version, state md5).

## 5. The applies

Grader `grade_p363_county.mjs` (self-test 6 of 6: a clean apply passes; a cell left below the pin, a
kind change, a cell outside the snapshot moving to the pin, and a wrong parcel count each FAIL; an empty
snapshot is UNMEASURED).

### Caldwell 48055: PASS

Execution `factory-parcel-setback-cells-nxtdd` (args read back `parcel-setback-cells --county=48055
--apply`), run `4915d094-5240-4172-946d-1b768a1ce29d`. The job's report: restamped 5,485, value changed
0, new refusal 0, blocked 0. The store: 0 value cells below the pin after; value cells at the pin
17,040 to 44,465 (+27,425, exactly the snapshot's cells); no rail's kind totals moved.

**The job's `rowsWrittenByCounty` 37,665, reconciled** (it sums moved cells and companion rows,
`parcel-setback-cells.mjs` around line 1335): 27,425 re-stamped cells (the snapshot) + 5,485
`setbackRules` companion payload rows (deleted and re-inserted with their moved cell, P-363's design)
+ 4,755 unaccounted cells rewritten as unaccounted (951 parcels x 5 rails; the gate always releases
unaccounted). Nothing outside the snapshot changed value, kind or corpus.

The state query's first version labelled a cell with no `source` "above-pin" (a NULL fell through the
CASE); it now reads "no-source". The grade never read that label.
