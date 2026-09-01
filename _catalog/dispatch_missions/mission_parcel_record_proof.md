# Mission — measure the Bastrop proof against the live store, and audit the not-applicable

## Split from PARCEL-RECORD-FIX

`PARCEL-RECORD-FIX` holds the type change, the commit and the config extraction, and needs
**no store**. This card holds the two items that do. They were split because the combined
card took the `cortex-prod` token for an hour while doing work that did not need it, and
blocked `DOLLAR-FIELDS` behind it.

Claim this only when you are ready to use the store, and release promptly. Two lanes queue
behind you.

## 1. The Bastrop proof was derived, not measured

`PARCEL-RECORD` reported 864,681 cells moving from `unaccounted` to a real state on existing
`cad_property` data, and that number was the card's headline deliverable. Its close says the
store was blocked, so the figure is **arithmetic over `CAD-SERVE-RECONCILE`'s published
aggregates** rather than a count against `cad_property`. That is a derivation wearing a
measurement's clothes.

**The block was avoidable.** Credentials are in Secret Manager and are not on disk by design:

```
gcloud secrets versions access latest --secret=PRODUCTION_NEONDB_URL --project=hauska-prod-497015
```

`psql` and the `pg` module are present. Never echo a value; pipe it to what consumes it.

**Re-run the proof live and report the measured number beside the derived one.** If they
agree, say so — the derivation is then vindicated and that is a real result. If they
disagree, the disagreement is the finding and it says something about `CAD-SERVE`'s
aggregates too.

Bastrop is 77,799 parcels by 52 rails, so 4,045,548 cells. Report the state counts.

## 2. `not-applicable` is 1,067,821 cells and the arithmetic does not close

That is **26 percent of the table asserted structurally absent before anything ran**.
Bastrop has 50,264 unincorporated parcels and 1,067,821 / 50,264 = **21.24**, not an integer,
so it is not a clean "N rails times unincorporated parcels."

**Audit it: which rails, on which parcel population, with what reason.**

`not-applicable` means the value **structurally cannot exist for this parcel**. Counties do
not zone unincorporated land, so zoning, setbacks, edges and envelope qualify there. Outside
that population it is an **unearned absence** — a claim the system did not establish, which
looks like coverage in every count.

If the audit shows cells stamped `not-applicable` on incorporated parcels or on rails with
no structural argument, **those are defects, and the honest state for them is `unaccounted`**.
Report the count that would move.

**Do not widen the definition to make the audit close.** If 21.24 turns out to be a bug, say
so; that is a better outcome than a clean number.

## What this card does not do

It does not change the type — that is `PARCEL-RECORD-FIX`. It does not fill any county, does
not acquire, does not bake, and does not run the other five counties.

## Do not

- Do not report a derived number as measured.
- Do not convert `unaccounted` to `absent-verified` anywhere.
- Do not widen `not-applicable` to make the audit close.
- Do not hold the store token while doing work that does not need it.
- Do not touch any repository other than the registered worktree you open.

## Close

Use the exact CP1 / CP2 / CLOSE paths named at the end of this dispatch. Declare snapshot and
`current_database()` in the first output. Report the measured Bastrop state counts beside the
derived ones and whether they agree, the `not-applicable` audit by rail and population, and
how many cells would move to `unaccounted` if the unearned ones were corrected. Name what
contradicted this card, or say plainly that nothing did. `leave_behind` named. Subagents do
not commit.
