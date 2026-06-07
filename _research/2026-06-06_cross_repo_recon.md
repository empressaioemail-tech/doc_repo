---
id: 2026-06-06_cross_repo_recon
title: Cross-repo recon — doc set vs code ground truth (six spine repos)
date: 2026-06-06
status: active
applies_to: portfolio
related: [00_current_state, 00c_portfolio_master_map, 00d_portfolio_roadmap_reference, CLAUDE.md, 50_hauska_mcp_server, 51_substrate_v1_sprint, 14_pricing_framework, 44_mcp_cortex_architecture_map, 80_adrs/adr_017_atom_access_control, 80_adrs/adr_018_atom_contract_substrate_layer]
---

# Cross-repo recon — doc set vs code ground truth

> **Purpose.** A read-only ground-truth pass to find where the doc set has drifted from what the code actually is, and where the roadmap docs disagree with each other. Commissioned 2026-06-06 because several agent waves had landed in product repos since the last current_state regen and the operator wanted a single ground-truth baseline before continuing to build.
>
> **Basis.** Six parallel read-only recon agents, one per spine repo, each establishing ground truth via the authenticated `gh` CLI against live `main` (not from the doc set). Doc-side claims read directly from the canonical docs by the planner. This is the verified topology as of 2026-06-06; it supersedes the corpus and version numbers in [`00c_portfolio_master_map.md`](../00c_portfolio_master_map.md) (2026-06-01 recon), which this pass shows had itself already drifted.
>
> **Status of this doc.** Reference artifact only. Per operator direction (2026-06-06) it records findings and recommends corrections but does NOT modify any canonical doc. The fix pass is deferred. Every "recommend" line below is a candidate edit for a later session, not an applied change.

## Headline

The orientation layer rebuilt from the 2026-06-01 recon (00c, 00d, 03/03a/03b/04) is mostly accurate and internally consistent. Drift is concentrated, not pervasive, and falls in three buckets. The always-loaded `CLAUDE.md` "What is settled" block is frozen around 2026-05-19 and is now wrong on several load-bearing facts; this is the highest-leverage problem because every agent session boots from it. The 2026-06-01 recon itself already undercounts reality, most dramatically on corpus size, and its own section 9 doc-drift correction list was written but never fully applied. And the code is ahead of the docs nearly everywhere: whole capability families have shipped that the roadmap narrative does not fully reflect. Drift is mostly in the good direction (built more than documented), but the numbers and the settled-facts block need a correction pass.

## Per-repo ground truth (2026-06-06)

### hauska-engine

Last push 2026-05-29. pnpm monorepo, root version 0.0.0, no tags. Pins `@hauska/atom-contract@^1.3.0` (PR #65). Four production ingestion adapters: MunicodeHtmlAdapter, ECode360Adapter, RawPdfAdapter, IccCodeConnectAdapter. No federal, parcel, Regrid, Cotality, or hydrology adapters exist anywhere in the tree; those live in cortex-api, confirming the two-engine split.

Corpus is the authoritative artifact: `services/retrieval-api/corpus/snapshot.json` (56.1 MB, `generatedAt: 2026-05-26T17:26:12Z`), parsed directly by the recon. It holds 34 jurisdictions, all `qualityBar: passing`, zero failing, totaling 21,126 atoms (17,799 code-section, 3,257 cross-reference, 36 code-edition, 34 jurisdiction-corpus) and 21,116 links. Only two jurisdictions are public-free: Bastrop TX at 193 atoms on edition `bastrop-b3-code-april-2025`, and Grand County UT (Moab) at 285 atoms. The other 32 are platform-internal. Largest corpora: Austin 2,211, Hutto 1,741, Dripping Springs 954, San Antonio 941. Newer than the README: `packages/workspace` (brokerage V1 property-workspace atom pipeline, PR #65, the newest work) and the Lane A.2 L-surface atom family (PRs #9 to #14). Per REPO_NOTES, production storage (Postgres), real IPFS pinning, IPNS identity, pgvector plus voyage embeddings, and Claude-vision OCR are stubbed or deferred.

Caveat: the snapshot is built from live-source ingests, so a fresh rebuild could yield fewer jurisdictions if upstream sources drift. The committed snapshot is the trustworthy artifact.

### hauska-atom-contract

Last push 2026-05-28. Published and tagged through v1.3.0 (tags v1.0.0 through v1.3.0; package.json at 1.3.0). The contract is framework only: it ships the registration mechanism and runtime, not catalog atom registrations. The core abstraction is a uniform generic `AtomRegistration<TType>` over an arbitrary entityType string; it does not encode a fixed data / skill / execution / actor / intent taxonomy. That tiering is a strategy abstraction in the ADRs, not a structure in the code.

`accessPolicy` is a five-value union: `public-free`, `public-paid`, `platform-internal`, `tenant-private`, `tenant-shared`. The fifth value `tenant-shared` was added in v1.2.0. Two concrete atom families ship as package subpaths: encumbrances (recorded-instrument, restriction-clause, restriction-corpus, administrative-rule, constraint-resolution; ADR-020/021; v1.2.0, PR #1) and workspace (property-workspace, brief-run, workspace-attachment, workspace-share-edge; v1.3.0, PR #2). No open PRs. npm publish is manual.

npm registry presence was not independently confirmed (registry unreachable from the recon environment); repo tags and package.json are the evidence.

### hauska-mcp-server

Last push 2026-05-29 (PR #24). Express plus the MCP TypeScript SDK, Streamable HTTP, stateless. package.json version 0.1.0, no tags, no releases; CHANGELOG is `[Unreleased]` only, so "v1" is a doc label, not a git artifact. Depends on `@hauska/atom-contract@^1.1.0` (type-only).

Forty-six tools, not five. Split: 11 substrate/public, 4 Codex (gated product=codex), 31 Cortex (gated product=cortex, the full L1 to L6 design-accelerator toolchain including deliverable letters with DOCX/PDF render, detail-callout specs, product-spec references). The 00c breakdown of 5+6+18+17 sums to 46 but the category counts are wrong.

Auth header is `X-Hauska-Key`. The ladder: no header maps to free-tier anonymous with product=public; valid shape with a DB miss (unknown key) returns 401; bad shape returns 401; active key buckets by tier and uses the row's product. So "unknown key falls through to public" is incorrect; only the no-header anonymous path is public. Product gating is orthogonal to tier. A `HAUSKA_DEV_MODE=true` path bypasses auth and must stay unset in prod. Deploy target is Cloud Run project hauska-prod, us-central1, with Dockerfile, Cloud Build, six Secret Manager secrets, Upstash rate limiting, and a generated agent-discoverability docs site. Code consistently targets `mcp.hauska.dev`. Live production state at that host could not be verified from the repo (cloudbuild carries placeholder backend URLs filled at submit time; PR #19 claims a 2026-05-21 deploy). No browser-extension public-client-key handling exists in this repo. README is badly stale ("five tools", "deploy to Vercel/Cloudflare"); trust CHANGELOG and source.

### legacy-design-tools (cortex-api)

Last push 2026-06-06. The busiest repo: roughly 80 merges from 2026-05-21 to 2026-06-06, frequently several per day, heavy cc-agent-C activity. pnpm monorepo; the backend is `artifacts/api-server` (~75 route files). Consumes the atom contract as a vendored tarball `vendor/hauska-atom-contract-1.2.0.tgz` (v1.2.0).

The Property Brief is a real shipping feature at `/api/brokerage/v1/brief` and siblings: geocode, resolve jurisdiction coverage, retrieve code-corpus atoms, run the site-context adapter set, generate a reasoning summary plus a lay summary with cited atoms, meter against a wallet/paywall, record GTM telemetry. Backed by `brokerage_brief_runs` and brokerage workspaces (PR #132 added workspaces, wallet paywall, admin graph).

Three doc claims flipped to reality on this repo:

PR #141 (Cotality 8-adapter data-layer pack) is MERGED as of 2026-06-06 22:27, not "held/token-gated." It is merged-but-inert: credentials resolve from env and return null when absent, with Regrid fallback. The OAuth blocker is real, but the code is in main. The 264-test figure is from the PR body and was not independently run.

The atom-contract migration from `@workspace/empressa-atom` to `@hauska/atom-contract` is COMPLETE (PRs #65 and #67, merged 2026-05-22). Zero live `@workspace/empressa-atom` imports remain; only stale doc-comments and generated identifier strings. The "outstanding deferral" in the docs is resolved.

LLM provider drift: the Property Brief generator runs Grok-first (`brokerageBriefLlm.ts`, `propertyBriefLaySummary.ts` branch grok vs a rules-v1 deterministic fallback; no Anthropic path in the brief). Anthropic is used elsewhere (chat, findings, intake, sheet extraction, product-spec recommendations). The "Anthropic in api-server" framing is half-true and misleading on the wedge surface.

Adapter inventory (`lib/adapters/src/registry.ts`): federal (fema-nfhl, usgs-ned, epa-ejscreen, fcc-broadband gated off by default), national (regrid wired and active; cotality plus cotalityExtended, eight adapters built and credential-gated), state (Utah, Idaho, Texas Edwards Aquifer gated), local (Bastrop, Grand County, Lemhi). The Property Brief site-context path uses a restricted set (FEMA, USGS, EPA-EJScreen, Regrid parcels and zoning, optional TCEQ Edwards); it does NOT include Cotality, matching the "Cotality fields not surfaced, license hold" note. The DEM/site-topography spine is merged (USGS 3DEP client, ingest worker, site-topography atom, contour overlays; PRs #98, #101, #107, #117). The hydrology engine proper (D8 drainage, NOAA Atlas 14 rainfall forcing, rainfall sim, site-drainage atom, pysheds sidecar) is NOT in main: it is open PR #142, built in cortex-api (`artifacts/hydrology-worker/`), not in hauska-engine, safe to merge on the native TS fallback with the pysheds sidecar as a tracked fast-follow. Also present: Codex reviewer surface (one-click review, accept/edit/reject, jurisdiction switcher, comment-letter auto-draft; PRs #66 to #72), zero-config public-client-key tier (PR #140), GTM/place observation layer (PRs #130, #134, #135).

### hauska-brief-extension

Last push 2026-05-29. Chrome MV3 extension, manifest version 0.6.5 (package.json stale at 0.5.0). Default backend is cortex-api `/api/brokerage/v1/*`; the direct-MCP path (`mcp.hauska.dev/mcp`) is the fallback/operator path. So the extension bypasses the MCP gate for the consumer path, consistent with 00c. Auth sends `X-Hauska-Install-Id` plus the resolved Hauska key as both `Authorization: Bearer` and `X-Hauska-Key`; the public client key is build-baked via esbuild define and intentionally extractable (rate-limited by install-id plus tier, not treated as secret). Public baked key equals Layer-1 read-only; a user-supplied key unlocks operator tier (share/wallet). GTM telemetry (consent plus events) is wired in the extension.

Only one PR ever merged (PR #1, zero-config consumer UX v0.6.5, 2026-05-29); earlier history is squashed/local-only. No tags, no GitHub releases, no packaged CRX, no store listing. The doc-set "operator extension public prod QA close" claim is not corroborated by any artifact in this repo; the prod code path is built and merged, but release/packaging/QA evidence, if it exists, lives cortex-api-side.

### hauska-sdk

Last push 2026-04-05; dormant for roughly two months, built and parked in a two-day sprint (9 direct commits to main, no PRs). npm-workspaces monorepo, 12 `@hauska-sdk/*` packages all at v0.1.0, one tag v0.1.0. Internally branded "CNS Protocol SDK" throughout (READMEs, EIP-712 domain), a name the doc set does not reconcile.

Crypto rail is real: `packages/payment` does genuine on-chain USDC verification via ethers (fetches the receipt, checks status, parses the USDC Transfer event, matches amount and sender) with hardcoded USDC contract addresses for Base (8453), Ethereum (1), Polygon (137). It is an x402 pull model (verifying a payment the client executed), not an outbound settlement engine. Fiat rail is a Circle stub: `generateFiatCheckoutUrl()` returns a hardcoded placeholder URL with a TODO; the config only allows provider "circle"; there is zero Stripe code in the repo. Revenue routing/splitting does not exist anywhere in packages; the model is single-facilitator-wallet collection. VDA means "Verified Digital Asset" (metadata-only ownership proofs on IPFS, explicitly not tokens/NFTs), which differs from the doc-set gloss "verifiable data asset." npm publish status unverified (registry unreachable); `publish.yml` exists so CI publishing is wired.

## Drift findings: doc claim vs ground truth

Corpus size is the largest single drift. The committed snapshot is 34 jurisdictions / 21,126 atoms (2026-05-26). CLAUDE.md "What is settled" says 698 atoms / 4 jurisdictions. 00c says 2,702 atoms / 5 jurisdictions. The current_state planning carryover still flags "reconcile 2414 vs 698 before external share." All three figures are stale milestone counts. The honest framing is that the corpus grew via the Sync-5 legacy-code migration batch and now sits at 34 jurisdictions / 21,126 atoms, of which only 2 jurisdictions (about 478 atoms) are public-free; the other 32 are platform-internal. Any external-facing number must state the public-vs-internal split rather than a single headline figure.

The CLAUDE.md "What is settled" block, frozen around 2026-05-19, is the highest-leverage target. It is wrong on: atom-contract version (says 1.0.0/1.1.0; actual 1.3.0); accessPolicy cardinality (says four-value union; actual five); fiat rail (says Stripe Connect settled; actual Circle, and the code is a Circle stub with no Stripe anywhere); corpus count (says 698/4; actual 21,126/34); and the cortex-api atom-contract migration (calls it "the one named deferral"; actually completed 2026-05-22). Because every agent session and every dispatch boots from this file, the staleness propagates downstream.

Other doc-vs-code gaps: docs frame the Cortex product LLM as Anthropic; the wedge Property Brief actually runs Grok-first with a rules fallback. Docs say PR #141 is held; it merged today. Docs imply hydrology work targets hauska-engine; it is being built in cortex-api (PR #142). Docs describe the MCP server as a small substrate read layer; it is a 46-tool three-product gated platform. Docs imply the SDK carries revenue routing; that code does not exist.

## Internal contradictions: doc vs doc

CLAUDE.md "What is settled" contradicts the 2026-06-01 orientation layer (00c, 00d) on corpus count, fiat rail, atom-contract version, and migration status; CLAUDE.md is the frozen party each time.

00c contradicts itself on the SDK: section 1's repo table calls payment "crypto+fiat, real (not stubbed)," while section 7 correctly calls the fiat side "a placeholder checkout function." The section 1 line overstates; the recon confirms fiat is a stub.

00c section 9 listed six doc-drift corrections on 2026-06-01 and they were not fully applied. Items still open: 5 (Stripe to Circle in 14_pricing_framework, 74_commercial_agreements, and CLAUDE.md), 6 (corpus count, now understated even relative to 00c's own 2,702), and 1 (the 44_mcp_cortex_architecture_map refresh).

The two external-facing docs (HAUSKA_COMMERCIALIZATION_VISION.md, HAUSKA_INVESTOR_BRIEF.md) were not read in this pass but, per the current_state carryover note, likely carry the dead 2414/698 figures. They are the highest-stakes place for a stale number and should be checked before any external share.

## Recommended corrections (deferred; not applied)

In priority order, for a later fix session run through plan mode:

1. Rewrite the CLAUDE.md "What is settled" block to current ground truth: atom-contract 1.3.0, five-value accessPolicy, Circle (not Stripe), corpus 34 jurisdictions / 21,126 atoms with the public-vs-internal split, cortex-api migration done, Property Brief on Grok-first. Highest value because it is loaded every session.
2. Refresh 00c to 2026-06-06: corpus number, the 11+4+31 tool split, the PR #141-merged and PR #142-open state, and resolve the section 1 vs section 7 SDK-fiat contradiction. Then close 00c's own section 9 items 1, 5, 6.
3. Reconcile the corpus figure to one number with the public/internal split stated, everywhere it appears, including the two external-facing docs before any investor share.
4. Update 44_mcp_cortex_architecture_map, and 14_pricing_framework plus 74_commercial_agreements for the Circle rail.

## Uncertainties

npm publish presence for `@hauska/atom-contract` and `@hauska-sdk/*` was not confirmed (registry unreachable from the recon environment); repo tags and package.json are the evidence. Live production state at mcp.hauska.dev and the deployed `BRIEFING_LLM_MODE` were not observed (read-only static pass; no live endpoint hits, no test suites run). Test-count figures (264 adapter tests, 227 MCP tests) are from PR bodies, not independently executed. The corpus count is the committed snapshot; a live rebuild depends on upstream sources still resolving. PR #142 was open at report time and could merge imminently given velocity; verify before relying on its presence in main.

## Revision history

- **2026-06-06 (origin):** Built from six parallel read-only recon agents against the live spine repos. Captures verified per-repo ground truth, doc-vs-code drift, and internal doc contradictions. Records but does not apply corrections, per operator direction. Supersedes the corpus and version figures in 00c (2026-06-01), which this pass shows had drifted.
