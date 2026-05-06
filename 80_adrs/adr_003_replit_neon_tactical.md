---
id: adr_003_replit_neon_tactical
title: "ADR-003 â Tactical schema migration via Replit Agent until ADR-002 ships"
status: active
last_updated: 2026-05-05
applies_to: portfolio
related: [adr_002_replit_neon_migration, 15_replit_neon_ownership_advisory, 20_agent_operating_rules]
---

# ADR-003 â Tactical schema migration via Replit Agent until ADR-002 ships

## Status

**Accepted (transitional).** Applies only until
[`adr_002_replit_neon_migration.md`](adr_002_replit_neon_migration.md)
completes â at which point this ADR becomes superseded. Originally
captured as "ADR-Replit-Neon-002" in the body of
[`15_replit_neon_ownership_advisory.md`](../15_replit_neon_ownership_advisory.md).

## Context

Until the Replit-managed Neon migration completes (ADR-002), schema
changes still need to ship to production for both `legacy-design-tools`
and `smartcity-os`. Three normal paths are unavailable:

- `psql` from local against the production Neon â no connection
  string under our control
- Manual SQL via Neon's web SQL editor â no console access
- Drizzle migrate (journaled migrations) running in CI â not yet
  set up; depends on the same migration sprint as ADR-002

The Track B deploy saga (2026-05-04) demonstrated one path that
works: the Replit Agent inside the relevant Repl has access to the
production connection string via Replit Secret (`DEPLOYMENT_DATABASE_URL`
for legacy-design-tools, `PROD_DATABASE_URL` for smartcity-os) and
can execute SQL through Node's `pg` module against the production
Neon. The migration applies; the schema state is verifiable via
follow-up queries.

This works. It is also a tactical workaround â single-credential
access, agent-mediated execution, no audit log under our control.
Codifying it as a process risk creating a "this is how we do schema
migrations" pattern that survives past the migration sprint that
should retire it.

## Decision

**Schema migrations on the Replit-managed Neons run via the Replit
Agent under explicit human-in-loop discipline, with this protocol:**

1. **Migration SQL lives in source.** Hand-rolled SQL goes in
   `lib/db/scripts/` (legacy-design-tools) or `migrations/`
   (smartcity-os) and is committed to origin/main before any
   production application.
2. **Idempotent constructs.** Every migration uses `IF NOT EXISTS`,
   `IF EXISTS`, or guarded `DO $$ BEGIN â¦ END $$;` blocks so reapply
   is safe. Never raw `CREATE TABLE` or raw `ALTER TABLE` without
   guards.
3. **Explicit transactions.** Every migration runs inside `BEGIN; â¦
   COMMIT;`. If the migration aborts mid-way, the production state
   is unaffected.
4. **Human-in-loop review of the SQL.** The planner pastes the
   migration SQL into chat for Nick to review before the agent
   fires. Approval is explicit ("apply"), not implied by absence of
   pushback.
5. **Verification queries immediately after.** The agent runs
   structural checks (`SELECT to_regclass(â¦)`, `\d+ table`,
   `SELECT column_name FROM information_schema.columns`) and pastes
   verbatim output. Schema state must match expectations before the
   agent declares the migration done.
6. **Replit Agent path only â never out-of-band.** Operators do not
   open the Replit shell themselves to run `pnpm push` against
   production unless the agent path is failing. If the agent path
   fails, that's a recon item, not an excuse for a manual
   workaround.

**This ADR explicitly does NOT codify the workaround as a long-term
pattern.** When ADR-002 completes, the protocol becomes irrelevant
because production access shifts to the standard `psql` /
Drizzle-migrate / Neon web SQL editor paths. Future schema migrations
on Empressa-owned Neon do NOT use the Replit Agent path.

## Alternatives considered

**Alternative 1 â Block all schema migrations until ADR-002 ships.**
Rejected. The migration sprint is multi-week scope. Schema changes
during the gap (Track B's IFC ingest, A04.7 fix follow-ups) would
either ship without DB updates (broken in production) or stall
features for weeks.

**Alternative 2 â Move just the tactical access layer to Empressa
Neon early, defer the data migration.** Rejected. This requires a
new Neon project, schema dump-and-restore, then reverting
applications to point at the Replit-Neon. More moving parts than the
full ADR-002 migration. Not actually faster; just chunkier.

**Alternative 3 â Codify the agent-mediated path as the long-term
pattern.** Rejected. Agent-mediated SQL with no audit log under our
control is a tactical fix; making it the long-term path means we
never gain the team-access, audit, or backup wins that ADR-002 buys.
The discipline of naming this as transitional preserves pressure to
land ADR-002.

## Consequences

**Positive:**

- Schema migrations can ship while ADR-002 is in flight. Production
  is not blocked on the migration sprint.
- The protocol is explicit: idempotent SQL, transactions,
  human-in-loop review, verbatim verification. Reduces the chance of
  a tactical migration causing a production incident.
- The "tactical, not pattern" framing keeps pressure on landing
  ADR-002 â every schema migration via this path is a small
  reminder that the proper path doesn't yet exist.

**Negative:**

- Agent-mediated SQL has no native audit log under our control. If
  something goes wrong, the trail is the chat transcript plus
  whatever Replit logs internally â not a queryable audit table.
- Single-credential access. Anyone with the Replit Repl can apply
  schema changes; no per-person attribution.
- Ergonomic friction. Each migration is paste-review-apply-verify
  in chat rather than `psql -f migration.sql`. Acceptable for the
  ~weeks-long window; would not be acceptable long-term.

**Neutral:**

- Idempotent SQL discipline is good practice regardless of provider.
  The migrations written under this ADR survive the migration
  to ADR-002 unchanged.

## Discipline cross-references

This protocol enforces several rules from
[`20_agent_operating_rules.md`](../20_agent_operating_rules.md):

- HR-4 (schema source of truth: TS schema, not hand-rolled SQL) â
  hand-rolled SQL here is a one-time runner, retired after apply
- HR-5 (no `drizzle-kit push --force` in auto-triggered hooks) â the
  Replit Agent path is interactive, not auto-triggered, so the rule
  is satisfied
- HR-6 (verify env-var binding before destructive ops) â the agent
  echoes resolved `DATABASE_URL` (redacted credentials) before
  applying
- HR-8 (verbatim verification artifacts) â verification queries must
  paste verbatim output

If any of those rules are violated during a migration, the migration
is suspect. Roll back if possible; investigate before proceeding.

## Supersession

This ADR becomes **superseded by ADR-002** at the moment ADR-002's
data migration completes for both apps. At that point:

1. Update this ADR's `status` from `active` to `superseded`.
2. Add `superseded_by: adr_002_replit_neon_migration` to frontmatter.
3. Add a closeout footnote pointing at the Empressa-Neon schema
   migration runbook (TBD; lands in
   [`90_runbooks/`](../90_runbooks/) as part of the migration
   sprint).

The protocol section above is preserved as historical record â the
discipline it captures remains a reasonable approach for any
agent-mediated SQL work in the future.

## References

- [`adr_002_replit_neon_migration.md`](adr_002_replit_neon_migration.md)
  â the migration that retires this ADR
- [`15_replit_neon_ownership_advisory.md`](../15_replit_neon_ownership_advisory.md)
  â full discovery context, four risks
- [`20_agent_operating_rules.md`](../20_agent_operating_rules.md) â
  HR-4, HR-5, HR-6, HR-8 (the rules this protocol enforces)
- [`91_postmortems/2026-05-05_track_b_deploy_saga.md`](../91_postmortems/2026-05-05_track_b_deploy_saga.md)
  â the saga that established this path

## Revision history

- **2026-05-05 (origin):** captured in
  [`15_replit_neon_ownership_advisory.md`](../15_replit_neon_ownership_advisory.md)
  as "ADR-Replit-Neon-002"
- **2026-05-05 (this ADR):** formalized as standalone ADR-003.
  Discipline cross-references to agent operating rules made
  explicit; supersession plan added.
