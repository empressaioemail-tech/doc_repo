# Mission — strip the owner fields. The scope question is answered; use the entity_id range.

## Nothing ever changed. The question changed.

Five mechanisms were proposed for an apparent erosion and all five were wrong, including
four of the planner's. `OWNER-ROWCOUNT` closed it by recovering the original instrument:

- **`n_roll` is unchanged** in every county. Bastrop 77,078, Caldwell 48,384, McLennan
  114,280 — identical to 2026-08-31. Deletion is dead by the count, not by the planner's
  invalid one-sided-delta argument.
- **The keys are unchanged**, including Hays 29, Travis 3, Williamson 7. There was no
  silent write path.
- The 2026-08-31 measurement scoped by **half-open `entity_id` FIPS ranges**. The 2026-09-01
  cards scoped by **`jurisdiction_tenant = tx_{fips}`**. Those are different questions and
  the second one misses atoms.

**72 atoms** (5 / 2 / 29 / 26 / 3 / 7 across Bastrop, Caldwell, Hays, McLennan, Travis,
Williamson) carry `ownerName` and have a `jurisdiction_tenant` that is a bare FIPS or
**another county entirely**. A real Hays row: `entity_id 48209c5dc9…` — FIPS-plus-hash, not
`48209:propId` — with tenant `48453`, owner present, no mailing key.

## Therefore: scope by `entity_id`, never by tenant

```sql
entity_id >= '48021:' AND entity_id < '48022:'   -- and the same for each of the six
```

The range is on the **FIPS prefix**, so it captures every key form under that county —
`48209:propId` and `48209c5dc9…` alike — regardless of what tenant the atom carries. That
is precisely why it finds the 72 that tenant-scoping loses.

**A tenant-scoped strip would leave 72 atoms serving owner names on `public-free` and
would report success.** That is the failure this card exists to avoid. The full recovered
SQL is in `_inbox/2026-09-01_owner-rowcount_table.json`.

## What to strip

`ownerName` **and** `ownerMailingAddress` out of `cad-parcel-roll` bodies in `hauska_mcp`.
Predicate for selection, per the prior seat:

```
body ? 'ownerName' OR body ? 'ownerMailingAddress'
```

Nothing else on the atom, ever.

**No data is lost.** `cad_property` stays the source of record and is untouched;
`owner-fact` stays the paid home and is untouched. This removes a duplicate from an atom
whose `public-free` policy was never right for it.

## Method

**Measure at apply time under the `entity_id` predicate**, per county, and report it. The
counts in this card are context. Roughly 238,887 `ownerName` and roughly 239,472
`ownerMailingAddress` is the shape to expect, but the measurement governs.

**Dry run first**, and compare its counts to your own apply-time measurement rather than to
this card.

**Run row first.** No mutation without one. Chunk it and resume from the ledger; a
quarter-million bodies is not one statement.

**A count is not a record.** Every chunk emits a durable record naming the predicate, the
range acted on, the row count and the timestamp, so the set is re-derivable.

## Falsifiers

**After: zero under all three forms, on all six counties, scoped by `entity_id`.**

```
body ? 'ownerName'
body->>'ownerName' IS NOT NULL
nullif(btrim(body->>'ownerName'), '') IS NOT NULL
```

and the same three for `ownerMailingAddress`. A before-count and an after-check that use
different predicates prove nothing.

**Explicitly re-check the 72.** After the run, query the atoms whose tenant is a bare FIPS
or a foreign county and confirm they are zero too. They are the ones a tenant-scoped strip
would have missed, so they are the ones that prove this one did not.

**Untouched, all three:** `owner-fact` count and bodies unchanged; `cad_property.owner_name`
unchanged; every other field on the roll atom unchanged.

**The one that matters most:** a body that carried no owner field before must be
**byte-identical** after. A strip that rewrites untouched rows is a different operation from
the one authorised.

## Then close the exposure

The forward fix `hauska-engine #371` (`e3e1485ee39535d1819d438221063dd6eb9b955e`) stops new
writes; this card removes the existing pool. **Neither alone closes it**, so name both.

Add the regression test specified twice and never yet built: an anonymous `get_atom` on a
`cad-parcel-roll` DID returns a body with **no owner keys**. Without it, the next writer
that adds an owner field to a `public-free` atom reproduces this silently.

## Do not

- Do not scope by `jurisdiction_tenant`. That is the defect this card is built around.
- Do not skip a county because its count is small. Hays 29, Travis 3 and Williamson 7 are
  real exposure and are in scope.
- Do not apply without a clean dry run.
- Do not touch `owner-fact`, `cad_property`, or any other field on the roll atom.
- Do not add an MCP field stripper; the ruling rejected it and the policy is the protection.
- Do not run into a Tuesday 05:00-06:00 UTC Neon maintenance window.
- Do not touch any repository other than the registered engine worktree you open.

## Close

Use the exact CP1 / CP2 / CLOSE paths named at the end of this dispatch. Declare snapshot
and `current_database()` in the first output. Report apply-time counts per county, the set
actually stripped, all three after-forms per county, the explicit re-check of the 72
foreign-tenant atoms, this run id and `#371`'s merge SHA. Name what contradicted this card,
or say plainly that nothing did. `leave_behind` named. Subagents do not commit.
