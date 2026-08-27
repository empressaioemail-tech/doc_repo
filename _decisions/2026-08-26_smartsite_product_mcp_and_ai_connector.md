---
decision_id: 2026-08-26_smartsite_product_mcp_and_ai_connector
date: 2026-08-26
owner: Nick (operator), recorded by integration seat
status: active
related_canonical:
  - 19_the_instrument_contract.md
  - 28_mcp_first_product_design.md
  - 29_mcp_surface_tier_model.md
  - 51_substrate_v1_sprint.md
  - 80_adrs/adr_008_engine_factor_out.md
  - _decisions/2026-07-04_branding_canon_hauska_substrate_only.md
  - _inbox/2026-08-10_smartsite_pricing_and_gtm_LOCKED.md
  - _smartsite_masters/06_smart_site_gtm_audiences_and_pricing.md
  - 90_operations/OPS-16_texas_market_plan_of_record.md
  - _inbox/2026-08-26_smartsite_ai_connector_WDLL.md
---

# Decision

Smart Site gets its own product MCP and a three-row agent-distribution program. The Hauska MCP server is not the connector.

**1. Product MCP, not a Hauska filter.** A new Smart Site MCP service (`mcp.smartsite.cloud`) exposes only Smart Site jobs. Auth is OAuth 2.1 with PKCE against the Smart Site account. Entitlement is the Stripe tier (Free, Solo, Studio, Team). Unresolvable credentials fail closed. The existing Hauska MCP server stays the catalog and developer gate (`X-Hauska-Key`, ICC, Codex lookup, atom search). Smart Site OAuth is not added there.

**2. Three rows, this order.** P-86 resolvable share links. P-87 the Smart Site MCP, the curated tool set, and the in-app "Use in your AI" button. P-88 vendor directory listings, only after a live probe on P-87. Paths 3 to 5 from the 2026-08-26 exploration (GPT store, AI search pages, Zapier) are not carded.

**3. Doc 51 evolution, named.** `51_substrate_v1_sprint.md` froze v1 as one MCP server with many tools and reserved a split for when listing visibility or per-domain branding became a growth lever. That lever is now the product. This is a product server, not a per-atom split. A later agent must not "simplify" P-87 back onto `hauska-mcp-server`.

## Context

A Studio user who wants Claude or ChatGPT to run Smart Site today pastes an API key. The Hauska gate takes only `X-Hauska-Key`; a Bearer token silently falls to the public catalog, which `19_the_instrument_contract.md` Access forbids. The live share URL is `/share#<token>`; HTTP never sends the fragment, so a model that fetches the link gets the SPA and no capability. `pe-share-view.ts` already returns JSON on a query-token URL, but that is not the URL a person pastes. The locked GTM rule says a share carries everything the sharer stored; the share plane serves anonymous baked facets and strips owner data. Claude's custom connector is "paste an HTTPS URL, then Connect"; per-user accounts want OAuth, not a shared header. ChatGPT custom MCP is gated (developer mode; full tools mostly Business/Enterprise).

Alternatives considered: OAuth on Hauska plus a curated-eight profile; a key-paste "Connect" button; machine-readable hash URLs via Accept headers. Rejected: one connector URL lists whatever the server lists, and the 2026-07-31 PE-proven-only ruling already drifted to 82 tools; header auth on Claude is for shared org credentials and `X-Hauska-Key` is not on the allowlist; content negotiation cannot see a hash fragment.

## Structural commitment check

- Sell reasoning, not data: the connector and the share projection carry citations, verdicts, and provenance. Audience selects rendering (markdown, JSON, HTML), never content (`19` Lens).
- Confidence is earned: existing inspect and report confidence rules travel; the connector does not invent a second score.
- Cost per jurisdiction: not in scope. This is a distribution surface over data already served.
- Dual interface: Smart Site's agent surface is this product MCP. The workbench stays the human surface. Same entitlement, same jobs.
- Brand: Smart Site is Empressa. Hauska remains substrate (ADR-008, 2026-07-04 branding canon).
- No privileged data: public-record only; owner data stays Studio as already locked.

## Reasoning

Doc 29 already splits substrate MCPs (volume, product keys, Layer 1 catalog) from product MCPs (subscription included, tenant or seat ceiling). Smart Site Free / Solo / Studio / Team is the product model. Teaching the Hauska gate a second identity contaminates both: a Studio session would see Codex and Files write tools, and a Hauska key outage would take the consumer connector down. OAuth was going to be the bulk of the work either way. A thin facade of eight tools over the same cortex, engine, and files paths the workbench already calls is smaller than a second identity on the substrate authorize path. Fresh product, shared backends. A from-scratch second writer is refused.

The share row is first because it needs no account, no directory, and no OAuth. It is also the Records Request distribution path: the report lands on the parcel, the link carries it. The link must be server-visible. The locked fidelity rule is the done state for that row; today's anonymous bake is a defect against that rule, not the product.

The connector exposes about eight PE-proven tools (find a parcel, get its smart site, list my properties, run a report, request records, check a request, export an instrument, ask the map). The rest stay on the Hauska developer gate. Per-call pricing is not live (metering counts, rate is null, entitlement mint is unbuilt). v1 sells the tier through OAuth. Async reports must say started and deliver; that is a named item, not a default.

## Reversal criteria

- Claude or ChatGPT ship a first-party Smart Site listing that binds our existing Hauska hostname and Stripe without a second server; then P-87 housing may collapse to a named profile on Hauska by amendment, and only then.
- Self-serve Hauska keys become the Smart Site account (one identity); then the product/substrate auth split is re-opened.
- The locked share rule is reversed so a share is identity-lens only; then P-86 Phase B (grant row, owner data on the token) drops by amendment.
- A live probe shows eight tools still pick wrong and a larger named set is required; then the tool list amends, it does not silently grow.

## Dependencies

Depends on: Smart Site sign-in and Stripe entitlement (P-60 commercial lane, sandbox until live activation); the existing facets, reports, Records Request (P-85), and export paths; a public hostname on `smartsite.cloud`.

Unblocks: "Use in your AI" in the workbench; Claude and ChatGPT directory listings (P-88); Records Request distribution by pasteable link.

Does not unblock: per-answer Hauska metering, Circle payout, ICC, Codex, Zapier, GPT-store SKUs, public per-parcel SEO pages.

Does not absorb: P-31 (Hauska MCP hardcoded-list finish), P-32 (report engine), P-85 (Records Request itself).

## Counterparties

Internal. Property seat owns the Smart Site MCP, the share plane, the button, and the tool copy. Substrate seat keeps `hauska-mcp-server` and is not the OAuth owner. Operator approves the WDLL before build and picks the email/provider items already owed on P-85 if Records Request tools land before that card.

## Amended 2026-08-26 (planner reply)

OPS-16 row is A-035 (A-034 was Records Request path-to-live). WDLL approved to start P-86 item 1. Three card amendments bind: (a) the resolvable URL carries the grant row id, never the HMAC; grant rows are a prerequisite of item 1; HMAC stays the bearer for `/share#token` only; (b) MCP housing is `legacy-design-tools/artifacts/smartsite-mcp` via `cloud-run-deploy.yml`, not `hauska-map/apps/smartsite-mcp`; share UI stays in hauska-map; (c) name the authorization server before P-87 starts; planner recommends a hosted AS federated to the existing OIDC BFF; P-86 does not wait. `request_records`, `check_request`, and P-86 item 8 wait on P-85 item 4.

## Amended 2026-08-27 (planner reply 00:15Z, OPS-16 A-037)

Authorization server named: hosted WorkOS AuthKit. OAuth 2.1 + PKCE, dynamic client registration, refresh tokens, Google and Microsoft sign-in matching the existing OIDC BFF, documented MCP authorization-server role. Fallback if a live Claude custom-connector Connect cannot complete against it twice: Stytch Connected Apps, by amendment of A-037, not re-litigation. Identity join rule, binding: an AuthKit subject maps to a Smart Site user only through `peUserIdentities` by `(provider, subject)`, or by verified email on the same provider; the MCP server never creates a second account and never grants a tier that the user's `peUserEntitlements` row does not carry. Vendor claims verified at build time from `https://workos.com/docs/authkit/mcp` (fetched 2026-08-27): AuthKit is the MCP authorization server; metadata advertises `S256` PKCE, `refresh_token`, `registration_endpoint`, and `offline_access`; CIMD is the current MCP-preferred registration path (off by default, enable in Connect Configuration) and DCR remains for clients that do not yet send CIMD. Google and Microsoft are not listed on that MCP page; they are a join requirement against the existing OIDC BFF (Standalone Connect keeps that login). Item 10 is the falsifier. P-86 order confirmed: grant row first, then resolvable URL with the grant id.
