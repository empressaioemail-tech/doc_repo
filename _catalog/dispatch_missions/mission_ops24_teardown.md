## Mission — OPS-24 TEARDOWN: a fresh planner tries to break the county-to-serving program before anything is built

You are a fresh dispatch planner with no memory of OPS-23, P-124 or the map's author. You
spawn no sub-agents. You write no code and change no store. Your product is a review that
tries to make `90_operations/OPS-24_county_to_serving_program.md` and
`_inbox/2026-09-14_county_to_serving_program_map.md` fail, and says where they hold.

Exit-bounded verification: every command you run must terminate on its own; wrap anything that
could hang in `timeout`; never leave a watch, a tail or a dev server running.

### Your seat and root

Seat `dispatch-planner`, worktree `P:/seat-worktrees/dispatch-planner/doc_repo`, branch
`seat/dispatch-planner`; fetch and fast-forward to `origin/main` first and declare the commit.
Read-only reads of `origin/main` in hauska-engine, hauska-factory, legacy-design-tools and
hauska-map through `git -C P:/<repo> show origin/main:<path>` and `git grep`; never a working
tree, never another seat's checkout, never a write.

### Precedent

`_dispatches/2026-09-10_ctx-teardown_dispatch.md` and its review
`_inbox/2026-09-10_ctx_third_party_review.md`: three of six theses did not survive, and the
program that read it was better for it. Match that shape: every claim you test gets a file, a
SHA, a second mechanism, and a verdict.

### What you test, in this order

1. **Every "exists" in the stage table** (`OPS-24` section 2): name the file and the SHA that
   makes it exist, run its instrument if it has one, and state whether it can FAIL. A stage
   whose instrument passes on an empty input is "not built" regardless of the table.
2. **The order** (section 3). Try to show that something in steps 3 to 5 depends on a farm
   (step 6) or on the gate being fixed differently than P-195 says. Try to show the gate fix
   is not first-order (that a declaration or a completeness check could be trusted without it).
3. **The six laws** in `_catalog/program_preambles/OPS-24.md`. For each, find one place in the
   existing pipeline that violates it today, with the file and line, and say whether the law
   is enforceable by a hook, a type, or only by a person (ENFORCEMENT's three-question gate).
4. **The four holes** in the map's last section. For each, state whether it is real at source
   (read the atoms lease code, `txgio_address`'s loader, the publish run records, the roster)
   and whether OPS-24's treatment of it (section 4) is sufficient or hand-waving.
5. **What is missing.** Cost metering, access policy per county, the calibration hook,
   operator stop points: are they rows, laws, or nothing? Name anything the program will trip
   on in Burnet that no row covers.
6. **The Burnet choice.** Read its sources (`t6_cad_probe`, the roster, StratMap coverage,
   address points) and say whether Burnet can run stages 3 to 12 at all, or whether a different
   seventh county is the honest prototype.

### What you must not do

Build anything. Propose a farm design. Soften a verdict to be polite. Read a working tree.
Accept a status column as evidence. Spawn a sub-agent.

### Close

`_inbox/<date>_ops24_teardown_review.md` (the review, in the 2026-09-10 shape: theses, verdicts,
evidence, what survives) and `_inbox/<date>_ops24-teardown_close.json` with `planRows`
`["P-186", "P-195", "P-198"]`, `status` `closed`, the list of theses that did not survive, and
`leave_behind`. The overseer amends OPS-24 from the review before any build row is dispatched.
