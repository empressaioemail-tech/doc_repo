---
id: 2026-07-13_cotality_swap_execution_claude_code
title: Session — Cotality swap surfaced, adversarially reviewed, and executed to production
date: 2026-07-13
kind: session-summary
agent: claude_code_planner
related: [_decisions/2026-07-13_cotality_swap_public_record_migration, 75l_cotality_data_stack_catalog, 55_spine_data_intelligence_stack]
---

# Session: Cotality swap — plan surfaced, adversarial review, hands-off execution through deploy

Nick asked to surface last week's Cotality-swap planning chat, review its legitimacy, map every possible Cotality data family with an answer for each, then ruled: no Regrid (customer service), insurance descoped, parallel adapters using what's in place, planner runs it hands-off through deployment, adversarial review replaces the formal premortem (premortem retired for good — recorded in agent memory).

## Arc

1. **Surfaced** the 2026-07-06 fallback chat (transcript `654ca4ef`, never ratified/committed). Adversarial review found it architecturally right but inert: no default trigger dates, cache-warming premise already dead, CLIP re-key never executed, Regrid conflict with the standing purge, LightBox never considered, missing the free public-record floor (TxGIO/CAD), fallback-vendor ToS never named.
2. **Mapped all ~28 Cotality data families** to answers (in-chat table): ~20 clean-or-better in the GTM footprint; honest gaps only in national HOA, propensity-as-product, actuarial climate AAL, insurance-grade RCV, claims-grade weather verification — the last three descoped with insurance.
3. **Recon fleet** (4 agents, cross-refuted + spot-reprobed): found the CLIP join key hardwired outside the adapter boundary, the `parcels` layer Cotality-hardwired, `cotality:` prefix couplings, no PostGIS, Cotality dead at OAuth on both projects with no cache masking, Bastrop county GIS host DNS-dead (replacement found + verified), TxGIO/CAD sources live-verified with real probes, and stale bits of my own memory (MCP gate enum) corrected.
4. **Executed** across 8 PRs / 3 repos, each adversarially reviewed pre-merge (two review catches: a parcelKeyKind mislabel in #243, an NWIS float-precision miss my deploy smoke caught after #92 — vendor-side ≤7-decimal rule, fixed in #93/#244), merged on green CI only, deployed via canary discipline with live smokes: ldt #242/#243/#244/#245/#246, engine #92/#93, hauska-map #20. Production ingests: 1,069,018 CAD properties across 5 counties. Command center deployed to Vercel with server-held keys.

## End state

Map parcel mesh, brief property slots (owner/tax/absentee/characteristics), parcel-key capture, engine free-data layers, and the command center all run Cotality-free on public record, provenance-labeled, with Cotality adapters dormant behind config for cheap re-entry. E2E verified live: Bastrop brief returns `apn:48021:47822` + three CAD layers cited to the CAD roll; Austin map bbox serves 200 live Travis parcels.

In flight at close: `feat/txgio-parcel-geometry` (Hays/Comal geometry + Hays brief unblock + CLI fixes). Queued: ENGINE_API_GATE_TOKEN enforce (caller survey first), WCAD tax-year confirm, MLS/RentCast phase, Bexar CAD PIR.

Deploy handles in the decision record. Verification evidence (verbatim probe outputs) lives in the PR bodies and this session's transcript.
