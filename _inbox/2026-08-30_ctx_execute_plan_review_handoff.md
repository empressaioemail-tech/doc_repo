---
id: 2026-08-30_ctx_execute_plan_review_handoff
title: Handoff — review agent grades the written execute-waves plan and the board
date: 2026-08-30
status: handoff
to: review agent (adversarial plan + board review only)
from: integration seat, P:/doc_repo main
plan_row: F-01, F-06, F-08, F-11, F-18, P-09, P-11, P-17
parent: _inbox/2026-08-30_ctx_execute_waves_WDLL.md
operator_go: review the written plan and the canvas; do not fetch, apply, bake, or deploy
snapshot: integration P:/doc_repo; prior collect review refused; P0 claimed landed; Wave R paused; no jobs started
---

Filed: 2026-08-30
From: integration seat (P:/doc_repo)
To: review agent
Re: Grade the written P0–P8 plan and the operating board. No misses.

Copy everything below the rule into the review agent.

---

You are an adversarial review agent. You review what is written. You do not execute it. You do not fetch GIS. You do not apply 0005. You do not start a Factory job. You do not bake. You do not commit. You do not rewrite the program. You return a graded finding.

The last review of this thread refused the collect card as a specification wearing a schedule's clothes. Integration then restamped the schedule as P0–P8, claimed P0 landed, and restamped the canvas. Your job is to say whether the written plan and the board actually absorbed that review, or whether they restated it and left the same defects in other files.

A review that agrees with the planner's summary without opening the files is a miss. The files are the subject. The chat is not.

Seat: read-only against product repos. Writes allowed only to `_inbox/2026-08-30_ctx_execute_plan_review.md`. If you cannot write there, return the review in chat and stop. Do not write `_state/property/STATE.md`. Do not edit the plan, the canvas, OPS-1, or MEMORY.md. Subagents do not commit. If you fan, you read their diffs; you do not take their verdict.

Declare snapshot in the first paragraph: repo, branch, commit. If you are not on `P:/doc_repo` `main`, stop and say so.

# Why this review exists

Operator asked for no misses before anyone cuts Click 2 (P1 + alias seed + P2b). The prior review's authority is already filed. Do not re-derive the owe table from memory. Re-read the review, then ask whether the new cards and the board still contradict it, still schedule a damaging action, or still claim a control that cannot fail.

# Read in this order. Do not skip. Do not skim a heading and move on.

## Prior authority (the review this plan claims to absorb)

1. `_inbox/2026-08-30_ctx_w3_collect_review.md` (formal refuse)
2. `_inbox/2026-08-30_ctx_w3_collect_amendments.md` (A1 through A12 + automation sequence)
3. `_inbox/2026-08-30_ctx_road_to_prod_accurate.md` (P0–P8 map, four-state contract, six failure modes)

## The written plan (the subject)

4. `_inbox/2026-08-30_ctx_execute_waves_WDLL.md` (operating card; P0 item 1 graded met)
5. `_inbox/2026-08-30_ctx_chew_next.md` (order only)
6. `_inbox/2026-08-30_ctx_parallel_waves.md` (short map; claims Band C / Band 1 retired)
7. `_inbox/2026-08-30_ctx_w3_collect_WDLL.md` (amended specification; still live in the repo)
8. `_inbox/2026-08-30_ctx_w3_rail_inventory_WDLL.md`
9. `_inbox/2026-08-30_ctx_facts_complete_WDLL.md` (waves short form + amendment 6)
10. `90_operations/OPS-1_texas_source_registry.md` (A12 correction; city limits + county boundaries)

## The board (the other subject)

11. `C:\Users\cente\.cursor\projects\p-doc-repo\canvases\factory-and-texas-complete.canvas.tsx`

Read the source. Do not review a screenshot. Land view, overview cards, residue table (`CTX_RESIDUE`), waves (`CTX_WAVES`), lanes (`CTX_LANES`), `DONOT`, LEFT items P-09 / P-11 / P-24, footer, SNAPSHOT string.

## Standing law (do not relitigate)

12. `_decisions/2026-08-30_ctx_complete_or_absent.md` (A-028)
13. `_decisions/2026-08-30_ctx_one_more_bake.md` (A-027)
14. `_STATE.md` standing decisions only
15. `90_runbooks/DEV_PROCESS.md` (an instrument's exclusion set is part of its contract; a gate that cannot fire is not a gate)

Product-repo reads, only if a plan sentence requires them, and read-only:

- Factory worktree `P:/seat-worktrees/property/hauska-factory-ctx-publish`: `migrations/0005` seed rows; `src/jobs/atoms-writer-job.mjs` hardcoded CAD path; `factory-conformant` county default.
- Engine `write-utility-easement-county.mjs` live REST.
- LDT `SETBACK_TABLES` for Austin / Kyle / Georgetown / Round Rock.

If you cannot open a worktree, write UNMEASURED and the path. Do not guess that the planner's claim is still true.

# Decisions already reached (do not relitigate)

1. Factory L2 collect then L3 atomize. Spine stays. The old Band C / Band 1 order does not.
2. Complete = value / absent-verified / not-applicable / refused, each with proof. Unmeasured is not complete.
3. Seed stays. No `prop_id` join on 48209 / 48491.
4. P-80, F-09 217, F-10 254, scllr, Harris PBF stay out.
5. No laptop ingest. No Wave R until P5 can fail and P6 staging walks pass.
6. P-50: serve `wellFact` from `well-fact` atoms only.
7. Do not apply 0005 as drafted. Do not re-run `landing-import`. Do not run F-18 while it defaults to 48021.
8. Setbacks, edges, envelope are city-scoped. Unincorporated is `not-applicable`, not owed work.
9. Writers read `neondb`. Factory L2 copy has zero readers unless a later card retargets them.

Owner: operator. Reversal of any of these is an amendment, not a review finding.

# Your job

Return `_inbox/2026-08-30_ctx_execute_plan_review.md` with:

- **Verdict:** approve / approve-with-amendments / refuse. One sentence on why.
- **P0 claim.** Item 1 on the execute-waves card is graded met. Confirm or refuse that grade with file evidence. A reader of tracked canon must not still be able to owe county-wide setbacks or schedule 0005 / landing-import / F-18-as-is.
- **A1–A12 absorption table.** One row per amendment. Absorbed in the operating card / still only in the review / contradicted by a live file. Cite path + sentence.
- **Road-to-prod six failure modes.** For each, does the written plan still permit it.
- **Canvas vs cards.** Every load-bearing number and every Do-not on the Land view must match the operating card. List mismatches. A board that still says Band C, or still schedules C-count, or still omits a damaging action from DONOT, is a miss.
- **Chew-next vs execute-waves vs road-to-prod critical path.** If the three files disagree on order, that is a finding. Name the sentence.
- **Per execute-waves acceptance item (1 to 10):** specified well enough to grade later, hole, or contradiction. Item 1 is the only one that may already be met.
- **Falsifiers** below, each scored hold / fail / not-applicable, with the command or file you used.
- **Amendments required before Click 2**, each with one-line reason. If none, say none and name what you violated to believe that.
- **leave_behind:** none, or named holes that are not this card.

Do not rewrite the WDLL in place. Proposed patches stay in the review file.

# Pre-registered falsifiers

State what result would prove the written plan or board wrong. Then look for that result. A convenient pass is a reason to distrust the instrument.

1. **Poison schedule still live.** Grep the seven plan files plus the canvas for: `Apply 0005`, `0005 applied`, `re-run landing-import`, `re-runs factory-landing-import`, `Band C`, `Band 1 apply`, `Start together after this card is approved`, `Zero FIPS gets coverage-absence`, `county-wide setback`, `owe setbacks on the six`. Fail if any of those still instruct an agent to do the thing. A historical mention inside a Do-not or a review citation may hold; an imperative in an operating card or canvas lane table fails.

2. **P0 met is ceremonial.** OPS-1 still contains an unstruck "zero rows / no adapter" line that a fresh agent would cite. Or the collect WDLL still tells an agent to apply 0005 / re-run import as a next step. Or W3 inventory still owes county-wide setbacks. Fail if any of those are true. Item 1 cannot be met.

3. **A12 only half-done.** OPS-1 city-limits / county-boundaries correction exists, but another tracked canon file still asserts those tables are empty. Fail if you find one. Search `90_operations/`, `_inbox/2026-08-30_ctx*`, and MEMORY.md.

4. **72 cities named as a number only.** A3 required the 72 enumerated from `texas_roster_v1` with an area threshold. Fail if the operating card says 72 and no file lists them, and the roster query is not named as a remaining P0 hole.

5. **City selection still inverted.** Plan or canvas still treats Cedar Park as a setback priority and omits Leander / Taylor, or still names the old 9-city set as the work. Fail if found.

6. **Four-state contract absent.** Execute-waves "done looks like" drops `not-applicable`, or still lets `absent-verified` count when `asOf` is the request clock or `basis` is character-identical across parcels. Fail if the accuracy rule from road-to-prod is not in the operating card.

7. **Critical-path drift.** Execute-waves puts alias after P1 and P3 after alias-seed-start. Amendments Phase 0 put unincorporated absence in canon/minutes (no code). Chew-next puts P3 at Click 4 after the job template. Fail if a fresh agent could start P3 before the alias table exists and write city-keyed absence against `breadth_*` strings, or could delay the alias table until P4.

8. **P3 overclaims.** The card treats adding three `not-applicable` rows as converting 826,569 parcels without naming who writes those rows, which store they land in, or what serves them. Fail if P3 has no writer, no store, and no serve path, and is still called cheap and done-looking.

9. **Gate still unreadable.** A7: collect-complete lives in `_inbox/` or a file no job image contains, and `import_ledger` still has zero SELECTs in a gating position, and the routing pin is still unconsumed, and P4/P6 still claim a job will refuse without the record. Fail if the plan asserts the gate without moving it.

10. **Writer job still assumed.** Plan says P4 apply after P2 allowlist, but still talks as if `well-fact` / footprint / F-18 / F-11 already run as Cloud Run jobs. Fail if Click 5 can be read as "schedule the existing jobs" rather than "jobs do not exist until P2".

11. **0005 split unspecified.** A1 required drop four false absences, `probed_at` NOT NULL on absence, alias DDL retargeted at bake `neondb`. Fail if the operating card only says "do not apply 0005 as drafted" and never says what replaces it, and Click 2 could still apply the unsplit migration.

12. **Placeholder + derived-without-input dropped from P5.** A11 and McLennan 65,814 envelopes-over-zero missing from execute-waves P5 / P4. Fail if they appear only on the canvas or only in the review.

13. **Zoning stamps and roads homeless.** A10. Fail if either rail is missing from execute-waves measured-owe table and from chew-next and from the canvas residue home.

14. **Canvas leftover schedule.** Land view, overview, LEFT, DONOT, residue `next`, or footer still uses Band C / Band 1 / Band 0 as an instruction, still schedules C-count, still says six-county well/footprint apply, or still omits the three damaging actions from DONOT. Fail on each instance. Quote the string.

15. **Number drift.** 154,841 / 826,569 / 624,141 / 158,573 / 981,410 / 72 / five-county wells / 53,841 / 35,269 / 981,620 / 188,103 / 65,814 / 48,441 disagree between execute-waves, chew-next, W3 inventory, road-to-prod, and the canvas. Fail each mismatch. Do not re-query the store unless a number has no citation; if you cannot verify, mark UNMEASURED, do not invent a replacement.

16. **Absence without a probe still scheduled.** Any live instruction writes `kind='absence'` or county-absence without a named probe. P3 unincorporated `not-applicable` may hold if the mold (counties do not zone) is cited as the second derivation. A city absence without a probe fails.

17. **Publish-before-P5 still reachable.** A path from Click 2 language, canvas "this bake", or facts-complete title still lets an agent start Wave R after W1 merge or after six staging walks that use the current `hasKeyPath`. Fail if found.

18. **#310 or a PR treated as customer-done.** Canvas, chew-next, or execute-waves still grades PE or Walk from a merged PR. Fail if found.

19. **Walk cannot fail, plan trusts it anyway.** P1 does not name `hasKeyPath` accepting null, or P6 still treats a current-image walk as evidence. Fail if P1's exit gate can be satisfied without replacing that predicate.

20. **Do-not only in one file.** A damaging action is forbidden in execute-waves and permitted or implied in collect WDLL, facts-complete, or the canvas. Fail. The collect card is still in `_inbox/` and a fresh agent will open it.

Score each: hold / fail / not-applicable. Name the grep, read, or count you used. A falsifier you did not run is itself a miss; list it.

# Open questions to answer, not to invent

1. Is P0 actually closed, or did integration grade item 1 met while collect WDLL + canvas leftovers still carry the old schedule? Answer from files.
2. Does the operating card inherit the four-state proof rules (`asOf` at evaluation time; `basis` differs between parcels), or only the four words?
3. Where does the 72-city list live after P0? If nowhere, is that a P0 miss or a named P2/P4 item?
4. Is P3 a code change (writer + serve) or a canon sentence? The chew sheet calls it cheap. Cheap and unserved is the original defect class.
5. Does Click 2 start alias on the Factory store, bake `neondb`, or both? A1 said alias DDL on bake `neondb` or the path stays starved. If the plan does not pick, that is a hole before Click 2, not a later detail.
6. Which file is the single operating card if the three order files disagree? If you cannot name one, refuse.

If you cannot answer from a file, write UNMEASURED and the file you would need.

# How to run this so you do not miss

1. Read the three authority files first. Write a six-line restatement of A1–A12 and the six failure modes in your own words before opening the new cards. If your restatement disagrees with a later sentence, the later sentence is the finding.
2. Grep before you conclude. Run the poison list in falsifier 1 against `_inbox/2026-08-30_ctx*` and the canvas. Paste the hits you judged hold vs fail.
3. Read the canvas as code. Search `Band C`, `Band 1`, `Band 0`, `C-count`, `landing-import`, `0005`, `six-county`, `county-wide`. The Land view is not enough. LEFT, DONOT, overview, residue, waves, lanes, footer.
4. Diff the three order files by phase. A table: phase, execute-waves, chew-next, road-to-prod, canvas CTX_WAVES. Any cell that disagrees is a row in the review.
5. Do not treat "Do not apply 0005" as absorption of A1. Absorption is the split: dropped seeds, `probed_at`, store target.
6. Do not treat a number that appears in three files as verified. Treat it as copied. The citation is the review or the store. If the review is the only source, say so.
7. Pre-register, for your own checks, what result would prove you wrong. If no result would, it is not a check.

# Artifacts

| File | Role |
|---|---|
| `_inbox/2026-08-30_ctx_execute_waves_WDLL.md` | Operating card under review |
| `_inbox/2026-08-30_ctx_chew_next.md` | Order sheet under review |
| Canvas Land + overview | Board under review |
| `_inbox/2026-08-30_ctx_w3_collect_WDLL.md` | Amended spec; still a miss surface |
| This file | Your brief |
| `_inbox/2026-08-30_ctx_execute_plan_review.md` | Your return (you write this) |

# Stakeholder updates

None from you. Operator sees the verdict before Click 2.

# Context you inherit

- Operator paused. Card H still serves `sha256:7bef3ce7`.
- Factory #37 and LDT #554 are PRs, not a publish image.
- PE `62a5ec5` / #310 is not customer-done.
- Situs-extend is off. Seed stays.
- Subagents do not commit.
- Deploys are planner-owned; you are not deploying.
- `--self-test` must not overwrite `_inbox/2026-08-30_ctx_w0_residue_recount.json`.

# Do not

- Fetch, ingest, `--apply`, migrate, bake, publish, or deploy.
- Edit the plan, the canvas, OPS-1, or MEMORY.md.
- Lift the seed or invent P-80.
- Re-run `landing-import` or apply 0005 to "check" the review.
- Treat schema as landing.
- Treat a merged PR as done.
- Open another seat's dirty worktree and write.
- Restart scllr or Harris PBF.
- Promote a finding from chat memory. If it is not in a file you read this session, it is UNMEASURED.

# Done looks like (this review)

A file a second reader can use to approve or refuse Click 2 without re-deriving the program. Every fail cites a sentence in a named file and the authority it contradicts. Every pass names the falsifier you tried. If you found nothing, you missed; say what you violated looking for a miss and what would have counted.
---
