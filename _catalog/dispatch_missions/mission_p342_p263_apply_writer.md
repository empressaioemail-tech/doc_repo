## Mission — P-342: P-263's correction gets an apply writer, and the atoms it cannot classify stop making a false claim

You launch no sub-agents (FAN-DEPTH 0). You build in `hauska-engine` (and in the repo that serves the
withheld state, if step 4 needs it) and open one PR per repo. **You do not run the apply against
production and you write to no store.** The integration seat runs it, county by county, after
reviewing your dry runs. Any doc_repo change is handed back as a diff in your close.

### The rulings you are implementing

OPS-16 A-215 (`_decisions/2026-09-18_phase0_closeout_rulings.md`):

- **Ruling 11:** P-263 applies county by county, each county's run capped at its own measured share,
  under P-213's blast-radius refusal and P-281's heavy-scan lease.
- **Ruling 12:** the 30,434 envelope atoms P-263 cannot classify are withheld as unverified on every
  surface and never served as the legacy "Setbacks consume the lot" claim. The operator flagged them
  to be fixed properly later; that is P-343, not this lane.

### What exists (read these, do not re-derive them)

- The census: `hauska-engine` `packages/engine-core/scripts/p263-envelope-outcome-census.mts`. It
  counts, reports P-213's verdict (`--blast-radius-max-share`, report only) and has a `--guard`
  recurrence mode. **It writes nothing, and there is no apply path anywhere.**
- The movement of record, 2026-09-17 21:00Z, SELECT only, population digest identical before and
  after: `_inbox/2026-09-17_p260-p263_p263-movement-census.json`, with the run log, the blast-radius
  verdict log and the guard-firing proof beside it in `_inbox/`. Population **490,185** active
  `no-buildable-area` envelope atoms without a zero proof, inside 709,372 active buildable-envelope
  atoms in the six counties: **208,868 to `not-applicable`** (unzoned), **250,883 to a pending
  derivation** (97,108 of them carry the retired Tier-1 status), **30,434 unclassifiable** (they name
  failed orientation, inset or road computations, e.g. "edge 0: R32 0ft != expected 15ft for role
  front"). Bucket sum equals the population.
- The write-side guard shipped in engine #471 (P-260/P-263's code half, deployed 2026-09-17): no
  writer can emit `no-buildable-area` without a computed, verified zero.
- The atoms store is the `hauska_mcp` database, not the default; a read against the wrong database
  returns a false absence.

### What to build

1. **An apply mode** beside the census (or a separate script that imports the census's classifier;
   one classifier, never two): `--county=<fips>` required, dry run by default, `--apply` explicit.
   It moves exactly the census's buckets and nothing else, and it refuses a county whose population
   or buckets differ from a fresh census taken in the same leased window.
2. **The cap.** Each county's run declares its own measured share to P-213 and is refused above it.
   A missing share refuses; it never defaults. Print the exact authorisation the seat would pass.
3. **A durable record of every change:** per atom, its id, its before-state and its after-state,
   written before the write commits (if the record cannot be written, the write does not run). This
   is also the reversal path; say how a county's apply would be reversed from it.
4. **The 30,434.** Find every surface that could print the legacy claim for these atoms (map panel,
   MCP, PDF, the draw route) and show, per surface, whether P-249 and P-304 already withhold them. If
   any surface would still print the claim, make it withhold them as unverified, in the repo that
   owns that surface. The apply itself does not move them.
5. **Keep the guard red.** After a county applies, `--guard` on that county must read zero
   mislabelled atoms, and it must still fire on a fixture that writes one.

### Verify by violation

Pre-register your falsifiers and what would prove each wrong.

- Per county, a dry run reproduces that county's census buckets exactly and writes nothing (digest
  before and after).
- A run above the county's share refuses and writes nothing; the exact authorisation lets the same
  run through; a stale authorisation (counts moved) does not carry.
- On a fixture store: the apply moves the buckets, the record holds every before-state, and a reversal
  from the record restores the fixture byte-identically.
- The 30,434: a fixture atom of that class is withheld on every surface you named; the legacy string
  does not appear.

### The three-question gate

Answer in your close: what executes the apply, what triggers it, what fails above the cap or on a
changed population, and what bypasses it (a raw connection, any other writer of envelope atoms).

### Constraints

- No store writes, no production apply, no deploys, no merges.
- Heavy reads take P-281's lease keyed on the store host, renewed before expiry.
- hauska-engine main carries #471 and #472. Branch from `origin/main` and declare the SHA. Another
  engine lane (P-328) is in flight on the parcel-node reconcile scripts; do not touch them.

### Close

Declare: start commit, PR numbers, the apply's flags and refusals, the per-county dry runs with their
digests, the record and reversal path, the per-surface answer for the 30,434, the three-question
gate, and `leave_behind`.
