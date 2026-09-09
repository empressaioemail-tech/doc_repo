---
id: 2026-09-09_hays_2026_cad_roll_is_incomplete_finding
title: Hays' 2026 CAD roll is 21.8 percent smaller than its 2025 roll, and it is the only county that shrank
date: 2026-09-09
last_updated: 2026-09-09
status: resolved
applies_to: hauska-factory
plan_rows: [P-124]
seat: integration (doc-repo-79)
severity: blocking
snapshot:
  store: f06-staging-neondb
  measured_at: 2026-09-09T13:40Z
related:
  - _inbox/2026-09-09_ctx-retire_close.json
  - _inbox/2026-09-09_ctx-hays_acquisition_mechanism_resolved_finding.md
resolution: >
  2026-09-09, seat property (fix/ctx-hays-2026-cad-reacquire). The "Not established" and "Open" sections
  below are resolved: mechanism B, not A -- three independent source recounts of Hays CAD's own 2026
  exports (a 5-month span, two schemas) converge on ~134,600 accounts; re-acquiring under the current
  source does not change the count (the freshest available drop is 15 rows SMALLER). Full evidence in
  _inbox/2026-09-09_ctx-hays_acquisition_mechanism_resolved_finding.md and
  _inbox/2026-09-09_ctx-hays_cp1.json. Per this dispatch's own instruction under mechanism B: STOPPED,
  no re-acquire/apply/bake/backfill performed, handed back for an operator ruling. Also resolved: the
  172,116 2025 baseline used above is itself a CAD export padded with a non-CAD StratMap parcel-geometry
  fallback (see the resolution doc) -- not a clean single-source count. Additionally found: 48113
  (Dallas) and 48439 (Tarrant) carry the same latent smaller-prior-vintage shape as Caldwell, not
  previously named.
---

# Hays' current CAD vintage does not cover the county

## How it surfaced

The Hays staging bake refused `CADROLL_RENULLED` -- the cadRoll post-condition, which refuses
when more than 2 percent of a county's tier1 rows carry no dollar object. Measured:

    Hays tier1   total 173,050   with dollars 134,606   miss rate 22.22%

`134,606` is not an approximation of anything. It is EXACTLY the number of distinct parcels on
Hays' 2026 CAD roll. Every parcel on the current roll got its dollars; every parcel that exists
only on the 2025 roll did not.

## The measurement that isolates it

Current-vintage coverage across all six counties:

    county       rolls held                     current vintage   vs prior
    Bastrop      2025 = 77,799                  2025  77,799      single vintage
    Caldwell     2025 = 24,989  2026 = 48,382   2026  48,382      GREW (2025 was partial)
    Hays         2025 = 172,116 2026 = 134,606  2026  134,606     SHRANK 21.8 percent
    McLennan     2025 = 114,255                 2025  114,255     single vintage
    Travis       2025 = 380,918 2026 = 492,848  2026  492,848     GREW
    Williamson   2025 = 282,570 2026 = 319,480  2026  319,480     GREW

**Hays is the only county whose current roll is smaller than its prior roll.** Every other county
either holds a single vintage or a growing one. That asymmetry is the finding.

## Why this is an acquisition gap and not roll churn

A county does not lose 21.8 percent of its accounts in one year. Caldwell's own dropout
population -- the one CTX-RETIRE was built for -- is 267 parcels, about 0.5 percent of a roll that
GREW, which is the shape real churn takes: splits, merges and renumbering against a larger base.

Hays shows the opposite shape. 37,510 accounts present in 2025 and absent in 2026, against a base
that shrank. The parsimonious reading is that the 2026 acquisition for Hays did not complete, not
that a fifth of Hays County stopped existing.

**Not established:** whether the 2026 ingest failed partway, was filtered, or was never run to
completion. That needs the acquisition-side record, which this seat has not read.

## Why the gate was right to refuse

Had `MAX_MISS_RATE` been relaxed to let Hays through, the county would have published with 38,444
parcels carrying no market value, assessed value, land value or improvement value -- silently, on
a customer surface. The 2 percent ceiling is doing exactly the job it was built for, and it caught
a data problem that no code change should paper over.

This is the second time in this program a threshold has been the thing standing between an
incomplete acquisition and production.

## Consequence

Hays cannot publish until its 2026 roll is complete, or until a deliberate ruling says the county
should be baked from the 2025 vintage instead. Both are acquisition/operator decisions, not code.

Bastrop and McLennan are unaffected -- single vintage, nothing to drop out of. Travis and
Williamson grew, so their dropout populations are churn-shaped and covered by CTX-RETIRE's
`recordRetirement`.

## Open

Whether Hays' 2026 CAD acquisition failed, was filtered, or never ran. Unread.

Whether to re-acquire 2026 or bake Hays from 2025 as a declared older vintage. Operator call. The
second option needs the retirement/vintage machinery CTX-RETIRE just built to run in reverse and
is probably worse than re-acquiring.

Whether any other county's roll has a partial vintage that happens not to be the current one --
Caldwell's 2025 at 24,989 against a 48,382 roll is exactly that shape, and it is harmless today
only because 2026 is the one being read.
