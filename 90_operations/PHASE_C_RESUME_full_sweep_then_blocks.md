---
id: PHASE_C_RESUME_full_sweep_then_blocks
title: PHASE C RESUME — Class A/B fix is MERGED; now full SF-1 re-sweep to blockPass, then GC→MU→RR→PI→IND
date: 2026-08-03
status: resume dispatch (the recompute-divergence fix landed on main #212 green; SF-1 5-parcel probe passes; FULL SF-1 re-sweep still unchecked)
owner: nick
related: [PHASE_C_RESUME_recompute_divergence, PHASE_C_RESUME_merge_then_rewarm, PHASE_C_HANDOFF_bastrop_warm, 2026-08-02_bastrop_recipe_ACCEPTED, 2026-08-02_operate_the_factory_never_rebuild_it]
---

# PHASE C RESUME — full SF-1 sweep, then the remaining blocks

## WHERE WE ARE (live-verified 2026-08-03, not from reports)
- The Class A/B recompute-divergence fix is MERGED to hauska-engine main: **#212 `d63861a`, CI green** (typecheck + test: success). Files: `cert-equivalent-gates.ts` (the shared warm/cert parity fix), `r35-no-frontage-orientation.test.ts` (R35 null-situs as a mechanism + facesAnswer disclosed-decline), `diagnose-class-b-recompute.mjs`, `block13-cert-grade.mjs`.
- CLASS B ROOT CAUSE (from the diagnosis script, honored R10 — did NOT trust stored over recompute): cert's recompute path was missing the **R28 winding step** the warm path applied, so `computeWarmCandidateFromBoundary` came back empty on 28855/30857 though the stored envelope was valid. FIX = restore R28 parity in the shared cert-equivalent path, so recompute re-derives the SAME candidate warm did. persisted==recompute holds for the RIGHT reason.
- CLASS A (8741972/73/74 null-situs) → R35 orientation honest-decline, shipped as a tested mechanism.
- **BUT the full SF-1 re-sweep is NOT confirmed.** The #212 PR checklist reads: `[x] 5-parcel roster probe blockPass=true locally` / `[ ] Full SF-1 re-sweep blockPass=true`. The fix is proven on the 5 problem parcels in isolation; it is NOT yet graded across all ~1,919 SF-1 parcels.
- LIVE LEDGER (cortex-api base https://cortex-api-tds7av26va-uc.a.run.app/api/county-ledger, 48021): zoning + envelope at **74.22%**, recipe 1.0.0, vintage `layer-23-city-sf-1`, **hasStale=false** (stale-residue cleared), certState **uncerted** (correct — no false cert claim). land-use 98.01% integrity pass (CAD roll). This confirms: SF-1 warmed clean + single-vintage; the OTHER blocks (GC/MU/RR/PI/IND) are NOT yet in the ledger.

NET: the hard recompute bug is fixed and merged. Two things remain before GATE C: (1) confirm the fix holds across the FULL SF-1 block (not just the 5), (2) run the remaining district blocks. This is finishing the warm, not fixing machinery — operate the proven line.

## STEP 1 — FULL SF-1 RE-SWEEP FROM MAIN → blockPass (the unchecked box)
Run the generalized `block13-cert-grade.mjs` (from main, #212) over the ENTIRE SF-1 dominant-district roster (~1,919 rendered parcels, not the 5-parcel probe). Env: PROPERTY_ATOM_PATH=1, prod-cortex DATABASE_URL + TXGIO_DATABASE_URL.
- TARGET: `blockPass=true` — every SF-1 parcel PASS or disclosed honest-decline (R35 null-situs/landlocked declines COUNT as pass); `staleResidue=0`.
- The 5 former fails must now be: 8741972/73/74 → R35 decline (pass); 28855/30857 → recompute-matches-warm (pass). Block-13 7/7 regression MUST still hold (run the 7-parcel Block-13 invocation of the same harness — if it drops below 7/7, STOP: the R28 parity change regressed the reference).
- If ANY promoted SF-1 parcel STILL fails cert (not an honest-decline), STOP + report with the parcel id + which gate + raw measurement. Do NOT force past. Do NOT blanket-trust stored over recompute (R10).

## STEP 2 — CONTINUE THE BLOCKS: GC → MU → RR → PI → IND (only after SF-1 blockPass)
For EACH block, in order (per PHASE_C_HANDOFF §7):
1. Dominant-district (R26) cohort for the block from layer-23 city roster.
2. Warm all block parcels: `--force-overwrite --promote --upsert-ledger` (R28 winding + R30 edge-role re-derive are MANDATORY every warm — never warm without re-derive; that IS the persisted!=recompute defect). R33 warm==cert gate is live.
3. Ledger upserts the block's coverage (visible in CC County Ledger, cmdcenter-blush).
4. Generalized `block13-cert-grade.mjs` area-sweep over the block's roster → `blockPass`. AREA-SWEEP EVERY rendered parcel, NEVER sample. One wrong parcel = block fails → fix root cause → re-warm + re-sweep the WHOLE block.
5. The 15 parcels removed from SF-1 (belonged to their dominant districts) grade HERE, in their real blocks — not a flat file.
- PDD (1,978) + null (117) → GRACEFUL HONEST-DECLINE (S-10 accepted): served as parcel+zoning where resolvable, orientation/envelope honest-declined, disclosed. These are PASSES, not warm failures. Never fabricated.
- Block-13 QUARANTINED — never re-warm; kept as the 7-parcel regression.

## STEP 3 — GATE C (the STOP line, unchanged)
When ALL warmable blocks are: single-vintage (recipe 1.0.0) + swept-clean (generalized harness blockPass) + ledger-populated + CC-visible (cmdcenter-blush) + PDD/null/landlocked honest-declined → **STOP**. Report "Bastrop city ready for operator R6" with per-block sweep evidence (raw counts per gate). NO "certified" claim — the operator claims that after R6 live visual QA in CC. Also STOP + report if any block hits a wall the recipe can't clear (rebuild trigger) — never improvise past it.

## STEP 4 — CAPTURE FOR onboard(fips) (the Phase C→D dual deliverable)
As each block runs, keep the mechanism-vs-prose map current (PHASE_C_mechanism_vs_prose_SPEC): every step that is still "prose an agent must interpret" (cohort-by-dominant-district, --force-overwrite mandatory, PDD-declines-not-fails, extend-the-roster) vs "mechanism that self-enforces." That map is the Phase D onboard(fips) build input. The two concrete Bastrop-specificities to generalize: (a) depth-warm-bastrop-batch.mjs → generic warm keyed on the registry row; (b) block13-cert-grade roster → the jurisdiction's rendered roster (already parameterized via --roster-from — confirm it reads the registry).

## STANDING DECISIONS (travel with every sub-dispatch — paste verbatim, do not summarize)
- OPERATE/EXTEND the proven artifact, NEVER fork or rebuild. Building new machinery when a frozen equivalent exists = a flagged operator-approved DEVIATION; planner rejects unapproved parallel builds at verify. (2026-08-02_operate_the_factory_never_rebuild_it.)
- VERIFICATION NEVER DELEGATED — grade LIVE truth (served facet, substrate SELECT, live ledger), never an executor's word. Caught 3+ real defects this arc.
- persisted==recompute (R10) — NEVER trust the stored atom over the recompute. That is the exact defect fought all phase. Fix the recompute, don't bless the stale atom.
- ANTI-FABRICATION + HONEST-ABSENCE (OPS-7) — never fabricate a front/setback/envelope; honest-decline gracefully + disclosed; never silent-degrade.
- NO SPECIAL DATA ACCESS — uniform public record; every path must work for a no-relationship jurisdiction (Bastrop gets no tenant/relationship data).
- COTALITY EXTINGUISHED — if any live path hits Cotality, re-route to county-GIS/public-record; NEVER fix its credential. Regrid also dead.
- DEPLOYS/WARMS PLANNER-OWNED — a failed deploy/warm is the agent's job to fix, never "operator action: redeploy."
- CLOUD RUN TRAPS in play: :latest image-race (SHA-pin + confirm build-and-push done + curl the NEW route); traffic-trap (serving≠latest until explicit shift; describe API caches stale — trust BASE-URL behavior); migration-merged≠applied (run-migrations is a separate workflow_dispatch action).
- MERGE ONLY ON GREEN CI — local test runs ≠ PR checks; run FROM main after merge, not from a local branch.
- AREA-SWEEP NOT SAMPLE — grade every rendered parcel; fail-closed on any gap. Sampling certified a broken Bastrop before.
- BOTH CERT GATES — mechanical area-sweep AND operator R6. No "certified" without R6.
- BLOCK-13 QUARANTINED — never re-warm; the 7-parcel regression must stay 7/7.
- BACKGROUND-DISPATCH: a first "running in the background" notice is premature status, NOT an orphan — distinguish slow-vs-orphan over TIME; NEVER run two dispatches of the same task on the same main concurrently. Heavy multi-step builds: do directly or with a strict pushed-branch+PR deliverable contract.
- SHARED-CLONE HAZARD — isolated fresh clone/worktree, stage explicit paths, git log -3 before commit.
- NO TIMEFRAME ESTIMATES — order tasks by dependency, no days/weeks.
- PASTE RAW command/probe output when reporting tool/live/git state.

## DELIVERABLE
ONE report: full SF-1 blockPass (raw counts, the 5 former fails now passing, Block-13 still 7/7), then per-block (GC/MU/RR/PI/IND) warm+sweep evidence, PDD/null honest-decline counts, the CC County Ledger showing 48021 blocks populated, and the updated mechanism-vs-prose map. End at GATE C: "Bastrop city ready for operator R6." NO certified claim.
