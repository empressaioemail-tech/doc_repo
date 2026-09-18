---
decision_id: 2026-09-18_gcp_full_exit_rulings
date: 2026-09-18
owner: Nick
status: active
related_canonical:
  - 90_operations/OPS-25_cloud_infrastructure_and_cost_program.md
  - _inbox/2026-09-18_gcp_full_exit_PLAN.md
  - _inbox/2026-09-18_gcp_estate_EVIDENCE.md
  - _inbox/2026-09-18_gcp_exit_TEXAS_COORDINATION.md
---

## Decision

Every Google Cloud project except `atx-bulls` is exited to DigitalOcean, compute first and storage last, behind stable hostnames, starting at a clean pause in the Texas scale-up that is agreed with that program's planner first.

## Context

OPS-25's first arc moved the SmartCity line and scoped six always-on services. The operator asked on 2026-09-18 to plan the move of everything left. Before planning, the integration seat measured the estate live: nine projects (one, `smart-markets-118998`, missing from the console's recent list), 13 Cloud Run services, 43 Cloud Run Jobs, two VMs, one Cloud SQL instance, 13 Scheduler jobs and 24 buckets. The seat then put five questions to the operator. The operator answered each one in session:

1. **Scope is a full exit.** It waits for a clean pause in the Texas scale-up, and the exit is coordinated with that program's planner before anything moves. This supersedes the seat's recommendation to leave the factory job plane on GCP this arc.
2. **GCS buckets stay in place through the compute moves.** By the final cut, everything is migrated off them.
3. **Stable hostnames go in front of services before their cutover.**
4. **`atx-bulls` is out of scope.**
5. **The DigitalOcean-to-GitHub connection is widened** beyond `smartcity-os` and `smartcity-dashboards` (this amends OPS-25 governing rule 8).

## Structural commitment check

- Sell reasoning, not data: not touched. This is where the code runs, not what it serves.
- Confidence is earned: not touched directly. Every cutover is graded by an instrument (OPS-25 rule 5), never by a report.
- Cost per jurisdiction: indirectly helped. The factory job plane moves to a scale-to-zero pool, and the measured job cost is about $73 per 30 days today.
- Dual interface: not touched. Both MCP surfaces keep their hostnames (`mcp.smartsite.cloud` already exists; `mcp.hauska.dev` is created in front of the GCP original first).
- Tenant sovereignty: not weakened. Neon stores do not move, and accessPolicy enforcement is unchanged.

## Reasoning

The plan records the full measured case. The load-bearing parts follow.

**Full exit includes the factory.** A partial exit leaves GCP carrying the Texas program's most active code, keeps all of GCP's operational surface for about 3 percent of the spend, and never retires the Cloud Run canary pattern that created the largest cost defect found.

**Storage moves last.** Changing one variable per cutover keeps every compute move config-only and every rollback a DNS change. Storage is the only move that needs a code change (the GCS client appears in four repos), a data copy and a rewrite of stored `gs://` URIs, so it gets its own bake at the end.

**Hostnames come first.** The measured caller set is far wider than any env-var flip can cover:
- `hauska-retrieval-api` alone is called from three live env vars, one secret, seven hardcoded code files across two repos, and Vercel functions.
- `cortex-api` receives Stripe webhooks.
- `cortex-api` is compiled into a Chrome extension and a Revit add-in that customers install.

A hostname turns each cutover and rollback into one DNS record.

## Reversal criteria

- The platform probes (plan row D-17) show App Platform cannot serve a service within its measured envelope: the edge timeout, private reachability between apps, or the region round-trip time to Neon `us-east-1`. That service then gets a different DigitalOcean shape (a droplet or DOKS), not a reversal of the exit.
- The Texas planner cannot offer a freeze window for the substrate or factory waves through Phase 2. Then revisit whether those waves go to the operator as a scheduled downtime instead of a pause.
- The storage migration finds a GCS behaviour the S3-compatible path cannot reproduce (object ACL semantics in `objectAcl.ts`, or presigned URLs). That bucket's cut is then re-planned, not forced.
- The measured DigitalOcean run cost, graded by bill line, exceeds the GCP cost with the canary leak fixed by more than the operator will accept. The plan states that the two are in the same range today.

## Dependencies

- Depends on the Texas program's planner agreeing freeze windows (plan row D-15), and on operator prerequisites (D-16): DigitalOcean token scopes, the droplet limit, the widened GitHub connection, hostname names and the billing export.
- Depends on the in-flight SmartCity rows D-12, D-13 and D-14.
- The OPS-17 design build rows keep landing on DigitalOcean apps as D-12 and D-14 already require.

## Counterparties

- Internal: the operator, the Texas scale-up planner (OPS-16/OPS-24), and the property, substrate, govtech and markets seats, which own the affected repos.
- External registrations that change: Stripe (webhook endpoint on `cortex-api`), the Chrome Web Store (brief extension release), Revit connector installs, and possibly Samsara (webhook registration unverified). Bastrop staff are not a counterparty: the SmartCity hostnames they use do not change.
