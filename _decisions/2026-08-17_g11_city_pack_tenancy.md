---
decision_id: 2026-08-17_g11_city_pack_tenancy
date: 2026-08-17
owner: nick
status: provisional
verification_pending:
  [
    "Operator approves `_inbox/2026-08-17_g11_tenancy_WDLL.md` before this record is treated as the G-11 build contract.",
  ]
related_canonical:
  [
    _inbox/2026-08-17_g11_tenancy_WDLL,
    _decisions/2026-08-17_g63_feed_adapter_contract,
    _decisions/2026-08-17_g62_compose_honesty_before_g11,
    _decisions/2026-08-17_g13_consumer_contract,
    _decisions/2026-08-17_smartcity_dashboards_housing,
    54_tenant_leg_sprint,
    80_adrs/adr_005_multitenancy,
    80_adrs/adr_017_atom_access_control,
    90_operations/OPS-17_govtech_stack_plan_of_record,
    28_mcp_first_product_design,
    51_substrate_v1_sprint,
  ]
---

# Decision

After G-63 close, Lane B next card is OPS-17 **G-11** as city-pack tenancy on Dashboards and the existing Hauska MCP server, not live vendor ingest and not the rest of sprint-54. A city pack is the tenant. Isolation is accessPolicy plus tenant scope, not git. Do not start implementation until the G-11 WDLL is operator-approved.

## Context

G-63 closed 2026-08-17. Housing already said cities are tenant packs in one repo. G-62 already said `DASHBOARDS_API_KEY` is not a paid subject and that identified-caller compose waits until G-11 names a real caller identity retrieval can entitle. ADR-005 Layer A already binds `jurisdiction_tenant` on the Hauska product key (MCP #29, 2026-06-09). Sprint-54 still has unbuilt T2 (tenant-private write) and T3 (real second tenant plus ADR-005 Layer B load test). Cortex still runs an anonymous default tenant. Live Bastrop is still `tenant_id=2` on `smartcity-os`.

Operator 2026-08-17: draft the G-11 WDLL after G-63 close.

Alternatives considered: treat G-11 as all of sprint-54 (too wide; G-62 already refused that). Connect live MyGov under a Bastrop key (needs cutover and credentials; copies the weld). Close S-1 because MCP already withholds some tenant-private seeds (does not make a city pack a tenant). Invent Clerk on this card (claim flow, not Dashboards).

## The contract

| Rule | Meaning |
|---|---|
| Tenant | A Dashboards city pack (`cityKey`). Not a git repo. Not live `smartcity-os` `tenant_id`. |
| Identified caller | Hauska product key whose `jurisdiction_tenant` equals that `cityKey`. Same subject on MCP (`X-Hauska-Key`) and on Dashboards HTTP. |
| Not a subject | `DASHBOARDS_API_KEY`, retrieval service Bearer, files service Bearer. Those authenticate the product. |
| Fixture | `fixture-city` is the second pack. It is not Bastrop. `grantedAdapters` stays `[]`. |
| accessPolicy | Anonymous and the service key see public-free only (G-62). Tenant-private only for the matching pack subject. Filter is the wire field, not a type denylist. |
| Cross-pack | Pack A cannot read pack B private material. Wrong-tenant is refuse, not honest-empty. |
| Writes | No tenant-private atom mint on this card. L26 holds `--apply`. |
| Sprint-54 | Sequenced, not absorbed. T2 writes, T3 real tenant load test, Cortex default tenant, and claim flow stay named residuals. |

Baseline G-11 instrument ("tenant-private atom refused to anonymous on every surface") is sequenced: this card's live grade is Dashboards HTTP plus the existing Hauska MCP plus compose accessPolicy on that path. Cortex, live Bastrop, and claim flow are not this card's close.

## Structural commitment check

- Sell reasoning, not data: aligned. The offer is a tenant-scoped compose over records, not a private wallpaper dump.
- Confidence is earned: not load-bearing on this card.
- Cost per jurisdiction: aligned. One repo, packs as tenants. A repo per city remains refused.
- Dual interface (28): identified Dashboards tools on the existing Hauska MCP server. Partial until that identified path is on serving.
- MCP v1 (51): one server. Conflict if a second MCP ships.
- Tenant sovereignty / ADR-017 / ADR-005: aligned if the pack subject is the gate tenant. Conflict if `DASHBOARDS_API_KEY` unlocks `fixture-city`.
- Brand (ADR-008): Dashboards is Empressa. Tenant resolution stays at the Hauska gate.
- Catalog thesis: aligned on not selling a city fork. Yellow if this card is used to declare sprint-54 done.

## Reasoning

G-11's row text is "auth and tenancy leg state established and sequenced." Sequencing is the honest close for Lane B. The missing piece after G-63 is not a vendor scrape. It is a second pack whose private material anonymous and the service key cannot see, bound to the product-key tenant ADR-005 already shipped.

Finishing sprint-54 on this card would rewrite Cortex, mint tenant-private atoms, and onboard live Bastrop. That is how a lane eats the longest pole. A fixture pack proves the partition without a city cutover and without the L26 slot.

G-33 and G-42 need a Bastrop-authenticated caller. This card does not mint one. Those rows stay OPEN after G-11 grades.

## Reversal criteria

Reverse "fixture pack, not Bastrop" only if the operator names live Bastrop as the second pack in writing. Reverse "product key is the subject" only if a named Dashboards pack token is bound 1:1 to `jurisdiction_tenant` at the Hauska gate. Reverse "not sprint-54 done" only if T2 and T3 and Cortex default tenant are graded by their own instruments. Do not use this record to scrape MyGov, to fill G-24, or to deploy into `smartcity-os-prod`.

## Dependencies

Blocked on G-63 CLOSED and on operator WDLL approval. Unblocks G-45 only after this WDLL is graded. Does not close G-21, G-24, G-33, G-42, G-45, or Bastrop cutover. Live `P:\smartcity-os` remains no-touch. L26 writer slot untouched.

## Counterparties

Internal: operator, Lane B planner. Surfaces: Dashboards Cloud Run, existing Hauska MCP server, Hauska retrieval (accessPolicy filter only). Not Bastrop city ops. Not Vertosoft. Not Mox.
