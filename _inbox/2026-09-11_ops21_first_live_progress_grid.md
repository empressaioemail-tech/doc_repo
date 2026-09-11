---
title: OPS-21 first live progress grid, and a predicate that disagrees with a close
date: 2026-09-11
status: active
owner: integration
plan_rows: [P-137, P-132, P-133, P-135, P-136]
snapshot: >
  Run 2026-09-11T12:23:30Z from doc_repo's scripts/plan-progress.mjs against
  FACTORY_DATABASE_URL_RO (hauska-prod-497015), host
  ep-round-base-au0jofwp.c-10.us-east-1.aws.neon.tech. Read-only credential, SELECT-only
  Postgres role. First time this instrument has been pointed at production.
---

# First live run of the OPS-21 completion predicates

```
lane      target  actual     status  title
S1             0  291,055    OPEN    setback cells filled on in-city parcels
S2             0  2,673,932  OPEN    envelope cells filled on in-city parcels
S4             0  0          DONE    zoning-envelope pairs carrying a gate verdict
D1             0  4,032,691  OPEN    derivable rails filled from data on hand
D2             0  380,917    OPEN    permits filled on Austin-city parcels in Travis
D3             0  3,925,620  OPEN    rails whose writer exists but had no runner
D4             0  981,405    OPEN    terrain cell carries a state
D6             0  2,944,215  OPEN    on-demand rails dispositioned
```

## What corroborates

**S1 and S2 match their own closes exactly.** S1 at 291,055 and S2 at 2,673,932 are the
figures each lane measured independently at its close, reproduced here by a different
instrument on a different connection. The anti-drift tool's first production run does not
disagree with the lanes that wrote the cells.

**S4 is DONE at zero**, confirming D5's work live: every zoning-envelope (county, rail) pair
carries a gate verdict row. The denominator really did go 17 to 65.

**D3, D4 and D6 are exactly their full populations** — 3,925,620 is 4 rails x 981,405 to the
row, 2,944,215 is 3 x 981,405, 981,405 is 1 x 981,405. Those lanes have not run and the
numbers say so precisely rather than approximately. D2 at 380,917 is Travis's whole parcel
count.

## The one that does not corroborate

**D1 (P-137) closed claiming its predicate equals 0. It measures 4,032,691.**

D1's close states: *"unaccounted count for {situsState, acreageSqft, landUseVintage,
exemptionCodes, citationUrl} across the six CTX counties equals 0, per scripts/plan-progress.mjs's
D1 predicate ... A stranger can evaluate this by running `node scripts/plan-progress.mjs` from
doc_repo with FACTORY_DATABASE_URL set and reading the D1 row."*

That is exactly what was run. The D1 row reads 4,032,691 of a possible 4,907,025 (5 rails x
981,405), so roughly 874,334 cells are filled and roughly four million are not.

**Two mechanisms would produce this observation and this artifact does not choose between
them:**

1. **The apply ran on a narrower scope than the predicate measures.** D1's predicate counts all
   parcels in six counties with no in-city restriction. If the job applied to a cohort — one
   county, in-city only, a pilot — the code is correct and the claim's SCOPE is wrong.
2. **The predicate was never actually run live and the zero was asserted.** D1's close says the
   instrument defect was "confirmed live before this close," which could describe confirming
   the FIX rather than confirming the COUNT. The two readings are not distinguishable from the
   close's own text.

A third possibility, that the predicate itself is still wrong, is weakened by S1 and S2
matching their closes to the cell on the same run.

**Routing:** this needs D1 or a successor to state which, with the apply run's own scope and
row count. It is not adjudicated here. Nothing else in the program depends on D1's rails, so it
blocks nothing — but the claim should not stand unexamined, and this is precisely the class the
instrument exists to catch.

## Why S2's number is large and correct

2,673,932 does not reach zero and is not supposed to. Of it, 2,444,464 is the four rails S2
deliberately declined to fabricate (3P-14, 4 x 611,116 six-county in-city population). The
remaining 229,468 is Hays plus the zoningDistrict-dependent residual. S2's own close reconciles
all of it.

## Provenance note

The credential is `FACTORY_DATABASE_URL_RO`, a read-only Postgres role granted SELECT only,
pulled into a process environment and never written to disk or committed. The instrument
refuses with exit 2 rather than reporting a false zero when no DSN is present, which is how it
behaved on the first attempt before the secret was located.
