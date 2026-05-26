---
id: 2026-05-26_cc-agent-C_dallas_code_corpus
title: Dispatch — Dallas County code corpus (Cortex warmup)
date: 2026-05-26
agent: cc-agent-C
repo: legacy-design-tools
branch: cortex/dallas-code-corpus
sprint: 40i_cortex_dallas_e2e_grok_plan_review_sprint
prerequisite: merge fix/jurisdiction-surfacing-v1.5-v3 recommended
---

# Dallas code corpus — Track B

**Sprint:** [`40i_cortex_dallas_e2e_grok_plan_review_sprint.md`](../40i_cortex_dallas_e2e_grok_plan_review_sprint.md)

**Test engagement:** QA-58 — Cedar Hill / Dallas County (`430 Evergreen Trl`).

## Goal

`keyFromEngagement()` resolves Dallas-area addresses → `dallas_county_tx` (or agreed key). Warmup populates `code_atoms` so plan review retrieves **code sections**, not only FEMA briefing advisories.

## Deliver

1. **Recon (max 2h, document in PR)**
   - Adopted code host for Dallas County TX (and whether City of Dallas is separate)
   - Pick source: Municode (`municodeClientId`, `librarySlug`) preferred if API works

2. **`lib/codes/src/jurisdictions.ts`**
   - New `JurisdictionConfig` + books
   - `CITY_STATE_TO_KEY` entries at minimum:
     - `cedar hill|tx`, `dallas|tx`, `dallas county|tx`

3. **`sourceRegistry.ts`** — register source + adapter config

4. **Warmup**
   - Document operator steps: Code Library → Dallas card → **Warm up now**
   - Target: atom count > 50 (minimum); prefer hundreds for retrieval quality

5. **Coverage**
   - After warmup on QA-58 engagement: `coverageStatus` → `ready`
   - Findings self-run allowed

6. **Tests**
   - `jurisdictions.test.ts` for new keys
   - Optional smoke: retrieval returns non-empty for a zoning/setback question

## Out of scope

- Full Hauska substrate ingest (cc-agent-E Track C unless you are blocked)
- eCode360 batch for Houston/Dallas statewide

## If blocked

- Post blocker in inbox with source URL + HTTP result
- Planner may fire [`2026-05-26_cc-agent-E_dallas_substrate_ingest.md`](2026-05-26_cc-agent-E_dallas_substrate_ingest.md)

## Acceptance

- [ ] QA-58 engagement shows Site coverage **Code ready**
- [ ] Re-run plan review returns findings with `[[CODE:...]]` citations
- [ ] Code Library shows Dallas jurisdiction with embedded atoms

## Close

`P:\doc_repo\_inbox\2026-05-26_legacy-design-tools_cc-agent-C_dallas_code_corpus.md`
