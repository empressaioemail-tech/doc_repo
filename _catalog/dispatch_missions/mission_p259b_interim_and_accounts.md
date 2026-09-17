## Mission — P-259 follow-up: interim districts read as their base, and no-account features are skipped

You launch no sub-agents (FAN-DEPTH 0). You continue P-259's own branch in `legacy-design-tools`
and update its PR. You do not apply any stamp, write any store, merge, or deploy; the integration
seat applies the stamp after your dry runs.

### Where you work

`legacy-design-tools`, fresh clone from `origin` under `P:/tmp/` into a NEW directory, branch
`feat/p259-austin-zoning-source` (PR #712, head `3a806acb` at compile). Register the clone under the
property seat and remove the entry at close. First merge `origin/main` into the branch (LDT main was
`710d5bb7` at compile and carries P-258 #709 and P-299 #711, which rewrote the vendored setback
tables) and resolve anything that conflicts before you change a line.

### What P-259's close found (A-202)

- Read `_inbox/2026-09-17_p259-austin-zoning-source_close.json` and its CP2's `theInterimFinding`
  and the parcels-read denominator finding first.
- The live Austin layer publishes an interim family with a leading `I-` qualifier: 14 values,
  1,229 polygons. The current parser leaves every one unrecognised. The dry runs counted 23,499
  parcels (Hays 361, Williamson 6,108, Travis 17,030 at feature grain), and the census shows the
  previous reading served the same parcels under the base code.
- Austin's ordinance (C2O-2009-017) and the city's development-standards table
  (20160616-041, edims id 256732) give `I-SF-2` the SF-2 standards; the shipped `austin-tx.json`
  SF-2 row has the same setback triple.
- The stamp CLI's `parcels read` and `parcels matched` count FEATURES (`DISTINCT ON feature_index`),
  not accounts. In Travis 423,540 of 828,773 features carry `prop_id '0'` (no CAD account).

### The operator's rulings (A-202, 2026-09-17)

1. **An interim district reads as its base, with a disclosure.** `I-<X>` parses to base `<X>`
   through a declared leading-qualifier rule (for example `interimQualifiers: ['I']`), and the parse
   result carries `interim: true` (or an equivalent named field). The same longest-match rule then
   applies to `<X>`, so `I-SF-2-NP` is base SF-2 with overlay NP and interim true, `I-RR-NP` is RR
   with NP, and `I-PUD` takes the planned-development route with interim true. A qualifier followed
   by nothing, or by a value that matches no base, stays unrecognised with the reason.
2. **Features with no CAD account are skipped and counted.** At stamp time, a feature whose
   `prop_id` is `'0'`, empty or null writes no row. The CLI reports the skipped count by reason, and
   reports both the feature count and the account count (distinct real `prop_id`) for every leg.

### What to build

1. The interim rule in the parser, with the disclosure carried through the stamp so the stamped
   row records that the district is interim. Name where the disclosure lands (column, JSON field or
   provenance note) and whether any serve path reads it today. If none does, say so; do not build a
   serve change in this lane.
2. Tests over all 14 live interim values, including `I-SF-2-NP`, `I-RR-NP` and `I-PUD`, plus the
   existing falsifier fixtures, which must still pass unchanged (CS-1 longest match, `SF-4`
   unrecognised, `SF-4.5` unrecognised, and so on). One test fails if the qualifier rule is removed.
3. The no-account skip, with a test in both directions: a `prop_id '0'` feature writes nothing
   and is counted; a real account still writes.
4. The two counts on every leg of the CLI output.
5. Re-run the three dry runs (Hays, Williamson, Travis) on the LDT STAGING store only, under a
   heavy-scan lease (`scripts/heavy-scan-lease.mjs` in doc_repo), and report per leg: features,
   accounts, skipped (by reason), matched base, of which interim, planned development,
   unrecognised (every value with its count), and null.

### Falsifiers, pre-register your answers first

1. After the change, the Hays and Williamson interim parcels match a base, and the unrecognised
   count falls by at least the interim count on each leg.
2. `I-SF-2-NP` parses to base SF-2, overlay NP, interim true (test).
3. With the qualifier rule removed, a test fails.
4. Travis's stamped-row count in the dry run equals its account-bearing feature count, and the
   skipped count equals the no-account feature count.

### Do not

- Apply the stamp, write any store other than through `--dry-run` on staging, merge, or deploy.
- Edit `austin-tx.json` or any setback table.
- Launch sub-agents.

### Close

Snapshot; files touched; PR #712's new head with every CI check's literal conclusion string;
the four falsifiers with evidence; the dry-run table. `status`: `closed-partial` until the
integration seat applies the stamp and P-255's census re-run shows Austin's district misses
falling. `probe`: `{"notApplicable": "build lane; graded by the census re-run after the stamp is
applied"}`. `subAgents`. `leave_behind`.
