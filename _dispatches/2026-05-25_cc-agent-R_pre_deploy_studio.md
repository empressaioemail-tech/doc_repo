---
id: 2026-05-25_cc-agent-R_pre_deploy_studio
title: Dispatch — Studio rendering completion (QA-46, QA-48)
date: 2026-05-25
agent: cc-agent-R
repo: legacy-design-tools
kind: dispatch
operator_greenlight: 2026-05-25
related: [40h_cortex_pre_deploy_completion_sprint, 40e_cortex_rendering_parity_sprint, 43_cortex_qa_backlog]
---

# Pre-deploy Studio — cc-agent-R

**Goal:** QA-46 and QA-48 closed before operator deploy. cc-agent-C wires Studio UI after your API/client work lands.

## Baseline

`main` @ `59125da`; read [`40h_cortex_rendering_parity_sprint.md`](../40e_cortex_rendering_parity_sprint.md).

## QA-46 — mnml floor plan viz

1. Audit mock vs `HttpMnmlClient` / env keys on Cloud Run path
2. Fix: real render job, result persistence, Download PNG contrast (not white-on-white)
3. Upload button alignment if still broken

**Acceptance:** Queue render on floor-plan sheet → result visible → download works.

## QA-48 — Video rendering tab

1. Add Studio sub-nav tab **Video rendering** (peer to Model renders / Floor plan viz)
2. Flow: select source → queue render → gallery (reuse render pipeline patterns from 40e)

**Acceptance:** Tab visible; operator can queue at least one video render job end-to-end (mock OK in dev if API key missing; prod needs operator env).

## Handoff

- PRs to `main`; notify cc-agent-C for any `design-tools` Studio route/tab wiring
- Courier to `P:\doc_repo\_inbox/2026-05-25_legacy-design-tools_cc-agent-R_pre_deploy_studio_close.md`

## Do not deploy

Operator pins deploy after C + R completion.
