---
id: 2026-08-02_foundation_ground_truth_ACCEPTED
title: Foundation Ground-Truth Report (ACCEPTED) — the verified reality the ops docs must close
date: 2026-08-02
status: ACCEPTED (E2E + memory review complete, adversarially gated, planner-reviewed); the gap list is the OPS-doc backbone
owner: nick
related: [2026-08-02_foundation_e2e_and_memory_review_dispatch, 2026-08-02_DAY_ONE_foundation_brief, 2026-08-02_bastrop_recipe_ACCEPTED]
purpose: The read-only E2E + memory review verified the Day-One frame (R-FND-1..7) against live reality. Frame is DIRECTIONALLY CORRECT but not live-truth on 4 load-bearing seams. This records acceptance + the ranked gap list, which becomes the OPS-doc set's backbone (docs written to CLOSE these verified gaps, not to describe settled reality).
---

# Foundation Ground-Truth — ACCEPTED

The five-lane read-only review (adversarially gated, refuter default-refuted) verified each R-FND ruling against live code + substrate + endpoints. Full report is the coordinator handback (retained in session record). Verdict: the factory-operator frame is SOUND in principle but has 4 load-bearing gaps that would each break "rewarm the country" if built on today.

## R-FND GRADES (verified)
| Ruling | Grade | The gap |
|---|---|---|
| R-FND-1 (Bastrop city first) | MATCH (live serve) / HELD (city cert) | 48021:34145 serves warm-promoted live; city ~10k re-warm open |
| R-FND-2 (registry baked into engines) | GAP | registry is doc-repo JSON; engine reads hardcoded adapters; recent-repeal register unwired |
| R-FND-3 (engines mechanical, agents operate) | PARTIAL | warm/inset/verify/serve is LLM-free + deterministic-on-frozen-inputs (CONFIRMED); BUT live ArcGIS fetch at warm time (source-drift) + timestamp nondeterminism (metadata) + cert not on main + R7 half-implemented |
| R-FND-4 (CC = factory floor) | GAP | Resolver + Autonomous Engines are STUBs; Spine Health is Bastrop-liveness only, not per-county engine/recipe/memory state |
| R-FND-5 (recipe-version on atoms) | GAP | only `depth-warm-promoted-v1` marker; no recipeVersion field; rewarm trigger uncomputable |
| R-FND-6 (performance ledger) | PARTIAL | county_facet_coverage has coverage/verdict/owner-match; OWED: recipe-version, cert-state, cost, staleness, rewarm-unsafe, last-rewarm |
| R-FND-7 (memory = capture-freeze organ) | PARTIAL | scratch tier real + R28/R29/R32 promoted to TESTS; BUT cc-agent-reach STILL BROKEN (no .cursor/rules in any product repo — executors drift); no scratch→engine-config freeze path (works for code tests, not runtime config) |

## RANKED GAPS (the OPS-doc backbone — each ops doc CLOSES gaps, does not describe settled reality)
| # | Gap | Fix class | R-FND | → OPS doc |
|---|---|---|---|---|
| 1 | cc-agent-reach unfixed — no durable memory install in product repos; executors drift unless dispatch pastes standing decisions | M0 hardening: product-repo memory install + recipe-dispatch embeds memory by default | 7 | OPS-3 (engine contract) + OPS-2 (onboarding runbook) |
| 2 | Cert script NOT on main — mechanical cert non-reproducible | Merge chore/block13-cert-grade-script → main | 3 | OPS-5 (cert standard) — a scale prerequisite |
| 3 | No recipeVersion on promoted atoms — rewarm trigger uncomputable | schema + promote-path field; CC/ledger read it | 5,6 | OPS-4 (rewarm protocol) |
| 4 | Registry docs-only — engine reads hardcoded adapters | versioned registry as engine input | 2 | OPS-1 (source registry spec) |
| 5 | CC engine console STUB — no per-county factory floor | wire Resolver + Autonomous Engines + county ledger panel | 4 | OPS-6 (CC engine console) |
| 6 | R7 primitive-bake declines — city parcels skipping R28/R30 re-warm hit unmapped-adjacency | close R7 at boundary-primitive/compute.ts OR mandate re-warm path for all city parcels | 3 | OPS-2 (onboarding runbook) — a Bastrop-city prerequisite |
| 7 | Performance ledger incomplete — lacks cert/recipe/cost/staleness/rewarm-unsafe | extend ledger schema + scorer | 6 | OPS-4 + OPS-6 |
| 8 | Recent-repeal register unwired — currency gate uses Bastrop-hardcoded markers | wire registry repeal rows → currency gate | 2,3 | OPS-1 + OPS-3 |
| 9 | Capture-freeze broken at runtime config — scratch → engine-readable frozen artifact has no path | memory→registry/adapter promotion pipeline + mechanical gate | 7 | OPS-3 (the R-FND-7 freeze seam) |
| 10 | Live R10 persisted==recompute not re-verified this session (read-only) | read-only recompute probe on gold parcels (no promote) | 6 | OPS-5 (cert standard) |

## WHAT THE E2E CONFIRMED IS RIGHT (do not re-litigate)
- No LLM/agent in the warm/inset/verify/serve correctness path (grep-confirmed; LLM isolated to briefing/chat/findings routes). The machinery IS mechanical. R-FND-3's core holds.
- The engines are deterministic on frozen inputs (geometry/setback values). Nondeterminism is metadata-timestamp + live-GIS-fetch, NOT the correctness computation.
- Scratch tier is real + used; R28/R29/R32 promoted to actual tests (the mechanical-guard-preferred rule works for code).
- Bastrop live serve confirmed on prod PE (48021:34145 = 9099 sqft, matches Block-13 cert).

## THE REFRAME (how the ops docs get written)
The ops docs (OPS-1..7) are a GAP-CLOSURE PROGRAM. Each doc: (a) what's BUILT + live-verified, (b) what's OWED (the gaps above), (c) the fix-class + the invariant it must satisfy. They are honest about current state — never describe aspiration as reality (the recurring failure). The E2E gap list IS the backbone; TxGIO agent pulls (per-county coverage/freshness/schema/access) feed OPS-1.

## TXGIO STRATEGIC RULING (Rail C = the spine; lean maximally, trust joins never blindly)
TxGIO StratMap is Rail C ("the spine" per _land_records/source_rail_registry.md) — ONE statewide source across 245+ appraisal districts collapses the fan's "register 254 providers" into "register TxGIO + per-county refinement." USE MAXIMALLY for statewide parcel GEOMETRY. But its known caveats map onto the recipe's firewalls: prop_id='0' (~50% Travis) → owner-match join-integrity gate (R9/R15); freshness lag → currency gate + county-ArcGIS override where fresher; prop_id format variance → HCAD-class join validation. Strategy: TxGIO default geometry → county-service override where fresher → owner-match + currency gate as the firewall. Never trust a TxGIO CAD-join on ID alone. TxGIO agent pulling per-county coverage/freshness/null-rate matrix + schema + other statewide layers (city-limits especially — solves R17 "what is the city") + access mechanics; feeds OPS-1.
