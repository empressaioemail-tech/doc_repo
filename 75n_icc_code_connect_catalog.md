---
id: 75n_icc_code_connect_catalog
title: ICC Code Connect — credential record and license constraints
status: active
last_updated: 2026-07-01
applies_to: hauska
owner: nick
related: [55_spine_data_intelligence_stack, 74_commercial_agreements, 73_partnerships, endstate_A_m1_amendment]
---

# ICC Code Connect — credential record and license constraints

Active PoC credentials for the 2018 IBC and 2018 IPMC. The same API and credentials are used during the PoC and once a full SaaS agreement is signed. Path to SaaS: arrange a live demo with ICC, then ICC executes the SaaS agreement enabling customer-facing use.

## Credentials

Credentials are stored as GCP secrets (not recorded here). The names follow the ICC_CODE_CONNECT_* convention established in the runbooks. They must be wired into both `legacy-design-tools-prod` and `hauska-prod-497015` before the adapter can make live calls.

Credentials enabled through: Dec 30, 2026.

## Books enabled under PoC

| Book | Book ID | Canonical name |
|---|---|---|
| 2018 International Building Code | IBC2018P6 | 2018 International Building Code |
| 2018 International Property Maintenance Code | IPMC2018P2 | 2018 International Property Maintenance Code |

These are the only two titles enabled for the PoC. Any additional ICC title requires a separate enablement.

## API

Documentation: https://api.iccsafe.org/ (also carries rate-limit details).

A REST API. Sections can be retrieved at section granularity — access is not limited to the whole title. The PoC API is the same interface as the eventual live SaaS API.

## Citation format

When displaying a section reference to an end user, the canonical citation format ICC expects:

> 2018 International Building Code Section 802.3

The pattern is: full canonical title + "Section" + section number. No abbreviation ("IBC" alone is not sufficient). Use the exact book name from the table above.

For IPMC: "2018 International Property Maintenance Code Section X.X"

## Display rights under PoC

Under the PoC the following is permitted:

- Show the section identifier and heading alongside our own analysis.
- Display the content of a subsection.
- Do NOT reproduce the full section body verbatim to an end user.

Our default product posture — section identifier + heading + our own analysis + optional subsection text — is clean under the PoC.

## License constraints (technical)

**Caching and storage.** Caching and storing consumed content is permitted. However, if the license ends (PoC wind-down, or a future termination), all stored copies must be destroyed — including vector databases and embeddings that have ingested ICC content. Confirmation of destruction is owed back to ICC. Design the demo instance to support a clean wind-down: track which atoms and embeddings carry ICC-sourced content so they can be purged.

**Derivative works.** Using the content text directly within new content you create is a derivative work. Independent analysis that cites the content is not. Our model — our own analysis that cites the section — is not a derivative. Do not include verbatim section body text in any LLM training corpus, prompt template, or stored derived output without treating it as a derivative.

**No customer-facing use until SaaS agreement is signed.** The PoC license does not extend to customer-facing applications. A demo must be arranged with ICC first; following the demo, ICC executes the full SaaS agreement.

## Operator actions outstanding

1. ~~Wire ICC credentials into GCP~~ — DONE 2026-07-01. Secrets are in `hauska-prod-497015` (ICC_CODE_CONNECT_CLIENT_ID + ICC_CODE_CONNECT_CLIENT_SECRET); hauska-engine-api is at revision 00017-cuy with the secrets mounted and 100% traffic in us-central1. The ICC Code Connect adapter is in hauska-engine (`packages/corpus/src/adapters/icc-code-connect/`), not in legacy-design-tools. The legacy-design-tools-prod project does not need these secrets; the cortex-reporting plan review surface calls the MCP server, which calls hauska-engine, which holds the credentials.
2. Run the ICC API contract verification before dispatching ingest. The adapter was built with assumed field names (`@assumption` tags throughout `code-connect-client.ts`). Confirm token endpoint, API base, and book identifiers against the live API before the ingest runs.
3. Arrange the ICC demo once the PoC surface is ready. The demo unlocks the SaaS agreement and customer-facing display of IBC/IPMC content.

## Sourcing posture

ICC codes are licensed content, not public-domain. Atoms derived from ICC content carry:
- `accessPolicy: "platform-internal"` at minimum; upgrade to `"public-paid"` only after the SaaS agreement is signed and customer-facing display is licensed.
- `derived_ok: false` on the source registry entry. ICC-derived atoms may not be pooled into any shared or public calibration asset, and may not be exposed in any output where the ICC text itself could be reconstructed.

The atom provenance chain must be traceable to the ICC book ID and section so that a wind-down can identify and purge all ICC-sourced content.

## ICC contact

ICC Data Implementation Services team. Nick owns the relationship.
