---
decision_id: 2026-06-08_cortex_7k_launch_phased_demo_first
date: 2026-06-08
owner: Nick
status: active
related_canonical: [03a_positioning_framework, 40_design_accelerator, 54_tenant_leg_sprint, 08_tiered_access_model, 90_runbooks/buildout_deploy_wiring_checklist, 00_current_state]
related_adr: [80_adrs/adr_005_multitenancy]
related_decision: [2026-06-08_reasoning_not_text_grounding_and_web_first_gtm]
---

## Decision

Launch Cortex to the operator's ~7k-architect community in two phases, demo-first.

**Phase 1 - web-first demo (the acquisition touch).** A public, ephemeral "try it" flow: an architect drops an address and a plan PDF and gets a grounded, cited code review in their own jurisdiction, powered by the web-first reasoning grounding (v1/v2). Each try is scoped to a one-time token; nothing is persisted to a shared list and no architect sees another's data, so the absence of per-user isolation does not bite. This proves the wedge (Cortex grounds a real review anywhere) and captures demand and calibration signal from the 7k surface, which 03a frames as the wide professional acquisition engine.

**Phase 2 - the real auth + per-user isolation leg ("task #29").** Login/identity, self-signup, `ownerId`/`tenantId` on the core tables with backfill, ownership predicates on every list/read/write route, per-user metering, and rate-limiting. This is what lets architects bring and keep private projects, and what monetizes. It is dependency-ordered, not a flip.

## Context (verified recon, legacy-design-tools @ main, 2026-06-08)

Cortex today has no user auth and no data isolation. The session middleware pins every production request to anonymous `{audience: "user", tenantId: "default"}` ("there is no real auth layer in this project"). The core tables (`engagements`, `submissions`, `findings`, `snapshots`, `sheets`) carry no owner/tenant column, `GET /engagements` ignores the request and returns every engagement in the database to any caller, CORS is open, and Cortex routes have no rate limiting. Reaching 7k self-serve architects on this is not a flag-flip; it is a real build. The removed render auth gate (QA-30/31) is the canary, pointing at the unbuilt "task #29" real-auth layer.

Two things this decision separates from the launch, because they were being conflated with it:

- **The build-out deploy is orthogonal.** It is mostly operator-mechanical (the linchpin is the `HAUSKA_BACKEND_URL` placeholder on the gate) and its original gates dissolved this session: ICC no longer gates (web-first grounding per `2026-06-08_reasoning_not_text_grounding_and_web_first_gtm.md`), Cotality cleared (the `api1` host fix). Deploying lights up single-tenant Cortex and the merged tool/metering wave; it adds zero auth or tenancy. It pairs with Phase 1's demo scoping, not with throwing the doors open.
- **The tenant leg ([54](54_tenant_leg_sprint.md)) / ADR-005 is a different tenancy problem.** It enforces per-tenant partition at the MCP gate for Mox (enterprise) and SmartCity (city) consuming the spine by tenant-key. The 7k-architect launch needs per-user self-serve auth and isolation inside cortex-api (task #29), which is not currently a scoped sprint. The architect surface is the instance of ADR-005 the tenant leg does not yet point at.

## Structural commitment check

Inline pre-mortem (the framework run formally three times this session; this is a sequencing decision on already-greenlit work). Sell-reasoning (1): green - the demo carries the quality gate (citation, confidence, verification state) and must never present an `unverified-web-source` finding as authoritative; that is the load-bearing condition. Partnership-first (2): green - web-first public/model-code is product-baseline, no city locked out. Cost-per-jurisdiction (3): green - the demo needs no per-jurisdiction onboarding. Quality-gate (7): green under the condition above. Sovereignty: the ephemeral token-scope means no architect's data is exposed to another, which is the isolation guarantee Phase 1 makes without the full leg. Overall green with the quality-gate condition explicit.

## Reasoning

The 7k group is an acquisition and calibration surface, not a set of paying isolated tenants yet, so the right first move is the cheapest credible proof of the wedge, not the heaviest build. Demo-first puts web-first grounding in front of them without waiting on the auth leg and without exposing private data on an architecture that cannot isolate it. The full auth + isolation leg is real and necessary, but it is the conversion-and-monetization build, sequenced behind the demand the demo captures - building it first would delay the touch the operator already has distribution for, with no demand signal to size it against.

## Sequence (dependency-ordered, no timeframe estimates)

Phase 1: (a) land v2 reasoning-atom grounding (in flight, cc-agent-C); (b) fire the build-out deploy (mechanical, gates dissolved - wire `HAUSKA_BACKEND_URL`, Upstash, deploy cortex-api latest, retire the v1 drift alert per the deploy checklist); (c) run the live whole-review proof on 404 Remodel_B (the keystone validation); (d) build the ephemeral demo surface (per-try token scope on reads, rate-limit, CORS lockdown, quality-gate display). Phase 2 (task #29, after the demo proves demand): auth/identity + signup, owner/tenant columns + backfill, per-route ownership predicates, per-user metering, rate-limiting.

## Reversal criteria

Hold the 7k touch until Phase 2 if the demo cannot be made quality-gated and safe - specifically if `unverified-web-source` findings cannot be reliably distinguished from grounded ones in the demo UI, or if the ephemeral token-scope cannot guarantee no cross-try data exposure. Do not expose private-project upload on the architect surface before Phase 2 lands.

## Dependencies

Phase 1 gated on: v2 grounding (in flight), the deploy (near-fireable), and the live Miami proof. Phase 2 is the larger build and is the architect-surface instance of ADR-005's enforcement; coordinate its design with the tenant leg so the partition story stays coherent. The deploy's mechanics are pinned in [`90_runbooks/buildout_deploy_wiring_checklist.md`](../90_runbooks/buildout_deploy_wiring_checklist.md).

## Counterparties

Internal direction; serves the planned 7k-architect community launch. No external commitment beyond the demo experience itself.
