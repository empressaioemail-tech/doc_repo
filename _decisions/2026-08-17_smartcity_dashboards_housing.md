---
decision_id: 2026-08-17_smartcity_dashboards_housing
date: 2026-08-17
owner: nick
status: active
related_canonical:
  [
    _inbox/2026-08-17_g61_dashboards_template_WDLL,
    _decisions/2026-08-17_smartcity_product_line_then_bastrop_onboarding,
    _decisions/2026-08-17_g13_consumer_contract,
    _decisions/2026-08-15_capability_mount_composition,
    90_operations/OPS-17_govtech_stack_plan_of_record,
    _catalog/repo_intents,
    80_adrs/adr_008_engine_factor_out,
  ]
---

# Decision

SmartCity Dashboards lives at [empressaioemail-tech/smartcity-dashboards](https://github.com/empressaioemail-tech/smartcity-dashboards). One product repo. Every onboarded city is a tenant pack in that repo's service, not a fork and not its own GitHub repository. Live Bastrop remains `P:\smartcity-os` until a named cutover. Do not clone `smartcity-os`. Do not deploy this product into `smartcity-os-prod`.

## Context

Operator created the remote 2026-08-17T13:28:09Z, PUBLIC, after ruling that cities share one repo. G-61 WDLL was approved and blocked only on housing. This record is the housing lock. Neon and GCP are not created on this record.

## Structural commitment check

- Cost per jurisdiction: one codebase, city packs as config. A repo per city fails the commitment.
- Tenant sovereignty: isolation is accessPolicy and tenant scope, not git.
- Dual interface (28) and MCP v1 (51): this repo is the HTTP/UI surface. MCP tools for Dashboards retarget on the existing Hauska MCP server. No second MCP in this repo.
- Brand (ADR-008): Empressa / SmartCity product. Not Hauska substrate.
- Catalog thesis: aligned. Yellow if Bastrop live ops are copied into this repo as the template.

## Reasoning

G-18 as-found is a welded city app. The product is the lens family over records (doc 31). Housing it under a Bastrop-named repo, or forking per city, would freeze the weld. Smart Files and plan-review already proved one product repo, many tenants. Dashboards is that shape.

This repo may later hold a thin tenant-registry database. That database, if it exists, is a new Neon project. It is not `tiny-art-63602898` / smartcity-os-prod, not cortex-prod, not the files Neon, not the atoms store.

## Reversal criteria

Reverse "one repo, many city packs" only if a named city cannot onboard without a fork and that blocker is accepted in writing. Reverse the GitHub name only if the operator creates a different remote and this record is amended. Do not put Asset Management into this repo by implication; AM is a build and gets its own housing when that card exists.

## Dependencies

Unblocks G-61 implementation. Cites G-13 for the wire. Does not close G-61. Does not create GCP or Neon. Does not touch live Bastrop. L26 untouched.

## Counterparties

Internal: operator, Lane B planner. Remote: `empressaioemail-tech/smartcity-dashboards`. First tenant later: Bastrop, via cutover WDLL, not this record.
