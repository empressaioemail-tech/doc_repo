## Mission — P-300 and P-338, writer build: every remaining setback cell says what is true about its city

You launch no sub-agents (FAN-DEPTH 0). You build in `hauska-setback-corpus` (default rows) and
`hauska-factory` (the setback writer and router), one PR per repo from current `origin/main` with the
SHA declared (factory `415d3212`, corpus `f43cf4b7` at compile). You hand back the doc_repo ledger-policy
diff in your close. You do not merge, publish the corpus, deploy, apply or write any store.

**Fire this only after the P-300 city-classification lane has closed.** Its table is this lane's only
input for the 19 cities the first writer lane could not classify.

### Where this starts

The first writer lane closed INCOMPLETE on purpose and recommended this split. Read, in order:

1. `_inbox/2026-09-18_p300-p338-setback-residual-writer_close.json`: why it stopped, and
   `leave_behind`.
2. `_inbox/2026-09-18_p300-p338-setback-residual-writer_cp1.json`: **the design. Build against it;
   it needs no re-design.**
3. `_inbox/2026-09-18_p300-p338-setback-residual-writer_city-classification.json` (21 cities) plus the
   classification lane's table (19 cities). Together, the 40.
4. `_catalog/dispatch_missions/mission_p300_p338_setback_residual_writer.md`: the full original
   specification (rulings 5, 6 and OT-10; the population of 58,339; the four cell shapes; the ledger
   policy; the seven falsifiers). Everything there still applies except what this mission changes.

### Two things the first lane found that change the build

- **The short-circuit.** `processCityPage` tests `city.ruled` BEFORE it reads the `zoningDistrict`
  cell, so in a no-table city a parcel with no district and a parcel with a district get the SAME cell.
  P-326 named this and left it unowned. The router's two entry points (a parcel with no district on
  file takes its city's class; a parcel WITH a district that misses the table takes ruling 6's refusal)
  cannot be told apart until this branch reads the zoning rail. This lane owns that edit.
- **Writes are sticky.** `setbackCellMayBeMoved` releases `unaccounted` and this job's own false
  absences, not `refused` or a true `absent-verified`. The first class a parcel receives is the one it
  keeps. So a city the tables leave `unclassified` stays `unaccounted`, named and counted: never
  defaulted.

### What changed on main since the first lane

P-363 merged (`415d3212`): the write gate now also releases a value this job wrote under an older corpus.
Keep that release and yours distinct, and say how they coexist. P-354's factory half (#179, open) serves
a future-dated rule row by ruling and writes adopted/effective dates into cells; read it at its head. P-336
(#180) merges after you.

### What to build, verify, and close

As in the original mission file (items 1 to 5, the falsifiers, the per-county dry run under the
heavy-scan lease with counts beside the predictions, the three-question gate, and the close), with the
40-city table as the classification input and the short-circuit fixed. The dry-run prediction is
restated from the two tables: district-miss refusals 9,510; for the 48,829, class (a) + (b) + (c) +
still-unclassified must equal 48,829, with (b) exactly the class (b) cities' parcel counts.

### Constraints

- No store writes, no corpus publish, no deploys, no merges. Williamson 48491: dry-run only (P-350).
- A city the two tables leave `unclassified` is never guessed into a class.

### Close

Declare: the start commits and PRs, the corpus version, the short-circuit fix, the per-county dry-run
counts beside the predictions, the ledger-policy diff, the falsifiers with both directions shown, the
three-question gate answers, and `leave_behind`.
