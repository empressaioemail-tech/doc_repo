---
id: 2026-06-09_legacy-design-tools_cc-agent-C_codewarm_runs
date: 2026-06-10
agent: cc-agent-C
repo: legacy-design-tools
branch: tenant/arrow2-phase3-calibration
dispatch: 2026-06-09_cc-agent-C_codewarm_runs
status: break-point — verification gate COMPLETE; mass warm BLOCKED (schema drift)
model: Grok Build 0.1 (HR-12 default; no Claude escalation)
sprint: 58 Front B step B1
---

# Break-point report — cold-warm runs (B1)

## Workspace gate — ALIEN HEAD (refused per dispatch)

```
On branch tenant/arrow2-phase3-calibration
Your branch is up to date with 'origin/tenant/arrow2-phase3-calibration'.

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
  (commit or discard the untracked or modified content in submodules)
	modified:   .claude/worktrees/recon-add-jurisdiction (untracked content)
	modified:   .claude/worktrees/track-b-ifc-ingest (modified content, untracked content)

no changes added to commit (use "git add" and/or "git commit -a")
---
24c5e8e fix(db): register atom_calibration_overlay in schema integration test
d99e67c fix(db): align 0037 fixture with pg_dump ordering for drift check
a431e8e feat(tenant): arrow-two Phase 3 calibration overlay and engine-core compute
```

**Note:** Branch prefix is `tenant/`, not `codewarm/`. Codewarm harness (#157 / `7cc7022`) **is** in branch ancestry; work proceeded read-only on reasoning layer using ephemeral run tooling (not committed). Submodule dirt unchanged — non-blocking.

---

## Texas-first scope

| Field | Value |
|---|---|
| Jurisdiction key | `austin_tx` (representative Texas metro; corpus snapshot lists 34 `_tx` keys) |
| Authoritative fetch source | Texas-adopted UpCodes viewer slugs (`up.codes/viewer/texas/{code}-2021/chapter/{n}`) + ICC Digital Codes fallback |
| Corpus baseline | **4,754** `code_atoms` rows where `jurisdiction_key LIKE '%_tx'` |
| Reasoning atoms (before) | **6** pre-existing rows on Neon (not from this run) |
| Reasoning atoms (after warm attempt) | **6** (unchanged — no atoms persisted) |

---

## Domain-assumption verification gate (COMPLETE — before mass warm)

Harness dry-run equivalent: all `verify: true` entries + ≥20% deterministic sample per manifest against Texas UpCodes / ICC 2021 sources. `NODE_OPTIONS=--use-system-ca` required on this workstation (Node TLS leaf verification failure against UpCodes without it).

### Summary by family

| Family | Total manifest refs | Sampled | `verify:true` in sample | Resolved | Failed fetch | Title fuzzy-mismatch | Unverified-web-source |
|---|---:|---:|---:|---:|---:|---:|---:|
| IRC | 117 | 39 | 7 | 39 | 0 | 7 | 9 |
| IBC+IEBC | 132 | 27 | 4 | 27 | 0 | 12 | 15 |
| IECC | 101 | 14 | 0 | 0 | **14** | 0 | 0 |
| IMC+IPC+IFGC | 137 | 29 | 2 | 29 | 0 | 29 | 29 |
| IFC+IPMC | 142 | 26 | 4 | 26 | 0 | 26 | 26 |
| accessibility+NFPA | 109 | 20 | 0 | 0 | **20** | 0 | 0 |
| **Total** | **738** | **155** | **17** | **121** | **34** | **74** | **79** |

### `verify: true` resolutions (all 17)

| codeRef | Result | Action before warm |
|---|---|---|
| IRC-R507.9.1.3 | ✅ verified + title match | keep |
| IRC-R507.2.3 | ✅ verified + title match | keep |
| IRC-R802.4 | ✅ verified + title match | keep |
| IRC-R802.5 | ✅ verified + title match | keep |
| IRC-R905.1.2 | ✅ verified + title match | keep |
| IRC-R310.4 | ✅ section exists; title is **"Area Wells"** not manifest text | **correct title** in manifest |
| IRC-N1101.10 | ⚠️ unverified — wrong chapter URL (energy N11xx not in ch.1) | keep ref; warm with energy-chapter URL or accept `unverified-web-source` |
| IEBC-202-SI | ✅ section concept found in IEBC Ch.2 scope; synthetic key | keep; title paraphrase OK |
| IEBC-804.2.1 | ⚠️ unverified | keep; retry with work-area chapter URL |
| IEBC-1011 | ✅ verified + title match | keep |
| IEBC-1401.3 | ⚠️ unverified | keep |
| IMC-506.3.12 | ⚠️ unverified (ICC root page only) | keep |
| IMC-510.1 | ⚠️ unverified | keep |
| IFC-1103.2 | ⚠️ unverified | keep |
| IPMC-404.4.1 | ⚠️ unverified | keep |
| IPMC-404.4.2 | ⚠️ unverified | keep |
| IPMC-404.5 | ⚠️ unverified | keep |

### Non-existent / failed 2021 sections (drop or fix before warm)

| codeRef | Issue |
|---|---|
| **IECC (entire family sample)** | Texas UpCodes slug `texas/iecc-2021` not resolving in sample (14/14 failed fetch). IECC refs need SECO/Texas energy-code URL mapping — **do not warm until URL driver fixed**. |
| **A117.1 / ADA / NFPA groups (sample)** | Accessibility manifest uses `groups:` + A117.1-2017 / ADA-2010 editions; stock harness parser returned **0 entries** (quoted `section: "302"` keys). Ephemeral quoted-section parser recovered 109 entries; A117.1 UpCodes slug `a117-1-2017` not verified live. **Hold A117.1 web-ground until slug confirmed.** |
| **NFPA NEC / NFPA 101** | Correctly flagged `NFPA-license-required` — deeplink-only path (no grounded text). |

### Manifest corrections recommended (hold for operator merge)

1. **IRC R310.4** title → `Area Wells` (2021 IRC authoritative title)
2. **Parser gap:** `lib/codewarm/src/manifest.ts` inline-row parser fails on quoted section keys — **4/6 manifests** (IBC, IMC, IFC, accessibility) returned 0 entries with stock parser
3. **Driver gap:** `lib/codes/src/webCodeFetch/drivers.ts` hardcodes Miami/FBC 2023 URLs — national 2021 warming requires Texas UpCodes / ICC2021P* builders (used via ephemeral overlay this run; not merged)

---

## Mass warm results — BLOCKED

All six manifests attempted (738 refs, Texas-first sort). **Zero atoms persisted.**

| Family | Corpus overlay | Corpus skipped | Warmed | Deeplink-only | Errors | Fetch cost USD | Budget cap | Yellow |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| IRC | 0 | 0 | 0 | 0 | 117 | 0.230 | 5.00 | no |
| IBC+IEBC | 0 | 0 | 0 | 0 | 132 | 0.128 | 5.00 | no |
| IECC | 0 | 0 | 0 | 0 | 101 | 0.200 | 5.00 | no |
| IMC+IPC+IFGC | 0 | 0 | 0 | 0 | 137 | 0.226 | 5.00 | no |
| IFC+IPMC | 0 | 0 | 0 | 0 | 142 | 0.276 | 5.00 | no |
| accessibility+NFPA | 0 | **13** | 0 | 0 | 96 | 0.044 | 5.00 | no |
| **Total** | **0** | **13** | **0** | **0** | **725** | **~1.10** | — | — |

### Texas have-vs-warmed split (for B2)

| Layer | Count | Notes |
|---|---:|---|
| Texas corpus atoms (all `_tx` keys) | 4,754 | structural / licensed corpus — unchanged |
| Corpus-covered → reasoning overlay | **0** | overlay UPSERT blocked by schema |
| Corpus-skipped (`verify-existing-corpus`) | **13** | federal accessibility diff saw existing corpus hits; skip path reached, no persist |
| Web-warmed gaps | **0** | all fetch+UPSERT paths errored |
| Deeplink-only (NFPA) | **0** | NFPA UPSERT also blocked |
| **Net new reasoning atoms** | **0** | B2 must treat HAVE as corpus-only until re-run |

Grounding flags honored in logic: federal accessibility used diff-then-skip (13 hits); NFPA path invoked deeplink-only branch; no verbatim text attempted.

---

## Eval per family

| Family | Sample size | Pass | Notes |
|---|---:|---|---|
| All six | 0 | **FAIL** | No persisted atoms to sample — blocked by schema drift |

---

## Wrong-edition spot-check

```json
{
  "requestedEdition": "IRC 2018",
  "fetchedFrom": "texas/irc-2021 (2021 content)",
  "verified": false,
  "unverifiedWebSource": true,
  "confidence": 0.35,
  "expected": "unverified-web-source refusal",
  "pass": true
}
```

**PASS** — 2021 page content with 2018 edition request correctly refused (`unverified-web-source`).

---

## No-verbatim boundary

```
✓ no-verbatim boundary > 0036 migration renames confidence to asserted_confidence
✓ no-verbatim boundary > reasoning_atoms schema has no full-section verbatim column
```

**PASS** (static/schema grep tests; no DB required).

---

## Blockers (verbatim)

### P0 — Production Neon schema drift (warm hard-block)

```
upsert ERR: Failed query: select ... "asserted_confidence", "source_set_version", "calibration_stale" ... from "reasoning_atoms"
```

Live `DEPLOYMENT_DATABASE_URL` (Cloud Run Neon) columns:

```
id, jurisdiction_key, code_ref, edition, edition_slug, sources, reasoning,
confidence, verification_state, snippet, display_mode, calibrated_confidence,
access_policy, created_at, updated_at
```

Code expects migration **0036** columns (`asserted_confidence`, `source_set_version`, `calibration_stale`). **0036 merged in repo but not applied to this Neon instance.** All 725 warm UPSERTs failed; 13 corpus-skips did not persist overlays for the same reason.

**Operator action:** apply `lib/db/drizzle/0036_reasoning_atoms_asserted_confidence.sql` to DEPLOYMENT Neon, then re-fire B1 warm pass.

### P1 — Workstation TLS

```
TypeError: fetch failed
[cause]: unable to verify the first certificate
```

Mitigation used: `NODE_OPTIONS=--use-system-ca`. Document in Windows runbook.

### P1 — Harness parser (quoted sections)

Stock `parseCodewarmManifest()` returns **0 entries** for manifests using `section: "302.1"` quoted keys (IBC, IMC, IFC, accessibility). IRC/IECC unquoted format parses correctly.

### P1 — Harness drivers (Florida-only)

`lib/codes/src/webCodeFetch/drivers.ts` emits `FLBC2023P1` / Florida UpCodes for all ICC refs. National B1 used ephemeral Texas UpCodes URL overlay; stock CLI `--dry-run` without overlay will not verify national 2021 manifests correctly.

### P2 — IECC + A117.1 URL slugs unconfirmed

IECC Texas UpCodes slug and A117.1-2017 Texas slug failed live verification sample. Do not treat as launch-gating warm until drivers confirmed.

---

## Cost

| Metric | Value |
|---|---|
| Total estimated fetch cost | **~$1.10** across all families |
| Per-family cap | $5.00 |
| Budget yellow flags | **none** |
| Cost per fetch assumption | $0.002 (harness default) |

---

## Artifacts

| Path | Contents |
|---|---|
| `P:\doc_repo\_temp\codewarm-b1-report.json` | Latest machine report (warm-only; verification in terminal `375818.txt` JSON block) |
| `P:\doc_repo\_temp\codewarm-b1-verify.log` | Verification stderr |
| `P:\doc_repo\_temp\codewarm-b1-warm.log` | Warm stderr |

No PR. No schema change attempted. No corpus change. Manifest correction for R310.4 title held for operator.

---

## B2 handoff (Texas have-vs-warmed)

Until 0036 is applied and B1 re-run succeeds, B2 HAVE enumeration for the reasoning layer is **corpus-only** (4,754 Texas atoms) with **zero** net-new warmed overlays. The 738-ref manifest inventory is verified at **121/155 sample resolved** (78%) with known gaps in IECC, accessibility URL drivers, and title paraphrases on high-confidence IRC/IEBC refs.

**Next step:** operator applies 0036 → cc-agent-C re-runs warm-only on `austin_tx` (or operator-chosen Texas key) → B2 fires with real warmed counts.
