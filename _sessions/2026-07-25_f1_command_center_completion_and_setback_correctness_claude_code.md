---
id: 2026-07-25_f1_command_center_completion_and_setback_correctness
title: Session close — F1 Command Center completion + the setback-correctness saga
date: 2026-07-25
type: session
owner: nick
related: [27a_jurisdiction_factory_engine_spec, 27b_f1_command_center_completion_program, 2026-07-23_MASTER_WDLL_property_reasoning_substrate, 2026-07-25_setback_correctness_and_corner_lots_pickup, 2026-07-25_setback_geometry_and_calibration_handoff]
---

# Session close — F1 Command Center completion + the setback-correctness saga

Long, high-value session. Started with "the property-explorer app shows nothing and I don't trust the coverage numbers"; ended with F1 (Complete the Command Center) fully shipped and verified, the retrieval outage fixed durably, two setback DISPLAY bugs fixed — and a THIRD setback bug (the envelope GEOMETRY is wrong) surfaced at the very end that is NOT yet fixed and is the primary handoff.

## The through-line discovered this session

Three separate times the real bug was the SAME shape: the app turning a nuanced DATA state into a wrong ABSOLUTE, while the data layer was honest. (1) retrieval OOM served an empty store rendered as "not verified everywhere"; (2) QA-3: "not verified" shown over live setback data; (3) setbacks: `not_specified` (code silent, build-to-line governs) rendered as "0 feet → setbacks consume the lot → unbuildable." Design discipline that fell out: a data state (unreachable / pending / not-specified) must NEVER render as a false absolute. This is the recurring lesson of the session.

## What SHIPPED and is VERIFIED LIVE

### F1 — Complete the Command Center (WDLL 1-9 all MET, planner-verified live)
Ran as a planner-led, gated program (three gates: A phase-0 truth, B post-audit pre-wiring, C pre-customer-flip) per `27b`, executing the `27a` spec. Every claim verified against live state, never a report.
- PHASE 0: retrieval-api OOM crash-loop fixed DURABLY — root cause was `JSON.parse` of the whole corpus snapshot into a 1GiB heap; breadth bakes grew it past the limit. Fix: serve from Postgres LayeredStorage (Phase-1a StoragePort), retire the snapshot-heap boot path, resource-headroom check. Serving revision was OOM-stuck until an explicit traffic shift (the recurring Cloud Run traffic-trap). True ground truth established via a live SELECT: the committed 5.8%-Travis ledger was STALE; the live DB is Travis 61.23% zoning, ~2.05M zoning-fact atoms, 3,626,854 total. The live tally is now the source of truth (G1) — settled the 5.8%-vs-61% question.
- F1a console audit: found the CC console was ~40% wired and drifted; the badges were mostly honest but Calibration was fixture-LIVE (hardcoded zeros claiming live), and `liveGis.ts` was FORKED into two physical copies (PE + CC).
- F1b: wired the Node & Graph ledger (the balance-sheet-of-the-physical-world, per-county tally, live in CC), the parcel↔node bidirectional binding, de-forked liveGis into `packages/map-renderer/src/live-gis.ts` (one substrate), unified the G6 parcel-id regex (gate/BFF/contract), fixed the QA-3 vocabulary ("not verified" → honest present/absent/pending), PE customer surface curated (two-products: zero operator panels leaked to customers).
- F1c: mechanical honesty made SELF-ENFORCING — probe-driven LIVE/STUB badge (`panelProbes.ts`, computed from live GETs, fixture-LIVE forbidden), an end-to-end live smoke test (RED on unreachable), and coverage = a live re-SELECT endpoint (not the static artifact).
- Two-products guardrail held throughout: Command Center = INTERNAL operator console; property-explorer = CUSTOMER app; PE is a preset (shared substrate + component library, customer-safe surface), NOT collapsed into CC.
- A "data bounces on reload" scare turned out to be a MISDIAGNOSIS: the parcel data path was clean/deterministic; the real error was a GTM/consent POST returning 403 (anonymous-browse gate on the wrong route). Fixed by routing consent through `/api/pe-gtm`. Operator's browser console beat the planner's curl probe — the exact reason "verify what the user sees" is the discipline.

### Setback correctness — DISPLAY fixes shipped + verified
- Diagnosis flipped the assumption: the widespread `S 0'/R 0' → "setbacks consume the lot"` was NOT bad data and NOT a fallback. Public districts (P-1/P-3/P-5/P-CS) legitimately have NO scalar setback in the Bastrop B3 code (build-to-line governed); the atom correctly carried `0 + not_specified:true` with human-verified provenance quotes. The app was rendering code-silent as "0 feet, unbuildable" — backwards.
- Fixed (PE #67 + engine #120 + LDT #355): `not_specified` honored on the wire, false consume-lot → "build-to-line governs" honesty. Verified live on P-3 48021:141209 (0 consume strings).
- Corner-lot DETECTION built + verified: 2+ named OSM street frontages → `cornerLot=true` + `side_corner`/`side_corner_ft`; unresolved declines honestly (no fabrication). Verified on two real Bastrop Main St corner lots against live GIS+Overpass (cortex rev 00434-nej). Note: not visible via the served atom-chain (product path is atom-chain-only/anti-zombie; the derive path labels it) — verified against deployed code directly.

## What is IN FLIGHT (agent dispatched, NOT verified done)

1. EXPORT-GATE FALSE-REFUSAL AGENT (dispatched this session, awaiting completion). The site-plan export refuses "Setbacks not available for this parcel yet" on parcels where setbacks ARE on file (e.g. 48021:47595 P-5: `front:15` + build-to-line + S/R not_specified). Root cause: the export's anti-fabrication 422 gate (`services/engine-api/src/routes/parcel-terrain.ts`) has its OWN copy of the `not_specified`-vs-missing check that was NOT updated when the display fix landed — it treats `not_specified` side/rear as "no data → refuse the whole export." Fix dispatched: refuse ONLY when genuinely no setback data; ALLOW export when a real setback exists with some axes not_specified (draw the real setback, annotate not-specified axes as "build-to-line governs" on the sheet — label, don't refuse). This agent's status was NOT confirmed at session close — the next agent must check whether it landed before touching the same gate.

## What was SURFACED at the end and is NOT fixed (the PRIMARY handoff)

THE ENVELOPE GEOMETRY IS WRONG. On 714 Spring St (48021:33512, P-5, F 15'), the DRAWN setback envelope is a mangled, jagged, non-parallel polygon that does not follow the parcel boundary at a consistent 15' inset — it looks nothing like a real setback offset. So even where we HAVE a correct setback value, the geometry that computes the buildable-area inset is producing garbage. This is a THIRD, distinct setback bug (separate from #1 display and #2 export-gate) and it is the reason the operator says "calibration is not done — the setbacks are wrong." Operator wants a CALIBRATION PROGRAM to address envelope-geometry correctness systematically. Full handoff: `2026-07-25_setback_geometry_and_calibration_handoff.md`.

## Queued (next session, not started)
- The setback-geometry + calibration program (the handoff — primary).
- Supply-engines program (scraping/collection to flesh the ledger; national later).
- Site-plan final QA (signed-in DXF/IFC/PDF + Revit review on a good parcel) — blocked on the export-gate fix landing.
- AI-memory-substrate exploration (operator taking the `2026-07-23_ai_memory_substrate_thread_PLACEHOLDER.md` thread to another chat).

## Recurring operational note (now a memory)
The Cloud Run traffic-trap hit ~5x this session: a deploy creates a new revision but PROD keeps serving the OLD one at 100% until an explicit `update-traffic`; "latest image in Artifact Registry" ≠ "serving." When a verified fix looks like it didn't land, CHECK THE SERVING REVISION FIRST. Memory: `cloud-run-traffic-trap`.

## Verification discipline that carried the session
Planner-led, fewer agents, tighter contracts, three stop gates, and EVERY claim verified against live state (live query, live probe, live app/console) — pasted, never a sub-agent report. This is the discipline whose absence caused the preceding 3-day scan-fix drift loop. It held all session and is written into `27a`/`27b` and memory (`post-mortem-scan-fix-loop-drift`).
