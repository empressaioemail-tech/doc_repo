---
title: "CANON CORRECTION — propagating the ldt-is-the-factory ruling into repo_intents"
date: 2026-08-08
status: active
type: execution-summary
owner: planner
last_updated: 2026-08-08
related: [_decisions/2026-08-08_ldt_is_the_factory_repo, _decisions/2026-07-04_ldt_decomposition_retirement_path, _catalog/repo_intents, _inbox/2026-08-08_SURVEY_ldt_decomposition_state]
---

# Canon correction summary

Execution record for the doc-correction pass authorized 2026-08-08, propagating `_decisions/2026-08-08_ldt_is_the_factory_repo.md` into the canon. Two files changed. Nothing committed; the master planner commits.

Authority: `_decisions/2026-08-08_ldt_is_the_factory_repo.md`. Evidence: `_inbox/2026-08-08_SURVEY_ldt_decomposition_state.md`, `_inbox/2026-08-08_SURVEY_mcp_contract_dual_pin.md`, `_inbox/2026-08-08_SURVEY_hauska_map_contract_usage.md`. The three survey artifacts were not touched.

## Files changed

1. `_catalog/repo_intents.md` (five edits, `last_updated` bumped 2026-07-04 to 2026-08-08)
2. `_decisions/2026-07-04_ldt_decomposition_retirement_path.md` (amendment block appended, frontmatter status flipped)

## Independent verification performed

Every version claim written into the canon was re-verified live rather than copied from the surveys.

```
$ npm view @empressaio/atom-contract version
1.12.0
$ npm view @hauska/atom-contract dist-tags
{ latest: '1.6.1' }
```

Component-package rename status, `npm view <pkg> version`:

```
@empressaio/cortex-tiles         0.1.12
@empressaio/cortex-client        0.1.3
@empressaio/design-tokens        0.1.0
@empressaio/document-viewer      0.1.0
@empressaio/tile-shell           0.2.0
@hauska/map-renderer             0.1.5
@empressaio/map-renderer         NOT PUBLISHED
```

hauska-engine contract pins, `grep -rn 'atom-contract' package.json packages/*/package.json` in `P:\hauska-engine`: `@empressaio/atom-contract@^1.12.0` across engine-core, atoms, og-sources, og-title, retrieval, storage, workspace, plus the `@hauska-engine/atom-contract-pin` shim whose own description reads "Do not depend on legacy @hauska/atom-contract."

hauska-map contract pin, `P:\hauska-map/package.json:15`: `"@hauska/atom-contract": "^1.5.0"`.

## Edit 1 — repo_intents frontmatter

OLD:

```
last_updated: 2026-07-04
applies_to: portfolio
related: [00c_portfolio_master_map, _decisions/2026-07-04_branding_canon_hauska_substrate_only, _decisions/2026-07-04_ldt_decomposition_retirement_path, _decisions/2026-07-04_master_map_and_console_unification, _decisions/2026-07-04_convergence_program_execution_model, _architecture_homes/00_overview]
```

NEW:

```
last_updated: 2026-08-08
applies_to: portfolio
related: [00c_portfolio_master_map, _decisions/2026-07-04_branding_canon_hauska_substrate_only, _decisions/2026-07-04_ldt_decomposition_retirement_path, _decisions/2026-08-08_ldt_is_the_factory_repo, _decisions/2026-07-04_master_map_and_console_unification, _decisions/2026-07-04_convergence_program_execution_model, _architecture_homes/00_overview, _inbox/2026-08-08_SURVEY_ldt_decomposition_state]
```

## Edit 2 — the governance lesson (new section, permanent home)

Placed in the `_catalog/repo_intents.md` preamble, immediately after the ground-truth statement and before the branding canon. This is the correct home over `01_doc_conventions.md` or `CLAUDE.md` for three reasons: repo_intents is the doc that actually decayed, it is the doc CLAUDE.md already instructs agents to read before planning repo work, and the lesson is about repo-intent divergence specifically rather than about doc formatting or operating posture. A reader who needs the lesson is already in this file.

No old text (net-new section). NEW, verbatim:

> ## The governance lesson (recorded 2026-08-08)
>
> **A canon nobody is forced to read, and whose violation nothing detects, decays into fiction at the speed of the work.**
>
> This doc is the evidence for its own rule. For roughly a month it described a legacy-design-tools that no longer existed: declared retiring on three clocks while the county-manifest factory, the statewide boundary layer, and the CAD ingest rail were all built inside it. On 2026-08-08 the master planner dispatched ten new database tables into that declared-retiring repo without checking this file first. Nobody noticed the divergence until a survey went looking.
>
> That is a governance failure, not a legacy-design-tools failure. Two mechanisms are required work, and until they exist this doc will decay again:
>
> 1. Something must FORCE a read of the relevant intent row before a dispatch lands in a repo.
> 2. Something must DETECT divergence after the fact, so a violated clock surfaces in days rather than a month.
>
> Corollaries that follow from the same failure. A retirement clock that is violated for a month is not a plan, it is a fiction with a date on it, and it must be either enforced or withdrawn by explicit ruling. Freezing a repo's code does not remove its surface: clock 1 honored its zero-new-work freeze perfectly and the frozen SPA still answers HTTP 200 in production, because the freeze was written against commits and the surface lives in the Dockerfile. And an intent doc that has no bucket for the most active package in a repo is stale rather than wrong; the honest response is to classify the new unit, not to leave it unnamed.
>
> See `_decisions/2026-08-08_ldt_is_the_factory_repo.md`.

## Edit 3 — branding canon, atom-contract correction

OLD (final clause of the branding-canon paragraph):

> The six component-library packages published under `@hauska/*` (design-tokens, tile-shell, document-viewer, cortex-client, cortex-tiles, map-renderer) rename to `@empressaio/*` during Phase 3; `@hauska/atom-contract` and the SDK keep the Hauska scope.

NEW: the clause now ends at "during Phase 3." (the false "keeps the Hauska scope" claim removed), followed by a verified rename-status paragraph and a new subsection. The subsection records: `@empressaio/atom-contract@1.12.0` is the live contract with hauska-engine current on `^1.12.0`; `@hauska/atom-contract` is RETIRED and frozen at 1.6.1 and never received the property atom family (starts 1.8.0); the two names form a non-overlapping sequence so the rename was a continuation not a fork; and the three stale-pin consumers are enumerated (ldt six packages, four vendoring a 1.6.0 `.tgz` and two on `^1.1.0` resolving to 1.6.1; hauska-map on `^1.5.0`; hauska-mcp-server dual-pinning both with disjoint symbol sets and byte-identical shared modules, therefore debt not defect).

The vendoring rationale is recorded verbatim from commit `0ecb8abb` (2026-05-26): "Ship hauska-atom-contract-1.2.0.tgz under vendor/ so pnpm frozen-lockfile install works without npm publish." The section states plainly that the contract is published and the constraint is obsolete, and that all six consumers are clock 3 so the migration serves code that is staying.

The rename-status paragraph also records a finding the canon did not have: five of the six component packages have renamed, but `map-renderer` has not. It is still `@hauska/map-renderer@0.1.5` and `@empressaio/map-renderer` does not exist on npm.

## Edit 4 — spine table, hauska-atom-contract row

OLD:

> | hauska-atom-contract | The commercial substrate contract (ADR-018), most load-bearing package. | Language-neutral spec + conformance validator published as an open standard (Phase 1); O&G ontology lands as 1.7.0 AFTER the 1.5.0-source-commit + 1.6.0-publish cleanup. | Root publish-script clutter, stray tgz, drizzle-orm as a hard dep (move to peer). npm lags git: 1.5.0 on npm, 1.6.0 committed-unpublished. |

NEW:

> | hauska-atom-contract (repo name; publishes as `@empressaio/atom-contract`) | The commercial substrate contract (ADR-018), most load-bearing package. | Language-neutral spec + conformance validator published as an open standard (Phase 1). | Root publish-script clutter, stray tgz, drizzle-orm as a hard dep (move to peer). **Version line corrected 2026-08-08:** live at `@empressaio/atom-contract@1.12.0` on npm; the 1.7.0 O&G target and the "npm lags git at 1.5.0" note are both long superseded. The retired `@hauska/atom-contract` is frozen at 1.6.1 and never received the property family (starts 1.8.0). See the atom-contract section above for the three repos still on the retired name. |

## Edit 5 — the legacy-design-tools row (line 32)

OLD, verbatim:

> | legacy-design-tools | The everything-repo: cortex-api + Cortex workspace + plan review + Property Brief backend + Radar BFF + published component packages. Originally a monorepo split conceptually into cortex console + cortex architecture surfaces. THE biggest entanglement. | Retire via decomposition on three clocks: (1) root design-tools SPA declared legacy NOW, zero new work, function-inventory gates removal; (2) Cortex console (codex-reviewer-qa + packages) extracts to its OWN repo in Phase 3, Empressa-branded (planner names it); (3) cortex-api + lib packages run in place, shrink by absorption (spine takes adapters, tenancy lands, Radar BFF extracts), retire only when empty. | map-embed, codewarm (zero consumers), legacy $5-wallet top-up route, Regrid remnants (incl. the false runtime message in cotalityClient.ts:179), mock-LLM default in briefing-engine. See `_decisions/2026-07-04_ldt_decomposition_retirement_path.md`. |

NEW: rewritten across all three columns.

**IS** now leads with "THE FACTORY AND ACQUISITION REPO (ruled 2026-08-08)" and names what actually landed: the county-manifest factory, the statewide boundary layer, and the CAD/TxGIO ingest rail. Closes with the ruling's own framing, "The spine got the contract; ldt got the factory."

**GOING** now leads "NOT RETIRING." Clock 3 is recorded as renamed to the factory and acquisition home, receiving new work by design, with "retire when empty" WITHDRAWN and no exception needed for new work. Clocks 1 and 2 are named as the only retiring parts, each with its real status: clock 1 frozen at the commit level but still served in production (four SPAs in the Dockerfile; cortex-api root returns `<title>Cortex — Design Accelerator</title>` at HTTP 200, verified 2026-08-08), with removing the served surface named as the actual task; clock 2 VIOLATED with 23 post-decision commits, nine feature commits, latest 2026-07-18, cortex-tiles 0.1.1 to 0.1.12, and the `@hauska` to `@empressaio` rename landing inside ldt rather than in an extracted repo, closing with "a clock violated for a month is not a plan." The unclassified units are added as a named bucket: `cad-ingest` (new acquisition package created in ldt during the retirement window, seven CLIs, now the most active ingest package), `plan-review`, `qa`, `mockup-sandbox`, and two Python sidecars (`hydrology-worker`, `tile-pipeline`), with the note that the image serves FOUR SPAs where the canon assumed two.

**DIES** now opens "Death list, verified 2026-08-08: only 1 of 5 resolved." Records the one resolution (mock-LLM default in briefing-engine now fails loud) and the four survivors with current locations: `map-embed` and `codewarm` both zero-consumer, codewarm additionally shipping a committed `dist/`; the $5 wallet top-up route still a MOUNTED POST handler in a deployed service at `artifacts/api-server/src/routes/brokerageWalletRoute.ts:48`; and the false Regrid message unchanged but relocated to `lib/adapters/src/national/cotalityClient.ts:179`, quoted verbatim as "Regrid remains the active national parcel/zoning provider" and flagged wrong twice over (Regrid purged 2026-06-17, Cotality extinguished). Adds the two surviving Regrid surfaces the old row did not name: `regrid.ts` still exported at `lib/adapters/package.json:22`, and `place-layer-regrid` baked into an atom shape at `artifacts/api-server/src/atoms/property-workspace.atom.ts`. Adds newly-identified dead weight: three unreferenced vendored tarballs (1.2.0, 1.4.0, 1.5.0) and the stale `api-server` Cloud Run service untouched since 2026-05-06. Points at the atom-contract section for the six packages on the retired contract name.

## Edit 6 — amendment to the 2026-07-04 decision record

Frontmatter, OLD:

```
status: active
related_canonical: [56_engine_extraction_sprint.md, 54_tenant_leg_sprint.md, 80_adrs/adr_024_shared_surface_package_architecture.md, 41_revit_connector.md]
```

NEW:

```
status: amended
amended_by: 2026-08-08_ldt_is_the_factory_repo
related_canonical: [56_engine_extraction_sprint.md, 54_tenant_leg_sprint.md, 80_adrs/adr_024_shared_surface_package_architecture.md, 41_revit_connector.md, _catalog/repo_intents.md]
```

Body: nothing deleted or rewritten. An amendment block was appended below the existing `## Counterparties` section, matching the style of `_decisions/2026-08-08_multipolygon_fail_closed_and_the_real_fix.md` (horizontal rule, `# AMENDMENT <date> — <what changed>` heading, then what held / what did not / what changes). Structure:

- **What held.** Clock 1's commit-level freeze (the one clean survey result); the spine extraction the decision was sequenced behind; the risk-profile analysis, whose error was assuming all three pieces ended in retirement rather than separating them.
- **What did not hold.** Zero of three absorptions complete, each with its evidence (adapters 145 touches and nothing moved; no tenants table across 73 migrations, only placeholder columns defaulting to `"default"`; Radar BFF blocked by the tenancy that did not land, sixteen route files still in place). Clock 3 grew instead of shrinking (902 file touches, 94 route files, ten tables in migrations 0068-0072 on 2026-08-08, all enumerated). Clock 2 violated. Clock 1's freeze did not achieve what the freeze was for, because it was written against commits while the surface lives in the Dockerfile. The three-clock model no longer covers six units.
- **What changes.** Clock 3 withdrawn as a retirement path and re-scoped as the factory and acquisition home. Clocks 1 and 2 stand as the only retiring parts, with clock 1's real task restated as removing the served surface and clock 2 requiring an explicit extract-or-withdraw ruling.
- **What is unchanged.** Reversal criteria still apply to clocks 1 and 2; the captured-elsewhere checklist remains the safety mechanism; the legacy-revit-sensor repoint still rides on it; the Phase 3 dependency stands until clock 2 is ruled on.
- **Governance note.** Records why the record is amended rather than rewritten: so the divergence stays auditable.

## Stale rows FLAGGED, not changed

Per instruction these were verified but left alone for the master planner to rule on. Each is a row in `_catalog/repo_intents.md` whose description no longer matches what I could verify on 2026-08-08.

**1. hauska-map, GOING column — the console unification appears already done, and the row still describes it as pending.** The row reads "ONE unified spine command center (merge the root vanilla console + apps/command-center)" and the DIES column says "The losing console (pick apps/command-center; freeze the root vanilla one)." Verified at `P:\hauska-map` commit `83553f6`: there is no root `src/` directory. The root carries `apps/`, `packages/`, `api/`, and config only. Both surviving apps are separate deployed Vercel projects (`cmdcenter` at `prj_M9jNh8nBEHW0CnaUKlNT4pp4ebpe`, `property-explorer` at `prj_vcZGXbqdffk5C20WzaplEpzFynK3`). The root vanilla console was not merely frozen; it appears gone. Recommendation: confirm removal versus relocation, then flip both clauses to done.

**2. hauska-map, IS column — the map-renderer rename is stated as Phase 3 future work but is the ONLY component package that has not renamed.** The row reads "`@hauska/map-renderer` (renames @empressaio in Phase 3)." Verified: `@hauska/map-renderer@0.1.5` is published; `@empressaio/map-renderer` does not exist on npm; the other five component packages already renamed. This is not wrong, but it is now the lone straggler in a rename otherwise complete, which the row does not convey. Recommendation: mark it as the last outstanding rename rather than as one of six pending.

**3. hauska-engine, DIES column — "Regrid adapter" is resolved; the row should flip, and Cotality should probably replace it.** Verified at `P:\hauska-engine`: `packages/adapters/src/national/` contains only `cotality.ts`, `cotalityClient.ts`, `cotalityExtended.ts`. There is no `regrid.ts`. The only surviving reference is a historical comment at `packages/adapters/src/registry.ts:130` ("The former Regrid national baseline"). The Regrid purge succeeded in the engine even though it failed in ldt. The larger flag: three Cotality adapters remain live in the engine, and Cotality is extinguished per standing decision, so the death list arguably should now name Cotality where it named Regrid. I did not change this because retiring Cotality from the engine is a routing decision, not a doc correction.

**4. hauska-engine, DIES column — `pipeline-runner` no longer exists.** The row reads "pipeline-runner + packages/workspace are complete-looking with zero callers → mark DEFERRED, revisit Phase 2." Verified: `packages/` contains adapters, atom-contract-pin, atoms, capture, corpus, document-ingest, engine-core, identity, og-sources, og-title, retrieval, storage, workspace. There is no `pipeline-runner`. `packages/workspace` does still exist and still pins the contract at `^1.12.0`. Half this clause is resolved and half stands. Recommendation: drop `pipeline-runner`, keep the `workspace` deferral or re-rule on it.

**5. hauska-engine, DIES column — "atom-contract-pin shim" is named as dying but has been repurposed.** The row lists the shim as death-list. It still exists at `packages/atom-contract-pin/`, but its own `package.json` description now reads "Engine-side re-export shim over @empressaio/atom-contract (branding canon). Do not depend on legacy @hauska/atom-contract." It is enforcing the branding canon the doc set wants enforced. It may now be load-bearing rather than dying. Recommendation: re-rule; do not remove on the strength of the old row.

**6. radar and icc-demo rows — descriptions verified accurate, no action.** Recorded here only to close the sweep. `P:\radar` is 3 tracked files, last commit `d9ff722` 2026-06-22, "Initial scaffold" — matches "a 4-file extraction-design placeholder ... No code. Leave parked" within a file of the stated count. `P:\icc-demo` is 7 tracked files, last commit `547b774` 2026-06-22, a demo script — matches "docs-only authoritative record."

**7. Rows I could NOT verify and did not touch.** hauska-sdk (no local clone at `P:\hauska-sdk`; the CNS-era-naming and unpublished-sprint-53 claims are unchecked). hauska-mcp-server (the "May-era README + stale capability matrix" and the PR #32/#33 claims were out of scope for this pass; note the dual-pin survey found a separate unrecorded issue, that `.github/workflows/ci.yml` runs `npm install` rather than `npm ci` and so CI can resolve different versions than Docker ships). smartcity-os (ABSOLUTE NO-TOUCH; not inspected). AEC-cortex, mox_demo, slb_prototype, empressa-trading, hauska-platform, legacy-revit-sensor (parked or out-of-scope rows; not inspected).

## Constraints observed

No commits, no pushes. No code repo touched; all reads against `P:\hauska-engine`, `P:\hauska-map`, `P:\radar`, `P:\icc-demo` were read-only inspections of working trees plus `npm view`. No migrations, no DB writes. No agents spawned. No new canonical docs created; this summary lives in `_inbox/` as an execution artifact. The three `_inbox/2026-08-08_SURVEY_*` files were read but not modified. Both edited files verified UTF-8 without BOM via `file`. Em and en dashes were kept out of new body prose; the surviving instances in edited lines are the verbatim brand string `<title>Cortex — Design Accelerator</title>` and pre-existing text not in scope.
