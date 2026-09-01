# Mission — the cell ledger: every parcel, every field, one accounted state, and a gate that refuses

## The operator's model, stated as a build

> "In my mental model it is a database built like a spreadsheet with all cells accounted
> for."

**Row: one parcel.** 981,405 across the six counties, from the containment totals.
**Column: one field in the declared serve shape.** **Cell: exactly one accounted state.**

```
value            the value, plus provenance
absent-verified  we looked; a basis says where and why not
not-applicable   it structurally cannot exist here; a reason says why
refused          a named refusal
--------------------------------------------------------------------
UNACCOUNTED      no state at all. THE DEFECT. Indistinguishable from never looking.
```

**The gate: a county cannot publish while any cell is UNACCOUNTED.** Not "every cell has a
value" — that is unreachable and chasing it produces fabricated values. Every cell has a
*state*.

## Do not build this beside the dead ledger

A county-by-rail ledger already exists and **its gating indicators are dead**: `hasWriter`,
`atomFamilyState` and `isPartial` are uniform across all 3,556 cells, so three tags can
never fire, and nothing recomputes it.

This ledger is a different grain — parcel by field, not county by rail — so it does not
duplicate it. **But say so explicitly, and say what happens to the old one.** If the new
gate makes it redundant, retirement is a decline plus a CI check that fails if it reappears,
and consumers get repointed before the store is retired, never the reverse. If it survives
for another purpose, name the purpose.

**Two ledgers where one is dead and nobody says which is authoritative is worse than
either.**

## The column set is derived, not authored

Take the declared shape from `origin/main`, not from this card:
`Tier1FacetPayload` (`baseFacts`, `baseFacts.cadRoll`, `zoning`, `envelope`,
`facetCoverage`, `provenance`), plus `Tier2EnvelopeFacet`, plus any field the
`CAD-SERVE-RECONCILE` close reports as served-and-undeclared.

**Add `permits` as a first-class column now**, ahead of its acquisition. A field that does
not exist cannot be honestly absent, and the operator has ruled permits is active work
rather than deferred. Until a jurisdiction is sourced, every parcel in it reads
`absent-verified` with a basis naming that jurisdiction as unsourced. That is a true
statement and it is visible; a missing column is neither.

Do the same for easements.

## Two states that are earned, not assumed

**`not-applicable` requires a structural reason.** Unincorporated land is genuinely not
zoned by its county, so zoning, setbacks, edges and envelope are `not-applicable` there —
370,289 parcels by the containment measurement, **not** the roadmap's 357,269, which is
wrong by about 13,020 in the split. Anything outside that population is not structural, and
stamping it so is an unearned absence.

**`absent-verified` requires a basis.** "We looked and it is not there" is a claim about an
act of looking. If nothing looked, the honest cell is UNACCOUNTED and the gate should fail.
**Do not convert UNACCOUNTED to `absent-verified` to make the gate pass.** That inverts the
whole instrument, and it is the single most likely way this build goes wrong.

## Known populations that must land in the right cell

- The five `#575` CAD value fields are **blank-no-state on all six golds** today. Those are
  UNACCOUNTED, not absent.
- `livingAreaSqft` is zero of 500,307 in Travis and zero of 114,255 in McLennan at source.
  Served with a source basis that is `absent-verified` and correct. Elsewhere it is
  Hays 54.3, Williamson 40.8, Caldwell 27.7, Bastrop 11.2 percent.
- `cityLimitsFact.status = unmeasured` and `etjStatus = unresolved` are **served pipeline
  words**, ruled out 2026-09-01. They are non-null, so they pass every presence-shaped
  count. They are UNACCOUNTED until converted.
- 188,103 **placeholder** `setback-rule` atoms; Hays and Williamson 100 percent placeholder.
  A setback derived from a placeholder is not a `value`.

## Verify the gate by violating it

**Before reporting the gate as working, poison a cell and watch a county fail to publish.**
Then repair it and watch the county pass. Both directions, on a real county.

A gate observed only passing has not been observed working, and this one will be trusted to
mean "ready for production" — so it gets the same treatment as any other control: name what
executes it, what triggers it, what fails when it is violated, and **what bypasses it**. The
answer to the last is rarely none. A publish path that does not consult the ledger is the
one to find now rather than after Wave R.

## Scale

Roughly 981,405 parcels by roughly 40 fields is on the order of 39 million cells. Both sides
are expressible in SQL, so **100 percent, materialised, per county** — no sampling. Wave R
is serial per county, so the gate must be answerable per county independently.

Report the cell counts by state per county. That table is the answer to "are we ready", and
it is the first honest completeness number this program will have.

## Do not

- Do not convert UNACCOUNTED to `absent-verified` to pass the gate.
- Do not stamp `not-applicable` outside the 370,289 unincorporated population.
- Do not count a placeholder-derived setback as a value.
- Do not author the column list by hand; derive it.
- Do not build beside the dead county-rail ledger without saying what happens to it.
- Do not report the gate as working until you have watched it fail.
- Do not fix any defect the ledger surfaces. This card builds the instrument.
- Do not touch any repository other than the registered worktree you open.

## Close

Use the exact CP1 / CP2 / CLOSE paths named at the end of this dispatch. Declare snapshot
and `current_database()` in the first output. Report the derived column set and its source,
the per-county cell counts by state, what executes and triggers the gate and what bypasses
it, the violation test in both directions, and the disposition of the county-rail ledger.
Name what contradicted this card, or say plainly that nothing did. `leave_behind` named.
Subagents do not commit.
