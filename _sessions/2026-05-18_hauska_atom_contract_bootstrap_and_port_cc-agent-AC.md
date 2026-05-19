---
date: 2026-05-18
agent: cc-agent-AC
repo: hauska-atom-contract
session_type: execute
rolled_up: false
related: [_dispatches/2026-05-18_cc-agent-AC_hauska_atom_contract, 51_substrate_v1_sprint, 26_atom_upgrade_guide, 27_engine_evolution_plan, 80_adrs/adr_018_atom_contract_substrate_layer]
---

# Session — hauska-atom-contract bootstrap and framework port (cc-agent-AC)

## What was done

First session in the new `empressaioemail-tech/hauska-atom-contract` repo. Phases A (bootstrap), B (port framework source), and C (atom types) of the cc-agent-AC dispatch executed; Phase D (npm publish) prepared and stopped at the publish gate per Nick's pre-session call.

Phase A bootstrap landed: root single-package shape (Nick's selection over `packages/contract/`); `package.json` declaring `@hauska/atom-contract@1.0.0` with `drizzle-orm` as the lone runtime dep; `tsconfig.json` strict + NodeNext; `tsconfig.build.json` for dist emit; `vitest.config.ts`; flat `eslint.config.js`; `.gitignore`; README; CHANGELOG; GitHub Actions CI workflow exercising lint + typecheck + test + build across Node 18 / 20 / 22.

Phase B port landed: ten source modules (`registration`, `composition`, `context`, `history`, `inline-reference`, `registry`, `render`, `scope`, `vda`, `index`) plus `testing/index.ts` and nine test files copied verbatim from `legacy-design-tools/lib/empressa-atom/`. Package-name rename `@workspace/empressa-atom` to `@hauska/atom-contract` propagated through every JSDoc reference and the testing subpath. NodeNext requires `.js` extensions on relative imports; sed pass added them across all source. `@workspace/db` runtime dep dropped (consumers inject their own Drizzle-shaped db via the existing `DrizzleLikeDb` structural type). Postgres-backed integration test rewritten to use `createInMemoryEventService` from the testing subpath so the package's CI is self-contained; the postgres exercise of `PostgresEventAnchoringService` belongs to consumer packages with real db stacks.

Phase C: per Nick's option β selection (see *What was learned*), the atom-type-registration phase resolved to zero new code in the contract package. Catalog atom registrations remain in their consumer packages.

Phase D preparation: `npm run build` produced clean `dist/` with `.js`, `.d.ts`, `.js.map`, `.d.ts.map` for every module plus the testing subpath. `npm pack --dry-run` confirms tarball at 37.4 kB packed / 123.3 kB unpacked, 47 files, manifest includes `dist/`, `README.md`, `CHANGELOG.md`, `package.json`; no source or node_modules leaks. **Stopped at `npm publish` per Nick's explicit hand-off plan; he provides creds and pushes the v1.0.0 git tag at the publish step.**

Verification gates all green: typecheck clean, lint clean (max-warnings=0 enforced), 9 test files / 52 tests pass in 880 ms, build clean. The five `@ts-expect-error` type-level smoke tests in `src/__tests__/types.test.ts` exercise the registration contract enforcement (rejection of widened entityType, mismatched defaultMode, missing composition, missing contextSummary, missing historyProvenance, missing domain) and all pass.

## What was learned (changes to ground truth)

**Scope correction landed before any code shipped.** The dispatch's Phase B told me to "port the nineteen existing atom type registrations" into `@hauska/atom-contract`, and Phase C told me to add nine new Bump 1 atom types (`code-section`, `code-definition`, `code-amendment`, `code-cross-reference`, `code-edition`, `jurisdiction-corpus`, plus the three Layer-2-only adjudication-context atoms) as full `register()` calls plus Zod schemas in the contract package. Two source-repo findings contradicted this scope.

First, the source `lib/empressa-atom/` package is framework-only. Its README states explicitly that no catalog atoms are registered there. The nineteen existing atom types live in `legacy-design-tools/artifacts/api-server/src/atoms/` and register against the contract via `make<Atom>(db, eventService)` factories that take api-server runtime deps: `@workspace/db` (Drizzle tables for engagements, sheets, submissions, etc.), api-server route helpers like `extractSheetCrossRefs`, and product-specific schemas. Lifting them wholesale into a published substrate package would force `@workspace/db` to come along as a runtime dep (impossible, it is workspace-private) or couple the substrate to Empressa product schemas (inverts ADR-018's clean substrate-vs-product layering).

Second, the 51 sprint plan §Stream 1B at lines 254 through 302 places the nine new Bump 1 atom types in `hauska-engine/packages/atoms/` under cc-agent-E, with schemas, Zod validation, and render-mode stubs there. Doing the same atoms a second time in `@hauska/atom-contract` under cc-agent-AC would duplicate cc-agent-E's surface.

Surfaced the conflict to Nick before writing any code. He selected option β (framework-only contract): `@hauska/atom-contract@1.0.0` ships the framework primitives only; all twenty-eight atom-type registrations (nineteen existing in api-server, nine new in hauska-engine `packages/atoms/`) live outside the contract package. This matches the source-repo structure, matches ADR-018 substrate posture, matches the 51 sprint plan §1B engine ownership, and clears Sync 1 fastest.

**Contract-package-version-bump framing in docs is misnamed.** [`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md) §Bump 1 atom contract coordination and [`27_engine_evolution_plan.md`](../27_engine_evolution_plan.md) §Contract version bump both describe "Bump 1 of `@hauska/atom-contract`" coordinated across five repos. Under the corrected scope, what actually bumps is the engine's atom-registry version. The contract package starts at v1.0.0 and stays through this sprint barring an unrelated framework change. Doc updates suggested below.

**Texas IP attorney memo is the load-bearing publication gate, not just the ingestion gate.** The session foregrounded that `@hauska/atom-contract` itself does not contain jurisdictional content (it is the framework, not the corpus), so the memo gate per [`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md) Sync 6 applies to corpus ingestion, not to contract publication. Contract publication is unblocked the moment Nick provides npm creds.

**Node TLS environment caveat for the host machine.** `npm install` against this Windows-side Node stack fails default cert verification with `UNABLE_TO_VERIFY_LEAF_SIGNATURE` against registry.npmjs.org. Workaround: `NODE_OPTIONS="--use-system-ca" npm install` (uses Windows system CA store, which holds whatever cert chain the machine trusts). `NODE_TLS_REJECT_UNAUTHORIZED=0` does NOT help because npm's own TLS layer (`make-fetch-happen`) ignores the env var. This is environment state, not code; flagged here in case cc-agent-E and cc-agent-M hit the same wall on the same machine. Logged in case it points at a deeper Windows CA-bundle staleness worth investigating in a separate session.

## What's still open

- **npm publish of `@hauska/atom-contract@1.0.0`.** Nick provides scope creds and runs `npm publish` from the prepared dist. The publish gates Sync 1.
- **Sync 1 signal.** Per dispatch, Sync 1 (Bump 1 atom contract published) is signaled in this session summary so planner can begin the Bump 1 cross-repo PR rollout immediately. **Sync 1 is NOT YET signaled — the publish has not occurred.** Planner should wait for the post-publish signal before opening the five pin-update PRs (legacy-design-tools, smartcity-os, legacy-revit-sensor, hauska-engine, hauska-mcp-server).
- **`git tag v1.0.0` + push to origin.** Nick does this alongside the publish.
- **`legacy-design-tools/lib/empressa-atom/README.md` hand-off pointer update.** Pre-drafted snippet below; lands when Nick publishes. Per ADR-018 §Consequences at [`adr_018:65`](../80_adrs/adr_018_atom_contract_substrate_layer.md#L65).
- **Doc-set sweep on the "contract version bump" misnomer.** See *Suggested canonical doc updates* below. Not blocking; planner can fold into the Bump 1 cross-repo PR rollout commit.
- **Cross-repo coordination note for cc-agent-E.** The engine `packages/atoms/` directory is now the sole home for both ported existing atoms and new Bump 1 atom types, per option β. The dispatch reallocation already placed cc-agent-E in `hauska-engine` Track 1; this session's scope correction does not change that assignment but tightens cc-agent-E's responsibility scope to include the atom-type-registration work that the original dispatch ambiguously split.

## Suggested canonical doc updates

[`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md) §Bump 1 atom contract coordination (lines 171 through 201): rename to "Bump 1 atom registry coordination (engine-side; against `@hauska/atom-contract@1.0.0`)". Body: clarify that the atom types named (`code-section`, etc.) register against the contract from `hauska-engine/packages/atoms/`, not inside the contract package itself. Five-repo pin-update list stays (consumers pin to `@hauska/atom-contract@^1.0.0`); the engine's atom-registry version is what bumps. Cross-link this session summary as the scope-clarification reference.

[`27_engine_evolution_plan.md`](../27_engine_evolution_plan.md) §Contract version bump (line 224 onward) plus the bump table: same clarification. The Bump 1 / Bump 2 split still holds at the engine atom-registry level; the contract package version is independent and stays at 1.0.0 unless an unrelated framework change forces a minor.

[`26_atom_upgrade_guide.md`](../26_atom_upgrade_guide.md) §4 Version upgrade protocol: clarify that contract-package version bumps reflect framework changes (e.g., new render mode, new `ContextSummary` field), not catalog atom-type additions. Catalog atoms register against the contract from their consumer package; new atoms drive consumer-package version bumps, not contract-package bumps.

[`80_adrs/adr_018_atom_contract_substrate_layer.md`](../80_adrs/adr_018_atom_contract_substrate_layer.md) §Known follow-on doc updates: append a bullet referencing this session summary as the "contract scope clarification" follow-on. ADR-018 line 65 hand-off snippet wording stands; only the timeline marker advances once Nick publishes.

[`00_current_state.md`](../00_current_state.md): mark Phases A through C of cc-agent-AC's dispatch complete; Phase D pending Nick publish + tag; Sync 1 pending.

## Sync 1 status

**Sync 1 is NOT signaled in this session.** The framework is built, verified (52/52 tests, typecheck, lint, build all green), packed, and ready to ship. The publish step is Nick's. Once `@hauska/atom-contract@1.0.0` is on npm and the v1.0.0 tag is on origin, planner should treat that npm-side fact as the Sync 1 signal and proceed with the Bump 1 cross-repo PR rollout against legacy-design-tools, smartcity-os, legacy-revit-sensor, hauska-engine, hauska-mcp-server (single PR per repo, atomically merged per [`51`](../51_substrate_v1_sprint.md) §Bump 1).

## Pre-drafted legacy-design-tools README hand-off snippet

For `legacy-design-tools/lib/empressa-atom/README.md` §Eventual extraction (currently lines 14 through 22). Replace the existing block when Nick publishes:

```markdown
## Lineage and current home

M2-C extraction landed 2026-05-18. The atom framework now lives at
[`empressaioemail-tech/hauska-atom-contract`](https://github.com/empressaioemail-tech/hauska-atom-contract)
and publishes as `@hauska/atom-contract` on npm. This workspace-private
copy is the historical staging ground; framework work happens upstream.

Per doc_repo [ADR-018](https://github.com/empressaioemail-tech/doc-repo/blob/main/80_adrs/adr_018_atom_contract_substrate_layer.md),
the atom contract is Hauska commercial substrate, peer to the Hauska SDK,
not Empressa product. Consumers (this api-server included) depend on
`@hauska/atom-contract` directly. The workspace-private import path
(`@workspace/empressa-atom`) remains valid through the Bump 1 transition
and will be removed once every consumer in this repo pins to the
published package per the Bump 1 cross-repo PR rollout.
```

## Files produced or modified

In `empressaioemail-tech/hauska-atom-contract` (new repo):

- `package.json` — `@hauska/atom-contract@1.0.0`, scripts, deps, peer + publish config
- `tsconfig.json` and `tsconfig.build.json` — strict TS, NodeNext, dist emit config
- `vitest.config.ts` and `eslint.config.js` — test runner and flat lint config
- `.gitignore`, `README.md`, `CHANGELOG.md`
- `.github/workflows/ci.yml` — lint + typecheck + test + build on Node 18 / 20 / 22
- `src/index.ts`, `src/registration.ts`, `src/composition.ts`, `src/context.ts`, `src/history.ts`, `src/inline-reference.ts`, `src/registry.ts`, `src/render.ts`, `src/scope.ts`, `src/vda.ts` — framework primitives
- `src/testing/index.ts` — testing subpath helpers (`createTestRegistry`, `createInMemoryEventService`, `runAtomContractTests`)
- `src/registry.test.ts`, `src/composition.test.ts`, `src/context.test.ts`, `src/inline-reference.test.ts`, `src/render.test.ts`, `src/scope.test.ts`, `src/vda.test.ts` — unit tests
- `src/__tests__/types.test.ts` — five `@ts-expect-error` type-level smoke tests
- `src/__tests__/integration.test.ts` — in-memory full-path integration (register → validate → resolve → contextSummary → compose → appendEvent → readHistory)

In `doc_repo`:

- `_sessions/2026-05-18_hauska_atom_contract_bootstrap_and_port_cc-agent-AC.md` (this file)

No edits to `legacy-design-tools` yet — the README hand-off snippet is pre-drafted above and lands at publish time alongside Nick's `npm publish` + tag push.
