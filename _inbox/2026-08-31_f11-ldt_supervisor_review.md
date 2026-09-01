---
id: 2026-08-31_f11-ldt_supervisor_review
title: Supervisor grade — F-11 LDT setback refuse
date: 2026-08-31
last_updated: 2026-08-31
status: active
lane: F-11-LDT
plan_row: F-11
agent: d1fe9402-6c89-4be7-84d9-9cf26dcd5530
snapshot: P:/seat-worktrees/property/legacy-design-tools-f11-ldt 12215749
---

# Supervisor grade — F-11 LDT

Reviewed write paths, not only the handback. Re-ran classifier + boundaryEdgeFactRead: 32/32.

`presentEdgeFromRow` classifies `rec.setback`. `presentFromItems` copies `lead.setback` after that classify. Envelope / DrawEdge / `roadClassSetbacks.ts` not touched, so C4 cannot move from this diff.

C7 cannot go green from this tree. Live gold still serves the raw provenance until this image is deployed. After deploy, C7 still walks `sourceAdapter=descriptor-fixture`. That is not a setback value and is not this card.
