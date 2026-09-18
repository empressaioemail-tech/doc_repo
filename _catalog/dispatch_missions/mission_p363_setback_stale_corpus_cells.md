## Mission — P-363: a setback cell written under an older corpus is re-resolved under the pinned one

You launch no sub-agents (FAN-DEPTH 0). You build in `hauska-factory` only and open one PR, branched
from current `origin/main` with the SHA declared (`0f4558a4` at compile). You do not merge, deploy,
apply or write any store; the integration seat does all four. Any doc_repo change is handed back as a
diff in your close.

Read `_inbox/2026-09-18_p258_rerun_check_RECORD.md` first. It is the measurement this row rests on,
and its instruments are in doc_repo: `scripts/sql/setback-cell-source-census.sql`,
`scripts/sql/setback-value-cells-by-code.sql`, `scripts/setback-corpus-version-diff.mjs`,
`scripts/setback-stale-match.mjs`, with outputs `_inbox/2026-09-18_setback_corpus_1.1.0_vs_1.4.0_diff.json`
and `_inbox/2026-09-18_setback_stale_match.json`.

### What is wrong (measured 2026-09-18, read-only)

`src/jobs/parcel-setback-cells.mjs` releases exactly two populations to be rewritten: cells still
`unaccounted`, and the false absences this job wrote itself (P-256's two signatures,
`setbackCellMayBeMoved` and the SQL it mirrors). Any `value` cell is frozen, whatever corpus it came
from. The image pins `@empressaio/setback-corpus` 1.4.0 (generation 8, `208fb315`), but:

- **387,237 of 461,505** setback value cells in the six counties still cite
  `@empressaio/setback-corpus@1.1.0:<table>` (Travis 172,243, Williamson 130,210, McLennan 37,513, Hays
  35,365, Bastrop 6,421, Caldwell 5,485).
- **387,231** of them resolve under 1.4.0, by the writer's own `mapDistrict`, to the same row with the
  same front, side, rear and corner. Between 1.1.0 and 1.4.0 no district's setbacks changed in any
  table; only the flagged height placeholder moved (100 to 999). For these cells the citation is stale
  and the value is right.
- **6** San Marcos parcels coded `N-CM` (`48209:11795`, `12013`, `134844`, `174073`, `174074`,
  `98186`) hold legacy `NC`'s 20 / 5 / 5 / 15: 1.1.0's table had no N-CM row, and the router's prefix
  fallback reached NC (`NCM` starts with `NC`). N-CM's own 1.4.0 row is 5 / 0 / 0 / 5. These values
  are wrong.
- Re-running the writer changes nothing: dry runs `9pg2r` and `v7xfd` propose exactly the stored
  value, unaccounted and refused counts in all six counties.

This is why the operator's ruling 19 (San Marcos served from 1.4.0) cannot happen through a re-run, and
why most-current-source-wins (`_decisions/2026-09-11_setback_source_most_current_wins.md`) is not true
of the stored cells.

### What to build

1. **The gate releases a stale-corpus value.** A value cell this job wrote (identify it by its own
   `source` prefix, `@empressaio/setback-corpus@`, and say why that is unique to this job; a cell any
   other producer earned stays untouchable) whose corpus version is older than the pinned
   `CORPUS_VERSION` is released and re-resolved under the pinned table. `setbackCellMayBeMoved` and the
   SQL WHERE clause change together, and the existing drift test that pins one to the other must still
   pass (and must fail if only one changes).
2. **Two outcomes, told apart.** If the pinned table resolves the same row with the same numbers, the
   cell is re-stamped: `source`, citation and date fields only, with the value unchanged. If it resolves
   a different row, or the same row with different numbers, the new values are written and a durable
   record names every such cell with its old and new values. If it now resolves to no row, it takes
   the writer's current refusal for a district miss, never a silent `unaccounted`. Count the three
   outcomes separately in the run record.
3. **The date fields follow the row.** 1.1.0 cells carry `dateBasis: "unreadable"`, `sourceDate: null`.
   If the pinned row carries a readable effective date (P-270), the re-stamped cell carries it; if not,
   it stays unreadable. Never fabricate a date.
4. **The companion.** `setbackRules` and its companion rows cite the same source; they move with the
   rails, under the same rules.
5. **The envelope writer.** Read `src/jobs/parcel-envelope-cells.mjs` and say whether it has the same
   frozen-older-corpus shape. If it does, report the population read-only and do not fix it here; the
   seat cards it.

### Verify by violation

Pre-register your falsifiers. Fixtures: an SF-6 cell citing 1.1.0 re-stamps with the value unchanged;
an N-CM cell citing 1.1.0 with NC's numbers moves to N-CM's; a cell citing 1.4.0 is untouched; a value
cell earned by another producer is untouched; a code the pinned table no longer resolves takes the
district-miss refusal. Show each failing on the pre-change code where it should. Then a dry run per
county under the heavy-scan lease on the direct host, with the per-county counts of re-stamps, value
changes and new refusals. The seat's prediction, from the stale-match instrument, is **387,231
re-stamps, 6 value changes and 0 new refusals.** A dry run that differs is a finding: explain it
before you close.

### The three-question gate

Answer in your close: what executes the release, what triggers it (any run of the job after a pin
move), what fails when a stale-corpus value survives a run, and what bypasses it (a hand UPDATE, a
second writer on the setback rails, a pin moved without a re-run).

### Constraints

- No store writes, no deploys, no merges, no applies. The seat applies county by county after the dry
  run matches, under a durable record.
- The cell writes are ledger cells. What a customer reads for San Marcos today comes from the bake's
  `legacy-transitional` 1.1.0 atoms, and it changes only when P-349's Hays bake runs after P-351. Say
  whether anything your change touches is read by a serving surface directly.
- Factory merge order this wave (the seat serializes): P-333, then P-334/P-329/P-330, then P-352 and
  P-361, then yours, then P-300 and P-338's writer half, then P-336's. Rebase onto whatever has merged.
- Williamson 48491 republishes only under P-350; you may dry-run it, never write it.

### Close

Declare: the start commit and PR, the release rule and why the source prefix identifies this job's
cells, the three-outcome counts per county beside the prediction, the envelope writer's answer, the
falsifiers with both directions shown, the three-question gate answers, and `leave_behind`.
