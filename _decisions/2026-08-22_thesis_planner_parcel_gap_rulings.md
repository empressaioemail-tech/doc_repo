---
decision_id: 2026-08-22_thesis_planner_parcel_gap_rulings
date: 2026-08-22
owner: operator (via business / thesis planner session)
status: active
related_canonical:
  - 19_the_instrument_contract.md
  - _inbox/2026-08-22_planner_handoff_business_thesis_agent.md
  - _inbox/2026-08-22_parcel_public_facts_gap_matrix.md
  - 08_tiered_access_model.md
  - 80_adrs/adr_011_atom_identity_across_versions
  - _decisions/2026-08-22_atom_layering_target_state
  - _decisions/2026-08-22_verdict_serve_operator_go.md
---

## Decision

Thesis planner session 2026-08-22, governing context `19_the_instrument_contract.md` (ratified same day; supersedes `77_place_graph_strategy` as north star).

### Rulings (active)

1. **Verdict before data.** Replace HTTP 200 empty fact chains with typed layer absence verdicts (`absent-verified`, `lookup-failed`, `not-applicable`) carrying `authority`, `scopeSearched`, `asOf`, and `basis`. Metro structural gaps where CAMA export exists but is not loaded are **`lookup-failed`**, not silence. Unincorporated land with no zoning authority is **`not-applicable`**, not zero. Ships in serve layer first; needs no CAMA rows. **Operator authorized** (`_decisions/2026-08-22_verdict_serve_operator_go.md`).

2. **CAD consistency is identity, not tier stamps.** One opaque parcel node; `txgio` key, CAD `prop_id`/`geo_id`, and atom `entity_id` are **aliases** with `validFrom`/`validTo` and merge/split lineage. Enforce id shape at write. Track A continues; goal unreachable without this.

3. **Harvest fields are authority decisions, not inventory.** The harvest ruling stands. Under doc 19 each field lands as a conforming atom (named authority + provenance class) or unbound at level one with claim absent and typed. Unclassified harvest is liability, not backlog rows. Real cost of ~1,088 fields is ~1,088 authority-and-class decisions.

4. **Prioritize capture by lens, not field count.** Structural blocks valuation/feasibility. `DEED_DATE` blocks tenure. Easements block siting (`utility-easement` ships with zero rows). Pick the lens to sell; capture what it requires; let the rest wait.

5. **Inspect/manifest divergence is a defect class.** Decision that CC ≠ inspect (manifest moves only on scorers) is correct but allows indefinite drift. Add a check that fails when a family is served on inspect and scored zero on manifest beyond a stated window (same class as flood present on inspect / absent on compare).

### Recommendations (not ratified — operator disposition pending)

| Topic | Recommendation |
| --- | --- |
| §3 Q1 — Layer 1 | Tiers are **lenses**, not field lists. Layer 1 free = identity lens. Structural = different lens, different price. |
| §3 Q2 — parcel record vs zoning | **Two lenses**, opposite coverage shapes. Sell separately; do not let statewide parcel narrative imply statewide zoning reasoning. Low zoning coverage = wiring gap; unincorporated = `not-applicable`. |
| §3 Q4 — DEED_DATE | Harvest now, serve later. Class Record, authority county recorder — not part of 1,088-field liability. **Do not scope comps on it:** Texas non-disclosure; deed date gives tenure/chain/frequency, not price. |
| §3 Q6 — two-store enterprise pitch | **Strength:** federated custody — your bytes in your store, we hold id + meter, never see bytes, caller credential is theirs. Markets union is proof (CI-gated, no pool). Property path: say **federated custody**, not unified access (MCP gate has no Smart Files path today). |
| P-59 parallel | Yes on plumbing; **scorers read verdict as input**, not boolean. Semantics cannot ship before verdict exists. |
| Minting monetization | **Open** — doc 19 says give away mint, charge for join; whether minting is free, freemium, or metered per node is not settled. Not solved this session. |

## Context

Integration planner filed `_inbox/2026-08-22_planner_handoff_business_thesis_agent.md` after P-57/P-58 audit and statewide parcel gap analysis. Thesis planner confirmed handoff accuracy; declined to relitigate §7.

## Reversal criteria

See individual items in original filing; verdict-first ordering reverses if serve cannot distinguish verdicts without upgrading in transit.

## Counterparties

Operator (Nick). Property seat: verdict serve + P-59 plumbing. Substrate: gate contract. Planner: OPS-16 P-63 amendment, inspect/manifest divergence instrument.
