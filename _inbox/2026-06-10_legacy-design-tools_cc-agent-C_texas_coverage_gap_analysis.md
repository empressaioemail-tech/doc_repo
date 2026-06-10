---
id: 2026-06-10_legacy-design-tools_cc-agent-C_texas_coverage_gap_analysis
date: 2026-06-10
agent: cc-agent-C
repo: legacy-design-tools
branch: main
dispatch: 2026-06-10_cc-agent-C_texas_coverage_gap_analysis
status: COMPLETE — read-only recon (B2)
model: Grok Build 0.1 (HR-12 default; no Claude escalation)
sprint: 58 Front B step B2
related: [57_national_code_warming_sprint, 58_gtm_readiness_sprint, 80_adrs/adr_019_layered_code_substrate, 2026-06-09_legacy-design-tools_cc-agent-C_codewarm_runs]
---

# Texas coverage gap analysis (B2)

Read-only recon. Live Neon queries at `2026-06-10T15:37:48Z` via ephemeral `lib/codewarm/scripts/b2-recon.mts` (not committed). No schema, corpus, warming, or PR.

## Workspace gate

```
On branch main
Your branch is up to date with 'origin/main'.

Changes not staged for commit:
	modified:   .claude/worktrees/recon-add-jurisdiction (untracked content)
	modified:   .claude/worktrees/track-b-ifc-ingest (modified content, untracked content)

Untracked files:
	lib/codewarm/scripts/

no changes added to commit (use "git add" and/or "git commit -a")
---
96aa589 Merge pull request #162 from empressaioemail-tech/codewarm/harness-fix
499b226 test(codes): driver profile URL builders for Texas and Florida paths
923b119 fix(codewarm): parser quoted sections, national Texas drivers, slug config
```

---

## P0 — Verification-quality fill (single biggest grounded lever)

B1 persisted **725 atoms** on `austin_tx`, but only **173 (23.9%)** carry `verification_state = verified`. Of those 173, **40 are NFPA/NEC deeplink-only stubs** (verified deeplink, zero grounded snippet). The remaining **133 "verified"** are corpus-overlay atoms — and the Texas corpus contains **zero Layer-1 I-Code base atoms** (see HAVE below). Overlay matching is section-number/title fuzzy collision against Layer-3 local ordinance text, not authoritative I-Code section bodies.

**The launch gap in plain terms:**

| Category | Count | % of 725 | Launch value |
|---|---:|---:|---|
| **unverified-warmed** | **552** | **76.1%** | Atom exists; deeplink present; **not grounded** — ICC/UpCodes driver fetched book/chapter landing HTML |
| verified-corpus (overlay) | 133 | 18.3% | Verified flag; corpus link — **may be spurious** against local UDC, not I-Code base |
| deeplink-only (NFPA/NEC) | 40 | 5.5% | License-gated; correct per manifest flags |
| verified-warmed (web body) | **0** | **0%** | **None** — no manifest ref has verified section HTML from web fetch |
| missing (manifest − persisted) | 13 | — | Federal ADA `corpus-skipped` (already in corpus path; no new atom) |

### Recommendation

| Path | What it closes | Gated? | Size |
|---|---|---|---|
| **A. Driver-quality fix (recommended first)** | Upgrade **552** `unverified-web-source` → `verified` via **section-level HTML extraction from UpCodes** (web-first; Texas statewide `up.codes/viewer/texas/{book}-2021/chapter/{n}` + municipality slugs for IECC/A117.1) | No — engineering only | **552 atoms** on `austin_tx`; re-warm cost ≈ **$1.10** at $0.002/fetch; one harness PR + re-run B1 |
| B. ICC Code Connect licensed tier | Same 552 + enables `displayMode: licensed` and true ICC section bodies | **Yes** — ICC credentials/partnership (ADR-019 material update) | Subscription + ingest pipeline; parallel to A |
| C. Both A then B | A for launch grounding; B for licensed display upgrade post-ICC cutover | A now; B when creds land | A is launch-gating; B is enhance phase |

**Do not treat "725 atoms persisted" as "725 grounded references."** Until path A (or B) lands, the Texas library is **citation + working deeplink + honest unverified flag** — sellable only with the uniform provenance envelope's verification state exposed honestly (58 launch gate).

---

## HAVE — enumerated from live stores

### Corpus retrieval layer (`code_atoms`, Texas)

**Total: 4,754 atoms** where `jurisdiction_key LIKE '%_tx'`.

**Critical finding (ADR-019):** The Texas corpus is **Layer 3 only** — local UDC/zoning/municipal ordinance text. **No Layer-1 model-code base** (IRC/IBC/IECC/IFC/IMC/IPC/IFGC) atoms exist in `code_atoms` for any Texas jurisdiction.

| jurisdiction_key | Atoms | code_book / edition (live) | Layer |
|---|---:|---|---|
| `austin_tx` | 1,810 | SUBSTRATE — Austin Land Development Code (current supplement) | L3 local |
| `hutto_tx` | 1,376 | SUBSTRATE — Hutto UDC (March 2024) | L3 local |
| `georgetown_tx` | 571 | SUBSTRATE — Georgetown UDC (current supplement) | L3 local |
| `round_rock_tx` | 276 | SUBSTRATE — Round Rock Zoning & Development Code (current supplement) | L3 local |
| `cedar_hill_tx` | 206 | MUNI_CODE — Code of Ordinances (current) | L3 local |
| `bastrop_tx` | 189 | MUNI_CODE — Code of Ordinances (current supplement) | L3 local |
| `new_braunfels_tx` | 170 | SUBSTRATE — New Braunfels Development Regulations (current supplement) | L3 local |
| `leander_tx` | 156 | SUBSTRATE — Leander Code of Ordinances (current supplement) | L3 local |

**8 Texas jurisdictions** on deployment Neon. Engine snapshot lists 34 `_tx` keys (`lib/codes/src/centralTexasPilot.ts`); **26 are engine-only / not yet on this Neon corpus.**

Federal ADA/FHA and TAS are **not** present as distinct `code_book` families in the Texas corpus query — accessibility "corpus-covered" overlays in B1 matched fuzzy section tokens inside local ordinance atoms.

### Reasoning layer (`reasoning_atoms`)

**Total Texas-relevant: 725 on `austin_tx`** (B1 manifest warm). Six stale atoms on `miami_beach_fl` (pre-B1; out of Texas scope).

#### Five-way split (first-class dimension)

| State | Count | Notes |
|---|---:|---|
| verified-corpus | 133 | `verification_state=verified` + reasoning cites corpus atom; overlay-not-reground |
| verified-warmed | 0 | No web fetch produced `verified` section body |
| **unverified-warmed** | **552** | `unverified-web-source`; landing HTML |
| deeplink-only | 40 | NEC 24 + NFPA 101 16; `snippet=null`; NFPA-license-required |
| missing | 13 | Manifest refs corpus-skipped (federal ADA); no reasoning atom created |

#### Per family × edition (`austin_tx` reasoning only)

| Family | Edition | Total | verified-corpus | verified-warmed | unverified-warmed | deeplink-only | missing |
|---|---|---:|---:|---:|---:|---:|---:|
| IRC | 2021 | 117 | 2 | 0 | 115 | 0 | 0 |
| IBC | 2021 | 98 | 46 | 0 | 52 | 0 | 0 |
| IEBC | 2021 | 34 | 22 | 0 | 12 | 0 | 0 |
| **IECC** *(muni-scoped)* | 2021 R+C | 101 | 1 | 0 | 100 | 0 | 0 |
| IMC | 2021 | 57 | 10 | 0 | 47 | 0 | 0 |
| IPC | 2021 | 46 | 11 | 0 | 35 | 0 | 0 |
| IFGC | 2021 | 34 | 3 | 0 | 31 | 0 | 0 |
| IFC | 2021 | 91 | 3 | 0 | 88 | 0 | 0 |
| IPMC | 2021 | 51 | 1 | 0 | 50 | 0 | 0 |
| **A117.1** *(muni-scoped)* | 2017 | 46 | 34 | 0 | 12 | 0 | 0 |
| ADA | 2010 | 3 | 0 | 0 | 3 | 0 | ~10 skipped |
| FHA | 24 CFR | 7 | 0 | 0 | 7 | 0 | 0 |
| NEC | 2020 | 24 | 0 | 0 | 0 | 24 | 0 |
| NFPA 101 | 2021 | 16 | 0 | 0 | 0 | 16 | 0 |
| **Total** | | **725** | **133** | **0** | **552** | **40** | **13** |

**Municipality-scoped families (B1 stock harness):**
- **IECC 2021:** 101 atoms, Austin slug `austin/iecc-2021` — 100 unverified-warmed, 1 verified-corpus
- **A117.1 2017:** 46 atoms, Austin slug `austin/icc-a117.1-2017` — 12 unverified-warmed, 34 verified-corpus

**All other Texas jurisdictions:** **missing** on reasoning layer (0 atoms).

---

## NEED — Texas launch geography (sourced adoption)

Texas is **not a single statewide I-Code edition**. SECO sets a **state energy floor**; each metro adopts its own technical code package by ordinance. IECC and A117.1 are **municipality-scoped** on UpCodes (per-metro slug required). **TAS (2012)** is the state accessibility standard (TDLR), distinct from federal ADA/FHA and from ICC A117.1.

### Statewide baseline (SECO / TDLR)

| Need | In-force edition | Source | Verified? |
|---|---|---|---|
| Residential energy (1–2 family ≤3 stories) | **2015 IRC Chapter 11** (effective Sept 1, 2016) | [SECO single-family](https://comptroller.texas.gov/programs/seco/code/single-family.php) | ✅ |
| Commercial / multi-family energy | **2015 IECC** (effective Nov 1, 2016) | [SECO commercial](https://comptroller.texas.gov/programs/seco/code/commercial.php) | ✅ |
| 2021 IECC statewide | **NOT adopted** — rulemaking blocked (SB 783 cleanup) | [TX Capitol SB 783 analysis](https://capitol.texas.gov/tlodocs/89R/analysis/html/SB00783I.htm) | ✅ |
| State accessibility | **2012 TAS** (effective March 15, 2012) | [TDLR TAS](https://www.tdlr.texas.gov/ab/abtas.htm); [TX Governor accessibility](https://gov.texas.gov/organization/disabilities/building_accessibility) | ✅ |

### Major-metro I-Code adoption (launch set)

| Metro | jurisdiction_key | IRC | IBC | IECC | IFC | IMC/IPC | NEC | Accessibility | Source | Verified? |
|---|---|---|---|---|---|---|---|---|---|:---:|
| **Austin** | `austin_tx` | **2024** (eff Jul 10, 2025) | **2024** | **2024** muni | **2024** | UMC/UPC **2024** | **2023** | TAS 2012 + A117.1 (ICC) | [Austin technical codes](https://www.austintexas.gov/development-services/building-technical-codes) | ✅ |
| **Houston** | `houston_tx` | 2021 (eff Jan 1, 2024) | 2021 | 2021 + ASHRAE 90.1-2013 | 2021 | UMC/UPC 2021 | 2023 | TAS 2012 | [Houston CE-1199 codes PDF](https://www.houstonpermittingcenter.org/media/2001/download?inline=); [HPC archive](https://www.houstonpermittingcenter.org/houston-code-archive) | ✅ |
| **San Antonio** | `san_antonio_tx` | **2024** (eff May 1, 2025) | **2024** | **2021** *(excluded from 2024 cycle)* | **2024** | 2024 IMC/IPC/IFGC | 2023 | TAS 2012 | [SA DSD codes](https://www.sa.gov/Directory/Departments/DSD/Codes-Ordinances); [Ord 2025-01-30-0075 PDF](https://docsonline.sanantonio.gov/DSDUploads/2024Ch10Building-RelatedCodesFinal.pdf) | ✅ |
| **Dallas** | `dallas_tx` | 2021 (eff May 12, 2023) | 2021 | 2021 | 2021 IFC Ch16 amend | 2021 IMC/IPC/IFGC | 2020 | TAS 2012 | [Dallas know_code](https://dallascityhall.com/departments/sustainabledevelopment/buildinginspection/Pages/know_code.aspx) | ✅ |
| **Fort Worth** | `fort_worth_tx` | 2021 (eff Apr 1, 2022) | 2021 | ⚠️ **not verified this recon** | ⚠️ | ⚠️ | ⚠️ | TAS 2012 | [AmLegal §7-46 IBC 2021](https://codelibrary.amlegal.com/codes/ftworth/latest/ftworth_tx/0-0-0-5962) — IBC/IRC only | **partial** |
| **El Paso** | `el_paso_tx` | 2021 | 2021 | 2021 | 2021 | 2021 IMC/IPC/IFGC | 2020 | **TAS + ICC/ANSI A117.1 2009** | [El Paso adopted codes PDF](https://www.elpasotexas.gov/assets/Documents/CoEP/Planning-and-Inspections/Applications/Building-Permit-Applications/Adopted-Codes-and-Amendments.pdf) | ✅ |
| **Arlington** | `arlington_tx` | 2021 | 2021 | 2021 | 2021 | 2021 IMC/IPC | 2020 | TAS 2012 | [Arlington 2021 ordinance PDF](https://cdnsm5-hosted.civiclive.com/UserFiles/Servers/Server_14481062/File/City%20Hall/Depts/PDS/Permit%20&%20Inspect/Codes%20&%20Ordinances/2021_Construction_Chapter_Amendment_Ordinance.pdf) | ✅ |
| **Plano** | `plano_tx` | **2024** (eff Aug 1, 2024) | **2024** | ⚠️ **not verified** | ⚠️ | ⚠️ | ⚠️ | TAS 2012 | [Plano building codes page](https://www.plano.gov/2286/Building-Codes-Ordinances) — 2024 tab | **partial** |
| **Round Rock** | `round_rock_tx` | **2024** | **2024** | **2024** | **2024** | 2024 IMC/IPC | 2023 | TAS 2012 | [Round Rock adopted codes](https://www.roundrocktexas.gov/city-departments/planning-and-development-services/building-inspection/) | ✅ |
| **Bastrop network** | `bastrop_tx` etc. | ⚠️ **not verified** | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | TAS 2012 | Corpus has muni code only; adoption ordinance not fetched this recon | **unverified** |

**Edition-drift flag:** B1 warmed **2021 manifest editions** against `austin_tx`. Austin, San Antonio (partial), Plano, and Round Rock have since moved to **2024** I-Codes. Houston, Dallas, Fort Worth, El Paso, Arlington remain on **2021** for core I-Codes — good alignment with manifest base for those metros, **wrong edition for Austin launch**.

**Dallas note:** `BLOCKED_CITY_STATE_KEYS` in `centralTexasPilot.ts` — AmLegal partnership path; not in Neon corpus. Launch need exists; ingest path gated.

---

## Matrix template (reusable — swap jurisdiction columns for post-ICC expansion)

**Legend per cell:** `VC` verified-corpus · `VW` verified-warmed · `UW` unverified-warmed · `DL` deeplink-only · `—` missing · `L3` Layer-3 local corpus only

**Columns:** `TX_STATE` = SECO/TDLR floor · launch metros · `CORPUS_L3` = local ordinance atoms

### I-Code families — 2021 manifest edition (B1 base)

| Family × edition | TX_STATE need | CORPUS_L3 (TX) | austin_tx | houston_tx | san_antonio_tx | dallas_tx | fort_worth_tx | el_paso_tx | arlington_tx |
|---|---|---|---|---|---|---|---|---|---|
| IRC 2021 | 2015 Ch11 energy only | L3 only (4,754 local) | UW115 VC2 | — | — | — | — | — | — |
| IBC 2021 | — | L3 only | UW52 VC46 | — | — | — | — | — | — |
| IEBC 2021 | — | L3 only | UW12 VC22 | — | — | — | — | — | — |
| IECC 2021 *(muni)* | 2015 IECC statewide | L3 only | UW100 VC1 | — | — | — | — | — | — |
| IMC 2021 | — | L3 only | UW47 VC10 | — | — | — | — | — | — |
| IPC 2021 | — | L3 only | UW35 VC11 | — | — | — | — | — | — |
| IFGC 2021 | — | L3 only | UW31 VC3 | — | — | — | — | — | — |
| IFC 2021 | — | L3 only | UW88 VC3 | — | — | — | — | — | — |
| IPMC 2021 | — | L3 only | UW50 VC1 | — | — | — | — | — | — |

### Accessibility + license-gated

| Family × edition | TX_STATE need | austin_tx | other launch metros |
|---|---|---|---|
| **TAS 2012** | **Required statewide** | — (not warmed) | — |
| A117.1 2017 *(muni)* | Per-metro ICC edition | UW12 VC34 | — (El Paso uses **A117.1 2009** per El Paso PDF) |
| ADA 2010 | Federal | UW3 + 13 skipped | — |
| FHA | Federal | UW7 | — |
| NEC 2020 | License-gated | DL24 | — |
| NFPA 101 2021 | License-gated | DL16 | — |

### How to retarget (post-ICC geography expansion)

1. Replace column headers with target state metros.
2. Add rows for adopted edition (e.g. `IRC 2024` row when manifest gains 2024).
3. Re-query `code_atoms` + `reasoning_atoms` per `jurisdiction_key`.
4. Keep the five-way cell vocabulary — do not collapse `UW` into `have`.

---

## Prioritized fill-list (Texas launch demand)

Ranked by **metro population × review likelihood × grounding gap**. Population order (2024 est.): Houston → San Antonio → Dallas → Austin → Fort Worth → El Paso → Arlington.

| Rank | Fill item | Family / edition / jurisdiction | Authoritative source | Layer | Groundable now? | Size |
|:---:|---|---|---|---|:---:|---|
| **1** | **Driver section-HTML extraction + re-warm** | All I-Code manifest refs · `austin_tx` (then clone per metro) | UpCodes Texas viewer + ICC chapter URLs | L1 reasoning | **Yes** (web-first) | **552 UW atoms** → verified; ~$1.10 re-warm + 1 harness PR |
| **2** | **Edition uplift Austin** | IRC/IBC/IECC/IFC/IMC/IPC 2024 · `austin_tx` | [Austin technical codes](https://www.austintexas.gov/development-services/building-technical-codes); UpCodes `austin/*-2024` | L1 base + L2 amend | Yes after #1 | New 2024 manifest or re-warm 738 refs; **launch-gating** — B1 used wrong edition |
| **3** | **Expand warm to Houston** | 738 manifest refs @ 2021 · `houston_tx` | UpCodes `houston/*-2021`; Houston amendments PDF | L1 + L2 | Yes after #1 | 738 atoms × ~$1.50 fetch est. |
| **4** | **Expand warm to Dallas** | 738 @ 2021 · `dallas_tx` | UpCodes `dallas/*-2021`; Dallas City Hall code chapters | L1 + L2 | Yes; corpus ingest **gated** (AmLegal) | 738 atoms; partnership for L3 |
| **5** | **Expand warm to San Antonio** | 738 @ 2024 I-Codes + **2021 IECC** · `san_antonio_tx` | [SA Chapter 10 PDF](https://docsonline.sanantonio.gov/DSDUploads/2024Ch10Building-RelatedCodesFinal.pdf); `san_antonio/iecc-2021` slug | L1 + L2 | Yes; IECC muni-scoped | 738 atoms; dual edition |
| **6** | **TAS 2012 warm track** | TAS 2012 · statewide + per metro | [TDLR TAS](https://www.tdlr.texas.gov/ab/abtas.htm) | State accessibility | Web-groundable (TDLR HTML) | Not in B1 manifests — **new manifest**; size TBD (~50–100 high-traffic sections est.) |
| **7** | **IECC municipality slugs** | IECC per metro | UpCodes `/{city}/iecc-{year}` | L1 muni | Yes | 6 launch metros × ~101 refs |
| **8** | **A117.1 municipality slugs** | A117.1 per metro edition | UpCodes `/{city}/icc-a117.1-{year}`; El Paso **2009** not 2017 | L1 muni | Partial (ICC chapter stubs) | 46 refs/metro; driver fix helps |
| **9** | **Fort Worth / Arlington / El Paso warm** | 738 @ 2021 | AmLegal / city PDFs / UpCodes | L1 + L2 | Yes after #1 | 738 atoms each |
| **10** | **Layer 2 local amendments** | Per-metro deltas on I-Code sections | Municode / eCode360 / city PDF | L2 amend | Yes (jurisdiction-authored) | Overlays on shared L1 base |
| **11** | **Layer 3 expansion** | UDC/zoning gaps | Existing ingest adapters | L3 local | Yes — 26 engine keys not on Neon | 26 jurisdictions × ~$200 target (ADR-019) |
| **12** | **NFPA licensed track** | NEC / NFPA 101 | nfpa.org | L1 | **License-gated** | 40 deeplink atoms today; full text needs NFPA license |
| **13** | **ICC licensed tier** | All I-Codes | Code Connect API | L1 corpus | **Creds-gated** | Upgrades corpus + reasoning to `licensed` display |

---

## Adoption cells not verified (flagged)

| Cell | Why unverified |
|---|---|
| Fort Worth — IECC, IFC, IMC, IPC, NEC editions | Only IBC 2021 ordinance fetched; remaining codes not cross-checked against city source this recon |
| Plano — full code package beyond IBC/IRC 2024 | Building codes page confirms 2024 effective Aug 1, 2024; mechanical/plumbing/energy editions not individually sourced |
| Bastrop network — I-Code editions | `bastrop_tx` corpus is muni ordinances only; technical code adoption ordinance not retrieved |
| San Antonio — accessibility (A117.1 vs TAS only) | Chapter 10 PDF lists I-Codes; TAS/A117.1 adoption language not extracted |
| txenergycode.com 2018 IECC claim | Conflicts with SECO official pages (still 2015 IECC). **SECO comptroller.texas.gov treated as authoritative**; txenergycode.com flagged as unreliable third-party |
| Corpus-overlay "verified" for I-Codes | Mechanism matches section tokens in L3 local text — **not verified as true I-Code coverage** |

---

## Blockers (verbatim)

1. **Zero verified-warmed web atoms.** 552/552 web fetches returned `unverified-web-source`. Launch sells grounded reasoning; this is the P0 engineering fill (driver section HTML), not a matrix cell to bury.

2. **Edition drift on Austin launch metro.** B1 warmed IRC/IBC/IECC 2021; Austin in-force is **2024** (eff July 10, 2025). Wrong-edition refusal works; wrong-edition *coverage* does not.

3. **No Layer-1 I-Code corpus in Texas.** 4,754 corpus atoms are L3 local only. ADR-019 Layer-1 base is entirely on the reasoning layer (or future ICC ingest). Corpus-vs-reasoning split is asymmetric.

4. **Reasoning geography = Austin only.** 725 atoms on one jurisdiction; Houston/Dallas/SA/FW/El Paso/Arlington have zero reasoning atoms.

5. **IECC + A117.1 municipality-scoped.** B1 wired Austin slugs only. Each new metro needs its own UpCodes slug and edition (El Paso A117.1 **2009** ≠ Austin **2017**).

6. **TAS not in warm set.** State accessibility standard absent from six B1 manifests and reasoning layer.

7. **NFPA / ICC license-gated.** 40 deeplink-only atoms correct; NEC/NFPA full text and ICC licensed display await partnership/credentials (57 parked enhance phase).

8. **Dallas AmLegal blocked.** `blocked_partnership` in geocoder; L3 corpus ingest path unavailable without partnership close.

---

## Acceptance criteria

| Criterion | Status |
|---|---|
| HAVE from live stores, per-cell, corpus vs reasoning split | ✅ |
| Five-way verified split (not atom-count-only) | ✅ |
| NEED sourced per metro; IECC/TAS called out | ✅ |
| Reusable matrix template | ✅ |
| Prioritized fill-list with source + layer + groundable | ✅ |
| P0 verification-quality fill sized and called out | ✅ |
| Unverified adoption cells flagged | ✅ |
| Read-only (no schema/corpus/warm/PR) | ✅ |

**B2 COMPLETE.** Recommended next dispatch: **driver-quality fix + Austin 2024 edition uplift + re-warm** (closes P0 #1 and #2), then **metro-expanded B1** for Houston/Dallas/San Antonio.
