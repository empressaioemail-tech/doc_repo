---
id: 2026-06-08_cc-agent-C_cortex_websearch_code_retrieval
title: Dispatch — Cortex web-search code retrieval (grounds Miami Beach Layer-1 today; reusable corpus fallback)
date: 2026-06-08
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
status: READY - fires on the existing cortex/whole-review-vision-miami branch
related: [_decisions/2026-06-08_miami_beach_plan_review_hybrid_bootstrap, _dispatches/2026-06-08_cc-agent-C_cortex_pdf_planreview_and_miami_beach_bootstrap, 40i_cortex_dallas_e2e_grok_plan_review_sprint, 80_adrs/adr_019_layered_code_substrate, 08_tiered_access_model, 01a_atom_conventions]
---

# Cortex web-search code retrieval

> Builds **on** branch `cortex/whole-review-vision-miami` (SHA `76c0bcb738bcca761ca7b5b49c6b3fbd40a8a9b4`, on the remote). Do NOT start a new branch from main; continue this one (or branch from this SHA). The PDF text extraction, Miami Beach (3289) + Miami-Dade (11719) warmup, PDF-page render, `attachedSheetImages`, and Opus-4.8 per-discipline vision from the prior dispatch stay as-is. This dispatch changes only how Layer-1 model-code grounding is sourced.

You are **cc-agent-C**, single owner of the `legacy-design-tools` clone for this run.

## Why this supersedes the interim-atom seed

The hybrid-bootstrap decision (`_decisions/2026-06-08_miami_beach_plan_review_hybrid_bootstrap.md`) grounded FBC/I-Code and NEC sections with **interim `ungrounded-pending-ICC` / `ungrounded-pending-NFPA` placeholder atoms** — a section number and a deep-link, no actual code text — with real text gated behind the ICC meeting. Placeholder shells do not let the finding engine reason against the code; they name a section but carry nothing to check the drawing against. Operator direction 2026-06-08: fetch the actual code text on demand by web search from authoritative free sources, feed it to the engine as a grounded citation, and build it as a **reusable fallback** for any code that lands outside the atomized corpus, not a Miami-only patch. This removes the hard dependency on the gated ICC cutover for a grounded review today. The cc-agent-E ICC/NFPA cutover dispatch stays GATED and is unaffected; it remains the durable, licensed home for this text. Web retrieval is the interim grounding that the cutover later replaces.

## Model (HR-12)

Default **Grok Build 0.1** for agentic work and finding synthesis (`AIR_FINDING_LLM_MODE=grok`). The per-sheet drawing read stays on Claude `claude-opus-4-8` (already wired this branch). No model change in this dispatch.

## Verified facts (doc_repo probe of legacy-design-tools @ main `a84bbe1`, 2026-06-08)

- The finding engine consumes code as `CodeSectionInput { atomId, label, snippet? }` (`lib/finding-engine/src/types.ts:91-98`); findings cite inline as `[[CODE:<atomId>]]` and echo a parsed `citations` list. The engine does NOT fetch atoms itself — the api-server route hands them in.
- `resolveEngineInputs` (in `artifacts/api-server/src/routes/findings.ts`) builds `codeSections` from a jurisdiction-scoped `retrieveAtomsForQuestion()` top-8 (`lib/codes/src/...retrieval`). This is the single seam where the web-fetched sections are appended.
- Jurisdiction warmup + retrieval are keyed by `jurisdictionKey` (`lib/codes/src/jurisdictions.ts`); `miami_beach_fl` / `miami_dade_fl` are registered on this branch.
- The interim seed to supersede: `scripts/seed-florida-interim-atoms.mjs` and its `lib/codes` interim-reference-atom helper (`interimReferenceAtoms` test). Confirm exact paths on your branch before editing.

## Scope

In scope (sequence; one or more PRs):

1. **Code web-retrieval module (jurisdiction-agnostic).** New module under `lib/codes` (suggest `lib/codes/src/webCodeFetch.ts` + a small source-driver set). Signature roughly: `fetchCodeSection({ codeRef, edition, jurisdictionKey }) -> { text, sourceUrl, retrievedAt, edition, section, confidence, verified, sourceName }`. It searches an authoritative-source allowlist, fetches the page, extracts the cited section/article text, and returns it with full provenance. Build it as a general capability, not Florida-special-cased.

2. **Authoritative-source allowlist + edition/section verification.** Allowed sources only: `floridabuilding.org` (Florida-adopted editions), the ICC public-access viewer (`codes.iccsafe.org`), NFPA free access (`nfpa.org`, for NEC / NFPA 70), and UpCodes (`up.codes`) as a structured cross-check. The fetcher MUST verify the returned text matches the requested **edition** (FBC 2023 / Florida Mechanical 2023 8th ed / NEC 2017 — not 2020) and **section/article** before returning `verified: true`. On any mismatch or low-confidence extraction, return `verified: false`, downgrade `confidence`, and tag the result `unverified-web-source`. Never return a paraphrase or a third-party summary as grounded text.

3. **Wire as a retrieval FALLBACK in `resolveEngineInputs`.** After `retrieveAtomsForQuestion()`, for the sections the review needs that the corpus does not cover (zero / low-relevance atoms, or an explicit cited-section list), call the web-retrieval module and append the results as `CodeSectionInput` entries with a **synthetic, visibly-web-sourced** `atomId` of the form `websearch:<edition-slug>:<section>` (e.g. `websearch:fbc-2023:m601.6`). Corpus atoms keep their normal ids; the two id namespaces must be distinguishable downstream. Thread `sourceUrl` + `retrievedAt` + `edition` so the finding's citation chip renders the live source and date, not a bare section number.

4. **Retire the interim placeholder seed.** Replace `seed-florida-interim-atoms.mjs`'s empty `ungrounded-pending-ICC/NFPA` shells with the web-retrieval path. Keep a deep-link-only footing ONLY as the fallback-of-the-fallback: when web retrieval returns `verified: false` for a section, the finding may still reference the section number with an `unverified-web-source` flag and the deep link, never as high-confidence grounded text. Do not seed empty grounded-looking atoms.

5. **Provenance + transient boundary (load-bearing — premortem condition 1).** Web-fetched verbatim model-code text is **transient, review-scoped, attribution-bound**. Do NOT persist it as redistributable `public-free` `code_atoms` in the corpus. Cache for the review with its provenance if you must, but it never enters the catalog as published code; that is the ICC/NFPA-licensed cutover's job. The synthetic `websearch:` ids and a distinct accessPolicy/marker keep it out of the public catalog surface.

6. **Quality gate (premortem condition 2).** Every web-sourced `CodeSectionInput` carries source URL + retrieved-at + edition + confidence. Unconfirmed fetches are flagged `unverified-web-source` and may not be emitted as high-confidence grounded findings. A finding grounded on a web-sourced section must surface its live source in the citation.

Out of scope:

- Any change to the cc-agent-E hauska-engine ICC/NFPA cutover (stays GATED) or the gate->engine wiring (sprint 56).
- Persisting fetched model-code text as published corpus atoms (condition 5).
- The PDF/vision/warmup work already on this branch (done; do not re-touch except where the fallback wiring requires).
- A general web crawler. This is a bounded fetch against the named allowlist for specific code references.

## Acceptance criteria

- A whole-discipline review on engagement `404 Remodel_B` (`15d1d314-c2fa-42d1-81f9-24eb06d94e3d`) grounds the operator's previously-failed items with real fetched text + source URL + retrieved-at + edition: Miami-Dade Chapter 8 HVAC design, NOA/BORA wind-load (FBC M-301.15 + Miami-Dade BORA), balanced return air (FBC-M601.6 / M Ch.4), FBCEB 601.2 valuation, and the electrical/NEC load items (NEC Art. 220 / 408). Where corpus (Municode) already covers a section, corpus wins; web fetch fills the gaps.
- The fetcher refuses wrong-edition / unverifiable results: a forced FBC-2020-vs-2023 or NEC-2017-vs-2020 mismatch returns `verified: false` + `unverified-web-source`, not a confident grounded citation.
- No web-fetched verbatim model-code text persisted as `public-free` corpus atoms (grep the migration/seed paths to prove it).
- `websearch:` citations render their live source URL + retrieved-at in the finding; corpus citations unchanged.
- `pnpm run typecheck` green; `lib/finding-engine` + `lib/codes` tests green; new tests cover the verification/downgrade path and the wrong-edition refusal.
- PR(s) held for operator merge (do not merge). Report branch + SHAs.

## Reporting

At break-point, write to `P:\doc_repo\_inbox\` as `2026-06-08_legacy-design-tools_cc-agent-C_cortex_websearch_code_retrieval.md`. Include: atom/file refs touched, model used (note any escalation off Grok), PR URL(s) + branch SHA, the live run log + at least one web-grounded finding on `404 Remodel_B` showing the source URL + retrieved-at in the citation, proof no verbatim model-code persisted as public-free atoms, the wrong-edition refusal test output, and blockers verbatim.
