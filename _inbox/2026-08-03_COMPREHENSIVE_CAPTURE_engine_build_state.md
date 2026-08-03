---
id: 2026-08-03_COMPREHENSIVE_CAPTURE_engine_build_state
title: COMPREHENSIVE CAPTURE — engine build state, what it means, and the plan (Bastrop county + cities incl Smithville)
date: 2026-08-03
status: capture + plan (written before context compression; the durable snapshot of where the engine build IS)
owner: nick
related: [OPS-0_MASTER_game_plan, 2026-08-02_bastrop_recipe_ACCEPTED, 2026-08-02_operate_the_factory_never_rebuild_it, PHASE_C_RESUME_recompute_divergence, 2026-08-02_PARKED_ROADMAP_INDEX, 2026-08-02_ZOMBIE_CODE_cleanup_ledger, _catalog/tx_jurisdiction_source_registry.json]
purpose: A comprehensive, durable capture of the engine-build state as of 2026-08-03 — what we built, what it means, what's running, whether the fleet-memory changes landed, whether the factory needs adjusting to capture the changes, and the forward plan (Bastrop county areas + the few other Bastrop-county cities including Smithville via eCode360). Written before an auto-compression so nothing is lost.
---

# COMPREHENSIVE CAPTURE — engine build state (2026-08-03)

## PART 1 — WHAT WE BUILT (this arc) AND WHAT IT MEANS

### The foundation (Phase A — DONE, 7/7 on main)
All 7 foundation gaps the E2E review found are closed on hauska-engine/ldt main:
- A1 fleet-memory in ALL 5 product repos (VERIFIED present 2026-08-03) — the capture-freeze organ.
- A2 block13-cert-grade.mjs on main — mechanical cert reproducible.
- A3 recipe_version stamped on promoted atoms (RECIPE_VERSION on main) — the rewarm trigger.
- A4 jurisdiction registry loader (BASTROP_REGISTRY_ROW) — registry-as-engine-input.
- A5 R7 closed at primitive bake — city parcels don't strand on unmapped edges.
- A6 rewarm-deterministic content hash (contentHashExcludingProvenance) — persisted==recompute can hold.
- A7 performance ledger fields on county_facet_coverage.
MEANS: the machinery is mechanical + deterministic + rewarmable, with a recipe-version trigger and a performance ledger. The factory's foundation is real.

### The factory floor (Phase B — DONE, deployed)
- cortex-api GET /api/county-ledger LIVE (prod HTTP 200). CC County Ledger panel DEPLOYED to the LIVE console **cmdcenter-blush.vercel.app** (NOT command-center/jade — that was a deploy mistake, corrected). The operator can WATCH counties come online.
- The LEDGER-WRITE-PATH works: warm now upserts county_facet_coverage. Live: 48021 onboarded=true, zoning+envelope recipe 1.0.0 @ 94.72%.
MEANS: the operator has a factory floor; Bastrop is coming online in it now.

### The RECIPE (the correctness contract — R1-R35, accepted + growing)
The 8-bucket recipe (SOURCE/EDITION-CURRENCY/CONFLICT/SETBACK-MODEL/GEOMETRY/CERT/NON-SETBACK/REVERSAL-LEDGER), R1-R32, PLUS the rulings THIS phase produced by RUNNING the factory:
- R33 — the warm promote-gate must be CERT-EQUIVALENT (warm calls the same cert measurement; promote-gate==cert-gate; deepens R10). + facesAnswer abbreviation normalization.
- R35 — no-frontage / landlocked / "LOT BEHIND" parcels honest-decline the orientation (never guess a front); EXTENDED to null-situs re-plat successors (same no-frontage root).
MEANS: the recipe got TIGHTER by running it. R33 (promote==cert) and R35 (no-frontage decline) are real mold improvements the by-hand Phase C surfaced — exactly its purpose.

### THE BIG CORRECTION (the operate-not-rebuild ruling)
The load-bearing lesson of the whole arc: the fleet was told to OPERATE the existing proven factory over Bastrop, and instead BUILT NEW machinery (new cohort selector + new cert harness) and debugged its own new machine through 3 STOP cycles. Root cause: recursive-loop L3 discipline was built for the PRODUCT (PE onboarding), NOT the dev fleet — no divergence gate, hand-carried prose coherence carrier. FIXED: _decisions/2026-08-02_operate_the_factory_never_rebuild_it (operate/extend the frozen artifact by default; building new = a flagged operator-approved deviation; planner rejects unapproved parallel builds at verify); the divergence check added to the session-close protocol; 64_recursive_loop/04 updated with the incident. MEANS: the fleet now has its first L3 rung (selection pressure on its own work), which is a prerequisite for trusting the fan.

## PART 2 — WHAT'S RUNNING RIGHT NOW (Phase C SF-1, in flight)
Bastrop CITY warm, SF-1 block, via the CORRECTED path (proven generalized block13-cert-grade + dominant-district R26 cohort). Progression: 132 fails → 28 → 5. Currently: 1914/1919 pass-or-decline, 24 stale-residue CLEARED, R35 landlocked (53859) PASS. 5 remain, split into 2 classes (dispatch PHASE_C_RESUME_recompute_divergence.md running):
- CLASS A (8741972/73/74 null-situs re-plat successors) → R35 honest-decline.
- CLASS B (28855/30857 valid-situs, recompute-empty) → DIAGNOSE why cert's computeWarmCandidateFromBoundary is empty on a valid parcel; FIX the recompute to match warm (do NOT trust stored-over-recompute — that violates R10). Block-13 7/7 regression HELD on main (#211).
MEANS: SF-1 is ~5 parcels from blockPass; the failure surface shrank to genuine edge cases + one traceable recompute bug. Once SF-1 clears, the other blocks inherit R33+R35+the recompute fix and go fast.

## PART 3 — YOUR QUESTIONS, ANSWERED

### Q: Did we make all the necessary fleet-memory changes from earlier?
YES — VERIFIED 2026-08-03. (a) fleet-memory `.cursor/rules/fleet-memory.mdc` is present in ALL 5 product repos (hauska-engine, hauska-map, legacy-design-tools, hauska-mcp-server, smartcity-os). (b) The new durable memories all landed: FLEET-L3-GAP-template-replication-not-enforced (the operate-not-rebuild failure), cc-deploy-cmdcenter-blush-not-jade, premature-background-notification-not-orphan, latest-tag-deploy-race-verify-endpoint, gcloud-uptime-path-mangle-msys. (c) The session-close protocol carries the fired/helped/harmed + trap-recurrence + divergence/rebuild checks. GAP (honest): the STRUCTURAL coherence carrier (a dispatch template that AUTO-PULLS standing decisions + names frozen artifacts so an executor CANNOT start without them) is DECIDED (operate-not-rebuild ruling) but NOT YET BUILT as a mechanism — it's still prose the planner must apply. That's the fleet's next L3 build, tracked.

### Q: After Phase C, do we need to ADJUST THE FACTORY to capture the changes?
YES — three adjustments, because the by-hand run produced real changes the generic factory must absorb:
1. R33 + R35 (+ the Class B recompute fix once diagnosed) must be MECHANISMS in the shared warm/cert path (R33 already is; R35 landlocked is; R35 null-situs + the recompute fix land via the running dispatch). These carry to onboard(fips) automatically once on main.
2. The generalized block13-cert-grade (roster param) + dominant-district cohort ARE the factory's cert + feed now — the Bastrop-specific batch script must GENERALIZE to onboard(fips) keyed on the registry row (the Phase D refactor, per PHASE_C_mechanism_vs_prose_SPEC). Until then the warm is still Bastrop-scripted.
3. The ledger-write-path + recipe-version stamping are in — the factory captures its own progress. GOOD.
NET: the factory's ENGINES are correct + improving; the WRAPPER (feed/cert/registry) still needs the onboard(fips) generalization (Phase D) so a new jurisdiction is one command, not a scripted run. Phase C's mechanism-vs-prose spec is that build's input.

## PART 4 — THE FORWARD PLAN (operator-directed 2026-08-03)

### Immediate (finish + prove Bastrop city)
1. Class B recompute diagnosis + fix (running) → SF-1 blockPass.
2. Continue blocks GC → MU → RR → PI → IND (inherit R33/R35/recompute fix; the 15 removed-from-SF-1 parcels grade in their dominant blocks). PDD+null → honest-decline.
3. GATE C → STOP for operator R6 visual QA in CC (cmdcenter-blush). Operator claims "Bastrop city certified" after R6.

### Then — BASTROP COUNTY + its cities (the operator's named next scope)
The registry (tx_jurisdiction_source_registry) has the Bastrop-county-area jurisdictions: **Bastrop County, Bastrop (city, doing now), Elgin, Smithville**. Plan:
- BASTROP COUNTY (unincorporated) — the county cadastral browsable set. County land is largely UNZONED (unincorporated TX is legitimately unzoned per the recipe) → mostly honest-absence on zoning/setback, with parcel geometry + CAD + flood/terrain/soils. Run the same proven line; expect high honest-decline on zoning (correct, not a failure). This proves the mold on an UNZONED jurisdiction (a different regime than a city).
- ELGIN (city) — euclidean, in the registry. Run the proven line (dominant-district cohort + generalized cert) over Elgin's roster. Its adapter/regime per the registry (verify: municipal/municode vs eCode360).
- SMITHVILLE (city) — euclidean, `reachable_adapter: ecode360-scraper` in the registry. THE eCode360 BLOCKER + THE FIX: plain Municode/eCode path 403s (login wall); the `ecode360-scraper` adapter is the PREVIOUSLY-SOLVED path (headless/header scraper that reaches eCode360 content). Smithville MUST use the ecode360-scraper adapter, NOT the plain path. Wire Smithville's registry row to ecode360-scraper (verify the scraper adapter still works / is on main), then run the proven line. This is why Smithville was flagged — the fix is adapter-selection, already in the registry, needs the scraper live.

### The proving value of the Bastrop-county scope
Running the county + Elgin + Smithville proves the mold across: an UNZONED county (honest-absence at scale), a second + third euclidean CITY (does the proven line generalize beyond Bastrop city), and a DIFFERENT SOURCE ADAPTER (eCode360-scraper vs Municode/AGOL). That's a genuine generalization test BEFORE the wider fan — the same discipline as the cold-county fan-readiness audit, at county grain. It's also the natural first "onboard(fips)" proving ground: 3-4 jurisdictions of different regimes/adapters = the test set for the generic command.

### Sequencing
Bastrop city (R6) → Bastrop county + Elgin + Smithville (proven line, adapter-correct) → THEN onboard(fips) generalization (Phase D, spec ready) → THEN the wider fan (per the scale-before-layers decision). Smithville's eCode360-scraper is the first non-Municode/non-AGOL adapter the factory runs — a real adapter-generalization checkpoint.

## PART 5 — OPEN THREADS (tracked elsewhere, noted here so nothing is lost)
- ZOMBIE CODE cleanup (deferred, gated on Phase C landing): _inbox/2026-08-02_ZOMBIE_CODE_cleanup_ledger.
- PARKED ROADMAP (data-layer expansion, onboard(fips) build, doc reconciliation, spine-ledger remaining, staleness selector, R16, BDC ingest): _inbox/2026-08-02_PARKED_ROADMAP_INDEX.
- The fleet's structural coherence carrier (auto-pulled standing decisions in dispatch templates) — DECIDED, not built; the fleet's next L3 build.
- onboard(fips) generic command (prose→code) — spec ready (PHASE_C_mechanism_vs_prose_SPEC), build after Bastrop city+county prove the line.
