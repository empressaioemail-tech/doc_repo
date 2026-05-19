---
decision_id: 2026-05-19_calendar_tenant_id_hardcode_path_b
date: 2026-05-19
owner: nick
status: active
related_canonical: [30_smartcity_os, 12_migration_sprint, 30a_smartcity_stabilization_sprint, 91_postmortems/2026-05-19_calendar_tenant_id_silent_outage, _sessions/2026-05-19_calendar_tenant_id_outage_claude_code]
---

## Decision

Resolve the BeWith iCal 401 outage via Path B: fix the hardcoded `BASTROP_TENANT_ID = 1` in `server/routes/calendar.ts:9` to `= 2`, transactionally migrate the LKG payload from `tenants[1]` to `tenants[2]`, regenerate `calendarFeedKey` on `tenants[2]`, deploy via the canonical canary-then-shift runbook, and deliver the new key to BeWith via partner-credentials channel. Reject Path A (hand BeWith the demo-tenant key, no rotation, no deploy) and Path C (mirror data without code fix). Split the broader hardcoded-tenant-ID audit (5 PermitFlow client components, the `permitFlowTenant` middleware default, other potential aliased-constant sites) out of this PR into a follow-on dispatch folded into the Neon migration window per `12_migration_sprint.md` Sub-phase 2B.

## Context

External partner BeWith.io received persistent HTTP 401 from `/api/calendar/events.ics` for 16 days following the 2026-05-03 Replit-to-Cloud-Run cutover. Investigation surfaced two layered failures. The env-bound `?api_key=` auth path went dead at cutover when `CALENDAR_API_KEY` was unbound on Cloud Run. The per-tenant `?key=` auth path that should have replaced it was hardcoded to `BASTROP_TENANT_ID = 1` at `server/routes/calendar.ts:9`, where `tenants.id=1` is the "Your City" demo placeholder. The codified rule at `AGENT_RULES.md:244-269` and `30_smartcity_os.md:50-52, 142-146` makes `tenants.id=2` Bastrop production. The April 5-6 enforcement sweep keyed on the canonical name `DEFAULT_TENANT_ID` and missed the aliased `BASTROP_TENANT_ID` in calendar.ts.

Three candidate paths surfaced during the investigation:

- Path A: hand BeWith the existing `tenants[1].settings.calendarFeedKey` value (the lazily-generated `pinMco...` demo placeholder). No code change, no rotation, no deploy.
- Path B: fix the code, migrate the LKG cache to the correct tenant, generate a fresh `calendarFeedKey` on the correct tenant, deploy.
- Path C: leave the code alone; mirror `tenants[1]` state into `tenants[2]`; hand BeWith the mirrored key.

## Structural commitment check

Path B clears the four structural commitments. Commitment 1 (sell reasoning, not data): no change to the reasoning-chain / source-citation / confidence-score / timestamp model for this surface; the calendar feed is Layer 1 free. Commitment 2 (partnership-first sourcing): the BeWith partnership is preserved, and the corrected routing now authenticates partner traffic against the correct tenant row rather than against a demo placeholder. Commitment 3 (cost per jurisdiction): one-line code change plus one canary deploy; well under the per-jurisdiction onboarding envelope. Commitment 4 (dual interface as product line principle): no change to the calendar route's interface shape; HTTP plus iCal remain the surface. The MCP-retrofit roadmap line for SmartCity OS calendar features is unaffected.

Premortem-check spot-cleared inline during the session investigation. Hauska spine rule: this is SmartCity OS surface work, not Hauska substrate; the Hauska atom contract / engine / MCP server are not touched. Cost per jurisdiction rule: no jurisdiction onboarding spend. Focus queue rule: this is partner-facing outage remediation, not a new workstream; no new scope opened. Quality gate rule: the verification matrix carries source attribution (gcloud / SQL outputs), confidence score (six independent probes), and timestamp (probe matrix executed against the new revision at deploy time). Partnership preferred rule: not applicable (this is operational, not city pipeline). MCP-first product design rule: not applicable (existing UI-first product fix).

## Reasoning

Path A is wrong on three structural grounds.

First, it authenticates a real external partner against a tenant row labeled "Your City" in the audit log, so every BeWith fetch in production logs would attribute to the wrong tenant. The mislabel compounds across every downstream system that reads tenant attribution (billing if it existed, audit, analytics, partner-usage reports). The codified rule at `AGENT_RULES.md:246` ("tenant_id 1 = Your City, demo, never write here") is violated by Path A by design.

Second, it forces a rotation anyway the moment the code bug is fixed. The code fix points the auth check at `tenants[2]`, which would no longer hold BeWith's key (because the key was written on `tenants[1]` under Path A). Two rotations in one week looks bad to the partner and burns trust unnecessarily.

Third, it leaves the underlying bug in production. The next incident touching calendar code or any tenant-ID-touching code rediscovers the same root cause; the next agent doing a tenant-ID enforcement sweep finds the same wrong-tenant write in production data.

Path C is worse than Path A. It entrenches the demo-placeholder mislabel by writing real partner-facing data into `tenants[1]`, and forces every future tenant-ID change in any route to also migrate `tenants[1]` state. The data-side mirror multiplies the maintenance tax rather than fixing the structural bug.

Path B fixes the code and the data in one atomic shipment. The code change is one line (`BASTROP_TENANT_ID = 1 → 2`). The data migration is one transactional UPDATE pair. The key regen is one UPDATE. The deploy is the canonical canary-then-shift runbook. The verification matrix proves the corrected routing AND the dead env path AND PR #18's iCal date fix simultaneously. Single rotation, structurally correct, partner reply is simple ("new key plus new URL form, no action needed until you receive it").

Split rationale: keep the broader audit out of this PR. The same bug class lives at 5 PermitFlow client components, the `permitFlowTenant` middleware default at `replit.md:254`, and probably other server-side aliased constants the April sweep missed. Folding all of those into the same PR would expand scope from "one-line constant fix" to "multi-file sweep with client-side investigation gating server-side changes." That balloons PR review burden, multiplies deploy blast radius, and stalls Bar's partner unblock. The narrow PR ships fast and unblocks Bar; the broader audit gets a dedicated follow-on dispatch with the right Phase A / Phase B / Phase C structure, folded into the Neon cutover audit window per `12_migration_sprint.md` Sub-phase 2B where tenant-integrity verification is already in scope.

## Reversal criteria

Revisit if any of the following.

- (a) The canonical tenant-ID rule at `AGENT_RULES.md:244-269` and `30_smartcity_os.md:50-52, 142-146` changes (e.g., a migration assigns Bastrop a different tenant ID). Vanishingly unlikely, but the constant should track the rule, not the literal `2`. Follow-on #2 in the catalog (rename to `DEFAULT_TENANT_ID` and pull the value from a shared source) is the durable hedge.
- (b) The planned multi-tenant calendar-feed routing per follow-on #12 ships and the hardcoded single-tenant assumption is replaced with proper tenant resolution (key prefix lookup, URL path, or session-resolved tenant). The constant becomes irrelevant once the middleware resolves tenant per-request.
- (c) `tenants[1]` is repurposed from "Your City" demo to something operationally meaningful. Would force a separate decision on the demo-tenant slot anyway.

None of (a), (b), (c) are on the near-term roadmap.

## Dependencies

This decision depends on the codified tenant-ID rule at `30_smartcity_os.md:50-52, 142-146` and `AGENT_RULES.md:244-269`. The decision brings `calendar.ts` into compliance with the existing rule rather than changing the rule.

This decision unblocks: BeWith's iCal subscription (immediately on key delivery); the LKG hydration writing to the correct tenant going forward; the per-tenant `?key=` auth path actually authenticating production partner traffic; and PR #18's iCal date-formatting fix continuing to apply on the corrected tenant lookup.

This decision triggers the 12-finding follow-on catalog in `91_postmortems/2026-05-19_calendar_tenant_id_silent_outage.md`. Catalog highlights with hard dependencies on this decision:

- The broader hardcoded-tenant-ID sweep (follow-on #1) inherits the same value-pattern grep approach surfaced today.
- The synthetic monitor for the iCal feed (follow-on #9, P0) depends on the new feed key value provisioned on `tenants[2]` today as its probe credential.
- The leaked `CALENDAR_API_KEY` decision (follow-on #7) is reframed by the env-path-dead-by-design state: the leaked value's functional uselessness is now structural rather than situational.

This decision does not block on any of those catalog items; they are durable backlog spawned by the same investigation.

## Counterparties

Internal: Nick (operator, decision-maker, key delivery to partner). Smartcity-os repo agent (executed PR #20, LKG migration, key regen, deploy, verification matrix). Doc_repo planner (this session; investigation, dispatch design, decision record, postmortem, catalog).

External: BeWith.io (Bar Levy primary contact; Jaime Saldivar and Shayna in the same thread). New feed key delivered to Bar via partner-credentials channel post-deploy; reply on the email thread tells the partner the value is coming separately and gives the new URL form. The historic env-bound key value remains leaked in public git history (commits `08fd932`, `d4b5655` per `.replit:80-82`); the decision on whether to BFG-clean that history versus accept the leak is filed as a separate decision record per catalog follow-on #7.
