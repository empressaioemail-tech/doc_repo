---
id: 2026-08-31_c3_not_meaning_shaped_finding
title: C3 is internal consistency, so its future PASS will not mean landUse is correct
date: 2026-08-31
status: open
plan_row: F-08
owner: unassigned (Gate 8; property seat)
source: P5-SCRUB CP2 observation, _inbox/2026-08-31_p5-scrub_cp2.json; gate record _inbox/2026-08-31_gate8_live_1437_48021.json
snapshot: doc_repo main 952f496; Factory seat/property-ctx-p5-scrub 29bded5
---

# The finding

P5-SCRUB was told to cite C3 rather than re-derive it, and while doing so it read
what C3 actually checks. C3's own reason string names it:

> `landUseFact.landUseCode is non-null while baseFacts.landUse is null (internal consistency)`

Both leaves come from **one facets payload, from one upstream**. Under the
enforcement rule that governs this operation, two fields from one payload from one
upstream are **one derivation, not two**. The test is whether one party acting
alone could satisfy both sides, and here it plainly could.

So C3 is an internal-consistency check. It catches transcription errors inside a
payload. It cannot catch a wrong source.

# Why this matters later rather than now

C3 currently FAILS on all three golds, and the failure is real, so nothing about
today's reading is wrong. The problem is the converse, and it arrives on a
schedule:

**When Wave R re-bakes and C3 flips to PASS, that PASS will not establish that
landUse is correct.** It will establish that the payload agrees with itself. An
upstream that populates both leaves consistently and wrongly passes C3 exactly as
cleanly as a correct one.

C3 sits in Gate 8. Gate 8 is the gate that unblocked P4 and is scheduled to gate
P7. The moment C3 goes green, someone will read it as "the landUse defect is
fixed," because that is what it will look like and because the landUse fix
(LDT #566, `1d10024f`) will genuinely have landed in the same window. Two true
statements will combine into an unearned third.

This is the same defect family as P5-SCRUB's family zero, one layer out. Family
zero found `meaningShaped` being passed as a caller literal beside `evidence.pass`.
C3 is a check whose two halves come from one payload. Same shape, different floor.

# What this is not

Not a reason to distrust the current C3 FAIL. A presence-shaped check that fires is
still evidence of the thing it fired on.

Not a reason to weaken or remove C3. It catches a real class.

Not P5-SCRUB's to fix. The lane was explicitly told not to split that payload into
two S3 sources and it correctly did not. It reported and moved on, which is why
this card exists instead of a silent scope creep.

# What would close it

C3 needs a **second independently derived input** before its PASS is load-bearing.
The candidate is the CAD landUse value at its source, compared against the served
`landUseFact.landUseCode`, rather than the served pair compared against itself.
Where no second derivation exists, construct one rather than weakening the check.

Until that lands, C3 should be recorded in Gate 8's own output as
presence-shaped, so a green C3 reads as "the payload is self-consistent" and not as
"landUse is correct." That is the cheaper half and it can ship first.

**Verify by violation:** feed C3 a payload where both leaves agree and both are
wrong. If C3 passes, the finding is confirmed. That check has not been run and
should be the first thing this card does.

```
leave_behind:
  - item: C3 second derivation, or an explicit presence-shaped label in gate output
    owner: unassigned
    plan_row: F-08
```
