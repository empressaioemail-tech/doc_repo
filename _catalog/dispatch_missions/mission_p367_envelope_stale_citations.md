## Mission — P-367: envelope cells written under an older corpus cite the pinned one

You launch no sub-agents (FAN-DEPTH 0). You build in `hauska-factory` only and open one PR from current
`origin/main` with the SHA declared (`415d3212` at compile). You do not merge, deploy, apply or write any
store; the integration seat does.

### What is wrong (measured by P-363, read-only)

P-363 fixed the setback writer (`src/jobs/parcel-setback-cells.mjs`, merged `415d3212`): a value cell it
wrote under a corpus older than the pin is now released and re-resolved. It measured the envelope writer
and left it for this row (`_inbox/2026-09-18_p363-setback-stale-corpus-cells_close.json`, `leave_behind`;
`_inbox/2026-09-18_p363_dryrun/P363_ENVELOPE_RERESOLVE.json`):

- `src/jobs/parcel-envelope-cells.mjs` has the same frozen shape: `UPDATE_ENVELOPE_CELLS_SQL` has no
  `kind = 'value'` release term, so a value it wrote is never reopened.
- **709,945** of its value cells cite `@empressaio/setback-corpus@1.1.0`, over **348,042** parcels, while
  the pin is 1.4.0.
- Re-resolving all **509,152** height and coverage cells under the pin moves **zero** values. This is a
  citation refresh, not a value repair.

### What to build

1. **The same release, not a second copy of it.** Release a value cell this job wrote (identify it by
   its own `source` prefix, as P-363 does) whose corpus version is older than the pin. Reuse P-363's
   exported helpers (`corpusVersionFromSource`, `compareCorpusVersions`, `staleCorpusValueGateSql` and
   their siblings) rather than re-deriving them; if they need to move to a shared module, move them and
   say so. The pure predicate and the SQL gate stay pinned to each other in both directions, as in
   P-363.
2. **Three outcomes, counted.** Re-stamp (citation and dates only, values unchanged), value change (old
   beside new), new refusal. The prediction is all re-stamps: 709,945 cells over 348,042 parcels, 0 value
   changes. A dry run that differs is a finding: explain it before you close.
3. **Name every cell, not just the value changes.** P-363's durable record names value changes only,
   and records re-stamps as counts. ENFORCEMENT: a count is not a record. The run's durable record must
   name every cell it moves (placeKey, rail, from-version, to-version), written before the write commits,
   or the write does not run. If a single run event would be too large, write it in bounded chunks and
   say how the chunks are keyed.
4. **Dates follow the row.** As in P-363: the pinned row's readable effective date is carried; an
   unreadable one stays unreadable; never fabricate a date.

### Verify by violation

Pre-register your falsifiers: a 1.1.0 envelope cell whose pinned row gives the same numbers re-stamps
with values unchanged; a cell citing the pin is untouched; a cell another producer earned is untouched;
the record names every moved cell (a run with the record write forced to fail writes nothing); the
predicate and the SQL gate disagree when either is changed alone. Show each failing on the pre-change
code. Then a read-only dry run per county under the heavy-scan lease, beside the prediction.

### The three-question gate

What executes the release, what triggers it (any run after a pin move), what fails when a stale citation
survives a run, and what bypasses it (a hand UPDATE; a second writer on the envelope rails; a pin moved
without a re-run).

### Constraints

- No store writes, no deploys, no merges. Williamson 48491: dry-run only (P-350).
- What a customer reads comes from the bake; this changes ledger cells. Say whether anything you touch
  is read by a serving surface directly.

### Close

Declare: the start commit and PR, the shared-helper decision, the per-county dry-run counts beside the
prediction, the record's shape, the falsifiers with both directions shown, the three-question gate
answers, and `leave_behind`.
