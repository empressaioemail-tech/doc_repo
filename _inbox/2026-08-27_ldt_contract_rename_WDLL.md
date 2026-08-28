---
id: 2026-08-27_ldt_contract_rename_WDLL
title: WDLL — LDT contract rename: legacy-design-tools moves from the vendored @hauska/atom-contract 1.6.0 tarball to the published @empressaio/atom-contract ^1.30.0, and the old name is retired by decline
date: 2026-08-27
last_updated: 2026-08-27
status: closed
applies_to: legacy-design-tools (six package.json dependents, 73 import sites, four vendored tarballs); consumers of its serving process (cortex-api canary on close)
plan_row: F-15 (consumer half), F-06 (bakes typed against Track 2)
depends_on: @empressaio/atom-contract 1.30.0 on npm (F-15 closed partial 2026-08-27); the publish lane's LDT PR (conformant bake CLIs, serveGuards) merged first so this lane starts from that main
operator_go: 2026-08-27 ("give me the rename handoff prompt")
law: 80_adrs/adr_018_atom_contract_substrate_layer.md; _decisions/2026-07-04_branding_canon_hauska_substrate_only.md (the 2026-07-06 rename); _catalog/repo_intents.md (atom contract is @empressaio/atom-contract; the older name is frozen at 1.6.1 and appears in historical records only); ENFORCEMENT.md (retirement proven by decline; never widen a check; no fallbacks)
snapshot: legacy-design-tools origin/main b53a0571 · @hauska/atom-contract pinned by file: to vendor/hauska-atom-contract-1.6.0.tgz in artifacts/api-server, lib/engine-core, lib/knowledge-atoms, lib/portal-ui, and ^1.1.0 in lib/submission-classifier and scripts; vendor/ holds 1.2.0, 1.4.0, 1.5.0, 1.6.0 tarballs; 73 files import from @hauska/atom-contract; zero import from @empressaio/atom-contract · @empressaio/atom-contract 1.30.0 on npm with Track 2 types 2.1 to 2.12 · precedent: hauska-mcp-server dual-pinned @empressaio ^1.21.0 beside @hauska ^1.6.1 during its move
owner: property seat, a fresh lane (no sub-agents needed unless the codemod is fanned; then AGENT_CONTRACT section 1). Worktree registered ahead of creation: P:/seat-worktrees/property/legacy-design-tools-rename on seat/property-rename from origin/main, taken after the publish lane's LDT PR merges. Never the primary LDT worktree (P-85), legacy-design-tools-mcp (P-86), or legacy-design-tools-publish. Deploys planner-owned on the operator's go.
---

# WDLL: the LDT contract rename

Date: 2026-08-27  Status: closed  Operator approval: 2026-08-27  Closed: 2026-08-27

The atom contract was renamed to `@empressaio/atom-contract` on 2026-07-06 and has shipped sixteen minors since, the last eight of which carry the Track 2 types the Factory is built on. `legacy-design-tools` never moved: it still installs a vendored `@hauska/atom-contract` 1.6.0 tarball in four packages and pins `^1.1.0` in two more, across 73 import sites. Everything LDT serves, and the Factory's publish bakes that live in LDT, is therefore typed against a contract eight months of decisions old. This card moves LDT to the current package and retires the old name so it cannot come back.

## Done looks like

Every LDT package depends on `@empressaio/atom-contract ^1.30.0` and none on `@hauska/atom-contract`; the four tarballs are gone from `vendor/`; a CI check fails if the old name reappears in any manifest or import; the conformant bake CLIs and `serveGuards` are typed against the Track 2 types (`AbsenceVerdict`, `AccessPair`, `ProvenanceClass`, `Derivation`) so the walk rule `BP-CONFORMANT-01` grades on types rather than shape strings; typecheck, tests, and the schema-fixture drift check are green; cortex-api is redeployed by canary on the operator's go and the product-surface smoke passes.

## Acceptance items

1. **Inventory before any edit.** From `origin/main` after the publish lane's LDT PR: every import site (73 at the snapshot) by file, package, and imported symbol; every symbol classified as identical in 1.30.0, renamed, removed, or stricter; the six manifests; the four tarballs; anything that reads the tarball path at build time. Filed as CP1. No code before the table. | check: CP1 table with counts that sum to the grep | grade: [ ]

2. **Dual pin, no behaviour change.** One PR that adds `@empressaio/atom-contract ^1.30.0` beside the existing pin in all six manifests, changes no import, and is green on CI. This is the MCP server precedent and it proves the install path before any type moves. | check: PR merged on the conclusion string SUCCESS; `pnpm ls` shows both | grade: [ ]

3. **Migrate imports package by package.** For each of the six packages, one PR moves its imports to `@empressaio/atom-contract`: identical symbols by codemod; renamed symbols by their new name; removed or stricter symbols adapted at the call site to the 1.30.0 semantics and never by a local shim, an `any` cast, a widened check, or a fallback. Where 1.30.0 refuses a value 1.6.0 accepted, the call site refuses too and the refusal is a named test. Order: `lib/knowledge-atoms`, `lib/engine-core`, `lib/submission-classifier`, `scripts`, `lib/portal-ui`, `artifacts/api-server` last because it is the serving process. | check: six merged PRs; each green on typecheck, tests, and `test:fixture:drift`; refusal tests named | grade: [ ]

4. **The publish bakes and the serve guards type against Track 2.** `nodeFacetBakeTier1ConformantCli`, `nodeFacetBakeTier2ConformantCli`, and `serveGuards` import `AbsenceVerdict`, `AccessPair`, `ProvenanceClass`, and `Derivation` from the contract; `BP-CONFORMANT-01` in the walk checks the contract type, not a `shape` string; the two-field access check refuses an atom missing either field by the contract's own `parse`. | check: types imported; a fixture with a string-only verdict fails typecheck; the walk rule reads the type | grade: [ ]

5. **Retire the old name by decline.** Remove the `@hauska/atom-contract` pins and delete the four tarballs from `vendor/`; add a CI check that greps every `package.json` and every `.ts`, `.tsx`, `.mjs` for `@hauska/atom-contract` and fails on any hit; prove it by violation (a branch that re-adds one import must go red). | check: tarballs gone; CI check exists and was seen failing | grade: [ ]

6. **Deploy and smoke.** cortex-api built from the merged main and deployed by canary at zero traffic, smoked (`/api/healthz`, the county-ledger GET, facets for gold `48021:34137`), shifted on the operator's go, `node scripts/product-surface-smoke.mjs` run and its result filed whatever it is (the three pre-existing `envelope.sanity` fails are known). | check: revision by digest; smoke artifact | grade: [ ]

7. **Close.** `_inbox/2026-08-27_ldt-contract-rename_close.json` with the inventory, the six PRs, the symbol classification with its adaptations, the CI check, the serving revision, `leave_behind`. | check: artifact | grade: [ ]

8. **Out of this card.** Any change to the contract itself (substrate); the Factory repository; the atoms-store column migration for two-field access (F-10); P-85 and P-86 code paths beyond the import lines they contain. | check: pathspec | grade: [ ]

## Do not

- Write a shim, an `any` cast, or a fallback to make a 1.30.0 type accept a 1.6.0 value. The call site adapts or refuses.
- Change behaviour in the dual-pin PR.
- Delete the tarballs before the last import moves (repoint first, then retire).
- Merge on red typecheck, tests, or fixture drift.
- Touch the other three LDT worktrees or their branches.
- Deploy without the operator's go; the serving process is production.

## Amendments

- None yet.

## Finish card (graded at close)

| Item | Grade | Evidence |
| --- | --- | --- |
| 1 inventory | met | `_inbox/2026-08-27_ldt-contract-rename_cp1.json` |
| 2 dual pin | met | PR #504 merged; deviation: one PR not separate dual-pin merge (operator accepted) |
| 3 package migration | met | PR #504; deviation: one PR not six (operator accepted) |
| 4 Track 2 bakes | partial | `serveGuards` uses `parseAccessPair`; tier1 bake SQL still filters `conformant-v1` shape string |
| 5 retire by decline | met | Tarballs gone; `check-no-hauska-atom-contract.mjs` green in CI |
| 6 deploy + smoke | open | Planner-run on operator go |
| 7 close | met | `_inbox/2026-08-27_ldt-contract-rename_close.json` |
| 8 out of scope | met | Pathspec clean |

Merge: LDT #504 → main `532bddc3` (2026-08-27T23:56Z). CI CLEAN (operator verified).
