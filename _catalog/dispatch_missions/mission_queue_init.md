# Mission — adopt the seat queue, and try to break it before you trust it

## What changed

Cards are no longer hand-carried one at a time. `_queue/` holds a card board; you claim
against it. The protocol is `_queue/README.md` and the reasoning is
`_decisions/2026-09-01_seat_queue_protocol.md`. Read both before claiming anything.

The queue **refuses**. It does not start work, schedule work, or notify anyone. It
answers one question — may this seat begin this card right now — and its only interesting
behaviour is saying no.

## Your loop

```
node scripts/queue/cli.mjs status --seat property
node scripts/queue/cli.mjs claim  --card <id> --seat property \
    --worktree <path> --branch <branch>
```

`claim` exits non-zero and writes nothing if any refusal applies. On a grant it prints the
compiled dispatch path, the plan row, the close path, **the premises you must re-verify**,
and **every addendum** added since the card was written. Do the work from the dispatch;
the card is only the queue entry.

When the close artifact is written:

```
node scripts/queue/cli.mjs release --card <id> --seat property
```

## Before you use it, try to break it

**Do not accept this from a passing self-test.** `node scripts/queue/self-test.mjs` reports
24 passing including both directions on every refusal that has an inverse, and the planner
verified five refusals against the live board. That is the planner checking the planner's
own work, which is the failure mode this whole protocol exists to interrupt.

**Construct violations and report what happened.** At minimum:

- Claim a card belonging to another seat. It must refuse `WRONG_SEAT`.
- Claim a `needs_store` card while another card holds that store. It must refuse
  `STORE_TOKEN_HELD`. Construct the held token; do not wait for one to occur.
- Claim a store card inside Tuesday 05:00-06:00 UTC. It must refuse `MAINTENANCE_WINDOW`.
  If you are reading this outside that window, add a temporary window covering now,
  confirm the refusal, and remove it.
- Claim a card twice as the same seat. It must refuse `ALREADY_CLAIMED`.
- Let a lease expire and confirm the card becomes claimable again rather than staying
  stuck. A control that never releases is worse than one that never holds.

**And find the bypass.** The three-question gate asks what reaches the same state without
passing through the control, and the answer is rarely none. This queue is a set of scripts
in a repo; nothing forces a seat to run them. Name the paths that reach the work without a
claim, and say whether any of them should be closed or whether the queue is honestly
advisory at those points. **A truthful answer here is worth more than a clean report.**

## Then take the board

Three cards are enqueued. `factory-merges` is claimable now and needs no store.
`ctx-totals` and `owner-backfill` need `cortex-prod` and are refused until 06:00 UTC.

`factory-merges` is the one that matters most, and its reason is in its dispatch:
production is running the `ST_Covers` fast path and the 57P01 error listeners off an
unmerged branch while `main` has neither, so a rebuild from `main` silently regresses.

## The close field that is now mandatory

Every close names **what you found that contradicted your card**, or states explicitly
that nothing did.

This is not paperwork. The value in this operation has repeatedly come from a seat
contradicting the planner: on 2026-09-01 the covers-fastpath lane read the store and found
the reaper had already written `killed / execution-finished`, refuting a planner card that
asserted the run was still `started`. A close that reports only success catches nothing
the planner got wrong, and without this field the queue is just a faster way to propagate
planner mistakes.

If the card was right about everything, say that. An honest "nothing contradicted it" is a
real answer. A field that fills with the same string every time is ceremony and will be
removed.

## Do not

- Do not treat a passing self-test as evidence the queue works. Break it yourself.
- Do not claim a card you cannot name a worktree and branch for.
- Do not work a card without re-verifying its premises. A queued card may be against a
  moved base; that has already happened twice this week.
- Do not edit another seat's files under `_queue/`. Write your own namespace.
- Do not use `release --force` on a card another seat holds without an operator ruling.
- Do not rebuild the Factory image on any card in this batch.
- Do not touch any repository other than the registered worktree you open.

## Close

Use the exact CP1 / CP2 / CLOSE paths named at the end of this dispatch. Declare snapshot
in the first output. Report each violation you constructed and whether the queue refused
it, **the bypass paths you found**, and whether any refusal is wrong or missing.
`leave_behind` named. Subagents do not commit.
