---
id: 2026-06-10_legacy-design-tools_cc-agent-C_codewarm_harness_fix
date: 2026-06-10
agent: cc-agent-C
repo: legacy-design-tools
branch: codewarm/harness-fix
dispatch: 2026-06-10_cc-agent-C_codewarm_harness_fix
status: complete — PR held for operator merge; B1 re-fire blocked on operator 0036 apply
model: Grok Build 0.1 (HR-12 default; no Claude escalation)
---

# Break-point report — cold-warm harness fix

## Workspace gate (verbatim)

```
On branch codewarm/harness-fix
Your branch is up to date with 'origin/codewarm/harness-fix'.

Changes not staged for commit:
	modified:   .claude/worktrees/recon-add-jurisdiction (untracked content)
	modified:   .claude/worktrees/track-b-ifc-ingest (modified content, untracked content)

no changes added to commit (use "git add" and/or "git commit -a")
---
499b226 test(codes): driver profile URL builders for Texas and Florida paths
923b119 fix(codewarm): parser quoted sections, national Texas drivers, slug config
fd8df96 Merge pull request #161 from empressaioemail-tech/tenant/arrow2-phase3-calibration
```

Clean `codewarm/harness-fix` branch off `origin/main` (`fd8df96`). Submodule dirt unchanged — non-blocking.

---

## PR (held for operator merge)

| Field | Value |
|---|---|
| Branch | `codewarm/harness-fix` |
| Feature SHA | `499b226f494642f2254606a7c68d8414165b6025` (head) |
| PR URL | https://github.com/empressaioemail-tech/legacy-design-tools/pull/new/codewarm/harness-fix |

---

## Parser test output — six non-zero counts

```
manifest_irc_2021.yaml 117
manifest_ibc_iebc_2021.yaml 132
manifest_iecc_2021.yaml 101
manifest_imc_ipc_ifgc_2021.yaml 137
manifest_ifc_ipmc_2021.yaml 142
manifest_accessibility_nfpa_2021.yaml 109
```

**Regression closed:** stock parser previously returned **0** for IBC, IMC, IFC, accessibility (quoted `section: "302.1"` keys + `groups:` shape).

### Parser changes (`lib/codewarm/src/manifest.ts`)

- `readQuotedOrBare` for `section`, `title`, `code`, `edition`, `discipline`, `traffic`, `grounding`
- `groups:` with per-row `edition` (federal-accessibility ADA/FHA, NFPA-track)
- Group reset on new `- group:` block
- Tests: fixture shapes + optional `CODEWARM_CATALOG_DIR` integration (`catalogManifests.test.ts`)

---

## Driver coverage (`lib/codes/src/webCodeFetch/driverProfiles.ts`)

Config-driven slug table `CODE_BOOK_SLUGS` — add state/edition via config, not fork.

| Book | UpCodes (Texas default) | ICC fallback | Notes |
|---|---|---|---|
| IRC/IBC/IEBC/IMC/IPC/IFGC/IFC/IPMC 2021 | `up.codes/viewer/texas/{book}-2021/chapter/{n}` | `codes.iccsafe.org/content/{BOOK}2021P1/chapter-{n}` | Verified in unit tests |
| IECC 2021 | `up.codes/viewer/austin/iecc-2021/chapter/{n}` | `IECC2021P1` | **Municipality-scoped** — no statewide `texas/iecc-2021` (B1 confirmed 404) |
| A117.1 2017 | `up.codes/viewer/austin/icc-a117.1-2017/chapter/{n}` | `A11712017` | **Municipality-scoped** — Texas uses TAS locally; A117.1 via Austin adoption on UpCodes |
| ADA 2010 | `ada.gov` deeplink only | — | `deeplinkOnly` in config |
| Florida FBC 2023 | `up.codes/viewer/florida/florida-building-code-2023` + legacy ICC FL* paths | unchanged | FBC codeRef/edition auto-selects Florida profile |

`jurisdictionKey` wired through `manifestEntryToTarget` → `buildDriverUrls` for Texas city slug resolution (`austin_tx` → `austin`).

---

## Manifest corrections

| Item | Action | Location |
|---|---|---|
| **IRC R310.4** title → **"Area Wells"** | **Applied** | `P:\doc_repo\_catalog\codes\manifest_irc_2021.yaml` |
| IEBC-202-SI synthetic key | **Flagged ambiguous** — paraphrase title OK; not a numbered section | keep |
| IRC-N1101.10 energy chapter | **Flagged** — needs N11xx chapter URL or accept `unverified-web-source` | keep ref |
| IEBC-804.2.1, IEBC-1401.3, IMC-506/510, IFC-1103.2, IPMC-404.x | **Flagged** — unverified in B1 sample; driver now points at correct ICC2021P* roots; re-verify on B1 re-fire | keep |
| 74 title fuzzy-mismatches in B1 sample | **Not mass-rewritten** — manifest titles are load-bearing paraphrases; harness title check is fuzzy | flagged |

Manifest catalog lives in `doc_repo` (not in this PR). R310.4 correction applied there only.

---

## TLS gotcha (documented)

Added to `lib/codewarm/README.md` and `docs/local-dev-windows.md`:

```powershell
$env:NODE_OPTIONS = "--use-system-ca"
```

Required on Windows workstations with TLS-intercepting proxy when fetching UpCodes/ICC.

---

## CI / verification

| Check | Result |
|---|---|
| `pnpm run typecheck` | **Green** |
| `@workspace/codewarm test` (fixtures + catalog with `CODEWARM_CATALOG_DIR`) | **17 passed** |
| `@workspace/codes` driverProfiles + webCodeFetch tests | **12 passed** |
| `@workspace/codewarm` batchHarness (DB integration) | **9 passed** |

---

## Blockers (verbatim — B1 re-fire still gated)

### P0 — Operator: apply migration 0036 to DEPLOYMENT Neon

```
upsert ERR: ... "asserted_confidence", "source_set_version", "calibration_stale" ... from "reasoning_atoms"
```

Live Neon still on 0035 (`confidence` column). Harness fix alone does not unblock warm persistence. Operator applies `lib/db/drizzle/0036_reasoning_atoms_asserted_confidence.sql` (+ verify 0037 overlay if needed), then re-fire B1.

### Out of scope (this dispatch)

- B1 warm RUN itself
- Corpus / schema changes
- Arrow-two calibration

---

## Next step

1. Operator merges `codewarm/harness-fix`
2. Operator applies 0036 (+ 0037 verify) to DEPLOYMENT Neon
3. cc-agent-C re-fires B1 cold-warm runs (`2026-06-09_cc-agent-C_codewarm_runs` dispatch) on `codewarm/` branch with stock harness — no ephemeral overlay
