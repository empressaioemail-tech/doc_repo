# Mission — the parcel record's type invites the defect it exists to prevent

## Four findings from the adversarial review of PARCEL-RECORD

The build is good and the rail set is right. `permits`, `pipelines`, `wells`, `easements`,
`setbackRules`, `specialDistricts` are all present, owner is excluded, MUD is merged into
`specialDistricts`, and the companion tables are real (`parcel_record`,
`parcel_record_cell`, `parcel_record_companion_row`). Fix these four.

## 1. `Partial<>` makes every cell optional, which is backwards

```ts
// record-shape.ts:35
cells: Partial<Record<ParcelRecordRailKey, ScalarCellState | CompanionCellState>>
```

The standing rule is that a record is instantiated with its **complete** column set and a
cell cannot be missing. `Partial` makes every key optional **at compile time**, so the whole
constraint rests on a runtime `assertFullRecordCells`.

**It is worse than neutral.** `Partial` tells every downstream reader the cells are
optional: `cells.marketValue` types as `| undefined`, and the natural next keystroke is a
`??` default. **That is how a blank-no-state is born**, and this module exists to make
blank-no-state impossible.

Make it a total `Record<ParcelRecordRailKey, Cell>`. Let instantiation be the only
constructor, so a record cannot exist without every cell. Keep `assertFullRecordCells` as a
backstop, but it should become unreachable.

Prefer the type over the check: a total record has no trigger to be missing and no call site
to be absent, which removes the defect class rather than testing for it.

## 2. The Bastrop proof was derived, not measured — and it did not have to be

The close says it: *"live store blocked: no CORTEX_DATABASE_URL"*. So `864,681` is arithmetic
over `CAD-SERVE-RECONCILE`'s published aggregates, not a count against `cad_property`. That
number was the card's headline deliverable and it is a derivation wearing a measurement's
clothes.

**Credentials are available.** They are not on disk by design:

```
gcloud secrets versions access latest --secret=PRODUCTION_NEONDB_URL --project=hauska-prod-497015
```

`psql` and the `pg` module are present. Never echo a value; pipe it to what consumes it.
Full method in `90_runbooks/seat_loop.md`.

**Re-run the Bastrop proof against the live store** and report the measured number beside
the derived one. If they agree, say so and the derivation is vindicated. If they disagree,
the disagreement is the finding.

## 3. `not-applicable` is 1,067,821 cells before anything ran, and the arithmetic does not close

That is 26 percent of the table asserted structurally absent **pre-measurement**. Bastrop
has 50,264 unincorporated parcels and 1,067,821 / 50,264 = **21.24**, which is not an
integer, so it is not a clean "N rails times unincorporated parcels."

**Audit it.** Report exactly which rails are stamped `not-applicable`, on which parcel
population, and the reason for each. `not-applicable` requires a structural reason — it
cannot exist for this parcel — and anything outside the unincorporated population is an
**unearned absence**.

This is the cell least likely to survive contact with the store, and it is where an unearned
absence would hide.

## 4. A hardcoded constant inside a portable template

`PARCEL_RECORD_TEXAS_COUPLED.sixCountyFips` and the `370,289` unincorporated figure are baked
into the template. Naming the coupling was right; leaving it is not.

**Make both configuration inputs.** The six counties are where this is proven; the second
state is where it pays, and a template that must be edited to move is not a template.

## And commit it. Fourth occurrence today.

The clone sits on **`main`** at `10dfc10` with four dirty files, on no branch, nothing on
origin. The most important module in the program exists only in `P:/tmp`.

`covers-fastpath`, the `a3`/`a4` trees and `gold-probe` all did this. `seat_loop.md` requires
committing and pushing your own branch **before** writing the close. Put it on a branch,
push, open a PR, and report the SHA before anything else.

## Do not

- Do not keep `Partial<>` and rely on the runtime assert.
- Do not report a derived number as measured.
- Do not convert `unaccounted` to `absent-verified` anywhere.
- Do not widen `not-applicable` to make the audit close.
- Do not close before the branch is pushed.
- Do not touch any repository other than the registered worktree you open.

## Close

Use the exact CP1 / CP2 / CLOSE paths named at the end of this dispatch. Declare snapshot and
`current_database()` in the first output, and report the pushed SHA before anything else.
Report the type change, the measured-versus-derived Bastrop numbers, the `not-applicable`
audit by rail and population, and the config extraction. Name what contradicted this card, or
say plainly that nothing did. `leave_behind` named. Subagents do not commit.
