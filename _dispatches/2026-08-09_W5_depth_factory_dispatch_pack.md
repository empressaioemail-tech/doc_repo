---
id: 2026-08-09_W5_depth_factory_dispatch_pack
title: W5 depth-factory dispatch pack — E1 F2 corpus, E2 CAD registry, E3 Elgin proof
date: 2026-08-09
status: IN FLIGHT
owner: nick
related: [90_operations/OPS-14_texas_flush_game_plan, _decisions/2026-08-04_ecode360_partnership_retired_scrape_posture, _decisions/2026-08-09_texas_flush_launch_gate, _inbox/2026-08-08_WARM_RUNNER_CONSOLIDATION_report]
---

# W5 depth-factory dispatch pack

Three lanes, hand-carried to Cursor-native executor agents. E1 and E3 serialize with the neondb/atoms bulk slots per OPS-14; E2 is read-only recon in doc_repo only. Planner verifies at source before any lane closes; no lane closes on executor narration alone.

Live state at cut time (planner-verified 2026-08-09): `hauska-engine` `origin/main` = `41cfdb4c` (#287 merged); ecode360-scraper adapter IS on main (`122798f` + fixes); local branch `feat/ecode360-scraper-header-first` is 185 commits behind main and superseded — E1 step (a) reconciles that fact, does not re-push stale branch tip. `legacy-design-tools` `origin/main` carries zoning-stamp machinery.

Every dispatch below is copy-paste ready. Adversarial checkpoints use the Handoff-D two-checkpoint model: independent reviewer sub, pre-registered expectations written BEFORE the build/scrape run, attack from a different frame than the builder.

---

## E1 — F2 corpus restart (Smithville end-to-end)

```
DO NOT delegate to or spawn other agents; you do the work yourself. If you need adversarial review, STOP and return a handoff artifact for the planner to fan a reviewer — do not nest.

You are a BUILD EXECUTOR for F2 (code/zoning corpus). Operator-authorized 2026-08-09 via W5 depth-factory spin-up.

CANON-PREAMBLE v0f465c77

STANDING DECISIONS: COTALITY EXTINGUISHED. DEPLOYS PLANNER-OWNED. NO PRIVILEGED DATA (every path must work for a no-relationship jurisdiction). CTX/national HELD. CODE-DONE != CUSTOMER-DONE.

REPOS: P:\hauska-engine (scraper + corpus ingest), P:\legacy-design-tools (zoning stamp dry-run only in step d).

AUTHORIZATION: you MAY write code, branch, commit, push, and open PRs on hauska-engine. You MAY run corpus ingest + eval (read/write corpus store). You MUST NOT merge or deploy without planner go. Zoning stamp APPLY is dry-run ONLY — planner owns apply. No Cotality, no privileged paths.

STATE-TEMPLATE RULE: no Texas constant in shared factory machinery; jurisdiction specifics live in registry rows and adapter modules only.

PREREQUISITE RECON (planner pre-verified — confirm before starting):
- origin/main already contains the proven ecode360-scraper adapter (packages/corpus/src/adapters/ecode360/, commits 122798f/0d2fc2e/67ffe31).
- Local branch feat/ecode360-scraper-header-first is STALE (behind main). Step (a) = verify main has adapter + tests; if stale branch has NO unique commits for ecode360/, record "branch superseded" in close artifact and delete or abandon local branch — do NOT push stale tip.
- Scrape posture per _decisions/2026-08-04_ecode360_partnership_retired_scrape_posture.md: ecode360-scraper or citizen portal, NEVER plain 403 path.

TASK (a) — BRANCH HYGIENE
Verify `git rev-parse --short origin/main` and that ecode360 adapter + conformance tests exist on main. Compare feat/ecode360-scraper-header-first for unique delta; if none, document supersession. If uncommitted local edits exist on the adapter, commit to a fresh branch FROM main and push.

TASK (b) — SMITHVILLE END-TO-END SCRAPE
Run Smithville (custId SM6484) per factory runbook + 2026-08-04 scrape ruling:
- robots.txt first; ≤0.5 rps; fail LOUD on block
- Baseline: 836 sections / 12,793 blocks (July proof); 100%/0 missing spans method
- Output artifacts under P:/tmp/tx_scraper_proofs/smithville/ (refresh if re-run)
- Use ecode360-scraper adapter path, not legacy plain HTML 403 path

TASK (c) — ADVERSARIAL CHECKPOINT (builder STOPs here; planner fans reviewer)
Write `_inbox/2026-08-09_E1_smithville_builder_close.json` with: section count, block count, fidelity harness output, git refs, verbatim test output if code changed.
Do NOT self-grade fidelity. The planner will fan an independent reviewer sub with pre-registered expectations: 836/836 sections, 12,793 blocks, 0 missing/altered spans, fromRawHtml + fromDecodedCorpus pass.

TASK (d) — CORPUS INGEST + EVAL + ZONING STAMP DRY-RUN (only after reviewer PASS)
- Ingest Smithville corpus; run eval (target 1.0/1.0/1.0)
- Queue zoning stamp on neondb write slot: DRY-RUN FIRST per stamp mechanics (MATCH CONTRACT leading-token)
- ldt side: run stamp dry-run for Smithville row; verify counts; NO apply

SLOT RULE: neondb bulk slot — confirm _STATE.md names active slot holder before any stamp apply attempt. Dry-run only in this lane.

DELIVERABLES (machine paths):
- `_inbox/2026-08-09_E1_smithville_builder_close.json`
- `_inbox/2026-08-09_E1_smithville_corpus_ingest.json` (eval scores, atom counts)
- `_inbox/2026-08-09_E1_smithville_stamp_dryrun.json` (ldt dry-run counters)
- Per-city runbook delta appended to `90_runbooks/factory_onboarding_runbook.md` § Smithville eCode360 (minimal delta only)

DISCIPLINE: exit-bounded commands; paste verbatim git status, test output, eval output. Merge on CI SUCCESS string only — you do not merge.
```

### E1-ADV — Adversarial reviewer (independent sub; planner fans AFTER builder close artifact exists)

```
DO NOT delegate to or spawn other agents.

You are an ADVERSARIAL REVIEWER for E1 Smithville corpus fidelity. You did NOT run the scrape.

PRE-REGISTERED EXPECTATIONS (written before your review):
- 836/836 TOC sections present
- 12,793 NormalizedBlocks
- fidelity harness: coverage 100%, missing spans 0, altered spans 0
- fromRawHtml and fromDecodedCorpus both pass=true
- 5/5 eyeball samples find text in raw HTML

INPUT: read `_inbox/2026-08-09_E1_smithville_builder_close.json` and independently re-run fidelity harness OR re-grade from saved normalized.json at P:/tmp/tx_scraper_proofs/smithville/

ATTACK FRAME: count agreement is insufficient — spot-check 10 random section IDs for verbatim legal-text spans; verify robots compliance in artifact; verify no Chrome-UA evasion in fetch logs.

OUTPUT: `_inbox/2026-08-09_E1_smithville_adversarial_review.md` with verdict PASS | HOLD | REFUTED and evidence.
```

---

## E2 — F1 CAD source-registry sweep (read-only recon)

```
DO NOT delegate to or spawn other agents; you do the work yourself.

You are a RECON EXECUTOR for F1 CAD source registry. Operator-authorized 2026-08-09. READ-ONLY — no ingest, no database writes, no merges.

CANON-PREAMBLE v0f465c77

REPO: P:\doc_repo only (+ live public HTTP probes). NO privileged data; public endpoints only. Districts with no public path get honest registry rows (Donley pattern = success, not failure).

STATE-TEMPLATE RULE: registry row schema must hold for UT/NM/CO/AZ GIS postures — use generic fields (url, format, vintage, auth_posture, adapter_kind), no Texas-only field names without a generic equivalent.

SCOPE: Extend CAD source registry beyond CAPCOG seed toward all 254 Texas appraisal districts. Tranche by COG region. LAUNCH FOOTPRINT FIRST: Central Texas COGs (CAPCOG, AACOG adjacency) + Dallas metro COGs.

EXISTING ASSETS (use, do not re-derive from memory):
- `_inbox/t6_cad_probe_{fips}.json` — 253 county probes (2026-08-05)
- `_catalog/texas_roster_v1.json`
- `_catalog/tx_jurisdiction_source_registry.json` — shape reference for row fields
- `90_operations/OPS-1_texas_source_registry.md`

TASK:
1. Define `_catalog/tx_cad_source_registry.json` schema (document in file header): per appraisal district (county FIPS): service_url, layer_id, prop_id_field, format (arcgis_rest | bulk_export | download_portal | honest_absent), vintage, auth_posture (public_anonymous | token_gated | bulk_only | absent), vendor_pattern, cog_region, probe_evidence_path, verified_at, confidence.
2. Tranche 1: ingest CAPCOG + Dallas-metro counties from t6 probes into registry rows (transform, don't re-probe unless probe artifact missing or stale >30d).
3. Tranche 1 live gap-fill: for launch-footprint counties missing t6 artifacts, run four-point probe (OPS-1 rule) and write row.
4. Write `_catalog/tx_cad_source_registry_coverage_summary.md` with public-endpoint yes/no counts per tranche.

ADVERSARIAL CHECKPOINT (per tranche):
Write `_inbox/2026-08-09_E2_tranche1_builder_close.json`. Planner fans reviewer to re-probe 10% sample; ANY unreproducible row fails the tranche.

DELIVERABLES:
- `_catalog/tx_cad_source_registry.json` (tranche 1 rows minimum)
- `_catalog/tx_cad_source_registry_coverage_summary.md`
- `_inbox/2026-08-09_E2_tranche1_builder_close.json`

NO ingest. NO engine code changes unless schema needs a typed loader stub in doc_repo (prefer JSON only).
```

### E2-ADV — Adversarial reviewer (10% re-probe)

```
DO NOT delegate to or spawn other agents.

ADVERSARIAL REVIEWER for E2 tranche 1. Independent of builder.

PRE-REGISTERED: randomly select 10% of tranche-1 rows (minimum 5), re-run four-point probe live. Fail tranche on ANY row where service_url, layer_id, or prop_id_field does not reproduce.

INPUT: `_catalog/tx_cad_source_registry.json` tranche 1 + builder close artifact.

OUTPUT: `_inbox/2026-08-09_E2_tranche1_adversarial_review.md`
```

---

## E3 — F3 Elgin proof (dry-run only; apply STOP)

```
DO NOT delegate to or spawn other agents; you do the work yourself.

You are a BUILD EXECUTOR for F3 depth warm. Operator-authorized 2026-08-09.

CANON-PREAMBLE v0f465c77

REPO: P:\hauska-engine (primary), read-only SELECT on atoms DB.

AUTHORIZATION: you MAY run parcel-node anchor writes ONLY if explicitly slotted in _STATE.md. Default: dry-run ONLY. You MUST NOT run warm apply — planner go required + atoms bulk slot queued behind Handoff D lanes D0/D1.

PREREQUISITE: engine #287 MERGED (`41cfdb4c`). Unified runner: `depth-warm-city-batch.mjs --row-id=Elgin`.

TASK (a) — PARCEL-NODE ANCHORS
Ensure Elgin city-cohort parcels have parcel-node atoms (C1/C5 gate). If anchors missing, mint via the established parcel-node writer path ONLY if atoms bulk slot is free per _STATE.md; otherwise document blocker and STOP.

TASK (b) — UNIFIED DRY-RUN
```
pnpm --filter @hauska-engine/engine-core run depth-warm-city-batch -- --row-id=Elgin --dry-run --city-cohort
```
Compare counters against legacy `depth-warm-elgin-batch.mjs` expectations on origin/main at merge-base: 0-mismatch standard (Bastrop gate-path comparison method). Emit uncapped refused roster.

TASK (c) — ADVERSARIAL CHECKPOINT 1 (before any apply)
Pre-registered expectations in `_inbox/2026-08-09_E3_elgin_preregistered_expectations.json`:
- dry-run decline distribution NOT dominated by no-parcel-node-anchor (if anchors done)
- bulkBcad currency gate decline surface documented (superseded-prop-id vs legacy)
- R28/R30 recompute paths exercised on ≥1 parcel in refused roster sample
- dry-must-predict-apply: no compute forks on dryRun flag in Elgin path

Write builder close: `_inbox/2026-08-09_E3_elgin_dryrun_artifact.json` (full counters, roster path, engine SHA).

TASK (d) — STOP
Do NOT apply. Return apply-ready | blocked verdict for planner.

DELIVERABLES:
- `_inbox/2026-08-09_E3_elgin_preregistered_expectations.json`
- `_inbox/2026-08-09_E3_elgin_dryrun_artifact.json`
- `_inbox/2026-08-09_E3_elgin_builder_close.json`
```

### E3-ADV — Adversarial reviewer (dry-run counter audit)

```
DO NOT delegate to or spawn other agents.

ADVERSARIAL REVIEWER for E3. Attack frame: independent counter re-derivation from refused roster + spot-check 5 parcels via live atom/storage reads. Verify pre-registered expectations in `_inbox/2026-08-09_E3_elgin_preregistered_expectations.json`.

OUTPUT: `_inbox/2026-08-09_E3_elgin_adversarial_review.md` — verdict apply-ready | HOLD | blocked with named blockers.
```

---

## Planner close checklist

| Lane | Builder artifact | Reviewer artifact | Planner verify at source |
|---|---|---|---|
| E1 | `_inbox/2026-08-09_E1_*` | `_inbox/2026-08-09_E1_smithville_adversarial_review.md` | eval scores live; stamp dry-run counts |
| E2 | `_catalog/tx_cad_source_registry.json` + E2 close JSON | `_inbox/2026-08-09_E2_tranche1_adversarial_review.md` | 10% re-probe pass |
| E3 | `_inbox/2026-08-09_E3_elgin_dryrun_artifact.json` | `_inbox/2026-08-09_E3_elgin_adversarial_review.md` | dry counters vs legacy script |

Update `_STATE.md` OPEN section when lanes close or block.
