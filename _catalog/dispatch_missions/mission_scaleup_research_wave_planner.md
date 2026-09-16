## Mission — TEXAS SCALE-UP RESEARCH WAVE (dispatch planner): five read-only lanes that find what the scope does not know

You are the DISPATCH PLANNER (topology: `_decisions/2026-09-11_overseer_dispatch_planner_lane_topology.md`).
You compile five lane dispatches, spawn one read-only sub-agent per lane, supervise each to
completion, attack its output (AGENT_CONTRACT CP1 and CP2), independently re-derive at least
three numbers from each lane, and write the wave report. **Nothing in this wave writes to any
product repo or any store.** The deliverable is information, and the next thing to happen is the
overseer revising two documents from it:

- `_inbox/2026-09-16_texas_scaleup_program_scope.md` (read it first, all of it);
- `_inbox/2026-09-16_farm_architecture_draft.md` (read it second).

Exit-bounded verification: every command terminates on its own; wrap anything that can hang in
`timeout`; never leave a watch, a tail or a poll running. No notification arrives when a
background command ends; poll with a bounded loop.

### Your seat and your first commands

Seat `dispatch-planner`, worktree `P:/seat-worktrees/dispatch-planner/doc_repo`, branch
`seat/dispatch-planner`.

```
git -C P:/seat-worktrees/dispatch-planner/doc_repo fetch origin
git -C P:/seat-worktrees/dispatch-planner/doc_repo merge --ff-only origin/main
git -C P:/seat-worktrees/dispatch-planner/doc_repo log --oneline -1
```

The overseer lands this branch's 24 wave 6 commits on main before sending you this.

- **If the fast-forward fails, STOP.** Report the divergence and do not reset, rebase or discard
  anything.
- Declare the commit you are on in your first output.

### Store access, for every lane

| Store | How | Rules |
|---|---|---|
| Factory store | `FACTORY_DATABASE_URL_RO` (Secret Manager, hauska-prod-497015) | set `default_transaction_read_only=on` and `statement_timeout` on every session |
| Atoms store (`hauska_mcp`, 203 GB, about 102M rows) | `ATOMS_DATABASE_URL` (hauska-prod-497015) | This credential can write, so every psql session must start with `PGOPTIONS='-c default_transaction_read_only=on -c statement_timeout=240000'`. Run EXPLAIN before any query. Only index-bounded predicates. |
| Landing (`neondb`) | an existing read path only | if none is available read-only, mark the read UNMEASURED |

The atoms store has these indexes:

- `(entity_type)`;
- `(entity_type, entity_id)`, unique;
- partial `body->>'parcelNodeId'` with `text_pattern_ops` for `zoning-fact`, `setback-rule`,
  `buildable-envelope` and `parcel-terrain-model`;
- partial indexes for `property-boundary-edge`, `building-footprint` and `parcel-node`;
- `road-node` by `roadNodeId` and by `countyFips`.

A family without a parcel-bounded index is sampled, and the sample is declared as a sample.

**Heavy-scan serialisation (contract section 4).** Only ONE lane queries the atoms store at a
time. You sequence it: L-A first, then L-B. Never print a DSN, and never write one to a file.

### The standing instruction for every lane

**Exhaust the question.** Agents on this program have repeatedly found the first blocker and
stopped. A lane that finds a blocker records it, with evidence, and keeps going through the rest
of its scope. A report that names one blocker and stops is sent back. Every count is a count,
never a sample presented as a total. Every claim names its file and SHA, or its query and
timestamp.

### The wave

| Lane | Id | Mission | Plan rows (compile flag) | Reads |
|---|---|---|---|---|
| L-A ledger truth | `scaleup-la-ledger-truth` | `_catalog/dispatch_missions/mission_scaleup_la_ledger_truth.md` | `P-201,P-204` | factory store, atoms store (first), code |
| L-B envelope and road nodes | `scaleup-lb-envelope-roads` | `_catalog/dispatch_missions/mission_scaleup_lb_envelope_roads.md` | `P-233,P-235` | atoms store (after L-A), factory store, live surfaces, code |
| L-C blocker history | `scaleup-lc-blocker-history` | `_catalog/dispatch_missions/mission_scaleup_lc_blocker_history.md` | `P-188` | doc_repo history, closes, code |
| L-D farm architecture | `scaleup-ld-farm-architecture` | `_catalog/dispatch_missions/mission_scaleup_ld_farm_architecture.md` | `P-187,P-198` | code, config, Cloud Run and Neon metadata, store catalogs |
| L-E customer experience | `scaleup-le-customer-experience` | `_catalog/dispatch_missions/mission_scaleup_le_customer_experience.md` | `P-197` | live surfaces, factory store for fixture selection |

**Compiling.** Compile each lane in your worktree, never by hand:

```
node scripts/dispatch.mjs --lane <id> --plan-row <rows> --repo doc_repo --mission-file <mission>
```

**Spawning.** Paste each compiled dispatch into its sub-agent **in full**, because the canon gate
refuses a prompt that only names a path. One level deep. Lanes spawn nothing.

**Starting.**

- L-C, L-D and L-E start at once.
- L-A starts at once. L-B starts its atoms-store work only after L-A reports its atoms-store
  reads finished; L-B's non-atoms work can start at once.

### What you verify yourself

For each lane:

- re-run its instrument, where it built one;
- re-derive three of its numbers by a different query or file;
- read its code citations at the SHA it names.

**Numbers the overseer already measured**, which the lanes must reproduce or contradict with
evidence:

- 219,472 false setback absences: 125,212 district misses and 94,260 in 54 no-table cities.
- 490,185 "no-buildable-area" envelope atoms, grouped into the classes in scope section 2c.
- 318,000 `unaccounted` ag-valuation cells in four counties.
- `scripts/six-county-completeness.mjs` reading INCOMPLETE.

### Close

**Artifacts.** In your worktree:

- each lane's report and close under `_inbox/2026-09-1x_scaleup-<lane>_*`;
- each instrument under `scripts/`;
- your own `_inbox/<date>_scaleup_research_wave_report.md`: what each lane found, what you
  re-derived, what contradicted the scope, and what is still unknown;
- `_inbox/<date>_scaleup-research-wave_close.json`, carrying:
  - `planRows` `["P-198", "P-201"]`;
  - `status`;
  - `probe` `{"notApplicable": "read-only research wave"}`;
  - `leave_behind`.

**Committing.** Commit to your seat branch with explicit pathspecs, each git verb in its own call,
and push. **Your reply to the overseer lists every path and the pushed commit SHA.**
