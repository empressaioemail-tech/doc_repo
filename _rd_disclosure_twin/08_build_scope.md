---
id: rd_dt_08_build_scope
title: Build scope — the instrument twin, R&D program baseline
status: active
last_updated: 2026-08-16
applies_to: portfolio
owner: nick
related: [rd_dt_05_securities_pivot, rd_dt_06_the_move, rd_dt_07_research_funnel, _decisions/2026-08-15_digital_economies_session_rulings, _decisions/2026-08-15_smart_files_module_identity, 90_operations/OPS-17_govtech_stack_plan_of_record, 90_runbooks/AGENT_CONTRACT]
purpose: The executable build scope for the instrument twin, written for handoff to a planning agent. Records Nick's 2026-08-16 framing rulings, the verified inventory across three repos, three corrections to docs 06 and 07, the twin read contract strawman, and twenty-three numbered work rows with pass/fail instruments. Also records that this is Smart Files' SECOND consumer and therefore its first real generalization test. Structured as a plan of record but NOT registered in _catalog/plan_registry.json; promotion to OPS-18 is an open operator call recorded at the foot of this doc.
---

# Build scope: the instrument twin

## What this document is

A baseline for handoff to a planning agent. It is written in the shape OPS-16 and OPS-17 proved, with numbered rows carrying pass/fail instruments, because this repo has a measured base rate where prose-shaped controls fail and structure-shaped controls hold.

It is deliberately **not registered** in `_catalog/plan_registry.json`. Registering it would create a third concurrent program alongside OPS-16 and OPS-17, and the focus-queue rule requires naming what gets queued to make room. That call is Nick's and is recorded in the open calls at the foot. Until it is made, the `TW-` rows below are R&D work rows, not dispatchable PLAN-ROWs, and a planning agent cannot compile a dispatch against them.

## The frame Nick set

This is a continuation of the trading platform with Smart Files bolted on for publicly available company documentation, plus one MCP server. It is not a new product build. What exists is a starting point rather than a restriction, so new data sources and new components are in scope where the existing substrate does not reach.

Five framing rulings from 2026-08-16. The R&D cohort is the cockpit trade grid, chosen because its mix of products tests the shape against the wider financial universe rather than against equities alone, with the scaffolding correct first and a handful of instruments run through it. Smart Files is mounted, never merged. The human door is the existing research tab with a new subtab, and the flow inside it is open to rethinking because this is an evolution of that surface rather than a skin on it. The agent door is a new MCP server under Empressa on GCP, and it does not live on the cockpit. The fourteen non-issuer instruments in the grid are inside the R&D scope, not deferred.

## Definition of done for the R&D phase

All eighteen trade-grid instruments resolve to a twin that returns the declared contract, with every layer either populated from a named authority or returning a typed absence with stated scope. The agent door serves that contract with provenance on every response and access policy enforced. The human subtab renders one instrument of each of the three shapes including its absences. An eval, threshold declared before running, shows an agent answering instrument questions better from the twin than from the raw sources.

A row graded by narration or by doc assertion fails. Every row re-grades only by its named instrument.

## Governing rules

`90_runbooks/AGENT_CONTRACT.md` is the operative law for lane behaviour and is not restated. Four rules govern here specifically.

1. **No silent substitution.** No layer may return another node's data as if it were this node's. A proxy is permitted only when it is marked as a proxy and carries its own provenance. This rule exists because the current implementation violates it, per the drivers finding below.
2. **Absence is typed, never empty.** Every layer that can be absent returns a verdict of `absent-verified` or `lookup-failed` with the scope that was searched. An empty array is not an answer.
3. **The contract is declared before it is served.** Row TW-2 blocks the agent door and the human door. A shape discovered by building the UI is the failure mode this rule prevents.
4. **The cockpit holds no anonymous door.** It carries broker connections and billing. The MCP server fans out to it as an upstream and never inverts that.
5. **Smart Files is refined, never forked.** This is its second consumer. Anything this build needs that the store does not have goes back into the store as a general change, or gets ruled as genuinely consumer-specific. A private shadow copy of documents inside the cockpit is the failure this rule prevents.

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
| new Empressa MCP repo | the agent door, fanning out to both upstreams | TW-19, TW-20 |
| `atx-bulls` | read-only reference for the roster pattern; not modified | TW-14, TW-15, TW-16 |
| `doc_repo` | decision records, this baseline | TW-1, TW-2, TW-16, TW-22 |

## Work rows

Layers are ordered by what blocks what, not by subject. L1 foundation, L2 acquisition, L3 integrity, L4 depth, L5 surface.

| ID | L | Work item | Pass/fail instrument | Blocked on |
|---|---|---|---|---|
| TW-1 | 1 | Ratify the instrument scope identifier and scope-type name | Decision record filed in `_decisions/`; the string appears verbatim in the smart-files validator | none |
| TW-2 | 1 | Declare the twin read contract across all three shapes, including the absence shape | Contract doc plus machine-readable schema committed; one fixture per shape validates against it in CI | TW-1 |
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
| TW-14 | 4 | Roster port: officer and director nodes, tenure edges, role atoms from DEF 14A | For the four companies, board and officer rosters present with tenure edges; a person appearing at two issuers is one node, asserted by SQL | TW-3, TW-16 |
| TW-15 | 4 | Form 4 insider transaction atoms | Transaction count for a named window reconciles to the SEC count for the same window; each atom carries filing accession and date | TW-14 |
| TW-16 | 4 | Rule and implement public roster edge scoping, platform-global versus `public-free` | Decision record filed; the implementation matches it; a cross-issuer board query returns without a tenant context | TW-1 |
| TW-17 | 4 | Market-structure layer composed into the twin read for all eighteen | `get_twin` returns zone and regime state where computed and typed absence where not, for every one of the eighteen | TW-2 |
| TW-18 | 4 | Synthesis over the full funnel | Every number in the synthesis text traces to an atom identifier in citations; a test fails on an uncited number | TW-11, TW-17 |
| TW-19 | 5 | The Empressa MCP server on Cloud Run: resolve, twin read, room and document read, roster, drivers, attestation feed | Live introspection lists the tool set; every response carries the provenance envelope; a malformed key returns 401 and never falls through to public | TW-2, TW-11, TW-13 |
| TW-20 | 5 | Discoverability: registry listing, `llms.txt`, `agents.txt`, developer docs | The server resolves from a public registry entry; both files serve 200 from the deployed host | TW-19 |
| TW-21 | 5 | Research subtab over the same funnel, absorbing or replacing the drivers surface | The subtab renders a twin for one instrument of each of the three shapes, absences included and visibly distinct from zeros | TW-2, TW-12 |
| TW-22 | 5 | Eval gate | A scored eval set with the pass threshold declared before the run; an agent answers instrument questions better from the twin than from the raw sources | TW-19 |
| TW-23 | 3 | Second-consumer findings returned to Smart Files | A divergence report listing every place this build wanted something the store did not have, each ruled general or consumer-specific; every general ruling landed in `smart-files` and reconciled with the first consumer's lane; zero document content stored outside the store | TW-6 |

## Sequence

TW-1 and TW-2 first and alone. Everything downstream keys off the scope identifier and the contract, and both are cheap now and expensive after code exists against a guess.

Then two tracks run in parallel. The issuer track is TW-5, TW-6, TW-8, proving the room on the four companies and two funds. The non-issuer track is TW-3, TW-9, TW-10, proving the authority abstraction on the eleven contracts. They converge at TW-11, which is where the design either holds or does not, because that is the first row where one contract has to answer honestly for both.

The agent door comes before the human door deliberately. A user interface will paper over a mushy contract and an agent door cannot, so TW-19 before TW-21 forces the abstraction into the open while the phase is still cheap to change.

TW-7 is operations and runs whenever; it gates the continuously-verified claim rather than any build row.

## Open calls

These block the rows named against them and are the first thing the planning agent should route back rather than decide.

| Call | Blocks | Recommendation |
|---|---|---|
| Instrument scope identifier and scope-type name | TW-1, and through it TW-4, TW-6, TW-19 | `smartfile:instrument:<node_id>:<doc_slug>`, argued above |
| Public roster edge scoping, platform-global versus `public-free` | TW-16, TW-14 | not yet formed; needs the tenancy read first |
| Which authority feeds enter the R&D phase | TW-9, TW-10 | CME and CFTC cover all fourteen non-issuer symbols; EIA and Treasury are the depth pass |
| Does the new subtab absorb the retired drivers surface or rebuild the flow | TW-21 | absorb the catalog, rebuild the flow |
| Migration ordering against Smart Files while the first consumer builds in parallel | TW-4, TW-23 | one ordering owned by the store, not two consumers landing independently. The first consumer's app name and lane are not captured in canon and need capturing before this can be sequenced |
| Promotion to OPS-18 as a registered plan of record | all rows becoming dispatchable | see below |

**On promotion.** Registering this as OPS-18 is one entry in `_catalog/plan_registry.json` with a unique row prefix, followed by `node scripts/plan-registry-divergence.test.mjs`. The compiler and the canon-gate hook read that registry and must not be edited. The reason not to do it unilaterally is the focus-queue rule: OPS-16 and OPS-17 are both active with hand-carried lane planners, and a third program needs Nick to name what gets queued to make room. Until then these rows cannot be compiled into a dispatch, and a planning agent working from this doc is doing R&D scoping rather than executing lanes.

## Verification note

Every inventory claim above was read from the named repository at the commit recorded here, on 2026-08-16.

```
empressa-trading   origin/main  44664f6c
smart-files        origin/main  9159e3c
atx-bulls          origin/main  60f4744
```

The local `empressa-trading` clone at `P:\Empressa Trading` was on branch `fix/zone-mark-death-clip` at `2d88f304` and was not the source of any claim here; all reads were against the fetched `origin/main` tree.

Two claims are reported rather than verified. The approximately 8,021 CIK manual seed figure comes from `apps/cockpit/docs/EDGAR_NIGHTLY_RUNBOOK.md` dated 2026-07-01 and was not confirmed against a live database. The retired status of `apps/empressa` comes from the repository README and was not confirmed against deployment state. Both are marked because rows TW-7 and TW-21 depend on them.
