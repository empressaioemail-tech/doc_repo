---
id: 2026-08-31_p2_juris_totals_run_record
title: P2-JURIS TOTALS run — UNMEASURED, with the miss named twice
date: 2026-08-31
status: filed
plan_row: F-01
runner: doc_repo planner (review seat)
outcome: UNMEASURED — no total adopted
---

# What ran

Operator go for the short-lived read-only run. `00_session.sql` and
`01_containment.sql` taken from **factory `origin/main` (merged `f21ceb85`)**, not
a local edit — sha256 heads `083aef77921ada25` and `a8620e80a3aedaa2`. One psql
session, since 00 sets the session GUCs 01 depends on.

Store: Neon project `fancy-fire-06136146` (cortex-prod), branch
`br-crimson-feather-aphfmy91` (production), **database `neondb`**, PostGIS 3.5.

## Read-only was proven, not asserted

```
NOTICE: P2-JURIS RO armed: durable CREATE TABLE refused
        [cannot execute CREATE TABLE in a read-only transaction]
```

The file's own choice of a **durable** `CREATE TABLE` rather than `CREATE TEMP` is
what made this a real proof; the note in 00 says TEMP was the hole that made 01
unrunnable, and that is correct.

## The input snapshot corroborates the target denominator

```
 city_rows | county_rows | parcel_rows_raw | parcel_distinct_prop
      1222 |         254 |         1568849 |               981410
```

**981,410 exactly**, independently derived. The inputs are sound. Whatever is
wrong is downstream of them.

---

# Finding 1 — the merged query can never run

`01_containment.sql:202` raises `ERROR: division by zero` **unconditionally**.

```sql
CASE WHEN (SELECT n FROM city_ok) = 0 THEN (1 / 0)::bigint
     ELSE count(*) FILTER (WHERE disposition = 'unincorporated')
END AS unincorporated,
```

**Hypothesis pre-registered and LOST.** I predicted planner constant-folding of the
literal `1/0`. Refuted at source: `SELECT CASE WHEN 1=0 THEN (1/0)::bigint ELSE 42
END` returns **42**, and `city_ok` measured **1222**, not 0. So neither the folding
story nor the guard's own condition explains it.

**The mechanism, confirmed both ways.** A literal `1/0` inside a `CASE` **in an
aggregate target list** is evaluated regardless of the condition:

| Shape | Result |
|---|---|
| `SELECT CASE WHEN 1=0 THEN (1/0) ELSE 42 END` | `42` |
| same CASE with `count(*)` in the ELSE, over any relation | `ERROR: division by zero` |
| same, with an empty driving relation | `ERROR: division by zero` |

So the fail-closed guard fails closed **always**. The empty-city case it protects
is already correctly guarded by the `DO $$ … RAISE EXCEPTION` block at lines 26-34,
which executed normally in this run. Line 202 was redundant and fatal.

Fixed by the lane on `seat/property-ctx-p2-juris-plan` `7bd21de` (PR #42): CASE
removed, DO kept, `05_explain` unlimited, both-arm gate in the test.

---

# Finding 2 — with the guard neutralised, the join exceeds its own 180s bound

A planner-local copy with **only** line 202 replaced (everything else byte
identical, edit commented in place, never proposed for merge) got past the abort
and then hit `ERROR: canceling statement due to statement timeout`.

**A timeout is a finding, not a zero.** TOTALS is `UNMEASURED`. No total adopted.

`EXPLAIN` (no ANALYZE, so nothing executed) names it at plan level:

```
Nested Loop  (cost=0.00..10603636369.81 rows=10448)
  ->  CTE Scan on parcels_six  (rows=1043462)
  ->  CTE Scan on cities_ok    (rows=811)
```

Roughly **846M geometry comparisons**, top-level cost **1.06e10**. Both sides are
**CTE scans**, so no index is reachable and the 22 bbox references in the file
become a filter *inside* the loop rather than an index-backed prefilter. The query
is zone-major in **shape** and not in **effect**.

Raising `statement_timeout` does not fix this; it needs a plan change. I am
deliberately not prescribing one — the file's "No LATERAL" rule was earned against
a *point-major* failure, which is a different problem from "no index is reachable
on a CTE output", and the lane is better placed to solve it than I am.

**Acceptance gate for the next attempt:** `05_explain.sql` must show a plan that is
not this nested loop, **before** another timed `01`. A green run is not the
evidence; the plan is.

---

# A correction I owe

I wrote that spatial containment "re-derives in **1.3 s**" and used it to argue
containment is *cheaper* than the alias hand-seeding it replaces. **That 1.3 s was
the city-to-county roster join — 1,222 × 254 polygons.** This is *parcel*
containment — 981,410 × 1,222. I characterised one join with a different join's
timing.

Containment is still the **correct** derivation, and that part is unaffected: an
alias maps a postal string, not a parcel to corporate limits; 52.0% of parcels
carry no jurisdiction string at all; and four keys are county-scoped. The claim
that it is **cheap** is withdrawn and is now unproven pending a workable plan.

---

# Credential handling — precisely what was and was not done

Minted the existing `neondb_owner` connection URI through the Neon control-plane
API. Never echoed, never written to disk — verified **zero** `postgresql://` or
`npg_` matches across every file produced by this run and zero in the environment.
A bare `psql` afterwards fails to localhost.

**No credential was deleted or revoked.** That URI belongs to the production owner
role; revoking it means resetting a password live consumers use. A genuinely
deletable credential would require creating a scoped role plus GRANTs — a write to
the database. Read-only was enforced and proven at session level, which is what the
SQL is designed around. Calling that a revocation would be an overclaim, so it is
recorded here as what it is.

```
leave_behind:
  - item: P2-JURIS join plan rewrite — Nested Loop over two CTE scans, 1.06e10 cost
    owner: property seat (F-01 lane)
    plan_row: F-01
  - item: 05_explain plan gate must pass before another timed 01
    owner: property seat
    plan_row: F-01
  - item: "containment is cheaper than hand-seeding" withdrawn, unproven
    owner: planner
    plan_row: F-01
```
