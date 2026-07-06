---
decision_id: 2026-07-06_slb_framing_retired_operator_overlay
date: 2026-07-06
owner: Nick
status: active
related_canonical: [_verticals/oil_gas/80_slb_engagement_and_operator_product_path.md, _verticals/oil_gas/40_chris_app_overlay.md, _decisions/2026-07-05_og_vertical_activation.md, 80_adrs/adr_025_og_atom_ontology.md]
---

## Decision

The SLB name and the SLB engagement framing are RETIRED. Operator verbatim: it "was an old pitch that he did not get." What the O&G docs called the "SLB side" (telemetry, equipment state, field-health analytics) is reframed as **operator-overlay capabilities**: what lights up when an operator brings their own assets as a tenant-private overlay on top of our public RRC and title data. There is now ONE product track — the Reeves/O&G operator product — not two.

## What this changes

The two-track conflation guardrail in the activation decision simplifies: there is no SLB channel to protect. The parts that survive, unchanged: tenant-private overlay data never enters the public product, and anomaly scoring / field-health analytics are never shown as running until built (honesty rule). Chris's Permian Field Health mockup (captured at `_verticals/oil_gas/assets/permian-field-health.html`) is the look/feel/flow spec for the Reeves twin viz layer; the panels that public data cannot feed (equipment health, sensor confidence, SCADA pressure) are presented as operator-overlay capabilities, seeded and labeled, not hidden.

**Chris working flow (operator-set):** we drive the Reeves-county redesign of Chris's file; once a touchable version exists that Nick, Herbert, and Chris can use, Chris takes design back over.

## Doc impacts (queued to the program's doc pass)

`80_slb_engagement_and_operator_product_path.md` status flips to retired-by-reframe; `40_chris_app_overlay.md` reframes Chris as design collaborator on our own product; ADR-025's equipment-state honesty note drops the SLB reference (applied at promotion); the `slb_prototype` repo stays parked as a harvest source (well-twin atom model), name unchanged as a historical artifact.

## Reversal criteria

If a real vendor engagement with SLB (or any operations-platform vendor) materializes as a paying counterparty, re-open a dedicated track with its own channel guardrails; do not retrofit it into the operator product.
