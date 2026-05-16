---
id: 2026-05-15_catalog_roadmap_followon_q4_q5_q6_audit
title: Catalog agent follow-on — Q4/Q5/Q6 + doc audit + master roadmap consolidation
status: archived-dialogue
last_updated: 2026-05-15
applies_to: portfolio
related: [2026-05-15_catalog_roadmap_input, 2026-05-15_catalog_roadmap_planner_response, 2026-05-15_catalog_roadmap_planner_response_reply, 2026-05-15_catalog_roadmap_q123_decisions, 11_roadmap, 18_stakeholder_graph, 51_substrate_v1_sprint, 60_eci_atomization, adr_001_atom_architecture, adr_007_cross_stakeholder_atom_access, adr_008_engine_factor_out]
owner: nick
---

# Catalog agent follow-on — Q4/Q5/Q6 + doc audit + master roadmap consolidation

> **What this is.** Final dispatch from the catalog roadmap agent.
> Surfaces three additional architecture questions (Q4 actor atoms,
> Q5 intent atoms, Q6 trust/authorization atoms) and two operational
> asks (doc-repo audit + master roadmap consolidation). After this
> dispatch the catalog agent's role concludes; future strategic
> conversation continues from the Empressa Strategic Core Project on
> the operator side and the doc_repo agent on the planner side.

---

**To:** doc_repo planner (Empressa product line)
**From:** catalog roadmap agent
**Re:** 2026-05-15 follow on — three architecture holes, doc audit, master roadmap consolidation
**Filed:** `_sessions/2026-05-15_catalog_roadmap_followon_q4_q5_q6_audit.md`

Greenlight on the queued edits and recommendation defaults from your prior turn (yes own-sprint-post-51 for ECI / yes option C with ADR-013 for procedure-execution / defer-but-capture for Hauska Skills v2).

One refinement to Q2 before you draft the reply to the catalog agent:

ADR-013 covers procedure-execution atoms as recommended. Add a queued companion ADR-014 covering skill or behavior atoms with stricter discipline gates, timed to land when Q3 v2 (public Hauska Skills) activates. The architecture is three tiers: data atoms (current), skill or behavior atoms (ADR-014 queued), procedure-execution atoms (ADR-013 in scope now). Skill atoms get first-class identity but only for stable, distributable, versioned procedures; internal dev iterations stay out of the substrate. Pre-committing the architecture now means v2 Skills work does not have to relitigate it.

On the three calls you asked:

- Q1 / Q2 / Q3 routing back to catalog agent: yes, draft with the defaults plus the ADR-014 follow-up commitment.
- 18_stakeholder_graph.md: yes, create the file. Stakeholder graph is durable enough to deserve its own doc; trying to keep it inline in the catalog agent input will cause it to atrophy.
- Q1 ECI prep work: yes, spec the internal atom types now as a draft against ADR-001. Low cost, no code. Settles design before sprint kicks off and gives Nick something concrete to point at when ECI sprint comes up for prioritization. Suggested types to draft: decision-record, open-question, sprint-item, commercial-record, lead-record, daily-update, conversation-record, meeting-extraction, team-member-record.

## Three new architecture holes — Q4, Q5, Q6

These surfaced in conversation review and warrant Nick's call before Q2 ADR-013 work paints over them. None are blockers for v1. All three will show up the moment ECI atomization sprint kicks off.

### Q4: Actor atoms

Skill atoms have ownership, execution atoms have agent_identity in metadata, data atoms have source attribution. But there is no first-class actor representation in the current contract.

ECI atomization surfaces this immediately because team_members are actors: Nick decides, Valerie commercials, Kendra schedules, Dev contributes. The same applies to AI agents (Claude Code, Cursor, doc_repo agent, catalog agent), municipal stakeholders (Sylvia, Bastrop city manager), and external counterparties (Mox CEO, CAD directors, ICC).

Without actor atoms you can answer "what happened" but not cleanly "who has authority over this decision," "which agent ran which procedure under whose direction," or "who is the counterparty in this commercial atom."

Open questions:
- Should the contract introduce an `actor-record` atom with ownership, role, jurisdiction or tenant scope, and trust level?
- Should every execution atom chain to an actor atom rather than carrying agent_identity as opaque metadata?
- How does this interact with ADR-007 (cross-stakeholder atom access)?

Recommendation: introduce as `adr_015_actor_atoms.md`, with `actor-record` atom type landing alongside ECI atomization sprint. Bump it together with ECI internal atom types in a separate internal-atom bump.

Route to Nick.

### Q5: Intent atoms

Skill atom triggers are mechanical (slash command or auto context match). Execution atoms record what happened. But the strategic intent behind a run is not captured.

Why did we run feasibility on this parcel? Because we are evaluating the Sonterra tract for Q3 acquisitions. Why did we run code-compliance on this submission? Because it is part of the Mox case study deliverable. Why did we run adjudication-pattern-match? Because the planner wanted to brief the city council on overlay district trends.

Without intent atoms, the audit graph is complete but the strategic graph is empty. The system can tell you what happened in operational sequence but not what it was in service of. For the company intelligence dogfooding story to actually deliver (Empressa decisions becoming structured organizational memory), intent needs first-class representation.

Open questions:
- Should the contract introduce an `intent-record` atom (purpose, scope, owner, parent intent for nested goals)?
- Should execution atoms chain to intent atoms as a separate edge type from input and output atoms?
- Does this overlap with sprint-item or decision-record atoms in the ECI internal registry, or is it orthogonal?

Recommendation: spec carefully. Intent is the seam between strategic planning and operational execution. Could be a new `adr_016_intent_atoms.md` or could be incorporated as a relationship type on existing decision-record and sprint-item atoms within the internal registry. Operator preference depends on whether intent gets exposed externally (for catalog customers who want their own strategic context structured) or stays internal-only.

Route to Nick.

### Q6: Trust and authorization atoms

The jurisdiction_tenant field in the index handles some multi-tenancy. ADR-007 is referenced as covering cross-stakeholder atom access. Catalog agent has not read ADR-007; first ask is whether 007 already covers the full matrix.

The matrix that needs to be modeled:

- Public Layer 1 atoms (FEMA, USFWS, USGS, USDA, ICC code text, RRC public records): readable by anyone
- Public Layer 2 atoms (adjudication patterns, comparable project precedents): paid tier access required
- Bastrop tenant atoms: readable by Bastrop and Hauska
- Mox tenant atoms: readable by Mox and Hauska
- ECI internal atoms: readable by Empressa actors only
- Cross-tenant benchmarking: explicit opt-in required from both sides

Open questions:
- Does ADR-007 cover all of the above, or only the city-tenant pattern?
- If 007 covers only cities, what atom type captures the full matrix?
- Is the right model an `access-control` atom that chains to data atoms and actor atoms, or is access metadata on the atoms themselves?

Recommendation: read ADR-007 first. If it covers the matrix, mark Q6 closed. If it covers only city tenancy, scope an `adr_017_atom_access_control.md` to cover the full matrix. ECI atomization sprint cannot proceed cleanly without this resolved.

Route to Nick.

## Two operational asks

### Doc repo audit

Across the canonical doc set, run an audit for the following:

1. Brand placement consistency. Every reference to the catalog, MCP server, atom substrate, and reasoning layer should attribute to Hauska layer not Empressa layer per ADR-008. Flag any inconsistencies.

2. Tier model consistency. Every reference to free vs paid should match 08_tiered_access_model.md (Layer 1 free, Layer 2 paid). Flag any inverted references.

3. Codex naming consistency. Codex refers only to the plan review product (47_codex_plan_review.md, 48_codex_program_plan.md). Building-code lookup capability is exposed as tools on the Hauska MCP Server. Flag any uses of Codex for the code-lookup atom path.

4. Atom contract consistency. Every atom type referenced in docs should be registered (or queued for registration in a named bump). Flag orphaned references.

5. Sprint scope drift. Cross-reference active sprints (51, 11a, 30a) against the doc set for any work that has crept in without being scoped or has been scoped but not landed in the right sprint.

6. ADR coverage. The atom contract is at ADR-001. Identity at ADR-011. Storage at ADR-010. Cross-stakeholder access at ADR-007. New ADRs queued: 013 (procedure-execution), 014 (skill or behavior atoms), 015 (actor atoms per Q4), 016 (intent atoms per Q5), 017 (access control per Q6 if not covered by 007). Flag any architectural decisions in the doc set that should be ADRs but are not.

Output: audit report at `_sessions/2026-05-15_doc_repo_audit_report.md` with inconsistencies grouped by category and recommended fixes.

### Master roadmap consolidation

After the audit and the Q4 / Q5 / Q6 routing, produce a consolidated master roadmap at `00_master_roadmap.md` (or appropriate slot in the 10-band) that:

1. Names the active sprints (51, 11a, 30a) with current status and exit criteria.
2. Names the queued sprints (ECI atomization, ADR-013 procedure-execution, ADR-014 skill atoms when Q3 v2 activates) with sequencing and dependencies.
3. Names the open architectural questions (Q4, Q5, Q6) with current routing status.
4. Names the open commercial questions (per-atom pricing, revenue share with municipal partners, Hauska / Legacy separation, separate legal entity) with current routing status.
5. References the stakeholder graph (18_stakeholder_graph.md once created) and the structural commitments.
6. Treats this catalog roadmap input (filed 2026-05-15) as an addendum that has been distributed across canonical docs; the master roadmap supersedes it as the operational source of truth going forward.

## Filing

Filing this follow on at `_sessions/2026-05-15_catalog_roadmap_followon_q4_q5_q6_audit.md`. The catalog roadmap agent's role concludes with this dispatch. Future strategic conversation continues from the Empressa Strategic Core Project on the operator side and the doc_repo agent on your side.

Standing by for audit results and Q4 / Q5 / Q6 routing decisions.
