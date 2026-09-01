# Mission — strip owner fields against a target that is moving, and find out why it moves

## Supersedes the 2026-08-31 target

The previous card refused to apply because live exposure no longer matched its
measurement, and that refusal was correct. Measured 2026-09-01 at 13:24Z against the
2026-08-31 numbers:

| county | 2026-08-31 `ownerName` | live `ownerName` | delta |
|---|---|---|---|
| 48021 Bastrop | 77,078 | 77,073 | -5 |
| 48055 Caldwell | 48,384 | 48,382 | -2 |
| 48309 McLennan | 113,384 | 113,360 | -24 |
| 48209 Hays | 29 | **0** | -29 |
| 48453 Travis | 3 | **0** | -3 |
| 48491 Williamson | 7 | **0** | -7 |

A second count without the `public-free` filter returned the same numbers, so those rows
are not sitting under a different access policy. Hays, Travis and Williamson are now
**absent**, not unmeasured, and that distinction is the whole point of this exercise.

## The method changes: measure, then strip what you measured

Do not compare against any number in this card. Numbers here are context, not a target.

1. **Measure at apply time.** Take the population immediately before you strip, per county.
2. **Strip exactly the set you measured**, chunked, resuming from the ledger.
3. **Require zero after**, all six counties.

The falsifier is no longer "does it match a prior measurement." It is: **the set you
measured is the set you stripped, and after the run all six counties return zero.** A
count that drifts between your measurement and your strip is a finding, not a failure —
report the drift and the count that actually got stripped.

## Answer why it is moving, and do not assume you already know

The leading explanation is that engine `#371` merged at `05:52:30Z` and stops new writes
of `ownerName` and `ownerMailingAddress` onto `cad-parcel-roll`, so atoms rewritten since
then land without owner fields and the pool erodes on its own. That would make the drift
benign and self-limiting.

**State a second mechanism and why you rejected it.** Something else deleting or rewriting
those bodies is a different situation entirely, and one that a strip would mask rather
than fix. Candidates worth distinguishing rather than assuming: a bake or re-write path
that drops the fields as a side effect, a county re-ingest, an atom-version rotation, or a
deletion. **If the mechanism is not `#371`, stop and report** — that is a different card.

The distinguishing evidence is cheap: if `#371` explains it, the rows that lost owner
fields were rewritten after `05:52:30Z` and their bodies are otherwise intact.

## What is being removed, and what is not

`ownerName` and `ownerMailingAddress` out of `cad-parcel-roll` bodies in `hauska_mcp`.
Nothing else, ever.

**No data is lost.** `cad_property` stays the source of record and is untouched;
`owner-fact` stays the paid home and is untouched. This removes a duplicate from an atom
whose `public-free` policy was never right for it. Say that in the close, because
"mutate production bodies" reads worse than what this is.

## Method discipline

**Dry run first, always**, and report the dry-run counts per county before applying.

**Run row first.** No mutation without one. The previous card wrote no factory run row
because nothing mutated, which was correct.

**A count is not a record.** Every chunk emits a durable record naming the predicate, the
range acted on, the row count and the timestamp, so the set is re-derivable.

**The one that matters most:** a body that carried no owner field before must be
byte-identical after. A strip that rewrites untouched rows is a different operation from
the one authorised. Spot-check a body before and after and confirm only the two keys
differ.

## Store landmines that will bite this card

Three, all found on 2026-09-01, each of which returns a confident wrong answer:

- Factory `runs.status` is **`success`**, not `succeeded`. Filtering on the English word
  returns zero rows.
- `landing.method` is `ring` on every persist row **including `covers-v1`**, so grouping
  the store by method erases method version.
- A county's **latest** factory success may be a `persist:false` measure run rather than
  the run that wrote the data. McLennan's latest is `1e5d4ae5`; its persist run is
  `a62e3fce`.

## Then close the exposure properly

`#371` stops new writes; this card removes the existing pool. **Neither alone closes it**,
so the close names both this run id and `e3e1485ee39535d1819d438221063dd6eb9b955e`.

Add the regression test the previous card specified and never reached: an anonymous
`get_atom` on a `cad-parcel-roll` DID returns a body with **no owner keys**. Without it
the next writer that adds an owner field to a `public-free` atom reproduces this silently.

## Do not

- Do not compare against the numbers in this card; measure at apply time.
- Do not proceed if the mechanism is not `#371`. Stop and report.
- Do not apply without a clean dry run.
- Do not touch `owner-fact`, `cad_property`, or any other field on the roll atom.
- Do not add an MCP field stripper; the ruling rejected it and the policy is the protection.
- Do not skip a county because its count is small. Zero is the falsifier on all six.
- Do not run into a Tuesday 05:00-06:00 UTC Neon maintenance window.
- Do not touch any repository other than the registered engine worktree you open.

## Close

Use the exact CP1 / CP2 / CLOSE paths named at the end of this dispatch. Declare snapshot
in the first output. Report the apply-time measurement, the set actually stripped, any
drift between them, the per-county after-counts, the mechanism for the erosion and the
second mechanism you rejected, this run id and `#371`'s merge SHA. Name what contradicted
this card, or say plainly that nothing did. `leave_behind` named. Subagents do not commit.
