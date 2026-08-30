---
id: 2026-08-30_ctx_w3_collect_review_handoff
title: Handoff — review agent grades the CTX collect-then-atomize plan
date: 2026-08-30
status: handoff
to: review agent (adversarial plan review only)
from: integration seat, P:/doc_repo main
plan_row: F-01, F-09, F-11, F-18, P-09, P-11, P-85
parent: _inbox/2026-08-30_ctx_w3_collect_WDLL.md
operator_go: review the plan; do not fetch, apply, bake, or deploy
snapshot: integration P:/doc_repo; Factory #37 and LDT #554 are PRs; 0005 unapplied; Wave R paused; collect WDLL status draft
---

Filed: 2026-08-30
From: integration seat (P:/doc_repo)
To: review agent
Re: Grade the CTX collect-then-atomize plan before any fetch

# Review handoff: CTX W3 collect plan

You review a plan. You do not execute it. You do not fetch GIS. You do not apply 0005. You do not start a Factory job. You do not bake. You do not commit. You return a graded finding against the cited cards, not a rewritten program.

Seat: read-only against product repos. Writes allowed only to your own review artifact at `_inbox/2026-08-30_ctx_w3_collect_review.md`. If you cannot write there, return the review in chat and stop.

## 1. Conversation summary

Central Texas six already serve `node-facets-tier1-conformant-v1` from walked card H publishes (`sha256:7bef3ce7`). Operator locked one more pass, then one production bake (A-027), then reversed rails-out (A-028): complete is a finished dataset or a named honest absence. RRC must surface this pass as `well-fact` atoms. PE never SELECTs `tx_rrc_well` (P-50).

Band 0 code is on remotes (Factory #37, LDT #554). Operator paused. Bake is premature. The next missing piece was a program that collects owed rail data in parallel so it can be atomized. That program is drafted as Factory L2 collect, then Factory L3 atomize. The card is draft. Your job is to break it if it is wrong.

## 2. What you are grading

Primary: `_inbox/2026-08-30_ctx_w3_collect_WDLL.md` (draft).

Must also read, in this order:

1. `_decisions/2026-08-30_ctx_complete_or_absent.md` (A-028)
2. `_inbox/2026-08-30_ctx_w3_rail_inventory_WDLL.md` (what exists vs build vs absence)
3. `_inbox/2026-08-30_ctx_parallel_waves.md` (Band C inserted before Band 1)
4. `_blueprint/20_pipeline.md` (L1/L2/L3)
5. `90_runbooks/factory_1_5_acquisition_staging.md` (slot-free collect; `txgio_parcel` 1-2)
6. `_decisions/2026-08-26_ingest_freeze_and_cloud_loader.md` (no laptop `--apply`)
7. P-50 serve close: `_inbox/2026-08-22_serve-p50_close.json` (never SELECT bake / `tx_rrc_well` for `wellFact`)
8. T3 easement recon: `_inbox/2026-08-05_T3_easement_source_recon.md`
9. Factory band 0 handback: `_inbox/2026-08-30_ctx_factory_band0_handback.md` (schema only; 0005 unapplied)
10. Canvas Land view: `C:\Users\cente\.cursor\projects\p-doc-repo\canvases\factory-and-texas-complete.canvas.tsx`

Read the Factory landing-import list if you open the worktree: `P:/seat-worktrees/property/hauska-factory-ctx-publish/src/jobs/landing-import.mjs` (`LANDING_TABLES` already includes wells, footprint, flood, CAD). Schema parsers: `src/lib/setback-landing.mjs`, `src/lib/easement-gis-landing.mjs`. Do not edit those files.

## 3. Decisions already reached (do not relitigate)

1. Factory is the collector and the atomizer. L2 and L3 are different jobs.
2. Complete = atoms or named honest absence. Zero atoms with no landing count is unmeasured.
3. Seed stays. No `prop_id` join on 48209 / 48491.
4. P-80, F-09 217, F-10 254, scllr, Harris PBF stay out.
5. No laptop ingest. No Wave R until rails are apply-or-absence.
6. P-50: serve `wellFact` from `well-fact` atoms only. Copying `tx_rrc_well` into the facet bake is the same defect class.
7. Clerk-index documents stay P-85. CCN / pipeline are not parcel easement.
8. No invented PDD feet.

Owner: operator. Reversal of any of these is an amendment, not a review finding.

## 4. Your job

Return `_inbox/2026-08-30_ctx_w3_collect_review.md` with:

- **Verdict:** approve / approve-with-amendments / refuse.
- **Per collect-WDLL item (1 to 8):** met as specified, hole, or contradiction. One line of evidence. Cite the file you read.
- **Falsifiers you ran.** A review that only agrees is not a review. Pre-registered below. Score each.
- **Amendments** you would require before operator go, each with a one-line reason.
- **leave_behind:** none, or named holes that are not this card.

Do not rewrite the WDLL unless an amendment is required for go. If you rewrite, keep it as a proposed patch in the review file, not an edit of the draft.

## 5. Pre-registered falsifiers

State what result would prove the plan wrong. Then look for that result.

1. **Collapsed layers.** The card lets one job both fetch REST and write `atoms`. That is the P-85 defect. Pass only if collect lanes write landing (or absence) and atomize lanes are gated on collect-complete.

2. **Already-landed rails re-acquired.** The card tells anyone to re-download TxGIO, NFHL, CAD, wells, or footprints from a laptop or from `lib/cad-ingest`. Pass only if those four are count-or-reimport.

3. **Missing rail vs W3 inventory.** A rail in the W3 table (wells, footprint, flood, CAD leftover, zoning stamps, roads, edges, envelope, setbacks, easement, rail-absence) is neither collect, atomize, parked, nor named out. Pass only if every W3 rail has a home.

4. **P-50 bypass.** Any path copies `tx_rrc_well` or easement landing into `place_layer_snapshots` or PE SELECT. Pass only if the card forbids it and Band 1 still applies atoms.

5. **Silent zero.** A FIPS with zero wells in `tx_rrc_well` can emit a silent 0 atom count and be called complete. Pass only if coverage-absence is required before stop.

6. **Starved gate.** Collect-complete is a human spreadsheet or a "we counted in chat." Pass only if a Factory ledger row (`import_ledger` or named sibling) and a file in `_inbox/` are both required, and Band 1 refuses without the file naming that rail.

7. **Guessed URLs treated as landed.** Round Rock / Cedar Park paths in `easement-gis-landing.mjs` were filled from T3 ellipsis. Pass only if four-point probe is a hard gate before fetch, not a note.

8. **Parallelism illegal.** Two writers on one landing table, two heavy scans on one Neon, or `txgio_parcel` writers above 2. Pass only if the card names those refuses.

9. **Schema claimed as collect.** Factory #37 schema + unapplied 0005 is treated as landing complete. Pass only if item 3 (0005 via migrate job) and items 4 to 5 (ingest counts) are still open.

10. **Scope leak.** The card starts F-09 217, F-10 254, Harris PBF, or clerk-index bulk ingest. Pass only if those stay leave_behind.

11. **Writer wiring vs landing copy.** Engine `well-fact` today reads `neondb.tx_rrc_well`, not Factory `landing_tx_rrc_well`. If the card implies the writer already reads Factory L2, that is a hole. Pass only if collect-complete for wells is a count of the table the writer actually reads, or the card names a writer retarget as extra work.

12. **Setback absence vs Elgin/Bastrop.** Austin / Kyle / Georgetown / Round Rock / Waco are marked absence in the schema without a four-point probe this card. That may be honest or starved. Pass only if the card requires a probe (or cites a dated probe) before an absence row is collect-complete.

Score each falsifier: hold / fail / not-applicable. A convenient pass is a reason to distrust the instrument.

## 6. Open questions to answer, not to invent

1. Does `factory-landing-import` already have a current two-count for `tx_rrc_well` / footprint / flood on the Factory store, or is C-count a required re-run? Read the import ledger if you can without writing. If you cannot open the store, say UNMEASURED. Do not invent a count.

2. Are Round Rock and Cedar Park URLs in the schema the live T3 hosts, or guessed `/arcgis/rest/services/` paths? The band 0 handback already named this as leave_behind.

3. Does Band 1's existing well-fact job exist as a Cloud Run job, or is "Factory job, existing writer" still unwired? A plan that assumes a job image that does not exist is starved.

4. Is 0005 meant for the Factory control store, the bake `neondb`, or both? Alias persist needs the bake neondb. Setback/easement landing is Factory L2. If the card says "Factory store" only, say whether that starves the bake path.

If you cannot answer from a file, write UNMEASURED and the file you would need. Do not guess.

## 7. Artifacts

| File | Role |
|---|---|
| `_inbox/2026-08-30_ctx_w3_collect_WDLL.md` | Plan under review |
| `_inbox/2026-08-30_ctx_parallel_waves.md` | Band C insertion |
| `_inbox/2026-08-30_ctx_w3_rail_inventory_WDLL.md` | Inventory |
| Canvas Land view | Operating board, restamped 11:55-05 |
| This file | Your brief |
| `_inbox/2026-08-30_ctx_w3_collect_review.md` | Your return (you write this) |

## 8. Stakeholder updates

None from you. Operator sees your verdict, then approves or amends the WDLL.

## 9. Context the next agent must inherit

- Operator paused after push. Card H still serves.
- Factory #37 / LDT #554 are not a publish image.
- Situs-extend is off (owner-agree no-go on 48021 / 48055).
- Seed stays.
- Subagents do not commit.
- Deploys are planner-owned; you are not deploying.

## Do not

- Fetch, ingest, `--apply`, migrate, bake, publish, or deploy.
- Edit the collect WDLL in place unless the operator later says to land your amendments.
- Lift the seed or invent P-80.
- Treat schema as landing.
- Treat a zero atom count as collected.
- Open another seat's dirty worktree and write.
- Restart scllr or Harris PBF.

## Done looks like (this review)

A file that a second reader can use to approve or refuse the WDLL without re-deriving the program. Every fail cites a sentence in the plan and the authority it contradicts. Every pass names the falsifier you tried.
---
