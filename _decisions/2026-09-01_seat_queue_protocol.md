---
title: Seat queue protocol — cards are claimed against refusals, not handed out
date: 2026-09-01
status: active
decision_type: operating protocol
---

# Decision

Seats coordinate through a file-based card queue in `_queue/`, claimed through
`scripts/queue/cli.mjs`, which **refuses** rather than dispatches. The planner enqueues
cards pointing at compiled dispatches; a seat on wake asks what it may claim; the queue
answers with a grant or with named refusals and a non-zero exit.

The operator's hand-carry stops being the transport layer for every card. It remains the
authorisation path for merges, deploys, and anything irreversible.

## Why now

Hand-carry is the measured bottleneck. On 2026-09-01 the planner compiled four cards in
about an hour and the operator could carry them one at a time. Remaining CTX work is
thirty-plus cards: four PE defects, a P3 build, roughly seven rails, fourteen P5 families,
then P6, P7 and P8.

The hard parts already existed. `scripts/dispatch.mjs` compiles cards with the canon
preamble, the agent contract and a validated plan row; the canon-gate hook refuses
malformed dispatches; `_catalog/seat_register.json` names worktrees and branches per seat;
427 `close.json` artifacts are already on disk. What was missing was a claim, a store
token, and a wake.

## What was built

`scripts/queue/lib.mjs` holds `evaluateClaim`, a pure function returning accumulated
refusals. `cli.mjs` provides `status`, `claim`, `release`, `addendum` and `enqueue`.
`self-test.mjs` asserts all refusal codes fire and asserts the inverse arm on every
refusal that has one, plus an explicit not-vacuous case: 48 assertions, all passing.

13 refusals; `scripts/queue/lib.mjs` exports `R` and is the authority on the list. Do
not restate the count in prose without re-reading it — this paragraph was stale within
hours of being written and the property seat caught it.

Each answers a failure this operation has actually had, not a hypothetical:

**`WRONG_SEAT`** is SEAT-01 enforced instead of remembered. Prose controls here are 0 for
3; hook-shaped controls are 1 for 1.

**`STORE_TOKEN_HELD`** exists because store-time is the only genuinely serial resource on
the board and the entire wave plan is cut around that. Exactly one card holds a store.

**`MAINTENANCE_WINDOW`** exists because on this same day the Tuesday 05:00-06:00 UTC Neon
window forced a defensive termination of run `fb490620`, and the guard lived only as a
sentence in one card and was omitted from the card that actually launched a long job. It
is now arithmetic with both edges asserted.

**`ALREADY_CLAIMED` blocking the same seat** exists because on this same day the planner
launched Travis directly while a lane held a card telling it to launch Travis. Only a
message prevented two concurrent writers on 380,917 rows.

**`DEPENDENCY_MALFORMED` on a missing `leave_behind`** makes dependency satisfaction a
contract check rather than a file-exists check.

## The three rules that make it safe

**It refuses, it does not fire.** The L3 fleet ruling says operate rather than rebuild and
never build parallel wrappers; the scan-fix post-mortem says fewer agents and tighter
contracts. A queue that starts work is the wrapper those rulings warn about. This one
grants permission to begin and starts nothing.

**Every card carries premises to re-verify at claim time**, printed on grant. A card
queued at 05:00 and claimed at 07:00 may be against a moved base: an alias pin flipped
between a CRLF blob and the LF blob actually committed, and a Bastrop license was recorded
as `1dda40f7` from a lane close while the store had already rebound to `85f984c2`.

**Every close must name what contradicted its card.** This is the one that keeps the loop
honest. A close reporting only success catches nothing the planner got wrong, and the
value in this operation has repeatedly come from a seat contradicting the planner — on
this same day the covers-fastpath lane read the store and found the reaper had already
written `killed / execution-finished`, refuting a planner card that asserted the run was
still `started`. Without that field the queue is a faster way to propagate planner
mistakes.

## What is explicitly not decided

**Whether seats can be woken on a schedule is unresolved and is not assumed.** The queue
works identically whether a seat is started by a scheduler or by hand. If the answer is
manual, the queue still removes the planner from the transport path for card content; it
does not remove the operator from starting a seat.

**Autonomy scope. CORRECTED 2026-09-01, same day, and the correction matters more than
the original claim.** This paragraph originally said the planner had no store credentials
and could not verify a Postgres claim independently. That was **false and untested**. The
connection strings live in GCP Secret Manager on `hauska-prod-497015` and the working
identity can already read them:

```
gcloud secrets versions access latest --secret=PRODUCTION_NEONDB_URL --project=hauska-prod-497015
gcloud secrets versions access latest --secret=FACTORY_DATABASE_URL  --project=hauska-prod-497015
```

The claim entered this record because the property seat reported "store cards need
credentials this seat does not have" and the planner **propagated a subagent's negative
without testing it** — the documented recurring error, and the contract's own instruction
is that when a subagent reports something verified you ask what it violated to establish
it. Nobody violated anything here; the seat simply looked on disk, found only
`.env.example`, and concluded absence. Absence of a local file is not absence of access.

The operative constraint is therefore not access but authorisation: using credentials is
an operator-gated action under `ENFORCEMENT.md`. Reads for verification are the reason to
have them; writes stay gated per card, which is what `authorization: "operator"` is for.

## Reversal criteria

Retire this if any of the following hold:

A card is claimed and worked while its premises were stale, and the premise block did not
prevent it. That means the mechanism is ceremony.

Two seats act on one store concurrently despite the token. That means the token is
advisory and the serial resource is unprotected.

The contradiction field on closes fills with the same string repeatedly, the way
`_catalog/dispatch_overrides.log` filled with sixteen identical `CLOSE_OVERRIDE=1 on git
push` reasons. A mandatory field is a presence-shaped requirement on a justification and
constrains nothing unless something reads it. Read it monthly; if it is ceremony, say so
and remove it rather than leaving it as decoration.

The queue is used to fire work rather than to refuse it.

## Verification

`node scripts/queue/self-test.mjs` — 48 passing, both directions.

Verified by violation on the live board at setup: `WRONG_SEAT` refused govtech on a
property card, `MAINTENANCE_WINDOW` refused both store cards inside the live window, a
claim missing `--worktree` refused, a grant printed premises and delivered an addendum,
and a same-seat re-claim refused. Those events are marked `VERIFICATION_MARKER` in
`_queue/log/property.jsonl` and are excluded from any count of real claims.
