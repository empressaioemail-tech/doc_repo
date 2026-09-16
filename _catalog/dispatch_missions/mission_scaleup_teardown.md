## Mission — TEXAS SCALE-UP TEARDOWN: a fresh planner tries to break the scope before any row is allocated

You are a fresh dispatch planner with no memory of the session that wrote this scope. **You spawn
no sub-agents. You write no code and change no store.** Your product is a review that tries to
make `_inbox/2026-09-16_texas_scaleup_program_scope.md` fail, and says where it holds.

Exit-bounded verification: every command must terminate on its own; wrap anything that could
hang in `timeout`; never leave a watch, a tail, a poll or a dev server running.

### Your seat and root

Seat `dispatch-planner`, worktree `P:/seat-worktrees/dispatch-planner/doc_repo`, branch
`seat/dispatch-planner`.

**Before anything else: that branch holds 24 commits and about 93 artifacts that never reached
main** (OPS-23 wave 6). **Do not fast-forward over them and do not discard them.** Read them,
because several may change what the scope assumes, and report what they contain. Then read
`origin/main` for the scope itself.

Product repos are read at `origin/main` only, through `git -C P:/<repo> show origin/main:<path>`
and `git grep`. Never a working tree, never another seat's checkout, never a write.

The factory store may be read read-only through `FACTORY_DATABASE_URL_RO`, with
`default_transaction_read_only=on` and a statement timeout. **Never print the DSN.**

**Do not query the atoms store (`hauska_mcp`). Its only credential is an owner account.**

### Precedent

`_inbox/2026-09-14_ops24_teardown_review.md`: four theses tested and one of them was the
overseer's own gate. Match that shape. Every claim you test gets a file or a query, a SHA or a
timestamp, a second mechanism, and a verdict.

### What you test, in this order

1. **The measurements in sections 2 and 16.**
   - Re-run `node scripts/six-county-completeness.mjs --self-test`, then the live run.
   - Independently re-derive at least three numbers by a different query than the scope used: the
     219,472 total, one county's no-table figure, and the 318,000 `unaccounted` ag cells.
   - Try to show the instrument is vacuous, over-broad, or blind somewhere its self-test does not
     reach. It declares 65 rails by hand; find a way that goes stale.
2. **The diagnosis of the Hays symptom** (section 2c): the envelope declines because depth-warm
   runs only for Bastrop, Elgin and Lockhart, and because the engine labeller mislabels ring
   artifacts.
   - Read `hauska-map` `apps/property-explorer/api/_lib/atom-chain-to-facets.ts`, the engine's
     `registry/jurisdiction-registry.ts`, `depth-warm/edgeLabeling.ts`,
     `geometry/envelope-ground-truth.ts` and `boundary-primitive/lot-line-scrub.ts`.
   - Give a second mechanism that would produce the same symptom and say whether it survives.
3. **The "two registries" and "two labellers" claims** (class B). Are they really two, or one
   consuming the other? Name the import graph.
4. **S1, the flip from false absences to `unaccounted`.**
   - For each surface (map adapter, MCP, PDF), find what it renders today for an
     `absent-verified` setback cell and what it would render for `unaccounted`, with file and
     line.
   - **Say whether S1 as written would take something customer-visible dark**, which is the
     P-216 outage class. Propose the staging proof that would catch it.
5. **The sequence** (section 1 and section 12).
   - Try to show that some Phase 0 item actually needs Burnet to be done well.
   - Try to show that some farm machinery item cannot be built before Phase 0 exits.
   - Try to show that Bell and Milam in parallel needs something Phase 1 does not produce.
6. **The farm definition** (section 6). Test the storage recommendation (county-scoped writes into
   shared stores) against:
   - the atoms lease code;
   - `atom_did` identity on merge (P-193);
   - row versions on `parcel_record_cell`;
   - what happens when two counties publish at once.
   Say what breaks first.
7. **The speed measures** (section 10). Can each be captured by a hook or a job record, or only by
   a person remembering? ENFORCEMENT's three-question gate applies.
8. **Cotality** (section 11 and 4.7). Is anything in the farm design lawful only if the commercial
   agreement says something it may not? Is the bulk-call refusal specified tightly enough to
   build?
9. **What is missing.** Read the sessions and cards from 2026-09-13 to 2026-09-16 (the list is in
   the scope's `related` block and in `_inbox/2026-09-16_pickup_list_planned_not_done.md`). Name
   anything planned in those days that neither the scope nor the in-flight lanes (P-243, P-244a,
   P-244b, P-246) cover.
10. **Burnet, Bell and Milam as chosen.** Read `_catalog/tx_source_truth.json` and
    `_catalog/texas_roster_v1.json`.
    - Reconcile Burnet's 50,138 ingest features against 59,785 parcels.
    - Reconcile Bell's August atom-pipeline work against "geometry ingest not run".
    - Say whether Temple (zoned, no layer found) makes Bell a poor parallel partner.

### What you must not do

- Build anything, card a row, or edit the scope. The overseer amends it from your review.
- Soften a verdict.
- Read a working tree.
- Accept a status line as evidence.
- Spawn a sub-agent.
- Query the atoms store.
- Discard or fast-forward over the unmerged wave 6 commits on your branch.

### Close

**Artifacts.** Write two files, both in the 2026-09-14 shape:

- `_inbox/<date>_scaleup_teardown_review.md`: theses, verdicts, evidence, what survives, and the
  wave 6 branch contents.
- `_inbox/<date>_scaleup-teardown_close.json`, carrying:
  - `planRows` `["P-198", "P-201", "P-204"]`;
  - `status` `closed`;
  - the list of claims that did not survive;
  - `leave_behind`.

**Committing.**

- Commit both to your seat branch with explicit pathspecs, each git verb in its own call, and
  push the branch.
- **Name the commit SHA in your reply** so the overseer can land the two files on main. Artifacts
  stranded in a worktree have been lost six times this month.
- If you cannot push, say so and name the paths.
