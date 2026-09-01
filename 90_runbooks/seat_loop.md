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

## Store credentials: you have them, they are not on disk

A store card is not blocked for lack of credentials. **There is no `.env` in any worktree
and there is not supposed to be.** The connection strings live in GCP Secret Manager on
`hauska-prod-497015`:

```
export PRODUCTION_NEONDB_URL=$(gcloud secrets versions access latest   --secret=PRODUCTION_NEONDB_URL --project=hauska-prod-497015)      # cortex-prod: hauska_mcp + neondb
export FACTORY_DATABASE_URL=$(gcloud secrets versions access latest   --secret=FACTORY_DATABASE_URL --project=hauska-prod-497015)       # factory control store
```

`psql` and the `pg` node module are both present. Related secrets that exist and may be the
right one for a given card: `ATOMS_DATABASE_URL`, `CORTEX_DATABASE_URL`, `DATABASE_URL`.
Read the card before picking one.

**Never echo a secret, never write one to a file, never paste one into a close.** Pipe to
the thing that consumes it. To prove access without exposing a value, pipe to `wc -c`.

**There is a second path and it is sometimes better.** Store work can be driven through the
Cloud Run job rather than a local connection, which is how the covers-fastpath measurements
ran on 2026-09-01:

```
gcloud run jobs execute factory-p2-juris --project=hauska-prod-497015 --region=us-east4   --args="p2-juris,--county=48309,--apply,--measure-lo=100000,--measure-hi=112364" --async
```

The job already holds both secrets. Prefer it when the operation is something the job
implements, because it runs in the same environment the real runs use.

**On 2026-09-01 a seat reported store cards blocked for want of credentials and stopped the
loop.** It had looked on disk, found only `.env.example`, and concluded absence. Absence of
a local file is not absence of access. If a card looks blocked on credentials, run the
access check before reporting it blocked.

## Stop, and mean it

A loop that never stops is a loop nobody reads. Stop and report when any of these hold:

- **A card fails.** Release it with a reason and stop. Do not retry. Anything that has failed
  its own test twice needs authorisation, not another attempt.
- **A refusal you do not understand.** Report the code and stop. Do not work around it, and do
  not go looking for a path that reaches the same state without the claim.
- **The board has nothing for this seat and nothing knowable is coming.** Say so and stop
  rather than idling indefinitely.
- **A deploy to production, or an irreversible deletion.** Operator calls whether or not a
  card is claimable.
- **A production WRITE that no card authorised.** Not reads. Using a read connection to
  measure the store is the ordinary way to do a store card and is not a stop; a card that
  mutates production carries `authorization: "operator"` and the queue already refuses it
  until the go exists. **Do not stop a store card merely because it needs a connection
  string** — that sentence used to read "or credentials" and it stopped a loop on
  2026-09-01 that should have kept going.
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
