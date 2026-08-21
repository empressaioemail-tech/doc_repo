You MUST NOT spawn sub-agents. Do not commit. Do not git add/commit/push.

Plan row R-07. Seat integration. Worktree P:/doc_repo.

## Mission

Grade the existing store audit against the blueprint mesh. OPS-18a acceptance item 5. Also draft the OPS-16 unmeasured DC (operator ruling 2).

## R-07 grade

Read `_inbox/2026-08-20_store_audit_atom_graph.md` (the log, not a paraphrase) and `_blueprint/40_rule_register.md`.

Write `_inbox/2026-08-21_r07_store_grade.md` with one row per audit Q (Q1 through Q10 and any lettered sub-Qs that carry a count):

- Q id
- What was measured (quote the figure and timestamp from the audit)
- BP-* rule it fails or satisfies
- Status of that rule (STARVED / UNENFORCED / DORMANT / wrong-value)
- Launch-critical? yes/no (yes = blocks measured-everywhere once R-09 is live)

No new SQL. No COUNT(*) on atoms. If a figure is missing from the audit, say UNMEASURED, do not estimate.

This is the input to R-08. Order the yes-launch-critical rows by: identity/keys first, then edges, then serve-path, then ledger.

## DC-9 draft

Read `_decisions/2026-08-11_texas_flush_launch_gate_amendment.md`. Add DC-9: unmeasured / `derivation-indeterminate` / overlay-indeterminate cells must be 0 at launch. Do not change DC-4 or DC-5 string equality. Cite `_decisions/2026-08-21_dc4_dc5_unmeasured_stays_distinct.md`. Bump last_updated. No em dashes.

## Return

Path of the grade. Count of Qs mapped. Count launch-critical. Confirm you did not query the store. Confirm DC-4 and DC-5 text still counts no-atom and no-writer only.
