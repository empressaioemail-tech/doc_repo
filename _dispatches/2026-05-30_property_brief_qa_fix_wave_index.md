---
id: 2026-05-30_property_brief_qa_fix_wave_index
title: Index — Property Brief manual QA fix wave (2026-05-30)
date: 2026-05-30
agent: planner
repo: doc_repo
kind: dispatch-index
related: [75a_hauska_brief_extension, 75d_property_brief_ui_replit_handoff, 75e_property_brief_collaboration_sharing_handoff, 75b_brief_coverage_v0]
---

# Property Brief QA fix wave — dispatch index

Manual QA on prod extension **v0.6.3** (Round Rock + Pflugerville) surfaced five failure classes. This index sequences agent-owned dispatches. Operator does not hand-fix extension code; agents ship PRs, operator merges and redeploys.

## QA evidence (operator)

| Address | Expected | Observed |
|---------|----------|----------|
| 403 Hickory Ridge Trl, Pflugerville | `no_match` | Correct badge; **wrong Bastrop ADU demo** in chat |
| 1904 Heathwood Cir, Round Rock | `in_corpus` | **`ResourceOkQuotaBytes quota exceeded`** on Run brief |
| Any property | Share link | **"Share link unavailable"** — no `workspaceId` persisted |
| Listing panel | Narrative after chips | **At a glance only** — no `reasoningSummary` prose |
| Multiple surfaces | Buttons / demo data | Demo collaborators, attachments, wallet fallback |

Pilot corpus (Neon warmup green): `round_rock_tx`, `austin_tx`, `hutto_tx`, `georgetown_tx`, `new_braunfels_tx`, `leander_tx`.

## Execution order

```text
Wave 1 (parallel)
├── cc-agent-C  → brief API slim + workspaceId in response + REGRID mount
└── extension-agent → v0.6.4 QA fix bundle (depends on Wave 1 API fields for full share pass)

Wave 2 (after Wave 1 merge + cortex-api deploy)
├── cursor-auto   → operator deploy + smoke + QA checklist
└── extension-agent → bump build against prod; inbox close

Wave 3 — backend deploy (DONE 2026-05-30)
└── cc-agent-C #138 + #139 + operator env/REGRID patch

Wave 4 — zero-config consumer (P0, parallel)
├── cc-agent-C    → public client key on prod          **DONE** #140 + operator deploy
└── extension-agent → v0.6.5 single consent, no settings gate  **build done; QA pending**

Wave 5 — operator close (2026-05-30)
└── prod smoke PASS on 00119-laq; extension release build; Chrome QA + QuotaBytes fix remaining
```

## Dispatches

| # | File | Agent | Repo | Status |
|---|------|-------|------|--------|
| 1 | [`2026-05-30_cc-agent-C_brief_api_slim_and_workspace_id.md`](2026-05-30_cc-agent-C_brief_api_slim_and_workspace_id.md) | cc-agent-C | legacy-design-tools | **DONE** #138 |
| 2 | [`2026-05-30_extension-agent_qa_fix_wave_v064.md`](2026-05-30_extension-agent_qa_fix_wave_v064.md) | extension-agent | hauska-brief-extension | shipped; merge PR |
| 3 | [`2026-05-30_cursor-auto_property_brief_qa_operator_wave.md`](2026-05-30_cursor-auto_property_brief_qa_operator_wave.md) | cursor-auto | doc_repo | optional |
| 4 | [`2026-05-30_cc-agent-C_extension_public_client_key_p0.md`](2026-05-30_cc-agent-C_extension_public_client_key_p0.md) | cc-agent-C | legacy-design-tools | **DONE** #140 + prod deploy |
| 5 | [`2026-05-30_extension-agent_zero_config_consumer_ux.md`](2026-05-30_extension-agent_zero_config_consumer_ux.md) | extension-agent | hauska-brief-extension | build done; **QA pending** |
| — | [`2026-05-29_cc-agent-C_extension_public_client_key.md`](2026-05-29_cc-agent-C_extension_public_client_key.md) | cc-agent-C | legacy-design-tools | superseded by #4 |

## Acceptance (wave complete)

Operator re-runs manual QA on:

- **Round Rock:** `1904 Heathwood Cir, Round Rock, TX 78664` — brief completes, At a glance + narrative, share link copies, deep research ADU cites Round Rock code.
- **Pflugerville:** `403 Hickory Ridge Trl, Pflugerville, TX 78660` — honest no-corpus copy, **no Bastrop citations**.
- **Share:** collaborator opens `GET /workspaces/shared/:token` read-only package.
- **Storage:** five consecutive brief runs on different listings do not hit quota error.

## Inbox closes expected

- `_inbox/2026-05-30_legacy-design-tools_cc-agent-C_brief_api_slim_and_workspace_id_close.md`
- `_inbox/2026-05-30_hauska-brief-extension_extension-agent_qa_fix_wave_v064_close.md`
- `_inbox/2026-05-30_doc_repo_cursor-auto_property_brief_qa_operator_wave_close.md`
- `_inbox/2026-05-30_legacy-design-tools_operator_property_brief_extension_public_prod_deploy_close.md` — **operator prod deploy log**
- `_inbox/2026-05-30_property_brief_extension_public_deploy_session_handoff.md` — **pickup + ICC/Cotality/Forrest**
- `_inbox/2026-05-30_hauska-brief-extension_operator_extension_public_prod_qa_close.md` — extension build/QA status
- `_inbox/2026-05-30_legacy-design-tools_cc-agent-C_extension_public_client_key_close.md` — updated checklist
