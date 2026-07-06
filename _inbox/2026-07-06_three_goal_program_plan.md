# Three-goal program plan (2026-07-06)

Operator goals, verbatim intent: (1) Property Brief up and running; (2) command center firing on all cylinders; (3) the O&G project of merging our backend into Chris's front end, live and working. This plan structures them as three lanes over one spine. Execution model unchanged: Cursor executes, planner verifies/merges/deploys, verification never delegated. No timeframe estimates; execution order with dependencies named.

## Diagnosis carried in (2026-07-06 screenshots + operator ruling)

The workspace mount nested the Cortex shell inside the command center instead of composing tiles into the command center's own shell — the ADR-024 principle applied at the wrong altitude (parity of shell, not integration of tiles). Concrete defects: Atom Inspector MCP 403 method-not-allowed through /api/spine/mcp and Reviewer Queue receiving HTML (<!DOCTYPE) instead of JSON are both proxy-allowlist gaps (the panel endpoint set was never enumerated against the proxy); hydrology degraded (pysheds missing from the Cloud Run worker image); Design Accelerator map showing a placeholder-grade heatmap; five STUB panels honestly labeled. The right-rail state legend (confidence basis, resolution status, autonomy tiers, provenance, accessPolicy) is the four commitments rendered as UI and survives any redesign.

## Lane A — Command center firing on all cylinders (goal 2, the keystone)

A1. **Proxy truth pass (first, small, unblocks testing).** Enumerate every panel's endpoint against the Vercel proxy allowlist; fix the MCP method/path 403 and the cortex rewrite fallthrough; add a proxy contract test so a new panel cannot ship a path the proxy does not carry. Exit: every LIVE panel loads real data or shows a real backend error, never a proxy artifact.
A2. **Land rename PR #226 before deep workspace work** (rebase for cortex-tiles 0.1.1, merge, CI republish @empressaio, consumer bumps). Sequencing rule: integration work built on top of the old names rebases twice; land the rename first.
A3. **Shell dissolution + native integration (the big build).** Remove the nested workspace shell. The command center becomes the single shell: its nav owns the spaces (Plan Review, Site Analysis, Property Intel, Design Accelerator, Print View), tiles render as native command-center panels consumed from the @empressaio packages, one design language (command-center dark theme pushed down into the tile components via design tokens, not the cortex look pulled up). Dispatch carries the operator's screenshots as the defect spec and the extension surface as the quality reference.
A4. **Engine truth + revenue meter.** Fix infra-fixable degradations (pysheds into the engine worker image; IPMC adapter empty-body); every engine panel states LIVE/degraded/not-built honestly; build the revenue-meter panel (MCP layer2_call metering wire-up feeds it — the ICC acceptance criterion) as a native panel in the new shell.

## Lane B — Property Brief up and running (goal 1)

B1. **Verify the plan-review-to-IBC citation path** (engine-side; also serves Lane A's Plan Review space). Verify first; wire if it fails.
B2. **Extension catch-up pass to the revised architecture:** four-gate key posture, ICC formal citations live in the brief (PR #5 merged; verify on live prod), the QA defect list from the 06-17/18 loop that regressed, current package consumption. Key rotation stays deferred until after QA per standing ruling.
B3. **Full QA loop against live prod** (the proven 06-17/18 planner-coordinated pattern): land on listing, parse, run brief with cited IBC/local code, deep-dive, map. Exit: the extension is demo-grade on an in-corpus property.

**Convergence point: the ICC walkthrough** (per the 2026-07-06 operator answer in the tracker) assembles from A + B: extension running briefs with formal ICC citations through the gate, command center showing the plan-review space and the live revenue meter. A1+A4+B2 are its dependency set.

## Lane C — O&G backend into Chris's front end (goal 3)

C1. **Ratify + scaffold** (ratification package item 1): activation + ADR-025, og-twin repo created, contract 1.7.0 work begins (obligation moves to core per the stamped ruling).
C2. **Seeded-contract-first for Chris (the key sequencing move).** Do not make Chris wait for the Reeves mint: stand up the thin BFF contract with SEEDED fixture atoms conforming to the 1.7.0 shapes as soon as ADR-025 freezes, explicitly labeled seeded per the honesty guardrail, so his front end integrates against the real contract while adapters and the mint run behind it. The BFF swaps seeded for live without a front-end change. MCP tools land with or before the BFF per commitment #4.
C3. **The eight-step full-scope path runs behind it:** RRC adapters (production, H-10, permits), adjudication admin panel from first atoms (built as native command-center panels per Lane A3's model — same shell, O&G panel family), Reeves mint with the non-vacuous eval gate + cost capture, title slice, LAYER_REGISTRY keys, then live data flips into the C2 contract, then the 3D lateral lens.
Gates: Herbert's pooling read gates the 1.7.0 freeze (C1 ratification does not wait on him). Chris items owed: mockup source, per-surface data contract, BFF-vs-MCP integration call, seeded-vs-live posture ack (request list already delivered per the handoff).

## Cross-lane rules

- A1 and B1 start immediately and in parallel (different repos). A2 lands before A3 begins. A3 and B2 run in parallel (hauska-map/ldt vs extension). C runs as its own fleet (atom-contract, og-twin, engine) and does not contend for A/B lanes.
- The adjudication admin panel (C3) is built in the Lane A3 integrated-panel model from day one — no second console.
- Commitment risks named: seeded data for Chris is always labeled seeded (commitment #1 honesty); the Reeves mint gate cites the certification scaffold's non-vacuousness floor (commitment #2); metering going live in A4 is test-mode until the operator flips Stripe live (standing ruling).
- M1 (ratification item 7) runs as its own parallel dispatch pair if the operator rules "run"; it shares no lane with A/B/C.

## Operator-owed inputs to this plan

The ratification package answers (especially items 1-3 which gate C1 and A2), workspace defect notes as they accumulate (feed A3's dispatch), Herbert scheduling, Chris coordination on the C2 integration call.
