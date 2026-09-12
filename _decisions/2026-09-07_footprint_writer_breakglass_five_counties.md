---
decision_id: 2026-09-07_footprint_writer_breakglass_five_counties
date: 2026-09-07 (drafted retroactively 2026-09-12 by the P-171 audit; filed as proposed by the integration seat the same day)
owner: Nick (operator); recorded by the integration seat
status: active (ACCEPTED AS WRITTEN by the operator 2026-09-12: a retroactive record of a directed run, with no advance greenlight on file; the contested tier stays contested)
related_canonical:
  - _decisions/2026-08-26_ingest_freeze_and_cloud_loader
  - _decisions/2026-09-06_boundary_envelope_atom_program_scope
  - _decisions/2026-09-12_footprint_write_provenance_rowed
  - _decisions/2026-09-12_loaders_get_cloud_jobs_no_break_glass
  - _inbox/2026-09-06_integration_unmerged-migrations-run-against-prod_pattern.md
  - _inbox/2026-09-06_integration_building-footprint_ctx-gap_resolved.md
  - _inbox/2026-09-11_p158-footprint_close.json
  - _inbox/2026-09-12_p171-provenance_close.json
---

## Decision (retroactive break-glass record; drafted by the P-171 audit, filed verbatim in substance)

The 2026-08-26 laptop-ingest freeze names "P-09 footprint" under "does not unblock", so
`write-building-footprint-county.mjs` had no sanctioned `--apply` path on 2026-09-06 and 07.
The hauska-engine lane running under the session label `cente-67` ran that writer with
`--apply` directly against production overnight 2026-09-06 into 2026-09-07 for the five
Central Texas counties then missing footprint atoms (Bastrop 48021, Hays 48209, McLennan
48309, Travis 48453, Williamson 48491), gated on two prerequisite fixes landing first
(hauska-engine #391 migration reconciliation, merged 2026-09-06T23:22:17Z; #392 roster-query
and performance fix, merged 2026-09-07T00:54:15Z), sequenced one county at a time with live
verification against the atoms table between each, per the operator's own instruction not to
batch-apply blind. It produced 1,031,394 atoms across the five counties with zero verify
failures. No break-glass row was filed at the time. This row is that record, filed after the
fact under the freeze's own reversal text ("the operator names a return to laptop applies for
a specific emergency; that is a recorded break-glass run row, not a reversal of this decision").

## What is solid and what is contested (the audit's two tiers, kept as written)

Solid: the operator directed and was engaged with the run's sequencing discipline. The
2026-09-07 addendum to the boundary-envelope program decision records the run as closed with
counts verified live by the integration seat, "per the operator's own instruction not to
batch-apply blind". That text was committed about five hours after the write window closed
(06:18Z), so it records what happened and how it was disciplined, not a sign-off on the first
byte.

Contested: a same-night document reads as advance authorization ("routed to Engine (cente-67)
as a greenlit remediation task ... then safely re-run the atom-writer against the five CTX
counties still missing footprint atoms"), while its sibling document from the identical
session says the operator wanted discussion before any action. Both were committed in one
batch the next day; git cannot order them and no third document resolves it. This row rests
on the solid tier only.

## What the operator decides

One of: (a) accept, confirming that sign-off preceded the first write, which upgrades the
contested tier to solid; (b) accept as written, a retroactive record of a directed run
without a clean advance greenlight on file; (c) reject, in which case the write stays
recorded as unattributed-to-a-row in the P-171 close and the freeze decision gains a note
that its break-glass mechanism was not used when it should have been.

## What changes either way

Nothing about the next write: the 2026-09-12 ruling routes every future footprint write
through the Cloud Run job P-169 built (`hauska-engine-atoms-writer`, in the project since
2026-09-12 15:09Z), with a code-level laptop refusal verified by the P-169 lane. The lease
tables are delete-on-release mutexes with no history, which is why this audit could not read
the run's lease row; the P-171 close recommends an append-only lease history table, rowed
separately.

## Reversal criteria

None; this is a record of a completed, one-time exception, not a policy.
