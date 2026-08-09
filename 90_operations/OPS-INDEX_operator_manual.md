---
id: OPS-INDEX_operator_manual
title: OPS-INDEX — Operator Manual (START HERE — how an agent operates the factory)
date: 2026-08-03
status: index / front-door (the single entry point into the operations doc set; the prose bridge until onboard(fips) is a mechanism)
owner: nick
related: [OPS-WDLL_the_factory, OPS-0_MASTER_game_plan, OPS-1_texas_source_registry, OPS-2_county_onboarding_runbook, OPS-3_engine_contract_determinism_register, OPS-4_rewarm_protocol, OPS-5_cert_standard, OPS-6_command_center_engine_console, OPS-7_coverage_and_honesty_doctrine, OPS-11_invariant_register, OPS-12_instrument_inventory, OPS-13_store_topology, 90_runbooks/factory_onboarding_runbook, 2026-08-02_bastrop_recipe_ACCEPTED, 2026-08-02_operate_the_factory_never_rebuild_it, 2026-08-09_factory_spec_precedence_ruling]
purpose: The SINGLE door an agent walks through to operate the factory. One place that says what to read, in what order, and how to run a jurisdiction through the line — so no one has to hand-relay the recipe or discover the OPS docs by archaeology. This is the prose front-end of the manual; onboard(fips) (Phase D) will make the run itself a mechanism.
---

# OPS-INDEX — Operator Manual (START HERE)

You are operating the property-intelligence factory. You RUN it, WATCH it, and TROUBLESHOOT it. You do NOT rebuild it, and you are never in the correctness path — the engine is deterministic machinery; you operate it. Read this whole page before you touch anything.

## THE FIVE THINGS THAT ARE ALWAYS TRUE (the non-negotiables — internalize before running)
1. OPERATE, DON'T REBUILD. If a frozen proven artifact exists (the block13-cert-grade harness, the warm batch, the recipe), you RUN or EXTEND it. Building a new cohort selector / cert harness / warm path because you'd do it differently is a DEVIATION that requires operator approval; the planner rejects unapproved parallel builds at verify. (2026-08-02_operate_the_factory_never_rebuild_it. This is the #1 failure this factory has had — do not repeat it.)
2. VERIFY LIVE, NEVER ON A REPORT. Grade the served facet / substrate SELECT / live ledger, never an executor's summary. If you can only answer "did it work?" from an agent's word, it is not verified.
3. persisted == recompute (R10). Never trust a stored atom over a fresh recompute. If cert's recompute disagrees with the stored answer, FIX THE RECOMPUTE — never bless the stored value to make the sweep pass.
4. NEVER FABRICATE. A parcel is a cert PASS or a DISCLOSED honest-decline — never a guessed front/setback/envelope, never a silent gap. Honest-absence is the product, not a failure. (OPS-7.)
5. AREA-SWEEP, NEVER SAMPLE. Grade every rendered parcel in a block. One wrong parcel fails the block → fix root cause → re-sweep the WHOLE block. (Sampling certified a broken Bastrop before.)

## WHAT THE FACTORY IS AND WHAT "DONE" MEANS
Read OPS-WDLL_the_factory FIRST — it defines the factory, what a working run looks like, what a broken run looks like, and the kill criteria. That is your definition of done and your smell test.

## READ ORDER (the manual, in dependency order)
Read these in order the first time; after that, jump by need.
1. OPS-WDLL_the_factory — what the factory is; done vs broken vs kill. (The frame.)
2. 2026-08-02_bastrop_recipe_ACCEPTED — THE recipe (R1-R35+, the 8 buckets, the reversal ledger). The correctness contract every warmed parcel honors. Load-bearing.
3. OPS-3_engine_contract_determinism_register — the mechanical/agent boundary + the determinism invariants (I1-I7). What the machine enforces vs what you operate.
4. OPS-1_texas_source_registry — the frozen source-of-truth registry (what to source per jurisdiction; the baked-in engine input).
5. OPS-2_county_onboarding_runbook — THE deterministic loop: raw sources → certified served parcels. This is the run you execute.
6. OPS-5_cert_standard — what "certified" means per unit; the anti-sampling, grade-the-geometry gate; both cert gates (mechanical + operator R6).
7. OPS-4_rewarm_protocol — how a recipe improvement re-warms the country deterministically. (Read when a recipe rule changes.)
8. OPS-6_command_center_engine_console — the factory floor (cmdcenter-blush.vercel.app); where you and the operator watch a jurisdiction come online. The CC County Ledger is the live ground truth.
9. OPS-7_coverage_and_honesty_doctrine — honest-absence at country scale; never present un-warmed as served.
10. OPS-0_MASTER_game_plan — the build/run charter + the autonomous-run boundary (what runs without the operator, and the R6 stop line).
11. OPS-13_store_topology: which store holds which truth, the env-var map, the two-databases-one-endpoint split, and the pooler write hazard. Read BEFORE writing any query, dispatching any data lane, or believing any coverage number. Added 2026-08-09.
12. OPS-12_instrument_inventory: every gate and check in one table with what it CANNOT see. Read when you are about to trust a PASS. Carries the Harris case (a count cannot detect a defect it inherits) and the thirteen defect classes with no instrument. Added 2026-08-09.
13. OPS-11_invariant_register: the one register reconciling the Geometry Law, OPS-3 I1-I7, the white-paper five, and the five things above, each line naming its enforcing check or marked UNENFORCED. Added 2026-08-09.

PRECEDENCE NOTE (2026-08-09): `90_runbooks/factory_onboarding_runbook.md` governs the pipeline procedure and is now the most complete end-to-end doc; this OPS band governs doctrine and definitions. The root 27-band factory specs are retired per `_decisions/2026-08-09_factory_spec_precedence_ruling.md`, with `27c` (road-node design contract) and `28_THE_BASTROP_MOLD` (living trap register) kept active.

## HOW TO RUN A JURISDICTION THROUGH THE LINE (the loop — today, by hand; Phase D makes it `onboard(fips)`)
This is the OPS-2 loop in operator shorthand. Every step has a hard mechanical gate; a failing gate STOPS the lane and you fix root cause — never force past.
1. FREEZE the jurisdiction's registry row (OPS-1): source-of-truth, adapter, currency/vintage. Confirm it's frozen in the engine loader, not fetched live.
2. COST re-measure on a small cohort (~150 parcels) with the re-derive path vs the $200 gate. Confirm it clears before the full run.
3. WARM district-block by district-block (dominant-district R26 cohort), with the re-derive path MANDATORY every warm (R28 winding recompute + R30 edge-role re-derive — this IS the persisted!=recompute fix; never warm without it). --force-overwrite --promote --upsert-ledger.
4. CERT each block: the generalized block13-cert-grade harness (roster = the block's rendered parcels) area-sweeps every parcel — R32 measured envelope, orientation front-on-frontage, district + full field parity, R9 currency, R10 recompute, R13 no-repealed. blockPass = every parcel PASS or disclosed honest-decline (R35 declines count as pass), staleResidue=0.
5. HONEST-DECLINE the un-warmable: PDD + null-situs + landlocked → disclosed honest-decline (a PASS, not a failure). Never fabricate.
6. LEDGER + CC: the block's coverage/cert-state/cost/vintage upsert to county_facet_coverage and show in the CC County Ledger. The operator watches here.
7. GATE C → STOP: when all warmable blocks are single-vintage + swept-clean + ledger-populated + CC-visible + un-warmable-declined → STOP and report "ready for operator R6." NEVER claim "certified" — the operator claims that after R6 live visual QA.
8. QUARANTINE the reference: Block-13 (7 parcels) is never re-warmed; it stays the 7/7 cert regression. Any harness change must still grade it 7/7.

## THE DEPLOY / TOOL TRAPS (paid-for; do not re-learn — full list in the standing-decisions block below)
- :latest image-race → SHA-pin, confirm build-and-push done, curl the NEW route. (Bit cortex twice.)
- Cloud Run traffic-trap → a deploy makes a new revision but prod serves OLD until explicit shift; describe API caches stale traffic — trust BASE-URL behavior.
- Migration merged != applied → run-migrations is a separate workflow_dispatch action.
- Shared-clone hazard → work in isolated fresh clones/worktrees; stage explicit paths; git log -3 before commit.
- Merge only on green CI → local test runs != PR checks; run FROM main after merge.
- Background-dispatch → a first "running in the background" notice is premature status, NOT an orphan; distinguish slow-vs-orphan over TIME; never run two dispatches of the same task on the same main.
- CC deploy → the LIVE console is Vercel project `cmdcenter` (cmdcenter-blush), NOT `command-center` (jade). Link --project cmdcenter, verify the change is in the blush bundle.
- Cotality is EXTINGUISHED → if a live path hits it, re-route to county-GIS/public-record; NEVER fix its credential. Regrid also dead.

## THE STANDING-DECISIONS BLOCK (paste this verbatim into every sub-dispatch — this is how the manual reaches a fresh executor)
> Memory reaches the PLANNER seat only; a fresh executor does NOT have it unless it's pasted. So every dispatch carries: operate/don't-rebuild (frozen artifact by default; new machinery = flagged operator-approved deviation). Verification never delegated (grade live truth). persisted==recompute (R10 — fix the recompute, never trust stored). Anti-fabrication + honest-absence (OPS-7). Area-sweep not sample. Both cert gates (mechanical + operator R6). Block-13 quarantined (7/7 regression must hold). No special data access (uniform public record; every path works for a no-relationship jurisdiction). Cotality extinguished (re-route, never fix its credential; Regrid dead). Deploys/warms planner-owned. Cloud Run :latest-race + traffic-trap + migration-not-applied in play. Merge only on green CI. No timeframe estimates. Paste raw command/probe output. If a wall the recipe can't clear appears, STOP + report (rebuild trigger) — never improvise past it.

## THE HONEST STATE OF THIS MANUAL (read this)
Today the manual is PROSE you must read and apply correctly across the OPS docs + the recipe. That is a crutch and a source of drift — the operate-not-rebuild failure happened because prose can be interpreted away. The fix is `onboard(fips)` (Phase D): a single self-guarding command that reads the frozen registry row → runs the warm with re-derive by default → runs the generic cert → fails closed on any invariant violation → writes the ledger → surfaces in CC → HALTS for R6. When that exists, an agent runs `onboard(48091)` with zero recipe knowledge and the MECHANISM enforces the recipe. Until then, THIS index + the pasted standing-decisions block are how the manual reaches you. The spec for the mechanism is PHASE_C_mechanism_vs_prose_SPEC; the build comes after Bastrop city + county prove the line.
