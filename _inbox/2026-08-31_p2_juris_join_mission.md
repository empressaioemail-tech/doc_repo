# P2-JURIS join rewrite — plan first, not a timed run

## How to work this card

Do NOT spawn sub-agents. Hand back, do not land. No commit, push, deploy,
or store write. No Neon mint. No laptop `psql`.

## Why this card exists

Merged `01` could never run (literal `1/0` inside an aggregate CASE). That
is fixed on main (`a7a8042`, PR #42). With the CASE gone the unlimited join
is a Nested Loop of CTE Scan on `parcels_six` (~1,043,462) and CTE Scan on
`cities_ok` (~811), ~846M comparisons, cost 1.06e10, over 180s. Both sides
are MATERIALIZED CTE scans, so no index. Zone-major in the SQL text, not in
the plan. TOTALS stays UNMEASURED. Nothing adopted.

## Acceptance

1. `05_explain.sql` still explains the unlimited `cities_ok JOIN parcels_six`
   (no `LIMIT`). `test/p2-juris-sql.test.mjs` still rejects a Nested Loop of
   those two CTE scans, both arms.
2. The rewrite produces a plan shape that `isMillionRowCteNestedLoop` rejects.
   Show that plan as text in the handback. A green timed `01` is not this card.
3. No `LATERAL`. That rule was earned against a different (point-major) failure.
4. Do not raise `statement_timeout`. A timeout is a finding, not a zero.
5. Keep the DO block at the top of `01`. Do not put `1/0` back in an aggregate.
6. Reconcile targets stay 357,269 / 624,141 / 981,410. A miss names the join.

You choose the rewrite. I am not prescribing hash vs GiST vs un-MATERIALIZED.
The gate is the plan.

## Do not

Run a timed `01`. Adopt a new TOTALS split. Persist. Mint a URI. Touch P4
rails, 0005b, or LDT. Use the merged `hauska-factory-p2-juris` tree or
`hauska-factory-main-migrate`.
