---
title: Every parcel in every county starts with a full record
date: 2026-09-01
status: active
decision_type: standing rule
---

# Standing rule

**Every parcel, in every county, is instantiated with the complete column set from the
moment it exists.** Acquisition changes a cell's **state**, never a cell's **existence**.

A parcel record is never partially shaped. It is fully shaped and mostly unaccounted, and
it fills in.

## The rule

Every cell holds exactly one of:

| state | obligation |
|---|---|
| `value` | the value, with provenance: source and vintage |
| `absent-verified` | a **basis** — something looked, here is where and why not |
| `not-applicable` | a **reason** — it structurally cannot exist for this parcel |
| `refused` | a **named refusal** |
| `unaccounted` | nothing has looked yet. Honest, countable, and **not publishable** |

`unaccounted` is a legitimate state at rest. It is the starting state of nearly every cell
and there is no shame in it. What is prohibited is a cell that **does not exist**, and a
publish while any cell is `unaccounted`.

## Why this, and why it explains the tail-chasing

**A missing column is invisible. An unaccounted cell is countable.**

Under the old shape a field appeared when something wrote it, so a field nobody had built
an acquisition path for was indistinguishable from a field that did not apply, which was
indistinguishable from one nobody had thought of. Every gap analysis could only see the
fields that already existed, which means every gap analysis was structurally incapable of
finding the largest gaps.

Worked examples from 2026-09-01 alone, all of which this rule makes visible on day one:

- **Permits** were missing from the *contract*, not from a parcel. No parcel could say
  anything true about permits, and no count could show they were missing.
- The five `#575` CAD value fields were **blank-no-state** on all six golds — present in
  the type, absent from the body, silent in every presence-shaped count.
- **Zoning ingest had no home in any collect card** and had been an orphan for the length
  of the program while the setback engine ran on 188,103 placeholder rules.
- The 2026-08-31 and 2026-09-01 owner measurements disagreed by 70 rows and produced five
  wrong mechanisms, because two scopes asked different questions about a population nobody
  had pinned.

Each was found by accident, late, by a different route. Under this rule each is a cell
count on the day the parcel is created.

## Prefer the type over the check

Where the shape can carry this, it should. A parcel record whose column set is a closed,
compiler-enforced union cannot be missing a cell, so there is no trigger to be absent and
no call site to be missed. That removes the whole defect class rather than checking for it.

The gate in `CELL-LEDGER` catches unaccounted cells. **This rule makes missing cells
impossible.** The rule is the stronger of the two and the gate is its backstop, not its
substitute.

## What this does not license

**It does not mean every cell gets a value before production.** That is unreachable once
unsourced jurisdictions, private recorded instruments and structurally absent data are in
scope, and pursuing it puts the pressure on fabricating values — the defect class this
operation keeps finding.

`unaccounted` blocks a publish. It does not block the record from existing, and it is never
to be converted to `absent-verified` to clear a gate. `absent-verified` is a claim that
something looked; writing it where nothing looked is a lie that passes every check.

## Scope

All parcels, all counties, not only the six. The six are where it is being proven.

## Reversal criteria

Reverse if instantiating the full column set proves prohibitively expensive at national
scale — measure it on the six before assuming either way.

Reverse if `unaccounted` starts being treated as an acceptable serving state rather than a
pre-publish one. The rule depends on `unaccounted` being both honest at rest and fatal at
publish; if the second half decays, the first half becomes cover.

**Watch for the conversion.** If `unaccounted` cell counts fall sharply without a matching
acquisition landing, something is being relabelled rather than sourced. That is the failure
this rule is most likely to die of, and it will look like progress.
