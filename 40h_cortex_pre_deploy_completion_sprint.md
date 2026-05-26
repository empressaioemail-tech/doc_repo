---
id: 40h_cortex_pre_deploy_completion_sprint
title: Cortex pre-deploy completion sprint (WS-I closure)
status: active
last_updated: 2026-05-25
applies_to: design-accelerator
related: [43_cortex_qa_backlog, 40g_cortex_cockpit_backend_wiring_sprint, _sessions/2026-05-25_cc-agent-C_qa_fix_batch1, _dispatches/2026-05-25_cc-agent-C_pre_deploy_completion, _dispatches/2026-05-25_cc-agent-R_pre_deploy_studio]
---

# Cortex pre-deploy completion sprint

> **Operator rule (2026-05-25):** Do not deploy until WS-I is closed. During QA, assume every Cockpit surface is **supposed to work**; anything broken is a **bug**, not a queued batch.

**Baseline:** `main` @ `01e7523` (#122 Studio). **Track C:** PR [#123](https://github.com/empressaioemail-tech/legacy-design-tools/pull/123) open (`b4211d0`) — merge when CI green. **Prod:** still `cortex-api-00045-pas` (#114 only).

**Deploy pin:** merge SHA of #123 on `main` after merge.

---

## Gate definition

| State | Meaning |
|-------|---------|
| **Closed** | Feature works on `main` with tests; operator infra applied where required |
| **N/A** | Explicitly out of customer-zero scope for this release (doc + UI removed from test path) |

**No** "pass 5 deferred" list. Either ship or mark N/A with UI hidden.

---

## Remaining WS-I items (11 open + 1 partial)

| ID | Owner | MVP done bar |
|----|-------|----------------|
| QA-38 | Operator + cc-agent-C | `HAUSKA_SUBSTRATE_MODE=mcp` on cortex-api; Code Library lists live substrate jurisdictions (no fixture split label) |
| QA-45 | cc-agent-C | Dashboard AI answers inbox/projects question without opening an engagement |
| QA-46 | cc-agent-R + cc-agent-C | Floor plan viz: real mnml job, visible result, Download PNG contrast |
| QA-48 | cc-agent-R + cc-agent-C | Studio sub-nav **Video rendering** tab with queue/view flow (parity with floor plan viz) |
| QA-50 | cc-agent-C | **Client materials** panel: upload PDF/link/image; engagement chat tool lists attachments |
| QA-51 | cc-agent-C | Settings **Access**: real share URL from #115 API, copy works, remove COMING SOON |
| QA-52 | cc-agent-C | Letters tab: QA-28 generate letter + QA-29 presentation packet (not SOON) |
| QA-53 | cc-agent-C | Operator path: preview client package share + client plan-review entry from share |
| QA-55 | cc-agent-C | Product specs: **Generate draft** → AI spec rows, operator edit/approve |
| QA-56 | cc-agent-C | Detail callouts: same generate pattern **or** merged into specs (operator picks A/B) |
| QA-57 | cc-agent-C | Workspace settings: Cortex branding; **firm name** (min) persisted via API |
| QA-27 | cc-agent-C | Dashboard/intake: drop link → draft engagement (Phase 3; verify vs rebuild) |
| QA-58 | Operator | Dallas engagement — **done**; verify Regrid on deploy |

**Batch 1 already closed:** QA-36–37, QA-39–44, QA-47, QA-49, QA-54.

---

## Execution tracks (parallel)

### Track O — Operator (before agent sign-off)

1. Mint / confirm `HAUSKA_MCP_KEY` + set `HAUSKA_SUBSTRATE_MODE=mcp`, `HAUSKA_MCP_URL` on `cortex-api`
2. Confirm `REGRID_API_KEY` mounted (Dallas pass 5 test)
3. Dallas engagement — done
4. Optional: backup tag `backup/pre-cortex-wsi-complete-20260525` on completion SHA

### Track C — cc-agent-C

Single dispatch: [`_dispatches/2026-05-25_cc-agent-C_pre_deploy_completion.md`](_dispatches/2026-05-25_cc-agent-C_pre_deploy_completion.md)

Phases: substrate UI → settings/share → Phase 3 (27/28/29) → client materials + review paths → deliver AI (55/56) → workspace (57) → global AI (45).

### Track R — cc-agent-R

Dispatch: [`_dispatches/2026-05-25_cc-agent-R_pre_deploy_studio.md`](_dispatches/2026-05-25_cc-agent-R_pre_deploy_studio.md)

Phases: mnml audit/fix (QA-46) → video tab (QA-48); cc-agent-C wires Studio UI.

---

## After sprint closes

1. `build-and-push` on final SHA
2. Canary `image_tag=<sha>` → `run-migrations` → smoke → traffic
3. **QA pass 5** — full WS-I regression + 40g §J; Dallas first for Regrid
4. Phase 3 gate in old docs **superseded** by this sprint (27/28/29 in scope here)

---

## Operator decision needed (one line)

**QA-56:** (A) separate Detail callouts AI surface, or (B) fold callouts into Product specs tab. Default **B** if no reply before cc-agent-C reaches that phase.
