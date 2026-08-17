---
decision_id: 2026-08-17_g63_feed_adapter_contract
date: 2026-08-17
owner: nick
status: active
related_canonical:
  [
    _inbox/2026-08-17_g63_feed_adapter_contract_WDLL,
    _decisions/2026-08-17_smartcity_product_line_then_bastrop_onboarding,
    _decisions/2026-08-17_g13_consumer_contract,
    _decisions/2026-08-17_g62_compose_honesty_before_g11,
    _inbox/2026-08-17_g18_smartcity_inventory,
    _smartcity_masters/31_smartcity_dashboards,
    90_operations/OPS-17_govtech_stack_plan_of_record,
    28_mcp_first_product_design,
    51_substrate_v1_sprint,
  ]
---

# Decision

After G-62 close, Lane B next card is the feed adapter contract (OPS-17 **G-63**), not G-11 and not live vendor ingest. A vendor feed becomes a record with provenance and accessPolicy written onto spine or files. It is not a product SKU, not a fourth bus, and not a copied table in Dashboards. Do not start implementation until the G-63 WDLL is operator-approved.

## Context

G-62 closed 2026-08-17. The product-line overlay already ruled vendor feeds are templated adapters that write records (`_decisions/2026-08-17_smartcity_product_line_then_bastrop_onboarding.md`). G-13 already said adapters are ingest, not a consumer contract. Doc 31 refuses a dashboard that only visualizes a vendor feed. Live Bastrop still copies MyGov and Samsara into `smartcity-os` tables. Operator 2026-08-17: keep going after G-62, which names this card next.

Alternatives considered: jump to G-11 (too wide). Connect live MyGov or Samsara into Dashboards now (copies the weld; needs tenant-private and credentials). Put permit rows in Dashboards Neon (G-13 forbidden copied table). Fill G-24 from Samsara fleet copies (doc 32 refusal).

## The contract

| Rule | Meaning |
|---|---|
| Write records | An adapter emit is a record with source, timestamp, accessPolicy. A lens may render that record. A lens may not render vendor JSON as the product. |
| Write target | `spine` or `files` per G-13. Never a Dashboards Neon vendor table. Never a DSN to MyGov, Samsara, or the live city. |
| Grant vs kind | Kinds are the catalog. Grants are per city pack (`grantedAdapters`). A kind in the catalog is not a connected feed. |
| Pipedrive | CRM. Not a city feed. Absent from the kind catalog. |
| Samsara / fleet | Not G-24 Asset Management Tier 1 nodes. Default write target is files until a named AM ingest exists. |
| G-24 | Stays zero on this card. |
| Live Bastrop | No-touch. Do not scrape. Do not copy `mygov_permits`. |

Lead kinds to name (catalog, not implement): mygov, samsara, opengov, esri, municode, firstdue, verkada. Others may be added later under the same contract. Spireon, Power BI, GoTo stay unnamed until a later card; they are G-18 UNGRADED, not this catalog's proof set.

## Structural commitment check

- Sell reasoning, not data: the offer is a record with provenance, not a Samsara screen.
- Confidence is earned: adapters stamp source and time. They do not round G-21's 340 vs 12599.
- Cost per jurisdiction: one adapter kind, many city grants. Not a repo per vendor.
- Dual interface (28): list kinds on the existing Hauska MCP server. Partial until that tool is on serving.
- Tenant sovereignty: city ops feeds default tenant-private. Unauth compose already omits files keys (G-62). Live vendor grants wait G-11.
- Brand (ADR-008): Dashboards is Empressa ingest into Hauska spine or Smart Files. Adapters are not a Hauska product.
- Catalog thesis: aligned on not selling aggregation. Conflict if Pipedrive or a Samsara SKU ships. Conflict if a second MCP ships.

## Reasoning

Doc 31's differentiator is that a connected feed becomes a durable record. G-13 already forbade a fourth bus. The missing piece is the ingest shape: kinds, grants, write target, refusals. Naming kinds without granting them keeps template-city honest. Implementing live scrapes on this card would weld Bastrop into the template and steal the L26 slot or copy tables.

G-11 remains the longest pole for tenant-private grants. This contract does not claim tenancy is enforced. It claims that when a feed is connected later, it connects like this.

## Reversal criteria

Reverse "kinds without grants" only if the operator wants a fixture grant on template-city in writing. Reverse "Samsara is not G-24" only if doc 32 is amended. Reverse "no Dashboards vendor table" only if G-13 is reversed. Do not use this record to call live MyGov or to fill G-24.

## Dependencies

Blocked on G-62 CLOSED. Unblocks G-11 as still OPEN (grants of tenant-private feeds). Does not close G-21, G-24, G-45, or Bastrop cutover. Live `P:\smartcity-os` remains no-touch. L26 writer slot untouched.

## Counterparties

Internal: operator, Lane B planner. Surfaces: Dashboards Cloud Run, existing Hauska MCP server. Write targets later: Hauska spine, Smart Files. Not Bastrop city ops. Not Vertosoft.
