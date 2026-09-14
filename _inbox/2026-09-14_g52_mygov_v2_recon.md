---
id: 2026-09-14_g52_mygov_v2_recon
title: G-52 recon — MyGov on smartcity-dashboards, read-live or copied, and whether it is tenant-scoped
date: 2026-09-14
status: recon finding, READ-ONLY, nothing changed
kind: recon
plan_row: G-52 (90_operations/OPS-17_govtech_stack_plan_of_record.md)
repo: smartcity-dashboards
owner: nick
---

# G-52 recon — MyGov on the v2 city dashboards

## Snapshot

Product repo `P:/smartcity-dashboards`, authoritative ref `origin/main`, commit
`86487fa962173d5bd5deb5258b500e4e6b7d4e4f` (2026-09-04). Local HEAD was
`34b307b87683fb72de71c2163ac21c494b9fbe75`, 43 commits behind; every read below is against
`origin/main`, none against the working tree.

Deployed surface read live 2026-09-14: Cloud Run service `smartcity-dashboards`, project
`smartcity-dashboards`, region `us-east1`. Serving revision `smartcity-dashboards-00062-ful`
at 100 percent of traffic, read by field name out of the traffic JSON, not a positional
formatter. Image digest `sha256:fa5c2c3324dd7b0f619359ba4b7fc89d7d4743c3f8bb6ba2e246ccc5b8045a11`.

Canon read against `P:/doc_repo` at `3e287bc8` and cross-checked against the second clone
`C:/Users/cente/doc_repo` at `d07fd452`.

## Verdict

**MyGov data is READ LIVE, per request, and is NOT copied into this product's database.**

This product's Neon store contains exactly one table, `city_packs`, whose DDL is in
`src/city-pack.mjs` lines 145 to 158. It holds pack metadata: city key, FIPS, display name,
access policy, lenses, granted adapters, environment, fixture flags, notes. There is no
`mygov_permits` table, no permit table, no record table of any kind. The only `CREATE TABLE`
and the only `INSERT INTO` in the entire repository name `city_packs`. Nothing anywhere
writes a MyGov row to durable storage.

Instead, `src/mygov-permits.mjs` and `src/mygov-live.mjs` make outbound server-to-server GET
calls, per request, with a fifteen second timeout, and map the response into a response
envelope that is never persisted. Every record carries
`readAtBasis: "read live for this request; not cached, not generated"`
(`src/mygov-permits.mjs:87`, `src/mygov-live.mjs:153`).

**It is tenant-scoped, and the gate fires on the deployed surface.** Verified by violation,
not by observing a pass: every `bastrop_tx` route answered an anonymous caller `401` on the
live service today, while `template-city` answered `200` with fixture records on the same
routes and the same service in the same minute.

**The one line that matters most is not crossed.** No MyGov data reaches the Hauska spine,
the atom store, SmartSite, a public parcel rail, or any anonymous endpoint. It reaches a
parcel-level view, but that view is the tenant-private Bastrop pack's own page, gated the
same way its records are, and it is a read-through rather than a deposit.

**Two real defects sit underneath the verdict.** A governance one: the work cites three
decision records as its authorization and none of the three exists in either doc_repo clone,
and no G-116 or G-117 row exists in OPS-17. And a code one: the tenant binding between a pack
and the upstream data it receives is stamped rather than checked, and the equivalent check
does exist on the fixture path. Both are in sections 9 and 5 below.

## 1. Every MyGov code path on origin/main

Searched case-insensitively for `mygov`, `my_gov` and `my-gov` across all file types on
`origin/main`. `my_gov` and `my-gov` have zero hits anywhere. `mygov` has roughly 190 hits.
The non-test source files that carry a MyGov code path, as opposed to a string, are these.

| File | What it is |
|---|---|
| `src/mygov-permits.mjs` | The permits live read. 191 lines, the whole file. |
| `src/mygov-live.mjs` | Work orders, inspections, code violations, business licenses. 294 lines, the whole file. |
| `src/adapters.mjs` | The `mygov` adapter kind (line 15), its record shapes, and `PLATFORM_MYGOV_PERMITS_GRANT` (line 846). |
| `src/city-pack.mjs` | The grant attached to the `bastrop_tx` pack (line 129). |
| `src/server.mjs` | `REAL_LIVE_DOMAINS` (lines 45 to 56) and the five route branches that dispatch to it. |
| `src/property-map.mjs` | Reads permits, violations and inspections for one address through a different upstream route. |
| `src/domains/permits-pipeline.mjs`, `work-orders.mjs`, `inspections.mjs`, `code-violations.mjs`, `business-licenses.mjs` | The five FIXTURE generators. These read no network and no city. They are the `template-city` demo path. |
| `src/domains.mjs` | Registers the five domains as `gatedBy: "mygov"`. |
| `src/shell-homes.mjs` line 127 | Declares MyGov's disposition on the served source register. See section 10. |
| `web/index.html`, `web/app.js`, `web/property-map.js` | Labels and provenance chrome only. No data path. |

Test files carrying MyGov assertions: `adapters.test.mjs`, `city-pack.test.mjs`,
`city-identity.test.mjs`, `compose.test.mjs`, `department-domains.test.mjs`,
`domains-dev-services.test.mjs`, `domains.test.mjs`, `ds-render.test.mjs`, `fixtures.test.mjs`,
`lens-claims.test.mjs`, `mygov-live.test.mjs`, `mygov-permits.test.mjs`.

## 2. What the g116 and g117 work built

Fifteen merged pull requests, #41 through #56, between 2026-09-03 and 2026-09-04.

`8f61062` #42 built the first real feed: `src/mygov-permits.mjs` at 181 new lines,
`PLATFORM_MYGOV_PERMITS_GRANT`, and the first real branch in `server.mjs`.

`07e4530` #43 built `src/mygov-live.mjs` at 273 new lines, adding work orders, inspections,
code violations and business licenses through one shared fetch.

`d17085c` #44 built `src/vendor-live.mjs` at 289 new lines and added five non-MyGov grants:
Samsara, Spireon, FirstDue, Power BI and GoTo. This is the commit behind the
`g116-vendor-auth` tag.

`181f588` #45 is the one that changes the security surface, and it is worth reading in full.
It bootstraps a Hauska tenant key into the browser: a one-time `?hauskaKey=` query parameter
seeds `localStorage`, `replaceState` strips the parameter from the visible URL, and a thin
`window.fetch` wrapper attaches `x-hauska-key` to same-origin `/api/` requests only
(`web/app.js` lines 24 to 60). Its own commit message calls it "the smallest bridge, not a
login system."

`6aed1a5` #46 through `646ed3e` #52 are field enrichment and honest-tile fixes.

`bd08d0d` #53 through `86487fa` #56 are G-117: the native Leaflet property map that replaces
the SmartSite iframe for `bastrop_tx` only, plus four always-on GIS overlays, plus a 52-key
layer catalog.

Note what `bd08d0d` did. For the real Bastrop pack, this product stopped embedding SmartSite
and started serving its own map page. `src/compose.mjs` line 269 returns
`/property-map.html?cityKey=...` instead of the SmartSite embed URL, and only when
`pack.cityKey === "bastrop_tx"` and `pack.generatesFixtures !== true`. The README's "No
Leaflet island" rule is explicitly overridden for this one page, citing a 2026-09-04 operator
decision. See section 9 on that decision.

## 3. Read versus copy

Read. Established three ways.

First, enumeration of the write surface. Grepping `origin/main` for `method: "POST"`,
`"PUT"`, `"PATCH"`, `"DELETE"` across all non-test source finds exactly two outbound writers:
`src/files-client.mjs`, imported by `src/municode-calendar.mjs` and by nothing else, and
`src/shell-state.mjs`'s `deliverFeedback`, which POSTs a message string, a surface string and
a city key to `FEEDBACK_DESTINATION`. No MyGov module imports `files-client`. No MyGov module
issues any request with a method other than the default GET.

Second, enumeration of the schema. `CREATE TABLE` appears twice on `origin/main`, both naming
`city_packs`. `INSERT INTO` appears twice, both naming `city_packs`. `src/db.mjs` is 26 lines
and holds a pool plus a `SELECT current_database()` ping.

Third, the product encodes the prohibition as a gate. `src/adapters.mjs:163`:

```js
if (!WRITE_TARGETS.has(grant.writesTo)) {
  throw new Error("writesTo must be spine or files, not a local table");
}
```

and `src/adapters.test.mjs:51` proves it fires on the exact forbidden value:

```js
assert.throws(
  () => assertAdapterKindShape({ id: "mygov", writesTo: "mygov_permits", ... }),
  /spine or files/,
);
```

A grant declaring `mygov_permits` as its write target cannot be constructed. The
2026-08-17 instruction "Destination is not Dashboards Neon and not a copied `mygov_permits`
table" was not merely obeyed, it was turned into a control that refuses.

One nuance that has to be stated rather than glossed. `PLATFORM_MYGOV_PERMITS_GRANT` declares
`writesTo: "spine"`. That reads alarming and is not. The grant's own comment
(`src/adapters.mjs` lines 831 to 845) says it plainly: "this grant does not literally write
anywhere, it is a live server-to-server read-through." The field describes the record's
conceptual home in the adapter catalog, not a mechanism. I checked for an actual spine write
independently rather than accepting the comment: `HAUSKA_RETRIEVAL_URL` is consumed only by
`src/compose.mjs`'s `readAtoms`, whose single fetch call (`timedFetch`, line 46) passes
headers and an abort signal and no method, so it is a GET. There is no write path to the
spine in this repository.

## 4. Where the data comes from

MyGov has no API for us. This product does not call MyGov. It calls the v1 SmartCity OS API,
server to server, on a platform-internal route family that v1 exposes for this purpose.

Host, every call: `smartcity-api-7dyaiy7wha-uc.a.run.app`.

| Resource | Path | Module and line |
|---|---|---|
| Permits | `/api/platform/mygov/permits` | `mygov-permits.mjs:34` |
| Work orders | `/api/platform/mygov/work-orders` | `mygov-live.mjs:18` plus path `work-orders` |
| Inspections | `/api/platform/mygov/inspections` | `mygov-live.mjs:18` plus path `inspections` |
| Code violations | `/api/platform/mygov/code-violations` | `mygov-live.mjs:18` plus path `code-violations` |
| Business licenses | `/api/platform/mygov/business-licenses` | `mygov-live.mjs:18` plus path `business-licenses` |
| Property summary | `/api/platform/property-intel/summary` | `property-map.mjs:56` |
| Property layers | `/api/platform/property-intel/layers` | `property-map.mjs:67` |
| Samsara vehicles | `/api/platform/samsara/vehicles` | `vendor-live.mjs:169` |
| Spireon vehicles | `/api/platform/spireon/vehicles?include_inactive=true` | `vendor-live.mjs:232` |
| FirstDue apparatus | `/api/platform/firstdue/apparatus` | `vendor-live.mjs:294` |
| Power BI CIP | `/api/platform/powerbi/cip-projects` | `vendor-live.mjs:342` |
| GoTo call summary | `/api/platform/goto/call-summary` | `vendor-live.mjs:383` |

Overridable by environment variable name, values never printed and never read here:
`MYGOV_PLATFORM_URL`, `MYGOV_PLATFORM_BASE`, `PROPERTY_INTEL_PLATFORM_URL`,
`PROPERTY_INTEL_LAYERS_PLATFORM_URL`. None of these four is set on the deployed service, so
every call goes to the hardcoded default above.

There is no shared database between v1 and v2. This product's DSN is Secret Manager
`database-url`, resolving to `ep-still-wave-avbwm4yc-pooler`, database `neondb`, per
`infra.md` line 5, and `src/mounts.mjs` carries an `assertNoSupplierDsn` refusal that runs at
module load in `server.mjs` line 80.

## 5. Tenant scoping

Two layers, and they are not equally strong.

**The serving layer is strong and it is armed.** `src/tenancy.mjs` holds the whole rule in one
place, deliberately. `resolveCaller` returns one of three shapes: `{kind:"tenant", tenant}`
when an `x-hauska-key` header resolves through the Hauska MCP server's `/auth/whoami` to a
`jurisdiction_tenant`, `{kind:"service"}` for a matching `DASHBOARDS_API_KEY` bearer, and
`{kind:"anonymous"}` otherwise. `callerIsPackSubject` (line 73) is the single subject test,
and a blank city key is explicitly not a subject.

The pack `bastrop_tx` is `accessPolicy: "tenant-private"` (`src/city-pack.mjs:114`),
`environment: "staging"`, `generatesFixtures: false`. For a tenant-private pack,
`canReadPack` returns `callerIsPackSubject(caller, pack.cityKey)` and nothing else
(`tenancy.mjs:84`). A service bearer does not get through. Only a caller whose Hauska key
resolves to the literal tenant string `bastrop_tx` reads that pack's content.

Every route that can emit MyGov data calls `packContentReadStatus` before composing anything:
`/api/lenses/city-manager/compose`, `/api/property-map/summary`, `/api/property-map/layers`,
`/api/lenses/development-services/pipeline`, `/api/city-domains`, `/api/domains/:id`,
`/api/city-identity`, `/api/shell`. I read each of the eight. They all resolve the pack first
and gate before composing, and the pack's own `cityKey` is what composes, so a composed
payload cannot name a pack the gate did not clear.

Live-verified today against `https://smartcity-dashboards-52ecsl5mvq-ue.a.run.app`:

```
GET /health                                                      200  db=connected
GET /api/domains/permits-pipeline?cityKey=template-city          200  recordCount 14, generated true, FIX-#### ids
GET /api/domains/permits-pipeline?cityKey=bastrop_tx             401  {"error":"unauthorized"}
GET /api/city-domains?cityKey=bastrop_tx                         401
GET /api/property-map/summary?cityKey=bastrop_tx&address=...     401
GET /api/property-map/layers?cityKey=bastrop_tx&key=zoning&...   401
GET /api/lenses/development-services/pipeline?cityKey=bastrop_tx 401
GET /api/lenses/city-manager/compose?cityKey=bastrop_tx          401
GET /api/city-identity?cityKey=bastrop_tx                        401
GET /api/shell?cityKey=bastrop_tx                                401
GET /api/city-packs                                              401
GET /api/city-packs/bastrop_tx                                   401
GET /api/domains/permits-pipeline?cityKey=bastrop_tx
    with x-hauska-key: not-a-real-key-000                        401
GET /api/domains/permits-pipeline?cityKey=bastrop_tx
    with authorization: Bearer not-a-real-key-000                401
GET /api/property-map/summary?cityKey=template-city&address=...  200  status unavailable,
    basis "native property map has a real source for bastrop_tx only"
```

The mechanism I believe explains those 401s is the application's tenancy gate. The second
mechanism that would produce identical output is Cloud Run IAM requiring authentication on the
whole service, which would make every 401 meaningless as evidence about the app. I rejected it
because `/health`, `/api/lenses`, `/api/mounts`, `/api/adapter-kinds` and the `template-city`
domain route all returned 200 to the same unauthenticated client in the same minute. The
service is publicly invokable; the 401 is the app refusing.

A third mechanism worth rejecting explicitly: a 401 could mean the `bastrop_tx` pack simply is
not in the production database. It is not that. An absent pack produces 404 by
`packContentReadStatus`'s first line, and 404 is what the code returns for an unknown key. We
got 401, which is only reachable when the pack exists and is tenant-private.

**The upstream layer is implicit, and this is the finding.** The outbound calls carry no
tenant parameter at all. `fetchRealPermits` sends no query string by design. `fetchLiveResource`
sends only a path. The upstream returns whatever `PLATFORM_INTERNAL_API_KEY` is scoped to, and
this product then STAMPS the pack's city key onto each row rather than verifying it:

```js
// src/mygov-permits.mjs:51
export function mapRealPermitRecord(row, cityKey, accessPolicy) {
  return { recordId: ..., kind: "mygov", cityKey, origin: "feed", ... };
}
```

`cityKey` there is `pack.cityKey`, passed in by the caller. Nothing asks whether the row
belongs to that city. This is a one-derivation assignment where the fixture path has a
two-derivation check. `composeDomain` on the fixture side refuses a record whose own city key
disagrees with the pack, and the test proves it fires:

```js
// src/domains.test.mjs:328
records: [{ kind: "mygov", recordType: "permit-case", cityKey: "other-city" }]
// throws /returned a record for other-city on pack probe-city/
```

So the product has a paired control where one half is armed on generated data and the other
half is absent on real data. Today it is latent rather than live, because SmartCity OS serves
one city (`tenant_id=2`, Bastrop) and the key is scoped to it, so pack and payload coincide.
The moment v1 serves a second tenant on that key, this product would label another city's
permits `bastrop_tx` and have no mechanism to notice. Nothing in this repository would fail.

The fix is small and belongs to the owning seat: assert that what came back is Bastrop's,
from a field on the row rather than from the variable that was passed in, and refuse
otherwise.

## 6. g116-vendor-auth

The tag `g116-vendor-auth` is revision `smartcity-dashboards-00048-kic`, which carries commit
`d17085c` (#44). It is not one vendor. It is five: Samsara (fleet), Spireon (patrol vehicles),
FirstDue (fire apparatus), Power BI (CIP projects), GoTo (call analytics). Each got a grant
object on the `bastrop_tx` pack and a composer in `src/vendor-live.mjs`.

The auth mechanism is identical to the MyGov one and there is exactly one credential.
`src/vendor-live.mjs:28` reads `PLATFORM_INTERNAL_API_KEY` from the environment and sends it
as `authorization: Bearer <key>` to the SmartCity OS platform routes. This product holds no
vendor credential of its own. Samsara, Spireon, FirstDue, Power BI and GoTo credentials all
live on SmartCity OS; this product never sees them.

The module header records two honest unavailabilities, live-verified 2026-09-03 by whoever
built it: FirstDue returns a real 403 because the current credential lacks apparatus and
assets scope, and GoTo returns not-authorized because its OAuth consent flow was never
completed by a human. Both are reported as `status: "unavailable"` with a stated basis rather
than papered over, which is the correct shape.

Environment variable NAMES on the deployed revision, sources only, no values read:

```
HAUSKA_RETRIEVAL_URL        literal
SMARTSITE_EMBED_ORIGIN      literal  https://smartsite.cloud
SMART_FILES_BACKEND_URL     literal
HAUSKA_MCP_URL              literal
PLAN_REVIEW_EMBED_ORIGIN    literal  https://plan-review-app-ten.vercel.app
DATABASE_URL                secret   database-url:latest
DASHBOARDS_API_KEY          secret   dashboards-api-key:latest
HAUSKA_RETRIEVAL_API_KEY    secret   hauska-retrieval-api-key:latest
SMART_FILES_API_KEY         secret   smart-files-api-key:latest
PLATFORM_INTERNAL_API_KEY   secret   platform-internal-api-key:latest
```

`PLATFORM_INTERNAL_API_KEY` is present and bound to a secret, so the live read path is armed in
production, not merely merged. `HAUSKA_MCP_URL` is set and `K_SERVICE` is set by Cloud Run, so
`parseTenantKeyMap` returns null on the deployed service and tenant resolution always goes
through the MCP `/auth/whoami` call. The `HAUSKA_TENANT_KEYS` static map is unit-test-only and
is not reachable in production.

## 7. Does MyGov data reach a parcel-level or public surface

Public: no. Parcel-level: yes, and it needs stating precisely.

**Public, anonymous, or shared: no.** Every route that can emit a MyGov record is gated, and
the gate was verified firing above. `template-city` is public-free and carries only generated
fixtures: `origin: "fixture"`, record ids of the form `FIX-1014`, and the basis string
"generated from the MyGov adapter output contract; no city rows were read", which the live
probe returned verbatim. `assertCityPackShape` refuses any pack that both generates fixtures
and grants an adapter (`city-pack.mjs:373`), so a demo pack cannot acquire a real feed by
configuration drift. The MyGov grant exists on exactly one pack in the codebase.

**Hauska spine and the atom store: no.** Established in section 3. There is no write path.

**SmartSite: no, and the direction is the opposite of what one might fear.** G-117 did not push
Bastrop data into SmartSite. It stopped using SmartSite for Bastrop and substituted this
product's own page. `src/compose.mjs:269` returns the native map URL for `bastrop_tx` only;
every other pack still gets the SmartSite embed built from `parcelNodeId`.

**Plan Review and Smart Files: no.** Both are iframe embeds carrying a `cityKey` query
parameter and nothing else. No record data crosses. See section 8.

**Parcel-level: yes.** `src/property-map.mjs`'s `mapRealPropertyResult` (line 102) returns a
parcel snapshot with owner, zoning, acreage, legal description, lot, block, flood zone, CAD
valuation and parcel geometry, and alongside it `permits`, `violations` and `inspections`
arrays, each row tagged `origin: "feed"`. That is MyGov case data joined to a parcel, which is
exactly the join the 2026-09-14 coordination memo warns will look like an obvious win.

Three things hold it inside the line. The route is gated by `packContentReadStatus` and
returned 401 to an anonymous caller on the live service. `composePropertyIntelSummary` refuses
for any city key other than `bastrop_tx` with a stated basis, verified live against
`template-city`. And the four MyGov-backed overlay categories that production's own map
carries, `permits`, `violations` and `heatmap`, are deliberately excluded from the 52-key
allowlist; `property-map-catalog.mjs` lines 18 and 144 say so, and a live probe for
`key=permits` is refused past the tenancy gate by the allowlist.

So: MyGov data reaches a parcel view inside an authenticated single-tenant dashboard. It does
not reach a public parcel rail, the spine, the catalog, or any anonymous endpoint. Those are
different facts and the second one is the one the standing rule is about.

## 8. Plan review linkage

None. Grepped `plan-review`, `planReview`, `engagement`, `submittal` and `intake` across all
non-test source and web assets on `origin/main`.

`engagement` has zero hits in this repository. `planReview` resolves to `mounts.mjs`'s
`planReviewEmbedUrl`, which returns an origin from `PLAN_REVIEW_EMBED_ORIGIN` plus `?embed=1`
plus the composing request's `cityKey`, and `compose.mjs:302` puts it in the response as
`{contract: "embed", url}`. `intake` appears once as a fixture case-stage enum value
(`adapters.mjs:152`) and once as a source-register row in `shell-homes.mjs:115` whose
disposition is the literal string "Not built".

This matters for the row that commissioned the recon. G-52 is "SmartCity initiates an
engagement from a MyGov permit record." **That was not built.** What was built is the feed
G-52 had been blocked on. There is no code anywhere in this product that creates a plan-review
engagement, and no permit record field is threaded into the plan-review embed URL. The served
surface still renders "Reviews, Submittals against this parcel, Not connected"
(`web/index.html:484`).

## 9. Authorization: what the code cites, and what exists

This is the part that does not reconcile, and it is a governance finding rather than a data one.

The G-116 and G-117 code cites three decision records in doc_repo as its authorization:

```
src/adapters.mjs:841    _decisions/2026-09-03_smartcity_os_platform_read_authorization.md
src/city-pack.mjs:99    _decisions/2026-09-03_bastrop_tx_dashboards_pack_ratified.md
src/compose.mjs:251     "the dated 2026-09-04 operator decision record in doc_repo's
                         _decisions/ directory" (the Leaflet-island override)
```

None of the three exists. Checked by direct path test in `P:/doc_repo/_decisions/` and again in
the second clone `C:/Users/cente/doc_repo/_decisions/`, then by enumerating every `_decisions`
file dated 2026-09-03 and 2026-09-04 in both, then by a repository-wide filename search for
`*bastrop_tx*`, `*platform_read*` and `*dashboards_pack*`, which returned nothing.

I checked the second clone specifically because the two clones have independent git histories
and a record could plausibly live in one and not the other. It does not live in either.

There is also no G-116 and no G-117 row in the plan of record. Searching for `G-116` or `G-117`
over all markdown and JSON in both doc_repo clones returns zero files. `OPS-17` stops at G-115.

Meanwhile G-52's own row in `90_operations/OPS-17_govtech_stack_plan_of_record.md` line 229
still reads **STILL BLOCKED**, re-scoped 2026-09-02 under amendment A-106, with the stated
blocker being that no live permit feed exists to initiate from, and with
`_inbox/2026-08-17_dashboards_missing_pieces.md`'s "Do not start G-52" recorded as verified
still valid.

That blocker is now factually stale: the feed exists, is deployed, and was verified live by a
previous session's own note in `adapters.mjs` ("25 real Bastrop permits, 2026-09-03"). The row
has not been updated.

**So, was the prohibition crossed?** Read against its actual text rather than its headline, the
answer is mostly no, and the exceptions are procedural.

`_inbox/2026-08-17_dashboards_missing_pieces.md` says four relevant things. Item 3: "Destination
is spine or files with provenance and accessPolicy, granted on a pack. Destination is not
Dashboards Neon and not a copied `mygov_permits` table." Honored, and encoded as a refusing
gate with a test that fires. Item 2: "MyGov/Samsara wait until the identity split is visible in
the UI (demo vs island)." Arguably satisfied: environment badges, `origin` feed versus fixture,
and per-panel provenance chrome all shipped before the feed did. The "what not to do" list:
"Do not put live work-order names on unauth Dashboards." Honored, and verified 401 today. And
"Do not start G-52." Honored in the literal sense, since no engagement-from-permit code exists.

What was crossed is the process, not the line. Work ran on two unregistered row numbers, under
three decision records that do not exist, while the row it unblocks still reads BLOCKED. The
building was careful. The bookkeeping is missing, which means a fresh agent reading canon today
would conclude no feed exists, and a fresh agent reading the code would conclude three
authorizations exist. Both would be wrong.

## 10. Two smaller findings

**The served source register contradicts the product.** `src/shell-homes.mjs:127` still
declares `{table: "feeds", job: "MyGov", disposition: "Not connected"}`, and the same string is
baked into `web/index.html:1475` as `data-disposition="Not connected"`. The same is true for
Samsara, Spireon, FirstDue, Power BI, GoTo and the Municode calendar. All seven are granted on
`bastrop_tx` and six of them read live. The register is the product's own honesty mechanism for
distinguishing "we did not build this" from "your city has no data," and on the real pack it now
tells a Bastrop staff member that a feed they are looking at is not connected. This is the
opposite of the usual failure and is therefore easy to miss: the product is understating itself
rather than overstating. It is still a divergence between a declaration and the behaviour it
declares.

**`.env.example` never learned the new variables.** It carries `PORT`, `DATABASE_URL`,
`HAUSKA_RETRIEVAL_URL`, `SMARTSITE_EMBED_ORIGIN`, `SMART_FILES_BACKEND_URL`,
`DASHBOARDS_API_KEY`, `HAUSKA_RETRIEVAL_API_KEY`, `SMART_FILES_API_KEY` and the Smart Files
actor pair. It does not mention `PLATFORM_INTERNAL_API_KEY`, `HAUSKA_MCP_URL`,
`HAUSKA_TENANT_KEYS`, `MYGOV_PLATFORM_URL`, `MYGOV_PLATFORM_BASE`,
`PROPERTY_INTEL_PLATFORM_URL`, `PROPERTY_INTEL_LAYERS_PLATFORM_URL` or `FEEDBACK_DESTINATION`.
A local run therefore silently takes the unavailable branch on every real feed, which is the
correct fail-closed behaviour but gives no hint why.

## What I could not determine and why

**Whether the upstream platform route is itself tenant-scoped.** Everything in section 5's
second half rests on what `smartcity-api`'s `/api/platform/mygov/*` handlers do with
`PLATFORM_INTERNAL_API_KEY`: whether the key is bound to `tenant_id=2` server-side, or whether
the route would return any tenant's rows to any holder of that key. That code is in the
`smartcity-os` repository, which this mission scoped out and which this seat does not own.
Until someone reads those handlers, "the data is scoped to Bastrop" is an inference from v1
being a single-city deployment, not a verified property of the interface. This is the single
highest-value follow-up.

**What the tenant-authenticated responses actually contain.** Every finding about served
content is from code reading plus the refusal side of the gate. I do not hold a Hauska key
resolving to `bastrop_tx` and did not request one, so I have never seen a 200 on any
`bastrop_tx` route. I can prove the gate refuses. I cannot prove from a live probe what it
permits, including the actual record volume, whether real permit rows carry parcel ids, or
whether any field surprises.

**Whether the missing decision records were ever written.** I established they do not exist in
either clone's working tree today. I did not search either clone's git history for a deleted or
never-committed file, and I did not search outside doc_repo. Absent from both working trees is
what I verified; never authored is a stronger claim I am not making.

**Whether `npm test` passes on `origin/main`.** CI runs `npm test` plus a separate required a11y
job on every push and pull request, and all fifteen commits merged through pull requests, which
is indirect evidence. I did not run the suite, because doing so needs `npm ci` and the mission
forbids installs.

**Whether `PLATFORM_INTERNAL_API_KEY` is the same credential SmartCity OS uses for its own staff
routes.** I read only the variable name and its Secret Manager binding. Its scope, rotation
state and blast radius are upstream properties.

## leave_behind

```
leave_behind:
  - item: OPS-17 has no G-116 or G-117 row; G-52's row still reads STILL BLOCKED on a
          dependency that is now satisfied
    owner: nick
    plan_row: G-52 (OPS-17 amendment owed)
  - item: three decision records cited in smartcity-dashboards source do not exist in
          either doc_repo clone (platform read authorization, bastrop_tx pack ratified,
          the 2026-09-04 Leaflet-island override)
    owner: nick
    plan_row: G-52 (records owed, or the citations corrected)
  - item: real-path records are stamped with pack.cityKey and never checked against the
          row's own city; the fixture path has that check and it fires
    owner: smartcity-dashboards owning seat
    plan_row: backlog
  - item: shell-homes.mjs feeds table declares MyGov and five other live vendors
          "Not connected" on the served source register
    owner: smartcity-dashboards owning seat
    plan_row: backlog
  - item: .env.example missing eight variables the product now reads
    owner: smartcity-dashboards owning seat
    plan_row: backlog
```

## Fleet memory

**GROUND-TRUTH 2026-09-14.** `smartcity-dashboards` serves `smartcity-dashboards-00062-ful` at
100 percent, digest `sha256:fa5c2c33...`, `origin/main` `86487fa`. `PLATFORM_INTERNAL_API_KEY`
is bound to Secret Manager on that revision, so the live MyGov read path is armed in production.
Anonymous callers get 401 on every `bastrop_tx` route and 200 on `template-city`.

**GROUND-TRUTH 2026-09-14.** v2 Dashboards holds exactly one table, `city_packs`. It has never
held a permit, and the adapter contract refuses `mygov_permits` as a write target with a test
that fires.

**LESSON.** A grant field reading `writesTo: "spine"` on a read-through feed is a conceptual
home, not a mechanism. Verify by enumerating the repository's HTTP methods and its DDL, not by
reading the field or by trusting the comment that explains the field.

**LESSON.** When a route family returns 401 everywhere you look, probe a route you expect to
succeed before calling the gate armed. Service-level IAM and an application gate are
indistinguishable from the refusal side alone.

**DEAD-END.** `git show "origin/main:.env.example"` fails under MSYS with
`ambiguous argument 'origin\main;.env.example'`. Dotfile paths get path-converted. Prefix with
`MSYS_NO_PATHCONV=1`. Paths under `src/` are unaffected, which makes the failure look
file-specific rather than shell-specific.

**OPEN.** Read `smartcity-os`'s `/api/platform/mygov/*` handlers and establish whether
`PLATFORM_INTERNAL_API_KEY` is server-side bound to `tenant_id=2`. Every tenant-scoping claim
about the upstream in this report is an inference until that is read.

**OPEN.** Nobody has seen a 200 on a `bastrop_tx` route. A tenant key would turn several
code-reading findings into live ones, including whether real permit rows carry parcel ids.
