---
decision_id: 2026-07-04_icc_poc_play
date: 2026-07-04
owner: Nick
status: active
related_canonical: [icc-demo repo (docs/01_acceptance_criteria set), 75a_hauska_brief_extension.md, 50_hauska_mcp_server.md, 73_partnerships.md]
---

## Decision

The ICC proof of concept is played as the first own-the-layer proof with a real counterparty: land the stranded MCP PRs #32 and #33 (the four-gate rework and the ICC usage-attribution and pay-per-query metering) and the extension's formal-citation branch; the planner drafts answers to Ed Cilurso's eight outstanding technical questions from repo evidence for Nick to review and send; the PoC demo is a two-screen story, the brief extension showing an investor receiving formally cited I-Code reasoning through the gate, and the command center showing ICC its live usage metering and attribution. Timing is self-driven; there is no external date to build backwards from.

## Context

The ICC contract (signed around 2026-06-17, 180-day term) carries three acceptance criteria per the icc-demo record: correct formal citation, the layer in between never republishing code text, and visible usage metering. The 2026-07-04 audit found every needed piece built but stranded: PR #33 is the metering, the extension citation branch is unmerged, the engine adapter runs on PoC fixtures, and the eight technical questions to Ed Cilurso had sat unanswered for twelve days. Nick confirmed the extension is a consumer product for real estate investors consuming the spine, and that demonstrating to ICC how their data is used, protected, and monetized is the purpose that originally seeded the command-center concept.

## Structural commitment check

Commitment 1 (sell reasoning, not data): directly expressed, the demo shows reasoning plus citation served while licensed text is never republished. Commitment 4 (MCP-first): supports, the citation path runs through the gate. Visible metering is contractual, not discretionary. No premortem yellow; formal premortem-check runs with the Phase 0 execution plan.

## Reasoning

The PoC is worth more than contract compliance: it is the template for every future licensed-content partnership (licensed content in, metered reasoning out, publisher paid) and therefore the first tangible GTM artifact of the own-the-layer strategy. The command-center metering view gives ICC a revenue meter they can watch, which converts a defensive licensing relationship into a distribution partnership pitch. Landing #32/#33 and the citation branch are already Phase 0 items, so the PoC adds mostly assembly and narrative, not new build. Answering Ed Cilurso's questions unblocks Gate 1 of the ICC build plan and stops the silent burn of the 180-day term.

## Reversal criteria

Revisit if ICC's answers to the technical questions invalidate the Code Connect API integration path (forcing a different ingest or display mechanism); if ICC requires a demo format other than the two-screen story; or if metering-at-the-gate cannot attribute per-query usage accurately enough to present as a revenue meter.

## Dependencies

Depends on: Phase 0 (PRs #32/#33 landed, extension branch merged, corpus and lockfile truth), the SDK metering publish, ICC answering the eight questions (operator sends, counterparty replies). Depended on by: the certification and licensed-distribution motion in Phase 4, the extension's investor-facing launch narrative.

## Counterparties

ICC (Ed Cilurso, technical contact). Internal: Nick owns the send and the relationship.
