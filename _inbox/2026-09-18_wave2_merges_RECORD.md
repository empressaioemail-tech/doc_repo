---
id: 2026-09-18_wave2_merges_RECORD
title: Wave 2 lane PRs reviewed and merged by the integration seat, 2026-09-18 evening
date: 2026-09-18
last_updated: 2026-09-18 (20:30Z)
status: done for the ten PRs below; the rest of the queue waits on lane closes or on the written factory order
kind: seat record
owner: nick
maintained_by: integration seat
programs: [OPS-24, OPS-16]
plan_rows: [P-353, P-339, P-341, P-354, P-270, P-334, P-329, P-330, P-362, P-358]
snapshot: hauska-map main b08f4b89, hauska-factory main 6f422f6c, legacy-design-tools main bb3b5d06, hauska-engine main cff8d882; doc_repo main d8c78117 plus uncommitted seat edits; read 2026-09-18 20:30Z
related:
  - _inbox/2026-09-18c_HANDOFF_integration_seat.md (the queue this works)
  - _inbox/2026-09-18_phase0_closeout_REGISTER.md
---

# Wave 2 merges, 2026-09-18 evening

Every PR below was merged by squash with `--match-head-commit` set to the head that was reviewed,
and only when its checks were green against the base it merged into. When a merge moved a repo's
main, the next PR in that repo was updated onto the new main with `gh pr update-branch` and merged
only after its checks re-ran green there. Each diff was read at source before merging; each lane's
close was read first. The closes that lived only in seat worktrees or on `origin/lane/*` branches
were copied to `_inbox` and verified identical (byte compare for worktree copies, git blob hash for
branch copies).

## Merged

| Repo | PR | Row | Reviewed head | Base at merge | Merge commit | Merged (UTC) |
|---|---|---|---|---|---|---|
| hauska-map | #423 | P-353 | `b5ae5ce2` | `163fde32` | `0ac74348` | 19:27:54 |
| hauska-map | #422 | P-339 (map half), P-341 | `372fb94f` | `0ac74348` | `d582e0b3` | 19:33:44 |
| hauska-map | #421 | P-354 (map half) | `eaaa955a` | `d582e0b3` | `b1b67641` | 19:36:49 |
| hauska-map | #424 | P-270 address half (map) | `4692dfe6` | `b1b67641` | `b08f4b89` | 19:45:04 |
| hauska-factory | #183 | P-334 | `45cb2e94` | `0f4558a4` | `5ead5564` | 19:32:04 |
| hauska-factory | #184 | P-329 | `1a66e7a1` | `5ead5564` | `dec5493e` | 19:35:40 |
| hauska-factory | #185 | P-330 | `a6776d39` | `dec5493e` | `6f422f6c` | 19:43:03 |
| legacy-design-tools | #722 | P-362 | `0116b3c6` | `25d1782f` | `85c63841` | 19:34:41 |
| legacy-design-tools | #721 | P-270 address half (LDT) | `1a8ada2f` | `85c63841` | `bb3b5d06` | 20:00:33 |
| hauska-engine | #476 | P-358 | `c08b68b4` | `c41a1482` | `cff8d882` | 19:50:19 |

#722's `Test` job was red on its first run with Postgres `53200 out of shared memory` in
`lib/cad-ingest`'s integration test, a file P-362 does not touch; the sibling PRs #720 and #721
passed `Test` on the same base. One re-run of the failed job passed, and the merge followed that.

The factory order in the handoff puts P-333 before P-334/P-329/P-330. P-333 has not closed (its
worktree holds only a CP1), and the P-334 lane measured its three file sets as disjoint from every
open factory PR, so the order was about deploys, not conflicts. The three merged first. Nothing in
the factory was deployed.

## Findings from review, none blocking, each recorded against its row

| Row | Finding |
|---|---|
| P-353 | `parcel-lookup.ts`: after the envelope ladder fails, `if (miss)` replaces the ladder's reason for EVERY class, including `no-hit`. The comment says only `coverage_check_unavailable` does. The behaviour is defensible (the situs index answered, so "no parcel in our records matches" is true); the comment is wrong. |
| P-353 | A cortex outage on `/api/pe-situs-search` now returns HTTP 200 with `coverage_check_unavailable` and a named reason instead of a 502. Anything that pages on that route's 5xx stops firing; the lane found no monitor configured. Operator decision recorded in the lane close. |
| P-339 | The new panel sentence says "the outline is drawn for reference by the drawing route" without the route's answer as an input. Measured true on 4 of 4 parcels by the lane; wrong on any parcel where the route declines. Belongs to the P-339 follow-up. |
| P-339, P-340 | NOT IMPLEMENTED by the lane: P-339's MCP half (legacy-design-tools `parcelDrawEnvelopeModel.ts` collapses modelled, declined and unreached into `null`, so the MCP draw serves `atom_path_pending` beside a ruled table) and all of P-340. The repair is designed in the lane close's `leave_behind[0]`. Needs a dispatch. |
| P-341 | `positive()` treats a 0 percent limit as not applicable, so a 0 percent watershed fact would let the looser zoning figure govern alone. Degrades to the pre-P-341 state rather than fabricating a value, but it collapses zero into absent. |
| P-354 | `todayIso()` is the UTC date. On the evening before an effective date (Texas time) a rule reads as in force about five hours early. Map and LDT both. |
| P-270 | Composer city test is a substring match (inherited): a street named after its own city ("100 AUSTIN AVE") drops the city. The baked card-model path composes a city-limits city into the line without the "city whose limits contain this parcel" label the fact-sheet path adds. |
| P-330 | The exit-code mapping is global, so a declared job that throws `COUNTY_NOT_IN_SCOPE` for some other reason late in a run would also be continued past. |
| P-358 | `resolveEtjDetermination`: a reading declared `conflicting` without a conflict body, beside a city-limits reading that is not `incorporated`, falls through to `present` and silently drops the declared conflict. `composeConflict` defaults the ETJ source to `tx_etj_boundary` when no fact is present. Both reachable only for the bare-string or bodiless cell shapes the lane asked to reconcile against P-336. |

## Still open in the queue

| Repo | PR | Row | Why it waits |
|---|---|---|---|
| legacy-design-tools | #720 | P-354 (LDT half) | reviewed; re-greening on `bb3b5d06` after #721 merged |
| hauska-factory | #186 | P-333 | lane not closed (CP1 only) |
| hauska-factory | #181 | P-352 | lane not closed (CP1 only) |
| hauska-factory | #182 and engine #474 | P-361 | lane not closed |
| hauska-factory | #180 | P-336 | closed; the written order puts it after the P-300/P-338 writer half, which is not fired |
| hauska-factory | #179 | P-354 (factory half) | read against P-363 and the P-300 writer before merging; neither has a PR |
| hauska-setback-corpus | #11 | P-354 (corpus) | publish 1.5.0 and the consumer pin bumps go together, after #179 |

## The probe patch P-270 handed back

`_inbox/2026-09-18_p270-address-half_probe.diff` (sha256 `dda93446`) did not apply as filed: it was
saved with a UTF-8 BOM and CRLF endings, and nine em dashes and ellipses in its added comment lines
had been re-encoded as `ΓÇö` and `ΓÇª`. Normalised to LF without the BOM and with the two characters
restored (only in added lines; zero in context lines), it applied strictly against the exact base
blob it names (`4b27d9bd`). `scripts/surface-probe.mjs --self-test`: 285 of 285 before, 310 of 310
after. Verified by violation: a copy with `addressCarriesLedgerLine` forced to PASS fails 14 checks
and exits 1; the copy was deleted afterwards.
