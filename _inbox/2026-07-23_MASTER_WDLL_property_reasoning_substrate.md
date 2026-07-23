---
id: 2026-07-23_MASTER_WDLL_property_reasoning_substrate
title: MASTER WDLL — Property Reasoning Substrate (the north star)
status: draft
date: 2026-07-23
applies_to: hauska-engine (spine), hauska-atom-contract, hauska-mcp-server (the gate), hauska-sdk (money), legacy-design-tools (cortex-api reporting + current bake), hauska-map, property-explorer
supersedes_as_northstar: [2026-07-23_atom_family_WDLL, 2026-07-23_engine_family_WDLL]
rolls_up_to: 75j_property_explorer_destination_ledger
related: [2026-07-23_atoms_first_central_tx_execution_plan, 2026-07-23_reasoning_chain_atom_shape_design, 2026-07-23_property_node_atom_fabric_and_engine_diagram, 56_engine_extraction_sprint, 80_adrs/adr_008_engine_factor_out, 80_adrs/adr_018_atom_contract_substrate_layer, _architecture_homes/01_homes_and_topology, 04a_arrow_two_calibration_capture]
owner: nick
---

# MASTER WDLL — Property Reasoning Substrate

The single north star for the property-atom program. The atom-family WDLL and engine-family WDLL are its Phase-1 and Phase-2 acceptance annexes; the 75j destination ledger is the customer-facing scoreboard it rolls up to. Written after an 8-agent review fan audited every load-bearing premise against live code (2026-07-23); the corrections that fan surfaced are baked in and noted where they changed the shape.

Operator approval: PENDING. Frozen at approval; changes recorded as amendments.

## 0. THE ONE DONE-LINE

A Central-TX parcel's buildable answer is a persisted, cited, three-axis-calibrated atom chain — zoning-FACT -> setback-RULE (cited to a code atom) -> buildable-envelope-DERIVED — authored jurisdiction-agnostically in the SPINE (hauska-engine / hauska-atom-contract), with the bespoke cortex path retired, served identically to the map, a report, and an external MCP agent under accessPolicy, monetized through hauska-sdk, honest-absent where data does not exist, and calibrating against real outcomes — such that the exact same code, given another county's descriptor, is the seed of the national jurisdiction factory.

## 0b. THE NEGATIVE DONE-LINE (a fleet cannot rationalize past these)

It is NOT done if ANY of these is true at program close:
- a second buildable-envelope confidence path survives (the `labeling x district` multiply, or a Tier-1/Tier-2 bake still computing the old way);
- a jurisdiction literal (a TX/county/FIPS name or constant) appears in the reasoning code path (as opposed to a descriptor/adapter/provenance field);
- a paid-atom read is metered or charged anywhere but hauska-sdk (a Stripe or bespoke charge in the gate/cortex/map);
- an atom derived from a licensed source (ICC, a code partner, a parcel provider) is referenced without accruing to that source's meter — free-tier references included (unmetered source liability);
- an atom value change overwrites in place instead of versioning + retiring the prior (signed history);
- a served value (map, report, or MCP) is missing any of {source attribution, confidence, timestamp/vintage};
- a derived atom's confidence is a stuffed/fake value to pass conformance (e.g. a life-safety `consequence` axis populated with a meaningless number);
- honest-absence is faked by a null, or masked so a silently-broken source reads as "no answer."

## 1. CROSS-CUTTING INVARIANTS (stated once; every phase item is graded against these)

- I-A Single path / anti-zombie: the atom path REPLACES the bespoke path; no permanent fork. (Transitional flag-gated dual-serve during a live cutover is allowed and must be gone by close — see I-J.)
- I-B Jurisdiction-agnostic: zero geo-branching in the reasoning; jurisdiction enters ONLY via descriptor / adapter / provenance. Enforced by an executable non-TX golden-descriptor CI test, not a human reviewer.
- I-C Quality gate: every served output carries source attribution + confidence + timestamp/vintage (CLAUDE.md quality-gate rule), checked on a served report AND a served MCP response, not just per-atom.
- I-D Honest-absence: absence is a first-class atom value, never a null or an invention; the absence RATE per facet is monitored so a silently-404'd source raises a flag instead of reading as "no answer."
- I-E Calibrated-vs-asserted: confidence is the contract's three-axis read; the calibrated axis resolves at READ through the existing calibration overlay (migration 0037), never composed-and-frozen; the earning loop is live (commitment #2), fuelled by Texas public-record permit outcomes.
- I-F SDK money boundary: paid atoms monetize through hauska-sdk ONLY (Circle/USDC + settlement + RevenueRouter split + VDA per ADR-018); free/anonymous atoms never load the SDK. NOTE: this invariant is VIOLATED in live code today (the gate meters via Stripe) — restoring it is Phase-1 work, not an assumption.
- I-G Retire-not-overwrite: an atom whose source value changes produces a NEW version and retires the prior via status flip + signed history; the superseded atom stays retrievable (it IS the calibration record).
- I-H Cost gate: onboarding cost (compute $ + human-review minutes) per jurisdiction is recorded to the ledger; under $200 compute + 1hr human (commitment #3; hard-kill at three counties if unachievable).
- I-I Verification never delegated: every grade is against LIVE state (deployed revision, live npm version, real gate verdict, real owner-match), pasted verbatim — never a sub-agent report, a workflow-green, or a bake summary.
- I-J Live-serving continuity: no merge drops the live product's read to a not-yet-serving path. property-explorer serves users off the cortex envelope path across two prod projects; a cutover is flag-gated dual-serve, proven on live parcels, then the old path retires.
- I-K Source-obligation (money OUT): every atom derived from a licensed source (ICC I-Codes, a code partner, a parcel provider) carries a source-actor reference + licensing terms, and EVERY reference of it — free tier included — accrues to that source's inbound meter at the gate read path; a paid sale additionally routes the source's cut via RevenueRouter. A source-attributed atom that is referenced without accruing to its source is unmetered liability = a FAIL. (This is the ICC gap; see 25b for the stack. Distinct from I-F, which is money IN.)

## 2. PHASE 0 — HARD GATE (home + contract + collision, before any build)

A read-only audit that produces a decision doc and rules the home. NO build code before it. Grading is escalated to the operator (not planner-self-approved) if the "spine ready" threshold below fails.

- 2.1 Spine-ready threshold (objective). | check: hauska-engine has a live atom WRITE path + retrieval READ for at least one existing atom family (the document-ingest lineage qualifies), AND the cross-project gate->spine auth is proven with a real call. If any is absent, the program is really "build the spine atom substrate THEN atomize" — escalate to operator, do not self-approve. | grade: [ ]
- 2.2 Contract-shape gate (not just version). | check: the audit states whether the live contract (1.7.0) expresses a derived-atom reasoning chain (input-atom refs + composed confidence) or whether that is a NET-NEW contract primitive. Fan verdict: it is net-new (`composition` is a render edge, not a reasoning edge; `consequence` axis is life-safety-shaped). So this gate names the contract-extension as Phase 0.5. | grade: [ ]
- 2.3 Home ruling. | check: the doc rules {spine home confirmed + write path named} — the forbidden outcome "author deep in cortex-api and migrate later" is named and excluded; branch (c) staged-bake must name the exact repo/file and prove it is NOT `artifacts/api-server`. | grade: [ ]
- 2.4 Live-PE-sprint collision reconciled. | check: this program and the in-flight property-explorer v1 sprint both touch `buildableEnvelope/`, the setback tables, and Overpass. ONE owner of `buildableEnvelope/` is named; Overpass remount has exactly ONE owner (not both plans); the I-2-honesty fix is done ONCE (in-place shim OR folded into the atom refactor, not both). | grade: [ ]

## 2.5. PHASE 0.5 — CONTRACT EXTENSION (net-new primitive, before Phase 1)

- 2.5.1 Reasoning-chain primitive published. | check: a minor bump to `@empressaio/atom-contract` adds the derived-atom reasoning-chain shape (input-atom-ref + composed-confidence), authored on the contract's OWN shipped idiom (the `production-timeseries` `derivesFromDid` + `derivationMethod` + widthed-confidence pattern — adopt, do not invent); backward-compatible with 1.7.0 consumers (og/encumbrances/temporal unaffected); `/conformance` fixtures added; published via tag-push CI. | grade: [ ]
- 2.5.2 Consequence axis ruled for non-life-safety atoms. | check: the envelope/property atom family either makes `consequence` optional or maps it to an honest property-risk stratum — NEVER a stuffed scalar to pass conformance (I-C / negative-done-line). | grade: [ ]
- 2.5.3 Provenance + tier decomposed to real fields. | check: the plan's `{source, vintage, verificationState}` maps onto the real contract fields (`sourceCitation` + `extractedAt`/`asOf` + `WidthedConfidence.provenance` + `modelAttribution` for LLM-authored steps); `AtomTier` (data|app) is chosen per kind so conformance applies signed-history only where required. | grade: [ ]
- 2.5.4 Source-obligation metadata + TWO meters, ICC as the TEST ACCOUNT. | I-K | check: (a) a source-actor is modeled as an actor atom (ADR-015) carrying licensing terms (per-reference rate and/or rev-share) — ICC's actor atom is the worked example and the test account for the demo; (b) the setback->code atoms reference ICC's actor atom as their source; (c) an INBOUND meter at the gate read path accrues a royalty on EVERY reference of an ICC-sourced atom, FREE tier included (not only on sale) — this is the gap a sale-only meter misses; (d) the OUTBOUND `RevenueRouter` split routes ICC's cut on a paid sale. If revenue-routing is sequenced as pending, the split degrades honestly (not silently) — but the INBOUND meter is NOT deferrable if ICC-cited codes are served at volume (unmetered liability, I-K). See 25b_monetization_provenance_storage_stack for the authoritative stack. | grade: [ ]

## 3. PHASE 1 — THE ATOM FABRIC, FULL CHAIN (Central-TX by hand)   -> annex: 2026-07-23_atom_family_WDLL

Operator ruled full-chain: build the deferred Postgres StoragePort up front so the derived envelope (the wedge visual) atomizes in the first wave. Each item is tagged with the invariants it must satisfy. Finish-line: Central-TX serves the fact/rule/derived chain, gate-verified, no fabrication, live-continuous.

- 3.1 StoragePort landed (the deferred lift). | I-A | check: the Postgres StoragePort for the linked atom graph exists in hauska-engine (`pg-storage.ts` + an `atoms`/`atom_links` migration) — the fan found `pg-storage.ts` is a 404 today and the link-graph needs it; this is the up-front lift the full-chain choice buys. Durable write + traverse proven on one atom. | grade: [ ]
- 3.2 Atom kinds on the contract. | I-C,I-E,I-G | check: fact/rule/derived kinds authored against the extended contract; a fixed named fixture set (>=1 real Central-TX parcel per kind, parcel-ids in the grade note) passes `/conformance` carrying accessPolicy + three-axis confidence + decomposed provenance + input-atom-ref chain (derived). | grade: [ ]
- 3.3 Zoning FACT atom. | I-D | check: named Central-TX parcel returns a zoning fact atom (district + provenance + confidence); a NAMED Bexar null-zoning parcel returns honest-absence, NOT a stamped I-2 (fixes the in-flight agent's fallback invent). | grade: [ ]
- 3.4 Setback RULE atom, cited, CONSUMING existing provenance. | I-C,I-E | check: the setback atom carries the rule + a citation resolving to a real code section+edition; it CONSUMES the `atom_did` + per-field confidence already in the setback JSON (fan gift — `derive.ts` discards these today) rather than inventing new tiers; exact-match -> asserted-high, prefix -> asserted-medium with the prefix as cited match-basis, fallback -> asserted-low + honest-absence (dissolves the Kyle-R1-T / SA-C-3NA matcher problem by grading not tightening). Named parcels per case. | grade: [ ]
- 3.5 Setback rule CITES a code atom (typed ref, not a string). | check: source-of-rule is a typed atom-reference dereferencing to a real code atom OR an honest "code-atom pending" placeholder of the correct kind; a bare string is a FAIL. Unifies setbacks + ICC. | grade: [ ]
- 3.6 Buildable-envelope DERIVED atom. | I-D,I-E | check: inputs are refs to the fact + rule atoms (+ geometry + front-edge referenced fields); confidence is composed via the contract's calibrated+asserted axes (consequence per 2.5.2), demonstrated by changing an input atom's confidence and observing the derived confidence change; `labeling.confidence * district.confidence` appears nowhere (grep-clean). Named honest-absence probes: no-buildable-area parcel, provisional-front-edge parcel. | grade: [ ]
- 3.7 Bespoke path retired across ALL THREE orchestrators. | I-A,I-J | check: at program close, grep confirms the `labeling x district` multiply and `Tier1FacetPayload` are gone from the live path; the API route AND the Tier-1 bake AND the Tier-2 bake all read atoms (the fan found 3 orchestrators — swapping only the route forks the PMTiles tiles invisibly); the absence vocabulary is unified (the bake `declined`/`confidence:0` sentinels and the route HTTP decline ladder speak one dialect). Transitional dual-serve permitted during cutover, gone by close. | grade: [ ]
- 3.8 Jurisdiction-agnostic (EXECUTED, not imagined). | I-B | check: grep for `texas|central.?tx|\bTX\b|bexar|hays|comal|travis|williamson|<FIPS constants>` in the reasoning modules returns zero hits outside descriptor/adapter/provenance; a committed non-TX descriptor stub runs the SAME code to a conformant-atom-or-honest-decline with zero code change. Graded as a gate on 3.3/3.4/3.6, not a late standalone. | grade: [ ]
- 3.9 Referenced fields stay referenced. | I-D | check: geometry/topo/road are cited-by-reference inputs, not atomized; the front-edge input is asserted-provisional (shape-tier) and the schema is inspected to confirm calibrated-road is the SAME field's value (upgrades without a schema change when Overpass remounts). | grade: [ ]
- 3.10 Calibration wired to the overlay. | I-E | check: the derived atom's calibrated axis resolves at read through migration-0037's `atom_calibration_overlay` keyed on the parcel node; a Texas public-record permit-outcome adapter writes outcome events for at least the two public-free jurisdictions and a backtest populates `provenance: backtest` on at least one atom. (Seed of the earning loop; partial-with-reason acceptable if the adapter slips, but the read-through-overlay path must exist.) | grade: [ ]
- 3.11 SDK money boundary RESTORED. | I-F | check: the gate's `read-attribution.ts` paid-read hook calls `McpMeteringGate.authorizeCall` (`@hauska-sdk/metering`) at authorize-time; the Stripe meter path (`src/metering.ts` post-to-api.stripe.com) is retired; a public-free read is traced and confirmed NOT to load the SDK; a CI conformance test fails if `@hauska-sdk/*` deps or the import disappear. (Fixes the live invariant violation the fan found.) | grade: [ ]
- 3.12 Central-TX re-baked + gate-verified. | I-D,I-H | check: the coverage ledger reports atom-family emission per county with baked-% per kind above a NAMED threshold; every promoted value passed its gate; a spot audit of N named parcels finds zero fabrication (owner-match re-run pasted); re-bake compute cost per county recorded (I-H). | grade: [ ]
- 3.13 Served + read by all three consumers, SAME atom ids. | I-A,I-C,I-F | check via three sub-boxes: (a) an external MCP call (X-Hauska-Key) through the CATALOG-TOOL path returns the atom chain — public-free district resolves anonymously, public-paid envelope gated via per-atom accessPolicy filtering (NOT the package/tier path, which forwards a tier and never reads the atom's policy); accessPolicy set EXPLICITLY on the family so a jurisdiction-tagged atom doesn't silently default to tenant-private; (b) the map inspect card renders the human cited chain generated from the same atom fields; (c) a report composes from the same atom ids — proven IDENTICAL across all three, registered via `/admin/introspection/tools`. | grade: [ ]

## 4. PHASE 2 — THE JURISDICTION FACTORY (generalize)   -> annex: 2026-07-23_engine_family_WDLL

Sequenced AFTER Phase 1 finishes (Phase-2 items are ungradeable until the Phase-1 finish-line passes). The six engines harden + generalize the embryos Phase 1 builds (the setback gate, the owner-match gate, the coverage ledger). Full acceptance in the annex; the finish-line: a never-hand-touched county comes up correct-or-declined from a descriptor alone, under the cost gate (I-H), with failure/rollback + idempotency proven and the anti-zombie CI test green.

## 5. THE OUTCOME LEDGER (customer-facing scoreboard)   -> 75j_property_explorer_destination_ledger

Every Phase-1/Phase-2 acceptance item maps to the 75j row(s) it advances (e.g. 3.13 -> rows 2,7,10,16; 3.10/3.11 -> rows 7,8,13). No ledger % advances except on a live-verified item (I-I). One honesty discipline, one place — the moat rows (2,7,8) get the tightest read.

## 6. GRADING PROTOCOL

- Every item: PASS / PARTIAL(criteria) / FAIL — never a bare checkbox; multi-part items grade each sub-check.
- Every grade cites the invariants checked + pastes the live evidence (I-I).
- Phase ordering is a lock: 0 -> 0.5 -> 1 -> 2. Phase-2 items cannot be graded before the Phase-1 finish-line.
- Verification is tiered (so "verify live" is mechanized, not a bottleneck): cheap continuous checks every merge (grep for surviving path, `/conformance` on a sample, one live parcel probe, npm version, the anti-zombie golden-descriptor test) vs expensive gate checks at phase boundaries (full owner-match re-run, coverage-ledger diff, cross-project gate call). Wire each item to the factory gate (E1 source-verified / E2 citation-resolves / E3 owner-match / E4 conformance) that proves it.

## 7. THE BUILD ORCHESTRATION MODEL

Planner-led fleet (operator-ruled 2026-07-23). The receiving agent is a PLANNER: owns the plan, dispatch, adversarial review of every deliverable, the merge decision, and verification. Sub-agents execute scoped tasks, each citing the acceptance item(s) it satisfies. The planner CAN spawn sub-planners for a plan-shaped sub-domain (one level only — a sub-planner does not fan its own sub-planners; the nested-fan orphan trap). Verification is NEVER delegated (I-I). Adversarial review replaces any scorecard: every plan and deliverable is attacked (find the fabrication, the zombie fork, the jurisdiction leak, the SDK bypass, the stranded live-read) before merge. Merge on green CI only. The anti-zombie checks (I-A, I-B, I-F, I-J) are CI gates, not one-time reviews, so a later PR cannot re-introduce a deleted path.

## 8. AMENDMENTS

(none yet)
