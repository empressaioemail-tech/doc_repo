## Mission — P-211: the six-county circle-back, so Hays stops being the odd county out

P-200 applied the Hays setback group and closed. This row is everything P-200 left behind,
gathered in one place so the leftovers are countable rather than remembered. The row cannot
close while any member is merely noted.

### The finding you are acting on

Hays is the worst of the six onboarded counties at 31 of 65 rails passing. P-200 moved the
setback group and deliberately did not touch the rest. Five members were measured and handed
forward; each needs a verdict of FIXED, RULED OUT OF SCOPE, or PROMOTED TO ITS OWN ROW.

1. **The ENVELOPE group for Hays** — `maxHeightFt`, `maxLotCoveragePct`, `maxFootprintSqFt`,
   `parcelAreaSqFt`. Six contaminated cities (Austin, San Marcos, Buda, Creedmoor, Niederwald,
   Uhland) were never reconciled the way the setback group's were. The code is deployed
   (generation 4, digest `ec2cd3bf...e1643a`) and was never run for these.
2. **`agValuation`** passes only in Williamson and Travis. Whether to extend it is an OPERATOR
   SCOPE CALL, not an engineering fix. Do not extend it on your own judgement; state the
   recommendation and stop.
3. **The `--city` filter carries no county boundary.** On `parcel-setback-cells.mjs` and
   `parcel-envelope-cells.mjs`, a city name shared across in-scope counties (those same six)
   combines BOTH counties' parcels in any `--city`-scoped run. Pre-existing, affects all six
   counties, found by the P-200 lane.
4. **Hays's reader slate** (`PARCEL_RECORD_SLATE`, hauska-engine `parcel-record-slate.json`)
   holds 13 entries against Travis's 30.
5. **The excluded-rail spread** across the six counties beyond P-200's nine — the full 65-rail
   grid.

`maxImperviousCoverPct` is **NOT a member**. It is Travis-only by ratified design (engine #444)
and excluding it elsewhere is CORRECT. Do not "fix" it.

### START HERE, and do not skip it: the gate is not the customer surface

P-200's own pre-registered falsifier 3 FIRED and it is the most important thing it found.
After the apply, `get_smart_site` on the gold parcel still returned `not-cut-over` with the
**identical runId and bakedAt as before the apply**. The cells were written, the gate passed,
and the customer surface served a cached bake (`mode: baked-facet-intel-v1`).

**Every close graded on gate verdicts has been grading something the customer may not see.**
Before you report ANY member as fixed, read it on the customer surface as well as the gate, and
if the two disagree, report the disagreement rather than the gate verdict. A rail that passes
the gate and does not reach the serve is not fixed.

### Known traps, each verified at source

- **Area-sweep, not parcel-sample.** Sampling certified a broken Bastrop once. Measure the
  population, not a handful of parcels.
- **The atoms store is on Neon database `hauska_mcp`.** A query against the wrong database
  returns a FALSE ABSENCE that looks exactly like a real one.
- **Hays's node id is the parcel-map id** (ruled 2026-09-13). Account attributes reach a parcel
  only through the crosswalk. Never join by a bare number, and verify any geometry claim by its
  ring rather than its label — the Hays chimera class is one parcel's polygon under another
  account's label, and a label match proves nothing.
- **`has_writer` / `atomFamilyState` are HAND-DECLARED, not derived.** If a writer merges during
  this lane, the declaration must be refreshed or the grid lies.
- **The geometry scorer counts ACCOUNTS where the source has FEATURES.** If a percentage looks
  wrong, fix the denominator, never the writer.
- **Factory store reads time out under writer load.** Verify a run from its execution status,
  not by querying the store while it writes.
- **The gate grades 17 of 65 rails.** "Unaccounted is fatal at publish" is unenforced for the
  other 48, so a passing gate is not a statement about the whole grid.
- **Never pipe an enumeration through `tail`.** It silently truncates and a zero result reads as
  "nothing is wrong".

### Done looks like

Every one of the five members carries a written verdict — fixed, ruled out of scope, or promoted
to a named new row — and none is left as a note. The envelope group for the six contaminated
cities is either reconciled and re-run or explicitly deferred with a row id. The `--city` county
boundary is either fixed or carded. The reader-slate gap is either closed or carded with the
count it would add. The per-county rail verdict query from A-153 is RE-RUN and its before/after
numbers are pasted verbatim, not summarised.

### Falsifiers, pre-register your answers before you run anything

Write down what result would prove each of these WRONG, before you run it. If no result would,
it is not a check.

1. If the envelope group's re-run changes a Hays rail from `excluded` to pass at the gate but
   `get_smart_site` on a Hays parcel returns the same `runId`/`bakedAt` as before, you have
   reproduced P-200's falsifier 3 and the member is NOT fixed — say so.
2. If a `--city`-scoped run for a shared city name returns a parcel count that matches the
   single-county expectation exactly, suspect your instrument before believing the filter works.
3. If the rail-verdict count improves by exactly the number of rails you touched, check that you
   are not counting the same rail twice through two names (the MUD rail duplicates
   special-district; that is a ruling and a declaration refresh, not a build).
4. If any member reads as already-fixed with no work, prove it by violating it rather than by
   observing it pass.

### Do not

- Do not extend `agValuation` scope. Recommend and stop.
- Do not write to a production serving store without the operator's go.
- Do not blanket-retire anything. P-219 flagged 3,788 of 16,751 layer-23 rows still authoring
  from the retired namespace, and blanket-retiring them would replace CORRECT values with an
  absence.
- Do not touch `maxImperviousCoverPct`.
- Do not spawn sub-agents that themselves spawn sub-agents. You own your fan.
- Do not deploy. Report what needs deploying; the integration seat ships it.

### Close

Close to `_inbox/` on doc_repo main and PUSH it. Declare `leave_behind` explicitly, even if the
answer is `none`. State the snapshot (repo, branch, commit) your work ran against, in the close.
