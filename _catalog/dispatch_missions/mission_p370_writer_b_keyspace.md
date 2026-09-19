## Mission — P-370: writer (b) tests membership in the node's own keyspace, so Williamson can publish

You launch no sub-agents (FAN-DEPTH 0). You build in `legacy-design-tools` and open one PR from
current `origin/main` with the SHA declared (`b5d8f355` at compile). You do not merge, bake, publish,
deploy or write any store; the integration seat does, and it moves the factory's `_LDT_SHA` pin.

### What happened (measured 2026-09-19, `_inbox/2026-09-19_p350_williamson_RECORD.md` section 5)

Williamson's staging publish `cswmw` (run `bd087474`, publish image `502e9734`, bake LDT `03bb424a`)
passed readiness (16 of 16 floor rails), the coverage floor (retention 1.051) and the retirement gate
(0 new retirements, share 0), then failed `BAKE_FAILED` 6.4 s into the bake, writing nothing.

The mechanism, read at source in `artifacts/api-server/src/nodeFacetBakeTier1ConformantCli.ts`
(around line 450 at `03bb424a`): on a gate-blocked county, `joinParcelRows` reads every work id
against the parcel table's `prop_id`, and `partitionAccountKeyedWork` excludes each id it does not
find, on the premise that such a node is an account-keyed HOLLOW node (true for Hays' five). P-351
added `accountKeyedBlastRadius` / `assertAccountKeyedBlastRadius`, which refuses when the excluded set
IS a whole served keyspace. For Williamson:

- `txgio_parcel` for 48491 holds 282,569 R-prefixed ids and **zero numeric ids** (read in staging and
  production, 2026-09-19).
- The work list carries 319,480 numeric served ids, and P-327 measured all 319,480 present on the
  declared 2026 roll: they are live accounts, not hollow nodes.
- So the entire numeric keyspace is excluded and the guard refuses. This is the exact mechanism that
  retired 319,480 live rows on 2026-09-17 (P-327's F5), now refused instead of written. **The guard is
  right; the membership test is the defect.**

One caveat you must close rather than assume: the publish dropped the bake's stdout and stderr (P-371
is carded for that), so the guard's own per-keyspace line is on no record. Reproduce the refusal
first: run the bake CLI read-only (`--dry-run`) for 48491 against the staging store under a
heavy-scan lease, and show the line `account-keyed exclusion vs served keyspace "numeric" for 48491:
319480 of 319480 served key(s) excluded` (or whatever it really prints). If it refuses for a
different reason, stop and report.

### What to build

1. **CP1 before any code: what should 48491 serve?** Two keyspaces name the same parcels: the numeric
   roll accounts (319,480, served live in production from the 2026-09-10 bake) and the R-prefixed
   parcel-index ids (282,569, falsely retired in production; P-351 now resolves them to live
   accounts). Say what the published end state is (both keyspaces served; one served and the other
   declared an alias; one retired with a named successor), with the evidence and the customer lookup
   paths (`48491:107190` is numeric; the walk gold `48491:76149` is numeric). Do not pick silently:
   this is the node-identity question (`hays-node-id-is-the-parcel-map-id` is the precedent: Hays'
   node id is the parcel-map id, the account only through the crosswalk). If the answer needs the
   operator, say so in CP1 and build nothing that depends on it.
2. **Writer (b) tests membership in the node's own keyspace.** A numeric node is looked up through the
   county's published pair (`tx_wcad_owner` / `tx_wcad_ag_valuation`: prop_id is the R account the
   parcel index publishes, wcad_property_id the numeric account the roll is keyed by), the same
   resolution P-351 built for writer (a) (`retirementAccountResolution.ts`), rather than by its bare
   key against an R-keyed table. A node the pair maps to a published parcel is not hollow. A node no
   published identifier reaches is DECLARED (not retired, not excluded as hollow). Hays' measured
   shape (its hollow subset) must behave exactly as today.
3. **The guard stays and still fires.** A whole-keyspace exclusion still refuses, by violation.

### Verify by violation

Pre-register your falsifiers: Williamson's numeric keyspace no longer excluded (the dry run's
per-keyspace line reads a count you predicted, with its basis); Hays' hollow set unchanged key for key
(pin it with a golden list); a fixture whose whole keyspace misses the parcel table still refuses;
a single-keyspace county's payload byte-identical to before (P-351's golden hash method). Then a
read-only dry run of the bake for 48491 against staging under the heavy-scan lease, beside your
prediction.

### The three-question gate

What executes writer (b)'s membership test, what triggers it, what fails when a live keyspace is
excluded, and what bypasses it (a bake run outside the publish; the frozen laptop scripts).

### Constraints

- No store writes, no bake apply, no publish, no deploy, no merge. Read-only dry runs only, under a
  heavy-scan lease, one window at a time.
- `legacy-design-tools` only. The factory pin moves when the seat merges.

### Close

Declare: the start commit and PR, CP1's answer on the served state, the reproduced refusal line, the
fix, the dry-run per-keyspace counts beside the prediction, the falsifiers with both directions shown,
the three-question gate answers, and `leave_behind`.
