---
id: rd_dt_08_build_scope
title: Build scope — the instrument twin, R&D program baseline
status: active
last_updated: 2026-08-16
applies_to: portfolio
owner: nick
related: [rd_dt_05_securities_pivot, rd_dt_06_the_move, rd_dt_07_research_funnel, _decisions/2026-08-15_digital_economies_session_rulings, _decisions/2026-08-15_smart_files_module_identity, 90_operations/OPS-17_govtech_stack_plan_of_record, 90_runbooks/AGENT_CONTRACT]
purpose: The executable build scope for the instrument twin, written for handoff to a planning agent. Records Nick's 2026-08-16 framing rulings, the verified inventory across three repos, three corrections to docs 06 and 07, the twin read contract strawman, and twenty-six numbered work rows with pass/fail instruments. The human door is a standalone surface and a client of the twin API, per the 2026-08-16 re-ruling recorded in amendment A-1. Also records that this is Smart Files' SECOND consumer and therefore its first real generalization test. Structured as a plan of record but NOT registered in _catalog/plan_registry.json; promotion to OPS-18 is an open operator call recorded at the foot of this doc.
---

# Build scope: the instrument twin

## What this document is

A baseline for handoff to a planning agent. It is written in the shape OPS-16 and OPS-17 proved, with numbered rows carrying pass/fail instruments, because this repo has a measured base rate where prose-shaped controls fail and structure-shaped controls hold.

It is deliberately **not registered** in `_catalog/plan_registry.json`. Registering it would create a third concurrent program alongside OPS-16 and OPS-17, and the focus-queue rule requires naming what gets queued to make room. That call is Nick's and is recorded in the open calls at the foot. Until it is made, the `TW-` rows below are R&D work rows, not dispatchable PLAN-ROWs, and a planning agent cannot compile a dispatch against them.

## The frame Nick set

This is a continuation of the trading platform with Smart Files bolted on for publicly available company documentation, plus one MCP server. It is not a new product build. What exists is a starting point rather than a restriction, so new data sources and new components are in scope where the existing substrate does not reach.

Five framing rulings from 2026-08-16. The R&D cohort is the cockpit trade grid, chosen because its mix of products tests the shape against the wider financial universe rather than against equities alone, with the scaffolding correct first and a handful of instruments run through it. Smart Files is mounted, never merged. The agent door is a new MCP server under Empressa on GCP, and it does not live on the cockpit. The human door was first ruled as a new subtab in the cockpit's research tab and was re-ruled the same day as a standalone surface; see the section below and amendment A-1. The fourteen non-issuer instruments in the grid are inside the R&D scope, not deferred.

## The standalone surface (ruled 2026-08-16)

The human door is a standalone deployment, not a subtab in the cockpit, for now and with the migration cost accepted.

What it is: a small surface, two views to start, that is a human interaction with the MCP data. An instrument view and a search or browse view. It is a client of the twin API and renders nothing the agent door does not return.

Why standalone. The reasons that kept the agent door off the cockpit apply unchanged to a public research UI: the cockpit carries broker connections, billing, and staged trades, and the twin surface serves public-tier research. The claim motion also needs a destination, and an issuer's investor-relations team cannot be sent to a tab inside a Clerk-gated brokerage cockpit. And the flow is being rethought, which is far cheaper on a new surface than inside the existing focus shell.

**The market-structure layer ships as data, not as rendering.** The cockpit already computes and stores zone atoms, regime, and microstructure. Those are structured state. The twin serves them; the standalone surface consumes them; nobody draws a chart. Charting stays where it is built, and the expensive part of that layer is therefore not on this program's critical path at all.

**The merge point is execution.** At some point this surface and the cockpit converge, because a research funnel that cannot place a trade is half a product, and Clerk is what that convergence is for. That is logged as future direction, not scoped here, and the additional migration work it implies is accepted rather than designed around.

## Definition of done for the R&D phase

All eighteen trade-grid instruments resolve to a twin that returns the declared contract, with every layer either populated from a named authority or returning a typed absence with stated scope. The agent door serves that contract with provenance on every response and access policy enforced. The human subtab renders one instrument of each of the three shapes including its absences. An eval, threshold declared before running, shows an agent answering instrument questions better from the twin than from the raw sources.

A row graded by narration or by doc assertion fails. Every row re-grades only by its named instrument.

## Governing rules

`90_runbooks/AGENT_CONTRACT.md` is the operative law for lane behaviour and is not restated. Seven rules govern here specifically.

1. **No silent substitution.** No layer may return another node's data as if it were this node's. A proxy is permitted only when it is marked as a proxy and carries its own provenance. This rule exists because the current implementation violates it, per the drivers finding below.
2. **Absence is typed, never empty.** Every layer that can be absent returns a verdict of `absent-verified` or `lookup-failed` with the scope that was searched. An empty array is not an answer.
3. **The contract is declared before it is served.** Row TW-2 blocks the agent door and the human door. A shape discovered by building the UI is the failure mode this rule prevents.
4. **Research is read-only about the world; execution is authenticated and lives in the cockpit.** This is the boundary, not "the cockpit holds credentials." The standalone surface and the agent door serve state about instruments. The moment an intent becomes an order, it is cockpit territory behind Clerk. Ruled 2026-08-16.
5. **The human door renders only what the agent door returns.** The standalone surface is a client of the twin API, not a parallel implementation over the same upstreams. This makes two-door parity structural: provenance and typed absence cannot be dropped in the UI, because there is nothing else to render. Ruled 2026-08-16.
6. **Gate what you SERVE, never what PROVES you.** Content endpoints require credentials. Verification endpoints must not. The Merkle-anchor verifier is reachable anonymously by design, because `02_cockpit_precedent.md` states the proof surface as "attestations verifiable without trusting us", and verifiable-without-trusting-us means reachable without our credential. Gating a verifier inverts the tamper-evidence claim the product rests on. Found 2026-08-16 when a planner dispatch wrongly named `GET /spine/anchor/verify/{atom_id}` for gating and the executor pushed back from the docstring and `ANCHORING_REPORT.md`. Reverted, and pinned by a test that fails if the verifier ever requires a credential.
7. **Smart Files is refined, never forked.** This is its second consumer. Anything this build needs that the store does not have goes back into the store as a general change, or gets ruled as genuinely consumer-specific. A private shadow copy of documents inside the cockpit is the failure this rule prevents.

## What the cohort forces

The trade grid is eighteen symbols across five asset classes, and it is three different disclosure shapes.

| Shape | Symbols | Issuer | CIK | What publishes authoritative state |
|---|---|---|---|---|
| Operating company | NVDA, AAPL, MSFT, TSLA | yes | yes | SEC: 10-K, 10-Q, 8-K, DEF 14A, Form 4 |
| Fund | SPY, QQQ | trust | yes | SEC: N-CSR, N-PORT, prospectus; sponsor daily holdings |
| Contract | /GC, /SI, /ZB, /ZN, /ZT, /CL, /NG, /RB, /M6E, /M6B, /M6A | none | no | CME contract specs, CFTC Commitments of Traders, EIA inventories, Treasury issuance, delivery and warehouse stocks |

Doc 07's funnel assumes an issuer. Fourteen of eighteen have none. The market-structure layer already computes on all eighteen today. So the node layer generalizes and the room layer does not, and that asymmetry is the research question: what is the data room when there is no issuer.

The working answer this scope adopts is that **the twin is keyed to the node and the room is keyed to the authority**, not to the asset class. Every instrument has some body publishing authoritative state about it. For an operating company that is the SEC and the issuer. For crude it is CME for the contract, CFTC for positioning, EIA for inventories. This is the same adapter contract already run against jurisdictions, where the parcel never cared who published, only that an authority existed and carried provenance. Issuer becomes one authority class rather than the premise of the design.

The consequence is that honest absence is load-bearing on day one. A gold twin returning "no issuer disclosure exists for this instrument class, and here is what does exist" is correct. A gold twin that silently substitutes something else is the failure the doctrine exists to prevent.

## Three corrections to docs 06 and 07

**The EDGAR adapter is not new.** Doc 06 lists it as a bounded new build. It exists at `apps/cockpit/backend/app/providers/edgar.py`, 406 lines, running against the SEC submissions JSON, the RSS feed, and the bulk submissions archive, with the fair-access User-Agent and rate limiting handled. Filings are already atomized: `capture_filing_atom` is called from `app/jobs/temporal_capture.py` and `app/jobs/base_library_backfill.py`, and `app/spine/atom_context.py` ranks `filing.` atoms above news when composing copilot context. What it does not do is fetch document bodies. `fetch_recent_filings` returns form type, filing date, accession number, and the name of the primary document, so the spine knows a 10-K was filed and can cite it, but nothing can answer a question from inside it. That gap is where Smart Files mounts, and it is an extension to a running provider.

**Public filings and issuer material share one room.** Doc 06 implies two stores. The Smart Files schema contradicts it: versions carry `provenance jsonb NOT NULL` alongside a `content_cid`, and documents carry the same five-value `access_policy` union as the atom contract. Filings are file atoms. The separation between compiled-public and issuer-verified is `access_policy` plus provenance resolved at read time. A compiled 10-K is `public-free`; what the issuer adds on claim is `tenant-private`. This is Nick's correction and it makes the mount smaller.

**The people roster has a running implementation.** Doc 07 treats officers and directors as a new adapter. The pattern is built in atx-bulls and needs porting rather than designing.

## The Bulls pattern ported to officers and directors

`atx-bulls/src/lib/db/schema.ts` runs a node, edge, atom, and atom-event graph. Nodes carry `kind`, `display_name`, `trust_level` defaulting to `unverified`, and an `email` identity key, and the table is not tenant-scoped, making person identity platform-global per ruling 5. Edges are tenant-scoped and typed, carrying `started_at`, `ended_at`, `status`, and attributes. Atoms are tenant-scoped and append-only, carrying `atom_type`, `access_policy`, a body, flattened provenance as `source_kind`, `recorded_by`, `recorded_at`, `source_ref`, and a `superseded_at` that is set rather than deleted.

| Bulls | Issuer roster |
|---|---|
| Person node, platform-global, email as identity key | Officer or director node, platform-global. A director sitting on four boards is one node. |
| `trust_level` moving from unverified to verified | The claim motion, already typed against the contract. Compiled from DEF 14A versus claimed and verified is a field that exists. |
| Edges with `started_at` and `ended_at` | Board tenure read out of proxy statements. Temporal edges are the right shape for a seat. |
| Atoms with flattened provenance and `superseded_at` | Role atoms, compensation atoms, Form 4 transaction atoms, each citing filing and date. |
| Consent grants, magic-link tokens, `person-session.ts` | The claim path for a person, running today. |

Platform-global person identity gives a cross-issuer board and insider graph as an edge query rather than a feature build, which is sold as premium capability in the Form 4 vendor market. Bulls edges are tenant-scoped, which is correct for a team and wrong for public filings, so public roster edges need to be platform-global or `public-free`. That is row TW-16 and it is the one genuine porting decision rather than a copy.

## The Smart Files mount

The store shape is already right. Identity is `smartfile:<scopeType>:<scopeId>:<docSlug>`, documents carry access policy and a current version, versions are append-only with provenance and a content identifier, and placements reference the document rather than a version. A `smart_file_absence_determinations` table records a verdict of `absent-verified` or `lookup-failed`, so the store already distinguishes "we looked and it is genuinely not there" from "we could not look." That is exactly what a contract twin needs to state the absence of issuer disclosure as a fact.

Two enum widenings are required, each a CHECK constraint plus the corresponding array in `src/identity.mjs`, plus a validator for the new scope identifier since `jurisdiction` identifiers are validated as numeric FIPS.

```
scope_type    'jurisdiction' | 'tenant' | 'site'                    -> add 'instrument'
target_type   'folder' | 'parcel' | 'project' | 'asset'             -> add 'instrument'
              | 'permit' | 'meeting'
```

### This is Smart Files' second consumer

Nick's note, 2026-08-16: the app being built in parallel is the first consumer of Smart Files, and this build is the second. That reframes the mount rows. They are not only a bolt-on for this product, they are the first real generalization test the store gets, and both consumers are chances to refine it.

The first consumer is **Plan Review**, per `_STATE.md` as of 2026-08-16 (OPS-17 row G-60, amendment A-027). It is already in production at `plan-review-00002-nbr` in GCP project `plan-review-505715`, calling the files service over `SMART_FILES_BACKEND_URL`, with live documents at identifiers of the form `smartfile:tenant:icc-demo:site-plan-sheet.txt` and folders at `folder:tenant:icc-demo:plan-review-48021-28286`. So the first consumer uses `tenant` scope, which means the `instrument` scope proposed in row TW-1 will be the third scope type in use and the first one whose identifier is not a tenant slug or a FIPS code. That is the sharpest single test of whether the scope-and-validator design generalizes.

A second consumer is the only thing that reliably separates a general store from a store shaped by its first customer. Three tells are already visible in the schema and this build will press on all of them.

`smart_file_documents` carries a `jurisdiction_fips` column alongside the generic `scope_type` and `scope_id`. That is a first-consumer artifact sitting in a table that claims to be general. An instrument-scoped document has no FIPS, so either the column is nullable and vestigial, or it wants to become a typed scope attribute.

The `target_type` enum is entirely property and govtech shaped: parcel, permit, meeting, project, asset. None of those is wrong, but the list is a census of one consumer's world rather than a designed vocabulary. Adding `instrument` is the cheap move; the question worth asking once is whether placement targets should be an open reference to a node identifier rather than a closed enum that every new consumer must widen.

`scope_type` is validated per-type in `identity.mjs`, with `jurisdiction` requiring numeric FIPS. Each new scope brings its own validator, which is correct, but it means the validator table is the real extension point and should be treated as one.

None of these is a blocker and none should be fixed speculatively. The discipline is that when this build hits one of them, the finding goes back to the store rather than around it, and the two consumers reconcile rather than diverge. Row TW-23 exists to make that a deliverable instead of a good intention.

The coordination hazard is real and named in the open calls: two consumers landing migrations against one store concurrently. The parallel app's lane and this one need one ordering, not two.

## Recommended scope identifier (row TW-1, unratified)

```
smartfile:instrument:<node_id>:<doc_slug>
```

Keyed to the cockpit security-master node identifier, with `instrument` as both the scope type and the placement target type.

It covers all eighteen grid symbols where CIK covers six. It mirrors what Bulls proved, where the node identifier is identity and email is merely the identity key for one node kind, so CIK, ticker, CUSIP, ISIN, and CME root all become identifiers hanging off the node and resolve through the identifier index the security-master already runs. Every external key is unstable in its own way: tickers get reused and reassigned, CIKs survive reorganizations badly and do not exist for contracts, and CUSIP and ISIN are licensed, which would put a vendor license inside a primary key. Smart Files' inherited constraint 6 argues the same way, since a shape must be declared and never reconstructed from parts, and a node identifier cannot be reconstructed, which forces resolution through the security-master where merge links already handle two nodes turning out to be one instrument.

The scope type should be `instrument` rather than `security`. A futures contract is not a security; it is a commodity derivative under CFTC jurisdiction. Encoding `security` would write a legal category error into a CHECK constraint on a product whose pitch is provenance discipline.

The cost is a resolve hop, since an agent asking by ticker needs ticker-to-node resolution first. Doc 06 already planned `search_issuers` for this, and the hop is the better shape regardless because it makes ambiguity explicit instead of guessing.

## The drivers finding

`apps/empressa/frontend/src/types/futures.ts` carries `FUTURES_FUNDAMENTALS_PROXY`, documented as "Equity / ETF tickers whose fundamentals best proxy a futures root. Used by the Drivers tab when the active symbol is a contract." It maps /GC to GLD, /CL to USO, /ZB to TLT, /M6E to FXE, and so on.

As trader convenience that is defensible. As a disclosure twin it is the exact substitution governing rule 1 forbids, because it presents an ETF's fundamentals as the contract's fundamentals. Crude is the sharpest case, since USO's roll and tracking behaviour is a well-documented reason it is a poor referent for the underlying.

The twin work finishes this surface rather than replacing it. The surrogate is swapped for real authority feeds; where no authority exists the twin says so; and the proxy may survive if it is marked as a proxy and carries provenance, which is strictly more honest than what ships today.

The substrate for the replacement is already in the cockpit. `apps/cockpit/backend/app/data/econ_catalog.json` is a curated driver registry with eight groups and dozens of indicators, each carrying source, series identifier, transform, units, decimals, a blurb, and a release match string. Its only source today is FRED. Adding CFTC, EIA, CME, and Treasury rows alongside the FRED rows, plus a driver-to-instrument linkage, extends a pattern rather than inventing one, which makes the futures side materially cheaper than a blank-page adapter build.

One caveat. `Drivers.tsx` and `types/futures.ts` live in `apps/empressa`, which the repository README describes as retired and kept for reference only. The econ catalog is in the cockpit. The idea and the substrate are live; the drivers UI is not. Whether the new subtab absorbs that surface or rebuilds it is row TW-21's open question.

## The twin read contract (strawman for row TW-2)

Not the deliverable. A starting shape so the planning agent has something to attack rather than a blank page.

```
Twin {
  node       { id, kind, displayName, assetClass,
               identifiers[ {scheme, value} ] }         # ticker, cik, cusip, cmeRoot
  shape      "operating-company" | "fund" | "contract"
  authorities[ {authority, role, coverage, lastObserved} ]
  room       { documents[], absence }                   # Smart Files, instrument-scoped
  roster     { people[], edges[], absence }             # company and fund shapes only
  drivers    { series[], proxies[], absence }           # econ catalog + new sources
  market     { zones, regime, microstructure, absence } # cockpit, all eighteen
  synthesis  { text, citations[ atomId ] }
  provenance { generatedAt, contractVersion, sources[] }
}

Absence { verdict: "absent-verified" | "lookup-failed",
          scopeSearched, determinedAt, basis }
```

Three invariants the contract must carry. Every layer can return `Absence` and none may return an empty array in its place. Every entry in `drivers.proxies` carries an explicit proxy marker and its own provenance. Every number appearing in `synthesis.text` traces to an atom identifier in `synthesis.citations`, per the adaptive-panel discipline the cockpit already enforces.

## Repo map

| Repo | Role | Rows |
|---|---|---|
| `empressa-trading` | node and identity, spine, market structure, synthesis, EDGAR provider, econ catalog, human subtab | TW-3, TW-5, TW-9, TW-10, TW-12, TW-17, TW-18, TW-21 |
| `smart-files` | the room: enums, identity validator, document and version writes. **Second consumer**, so also the generalization test | TW-4, TW-6, TW-8, TW-11, TW-23 |
| new Empressa union repo | the twin API and MCP door, fanning out to both upstreams, holding no store | TW-19, TW-20 |
| new standalone surface | the human door, two views, client of the twin API only | TW-21 |
| `atx-bulls` | read-only reference for the roster pattern; not modified | TW-14, TW-15, TW-16 |
| `doc_repo` | decision records, this baseline | TW-1, TW-2, TW-16, TW-22 |

## Work rows

Layers are ordered by what blocks what, not by subject. L1 foundation, L2 acquisition, L3 integrity, L4 depth, L5 surface.

| ID | L | Work item | Pass/fail instrument | Blocked on |
|---|---|---|---|---|
| TW-1 | 1 | Ratify the instrument scope identifier and scope-type name | Decision record filed in `_decisions/`; the string appears verbatim in the smart-files validator | none |
| TW-2 | 1 | Declare the twin read contract. **v0.1 APPROVED 2026-08-16, filed at `09_twin_read_contract.md`** | Machine-readable schema committed matching the approved doc; one fixture per shape validates in CI; no schema field exists that the implementation cannot serve at its declared version | TW-1 |
| TW-3 | 1 | All eighteen grid instruments resolve in the security-master | SQL: eighteen distinct nodes; ticker and CME root both resolve; no duplicate node for one instrument | none |
| TW-4 | 1 | Smart Files enum widening plus instrument scope validator | Migration applied to the smart-files Neon branch; `identity.test.mjs` green; round-trip write and read of one instrument-scoped document over the HTTP API | TW-1 |
| TW-5 | 2 | EDGAR document-body fetch extending `edgar.py` | For each of the four operating companies, the latest 10-K primary document is retrieved and byte-identical to the SEC copy | none |
| TW-6 | 2 | Filings land in Smart Files as instrument-scoped `public-free` file atoms with placements | SQL: N documents at `scope_type='instrument'`, each with non-null provenance and at least one placement; each readable via `GET /api/smart-files/files/:entityId` | TW-4, TW-5 |
| TW-7 | 2 | EDGAR nightly freshness on a non-datacenter host | `gs://empressa-sec` object timestamps inside 48 hours on two consecutive days; a non-AAPL symbol shows fresh `filing.` atoms | none |
| TW-8 | 2 | Fund shape: N-PORT, N-CSR, prospectus, sponsor holdings for SPY and QQQ | Same instrument as TW-6 for both funds, plus one holdings snapshot atom carrying as-of date and source | TW-6 |
| TW-9 | 2 | CME contract specs and CFTC Commitments of Traders behind the econ-catalog pattern | All eleven futures roots resolve to a contract-spec record and a COT series; every new catalog row carries source, series identifier, transform, and units | TW-3 |
| TW-10 | 2 | EIA for /CL and /NG, Treasury for /ZB /ZN /ZT | Each named symbol carries at least one non-proxy driver series with provenance | TW-9 |
| TW-11 | 3 | Honest absence wired through the twin read | `get_twin` for a futures root returns typed issuer-disclosure absence with stated scope; a company missing a form returns `absent-verified`; a failed lookup returns `lookup-failed` and never the former | TW-2, TW-6 |
| TW-12 | 3 | Retire silent proxy fundamentals | No code path returns proxy fundamentals without a proxy marker and provenance; a test asserts it and fails when the marker is stripped | TW-2 |
| TW-13 | 3 | Access policy enforced on the twin read | Unauthenticated call returns only `public-free` content; a negative test asserts `tenant-private` content is unreachable without a key | TW-2 |
| TW-14 | 4 | Roster port, **company shape only at v0.1**: officer and director nodes, tenure edges, role atoms from DEF 14A. Fund roster is v0.2 and is not approximated from this shape | For the four companies, board and officer rosters present with tenure edges; a person appearing at two issuers is one node, asserted by SQL | TW-3, TW-16 |
| TW-15 | 4 | Form 4 insider transaction atoms | Transaction count for a named window reconciles to the SEC count for the same window; each atom carries filing accession and date | TW-14 |
| TW-16 | 4 | Rule and implement public roster edge scoping, platform-global versus `public-free` | Decision record filed; the implementation matches it; a cross-issuer board query returns without a tenant context | TW-1 |
| TW-17 | 4 | **Computed-global** market state, `market.computed` at contract **v0.2**: regime, crossover, heatmap. v0.1 serves `market.quotes` only, which is anonymous-reachable today. No rendering, no chart code moved | `market.computed` populated for all eighteen where computed, typed absence where not; the response carries no presentation payload and no user-authored content; the v0.1 schema does not contain the field | TW-2, TW-24 |
| TW-18 | 4 | Synthesis over the full funnel | Every number in the synthesis text traces to an atom identifier in citations; a test fails on an uncited number | TW-11, TW-17 |
| TW-19 | 5 | **The union layer.** Twin API plus MCP door on Cloud Run: resolve, twin read, non-persisting document pass-through, roster, drivers, market, attestation feed. Fans out to the cockpit and Smart Files; holds no store | Live introspection lists the tool set; every response carries the provenance envelope; a malformed key returns 401 and never falls through to public; no persistence layer exists; **the deploy workflow passes `--service-account smart-markets-run@smart-markets-118998.iam.gserviceaccount.com` in the workflow FILE, verified by `gcloud run services describe --format='value(spec.template.spec.serviceAccountName)'` returning that address rather than the default compute SA**; **confused-deputy negative test: an anonymous caller requesting a `tenant-private` document through the pass-through receives 403, proving the union forwards caller entitlement and never substitutes its own service credential** | TW-2, TW-11, TW-13, TW-24 |
| TW-20 | 5 | Discoverability: registry listing, `llms.txt`, `agents.txt`, developer docs | The server resolves from a public registry entry; both files serve 200 from the deployed host | TW-19 |
| TW-21 | 5 | **Standalone human surface**, two views, client of the twin API only | Renders a twin for one instrument of each of the three shapes with absences visibly distinct from zeros; every rendered value traces to a field the agent door returned; no direct call to the cockpit or to Smart Files from the client | TW-19 |
| TW-22 | 5 | Eval gate | A scored eval set with the pass threshold declared before the run; an agent answers instrument questions better from the twin than from the raw sources | TW-19 |
| TW-23 | 3 | Second-consumer findings returned to Smart Files | A divergence report listing every place this build wanted something the store did not have, each ruled general or consumer-specific; every general ruling landed in `smart-files` and reconciled with the first consumer's lane; zero document content stored outside the store | TW-6 |
| TW-24 | 1 | **DONE 2026-08-17** (PR #329 merged, main `81c36065`, CI success). Service-caller auth on the cockpit. — one leg unblocks drivers, fundamentals, econ, spine reads, identity resolution, and `market.computed`. No inbound service path exists today: auth is Clerk user-scope, anonymous-tolerant, or operator, and every API key in the backend is an outbound vendor key | A service credential reads instrument-keyed state without a user JWT; a missing or malformed credential returns 401 and never resolves to a user or operator identity | none |
| TW-25 | 1 | **DONE 2026-08-17** (PR #330 merged, main `f285b8c3`, CI success). Identity resolution promoted from ops to a served capability. The security-master resolver is registered operator-only and labelled ops and debug at `main.py:157`, yet the ratified scope identifier resolves through it | Ticker, CIK, and CME root each resolve to a node identifier through a non-operator path; the operator-only registration is removed or narrowed to genuine debug routes | TW-24 |
| TW-26 | 3 | **Three-way zone partition, replacing the blanket exclusion.** `AtomRow.user_id` is documented as a PARTITION key with `"system"` as a literal, so the house layer needs no migration. Rule: `system` partition + graded serves with its calibration basis attached; `system` + ungraded is withheld or marked unearned; `user` partition never enters a public twin at any grading level | A public twin never contains a `user`-partition atom; a served house zone always carries its `ConfidenceBasis`; a zone whose basis is `asserted` renders as unearned and never as a bare number; tests fail when any of the three is removed | TW-17 |
| TW-27 | 5 | **Intent write path.** Agents declare levels through the MCP door ("my operator wants to buy at $x", "per my analysis I will buy at $x"). The union FORWARDS the write to the cockpit atom store under the caller's identity and still holds no store | An intent write lands as an atom in the cockpit partition of the declaring caller, never the house partition; the union persists nothing; forwarding uses caller identity, never a substituted service credential; a write with no caller identity is rejected | TW-19, TW-24 |
| TW-28 | 4 | **Intent follow-through grading.** A declared level is a gradeable claim. For SnapTrade-connected accounts, follow-through is verifiable against broker truth via the existing `conformance/reconcile` mechanism | A declared intent resolves to followed / not-followed / unverifiable with stated basis; unverifiable is never reported as either of the other two; the grade writes through the existing calibration path | TW-27 |
| TW-29 | 4 | **Attention layer (hive), entitled by contribute-or-pay** (`_decisions/2026-08-16_contribute_or_pay_attention_layer.md`): one entitlement check with two satisfying conditions, never two access paths. Layer 1 free is unchanged for every other layer. Aggregate count of participants who marked a band, published as a count of observations rather than as a house call. Weighted by declarer calibration so an ungraded account contributes zero to the published figure | Response states cohort size and composition; below a declared cohort floor the layer says so rather than publishing a thin count; an account with no graded record demonstrably contributes zero, asserted by test; the layer is typed DECLARED INTENT and never as held position | TW-28 |
| TW-32 | 1 | **Dry run must derive expected-issuer from the CROSSWALK, not from `identifier_index`.** As built, the rebuild reads expected issuers from `identifier_index` rows of type `cik` - of which production has ZERO - so the `agrees` branch is unreachable and no link can ever score agreement before the fix it is meant to validate has already run. Chicken-and-egg: the measurement is currently blocked on the change it exists to check | A dry run against production returns a non-zero `agrees` count with no prior `--apply` and no CIK rows in `identifier_index`; `expected_issuer_node_id` is populated from the crosswalk artifact | TW-31 |
| TW-31 | 1 | **CODE DONE 2026-08-17** (PR #331 open, CI `success`, not merged; migration 0058 NOT applied; production dry-run still owed). **Hard issuer binding for the room.** `identifier_type` is `{figi, cusip, isin, lei}` with NO `cik`, and CIK exists only as a ticker map inside `providers/edgar.py`, so no principal can resolve CIK to a node. Meanwhile the live issuer link is minted by FUZZY NAME MATCH on an FMP profile (`base_library_backfill.py:287`), not by identifier. Filings are CIK-keyed, so TW-6 would file legal documents against a fuzzy match | CIK is an indexed `identifier_type`; a filing resolves to its issuer node by CIK with no name matching in the path; a deliberate wrong-name test does NOT produce a link; existing fuzzy-derived links are re-derived or flagged | TW-25 |
| TW-30 | 1 | **Provenance-class taxonomy in the contract.** Record, Observation, Derivation, Attention, Judgment, Synthesis, each with its own honesty obligation. Extends ruling 7's measurement-provenance ladder one level up | Every served layer declares its class; a layer that cannot be sorted into a class cannot be added; the class determines which provenance fields are required, enforced by schema rather than review | TW-2 |

## Sequence

TW-1 and TW-2 are closed: the scope identifier is ruled and contract v0.1 is approved. TW-24 is now the first build row. One credential check on the cockpit unblocks drivers, fundamentals, econ, spine reads, identity resolution via TW-25, and `market.computed` at v0.2. Nothing else in the plan buys as much.

Then two tracks run in parallel. The issuer track is TW-5, TW-6, TW-8, proving the room on the four companies and two funds. The non-issuer track is TW-3, TW-9, TW-10, proving the authority abstraction on the eleven contracts. They converge at TW-11, which is where the design either holds or does not, because that is the first row where one contract has to answer honestly for both.

TW-19 is the spine, not a late surface row. It is the union layer, and both doors are thin clients over it. Building it before any human surface is what forces the contract into the open, because a UI will paper over a mushy contract and an agent door cannot. TW-21 cannot start before it, by governing rule 5.

TW-7 is operations and runs whenever; it gates the continuously-verified claim rather than any build row.

## Open calls

These block the rows named against them and are the first thing the planning agent should route back rather than decide.

| Call | Blocks | Recommendation |
|---|---|---|
| ~~Instrument scope identifier and scope-type name~~ | TW-1 | **RULED 2026-08-16.** `smartfile:instrument:<node_id>:<doc_slug>`, scope and target type named `instrument`. Record: `_decisions/2026-08-16_instrument_scope_identifier.md` |
| Public roster edge scoping, platform-global versus `public-free` | TW-16, TW-14 | not yet formed; needs the tenancy read first |
| Which authority feeds enter the R&D phase | TW-9, TW-10 | CME and CFTC cover all fourteen non-issuer symbols; EIA and Treasury are the depth pass |
| ~~Does the new subtab absorb the drivers surface or rebuild the flow~~ | TW-21 | **RULED 2026-08-16 (A-1):** standalone surface, not a cockpit subtab. Absorb the driver catalog as data, rebuild the flow |
| Migration ordering against Smart Files while Plan Review builds in parallel | TW-4, TW-23 | one ordering owned by the store, not two consumers landing independently. Plan Review is live on the `tenant` scope under OPS-17 G-60; this program must not land a smart-files migration without that lane seeing it |
| Promotion to OPS-18 as a registered plan of record | all rows becoming dispatchable | see below |

**On promotion.** Registering this as OPS-18 is one entry in `_catalog/plan_registry.json` with a unique row prefix, followed by `node scripts/plan-registry-divergence.test.mjs`. The compiler and the canon-gate hook read that registry and must not be edited. The reason not to do it unilaterally is the focus-queue rule: OPS-16 and OPS-17 are both active with hand-carried lane planners, and a third program needs Nick to name what gets queued to make room. Until then these rows cannot be compiled into a dispatch, and a planning agent working from this doc is doing R&D scoping rather than executing lanes.

## Infrastructure the union layer needs

The union layer holds no store, so **no database is provisioned for it**. If caching later proves necessary that is an explicit decision, not a default.

One repository holding two deployables, the twin API and the standalone surface, versioned together because governing rule 5 makes the client structurally dependent on the contract. Splitting them invites exactly the drift the rule prevents.

`empressa-trading-prod` already exists, and the house pattern is one GCP project per service (`smart-files-505619`, `plan-review-505715`). Creating a new project and linking billing needs operator credentials; deploying into an existing project is the alternative and is a call rather than a constraint. The GitHub repository can be created from this seat.

All three are blocked on naming, which is therefore no longer cosmetic. It gates the repository name, the Cloud Run service name, and the Vercel project name.

## The collapsed-edge resolution (ruling owed)

Edges are append-only via a `before_update` MAPPER EVENT, so `links_to_retire` is structurally always 0 on the ORM path and TW-31's apply is purely additive. But `models.py:1675` states that Core `update()` is intentionally NOT blocked, because mapper events do not fire on Core DML. So closure IS available.

Three options, planner recommendation first.

**Read-time filter (recommended).** Consumers read `cik-exact` links and ignore `name-fuzzy`. No mutation, no evidence destroyed, works with the append-only design rather than around it, and it is doctrinally correct: a fuzzy link is not wrong to have RECORDED, it is wrong to TRUST. That is a read-time trust decision, which is exactly what `match_method` was added to carry. Consequence: **TW-6 must read only `cik-exact` issuer links**, and that becomes part of its instrument.

**Core-DML closure of `valid_to` on the legacy edges.** Precedented and available, but using the immutability bypass to erase the record of a defect is close to the worst available use of it, and it is 8,334 production writes with no undo.

**Leave and never read.** Equivalent to the first option without the enforcement, so strictly worse.

## Naming hazard: two meanings of "contract"

Flagged 2026-08-16 by the TW-25 executor. In the cockpit, the `contract_` node-id prefix means an **on-chain contract address**. In Smart Markets, the `contract` **shape** means a futures contract, which is addressed by a `sec_` id. They are correct and disjoint today. Never wire one to the other, and never infer a shape from a node-id prefix.

## Logged future (carry in planning, do not build now)

**Render Commitments of Traders on the charts.** Operator note, 2026-08-16. TW-9 already brings CFTC Commitments of Traders in as an authority feed for the eleven futures roots, so the data lands in the estate as a by-product of the drivers work. Rendering it as a chart overlay in the cockpit is a separate, later piece of work in a different repo, and it is not a Smart Markets row. Logged here so it is attached to the thing that produces the data rather than living in someone's head.

Worth noting why it fits the doctrine cleanly: COT is the Record class, published weekly by a regulator, and it is aggregate positioning rather than declared intent. It is therefore the closest legitimate precedent for the Attention layer (TW-29) and the natural thing to render alongside it once both exist, with the distinction between reported positions and declared intent visible on the same surface.

## Amendments

The baseline row table above is frozen as of this section. Every subsequent scope change is a dated amendment row here, never an edit to a row's original intent, so that what was believed while work was in flight stays visible.

| ID | Date | Change | Rows touched |
|---|---|---|---|
| A-9 | 2026-08-17 | **Production dry run complete, READ-ONLY, `writesPerformed: 0` proven four independent ways** (before/after row-count probe with zero differing keys, `identifier_index.max(id)` held at 168, two byte-identical runs, code audit; planner re-verified counts independently). Every A-8 figure CONFIRMED exactly. Three things A-8 got wrong or understated. (1) **The guardrail catches far more than 56%: 935 of 1,323 issuer nodes violate (71%), holding 7,797 links = 93.6% of the graph.** Breakdown: 914 unbounded-fanout (no SEC-listed symbol at all, so no CIK and no computable bound), 21 exceeds-sec-ticker-bound (worst: `iShares MSCI USA Size Factor ETF`, 92 securities against a bound of 2), 17 multi-cik-fanout, and ZERO nodes claiming a CIK. The multi-CIK cases are the sharpest evidence in the whole investigation: `abrdn Physical Palladium Shares ETF` holds GLTR/PALL/PPLT/SGOL/SIVR plus London lines across **five distinct CIKs** on one node. (2) **CIK coverage is 2.99%, not the ~25% the planner estimated** — 1,075 of 35,918 nodes, 188 distinct CIKs of 8,021; 2.68% of the 9,992 non-merged nodes. The reason EMPIRICALLY CONFIRMS the three-shapes thesis at graph scale: of 34,843 unresolved, 13,419 are foreign by suffix (`.L` 10,067, `.TO` 3,262) and the 21,424 unsuffixed are dominated by futures, FX and crypto, which SEC's file structurally cannot cover. (3) **`agrees: 0` is STRUCTURAL, not measured** — see the row below. | TW-6, TW-31 |
| A-8 | 2026-08-17 | **TW-31 measured, and the defect is larger than A-7 stated.** Production probe: `identifier_index` holds 166 `accn` rows and exactly ONE `lei` against 35,918 security and 1,323 issuer nodes, so the identity index is effectively EMPTY. `lei` is `None` in SEC submissions for all seven cohort symbols, so `resolve_issuer`'s LEI backbone has no data and fuzzy name matching was the ONLY available path, not a shortcut. Result: 8,334 `issued_by` edges across 1,323 issuer nodes, **56% of links on nodes holding 11+ securities**, worst case 183 distinct securities on one node named "Leverage Shares 2x Long OKTA Daily ETF". CORRECTION to this planner's earlier reporting: `identifier_type ∈ {figi,cusip,isin,lei}` was a CODE COMMENT, never a DB constraint - migration 0023 created a bare `String(8)`. Migration 0058 makes it a real domain including `cik`. `issued_by` is WRITTEN ONLY, never read by the app, so the defect is LATENT and TW-6 is what would activate it. GUARDRAIL DESIGN: not a flat cap - SEC's own file shows 37 CIKs legitimately reaching up to 27 tickers - so the bound is exact per CIK, securities linked must not exceed the tickers SEC lists for that CIK. | TW-6, TW-31 |
| A-7 | 2026-08-16 | **TW-25 landed and surfaced a gap in A-4 that the planner missed.** Three findings from the executor's enumeration. (1) The three `resolve*` routes read like reads and are not: each MINTS on miss, and `resolve-option` writes a `derives_from` edge even on a hit, so serving them would let a service caller create identity through a GET. Resolved by splitting the read half out as `GET /securities/lookup` = `resolve_security(mint=False)`, PLANNER-APPROVED: minting on read is not merely an HTTP-semantics defect here, it is a product defect, because a twin queried about a garbage ticker would mint a provisional node and the instrument universe would fill with junk created by questions. Honest absence is the correct answer to a lookup miss. (2) **CIK resolution does not exist for any principal**, so one third of TW-25's own acceptance criterion is unreachable by any gating change. (3) The live issuer link is minted by fuzzy name match on an FMP profile rather than by identifier, which is a weak seam to file legal documents against. ADDS TW-31. | TW-6, TW-25, TW-31 |
| A-6 | 2026-08-16 | **Contribute-or-pay ruled for the Attention layer**, closing the item A-5 left open. The barter sits on that one layer and never on the front door, so `08_tiered_access_model.md` Layer 1 free is UNCHANGED and no supersession is required. A door gate was rejected on four grounds: it would move settled tier canon by drift, it would add friction at the exact moment MCP-registry discovery is being attempted, it is a disclosure ask that may be prohibited for institutional callers, and at cold start it would flood the layer with gate-satisfying noise at the one moment calibration weighting cannot filter it. Entitlement stays a POLICY layer above TW-27's write path, which is what keeps the parameters tunable without a rebuild. Parameters deliberately open: contribution-to-access rate, decay, whether calibration standing modifies the rate, the paid price, and whether any cohort figure is visible at Layer 1. | TW-27, TW-29 |
| A-5 | 2026-08-16 | **Smart Markets is a TWO-DIRECTIONAL feed with the cockpit, not a read-only consumer** (operator ruling). Agents declare levels through the MCP door and that input renders back in the cockpit. Market-participant zones and levels become the house indicator, sourced increasingly from agent data and possibly made a condition of consumption. Establishes the provenance-class taxonomy (Record, Observation, Derivation, Attention, Judgment, Synthesis) as the rule that keeps the layer set principled rather than a junk drawer, and establishes that toggleable layers are also the response size bound. Declared intent is typed as intent and NEVER as held position, which is the line between this and CFTC Commitments of Traders. ADDS TW-27, TW-28, TW-29, TW-30. RESTATES TW-26 from blanket exclusion to the three-way partition. OPEN: contribute-to-consume would change the Layer 1 free bargain in `08_tiered_access_model.md` and is not ruled. | TW-26, TW-27, TW-28, TW-29, TW-30 |
| A-4 | 2026-08-16 | **Issuer and security are separate nodes** (operator ruling, option A). security-master mints type-prefixed ULIDs `sec_`/`iss_`/`opt_`; filings are ISSUER facts and prices are SECURITY facts, and GOOG plus GOOGL is the immediate failure case: two securities, one issuer, one 10-K. A twin is ADDRESSED by its security or contract node and carries `issuerNodeId` when one exists, mirroring the resolver's existing `underlying_node_id`. The room keys off the ISSUER node for operating-company and fund shapes and off the addressed node for the contract shape. The ratified scope identifier is unchanged in form; only which node a filing is filed under changes, which is a contract rule rather than an identity rule, so `_decisions/2026-08-16_instrument_scope_identifier.md` is NOT reversed. | TW-2, TW-3, TW-6, TW-25 |
| A-3 | 2026-08-16 | **Contract v0.1 approved** (`09_twin_read_contract.md`) and the four open calls resolved on operator delegation. Establishes the governing principle that the contract declares only what it serves, replacing an earlier draft where unbuilt layers would return `lookup-failed`: that would have made every twin permanently broadcast a false signal about our own backlog using the machinery the product sells. Absence is now reserved for facts about the world; version scope handles the rest. RESTATES TW-2 (approved, schema must not contain unservable fields), TW-14 (company shape only at v0.1), TW-17 (`market.computed` is v0.2, blocked on TW-24), TW-19 (adds the confused-deputy negative test and the non-persisting pass-through), TW-24 (named the first build row). `not-applicable` stays a twin-layer concept and is logged as the first TW-23 divergence finding rather than landed in the store. | TW-2, TW-14, TW-17, TW-19, TW-24 |
| A-2 | 2026-08-16 | **Reachability map run against the cockpit** (`origin/main` 44664f6c). Three findings. There is NO inbound service-caller path: auth is Clerk user-scope, anonymous-tolerant, or operator, and every backend API key is an outbound vendor key, so TW-19's fan-out to the cockpit has nothing to call today. The security-master resolver is registered operator-only and described as ops and debug, yet the ratified scope identifier depends on it. And zone atoms are operator-authored, keyed on `AtomRow.user_id`, while signal and heatmap cells are global and computed, so the market-structure layer is two different things under one name and serving the drawn half in a public twin would publish the operator's analysis as instrument state. ADDS TW-24 (service auth), TW-25 (resolution as a served capability), TW-26 (zone exclusion, enforced). RESTATES TW-17 to computed-global state only. | TW-17, TW-24, TW-25, TW-26 |
| A-1 | 2026-08-16 | **Standalone human surface ruled**, replacing the cockpit-subtab plan. Governing rule 4 restated as the research-versus-execution boundary with Clerk as the seam. New governing rule 5: the human door renders only what the agent door returns. TW-19 restated as the union layer and the spine of the plan. TW-21 restated as a standalone two-view client of the twin API, now blocked on TW-19 alone. TW-17 restated to serve market structure as data with no rendering, on the operator's point that the cockpit's zone, regime, and microstructure output is structured state the twin can carry without moving chart code. Convergence with the cockpit at the execution boundary logged as future direction with its migration cost accepted. | TW-17, TW-19, TW-21 |

## Verification note

Every inventory claim above was read from the named repository at the commit recorded here, on 2026-08-16.

```
empressa-trading   origin/main  44664f6c
smart-files        origin/main  9159e3c
atx-bulls          origin/main  60f4744
```

The local `empressa-trading` clone at `P:\Empressa Trading` was on branch `fix/zone-mark-death-clip` at `2d88f304` and was not the source of any claim here; all reads were against the fetched `origin/main` tree.

Two claims are reported rather than verified. The approximately 8,021 CIK manual seed figure comes from `apps/cockpit/docs/EDGAR_NIGHTLY_RUNBOOK.md` dated 2026-07-01 and was not confirmed against a live database. The retired status of `apps/empressa` comes from the repository README and was not confirmed against deployment state. Both are marked because rows TW-7 and TW-21 depend on them.
