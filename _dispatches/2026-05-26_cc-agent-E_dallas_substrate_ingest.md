---
id: 2026-05-26_cc-agent-E_dallas_substrate_ingest
title: Dispatch — Dallas / Dallas County substrate ingest (cc-agent-E)
date: 2026-05-26
agent: cc-agent-E
repo: hauska-engine
branch: stream-1d/dallas-county-tx
sprint: 40i_cortex_dallas_e2e_grok_plan_review_sprint
related: [QA-58, QA-60, QA-61, 49_code_ingestion_pipeline, _sessions/2026-05-23_sync5_tx_metro_batch_cc-agent-E]
---

# Dallas / Dallas County substrate ingest — cc-agent-E

**Sprint:** [`40i_cortex_dallas_e2e_grok_plan_review_sprint.md`](../40i_cortex_dallas_e2e_grok_plan_review_sprint.md)

**Operator context:** QA-58 engagement is **430 Evergreen Trl, Cedar Hill, TX** (Dallas County). Regrid + site layers work; **municipal code** is missing for plan-review E2E (QA-60). This ingest feeds **Hauska substrate** + MCP `list_jurisdictions`; cc-agent-C maps cortex-local warmup separately.

**Precedent:** Sync 5 TX-metros batch (PRs #38–#47) — same Path C / Municode / eval pattern. See [`_sessions/2026-05-23_sync5_tx_metro_batch_cc-agent-E.md`](../_sessions/2026-05-23_sync5_tx_metro_batch_cc-agent-E.md).

---

## Goal

Ship **Dallas County TX** and/or **City of Dallas TX** on `hauska-engine` `main` with:

- `code-section` atoms ingested and indexed
- Eval ≥ 0.9 on curated query set (three eval dimensions per engine convention)
- Jurisdiction visible in MCP `list_jurisdictions` after MCP deploy (operator/cc-agent-M)

**Stable keys (proposed — confirm in recon):**

| Entity | Suggested key | Notes |
|--------|---------------|-------|
| City of Dallas | `dallas-tx` | Primary adopted CoO / development code if on Municode |
| Dallas County | `dallas-county-tx` | Only if county code is separate product on source |

Pick **one primary** for v1 if both exist; document the other as follow-on. QA-58 geocode resolves **Cedar Hill** → map to whichever jurisdiction owns adopted code for that address (usually **City of Dallas** extraterritorial / ETJ vs Cedar Hill city code — **recon required**, max 1h).

---

## Recon (time-box 1h)

1. **Municode** `/Clients/name` for "Dallas" and "Dallas County" (Texas).
2. If NO-RESULT on city: check **eCode360** (per `51_substrate_v1_sprint.md` — Dallas listed eCode360-resident).
3. If blocked: file partnership-track note (General Code) in close doc; do not burn unbounded scrape.

**Partnership-first scoping:** public adopted code / Municode class is **green** for Cortex product-baseline ingest (not city operational data).

---

## Deliver

| Step | Action |
|------|--------|
| 1 | Branch `stream-1d/dallas-county-tx` from `hauska-engine` `main` |
| 2 | Jurisdiction config + adapter path (Path C wrapper/chapterFilter pattern from SA/FW metros if applicable) |
| 3 | Ingest run → atom count in PR description |
| 4 | Eval queries authored from `dry-run --show-sections` labels |
| 5 | PR to `main`; CI green |
| 6 | Close doc: keys, atom count, eval scores, MCP deploy note |

**Cost gate:** stay under **$200 compute + 1h human review** per jurisdiction; stop and report if exceeded.

**accessPolicy:** `platform-internal` for pilot (match Bastrop-network batch) unless operator specifies `public-free`.

---

## Out of scope

- `legacy-design-tools` cortex warmup / `JURISDICTIONS.ts` (cc-agent-C Track B)
- Grok finding engine (cc-agent-C Track A)
- Fort Worth (General Code partnership — separate)
- El Paso / Pharr deferred items from prior batch

---

## Acceptance

- [ ] PR merged on `hauska-engine` `main` with eval ≥ 0.9 (or documented 0.95+ with operator waiver like Crowley)
- [ ] `list_jurisdictions` (local engine or staging MCP) returns Dallas row with `atomCount > 0`
- [ ] Close note lists jurisdiction key(s) for cc-agent-C to wire `substrate_jurisdiction_key` + `CITY_STATE_TO_KEY` for: `cedar hill|tx`, `dallas|tx`, `dallas county|tx`

---

## Handoff to cc-agent-C (paste in close doc)

```
Substrate keys shipped: <dallas-tx | dallas-county-tx>
Atom count: N
Eval: x/x/x
Source: Municode clientId / eCode360 / other
Geocode mapping recommendation for Cedar Hill QA-58: <city vs county>
```

---

## Close

`P:\doc_repo\_inbox\2026-05-26_hauska-engine_cc-agent-E_dallas_substrate_ingest.md`
