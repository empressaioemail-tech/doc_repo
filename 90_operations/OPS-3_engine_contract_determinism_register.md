---
id: OPS-3_engine_contract_determinism_register
title: OPS-3 — Engine Contract + Determinism Register (the mechanical/agent boundary, made unambiguous)
date: 2026-08-02
status: operations doc (gap-closure: R-FND-3, R-FND-7; the factory's operating rules — KEYSTONE)
owner: nick
related: [2026-08-02_DAY_ONE_foundation_brief, 2026-08-02_foundation_ground_truth_ACCEPTED, 90_runbooks/fleet_memory_practice.md]
layer: L-ENGINE
closes_gaps: [1 cc-agent-reach, 9 capture-freeze-runtime-config]
---

# OPS-3 — Engine Contract + Determinism Register

## WHAT THIS IS
The unambiguous contract for the factory: which parts are MECHANICAL machinery (deterministic, rerunnable to rewarm the country) vs where AGENTS operate, and the invariants that keep the boundary from drifting. This is the doc the whole repo follows to know "is this an engine or an operator decision."

## THE FACTORY MODEL (R-FND-3, verified)
- ENGINES are deterministic MACHINERY. Same frozen inputs → same outputs. Rerunnable = rewarm the country by re-running.
- AGENTS are OPERATORS: watch, run, troubleshoot, report, keep the line running, optimize. Agents reason through sticky parts BOUNDED BY GUIDELINES. Agents are NEVER in the warm/cert/serve correctness path.
- E2E-CONFIRMED (2026-08-02): no LLM/agent in warm/inset/verify/serve (grep-clean; LLM isolated to briefing/chat/findings routes). The machinery IS mechanical. This contract makes that a permanent, enforced invariant, not an accident.

## THE DETERMINISM REGISTER (every engine, its kind, where it lives)
| Engine | Determinism kind | Lives in | Inputs (frozen) | Output atom | Verified |
|---|---|---|---|---|---|
| Warm (record → setback-rule) | MECHANICAL | hauska-engine depth-warm | registry adapter + fetched per-parcel record + district | setback-rule | grep-clean |
| Inset (setback-rule → envelope) | MECHANICAL | engine-core geometry.ts (R0/R28/R30/R32) | ring + edge-roles + setback table | buildable-envelope | tests R28/R29/R32 |
| Currency gate (R13/R16) | MECHANICAL | atom-chain-to-facets + retrieval + adapters | atom edition DID + registry repeal rows | serve/decline | R13 live |
| Owner-match join gate | MECHANICAL | join-integrity gate → county_facet_coverage | geometry ↔ CAD owner agreement | gate verdict | landUseGateBlocked live |
| Road-node build | MECHANICAL | engine-core road/edgeLabeling | OSM + county roads | road-node | live |
| Property-line tagging | MECHANICAL | boundary-primitive | ring vertices | boundary-edge (bearing+distance) | 26454/26454 |
| Cert (grade) | MECHANICAL | block13-cert-grade.mjs | promoted atoms + live GIS | pass/fail matrix | ON BRANCH (gap #2) |
| Briefing / chat / findings | AGENT (LLM) | engine-api routes | atoms + question | reasoning (cited) | OUTSIDE correctness path |

RULE: nothing in the top 7 rows may ever call an LLM/agent. The bottom row (agent reasoning) consumes the mechanical output but never writes the atoms the mechanism produces.

## THE THREE NONDETERMINISM LEAKS (verified; must be closed for true rewarm-determinism)
1. TIMESTAMP nondeterminism (metadata): `promote.ts:75` / `warm-compute.ts:116` use `new Date().toISOString()`. FIX: content-hash must EXCLUDE warmAt/extractedAt (timestamps are provenance, not content) so two rewarms of the same inputs produce the same content-identical atom. Invariant: atom content-hash is over {geometry, setback values, district, edge-roles, recipe-version} — never timestamps.
2. LIVE-GIS-FETCH at warm time (source-drift, not agent): the warm batch fetches ArcGIS live → same recipe, different GIS vintage = different atom. FIX: warm reads from a STAGED, VINTAGED source snapshot (the frozen registry's staged bulk load per OPS-1), not a live fetch — so a rewarm replays the SAME source vintage. Live-fetch is an ACQUISITION step (OPS-2), separate from warm; warm is deterministic over the staged snapshot.
3. R7 half-implemented (primitive bake declines unmapped-adjacency, compute.ts:104): FIX per OPS-2 — close R7 at bake OR mandate the R28/R30 re-warm path for every parcel.

## THE AGENT SEAM — WHERE OPERATORS TOUCH THE FACTORY (R-FND-3b, bounded by guidelines)
Agents operate at exactly three seams, ALL of which produce FROZEN artifacts the mechanism replays:
1. PREP-TIME ADAPTER AUTHORING — an agent probes a novel county's sources and emits a registry row (OPS-1) → review → freeze. (The TxGIO 254-county probe was this.)
2. STICKY-PART ADJUDICATION — an agent reasons through a judgment (which conflicting layer is authoritative — R25; is an edition repealed — R13; a novel geometry case) → emits a currency-register / conflict-disclosure / adapter-patch row → review → freeze.
3. OPERATIONS — watch runs, troubleshoot failures, report, optimize throughput. Reads the performance ledger (OPS-4/6); does NOT write atoms.
GUIDELINE for sticky-part reasoning: an agent MAY reason live to keep the line running, but the decision is WORK-IN-PROGRESS (scratch) until captured as a reviewed, frozen artifact. A rewarm makes ZERO novel judgments — it replays frozen artifacts only.

## THE CAPTURE-AND-FREEZE ORGAN = THE MEMORY SYSTEM (R-FND-7; closes gaps #1, #9)
The memory system (M0, `90_runbooks/fleet_memory_practice.md`) IS how a live operator decision becomes a frozen artifact:
- SCRATCH (Tier 2) = the live WIP decision (aggressive capture, timestamped GROUND-TRUTHs).
- PROMOTED (Tier 1) = the frozen artifact, planner-gated, STRONGEST FORM A MECHANICAL GUARD (test/gate/config-row the engine reads), prose only where nothing else fits.
- This is EXACTLY the reason-live → freeze loop. Scratch→promoted IS capture-and-freeze.

GAP #1 — cc-agent-reach BROKEN (verified: no .cursor/rules in any product repo; executors drift unless dispatch pastes standing decisions). CLOSE:
(a) Install the fleet-memory rule (.cursor/rules/fleet-memory.mdc) in EVERY product repo (hauska-engine, hauska-map, legacy-design-tools, smartcity-os, hauska-mcp-server) — the durable memory reach.
(b) Every recipe/onboarding dispatch EMBEDS the standing-decisions block + the relevant scratch by default (the dispatch-template gate — not "remember to paste").
(c) A promotion is not "done" until it's a mechanical guard where possible (the recipe's R28/R29/R32 → tests is the model; extend to every promotable lesson).

GAP #9 — capture-freeze works for CODE (tests) but not RUNTIME CONFIG (registry/adapter/currency rows). CLOSE: a memory→registry promotion pipeline — a promoted "sticky-part decision" lands as a committed, reviewed registry/currency/conflict ROW (OPS-1 schema) that the engine reads. The mechanical gate: a registry row carries frozen_at + frozen_by + reviewed_by; the engine refuses to read an unfrozen (scratch-only) row; a county with an unfrozen decision is flagged rewarm-unsafe in the ledger (OPS-4/6).

## THE INVARIANTS (enforced, not aspirational)
- I1: no LLM/agent call inside warm/inset/verify/serve (a CI grep-gate on those paths).
- I2: atom content-hash excludes timestamps (rewarm-determinism).
- I3: warm reads a staged vintaged snapshot, never a live fetch (rewarm replays same source).
- I4: every promoted atom carries recipe-version (R-FND-5; OPS-4).
- I5: agents produce only FROZEN artifacts in the data path; a rewarm makes zero novel judgments.
- I6: fleet-memory installed in every product repo; dispatches embed standing decisions by default.
- I7: a county with an unfrozen sticky-part decision is rewarm-unsafe (ledger flag).
