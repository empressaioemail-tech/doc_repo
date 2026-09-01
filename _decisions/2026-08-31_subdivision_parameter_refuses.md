---
decision_id: 2026-08-31_subdivision_parameter_refuses
date: 2026-08-31
owner: property seat (P-91 Q1 item 3)
status: active
related_canonical:
  - _dispatches/2026-08-31_p91-q1-cortex_dispatch.md
  - _inbox/2026-08-31_p91_q1_feasibility_measurement.md
  - 09_post_saas_substrate_thesis.md
---

## Decision

The Q1 `subdivision` parameter refuses. It is not acquired on this card. The shipped parser is not widened.

## Context

Q1 asked `find_parcel` to gain a subdivision selector. Measurement found no `txgio_parcel` column for subdivision or legal text. The TxGIO shapefile carries `LEGAL_DESC` and the ingest documents that field as deliberately not captured (`lib/cad-ingest/src/txgio/parse.ts`: the store keeps identity and situs). `cad_property.legal_description` exists where CAD ingested it. The shipped parser was run against the repo's own legal-description fixtures and extracted a subdivision on zero of six, including two that plainly name one.

## Structural commitment check

Sell reasoning, not data: a confident wrong grouping is worse than a refusal. Confidence is earned: a regex that cannot be calibrated against a source field is an asserted grouping. Cost per jurisdiction: acquire would have to name a source and a cost before it starts.

## Reasoning

This is a source question wearing a parsing question's clothes. A wider regex would group parcels that share a token in a legal string. That looks like an answer and is not one. The records-request path already sends the full legal description to the clerk; that is a different job and stays. A later acquire card must name the source (CAD dedicated column, plat GIS, or LEGAL_DESC capture plus a parser that scores on held fixtures) and the cost per jurisdiction.

## Reversal criteria

Reverse when a named source holds a subdivision identifier that a second derivation can check, the parser or join scores on the repo fixtures plus a live county sample, and the cost per jurisdiction is stated and under the hard kill.

## Dependencies

P-91 Q1 stays cortex-blocked on this parameter until an acquire card closes. MCP maps the refuse; no vocabulary row ships from this card.

## Counterparties

Internal. Property seat owns api-server. Integration owns the MCP consume.
