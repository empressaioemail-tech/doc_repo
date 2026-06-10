---
id: 2026-06-09_legacy-design-tools_cc-agent-C_codewarm_runs
date: 2026-06-10
agent: cc-agent-C
repo: legacy-design-tools
branch: codewarm/runs-b1
dispatch: 2026-06-09_cc-agent-C_codewarm_runs
status: COMPLETE — verification gate + mass warm (stock harness, migrations 0036+0037)
model: Grok Build 0.1 (HR-12 default; no Claude escalation)
sprint: 58 Front B step B1
harness: stock (#162 merged at 96aa589; no ephemeral URL overlay)
---

# Cold-warm runs report — B1 (re-fire)

## Workspace gate — ACCEPTED

```
On branch codewarm/runs-b1
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
  (commit or discard the untracked or modified content in submodules)
	modified:   .claude/worktrees/recon-add-jurisdiction (untracked content)
	modified:   .claude/worktrees/track-b-ifc-ingest (modified content, untracked content)

Untracked files:
  (use "git add <file>..." to include in what will be committed)
	lib/codewarm/scripts/

no changes added to commit (use "git add" and/or "git commit -a")
---
96aa589 Merge pull request #162 from empressaioemail-tech/codewarm/harness-fix
499b226 test(codes): driver profile URL builders for Texas and Florida paths
923b119 fix(codewarm): parser quoted sections, national Texas drivers, slug config
```

Branch prefix `codewarm/` on harness-fix merge base. Submodule dirt + ephemeral `lib/codewarm/scripts/b1-stock-run.mts` (orchestrator, not committed) — non-blocking. Data-only run on reasoning layer; no schema/corpus change.

---

## Texas-first scope

| Field | Value |
|---|---|
| Jurisdiction key | `austin_tx` (representative Texas metro) |
| Harness | Stock `@workspace/codewarm` + `@workspace/codes` (`driverProfiles.ts` Texas paths; IECC → `austin/iecc-2021`; A117.1 → `austin/icc-a117.1-2017`) |
| TLS | `NODE_OPTIONS=--use-system-ca` (required on cente workstation) |
| Corpus baseline (have) | **4,754** `code_atoms` where `jurisdiction_key LIKE '%_tx'` |
| Reasoning atoms (before) | **0** on `austin_tx` |
| Reasoning atoms (after) | **725** on `austin_tx` |
| Manifest refs total | **738** across six families |

---

## Domain-assumption verification gate (COMPLETE — before mass warm)

Stock harness fetch path: every `verify: true` entry + ≥20% deterministic SHA sample per manifest. Ran via `scripts/b1-stock-run.mts verify-only` before warm pass.

### Summary by family

| Family | Sampled | `verify:true` in sample | Resolved | Failed | Unverified-web-source |
|---|---:|---:|---:|---:|---:|
| IRC | 39 | 7 | 39 | 0 | 39 |
| IBC+IEBC | 27 | 4 | 27 | 0 | 27 |
| IECC *(muni-scoped)* | 14 | 0 | 14 | 0 | 14 |
| IMC+IPC+IFGC | 29 | 2 | 29 | 0 | 29 |
| IFC+IPMC | 26 | 4 | 26 | 0 | 26 |
| accessibility+NFPA *(A117.1 muni)* | 15 | 0 | **0** | **15** | 0 |
| **Total** | **150** | **17** | **135** | **15** | **135** |

**Resolution criteria:** `resolved = verified OR text.length > 120`. All I-Code family samples returned ICC book/chapter landing HTML (>120 chars) but **`verified: false`** (`unverified-web-source`) — section number/title not confirmed against authoritative section body.

### `verify: true` items (17 sampled — all 17 resolved, all 17 unverified)

All seven IRC `verify:true` refs (R507.9.1.3, R507.2.3, R802.4, R802.5, R905.1.2, R310.4, N1101.10) resolved to ICC `IRC2021P1` landing/chapter URLs with `verified: false`. R310.4 title **"Area Wells"** matches catalog (corrected in doc_repo manifest). No section dropped; warm proceeded with `unverified-web-source` state.

IBC+IEBC four `verify:true` (IEBC-202-SI, IEBC-804.2.1, IEBC-1011, IBC-1004.1): same pattern — resolved, unverified.

IMC+IPC+IFGC two `verify:true` (IMC-401.2, IPC-312.2): resolved, unverified.

IFC+IPMC four `verify:true` (IFC-903.3.1.1, IFC-907.2, IPMC-602.3, IPMC-802.1): resolved, unverified.

### Accessibility verification failures (15/15)

Sampled A117.1 + ADA refs returned ICC chapter stubs or ada.gov index with `text.length ≤ 120` → **failed resolution**. Examples: A117.1-303, A117.1-308.3, A117.1-404.2.3, ADA-308, ADA-505. Warm pass still ran; A117.1 gaps warmed or corpus-overlaid per harness precedence.

**Corrections applied:** none committed. No manifest drops. Operator may want driver tuning for ICC section-level HTML extraction (follow-up, not B1 blocker for persistence).

---

## Mass warm — per-family counts (stock harness, `$5.00` cap/family)

| Family | Total refs | Corpus-covered (overlay) | Warmed (web fetch) | Deeplink-only | Corpus-skipped | Errors | Cost USD | Budget yellow |
|---|---:|---:|---:|---:|---:|---:|---:|:---:|
| IRC | 117 | 2 | 115 | 0 | 0 | 0 | 0.230 | no |
| IBC+IEBC | 132 | 68 | 64 | 0 | 0 | 0 | 0.128 | no |
| **IECC** *(muni-scoped)* | **101** | **1** | **100** | **0** | **0** | **0** | **0.200** | **no** |
| IMC+IPC+IFGC | 137 | 24 | 113 | 0 | 0 | 0 | 0.226 | no |
| IFC+IPMC | 142 | 4 | 138 | 0 | 0 | 0 | 0.276 | no |
| accessibility+NFPA | 109 | 34 | 22 | 40 | 13 | 0 | 0.054 | no |
| **Total** | **738** | **133** | **552** | **40** | **13** | **0** | **1.114** | **no** |

**Grounding flags honored:**
- `verify-existing-corpus` (federal ADA): 34 corpus-covered overlay + 13 corpus-skipped (already in corpus); not re-grounded.
- `NFPA-license-required`: 40 deeplink-only atoms to nfpa.org; zero grounded text.
- `web-groundable` / unflagged: warmed normally (552 web fetches).

### Municipality-scoped families (reported separately)

| Code | Scope | Corpus-covered | Warmed | Deeplink-only | Skipped | Total outcomes |
|---|---|---:|---:|---:|---:|---:|
| **IECC 2021** | Austin slug `austin/iecc-2021` | 1 | 100 | 0 | 0 | 101 |
| **A117.1 2017** | Austin slug `austin/icc-a117.1-2017` | 24 *(est. from eval sample)* | 22 | 0 | 0 | **46** *(codeSplit muni bucket)* |

*(A117.1 corpus-covered count = 46 muni outcomes − 22 warmed = ~24; ADA/NFPA counted under accessibility statewide bucket.)*

---

## Texas have-vs-warmed split (B2 seed data)

| Metric | Count | Notes |
|---|---:|---|
| Texas corpus **have** (`code_atoms` `%_tx`) | 4,754 | unchanged by warm run |
| Austin reasoning atoms **after warm** | 725 | 738 manifest refs − 13 corpus-skipped |
| Corpus overlay (not re-grounded) | 133 | harness `corpus-covered` outcome |
| Web-warmed gaps | 552 | `unverified-web-source` dominant on I-Codes |
| Deeplink-only (NFPA) | 40 | no fetch cost beyond initial stub |
| Corpus-skipped (ADA already present) | 13 | no new atom |
| **Gap ratio** | 552 / 738 = **74.8%** web-warmed | 18.0% corpus overlay; 5.4% deeplink-only; 1.8% skipped |

B2 should treat **552 unverified-web-source warmed atoms** as priority re-fetch targets once ICC/UpCodes section HTML extraction improves.

---

## Per-family eval (5-atom sample each)

All six families: **pass** — edition present, deeplink in sources, snippet ≤600 chars, verification state set, no finding text.

| Family | Pass | Sample verification states |
|---|---|---|
| IRC | ✅ | all `unverified-web-source` |
| IBC+IEBC | ✅ | mix `unverified-web-source` + `verified` (corpus overlay) |
| IECC | ✅ | mix `verified` (corpus) + `unverified-web-source` |
| IMC+IPC+IFGC | ✅ | mix |
| IFC+IPMC | ✅ | all `unverified-web-source` |
| accessibility+NFPA | ✅ | A117.1 corpus `verified`; warmed A117 `unverified-web-source` |

---

## Wrong-edition spot-check

```json
{
  "requestedEdition": "IRC 2018",
  "verified": false,
  "unverifiedWebSource": true,
  "confidence": 0.1,
  "pass": true
}
```

Forced IRC-R301.1 @ IRC 2018 → refused (`unverified-web-source`). **PASS.**

---

## No-verbatim boundary test

```
pnpm --filter @workspace/codewarm test -t "no-verbatim"
→ 2 passed, 15 skipped (17 total); exit 0
```

**GREEN.**

---

## Blockers (verbatim)

1. **Verification quality — I-Code family:** 135/135 resolved samples are `unverified-web-source`. ICC driver returns book/chapter landing HTML, not section body. Section numbers not edition-verified at recon gate despite `resolved: true`. Not a persistence blocker; blocks **verified** grounding quality for B2 gap closure.

2. **Verification quality — accessibility sample:** 15/15 accessibility_nfpa verification samples **failed resolution** (ICC A117 chapter stubs + ada.gov index; text ≤120 chars). Warm still persisted 46 A117.1 outcomes (22 warmed + ~24 corpus overlay) but unverified warmed A117 refs need driver follow-up.

3. **No schema blockers.** Migrations 0036+0037 applied; **725/725 UPSERTs succeeded** (prior break-point 0/725 failure resolved).

4. **No budget blockers.** Total cost **$1.114** across six families; all under $5.00 cap; no yellow flags.

5. **No PR required** for this run. Ephemeral orchestrator at `lib/codewarm/scripts/b1-stock-run.mts` not committed. Manifest R310.4 title already corrected in doc_repo catalog only.

---

## Artifacts

| Path | Contents |
|---|---|
| `P:\doc_repo\_temp\codewarm-b1-report.json` | Warm + eval + wrong-edition JSON |
| `P:\doc_repo\_temp\b1-verify.log` | Verification gate stdout |
| `P:\doc_repo\_temp\b1-warm.log` | Warm pass stdout |

---

## Acceptance criteria checklist

| Criterion | Status |
|---|---|
| Verification report before mass warm | ✅ |
| Grounding flags honored | ✅ |
| All six manifests warmed | ✅ (738 refs processed) |
| Corpus overlay not re-grounded | ✅ (133) |
| Per-family cost inside cap | ✅ ($1.114 total) |
| Per-family eval passes | ✅ |
| Wrong-edition refuses | ✅ |
| No-verbatim boundary green | ✅ |
| Data-only; no schema/corpus change | ✅ |
| Texas have-vs-warmed split for B2 | ✅ (above) |

**B1 COMPLETE.** Ready for B2 Texas gap analysis.
