---
id: OPS-WDLL_the_factory
title: OPS-WDLL — The Factory WDLL (what the property-intelligence factory IS, what DONE looks like, what BROKEN looks like, what kills it)
date: 2026-08-03
status: WDLL (the done-state definition for the factory itself — the mold, not any one jurisdiction)
owner: nick
related: [OPS-0_MASTER_game_plan, OPS-2_county_onboarding_runbook, OPS-3_engine_contract_determinism_register, OPS-5_cert_standard, OPS-7_coverage_and_honesty_doctrine, 2026-08-02_bastrop_recipe_ACCEPTED, 2026-08-02_operate_the_factory_never_rebuild_it, PHASE_C_mechanism_vs_prose_SPEC]
purpose: The single WDLL for the FACTORY as a thing — the definition of done, the definition of broken, and the kill criteria. Everywhere else describes how to build or run pieces; this says what "the factory is working" MEANS, so an operator or agent can tell a good run from a bad one without re-deriving it.
---

# OPS-WDLL — The Factory

## WHAT IT IS (one paragraph)
The factory is a deterministic, rewarmable machine that takes a Texas jurisdiction's public records and produces plan-reviewer-grade, cited, honest property intelligence — parcels, zoning, buildable envelopes, and data layers — served on prod and watchable in Command Center. The machine is the ENGINE STACK (deterministic code: warm, inset measurement, cert, ledger). Agents are OPERATORS who run it, watch it, and troubleshoot it — they are never in the warm/cert/serve correctness path, and they never rebuild the line. The unit of output is a certified "smart site"; a city is a bunch of smart sites; a report is a smart site X-ray. The moat is not the code text — it is the compounding, calibrated, cited reasoning the machine produces and can re-warm on demand.

## WHAT DONE LOOKS LIKE (the factory is WORKING when all hold)

### At the JURISDICTION grain (one onboard is "done")
1. Every warmable parcel is either a cert PASS or a DISCLOSED honest-decline — never a fabricated answer, never a silent gap. (OPS-5, OPS-7.)
2. Setback NUMBERS come from the jurisdiction's authoritative per-parcel record; district from the live zoning layer; ordinance is citation only. Every served fact carries source + citation + confidence + timestamp. (Recipe SOURCE bucket; commitment #1.)
3. The buildable envelope DRAWS on every resolvable parcel, measured in feet by the R32 index-matched inward-normal, oriented front-on-frontage — or the orientation honest-declines with disclosure (R35). Never a guessed front.
4. The block is AREA-SWEPT, not sampled: every rendered parcel graded; one wrong parcel fails the block → fix root cause → re-sweep the WHOLE block. (Recipe R3; OPS-5.)
5. persisted == recompute (R10): the served atom re-derives from source; no stale atom blessed over a fresh recompute. Single recipe vintage, no stale residue.
6. No repealed / blank / stale edition served (R13 fail-closed).
7. The performance ledger is populated (coverage %, cert state, cost, recipe version, staleness) and the jurisdiction is VISIBLE in the CC County Ledger. (OPS-4, OPS-6.)
8. Cost gate cleared: < $200 compute + < 1 hr human review per jurisdiction. (Commitment #3.)
9. BOTH cert gates pass: the mechanical area-sweep AND the operator R6 live visual QA. Only after R6 is the jurisdiction "certified." (OPS-5.)

### At the MACHINE grain (the factory itself is "done" / mature)
A. The engine is DETERMINISTIC and REWARMABLE: a recipe improvement re-warms the country deterministically, content-hash excludes provenance timestamps, warm reads the staged vintaged snapshot not a live fetch. (OPS-3 I1-I7, OPS-4.)
B. The mechanical/agent boundary is UNAMBIGUOUS: every step is either a self-enforcing MECHANISM or a frozen config the machine reads — not prose an agent must interpret. (OPS-3; the onboard(fips) target.)
C. An agent can OPERATE it with zero recipe knowledge — one entrypoint (`onboard(fips)`) reads the frozen registry row, runs the warm with re-derive by default, runs the generic cert, fails closed on any invariant violation, writes the ledger, surfaces in CC, and HALTS for R6. (Phase D target; PHASE_C_mechanism_vs_prose_SPEC.)
D. The fleet OPERATES the frozen proven artifact by default; building new machinery when a frozen equivalent exists is a flagged, operator-approved DEVIATION the planner rejects at verify. (2026-08-02_operate_the_factory_never_rebuild_it.)
E. Capture is frozen: fleet-memory in every product repo; standing decisions travel in every dispatch; the recipe tightens by RUNNING (each real run may add a mechanism, e.g. R33/R35).

## WHAT BROKEN LOOKS LIKE (any one of these = the factory is NOT working — STOP)
- A served parcel with a FABRICATED front/setback/envelope, or a silent gap presented as covered. (Anti-fabrication breach.)
- A cert claimed by SAMPLING instead of area-sweep. (Sampling certified a broken Bastrop before — 819 parcels on repealed P-5 next to fixed SF-1.)
- A served atom that does NOT re-derive from source (persisted != recompute) — a stale atom blessed because "the stored value passed." (R10 breach — the defect fought all of Phase C.)
- A repealed / blank / stale edition served. (R13 breach.)
- A "certified" claim made without operator R6. (Only the operator certifies.)
- The fleet REBUILDS the line (new cohort selector, new cert harness) instead of operating the proven artifact. (The operate-not-rebuild failure — root cause: no divergence gate; the exact failure this WDLL guards.)
- A deploy that "succeeded" but serves stale code (:latest race) or the old revision (traffic-trap), or a migration merged-but-not-applied. (Verify LIVE, not the deploy's word.)
- A confidence number presented as EARNED when it is asserted-baseline. (Commitment #2 — confidence is earned via the calibration loop, never asserted-as-earned.)
- Special/relationship data used for any jurisdiction (Bastrop included). Every path must work for a no-relationship jurisdiction from uniform public record. (No-special-data-access.)

## WHAT KILLS IT (the DIES criteria — when the factory is the wrong bet)
- Cost per jurisdiction cannot be held under $200 compute + 1 hr review across the first three counties. (Hard kill, commitment #3.)
- The reasoning cannot be made calibratable against outcome — confidence stays permanently asserted, never earned. (Commitment #2 collapses; the moat is gone.)
- Honest-absence at scale reads as "no coverage" to buyers rather than "honest, cited, current" — the market wants a fabricated-full map, not a true one. (Then the honesty doctrine is a commercial dead end, not a moat.)
- The recipe cannot generalize past a hand-relayed prose crutch — every new jurisdiction needs careful human recipe relay and drifts without it. (Then onboard(fips) is unreachable and the fan never scales. This WDLL + the mechanism-vs-prose program exist to prevent exactly this.)

## HOW TO TELL A GOOD RUN FROM A BAD ONE (the one-line test)
Point at a served parcel in the app and ask: "Is this fact TRUE, AVAILABLE, CITED, and CURRENT — and if the machine re-warmed it right now, would it produce the same answer?" If yes for every rendered parcel in a swept block, the block is done. If you had to trust an agent's report instead of the live app to answer, the run is not verified — grade the live truth. (This is the benchmark the scan-fix drift post-mortem established: ground truth is the app, not the agent report.)

## STATUS OF THE FACTORY AGAINST THIS WDLL (2026-08-03)
- Machinery (engine, cert, warm, ledger, CC floor): BUILT, being operated on its first real jurisdiction (Bastrop city, mid-warm).
- Jurisdiction-grain done: Block-13 (7 parcels) is the certified reference; Bastrop city SF-1 warming to blockPass now; other blocks queued; operator R6 pending.
- Machine-grain maturity: A (deterministic/rewarmable) DONE; D (operate-not-rebuild) ruled + first L3 rung in; E (capture frozen) DONE. B (unambiguous boundary) + C (onboard(fips) single entrypoint) SPECED, NOT BUILT — that is Phase D, after Bastrop city+county prove the line.
- Honest gap: the operator manual is still prose across OPS-0..7 + the recipe; the single self-guarding entrypoint does not exist yet. The OPS-INDEX (the front door) bridges this until Phase D makes it a mechanism.
