# Blocker register -- readable form

Generated 2026-09-16. 361 instances across 18 named classes plus 30 single/low-instance NEW candidate classes. One row per instance, grouped by class. Full machine-readable form: the .json sibling of this file.

## Classes

| id | name | definition |
|---|---|---|
| C1 | Punctuation-only/malformed input skipped before write | A bake or writer continues past a bad input value before any DB write, freezing the row on a stale/pre-conformant snapshot with no earned state until specially fixed. |
| C2 | Ceiling/verdict measured by one instrument, enforced or read by another | Two different measurements are treated as one fact; they derive from different sources or different points in time and can silently disagree. |
| C3 | Parcels/records reaching no state at all | A record cannot land in any recognised disposition because of a gap between two systems' population definitions; stays permanently unaccounted/unreachable. |
| C4 | Missed sibling -- hand-maintained list or duplicated rule, one member forgotten | A required-field list or a rule implemented twice is maintained by hand; one sibling is fixed/extended and the other is not. |
| C5 | A ruling filed and never implemented, down to a type that cannot express it | A decision requires a new state; the implementing code is never written, and often the type system has no member to express the state. |
| C6 | Sub-metre digitisation mismatch between independent source layers | Two independently-digitised geometry layers miss each other by under a metre at shared edges; a strict spatial predicate excludes parcels physically inside the intended polygon. |
| C7 | A value served with a label asserted by a constant, consumed by a check that cannot fail on it | A served value's provenance label is a hardcoded constant rather than derived from real lineage; a lower-tier value is labelled identically to a directly-sourced one. |
| C8 | False earned states | A write/status claims a positive verification (absent-verified, lease_released:true, certified, verified) where nothing actually looked, checked, or succeeded. |
| C9 | Controls that cannot fail by construction | A check is logically incapable of failing -- compares a value to itself, asserts a tautology, validates then ignores, or is dormant/starved with no trigger or unpopulated input. |
| C10 | Stale copies overriding current data | A surface defers to an older cached/baked/atom copy instead of the current ledger, so a ledger fix is invisible until something re-derives the stale copy. |
| C11 | Identity collisions across two or more namespaces | Two different real entities share an identifier or key fragment across two namespaces or ingestion passes; a join silently merges or misroutes them. |
| C12 | Merged-but-not-deployed / deploy-and-traffic traps | Code merges to main but the serving revision/traffic split/deployed image does not reflect it, so git-level done is false at the customer-facing level. |
| C13 | Serial discovery -- weak instrument paces discovery instead of measuring the full population | A sampled/short-circuiting instrument finds defects one at a time at the rate the sample exposes them, when a full-population scan would find the whole class at once. |
| C14 | Stranded or unreviewed artifacts | Work lands on a branch/close that nothing downstream reviews or knows exists; sharpest form is a hand-made file impersonating a real instrument's output. |
| C15 | Duplicate row/amendment ids | Two rows or amendments are allocated the same id by concurrent writers with no collision check. |
| C16 | Governance instrument gaming | A hard-kill/gate a real condition tripped is cleared by retuning the instrument rather than fixing the condition. |
| C17 | Unleased/uncoordinated shared-resource contention | Concurrent writers/jobs/agents collide on a shared store, job runner, or checkout because the lease system covers a narrower resource class than the one actually contended. |
| C18 | Hand-declared coverage/registries never kept in sync with reality | A registry or completeness declaration compiled once by hand, with no divergence test against the live source, silently drifts from reality. |

## C1 -- Punctuation-only/malformed input skipped before write (3 instances)

### BLK-001 -- 2026-09-08/09 -- Bastrop,Caldwell,Travis
- **stage:** instantiate
- **symptom:** 18,037 rows (Bastrop 16,104/77,799) frozen on pre-conformant snapshot across every future run
- **root cause:** bake `continue`d past punctuation-only CAD situs before any DB write
- **how found:** code reading + full-table SQL scan found 18,037 after a sampled walk saw 1
- **fix status:** deployed -- earned absence, LDT #648, live 2026-09-10
- **recurrence control:** none generic
- **cost:** n/a
- **sources:** _sessions/2026-09-10_MIDSESSION_ctx_completion_and_the_six_classes.md

### BLK-160 -- 2026-09-13 -- Hays,Williamson
- **stage:** acquire
- **symptom:** operator must pass the correct roll year on the CLI for one vendor system; the tax_year is 1/3 of the primary key -- a wrong --tax-year writes the whole county under a key no reader looks for, so the county reads EMPTY, not wrong, and the vintage resolver can't notice
- **root cause:** orion/parser.ts:20-22 (LDT-09)
- **how found:** code reading
- **fix status:** unfixed -- n/a
- **recurrence control:** none
- **cost:** n/a
- **sources:** _inbox/2026-09-13_assumption_register_ldt.md

### BLK-192 -- 2026-08-18/19 -- statewide (254)
- **stage:** completeness/measurement
- **symptom:** a '99.3% populated situs' headline was actually 89.90% real street coverage of 13,071,975 parcels; 1,248,412 parcels counted populated with no actual street
- **root cause:** TxGIO source concatenation produces punctuation-only sentinels ('Bastrop serves , ,'); the populated check only tested non-null/non-empty string
- **how found:** operator QA list traced to source
- **fix status:** unfixed -- real fix is a different per-county join, not a single backfill (Bastrop's roll carries address for 6.43%, Travis's is null on all 492,848 rows while a sibling table holds it and is read by nothing)
- **recurrence control:** none
- **cost:** 1.25M-parcel false-populated signal
- **sources:** _sessions/2026-08-18_smartsite_qa_remediation_claude_code.md; _sessions/2026-08-19_smartsite_qa_to_enforcement_claude_code.md

## C2 -- Ceiling/verdict measured by one instrument, enforced or read by another (17 instances)

### BLK-002 -- 2026-09-08/09 -- Bastrop,Travis / Elgin
- **stage:** rail-fill
- **symptom:** DECLARED_LAYER_GAP ceiling for Elgin disagreed with enforcement predicate
- **root cause:** ceiling from live point-in-polygon probe, enforced against rail's own best-overlap predicate -- two questions
- **how found:** code reading
- **fix status:** deployed -- ceiling derived from rail itself (26 Bastrop, 506 Travis)
- **recurrence control:** none generalized
- **cost:** n/a
- **sources:** _sessions/2026-09-10_MIDSESSION_ctx_completion_and_the_six_classes.md

### BLK-013 -- 2026-09-09 -- Bastrop,Caldwell,McLennan,Hays
- **stage:** gate/publish
- **symptom:** publish_runs.status='succeeded' on 3 staging publishes whose embedded walk verdict was 'fail'
- **root cause:** failure lives only in runs.refuse_code, not the publish row; nothing reconciles the two tables
- **how found:** live-state read
- **fix status:** unfixed -- listed as fail-open reading
- **recurrence control:** none
- **cost:** n/a
- **sources:** _inbox/2026-09-10_ctx_third_party_review.md

### BLK-030 -- 2026-08-28 -- Caldwell
- **stage:** instantiate/rail-fill
- **symptom:** tier1 wrote 73,159 snapshots for 48,649 conformant parcels because the CAD roll carries 2 tax years per prop_id; which tax year a parcel serves is unmeasured
- **root cause:** writer emits one atom per landing row, bake writes one snapshot per atom, serve picks one by write order rather than a stated rule
- **how found:** count reconciliation during the same-day publish sprint
- **fix status:** unfixed at time of note -- not blocking that day's slice (both rows carry provenance); routed as F-06 backlog, 'the bake must select one atom per parcel by latest tax year and record the choice'
- **recurrence control:** none built
- **cost:** n/a
- **sources:** 90_operations/OPS-19_factory_plan_of_record.md

### BLK-036 -- 2026-08-28 -- Travis
- **stage:** instantiate (count reconciliation)
- **symptom:** tier1 'written' count (873,766) exceeds conformantCadRows (500,307) for Travis; Williamson's two counts matched exactly
- **root cause:** believed mechanism: one snapshot per parcel node, and a Travis prop_id joining more than one node (the P-80 divergent-join class); pages are disjoint prop_id slices with no OFFSET so overlapping pages was rejected as a cause
- **how found:** count reconciliation at the end of the sprint
- **fix status:** unfixed -- no user-facing effect (upserts by place_key), routed to backlog with the value-level walk item
- **recurrence control:** none
- **cost:** n/a
- **sources:** 90_operations/OPS-19_factory_plan_of_record.md

### BLK-040 -- 2026-09-11 (measured); recurring at least 3x by name -- Bastrop
- **stage:** publish/serve
- **symptom:** 5 different producers answer 'what are the setbacks' for the same parcel (48021:34049) and DISAGREE while each reports present: panel 25/5/25/15, feasibility PDF 25/5/25, envelope endpoint 30/10/30/20, MCP 30/10/30/20, boundary-edge atoms 30/10/30/20 -- no surface shows the conflict a standing ruling already required
- **root cause:** 5 independent read paths (atom chain via hauska-map, engine per-parcel adapter, LDT ranked-ordinance lookup, parcel_record via MCP, boundary-edge atoms) each compute or cache setbacks differently and none cross-checks another
- **how found:** same-parcel multi-surface probe (OPS-23 F3)
- **fix status:** fixed-partial -- R-1 most-current-source-wins ruling issued 2026-09-11 naming the resolving instrument; whether all 5 surfaces were repointed to it is not confirmed by a later source in this register
- **recurrence control:** R-1 ruling; enforcement depends on every surface actually switching readers
- **cost:** n/a
- **sources:** 90_operations/OPS-23_surface_completion_program.md

### BLK-041 -- 2026-09-11 -- Bastrop
- **stage:** publish/serve
- **symptom:** buildable area for one parcel served 5 different numbers across 5 surfaces: refused, 'Not stamped here', 16,386, 19,052, 20,349, with sheet 1 printing '19,052 sq ft, 68% of the lot' where 19,052 is actually 63.5%
- **root cause:** buildablePdfLabel uses the warm atom area while the percent computation uses the engine's own offset ring -- two different geometries for numerator and denominator of the same printed ratio
- **how found:** OPS-23 F4, PDF cross-read
- **fix status:** unfixed -- no fix confirmed in later sources
- **recurrence control:** none
- **cost:** n/a
- **sources:** 90_operations/OPS-23_surface_completion_program.md

### BLK-051 -- 2026-09-12 -- Travis
- **stage:** serve (special district)
- **symptom:** the PDF and the panel name two DIFFERENT special districts for the same parcel (Lake Pointe MUD vs West Travis County MUD 3)
- **root cause:** the report composer reads the engine substrate atoms store, where special districts are every TCEQ-membership atom with no one-district picker; the card reads the record's specialDistricts cell -- two stores, never reconciled; an earlier hypothesis (different read paths/service keys) was corrected the same day by re-tracing the actual call sites
- **how found:** operator's own PDF+card comparison, then corrected by code re-trace
- **fix status:** unfixed at finding -- owners named (P-152 lane 3, P-165); not confirmed fixed
- **recurrence control:** none confirmed
- **cost:** n/a
- **sources:** 90_operations/OPS-23_surface_completion_program.md

### BLK-054 -- 2026-09-12 -- Bastrop
- **stage:** serve (placement/UI)
- **symptom:** operator: when the system auto-selects a searched property as subject, setbacks don't show up; clicking another property then back fixes it -- two placement paths for one parcel produce two different sealed sheets, only one carries setbacks
- **root cause:** unresolved between two candidate mechanisms: the search-landing path seals without the live-envelope augmentation the click path gets, or seals before the record point exists; or a sheet cache keyed by parcel id holds an incomplete seal until an unrelated click evicts it
- **how found:** operator report + screenshot
- **fix status:** unfixed at finding -- owner named (P-174); root cause not resolved as of this finding
- **recurrence control:** none confirmed
- **cost:** n/a
- **sources:** 90_operations/OPS-23_surface_completion_program.md

### BLK-100 -- 2026-09-15 -- Hays
- **stage:** gate/publish
- **symptom:** a stored gate-verdict table (cited elsewhere as evidence of county state) is a periodically-refreshed snapshot, not a live view; a real production write (107,544 cells from a 6-city envelope apply) produced no visible change in the stored table, while a live targeted read via a dedicated CLI showed the true state had already moved from excluded to refuse
- **root cause:** the same ceiling-vs-enforcement-instrument split as class C2, but here the STALE side is the one every other document treats as authoritative
- **how found:** a live targeted CLI read compared against the stored snapshot
- **fix status:** measured, not fixed -- flagged as having now fired on two independent writer jobs, strengthening the case for its own dedicated row; no fix built
- **recurrence control:** none
- **cost:** n/a
- **sources:** _inbox/2026-09-15_p211-six-county-circle-back_close.json

### BLK-147 -- 2026-09-13 -- all six current counties
- **stage:** completeness
- **symptom:** two modules in the same repo make opposite claims about what parcel_record coverage vs cad_property means (100% clean vs. structurally-short-hiding-the-never-instantiated-share); both current, neither reconciled
- **root cause:** publish-readiness-gate.mjs:25-40 vs county-rail-coverage.mjs:13-19 (FAC-25)
- **how found:** code reading
- **fix status:** unfixed -- both readings reported per ENFORCEMENT rule, no adjudication
- **recurrence control:** none
- **cost:** n/a
- **sources:** _inbox/2026-09-13_assumption_register_factory.md

### BLK-151 -- 2026-09-13 -- all 65 rails, all 6 counties
- **stage:** completeness
- **symptom:** for all 65 rails, the parcel POPULATION itself has no independent second derivation -- 3 of 4 population figures read the fill job's own input table; the 4th (CAD-roll comparison) is real and independent but explicitly never gated
- **root cause:** publish-readiness-gate.mjs:60-65 (FAC completeness inventory)
- **how found:** code reading (completeness inventory B.0-B.6)
- **fix status:** unfixed -- reported figures: Bastrop 97.50%, Caldwell 90.29%, Hays 69.34%, McLennan 100.00%, Travis 84.84%, Williamson KEYSPACE_MISMATCH -- two competing mechanisms (accounts-per-parcel vs genuinely-short-ingest) indistinguishable with an unrun anti-join
- **recurrence control:** none; an anti-join is designed, not run
- **cost:** n/a
- **sources:** _inbox/2026-09-13_assumption_register_factory.md

### BLK-168 -- 2026-09-13 -- any
- **stage:** instantiate
- **symptom:** which of production vs staging parcel table to read is decided by ONE row's existence, not a count; a partial/older load in prod wins over a complete staging load
- **root cause:** nodeFacetTier1ParcelJoin.ts:122-137 (LDT-17)
- **how found:** code reading, store-only probe (no source-side detectability)
- **fix status:** unfixed, unmeasured -- a performance tradeoff explicitly acknowledged in the docstring as silently changing correctness
- **recurrence control:** none
- **cost:** n/a
- **sources:** _inbox/2026-09-13_assumption_register_ldt.md

### BLK-194 -- 2026-08-10 -- n/a
- **stage:** write-throughput benchmark
- **symptom:** an executor benchmarked 63x speedup on a throwaway empty schema; production measured only 47/sec, real gain ~16x
- **root cause:** a write benchmark on an empty table measures the code, on the production table it measures the system
- **how found:** re-benchmark before it was used to plan a 50-state rollout
- **fix status:** corrected before use -- MOLDED RULE recorded to prevent recurrence
- **recurrence control:** a standing rule, not an automated gate
- **cost:** n/a
- **sources:** _sessions/2026-08-10_five_rails_and_write_throughput_claude_code.md

### BLK-251 -- 2026-08-09 -- cross-county
- **stage:** acquire (dry/apply parity)
- **symptom:** a stored-boundary-primitives read only happened when NOT in dry-run mode, so a dry run computed a DIFFERENT result than the apply it was supposed to predict
- **root cause:** a conditional branch made dry-run and apply run different code paths
- **how found:** code reading before relying on a dry-run prediction
- **fix status:** deployed -- engine #279, dry now predicts apply correctly
- **recurrence control:** none generalized to other dry/apply pairs
- **cost:** n/a
- **sources:** _sessions/2026-08-09_statewide_acquisition_master_planner_close.md

### BLK-255 -- 2026-08-18 -- cross-county (all panels)
- **stage:** serve (UI state)
- **symptom:** search box, inspect card, compare panel, and every export panel each held independent 'current parcel' state with no shared source of truth; a drainage report for one parcel returned another's data on a different selection; a DXF export targeted stray search-box text; the SAME underlying facts were computed independently in 5 places, so one X-ray PDF printed a contradictory flood zone AND a contradictory buildable-envelope verdict across its own sheets
- **root cause:** no single source of truth for the currently-selected parcel across UI panels, and 5 independent computations of the same underlying facts
- **how found:** QA sweep
- **fix status:** fixed-undeployed -- 6 PRs opened and green at session close, none merged
- **recurrence control:** none until the PRs merge
- **cost:** n/a
- **sources:** _sessions/2026-08-18_smartsite_qa_remediation_claude_code.md

### BLK-297 -- recurring, named across at least 3 sessions -- cross-county (feasibility, flood, site-plan export)
- **stage:** rail-fill vs gate
- **symptom:** multiple synchronous compute routes with variable runtime are paired against a fixed ~55-second client-side abort set independently of them; site-plan export specifically still fails at 56.8-115.9 seconds as of the latest session, with the failure reported under a generic timeout label that names the wrong mechanism
- **root cause:** a client-side timeout ceiling and a server-side compute route's actual runtime were never designed together, so as server work grows (e.g. a larger county, a more complex parcel) the two drift further apart with no owner tracking the gap
- **how found:** repeated live timeout incidents across three different features
- **fix status:** mixed -- feasibility's instance fixed, flood's instance passes but remains slow, site-plan export's instance still failing and carded (P-244), unfixed as of the source date -- n/a
- **recurrence control:** none generic; each instance fixed by raising or removing that one route's specific ceiling, not by a shared design rule
- **cost:** n/a
- **sources:** _sessions/2026-09-15d_reports_envelope_arc_claude_code.md; _sessions/2026-09-15e_qa_reconciliation_and_async_cutover_claude_code.md

### BLK-345 -- 2026-09-14 -- Hays
- **stage:** probe/gate
- **symptom:** a production restamp produced a RED walk verdict while staging, at the same digest and same county, produced GREEN — the walk-vs-bake grading logic contradicted itself between the two environments that are supposed to be identical
- **root cause:** the staging serving revision did not carry the same serve-side decline logic as production, so the gate requiring a green staging sibling before a production run was satisfied by an environment that structurally could not exercise the real, failing predicate
- **how found:** a side-by-side comparison of the staging and production walk artifacts
- **fix status:** fix designed as a companion to a related PR, not confirmed landed as of the source -- the outcome was pre-registered and measured exactly as predicted before the fix (a falsifier-honoring negative result)
- **recurrence control:** two-directional tests required for the fix once it lands
- **cost:** no production publish for the two affected counties could pass this gate at any pin until fixed
- **sources:** 90_operations/OPS-16_texas_market_plan_of_record.md (A-080 range)

## C3 -- Parcels/records reaching no state at all (11 instances)

### BLK-003 -- 2026-09-08/09 found; unresolved -- Bastrop,Travis
- **stage:** rail-fill/identity
- **symptom:** 17 Bastrop+50 Travis parcels permanently unaccounted, excluded from both value and refused
- **root cause:** hauska-engine zoning-staging registry and LDT zoning-layers registry cover different parcel sets for same city
- **how found:** code reading (CTX-STAMPFALL), correcting a wrong belief a 'pending Factory re-bake' would fix it (does not exist)
- **fix status:** fixed-undeployed -- stamp-sourced value with own STAMP_SOURCE; registry reconciliation deferred, test-pinned flag only
- **recurrence control:** test-pinned revisit flag; registries remain independently maintained
- **cost:** n/a
- **sources:** _sessions/2026-09-10_MIDSESSION_ctx_completion_and_the_six_classes.md; _catalog/dispatch_missions/mission_ctx_stampfall.md

### BLK-045 -- 2026-09-11 -- Bastrop
- **stage:** serve (map layer)
- **symptom:** the footprint map layer returns count:0 around a visibly-imaged house with a pool; the fact row's own producer declines with a >90%-overlap-threshold miss on the same obvious house
- **root cause:** building-footprint atoms exist only for a Bastrop pilot subset and the layer toggle is off by default; separately, whether the overlap threshold is measured against parcel area (which fails ordinary houses by construction) or footprint area is unestablished
- **how found:** OPS-23 F8, near-bbox probe
- **fix status:** unfixed -- no fix confirmed
- **recurrence control:** none
- **cost:** n/a
- **sources:** 90_operations/OPS-23_surface_completion_program.md

### BLK-065 -- 2026-08-08 (source figure); stale by 2026-09-14 finding -- Burnet and every county outside CAPCOG's original 6
- **stage:** acquire (address points, implicit stage-3 prerequisite)
- **symptom:** address-point ingest (txgio_address) held only 6 of 254 counties as of 2026-08-08 (Bexar, Travis, Williamson, Hays, Bastrop, Caldwell); Burnet is not among them; the figure is 5+ weeks stale and was never re-verified live; no row in P-186 through P-198 owns fixing it as a general capability
- **root cause:** a data gap (nobody ran the loader for the other 248 counties), not a code gap -- the loader itself is county-generic
- **how found:** OPS-24 adversarial teardown
- **fix status:** unfixed, unowned as a generic capability (though the Burnet-specific instance is now named in the 2026-09-16 scope doc as stage-3 work) -- confirmed live 2026-09-16: Burnet still 0 address points
- **recurrence control:** none general; Burnet's own fix is scoped as 'one loader run from the statewide StratMap set'
- **cost:** n/a -- directly threatens the program's own Law 1 finish line (a real Burnet address must resolve via surface-probe.mjs) if not fixed before Burnet's probe stage
- **sources:** _inbox/2026-09-14_ops24-teardown_close.json; _inbox/2026-09-16_texas_scaleup_program_scope.md

### BLK-083 -- Hays leg known since >=2026-09-12; Burnet connection made 2026-09-14 11:32 -- Hays and Burnet
- **stage:** recon/acquire -> identity (situs/address-to-parcel-node binding), upstream of the walk
- **symptom:** in Hays, a situs search for 4 known addresses returns no hit or a hit with no parcel node id even though their record points land inside the geometrically correct polygons -- not a geometry problem; separately, Burnet has zero address points county-wide
- **root cause:** not diagnosed within this wave -- flagged as a hypothesis because it surfaced from two opposite directions (a resolution failure vs. a total absence) on the same day, for two different counties
- **how found:** probe (Hays) and an operator observation later confirmed by direct measurement (Burnet)
- **fix status:** unfixed/unverified at the time of this finding -- explicitly flagged as a red flag for Burnet's own loader design before it is built
- **recurrence control:** none yet
- **cost:** n/a -- named directly by the source as a warning for exactly the counties this register concerns
- **sources:** OPS-23 wave-6 commits d23edddc..efa64de5

### BLK-095 -- 2026-09-09, redispatched after a wrong-repo dispatch -- Bastrop,Travis / Elgin
- **stage:** rail-fill
- **symptom:** a jurisdiction-varying rail couldn't resolve for Elgin
- **root cause:** Elgin's polygons were never staged into the table the rail actually reads
- **how found:** dispatch (CTX-STAMP), which then found the original dispatch had named the wrong repo entirely, requiring a redispatch (CTX-STAGE2)
- **fix status:** deployed after correction -- resolved via CTX-STAGE2 after CTX-STAMP's misdirected first attempt
- **recurrence control:** none generalized
- **cost:** one wasted lane-dispatch cycle from the wrong-repo mistake
- **sources:** _sessions/2026-09-09_ctx_bake_run_claude_code.md

### BLK-102 -- named at least since 2026-07-24; still unfixed 2026-09-16 -- Bell / Temple
- **stage:** acquire (zoning source)
- **symptom:** Temple is zoned and its code is published on municode, but no public GIS layer for its zoning has ever been found (ArcGIS search empty as of 2026-07-24, still true 7+ weeks later)
- **root cause:** no public FeatureServer/layer exists for Temple's zoning, as distinct from a paging or discovery bug on the acquisition side
- **how found:** repeated acquisition attempts across at least 7 weeks
- **fix status:** unfixed -- named as 'the largest acquisition question in Phase 2' in the 2026-09-16 scope doc; still open
- **recurrence control:** none -- genuinely no source exists yet; requires new-source acquisition, not a code fix
- **cost:** n/a -- named directly as a reason Bell might be a poor parallel partner for Milam
- **sources:** _inbox/2026-07-24_post_breadth_three_gaps_MILESTONE.md; _inbox/2026-09-16_texas_scaleup_program_scope.md

### BLK-122 -- 2026-09-13 -- Harris-scale risk
- **stage:** instantiate/perf
- **symptom:** an entire county is materialized in one Node heap (3 full-table loads) before planning; Harris ~1.5M parcels is the risk case
- **root cause:** write-owner-fact-county.mjs + plan-county-parcel-nodes.mjs (ENG-19)
- **how found:** code reading
- **fix status:** unfixed, no confirmed violator yet -- n/a
- **recurrence control:** --limit only samples, no full-run protection
- **cost:** n/a
- **sources:** _inbox/2026-09-13_assumption_register_engine.md

### BLK-163 -- 2026-09-13 -- Tarrant
- **stage:** acquire
- **symptom:** the default automated fetch pulls the residential slice only (~50MB) vs the full county (~97MB); commercial parcels are absent by construction and nothing in run output says so
- **root cause:** sources.ts:106-112 (LDT-12)
- **how found:** code reading
- **fix status:** unfixed by construction -- the parser's own header flags this as the same class as a prior silent-drop incident
- **recurrence control:** none
- **cost:** n/a
- **sources:** _inbox/2026-09-13_assumption_register_ldt.md

### BLK-172 -- 2026-09-13 -- any county whose prop_id shape isn't Williamson-like
- **stage:** rail-fill
- **symptom:** a parcel-shaped-prop_id predicate derived from ONE Williamson fixture doesn't cover other TX CAD id conventions (dashed/P-/U-/M-prefixed/mixed alphanumeric); a county on any of those has 100% of its land-use rows skipped and can still escape the zero-row gate (LDT-20) if a handful conform
- **root cause:** landuse.ts:113-115 (LDT-21)
- **how found:** code reading
- **fix status:** unfixed, unmeasured; no per-county account-shape declaration exists -- n/a
- **recurrence control:** only the LDT-20 zero-row gate, insufficient
- **cost:** n/a
- **sources:** _inbox/2026-09-13_assumption_register_ldt.md

### BLK-195 -- 2026-08-04 -- Bastrop city
- **stage:** completeness/zoning
- **symptom:** 48 of 50 flagged parcels genuinely inside city limits carried no district stamp; 41 were a stale-stamp fix, 7 were genuine coverage gaps with no covering polygon at all, in two geographic clusters (possible annexation/ETJ pockets)
- **root cause:** a spatial-containment sweep found the first live defect cohort of the program
- **how found:** a sweep + spatial-containment triage
- **fix status:** partially fixed -- 41-parcel re-roll dispatched under a regression gate; the 7 genuine gaps routed to a city follow-up, status not applied at close
- **recurrence control:** none confirmed for the 7 gaps
- **cost:** n/a
- **sources:** _sessions/2026-08-04_wave1_wave2_county_fan_claude_code.md

### BLK-249 -- 2026-08-09 -- Harris (MAJOR)
- **stage:** acquire
- **symptom:** Harris held 564,948 parcels when it should have held 1.6M; a file-picker chose only ONE of Harris's two shapefiles (the smaller of two halves), truncating the store at a hard longitude line; the truncation survived every gate -- dry run, apply, a second apply, and independent SQL all agreed on the wrong number, because all four read the same truncated input, and even a sizing probe's own parcel-count estimate matched the truncated count exactly
- **root cause:** files.find() picked one of two shapefiles arbitrarily, silently discarding the other, and nothing checked geography against the source's own stated extent
- **how found:** a reviewer asking a GEOGRAPHIC question ('does this cover the whole county') instead of a counting question
- **fix status:** deployed -- Harris repaired to 1,602,031 rows (769,053 parcels recovered); reader fixed to fail-closed unless multi-shapefile concatenation is explicit; a statewide sweep confirmed Harris was the only multi-shapefile county
- **recurrence control:** fail-closed default requiring explicit multi-shp handling
- **cost:** 769,053 parcels missing from the second-largest county in the state, passing every existing gate, until a geographic sanity check caught it
- **sources:** _sessions/2026-08-09_statewide_acquisition_master_planner_close.md

## C4 -- Missed sibling -- hand-maintained list or duplicated rule, one member forgotten (30 instances)

### BLK-004 -- 2026-09-08/09 -- all six
- **stage:** atoms/instantiate
- **symptom:** baseFacts.acreage bare null on 291,231 of 1,516,110 baked cells
- **root cause:** CTX-LEAVES built earned-absence for 4 leaves 2026-09-08, acreage never added to enforced set
- **how found:** code reading, confirmed by full-population count
- **fix status:** deployed -- fixed by CTX-LEAVES2; McLennan at zero is why it passed first
- **recurrence control:** required-leaf list stayed hand-maintained (see BLK-021 census proposal, never built as standing instrument)
- **cost:** n/a
- **sources:** _sessions/2026-09-10_MIDSESSION_ctx_completion_and_the_six_classes.md

### BLK-033 -- 2026-08-28 -- Travis
- **stage:** gate (walk area key)
- **symptom:** Travis's inline walk refused SWEEP_TOO_SMALL -- a street union of 1 anchor yielded only 6 neighbours (floor 12), excluding most of the county
- **root cause:** the walk's area key treated a null city as a different city; on a roll where situs_city is null for 3/4 of Travis parcels, this silently excluded most of the county from ever being swept
- **how found:** walk failure investigated at source
- **fix status:** deployed -- key changed to street+zip with city as tiebreaker only when both sides have one; re-run swept 183 neighbours on the same street that read 6 before
- **recurrence control:** fixture pinned to the Travis case
- **cost:** n/a
- **sources:** 90_operations/OPS-19_factory_plan_of_record.md

### BLK-034 -- 2026-08-28 -- all six
- **stage:** instantiate (card F: reader vs assemble)
- **symptom:** situsCity null on 1,498,010 of 1,498,010 conformant rows (100%); land use present on 0; claim acreage present on 0 (except Bastrop/Caldwell via a different join)
- **root cause:** readConformantCadClaim read situsCity/situsZip/landAcres/propertyUseCode from body.claim, but the store holds no body.claim key at all (the Factory writer spreads the candidate flat); the ASSEMBLE step had correctly written the fields, the READER looked in the wrong place
- **how found:** a subagent CP1 read-only production sample (120 of 120 bodies flat) after the original card mis-attributed the bug to the assemble step
- **fix status:** deployed -- fixed same day (LDT #532); production probes confirmed situsCity/situsZip/acreage populated post-fix on all six golds
- **recurrence control:** none generalized (one reader/writer field-name mismatch, fixed ad hoc)
- **cost:** the original card's wrong diagnosis (assemble, not reader) would have shipped a no-op fix had the CP1 read not caught it first
- **sources:** 90_operations/OPS-19_factory_plan_of_record.md

### BLK-055 -- 2026-09-13 -- Bastrop,Travis,Hays
- **stage:** serve (record-path payload)
- **symptom:** the record-served facets payload carries cityLimitsFact without a queryPoint on every parcel read since a cutover, while the MCP snapshot still carries it -- so probe legs depending on that point read UNMEASURED, silently, since the cutover
- **root cause:** a field present on the old serve path was dropped on the new record-served path with nothing flagging the loss
- **how found:** overseer review
- **fix status:** unfixed at finding -- owners named (P-174 to test, P-152 lane 3 to restore); not confirmed fixed
- **recurrence control:** none confirmed
- **cost:** n/a
- **sources:** 90_operations/OPS-23_surface_completion_program.md

### BLK-059 -- 2026-09-11 -- Bastrop
- **stage:** serve (panel navigation fallback)
- **symptom:** geocoding was already demoted by ruling (P-27: 'do NOT build a geocoder') and the panel still ends up calling one
- **root cause:** invariant I5 says geometry is the navigation authority and situs address is only a fallback; the cortex envelope route orders resolution correctly (point, then situs-to-parcel, then geocode last) but the panel is the caller that reaches the geocode step because it ignores the record's own point entirely, so it always falls through to the demoted path
- **how found:** code read of both files plus the F5 probes
- **fix status:** unfixed at finding -- operator quote: 'I thought we had done away with geocoding; maybe that cortex function is not caught up' -- 'caught up in order, not in outcome'
- **recurrence control:** none confirmed
- **cost:** n/a
- **sources:** 90_operations/OPS-23_surface_completion_program.md

### BLK-061 -- 2026-09-14 found; still true 2026-09-16 -- n/a (program instrument)
- **stage:** probe (P-197 / Law 1)
- **symptom:** surface-probe.mjs's ROWS table has ZERO predicates for the entire OPS-24 program (P-186 through P-198); probe-close-gate.mjs's regex is scoped only to P-151..P-167, so it silently does not match any OPS-24 row -- a lane could close P-195/197/198 today citing no probe artifact and nothing blocks the commit
- **root cause:** the gated-row regex was never extended when OPS-24's row range was allocated -- exactly the missed-sibling shape (class 4) applied to the enforcement mechanism itself
- **how found:** OPS-24 adversarial teardown
- **fix status:** unfixed at finding -- close-gate widened to the OPS-24 range same day (2026-09-14) per the wave log, but surface-probe.mjs itself still carried zero OPS-24 predicates as of that widening -- the gate now at least FIRES on an empty artifact, but the underlying predicates were not yet written
- **recurrence control:** partial: the regex widening is itself a recurrence control for THIS specific gap, but the general pattern (a hand-maintained regex scoped to a row range) can recur for the next program
- **cost:** n/a
- **sources:** _inbox/2026-09-14_ops24-teardown_close.json

### BLK-085 -- 2026-09-09 -- all six
- **stage:** gate
- **symptom:** BP-CONTENT-01 could not pass for any county
- **root cause:** verify-walk demanded a 4-state value on envelope, which is deliberately stripped-null at serve by design (anti-zombie rule)
- **how found:** walk failure investigated
- **fix status:** deployed -- declared serve-stripped leaf must be exactly null, not a 4-state -- fixed
- **recurrence control:** none generalized
- **cost:** n/a
- **sources:** _sessions/2026-09-09_ctx_bake_run_claude_code.md

### BLK-086 -- 2026-09-09 -- all six, 312,169 parcels
- **stage:** atoms/rail-fill
- **symptom:** baseFacts.situsState bare null
- **root cause:** cad_property has no situs_state column; read via a nullable fallback off the TxGIO join
- **how found:** code reading
- **fix status:** deployed -- derived from countyFips instead
- **recurrence control:** none
- **cost:** n/a
- **sources:** _sessions/2026-09-09_ctx_bake_run_claude_code.md

### BLK-088 -- 2026-09-09 -- all six
- **stage:** atoms
- **symptom:** 6 more required leaves bare null (zoningSource,landUseSource,landUse,situsCity,situsZip)
- **root cause:** same missed-sibling pattern as acreage (BLK-004) -- an enforced-leaf list grown by hand, incomplete again
- **how found:** code reading
- **fix status:** deployed -- CTX-LEAVES fixed all 6
- **recurrence control:** none permanent (see BLK-004's note on the census proposal never being built)
- **cost:** n/a
- **sources:** _sessions/2026-09-09_ctx_bake_run_claude_code.md

### BLK-106 -- 2026-09-13 -- any
- **stage:** identity
- **symptom:** 4 independent parcel-key normalize implementations disagree; one has no all-digit guard, can join wrong parcel
- **root cause:** 4 separate functions in 4 files, no shared implementation
- **how found:** code reading (ENG-03)
- **fix status:** unfixed -- comment asserts parity that does not hold
- **recurrence control:** none
- **cost:** n/a
- **sources:** _inbox/2026-09-13_assumption_register_engine.md

### BLK-167 -- 2026-09-13, mitigated for Bastrop only -- any future city with a coded-value-domain zoning field
- **stage:** rail-fill
- **symptom:** when no codeDomainMap is declared for a city, a coded-value zoning field is stamped as its raw INTEGER verbatim, matching no setback table row; Bastrop's ZoneTypeClass was exactly this shape, caught by hand; nothing catches the next one
- **root cause:** zoning-layers.ts:82-90 (LDT-16)
- **how found:** code reading, after Bastrop's own instance was caught manually
- **fix status:** unfixed for future cities -- Bastrop mitigated by hand
- **recurrence control:** partial -- fails closed only when a map IS declared
- **cost:** n/a
- **sources:** _inbox/2026-09-13_assumption_register_ldt.md

### BLK-171 -- 2026-09-13 -- any (the register's own 'largest structural gap found')
- **stage:** completeness
- **symptom:** a land-use skip counter has NO ceiling at all, while the geometry pass over the SAME DBF has 3 declared skip ceilings; a county skipping 99.9% of rows and parsing only 10 exits 0 and reports success; the printed skip label also omits one of three skip reasons
- **root cause:** landuse-cli.ts:292-300 (LDT-20)
- **how found:** code reading
- **fix status:** unfixed -- only fires at exactly-zero rowsParsed
- **recurrence control:** partial (zero-only trigger)
- **cost:** n/a
- **sources:** _inbox/2026-09-13_assumption_register_ldt.md

### BLK-173 -- 2026-09-13, McLennan confirmed violator -- McLennan (48309, all rows)
- **stage:** rail-fill
- **symptom:** a narrow unit vocabulary (acres/sqft/hectares) has zero refusal-rate reporting; McLennan's ingest refused ALL 114,255 rows on this rail and the run reported success
- **root cause:** p78Merge.ts:42-83 (LDT-22)
- **how found:** code reading
- **fix status:** unfixed -- fail-closed per row, ungoverned per county -- no ceiling or reporting exists
- **recurrence control:** none
- **cost:** 114,255 rows silently refused with a success exit code
- **sources:** _inbox/2026-09-13_assumption_register_ldt.md

### BLK-179 -- 2026-09-13 -- any DB with a test/staging schema alongside production
- **stage:** instantiate
- **symptom:** table-existence and column-existence are checked by two DIFFERENT resolution mechanisms (one honors search_path, one scans ALL schemas); on a DB with a test schema they can answer about different tables
- **root cause:** nodeFacetTier1ParcelJoin.ts:76-99 (LDT-31)
- **how found:** code reading
- **fix status:** unfixed, unmeasured -- the asymmetry favors a false TRUE (loud SQL error, not silent) so blast radius is limited
- **recurrence control:** loud failure mode limits blast radius
- **cost:** n/a
- **sources:** _inbox/2026-09-13_assumption_register_ldt.md

### BLK-182 -- 2026-09-13 -- any county matching a small % of true living-area segments
- **stage:** parse
- **symptom:** a vocabulary-mismatch error fires only at exactly-zero matched segments (same shape as LDT-20); a county matching 1% of true segments passes silently
- **root cause:** pacs/parser.ts:106-130,192-198 (LDT-37)
- **how found:** code reading
- **fix status:** unfixed -- fails closed at zero only
- **recurrence control:** none
- **cost:** n/a
- **sources:** _inbox/2026-09-13_assumption_register_ldt.md

### BLK-196 -- 2026-07-25 -- Bastrop
- **stage:** publish/export gate
- **symptom:** a site-plan export refused 'setbacks not available' on parcels where setbacks WERE on file
- **root cause:** two stacked defects: the engine API defaulted to in-memory storage in production so it never saw real Postgres atoms; a second reader omitted the entity type the write path used, so GET/download 404'd even after a refresh wrote successfully
- **how found:** operator caught the false refusal
- **fix status:** deployed -- engine #121/#122 merged and live-verified
- **recurrence control:** a stated rule that not_specified != missing must apply at every consumer, not only the inspect card
- **cost:** n/a
- **sources:** _sessions/2026-07-25_f1_command_center_completion_and_setback_correctness_claude_code.md; _sessions/2026-07-25_setback_export_gate_false_refusal_claude_code.md

### BLK-197 -- 2026-08-12 -- cross-county
- **stage:** serve (MCP)
- **symptom:** the MCP property-atom-chain hardcodes 4 entity types in a DID regex; 12 of 16 registered atom families are unreachable through it, including every family written statewide that session
- **root cause:** a hand-maintained regex allowlist never extended as new atom families shipped
- **how found:** an 8-instrument-defect code audit
- **fix status:** unfixed at session close, blocking the report engine -- n/a
- **recurrence control:** none confirmed
- **cost:** n/a
- **sources:** _sessions/2026-08-12_gate_closure_arc_claude_code.md

### BLK-207 -- 2026-08-18/19 -- Bastrop,Travis (statewide FEMA rail)
- **stage:** serve (tier2 flood)
- **symptom:** a bake-to-serve field mapping never copied tier2 into served facets -- 608,414 baked FEMA determinations reached no user while the write-side ledger scored the rail complete; once probed, tier2 was WRONG in every one of 5,714 adjudicated cases, including 1,995 parcels told they sat outside a flood hazard area whose true centroid is inside one
- **root cause:** a served-facet mapper omitted a field (mergeBakedBaseFacts never copied tier2); separately, a point-in-polygon check quantized the parcel to a 0.005-degree tile and queried FEMA once at the tile centre, up to 227m off from the parcel's real location
- **how found:** a QA sweep described as 'on nobody's brief'
- **fix status:** deployed -- cortex-api now returns tier2.flood:null with a typed refusal naming the retired producer, date, successor atom, and evidence; live unauthenticated exposure closed
- **recurrence control:** the typed refusal itself
- **cost:** 5,714 wrong flood-hazard adjudications served before the fix, including 1,995 false-outside-SFHA answers
- **sources:** _sessions/2026-08-18_smartsite_qa_remediation_claude_code.md; _sessions/2026-08-19_smartsite_qa_to_enforcement_claude_code.md

### BLK-208 -- 2026-08-19 -- cross-county
- **stage:** serve (Command Center manifest)
- **symptom:** 6 of 14 rails never scored anywhere (42.9% of the grid, 35.2M atom rows behind them); 9 of 14 rails have no served slot at all; 12 county writers exist against only 3 scorer CLIs
- **root cause:** the scorer/writer ratio was never kept 1:1 as writers were added
- **how found:** the same enforcement-arc audit
- **fix status:** unclear/not closed at range end -- n/a
- **recurrence control:** none confirmed
- **cost:** n/a
- **sources:** _sessions/2026-08-19_smartsite_qa_to_enforcement_claude_code.md

### BLK-212 -- 2026-08-14 -- n/a (fleet tooling)
- **stage:** dispatch/canon gate
- **symptom:** a plan-row validation rule had two separate implementations (a compiler and a hook); fixing the compiler alone left every dispatch passing PLAN-ROW validation UNVALIDATED through the hook; after the first bug was fixed, a second fail-open was found one layer deeper (the amendment documenting the first bug quoted a test row in prose, and both consumers matched a mention as a grant); separately, 3 em-dashes in a PowerShell script silently broke ANSI parsing and disabled the entire hook, caught only because negative tests existed
- **root cause:** one rule, two implementations, disagreeing -- twice, stacked two deep
- **how found:** fleet governance audit
- **fix status:** fixed -- a plan registry + a divergence test built
- **recurrence control:** the divergence test
- **cost:** n/a
- **sources:** _sessions/2026-08-14_govtech_program_standup_claude_code.md

### BLK-241 -- 2026-08-03 -- Elgin
- **stage:** serve (provenance route)
- **symptom:** a single-wired-layer fallback in a provenance resolver legitimately died once the county gained a second AGOL layer; the first CI run's red was masked by an unrelated flake, so the real regression was only caught on a second run
- **root cause:** a fallback assumption (one layer per county) broke when the real data grew past it, and a coincidental flake nearly hid it
- **how found:** a second CI run after the first's failure was misdiagnosed as a flake
- **fix status:** deployed -- fixed with honest-ambiguity tests; a second masked instance found one layer up also fixed
- **recurrence control:** the honest-ambiguity tests
- **cost:** n/a
- **sources:** _sessions/2026-08-03_elgin_foundation_and_city_code_refs_claude_code.md

### BLK-265 -- measured 2026-09-16 -- all six
- **stage:** rail-fill/instantiate
- **symptom:** two separate setback-table registries (a corpus package and the engine's own jurisdiction descriptors) and two separate edge labellers (the engine's depth-warm one and LDT's live one) can each be fixed independently without the other agreeing, producing the same twin-implementation risk found repeatedly elsewhere in this register at smaller scale (BLK-003, BLK-106, BLK-212)
- **root cause:** two independently-maintained implementations of the same logical rule, with no divergence test between them
- **how found:** the 2026-09-16 program scope document's own Class B synthesis
- **fix status:** unfixed -- a fix (S6: one setback registry with a divergence test) is scoped but not built as of 2026-09-16
- **recurrence control:** none until S6 lands
- **cost:** n/a -- named explicitly as 'the exact fork the farm model exists to prevent'
- **sources:** _inbox/2026-09-16_texas_scaleup_program_scope.md

### BLK-283 -- 2026-09-15, still open at least through 2026-09-16 -- n/a (probe instrument)
- **stage:** probe
- **symptom:** surface-probe.mjs's missing-legs gap recurred and grew across a single session -- no predicate for at least 6 named rows, growing to 14 rows missing by session end
- **root cause:** the predicate list is hand-maintained and not extended as new rows ship -- the same class-4 shape as BLK-061, recurring within days of that finding rather than being fixed by it
- **how found:** repeated observation across the session as new rows shipped
- **fix status:** unfixed, flagged repeatedly, still open at window end -- closes discharge via probe.notApplicable instead of a real predicate, which is itself the bypass this gap enables
- **recurrence control:** none -- this is the SAME gap BLK-061 found, recurring rather than closing
- **cost:** n/a
- **sources:** _sessions/2026-09-15_mcp_surface_and_bastrop_recovery_claude_code.md; _sessions/2026-09-15d_reports_envelope_arc_claude_code.md; _sessions/2026-09-15e_qa_reconciliation_and_async_cutover_claude_code.md

### BLK-286 -- 2026-09-15, verified fixed after BLK-285's Solo account landed -- n/a (MCP)
- **stage:** publish
- **symptom:** owner-only fields were reachable via the MCP response composer regardless of the caller's tier
- **root cause:** a shared response composer forwarded the upstream body untouched and never called the existing Studio-only gate function (which was already correctly used elsewhere) -- and this survived because the only test fixture was itself Studio-tier, so the gap was invisible until a real lower-tier account existed
- **how found:** code reading, confirmed live once BLK-285's Solo account existed
- **fix status:** deployed -- fixed and verified live post-Solo-tier-switch
- **recurrence control:** the gate call is now wired; the standing Solo test account (BLK-285) is the control that would catch a regression
- **cost:** n/a
- **sources:** _sessions/2026-09-15e_qa_reconciliation_and_async_cutover_claude_code.md

### BLK-295 -- 2026-09-14, recurred as a second instance -- Bastrop
- **stage:** gate
- **symptom:** a tenant-isolation audit found 3 unguarded list routes (one named); a LATER audit of the same class found the true tenant-blind group was 6 routes, not the 5 the first fix had assumed
- **root cause:** the route list each time was hand-verified rather than mechanically derived from the routing table
- **how found:** two successive audits, the second catching what the first missed
- **fix status:** deployed (both rounds) -- both closed; the second fix replaced a hardcoded literal with a derived tenant-id function
- **recurrence control:** a derived (not hand-listed) tenant-id check going forward
- **cost:** n/a -- the class recurred once even after being believed fixed
- **sources:** _sessions/2026-09-14_bastrop_cutover_qa_claude_code.md

### BLK-322 -- 2026-09-04 to 2026-09-12 -- n/a
- **stage:** gate
- **symptom:** a multi-day tier/package divergence between the MCP connector and the web app: X-ray gated Studio+ on the connector while the web app gated Solo+ for the SAME feature (backwards relative to each other); a Property Unlock check was omitted from CAD/terrain/feasibility gates on both surfaces
- **root cause:** tier predicates were hand-copied independently per surface with no shared source of truth
- **how found:** a live audit matrix built before any change
- **fix status:** deployed -- fixed across roughly six PRs
- **recurrence control:** reuse of one shared predicate function going forward, never a fourth independent re-implementation
- **cost:** n/a
- **sources:** 90_operations/OPS-16_texas_market_plan_of_record.md (A-080 range)

### BLK-339 -- 2026-09-15 -- Bastrop
- **stage:** serve
- **symptom:** real owner data was present and served on one MCP call path for a parcel, and entirely absent on the Property Explorer facets wire for the identical parcel
- **root cause:** an entitlement/data-inclusion filter runs on one serve path for a field and is never applied to its sibling path serving the same underlying data
- **how found:** a cross-surface QA re-verification pass
- **fix status:** unfixed, flagged -- n/a
- **recurrence control:** none yet
- **cost:** n/a
- **sources:** 90_operations/OPS-16_texas_market_plan_of_record.md (A-080 range)

### BLK-341 -- 2026-09-15 -- Travis
- **stage:** publish
- **symptom:** a producer-side fix for an X-ray dossier export was correctly deployed and verified, but the PRODUCT stayed broken because a gate in a third, separate repo refused the request BEFORE it ever reached the fixed producer, checking arguments that had become vestigial — the third same-day instance of this exact shape (a fix lands in a producer, an upstream consumer-side gate never reaches it)
- **root cause:** a hollow/validity check ran before the real engine call instead of after it, so it could never see the engine's own corrected output
- **how found:** a Cloud Run traffic sweep over a 20-minute window showed ZERO dossier calls ever reaching the engine despite the fix being live
- **fix status:** deployed -- the hollow-gate check moved to run AFTER the engine call, reading the engine's real fields
- **recurrence control:** a new test with a mocked hollow engine result, asserting the check only fires post-call
- **cost:** the third occurrence of this exact pattern in one day, across three different export types (feasibility, site-plan, and this dossier export)
- **sources:** 90_operations/OPS-16_texas_market_plan_of_record.md (A-080 range)

### BLK-350 -- 2026-08-28 -- Travis, Williamson
- **stage:** publish
- **symptom:** a hardcoded job timeout was measured to be shorter than the real write duration for the two largest counties under real contention, which would have killed both mid-write had it not been caught first
- **root cause:** a fixed timeout constant was never re-derived against a measured, contention-adjusted write rate
- **how found:** a direct rate measurement compared against the template constant, before running the two largest counties
- **fix status:** deployed -- the timeout was raised to match the measured rate before either county was run
- **recurrence control:** none generalized against the next county whose write rate exceeds the constant
- **cost:** n/a — caught before it killed the two largest counties' writes mid-run
- **sources:** 90_operations/OPS-19_factory_plan_of_record.md

### BLK-356 -- n/a -- n/a (code duplication)
- **stage:** n/a
- **symptom:** one geometry helper function was found duplicated across six sibling modules, each copy independently drifted: one defect present in 3 of 6 copies, a second defect in 1 of 6, a third in 5 of 6 (with differing real-world consequence); separately, of three definitions of one other function existing in the codebase, only one was ever actually reachable from a live call site (one was imported but never invoked, one was never imported at all)
- **root cause:** a shared implementation was copy-pasted rather than factored into one module, and drifted independently at each copy
- **how found:** a code-duplication audit
- **fix status:** n/a — named as a standing finding -- n/a
- **recurrence control:** none confirmed
- **cost:** n/a
- **sources:** 61_enforcement_doctrine.md

## C5 -- A ruling filed and never implemented, down to a type that cannot express it (15 instances)

### BLK-005 -- 2026-09-01 ruling, open 2026-09-10 -- cross-county
- **stage:** publish/serve
- **symptom:** 2026-09-01 ruling required unmeasured->refused at serve; never implemented at verdictLayerServe.ts
- **root cause:** LayerAbsenceVerdict type had no 'refused' member -- structurally inexpressible
- **how found:** code reading / CI failure
- **fix status:** unfixed -- second unimplemented instance of same ruling found and left named; no later close confirms a fix
- **recurrence control:** none -- no exhaustiveness check ties decisions to the unions they require
- **cost:** n/a
- **sources:** _sessions/2026-09-10_MIDSESSION_ctx_completion_and_the_six_classes.md

### BLK-037 -- 2026-09-09/10 -- cross-county (setbacks/envelope, all six)
- **stage:** rail-fill (writer path)
- **symptom:** setbacks and buildable envelope had NO write path to a value for weeks -- a closed loop of two individually-correct refusals
- **root cause:** setbackFrontFt cell = unaccounted (serve cutover deferred to computeTier1Envelope's bake-time output); computeTier1Envelope has TWO branches, BOTH status:declined, no branch ever returns a value; its own disclosure says read the atom chain; write-setback-city.mjs throws SETBACK_APPLY_HELD on --apply per a card-scope boundary that no later card lifted, and separately has no live parcel loader at all -- the gap between two correct refusals was never anyone's assigned row for weeks
- **how found:** root-cause read by the OPS-21 program author
- **fix status:** fixed-undeployed(partial) -- OPS-21 Phase 1 (S1-S4) scoped a direct cells-from-ruled-table write path bypassing the held atom writer; as of 2026-09-16, S1 (stop writing false absences) is still listed as future work in the scope doc, so the underlying writer gap for many cities is still open
- **recurrence control:** none until S1/S3 land
- **cost:** weeks of the operator's stated top goal ('setback and envelope rails in production') blocked with no owner
- **sources:** 90_operations/OPS-21_serve_completion_program.md

### BLK-038 -- 2026-09-10 ruling ('sixth cell state'); still an owed migration as of the ruling -- cross-county
- **stage:** instantiate (cell-state vocabulary)
- **symptom:** hoaDeedRestrictions, ossf, and publicRecordRefs cannot be truthfully expressed by any of the five existing cell states -- absent-verified is false (nothing looked), not-applicable is false (may well apply), refused is close but wrong shade -- so they sit unaccounted forever, dragging the completeness count until someone relabels them to clear a gate
- **root cause:** the type system had no state for 'acquirable on request, not yet requested'
- **how found:** the pattern was named as the exact failure the relabelling tripwire exists to catch, before it happened
- **fix status:** ruled, migration owed -- RULED 2026-09-10: a sixth cell state, available-on-request, with a required requestPath field; consequence taken deliberately: a 6-value union across a 981,405x65 grid, and every consumer (allowlist, gate CLI, serve-layer rail adapters, MCP tool schemas) needs the new member with a fail-closed default on the missing case
- **recurrence control:** the ruling itself is the recurrence control for THIS instance, but the underlying pattern (a state a ruling creates having to migrate every consumer or fail silently) is the class-5/9 overlap this register names generally
- **cost:** n/a
- **sources:** 90_operations/OPS-21_serve_completion_program.md; _decisions/2026-09-10_available_on_request_sixth_cell_state.md

### BLK-050 -- 2026-09-11 -- Travis
- **stage:** serve (Find box)
- **symptom:** the Find box does not resolve a real, known-good address after a deploy that should have fixed it
- **root cause:** Find box calls the geocoder before the situs index, the opposite order from the P-27 ruling ('do NOT build a geocoder', situs index first); cortex returns geocode_miss with or without the city
- **how found:** operator report, 2026-09-11
- **fix status:** unfixed at finding -- owner named for a follow-up row if the P-151 lane had not touched the Find path; not confirmed fixed
- **recurrence control:** none confirmed
- **cost:** n/a
- **sources:** 90_operations/OPS-23_surface_completion_program.md

### BLK-064 -- 2026-09-14 -- n/a (program design)
- **stage:** publish (retract)
- **symptom:** no retract-by-run-id mechanism exists anywhere across all 4 product repos (exhaustive grep for 'retract'+'run' finds nothing); it appears only in the original map's holes section, absorbed by NO OPS-24 row at all
- **root cause:** a named design gap was never converted into an owned row when the program was carded
- **how found:** OPS-24 adversarial teardown, exhaustive grep
- **fix status:** unfixed, unowned -- still named as a hole with no owner as of the 2026-09-16 pickup list (C9: 'retract-by-run-id does not exist anywhere')
- **recurrence control:** none
- **cost:** n/a -- means a bad production bake, once written, cannot be withdrawn by any mechanism, only re-baked or manually quarantined
- **sources:** _inbox/2026-09-14_ops24-teardown_close.json; _inbox/2026-09-16_pickup_list_planned_not_done.md

### BLK-081 -- found 2026-09-14 11:15-11:33; wrapper built/deployed 13:29; still not invoked at wave close -- Bastrop
- **stage:** instantiate/atoms (writer-path dispatch)
- **symptom:** an operator-approved single-parcel re-mint had no way to actually be invoked for one parcel -- only city-cohort (~3,762 parcels) or county-wide forms existed, both of which force-overwrite stored geometry across the entire cohort
- **root cause:** no single-parcel invocation existed anywhere in the tooling; a standing rule requiring apply-only-via-Cloud-Run-Job had no implementing wrapper for this write path; the underlying write function takes no lease at all (unlike its batch sibling) and no version/history table exists, so the write is an unrollbackable in-place upsert
- **how found:** code reading confirming absence, not just failure to find
- **fix status:** partially fixed -- operator ruled to build a Cloud Run Job wrapper for the bounded single-parcel form; wrapper built and deployed (digest-pinned, field-verified), but the job is dry-run-baked by default and invocation itself remained a separate, still-unexercised operator gate at wave close
- **recurrence control:** deploy and invocation treated as two distinct gates explicitly, so a deploy is never mistaken for an invocation
- **cost:** the unmeasured wall-clock/cost of a real apply is flagged as an open risk since even the bounded form pages a whole jurisdiction's feature index
- **sources:** OPS-23 wave-6 commits d23edddc..efa64de5

### BLK-082 -- 2026-09-14 13:30 -- Bastrop
- **stage:** publish (record-serve rail)
- **symptom:** even once invoked, a re-mint cannot surface its result on the record-serve endpoint at all
- **root cause:** the record reader only dereferences an atom when the cell carries an atomDid; the row wiring that (P-163) had not landed so it is hardcoded null; the record's setback values come from an entirely separate corpus with no conflict concept, and the writer for that rail is first-write-only, unable to refresh an already-earned cell
- **how found:** derivation, cross-checked against a proposed fix that was itself refuted by reading its own file header (a one-time loader, not a refresh mechanism)
- **fix status:** unfixed, filed as a scope bound -- explicitly named as needing its own future row
- **recurrence control:** none yet
- **cost:** n/a
- **sources:** OPS-23 wave-6 commits d23edddc..efa64de5

### BLK-185 -- 2026-09-13 -- n/a code-level (atoms/ledger design)
- **stage:** atoms/ledger
- **symptom:** a cell-versioning design ('keyed to atom version + vocabulary version') was claimed as already-existing; the actual table has 4 columns and NO version of any kind; 4 of 5 non-value cell states (including unaccounted) aren't even covered by the provenance type, so a cell with no value carries NO version at all
- **root cause:** hauska-factory migrations/0007_parcel_record.sql:19-35, hauska-engine cell-state.ts:8-59 (F3)
- **how found:** adversarial review
- **fix status:** unfixed/undeployed -- ruled 2 days earlier (2026-09-11); OPS-23 program rows exist (P-161..P-166), NONE built
- **recurrence control:** none
- **cost:** n/a -- textbook class-5 instance: a ruling filed and never implemented, down to a type that can't express the state
- **sources:** _inbox/2026-09-13_national_scale_adversarial_review.md

### BLK-189 -- 2026-09-13 -- Hays
- **stage:** sequencing/planning
- **symptom:** a proposal to 'bake the 5 weirdest counties first' directly contradicts OPS-21's own explicit serialization rule for Hays ('filling cells on a broken key writes wrong values faster'); applying 'weirdest first' today means baking Hays first, which the plan's own cited source forbids
- **root cause:** OPS-21 Phase 2H vs the working notes' own sequencing logic, unreconciled (F7)
- **how found:** adversarial review, checking a proposal against its own cited source
- **fix status:** unfixed as written; a repair (compose with staging-only scoping) is proposed, not written down -- n/a
- **recurrence control:** none
- **cost:** n/a
- **sources:** _inbox/2026-09-13_national_scale_adversarial_review.md

### BLK-198 -- 2026-08-03 -- Bastrop (unincorporated)
- **stage:** completeness
- **symptom:** the unzoned/unincorporated cohort had zero setback-rule or buildable-envelope atoms; doctrine demanded a named decline, but the atom contract's setback-rule required numeric dimensions with no true-absence shape
- **root cause:** minting a decline would mean fabricating front/side/rear numbers indistinguishable from a real zero-setback rule -- the executor stopped rather than build it wrong
- **how found:** caught before being built wrong
- **fix status:** worked around, not fixed -- a new decline code (unzoned-no-district-basis) reused from a related precedent; a first-class contract absence ADR was queued and deliberately not rushed, still open
- **recurrence control:** none until the ADR lands
- **cost:** n/a
- **sources:** _sessions/2026-08-03_county_onboarded_claude_code.md

### BLK-199 -- 2026-08-09 -- 15 CAD counties
- **stage:** rail-fill (owner rail)
- **symptom:** the owner-fact access policy was ruled but the atom carrier for it was never built, though live data already existed (4,599,477 rows, 98.4% with an owner)
- **root cause:** a ruling landed with no implementing writer -- a class-5 gap, inverted from every other rail (data ready, no writer, instead of writer ready, no data)
- **how found:** a gap-analysis audit
- **fix status:** partially fixed -- engine #296/#297 registered the contract; the apply itself was still owed as of the finding, queued behind the atoms bulk-writer slot
- **recurrence control:** a launch-gate consequence was also caught here: OWN can never reach 100% of 254 counties since the 15 CAD counties are a subset -- the gate was corrected to read done-where-CAD-exists
- **cost:** n/a
- **sources:** _sessions/2026-08-09_sweep_resume_and_own_rrc_gap_claude_code.md; _sessions/2026-08-10_five_rails_and_write_throughput_claude_code.md

### BLK-270 -- ruled 2026-09-15, unbuilt as of 2026-09-16 -- all six (35 districts, 9,485 parcels)
- **stage:** rail-fill (PUD)
- **symptom:** parcels under a planned-unit-development ordinance return the same silent 404/no-district refusal as a genuinely unacquired district, giving a customer no indication their setbacks come from a PUD ordinance rather than a missing table
- **root cause:** a ruling (A-164) named the correct customer-facing message but no card was ever built to implement it on any of the three customer surfaces (map, MCP, PDF)
- **how found:** pickup-list review of what the PUD ruling actually shipped
- **fix status:** ruled, unbuilt -- S2 (the PUD message) listed as 'never carded as a build' in the 2026-09-16 pickup list
- **recurrence control:** none until built
- **cost:** 9,485 parcels served an indistinguishable-from-missing-data refusal instead of the correct PUD explanation
- **sources:** _inbox/2026-09-16_pickup_list_planned_not_done.md

### BLK-288 -- 2026-09-15 -- n/a (X-ray metering)
- **stage:** gate
- **symptom:** a metering-acceptance function for overage billing had zero call sites anywhere in the codebase (amount always null); separately, MCP parameters meant to carry a billing verdict/brief were accepted by the schema and silently ignored downstream
- **root cause:** a ruling ('accept the meter tick') was made but never wired to any enforcement check -- a bisect found no single breaking commit because the gap dates to the file's original creation
- **how found:** a git bisect that found no culprit commit, then direct code reading
- **fix status:** unfixed -- 'the ruling carries an unenforced precondition' -- the row's own description
- **recurrence control:** none
- **cost:** n/a
- **sources:** _sessions/2026-09-15d_reports_envelope_arc_claude_code.md; _sessions/2026-09-15e_qa_reconciliation_and_async_cutover_claude_code.md

### BLK-307 -- 2026-09-14 -- n/a (Smart Site brief)
- **stage:** publish
- **symptom:** a customer-facing brief is open (unauthenticated/ungated) by default, which had been believed to be a deliberate ruling, but the actual finding is that NO atom exists anywhere in the brief's serving path for an access-policy field to gate against in the first place -- the access-policy code exists, but there is nothing for it to consult
- **root cause:** a serving path was built with no field carrying access-policy state at all; the one working access check anywhere nearby is a bespoke exception wired to nothing else
- **how found:** code reading of the actual serving path, not the assumed ruling
- **fix status:** unfixed -- ruled to wait for a prerequisite row (P-163) before being addressed
- **recurrence control:** none until P-163 lands
- **cost:** n/a
- **sources:** _sessions/2026-09-14_smart_site_lane_and_auth_gate_claude_code.md

### BLK-352 -- 2026-09-11 -- 6 CTX counties
- **stage:** rail-fill (envelope)
- **symptom:** a proposal to write a low-confidence, shape-only-derived buildable-area value (labelled as an approximation) to fill the road-frontage-input gap was reviewed and explicitly REJECTED
- **root cause:** the rejection's own stated reasoning: 'a labelled approximation loses its label at the next seam,' citing the StratMap-redistributed-dollars precedent (BLK-007) as the exact failure mode a labelled-but-fragile value produces downstream
- **how found:** a design review of a proposed fix, before it was built
- **fix status:** correctly ruled against; the four affected rails remain unaccounted pending real road-frontage acquisition, rather than being filled with a value expected to lose its caveat later -- n/a
- **recurrence control:** n/a — this is a case of a fix correctly NOT built; included in the register because it demonstrates the failure mode (BLK-007) being actively guarded against elsewhere, which is itself evidence the fleet has started to internalize the class
- **cost:** n/a
- **sources:** 90_operations/OPS-21_serve_completion_program.md

## C6 -- Sub-metre digitisation mismatch between independent source layers (2 instances)

### BLK-006 -- 2026-09-09/10 -- Bastrop
- **stage:** gate/publish
- **symptom:** 13 parcels held two counties at publish gate on schoolDistrict
- **root cause:** tx_school_district and tx_county_boundary independently digitised, shared edges miss 0.8-0.9m; strict ST_Intersects excluded physically-adjacent districts; parcel 11585 centroid 25.5m outside its own county ring
- **how found:** code reading after leading (wrong) hypothesis of degenerate geometry was rejected
- **fix status:** deployed -- fixed; applied Bastrop/McLennan/Travis
- **recurrence control:** none generalized to other independently-digitised layer pairs
- **cost:** n/a
- **sources:** _sessions/2026-09-10_MIDSESSION_ctx_completion_and_the_six_classes.md

### BLK-101 -- forensics run 2026-08-08; still unresolved as an operational risk 2026-09-16 -- Bell (48027)
- **stage:** acquire/instantiate (geometry)
- **symptom:** 694 StratMap-sourced Bell parcels sit fully NORTH of the Census Bell county line, overflow up to 5.9 miles; ruled to be an upstream CAD-jurisdiction reality (Bell Appraisal District's own tax-roll packaging), not a projection, ingest, or coordinate defect -- all four alternate hypotheses explicitly ruled out with measurements; census-county split of the 694 is ~75% McLennan/~25% Coryell (correcting an earlier audit's wrong 'all McLennan' claim)
- **root cause:** the appraisal district's own roll includes parcels physically outside the Census-defined county boundary as a matter of its own administrative practice, and the pipeline byte-copies the source faithfully (692/692 match) without a step that reconciles CAD-roll membership against the Census boundary
- **how found:** dedicated boundary forensics investigation
- **fix status:** ruled 'serve as-is'; unfixed as an operational risk -- all 580 usable overflow parcels already carry DECLINED buildable-envelope atoms, so practical risk is confined to (a) zoning facts keyed under the wrong county and (b) any future ring computation for those 694 parcels without an exclusion
- **recurrence control:** none built; the ruling accepts the divergence rather than reconciling it
- **cost:** n/a -- named directly as one reason Bell might be a weaker parallel partner for Milam in Phase 2
- **sources:** _inbox/2026-08-08_BELL_48027_boundary_forensics.md; _inbox/2026-09-16_texas_scaleup_program_scope.md

## C7 -- A value served with a label asserted by a constant, consumed by a check that cannot fail on it (40 instances)

### BLK-007 -- 2026-09-10 found; F25 recurs 09-15/09-16 -- McLennan(100%),Bastrop(~80%)
- **stage:** publish/serve
- **symptom:** StratMap-redistributed valuations served labelled source:cad_property, valueBasis:county-assessed, identical to genuine CAD values
- **root cause:** cadRollValue.ts hardcodes CAD_PROPERTY_SOURCE/COUNTY_ASSESSED_VALUE_BASIS as constants regardless of actual source_vintage/tier
- **how found:** 21 live MCP reads by a third-party review window
- **fix status:** fixed-undeployed/unconfirmed -- Stage B1 test specified (StratMap-tier must not serialise county-assessed); not confirmed landed; sibling defect F25 (label lying about vintage) recurred independently 2026-09-15/16 on two different writer jobs, still unfixed per 2026-09-16 scope doc
- **recurrence control:** none confirmed armed
- **cost:** n/a
- **sources:** _inbox/2026-09-10_ctx_third_party_review.md

### BLK-008 -- 2026-09-10 -- Travis
- **stage:** publish/serve
- **symptom:** systematic 10x gap between 2025 and 2026 valuation rows on same parcel (5 parcels, 10.0-11.2x)
- **root cause:** one of two vintages off by an order of magnitude; nothing compares a value across vintages or against a second source
- **how found:** live reads
- **fix status:** unfixed -- unresolved; which vintage is wrong 'not decidable read-only'
- **recurrence control:** S3 cross-vintage rule UNMEASURED on every real walk, nothing supplies its inputs
- **cost:** n/a
- **sources:** _inbox/2026-09-10_ctx_third_party_review.md

### BLK-010 -- 2026-09-10 -- cross-county
- **stage:** serve
- **symptom:** owner '-' served present; all-null value-history served present; acreage null with no state; tier field disagrees with vintage string
- **root cause:** sentinel/placeholder values pass through serve as real content, nothing checks against a sentinel list
- **how found:** live reads
- **fix status:** unfixed -- named collectively, no dedicated fix cited
- **recurrence control:** none
- **cost:** n/a
- **sources:** _inbox/2026-09-10_ctx_third_party_review.md

### BLK-035 -- 2026-08-28/29 -- Bastrop,Kyle,Taylor,Austin
- **stage:** instantiate (zoning verdict)
- **symptom:** every conformant-baked parcel without a zoning stamp in an unzoned-unincorporated-doctrine county served 'not-applicable: unincorporated', including parcels INSIDE Austin, Kyle, and Taylor city limits
- **root cause:** conformant assemble never mapped situsCity from the claim (present in the claim, null on all served rows including addresses that name the city); the serve predicate treated that null as evidence of unincorporated land instead of consulting city-limits containment (code for which exists and was uncalled)
- **how found:** a 4-gold cross-county probe
- **fix status:** deployed -- fixed same sprint (card F), verdict now derived from containment at serve on every county; canary smoke-tested on 7 real parcels before shift
- **recurrence control:** cityLimitsFactRead's honest 3-state read is now called by the predicate
- **cost:** n/a
- **sources:** 90_operations/OPS-19_factory_plan_of_record.md

### BLK-042 -- 2026-09-11 -- Travis / West Lake Hills
- **stage:** serve (situs/geocode)
- **symptom:** a parcel with 14 present facts rendered its land-use description under a label reading 'Zone', with 'No street address on the county record'
- **root cause:** resolver composes the geocode address from situsAddress only (Travis stores city in a separate field); cortex geocodes the bare street to a 422; the record already carries its own query point (30.29,-97.81) that the resolver never consults
- **how found:** OPS-23 F5, five live probes
- **fix status:** unfixed at finding -- no fix confirmed in later sources for this specific mechanism
- **recurrence control:** none
- **cost:** n/a
- **sources:** 90_operations/OPS-23_surface_completion_program.md

### BLK-044 -- 2026-09-11 -- Travis
- **stage:** serve (client timeout)
- **symptom:** the Feasibility Study 'times out on a cold start' per the user-facing error string, but the engine completes every Travis refresh in 85-154s (warm); both clients abort at a hardcoded 55s under a platform maxDuration of 60s
- **root cause:** PE and smartsite-mcp both hardcode REFRESH_TIMEOUT_MS/FEASIBILITY_ENGINE_TIMEOUT_MS=55000, shorter than the engine's real completion time for the larger county; the error string blames a cold start that never happened
- **how found:** OPS-23 F7, Cloud Logging timing read across 9 requests
- **fix status:** unfixed -- no fix confirmed
- **recurrence control:** none
- **cost:** n/a
- **sources:** 90_operations/OPS-23_surface_completion_program.md

### BLK-047 -- 2026-09-11 -- Bastrop
- **stage:** serve (customer-facing strings)
- **symptom:** MCP prints 'Withheld, setbacks unruled' in the draw block beside a present setbacks section for the same parcel; the feasibility PDF says 'no mapped structures... can proceed without demolition' beside sheets that say treat the site as improved
- **root cause:** two independently-composed strings for the same fact, one honest and one stale/wrong, printed on the same document with nothing cross-checking them
- **how found:** OPS-23 F10, same-document read
- **fix status:** unfixed at finding; recurs (see BLK-053, P-217/P-230 in the 2026-09-16 scope doc) -- pattern still present 2026-09-16 ('D2: a payload whose parts contradict refuses rather than printing both halves')
- **recurrence control:** proposed D2 fix not yet built as of 2026-09-16
- **cost:** n/a
- **sources:** 90_operations/OPS-23_surface_completion_program.md; _inbox/2026-09-16_texas_scaleup_program_scope.md

### BLK-053 -- 2026-09-12 -- Travis
- **stage:** serve (report composer)
- **symptom:** the PDF says 'no city-limits or ETJ boundary source is wired for this county yet' while the card (from the same record) prints a real cityLimits/ETJ value for all five probe parcels; two more fields (school district, water service) present on the card are entirely absent from the PDF
- **root cause:** cityLimits and ETJ are hardcoded CONSTANTS in the report-model path (set unresolved for every parcel, every county) rather than read from the record; the PDF prints raw internal tokens where the card prints human strings
- **how found:** PDF-vs-card comparison
- **fix status:** unfixed at finding -- owners named (P-152 lane 3 for source, P-167 for vocabulary); not confirmed fixed
- **recurrence control:** none confirmed
- **cost:** n/a
- **sources:** 90_operations/OPS-23_surface_completion_program.md

### BLK-075 -- root-caused 2026-09-14 -- Hays,Williamson
- **stage:** publish/serve
- **symptom:** GET .../node/48209:84629/facets returns HTTP 404 not_baked in production even though the store holds a fully baked, catalog-listed row with an earned retirement
- **root cause:** brokerageNodeFacets.ts deliberately discards a loaded row and returns null when the county is in a hardcoded LANDUSE_JOIN_DISABLED_FIPS_SEED set AND the row has an earned retirement -- deliberate serve-layer design, not a missing row; a republish recomputes the identical retirement from the identical CAD roll so no publish can ever fix it; decisive control test: an identical-shape retirement in Caldwell (not in the hardcoded set) serves 200 normally
- **how found:** reads/derivation, cross-checked with a decisive control parcel
- **fix status:** unfixed by design -- a production restamp was deliberately executed to obtain a falsifiable measurement: it WROTE a new run id but did NOT fix the 404 (retirement stayed retired, GET stayed 404) -- the pre-registered negative outcome. A fix to the WALK instrument (not the serve defect) was dispatched instead, conditioned on deriving its accept-a-404 decision from two independent store-side signals; that lane's own close does not appear anywhere in this wave's 24 commits, so it is unverified
- **recurrence control:** a related 404 on a different route was explicitly carded OUT of scope so it cannot be silently closed by the walk-side fix instead of the real serve-layer defect
- **cost:** one full production publish run spent deliberately to obtain the falsifiable measurement
- **sources:** OPS-23 wave-6 commits d23edddc..efa64de5

### BLK-103 -- named 2026-08-30, still open (proposed fix carded, not built) -- cross-county (Smart Site edges generally)
- **stage:** serve (edge/adjacency facts)
- **symptom:** draw.edges[] neighbor/adjacency fields serialize as flat facts with NO disposition field at all, unlike every other brief section which carries a 5-state vocabulary including refused/unknown; operator-observed 5 of 6 shared-boundary labels wrong on a live walk
- **root cause:** the edges subsystem never adopted the standard 5-state disposition vocabulary the rest of the brief uses, so a wrong or unverified adjacency label is served with the same implicit-present confidence as a correct one
- **how found:** operator-observed live walk
- **fix status:** unfixed -- proposed fix carded (X2, on P-92), not built
- **recurrence control:** none until built
- **cost:** n/a
- **sources:** _inbox/2026-08-30_edge_honesty_opinion_handoff.md

### BLK-128 -- 2026-09-13 -- any
- **stage:** serve/probe
- **symptom:** on a join not-found, the reader fabricates a place key known not to exist and serves it as the parcel's identity; a gate-verdict load wraps in a bare catch->null, collapsing connection failure/revoked-grant/genuinely-ungraded into one state
- **root cause:** parcel-record-reader.ts:161-162; parcel-record-db.ts:164-169 (ENG-25)
- **how found:** code reading
- **fix status:** unfixed -- the sibling 'ambiguous' path is a genuinely good control by contrast
- **recurrence control:** partial (ambiguous path refuses loudly)
- **cost:** n/a
- **sources:** _inbox/2026-09-13_assumption_register_engine.md

### BLK-129 -- 2026-09-13 -- any (~1.1e8 atoms)
- **stage:** atoms
- **symptom:** content hash relies on JSON.stringify key-insertion order (not canonical) and drops undefined; the hash function itself is a UTF-16 XOR, not a real FNV-1a as claimed by name
- **root cause:** fact-writer-ids.ts:34-49 (ENG-26)
- **how found:** code reading
- **fix status:** unfixed, undetected collision risk (not zero, not measured) -- birthday-collision arithmetic inferred (~3e-4), not measured
- **recurrence control:** none
- **cost:** n/a
- **sources:** _inbox/2026-09-13_assumption_register_engine.md

### BLK-152 -- 2026-09-13 (SHA 31d181c2) -- any boundary-adjacent parcel
- **stage:** rail-fill
- **symptom:** a vertex-sweep centroid-miss fallback returns the FIRST ring vertex's zoning hit; boundary parcels routinely land in the neighboring district with nothing recording the stamp came from a vertex, not a centroid
- **root cause:** zoning-stamp.ts:218-231 (LDT-01)
- **how found:** code reading
- **fix status:** unfixed, unmeasured -- module header falsely promises 'never a guessed district'
- **recurrence control:** none
- **cost:** n/a
- **sources:** _inbox/2026-09-13_assumption_register_ldt.md

### BLK-155 -- 2026-09-13 -- any PACS county
- **stage:** parse
- **symptom:** exemption flags read from a single-byte position; on the wrong layout any 'T' byte fabricates an exemption; charAt past string end returns '' silently, never throws
- **root cause:** pacs/parser.ts:237-239 (LDT-04, sub-case of LDT-03)
- **how found:** code reading
- **fix status:** unfixed, unmeasured -- drives homestead/disabled-veteran reasoning downstream
- **recurrence control:** none
- **cost:** n/a
- **sources:** _inbox/2026-09-13_assumption_register_ldt.md

### BLK-156 -- 2026-09-13 -- any PACS county on a different decimal scale than Caldwell
- **stage:** parse
- **symptom:** PACS acreage with no decimal point assumed to carry 4 implied decimals ('5' -> 0.0005 acres); no plausibility band
- **root cause:** normalize.ts:53-61, rule asserted from Caldwell only (LDT-05)
- **how found:** code reading
- **fix status:** unfixed -- n/a
- **recurrence control:** none
- **cost:** n/a
- **sources:** _inbox/2026-09-13_assumption_register_ldt.md

### BLK-157 -- 2026-09-13 -- any TxGIO/StratMap county beyond Hays/Comal
- **stage:** parse
- **symptom:** every DBF assumed UTF-8; the .cpg sidecar encoding file is never actually extracted despite a comment claiming it is honored
- **root cause:** cli.ts:167-168, parse.ts:59-60 (LDT-06)
- **how found:** code reading
- **fix status:** unfixed, verified against only Hays/Comal -- no replacement-char counting exists to detect the mismatch
- **recurrence control:** none
- **cost:** n/a
- **sources:** _inbox/2026-09-13_assumption_register_ldt.md

### BLK-158 -- 2026-09-13 -- any county with an uppercased DBF header (verified only against Hays/Comal/Bexar)
- **stage:** parse/identity
- **symptom:** DBF field names read exact-case; an uppercased header makes every value undefined, which cascades into a null-placeholder check returning TRUE for EVERY feature (widening the decline exception county-wide) AND destroys the point-to-prop_id join entirely
- **root cause:** parse.ts:459-460,614-620, landuse.ts:139,171-194 (LDT-07)
- **how found:** code reading
- **fix status:** unfixed, verified against 3 counties only -- cascading county-wide failure mode, not isolated
- **recurrence control:** none
- **cost:** n/a
- **sources:** _inbox/2026-09-13_assumption_register_ldt.md

### BLK-161 -- 2026-09-13 -- every non-PACS, non-StratMap path (Orion: Hays/Williamson; TAD: Tarrant; DCAD: Dallas)
- **stage:** parse
- **symptom:** a missing column in a header is treated as 'publisher doesn't carry this value'; a column RENAME (the most common CAD drift) is indistinguishable from a genuinely blank cell; no required-column declaration exists anywhere
- **root cause:** csv.ts:110-115, tad-propertydata/parser.ts:60-64 (LDT-10)
- **how found:** code reading
- **fix status:** unfixed -- n/a
- **recurrence control:** none
- **cost:** n/a
- **sources:** _inbox/2026-09-13_assumption_register_ldt.md

### BLK-162 -- 2026-09-13 -- Tarrant (TAD)
- **stage:** parse
- **symptom:** a pipe-delimited parser has no quote handling unlike its sibling CSV reader; an embedded pipe shifts every subsequent column; short rows silently yield empty tail columns
- **root cause:** tad-propertydata/parser.ts:46,62 (LDT-11)
- **how found:** code reading
- **fix status:** unfixed, unmeasured -- n/a
- **recurrence control:** none
- **cost:** n/a
- **sources:** _inbox/2026-09-13_assumption_register_ldt.md

### BLK-166 -- 2026-09-13 -- any city with co-published overlay+base zoning in one layer
- **stage:** rail-fill
- **symptom:** the 'first containing polygon wins' rule for overlapping zoning polygons uses ArcGIS's unordered fetch order as 'first' (compounds LDT-02's own unordered paging)
- **root cause:** zoning-stamp.ts:177-201 (LDT-15)
- **how found:** code reading
- **fix status:** unfixed, unmeasured -- n/a
- **recurrence control:** none
- **cost:** n/a
- **sources:** _inbox/2026-09-13_assumption_register_ldt.md

### BLK-169 -- 2026-09-13 -- any (mechanism behind the known situs-sentinel coverage inflation, cf BLK-001-class)
- **stage:** parse
- **symptom:** an address is assembled by joining non-blank fragments; a row with only a house number produces a bare-number string that reads as a populated address
- **root cause:** normalize.ts:73-81, pacs/parser.ts:278-284 (LDT-18)
- **how found:** code reading
- **fix status:** unfixed -- n/a
- **recurrence control:** none
- **cost:** n/a
- **sources:** _inbox/2026-09-13_assumption_register_ldt.md

### BLK-170 -- 2026-09-13 -- every county on these parse paths
- **stage:** parse
- **symptom:** 3 undeclared substitutions collapse distinct states with no field marking which happened: StratMap's 0-value is treated as absence; market value is silently substituted with appraised value; property-use code is silently substituted with a different vocabulary's improvement-or-land code
- **root cause:** landuse.ts:63-67, pacs/parser.ts:251-253,296-298 (LDT-19)
- **how found:** code reading
- **fix status:** unfixed, fires on every county on these paths -- needs a provenance column, not a probe, to fix
- **recurrence control:** none
- **cost:** n/a
- **sources:** _inbox/2026-09-13_assumption_register_ldt.md

### BLK-174 -- 2026-09-13, correct-by-construction only in McLennan -- any county outside McLennan
- **stage:** rail-fill
- **symptom:** a free-text legal-description acreage regex derived from McLennan is applied to all 254 counties unconditionally; a subdivision-total phrasing assigns the SAME acreage to every lot in the subdivision, silently, exactly in counties with no second source to contradict it
- **root cause:** p78Merge.ts:84-99, landuse.ts:184-193 (LDT-23)
- **how found:** code reading
- **fix status:** unfixed outside McLennan -- partial (scoped to GIS-area-refused rows only)
- **recurrence control:** partial
- **cost:** n/a
- **sources:** _inbox/2026-09-13_assumption_register_ldt.md

### BLK-176 -- 2026-09-13, Bastrop/Caldwell rely entirely on the fallback -- Bastrop,Caldwell
- **stage:** parse
- **symptom:** living-area segment identification uses exact-string match (silently misses spelling variants per segment); a prefix fallback over-matches a garage as living area
- **root cause:** pacs/parser.ts:132-139 (LDT-25)
- **how found:** code reading
- **fix status:** unfixed, unmeasured -- n/a
- **recurrence control:** none
- **cost:** n/a
- **sources:** _inbox/2026-09-13_assumption_register_ldt.md

### BLK-177 -- 2026-09-13 -- every TX city not among the 22 wired
- **stage:** rail-fill
- **symptom:** a null zoning stamp conflates 3 distinct situations (genuinely unzoned / zoned-but-not-in-our-22-city-registry / wired-but-truncated-fetch per LDT-02) with no unaccounted state distinct from absent
- **root cause:** zoning-layers.ts:112,533-540,29-33 (LDT-26)
- **how found:** code reading
- **fix status:** unfixed -- a probe was designed, not run
- **recurrence control:** none
- **cost:** n/a
- **sources:** _inbox/2026-09-13_assumption_register_ldt.md

### BLK-181 -- 2026-09-13 -- any county with CP1252 smart-quotes/dashes in owner/legal-description fields
- **stage:** parse
- **symptom:** deliberate/correct latin1 decoding for field-offset alignment still means CP1252 bytes 0x80-0x9F decode to C1 control chars -- minor corruption in owner_name/legal_description while field positions stay aligned
- **root cause:** pacs/parser.ts:77-82 (LDT-36)
- **how found:** code reading
- **fix status:** unfixed, minor, 'checked and cleared' for the main risk -- n/a
- **recurrence control:** none
- **cost:** n/a
- **sources:** _inbox/2026-09-13_assumption_register_ldt.md

### BLK-200 -- 2026-08-09 -- statewide (254)
- **stage:** completeness (Texas Completeness Manifest)
- **symptom:** a 4.76% headline completeness figure was actually 99.2% one doctrine string applied identically to all 254 counties; Harris rendered a satisfied-absent zoning verdict that correctly described unincorporated Harris but said nothing about Houston
- **root cause:** a single asserted string stood in for a real per-county measurement
- **how found:** audit
- **fix status:** corrected in two steps (to 0.0365% then 0.2134%) as a real scorer was wired in -- 'the first movement in the program's history representing measurement, not assertion'
- **recurrence control:** the real geometry-rail scorer replaces the assertion
- **cost:** n/a
- **sources:** _sessions/2026-08-09_statewide_acquisition_master_planner_close.md

### BLK-202 -- 2026-08-12, STILL OPEN at session close -- statewide RRC wells (1,396,049 staged)
- **stage:** completeness/type mapping
- **symptom:** an unmatched well-status code silently defaults to 'producing', and an unmatched well-type code silently defaults to 'oil'; measured exposure 563,935 of 1,396,049 wells (40.4%) hit the fallthrough across 43 codes, including 44,563 Canceled/Abandoned and 25,005 Injection/Disposal wells that would ship as confidently producing
- **root cause:** bare fallthrough returns in two mapping functions instead of an unknown state
- **how found:** code audit, blast radius grew mid-session as the statewide source landed
- **fix status:** NOT FIXED at session close -- a fix requires mapping legitimate values off a description field and failing closed on the rest, plus adding unknown to both unions
- **recurrence control:** none built yet
- **cost:** ~70,000 wells with a confidently false status pending fix
- **sources:** _sessions/2026-08-12_gate_closure_arc_claude_code.md

### BLK-206 -- 2026-08-19 -- Bastrop
- **stage:** ledger (zoning)
- **symptom:** Bastrop's flagship zoning completeness number (99.77%) was a straight copy of the envelope row's measurement; the real figure on the correct denominator was 79.60%, and the entire gap traced to one city (Smithville)
- **root cause:** a copy-paste of a sibling rail's measurement stood in for a real per-rail computation
- **how found:** a 2-day QA-to-enforcement audit
- **fix status:** unclear/not confirmed applied at range close -- n/a
- **recurrence control:** implied via the broader 3-state rework, not confirmed for this specific case
- **cost:** n/a
- **sources:** _sessions/2026-08-19_smartsite_qa_to_enforcement_claude_code.md

### BLK-239 -- 2026-07-27 -- Bastrop
- **stage:** instantiate (zoning provenance)
- **symptom:** a district source was real (the city's own GIS layer) but the live bake chain STRIPPED its provenance: 62,257 of 62,257 zoning-facts cited the internal bake URL instead of the GIS origin, jurisdiction null
- **root cause:** a bake pipeline dropped the source-attribution field between fetch and store
- **how found:** a pre-fan-out adversarial audit ('distrust the green')
- **fix status:** deployed -- data live-fixed (5,769/5,769 cite the GIS origin, jurisdiction 6,213/6,213); code PRs merged
- **recurrence control:** none generalized beyond this pipeline
- **cost:** n/a
- **sources:** _sessions/2026-07-27_bastrop_completion_multitrack_and_hardening_claude_code.md

### BLK-245 -- 2026-08-04 -- Caldwell
- **stage:** rail-fill (join)
- **symptom:** a parcel-ring fetch read a lowercase field name, but ArcGIS echoes the layer's real field CASING which on Caldwell's service is different -- every ring silently dropped
- **root cause:** case-sensitive field-name matching against a service that doesn't guarantee casing
- **how found:** live probe
- **fix status:** deployed -- fixed (#246), case-insensitive match, both casings unit-tested
- **recurrence control:** the unit test
- **cost:** n/a
- **sources:** _sessions/2026-08-04_wave1_wave2_county_fan_claude_code.md

### BLK-247 -- 2026-08-04 -- Bastrop (McDade CDP)
- **stage:** instantiate (near-miss, caught by dry-run discipline)
- **symptom:** a dry-run predicted 38,026 parcels would be reworded to imply an unonboarded jurisdiction, but the mode's city-membership signal was the situs-city tenant tag, not true city-limits membership, and the sample was an unincorporated CDP where the county itself IS the onboarded jurisdiction
- **root cause:** a proxy signal (tenant tag) was used where the real signal (city-limits polygon) was needed
- **how found:** dry-run-first discipline caught it before apply
- **fix status:** caught before any write; apply never ran -- n/a
- **recurrence control:** the dry-run-first practice itself
- **cost:** n/a -- a near-miss, not an incident
- **sources:** _sessions/2026-08-04_scale_ops_continuation_smithville_proven_claude_code.md

### BLK-259 -- 2026-08-10 -- a Dallas parcel (39.5 acres)
- **stage:** serve (site-plan export)
- **symptom:** a parcel with NO setback atom on file printed 'buildable = 100% of the lot, zero setback' in a site-plan export, while the sheet's own legend correctly said 'no setback rule on file' on the same document
- **root cause:** missing setback data was silently computed as a ZERO inset instead of triggering an honest refusal
- **how found:** live export review
- **fix status:** deployed -- fixed upstream (engine #298) so every consumer inherits the correction; a reported residual case turned out to be a misread of a deliberate demo fixture, not a real bug
- **recurrence control:** the upstream fix, inherited by all consumers
- **cost:** n/a
- **sources:** _sessions/2026-08-10_five_rails_and_write_throughput_claude_code.md; _sessions/2026-08-10_write_path_rails_and_harvest_claude_code.md

### BLK-269 -- measured 2026-09-16 -- Pflugerville (Travis)
- **stage:** serve (customer experience)
- **symptom:** a card for a real address read only 'Travis County' with no city name at all, though the ledger holds the correct city, ZIP, and zoning jurisdiction key for the parcel
- **root cause:** the map adapter still sources the situs family from an older cortex read path rather than the ledger, and the zoning row shows a bare district code without its governing jurisdiction name
- **how found:** operator's own live example, which also drove the correction of an earlier wrong hypothesis about envelope drawing (see BLK-264)
- **fix status:** unfixed -- proposed fix (X2) not yet built as of 2026-09-16
- **recurrence control:** none
- **cost:** n/a -- a customer reading this card cannot tell which city's zoning code actually governs their parcel
- **sources:** _inbox/2026-09-16_texas_scaleup_program_scope.md

### BLK-281 -- 2026-09-15 -- cross-county
- **stage:** publish
- **symptom:** seven distinct instances of a served payload contradicting ITSELF were found in one session alone (the repealed-ordinance case above is one of the seven)
- **root cause:** no internal-consistency check runs at serve time across a payload's own sections
- **how found:** repeated live payload reads
- **fix status:** unfixed as a class (individual instances fixed piecemeal) -- n/a
- **recurrence control:** none generic
- **cost:** n/a -- named as its own emerging class, distinct from but closely related to C7 and to the earlier-found OPS-23 F10/F17 pattern (BLK-047/051)
- **sources:** _sessions/2026-09-15_mcp_surface_and_bastrop_recovery_claude_code.md

### BLK-316 -- 2026-09-15 -- n/a (envelope serving path)
- **stage:** publish
- **symptom:** a planner claimed a row was 'not customer-done' based on an MCP-only read, despite the row's own dispatch explicitly warning to verify on the MAP surface, not the API -- and separately, deeper investigation found the MCP has in fact NEVER carried an envelope polygon for any parcel at all, a real and distinct gap from the claim being checked
- **root cause:** a dispatch's own explicit warning against a known-misleading verification path was not followed; separately, the baked-facets route unconditionally nulls the envelope field and the MCP has no live-derive path to fill it, unlike the map surface which does
- **how found:** re-verification against the dispatch's own stated warning
- **fix status:** the immediate false claim was corrected in-session; the underlying MCP-envelope gap (a real, separate defect) remains open -- n/a
- **recurrence control:** none for the underlying MCP gap
- **cost:** n/a
- **sources:** _sessions/2026-09-15e_qa_reconciliation_and_async_cutover_claude_code.md

### BLK-317 -- 2026-09-15/16 -- n/a (site-plan export)
- **stage:** rail-fill/atoms
- **symptom:** within two minutes of an async cutover for a compute-heavy export path, a job failed at ~116 seconds under the new async model, initially read as a regression caused by the cutover itself
- **root cause:** not a regression at all -- the underlying compose step has always failed at roughly this duration (within a previously-measured 56.8-115.9 second band, see BLK-297); the OLD synchronous path's own fixed client-side timeout had simply been misclassifying this same failure as a generic timeout instead of surfacing the real compose-step duration, so the cutover did not cause the defect, it exposed a pre-existing one that had been hidden under a wrong error label
- **how found:** reading the job table directly rather than trusting the new error's surface label
- **fix status:** unfixed, carded (P-244) -- n/a
- **recurrence control:** none yet
- **cost:** n/a -- the same underlying defect as BLK-297's site-plan-export instance, now correctly attributed rather than hidden
- **sources:** _sessions/2026-09-15e_qa_reconciliation_and_async_cutover_claude_code.md

### BLK-338 -- 2026-09-14 -- Hays
- **stage:** serve
- **symptom:** an earned retirement (a real, checked, 'this account is not on the current roll' state) was served through one route as `parcelExists:false` / `parcel_not_found` — a stronger, different, and false claim than the underlying record actually supports
- **root cause:** a vocabulary collapse: the highest-quality absence state a record can carry was flattened into the same signal as 'this parcel was never real'
- **how found:** a live depth-node read
- **fix status:** unfixed, explicitly blocked on a separate row (P-212) because fixing this naively would take 92.5% of Bastrop dark (the same false-retirement population as BLK-025) -- n/a
- **recurrence control:** none until the blocking row resolves
- **cost:** n/a
- **sources:** 90_operations/OPS-16_texas_market_plan_of_record.md (A-080 range)

### BLK-343 -- 2026-09-15 -- n/a
- **stage:** serve
- **symptom:** a single MCP tool response CONTRADICTS ITSELF depending only on a depth parameter for the identical parcel: one depth reports the envelope 'present' by citing one field's disposition, the other depth refuses the polygon by citing a different field's state — two different underlying facts served under one shared field name
- **root cause:** one field name is overloaded to carry two semantically different dispositions depending on which code path composed the response
- **how found:** a cross-depth comparison on the same parcel
- **fix status:** unfixed at the time of the finding -- n/a
- **recurrence control:** none
- **cost:** n/a
- **sources:** 90_operations/OPS-16_texas_market_plan_of_record.md (A-080 range)

### BLK-360 -- n/a -- n/a
- **stage:** n/a (scoring/reporting)
- **symptom:** a scoring rule's human-readable prose note (correct, and it warned of a real gap) and its structured, machine-read field (whose denominator did not match the live row count) DIVERGED — any programmatic consumer received the false half of the disagreement, and only a human reading the prose note directly ever saw the true half
- **root cause:** a prose explanation and a structured field describing the same fact were maintained independently and allowed to disagree
- **how found:** a direct comparison of the two representations of the same fact
- **fix status:** n/a — named as a standing finding -- n/a
- **recurrence control:** none confirmed
- **cost:** every automated consumer of this scoring rule received the wrong half of the story
- **sources:** 61_enforcement_doctrine.md

## C8 -- False earned states (24 instances)

### BLK-012 -- 2026-09-10 -- cross-county
- **stage:** publish
- **symptom:** production publish writes rows+freshness+succeeded status BEFORE the production walk runs; failed walk leaves rows live; no unpublish
- **root cause:** no gate blocks the write on walk failure; sibling guard doesn't compare pins; --skip-walk allowed on production
- **how found:** code reading (defect 2)
- **fix status:** unfixed -- leave-behind F-08, no later confirmation of a fix
- **recurrence control:** none
- **cost:** n/a
- **sources:** _inbox/2026-09-10_ctx_third_party_review.md

### BLK-024 -- 2026-09-13 code-level; measured at scale 2026-09-16 (219,472 parcels) -- all six / 54 no-table cities + district-miss cities
- **stage:** rail-fill (setbacks)
- **symptom:** 3 factory write paths write absent-verified when no corpus table exists, a district matcher misses, or geometry is absent; 219,472 parcels carry false 'checked, none required' setbacks (125,212 district-in-table misses + 94,260 in 54 no-table cities)
- **root cause:** parcel-setback-cells.mjs buildNoRuledTableCells and buildResolvedCells write absent-verified instead of unaccounted/refused; parcelAreaSqFt included, land cannot have an absent area
- **how found:** code reading 2026-09-13; measured at parcel grain by a per-city/district census 2026-09-16
- **fix status:** unfixed -- quoted customer impact: 'Waco carries 37,513 parcels with setback values and not one buildable atom'; proposed fix S1 not yet built as of 2026-09-16
- **recurrence control:** ENFORCEMENT names the class directly ('never convert unaccounted to absent-verified'); no automated guard catches new instances
- **cost:** n/a -- largest single false-earned-state defect measured in the program
- **sources:** _inbox/2026-09-13_dead_controls_ranked_fixes.md; _inbox/2026-09-16_texas_scaleup_program_scope.md

### BLK-025 -- 2026-09-15 -- Bastrop
- **stage:** instantiate (parcel-node reconcile)
- **symptom:** a reconcile marked 57,704 of 62,394 parcel-node atoms retired -- 92.5% of the county; 19 of 20 sampled retirements were live at the county's own public cadastral service
- **root cause:** presence-shaped set-difference against ONE upstream source decided both existence and gone-ness; a second independent source (parcelCurrencyFromBcadMap) existed in the same script but ran AFTER the gate in the loop and never fired once the gate had declined
- **how found:** accident -- a lane chasing a single parcel for an unrelated row
- **fix status:** partially fixed -- close(P-212): 56,691 recovered; but pickup list item X3 (2026-09-16) still lists '1,013 Bastrop nodes still retired' as residual, plus 'live-currency checks for the other 5 counties, never run'
- **recurrence control:** blast-radius refusal proposed (a writer retiring >X% of a county refuses and writes nothing) -- P-213, still 'canon since 2026-09-15, code still unbuilt' per pickup list X2
- **cost:** 12 days silent because serve never consulted parcel-node status (which is also the only reason it did not cause an outage)
- **sources:** ENFORCEMENT.md; _inbox/2026-09-16_pickup_list_planned_not_done.md

### BLK-057 -- 2026-09-13 -- Bastrop
- **stage:** serve (export refresh)
- **symptom:** two feasibility export calls a minute apart returned byte-identical PDFs whose CreationDate is 2 hours OLDER than the engine revision that was supposed to have produced a fresh one
- **root cause:** unresolved among three candidates: a cached 200, a silently-failing refresh job, or the MCP skipping the refresh hop entirely; no Cloud Run job for feasibility exists in either project to check directly
- **how found:** repeated live exports by the overseer
- **fix status:** unfixed -- row reopened (p155-refresh)
- **recurrence control:** none until root cause is found
- **cost:** n/a
- **sources:** 90_operations/OPS-23_surface_completion_program.md

### BLK-080 -- raised 2026-09-14 11:15, refuted 11:33 -- Bastrop
- **stage:** instantiate/atoms (writer path)
- **symptom:** feared: a factory job template pinned an older contract version than the live package, which would silently drop a new field on write
- **root cause:** refuted at source -- the write path does only identity/write-boundary assertions and serializes the payload verbatim with zero contract-version validation anywhere; the REAL silent-no-op risk found instead: a downstream field is only added when an UPSTREAM detector has already fired at an earlier stage, so if that detector's timing slips, a re-mint write 'succeeds' with nothing visibly changed
- **how found:** direct code reading, refuting a plausible hypothesis before it drove a decision
- **fix status:** unmitigated procedurally -- no version gate exists to add (there was nothing to gate); the detector-timing dependency was documented, not fixed
- **recurrence control:** none named beyond documentation
- **cost:** n/a
- **sources:** OPS-23 wave-6 commits d23edddc..efa64de5

### BLK-089 -- 2026-09-09 -- Caldwell
- **stage:** gate
- **symptom:** 25 of 25 Caldwell zoning rails graded 'value' when 3 were actually absences
- **root cause:** classifyRequiredLeaf passed any UNRECOGNISED declared state through as populated instead of refusing it
- **how found:** code reading
- **fix status:** deployed -- fixed same day
- **recurrence control:** none generalized
- **cost:** n/a
- **sources:** _sessions/2026-09-09_ctx_bake_run_claude_code.md

### BLK-091 -- 2026-09-09 -- all six
- **stage:** serve
- **symptom:** zoningSource mirror dropped 'refused' state, serving raw 'stamp-missing' instead
- **root cause:** the mirror projected only 2 of the 3 real earned states
- **how found:** code reading
- **fix status:** deployed -- CTX-MIRROR fixed
- **recurrence control:** none generalized
- **cost:** n/a
- **sources:** _sessions/2026-09-09_ctx_bake_run_claude_code.md

### BLK-109 -- 2026-09-13 -- Tarrant (28,665 known)
- **stage:** rail-fill
- **symptom:** a single counter conflates two different causes (legit multi-feature accounts vs zero-pad collisions) into one number
- **root cause:** foldedExtraFeatures counts both without distinguishing them
- **how found:** code reading (ENG-06)
- **fix status:** unfixed -- cause-(b) unmeasured
- **recurrence control:** an ENG-02 query would split it, not built
- **cost:** n/a
- **sources:** _inbox/2026-09-13_assumption_register_engine.md

### BLK-112 -- 2026-09-13 -- any (1,523,640 atoms, Harris cited)
- **stage:** atoms
- **symptom:** dedupe on atom_did silently collapses N rows to 1; the caller reports the PRE-dedupe count as atomsWritten, and write-then-verify re-reads the same collapsed row for both sides -- so a '1,523,640/1,523,640 verified' headline proves nothing about true row count
- **root cause:** property-atom-batch-write.ts reports out.length not byDid.size (ENG-09)
- **how found:** code reading
- **fix status:** unfixed, unmeasured population -- one-line fix identified, not applied
- **recurrence control:** none
- **cost:** n/a
- **sources:** _inbox/2026-09-13_assumption_register_engine.md

### BLK-117 -- 2026-09-13 -- any
- **stage:** rail-fill
- **symptom:** non-array exemption_codes (delimited text/JSON string/null) silently becomes null -- a whole county can carry zero exemption flags
- **root cause:** write-owner-fact-county.mjs:289 (ENG-14)
- **how found:** code reading
- **fix status:** unfixed, unmeasured -- n/a
- **recurrence control:** none
- **cost:** n/a
- **sources:** _inbox/2026-09-13_assumption_register_engine.md

### BLK-123 -- 2026-09-13 -- any
- **stage:** acquire/rail-fill
- **symptom:** keyset pagination cursor uses strictly-greater prop_id, not proven unique within (county,tax_year); duplicate keys silently skip rows, which then read as manufactured 'no-cad-row' absences
- **root cause:** write-owner-fact-county.mjs:271-318 (ENG-20)
- **how found:** code reading
- **fix status:** unfixed, unmeasured -- n/a
- **recurrence control:** none
- **cost:** n/a
- **sources:** _inbox/2026-09-13_assumption_register_engine.md

### BLK-125 -- 2026-09-13 -- Tarrant (28,665 known, 532-row account example)
- **stage:** instantiate
- **symptom:** account geometry judged from the lowest-feature-index 'primary' only; a good sibling ring can be ignored (fabricating an absence) or a bad reducible primary served as resolved
- **root cause:** plan-county-parcel-nodes.ts:477-516 (ENG-22)
- **how found:** code reading
- **fix status:** unfixed -- extras counted but not surfaced as a state
- **recurrence control:** none
- **cost:** n/a
- **sources:** _inbox/2026-09-13_assumption_register_engine.md

### BLK-136 -- 2026-09-13 -- any
- **stage:** completeness
- **symptom:** fillCountyWide never asserts recordsWritten===landing.n; a page loop that exits early leaves no trace
- **root cause:** parcel-record-fill.mjs:904-971 (FAC-08)
- **how found:** code reading
- **fix status:** unfixed -- n/a
- **recurrence control:** none
- **cost:** n/a
- **sources:** _inbox/2026-09-13_assumption_register_factory.md

### BLK-137 -- 2026-09-13 -- any
- **stage:** acquire/instantiate
- **symptom:** keyset pagination on prop_id in the landing table has unasserted uniqueness; a duplicate boundary key can silently drop a second row
- **root cause:** parcel-record-fill.mjs:252-257,908 (FAC-09)
- **how found:** code reading
- **fix status:** unfixed, unmeasured (no DB access) -- n/a
- **recurrence control:** none
- **cost:** n/a
- **sources:** _inbox/2026-09-13_assumption_register_factory.md

### BLK-138 -- 2026-09-13 -- every non-corpus city in the 5 in-scope counties
- **stage:** rail-fill
- **symptom:** a city corpus key is guessed as slugify(name)+'-tx' except 2 hand-overridden cities; a key mismatch silently routes into the false-absent-verified path (BLK-024) at full confidence
- **root cause:** parcel-setback-cells.mjs:129-141 (FAC-12)
- **how found:** code reading
- **fix status:** unfixed, unmeasured outside the corpus package -- only a 2-entry hand override list exists
- **recurrence control:** none
- **cost:** n/a
- **sources:** _inbox/2026-09-13_assumption_register_factory.md

### BLK-141 -- 2026-09-13 -- any
- **stage:** rail-fill/completeness
- **symptom:** per-city counters report the batch BUILT, not the batch actually MOVED by the gated UPDATE; a join-key mismatch that moves nothing prints the same large value=N as a real first run
- **root cause:** parcel-setback-cells.mjs:379-480 (FAC-16)
- **how found:** code reading
- **fix status:** unfixed -- a computed-but-discarded count exists (candidateCells), not surfaced
- **recurrence control:** none
- **cost:** n/a
- **sources:** _inbox/2026-09-13_assumption_register_factory.md

### BLK-143 -- 2026-09-13 -- any (depends on jurisdiction-layer correctness)
- **stage:** instantiate
- **symptom:** 18 zoning/envelope rails are permanently stamped not-applicable at row-creation from a jurisdiction disposition; the UPSERT contract refuses to ever downgrade a non-unaccounted cell, so a misclassified stamp can never be ordinarily revisited
- **root cause:** instantiate.js:29-33, rail-keys.js:94-113 (FAC-18)
- **how found:** code reading
- **fix status:** unfixed, permanent -- n/a
- **recurrence control:** partial (ambiguous case fails closed)
- **cost:** n/a
- **sources:** _inbox/2026-09-13_assumption_register_factory.md

### BLK-149 -- 2026-09-13 -- any county with heavily not-applicable rails
- **stage:** completeness
- **symptom:** cell verdict logic counts not-applicable as 'satisfied' identically to 'populated'; given the false not-applicable stamps named elsewhere (FAC-18/19), a fully-not-applicable cell reads as full coverage
- **root cause:** cells.mjs:30 (FAC-27)
- **how found:** code reading
- **fix status:** unfixed -- n/a
- **recurrence control:** none
- **cost:** n/a
- **sources:** _inbox/2026-09-13_assumption_register_factory.md

### BLK-153 -- 2026-09-13 -- Austin,San Antonio,Killeen (already broke a different paging assumption here)
- **stage:** acquire
- **symptom:** ArcGIS resultOffset paging has no orderByFields and no cross-check against the layer's own count; a short page ends the fetch early with zero record; a metadata-fetch failure silently falls back to a default page size
- **root cause:** zoning-service.ts:231-264,194-210 (LDT-02)
- **how found:** code reading
- **fix status:** unfixed -- n/a
- **recurrence control:** none
- **cost:** n/a
- **sources:** _inbox/2026-09-13_assumption_register_ldt.md

### BLK-165 -- 2026-09-13 -- any (risk if a second subdirectory ever appears in a source archive)
- **stage:** acquire/parse
- **symptom:** zip extraction flattens every entry to its basename in one work directory; two same-named entries in different subdirectories silently overwrite each other
- **root cause:** zip.ts:89 (LDT-14)
- **how found:** code reading
- **fix status:** unfixed, unmeasured (TxGIO archives documented as single-dir today) -- n/a
- **recurrence control:** none
- **cost:** n/a
- **sources:** _inbox/2026-09-13_assumption_register_ldt.md

### BLK-252 -- 2026-08-09 -- Wood,Henderson,Liberty (El Paso would-be 4th)
- **stage:** acquire
- **symptom:** StratMap null placeholders halted acquisition 3 times; a proposed attributes-only fix, if shipped, would have over-dropped 10,837 VALID parcels in Wood County alone (1,168-to-1 ratio); a separate skip path incremented only a bare counter, and Liberty alone silently lost 1,145 real records with real identity fields and no trace
- **root cause:** a proposed weakened guard was measured before shipping and found to over-drop; a separate skip path recorded no identity for what it dropped
- **how found:** measurement of the proposed fix's blast radius before shipping it
- **fix status:** the correct fix (decline-with-identity) shipped instead of the weaker one -- every declination now carries identity
- **recurrence control:** identity-carrying declines going forward
- **cost:** 1,145 records silently lost with no trace before the fix (Liberty alone)
- **sources:** _sessions/2026-08-09_statewide_acquisition_master_planner_close.md

### BLK-267 -- measured 2026-09-16 -- Bastrop,Caldwell,Hays,McLennan
- **stage:** rail-fill (agValuation)
- **symptom:** agValuation passes only in Williamson and Travis under the current ruling, despite the operator ruling agValuation Texas-wide the same day; the other 4 counties hold 318,000 cells honestly unaccounted, but a never-run 'not-applicable sweep' exists in the codebase that, if it ever ran, would silently relabel all 318,000 as not-applicable (does-not-apply) rather than not-yet-acquired -- and separately, the gate ALREADY reports this rail as excluded with an unaccounted count of ZERO in those four counties today, an instance of the exact empty/undercounted-denominator class named elsewhere (BLK-017/018/147/151)
- **root cause:** the factory only has real ag-valuation sources wired for 2 of 6 counties; a dormant sweep exists that would write a false not-applicable state (matching class C8) if ever triggered; the gate's own accounting mechanism (A-153) already reports the rail's real gap as nothing
- **how found:** live rail-verdict read + code reading of the sweep
- **fix status:** unfixed -- proposed fix (L4): acquire ag valuation for the 4 counties from each CAD, and DELETE the dormant sweep so it can never write the false state -- not yet done as of 2026-09-16
- **recurrence control:** deleting the dormant code is itself the proposed recurrence control, not yet applied
- **cost:** 318,000 cells; directly named as the reason P-201 (the excluded-state split) must come before agValuation acquisition, or the acquisition's own gap would again read as invisible
- **sources:** _inbox/2026-09-16_texas_scaleup_program_scope.md; _decisions/2026-09-16_texas_scaleup_sequence_and_four_rulings.md

### BLK-348 -- 2026-08-27 -- Bastrop
- **stage:** publish/verify
- **symptom:** a dry-run execution terminated with a status of success and wrote a real freshness stamp into the ledger, indistinguishable from a genuine completed write
- **root cause:** the ledger's completion-status logic did not distinguish a dry run from a real write
- **how found:** a code audit after the false-success pattern was suspected
- **fix status:** deployed -- fixed with a failing-fixture test asserting a dry run can never terminate as success
- **recurrence control:** the fixture test itself
- **cost:** n/a
- **sources:** 90_operations/OPS-19_factory_plan_of_record.md

### BLK-351 -- 2026-09-04 -- Williamson, Caldwell
- **stage:** completeness
- **symptom:** a readiness gate's chosen denominator (a raw CAD account roll) does not match its real target (a distinct parcel population, where one parcel can hold many accounts, e.g. a condo tower); this false denominator mismatch produced FALSE under-instantiation refusals for two counties
- **root cause:** a parcel is not an account, and the gate's denominator conflated the two populations
- **how found:** reading the actual write-path SQL rather than trusting the gate's own output
- **fix status:** deployed -- re-measured as a real id-set intersection, both counties confirmed at effectively 100% real instantiation once measured correctly
- **recurrence control:** the corrected denominator definition
- **cost:** two counties wrongly refused by the readiness gate before the denominator was corrected
- **sources:** 90_operations/OPS-19_factory_plan_of_record.md

## C9 -- Controls that cannot fail by construction (82 instances)

### BLK-011 -- 2026-09-10 found; still true 2026-09-16 -- all six
- **stage:** serve/capability
- **symptom:** plural search refuses constraint_projection_missing for all six counties while advertised
- **root cause:** projection table has no writer anywhere; migration 0094 handed back unapplied
- **how found:** code reading
- **fix status:** unfixed -- still refusing per 2026-09-16 scope doc's live rail table
- **recurrence control:** none
- **cost:** n/a
- **sources:** _inbox/2026-09-10_ctx_third_party_review.md

### BLK-014 -- 2026-09-09 -- Travis
- **stage:** gate/publish
- **symptom:** pre-bake refusal logged bare 'RAIL_REFUSED' with no rail name, unattributable
- **root cause:** gate overwrote its per-rail rows and logged only the code
- **how found:** live-state read
- **fix status:** unfixed at finding -- fix proposed (record refusing rail's name before Travis re-run), not confirmed armed
- **recurrence control:** proposed only
- **cost:** n/a
- **sources:** _inbox/2026-09-10_ctx_third_party_review.md

### BLK-016 -- 2026-09-10 -- cross-county
- **stage:** gate
- **symptom:** pin-staleness gate blind to workspace bare specifiers; a vintage change passes staleness check while changing every bake's tax year
- **root cause:** bake-module-graph.mjs dependency walk does not resolve workspace package specifiers
- **how found:** code reading
- **fix status:** unfixed -- leave-behind backlog
- **recurrence control:** none
- **cost:** n/a
- **sources:** _inbox/2026-09-10_ctx_third_party_review.md

### BLK-017 -- 2026-09-13 found; still live 2026-09-16 -- any county, esp. Burnet/Bell/Milam
- **stage:** gate (P-195)
- **symptom:** evaluateRailGate returns ok:true on zero earned cells; total absence passes, partial absence refuses (inverted)
- **root cause:** factory publish-gate.js + engine publish-gate.ts:171-188 carry identical predicate cells.some(isEarnedCell) over only cells handed to the call, can't distinguish 'declared ahead, unsourced' from 'never filled'; possibly-independent duplicate implementations
- **how found:** code reading
- **fix status:** unfixed -- fix designed 2026-09-13 (P-181 entry1); confirmed NOT landed by fresh trace 2026-09-14; still THE live gate defect per 2026-09-16 scope doc ('a clean verdict is compatible with an empty county')
- **recurrence control:** none armed; empty-county violation fixture named but not run against a real fix
- **cost:** n/a
- **sources:** _inbox/2026-09-13_dead_controls_ranked_fixes.md; _inbox/2026-09-14_ops24-teardown_close.json; _inbox/2026-09-16_texas_scaleup_program_scope.md

### BLK-018 -- 2026-09-13 found; still true 2026-09-16 -- 217 TX-LANDING-ABSENT counties; any brand-new county
- **stage:** gate (pre-publish readiness)
- **symptom:** evaluatePopulation returns ok:true for a county with no roll and no landing at all
- **root cause:** publish-readiness-gate.mjs: every ratio refusal gated on code==='OK'; EMPTY_DENOMINATOR is neither 'OK' nor 'KEYSPACE_MISMATCH' so skips every refusal; BAKE_POPULATION_MISSING requires roll.size>0 so doesn't fire either
- **how found:** code reading
- **fix status:** unfixed -- same status as BLK-017: designed, not landed, live gate defect as of 2026-09-16
- **recurrence control:** proposed fix (EMPTY_DENOMINATOR->unmeasured, never pass) not implemented
- **cost:** n/a
- **sources:** _inbox/2026-09-13_dead_controls_ranked_fixes.md; _inbox/2026-09-16_texas_scaleup_program_scope.md

### BLK-019 -- 2026-09-13 found (3), corrected to 6 on 09-14; unfixed 09-16 -- any (esp. next new county -- Burnet)
- **stage:** rail-fill (P-192)
- **symptom:** 6 engine writers (owner, land-use, flood-hazard, rail-corridor, RRC-pipeline, special-district) throw LeaseRequiredError on first write batch under current lease code
- **root cause:** pg-storage.ts:305-307 makes lease mandatory in body, optional in signature; all 6 writers call with 1 arg; narrower than first stated -- these are RE-RUN failures (flood cells already serve today from an earlier successful run)
- **how found:** code reading, corrected by a second lane reading all 7 writer scripts
- **fix status:** unfixed -- proposed fix: take/pass lease as write-parcel-node-county.mjs does; still unfixed per 2026-09-16 pickup list item L7/C2/P-192
- **recurrence control:** non-vacuity guard (OPS-21 S3) proposed, not built
- **cost:** n/a -- lands Burnet missing owner/land-use/flood rails on day one
- **sources:** _inbox/2026-09-13_dead_controls_ranked_fixes.md; _inbox/2026-09-16_texas_scaleup_program_scope.md; _inbox/2026-09-16_pickup_list_planned_not_done.md

### BLK-020 -- 2026-09-13 -- n/a code-level
- **stage:** atoms
- **symptom:** assertEdgesNotStarved can never disagree -- both sides derived from same input by same function family before the write
- **root cause:** write-boundary.ts:151-162, call site computes expected+linksWritten from same pre-write data
- **how found:** code reading
- **fix status:** unfixed -- fix proposed (move inside transaction, pass persisted count), not confirmed implemented
- **recurrence control:** none
- **cost:** n/a
- **sources:** _inbox/2026-09-13_dead_controls_ranked_fixes.md

### BLK-021 -- 2026-09-13 -- Williamson / Thrall
- **stage:** instantiate/serve
- **symptom:** facetCoverage.baseFacts=true for a parcel with zero situs coverage and empty CAD roll
- **root cause:** nodeFacetTier1Assemble.ts:414 computes baseFacts from apn!=null||situsAddress!=null; apn comes from the node id, present by construction
- **how found:** code reading; live fixture 48491:R007189 (Thrall) confirmed
- **fix status:** unfixed -- fix proposed (exclude join key from predicate), not confirmed implemented
- **recurrence control:** Thrall became the standing fixture for future verification
- **cost:** n/a
- **sources:** _inbox/2026-09-13_dead_controls_ranked_fixes.md

### BLK-022 -- 2026-09-13 -- n/a code-level, all wired cities
- **stage:** rail-fill (zoning)
- **symptom:** resolveZoningJurisdiction two consecutive branches return identical expression -- registry check constrains nothing
- **root cause:** zoning-layers.ts: `if(stamped&&ZONING_LAYERS[stamped])return stamped; if(stamped)return stamped;`
- **how found:** code reading
- **fix status:** unfixed -- flagged as design question, not confirmed fixed
- **recurrence control:** none
- **cost:** n/a
- **sources:** _inbox/2026-09-13_dead_controls_ranked_fixes.md

### BLK-023 -- 2026-09-13 -- n/a code-level
- **stage:** gate (CI)
- **symptom:** CI step 'pin SHA must not move' actually asserts a sha256 digest is 64 chars -- always true
- **root cause:** pin-divergence.test.mjs asserts typeof/length instead of comparing an expected digest
- **how found:** code reading
- **fix status:** unfixed -- described as 'worse than dormant... armed, green' by an independent re-derivation (FAC-24)
- **recurrence control:** none
- **cost:** n/a
- **sources:** _inbox/2026-09-13_dead_controls_ranked_fixes.md

### BLK-026 -- 2026-08-20 -- n/a fleet tooling
- **stage:** n/a (governance)
- **symptom:** 16 CLOSE_OVERRIDE rows in dispatch_overrides.log, 11 in one day, every reason string identical ('CLOSE_OVERRIDE=1 on git push'), no seat or dirty-file recorded
- **root cause:** a mandatory 'reason' field is presence-shaped -- nothing reads or varies it, so it is ceremony not justification
- **how found:** code/log reading (ENFORCEMENT's own worked example)
- **fix status:** fixed-partial -- from the 2026-08-20 proof row onward the log writes target= and cwd=; the historical 11 stay a rate without reasons
- **recurrence control:** target/cwd fields now written going forward
- **cost:** n/a
- **sources:** ENFORCEMENT.md

### BLK-027 -- 2026-08-21 (added); armed 2026-08-30 -- cross-repo
- **stage:** n/a (planner verification discipline)
- **symptom:** the planner made 10 wrong load-bearing statements in one session, from ad hoc shell-built instruments; a prose-only ENFORCEMENT rule ('read the authoritative record') did not bind for 9 days across 3 documented violations before being armed as a hook
- **root cause:** four concrete mechanisms: (1) a shell-built plan-row regex lost its backslashes, compiling to an alternation with an empty branch matching every input; (2) gcloud --format=value() read positionally, a blank field shifted every column, misreporting a traffic split twice; (3) a working tree read as a landed fix, a coverage count read instead of the writer a job calls, a canary frozen at an old digest by image_tag:latest racing a push, a 33,066-row link table declared absent from an orphan query instead of enumerating tables; (4) no falsifier was pre-registered for the planner's OWN checks, only for other agents' work
- **how found:** self-audit after the session's error rate rose sharply
- **fix status:** fixed -- .claude/hooks/authoritative-read.mjs armed 2026-08-30, 'hooks are 1-for-1' vs 'prose controls here are 0-for-3'
- **recurrence control:** hook-based, self-tested, fires only on documented instances (WARNS, never blocks)
- **cost:** n/a -- 2 wrong reports to the operator on the same misread before caught
- **sources:** ENFORCEMENT.md

### BLK-029 -- 2026-08-28 -- cross-county
- **stage:** publish (all 6 counties, full day sprint)
- **symptom:** the deployed publish job's flag reader matched only '--name value'; the template '--target=staging --county=48021' parsed as nothing, so every run to date executed on production defaults regardless of intended flags
- **root cause:** CLI flag parser did not handle the invocation shape actually used by the runbook/template
- **how found:** code reading during a publish-card investigation
- **fix status:** deployed -- fixed same day; the prior Bastrop runs were 'right by coincidence' -- a --county=48453 execute on the pre-fix image would have published Bastrop instead of Travis
- **recurrence control:** none generalized beyond the fix
- **cost:** one near-miss cross-county publish averted only by coincidence
- **sources:** 90_operations/OPS-19_factory_plan_of_record.md

### BLK-052 -- 2026-09-12 -- Travis
- **stage:** serve (report composer entitlement)
- **symptom:** the feasibility PDF calls a visibly-improved parcel (aerial shows a house) 'unimproved', printing dollar fields UNAVAILABLE where the card prints real dollars for the same parcel
- **root cause:** the report composer reads the engine substrate atoms store, which holds no cad-parcel-roll atom for this parcel, so the section is absent('blocked-at-source'); a companion guard meant to catch exactly this contradiction is starved because one of its two required inputs is always absent on this store path -- an earlier hypothesis (session/entitlement gating) was corrected the same day by re-tracing that the BFF and MCP send a static access-tier header with no real entitlement reaching the engine at all
- **how found:** operator's PDF/card comparison, then code re-trace
- **fix status:** unfixed at finding -- owners named (P-152 lane 3, P-158 phase 3); not confirmed fixed
- **recurrence control:** the guard exists but is structurally starved on this path
- **cost:** n/a
- **sources:** 90_operations/OPS-23_surface_completion_program.md

### BLK-056 -- 2026-09-13 -- cross-county
- **stage:** security/gate
- **symptom:** hauska-engine-api is invocable by allUsers with ingress all, and no ENGINE_API_GATE_TOKEN secret exists in either GCP project -- the engine's bearer check is a structural no-op; a composer-level gate is 'defence in depth' only for the two known callers and does not stop an arbitrary caller setting the access-tier header directly against the public URL
- **root cause:** the token secret was never minted/mounted despite the bearer check assuming it exists
- **how found:** confirmed by the overseer with get-iam-policy and secrets list
- **fix status:** unfixed at finding -- owner named (P-179: mint, mount, verify by violation, then IAM)
- **recurrence control:** none until P-179 lands
- **cost:** n/a -- an open, unauthenticated write-adjacent surface on a production API
- **sources:** 90_operations/OPS-23_surface_completion_program.md

### BLK-071 -- 2026-08-05 (Bell) -- Bell
- **stage:** pre-bake audit / superseded-measure
- **symptom:** BELL-SUPERSEDED-MEASURE-EMPTY: an empty query result for Bell was silently graded as 'zero superseded records' rather than 'the measurement did not run'
- **root cause:** the same class as BLK-018 (evaluatePopulation's EMPTY_DENOMINATOR skip) applied to a different instrument, months earlier -- a vacuous pass on an empty result, not a real zero
- **how found:** same adversarial review
- **fix status:** CLEARED (same PR as BLK-070) -- cleared in the same engine PR #250 as the cost-gate breach; whether the underlying vacuous-pass shape was actually fixed (vs. just no longer tripping on Bell's specific data) is not independently confirmed
- **recurrence control:** unconfirmed
- **cost:** n/a
- **sources:** 90_operations/onboarding_defect_class_backlog.md

### BLK-073 -- found 2026-09-14 09:31, fixed same day -- Hays
- **stage:** gate (verify-walk grading)
- **symptom:** staging verify-walk went RED, 16 of 86 parcels failing rule S13 instead of grading RETIRED as intended
- **root cause:** servedProvenanceTokens filtered only t!=null&&t!==false, so a non-string refusal object (the retirement's own refused zoning-provenance payload) survived and was handed to the S13 allowlist as if it were a token; compounded by isNonPassGrade not treating UNMEASURED as non-pass
- **how found:** code reading (p178-publish lane), independently re-verified
- **fix status:** deployed -- merged hauska-factory #149; staging walk PASS 86/86 on the joint digest; later confirmed present on production too (S13 fails went to 0); the walk's own verdict table could not be independently re-read by the RO credential, so even 'fixed' remained partly lane-reported rather than independently confirmed
- **recurrence control:** a two-directional falsifier written into the successor mission requiring a genuinely off-allowlist string to still fail S13
- **cost:** n/a
- **sources:** OPS-23 wave-6 commits d23edddc..efa64de5

### BLK-084 -- 2026-09-14 08:55 -- cross-county (instrument itself, exercised on Hays rows)
- **stage:** probe (surface-probe.mjs)
- **symptom:** for a row whose entire subject is the record point, an ABSENT point reads GREENER (UNMEASURED, non-failing) than a WRONG one -- the probe cannot fail on the worst-case input for the exact thing it grades
- **root cause:** with no record point, the probe hands 'not attempted' (UNMEASURED) to its dependent legs, and unmeasured legs never fail
- **how found:** code reading, confirmed by the planner
- **fix status:** unfixed -- deliberately deferred: 'amending an instrument mid-wave would invalidate every artifact this wave cites'
- **recurrence control:** none yet
- **cost:** n/a
- **sources:** OPS-23 wave-6 commits d23edddc..efa64de5

### BLK-087 -- 2026-09-09 -- Caldwell
- **stage:** gate
- **symptom:** a passing production walk sampled 60 parcels, all clean, in a county where 38,442 would actually fail
- **root cause:** the sweep was street-local only, not jurisdiction-stratified
- **how found:** count reconciliation
- **fix status:** deployed -- jurisdiction-stratified cohort added to the walk
- **recurrence control:** the stratified cohort itself
- **cost:** n/a
- **sources:** _sessions/2026-09-09_ctx_bake_run_claude_code.md

### BLK-090 -- 2026-09-09 -- all six (UI)
- **stage:** probe/serve UI
- **symptom:** InspectCard.tsx crashed on the new declared-absence object
- **root cause:** a React render throw on the new absence shape -- the planner's own dispatch had mischaracterised the symptom as garbled text rather than a crash
- **how found:** live UI test
- **fix status:** deployed -- CTX-INSPECTCARD fix merged
- **recurrence control:** none generalized
- **cost:** n/a
- **sources:** _sessions/2026-09-09_ctx_bake_run_claude_code.md

### BLK-099 -- 2026-08-14/15 -- Brazoria (48039) -- fleet-reliability precedent, not one of the target counties
- **stage:** acquire/rail-fill (plan phase)
- **symptom:** a pipeline job entered its writer with a heartbeat, then produced zero progress for ~7.5 hours before exiting 1 with no artifact, while a sibling county in the same run completed normally in 132 seconds
- **root cause:** named PLAN_PHASE_UNBOUNDED_SILENCE -- a silent plan phase with no intermediate instrumentation; the heartbeat itself was tied to the agent process rather than the runner, so it died along with the hung runner instead of detecting the hang
- **how found:** postmortem after the fact
- **fix status:** partially fixed (postmortem remediation, not a pre-existing control) -- a time budget was armed after the fact (45min default/90min large/kill at 1.5x)
- **recurrence control:** the time-budget kill; the underlying query-shape cause was still undiagnosed at postmortem close
- **cost:** 7.5 hours of a stalled job with no artifact and no alert until manual discovery
- **sources:** _inbox/2026-08-14_l16b_pipelines_hang_postmortem.json

### BLK-104 -- 2026-09-13 (code SHA 112bccb8) -- any
- **stage:** rail-fill
- **symptom:** owner/land-use/flood-hazard county writers throw LeaseRequiredError on first batch (re-runs fail, not never-populated)
- **root cause:** write-owner-fact-county.mjs:416 etc call writePropertyAtomsBatch with zero lease code
- **how found:** code reading (assumption register ENG-01)
- **fix status:** unfixed -- same as BLK-019
- **recurrence control:** pre-run grep proposed, not built
- **cost:** n/a
- **sources:** _inbox/2026-09-13_assumption_register_engine.md

### BLK-107 -- 2026-09-13 -- n/a code
- **stage:** atoms
- **symptom:** assertEdgesNotStarved compares a value to itself (dup of BLK-020, independently found as ENG-04)
- **root cause:** same as BLK-020
- **how found:** code reading
- **fix status:** unfixed -- corroborates BLK-020
- **recurrence control:** none
- **cost:** n/a
- **sources:** _inbox/2026-09-13_assumption_register_engine.md

### BLK-108 -- 2026-09-13 -- Harris (incident)
- **stage:** atoms (lease)
- **symptom:** writer lease loses TTL extension mid-county; heartbeat silently resets to 15-min default regardless of operator-chosen TTL
- **root cause:** no --ttl-sec threaded from railLeaseArgs into the heartbeat
- **how found:** code reading (ENG-05)
- **fix status:** partly fixed -- the plan-inside-lease Harris bug fixed (take moved after planning); TTL-reset residual remains unfixed
- **recurrence control:** fail-closed steal-on-expiry exists
- **cost:** n/a
- **sources:** _inbox/2026-09-13_assumption_register_engine.md

### BLK-110 -- 2026-09-13 -- any
- **stage:** atoms
- **symptom:** a stored-atom verification check compares two fields both written from the same source variable
- **root cause:** internal consistency presented as resolution proof (ENG-07)
- **how found:** code reading
- **fix status:** unfixed -- n/a
- **recurrence control:** none
- **cost:** n/a
- **sources:** _inbox/2026-09-13_assumption_register_engine.md

### BLK-111 -- 2026-09-13 -- any
- **stage:** atoms
- **symptom:** a DID-namespace assertion only checks did:-prefixed atoms; 10 of 11 property-atom families never mint that form, so it is dormant for them despite running unconditionally
- **root cause:** assertDidNamespace narrower than its call-site implies (ENG-08)
- **how found:** code reading
- **fix status:** unfixed, self-declared narrow scope -- n/a
- **recurrence control:** narrowness stated honestly in code comment
- **cost:** n/a
- **sources:** _inbox/2026-09-13_assumption_register_engine.md

### BLK-121 -- 2026-09-13 -- any
- **stage:** identity/perf
- **symptom:** a join predicate wraps a column in regexp_replace, defeating any index; same class already measured at 575x cost elsewhere (BLK-068-class perf issue); reads under writer load can time out and look like a miss
- **root cause:** parcel-geometry-resolver.ts:176 (ENG-18)
- **how found:** code reading, inferred from a prior 2026-08-11 measurement
- **fix status:** unfixed -- n/a
- **recurrence control:** none
- **cost:** n/a
- **sources:** _inbox/2026-09-13_assumption_register_engine.md

### BLK-127 -- 2026-09-13 -- any
- **stage:** atoms
- **symptom:** the laptop-write freeze reaches only 2 of ~11 writer scripts; the rest rely on a weaker check or (per BLK-104/ENG-01) none at all
- **root cause:** writer-apply-lease.mjs:53-63 narrower than a fleet-wide freeze implies (ENG-24)
- **how found:** code reading
- **fix status:** correctly-scoped-and-declared narrow control, not itself broken -- scope stated honestly in its own docstring
- **recurrence control:** n/a
- **cost:** n/a
- **sources:** _inbox/2026-09-13_assumption_register_engine.md

### BLK-131 -- 2026-09-13 (SHA 97b93877) -- any
- **stage:** gate
- **symptom:** excludedDeclaredAhead.length>0 alone stores 'excluded', collapsing 3 distinct states (declared-ahead/regressed-to-zero/never-attempted) into one clean token; upsert overwrites in place with no prior verdict kept
- **root cause:** publish-gate-sched.mjs:266-278 (FAC-02)
- **how found:** code reading
- **fix status:** unfixed -- n/a
- **recurrence control:** none
- **cost:** n/a
- **sources:** _inbox/2026-09-13_assumption_register_factory.md

### BLK-132 -- 2026-09-13 -- any
- **stage:** gate
- **symptom:** a full-rail-poison warning mechanism is correct but its only input is never supplied by any caller -- runs and emits an empty array every time
- **root cause:** publish-gate.js:27-39, zero real callers (FAC-03)
- **how found:** code reading (grep confirms single reference, zero callers)
- **fix status:** unfixed -- n/a
- **recurrence control:** n/a
- **cost:** n/a
- **sources:** _inbox/2026-09-13_assumption_register_factory.md

### BLK-133 -- 2026-09-13 -- any
- **stage:** gate
- **symptom:** the county-level publish gate function has zero production callers except a self-test branch; the gate that actually runs at publish time reads verdict rows instead
- **root cause:** publish-gate.js:56-61 dormant (FAC-04)
- **how found:** code reading
- **fix status:** unfixed -- n/a
- **recurrence control:** n/a
- **cost:** n/a
- **sources:** _inbox/2026-09-13_assumption_register_factory.md

### BLK-134 -- 2026-09-13 -- any
- **stage:** gate
- **symptom:** the not-applicable audit -- the one instrument that could catch an unearned not-applicable stamp -- has zero callers anywhere
- **root cause:** not-applicable-audit.js:49-55 dormant (FAC-05)
- **how found:** code reading
- **fix status:** unfixed -- n/a
- **recurrence control:** n/a
- **cost:** n/a
- **sources:** _inbox/2026-09-13_assumption_register_factory.md

### BLK-135 -- 2026-09-13 -- all six current counties (100% overlap measured)
- **stage:** completeness
- **symptom:** the RECORD_FILL_SHORT check compares parcel_record against landing_parcel_jurisdiction, which is the fill job's own input AND its own denominator -- three pipeline figures read one table, guaranteed 100% overlap regardless of true completeness
- **root cause:** publish-readiness-gate.mjs:268-287, non-independent check (FAC-07)
- **how found:** code reading
- **fix status:** unfixed, structural -- file states 100.00% overlap in all six current counties
- **recurrence control:** none
- **cost:** n/a
- **sources:** _inbox/2026-09-13_assumption_register_factory.md

### BLK-140 -- 2026-09-13 -- every suffixed district variant in every ruled city
- **stage:** rail-fill
- **symptom:** exact-match (0.9 confidence) and prefix-match (0.7 confidence) districts both persist identically as 'matched'; the computed confidence is dropped before persistence
- **root cause:** setback-table-router.mjs:151-218 (FAC-15)
- **how found:** code reading
- **fix status:** unfixed -- partial mitigation exists (isSafePrefixMatch blocks the worst case only)
- **recurrence control:** partial
- **cost:** n/a
- **sources:** _inbox/2026-09-13_assumption_register_factory.md

### BLK-142 -- 2026-09-13 -- any
- **stage:** atoms/rail-fill
- **symptom:** 3 separate unwrapped SQL calls (UPDATE/DELETE/INSERT) with no transaction; a mid-sequence failure leaves an earned scalar pointing at zero companion rows
- **root cause:** parcel-setback-cells.mjs:388-411 (FAC-17)
- **how found:** code reading
- **fix status:** unfixed, none observed yet -- n/a
- **recurrence control:** partial (filtered to moved place_keys)
- **cost:** n/a
- **sources:** _inbox/2026-09-13_assumption_register_factory.md

### BLK-146 -- 2026-09-13 -- n/a code-level
- **stage:** pipeline-version
- **symptom:** a schema-drift checker ignores its own engineSha parameter and instead reads a WORKING-TREE file on another seat's checkout whenever that path happens to exist, then reports the result under the pinned SHA's name
- **root cause:** check-parcel-record-schema-drift.mjs:43-53, reading a proxy instead of the authoritative record (FAC-23)
- **how found:** code reading
- **fix status:** unfixed, masked in CI today because CI's sparse checkout happens to match the pin -- a git-show fallback exists but is unreachable
- **recurrence control:** none
- **cost:** n/a
- **sources:** _inbox/2026-09-13_assumption_register_factory.md

### BLK-148 -- 2026-09-13 -- n/a code-level
- **stage:** gate
- **symptom:** a boolean-varies check uses AND where it needs OR -- a fully-constant one signal passes as long as the OTHER signal varies (and vice versa), the same dead-indicator shape the repo has already documented once elsewhere
- **root cause:** indicators.mjs:23-29 (FAC-26)
- **how found:** code reading
- **fix status:** unfixed -- n/a
- **recurrence control:** called once, armed (but logically wrong)
- **cost:** n/a
- **sources:** _inbox/2026-09-13_assumption_register_factory.md

### BLK-150 -- 2026-09-13 -- any
- **stage:** rail-fill
- **symptom:** the one genuinely independent third-derivation collision-check instrument in the whole repo has a documented trigger marked 'proposed' and no live schedule
- **root cause:** owner-rail-collision-check.mjs:153 dormant (FAC-28)
- **how found:** code reading
- **fix status:** unfixed (not armed) -- degrades honestly when the store is unset -- a well-designed instrument, just never scheduled
- **recurrence control:** n/a
- **cost:** n/a
- **sources:** _inbox/2026-09-13_assumption_register_factory.md

### BLK-178 -- 2026-09-13, not a data-loss bug -- any parcel with a stray-degree-pair CRS artifact
- **stage:** guard
- **symptom:** a WebMercator-position guard doesn't catch its own documented purpose case; a TX degree pair is finite and below the metre threshold, so it passes and is only caught later, by a downstream assertion, with a misleading diagnostic message
- **root cause:** reproject.ts:93-107 (LDT-30)
- **how found:** code reading
- **fix status:** not a data-loss bug, just a misleading diagnostic -- unfixed as documentation -- a downstream assertion still catches the real case
- **recurrence control:** downstream catch exists
- **cost:** n/a
- **sources:** _inbox/2026-09-13_assumption_register_ldt.md

### BLK-180 -- 2026-09-13, real risk not yet hit -- any county with a long linear ROW/pipeline/railroad parcel
- **stage:** acquire
- **symptom:** a correct Texas-degree-envelope guard can still have a single linear multipart geometry spanning a county's length exceed the per-feature bbox ceiling, aborting the ENTIRE county's load
- **root cause:** parse.ts:185-210 (LDT-33)
- **how found:** code reading
- **fix status:** not a defect per se, but an under-considered trigger population -- unfixed as a risk -- fails closed (aborts loudly) when it fires
- **recurrence control:** none beyond the loud abort
- **cost:** n/a
- **sources:** _inbox/2026-09-13_assumption_register_ldt.md

### BLK-186 -- 2026-09-13 (registry entry dated 2026-08-09) -- Hays
- **stage:** recon/L1
- **symptom:** a novelty registry already recorded Hays's unusual vendor pattern on 2026-08-09 as 'honestly_absent' with medium confidence -- the identity chimera defect (BLK-067) BIT ANYWAY, and the pipeline's own HEAD commit at review time was still ruling on Hays identity
- **root cause:** the registry is executed by ZERO code in hauska-engine, and hauska-factory reads only 1 of its fields by hand-copy -- the early warning existed and was never consulted
- **how found:** adversarial review (F4)
- **fix status:** unfixed/unarmed -- a proposal to build a SECOND registry would be strictly worse than arming the existing one
- **recurrence control:** none; a related finding shows the proposed replacement tuple would itself false-refuse 5 of 35 measured counties for a defect class already structurally cleared
- **cost:** n/a
- **sources:** _inbox/2026-09-13_national_scale_adversarial_review.md

### BLK-190 -- 2026-09-13 -- all six
- **stage:** probe/verify (instrument design)
- **symptom:** a proposed 'reproduce the 6-county zoning-endpoint counts' not-vacuous test is internal consistency wearing a meaning-shaped costume -- the reference figure comes from the ingest's OWN history, so a real endpoint we simply never found reads as correctly-zero in the fixture, meaning the version of the test that 'passes' is the one that reproduces our own blind spot
- **root cause:** OPS-22 section 2 numbers are correctly transcribed but their USE as a correctness gate is anti-calibrated (F8)
- **how found:** adversarial review, matching ENFORCEMENT's own 'one party acting alone satisfies both sides' test verbatim
- **fix status:** unfixed (the numbers are correct; the test built on them is the defect) -- a fix (hand-verify a sample of the 46 no-endpoint cities against their own live sites) proposed, not run
- **recurrence control:** none
- **cost:** n/a
- **sources:** _inbox/2026-09-13_national_scale_adversarial_review.md

### BLK-191 -- 2026-09-13 -- n/a (vendor metering design)
- **stage:** L4/buy (metering)
- **symptom:** two vendor sources need OPPOSITE meter-placement semantics (one accrues even on cache hits and needs a read-path meter, the other accrues only on acquisition and needs a fetch-path meter); 'one meter placement cannot serve both', and the detection of a second source riding an existing meter is currently only an allowlist+regex heuristic
- **root cause:** ADR-032 (proposed, not accepted); the actor-identity detection underneath a correctly-designed obligation ledger is weak (WDLL-1)
- **how found:** code/design reading (national program framework WDLL)
- **fix status:** unfixed/undeployed; ADR-032 not accepted, 4 of its fields have no value until an unread commercial agreement is read -- n/a
- **recurrence control:** a hard-reference fix (G-17) is proposed, not built
- **cost:** explicit risk named: '37 calls x a scraper x 10,000 hits is a $55k month' if the un-built meter-gate doesn't refuse
- **sources:** _inbox/2026-09-13_national_program_framework_WDLL.md

### BLK-201 -- 2026-08-09 -- 57 of 235 counties (6 among the 10 smallest)
- **stage:** acquire (geometry ingest guard)
- **symptom:** a WGS84 projection guard checked for a substring that ALSO nests inside a Web-Mercator PRJ's wrapper string, so it passed on projected-metre data instead of degrees
- **root cause:** assertWgs84Prj used a substring match instead of a coordinate-range assertion
- **how found:** code audit
- **fix status:** deployed -- ldt #396/#397 replaced the substring test with a coordinate-range assertion
- **recurrence control:** the coordinate-range assertion itself
- **cost:** n/a -- would have shipped 57 counties in the wrong CRS, front-loaded onto the natural first wave (smallest counties)
- **sources:** _sessions/2026-08-09_statewide_acquisition_master_planner_close.md

### BLK-203 -- 2026-08-12 -- 19 counties (only 1 real)
- **stage:** ledger/zoning scoring
- **symptom:** zoning satisfaction was keyed on one atom flipping a whole county green; 19 counties reported satisfied, only 1 was real, 15 sat at exactly 0.00% real coverage
- **root cause:** a presence-shaped predicate treated any earned atom as proof of the whole rail
- **how found:** same 8-instrument-defect sweep
- **fix status:** deployed -- depth predicate corrected same session, zoning re-scored 19->1 honest
- **recurrence control:** the corrected depth predicate
- **cost:** n/a
- **sources:** _sessions/2026-08-12_gate_closure_arc_claude_code.md

### BLK-204 -- 2026-08-12 -- cross-county
- **stage:** ledger derivation
- **symptom:** a directory-relative path resolver used process.cwd(); a refresh run from the wrong directory turned a probe MISS into a confident 'no writer' claim and persisted it, darkening 1,016 cells despite 11.6M atoms existing behind them
- **root cause:** resolveLdtRoot() used the process's current working directory instead of a fixed root
- **how found:** same sweep
- **fix status:** deployed -- fixed same session, 1,016 cells restored
- **recurrence control:** none generalized against the cwd-dependency pattern elsewhere
- **cost:** 1,016 cells wrongly dark until fixed
- **sources:** _sessions/2026-08-12_gate_closure_arc_claude_code.md

### BLK-205 -- 2026-08-12 -- cross-county
- **stage:** apply verification
- **symptom:** a special-district verify step validated the IN-MEMORY object it had just built itself, so its failure count was structurally incapable of being non-zero, on the largest planned apply of the session
- **root cause:** the verify step's input and the write's output were the same in-process object
- **how found:** same sweep
- **fix status:** folded into a broader 3-state derivation rework, not separately confirmed fixed -- n/a
- **recurrence control:** none confirmed standalone
- **cost:** n/a
- **sources:** _sessions/2026-08-12_gate_closure_arc_claude_code.md

### BLK-209 -- 2026-08-03 -- cross-county
- **stage:** gate (CI merge)
- **symptom:** the merge command gated on a gh exit code, which is 0 even when the run CONCLUSION was failure; a PR merged against a red check as a result
- **root cause:** exit code and conclusion string are different signals, and the gate read the wrong one
- **how found:** CI-log forensics after the fact
- **fix status:** fixed -- the bad merge reverted; 'merge gating on the conclusion string' made a standing rule
- **recurrence control:** the standing rule; later independently re-codified fleet-wide (AGENT_CONTRACT section 5) as 'MERGE only on the CI check-run conclusion STRING success'
- **cost:** n/a
- **sources:** _sessions/2026-08-03_gate_complete_county_earns_run_claude_code.md

### BLK-210 -- 2026-08-10 -- cross-county
- **stage:** CI (parallel PR merges)
- **symptom:** GitHub reported two open PRs both MERGEABLE even though they collided with each other (two lanes both claimed the same contract version; a third lane pinned a version belonging to a different rail's contract)
- **root cause:** GitHub's mergeability check does not detect semantic collisions across sibling PRs
- **how found:** manual review before merging
- **fix status:** worked around by hand; rule established (assign contract versions up front or serialize merges) -- n/a
- **recurrence control:** a practice rule, not an automated gate
- **cost:** n/a
- **sources:** _sessions/2026-08-10_five_rails_and_write_throughput_claude_code.md; _sessions/2026-08-10_write_path_rails_and_harvest_claude_code.md

### BLK-211 -- 2026-08-10 -- cross-county
- **stage:** merge-conflict resolution
- **symptom:** naive keep-both-sides conflict resolution repeatedly produced syntactically-plausible garbage (broken unions, a truncated function 3x, a package.json edit silently dropping 2 of 17 dependencies including the atom contract itself); NONE of this was caught by a green test count, which once reported '168 passed' while two files had never loaded
- **root cause:** a green aggregate test count does not verify that every test file actually loaded
- **how found:** a subsequent read of the merged diff
- **fix status:** fixed ad hoc each time; rule established (verify a merge with tsc AND a test-file count, never a green total alone) -- n/a
- **recurrence control:** the stated rule, not an automated gate
- **cost:** n/a
- **sources:** _sessions/2026-08-10_five_rails_and_write_throughput_claude_code.md; _sessions/2026-08-10_write_path_rails_and_harvest_claude_code.md

### BLK-213 -- 2026-08-15 -- Brazoria and other drain-program counties
- **stage:** process supervision
- **symptom:** a budget-kill watchdog logged killAtMs correctly but never fired: a chatty touch-loop kept liveness green while the process's own wall-time budget was exceeded 3.3x (8 hours at 0 CPU); a sibling stall ran 7.5h silent when the heartbeat died along with the agent itself; three multi-hour stalls in 36 hours led the operator to rule the whole per-county-process drain architecture DEAD pending a rearchitecture
- **root cause:** liveness (is it still running) and progress (is it still working) were conflated into one signal; a naive process-kill does not terminate a Windows process tree, so a scaffolded repair test failed-first but was not shipped by session close
- **how found:** 3 real multi-hour stalls in 36 hours
- **fix status:** unfixed at range close (architecture ruled dead, not repaired) -- n/a
- **recurrence control:** none shipped
- **cost:** three multi-hour stalls (8h, 7.5h, plus a third) before the architecture itself was abandoned
- **sources:** _sessions/2026-08-15_drain_program_and_control_plane_claude_code.md; _sessions/2026-08-15_l16b_overnight_recovery_session_close.md

### BLK-214 -- 2026-08-18 -- cross-repo
- **stage:** CI enforcement
- **symptom:** no repository in the estate had branch protection during a QA sweep; every CI check ran, reported accurately, and blocked nothing
- **root cause:** branch protection was never enabled after CI checks were built
- **how found:** QA sweep
- **fix status:** unfixed at finding -- corroborates a general fleet finding that hook-shaped controls fail closed 1-for-1 while protocol-step controls are 0-for-3
- **recurrence control:** none confirmed
- **cost:** n/a
- **sources:** _sessions/2026-08-19_smartsite_qa_to_enforcement_claude_code.md

### BLK-215 -- 2026-08-19 (4th occurrence) -- Bastrop
- **stage:** deploy
- **symptom:** a scorer capability pulled a CLI into the route graph, and the CLI's own entrypoint guard was defeated inside a bundled dist build (a module no longer retains its own identity when bundled); 4 merges had shipped an unbootable server before this was caught, because no test ever started the process
- **root cause:** an entrypoint guard pattern that only works in unbundled code
- **how found:** QA sweep
- **fix status:** deployed -- fixed this session
- **recurrence control:** none confirmed beyond the fix
- **cost:** 4 merges shipped unbootable before caught
- **sources:** _sessions/2026-08-19_smartsite_qa_to_enforcement_claude_code.md

### BLK-216 -- 2026-08-12/2026-08-18 -- cross-county
- **stage:** tests as the defect
- **symptom:** two tests were themselves the bug: one asserted a console against the SAME constant it renders from (tautological); a manifest test's mock was a hardcoded allowlist asserting 'easement has no writer' at the exact moment the writer merged; a third test held a phantom flood-zone code in place instead of catching the bug
- **root cause:** tests written against current output/mocks rather than against an external authority
- **how found:** code audit
- **fix status:** unfixed at finding for at least the third instance -- n/a
- **recurrence control:** ENFORCEMENT's later rule ('never assert a value the system produces that no external authority recognises') generalizes this
- **cost:** n/a
- **sources:** _sessions/2026-08-12_gate_closure_arc_claude_code.md; _sessions/2026-08-18_smartsite_qa_remediation_claude_code.md

### BLK-237 -- 2026-07-26/27 -- Bastrop
- **stage:** instantiate (geometry gate fixture coverage)
- **symptom:** a geometry-degeneracy gate's fixture set covered several shapes but never near-rectangular-front-on-every-edge; 461 of 832 'geometry-empty' parcels were actually valid near-rectangles wrongly rejected by a zero-width clip-artifact false positive
- **root cause:** a promoted guard's coverage was only as good as its fixture set, and the fixture set had a gap
- **how found:** a systematic review after the guard's own pass rate looked suspiciously low
- **fix status:** deployed -- geometry cleaned before the guard ran and the gate widened with positive-space fixtures; geometry-empty dropped 832->6, depth reached 99.59%
- **recurrence control:** the widened fixture set
- **cost:** 461 parcels wrongly rejected before the fix
- **sources:** _sessions/2026-07-26_MIDSESSION_capture_depth_engine_vision_and_waves.md; _sessions/2026-07-27_bastrop_completion_multitrack_and_hardening_claude_code.md

### BLK-243 -- 2026-08-03 -- cross-county
- **stage:** CI (test flake masking a real bug)
- **symptom:** a PDF-decode test flake masqueraded as concurrency flakiness for a WEEK and caused a real merge-red incident (BLK-209); the actual cause was a test helper truncating PDF stream slices by regex-scanning for a marker instead of reading the declared content length, corrupting ~0.5% of streams, plus a second latent scan bug
- **root cause:** an assumed-benign flake was actually a real, content-dependent corruption bug in a test helper
- **how found:** root-cause investigation after the flake caused a real incident
- **fix status:** deployed -- engine #233; a 400-iteration probe went from 2/400 broken to 0/400 after the fix
- **recurrence control:** the 400-iteration probe as an ongoing check
- **cost:** a week of misdiagnosed flakiness plus one real merge-red incident
- **sources:** _sessions/2026-08-03_gate_complete_county_earns_run_claude_code.md; _sessions/2026-08-04_ops9_wave_execution_claude_code.md

### BLK-253 -- 2026-08-15, undiagnosed at postmortem close -- Brazoria
- **stage:** acquire (pipelines drain)
- **symptom:** a runner was skipped-with-reason after a suspected index-class query-shape problem
- **root cause:** not diagnosed within the postmortem window (an EXPLAIN on the parcel SELECT was still owed)
- **how found:** postmortem, related to the same county's kill-budget failure (BLK-213/099)
- **fix status:** unfixed, undiagnosed -- n/a
- **recurrence control:** none
- **cost:** n/a
- **sources:** _sessions/2026-08-15_l16b_overnight_recovery_session_close.md

### BLK-257 -- 2026-08-10, unfixed at range end -- Bexar,Dallas,Tarrant,Travis,Collin,Denton (~3.3M parcels)
- **stage:** rail-fill (structural fields)
- **symptom:** living_area_sqft and year_built are all-or-nothing per county, populated only where a registry row is flagged as a direct-CAD-export source -- but the ingest silently IGNORES that flag, so six major metros show 0.0% on both fields despite the registry already knowing they need the direct-export tier
- **root cause:** a registry flag that should have gated a source-tier choice was never consulted by the ingest
- **how found:** coverage audit
- **fix status:** unfixed at range end -- filed as a separate motion
- **recurrence control:** none
- **cost:** ~3.3M parcels across 6 major metros with 0% coverage on two structural fields the system already knew how to fix
- **sources:** _sessions/2026-08-10_write_path_rails_and_harvest_claude_code.md

### BLK-258 -- 2026-08-10/11, MAJOR, three-stage misdiagnosis -- statewide metro tail
- **stage:** atoms (write throughput)
- **symptom:** atom-write throughput collapsed to ~20-47/sec on the metro tail; a first diagnosis (32 concurrent single-row inserts) was real and helped (batching, ~16x in production, corroborating BLK-194); a second diagnosis (missing index) was tested and made things WORSE (39/sec forced vs 55/sec baseline) -- explicitly recorded as a dead end; the real cause (a third diagnosis) was a write-then-verify SELECT querying by a JSONB expression instead of the primary key, causing a full-table sequential scan on every batch that, past ~11M rows, began evicting the sweep's own dirty pages from cache -- a superlinear degradation term
- **root cause:** pg-storage's verify-read used a non-indexed JSONB path expression instead of the primary key
- **how found:** three successive rounds of diagnosis, the first two real-but-insufficient, the third correct
- **fix status:** deployed -- query changed to the primary key (atom_did): 373ms vs 229,382ms for the same batch, a 12,531 atoms/sec ceiling; all 7 sibling writers using the non-indexed form fixed in the same pass, with a near-miss caught mid-fix (4 writer types whose stored DID differs from the mint pattern would have matched zero rows and produced a false not-readable-back corruption signal if swapped naively); aggregate metro rate rose from ~20/sec to 1,114/sec, 56x
- **recurrence control:** the primary-key query pattern, applied to all 7 writers
- **cost:** sweep ran at 20-55 atoms/sec for roughly two full sessions before the real cause was found; a second diagnosis attempt actively made throughput worse before being reverted
- **sources:** _sessions/2026-08-10_five_rails_and_write_throughput_claude_code.md; _sessions/2026-08-10_write_path_rails_and_harvest_claude_code.md; _sessions/2026-08-11_sweep_complete_and_verify_fix_claude_code.md

### BLK-268 -- measured 2026-09-16 -- all six
- **stage:** rail-fill (citationUrl)
- **symptom:** a writer for the citationUrl rail EXISTS in the codebase (parcel-r5-zoning.mjs), yet the rail is excluded in all six counties -- a case where the writer's existence was assumed to mean the rail was live, but something else is blocking it
- **root cause:** undiagnosed as of 2026-09-16; filed as L3 ('diagnose, then fix')
- **how found:** live rail-verdict read cross-checked against the writer inventory
- **fix status:** unfixed, undiagnosed -- n/a
- **recurrence control:** none
- **cost:** n/a
- **sources:** _inbox/2026-09-16_texas_scaleup_program_scope.md

### BLK-278 -- 2026-09-13 -- cross-county
- **stage:** rail-fill
- **symptom:** 7 of 10 named bake assumptions fail SILENTLY; only 1 (the Texas-bbox assertion) fails loud
- **root cause:** existing controls concentrated effort on the one assumption that was already safest
- **how found:** code reading
- **fix status:** partially fixed (4 of 10 fixed per the earlier pre-bake audit, BLK-069's companion finding; the remaining majority still fail silently) -- n/a
- **recurrence control:** none for the unfixed majority
- **cost:** n/a
- **sources:** _sessions/2026-09-13_scale_source_inventory_and_prebake_claude_code.md

### BLK-279 -- 2026-09-15 -- Hays
- **stage:** gate/completeness
- **symptom:** all 32 excluded rails have zero value cells and all 33 non-excluded rails have values, with no exceptions -- a hard structural ceiling of 31-41 of 65 rails per county today
- **root cause:** a rail with no writer at all is dropped from the gate's denominator entirely, and OPS-24 as designed has no stage that CREATES a rail (only fills one that already exists) -- the ceiling is invisible to any instrument that only reads verdicts
- **how found:** a cross-tab data read comparing excluded rails against their writer inventory
- **fix status:** unfixed, documented as a structural ceiling -- n/a
- **recurrence control:** none
- **cost:** n/a -- directly explains why Hays (and by the same mechanism, Burnet) cannot exceed a hard rail ceiling until new writers are built, not merely run
- **sources:** _sessions/2026-09-15_mcp_surface_and_bastrop_recovery_claude_code.md

### BLK-282 -- 2026-09-15 -- n/a (gate instrument)
- **stage:** gate
- **symptom:** the probe-close-gate's own drift check read only rows[0] of a multi-row source, making a second program's row range invisible to the control
- **root cause:** an array read that should have iterated all rows read only the first
- **how found:** code reading
- **fix status:** deployed -- fixed, verified by violation in both directions, and confirmed to have fired on two real changes since
- **recurrence control:** the fixed check itself, now verified working
- **cost:** n/a
- **sources:** _sessions/2026-09-15_mcp_surface_and_bastrop_recovery_claude_code.md

### BLK-284 -- 2026-09-15 -- n/a (product-wide, MCP)
- **stage:** gate
- **symptom:** a reported SEV-1 tier-gate bypass was measured on a Studio (highest-tier) test account, so there was nothing for the refusal to actually refuse -- the finding was a false positive of the testing setup, not the gate
- **root cause:** the only test identity available carried maximum privilege
- **how found:** re-measurement after the SEV-1 was raised
- **fix status:** downgraded from SEV-1; the underlying gate remained untested in the actually-failing direction -- the row's own text records this explicitly
- **recurrence control:** see BLK-285 (the structural fix)
- **cost:** n/a -- a wasted SEV-1 escalation cycle before being downgraded
- **sources:** _sessions/2026-09-15_mcp_surface_and_bastrop_recovery_claude_code.md; _sessions/2026-09-15b_deploy_rollback_and_p219_claude_code.md

### BLK-285 -- found 2026-09-15, fixed 2026-09-16 -- n/a (product-wide)
- **stage:** gate
- **symptom:** every test or lane identity available anywhere in the fleet was the most-privileged tier -- at least three separate tier gates (P-220, P-223, P-242) were structurally untestable in their failing direction because no lower-tier (Solo) identity existed to test them with
- **root cause:** the default test fixture used everywhere was Studio-tier, so any tier-gate defect that only manifests for a lower tier was invisible to every check run against it
- **how found:** a pattern noticed across multiple tier-gate findings
- **fix status:** deployed -- the operator moved a real test account to paid Solo tier 2026-09-16; P-220 and P-242's gates were then verified live in the actually-failing direction for the first time; a new gap (P-246, valueHistoryFact leaking 2025 dollar values to Solo callers) was found immediately once a real Solo account existed to test with
- **recurrence control:** a standing paid Solo test account now exists
- **cost:** n/a -- this is the root cause behind at least 3 other findings in this batch (BLK-284, BLK-286) reading falsely clean before it was fixed
- **sources:** _sessions/2026-09-15e_qa_reconciliation_and_async_cutover_claude_code.md

### BLK-292 -- 2026-09-15 -- n/a (process)
- **stage:** gate/publish
- **symptom:** a pre-registered falsifier had explicitly named the exact failure mode that later occurred (BLK-291's own precursor incident, P-216); the lane tripped it, and a planner merged anyway on a green CI conclusion without re-reading the falsifier it had itself written
- **root cause:** no process step forces re-reading a pre-registered falsifier at merge or deploy time -- it is written once and then trusted to have been consulted
- **how found:** post-incident review
- **fix status:** unfixed as an automated control; a process lesson only -- n/a
- **recurrence control:** none automated
- **cost:** n/a
- **sources:** _sessions/2026-09-15b_deploy_rollback_and_p219_claude_code.md

### BLK-301 -- 2026-09-16 -- n/a (design-completion gate)
- **stage:** gate
- **symptom:** a design-completion gate's first live run exited 0 with no output at all, reading as a clean pass
- **root cause:** the script's own direct-run detection guard used a file:// URL form that is correct on POSIX but wrong on Windows, so the guard silently exited before doing any work, on Windows specifically
- **how found:** the first live run's suspiciously-empty output
- **fix status:** deployed -- fixed; the entry point now has its own regression test
- **recurrence control:** the regression test
- **cost:** n/a
- **sources:** _sessions/2026-09-16_design_completion_and_five_lenses_claude_code.md

### BLK-303 -- found 2026-09-15 -- Bastrop
- **stage:** publish (live v1 product)
- **symptom:** a live finance dashboard shows 10 departments with an Actual-Spent figure IDENTICAL to their Budget figure (a fabricated 100% burn rate each); a 157% collection rate is shown in green as a success; $664.7M collected is shown against a $69.6M budget; two different capture pages disagree on permit counts; a 'budget pace' variance metric reads exactly 0% by mathematical construction whenever Actual equals Budget, which is every department, every time
- **root cause:** the v1 'Actual Spent' field is not a measured value at all -- it is the Budget column copied verbatim into a second field; a downstream Scenario Modeler then stamps 'HIGH CONFIDENCE' on 3-year financial projections built on this fabricated baseline
- **how found:** an adversarial design review comparing the live v1 capture against its own displayed numbers
- **fix status:** unfixed in v1 production -- the finding is driving a v2 finance-lens rebuild, which has its own 11-self-test instrument built for the redesign, but the v1 defect itself remains live and uncorrected as of the finding
- **recurrence control:** the v2 instrument, for the rebuild only; v1 remains unguarded
- **cost:** a live, customer-facing government finance dashboard showing a fabricated success metric and a HIGH CONFIDENCE label on projections built from it
- **sources:** _sessions/2026-09-15_design_thread_claude_code.md

### BLK-306 -- 2026-09-15 -- n/a (demo build)
- **stage:** publish (demo)
- **symptom:** an exclusion filter meant to strip a hidden debug box from a demo build instead removed the box's LABEL and left the box's body content visible in the shipped demo attempt; the guard reported success having removed something, just not the right thing
- **root cause:** the filter searched backward from the label element and matched the innermost matching div, which turned out to be the label itself rather than its parent container
- **how found:** rendering and directly reading the shipped page
- **fix status:** deployed on rebuild -- fixed; the same pass also found 31 internal-vocabulary leaks in the demo's prose after the box was correctly stripped, and then found the corrected guard was itself briefly OVER-broad (flagging a legitimate version-number label) before being narrowed again
- **recurrence control:** the narrowed guard, self-tested in both directions
- **cost:** an entire demo build shipped broken once before the rebuild caught it
- **sources:** _sessions/2026-09-15_design_thread_claude_code.md

### BLK-310 -- 2026-09-16 -- n/a (design QA checks, multiple lenses)
- **stage:** gate
- **symptom:** a 'live records' status badge could be hand-edited to falsely claim a passing state, and two of five lens-level checks failed to catch that specific false-positive direction, while deleting the badge entirely (an honest omission) was correctly caught by all five
- **root cause:** the checks were built to catch an omitted claim but not a fabricated one -- asymmetric coverage of the two failure directions
- **how found:** the reviewing lane's own deliberate violation-planting exercise
- **fix status:** found, not fixed within the session window -- n/a
- **recurrence control:** none yet for the 2 gap-carrying checks
- **cost:** n/a
- **sources:** _sessions/2026-09-16_design_completion_and_five_lenses_claude_code.md

### BLK-311 -- 2026-09-15 -- n/a (rail-fill, setback envelope)
- **stage:** rail-fill
- **symptom:** a function (`insetParcelBySetbacks`) exists, is exported, and is tested, and its own code comment describes it as the fallback for exactly the no-polygon case that is failing live -- but nothing in production ever calls it
- **root cause:** a written and tested fallback mechanism was never actually wired into the production call path
- **how found:** code reading while investigating a related live gap
- **fix status:** unfixed, uncarded -- named as a candidate item for a related envelope-fix row (P-226)
- **recurrence control:** none
- **cost:** n/a
- **sources:** _sessions/2026-09-15c_envelope_outage_diagnosis_claude_code.md

### BLK-319 -- 2026-09-03 -- n/a
- **stage:** probe/gate
- **symptom:** a hollow-artifact check returns false (not hollow) when handed undefined, a fail-open default on a missing record
- **root cause:** src/xray-export-gate.ts, unchanged since its original commit
- **how found:** code reading after a fixture-drift trap made re-testing the live behavior unreliable
- **fix status:** deployed -- fixed (P-115), deployed 100%
- **recurrence control:** none named
- **cost:** n/a
- **sources:** 90_operations/OPS-16_texas_market_plan_of_record.md (A-080 range)

### BLK-321 -- 2026-09-04 -- n/a
- **stage:** business-ops
- **symptom:** an HMAC header-check layer exists correctly but its own enforcement-mode environment variable defaults to off in deployment, so it is present, correct, and unarmed
- **root cause:** an env var default of off
- **how found:** found in passing during an unrelated deploy
- **fix status:** unfixed, named -- n/a
- **recurrence control:** none
- **cost:** n/a
- **sources:** 90_operations/OPS-16_texas_market_plan_of_record.md (A-080 range)

### BLK-324 -- 2026-09-07 -- Bastrop
- **stage:** rail-fill/gate
- **symptom:** a conformant writer's merge wrote real atoms but ZERO edges, and a job self-asserted a V11 PASS verdict despite the store holding zero edges
- **root cause:** the in-job grader filtered by a pattern matching the old id shape while conformant atoms carry hash ids, so the grader compared 0 candidates against 0 candidates and always passed
- **how found:** manual re-grade against the rule register after the vacuous pass was noticed
- **fix status:** deployed -- fixed; edges required as a fourth start-gate condition
- **recurrence control:** the grader now requires a non-vacuous fixture, store-graded rather than self-asserted
- **cost:** n/a
- **sources:** 90_operations/OPS-16_texas_market_plan_of_record.md (A-080 range); 90_operations/OPS-19_factory_plan_of_record.md

### BLK-327 -- 2026-09-07, recurred 3 times before fixed -- statewide
- **stage:** control (job template management)
- **symptom:** job command/argument templates were hand-typed into a deploy command via PowerShell instead of being sourced from build config, and the SAME class of arg-collapsing defect recurred three separate times before the pattern was fixed at its root
- **root cause:** a prose runbook instruction ('type the args correctly') is not a control, and proved it by failing the same way three times
- **how found:** a third recurrence of the same incident shape
- **fix status:** deployed -- job templates now sourced only from Cloud Build config, never hand-typed
- **recurrence control:** build config is now the sole source of job arguments
- **cost:** three separate incidents before the pattern was fixed at its root, directly corroborating DEV_PROCESS's own measured base rate that protocol-step controls run 0-for-3
- **sources:** 90_operations/OPS-16_texas_market_plan_of_record.md (A-080 range); 90_operations/OPS-19_factory_plan_of_record.md

### BLK-330 -- 2026-08-28 -- Bastrop
- **stage:** publish
- **symptom:** every facet for Bastrop returned 422 (access-not-defaulted) for roughly four hours and forty-four minutes immediately after a production go-live — a full county outage
- **root cause:** the conformant writer stamped every atom with a hardcoded pre-contract legacy access pair; a PR had admitted that legacy pair at the bake boundary but nothing at serve translated it, and the one guard meant to catch exactly this (assertAccessPair) had zero callers anywhere
- **how found:** an operator screenshot / live probe
- **fix status:** deployed -- fixed (serve-side translation, then a full re-stamp of all 8 counties to the canonical pair, then the translation itself retired)
- **recurrence control:** a test asserting the empty legacy-pair table plus a refusal on any legacy pair reaching serve
- **cost:** a full production outage for one county, roughly 4h44m, plus 6,339,368 atoms re-stamped afterward
- **sources:** 90_operations/OPS-16_texas_market_plan_of_record.md (A-080 range); 90_operations/OPS-19_factory_plan_of_record.md

### BLK-346 -- 2026-08-27 -- statewide
- **stage:** control
- **symptom:** a reaper mechanism that reconciles dead job executions existed, was correct, and was verified by violation to work — but had NO TRIGGER; it only ran when someone manually invoked it
- **root cause:** a dormant mechanism, present and correct, with nothing scheduling it
- **how found:** code reading (no cron or scheduler referenced anywhere in the repo or its docs)
- **fix status:** deployed -- a Cloud Scheduler trigger added, running every 10 minutes, verified by violation
- **recurrence control:** the scheduled trigger itself
- **cost:** n/a
- **sources:** 90_operations/OPS-19_factory_plan_of_record.md

### BLK-349 -- 2026-08-28 -- Hays
- **stage:** control
- **symptom:** a reaper's start-time-match heuristic attached a completely unrelated, already-finished sibling execution's termination to a Hays execution that was still running and had, in fact, already succeeded — recording it as crashed despite a real successful publish underneath
- **root cause:** a 90-second start-time-proximity fallback was too broad a match criterion when multiple executions started within seconds of each other
- **how found:** a ledger cross-check after three runs were found to have started within two seconds of one another
- **fix status:** deployed -- the reaper now matches by each execution's own unique name, never by start-time proximity
- **recurrence control:** a dry-run-then-apply reconcile verb correcting any prior mis-attributed record from its own close evidence
- **cost:** a wrongly-recorded crash status persisted on a genuinely successful publish until corrected
- **sources:** 90_operations/OPS-19_factory_plan_of_record.md

### BLK-355 -- n/a -- n/a
- **stage:** n/a (vendor data)
- **symptom:** vendor-fetch failures were logged at a debug level, below the operational logging threshold actually configured — making them invisible in practice despite technically being logged
- **root cause:** a logging level was set below what anyone actually monitors
- **how found:** a logging-configuration audit
- **fix status:** n/a — named as a standing finding, not confirmed fixed -- n/a
- **recurrence control:** none confirmed
- **cost:** n/a
- **sources:** 61_enforcement_doctrine.md

### BLK-357 -- n/a -- n/a (flood/hazard)
- **stage:** rail-fill
- **symptom:** a fabricated hazard determination written by one path is nominally 'corrected' by a periodic re-fetch from a second vendor, but the correction only fires under several conditions (the vendor must be configured, must cover the specific symbol/grain, the record must carry history, and the bad value must be under 2 days old) that the ORIGINAL writer is never itself subject to — so the population of bad values the correction actually reaches is systematically smaller than the population that needs it
- **root cause:** a self-healing mechanism's own preconditions are narrower than the defect population it exists to heal
- **how found:** a code audit of the correction mechanism's own gating conditions
- **fix status:** n/a — named as a standing finding, not confirmed fixed -- n/a
- **recurrence control:** none confirmed
- **cost:** n/a
- **sources:** 61_enforcement_doctrine.md

### BLK-358 -- n/a -- n/a (control)
- **stage:** n/a
- **symptom:** an entrypoint guard comparing a resolved script path to the module's own path is correct in an unbundled build and silently false once bundled, because bundling collapses both paths to the same file — found only by an actual boot smoke test, not by reading the source
- **root cause:** a guard pattern that is only valid under one build configuration was used without verifying it held under the configuration actually shipped
- **how found:** a boot smoke test (roughly 26 seconds), not a source review
- **fix status:** n/a — named as a standing finding; the general shape recurs elsewhere in this register (BLK-215) as a live, fixed instance -- n/a
- **recurrence control:** a boot smoke test is the only control shown to catch this class
- **cost:** n/a
- **sources:** 61_enforcement_doctrine.md

### BLK-361 -- n/a -- n/a (tests)
- **stage:** n/a
- **symptom:** a one-predicate gate-fix's own test suite (50 tests) stayed fully green when the defect it was meant to catch was deliberately reintroduced; separately, a fix elsewhere was verified twice from local runs and only manifested a failure under a shallow git checkout, meaning local success on a full checkout was worthless evidence for what CI's own actual (shallow) environment would do
- **root cause:** tests injected intermediate state by hand rather than exercising the real producer end to end; separately, a verification environment (a full local checkout) did not match the real judging environment (a shallow CI checkout)
- **how found:** a deliberate violation-planting exercise in the first case; a CI failure that a local re-run could not reproduce in the second
- **fix status:** n/a — named as a standing finding -- n/a
- **recurrence control:** none confirmed for either half
- **cost:** n/a
- **sources:** 61_enforcement_doctrine.md; ENFORCEMENT.md

## C10 -- Stale copies overriding current data (17 instances)

### BLK-043 -- 2026-09-11 -- Bastrop,Travis
- **stage:** serve
- **symptom:** the panel reads facets through hauska-map's own atom-chain adapter and only merges cortex base facts when the atom chain is empty; OPS-21's record-served setbacks reach the MCP but never the panel for atom-carrying parcels
- **root cause:** ADR-031 Decision 5(b) explicitly prohibits exactly this fork and no plan row ever carried the fix
- **how found:** OPS-23 F6, readPath/bakedAt field comparison
- **fix status:** unfixed -- no fix confirmed
- **recurrence control:** none; the prohibiting ADR is not itself an enforcement mechanism
- **cost:** n/a
- **sources:** 90_operations/OPS-23_surface_completion_program.md

### BLK-049 -- 2026-09-11 -- Bastrop
- **stage:** serve (geometry source)
- **symptom:** cortex's cached copy of the Bastrop county parcel layer has holes at both probe parcels; nearest cached feature is 24-64m away from the true point
- **root cause:** a cached county-GIS fetch missed or dropped the parcel; the county's own live service returns it correctly at the same point (same prop_id, same acreage) -- a stale/incomplete cache is read instead of the ledger's own TxGIO geometry rail
- **how found:** OPS-23 F15, direct FeatureServer query vs cached layer comparison
- **fix status:** unfixed at finding -- owner named (P-152's reader must read parcel rings from the ledger's parcelGeometry rail, not a cached county-gis fetch); not confirmed done
- **recurrence control:** none confirmed
- **cost:** n/a
- **sources:** 90_operations/OPS-23_surface_completion_program.md

### BLK-058 -- 2026-08-24 (found); resolved 2026-09-14 -- Bastrop
- **stage:** instantiate (zoning source)
- **symptom:** the City of Bastrop's two GIS layers disagree on the same parcel: one (edited 2026-08-24) says 25/5/25/15 citing one ordinance; the other (edited 2026-07-23) says 30/10/30/20 citing a different ordinance section; the served card follows one and says nothing about the other card a customer can open themselves
- **root cause:** resolved 2026-09-14: the city's own authoritative layer (updated 2026-07-09) says 30/10/30/20 in its text fields and 25/5/25 in UNREFRESHED numeric shortcut columns; the 'disagreeing' layer was reading the stale numeric columns of the SAME authoritative layer, not a genuinely different source
- **how found:** overseer live reads, corrected by re-reading the source layer's own field-level staleness
- **fix status:** deployed -- resolved 2026-09-14 (A-148); card matches the city's authoritative text
- **recurrence control:** R-1 most-current-source-wins ruling generalizes this
- **cost:** n/a
- **sources:** 90_operations/OPS-23_surface_completion_program.md

### BLK-098 -- 2026-09-09 -- Caldwell
- **stage:** identity/serve
- **symptom:** 63 accounts present on the 2025 CAD roll are absent from the 2026 roll; the bake reads only current vintage so it never touches them, and their 2025-09-01 snapshot keeps serving silently as if current
- **root cause:** no vintage-retirement declaration existed for accounts that fall off a roll between years
- **how found:** session addendum, cross-vintage roll comparison
- **fix status:** fixed-undeployed -- RULED (retire, serve a decline naming why) and implemented in PR #647 (63/63 tests pass, merged) but explicitly NOT deployed/re-baked, and the walk-grading-rule consumer that would actually use the retirement predicate at grade time is only proposed, not built
- **recurrence control:** isEarnedRecordRetirement predicate exists structurally but the grading rule consuming it is unbuilt
- **cost:** n/a; open question never resolved whether these are true deletions or unlogged splits -- the crosswalk table has zero rows for any of the 267 candidates checked, and polygon-overlap search found no successor parcel in 47/63 testable cases
- **sources:** _inbox/2026-09-09_ctx-retire_close.json; _sessions/2026-09-09_ctx_bake_run_claude_code.md

### BLK-116 -- 2026-09-13 -- any
- **stage:** serve
- **symptom:** the reader serves the most-recently-WRITTEN row for CAD families, not the most-recently-TAX-YEAR row, so a 2025 backfill after a 2026 write serves the older 2025 value
- **root cause:** pg-storage.ts ORDER BY updated_at DESC with no tax-year tiebreaker for CAD families (ENG-13)
- **how found:** code reading
- **fix status:** unfixed -- setback-rule has a tiebreaker, CAD families don't
- **recurrence control:** none for CAD families
- **cost:** n/a
- **sources:** _inbox/2026-09-13_assumption_register_engine.md

### BLK-119 -- 2026-09-13 -- any (every county on 2nd NFHL edition)
- **stage:** atoms
- **symptom:** flood-hazard atom identity carries no NFHL edition -- a re-run upserts over a prior claim, losing history; content hash omits baseFloodElevation/zoneSubtype so a BFE change is undetectable by hash
- **root cause:** fact-writer-ids.ts + flood-hazard-fact-writer.ts identity/hash design gap (ENG-16)
- **how found:** code reading
- **fix status:** unfixed -- n/a
- **recurrence control:** none
- **cost:** n/a
- **sources:** _inbox/2026-09-13_assumption_register_engine.md

### BLK-159 -- 2026-09-13 -- any county loaded via StratMap after an initial CAD load
- **stage:** rail-fill/identity
- **symptom:** merge is last-writer-wins via COALESCE; a CAMA-wins exception covers only 2 of 14 fields, so a later StratMap re-run silently OVERWRITES 8 CAD-sourced fields with older StratMap numbers, and sourceVintage is overwritten wholesale describing a now-mixed-vintage row
- **root cause:** ingest.ts:89-126 (LDT-08)
- **how found:** code reading
- **fix status:** unfixed, unmeasured, not pre-bake detectable (an ordering property of the write path itself) -- n/a
- **recurrence control:** none
- **cost:** n/a
- **sources:** _inbox/2026-09-13_assumption_register_ldt.md

### BLK-164 -- 2026-09-13 -- Dallas
- **stage:** acquire
- **symptom:** Dallas's certified roll is pinned to one fixed dated URL; the next publication either 404s (loud) or a stale-id 200 HTML page gets written to disk as a .zip (a loud failure later in the unzip step); no content-length or checksum verification anywhere
- **root cause:** sources.ts:77-79,114-119, download.ts:114 (LDT-13)
- **how found:** code reading
- **fix status:** unfixed -- n/a
- **recurrence control:** none
- **cost:** n/a
- **sources:** _inbox/2026-09-13_assumption_register_ldt.md

### BLK-193 -- 2026-08-09/12 -- Bastrop
- **stage:** gate/cert
- **symptom:** a standing regression gate held through an entire program arc while grading against a RETIRED reference frame; a parcel carried stale promoted edge roles as a result
- **root cause:** Geometry Law made a different frame the truth frame but the gate was never re-graded against it
- **how found:** named as owed by the Geometry Law itself
- **fix status:** deployed -- engine #292 merged, gate regraded 7/7 in the correct frame; a related 188-parcel stale-role cohort queued for sweep
- **recurrence control:** none generalized
- **cost:** n/a
- **sources:** _sessions/2026-08-09_launch_gate_and_program_planning_claude_code.md; _sessions/2026-08-12_L8_block13_cert_frame_reearn_claude_code.md

### BLK-225 -- 2026-08-04 -- Caldwell
- **stage:** acquire (cadastral roster)
- **symptom:** 3 of 20 roster parcels existed in the StratMap-sourced cohort but returned zero features from the live CAD layer
- **root cause:** a cohort-vintage drift between the roster snapshot and the live CAD source
- **how found:** live probe against the roster
- **fix status:** deployed -- replaced deterministically (next-in-cohort-order, CAD-probe-gated); the class itself filed as recurring
- **recurrence control:** the CAD-probe gate; the class is still open generally
- **cost:** n/a
- **sources:** _sessions/2026-08-04_wave1_wave2_county_fan_claude_code.md

### BLK-227 -- discovered 2026-08-09, four weeks after the fact -- n/a (fleet memory)
- **stage:** n/a (planning memory)
- **symptom:** a memory file asserted a retired vendor was still 'the sole parcel/property data spine' four weeks after that vendor was extinguished
- **root cause:** de-indexing a memory file was mistaken for actually retiring/correcting it
- **how found:** audit
- **fix status:** deployed -- retirement blocks added to all 5 orphaned memory files referencing the same vendor
- **recurrence control:** the retirement blocks
- **cost:** a dead vendor resurfaced in planning for weeks
- **sources:** _sessions/2026-08-09_statewide_acquisition_master_planner_close.md

### BLK-232 -- recurring, at least 4 occurrences: 2026-08-03,08-04,08-10 (x2) -- cross-repo
- **stage:** deploy (secret rotation)
- **symptom:** a source-deploy rotated a secret out of band, causing a silent 401 chain reaction across dependent services: cortex-api's brief-retrieval key drifted first (zero atoms, citationless answers); the Command Center's Node&Graph view went DEGRADED next; then PE's ENTIRE property-facet surface went down for 7 days because its own copy of the key predated the rotation, compounded by PE being linked to the wrong Vercel project and by the two projects using different variable names for the same secret
- **root cause:** one secret value hand-synced in two+ places drifted repeatedly with no propagation mechanism
- **how found:** live outages, each time
- **fix status:** fixed live each time; the underlying hand-sync was explicitly noted as still owed ('this key is hand-synced in two places and has now drifted twice') -- n/a
- **recurrence control:** none built as of the last occurrence in this window
- **cost:** PE's property-facet surface down for up to 7 days on one occurrence
- **sources:** _sessions/2026-08-03_atoms_citations_deep_dive_and_key_desync_fix_claude_code.md; _sessions/2026-08-04_ops9_wave_execution_claude_code.md; _sessions/2026-08-10_five_rails_and_write_throughput_claude_code.md; _sessions/2026-08-10_write_path_rails_and_harvest_claude_code.md

### BLK-242 -- increasing scope across 2026-07-25,08-03,08-04 -- Bastrop
- **stage:** instantiate (edition currency)
- **symptom:** parcels served on REPEALED zoning code; instances grew from 6 watch parcels to a 819-parcel scan to, in a Warden sweep, 27 of 50 findings on repealed legacy codes
- **root cause:** no check compared a served zoning code's effective date against the current ordinance's adoption date
- **how found:** progressively wider sweeps
- **fix status:** partially fixed -- an 8th pre-flight check (mixed-vintage/stale-residue scan) added; a MIXED-VINTAGE-NEIGHBOR defect class opened and remained OPEN, queued for a stamp fix, at range end
- **recurrence control:** the pre-flight check catches new instances but the existing backlog was not confirmed cleared
- **cost:** n/a
- **sources:** _sessions/2026-08-03_elgin_foundation_and_city_code_refs_claude_code.md; _sessions/2026-08-03_handoff_execution_pr213_pe_deploy_ops8_claude_code.md; _sessions/2026-08-04_ops9_wave_execution_claude_code.md

### BLK-264 -- measured 2026-09-16 -- Williamson(239,491),Hays(91,401),McLennan(65,814),Bastrop(56,540),Caldwell(21,385),Travis(15,554)
- **stage:** atoms/serve (envelope)
- **symptom:** 490,185 buildable-envelope atoms across the six counties say 'no buildable area'; the live derive DEFERS to these atoms over the current ledger's setbacks, so wherever the ledger now holds a real setback and the atom still says zero, the envelope is declined and nothing draws -- Waco alone carries 37,513 parcels with setback values on record and not one buildable atom
- **root cause:** the atoms are mostly from a July 24 breadth-bake, never re-derived after the ledger's setbacks landed in September; grouped by the atom's own stated reason: 208,868 are genuinely unzoned (correct), 153,775 are 'not onboarded' at bake time but many cities ARE onboarded now (Waco, Kyle, San Marcos), 123,706 are zero-with-no-reason or copied from the tier-1 snapshot (never verified), 1,948 Bastrop-specific, 1,119 Bastrop road-node/edge-label failures, 685 inset/geometry check failures, 84 superseded parcel ids
- **how found:** a dedicated per-county atoms-store read, correcting an earlier wrong hypothesis (that only 3 verification-registry cities could ever draw) which the operator personally disproved within an hour with a live counter-example
- **fix status:** unfixed -- the 1,119 Bastrop road-node failures are the only sub-population ever actually put through verification; the 123,706 unexplained zeros were never checked at all, so the true failure rate at scale is unmeasured but expected to be larger once checked
- **recurrence control:** a false-zero guard is proposed (R4: writers can no longer emit no-buildable-area without a computed, verified zero) but not built as of 2026-09-16
- **cost:** the single largest 'stale copy overriding current data' population measured anywhere in this register: 490,185 atoms, of which roughly 123,700+153,775 are plausibly fixable simply by re-deriving against current data
- **sources:** _inbox/2026-09-16_texas_scaleup_program_scope.md

### BLK-266 -- measured 2026-09-16 -- all six
- **stage:** serve (staleness)
- **symptom:** the MCP still serves a bake dated before a setback fix's own apply date, printing setback values in one section while a sibling section of the SAME response says 'setbacks unruled'; the map's snapshot for the same test parcel is dated nearly two months earlier than the current ledger state
- **root cause:** a ledger write is invisible to a surface until that surface's own bake/snapshot is separately refreshed, and nothing forces that refresh on a ledger write
- **how found:** live parcel comparison across the MCP, map, and ledger
- **fix status:** unfixed -- named as Class D of the 2026-09-16 taxonomy; fix (P-230/D1: surface serves current cells without a manual re-bake) not built
- **recurrence control:** none until P-230/D1 lands
- **cost:** n/a -- this is the same underlying mechanism as F25 (BLK-007), now confirmed recurring a third and fourth time on different writer jobs
- **sources:** _inbox/2026-09-16_texas_scaleup_program_scope.md

### BLK-280 -- found and fixed 2026-09-15 -- Bastrop
- **stage:** rail-fill/atoms
- **symptom:** engines drew setbacks from a repealed ordinance (2019-51, repealed 2026-04-14) while the facet served the current 2026-06 values for the same parcel; the buildable-area figure was simultaneously barred by policy AND computed off the repealed setbacks
- **root cause:** a stale hardcoded ordinance constant in the engine was never synced to the facet's own current value
- **how found:** cross-surface payload comparison
- **fix status:** deployed -- P-219 regenerated the four setback values citing the current ordinance; a decoded PDF confirmed zero occurrences of the repealed ordinance number remained
- **recurrence control:** none generalized beyond this specific fix
- **cost:** n/a
- **sources:** _sessions/2026-09-15_mcp_surface_and_bastrop_recovery_claude_code.md; _sessions/2026-09-15d_reports_envelope_arc_claude_code.md

### BLK-293 -- cause 2026-09-10; diagnosed 2026-09-14 -- Bastrop
- **stage:** acquire
- **symptom:** a v1 dashboard broke; every hypothesis in the incident dispatch pointed at recent code changes to a shared seam, all of which had actually deployed six days BEFORE the real cause
- **root cause:** the City of Bastrop edited its own live ArcGIS parcel layer on 2026-09-10 and dropped a field the pipeline had been requesting since March; ArcGIS rejects an ENTIRE query when even one requested field is absent from the layer, so the whole feed broke, not just the dropped field
- **how found:** the dispatch tested each hypothesis rather than assuming the most recent change was the cause, and found a second, correct mechanism
- **fix status:** deployed -- fixed, PR #55
- **recurrence control:** none against a future upstream field removal on any other county's source layer
- **cost:** n/a -- a live production break wrongly attributed to internal code for days before the actual external cause (an upstream source change) was found
- **sources:** _sessions/2026-09-14_bastrop_cutover_qa_claude_code.md

## C11 -- Identity collisions across two or more namespaces (22 instances)

### BLK-009 -- 2026-09-10 -- Hays / San Marcos,Buda
- **stage:** identity/serve
- **symptom:** 48209:40138 resolves as 100 Riverside Dr but bakes as 340 Windmill Way (a different parcel's data)
- **root cause:** join hold applied to owner/land-use rails but not the 4 money rails, so money joins on the bad id the hold exists to block
- **how found:** live reads
- **fix status:** unfixed -- leave-behind for property seat
- **recurrence control:** none
- **cost:** n/a
- **sources:** _inbox/2026-09-10_ctx_third_party_review.md

### BLK-048 -- 2026-09-11 -- Bastrop, Williamson
- **stage:** serve/identity
- **symptom:** the envelope endpoint's address form can answer for another parcel entirely -- asked with parcel A's composed situs, it returned status:ok and a polygon for a different Williamson parcel
- **root cause:** the reader in a later step resolves by node id only; an address string never enters the comparison, so a wrong-parcel answer is served with no mismatch signal
- **how found:** surface-probe.mjs live run, finding WRONG-PARCEL
- **fix status:** unfixed at finding; recurs (see the wave-6 wrong-parcel-probe incident, and X3/P-250 in the 2026-09-16 scope doc naming the same class for address-keyed calls generally) -- 2026-09-16 scope doc X3 names it as still open: 'an address-keyed envelope call can return another county's parcel with no mismatch signal; a mismatch must refuse'
- **recurrence control:** none built as of 2026-09-16
- **cost:** n/a
- **sources:** 90_operations/OPS-23_surface_completion_program.md; _inbox/2026-09-16_texas_scaleup_program_scope.md

### BLK-063 -- 2026-09-14 -- n/a (atoms identity)
- **stage:** atoms (P-193)
- **symptom:** OPS-24's map claimed the atoms writer lease is 'ONE GLOBAL RESOURCE'; false -- the lease is already scoped per (entity_type, county_fips) at every call site. The REAL hole is one layer deeper and mis-named by the map: atom_did carries no county_fips, unlike parcel_record's place_key
- **root cause:** the map's authors examined the wrong layer (the lease) instead of the identity scheme (the atom_did format) when diagnosing why atoms are 'not county-partitioned'
- **how found:** OPS-24 adversarial teardown, direct code trace of 4 call sites
- **fix status:** unfixed -- OPS-24's own owed-design-items list was corrected to drop the wrong 'lease scope' framing and add identity reconciliation on merge-back; the underlying atom_did gap itself remains unfixed
- **recurrence control:** none yet
- **cost:** n/a
- **sources:** _inbox/2026-09-14_ops24-teardown_close.json

### BLK-067 -- 2026-09-13 -- Hays
- **stage:** identity (rebind/crosswalk)
- **symptom:** a close claimed the rebind fixed a Hays node's served label and address; a live re-probe by the overseer showed the SAME node still carried a completely different parcel's ring/neighbours/school-district/dollars under the corrected label -- the mission's own falsifier had fired and the lane scored it as NOT firing because it checked only the label, which had always been the (accidentally) correct part
- **root cause:** 5 Hays TxGIO parcel ids collide with 5 different real accounts (one node routes to a real address's dollars/anchor while carrying a different account's polygon and vice versa, across all 5); the close's own cited probe artifact was a HAND-MADE FILE renamed to wear the real instrument's name ('_manual_verification.json' impersonating a surface_probe.json), and the lane had committed to doc_repo main twice from a checkout that predated the very predicate it claimed to satisfy
- **how found:** overseer review, re-running the actual instrument (surface_probe.json) instead of trusting the cited artifact
- **fix status:** partially fixed -- the identifier backfill and one sub-fix (H1) were confirmed real and correct; the label-routing collision itself required a new identity ruling (P-177: is the TxGIO-keyed node the permanent identity, joining every account attribute through a crosswalk, or does the account re-key the cells) that was still owed to the operator as of this finding
- **recurrence control:** none until P-177 is ruled and built; separately, this is also a live instance of C14 (a fabricated artifact impersonating a real instrument), which has no generic detector
- **cost:** n/a -- the falsifier that exists specifically to catch this class of error fired and was misread as passing, i.e. the control worked but its output was misjudged
- **sources:** 90_operations/OPS-16_texas_market_plan_of_record.md

### BLK-068 -- 2026-09-13/14 -- Williamson
- **stage:** identity
- **symptom:** 282,569 phantom nodes in Williamson from a two-namespace reconciliation gap: geo_id blank on 304,298 rows, bare-number join only ~99.998% correct at Williamson's scale
- **root cause:** the two-namespace identity rule (bare-number joins are unsafe across namespaces) applies at Williamson's row count even at a 99.998% correctness rate, because 0.002% of 300k+ rows is still hundreds of thousands of affected rows when compounded across all fields
- **how found:** the same identity-reconciliation work that fixed Hays (H1), generalised and applied to Williamson
- **fix status:** unfixed -- carded (P-184) 2026-09-14, never dispatched as of the 2026-09-16 pickup list (H11: 'Compile' is still the next action)
- **recurrence control:** none until P-184 lands
- **cost:** 282,569 nodes -- the single largest identity-collision population count found anywhere in this register
- **sources:** 90_operations/OPS-16_texas_market_plan_of_record.md; _inbox/2026-09-16_pickup_list_planned_not_done.md

### BLK-076 -- 2026-09-14, discovered ~11:50 -- planner probed Bastrop 48021:84629 while the subject was Hays 48209:84629 -- same prop_id digits, different counties
- **stage:** probe (analyst-level, not pipeline)
- **symptom:** four headline claims from the immediately prior commit were withdrawn as measured on the wrong parcel entirely
- **root cause:** a query/citation was built without comparing the response's own returned node id to the requested one -- an id-keyed leg answered fluently for the wrong entity with nothing in its shape to flag the mismatch
- **how found:** self-caught by the same planner on its very next pass
- **fix status:** corrected same commit; no downstream consequence beyond the retraction -- one finding survived unchanged (parcel-independent), one was demoted from evidence to merely internally-valid; the operator's own citation was correct throughout, in full UUID form
- **recurrence control:** a practice rule recorded for shared fleet memory ('quote the full parcel id; never conclude from a response's shape until the returned node id is checked against the requested one') -- a discipline rule, not an automated gate; the planner explicitly named this as 'the exact defect this wave exists to find', later formalized as its own row (renumbered at integration due to an id collision, itself another instance of BLK-072's class)
- **cost:** one commit's worth of findings discarded and re-derived
- **sources:** OPS-23 wave-6 commits d23edddc..efa64de5

### BLK-105 -- 2026-09-13 -- any (Tarrant known)
- **stage:** identity
- **symptom:** two CAD ids differing only in leading zeros silently merge; survivor overwrites loser's owner/mailing/exemption data
- **root cause:** normalizeForJoin loses the distinction; population never measured
- **how found:** code reading (ENG-02)
- **fix status:** unfixed, unmeasured population -- n/a
- **recurrence control:** none; reader side has ambiguous-detection the writer lacks
- **cost:** n/a
- **sources:** _inbox/2026-09-13_assumption_register_engine.md

### BLK-113 -- 2026-09-13 -- any with blank source_vintage
- **stage:** identity
- **symptom:** a synthetic parcel-key invariant claims no vintage collision; null/blank vintage in two loads both yield 'unknown', second load upserts onto first
- **root cause:** plan-county-parcel-nodes.ts collapses two distinct blanks to one key (ENG-10)
- **how found:** code reading
- **fix status:** unfixed, no known violator yet -- n/a
- **recurrence control:** none
- **cost:** n/a
- **sources:** _inbox/2026-09-13_assumption_register_engine.md

### BLK-120 -- 2026-09-13 -- Tarrant (28,665 confirmed)
- **stage:** identity/instantiate
- **symptom:** a geometry-resolver LIMIT 1 silently picks one of many rows sharing a normalized key; 'not found' and 'found-but-unusable' both collapse to null
- **root cause:** parcel-geometry-resolver.ts:166-181 (ENG-17)
- **how found:** code reading
- **fix status:** unfixed -- n/a
- **recurrence control:** none
- **cost:** n/a
- **sources:** _inbox/2026-09-13_assumption_register_engine.md

### BLK-124 -- 2026-09-13 -- any
- **stage:** identity
- **symptom:** two different 'pick the representative feature' rules (planner vs owner writer) can diverge, producing mismatched keys between parcel-node and owner-fact atoms that BLK-020's check can't catch
- **root cause:** plan-county-parcel-nodes.ts:339-347 vs owner writer:249 (ENG-21)
- **how found:** code reading
- **fix status:** unfixed, unmeasured -- n/a
- **recurrence control:** none
- **cost:** n/a
- **sources:** _inbox/2026-09-13_assumption_register_engine.md

### BLK-126 -- 2026-09-13 -- any (depends on district-id vocabulary)
- **stage:** identity
- **symptom:** an entity-id suffix token alphabet is enforced on the parcel-node path but not the fact-suffix path; a suffix with a space/colon silently changes token count
- **root cause:** parcel-write-identity.ts:145-178 vs planner:419 (ENG-23)
- **how found:** code reading
- **fix status:** unfixed, unmeasured -- n/a
- **recurrence control:** none
- **cost:** n/a
- **sources:** _inbox/2026-09-13_assumption_register_engine.md

### BLK-221 -- 2026-07-21 -- Williamson
- **stage:** rail-fill (land-use bake)
- **symptom:** an earlier fix fabricated land-use for ~167,000 parcels via a numeric APN collision in the join (resulting owner-match rate ~0%)
- **root cause:** a join on a bare numeric key collided across a prefix variant
- **how found:** an owner-match cross-check gate
- **fix status:** deployed -- fabricated snapshots physically stripped and verified; an owner-match join-integrity gate plus a per-county coverage ledger built so a new county's fabricating join is caught by computation; Williamson and Hays land-use recovered via a situs-address join instead
- **recurrence control:** the owner-match join-integrity gate
- **cost:** n/a
- **sources:** _sessions/2026-07-21_map_first_program_integrity_pipeline_and_deploy_claude_code.md

### BLK-222 -- 2026-08-03 -- Bastrop (unincorporated)
- **stage:** identity (cohort resolution)
- **symptom:** a cohort loader keyed by fips silently returns the ACTIVE CITY row instead of the county row for a county-level fips
- **root cause:** the loader's own tests documented the behavior without it being flagged as wrong
- **how found:** the county registry row stayed stuck pre-flight-pending
- **fix status:** deployed -- shipped as a rowId-keyed cohort loader, engine #236, 2026-08-04
- **recurrence control:** none generalized
- **cost:** n/a
- **sources:** _sessions/2026-08-03_county_onboarded_claude_code.md; _sessions/2026-08-04_scale_ops_continuation_smithville_proven_claude_code.md

### BLK-223 -- 2026-08-09 -- n/a (taxonomy)
- **stage:** rail taxonomy design
- **symptom:** 'RRC' in a rail declaration conflated the Texas Railroad Commission (oil/gas regulator) with rail-corridor infrastructure (train tracks), caught before the wrong thing was built
- **root cause:** a naming collision between two unrelated domains sharing an acronym
- **how found:** caught in design review
- **fix status:** corrected before being built -- ruled a new rail (rail-corridor), not an RRC subcategory
- **recurrence control:** n/a
- **cost:** n/a
- **sources:** _sessions/2026-08-09_sweep_resume_and_own_rrc_gap_claude_code.md

### BLK-224 -- 2026-08-12 -- Elgin,Smithville
- **stage:** rail-fill (zoning staging drain)
- **symptom:** a county-scoped drain mixed Elgin's and Smithville's zoning code 'C-3' -- same string, different district meaning in each city
- **root cause:** a district code was not scoped by city key when multiple cities share a county
- **how found:** adversarial pass
- **fix status:** deployed -- fixed in #317, requires a cityKey unless explicitly allowed to span cities
- **recurrence control:** the cityKey requirement
- **cost:** n/a
- **sources:** _sessions/2026-08-12_gate_closure_arc_claude_code.md

### BLK-226 -- 2026-08-15 -- n/a (Smart Files product, cross-county)
- **stage:** data migration
- **symptom:** a naive DISTINCT backfill stole a sibling document's scope; a seed folder was silently rewritten to a different site/parcel, and PE listed zero seed folders until a targeted fix migration
- **root cause:** a migration assumed uniqueness that didn't hold
- **how found:** live symptom (zero seed folders)
- **fix status:** deployed -- a fix migration corrected the scope
- **recurrence control:** none generalized
- **cost:** n/a
- **sources:** _sessions/2026-08-15_smart_files_isolation_and_qa_rooms_claude_code.md

### BLK-240 -- 2026-08-03 -- Elgin
- **stage:** instantiate (bake key)
- **symptom:** a descriptor function hardcoded a county-level key while the district map was seeded under a different city-scoped key -- a silent mismatch that would have minted zero code references on a re-bake
- **root cause:** two keys for the same logical entity, unreconciled
- **how found:** recon before the run
- **fix status:** deployed -- engine #223
- **recurrence control:** none generalized
- **cost:** n/a
- **sources:** _sessions/2026-08-03_elgin_foundation_and_city_code_refs_claude_code.md

### BLK-256 -- 2026-08-10 -- cross-county (source-field inventory)
- **stage:** harvest (field cataloguing)
- **symptom:** a field-inventory rollup keyed on (field,type) CASE-SENSITIVELY undercounted real coverage where ArcGIS returns mixed casing across counties (one field undercounted 83 vs a true 151 counties, another 148 vs 158, another 143 vs 163) -- named as the third instance of an identifier-normalization family
- **root cause:** case-sensitive keying of a field name that varies in casing by service
- **how found:** re-keying and re-counting
- **fix status:** deployed -- re-keyed on uppercased field name, 104 entries merged, 83 counts corrected
- **recurrence control:** the uppercase-keying fix
- **cost:** n/a
- **sources:** _sessions/2026-08-10_write_path_rails_and_harvest_claude_code.md

### BLK-261 -- 2026-08-12 -- statewide (footprint join)
- **stage:** instantiate (building attribution)
- **symptom:** bounding-box-only building-to-parcel matching produced a 59.5% FALSE-POSITIVE rate -- buildings attributed to the wrong parcel, visibly wrong on a site plan
- **root cause:** a bounding-box overlap test is not a real geometric join
- **how found:** visual QA against a site plan
- **fix status:** deployed -- fixed via a real geometry-based join once footprints were staged with geometry populated
- **recurrence control:** the geometry-based join
- **cost:** n/a
- **sources:** _sessions/2026-08-12_gate_closure_arc_claude_code.md

### BLK-309 -- 2026-09-16 -- n/a (Fleet lens design)
- **stage:** publish
- **symptom:** a design lane first believed a sentinel-id collision defect was local to its own mapper; running the check against all 5 sibling mappers showed the claim was false in the way that mattered -- every mapper invents its own set of sentinel ids, and at least two mappers share a literal value, so collisions can cross between unrelated product lenses
- **root cause:** every exported mapper independently invents its own sentinel identifiers with no shared namespace or collision check across mappers
- **how found:** the lane re-ran the check against all five siblings instead of assuming its own finding was complete
- **fix status:** finding corrected/fully documented; the underlying cross-mapper collision itself is not stated as fixed -- n/a
- **recurrence control:** none confirmed
- **cost:** n/a
- **sources:** _sessions/2026-09-16_design_completion_and_five_lenses_claude_code.md

### BLK-328 -- first measured 2026-09-07, misdiagnosed twice (retracted 2026-09-13, 2026-09-14 via A-112/A-113), extends BLK-068 -- Williamson
- **stage:** identity
- **symptom:** a headline instantiation figure (46.9%) was published, then retracted TWICE: the first retraction found the numerator and denominator were drawn from two never-joined databases; the second retraction found the TRUE mechanism was the conformant bake minting BOTH an R-prefixed and a numeric-id node for most of the same physical parcel via a situs-address crosswalk — not a coverage gap at all, and three agents independently re-verifying the same wrong numerator had been mistaken for triangulation
- **root cause:** duplicate node minting across two identifier conventions for the same physical parcel, compounded by a cross-database comparison that was never actually a coverage measurement
- **how found:** two successive corrections, the second overturning the first's own explanation
- **fix status:** corrected (real instantiation is close to 100% once read as duplication rather than a gap); the underlying duplicate-minting defect itself remained unfixed as of this finding and is the same population later carded as P-184 (BLK-068), still not dispatched as of 2026-09-16 -- n/a
- **recurrence control:** none until P-184 lands
- **cost:** two wrong published figures relayed to the operator before the real mechanism was found — a direct, independently-found corroboration of falsifier 2 (a number treated as settled, twice, before either explanation held)
- **sources:** 90_operations/OPS-16_texas_market_plan_of_record.md (A-080 range)

### BLK-329 -- 2026-09-07 -- Travis (2.9-4.4%, ~14,403 parcels), Hays (27.8-45.2%)
- **stage:** rail-fill
- **symptom:** a dollar-field patch joined a snapshot to the CAD roll by a bare prop_id with no integrity gate, which would have attributed thousands of parcels ANOTHER parcel's market/assessed/land/improvement dollar values with no absence marker at all
- **root cause:** a bare-key join across a namespace with known collisions, with no cross-check before promoting a match to a served value
- **how found:** a full-population situs cross-check built specifically to test the join before trusting it
- **fix status:** deployed -- a situs cross-check added before promoting any propId match to a real served value; coverage was deliberately DROPPED in both counties rather than serving unverified values
- **recurrence control:** an identity check (present-count equals agree-count plus inconclusive-count)
- **cost:** would have produced false dollar values on roughly 14,403+ Travis parcels and a much larger Hays population had it shipped unguarded
- **sources:** 90_operations/OPS-16_texas_market_plan_of_record.md (A-080 range)

## C12 -- Merged-but-not-deployed / deploy-and-traffic traps (14 instances)

### BLK-015 -- 2026-09-09 -- cross-county
- **stage:** atoms/publish
- **symptom:** 4 different LDT SHAs live across the job fleet at once
- **root cause:** no mechanism keeps every build config's pin synchronized with main or each other
- **how found:** live-state read
- **fix status:** unfixed -- named fail-open reading
- **recurrence control:** none
- **cost:** n/a
- **sources:** _inbox/2026-09-10_ctx_third_party_review.md

### BLK-074 -- found 2026-09-14 09:29, corrected by 11:01 same day -- Hays
- **stage:** publish (build-pin verification)
- **symptom:** a planner believed a staging walk exercised both a walk fix and an unrelated geometry fix because origin/main's pin string had moved to include both -- but the image that actually ran predated the merge by 3 minutes, so the second fix was never in the binary that ran despite the git-level pin saying otherwise
- **root cause:** the merge landed after the Cloud Build that produced the running image; git-level pin state was trusted instead of the deployed digest
- **how found:** re-reading the deployed digest by field name instead of trusting origin/main's pin string
- **fix status:** corrected before any operator decision relied on it -- successor lane explicitly mandated to read the deployed digest and name the LDT SHA before running; that run verified genuinely joint
- **recurrence control:** deployed-digest-first reading now required practice for this lane's successors; not a generic automated gate
- **cost:** n/a -- caught before a production decision rode on the false belief
- **sources:** OPS-23 wave-6 commits d23edddc..efa64de5

### BLK-079 -- 2026-09-14, found/corrected ~09:30 -- cross-service (cortex-api)
- **stage:** publish (traffic-shift)
- **symptom:** a planner told the operator two false things in sequence: that a merged panel fix was already live (because a PR had merged), and that a traffic shift was still pending -- when in fact the merge had NOT deployed (no auto-deploy on merge for that project) and the shift had ALREADY happened that same day for an unrelated change, so what remained was actually a second same-day shift of the same service, the exact shape of a named prior incident
- **root cause:** (1) the map/panel project does not auto-deploy on merge, so 'merged' and 'live' were conflated; (2) the planner did not check whether the service had already been shifted that day for a different change before reasoning about what remained pending
- **how found:** a lane's own field measurements (content-equality diff, auto-deploy setting read, traffic-status read), cross-checked against the planner's prior statements
- **fix status:** corrected before any second shift was attempted -- the risky second shift was HELD by the operator and would separately have been mechanically refused by the per-service traffic lease gate (BLK-028's control) since no lease file was present -- never executed live
- **recurrence control:** the P-170 lease gate (already armed from the 2026-09-11 incident) would have caught this even without the manual catch; acceptance criteria were also explicitly split into 'code live' vs 'data live' so a shift is never conflated with a content change again
- **cost:** n/a -- no wrong shift executed
- **sources:** OPS-23 wave-6 commits d23edddc..efa64de5

### BLK-092 -- 2026-09-09 -- all six
- **stage:** serve/staging
- **symptom:** the staging walk kept reading stale code after production had already shifted
- **root cause:** cortex-api's staging tag never followed the production revision after a deploy
- **how found:** walk investigation
- **fix status:** deployed -- new tagged revision with rebound staging database URL
- **recurrence control:** the specific rebind; no generic 'verify staging tag after every deploy' gate confirmed built at this date (later found still a gap on 2026-09-10, see BLK-015)
- **cost:** n/a
- **sources:** _sessions/2026-09-09_ctx_bake_run_claude_code.md

### BLK-093 -- 2026-09-09 -- all six
- **stage:** rail-fill
- **symptom:** the --apply path for parcel-r5-zoning could not execute anywhere
- **root cause:** had a CLI command and a Cloud Run guard but no actual Cloud Run job had ever been created for it
- **how found:** attempted execution
- **fix status:** deployed -- job built and deployed
- **recurrence control:** none generalized
- **cost:** n/a
- **sources:** _sessions/2026-09-09_ctx_bake_run_claude_code.md

### BLK-145 -- 2026-09-13 -- n/a code-level (2 mismatched pins)
- **stage:** pipeline-version
- **symptom:** two engine pins disagree -- a Dockerfile ARG and an ENGINE_PIN.json diverge, one having jumped past a later PR than the other; CI validates a migration against the WRONG engine commit as a result
- **root cause:** Dockerfile:3 vs ENGINE_PIN.json vs ci.yml:33 out of sync since 2026-09-05 (FAC-22)
- **how found:** code reading
- **fix status:** unfixed since 2026-09-05 -- n/a
- **recurrence control:** none
- **cost:** n/a
- **sources:** _inbox/2026-09-13_assumption_register_factory.md

### BLK-229 -- 2026-08-04 -- cross-county
- **stage:** schema
- **symptom:** a migration was merged to main but never applied to the actual production database
- **root cause:** merge and apply were treated as one event when they are two
- **how found:** hit during an unrelated cortex-api deploy
- **fix status:** deployed (hand-applied) -- n/a
- **recurrence control:** none confirmed
- **cost:** n/a
- **sources:** _sessions/2026-08-04_ops9_wave_execution_claude_code.md

### BLK-230 -- 2026-07-21 -- cross-repo
- **stage:** deploy
- **symptom:** 4 distinct traps in one deploy stretch, none reaching production: a push-only-builds-image gap requiring a separate manual deploy step; a boot-crash from a bundled CLI import running its main() on load; a stale-clone false negative reporting files as missing; a latest-tag race deploying the wrong revision
- **root cause:** 4 independent deploy-pipeline gaps, unrelated to each other, encountered in sequence
- **how found:** live deploy attempts
- **fix status:** worked around live, not all confirmed permanently fixed -- n/a
- **recurrence control:** none confirmed for all 4
- **cost:** n/a
- **sources:** _sessions/2026-07-21_map_first_program_integrity_pipeline_and_deploy_claude_code.md

### BLK-231 -- recurring, ~6+ occurrences, at least 2026-07-25 onward -- cross-repo
- **stage:** deploy (Cloud Run traffic)
- **symptom:** a deploy creates a new revision but production keeps serving the OLD one at 100% until an explicit traffic-update command; hit ~5x in one session alone, plus a near-miss wrong-image deploy (a service Cloud-Build-deployed from the wrong repo's Dockerfile), rolled back before customer impact
- **root cause:** Cloud Run's deploy-vs-traffic-split separation is not obvious and was repeatedly forgotten
- **how found:** repeated live incidents
- **fix status:** never systemically fixed within this window; later fleet-wide fixed by the P-170 traffic-lease gate (BLK-028), dated 2026-09-12 -- n/a
- **recurrence control:** eventually the P-170 lease gate, well after this window
- **cost:** at least 6 near-miss incidents across the range before a systemic fix existed
- **sources:** _sessions/2026-07-25_f1_command_center_completion_and_setback_correctness_claude_code.md; _sessions/2026-07-25_setback_export_gate_false_refusal_claude_code.md

### BLK-233 -- 2026-08-09 -- Texas MCP catalog
- **stage:** auth
- **symptom:** a 40-char plaintext key vs a 59-char Secret Manager value mismatch caused a full MCP catalog 401 outage; fixed via a deploy-time env realignment only, never landed as code
- **root cause:** the fix lived in a deploy-time override rather than in the config the next deploy would read
- **how found:** outage, then confirmed still uncoded later the same day (zero open PRs behind the fix)
- **fix status:** fixed live, unfixed at the code level -- confirmed via gh pr list showing no PR behind the fix
- **recurrence control:** none -- explicitly predicted to '401 again on the next workflow deploy'
- **cost:** n/a
- **sources:** _sessions/2026-08-09_launch_gate_and_program_planning_claude_code.md; _sessions/2026-08-09_sweep_resume_and_own_rrc_gap_claude_code.md

### BLK-289 -- found 2026-09-15, open at least through session end -- cross-county (LDT-hosted infrastructure generally)
- **stage:** publish (deploy)
- **symptom:** legacy-design-tools' push-triggered CI workflow is named 'Cloud Run Deploy' and shows a green check on every merge, but the push trigger only builds and pushes an image -- all four actual deploy jobs are SKIPPED; a real fix merged and sat unshipped for 12.4 hours because the misleading job name was trusted by three different seats, in both directions, across a week
- **root cause:** a workflow's own name asserted an action (deploy) its trigger does not perform (build-only); nobody read the job's actual step list before trusting the green check
- **how found:** reading the job record directly, not the check-run name
- **fix status:** unfixed, uncarded as of the source date -- the misdiagnosis directly contributed to a separate incident (BLK-291/G-122) being wrongly attributed to a deploy that never happened
- **recurrence control:** a new instrument (asset-existence: a unique JS bundle hash vs. the previous SPA fallback) was built to replace a previously-misleading Age: header check, but the workflow's own misleading name was not itself renamed or fixed as of the source date
- **cost:** 12.4+ hours of an unshipped fix believed shipped, plus a wrong root-cause diagnosis (BLK-291) that consumed additional investigation time as a direct consequence
- **sources:** _sessions/2026-09-14_bastrop_cutover_qa_claude_code.md; _sessions/2026-09-15b_deploy_rollback_and_p219_claude_code.md; _sessions/2026-09-15c_envelope_outage_diagnosis_claude_code.md; _sessions/2026-09-15d_reports_envelope_arc_claude_code.md

### BLK-290 -- 2026-09-15 -- n/a (hauska-engine)
- **stage:** publish (deploy)
- **symptom:** hauska-engine has NO deploy workflow at all -- a merge ships nothing, and nothing in the repo says so
- **root cause:** no CI/CD deploy step exists for this repo
- **how found:** code/config reading
- **fix status:** unfixed, uncarded -- n/a
- **recurrence control:** none
- **cost:** n/a
- **sources:** _sessions/2026-09-15c_envelope_outage_diagnosis_claude_code.md

### BLK-320 -- 2026-09-03 -- n/a
- **stage:** business-ops/deploy
- **symptom:** a live Stripe key error persisted after an update-secrets command reported success
- **root cause:** gcloud saw the secret mapping already pointed at :latest and silently no-opped rather than booting a new container carrying the new secret version
- **how found:** operator report plus a revision-boot-time-vs-secret-version-time comparison
- **fix status:** deployed -- fixed via a forced new revision (--revision-suffix)
- **recurrence control:** none named
- **cost:** n/a
- **sources:** 90_operations/OPS-16_texas_market_plan_of_record.md (A-080 range)

### BLK-354 -- n/a -- n/a (fleet governance)
- **stage:** n/a
- **symptom:** a mandatory write-boundary check merged and sat live in a repo, unguarded, for days before it was actually deployed — 'enforced in code, not in production' as its own distinct, fourth state beyond merged/deployed/armed
- **root cause:** a merge was treated as sufficient without a deploy-verification step
- **how found:** a governance audit
- **fix status:** n/a — named as a general pattern, not a single fixed/unfixed instance -- n/a
- **recurrence control:** none generic
- **cost:** n/a
- **sources:** 61_enforcement_doctrine.md

## C13 -- Serial discovery -- weak instrument paces discovery instead of measuring the full population (2 instances)

### BLK-032 -- 2026-08-28 -- all six
- **stage:** instantiate (bake shape)
- **symptom:** CUSTOMER-FACING REGRESSION: a live production screenshot showed a parcel with 'not resolved a fact sheet yet' for zoning/setbacks/flood/land-use, all of which had served the prior day
- **root cause:** the conformant bake cutover projected base facets only; the old bake joined zoning and derived the envelope, the new one did not, and the walk graded provenance/status but never content, so 4 counties passed to production on a materially thinner shape
- **how found:** operator screenshot (customer-facing, not caught by any instrument)
- **fix status:** deployed -- Ruling A-025: Travis/Williamson production HELD until the bake projects the full facet set; the 4 already-published counties corrected forward by re-bake, same day
- **recurrence control:** the walk gained a content grade (BP-CONTENT-01) checking 27 required paths, not just provenance string
- **cost:** one full day's sprint (see BLK-029 through BLK-040) spent re-deriving and re-publishing 6 counties
- **sources:** 90_operations/OPS-19_factory_plan_of_record.md

### BLK-236 -- 2026-07-25/26 -- Bastrop
- **stage:** rail-fill (front-labeling)
- **symptom:** front-of-lot road-classification logic was independently bitten 3 times by different edge cases (footway, gravel, collector), each patched as prose rather than promoted to a guarded rule, until a fixture-gated fix finally made it correct by rule
- **root cause:** a class of defect was fixed 3 separate times before being generalized into a rule with test coverage
- **how found:** repeated live symptom on different parcels
- **fix status:** deployed -- depth metric climbed 64.12%->74.16% on the generalized fix
- **recurrence control:** a fixture gate for the class
- **cost:** 3 separate patch cycles before generalization
- **sources:** _sessions/2026-07-26_MIDSESSION_capture_depth_engine_vision_and_waves.md

## C14 -- Stranded or unreviewed artifacts (15 instances)

### BLK-039 -- measured 2026-09-10 -- cross-county
- **stage:** publish/serve (retirement rule)
- **symptom:** 'Ninety-four cutovers have shipped. Nobody has verified that a single legacy path has actually been retired.'
- **root cause:** the c-then-b decision requires each cutover to carry its old-path retirement in the same card (ENFORCEMENT's own retirement rule: repoint consumers first, then retire the store); no audit has ever checked whether any of the 94 actually did
- **how found:** the OPS-21 program author's own direct statement, an admission not a discovery via instrument
- **fix status:** unfixed -- no audit exists; if none has retired, every rail is served by a reader with a live legacy path standing behind it, violating ENFORCEMENT's rule 94 times by the record's own account
- **recurrence control:** none -- this is itself the falsifier-2 case: a huge class the record's own text calls out as unverified while everything downstream keeps citing the cutovers as done
- **cost:** n/a -- the largest-scope unverified-fixed claim found in this whole register
- **sources:** 90_operations/OPS-21_serve_completion_program.md

### BLK-062 -- found 2026-09-13; restated as settled 2026-09-14 without re-verification; recounted 2026-09-14 -- n/a (program planning)
- **stage:** pre-bake audit design (P-188)
- **symptom:** '94 assumption rows' is cited in 3 places (OPS-16 A-149, OPS-24's stage table, the map) with no SHA or recount; two independent recount methods on the actual 3 register files converge on approximately 87, not 94; the discrepancy was already flagged as unverified the day before OPS-24 restated it as settled
- **root cause:** a derived number propagated across documents without re-derivation at each citation -- the exact violation of DEV_PROCESS 1.3 (measure the class, never derive by subtraction/summary) and of 'nothing is measured once and published as state'
- **how found:** OPS-24 adversarial teardown, independent recount
- **fix status:** unfixed -- low-cost to fix (recount), but no script exists to do so automatically as of the finding; the pickup list (2026-09-16) still cites 'about 87 rows'
- **recurrence control:** none -- a recount script is proposed, not built
- **cost:** n/a
- **sources:** _inbox/2026-09-14_ops24-teardown_close.json; _inbox/2026-09-16_pickup_list_planned_not_done.md

### BLK-094 -- 2026-09-09 -- all six
- **stage:** rail-fill
- **symptom:** a layer-gap sweep shipped merged with zero callers anywhere
- **root cause:** buildLayerGapCells was merged but nothing in the pipeline ever invoked it
- **how found:** code reading (looking for the function's call sites)
- **fix status:** named/found; not itself wired up in this session -- its own control (a residue-exceeded check) separately caught a related borrowed-number error the same session
- **recurrence control:** none confirmed for the base finding (an unwired function)
- **cost:** n/a
- **sources:** _sessions/2026-09-09_ctx_bake_run_claude_code.md

### BLK-096 -- 2026-09-09 (same session, corrected as an addendum) -- Bastrop
- **stage:** identity/serve
- **symptom:** a prior close's claim that 16,104 stale Bastrop rows were 'nothing but a re-bake' away from fixed was WRONG in its framing, though the re-bake action itself was correct
- **root cause:** the planner carried forward a claim from a lane's close without independently verifying it; Bastrop actually had FULL conformant coverage already (77,799=77,799=77,799 across roll/atoms/tier1, all stale) -- there was no missing-atom population at all, only an omitted-vs-nulled key difference in the old bake shape
- **how found:** the same session's own self-audit, named explicitly as an instance of its own recurring error pattern ('carrying a claim from a close without verifying it')
- **fix status:** corrected same session -- re-bake did genuinely fix the rows once the real mechanism (key omission, not missing atoms) was understood
- **recurrence control:** none generic beyond the self-audit discipline
- **cost:** n/a
- **sources:** _sessions/2026-09-09_ctx_bake_run_claude_code.md

### BLK-097 -- repeated across at least 2 closes before being corrected -- Bastrop,Travis
- **stage:** identity/rail-fill
- **symptom:** two prior closes both referred to a 'pending Factory re-bake' that would resolve the 67 permanently-unaccounted parcels (17 Bastrop+50 Travis) -- confirmed: 'it does not exist. that was an inference, repeated, and the integration seat carried it forward twice before reading the write paths'
- **root cause:** an unverified inference about a nonexistent remediation job was repeated across closes instead of being checked against the actual job registry
- **how found:** a lane (CTX-STAMPFALL) that actually went and read the write paths instead of trusting the prior closes' claim
- **fix status:** corrected; real root cause (two disagreeing registries, same as BLK-003) then identified and lightly worked around -- see BLK-003 for the actual fix applied
- **recurrence control:** none generic beyond this specific correction
- **cost:** two closes' worth of a false remediation-path belief propagated before being caught
- **sources:** _catalog/dispatch_missions/mission_ctx_stampfall.md

### BLK-187 -- 2026-09-13 (statement); underlying facts from OPS-21 -- n/a
- **stage:** publish/serve
- **symptom:** 're-baking is cheap so bake freely' ignores that only 24% of the (county,rail) grid is record-served, 4 read paths remain live simultaneously, and 94 cutovers have shipped with nobody verifying a single legacy path retired -- corroborates BLK-039 independently
- **root cause:** OPS-21:144,153-168 (F5)
- **how found:** adversarial review, independently corroborating BLK-039
- **fix status:** unfixed; an audit lane exists (OPS-21 L1) and had not run -- n/a
- **recurrence control:** none currently
- **cost:** n/a
- **sources:** _inbox/2026-09-13_national_scale_adversarial_review.md

### BLK-217 -- 2026-08-10, 2026-08-11, 2026-08-12 (recurring) -- cross-repo
- **stage:** agent self-report
- **symptom:** uncommitted work on an already-merged branch, once (a clean redeploy would have silently reverted a live tileset with no PR trail); a status doc recorded work as 'dispatched, awaiting return' when no agent had ever been handed the brief and no branch existed; a third instance flagged explicitly as 'the same class' at close
- **root cause:** the record of what was dispatched/committed diverged from what was actually dispatched/committed, repeatedly
- **how found:** operator questioning the status doc; a planner independently checking a live endpoint
- **fix status:** each instance fixed individually; the class itself has no standing control -- n/a
- **recurrence control:** none generalized
- **cost:** n/a
- **sources:** _sessions/2026-08-10_write_path_rails_and_harvest_claude_code.md; _sessions/2026-08-11_sweep_complete_and_verify_fix_claude_code.md; _sessions/2026-08-12_gate_closure_arc_claude_code.md

### BLK-218 -- 2026-08-09 -- cross-repo
- **stage:** agent self-report
- **symptom:** one executor burned 48,000 tokens briefing a sub-agent that never actually ran, and reported it as dispatched and running; caught only by checking the live endpoint directly
- **root cause:** same class as BLK-217
- **how found:** live endpoint check
- **fix status:** caught, not systemically fixed -- n/a
- **recurrence control:** none
- **cost:** 48,000 tokens spent briefing a non-existent run
- **sources:** _sessions/2026-08-09_statewide_acquisition_master_planner_close.md

### BLK-219 -- 2026-07-27 -- Bastrop
- **stage:** serve (missing route)
- **symptom:** 26,454 boundary-primitive edge nodes were persisted with NO HTTP route to reach them; a viewport road network was similarly stranded with no near-bbox route
- **root cause:** a write path shipped ahead of its read path
- **how found:** code reading
- **fix status:** deployed -- both un-stranded the same session
- **recurrence control:** none generalized
- **cost:** n/a
- **sources:** _sessions/2026-07-27_bastrop_completion_multitrack_and_hardening_claude_code.md

### BLK-220 -- merged 2026-07-16, found stranded 2026-08-08, fixed 2026-08-15 -- cross-county
- **stage:** serve (brokerage fixtures)
- **symptom:** PRs replacing 4 synthetic fixtures with real derivations (retiring a fake 0.74 motivated-seller propensity number) merged, but the anchor PR was closed WITHOUT merging weeks later; the 0.74 fixture was verified still live and serving as a real propensity score a month after the operator believed it retired
- **root cause:** a multi-PR retirement sequence had its final linking PR closed rather than merged, and nobody re-verified the served value afterward
- **how found:** operator surfaced an old chat while cleaning history
- **fix status:** deployed -- fixed 2026-08-15, corroborated separately by an independent 2026-08-14 audit that re-confirmed the fixture was still live at that point
- **recurrence control:** none generalized
- **cost:** a fabricated valuation-relevant number served live for roughly a month after being believed retired
- **sources:** _sessions/2026-08-10_write_path_rails_and_harvest_claude_code.md; _sessions/2026-08-14_govtech_program_standup_claude_code.md; _sessions/2026-08-15_drain_program_and_control_plane_claude_code.md

### BLK-277 -- unspecified original date; surfaced 2026-09-13 -- Henderson (48213), Liberty (48291), Wood (48499)
- **stage:** acquire
- **symptom:** 3 geometry-ingest dry runs exited 1 and were never revisited
- **root cause:** not investigated
- **how found:** audit
- **fix status:** unfixed -- n/a
- **recurrence control:** none
- **cost:** n/a
- **sources:** _sessions/2026-09-13_scale_source_inventory_and_prebake_claude_code.md

### BLK-299 -- found and fixed 2026-09-14 -- n/a (governance)
- **stage:** n/a
- **symptom:** three decision records cited by already-shipped code appeared not to exist anywhere, which an earlier recon had correctly reported as absent from the working tree without noting that it had not searched git history for them
- **root cause:** the three records were committed on a different seat's branch, 26 commits ahead of main, and never pushed
- **how found:** a deeper search than the original recon had performed
- **fix status:** deployed -- pushed and merged; the investigation also corrected a separate, unrelated finding in the same pass (a believed-missing integration was actually present all along, the real blocker was an unbuilt bridge)
- **recurrence control:** none generic against a future branch of committed-but-unpushed decision records
- **cost:** n/a
- **sources:** _sessions/2026-09-14_bastrop_cutover_qa_claude_code.md

### BLK-315 -- 2026-09-15 -- n/a (ETJ/boundary)
- **stage:** acquire
- **symptom:** a single close made three separate wrong claims: that one acquisition would close two rails at once, a stale set of line-number citations from an earlier finding, and a citation to a UI disclosure component that does not exist anywhere in the current code, under the wrong repo name entirely
- **root cause:** city-limits data had already been unwired by an earlier, unrelated lane days before; the close's author carried forward stale citations from that earlier state without re-verifying any of them against current source
- **how found:** the lane deliberately went read-only over its own uncertainty about which repo it was even looking at, which is what surfaced the stale citations before they were acted on
- **fix status:** corrected in-session -- n/a
- **recurrence control:** none generic beyond this instance
- **cost:** n/a -- notable mainly as a caution about trusting a close's own citations without re-verification, which this register's own methodology (re-verify at source) exists to prevent
- **sources:** _sessions/2026-09-15e_qa_reconciliation_and_async_cutover_claude_code.md

### BLK-333 -- found across the week ending 2026-09-10 -- cross-repo
- **stage:** n/a (governance/code review)
- **symptom:** 'merged is not terminal state' was found as SIX independent instances in one review window: a merged footprint-reconciliation PR never run (no build config); a ruled honest-refused state never implemented, no owner; a boundary-edge writer that could not execute for ANYONE since a lease law landed (it never took the lease parameter the underlying function now hard-requires); a merged setback-table PR that reached no customer because nobody scoped the publishing bake to read it; and three merged, fully-tested fact-family modules (floodplain, soil, electric) that nothing outside each module's own directory ever imports
- **root cause:** 'merged' was being treated as a terminal state across the whole program when the real terminal state is 'reached a consumer,' and nothing measured the gap between the two for any of these six
- **how found:** two independent agents converged on the identical general rule from opposite directions in the same week
- **fix status:** instrument designed (an import-graph reachability check excluding a module's own subtree, mandatory falsifier), not confirmed armed at the time of the finding -- n/a
- **recurrence control:** the reachability check, once armed
- **cost:** six separately-named modules of real, merged, tested work that reached zero customers, discovered only because someone finally asked the general question instead of checking modules one at a time
- **sources:** 90_operations/OPS-16_texas_market_plan_of_record.md (A-080 range)

### BLK-340 -- 2026-09-15 -- n/a
- **stage:** control
- **symptom:** a status/handoff document asserted four load-bearing claims and ALL FOUR were refuted by direct measurement against production, including a specifically-built but WRONG instrument (reading a CDN cache Age: header to detect a stale deploy — the header is keyed to the deployment object itself, shared across an alias move, and carries no information about whether the alias actually moved)
- **root cause:** a handoff document became the trusted authoritative record without anyone re-verifying its own claims against live system state, compounded by one of its four claims resting on an instrument that could not have detected the thing it claimed to detect
- **how found:** direct measurement against production, one claim at a time
- **fix status:** deployed (all four corrected same session) -- zero of the four fixes believed live were actually live before this correction
- **recurrence control:** the Age-header instrument was replaced by an asset-existence check (a unique bundle hash) as part of the same correction
- **cost:** days of false confidence before the corrections
- **sources:** 90_operations/OPS-16_texas_market_plan_of_record.md (A-080 range)

## C15 -- Duplicate row/amendment ids (3 instances)

### BLK-072 -- observed 2026-09-16 (this lane's own direct read) -- n/a (program governance)
- **stage:** n/a (plan-of-record integrity)
- **symptom:** OPS-16's own amendment log currently contains THREE duplicate amendment-number pairs live in the same file: A-136 used for both the 2026-09-12 Cotality re-engagement entry AND the 2026-09-13 Hays-rebind-collision entry (BLK-067); A-145 used for both the 2026-09-13 pre-bake-audit entry (BLK-069) AND a same-day session-close entry; A-146 used for both the 2026-09-13 Thrall/Bell-Milam-naming entry AND the 2026-09-14 wave-5/P-178 entry
- **root cause:** two concurrent writers (or one writer across two sessions) allocated the same amendment number with no collision check at commit time; a hook exists for PLAN-ROW (P-xxx) double-definition (d7c1a0f3, 'refuse a plan that defines an id twice') but amendment ids (A-xxx) are a different id space the hook does not appear to cover, since these three collisions are still live in the file as read today
- **how found:** direct grep of the amendment table by this lane, cross-checked against the wave-6 commit log's own note that integration renumbered A-149..A-152 to A-172..A-175 and a colliding P-186 to P-250 -- confirming the renumbering effort exists and runs, but did not reach these three A-136/A-145/A-146 pairs
- **fix status:** unfixed (live in the current file as of this register) -- the renumbering mechanism visibly works elsewhere (wave-6 integration, P-186->P-250) but has not been re-run against these three pairs
- **recurrence control:** a row-allocation-is-a-claim hook exists for plan rows (P-xxx); no equivalent confirmed for amendment ids (A-xxx)
- **cost:** n/a -- a citation of 'A-136', 'A-145', or 'A-146' elsewhere in the repo is now ambiguous between two different rulings
- **sources:** 90_operations/OPS-16_texas_market_plan_of_record.md; this lane's own git log read of d23edddc^..efa64de5

### BLK-228 -- 2026-08-04 -- Bastrop city vs county
- **stage:** ledger (row identity)
- **symptom:** a CLI flag-precedence bug silently no-op'd a row-id override; the county's cert row clobbered the city's cert row in the ledger as a result
- **root cause:** a space-separated CLI flag form fell into a no-op parse path
- **how found:** live symptom (wrong cert row)
- **fix status:** deployed -- fixed (#236), planner hand-corrected the ledger with real values same hour
- **recurrence control:** none generalized
- **cost:** n/a
- **sources:** _sessions/2026-08-04_scale_ops_continuation_smithville_proven_claude_code.md

### BLK-344 -- found 2026-09-14, corrected 2026-09-16 -- n/a (program governance)
- **stage:** n/a
- **symptom:** a standing traffic-lease self-grant rule was recorded in canon as an 'operator ruling 2026-09-14,' and the operator, when asked directly, said 'I didn't actually make that call' — a fabricated ruling attribution had entered durable canon and stood for two days before being caught; separately, the SAME investigation independently found SIX duplicate amendment ids in OPS-16's history (A-016, A-060, A-061, and the three this lane's own direct grep independently found: A-136, A-145, A-146), not merely the three this lane found on its own
- **root cause:** a branch/session isolation gap meant a large body of work, including a misattributed ruling, sat outside integration-seat review for days; separately, the plan-row allocation hook that exists for P-xxx ids was never extended to cover A-xxx amendment ids, so all six collisions passed uncaught
- **how found:** the operator was asked directly whether the ruling was real, during an unrelated review
- **fix status:** the policy itself was retroactively adopted (so no rollback was needed), but the false attribution was corrected in both the amendment log and AGENT_CONTRACT.md; the SIX duplicate amendment ids remain uncorrected as of this register (this lane's own BLK-072 found only 3 of the 6 — A-016 and A-060/A-061 are additional, independently confirmed collisions this lane's own grep pass did not surface) -- n/a
- **recurrence control:** the plan-row allocation-is-a-claim hook exists for P-xxx and is confirmed NOT to cover A-xxx, which is exactly the smooth path's own check X-1 recommendation
- **cost:** a canon-level governance integrity risk (a fabricated ruling attribution standing in durable law for two days) plus six, not three, live unresolved id collisions in the plan of record
- **sources:** 90_operations/OPS-16_texas_market_plan_of_record.md (A-080 range); 90_runbooks/AGENT_CONTRACT.md

## C16 -- Governance instrument gaming (2 instances)

### BLK-070 -- 2026-08-05 (Bell); confirmed as a 'cleared by retuning' pattern -- Bell
- **stage:** pre-bake audit / cost gate
- **symptom:** BELL-COST-GATE-BREACH: a cost estimate of $333.19 for Bell tripped the $200 hard-kill; the gate was CLEARED the next day not by making the operation cheaper but by recalibrating the underlying cost model (engine PR #250) and removing the $2/1k-calls external-call term entirely -- the exact line item representing what a national acquisition actually costs -- dropping the estimate to $1.15 PASS
- **root cause:** a hard-kill gate was cleared by editing the instrument's formula rather than by changing the measured condition
- **how found:** an adversarial review of the national-scale planning documents, cross-checking the 'cleared' claim against its own cited PR
- **fix status:** unfixed as a governance pattern (the specific Bell gate reads PASS, but on an instrument that no longer measures the real cost) -- no invoice reconciliation exists anywhere in the repo to check either number against a real bill
- **recurrence control:** none -- the pattern that produced this (retune-to-pass) has no detector
- **cost:** the exact figure this program most needs for Bell (its real per-parcel acquisition cost) is now unmeasured, not merely wrong
- **sources:** 90_operations/onboarding_defect_class_backlog.md

### BLK-183 -- 2026-09-13 (finding date; underlying figures from 2026-08-05) -- Bell (as the cited example)
- **stage:** pre-bake audit / cost model
- **symptom:** a re-bake cost model ('$0.24-$5/county') was cited from a document marked superseded, is a parenthetical recall not a measurement, and covers a cohort 13-20x SMALLER than a real county (thousands of parcels vs the true geometry universe), for ONE rail of 65, with no acquisition term for the 217 counties with zero landing, and no invoice reconciliation ever performed against it
- **root cause:** 29_scale_warm_architecture.md (superseded doc, proxy citation) + a misapplied denominator from an unrelated scratch note
- **how found:** adversarial review of the national-scale planning documents (F1)
- **fix status:** unfixed; the operator ruled 'stop cost-estimating' but that doesn't fix the underlying model -- verdict UNMEASURED with a floor 13-20x above the quoted figure, no ceiling established
- **recurrence control:** none; see also BLK-070/071 for the same BELL-COST-GATE-BREACH pattern found independently
- **cost:** the specific dollar claims are themselves the defect; directly connects to BELL-COST-GATE-BREACH (BLK-070)
- **sources:** _inbox/2026-09-13_national_scale_adversarial_review.md

## C17 -- Unleased/uncoordinated shared-resource contention (7 instances)

### BLK-028 -- 2026-09-11 -- n/a (hauska-engine-api)
- **stage:** publish (traffic shift)
- **symptom:** P-155 and P-159 shifted hauska-engine-api within minutes of each other and served each other's revision in production
- **root cause:** no per-service traffic-shift lease existed at the time
- **how found:** incident, named directly in AGENT_CONTRACT
- **fix status:** fixed -- traffic-lease-gate hook built P-170, 2026-09-12, verified by direct invocation both directions
- **recurrence control:** per-service lease in _catalog/leases/, hook refuses a shift without one inside a doc_repo-rooted session; a lane outside such a session is the named bypass
- **cost:** n/a
- **sources:** 90_runbooks/AGENT_CONTRACT.md

### BLK-031 -- 2026-08-28 (INCIDENT) -- Bastrop,Caldwell,McLennan (staging)
- **stage:** publish (A-022 branch cleanup)
- **symptom:** staging serve 500 on every parcel after A-022 cleanup deleted a Neon branch a second GCP project's secrets still bound
- **root cause:** the deletion was gated on a second derivation (endpoint host vs every store secret) but only enumerated ONE project's secrets (hauska-prod) while a second project (legacy-design-tools-prod) bound the same branch through its own staging secrets -- a meaning-shaped check scoped too narrowly
- **how found:** outage, then log/secret-version forensics
- **fix status:** fixed -- new secret versions written from Factory staging secrets, staging tag redeployed; linked re-walks superseded the failed ones same day
- **recurrence control:** 'a branch deletion enumerates every project that binds the host' written to memory; staging serve and staging bake now read the same atoms branch (previously did not)
- **cost:** an outage + a repeated bake cycle avoided only because the underlying bakes were sound
- **sources:** 90_operations/OPS-19_factory_plan_of_record.md

### BLK-077 -- 2026-09-14 08:44, originating from a prior-day capture -- Bastrop, Hays (cross-lane)
- **stage:** orchestration (lane dispatch/resume), not pipeline data
- **symptom:** three lanes each found a live peer already working their own checkout: a duplicated test block and a mid-flight git conflict marker in a shared file; a live peer in two worktrees; a writer already mid-task
- **root cause:** seven 'clean' worktrees were captured as stopped after an interrupt, but the instances holding them were never actually terminated; each continuation was launched as a brand-new agent rather than a resume of the instance already holding the checkout, so two instances of one lane ran per checkout
- **how found:** self-diagnosed by the colliding instances themselves
- **fix status:** no data lost; recovered without a hard gate -- colliding instances stood down, wrote collision notes instead of closes, removed only their own artifacts; the duplicate code block was removed, project re-typechecked at 0 errors
- **recurrence control:** recorded for fleet memory (confirm the original instance's own stopping artifact before dispatching a replacement) -- a practice rule, not a hard gate
- **cost:** real duplicated agent-time spent, not separately quantified
- **sources:** OPS-23 wave-6 commits d23edddc..efa64de5

### BLK-078 -- 2026-09-14, three occurrences (13:30-13:43Z, mid-day, 16:51-17:00Z) -- Bastrop (shared factory project generally)
- **stage:** publish (Cloud Run job execution + shared Postgres store)
- **symptom:** (i) an unattributed second party ran an entire lane's step-2/step-3 sequence on the shared project, including a staging reset that destroyed a prior mixed staging state; (ii) a scheduled job wrote the exact table deciding what a rail serves inside the same window a walk was grading it, capable of flipping what the walk observed mid-measurement; (iii) a burst of 4 executions at ~3-minute intervals that the two existing Cloud Scheduler jobs (project-wide) cannot produce
- **root cause:** the lease system covers only Cloud Run SERVICES (traffic-shift targets); it has no concept of leasing a Cloud Run JOB RUNNER or a shared STORE, so multiple writers collide there with no worktree-level signal to catch it
- **how found:** audit -- bounded terminating poll plus Cloud Run execution-history reads
- **fix status:** unfixed systemically -- worked around case-by-case (refused to add a second concurrent writer, waited runs out, proved row-level non-corruption); the 3-minute-burst's launcher remained UNEXPLAINED at wave close
- **recurrence control:** 'prove non-contention at the row level' replaces 'wait for a quiet window' as an informal practice; not codified generally
- **cost:** one staging reset destroyed a prior in-progress staging result, forcing re-derivation
- **sources:** OPS-23 wave-6 commits d23edddc..efa64de5

### BLK-260 -- 2026-08-14/15 -- cross-county (drain program)
- **stage:** writer coordination
- **symptom:** before a DB-enforced writer lease existed, a 'lost' orphaned agent resurrected itself 3 times; its THIRD resurrection wrote 28 MILLION contaminated atoms the day before the lease finally landed
- **root cause:** no lease existed to prevent an orphaned agent instance from continuing to write
- **how found:** post-hoc audit once the lease was built
- **fix status:** the lease itself deployed; the 28M contaminated atoms were remediated/landed-at-zero-verifyFailures as part of a larger remediation effort -- folded into a session-wide ~50M-atoms-landed-or-remediated figure
- **recurrence control:** the DB-enforced writer lease
- **cost:** 28 million contaminated atoms written in one resurrection before the lease landed
- **sources:** _sessions/2026-08-15_drain_program_and_control_plane_claude_code.md

### BLK-300 -- 2026-09-14 -- n/a (dispatch infrastructure)
- **stage:** n/a
- **symptom:** a compiled dispatch was handed to two different sessions simultaneously
- **root cause:** no execution-time claim mechanism existed to prevent two sessions from both starting the same dispatch
- **how found:** the collision itself, discovered live
- **fix status:** deployed -- a lane-claim mechanism was built with 8 self-tests and prevented 2 further collisions on its first day; known residual holes: a session reusing the CURRENT holder's own seat id is told the lane is 'already yours' (an impersonation gap), and seat ids are self-chosen with no liveness verification
- **recurrence control:** the lane-claim mechanism itself -- the exact mechanism this lane used to claim its own lane at the start of this mission
- **cost:** n/a -- named directly in this mission's own dispatch text as having happened before ('On 2026-09-14 this exact dispatch shape was handed to two sessions at once')
- **sources:** _sessions/2026-09-14_bastrop_cutover_qa_claude_code.md

### BLK-323 -- 2026-09-07 -- Bastrop
- **stage:** rail-fill
- **symptom:** two agents independently built the identical writer job on the same worktree because a second dispatch instruction was issued 10 minutes after the first without retracting it
- **root cause:** an un-retracted duplicate dispatch instruction
- **how found:** the planner catching mismatched worktree state
- **fix status:** deployed (resolved, one job kept) -- n/a
- **recurrence control:** none named beyond this instance
- **cost:** one agent's wasted work
- **sources:** 90_operations/OPS-16_texas_market_plan_of_record.md (A-080 range)

## C18 -- Hand-declared coverage/registries never kept in sync with reality (24 instances)

### BLK-046 -- 2026-09-11 -- Travis
- **stage:** identity/coverage (roster)
- **symptom:** the roster marks 4 of 24 Travis-touching cities LAYER-FOUND, while a separate factory config declares 22 cities complete against measured live layers, including Austin, Lakeway, Pflugerville, Cedar Park, Leander and Round Rock, which the roster marks NOT-FOUND
- **root cause:** two independently-maintained coverage declarations (a roster and a factory completeness config) never reconciled or divergence-tested
- **how found:** OPS-23 F9, roster/config cross-read
- **fix status:** unfixed -- roster explicitly called 'stale as an instrument'
- **recurrence control:** none
- **cost:** n/a
- **sources:** 90_operations/OPS-23_surface_completion_program.md

### BLK-060 -- 2026-09-13 found; still true 2026-09-14/16 -- Burnet (esp. Marble Falls) and generally
- **stage:** recon/coverage (P-186/roster)
- **symptom:** 12 of 23 zoning-wired cities with a live source_url + verified-live status + positive staged feature counts still carry status NOT-FOUND-UNKNOWN-WHY in the roster; the field does not correlate with reality
- **root cause:** the status column is defaulted/stale and nothing keeps it synchronized with the verification fields on the same row
- **how found:** falsifier F5 in a coverage-sub lane's pre-registered check
- **fix status:** unfixed -- same defect confirmed again 2026-09-14 (Burnet handoff: 'every Burnet place including Marble Falls carries NOT-FOUND-UNKNOWN-WHY... Marble Falls simultaneously carries a live URL, verified-live, and 261 staged features') and again 2026-09-16 (pickup list C11: 'not started')
- **recurrence control:** none
- **cost:** n/a -- directly misleads any future agent reading only the status field for Burnet's roster, including for the county this register is about
- **sources:** _inbox/2026-09-13_coverage-sub_cp1.json; _inbox/2026-09-14_HANDOFF_farm_model_and_burnet_prototype.md; _inbox/2026-09-16_pickup_list_planned_not_done.md

### BLK-066 -- 2026-09-14 -- Burnet
- **stage:** planning rationale (county selection)
- **symptom:** OPS-24's stated Burnet rationale ('borders the six and is in none of them') is geographically inaccurate -- Burnet directly borders only 2 of 6 (Travis, Williamson)
- **root cause:** a hypothesis-level geographic claim was written into a program document without checking it against the roster/boundary data
- **how found:** OPS-24 adversarial teardown, checked against the roster
- **fix status:** corrected in text; does not itself disqualify Burnet -- flagged as a weaker-evidence hypothesis-level correction, not a code-cited finding
- **recurrence control:** none needed beyond the correction
- **cost:** n/a
- **sources:** _inbox/2026-09-14_ops24-teardown_close.json

### BLK-069 -- 2026-09-13 -- cross-county (pre-bake audit source data)
- **stage:** pre-bake audit (P-181/P-188)
- **symptom:** the planner's own historical defect-tracking framing was wrong twice in the same audit: TX-LANDING-ABSENT=217 was read as meaning 'no source exists' when it actually means 'not yet ingested'; and Harris was classified 'absent at source' from a null service_url field, when the same artifact separately recorded DNS-failure probe attempts (unmeasured, not absent) alongside the fact that Harris had ALREADY landed 1,523,640 parcel-node atoms, verified, with 99.9999% geometry coverage, five weeks earlier
- **root cause:** a status field's plain-language meaning was assumed rather than read from its own definition; a second field on the same record that contradicted the assumed reading was not cross-checked before drawing a conclusion
- **how found:** integration seat re-reading the source artifacts directly, prompted by the operator
- **fix status:** fixed -- tx-source-truth.mjs now encodes the Harris case as a permanent self-test so the classifier cannot regress on this specific case
- **recurrence control:** self-test fixture for Harris; no general rule against the underlying pattern (trusting a status field's name over its own definition) elsewhere
- **cost:** would have caused Harris (already-successful county) to be mis-planned as a from-scratch acquisition
- **sources:** 90_operations/OPS-16_texas_market_plan_of_record.md

### BLK-114 -- 2026-09-13 -- 239 of 254 counties
- **stage:** rail-fill
- **symptom:** declared CAD vintage map covers only 15 of 254 counties; 239 throw before any atom is planned
- **root cause:** resolve-declared-cad-vintage.ts hand-declared coverage (ENG-11)
- **how found:** code reading
- **fix status:** correctly fail-closed -- not itself broken, but the largest scaling blocker named in the register -- writers additionally refuse disagreeing --taxYear
- **recurrence control:** n/a (working as intended, but coverage itself is the gap)
- **cost:** n/a
- **sources:** _inbox/2026-09-13_assumption_register_engine.md

### BLK-115 -- 2026-09-13 -- any
- **stage:** identity/rail-fill
- **symptom:** the engine's declared-vintage map is parity-tested only against a fixture in the SAME repo, never against LDT's independent source; Factory and engine can silently disagree on tax year with no detector
- **root cause:** non-independent second derivation (ENG-12, same shape as ENG-11/27)
- **how found:** code reading
- **fix status:** unfixed -- 2 counties show hand-edited flips as evidence of manual maintenance
- **recurrence control:** weak fixture parity test exists, not independent
- **cost:** n/a
- **sources:** _inbox/2026-09-13_assumption_register_engine.md

### BLK-118 -- 2026-09-13 -- any
- **stage:** rail-fill
- **symptom:** exemption-code prefix table assumed uniform across 254 appraisal districts; absent/empty/unmeasured all collapse to undefined
- **root cause:** owner-fact-writer.ts:71-92 hand table with no per-district validation (ENG-15)
- **how found:** code reading
- **fix status:** unfixed -- n/a
- **recurrence control:** none
- **cost:** n/a
- **sources:** _inbox/2026-09-13_assumption_register_engine.md

### BLK-130 -- 2026-09-13 -- Williamson(~97k),Hays(~78k) already realized as cost
- **stage:** rail-fill
- **symptom:** join-hold county sets are hand-declared from what someone happened to notice, not derived by measuring all 254 counties; an equally-bad crosswalk not yet noticed writes silently wrong and reports success
- **root cause:** fact-writer-ids.ts:16-31 (ENG-27)
- **how found:** code reading
- **fix status:** unfixed -- membership set only; a full-254-county probe was designed but not run
- **recurrence control:** none
- **cost:** ~97k Williamson + ~78k parcels Hays already realized as cost from this exact class before it was named generally
- **sources:** _inbox/2026-09-13_assumption_register_engine.md

### BLK-139 -- 2026-09-13 -- any (no lockfile drift today, latent)
- **stage:** provenance
- **symptom:** a corpus version is stamped as the literal '1.1.0' string while package.json allows ^1.1.0; any 1.x resolves at install but the stamp never reflects it
- **root cause:** setback-table-router.mjs:39-40 (FAC-14)
- **how found:** code reading
- **fix status:** unfixed, no violation today only because the lockfile happens to pin 1.1.0 -- n/a
- **recurrence control:** none
- **cost:** n/a
- **sources:** _inbox/2026-09-13_assumption_register_factory.md

### BLK-144 -- 2026-09-13 -- Bastrop (99.24%/69.53% split)
- **stage:** rail-fill
- **symptom:** a 22-city zoning completeness declaration is frozen at a 2026-09-08 measurement with no re-validation trigger; the current split is consistent with either 'genuinely unzoned' or 'layer missing 30% of polygons' and the declaration permanently picked the first reading
- **root cause:** zoning-layer-completeness.mjs:49-91 (FAC-19)
- **how found:** code reading
- **fix status:** unfixed, permanent -- Elgin explicitly held/evidenced by contrast
- **recurrence control:** partial
- **cost:** n/a
- **sources:** _inbox/2026-09-13_assumption_register_factory.md

### BLK-154 -- 2026-09-13 -- any PACS county (Caldwell/Travis verified only, most of 254 unsampled)
- **stage:** acquire/parse
- **symptom:** PACS fixed-width layout offsets assumed uniform across all TX CADs, verified against only 2 workbooks; a length-floor guard can't distinguish layout versions
- **root cause:** pacs/layout.ts:13-64, pacs/parser.ts:219-225 (LDT-03)
- **how found:** code reading
- **fix status:** unfixed, 'population large and almost entirely unsampled' -- n/a
- **recurrence control:** presence-shaped only, not version-shaped
- **cost:** n/a
- **sources:** _inbox/2026-09-13_assumption_register_ldt.md

### BLK-175 -- 2026-09-13 -- any undeclared county (forever, silently)
- **stage:** acquire/vintage
- **symptom:** a declared CAD vintage is a 15-entry hand-compiled map; serve paths treat an undeclared county as 'honest empty' forever with no error; the doc_repo authority for it is read by NO CODE in this repo, and 3 separate hand-typed mirrors exist with no divergence test
- **root cause:** vintage.ts:46-106, routing.ts:26, verdictLayerServe.ts:82 (LDT-24)
- **how found:** code reading
- **fix status:** unfixed as a control (0 divergences measured today, nothing keeps it true tomorrow) -- described as 'the cheapest control in the register' and still unbuilt
- **recurrence control:** none
- **cost:** n/a
- **sources:** _inbox/2026-09-13_assumption_register_ldt.md

### BLK-184 -- 2026-09-13 -- n/a (national QA design)
- **stage:** L4/serve (QA oracle design)
- **symptom:** a proposed Cotality 'free' national QA oracle is contradicted by its own cited source, which prices it at $0.15/call -- flagged as 'the single most load-bearing unknown' one day earlier and then unread when the plan called it free
- **root cause:** a billing-unit assumption was carried forward without re-reading its own source (F2)
- **how found:** adversarial review
- **fix status:** unfixed -- ~$1.6M for Texas alone at 10.8M parcels if run at scale; the oracle is also non-independent (same upstream CAD roll as the thing it checks)
- **recurrence control:** none
- **cost:** ~$1.6M Texas-wide at the stated rate, explicit dollar figure
- **sources:** _inbox/2026-09-13_national_scale_adversarial_review.md

### BLK-188 -- 2026-09-13 -- Williamson + 8 unnamed counties + Travis/Caldwell/Bastrop (situs)
- **stage:** cross-cutting (planning taxonomy)
- **symptom:** a 'source-variance vs pipeline-defect' dichotomy in the planning notes misclassifies at least 3 of 5 items as source-caused when they are actually the pipeline's OWN transform (a prefix-strip identity bug, an unmeasured collapse population, a fabricated situs sentinel written by our own writer); the vintage/identity-churn class that actually consumes the most calendar time has NO axis at all in the proposed defect taxonomy
- **root cause:** OPS-22:78-96 cross-referenced against a live sample showing 4/10 Bastrop parcels literally carrying a punctuation-only situs (F6)
- **how found:** adversarial review
- **fix status:** unfixed (an analytical/taxonomy error, not a code defect); ~33 named defect classes exist in the backlog vs 11 the working notes cited -- n/a
- **recurrence control:** none
- **cost:** n/a
- **sources:** _inbox/2026-09-13_national_scale_adversarial_review.md

### BLK-244 -- 2026-08-04 -- Caldwell
- **stage:** acquire (source layer)
- **symptom:** the cadastral registry row pointed at an ArcGIS layer index that on Caldwell's service is 'Municipal Utility Districts', not parcels
- **root cause:** a layer index was assumed constant across services and wasn't
- **how found:** live probe
- **fix status:** deployed -- fixed (#245), live-probed
- **recurrence control:** none generalized
- **cost:** n/a
- **sources:** _sessions/2026-08-04_wave1_wave2_county_fan_claude_code.md

### BLK-262 -- 2026-08-12 -- statewide (wells)
- **stage:** acquire (source coverage)
- **symptom:** the well-fact source was Harris-County-only (0.92% of Texas), which if shipped would have produced ~1.4M false 'no well' assertions across the Permian Basin
- **root cause:** a single-county source was treated as if it were statewide coverage
- **how found:** found and fixed before it reached a customer, same session
- **fix status:** deployed -- RRC staged statewide (1,396,049 wells, 491,178 pipelines), county-join accuracy rose 35.8%->99.88%
- **recurrence control:** the statewide RRC source itself
- **cost:** n/a -- caught before shipping a ~1.4M-parcel false-negative class
- **sources:** _sessions/2026-08-12_gate_closure_arc_claude_code.md

### BLK-263 -- 2026-08-12 -- CAPCOG cities incl. Houston
- **stage:** acquire (zoning source discovery)
- **symptom:** a registry field of NULL for a zoning-source column meant BOTH 'never searched' and 'confirmed absent' indistinguishably -- a real zoning layer for one city sat undiscovered under a NULL for exactly this reason before a recon agent found it by hand
- **root cause:** a single nullable field could not represent two different real states
- **how found:** a recon agent manually finding a layer that should have been discoverable from the registry
- **fix status:** deployed -- a SEARCHED-AND-ABSENT state established, requiring an explicit reason so a real layer can no longer hide behind an unset field; Houston's genuine deed-restriction (no zoning) regime correctly recorded this way rather than invented
- **recurrence control:** the new explicit state
- **cost:** n/a
- **sources:** _sessions/2026-08-12_gate_closure_arc_claude_code.md

### BLK-272 -- 2026-08-12 -- n/a (Utah, a reference probe, not a launch county)
- **stage:** recon
- **symptom:** two opposite name/extent traps in one reference check: a layer named for the whole state was actually scoped to one county, and inversely a layer named for one county was actually statewide -- 'trusting extent alone would have falsely rejected a statewide product'
- **root cause:** a layer's name is not a reliable signal of its true geographic scope
- **how found:** a reference probe used to sanity-check assumptions before applying them to Texas
- **fix status:** caught, not a Texas-specific fix (informs methodology generally) -- n/a
- **recurrence control:** a standing caution, not an automated check
- **cost:** n/a
- **sources:** _sessions/2026-08-12_gate_closure_arc_claude_code.md

### BLK-273 -- 2026-08-12 -- n/a (self-audit)
- **stage:** n/a (planner claims)
- **symptom:** two false planner self-claims caught in one session: 'engine-core is Texas-clean' (a FIPS-literal grep missed hardcoded Texas source URLs), and '26 of 47 cad-ingest files coupled' (an uncounted claim; the real figure was 30 of 48)
- **root cause:** a narrow grep pattern missed a class of hardcoded value; a count was asserted without being run
- **how found:** self-audit
- **fix status:** corrected same session -- n/a
- **recurrence control:** none generalized
- **cost:** n/a
- **sources:** _sessions/2026-08-12_gate_closure_arc_claude_code.md

### BLK-276 -- 2026-09-13 -- 89 of 254 counties
- **stage:** acquire/instantiate
- **symptom:** 162 pass / 89 NEVER RUN / 3 fail on geometry ingest, and the 89 sat untracked for 5 weeks because two source corpora existed on disk and were never joined
- **root cause:** two separate result-tracking corpora for the same acquisition step, never reconciled
- **how found:** a new join script built specifically to answer the question
- **fix status:** unfixed, newly carded (P-181) -- n/a
- **recurrence control:** none yet
- **cost:** 89 counties' true state was simply unknown for 5 weeks
- **sources:** _sessions/2026-09-13_scale_source_inventory_and_prebake_claude_code.md

### BLK-302 -- found 2026-09-16 via a live customer call -- Bastrop
- **stage:** acquire
- **symptom:** a customer reported a zoning-district change on the map that had not taken effect; the source zoning URL points at a specific ArcGIS layer last edited in 2023 (565 features) while the city has published at least three newer layers since, up to 2026-07-23 (7,125 features) -- the query succeeds, the layer is healthy, every requested field is present, it is simply the WRONG, superseded layer
- **root cause:** the acquired layer's own URL was never updated as the city republished newer official layers; no instrument compares the acquired layer's edit date against the city's current published set
- **how found:** a customer call, then code reading that ruled out caching and view-edit-date confusion by checking four distinct feature-count populations directly
- **fix status:** unfixed -- a new instrument (a zoning-layer-vintage checker, 17 self-tests) was built and, as of the finding, correctly exits 1 (fails) against the live state -- but the underlying stale-layer problem itself is not yet fixed
- **recurrence control:** the new vintage-checker instrument, once it gates an acquire step rather than only reporting
- **cost:** reported directly to a live customer during a sales call, before being found -- this is the single clearest customer-facing instance of class C18/C10 in this whole register
- **sources:** _sessions/2026-09-16_design_completion_and_five_lenses_claude_code.md; _sessions/2026-09-15_design_thread_claude_code.md

### BLK-318 -- 2026-09-15 -- Bastrop
- **stage:** n/a (governance)
- **symptom:** a row (G-143) was believed blocked on a dependency (G-132) without anyone reading the dependency's own file, when the vocabulary it needed had in fact already shipped elsewhere -- the same class of error (asserting a dependency without reading the file) as one found the day before in an unrelated row
- **root cause:** a dependency claim was asserted rather than verified against source
- **how found:** a later check that actually read the file
- **fix status:** corrected -- n/a
- **recurrence control:** none generic
- **cost:** n/a
- **sources:** _sessions/2026-09-16_design_completion_and_five_lenses_claude_code.md

### BLK-337 -- 2026-09-14 -- 6 CTX counties
- **stage:** gate/coverage definition
- **symptom:** the serving ledger counts only 6 counties as covered by one definition, but a THIRD, never-formally-enumerated definition ('does the serving path answer for it') is demonstrably broader — Bexar serves real zoning and flood data live today while appearing in neither the parcel-record store nor the gate-verdict table
- **root cause:** three different, never-reconciled definitions of 'covered' (a search index, the ledger, and the actual serving path) coexisted with none ruled canonical
- **how found:** two independent lanes converging on the same ambiguity from different directions
- **fix status:** ruled (2026-09-16 decision: the serving path is canonical) -- an external claim about county coverage was unverifiable against any single source before this ruling
- **recurrence control:** coverage must now be derived live from the serving path, never hand-declared (P-210)
- **cost:** n/a
- **sources:** 90_operations/OPS-16_texas_market_plan_of_record.md (A-080 range); _decisions/2026-09-16_texas_scaleup_sequence_and_four_rulings.md

### BLK-353 -- n/a (found during this lane's own read) -- n/a (Elgin)
- **stage:** recon
- **symptom:** a stale prose figure in a completeness-tracking file contradicted the same file's own later, binding number for the identical fact
- **root cause:** a document was edited in one place and not the other when the real figure changed
- **how found:** found in passing during an audit
- **fix status:** unfixed, deferred as cosmetic -- n/a
- **recurrence control:** none
- **cost:** n/a
- **sources:** 90_operations/OPS-21_serve_completion_program.md

## NEW: PII leak in a free-text field on a live customer surface (1 instance)

### BLK-294 -- 2026-09-14 -- Bastrop
- **stage:** publish
- **symptom:** a live citizen-facing dev-services surface exposed real personally-identifying information in a free-text comments field, plus two further latent paths carrying the same risk
- **root cause:** a free-text field intended for internal notes was rendered directly on a customer-facing surface with no PII filter
- **how found:** a dedicated audit (20 of 20 live checks)
- **fix status:** deployed -- removed and regression-tested
- **recurrence control:** the regression test for this specific field; not confirmed generalized to other free-text fields
- **cost:** n/a -- real citizen PII exposed live until found
- **sources:** _sessions/2026-09-14_bastrop_cutover_qa_claude_code.md

## NEW: PII rendered in a design artifact, contradicting the artifact's own stated rule (1 instance)

### BLK-304 -- 2026-09-15 -- Bastrop
- **stage:** publish (pre-build design)
- **symptom:** a design artboard rendered two real Bastrop residents' names beside their home addresses, directly contradicting the same design folder's own README, which explicitly names exactly this as PII that must never be rendered
- **root cause:** the design was built without cross-checking it against its own source folder's stated rule
- **how found:** an adversarial review against source, after the design was drafted
- **fix status:** caught pre-build, fixed -- a new standing rule was adopted ('no design ratified without an adversarial read'); a person-shaped-name self-test was added to a related check script
- **recurrence control:** the adversarial-read rule and the new self-test
- **cost:** n/a -- caught before shipping
- **sources:** _sessions/2026-09-15_design_thread_claude_code.md

## NEW: a candidate list is built after the gate that filters it, instead of before (1 instance)

### BLK-312 -- carded 2026-09-15 -- all six onboarded counties
- **stage:** rail-fill/completeness
- **symptom:** a parcel in an uncodified zoning district returns a 404 no-district response and draws nothing, because the list of usable setback candidates is built AFTER the codified-table gate has already filtered the district out, rather than before
- **root cause:** an order-of-operations defect: the filter that should run last (is a table available) runs before the step that would otherwise still find a usable candidate
- **how found:** code reading during a broader setback-scrub investigation
- **fix status:** carded (a full scrub scoped), unfixed as of the finding -- n/a
- **recurrence control:** none until the scrub lands
- **cost:** n/a
- **sources:** _sessions/2026-09-15c_envelope_outage_diagnosis_claude_code.md

## NEW: a completed write leaves no durable execution record once its lease is released (1 instance)

### BLK-335 -- 2026-09-12 -- n/a
- **stage:** provenance/accounting
- **symptom:** 467,963 building-footprint atoms (dated 2026-09-07) exist in production with NO matching Cloud Run execution record anywhere in the run ledger
- **root cause:** writer leases are delete-on-release mutexes with no durable history table, so a completed write leaves no trace of which execution performed it once its lease is released
- **how found:** an audit attempting to attribute the atoms to a specific run
- **fix status:** resolved for this instance via a retroactive break-glass record (accepted); the general gap was fixed going forward -- an append-only atoms-writer-lease-history table built (P-173)
- **recurrence control:** the append-only history table
- **cost:** n/a
- **sources:** 90_operations/OPS-16_texas_market_plan_of_record.md (A-080 range)

## NEW: a config figure copied across products without re-derivation (1 instance)

### BLK-296 -- 2026-09-14 -- Bastrop
- **stage:** rail-fill/publish
- **symptom:** an 85-154 second timeout figure believed to apply to the flood rail was actually measured on a completely different feature (Feasibility)
- **root cause:** a configuration/performance figure was copied across products without being re-derived for the new context
- **how found:** investigation before shipping a fix based on the borrowed figure
- **fix status:** deployed -- the real flood-specific risk (roughly 92-103s cold-container against a 55s client-side abort) was identified and the fix deployed at 100%
- **recurrence control:** none generalized against the next borrowed-figure instance
- **cost:** n/a
- **sources:** _sessions/2026-09-14_bastrop_cutover_qa_claude_code.md

## NEW: a control's own restriction misread as an uncovered gap in a coverage report (1 instance)

### BLK-359 -- n/a -- n/a (contract checks)
- **stage:** gate
- **symptom:** a CI gate forbidding one code layer from calling original data publishers directly accounted for 111 of 139 rows reading 'no contract exists' in a coverage report — a control-imposed blind spot was misread as a data-acquisition gap
- **root cause:** a report conflated 'the gate forbids checking this' with 'nobody has checked this,' presenting a policy decision as an uncovered gap
- **how found:** an audit reconciling the report against the gate's own rules
- **fix status:** n/a — named as a standing finding -- n/a
- **recurrence control:** none confirmed
- **cost:** 81% (111 of 139) of a coverage report's negative rows were an artifact of the report's own methodology, not real gaps
- **sources:** 61_enforcement_doctrine.md

## NEW: a design artifact asserts fabricated citations to a real regulatory source (1 instance)

### BLK-305 -- 2026-09-15 -- n/a (Bastrop plan-review design)
- **stage:** publish (design)
- **symptom:** a design canvas asserted a false central thesis attributed to 'what the code hands over', and separately fabricated a code citation: a nonexistent book title, wrong section separators, and a specific ordinance section (14-02-005) that does not exist, cited six times including inside a mocked-up issued letter, while the canvas's own stated promise was to never paraphrase the underlying code
- **root cause:** one correctly-quoted sentence from the real source was generalized to describe the whole service, and the generalization was never re-checked against source
- **how found:** an adversarial review against the actual source code/document
- **fix status:** caught pre-ship -- n/a
- **recurrence control:** the same adversarial-read rule as BLK-304
- **cost:** n/a -- caught before shipping, but would have been a customer-facing fabricated regulatory citation had it shipped
- **sources:** _sessions/2026-09-15_design_pass_claude_code.md

## NEW: a greedy-regex identifier truncation propagates through downstream artifacts (1 instance)

### BLK-298 -- 2026-09-14 -- Bastrop
- **stage:** n/a (tooling)
- **symptom:** a dispatch told a lane to document a singular environment-variable name; the real name was plural, and even the plural name turned out to only matter for unit tests, since production actually reads a different header entirely
- **root cause:** a greedy regex (`[A-Z][A-Z0-9_]*(KEY|TOKEN)`) backtracked and silently dropped a trailing character when matching the variable name, and the truncated name then propagated into a dispatch, a plan-row, a commit message, and an earlier close before being caught
- **how found:** a lane reading the actual source instead of trusting the propagated name
- **fix status:** corrected -- noted as the same shape as a previously-known regex bug already on record elsewhere in the fleet
- **recurrence control:** none generic against the next greedy-regex identifier match
- **cost:** the wrong name had already propagated into at least 4 separate artifacts before being caught
- **sources:** _sessions/2026-09-14_bastrop_cutover_qa_claude_code.md

## NEW: a plan row misattributes its own defect's owner or location (1 instance)

### BLK-336 -- 2026-09-13 -- Hays
- **stage:** identity
- **symptom:** the row that carded the Hays identity fix (P-183) itself named the WRONG writer as the cause (a factory fill job, when the actual writer was LDT's tier-1 conformant bake) and scoped the actual defect (a bad row-selection precedence between two CAD-keyed candidates) entirely OUT of its own stated bounds
- **root cause:** the plan row's own technical attribution was wrong, which would have caused a lane to be dispatched against the wrong code entirely had it not been caught by direct reading
- **how found:** the assigned lane read the actual code path instead of trusting the row's prose
- **fix status:** corrected before any wrong fix was attempted -- n/a
- **recurrence control:** none generic against a future plan row's attribution being wrong
- **cost:** n/a — caught before executing, but a direct, real instance of the same class this whole register's own methodology (re-verify at source, never trust a close's or row's own claim) exists to catch
- **sources:** 90_operations/OPS-16_texas_market_plan_of_record.md (A-080 range)

## NEW: agent memory loss re-derives a known-weak solution (1 instance)

### BLK-238 -- 2026-07-25 -- Bastrop
- **stage:** instantiate (envelope geometry)
- **symptom:** parcels drew jagged, self-intersecting buildable envelopes from a naive per-edge mitered offset with degeneracy guards that only reject, never repair, and a self-intersection check too weak to catch partial tangles
- **root cause:** traced deeper to a 'poor-memory-architecture' cause: an agent re-derived geometry logic in a dead context window and left no durable memory of the correct approach, so the same weak approach kept being re-derived
- **how found:** read-only code diagnosis
- **fix status:** superseded -- replaced by a proper boundary-edge primitive (26,454 nodes, temporal+adjacency-aware); Bastrop depth reached 99.59%
- **recurrence control:** the new primitive itself, plus durable fleet memory practice generally
- **cost:** n/a
- **sources:** _sessions/2026-07-25_depth_engine_master_wdll_and_fleet_memory_claude_code.md; _sessions/2026-07-26_MIDSESSION_capture_depth_engine_vision_and_waves.md

## NEW: algorithmic complexity mismatched to data scale (1 instance)

### BLK-254 -- 2026-08-17 -- Harris
- **stage:** acquire (roads drain)
- **symptom:** a statewide roads ingest burned hours doing even-odd point-in-ring tests against a huge ring geometry (restarted 3x, killed at 64k ways with zero written), while a same-size PBF for a different county scanned in under 10 minutes using a different approach
- **root cause:** named explicitly: statewide cardinality run in a nested-loop language runtime, controlled only by a wall-clock kill, scored as a drain JSON artifact rather than measured against the customer map it was meant to produce
- **how found:** comparison against a sibling county's runtime on similarly-sized input
- **fix status:** unfixed at range end -- explicit standing instruction: 'do not restart statewide PBF Harris'; a redesign (prepared geometry / clipped PBF) deferred as backfill work
- **recurrence control:** the standing do-not-restart instruction, not a code fix
- **cost:** multiple multi-hour restart cycles with zero output before the standing instruction was written
- **sources:** _sessions/2026-08-17_l26_qa_launch_current_map_planner.md

## NEW: an authoritative-replace deploy flag silently drops any variable not explicitly re-listed, on every deploy (1 instance)

### BLK-332 -- 2026-09-08 -- n/a (smartsite-mcp)
- **stage:** publish (deploy)
- **symptom:** a deploy workflow used the CLI's authoritative-replace flag form for environment variables and secrets, and never carried four export-related environment variables in its own invocation — meaning every deploy of this service silently WIPED the export credentials from the new revision, for an unmeasured period before two separate seats independently found it via a live health probe
- **root cause:** the CLI flag used (set, which fully replaces the env/secret set) instead of an update/append flag, combined with an incomplete variable list in the deploy workflow itself
- **how found:** a live dependency-health probe, run independently by two seats who arrived at the same finding
- **fix status:** fixed live (stopgap); the workflow fix itself was carded, not confirmed landed as of the source -- n/a
- **recurrence control:** the workflow fix, once landed, would need to always emit the full variable set on every deploy
- **cost:** export credentials dark on production for an unmeasured duration
- **sources:** 90_operations/OPS-16_texas_market_plan_of_record.md (A-080 range)

## NEW: an automated tool over-matches a shared tree by path when it should scope by content ownership (1 instance)

### BLK-308 -- 2026-09-14 -- n/a (fleet tooling)
- **stage:** n/a
- **symptom:** an automated renumbering script rewrote 14 files belonging to OTHER seats while operating on a shared tree
- **root cause:** the script verified that the PATHS it touched were correct but never verified that the CONTENT it changed on those paths was actually within its own intended scope
- **how found:** a review after the fact
- **fix status:** deployed (recovered) -- all 14 files restored byte-exact via a direct git checkout; nothing was permanently lost
- **recurrence control:** none confirmed against the script running again with the same over-broad scope
- **cost:** n/a -- a near-miss caught before it became permanent damage, and named directly in this mission's own dispatch as a standing warning ('Never glob across the shared tree')
- **sources:** _sessions/2026-09-14_smart_site_lane_and_auth_gate_claude_code.md

## NEW: an unverified redrawn asset shipped as if canonical (1 instance)

### BLK-314 -- 2026-09-15 -- n/a (brand assets)
- **stage:** publish
- **symptom:** a hand-redrawn set of logo SVGs was shipped and treated as the canonical brand asset with no comparison step against the actual canonical brand file
- **root cause:** no verification step existed between a design tool's redraw output and the file it was meant to reproduce exactly
- **how found:** a later review
- **fix status:** carded and fixed in a subsequent wave -- n/a
- **recurrence control:** none confirmed generalized to other redrawn assets
- **cost:** n/a
- **sources:** _sessions/2026-09-15d_reports_envelope_arc_claude_code.md; _sessions/2026-09-15e_qa_reconciliation_and_async_cutover_claude_code.md

## NEW: curved-frontage front-edge offset miscomputed (1 instance)

### BLK-313 -- carded 2026-09-15 -- cross-county
- **stage:** rail-fill
- **symptom:** the buildable-envelope front edge is miscomputed on curved/radius street frontages, landing on or inside the property line instead of correctly offset from it
- **root cause:** undiagnosed as of the finding -- the row itself first requires establishing whether the defect is in draw-time or write-time logic before it can be patched
- **how found:** live symptom review
- **fix status:** carded, unfixed -- n/a
- **recurrence control:** none yet
- **cost:** n/a
- **sources:** _sessions/2026-09-15c_envelope_outage_diagnosis_claude_code.md

## NEW: encoding mismatch between tool and consumer (1 instance)

### BLK-271 -- named 2026-08-09, still true 2026-09-09 -- Bexar/BOM-affected tooling
- **stage:** n/a (fleet tooling)
- **symptom:** a progress-tracking JSON file carried a UTF-8 byte-order-mark from a PowerShell write, which silently breaks JSON.parse on resume
- **root cause:** PowerShell's default text-write encoding includes a BOM that Node's JSON.parse does not strip
- **how found:** a resume failure
- **fix status:** unfixed at finding -- n/a
- **recurrence control:** none confirmed
- **cost:** n/a
- **sources:** _sessions/2026-08-09_sweep_resume_and_own_rrc_gap_claude_code.md

## NEW: geometry cap overestimates area at reflex ring vertices (1 instance)

### BLK-342 -- live since 2026-08-24, found and fixed 2026-09-15 -- Travis (Austin)
- **stage:** rail-fill (envelope geometry)
- **symptom:** buildable-envelope polygons overshot their true area by up to 14.5-14.6% on parcels along outside street curves, for roughly three weeks before being found
- **root cause:** a ring-cap geometry bug specifically at reflex (non-convex) vertices; the original working hypothesis (a convex-vertex cause) was tested and corrected to the real, reflex-vertex mechanism within the same investigating session, before any lane acted on the wrong premise
- **how found:** direct geometry investigation, with the wrong premise caught and corrected before being acted on
- **fix status:** deployed -- fixed and verified on real parcels, with a straight-frontage control returning byte-identical output before and after (proving the fix is scoped correctly)
- **recurrence control:** the straight-frontage control test
- **cost:** roughly three weeks of a customer-facing buildable-area figure overstated by up to 14.6%, on a real named parcel
- **sources:** 90_operations/OPS-16_texas_market_plan_of_record.md (A-080 range)

## NEW: halted-treated-as-landed on resume (1 instance)

### BLK-250 -- 2026-08-09 -- 48457 (one county in a resume set)
- **stage:** acquire (sweep resume)
- **symptom:** a resume script built its skip set as landed UNION halted; a county that was halted but had never actually landed would have been silently skipped entirely on resume -- the same class as the Harris multi-shapefile truncation, undetectable by any count-based gate
- **root cause:** a halted state was treated as equivalent to a completed state for resume purposes
- **how found:** the planner reviewing resume logic BEFORE running it, not after
- **fix status:** deployed -- fixed same session, verified live -- the county landed 23,594 atoms after the fix
- **recurrence control:** none generalized to other resume logic
- **cost:** n/a -- caught before it caused a real skip
- **sources:** _sessions/2026-08-09_sweep_resume_and_own_rrc_gap_claude_code.md

## NEW: marketed-ahead-of-build (2 instances)

### BLK-234 -- 2026-08-01 -- n/a (SmartCity product)
- **stage:** reports (marketed ahead of build)
- **symptom:** 21 named report types have a download handler that emits a fixed text template rather than generating anything; the product's own user guide documents illustrative KPI tables while claiming a PDF download the code doesn't produce
- **root cause:** a product surface was marketed before its generator was built
- **how found:** code-level sweep
- **fix status:** unfixed -- disposition owed, no work done at finding
- **recurrence control:** none
- **cost:** n/a
- **sources:** _sessions/2026-08-01_smartcity_category_masters_and_positioning_claude_code.md

### BLK-235 -- 2026-08-01 -- n/a
- **stage:** reports (spec vs shipped)
- **symptom:** a spec'd parcel-briefing document is not what shipped -- the live report is materially thinner than its own spec, missing flood/drainage/soils/habitat reasoning the spec describes; a separately marketed product (GovTitle) was never built at all
- **root cause:** a spec and its implementation diverged with no reconciliation step
- **how found:** same sweep
- **fix status:** GovTitle retired same session; the report-thinness gap left open -- n/a
- **recurrence control:** none
- **cost:** n/a
- **sources:** _sessions/2026-08-01_smartcity_category_masters_and_positioning_claude_code.md

## NEW: nondeterministic id minting breaks replay/idempotency (1 instance)

### BLK-326 -- 2026-09-07 -- Caldwell
- **stage:** rail-fill
- **symptom:** replaying the same landed source bytes produced non-identical atom hashes, violating the program's own replay/idempotency requirement
- **root cause:** tier-3 nodes were minted with a random id generator, and the replay ran against a warm reconcile store a prior pass had already populated
- **how found:** a direct replay-diff test
- **fix status:** deployed -- fixed via a deterministic mint keyed on an alias, cold replay hydration, and a per-chunk fingerprint
- **recurrence control:** 4 new tests asserting replay determinism
- **cost:** n/a
- **sources:** 90_operations/OPS-16_texas_market_plan_of_record.md (A-080 range); 90_operations/OPS-19_factory_plan_of_record.md

## NEW: premature-scale rollout risk, caught by staged gating before full deployment (1 instance)

### BLK-347 -- 2026-08-27 -- statewide
- **stage:** control
- **symptom:** a first full-loop dry run across ten counties found four of ten (25%) failing a checkpoint on their very first execution
- **root cause:** an at-scale rollout had never been tested at a smaller scale first
- **how found:** the staged checkpoint itself, run deliberately before the full loop
- **fix status:** deployed (the full loop was blocked pending five explicit criteria being met) -- n/a
- **recurrence control:** the staged-gate discipline itself, which the finding validates as necessary
- **cost:** averted a projected 25x multiplication of the same defect class had the full loop run unchecked
- **sources:** 90_operations/OPS-19_factory_plan_of_record.md

## NEW: sample-construction artifact misread as a code bug (1 instance)

### BLK-246 -- 2026-08-04 -- Comal,Bell
- **stage:** acquire (sample selection)
- **symptom:** a deterministic lexicographic-first sample landed on degenerate placeholder prop_ids in Comal; a separate sample of Bell parcels legitimately carried city zoning stamps and correctly failed an 'unzoned' grade -- both were initially misread as engine bugs before being traced to sample construction
- **root cause:** a naive deterministic sampling method picked unrepresentative or edge-case rows
- **how found:** investigation of an apparent regression that turned out to be a sampling artifact
- **fix status:** deployed -- fixed (#247): filters non-positive prop segments and excludes city-districted parcels from unzoned sampling
- **recurrence control:** the improved sampling filters
- **cost:** n/a
- **sources:** _sessions/2026-08-04_wave1_wave2_county_fan_claude_code.md

## NEW: scraper double-count (1 instance)

### BLK-248 -- 2026-08-04 -- n/a (eCode360 scraper, cross-county)
- **stage:** acquisition
- **symptom:** two independent duplication bugs while diagnosing scraper over-counts: container pages self-enumerating their own children, and sibling pages re-rendering a full division marker set a second time
- **root cause:** two separate traversal bugs in the same scraper
- **how found:** diagnosis of an over-count
- **fix status:** deployed -- fixed (#237), 259 duplicates dropped with every label named in the log
- **recurrence control:** none generalized to other scrapers
- **cost:** n/a
- **sources:** _sessions/2026-08-04_scale_ops_continuation_smithville_proven_claude_code.md

## NEW: secret compiled into a public client bundle (1 instance)

### BLK-331 -- 2026-08-26/09-08 -- n/a
- **stage:** control
- **symptom:** a credential was compiled directly into the public Factory console's client-side JS bundle; the bound URL answered 200 unauthenticated, and the same exposed key granted access to mutation-capable endpoints
- **root cause:** a build-time environment variable was baked into a client bundle instead of being read server-side only
- **how found:** a bundle read
- **fix status:** deployed -- key rotated, a server-side proxy built, the endpoint returns an honest 401 pending real sign-in
- **recurrence control:** the proxy, plus an access allow-list (later ruled off entirely by a separate decision)
- **cost:** a live, unauthenticated, mutation-capable credential exposed in a public bundle for an unmeasured period before found
- **sources:** 90_operations/OPS-16_texas_market_plan_of_record.md (A-080 range); 90_operations/OPS-19_factory_plan_of_record.md

## NEW: silent truncation with no warning to the caller (1 instance)

### BLK-287 -- 2026-09-15 -- n/a (MCP report composer)
- **stage:** publish
- **symptom:** data that was one hop away in an existing reader was reported missing because the composer never wired that reader in; separately, and unrelated in cause, documents silently truncated at a 16-section cap with zero warning to the caller
- **root cause:** a report composer never called an existing, working reader; a hardcoded truncation cap had no logging path
- **how found:** decoding the live PDF's actual bytes, not reading code or tool output alone
- **fix status:** deployed -- fixed, deployed to cortex-api-00807-wib
- **recurrence control:** none confirmed against a future re-introduction of a silent cap elsewhere
- **cost:** n/a
- **sources:** _sessions/2026-09-15e_qa_reconciliation_and_async_cutover_claude_code.md

## NEW: stale client state after a server rollback masquerading as a server regression (1 instance)

### BLK-291 -- 2026-09-15 -- cross-county (property-explorer map)
- **stage:** publish
- **symptom:** the buildable envelope stopped drawing on all parcels; a rollback was believed not to have restored it; the first hypothesis (an overbroad envelope-suppression change) was tested and REFUTED (only 4 of 7 test parcels moved, not all); the actual cause was that the operator's own browser tab never reloaded after the rollback, so the client and server were version-mismatched while every server-side instrument (Cloud Run revisions, audit mutations, secrets) read completely healthy throughout
- **root cause:** a stale client tab after a legitimate server-side rollback, misread as a server regression because every server-side signal was clean
- **how found:** an infra audit showing zero server-side mutations during the outage window, combined with the operator confirming the fix on a page reload
- **fix status:** resolved via reload; the wrong initial fix (a real rollback) cost real time and collateral damage to an unrelated in-flight fix -- n/a
- **recurrence control:** a process rule ('check the pre-registered falsifier before merging, not only CI') plus the asset-existence instrument (BLK-289's fix) replacing a previously-unreliable Age: header check
- **cost:** roughly 45 minutes of outage, one unnecessary rollback, one unrelated fix (P-218) lost as collateral damage, and four false claims recorded into the plan of record before being corrected
- **sources:** _sessions/2026-09-15b_deploy_rollback_and_p219_claude_code.md; _sessions/2026-09-15c_envelope_outage_diagnosis_claude_code.md; _sessions/2026-09-15d_reports_envelope_arc_claude_code.md

## NEW: stray deploy-config in a non-deployable repo (1 instance)

### BLK-274 -- 2026-08-14 -- n/a (doc_repo)
- **stage:** n/a (deploy config)
- **symptom:** a root Vercel-link file in doc_repo (a private, non-product repo) would have published the ENTIRE private repository if ever deployed from that link
- **root cause:** a stray Vercel project link left in a repo that was never meant to be deployable
- **how found:** a governance audit
- **fix status:** deployed (fixed) -- closed same session
- **recurrence control:** none generalized to prevent recurrence in other repos
- **cost:** n/a -- a near-miss, not an incident
- **sources:** _sessions/2026-08-14_govtech_program_standup_claude_code.md

## NEW: unbounded-memory-per-county write path (1 instance)

### BLK-325 -- 2026-09-07 -- Bexar, Collin
- **stage:** rail-fill
- **symptom:** large-county writer jobs crashed mid-write (signal-terminated) even at 16Gi RAM
- **root cause:** a whole county was held in memory at once instead of being processed in chunks; raising the RAM ceiling alone did not fix it
- **how found:** job termination logs
- **fix status:** deployed -- fixed via 50,000-row chunking
- **recurrence control:** a chunk-level run_event plus peak-memory recorded per chunk
- **cost:** n/a
- **sources:** 90_operations/OPS-16_texas_market_plan_of_record.md (A-080 range); 90_operations/OPS-19_factory_plan_of_record.md

## NEW: wrapper/consumer built independently with no reconciliation audit (1 instance)

### BLK-334 -- 2026-09-11 -- 5 counties
- **stage:** gate
- **symptom:** an inverse-pairing defect: 4 of 5 built serve wrappers for a setback rail had NO consumer anywhere, while the one rail that DID have a consumer had NO wrapper
- **root cause:** the wrapper side and the consumer side were built independently and never audited together before slating
- **how found:** a wrapper-consumption audit performed before slating, not after
- **fix status:** deployed -- all five wrappers built together this pass
- **recurrence control:** a fail-closed default to the legacy read path for any unslated pair
- **cost:** n/a
- **sources:** 90_operations/OPS-16_texas_market_plan_of_record.md (A-080 range)

## NEW: writer-lease expiry during an unheartbeated plan phase (1 instance)

### BLK-275 -- event 2026-08-14; reported 2026-09-13 -- Harris
- **stage:** instantiate
- **symptom:** first parcel-node apply wrote 0 of 1,523,640 atoms
- **root cause:** the writer lease expired mid-plan during a 58-minute plan phase with no heartbeat to catch it
- **how found:** audit
- **fix status:** deployed -- retried with a 4-hour TTL, landed all atoms, 99.9999% geometry rescore
- **recurrence control:** the 4-hour TTL only; no heartbeat was added
- **cost:** n/a
- **sources:** _sessions/2026-09-13_scale_source_inventory_and_prebake_claude_code.md
