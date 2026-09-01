---
id: 2026-08-31_store_bottleneck_analysis
title: The bottleneck is the shared compute, not the write path — captured for later testing
date: 2026-08-31
status: active
plan_row: F-01, F-02, F-03
snapshot: doc_repo main 03ff427; written while factory-p2-juris-rrn5h was live on the shared compute
operator_note: captured verbatim at Nick's request 2026-08-31. Nothing is to be changed during the Central Texas program. This is the input to a later measurement and decision.
---

# Why this is filed

The operator has been trying to solve what he described as "the single write path"
being the next thing to fix after Central Texas. The analysis below reframes that and
is captured verbatim so the reasoning survives to whenever the testing happens.

**Nothing here is a decision and nothing here is to be actioned during the Central
Texas program.** The current serialization is slow and safe, and this is a live
production store.

---

# The analysis, verbatim

## The write path is not single. The compute is.

Three things are getting conflated, and only one is actually a bottleneck.

**The lease** scopes on `(scope_type, entity_type, county_fips)`. That means one
writer per rail per county — well-fact on Travis and footprint on Bastrop are
*already* allowed to run concurrently. It is not a global write lock. It's a
correctness control that stops two writers colliding on the same rows, and loosening
it would break something real while fixing nothing.

**The "one heavy op at a time" rule** is ours, not the system's. We imposed it as a
safe default.

**The compute is the actual constraint.** `neondb` and `hauska_mcp` are one Neon
project, one branch, one endpoint, group size 1. Every operation against either
database — read or write, landing or atoms — hits the same machine.

So if you go after "the single write path," you'd loosen a lease that isn't the
problem. The thing to attack is that both stores share one compute.

## And there are really two bottlenecks, with different fixes

**Concurrency.** That's what bit us tonight: A3 was a pure *measurement*, read-only,
and it still had to wait behind A1 because they share a machine. This is what makes
Central Texas slow.

**Throughput.** The atoms write path measured 67–149 atoms/s after the batched-links
fix. At the top of that range, 100M atoms is over a week of continuous writing.
Contention isn't the issue there — raw rate is. This is what makes *statewide* hard,
and no amount of parallelism fixes it if each writer is rate-limited.

Central Texas is mostly a concurrency problem. The next state is mostly a throughput
problem. Solving one doesn't solve the other, and I'd want to know which you're aiming
at.

## What I'd want measured before picking a fix

Here's the uncomfortable part: **we have never measured what the compute is saturated
on.** We know operations contend. We don't know whether it's CPU, IO, memory or
connection count. Three plausible fixes follow from three different answers, and
picking without that is guessing:

A read replica would let all measurement and scan work — A3, the P5 scrub, the ledger
reads — run off the primary entirely. That's the cheapest large win if we're
read-contended.

Splitting `neondb` and `hauska_mcp` onto separate computes is architecturally right
regardless: they're different concerns with different access patterns, and the model
law already gives the Factory its own store. It stops writer work competing with serve
work.

Or simply scaling the one compute up, which is unglamorous and might be sufficient.

I'd also flag that our "one at a time" rule is a **safe default, not a measurement**.
Two light operations may well coexist fine. The rule is correct-by-default and
possibly over-broad, and over-broad controls are the ones that teach people to bypass
them.

## What I'd suggest

Don't solve this during Central Texas — it's a live production store and the current
serialization, while slow, is safe. But *do* instrument it now while we have real load
running: capture what the compute is actually doing during a containment run. That
data is free to collect and it's the input to the decision.

Then the choice becomes measured rather than architectural taste.

---

# The evidence behind it

| Claim | Evidence |
|---|---|
| One compute serves both databases | Neon project `fancy-fire-06136146`, branch `br-crimson-feather-aphfmy91`, endpoint `ep-lucky-truth-apodo8hr`, group size 1, measured 2026-08-31. The second mechanism that would have meant no share, separate branches or separate endpoint ids, is not what the catalog returned. |
| The lease is per rail per county | `takeScopedLease` in `packages/storage/src/atoms-writer-lease.ts`; scope is `{scope_type, entity_type, county_fips}`. `railLeaseArgs` refuses `cad-parcel-roll` for a non-CAD rail. |
| A read-only measurement had to wait | Lane A3 (F1 provenance measure, no writes) was held behind A1 (containment) purely on compute share. |
| Write throughput 67–149 atoms/s | Measured after the batched-links and lease v2 fix; recorded in memory `atoms-writer-rtt-bound-in-writeatomlinks`. |
| Saturation cause unknown | Never measured. No CPU, IO, memory or connection-count profile exists for this endpoint under load. |

# What to test when this is picked up

Nothing below runs during the Central Texas program.

1. **Profile the endpoint under real load.** During a containment or writer run,
   capture CPU, IO wait, memory and active connection count. This is the missing input
   and it is free to collect while load already exists.
2. **Falsify the "one at a time" rule.** Run two genuinely light operations
   concurrently and measure whether either degrades. If they do not, the rule is
   over-broad and should be narrowed to named heavy classes rather than applied to
   everything. An over-broad control teaches the fleet to bypass it.
3. **Test a read replica against the read-heavy work**, which is the P5 scrub, the
   ledger reads and the provenance measures. Measure whether the primary's write
   throughput improves when those move off it.
4. **Cost the store split** (`neondb` and `hauska_mcp` on separate computes) against
   simply scaling the single compute. Architecturally the split is right and matches
   the model law; that does not make it the correct first move if scaling up clears
   the observed contention for less.
5. **Separate the throughput question.** Whatever fixes concurrency, re-measure
   atoms/s afterward. If the rate is unchanged, statewide is still gated on throughput
   and needs its own answer.

```
leave_behind:
  - item: profile the shared Neon compute under real load; saturation cause unmeasured
    owner: unassigned
    plan_row: F-03
  - item: falsify the one-heavy-op-at-a-time rule; it is a default, not a measurement
    owner: unassigned
    plan_row: F-03
  - item: read replica for scan and measurement work
    owner: unassigned
    plan_row: F-03
  - item: neondb / hauska_mcp compute split costed against scaling up
    owner: unassigned
    plan_row: F-03
  - item: atoms/s throughput is a separate bottleneck and gates statewide, not CTX
    owner: unassigned
    plan_row: F-02
```
