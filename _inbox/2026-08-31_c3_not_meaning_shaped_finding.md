---
id: 2026-08-31_c3_not_meaning_shaped_finding
title: C3 is internal consistency, so its future PASS will not mean landUse is correct
date: 2026-08-31
status: confirmed
plan_row: F-08
owner: property seat (Gate 8)
source: P5-SCRUB CP2 observation; violation run 2026-08-31 on hauska-factory seat/property-ctx-c3-presence
snapshot: Factory PR #47 MERGED as 603c2f91; prior main d93c7b0 (PR #45)
---

# Verdict

**CONFIRMED.** C3 PASSed on a payload where both leaves agreed and both were wrong. The card was right. C3 is internal consistency. A future green C3 after Wave R will not establish that landUse is correct.

Falsifier, stated before the run and in this direction (the convenient result is the one that lets everyone relax):

- If C3 PASSES on agreeing-and-wrong, the finding is CONFIRMED.
- If C3 FAILS on that payload, the card is WRONG (C3 consults something outside the facets payload).

Observed: PASS. Instrument: `test/gate8.test.mjs` test named `C3 FALSIFIER: agreeing-and-wrong payload`. Payload:

```
facets.baseFacts.landUse = "ZZ-NOT-A-CAD-CODE"
landUseFact.state = "present"
landUseFact.landUseCode = "ZZ-NOT-A-CAD-CODE"
```

A second file test showed C3 also PASSES when both leaves are present and disagree (`A1` vs `PDD`). C3 does not compare the two values. It only fails the null/non-null pair and the present-vs-absent-rowState pair. That is stronger than the card needed, and it is still not a second derivation.

# What shipped on this card (cheaper half)

C3 is labelled presence-shaped in Gate 8's own output. Verdict vocabulary is unchanged (`pass` stays `pass`; P4 still reads `dayOne.C3`). What changed:

- `assertC3` stamps `shape: "presence-shaped"` on pass and fail.
- Pass reason is now `payload is self-consistent; does not establish landUse is correct` (was `land-use halves agree`).
- `computeDayOne` emits `dayOneShape.C3 = "presence-shaped"` when graded, and `dayOneReading.C3` carries the pass sentence when C3 is pass. A refused C3 has null shape and null reading.

No second derivation. CAD landUse at source versus served `landUseFact.landUseCode` is its own card.

# What this is not

Not a fix of C3's check. Not a reason to distrust today's C3 FAIL on the live golds. Not a reason to weaken S3. Not P-85.

```
leave_behind:
  - item: C3 second derivation (CAD landUse at source vs served landUseFact.landUseCode)
    owner: unassigned
    plan_row: F-08
```
