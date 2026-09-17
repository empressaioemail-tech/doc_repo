---
id: 2026-09-17b_phase0_applies_and_serving_claude_code
title: "Session: P-256 and P-266 applied across the six counties, ETJ and the corpus reach customers, Williamson unblocked, fifteen lanes integrated and six fired"
date: 2026-09-17
last_updated: 2026-09-17
kind: session
session_type: integration
status: closed (operator-called close; handoff at _inbox/2026-09-17c_HANDOFF_integration_seat.md)
agent: claude_code
repo: doc_repo
owner: nick
seat: integration
programs: [OPS-24, OPS-16]
related:
  - _inbox/2026-09-17b_HANDOFF_integration_seat.md (consumed)
  - _inbox/2026-09-17c_HANDOFF_integration_seat.md (the next session starts here)
  - _inbox/2026-09-16_texas_scaleup_ROADMAP.md (updated through close)
  - 90_operations/OPS-16_texas_market_plan_of_record.md (A-207 to A-211; rows P-306 to P-318)
  - _sessions/2026-09-17_serving_cutover_and_lane_integration_claude_code.md (the session before this one)
---

# Session: the applies landed and the serving path caught up

This session took the seat mid-afternoon from session 06a91261, which the operator had reopened
only to restart the republish. It closed the six-county republish, applied the two largest ledger
corrections the program has run, put four more changes on the customer surface, integrated fifteen
lane closes, and fired six new Phase 0 lanes.

## What shipped, each verified at the surface or the authoritative row

**P-303** (the panel draws Waco-type parcels). Property Explorer `mfesp954e`. Waco `48309:103015`
read `declined / no-zoning-stamp` at 15:47:34Z and `ok / envelope-unverified / figureWithheld` with
no area figure at 15:49:48Z. Three no-district Bastrop controls still decline.

**P-304** (no area figure without a verified atom). cortex `00822-wef`, canary first then shifted
under a traffic lease, graded 9 of 9 on the canary and again on the customer surface: the
unverified Hays parcel carries neither area key and still draws; the entitled Bastrop parcel keeps
19,052 and 63.5.

**P-307** (a lease key names a real store). factory-control `00010-hax`, graded 4 of 4 against the
old revision as the control: `factory-store` accepted before, refused `LEASE_STORE_INVALID` after,
the direct host still accepted, and the pooler spelling now collides with the direct one.

**P-296** (ETJ reaches a customer). `0102` applied by hand with its tracker row; the ingest run as a
session CLI under a production lease, writing 355 rings from 20 publishers and 23 source rows,
verified by querying the tables rather than reading the CLI's own summary; cortex `00824-qay`. The
Austin ETJ parcel moved from `unresolved` to `present` with its ring named.

**P-299's engine half with P-282's slate.** retrieval-api `00100-hut` and engine-api `00251-qed`.
Hays's six record-overlay rails now serve from their own cells; every other county is identical
rail for rail.

**P-306** (the coverage floor compares one keyspace). Proven by Williamson's staging publish passing
at retention 1.1666 scoped, against 0.575 unscoped.

**P-305 and P-318.** #410 could not merge because a required check could not run for a
workflow-only change, and `enforce_admins` refused the bypass. P-318 fixed the trigger; #410 then
merged through the normal path.

## What was applied to the stores

**P-256, all six counties.** 1,097,360 setback cells — 219,472 parcels, exactly the P-255 census
population. Before applying, a read-only census measured the parcels the writer's own gate could
move: it equalled each county's A-199 ceiling exactly, and the applies then moved exactly that set.
Hays's envelope writer additionally filled 111,802 cells that P-145's retired exclusion had left.

**P-266/P-268, five counties plus one zoning run.** situsState is now resolved per parcel
everywhere, with exactly the two out-of-state refusals the lane named and no parcel left silent.
Williamson is held under the operator's D1 ruling, because its apply would write CAD absences on all
282,569 parcels.

**P-296's ETJ tables**, above.

## What was decided (operator rulings, recorded in OPS-16 A-207 and A-209)

Williamson stays held and the override token is never passed; the lease-key gap is carded; the
publish crash and the reaper's stale lease are carded; the third name of the withheld area figure is
carded; the read-only lease-table grant is carded. The Austin stamp was held until P-296's lane
established the production path, which it did at source.

## What was found

- **A lease taken under a nickname contends with nothing** (P-307), and the same class covers a Neon
  pooler hostname. One store carried two concurrent heavy windows with both callers told they held
  it.
- **P-306's fix makes a county's first-ever publish refuse** `COVERAGE_UNMEASURED`, because a
  grouped query returns no rows for an empty county and the code reads that as unmeasured. Carded as
  P-317, a Burnet precondition.
- **A required check that cannot run blocks its own pull request** and teaches people to bypass
  protection (P-318).
- **The Hays publish crashed mid-county** on an unhandled database-connection error, leaving the
  county served from two same-day bakes and its lease held by a dead job (P-312, P-313).
- **Hays's join-miss companions moved 2,770 cells where the lane measured 1,069.** Unexplained, and
  it matters because P-308's follow-on will retire the job-level step on the claim that it moves
  nothing.
- **P-254's first run**: 11 open, 5 closed and 7 unmeasured of the 23 known customer-visible
  defects, with every bucket capped at UNMEASURED until an MCP token exists.

## Mistakes, stated

- I compiled P-318's dispatch and did not commit it before the operator fired the lane, so the lane
  could not find it. Lanes read `origin/main`, not my working tree. Every later dispatch was
  committed and pushed before it was handed over.
- I graded the engine-api export with invented gate-front header values and read the resulting 401
  as a gate refusal rather than as my own error. P-254's instrument carries the real values.
- I twice wrote a node one-liner with `/p/tmp` paths, which node resolves against the current drive.

## Open at close

0103 is retrying behind the Williamson publish's table locks and has applied nothing; the Austin
stamp follows it. Williamson's production publish was running. The gate's verdict table predates
today's applies, so the completeness re-grade is owed. P-263's apply needs the operator's go, and
P-254's MCP leg needs a token. Six Phase 0 lanes are running.

## After the close: the publish that was running emptied the county

The session was reopened because Williamson's production publish completed and retired **all
602,050 served tier-1 rows for 48491**, including the 319,480 numeric rows that were live on the
2026-09-10 bake. The county was dark on the customer surface from 19:26Z. The published parcel
index is R-keyed, the served nodes are numeric-keyed, and the retirement step differenced one
keyspace against the other. P-306 had fixed the coverage FLOOR for exactly that split, so the floor
passed at retention 1.1666 while the writer emptied the county.

Production payloads were 1,579-byte retirement stubs against 2,226-byte payloads on a point-in-time
branch taken four minutes before the publish started, so facts were destroyed and un-retiring keys
would not have restored them. The rows were copied back over `dblink` in ten batches under a
heavy-scan lease: 319,480 restored, exactly the pre-incident count, verified by an independent
census and on the customer surface, with the R-keyed retirements shown still intact. The full
record is `_inbox/2026-09-17_williamson_mass_retirement_INCIDENT.md`.

**The finding worth keeping is not the defect.** ENFORCEMENT.md has said "a mass state change
refuses before it lands" since the 2026-09-15 Bastrop reconcile retired 92.5 percent of that county
by the same presence-shaped comparison. Nobody built the refusal. Two days later the class took a
second county through a different writer. A doctrine paragraph is not a control. P-320 builds it.

I also stopped my own 0103 retry loop: it was taking the production lease every three minutes,
applying nothing, and it blocked the recovery's first attempt.

## And the operator ruled that we ship without Cotality

The vendor is about two weeks out, so it leaves the critical path: struck from the Phase 0 exit,
P-267 and P-283 deferred to Phase 1, and P-322 ships the rails it would have filled as declared,
labelled absences. `_decisions/2026-09-17_ship_without_cotality.md`.

Fixing that ruling's home surfaced a live defect in the canon preamble. The fleet-wide bullet in
`_state/shared/STANDING_DECISIONS.md` still read "COTALITY IS EXTINGUISHED", a third and wrong
state, and every regeneration of `_STATE.md` propagated it into the preamble of every compiled
dispatch — which is why the six dispatches fired earlier today carry it. The source is corrected
and the preamble hash moved to `v0d6978dd`.
