# Mission — the lease hole: four writers can be selected and none can persist

## Why this card exists

WRITEPATH-PROOF ran `well-fact` on Bastrop 48021 through the allowlisted job on
2026-08-31. The execute path is proven: `executionCount` moved 8 to 9, execution
`factory-atoms-cad-lwnvz` carried `--writer=well-fact --county=48021 --apply
--run-id=59444d3f-...`, Cloud Run recorded those args on the execution, and the
child was `write-well-fact-county.mjs` and not CAD. The predicted override defect
did not fire.

It then planned 69,000 atoms across 63,357 parcels (12,079 present, 56,921 absent)
and **wrote zero**, exiting 1 on:

```
LeaseRequiredError: writePropertyAtomsBatch requires a HeldLease
  write-well-fact-county.mjs:310 -> pg-storage.ts:295
```

Store read in `hauska_mcp` confirms `well-fact` 48021 = 0 and Caldwell 48055
unchanged at 53,841. CAD 48021 `max(updated_at)` is still 2026-08-12, which
independently confirms the correct child ran.

**So "the allowlist unlocks four of five writers" is measured false at the persist
layer.** It unlocks SELECTION for four and PERSIST for none. Only CAD can write.

## The hole, scoped by measurement rather than guessed

| writer | lease | `--run-id` | apply guard | calls write |
|---|---|---|---|---|
| `write-cad-parcel-roll-county` | 1 | 3 | 2 | 1 |
| `write-well-fact-county` | 0 | 0 | 0 | 1 |
| `write-building-footprint-county` | 0 | 0 | 0 | 1 |
| `write-utility-easement-county` | 0 | 0 | 0 | 1 |
| `write-setback-city` | 0 | 3 | 0 | 0 |

Three writers call `writePropertyAtomsBatch` with no lease, no `--run-id` parsing
and no guard. All three die exactly as `well-fact` did. The setback writer parses
`--run-id`, mints nothing and does not write yet, so it is a **fourth instance
latent** behind `SETBACK_APPLY_HELD` and must be fixed in the same pass or it
becomes the next identical surprise.

**A second defect rides with it.** CAD refuses `--apply` without `--run-id` at
`write-cad-parcel-roll-county.mjs:165` and exits 2 before doing any work. The others
accept `--apply`, plan the entire county, then die at the write. Fail-closed but
fail-late: `well-fact` burned a full county plan to reach a refusal it could have
made at parse time.

## The pattern to replicate, which already exists

Do not invent a lease design. CAD's is the reference and it is small:

1. Parse `--run-id` in **both** the spaced and `--run-id=` forms
   (`write-cad-parcel-roll-county.mjs:70-71`). Cloud Run passes `--name=value`, and
   a spaced-form-only reader silently runs on defaults.
2. Guard **before any planning work**: `if (args.apply && !args.runId)` refuse with
   code `LEASE_REQUIRED` and exit 2, carrying CAD's message verbatim in substance:
   a Factory runs row is required, the HeldLease is minted from that id, and a v1
   `ATOMS_WRITER_LEASE_HOLDER` env value cannot satisfy a write.
3. Take the lease with `takeScopedLease(sql, { scope, holder_label, run_id })` from
   `packages/storage/src/atoms-writer-lease.ts`, which returns a `HeldLease` and
   itself refuses an empty `run_id`. CAD's call shape:

```
scope: { scope_type: "write", entity_type: "<this rail>", county_fips: args.county }
holder_label: CLOUD_RUN_EXECUTION || K_REVISION || "<rail>-writer"
run_id: args.runId
```

4. Thread the `HeldLease` into `writePropertyAtomsBatch`.

**`entity_type` must be this rail's own, never `cad-parcel-roll`.** The lease scope
is `(scope_type, entity_type, county_fips)`, so a correct scope is what mechanically
enforces the standing "one bulk-writer per (store, entity_type, county_fips)" rule.
Copying CAD's `entity_type` would make two rails contend for one lease and turn a
concurrency control into a deadlock.

## Falsifier, stated before any run

For **each** of the four writers, both directions, and the second arm is the one
nobody has:

- `--apply` with **no** `--run-id` refuses `LEASE_REQUIRED` and exits 2 **at parse
  time**, before any county planning. Measure that it refuses early, not merely
  that it refuses.
- `--apply` **with** a valid `--run-id` takes a lease and writes. This is the arm
  that has never been observed for any non-CAD writer.

A writer observed only refusing has not been observed working. That is exactly how
this hole survived a merged allowlist, green CI, and a job read-back.

## The live re-verify

After the code lands, re-run the WRITEPATH-PROOF shape: `well-fact` on Bastrop
48021, one heavy operation at a time, run row first. Expected: 69,000 atoms planned
and **written**, verified by reading `hauska_mcp` (never `neondb`), plus the binding
spot-check that was UNMEASURED last time because no atom existed. Compare the
written count against the plan; a gap between planned and written is a finding, not
a rounding.

Do not re-run 48021 on the old image.

## Do not

- Do not weaken or bypass the lease requirement. It is the control working.
- Do not write without a Factory runs row.
- Do not reuse CAD's `entity_type` in another rail's lease scope.
- Do not fix only `well-fact`. Three are broken and a fourth is latent.
- Do not run two heavy operations concurrently.
- Do not release Hays, McLennan, Travis or Williamson. This card does not release
  the wells wave and does not release P4.
- Do not touch the setback quarantine, which is `P4-QUARANTINE`'s card.
- Do not touch any repository other than the registered engine worktree you open.

## Close

Use the exact CP1 / CP2 / CLOSE paths named at the end of this dispatch. Declare
snapshot (repo, branch, commit) in the first output. State the falsifier for each
writer before running it, and report both arms per writer. `leave_behind` named.
Subagents do not commit. Verification does not delegate below the lane planner.
