---
id: 2026-08-24_govtech_engine_migration_plan
title: Finding engine migration plan (S2-1)
status: active
last_updated: 2026-08-24
applies_to: portfolio
owner: nick
related:
  - _inbox/2026-08-24_govtech_program_scope.md
  - _inbox/2026-08-24_govtech_transaction_contract.md
  - 80_adrs/adr_023_cortex_reporting_repo_designation
  - 80_adrs/adr_008_engine_factor_out
---
# SNAPSHOT

Read-only analysis. No writes to any product repo, no git mutation, no deploy. Every claim below traces to a file read at these commits.

| Repo | Role | Branch | Commit |
|---|---|---|---|
| `P:\tmp\scope_20260824\hauska-engine` | SOURCE (property seat) | main | `60adb1fcb2c5bea3d0e2defb678d2ef426d256a2` |
| `P:\tmp\scope_20260824\plan-review` | DESTINATION (govtech seat) | main | `2b5a713a333e5751425fca6a580cdf34f50855fe` |
| `P:\tmp\scope_20260824\legacy-design-tools` | homes A + B + eval harness | main | `1fd6233d5bff49e962c411013af12d24f8f46e53` |
| `P:\doc_repo` | canon | main | working tree, read-only |

Instruments: `find`, `wc -l`, `grep`, `diff -u --strip-trailing-cr`, `git rev-parse`, `cat`, `sed`. No build, no server, no LLM call.

The CRLF note matters and an executor will hit it. A naive `diff` between the engine and the ldt duplicate reports every line changed, because the two checkouts differ in line endings. Every drift number below was produced with `--strip-trailing-cr`, counting only `^[+-][^+-]` lines. The un-stripped run is the convenient-looking wrong answer.

## Four things established here that change the plan

These lead rather than sit under risks, because each one moves a step.

**1. The engine has exactly ONE consumer today, and it is not plan-review.** Callers of `routeGenerateFindings` / `routeGenerateOrchestratedFindings` are exactly one production file: `legacy-design-tools/artifacts/api-server/src/routes/findings.ts` (lines 1186, 1209, 1218); everything else matching is that function's own definition, a CI assertion, or a test mock. `plan-review` contains zero references to `findings/generate`, `generateFindings`, `engine-api`, or `hauska-engine` anywhere in `src/` or `web/`.

So the ruling does not move an engine to its consumer. It moves an engine away from its only consumer and into a service that has never called it. The network hop that exists today (ldt to engine-api) does not disappear. It is redirected (ldt to plan-review).

**2. Home A and home C are different products for different users.** Home A's routes are `/submissions/:id/findings*` and `/findings/:id/*`, and the router header states the audience: "Seven serve the architect's pre-submittal compliance review, the workflow the architect runs from the design-tools Findings tab." Home C is engagement-scoped city plan review for the `icc-demo` reviewer persona. Retiring A is therefore not a cleanup. It is discontinuing the architect surface, or making it a client of the city product. The retirement item is real and owed, but it cannot be "delete A".

**3. The ldt `lib/finding-engine` duplicate is NOT dead, and the drift is BIDIRECTIONAL.** Six live api-server files hold VALUE imports from `@workspace/finding-engine`: `attachedDocumentVision.ts` (`runDisciplineVisionRead`), `planSetClassification.ts` (`classifyPlanSetPieces`), `planReviewPrecedence.ts` and `rawConflictLogEmit.ts` (`precedenceReconciliationsFromCodeSections`, `isPrecedenceEngineProductionEnabled`), `findingLlmClient.ts` (`resolveFindingLlmMode`), `routes/findings.ts` (`resolveFindingOrchestratedMode`). Generation routes to the spine; vision read, plan-set classification and the precedence production wire still run IN PROCESS in ldt.

And neither copy is a superset. The duplicate holds two files the engine lacks (`precedence/productionWire.ts` 196 LOC, `precedence/productionGate.ts` 9 LOC); the engine holds one the duplicate lacks (`precedence/findingsPass.ts` 55 LOC).

**4. There is no golden findings ground truth anywhere, and the eval harness is worse than reported.** All three fixtures (`seguin`, `musgrave`, `arenaRojaR1`) carry `expectedFindings: []`; `arenaRojaR1` is a hard `placeholder` that makes the runner throw. The `expected*` entries that do exist are `expectedSectionNumber`, which scores RETRIEVAL, not findings.

Beyond the path filter watching `lib/finding-engine/**` (a directory in a DIFFERENT REPO from the one that runs reviews), the eval job's actual scoring step is COMMENTED OUT in `.github/workflows/eval.yml`. The live job runs `typecheck` plus rubric unit tests and nothing else. The harness is both dormant and starved. It cannot certify this migration and must not be cited as if it could.

# WHAT MOVES

## The engine proper

`hauska-engine/packages/engine-core/src/finding/`, 32 TypeScript files, 4,805 LOC: 3,176 implementation, 1,629 tests. Move it whole. Nothing in it is substrate.

| Group | Files (LOC) | Subtotal |
|---|---|---|
| Entry + contract | `engine.ts` 271, `types.ts` 303, `index.ts` 109 | 683 |
| Prompt | `prompt.ts` 217 | 217 |
| Generators | `anthropicGenerator.ts` 298, `grokGenerator.ts` 50, `mockGenerator.ts` 181 | 529 |
| Citation validation | `citationAdapter.ts` 39 | 39 |
| Vision (P2) | `visionSheetRead.ts` 183 | 183 |
| Plan-set orchestration | `planSet/`: `classifier` 242, `orchestrator` 175, `disciplineScope` 86, `types` 47, `dedupe` 39 | 589 |
| Precedence (ADR-019/021) | `precedence/`: `reconcile` 410, `comparability` 119, `types` 116, `accessibilityDemo` 99, `standardRegistry` 97, `findingsPass` 55, `index` 40 | 936 |
| Tests | `__tests__/` 11 files, vitest | 1,629 |

**Size: L by line count, S by dependency surface.** The second number governs the cost and is the best news in this plan.

The finding module has ZERO runtime npm dependencies. All three `@anthropic-ai/sdk` imports are `import type`. A grep for value imports of any bare module across the non-test sources returns nothing. The engine is pure TypeScript over plain data, with every LLM client injected by its caller. Its tests import only `vitest` and `import type Anthropic`.

## The route

`hauska-engine/services/engine-api/src/routes/findings.ts`, 258 LOC. Moves, but does not survive as-is: it is Hono, and it seals a Hauska envelope. Three things in it are load-bearing behaviour rather than plumbing and MUST survive the rewrite.

1. **`normalizeFindingsInput` plus `objectsWithStringKey`.** These filter array items lacking `id` / `atomId` / `ref`, so a malformed bundle degrades to a thinner result instead of 500ing. Filtering, not coercing: a source with no id cannot be cited, so it is dropped rather than fabricated. This is a fail-closed control. Dropping it in the port is a silent regression that no test at the destination would catch.
2. **The two-level degradation ladder.** `engineOptions` resolves anthropic to grok to mock without throwing; the `catch` then retries in mock mode before any 500 is allowed. A 500 requires that even the deterministic path failed.
3. **`findingsEnvelopeMeta`.** Computes `dataVintage` as the max non-empty `snapshotDate`, and assembles the degraded-coverage reason from LLM reason plus invalid-citation count plus discarded count plus the precedence miss.

**Size: M.**

## Three small external files the engine reaches for

Total 220 LOC. All trivially portable.

| File | LOC | Disposition |
|---|---|---|
| `packages/engine-core/src/llm/grok.ts` | 102 | **Move.** Pure `fetch` client, zero npm deps, reads `XAI_API_KEY` / `XAI_BASE_URL`. Its own header says it was already lifted once from ldt. |
| `packages/engine-core/src/types/planReviewDiscipline.ts` | 25 | **Move.** A 7-value `as const` tuple plus a guard. Header says it was lifted from `@workspace/api-zod`. |
| `packages/engine-core/src/briefing/citationValidator.ts` | 93 | **COPY, do not move.** The briefing engine stays in the substrate and still needs it. See THE SEAMS. |

## From the engine-api route lib

`lib/llmClients.ts` (102 LOC) is SHARED with the briefing route. Only `resolveFindingMode`, `resolveLlmForMode`, `getGrokClient`, `getAnthropicClient`, `hasAnthropicKey`, `hasGrokKey` are needed at the destination. Copy that half; leave the file in place for briefing. `resolveBriefingMode` and the `@hauska-engine/engine-core/briefing` import do not travel. **Size: S.**

## Environment surface that moves

Four variables are read inside the engine module and three at the route. That is the entire configuration surface.

`AIR_FINDING_LLM_MODE` (`engine.ts:86`, default `mock`), `AIR_FINDING_ORCHESTRATED` (`planSet/orchestrator.ts:44`), `XAI_FINDING_MODEL` and `XAI_MODEL` (`grokGenerator.ts:25-26`); at the route, `ANTHROPIC_API_KEY`, `XAI_API_KEY`, `GROK_API_KEY`. Add `PRECEDENCE_ENGINE_PRODUCTION` if the ldt precedence wire comes too (see MIGRATION SEQUENCE step 9).

# WHAT STAYS

## Stays in the substrate, unambiguously

**Atoms and the atom store.** Nothing in the finding module touches an atom store. The module's own `types.ts` says it outright: "The engine does NOT fetch atoms itself. The caller retrieves a jurisdiction-scoped top-K and hands them in." The engine consumes `CodeSectionInput` records that are already retrieved. Substrate, untouched.

**Retrieval.** Currently `legacy-design-tools/lib/codes` (44 files, 10,712 LOC), NOT in hauska-engine. `retrieveAtomsForQuestion` runs in ldt's api-server, which then POSTs the retrieved sections to the spine. Retrieval is atom retrieval and is substrate-shaped work; it does not move, and it must not be ported to plan-review.

**The gate.** `services/engine-api/src/server.ts` enforces three layers on every `/v1` call: a Bearer service token, mandatory gate-front headers (401 if absent, "engine-api accepts only gate-proxied calls"), and HMAC-signed gate-context verification with `off` / `warn` / `enforce` modes. Substrate. Stays.

**The meter.** Not in engine-api. A grep for `meter|metering` across `services/engine-api/src` and `packages/engine-core/src` returns only `mapLayerBboxGuard.ts` matching on "meters" as a distance unit. Metering lives at the MCP gate. Nothing to move, and the plan should stop describing engine-api as metered.

**The envelope.** `packages/engine-core/src/envelope/` (4 files, 186 LOC) plus `middleware/validateEnvelope.ts`, applied to every `/v1` route. It is the Hauska read-path contract carrying confidence, dataVintage, coverage and source. Substrate. Stays. What travels is a DECISION about whether the moved route still produces an envelope, which is a seam, not a move.

**The briefing engine.** Untouched by this ruling and still resident in `packages/engine-core/src/briefing/`.

## Ambiguous, with the cut proposed

**Code-section retrieval versus code-section interpretation.** The line the dispatch proposed is correct and the codebase already draws it cleanly. Retrieval (find the top-K sections for this jurisdiction and question) is atom retrieval and is substrate. Interpretation (does this submission violate that section, at what severity, with what citation) is product. The current boundary is the `codeSections: ReadonlyArray<CodeSectionInput>` field on the request body. That field IS the cut, it already exists, and the migration does not have to invent it. Keep it.

**`citationValidator.ts` (93 LOC) is genuinely mixed and is the one real ambiguity.** It is generic citation-grammar validation over `{{atom|briefing-source|id|label}}` and `[[CODE:atomId]]` tokens, plus rejection of a deprecated token shape. The grammar is a substrate concern (it is the atom citation grammar). The engine that consumes it is product. Its own header says the finding and briefing engines deliberately share ONE implementation because "the grammar is identical, so re-implementing would only invite drift."

**Proposed cut: copy it, and accept the fork explicitly rather than silently.** Moving it breaks briefing; leaving it creates a cross-layer import from a product engine back into the substrate, which is the thing the ruling exists to stop. Copying forks 93 lines of regex.

**Recommendation: copy, and pay for the fork with a mechanism.** Add a test at the destination that asserts the three regex literals byte-for-byte against a checked-in copy of the substrate source, and fails if they diverge. That converts "invite drift" from a hope into a check with a trigger. If the operator prefers zero forks, the alternative is publishing the validator as a tiny package from the substrate, which is more correct and more work; I would not block the migration on it.

**`readPathConfidence.ts` imports BACKWARD from substrate into product, today.** `packages/engine-core/src/envelope/readPathConfidence.ts:3` reads `import type { CodeSectionInput } from "../finding/types.js"`. The envelope, which is substrate, depends on a type owned by the finding engine, which is product. This inversion has to be cut regardless of where the engine lands, and it is the cheapest cut in the plan: the import is used only as `Pick<CodeSectionInput, "atomId" | "webProvenance">`. Inline that two-field structural type in `readPathConfidence.ts` and delete the import. **Size: S.** Doing this FIRST makes the engine directory removable without touching the envelope.

**`visionSheetRead.ts` is product, but its consumer is not only the finding engine.** ldt's `attachedDocumentVision.ts` imports `runDisciplineVisionRead` for CHAT ATTACHMENT INTAKE, which is a different surface. Its header says so: "reuses finding-engine P2 path." So moving vision to plan-review orphans a chat feature. Proposed cut: vision moves with the engine, and ldt's chat intake becomes a second consumer that must either call the moved engine or keep its own copy. Flag to the operator, do not decide silently. My recommendation is that chat-attachment vision is a THIRD product surface and the honest answer is that `runDisciplineVisionRead` is a shared product primitive that belongs wherever ldt keeps its own product code, not in either engine.

# THE SEAMS

Five seams. Only two carry real cost.

## Seam 1: the LLM provider. Cost: LOW.

Today the route constructs an Anthropic client or a Grok client and INJECTS it. The engine never constructs one. `generateFindings(input, { mode, grokClient, anthropicClient, visionAnthropicClient })`.

After the move plan-review does the same construction. Grok needs nothing but global `fetch` (Node 22 has it) plus `XAI_API_KEY`; `grok.ts` moves with the engine. Anthropic mode needs `@anthropic-ai/sdk` added to plan-review's manifest, which takes it from one dependency to two.

**Recommendation: port `mock` and `grok` first and defer `anthropic` mode.** Grok is the documented default rail per CLAUDE.md HR-12; anthropic is marked "legacy, prefer grok" in the engine's own options docstring. Deferring it keeps plan-review at `pg` plus nothing, and it takes the vision path (which is Anthropic-only) off the critical path.

## Seam 2: atom / code-section retrieval. Cost: NONE, if the caller keeps supplying it.

The engine already receives `codeSections` in the request body. Three options.

(a) **Caller supplies, unchanged.** ldt keeps doing `retrieveAtomsForQuestion` and POSTs the same body to plan-review instead of engine-api. Zero retrieval work. **Recommended for the move itself.**

(b) **plan-review retrieves via MCP.** It already has an MCP client (`src/mcp.mjs`, 215 LOC) with `mcpCall`, `getAtom`, `getPropertyAtomChain`, and a `plan_review_get_code` tool exists on the MCP server. This is the right long-run shape for plan-review's OWN workflow, where there is no ldt caller to supply sections. Track it as a follow-on, not a blocker.

(c) Port `lib/codes` (10,712 LOC). Rejected outright.

## Seam 3: the gate. Cost: LOW, and the pattern already exists.

Today ldt attaches gate-front headers plus a signed gate context and a Bearer service token, and engine-api 401s without them. plan-review has its own auth: `requireToken` checks `Authorization: Bearer ${PLAN_REVIEW_SERVICE_TOKEN}` and refuses anonymous callers.

The precedent is already built. `legacy-design-tools/artifacts/api-server/src/routes/planReviewProxy.ts` proxies `/api/plan-review` to plan-review Cloud Run with `Bearer ${PLAN_REVIEW_API_KEY}` and an `x-plan-review-source` stamp, and it REFUSES cortex-api as a backend host by regex. `PLAN_REVIEW_BACKEND_URL` and `PLAN_REVIEW_API_KEY` are already provisioned in api-server. The findings call reuses that client shape and those secrets.

What is LOST: the signed gate context and the gate-front tenant assertion. plan-review's Bearer token is a shared service secret with no tenant claim. That is a real reduction in tenant-isolation evidence and it must be declared, not discovered. See RISKS.

## Seam 4: the envelope. Cost: LOW, but it is a decision, not a port.

Every engine-api `/v1` response is sealed by `sealEnvelope` and validated by `validateEnvelopeMiddleware`. The findings route computes real envelope meta: confidence via `resolveReadPathConfidence`, dataVintage from source snapshots, `degradedCoverage` with a reason string, and a source block listing every citation id.

plan-review emits bare `json(res, status, body)` with no envelope anywhere.

**Question for the operator: does the moved findings endpoint still return a Hauska envelope?**

**This is NOT a free choice, and I established why.** ldt's consumer does not fail on a missing envelope. `lib/engine-core/src/envelope.ts:124` `unwrapEngineEnvelope` tries the envelope shape, then a flattened shape, and if neither matches it falls through to a fabrication branch (lines 173-196) that returns `confidence: { value: 0.75, kind: "asserted" }` for any non-mock producer, with `coverage.degraded: false`, `dataVintage: null`, and `source.adapter` defaulted to the string `"engine-api"`.

So if the moved endpoint returns bare JSON, the client invents a 0.75 confidence, marks it NOT degraded, and hands it to the surface. That is a fabricated number entering as though measured, with no declaration, which is the exact state ENFORCEMENT prohibits ("a fabricated zero is worse than an absence, because it enters averages without announcing that it was invented"). It would also keep reporting `adapter: "engine-api"` after engine-api no longer serves findings.

**Recommendation: yes, keep the envelope, and copy `envelope/` (186 LOC, 4 files) to the destination.** The degraded-coverage reason string is the honest-degradation mechanism required by ENFORCEMENT ("degradation is permitted only when declared in the output"). Dropping it does not produce a missing value; it produces an invented one.

## Seam 5: TypeScript to plain Node. THIS IS THE REAL COST. Size: M.

The impedance is smaller than feared in one way and sharper than feared in another.

**Smaller:** zero runtime npm dependencies, so nothing needs to be installed for the engine to run.

**Sharper, and this is the specific trap:** `hauska-engine/tsconfig.base.json` sets `"moduleResolution": "Bundler"` and `"noEmit": true`, and engine-api ships as `CMD ["pnpm", "--filter", "@hauska-engine/engine-api", "exec", "tsx", "src/index.ts"]`. The engine is NEVER COMPILED in production. It runs TypeScript through `tsx`.

Bundler resolution is why 39 non-test import specifiers (and 19 more in tests, 58 total) are EXTENSIONLESS: `from "./types"`, `from "./prompt"`, `from "../engine"`. Node's own ESM loader cannot resolve those. A straight copy into plan-review running under plain `node` fails at import with `ERR_MODULE_NOT_FOUND` on the first one.

Three shapes, evaluated:

**(A) Add `tsx` to plan-review and run TS directly.** Zero source edits, mirrors engine-api exactly, lowest drift risk. Cost: adds a runtime transpiler to a service whose stated identity is one dependency and no build step, and transpiling on every cold start on Cloud Run.

**(B) Add a `tsc` build emitting ESM to `dist/`, Dockerfile copies `dist`.** Requires rewriting the 58 specifiers to append `.js` and setting `moduleResolution: "NodeNext"`. Mechanical, and verifiable in one command. Keeps the runtime dependency-free and keeps all 11 test files. Adds a build step and a `typescript` devDependency.

**(C) Hand-port to `.mjs`.** REJECT. It discards 1,629 lines of tests and the entire type contract, and it is exactly how the fifth implementation appears. The ruling rejected a shared reasoning home to avoid that outcome; hand-porting reintroduces it.

**Recommendation: (B).** The specifier rewrite is mechanical, 58 sites, and self-verifying: after the rewrite, `node --input-type=module -e "import('./dist/finding/index.js')"` either resolves the whole graph or names the first file it cannot. That is a check that fails loudly. Take (A) only if the operator wants a zero-edit lift to get the divergence test running sooner, and treat it as temporary.

Note for whoever does this: `engine-core`'s `"build": "tsc -b"` script is not what ships and should not be trusted as a working build. The base config sets `composite: false` and `noEmit: true`, which `tsc -b` does not accept. Write the destination `tsconfig.json` fresh rather than inheriting.

# MIGRATION SEQUENCE

Ordered by what breaks if reversed. Dependencies named per step. No step assumes a later one.

## Phase 0: make the move possible without changing behaviour

**Step 1. Cut the backward substrate-to-product import.** Size S. Depends on: nothing. In `hauska-engine/packages/engine-core/src/envelope/readPathConfidence.ts`, replace `import type { CodeSectionInput } from "../finding/types.js"` with an inline two-field structural type (`atomId: string; webProvenance?: {...}`). Verify by violation: temporarily delete `src/finding/` in a scratch copy and confirm `envelope/` still typechecks. Until this is done, the engine directory cannot be removed without breaking the envelope, so this is genuinely first.

**Step 2. Build the divergence harness against the CURRENT engine, before anything moves.** Size M. Depends on: nothing. This is the instrument the whole migration is graded by, and building it first is the only way to know it can fail.

There is no ground truth (see SNAPSHOT item 4), so the only available proof is differential: same input, both engines, compare outputs. Specifics that make it work:

- Run in `mode: "mock"`. `generateMockFindings` is deterministic and the engine's own docstring notes the mock branch runs through the identical validate-and-discard pipeline as the LLM branches, so it exercises `finalizeDrafts`, `validateInlineCitations`, `discardReason` and the precedence pass.
- **Normalize two fields before comparing.** `atomId` is `finding:{submissionId}:{ulid}` and `aiGeneratedAt` is wall-clock. `generateFindings` accepts `options.now` and `options.ulid` for exactly this, BUT the HTTP route does not expose them. A black-box test through HTTP must therefore strip or pattern-match those two fields. State this in the harness; do not let it be discovered as a flake.
- Seed inputs from what already exists: `services/engine-api/src/__tests__/findings-degrade.test.ts` (194 LOC) already carries a well-formed bundle plus the minimal and malformed cases, and `envelope-contract.test.ts` (210 LOC) and `reasoning-routes.test.ts` (72 LOC) reference findings. Lift those bodies as the first fixtures.
- **Cover the degradation ladder explicitly**, not just the happy path: no keys at all, anthropic-key-absent, and a generator that throws. Those paths are where the fail-closed behaviour lives and where a port silently loses it.
- **Pre-register the falsifier.** Before running it, write down what result proves the harness worthless. Mine: if the harness passes when pointed at two DIFFERENT engines, it is not comparing anything. So the first thing to do with it is run it against the engine and the ldt duplicate, which are known to differ on precedence (step 3), and confirm it FAILS. A harness observed only passing has not been observed working.

**Step 3. Resolve the bidirectional precedence drift before porting, not during.** Size M. Depends on: 2. This is a real behavioural fork and porting on top of it copies an unresolved question.

| | hauska-engine (production) | ldt duplicate |
|---|---|---|
| Precedence | `runFindingsPrecedencePass(input)` sets a `precedence` FIELD on the result | `buildPrecedenceFindingDrafts(codeSections)` PREPENDS drafts into `findings[]` |
| Result shape | `precedence: ReconcileRequirementsByTopicResult \| null` | drafts merged, `precedence` field removed |
| Grok model override | absent | `options.grokModel` |
| Ensemble | absent | `options.ensembleEnabled` calls Grok twice and concatenates |
| Mock input hardening | present (non-array guards, `submission?.id` fallback) | absent |

Same input, different `findings[]` when precedence applies. The engine reports precedence as separate metadata; the duplicate emits precedence as findings. **Recommendation: port the hauska-engine behaviour, because it is the one actually serving production, and file the ldt-only S5 features (`grokModel`, `ensembleEnabled`) plus `productionWire.ts` / `productionGate.ts` as a named backlog item rather than silently dropping them.** Get the operator's ruling; do not let the executor pick.

## Phase 1: stand the engine up at the destination

**Step 4. Copy the engine into plan-review behind a build.** Size L. Depends on: 3. Copy `finding/` (32 files), plus `llm/grok.ts` and `types/planReviewDiscipline.ts` (move) and `briefing/citationValidator.ts` (copy). Rewrite the 58 extensionless specifiers to append `.js`. Add `tsconfig.json` with `moduleResolution: "NodeNext"`, written fresh, not inherited. Add `typescript` and `vitest` as devDependencies. Emit to `dist/`.

**Do not skip: add the emitted directory to the Dockerfile.** plan-review's Dockerfile copies only `package.json`, `package-lock.json` and `src`. A `dist/` that is built locally and never copied produces a container that boots and 500s on first call. Verify by violation: build the image, `docker run`, and confirm the import resolves before wiring any route.

**Step 5. Port the 11 test files and run them.** Size M. Depends on: 4. They import only `vitest` and `import type Anthropic`, so they port as-is once specifiers are rewritten. **These tests are the only real behavioural coverage the engine has anywhere.** If they cannot be made green at the destination, stop; that is the signal that the port changed behaviour.

**Step 6. Port the route.** Size M. Depends on: 4. Rewrite `routes/findings.ts` from Hono to plan-review's plain `http` handler style, mounted alongside the existing `/api/plan-review/*` routes. Carry all three load-bearing behaviours named in WHAT MOVES (input normalization, the two-level degradation ladder, envelope meta). Copy `envelope/` per seam 4.

**Step 7. Run the divergence harness across both live engines.** Size M. Depends on: 2, 5, 6. Both must be serving. Same normalized inputs to `engine-api /v1/findings/generate` and to the new plan-review endpoint; compare normalized outputs. **This is the gate on step 8 and nothing else is.** A green harness that has never been shown to fail (step 2's falsifier) does not count.

## Phase 2: move the consumer, then retire

**Step 8. Repoint ldt's api-server from engine-api to plan-review.** Size M. Depends on: 7. Change `engineSpineRouting.ts`'s `routeGenerateFindings` and `routeGenerateOrchestratedFindings` to POST to `PLAN_REVIEW_BACKEND_URL` with `Bearer ${PLAN_REVIEW_API_KEY}`, reusing the `planReviewProxy.ts` client shape and its already-provisioned secrets.

Note the guard this trips: `artifacts/api-server/src/lib/__tests__/engineSpineUngatedPaths.test.ts` asserts that `findings` contains `routeGenerateFindings` and `routeGenerateOrchestratedFindings`. Read it before editing; it is the control that keeps a local fallback from creeping back, and it must be updated rather than deleted.

**Step 9. Retire the substrate engine, and PROVE it by decline.** Size S. Depends on: 8. Per ENFORCEMENT, retirement is proven by decline and never by documentation, and a change that says "read from X instead of Y" carries Y's retirement in the same card.

Delete `packages/engine-core/src/finding/`, the `./finding` export from `packages/engine-core/package.json`, the `export * as finding` line in `packages/engine-core/src/index.ts`, `routes/findings.ts`, the `v1.route("/findings", ...)` mount in `server.ts`, and the `resolveFindingLlmMode` import in `lib/llmClients.ts`.

`POST /v1/findings/generate` must then return the existing `not_implemented` 501 from the `app.all("/v1/*")` catch-all. Add a CI check that fails if a findings route reappears in engine-api. **A 501 that nobody asserts is not a retirement.**

## Phase 3: the other two homes

These do not disappear because C gains an engine, and each needs its own card.

**Step 10. Home B: finish a retirement that is already 90 percent done.** Size S. Depends on: nothing; can run in parallel from step 1.

`planReviewBff.ts` (2,908 lines) is unmounted, and `/api/plan-review` on cortex-api is ALREADY a proxy to plan-review Cloud Run per the G-60 remount. The routing retirement is done; only the dead code remains. Delete `planReviewBff.ts` and its 361-line test.

Flag while there: the control keeping it unmounted is a TEXT check in `planReviewProxy.test.ts` doing `expect(src).not.toMatch(/router\.use\("\/plan-review", planReviewBffRouter\)/)` against `index.ts` source. That is a presence-shaped grep on one exact formatting of one line. It is bypassed by mounting under any other path, or by the same mount formatted differently. Deleting the file is strictly better than the grep, and it removes the need for it.

**Step 11. Home A: the one that needs an operator ruling, not an executor decision.** Size L. Depends on: 8.

Home A is 6,139 LOC of live routers (`findings.ts` 2,263, `engagements.ts` 961, `submissions.ts` 808, `codes.ts` 609, `communications.ts` 596, `decisions.ts` 512, `cannedFindings.ts` 390) serving the architect pre-submittal workflow in `artifacts/plan-review`, a DIFFERENT product for a DIFFERENT user than home C. After step 8 its generation call points at plan-review, so the engine duplication is resolved. What remains is that ldt still owns architect-side submission lifecycle, and still holds four in-process capabilities from `lib/finding-engine` (vision read, plan-set classification, precedence wire, mode resolution).

**Question for the operator, with a recommendation.** Does the architect pre-submittal surface stay a product in its own right?

If YES: home A stays, calls plan-review for generation, and `lib/finding-engine` is reduced to exactly the four in-process capabilities it still provides, with its `generateFindings` export DELETED so the duplicate can never generate again. That deletion is the retirement item, and it is checkable.

If NO: home A retires into home C on the pattern plan-review's own README already documents ("Live cortex `/api/plan-review` functions are pulled here, then remounted on cortex as a proxy"), which is the same move already executed for home B and is therefore proven.

**My recommendation is YES, keep A as a client.** ADR-023 designates ldt as the `cortex-reporting` repo and names "plan review engine, findings management, adjudication capture, delivery letter generation" as its function package, and the architect surface has a real distinct audience. Collapsing A into C conflates the architect product with the city product, which is a bigger layer error than the one this ruling is fixing.

**Step 12. Reconcile the canon.** Size S. Depends on: the step 11 ruling. ADR-023 currently says the plan review engine lives in `legacy-design-tools`. Ruling R-D says it lives in `plan-review`. Those conflict on the record. Amend ADR-023 or file a superseding decision naming R-D as the override. Leaving both standing is how the next agent re-derives the wrong home by archaeology.

**Step 13. Deal with the eval harness honestly.** Size M. Depends on: 7.

It cannot be repaired into a migration gate; its fixtures have no findings ground truth and its scoring step is commented out. Two separable items, and the plan should not pretend they are one.

Immediately: change the CI path filter so it stops implying coverage it does not have, or mark the workflow disabled. A workflow whose filter watches a directory in another repo reports green forever and teaches the fleet that findings changes are covered.

Separately, as its own card: populate `expectedFindings` on at least one fixture and uncomment the scoring job. That is a real eval build, not a migration step, and bundling it here would hold the migration hostage to it.

**Step 14. Declare leave-behind.** Required regardless of content.

```
leave_behind:
  - item: ldt lib/finding-engine S5 features (grokModel, ensembleEnabled, productionWire.ts, productionGate.ts)
    owner: [ldt seat]
    plan_row: [assign at close]
  - item: runDisciplineVisionRead second consumer (attachedDocumentVision.ts chat intake)
    owner: [ldt seat]
    plan_row: [assign at close]
  - item: citationValidator.ts fork (substrate copy vs plan-review copy)
    owner: [govtech seat]
    plan_row: [assign at close]
  - item: eval harness fixtures with zero expectedFindings
    owner: [ldt seat]
    plan_row: [assign at close]
  - item: ADR-023 vs ruling R-D conflict on engine home
    owner: [planner]
    plan_row: [assign at close]
```

# RISKS

Each stated as a mechanism: what goes wrong, how it is first noticed, what prevents it.

## R1. plan-review's hardcoded matrix and the engine cannot disagree, because they do not produce the same shape. HIGH.

This is the largest risk in the migration and it is understated by the framing "they might disagree on the same input."

`src/mcp.mjs` `matrixFromChain` returns exactly FOUR fixed rows on every call regardless of input: IBC `R302.1`, IBC `R311.7`, UDC `14-02-003`, UDC `14-02-008`, with `determination` pinned to `Uncertain` or `Unchecked`. It is a SECTION ADJUDICATOR: one row per code section, with a verdict. The engine is an ISSUE EMITTER: zero or more findings with severity, category, free text and citations, and no determination anywhere in `EngineFinding`.

The destination schema encodes the adjudicator shape as a hard constraint. `sql/001_foundation.sql` on `plan_review_findings`: `section_atom_id text NOT NULL`, `citation text NOT NULL`, `confidence jsonb NOT NULL`, and `CHECK (determination IN ('Pass','Fail','Uncertain','Unchecked'))`. An `EngineFinding` has no `determination`, may cite several sections or none (anchoring on `elementRef` instead), and its `confidence` is a bare number rather than the jsonb object `confidenceFromAtom` builds.

**Mechanism:** the executor reaches step 6, tries to persist engine output through `upsertFinding`, and hits a NOT NULL or CHECK violation. Worst case they satisfy the constraint by defaulting `determination` to `Uncertain` and synthesizing `section_atom_id` from the first citation, which fabricates an adjudication the engine never made and encodes it as a specification.

**First noticed:** at insert time in step 6, or much worse, never, because a fabricated `Uncertain` is indistinguishable from a real one on the ICC-facing surface.

**Prevented by:** deciding the output contract BEFORE step 4, as an operator ruling. Three options: (i) engine findings go to a NEW table alongside the matrix, and the two surfaces stay separate; (ii) the matrix retires and the schema migrates to the emitter shape; (iii) an explicit adjudication pass maps findings to determinations, which is new reasoning and must be designed, not improvised in a mapper. **Recommendation: (i) for the migration.** It is additive, it does not require the matrix to retire before the engine is proven, and it keeps the two shapes from being silently merged. Then retire the matrix as its own card once the engine covers its four rows, with the retirement proven by the matrix path returning a decline.

Related and worth stating: the doc_repo scope document already records the matrix's `IBC_SEED.find(...) || chapterHits[0] || IBC_SEED[0]` fallback as defect #6, serving a neighbouring section as the answer. Do not carry that pattern into the engine's mapper.

## R2. The MCP tool named `codex_finding_generation` does not generate findings, and after this migration it would. MEDIUM-HIGH.

`hauska-mcp-server/src/plan-review-tools.ts` registers `codex_finding_generation` behind a `codex` product gate. It calls `planReviewClient.intake` or `planReviewClient.matrix`, which is `seedMatrix`, which is the four hardcoded rows. It has never invoked the engine.

**Mechanism:** the engine lands in plan-review behind `/intake`, and a gated, priced MCP tool silently changes from returning four deterministic `Uncertain` rows to returning LLM-generated findings. Callers who built against the fixed four-row shape break, and billing events change character with no version bump.

**First noticed:** by an external MCP consumer, which is the worst discovery path available.

**Prevented by:** treating the MCP tool contract as frozen. Wire the engine behind a NEW endpoint and a NEW tool; leave `codex_finding_generation` on the matrix until the tool contract is deliberately versioned. This falls out naturally from R1 recommendation (i).

## R3. Tenant-isolation evidence weakens across the move. MEDIUM-HIGH.

Today engine-api requires gate-front headers carrying `tenantId`, `product`, `packageId`, `accessTier`, `credentialId`, plus an HMAC-signed gate context, and it LOGS a `gate_context_mismatch` when the signed tenant disagrees with the plain one. That mismatch check is meaning-shaped: two independently derived tenant claims compared against each other.

plan-review's `requireToken` compares one Bearer token against one env var. One derivation, no tenant claim, no mismatch detection possible.

**Mechanism:** the engine moves, the signed gate context does not, and the tenant assertion silently drops from cryptographically signed to a shared service secret. Per the tenant-sovereignty rule in CLAUDE.md this is a reduction in exactly the property enterprise tenants depend on.

**First noticed:** likely never by a test. This is the failure class that produces no complaint.

**Prevented by:** declaring the reduction in the step 8 close rather than discovering it, and either forwarding the gate-context headers through to plan-review and verifying them there (`gate-context-verify.ts` is 122 LOC and moves cheaply), or recording an explicit accepted-risk with the plan row that restores it. **Recommendation: forward and verify.** 122 LOC is cheap for the only meaning-shaped tenant check in the path.

## R4. TypeScript-to-plain-Node impedance, concretely. MEDIUM.

**Mechanism:** 39 non-test plus 19 test import specifiers are extensionless, legal only under `moduleResolution: "Bundler"`. Under Node's ESM loader the first one throws `ERR_MODULE_NOT_FOUND`. A partial rewrite leaves a module that imports fine at the entry point and fails on a branch reached only in the precedence or vision path, which the mock-mode divergence test may not exercise.

**First noticed:** at boot if the entry graph is broken (loud, fine), or on a rare request path in production if only some specifiers were rewritten (quiet, bad).

**Prevented by:** after the rewrite, importing the compiled ENTRY and asserting the full graph resolves, then asserting `grep -rn 'from "\.\.\?/[^"]*"' dist_src | grep -v '\.js"'` returns zero. That is a check that can fail, unlike eyeballing the diff. And it needs verifying by violation: revert one specifier and confirm the check goes red.

Second-order: plan-review's Dockerfile copies only `src`. A new emitted directory not added to the `COPY` produces an image that boots and fails on first call. Catch it by running the image, not by reading the Dockerfile.

## R5. Prompt drift during the move. LOW, and lower than expected.

`prompt.ts` is BYTE-IDENTICAL between hauska-engine and the ldt duplicate (0 differing lines after CR stripping), as are all 11 test files, `visionSheetRead.ts`, `precedence/reconcile.ts`, `precedence/types.ts`, `precedence/comparability.ts`, `precedence/accessibilityDemo.ts` and `planSet/dedupe.ts`. The prompt has not drifted in the one place two copies have coexisted, which is decent evidence it is stable under copying.

**Mechanism:** an editor reflows the 217-line prompt during the port, or a lint rule normalizes whitespace inside the template literal, silently changing model behaviour. The closing instruction "The findings array MAY be empty if you find nothing to flag" is exactly the kind of line whose loss converts an honest empty result into a fabricated one.

**First noticed:** not by the mock-mode divergence test, which never calls a model. This risk is INVISIBLE to the step 7 gate, which is why it is called out separately.

**Prevented by:** hashing `prompt.ts` before and after the move and asserting equality, as a test rather than a manual check. If a deliberate prompt change is wanted later, it updates the hash and shows up in review as a prompt change. Do not rely on the divergence harness for this.

## R6. Secret and provider access from a different GCP project. MEDIUM.

Confirmed distinct projects. engine-api runs in `hauska-prod-497015`; plan-review's README states GCP `plan-review-505715`, Cloud Run `plan-review` in `us-east1`, live at `https://plan-review-ozx33wafia-ue.a.run.app`, with its Neon DSN in Secret Manager in that project.

**Mechanism:** `XAI_API_KEY` (and `ANTHROPIC_API_KEY` if anthropic mode ships) exist in `hauska-prod-497015` and do not exist in `plan-review-505715`. The engine's degradation ladder means a MISSING KEY DOES NOT FAIL. It degrades to mock and returns deterministic fixture findings with `degraded: true`. So a forgotten secret produces a service that looks healthy, returns 200s, and serves invented findings.

**First noticed:** only by someone reading `degraded` or the coverage reason. This is the single most likely production failure of this migration and it is designed to be quiet.

**Prevented by:** two things, not one. First, provision the secret as an explicit step 6 precondition with a length-echo verification, never a copy-paste. Second, add a startup assertion in plan-review: if `AIR_FINDING_LLM_MODE` is `grok` or `anthropic` and the corresponding key is absent, REFUSE TO START rather than degrade. Degradation on a per-request LLM fault is correct; degradation because the deploy forgot a secret is a misconfiguration masquerading as a degraded answer.

Also relevant from memory: a Cloud Run `--source` deploy can rotate the service API key, and workflow deploys revert manually-set env vars. Put the vars in the deploy workflow file, not in the console.

## R6b. Dropping the envelope fabricates a confidence of 0.75 downstream. HIGH if seam 4 is decided wrong.

**Mechanism:** the port simplifies `findingsEnvelopeMeta` away as "Hono plumbing" and the new endpoint returns bare JSON. ldt's `unwrapEngineEnvelope` does not error. It falls through to its fabrication branch and synthesizes `confidence 0.75, asserted, degraded: false, dataVintage: null, adapter: "engine-api"`. Every finding then carries an invented confidence that was never computed, marked as not degraded, attributed to a service that no longer serves it.

**First noticed:** never, from the outside. `0.75` is a plausible confidence and `degraded: false` suppresses the one signal that would prompt a question. The mock-mode divergence test does not catch it either, because it compares the `result` payload rather than the honesty block.

**Prevented by:** keeping the envelope (seam 4), AND adding an assertion to the step 7 harness that compares the ENVELOPE META, not only `result.findings`. Verify it by violation: strip the envelope from one response and confirm the harness goes red. If it stays green, the harness is measuring half the response.

## R7. The engine and the retained ldt duplicate diverge further while both exist. MEDIUM.

Steps 4 through 8 leave three copies live at once: hauska-engine's (serving), plan-review's (new), and ldt's `lib/finding-engine` (in-process for vision, classification, precedence).

**Mechanism:** a fix lands in one and not the others. The 37-line `engine.ts` drift already in the tree is proof this happens unattended.

**First noticed:** as a bug reproducible on one surface and not another, typically months later.

**Prevented by:** keeping the window short (steps 4 to 9 are one lane, not several), running the step 7 divergence harness on a schedule for as long as two generating copies exist, and executing the step 11 ruling so `lib/finding-engine` loses its `generateFindings` export. A duplicate that CANNOT generate cannot diverge on generation.

## R8. The divergence harness passes because it is not comparing anything. MEDIUM.

**Mechanism:** the harness normalizes `atomId` and `aiGeneratedAt`, and over-normalizes, or compares only `findings.length`, or points both requests at the same backend through a stale env var. It reports green and certifies nothing. This is the documented recurring failure in this operation: the check returned the expected answer, so it was not interrogated.

**First noticed:** never, by construction, unless deliberately provoked.

**Prevented by:** step 2's pre-registered falsifier, run before the harness is trusted. Point it at the two engines KNOWN to differ on precedence (hauska-engine versus the ldt duplicate) and require a RED result. Only then point it at old versus new. And record which backend each request actually reached from the response, not from the config that was supposed to set it.

# WHAT I COULD NOT ESTABLISH

Read-only, no execution. Each item names the exact command that would settle it and who should run it.

Four items I originally listed here were cheap enough to close in-session and are recorded as CLOSED with their evidence, rather than left as open questions an executor would re-run.

**CLOSED. hauska-mcp-server snapshot.** `git -C P:\tmp\scope_20260824\hauska-mcp-server rev-parse HEAD` returns `bdbb99d1773df3816465f514450ba74dfdd7e8c8`, matching the doc_repo scope document's `bdbb99d`. The `codex_finding_generation` reading in R2 is anchored to that commit.

**CLOSED. `artifacts/plan-review` does not import `@workspace/finding-engine`.** 135 `.ts`/`.tsx` files under `artifacts/plan-review/src`, zero matches. The declaration at `artifacts/plan-review/package.json:65` is an UNUSED dependency. Step 11 is smaller than feared on that axis, and removing the stale declaration is a free cleanup inside it.

**CLOSED. The envelope is load-bearing on the consumer side.** See seam 4 and R6b; `lib/engine-core/src/envelope.ts:124-196` fabricates rather than fails. This converted seam 4 from an open choice into a decided one.

**CLOSED (partially). ldt's spine client is `lib/engine-core/src/envelope.ts`, not hauska's envelope package.** They are separate implementations of the same contract in different repos, which is itself a fourth copy of something and worth a look, but it is out of this migration's scope and I am naming it rather than chasing it.

Still open:

**1. Whether the ported engine is byte-behaviourally identical.** Cannot be established by reading. It requires step 2's harness. Everything in this plan about equivalence is a plan to prove it, not a proof.

**2. Whether the engine's 11 test files pass at either end today.** Not run. `pnpm --filter @hauska-engine/engine-core test` (or `npx vitest run packages/engine-core/src/finding`) in the source repo establishes the baseline. Without it, a red test after the port is unattributable: it could be the port or a pre-existing failure. **Run this before step 4.**

**3. Which engine-api revision is actually serving, and whether the findings route is reachable in production.** Per the enforcement rule about reading the authoritative record: the serving revision is on the request's log line, not in `latestReadyRevisionName`, and multi-field `gcloud --format="value(...)"` misreads on blank fields. Settle with `gcloud run services describe engine-api --project hauska-prod-497015 --format=json` and read fields by name, plus one authenticated `POST /v1/findings/generate` with valid gate-front headers.

**4. Live secret inventory in `plan-review-505715`.** Whether `XAI_API_KEY` / `ANTHROPIC_API_KEY` exist there. `gcloud secrets list --project plan-review-505715`. This gates R6 and should be checked before step 6, not during.

**5. Whether `plan_review_findings` currently holds only matrix-shaped rows.** I read the DDL, not the data. If some other writer already puts non-matrix rows in that table, R1's option (i) changes shape. `SELECT determination, count(*) FROM plan_review_findings GROUP BY 1` against the plan-review Neon DSN. Govtech seat only; the DSN is not in this repo by design.

**6. Whether `artifacts/plan-review` (the ldt SPA) has any other backend dependency that step 11 would break.** I established the api-server routers it is served by, but did not trace the SPA's own fetch calls. `grep -rn "fetch(\|/api/" legacy-design-tools/artifacts/plan-review/src` before executing step 11.


**7. Whether Node's native type-stripping is a viable fourth option for seam 5.** Node 22 supports `--experimental-strip-types`, which would remove the build step entirely. It requires explicit file extensions, so it does NOT avoid the 58-specifier rewrite, and I did not verify plan-review's exact Node minor (`package.json` says `>=22`, the Dockerfile says `node:22-alpine`, which floats). If the executor wants to evaluate it: `docker run --rm node:22-alpine node --version`, then confirm the flag is stable rather than experimental at that version. I did not recommend it because a floating base image plus an experimental loader is two unpinned things under a migration.


