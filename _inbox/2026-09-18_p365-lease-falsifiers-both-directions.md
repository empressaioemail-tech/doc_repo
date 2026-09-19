# P-365 — the lease falsifiers, both directions

Lane `p365-apply-lease-heartbeat` (seat `p365-lane`, worktree
`P:/seat-worktrees/p365-apply-lease-heartbeat/hauska-engine`).
Tests: `packages/engine-core/scripts/__tests__/p263-envelope-outcome-apply.integration.test.mts`
(fixture store — a local Postgres that creates and drops its own schema `p342_apply_it`; a
`neon.tech` host is refused loudly; gated on `P342_IT_DATABASE_URL`).

Five pre-registered falsifiers, all driven by an injected clock (`now`), never by sleeping:

| id | what it asserts |
|---|---|
| P-365 F1 | an apply whose lease EXPIRES between two batches refuses the later batch and writes nothing for it |
| P-365 F2 | the same when another holder TAKES the scope between batches |
| P-365 F3 | a run whose batches OUTLAST the TTL completes, because every batch renews the lease |
| P-365 F4a | a reversal refuses while another holder holds the county's scope, and writes nothing |
| P-365 F5 | a two-county reversal takes and heartbeats ONE SCOPE PER COUNTY the journal names |

## Command

    cd packages/engine-core
    $env:P342_IT_DATABASE_URL = "postgres://postgres:postgres@localhost:5432/postgres"
    npx vitest run scripts/__tests__/p263-envelope-outcome-apply.integration.test.mts -t "P-365"

## Direction 1 — PRE-CHANGE (`cff8d88`, the script reverted, the SAME tests kept)

     ❯ scripts/__tests__/p263-envelope-outcome-apply.integration.test.mts (14 tests | 5 failed | 9 skipped)
       × P-365 F1: refuses the batch whose lease expired between batches, and writes nothing for it
         → expected { refusedWith: null, …(2) } to deeply equal { Object (refusedWith, movedAtoms, ...) }
       × P-365 F2: refuses the batch whose lease another holder took between batches
         → expected { …(3) } to deeply equal { Object (refusedWith, movedAtoms, ...) }
       × P-365 F3: completes a run whose batches outlast the TTL, renewing the lease every batch
         → expected undefined to be 4 // Object.is equality
       × P-365 F4a: refuses to reverse while another holder holds the county's scope, and writes nothing
         → expected { refusedWith: null, …(2) } to deeply equal { …(3) }
       × P-365 F5: reverses under a held, heartbeated lease — one scope per county the journal names
         → expected [] to deeply equal [ 'buildable-envelope:48021', …(1) ]

    Tests  5 failed | 9 skipped (14)

The nine skipped are the file's pre-P-365 tests, filtered out by `-t "P-365"`; they are green in
direction 2 (below) and in the unfiltered run.

### What each failure says about the OLD code

**F1 — the second batch is written with no lease.**

    - Expected                     + Received
      Object {                     Object {
    -   "journalRows": 1,          +   "journalRows": 4,
        "movedAtoms": Array [          "movedAtoms": Array [
          "48021:1",                     "48021:1",
    +                                    "48021:2",
    +                                    "48021:3",
    +                                    "48021:4",
        ],                           ],
    -   "refusedWith": "P263_LEASE_LOST",   +   "refusedWith": null,

The test steps the clock past the TTL between batch 1 and batch 2 and takes no other action. The old
code wrote **all four batches** and journalled all four, returning `refusedWith: null`. This is the
dispatch's defect, measured: "a write without a held lease fails closed" held for the first batch
only.

**F2 — the lost scope surfaces only from the release, after every batch was written.**
Received `refusedWith: "ATOMS_WRITER_LEASE_NOT_HELD"` with `movedAtoms` 1-4 and `journalRows: 4`.
The old code never asked about the lease while writing; the only lease call after the take is the
release at the end of the run, which is where the theft finally raised. Four batches of writes
committed under a scope another holder held.

**F3 — the renewal cannot even be measured.** `result.lease` is `undefined` on the old code (it
returned `{moved, journalRows, batches}`), so `heartbeats` and `lastExpires` do not exist. The run
that F3 exercises *completes* on the old code — as it should, because its lease is still live — but
nothing on the artifact says so, and the same run with a longer county would be F1.

**F4a — the reversal reverses under someone else's scope.** Received
`{refusedWith: null, storedStateUnchanged: false, unreversedRows: 0}`: it restored every atom and
marked every journal row while another holder held `buildable-envelope:48021`. `reverseMovementRun`
took no lease at all.

**F5 — no lease to report.** `result.leases` was `[]`/absent.

## Direction 2 — WITH THE CHANGE (`3a38074`)

     ✓ scripts/__tests__/p263-envelope-outcome-apply.integration.test.mts (14 tests) 1979ms
       ✓ P-365 F1: refuses the batch whose lease expired between batches, and writes nothing for it
       ✓ P-365 F2: refuses the batch whose lease another holder took between batches
       ✓ P-365 F3: completes a run whose batches outlast the TTL, renewing the lease every batch
       ✓ P-365 F4a: refuses to reverse while another holder holds the county's scope, and writes nothing
       ✓ P-365 F5: reverses under a held, heartbeated lease — one scope per county the journal names

    Test Files  1 passed (1)
         Tests  14 passed (14)

## How the two directions are made to disagree honestly

`git stash push -- packages/engine-core/scripts/p263-envelope-outcome-apply.mts` reverts ONLY the
script; the tests stay in place, so the instrument that is supposed to catch the defect is the one
that is run against the defective code. Reverting the tests too would have measured nothing (the
falsifiers would not have existed).

## Pre-existing failures, measured rather than assumed

`pnpm test` for `engine-core` reports 3 failed / 1939 passed / 13 skipped, and 4 further test FILES
fail to collect (`SyntaxError: Invalid or unexpected token` importing `scripts/*.mjs`). With BOTH
changed files stashed at `cff8d88`, the same 6 files fail: 5 identically (4 collection errors +
`preflight-probes`'s 2 network-dependent assertions) and the 6th, `manifest-is-load-bearing`, is
flaky in both directions — it PASSED at base in isolation and FAILED in the full run on a 13-byte
PDF length difference (605405 vs 605418), which is a nondeterminism in the PDF renderer, not in this
row. Nothing in the failure set touches either file this lane changed.
