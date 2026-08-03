---
id: PHASE_C_FINISH_bastrop_city_remaining_blocks
title: PHASE C FINISH — warm + cert the remaining Bastrop city district blocks (GC/MU/RR/PI/IND) in parallel, to GATE C for operator R6
date: 2026-08-03
status: dispatch (SF-1 DONE + serving certified on prod; finish the city; parallel warm, sequential per-block cert gate)
owner: nick
related: [PHASE_C_RESUME_full_sweep_then_blocks, 2026-08-02_bastrop_recipe_ACCEPTED, 2026-08-02_operate_the_factory_never_rebuild_it, OPS-2_county_onboarding_runbook, OPS-5_cert_standard, FINDING_2026-08-03_factory_product_setback_disconnect]
---

# PHASE C FINISH — the remaining Bastrop city blocks

You are the MASTER PLANNER finishing Bastrop city. SF-1 is DONE (1919/1919 blockPass, serving certified per-parcel setbacks + drawn envelope live on prod via the atom-chain — verified). Your job: warm + cert the REMAINING warmable district blocks so the whole city is mechanically swept + served + CC-visible, then STOP at GATE C for the operator's R6. You do NOT claim "Bastrop city certified" — the operator does, after R6.

## THE BLOCKS (parallel warm, sequential cert gate)
Remaining warmable district blocks (per PHASE_C_HANDOFF §3 district mix): **GC (889), MU (516), RR (645), PI (240), IND (117).** PDD (1,978) + null (117) → GRACEFUL HONEST-DECLINE (S-10), NOT warm failures. Block-13 QUARANTINED (never re-warm; the 7-parcel regression must hold).

## HOW TO RUN IT — parallel warm, one sub per block
You may fan the WARM in parallel: spawn ONE sub-agent per district block (GC/MU/RR/PI/IND), each running the SAME proven generalized line on its own dominant-district roster. This is pure REPLICATION of the SF-1 path — same source (layer-23 per-parcel record), same adapter, same recipe, same on-main generalized harness. Nothing new is built. Each sub:
1. Builds its block's dominant-district (R26) cohort from the layer-23 city roster.
2. Warms all block parcels from ON-MAIN scripts: `--dominant-district-cohort --district-prefix=<BLOCK> --force-overwrite --promote --upsert-ledger` (env: PROPERTY_ATOM_PATH=1, prod-cortex DATABASE_URL + TXGIO_DATABASE_URL). R28 winding + R30 edge-role re-derive are MANDATORY (that IS the persisted!=recompute fix — never warm without --force-overwrite). R33 warm==cert gate is live.
3. Runs the generalized `block13-cert-grade.mjs` area-sweep over its block's roster → reports raw per-gate counts + blockPass.
4. Returns: warm+promote count, sweep result (per-parcel per-gate), PDD/null honest-decline count in-block, raw evidence. Does NOT self-certify, does NOT merge anything new, does NOT deploy. If a promoted parcel fails cert (not an honest-decline), the sub STOPS + reports (does not force past).

CONCURRENCY SAFETY: all subs run the SAME on-main scripts against the SAME prod Neon but each writes ONLY its own district's parcels (disjoint rosters) — no write collision. Do NOT let two subs warm the same district. Keep Block-13's 7 parcels out of every roster.

## THE PLANNER's JOB (you — never delegated)
- VERIFY every sub's hand-back against LIVE truth, not its word: query the promoted ledger + curl a sample warmed parcel on the PE serve path (`/api/spine/property-atoms/48021:<APN>/facets` → envelope status ok + certified setbacks) for each block. This is the end-to-end served-surface check (the hardening from the retracted-finding lesson): a block is not "done" until a sample parcel SERVES certified data on prod, not just passes the warm-store sweep.
- SEQUENTIAL CERT GATE: parallel warm is fine, but grade each block's sweep and hold each to blockPass INDIVIDUALLY. One wrong parcel in a block = that block FAILS → fix root cause → re-warm + re-sweep the WHOLE block (never sample, never force past). A block passing does not depend on the others.
- Block-13 regression: after all warms, confirm Block-13 still grades 7/7 from main (the generalized harness must not have regressed the reference).
- The 15 parcels earlier removed from SF-1 grade HERE in their real dominant-district blocks.

## GATE C (the STOP line — do NOT cross)
When ALL warmable blocks (SF-1 already done + GC/MU/RR/PI/IND) are: single-vintage (recipe 1.0.0) + swept-clean (blockPass) + ledger-populated + CC-visible (cmdcenter-blush) + a sample parcel per block SERVING certified data on the PE prod path + PDD/null/landlocked honest-declined → **STOP**. Report "Bastrop city ready for operator R6" with per-block sweep evidence + the per-block live-serve confirmation. NO "certified" claim. Also STOP + report if any block hits a wall the recipe can't clear (rebuild trigger) — never improvise past it.

## STANDING DECISIONS (paste into EVERY sub-dispatch verbatim — a fresh sub does NOT have planner memory)
- OPERATE/EXTEND the proven artifact, NEVER build new machinery. These blocks are REPLICATION of the SF-1 path — run the on-main generalized harness + dominant-district cohort. Building a new cohort selector / cert harness / warm path = a flagged operator-approved DEVIATION; the planner rejects unapproved parallel builds at verify. (2026-08-02_operate_the_factory_never_rebuild_it — the fleet's #1 past failure.)
- VERIFICATION NEVER DELEGATED — the planner grades LIVE truth (promoted ledger + PE serve-path curl), never a sub's word.
- persisted==recompute (R10) — NEVER trust the stored atom over the recompute; --force-overwrite every warm (R28/R30).
- ANTI-FABRICATION + HONEST-ABSENCE (OPS-7) — never fabricate a front/setback/envelope; PDD/null/landlocked honest-decline gracefully + disclosed (a PASS, not a failure); never silent-degrade. "Setbacks not verified" for an unwarmed parcel is CORRECT.
- NO SPECIAL DATA ACCESS — uniform public record (layer-23); every path must work for a no-relationship jurisdiction.
- COTALITY EXTINGUISHED — if any live path hits Cotality, re-route to county-GIS/public-record; NEVER fix its credential. Regrid dead.
- DEPLOYS/WARMS PLANNER-OWNED — a failed warm is the agent's job to fix, never "operator action."
- AREA-SWEEP NOT SAMPLE — grade every rendered parcel in the block; fail-closed on any gap.
- BOTH CERT GATES — mechanical area-sweep AND operator R6. No "certified" without R6.
- BLOCK-13 QUARANTINED — never re-warm; keep out of every roster; the 7/7 regression must hold.
- MERGE ONLY ON GREEN CI; run FROM main. No NEW code should be needed (replication) — if a sub thinks it needs new code, that's a STOP-and-flag, not a build.
- CLOUD RUN TRAPS (if any deploy is touched): :latest image-race (SHA-pin + confirm build-and-push + curl the NEW route); traffic-trap (serving≠latest; trust BASE-URL); migration-merged≠applied. (No new deploy should be needed for a warm — the serve path is live.)
- BACKGROUND-DISPATCH: a first "running in the background" notice is premature status, NOT an orphan — distinguish slow-vs-orphan over TIME; never run two dispatches of the same district on the same main.
- NO TIMEFRAME ESTIMATES — order by dependency, no days/weeks. PASTE RAW command/probe output when reporting live/tool state.

## DELIVERABLE
ONE final report: per-block (GC/MU/RR/PI/IND) warm+promote count + area-sweep per-gate result + PDD/null honest-decline count + a sample-parcel PE-serve confirmation (envelope ok + certified setbacks on prod); Block-13 still 7/7; the CC County Ledger showing 48021 all blocks populated. End at GATE C: "Bastrop city ready for operator R6." NO certified claim — that's the operator's after R6.
