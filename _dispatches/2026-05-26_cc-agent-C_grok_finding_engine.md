---
id: 2026-05-26_cc-agent-C_grok_finding_engine
title: Dispatch — Grok finding engine (plan review)
date: 2026-05-26
agent: cc-agent-C
repo: legacy-design-tools
branch: cortex/grok-finding-engine
sprint: 40i_cortex_dallas_e2e_grok_plan_review_sprint
---

# Grok finding engine — Track A

**Sprint:** [`40i_cortex_dallas_e2e_grok_plan_review_sprint.md`](../40i_cortex_dallas_e2e_grok_plan_review_sprint.md)

**Operator decision:** Cortex product runtime uses **Grok (xAI)** for plan review. **No new Anthropic** work on findings.

## Deliver

1. **`lib/integrations-xai-grok/`**
   - `createGrokClient()` reading `XAI_API_KEY`, optional `XAI_BASE_URL` (default xAI API)
   - Chat/completions wrapper returning text for structured extraction

2. **`lib/finding-engine`**
   - `grokGenerator.ts` — same output shape as `anthropicGenerator` (`RawFindingDraft[]`)
   - `engine.ts`: `AIR_FINDING_LLM_MODE=grok|mock` (remove or warn on `anthropic`)
   - `resolveFindingLlmMode()` updated

3. **`artifacts/api-server/src/lib/findingLlmClient.ts`**
   - `getFindingLlmClient()` returns Grok client when `grok`
   - `validateFindingEngineEnvAtBoot()` for `XAI_API_KEY`

4. **Prompt**
   - Reuse `FINDING_SYSTEM_PROMPT`; require JSON array of findings with severity/category/text/citations
   - Model id from `XAI_FINDING_MODEL` env (default document in PR)

5. **Tests + docs**
   - Vitest with mocked xAI response
   - `docs/deploy.md` table row for env vars
   - `.github/workflows/cloud-run-deploy.yml`: `AIR_FINDING_LLM_MODE=grok` only after operator approves; default stay `mock` until merge

## Out of scope

- Chat, briefing, sheet OCR, classifier (separate 40f phase)
- Hauska MCP in finding inputs

## Acceptance

- [ ] `AIR_FINDING_LLM_MODE=grok` + `XAI_API_KEY` → re-run plan review logs `mode: grok` and persists findings
- [ ] CI stays green with `mock` default
- [ ] No regression to citation validator / discard rules

## Close

`P:\doc_repo\_inbox\2026-05-26_legacy-design-tools_cc-agent-C_grok_finding_engine.md`
