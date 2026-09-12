## Mission — P-171 PROVENANCE: name the writer of the 2026-09-07 building-footprint atoms

You are the deepest worker in OPS-23 wave 2. You do not spawn sub-agents. The dispatch
planner supervises you and reviews your CP1 and CP2. This is an audit row: you read, you do
not write to any store, and you deploy nothing.

Exit-bounded verification: every command you run must terminate on its own; wrap anything
that could hang in `timeout`; never leave a watch, a tail or a dev server running.

### Where you work

`empressaioemail-tech/hauska-engine`, worktree `P:/seat-worktrees/property/hauska-engine-p171-provenance`,
branch `audit/p171-footprint-write-provenance`, from `origin/main`. You will add at most a
script under `scripts/audit/` that reproduces your reads, and nothing else. `P:/hauska-engine`
is someone else's checkout.

### The finding you are closing

`_inbox/2026-09-11_p158-footprint_close.json` (contradicted, item 1; leave_behind): the atoms
store holds 71,501 `building-footprint` atoms for 48021 (24,861 present, 46,640 absence) and
396,462 for 48453 (72,919 present, 323,543 absence), all created 2026-09-07, and the lane found
no matching Cloud Run job execution in that window. An unattributed production write is the
thing ENFORCEMENT.md says a state-changing operation must make impossible. Decision:
`_decisions/2026-09-12_footprint_write_provenance_rowed.md`.

### What you read, in this order, each by field name

1. The atoms themselves: the `createdAt` distribution for `entity_type = 'building-footprint'`
   in 48021 and 48453 by hour (id-range join, never `LIKE`), and any writer identity the atom
   body or its provenance carries (`writtenBy`, `runId`, `source`, lease id). Paste the query
   and the result.
2. `atoms_writer_lease_v2` rows whose scope covers `(atoms, building-footprint, 48021)` and
   `(atoms, building-footprint, 48453)` with `takenAt` or `heldAt` on 2026-09-06 to 2026-09-08.
3. The factory `runs` table for any run naming footprint or those counties in the window.
4. Cloud Logging in `hauska-prod-497015` and `legacy-design-tools-prod` for 2026-09-07:
   Cloud Run job executions (any job), service request logs that write atoms, and any
   `write-building-footprint-county` string, read with `gcloud logging read` and a bounded
   `--limit`, output as JSON and read by field.
5. Git: `git log --since=2026-09-06 --until=2026-09-08 --all` in hauska-engine for commits
   touching the footprint writer, and the PR that shipped the staged-geometry join, to see
   whether a lane recorded a run in its close (search doc_repo `_inbox/` for 2026-09-07
   closes mentioning footprint; the boundary-envelope atom program of 2026-09-06 to 07 is the
   likely neighbour).

### What the close says

One of three, and only with the evidence pasted: (a) a run record or an execution log that
names the writer, the machine, the lease and the counts; (b) a named writer with no record
(a laptop run under the freeze), in which case the close carries a break-glass row written
after the fact per the freeze decision's own reversal text, naming who ran it, from where,
with what lease, and the operator's acknowledgement; (c) not attributable from any source
listed above, stated as such, with every source read listed, and a recommendation on what
record the next write must leave so this cannot recur.

State the mechanism you believe explains the write and a second mechanism that would produce
the same rows, and why you rejected it.

### Verification, and the falsifier you pre-register

Write down at CP1: *if the atoms' own `createdAt` values do not fall on 2026-09-07, the
premise is wrong and the row closes as a correction to F8's successor, not as an audit.*

The planner runs `node scripts/surface-probe.mjs --rows P-171 --observations <file>`. The
P-171 predicate is observed: `writerNamed` (true only for outcome (a) or (b)), `outcome` (`a`,
`b` or `c`), `recordRef` (the run record id, execution id, or the break-glass row path), with
`observedBy` and `observedAt`.

### Close

`_inbox/<date>_p171-provenance_close.json` per AGENT_CONTRACT §6 plus the OPS-23 four fields.
`leave_behind`: the audit script path, and the gap in logging you found, if any, with the
field the next writer must emit.
