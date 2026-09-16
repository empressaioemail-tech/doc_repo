## Mission — L-A LEDGER TRUTH: read the ledger and see every parcel, every one of its 65 facts, what serves, and what has an atom

**Read-only lane in the Texas scale-up research wave.** You spawn nothing. You write no product
code and change no store. Your worktree is your dispatch planner's doc_repo worktree; write
only under its `_inbox/` and `scripts/`.

### Why this exists

The operator's requirement, verbatim in substance: *the serving ledger should be the single
source of truth, so we should be able to read that ledger and see every parcel and every fact
about the parcel (the 65 cells), and see what is serving, what is not, and what has an atom.*

The 2026-09-11 ruling says the same: the ledger is the serving path, atoms are canonical, and a
cell is accounting that points at its atom. **Nobody has measured how far the running system is
from that.** Measured on 2026-09-16:

- the map adapter reports `atomBacked: false` on every rail sampled;
- 490,185 envelope atoms contradict the ledger's current setbacks;
- a third copy (the tier-1 bake, `place_layer_snapshots`) is what several surfaces read.

### Build: `scripts/ledger-truth.mjs`

A read-only, self-testing instrument, in the style of `scripts/six-county-completeness.mjs`. Read
that file first and reuse its store-access pattern.

**Mode 1, per parcel:** `--parcel 48209:97658`. Print all 65 rails, one line each:

- the cell `kind` and value;
- the cell's source and vintage;
- **the serve path** (record, legacy-transitional, not-cut-over, atom-chain, or other);
- **the atom behind it**: which family, whether it exists, its `source_adapter` and dates;
- **whether cell and atom agree.**

This is the "see every fact" view.

**Mode 2, per county and city, rolled up:** for each of the six counties, per city (and
unincorporated), per rail, counts of:

- cell kinds;
- serve path;
- atom present or absent, per family, **counted** where an index allows and **sampled and
  declared** where it does not;
- cell-atom disagreement, at minimum for the whole envelope family and zoning.

**The envelope family is in scope in full:**

- **Rails:** `setbackFrontFt`, `setbackSideFt`, `setbackRearFt`, `setbackCornerFt`,
  `setbackRules`, `maxHeightFt`, `maxLotCoveragePct`, `maxFootprintSqFt`,
  `maxImperviousCoverPct`, `parcelAreaSqFt`, `buildableAreaSqFt`, `buildableAreaPct`,
  `envelopeStatus`, `envelopeDisclosure`, `edgeSignal`, `citationUrl`, `buildingFootprint`,
  `parcelGeometry`, `roads`.
- **Atom families:** `zoning-fact`, `setback-rule`, `buildable-envelope`,
  `property-boundary-edge`, `building-footprint`, `road-node`, `parcel-node`.

**Serve path is a claim about code, so derive it from code and name the source.** Read:

- the reader slate: hauska-engine `services/retrieval-api/src/parcel-record-slate.json` and
  LDT's `PARCEL_RECORD_SLATE`;
- the gate-verdict and allowlist logic in LDT (`parcelRecordAllowlist.ts` and the
  `*ServeCutover.ts` wrappers);
- how hauska-map computes `recordRailStates`.

**If these sources disagree about a rail, that disagreement is a finding.** Report it and do not
pick one.

**Atom pointers.** Enumerate every key that appears in `cell_state` across all 65 rails. Report
whether any key references an atom (a DID, a version or a content hash), and on which rails.

### Falsifiers

Pre-register your answers before you run anything.

1. For `setbackFrontFt`, your county totals by kind must equal those in
   `_inbox/2026-09-16_setback_parcel_grain_results.txt` and in
   `scripts/six-county-completeness.mjs`'s live run. A difference is a finding about one of the
   three.
2. Per-parcel mode on `48209:97658` must show:
   - `setbackSideFt` as legacy-transitional;
   - an envelope atom with outcome `no-buildable-area` from `cortex-tier1-snapshot-breadth-bake`,
     disagreeing with the ledger's setbacks.

   On `48453:427599` it must show a buildable envelope atom.
3. **Not vacuous:** a self-test fixture in which a cell and its atom disagree must be reported as
   disagreeing, and a fixture with no atom must not be reported as agreeing.
4. Any count you cannot make exact is labelled a sample, with its size and selection rule.

### Then: the design gap

Write `_inbox/<date>_scaleup-la_single_source_design_gap.md`. Cover:

- what a cell must carry for one read to answer everything above (atom reference, atom version,
  serve status, rendering version, and whatever else your measurement shows is missing);
- what exists today;
- which existing rows build it (P-162, P-163, P-164, P-166, P-201, P-204) and what no row covers;
- how the tier-1 bake copy is retired or fed, since a third copy defeats a single source.

### Close

**Report.** `_inbox/<date>_scaleup-la_ledger_truth_report.md`, containing:

- the county, city and rail roll-up;
- the serve-path source disagreements;
- the atom-pointer finding;
- the envelope-family disagreement counts;
- the instrument's self-test output.

**Close JSON.** `_inbox/<date>_scaleup-la-ledger-truth_close.json`, carrying:

- `planRows` `["P-201", "P-204"]`;
- `probe` `{"notApplicable": "read-only research lane"}`;
- `falsifier` with your pre-registered answers scored;
- `leave_behind`.

Report to your planner when your atoms-store reads are finished, so L-B can start its own.
