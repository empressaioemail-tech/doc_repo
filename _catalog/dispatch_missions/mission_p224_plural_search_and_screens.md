## Mission — P-224: plural search is dead for the county this product is built on

You are a lane of OPS-24. You do not spawn sub-agents. The integration seat supervises you,
reviews CP1 and CP2, and runs the verification itself.

Exit-bounded verification: every command you run must terminate on its own; wrap anything that
could hang in `timeout`; never leave a watch, a tail or a dev server running.

### Part A — THE CONSEQUENTIAL ONE. find_parcels is dead for Bastrop

`find_parcels` for county 48021 refuses:

```
refused · constraint_projection_missing
"no constraint index rows exist for county 48021"
```

Root cause is already known and is not new: the `pe_parcel_constraint_index_builds` table is
empty for that county. **This seat found that on 2026-09-07 and never carded it**, so
county-wide plural search has been unusable for over a week on the design-partner county that
every demo, every probe anchor and the entire MCP QA walk is built on.

**THE REFUSAL ITSELF IS CORRECT AND MUST NOT BE WEAKENED.** Refusing rather than returning an
empty set is right, because zero matches and never-built are different facts and an empty set
reads as "no parcels match". Do not make it return `[]`. The defect is that the projection was
never built.

Done for Part A: either the Bastrop constraint projection is built and `find_parcels` answers
for 48021, or the county is declared out of scope for plural search with a reason a caller can
read. Also state, with a count, **which counties currently have a projection and which do not**
— nobody has that list, and the next person to hit this should not have to re-derive it.

### Part B — `resolved` means two different things

`add_to_screen` returns `resolution: "resolved"` and the resulting row carries **no six-rail
stub at all**. `create_screen` produces a full six-rail resolution for an equivalent resolved
row.

Same claimed state, two payload shapes. Either the word means one thing on both paths, or the
two states are genuinely different and must not share a token. Prefer splitting the type over
widening the meaning.

### Part C — MEASURE, do not assume. The screen count

`list_screens` with no arguments returned **2 screens** against roughly **30 previously seen on
this account**. `list_screens` by `screenId` reopens a board correctly.

The QA lane recorded this as UNRECONCILED rather than writing it off as its own error, which
was the right call. Resolve it by measurement: count the account's screens in the store and
compare against what the no-arg call returns. If the no-arg path filters, paginates or scopes
differently, say so. **An explained discrepancy is a fine outcome; an assumed one is not.**

### Known context, do not re-derive

- The 2026-09-07 finding of the empty `pe_parcel_constraint_index_builds` is the same root
  cause. Start there rather than re-diagnosing the refusal.
- `list_my_properties` was never called in either QA pass and is missing from the card's own
  coverage table. Not yours to fix; named so you do not treat the card as complete.
- P-223 covers the records tools. Out of scope here.

### Falsifiers, pre-register before you write anything

- If you make `find_parcels` return an empty set for a county with no projection, you have
  converted an honest refusal into a false negative. That is worse than the bug.
- If you build the Bastrop projection and cannot say which other counties lack one, you have
  fixed one county and left the same surprise for the next.
- If `resolved` still produces two payload shapes after your change, you renamed the symptom.
- If the screen-count gap resolves to "tester error", show the count that proves it.

### Do not

Weaken the `constraint_projection_missing` refusal. Touch `smartcity-os` or
`smartcity-dashboards`. Deploy without the operator's go — note that a merge to
legacy-design-tools main AUTO-DEPLOYS.

### Close

`_inbox/<date>_p224-plural-search_close.json`, `planRows` `["P-224"]`, with: the projection
built or the county declared out of scope, the per-county have/have-not list with counts, the
`resolved` payload reconciliation, and the screen-count explained by measurement.
`leave_behind` is required.

**Commit your close to doc_repo main and PUSH it.** Six lanes this week left doc_repo artifacts
stranded in a worktree where no instrument could see them.
