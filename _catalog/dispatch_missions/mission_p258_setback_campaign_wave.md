## Mission — P-258: the setback acquisition campaign (a planner wave)

**FAN-DEPTH 1.** You are a wave planner. You may launch sub-agent lanes, one level deep; your
lanes launch none. Keep the wave to six lanes or fewer. You own the fan: every lane you launch
reports to you, you read each lane's diff and evidence yourself, and you do not end your turn
while a lane is still running (poll with a bounded loop; no notification will arrive).

### The goal

Every zoned (city, district) unit in the six counties has its dimensional table on file in the
setback corpus, verbatim, with a citation and an effective date read at source; every city is
classified; and every unit that cannot be acquired carries a signed, sourced
declared-unacquirable note. This is the longest task before Burnet (scope rev 4 section 12).

### The worklist (measured, not estimated)

Read `_inbox/2026-09-16_setback_parcel_census.json` (P-255, live run 2026-09-16T18:15Z) and
`_inbox/2026-09-16_texas_scaleup_program_scope.md` section 2b and section 4.1.

- **Half A, district misses in wired cities:** the `districtMissCodes` entries whose
  `plannedDevelopment` is false: **209 (city, code) units, 63,487 parcels.** Largest first:
  Austin SF-4A (15,664), Austin CS (4,111), Austin SF-6 (2,951), then Waco O-2, C-3, M-2, C-2,
  O-3, Round Rock, Leander, Kyle, Cedar Park, Hutto, Bastrop.
- **Half B, the 54 no-table cities (94,260 parcels):** the `noTableCities` lists, McLennan
  heaviest (19 cities, 33,139 parcels), then Travis (17), Williamson (8), Hays (8), Caldwell (6),
  Bastrop (3).
- **Out of scope for this wave:** the 61,725 planned-development parcels (PUD, PDD, PD, PC); A-164
  answers them with the PUD message (P-256, P-257). Austin's source layer and base-code parser
  (the `CS` versus `CS-1` problem) are P-259; you may add Austin table rows, but do not change
  the Austin zoning adapter.

Suggested lanes (adjust to what you find, and say why):
1. Austin district tables (Travis and Williamson parts).
2. Waco and the other McLennan district misses.
3. The other wired-city district misses (Round Rock, Leander, Kyle, Cedar Park, Hutto, Bastrop,
   Lockhart, Buda, Dripping Springs, San Marcos, Pflugerville).
4. McLennan's 19 no-table cities.
5. Travis's 17 no-table cities.
6. The remaining no-table cities (Williamson, Hays, Caldwell, Bastrop), plus Smithville under
   the eCode360 scrape ruling and Lockhart's replacement source or declared-unacquirable note.

### The rules every lane follows

1. **Classify each city** as one of four:
   - (1) zoned with a staged layer;
   - (2a) zoned, with an undocumented queryable endpoint to find;
   - (2b) zoned, with a map published only as a PDF;
   - (3) unzoned.

   A public-source sample of seven found six zoned, so expect category 3 to be rare.
2. **Per (city, district) unit, four steps:**
   - locate the governing instrument and its effective date at source (most-current-wins,
     `_decisions/2026-09-11_setback_source_most_current_wins.md`; an unreadable date is a
     conflict row, never a pick);
   - determine what the official map is;
   - find the endpoint, or fail and record the sources tried;
   - extract the table verbatim with its citation and date: front, side, rear, corner, height,
     coverage, footprint.
3. **The work lands as legacy-design-tools PRs** against `lib/adapters/src/local/setbacks/` and
   `@empressaio/setback-corpus`, following the existing file shape, with the corpus's own
   row-verification step. One PR per lane. No lane merges or deploys.
4. **Never fabricate.**
   - A code that is not in the ordinance is a note, not a row.
   - A category-3 city is a declaration for P-156, not a table.
   - Two-letter codes are real districts somewhere: Austin's RR is Rural Residence.
5. **"Not found" lists every source tried**: Municode, eCode360, American Legal, the city's
   document centre, and an ArcGIS REST search.
6. **No store writes.** The factory writer re-run that turns these rows into cells comes after
   P-256, and the integration seat runs it.

### Your wave artifact

`_inbox/<date>_p258_worklist.json` on your seat branch: one entry per city and per unit, with
category, instrument, effective date, endpoint result, state (acquired | declared-unacquirable |
blocked), PR, and the sources tried. The integration seat re-runs P-255's census after the
writer run; the census is the grade.

### Falsifiers, pre-register your answers first

1. Every one of the 209 units and 54 cities appears in the worklist with a state; none is
   silently missing.
2. Every acquired row cites an instrument and an effective date read at source.
3. No planned-development code gets a Euclidean table row.

### Close

Snapshot per repo; the worklist; each lane's PR with its CI conclusion strings; counts by state;
`subAgents` (spawned, maxDepth 1). `status`: `closed-partial` until the PRs merge and the writer
re-run shows the census moving. `probe`: `{"notApplicable": "acquisition wave; graded by the
census after the writer run"}`. `leave_behind`.
