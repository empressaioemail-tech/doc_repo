# The smooth path — one check per class, at the earliest stage that can catch it

Stages are the OPS-24 thirteen (`90_operations/OPS-24_county_to_serving_program.md`) as refined by the farm-pipeline table in `_inbox/2026-09-16_farm_architecture_draft.md` section 5: 0 Recon/places, 1 Manifest, 2 Pre-bake audit, 3 Acquire, 4 Identity, 5 Instantiate, 6 Rail fill, 6b Depth, 7 Atoms, 8 Completeness, 9 Gate, 10 Publish, 11 Customer probe and meter, 12 Merge. Each check below answers ENFORCEMENT's own three-question gate plus its fourth (bypass) question, because a control that cannot answer all four is not a control (ENFORCEMENT.md, "The three question gate").

Every check names a real file, hook, or script where one exists today; where none exists, that is stated as the gap, not papered over.

## Stage 0 — Recon and places

**Check R0-1 (classes C18, C3).** Every hand-declared registry (`_catalog/texas_roster_v1.json`, `_catalog/tx_cad_source_registry.json`, `_catalog/tx_source_truth.json`, LDT's `zoning-layers.ts`, hauska-engine's `resolve-declared-cad-vintage.ts`) ships with a scheduled divergence test against its own live source, not bolted on after the fact.
- **What executes it:** a new script, `scripts/registry-divergence.mjs`, one per registry, following the pattern `scripts/tx-source-truth.mjs` already uses for the CAD-source registry.
- **What triggers it:** a cron (daily) plus every recon/acquire run for a county the registry claims to cover.
- **What fails:** the registry's claimed status (`verified-live`, `LAYER-FOUND`, `NOT-FOUND-UNKNOWN-WHY`) disagreeing with a fresh live probe of the same source. This is not hypothetical — BLK-060 already found 12 of 23 Burnet-class cities where the roster's own status field disagreed with its own verification fields on the SAME row.
- **What bypasses it:** any code path that reads the registry field directly without calling through the divergence-tested reader (today, this is every consumer — the reader itself does not exist yet, per BLK-060/BLK-175/BLK-186).

## Stage 2 — Pre-bake audit (P-188, this very row's own successor)

**Check P2-1 (class C16, governance gaming).** An audit instrument's own formula (a cost model, a threshold, a hard-kill) is version-controlled and any change to it requires the same review a code change gets.
- **What executes it:** a CI check on the audit-instrument repo path (wherever `tx-cad-source-inventory.mjs`-class scripts and their cost/threshold constants live) requiring a named reviewer sign-off, distinct from a normal merge.
- **What triggers it:** any diff touching a declared threshold or cost-model constant.
- **What fails:** a merge that changes a hard-kill's own formula with no accompanying change to the real-world condition it measures (BLK-070: Bell's cost gate was cleared by deleting the exact cost term the operation actually incurs).
- **What bypasses it:** a change routed through a different file that the same constant is re-exported from (the standard "signature default survives its own removal" bypass ENFORCEMENT names generally).

**Check P2-2 (class C5, falsifier-3 target).** Every `_decisions/` ruling that requires a new state, verdict member, or type value carries that requirement in a machine-readable form, and a CI job checks the requirement is actually expressible and actually implemented before the ruling can be marked closed.
- **What executes it:** a new script, `scripts/ruling-implementation-check.mjs`. Concretely: every decision file gets a frontmatter field `requires_implementation: [{type: "LayerAbsenceVerdict", member: "refused"}, {function: "verdictLayerServe.ts:convertUnmeasuredToRefused"}]`. The script (a) parses every such frontmatter block across `_decisions/`, (b) for each named type, statically checks (via `ts-morph` or a `tsc --listFiles`-driven AST walk) whether the named member exists in the type's declaration, and (c) for each named function, checks it exists and is reachable from at least one call site that is itself reachable from a serve route (not merely defined and uncalled — this closes the "exported detector nothing calls" bypass class 9 shares with class 5).
- **What triggers it:** any commit touching `_decisions/**`, and any commit touching a type file referenced by an existing decision's `requires_implementation` block (so a later refactor that silently drops a required member is caught, not only the original ruling).
- **What fails:** the exact 2026-09-01 instance this register found twice (BLK-005 and BLK-039's underlying type gap) — `LayerAbsenceVerdict` lacking a `refused` member the ruling required would fail this check the day the ruling was filed, not months later when CI happened to notice. Self-test fixtures (both directions, per ENFORCEMENT's "verify by violation"): a fixture decision naming a type member that does NOT exist must fail; a fixture decision naming one that does exist and IS reachable from a serve route must pass; a fixture naming a function that exists but has zero live call sites must fail (closing the dormant/starved variant).
- **What bypasses it:** a decision filed with no `requires_implementation` frontmatter at all. This is a real, named residual gap — the check cannot force every future decision-writer to use the field. The mitigation is a second, cheap check: any decision file whose prose contains the words "must", "required", or "is not implemented" and carries no `requires_implementation` block gets flagged for human review at the next OPS-16 amendment pass, never silently skipped.

This is not "the planner remembers" (falsifier 3's own bar): it is a script with a defined trigger, a defined failure condition, self-test fixtures in both directions, and a named residual bypass — exactly the shape ENFORCEMENT's own four-question gate asks for.

**Check P2-3 (class C4/C9, the empty-county gate itself, BLK-017/018).** `evaluateRailGate` and `evaluatePopulation` are tested against a literal empty-county fixture before P-188 may pass GREEN on any real county.
- **What executes it:** the existing proposed fix from `_inbox/2026-09-13_dead_controls_ranked_fixes.md` entries 1 and 2 (give the gate the program-wide declared-ahead set explicitly; make `EMPTY_DENOMINATOR` an unmeasured verdict, never a pass), landed and unit-tested.
- **What triggers it:** every pre-bake audit run, and a standing CI test in `hauska-factory`.
- **What fails:** a completely empty county (Burnet before stage 3 runs) reading a passing gate verdict. This is the single most load-bearing check in the whole smooth path — it is P-195, and OPS-24 itself already names it "sequenced first, ahead of everything," but as of 2026-09-16 it is still unbuilt (confirmed three separate times: 2026-09-13 designed, 2026-09-14 independently re-traced as not landed, 2026-09-16 program scope document still lists it as the live defect a farm run today would inherit).
- **What bypasses it:** any writer that calls the atoms/cell-write path directly without going through `evaluateRailGate`/`evaluatePopulation` first — not currently enumerated anywhere in this register; a call-site audit is owed.

## Stage 3 — Acquire

**Check A3-1 (class C1, punctuation-only input).** Every acquired source field that will become a display or join key (situs address, owner name, legal description) is checked against a sentinel/punctuation-only pattern before a single row is written, and a row failing the check is written as `unaccounted` with the raw value preserved for audit, never silently skipped.
- **What executes it:** a shared validator function called from every county-level acquire/instantiate writer (today, LDT's `p78Merge.ts` and the conformant bake CLIs each do this differently or not at all — this is itself an instance of class 4, a rule that needs one implementation, not several).
- **What triggers it:** every acquire run, every county.
- **What fails:** a fixture row whose situs is exactly `", ,"` or a bare house number with no street (the two live patterns already found, BLK-001 and BLK-169) must be flagged, never silently pass through as populated.
- **What bypasses it:** any writer that reads the raw source table directly instead of through the shared validator — the same bypass class 4 always has, and the reason this check and check A3-2 below (a row-count reconciliation) are paired rather than relying on either alone.

**Check A3-2 (class C3, C11, the Burnet-specific finding).** A row-count reconciliation runs immediately after every geometry/CAD-roll acquire step and refuses to proceed to identity (stage 4) on an unexplained mismatch above a declared tolerance.
- **What executes it:** a generalization of the completeness check (P-194) run early, not only at stage 8 — the same instrument, called twice.
- **What triggers it:** every acquire completion.
- **What fails:** Burnet's own live number today — 59,785 parcels on production against 50,138 geometry-ingest features, a mismatch the program's own scope document says "nobody reconciled" as of 2026-09-16. Under this check, Burnet could not proceed past stage 3 until that gap is explained (a multi-feature-per-account pattern, a truncation, or a genuine roll/geometry vintage mismatch — all three are live hypotheses this register found elsewhere in other counties, e.g. BLK-036 Travis, BLK-249 Harris).
- **What bypasses it:** a manual `--skip-reconciliation` flag, if one is ever added for operator convenience — named here explicitly so it is never added silently.

## Stage 4 — Identity

**Check I4-1 (class C6, sub-metre digitisation mismatch).** Any spatial join between two independently-digitised polygon layers for the same county uses a declared-tolerance buffered predicate, never a strict containment/intersects test, with the tolerance and its justification recorded on the join.
- **What executes it:** a shared spatial-join helper (today, at least the school-district/county-boundary join in the CTX bake and the zoning-stamp vertex-sweep in LDT independently reimplement this).
- **What triggers it:** any join combining two layers with different `source_vintage`/digitisation lineage for the same county.
- **What fails:** the exact live fixture already on file, Bastrop parcel `11585` (25.5m from its own county's ring, 0.79m from the correct district) — a strict-containment version of this check must fail on that fixture, and the buffered version must pass it, before the check ships.
- **What bypasses it:** any ad hoc `ST_Intersects`/`ST_Contains` call written directly in a bake CLI instead of through the shared helper.

**Check I4-2 (class C11, identity collisions — the largest class by unfixed count after C9/C7).** Every join across two identifier namespaces (TxGIO prop_id vs CAD account id; two tax-year rolls for the same prop_id; a bare number shared across counties) is proven one-to-one before being trusted, generalizing the H1 instrument (`hays-identity-reconciliation.mjs`) that already exists and is already county-generic per the OPS-24 teardown's own finding.
- **What executes it:** H1, generalized and run for every county at stage 4, not only Hays and Williamson.
- **What triggers it:** every county's identity stage.
- **What fails:** a join whose collapse-rate is nonzero — the fixture is Williamson's own 282,569-phantom-node measurement (BLK-068), already known, never re-run against Burnet, Bell, or Milam.
- **What bypasses it:** a downstream writer joining on the raw column directly instead of through the crosswalk H1 produces — this is exactly the mechanism of the Hays Sturgeon/Mesa Verde collision (BLK-067), where five real accounts were joined on a bare number that H1-class reconciliation exists specifically to catch, but the served route did not consume its output.

## Stage 6 — Rail fill

**Check RF6-1 (class C8, false earned states — the second-largest class by unfixed count).** A write may only emit an *earned* absence state (`absent-verified`, `not-applicable`) when the write path can name what it queried and what it found nothing of; a write with no query performed (no corpus table, no matcher run, no geometry to check) must emit `unaccounted`, never an earned state.
- **What executes it:** a required `queriedSource` field on every earned-absence write, checked by a linter/CI rule that rejects a write-path diff introducing an earned-absence branch with no corresponding query call in the same branch.
- **What triggers it:** every PR touching a rail writer.
- **What fails:** the exact three failure modes dead-controls already names (no corpus table for a city, a district matcher miss, absent geometry) writing `absent-verified` today — this check, run against the 2026-09-16 measured population, would have caught all 219,472 of the false setback absences (BLK-024) before they ever reached a gate.
- **What bypasses it:** a write path that fabricates a `queriedSource` value without actually calling the query (a "the field exists but is presence-shaped, not meaning-shaped" bypass) — closed by requiring the linter to trace the field to an actual function call, not merely a string literal.

**Check RF6-2 (class C9, lease-less writers — a live, currently-unfixed instance directly threatening Burnet).** Every writer calling a batch-atom-write function is unit-tested to assert it holds a lease at the moment of the call, with a fixture that calls the function without a lease and asserts the call throws.
- **What executes it:** OPS-21's own proposed S3 non-vacuity guard, already named, not yet built as of 2026-09-16.
- **What triggers it:** CI, on every commit to any of the six lease-less writers (owner, land-use, flood-hazard, rail-corridor, RRC-pipeline, special-district).
- **What fails:** exactly the current state of all six writers (BLK-019/104) — they would fail this test today, which is precisely the point; the check should be red now and turn green only when the fix lands, not the reverse.
- **What bypasses it:** a writer that acquires *a* lease but not the *correct, scoped* one (county+entity-type) — the fixture set needs a second case asserting the lease's scope matches the write's scope, not merely that some lease object is non-null.

## Stage 8 — Completeness

**Check C8-1 (class C13, serial discovery — replaces the sampled walk as the primary discovery tool).** A full-population census, not a sample, grades every required leaf/rail against the bake's own declared manifest for every row in the store, generalizing the third-party review's Stage B3 proposal and the 2026-09-16 `six-county-completeness.mjs` instrument (already built and self-tested, 11/11 checks, per that document).
- **What executes it:** `six-county-completeness.mjs`, generalized to take any county (not hardcoded to six) — named explicitly as owed work in the 2026-09-16 program scope document's own probe-leg list.
- **What triggers it:** every completeness stage, and on a schedule against production.
- **What fails:** any required leaf null/sentinel/mismatched-tier on ANY row, not merely the sampled 180; the census must be shown to fail where the old sampled walk passed (the falsifier the third-party review itself names: "if it passes a store the walk fails, it is wrong").
- **What bypasses it:** a rail added to the bake's manifest but never added to the census's required-leaf list — the same class-4 shape one level up; closed by deriving the census's required list FROM the bake's own manifest constant at the pinned SHA, never from a hand-copied mirror (this is the exact fix the third-party review specifies for its own proposed instrument).

## Stage 9 — Gate

**Check G9-1 (class C2, ceiling measured by one instrument enforced by another — DEV_PROCESS's own paired-control rule).** Every pair of functions implementing what is meant to be one rule (the factory `.js` and engine `.ts` copies of `evaluateRailGate`; the two setback-table registries; the two edge labellers) carries an explicit divergence test, not two careful hand-edits.
- **What executes it:** a divergence-test harness that runs both implementations against the same fixture set and asserts identical output.
- **What triggers it:** CI, on any commit to either half of a named pair.
- **What fails:** the two `evaluateRailGate` copies (dead-controls entry 1's own open question — "settle which [is authoritative] before editing, and if they are independent add the divergence test") returning different verdicts on the same input.
- **What bypasses it:** a third, undiscovered copy of the same rule — the only defense against this is the periodic full-repo grep for duplicate-logic patterns this register itself had to do by hand to find these pairs; no automated version of that grep exists yet.

## Stage 10 — Publish

**Check P10-1 (class C10, stale copies overriding current data — the class with the single largest measured population, 490,185 atoms).** OPS-24's own stage-10 predicate — "record-path payloads carry the cells' own vintage, not the old snapshot's" — is implemented as a field-level assertion at serve time: any served value whose backing atom's `bakedAt`/`snapshotAt` predates the ledger cell's own `updatedAt` by more than a declared window fails closed rather than serving the stale value silently.
- **What executes it:** a serve-layer assertion in the retrieval-api's one ruled reader (per the 2026-09-11 ledger-as-serving-path ruling), checked against every cell-atom pointer pair.
- **What triggers it:** every serve request, or a batch audit run per publish.
- **What fails:** the exact F25 pattern (BLK-007/BLK-266) — a value right, a label from an old bake — and the 490,185-atom envelope population (BLK-264), which is the largest single instance of this class found anywhere in this register.
- **What bypasses it:** any surface still reading the tier-1 bake (`place_layer_snapshots`) directly instead of through the ruled reader — named explicitly as a live, unretired parallel read path by the OPS-21 "94 cutovers, none verified retired" finding (BLK-039).

**Check P10-2 (class C12, merged-but-not-deployed).** No close may state a code fix as "deployed" or "live" without a field-name read of the serving revision's digest, matched against the merge SHA, attached to the close.
- **What executes it:** `probe-close-gate.mjs`'s pattern, generalized: the existing gate already refuses a close with no cited probe artifact for certain row ranges; extend the same mechanism to require a digest-match artifact for any close claiming "deployed."
- **What triggers it:** any close.
- **What fails:** exactly the wave-6 pin-merge-vs-pin-deploy incident (BLK-074) and the cortex-api second-shift near-miss (BLK-079) — both were caught by hand in this program; this check makes the catch structural.
- **What bypasses it:** a close that avoids the word "deployed" and says only "merged" — closed by requiring the SAME check on any close whose leave_behind or missionPremise implies the fix reached a customer, not only on the literal string "deployed."

## Stage 11 — Customer probe and meter

**Check PR11-1 (class C4/C9, the OPS-24 probe's own zero-predicate gap, BLK-061).** `probe-close-gate.mjs`'s gated-row regex is generated from the current OPS-16/OPS-24 row registry, never a hand-typed range, so a newly-allocated row range is covered automatically.
- **What executes it:** the gate's regex construction reads `_catalog/plan_registry.json` (already built per BLK-212) at run time instead of embedding a literal range in source.
- **What triggers it:** every close, for every row.
- **What fails:** the exact gap this register found live — OPS-24's rows (P-186..P-198) were unmatched by the regex for at least two days after the program was created.
- **What bypasses it:** a plan row allocated outside the registry entirely — closed by the existing row-allocation-is-a-claim hook (BLK-212's own fix, d7c1a0f3), provided its id-space coverage is extended per check S(none)-1 below.

## Cross-cutting (no single stage; a fleet-wide gap regardless)

**Check X-1 (class C15, duplicate ids).** The existing plan-row (P-xxx) double-definition hook is extended to cover every hand-typed id prefix used anywhere in `90_operations/OPS-16_texas_market_plan_of_record.md` and its siblings — amendment ids (A-xxx), finding ids (F-xxx), OPS-23-wave-style ids — not only plan rows.
- **What executes it:** the same collision-check logic as the existing hook, parameterized over id prefix instead of hardcoded to `P-`.
- **What triggers it:** any commit to `90_operations/**` or `_decisions/**`.
- **What fails:** the live case this lane found today and did not fix (out of scope for a read-only lane) — three duplicate amendment-id pairs (A-136, A-145, A-146) currently live in OPS-16's own amendment log (BLK-072).
- **What bypasses it:** a hand-edit to the file outside the normal amendment-append flow (a merge conflict resolution, a direct edit) — the same bypass class 15 always has; mitigated only by running the check on every commit, not only on the amendment-append tool's own invocation.

**Check X-2 (class C17, unleased contention).** The `_catalog/leases/` mechanism is extended to cover Cloud Run job-runner executions and shared-store write windows, not only Cloud Run traffic-shift targets.
- **What executes it:** a generalization of the existing traffic-lease-gate hook to a second resource type.
- **What triggers it:** any `gcloud run jobs execute` against a shared project, and any heavy-scan/bulk-write window.
- **What fails:** the wave-6 finding that a scheduled job wrote the exact gate-verdict table a walk was grading, inside the walk's own measurement window (BLK-078), and the 28-million-contaminated-atom orphaned-writer incident before the atoms lease existed (BLK-260).
- **What bypasses it:** a job invoked from outside a doc_repo-rooted session, the same named bypass the existing traffic lease already has.

## What this buys, concretely, for Burnet, Bell, and Milam

If P2-3 (the empty-county gate fix) and RF6-2 (the lease-less-writer fix) alone land before Burnet's stage 3, Burnet cannot silently "pass" empty and cannot silently land without owner/land-use/flood data — the two single most consequential live gaps this register found for the very next county. A3-2 (the row-count reconciliation) would have forced Burnet's 59,785-vs-50,138 mismatch to be explained before stage 4, rather than sitting unreconciled as of this report's date. I4-2 (identity collision proof) run against Bell and Milam before merge would catch a Williamson-282,569-phantom-node-class defect before it ships, not after. None of these six checks requires new invention — every one generalizes a fix, instrument, or proposal this register found already named, already partially designed, and in several cases already built and merely unwired.
