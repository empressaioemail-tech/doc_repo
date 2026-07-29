---
id: 2026-07-29_icc_verification_state
title: ICC integration — verified live state (agent said done; verification found the compliance defect)
date: 2026-07-29
status: reference + ACTION FLAG (a latent license exposure to fix)
owner: nick
verified: read across hauska-engine + hauska-mcp-server + legacy-design-tools + PE + @empressaio/atom-contract, NOT the agent's report
related: [75n_icc_code_connect_catalog, 2026-07-29_mcp_audit_pe_stack_gap, 25b_monetization_provenance_storage_stack, _prospects/icc/hauska_icc_partnership_brief]
---

# ICC integration — verified state

The agent's "done" claim was ~half true. Engine ingest is REAL; the license-core content controls (no verbatim, deep-link, purge-traceability) HOLD. But the single most license-critical control — accessPolicy platform-internal on ICC content — is WRONG.

## THE ACTION FLAG — latent license exposure (fix before the demo / before any broader serving)
- ICC code-section atoms carry NO accessPolicy (the code-atom schema has no such field).
- The ingest tool HARDCODES accessPolicy "public-free" on the ICC jurisdiction-corpus + jurisdictionStatus atoms (icc-model-code-ingest.ts:110,128) — the OPPOSITE of the required pre-SaaS platform-internal posture.
- NO ACTIVE customer leak today: the MCP gate withholds ICC from anonymous callers via an INCIDENTAL default (absent-policy + has-tenant -> tenant-private, access-policy.ts:44-49). Compliance rests on an ACCIDENT, not an explicit stamp.
- RISK: if anything stamps these public-free (the ingest tool already does for corpus/status), or a consumer reads via a path applying the `?? "public-free"` default, ICC content serves anonymously = LICENSE VIOLATION. Plus a minor ACTIVE leak: icc-model-code appears in anonymous list_jurisdictions (name+count, no body) because its status atom is public.
- FIX: add accessPolicy to the code-atom shape; stamp ICC content platform-internal at source; change the ingest tool's hardcoded public-free for ICC jurisdiction/status.

## DONE (real, committed, compliant)
- Live ICC Code Connect adapter (OAuth against api.iccsafe.org, contract-verified 2026-07-05).
- REAL IBC 2018 corpus: 4,825 code-sections + 3,904 cross-refs committed. (IPMC = 0 sections, empty-body upstream — chase before demo.)
- VERBATIM-TEXT COMPLIANCE clean end-to-end: extractor discards verbatim, stores reasoning-layer only (max ~600 chars) + deep-link to ICC official viewer; 0/4,825 leaks. Enforced by code.
- WIND-DOWN traceability: every ICC atom tagged sourceAdapter=icc-code-connect + jurisdictionTenant=icc-model-code (purge selectors); actor fixture purgeOnWindDown:true.
- COMPLIANT citation path in cortex/reports (deep-link display, platform-internal, snippet cap).
- ICC SOURCE-ACTOR identity EXISTS in @empressaio/atom-contract (ICC_ACTOR_RECORD_FIXTURE: did:hauska:actor:org:icc, licensed-source, platform-internal, meterFreeTier, purgeOnWindDown, derivedOk:false).
- INBOUND per-reference METER LIVE on the MCP read path (source-obligation-meter.ts) — accrues per ICC-atom reference, free tier included, append-only ledger (migration 009). More built than the catalog claimed.
- PE ICC citations DELIBERATELY gated OFF (VITE_ICC_CITATIONS_ENABLED) — correct pre-SaaS; this is the operator's on/off switch, half-built.

## NOT-DONE (demo gaps)
- Per-reference RATE unset (meter records pending-rate/null — "counted, provably" yes; "dollars owed" no).
- CONTENT->ACTOR REFERENCE missing: ICC atoms don't carry sourceActorDid + book-ID/section; the meter relies on detection HEURISTICS (allowlist/regex) not a hard reference. For an audit-grade demo, wire the explicit reference (also serves purge).
- IPMC 2018 (2nd PoC book) = zero sections — chase the empty-body/entitlement issue.
- OUTBOUND revenue-share on paid ICC-cited reports (RevenueRouter / SourceActorReference placeholder) not built.

## DEMO-READINESS (one line)
Wire the ICC actor-record into the engine so content atoms REFERENCE it (book-ID+section), STAMP accessPolicy platform-internal on ICC content, SET a per-reference rate on the fixture — then the meter shows real accruals against a real identity with real provenance. Plus the CC usage screen (the ledger has the data) + the on/off switch (half-built). Then the "metered, paid, purgeable off one identity, provably" story is demoable.

## ICC + MCP CONVERGENCE
The metering pipe is real BOTH ways (outbound SDK charges agents; inbound ICC ledger accrues). The ICC demo forces exactly the fixes (accessPolicy, content->actor ref, rate) that make MCP monetization auditable. One set of fixes, two payoffs. The on/off switch = (a) fix the compliance stamp so ON is safe + (b) build the CC usage screen.

## RECOMMENDED SEQUENCE (operator decision)
1. Fix the ICC accessPolicy exposure (latent license risk on an accident; contained; do regardless).
2. ICC demo package: content->actor ref + per-reference rate + CC usage screen + on/off switch (mostly built) -> unlocks the SaaS agreement / real revenue.
3. MCP front-door + visual (geocode + facets + discovery + server-side renderer), monetized through the now-correct pipe.
