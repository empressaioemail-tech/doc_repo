---
id: 2026-06-08_cc-agent-E_florida_icc_layer1_and_corpus_ingest_GATED
title: Dispatch — ICC Layer-1 activation + Florida engine-corpus ingest (the cutover)
date: 2026-06-08
agent: cc-agent-E
repo: hauska-engine
kind: dispatch
status: GATED - DO NOT FIRE until the operator returns from the ICC meeting with the Code Connect OAuth spec + credentials
related: [00_current_state, 80_adrs/adr_019_layered_code_substrate, 56_engine_extraction_sprint, _decisions/2026-06-08_miami_beach_plan_review_hybrid_bootstrap, 73_partnerships, 20_agent_operating_rules, 01a_atom_conventions]
---

# ICC Layer-1 activation + Florida engine-corpus ingest

> **GATED. Do NOT fire until two things exist:** (1) the ICC Code Connect OpenAPI/Swagger spec + example payloads + OAuth2 token-endpoint details the operator is bringing back from the ICC meeting this week, and (2) populated `ICC_CODE_CONNECT_CLIENT_ID` / `ICC_CODE_CONNECT_CLIENT_SECRET`. Until then the ICC adapter stays `unconfigured` (green, inert) and this dispatch cannot complete. This is the durable cutover that grounds the cortex-local bootstrap (cc-agent-C dispatch) onto the decoupled engine corpus. Frame: [`_decisions/2026-06-08_miami_beach_plan_review_hybrid_bootstrap.md`](../_decisions/2026-06-08_miami_beach_plan_review_hybrid_bootstrap.md).

You are **cc-agent-E**, single owner of the `P:\hauska-engine` clone for this run.

## Model (HR-12)

Default: **Grok Build 0.1** (multi-file / agentic). Escalate to Claude only if Grok fails after retry; log it. Cursor base URL `https://api.x.ai/v1`.

## Atoms to resolve

- `current-state:portfolio` — fleet status, blockers
- `adr:019` — layered code substrate; Layer 1 base, Layer 2 overlay, deep-link interim footing
- `sprint:56` — engine extraction; the gate->engine path this corpus serves through

## Read first (after atoms)

1. [`80_adrs/adr_019_layered_code_substrate.md`](../80_adrs/adr_019_layered_code_substrate.md) — the architecture; Wave-1 edition order (2021 IRC/IBC/IECC) is resolved there
2. [`56_engine_extraction_sprint.md`](../56_engine_extraction_sprint.md) — the consumer cutover; this corpus is what cortex-api will retrieve through the gate
3. [`73_partnerships.md`](../73_partnerships.md) — ICC/NFPA licensor track; the NEC gap routes here
4. [`20_agent_operating_rules.md`](../20_agent_operating_rules.md) — HR-1, HR-2, HR-3, HR-8, HR-11

## Workspace ownership

- Clone: `P:\hauska-engine`
- Branch prefix: `engine/` (suggest `engine/florida-icc-layer1`)
- One agent per clone. Refuse alien HEAD or uncommitted state; report verbatim `git status` + `git log -3`. (Note: a prior run left the primary clone dirty on `feat/neon-warmup-pilot-load`; confirm clean or use a worktree.)

## Verified facts (source: doc_repo 2026-06-08 probe of hauska-engine @ main)

- ICC Code Connect adapter is built and credential-gated: `packages/corpus/src/adapters/icc-code-connect/` (index.ts, code-connect-client.ts). Modes `live` / `mock` / `unconfigured`; OAuth2 client-credentials grant with token caching. Endpoints are tagged `@assumption` pending the real spec. Creds via `ICC_CODE_CONNECT_CLIENT_ID` / `ICC_CODE_CONNECT_CLIENT_SECRET` (`codeConnectCredentialsFromEnv()`). Fixtures exist (A117-2021, IRC-2021).
- The Layer-1 model-code structural extractor (Lane E deliverable 2 — turns Code Connect responses into `code-section` atoms with `verbatimTextDeepLink`) is NOT yet in the repo. This is real build work, not zero-effort, even once creds land.
- Layered substrate is complete: `packages/atoms/src/instances.ts` — `code-edition`, `code-section` (with optional `verbatimTextDeepLink` + `isDeepLinkFootingSection()`), `code-amendment` with the `amendmentScope` discriminant (`temporal` vs `jurisdictional-overlay`, the Layer-2 overlay linking `baseEditionId` + `overlayOperation`). Zod schemas enforce the boundary.
- Municode adapter is production-usable: `packages/corpus/src/adapters/municode/` (JSON mode needs clientId + librarySlug + stateAbbr; optional chapter / product-name filters). Ingest path: `tools/migrate-legacy-codes` `path-c-ingest`; discovery + cost-tracking + eval in `tools/ingest-cli`.
- **CAVEAT to confirm first:** REPO_NOTES indicates the Municode ingest currently writes to an in-memory StoragePort (Postgres backing was a follow-on). Confirm the persistence target before ingesting Florida; if Postgres backing is not yet live, the engine-corpus ingest persists nothing queryable and this dispatch is blocked on that first. Report the StoragePort state in recon.
- Corpus is 100% Texas (30+ jurisdictions) + federal accessibility (ADA 2010, FHA). Zero Florida.
- Municode client IDs: Miami Beach 3289, Miami-Dade County 11719 (re-confirm via `getClientByName`).

## Scope

**In scope (sequence; multiple PRs expected):**

1. **Recon (read-only, report before building):** confirm the Municode StoragePort persistence target (in-memory vs Postgres) per the caveat above; reconcile the ICC adapter's `@assumption` endpoints against the real OpenAPI spec the operator brings back; report deltas.
2. **Activate ICC Code Connect Layer 1.** Populate creds (operator action; you wire and verify), reconcile the client to the real spec, and build the Layer-1 model-code structural extractor (Lane E deliverable 2): emit `code-section` atoms carrying structure + reasoning + `verbatimTextDeepLink` to the ICC viewer (interim footing), upgrading to grounded full text where licensing permits per ADR-019. Build the Layer-1 eval rubric. Edition order per ADR-019 Wave 1: **2021 IRC, then IBC, then IECC** (the base Florida's 2023 8th-edition codes sit on — this base is shared with the Texas corpus, so it amortizes, do not book its cost to Florida).
3. **Florida amendment overlay (Layer 2).** Ingest the Florida state amendments to the 2021 I-Code base as `jurisdictional-overlay` `code-amendment` atoms linked to the Wave-1 `code-edition` atoms (the FBC / Florida Mechanical Code 2023 8th edition / Florida Energy Conservation Code 2023 deltas the operator's review cites: M601.6, M-Ch.4, 304.11, M307, EC R103 / R403.7.1, E-403.6, FBCB Ch.7 / Table 721.1(2), 1405.4).
4. **The two Florida jurisdictions (Layer 2/3).** Ingest Miami-Dade County (clientId 11719) and Miami Beach (clientId 3289) via the Municode adapter, scoped to the chapters the review needs (Miami-Dade HVAC design / Chapter 8, NOA/BORA, unit-combination thresholds; Miami Beach existing-building valuation / admin). Tag `platform-internal`. Author 20-30 curated eval queries per jurisdiction; run the eval harness; record cost via `ingest-cli cost-record` and run the hard-kill checkpoint (commitment 3: under $200 compute + 1h review per jurisdiction).

5. **NEC / NFPA grounding track (scoping + partnership note, not ingest).** The NEC is NFPA 70, not on ICC Code Connect, so the ICC deal does NOT cover it. The cortex-local bootstrap (cc-agent-C) seeds NEC interim deep-link reference atoms against NFPA free access (`ungrounded-pending-NFPA`); grounding to full NEC text requires an NFPA data license / NFPA LiNK arrangement, parallel to ICC Code Connect. File/refresh the NFPA licensor line in `73_partnerships.md` as the grounding path and confirm whether NFPA LiNK exposes structured/API access or whether a separate NFPA data agreement is needed. Do NOT ingest or host verbatim NEC text on this run; electrical stays on the interim reference footing until the NFPA track lands.

**Out of scope:**

- Grounding (full-text hosting) of the NEC on this run — gated on the NFPA track above; reference-only interim footing only.
- The gate->engine wiring and the cortex-api consumer cutover (sprint 56 / the linchpin deploy) — separate, already tracked. This dispatch produces the corpus that path will serve; it does not wire the path.
- Any change to legacy-design-tools / cortex-local code_atoms (the cc-agent-C bootstrap owns that).
- Texas corpus changes beyond the shared Wave-1 base ingest.

## Acceptance criteria

- Recon report: StoragePort persistence target stated; ICC spec-vs-assumption deltas listed. If StoragePort is in-memory only, STOP after recon and report — do not proceed to a non-persisting ingest.
- ICC adapter in `live` mode against the real spec; Wave-1 2021 IRC/IBC/IECC `code-edition` + `code-section` atoms present, on interim deep-link footing where text is not yet licensed; Layer-1 eval rubric passes.
- Florida state amendment overlay atoms link to the Wave-1 editions (`baseEditionId` set, `overlayOperation` correct); the operator-cited sections resolve as base-plus-overlay.
- Miami-Dade (11719) and Miami Beach (3289) ingested, `platform-internal`, eval harness passing per the 90/100/95 rubric; per-jurisdiction cost recorded and inside the $200 + 1h envelope (or flagged yellow to the operator).
- All atoms carry accessPolicy + source + confidence + timestamp (quality-gate rule).
- NEC explicitly noted as the uncovered gap with the NFPA-track pointer; no grounded NEC claim.
- PRs held for operator merge (do not merge); branches + SHAs reported.

## Reporting

At break-point, write to `P:\doc_repo\_inbox\` as `2026-06-08_hauska-engine_cc-agent-E_florida_icc_layer1_corpus.md`. Include atom refs touched, model used (if not default Grok), PR URLs + branch SHAs, the recon report (StoragePort + ICC spec deltas), eval results, the per-jurisdiction cost record, and blockers verbatim.
