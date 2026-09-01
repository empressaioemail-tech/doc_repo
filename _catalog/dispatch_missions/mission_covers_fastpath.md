# Mission — kill the overlay: `ST_Covers` fast path and a per-run city TEMP table

## The mechanism, established. Do not re-derive it.

Per-chunk containment cost is the sum of exact-geometry work against every
bbox-candidate city polygon a parcel touches, **linear in those polygons' vertex
count**. The expensive term is:

```
ST_Area(ST_Intersection(parcel, city))
```

run for every pair passing bbox and `ST_Intersects`. **`ST_Intersection` has no
prepared-geometry path in PostGIS**, so every in-city hit pays a full GEOS overlay
against the entire city polygon at roughly 2–3 µs per vertex.

A corridor parcel in Williamson bbox-hits three to five overlapping polygons (Austin
32,811 vertices, Georgetown 11,290, Cedar Park 8,801, Round Rock 7,059 — 45–60k
vertices total). A Waco parcel hits about 10k. A Hays parcel about 5k. That is the
23 ms to 306 ms per-in-city spread.

**There is no degradation and no accumulating state.** Cost is a property of the
`prop_id` range: the same ranges cost the same across three separate processes hours
apart, and McLennan reproduced chunk-for-chunk within 3% across two full runs. Do not
re-investigate memory, connection age, table growth or plan caching.

Second cost, same query: `cities_ok AS NOT MATERIALIZED` **re-decodes and
re-`ST_MakeValid`s the statewide city table on every chunk**, with no GiST anywhere in
the join.

## Fix A — the `ST_Covers` fast path, and it is bit-identical

For a parcel **wholly inside** a city, the intersection area is exactly the parcel's own
area. So:

```
ST_Covers(city, parcel)  ->  area := ST_Area(parcel)      -- prepared path, cheap
else                     ->  area := ST_Area(ST_Intersection(parcel, city))
```

`ST_Covers` **does** have a prepared-geometry path. Only true straddlers pay the
overlay, and in a county where most in-city parcels sit wholly inside their city, that
is most of the work removed.

**This is a substitution, not an approximation.** The values are identical, and the
card's verification requires proving that rather than assuming it.

Keep the `1e-8` overlap floor exactly as it is. It exists to drop slivers (Coupland at
7.6e-10 deg²) and the fast path must not change which parcels clear it.

## Fix B — hoist the city set into a per-run TEMP table

Decode and `ST_MakeValid` the **county-scoped** city set **once per run** into a session
TEMP table, build a GiST index on it, and `ANALYZE`. Then every chunk joins against
prepared, indexed, already-valid geometry.

That deletes the per-chunk statewide re-decode and **closes the plan-flip surface by
construction** — the rejected-but-not-killed second mechanism from the diagnosis stops
being reachable rather than staying an open question.

TEMP is safe here: one client, no pool. Confirm that is still true in the code rather
than taking it from this card.

## Fix C — verify resume on its first real use

`--run-id` cross-run resume **exists in shipped code and has never been exercised**.
The next Williamson launch will be the first, carrying nine completed chunks and 72,000
rows from run `fb490620`.

Prove it before relying on it: relaunching with that run id must **skip the nine
completed chunks** and not re-write them. Worst case is idempotent re-runs rather than
corruption, but "worst case is probably fine" is not a verification.

Add the durable form while you are here: a chunk-manifest event at run start keyed
`(county, lo, hi, method_version)`, refusing on a denominator mismatch. **`method_version`
matters now** — chunks completed under the old geometry path and chunks completed under
`ST_Covers` must not be silently interchangeable, even though the values are identical.

## Housekeeping — write the termination record for run `fb490620`

Execution `factory-p2-juris-hzkqk` was **cancelled deliberately** at
`2026-09-01T04:14:11Z` ahead of the 05:00 UTC maintenance restart:
`cancelledCount: 1`, no `failedCount`. That is a clean stop, not a crash.

**The Factory run row `fb490620-d4e9-4110-804d-21ee7375b960` is still `started`.**
Write its termination record naming this as an operator-authorised cancellation, with
the timestamp and the nine completed chunks / 72,000 rows preserved for resume. Do this
first; it is a small write on the **control** store and does not contend.

Left alone, the reaper eventually orphans it and the durable record reads like another
silent death. A deliberate stop that leaves no name is indistinguishable from the failure
class this run was cancelled to avoid.

## The falsifier, and it is unusually strong

Chunk 2 of Williamson has been measured **three times across independent processes**:
144.7s, 148.0s, 145.2s. Its emit is known. So:

**Re-run that exact range after the fix and require both:**

1. **It is materially faster.** State your expected magnitude before running it. If it is
   not faster, Fix A did not reach the hot path and the mechanism is wrong.
2. **The emit is IDENTICAL** — same unincorporated, same in-city, same unresolved, same
   rows. Not close. Identical. A bit-identical substitution that changes an output is not
   the substitution you think you made.

Do the same on a **known-cheap** range so you have both arms: a fast chunk must stay fast
and stay identical. A fix observed only making things faster has not been observed
staying correct.

Also re-run **McLennan chunk 1**, whose cost reproduced within 3% across two full runs.
It is the cleanest cross-county control you have.

## What this does not do

It does not re-chunk. Cost-budget chunking stays a separate card, and **whether it is
still needed is a question this card's measurements answer** — if `ST_Covers` makes
corridor chunks cheap, a uniform page may be fine.

It does not launch Travis. Travis is predicted structurally non-terminating under the
old design, with the falsifier registered that its chunk 1 landing under ~3 minutes
refutes the mechanism. **Do not run Travis until this lands and is measured**, and when
it does run, report chunk 1's wall time against that prediction.

It does not resume Williamson. That is the next card, after this is measured.

## Do not

- Do not change the `1e-8` floor.
- Do not change chunk size or `max_duration_s` on this card.
- Do not launch Travis.
- Do not re-investigate accumulating state; it is measured dead.
- Do not accept "faster" without "identical".
- Do not run a heavy operation while another is live; the store is free now, keep it
  one at a time.
- Do not leave run `fb490620` without a termination record.
- Do not touch any repository other than the registered Factory worktree you open.

## Close

Use the exact CP1 / CP2 / CLOSE paths named at the end of this dispatch. Declare
snapshot including image digest in the first output. State the expected speedup
magnitude **before** measuring. Report both arms on both range classes, and the
McLennan control. Say whether cost-budget chunking is still needed and why.
`leave_behind` named. Subagents do not commit.
