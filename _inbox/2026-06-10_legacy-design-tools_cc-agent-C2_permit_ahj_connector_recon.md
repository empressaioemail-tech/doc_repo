---
id: 2026-06-10_legacy-design-tools_cc-agent-C2_permit_ahj_connector_recon
title: Recon — permit-portal / AHJ-precedent connector (cost envelope + sovereignty gate)
date: 2026-06-10
agent: cc-agent-C2
repo: legacy-design-tools (cross-repo read: smartcity-os, hauska-engine, doc_repo)
model: Grok Build 0.1
dispatch: 2026-06-10_cc-agent-C2_permit_ahj_connector_recon
status: complete
related: [_decisions/2026-06-10_permit_ahj_precedent_connector_recon_seed, 58_gtm_readiness_sprint, 59_spine_moat_and_high_value_features, 04a_arrow_two_calibration_capture, 31a_bastrop_maintenance_sprint, 80_adrs/adr_005_multitenancy, 80_adrs/adr_017_atom_access_control]
---

# Permit-portal / AHJ-precedent connector recon

> **Verdict: BUILD (post-launch, C4-paired) — family-first, not KILL.** Portal-family adapters can cover the majority of Texas AHJs within commitment 3's under-$200-compute + ~1hr-review envelope. A minority of high-volume metros (Austin AB+C, Houston iPermits) are bespoke and must stay outside the default onboarding path — bounded pilot or partnership only. The kill gate is **not** tripped for a family-adapter program; it **would** trip if the operator committed to nationwide bespoke-per-city integration or marketed raw permit-record resale.

---

## Executive summary

| Question | Answer |
|---|---|
| Kill gate (family adapters + commitment 3)? | **PASS** for Accela, Tyler MyGov, Tyler EnerGov, OpenGov families — marginal onboarding is a config row + human review, not a new integration per city |
| Adapter-framework reuse? | **Yes** — extend lifted `@hauska-engine/adapters` (PR #69) with `portal` tier + `portalFamily` jurisdiction registry, mirroring Municode's one-adapter-many-cities pattern |
| Sovereignty split clean? | **Yes** — submittal/checklist/turnaround metadata pools public; approval/rejection precedent from tenant ops stays `tenant-private`, never pools (ADR-005/017) |
| Reasoning-atoms-only? | **Yes** — value is aggregate precedent + outcome signals, not raw-record resale; flag only if product scope drifts to verbatim permit dumps |
| Arrow-two + SmartCity pairing? | **Confirmed** — permit approved/rejected is arrow-two Phase 2 ground truth (#2 signal); Bastrop MyGov ingest is the C4 seed |
| Bastrop "502 permits" (31a)? | **Verified verbatim** — active permit count in morning-brief metric, not total DB rows |

**Recommendation:** Sequence a post-launch build paired with sprint 58 **C4** (SmartCity-on-spine). Phase 1: tenant-private Bastrop operational path → arrow-two outcomes. Phase 2: public-tier Accela + MyGov family adapters. Phase 3: OpenGov/EnerGov as APIs confirm. Explicit **out-of-envelope** list: Austin AB+C, Houston iPermits (bespoke; partnership track only).

---

## 1. Portal-family → coverage map

Texas permitting is heterogeneous, but **vendor families dominate** — the cost envelope answer is family coverage, not per-city greenfield.

### Summary table

| Portal family | Public/queryable API? | Auth model | Typical data available (public tier) | TX jurisdictions (representative) | Est. family reach |
|---|---|---|---|---|---|
| **Accela Citizen Access (ACA)** | **Yes** — Construct API v4; `POST /v4/search/records` is **no-auth** for public search; agency via `x-accela-agency` + `x-accela-environment` + `x-accela-appid` | Anonymous public search; access token for restricted fields | Permit type, status, address, dates, module; expandable contacts/parcels (permission-gated) | Dallas (`DALLASTX`), San Antonio (`COSA`), Fort Worth (`CFW`); many suburbs on `aca-prod.accela.com/{AGENCY}` | **~900–2,200 agencies nationally** (Accela marketing); **~40+ TX cities/counties** on ACA pattern |
| **Tyler EnerGov (Enterprise Permitting & Licensing)** | **Yes** — REST/JSON API suite; **per-agency** enablement | Agency-issued API credentials (often paid license) | Application status, inspections, code cases, configurable open-data fields | Mid-large TX cities on enterprise tier (varies by RFP) | **~15,000+ Tyler gov customers globally**; TX share material but agency list is IT-gated |
| **Tyler MyGov / Permitting Pro** (`web.mygov.us`, `public.mygov.us/{city}`) | **No public API** — authenticated AJAX/HTML tables; SmartCity already scrapes | Staff credentials (SmartCity); public portal is read-only search | Permit lists, WO, inspections, fees, templates/checklists on public portal | **Bastrop**, Crowley, Midlothian, Pantego, University Park, many small TX cities | **Small-city family** — one scraper + `{city_slug}` config serves all MyGov tenants |
| **OpenGov Permitting & Licensing** (`{city}.portal.opengov.com`) | **Emerging** — `developer.opengov.com`; marketing cites public APIs "Fall 2025" | OpenGov org developer account | Permits, licenses, inspections, fees (when API enabled per org) | Ennis, Bedford, Highland Park TX; growing TX footprint | **~1,900+ public-sector orgs** on OpenGov platform |
| **Cloudpermit** | **Yes** — workspace API (per-tenant instance) | Per-municipality API keys | Workspaces, inspections, fees, attachments metadata | Fewer TX adopters than Accela/OpenGov; Canadian origin, US expansion | Smaller TX share; family adapter viable where adopted |
| **CityView (Municipal Software)** | **Partner API** — Integration Services API; not citizen open-data | Per-agency integration agreement | Permit lifecycle, property-linked records (back-office) | Scattered TX installs (e.g. some suburbs) | **40+ year vendor**; family adapter + partnership gate |
| **Austin AB+C** (`abc.austintexas.gov`) | **Partial** — public search UI; **no unified Construct-style API** | Public search without registration; plan review via ProjectDox (separate) | Active permit search, application types, fees (portal metadata) | Austin only | **Bespoke** — 1 city, high volume |
| **Houston iPermits + ProjectDox** | **No unified public API** — dual-portal workflow | Portal-specific | Application/payment (iPermits); plan upload (ProjectDox) | Houston only | **Bespoke** — 1 city, high volume |
| **Municode / eCode360** (code, not permits) | Yes (code family already lifted) | Rate-limited public JSON | Ordinances, **not** permit outcomes | Statewide TX municipalities | Already in spine — **complements** permit connector for submittal legal basis, not precedent |

### Texas metro coverage estimate (designer-demand lens)

For the 7k SoftPlan/ArchiCAD Texas audience, **~65–75% of permit-office interactions** (by combined population + suburb sprawl) fall into **three family adapters**:

1. **Accela** — Dallas, San Antonio, Fort Worth, Plano-class suburbs on ACA
2. **Tyler MyGov** — Bastrop-template small cities (already have scraper proof)
3. **Tyler EnerGov / OpenGov** — mid-size cities on enterprise/cloud stacks

**~25–35%** of Texas *permit volume* (not jurisdiction count) sits in **bespoke stacks**: Austin AB+C, Houston dual-portal, legacy one-offs. These break commitment 3 if treated as default onboarding — they belong on a **bounded pilot / partnership** track, not the family-adapter highway.

### API evidence (Accela — the strongest family)

Accela Construct API documents `POST /v4/search/records` with **Authorization Type: No authorization required** for public record search. All agencies share `https://apis.accela.com`; jurisdiction is selected via `x-accela-agency` header — exactly the Municode `clientId` pattern (one adapter, many cities).

---

## 2. Adapter-framework reuse path

### What exists today

- **Lifted framework:** `legacy-design-tools/lib/adapters` → `hauska-engine/packages/adapters` via PR **#69** (277/302 parity tests). Contract in `types.ts`: `Adapter` interface, `registry.ts` tier lists, `runner.ts` batch execution, `jurisdictionResolver.ts` slug gating.
- **Portal-family precedent (codes, not permits):** `lib/codes-sources/src/municode/` — **one** `municodeSource` adapter; per-jurisdiction config is `municodeClientId` + `municipalityName` in `lib/codes/src/sourceRegistry.ts`. Onboarding a new Municode city is a registry row, not a new adapter.
- **Hauska-engine scaffold note:** `packages/adapters/src/index.ts` still exports scaffold version on disk in some checkouts; sprint 58 dispatch index records **#69 MERGED** with full parity — treat the lifted package as canonical for extension.

### Concrete extension path for permit/AHJ

```
packages/adapters/src/
  portal/                          # NEW tier (or extend "local" with portalFamily gate)
    accela.ts                      # ONE adapter — all ACA agencies
    tyler-mygov.ts                 # ONE adapter — all MyGov tenants (reuse scrape patterns)
    tyler-energov.ts               # ONE adapter — EnerGov REST (agency base URL + creds)
    opengov.ts                     # ONE adapter — {city}.portal.opengov.com pattern
    types.ts                       # PortalFamily enum, PortalJurisdictionConfig
  registry.ts                      # PORTAL_ADAPTERS array appended to ALL_ADAPTERS
  jurisdictionResolver.ts          # resolve portalFamily + agencySlug from engagement AHJ
```

**Contract extensions (minimal):**

| Field | Purpose |
|---|---|
| `tier: "portal"` | New Site Context / AHJ tier grouping |
| `sourceKind: "portal-adapter"` | `briefing_sources` / atom provenance |
| `portalFamily: "accela" \| "tyler-mygov" \| ...` | Family dispatch inside `appliesTo` |
| `jurisdictionGate.portalAgency` | e.g. `DALLASTX`, `bastrop_tx` — the Municode `clientId` equivalent |

**Runner / gate:** Same `runAdapters()` batch; gate exposes as MCP tools behind ADR-008 seam (adapter behind gate, dual interface green per seed decision).

**SmartCity reuse:** `smartcity-os/server/services/mygov-scraper.ts` is the proven Tyler MyGov family implementation (Playwright + AJAX POST). Port the **family** scraper to `@hauska-engine/adapters`, not Bastrop-specific routes. SmartCity remains the **tenant-private enricher**; the portal adapter serves **public-tier** metadata.

---

## 3. Marginal per-jurisdiction cost + kill criterion

### Commitment 3 definition (from portfolio docs)

**Under ~$200 compute + ~1 hour human review** per jurisdiction onboarded. Pricing framework (`14_pricing_framework.md`) notes early cities amortize higher; target is marginal near-zero at scale.

### Marginal cost model

| Onboarding path | Marginal compute | Marginal human review | Within envelope? |
|---|---|---|---|
| **Accela family** — add `agencySlug` to registry | **$0–5** (smoke search 1–3 API calls) | **15–45 min** (verify agency slug, field map, public search works) | **YES** |
| **MyGov family** — add `city_slug` to registry | **$5–30** (sample scrape run) | **45–60 min** (validate public portal + field parity vs registry) | **YES** |
| **OpenGov family** — add portal slug + API scope | **$10–50** (API probe) | **45–90 min** (developer portal access may need city IT) | **YES** (if API live); **YELLOW** if waiting on org API enablement |
| **EnerGov family** — agency API credentials | **$0–20** | **1–4 hr calendar** (IT ticket for API key) — compute still low | **YES** on compute; calendar friction is operational, not a kill |
| **Bespoke** (Austin AB+C, Houston, legacy custom) | **$200–800+** (discovery, custom scrape/API) | **8–40 engineering hours** | **NO — BREAKS COMMITMENT 3** |

**Amortized engineering (one-time per family, not per jurisdiction):**

| Family adapter (one-time build) | Est. engineering | Spread over N jurisdictions |
|---|---|---|
| Accela | 2–3 weeks | → **<$5/jurisdiction** at 50+ agencies |
| Tyler MyGov (port SmartCity scraper) | 1–2 weeks | → **<$3/jurisdiction** at 30+ cities |
| OpenGov | 1–2 weeks | Similar |

### Kill criterion (explicit)

**KILL** (or revert to tightly bounded pilot) if:

1. **Default onboarding path** requires bespoke-per-city integration for **>30% of target Texas AHJs by designer-demand weight** — i.e., treating Austin/Houston-style stacks as the norm rather than exceptions.
2. **Marginal per-jurisdiction cost** (compute + review, excluding one-time family build) exceeds **$200 compute OR >2 hr review** on the family-adapter path for a new Accela/MyGov/OpenGov city.
3. **Sovereignty:** approval/rejection precedent cannot be partitioned — tenant-private ops data would pool into public calibration (ADR-005/017 violation).
4. **Thesis:** product value exists **only** as raw permit-record resale with no reasoning-atom expression.

**This recon: criterion 1–4 are NOT met on a family-first program.** Criterion 1 would be met only if the operator insisted on covering Austin + Houston in v1 on the same SLA as Accela config-row onboarding — **don't do that**.

**Bounded pilot alternative (if operator wants Austin/Houston in v1):** Cap at 2 bespoke metros, $15–25k budget, no commitment-3 claim, no pooled precedent from tenant ops.

---

## 4. Data-shape sovereignty split (per shape, not per connector)

| Data shape | Examples | Typical source | `accessPolicy` | Pools? |
|---|---|---|---|---|
| **A — Submittal requirements / checklists / turnaround** | Required attachments, fee schedule, inspection stages, portal-published processing times, application type catalog | Public citizen portal pages, Accela anonymous search metadata, MyGov `public.mygov.us` templates | `public-free` or `public-paid` (if gated tool) | **YES** — public-tier pool |
| **B — Approval/rejection precedent (red-line patterns)** | "Similar remodels flagged for floodplain", "elevation cert required on 3/5 recent denials", staff review comments | SmartCity tenant DB (`mygov_permits`, `mygov_work_orders`), authenticated staff systems | `tenant-private` | **NEVER** — per-tenant overlay only (arrow-two `jurisdictionTenant` partition) |
| **C — Outcome ground truth (approved / denied / expired)** | Final disposition + date (not full record) | Public search status fields + tenant ops enrich | Public outcomes: poolable as **calibration signal**; linked comments: tenant-private | **Split** — outcome event pools; narrative/comments don't |
| **D — Raw permit records (verbatim)** | Full application PDFs, applicant PII, contractor license numbers | Portals, SmartCity scrape | N/A — **not sold** | **Off-thesis** — reasoning atoms only |

**ADR-005/017 alignment:** Layer A gate enforces `accessPolicy` on atom reads. Arrow-two Phase 1–3 ledger partitions on `jurisdictionTenant` — same boundary as ADR-005 Layer A. SmartCity `tenant_id=2` (Bastrop) operational rows stay tenant-private; public portal metadata ingested by family adapters gets `public-free`.

**Cross-shape rule:** A permit connector may emit **shape A** from public portals and **shape B/C** from SmartCity tenant ingest — the sovereignty line is drawn at **field/shape**, not at "which connector."

---

## 5. Reasoning-atoms-only boundary

**Confirmed on-thesis** if scoped correctly:

- **Emit:** `reasoning_atoms` / finding citations like *"In Bastrop AHJ, 4 of 12 similar residential additions received floodplain review comments (2024–2026 window)"* — aggregate, attributable, no verbatim application text.
- **Emit:** Arrow-two Phase 2 **outcome events** — `{findingId, outcome: "permit_approved" | "permit_denied", observedAt}` — calibration deposit, not data product.
- **Do NOT emit:** Searchable raw permit database, applicant/contractor PII resale, verbatim staff comment dumps.

**Flag (off-thesis risk):** If the product spec drifts to "download all permits in ZIP" or Cotality-style `/building-permits` raw feed — kill that slice. The value is **precedent-as-reasoning** (defensible moat per seed decision) and **outcome calibration** (arrow-two), not records brokerage.

SmartCity's existing normalized tables (`mygov_permits`, `mygov_work_orders`) support **aggregation upstream** of the atom layer — the connector synthesizes patterns; it does not resell row-level exports.

---

## 6. Arrow-two + SmartCity pairing

### Arrow-two ground truth — confirmed

From `04a_arrow_two_calibration_capture.md`:

> **Finding accuracy against observed outcome.** When the real-world result lands (a permit approved, a variance granted, a plan-review comment resolved), that outcome is the ground truth the stated confidence should have predicted.

From `59_spine_moat_and_high_value_features.md` item **5b**:

> **Real-world outcome capture (permit-office ground truth).** Arrow-two Phase 2 captures reviewer dispositions; the deepest signal (permit issued, variance granted, in the authority of record) is still net-new. Wire it via SmartCity OS permit data and public permit records.

**Conclusion:** Permit approval/rejection is **the** Phase 2 outcome signal. Reviewer adjudication (Phase 1) is reviewer-proxied; permit disposition is authority-of-record ground truth. This connector is the wiring 59-5b and 04a describe.

### SmartCity Bastrop seed — confirmed + 31a figure verified

**Read verbatim from `31a_bastrop_maintenance_sprint.md` traffic-light (2026-06-01 baseline):**

> | MyGov | Green | **502 permits**; 82 overdue WOs in morning-brief |

**What "502 permits" means (cross-repo verification):**

- **NOT** total `mygov_permits` table size. `smartcity-os/MyGov-Data-Map.md` (March 2026) reports **14,561** permit rows in `mygov_permits` from the active-list scrape.
- **IS** the **active permit count** surfaced in Compass morning-brief. `smartcity-os/server/routes/ai-assistant.ts` queries `COUNT(*) FROM mygov_permits WHERE tenant_id = 2 AND is_current = true AND in_mygov_active_list = true` — this is the metric health check reported as "502 permits."
- **Portal vendor:** Bastrop uses **Tyler MyGov** (`web.mygov.us`, `public.mygov.us/bastrop_tx`). Ingest is **Playwright scraper** (no public API) — `MYGOV_DATA_INGESTION_STRATEGY.md` documents the strategy; production scraper is live per 31a Green status.
- **C4 pairing:** Sprint 58 step **C4** — "cut SmartCity/Bastrop as the third app" (54 Task 2 tenant key + 31a Phase 3 atom-backed context). The permit connector build **depends on C4** for tenant-private operational precedent; public-tier family adapters can proceed in parallel but full moat depth needs SmartCity-on-spine.

**30a historical note:** Cutover smoke cited **12,240 permits** (broader count, different filter/date) — consistent with a growing scrape backfill, not contradictory with 502 active-current.

---

## 7. Sized, sequenced build recommendation

### Posture: BUILD, post-launch, C4-paired

Do **not** open this as a second pre-launch front (seed decision green on focus queue). Execute after architect launch gate (58) and alongside/after **C4**.

### Sequence

| Phase | When | Scope | Owner repo | Acceptance |
|---|---|---|---|---|
| **P0 — Recon** | **DONE** (this report) | Cost envelope + sovereignty + kill gate | doc_repo | Operator review |
| **P1 — Tenant outcome wire** | Post-C4 | SmartCity `mygov_permits` disposition → arrow-two Phase 2 outcome events (`permit_approved`/`denied`); `tenant-private`, `jurisdictionTenant=2` | smartcity-os + legacy-design-tools (cortex-api ledger) | Bastrop finding→outcome deposit e2e |
| **P2a — Accela family adapter** | Post-C4 + P1 | Public search metadata + outcome status; `public-free` atoms | hauska-engine `packages/adapters` | Dallas + San Antonio + Fort Worth config-row onboard <1hr each |
| **P2b — MyGov family adapter** | Post-C4 | Port scraper family; public portal templates + status; config `{city_slug}` | hauska-engine + smartcity-os (shared scrape lib) | 3 non-Bastrop MyGov cities onboarded on config-only path |
| **P3 — OpenGov/EnerGov** | Fast-follow | When agency API access confirmed | hauska-engine | 2 TX cities within envelope |
| **PX — Bespoke pilot** | Optional | Austin AB+C, Houston only; **explicitly out of envelope** | Partnership | No commitment-3 marketing |

### Effort sizing (engineering weeks, post-launch)

| Work package | Est. | Notes |
|---|---|---|
| P1 tenant outcome wire | 1–2 weeks | Extends existing Phase 2 dispatch scope |
| P2a Accela adapter + registry | 2–3 weeks | Highest ROI — unified API |
| P2b MyGov family port | 1–2 weeks | Reuse SmartCity scrape proof |
| Gate tools + provenance envelope | 1 week | Fold into C1/C4 provenance standardization |
| **Total to Texas-family coverage** | **~5–8 weeks** | Parallelizable after C4 |

### What not to build (kill-adjacent)

- Per-city custom scrapers as the **default** onboarding path
- Raw permit record MCP export tool
- Pooled cross-tenant precedent from Bastrop ops data
- Pre-launch marketing of AHJ precedent connector (HOA/CC&R honesty gap pattern from 58)

---

## 8. Sources consulted

| Source | Path / URL |
|---|---|
| Recon seed decision | `doc_repo/_decisions/2026-06-10_permit_ahj_precedent_connector_recon_seed.md` |
| Dispatch | `doc_repo/_dispatches/2026-06-10_cc-agent-C2_permit_ahj_connector_recon.md` |
| Moat 5b | `doc_repo/59_spine_moat_and_high_value_features.md` |
| Arrow-two spec | `doc_repo/04a_arrow_two_calibration_capture.md` |
| Bastrop 31a | `doc_repo/31a_bastrop_maintenance_sprint.md` |
| ADR-005 / ADR-017 | `doc_repo/80_adrs/adr_005_multitenancy.md`, `adr_017_atom_access_control.md` |
| Adapter contract | `legacy-design-tools/lib/adapters/src/{types,registry,runner,jurisdictionResolver}.ts` |
| Municode family pattern | `legacy-design-tools/lib/codes-sources/src/municode/index.ts` |
| Engine lift report | `doc_repo/_inbox/2026-06-07_hauska-engine_cc-agent-E_engine_lift_adapters.md` |
| SmartCity MyGov | `smartcity-os/docs/MYGOV_DATA_INGESTION_STRATEGY.md`, `MyGov-Data-Map.md`, `server/routes/ai-assistant.ts` |
| Accela API | https://developer.accela.com/docs/api_reference/v4.post.search.records.html |
| GTM sprint C4 | `doc_repo/58_gtm_readiness_sprint.md` |

---

## 9. Operator decision requested

1. **Accept BUILD (family-first)** vs **KILL** vs **bounded pilot only** — this recon recommends BUILD post-C4.
2. **Confirm out-of-envelope list** (Austin, Houston) for v1 — do not count them against family-adapter kill gate.
3. **Authorize P1** after C4 lands — Bastrop tenant outcome wire is the highest moat-per-week slice (arrow-two true calibration).

---

*Read-only recon. No code, schema, branch, or PR. cc-agent-C2 on Grok Build 0.1; no Claude escalation required.*
