# Mission — five parallel items, none blocked by containment

Williamson and Travis own the store. **Nothing in this card needs it.** All five items
are code, commit, or deploy, and they run alongside the containment work.

Four repos, one seat. Open a registered worktree per repo; do not work two items in one
checkout.

Ordered by deadline, not by size. **Item 1 has a hard deadline and the others do not.**

---

## 1. CAD-FIELDS-TWIN — land it before Wave R, and fix the zero defect first

Branch `feat/p91-cad-fields-twin` on the LDT worktree, **code-done and uncommitted**.
Five CAD value fields onto the twin, 48/48 tests, both falsifier arms, multi-county.

**The deadline is the point.** New fields reach the twin only after a bake, and the
standing ruling is one more production bake, Wave R, then no re-bake. Merged before it,
these ride a bake already happening. Missed, they wait for one the operator has ruled
against.

**BEFORE you commit it, fix a defect the planner introduced.** `positiveDollarOrNull`
turns a stored `0` into absent. Measurement says that is wrong: Bastrop carries
**26,553 improvement values at a real stored zero**, and vacant land genuinely has $0 of
improvements. Turning those into absent says "we do not know" where we do know.

That collapses zero into absent, which is the three-states rule broken in the other
direction. The card that produced it said "never serve 0", meaning do not fabricate a
zero for a missing value; it was reasonably read as reject all zeros.

**Three states, and probably per field:**

```
key absent            -> absent, with a basis
key present, value 0  -> ZERO, a real value
key present, positive -> the value
```

Judge per field and say why. A `$0 land value` looks like missing data. A `$0
improvement value` looks like a vacant lot. A `$0 assessed value` may be a real
exemption. Do not apply one rule to all four because it is tidier.

Then commit by explicit pathspec, PR, green on the CI conclusion **string**, merge.

## 2. Wells collapse — the fix, not an apply

The 2,087 gap is diagnosed and it is **merged rows, not lost rows**: 12,079 present
hits collapse to 9,992 unique `(parcelKey, wellKey)`, and 9,992 + 56,921 = 66,913
written against 69,000 planned. **The writer cannot represent more than one well on a
parcel.** That is a data-model limit, and it would have recurred silently on all five
remaining counties.

The patch already written and uncommitted adds per-chunk `plannedIn`/`writtenOut` and a
`CHUNK_PK_COLLAPSE` refuse. Land it, and decide the model question: does a parcel with
three wells get three atoms under distinct keys, or one atom carrying three wells?
**Recommend one with reasoning.** The refuse is correct either way, because a silent
collapse is worse than a stop.

Second finding to keep: the writer recorded only totals, so **a count was standing in
for a record.**

**Do not apply wells to any county on this card.** Hays, McLennan, Travis and
Williamson stay held.

## 3. Alias regen — commit the product SQL

The factory-side alias work is uncommitted. Land `sql/p2-juris/_alias_seed.sql` and
`sql/p2-juris/04_alias_reconcile.sql` **only**; three CRLF-only dirties
(`03_all_county_fips.sql`, `_roster_six_touch.sql`, `_file_side_counts.json`) were
restored and must not be swept in. Confirm before committing.

The seed itself is already correct in doc_repo: exactly four rows changed, `certain`
holds at 33, needs-human 99 to 95, and the pin now matches the committed blob at
`7e5ac620…` (LF, not the CRLF `d3f6d340…`).

Still open and yours to recommend: whether the generator's permanent home is
`sql/p2-juris/` next to its only executable consumer, or the doc_repo rescue copy at
`scripts/alias-seed/` stands. Either way **replace the hardcoded `SCR` scratchpad
constant** with a path relative to the file.

## 4. C4 — deploy PE and prove it on the live gold

hauska-map #322 is **merged and not deployed**. A live GET of `48021:34137` still
returns `buildableAreaPct` **absent** with `buildableAreaSqFt 9350` and
`acreage.sqft 16673` both present.

**hauska-map does not auto-deploy on merge.** It needs a CLI deploy per app, and
Property Explorer is its own app with its own root directory. A Vercel CLI exit code of
255 does not mean the deploy failed — **judge by the live alias and the bundle, not the
exit code.**

**Done is the live GET**, not the deploy: that gold must return `56.1`
(9350 / 16673 × 100). Then re-run Gate 8 dayOne C4 on the deployed gold and watch it
move from fail to pass on an inhabited body.

**Do not close C4 on the PR.** A merged PR is not customer-done, and this one has
already proved it.

## 5. C3 second derivation — BUILD it, do not run it

C3 is confirmed weaker than carded: it passes an agreeing-and-wrong payload **and** a
present-but-disagreeing one (`A1` vs `PDD`). It never compares the two values. It fails
only the null/non-null pair and the present-versus-absent `rowState`. It is a null-shape
check, not a consistency check.

The real fix is a genuine second derivation: **CAD landUse at source against the served
`landUseFact.landUseCode`** — two independently derived inputs rather than two fields
from one payload.

**Build it and do not run it.** The comparison needs a store read, and the store belongs
to containment. Same compression that worked for the P5 families and the F-11 writer:
build against the shape, run when the store frees.

The presence-shaped label (Factory #47) stays. It is honest and it is not the fix.

---

## Serialization

None of these need the store. **Item 5 must not run its comparison**, and item 2 must
not apply. If any item finds it needs a store read to proceed, stop and report rather
than taking the store from containment.

## Do not

- Do not apply wells to any county.
- Do not run C3's comparison.
- Do not sweep the CRLF-only dirties into the alias commit.
- Do not close C4 on a merged PR, or judge a Vercel deploy by its exit code.
- Do not let item 1 miss Wave R.
- Do not work two items in one checkout.
- Do not commit in doc_repo; the planner holds those.

## Close

Use the exact CP1 / CP2 / CLOSE paths named at the end of this dispatch. Declare
snapshot per repo in the first output. State the falsifier for each item before running
it. For item 1, state the per-field zero decision and its reasoning. For item 2,
recommend the data-model shape. For item 3, recommend the generator home. `leave_behind`
named. Subagents do not commit.
