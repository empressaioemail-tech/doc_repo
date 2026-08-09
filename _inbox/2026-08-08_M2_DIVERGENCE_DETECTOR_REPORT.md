---
id: 2026-08-08_M2_DIVERGENCE_DETECTOR_REPORT
title: M2 Divergence Detector — build report
date: 2026-08-08
status: built (uncommitted — master planner commits)
owner: m2-program-planner
related: [_inbox/2026-08-08_BUILD_RULES_canon_enforcement, _catalog/repo_intents_checks, _catalog/canon_divergence, _inbox/2026-08-08_M2_historical_replay]
---

# M2 Divergence Detector — build report

Operator-authorized 2026-08-08. Working mechanism shipped; not committed.

## Design answers

### 1. Data source: local `git log` (not GitHub API, not CI)

doc_repo has no `.github/` and no active git hooks. M2 reads local clones on `P:\` via `git log --since --until --format -- <paths>`. Optional `git fetch` on manual runs; the cadence hook uses `--no-fetch` to stay under the 30s PreToolUse timeout. No `gh` auth, no Actions prerequisite.

### 2. Comparison: light `repo_intents_checks.json` now; full M5 `repo_intents.json` later

Prose in `repo_intents.md` cannot be checked mechanically. M2 needs only predicates: `posture`, `paths`, `last_verified`, `acknowledged_until`, optional `severe_paths`. That is `_catalog/repo_intents_checks.json` — a companion annotation, not a rewrite of the intent doc. M5 may absorb it later. Multi-clock monorepos must not use whole-repo `retiring` (overbroad vs clock-3 carve-outs); path-scoped `zero-new-work` clocks carry the load-bearing signal. Per-repo / per-check `last_verified` closes M1's doc-level staleness gap.

### 3. Cadence and alarm surface

Alarm: `_catalog/canon_divergence.md` (markdown file). Linked from `_STATE.md` GOVERNANCE. Not Command Center.

Cadence: `.claude/hooks/canon-divergence-run.ps1` on PreToolUse `Read` of `_STATE.md`, refreshes when the report is missing or older than 12 hours. Fail-open exit 0. Same mechanism class as `branch-guard` / M1 — not a protocol step on the inbox-sweep preference.

### 4. Per-repo staleness

`last_verified` lives on each repo and each check in the JSON. Touching one row does not refresh others. Doc-level `last_updated` on `repo_intents.md` is irrelevant to M2.

## Working mechanism

```
node P:/doc_repo/scripts/canon-divergence.mjs
node P:/doc_repo/scripts/canon-divergence.mjs --checks _catalog/repo_intents_checks.2026-07-04.json --since 2026-07-04 --until 2026-08-09 --no-fetch --no-stamp --out _inbox/2026-08-08_M2_historical_replay.md
```

Posture table (mechanical):

| Posture | Signal | Verdict |
|---|---|---|
| `retiring` / `zero-new-work` | any commit | DIVERGENT |
| same | `^feat` or (repo-level) migrations/drizzle | DIVERGENT-SEVERE |
| `no-touch` | any commit | DIVERGENT-SEVERE |
| `active` / `factory` | 0 commits in 60 days | DIVERGENT (dormant) |
| `active` / `factory` | commits | OK |

Fail-open: every probed error path exits 0. Missing clone / fatal → `status: DEGRADED` (never silent `clear`).

## Historical replay (the designed failure)

Command:

```
node P:/doc_repo/scripts/canon-divergence.mjs --checks P:/doc_repo/_catalog/repo_intents_checks.2026-07-04.json --since 2026-07-04 --until 2026-08-09 --no-fetch --no-stamp --out P:/doc_repo/_inbox/2026-08-08_M2_historical_replay.md
```

Measured runtime: **778 ms** script / **924 ms** wall (final timed run).

### Verbatim output

```
---
id: canon_divergence
title: Canon-vs-reality divergence report (M2)
status: ALARM
last_updated: 2026-08-09
generated_by: scripts/canon-divergence.mjs
checks: P:/doc_repo/_catalog/repo_intents_checks.2026-07-04.json
---

# Canon divergence (M2)

Generated 2026-08-09. Runtime 778 ms. Window: since=2026-07-04 until=2026-08-09. Fetch=no.

**Summary:** 2 divergent · 0 acknowledged · 5 ok · 0 skipped · 0 repos unmonitored · 0 empty-posture rows.

Alarm surface: this file. `_STATE.md` GOVERNANCE links here. Not Command Center — the watcher must not carry a five-service deploy dependency.

Cadence: `.claude/hooks/canon-divergence-run.ps1` on Read of `_STATE.md` (stale-report refresh, fail-open). Manual: `node scripts/canon-divergence.mjs`.

## ESCALATED (divergent >30d, unacknowledged)

Governance process is broken for these rows — posture not updated and no `acknowledged_until`.

- **legacy-design-tools::repo** (legacy-design-tools): first seen 2026-07-04, age ≥30d, verdict DIVERGENT-SEVERE
- **ldt-clock2-cortex-console** (legacy-design-tools): first seen 2026-07-04, age ≥30d, verdict DIVERGENT-SEVERE

## DIVERGENT

| Check | Repo | Posture | Commits | Feat | Severe-path | Since | Verdict | Note |
|---|---|---|---:|---:|---:|---|---|---|
| legacy-design-tools::repo | legacy-design-tools | retiring | 223 | 82 | 20 | 2026-07-04 | DIVERGENT-SEVERE | HISTORICAL: whole-repo retiring as declared in prose. OVERBROAD vs clock-3 'shrink by absorption' (maintenance commits expected). Load-bearing true positive is ldt-clock2 path scope. Repo-level any-commit is the coarse Failure-1 signal only. OVERBROAD: whole-repo retiring/zero-new-work alarms on any commit, including clock-3 maintenance the decision may have expected. Prefer path-scoped clocks for the load-bearing signal. 223 commit(s) since 2026-07-04 against posture 'retiring'. See _decisions/2026-07-04_ldt_decomposition_retirement_path.md. |
| ldt-clock2-cortex-console | legacy-design-tools | zero-new-work | 23 | 13 | 0 | 2026-07-04 | DIVERGENT-SEVERE | Console extracts in Phase 3 — zero new feature work in place. 23 commit(s) since 2026-07-04 against posture 'zero-new-work'. See _decisions/2026-07-04_ldt_decomposition_retirement_path.md. |

### Evidence (top commits)

#### legacy-design-tools::repo (legacy-design-tools)

- `505807aa` 2026-08-08 fix(county-rail-refresh): avoid ordinal unique-constraint collision on apply
- `079f8022` 2026-08-08 fix(county-manifest): refresh stale county_rail dimension, retire join as a rail
- `76905c0a` 2026-08-08 feat(txgio): opt-in EPSG:3857 reprojection to unblock the 202505 vintage (#397)
- `457ba565` 2026-08-08 fix(txgio): clear the three statewide-ingest blockers — projection, allowlist, write path (#396)
- `5882166e` 2026-08-08 fix(county-manifest): demote doctrine zoning cells from satisfied-absent to not-yet (#395)
- `550df72d` 2026-08-08 chore(debris): fix false Cotality/Regrid message, remove dead regrid + map-embed modules (#394)
- `85f3c370` 2026-08-08 feat(boundary): L1 statewide city and county boundary layer (#392)
- `b9807f7e` 2026-08-08 feat(county-manifest): Sprint 1 thin slice — 254x13 honest manifest grid (#391)
- `cf41c1a5` 2026-08-06 fix(cad-ingest): vertex-sweep fallback for partial-geometry stamp PIP misses (#390)
- `95639d67` 2026-08-05 feat(api-server): scoped tier1 bake via --prop-ids-file (#389)
- `b1ef76de` 2026-08-05 Merge pull request #388 from empressaioemail-tech/fix/t4-cortex-user-daily-cap
- `0f37b505` 2026-08-05 fix(cortex-api): set production CORTEX_USER_DAILY_API_LIMIT to 10000

#### ldt-clock2-cortex-console (legacy-design-tools)

- `1ba8ba16` 2026-07-18 feat(cortex-tiles): preserve parcel_node_id through to the map feature + selection (was stripped) (#290)
- `28bd573b` 2026-07-18 feat(brokerage): buildable-envelope derivation (parcel inset by setbacks) + render layer (#287)
- `6d039311` 2026-07-17 feat(cortex-tiles): promote BimModelViewport into a published GLB/BIM viewer tile (was dormant in private portal-ui) (#284)
- `698b3d21` 2026-07-16 feat(cortex-client): parcel-terrain-model tile capability (surfaces the live MCP tool) (#278)
- `b8233df4` 2026-07-16 chore(cortex-tiles): bump to 0.1.10 (publish SubsurfaceTile SSURGO overlay push, PR #275) (#277)
- `cf4c3880` 2026-07-16 feat(cortex-tiles): federal GIS layers + zoning paint + LOD honest-empty (map data completeness) (#271)
- `b278a5fc` 2026-07-16 feat(cortex-tiles): push SSURGO foundation-risk soils overlay from SubsurfaceTile (#275)
- `bcec1cd6` 2026-07-16 fix(cortex-tiles): storm-guard the live-GIS viewport loop (black-map bug) (0.1.8) (#270)
- `d26b507c` 2026-07-16 feat(cortex-tiles): brokerage address-keyed site-context + headless entry (0.1.7) (#269)
- `5e61aaac` 2026-07-16 feat(cortex-tiles): RAW-FUNCTION mode as pure callable functions (0.1.6) (#268)
- `63e73fca` 2026-07-16 chore(cortex-tiles): bump to 0.1.5 to publish LiveMapTile (#266)
- `5fa26e31` 2026-07-16 chore(cortex-tiles): bump @hauska/map-renderer to ^0.1.2 (#265)

## OK

| Check | Repo | Posture | Commits | Last verified |
|---|---|---|---:|---|
| ldt-clock1-root-spa | legacy-design-tools | zero-new-work | 0 | 2026-07-04 |
| hauska-engine::repo | hauska-engine | active | 315 | 2026-07-04 |
| hauska-map::repo | hauska-map | active | 225 | 2026-07-04 |
| hauska-atom-contract::repo | hauska-atom-contract | active | 28 | 2026-07-04 |
| smartcity-os::repo | smartcity-os | no-touch | 0 | 2026-07-04 |

## Meta

- checks_schema: 1
- as_of_intent: 2026-07-04
- unmonitored_empty_posture: 0
- unmonitored_absent_repos: 0
- per_repo_last_verified: yes (repo_intents_checks.json, not doc-level last_updated)

To acknowledge without changing posture: set `acknowledged_until: YYYY-MM-DD` on the check or repo row. Never a permanent mute. A row red >30d with no ack appears under ESCALATED.
```

### Catch confirmation

| Designed failure | Caught? | Evidence |
|---|---|---|
| ldt declared retiring, massive post-decision commit volume | YES (coarse) | `legacy-design-tools::repo` DIVERGENT-SEVERE, **223** commits in Jul4–Aug8 window (decision's 385/387 is the 60-day window; same failure class) |
| Clock 2 zero-new-work violated | YES (load-bearing) | `ldt-clock2-cortex-console` DIVERGENT-SEVERE, **23** commits / **13** `^feat` — matches survey commit count exactly; survey's "nine" feat undercount is survey arithmetic, not detector inflation |
| Clock 1 freeze | correctly quiet | 0 commits, OK |
| Active spine repos | correctly quiet | engine 315 / map 225 / contract 28 → OK |

Full file: `_inbox/2026-08-08_M2_historical_replay.md`.

Live run (post factory ruling): `_catalog/canon_divergence.md` status `clear`, 0 divergent, 10 portfolio repos listed unmonitored (visibility, not alarm). Runtime **661 ms** script / **814 ms** wall.

## Adversarial reviewer — verdicts verbatim

Reviewer agent: [M2 adversarial review](3d38de89-62dc-49d1-bf71-e784135394ec).

### First pass (before fixes) — VERDICT: SHIP-WITH-FIXES

> Script and clock-scoped replay work; do not commit as a finished control until cadence, fail-blind missing-clone, and retiring-vs-clock-3 false-positive framing are fixed.

Key refutations (verbatim excerpts):

> Whole-repo `retiring` → any-commit is a false-positive engine against the 2026-07-04 decision. Decision text: cortex-api/lib "keep running in place and shrink by absorption".

> Cadence is protocol fiction, not installation. Spec: attach to `inbox-sweep-loop` `/loop 10m`. MEMORY audit: that memory is "operator preference; nothing to verify against live state". Repo search: no `.claude` settings entry, no runbook step, no cron for `canon-divergence.mjs`.

> Missing clone fails open into status: clear. … Delete/move `P:/legacy-design-tools` and the portfolio looks clean.

> Dies in 30 days unless installed. Same shape as §2C-bis / dispatch template / FLEET-L3-GAP.

### Second pass (after fixes) — VERDICT: SHIP

> **VERDICT: SHIP** — prior six blockers verified fixed; historical still ALARM 2; missing-clone DEGRADED; live clear + 10 unmonitored.
>
> **Remaining blockers:** none.
>
> **Survival:** The Read-hook changes the assessment. Cadence is no longer "attach to inbox-sweep someday"; it is a fail-open PreToolUse on `Read` of `_STATE.md` (settings matcher + `canon-divergence-run.ps1`), the same mechanism class as `branch-guard` / M1, and it piggybacks the standing read-state-first habit. It dies only if the hook is deleted or agents stop reading `_STATE.md` — not by quiet protocol skip. `--no-fetch` under the 30s timeout is an accepted freshness tradeoff, not a survival hole.

## Measured runtime

| Run | Runtime |
|---|---|
| Historical Jul4–Aug8 (final) | **778 ms** script / **924 ms** wall |
| Live (final) | **661 ms** script / **814 ms** wall |
| Missing-clone probe | **2 ms** |

Spec estimate was ~2 min with fetches across ~8 repos. Local `--no-fetch` is sub-second; with fetch, expect network-bound.

## Files created or changed

| Path | Action |
|---|---|
| `scripts/canon-divergence.mjs` | **created** — detector |
| `_catalog/repo_intents_checks.json` | **created** — live machine predicates + per-repo `last_verified` |
| `_catalog/repo_intents_checks.2026-07-04.json` | **created** — historical fixture for replay |
| `_catalog/canon_divergence.md` | **created** — live alarm surface |
| `_inbox/2026-08-08_M2_historical_replay.md` | **created** — verbatim historical ALARM |
| `_inbox/2026-08-08_M2_DIVERGENCE_DETECTOR_REPORT.md` | **created** — this report |
| `.claude/hooks/canon-divergence-run.ps1` | **created** — Read/_STATE cadence hook |
| `.claude/settings.json` | **changed** — wired Read matcher → cadence hook |
| `_STATE.md` | **changed** — GOVERNANCE pointer to M2 |

**Not committed.** Master planner owns the commit.
