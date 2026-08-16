---
id: rd_dt_06_the_move
title: The move — build issuer twins, serve them over MCP, let agents find them
status: active
last_updated: 2026-08-16
applies_to: portfolio
owner: nick
related: [rd_dt_05_securities_pivot, rd_dt_04_gtm_capture_plan]
purpose: The concrete opening move, confirmed with Nick 2026-08-15. Issuer twins of public companies built from public disclosure, served agent-native over MCP, discoverable in the MCP ecosystem. The claim motion follows agent traffic.
---

# The move

> **THREE CORRECTIONS, 2026-08-16,** from the source read recorded in doc `08`. Read them before
> acting on the numbered move below.
>
> 1. **The EDGAR adapter is not new.** It exists at `apps/cockpit/backend/app/providers/edgar.py`,
>    406 lines, and filings are already atomized into the spine via `capture_filing_atom`. What is
>    missing is document-body fetch, which is an extension to a running provider.
> 2. **Public filings and issuer material share one room.** Step 5 below implies two stores. The
>    Smart Files schema says otherwise: filings are file atoms, and compiled-public versus
>    issuer-verified is `access_policy` plus provenance resolved at read time.
> 3. **The cohort is not all issuers.** The chosen cohort is the cockpit trade grid, where fourteen
>    of eighteen symbols have no issuer, no CIK, and no filings. The twin is keyed to the node and
>    the room to the authority; issuer is one authority class, not the premise.
>
> Doc `08` is the executable plan. This doc remains the statement of the move.

**Build the twins. Serve them over MCP. Make them findable. Let the claim motion follow the traffic.**

1. **Pick the first cohort** - 10 to 25 public companies, not an index. Selection logic: a coherent sector plus a handful of crypto-native issuers (the audience that notices first). Eval-gated like jurisdictions: a cohort member is "loaded" when an agent answers issuer questions better from the twin than from raw EDGAR, measured.
2. **The EDGAR adapter** - the corpus machine's pattern applied to filings. Filings are structured authority documents; the adapter contract (discover/fetch/metadata/normalize) fits 10-K/Q, 8-K, proxies, IR pages the way it fit Municode and eCode360. Atoms carry provenance (filing, date, section), honest absence ("not disclosed by issuer"), and the read-contract. XBRL financials ingest as the structured layer; the twin's value is everything above them.
3. **Serve agent-native** - an issuers gate on the MCP stack (adding a product gate is a known ~5-file operation): search_issuers, get_issuer_twin, issuer state and filing atoms with provenance on every answer. Layer 1 free and anonymous-OK (it is public data - the tier model applies cleanly); metered depth behind keys.
4. **Make it findable** - this is the distribution: the MCP registries and directories agents actually browse, agents.txt and llms.txt (the gate already ships these surfaces), developer docs, the manifesto and comment letter pointing at it. Usage telemetry becomes the proof artifact and the sales pressure.
5. **The claim motion** - unclaimed twins say "compiled from public filings; not issuer-verified." Issuer claims their twin, verifies, enriches with the data room only they hold (Smart Files). The verified-issuer mark is the product; agent traffic is the sales force.

**Scope discipline:** cohort of 10-25, one adapter, one gate, eval-gated - the jurisdiction-onboarding playbook with tickers instead of FIPS codes. Not the S&P 500 on day one.

**Gates that ride along:** boundary opinion (state-not-value, sharper with tickers involved), Hullihan publication-bar answer, Reg-FD comfort note (public-to-all-simultaneously serving is the safe posture and the design anyway).

**The assembly (Nick, 2026-08-15, same discussion): take Smart Files, marry it with the trading application's current setup, and make an MCP server servicing all of it.** The composition map:

| Component | Supplies |
|---|---|
| The cockpit (empressa-trading) | securities identity (security-master graph), the provenance spine (bitemporal atoms, verified-absence, Merkle anchoring), the reconcile/attestation mechanism, market-data plumbing, the rights-clean licensing gate |
| Smart Files | the room: issuer documents with provenance, access passes, watermarks, audit chains - and the claim/enrich surface where issuers add what only they hold |
| New MCP server | the one agent door servicing all of it: issuer search, twin reads, pass-gated document access, the attestation feed - built on the known gate pattern (auth ladder, metering, provenance envelope) |
| EDGAR adapter (new, bounded) | the public-disclosure feed that populates unclaimed twins |

Seam note: the cockpit spine is Python, Smart Files rides the TS contract side - no merge required. The MCP gate FANS OUT to both backends, exactly the hauska-mcp topology (one gate, multiple upstreams). This is composition of running systems plus one adapter and one gate, not a build.

**Open:** Magma partnership shape (Nick to supply); cohort selection; whether the demo video's subject becomes an issuer twin (an agent underwriting a listed company live is arguably a stronger exhibit than a parcel).
