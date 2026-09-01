# Mission — split the release verb and make a closed card additive

## Your own audit is the spec

`DOUBLE-CLOSE-AUDIT` established mechanism 3 and recommended two changes. The operator has
ruled both in. Implement them.

**Three lanes are live on this CLI right now.** Backward compatibility is a requirement, not
a nicety: a change that makes their next `release` fail turns one blocked card into three.

## 1. Split the release verb

Today `release` takes `--reason` and **defaults it to `"close"`**. That is the ceremony
pattern this operation already documented: `_catalog/dispatch_overrides.log` carries sixteen
`CLOSE_OVERRIDE` rows whose reason strings are identical, and a mandatory reason that
defaults constrains nothing. **Kill the default.**

Three intents, distinguished:

**`--as close`** — requires the card's close artifact to **exist and contain
`leave_behind`**. That is the same contract `DEPENDENCY_MALFORMED` already applies to a
dependency's close, so a card cannot claim completion the queue would refuse to count.

**`--as abandon`** — requires a real `--reason`. Returns the card claimable, logged
`ABANDONED`. **This must stay possible.** A seat must be able to put down a card it cannot
finish, and a release that refuses without a close would strand the store token until the
lease expires — which is worse than an honest abandon.

**`--as steal --force`** — logged `STEAL`. Already exists in behaviour; give it a name.

**Backward compatibility, and it is also the honest shape:** when `--as` is omitted, infer
`close` **if and only if** the close artifact exists and is contract-complete. Otherwise
refuse and print the two forms. That keeps the happy path working for the three live lanes
while making the exact failure that caused this incident — releasing with no close — loud
instead of silent.

## 2. A closed card accepts an addendum, not a silent overwrite

At 16:02 a lane overwrote `close.json` on a card it had not claimed, after `status` told it
`CARD_CLOSED` at 15:58:25. **The second artifact was the better one** — the first close said
the Travis and Williamson scans timed out and they had finished sixteen seconds later. So
the goal is not to prevent the second write. It is to keep both and make the duplication
visible.

Add a command that appends to a closed card's record rather than replacing it — a close
addendum written **beside** the close, never over it, carrying the seat, the timestamp, and
the text or file.

**And make it discoverable at the moment it is needed:** when `status` reports
`CARD_CLOSED`, it prints that exact command. The lane that overwrote the close had just been
told the card was closed and had no cheaper option offered.

That is the whole point. **What makes claiming cheaper than ignoring it is offering the
right verb at the moment of refusal**, not adding an obligation.

## What this must not become

**The queue stays advisory and must not become a dispatcher.** Nothing here forces a seat
through the CLI, and the bypass — doing the work without claiming — stays open by design per
the L3 fleet ruling. `QUEUE-INIT` named it honestly advisory and that stands.

You are not closing the bypass. You are making the sanctioned path the easier one.

**Do not wrap the editor or SQL.** Your own close said this and it was right.

## Also worth doing while you are in here

`status` is not logged, so a lane's observation of `CARD_CLOSED` leaves no trace and the
next thing it does is invisible. Consider whether `status` should record, and say why if you
decide it should not — a log that grows on every poll has its own cost, and a loop calls
`status` every tick.

## Verify by violating, both directions

- `--as close` with **no** close artifact → refused.
- `--as close` with a close that has **no `leave_behind`** → refused.
- `--as close` with a contract-complete close → granted.
- `--as abandon` with no reason → refused. With a reason → granted, logged `ABANDONED`, card
  claimable again.
- **Omitted `--as` with a valid close → granted** (the three live lanes must not break).
- Omitted `--as` with no close → refused, printing both forms.
- Close addendum on a closed card → written **beside** the close; confirm the original close
  is byte-identical afterwards.
- `status` on a `CARD_CLOSED` card → prints the addendum command.

A control observed only passing has not been observed working, and this one governs the verb
that caused the incident.

## Do not

- Do not break `release` for the three lanes currently holding or queueing on cards.
- Do not remove `--as abandon` or make it harder than `--as close`.
- Do not let any path overwrite an existing close artifact.
- Do not close the advisory bypass.
- Do not default `--reason` to anything.
- Do not change `claim`, `next-wake`, `extend` or the refusal set on this card.
- Do not touch any repository other than `doc_repo`.

## Close

Use the exact CP1 / CP2 / CLOSE paths named at the end of this dispatch. Declare snapshot in
the first output. Report each violation test and its result, the backward-compatibility path
you took, your decision on logging `status` with the reasoning, and confirmation that an
existing close artifact is byte-identical after an addendum. Name what contradicted this
card, or say plainly that nothing did. `leave_behind` named. Subagents do not commit.
