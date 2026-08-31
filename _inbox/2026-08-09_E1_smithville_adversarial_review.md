---
id: 2026-08-09_E1_smithville_adversarial_review
title: E1-ADV adversarial review — Smithville corpus fidelity (W5 F2)
date: 2026-08-09
status: complete
owner: E1-ADV-reviewer
related: [_dispatches/2026-08-09_W5_depth_factory_dispatch_pack, _inbox/2026-08-09_E1_smithville_builder_close.json, _inbox/2026-08-09_E1_smithville_preregistered_expectations.json]
---

# E1-ADV — Smithville corpus fidelity (independent review)

**Reviewer:** E1-ADV adversarial sub (did NOT run scrape)  
**Reviewed at:** 2026-08-09  
**Inputs:** builder close JSON, preregistered expectations, proof artifacts at `P:/tmp/tx_scraper_proofs/smithville/`, corpus ingest JSON, stamp dry-run JSON

## Verdicts

| Domain | Verdict | Summary |
|---|---|---|
| **Corpus fidelity (proof wave)** | **PASS** | 836/836 TOC sections, 12,793 proof blocks, harness artifacts 100%/0/0; 10/10 independent span spot-checks pass against on-disk raw HTML |
| **Zoning stamp dry-run** | **BLOCKED (honest-absent)** | Registry `zoning_gis: null`; ldt CLI has no Smithville row — expected Donley-pattern absence, not a corpus defect |
| **Currency / live re-scrape** | **ADVISORY — planner decision** | Proof wave dated 2026-07-30; E1 builder did not live re-crawl. No newer ordinance signal found in registry; refresh optional before prod snapshot commit |

---

## Pre-registered expectation grading

| ID | Check | Result | Independent evidence |
|---|---|---|---|
| E1-1 | 836 TOC sections | **MET** | Parsed `raw/toc.json`: 836 nodes with `type=section`. Matches `fidelity_harness.json` `sectionCountToc` / `sectionCountExtracted` = 836/836 |
| E1-2 | 12,793 NormalizedBlocks (proof) | **MET** | `normalized.json` block array length = 12,793 (reviewer counted via Node). Matches harness + `status.json`. Ingest file `P:/tmp/smithville-normalized-2026-08-04.json` is post-dedup (4,366 blocks, 836 depth-5 sections) — correct ingest path per builder note |
| E1-3 | Fidelity harness 100%, 0 missing, 0 altered; fromRawHtml + fromDecodedCorpus pass | **MET (artifact + spot-check; harness not re-executed)** | On-disk `fidelity_harness.json` and `planner_fidelity_regrade.json` (2026-07-30) both report pass with 0 missing/altered spans. Reviewer could not re-run `planner_b1_fidelity_regrade.mts` — local `hauska-engine` checkout lacks `ecode360-scraper/fidelity.ts` import path referenced by the script. Compensating controls: internal consistency across three artifacts + 10/10 verbatim paragraph span spot-checks |
| E1-4 | Robots compliance; no Chrome-UA evasion | **MET** | `status.json`: `robotsLandingAllowed=true`, `robotsTocAllowed=true`, `rps=0.5`, `headerProfile=Mozilla/5.0 (compatible; PublicLawTextFetcher/1.0)`. Header experiment documents Chrome Sec-Fetch spoof → 403 Cloudflare challenge (rejected). `/SM6484` not in robots disallow list (registry provenance corroborates) |
| E1-5 | Corpus eval 1.0/1.0/1.0 (836-section ingest file) | **MET (scores); PROCESS NOTE** | `corpus_ingest.json`: top3=1.0, sectionNum=1.0, crossRef=1.0 on `P:/tmp/smithville-normalized-2026-08-04.json` (836 sections). Ingest ran before adversarial PASS — procedural ordering violation acknowledged in builder close; scores are valid given fidelity PASS |
| E1-6 | Stamp dry-run MATCH CONTRACT counters | **N/A — BLOCKED** | See stamp section below |

---

## Attack frame results

### 1. Fidelity harness re-run

**Attempted:** `pnpm exec tsx P:/doc_repo/_scratch/planner_b1_fidelity_regrade.mts` from `hauska-engine/packages/corpus`  
**Outcome:** `ERR_MODULE_NOT_FOUND` for `ecode360-scraper/fidelity.ts` (local tree has `ecode360/` adapter only; fidelity module not present at script import path).

**Fallback verification performed:**

- Byte-level count agreement: blocks 12,793; pages on disk 155; headings 1,103; paragraphs 11,690 (matches harness metadata).
- Cross-artifact consistency: `status.json` fidelity block, `fidelity_harness.json`, `planner_fidelity_regrade.json`, and builder close excerpt all agree (836/836, 100%, 0/0).
- Pre-dedup vs ingest distinction understood: proof `normalized.json` carries 1,026 depth-5 headings (parent-page overlap before dedup); TOC leaf count remains 836. Ingest correctly uses deduped 2026-08-04 file.

### 2. Ten-section verbatim spot-check (raw HTML vs normalized)

Deterministic sample indices [3, 47, 113, 201, 289, 377, 465, 553, 641, 729] over depth-5 labeled headings. For each: section label (with `§\u00a0` nbsp normalization) and first following paragraph span searched in joined raw HTML (155 pages).

**Result: 10/10 PASS** — all labels and paragraph spans found verbatim in raw HTML.

Sample sections verified: § 1.01.004, § 1.03.063, § 1.07.039, § 1.11.032, § 2.07.033, § 3.04.005, § 4.07.032, § 5.05.001, § 8.04.035, § 3 (APPEALS).

Reviewer script: `_scratch/e1_adv_spotcheck.mjs` (discarded after review; not committed).

### 3. Builder self-grade check

**Confirmed NOT self-graded.** Builder close `checkpoint: builder_STOP_before_fidelity_self_grade`, `builder_fidelity_grade: NOT_SELF_GRADED`, `adversarialReviewPending: true`. Fidelity verdict in this document is reviewer-owned.

### 4. Currency / live re-scrape

| Signal | Value |
|---|---|
| Proof `normalized.json` `fetchedAt` | 2026-07-30T03:36:52Z |
| Proof crawl `finishedAt` | 2026-07-30T03:39:24Z |
| Publication date in metadata | 2025-07-14 (legislation through Ord. No. 2025-689) |
| E1 live re-run | **No** — builder reused July proof (`live_rerun: false`) |
| Days since proof at review | ~10 |

Registry row `tx-smithville` (`verified_at: 2026-07-30`) records no repeal/replacement signal; city Ordinances page still points to eCode360 SM6484. **Fidelity PASS is on the saved proof wave, not a live 2026-08-09 crawl.** Planner should decide whether Texas-flush launch gate requires a fresh crawl before prod snapshot commit; absence of new ordinance signal makes refresh **optional**, not a fidelity REFUTE.

### 5. Robots / header posture

- Disallowed paths in robots: `/admin`, `/search`, `/print`, etc. — **not** `/SM6484`.
- Selected civil UA: `PublicLawTextFetcher/1.0` (not Chrome spoof).
- Rate: 0.5 rps with documented 429 backoff.
- Note: preregistered expectations JSON `E1-4 fail_if` lists `PublicLawTextFetcher/1.0` — contradicts `status.json` selected profile and dispatch scrape posture. Treated as documentation error; graded against dispatch brief + on-disk proof (civil self-ID, no Chrome evasion).

---

## Stamp dry-run (separate grade)

**Verdict: BLOCKED_HONEST_ABSENT** (expected, not failure)

- `_inbox/2026-08-09_E1_smithville_stamp_dryrun.json`: ldt `zoning-stamp --city=smithville-tx --dry-run` exits 1 — city not in ZONING_LAYERS (23 configured cities; Smithville absent).
- Registry: `zoning_gis: null` — city Maps page has zoning PDF only; no public FeatureServer probed.
- MATCH CONTRACT leading-token counters: N/A until GIS layer authored.
- **Does not affect corpus fidelity PASS.** Stamp lane blocked until four-point GIS probe or honest-absent documented on registry row.

---

## Findings summary

**Supporting PASS:**

1. Independent TOC section count = 836 (matches all harness artifacts).
2. Independent block count = 12,793 on proof normalized file.
3. Ten-section spot-check: 100% verbatim legal-text spans in raw HTML.
4. Robots + civil header posture documented; Chrome spoof explicitly rejected in proof run.
5. Builder did not self-grade fidelity.
6. Corpus eval 1.0/1.0/1.0 validated on correct deduped ingest file (836 sections).

**Residual risks (non-blocking for fidelity PASS):**

1. Fidelity harness logic not re-executed in reviewer environment (import path missing); reliance on July planner regrade + spot-checks.
2. No live 2026-08-09 re-scrape — currency is proof-age advisory, not span corruption.
3. E1 ingest/eval ran before adversarial gate (process ordering); scores stand given fidelity PASS.
4. Zoning stamp remains blocked until GIS source exists.

---

## Recommendation to planner

- **Accept corpus fidelity PASS** for W5 E1 lane close on proof wave artifacts.
- **Queue optional live re-scrape** if launch gate requires fetch timestamp within N days; otherwise July proof + registry watcher suffices for current ordinance vintage (2025-689 / 2025-07-14).
- **Stamp:** document honest-absent on registry; do not block corpus ingest on stamp absence.
- **Follow-up:** restore or relocate `fidelity.ts` import in `planner_b1_fidelity_regrade.mts` to `ecode360/` path so future E1-ADV reviews can re-run harness mechanically.

---

## Artifact path

`P:/doc_repo/_inbox/2026-08-09_E1_smithville_adversarial_review.md`
