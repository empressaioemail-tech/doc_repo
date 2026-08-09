---
id: 2026-08-08_SURVEY_ldt_decomposition_state
title: Survey — legacy-design-tools decomposition state against the three clocks
status: active
last_updated: 2026-08-08
applies_to: legacy-design-tools
related: [_catalog/repo_intents.md, _decisions/2026-07-04_ldt_decomposition_retirement_path.md, 80_adrs/adr_008_engine_factor_out.md]
---

# Survey: legacy-design-tools decomposition state

Read-only survey answering the operator's question: "i was under the impression that legacy design tools was out of the picture i had broke it down when i built the spine." This is a survey, not a plan. No migration recommendation is offered; the master planner rules.

Survey basis: working clone at `P:\legacy-design-tools`, branch `feat/manifest-observability-tables`, HEAD `fe4fe58b` (2026-08-08 14:25:49 -0500). Commit history read against `origin/main`, tip `85f3c370` (2026-08-08 13:41:34 -0500). Live state read from `gcloud`, `npm`, and `curl` against production on 2026-08-08.

## Headline

legacy-design-tools is not out of the picture. It is the single most active repository in the portfolio and it is where the county-manifest factory, the boundary layer, and the CAD ingest rail have all landed in the last thirty days, including today. Three commits from today (2026-08-08) added seven new database tables. The clock-3 piece did not shrink by absorption; it grew.

## 1. Full topology, package by clock

Workspace config is `pnpm-workspace.yaml:1-6`, globbing `packages/*`, `artifacts/*`, `lib/*`, `lib/integrations/*`, and `scripts`. Forty-three packages carry a `package.json`. Two additional directories under `artifacts/` are Python sidecars with no `package.json` and are therefore invisible to the workspace but present in the deployed image.

| Package | Clock | Evidence |
|---|---|---|
| `@workspace/design-tools` (artifacts/design-tools) | 1 | Named in `repo_intents.md:32` as the root design-tools SPA |
| `@workspace/codex-reviewer-qa` (artifacts/codex-reviewer-qa) | 2 | Named in `repo_intents.md:32` as the Cortex console |
| `@empressaio/cortex-client` (packages/cortex-client) | 2 | Component package, `repo_intents.md:16` rename list |
| `@empressaio/cortex-tiles` (packages/cortex-tiles) | 2 | Component package, `repo_intents.md:16` rename list |
| `@empressaio/design-tokens` (packages/design-tokens) | 2 | Component package, `repo_intents.md:16` rename list |
| `@empressaio/document-viewer` (packages/document-viewer) | 2 | Component package, `repo_intents.md:16` rename list |
| `@empressaio/tile-shell` (packages/tile-shell) | 2 | Component package, `repo_intents.md:16` rename list |
| `@workspace/api-server` (artifacts/api-server) | 3 | This IS cortex-api; Cloud Run service `cortex-api`, `Dockerfile:159` |
| `@workspace/db` | 3 | lib package; holds all 73 migrations |
| `@workspace/adapters` | 3 | lib package; the adapters the intent says the spine should take |
| `@workspace/api-client-react` | 3 | lib package |
| `@workspace/api-spec` | 3 | lib package |
| `@workspace/api-zod` | 3 | lib package |
| `@workspace/atoms-l-surface` | 3 | lib package |
| `@workspace/briefing-diff` | 3 | lib package |
| `@workspace/briefing-engine` | 3 | lib package |
| `@workspace/briefing-pdf-tokens` | 3 | lib package |
| `@workspace/briefing-prior-snapshot` | 3 | lib package |
| `@workspace/calibration-engines` | 3 | lib package |
| `@workspace/codes` | 3 | lib package |
| `@workspace/codes-sources` | 3 | lib package |
| `@workspace/comment-letter` | 3 | lib package |
| `@workspace/coverage` | 3 | lib package |
| `@workspace/engine-core` | 3 | lib package |
| `@workspace/eval` | 3 | lib package |
| `@workspace/finding-engine` | 3 | lib package |
| `@workspace/integrations-anthropic-ai` | 3 | lib package |
| `@workspace/integrations-xai-grok` | 3 | lib package |
| `@workspace/knowledge-atoms` | 3 | lib package |
| `@workspace/mnml-client` | 3 | lib package |
| `@workspace/object-storage-web` | 3 | lib package |
| `@workspace/plan-review-pdf` | 3 | lib package |
| `@workspace/portal-ui` | 3 | lib package |
| `@workspace/server-actor-ids` | 3 | lib package |
| `@workspace/site-context` | 3 | lib package |
| `@workspace/submission-classifier` | 3 | lib package |
| `@workspace/scripts` | 3 | lib-adjacent, workspace member |
| `@workspace/codewarm` | DEATH LIST | `repo_intents.md:32` names codewarm as dying; zero external consumers confirmed |
| `@workspace/map-embed` | DEATH LIST | `repo_intents.md:32` names map-embed as dying; zero external consumers confirmed |
| `@workspace/cad-ingest` | UNCLASSIFIED | Not named in the 2026-07-04 canon; created after it |
| `@workspace/plan-review` (artifacts/plan-review) | UNCLASSIFIED | A separate SPA, distinct from both the root SPA and the console; built into the image |
| `@workspace/qa` (artifacts/qa) | UNCLASSIFIED | A separate SPA; built into the image |
| `@workspace/mockup-sandbox` (artifacts/mockup-sandbox) | UNCLASSIFIED | Dev-only sandbox, explicitly excluded from the image at `Dockerfile:64` |
| `artifacts/hydrology-worker` | UNCLASSIFIED | Python sidecar, no package.json, installed into the runtime image at `Dockerfile:149-153` |
| `artifacts/tile-pipeline` | UNCLASSIFIED | Python terrain-RGB bake CLI, no package.json |

Bucket counts: clock 1 = 1; clock 2 = 6; clock 3 = 30; death list = 2; unclassified = 6. Total 45 units (43 with package.json plus 2 Python sidecars).

The unclassified bucket is the significant one. The canon's three-clock model assumed one dead SPA and one console. In fact the image builds and serves **four** SPAs (`Dockerfile:66-70`): design-tools, plan-review, qa, and codex-reviewer-qa. Two of those four (plan-review, qa) are named by neither clock 1 nor clock 2 and have no declared retirement path. `cad-ingest` is likewise unclassified and is now the most active ingest package in the repo.

Verbatim workspace glob, `pnpm-workspace.yaml:1-6`:

```
packages:
  - packages/*
  - artifacts/*
  - lib/*
  - lib/integrations/*
  - scripts
```

## 2. Where recent work has landed

387 commits on `origin/main` in the last 60 days (`git log --since="60 days ago" --oneline origin/main | wc -l` returned `387`).

File touches bucketed by package over the same window, verbatim from `git log --since="60 days ago" --name-only --format="" origin/main`:

```
    902 artifacts/api-server
    163 lib/db
    148 packages/cortex-tiles
    145 lib/adapters
    134 artifacts/codex-reviewer-qa
    133 lib/cad-ingest
     66 lib/codes
     57 packages/tile-shell
     48 lib/calibration-engines
     42 scripts
     35 lib/engine-core
     33 lib/api-zod
     30 packages/cortex-client
     30 lib/codewarm
     24 artifacts/design-tools
```

### Clock 1 — clean since the decision

The 24 touches in `artifacts/design-tools` all predate the 2026-07-04 decomposition decision. The most recent is `a94aa55a` (2026-07-01), a Docker SPA build crypto stub. Filtering to the post-decision window returns nothing:

```
$ git log --since="2026-07-04" --format="%h|%ci|%s" origin/main -- artifacts/design-tools
(no output)
```

Clock 1's zero-new-work freeze is being honored. This is the one clean result in the survey.

### Clock 2 — 23 commits after the freeze. Governance finding.

The console and its component packages were supposed to be extracting in Phase 3, not receiving feature work. They received 23 commits after 2026-07-04, the most recent on 2026-07-18. These are not extraction-prep commits; they are feature development:

```
1ba8ba16|2026-07-18|feat(cortex-tiles): preserve parcel_node_id through to the map feature + selection (#290)
28bd573b|2026-07-18|feat(brokerage): buildable-envelope derivation (parcel inset by setbacks) + render layer (#287)
6d039311|2026-07-17|feat(cortex-tiles): promote BimModelViewport into a published GLB/BIM viewer tile (#284)
698b3d21|2026-07-16|feat(cortex-client): parcel-terrain-model tile capability (#278)
cf4c3880|2026-07-16|feat(cortex-tiles): federal GIS layers + zoning paint + LOD honest-empty (#271)
b278a5fc|2026-07-16|feat(cortex-tiles): push SSURGO foundation-risk soils overlay from SubsurfaceTile (#275)
d26b507c|2026-07-16|feat(cortex-tiles): brokerage address-keyed site-context + headless entry (0.1.7) (#269)
5e61aaac|2026-07-16|feat(cortex-tiles): RAW-FUNCTION mode as pure callable functions (0.1.6) (#268)
7a9e1f6e|2026-07-16|feat(cortex-tiles): promote the LIVE map tile into the shared library (#263)
c5cfae41|2026-07-15|feat(command-center): consume workspace deep-links (?share=/?space=) (#260)
```

`cortex-tiles` went from 0.1.1 to 0.1.12 across this window and is published on npm at 0.1.12 (verified `npm view @empressaio/cortex-tiles version`). The extraction to a dedicated repo has not started; instead the packages deepened their coupling to ldt's BFF. Mitigating read: much of this is component-library work that the canon does want to survive, and the `@hauska` to `@empressaio` rename landed (`c685ead6`, 2026-07-06). But it landed **inside** ldt rather than in an extracted repo, which is the opposite of what clock 2 specifies.

### Clock 3 — the bulk, and it is growing

`artifacts/api-server` took 902 file touches, more than five times any other package. `lib/db` took 163. The api-server now carries 94 route files (`ls artifacts/api-server/src/routes/*.ts | wc -l` returned `94`).

Specifically checked items, all clock 3:

**Migrations 0068 through 0072.** All five are in `lib/db/drizzle/`, all landed on 2026-08-08 (today), across three commits:

```
lib/db/drizzle/0068_county_manifest_and_rail_dimension.sql
  commit b9807f7e 2026-08-08 13:23:25 -0500 feat(county-manifest): Sprint 1 thin slice — 254x13 honest manifest grid (#391)
  CREATE TABLE IF NOT EXISTS county_manifest
  CREATE TABLE IF NOT EXISTS county_rail

lib/db/drizzle/0069_county_facet_coverage_rail_state.sql
  commit b9807f7e 2026-08-08 13:23:25 -0500

lib/db/drizzle/0070_tx_city_and_county_boundary.sql
  commit 85f3c370 2026-08-08 13:41:34 -0500 feat(boundary): L1 statewide city and county boundary layer (#392)
  CREATE TABLE IF NOT EXISTS "tx_city_boundary"
  CREATE TABLE IF NOT EXISTS "tx_county_boundary"

lib/db/drizzle/0071_rail_state_history_and_verification.sql
  commit fe4fe58b 2026-08-08 14:25:49 -0500 feat(manifest): observability tables for history, verification, runs, and cost
  CREATE TABLE IF NOT EXISTS rail_state_history
  CREATE TABLE IF NOT EXISTS rail_verification

lib/db/drizzle/0072_manifest_run_state_slot_and_cost.sql
  commit fe4fe58b 2026-08-08 14:25:49 -0500
  CREATE TABLE IF NOT EXISTS manifest_run
  CREATE TABLE IF NOT EXISTS manifest_slot_reservation
  CREATE TABLE IF NOT EXISTS manifest_slot_queue
  CREATE TABLE IF NOT EXISTS manifest_jurisdiction_cost
```

Note the HEAD commit body states "Migrations are file-only; not applied to Neon" — consistent with the standing merged-is-not-applied hazard. 0071 and 0072 are not on the live database.

**The county-ledger route.** Clock 3. `artifacts/api-server/src/routes/countyLedger.ts`, mounted at `artifacts/api-server/src/routes/index.ts:107-108`:

```
// Reachable at /api/county-ledger (mounted under the /api router).
router.use("/county-ledger", countyLedgerRouter);
```

**The boundary layer.** Clock 3, split across two packages: schema in `lib/db` (migration 0070) and the ingest CLI in `lib/cad-ingest/src/boundary/` (`cli.ts`, `containment.ts`, `ingest.ts`, `parse.ts`, `service.ts`).

**cad-ingest.** UNCLASSIFIED, 133 touches, and it is the workhorse of the factory. It exposes seven CLIs (`lib/cad-ingest/package.json:11-22`): `cad-ingest`, `txgio-ingest`, `stratmap-landuse`, `zoning-stamp`, `permits-ingest`, `address-ingest`, `boundary-ingest`. Twenty-one files reference it, mostly in api-server. By function this is spine acquisition code — exactly the class of thing clock 3 says the spine should absorb — but it was created in ldt after the decomposition decision and has never been assigned a clock.

**Death-list package still receiving work.** `lib/codewarm` took 30 file touches in the window, though all before the decision (latest `24158735`, 2026-06-18). Post-decision it is quiet.

Governance summary: clock 1 is honored; clock 2 is violated by 23 post-decision commits including nine feature commits; clock 3 absorbed nothing and instead grew by seven tables today.

## 3. What is actually deployed and serving

GCP project is `legacy-design-tools-prod` (not `hauska-prod-497015`; that project holds the spine services). Verbatim:

```
$ gcloud run services list --project legacy-design-tools-prod
NAME: api-server
URL: https://api-server-tds7av26va-uc.a.run.app
LATEST_READY_REVISION_NAME: api-server-00003-wix

NAME: cortex-api
URL: https://cortex-api-tds7av26va-uc.a.run.app
LATEST_READY_REVISION_NAME: cortex-api-00488-qif
```

cortex-api traffic split, verbatim:

```
{'revisionName': 'cortex-api-00472-web', 'tag': 'smoke4', ...};
{'revisionName': 'cortex-api-00481-xik', 'tag': 'pooling-fix', ...};
{'percent': 100, 'revisionName': 'cortex-api-00488-qif', 'tag': 'canary', ...}
```

Revision `cortex-api-00488-qif` serves 100 percent, matching the brief. Live probes:

```
health:200
county-ledger:200
```

**The critical deployment finding: the clock-1 dead SPA is live in production.** `Dockerfile:66-70` builds four SPAs into the image:

```
RUN pnpm --filter @workspace/design-tools \
         --filter @workspace/plan-review \
         --filter @workspace/qa \
         --filter @workspace/codex-reviewer-qa \
         run build
```

All four answer on the live service:

```
/ -> 200
/plan-review/ -> 200
/qa/ -> 200
/codex-reviewer-qa/ -> 200
```

And the root path serves the design-tools SPA itself:

```
$ curl -s https://cortex-api-tds7av26va-uc.a.run.app/
<!DOCTYPE html>
<html lang="en" data-theme="dark" class="dark">
  <head>
    ...
    <title>Cortex — Design Accelerator</title>
```

"Declared legacy, zero new work" is being honored at the commit level but the artifact is still built, shipped, and served on every deploy. Freezing the code did not remove the surface.

The second Cloud Run service, `api-server`, is a stale orphan: revision `api-server-00003-wix`, last transition `2026-05-06T23:54:42Z`, three revisions total, carrying 100 percent of its own traffic. It has not been deployed in three months and is superseded by cortex-api. It is a deployed surface nobody appears to reference.

Deploy topology from `.github/workflows/`: four workflows exist (`cloud-run-deploy.yml`, `eval.yml`, `pr-checks.yml`, `publish-packages.yml`). Only `cloud-run-deploy.yml` deploys, and it deploys exactly one service (`cloud-run-deploy.yml:76-77`: `IMAGE_NAME: cortex-api`, `CLOUD_RUN_SERVICE: cortex-api`). `publish-packages.yml` publishes the five `@empressaio` component packages to npm. There is no `vercel.json` anywhere in the repo, so nothing here deploys to Vercel; the Command Center that consumes `/api/county-ledger` lives in a different repo and deploys separately.

Two Dockerfiles: the root one (cortex-api) and `artifacts/hydrology-worker/Dockerfile`. The hydrology worker is not a separate service; its Python requirements are installed into the cortex-api runtime image at `Dockerfile:149-153`.

Deployed and serving surfaces, complete list:
1. `cortex-api` on Cloud Run — the api-server plus four static SPAs plus a Python hydrology sidecar. Depended on by: the Command Center manifest panel (`/api/county-ledger`), Property Explorer, the Brief extension, and the brokerage/Radar BFF consumers.
2. `api-server` on Cloud Run — stale since 2026-05-06, no evident consumer.
3. Five npm packages: `@empressaio/cortex-client@0.1.3`, `cortex-tiles@0.1.12`, `design-tokens@0.1.0`, `document-viewer@0.1.0`, `tile-shell@0.2.0`.

## 4. The atom-contract pin split

Full grep of every `package.json` outside `node_modules`, verbatim (worktree copies under `.claude/worktrees/` excluded from the analysis as scratch):

```
./artifacts/api-server/package.json:19:    "@hauska/atom-contract": "file:../../vendor/hauska-atom-contract-1.6.0.tgz",
./lib/engine-core/package.json:15:    "@hauska/atom-contract": "file:../../vendor/hauska-atom-contract-1.6.0.tgz",
./lib/knowledge-atoms/package.json:15:    "@hauska/atom-contract": "file:../../vendor/hauska-atom-contract-1.6.0.tgz",
./lib/portal-ui/package.json:19:    "@hauska/atom-contract": "file:../../vendor/hauska-atom-contract-1.6.0.tgz",
./lib/submission-classifier/package.json:15:    "@hauska/atom-contract": "^1.1.0",
./scripts/package.json:32:    "@hauska/atom-contract": "^1.1.0",
```

This matches the brief exactly. Registry state, verbatim:

```
$ npm view @hauska/atom-contract versions
  ... "1.3.0", "1.4.0", "1.5.0", "1.6.1" ]
$ npm view @hauska/atom-contract dist-tags
{ "latest": "1.6.1" }

$ npm view @empressaio/atom-contract versions
[ "1.7.0", "1.8.0", "1.9.0", "1.10.0", "1.11.0", "1.12.0" ]
$ npm view @empressaio/atom-contract version
1.12.0
```

The two package names form a clean, non-overlapping version sequence: `@hauska` ends at 1.6.1, `@empressaio` begins at 1.7.0. The rename was a continuation, not a fork. The vendored tarball at 1.6.0 is one patch behind the last published `@hauska` release.

Confirmed: the vendored 1.6.0 tarball has no property-family export. Unpacked exports map from `vendor/hauska-atom-contract-1.6.0.tgz`:

```
version: 1.6.0
exports:
.
./testing
./encumbrances
./workspace
./read-contract
./conformance
./export
./temporal
./package.json
```

No `./property`. The property atom family, which starts at 1.8.0, is unreachable from every one of the six packages.

### Per-package breakdown

**artifacts/api-server — clock 3.** By far the heaviest consumer: 45 imports from the root entry, 9 from `/read-contract`, 8 from `/testing`, 1 from `/encumbrances`. Symbols imported, enumerated:

Root entry — `resolveComposition`, `unwrapFromStorage`, `createAtomRegistry`, `PostgresEventAnchoringService`, and the types `AnyAtomRegistration`, `AtomComposition`, `AtomReference`, `AtomRegistration`, `AtomRegistry`, `CompositionRegistryView`, `ContextSummary`, `EventAnchoringService`, `KeyMetric`, `Scope`.

`/read-contract` — `READ_CONTRACT_SCHEMA`, `createWidthedConfidence`, and the types `ReadContract`, `WidthedConfidence`.

`/encumbrances` — `RECORDED_INSTRUMENT_SCHEMA`, `RESTRICTION_CLAUSE_SCHEMA`, and the types `RecordedInstrumentAtomInstance`, `RestrictionClauseAtomInstance`.

Consuming files include 24 atom definitions under `src/atoms/` (bim-model, brief-run, briefing-divergence, briefing-source, communication-event, decision-event, engagement, finding, intent, materializable-element, neighboring-context, parcel-briefing, property-workspace, registry, render-output, reviewer-annotation, reviewer-request, sheet, site-drainage, site-topography, snapshot, submission-classification, submission, viewpoint-render) plus `src/lib/` files including `atomFamilyConformance.ts`, `encumbranceWire.ts`, `readContractWire.ts`, `brokerageSiteContext.ts`, `brokerageGisCompositeLayers.ts`, `brokerageBriefEvents.ts`, `engagementEvents.ts`, `ifcIngest.ts`, `rawConflictLogEmit.ts`, `siteDrainageIngest.ts`, `siteDrainageMaterializer.ts`, `siteTopographyIngest.ts`, `siteTopographyMaterializer.ts`.

Migration difficulty: this is the hard one. It is not merely a rename across 63 import sites. It uses the runtime `PostgresEventAnchoringService` and `createAtomRegistry`, both of which touch persistence, and it imports two schema constants from `/encumbrances`. Whether any of these changed shape between 1.6.0 and 1.12.0 cannot be determined from ldt alone; the contract repo's changelog for 1.7.0 through 1.12.0 is the authority and I did not read it.

**lib/portal-ui — clock 3** (lib package; note it is also consumed by clock-1 and clock-2 SPAs, 82 references repo-wide). Two imports, both from `/read-contract`:
- `lib/portal-ui/src/components/EngineHonestyChrome.tsx` — `type ReadContract as AtomReadContract`
- `lib/portal-ui/src/components/__tests__/ReadContractChrome.test.tsx` — `SAMPLE_READ_CONTRACT`

Migration difficulty: near-mechanical. One production type import and one test fixture constant. The only risk is whether `SAMPLE_READ_CONTRACT` still exists and has the same shape at 1.12.0.

**lib/knowledge-atoms — clock 3.** A single import:
- `lib/knowledge-atoms/src/sourceRegistry.ts` — `type AccessPolicy`

Migration difficulty: mechanical, with one caveat that matters. `AccessPolicy` is the five-value union per the CLAUDE.md ground-truth reconciliation, and the fifth value (`tenant-shared`) was added in 1.2.0, so 1.6.0 already carries all five. Widening is not a risk here. This is the cleanest of the six.

**lib/engine-core — clock 3.** Thirteen imports: 1 from the root, 2 from `/conformance`, 10 from `/read-contract`. Symbols:

Root — `type AtomEvent`.

`/conformance` — `ATOM_CONFORMANCE_TARGET_VERSION`, `validateAtomConformance`, `ACCESS_POLICY_VALUES`, `buildValidSignedEventChain`, `verifyEventChain`, and the types `AtomConformanceTarget`, `AtomTier`, `VerifyChainResult`.

`/read-contract` — `createReadContract`, `createThreeAxisConfidence`, `createWidthedConfidence`, `createConsequenceAxis`, and the types `ReadContract`, `WidthedConfidence`, `ConsequenceAxis`, `ModelAttributionStamp`, `LegacyEngineEnvelopeConfidence`.

Consuming files: `atomConformance.ts`, `consequenceGatedRouting.ts`, `encumbranceReadContract.ts`, `findingReadContract.ts`, `rawLedger.ts`, `readContractDerive.ts`, `__tests__/atomConformance.test.ts`.

Migration difficulty: not mechanical. `ATOM_CONFORMANCE_TARGET_VERSION` is a version-pinned constant, so bumping the contract almost certainly changes the value the conformance validator asserts against, and `validateAtomConformance` may reject atoms that passed under the 1.6 target. `LegacyEngineEnvelopeConfidence` is by its name a compatibility shim and is a candidate for removal in a later major. This package is where a migration would actually break.

**scripts — clock 3.** Pinned `^1.1.0`, not vendored. Three imports, all identical:
- `scripts/src/backfillSheetCreatedEvents.ts` — `PostgresEventAnchoringService`, `type EventAnchoringService`
- `scripts/src/backfillTrack1Classifications.ts` — same two
- `scripts/src/__tests__/backfillTrack1Classifications.test.ts` — same two

Migration difficulty: mechanical in symbol terms (two symbols), but `^1.1.0` against a registry whose latest is 1.6.1 means this package resolves to 1.6.1 while the vendored packages resolve to 1.6.0. Two different contract builds coexist in one pnpm workspace today.

**lib/submission-classifier — clock 3.** Pinned `^1.1.0`. Two imports:
- `lib/submission-classifier/src/upsert.ts` — `type EventAnchoringService`
- `lib/submission-classifier/src/__tests__/upsert.test.ts` — `PostgresEventAnchoringService`, `type EventAnchoringService`

Migration difficulty: mechanical. Same two symbols as scripts.

All six are clock 3. No clock-1 or clock-2 package consumes the atom contract directly, which is a genuinely good structural result: the contract dependency is confined to the running-in-place layer.

### Why the tarball was vendored

This is the question the brief flagged as critical, and the answer is that **nobody deliberately froze anything**. The vendoring was a CI expedient for an unpublished package, and it fossilized.

The vendor directory was created by commit `0ecb8abb` (2026-05-26). Verbatim from its commit body:

```
feat(cortex): encumbrances Phase 1 upload and briefing merge (#129)

* feat(cortex): encumbrances Phase 1 upload and briefing merge

Add recorded-instrument upload, clause extraction, verify flow, and
privateRestrictions on engagement briefings. Depends on atom-contract
1.2.0 (file: sibling); CI checks out hauska-atom-contract until npm publish.

* ci: clone hauska-atom-contract for file: api-server dep

* fix(deps): vendor @hauska/atom-contract@1.2.0 tarball for CI

Ship hauska-atom-contract-1.2.0.tgz under vendor/ so pnpm frozen-lockfile
install works without npm publish. Revert temporary CI clone steps.
```

The stated reason is explicit: "so pnpm frozen-lockfile install works **without npm publish**." At the time, atom-contract 1.2.0 was committed but not on the registry. The first attempt was a CI clone step; that was reverted in favor of a checked-in tarball. This was a workaround for a publishing gap, not a decision to pin.

The pattern then repeated twice as the contract advanced, each time for the same reason and each time incidentally, buried inside an unrelated feature PR:

- `51ea1229` (2026-07-01, PR #201) vendored 1.5.0. Body: "Rebase onto main required bumping api-server and portal-ui to atom-contract 1.5.0 alongside engine-core, plus widthed-confidence wire helpers for restriction-clause atoms."
- `939e9e21` (2026-07-01, PR #202) vendored 1.6.0. Body: "fix(ci): restore xai-grok dep, encumbrance widthed adapters, knowledge_atoms fixture ... WidthedConfidence wire helpers for atom-contract 1.6."

Four tarballs are still checked in, three of them dead weight:

```
hauska-atom-contract-1.2.0.tgz  (May 26)
hauska-atom-contract-1.4.0.tgz  (Jun 21)
hauska-atom-contract-1.5.0.tgz  (Jul  1)
hauska-atom-contract-1.6.0.tgz  (Jul  1)   <-- the only one referenced
```

I found no decision record, ADR, or source comment justifying the vendoring as a deliberate freeze. The original CI constraint that motivated it — an unpublished contract — no longer holds: `@hauska/atom-contract` reached 1.6.1 on the registry and `@empressaio/atom-contract` is at 1.12.0. The tarball outlived the reason for its existence. That said, "no recorded reason" is a weaker claim than "no reason existed"; see the closing section.

## 5. The absorption ledger

Clock 3's retirement mechanism is "shrink by absorption (spine takes adapters, tenancy lands, Radar BFF extracts), retire only when empty." Progress against each named absorption:

**Spine takes the adapters — NOT ABSORBED, and the surface widened.** `lib/adapters/src/` still holds both halves:

```
local/:    bastrop-tx.ts  cad.ts  grand-county-ut.ts  lemhi-county-id.ts  permits.ts  setbacks/  summaries.ts
national/: cotality.ts  cotalityClient.ts  cotalityExtended.ts  cotalityInvestorDepth.ts  regrid.ts
```

`lib/adapters` took 145 file touches in the last 60 days and has 73 repo-wide references. Nothing moved to hauska-engine. Worse for the absorption thesis, an entirely new acquisition package (`lib/cad-ingest`, 133 touches, seven CLIs) was **created in ldt** during this window rather than in the spine. By the intent's own logic, cad-ingest is spine acquisition code that landed on the wrong side of the line. The adapter surface in ldt is larger today than it was at the decomposition decision.

**Tenancy lands — DID NOT LAND.** There is no tenants table and no tenancy migration. `ls lib/db/drizzle/ | grep -i tenant` returns nothing across all 73 migrations. What exists is placeholder columns with default values. Verbatim from `lib/db/src/schema/cannedFindings.ts:22-24` and `:38-40`:

```
 * yet have a `tenants` table, so the library is keyed by an opaque
 * tenant id (defaulting to `DEFAULT_TENANT_ID` below). When a real
 * tenants table lands the column flips to a uuid FK without a wire

 * Default tenant id used by the FE today. The route accepts any
 * tenant id string; this constant is the placeholder until a real
 * tenants table + session-bound tenant resolution lands.
```

Other tables carry the same shape: `lib/db/src/schema/brokerageBriefRuns.ts:10` and `lib/db/src/schema/brokerageUserProfiles.ts:16` both declare `tenantSlug: text("tenant_slug").notNull().default("default")`. This is a seam, not tenancy. It matches CLAUDE.md's own statement that Cortex does not enforce isolation today. Since the Radar BFF extraction is gated on tenancy, and tenancy has not landed, the third absorption is blocked by the second.

Partial credit: `lib/db/src/schema/atomCalibrationOverlay.ts:22-23` and `:69` do enforce a partition-kind check constraint including `tenant-private` and `tenant-shared`, so the accessPolicy vocabulary is present in the schema even though session-bound resolution is not.

**Radar BFF extracts — DID NOT EXTRACT.** All sixteen brokerage route files remain in `artifacts/api-server/src/routes/`:

```
brokerageAdminGraph.ts        brokerageMapData.ts
brokerageBilling.ts           brokerageNodeFacets.ts
brokerageBillingPublic.ts     brokeragePlace.ts
brokerageBrief.ts             brokeragePlaceBuildableEnvelope.ts
brokerageCoverage.ts          brokeragePlaceHydrology.ts
brokerageEncumbrances.ts      brokerageProfile.ts
brokerageEntitlementRoute.ts  brokerageWalletRoute.ts
brokerageGtm.ts               brokerageWorkspace.ts
```

Several of these (`brokerageNodeFacets.ts`, `brokeragePlaceBuildableEnvelope.ts`) were created or heavily modified during the survey window, so the BFF also grew rather than shrank. The `radar` repo remains the 4-file placeholder that `repo_intents.md:34` describes.

Absorption scorecard: zero of three named absorptions complete. Clock 3's retirement mechanism has not started.

## 6. The death list

`repo_intents.md:32` names five things that should die. Four of the five are still present.

**map-embed — STILL EXISTS, zero consumers, confirmed dead weight.** `lib/map-embed/src/` contains `contract.ts`, `embeddedHost.ts`, `index.ts`, `layerAllocation.ts`, and `__tests__/`. A repo-wide search for `@workspace/map-embed` returns exactly one hit, its own `package.json`. It received one file touch in the window (`4e9f1960`, 2026-06-21, a broad sweep commit) and nothing since. The canon's "zero consumers" read is verified correct.

**codewarm — STILL EXISTS, zero external consumers, confirmed dead weight.** A repo-wide search for `@workspace/codewarm` returns three hits, all internal to the package itself: `lib/codewarm/package.json`, `lib/codewarm/src/cli.ts`, and `lib/codewarm/dist/cli.d.ts`. It took 30 file touches in the window but nothing since 2026-06-18, before the decomposition decision. It also ships a committed `dist/` directory.

**Legacy $5-wallet top-up route — STILL EXISTS AND IS MOUNTED.** Two files:
- `artifacts/api-server/src/lib/brokerageWallet.ts:2` — `Brokerage wallet — $5 top-up increments, compute debit, auto-refill.`
- `artifacts/api-server/src/lib/brokerageWallet.ts:38` — `export const BROKERAGE_TOP_UP_INCREMENT_CENTS = 500;`
- `artifacts/api-server/src/routes/brokerageWalletRoute.ts:2` — `Brokerage wallet — balance, $5 top-up, auto-refill settings.`
- `artifacts/api-server/src/routes/brokerageWalletRoute.ts:48` — `brokerageWalletRouter.post("/top-up", async (req: Request, res: Response) => {`

The route is a live POST handler in a deployed service.

**Regrid remnants including the false runtime message — STILL EXISTS.** The specific line the canon calls out is unchanged, though the file moved from api-server into `lib/adapters`. Verbatim, `lib/adapters/src/national/cotalityClient.ts:179`:

```
      `${CRED_ENV[app].label} is not configured on this deployment. Regrid remains the active national parcel/zoning provider.`,
```

This is thrown by `requireCotalityAppCredentials` (`cotalityClient.ts:170-180`) as an `AdapterRunError`. It is a user-facing runtime message asserting that Regrid is the active provider, which is false — Regrid was purged 2026-06-17 and Cotality is itself extinguished per standing decision. The message is wrong twice over.

The broader Regrid surface also survives. `lib/adapters/src/national/regrid.ts` is a full adapter (1127-line sibling `cotalityClient.ts`; regrid.ts hits `https://app.regrid.com/api/v2/parcels/point` at line 68) and is still exported from the package manifest at `lib/adapters/package.json:22`:

```
    "./national/regrid": "./src/national/regrid.ts",
```

Other live references: `artifacts/api-server/src/lib/providerCatalog.ts:109-113` registers a `Regrid (dormant)` provider with prefix `regrid:`; `artifacts/api-server/src/lib/placeDossier.ts:163` still stamps `source: "regrid"` on parcel entity refs; `artifacts/api-server/src/lib/placeLayerSnapshots.ts:89` branches on `adapterKey.startsWith("regrid:")`; `artifacts/api-server/src/atoms/property-workspace.atom.ts:44-46` declares `childEntityType: "place-layer-regrid"` and `dataKey: "placeLayersRegrid"`. That last one is an atom shape, so the dead provider's name is baked into persisted atom structure.

Two honest counterweights: `artifacts/api-server/src/lib/brokerageGisLayers.ts:688` carries the comment `// "invalid client identifier" OAuth). Do not reintroduce Cotality/Regrid.`, and `artifacts/api-server/src/lib/brokerageSiteContext.ts:9` records `Regrid was purged 2026-06-17 — Cotality is the sole national parcel spine.` (itself now stale, since Cotality is extinguished). Commit `475c01b1` (2026-07-27) did decommission the Cotality fall-through on the buildable-envelope path. So the runtime hot paths were cut; the code, the exports, the atom shape, and the false message were not.

**mock-LLM default in briefing-engine — FIXED. The one death-list item genuinely resolved.** The default no longer silently falls back to mock; it fails loud. Verbatim from `lib/briefing-engine/src/engine.ts:11-12` and `:79-90`:

```
 * falling back to mock (silent-mock-in-prod footgun). Dev / CI must
 * opt in explicitly with `BRIEFING_LLM_MODE=mock`.

 * Fails loud when `BRIEFING_LLM_MODE` is unset or unrecognized — mock
 * mode must be requested explicitly (`BRIEFING_LLM_MODE=mock`). This
        '"grok", "anthropic", or "mock" (mock is never an implicit ' +
        "default — silent mock output in production is the failure " +
```

Death list score: one of five resolved, four still present, one of those four (the wallet route) still mounted in production.

## 7. The honest verdict

**No. legacy-design-tools is not out of the picture, and the gap between the operator's impression and reality is large.**

The impression is understandable, because something real did happen: the spine was built, and it is genuinely separate. `hauska-engine-api`, `hauska-mcp-server`, and `hauska-retrieval-api` all run in their own GCP project (`hauska-prod-497015`) with their own repos. The atom contract was extracted, renamed, and is publishing independently at 1.12.0. That extraction was real and it worked.

What did not happen is the second half: ldt was supposed to shrink as the spine grew. It did not. It grew alongside.

A rough load-bearing split by evidence:

*Dead weight, roughly 10 percent of the repo.* Two zero-consumer packages (`map-embed`, `codewarm`); three unreferenced vendored tarballs (1.2.0, 1.4.0, 1.5.0); the stale `api-server` Cloud Run service untouched since 2026-05-06; the `mockup-sandbox` SPA explicitly excluded from the image; the Regrid adapter and its export; the $5 wallet route. This is removable with essentially no capture work — it is not serving anything.

*Frozen but still shipping, roughly 5 percent.* The clock-1 `design-tools` SPA. Zero commits since the decision, correctly frozen at the source level, but still built by `Dockerfile:66` and still answering HTTP 200 at the production root. Removing it requires the function inventory the canon already specifies, and the SPA imports `@workspace/portal-ui` and `@workspace/api-client-react` which are load-bearing elsewhere, so the removal is a Dockerfile-and-route change plus an inventory, not a package deletion.

*Load-bearing and actively growing, roughly 85 percent.* `artifacts/api-server` alone is 902 file touches in 60 days, 94 route files, and the sole deployed service. Add `lib/db` (73 migrations, seven new tables today), `lib/adapters`, `lib/cad-ingest`, `lib/codes`, `lib/engine-core`, and the five published component packages. This is not a repo winding down. Three commits today added `county_manifest`, `county_rail`, `tx_city_boundary`, `tx_county_boundary`, `rail_state_history`, `rail_verification`, `manifest_run`, `manifest_slot_reservation`, `manifest_slot_queue`, and `manifest_jurisdiction_cost`. The county-manifest factory — the OPS-6 factory floor, the thing the Command Center reads — was built here, this week.

The sharpest way to state it: **the spine got the contract, and ldt got the factory.** The atom contract left cleanly. The jurisdiction acquisition machinery — CAD ingest, TxGIO parcel and address stores, zoning stamping, boundary ingest, the county manifest and rail state model — was built in ldt after the decomposition decision, in a repo whose declared direction is retirement. That is the structural finding, and it is more consequential than the atom-contract pin split that prompted this survey.

What would have to move for ldt to actually retire, in dependency order as the canon's own three clocks imply:

1. Tenancy must land (there is no tenants table across 73 migrations), because it gates the Radar BFF extraction, which is sixteen route files.
2. The adapters plus cad-ingest must move to hauska-engine — this is the largest single body of work and the intent already names it, but cad-ingest is unclassified and was never in the plan.
3. The console and the five component packages must extract to their own repo, which Phase 3 specifies and which has not started; instead they received 23 post-decision commits.
4. The county-manifest factory needs a declared home. It is the newest and most active subsystem in the repo, it is unclassified against all three clocks, and nothing in the canon anticipates it.
5. Then the four SPAs come out of the Dockerfile and the image stops serving them.

Until at least items 1, 2, and 4 land, cortex-api is the everything-service the canon described on 2026-07-04, and the decomposition is roughly where it was that day — with the notable exception that clock 1 has held its freeze.

One governance observation offered without recommendation: the canon has not been updated since 2026-07-04, and three of the most active packages in the repo (`cad-ingest`, `plan-review`, `qa`) plus the entire county-manifest subsystem have no clock assignment. The three-clock model is not wrong, but it no longer covers the repo it governs.

## WHAT I COULD NOT DETERMINE

**Whether the atom-contract migration from 1.6.0 to 1.12.0 is mechanical.** I enumerated every imported symbol from ldt's side, but I did not read the `@empressaio/atom-contract` source or changelog for versions 1.7.0 through 1.12.0. Whether `createAtomRegistry`, `PostgresEventAnchoringService`, `RECORDED_INSTRUMENT_SCHEMA`, `RESTRICTION_CLAUSE_SCHEMA`, `SAMPLE_READ_CONTRACT`, or `LegacyEngineEnvelopeConfidence` still exist with the same shapes is unverified. `ATOM_CONFORMANCE_TARGET_VERSION` in `lib/engine-core/src/atomConformance.ts` is a version-pinned constant and is the most likely breakage point, but I did not confirm what it evaluates to at either version.

**Whether a deliberate reason to freeze the contract exists outside the commit record.** I searched commit messages, commit bodies, source comments, and the doc_repo decision records, and found only the CI-workaround rationale from `0ecb8abb`. Absence of a recorded reason is not proof no reason exists. If a conversation or an unrecorded operator call froze the contract deliberately, this survey would not see it. The brief's caution stands.

**Whether migrations 0068-0070 are applied to the live Neon database.** The HEAD commit body states 0071 and 0072 are file-only, but I ran no SELECT against the deployment database to establish the applied state of 0068, 0069, or 0070. `/api/county-ledger` returning HTTP 200 indicates the ledger tables exist but says nothing about the manifest or boundary tables.

**Whether the stale `api-server` Cloud Run service has any consumer.** It has served the same revision since 2026-05-06. I found no reference to its URL in doc_repo or in the ldt source, but I did not check external configuration, DNS, or other repos' environment variables.

**Whether the `@empressaio` component packages have external consumers.** They are published to npm at real versions, but I did not query download statistics or search other repos for their import. Whether extracting them would break AEC-cortex, the Command Center, or hauska-map is unestablished.

**Whether the Command Center is the only consumer of `/api/county-ledger`.** doc_repo names it as the consumer (`90_operations/PHASE_C_HANDOFF_bastrop_warm.md:23`), but I did not enumerate all callers of the cortex-api base URL across the portfolio.

**Post-2026-07-18 clock-2 state.** The last clock-2 commit is 2026-07-18. Whether that reflects a deliberate stop after the governance boundary was noticed, or simply that attention moved to the factory work, cannot be determined from the commit record.
