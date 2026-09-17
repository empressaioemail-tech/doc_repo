## Mission — P-259: Austin's zoning comes from the public layer, through a base-code parser that never guesses

You launch no sub-agents (FAN-DEPTH 0). You build in `legacy-design-tools` and open a PR. You may
run the zoning stamp as a dry run; you do not apply it to any store.

### Where you work

`legacy-design-tools`, fresh clone from `origin/main` under `P:/tmp/` into a NEW directory,
branch `feat/p259-austin-zoning-source`. Declare the start commit (LDT main `44029db` at compile).
Register it under the property seat and remove the entry at close. Other LDT lanes may be open:
P-297 (serve cutovers, `parcelRecordAllowlist.ts`, `cadRollFactFromParcelRecord.ts`), P-299
(`buildableEnvelope/derive.ts`, `routes/localSetbacks.ts`, the setback table JSON), P-249
(`buildableEnvelope/`). You work in the zoning acquisition path (`lib/cad-ingest/src/txgio/`,
`jurisdictions.ts` and the zoning layer registry) and touch none of theirs.

### The finding (A-164, measured live 2026-09-15, anonymously)

Austin's public org `0L95CJ0VTaxqcmED` serves
`PLANNINGCADASTRE_zoning_large_map_scale/FeatureServer/0` at HTTP 200 with 22,504 zoning
polygons, spatial reference wkid 102739 (latestWkid 2277, state plane feet), and fields
`ZONING_BASE` and `ZONING_ZTYPE`. `ZONING_BASE` collapses codes (`SF` and `MF` with no numeric
suffix) and cannot be used. `ZONING_ZTYPE` carries compound values that append overlays and
combining districts (`SF-3-HD-NP`, `MF-4-H-CO`, `CS-1-MU-V-NCCD-ETOD-DBETOD-NP`), so the base code
must be parsed off a prefix, and a naive split on `-` yields `CS` where the base is `CS-1`.
P-258 added `SF-6` and other Austin rows to the setback table (28 rows; `austin-tx` now has 37
districts). The P-255 census line for Austin is in `_inbox/2026-09-16_setback_parcel_census.json`.

### What to build

1. **The source.** Austin's zoning layer registered from the public `PLANNINGCADASTRE` endpoint,
   with the projection handled explicitly (read the layer's spatial reference; never assume), the
   `ZONING_ZTYPE` field, and the layer's own last-edit date recorded as the vintage (read at source,
   per the most-current-source ruling).
2. **The parser.** A base-code parser that matches the longest known base district in Austin's
   setback table (so `CS-1-MU-...` yields `CS-1`, `SF-3-HD-NP` yields `SF-3`), and that returns an
   explicit "unrecognised base" result, never a truncated guess, when no known base prefixes the
   value. Overlay and combining suffixes are carried separately, not discarded, so a later ruling
   can use them. Planned-development codes route to the PUD message (A-164).
3. **Fixtures**, including every compound code A-164 names and at least 20 real `ZONING_ZTYPE`
   values sampled from the live layer (record the sample and its fetch time).
4. **A dry run** of the zoning stamp for Austin's parcels in Travis (and Williamson and Hays where
   Austin's jurisdiction reaches), reporting how many parcels would get a base district, how many
   would be unrecognised, and the distribution by base code, compared against Austin's census
   line.

### Falsifiers, pre-register your answers first

1. `CS-1-MU-V-NCCD-ETOD-DBETOD-NP` parses to `CS-1`, never `CS`.
2. A value whose prefix matches no table district returns "unrecognised", not a shorter match.
3. The dry run's recognised count for Travis is within the census's Austin district-miss
   population, and every unrecognised code is listed.
4. Removing the longest-match rule fails a fixture.

### Do not

- Apply the stamp to any store, or change any setback table.
- Touch the P-297, P-299 or P-249 files.
- Launch sub-agents.

### Close

Snapshot; files touched; the PR with every CI check's literal conclusion string; the live sample;
the dry-run table; the four falsifiers with evidence. `status`: `closed-partial` until the stamp is
applied and P-255's census re-run shows Austin's district misses falling. `probe`:
`{"notApplicable": "build lane; graded by the census re-run after the stamp is applied"}`.
`subAgents`. `leave_behind`.
