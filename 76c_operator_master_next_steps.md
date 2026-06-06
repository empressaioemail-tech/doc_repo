---
id: 76c_operator_master_next_steps
title: Operator master next steps — pickup doc
status: active
last_updated: 2026-05-30
applies_to: portfolio
related: [00_current_state, 75_hauska_brokerage_workflow_plan, 75c_property_brief_data_backlog, 76_empressa_wedge_90d_operating_plan, 90_runbooks/property_brief_cortex_deploy, 90_runbooks/partner_outreach_brief_wave, _prospects/icc/hauska_icc_partnership_brief, _inbox/2026-05-30_property_brief_extension_public_deploy_session_handoff]
owner: nick
---

# Operator master next steps

> **Read this first** when resuming work. Synthesized from `_inbox/` sweep 2026-05-30. Detail lives in linked closes and runbooks; this doc is the single prioritized queue.

**North star (unchanged):** Chrome extension = consumer on-ramp → cited "cylinder of intel" at an address → deeper architect/city surfaces on shared Hauska substrate.

**Honest status:** Extension **public API tier is live** on prod. **Consumer Chrome QA not signed off.** Regrid parcel/zoning gaps. ICC POC not started. GTM Track C (#135) merged but not redeployed.

---

## 0. Start here (5 min)

| Check | Command / action | Expected |
|-------|------------------|----------|
| Prod API alive | POST `/api/brokerage/v1/brief` with public key from SM | `round_rock_tx`, `meta.clientTier: extension_public` |
| Serving revision | `gcloud run services describe cortex-api --region us-central1 --project legacy-design-tools-prod` | `cortex-api-00119-laq` or newer **with brokerage secrets** |
| Extension repo | `P:\hauska-brief-extension` on `main` ≥ v0.6.5 | Merge [PR #1](https://github.com/empressaioemail-tech/hauska-brief-extension/pull/1) if not merged |

Prod URL: `https://cortex-api-tds7av26va-uc.a.run.app`

---

## 1. P0 — Ship consumer extension (this week)

Extension public tier works via API; browser UX still rough. **Block Chrome Web Store until these pass.**

### 1A. Merge + rebuild extension

- [x] Merge hauska-brief-extension **PR #1** (v0.6.5 zero-config UX) — **merged ~week of 2026-05-30**; extension on `main`. Remaining 1A work is pull + release build only.
- [ ] Pull `main`; run release build:

```powershell
cd P:\hauska-brief-extension
$env:HAUSKA_EXTENSION_PUBLIC_KEY = (gcloud secrets versions access latest --secret=BROKERAGE_EXTENSION_PUBLIC_KEY --project=legacy-design-tools-prod).Trim()
.\scripts\build-release.ps1
```

- [ ] Load unpacked from repo root; **do not** fill Advanced override key

### 1B. Clean extension QA (manual — ~30 min)

| # | Test | Expected |
|---|------|----------|
| 1 | Fresh install (remove extension OR `chrome.storage.local.clear()`) | No options visit required |
| 2 | Zillow Round Rock — Run full brief | Narrative + chips; **no QuotaBytes error** |
| 3 | Run brief ×5 same listing | Storage stays under quota (v0.6.4 slim + `unlimitedStorage`) |
| 4 | Plano or Pflugerville listing | 403 / jurisdiction block (honest copy) |
| 5 | Public tier | Share + wallet **hidden**; no "Add Hauska key" errors |
| 6 | Options | Advanced collapsed; "Leave blank for store builds" visible |

**Known failure modes:** stale override key from 401 debug window; stale content script → hard refresh Zillow tab.

Closes: [`_inbox/2026-05-30_hauska-brief-extension_operator_extension_public_prod_qa_close.md`](_inbox/2026-05-30_hauska-brief-extension_operator_extension_public_prod_qa_close.md), [`_inbox/2026-05-30_hauska-brief-extension_extension-agent_qa_fix_wave_v064_close.md`](_inbox/2026-05-30_hauska-brief-extension_extension-agent_qa_fix_wave_v064_close.md)

### 1C. Deploy reproducibility (stop the pain)

- [ ] **Workflow PR:** extend `.github/workflows/cloud-run-deploy.yml` `deploy-canary` to mount brokerage secrets + `BRIEFING_LLM_MODE=grok`
- [ ] **Do not run `deploy-canary`** until that lands (resets to mock-only baseline)
- [ ] Disable junk SM `BROKERAGE_EXTENSION_PUBLIC_KEY` v1 when convenient

Recovery pattern if canary breaks: [`_inbox/2026-05-30_legacy-design-tools_operator_property_brief_extension_public_prod_deploy_close.md`](_inbox/2026-05-30_legacy-design-tools_operator_property_brief_extension_public_prod_deploy_close.md) § Recovery pattern

---

## 2. P0 — Data quality (broker-visible)

### 2A. Parcel/zoning provider — Cotality selected over Regrid (2026-06-06)

**Decision:** [`_decisions/2026-06-06_cotality_parcel_provider.md`](_decisions/2026-06-06_cotality_parcel_provider.md). Cotality is the chosen parcel/zoning provider for launch. Regrid is now interim/dev fallback only (already wired), kept behind the same port so the apps stay testable while the Cotality adapter is built. Detail in §3E.

**Regrid (interim only, deprioritized):** the prior no-coverage debug (Round Rock `regrid:parcels`/`regrid:zoning` = `no-coverage`) is now optional — only worth doing if you want Regrid usable as a fallback during the Cotality build.

- [ ] (Optional) Confirm `REGRID_API_KEY` tier / serving-revision mount if keeping Regrid as live fallback

### 2B. Neon warmup (optional but improves `in_corpus` latency)

JSONL ready at `P:\hauska-engine\tools\migrate-legacy-codes\tmp\neon-warmup-pilot\`:

| Jurisdiction | Rows |
|--------------|-----:|
| round_rock_tx | 276 |
| georgetown_tx | 571 |
| new_braunfels_tx | 170 |
| austin_tx | 1810 |
| hutto_tx | 1376 |
| leander_tx | 156 |

- [ ] Run [`90_runbooks/property_brief_neon_warmup.ps1`](90_runbooks/property_brief_neon_warmup.ps1) — staging first (`round_rock_tx`)
- [ ] Reconcile `/coverage` drift (`engine_only` vs brief `in_corpus`)

### 2C. Redeploy GTM Track C (#135)

Merged @ `e086836`; migration **0032** not on prod yet.

- [ ] Deploy image with #135; `run-migrations` for `0032_gtm_mcp_observation.sql`
- [ ] Smoke place API: `/place/resolve`, `/place/:placeKey/layers`

### 2D. Bastrop ADU research chat bug

Brief POST finds ADU atoms; `/research/chat` with `starterPromptId: adu` returns generic empty. Follow-up dispatch for cc-agent-C when extension ship clears.

---

## 3. P1 — Partner tracks

### 3A. ICC (call complete — POC next)

**Status 2026-06-06:** moving forward (operator confirmed "let's go" on call). Ed Saler sending POC agreement; Nick's two-week ICC trial process starts Monday. Transcript filed at [`80_meetings/transcripts/2026-05-icc_ed_saler_api_licensing_call_otter.txt`](80_meetings/transcripts/2026-05-icc_ed_saler_api_licensing_call_otter.txt).

**Outcome (Ed Saler):** No republishing full text. Usage tracking required (blockchain/event-registration layer is an accepted mechanism; Ed open to tiering on interaction volume). **POC ~$1k** (credited toward full license) → 2 older titles via API → demo content surfaced in apps → SaaS. SaaS API ~$3k–$10k/yr by regional scope (Central TX focus = lower end); per-user up to ~$4/user/mo for the big code set. Strategy endorsed: Central TX → Triangle (Houston, Dallas) → expand.

- [ ] Review transcript: [`80_meetings/transcripts/2026-05-icc_ed_saler_api_licensing_call_otter.txt`](80_meetings/transcripts/2026-05-icc_ed_saler_api_licensing_call_otter.txt)
- [ ] Decide: sign POC agreement (~$1k)
- [ ] Integrate 2 ICC titles in dev; demo citation block in extension + architect UI
- [ ] Define usage telemetry for ICC (GTM events may suffice initially)
- [ ] Longer pitch doc: [`_prospects/icc/hauska_icc_partnership_brief.md`](_prospects/icc/hauska_icc_partnership_brief.md)

**Parallel:** eCO (3700 municipalities' local ordinances) — evaluate vs Regrid for zoning gaps.

### 3B. General Code / eCode360

- [ ] Call per [`90_runbooks/partner_outreach_brief_wave.md`](90_runbooks/partner_outreach_brief_wave.md) §1
- [ ] Unlocks Kyle, Buda, Pflugerville, Cedar Park, Smithville, McAllen, Dallas city track

### 3C. County clerk (Williamson or Bastrop)

- [ ] Recorded restrictions / minerals index — legal description search MOU
- [ ] Start Williamson (Round Rock pilot demos) or Bastrop (existing relationship)

### 3D. Forrest consulting (GTM, not technical)

Transcript: [`80_meetings/transcripts/2026-05-forest_forrest_consulting_call_otter.txt`](80_meetings/transcripts/2026-05-forest_forrest_consulting_call_otter.txt)

- [ ] Draft consultant contract bullets (base + hourly + commission on client wins)
- [ ] Loop Forrest in on Property Brief when ready for pilot feedback
- [ ] Channel for Central TX municipal + dev community intros

### 3E. Cotality — SELECTED as parcel/zoning provider; eval live (2026-06-06)

**Decision:** [`_decisions/2026-06-06_cotality_parcel_provider.md`](_decisions/2026-06-06_cotality_parcel_provider.md). **Recon:** [`_research/2026-05-30_cotality_property_brief_recon.md`](_research/2026-05-30_cotality_property_brief_recon.md). **Call transcript:** [`80_meetings/transcripts/2026-06-cotality_corelogic_gene_sales_engineer_call_otter.txt`](80_meetings/transcripts/2026-06-cotality_corelogic_gene_sales_engineer_call_otter.txt).

**Status:** sales-engineer call done; AE Michelle Taylor (michelletaylor@cotality.com, 817-699-8152) emailed eval onboarding 2026-06-06. Two parallel tracks now open.

**Track 1 — implement now (self-serve trial):**
- [x] Dispatch cc-agent-C parcel/zoning adapter — **LANDED 2026-06-06**. Branch `cortex/cotality-adapter-scaffold`, commit `e5c0daa`, 259/259 tests green, **PR held for operator merge** (create at https://github.com/empressaioemail-tech/legacy-design-tools/pull/new/cortex/cotality-adapter-scaffold). Close note: [`_inbox/2026-06-06_legacy-design-tools_cc-agent-C_cotality_adapter_scaffold.md`](_inbox/2026-06-06_legacy-design-tools_cc-agent-C_cotality_adapter_scaffold.md).
- [ ] **Operator smoke (gates everything downstream):** sign up trial https://developer.corelogic.com/#/sign-up (100 property-data + 25 AVM calls/day); mount `COTALITY_API_KEY`; **correct the provisional endpoint constant** in `cotality.ts` from the authenticated portal; run the smoke command in the close note on 1904 Heathwood Cir; record vintage + which fields the trial returns; then merge the PR.
- [ ] Property (Carfax) layer — dispatch [`_dispatches/2026-06-06_cc-agent-C_cotality_property_layer.md`](_dispatches/2026-06-06_cc-agent-C_cotality_property_layer.md). **Trial-smokeable now** (owner/sale/tax/AVM/characteristics are in the trial's property-data + AVM scope).
- [ ] Climate (hydrology v1) layer — dispatch [`_dispatches/2026-06-06_cc-agent-C_cotality_climate_layer.md`](_dispatches/2026-06-06_cc-agent-C_cotality_climate_layer.md). **Eval-gated** — Climate Risk Analytics is a premium SKU, NOT in the self-serve trial; build now against fixtures, live smoke waits on the MCP/climate entitlement from the Hannah call. Strategy: [`77b_cotality_integration_strategy.md`](77b_cotality_integration_strategy.md).

**Track 2 — production MCP eval:**
- [x] Return to Michelle: legal/billing info + one-paragraph use-case — **returned 2026-06-06**
- [ ] Call with product manager Hannah (APIs + MCP) — Thu/Fri
- [ ] Confirm license terms (recon §6): consumer-extension display, agent metering / rev-share, attribution, caching, sub-licensing, TX-scoped pricing
- [ ] PUC (Permissible Use Committee) write-up — Cotality drafts with our data-protection paragraph

Source: https://www.cotality.com/our-data · CoreLogic is now Cotality

---

## 4. P2 — Agent dispatches (when operator greenlights)

| Dispatch | Agent | When |
|----------|-------|------|
| Deploy-canary workflow fix | cc-agent-C | Anytime — unblocks all future deploys |
| Regrid live-fetch debug | cc-agent-C | After operator confirms token tier |
| Cotality adapter/MCP spike | cc-agent-C or cc-agent-M | After sales pilot creds ([`_research/2026-05-30_cotality_property_brief_recon.md`](_research/2026-05-30_cotality_property_brief_recon.md)) |
| ICC 2-title POC integration | cc-agent-E + cc-agent-C | After POC agreement signed |
| Bastrop ADU `/research/chat` | cc-agent-C | After extension QA pass |
| Neon warmup automation | cc-agent-E | If operator defers manual load |

Backlog scoring: [`75c_property_brief_data_backlog.md`](75c_property_brief_data_backlog.md)

---

## 5. What's done (don't redo)

| Item | Evidence |
|------|----------|
| PR #134 place graph + #137 data wave + #138/#139/#140 extension public tier | Merged; prod `00119-laq` |
| Federal layers (USGS, EPA) on brief | Smoke pass 2026-05-29 |
| Encumbrance R4 upload path (dev tier) | In #137; public tier correctly 403 |
| Extension public key in SM v2 | Mounted; prod smoke PASS |
| ICC Code Connect adapter prebuild | hauska-engine PRs #24/#25/#26 merged |
| Central TX code corpus (~8k atoms, 14+ cities) | cc-agent-E Sync 5 corridor |
| Extension v0.6.4 storage slim + v0.6.5 zero-config UX | Shipped; merge PR #1 + rebuild |

---

## 6. Vision gap (north star vs today)

| North star | Status | Next action |
|------------|--------|-------------|
| Zero-config consumer extension | Public key baked | §1B QA |
| Free Central TX pilot | 6 neon jurisdictions | §2B warmup |
| Cited code reasoning | Grok + local atoms | §3A ICC POC |
| Parcel + zoning in brief | Partial (Regrid gaps) | §2A |
| Deed restrictions / mineral cylinder | Not started | §3C county clerk |
| Share / workspace / wallet | Dev tier only | By design on public tier |
| x402 / usage billing | Designed | Post-ICC telemetry |
| Deploy reproducibility | Fragile | §1C workflow PR |
| Chrome Web Store | Not submitted | After §1B pass |

Full analysis: [`_inbox/2026-05-30_property_brief_extension_public_deploy_session_handoff.md`](_inbox/2026-05-30_property_brief_extension_public_deploy_session_handoff.md) §9

---

## 7. Suggested session agendas

### Short session (1–2 hr)

1. §0 prod smoke
2. §1A–1B extension merge + clean QA
3. §2A Regrid token check

### Medium session (half day)

1. Short session above
2. §1C workflow PR (or dispatch cc-agent-C)
3. §3A ICC POC decision + email Ed
4. §2C GTM #135 redeploy

### Full day

1. Medium session above
2. §2B Neon warmup staging
3. §3B General Code call
4. §3E Cotality sales call (recon filed)

---

## 8. File index

| Resource | Path |
|----------|------|
| This doc | `76c_operator_master_next_steps.md` |
| Current snapshot | `00_current_state.md` |
| Sprint anchor | `75_hauska_brokerage_workflow_plan.md` |
| Scored backlog | `75c_property_brief_data_backlog.md` |
| Deploy runbook | `90_runbooks/property_brief_cortex_deploy.md` |
| Partner calls | `90_runbooks/partner_outreach_brief_wave.md` |
| Extension deploy handoff (detail) | `_inbox/2026-05-30_property_brief_extension_public_deploy_session_handoff.md` |
| Operator deploy close | `_inbox/2026-05-30_legacy-design-tools_operator_property_brief_extension_public_prod_deploy_close.md` |
| ICC partnership brief | `_prospects/icc/hauska_icc_partnership_brief.md` |
| Cotality recon | `_research/2026-05-30_cotality_property_brief_recon.md` |
| Extension repo | `P:\hauska-brief-extension` |
| LDT repo | `P:\legacy-design-tools` |
| Engine repo | `P:\hauska-engine` |

---

## Revision history

- **2026-05-30:** Created from `_inbox/` sweep. Consolidates Property Brief extension public deploy, ICC/Forrest transcripts, Cotality lane, and open backlog items from `75c`.
- **2026-05-30:** Cotality recon filed at `_research/2026-05-30_cotality_property_brief_recon.md`; §3E updated.
