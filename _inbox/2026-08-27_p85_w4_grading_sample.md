---
id: 2026-08-27_p85_w4_grading_sample
title: P-85 W4 — ten-run grading sample (item 15)
date: 2026-08-27
last_updated: 2026-08-27
status: active
plan_row: P-85
wdll_item: 15
---

# W4 grading sample — RUN PLAN ACTIVE

WDLL item 15: ten **completed** runs across six counties, hand-graded against a title examiner's read of the same index and instruments. Report precision and recall with sample size n=10.

**Snapshot:** 2026-08-28T01:15Z · W4 **7/10 terminal** · inbox + fee approve **deployed · pending QA** (design-system update).

---

## Who does what

| Step | Owner | Notes |
|------|-------|-------|
| Enqueue (smartsite → Records Request → Run) | **Operator** | Hard refresh after PE deploy |
| Approve / Decline county fees | **Operator** | Decline = header-only complete · Approve = human clerk path on Bastrop |
| Worker search + acquire | **Automated** | p85-v8 |
| Vision / classify / corridor | **Automated** | Only when `artifacts_acquired > 0` (blocked on Bastrop paywall today) |
| County portal examiner read | **Operator** | Same parcel on county site · fill index columns |
| DB audit | **Agent** | `node lib/db/scripts/pecan-watch.mjs <jobId>` + detail query |
| Precision / recall rollup | **Planner** | At W4 close from rows below |

---

## Final ten parcels (locked)

| # | County | parcelNodeId | Label | Portal | Recipe mode | Fee gate? | Run action | Status |
|---|--------|--------------|-------|--------|-------------|-----------|------------|--------|
| 1 | Bastrop 48021 | `48021:34161` | 905 Pecan St | bastrop-aumentum | index-search | yes ($7) | Decline · header-only | **done** — job `21eb218a` complete · 2 hits |
| 2 | Bastrop 48021 | `48021:35105` | 1101 Chestnut St | bastrop-aumentum | index-search | yes | Decline · header-only | **done** — job `beb04339` complete · 1 hit |
| 3 | Williamson 48491 | `48491:R062578` | PURVIS MICHAEL | williamson-publicsearch | index-search | maybe | Re-run after worker fix | **failed** — `4f2716b1` · `/terms` 404 (config bug) |
| 4 | Travis 48453 | `48453:280238` | Travis CAD fixture | travis-tccsearch | index-search | maybe | Use **address search** parcel w/ geometry | **blocked** — no map geometry |
| 4b | Travis 48453 | `48453:144172` | operator retry | travis-tccsearch | index-search | — | — | **failed** — `7859c7e2` · disclaimer HTTP 403 (WAF) |
| 5 | Hays 48209 | `48209:166476` | 241 Helena Ln, Kyle | hays-erss | index-search | maybe | Run · operator Wave C | **needs-human** — `ecd9114a` · search-ui-not-found |
| 6 | Caldwell 48055 | `48055:17263` | 408 Concho St, Lockhart | caldwell-clerk-web | scaffold | no | Run · operator Wave C | **failed** — `0430e4bf` · portal HTTP 403 |
| 7 | McLennan 48309 | `48309:181849` | 3612 N 24th St, Waco | mclennan-online-records | scaffold | no | Run · operator Wave C | **complete** — `b40e6bdc` · 0 hits · verified-absent |
| 8 | Williamson 48491 | **operator pick** | Round Rock city-limits parcel (GIS ack test) | williamson-publicsearch | index-search | maybe | Prefer parcel inside Round Rock · check ack for GIS hits | pending |
| 9 | Travis 48453 | **operator pick** | Austin-area parcel (second Travis) | travis-tccsearch | index-search | maybe | Run new search | pending |
| 10 | Hays 48209 | **operator pick** | Kyle / Buda / San Marcos area | hays-erss | index-search | maybe | Run new search | pending |

**County coverage:** Bastrop ×2 · Williamson ×2 · Travis ×2 · Hays ×2 · Caldwell ×1 · McLennan ×1 = **10 runs / 6 counties**.

---

## Execution waves (operator order)

### Wave A — Bastrop header-only (tonight, ~15 min)

Prerequisite: smartsite prod includes PE **#256** (hard refresh).

1. **#1 Pecan** — Navigate `48021:34161` → Records Request → **Run new search** → when paused-fees appears → **Decline · header-only** → Refresh until `complete`.
2. **#2 Chestnut** — Navigate `48021:35105` → same · **Decline · header-only**.
3. Reply **wave A done** with any job IDs shown in UI (or agent will poll DB by parcel).

Agent runs DB audit on both job IDs.

### Wave B — index-search counties (~30 min)

3. Williamson PURVIS (`48491:R062578`) — **failed** `4f2716b1` (entry URL 404 · fix in p85-v9)
4. Travis — **failed/blocked** (403 WAF · `7859c7e2`; `280238` no geometry)

Decline fees if paused; otherwise let run complete or needs-human.

### Wave C — **DONE** (2026-08-27)

Operator ran via address search (map geometry required). Agent DB audit:

| # | Job | Terminal | Notes |
|---|-----|----------|-------|
| 5 | `ecd9114a` | needs-human | Hays Tyler · search-ui-not-found |
| 6 | `0430e4bf` | failed | Caldwell clerk page · HTTP 403 from worker |
| 7 | `b40e6bdc` | complete | McLennan scaffold · 0 index hits · lookup-failed N/A |

**UX gap filed:** pending runs disappeared from My reports when switching parcels — cross-parcel inbox built locally (pending deploy).

### Wave D — active next (~30 min)

8. Williamson Round Rock pick
9. Travis second pick
10. Hays second pick

---

## Grading dimensions (item 15)

For each run, examiner opens the **same county clerk portal** used by the recipe and records:

| Dimension | What to compare |
|-----------|-----------------|
| **Recall** | Product index hits (or instruments) vs examiner count of recordings tied to parcel |
| **Precision** | Product hits that match real recordings vs spurious rows |
| **Classification** | deed / easement / dot / plat / other labels vs examiner read |
| **Header facts** | grantor, grantee, date, book-page on deeds/liens |
| **Clauses** | restriction/easement clause extract (n/a on header-only) |
| **Corridor** | map geometry vs legal (n/a until artifacts acquired) |

**Header-only runs (#1–2, any Decline):** grade index recall/precision + header fields on index rows only; mark vision/clauses/corridor **n/a**.

---

## Pre-filled rows (smoke + prior proof)

### Run #2 — 1101 Chestnut (`48021:35105`) **DONE**

**Job `beb04339-11ff-43cf-932b-314b39f2e59b`** · `complete` · header-only · 1 index hit:

```
job_id: beb04339-11ff-43cf-932b-314b39f2e59b
parcel: apn:48021:35105
terminal_status: complete
finish_reason: header-only
index_hits_count: 1
run_cost.totalCents: 355
Match: pending examiner sign-off
```

### Run #1 — 905 Pecan (`48021:34161`) **DONE**

**Job `21eb218a-36ef-4feb-aa15-c6d0c91a89a1`** · `complete` · 2 index hits · 0 artifacts · header-only path:

```
job_id: 21eb218a-36ef-4feb-aa15-c6d0c91a89a1
parcel: apn:48021:34161
county_fips: 48021
portal_id: bastrop-aumentum
terminal_status: complete
scope_searched.mode: index-search
finish_reason: header-only (expected — operator Decline or equivalent)

Index (examiner read — operator fill):
  instruments_found: 2
  by_type: { deed: 1, easement: 1 }

Product:
  index_hits_count: 2
  artifacts_acquired: 0
  recorded_instruments_count: 0
  run_cost.totalCents: 1

Match:
  recall: pending examiner sign-off
  precision: pending examiner sign-off
  classification_ok: n/a (header-only)
  clauses_ok: n/a
  corridor_ok: n/a

notes: Recordings 201905582 + 199904322 in scope. Prior smoke job bab70fd3 superseded.
```

### Run #1 smoke (superseded) — bab70fd3

```
job_id: bab70fd3-3573-44fd-acda-61622c05d5e6
parcel: apn:48021:34161
county_fips: 48021
portal_id: bastrop-aumentum
terminal_status: needs-human
scope_searched.mode: index-search

Index (examiner read):
  instruments_found: 2 (201905582 conservation easement · 199904322 deed)
  by_type: { deed: 1, easement: 1, dot: 0, other: 0 }

Product:
  index_hits_count: 2
  artifacts_acquired: 0
  recorded_instruments_count: 0
  restriction_clauses_count: 0
  corridors_placed: 0
  run_cost.totalCents: 710 (pre-approve) → 1 (post-approve human queue)

Match:
  recall: partial — hits match examiner list · not terminal complete
  precision: high on index refs
  classification_ok: partial — index rows only
  header_facts_ok: partial
  clauses_ok: n/a
  corridor_ok: n/a

UI spot-check:
  verdict_card_correct: partial
  chat_cites_recording_ref: n/a
  notes: Fee Approve was 403 pre-PE-256; manual bypass used. Re-run Decline for clean W4 row.
```

**Job `21eb218a-36ef-4feb-aa15-c6d0c91a89a1`** (later run, `complete`, 2 hits) — **use as Wave A retest candidate** if this was Decline; agent to audit and merge into row #1 final grade.

### Run #2 prior — 1101 Chestnut (`48021:35105`)

Prior jobs `78dccb95`, `be112da2` — fee gate with 1 index hit · operator graded Approve+Decline on UI in W1. Wave A Decline run still needed for a clean **complete** row in this artifact.

---

## Per-run grade row (copy for runs 3–10)

```
run_number:
job_id:
parcel:
county_fips:
portal_id:
terminal_status:
scope_searched.mode:
finish_reason:                    # header-only | full | lookup-failed | etc.

Index (examiner read):
  instruments_found:
  by_type: { deed:, easement:, dot:, plat:, restriction:, other: }

Product:
  index_hits_count:
  artifacts_acquired:
  recorded_instruments_count:
  restriction_clauses_count:
  corridors_placed:
  run_cost.totalCents:
  vision_read_status:             # from artifact metadata if any

Match:
  recall:
  precision:
  classification_ok: Y | N | partial | n/a
  header_facts_ok: Y | N | partial | n/a
  clauses_ok: Y | N | n/a
  corridor_ok: Y | N | n/a

UI spot-check:
  verdict_card_correct: Y | N
  chat_cites_recording_ref: Y | N | n/a
  instant_gis_in_ack: Y | N | n/a
  notes:
```

---

## Agent DB audit commands

From `legacy-design-tools/lib/db` with prod `DATABASE_URL`:

```powershell
$db = gcloud secrets versions access latest --secret=DEPLOYMENT_DATABASE_URL --project=legacy-design-tools-prod
$env:DATABASE_URL = $db
node scripts/pecan-watch.mjs                    # recent + pecan summary
node scripts/pecan-watch.mjs <jobId>              # job + artifact vision status
node scripts/pecan-audit-detail.mjs <jobId>     # index hits + acquisition JSON
```

Poll parcel after operator run:

```powershell
node scripts/p85-recent-parcels.mjs             # edit SQL for target parcel_key
```

---

## Rollup (planner fills at W4 close)

| Metric | Numerator | Denominator | Value |
|--------|-----------|-------------|-------|
| Index recall | runs with recall ≥ partial | n=10 | TBD |
| Index precision | runs with precision ≥ partial | n=10 | TBD |
| Classification | runs classification_ok=Y | runs with artifacts > 0 | TBD |
| Header-only complete | terminal complete + finishReason header-only | n=10 | TBD |
| Fee UI working | approve or decline returned 202/200 | fee-gate runs | TBD post-#256 |

---

## Blockers (unchanged)

- **Bastrop full pipeline:** human clerk checkout after fee approve · 0 artifacts · vision/classify/corridor ungraded until images acquired or different county.
- **Resend:** `RESEND_API_KEY` on cortex for item 11 live email.
- **Caldwell / McLennan:** recipes may terminal as scaffold/reachability — grade honestly as lookup-failed or partial index, not as defect hide.

---

## Next action

**Operator:** Wave A now (Pecan + Chestnut Decline) after hard refresh · reply **wave A done**.

**Agent:** Audit job IDs · fill final row #1–2 · update canvas queue when 10/10 graded.
