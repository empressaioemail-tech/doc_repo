---
title: Seat loop — how a seat runs itself against the queue
last_updated: 2026-09-01
status: active
---

# Seat loop

A seat on a loop is the wake mechanism the queue was built without. The queue refuses;
the loop asks. Neither starts work on its own judgement.

## The tick

Each tick does exactly this and then stops:

**1. Ask the board.**

```
node scripts/queue/cli.mjs status --seat <seat>
```

**2. If something is CLAIMABLE, take one card. One.** Not two, not "while I'm here."

```
node scripts/queue/cli.mjs claim --card <id> --seat <seat> \
    --worktree <path> --branch <branch>
```

Read what the claim prints: the dispatch path, the premises, and every addendum. **Re-verify
the premises before touching anything.** A queued card may be against a moved base; that has
already happened twice this week.

Do the work from the compiled dispatch. Write the close, including the mandatory field naming
what contradicted the card. Then:

```
node scripts/queue/cli.mjs release --card <id> --seat <seat>
```

**3. If nothing is claimable, do not guess an interval. Ask.**

```
node scripts/queue/cli.mjs next-wake --seat <seat>
```

It prints `next_wake_seconds=N` and, per card, when that card unblocks. Schedule the next tick
at exactly `N` and record the tick as a no-op. `N` already accounts for:

| situation | what you get |
|---|---|
| something claimable | `0` — go now |
| maintenance window | the window end, to the second |
| store token held | the token's expiry |
| lease held | the lease's expiry |
| **dependency in flight** | the dep-watch poll, because the card in front is being worked |
| dependency unstarted | the idle poll, because nobody has started it |

That last pair is the point. **A card waiting on the card in front wakes soon when that card is
actually being worked, and sleeps when it is not.** Waking every five minutes to find nobody
started the dependency is the chatter this avoids.

## Chaining cards

Put the card behind in `depends_on`. It stays refused with `DEPENDENCY_OPEN` until the card in
front has a close artifact that contains `leave_behind`. A close missing `leave_behind` did not
follow the contract and does not satisfy the dependency, so "complete" means contract-complete
rather than file-exists.

**A deploy in the chain does not break the chain.** Mark the deploy card
`"authorization": "operator"`. The loop will refuse it with `NEEDS_OPERATOR_GO` and keep
ticking; when the operator authorizes, the loop picks it up on the next wake and the cards
behind it resume when it closes. The operator is in the path exactly once, at the deploy,
instead of at every card.

```
node scripts/queue/cli.mjs authorize --card <id> --operator nick --reason "<why>"
```

## Stop, and mean it

A loop that never stops is a loop nobody reads. Stop and report when any of these hold:

- **A card fails.** Release it with a reason and stop. Do not retry. Anything that has failed
  its own test twice needs authorisation, not another attempt.
- **A refusal you do not understand.** Report the code and stop. Do not work around it, and do
  not go looking for a path that reaches the same state without the claim.
- **The board has nothing for this seat and nothing knowable is coming.** Say so and stop
  rather than idling indefinitely.
- **Anything needing a deploy, an irreversible deletion, or credentials.** These are operator
  calls whether or not a card is claimable.
- **A long run of no-op ticks.** Say how many and stop. Silence is not progress.

## What a loop must never do

Never claim two cards at once. The store token protects a store; nothing protects a seat from
itself.

Never work a card without re-verifying its premises.

Never write into another seat's `_queue` namespace, and never `release --force` another seat's
card without an operator ruling.

Never treat a passing self-test as evidence the queue works. Break it yourself.

## Why the loop is safe to leave running

It takes one card at a time, from a board it cannot add to. Every card points at a compiled
dispatch carrying its own do-not list. Deploys refuse without an operator go. Store work
serialises on a token. Maintenance windows refuse by arithmetic. And every claim, refusal and
release lands in `_queue/log/<seat>.jsonl`.

The residual risk is not the loop starting something it should not. It is the loop faithfully
executing a card the planner got wrong, which is why the close must name what contradicted it.
