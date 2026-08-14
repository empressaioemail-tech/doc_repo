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

| Lane | Subject | Twin relationship | Primary repo | Owner | Sequence |
|---|---|---|---|---|---|
| **A** | Smart Files | the twin DOCUMENTS (a city file system) | legacy-design-tools (per G-03; family placement ruled by G-10) | unassigned lane planner | **FIRST** (A-007) |
| **B** | SmartCity / Bastrop | a PORTFOLIO of twins including infrastructure | smartcity-os (**absolute no-touch on live Bastrop production**; see CTRL-2) | unassigned lane planner | last (consumes A, C, Smart Site) |
| **C** | Plan Review | the twin ADJUDICATIONS (the earning loop) | legacy-design-tools (cortex-reporting, ADR-023) | unassigned lane planner | parallel to A |
| **D** | ICC | a licensed SOURCE metered across every twin citing it | hauska-engine | unassigned lane planner | parallel to A |

**Owner rule (A-006).** A lane or shared leg without a named owner is not dispatchable. The operator assigns owners at dispatch time; "unassigned" is a blocking state, not a default.

**Acceptance card rule (A-006).** Every lane carries a FROZEN acceptance card, written at dispatch time and never edited afterward — the lane's own definition of done, in its own words, against which drift is visible. It is filed with the dispatch and cited in the close. This is the WDLL practice from Smart Site baseline v0.

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

| ID | Leg | Why it is shared | Blocks | Owner |
|---|---|---|---|---|
| S-1 | **Auth and tenancy** (sprint-54 leg) | The claim flow is the single most load-bearing dependency in the convergence (65_sensors convergence doc). Tenant isolation is not enforced today; Cortex runs an anonymous default tenant. | B (Bastrop private layer), A (per-tenant artifacts), C (reviewer identity), the claim flow | unassigned — longest pole |
| S-2 | **Telemetry plane placement** | Open item 1 in the sensor overview: named, not decided. Needs the ADR-008 and 56 target-topology check before it hardens. | B Tier 2 (live state), any watch work | unassigned |
| S-3 | **Smart Site mapping adoption** | Operator-named. The Smart Site mapping system is the proven one; SmartCity adopts it and Bastrop mapping comes up to that standard. | B, C (E6 map compose) | unassigned |
| S-4 | **ICC content-to-actor reference** | ICC is metered across BOTH Smart Site and Plan Review. The meter currently detects ICC content by allowlist and regex heuristic, not a hard reference. Two citing surfaces, one ledger. | D, C (F6 code library), any Smart Site ICC citation | unassigned (lane D executes) |
| S-5 | **Consumer contract shape** | ADR-023 rules that SmartCity consumes plan review as a FUNCTION. Whether all three suppliers are consumed via MCP, direct atom read, or service API must be one answer, not three. | B consumes A, C, and Smart Site | unassigned |
| S-6 | **Twin node-class and entityId ruling** | A twin of a human, a building, a desk, or a pump station is not the parcel-keyed shape. Constraint 6 says shapes are non-uniform by design; this program must DECLARE its shapes rather than discover them. **Now also carries the A-007 ruling: does Smart Files EXTEND the brokerage workspace family or SUPERSEDE it?** | A, B (assets), any sensor work | unassigned — ruled at G-10 |

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
| G-07 | 0 | **Repo cartography** — classify every one of the ~37 top-level directories and ~4,900 files: what it is, who owns it, active/archive/dead, and explicitly in-scope or out-of-scope for this program. Durable artifact `_catalog/repo_map.md`, not a report. | all lanes | The map exists, every top-level directory appears in it with a classification, and every count carries its counting rule | none | OPEN — G-01 covered root `.md` + `_smartcity_masters/` only; 35 directories and ~4,700 files were never examined |
| G-08 | 0 | **Dev-process file** — one hash-versioned document defining how we work, compiled into every dispatch like the contract | all lanes | A fresh agent with no thread context reaches the same operating conclusions as one with it | G-07 | OPEN |
| G-09 | 0 | **Process proving run** — three small deliberately-shaped agents (read-only audit, build-with-PR, forced mid-flight handoff) dispatched against the PROCESS, not lane work; close artifacts compared for structural identity | all lanes | Three closes are structurally comparable; divergence is a process defect, not an agent defect | G-08 | OPEN |
| G-19 | 0 | **Empressa Command Center authoritative docs** — 231 mentions, 116 in `_inbox/`, ZERO authoritative docs; authority split across eight documents with nothing composing them. Mechanical cause: `00c_portfolio_master_map.md`, whose job is enumerating surfaces, does not list it. Create the canonical doc set and add it to the master map. | all lanes (CC is the spine operator console) | A canonical CC doc exists at a numbered slot, `00c_portfolio_master_map.md` lists it, and the eight scattered sources are reconciled or point to it | G-07 map | OPEN — operator-ruled 2026-08-14. Cert View wiring goes to the backlog, not this row |

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
| A-002 | 2026-08-14 | **ASSUMPTION 2 FALSIFIED. Lane A is a BUILD, not a rendering pass.** G-03 closes with verdict BUILD. G-14 re-scoped from "wire a surface to a substrate" to "design and build the city-file-system family". G-53 now gates the Smart Files SALE, not just its surface. | G-03 verified at source: the workspace family is a BROKERAGE feature (agents saving listings via a browser extension), not a city file system — contract description "Brokerage workspace packaging contract types for V1", engine registry line 819, MCP "Brokerage tool 1/2/3". Planner re-verified the load-bearing schema independently: `brokerage_workspace_attachments` has a single notNull FK with cascade delete and **no `updated_at`, no `version`, no `cid`, no `access_policy`** (9 columns, `lib/db/src/schema/brokerageWorkspaces.ts:54-76`). "A document lives once and appears everywhere it belongs" is therefore structurally impossible — one attachment belongs to exactly one workspace, so many placements means many copies, the exact problem Smart Files claims to solve. "Revise once, prior version still there" has no schema at all: only insert and delete exist. Production: 142 workspaces, **0 attachments** — the files half has never been written to. | nick (operator stated Smart Files needed building at program open; the doc-34 self-assessment carried into assumption 2 was the planner's error) |
| A-003 | 2026-08-14 | **OR-1 RULED: claims register NOT revised. The build is made true before any customer sees it.** The three rows stay as written; lane A delivers what they promise. Consequence recorded: **doc 34's approved claims are now gated on the G-14/G-53 build**, and no Smart Files collateral may ship ahead of it. Doc 34 line 32 ("built and running in the command center") is false as written and is corrected as a scoped in-place edit. | Operator ruling. The claim is the product commitment, not a drafting artifact; the fix is to build it, not to soften it. Price is already submitted to Vertosoft at $25,000 entry | nick |
| A-004 | 2026-08-14 | **CTRL-1 + CTRL-2 recorded as program defects; fix dispatched to G0 (not planner-patched, to avoid a concurrent-edit collision).** CTRL-1: `canon-gate.ps1` `Test-PlanRows` greps only `P-\d+`; an empty match returns `ok`, so **every OPS-17 dispatch has passed PLAN-ROW validation unvalidated**. Planner reproduced: `G-9999` and `Q-42` (rows existing nowhere) return `ok`, while `P-9999` correctly rejects — which is why the gate looked alive. CTRL-2: `Work in P:/smartcity-os` passes open on the absolute-no-touch live-Bastrop-production repo while three other phrasings block. Both fixes carry negative tests. **A divergence test between the hook and `dispatch.mjs` is required**, not just the two patches. | CTRL-1 root cause is a DESIGN SEAM the planner introduced: rule 2 chose the `G-` prefix so rows would "never collide ... in a grep, a hook, or a compiler", and that anti-collision choice is exactly what blinded the hook. The compiler is stricter than the gate enforcing it, and AGENT_CONTRACT section 7's blocking guarantee has been false for OPS-17 since rule 2 was written. Two implementations of one rule drift the moment one changes — hence the divergence test | nick (sequencing: fix before the four build lanes) |
| A-005 | 2026-08-14 | **OR-2 through OR-6 ACCEPTED as recommended.** OR-2: 40i and 11a are NOT covered by any 33a ruling (33a open-item 4 names exactly three targets: 47, 33, and the M4-B/PLR/SD/W vocabulary inside doc 30); both route to the operator rather than being guessed, and 11a's 10 inbound references mean no retirement without a `supersedes:` target. OR-3: **doc 30 stays `status: active`** — a scoped in-place correction marking the M4-B/PLR-1..28/SD-1..SD-8/W1-W6 section superseded-in-place, NOT a status flip, because the masters cite doc 30 four times as live source of record and it holds the only integrations inventory G-18/G-21 have. OR-4: ADR status vocabulary is a real convention gap (`01_doc_conventions.md` never ruled on ADR lifecycle); 16 ADRs affected including adr_023, which lane C depends on. OR-5: `premortem-check` — live config and CLAUDE.md contradict the memory that retired it 2026-07-13; resolve in one direction. OR-6: `.cursor/settings.json` tracked or ignored, never merely-unadded. | The planner's dispatch brief over-attributed rulings to 33a; the lane planner checked at source and pushed back correctly. Recorded so the correction is durable and the brief's error does not propagate | nick |
| A-006 | 2026-08-14 | **Baseline v0 shape adopted: every lane and shared leg carries an OWNER, and every lane carries a frozen ACCEPTANCE CARD at dispatch time.** Owner column added to the lane and shared-leg tables below. | The operator's Smart Site v0 board ("each one now has a state and an owner") plus its WDLL practice ("everything in flight has a frozen acceptance card so drift is visible when it happens"). OPS-17 had state and instruments but neither owner nor per-lane acceptance card; with four hand-carried lane planners the shared legs would otherwise become nobody's | nick |
| A-007 | 2026-08-14 | **Lane A sequenced FIRST among the build lanes.** Three seams depend on it (B consumes A; plan review document handling rides it; Bastrop document capture is a Factory 1.5 workload needing the artifact store to exist). Open design ruling routed to G-10: **does Smart Files EXTEND the brokerage workspace family or SUPERSEDE it?** They are different products sharing a name — an agent saving listings against a city file system. Planner instinct is a separate family leaving the brokerage one alone; to be ruled deliberately, not by default. | Lane A was already first in dependency order; the BUILD verdict makes the sequencing consequential rather than incidental | nick |
| A-008 | 2026-08-14 | **G0-B closed: 41 of 41 directories mapped, none unmapped.** Deliverables `_catalog/repo_map.md` and `_catalog/repo_cleanup_backlog.md` (24 items, P0-P3). Four operator rulings executed this session, all planner-verified at source first. **R-A: the root `.vercel` link is REMOVED** — it linked doc_repo itself to a Vercel project named `doc_repo`, so a root `vercel deploy` would have published prospect dossiers, pricing, investor letters, and decision records; gitignored so it never propagated, but live locally. `system-overview-site/.vercel` (`empressa-overview`) is legitimate and untouched. **R-B: `_smartsite_masters/` NOW TRACKED** — nine `status: active` masters governing the customer-facing product, two carrying approved-claims registers and never-say lists, were entirely untracked with no ignore rule matching; they existed on one machine and would not survive a clone. This binds A-003 directly: the ruling that doc-34 claims stay as written and get built true is only enforceable if the register survives a clone. PDFs stay ignored per existing convention. **R-C: the shadow `Master Collateral Folder/_smartcity_masters/` is DELETED** (backed up to `_scratch/removed_2026-08-14/`, it was untracked so no git history existed to recover from) — it differed from the ratified root set in five of six files, root newer on all five, and listed government pricing as "an operator decision" while the authoritative root says SET 2026-08-10 with prices already at Vertosoft as MSRP. **R-D: `_inbox` retention R2/R3 adopted, R1 held** pending its two prerequisites. | Cartography found two hazards that were on nobody's brief. The scope correction is the durable lesson: G0 covered **852 of 1,955 markdown files (43.6%)** and published its exclusion list, but the "366 violations" headline travelled without its denominator — a process defect, not an agent defect, and now a G-08 requirement that a coverage figure travels with its denominator or does not ship | nick |
| A-009 | 2026-08-14 | **Command Center gets authoritative docs (new row G-19).** Cert View wiring — where a required certification gate physically happens and which may be unwired — goes to the cleanup backlog until it surfaces in real work. **The two in-repo clones are NOT deleted**: `hauska-mcp-server/` (already ruled in `.gitignore:12-13` "delete the clone", never executed) and `tmpbrief-l3-spine-consume/` (genuinely unrecorded, a clone of a different repo). Both stay untouched at their original HEADs pending an inspection of contents. | Operator: "i dont want to delete either of those without knowing whats in them. our MCP server is half of our business model." A ruling recorded in a gitignore comment and never executed is the same 0-for-3 prose-control shape this program exists to fix — but deleting a clone of a business-critical repo without reading it is the larger risk | nick |

## Assumptions carried (each reversible by one amendment)

1. **The rebuild named in `34_smartcity_smart_files_and_foundation.md` open-item 1 IS this program.** The operator was uncertain. If it names a different effort, amend the G-03 and G-14 scope.
2. ~~**Smart Files is a rendering pass, not a build.**~~ **FALSIFIED 2026-08-14 by G-03; see A-002.** Smart Files is a BUILD. Retained struck-through rather than deleted: the assumption was written to be tested, the test ran, and the mechanism working is the record worth keeping. Doc 34 asserted it, the schema refuted it.
3. **Sensors are Asset Management Tier 2, not a fifth lane.** Ruled from the doc 32 Tier 2 section plus the sensor overview; both describe telemetry identically. UNTESTED — no row currently falsifies or confirms it.

**On carrying assumptions.** A-002 is the argument for this section existing. The planner carried doc 34's self-assessment into a program assumption; a read-only audit falsified it in one day and the cost was one amendment instead of a lane built on sand. Every future assumption added here is written to be falsifiable and named in a row that tests it.

## GRADE LOG (one row per grading pass; statuses re-grade by instrument only)

| Date | Pass | Rows graded | Result | Instrument notes |
|------|------|-------------|--------|------------------|
| 2026-08-14 | baseline | G-01, G-24, G-30, G-41 | recorded as LIVE at source | G-01 by frontmatter sweep; G-24 from the verified doc 32 statement; G-30 by grep on engine main; G-41 from adapter code plus commit history |
| 2026-08-14 | G-06 close | G-06 | PASS | Five-case negative test on true exit codes (not pipe exits): valid G row 0; valid P row on default plan 0; wrong-prefix row 1; unknown row 1; unknown plan 1. The gate was proven able to fire before being trusted, per inherited constraint 9. |
| 2026-08-14 | G0 close | G-01..G-05 | G-02 PASS; G-03 PASS (verdict BUILD); G-01/G-04/G-05 findings filed, 6 rulings owed | Close `_inbox/2026-08-14_g0_close.json` plus four sub-agent artifacts. G-02 `scripts/doc-staleness.mjs` built by the lane planner directly (not delegated) and proven on five cases; repo-wide it found **366 violations, not the 16 in the brief** — the brief's figure was root-only — and the largest class is **129 docs with no `status` field at all**, an absence class nobody had named. G-03 verdict BUILD, planner-re-verified at the schema. G-05 found CTRL-1 and CTRL-2, both reproduced. |
| 2026-08-14 | planner verify of G0 | G-03 schema claim, CTRL-1, doc-34 register | all three CONFIRMED at source | Verification not taken on report, per the rule that verification never rises on trust alone: `brokerageWorkspaces.ts:54-76` read directly (9 columns, single notNull FK cascade, no updated_at/version/cid/access_policy); CTRL-1 reproduced in PowerShell (`G-9999` → no `P-\d+` match → `ok` = fail open; `P-9999` → matched → rejected = looked alive); doc 34 register rows read at source. |
