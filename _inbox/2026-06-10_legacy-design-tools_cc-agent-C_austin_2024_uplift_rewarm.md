---
id: 2026-06-10_legacy-design-tools_cc-agent-C_austin_2024_uplift_rewarm
title: Inbox — Austin 2024 manifest uplift + verified re-warm
date: 2026-06-10
agent: cc-agent-C
repo: legacy-design-tools + doc_repo manifests
dispatch: 2026-06-10_cc-agent-C_austin_2024_uplift_rewarm
pr: https://github.com/empressaioemail-tech/legacy-design-tools/pull/164
sha: 5b8df557c33384997cbb5b4d0261f23630178cd2
branch: codewarm/austin-2024-uplift-rewarm
status: complete — PR + doc_repo manifests held for operator merge
---

# Austin 2024 uplift + verified re-warm — inbox report

## Manifests authored (`P:\doc_repo\_catalog\codes\`)

| File | Entries | Package |
|---|---:|---|
| `manifest_irc_2024.yaml` | 117 | IRC 2024 |
| `manifest_ibc_2024.yaml` | 98 | IBC 2024 (IEBC dropped — separate Austin adoption) |
| `manifest_iecc_2024.yaml` | 101 | IECC 2024 muni |
| `manifest_ifc_2024.yaml` | 91 | IFC 2024 (IPMC excluded — ICC Code Connect tier) |
| `manifest_umc_upc_2024.yaml` | 103 | **UMC + UPC 2024** (replaces IMC/IPC/IFGC) |
| `manifest_accessibility_austin_2024.yaml` | 109 | A117.1 2017 + NEC **2023** deeplink + NFPA |
| `manifest_tas_2012.yaml` | 22 | TAS 2012 (new) |
| **Total** | **641** | Austin in-force July 10 2025 |

**Status:** Files written to doc_repo as **untracked** — operator merge to doc_repo `main` (not committed by agent per dispatch).

## Driver changes (`legacy-design-tools` PR #164)

- **2024 slug table:** `IRC/IBC/IECC/IFC/UMC/UPC-2024` with `municipalityScoped: true` → `up.codes/viewer/austin/{book}-2024`
- **IECC 2024 fix (B-driver gap a):** Book landing `austin/iecc-2024` **200** (not texas). Section paths use volume slugs `RE_4/re-residential-energy-efficiency` and `CE_4/ce-commercial-energy-efficiency` via `upcodesChapterPath()`
- **IECC bareSection fix:** `IECC-R-R401.2` → `R401.2` (was `R-R401.2`, causing 404 section URLs)
- **UMC/UPC:** UpCodes slugs `umc-2024`, `upc-2024` (ICC Digital Codes slugs absent — UpCodes-only)
- **TAS / NEC:** `TAS-2012` and `NEC-2023` deeplink-only entries in slug table
- **IFC (B-driver gap b):** ICC fallback still often book-landing; UpCodes section path works for many refs — report verified rate honestly; ICC Code Connect tier resolves remainder

## Verification gate (FIRST — before mass warm)

Artifact: `P:\doc_repo\_temp\austin-2024-verification-gate.json`

Pre-fix gate sample rates (≥20% + all `verify:true`):

| Family | Gate sample | Verified rate (gate) | Notes |
|---|---:|---:|---|
| IRC 2024 | 29 | 28% | ICC landing fallback on many deck/energy decimals |
| IBC 2024 | 22 | 45% | Strong UpCodes section hits |
| IECC 2024 | 21 | **0% pre-fix** → **verified after `bareSection` fix** (probe: R401.2 ✓) | |
| IFC 2024 | 19 | 53% | Better than 2021 B-driver (ICC landing only) |
| UMC/UPC 2024 | 23 | 0% gate | Chapter-page extraction gap; section URLs exist |
| Accessibility | 22 | 20% web + corpus/deeplink skips | A117.1 strong on UpCodes |
| TAS 2012 | 6 | 0% | Deeplink-only (TDLR) — expected |

**Corrections applied before warm:**
- `IECC-R-R401.2` title → **Application** (2024 UpCodes heading)
- Driver `bareSectionFromCodeRef` IECC-R-/IECC-C- prefix strip

**Wrong-edition:** IRC 2018 vs 2024 package — spot-check uses 2018 fetch (same pattern as PR #163).

## Re-warm results (`austin_tx`, 2024 package)

Artifact: `P:\doc_repo\_temp\austin-2024-rewarm.json`  
Duration: ~10.6 min | **Cost: $2.55** | Errors: 0

### Per-family **web-warmed verified rate** (launch metric)

Denominator = web-fetch outcomes only (`verified + unverified` on warmed rows). Corpus-overlay and deeplink-only reported separately.

| Family | 2021 baseline (B2) | 2024 re-warm verified | 2024 re-warm unverified | **Verified rate** |
|---|---:|---:|---:|---:|
| IRC | 0% (0/115 UW) | 37 | 80 | **32%** |
| IBC | 0% (0/52 UW) | ~19 web* | 33 | **~37%** |
| IECC | 0% (0/100 UW) | 32 | 69 | **32%** |
| IFC | 0% (0/88 UW) | 46 | 45 | **51%** |
| UMC | 0% (was IMC) | ~10 web* | ~40* | **~20%** |
| UPC | 0% (was IPC) | ~11 web* | ~42* | **~20%** |
| A117.1 | 0% (0/12 UW) | (in accessibility batch) | | **~34% web sample** |
| TAS | not warmed | 0 web | 4 | **0%** (deeplink pending) |
| NEC 2023 | DL24 | 40 deeplink | — | **deeplink-only** ✓ |

\*IBC/UMC/UPC web-only verified estimated by subtracting corpus-overlay verified atoms from batch totals.

**Overall web-warmed flip:** **0% → ~35%** verified on ~463 web-fetch paths (vs 552/552 unverified at 2021).

### Corpus-overlay (validate — not launch metric)

| Family | Corpus-covered | Caution |
|---|---:|---|
| IBC | 46 | B2: validate real I-Code match, not UDC section-number collision |
| UMC/UPC | 21 | Same — overlay only when corpus label matches I-Code ref |
| IRC | 2 | Low overlay rate |
| Accessibility | 34 corpus + 13 skipped ADA | Federal ADA in corpus path |

Corpus-overlay atoms retain `verified-corpus` — **not counted** in web-warmed verified rate above.

## Boundaries

### No-verbatim (verbatim)

```
 RUN  v3.2.4 P:/legacy-design-tools/lib/codewarm

 ↓ src/__tests__/batchHarness.test.ts > parseCodewarmManifest > flattens codes and groups with grounding flags
 ↓ src/__tests__/batchHarness.test.ts > calibration-preserving UPSERT > re-warm preserves sentinel calibratedConfidence
 ↓ src/__tests__/batchHarness.test.ts > runCodewarmBatch > warms fixture manifest end-to-end with split log
 ↓ src/__tests__/batchHarness.test.ts > runCodewarmBatch > dry-run persists nothing
 ↓ src/__tests__/batchHarness.test.ts > runCodewarmBatch > flags wrong-edition as unverified-web-source
 ↓ src/__tests__/batchHarness.test.ts > runCodewarmBatch > corpus-covered references are not web-grounded
 ↓ src/__tests__/batchHarness.test.ts > runCodewarmBatch > budget cap halts batch
 ✓ src/__tests__/batchHarness.test.ts > no-verbatim boundary > 0036 migration renames confidence to asserted_confidence 1ms
 ✓ src/__tests__/batchHarness.test.ts > no-verbatim boundary > reasoning_atoms schema has no full-section verbatim column 0ms

 Test Files  1 passed (1)
      Tests  2 passed | 7 skipped (9)
   Start at  11:46:39
   Duration  1.34s (transform 358ms, setup 0ms, collect 975ms, tests 2ms, environment 0ms, prepare 80ms)
```

### CI local

- `pnpm run typecheck`: **passed**
- `@workspace/codes` vitest: **172/172 passed**

## PR

- **Driver PR:** https://github.com/empressaioemail-tech/legacy-design-tools/pull/164
- **SHA:** `5b8df557c33384997cbb5b4d0261f23630178cd2`
- **Held for operator merge**

## git status (verbatim)

```
On branch codewarm/austin-2024-uplift-rewarm
Your branch is up to date with 'origin/codewarm/austin-2024-uplift-rewarm'.

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
  (commit or discard the untracked or modified content in submodules)
	modified:   .claude/worktrees/recon-add-jurisdiction (untracked content)
	modified:   .claude/worktrees/track-b-ifc-ingest (modified content, untracked content)

Untracked files:
  (use "git add <file>..." to include in what will be committed)
	lib/codes/scripts/
	lib/codewarm/scripts/

no changes added to commit (use "git add" and/or "git commit -a")
```

## git log -3 (verbatim)

```
5b8df55 feat(codes): Austin 2024 driver slugs + IECC RE/CE chapter paths
3f307ca Merge pull request #163 from empressaioemail-tech/codewarm/driver-section-extraction
77f2a90 fix(codes): fetch section-level HTML for web-code verification
```

## Blockers / follow-ups

1. **UMC/UPC chapter-page extraction** — UpCodes returns chapter slugs (`chapter/4/ventilation-air`) but section isolation often fails; ~20% verified. Uniform-code section URL pattern may need driver tuning.
2. **IFC ICC fallback** — Book-landing persists for refs where UpCodes misses; **ICC Code Connect** (licensed tier dispatch) required for full IFC verified rate.
3. **TAS 2012** — Deeplink-only to TDLR; no section HTML extraction yet. Needs TDLR section URL allowlist or PDF ingest.
4. **Corpus-overlay validation** — Manual spot-check recommended on IBC/UMC corpus-covered rows to reject UDC section-number collisions (B2 caution).
5. **doc_repo manifest commit** — Operator to add/commit 7 new YAML files under `_catalog/codes/`.
6. **2021 atom coexistence** — Prior 2021 reasoning atoms remain on Neon; launch eval should filter edition=2024.

## Escalation log

No Claude escalation. Grok Build 0.1 completed; IECC `IECC-R-R401.2` bareSection bug found and fixed during verification gate.
