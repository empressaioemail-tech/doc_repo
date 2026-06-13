---
id: 2026-06-13_mox_demo_build_and_adaptive_ui_canon
title: Session — Mox demo build orchestration + adaptive UI graduated to canon
date: 2026-06-13
type: session
status: complete
related: [_prospects/mox/2026-06-13_mox_demo_build_plan, _prospects/mox/2026-06-11_mox_master_dossier, 24_adaptive_ui/adaptive_ui_vision, 24_adaptive_ui/design_system, 00_current_state]
---

# Session — Mox demo build + adaptive UI canon (2026-06-13)

## What happened

Worked the Mox engagement from the post-meeting debrief through to a live, deployed demo and a hand-off to Chris (product designer), and graduated adaptive UI from demo-hero-behavior to a portfolio-wide principle with a canonical home.

### Mox demo
- Unpacked the 2026-06-11 Mox meeting: the operating bench, not a clean CEO meeting; champion sold, operating team skeptical; the cost/lock-in objection raised by three people went unresolved; no multifamily proof on hand. Several pitch overreaches flagged (99%/24-month, IPFS-as-shipping, Yardi-replacement).
- Designed the demo as a lightly functional, real-engine adaptive interface ("the presentation that IS the adaptive interface"), best foot forward, on a real Austin redevelopment: 607-611 Nelray Blvd (three contiguous MF-3 lots, a 5-story RVT). Hero plan-review finding verified: the proposed 5-story exceeds MF-3 (40 ft height, 36 units/acre), so it needs rezoning to MF-4+ or a variance, flagged pre-submission.
- premortem-check cleared the demo (confidence-honesty + production-vs-roadmap guardrails); the six honesty guardrails are hard build constraints.
- Yardi research: the official API is the SIPP partner program at ~$25k per interface per year (Hauska cannot qualify alone; Mox-as-common-client is the key); SFTP/CSV and browser automation are the practical paths; the demo simulates read + assist + capture (the honest first shippable); write-back is a licensed-interface roadmap item. The gatekeeping is itself a sovereignty-pitch asset.
- Build plan, nine workstream dispatch briefs, and a demo run sheet authored into the new `mox_demo` repo (`empressaioemail-tech/mox_demo`); an orchestrator prompt drove a multi-agent build. Function-first from the fleet; design refinement handed to Chris.
- Delivered live on Vercel (iteration 2 verified): same-origin engine API routes (fixed the Vercel-can't-reach-local-backend bug), persistent demo header, full-screen responsive surfaces, a guided five-beat walkthrough (Yardi → twin → unit → command → investor), staggered adaptive assembly (framer-motion, reduced-motion respected), Mox business context woven per arm and cost driver, role-based access with LP redaction enforced server-side at the gate, operator redact/replace investor controls with a "LP will see" preview (and a lineage-drill leak to a tenant-private atom caught and blocked), honesty re-audit zero hard violations.

### APS saga (the 3D twin)
- APS Model Derivative blocked by an Autodesk-side account entitlement gap: AUTH-001 on all scopes including data:read, on a fresh app, even after a Flex upgrade. Confirmed via a Comet browser probe (every config check passes; it is backend provisioning, support-only). Off the demo critical path; ticket details assembled.
- Operator decision: for the demo, quickest and prettiest wins; the sustainable digital-twinning path is deferred. The legacy-design-tools model-viewer modernization (a solid four-phase plan from that agent) is parked as the real-twinning roadmap, not demo work. The demo's 3D is a Sketchfab rendered embed from the exported IFC, dropped into the staged `/twin` slot (pending a Sketchfab API token); the asset-based `/twin` ships in the meantime.

### Adaptive UI graduated to canon
- Established `24_adaptive_ui/` as the canonical home: `adaptive_ui_vision.md` (reshaped to current Hauska/Empressa brand and the live `@hauska/atom-contract` render-mode substrate, superseding the older intelligence-interface-v4 lineage), `design_system.md` (living, grows from Chris's captures), `README.md` (index plus the pull-back loop).
- Wired the Chris loop: his agent maintains a living capture in `mox_demo` (`docs/adaptive_ui_design_system.md`, "for pull-back to canon"); the planner pulls it into `24_adaptive_ui/design_system.md` at session boundaries.

## Decisions

- Adaptive UI is a captured, active, portfolio-wide design workstream now that the backend is largely roadmapped (the visible payoff of the atom treatment).
- Mox demo hero narrative shifted from operating to development-and-capital on the real Nelray data (operating beats stay on the context mockups).
- APS is off the demo critical path; demo 3D is a Sketchfab rendered embed; the real twinning path (APS, the Cortex viewer, or glTF) is deferred.

## Doc changes

- New: `24_adaptive_ui/` (vision, design_system, README); `_prospects/mox/2026-06-13_mox_demo_build_plan.md`; this session record.
- Updated: `00_current_state.md` (new top section capturing the two threads; `last_updated` to 2026-06-13).
- The `mox_demo` repo holds the build artifacts: README, property_ground_truth, the nine dispatch briefs, demo_run_sheet, hero_script_runsheet, chris_coordination_memo, and the adaptive UI vision + design-system captures.

## Open / next

- Sketchfab API token, then the live 3D embed in `/twin` (operator + build agent).
- APS entitlement support ticket (for real twinning later, off the critical path).
- Chris design refinement on `mox_demo`; pull captures back into `24_adaptive_ui/design_system.md` next session.
- `24_adaptive_ui` pointer propagation into the `00c` master-map index (session-close follow-up, not yet done).
- The Cortex model-viewer four-phase modernization plan is parked as the sustainable digital-twinning roadmap.
