---
id: 2026-06-10_legacy-design-tools_cc-agent-C2_texas_statewide_jurisdiction_gap
title: Recon — Texas statewide jurisdiction enumeration + coverage gap (warm-up prioritizer)
date: 2026-06-10
agent: cc-agent-C2
repo: legacy-design-tools (cross-repo read: hauska-engine corpus)
model: Grok Build 0.1
dispatch: 2026-06-10_cc-agent-C2_texas_statewide_jurisdiction_gap
status: complete
related: [_decisions/2026-06-10_texas_coverage_demand_driven, _inbox/2026-06-10_legacy-design-tools_cc-agent-C_texas_coverage_gap_analysis, 58_gtm_readiness_sprint, 59_spine_moat_and_high_value_features, 80_adrs/adr_019_layered_code_substrate]
---

# Texas statewide jurisdiction gap — warm-up prioritizer

> **Verdict: demand-tiered warm-up, NOT flat batch.** Texas has ~1,225 incorporated municipalities + 254 counties; pre-warming all of them would cost ≈$1,800–3,000 compute + ~1,500 review hours and breaks commitment 3. A bounded **Tier 1 pre-warm of ~22 jurisdictions** (7 metros + Central Texas cluster, San Marcos #1) costs ≈**$25–45 compute + ~22 review hours** — within the under-$200 + ~1hr/jurisdiction envelope. The long tail (~1,150+ places) rides **user-warm coverage-escalation** (59 item 1). No user-supplied content enters the shared corpus.

---

## Executive summary

| Deliverable | Result |
|---|---|
| Universe sourced? | ✅ Census Vintage 2024 + Wikipedia municipality table + SECO/TDLR state floor |
| Coverage cross-ref? | ✅ Against Neon L3 (8), engine snapshot (34 keys), reasoning-warmed (`austin_tx` only) |
| San Marcos config-ready? | ✅ **Priority #1** — IBC/IRC **2021** adopted; Municode slug confirmed; **no UpCodes city page** (IECC/A117.1 need fallback — flagged) |
| Three-tier map? | ✅ Tier 1 ~22 / Tier 2 ~35 / Tier 3 ~1,150+ |
| Tier 1 within envelope? | ✅ ~$1–2/jurisdiction compute; ~1hr review each |
| Execution path? | ✅ Tier 1 = cold-warm harness (Austin-2024 pattern); Tiers 2–3 = user-warm (59 §1) |

---

## 1. Texas jurisdiction universe (sourced, ranked)

### Sources (not hand-typed)

| Source | What it provides | URL / file |
|---|---|---|
| **U.S. Census Bureau Vintage 2024** | Ranked incorporated places ≥20,000 pop (July 1, 2024 est.) | [SUB-IP-EST2024-ANNRNK](https://www2.census.gov/programs-surveys/popest/tables/2020-2024/cities/totals/SUB-IP-EST2024-ANNRNK.xlsx) |
| **Wikipedia "List of municipalities in Texas"** | Full ~1,225 municipality table (971 cities + 231 towns + 23 villages), 2024 pop est. | [Cities of Texas](https://en.wikipedia.org/wiki/Cities_of_Texas) (aggregates Census + TEA) |
| **Texas Comptroller SECO** | State energy floor (not a jurisdiction, applies statewide) | [Single-family](https://comptroller.texas.gov/programs/seco/code/single-family.php), [Commercial](https://comptroller.texas.gov/programs/seco/code/commercial.php) |
| **TDLR** | State accessibility floor (TAS 2012) | [TAS](https://www.tdlr.texas.gov/ab/abtas.htm) |
| **B2 adoption table** | Metro I-Code edition verification | `_inbox/2026-06-10_..._texas_coverage_gap_analysis.md` |
| **Sync 5 discovery** | Central TX Municode clientIds + Path C vs partnership | `_sessions/2026-05-22_sync5_tier2_central_tx_discovery_cc-agent-E.md` |

### Ranking basis

**Primary:** Census 2024 population (designer-demand proxy).  
**Secondary tie-breakers:** (a) permit-volume proxy = membership in a top-10 MSA or I-35/Austin–San Antonio corridor; (b) live-store presence (engine/corpus/warmed reduces marginal warm cost); (c) live-customer signal (San Marcos); (d) growth rate (Census 2020–2024 % change for corridor cities).

**Not ranked individually:** 254 Texas counties for unincorporated permitting — treated as **Tier 3 demand-driven** unless a county is the AHJ of record for a specific engagement (then user-warm fires on address). County keys like `bastrop_county_tx` exist in engine snapshot for county-level ordinance only.

### Texas scale (why not flat batch)

| Bucket | Count | Flat-batch cost @ $1.50 + 1hr each |
|---|---:|---|
| Incorporated municipalities | **~1,225** | ≈$1,840 compute + ~1,225 review hrs |
| Places ≥20,000 pop (Census ranked) | **~100** | ≈$150 + ~100 hrs |
| Places ≥5,000 pop (est. ~350) | **~350** | ≈$525 + ~350 hrs |
| **Tier 1 pre-warm (this recon)** | **~22** | **≈$33 + ~22 hrs** |

The decision frame ([`_decisions/2026-06-10_texas_coverage_demand_driven.md`](../_decisions/2026-06-10_texas_coverage_demand_driven.md)) explicitly rejects the ~1,500-jurisdiction flat batch (≈$300k compute cited in premortem for unbounded scale).

### Top 25 Texas cities by population (Census 2024 est., sourced)

| Rank | City | Pop 2024 | `jurisdiction_key` | Coverage state |
|---:|---|---:|---|---|
| 1 | Houston | 2,390,125 | `houston_tx` | **MISSING** |
| 2 | San Antonio | 1,526,656 | `san_antonio_tx` | engine_only |
| 3 | Dallas | 1,326,087 | `dallas_tx` | **blocked_partnership** / MISSING |
| 4 | Fort Worth | 1,008,106 | `fort_worth_tx` | **MISSING** |
| 5 | Austin | 993,588 | `austin_tx` | **L3 neon + reasoning-warmed** |
| 6 | El Paso | 681,723 | `el_paso_tx` | engine_only |
| 7 | Arlington | 403,672 | `arlington_tx` | **MISSING** |
| 8 | Corpus Christi | 317,317 | `corpus_christi_tx` | **MISSING** |
| 9 | Plano | 293,286 | `plano_tx` | engine_only |
| 10 | Lubbock | 272,086 | `lubbock_tx` | **MISSING** |
| 11 | Laredo | 261,260 | `laredo_tx` | **MISSING** |
| 12 | Irving | 259,285 | `irving_tx` | **MISSING** |
| 13 | Garland | 248,839 | `garland_tx` | **MISSING** |
| 14 | Frisco | 235,208 | `frisco_tx` | **MISSING** |
| 15 | McKinney | 228,718 | `mckinney_tx` | **MISSING** |
| 16 | Amarillo | 206,047 | `amarillo_tx` | **MISSING** |
| 17 | Grand Prairie | 199,886 | `grand_prairie_tx` | **MISSING** |
| 18 | Brownsville | 191,967 | `brownsville_tx` | engine_only |
| 19 | Denton | 164,106 | `denton_tx` | **MISSING** |
| 20 | Mesquite | 163,123 | `mesquite_tx` | **MISSING** |
| 21 | Killeen | 156,261 | `killeen_tx` | engine_only |
| 22 | Waco | 144,816 | `waco_tx` | **MISSING** |
| 23 | Carrollton | 137,328 | `carrollton_tx` | **MISSING** |
| 24 | Midland | 136,098 | `midland_tx` | **MISSING** |
| 25 | Abilene | 131,098 | `abilene_tx` | **MISSING** |

Populations from Wikipedia table (Census 2024 estimates). Full ranked list continues to ~1,225; ranks 26–100 are **Tier 2** candidates (see §4).

### Central Texas corridor (I-35 / Austin–San Antonio), ranked

| Rank (corridor) | City | Pop 2024 | `jurisdiction_key` | Coverage | Notes |
|---:|---|---:|---|---|---|
| **1** | **San Marcos** | **74,316** | `san_marcos_tx` | **MISSING** | **Live-customer #1** (146 S. Fredericksburg triplex) |
| 2 | New Braunfels | 111,949 | `new_braunfels_tx` | L3 neon | engine + Neon |
| 3 | Round Rock | 128,783 | `round_rock_tx` | L3 neon | 2024 I-Codes per B2 |
| 4 | Georgetown | 97,569 | `georgetown_tx` | L3 neon | |
| 5 | Pflugerville | 79,099 | `pflugerville_tx` | **MISSING** | eCode360 partnership |
| 6 | Leander | 79,886 | `leander_tx` | L3 neon | |
| 7 | Hutto | 41,294 | `hutto_tx` | L3 neon | |
| 8 | Kyle | 67,411 | `kyle_tx` | **MISSING** | eCode360 partnership |
| 9 | Buda | 16,519 | `buda_tx` | **MISSING** | eCode360 partnership |
| 10 | Cedar Park | 79,413 | `cedar_park_tx` | **MISSING** | partnership |
| 11 | Bastrop | 11,688 | `bastrop_tx` | L3 neon | SmartCity tenant |
| 12 | Dripping Springs | 5,787 | `dripping_springs_tx` | engine_only | |
| 13 | Lockhart | 14,818 | `lockhart_tx` | engine_only | Municode 3055 |
| 14 | Manor | 14,568 | `manor_tx` | engine_only | Municode 15968 |
| 15 | Lago Vista | 8,401 | `lago_vista_tx` | engine_only | |
| 16 | Wimberley | 3,011 | `wimberley_tx` | engine_only | |
| 17 | Elgin | 11,065 | `elgin_tx` | engine_only | |
| 18 | Taylor | 17,671 | `taylor_tx` | engine_only | |
| 19 | Cedar Hill | 49,735 | `cedar_hill_tx` | L3 neon | Dallas suburb |

---

## 2. Live-store coverage cross-reference

### Store inventory (B2 baseline, 2026-06-10)

| Store | Texas count | Keys |
|---|---:|---|
| **Corpus L3** (`code_atoms` on deployment Neon) | **8** | `austin_tx`, `hutto_tx`, `georgetown_tx`, `round_rock_tx`, `cedar_hill_tx`, `bastrop_tx`, `new_braunfels_tx`, `leander_tx` |
| **Engine snapshot** (`centralTexasPilot.ts` / hauska-engine corpus) | **34** `_tx` keys (+ `grand_county_ut`) | See `ENGINE_CORPUS_JURISDICTION_KEYS` in `lib/codes/src/centralTexasPilot.ts` |
| **Reasoning-warmed** (`reasoning_atoms`) | **1** | `austin_tx` only (725 atoms; B2 five-way split below) |
| **Blocked** | 1 | `dallas_tx` (`blocked_partnership` — AmLegal) |

**ADR-019 note:** All 4,754 Texas `code_atoms` are **Layer 3 local ordinance only**. Layer 1 I-Codes live on the **reasoning layer** (web-first), not corpus.

### `austin_tx` reasoning five-way split (B2 verified, carried forward)

| State | Count | % of 725 |
|---|---:|---:|
| unverified-warmed | 552 | 76.1% |
| verified-corpus (overlay) | 133 | 18.3% |
| deeplink-only (NEC/NFPA) | 40 | 5.5% |
| verified-warmed (web body) | **0** | **0%** |
| missing (corpus-skipped ADA) | 13 | — |

Post–PR #163 driver fix: section-level extraction flips unverified→verified for UpCodes-groundable families; **IECC + IFC remain 0%** on UpCodes 404 / ICC book-landing (ICC-creds fault line).

### Engine-only keys (26 on snapshot, not on Neon L3)

`boerne_tx`, `brownsville_tx`, `converse_tx`, `copperas_cove_tx`, `crowley_tx`, `dripping_springs_tx`, `el_paso_tx`, `elgin_tx`, `keller_tx`, `killeen_tx`, `lago_vista_tx`, `live_oak_tx`, `lockhart_tx`, `manor_tx`, `mission_tx`, `pasadena_tx`, `plano_tx`, `rollingwood_tx`, `saginaw_tx`, `san_antonio_tx`, `schertz_tx`, `sugar_land_tx`, `taylor_tx`, `watauga_tx`, `wimberley_tx`, `bastrop_county_tx`

These have **L3 atoms in engine substrate** but not deployment Neon; reasoning layer = **MISSING** for all.

### Coverage legend

| Code | Meaning |
|---|---|
| **L3** | Corpus Layer-3 on Neon |
| **ENG** | Engine snapshot only (L3 not on Neon) |
| **WARM** | `reasoning_atoms` warmed |
| **BLK** | `blocked_partnership` (Dallas AmLegal) |
| **—** | MISSING from all stores |

---

## 3. San Marcos — priority #1, config-ready warm entry

**Live-customer context:** 146 S. Fredericksburg, 3-story triplex bid. Cortex correctly reported San Marcos absent from corpus and grounded web-first on demand ([`_decisions/2026-06-10_texas_coverage_demand_driven.md`](../_decisions/2026-06-10_texas_coverage_demand_driven.md)). Pre-warm makes the next San Marcos engagement instant + calibratable.

**Coverage today:** **—** MISSING from corpus, engine snapshot, and reasoning layer.

### Adopted technical codes (verified from city sources)

**Authority:** [San Marcos Codes & Ordinances](https://www.sanmarcostx.gov/1289/Codes-Ordinances); [Ordinance 2023-09 PDF](https://www.sanmarcostx.gov/DocumentCenter/View/32954); [Construction Requirements PDF](https://www.sanmarcostx.gov/DocumentCenter/View/9618) (rev. 2024-05-22).

| Family | Adopted edition | Effective | Local amendments |
|---|---|---|---|
| IRC | **2021** | Apr 1, 2023 | Ord 2023-09; Municode [Ch 14 Buildings](https://library.municode.com/tx/san_marcos/codes/code_of_ordinances?nodeId=SPAGEOR_CH14BUBURE) |
| IBC | **2021** | Apr 1, 2023 | Same |
| IFC | **2021** | Feb 7, 2023 | Municode [Ch 38 Fire](https://library.municode.com/tx/san_marcos/codes/code_of_ordinances?nodeId=SPAGEOR_CH38FIPRPR) |
| IMC / IPC / IFGC | **2021** | Apr 1, 2023 | Ord 2023-09 |
| IECC | **2021** | Apr 1, 2023 | Local amendments in Ord 2023-09 |
| IPMC / IEBC / ISPSC | **2021** | Apr 1, 2023 | Ord 2023-09 |
| NEC | **2020** | Apr 1, 2023 | ⚠️ NEC 2020 not 2023 |
| TAS | **2012** | Statewide | Required per TX state floor |
| A117.1 | **⚠️ unverified** | — | City sources cite TAS + ICC deep-links; separate A117.1 adoption not extracted this recon |

**Layer 3 (local):** San Marcos Development Code (Ord **2025-01**, eff **Jan 25, 2025**) — hosted on **CivicPlus / Ord PDF**, **NOT** on Municode (Sync 5 Phase 2 corrected: Municode `Subpart B - LAND DEVELOPMENT CODE` is an empty placeholder; substantive LDC is off-Municode). Path: partnership / Path-PDF for full L3 ingest.

### Slugs and warm config

```yaml
jurisdiction_key: san_marcos_tx
display_name: "San Marcos, TX"
priority: 1  # live-customer pull-forward
geocode_aliases:
  - "san marcos|tx"
  - "san marcos|texas"

adopted_package:  # manifest base — clone Austin-2021 stock, NOT Austin-2024
  IRC: "2021"
  IBC: "2021"
  IFC: "2021"
  IMC: "2021"
  IPC: "2021"
  IFGC: "2021"
  IECC: "2021"
  IPMC: "2021"
  IEBC: "2021"
  ISPSC: "2021"
  NEC: "2020"
  TAS: "2012"

drivers:
  upcodes:
    # NO city page on UpCodes (verified 404):
    #   up.codes/codes/san_marcos — 404
    #   up.codes/viewer/san_marcos/ibc-2021 — 404
    #   up.codes/viewer/san_marcos/iecc-2021 — 404
    jurisdiction_slug_override:
      # Non-municipality-scoped I-Codes: use Texas statewide viewer
      default: "texas"  # up.codes/viewer/texas/{book}-2021/chapter/{n}/{section}
      # driverProfiles.ts would naïvely emit "san-marcos" from key — MUST override
    municipality_scoped:  # IECC, A117.1 — no UpCodes city page
      IECC-2021: "FALLBACK icc deeplink OR ordinance PDF; expect unverified until ICC creds"
      A117.1-2017: "FALLBACK TAS-2012 deeplink primary; A117.1 unverified"
  icc:
    content_slug: "{BOOK}2021P1"  # e.g. IBC2021P1 — section anchors
  municode:
    client_id: 11581
    library_slug: "san_marcos"
    base_url: "https://library.municode.com/tx/san_marcos/codes/code_of_ordinances"
    scope: "Ch 14 Buildings, Ch 38 Fire, general ordinances — NOT full LDC"
  l3_development_code:
    source: "civicplus_pdf"
    url: "https://tx-sanmarcoscity.civicplus.com/DocumentCenter/View/43018"
    ordinance: "ORD-2025-01"
    effective: "2025-01-25"
    ingest_path: "Path-PDF / partnership — not Municode Path C"

permit_portal: "MyPermitNow"  # per Construction Requirements PDF — not Accela/MyGov family

state_floors:  # apply to all TX jurisdictions
  energy_residential: "2015 IRC Ch 11 (SECO)"
  energy_commercial: "2015 IECC (SECO)"
  accessibility: "2012 TAS (TDLR)"
```

### San Marcos warm readiness assessment

| Path | Ready? | Blocker |
|---|---|---|
| Cold-warm harness (2021 I-Code manifest) | **YES** with slug override | Add `san_marcos_tx` to registry + `texas` UpCodes path for non-muni-scoped books |
| Section-verified grounding (UpCodes) | **PARTIAL** | Core I-Codes via `viewer/texas/*`; **IECC/A117.1 blocked** (no city slug) |
| L3 Municode ingest | **PARTIAL** | General ordinances yes; **LDC requires PDF path** |
| ICC licensed display | **GATED** | ICC credentials (IFC/IPMC families per PR #163) |

**Estimated warm cost:** ~**$1.20–1.80** compute (≈738 manifest refs × $0.002/fetch, same order as Austin B1) + **~1 hr** human review (Ord 2023-09 spot-check + verification gate).

---

## 4. Three-tier demand map

### Tier 1 — pre-warm (bounded; commitment-3 envelope)

**~22 jurisdictions.** Seven major metros + Central Texas cluster. **San Marcos is #1** in execution order.

| Exec order | `jurisdiction_key` | Pop rank | Current | Adopted edition (B2/sourced) | Warm path split |
|---:|---|---:|---|---|---|
| **1** | **`san_marcos_tx`** | 56 | **—** | IBC/IRC **2021** | Texas UpCodes + ICC deeplink; L3 PDF |
| 2 | `houston_tx` | 1 | — | IBC/IRC **2021** (eff Jan 2024) | UpCodes `houston/*-2021` |
| 3 | `san_antonio_tx` | 2 | ENG | IBC/IRC **2024**; IECC **2021** | UpCodes `san-antonio/*`; dual edition |
| 4 | `dallas_tx` | 3 | BLK | IBC/IRC **2021** | UpCodes `dallas/*-2021`; L3 **AmLegal gated** |
| 5 | `fort_worth_tx` | 4 | — | IBC/IRC **2021** | UpCodes; IECC **⚠️ unverified** |
| 6 | `austin_tx` | 5 | L3+WARM | IBC/IRC **2024** | **2024 uplift** (B-rewarm in flight), not greenfield |
| 7 | `el_paso_tx` | 6 | ENG | IBC/IRC **2021**; A117.1 **2009** | UpCodes + El Paso PDF amendments |
| 8 | `arlington_tx` | 7 | — | IBC/IRC **2021** | UpCodes `arlington/*-2021` |
| 9 | `new_braunfels_tx` | corridor | L3 | ⚠️ unverified I-Code | Texas viewer + Municode 3504 |
| 10 | `round_rock_tx` | corridor | L3 | IBC/IRC **2024** | UpCodes `round-rock/*-2024` |
| 11 | `georgetown_tx` | corridor | L3 | ⚠️ unverified | Texas viewer + Municode |
| 12 | `hutto_tx` | corridor | L3 | ⚠️ unverified | Texas viewer + Municode |
| 13 | `leander_tx` | corridor | L3 | ⚠️ unverified | Texas viewer + Municode |
| 14 | `bastrop_tx` | corridor | L3 | ⚠️ unverified | Municode 1169; SmartCity pairing |
| 15 | `cedar_hill_tx` | corridor | L3 | ⚠️ unverified | Municode 1568 |
| 16 | `dripping_springs_tx` | corridor | ENG | ⚠️ unverified | Municode 15829 |
| 17 | `lockhart_tx` | corridor | ENG | ⚠️ unverified | Municode 3055 |
| 18 | `manor_tx` | corridor | ENG | ⚠️ unverified | Municode 15968 |
| 19 | `lago_vista_tx` | corridor | ENG | ⚠️ unverified | Municode 2904 |
| 20 | `wimberley_tx` | corridor | ENG | ⚠️ unverified | Municode 16024 |
| 21 | `killeen_tx` | 21 | ENG | ⚠️ unverified | Municode 2843 |
| 22 | `plano_tx` | 9 | ENG | IBC/IRC **2024** | UpCodes `plano/*-2024`; partial verify |

**Excluded from Tier 1 count (already warm / maintenance-only):** `austin_tx` 2024 uplift is B-rewarm work, not a new jurisdiction slot.

**Net new Tier 1 warms:** **~21** (excluding Austin maintenance).

### Tier 2 — pre-warm-if-cheap (mid-size; web-groundable on demand pull)

**~35 jurisdictions.** Census ranks 8–25 not in Tier 1 + fast-growing DFW/Houston suburbs + partnership-track cities when General Code closes.

| Group | Examples | Trigger |
|---|---|---|
| Remaining top-25 metros | `corpus_christi_tx`, `lubbock_tx`, `laredo_tx`, `irving_tx`, `garland_tx`, `frisco_tx`, `mckinney_tx`, `denton_tx` | User-warm demand OR enterprise tenant |
| DFW suburbs | `mesquite_tx`, `grand_prairie_tx`, `carrollton_tx` | Same |
| eCode360 partnership | `kyle_tx`, `buda_tx`, `pflugerville_tx`, `cedar_park_tx` | Partnership close → drops to Tier 1 |
| Engine snapshot leftovers | `boerne_tx`, `converse_tx`, `copperas_cove_tx`, `elgin_tx`, `pasadena_tx`, `sugar_land_tx`, `taylor_tx` | Cheap if Municode clientId known |
| AmLegal cities | `harker_heights_tx` | Partnership track |

**Cost posture:** Same ~$1–2 + 1hr envelope **per jurisdiction**, but only executed when demand signal or partnership gate clears — not in launch pre-warm batch.

### Tier 3 — demand-driven only (long tail)

**~1,150+ municipalities** (places under ~20,000 pop + unincorporated county AHJs).

**Mechanism:** 59 item 1 user-warm coverage-escalation:

1. Warm-what-we-can web-first on first address resolution
2. Honest coverage report (`unverified-web-source` pill where applicable)
3. Internal escalation to team with gap detail
4. Team curates from authoritative sources; **only verified content enters shared corpus**
5. **Never** ingest user-supplied content into shared corpus

**No pre-warm.** Every warm-my-area event is a demand signal that reprioritizes Tier 2.

---

## 5. Tier 1 cost envelope sizing

### Per-jurisdiction model (commitment 3)

| Cost component | Tier 1 estimate | Source |
|---|---|---|
| Web-first warm compute | **$1.00–2.00** | Austin B1 = $1.11 for 725 atoms; B2 cites $0.002/fetch |
| Human review (curation/admission) | **~1 hour** | ADR-019 + decision premortem |
| One-time harness/registry (amortized) | ~$0.05/jurisdiction at 21 cities | Austin-2024 pattern reuse |

### Tier 1 aggregate

| Metric | Value |
|---|---|
| Net-new jurisdictions | **~21** (excl. Austin 2024 maintenance) |
| Total compute | **~$21–42** |
| Total review hours | **~21 hours** |
| vs flat-batch 1,225 | **~60× cheaper compute; ~60× fewer review hours** |

**Within commitment 3:** ✅ Each jurisdiction stays under $200 compute and ~1hr review.

### Verifiable vs gated split (Tier 1)

| Split | Families / jurisdictions | Warm driver | Expected verification |
|---|---|---|---|
| **UpCodes section-verifiable** | IRC, IBC, IMC, IPC, IFGC, IEBC, IPMC @ 2021/2024 for cities **with** UpCodes slug OR `texas` statewide viewer | `up.codes/viewer/{slug}/{book}/chapter/{n}/{section}` | **verified-warmed** after PR #163 driver |
| **UpCodes municipality-scoped** | IECC, A117.1 — Austin, SA, Round Rock, Plano, **NOT San Marcos** | Per-city slug required | SA: dual edition; SM: **blocked → ICC deeplink / unverified** |
| **ICC-creds-gated** | IFC, IPMC (PR #163: 0% on UpCodes 404) | ICC Digital Codes API / partnership | Deeplink-only until ICC creds |
| **License-gated** | NEC 2020/2023, NFPA 101 | NFPA deeplink | deeplink-only (correct) |
| **TDLR web-groundable** | TAS 2012 statewide | TDLR HTML | New manifest track (B2 rank #6) |
| **Municode slug L3** | Central TX cities with clientId | `api.municode.com` | L3 corpus; separate from reasoning warm |
| **Partnership L3** | Dallas (AmLegal), Kyle/Buda/Pflugerville (eCode360) | Blocked until partnership | L3 missing; reasoning can still warm |

### San Marcos-specific fault line

San Marcos is the **only Tier 1 city with no UpCodes viewer page**. Warm config **must** set `jurisdiction_slug_override: texas` for non-muni-scoped books and accept `unverified-web-source` for IECC until either (a) UpCodes adds `san_marcos`, or (b) ICC credentials land.

---

## 6. Execution path

### Tier 1 — cold-warm harness (Austin-2024 pattern)

Per jurisdiction, post-launch (San Marcos pulled forward):

1. **Registry row** — `jurisdiction_key`, adopted-edition manifest (YAML), UpCodes slug overrides, Municode clientId
2. **Manifest generation** — clone stock 2021 (or 2024) package; adjust NEC edition, IECC slug, UMC/UPC for Austin-class cities
3. **Harness run** — `pnpm --filter @workspace/codewarm warm --jurisdiction {key}` (same path as B1/B-rewarm)
4. **Verification gate** — spot-check N sections; team 1hr review; only verified → shared corpus admission
5. **Geocode alias** — append to `centralTexasPilot.ts` / jurisdiction resolver

**Order:** San Marcos → Houston → San Antonio → Dallas → Fort Worth → El Paso → Arlington → Central TX cluster (population order within cluster).

**NOT a flat batch:** each jurisdiction is an independent harness run with its own review gate. No loop over 1,225 cities.

### Tiers 2–3 — user-warm coverage-escalation (59 item 1)

On first engagement in an unwarmed jurisdiction:

1. Auto-discover adoption facts web-first (city codes page, UpCodes, Municode)
2. Warm what we can verify (reasoning atoms, honest `verification_state`)
3. Surface coverage report to user (55 §7 honesty pill)
4. Escalate gap internally; team curates; user gets follow-up
5. Demand signal reprioritizes Tier 2 queue

**Hard guardrail:** No user-supplied content into shared corpus (58 acceptance criterion; 59 item 1).

### What this recon does NOT authorize

- Flat batch ingest of ~1,225 Texas municipalities
- Pre-warm of Tier 3 long tail without demand signal
- Treating "725 atoms on Austin" as "725 verified" (B2 P0 still applies until driver + edition uplift land)

---

## 7. Adoption cells flagged unverified

| Cell | Status |
|---|---|
| Fort Worth — IECC, IFC, IMC, IPC, NEC | B2 partial — only IBC/IRC ordinance fetched |
| Plano — full package beyond IBC/IRC 2024 | B2 partial |
| Bastrop network — I-Code editions | B2 unverified — L3 muni only |
| San Marcos — A117.1 adoption | Not extracted; TAS statewide applies |
| San Marcos — UpCodes city slug | **Confirmed absent** (404) |
| Georgetown, Hutto, Leander, New Braunfels — exact I-Code editions | Corpus L3 only; adoption ordinance not re-fetched this recon |
| Corpus Christi, Lubbock, Laredo — adoption package | Tier 2; not sourced this recon |

---

## 8. Sources consulted

| Doc | Path |
|---|---|
| Demand-driven decision | `_decisions/2026-06-10_texas_coverage_demand_driven.md` |
| B2 gap analysis | `_inbox/2026-06-10_legacy-design-tools_cc-agent-C_texas_coverage_gap_analysis.md` |
| User-warm mechanism | `59_spine_moat_and_high_value_features.md` §1 |
| Layered substrate | `80_adrs/adr_019_layered_code_substrate.md` |
| Engine keys | `legacy-design-tools/lib/codes/src/centralTexasPilot.ts` |
| Driver profiles | `legacy-design-tools/lib/codes/src/webCodeFetch/driverProfiles.ts` |
| Sync 5 discovery | `_sessions/2026-05-22_sync5_tier2_central_tx_discovery_cc-agent-E.md` |
| San Marcos codes | `sanmarcostx.gov/1289/Codes-Ordinances` |
| Census rankings | SUB-IP-EST2024-ANNRNK / Wikipedia Cities of Texas |

---

## 9. Operator decisions requested

1. **Confirm Tier 1 list (~22)** — especially inclusion of `plano_tx` (pop 9) and exclusion of `corpus_christi_tx` (pop 8) in Tier 1 vs Tier 2.
2. **Authorize San Marcos warm** as first net-new harness run (config in §3).
3. **Accept IECC/A117.1 unverified fallback** for San Marcos until UpCodes city page exists or ICC creds land.
4. **Sequence post-launch:** San Marcos → remaining Tier 1 metros → user-warm thin (58 step 9) for Tier 3 tail.

---

*Read-only recon. No code, schema, warming, branch, or PR. cc-agent-C2 on Grok Build 0.1; no Claude escalation required.*
