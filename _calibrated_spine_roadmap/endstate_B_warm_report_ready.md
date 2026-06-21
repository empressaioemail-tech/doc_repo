---
id: endstate_B_warm_report_ready
title: End-state B — warm, report-ready state across Central Texas
status: active
last_updated: 2026-06-21
applies_to: hauska
owner: nick
related: [calibrated_spine_task_roadmap, endstate_D_reporting_surface, base_calibration_bootstrap, calibrated_spine_agent_execution_model]
---

# End-state B: warm, report-ready state

## Definition of done

Every individual Central Texas property is in a warm, report-ready state: one ping on an address triggers the full agent cascade (geocode, jurisdiction-coverage resolve, code-atom retrieval, site-context, hydrology, consequence derivation, synthesis, deposit to reasoning_atoms via cold-warm UPSERT, cache), so any report renders instantly on demand. The run doubles as automated QA across the whole parcel universe, surfacing coverage holes, adapter failures, contested ground, and thin-high-consequence parcels. Warm means report-ready, not calibrated.

## Tasks

W1 warming-and-QA harness, W2 parcel-universe enumeration and orchestration, W3 per-parcel QA assertions, W4 cost-and-quota guardrail, W5 synthetic-read tagging. The warming cascade is the same pipeline as reporting (End-state D), run ahead of demand; see R2.

## Acceptance criteria

- One ping on any Central Texas address sets the full cascade in motion and lands the property in a cached, report-ready state without further input.
- The run is idempotent: re-pinging a warmed property refreshes it without duplicating deposits, and cold-warm UPSERT preserves any calibration columns.
- The QA pass emits, per parcel: coverage produced or a clean no-coverage state, every adapter resolved or cleanly declined, confidence widthed and sourced, contested ground logged where layers disagree, and a triage flag where thin crosses high-consequence.
- The warming cascade makes no live Cotality call. Cotality is the sole parcel and property spine (Regrid purged 2026-06-17), so parcels and Cotality-backed fields in warming come only from cached snapshots (place_layer_snapshots); live per-parcel Cotality is demand-time and key-gated. The free federal layers used live in warming are FEMA, USGS, and EPA.
- Warming pings are tagged synthetic and excluded from the real query-frequency distribution that Measurement A and the map's query-weighted layers key on.
- A warmed property's confidence reads as asserted or backtest until live fuel and Measurement A say otherwise; warm is never displayed as calibrated.

## Guardrails to check explicitly

Running the full parcel universe through the cascade has real compute and LLM cost. Reconcile against the under-200-dollars-per-jurisdiction line and the compute-light COGS posture, and treat W4 as a hard constraint, since a per-parcel Cotality call would blow the demo quota and the budget instantly.

## Reports back

W closes to `_inbox/` with parcel counts warmed, coverage-hole list, adapter-failure list, contested-ground count, triage-flag count, and the running compute cost against budget.
