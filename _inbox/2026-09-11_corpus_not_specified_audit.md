---
title: setback-corpus not_specified carries two different meanings
date: 2026-09-11
status: active
owner: integration
plan_row: P-133
---

# `not_specified` is two flags wearing one name

## Snapshot

Corpus repo `empressaioemail-tech/hauska-setback-corpus` at main `b8020c8b` (2026-09-07),
`package.json` version `1.1.0`, matching the version OPS-21-S2 consumed. Read from the repo,
not the published npm tarball; re-run against the tarball if those diverged after publish.

Instrument `scripts/corpus_not_specified_audit.py`. It compares the FLAG against the VALUE it
sits on, then takes a second derivation from the distribution of that value across sibling
districts in the same jurisdiction and field, which separates a placeholder from a
transcription without relying on a magic-number list. Six self-tests including a negative case
and a not-vacuous case run before any corpus number prints.

## Finding

OPS-21-S2 read `provenance.<field>.not_specified` as an earned absence and wrote
`absent-verified` wherever it is set. The flag does not carry one meaning. It carries two, and
S2's reading is correct for the larger one.

    
    flagged slots examined: 329  across 35 (jurisdiction, field) groups
      SENTINEL_UNIFORM       225
      SENTINEL_SUSPECT_IN_MIXED_GROUP 32
      REAL_VALUE_FLAGGED     72
      AMBIGUOUS_SINGLETON    0
      HONEST_ABSENCE         0
    
    FALSE-ABSENCE population (flag on a transcribed value), by jurisdiction and field:
      san-antonio-tx               max_height_ft          SENTINEL_SUSPECT_IN_MIXED_GROUP 17
      liberty-hill-tx              max_height_ft          REAL_VALUE_FLAGGED   13
      austin-tx                    max_height_ft          REAL_VALUE_FLAGGED   9
      austin-tx                    max_lot_coverage_pct   REAL_VALUE_FLAGGED   9
      kyle-tx                      max_lot_coverage_pct   REAL_VALUE_FLAGGED   9
      pflugerville-tx              max_height_ft          REAL_VALUE_FLAGGED   7
      cedar-park-tx                max_height_ft          SENTINEL_SUSPECT_IN_MIXED_GROUP 6
      dripping-springs-tx          max_lot_coverage_pct   REAL_VALUE_FLAGGED   6
      taylor-tx                    max_lot_coverage_pct   REAL_VALUE_FLAGGED   5
      lockhart-tx                  max_height_ft          REAL_VALUE_FLAGGED   4
      lockhart-tx                  max_lot_coverage_pct   SENTINEL_SUSPECT_IN_MIXED_GROUP 4
      san-antonio-tx               max_height_ft          REAL_VALUE_FLAGGED   4
      cedar-park-tx                max_height_ft          REAL_VALUE_FLAGGED   3
      lockhart-tx                  max_height_ft          SENTINEL_SUSPECT_IN_MIXED_GROUP 3
      lockhart-tx                  max_lot_coverage_pct   REAL_VALUE_FLAGGED   3
      liberty-hill-tx              max_height_ft          SENTINEL_SUSPECT_IN_MIXED_GROUP 1
      taylor-tx                    max_lot_coverage_pct   SENTINEL_SUSPECT_IN_MIXED_GROUP 1

**Zero honest absences in 329 flagged slots.** If the flag meant "the ordinance is silent" it
would sometimes sit on a null. It never does, under either usage.

**SENTINEL_UNIFORM, 225 slots.** The flag sits on a value identical across every flagged
sibling in that jurisdiction and field: `san-antonio-tx` coverage `{100: 21}`, `leander-tx`
`{100: 17}`, `round-rock-tx` height `{999: 10}`, `elgin-development-code` coverage `{0: 8}`.
Every district in a city carrying the identical number is a placeholder, not an ordinance
finding, and the flag is correctly warning against reading it as a limit. Where the ordinance
genuinely sets no limit, `absent-verified` is the RIGHT cell. **S2's writes here are correct
and must not be remediated.** The separate defect is that a sentinel is stored at all, which
ENFORCEMENT prohibits and which belongs to the corpus owner.

**REAL_VALUE_FLAGGED, 72 slots.** The flag sits on a varied, transcribed value. Austin coverage
runs 35/40/45/50/55/60/70 and height 35/40/60/90; Kyle coverage 50/55/60/65/80; Dripping
Springs 30/40/50/60/65/80. The Austin provenance quote on the flagged fields reads "25-2-492
site-development table: SF-1 row provides the stated base-yard, height, building-coverage, and
impervious-cover values," so the flag contradicts its own citation. In the same record
`front_ft`/`rear_ft`/`side_ft` carry confidence 0.7 with no flag while the flagged pair carries
0.6 on the identical quote, which reads as lower confidence rather than absence. **Every
`absent-verified` written from these 72 is a false absence.**

**SENTINEL_SUSPECT_IN_MIXED_GROUP, 32 slots.** Placeholder-shaped values sitting inside a group
that also holds real ones (`lockhart-tx` coverage `{30: 2, 40: 1, 100: 4}`). Forcing these
either way would overstate. They need the corpus owner, not an inference.

## Classification is per (jurisdiction, FIELD), never per jurisdiction

A city is routinely a placeholder on one field and a transcription on the other.
`san-antonio-tx` is uniform 100 on coverage and varied on height; so are `cedar-park-tx`,
`pflugerville-tx` and `liberty-hill-tx`. Any remediation scoped by city name will be wrong.

## Consequence and scope

S2 merged `88bb03ca`, deployed, and ran `--apply` across 64 cities before this surfaced, then
measured the live population exactly from its own recorded basis: **547,657 cells**
(`maxHeightFt` + `maxLotCoveragePct`, five in-scope counties) written `absent-verified` under
`ENVELOPE_ROUTER_FIELD_NOT_SPECIFIED`, of which `austin-tx` is **313,580**. That total is
correct and independently sum-checked. It is the flag population, NOT the defect population.

The remediation lane must be scoped to the 72 REAL_VALUE_FLAGGED slots plus a ruling on the 32
suspects. **A lane handed all 547,657 would flip roughly 234,000 correct absences into wrong
values, which is worse than the defect it set out to fix.**

## What this needs

A ruling from the corpus owner (property seat) on what `not_specified` was written to mean in
each usage, and on the 32 mixed-group suspects. Then a remediation lane scoped by
(jurisdiction, field) to the REAL_VALUE_FLAGGED set. S2's writes are gated never to regress an
earned value, so a corrected re-run only moves cells still sitting `absent-verified`.

## Live cell counts for the defect population

OPS-21-S2 mapped the per-district classification above onto exact live cell counts from its own
recorded `basis.districtCode`, cross-checked against each district's provenance quote. Its
splits were derived independently of this artifact, from live cells and quotes rather than from
the corpus value distribution, and they match the corpus-derived splits exactly.

```
austin-tx          both fields      313,580 cells   ALL REAL (9 districts, both fields)
liberty-hill-tx    maxHeightFt        3,011 real  +      17 suspect  (matches 13 + 1)
cedar-park-tx      maxHeightFt          153 real  +     948 suspect  (matches  3 + 6)
pflugerville-tx    maxHeightFt        1,504 real  +       0 suspect  (matches  7 + 0)
cedar-park-tx      maxLotCoveragePct      0 real  +       0 suspect  (fully SENTINEL_UNIFORM)
```

NOT YET RESOLVED: `taylor-tx` maxLotCoveragePct, and `lockhart-tx` on both fields. A naive join
from live zoning code to corpus district label undercounts, because live codes do not map one
to one onto corpus labels: Liberty Hill's live `I-1` and `I1` both resolve to a single corpus
district by prefix match. The remediation lane finishes these with
`envelope-corpus-lookup.mjs` against the per-district table above, not with a direct code join.

## Correction history

This artifact's first version reported 329 contradictions. That was wrong: the check treated
any non-null as a real value, so it passed on sentinels, which is the failure ENFORCEMENT names
at "never satisfy a check with a sentinel." Caught when OPS-21-S2 mentioned a "999-sentinel
case" at Round Rock. The corrected instrument discriminates four classes and was re-run from
its tracked path.
