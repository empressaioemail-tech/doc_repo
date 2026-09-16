# L-A LEDGER TRUTH -- report

lane `scaleup-la-ledger-truth`, seat `dispatch-planner-la`, plan rows P-201/P-204, 2026-09-16.
Read-only. Instrument: `scripts/ledger-truth.mjs` (self-test: `node scripts/ledger-truth.mjs --self-test`,
17/17 PASS). Live artifacts this report cites: `_inbox/2026-09-16_ledger-truth-parcel-48209-97658.json`,
`_inbox/2026-09-16_ledger-truth-parcel-48453-427599.json`, `_inbox/2026-09-16_ledger-truth-rollup.json`,
`_inbox/2026-09-16_ledger-truth-six-county-completeness-live.json`.

## 0. The operator's question, answered directly

**Can you read the ledger and see every parcel, every one of its 65 facts, what serves, and what
has an atom? Not today, not from the ledger alone.** The ledger (`parcel_record_cell`) answers
"what does this cell say" for all 65 rails, exactly. It does **not** answer "what serves" by
itself -- that requires joining it to two OTHER artifacts outside the ledger (the engine's
vendored slate JSON and the county-level gate verdict, neither stored on the cell). And it does
not answer "what has an atom" **at all** today: `extractAtomDid` in hauska-engine's own reader
looks for an `atomDid` key on the cell and, per that code's own comment, finds one on **zero**
live cells (P-163 has not landed). This instrument had to go around the ledger -- to two other
stores and two other repos' source -- to answer a question the ledger-as-serving-path ruling says
one read should answer. That gap is the deliverable of this lane; §5 (and the companion design-gap
doc) names it precisely.

## 1. Serve-state model, read from code (not assumed)

hauska-engine `services/retrieval-api/src/parcel-record-reader.ts` (`origin/main`, function
`buildRailResponse`) is **the one reader** (P-152). Its serve state is a pure function of two
facts, **neither of which is per-parcel**:

- is `(countyFips, railKey)` in the engine's vendored slate
  (`services/retrieval-api/src/parcel-record-slate.json`)?
- what does `parcel_gate_verdict` say for that `(county, rail)` pair? **`parcel_gate_verdict` has
  no `place_key` column** -- it is one verdict per county per rail, not per parcel.

**Finding 1 (structural, not a defect): "what serves" is uniform across every parcel in a county
for a given rail.** It never varies by city or by parcel. What DOES vary by parcel is the cell's
own `kind` (`value`/`refused`/`unaccounted`/`absent-verified`/`not-applicable`). Reading "what
serves this parcel's zoning" therefore requires the AND of two different grains: a county-level
serve decision and a parcel-level cell state. A rail whose county-level state is `record` can
still be individually `absent-verified` for one parcel -- the county-level "yes, we serve this
rail from the record" says nothing about whether THIS parcel's own cell is populated.

This instrument's own serve-state vocabulary is a deliberate superset of the reader's three-value
enum (`record`/`refused`/`legacy-transitional`), because that enum collapses two states LDT's own
source keeps distinct (each rail's own `*FactServeCutover.ts` module doc, `legacy-design-tools`
`origin/main`, read 2026-09-16):

| bucket | meaning | how derived |
|---|---|---|
| `record` | slated + gate verdict `pass` | reader's own logic |
| `refused` | slated + gate verdict present, not `pass` | reader's own logic |
| `legacy-transitional` | not slated, but the rail HAS a legacy (bake-derived) reader to fall back to | reader collapses this and the next row together; this instrument does not |
| `not-cut-over` | not slated, and the rail has **no legacy reader at all** | `utilityService`, `overlayDistricts`, `agValuation`, `schoolDistrict`, `valueHistory`, `setbackRules` -- each one's own module doc states "no legacy serve path exists for this rail" |
| `atom-chain` | no `parcel_record_cell` row at all, but an atom exists for the rail's family | narrow, this instrument's own definition -- see the overload note below |
| `other` | no cell row, no atom | genuine gap / indeterminate |

**Finding 2 (a naming collision, reported, not resolved):** `"atom-chain"` is ALSO hauska-map's own
top-level Property Explorer `readPath` enum value (`apps/property-explorer/api/_lib/
atom-chain-to-facets.ts`, `readPath: "atom-chain" | "atom-chain-warm" | "record" |
"record-unavailable"`) -- a **request-level** choice between the `/property-nodes/:id/atom-chain`
endpoint and the one-reader's `/record` endpoint, not a per-rail cell state. `atom-chain-to-facets.ts`
itself carries `recordRailStates?: Record<string, {serve: "record"|"refused"|"legacy-transitional";
atomBacked: boolean}>` -- the SAME three-value enum, consumed as-is from the one reader. **No
single, per-rail "atom-chain" state exists anywhere in the product code today.** The dispatch's own
mission text lists `atom-chain` as one of this instrument's per-rail buckets; this instrument
supplies one, narrowly defined (no cell row + atom present), and flags -- rather than silently
resolves -- that the same word means something else one layer up the stack (a request-routing
choice, not a fact about one rail). A future single-source design should not reuse this name for
two different concepts.

## 2. Live serve-source disagreement (finding, not resolved -- per the dispatch's own instruction)

The engine's vendored slate (`hauska-engine parcel-record-slate.json`) and LDT's own
`PARCEL_RECORD_SLATE` (`parcelRecordAllowlist.ts`) are supposed to be resynced together (the
vendored file's own header comment says so, and names a divergence test in each repo). **They
disagree right now, live, as of this lane's run (2026-09-16):**

| county:rail | engine slate | LDT slate |
|---|---|---|
| 48209:marketValue | NOT slated | slated |
| 48209:assessedValue | NOT slated | slated |
| 48209:landValue | NOT slated | slated |
| 48209:improvementValue | NOT slated | slated |
| 48209:livingAreaSqft | NOT slated | slated |
| 48209:yearBuilt | NOT slated | slated |

Traced to source, not guessed: the engine's vendored copy was last resynced by hauska-engine PR
#439 (`0ed4d9c`, **2026-09-13T16:14:12-05:00**), which correctly removed these six entries per
LDT PR #671's then-live Hays holdback (P-177). LDT's own allowlist then had that holdback **lifted**
by P-180 (`1ca3c7f`, **2026-09-13T19:30:32-05:00** -- three hours and sixteen minutes later),
restoring all six entries for Hays. The vendored JSON's own header comment already flags itself as
"PENDING RESYNC ... do not treat this value as a merged-main commit until that resync lands" --
that resync has not landed in the three days since. **Consequence for a customer:** the one-reader
(hauska-engine, which the MCP catalog and any consumer of `/property-nodes/:id/record` uses) will
resolve these six Hays dollar/structural rails to `legacy-transitional` (serving whatever the
tier-1 bake produced), while anything consulting LDT's own allowlist directly resolves them to
`record` (the crosswalk-corrected P-180 values). **This instrument does not pick a side** -- both
are live, current, and disagree.

## 3. Per-parcel view (Mode 1) -- the two probe parcels, falsifier 2

**48209:97658** (Hays, the gold Sturgeon-Dr parcel). Full 65-rail output:
`_inbox/2026-09-16_ledger-truth-parcel-48209-97658.json`.

- `setbackSideFt`: cell kind `value` (a real number, source `@empressaio/setback-corpus`), serve
  path **`legacy-transitional`** -- CONFIRMED, matching falsifier 2. The cell carries a real,
  populated, crosswalk-correct value (P-180's fix), and it is not what serves: 48209 was
  deliberately excluded from `setbackSideFt`'s slate entry in BOTH files (Hays holdback on the
  three "Ft-suffixed siblings," per `parcelRecordAllowlist.ts`'s own "RETIRED" section), so the
  reader falls back to the tier-1 bake regardless of the cell's own correctness.
- `envelopeStatus` / `buildableAreaSqFt` / `buildableAreaPct` / `envelopeDisclosure`: cell kind
  `unaccounted` (withheld at the ledger by ruling R-2). The `buildable-envelope` atom
  (`did:hauska:buildable-envelope:48209:97658`, `source_adapter cortex-tier1-snapshot-breadth-bake`,
  fetched `2026-07-23T15:22:13.921Z`) carries `outcome: {"kind":"no-buildable-area","areaSqFt":0}`.
  **CONFIRMED, matching falsifier 2 exactly** (family, source_adapter, and outcome all match).
- `zoningDistrict`: cell `value`, serve `record` (slated + gate pass), atom
  (`zoning-fact`) exists and **agrees** (same district, case-normalized compare).

**48453:427599** (Travis). `_inbox/2026-09-16_ledger-truth-parcel-48453-427599.json`.

- `buildableAreaSqFt`: atom exists, `outcome: {"kind":"buildable","areaSqFt":5027}`. **CONFIRMED**
  -- a real buildable-envelope atom, matching falsifier 2's second requirement.
- `setbackFrontFt` / `setbackSideFt`: both serve `record` here (Travis is not held back the way
  Hays is on these rails).

## 4. County x city x rail rollup (Mode 2) -- falsifier 1

Full data: `_inbox/2026-09-16_ledger-truth-rollup.json`. Cell-kind counts are **exact** (indexed
prefix range scan on the `(place_key, rail_key)` primary key, one pass per county), not sampled.

**`setbackFrontFt` county totals, cross-checked two ways, both EXACT MATCHES, all six counties, all
five kind buckets** (`value`/`refused`/`unaccounted`/`absent-verified`/`not-applicable`):

| county | value | refused | absent-verified | not-applicable |
|---|---:|---:|---:|---:|
| 48021 Bastrop | 6,421 | 9 | 5,518 | 50,308 |
| 48055 Caldwell | 5,485 | 0 | 5,116 | 14,387 |
| 48209 Hays | 35,365 | 0 | 18,904 | 62,151 |
| 48309 McLennan | 37,513 | 0 | 43,305 | 33,436 |
| 48453 Travis | 172,243 | 456 | 103,283 | 104,935 |
| 48491 Williamson | 130,210 | 0 | 43,346 | 109,014 |

(`unaccounted` is 0 in every county for this rail.) Checked against (a) the pre-existing
`_inbox/2026-09-16_setback_parcel_grain_results.txt`, city-split -- exact match on every city row
in every county; (b) a **fresh live run** of `scripts/six-county-completeness.mjs`
(`_inbox/2026-09-16_ledger-truth-six-county-completeness-live.json`, VERDICT `INCOMPLETE`, the
expected state): its `setback-no-ruled-table` + `setback-router-miss` false-earned counts sum to
this instrument's `absent-verified` total in every one of the six counties, exactly (e.g. Hays
5,640 + 13,264 = 18,904; Travis 43,168 + 60,115 = 103,283). **Falsifier 1: CONFIRMED, no
disagreement found between the three sources.**

City-level breakdown (envelope family + zoning, 21 rails, all six counties) is in the rollup JSON's
`cellKindByCity`; it reproduces the per-city rows in the grain-results file exactly and extends the
same breakdown to every other envelope rail and to `zoningJurisdictionKey`.

## 5. Atom-pointer finding

`extractAtomDid` in `parcel-record-reader.ts` looks for an `atomDid` key on `cell_state`, with its
own comment: *"Candidate field name for a future atom pointer on a cell (P-163 has not landed; no
live cell carries one yet)."* Verified, not just quoted: a `TABLESAMPLE SYSTEM (0.05)` sample of
`parcel_record_cell` (33,815 rows, ~0.044% of the table's 76,055,442 live rows) found **zero** rows
where `cell_state ? 'atomDid'`. A full, exhaustive scan for this key timed out at the store's
required 30s+ statement_timeout on a first attempt (no index on this key exists) -- **this count is
therefore a declared sample, not an exhaustive one**, per falsifier 4. **No key in `cell_state`
anywhere in the store references an atom** (no DID, no version, no content hash) -- confirmed by
direct enumeration of every key present across all 65 rails for the Hays probe parcel (§3's JSON
artifact): every rail's cell carries only `kind`/`value`/`source`/`vintage`/`basis` and a handful of
rail-specific descriptive fields (`districtCode`, `resolvedTableKey`, `sourceDate`, etc.) -- never an
atom reference. This matches P-163's own OPS-16 row text exactly: *"Until a cell carries an atom
pointer, `accessPolicy` is never consulted on the brief's serving path ... so the brief serves
zoning, setbacks, who-serves and the rest unauthenticated by default rather than by ruling."*

## 6. Envelope-family disagreement, six-county exact count

**490,185** `buildable-envelope` atoms carry `outcome.kind = "no-buildable-area"`, scoped exactly to
the six program counties (index-bounded query, ~31s, `_inbox/2026-09-16_ledger-truth-rollup.json`
`envelopeSixCountyNoBuildableAreaCount`). **This matches the dispatch's own cited premise number
exactly -- confirmed, not contradicted.** One clarification found in the course of verifying it:
the SAME count with no county scope at all is **848,381** (store-wide), with a third `outcome.kind`
value the dispatch's premise text does not mention -- `provisional-front-edge`, 559,084 atoms,
store-wide. The `buildable-envelope` atom family's `cortex-tier1-snapshot-breadth-bake` coverage is
**not** limited to the six onboarded counties; the six-county figure is a real scope restriction of
a substantially larger existing bake, not the whole of what that adapter has already computed.

By construction (ruling R-2 withholds `buildableAreaSqFt`/`buildableAreaPct`/`envelopeStatus`/
`envelopeDisclosure` at the ledger unconditionally, in every one of the six counties), **every
parcel that has a `buildable-envelope` atom at all is, by the ruling's own terms, a disagreement
against its own ledger cell** for those four rails: the cell says "withheld, not served" and the
atom carries a real computed outcome. This is the mechanism behind the dispatch's premise
statement "490,185 envelope atoms contradict the ledger's current setbacks" -- traced to its exact
cause here, not merely restated.

## 7. Ag-valuation cross-check (operational-notes figure)

The operational notes cite "318,000 unaccounted ag-valuation cells." Live count, this lane, 2026-09-16:
**317,918** (`rail=agValuation`, `kind=unaccounted`, summed across Bastrop/Caldwell/Hays/McLennan --
the four counties the writer's own `COUNTY_NOT_IN_SCOPE` contract excludes). **Confirmed, not
contradicted** (within normal day-to-day drift of a live count). Traced why
`scripts/six-county-completeness.mjs`'s own `ag-valuation-no-source` false-earned guard reads 0
for these counties despite the real gap being this size: that guard's SQL predicate checks
`cell_state->>'kind' = 'not-applicable'`, but the live cells in question are still `kind =
'unaccounted'` -- the "never-run not-applicable sweep" the script's own comment names has, in fact,
never run. This is a known, already-documented limitation of that specific guard, not a new defect
found here; cited with the live number for the record.

## 8. Instrument self-test output

```
$ node scripts/ledger-truth.mjs --self-test
PASS  65 rails declared
PASS  envelope family has 19 rails per the dispatch's literal list
PASS  every RAIL_TO_ATOM_FAMILY value is one of the seven declared families
PASS  1 slated + verdict pass -> record
PASS  2 slated + verdict excluded -> refused
PASS  3 NOT engine-slated (has a legacy reader) -> legacy-transitional
PASS  3b slate disagreement detected when engine and LDT differ
PASS  4 unslated + no-legacy-path rail -> not-cut-over
PASS  5 no cell row + atom present -> atom-chain
PASS  6 no cell row + no atom -> other
PASS  7 slated + no verdict fails CLOSED to legacy-transitional (mirrors reader's own branch)
PASS  8 NOT VACUOUS: disagreeing cell+atom reports disagree
PASS  9 case-insensitive matching value reports agree
PASS  10 NOT VACUOUS: a fixture with NO atom is never reported as agreeing
PASS  11 R-2-withheld cell + real envelope-atom outcome reports disagree
PASS  12 NO_LEGACY_PATH_RAILS matches the module-doc-cited set
PASS  13 road-node has no parcel-bounded index entry (must be sampled/declared)
SELF-TEST OK (17)
```

## 9. Measurement boundaries, declared

- **`place_layer_snapshots`** (the "third copy," the tier-1 bake several surfaces read) is
  confirmed absent from `FACTORY_DATABASE_URL_RO`'s `information_schema.tables` and, by the same
  logic, not part of `ATOMS_DATABASE_URL` either (a different store entirely, by design). Per
  P-183's own text it is `legacy-design-tools`' own Postgres/Neon store, for which this lane holds
  no credential. This instrument cites its existence and role from code (`nodeFacetBakeTier1
  ConformantCli.ts`, `place_layer_snapshots.lat_rounded`/`lng_rounded`) but cannot query it live.
  Left as an explicit gap for the design-gap doc and for whichever row eventually retires or feeds
  it (§ design-gap doc).
- **Atom presence/agreement in Mode 2** is a **declared sample**: 200 parcels per county (1,200
  total), selected by `order by md5(place_key) limit 200` anchored on the `zoningDistrict` rail
  (the same deterministic-hash convention `scripts/vendor-testset-ctx.mjs`/P-176 already
  established for this program), against the `zoning-fact`/`setback-rule`/`buildable-envelope`
  (shared index) and `property-boundary-edge`/`building-footprint`/`parcel-node` (own indexes)
  families. `road-node` has no parcel-bounded index (confirmed against `pg_indexes`) and is
  reported as un-sampleable at parcel grain -- county-level presence only, via its own
  `countyFips` index, not computed by this instrument's Mode 2 (left as an explicit gap).
- The `atomDid` count in §5 is a declared `TABLESAMPLE SYSTEM (0.05)` sample (33,815 rows), not an
  exhaustive scan -- the exhaustive version timed out.

## 10. Instrument bugs found and fixed during this lane's own pilot run

Recorded honestly per the fleet-memory practice (see the close JSON's `leave_behind` and the
scratch entries below), not smoothed over: `readSlates()`'s first version used `/p/...` (Git-Bash
MSYS path) defaults, which `git.exe` -- spawned with no shell to translate them -- silently
resolved to nothing, collapsing every rail's serve classification to `legacy-transitional` with
only a printed WARNING as the tell. Caught by reading that warning rather than trusting a
successful-looking run; fixed to `P:/...` drive-letter paths. A second bug (the import-safety
entrypoint guard comparing an absolute `file://` URL against a relative `argv[1]`) silently
no-op'd the whole script on some invocation forms; fixed with `pathToFileURL`. Both are exactly the
class of defect `feedback_precise_empirical_claims` and `project_msys_p_paths_break_node` (durable
memory) already name -- confirmed live, again, in a fresh instrument.

## Fleet-memory scratch (M0)

- LESSON: git.exe spawned via node's `child_process` does not receive MSYS `/p/...` path
  translation; a repo path passed to `git -C <path> show ...` from inside a `.mjs` instrument must
  use the `P:/...` drive-letter form or it silently resolves nothing (no thrown error) rather than
  failing loud.
- LESSON: an ESM entrypoint guard (`import.meta.url === file://${process.argv[1]}`) must normalize
  `argv[1]` with `node:url`'s `pathToFileURL` first -- a relative invocation (`node
  scripts/foo.mjs`, as opposed to an absolute path) makes the naive string comparison silently
  false and the script's `main()` never runs, exit 0, no output, no error.
- GROUND-TRUTH (2026-09-16, live): hauska-engine's vendored `parcel-record-slate.json` (152
  entries) and legacy-design-tools' own `PARCEL_RECORD_SLATE` (158 entries) disagree on exactly six
  `48209:*` dollar/structural rail entries; the vendored copy has not been resynced since
  2026-09-13T16:14:12-05:00 despite LDT's own P-180 restoring those six entries three hours later
  the same day.
- GROUND-TRUTH (2026-09-16, live): zero of a 33,815-row `TABLESAMPLE SYSTEM(0.05)` sample of
  `parcel_record_cell` carry an `atomDid` key; P-163 (one-writer, atom+pointer+rendering in one
  transaction) has not landed.
- GROUND-TRUTH (2026-09-16, live): six-county-scoped `buildable-envelope` atoms with
  `outcome.kind='no-buildable-area'` = 490,185 (exact, index-bounded); store-wide (no county scope)
  = 848,381, plus a third outcome kind (`provisional-front-edge`, 559,084) not mentioned in the
  dispatch's premise text.
- OPEN: `place_layer_snapshots` (the tier-1 bake / "third copy") has never been queried live by
  this lane -- no credential for legacy-design-tools' own Postgres store was provided. Whoever gets
  that credential next should re-run this instrument's Mode 1/2 atom-family comparisons a third way
  against it, not just the ledger and the atoms store.
- OPEN: this instrument's `RAIL_TO_ATOM_FAMILY` map is provisional (P-162 has not landed a
  code-owned one as of 2026-09-16). It was cross-checked against exactly two probe parcels'
  families before use, not against all 65 rails' full behavior. Whoever builds P-162 for real
  should diff against this instrument's map and reconcile, not silently replace it.
