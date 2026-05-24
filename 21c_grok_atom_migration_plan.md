---
id: 21c_grok_atom_migration_plan
title: Grok + atom-first fleet migration plan
status: active
last_updated: 2026-05-24
applies_to: portfolio
related: [01a_atom_conventions, 20_agent_operating_rules, 21_ai_first_dev_flow, 21b_cursor_workflow_observatory, 25a_atom_principle_llm_economics, _decisions/2026-05-23_grok_atom_fleet_migration, 00_current_state, CLAUDE.md]
owner: planner
---

# Grok + atom-first fleet migration plan

Reconciliation plan for migrating the agent fleet from heavy Claude usage to Grok (xAI) plus atom-first context retrieval. Produced 2026-05-23 per operator request. Decision: [`_decisions/2026-05-23_grok_atom_fleet_migration.md`](_decisions/2026-05-23_grok_atom_fleet_migration.md).

## Executive summary

**Phase 1 (this session, filed):** HR-12, `01a_atom_conventions.md`, decision record, this plan, `00_current_state` watch entry.

**Phase 2 (next planner session, ~2-4 hours):** Refresh `21_ai_first_dev_flow.md`, `00_README.md`, `00b_doc_repo_guide.md`, `CLAUDE.md` stakeholders line, dispatch boilerplate, `21b` observatory model note.

**Phase 3 (ongoing, ~1 week operator + agents):** Cursor xAI config on all workstations; Grok default on cc-agents; atom refs in new dispatches; optional `EMPRESSA_ATOM_FIT` merge into `25a` or ECI registry.

**Not in scope:** Changing Cortex production LLM call sites (Anthropic Sonnet in finding/briefing/chat engines per [`_research/2026-05-23_cortex_ai_model_inventory.md`](_research/2026-05-23_cortex_ai_model_inventory.md)). That is product runtime, not agent fleet.

---

## Documents that need updating

| Doc | Specific change | Phase | Effort |
|---|---|---|---|
| [`21_ai_first_dev_flow.md`](21_ai_first_dev_flow.md) | Replace `cc-agent-1..4` and "Cursor Claude Code" as default with named fleet (C, C2, E, R, M, AC) + Grok models per HR-12; note planner may be Grok in Cursor or Claude Code in doc_repo during transition; update "Claude.ai planner non-executing" to "doc_repo planner executes commits" per 21b | 2 | 45 min |
| [`00_README.md`](00_README.md) | Line 14-15 agent list; orientation order add `01a_atom_conventions` | 2 | 15 min |
| [`00b_doc_repo_guide.md`](00b_doc_repo_guide.md) | Planner row: Grok-capable Cursor + atom-first; link HR-12 | 2 | 15 min |
| [`CLAUDE.md`](CLAUDE.md) | Stakeholders: "four Cursor Claude Code" → "Cursor Grok agents (cc-agent-*)"; add Grok+Atom transition pointer under open or settled as appropriate | 2 | 20 min |
| [`18_stakeholder_graph.md`](18_stakeholder_graph.md) | AI agents row: Grok + Claude escalation, not Claude-only | 3 | 10 min |
| [`09_post_saas_substrate_thesis.md`](09_post_saas_substrate_thesis.md) | Lean operator paragraph: claude.ai + Claude Code → Grok-first fleet | 3 | 10 min |
| [`11_roadmap.md`](11_roadmap.md) | Owner notation "Cursor Claude Code" → "Cursor cc-agent (Grok)" | 3 | 10 min |
| [`10_ground_truth.md`](10_ground_truth.md) | Recon agent labels (historical sections): add footnote that fleet is Grok post-2026-05-23 | 3 | 15 min |
| [`90_runbooks/session_close_template.md`](90_runbooks/session_close_template.md) | Session close: list atom refs touched; note Grok model if logged | 2 | 20 min |
| [`01_doc_conventions.md`](01_doc_conventions.md) | Optional: add `01a` to band 00 examples; allow `grok` in agent tag taxonomy later | 3 | 15 min |
| [`_dispatches/*.md`](_dispatches/) | New dispatches only: `Read first (atoms)` block + HR-12 model line; do not bulk-edit 48 historical dispatches | 2+ | incremental |
| [`21b_cursor_workflow_observatory.md`](21b_cursor_workflow_observatory.md) | Add § "Model layer (2026-05-23)" — local transcripts still lack telemetry; HR-12 is policy until dashboard export | 2 | 15 min |
| [`25a_atom_principle_llm_economics.md`](25a_atom_principle_llm_economics.md) | Cross-link `01a` for doc_repo catalog atoms | 2 | 5 min |

---

## Documents to deprecate or supersede

| Doc / pattern | Action | Notes |
|---|---|---|
| Browser Claude.ai planner as **primary** executor | **Supersede in practice**, not delete | `21` still describes browser planner; `21b` documents doc_repo Claude Code as executing planner. HR-12 does not ban browser planner for ad-hoc strategy, but fleet default is Grok in Cursor. |
| `13_agent_operating_rules` | Already superseded | No action |
| External `EMPRESSA_ATOM_FIT.md` | **Not in repo** | Map to `01a` + `25a`; create `26b` or ECI package doc only if code registry needs it |
| "Read `00_current_state` verbatim" as sole dispatch open | **Soft supersede** | Replace with atom list + targeted sections; keep full `00` read for planner session start only |
| User-rules "grok-code-fast-1 style" in Cursor | **Align** | Already consistent with HR-12; ensure global Cursor rule pasted (operator settings, not committed) |

---

## Conflicts (existing docs vs new direction)

| Conflict | Severity | Resolution |
|---|---|---|
| `20` SR-1 / HR-2: "Cursor Claude Code for code that ships" | Medium | HR-12 v2.2 supersedes model vendor, not push discipline. Edit SR-1 in Phase 2 to "Cursor cc-agent (Grok default)". |
| `20` agent taxonomy table: "Cursor Claude Code (4 instances)" | High | Update table in Phase 2; names are C/C2/E/R not 1-4 |
| `21` "6 agents + Nick" vs `21b` named fleet + two planners | Medium | Reconcile counts in `21` refresh; ~7 seats unchanged |
| `00_README` "agents never edit canonical docs" vs `CLAUDE.md` planner commits | Low | Already dual pattern; `00b` explains; no Grok conflict |
| `CLAUDE.md` "four Cursor Claude Code engineering agents" | High | Phase 2 edit |
| `51_substrate_v1_sprint` Stream 2D: "Claude Code config" quickstart | Low | Add Grok/Cursor xAI quickstart alongside; commercialization client matrix still lists Claude Desktop as MCP **client**, not agent model |
| ADR-013 / ADR-015: "Claude Code, claude.ai" as actor examples | Low | Add "Grok cc-agent" as actor type in Phase 3 ADR touch or leave as historical examples |
| `_research/2026-05-23_cortex_ai_model_inventory` | None | Product Anthropic IDs stay; footnote that agent fleet ≠ product LLM |
| Premortem / catalog skills | None | No model vendor assumptions |
| Operator user rule "Prefer grok-code-fast-1" | None | Aligned |

---

## Prioritized rollout

### Phase 1 — Policy filed (2026-05-23)

- [x] [`_decisions/2026-05-23_grok_atom_fleet_migration.md`](_decisions/2026-05-23_grok_atom_fleet_migration.md)
- [x] [`01a_atom_conventions.md`](01a_atom_conventions.md) (slot `01a`; `01` reserved for doc conventions)
- [x] [`20_agent_operating_rules.md`](20_agent_operating_rules.md) HR-12
- [x] This plan
- [x] `00_current_state` watch entry
- [ ] Operator: paste global Cursor rule (below) into Cursor Settings → Rules
- [ ] Operator: configure xAI base URL + disable non-Grok models per workstation

**Global Cursor rule (operator paste, not repo-committed):**

```markdown
You are a precise, execution-focused engineer working on the Empressa / Hauska portfolio.

Core principles:
- Atom-first: Resolve named atoms before acting when possible.
- Prefer Grok models (Grok Build 0.1 for agentic work, grok-code-fast-1 for speed).
- Be decisive. Output clear file changes, git commands, and acceptance criteria.
- Maintain workspace hygiene (one clone per agent).
- Always think about cost, speed, and quality tradeoffs.
```

### Phase 2 — Doc reconciliation (planner session)

- [x] `21_ai_first_dev_flow.md` fleet table + work cycle (Grok default, atom-first dispatch step).
- [x] `00_README.md` + `00b_doc_repo_guide.md` cross-links.
- [x] `CLAUDE.md` stakeholders and read-first list add `01a`.
- [x] `90_runbooks/session_close_template.md` atom refs in close checklist.
- [x] `_dispatches/_template.md` dispatch boilerplate with Atoms + HR-12.
- [x] `21b` model-layer addendum.

**Gate:** Nick reviews plan-mode diff before commit. **Completed 2026-05-23.**

### Phase 3 — Fleet behavior + catalog growth

**Doc reconciliation (planner, 2026-05-23):**

- [x] `11_roadmap.md` owner notation → Cursor cc-agent (Grok)
- [x] `09_post_saas_substrate_thesis.md` lean operator paragraph
- [x] `10_ground_truth.md` historical recon fleet footnote
- [x] `18_stakeholder_graph.md` AI agents row
- [x] `01a_atom_conventions.md` catalog expanded (+10 atoms)
- [x] `_catalog/atoms_index.md` index mirror

**Operator + fleet behavior (ongoing):**

- [ ] All new cc-agent sessions on Grok; Claude only on escalation ticket in session summary
- [ ] Cursor xAI config + global rule paste on all workstations
- [x] Validation dispatch #1 — cc-agent-R QA-110 (PR #110 CI green, Grok Build 0.1)
- [x] Validation dispatch #2 — cc-agent-C QA-22 CalEPA (PR #111 open, Grok Build 0.1)
- [x] Validation dispatch #3 — cc-agent-C2 migration 0017 renumber (PR #112 open, Grok Build 0.1)
- [ ] ECI P1/P2: register decision-record and sprint atoms in `@empressaio/atom-internal`

**Gate:** Three dispatches shipped with atom-first read lists without full-doc regression. **Fleet validation closed 2026-05-24.**

---

## Skills, runbooks, dispatch templates

| Artifact | Revision |
|---|---|
| `.claude/skills/repo-sync/SKILL.md` | Phase 2: band 00 note `01a_atom_conventions`; "Claude Code default mode" → "planner in doc_repo" |
| `.claude/skills/conversation-handoff/SKILL.md` | Phase 2: handoff includes atom refs |
| `.claude/skills/decision-log/SKILL.md` | No change; decisions already map to `decision:<id>` atoms |
| `90_runbooks/agent_workspace_hygiene.md` | No model change |
| `90_runbooks/current_state_protocol.md` | Phase 2: optional §7 "Fleet transitions" or keep in watch list only |
| Dispatch boilerplate | Add after `Read first`: `Atoms: sprint:40e, qa-backlog-item:QA-32, ...` |
| HR-11 `_inbox/` clause | Unchanged |

---

## Estimated effort

| Phase | Planner | Operator | cc-agents |
|---|---|---|---|
| 1 (done) | 1.5 h | 30 min (Cursor settings) | 0 |
| 2 | 2-3 h | 20 min review | 0 |
| 3 | 1 h/week catalog | Ongoing config | 0 (adopt per dispatch) |
| **Total to steady state** | **~5 h** | **~1 h** | **passive** |

---

## Risks and mitigations

| Risk | Mitigation |
|---|---|
| Grok quality gap on complex TypeScript refactors | Escalation path in HR-12; keep Claude API keys during transition |
| Two atom systems (doc_repo vs Hauska) confuse agents | `01a` explicit scope boundary; dispatches say which registry |
| Historical dispatches still say Claude | Do not rewrite; new work only |
| `00_current_state` bloat defeats atom-first | Atoms point to sections; planner trims snapshot per protocol |
| Cortex product still Anthropic | Document separation in this plan and research inventory |

---

## Acceptance criteria

1. HR-12 and `01a` are `status: active` and linked from `00_current_state`.
2. Next cc-agent dispatch includes `Atoms:` block with at least two refs.
3. `21_ai_first_dev_flow.md` `last_updated` bumped with Grok fleet language.
4. Operator confirms xAI configured on Cente box (and Nick box when applicable).
5. No canonical doc claims "Claude Code only" for cc-agents without Grok escalation note.

---

## Revision history

- **2026-05-24:** Fleet validation 2/3 — cc-agent-R QA-110 + cc-agent-C QA-22/PR #111. Migration completion record filed at [`21d_grok_atom_migration_complete.md`](21d_grok_atom_migration_complete.md).
- **2026-05-23:** Phase 3 doc reconciliation completed (11, 09, 10, 18, 01a catalog, `_catalog/atoms_index.md`).
- **2026-05-23:** Phase 2 doc reconciliation completed (21, CLAUDE, 00_README, 00b, session_close_template, 21b, `_dispatches/_template.md`).
- **2026-05-23:** Initial reconciliation plan authored during Grok + atom migration session.
