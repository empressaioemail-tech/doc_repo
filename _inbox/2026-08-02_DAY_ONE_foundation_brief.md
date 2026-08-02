---
id: 2026-08-02_DAY_ONE_foundation_brief
title: DAY ONE — Foundation Brief for getting all of Texas onto the spine (architecture + sequencing to pressure-test BEFORE any ops docs)
date: 2026-08-02
status: THINKING DOCUMENT (not a decision record; operator pressure-tests + corrects; NOTHING downstream is written until the frame here is settled)
owner: nick
related: [2026-08-02_bastrop_recipe_ACCEPTED, 2026-08-02_bastrop_city_and_fan_MASTER_WDLL, 2026-08-01_fan_readiness_audit_VERDICT, 2026-08-01_scale_before_new_layers_sequencing, _catalog/tx_jurisdiction_source_registry.json, 27_MASTER_WDLL_spine_completion_and_depth_engine, _architecture_homes/00_overview.md]
purpose: This is the foundation the rest of the business sits on. Before writing the operations-document set, settle the ARCHITECTURE and SEQUENCING it will encode. This doc frames the decisions, surfaces the real tensions, and puts the open questions to the operator with reasoning — it does NOT commit anything. The frame gets corrected here first; then the ops docs write themselves correctly.
---

# DAY ONE — Foundation Brief

Treat today as day one. The task: get Texas as a whole onto the spine, ACCURATELY, every parcel with its data sources cited — a foundation the rest of the business sits on. The operator's directive: SLOW DOWN, pressure-test the thinking, be a stickler. This brief is the frame; nothing gets built or documented downstream until it is settled with the operator.

## 0. WHERE WE ACTUALLY ARE (ground truth, no getting ahead)
- CERTIFIED: 1 downtown Bastrop block (7 parcels), mechanical + operator R6. NOT the city, NOT the county, NOT another county.
- The RECIPE is extracted + accepted (8 buckets, R1-R32, 17 dead rules, code-verified) — the contract a correct parcel must honor. Two critical findings stand: the cert script is NOT on main (mechanical cert not reproducible), and R7 is only half-implemented (primitive bake still declines).
- The county/data-source registry (`tx_jurisdiction_source_registry.json`) is CAPCOG batch 1 only: 55 jurisdictions = ~10 of Texas's 254 counties + their cities, 1 of ~24 councils-of-governments regions, with 5 internal gaps, and it PREDATES the accepted recipe (does not encode the layer-23-per-parcel-record / R32 model). A good prototype of the right artifact; not the foundation. It DOES carry a "recent-repeal onboarding-risk register" — the Bastrop-currency lesson operationalized — which is a real asset.
- The fan-readiness gate returned NO-GO for the RIGHT reason: mold is source-correct + fabrication-firewall holds, but the parcel-provider registry stops at ~10 counties; the rest return honest-empty. Wiring, not correctness.
- ENGINES: a mix, NOT cleanly delineated. The EngineEnvelope already tags `confidence.kind: calibrated | asserted | deterministic` — so the system distinguishes mechanical from asserted — but NO doc states which engines are mechanical vs agent-driven as a CONTRACT. The Command Center engine panels (Resolver, Autonomous Engines) are STUB — "the engines ran (2345 warm parcels) but have no live operator surface." Memory (M0) has a KNOWN unfixed weakness ("cc-agent-reach hardening — the biggest known M0 weakness; do before fan-out").

## 0b. OPERATOR RULINGS (2026-08-02 — these are now DECIDED; the rest of the brief is refined around them)
The operator resolved the core frame. These are load-bearing invariants the ops docs must encode:

R-FND-1 — BASTROP CITY IS THE FIRST RUN THROUGH THE ENGINE STACK. Bastrop city, MINUS the certified Block-13 (which stays QUARANTINED + clean as the reference block), is the first properties through the full engine pipeline. Bastrop-city IS the first proof of the County Onboarding Runbook — it validates the mechanism end to end. Block-13 is not re-run; it is the held certified control.

R-FND-2 — THE TEXAS SOURCING REGISTRY + WDLL ARE BAKED INTO THE ENGINES. The complete Texas data-sourcing list is not documentation beside the engines — it is an ENGINE INPUT ARTIFACT the mechanism READS (per-county source adapters, currency register, conflict register, coverage ledger). The registry is data the engine consumes, versioned and frozen, not a doc.

R-FND-3 — THE FACTORY-OPERATOR MODEL (the mechanical/agent boundary, DECIDED). The engines are deterministic MACHINERY. Agents are the OPERATORS who run the factory like a human runs a plant: WATCH, RUN, TROUBLESHOOT, REPORT, KEEP IT RUNNING, and look for ways to OPTIMIZE. Agents are NOT the machinery. Specifically:
  (a) SOURCE ADAPTERS are authored as PRE-FAN PREP WORK → adversarially reviewed → verified → FROZEN. Not authored at warm time. Once frozen, the mechanism replays them; no agent re-authors at rewarm.
  (b) Agents MAY REASON THROUGH THE STICKY PARTS (a novel county source, a conflict adjudication, a repeal call) — AS LONG AS THERE ARE GUIDELINES. Reasoning is an operator-level activity, bounded by written guidelines, NOT a machinery-level free-for-all.
  (c) THE MACHINERY (warm / inset / cert / currency gate / owner-match) stays MECHANICAL and deterministic. No agent call inside a warm/cert/serve run.

R-FND-4 — COMMAND CENTER IS THE FACTORY FLOOR, AND BASTROP IS ITS FIRST SUBJECT. CC is a first-class part of the foundation (not later polish). Bastrop city is the first jurisdiction the operator EXPERIENCES coming online + verified-correct in CC as we bring the stack up. The CC engine console is where the operator watches the factory run.

R-FND-5 — RECIPE-VERSION FIELD CONFIRMED. Every promoted atom carries the recipe version it was warmed under — the rewarm trigger. (Operator confirmed the catch.)

R-FND-6 — THE COUNTY/CITY LEDGER IS A PERFORMANCE PUBLIC DATA LAYER. The engines carry a ledger of counties + cities showing what has been done / not done / rewarmed + whatever statistics we need. The operator's framing (load-bearing): "this is a PERFORMANCE public data layer and we need to treat it as such." The ledger is not a passive coverage tracker — it is a performance surface (throughput, coverage %, recipe-version drift, cert state, cost-per-jurisdiction, staleness) treated with the rigor of a product data layer.

## 0c. THE ONE OPEN SEAM (operator ruling needed — where the factory could drift)
R-FND-3(b) says agents may reason through sticky parts, bounded by guidelines. R-FND-3(a) says adapters are frozen after review. These reconcile cleanly for PREP-TIME reasoning (reason → review → freeze). The open seam is LIVE-RUN reasoning: when an operator-agent reasons through a sticky part DURING a live run (a county's source changed mid-warm; a novel conflict appears) — is that reasoning:
- (i) a LIVE operator decision that keeps the line running but is NOT yet captured — in which case the NEXT rewarm might reason differently, and the rewarm is NOT deterministic; OR
- (ii) only "DONE" once CAPTURED as a frozen artifact (a new currency-register / conflict-disclosure / adapter-patch row, reviewed + committed) that the mechanism then replays — in which case rewarm stays deterministic AND agents can handle novelty.

PLANNER READ (for operator ruling): (ii) — the factory operator may reason LIVE to keep the line running, but any decision that AFFECTS CORRECTNESS is not "resolved" until it lands as reviewed, frozen data/config the mechanism replays. Live reasoning is a work-in-progress state, never a durable one; the durable state is always a frozen artifact. This is the guideline that makes "reason through sticky parts" safe and keeps rewarm deterministic. THE INVARIANT: a rewarm run makes zero novel judgments — it replays frozen artifacts only; any judgment a live run made must have been frozen before the next rewarm, or that county is flagged "unfrozen-decision — rewarm-unsafe" in the ledger.

RULED 2026-08-02 (operator): CONFIRMED (ii) — plus a load-bearing addition:

R-FND-7 — THE MEMORY SYSTEM IS INSTALLED AS PART OF THE FACTORY (the capture-and-freeze organ). The memory system (M0 fleet-memory: two-tier scratch→promoted, planner-gated, promotion-is-a-test-not-prose) is NOT a side tool the planner uses — it is the MECHANISM by which live operator-reasoning gets captured and frozen. When a factory-operator agent reasons through a sticky part live, the memory system is WHERE that decision LANDS: scratch = the work-in-progress live decision; promoted = the reviewed, frozen artifact the mechanism replays. M0's scratch→promoted IS the factory's capture-and-freeze loop. IMPLICATIONS: (a) the memory system is load-bearing FOUNDATION infrastructure inside the factory, not adjacent tooling; (b) the memory-system check is therefore FOUNDATION-CRITICAL — it verifies the factory's capture-and-freeze organ, and if memory drifts (the known cc-agent-reach weakness), the entire rewarm-determinism guarantee drifts with it; (c) the "unfrozen-decision — rewarm-unsafe" ledger flag is DERIVED FROM MEMORY STATE — a county with a live decision still in scratch (not promoted/frozen) is rewarm-unsafe by definition; the performance ledger (R-FND-6) reads memory-promotion state to compute it; (d) the CC factory floor (R-FND-4) must surface memory/freeze state per county (what's in scratch awaiting freeze vs promoted-frozen).

## 1. THE CENTRAL PRINCIPLE THE OPERATOR NAMED (and why it drives everything)
"The engines are supposed to be mechanical things because we will have to REWARM THE COUNTRY every time we have an improvement in our program."

This is the load-bearing architectural principle and it is correct. If the pipeline that turns a raw county source into cited, correct, served parcels is a DETERMINISTIC MECHANISM, then:
- Every recipe improvement (a new ruling, a fixed edge case) = re-run the mechanism over the country = the whole country gets the improvement. Reproducible, auditable, cheap.
- If instead any step is AGENT-DRIVEN in the correctness path, then rewarming means re-running agents = non-deterministic, non-reproducible, expensive, and drift-prone (the exact failure the whole Bastrop pause was about).

So the mechanical-vs-agent boundary is not a detail — it decides whether "rewarm the country" is a script you run or an agent army you re-dispatch (and re-verify) every time. This brief's #3 is where we reason about that boundary together.

## 2. THE FOUR LAYERS OF THE FOUNDATION (a shared vocabulary before we decide anything)
To reason cleanly, name the layers the foundation has:
- L-SOURCE — the authoritative public data per county (parcel geometry, per-parcel dimensional record, zoning fabric, code edition, flood/terrain/soils). Per the recipe: parcels = TxGIO statewide + county GIS; setbacks = the jurisdiction's per-parcel record; etc. ACQUISITION lives here.
- L-ENGINE — the deterministic transforms that turn L-SOURCE into atoms: warm (fetch record → setback-rule atom), inset (setback-rule → buildable-envelope, R0/R28/R30/R32), currency gate (R13/R16), owner-match join gate, road-node build, property-line tagging. THIS is what must be mechanical.
- L-LEDGER — the persisted, promoted atoms + coverage ledger (county_facet_coverage, depth-warm-promoted). The served truth. Persisted==recompute (R10) lives here.
- L-SURFACE — what the customer/operator sees: PE (customer), Command Center (operator console), the cert harness. The engines must be VISIBLE here (currently STUB).

The ops docs will be organized by these layers. The mechanical-vs-agent question is really: "which layer, if any, is agents allowed into, and in what role?"

## 3. MECHANICAL vs AGENT — THE BOUNDARY (reason about this WITH the operator; NOT decided here)
The operator chose to think about this together rather than pick. Here are the candidate boundaries, the real trade-offs, and where the tension actually is. This is the most important decision in the brief.

THE CANDIDATES:

CANDIDATE A — "Engines mechanical; agents only orchestrate + verify."
- L-ENGINE is 100% deterministic scripts. Agents NEVER touch the correctness write-path. Agents only: dispatch/sequence the mechanical runs (orchestration) and adversarially review + operator-R6 the output (verification).
- PRO: rewarm-the-country is literally "run the scripts." Maximally reproducible, auditable, cheap. No drift possible in the data path.
- CON: the messy reality of 254 counties — every county's public source is shaped differently (different ArcGIS schemas, different field names, different code formats, HCAD's 13-digit key vs PACS integer, conflicting layers). SOMETHING has to map each county's raw source into the mechanism's expected shape. If agents can't touch that, then a HUMAN or a deterministic per-county adapter must — which means per-county adapter authoring is the bottleneck, and it's slow.

CANDIDATE B — "Mechanical core; agents author the ADAPTER once, mechanism replays."
- L-ENGINE core (warm/inset/cert/currency) is deterministic. But the PER-COUNTY SOURCE ADAPTER (how THIS county's raw GIS maps to the mechanism's inputs) is agent-ASSISTED to author — an agent discovers the county's endpoints, field mappings, conflicts, and EMITS A DETERMINISTIC ADAPTER (config + code) that is then FROZEN. Rewarm replays the frozen adapter, no agent.
- PRO: agents do what they're good at (messy discovery, ambiguous mapping) ONCE per county; the rewarm is still deterministic (replays the frozen adapter). This is likely how you actually onboard 254 differently-shaped counties at reasonable speed.
- CON: the boundary "agent decides once, mechanism replays" must be POLICED — the agent's adapter output must be captured as a reviewable, frozen, deterministic artifact, never a live agent call in the warm path. If that discipline slips, you're back to agents-in-the-path. Requires a hard gate: "no agent call inside a warm/cert run; agents only produce adapters that are reviewed + committed + frozen."

THE REAL TENSION (what we must resolve): it is NOT "mechanical vs agent" as a binary. It is: WHERE is the seam between "agent figures out a novel county's messy source" (unavoidable — 254 counties are not uniform) and "the mechanism deterministically warms/certs/serves"? Candidate A says the seam is a human/hand-authored adapter (slow, purest). Candidate B says the seam is an agent-authored-but-frozen adapter (faster, needs a freeze-discipline gate). Both keep the WARM/CERT/SERVE path mechanical — they differ only on who authors the per-county source adapter and how it's frozen.

QUESTIONS FOR THE OPERATOR (the decisions that set the boundary):
- Q3.1 — Is the per-county SOURCE ADAPTER (raw county GIS → mechanism inputs) allowed to be agent-authored (then frozen + reviewed), or must it be deterministic/hand-authored? (This is the crux — it decides onboarding speed vs purity.)
- Q3.2 — What is the FREEZE gate? (If agent-authored adapters are allowed: the artifact must be a committed config/code file, adversarially reviewed, with NO live agent call in any warm/cert/serve run. State the invariant that enforces "agent decides once, mechanism replays.")
- Q3.3 — Are there ANY correctness decisions that are IRREDUCIBLY judgment (e.g. "which of two conflicting city layers is authoritative", "is this repealed") that we accept an agent/operator makes per-jurisdiction, captured as data (a currency-register row, a conflict-disclosure row) that the mechanism then applies deterministically? (This is the R25 conflict-disclosure / currency-register pattern — a judgment captured AS DATA the mechanism reads. Likely yes; name it explicitly so it's not a backdoor.)

MY READ (for you to push on, not adopt): the honest answer is Candidate B with a hard freeze-gate, PLUS Q3.3's "judgment-captured-as-data" pattern — because 254 counties are genuinely non-uniform and a pure hand-authored adapter per county is too slow, but the rewarm-the-country promise REQUIRES that once a county is onboarded, its warm/cert/serve is a deterministic replay with zero live agent calls. The discipline that makes this safe is the freeze-gate: an agent may PRODUCE a county's source-adapter + currency-register + conflict-disclosure rows, but those become COMMITTED, REVIEWED, FROZEN artifacts, and the mechanism only ever reads frozen artifacts. Rewarm = replay frozen artifacts through deterministic engines. No agent in the loop at rewarm time. But this is exactly what I want you to pressure-test.

## 4. WHERE THE ENGINES LIVE + HOW THEY SHOW IN COMMAND CENTER (frame, to settle)
- LIVE: per the architecture-homes standard, L-ENGINE is hauska-engine (the deterministic transforms) exposed via engine-api; L-LEDGER is the substrate Neon (promoted atoms + coverage); L-SURFACE customer = PE (hauska-map), operator = Command Center (hauska-map/apps/command-center).
- THE GAP: the Command Center engine panels (Resolver, Autonomous Engines) are STUB. For a country-scale rewarmable foundation, the operator MUST be able to SEE: which engines exist, their determinism kind (mechanical/asserted), per-county run state (warmed/certified/pending/failed), coverage %, last-rewarm timestamp + recipe-version, and the currency/conflict registers. "The engine works" is not enough; "the operator can see every county's engine state" is the console requirement.
- QUESTION Q4.1 — Is the Command Center the single operator surface for the whole rewarmable spine (per the command-center-is-the-spine-console memory), and does the ops-doc set include a "Command Center engine-console spec" as a first-class deliverable (not a later polish)? (My read: yes — you cannot operate a country-scale rewarm blind; the console is foundational, not polish.)
- QUESTION Q4.2 — RECIPE VERSIONING: if we rewarm the country on every improvement, every promoted atom must carry the RECIPE VERSION it was warmed under, so the console can show "county X is on recipe v4, county Y on v3, rewarm needed." Is recipe-versioning a required field on every promoted atom (the mechanism of "rewarm on improvement")? (My read: yes — this is HOW you know what needs rewarming; without it, "rewarm the country" has no trigger.)

## 5. THE OPS-DOCUMENT SET WE WILL WRITE (the map — after this frame settles)
Once #3 + #4 are settled, the operations set (proposed; names + purpose) — organized by the four layers:
- OPS-1 — Texas Source-of-Truth Registry SPEC (L-SOURCE): the schema + process for the full 254-county / 24-COG registry (supersedes the CAPCOG prototype); per county: parcel source (TxGIO + county GIS), per-parcel dimensional record, zoning fabric, code edition + currency, adapter kind, confidence, gaps. Every source CITED. Includes the recent-repeal onboarding-risk register as a first-class part.
- OPS-2 — The County Onboarding Runbook (L-SOURCE → L-ENGINE): the deterministic, repeatable procedure to bring one county from raw sources to certified served parcels, honoring the recipe. The mechanical loop. Names the agent-seam (per #3) explicitly.
- OPS-3 — Engine Contract + Determinism Register (L-ENGINE): every engine, its determinism kind (mechanical/asserted), inputs/outputs, where it lives, and the freeze-gate invariants. THE mechanical-vs-agent contract, made unambiguous.
- OPS-4 — Rewarm Protocol (L-ENGINE + L-LEDGER): how a recipe improvement triggers a country rewarm; recipe-versioning; what gets invalidated; cost/throughput gate ($200/jurisdiction commitment #3).
- OPS-5 — Cert Standard (L-LEDGER + L-SURFACE): R17 full-jurisdiction cert = R32 geometry + three-way convergence + currency + parcel-currency + operator R6; the area-sweep-not-sample standard; what "certified" means per unit (parcel/block/city/county/state).
- OPS-6 — Command Center Engine Console SPEC (L-SURFACE): the operator's rewarmable-spine console — per-county engine state, coverage, recipe-version, registers. (Per Q4.1.)
- OPS-7 — Coverage + Honesty Doctrine (L-SURFACE): honest-absence at scale (most counties missing most layers); "coverage in progress" banners; fail-closed everywhere; never present un-warmed as served.
(This set is a PROPOSAL. It gets finalized only after #3/#4 settle — the docs encode those decisions.)

## 6. THE OTHER DELIVERABLES YOU NAMED (sequenced, not forgotten)
- DEEPER E2E REVIEW (deeper than Bastrop): a read-only, adversarially-gated pressure test of the WHOLE foundation — not just "does a parcel warm right" but "is the mechanical-vs-agent boundary actually clean in code, are there agent calls in the warm path today, is the ledger reproducible, does the console reflect truth, are the currency/conflict registers real." Informs #3/#4 with ground truth. SEQUENCE: after this frame is directionally agreed, before the ops docs are finalized (so the docs reflect verified reality).
- MEMORY-SYSTEM CHECK: verify M0 (fleet memory) is functioning — the flagged "cc-agent-reach weakness" that was gated before any fan-out. Is the two-tier scratch→promoted working, is the planner-gate real, is a promotion actually a test-not-prose, does memory reach executors (the known weak point)? This is load-bearing because the whole "rewarm + improve" loop depends on lessons not drifting. SEQUENCE: alongside the E2E review.
- REPO UNAMBIGUITY: make this plan unambiguous to the rest of the repo — the ops docs get canonical numbered slots (not just _inbox), CLAUDE.md + 00_current_state point at them, and the standing decisions travel. SEQUENCE: after the ops docs are written.
- DOC RECONCILIATION: the HELD cross-repo doc-reconciliation pass (release-gated, unblocked by the "smart site" naming) — reconcile the whole doc set against this now-settled foundation. SEQUENCE: LAST — it reconciles everything against the foundation, so the foundation must exist first.

## 7. THE PROPOSED ORDER (pressure-test this)
1. THIS BRIEF — operator pressure-tests + corrects the frame (#3 boundary, #4 console/versioning, #5 ops-set, #7 order). Nothing downstream until settled.
2. DEEPER E2E REVIEW + MEMORY CHECK (read-only, adversarial) — ground the frame in verified reality; surface anything that changes it.
3. OPS-DOC SET (OPS-1..7) — written to encode the settled frame.
4. REPO UNAMBIGUITY — canonical slots, CLAUDE.md/state pointers, standing decisions.
5. DOC RECONCILIATION — reconcile the whole repo against the settled foundation.
6. ONLY THEN — Bastrop city (Phase 2) as the FIRST county-onboarding-runbook proof, then the fan.

## 8. THE OPEN QUESTIONS (consolidated — the operator's calls that unblock the ops docs)
- Q3.1 per-county source adapter: agent-authored-then-frozen, or hand-authored/deterministic?
- Q3.2 the freeze-gate invariant (if agents author adapters): what enforces "no agent call in warm/cert/serve; agents only produce frozen reviewed artifacts"?
- Q3.3 judgment-captured-as-data: name the irreducible per-jurisdiction judgments (conflict-authority, repeal-status) that an agent/operator decides ONCE, captured as data the mechanism replays.
- Q4.1 Command Center as THE rewarmable-spine console — ops-doc first-class deliverable?
- Q4.2 recipe-versioning on every promoted atom as the rewarm trigger — required?
- Q5 the ops-doc set — right 7 docs, right layering? add/remove?
- Q7 the order — right sequence? (E2E+memory before ops docs; reconciliation last.)

Nothing is committed. This is the frame to get right before the foundation is written.
