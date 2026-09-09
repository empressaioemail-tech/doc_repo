# CTX-HAYS — Hays lost a fifth of its accounts between vintages, and nobody has read the acquisition record

Repo: `legacy-design-tools`. The CAD ingest and the `cad_property` store are authored
here (`lib/cad-ingest/`, `lib/db/`), NOT in hauska-engine and NOT in hauska-factory.
The factory only reads `cad_property`; it has no write path to it. A prior dispatch in
this fleet routed CAD ingest to hauska-engine and the lane correctly re-based to here.
Do not repeat that.

## The finding, and it is blocking a launch county

Measured 2026-09-09 against `f06-staging-neondb` and filed at
`_inbox/2026-09-09_hays_2026_cad_roll_is_incomplete_finding.md`:

    county       rolls held                       current vintage   direction
    Bastrop      2025 = 77,799                    2025  77,799      single vintage
    Caldwell     2025 = 24,989   2026 = 48,382    2026  48,382      GREW
    Hays         2025 = 172,116  2026 = 134,606   2026  134,606     SHRANK 21.8%
    McLennan     2025 = 114,255                   2025  114,255     single vintage
    Travis       2025 = 380,918  2026 = 492,848   2026  492,848     GREW
    Williamson   2025 = 282,570  2026 = 319,480   2026  319,480     GREW

Hays is the only county whose current roll is smaller than its prior one. 37,510
accounts present in 2025 and absent in 2026, against a shrinking base. Caldwell's real
churn population, the one CTX-RETIRE was built for, is 267 on a roll that grew, which
is the shape genuine splits and merges take.

The Hays staging bake refuses `CADROLL_RENULLED` at a 22.22 percent dollar-miss rate
against a 2 percent ceiling. The gate is correct and must not be relaxed: letting Hays
through would publish 38,444 parcels carrying no market, assessed, land or improvement
value onto a customer surface, silently. **Do not touch `MAX_MISS_RATE`.**

Operator ruling 2026-09-09: **re-acquire the 2026 roll.** Baking from 2025 with a
vintage marker was considered and rejected as worse.

## What you must establish BEFORE re-acquiring, because it forks the answer

Nobody has read the acquisition-side record. Two mechanisms produce this same
observation and they need different responses. Determine which, with evidence:

**Mechanism A, ours.** The 2026 ingest ran and did not complete: a truncated download,
one of the multi-file drop's files missing or partial, a parse that dropped rows
silently, a filter, or a run that died partway and was never retried.

**Mechanism B, theirs.** Hays CAD published a partial or restructured 2026 export and
134,606 is faithfully what the source contains.

These are not interchangeable. Under A you re-acquire and the problem disappears. Under
B, re-acquiring changes nothing, and the county needs an operator ruling about serving a
county whose own appraisal district has not published a complete current roll. Reporting
A when it is B costs a day; reporting B when it is A costs the county.

Relevant shape from `lib/cad-ingest/src/counties.ts`: Hays is `format: "orion"` (Tyler
Orion PropertyDataExport), bulk page `https://hayscad.com/data-downloads/`, published as
quoted-CSV `.txt` drops with record types 1/2/3/5 in SEPARATE files
(Property/Owner/Land/ImpSegment). The record-1 Property file is the account population.
A multi-file drop where one file is short is exactly the shape that produces this
finding, and it is the first thing to check.

Note that Williamson is also `orion` and it grew, so the format alone does not explain
it. Do not stop at "Orion is flaky."

## The work

1. Read the acquisition record for Hays 2026. Find what ran, when, with what source
   vintage, and what it reported. Name the table or log you read; do not infer it from
   the shape of `cad_property`. Reading the store to guess at the ingest is reading a
   proxy for the authoritative record.

2. Count the source. Fetch the current Hays 2026 drop and count distinct accounts in the
   record-1 Property file BEFORE parsing into anything. That number against 134,606 and
   against 172,116 settles A versus B on its own.

3. Report the fork with evidence, then act:
   - If A: re-acquire, apply, and re-measure `cad_property` for 48209 tax_year 2026.
     Target is a roll that is not smaller than 2025 without a named reason.
   - If B: STOP. Do not fabricate, do not backfill from 2025, do not widen anything.
     Write the finding and hand back for an operator ruling.

4. Whichever branch: state whether any OTHER county has a partial vintage that happens
   not to be the current one. Caldwell's 2025 at 24,989 against a 48,382 roll is exactly
   that shape and is harmless today only because 2026 is the vintage being read. That is
   a latent instance of the same defect and it should be counted, not left to surface
   later.

## Pre-registered falsifier, required before you run anything

State, in CP1, what result would prove your hypothesis wrong. If the answer is that no
result would, you do not have a check. Specifically: name the count you expect from the
source file and what you will conclude if it comes back at 134,606 rather than ~172,000.

## What you must NOT do

Do not relax `MAX_MISS_RATE` or any gate threshold. The gate found a real data problem
and no code change should paper over it.

Do not bake, publish, run a walk, or deploy anything. Do not run any Cloud Run job or
Cloud Build. The integration seat owns every execution on this program.

Do not write to hauska-factory, hauska-engine, or hauska-map.

Do not backfill 2026 from 2025 rows under any circumstances. An account that is not on
the current roll is `absent`, and writing a 2025 value into a 2026 vintage is the
fabrication this program's whole gate structure exists to prevent.

## Close contract

Standard lane close JSON at the auto-named path, plus:

- The authoritative acquisition record you read, named, with the literal query or path.
- The source-side account count with its counting rule, and the A-versus-B verdict.
- If you re-acquired: before and after counts for 48209 by tax_year, live.
- The other-counties partial-vintage sweep from item 4.
- Your pre-registered falsifier and whether it fired.
- `leave_behind`.
