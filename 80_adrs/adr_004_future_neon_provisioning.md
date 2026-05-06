---
id: adr_004_future_neon_provisioning
title: "ADR-004 â Future Empressa products provision Empressa-owned Neon from day one"
status: active
last_updated: 2026-05-05
applies_to: portfolio
related: [adr_002_replit_neon_migration, adr_003_replit_neon_tactical, 15_replit_neon_ownership_advisory]
---

# ADR-004 â Future Empressa products provision Empressa-owned Neon from day one

## Status

**Accepted (forward-looking).** Originally captured as
"ADR-Replit-Neon-003" in the body of
[`15_replit_neon_ownership_advisory.md`](../15_replit_neon_ownership_advisory.md);
formalized as standalone ADR 2026-05-05.

## Context

Both `legacy-design-tools` and `smartcity-os-prod` had their
production Neon databases auto-provisioned by Replit. This was the
default path when the Repl was created â Replit's onboarding flow
spins up a backing Neon under Replit's account if any database is
declared. The lock-in pattern was passive: nobody decided to give
Replit ownership, the default just produced that outcome.

Migrating out (ADR-002) costs ~3 dev-days plus 48 hours observation.
That cost is bounded for two existing apps. It would not be bounded
if the same lock-in compounded across five or ten future products.

ECI growth, Empressa Land (post-M5), and any future Hauska or
Empressa vertical product is a candidate to repeat the lock-in
pattern unless the default is changed.

## Decision

**All future production databases for Empressa products are
provisioned by Empressa on `neon.tech` (or an alternative provider)
under Empressa's own account from day one.**

Operational implications:

1. **Replit's auto-provisioning of databases is to be avoided** when
   creating new Repls for Empressa products. If a Repl needs a
   database, Empressa creates the Neon project externally first,
   then wires the connection string into the Repl as a Replit Secret.
2. **First-day setup for any new product** includes: create Neon
   project under Empressa's account â set up automated backups â put
   credentials in the Empressa credentials vault (1Password or
   equivalent â see decision in
   [`11_roadmap.md`](../11_roadmap.md)) â wire connection string
   into deployment target as a managed secret (not in `.replit`,
   not in `package.json`, not in repo). Documented as part of the
   eventual workstation/onboarding runbook.
3. **For experimental Repls** (spike work, prototypes, throwaway
   demos), Replit's auto-provisioning is acceptable because the data
   is not production. Once a project graduates from "experimental"
   to "we're going to keep this," the database migrates to
   Empressa-owned before any real customer data lands.

This decision is policy, not infrastructure. Enforcement is by
discipline (planner reviews new-product setup) and documentation
(workstation inventory + onboarding runbooks point at this ADR).

## Alternatives considered

**Alternative 1 â Continue Replit's default auto-provisioning;
migrate out per-product later if needed.** Rejected. The migration
cost is bounded once but compounds with each product. Setting the
correct default early makes the right thing easy and the wrong
thing hard.

**Alternative 2 â Pick a non-Neon default (RDS, Cloud SQL,
Supabase).** Considered. Rejected for now because (a) Neon's branch
model and serverless architecture continue to fit the dev workflow,
(b) the ADR-002 migration moves to Empressa-owned Neon and switching
providers in parallel adds risk without obvious return. If a future
ADR commits to a different provider, this ADR updates accordingly.

**Alternative 3 â Make the policy "any owned-account-on-any-provider"
without specifying Neon.** Rejected as too permissive. A loose
policy invites per-product diversion and produces a heterogeneous
backend stack with no clear ops story. Empressa can reopen this
later if a deliberate multi-provider strategy emerges.

## Consequences

**Positive:**

- Lock-in does not compound. Each new product starts with the
  ownership properties (console access, native backups, team auth)
  the existing apps had to migrate to gain.
- Onboarding runbooks have a stable pattern to point at: "create
  Neon project, set up backups, put credentials in vault, wire
  into Repl secret."
- Aligns the dev experience: every Empressa engineer sees the same
  Neon Console, the same branching model, the same backup options
  across all products.
- Reduces ongoing audit / compliance friction. When a customer or
  contract requires "describe how you back up customer data," the
  answer is uniform across products.

**Negative:**

- Slight onboarding overhead per new product (~30 minutes:
  provision + backup setup + credentials). Trivial compared to the
  cost it prevents.
- Discipline-enforced, not infra-enforced. A future engineer
  unaware of this ADR could still create a new Repl and
  accidentally re-trigger Replit's auto-provisioning. Mitigation:
  cross-reference this ADR from
  [`22_workstation_inventory.md`](../22_workstation_inventory.md)
  and any future onboarding runbook so the discipline is encoded
  in the documentation surface.

**Neutral:**

- Replit Repls remain the IDE/agent surface; nothing changes about
  Replit's role in development. Only the ownership of backing
  databases is settled.

## Trigger conditions for revisiting

This ADR should be revisited when any of these happen:

- Empressa adopts a multi-provider data strategy (e.g., one product
  needs a graph database, another needs analytics warehouse). At
  that point "Neon by default" becomes ambiguous; the ADR updates.
- Neon makes structural changes to its serverless or branch model
  that affect the dev-workflow fit.
- A future product has hard requirements (regulatory, latency,
  data-residency) that Neon doesn't meet.
- The Empressa credentials vault decision lands and changes how
  credentials are managed.

## References

- [`adr_002_replit_neon_migration.md`](adr_002_replit_neon_migration.md)
  â the migration that motivates this forward-looking decision
- [`adr_003_replit_neon_tactical.md`](adr_003_replit_neon_tactical.md)
  â the tactical workaround the migration retires
- [`15_replit_neon_ownership_advisory.md`](../15_replit_neon_ownership_advisory.md)
  â full discovery context
- [`22_workstation_inventory.md`](../22_workstation_inventory.md) â
  documentation surface where new-product onboarding pattern lands
- [`91_postmortems/2026-05-05_track_b_deploy_saga.md`](../91_postmortems/2026-05-05_track_b_deploy_saga.md)
  â the saga that surfaced the original lock-in

## Revision history

- **2026-05-05 (origin):** captured in
  [`15_replit_neon_ownership_advisory.md`](../15_replit_neon_ownership_advisory.md)
  as "ADR-Replit-Neon-003"
- **2026-05-05 (this ADR):** formalized as standalone ADR-004.
  Trigger conditions for revisiting added.
