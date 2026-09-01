---
id: 2026-08-22_planner_handoff_business_thesis_agent
title: Handoff to business / thesis planner — parcel record gap + execution stack
date: 2026-08-22
from: doc_repo integration planner (P-57/P-58 session)
to: Business / thesis planner (parallel session)
re: Texas parcel public-record completeness vs product surface wiring — what we are doing, what we found, desired end state
status: handoff — thesis planner reply complete 2026-08-22; verdict serve authorized
related:
  - _inbox/2026-08-22_parcel_public_facts_gap_matrix.md
  - _inbox/2026-08-22_roadmap_snapshot_before_parcel_gap_finding.md
  - _inbox/2026-08-22_atom_full_surface_WDLL.md
  - 80_adrs/adr_030_declared_is_not_armed_contract_surface_governance.md
  - _decisions/2026-08-10_harvest_completeness_ruling.md
---

# Handoff: business / thesis planner

Filed: 2026-08-22
From: doc_repo planner (`P:/doc_repo`, integration seat)
To: Business / thesis planner (parallel agent)
Re: Parcel public-record deficit, CAD consistency, and how it intersects product thesis

---

## 1. Conversation summary

On 2026-08-22 the property integration program completed two major verification passes. First, **SERVE** (P-48..P-54) wired eight `*Fact` families onto SmartSite inspect for gold Bastrop parcel `48021:34137`, including identified-session owner. Second, a **full atom surface audit** (P-57 live + P-58 code) asked whether fifteen property-spine families are honestly reachable on map, inspect, and County Manifest — and found that inspect wiring on gold does **not** move CC manifest (scorers required), and that non-gold counties often return HTTP 200 with zero facts (`atom-chain empty`) or cortex 404 bake holes.

In parallel, a **contract surface investigation** (ADR-030) verified that many shipped contract types are dormant (temporal/would-affect-edge, utility-easement), the MCP gate runs contract **1.9.0** while npm is **1.22.0**, and tenant-private data lives on Smart Files (second store), not `hauska_mcp.atoms`.

The afternoon pivot: operator challenged why CAD analysis referenced only **15 counties**. Investigation showed `cad_property` is a **15-county roll table** (~4.6M rows) while Texas has **254 counties**, **196 with geometry loaded**, **253 CAD endpoints probed**, and **~1,088 distinct CAD REST field names already inventoried** but not ingested. **~3.3M metro parcels** have identity and value from StratMap but **0% structural fields** (sqft, year built) because CAMA bulk exports were never loaded despite registry `bulk_primary: true` on Dallas and Tarrant.

**Operator priorities stated explicitly:** (1) **structural fields**; (2) **CAD consistency across datasets**.

---

## 2. Decisions reached (this session — technical, not business)

| # | Decision | Owner | Reversal |
| --- | --- | --- | --- |
| 1 | Phase 1 full-surface audit (P-57/P-58) is **closed**; execution stack P-59..P-62 remains queued | operator / planner | Operator reopens audit |
| 2 | CC manifest unchanged after inspect SERVE is **expected**, not a defect | operator (prior stamp) | P-59 scorers land |
| 3 | Forward consequence / `would_affect` is **roadmap**, not present-tense product claim | ADR-030 thread A | Producer + store + query exist |
| 4 | File/publish/collect dial is **design** on MCP gate; Smart Files HTTP is **armed** | ADR-030 thread B | Gate serves Smart Files rows |
| 5 | 15-county `cad_property` must **not** be cited as Texas CAD coverage | planner | Roll extends to 196 counties |
| 6 | Structural metro gap is **source tier** (StratMap vs CAMA), not a wiring bug | evidence in gap matrix | CAMA bulk loaded + tier stamped |
| 7 | **Verdict serve authorized** — empty chain without declaration is defect; P-63 WDLL | operator 2026-08-22 evening | Revert if violation test cannot fail empty-success |
| 8 | P-59 plumbing parallel; **scorer semantics blocked** until verdict live | thesis planner + operator | Scorers ship boolean logic before verdict |

**No business/pricing/tier decisions ratified** except verdict-serve authorization. Thesis items 3, Q2, Q4, Q6 are recommendations pending operator ratification.

---

## 3. Open questions (for thesis / business planner)

| # | Question | Why open | Route to |
| --- | --- | --- | --- |
| 1 | Does **Layer 1 free** still mean "owner + value + situs" when structural fields are empty on 3.3M metros? | Public-record completeness vs honest absence | Pricing / tier model (`08_tiered_access_model.md`) |
| 2 | Is **"parcel record"** a product promise distinct from **"zoning reasoning on gold"**? | Two different done states in flight | SmartSite GTM / OPS-18 |
| 3 | Should **CAMA bulk backfill** block launch narrative or run parallel per A-017? | A-017 said post-launch; operator now elevates structural | Operator ruling needed |
| 4 | **Market-layer facts** (DEED_DATE at 148 counties) — product now or harvest later? | Unlocks tenure/comps without MLS | Market layer thesis (parked 2026-08-10) |
| 5 | How does **sell reasoning not data** interact with holding 1,088 unharvested public fields? | Harvest ruling says take everything we touch | Thesis commitment #1 |
| 6 | **Two-store tenant model** — how does federated custody read in enterprise pitch? | Thread B closed; copy not updated | Mox / enterprise |

### Thesis planner answers (2026-08-22)

| Q | Answer summary | Status |
| --- | --- | --- |
| Q1 | Lenses not field lists; Layer 1 = identity lens | Recommendation |
| Q2 | Two lenses (parcel record broad/shallow vs zoning narrow/deep); sell separately | Recommendation |
| Q3 | Verdicts make launch-with-gaps defensible; CAMA still needed | Partially ruled (verdict serve authorized) |
| Q4 | Harvest DEED_DATE now (Record); tenure yes, **comps no** (TX non-disclosure) | Recommendation |
| Q5 | No conflict with sell-reasoning; 1,088 = authority+class decisions | **Ruling** |
| Q6 | Federated custody is strength; property path = not unified access yet | Recommendation |

Full integration: `_inbox/2026-08-22_thesis_planner_reply_integration.md`. Decision: `_decisions/2026-08-22_thesis_planner_parcel_gap_rulings.md`.

---

## 4. Artifacts produced (file paths)

| Artifact | Purpose |
| --- | --- |
| `_inbox/2026-08-22_parcel_public_facts_gap_matrix.md` | Canonical statewide gap matrix (38 fact categories + harvest + tiers) |
| `canvases/parcel-public-facts-deficit.canvas.tsx` | Interactive filterable deficit register (66 rows) |
| `_inbox/2026-08-22_roadmap_snapshot_before_parcel_gap_finding.md` | Frozen pre-finding execution stack |
| `_inbox/2026-08-22_atom_full_surface_gap_backlog.json` | P-59..P-62 ranked backlog (surface wiring) |
| `_inbox/2026-08-22_contract_surface_store_truth_investigation.md` | ADR-030 verification closes A/B/C/D |
| `_inbox/2026-08-10_HARVEST_field_inventory_report.md` | 1,434 field rows / 11 sources catalogue |
| `_inbox/2026-08-10_cad_structured_data_gap.md` | Structural tier root-cause analysis |
| `_catalog/source_field_inventory.json` | Machine-readable field inventory |

---

## 5. Desired end state (technical — still valid)

**Surface:** Every property-spine family with store rows is honestly reachable on SmartSite (inspect cites atom or typed refusal) and County Manifest (scorer-backed cells, not invented percents). Map layers read atoms where spatial.

**Data plane (new — operator elevated):**

1. **Structural fields** — `living_area_sqft`, `year_built`, footprint/easement where public source exists; CAMA bulk for metros; honest tier stamp when absent.
2. **CAD consistency** — one logical roll per parcel across `txgio_parcel`, `cad_property`, and atoms; `source_vintage` carries `tier:cad-export` vs `tier:stratmap-roll`; no bake field presented as atom; `geo_id` on roll where REST carries it.

---

## 6. How the two roadmaps fit

```
BEFORE FINDING (morning)                AFTER FINDING (afternoon)
────────────────────────                ────────────────────────────
SERVE gold inspect          ──────────► Still valid; not statewide proof
P-59 scorers → CC           ──────────► Still valid; footprint rail empty until CAMA
P-60 map layers             ──────────► Still valid; parallel track
Post-launch CAMA/harvest    ──────────► ELEVATED: structural P0 for metros
15-county cad_property      ──────────► WRONG denominator; plan for 196 roll
```

**Recommended program shape (planner proposal — needs operator go):**

| Track | Scope | Plan home |
| --- | --- | --- |
| **A — CAD data plane** | Q5 CAMA metros, Q3 harvest, StratMap parse, tier honesty, statewide roll | Amend OPS-16 / new WDLL |
| **B — Surface wiring** | P-59..P-62 unchanged | Existing atom full surface WDLL |
| **C — Governance** | ADR-030 fix backlog, gate contract bump | Substrate seat |

Tracks A and B can run **in parallel** if CAMA loads are announce-serialized (L9 discipline). Track B must not claim customer-done on structural families until Track A lands rows for target counties.

---

## 7. What the thesis planner should NOT relitigate

- Cotality extinguished; CAD is authoritative for land use
- A-017: do not restart Harris statewide PBF as launch blocker
- Forward consequence is dormant (thread A closed)
- Tenant-private is Smart Files second store (thread B closed)
- Honest `atom-miss` is success, not failure

---

## 8. Suggested next actions

**Operator (doc_repo session):**

1. Open canvas deficit register; pick P0 rows for first CAMA load (Dallas, Tarrant, then Bexar/Travis/Collin/Denton).
2. Decide whether to amend OPS-16 with explicit **CAD data plane** rows or fold into P-25 elevation.
3. Authorize or defer P-59 dispatch while CAMA track starts.

**Business / thesis planner:**

1. Read this handoff + gap matrix executive summary (first two sections of markdown artifact).
2. Answer open questions §3 — especially Layer 1 promise vs structural completeness.
3. Align GTM copy with ADR-030 present-tense rules until structural backfill lands.

---

## 9. One-paragraph elevator (paste-ready for other agent)

We finished wiring property facts onto SmartSite inspect for our gold Bastrop test parcel and audited all fifteen atom families for map/inspect/Command Center honesty. The audit showed Command Center was correctly unchanged (scorers not built yet) and that most Texas parcels outside gold return empty fact chains. Separately we discovered our appraisal roll database covers only **15 counties** while we have geometry for **196** and have already probed **~1,000 CAD field names** statewide without ingesting them. Six major metros (~3.3M parcels) have owner and value from a lightweight state parcel zip but **zero square footage or year built** because we never loaded the counties' real CAMA bulk exports. Operator priority: **get structural fields** and **make CAD data consistent** across geometry, roll table, and atoms — in parallel with (not instead of) finishing surface scorers and map layers.

---

## 10. Thesis planner responses (2026-08-22) — complete

Governing context: `19_the_instrument_contract.md`. Decision: `_decisions/2026-08-22_thesis_planner_parcel_gap_rulings.md`. Integration: `_inbox/2026-08-22_thesis_planner_reply_integration.md`. Verdict WDLL: `_inbox/2026-08-22_verdict_layer_serve_WDLL.md` (**operator authorized**).

| # | Ruling / recommendation | Execution |
| --- | --- | --- |
| 1 | Verdict before data (`lookup-failed` / `not-applicable` / `absent-verified`) | **P-63 dispatch** — property seat |
| 2 | CAD consistency = identity aliases + lineage | Track A prerequisite |
| 3 | Lenses not field lists (Q1) | Recommendation |
| 4 | Harvest = authority+class per field (Q5) | Ruling — lens-ordered capture |
| 5 | Prioritize capture by lens (structural → tenure → easements) | Ruling |
| 6 | Inspect/manifest divergence check required | Add to surface program |
| Q2 | Parcel record ≠ zoning reasoning; opposite coverage shapes | Recommendation — GTM |
| Q4 | DEED_DATE harvest now; tenure yes, comps no | Recommendation |
| Q6 | Federated custody pitch; property ≠ unified access yet | Recommendation |

**P-59:** plumbing parallel; scorer semantics **blocked** until verdict fields live (read verdict as input, not boolean).

**Open:** minting monetization (free / freemium / metered per node) — doc 19 unsettled; not solved this session.

**Not relitigated:** §7 confirmed by thesis planner.
