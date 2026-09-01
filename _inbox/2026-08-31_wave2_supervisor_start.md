---
id: 2026-08-31_wave2_supervisor_start
title: Wave 2 supervisor start — F11-WRITER and P5-SCRUB
date: 2026-08-31
last_updated: 2026-08-31
status: active
---

# Wave 2 supervisor start

Seat: integration on `P:/doc_repo` main. Two implementers spawned. They do not commit.

## Tracks

| Lane | Plan rows | Worktree | Branch | HEAD at spawn | Agent |
|---|---|---|---|---|---|
| F11-WRITER | F-11, F-02 | `P:/seat-worktrees/property/hauska-engine-f11-setback` | `seat/property-ctx-f11-writer` | `80fb906` | [F11-WRITER](89e48338-1312-4012-a587-05a6bfbce5a8) |
| P5-SCRUB | F-08 | `P:/seat-worktrees/property/hauska-factory-p5-scrub` | `seat/property-ctx-p5-scrub` | `3a0dc9a` | [P5-SCRUB](789cde32-a979-44ef-82b6-85e343921efc) |

## Already filed

- CP1 F11: `_inbox/2026-08-31_f11-writer_cp1.json`
- CP1 P5: `_inbox/2026-08-31_p5-scrub_cp1.json`

## Design rulings already in CP1

F11 leads with the engine allowlist. `atoms-writer-job.mjs` hardcodes the CAD child. Factory `WRITER_JOBS.f11-setback` is a stub and is not this card. Setback writer is city-scoped, conformant, no apply.

P5 family zero: `meaningShaped` looks caller-declared from `conformant.mjs`. Implementer must enumerate call sites. Fourteen families extend the walk. Poison fixtures stay.

## Next

Adversarial review of each handback and the write path. Then CP2/CLOSE. Commits only after that review.
