## Mission — P-204: five rails serve from somewhere, and nobody has said where they should live

You launch no sub-agents (FAN-DEPTH 0). **This lane writes no store and changes no serving
behaviour.** It establishes facts and produces a recommendation per rail. The RULING is the
operator's; you supply what a ruling needs. Any doc_repo change is handed back as a diff.

### Why this is the largest single block

The post-apply completeness re-grade shows the same five rails open in **all six counties** —
`parcelGeometry`, `pipelines`, `railCorridor`, `etjStatus`, `landUseDescription` — every one with
the verdict `excluded-mid-cutover`. That is **30 of the 67 open cells, about 45 percent of what
stands between here and the Phase 0 exit.**

And they are not missing data. P-204 measured them on gold parcel `48209:97658` the same day its
ledger rails read `excluded` with zero values: a full nine-edge boundary ring with bearings, a
facing road carrying OSM provenance, `pipelineFact` present, `etjStatus` resolving to "unresolved"
inside `cityLimitsFact`, and a land-use description of "Vacant lot or tract". **All of it reaches a
customer today, from a path that is not the ledger.**

They read `open` because `RAIL_POLICY` in `scripts/six-county-completeness.mjs` gives the
`mid-cutover` class **no `accept` list at all**, deliberately, while every other class has one. That
is not an oversight: the program has not decided whether the ledger is meant to become the source
for these five. Until it does, they cannot be accepted and cannot be counted done.

So this block is open because nobody ruled, not because work is missing — and the ruling changes no
customer outcome either way, because all five serve now. That is what makes it the cheapest large
move available, and also why it has been easy to leave alone.

P-201 has shipped: the verdict enum carries `excluded-not-applicable`, `excluded-mid-cutover` and
`excluded-no-acquisition-path` as distinct values, which is what makes this class separable from
P-203's. The dependency is satisfied.

### What to establish, per rail

For each of the five, answer from code and live reads, not from documents:

1. **What serves it today.** Name the exact path: which service, which function, which store or
   upstream. "It comes from the engine" is not an answer; name the read.
2. **Whether the ledger cell is empty, partially written, or written-and-unread.** These are three
   different states and they imply different costs. Do not collapse them.
3. **What the cutover would cost**, concretely: the writer that would have to mint the atoms, the
   population, and whether a vocabulary or contract change is implied.
4. **What breaks if it never cuts over.** The standing ruling is that the ledger IS the serving path
   and that surfaces must not keep a second read path (`_decisions/2026-09-11_ledger_as_serving_path_seven_steps.md`).
   A rail that stays elsewhere is an exception to that, so say plainly what exception is being asked
   for and what it costs in consistency.
5. **Your recommendation: CUT OVER, STAYS ELSEWHERE, or RETIRE**, with the serve path named in every
   case. A recommendation with no named serve path is not a recommendation.

`etjStatus` deserves particular care: P-296 shipped ETJ to customers on 2026-09-17 (355 boundary
rings from 20 publishers, cortex `00824-qay`, and the Austin parcel moved from `unresolved` to
`present`). So its rail is mid-cutover while its data is freshly live. Establish whether P-296's
work IS the cutover, is a parallel path, or is upstream of one. If it is already cut over and the
verdict is simply stale, that is a finding and it is worth more than the other four combined.

### What a ruling needs from you, beyond the five answers

A table the operator can rule from in one pass: rail, what serves it now, ledger cell state,
cutover cost, cost of not cutting over, your recommendation. Plus one paragraph saying which of the
five you would rule together and which needs its own decision, because a five-way ruling made as one
is how a rail gets the wrong answer by association.

### Constraints

- **No store writes. No deploys. No serving changes.**
- Do not edit `RAIL_POLICY`. Changing the policy's `accept` list is what IMPLEMENTS a ruling, and
  the ruling has not been made. If you find yourself wanting to add an `accept`, that is the signal
  to write the recommendation instead.
- Do not touch county 48491 in any store.
- Where you read the production or factory store, read-only and under a heavy-scan lease keyed on
  the store host.

### Verify by violation

Your central claim per rail is "this is what serves it today". Prove each one by breaking it: for at
least two of the five, show that the named path is load-bearing — a read that fails or a value that
disappears when that path is unavailable — rather than asserting it from a code search. A serve path
identified only by grep has not been established. Where you cannot prove it that way, say the claim
is unverified rather than promoting it.

### Close

Declare: the five-rail table, the two or more proven serve paths with what you broke to prove them,
any claim you could not verify, your grouping recommendation for the ruling, the snapshot you read
against, and `leave_behind`.
