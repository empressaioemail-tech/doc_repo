---
title: G-52 plan-review intake and ICC linkage recon
date: 2026-09-14
plan_row: G-52
plan: OPS-17
lane: g52-planreview-icc
status: complete
kind: recon
mode: READ-ONLY
---

# G-52 plan-review intake + ICC linkage recon

## Snapshot

| item | value |
| --- | --- |
| primary repo | `empressaioemail-tech/plan-review`, ref `origin/main`, commit `1af5ac596d28d5040c56af2545fbe4782f2dac3d` |
| commit subject | `feat(G-115): real Bastrop tenant + live IBC citation wiring (#14)` |
| local working tree | `P:/plan-review` HEAD `3615ee199e2f7966965706f18f066f9bab126fdb`, 16 commits behind, dirty. NOT read. Every quotation below is from `git show origin/main:<path>`. |
| secondary | `P:/icc-demo` origin/main `547b7742c0ac484769de35e661c36cbf61de8d1d` (docs only). `P:/icc-portal` origin/main `e7a36a552266e1cd6d5daed3c8d7fb3557ce34d9` (working tree zero-diff dirty, CRLF phantom only, verified `git diff --numstat` empty). |
| independent tip check | `gh api repos/empressaioemail-tech/plan-review/commits/main` returns `1af5ac59...`. Branch protection on `main`: HTTP 404 "Branch not protected". |
| live surfaces probed | `https://plan-review-app-ten.vercel.app` and `https://hauska-mcp-server-h7gvu7rgcq-uc.a.run.app`, 2026-09-14 16:24 to 16:32 UTC |

**Side effects I caused.** This lane was read-only on repositories and wrote no repository file. It was NOT read-only on the live ICC activity ledger. Nine GET calls to `/api/plan-review/code` on the deployed surface inserted nine rows into `plan_review_activity` at approximately 2026-09-14 16:26:42 UTC: two `poc-fixture` BASTROP-UDC, one `poc-fixture` IBC2018P6, one `absent:unchecked` BASTROP-UDC, two `absent:unchecked` (IBC2018P6, IPMC2018P2), one `absent:absent-verified` IBC2018P6, two `refused` (book `NEC`, and a section-less IBC request). That route records every call including refusals by design (`src/server.mjs:357-376`). These rows are mine, not customer activity, and must be excluded from any ICC-facing usage figure for 2026-09-14. There was no way to measure the live serving path without generating them.

---

## Executive summary

**How a submittal gets in.** `POST /api/plan-review/intake` (alias `POST /api/plan-review/engagements`) with three things in the JSON body: `orgId`, `userId` (together they must match a registered persona) and `parcelNodeId` plus `projectType`. `scope` is optional. That is the entire intake. There is no file upload in the intake path, no case number, no applicant record, no address field. The browser form at `web/app.js:318-328` posts exactly those fields through the Vercel BFF at `web/api/backend.js`, which attaches the service bearer token. Creating the engagement immediately runs `seedMatrix()`, which fetches the parcel atom chain from the Hauska MCP server and writes four findings rows.

**Minimum viable input.** Metadata alone. A determination does not require a document and never has. Verified live: of the nine engagements on production that carry a proposed dimension and can therefore reach Pass or Fail, eight have `filesFolderId: null`. `GET /api/plan-review/findings?sectionId=14-02-003` returns 6 Pass and 2 Fail across 23 findings. Those Pass and Fail rows were produced from `proposedSetbackFrontFt`, a number set by `POST /engagements/:id/edition`, compared against the district requirement on the `setback-rule` atom. No drawing was involved. **A MyGov permit record with zero attachments is useful input today.**

**Does ICC linkage work.** Yes, live, verified this session with no credential of my own. `GET /api/plan-review/code?book=IBC&section=1001.1` on production returns HTTP 200 with heading "General.", editionId `IBC-2018`, a real `codes.iccsafe.org` deep link sourced from the atom, and `analysis: null` because the book is marked not quotable. The body is not reproduced. The path is: plan-review `src/mcp.mjs` calls `tools/call get_atom` on `hauska-mcp-server` over HTTP with the `x-hauska-key` header carrying `HAUSKA_MCP_PLATFORM_KEY`. The `atom.data.atom` extraction fix is in place and working. The ICC atoms are platform-internal: I confirmed anonymously that the exact DID plan-review computes returns "not readable under the caller's accessPolicy", so the production key is genuinely doing work.

**Three things canon has wrong**, each evidenced below: (1) the Bastrop UDC has **eight** ingested sections in the substrate, not two, and plan-review's manifest wires two of them, so six real sections are answered with a `typed-absence: unchecked`; (2) the in-code claim that BASTROP-UDC atoms are `public-free` is false at the atom level, they are gated exactly like the ICC atoms, which makes the "harmless no-op" reasoning at `src/server.mjs:387-388` accidentally load-bearing; (3) "cross-tenant read AND write refusal verified both directions" is true only for the `/engagements/:id/*` subtree and only when a persona is asserted. `GET /api/plan-review/queue` returned all 25 engagements across all three tenants to me with no persona and no credential.

**What it would take to feed in an external permit.** Two lines of work, one small and one not. The small one: a new route that accepts a vendor permit record and calls `createEngagement()` with the permit number and applicant carried in real columns. The not-small one: MyGov gives you an **address**, and intake requires a `parcelNodeId` of the shape `48021:34177`. `POST /api/plan-review/geocode` is deliberately HTTP 410 Gone ("Cotality geocode is dead"). There is no address-to-parcel resolver inside plan-review. The re-route exists on the MCP server as `resolve_place`, which needs a brokerage/cortex product key plan-review does not currently hold. That resolution step is the whole cost of item (a).

---

## 1. Intake, traced end to end

The chain, browser to database:

1. `web/app.js:318-328` renders the intake form for a reviewer persona. Four inputs: `parcelNodeId` (prefilled `48021:28286`), `projectType` (prefilled `new-single-family`), `scope` (optional textarea), submit. The hint text is literal: `Project type plus place. No upload required to start.`
2. `web/app.js:358-369` posts `{ ...persona(), parcelNodeId, projectType, scope }` to `/api/plan-review/intake` through `api()` (`web/app.js:112-130`), which always sends `x-persona: <orgId>/<userId>` from localStorage.
3. `web/api/backend.js:104-187`, the Vercel BFF, holds `PLAN_REVIEW_BACKEND_URL` and `PLAN_REVIEW_API_KEY`, rewrites the request to `${backend}${path}`, attaches `authorization: Bearer <key>` and forwards `x-persona` (`web/api/backend.js:174`, the G-115 hop that was previously dropped).
4. `src/server.mjs:261-266` refuses any path outside `/api/plan-review/` and `/api/icc/`. `src/server.mjs:266` then calls `requireToken`.
5. `src/server.mjs:75-87` `requireToken` compares the bearer against `PLAN_REVIEW_SERVICE_TOKEN` and 401s anonymous callers. This is a shared service token, not a user identity.
6. `src/server.mjs:551-587` is the intake handler.

The handler, verbatim:

```js
  if (
    (req.method === "POST" && path === "/api/plan-review/intake") ||
    (req.method === "POST" && path === "/api/plan-review/engagements")
  ) {
    const body = await readJson(req);
    if (refuseCotality(body)) {
      json(res, 400, { error: "cotality_extinguished", cotalityCalls: 0 });
      return;
    }
    const persona = requirePersona(body, res);
    if (!persona) return;
    const parcelNodeId = String(body.parcelNodeId || "").trim();
    const projectType = String(body.projectType || "").trim();
    if (!parcelNodeId || !projectType) {
      json(res, 400, { error: "parcelNodeId and projectType are required" });
      return;
    }
    let engagement = await createEngagement({
      parcelNodeId,
      projectType,
      jurisdiction: jurisdictionFromParcel(parcelNodeId),
      orgId: persona.orgId,
      userId: persona.userId,
      scopeText: body.scope || body.scopeText || null,
    });
    const seededAtIntake = await seedMatrix(engagement.id, engagement.parcelNodeId, engagement);
```
`src/server.mjs:551-576`

Required fields are therefore exactly four: `orgId`, `userId`, `parcelNodeId`, `projectType`. `orgId` and `userId` are validated against the persona list at `src/server.mjs:113-124` via `resolvePersona` (`src/actors.mjs:20-24`); an unregistered pair 400s with `unknown_persona`. Note that intake reads the persona from the **body**, not the `x-persona` header, which is the one place in the service where the two identity channels differ.

`jurisdictionFromParcel` (`src/store.mjs:38-43`) takes the first five characters as a FIPS code: `48021` becomes "Bastrop County, TX", any other five digits becomes `FIPS NNNNN`, anything else becomes `null`. **Nothing validates that the parcel exists.** Any string is accepted as `parcelNodeId`. Live confirmation: 4 of 25 production engagements carry `jurisdiction: null`, which is only reachable through a non-FIPS-shaped parcel string.

The row is written by `createEngagement` (`src/store.mjs:45-62`) into `plan_review_engagements` with `stage = 'Submitted'` and `cotality_calls = 0`. The schema (`sql/001_foundation.sql:4-27`) hard-constrains both: a stage CHECK over five values, and `CHECK (cotality_calls = 0)`.

**Alternative entry points, enumerated.** I read every `path ===` comparison and every route regex in `src/server.mjs` at this ref, and the full live MCP `tools/list` (90 tools). There are three ways into intake and no fourth:

- The browser form above.
- Any HTTP client that reaches the Vercel BFF, since `/api/plan-review/*` is proxied **without a persona requirement** (`web/api/backend.js:132-155` gates only `/api/icc/` and `/api/smart-files/`). The BFF supplies the bearer token.
- The MCP tool `codex_finding_generation` on `hauska-mcp-server`, whose live description reads "start intake for a parcel or load the applicability matrix for an existing engagement. Calls plan-review POST /intake or GET /matrix", with inputs `parcel_node_id`, `project_type`, `engagement_id`, `org_id`. Gated at "product Layer 2 Codex (codex API key). Not anonymous." Live evidence that this path is used: the ICC activity ledger carries a row sourced `mcp:codex_finding_generation`.

There is no email intake, no webhook, no queue consumer, no file watcher. I searched the whole tree (36 files at this ref) for `webhook`, `mygov` and `permit`: **zero hits for `mygov`, zero for `webhook`**; `permit` appears only as "permitted use table" and the word "permits" in one comment.

---

## 2. Minimum viable input

**Answer: a determination does not require any uploaded document. Metadata alone is sufficient, and metadata alone reaches Pass and Fail.**

Three independent derivations agree.

*Code.* `seedMatrix` (`src/server.mjs:149-180`) is called synchronously inside intake, before any file can exist. It calls `getPropertyAtomChain(parcelNodeId)` and `matrixFromChain(...)`, then `upsertFinding` for each row. Nothing in that path touches Smart Files. The `documents`/`sheets`/`dataroom-atoms` routes (`src/server.mjs:786-826`) return an honest empty when `filesFolderId` is null and are never consulted by the matrix.

*Adjudicator.* The only real adjudication in the service is `adjudicateMinimumSetback` (`src/adjudication.mjs:34-68`). It takes `requiredMinFt` from the `setback-rule` atom and `proposedFt` from `engagement.proposedSetbackFrontFt`, a **numeric column** (`sql/005_engagement_edition.sql:36`) set through `POST /engagements/:id/edition` (`src/server.mjs:625-651`). That column's own migration comment names it "the one submitted dimension this service can accept today without G-107 (Smart Files staff upload, Track A, not yet built)".

*Live production.* From `GET /api/plan-review/queue` on 2026-09-14:

```
total 25
filesFolderId set: {False: 21, True: 4}
proposedSetbackFrontFt set: {False: 16, True: 9}
engagements with a proposed setback:
   543d58db bastrop_tx    48021:34177 edition bastrop_tx-bdc-2026-adopted setback 20 files False
   469a4d56 bastrop_tx    48021:34177 edition bastrop_tx-bdc-2026-adopted setback 20 files False
   694fb4e2 bastrop_tx    48021:34737 edition bastrop_tx-bdc-2026-adopted setback 28 files False
   6fd9683e bastrop_tx    48021:34737 edition bastrop_tx-bdc-2026-adopted setback 28 files False
   992c3f9b bastrop_tx    48021:34737 edition bastrop_tx-bdc-2026-adopted setback 15 files False
   3463b738 template-city 48021:34737 edition IRC-2018 setback 28 files True
   5c2449c8 template-city 48021:34737 edition IRC-2018 setback 15 files False
   4dae1d0a template-city 48021:34737 edition IRC-2018 setback 30 files False
   2beca33f icc-demo      48021:28286 edition IRC-2018 setback 25 files True
```

and from `GET /api/plan-review/findings?sectionId=14-02-003`:

```
 n= 23
 determinations {'Unchecked': 13, 'Pass': 6, 'Fail': 2, 'Uncertain': 2}
```

Seven of the nine Pass/Fail-capable engagements have no files room at all. Pass and Fail are reached from a number typed into a form.

**What metadata alone does NOT buy.** Only one dimension is checkable. `matrixFromChain` emits a fixed four rows (`src/mcp.mjs:345`): IRC R302.1, IRC R311.7, UDC 14-02-003, UDC 14-02-008. Only the third is adjudicated. The permitted-use row is deliberately Unchecked with the basis "No use-adjudication logic exists yet; not a fabricated Pass" (`src/mcp.mjs:341`). Both IRC rows are Unchecked because no IRC section is ingested anywhere. So a metadata-only review yields at most one real determination out of four rows, and it is honest about the other three.

---

## 3. Determination pipeline

The flow is short and there is no LLM in it on this service.

```
POST /intake  or  GET /engagements/:id/matrix
      |
      v
seedMatrix(engagementId, parcelNodeId, engagement)            src/server.mjs:149-180
      |-- getPropertyAtomChain(parcelNodeId)                  src/mcp.mjs:83-85
      |     -> mcpCall("get_property_atom_chain", ...)        src/mcp.mjs:40-81
      |        POST {HAUSKA_MCP_URL}/mcp  tools/call          ANONYMOUS, no key passed
      |        on throw: chain = { error, data:{status:"not_ready", slots:{}} }
      |
      |-- matrixFromChain(parcelNodeId, chain, {editionId, proposedSetbackFrontFt})
      |                                                       src/mcp.mjs:209-346
      |     slotAtom(chain,"zoning-fact"), slotAtom(chain,"setback-rule")
      |     sourceUnreachable = Boolean(chain.error)     <-- typed apart from "nothing there"
      |     adjudicateMinimumSetback({requiredMinFt: setbacks?.front, proposedFt, label:"front"})
      |                                                       src/adjudication.mjs:34-68
      |     buildCitation({editionId, bookId, sectionNumber, title, deepLink})
      |                                                       src/citation.mjs:35-52
      |     renderCitationText(citation)                      src/citation.mjs:58-61
      |     -> exactly four rows
      |
      `-- upsertFinding(row) x4                               src/store.mjs:136-179
            (an overridden finding is NOT re-seeded: src/store.mjs:143-145)
```

`matrixFromChain` is where the determination is made, and it is a comparison, not a model call. The `row()` helper at `src/mcp.mjs:221-267` has one override that matters:

```js
    // sourceUnreachable overrides every other reason: the corpus itself
    // could not be reached this call, which is a different claim from
    // "reached it, nothing there" and must not collapse into the same row.
    if (sourceUnreachable) {
      return { ... determination: "Unchecked",
        absence: { status: ABSENCE_KINDS.SOURCE_UNAVAILABLE,
                   basis: `Atom-chain fetch failed for ${parcelNodeId}: ${chain.error}`, ... },
```

**Where code sections get resolved, and the important distinction.** There are two entirely separate resolution paths and they do not share a resolver.

- The **matrix** path never calls `resolveCodeLookup`. Its section identities are hardcoded in `matrixFromChain`: `"R302.1"`, `"R311.7"`, `"14-02-003"`, `"14-02-008"`. Their atom DIDs come either from the chain's own `zoning.codeSectionRefs.districtRequirements.atomDid` / `.permittedUseTable.atomDid`, or from a literal fallback DID (`src/mcp.mjs:315`, `src/mcp.mjs:333`). The matrix never fetches a section body.
- The **code library** path (`GET /api/plan-review/code`, `src/server.mjs:348-515`) is the one that calls `resolveCodeLookup` and actually fetches an atom. This is what the Codex MCP tool `plan_review_get_code` hits, and what bills the ICC ledger.

So `buildCitation` is shared by both, `code-lookup.mjs` is used by only one. A reviewer reading the applicability matrix is looking at citations built from a hardcoded four-row list; a reviewer opening a code section is going through the manifest.

`buildCitation` is a genuine gate rather than documentation: it throws without `editionId`, `bookId` or `sectionNumber` (`src/citation.mjs:36-44`), and it is the only constructor. Live proof it fires: findings on R302.1 carry `citation: null` and `editionId: null` for the 20 engagements that never declared an IRC edition, rather than a placeholder string.

---

## 4. Edition and code-book wiring, and the two-sections claim

`AVAILABLE_EDITIONS`, verbatim (`src/code-lookup.mjs:201-210`):

```js
export const AVAILABLE_EDITIONS = Object.freeze([
  Object.freeze({ editionId: "IBC-2018", title: "2018 International Building Code", bookId: "IBC2018P6" }),
  Object.freeze({ editionId: "IPMC-2018", title: "2018 International Property Maintenance Code", bookId: "IPMC2018P2" }),
  Object.freeze({ editionId: "IRC-2018", title: "2018 International Residential Code", bookId: null }),
  Object.freeze({
    editionId: "bastrop_tx-bdc-2026-adopted",
    title: "City of Bastrop Building Block B3 (2026 adopted)",
    bookId: "BASTROP-UDC",
  }),
]);
```

Served live and unchanged at `GET /api/plan-review/editions`. `bookId: null` on IRC-2018 is deliberate: the comment at `src/code-lookup.mjs:190-200` says declaring the edition "does not claim this service has IRC content; it removes the 'unresolved' excuse".

`CODE_BOOKS` has three entries (`src/code-lookup.mjs:135-188`):

| bookId | editionId | publisher | quotable | `sections` manifest | live path |
| --- | --- | --- | --- | --- | --- |
| `IBC2018P6` | `IBC-2018` | icc | **false** | `Object.freeze({})`, empty | **yes**, `liveCodeEditionSlug: "2018-international-building-code-6th-printing"` |
| `IPMC2018P2` | `IPMC-2018` | icc | false | `Object.freeze({})`, empty | no |
| `BASTROP-UDC` | `bastrop_tx-bdc-2026-adopted` | bastrop_tx | **true** | exactly two keys | **no** |

The Bastrop manifest, verbatim (`src/code-lookup.mjs:178-185`):

```js
    sections: Object.freeze({
      "14-02-003": Object.freeze({
        sectionAtomId: "did:hauska:code-section:bastrop_tx-bdc-2026-adopted/14-02-003",
      }),
      "14-02-008": Object.freeze({
        sectionAtomId: "did:hauska:code-section:bastrop_tx-bdc-2026-adopted/14-02-008",
      }),
    }),
```

### Canon claim 1: "Only TWO sections of the Bastrop UDC are real"

**Half true, and the false half is the useful half.**

True as a statement about plan-review. The manifest holds two, and the live route agrees. Asking for `14-02-005`:

```json
{"book":"BASTROP-UDC","section":"14-02-005","status":"typed-absence",
 "absence":{"status":"unchecked",
  "basis":"Section 14-02-005 is not in the ingested manifest for BASTROP-UDC. Never looked at, not confirmed absent from the edition.",
  "detail":{"ingestedSections":["14-02-003","14-02-008"]}},
 "bodyVerbatim":false}   [HTTP 404]
```

which is a correct, honest `unchecked` under this file's own vocabulary.

**False as a statement about the substrate.** I swept anonymous `get_atom` across `did:hauska:code-section:bastrop_tx-bdc-2026-adopted/14-02-NNN` for NNN = 001 through 020:

```
14-02-001 EXISTS(gated)   14-02-006 EXISTS(gated)   14-02-011 absent   14-02-016 absent
14-02-002 EXISTS(gated)   14-02-007 EXISTS(gated)   14-02-012 absent   14-02-017 absent
14-02-003 EXISTS(gated)   14-02-008 EXISTS(gated)   14-02-013 absent   14-02-018 absent
14-02-004 EXISTS(gated)   14-02-009 absent          14-02-014 absent   14-02-019 absent
14-02-005 EXISTS(gated)   14-02-010 absent          14-02-015 absent   14-02-020 absent
```

and across chapters, sections 001 and 003 each:

```
14-01: 001=absent 003=absent
14-02: 001=EXISTS 003=EXISTS      14-07: 001=EXISTS 003=EXISTS
14-03: 001=EXISTS 003=EXISTS      14-08: 001=EXISTS 003=EXISTS
14-04: 001=EXISTS 003=EXISTS      14-09: 001=EXISTS 003=EXISTS
14-05: 001=EXISTS 003=EXISTS      14-10: 001=EXISTS 003=EXISTS
14-06: 001=EXISTS 003=EXISTS
```

*Mechanism.* `EXISTS(gated)` is the response `"Atom at DID ... is not readable under the caller's accessPolicy."`; `absent` is a clean 200 carrying `{"data":{"atom":null}}` with `"note":"No atom found at DID ..."`.

*Second mechanism considered and rejected.* The denial could be namespace-blanket, meaning the server refuses anonymous reads of anything under `bastrop_tx-bdc-2026-adopted` without ever looking up existence, in which case my "EXISTS" label would be worthless. I tested that by violating it: `.../bastrop_tx-bdc-2026-adopted/99-99-999` and `.../zzzz-not-a-section`, both in the same namespace, both returned `atom: null`, not the denial. The server therefore resolves the atom first and denies second, so the denial is positive evidence of existence. Rejected.

**Consequence.** At minimum eight sections of chapter 14-02, and content across chapters 14-02 to 14-10, are already ingested and citable. plan-review wires two of them by name. `BASTROP-UDC` has no `liveCodeEditionSlug`, so unlike IBC there is no fallback to a live substrate check; every one of those real sections answers `unchecked`. This is the cheapest coverage win available on this product and it is a manifest edit plus a small live-path addition, not an ingestion job.

The IBC live path would not work for Bastrop unchanged. `LIVE_SECTION_NUMBER_RE = /^\d+(?:\.\d+)*$/` (`src/code-lookup.mjs:85`) admits digits and dots only, and `iccModelCodeSectionAtomId` maps dots to dashes (`src/code-lookup.mjs:87-89`). Bastrop section ids are already dash-formed (`14-02-003`) and would fail that regex. A Bastrop live path needs its own pattern and its own DID builder.

### Which IBC/IPMC books have a live query path to real content

| book | live query path | verified |
| --- | --- | --- |
| IBC2018P6 | yes, via `liveCodeEditionSlug` then `get_atom` then `classifyLiveSectionFetch` | **yes**, `section=1001.1` returns 200 with real content, see section 5 |
| IPMC2018P2 | **no**. `sections` is empty and there is no `liveCodeEditionSlug` | confirmed live: `section=304.1` returns `typed-absence: unchecked` HTTP 404 |
| BASTROP-UDC | manifest only, two sections | confirmed live: both 200, `14-02-005` 404 |

The IPMC absence is documented rather than silent. `src/code-lookup.mjs:70-76` records the searches that were run ("`get_atom` probes against several plausible IPMC section DIDs found nothing") and `/api/icc/activity` reports `entitled: {IBC2018P6: "live", IPMC2018P2: "typed-absence"}` with `ipmcResidual: "IPMC 2018 not ingested (G-41)"`.

---

## 5. ICC linkage, in detail

### The current shape

There are three distinct ICC-related links and conflating them is the main risk here. The commit `3615ee1 fix(g60): remove plan-review /icc middleware` removed a fourth shape, an `/icc` path served by plan-review itself; it did not touch the content path.

**Link A, content in: plan-review to hauska-mcp-server, MCP `tools/call get_atom` over HTTPS.** Not a direct DB read, not a REST resource route. `src/mcp.mjs:40-81`:

```js
export async function mcpCall(name, args, key) {
  const headers = { "content-type": "application/json", accept: "application/json, text/event-stream" };
  if (key) headers["x-hauska-key"] = key;
  const res = await fetch(`${mcpUrl()}/mcp`, {
    method: "POST", headers,
    body: JSON.stringify({ jsonrpc: "2.0", id: `${name}-${Date.now()}`, method: "tools/call",
      params: { name, arguments: args || {} } }),
  });
```

with `mcpUrl()` defaulting to `https://hauska-mcp-server-h7gvu7rgcq-uc.a.run.app` from `HAUSKA_MCP_URL` (`src/mcp.mjs:12-17`). The call site that reaches ICC content, `src/server.mjs:389`:

```js
      atom = await getAtom(section.sectionAtomId, process.env.HAUSKA_MCP_PLATFORM_KEY || undefined);
```

**Link B, metering out: icc-portal to plan-review, plain REST.** `icc-portal/web/api/backend.js` holds `PLAN_REVIEW_BACKEND_URL` and `PLAN_REVIEW_API_KEY`, refuses any path not starting `/api/icc/`, refuses a request with no persona (`icc-portal/web/api/backend.js:35-45`), and GETs `/api/icc/activity` on plan-review. The portal holds no DSN and no content. Its README is explicit: "Activity reads plan-review `GET /api/icc/activity`. Do not copy that table here. Do not hold a DSN."

**Link C, agent access in: hauska-mcp-server Codex tools to plan-review REST.** Live `tools/list` shows `plan_review_get_code`, `codex_finding_generation`, `codex_findings_fetch`, `codex_override_write`, `codex_briefing_fetch`, `codex_snapshot_ingest`, `plan_review_get_letter`, `plan_review_get_map_context` and `icc_activity_list`, all described as "Tier: product Layer 2 Codex (codex API key). Not anonymous." These call plan-review's own routes. `plan_review_get_code`'s description ("IPMC is a typed absence. No verbatim ICC body.") matches this repository's behaviour exactly, and the ICC ledger carries live rows sourced `mcp:plan_review_get_code`, `mcp:codex_override_write` and `mcp:codex_finding_generation`, so link C is in use and not theoretical.

### Does it work

Yes. Live, 2026-09-14, through the public BFF with no credential of mine:

```
### book=IBC&section=1001.1
{"book":"IBC2018P6","section":"1001.1",
 "sectionAtomId":"did:hauska:code-section:icc-model-code/2018-international-building-code-6th-printing/1001-1",
 "editionId":"IBC-2018",
 "citation":"2018 International Building Code Section 1001.1 (IBC-2018)",
 "heading":"General.","analysis":null,"bodyVerbatim":false,
 "bodyPolicy":"Licensed model code. Citation and deep link only, body is not reproduced.",
 "iccDeepLink":"https://codes.iccsafe.org/content/IBC2018#IBC2018P6_Ch10_Sec1001.1",
 "ingestedSections":[]}
[HTTP 200]
```

All three icc-demo acceptance criteria are visible in that one payload. Criterion 1, correct citation: section identifier, title and edition, plus a deep link taken from the atom's own `verbatimTextDeepLink`/`sourceUrl` rather than from the fabricated template (`src/server.mjs:491-494`). Criterion 2, layer in between: `analysis: null` because `book.quotable === false` (`src/server.mjs:505`), so the ICC body is not reproduced even though the service holds it. Contrast the Bastrop response on the same route, where `quotable: true` yields a real 400-character quotation of the local ordinance. Criterion 3, usage tracking: the call wrote a ledger row.

The `atom.data.atom` fix is real and load-bearing. `src/server.mjs:432` and `src/code-lookup.mjs:391` both read:

```js
      payload = atom?.data?.atom ?? atom?.atom ?? atom?.data ?? atom;
```

The comment at `src/server.mjs:423-431` states that the prior extraction took `atom.data`, "a truthy `{atom:{...}}` object whose own `.title`/`.bodyText` are always undefined", so "every resolved section (including the shipped UDC ones) fell through to `sourceUnavailable()` in production". I did not re-verify the broken state; the fixed state serves real titles on both books, which is consistent with that account.

### Entitlement gate, and what happens on an unentitled request

**There is no entitlement gate inside plan-review.** `/api/plan-review/code` checks only the shared `PLAN_REVIEW_SERVICE_TOKEN`, which the BFF supplies to everyone. The gate is one layer down, at the substrate, and it is an accessPolicy on the atom rather than a licence check on the caller.

I verified the substrate gate by violating it. Anonymous `get_atom` on the exact DID plan-review computes:

```
POST /mcp  tools/call get_atom
  did:hauska:code-section:icc-model-code/2018-international-building-code-6th-printing/1001-1
HTTP/1.1 200 OK
x-hauska-request-id: ff4bfdd1-4e33-45e3-aa03-dc0880e4b8dd
data: {"result":{"content":[{"type":"text","text":"Atom at DID did:hauska:code-section:icc-model-code/2018-international-building-code-6th-printing/1001-1 is not readable under the caller's accessPolicy."}],"isError":true},...}
```

That is the exact string `classifyLiveSectionFetch` pattern-matches at `src/code-lookup.mjs:407`, so the NOT_ENTITLED branch is reachable and correctly targeted. It also confirms the `x-hauska-request-id` response header G-112 depends on is live.

`icc-model-code` is invisible to an anonymous caller at the jurisdiction level too: `query_jurisdiction` returns `Jurisdiction "icc-model-code" is not loaded`, and anonymous `list_jurisdictions` shows only `bastrop_tx` and `grand_county_ut`.

On an unentitled request the caller gets a **402** with a typed absence, never a citation:

```js
      return absence(ABSENCE_KINDS.NOT_ENTITLED, {
        bookId, sectionId,
        basis: `The substrate holds an atom for section ${sectionId} but this service's key cannot read it.`,
        detail: text.slice(0, 300),
      });
```
`src/code-lookup.mjs:408-413`, with `ABSENCE_HTTP_STATUS[NOT_ENTITLED] = 402` at `src/code-lookup.mjs:112`.

### Defect: the manifest branch cannot express NOT_ENTITLED

`classifyLiveSectionFetch` distinguishes resolved / ABSENT_VERIFIED / NOT_ENTITLED / SOURCE_UNAVAILABLE, but it runs **only on the live branch** (`if (resolved.live)`, `src/server.mjs:395`). The manifest branch (`src/server.mjs:422-463`) has a single check, `sectionShaped`, and one outcome for every failure:

```js
      if (!sectionShaped) {
        const unavailable = sourceUnavailable({ bookId: book.bookId, sectionId: section.sectionId,
          detail: fetchError || "catalog returned nothing section shaped for this atom id" });
```

An accessPolicy denial on a manifest-listed section is therefore reported as `source-unavailable` (503) when the truthful answer is `not-entitled` (402). That matters because of the next finding.

### Canon claim 2: "BASTROP-UDC atoms are public-free" is false

`src/server.mjs:386-388` reasons:

```js
      // Passed unconditionally: BASTROP-UDC atoms are public-free, so a key
      // here is a harmless no-op for that manifest-confirmed path.
```

Anonymously, on 2026-09-14, every Bastrop atom I probed returned the accessPolicy denial, including both shipped sections and the edition atom that `list_jurisdictions` itself advertises:

```
bastrop_tx-bdc-2026-adopted/14-02-003                 not readable under the caller's accessPolicy
bastrop_tx-bdc-2026-adopted/14-02-008                 not readable under the caller's accessPolicy
code-edition:bastrop_tx/bastrop-b3-code-april-2025    not readable under the caller's accessPolicy
search_atoms jurisdiction=bastrop_tx query=setback -> {"results":[],"totalCandidates":24}
```

That last line is the clearest form of it: 24 candidate atoms matched and every one was filtered out by accessPolicy, while `list_jurisdictions` reports `"jurisdictionTenant":"bastrop_tx", "atomCount":193, "accessPolicy":"public-free"`. Two independently derived readings from the same server disagree about the same tenant. The jurisdiction-level declaration says public-free; the atom-level enforcement says otherwise.

*Mechanism.* The atom-level `accessPolicy` on the Bastrop code-section atoms is not `public-free`, and the jurisdiction row's `accessPolicy` field is a separate, stale or aspirational declaration.
*Second mechanism.* The anonymous path could be denied for all `code-section` entity types regardless of policy, while `list_jurisdictions` reports a genuinely correct tenant policy. I cannot exclude this from outside, because I have no public-free code-section atom to use as a positive control. I state it as unresolved rather than picking.

**Why it matters operationally.** Nothing is broken today, because the key is passed unconditionally anyway. It is dangerous because the *reason* recorded for passing the key is false. If a future edit removed the key on the stated grounds that Bastrop is public-free, the two real Bastrop sections would start returning 503 `source-unavailable`, and per the previous finding they would be mis-typed rather than reported as the entitlement problem they would actually be. The comment should be corrected to say the key is required for both books.

### Also worth noting: two Bastrop editions

Anonymous `list_jurisdictions` reports the Bastrop tenant's current edition as `did:hauska:code-edition:bastrop_tx/bastrop-b3-code-april-2025`, last refreshed `2026-08-05`. plan-review cites sections under `bastrop_tx-bdc-2026-adopted`. Those are two different edition identifiers in the same tenant, and under MOST-CURRENT SOURCE WINS somebody has to establish which carries the later effective date and whether the two agree on any shared section. I could not read either edition atom anonymously and did not resolve it.

### Defect: reconciliation collapses two states

Live `/api/icc/activity` today:

```
summary = {'n': 118, 'amount': 1.01, 'bySource': [
  {'source': 'plan-review-ui', 'n': 112, 'amount': 0.98},
  {'source': 'mcp:codex_override_write', 'n': 2, 'amount': 0.02},
  {'source': 'mcp:plan_review_get_code', 'n': 2, 'amount': 0},
  {'source': 'mcp:codex_finding_generation', 'n': 1, 'amount': 0.01},
  {'source': 'g112-diagnostic-probe', 'n': 1, 'amount': 0}]}
reconciliation.status = reconciled
reconciliation.summary = {'matched': 3, 'divergent': 0, 'noCorrelationKey': 115, 'total': 118}
requestId present = {False: 81, True: 37}
tiers = {'poc-fixture': 101, 'absent:unchecked': 9, 'refused': 3,
         'absent:absent-verified': 2, 'absent:source-unavailable': 2, 'diagnostic-g112-verification': 1}
```

The good news first: `status: "reconciled"` rather than `"ledger-unavailable"` means `fetchLedgerRows` succeeded, which independently confirms `HAUSKA_MCP_PLATFORM_KEY` is configured in production and that `GET /obligations/source-ledger` answers it.

The defect: 37 activity rows carry a `requestId` and only 3 matched a ledger row. The other 34 are bucketed as `noCorrelationKey` together with the 81 rows that have no `requestId` at all. `src/ledger-reconciliation.mjs:63-67`:

```js
  const rows = activityRows.map((a) => {
    const ledgerRow = a.requestId ? byRequestId.get(a.requestId) || null : null;
    if (!ledgerRow) {
      return { activityId: a.id, status: RECONCILE_STATUS.NO_CORRELATION_KEY, ledgerRow: null };
    }
```

"I had no key to join on" and "I had a key and the ledger does not carry it" are different states. The first is a gap in this service's own instrumentation. The second is a claim that an accrual this service believes happened is not on the authoritative ledger, which is exactly what a licensor audit would care about. Collapsed, a 92 percent miss rate on correlatable rows is invisible.

*Mechanism.* The ledger genuinely lacks rows for those 34 requests, because a `get_atom` call that returns a typed absence or a refusal may accrue nothing.
*Second mechanism.* `GET /obligations/source-ledger` may page or window its results, so the 34 could be present but outside the page `fetchLedgerRows` retrieved; `getSourceObligationLedgerRows` (`src/mcp.mjs:105-123`) sends no limit or cursor and reads `response.rows` as the whole set.
I cannot distinguish these from outside plan-review. This needs the reader's contract from the hauska-mcp-server seat. **I did not resolve it and I am not asserting the first.**

### On "linking appropriately with the ICC demo"

Flagging an ambiguity rather than answering the wrong question. `icc-demo` (`empressaioemail-tech/icc-demo`, 4 commits, tip `547b774`) contains **only documents**: scope, architecture scaffold, execution plan, build plan, demo script, one correspondence file. There is no code, no service, no deployment. It is the PoC brief, not a running system.

The thing plan-review links to is `icc-portal` (the deployed activity portal, link B) and `hauska-mcp-server` (the content source, link A). If "the ICC demo" means the portal, the linkage is live and correct. If it means the scope in `icc-demo/docs/00_scope.md`, note that document's decision 1 names **two** demo surfaces, "(a) The Brief extension, and (b) a generalized AI plan-review function", and this recon covers only (b). The Brief extension side is unexamined here.

---

## 6. Tenancy and personas

Personas are a hardcoded list, not a table (`src/actors.mjs:2-18`):

```js
export const QA_PERSONAS = [
  { orgId: "icc-demo", userId: "reviewer", label: "Empressa reviewer / icc-demo" },
  { orgId: "icc-demo", userId: "observer", label: "ICC observer / icc-demo" },
  { orgId: "icc-demo", userId: "applicant", label: "Applicant / icc-demo" },
  { orgId: "template-city", userId: "staff", label: "Development services staff / template-city" },
  { orgId: "bastrop_tx", userId: "staff", label: "Development services staff / bastrop_tx" },
];
```

`bastrop_tx` is registered as the fifth entry with the comment "the first REAL city tenant, not a QA/demo tenant", and the orgId deliberately matches `CODE_BOOKS["BASTROP-UDC"].publisher`. The same list is mirrored client-side in `web/app.js:20-35`, and `requireGate()` (`web/app.js:191-205`) auto-selects the persona whose orgId equals an explicit `?cityKey=`, which is how a Dashboards embed for Bastrop lands on `bastrop_tx/staff`.

Enforcement, verbatim (`src/actors.mjs:60-87`):

```js
export function engagementCrossTenantRefusal(engagement, { orgId, userId } = {}) {
  const rawOrg = String(orgId || "").trim();
  const rawUser = String(userId || "").trim();
  if (!rawOrg && !rawUser) return null;

  const persona = resolvePersona(rawOrg, rawUser);
  if (!persona) {
    return { status: 400, body: { error: "unknown_persona", ... } };
  }
  if (persona.orgId !== engagement.orgId) {
    return { status: 403, body: { error: "cross_tenant_refused",
      message: "This persona's org does not match the engagement's org.",
      personaOrg: persona.orgId, engagementOrgId: engagement.orgId } };
  }
  return null;
}
```

It is called once, at `src/server.mjs:614`, immediately after the engagement is fetched and **before** the sub-route dispatch, so one check covers `matrix`, `briefing`, `letter`, `map-feature`, `documents`, `sheets`, `dataroom-atoms`, `override`, `share`, `edition`, `files-room`, `compliance-run` and `reports/*`, on both verbs.

**Live verification, both directions, read and write**, against real Bastrop engagement `543d58db-517a-4a7c-895d-41d8383bbcf0`:

```
### READ persona=template-city/staff (cross-tenant)
{"error":"cross_tenant_refused","personaOrg":"template-city","engagementOrgId":"bastrop_tx"}   [HTTP 403]
### READ persona=icc-demo/reviewer (cross-tenant)
{"error":"cross_tenant_refused","personaOrg":"icc-demo","engagementOrgId":"bastrop_tx"}        [HTTP 403]
### READ persona=bastrop_tx/staff (same tenant)
{"id":"543d58db-...","orgId":"bastrop_tx",...}                                                 [HTTP 200]
### WRITE cross-tenant POST /edition
{"error":"cross_tenant_refused","personaOrg":"template-city","engagementOrgId":"bastrop_tx"}   [HTTP 403]
```

The refusal fires before `readJson`, so the refused write cannot mutate. The gate is also non-vacuous, proved both by the same-tenant 200 above and by the test at `web/api/g115-tenant-scope.test.mjs:84-92`, which exists specifically to catch a refuse-everything refactor.

### Canon claim 3: the refusal is narrower than "verified both directions" suggests

Three gaps, each confirmed live.

**Gap 1, no persona means no scoping.** `if (!rawOrg && !rawUser) return null;` is the first line. The code says so openly (`src/actors.mjs:52-55`: "A caller that asserts NO persona at all is unchanged from today, passes through unscoped"). Live:

```
### READ no persona
{"id":"543d58db-...","parcelNodeId":"48021:34177","projectType":"accessory-structure",
 "jurisdiction":"Bastrop County, TX","stage":"Submitted","orgId":"bastrop_tx","userId":"staff",...}
```

Full body of a real Bastrop engagement, no persona, no credential, through the public Vercel BFF.

**Gap 2, the list routes are outside the gate entirely.** `GET /api/plan-review/queue` (`src/server.mjs:273-276`), `GET /api/plan-review/reviewer/engagements` (`src/server.mjs:278-281`) and `GET /api/plan-review/findings` (`src/server.mjs:338-346`) are all matched **above** the `engMatch` block and never touch `engagementCrossTenantRefusal`. `listEngagements()` and `queueBuckets()` take no org filter (`src/store.mjs:105-125`). Live, no persona:

```
counts {'Submitted': 24, 'In Review': 1, 'Approved': 0, 'Approved with Conditions': 0, 'Denied': 0}
total 25
orgs Counter({'template-city': 11, 'bastrop_tx': 8, 'icc-demo': 6})
```

All 25 engagements of all three tenants, with `parcelNodeId`, `scopeText`, `projectType` and `filesFolderId`, served to an unauthenticated caller. `findings?sectionId=` behaves the same and joins in `parcel_node_id` across tenants (`src/store.mjs:214-224`).

**Gap 3, the persona is self-asserted.** `personaFromHeader` reads the `x-persona` header (`src/server.mjs:137-142`) and anyone can set it. The code is explicit (`src/actors.mjs:44-49`): "ANY CALLER CAN SET IT. This is a narrowing ... not an authentication system." It stops a Bastrop-identified session from reading template-city; it does not stop anyone from claiming to be Bastrop.

Gaps 1 and 3 are documented in the source. **Gap 2 is not documented anywhere I found and is the one worth raising**, because a Bastrop pilot's engagement list, scope text and parcel ids are world-readable through the deployed app right now. Related: the BFF gates `/api/icc/*` and `/api/smart-files/*` on a persona but passes `/api/plan-review/*` through with no persona requirement at all (`web/api/backend.js:132-155`), which is what makes all of the above reachable without any credential.

---

## 7. Coverage honesty

**It is typed absence, verified in the code and live, and it is one of the strongest parts of this service.**

Four kinds, with distinct HTTP statuses so a caller that ignores the body cannot mistake an absence for a hit (`src/code-lookup.mjs:91-114`):

```js
export const ABSENCE_KINDS = Object.freeze({
  UNCHECKED: "unchecked",                    // never ingested; a claim about our corpus
  SOURCE_UNAVAILABLE: "source-unavailable",  // ingested, could not retrieve this call
  NOT_ENTITLED: "not-entitled",              // behind a licence we do not hold
  ABSENT_VERIFIED: "absent-verified",        // read the edition, confirmed not in it
});
export const ABSENCE_HTTP_STATUS = Object.freeze({
  [ABSENCE_KINDS.UNCHECKED]: 404,
  [ABSENCE_KINDS.ABSENT_VERIFIED]: 404,
  [ABSENCE_KINDS.NOT_ENTITLED]: 402,
  [ABSENCE_KINDS.SOURCE_UNAVAILABLE]: 503,
});
```

The constructor refuses to build a hollow absence (`src/code-lookup.mjs:240-259`):

```js
  if (!status) { throw new Error(`unknown absence kind: ${String(kindValue)}`); }
  if (!basis) throw new Error("an absence without a basis is not a typed absence");
```

and carries no citation, heading, atom id or deep link, "because those are exactly the fields the old fallback filled from a neighbour".

**No fabricated pass is reachable.** `matrixFromChain`'s row helper sets `absence` to null only when `determination` is `Pass` or `Fail` (`src/mcp.mjs:261`), and `sql/005_engagement_edition.sql:56-62` enforces the biconditional in the database:

```sql
  CHECK (
    (determination IN ('Pass', 'Fail') AND absence IS NULL)
    OR
    (determination NOT IN ('Pass', 'Fail') AND absence IS NOT NULL)
  ) NOT VALID;
```

`NOT VALID` means the 12 pre-existing rows are not scanned. That gap is visible in production: the findings I read include 2 rows on `14-02-003` with `determination: 'Uncertain'` and `absence: None`, and rows on `R302.1`/`R311.7` still carrying `bookId: 'IBC2018P6'` from before the IRC mislabel was corrected. The migration argues for leaving them rather than backfilling "a specific reason nobody captured at write time", which is the right call, but the practical effect is that a query counting honest absences must exclude those legacy rows explicitly.

**Verified by violation, live.** Six distinct absence and refusal shapes, none of which returned a neighbour or a 200:

```
book=IBC&section=9999.99   -> 404 {"absence":{"status":"absent-verified","basis":"The substrate holds this edition and returned no atom at the computed DID for section 9999.99."}}
book=IBC&section=R311.7    -> 404 {"absence":{"status":"unchecked", ...}}   (fails LIVE_SECTION_NUMBER_RE, stays pure)
book=IPMC&section=304.1    -> 404 {"absence":{"status":"unchecked","basis":"G-41. IPMC 2018 has zero ingested sections..."}}
book=BASTROP-UDC&section=14-02-005 -> 404 {"absence":{"status":"unchecked","detail":{"ingestedSections":["14-02-003","14-02-008"]}}}
book=NEC&section=210.8     -> 400 {"error":"unknown_book","books":["IBC2018P6","IPMC2018P2","BASTROP-UDC"]}
book=IBC (no section)      -> 400 {"error":"section_required","ingestedSections":[]}
```

The `absent-verified` result on `9999.99` is the notable one. That is the strong claim, and it was earned: the substrate was asked, it held the edition, and it answered no atom. The `unchecked` on `R311.7` is the weak claim and it was correctly kept weak.

**Refusals are metered at zero rather than dropped** (`src/server.mjs:357-373`), with the comment "Dropping the row instead would make the refusal rate invisible, which is how the old fallback stayed unnoticed." Live confirmation in the tier histogram above: `absent:unchecked` 9, `refused` 3, `absent:absent-verified` 2, `absent:source-unavailable` 2, all at `amount: 0`.

**The one honesty defect** is the branch asymmetry named in section 5: on the manifest branch there is no NOT_ENTITLED or ABSENT_VERIFIED classification, only `sectionShaped` then `source-unavailable`. A permission problem on a Bastrop section would be reported as an outage.

---

## 8. Extension points for an external permit record

### What an external permit record carries versus what intake needs

| MyGov permit field | plan-review intake | gap |
| --- | --- | --- |
| permit number | none | needs a column |
| **address** | **`parcelNodeId` (`48021:34177`)** | **the real problem, see below** |
| permit/project type | `projectType` (free text, unvalidated) | direct map |
| applicant | none | needs a column |
| attached documents | optional, `POST /engagements/:id/documents` with `bytesBase64` | works today, not required |
| jurisdiction | derived from the parcel FIPS prefix | free once the parcel resolves |

### The blocker: address to parcelNodeId

`POST /api/plan-review/geocode` is a tombstone (`src/server.mjs:589-596`):

```js
  if (req.method === "POST" && path === "/api/plan-review/geocode") {
    json(res, 410, {
      error: "extinguished",
      message: "Cotality geocode is dead. Intake with parcelNodeId. Zero Cotality calls.",
      cotalityCalls: 0,
    });
```

and `refuseCotality` (`src/server.mjs:144-147`) 400s any intake body whose JSON contains `cotality`, `corelogic` or `get_property_detail`. Correct under the standing ruling and not to be undone.

There is no address resolver anywhere in this repository. I searched all 36 files at this ref for `geocode`, `address`, `resolve_place`, `lat` and `lng`: the only hits are the 410 route and the `FORBIDDEN` regexes in `src/mcp.mjs:10` and `src/store.mjs:6`.

The re-route exists one layer out. `hauska-mcp-server` exposes `resolve_place`, live description: "Resolve an address or lat/lng to placeKey, jurisdiction_key, optional ll_uuid and workspace DID. Central TX pilot only ... Requires authenticated brokerage/cortex API key. Example jurisdiction_key: bastrop-tx". Bastrop is in the pilot. Three things make this not a drop-in, and each should be settled before anyone estimates the work:

1. plan-review holds `HAUSKA_MCP_PLATFORM_KEY`, and `resolve_place` asks for a brokerage/cortex product key. Whether the platform key satisfies that tier is **unverified**; I could not test it without the secret.
2. `resolve_place` returns a `placeKey`. Whether a `placeKey` is the same string as the `county_fips:prop_id` shape `parcelNodeId` that `get_property_atom_chain` and `jurisdictionFromParcel` both expect is **unverified**. If it is not, a crosswalk is needed, and the Hays experience says never join by a bare number.
3. `resolve_place`'s own documented failure modes are `geocode_miss` and `no_coverage`. A permit whose address does not resolve must produce a refusal or an unaccounted engagement, never a guessed parcel. Given that intake currently accepts **any string** as `parcelNodeId` with no validation, the easy wrong thing here is to write the raw MyGov address into that column and get an engagement whose whole matrix silently reads `not_ready`. That is the fail-closed line for this card.

### Concretely, what changes

The smallest honest shape is a new route beside intake rather than a change to it, so nothing about the existing surface moves:

- **New**: `POST /api/plan-review/intake/permit` in `src/server.mjs`, next to the existing handler at line 551. Body: `{ orgId, userId, permitNumber, address, permitType, applicant, parcelNodeId? }`. It resolves the address if `parcelNodeId` is absent, refuses with a typed absence if resolution fails, then calls the existing `createEngagement` and `seedMatrix` unchanged.
- **New**: an address resolver module, say `src/place.mjs`, alongside `src/mcp.mjs`. It should call `mcpCall("resolve_place", ...)`, which already exists and already carries the `x-hauska-key` plumbing and the Cotality refusal (`src/mcp.mjs:40-81`). No new HTTP client.
- **Change**: `createEngagement` (`src/store.mjs:45-62`) plus a migration `sql/006_*.sql` adding `permit_number`, `external_source`, `external_ref`, `applicant` and `site_address` columns, and `mapEngagement` (`src/store.mjs:346-363`) to expose them. Do not smuggle them into `scopeText`; the ledger and the letter both read structured fields and a packed string will be re-parsed by somebody.
- **Change**: `letterHtml` (`src/server.mjs:182-198`) to print the permit number, since the decision letter is the artifact that would go back to MyGov.
- **Unchanged**: the whole determination pipeline, the code lookup, the citation minting, the tenancy gate. A permit-sourced engagement is an ordinary engagement.
- **New persona**: if the ingest runs as a service rather than as a person, it needs its own registered entry in `QA_PERSONAS` (`src/actors.mjs:2-18`) with `orgId: "bastrop_tx"`, or every write it makes is either an `unknown_persona` 400 or is attributed to `bastrop_tx/staff`, a human. Note the constraint recorded at `src/actors.mjs:6-8`: the orgId/userId pair must match smart-files' own `QA_PERSONAS` exactly, or any file write 400s. That is a second repository and a second seat.

### What makes this hard, ranked

1. **Address to parcel.** Everything above is mechanical; this is not. It needs a decision on which key and which identifier, and a refusal path when the address does not resolve.
2. **"Without disturbing their existing workflow" needs a direction decision that is not in the code.** Pull (plan-review polls MyGov) and push (MyGov webhooks plan-review) are both absent today; this repository has no scheduler, no queue, no webhook receiver, and no outbound HTTP client other than the two typed ones for MCP and Smart Files. The lowest-disturbance shape for a single test review is neither: export one permit by hand and POST it. That needs no MyGov integration at all and answers the question the test review is actually asking.
3. **Idempotency.** `recordActivity`'s `dedupKey` is minted per inbound HTTP request (`src/server.mjs:254`) and explicitly "does not and cannot catch a client-side retry". There is no uniqueness constraint on `plan_review_engagements`, so re-importing the same permit creates a duplicate engagement. If this ever becomes a feed rather than a one-off, `external_source + external_ref` needs a unique index in the same migration.
4. **The determination will be thin and should be said out loud.** With four fixed rows, one adjudicator and a Bastrop manifest holding two of its eight real sections, a permit-sourced review yields one meaningful determination. Fixing the Bastrop manifest first (section 4) makes the test review considerably more convincing for roughly no effort.

---

## Ranked recommendations

1. **Wire the six unwired Bastrop sections** (`src/code-lookup.mjs:178-185`), or give BASTROP-UDC its own live path with a dash-form section pattern and DID builder. Highest value per unit of work on this product, and it is the difference between a demo that cites two sections and one that cites a code.
2. **Scope `/queue`, `/reviewer/engagements` and `/findings` to the asserted persona**, and require a persona on `/api/plan-review/*` at the BFF. A live city tenant's engagement list is currently world-readable.
3. **Correct the `public-free` comment at `src/server.mjs:386-388`** and give the manifest branch the same `classifyLiveSectionFetch` treatment the live branch has, so an entitlement failure reports as 402 rather than 503.
4. **Split `NO_CORRELATION_KEY`** in `src/ledger-reconciliation.mjs:63-67` into "no key" and "key present, no ledger row", then find out which of the two mechanisms explains the 34.
5. **Settle the `resolve_place` key and identifier questions** before scoping the permit intake card. Two calls with the right credential answer both.
6. **Resolve the two Bastrop editions** (`bastrop-b3-code-april-2025` versus `bastrop_tx-bdc-2026-adopted`) under MOST-CURRENT SOURCE WINS.

---

## What I could not determine and why

**Whether the 34 unmatched ledger correlations are real misses or a paging artifact.** `getSourceObligationLedgerRows` (`src/mcp.mjs:105-123`) sends no limit or cursor and treats `response.rows` as the complete set. Resolving this needs the contract of `GET /obligations/source-ledger` in `hauska-mcp-server`, another seat's repository and outside this mission's read scope. I did not read it and I am not asserting either mechanism.

**Whether `HAUSKA_MCP_PLATFORM_KEY` satisfies `resolve_place`'s brokerage/cortex tier.** Testing requires the secret value, which I will not read or print. This is the first thing to check before scoping the permit intake card, and it is one call.

**Whether a `placeKey` from `resolve_place` is directly usable as a `parcelNodeId`.** Same reason: the tool refuses anonymous callers, so I could not observe its output shape.

**Whether the Bastrop `accessPolicy` divergence is atom-level policy or an anonymous-path rule for all `code-section` atoms.** I lacked a positive control, that is, a code-section atom known to be genuinely public-free. Grand County (`grand_county_ut`, 285 atoms, listed public-free) would supply one and was outside my scope. Routing this to the hauska-mcp-server seat rather than guessing.

**The exact count of ingested Bastrop sections.** My sweep was bounded: chapters 14-01 to 14-10 at sections 001 and 003, plus 14-02-001 to 14-02-020 exhaustively. That establishes a floor of 8 sections in chapter 14-02 and content in at least 9 chapters. It is not a total. A keyed `search_atoms` or `query_jurisdiction` against `bastrop_tx` would give the real number in one call; anonymously both are filtered to zero. The jurisdiction row reports `atomCount: 193`, which includes non-section atom types and is not the section count.

**Whether the pre-G-113 legacy findings rows would fail the absence CHECK if it were validated.** The constraint is `NOT VALID` and I did not run `VALIDATE CONSTRAINT`, which would be a write. From the live read, at least 2 rows on `14-02-003` and 2 on `R302.1` carry `determination: 'Uncertain'` with `absence: null` and would fail. That is a known, documented and deliberately tolerated gap, not a new finding.

**Whether `GET /matrix` behaves as read or as write for a permit-sourced engagement.** I deliberately did not call it. `seedMatrix` upserts findings and records an ICC activity row, so it is a mutation, and this lane had no mandate to write to the ICC ledger beyond what the code-lookup probes already cost.

**The Brief extension half of the icc-demo scope.** `docs/00_scope.md` decision 1 names two demo surfaces. This recon covered the plan-review one only.
