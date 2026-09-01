---
id: rd_dt_14_instrument_data_map
title: The instrument data map — every representation of an instrument, its owner, and where they disagree
status: active
last_updated: 2026-08-19
applies_to: portfolio
owner: nick
related: [rd_dt_09_twin_read_contract, rd_dt_08_build_scope, _decisions/2026-08-16_instrument_scope_identifier, 80_adrs/adr_017_atom_access_control]
purpose: Row TW-67. A mapping and reconciliation study across empressa-trading (the cockpit) and smart-markets (the union layer). Inventories every representation of an instrument, states what joins each pair and whether that join is enforced, records the disagreements found live on 2026-08-19 with node ids, classifies cockpit surfaces as knowledge or operational reads, answers the cycle question, and ranks the misfires. Written to be read before an architecture is committed to, not after.
---

# The instrument data map

## What this is and how to read it

Row TW-67. A study, not a build. No production code was written, no defect was fixed, and nothing was deployed. Where a defect appears below it is recorded and left alone.

Every claim carries a tag. **(CODE)** means a file was opened and the line is named. **(LIVE)** means a response was captured from a running service on 2026-08-19 and is quoted verbatim. **(INFERRED)** means a conclusion drawn from the first two, and every one of them says what it rests on. There are no untagged claims. Where something could not be established it says so, and says what would settle it.

Two facts about the working trees have to come first, because they invalidate any reading taken from a local checkout.

**The `P:\smart-markets` working tree is 40 commits behind `origin/main`** and sits on branch `tw40/web-ci`. `git rev-list --left-right --count HEAD...origin/main` returns `0 40` (LIVE). That local tree describes both upstream adapters as unwired. On `origin/main`, and in the deployed service, the cockpit adapter is wired for resolution and for market quotes and the Smart Files adapter is wired end to end. Every smart-markets claim below was read with `git show origin/main:<path>`, never from the working tree.

**The `P:\smart-files` working tree is 5 commits behind `origin/main`** (LIVE). That local tree has no `instrument` scope type at all, which reads as a fatal contract divergence and is not one: commit `cdf141c` added it. That trap is the reason this document was built by reading rather than by grepping.

## 1. The inventory

There are twelve distinct representations of an instrument across the two repositories and the files store. Five are node-keyed. Six are keyed by a bare symbol string. One is the room. The split is the whole finding.

### The node-keyed representations

| # | Representation | Identified by | Store | Written by | Read by | Bitemporal |
|---|---|---|---|---|---|---|
| 1 | `Node` row | `node_id`, a type-prefixed ULID (`sec_`/`iss_`/`opt_`) | cockpit Postgres, table `nodes` | `SecurityResolver.get_or_create_node` | `/securities/*`, `/admin/nodes*`, resolver internals | No. `created_at` only |
| 2 | Symbol-alias era | an atom with `claim_type="identity.symbol"`, `entity_id=node_id`, `claim_value={symbol,venue}` | cockpit `atoms` | `SecurityResolver._write_alias_atom` | `_collapse_alias_eras`, resolution step 3 | **Yes.** `valid_from`/`valid_to` plus `knowledge_time` |
| 3 | `IdentifierIndex` row | `(identifier_type, identifier_value)` unique, pointing at a `node_id` | cockpit `identifier_index` | resolver mint and issuer claim | resolver steps 1 and 2, `/securities/node/{id}` | Partial. `valid_from`/`valid_to`, no knowledge time |
| 4 | `MergeLink` row | `(loser_node_id, survivor_node_id)` | cockpit `merge_links` | `merge_nodes`, `/admin/resolver/merge` | `canonical()`, transitively | Partial. `knowledge_time` only |
| 5 | Twin node | `node.id` (`sec_`) plus optional `node.issuerNodeId` (`iss_`) | none. Composed per request, nothing persisted | smart-markets `buildTwin` | HTTP `/v0.1/twin/:symbol`, MCP `get_instrument_twin` | No. `provenance.generatedAt` only |

The `Node` docstring is explicit that `current_symbol` is "cache only, NEVER a key" (CODE, `app/models.py:1074`) and that `name` and `lei` are "Issuer-only fields" (CODE, `app/models.py:1091`). Both facts are load-bearing downstream and both are honoured by the served route.

Representation 2 deserves to be named plainly. The security master's bitemporal identity is not a table. It is a class of atom in the general-purpose spine log, collapsed into eras at read time by `_collapse_alias_eras` (CODE, `app/securities/resolver.py:297`). That is a legitimate design, and it is also why nothing can enforce referential integrity over it.

### The symbol-keyed representations

| # | Representation | Identified by | Store | Written by | Read by | Bitemporal |
|---|---|---|---|---|---|---|
| 6 | `UniverseSymbol` | `symbol`, as the **primary key** | cockpit `universe_symbols` | `app/universe/sync.py` | universe seeds, scanners | No |
| 7 | Positions and orders | `symbol` string column | `paper_positions`, `paper_orders`, `staged_trades`, `bot_position_state`, `bot_blocked_signals`, `gate_evaluations` | paper engine, bot runner, SnapTrade mapper | every trading surface | No |
| 8 | Watchlists | `symbol` string. `signal_heatmap_symbols.symbol` is `unique=True`; `research_sessions.pinned_symbols_json` is a JSON array of strings | cockpit `signal_heatmap_symbols`, `research_sessions` | `/signal/v2/heatmap/symbols`, `/research/session/{id}/pinned-symbols` | trade grid, research funnel | No |
| 9 | Market data | `symbol` string | `ohlcv_bars`, `iv_snapshots`, `signal_heatmap_cells` | Databento and FMP ingest, heatmap refresh | charts, signal, the union's market layer | No |
| 10 | Chart drawings and alerts | `(user_id, symbol)` | `chart_drawing_sets`, `alerts` | chart UI, alert routes | chart UI, price-watch loop | No |
| 11 | Symbol-keyed atoms | `AtomRow.entity_id` holding a bare symbol | cockpit `atoms`, projected into `current_atoms.node_id` | see below | spine reads, calibration | Bitemporal on the columns, but the subject is a string |

Representation 11 is where drift hides, and it is not purely historical. The spec is unambiguous: `entity_id` "holds a node_id and NEVER a symbol" (CODE, `app/securities/backfill_legacy_atoms.py`, module docstring). But `app/spine/store.py:append_atom` performs no validation of `entity_id`'s shape at all. It validates consent, evaluation scope, PII, and backtest basis, then writes `entity_id=parsed.entity_id` verbatim (CODE, `app/spine/store.py:241`).

And there is a **present-tense writer** of symbol-keyed atoms. `app/jobs/equity_deep_daily_backfill.py:373` writes `entity_type="security", entity_id=sym` where `sym` is a bare ticker, for the split-correction ledger, with `family=Family.event` (CODE). Those atoms then flow into the current-atoms projection, whose column is literally named `node_id` (CODE, `app/models.py:1436`, and `app/spine/store.py:293` which passes `node_id=parsed.entity_id`).

So `current_atoms.node_id` holds a mixture of `sec_`-prefixed ULIDs and bare tickers. The column name asserts a type the data does not have. This could not be counted from outside, because `/admin/atoms` is operator-gated and refuses the service credential. **What would settle it:** `SELECT count(*) FROM current_atoms WHERE node_id NOT LIKE 'sec\_%' AND node_id NOT LIKE 'iss\_%' AND node_id NOT LIKE 'opt\_%'`.

### The room, in the files store

Representation 12 lives in neither repository. Smart Files identifies an instrument by a scope pair, `scopeType="instrument"` and `scopeId=<node_id>`, and composes entity ids as `smartfile:instrument:<node_id>:<doc_slug>` (CODE, `smart-files origin/main:src/identity.mjs:81`). It validates the node id against `/^(?:sec|iss)_[0-9ABCDEFGHJKMNPQRSTVWXYZ]{26}$/` (CODE, same file, line 31). It is a writable scope (CODE, `WRITABLE_SCOPE_TYPES = ["tenant", "instrument"]`, line 10).

## 2. The join-key map

A join is **enforced** when something mechanical rejects a violation. It is **conventional** when the two sides agree by discipline and nothing would notice if they stopped.

| Pair | Joined by | Enforced? | Evidence |
|---|---|---|---|
| `IdentifierIndex` to `Node` | `node_id` string | **Conventional.** No foreign key. `UNIQUE(identifier_type, identifier_value)` and a `CHECK` on the type domain exist, but nothing binds `node_id` to a real row | CODE, `app/models.py:1174-1201` |
| `MergeLink` to `Node` | `loser_node_id`, `survivor_node_id` | **Conventional.** No foreign key. `canonical()` carries a cycle guard that raises, which is a graph check and not a referential one | CODE, `app/models.py:1203`. `/securities/node/{id}` has an explicit `ISSUER_REASON_DANGLING` branch, which is the route conceding this |
| `Edge` (`issued_by`) to `Node` | `from_node`, `to_node` | **Conventional at the database, gated at read.** No foreign key. The read is forced through `trusted_issuer_links`, and a source-walking test fails any other reader | CODE, `app/models.py:1119`, the `EDGE_TYPE_ISSUED_BY` comment, and `tests/test_issuer_link_trust.py` |
| `AtomRow.entity_id` to `Node.node_id` | string equality | **Not enforced at all.** `append_atom` never checks the prefix | CODE, `app/spine/store.py:241` |
| `current_atoms.node_id` to `Node.node_id` | string equality | **Not enforced.** It inherits whatever `entity_id` was | CODE, `app/models.py:1436` |
| Symbol to node, at read | alias-era walk with a bitemporal gate | **Enforced by the algorithm**, and it is the good one: `valid_from <= asof < valid_to` AND `knowledge_time <= asof`, with no exemptions | CODE, `app/securities/resolver.py:798-820` |
| Symbol to node, at write | `resolve_security(..., mint=True)` | **Not a join. A creation event.** See finding D | CODE, `app/securities/resolver.py:780` |
| Positions, orders, watchlists, bars, drawings, alerts to the security master | **nothing** | **Not joined.** Eleven tables hold a symbol string and no node id, and no code path reconciles them | CODE, `app/models.py`, every `symbol` column in section 1 |
| Union to cockpit resolution | `GET /securities/lookup?symbol=` then `GET /securities/node/{id}` | **Enforced by shape.** The union parses `sec_` and `iss_` with the same ULID regex the cockpit mints with, and a cockpit test asserts the minted ids match the smart-markets contract | CODE, `apps/api/src/upstreams/security-master.ts`, and `apps/cockpit/backend/tests/test_tw25_resolver_served_capability.py:483` |
| Union to cockpit market | **a symbol string, round-tripped** | **Conventional, and this is a finding** | CODE, `apps/api/src/upstreams/cockpit-market.ts:472,530` |
| Union to Smart Files | `scopeId=<governing node id>` | **Enforced by shape on both sides.** Both validate the same Crockford-ULID form. Neither checks existence | CODE, both files named above |
| Smart Files to the security master | **nothing** | **Not joined.** Smart Files validates the FORM of a node id and never asks the cockpit whether it exists | CODE, `src/identity.mjs`. There is no cockpit client in that repository |

Three of these deserve to come out of the table.

**The union round-trips through a symbol string.** It resolves a symbol to a node id, and then, to fetch quotes, takes the node's `ticker` or `contract-code` identifier and calls `GET /market/quote/{symbol}` with it (CODE, `cockpit-market.ts:530`, `marketSymbol(node)`). The join between the twin's node and the twin's prices is therefore a symbol string, in a system whose entire premise is that a symbol string is not an identity. The code is honest about the constraint: a node carrying neither identifier produces a typed absence naming the reason rather than substituting the node id (CODE, `cockpit-market.ts:481`). Honest is not the same as sound.

**A join held together by a symbol string is a finding, and there are eleven of them.** Every operational table in the cockpit is one. That is not automatically wrong. It is wrong wherever the symbol's meaning can change under the row, which is exactly what a rename does.

**Smart Files trusts a node id it cannot verify.** It enforces the form and never the existence. Documents can be filed under a well-formed node id that names nothing, and neither system would report it.

## 3. Where they disagree today, with evidence

Everything here was captured live on 2026-08-19 against `https://api.empressa.pro` with the service credential, and against `https://smart-markets-api-znwrqyxmqa-ue.a.run.app` anonymously.

### Finding A. One company, two identities, and the machinery to fix it was never run

```
GET /securities/lookup?symbol=FB
  {"node_id":"sec_01KW8BN5QRB6A5VH4VKQ2P238M","resolution_status":"provisional"}
GET /securities/lookup?symbol=META
  {"node_id":"sec_01KW87FC626WPJ1N377A4QTGMW","resolution_status":"provisional"}
GET /securities/canonical/sec_01KW8BN5QRB6A5VH4VKQ2P238M
  {"node_id":"sec_01KW8BN5QRB6A5VH4VKQ2P238M"}
```

(LIVE.) The third response is the one that matters. `canonical()` follows merge links transitively to the terminal survivor, and it returned its own input. **There is no merge link between the two nodes.** Both are `status: "active"`. Each carries its own ticker as `current_symbol`. Neither carries an issuer link and neither carries a single identifier row (LIVE, `/securities/node/{id}` for both returns `"identifiers":[]`).

This is not a gap in the resolver's design. `_ca_ticker_change` exists and is correct. It closes the old alias era at the ex-date, opens the new one from the ex-date with `knowledge_time = ex_date` so a read before the rename cannot see the new symbol, updates `current_symbol`, and writes an immutable `corp_action.ticker_change` event atom (CODE, `app/securities/resolver.py:1240-1267`). The mechanism is built. It has never been fed this action.

Why it was never fed: `apply_corporate_action` has exactly one caller in the repository, `app/jobs/resolver_backfill.py:304`, a backfill job driven by an externally supplied list of actions (CODE). No route mounts it, and no vendor corporate-action feed is wired to it.

### Finding B. The shape default, and this is the one that fails silently

Every provisional mint asserts an asset class on the caller's behalf. `get_or_create_node` reads `asset_class = hints.get("asset_class", "equity")` (CODE, `app/securities/resolver.py:394`) and `resolve_security` passes `"asset_class": asset_class or "equity"` (CODE, line 888).

Measured live, all six nodes carry `asset_class: "equity"` and zero identifiers:

| Symbol | Node id | What it actually is | `asset_class` (LIVE) |
|---|---|---|---|
| SPY | `sec_01KW8C3B5YM6KE5P3PA597MS5V` | ETF trust | `equity` |
| QQQ | `sec_01KW8C3BE8505XW1DEH055136G` | ETF trust | `equity` |
| ES | `sec_01KWCQF489PSDZ63EB6NHQXA2H` | CME E-mini S&P future | `equity` |
| NQ | `sec_01KXCM9NF2WWK3HJAGFDBMYKGW` | CME E-mini Nasdaq future | `equity` |
| CL | `sec_01KX712ZQX3VF43FWWXZGETRTN` | NYMEX crude future | `equity` |
| GC | `sec_01KXBTSZ4HNG0VRDXFZ8S11FHD` | COMEX gold future | `equity` |

The union's shape table maps `equity` to `operating-company`, is total on its keys, and refuses to default anything it does not recognise (CODE, `apps/api/src/upstreams/cockpit.ts:64-74`). It behaves correctly on the input it is given. The input is wrong, so the output is wrong, and nothing anywhere reports a problem:

```
GET /v0.1/twin/QQQ  ->  shape=operating-company  assetClass=equities
                        displayName='INVESCO QQQ TRUST, SERIES 1'
                        authority=SEC/issuer-disclosure   rosterServed=True
GET /v0.1/twin/SPY  ->  shape=operating-company  assetClass=equities
                        displayName='SPDR S&P 500 ETF TRUST'
                        authority=SEC/issuer-disclosure   rosterServed=True
```

(LIVE.) Two ETF trusts are being served as operating companies. The `authorities` block declares `issuer-disclosure` where the contract's own vocabulary carries `fund-disclosure` for exactly this case. And because `buildTwin` omits the roster only for fund-shape nodes (CODE, `apps/api/src/twin/build.ts:93`), the company-shaped roster layer, whose scope prose reads "DEF 14A officers and directors, and Form 4 insiders", is being served for a unit investment trust. The contract's fund-roster deferral was written specifically so a fund's trustees would never be rendered as directors. It is bypassed here, not by a bug in the union, but because the node never says it is a fund.

The futures nodes are currently masked by a second defect. `/v0.1/twin/GC` and `/v0.1/twin/ES` both fail earlier, on the missing display name (LIVE). A name is exactly what a curation pass would add. The moment one lands, a CME futures contract begins serving as an SEC-registered operating company with a board-of-directors layer. **The shape error is live today and is being hidden by a naming error.**

### Finding C. Every node in the catalog is provisional and carries no identifiers

Twenty-six symbols were probed. Eleven resolved, and all eleven returned `resolution_status: "provisional"` (LIVE). Not one returned `resolved`. All eleven node reads returned `"identifiers":[]` (LIVE).

The resolver's own rule explains it: `resolution_status = "resolved" if identifiers else "provisional"` (CODE, `app/securities/resolver.py:411`). Nothing has ever supplied a FIGI, CUSIP, or ISIN, so nothing has ever been promoted. The `models.py` comment on `IDENTIFIER_TYPES` records the same thing from the inside, describing the identity index as "effectively empty (166 accn rows and ONE lei against 35,918 security nodes)" (CODE).

The consequence for the union is direct. The shape table and the display name are the only two facts a twin can key off, and both are read from a row minted by a symbol and never confirmed against anything.

### Finding D. Resolution is a write, and eighteen call sites take the writing default

`resolve_security` has the signature `mint: bool = True` (CODE, `app/securities/resolver.py:780`). The served read route passes `mint=False` (CODE, `app/securities/router.py:308`) and the minting route is operator-gated, which is the right split for the HTTP surface.

Inside the process it is not split at all. **`mint=False` appears at exactly one call site in the entire application** (LIVE grep across `app/`: four hits, three of them prose in docstrings, one of them the served route). Eighteen in-process call sites across nine modules take the minting default (CODE): `app/bots/runner.py`, `app/jobs/base_library_backfill.py` (2), `app/jobs/phase2_backfill.py` (6), `app/routers/backtest.py` (2), `app/routers/zone_atoms.py`, `app/signal/propagation.py` (2), `app/signal/service.py`, `app/spine/capture.py`, `app/spine/outcomes.py`, `app/universe/sync.py`.

So the identity catalog is not curated. It is a by-product. Whichever ticker some worker touched first became a node, with `asset_class="equity"` and no identifiers. **That is precisely how one company acquired two identities.** `FB` was touched during one era and `META` during another, and nothing connected them because nothing was ever asked to.

`app/routers/zone_atoms.py:307-318` shows the pattern at its most exposed. It calls `resolve_security` (minting), and on any exception falls back to `node_id = sym`, writing a **bare symbol into the field the atom calls a node id** rather than dropping the atom (CODE). The comment states the intent: `# noqa: BLE001 — never drop the atom on a resolver hiccup`. It is a deliberate availability choice with an identity cost, and the cost is silent.

### Finding E. GOOG does not exist, and the contract's headline example depends on it

`GOOGL` resolves to `sec_01KW8393ZYCSDB2C65VWBF88XR`. `GOOG` returns `not_found` (LIVE). The contract doc, the twin schema, and the primitives file all use "GOOG and GOOGL are two securities with one issuer and one 10-K" as the motivating example for issuer-keyed rooms (CODE, `packages/contract/src/primitives.ts:37-42` and `node.ts:40-45`). The dual-class case that justifies the design is not represented in the catalog. That does not make the design wrong. It makes it untested against the case it was designed for.

### Finding F. The anonymous path cannot reach the room, and the room reports it as an absence

The deployed Smart Files service refuses every anonymous caller (LIVE):

```
GET /api/smart-files/folders?scopeType=instrument&scopeId=iss_...   (no auth)
  401 {"error":"unauthorized",
       "message":"Anonymous callers are refused. Bearer service token required."}
```

With the service token the same request is fine and the scope is valid (LIVE):

```
  200 {"scopeType":"instrument","scopeId":"iss_01M089R4AK4Q2AHVY6GJ96H7E8",
       "folders":[],"servedAt":"2026-08-19T18:56:23.967Z"}
```

The union holds no Smart Files credential by design. The asymmetry is deliberate and documented as the confused-deputy refusal (CODE, `deploy/cloud-run-deploy.sh:70-78`). Its own entitlement resolver returns anonymous for a caller with no credential and **401s any caller that presents one**, because the entitlement authority is not wired (CODE, `apps/api/src/access/entitlement.ts:115-127`). So there is exactly one reachable path to the union today, the anonymous one, and on that path the room is always refused.

The union maps that refusal to `absent-verified`, with a scope bounded to "records the files service serves to this caller's credential" (CODE, `apps/api/src/upstreams/smart-files.ts`, `refusedRoom`). The reasoning is stated in the file and it holds: the verdict is true against the stated scope and it is re-runnable. It is the right call given the vocabulary available. It is still worth naming that **`absent-verified` is what a reader sees on every room, on every instrument, for a reason that has nothing to do with the instrument.** The basis sentence carries the entire correction, and a basis sentence is a weaker carrier than a verdict.

A second, quieter fact: the instrument scope in the store is **empty**. A real issuer node returned `"folders":[]` with a valid credential (LIVE). No instrument documents have been filed at all, so even a fully wired entitlement leg would return an empty room today.

### Finding G. The catalog is thin, and thin in a way a hit cannot reveal

Fifteen of the twenty-six symbols probed are absent (LIVE): `GOOG`, `TWTR`, `X`, `SQ`, `XYZ`, `FISV`, `FI`, `ANTM`, `ELV`, `RTN`, `RTX`, `ATVI`, `BRKB`, `BRK-B`, `SPX`. Every rename pair probed other than FB and META has neither side present, so **finding A has no siblings in the current catalog.** Not because renames were handled, but because those instruments were never minted. The exposure is latent rather than realised: any future rename of a symbol the platform does touch produces the same split, because the same machinery is still unfed.

The union already carries the right warning. Its search response states in as many words that there is no search index and an exact-symbol miss is not evidence of absence from the catalog (CODE, `EXACT_SYMBOL_ONLY_NOTE`, `apps/api/src/upstreams/cockpit.ts:47`). That note was earned: the comment above `resolveSymbol` records that this layer once reported a symbol as held by nothing while the catalog held 24 duplicate nodes for it (CODE, `apps/api/src/upstreams/cockpit.ts:276-286`).

### What could not be established

Three things, stated rather than guessed.

The **duplicate-node count** in production. `/admin/resolver/ambiguous` and `/admin/resolver/provisional` are operator-gated and refuse the service credential (LIVE: `/admin/nodes?limit=1` returns `401 {"detail":"Missing bearer token"}` with a valid service key). *Settled by* an operator session against those two routes.

The **symbol-keyed atom count**. `/admin/atoms` is operator-gated. *Settled by* the single SQL query given in section 1.

Whether the **8,334 fuzzy `issued_by` edges** named in the source comment (CODE, `app/models.py`, `EDGE_TYPE_ISSUED_BY`) are still that many. Live evidence is consistent with the trust boundary working: MSFT, AAPL, GOOGL, SPY, and QQQ all returned a trusted issuer, while FB, META, and GC returned the untrusted-link refusal with the rule stated (LIVE). *Settled by* `/admin/resolver/issuer-link-trust`.

## 4. The layering question

The operator's position is that anything touching a ticker should reference a twin. The evidence supports that for one group of surfaces and argues against it for another, and the boundary is sharper than "knowledge versus operations". The real discriminator is this:

**Does the answer change if the symbol string turns out to name a different company than the caller meant?**

For a knowledge read the answer is yes, and the read is wrong. For an operational read the answer is no, because a position, an order, and a fill are facts about a string the broker also holds. Re-keying them to a node would make the cockpit's answer disagree with the counterparty's.

### Group 1. Knowledge reads. These should reference a twin.

All are live routes on the cockpit today (LIVE, from `openapi.json`: 285 paths, 309 operations).

| Route | Why it belongs to the twin |
|---|---|
| `GET /fundamentals/{symbol}` | An issuer fact. A rename or a dual-class split makes it wrong |
| `GET /fundamentals/{symbol}/panel` | Same |
| `GET /providers/fmp/profile/{symbol}` | Issuer identity, verbatim from a vendor |
| `GET /providers/fmp/income-statement/{symbol}` | Issuer financials |
| `GET /providers/fmp/balance-sheet/{symbol}` | Issuer financials |
| `GET /providers/fmp/cash-flow/{symbol}` | Issuer financials |
| `GET /providers/fmp/ratios/{symbol}` | Derived issuer financials |
| `GET /providers/fmp/key-metrics/{symbol}` | Derived issuer financials |
| `GET /market/{symbol}/earnings` | An issuer event |
| `GET /market/etf-holdings/{symbol}` | A fund's portfolio, keyed to the fund's identity |
| `GET /market/similar/{symbol}` | A claim about which companies resemble which |
| `GET /market/related/{symbol}` | Same |
| `GET /futures/drivers/{symbol}` | The instrument-to-driver mapping. This is the contract's `drivers` layer |
| `GET /futures/curve/{symbol}` | A contract-identity fact |
| `GET /intelligence/adaptive-panel/{symbol}`, `/metrics`, `/reads` | Composed macro and issuer reads, presented as knowledge |
| `GET /intelligence/seasonality` | A historical claim about an instrument |
| `GET /intelligence/news` | Attribution of a story to a company |
| `GET /intelligence/key-levels` | Derived from history a rename would splice |
| `GET /intelligence/expected-move` | Same |
| `GET /intelligence/holistic-brief`, `/context`, `/narrative` | Narration over all of the above |
| `POST /zones/{symbol}/atoms` and its four siblings | Calibrated judgment records. Already node-aware, and already carrying the symbol fallback of finding D |
| `GET /market/iv-history/{symbol}`, `GET /market/iv-hv/{symbol}` | Long-horizon derived series |

Thirty-one operations. Every one answers some form of "what is this thing", and every one is keyed today by a symbol string with no node anywhere in the path.

### Group 2. Operational reads. These should not.

| Route group | Why not |
|---|---|
| `GET /positions`, `GET /positions/{symbol}/context` | The position is the broker's, keyed by the broker's symbol |
| `GET /orders/open`, `/orders/history`, `POST /orders/submit`, `/orders/evaluate`, `/orders/combo`, `/orders/{id}/cancel`, `/orders/{id}/modify` | Order routing. A node id would be translated back to a symbol at the broker boundary anyway |
| `POST /trade/place`, `GET /trade/orders`, `DELETE /trade/orders/{id}`, `/trade/impact`, `/trade/basket/size`, `/trade/capabilities` | Execution |
| The paper lifecycle: `POST /paper/order`, `/paper/enable`, `/paper/reset`, order cancel and modify, `GET /paper/status` | Simulated execution, mirroring the same shape |
| `GET /trade/staged` and the staged-trade lifecycle | A pending order |
| `GET /market/quote/{symbol}`, `/market/depth/{symbol}`, `/market/tape/{symbol}` | Execution-time price. Latency-sensitive, and the venue's symbol is the correct key |
| `GET /portfolio/analytics`, `/portfolio/greeks`, `/risk/var`, `/risk/correlation`, `POST /risk/payoff`, `/analytics/greeks` | Portfolio math over held positions |
| `GET /snaptrade/portfolio`, `/snaptrade/accounts`, `POST /snaptrade/sync` | The broker's own records |
| The bot lifecycle: `POST /bots/{id}/start`, `/stop`, `/pause`, `/resume`, `/kill`, `/flatten`, `GET /bots/{id}/fills` | Operating a running strategy |
| `POST /system/kill-switch`, `/system/live-mode/*` | Safety controls. Adding an upstream dependency to a kill switch is a defect, not an improvement |

About fifty operations as listed. The list is illustrative of the class rather than exhaustive.

### Group 3. The boundary cases, named because "it depends" is not an answer

**Market history (`GET /market/history/{symbol}`).** Operational when it feeds the chart a trader is looking at right now. **Knowledge when it spans a rename**, because a symbol-keyed bar series silently splices two companies' price histories together, or truncates one at the rename date. Recommendation: it stays operational, and the twin's `market.history` block, which the union already serves, is the one that must be node-keyed and stitched across the alias eras. That is the honest version and it is more work than it looks.

**Watchlists (`signal_heatmap_symbols`, `research_sessions.pinned_symbols_json`).** The operator's instinct is right here, and the reasoning is specific: a watchlist is a **durable user intention that outlives the symbol string**. An entry saying `FB` today should still point at the same company after the rename. It cannot, because `signal_heatmap_symbols.symbol` is a `unique=True` string column (CODE, `app/models.py:1352`) and `pinned_symbols_json` is a JSON array of strings (CODE, `app/models.py:288`). Recommendation: **watchlists carry a node id and display the current symbol resolved from it.** This is the highest-value node-keying change in the cockpit and it is small.

**Alerts (`alerts.symbol`).** The same argument as watchlists, with one qualification: an alert fires against a live price and the price feed is symbol-keyed. Recommendation: store the node id, resolve to the current symbol at evaluation time.

**Chart drawings (`chart_drawing_sets`, keyed `(user_id, symbol)`).** A drawing is anchored to price levels on a specific series. If the series is stitched across a rename the drawing must follow the node; if it is not, the drawing must stay with the string. Recommendation: **follow whatever market history does**, and do not decide it separately.

### The precise statement

Knowledge reads are the ones whose answer would be wrong if the symbol resolved to a different node than the caller meant. By that test, the thirty-one routes in group 1 plus watchlists and alerts belong behind the twin contract. The operational routes in group 2 do not, and the reason is not performance. It is that a position and an order are facts about the broker's symbol, and re-keying them would introduce a disagreement with the counterparty that does not exist today.

## 5. The cycle risk

**There is no cycle today, and the evidence is a null result taken carefully.** A grep across `apps/`, `packages/`, `infra/`, `scripts/`, and `docs/` in the trading repository for `smart-markets`, `smart_markets`, `SMART_MARKETS`, and the deployed hostname returns three hits, all in test files, all asserting that a minted node id matches the ULID regex in the smart-markets contract (CODE, `tests/test_tw25_resolver_served_capability.py:471,483` and `tests/test_tw44c_served_issuer_link.py:73`). No runtime code path, no client, no configured URL. The dependency is one-directional: the union reads the cockpit.

### Can the cockpit satisfy the twin natively?

Layer by layer, against the contract as it stands.

| Layer | Cockpit-native? | What it turns on |
|---|---|---|
| `node` | **Yes, fully.** The node, its shape, its identifiers, and its issuer link are all cockpit-owned, and `/securities/node/{id}` already serves the whole set | Nothing |
| `market` | **Yes.** All six quote blocks come from cockpit routes already (CODE, `cockpit-market.ts:28-57`). The cockpit reads its own store instead of making six HTTP calls | Nothing |
| `drivers` | **Yes, and more cheaply than the union can.** The mapping lives at `app/data/futures_catalog.json`, 33 driver rows over 11 futures roots, and resolves through `app/providers/futures_reference.py`, whose `drivers()` returns the typed-verdict shape the contract wants (CODE, `apps/api/src/upstreams/drivers.ts:60-68`). It has one caller in the whole repository, and that caller's only caller is a unit test. **No router imports the module.** The union cannot reach it at all; the cockpit already holds it in memory | Publishing a route, or calling the function directly |
| `roster` | **No, and neither can the union.** The roster has no served upstream anywhere. The survey found `GET /econ/board` as the only path matching officer, director, insider, board, or roster, and it serves FRED cards (CODE, `apps/api/src/upstreams/roster.ts:18-26`). `cik_crosswalk.py` parses an EDGAR `insiderTransactionForIssuerExists` boolean and is mounted on no router | An EDGAR ingest. Equal work on either side |
| `synthesis` | **Yes.** The cockpit already runs Anthropic and xAI providers behind a tool loop (CODE, `app/ai/`) | Nothing |
| `room` | **No.** This is the one | See below |

### What genuinely requires the union

**The room, and only the room.** The cockpit holds no Smart Files documents and has no client for that service. To serve the room natively it would need three things it does not have: a Smart Files HTTP client, the `SMART_FILES_API_KEY` credential, and a read-time access-policy gate over document `accessPolicy` values.

The third is the expensive one, and it is where the argument turns. The union's central commitment is that it **forwards the caller's entitlement and never substitutes a service credential**, enforced by `assertForwardsCallerIdentity` running over the finished outbound header set, with call-site headers applied last so an injected credential is visible to the check rather than silently scrubbed (CODE, `apps/api/src/upstreams/smart-files.ts:47-92`). A CI gate confines the one cockpit credential to three files, and the deploy script deliberately does not mount `SMART_FILES_API_KEY` at all.

Mounting that credential in the cockpit, and having the cockpit fetch documents on a user's behalf, recreates precisely the confused deputy the union exists to refuse, and does it inside a process that also holds positions, orders, and a live-trading kill switch. That is the concrete argument for keeping the union, and it is stronger than "the cockpit does not have the documents".

### Concretely, what would have to move

To make the cockpit twin-native for everything but the room:

1. A contract package the cockpit can validate against. `@smart-markets/contract` is TypeScript and the cockpit is Python, so this means either a JSON Schema generated and published from the contract package, or Pydantic models kept in lockstep by a conformance test. The contract package is already the single source of truth, so this is a build step and not a redesign.
2. Publish `futures_reference.drivers()` behind a route, or call it directly from a native twin composer. Either way this is the cheapest layer to close, and it is currently closed for no reason at all.
3. Fix the shape derivation at source. Finding B is upstream of everything else.

To keep the room where it is: nothing moves. The cockpit's native twin returns the room as a `lookup-failed` naming the store it does not hold, and the union composes both.

If the room ever moved into the cockpit: the Smart Files credential, a caller-entitlement forwarding discipline equal to the union's, and the read-time gate. Realistically that means porting `access/policy.ts` and `access/entitlement.ts` into a process that also arms live trades. This document does not recommend it.

### The recommendation, stated plainly

**A cockpit-native twin composer is sound for five of the six layers and is the right place for them.** It removes the symbol round-trip of section 2, removes six HTTP hops per market layer, and unlocks the drivers layer immediately. **The room stays behind the union**, for the credential-isolation reason above and not for a data-location reason. That makes the union a room-and-composition service rather than a full fan-out, which is a smaller thing than it is today, and the correct direction given that four of its five layers currently return typed absences.

**And it introduces the cycle.** A cockpit that composes a twin natively, plus a room it must fetch from the union, is cockpit to union to cockpit. The way out is that the union's room path must **not** call back for resolution. The cockpit already holds the node and can pass the governing node id in, and the union's room read is `readRoom(governingNodeId)`, which already exists as its own composition point and already takes a bare node id (CODE, `apps/api/src/twin/room.ts:82`). **The route that makes this safe is already built.** It must be the only union route the cockpit ever calls, and that deserves an enforced test rather than a convention.

## 6. The misfire list

Ranked by how quietly each one fails. The silent ones lead.

**1. ETFs and futures are served as operating companies, and nothing reports it.** (Finding B.) QQQ and SPY are live today as `shape: operating-company` with `authority: SEC/issuer-disclosure` and a company-shaped roster layer. Gold, crude, and the two equity-index futures are one display name away from joining them. Every guard in the union is total on its keys and refuses to default, and the wrong answer arrives anyway, because the default was applied in the cockpit at mint time. A consumer sees a well-formed twin with a plausible name and no absence anywhere pointing at the problem. **Fix this before building on the shape.** The change is at `resolver.py:394` and `resolver.py:888`, plus a curation pass over the existing nodes.

**2. One company holds two identities, and every downstream consumer silently picks one.** (Finding A.) Any atom, position, watchlist row, or twin read that touched `FB` is on one node, and anything that touched `META` is on the other, with no merge link and no way for a reader to know. The corporate-action machinery is built and correct and has never been fed. Every future rename does this again.

**3. `current_atoms.node_id` holds bare symbols, and the column name asserts otherwise.** (Finding D, representation 11.) `append_atom` validates consent, PII, evaluation scope, and backtest lookahead, and does not validate the one field the whole spec is built on. A live job writes ticker-keyed event atoms today. Anything reading the projection as node-keyed is wrong for an unknown fraction of rows, and nothing will say so.

**4. The zone-atom writer falls back to a bare symbol on any resolver failure.** (Finding D.) `except Exception: node_id = sym`. Calibrated judgment records, the most valuable atoms in the system and the ones the confidence loop is built on, can be silently filed under a string. The atom is written, the call returns 200, and the operator sees success.

**5. Resolution mints identity as a side effect, from eighteen internal call sites.** (Finding D.) The HTTP surface is split correctly and the in-process default is not. The catalog is therefore an accident of which worker touched which ticker first. Every node in it is `provisional` with zero identifiers (finding C), which makes the security master a symbol-to-ULID map with bitemporal machinery attached rather than a security master.

**6. Every room read returns `absent-verified` for a reason that has nothing to do with the instrument.** (Finding F.) The anonymous path is the only reachable one, Smart Files refuses anonymous callers outright, and the union's mapping is defensible against its stated scope. The verdict is still the strongest word in the vocabulary carrying the weakest content, with the whole correction sitting in the basis sentence. A reader who skims verdicts concludes that no company has filings.

**7. The union's node-to-price join is a symbol string.** (Section 2.) The system resolves a symbol to a node id and then throws the node id away to fetch prices. A node whose `current_symbol` is stale, or which is one of two nodes for one company, gets the wrong prices with no error. This is the cheapest join to break and it sits at the centre of the only populated layer.

**8. The drivers layer is empty for no reason.** Thirty-three curated driver rows over eleven futures roots exist in the cockpit, in the exact typed-verdict shape the contract wants, reachable only by a unit test. The union cannot get at them because no route exposes them. Not silent, since the absence is loud and correct, but it is the largest gap closable with the least work, and it stays open only because the wrong process is being asked to close it.

**9. Smart Files accepts node ids it cannot verify.** (Section 2.) Form-checked, never existence-checked. Documents can be filed against a node that names nothing, and the first symptom would be a room that is permanently empty for an instrument someone believes they filed against.

**10. Both working trees are behind their remotes, and the drift is load-bearing.** `smart-markets` by 40 commits, `smart-files` by 5. A reader of either local tree concludes the cockpit adapter is unwired and that Smart Files has no instrument scope. Both conclusions are false, and both are the kind that get acted on. Not an architecture defect, but it is the reason this study nearly produced two wrong findings, and any future review that reads a working tree will hit it again.

## What this document does not settle

It does not rule on the layering. It establishes the evidence for a ruling and states a recommendation with its reasoning, which is a different thing.

It does not count duplicate nodes, symbol-keyed atoms, or fuzzy issuer edges. Those three numbers need one operator session and one SQL query, and all three are named with the exact command in section 3.

It does not evaluate whether the roster layer is worth building. It establishes only that no upstream serves it, and that the cost is identical on either side of the union boundary.
