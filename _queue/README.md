# The seat queue

A card queue that **refuses**. It does not start work, schedule work, or notify
anyone. It answers one question — *may this seat begin this card right now* — and
its only interesting behaviour is saying no.

That distinction is the whole design. The L3 fleet ruling says operate rather than
rebuild and never build parallel wrappers; the scan-fix post-mortem says fewer agents
and tighter contracts. A queue that fires work is the wrapper those rulings warn
about. A queue that refuses is the contract they ask for. Same files, opposite
doctrine, and the difference is entirely whether it can fail closed.

## What a seat does on wake

```
node scripts/queue/cli.mjs status --seat <your-seat>
```

Prints what you may claim, and for everything else the refusal codes and why. Cards
belonging to other seats show as `[other:<seat>]` — visible, not takeable.

```
node scripts/queue/cli.mjs claim --card <id> --seat <your-seat> \
    --worktree <path> --branch <branch>
```

Exits non-zero and writes nothing if any refusal applies. On success it prints the
dispatch path, the plan row, the close path, **the premises you must re-verify**, and
**every addendum** added since the card was written.

Then do the work from the compiled dispatch at the path it printed. The dispatch is
the instruction; the card is only the queue entry.

When the close artifact is written:

```
node scripts/queue/cli.mjs release --card <id> --seat <your-seat>
```

## The seven refusals

| code | meaning |
|---|---|
| `NO_CARD` | no such card |
| `NO_SEAT` | seat is not in `_catalog/seat_register.json` |
| `WRONG_SEAT` | another seat owns that repo. SEAT-01, enforced instead of remembered |
| `ALREADY_CLAIMED` | a live claim exists, including one held by your own seat |
| `DEPENDENCY_OPEN` / `DEPENDENCY_MALFORMED` | a `depends_on` card has no close, or its close has no `leave_behind` |
| `STORE_TOKEN_HELD` | another card holds that store |
| `MAINTENANCE_WINDOW` | the store is inside its Neon maintenance window |
| `UNKNOWN_STORE` | `needs_store` names a store not in `config.json` |
| `CARD_CLOSED` | the close artifact already exists |

All 24 refusal and inverse cases are asserted in `scripts/queue/self-test.mjs`,
including an explicit not-vacuous case. Run it before trusting any change to
`lib.mjs`.

## Why each of these exists

**`WRONG_SEAT`.** Seats own repos and the rule was previously prose. Prose controls
in this operation are 0 for 3; hook-shaped controls are 1 for 1.

**`STORE_TOKEN_HELD`.** Store-time is the only genuinely serial resource on this
board, and the entire wave plan is cut around that fact. A queue that lets four seats
claim four store cards concurrently runs four heavy operations on one Neon compute.
Exactly one card holds a store at a time.

**`MAINTENANCE_WINDOW`.** On 2026-09-01 the Tuesday 05:00-06:00 UTC window forced a
defensive termination and made a run card unsafe to send, and the guard existed only
as a sentence in one card and was omitted from the card that actually launched a long
job. It is now arithmetic.

**`ALREADY_CLAIMED` for your own seat.** Re-claiming your own card silently is how
one seat runs a card twice. On 2026-09-01 a Travis execution was launched directly by
the planner while a lane held a card telling it to launch Travis; only a message
prevented two concurrent writers on 380,917 rows.

**`DEPENDENCY_MALFORMED` on a missing `leave_behind`.** Every lane finish must declare
its leave-behind before it can close. A close that skipped it did not follow the
contract, so it does not satisfy a dependency. This is a contract check rather than a
file-exists check.

## Premises and addenda: how context travels

A card queued at 05:00 and claimed at 07:00 may be against a moved base. Two real
instances: an alias pin flipped between a CRLF blob `d3f6d340` and the LF `7e5ac620`
that was actually committed, and a Bastrop license recorded as `1dda40f7` from a lane
close while the store had already rebound to `85f984c2`.

So every card carries `premises`: the things to re-verify **before** starting. They
are printed on claim and they are not optional.

When something changes after a card is written, the planner appends an addendum
rather than editing the card:

```
node scripts/queue/cli.mjs addendum --card <id> --author planner --text "..."
```

Addenda are printed to whoever claims the card. This is the mechanism by which a card
written hours earlier arrives with everything learned since.

## Closes must report contradictions

A close that only reports success catches nothing the card got wrong. The value in
this operation has repeatedly come from a seat contradicting the planner: on
2026-09-01 the covers-fastpath lane read the store and found the reaper had already
written `killed / execution-finished`, refuting a planner card that asserted the run
was still `started`.

**Every close carries a field naming what the seat found that contradicted its card,
or states explicitly that nothing did.** Without it the queue is a faster way to
propagate the planner's mistakes.

## What this does not do

It does not wake anyone. Whether seats can be started on a schedule is unresolved and
is deliberately not assumed here; the queue works identically whether a seat is woken
by a scheduler or started by hand.

It does not merge, deploy, or run anything. It grants permission to begin.

It does not replace the dispatch compiler. Cards point at dispatches compiled by
`scripts/dispatch.mjs` and `enqueue` refuses a card whose dispatch file does not
exist.

## Records

Every claim, every refusal, and every release is appended to
`_queue/log/<seat>.jsonl`, namespaced per seat because a shared file has already been
clobbered between a write and an add in this repo. A refusal that leaves no name is
how an unattributed mutation becomes unanswerable.
