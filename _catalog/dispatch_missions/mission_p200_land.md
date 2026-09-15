## Mission — P-200 LAND: apply the setback group, close partial, hand the rest to P-211

You are the continuation of lane `p200-hays-rails`. Same plan row, same worktree, same
branch. You do not spawn sub-agents. The integration seat supervises you.

Exit-bounded verification: every command you run must terminate on its own; wrap anything that
could hang in `timeout`; never leave a watch, a tail or a dev server running.

**Read this first: your job is to LAND, not to finish.** Hays is in bad shape and gets a
dedicated session later. P-200 closing is what unblocks P-201, which cannot start while you
hold hauska-factory. Landing a clean partial is worth more right now than a complete Hays.

### What you are authorised to do

**The setback group apply, and only that.** `--apply --county=48209` for
`setbackFrontFt`, `setbackSideFt`, `setbackRearFt`, `setbackCornerFt`, `setbackRules`.

Operator go given 2026-09-14 on the basis of your own reconciliation, which the integration
seat checked: 35,365 value + 18,904 absentVerified + 566 notApplicable + 0 refused + 0
deferred = 54,835, reconciling exactly against the in-city population. Zero deferred retired
your CP1 falsifier on `zoningDistrict`.

The deploy is already done and verified by field: `factory-parcel-setback-cells` moved to
`sha256:2899bbae...d8a301` (generation 3) from a worktree HEAD confirmed equal to origin/main
`31aa5413f`.

### What you are NOT authorised to do, and must not drift into

**The envelope group does not apply.** `maxHeightFt`, `maxLotCoveragePct`, `maxFootprintSqFt`,
`parcelAreaSqFt` stay unapplied. You said plainly that you had not re-reconciled the six
contaminated cities for that job, and that honesty is exactly why it waits rather than riding
along on the setback reconciliation. It is carded as P-211.

Do not chase `agValuation`. Do not touch `maxImperviousCoverPct`, which is Travis-only by
ratified design and correctly excluded in Hays. Do not fix the `--city` county-boundary
defect you found; card it, do not build it.

### After the apply, verify at source and paste it

- Re-gate and read `parcel_gate_verdict` for 48209. Paste each of the five setback rails'
  verdict before and after. A rail that moves to an EARNED `refuse` naming a count is a
  perfectly good outcome; a rail that stays `excluded` means the apply did not reach it and
  that is a finding.
- Cell counts by kind for those five rails, read back from `parcel_record_cell`, compared
  against your predicted 35,365 / 18,904 / 566. **If the actual differs from the prediction,
  say so and explain the delta rather than reporting the prediction as the result.**
- `get_smart_site` at depth node on `48209:97658`. It returns `not-cut-over` on setbacks
  today; paste what it returns now. That is the customer-facing predicate and it is the one
  that matters.

If the store times out on read-back, verify from the job's execution status and say that is
what you did. Reads have timed out under writer load on this store today.

### Then CLOSE, and close partial

`status: "closed-partial"`. Not `closed`, because the envelope group and the row's other
members are real remaining gaps rather than rounded-off ones.

`leave_behind` must name every one of these, each with P-211 as its row:

```
- the envelope group for Hays, six contaminated cities never reconciled
- agValuation, passing in only Williamson and Travis, needs a scope call
- the --city filter carries no county boundary (pre-existing, you found it)
- Hays's reader slate holds 13 entries against Travis's 30
- the excluded-rail spread across the six counties
```

Release your lane claim when the close is filed. **Say explicitly in the close that P-201 is
now unblocked**, because a seat reading only your close needs to know hauska-factory is free.

### Falsifiers

- If the five rails do not all move off `excluded`, the apply did not reach what you predicted
  and the population you reconciled is not the population the writer paged.
- If cell counts come back matching your prediction EXACTLY to the row on all three buckets,
  check that you are reading the store and not re-printing the preview.
- If `48209:97658` still says `not-cut-over` after a successful apply, the slate and the cells
  are not the same gate and that is a bigger finding than this row.

### Do not

Convert any `unaccounted` cell to `absent-verified` to make a gate pass. Write to any
repository you do not own. Deploy anything further. Touch `smartcity-os` or
`smartcity-dashboards`.

### Close

`_inbox/<date>_p200-hays-rails_close.json`, `planRows` `["P-200"]`, `status`
`"closed-partial"`, with the before and after verdicts, the read-back cell counts against
prediction, the gold-parcel read, the merge SHA `31aa5413f` with CI conclusion strings, both
job digests, and the `leave_behind` above. `leave_behind: none` is NOT available to this lane.
