---
id: 2026-08-05_T3_slot_independent_build
title: T3 dispatch — slot-independent build (ADR-029 unblocked)
date: 2026-08-05
status: active
owner: nick
related: [2026-08-05_adr029_rails_rulings, T3_rails_track, CATCHUP_program_2026-08-05]
accepts: [T3-UNBLOCK-1, T3-UNBLOCK-2, T3-UNBLOCK-3]
---

# T3 slot-independent build dispatch

Master planner rulings landed (`_decisions/2026-08-05_adr029_rails_rulings.md`, commit 8f52ab8). ADR-029 ACCEPTED.

## Executors dispatched (2026-08-05)

| Seat | Repo | Branch | Deliverable |
|---|---|---|---|
| cc-agent-AC | hauska-atom-contract | feat/adr-029-site-layer-atoms | `building-footprint` + `utility-easement` types @1.12.0 |
| cc-agent-E | hauska-engine | feat/t3-ingest-site-layers | `ingest-site-layers.mjs` + adapters; dry-run only; apply gated on `T3_SLOT_RELEASED=1` |
| cc-agent-C | hauska-map + hauska-engine | feat/t3-footprint-easement-overlays | PE overlays + site-plan BUILDING_FOOTPRINT layer |

## Slot discipline

- Slot 1 / FIPS 48021 **GRANTED**, queued behind T1 workstream-1
- **Do NOT run `--apply`** until master planner explicitly releases slot to T3
- Pilot chain after release: dry-run-exact apply → Jones/Higgins area-sweep cert → Phase 2 slots 2-8

## Ruling constants (bind executors)

- ML footprint: `accessPolicy=public-free`, mandatory `sourceTier=ml-derived`, ODC-By in sourceCitation
- Absence: hybrid — county-coverage row when no source; per-parcel sentinel only when source exists but parcel has no feature
- Phase 2b: Bastrop city easements Easements_/43 (148) approved, city limits scope, rides Slot 1
