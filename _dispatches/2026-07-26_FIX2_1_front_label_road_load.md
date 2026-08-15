---
id: 2026-07-26_FIX2_1_front_label_road_load
title: Dispatch — FIX 2.1 front-labeling correct-by-rule + fixture gate
status: closed
date: 2026-07-26
applies_to: [hauska-engine]
planner: depth-engine planning agent
wdll: _inbox/2026-07-26_FIX2_1_front_labeling_WDLL.md
cites_wdll_items: [1, 2, 3, 4, 5, 6, 7, 8]
supersedes_draft_framing: stop-load-filter-first
---

# FIX 2.1 — execute against approved WDLL

**WDLL (approved 2026-07-26):** `_inbox/2026-07-26_FIX2_1_front_labeling_WDLL.md`  
**Finding:** `_inbox/2026-07-26_FIX2_zero_promote_root_cause.md`

Do **not** ship “stop load-filter” alone. That restores the footway-shadow accident on 34785. Load-bearing work is correct-by-rule front competition + the fixture gate.

## Executor scope (hauska-engine)

### A. Labeler (WDLL 1, 2, 4) — code

In `packages/engine-core/src/depth-warm/edgeLabeling.ts`:

1. Front competition must use closest **front-eligible non-alley** hit per edge (ineligible ways must not own the front-competition slot).
2. Among eligible edge candidates within proximity threshold, prefer local street (`residential` / `unclassified`) over collector/highway for front — primary preference, not only ≤2 m distance tie-break.
3. Keep footway/path ineligible for front (`isFrontEligibleRoad`).
4. Batch `roadAtomToWarmSource`: remove load-time `isFrontEligibleRoad` filter **only in this same PR** (WDLL 4).

### B. FRONT-LABELING FIXTURE GATE (WDLL 2, 3) — M0 promotion

New dedicated vitest file (suggested: `src/depth-warm/__tests__/front-labeling-fixture-gate.test.ts`) that **fails CI** if any miss:

| Case | Assert |
|------|--------|
| `48021:34785` collector-vs-local | front = local/unclassified edge, not major_collector/secondary |
| R4.1 footway | footway never front when street present |
| R4.3 gravel | gravel front labels/classifies correctly (reuse or import existing gravel fixture intent) |
| Not-by-accident | 34785 front **identical** with and without footway in the road set |

Use live-shaped ring coords for 34785 (from recon / FIX1.1 fixture `PARCEL_1009_CHESTNUT_34785_LIVE_TXGIO` if present). Cite WDLL items 2–3 in the test file header.

### C. PR + CI (WDLL 1–4)

- Branch off main (includes FIX 1.1 `d34ed4fd`).
- PR body cites WDLL items 1–4.
- Do **not** merge until planner live-verifies WDLL 5.

### D. After planner merge greenlight — promote + ceiling (WDLL 6)

```text
pnpm --filter @hauska-engine/engine-core depth-warm-bastrop-batch --
  --place-type-cohort --city-cohort --promote --limit=4000
```

Env: `DATABASE_URL` + `TXGIO_DATABASE_URL`=`CORTEX_DATABASE_URL` + `PROPERTY_ATOM_PATH=1`.  
Paste before/after (baseline **2345 / 3657**). Reclassify residual once under **same** batch road path. File `_inbox/2026-07-26_FIX2_1_checkin.md`.

### E. Deploy engine-api (WDLL 7)

Deploy `hauska-engine-api` via service cloudbuild / canary (not repo-root Dockerfile). Preserve secrets. Paste serving revision + evidence that site-plan path is post–FIX 1.1 (34785 non-degenerate or health+revision SHA containing `d34ed4fd` / FIX2.1 merge).

## Hard rules

- No PDD / not_specified fabrication.
- No Central-TX county fan-out (WDLL 8).
- Verification against live state; paste evidence.
- Scratch: append GROUND-TRUTH; do not promote prose without the gate.

## Return to planner

PR URL; gate test path; live 34785 probe JSON; after merge: before/after depth tallies + residual table; engine-api revision; blockers.
