---
title: "SURVEY: hauska-mcp-server atom-contract dual pin"
date: 2026-08-08
status: active
type: survey
scope: hauska-mcp-server
last_updated: 2026-08-08
---

# SURVEY: hauska-mcp-server atom-contract dual pin

## VERDICT: DEBT, not a live defect

The dual pin is real and confirmed, but it cannot emit divergent shapes to agents. Three independent facts establish this, each verified by inspecting the installed packages rather than by reading changelogs.

First, there is **zero symbol overlap**. Every symbol drawn from `@hauska/atom-contract` comes from the barrel, `/export`, `/conformance`, or `/read-contract`. The only two symbols drawn from `@empressaio/atom-contract` come from `/reasoning`, a subpath that **does not exist in `@hauska@1.6.1` at all** (`node_modules/@hauska/atom-contract/dist/reasoning`: `No such file or directory`). No symbol is imported from both packages. No atom shape, entity type, accessPolicy union, or Zod schema has two competing definitions bound into one call path.

Second, where the two packages do ship the same module, the compiled output is **byte-identical**. `dist/registration.js`, `dist/read-contract/read-contract.js`, and `dist/read-contract/common.js` all pass `diff -q` with no output. The entire `dist/export/` directory is identical (`diff -rq` returns nothing). The `@empressaio@1.9.0` tree is a strict superset of `@hauska@1.6.1`: every difference found by a recursive diff is either an added file or a docstring changing the package name in an `Import from ...` line.

Third, the highest-risk case is clean. **The accessPolicy union is identical in both pinned versions**, the same five values, on the same line number, in both files:

```
node_modules/@hauska/atom-contract/dist/registration.d.ts:48
node_modules/@empressaio/atom-contract/dist/registration.d.ts:48
export type AccessPolicy = "public-free" | "public-paid" | "platform-internal" | "tenant-private" | "tenant-shared";
```

The runtime Zod enum agrees too: `ACCESS_POLICY_SCHEMA = z.enum([...])` over the same five values at `node_modules/@hauska/atom-contract/dist/conformance/common.js:22` and `node_modules/@empressaio/atom-contract/dist/conformance/common.js:31`. The four-value-union hazard named in the brief does not apply: `@hauska@1.6.1` is well past the 1.2.0 boundary where the fifth value landed.

The premise that `@hauska@1.6.1` "never received the property atom family" is **correct but not load-bearing**, because this repo never imports the property family from either package. `dist/property` exists only under `@empressaio` and is not referenced by any source file in the repo.

What remains is genuine debt: a retired package name is pinned in production, frozen upstream at 1.6.1 while the live contract has moved to 1.12.0. That is a staleness and supply-chain problem, not a correctness problem today.

---

## 1. The import map

Full inventory. Every import site of either package across `src/` and `tests/`. Symbols listed exactly as imported.

### From `@hauska/atom-contract` (16 import sites, 12 files)

| File:line | Subpath | Symbols | Kind |
|---|---|---|---|
| `src/access-policy.ts:7` | barrel | `AccessPolicy` | type-only |
| `src/atom-export.ts:3` | barrel | `AccessPolicy` | type-only |
| `src/atom-export.ts:4-7` | `/export` | `createDownloadableAtom`, `DownloadableAtom` (type) | **runtime** (one value) |
| `src/atom-export.ts:8` | barrel | `ContextSummary` | type-only |
| `src/atom-export.ts:9` | `/read-contract` | `ReadContract` | type-only |
| `src/atom-shape.ts:22` | `/read-contract` | `ReadContract` | type-only |
| `src/conformance-check.ts:3-7` | `/conformance` | `ATOM_CONFORMANCE_TARGET_VERSION`, `validateAtomConformance`, `AtomConformanceValidationResult` (type) | **runtime** (two values) |
| `src/conformance-check.ts:8` | barrel | `AccessPolicy` | type-only |
| `src/conformance-check.ts:9` | `/read-contract` | `ReadContract` | type-only |
| `src/gate-front.ts:6` | barrel | `AccessPolicy` | type-only |
| `src/hauska-client.ts:23` | barrel | `AccessPolicy` | type-only |
| `src/property-atom-chain.ts:7` | barrel | `AccessPolicy` | type-only |
| `src/read-contract-bridge.ts:3-10` | `/read-contract` | `createConsequenceAxis`, `createReadContract`, `createThreeAxisConfidence`, `READ_CONTRACT_SCHEMA`, `ModelAttributionStamp` (type), `ReadContract` (type) | **runtime** (four values) |
| `src/tools.ts:14` | barrel | `AccessPolicy` | type-only |
| `src/tools.ts:352, 527, 2047, 5601` | barrel | `AccessPolicy` via inline `import("@hauska/atom-contract").AccessPolicy` | type-only (type-position only) |
| `tests/list-jurisdictions-visibility.test.ts:26` | barrel | `AccessPolicy` | type-only |
| `tests/property-atom-chain.test.ts:6` | barrel | `AccessPolicy` | type-only |
| `tests/read-contract-conformance.test.ts:9` | `/conformance` | `validateAtomConformance`, `ATOM_CONFORMANCE_TARGET_VERSION` | **runtime** |
| `tests/tenant-isolation.test.ts:6` | barrel | `AccessPolicy` | type-only |

### From `@empressaio/atom-contract` (2 import sites, 2 files)

| File:line | Subpath | Symbols | Kind |
|---|---|---|---|
| `src/source-obligation-meter.ts:11-14` | `/reasoning` | `ICC_ACTOR_RECORD_FIXTURE`, `ICC_LICENSE_REFERENCE_OBLIGATION_FIXTURE` | **runtime** (two values) |
| `tests/source-obligation-meter.test.ts:12-15` | `/reasoning` | `ICC_ACTOR_RECORD_FIXTURE`, `ICC_LICENSE_REFERENCE_OBLIGATION_FIXTURE` | **runtime** |

The `@empressaio` surface is exactly two fixture constants, imported in exactly one production file and its test.

---

## 2. The overlap: the central question

**There is no overlap.** No symbol is imported from both packages.

The distinct symbol sets:

- `@hauska` supplies: `AccessPolicy`, `ContextSummary`, `ReadContract`, `ModelAttributionStamp`, `DownloadableAtom`, `AtomConformanceValidationResult`, `createDownloadableAtom`, `createConsequenceAxis`, `createReadContract`, `createThreeAxisConfidence`, `READ_CONTRACT_SCHEMA`, `validateAtomConformance`, `ATOM_CONFORMANCE_TARGET_VERSION`.
- `@empressaio` supplies: `ICC_ACTOR_RECORD_FIXTURE`, `ICC_LICENSE_REFERENCE_OBLIGATION_FIXTURE`.

Intersection is empty.

### Are there two definitions of the same shape live in one process?

Technically yes at the module level, Node resolves `@hauska/atom-contract/dist/registration.js` and `@empressaio/atom-contract/dist/registration.js` as separate module instances if both load. But this is inert for two reasons.

The definitions **agree byte-for-byte**. `diff -q` on `dist/registration.js` and on `dist/read-contract/read-contract.js` both report identical. Two identical Zod schemas validating the same input produce the same verdict.

More importantly, the two graphs barely touch. The `@empressaio` graph loaded here is narrow, `dist/reasoning/index.js` re-exports `../reasoning-chain.js` and `./fixtures.js`, and `fixtures.js` pulls `../read-contract/reasoning-axes.js`, `../read-contract/common.js`, `../og/common.js`, `../actor-record.js` (`node_modules/@empressaio/atom-contract/dist/reasoning/fixtures.js:7-10`). Of those, `read-contract/common.js` is byte-identical to its `@hauska` counterpart; the rest (`reasoning-axes`, `og`, `actor-record`) **have no `@hauska` counterpart at all**, they are 1.8.0+ additions. So the only module that genuinely double-loads is one whose two copies are identical.

### The accessPolicy union specifically

Verified by direct inspection of installed packages, per instruction. Both are the five-value union at `registration.d.ts:48` (quoted in the verdict above). Both runtime enums list the same five values. **No divergence.** The `ACCESS_POLICY_VALUES` array is likewise identical, differing only in line offset (`@hauska` line 15, `@empressaio` line 24) because `@empressaio` inserts two added constants above it.

### One nuance worth recording

`@empressaio@1.9.0` `dist/conformance/common.js:14-22` adds two constants absent from `@hauska@1.6.1`:

```
export const REASONING_CONFORMANCE_TARGET_VERSION = "1.8.0";
export const PROPERTY_CONFORMANCE_TARGET_VERSION = "1.9.0";
```

`ATOM_CONFORMANCE_TARGET_VERSION` itself is `"1.5.0"` in **both** packages (`@hauska` common.js:13, `@empressaio` common.js:13). The repo validates conformance through the `@hauska` copy (`src/conformance-check.ts:3-7`), which reports 1.5.0, the same value the newer package would report. Additive-only, no conflict.

---

## 3. Type-only or runtime?

Classified in the table in section 1. Summary:

**Type-only (erased at build, zero runtime effect):** all `AccessPolicy` imports across 10 files, plus `ContextSummary`, `ReadContract`, `ModelAttributionStamp`, `DownloadableAtom`, `AtomConformanceValidationResult`. This is the overwhelming majority of the `@hauska` surface, notably **every single `AccessPolicy` import in the repo is `import type`**, including the four inline `import("@hauska/atom-contract").AccessPolicy` type-position uses in `src/tools.ts` (352, 527, 2047, 5601). The highest-risk symbol is the one with the least runtime presence: it contributes nothing to the emitted JavaScript.

**Runtime (real value imports):**
- `@hauska/atom-contract/export` → `createDownloadableAtom` (`src/atom-export.ts:5`)
- `@hauska/atom-contract/conformance` → `validateAtomConformance`, `ATOM_CONFORMANCE_TARGET_VERSION` (`src/conformance-check.ts:4-5`)
- `@hauska/atom-contract/read-contract` → `createConsequenceAxis`, `createReadContract`, `createThreeAxisConfidence`, `READ_CONTRACT_SCHEMA` (`src/read-contract-bridge.ts:4-9`)
- `@empressaio/atom-contract/reasoning` → `ICC_ACTOR_RECORD_FIXTURE`, `ICC_LICENSE_REFERENCE_OBLIGATION_FIXTURE` (`src/source-obligation-meter.ts:12-13`)

So both packages do contribute runtime code, this is a **runtime dual-pin, not a type-only one**. Under the brief's own rule that would point at "live defect." It does not, because the runtime sets are disjoint and the shared modules underneath them are byte-identical. The dual-pin is runtime in mechanism but inert in effect.

---

## 4. What reaches agents

The `@hauska` runtime symbols genuinely shape agent-visible responses. `createReadContract` / `createThreeAxisConfidence` / `createConsequenceAxis` build the read-contract object that `src/read-contract-bridge.ts` attaches to read envelopes, per `src/atom-shape.ts:19-20`, "every read envelope carries a @hauska/atom-contract read-contract object alongside provenance." That is on the response path for tools across the read surface, spanning the public, codex, reporting, and map gates. `createDownloadableAtom` shapes the `atom_export` tool response. `validateAtomConformance` gates read-tool conformance.

The `@empressaio` runtime symbols **do not reach agents at all**. Traced end to end:

`ICC_ACTOR_RECORD_FIXTURE.actorId` becomes `ICC_ACTOR_DID` and `ICC_LICENSE_REFERENCE_OBLIGATION_FIXTURE.anchorDid` seeds `ICC_SOURCED_ATOM_DID_ALLOWLIST` (`src/source-obligation-meter.ts:22, 34`). Both are internal DID-matching constants, they are compared against, never serialized outward.

Only two modules import from `source-obligation-meter.js`, and neither returns its data to a caller:
- `src/atom-shape.ts:42` imports `extractCitedAtomDid`, a helper, not a fixture consumer.
- `src/read-attribution.ts:21` imports `accrueSourceObligations`, called at `src/read-attribution.ts:100-106` as a **fire-and-forget statement with no return value captured**, writing a ledger row.

Grepping for the fixture-derived exports outside their defining module returns nothing: neither `ICC_ACTOR_DID` nor `ICC_LICENSE_REFERENCE_OBLIGATION` is referenced anywhere else in `src/`.

**Answer to "would an agent consumer see a divergence": no.** There is no divergence to see, and even if the `@empressaio` fixtures changed shape, the blast radius is the `source_obligation_ledger` table, an internal billing-accrual artifact, not any tool response field on any of the four gates. No tool name and no response field can be named as at risk, because none exists.

---

## 5. Why the dual pin exists

Deliberate and narrow, not accidental. Blame is unambiguous (`git blame -L 18,25 -- package.json`):

```
5dc8fac2 (empressaioemail-tech 2026-07-23 17:15:03 -0500 20)     "@empressaio/atom-contract": "^1.9.0",
9cde6303 (empressaioemail-tech 2026-07-05 09:15:16 -0500 23)     "@hauska/atom-contract": "^1.6.1",
```

The `@hauska` pin came first, set to `^1.6.1` on 2026-07-05 in `9cde630` ("feat(gate): four-product gate rework"). The `@empressaio` pin was added 18 days later on 2026-07-23 in `5dc8fac` ("feat(metering): inbound ICC source-obligation meter (I-K / 2.5.4) (#46)").

PR #46's own description states the reason directly:

> Uses shipped `@empressaio/atom-contract` `ICC_ACTOR_RECORD_FIXTURE` / `ICC_LICENSE_REFERENCE_OBLIGATION_FIXTURE` (`license-reference-royalty`, `owedToActorDid`, `meterFreeTier: true`).

This is the **forced-hand pattern, not a partial migration**. The author needed two fixtures that live only in the renamed package (the `/reasoning` subpath first appears at 1.8.0; `@hauska` is frozen at 1.6.1 and never received it). Rather than migrate the whole repo mid-feature, they added the second dependency for the two symbols they needed and left the existing surface untouched. Nothing in PR #46 mentions migrating the `@hauska` imports, and no decision record in this repo proposes the migration. The dual pin was a side effect of shipping the ICC meter, accepted silently.

No code comment anywhere in `src/` acknowledges that two contract packages are installed. That silence is the actual defect in this picture, the next reader has no signal.

---

## 6. Migration surface

**Mechanical.** Every symbol the repo imports from `@hauska@1.6.1` also exists in `@empressaio`, at identical or additive-compatible shape.

Evidence: `diff -rq node_modules/@hauska/atom-contract/dist node_modules/@empressaio/atom-contract/dist` yields only two categories, files **only in** `@empressaio` (`actor-record`, `obligation`, `og/`, `property/`, `reasoning/`, `reasoning-chain`, `read-contract/reasoning-axes`), and files that differ. Inspecting the differing ones on the paths this repo actually uses:

- `dist/registration.js`, identical (`diff -q` silent). `AccessPolicy` unchanged.
- `dist/read-contract/read-contract.js`, identical. `READ_CONTRACT_SCHEMA`, `createReadContract` unchanged.
- `dist/read-contract/common.js`, identical. `createThreeAxisConfidence`, `createConsequenceAxis` unchanged.
- `dist/read-contract/index.js`, differs only by the docstring package name and one added line, `export * from "./reasoning-axes.js"` (additive re-export).
- `dist/conformance/index.js`, differs only by the docstring and two added constant re-exports (`REASONING_CONFORMANCE_TARGET_VERSION`, `PROPERTY_CONFORMANCE_TARGET_VERSION`). `validateAtomConformance` and `ATOM_CONFORMANCE_TARGET_VERSION` still exported, still `"1.5.0"`.
- `dist/export/`, entire directory identical. `createDownloadableAtom`, `DownloadableAtom` unchanged.

**Symbols that exist in `@hauska@1.6.1` and are missing or reshaped in `@empressaio`: none found.** The relationship is superset, not divergence.

One caveat the brief asks about that I could only partially close: the comparison above is `@hauska@1.6.1` against `@empressaio@**1.9.0**`, the version installed in `node_modules`. The brief names `1.12.0` as the current published contract, and 1.12.0 is **not installed here**, so I could not diff against it. Three minor versions of drift (1.9.0 → 1.12.0) are unexamined. Nothing suggests a break, but I am not asserting it.

**Surface estimate, if the `@hauska` pin were dropped:** 12 files carry `@hauska` import specifiers, 8 in `src/`, 4 in `tests/`. Counting distinct edit locations rather than files, there are 16 import statements plus 4 inline type-position references in `src/tools.ts` (352, 527, 2047, 5601), which a plain string replacement would also catch. Non-code touch points: 1 line in `package.json:23`, the lockfile, and roughly 8 comment/docstring mentions of the old name across `src/atom-shape.ts:20,830`, `src/access-policy.ts:15`, `src/conformance-check.ts:1`, `src/read-contract-bridge.ts:1`, `src/atom-export.ts:1`, `src/hauska-client.ts:161`, and `tests/list-jurisdictions-visibility.test.ts:11,86`. Note `tests/list-jurisdictions-visibility.test.ts:86` contains a test whose **name string** hardcodes the old package: `"AccessPolicy import resolves from @hauska/atom-contract"`.

I am not proposing a plan; the master planner rules. Recording only that the evidence points at find-and-replace plus a version bump, with no shape adaptation required at 1.9.0.

---

## 7. Deployment reality

**The deployed server matches the repo pins.** Chain of evidence:

`mcp.hauska.dev` does not resolve, `nslookup` returns `Non-existent domain`. The subdomain named as the v1 launch target in CLAUDE.md was never registered. The live service is the Cloud Run default URL, per `deploy/README.md:18`:

```
https://hauska-mcp-server-h7gvu7rgcq-uc.a.run.app
```

Live probe (read-only GET, `-k` per the TLS-intercepting-proxy note in `90_runbooks/buildout_deploy_wiring_checklist.md:60`):

```
{"status":"ok","service":"hauska-mcp-server","version":"0.1.0","env":"production",
 "metrics":{"started_at":"2026-08-05T19:39:28.280Z","uptime_s":259519,
 "total_requests":265,"total_errors":0,"error_rate":0,
 "last_successful_call":"2026-08-08T16:23:47.118Z"},
 "dependencies":{"engine_retrieval_api":{"state":"ok","latency_ms":23,"detail":"HTTP 404"},
 "cortex_api":{"state":"ok","latency_ms":32},"postgres":{"state":"ok","latency_ms":30},
 "rate_limit_store":{"state":"ok","latency_ms":219,"detail":"postgres"}}}
```

The revision started `2026-08-05T19:39:28Z`. Repo HEAD is `b5f26de`, committed `2026-08-05 14:33:10 -0500` = `19:33:10Z`, six minutes before the container started. `git log --since="2026-08-05T19:39:28Z"` returns **empty**: no commit has landed since the deploy. The working tree is clean (`git status --short` empty).

Corroborating marker: HEAD's two commits are the T4 Postgres rate-limit store replacing Upstash, and the live `/health` reports `"rate_limit_store": {"detail":"postgres"}`. The deployed image carries that change, so it is at or after `15d515f`/`b5f26de`, not an older revision.

Pin fidelity through the build: `Dockerfile:17` and `Dockerfile:34` both run `npm ci`, which is lockfile-authoritative and fails on any package.json/lock mismatch. The lockfile resolves exactly:

```
node_modules/@empressaio/atom-contract -> 1.9.0
node_modules/@hauska/atom-contract -> 1.6.1
```

So the deployed container carries `@hauska@1.6.1` and `@empressaio@1.9.0`, the same dual pin as the repo, and the same versions I inspected in `node_modules`. My findings apply to production, not merely to a local checkout.

Worth flagging separately: `.github/workflows/ci.yml:21` runs `npm install --no-audit --no-fund`, **not** `npm ci`. CI is therefore free to resolve `^1.9.0` and `^1.6.1` to newer versions than the lock pins, meaning CI could test against a different tree than Docker ships. That is a real (if currently harmless) divergence between the gate and the artifact. It is not part of the dual-pin question but it sits adjacent to it. `ci.yml` is the only workflow in the repo, there is no deploy workflow; deployment is manual/Cloud Build via `cloudbuild-mcp.yaml` referenced in PR #46.

---

## WHAT I COULD NOT DETERMINE

**Whether `@empressaio@1.12.0` is drop-in compatible.** Only 1.9.0 is installed. My superset finding is `1.6.1 → 1.9.0`; the three minor versions to 1.12.0 are unexamined. Closing this needs the 1.12.0 tarball inspected. I deliberately did not install it (read-only mandate).

**Live tool introspection.** I confirmed the deployed service is healthy and matches HEAD, but did not enumerate the served tool list or gate assignments. The admin introspection endpoint requires the `X-Hauska-Key` credential, which I do not hold and would not use unprompted. The four-gate claim and the tool-to-gate mapping in section 4 rest on repo source, not on live introspection.

**Whether the ICC meter has ever actually fired in production.** PR #46's test plan leaves the deploy-verification checkbox unticked (`[ ] Deploy MCP @ 100%; anonymous get_property_atom_chain ...; SQL row in source_obligation_ledger`). Confirming would require querying `source_obligation_ledger` on prod Neon, a DB read I did not perform under the read-only mandate. This does not affect the verdict; it bears on whether the `@empressaio` dependency is earning its place at all.

**Cloud Run revision identity.** I inferred the deployed code from `started_at` versus commit timestamps plus the postgres rate-limit marker. I did not run `gcloud run revisions describe` to read the actual image digest, so the match is strongly evidenced but not digest-proven.

**Whether other repos in the portfolio carry the same dual pin.** Scope was `hauska-mcp-server` only. A sibling `P:\hauska-mcp-worktrees\` directory exists and was not surveyed.
