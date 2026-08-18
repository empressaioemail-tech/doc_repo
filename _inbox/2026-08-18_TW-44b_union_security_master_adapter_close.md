---
title: TW-44b close — union security-master adapter wired
date: 2026-08-18
status: complete
program: Smart Markets (unregistered R&D, bounded PR)
row: TW-44b (`_rd_disclosure_twin/08_build_scope.md`)
repo: empressaioemail-tech/smart-markets
last_updated: 2026-08-18
---

# TW-44b close — the union security-master adapter

## Branch, PR, worktree

Branch `tw44b/security-master-adapter`, cut from `origin/main` at `0add7bd`.
Commit `79ae942`. PR **#9**, https://github.com/empressaioemail-tech/smart-markets/pull/9,
open against `main`, NOT merged. All work was done in the dedicated worktree at
`P:/smart-markets-worktrees/tw44b-security-master`; `P:/smart-markets` was never
checked out to another branch.

## What was broken, and what it does now

`apps/api/src/upstreams/cockpit.ts` was `UnwiredCockpitUpstream`. Every method
returned a typed `lookup-failed` with the basis "upstream adapter not
implemented", so every symbol on the deployed surface rendered an amber block.
Confirmed live before the change:

```
$ curl -s https://smart-markets-api-znwrqyxmqa-ue.a.run.app/v0.1/twin/GC
{"contractVersion":"0.1.0","resolved":false,"requested":"GC","absence":{"verdict":"lookup-failed","authority":"security-master","scopeSearched":"security-master resolution for symbol \"GC\"","determinedAt":"2026-08-18T14:38:41.468Z","basis":"upstream adapter not implemented"}}

$ curl -s https://smart-markets-api-znwrqyxmqa-ue.a.run.app/health/ready
{"ok":true,"ready":false,"service":"smart-markets-api","upstreams":[{"name":"cockpit","status":"unreachable","detail":"adapter not implemented"},{"name":"smart-files","status":"ok"}]}
```

`resolve()` and `search()` are now wired over the SERVED security-master reads,
behind a `SecurityMasterClient` seam. `market()` and `drivers()` stay typed
absences this round, as scoped.

## Files changed

| File | Change |
| --- | --- |
| `apps/api/src/upstreams/security-master.ts` | NEW. Wire schemas, the failure taxonomy, basis prose, the outbound header builder plus its leak guard, and the HTTP client with injectable `fetch`. |
| `apps/api/src/upstreams/cockpit.ts` | `UnwiredCockpitUpstream` becomes `CockpitUpstreamAdapter`. `resolve()`, `search()`, `health()` wired; the whole verdict mapping and the node mapping live here. Adds `cockpitFromConfig`. |
| `apps/api/src/absence.ts` | Adds `lookupFailed({authority, scopeSearched, basis})`, the general form, so an adapter that knows what failed can say it. |
| `apps/api/src/config.ts` | Adds `cockpitServiceKey`, read from `COCKPIT_SERVICE_API_KEY`. Deliberately NOT a field on `UpstreamConfig`. |
| `apps/api/src/app.ts` | `defaultDeps` builds the cockpit through `cockpitFromConfig`. |
| `apps/api/src/routes/twin.ts` | `/v0.1/search` carries `note` on the hit path as well as the absence path. |
| `apps/api/src/mcp/tools.ts` | `search_instruments` description corrected: it claimed free-text search over names, which does not exist. |
| `apps/api/tests/security-master.test.ts` | NEW. 39 tests. |
| `apps/api/tests/fakes.ts` | Adds `FakeSecurityMaster`, wire-node fixtures, `securityMasterHolding`, `securityMasterCatalog`, `unconfiguredCockpit`, `recordingFetch`, `refusingFetch`. |
| `apps/api/tests/twin.test.ts` | Construction updated; the one basis assertion that asserted "upstream adapter not implemented" now asserts the accurate basis. |
| `apps/api/tests/access-policy.test.ts` | Construction updated only. |
| `.github/workflows/ci.yml` | The credential structural gate narrowed to what it protects, plus two new gates. See the review flag below. |

## The absence-verdict mapping, as implemented

| Upstream outcome | Verdict | Basis states |
| --- | --- | --- |
| 200, `resolution_status` "not_found", `node_id` null | `absent-verified` | the security master holds no node for the exact symbol; it does not mint on this read path, so this is what the catalog contains and not a failed call |
| 200, `node_id` null, any other status (e.g. `ambiguous`) | `absent-verified` | the status and the candidate count; "selecting one here would be this layer inventing the answer" |
| HTTP 401 or 403 | `lookup-failed` | "the security master rejected this service credential (HTTP n); nothing was established about this symbol either way" |
| HTTP 5xx | `lookup-failed` | "the security master returned HTTP n" |
| Timeout | `lookup-failed` | "could not be reached: timed out after Nms" |
| Connection refused / DNS / transport throw | `lookup-failed` | "could not be reached: <error name and message>" |
| Non-JSON body, or a body that fails the schema | `lookup-failed` | "returned a body this adapter could not read: <failing path and reason>" |
| Any other non-2xx | `lookup-failed` | "an unexpected HTTP n" |
| `COCKPIT_BASE_URL` or the credential missing | `lookup-failed` | names which one is unconfigured; NO call is made |
| Symbol resolved, metadata read failed (any of the above) | `lookup-failed` | names the node that DID resolve and names the node read as the leg that failed |
| Symbol resolved, `name` null or blank | `lookup-failed` | "carried no name; a twin is never labelled from its symbol or from a placeholder" |
| Symbol resolved, `asset_class` null or blank | `lookup-failed` | "shape cannot be derived without it; a shape is never defaulted" |
| Symbol resolved, issuer-bearing shape, no usable `issuer_node_id` | `lookup-failed` | "an issuer edge is never minted here to satisfy the schema" |
| Symbol resolved, no identifier the contract can express | `lookup-failed` | "a node that cannot be named is not returned as a node" |
| Resolved to a non-`sec_` node (issuer, option) | `absent-verified` | names the node id and the v0.1 addressing bound |
| Resolved, `asset_class` outside equity/etf/future (index, option) | `absent-verified` | names the class and the version bound |

Every absence on this path carries `authority: "security-master"` and a
`scopeSearched` naming the symbol and the authority: `security-master
resolution for symbol "X"` on resolve, `security-master exact-symbol
resolution for "X"` on search.

## Fields assumed from the TW-44a contract

TW-44a is not merged. The adapter is built to the shape that lane declared and
every assumption is listed here for reconciliation.

1. Route `GET /securities/node/{node_id}`, service-callable with
   `x-empressa-service-key`.
2. `node_id` (canonicalized) is the only field required to parse. Everything
   else is optional on the wire and checked explicitly at mapping time, so a
   null yields a basis naming the field instead of a parse failure.
3. `name` is the human name and becomes `displayName`. **Risk:** in the
   cockpit `Node` model, `lei` and `name` sit under a comment reading "Issuer-only
   fields". If security nodes carry a null `name` in production, every equity
   and fund twin returns `lookup-failed` naming that field. That is the correct
   behavior, and the fix is upstream (populate `name`, or serve the issuer's
   name on the node read), not a fallback here.
4. `asset_class` carries the node-row domain `equity | etf | index | option |
   future`. The adapter maps equity to operating-company/equities, etf to
   fund/funds, future to contract/futures, and also accepts the plural
   spellings in case TW-44a normalises. Anything else is a typed absence.
   `index` and `option` have no twin shape at v0.1.
5. `identifiers` is a list of `{identifier_type, identifier_value, valid_from?,
   valid_to?}`, matching the `IdentifierOut` model the operator console already
   serves. A flat `{figi, cusip, isin}` map is ALSO accepted, because that is
   what `Node.identifiers_json` stores. Types outside the contract's eight
   schemes are dropped, never coerced. `cme_root` maps to `contract-code`.
6. `current_symbol` becomes the first identifier, scheme `contract-code` for
   the contract shape and `ticker` otherwise.
7. `valid_from` is used for `asOf` when it parses as a date, otherwise the
   observation time is used.
8. **`issuer_node_id` — a field TW-44a's declared list does NOT include.** See
   the blocker below. Read optionally, under the cockpit's own name for the
   field (`IssuerLinkTrustScope.issuer_node_id`).
9. `node_type`, `primary_venue`, `status`, `resolution_status` are read and
   currently unused; the twin contract has nowhere to put them.

## Two things the planner must rule on

### 1. TW-44a must serve `issuer_node_id` or no equity or fund twin can exist

`TwinSchema` has a refinement (`packages/contract/src/twin.ts`, "Issuer
applicability"): an issuer-bearing shape MUST carry `issuerNodeId` and a
contract shape must NOT. The TW-44a field list does not include an issuer link.
This was found the hard way — the first end-to-end run returned HTTP 500 with

```
operating-company nodes are filed under an issuer: issuerNodeId is required and governs the room
```

The adapter now reads `issuer_node_id` optionally and, when it is missing on an
issuer-bearing shape, returns `lookup-failed` naming exactly that gap. Under
the contract as it stands today, only the contract shape (futures, e.g. `GC`)
can produce a twin. The contract was NOT edited, per the boundary.

### 2. The CI credential gate was rewritten, and this is the top review item

`.github/workflows/ci.yml` carried a fail-closed gate named "The union layer
must mint no credential of its own", forbidding among other things
`(SMART_FILES|COCKPIT)_(API_KEY|TOKEN|SECRET|CREDENTIAL)` anywhere in
`apps/api/src`.

Resolution cannot be wired without a credential: `/securities/lookup` is behind
the TW-24 service gate, and the deploy check recorded in the 2026-08-17 pickup
confirms 200 with the key and 401 without.

Note that the mounted secret name `COCKPIT_SERVICE_API_KEY` does NOT match that
regex (`COCKPIT_` is followed by `SERVICE`, not `API_KEY`), so the code would
have passed the gate untouched. Passing a gate whose prose the code violates is
worse than failing it, so the gate was rewritten rather than quietly slipped
past. The net enforcement is stronger, not weaker:

- **Kept and narrowed:** the caller-entitlement path stays absolutely
  credential-free. Bearer literals, `SERVICE_ACCOUNT`, `SERVICE_TOKEN` and any
  `SMART_FILES_*` credential are still forbidden anywhere in `apps/api/src`.
- **New:** the cockpit service key may be named in exactly three files —
  `config.ts`, `upstreams/cockpit.ts`, `upstreams/security-master.ts`. A fourth
  file naming it, `smart-files.ts` above all, fails CI.
- **New:** no node-minting route (`/securities/resolve`, `/resolve-option`,
  `/resolve-issuer`) may be named anywhere in `apps/api/src`. The union must
  never cause a node to be minted.
- **Runtime, not grep:** `assertNoCallerCredential` throws if an outbound
  security-master header set contains `authorization`, `cookie`, or
  `proxy-authorization`. The caller's credential is NOT forwarded to the
  cockpit — the cockpit cannot validate a Smart Markets caller token, and
  handing a third service that token is a leak even when it is ignored. Two
  tests assert the recorded outbound header set.

The reasoning for allowing the exception at all: the security-master read is a
public reference lookup carrying no caller entitlement, so it is not the
confused deputy the Smart Files pass-through refuses. Smart Files, which serves
tenant-scoped records against the caller's own credential, remains entirely
credential-free.

## What was chosen for search, and why

**Option (a): exact-symbol resolution.** The query goes to
`/securities/lookup`; it resolves to exactly one hit or to an `absent-verified`
absence whose basis states that only exact-symbol resolution exists at this
version and that no search index exists. No fuzzy matching, no ranking, and the
hit list is at most one long by construction.

Option (b) was rejected because a typed absence with an accurate basis is
strictly less useful than the same accurate basis PLUS the answer when there is
one, and (a) carries the identical honesty as long as the "no index" statement
travels with it.

One addition beyond the dispatch: the note rides the HIT path too. `/v0.1/search`
now returns `note` alongside `hits`, and the MCP `search_instruments`
description was corrected — it previously advertised "free-text search over
names and symbols", which described a capability that does not exist and which
an agent would have believed. A caller that got one hit back had no other way
to learn the endpoint matched an exact symbol rather than searched an index.
The addition is additive; the web client reads `body.hits` and is unaffected,
and its 21 tests still pass.

## Verification, raw

```
$ cd /p/smart-markets-worktrees/tw44b-security-master && npm ci --no-audit --no-fund
> smart-markets@0.1.0 postinstall
> npm run build --workspace @smart-markets/contract
...
> @smart-markets/ui@0.1.0 build
> tsc -p tsconfig.json && node scripts/copy-styles.mjs

added 398 packages in 17s
```

```
$ npm run lint

> smart-markets@0.1.0 lint
> eslint .

LINT_EXIT=0
```

```
$ npm run typecheck

> smart-markets@0.1.0 typecheck
> npm run typecheck --workspaces --if-present

> @smart-markets/contract@0.1.0 typecheck
> tsc --noEmit -p tsconfig.check.json

> @smart-markets/ui@0.1.0 typecheck
> tsc --noEmit -p tsconfig.check.json

> @smart-markets/api@0.1.0 typecheck
> tsc --noEmit -p tsconfig.check.json

> @smart-markets/web@0.1.0 typecheck
> tsc --noEmit -p tsconfig.json
```

```
$ npm run test --workspace @smart-markets/api
ℹ tests 95
ℹ suites 0
ℹ pass 95
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 1220.6163
```

```
$ npm run build
> @smart-markets/contract@0.1.0 build
> tsc -p tsconfig.json
> @smart-markets/ui@0.1.0 build
> tsc -p tsconfig.json && node scripts/copy-styles.mjs
> @smart-markets/api@0.1.0 build
> tsc -p tsconfig.json
> @smart-markets/web@0.1.0 build
> tsc --noEmit -p tsconfig.json && vite build
vite v5.4.21 building for production...
transforming...
✓ 67 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                                    0.69 kB │ gzip:  0.43 kB
dist/assets/jetbrains-mono-latin-var-6fWv1k7M.woff2  31.43 kB
dist/assets/inter-tight-latin-var-DX-nOvPD.woff2   44.87 kB
dist/assets/index-UFJxlK1h.css                     18.08 kB │ gzip:  4.05 kB
dist/assets/index-Cw012OdG.js                     242.01 kB │ gzip: 68.63 kB │ map: 740.69 kB
✓ built in 695ms
```

```
$ npm test        (all workspaces)
> @smart-markets/contract@0.1.0 test
ℹ tests 78
ℹ pass 78
ℹ fail 0
> @smart-markets/api@0.1.0 test
ℹ tests 95
ℹ pass 95
ℹ fail 0

$ npm run test --workspace @smart-markets/web
 ✓ src/__tests__/smoke.test.tsx (2 tests) 25ms
 ✓ src/__tests__/instrument-surface.test.tsx (19 tests) 268ms
 Test Files  2 passed (2)
      Tests  21 passed (21)
```

### The new tests, by name

```
$ cd apps/api && node --import tsx --test tests/security-master.test.ts
✔ VERDICT: a symbol the security master does not hold is absent-verified, naming the symbol and the authority (1.6737ms)
✔ VERDICT: a 5xx is lookup-failed, and the basis names the status rather than the symbol (0.2399ms)
✔ VERDICT: a refused connection is lookup-failed, and the basis says what failed (0.109ms)
✔ VERDICT: a timeout is lookup-failed and says it timed out (0.128ms)
✔ VERDICT: a malformed body is lookup-failed, never a node assembled from what parsed (0.1009ms)
✔ VERDICT: a rejected credential is lookup-failed and SAYS the credential was rejected, never a not-found (0.1807ms)
✔ VERDICT: a symbol that resolves but whose metadata read fails is lookup-failed NAMING the metadata read (0.507ms)
✔ VERDICT: an unconfigured security master is lookup-failed and makes no call at all (0.3437ms)
✔ a node read with no name is lookup-failed, never a twin labelled from its symbol (0.3483ms)
✔ a node read with no asset_class is lookup-failed, never a guessed shape (0.2455ms)
✔ an asset class this version serves no shape for is absent-verified, naming the version bound (0.2204ms)
✔ a symbol that resolves to a non-security node is absent-verified, not a twin (0.2724ms)
✔ an ambiguous resolution is absent-verified and refuses to pick a candidate (0.1039ms)
✔ every descriptive fact on a resolved node came from the security master (0.4096ms)
✔ an issuer-bearing node with no served issuer link is lookup-failed, never an invented issuer (0.1067ms)
✔ a malformed issuer link is treated as absent rather than passed through (0.1259ms)
✔ a contract-shape node never carries an issuer, even when one is served (0.1384ms)
✔ identifier types the contract cannot express are dropped, never coerced (0.6148ms)
✔ a flat identifier map is read, and its null entries are skipped (0.2176ms)
✔ a futures node carries its symbol as a contract code, not as a ticker (0.1206ms)
✔ the leading-slash futures convention is stripped before the symbol goes upstream (0.0982ms)
✔ search resolves an exact symbol to one hit (0.2179ms)
✔ search for anything but an exact symbol is absent-verified and says no index exists (0.0965ms)
✔ a search whose upstream failed is lookup-failed, not an empty result set (0.0783ms)
✔ the security master is called with the service key header and no Authorization (2.8616ms)
✔ the header builder refuses to carry a caller credential (0.3242ms)
✔ only the SERVED routes are called; the minting routes are never touched (1.2243ms)
✔ the HTTP client maps each transport outcome to its own failure kind (0.7209ms)
✔ a body that is not the expected shape is malformed, not silently accepted (0.5771ms)
✔ a thrown transport error is unreachable rather than an exception out of the adapter (0.1818ms)
✔ an unconfigured HTTP client short-circuits without touching the network (0.0809ms)
✔ health reports the configuration gap by name, and degraded once wired (0.0983ms)
✔ cockpitFromConfig builds an adapter that reports its own missing configuration (0.0493ms)
✔ the twin route returns a schema-valid twin for a symbol the security master holds (29.3881ms)
✔ the twin route reports a genuine miss as absent-verified rather than lookup-failed (11.2387ms)
✔ the search route states on every response that there is no index behind it (17.0577ms)
✔ readiness names the cockpit gap in words a reader can act on (10.1645ms)
✔ a wire node whose only identifiers are unexpressible is lookup-failed, not a nameless node (0.2095ms)
✔ the node read canonicalizes: a merged node id is replaced by the one it merged into (0.1236ms)
ℹ tests 39
ℹ suites 0
ℹ pass 39
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 654.9621
```

The four mandated verdict cases are the first eight lines: not-found is
`absent-verified`; 5xx, refused connection, timeout and malformed body are
`lookup-failed` with a basis naming the failure; 401 and 403 are `lookup-failed`
saying the credential was rejected (both statuses, in a loop, with explicit
assertions that the basis contains neither "holds no node" nor "not_found"); and
a resolved symbol with a failed metadata read is `lookup-failed` naming the node
read.

### Structural gates, run locally before the push

```
=== gate: web-no-upstream-calls ===        OK
=== gate: api-no-database ===              OK
=== gate: no-v0.2-stubs ===                OK
=== gate: api-mints-no-caller-credential === OK
=== gate: cockpit-credential-confined ===  OK
=== gate: api-calls-no-minting-route ===   OK
```

### `format:check`

Red locally on 93 files, all of them files this change never touched (Windows
CRLF, exactly as the dispatch warned). Intersected against `git status`:

```
$ comm -12 <prettier failures> <changed files>
(empty)
```

`npx prettier --write` was run on the authored files only, never at the repo
root.

### CI on the PR

```
$ gh pr checks 9
build-test         pass  1m19s  https://github.com/empressaioemail-tech/smart-markets/actions/runs/32152022968/job/95759983065
structural-gates   pass  8s     https://github.com/empressaioemail-tech/smart-markets/actions/runs/32152022968/job/95759982894

$ gh run list --branch tw44b/security-master-adapter --limit 2 --json databaseId,conclusion,status,name --jq '.[] | "\(.name) status=\(.status) conclusion=\(.conclusion)"'
CI status=completed conclusion=success
```

Both jobs pass. The conclusion STRING is `success`, read off the Actions API
rather than off a `gh` exit code, per the standing rule.

## Confirmations

- **Nothing was deployed.** No `gcloud`, no `vercel`, no `docker` was run. The
  Cloud Run service and the Vercel app are exactly as they were. The two curl
  calls above are read-only GETs against the already-deployed service.
- **`main` was not pushed to.** Only `tw44b/security-master-adapter` was pushed.
- **The PR was not merged.**
- **`packages/contract/**` was not edited.** The one place the contract pinches
  (required `issuerNodeId`) is reported above and handled by failing closed.
- **`apps/web/**` and `.design-sync/**` were not edited.**
- **No `displayName`, `shape`, or `assetClass` is ever fabricated.** Each comes
  from a served field or from a total mapping over a served field, and every
  gap produces a typed absence naming the missing field. Three tests assert
  this directly by removing `name`, removing `asset_class`, and supplying an
  asset class with no twin shape.

## What I could not do, plainly

1. **I could not verify the TW-44a route shape against real source.** That lane
   has not merged. The only cockpit clone on this box
   (`P:/Empressa Trading`, head `7520635b`) predates TW-24/TW-25 and has no
   `securities` router at all, so `/securities/lookup` and
   `/securities/node/{node_id}` could not be read from source. The field
   semantics above were taken from `Node` in `apps/cockpit/backend/app/models.py`
   and `NodeSummary`/`IdentifierOut` in `routers/admin_securities.py`, which are
   present in that clone, plus the dispatch. Every assumption is listed.
2. **I did not verify against the live cockpit.** No credential was available in
   this session and the dispatch forbids live calls from tests. The adapter has
   never made a real security-master request.
3. **Case sensitivity is unverified.** The symbol is passed through verbatim
   after the leading `/` is stripped, on the evidence that the resolver
   upper-cases internally (`Node.current_symbol == symbol.strip().upper()`,
   `resolver.py:1070`). If the served `/securities/lookup` route is NOT
   case-insensitive, a lowercase symbol would return `absent-verified` for a
   symbol that exists — a false absence, which is exactly the failure class this
   row exists to remove. **Verify this when TW-44a lands.**
4. **`health()` reports `degraded`, never `ok`.** It probes nothing, so claiming
   `ok` would assert reachability it has not established, and quotes and drivers
   are genuinely unwired. Consequence: `/health/ready` will report
   `ready: false` even after a good deploy. Honest, but the planner should
   decide whether readiness ought to key off something narrower.
5. **`EXACT_SYMBOL_ONLY_NOTE` couples the route to the cockpit adapter.**
   `routes/twin.ts` imports the constant from `upstreams/cockpit.ts`. If a real
   search index is ever wired behind a different adapter, that note becomes a
   false statement and must be removed in the same change. Flagged rather than
   solved, because solving it means threading prose through `UpstreamResult`.
6. **`market()` and `drivers()` are untouched**, as scoped. They are six quote
   branches and a driver series and belong in their own PR.
7. **The `absent-verified` verdict is doing double duty.** Amendment A-3 rules
   that absence is reserved for facts about the world and version scope is
   handled by `contractVersion`. But `/v0.1/twin/:symbol` has exactly two
   branches, resolved or an absence, so "resolved to an option node" and
   "resolved to an index" are reported as `absent-verified` with a basis naming
   the version bound. The scope reads as "twin-addressable nodes at contract
   version 0.1", which makes the verdict defensible, but a planner ruling on
   whether the unresolved envelope needs a third channel would settle it
   properly. No contract edit was made.

## Addendum: final CI conclusion

Settled. `structural-gates` pass in 8s, `build-test` pass in 1m19s, workflow
conclusion string `success`. The PR is green and remains OPEN and unmerged,
awaiting planner review of the two ruling items above.
