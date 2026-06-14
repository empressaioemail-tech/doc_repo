---
id: 20_tech_to_og_map
title: Our tech mapped to the oil and gas product surface
status: exploration
last_updated: 2026-06-14
applies_to: [hauska, empressa]
owner: nick
related: [00_oil_gas_index, 55_spine_data_intelligence_stack, 53_hauska_sdk_completion_sprint, 52_mcp_offer_and_buildout, _prospects/mox/2026-06-11_mox_master_dossier, _prospects/mox/2026-06-07_mox_engagement_plan, 80_adrs/adr_007_cross_stakeholder_atom_access, 80_adrs/adr_010_atom_graph_traversal]
---

# Our tech mapped to oil and gas

> **The backend pitch in raw form.** This is what we bring to Chris's frontend. Each row is a piece of our current stack, what it does today, and how it serves an oil and gas land or asset product. Verification state is marked because some of this goes external: LIVE means running in production, BUILT means code-complete but dormant or un-deployed, PLANNED means designed and dispatchable but not yet built. Grounded against `55_spine_data_intelligence_stack.md` and `53_hauska_sdk_completion_sprint.md` (both verified against live code), and the Mox dossier.

## The one-line wedge

Chris's frontend assumes a backend that returns provenance-backed, structured, confidence-scored intelligence over jurisdictional and property data, runs secure revocable data rooms with role-scoped access, and can settle multi-party payments. That backend is not hypothetical. It is the thing we have spent the last year building for real estate and code intelligence, and oil and gas is the same problem shape: physical-world assets, jurisdictional rules, multi-party obligations, and money moving on verified facts.

## Layer 1: the reasoning and provenance engine

| Our asset | State | What it does today | Oil and gas mapping |
|---|---|---|---|
| Plan-review / finding engine (cortex-api) | LIVE | LLM reasoning over inputs that emits findings with `code-section` citations, a confidence number, and a lay summary. Structured output, not prose. | Title chain reasoning, lease-obligation analysis, regulatory-compliance findings. Every output carries the citation and confidence that the land product's "provenance markers" UX needs. |
| Provenance, citation, confidence, timestamp on every atom | LIVE (confidence uncalibrated) | Spine-wide invariant: each atom states its source and verification state. | Directly serves the marketplace's "every listing verified" and the land product's "{{doc}} / {{field}} / {{inference}}" provenance markers. The earning loop for calibration exists; confidence falls back to an asserted baseline with provenance, never a bare number. |
| Precedence / conflict resolution (ADR-019/021) | PLANNED (latent in atoms) | Most-stringent-governs, federal-preempts, local-overlay as a reasoning primitive. | Resolves conflicting lease terms, overlapping mineral and surface estates, and multi-jurisdiction regulatory stacks (RRC plus county plus TCEQ). |
| Document ingestion (PDF peel, vision OCR, attached-doc text extraction) | LIVE | Born-digital and scanned PDF extraction, per-sheet OCR, text extraction from uploads. | Lease and deed ingestion, title document extraction, recorded-instrument parsing. The same peel that reads code reads recorded oil and gas instruments. |

## Layer 2: the jurisdictional data spine

| Our asset | State | What it does today | Oil and gas mapping |
|---|---|---|---|
| Hauska engine retrieval API | LIVE | Read-only corpus, 34 to 35 jurisdictions, roughly 21k atoms, baked into the image. | The same ingestion pattern extends to oil and gas county and state corpora. Central Texas overlaps the Permian and the WES footprint counties (Reeves, Ward, Culberson, Loving, Pecos, Winkler). |
| Cotality oil and gas mineral SKU | BUILT (creds pending) | SpatialRecord oil and gas wells and leases, plus utility, in the Cotality 8-pack. | Wells, leases, and mineral records as a paid Layer 2 tier. Already wired, awaiting credentials. |
| County-clerk mineral and oil-and-gas index (place graph) | PLANNED | Legal-description-keyed index of mineral deeds and oil-and-gas leases via the encumbrance ingestion pipeline. | Title run sheets, ownership chains, lease and royalty burden. High-level index, the substrate under the marketplace's automated run sheet. |
| Texas Railroad Commission and TCEQ as data channels | PLANNED (RRC in stakeholder graph) | RRC named as a P3 data-access channel for the mineral-rights atom domain; TCEQ Edwards Aquifer already ingested. | Well permits, operator records, produced-water and injection-well filings, environmental compliance. The regulatory layer for both upstream and midstream. |
| Atom contract (`@hauska/atom-contract` 1.3.0) | LIVE (published) | The shape every layer speaks; five-value accessPolicy. | Lease, well-site, royalty-split, party, document already exist as atom families. Oil and gas data is atom-native, not a new schema problem. |

## Layer 3: data rooms (the Mox reuse)

The virtual data room is the single largest direct reuse. We are building it right now for Mox, and it is the same component both oil and gas products center on.

| Our asset | State | What it does today | Oil and gas mapping |
|---|---|---|---|
| Tenant-private isolation (ADR-005, accessPolicy) | PLANNED (gate gates by product, not tenant; tenant leg builds it) | `tenant-private` atoms never pool into shared or public assets. | A seller's or operator's private deal data stays isolated. The trust requirement for diligence data rooms is the same one Mox depends on. |
| Cross-stakeholder scoped access (ADR-007) | LIVE in design, enforced via tenant leg | Property owner is tenant; managers, residents, vendors are scoped readers and writers, enforced at the data layer not the screen. | Maps one-to-one: asset owner is tenant; buyers, brokers, counsel, and counterparties are scoped readers with granular access (full, view-only, no-download). |
| Atom-graph over IPFS with signed containers (ADR-010/011/012) | PLANNED / partial | Content-addressed atom graph, Postgres as index and access control, `.atom` and `.atompack` as downloadable self-rendering signed containers. | The data room manifest, integrity hashing, and watermark-and-audit story the prior docs describe with "IPFS manifest hashes" is our actual architecture. |
| Live revocable LP data room (the umbilical) | PLANNED (gated on auth build, demoed for Mox) | A revocable, provenance-backed, role-scoped data room over live data. | The marketplace's "instant, expiring, monitored" diligence rooms and the land product's third-party VDR are the same build. |

## Layer 4: payment and settlement (the marketplace rail)

| Our asset | State | What it does today | Oil and gas mapping |
|---|---|---|---|
| `@hauska-sdk/payment` crypto rail | BUILT (56 tests green) | Real on-chain USDC verification across Base, Ethereum, Polygon. An x402 pull model verifying client-executed payment. | Verified settlement of a transacted deal. Real today, not a 2025 tokenization promise. |
| Circle fiat rail | BUILT, completion in flight | Checkout-session creation and webhook verification replacing the prior stub. | Fiat settlement for buyers and sellers who do not transact in USDC. |
| Revenue routing and source-actor split | PLANNED (in SDK completion sprint) | Splits a settled payment and routes a source-actor share, with an idempotent routing ledger. | The marketplace's "automatic multi-party payout across packaged-asset contributors" is exactly a revenue split with multiple source-actors. |
| MCP metering and tiered billing | PLANNED (in SDK completion sprint) | Per-call metering, bundle quotas, overage billing through the gate. | Usage-based billing for an oil and gas data or run-sheet tier. |

## Layer 5: the surface and delivery layer

| Our asset | State | What it does today | Oil and gas mapping |
|---|---|---|---|
| Hauska MCP server (46 tools, product-gated) | LIVE | Gates by product at `X-Hauska-Key`; warm min-instance. | An oil and gas product key exposing land and asset tools to Chris's frontend or to agent consumers. MCP-first per commitment 4. |
| Cortex rendering and site-context | LIVE | Site context, topography, hydrology, flood, rendering parity. | Surface-use planning, pad-site context, pipeline-corridor terrain and hydrology, produced-water and flood overlays. |
| Codex (plan and code review) | LIVE | Plan review plus code intelligence over the corpus. | Regulatory plan review for facilities, gathering systems, and compliance against ingested state and county code. |

## What we would actually own in the Chris deal

If Chris owns the front end, the clean division is: he owns surface, components, and UX; we own everything behind the API. Concretely that is the reasoning engine, the atom spine and its data adapters, the data-room substrate, the payment and settlement rail, and the MCP tool surface that his frontend calls. The pitch is not "we build your app." It is "your app is a client of our substrate, and no one else has this substrate."

## Verify before any of this goes external

- Exact Cotality credential and tier state (creds pending; do not imply live mineral data).
- Which spine pieces are LIVE versus PLANNED above; the table is grounded as of 2026-06-14 but the tenant leg and SDK completion are in flight and will move.
- Whether Enverus is a partner, a replaced dependency, or irrelevant; the prior docs assumed it, our spine does not depend on it.
- Calibration honesty: confidence is real but uncalibrated today; sell the earning loop, not a calibrated number.
