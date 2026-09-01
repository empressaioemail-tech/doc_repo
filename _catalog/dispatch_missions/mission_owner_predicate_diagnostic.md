# Mission — the owner pool did not erode. Find out which question changed.

## Read-only. Nothing mutates on this card.

## What is already established, so you do not re-derive it

`OWNER-STRIP-APPLY` refused to strip because live counts disagreed with the 2026-08-31
measurement, and it then killed the planner's explanation. Established:

- **`#371` is not the mechanism.** Zero `cad-parcel-roll` atoms in the six tenants have
  `updated_at` on or after `2026-09-01T05:52:30Z`. Every surviving roll atom last moved
  **2026-08-12**. Factory successes after the merge are `f03-reap` only.
- **Nothing was deleted.** `ownerMailingAddress` counts are **identical** across both
  measurements in all six counties (`+0` everywhere) while `ownerName` fell by 70. A
  deleted atom loses both fields. Deletion cannot produce a one-sided delta.
- Not an access-policy move either: a count without the `public-free` filter returned the
  same numbers.

| county | `ownerName` 08-31 -> 09-01 | delta | mailing |
|---|---|---|---|
| 48021 Bastrop | 77,078 -> 77,073 | -5 | unchanged |
| 48055 Caldwell | 48,384 -> 48,382 | -2 | unchanged |
| 48309 McLennan | 113,384 -> 113,360 | -24 | unchanged |
| 48209 Hays | 29 -> 0 | -29 | 0 both |
| 48453 Travis | 3 -> 0 | -3 | 0 both |
| 48491 Williamson | 7 -> 0 | -7 | 0 both |

No writes, no deletes, a one-sided delta. **So the data did not change and the question
did.** That is the hypothesis this card exists to confirm or kill.

## The leading hypothesis and its discriminator

JSONB gives at least three non-equivalent ways to ask whether a body carries `ownerName`,
and they disagree exactly on rows where the key exists with a null or empty value:

```
body ? 'ownerName'                    -- key present, value irrelevant
body->>'ownerName' IS NOT NULL        -- value present and not null
body->>'ownerName' <> ''              -- value present and not empty
```

**Run all three, per county, in one pass.** If `key-present` returns
77,078 / 48,384 / 113,384 / 29 / 3 / 7 and `value-not-null` returns the 09-01 numbers,
the mechanism is settled: the pool never eroded, the two measurements asked different
questions, and the difference is exactly 70 rows carrying a null or empty `ownerName`.

## Pre-register the falsifier before you run it

**If `key-present` also returns the lower numbers, this hypothesis is dead** and something
removed those keys without touching `updated_at` — a direct SQL update, a trigger-free
write path, or a column not auto-maintained. Say so plainly rather than salvaging it. That
would be a different and more serious finding, because it means a write path exists that
leaves no timestamp.

**And state a second mechanism regardless**, with why you rejected it.

## Also settle the small counties

Hays 29, Travis 3 and Williamson 7 went to exactly zero while their mailing counts were
zero under both measurements. Those 39 rows are 56 percent of the total delta and they are
the cleanest sample on the board.

**Pull those specific bodies and look at them.** Whatever `ownerName` is on those rows —
absent, null, empty string, or a real value the new predicate misses — is the answer to
the whole question, visible directly rather than inferred from counts. If they still carry
a real owner name, both hypotheses are wrong.

## Then say what the strip should do

The strip removes the **key**, which handles a null-valued key and a populated one
identically. But the card that runs it needs a predicate that means what it says.

**Recommend the predicate the strip should use, and the count it should expect**, so its
"zero after" falsifier is checkable under every one of the three forms above. A strip whose
before-count and after-check use different predicates proves nothing.

## Store landmines that will bite this card

- Factory `runs.status` is **`success`**, not `succeeded`; the English word returns zero rows.
- `landing.method` is `ring` on every persist row including `covers-v1`.
- A county's latest factory success may be a `persist:false` measure run.
- The atoms store is database **`hauska_mcp`**, not `neondb`. Wrong database returns a
  false absence that looks like a finding.

## Do not

- Do not strip, update, or delete anything. This card is read-and-diagnose.
- Do not run a strip "while you are in there" even if the mechanism resolves cleanly.
- Do not report a mechanism from counts alone when the 39-row sample can be read directly.
- Do not touch `owner-fact` or `cad_property`.
- Do not touch any repository other than the registered engine worktree you open.

## Close

Use the exact CP1 / CP2 / CLOSE paths named at the end of this dispatch. Declare snapshot
in the first output. Report all three predicate counts per county, the direct read of the
39 small-county bodies, the mechanism with its evidence, the second mechanism you rejected,
and the predicate plus expected count the strip should use. Name what contradicted this
card, or say plainly that nothing did. `leave_behind` named. Subagents do not commit.
