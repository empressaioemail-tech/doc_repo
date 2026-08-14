---
id: T1_track_status_2026-08-05
title: T1 Data Accuracy — track status (planner pass close)
date: 2026-08-05
status: partial — track acceptance NOT MET
owner: nick
---

# T1 track close report — 2026-08-05

Master planner verification: **TRACK NOT CLOSED.** Heavy-scan slot used for city re-warm apply; post-gates partial. QUEUE rows unchanged pending acceptance.

---

## WS1 — City envelope re-warm (lead exhibit)

| | Before | After |
|---|---|---|
| Cohort processed | 0 re-warm this pass | **5,763** |
| Promoted envelopes | stale 2026-08-03 batch (edge-role bugs) | **2,015** new promotes |
| block13 | 7/7 pre | **7/7 post** (`_inbox/2026-08-05_T1_block13_post_rewarm.log`) |
| Dry-run verifyPass | — | 2,404 |
| Apply promoted | — | 2,015 |

**Match contract: FAIL** (-389 vs dry-run). Artifacts: `_inbox/2026-08-05_T1_city_rewarm_dryrun_summary.json`, `_inbox/2026-08-05_T1_city_rewarm_apply_summary.json`, full logs in `_inbox/`.

**Not done:** Jones/Higgins area-sweep cert (3+ blocks); before/after render pack for operator twelve screenshots; incremental-rewarm reconcile script for dry-run/apply delta.

**Status: PARTIAL**

---

## WS2 — Warden v1.2 envelope-sanity

**DONE.** Engine #256 merged. Checks: containment, area ratio bounds, edge parallelism. Live sweep: 3 `ENVELOPE-SHAPE-ANOMALY` on sample-50 post-rewarm (`_inbox/2026-08-05_T1_warden_post_rewarm.json`). Permanence: OPS-5 + runbook section 4 updated.

---

## WS3 — Stamp40 propagation bake

**NOT APPLIED.** Dry-run recon: 40/40 tier1 stale, 40 atom would-write (`P:/tmp/stamp40-propagation-dryrun.json`). Blocked: no scoped `--prop-ids-file` on tier1/bake CLIs (county-wide ~62k fallback only); heavy-scan freed after WS1 apply.

---

## WS4 — Roster-wide stamp under-coverage sweep

**DRY-RUN DONE.** 23 cities, 0 failures. Artifact: `_inbox/2026-08-05_T1_stamp_roster_sweep.json`. Notable: bastrop-city-tx **5,828** would-stamp; elgin-tx **3,812**; austin-tx **249,078**. Applies **HELD** for master review (blast radius).

---

## WS5 — Seven gap parcels

**RECON DONE.** All 7 district-on-record on `Zoned_Parcels/83`; prior "coverage gap" **stale**. Artifact: `_inbox/2026-08-05_T1_seven_gap_parcels_recon.json`. Next: scoped stamp for 7 (not honest absence).

---

## WS6 — Flag-lot orientation (Mesquite)

**CODE DONE; LIVE VERIFY PENDING.** #258 + #260. Unit tests: 80577/80578 roles fixed. Engine deploy + re-warm or `verify-mesquite-flag-lots.mjs` owed.

---

## WS7 — Small classes

**NOT STARTED.** 48021:29431 R15, Caldwell CAD-vintage (3), cohort-loader-zero open.

---

## WS8 — Elgin parity

**QUEUED** behind WS1 heavy scan (now free). Same `--force-overwrite` treatment required.

---

## WS9 — Corpus unit drift

**RECON DONE.** `_inbox/2026-08-05_T1_corpus_drift_recon.json`. ICC + Grand County skip in local snapshot builds; Bastrop UDC Municode 0-section.

---

## WS10 — ADU answer-quality

**RECON DONE.** `_inbox/2026-08-05_T1_adu_answer_quality_recon.json`. BDC 14.04.006 in prod PG but `currentEditionId` still B3 — retrieval excludes ADU answer. Fix: eval-gated edition flip (not executed this pass).

---

## Warden post-rewarm (sample 50)

| checkId | findings |
|---|---|
| neighborConsistency | 50 (MIXED-VINTAGE-NEIGHBOR) |
| envelopeSanity | 3 (ENVELOPE-SHAPE-ANOMALY) |
| servePathTruth | 50 |
| crossStoreConsistency | 12 |

Expected ~9 neighbor findings after WS3 propagation — **not yet achieved** (propagation not run).

---

## Engine merges this pass

#256 Warden v1.2, #258 flag-lot, #260 block13 regression fix. **Engine deploy owed** before live Mesquite/export benefits on serving revision.

---

## Acceptance checklist (T1 doc)

| Item | Met? |
|---|---|
| Jones/Higgins uniform envelopes + area-sweep 3 blocks | NO |
| block13 7/7 at every data change | YES (pre + post re-warm) |
| Warden ~9 with v1.2 | NO (50 sample; propagation pending) |
| Roster sweep reported | YES (dry-run) |
| 7 gaps resolved/declined | PARTIAL (recon: stamp-miss not absence) |
| Mesquite live correct | NO (code only) |
| ADU answered live | NO (recon only) |
| Backlog updated | PARTIAL (this pass + scratch) |
| Permanence OPS-5 + runbook | YES |

**Verdict: resume WS3 → area-sweep → Elgin → engine deploy → ADU edition flip.**
