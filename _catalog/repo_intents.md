---
id: repo_intents
title: Repository intents — canonical per-repo direction
status: active
last_updated: 2026-07-04
applies_to: portfolio
related: [00c_portfolio_master_map, _decisions/2026-07-04_branding_canon_hauska_substrate_only, _decisions/2026-07-04_ldt_decomposition_retirement_path, _decisions/2026-07-04_master_map_and_console_unification, _decisions/2026-07-04_convergence_program_execution_model, _architecture_homes/00_overview]
---

# Repository intents

Ground-truth statement of what each repository IS, where it is GOING, and what should DIE, ratified by the operator in the 2026-07-04 repo-intent review. Any agent planning work in a repo reads this first — it is the antidote to re-learning the portfolio by archaeology. Verify live state (gh/npm/gcloud) before acting on any version or status number; this doc records intent and direction, not live counts.

## Branding canon (governs all naming)

Hauska branding is reserved for **true substrate only**: the atom contract, the Hauska SDK, the Hauska Engine, the Hauska MCP Server gate. Every product surface is **Empressa** (or **SmartCity** for the city surface). The SDK is the only true Hauska-branded product component. The six component-library packages published under `@hauska/*` (design-tokens, tile-shell, document-viewer, cortex-client, cortex-tiles, map-renderer) rename to `@empressaio/*` during Phase 3; `@hauska/atom-contract` and the SDK keep the Hauska scope. See `_decisions/2026-07-04_branding_canon_hauska_substrate_only.md`.

## Spine (Hauska substrate)

| Repo | IS | GOING | DIES / notes |
|---|---|---|---|
| hauska-atom-contract | The commercial substrate contract (ADR-018), most load-bearing package. | Language-neutral spec + conformance validator published as an open standard (Phase 1); O&G ontology lands as 1.7.0 AFTER the 1.5.0-source-commit + 1.6.0-publish cleanup. | Root publish-script clutter, stray tgz, drizzle-orm as a hard dep (move to peer). npm lags git: 1.5.0 on npm, 1.6.0 committed-unpublished. |
| hauska-engine | The reasoning spine — corpus adapters, eval, calibration compute, document-ingest. | Durable Postgres/GCS persistence replaces the committed 56MB snapshot; edition-at-date gets an API surface; M1 calibration fuel. | Regrid adapter (contradicts the 2026-06-17 purge), atom-contract-pin shim. pipeline-runner + packages/workspace are complete-looking with zero callers → mark DEFERRED, revisit Phase 2. |
| hauska-mcp-server | The gate; increasingly THE product. | Single enforcement chokepoint, four-gate model, metering live, publicly discoverable catalog. | May-era README + stale capability matrix. PRs #32/#33 sat for no reason (stale docs, not a gate) — land after fresh adversarial review. |
| hauska-sdk (Hauska SDK) | The ONLY true Hauska-branded product component; commerce substrate — payments (Circle/USDC), metering, VDA, IPFS, wallet. | Keep the WHOLE substrate; purge CNS-era identity (README still says "CNS Protocol SDK"; 12 package.jsons point at a nonexistent org); publish sprint-53 (Circle rail + metering, currently unpublished since April). | CNS-era naming only; the VDA/IPFS/wallet stack stays (proof-of-record substrate candidate). |
| hauska-map | `@hauska/map-renderer` (renames @empressaio in Phase 3) + operator console(s). | ONE unified spine command center (merge the root vanilla console + apps/command-center); map-renderer becomes the MASTER map/data-viz component — one LAYER_REGISTRY carrying every family (RE/hazard/O&G/city), allocation served from the spine (command center sets policy, apps toggle within it); 3D subsurface extension lands with Reeves. **Command center must deploy to Vercel, stable, independent of the operator machine.** | The losing console (pick apps/command-center; freeze the root vanilla one). NPM_TOKEN CI works here; publish has no build/test gate (add one). |

## Product repos (Empressa surfaces)

| Repo | IS | GOING | DIES / notes |
|---|---|---|---|
| legacy-design-tools | The everything-repo: cortex-api + Cortex workspace + plan review + Property Brief backend + Radar BFF + published component packages. Originally a monorepo split conceptually into cortex console + cortex architecture surfaces. THE biggest entanglement. | Retire via decomposition on three clocks: (1) root design-tools SPA declared legacy NOW, zero new work, function-inventory gates removal; (2) Cortex console (codex-reviewer-qa + packages) extracts to its OWN repo in Phase 3, Empressa-branded (planner names it); (3) cortex-api + lib packages run in place, shrink by absorption (spine takes adapters, tenancy lands, Radar BFF extracts), retire only when empty. | map-embed, codewarm (zero consumers), legacy $5-wallet top-up route, Regrid remnants (incl. the false runtime message in cotalityClient.ts:179), mock-LLM default in briefing-engine. See `_decisions/2026-07-04_ldt_decomposition_retirement_path.md`. |
| hauska-brief-extension | Consumer product for real estate investors that consumes the spine (Chrome MV3, "Radar"). | Web Store launch; user-aware entitlements post-tenancy; release tags enforced; the ICC PoC runs through it (show ICC how their data is used, protected, monetized — this seeded the command-center concept). | Committed-bundle noise, localhost MCP default in install-defaults. ICC formal-citation branch merges in the ICC play. |
| radar (repo) | A 4-file extraction-design placeholder for eventually moving the Radar/brokerage BFF out of legacy-design-tools (gated on tenancy). No code. | Leave parked; holds the extraction spec. | Nothing; delete only if the spec is folded elsewhere. |
| AEC-cortex | Early architect-surface scaffold with the correct typed gate seam. | Completely REWORKED by Chris on the component library, later. Parked behind the program phases. | Parked; do not build on the current scaffold. |
| smartcity-os | Live prod for Bastrop, pre-spine, fully siloed (Leaflet island). | **ABSOLUTE NO-TOUCH** until every other component is solid; then rebuild on the hardened library, adding components as it goes. Even the Compass spine-wire idea is deferred. | Nothing now. |
| icc-demo | Docs-only authoritative record of the signed ICC Code Connect contract (180-day term) + PoC plan. The real I-Code ingest lives in hauska-engine. | Drives the ICC PoC play (see `_decisions/2026-07-04_icc_poc_play.md`); Ed Cilurso's 8 technical questions answered (planner drafts, operator sends), timing self-driven. | Nothing; protect the code in the other repos. |

## Demos, prototypes, ventures

| Repo | IS | Status |
|---|---|---|
| mox_demo | Mox sales demo (real Nelray Revit seed, adaptive shell). iteration-3 redesign rescued to branch `rescue/iteration3-nav-redesign`. | PARKED. |
| slb_prototype | SLB/Chris field-health backend; the O&G IP seed; informs the Reeves skeleton. Hand-copied atom envelope must swap to the published contract when it joins the spine. | PARKED. |
| empressa-trading | A separate production venture (Empressa Cockpit — options/risk trading) that independently rebuilt the atom/calibration model in Python. Own infra, own GCP project. | OUT OF SCOPE for the program. Console stays SEPARATE from the command center; shares only the atom spec. Brand/focus decision owed but not blocking. |
| hauska-platform (GitHub, last push Apr 4) | Early conceptual work, pre-factor-out. Nothing live. | PARK; revisit later. |
| legacy-revit-sensor | Pulls data from the operator's Revit program into the original cortex app. | KEEP FUNCTIONAL; must survive/repoint when the architect app is rebuilt (on the ldt decomposition checklist). |

## Local-only folders and build clones

The ~25 non-clone project folders and ~40 ldt-* / engine-worktree build clones on `P:\` are OUT OF SCOPE — leave them be for now. Do not sweep or delete during the program.
