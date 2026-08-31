---
decision_id: 2026-08-19_61_enforcement_doctrine_band_placement
date: 2026-08-19
owner: systems seat (doc_repo band authority)
status: active
related_canonical:
  - 61_enforcement_doctrine.md
  - 90_runbooks/90_enforcement_build_order.md
  - ENFORCEMENT.md
  - .cursor/rules/enforcement.mdc
---

## Decision

Enforcement doctrine lives in band **61** at repo root as `61_enforcement_doctrine.md`, not under `90_runbooks/`. Build-order and runbook mechanics stay in band **90** (`90_runbooks/90_enforcement_build_order.md`, `90_runbooks/enforcement_vehicles.md`).

## Context

Doc 61 landed incidentally at `90_runbooks/61_enforcement_doctrine.md`, mixing the numeric band with the runbooks directory. Band 61 is the canonical slot for enforcement doctrine per the build-order header; band 90 is operational runbooks. Splitting them keeps "what agents must obey" separate from "how controls are built and armed."

## Structural commitment check

Instruments over narration: doctrine at a stable band path reduces shadow copies.
No structural commitment conflict.

## Reasoning

`51_ingestion_pipeline_reference.md` and similar canon already use root-level numeric bands. ENFORCEMENT.md and `.cursor/rules/enforcement.mdc` are vehicles; `61_enforcement_doctrine.md` is the ratified source. Runbooks that implement controls remain in 90. References updated in the same session; no content change to doctrine body.

## Reversal criteria

Revisit only if the repo adopts a dedicated enforcement subdirectory that the planner ratifies for all band-61 docs. Do not move back into 90_runbooks without an explicit band-policy decision.

## Dependencies

C-00 vehicle sync (ENFORCEMENT.md and enforcement.mdc derive from 61).

## Counterparties

All fleet agents; planner for commit batch.
