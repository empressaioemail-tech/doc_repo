# CTX-SITUS-SKIP — 18,037 rows are silently dropped by every bake, forever, and re-running cannot reach them

Repo: `legacy-design-tools`. This is the largest single blocker on the CTX board.

## The defect, already located precisely

CTX-PROV closed 2026-09-09. Read `_inbox/2026-09-09_ctx-prov_close.json` in full first,
especially `step3_mechanism` and `step4_population`. It did the diagnosis; you are fixing.

In `artifacts/api-server/src/nodeFacetBakeTier1ConformantCli.ts`, the per-row bake loop
(roughly lines 336-345 at `3885efad`):

    if (rollAbsent) { situs = situsForRetiredBake(body) }
    else {
      const { situs: s, refuse: refuseSitus } = situsForBake(body);
      if (refuseSitus) { skippedBadSitus += 1; continue }
      situs = s;
    }

`situsForBake` calls `assertSitusNotPunctuationOnly` (`serveGuards.ts`,
`PUNCTUATION_ONLY_RE = /^[\s,.\-;:'"`]+$/`). When it throws, `situsForBake` returns
`{ situs: null, refuse: true }` and the `continue` fires **before any database write**.

So an on-roll account whose CAD claim carries a punctuation-only situs is never written.
Its snapshot stays frozen on whatever pre-conformant shape it last held, across every
future bake run for that county, indefinitely. A re-bake does not reach it. It is not a
staleness problem that time or another run will clear.

## The population, measured live by full-table scan

    Bastrop    48021   16,104 of  77,799   20.7%
    McLennan   48309    1,165 of 114,255    1.02%
    Hays       48209      768 of 173,050    0.44%
    Caldwell   48055        0 of  48,649    0%
    Travis     48453        0 of 500,307    0%
    Williamson 48491        0 of 602,050    0%
                        -------
                         18,037

Not a sample. Predicate control: the query matched 1,516,110 rows overall, so a broken
`WHERE` reporting a false absence is ruled out.

## The asymmetry is a required question, not a footnote

Travis and Williamson are the two largest counties and both sit at exactly zero. Bastrop
sits at 20.7 percent. That is not a plausible difference in how real appraisal districts
record addresses; it points at a source or parser difference.

**Establish why before you fix anything.** Specifically:

- Are the affected rows disproportionately from one `source_file` lineage? Hays' own
  investigation on 2026-09-09 established that `cad_property` carries StratMap
  land-parcel rows alongside genuine CAD exports, and that StratMap overwrote
  `source_file` in place on some rows. If punctuation-only situs correlates with
  non-CAD-sourced rows, the right fix may differ by lineage and the whole framing changes.
- Does the CAD format matter? Bastrop, Caldwell and Travis are `pacs`; Hays and
  Williamson are `orion`. Bastrop and Travis share a format and sit at 20.7 and 0. So
  format alone does not explain it either. Say what does.

If you find the population is not what it appears to be, that is the finding and it
outranks the fix.

## The fix, and the shape it must NOT take

**Do not relax `PUNCTUATION_ONLY_RE`.** Do not weaken or bypass
`assertSitusNotPunctuationOnly`. Do not touch the serve guard. That guard exists because
this program was serving `", ,"` as an address, and it is correct. The guard is not the
bug.

**The bug is the response to it.** A bad situs is a fact about one leaf. The bake answers
it by discarding the entire row, which loses every other correct fact that row carries and
does so silently.

The honest shape is that a row with an unusable situs is **written with an earned absence
on the situs leaf**, carrying its basis, not skipped. There is already precedent in the
same function: `situsForRetiredBake` exists for the `rollAbsent` branch, added by
CTX-RETIRE. Mirror that discipline.

Constraints on the absence:

- It must satisfy `BP-CONTENT-01`'s four-state contract and pass `isEarnedLeafAbsence`,
  not be a bare null. A null situs is what caused a different blocker earlier today.
- Its basis must name the real reason, something a reader can act on, not a code.
- Never fabricate or infer a situs. Not from the parcel geometry, not from a neighbour,
  not from a ZIP centroid.
- `situsCity` and `situsZip` are separate leaves with their own states. Establish whether
  they are independently available when `situsAddress` is unusable, and do not blanket
  them absent if they are not.

**Do not silently count and move on.** `skippedBadSitus` is currently a counter that
increments and is, as far as this program can tell, never surfaced anywhere that would
have caught 16,104 rows. Whatever you do, the outcome must be countable and visible.

## What changes for customers, which you must state

Those 18,037 rows currently serve a stale pre-conformant snapshot. After a fix and a
re-bake they will serve a current row with a declared absence where the address was.

That is the correct trade — honest absence beats a stale value presented as current — and
it is a visible change on a launch surface. Say plainly in your close what a customer sees
before and after for one real parcel, by example, so nobody discovers it from a support
ticket.

## Verify by violating

Show the bake writing a row for a punctuation-only-situs account where it previously
skipped, and show that a genuinely malformed absence marker is still rejected. Both runs
pasted, exit codes from the process not a pipe.

Confirm rows with a normal situs bake **identically** to today. A diff that changes output
for the 1.5 million healthy rows is a regression, not a fix.

## What you must NOT do

Do not deploy, submit a Cloud Build, or run any Cloud Run job, bake, publish or walk. The
integration seat rebuilds the publish image from your merged main and runs the counties.

Do not write to hauska-factory, hauska-engine or hauska-map. `BP-CONFORMANT-01` and
`BP-CONTENT-01` live in hauska-factory and are not wrong; do not ask for them to be
changed.

Do not touch `MAX_MISS_RATE` or any gate threshold.

Two concurrent lanes are editing hauska-factory's `verify-walk.mjs` right now
(CTX-WALKRULE, CTX-ZONESCOPE). You are in a different repo and should not encounter them,
but if your fix appears to require a hauska-factory change, STOP and report rather than
reaching across.

## Close contract

Standard lane close JSON, plus:

- Why Bastrop is 20.7 percent and Travis and Williamson are zero, with evidence.
- Whether the affected rows correlate with a `source_file` lineage.
- The absence shape you wrote and how it satisfies `isEarnedLeafAbsence`.
- The disposition of `situsCity` and `situsZip` independently of `situsAddress`.
- Where the skip is now countable and visible.
- Before and after for one real parcel, as a customer would see it.
- Proof that normal-situs rows bake unchanged.
- `leave_behind`.

Report the merge commit. The integration seat rebuilds and re-runs the counties from it.
