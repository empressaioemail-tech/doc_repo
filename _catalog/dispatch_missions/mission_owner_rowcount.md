# Mission — one count settles it: are the atoms gone, or just their keys?

## Read-only. One question. Do not strip.

## Three mechanisms are dead and a fourth was killed wrongly

Dead: `#371` (nothing has moved since 2026-08-12), wrong-database
(`current_database() = hauska_mcp`), and the JSONB-predicate hypothesis — all three forms
(`?`, `->>` IS NOT NULL, `<> ''`) returned the same lower numbers, and the 39
Hays/Travis/Williamson bodies have **no `ownerName` key at all**. The keys are gone, not
null-valued.

**Deletion was rejected by the planner on bad reasoning and is back.** The argument was
"a deleted atom loses both fields, so a one-sided delta cannot be a delete." That holds
only for atoms carrying both. Delete atoms with `ownerName` and **no**
`ownerMailingAddress` and mailing counts do not move:

| county | atoms with name but no mailing (2026-08-31) | observed name drop |
|---|---|---|
| 48021 Bastrop | 30 | 5 |
| 48055 Caldwell | 214 | 2 |
| 48209 / 48453 / 48491 | **all** of 29 / 3 / 7 | 29 / 3 / 7 -> 0 |

Those three small counties fit deletion exactly: every name-carrier had no mailing key, so
deleting all of them yields zero and zero, which is what was measured.

## The measurement nobody has taken

**Count `cad-parcel-roll` atoms per county, total, right now.** Against 2026-08-31:

| county | roll atoms 2026-08-31 |
|---|---|
| 48021 Bastrop | 77,078 |
| 48055 Caldwell | 48,384 |
| 48309 McLennan | 114,280 |
| 48209 / 48453 / 48491 | record what they were and are |

**If the totals dropped by 5 / 2 / 24 / 29 / 3 / 7, atoms were deleted** and the question
becomes what deleted them. **If the totals are unchanged, the atoms are all present and
their `ownerName` keys were stripped in place** by a write that left no `updated_at` — a
silent write path, which is the worse finding.

Those two are mutually exclusive and one count separates them. Take it before anything else.

## McLennan is the case that discriminates hardest

McLennan's mailing count (114,254) **exceeds** its name count (113,384), so set arithmetic
alone cannot say how many rows carry name-without-mailing. It may be zero.

**If McLennan has zero name-without-mailing rows, deletion cannot explain its -24** while
still explaining the others, and the mechanism is mixed or is not deletion at all. Measure
the overlap directly:

```
count(*) filter (where body ? 'ownerName' and not (body ? 'ownerMailingAddress'))
```

per county. That number is the ceiling on what deletion can explain.

## The other survivor: recover the 08-31 query

The 2026-08-31 measurement may simply have asked something none of the three forms asks —
a different table, a different tenant set, a join that duplicated rows, or `cad_property`
rather than the atom body.

`_decisions/2026-09-01_owner_policy_and_portal_access_rulings.md` records the **numbers**
and not the SQL. **Look for the query itself** in the 2026-08-31 session artifacts,
`_inbox/2026-08-31_capability_inventory.md`, and any close from that date. If you find it,
run it verbatim today: if it returns the old numbers the data never changed and this is
closed. If you cannot find it, say so — an unrecoverable instrument is itself the finding,
and it means the 08-31 numbers can never be reproduced.

## Do not

- Do not strip. No card authorises a mutation, and stripping destroys the evidence.
- Do not update, delete, or write anything.
- Do not conclude deletion from the totals alone without the name-without-mailing ceiling.
- Do not re-run the three JSONB forms; they are settled.
- Do not touch `owner-fact` or `cad_property` except to read a candidate 08-31 query.
- Do not touch any repository other than the registered engine worktree you open.

## Close

Use the exact CP1 / CP2 / CLOSE paths named at the end of this dispatch. Declare snapshot
and `current_database()` in the first output. Report the per-county roll-atom totals then
and now, the name-without-mailing ceiling per county, whether the 08-31 query was
recoverable and what it returned, the mechanism, and the second mechanism you rejected.
Name what contradicted this card, or say plainly that nothing did. `leave_behind` named.
Subagents do not commit.
