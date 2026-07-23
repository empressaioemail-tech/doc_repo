---
id: 75n_icc_code_connect_catalog
title: ICC Code Connect — credential record and license constraints
status: active
last_updated: 2026-07-23
applies_to: hauska
owner: nick
related: [55_spine_data_intelligence_stack, 74_commercial_agreements, 73_partnerships, endstate_A_m1_amendment, 25b_monetization_provenance_storage_stack, 2026-07-23_MASTER_WDLL_property_reasoning_substrate]
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

## ICC as the source-obligation test account (added 2026-07-23)

ICC is the worked example and the demo account for the source-obligation model — the mechanism that operationalizes what the license constraints above already require by contract (traceability, no-pooling, purge-on-wind-down, pay-per-use). The authoritative stack diagram is `25b_monetization_provenance_storage_stack.md`; this section records what ICC specifically needs.

The model, ICC-instantiated:
- ICC is a SOURCE-ACTOR, modeled as an actor atom (ADR-015) carrying its licensing terms (per-reference rate and/or rev-share, per the SaaS agreement). This actor atom is the single identity every ICC-derived code atom points at as its source, and the accrual target for what we owe ICC.
- Every ICC-derived code atom (a code-section atom, or a setback-rule atom that CITES one) references ICC's actor atom + the ICC book ID + section (which is also what the license's wind-down/purge requirement needs — one field serves both metering and destruction-traceability).
- INBOUND METER (money OUT — what we owe ICC): every REFERENCE of an ICC-sourced atom accrues a royalty at the gate read path — FREE TIER INCLUDED. A homeowner viewing a cited 2018 IBC section on the free tier is an ICC obligation even though we sold nothing. A meter that only fires on a paid sale would leave every free-tier and internal reference as unmetered ICC liability — the gap. This meter is NOT deferrable once ICC-cited codes serve at volume.
- OUTBOUND ROUTING (money OUT on a sale): when a paid report includes ICC-cited content, RevenueRouter routes ICC's cut of the sale (its `SourceActorReference` is a placeholder until this metadata lands — see the master WDLL phase-0.5 item 2.5.4).
- accessPolicy stays as the sourcing-posture section above dictates: `platform-internal` until the SaaS agreement is signed, then `public-paid`. The meter runs regardless of tier; accessPolicy governs who may SEE the atom, the meter governs what we OWE for each reference.

For the ICC demo (when Nick circles back): the story to show is that ICC is paid correctly on BOTH paths off a single identity — per-reference on every view (free included), plus a revenue share when their content sells in a paid report — with the full provenance chain traceable to book ID + section for audit and clean wind-down. That is the licensing-compliance proof a source needs to sign the SaaS agreement: not "trust us to track usage," but a metered, provable, purgeable substrate. Refresh this section against the live build state before the demo (the inbound meter + source-actor metadata are named plan work, not yet live as of 2026-07-23).

## ICC contact

ICC Data Implementation Services team. Nick owns the relationship.
