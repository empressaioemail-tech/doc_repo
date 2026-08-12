---
title: Adversarial review — 2026-08-12 gate-closure arc session capture
date: 2026-08-12
type: review
agent: doc_repo adversarial reviewer (claude code)
status: complete
verdict: ACCEPT_WITH_CORRECTIONS
---

# Adversarial review — gate-closure arc session capture

Target: `_sessions/2026-08-12_gate_closure_arc_claude_code.md`
Claims checked 27. Confirmed 21. Refuted 6. Verdict ACCEPT_WITH_CORRECTIONS.

## CP1 pre-registration and CP2 outcome

Before verifying I named three claims as most likely wrong.

The first was the absolute zero on `no-writer` / `no-atom`, because absolute-zero claims resting on a freshly rewritten derivation are the classic break. REFUTED as a prediction — it is real, and it survives the harder test. S1 introduced a third state, `derivation-indeterminate`, which is exactly where blanked cells could have hidden. Zero cells sit in it. The distribution is precisely `not-yet` 3,151 and `satisfied-present` 405, with `hasWriter` true and `atomFamilyState` present on all 3,556.

The second was the twelve-of-sixteen unreachable-families ratio, on the grounds that the planner has twice retired a ratio quoted without its counting rule. REFUTED as a prediction. `PROPERTY_ENTITY_TYPES` has exactly sixteen entries and the DID regex in `property-atom-chain.ts` alternates exactly four. The arithmetic is right, though the counting rule still is not stated.

The third was the styling centralisation, because the operator's red line depends on it and it was supported by a test count. REFUTED as a prediction, and the truth is stronger than the claim. `render.ts` carries an explicit `@internal` export block of roughly twenty-five shared drawing primitives, documented as shared sheet primitives for sibling assemblers, and both `dossier.ts` and `flood-drainage.ts` import from the same `template-tokens.ts`. The operator styling red line is safe.

The mandate warned that on this codebase the obvious suspect has repeatedly been the wrong one. That held completely. All three pre-registered suspects survived, and the real failures were in places I had not flagged: a defect misfiled as closed, two stale Open items, and citations that cannot be resolved as written.

## Live ledger at review time

Read twice, roughly ten minutes apart, both HTTP 200, byte-identical.

satisfiedCells 405. texasCompletenessPct 12.909486508370861. totalCells 3,556. totalRails 14. satisfiedPresentPartialCells 0. satisfiedAbsentCells 0.

Per rail: geometry 251, flood 114, cad 13, landuse 13, owner 13, zoning 1, and zero for easement, envelope, footprint, mud, rail-corridor, roads, rrc-pipelines and rrc-wells. The three geometry misses are 48129, 48135 at 5 percent, and 48201 Harris.

## What is wrong

**Defect 4 is still open and the document hides it.** This is the most serious finding. `mapSymnumToWellStatus` in `packages/engine-core/src/well-fact/symnum.ts` still ends in a bare `return "producing"` on hauska-engine origin/main. It was detected this session, not fixed. Because the capture lists eight defects and marks only the eighth as OPEN, a fresh agent reads the other seven as closed. The capture itself says this would mislabel Canceled and Abandoned Location wells across 1.4M records, and the session also staged a statewide RRC source of 1,396,049 wells, so the blast radius grew while the defect stayed open. The neighbouring `mapSymnumToWellType` has the identical bare `return "oil"` fallthrough and is not mentioned at all.

**PR #413 cannot be resolved as cited.** It does not exist in hauska-engine. It is legacy-design-tools#413, merged 2026-08-12. Every other PR in the document is hauska-engine, and no citation names its repo, so the list silently spans two repositories. An agent checking #413 against the engine gets a not-found and may conclude the capture invented it, which is the exact failure this review exists to catch.

**The A1 uncommitted-patches item in Open is already closed.** `_inbox/2026-08-12_A1P_owed_patches_pr_close.json` records PR #319 merged with CI success and four files recovered, not two. The stale item sits in the same `_inbox` as the artifact refuting it.

**The "do not reconcile" instruction is not supported.** The capture says lane A2 is mid-run and instructs the reader not to treat the 405-versus-423 gap as an error. The parcel-weighting half of that explanation is correct and I confirm it: `texasCompletenessPct` is parcel-weighted and binary per cell, so promoting high-parcel counties raises the headline while the raw cell count falls. But the ledger is not moving. Two reads ten minutes apart are byte-identical. The eighteen-cell delta is settled, therefore reconcilable, and it should be reconciled rail by rail. This session already had one silent 1,016-cell regression that read as ordinary variance; a standing instruction not to reconcile an unexplained cell drop is how the second one gets missed.

**"Parcel fabric 253/254" is not a ledger measure.** There is no parcel-fabric rail. The number 253 appears in the ledger as `railCapabilities['rail-corridor'].maxCountiesReachable`, sourced from `txgio_parcel DISTINCT county_fips` — a staging-table county count, presented in a table column where every other entry is a satisfied-cell count.

**The 1,778 baseline is unsourced.** The end state of zero is real. But the before-figure does not match any artifact. D3 records `ledgerBefore.noWriter` of 1,016 and attributes the blanking to 762 cells across three rails times 254 counties. 1,016 and 762 are different quantities and neither is 1,778.

## The instrument-verification trap, applied to this document

The mandate asked whether any claim is verified by something incapable of detecting its own falsity. One qualifies.

"Rails with writer and atom family: 14/14" is backed by the `railEngineBindingCoverage` CI test, and S1's own PR body states that test passes when a rail either binds an on-disk writer or *declares a `noWriterReason`*. A rail can satisfy the instrument by declaring that it has no writer. The live ledger cannot distinguish the two cases either, since `hasWriter` is true on all 3,556 cells. The two named declarers, easement and rrc-pipelines, both sit at zero satisfied cells. Whether 14/14 means fourteen writers or twelve writers plus two declared exemptions is the single most load-bearing ambiguity in the capture and it should be stated outright.

Separately, every session-start number — 0.7689 percent, 89 cells, geometry 141, fourteen atom types, eighteen partial cells, 11/14 rails — rests on planner self-report alone. The ledger endpoint serves only current state and there is no start-of-session dump in `_inbox`. The after column is exceptionally well evidenced and I verified all of it; the before column is unfalsifiable by construction, and every delta in the document inherits that. This is the largest epistemic weakness in the capture and it is invisible precisely because the after numbers are so solid.

## What a fresh agent would not know

Uncommitted work is live in three repositories and the capture mentions none of it. hauska-engine has three modified files plus an untracked `well-fact/fetch-wells-staged.ts`, which is plausibly the RRC statewide work the capture credits as landed. legacy-design-tools has roughly twenty modified files including `railCapabilityProbeCli.ts` and the buildableEnvelope road-setback set. doc_repo has twenty modified and thirty-plus untracked files. This is the same K5 loss class the capture flags for A1, live right now and unflagged.

Most consequentially, `_decisions/2026-08-11_texas_flush_launch_gate_amendment.md` is untracked. The capture treats it as the authority for the fourteen-item gate, so the definition of done is not under version control and is invisible to every other agent.

The rrc-wells capability row on the live ledger still reads Harris County mirror with `maxCountiesReachable` 1, contradicting the capture's claim that a statewide source replaced it. Either the probe was never rewired or the claim is premature; either way the console currently shows the pre-fix world. Twelve of fourteen rails have no capability probe defined at all, so reachability is unmeasured for most of the grid even though writer coverage reads 14/14.

Nothing states which lane holds the write slot or what A2 is actually applying, and the capture never explains why A1 applied fifteen counties but only thirteen cells cleared, with two counties holding atoms below threshold at 89.45 and 45.96 percent.

## Ambiguities to close

The Factory renumbering is the sharpest one. Three runbooks encoding the new reversed convention sit untracked in `90_runbooks/` while committed older docs use the opposite convention, and the reversal note lives only inside this uncommitted capture. Land the reversal as a dated decision record and put a supersession banner at the top of each runbook so the disambiguation travels with the artifact.

The Harris figure is defensible but will read as overstated. The F1 artifact stores it in a field named `harrisEstimateSecAfter`, though its note does confirm 1.222 ms per parcel measured on Harris centroids rather than the naive 242-second extrapolation. Phrase it as measured per-parcel and extrapolated to the county total.

The headline table mixes four denominators in one column and should carry a denominator column. And 12.909 percent is a measurement, not a burn-down: the remaining work is not homogeneous, since geometry is already at 251 of 254 while zoning, the moat, is at 1.

## Bottom line

The capture is substantially more accurate than this session's track record predicted. Every load-bearing end-state measurement I could check independently was correct, including the two that most needed to be. Criterion 3 is genuinely, structurally closed. The styling red line is genuinely safe.

The corrections that matter are narrow and fixable: reopen defect 4 and dispatch it, repo-qualify every PR, drop the closed A1 item, replace the do-not-reconcile instruction with an actual rail-by-rail attribution of the eighteen cells, label the parcel-fabric row as a staging count, resolve whether 14/14 includes declared exemptions, and commit the gate amendment. Correct the document; do not rewrite it.
