---
id: 2026-06-13_mox_demo_build_plan
title: Mox demo build plan (mox_demo repo)
status: active
last_updated: 2026-06-13
applies_to: mox_engagement
owner: nick
related: [_prospects/mox/2026-06-11_mox_master_dossier, _prospects/mox/2026-06-07_mox_engagement_plan, _prospects/mox/collateral, 2026-06-11_atom_connection_licensing_treatment_theory]
---

# Mox demo build plan

> **What this is.** The build plan for `mox_demo`, a lightly functional, real-engine demo that shows Mox what the Hauska/Mox stack does and, to a degree, what the adaptive interface feels and acts like. Function first, built by the operator and a multi-agent execution pass. Design refinement is handed to Chris (product designer) once function and content are pulled together. This doc doubles as the repo README. No timelines by design: workstreams are stacked in dependency order so they can be dispatched to agents in parallel where dependencies allow.

## 1. The demo in one paragraph

Mox saw a substrate philosophy pitch and could not grasp it as words. This demo answers by showing. It is a single adaptive surface, Mox branded, seeded from a real Revit model of an apartment building the operator owns, running a real engine on representative data. The viewer expresses intent ("show me how this building is performing", "why were controllables high", "open this unit", "generate the LP view") and the interface assembles the relevant components live, every number carrying its provenance and confidence. It opens on Yardi (untouched, an intelligence layer riding on top) to kill the rip and replace fear in the first thirty seconds, pulls back to the unit twin and the command surface to show where the intelligence lives, and closes on the investor room where the property intelligence we already own visibly de-risks a deal. The bar is "best foot forward, feels and acts like the real thing to a degree", not the full production adaptive engine. Chris refines the design after the function lands.

## 2. The honesty frame (hard requirement, baked into every surface)

Cleared through premortem-check 2026-06-13. These are not optional polish, they are build constraints. A surface that violates one is wrong, not unfinished.

1. Confidence is shown with its state visible. Every confidence value carries a chip reading baseline, provenance backed, not yet calibrated on Mox outcomes. No bare numbers presented as earned.
2. The deposit loop moment demonstrates that the earning loop is live, learning from a human correction in real time. It does not claim the displayed numbers are already calibrated.
3. The investor room shows a generated, cited artifact. It does not imply the live, revocable LP data room (the umbilical) ships today. That is gated on the auth build.
4. The intelligence layer on Yardi is the surface of the twin, not a DOM scraping trick. It surfaces intelligence derived from the atom store, not pattern matching on visible pixels.
5. Opening framing, verbatim intent: "The engine is real. The data is representative, shaped like yours. Wiring it to your Yardi is what the first phase does."
6. No promise of live bidirectional Yardi automation. The demo simulates read plus assist plus capture, which is the honest first shippable. Write back into Yardi is a roadmap item gated on a licensed interface (see section 8).

## 3. The differentiation thread (the explanation the demo carries)

Threaded through the surfaces, not bolted on as slides. Three points:

1. The treatment, not the data. Every number is an atom carrying its own provenance, reasoning, confidence, and a calibration state that tightens with use. A dashboard shows a number. An atom shows why, where it came from, how sure it is, and gets less wrong every month.
2. Two flywheels. Mox private operating intelligence never pools and compounds on Mox's own outcomes, a moat rivals cannot copy because they do not have Mox's history. Shared ground truth (code, zoning, parcel) sharpens because the whole network feeds it.
3. The ground truth is already built and nobody else has it. The plan review proves it on screen. This is the half of the stack Mox could never build and no off the shelf AI has.

## 4. The hero script (the rehearsed path)

Each beat answers an objection from the 2026-06-11 meeting by showing. These are the intents the adaptive interface is driven down. The engine is genuinely assembling, but the hero intents are rehearsed to known good component sets.

1. Open on Yardi. "This is your Yardi, untouched." The intelligence layer surfaces an in context insight on a vendor invoice or a unit screen, with source and confidence. Kills rip and replace. (Felicia)
2. "Why were controllables high here last quarter?" The surface assembles a variance view, surfaces the anomaly flag, shows the reasoning chain and the source. The Amara water leak, caught by the system instead of by eye. (Miguel)
3. "Show me what needs my attention." The action inbox assembles: triaged flags, each routed by role, each with a recommendation, a confidence state, a source, and accept/edit/reject. Answers "what do we do with the flags, who manages them across 50 deals." (Felicia)
4. "Open this unit." The spatial twin from the Revit model: the unit in 3D, plus its operating history, plus the parcel and code ground truth above it. The digital twin Miguel asked for, made literal. Approve or edit a flag here to show the deposit loop learning. (Miguel)
5. "Generate the LP view for this deal." The investor room assembles: a provenance backed performance rollup with the plan review embedded, every claim cited and dated. "This is what you hand an LP instead of a PDF, with the code risk on the parcel already vetted." (Miguel, Sean)

## 5. Architecture

- Repo: `mox_demo`, standalone, shareable with Chris.
- Frontend: Next.js, deployed on Vercel. Hosts the adaptive surface, the component library, the context surfaces, and the APS viewer embed.
- Backend: a small service running the engine and the atom store, on the operator machine or a low lift VM. Exposes the engine and a read API the frontend calls.
- Engine: real LLM component assembly plus the gate, consuming the actual `@hauska/atom-contract` types. Given an intent, it selects and orders components and populates them from atoms.
- Atom store: seeded, holds the building, unit, operating, ground truth, and deal atoms. Postgres or equivalent as index, files for the heavier artifacts. Contract enforced shapes.
- Division of labor: operator plus agents build function and wire content. Chris refines design and interaction polish on top of a working surface.

## 6. Surface tiering

### Hero surfaces (live, real engine, on the Revit building)

- **Adaptive command.** The intent bar plus the assembler. Expresses the "ask and the UI assembles" behavior on the hero intents. This is the connective tissue and the clearest expression of the adaptive interface "to a degree".
- **Intelligence layer on Yardi.** Browser extension or overlay on Yardi screenshots. Read plus assist plus capture: pull history, summarize, draft, code an invoice, capture the decision to the core. The `hauska-brief-extension` pattern generalized.
- **Unit twin.** Spatial drill down using the APS viewer on the Revit model, composed with operating history and ground truth.
- **Investor / data room.** Provenance backed rollup with the plan review embedded as the property intelligence proof.

### Context surfaces (navigable, seeded static, near free)

The six existing mockups in `_prospects/mox/collateral/` already are these. Wire them in as navigable context, reskin to the Revit building where cheap. They convey the scope of the vision without costing function.

- Command center (Miguel's view, the "one core, three lines" anchor). Definitely show.
- Manage, Invest, BLDR full apps.
- Flywheel diagrams (the explainer).

## 7. Data spine: Revit to twins

Source model is RVT 2024, an apartment building the operator owns.

- **Primary extraction: Autodesk Platform Services (APS) Model Derivative plus Viewer.** Converts the RVT to a web viewable model for the browser (the spatial twin) and extracts metadata: rooms, areas, levels, unit boundaries, equipment families. One path gives both the visual and the structured data.
- **Fallback extraction: Revit API / pyRevit schedule export** to dump room, unit, and equipment parameters to JSON.
- **Reuse check:** the portfolio Revit Connector may already do RVT extraction. Point an agent at it before building fresh.

Atom composition for the twin:

- `building` atom: the model, the real address, the jurisdiction.
- `unit` atoms: spatial, from Revit rooms and areas, composed under the building.
- Seeded operating atoms referenced by units: `lease`, `resident`, `work-order`, `vendor-invoice`, `gl-transaction`, `variance-commentary`. Reuse the names and content already in the mockups (Citizen House Bergstrom, ABC Plumbing work order 4821, the May close lines) so the demo is internally consistent.
- Ground truth atoms for the building address, pulled from the Hauska engines: `code`, `parcel`, `flood`, `zoning`.
- `deal` molecule: the investor rollup, composing unit twins plus the operating and ground truth atoms, carrying provenance.

Every atom carries identity, provenance edges, reasoning, confidence plus state, freshness, and `accessPolicy` per the contract. Private operating atoms are `tenant-private`. Ground truth (code, parcel) is `public-free` or `public-paid`. The two flywheels are the accessPolicy partition, visible in the flywheel diagram and in the gate routing.

## 8. Yardi approach

For the demo: no license, no live integration. Yardi screens are screenshots. The intelligence layer overlays on them and simulates read plus assist plus capture. The version demoed is the honest first shippable, so there is no gap between demo and product.

Roadmap note to carry into any Mox conversation (not shown as shipping):

- Near term capture: nightly SFTP CSV/XML export, which the client (Mox) can authorize as the Yardi common client, feeding the structured spine.
- Ambient capture: the extension captures the unstructured exhaust and the in context decisions.
- Durable write back: a licensed Yardi interface (about 25k per interface per year, sponsored through Mox's own client entitlement, since Hauska does not independently qualify yet). Browser automation write back is demo grade only and fails enterprise security review.

The gatekeeping is also a pitch asset: it costs Mox real money and Yardi's permission to reach their own data. The sovereignty beat lands on that.

## 9. Function extraction map (pull from existing repos)

Agents pull and adapt, they do not rebuild:

- Plan review / findings engine: `legacy-design-tools` (Codex surface). Powers the plan review in BLDR and the investor room.
- Property / parcel / code intelligence: `hauska-engine` place and property tools, `hauska-mcp-server` tool surface. Powers the ground truth layer. ICC and Cotality credentials land next week and enrich this; the demo does not depend on them.
- Ambient extension pattern: `hauska-brief-extension`. Powers the intelligence layer on Yardi.
- Atom contract: `@hauska/atom-contract`. The shared types the engine and store consume.
- Revit extraction: Revit Connector repo (reuse check for RVT to data).

## 10. Workstreams for multi-agent execution (dependency ordered, no timelines)

- **WS-0 Scaffold.** Stand up the `mox_demo` repo: Next.js frontend for Vercel, backend service, atom store, shared types from `@hauska/atom-contract`, deploy skeleton. Foundation for everything.
- **WS-1 Spine.** RVT to APS extraction to unit twins in the atom store. Seed the operating atoms. Pull ground truth atoms for the building address. Depends on WS-0. (Parallel with WS-2.)
- **WS-2 Engine.** Real LLM component assembly plus gate, consuming the contract. The adaptive assembly core. Depends on WS-0. (Parallel with WS-1.)
- **WS-3 Adaptive command plus Yardi layer.** The intent bar and assembler, and the Yardi overlay extension (read plus assist plus capture). Depends on WS-1 and WS-2.
- **WS-4 Unit twin.** Spatial drill down with the APS viewer plus twin atoms. Depends on WS-1 and WS-2.
- **WS-5 Investor room plus plan review.** Provenance rollup with embedded plan review. Pulls the findings engine and property intelligence. Depends on WS-1, WS-2, and the extraction map.
- **WS-6 Context surfaces.** Wire the six existing mockups in navigable, reskin to the Revit building where cheap. Depends on WS-0 only, can run early.
- **WS-7 Narrative and honesty.** The differentiation thread, framing copy, the hero script, and enforcement of the confidence labeling and honesty guardrails across every component. Threads throughout, finalized after the hero surfaces.
- **WS-R Spike (parallel, early).** APS extraction and viewer embed spike to confirm the path on the actual RVT file. Yardi research is already complete (section 8).

## 11. Inputs needed from the operator

- The RVT 2024 file location, and the building's real address (for ground truth: parcel, code, flood, jurisdiction).
- An Autodesk Platform Services account / credentials for Model Derivative and the Viewer.
- A few Yardi screenshots (Voyager unit or vendor screen, an invoice, a RentCafe view).
- Agent read access to the source repos in the extraction map (`legacy-design-tools`, `hauska-engine`, `hauska-mcp-server`, `hauska-atom-contract`, `hauska-brief-extension`, Revit Connector).
- The empty `mox_demo` clone, local (operator is setting this up).

## 12. Delivery and demo day

- Runs local off the operator device on the frame TV, not through the room's Teams screen share (the last meeting lost five minutes and its momentum to that).
- A recorded backup of the hero path in the operator's pocket.
- The opening and closing framing lines (section 2.5 and section 3) rehearsed.

## Revision history

- 2026-06-13, created. Build plan for `mox_demo`, folding the surface tiering, the adaptive interface refinement, the RVT to APS extraction path, the Yardi read research, the function extraction map, the differentiation thread, and the premortem honesty guardrails. Premortem-check cleared 2026-06-13.
- 2026-06-13, execution started. Real asset locked: 607-611 Nelray Blvd, Austin (North Loop), a ground-up redevelopment on three contiguous MF-3 lots, with a real 5-story RVT and full design/rendering assets. Hero narrative shifted from operating to development-and-capital on the real data (operating beats stay on the context mockups). Hero plan-review finding identified and verified: a proposed 5-story exceeds MF-3 (40 ft height, 36 units/acre), requiring rezoning to MF-4+ or a variance. The living build doc is now the `mox_demo` README; real parcel/zoning/entitlement/asset detail is in `mox_demo/docs/property_ground_truth.md`; WS-0 and WS-1 dispatch briefs are written in `mox_demo/docs/dispatch/`.
