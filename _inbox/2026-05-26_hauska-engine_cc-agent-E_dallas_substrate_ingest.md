---
id: 2026-05-26_hauska-engine_cc-agent-E_dallas_substrate_ingest
title: Close — Dallas / Dallas County substrate ingest (cc-agent-E)
date: 2026-05-26
agent: cc-agent-E
repo: hauska-engine
branch: stream-1d/dallas-county-tx
sprint: 40i_cortex_dallas_e2e_grok_plan_review_sprint
related: [QA-58, QA-60, QA-61]
---

# Close — Dallas / Dallas County substrate ingest

**Sprint:** 40i / QA-60  
**Agent:** cc-agent-E  
**Branch:** `stream-1d/dallas-county-tx`  
**PR:** https://github.com/empressaioemail-tech/hauska-engine/pull/48

---

## TL;DR

Recon blocked **City of Dallas TX** and **Dallas County TX** on Municode (NO-RESULT). Dallas city code is hosted on **American Legal / codelibrary.amlegal.com** (not eCode360 — `ecode360.com/DA6775` returns 403). Shipped **Cedar Hill TX** (`cedar_hill_tx`) via Path C / Municode as the **primary jurisdiction for QA-58** (430 Evergreen Trl, Cedar Hill — incorporated city, not Dallas ETJ).

| Metric | Value |
|--------|------:|
| Jurisdiction key | `cedar_hill_tx` |
| Atoms (code-section) | **706** |
| Eval | **0.913 / 1.0 / 1.0** (23 curated queries) |
| Source | Municode clientId **1568**, productId **11825** |
| accessPolicy | `platform-internal` |

---

## Recon (≈45 min)

### Municode `/Clients/name`

| Query | Result |
|-------|--------|
| Dallas, TX | **NO-RESULT** |
| Dallas County, TX | **NO-RESULT** |
| Cedar Hill, TX | **clientId 1568** |

### eCode360

- Sprint doc (`51_substrate_v1_sprint.md`) lists Dallas as eCode360-resident — **stale/incorrect**.
- Probe `https://ecode360.com/DA6775` → **403 Forbidden** (login wall).
- Live adopted code for City of Dallas is on **AmLegal**: `https://codelibrary.amlegal.com/codes/dallas/latest/dallas_tx/0-0-0-1` (public HTML, separate publisher stack — **General Code / American Legal partnership track**, same class as Fort Worth).

### QA-58 geocode jurisdiction decision

**430 Evergreen Trl, Cedar Hill, TX** resolves to **City of Cedar Hill** (incorporated). Cedar Hill municipal code applies — not City of Dallas ETJ, not Dallas County unincorporated regs. **Primary v1 key: `cedar_hill_tx`.**

Dallas city (`dallas-tx`) and Dallas County (`dallas-county-tx`) are **follow-on partnership-track** items.

---

## Delivered

| Step | Status |
|------|--------|
| Branch `stream-1d/dallas-county-tx` from main | ✅ |
| Path C config + chapterFilter (6 dev chapters) | ✅ |
| Ingest run (706 sections) | ✅ |
| Curated queries from `--show-sections` labels | ✅ (23 queries) |
| Eval ≥ 0.9 | ✅ 0.913 top-3 |
| PR to main | ✅ [#48](https://github.com/empressaioemail-tech/hauska-engine/pull/48) |
| accessPolicy platform-internal | ✅ |

### Path C scope (Cedar Hill)

Top-level chapter filter:

```
buildings and building|flood|natural and environmental|planning|subdivision|zoning ordinance
```

Chapters ingested: 4, 7, 13, 16, 20, 23.

### Eval notes

Two queries missed top-3 but aggregate passed bar:

- `23-5.2.1` landscape — slug collision with Ch. 4 tree sections
- `4-1` building permits — PR #22 bare-number disambiguation path (`…/artiinge/4-1` vs `…/4-1`)

Non-blocking; optional query-authoring cleanup for 1.0/1.0/1.0.

---

## Handoff to cc-agent-C

```
Substrate keys shipped: cedar_hill_tx
Atom count: 706
Eval: 0.913/1.0/1.0
Source: Municode clientId 1568 (Code of Ordinances productId 11825)
Geocode mapping recommendation for Cedar Hill QA-58: city (Cedar Hill municipal code)

CITY_STATE_TO_KEY:
  cedar hill|tx     → cedar_hill_tx   (PRIMARY — QA-58 / QA-60)
  dallas|tx         → (blocked — AmLegal partnership; no substrate yet)
  dallas county|tx  → (blocked — no Municode product; county regs TBD)

Blocked follow-ons (partnership track):
  dallas-tx         — AmLegal codelibrary.amlegal.com/codes/dallas
  dallas-county-tx  — recon needed (no Municode; may be county-hosted PDF)
```

**MCP deploy note:** After PR merge, cc-agent-M runs snapshot refresh + retrieval-api redeploy so `list_jurisdictions` returns `cedar_hill_tx` with `atomCount > 0`.

---

## Cost gate

| Item | Estimate |
|------|----------|
| Municode ingest (×2 runs: probe + eval) | ~10 min wall time, $0 compute |
| Human review | < 1 h |
| **Total** | **Under $200 + 1h** ✅ |

---

## Out of scope (unchanged)

- legacy-design-tools / Cortex warmup / `JURISDICTIONS.ts` (cc-agent-C Track B)
- Grok finding engine (cc-agent-C Track A)
- Dallas / Dallas County AmLegal adapter (partnership)

🤖 cc-agent-E
