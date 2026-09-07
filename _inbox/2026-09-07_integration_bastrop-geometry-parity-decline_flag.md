---
lane: integration
item: "Real, unrelated finding surfaced by preflight check 6 verification: Bastrop geometryParitySample DECLINE"
checkpoint: "Flagged only. Not investigated, not fixed, not this session's to own."
date: 2026-09-07
---

## What happened

While proving `onboard-preflight`'s check 6 (ADR-031 ledger health) end-to-end
against live Bastrop (48021) data, Engine's full 8-check run surfaced a real,
pre-existing decline unrelated to tonight's work: `geometryParitySample`
DECLINEd, defect class `GEOMETRY-DIVERGE`, 1 of 5 sampled parcels diverged
(`48021:104120`).

## Why this is worth a durable flag, not just a passing mention

This portfolio has real, dated history with exactly this defect class:
`_decisions/2026-08-07_envelope_saga_close_and_geometry_law.md` records a
saga where dual geometry sources caused real containment defects (boundaries
off by 0.2-7.6 ft) before consolidation onto one truth frame
(`txgio_parcel`) — the "Geometry Law" that `parcel-node`'s own atom type now
explicitly enforces. A live `GEOMETRY-DIVERGE` finding, even a single
sampled parcel, in Bastrop specifically (the city the Law itself was proven
against) is worth someone's direct attention rather than letting it sit
unactioned, given the history.

## Not done

No investigation into whether this is a real regression, a sampling
artifact, or an already-known, accepted edge case. Not this session's find
to own or fix — surfaced incidentally while verifying unrelated work. Needs
a real owner.
