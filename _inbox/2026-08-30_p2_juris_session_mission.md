# P2-JURIS session rewrite (F-01)

Make the containment session runnable on a short-lived read-only URI. Live TOTALS stay UNMEASURED until the planner runs it. Do not persist.

Supervisor hole: `00` sets `default_transaction_read_only = on`. `01` then `CREATE TEMP TABLE`. Postgres and Neon replicas refuse that.

Fix one of these, not both half-way:

1. Rewrite `01` as CTEs (or `WITH` materialization) so a RO transaction can run TOTALS / BY_COUNTY / SLIVERS / CDP_ASSERT, **or**
2. Prove RO with a durable write refuse (`CREATE TABLE` / `INSERT` into a real relation) and document that temps are session-local on a second connection that is still not persist.

Empty city table must fail closed (do not emit statewide unincorporated). Keep zone-major. No LATERAL. Floor stays `1e-8`. Reconcile target stays 357,269 / 624,141 / 981,410.

Tree: `P:/seat-worktrees/property/hauska-factory-p2-juris` only. Do not open other Factory trees. No Neon persist. No laptop `--apply`.
