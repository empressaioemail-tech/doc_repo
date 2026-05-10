---
id: 2026-05-10_codex_launch_claude_ai_planner
title: Codex launch — fabric thesis, two ADRs, vocabulary cross-mapping
date: 2026-05-10
agent: claude-ai-planner
repo: doc_repo
session_type: doc_framing
status: active
rolled_up: true
rolled_up_into: [05_living_lineage_thesis, 06_cities_value_narrative, 47_codex_plan_review, adr_007_cross_stakeholder_atom_access, adr_008_engine_factor_out, 30_smartcity_os, 40_design_accelerator, 41_revit_connector, 25_atom_architecture_reference, 26_atom_upgrade_guide, adr_001_atom_architecture, 02_doc_migration_plan, 14_pricing_framework, 11_roadmap, 12_migration_sprint]
---

# Codex launch — fabric thesis, two ADRs, vocabulary cross-mapping

Single-day end-to-end framing session: pre-docs-repo Plan Review Amplifier addendum (47b) reconciled into canonical doc_repo as Codex; living lineage elevated from one differentiation leg to governing thesis for the portfolio; construction-lifecycle fabric framing made customer-facing; engine named Hauska Engine; cross-stakeholder atom access settled as ADR-007; engine factor-out settled as ADR-008; vocabulary cross-mapping for M4-B / PLR-* / SD-* / W*-* settled as option-b hybrid pending `33_*` sub-doc.

## TL;DR

- **5 new docs landed** in commit `822dd1b`: living lineage thesis (`05_*`), cities value narrative (`06_*`), Codex product home (`47_*`), ADR-007 cross-stakeholder atom access, ADR-008 Hauska Engine factor-out
- **1 fabric overview SVG** at `80_adrs/diagrams/fabric_overview.svg`, referenced from both ADRs
- **7 existing-doc updates** in `822dd1b`: Design Accelerator product home, atom architecture reference, ADR-001, doc migration plan, SmartCity OS product home, pricing framework, roadmap
- **Housekeeping Pass A** (`48d43a7`): 5 docs cross-refed and Hauska Engine renamed (10/12/26 oversight, 40/41 engine renaming) — was originally 6 docs; audit subagent conflated 10_ground_truth.md with 11_roadmap.md, redirected during execution
- **Housekeeping Pass B** (`eb48911`): SmartCity OS doc M4-B paragraph reframed as M4-B → Codex 1b, Suite table row updated, Compass AI federated-knowledge cross-ref to cities narrative
- **Plan Review Amplifier renamed to Codex** as canonical product name. Feature waves renumbered AMP-* → CDX-* with priority restructured to commercial-wedge-first

## Inputs

- doc_repo orientation: targeted recon on design tools / AI plan review surface produced via courier (returned `11_roadmap.md`, `12_migration_sprint.md`, `40_design_accelerator.md`, `41_revit_connector.md`, ADR-001, recent session summaries, customer-zero observations doc)
- Pre-docs-repo `47b_plan_review_amplifier_addendum.md` content pasted mid-session — the source for Codex feature roadmap, two of the three architectural pivots, and the open-decisions list
- Nick's framing additions in conversation: outsourcing-trend driver, sales-cycle driver, fabric framing as customer-facing, living lineage as the deep value proposition, city-to-city knowledge sharing extension to the conversational primitive, PropTech ecosystem partner network as future fabric consumers
- Audit subagent report (Stage 5 of `822dd1b` dispatch) identifying 6 docs needing alignment updates
- Recon report on `30_smartcity_os.md` (Pass B prep) revealing M4-B/PLR/SD/W vocabulary lives in one compressed paragraph, not enumerated lists

## Outputs

### Three commits landed

**`822dd1b` — Plan review framing batch.** Plan-review-product framing landed as canonical doc_repo material. Five new docs, one SVG, seven existing-doc updates. Truncation at 50k characters during initial dispatch required a continuation prompt for ADR-008 + SVG + existing-doc updates; agent caught the truncation and halted before edits.

**`48d43a7` — Housekeeping pass A.** Cross-refs and engine renames per audit findings: Codex 1b cross-ref on M4-B kickoff item in roadmap, ADR-008 cross-ref on migration sprint Phase 2C closeout, ADR-007 cross-refs in atom upgrade guide prerequisite reading + scope-awareness section, Hauska Engine rename in Design Accelerator briefing engine section, Hauska Engine + Codex naming in Revit Connector strategic frames. Audit subagent conflated `10_ground_truth.md` with `11_roadmap.md` for the M4-B reference; agent halted Stage 2A per hard limit, planner redirected.

**`eb48911` — Housekeeping pass B.** SmartCity OS doc reframed: M4-B paragraph re-titled as M4-B → Codex 1b, "70/30 Bluebeam replacement" framing superseded by 1a/1b hybrid, W1-W6 wave order yields to CDX-* commercial-wedge-first, Suite table row updated with Codex naming + cross-ref, Compass AI federated-knowledge paragraph extended with cities narrative cross-ref.

### Doc repo additions

- `05_living_lineage_thesis.md` — strategic foundation; property as first-class durable entity; thesis governs every product decision
- `06_cities_value_narrative.md` — Sylvia / city-manager facing positioning; three pillars (faster review, findings as operational data, decades-spanning property records); city-to-city knowledge sharing called out as named feature
- `47_codex_plan_review.md` — Codex product home; supersedes pre-docs-repo `47_plan_review_amplifier_features.md` and `47b_plan_review_amplifier_addendum.md`; renamed AMP-* → CDX-*; reorganized feature waves to commercial-wedge-first sequencing; PropTech ecosystem partners noted as downstream consumers
- `80_adrs/adr_007_cross_stakeholder_atom_access.md` — property-as-tenant-of-record model; stakeholder access scopes; cross-tenant references; ownership transfer as chain event
- `80_adrs/adr_008_engine_factor_out.md` — Hauska Engine name; Hauska commercial brand placement; `hauska-engine` repo target; factor-out sequenced after migration sprint Phase 2C
- `80_adrs/diagrams/fabric_overview.svg` — fabric overview diagram embedded by both ADRs

### Doc repo updates

- `40_design_accelerator.md` — `plan-review` artifact reframed as Codex window in incremental mode; cross-refs added; Briefing engine section retitled to Hauska Engine with body updated to reference ADR-008
- `25_atom_architecture_reference.md` — Commitment 2 paragraph appended with cross-refs to thesis and ADR-007
- `80_adrs/adr_001_atom_architecture.md` — Commitment 2 sentence appended with thesis cross-ref; References section extended with ADR-007 + ADR-008 + thesis
- `02_doc_migration_plan.md` — pre-docs-repo migration entries added: 47, 47b superseded by `47_codex_plan_review.md`; 01, 02, 04, 33, 45, 46, 51 queued
- `30_smartcity_os.md` — fabric framing paragraph + Bastrop property intelligence enhancement item + cross-refs section + M4-B paragraph reframe + Suite table row Codex update + Compass AI cross-ref
- `14_pricing_framework.md` — cross-surface pricing pending section
- `11_roadmap.md` — Codex Wave 1 in P2, Bastrop property intelligence in P2, Hauska Engine factor-out sprint in P3, Codex 1b standalone in P3, PropTech ecosystem partner outreach in P3; references section extended with new docs; M4-B kickoff item annotated with Codex 1b cross-ref
- `12_migration_sprint.md` — Phase 2C closeout bullet for engine factor-out unblock; references extended with ADR-008
- `26_atom_upgrade_guide.md` — prereq reading converted to bullet list with ADR-007; §2.4 paragraph extended with ADR-007 cross-ref
- `41_revit_connector.md` — strategic frames "same engine, two sides" updated with Hauska Engine + Codex 1a/1b; cross-refs section extended

## Decisions made in session

1. **Living lineage as governing thesis** — elevated from one differentiation leg (corpus + adaptability + multi-surface) to the strategic foundation; the fabric is the architectural what, lineage is the strategic why
2. **Construction-lifecycle fabric as architectural framing** — multi-stakeholder atom graph; stakeholders are surfaces, atoms are substrate, atom contract is connective tissue
3. **Fabric framing customer-facing, not strategic-only** — sales narrative explicit, network effects called out, defensibility through institutional-knowledge lock-in
4. **Reviewer as central node** — highest-network-density stakeholder; an amazing reviewer experience pulls demand through the entire fabric
5. **Engine name = Hauska Engine** — preserves v1.3 ownership correction (atom contract is Empressa) while putting engine in Hauska commercial layer for substrate sale
6. **Engine repo target = `hauska-engine`** in `empressaioemail-tech` org (moves with Hauska Inc. org migration when that closes)
7. **Engine brand = Hauska commercial layer** — SDK + Engine + atom contract under Hauska; Empressa for product surfaces; "powered by Hauska Engine" pattern for substrate visibility
8. **Engine factor-out timing = post-migration-sprint Phase 2C** — avoid Track B saga pattern of stacking structural refactor on infrastructure migration
9. **Cross-stakeholder atom access = property-as-tenant-of-record** with stakeholder scoped access — graph-traversal lineage instead of integration aggregation
10. **Plan review product name = Codex** — replaces "Plan Review Amplifier"
11. **Hybrid deployment (1a invited + 1b standalone)** — covers full ICP without forcing customers to choose
12. **1a-first sequencing** — commercial wedge ships before city activation (was equal in addendum)
13. **CDX-* feature priority restructured to commercial-wedge-first** — Wave 1 invited foundation → Wave 2 city activation → Wave 3 moat-grade compounding → Wave 4 versatility → Wave 5 fabric play
14. **Engine factor-out as own ADR (ADR-008)** — not folded into any product sprint; dedicated decision
15. **Vocabulary cross-mapping = option (b) hybrid** — keep M4-B / PLR-* / SD-* / W*-* SmartCity-internal vocabulary alongside CDX-*; per-item mapping deferred to `33_*` sub-doc when written; preserves coordination headroom with parallel SmartCity OS planning sessions
16. **SD-1's "70/30 Bluebeam replacement" superseded** by 1a/1b hybrid framing — we don't replace Bluebeam, we serve both ICPs (1a invites in, 1b serves customers without it)
17. **Audit subagent error redirect (`10_ground_truth.md` → `11_roadmap.md`)** — Codex cross-ref applied to actual M4-B reference location

## Lessons / patterns established

- **50k character limit on courier prompts** — long initial dispatches with multiple full docs inline must be split or sent as continuation prompts. Encountered when initial batch dispatch truncated mid-ADR-008; agent caught and halted; planner sent continuation
- **Audit subagents can conflate doc references** — verify file references against actual content before drafting edits. Caught `10_ground_truth.md` vs `11_roadmap.md` mistake during Pass A Stage 2A
- **Hybrid vocabulary mapping (option b) preferred over full retirement** — less coordination friction with parallel agent sessions, preserves SmartCity-internal milestone aggregates that have meaning beyond surface naming, allows graceful migration if vocabulary becomes net-cost
- **Recon-before-decide pattern** — when audit flags substantive rework, recon actual content before drafting cross-mapping. PLR-* / SD-* / W*-* turned out NOT to be enumerated in `30_smartcity_os.md`, simplifying Pass B significantly
- **Find/Replace pattern for str_replace edits** when verbatim text known; "locate the section" pattern with halt-and-flag escape hatches when not. Both worked under hard limit "if exact text doesn't match, stop and report"
- **Stage 5 audit task as standard pattern** — read-only audit after canonical commit lands, identifies follow-up housekeeping. Cleaner than mid-edit alignment checks; produces structured housekeeping queue
- **Pass A / Pass B split for housekeeping** — simple cross-refs and renames in one pass (5 docs in `48d43a7`), substantive rework requiring vocabulary decisions in second pass (`eb48911`). Avoids stacking coordination calls in one dispatch

## Outstanding from this session (handed forward)

### Deferred to `33_*` sub-doc (when written or migrated)
- Per-item cross-mapping of M4-B / PLR-1..28 / SD-1..SD-8 / W1-W6 vocabulary to CDX-* feature structure
- Detailed wave-by-wave specs for the Codex 1b city-side activation in SmartCity OS Plan Review surface

### Pre-docs-repo migrations queued (in `02_doc_migration_plan.md`)
- `01_current_state_ground_truth.md` (different numbering convention from current `10_ground_truth.md`)
- `02_architecture_reference.md` (partial overlap with `25_atom_architecture_reference.md`)
- `04_strategic_conversation_record.md` (already archived in `_sessions/archived/`; formal retirement)
- `33_hauska_sdk_roadmap.md` (high-priority — gates CDX-15 audit trail)
- `45_smartcity_multitenancy_spec.md` (queued as ADR-005; now also extends per ADR-007)
- `46_smartcity_parcel_intelligence.md` (relevant to Bastrop property intelligence + CDX-6)
- `51_design_accelerator_parcel_intelligence.md` (relevant to engine factor-out)

### Open Codex GA decisions
- Brand publication
- Pilot firm selection
- Firm tenancy schema ADR (extends ADR-005 multitenancy + ADR-007)
- Bluebeam ToS interpretation
- Pricing publication
- Comment-letter training data legal handling
- Code licensing economics escalator
- Conflict-of-interest controls
- Bluebeam Max competitive positioning

### Verifications outstanding for Codex Wave 1
- Bluebeam Studio Project participant flow test
- Bluebeam markup writeback as participant
- Acrobat Shared Reviews FDF roundtrip
- ProjectDox / Avolve API access path
- Bluebeam Max teardown when GA
- Tyler Technologies plan-review AI capability scan
- Sylvia interview on skill-level pain points
- Reviewer day-in-life observation at one pilot firm
- Director QBR conversation at one pilot firm
- Hauska SDK gap closure timeline (gates CDX-15)
- Multi-surface coherence test design
- Atom graph performance at firm-tenant scale

### Coordination
- The parallel agent set working SmartCity OS uses pre-docs-repo project knowledge taxonomy. Hybrid mapping (option b) preserves their working vocabulary; periodic sync recommended. Consider establishing a courier pattern from that planning context into doc_repo so both planner sessions write into the same canonical structure
- ADR-005 (multitenancy) and ADR-006 (anchoring substrate) still queued for migration / drafting; ADR-007 and ADR-008 landed at next slots without collision

### Sprint plans to draft
- Engine factor-out sprint plan — to be drafted when migration sprint Phase 2C closes
- Codex Wave 1 (1a invited foundation) sprint plan — to be drafted as separate sprint doc once migration close + Bluebeam ToS verification complete
- Bastrop property intelligence enhancement scope — to be expanded after current Bastrop housekeeping clears (queued P2)

### Forward-looking items pinned
- PropTech ecosystem partner outreach gated on engine factor-out + ADR-007 landing
- Empressa-as-Codex-1a customer-zero candidate (eats own dog food across DA + Codex)
- Inspector surface as next stakeholder product after Codex stabilizes
- Owner / developer surface and AHJ regulator surface as further-future stakeholders

## References

- New docs landed this session: `05_living_lineage_thesis.md`, `06_cities_value_narrative.md`, `47_codex_plan_review.md`, `80_adrs/adr_007_cross_stakeholder_atom_access.md`, `80_adrs/adr_008_engine_factor_out.md`
- Diagram: `80_adrs/diagrams/fabric_overview.svg`
- Existing docs updated this session (across 3 commits): `40_design_accelerator.md`, `25_atom_architecture_reference.md`, `80_adrs/adr_001_atom_architecture.md`, `02_doc_migration_plan.md`, `30_smartcity_os.md`, `14_pricing_framework.md`, `11_roadmap.md`, `12_migration_sprint.md`, `26_atom_upgrade_guide.md`, `41_revit_connector.md`
- Three commits: `822dd1b` (initial batch), `48d43a7` (housekeeping pass A), `eb48911` (housekeeping pass B)
- Predecessor pre-docs-repo material superseded: `47_plan_review_amplifier_features.md`, `47b_plan_review_amplifier_addendum.md`
- Agent operating rules in force: `20_agent_operating_rules.md` (HR-7 three-failure rule, HR-8 verbatim verification artifacts, halt-and-flag pattern when prompts collide with reality — earned their place when audit subagent conflation surfaced and 50k limit truncated initial dispatch)
