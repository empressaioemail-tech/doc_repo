---
title: Assumption register and completeness inventory, hauska-factory parcel-record write paths
date: 2026-09-13
lane: PREBAKE-FAC
plan_row: P-181
status: active
last_updated: 2026-09-13
---

# Assumption register and completeness inventory, hauska-factory

## Snapshot

Repository `hauska-factory`, remote `https://github.com/empressaioemail-tech/hauska-factory.git`.
Everything below was read from `origin/main` at
`97b93877c1dbb5598942821a553e50d0d677a006` (short `97b9387`, tip commit
"fix(P-181): cadRoll postcondition samples nodes, not bare accounts, for gate-blocked
counties (#144)"). `git fetch origin` ran and advanced nothing; origin/main was already the
SHA the dispatch named. The tree at that SHA holds 330 files.

The local checkout at `P:\hauska-factory` is at `3653f1242695846d5ee1b06c3384b93b0fb1793e`,
"Initial commit", with no usable source. Nothing in this document was read from it. Every
citation came from `git show origin/main:<path>`, and every line number is a line number in
the blob at that SHA.

The compiled copy at `P:/tmp/parcel-record-js-22e71e1/rail-keys.js` (dated 2026-09-01) was
diffed against the repo blob. It agrees exactly on all 65 rail definitions, the access pairs,
`UNINCORPORATED_NOT_APPLICABLE_RAIL_KEYS` and `RAILS_V2_DECLARED_AHEAD`. The only difference
is that the compiled copy predates the `ZONING_VERDICT_FIELDS_RULED_OUT` export added
2026-09-02, which is a documentation constant no code reads. No rail-set disagreement exists
between the two. That is reported as a checked negative, not as an absence of checking.

### Files opened in full

`src/lib/parcel-record-engine/` complete: `rail-keys.js`, `cell-state.js`, `record-shape.js`,
`config.js`, `index.js`, `access-pair.js`, `companion-shapes.js`, `instantiate.js`,
`publish-gate.js`, `liveness.js`, `not-applicable-audit.js`, `load.js`, `gate-rail-cli.mjs`,
`ENGINE_PIN.json`.

Also in full: `src/jobs/publish-gate-sched.mjs`, `src/jobs/parcel-setback-cells.mjs`,
`src/jobs/parcel-envelope-cells.mjs`, `src/lib/setback-writer/setback-table-router.mjs`,
`src/lib/publish-readiness-gate.mjs`, `src/lib/county-rail-coverage.mjs`,
`src/ledgers/cells.mjs`, `src/ledgers/indicators.mjs`,
`scripts/check-parcel-record-schema-drift.mjs`, `test/pin-divergence.test.mjs`,
`.github/workflows/ci.yml`, `package.json`, `Dockerfile` argument block.

### Files opened in part, with the part named

`src/jobs/parcel-record-fill.mjs` (module header and constants 1 to 170, null-at-source map
175 to 243, SQL constants 245 to 350, incorporation and jurisdiction ingest 470 to 560,
upsert and count block 690 to 900, `fillCountyWide` 900 to 995, tail 1100 to 1225).
`src/jobs/parcel-r5-zoning.mjs` (header 1 to 110). `src/jobs/owner-rail-collision-check.mjs`
(header 1 to 200). `src/jobs/parcel-max-impervious-cover.mjs` (scoping and terminal-state
map). `src/jobs/verify-walk.mjs` (header 1 to 45). `src/config/zoning-layer-completeness.mjs`
(export index and the two declaration tables). `src/control/writer-allowlist.mjs` (head).
`scripts/check-live-job-has-config.mjs` (header).

### One method note that is part of the claim

A `grep -c 'kind: "value"'` was run across all 54 files in `src/jobs/` to decide which
writers to read. It is a selector, never evidence. Text search cannot answer a reachability
question, and no vacuity claim below rests on it. Where this document says a branch is or is
not reachable, the branches were read.

### Headline answer on vacuous write paths

No cell writer in hauska-factory is vacuous. `parcel-setback-cells.mjs` and
`parcel-envelope-cells.mjs`, the two closest analogues to `computeTier1Envelope`, both have
reachable `kind:"value"` branches through `@empressaio/setback-corpus`, a real `^1.1.0`
dependency in package.json. That is reported first because it is the question the mission
ranked highest and the answer is a negative.

The vacuity is in the GATES and in one CI test. Four separate mechanisms in this repo run,
report success, and are structurally incapable of failing for the reason they name.

---

## Section A, assumption register

Rows are ordered with silent failures and guards that cannot fire first, per the mission's
rule 1.

### A.1 Gates that pass on total absence

```
ID: FAC-01
BELIEF: A rail with zero earned cells was never attempted, so it is safe to pass.
WHERE: src/lib/parcel-record-engine/publish-gate.js:72-84 in evaluateRailGate
  const live = cells.some((c) => isEarnedCell(c.state));
  if (!live) {
    return { ok: true, railKey, cellCount: cells.length, unaccountedCount: 0,
             unaccountedSamples: [], excludedDeclaredAhead: [railKey] };
FAILURE MODE: vacuous-write (a gate returning a verdict it cannot have earned)
GUARDED: none. The early return precedes every unaccounted count.
KNOWN VIOLATORS: structural, every county x rail pair whose writer has never run.
  publish-readiness-gate.mjs:133 records the live shape: 46 of the 48 newly graded rails
  carry no verdict row at all, and this is the branch they would take.
PRE-FILL DETECTABLE: yes. Join the rail to the Factory `runs` table and ask whether a writer
  for it ever terminated 'succeeded' for that county. Zero earned cells AND zero successful
  runs is declared-ahead; zero earned cells WITH a successful run is a writer that produced
  nothing, which is the defect. liveness.js:6-7 names this gap in its own header
  ("derivation cannot distinguish never-sourced from sourced-but-failed-everywhere. The run
  ledger is the backstop") and nothing joins the backstop.
CONFIDENCE: read-at-source
```

```
ID: FAC-02
BELIEF: excludedDeclaredAhead length alone decides the stored verdict.
WHERE: src/jobs/publish-gate-sched.mjs:266-271 in toGateVerdictKind
  if (engineVerdict.excludedDeclaredAhead && engineVerdict.excludedDeclaredAhead.length > 0)
    return "excluded";
FAILURE MODE: silent-wrong-value (three distinct states stored as one token)
GUARDED: none. 'excluded' is written to parcel_gate_verdict and read downstream as clean:
  publish-readiness-gate.mjs:364-365 states that "'pass' and 'excluded' both clear".
KNOWN VIOLATORS: a rail that regresses to zero earned cells after a writer regression reads
  identically to a rail nobody has built.
PRE-FILL DETECTABLE: yes. Diff the current verdict against the previous one for the same
  (county, rail). A pass-to-excluded transition is a regression and is currently invisible,
  because the upsert at publish-gate-sched.mjs:273-278 overwrites in place and keeps no
  prior verdict.
CONFIDENCE: read-at-source
```

```
ID: FAC-03
BELIEF: evaluatePublishGate's full-rail-poison warning will fire when a rail goes from live
  to fully unaccounted.
WHERE: src/lib/parcel-record-engine/publish-gate.js:27-39
  const priorLive = new Set(options.priorLiveRailKeys ?? []);
  for (const railKey of excludedDeclaredAhead) { if (!priorLive.has(railKey)) continue; ...
FAILURE MODE: vacuous-write. The mechanism exists, its logic is correct, its input is never
  supplied, so it runs and emits an empty array every time.
GUARDED: n/a, it is the guard.
KNOWN VIOLATORS: every invocation. `git grep -n priorLiveRailKeys origin/main` returns
  exactly one hit, the read site above. No caller passes it.
PRE-FILL DETECTABLE: yes, trivially, by that grep. This is ENFORCEMENT.md's STARVED
  category, and it is the warning that would have caught FAC-02.
CONFIDENCE: read-at-source
```

```
ID: FAC-04
BELIEF: the engine module's county publish gate protects a publish.
WHERE: src/lib/parcel-record-engine/publish-gate.js:56-61 assertPublishableCounty, and
  publish-gate.js:9 evaluatePublishGate.
FAILURE MODE: vacuous-write (dormant: no trigger)
GUARDED: n/a.
KNOWN VIOLATORS: `git grep -n assertPublishableCounty origin/main` returns two hits, the
  definition and the index.js:11 re-export. Zero callers. `evaluatePublishGate` has exactly
  one non-test call site, parcel-record-fill.mjs:1144, inside the `--poison-place` self-test
  branch that corrupts one cell and refuses POISON_GATE_VACUOUS if the gate does not flip.
  That self-test is correct practice and it is the only thing the whole-record gate does in
  this repo. The gate that runs at publish time is publish-readiness-gate.mjs, which reads
  parcel_gate_verdict rows rather than records.
PRE-FILL DETECTABLE: yes, by call-site enumeration.
CONFIDENCE: read-at-source
```

```
ID: FAC-05
BELIEF: the not-applicable audit will catch an unearned not-applicable stamp.
WHERE: src/lib/parcel-record-engine/not-applicable-audit.js:49-55, the `passes` predicate,
  which requires totalNotApplicable to be an exact integer multiple of the unincorporated
  parcel count and every stamped row to carry incorporated=false.
FAILURE MODE: vacuous-write (dormant: no trigger)
GUARDED: n/a.
KNOWN VIOLATORS: `git grep -n auditNotApplicableCells origin/main` returns two hits, the
  definition and the index.js:14 re-export. Zero callers in src, scripts or test. This is
  the one instrument that could detect a not-applicable stamp landing on a parcel that is
  not unincorporated, and nothing invokes it.
PRE-FILL DETECTABLE: yes, by call-site enumeration.
CONFIDENCE: read-at-source
```

```
ID: FAC-06
BELIEF: an empty population is a case the pre-bake gate will refuse.
WHERE: src/lib/publish-readiness-gate.mjs:192-204, where evaluateOverlap returns
  `{ code: "EMPTY_DENOMINATOR" }` on an empty want-set, and evaluatePopulation (224-287),
  which branches only on `code === KEYSPACE_MISMATCH` or `code === "OK"`.
  BAKE_POPULATION_MISSING at 224 requires `roll.size > 0`.
FAILURE MODE: vacuous-write. A county with zero cad_property rows and zero
  landing_parcel_jurisdiction rows falls through all three gated comparisons and returns
  `ok: true`.
GUARDED: partial, and inverted. A PARTIALLY short county refuses at MIN_INSTANTIATION_RATIO
  0.99; a TOTALLY empty one passes.
KNOWN VIOLATORS: none observed live, because the six CTX counties are all populated. That is
  precisely why it has never been seen. The check has been observed only passing.
PRE-FILL DETECTABLE: yes. Assert `roll.size > 0 && landing.size > 0` before anything else
  and refuse EMPTY_POPULATION under its own code. One line, and it is the difference between
  "we measured nothing" and "we measured and it was clean", which ENFORCEMENT.md names as two
  of three different states.
CONFIDENCE: read-at-source. The chain was traced link by link rather than inferred:
  EMPTY_DENOMINATOR falls through all three refusals; loadCountyRailCells' own guard
  (load.js:145, `cells.length !== parcelRowCount`) is `0 !== 0`, which is false;
  evaluateRailGate([]) takes FAC-01's branch because `[].some(...)` is false and returns
  excluded; evaluatePreBakeReadiness (publish-readiness-gate.mjs:367-385) refuses only on a
  MISSING row or a 'refuse' verdict, so 'excluded' clears. An empty county therefore produces
  65 clean 'excluded' verdicts and a passing pre-bake gate, with no error anywhere.
```

### A.2 Checks whose input is the thing they check

```
ID: FAC-07
BELIEF: parcel_record at 99 percent of landing_parcel_jurisdiction proves the county filled.
WHERE: src/lib/publish-readiness-gate.mjs:268-287, the RECORD_FILL_SHORT comparison, over
  LANDING_SQL (322) and RECORD_SQL (323).
FAILURE MODE: silent-skip. landing_parcel_jurisdiction is parcel-record-fill's own INPUT
  (parcel-record-fill.mjs:252-257 LANDING_PAGE_SQL) and its own reported denominator
  (874-885, `denominator: landing.n` from LANDING_COUNT_SQL over the same table). Three of
  the pipeline's figures read one table, so a short landing ingest produces a short fill, a
  short denominator and a passing gate at the same time.
GUARDED: no. The file states the property itself at lines 30-36: parcel_record equals
  landing_parcel_jurisdiction EXACTLY in all six counties, 100.00 percent overlap in every
  one. A check structurally guaranteed to read 100 percent is not measuring fill.
KNOWN VIOLATORS: unknown, and unknowable from inside this pipeline, which is the point.
PRE-FILL DETECTABLE: yes, but only with a source outside the landing pipeline. Section B.1
  names it.
CONFIDENCE: read-at-source
```

```
ID: FAC-08
BELIEF: a county-wide fill that completes its page loop has written the county.
WHERE: src/jobs/parcel-record-fill.mjs:904-939 fillCountyWide, returning at 960-971.
  `recordsWritten` and `landing.n` are both in the return object and are compared to each
  other nowhere in the function or its caller.
FAILURE MODE: silent-skip. The loop exits on `rows.length === 0` or `rows.length < pageSize`
  and nothing asserts the accumulated record count against the denominator the manifest
  declared at the top of the same function.
GUARDED: none in this job. The nearest guard is FAC-07's, which runs at publish time against
  the same table and therefore cannot see a shortfall relative to that table either.
KNOWN VIOLATORS: none proven; the instrument to prove one does not exist.
PRE-FILL DETECTABLE: yes. `assert recordsWritten === landing.n` at the end of fillCountyWide,
  refusing FILL_SHORT with both numbers, costs nothing and is a real postcondition on this
  job's own declared denominator. It would not catch a short landing table; it would catch a
  page loop that terminated early.
CONFIDENCE: read-at-source
```

```
ID: FAC-09
BELIEF: prop_id is unique within a county in landing_parcel_jurisdiction, so keyset
  pagination on it is lossless.
WHERE: src/jobs/parcel-record-fill.mjs:252-257 LANDING_PAGE_SQL (`WHERE county_fips = $1 AND
  prop_id > $2 ORDER BY prop_id LIMIT $3`) with the cursor advance at 908
  (`after = String(rows[rows.length - 1].prop_id)`).
FAILURE MODE: silent-skip. If a prop_id carries two rows and a page boundary lands on it, the
  strict `>` advance drops the second. The fill then instantiates one record where the layer
  holds two entries, and FAC-07's check cannot see it, because it compares DISTINCT prop_id
  sets, which are equal either way.
GUARDED: none. No unique constraint on (county_fips, prop_id) is asserted anywhere this lane
  opened.
KNOWN VIOLATORS: none established. This is a shape risk, not an observed defect.
PRE-FILL DETECTABLE: yes. `SELECT county_fips, prop_id, count(*) FROM
  landing_parcel_jurisdiction GROUP BY 1,2 HAVING count(*) > 1` answers it in one query
  before any fill. The answer is either zero rows, in which case the assumption is proven and
  should become a constraint, or it is the size of the silent loss.
CONFIDENCE: inferred. The paging code was read at source; key uniqueness was not verified,
  because this lane has no database access. Scored accordingly.
```

### A.3 Fabricated absences, the class that makes a rail read live

```
ID: FAC-10
BELIEF: a district code the router cannot match means the parcel has no setback requirement.
WHERE: src/jobs/parcel-setback-cells.mjs:258-272 in buildResolvedCells
  if (!resolved.ok) { ... const scalarState = JSON.stringify({ kind: "absent-verified", basis });
  where `basis.finding = resolved.reason`, one of SETBACK_ROUTER_NOT_A_TABLE or
  SETBACK_ROUTER_NOT_A_DISTRICT (setback-table-router.mjs:165-183).
FAILURE MODE: silent-wrong-value, and the most consequential one in this review.
  SETBACK_ROUTER_NOT_A_DISTRICT means our matcher failed to map a stamped zoning code onto a
  row in our table. It does not mean the district has no setbacks. Writing absent-verified
  converts a matcher miss into a positive claim that we looked and there is nothing, which
  ENFORCEMENT.md names exactly ("absent-verified is a claim that something looked; writing it
  where nothing looked is a lie that passes every check").
GUARDED: none, and it compounds. absent-verified is in EARNED_CELL_KINDS (cell-state.js:7),
  so these cells make the setback rails read LIVE, which lets evaluateRailGate reach a real
  'pass', which lets the rail serve. A matcher miss becomes a served "no setback requirement".
KNOWN VIOLATORS: none enumerated live, but the matcher is fragile by construction. It takes
  the leading whitespace token of `district_name` as the code (setback-table-router.mjs:90-93)
  and normalizes by stripping every non-alphanumeric character. A corpus table whose
  district_name does not lead with its code yields NOT_A_DISTRICT for every district in that
  jurisdiction, which writes absent-verified across the whole city.
PRE-FILL DETECTABLE: yes, and cheaply. Before writing anything, resolve every DISTINCT
  (jurisdictionKey, zoningDistrict value) pair through resolveSetbackForParcel and print the
  decline census by reason. A jurisdiction with a ruled table and a 100 percent NOT_A_DISTRICT
  rate is a parsing defect, not an absence, and it is visible before a single cell moves.
CONFIDENCE: read-at-source
```

```
ID: FAC-11
BELIEF: no ruled table in our corpus for this city means this city's parcels have no setbacks.
WHERE: src/jobs/parcel-setback-cells.mjs:206-222 buildNoRuledTableCells, writing
  `{ kind: "absent-verified", basis: { ... finding: "no ruled setback table exists for
  <jurisdictionKey>" } }` on all four setback scalars plus the setbackRules companion, for
  every in-city parcel of that city. Same shape at src/jobs/parcel-envelope-cells.mjs:345-361
  (noRuledTableCells) for maxHeightFt, maxLotCoveragePct and maxFootprintSqFt.
FAILURE MODE: silent-wrong-value, at city scale. The basis string is honest about what was
  probed; the cell KIND is not. The finding is about our corpus and absent-verified is a
  statement about the world.
GUARDED: none.
KNOWN VIOLATORS: every in-city city in the five in-scope counties that is not one of the 29
  jurisdictions the corpus carries. The count is not derivable offline.
PRE-FILL DETECTABLE: yes. loadCityRuledTableIndex (parcel-setback-cells.mjs:188-199) already
  computes `ruled` per city and already has that city's in-city parcel count in the same row.
  Printing that table before apply shows exactly how many parcels are about to be told they
  have no setbacks because of a gap in our own corpus.
CONFIDENCE: read-at-source
```

```
ID: FAC-12
BELIEF: a city's corpus key is its slugified name plus "-tx", except for two named cities.
WHERE: src/jobs/parcel-setback-cells.mjs:129-141
  const CITY_JURISDICTION_KEY_OVERRIDES = { Bastrop: "bastrop-development-code",
    Elgin: "elgin-development-code" };
  export function slugifyCityName(cityName) {
    return `${cityName.trim().toLowerCase().replace(/\s+/g, "-")}-tx`; }
FAILURE MODE: silent-wrong-value. A key-shape mismatch makes `hasRuledTable` false, the city
  falls into FAC-11, and every parcel in it is written absent-verified at full confidence with
  a basis naming the key we guessed.
GUARDED: none. The overrides are a hand-maintained list of two.
KNOWN VIOLATORS: none established from outside the corpus package. Any city whose corpus key
  carries a suffix, a county qualifier, or a different separator is a violator.
PRE-FILL DETECTABLE: yes, and this is the strongest cheap probe available. The corpus can be
  enumerated. Compare the keys the corpus actually publishes against the candidate keys
  derived from the live city_name list, and print BOTH sides: the unmatched cities and the
  unused corpus tables. An unused corpus table is positive evidence of a naming miss, because
  it means we shipped a ruled table for a jurisdiction the writer never asks for. That is an
  independent derivation and nothing runs it.
CONFIDENCE: read-at-source
```

```
ID: FAC-13
BELIEF: every parcel has an area, so a parcel with no geometry row is an absence.
WHERE: src/jobs/parcel-envelope-cells.mjs:237-241 parcelAreaCellState
  if (!areaResult) { return { kind: "absent-verified", basis: { method: "ST_Area(geography)
    over ST_MakeValid(ST_Union(...)) of txgio_parcel fragments",
    finding: "no usable txgio_parcel geometry for this prop_id", vintage } }; }
FAILURE MODE: silent-wrong-value. `parcelAreaSqFt` is a rail that cannot be genuinely absent:
  land has an area. The true state is unmeasured, which the vocabulary already has a word for.
  The basis is honest and the kind is a category error, and because absent-verified is earned,
  it makes the rail read live.
GUARDED: none. Note the narrowing at line 230: the area is accepted only when
  `Number.isFinite(areaM2) && areaM2 > 0`, so a degenerate or zero-area geometry also lands
  here, collapsing "no geometry" and "broken geometry" into one absence.
KNOWN VIOLATORS: every in-city parcel with no txgio_parcel row, plus every parcel excluded by
  PARCEL_AREA_SQL's own filters (`prop_id <> '0'`, `geometry IS NOT NULL`,
  parcel-envelope-cells.mjs:163-169).
PRE-FILL DETECTABLE: yes. Count in-city parcels with no matching txgio_parcel row before the
  run. That number is the population about to receive a fabricated absence, and it is one
  anti-join.
CONFIDENCE: read-at-source
```

### A.4 Provenance that can lie

```
ID: FAC-14
BELIEF: the corpus version written into every setback and envelope cell is the version loaded.
WHERE: src/lib/setback-writer/setback-table-router.mjs:39-40
  export const CORPUS_PACKAGE = "@empressaio/setback-corpus";
  export const CORPUS_VERSION = "1.1.0";
  consumed at parcel-setback-cells.mjs:201-203 (`${CORPUS_PACKAGE}@${CORPUS_VERSION}:${key}`)
  and parcel-envelope-cells.mjs:205-207, stamped into `source` on every value cell and into
  `basis.corpusVersion` on every absent-verified cell.
FAILURE MODE: silent-wrong-value. package.json declares `"@empressaio/setback-corpus":
  "^1.1.0"`, so any 1.x resolves at install time while the stamp stays frozen at the literal
  string 1.1.0. A cell then claims a provenance it does not have, and MOST-CURRENT-SOURCE-WINS
  adjudication downstream would compare against a version label that was typed, not read.
GUARDED: none. This is the hand-declared-versus-derived shape.
KNOWN VIOLATORS: none today, if the lockfile pins 1.1.0. The defect is that nothing makes that
  true tomorrow.
PRE-FILL DETECTABLE: yes. Read the version from the package's own manifest at runtime rather
  than declaring it, or assert the constant against the resolved version at startup and refuse
  on mismatch. Either is a few lines.
CONFIDENCE: read-at-source
```

```
ID: FAC-15
BELIEF: a district matched by code prefix is the same kind of claim as one matched exactly.
WHERE: src/lib/setback-writer/setback-table-router.mjs:151-156 in mapDistrict, returning
  `kind: "matched", confidence: 0.9` for an exact hit and `kind: "matched", confidence: 0.7`
  for a prefix hit, and 197-218, whose `rule` object carries `matchKind: mapped.kind` and
  drops `mapped.confidence` entirely. The persisted companion payload at
  parcel-setback-cells.mjs:310-323 carries `matchKind: rule.matchKind` and `note: rule.note`,
  where `rule.note` is the TABLE's note, not `mapped.note`.
FAILURE MODE: silent-wrong-value. Both matches persist as "matched". A parcel zoned R-1A
  served R-1's numbers is indistinguishable in the store from a parcel whose district was
  found exactly, and the confidence figure that distinguished them is computed and discarded.
GUARDED: partial. `isSafePrefixMatch` (106-109) refuses one-character tokens, which blocks the
  worst collapse the port's own comment names. It does not preserve the distinction it makes.
KNOWN VIOLATORS: every suffixed district variant in every ruled city.
PRE-FILL DETECTABLE: yes. Census the DISTINCT (jurisdictionKey, districtCode) pairs by match
  kind before writing. The prefix-matched share is the population whose setbacks are an
  inference rather than a lookup.
CONFIDENCE: read-at-source. This is also the commitment-two shape: a confidence signal exists
  upstream and is dropped before persistence, so nothing downstream can ever calibrate it.
```

### A.5 Counts that report intentions rather than writes

```
ID: FAC-16
BELIEF: the per-city counters a fill job prints describe what it wrote.
WHERE: src/jobs/parcel-setback-cells.mjs:379-380 (`if (built.cells[0] && JSON.parse(
  built.cells[0].cellState).kind === "value") counts.value += 1;`) and 414
  (`return { cellsMoved, counts, candidateCells: cellBatch.length };`), with the caller at
  473-480 accumulating `cellsMoved` and `counts` and DISCARDING `candidateCells`. Same shape
  at parcel-envelope-cells.mjs:557 and 627-635.
FAILURE MODE: silent-wrong-value in the report, not in the store. `counts` is computed from
  the batch the job BUILT; `cellsMoved` is the row count the gated UPDATE actually moved
  (UPDATE_SETBACK_CELLS_SQL matches only `cell_state ->> 'kind' = 'unaccounted'`). The two can
  diverge arbitrarily and nothing compares them.
GUARDED: no. `candidateCells` is returned by the page function specifically so it could be
  compared, and the caller drops it.
KNOWN VIOLATORS: every re-run, by design, since already-earned cells are correctly skipped.
  The defect is that a run where the place_key shape does not match, and therefore NOTHING
  moves, prints the same large `value=N` as a successful first run.
PRE-FILL DETECTABLE: partly, and post-write completely. Accumulate candidateCells and log
  `cellsMoved / candidateCells` per city. On a first fill that ratio should be near one; a
  ratio of zero with a large candidate count is a join-key mismatch and today it is invisible.
  Pre-fill, the same question is answered by checking that a sample of
  `${county_fips}:${prop_id}` keys built from landing actually exist in parcel_record.
CONFIDENCE: read-at-source
```

```
ID: FAC-17
BELIEF: a cell that says `disposition: "rows", rowCount: 1` has a companion row behind it.
WHERE: src/jobs/parcel-setback-cells.mjs:388-411, which issues UPDATE_SETBACK_CELLS_SQL, then
  DELETE_COMPANION_ROWS_BATCH_SQL, then INSERT_COMPANION_ROWS_BATCH_SQL as three separate
  `factory.query` calls, with no BEGIN or COMMIT anywhere in the file.
FAILURE MODE: silent-wrong-value. A failure between the delete and the insert leaves the
  scalar cell earned and pointing at zero rows. On the pg client's default autocommit each
  statement commits independently.
GUARDED: partial, and in the right spirit: the rows written are filtered to the place_keys
  whose companion CELL actually moved (396-398), so the pointer and the rows agree about WHICH
  parcels. They can still disagree about whether rows exist at all.
KNOWN VIOLATORS: none observed.
PRE-FILL DETECTABLE: no, this one is post-write. The check is an anti-join: companion cells
  claiming rowCount >= 1 with no matching parcel_record_companion_row. Nothing runs it.
CONFIDENCE: read-at-source for the statement sequence; inferred that no outer transaction is
  opened, since runParcelSetbackCells was read in full and opens none.
```

### A.6 One-way stamps and permanent claims

```
ID: FAC-18
BELIEF: landing_parcel_jurisdiction's disposition is correct at instantiate time, forever.
WHERE: src/lib/parcel-record-engine/instantiate.js:29-33
  if (input.incorporated === false && NOT_APPLICABLE_RAIL_SET.has(railKey)) { ... }
  fed by src/jobs/parcel-record-fill.mjs:478-482 incorporatedFromDisposition, over
  UNINCORPORATED_NOT_APPLICABLE_RAIL_KEYS (rail-keys.js:94-113), 18 rails.
FAILURE MODE: silent-wrong-value, permanent. A parcel misclassified unincorporated gets 18
  zoning and envelope rails stamped not-applicable at row creation. Every downstream writer
  moves only cells currently `unaccounted` (UPDATE_SETBACK_CELLS_SQL:168,
  UPDATE_ENVELOPE_CELLS_SQL:193-197, parcel-r5-zoning's stated convention), and
  UPSERT_CELLS_BATCH_SQL (parcel-record-fill.mjs:737-754) refuses to downgrade a
  non-unaccounted cell. No ordinary path can ever revisit the stamp.
GUARDED: partial, and well. incorporatedFromDisposition returns null for 'unresolved' and for
  a missing landing row, and null does not trigger the stamp, so the ambiguous case fails
  closed to unaccounted. The guarded case is ambiguity; the unguarded case is confident
  wrongness.
KNOWN VIOLATORS: none enumerated. The stamp's correctness is entirely the jurisdiction layer's
  correctness.
PRE-FILL DETECTABLE: yes, and FAC-05's dormant audit is one instrument. A second derivation
  already exists in this repo and is used for something else: verify-walk.mjs (header 35-45)
  re-derives city-limits containment against `landing_tx_city_boundary`, 1,222 rows, with a
  walk-side point-in-polygon. It is applied to SERVED parcels in a street sweep, never to the
  instantiate-time disposition of a county. Pointing it at the disposition column before a
  fill is the check.
CONFIDENCE: read-at-source
```

```
ID: FAC-19
BELIEF: a city declared complete on 2026-09-08 is still complete.
WHERE: src/config/zoning-layer-completeness.mjs:49-91, COMPLETENESS_RULE.measuredAt
  "2026-09-08" and DECLARED_COMPLETE, a hand-maintained table of 22 cities carrying cellPct,
  arealPct and a frozen layerVintage string (every one "arcgis-live:<city>:2026-08-12" or
  ":2026-08-14"), consumed by completenessNotApplicableState and written as a permanent
  not-applicable by parcel-r5-zoning's completeness sweep.
FAILURE MODE: silent-wrong-value, permanent, by FAC-18's one-way argument.
GUARDED: partial. The declaration is evidenced, carries its measurement date and its measuring
  scripts, and Elgin is EXPLICITLY_HELD rather than silently admitted, which is the right
  shape. What is missing is any trigger that re-validates a declaration against the live layer
  or expires one.
KNOWN VIOLATORS: none proven. Bastrop is declared complete at 99.24 percent cell coverage and
  69.53 percent areal coverage. Those two numbers are consistent with "the unzoned 30 percent
  is genuinely unzoned land" and equally consistent with "the layer is missing polygons over
  30 percent of the city's area", and the declaration picks the first reading.
PRE-FILL DETECTABLE: yes. Re-read the layer's own `editingInfo.lastEditDate` at source and
  refuse a completeness declaration older than the layer edit that followed it. That is
  MOST-CURRENT-SOURCE-WINS applied to the declaration rather than to a value.
CONFIDENCE: read-at-source for the mechanism and the numbers; inferred for the areal reading,
  which is stated as two candidate mechanisms rather than one.
```

### A.7 Rails with no writer at all

```
ID: FAC-20
BELIEF: the four remaining envelope rails are pending, and the gate will say so.
WHERE: src/jobs/parcel-envelope-cells.mjs:6-18, stating that buildableAreaSqFt,
  buildableAreaPct, envelopeStatus and envelopeDisclosure are deliberately untouched and that
  "No code path in this file reaches those four rail keys."
FAILURE MODE: not a defect in the writer. The deferral is correct and correctly argued (the D1
  precedent: a value whose INPUT is missing stays unaccounted rather than becoming a written
  disposition). The defect is downstream: those four rails are permanently 100 percent
  unaccounted, so FAC-01 scores them 'excluded' and FAC-02 stores that token, which is the same
  token a regressed rail gets.
GUARDED: none for the ambiguity.
KNOWN VIOLATORS: four rails, all six counties, structurally.
PRE-FILL DETECTABLE: yes, by the same run-ledger join FAC-01 names. A rail with no writer
  registered in writer-allowlist.mjs is declared-ahead by construction and could be ASSERTED as
  such rather than inferred from an empty cell census.
CONFIDENCE: read-at-source
```

```
ID: FAC-21
BELIEF (STALE IN-REPO CLAIM): no job anywhere writes a real value for setbackFrontFt.
WHERE: src/jobs/publish-gate-sched.mjs:98-107, the SLATE_1C comment: "Confirmed by reading the
  whole repo: no job anywhere writes a real value for it on an incorporated parcel ... the
  writer-allowlist.mjs 'f11-setback' entry has no corresponding src/jobs/ file on this branch."
FAILURE MODE: silent-wrong-value in the repo's own reasoning. At this SHA
  src/jobs/parcel-setback-cells.mjs exists, is 524 lines, declares `JOB_ID = "f11-setback"`,
  and has a reachable value branch (buildResolvedCells 275-301, reached whenever
  resolveSetbackForParcel returns ok, which it can, because @empressaio/setback-corpus is a
  real ^1.1.0 dependency). The comment's stated REASON for excluding setbackFrontFt from a
  slate ("Needs a real setback writer before this is actionable") no longer holds.
GUARDED: incidentally. DEFAULT_SCHED_RAIL_KEYS was widened to all 65 rails at
  publish-gate-sched.mjs:187, so the scheduler grades setbackFrontFt regardless of what the
  comment says. The stale claim survives as reasoning a future lane will read and believe.
KNOWN VIOLATORS: the comment itself.
PRE-FILL DETECTABLE: not applicable. This is a documentation defect found by reading two files
  at one SHA and noticing they disagree.
CONFIDENCE: read-at-source
```

### A.8 The pin, and a CI step that cannot fail

```
ID: FAC-22
BELIEF: the repo has one engine pin.
WHERE: Dockerfile:3 `ARG ENGINE_SHA=a38cbb22eda23637d7a56e104456aa4e7237fc25` against
  src/lib/parcel-record-engine/ENGINE_PIN.json `"engineSha":
  "dfdf6fd0930b72d929f9a44834f9c33fb2d3eb75"`, and .github/workflows/ci.yml:33, which checks
  out hauska-engine at `a38cbb22eda23637d7a56e104456aa4e7237fc25`.
FAILURE MODE: silent-wrong-value. The vendored JavaScript that actually runs was compiled from
  dfdf6fd; the PIN file's own note describes the jump past PR #381 to dfdf6fd, dated
  2026-09-05. The schema-drift guard reads the DOCKERFILE's sha
  (check-parcel-record-schema-drift.mjs:22-27 readPinnedEngineSha) and CI supplies a38cbb2's
  schema.sql. The migration is therefore validated against an engine commit that is NOT the one
  the running code came from. Two numbers that should agree and do not.
GUARDED: no. Nothing asserts ENGINE_PIN.json's engineSha against the Dockerfile ARG.
KNOWN VIOLATORS: the repo at this SHA.
PRE-FILL DETECTABLE: not applicable. One assertion, `ENGINE_PIN.engineSha ===
  readPinnedEngineSha()`, would have caught it at any point since 2026-09-05.
CONFIDENCE: read-at-source
```

```
ID: FAC-23
BELIEF: readEngineSchemaAtSha reads the engine schema at a sha.
WHERE: scripts/check-parcel-record-schema-drift.mjs:43-47
  export function readEngineSchemaAtSha(engineSha, { engineRepo = ENGINE_REPO } = {}) {
    const sparsePath = join(engineRepo, ENGINE_SCHEMA_PATH);
    if (existsSync(sparsePath)) { return normalizeSql(readFileSync(sparsePath, "utf8")); }
FAILURE MODE: silent-wrong-value. When the path exists the function ignores `engineSha`
  entirely and reads a WORKING TREE file, then the caller reports the result as
  `engine@${pinnedSha}` (line 77). The default ENGINE_REPO is
  `P:/seat-worktrees/property/hauska-engine`, another seat's checkout, which may be dirty, on
  another branch, or mid-rebase. ENFORCEMENT.md's "read the authoritative record, never a proxy
  for it" names this exact instance class.
GUARDED: no. The `git show` fallback at 48-53 does read the sha and is unreachable whenever the
  file is present, which on a seat is always.
KNOWN VIOLATORS: every local run on a seat carrying that worktree. In CI the sparse checkout at
  ci.yml:29-37 makes the path exist too, so CI takes the same branch; there it happens to be a
  clean checkout of a38cbb2, which is why the wrong read has never produced a wrong answer.
PRE-FILL DETECTABLE: not applicable. The fix is to delete the first branch and always resolve
  through `git show <sha>:<path>`.
CONFIDENCE: read-at-source
```

```
ID: FAC-24
BELIEF: the CI step named "pin SHA must not move while pin is the control" can detect a moved
  pin.
WHERE: test/pin-divergence.test.mjs:7 `const PINNED_SHA =
  "8f3c0e1d9a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d";` (40 hex characters) and 31-45, run as its own CI
  step at .github/workflows/ci.yml:55-56.
FAILURE MODE: vacuous-write, and the cleanest instance in the repo. On CI, `findPin()` returns
  null because P:/doc_repo does not exist on ubuntu-latest, so the test takes the fixture branch
  and asserts `assert.notEqual(createHash("sha256").update("moved").digest("hex"), PINNED_SHA)`.
  That compares a 64-character hash against a 40-character literal, which can never be equal, so
  the assertion is a tautology. On a machine where the pin file DOES exist, the branch never
  references PINNED_SHA at all and asserts only `typeof current === "string"` and
  `current.length === 64`, which are properties of sha256 itself and hold for any file content
  whatsoever.
GUARDED: n/a, it is the guard.
KNOWN VIOLATORS: every run, in both branches. The step is ARMED, with a real CI trigger, and
  cannot fail for the reason it names. That is worse than dormant, because its green check
  answers "do we have this" affirmatively.
PRE-FILL DETECTABLE: not applicable. Per ENFORCEMENT.md, verify by violating: change the pin
  bytes and confirm the step goes red. It will not.
CONFIDENCE: read-at-source
```

### A.9 Instruments that disagree with each other

```
ID: FAC-25
BELIEF (TWO MODULES, ONE REPO, OPPOSITE READINGS): what parcel_record's coverage against
  cad_property means.
WHERE: src/lib/publish-readiness-gate.mjs:25-40 says comparing them "demands two different
  things be equal", that the six counties are "fully instantiated against their own intended
  population", and that the prior gate "would have refused Williamson at 46.9% and Caldwell at
  51.4% for an incompleteness THAT DOES NOT EXIST". src/lib/county-rail-coverage.mjs:13-19 says
  the opposite: cadPopulation "is the denominator, never parcel_record's own row count: live
  2026-09-07, parcel_record itself is only 46.9%-100% populated against the true roll across the
  six CTX counties, so a percentage computed against parcel_record's own count would silently
  hide the never-instantiated share of the county".
FAILURE MODE: silent-wrong-value in whichever is wrong, and a live external coverage figure
  either way, since county-rail-coverage-report is the instrument that publishes per-rail
  coverage percentages.
GUARDED: no. Nothing reconciles them and both are current at this SHA.
KNOWN VIOLATORS: the same 46.9 percent figure, read two ways.
PRE-FILL DETECTABLE: yes, and the resolution is a counting rule, not a new measurement. Both
  modules should quote their ratio with its denominator's definition attached, and the
  accounts-per-parcel hypothesis is directly testable: group cad_property by the parcel key and
  ask whether the excess accounts are condo-shaped (many accounts, one parcel id in the layer)
  or whether they are parcel ids ABSENT from the layer entirely. Those are different
  distributions and only one of them is "a parcel is not an account".
CONFIDENCE: read-at-source. Both quotations are verbatim. This lane does not adjudicate which
  is right; it reports both readings with the evidence for each, per ENFORCEMENT.md.
```

```
ID: FAC-26
BELIEF: assertIndicatorsVary proves the ledger's gating indicators are alive.
WHERE: src/ledgers/indicators.mjs:23-29
  const writers = new Set(cells.map((c) => String(c.hasWriter)));
  const families = new Set(cells.map((c) => String(c.atomFamilyState)));
  if (writers.size === 1 && families.size === 1) { throw BP-LEDGER-01 }
FAILURE MODE: silent-skip. The conjunction means a completely constant `hasWriter` passes as
  long as `atomFamilyState` varies, and the reverse. The meaning the check reaches for is "no
  indicator may be constant", which is a disjunction. This is the same dead-indicator class the
  repo already documented for county_rail (COUNTY_RAIL_LEDGER_DISPOSITION, index.js:29-33:
  has_writer=true on all 14 rows, zero variation).
GUARDED: n/a. Called once, at src/ledgers/manifest-read.mjs:151, so it is armed.
KNOWN VIOLATORS: not determinable offline; it depends on the live manifest.
PRE-FILL DETECTABLE: yes. Change the `&&` to `||` and run it against the current manifest. If it
  goes red, the indicator was dead and this check was hiding it.
CONFIDENCE: read-at-source
```

```
ID: FAC-27
BELIEF: not-applicable is as good as populated for a cell verdict.
WHERE: src/ledgers/cells.mjs:30
  if (states.every((s) => s === "populated" || s === "not-applicable")) return "satisfied";
FAILURE MODE: silent-wrong-value in the county grid. A cell every one of whose nodes is
  not-applicable reports "satisfied", which reads as coverage. Given FAC-18 and FAC-19,
  not-applicable is a stamp derived from a hand declaration and a disposition column, so a fully
  not-applicable cell is a claim rather than a measurement, and it is being counted as satisfied.
GUARDED: no.
KNOWN VIOLATORS: not determinable offline.
PRE-FILL DETECTABLE: yes. Report satisfied-populated and satisfied-not-applicable as two
  numbers. They are different states, and collapsing them is the move ENFORCEMENT.md's "absent,
  zero and unmeasured" section prohibits, applied to a third pair.
CONFIDENCE: read-at-source
```

```
ID: FAC-28
BELIEF: the owner cross-system collision check runs.
WHERE: src/jobs/owner-rail-collision-check.mjs:153, its own Triggers line: "Cloud Run job
  factory-parcel-owner --args=owner-rail-collision-check,--apply (proposed)".
FAILURE MODE: vacuous-write (dormant). This is the ONE job in the repo built on a genuinely
  independent third derivation. It never treats either side as ground truth and instead re-reads
  cad_property at an operator-supplied declared tax year, on the explicit reasoning (142-146)
  that "seeing two derived values disagree proves ONE of them is wrong, never which". It has a
  CLI entry point (src/cli.mjs:311) and no schedule.
GUARDED: it degrades honestly. With SUBSTRATE_DATABASE_URL unset it reports atomsReachable:false
  plus a named reason and still runs the actionable half, which is declared degradation and is
  correct behaviour.
KNOWN VIOLATORS: n/a.
PRE-FILL DETECTABLE: not applicable. The gap is a trigger, not a probe.
CONFIDENCE: read-at-source
```

```
ID: FAC-29
BELIEF: a rail on the default slate is graded everywhere it is served.
WHERE: src/jobs/parcel-max-impervious-cover.mjs:147, which refuses COUNTY_NOT_IN_SCOPE for any
  county other than Travis, described at publish-gate-sched.mjs:25-28 as "hard-scoped to Travis
  (48453) only ... never writes so much as a not-applicable cell there".
FAILURE MODE: silent-skip, with a correct and documented rationale. Five of six counties get no
  maxImperviousCoverPct cell at all, so the rail reads as FAC-01's excluded and serves legacy.
  The reasoning at publish-gate-sched.mjs:26-35 is sound and the property was proven by a test
  (test/gate-county-scoped-rail.test.mjs). It is recorded here because it is the clean case
  showing how much traffic the 'excluded' token carries: simultaneously the correct answer for a
  county-scoped writer and the indistinguishable answer for FAC-02's regression case.
GUARDED: yes, by test, for the property it claims.
KNOWN VIOLATORS: five counties, by design.
PRE-FILL DETECTABLE: yes, by the same writer-scope declaration FAC-20 proposes.
CONFIDENCE: read-at-source
```

---

## Section B, completeness inventory

The question, per rail or group: is there any check that would detect a SHORT fill, as distinct
from a wrong one, and is that check's input INDEPENDENT of the write path it checks.

### B.0 The one-line answer

For the parcel POPULATION, which is the input to all 65 rails, the answer is no. Three of the
pipeline's four population figures read `landing_parcel_jurisdiction`, which is
parcel-record-fill's own input. The fourth, the CAD roll comparison, is the only figure with an
independent upstream, and it is documented as reported and never gated.

### B.1 The parcel population itself, feeding all 65 rails

What exists today. `fillCountyWide` declares `denominator: landing.n` from LANDING_COUNT_SQL
over landing_parcel_jurisdiction (parcel-record-fill.mjs:874-885) and pages the same table with
LANDING_PAGE_SQL (252-257), comparing nothing to it (FAC-08). `loadCountyRailCells` refuses when
a county's accumulated cells for one rail do not equal that county's parcel_record row count
(load.js:145-150); both sides are Factory tables written by the same job in the same run, so it
detects a missing CELL and never a missing PARCEL. `requireCountyPopulation` intersects five real
id sets across three stores (publish-readiness-gate.mjs:346-359), which is a genuine improvement
over dividing counts and is argued as such, but its gated record-fill comparison is parcel_record
against landing_parcel_jurisdiction, the same table the fill reads (FAC-07).

Independence verdict, for every one of the 65 rails: NOT INDEPENDENT, because they all inherit
the same parcel population. A rail's own writer can be perfect and the county can still be short
by exactly the amount the jurisdiction layer is short, and no rail-level check can see it.

What an independent second derivation would actually be, strongest first. The county appraisal
district's or TxGIO's own published feature count for the parcel layer, read at the source before
ingest. For an ArcGIS FeatureServer that is `returnCountOnly=true`; for a downloaded archive it is
the ZIP central directory entry count or the shapefile header record count, which is exactly the
instrument that finally caught Harris. That derivation never passes through
landing_parcel_jurisdiction and is therefore the only one that can contradict it.

Failing that, cad_property's distinct prop_id count for the county, which
`county-rail-coverage.mjs` already takes as its denominator and which `requireCountyPopulation`
already computes as `layerVsRoll`. It is a different upstream (the account roll, from the CAD
ingest) from the jurisdiction layer, so it IS independent in the sense that matters, and it is
explicitly never gated (publish-readiness-gate.mjs:60-65). The figures it reports there are
Bastrop 97.50, Caldwell 90.29, Hays 69.34, McLennan 100.00, Travis 84.84, Williamson
KEYSPACE_MISMATCH.

The Hays and Travis readings are exactly where a short layer ingest would hide, and the repo names
one mechanism for them, accounts-per-parcel. A second mechanism produces the same observation,
namely a layer missing parcels the roll knows about, and the two are distinguishable. Under
accounts-per-parcel the excess is CAD accounts whose parcel key IS in the layer; under short
ingest the excess is parcel keys ABSENT from the layer entirely. One anti-join separates them and
neither module runs it. Per ENFORCEMENT.md's reporting rule both mechanisms are stated and neither
is rejected, because the evidence to reject one is a query this lane cannot run.

### B.2 CAD scalar rails, 20 of them

apn, situsAddress, situsCity, situsState, situsZip, landUseCode, landUseDescription,
landUseSource, landUseVintage, acreageAcres, acreageSqft, acreageMethod, yearBuilt, marketValue,
assessedValue, landValue, improvementValue, livingAreaSqft, legalDescription, exemptionCodes.

Count-based checks that exist: the idempotency drift check (`--twice`,
parcel-record-fill.mjs:941-958 and 1114-1128), which re-runs instantiate plus ingest on the first
chunk and refuses IDEMPOTENCY_DRIFT on a fingerprint mismatch; and the sample floors
(assertSampleFloors, 974-988), requiring at least 10 in-city and 10 unincorporated in a sample
plus specific targeted hits.

Independence: NO for short-fill purposes. The drift check runs the same code against the same
inputs twice, so it proves determinism, not completeness, and cannot see a row the input never
carried. The sample floors are floors on a SAMPLE, not on the county.

What an independent derivation would be: cad_property's own distinct prop_id count for the
county, joined against the cells actually earned on a CAD-sourced rail. The repo already has the
denominator and already computes `notInLedger = cadPop - inLedger` (county-rail-coverage.mjs:108)
and never refuses on it; line 84 refuses only when inLedger EXCEEDS cadPop, that is, only when the
denominator query itself is wrong. Turning `notInLedger` into a gated figure, with the
accounts-versus-parcels counting rule attached, is the single cheapest real improvement available
in this repo.

One genuinely independent check exists in this group and does not run: FAC-28's
owner-rail-collision-check re-reads cad_property at a declared tax year as a third derivation. It
is per-parcel and county-scoped, so it would catch wrong values rather than short fills, but its
DESIGN is the correct shape and it is the only example of that shape here.

### B.3 Jurisdiction rails, 4 of them

countyFips is stamped `value` at instantiate (instantiate.js:21-28) and cannot be short relative
to the record set. cityLimits is written from the landing disposition (ingestJurisdictionOntoRecords,
parcel-record-fill.mjs:511-545) and a missing landing row or a blank city_name leaves it
unaccounted rather than fabricating, which is correct. etjStatus is deliberately never written and
the reason is stated: the landing table has no ETJ column. schoolDistrict already refuses in 3 of
6 counties per publish-readiness-gate.mjs:133-134, which is honest and visible.

Independence: cityLimits has a real second derivation available IN THIS REPO and unused for this
purpose, `landing_tx_city_boundary`, 1,222 rows, with the point-in-polygon verify-walk.mjs already
implements. Today that derivation is applied only to served parcels in a bounded street sweep.
Applied to the disposition column before a fill it would be a true meaning-shaped check: two
independently derived answers to "is this parcel in a city", one from the layer's disposition and
one from the boundary polygons, which cannot both be satisfied by one upstream fabricating both
halves.

### B.4 Zoning and envelope rails, 19 scalars plus setbackRules

What exists: the per-county residue ceiling (assertResidueWithinDeclaration,
zoning-layer-completeness.mjs DECLARED_LAYER_GAP with exact per-county ceilings) refuses when the
raw unmatched count EXCEEDS its declared ceiling. That is a real gate and it fires in the right
direction for a growing gap.

Independence: NO, in the way that matters. The ceiling and the residue are both counted against
tx_zoning_district_staging and the same in-city parcel set, so a staged layer that is itself short
produces a SMALLER residue, which reads as better. The ceiling can catch a residue that grows and
never one that shrinks because its denominator shrank. The config file flags the instrument
question as open (PER_COUNTY_CEILING_INSTRUMENT_DEFERRED) rather than settled, which is the right
posture.

Per FAC-10, FAC-11 and FAC-13, the larger exposure on this group is not short fill at all. Three
separate failure modes (no corpus table, a matcher miss, no geometry) all write `absent-verified`,
which is an EARNED kind, so the cells are neither short nor unaccounted. They are present,
confident, and wrong about the world. A short-fill detector would fire on none of them. The
detector that would is a decline census by reason, run before apply, described in each of those
rows.

What an independent second derivation would be: the city's own published zoning map district count
and its ordinance district table, compared against the staged layer's DISTINCT district codes. A
staged layer carrying 9 codes for a city whose ordinance names 24 is a short layer, and that
comparison never touches our own staging pipeline. The repo does exactly this once, by hand, for
Elgin (the DECLARED_LAYER_GAP note records that tx_zoning_district_staging for city_key='elgin-tx'
carries 9 codes, 11 rows, after S-P was added) and never as an instrument.

### B.5 Companion rails, 18 of them

wells, pipelines, permits, easements, buildingFootprint, specialDistricts, flood, owner,
valueHistory, salesHistory, publicRecordRefs, ossf, utilityService, agValuation, mineralRights,
hoaDeedRestrictions, overlayDistricts, setbackRules.

What exists per rail: the gate verdict, with FAC-01 and FAC-02's limits. For the companion pointer
specifically, nothing reconciles a cell claiming `rowCount: N` against the count of
parcel_record_companion_row rows behind it (FAC-17).

Independence: NO. The pointer and the rows are written by the same job in the same page, so a check
between them catches a transcription error and nothing else. That is the internal-consistency shape
ENFORCEMENT.md warns about explicitly: one party acting alone satisfies both sides.

What an independent second derivation would be, and it is cheap: the SOURCE's own feature count for
the county. For wells that is the RRC staged table count for the county; for flood the FEMA layer's
feature count; for special districts the district registry count. Each is a number the upstream
publishes and our pipeline does not compute, and each answers "did we load all of it" without
asking our own loader.

### B.6 Spine rails, 4 of them

parcelGeometry, roads, terrain, railCorridor. Not examined in this pass beyond their declarations
at rail-keys.js:78-81. No writer for any of the four was opened, and none appears in
FILL_OWNED_RAIL_KEYS. Recorded as unexamined rather than as absent, because a writer may exist
outside src/jobs/ under a name this lane did not open. Stated so a reader does not read silence as
a finding.

---

## COULD NOT ESTABLISH

`railCapabilities` does not exist in hauska-factory at this SHA. `git grep -n
"railCapabilities\|rail_capabilities" origin/main` returns zero hits across all 330 files. The
concept is real elsewhere in the portfolio; it is not in this repo, so the mission's
"railCapabilities, if present" reads as absent here rather than as anything about a ledger ceiling.

`write-setback-city.mjs` does not exist at this SHA, and no file matching that name does. The
dispatch's carried context, that it "reportedly throws SETBACK_APPLY_HELD on --apply and has no
live parcel loader", could not be verified, because there is nothing here to verify it against.
What does exist is parcel-setback-cells.mjs, whose header (4-6) says it writes "direct from the
ruled setback-table corpus, never the held atom writer (SETBACK_APPLY_HELD stays untouched)". The
held writer is referenced and is not in this repo. Whether it still throws is a question for
whichever repo owns it.

Whether landing_parcel_jurisdiction carries a unique constraint on (county_fips, prop_id) was not
established. migrations/bake/0005c_landing_parcel_jurisdiction.sql exists in the tree and was not
opened, and the table lives on PRODUCTION_NEONDB_URL rather than the Factory store. FAC-09 is
scored inferred for that reason.

Whether DECLARED_COMPLETE's cellPct and arealPct are two independent derivations or two views of
one staging table was not settled. COMPLETENESS_RULE names two measuring scripts and records that
one of them "measured the wrong pipeline and was discarded" for its parcel half, which points
toward one derivation with two projections, but neither script was opened.

The live state of all of this is unmeasured. This lane had no database, no network and no gcloud,
by instruction. Every count quoted above is a count the REPO states about itself, at the date the
repo states, and several carry staleness markers of their own: the 2026-09-08 population figures,
the 2026-09-07 coverage figures, the 2026-09-02 ledger disposition. None was re-measured and none
should be requoted as current. The findings that do NOT need live state are those in A.1, A.3, A.8
and B.0, because they are properties of the code rather than of the data; everything else is a
claim about the repo's own description of its data.

An empty COULD NOT ESTABLISH section would have been a finding about this review. This one is not
empty.
