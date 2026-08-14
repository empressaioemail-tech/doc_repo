---
id: OPS-17_govtech_stack_plan_of_record
title: "OPS-17 — the govtech stack: plan of record"
status: active
last_updated: 2026-08-14
applies_to: portfolio
owner: nick
related: [OPS-16_texas_market_plan_of_record, 90_runbooks/AGENT_CONTRACT, _smartcity_masters/00_README, 65_sensors/sensor_program_overview, 65_sensors/convergence_smart_site_live_layer, 80_adrs/adr_023_cortex_reporting_repo_designation, 48_cortex_reporting_plan_review_spec, 75n_icc_code_connect_catalog, _inbox/2026-08-14_spine_unification_handoff]
---

# OPS-17 — the govtech stack: plan of record

## Why this document exists

Four lanes (Smart Files, SmartCity/Bastrop, Plan Review, ICC) are about to be built by four hand-carried lane planners. They share a spine, an auth leg, an atom contract, and a customer. Without a frozen baseline with stable row IDs, they will drift into four private definitions of done and meet at integration.

This repo has a measured base rate: prose-shaped controls run 0-for-3, structure-shaped controls run 1-for-1. This document is the structure-shaped answer, copied in shape from OPS-16, which proved it on the Smart Site program. The spine unification handoff states the cost of adopting it late: Smart Site adopted this machinery four days in and spent those four days paying for its absence. This program adopts it at hour zero.

**Definition of done for the program.** All four lanes complete through Layer 5, the govtech stack built and tested, the spine healthy, and each surface consuming and depositing into the others per the seam table below. Every row graded by its named instrument. A row graded by narration or doc assertion fails.

## Governing rules

These are the OPS-16 rules, which govern here unchanged except where noted. `90_runbooks/AGENT_CONTRACT.md` is the operative law for lane behavior and is not restated here.

1. **The baseline table never gets edited.** Every scope change is a dated row in the AMENDMENTS table. What we believed on 2026-08-14 stays visible forever.
2. **No dispatch without a row.** Every dispatch names `PLAN-ROW: G-xx`. Row IDs carry a `G-` prefix so they never collide with the OPS-16 `P-` rows in a grep, a hook, or a compiler.
3. **Statuses re-grade only by instrument** (SQL, gh, live probe, script). The GRADE LOG records each pass.
4. **Lane-planner fan model** per AGENT_CONTRACT section 1. Four lane planners, hand-carried. Verification never delegated below the lane planner.
5. **Write-slot law** per AGENT_CONTRACT section 3. This program shares the atoms store with any other running program; only `--apply` queues, everything else is parallel.
6. **Shared-leg rows block across lanes.** A row in the SHARED LEGS table is not owned by one lane. No lane may build past a shared leg it depends on by stubbing it privately.

## The structure: four lanes by five layers

The five layers are the proven OPS-16 ladder, generalized. They are ordered by what-blocks-what, not by subject:

**L1 Foundation** — what must exist for anything else to be true.
**L2 Measurement** — does it actually cover what we claim, counted by instrument.
**L3 Integrity** — is it honest where it does not cover, and is access enforced.
**L4 Depth** — jurisdiction- and customer-specific richness.
**L5 Launch** — the commercial surface: priced, sellable, demonstrable.

The four lanes are subjects, each passing through all five layers:

| Lane | Subject | Twin relationship | Primary repo |
|---|---|---|---|
| **A** | Smart Files | the twin DOCUMENTS (workspace atom family) | TBD by G-03 audit |
| **B** | SmartCity / Bastrop | a PORTFOLIO of twins including infrastructure | smartcity-os |
| **C** | Plan Review | the twin ADJUDICATIONS (the earning loop) | legacy-design-tools (cortex-reporting, ADR-023) |
| **D** | ICC | a licensed SOURCE metered across every twin citing it | hauska-engine |

## The twin, stated once

Ratified by the operator 2026-08-14 and consistent with `65_sensors/sensor_program_overview.md`:

**A twin is a node. A node is an ID full of atom facts. The ID can be a human, a building, a desk.** What this company specializes in is creating twins of things with provenance and access control. That is the essence; everything in this program is a form of it.

Degrees of aliveness (ratified 2026-08-06): a COLD twin has the record; a WARM twin has it verified with provenance on every fact; a LIVE twin has senses streaming current state. The three verbs are CAPTURE, CONNECT, SENSE, in that order, as a cost discipline: hardware is the last resort.

**Sensors are Asset Management Tier 2, not a separate program.** The `_smartcity_masters/32_smartcity_asset_management.md` tiers (record, live state, view) and the sensor program cold/warm/live ladder are the same architecture at two altitudes. The sensor band adds the WATCH plane (a standing rule on a live twin: baseline plus condition plus roster) and the hardware doctrine.

**The two-altitude vocabulary rule is binding on every artifact this program produces.** Internally: twin, node, atom, graph. Externally to a city: the record, the asset, current state. Never say digital twin to a city. The Asset Management master carries the full never-say list; the Smart Files master carries the foundation one-sentence rule and its own never-say list. A claim not in the approved-claims register of a master is not approved.

## Inherited spine constraints (compile-time requirements, not advice)

From `_inbox/2026-08-14_spine_unification_handoff.md`. Every lane inherits these; no lane re-derives them. A lane deliverable that violates one is rejected at checkpoint, not at launch.

1. **Absence is typed and provenanced.** The seven-status taxonomy exists because one undifferentiated absent carried at least seven meanings. Plan Review and ICC face the identical class: code section not found must never conflate never-looked, source-down, paywalled, and genuinely-absent.
2. **Only a positive determination writes an absence.** An empty result re-enters the queue. This one rule killed an entire defect class.
3. **satisfied-absent is a first-class product state.** A surface that cannot render verified-absent misrepresents the substrate.
4. **Freshness is part of every response.** Visible computedAt and servedAt stamps, and a STALE indicator proven able to fire before it is trusted. This binds hardest on Smart Files: it is an artifact store, and a cache without a stamp is a liar waiting for load.
5. **Vintages are declared, never mixed; fallbacks are named, counted, and marked on every fallback read.** Plan Review hits this with code editions (the Bastrop B3-repealed-to-BDC incident is the same disease); ICC citations carry edition identity for the same reason.
6. **EntityId shapes are NOT uniform across families, by design.** Never reconstruct an identity from parts; use the value storage persists. A wrong reconstruction silently matches zero rows and looks like an honest absence.
7. **County-level and portfolio-level determinations are a legitimate node class.** Any surface that aggregates must know the marker convention exists.
8. **Ingestion is a Factory 1.5 workload.** Smart Files ingest and plan-review corpus intake reuse the staging pattern; they do not invent parallel machinery.
9. **Instruments are build items.** Gates are scripts. A gating indicator is tested for its ability to fire before it is trusted. Every ratio travels with its counting rule.

## SHARED LEGS — cross-lane blocking dependencies

Not owned by any single lane. A lane that needs one may not stub it privately.

| ID | Leg | Why it is shared | Blocks |
|---|---|---|---|
| S-1 | **Auth and tenancy** (sprint-54 leg) | The claim flow is the single most load-bearing dependency in the convergence (65_sensors convergence doc). Tenant isolation is not enforced today; Cortex runs an anonymous default tenant. | B (Bastrop private layer), A (per-tenant artifacts), C (reviewer identity), the claim flow |
| S-2 | **Telemetry plane placement** | Open item 1 in the sensor overview: named, not decided. Needs the ADR-008 and 56 target-topology check before it hardens. | B Tier 2 (live state), any watch work |
| S-3 | **Smart Site mapping adoption** | Operator-named. The Smart Site mapping system is the proven one; SmartCity adopts it and Bastrop mapping comes up to that standard. | B, C (E6 map compose) |
| S-4 | **ICC content-to-actor reference** | ICC is metered across BOTH Smart Site and Plan Review. The meter currently detects ICC content by allowlist and regex heuristic, not a hard reference. Two citing surfaces, one ledger. | D, C (F6 code library), any Smart Site ICC citation |
| S-5 | **Consumer contract shape** | ADR-023 rules that SmartCity consumes plan review as a FUNCTION. Whether all three suppliers are consumed via MCP, direct atom read, or service API must be one answer, not three. | B consumes A, C, and Smart Site |
| S-6 | **Twin node-class and entityId ruling** | A twin of a human, a building, a desk, or a pump station is not the parcel-keyed shape. Constraint 6 says shapes are non-uniform by design; this program must DECLARE its shapes rather than discover them. | A, B (assets), any sensor work |

## The seam table — what consumes and deposits into what

Operator-stated 2026-08-14. This is the definition of done for all apps consuming and depositing into each other.

| Seam | Direction | Ruling and status |
|---|---|---|
| SmartCity consumes Smart Files | B from A | Documents are the twin records; SmartCity is a consumer, never a second implementation |
| SmartCity consumes Plan Review | B from C | ADR-023: consumer pass only, after the C standalone gate passes. No review logic duplicated in SmartCity |
| SmartCity consumes Smart Site | B from Smart Site | Mapping adoption (S-3) plus the public record layer beneath the city own |
| ICC paid across Smart Site AND Plan Review | D from both | Two citing surfaces, one ledger, one actor identity. Requires S-4 |
| Twins (freeze watch class) surface on Smart Site | Smart Site from B and sensors | Already ruled: the sensor program IS the live rung of the Smart Site ladder (convergence doc, 2026-08-06) |
| Bastrop infra private to Bastrop, controlled via Smart Site, blocked to public | B | Already ruled: city view equals city own sensors plus public layer; landlord data never feeds a city dashboard. Requires S-1 |
| Plan Review deposits adjudications as atoms | C to spine | The earning loop. Structural commitment 2 depends on it |

## PLAN OF RECORD v1 — baseline frozen 2026-08-14

Status legend: **LIVE** = verified at source by the doc_repo planner on the date shown. **DOC** = from an artifact, not re-verified. **OPEN** = not started. **SCOPED** = written, not dispatched.

### Layer 0 — program zero (audit and standards; blocks confident scoping of everything)

| ID | L | Work item | Serves | Pass/fail instrument | Blocked on | Status at baseline |
|----|---|-----------|--------|---------------------|------------|-------------------|
| G-01 | 0 | Doc sweep: 102 root docs are `status: active` with `last_updated` before 2026-07-01; apply the lineage rulings doc 33a already made (47, 33, 40i, 30, 11a) | all lanes | `scripts/doc-staleness.mjs` reports zero active-and-stale in the lane-relevant set; status vocabulary validator passes | none | LIVE 2026-08-14: 102 of 159 stale-active; 16 distinct status strings against 4 legal |
| G-02 | 0 | Status-vocabulary and staleness instrument built (script, then hook) | G-01 durability | Script exits non-zero on an illegal status value or a stale-active lane doc | none | OPEN |
| G-03 | 0 | Code audit: does the workspace and Smart Files substrate exist as `34_smartcity_smart_files_and_foundation.md` open-item 1 claims (substrate built; Smart Files is a rendering pass, not a build) | Lane A sizing | Live read of the workspace atom family in the contract, engine registration, and any serving path | none | OPEN — this row SIZES lane A |
| G-04 | 0 | Memory-system review: `MEMORY.md` contents audited for stale, contradicted, and superseded entries | all lanes | Every memory traced to a live artifact or retired; index matches files | none | OPEN |
| G-05 | 0 | Dev-standards refresh: Cursor rules, `.cursor/settings.json`, AGENT_CONTRACT currency, hook inventory | all lanes | Contract hash current; hooks fire on a deliberate negative test | none | OPEN |
| G-06 | 0 | Dispatch compiler made plan-aware (`--plan` selects OPS-16 or OPS-17) so both programs compile | all lanes | `node scripts/dispatch.mjs --plan OPS-17 --lane X --plan-row G-01` compiles; an invalid row fails closed | none | OPEN — blocks every dispatch in this program |

### Layer 1 — foundation

| ID | L | Work item | Serves | Pass/fail instrument | Blocked on | Status at baseline |
|----|---|-----------|--------|---------------------|------------|-------------------|
| G-10 | 1 | S-6: declare twin node classes and their entityId shapes (human, building, desk, asset, station) | S-6 | Written ruling plus contract types; no shape reconstructed from parts anywhere in lane code | G-03 | OPEN |
| G-11 | 1 | S-1: auth and tenancy leg state established and sequenced (sprint-54) | S-1 | Live probe: a tenant-private atom is refused to an anonymous caller on every surface | none | OPEN — longest pole |
| G-12 | 1 | S-2: telemetry plane placement ruled against the ADR-008 and 56 target topology | S-2 | ADR or decision record plus topology check | none | OPEN (named, not decided since 2026-08-06) |
| G-13 | 1 | S-5: consumer contract shape ruled (MCP against atom read against service API) once for all three suppliers | S-5 | Decision record; the B integration plan cites it | none | OPEN |
| G-14 | 1 | Lane A: Smart Files foundation — artifact store with provenance and freshness stamp on every artifact | A | Every served artifact carries source plus computedAt and servedAt; STALE indicator backdate-tested to prove it fires | G-03, G-10 | OPEN |
| G-15 | 1 | Lane C: cortex-reporting F1 through F7 spine wiring re-verified against live ldt (spec is 2026-07-01) | C | Per-function live probe against the `48_cortex_reporting_plan_review_spec.md` acceptance criteria | none | DOC: spec written, live state unverified |
| G-16 | 1 | Lane C: replace the Cotality APN-resolution dependency in F2 (Cotality is EXTINGUISHED) | C | F2 resolves a parcel with zero Cotality calls | address-to-parcel posture | OPEN — spec carries a dead dependency |
| G-17 | 1 | Lane D: S-4 content-to-actor reference wired (ICC atoms carry sourceActorDid plus book_id plus section_id) | D, S-4 | Meter attributes a reference by hard reference, not heuristic; purge selector resolves from the same field | none | OPEN |
| G-18 | 1 | Lane B: module decomposition seam identified — what in smartcity-os is genuinely modular against monolithic | B | Written inventory of the live codebase against the four category masters | none | OPEN |

### Layer 2 — measurement

| ID | L | Work item | Serves | Pass/fail instrument | Blocked on | Status at baseline |
|----|---|-----------|--------|---------------------|------------|-------------------|
| G-20 | 2 | Lane A: coverage of the real Bastrop document corpus counted, with counting rule | A | Count plus rule published; no bare ratio | G-14 | OPEN |
| G-21 | 2 | Lane B: which SmartCity modules actually consume the spine against mock or vendor-passthrough | B | Per-module live probe; honest inventory including UI-only surfaces | G-18 | OPEN — catalog currently oversells (payments, citizen portal UI-only) |
| G-22 | 2 | Lane C: determinations cite atom IDs and confidence objects, no bare scalars | C | F3 and F7 acceptance criteria pass on live data | G-15 | OPEN |
| G-23 | 2 | Lane D: per-reference rate set; ledger shows real accruals, not pending-rate nulls | D | Ledger query returns a non-null accrual for a live reference | G-17 | OPEN |
| G-24 | 2 | Lane B: Asset Management Tier 1 — first city-owned assets ingested into the graph | B | Store query: count of city-owned asset nodes greater than zero, with provenance | G-10, G-18 | LIVE 2026-08-10 per doc 32: ZERO city assets ingested |

### Layer 3 — integrity

| ID | L | Work item | Serves | Pass/fail instrument | Blocked on | Status at baseline |
|----|---|-----------|--------|---------------------|------------|-------------------|
| G-30 | 3 | Lane D: ICC accessPolicy stamped platform-internal at source; ingest hardcode removed | D | Store query: zero ICC atoms with public-free; anonymous list_jurisdictions omits icc-model-code | none | LIVE 2026-08-14: DEFECT PRESENT on engine main (`icc-model-code-ingest.ts:110,127`) |
| G-31 | 3 | Absence taxonomy adopted by Lane C and Lane D for code-section absence | C, D | Schema carries typed absence; a probe failure cannot render as a data gap | G-15 | OPEN |
| G-32 | 3 | Vintage and edition identity on the code corpus (Bastrop B3-to-BDC class; ICC editions) | C, D | Declared vintage per jurisdiction; fallbacks named, counted, marked on read | none | OPEN |
| G-33 | 3 | Lane B: Bastrop infra private to Bastrop, blocked to public, controlled via Smart Site | B, S-1 | Live probe: anonymous caller refused; Bastrop-authenticated caller served; landlord telemetry absent from the city view | G-11 | OPEN |
| G-34 | 3 | Lane A: typed absence plus proven STALE indicator on the artifact store | A | Backdate test fires the indicator; absence carries basis | G-14 | OPEN |

### Layer 4 — depth

| ID | L | Work item | Serves | Pass/fail instrument | Blocked on | Status at baseline |
|----|---|-----------|--------|---------------------|------------|-------------------|
| G-40 | 4 | Lane C: Bastrop UDC and adopted-code depth in the review flow | C | F6 navigable at section granularity for the Bastrop own code | G-15 | OPEN |
| G-41 | 4 | Lane D: IPMC 2018 zero-sections resolved or ruled out of scope | D | Sections ingested, or a written ruling with ICC correspondence | ICC entitlement | LIVE: 0 sections, empty body upstream |
| G-42 | 4 | Lane B: Bastrop-specific lenses per the Dashboards master (lens family by audience plus permission) | B | Per-lens live probe with permission enforcement | G-11, G-21 | OPEN |
| G-43 | 4 | Lane B: infrastructure twins (SCADA ask) — station as smart site, bearing watch as watch contract | B | Watch contract instantiated on a station node; read-only boundary enforced | G-12, G-24, G-33 | SCOPED: `_inbox/2026-08-02_bastrop_scada_infrastructure_intelligence_ask.md` |
| G-44 | 4 | Lane A: the real Bastrop documents captured (CAPTURE verb, Factory 1.5 staging) | A | Staged with provenance; drain to store; count with rule | G-14, G-20 | OPEN |
| G-45 | 4 | S-3: Smart Site mapping adopted by SmartCity; Bastrop mapping brought to standard | B, S-3 | Bastrop map renders on the Smart Site mapping system, verified in the deployed bundle | none | OPEN |

### Layer 5 — launch

| ID | L | Work item | Serves | Pass/fail instrument | Blocked on | Status at baseline |
|----|---|-----------|--------|---------------------|------------|-------------------|
| G-50 | 5 | Lane D: ICC demo run; SaaS agreement executed; atoms upgrade platform-internal to public-paid | D | Signed agreement plus accessPolicy migration verified in store | G-17, G-23, G-30 | OPEN |
| G-51 | 5 | Lane C: standalone gate — all seven functions pass with ZERO SmartCity OS session | C | The overall acceptance criteria 1 through 7 in doc 48 | G-15, G-16, G-22, G-31 | OPEN — this row unblocks the B consumer pass |
| G-52 | 5 | Lane B: consumer pass — SmartCity initiates an engagement from a MyGov permit record | B | Live: engagement created from SmartCity, review runs in cortex-reporting, no duplicated logic | G-51, G-13 | OPEN |
| G-53 | 5 | Lane A: Smart Files sellable at the set price (25,000 dollars entry) | A | Deployed surface plus collateral drawn only from the doc 34 approved claims | G-34, G-44 | OPEN — price SET 2026-08-10 |
| G-54 | 5 | Program: govtech stack tested end to end — the seam table verified seam by seam | all | Each seam row probed live and recorded | all lanes | OPEN |
| G-55 | 5 | Watch external name for the municipal buyer (GovTitle retired without a replacement) | B | Name ruled plus catalog-thesis check | none | OPEN — owed naming call |

## AMENDMENTS (append-only; never edit the baseline)

| ID | Date | Change | Reason | Ruled by |
|----|------|--------|--------|----------|
| A-000 | 2026-08-14 | Baseline v1 frozen | Program stood up with its plan of record at hour zero, per the explicit lesson in the spine unification handoff | nick |
| A-001 | 2026-08-14 | G-06 CLOSED. `scripts/dispatch.mjs` is plan-aware: `--plan OPS-16\|OPS-17`, default OPS-16 so existing usage is unchanged. Row-prefix guard added so a `P-` row compiled against OPS-17 (or the reverse) fails closed instead of silently missing the table scan. | Two programs now run concurrently against one compiler; the plan path was hardcoded | planner (mechanical, no scope change) |

## Assumptions carried (each reversible by one amendment)

1. **The rebuild named in `34_smartcity_smart_files_and_foundation.md` open-item 1 IS this program.** The operator was uncertain. If it names a different effort, amend the G-03 and G-14 scope.
2. **Smart Files is a rendering pass, not a build.** Doc 34 asserts it; G-03 tests it. If the substrate is thinner than claimed, lane A grows and that is an amendment, not a surprise.
3. **Sensors are Asset Management Tier 2, not a fifth lane.** Ruled from the doc 32 Tier 2 section plus the sensor overview; both describe telemetry identically.

## GRADE LOG (one row per grading pass; statuses re-grade by instrument only)

| Date | Pass | Rows graded | Result | Instrument notes |
|------|------|-------------|--------|------------------|
| 2026-08-14 | baseline | G-01, G-24, G-30, G-41 | recorded as LIVE at source | G-01 by frontmatter sweep; G-24 from the verified doc 32 statement; G-30 by grep on engine main; G-41 from adapter code plus commit history |
| 2026-08-14 | G-06 close | G-06 | PASS | Five-case negative test on true exit codes (not pipe exits): valid G row 0; valid P row on default plan 0; wrong-prefix row 1; unknown row 1; unknown plan 1. The gate was proven able to fire before being trusted, per inherited constraint 9. |
