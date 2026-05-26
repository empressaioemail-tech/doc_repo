---
id: 2026_05_24_cortex_prod_qa_pass4_sprint_plan
title: Cortex prod QA pass 4 — QA-36–58 register and sprint plan
status: active
last_updated: 2026-05-25
applies_to: design-accelerator
related: [43_cortex_qa_backlog, 40g_cortex_cockpit_backend_wiring_sprint, 00_current_state, _sessions/2026-05-25_cc-agent-C_session_close]
---

# Cortex prod QA pass 4 — comprehensive report and sprint plan

> Filed from `_inbox/2026-05-24_doc_repo_planner_cortex_prod_qa_pass4_sprint_plan.md` on 2026-05-25 inbox sweep.

**Prod at time of pass:** `cortex-api-00045-pas` (#114 only). **`main` @ `3250a74`** (#115–#117 merged, not deployed).

**New backlog IDs:** QA-36 through QA-58 (23 items). Full register and sprint structure in source doc body preserved from operator session.

**Operator-agreed sequence (updated 2026-05-25):**

1. Backend wiring + Batch 1 — **DONE** (`59125da`).
2. **Pre-deploy completion (40h)** — close all WS-I before deploy ([`40h_cortex_pre_deploy_completion_sprint.md`](../40h_cortex_pre_deploy_completion_sprint.md)).
3. **Deploy** — single pin SHA after WS-I closed.
4. **QA pass 5** — full regression; anything broken is a bug (no deferred batch).

See [`_sessions/2026-05-25_cc-agent-C_session_close.md`](../_sessions/2026-05-25_cc-agent-C_session_close.md) for agent queue completion record.
