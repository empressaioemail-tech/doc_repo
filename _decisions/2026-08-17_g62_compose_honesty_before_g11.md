---
decision_id: 2026-08-17_g62_compose_honesty_before_g11
date: 2026-08-17
owner: nick
status: active
related_canonical:
  [
    _inbox/2026-08-17_g62_compose_honesty_WDLL,
    _inbox/2026-08-17_g61_dashboards_template_WDLL,
    _inbox/2026-08-17_g61_close.json,
    _decisions/2026-08-17_g13_consumer_contract,
    90_operations/OPS-17_govtech_stack_plan_of_record,
    08_tiered_access_model,
    28_mcp_first_product_design,
    51_substrate_v1_sprint,
    80_adrs/adr_017_atom_access_control,
  ]
---

# Decision

After G-61 close, Lane B next card is Dashboards compose honesty (OPS-17 **G-62**), not full G-11 tenancy and not the feed adapter contract. Unauthenticated city-manager compose must atom-read as anonymous. Do not start implementation until the G-62 WDLL is operator-approved.

## Context

G-61 closed 2026-08-17 on live probes (`_inbox/2026-08-17_g61_close.json`). Compose mounts retrieval atom-chain, SmartSite embed, and files HTTP. The unauthenticated gold probe listed `owner-fact` in `atoms.types` (`_scratch/g61_dashboards_live_probe.json` ts `2026-08-17T14:30:55.899Z`). G-13 requires the same accessPolicy on atom-read HTTP as on MCP. MCP tests withhold `owner-fact` (`public-paid`) from anonymous callers. Operator 2026-08-17: go on a thin compose-honesty WDLL, not jumping full G-11; feed adapters after that.

Alternatives considered: fold the leak into G-11 (too wide; G-11 instrument is tenant-private refused on every surface). Filter `owner-fact` in Dashboards after a privileged engine fetch (wrong gate; reconstructs accessPolicy in the consumer). Start feed adapters first (leaves Layer 2 types on an open HTTP path).

## Structural commitment check

- Sell reasoning, not data: compose already returns types and counts, not atom bodies. Honesty is which types are visible, not a dump.
- Confidence is earned, not asserted: not the load-bearing commitment on this card.
- Cost per jurisdiction: unchanged. Template city pack stays `template-city`.
- Dual interface (28): add `dashboards_compose_city_manager` on the existing Hauska MCP server. Partial if HTTP-only ships without the tool.
- Tenant sovereignty / ADR-017: anonymous must not see public-paid because a product Cloud Run holds `HAUSKA_ENGINE_API_KEY`. `DASHBOARDS_API_KEY` is a service token, not an accessPolicy subject.
- Brand (ADR-008): Dashboards is Empressa. accessPolicy stays at Hauska retrieval / MCP.
- Catalog thesis: aligned on one MCP and Layer 1 vs Layer 2. Partial until the MCP compose tool is on serving. Conflict if a second MCP is added or if paid types stay on anon HTTP.

## Reasoning

G-11 is the longest pole (OPS-17 G-11: tenant-private refused to anonymous on every surface). The live defect is narrower: one unauthenticated compose path impersonates the engine. Closing that path does not claim SmartCity tenancy is enforced. It claims G-13 "same accessPolicy" holds on the proof lens G-61 just shipped.

Feed adapters write records. They are the next named WDLL after this card closes, then G-11. Dispatching this residue as G-11 would let a lane eat sprint-54.

## Reversal criteria

Reverse the sequencing if the operator names feed adapters or G-11 as the next build before this WDLL is approved. Reverse the anonymous-always compose rule only when G-11 names a real caller identity that retrieval can entitle; do not treat `DASHBOARDS_API_KEY` as that identity. Reverse "one Hauska MCP server" only if 51 is amended.

## Dependencies

Blocked on G-61 CLOSED. Unblocks feed adapter contract WDLL, then G-11 as still OPEN. Does not close G-11, G-21, G-24, G-45, or Bastrop cutover. Live `P:\smartcity-os` remains no-touch. L26 writer slot untouched.

## Counterparties

Internal: operator, Lane B planner. Surfaces: Dashboards Cloud Run, existing Hauska MCP server, Hauska retrieval. Not Bastrop city ops. Not Vertosoft.
