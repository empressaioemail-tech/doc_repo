## Mission — FINAL TEARDOWN of the Texas scale-up scope, rev 3: break it before a single build row is allocated

You are a fresh planner. You did not write this scope and you have no stake in it. **You launch no
sub-agents (FAN-DEPTH 0); do all the work yourself.** You write no product code and change no
store. Your product is a review that tries to make the plan fail, says exactly where it holds,
and names what the plan does not cover at all.

Exit-bounded verification: every command terminates on its own; wrap anything that can hang in
`timeout`; never leave a watch, a tail or a poll running.

### Your seat and first commands

Seat `dispatch-planner`, worktree `P:/seat-worktrees/dispatch-planner/doc_repo`, branch
`seat/dispatch-planner`.

```
git -C P:/seat-worktrees/dispatch-planner/doc_repo fetch origin
git -C P:/seat-worktrees/dispatch-planner/doc_repo merge --ff-only origin/main
git -C P:/seat-worktrees/dispatch-planner/doc_repo log --oneline -1
```

**If the fast-forward fails, STOP and report. Do not reset, rebase or discard anything.** Declare
the commit you are on.

**Product repos:** read at `origin/main` only, with `git -C P:/<repo> show` and `git grep`.

**Stores:** read-only only.

- **Factory store:** `FACTORY_DATABASE_URL_RO`, with `default_transaction_read_only=on`.
- **Atoms store:** `ATOMS_DATABASE_URL` only with
  `PGOPTIONS='-c default_transaction_read_only=on -c statement_timeout=240000'`, EXPLAIN first,
  and index-bounded predicates only. The indexes are listed in the research-wave dispatch.
- **Never print a DSN.**

### What you read first, all of it

- `_inbox/2026-09-16_texas_scaleup_program_scope.md`: the plan under attack, rev 3.
- `90_operations/OPS-24_county_to_serving_program.md` rev 3 and
  `_catalog/program_preambles/OPS-24.md`.
- `_decisions/2026-09-16_texas_scaleup_sequence_and_four_rulings.md`, with its addenda.
- OPS-16 amendments A-176 to A-182 and rows P-186 to P-250.
- `_inbox/2026-09-16_scaleup_research_wave_report.md` and the five lane reports it links.
- `_inbox/2026-09-16_farm_architecture_draft.md` and
  `_inbox/2026-09-16_scaleup-ld_farm_architecture_report.md`.
- **The blocker register, both halves:**
  - `_inbox/2026-09-16_scaleup-lc_blocker_register.json` (361 instances);
  - `_inbox/2026-09-16_scaleup-lc2_blocker_register_addendum.json` (125 new);
  - the class table, the delta, the smooth path and the unfixed list.
- `_inbox/2026-09-16_scaleup-le_card_spec.md` and the fixture list.
- `scripts/six-county-completeness.mjs`, `scripts/ledger-truth.mjs` and
  `scripts/envelope-draw-gap.mjs`.

### The theses you attack, in this order

For every thesis, give:

- the claim as the scope states it;
- the file and SHA, or the query and timestamp, you tested it against;
- **a second mechanism** that would produce the same observation;
- a verdict: **HOLDS**, **HOLDS WITH A NAMED CONDITION**, or **DOES NOT SURVIVE**.

**T1. Phase 0's exit cannot pass while a customer still sees something wrong.**
- Attack the four-part exit (scope section 5).
- Find a customer-visible defect from the card spec, the L-E defect list or items X1 to X11 that
  `six-county-completeness.mjs` exiting 0 would not catch.
- Attack its policy table: `deferred` for roads and edgeSignal, `no-source` for the P-203 eight.
- Say what the exit must add.

**T2. P-201 closes the zero-earned gate hole.**
- Read `evaluatePublishGate` and `evaluateRailGate` at factory `origin/main`.
- Write the exact violation test: an instantiated, unfilled county must refuse.
- Say whether P-201's three-state split refuses that county without falsely refusing a
  county-scoped rail such as `maxImperviousCoverPct`.

**T3. P-249 is the shortest path to an "ok" envelope, and it is safe.**
- Re-derive the 131,357 figure, or name the query it depends on.
- Test the `depthWarmPromoted` wiring against LDT's wire type and hauska-map's use of it.
- Say what the 123,706 unexplained zeros become when the live derive fails its own geometry
  gates.
- Test the "figure only when verified" ruling against every surface that prints a figure,
  including PDFs.
- Specify the staging proof that would have caught the P-216 outage.

**T4. The setback reconciliation (S0 to S8) can reach "everywhere that should have setbacks has
them".**
- 219,472 parcels: 125,212 district misses and 94,260 in 54 no-table cities.
- Classify a sample of the 54 cities as zoned-with-layer, zoned-without-layer or unzoned from
  public sources, and say what the full classification will take in work, not time.
- Test whether S1's flip from `absent-verified` to `unaccounted` is safe on each surface, with the
  file and line of what each renders.

**T5. Burnet on the shared stores is safe and measurable.**
- Test against L-D's capacity facts, the 2026-08-28 read-timeout incident, and the heavy-scan
  rule.
- List the telemetry that must exist before Burnet starts, for "Bell and Milam beat Burnet" to be
  a query.
- Test the storage decision against the blocker register's contention class (C17).

**T6. The blocker register can serve as the pre-bake audit's checklist.**
- For every class, C1 to C18 and every NEW candidate in the addendum, name the farm stage and
  the executable check that catches it.
- **List every class with no executable check.** A class caught only by "the planner reads it"
  counts as not caught.

**T7. The Phase 0 order has no hidden dependency or contention.**
- Map every Phase 0 item to its repo and its dependencies.
- legacy-design-tools carries many rows; find the contention and circularities.
- State the dependency-ordered sequence the plan actually implies, with no dates or durations.

**T8. Phase 0 fixes every customer-experience defect found.**
- Map D1 to D16 and X1 to X11 to owning rows.
- **List every defect no row owns.**

**T9. Security and operational debts do not block Burnet.** Test each and say whether it must be
cleared before Burnet runs:
- ADD-084, the `PRODUCTION_NEONDB_URL` value exposed 2026-09-04 and still unrotated (the secret
  is at version 1);
- the staging secret rotation gap (A-181);
- the six quarantined branches;
- the workstation TLS setting (A-181);
- the FAN-DEPTH gate's named bypasses;
- the six duplicate amendment ids;
- the two closes held off main (A-176).

**T10. What is missing entirely.** Name anything completing the six counties, building the farm,
or running Burnet, Bell and Milam requires that no row, item or decision in the scope owns.
**Exhaust this; do not stop at the first gap.**

### What you must not do

- Build anything, card a row, or edit the scope. The overseer amends it from your review.
- Soften a verdict.
- Accept a status line, a close, or the scope's own wording as evidence.
- Launch any sub-agent.
- Write to any store or repo other than your own seat branch's `_inbox/`.

### Close

**Artifacts.**

- `_inbox/<date>_scaleup_final_teardown_review.md`: the ten theses with verdicts and evidence;
  a consolidated list of what does not survive; the missing-items list; and a ranked "must
  change before any build row" list.
- `_inbox/<date>_scaleup-teardown_close.json`, carrying:
  - `planRows` `["P-198", "P-201", "P-249"]`;
  - `status`;
  - `probe` `{"notApplicable": "read-only review lane"}`;
  - `subAgents` `{"spawned": 0, "maxDepth": 0}`;
  - `falsifier`;
  - `contradicted`;
  - `leave_behind`.

**Falsifiers to pre-register.**

1. At least one thesis does not survive. If all ten hold, show the strongest attack you made on
   each.
2. T6 names at least one class with no executable check, or shows the check for every one.
3. Every verdict cites a file with a SHA, or a query with a timestamp.

**Committing.** Commit to your seat branch with explicit pathspecs, each git verb in its own call,
and push. **Your reply lists every path and the pushed commit SHA.**
