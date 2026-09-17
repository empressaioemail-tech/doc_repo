## Mission — P-287 and P-286: Burnet's two unreconciled facts, and the blocker register as a checklist

You launch no sub-agents (FAN-DEPTH 0). Do P-287 FIRST: it is the Burnet precondition with a
customer consequence. You open a PR in `hauska-factory` for P-287; P-286's work is doc_repo and is
left UNCOMMITTED in your own doc_repo worktree for the integration seat (AGENT_CONTRACT section 6).
You do not merge, do not deploy, and you load no data into production without saying so first.

### Where you work

`hauska-factory`, fresh clone from `origin/main` under `P:/tmp/` into a NEW directory, branch
`fix/p287-burnet-reconcile` (factory main `d2e6cb03` at compile). Your own doc_repo worktree on
branch `lane/p286-p287-burnet` for the P-286 artifacts. Register the factory clone under the
property seat and remove the entry at close. Heavy reads take a heavy-scan lease keyed on the
store's HOST (P-307). **P-254 holds doc_repo `scripts/surface-probe.mjs` — never touch it.** A
controls lane holds factory `src/jobs/verify-walk.mjs` and the gate's rail policy.

### Row P-287 — Burnet's two facts nobody reconciled

Burnet 48053 holds 59,785 parcels on production against 50,138 geometry-ingest features, and
`txgio_address` held no Burnet address points when last counted (A-150a, 2026-08-08), so no Find-box
lookup can pass there.

**Done:** the parcel-to-feature gap is explained and reconciled, or ruled with a named reason and a
count; and Burnet's address points are loaded (P-189) and re-counted immediately before the run.
Re-measure both numbers first — they are from August, and this operation's own rule is that a figure
is a claim about its date.

Loading address points is a production write. Establish the path and the count, then STOP and put
the write in your close for the operator: the ingest freeze covers the atoms path, and the
session-under-a-lease shape (A-202, A-207) is the precedent for boundary-table loads, but nobody has
ruled on this one.

### Row P-286 — the blocker register becomes a checklist

The register holds 486 instances in 18 classes plus 55 candidate keys. C7 (46 instances) and C14
(16) have no check in any stage; 18 of 19 labels have no executable check; the one that runs is
county-locked (teardown T6).

**Done:** the class set is CLOSED (each candidate is folded into a class or declined, with the count
per class restated); every class has an executable check with its trigger, its failure and its
bypass named, or an explicit audit-only line saying no check is possible and why; and the pre-bake
audit (stage 2) runs the checks that exist against a county. P-253 is the first generalised check
and is the shape to follow.

A check that cannot fail is worse than an absent one. For every check you write, record the input
that makes it fail.

### Falsifiers — pre-register your predictions before measuring

1. Burnet's parcel count and feature count re-measured today differ from 59,785 / 50,138 (predict
   the direction; if they are identical, say so and note that nothing moved since August).
2. A Find-box lookup for a real Burnet address fails today, and the reason is the missing address
   points rather than anything else (name the other candidate and rule it out).
3. Every P-286 class has either a check that fires on a planted violation, or an audit-only line;
   the counts per class sum to the register's total with nothing in two classes.

### Do not

- Write to production (including address points) without the operator's go; propose it in the close.
- Publish, bake, or run a writer against Burnet.
- Merge, deploy, or commit in doc_repo.
- Launch sub-agents.

### Close

Snapshot per repo and store with read timestamps; the re-measured Burnet numbers with their
queries; the reconciliation or the ruling; the address-point path and its exact commands, unrun;
the P-286 class table with each check, its trigger, its failure and its bypass; the falsifiers with
evidence; the list of doc_repo files left uncommitted for the integration seat. `status`:
`closed-partial` until the operator rules on the address-point load and the integration seat commits
the P-286 artifacts. `probe`: `{"notApplicable": "precondition lane; graded by Burnet's stage 2"}`.
`subAgents`. `leave_behind`.
