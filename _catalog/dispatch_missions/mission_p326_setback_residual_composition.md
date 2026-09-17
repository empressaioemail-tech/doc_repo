## Mission — P-326: classify the 58,339 parcels that refuse setbacks

You launch no sub-agents (FAN-DEPTH 0). **This lane writes NOTHING.** It is a read-only measurement
against the production factory store, taken under a heavy-scan lease. You open one PR carrying the
instrument and its tests; the numbers go in your close.

### Why this exists

The post-apply completeness re-grade (`_inbox/2026-09-17_six_county_completeness_post_apply.txt`,
run 2026-09-17T22:03:12Z) shows all five setback rails — `setbackFrontFt`, `setbackRearFt`,
`setbackSideFt`, `setbackCornerFt`, `setbackRules` — classed `must-pass` and refusing in every one
of the six counties:

| County | Parcels refusing |
|---|---|
| Travis 48453 | 33,883 |
| McLennan 48309 | 8,610 |
| Hays 48209 | 8,283 |
| Williamson 48491 | 5,299 |
| Bastrop 48021 | 1,313 |
| Caldwell 48055 | 951 |
| **Total** | **58,339** |

These are the **only customer-visible block** in the Phase 0 ledger: the other open rails are either
mid-cutover (the value serves by another path today) or deferred by ruling. A parcel in this set
gets a refusal where a customer expects a setback.

P-256 applied at exactly the A-199 ceilings and moved 219,472 parcels, so this residual is what its
gate **could not** move, not what it skipped. Every plan for the remaining setback work — including
how much of it P-300's jurisdiction-default row can carry — is guesswork until this set is
classified. **Travis alone is 58 percent of it and nobody has looked.**

### What to build

1. **Find the refusal's origin in code first.** Read the setback writer and the table router and
   establish what makes a cell refuse rather than resolve. Do not infer the classes from the output;
   derive them from the write path and then measure against it. Code reading outranks output
   measuring, and every real defect in this operation to date was found by reading a write path.
2. **Classify all 58,339 by the REASON they refuse**, per county and per city. Expect classes along
   the lines of: no table for the jurisdiction at all; a table exists but the parcel carries no
   district; the parcel's district is not in the table; the source was unreadable. Do not force the
   data into that list — if it wants a class you did not expect, name that class. Say which classes
   you derived from code and which the data forced.
3. **The counts must sum to 58,339 with no parcel in two classes**, and you assert that as an
   invariant rather than reporting it as an observation. If they do not sum, that gap is the finding
   and it leads your close.
4. **Count separately the share P-300's jurisdiction-default row could serve** — parcels in a
   jurisdiction with no district, where a single city-wide default line would resolve them — from
   the share that needs a real district table. This is the number that decides whether the remaining
   setback work is small or large, so it carries its own denominator and its own derivation.
5. **State your snapshot** in the output: the commit, the store, and the timestamp of the read. An
   instrument run against a stale tree returns confident wrong answers.

### Constraints

- **No writes.** SELECT only. Prove it: digest the population before and after your read and show
  the store unchanged, the way P-263's census did.
- Take the heavy-scan lease keyed on the store HOST before reading, and release it in a `finally`.
  A lease key that is not a real host is refused (P-307); one Neon endpoint is one key, pooler and
  direct spellings included.
- Do not take, renew or release a lease belonging to another seat, and do not use a live lease as a
  fixture.
- **Do not touch county 48491 in any store.** It was restored from a point-in-time branch on
  2026-09-17 after a publish retired the whole county. Reading it is fine; writing is not.
- Do not fix anything you find. If the write path has a defect, name it with its evidence and leave
  it. A separate lane owns the fix.

### Verify by violation

The instrument is a classifier, so the failure mode is a bucket that silently swallows everything.
Before trusting it: run it against a fixture whose parcels belong to a class you did NOT implement
and confirm it reports them as unclassified rather than assigning them to the nearest bucket. A
classifier that never returns "unclassified" is not a classifier. Pre-register what result would
prove your classification wrong before you run it.

If a count looks convenient — a round number, a clean split, one class holding almost everything —
treat it as a reason to distrust the instrument, not as a result.

### Close

Declare: your snapshot, the classes with the code you derived each from, the per-county and per-city
counts summing to 58,339, the P-300-servable share with its own derivation, the write-proof digests,
the unclassified bucket's contents, and `leave_behind`.
