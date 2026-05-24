---
date: 2026-05-24
agent: claude_code
repo: portfolio
session_type: planning
rolled_up: false
source: operator_paste_claude_parallel_chats
---

# Claude parallel planning carryover — consolidated for next major session

> **Purpose.** Durable capture of leftover Claude.ai / Claude Code planning threads that were not session-closed in-repo. Read this before the next major planning session. Does not supersede [`00_current_state.md`](../00_current_state.md) for tactical fleet state; use both.

## What was done

Operator pasted summaries from multiple parallel Claude planning conversations. This file consolidates them into one decision queue, one sequencing recommendation, and explicit routing for canonical docs not yet filed.

## Thread index

| # | Topic | Status | Primary home when filed |
|---|--------|--------|-------------------------|
| A | Project memory atoms + Codex/Cortex memory + assistant behavior | Scoped; operator decisions pending | ADR-019 (substrate), legacy-design-tools (product), `_decisions/` |
| B | Cortex fleet landscape + Replit UI overhaul + activation sequencing | Partially superseded by `00` as of 2026-05-24; Replit scoping still open | `_dispatches/`, `42_*`, watch list in `00` |
| C | Dossier atom vision (place → layers → `.hatom`) + pressure test | Vision stacked; pressure-tested; not committed | Future 10-band doc + place-atom ADR cornerstone |
| D | Hauska commercialization vision v1 + v2 addendum | v1 clean stop; two v1 edits + Part B addendum drafted for parallel agent | `HAUSKA_COMMERCIALIZATION_VISION.md` |
| E | City-to-city data sharing + Starlink | City-to-city settled in doc set; Starlink disposition recommended park | `06_*`, `28_*`, `11_*`; Starlink → decision record if locked |

---

## A. Project memory + human-assistant behavior (Codex/Cortex)

### Scope delivered (planning only)

Three workstreams were scoped:

**Item 1 — project memory atoms (substrate).** ADR-019 needed. Recommended placements:

- Registry: `@empressaio/atom-internal` (not `@hauska/atom-contract`)
- New `project-context` atom type with subtypes: constraint / preference / observation
- Reuse procedure-execution for decisions (additive `projectId` field) and actor atoms for stakeholders
- `projectId` as orthogonal field, not a new `accessPolicy` partition

**Item 2 — memory capture/recall (product).** Lives in legacy-design-tools.

- Write path: heuristic + classifier triggers, confidence-gated silent vs prompted capture, supersession on contradictions, age-out on stale memories
- Read path: vector relevance + recency boost + bounded token budget
- User-facing memory panel required for trust
- Cortex first, Codex second; cross-product via shared `projectId`

**Item 3 — assistant behavior tuning (prompt layer).**

- Proactive volunteering: context-diff pass before answer drafting (conflicts/gaps/implications), confidence threshold + rate limit
- Pushback authorization: disagree only when citation or stored memory backs it

**Smallest validating slice:** Ship item 3 alone on Cortex with throwaway JSON memory backing. Tests hypothesis before substrate cost. Parallel-safe with substrate v1.

**Hard sequence (full system):** ECI P1 ships → legacy-design-tools api-server migration completes → ADR-019 → atom shape published → product write/read paths → full system prompt integration.

**Queue placement:** Behind substrate v1 sprint and ECI atomization kickoff. Item 3 slice is the only piece that can run now without displacing active work.

### Cross-cutting risks named

Memory drift, privacy, trust erosion from ungrounded confidence, per-turn latency.

### Operator decisions (Thread A) — all pending

| # | Decision | Options |
|---|----------|---------|
| A1 | Greenlight scope | Accept as-is / modify / kill |
| A2 | File directional decision now? | `_decisions/2026-05-23_project_memory_assistant_scope.md` with reversal criteria (e.g. validating slice fails → items 1–2 do not proceed) / hold |
| A3 | Start validating slice now? | Item 3 on Cortex + throwaway JSON / wait |
| A4 | Confirm registry placement | `@empressaio/atom-internal` internal-first, promote later / public catalog from day one (changes ADR-019 scope) |

---

## B. Cortex fleet, Replit UI, activation sequencing

> **Note.** Tactical state may have moved since the paste. Verify PR numbers and CI against live GitHub before acting. [`00_current_state.md`](../00_current_state.md) §4–§6 is authoritative for fleet status as of 2026-05-24.

### Landscape at time of paste (2026-05-23)

| Agent | Status (paste) | Blocker |
|-------|----------------|---------|
| cc-agent-R | ~90% code-complete | PR #110 CI — `EngagementDetail.test.tsx` (~2 test updates for inline kickoff UX) |
| cc-agent-C2 | PR #107 shipped | Renumber 0016→0017, rebase, merge migration 0017 |
| cc-agent-C | CalEPA opt-in done | `gh pr create` + CI + merge + redeploy + Redd verify |
| cc-agent-E | TX-metros batch | Operator-supervised merge cadence #38–#47 |

### Recommended immediate sequencing (from paste; reconcile with `00`)

1. Renumber + merge cc-agent-C2 PR #107 → apply migration 0017 to prod
2. Open/merge cc-agent-C CalEPA PR → redeploy → Redd verify (EPA pill green)
3. Apply 40e migration 0016 to prod + verify fixture
4. cc-agent-R finish PR #110 → merge
5. 40e activation: `RENDERS_PROD_ENABLED` + `MNML_RENDER_MODE=live` same revision → live QA on Renders tab
6. Scope + dispatch Replit UI overhaul (after answers below)
7. cc-agent-E follow-ons (Pharr re-ingest, staged cities, El Paso retry) — separable anytime

**2026-05-24 update in `00`:** PR #112 addresses migration 0016/0017 collision; PRs #110/#111/#112 held for operator merge; Grok validation dispatches complete.

### Replit Agent UI overhaul — open scoping (Thread B)

Not dispatched. Four questions for operator before paste-ready dispatch:

| # | Question | Notes |
|---|----------|-------|
| B1 | UI overhaul scope? | A: Renders tab only / B: Engagement Detail shell / C: whole `portal-ui` / D: new surfaces / combination |
| B2 | Coordination vs cc-agent-R successor? | Recommendation: let R finish PR #110 + inline-dashboard merge before Replit starts on overlapping surfaces |
| B3 | Sequencing vs 40e activation? | Default: 40e ships first, then UI overhaul |
| B4 | Fleet hygiene | Clone path, branch prefix (`replit/ui-*`?), file allowlist (no backend/atoms/DB), HR-11 `_inbox/` reports, agent name (`cc-agent-UI`?) |

---

## C. Dossier atom vision + pressure test

### Vision (stacked, not committed)

**Unit:** Dossier = portable composite of one real place at a point in time. Test: send "123 Main Street" as one file; any agent renders plans, approvals, property facts, media, ideally 3D. Conceptually a `.hatom` manifest: snapshot + canonical resolvable address.

**Architecture layers proposed:**

| Layer | Content |
|-------|---------|
| Place atom | Stable root: parcel ID, address, coords, legal description, jurisdictional context |
| Layer atoms | Permit, deed, tax, survey, lender records — each signed by its issuer |
| Dossier bundle | Content-addressable projection of place + authorized layers at time T |

**Natural layers stacked in conversation:** tax/appraisal time-series; liens/easements/constraints (`constrains` relationship gating procedure-execution); spatial geometry (GeoJSON/glTF/IFC, fidelity tiers); actor graph around place (ADR-015); live operational state (event/stream atoms, subscription).

**Tokenization framing (qualified):** Dossier atoms cover verifiable portable composable information substrate most tokenization pitches wanted. They do **not** replace fungible fractional ownership or on-chain settlement. Positioning must not overclaim vs existing tokenization customers buying yield/liquidity.

### Pressure test — severity-ranked killers

| Rank | Failure mode | Severity | Mitigation direction |
|------|--------------|----------|---------------------|
| 1 | Partnership-sourcing math (permit + recorder + CAD + utilities + surveyors + lenders per jurisdiction) | High | Bastrop template; explicit per-layer partnership track; do not scrape as default |
| 2 | Legal weight of DID-signed attestations vs wet-stamped records | High | Belt-and-suspenders: atoms + wet PDF assets until industry adoption |
| 3 | Sequencing discipline vs substrate v1 | Medium-immediate | Explicit v2+ queue; no dossier in commercialization v1 exec summary |
| 4 | Cost-per-jurisdiction for dossier-grade onboarding | Medium | Separate threshold from code-only $200 rule |
| 5 | Tokenization displacement overclaim | Positioning | Narrow canonical doc if written |
| — | Cross-LLM "3D in chat" | Low | Honest: structured report in plain chat; high fidelity needs MCP tools or hosted viewer |
| — | Asset storage + subscription ops cost | Medium | Explicit cost model before product |

**Verdict from pressure test:** Vision structurally sound; v2+ only; partnership math is load-bearing.

### Proposed doc set when vision locks (not started)

- ADR: place atoms
- ADR: spatial layer atoms + geometry primitives
- ADR: event/streaming layer atoms (or ADR-013 refinement)
- ADR: constraint relationships + procedure-execution gating
- ADR: dossier bundle format (`.hatom` spec)
- 10-band: dossier atoms as substrate unit of physical-world agent intelligence
- Separate: tokenization displacement analysis (careful framing)

### Operator decisions (Thread C) — pending

| # | Decision | Options |
|---|----------|---------|
| C1 | Next cut on dossier | Pressure-test drill / Bastrop walk / v1-vs-v2 sequencing / tokenization doc / lock vision + scaffold ADRs |
| C2 | Scaffold canonical dossier vision doc in doc_repo? | Yes (10-band) / hold until commercialization reconciled |

**Gates when filing:** Run `premortem-check` + `catalog-thesis-check` on any canonical doc or ADR (new product line + atom-contract scope expansion).

---

## D. Commercialization vision — parallel agent handoff

### Verdict

**Clean stopping point for v1 commercialization doc.** Do not fold dossier vision into executive summary. Two surgical v1 edits + v2 addendum Part B are ready for the parallel agent working `HAUSKA_COMMERCIALIZATION_VISION.md`.

### Part A — v1 body edits (for parallel agent, not publication)

**Revision 1 — portability** (after "act on and defend" in sell-reasoning paragraph):

> Because the answer carries its own proof, it travels. It can be passed to a colleague, to a reviewer, or to another agent, and it stays verifiable wherever it lands. The reasoning is not locked inside Hauska.

**Revision 2 — forward pointer** (replace final "longer arc" paragraph):

> The longer arc runs through the verified-document capability. Today a verified document is a citation-backed excerpt or a source file. Over time it becomes something larger: a portable, verifiable record of a specific place, its approvals and its regulatory state, assembled from the same cited, attributed units the catalog is built on. Alongside the catalog of rules, a catalog of trustworthy records about the places those rules govern. That is the substrate the name points at: the data-and-payment layer AI agents run on whenever their work touches the physical world.

### Part B — v2 addendum content

Full Part B text was drafted in the parallel chat (dossier horizon at executive altitude, pressure-test caveats embedded: sequencing behind v1, partnership reach, legal belt-and-suspenders). Operator to paste into `HAUSKA_COMMERCIALIZATION_VISION.md` or hold as separate section.

### Factual flag — reconcile before circulate

Commercialization doc stated **2,414 rule-units across five jurisdictions**. Canonical snapshot at Sync 4.5 close (2026-05-19): **698 atoms across four jurisdictions** (Grand County 290, Bastrop UDC 181, Bastrop County 17, Elgin 210). Reconcile whether "rule-unit" ≠ "atom" or a number is stale before any external circulation.

Terminology: doc uses "rule-unit"; company uses "atom" internally. Decide public brand term.

### Explicitly out of commercialization v1 doc

| Out | Where instead |
|-----|----------------|
| Tokenization displacement (qualified) | Dossier vision doc |
| Place/spatial/event atom kinds | ADRs when ratified |
| DID-signed jurisdictional attestation for records | Dossier vision |
| New buyer types (title, lenders, owners-as-publishers) | Dossier vision |
| Five-layer stack, `.hatom` | Dossier vision + ADRs |

---

## E. City-to-city data sharing + Starlink

### City-to-city (settled in doc set — no new formalization needed)

- **Framing:** Federated precedent, not raw data flow. Bastrop owns Bastrop; Jarrell owns Jarrell. Aggregate anonymized patterns, not property-level export.
- **Customer narrative:** [`06_cities_value_narrative.md`](../06_cities_value_narrative.md)
- **Architecture:** Same sprint as SmartCity OS MCP retrofit, Phase 2, after ECI atomization — [`28_mcp_first_product_design.md`](../28_mcp_first_product_design.md)
- **Roadmap:** P3 M9 — [`11_roadmap.md`](../11_roadmap.md)
- **Atom type:** jurisdictional-precedent — [`27_engine_evolution_plan.md`](../27_engine_evolution_plan.md)
- **Commercial:** Layer 2 paid — [`08_tiered_access_model.md`](../08_tiered_access_model.md)
- **Decouple from Starlink:** city-to-city needs no physical link between cities.

### Starlink (net-new idea — disposition from sidebar)

Operator intent: hook IoT sensors; redundant connectivity for cities and SCADA.

Three separable slices:

| Slice | Description | Spine? |
|-------|-------------|--------|
| A | IoT sensor backhaul → sensor-reading atoms | Yes (deferred) |
| B | Redundant WAN for city ops / SmartCity OS | No (plumbing) |
| C | SCADA failover | No; liability + OT competence mismatch |

**Recommendation from sidebar (not yet decision-recorded):**

- Do **not** formalize as Empressa workstream now (focus-queue rule).
- Keep A warm: sensor-reading atoms already in [`25_atom_architecture_reference.md`](../25_atom_architecture_reference.md); roadmap parks IoT beyond end-state ([`11_roadmap.md`](../11_roadmap.md) ~L106); live telemetry out of scope per 46/27.
- When rural deployment needs it: deployment-runbook line ("city-procured Starlink for rural sites"), not product.
- Drop B and C as Empressa-owned. SCADA: refer to OT networking specialist.
- **Reversibility conflict:** owning city connectivity rails contradicts [`06_cities_value_narrative.md`](../06_cities_value_narrative.md) anti-hostage positioning.

### Operator decision (Thread E) — pending

| # | Decision | Options |
|---|----------|---------|
| E1 | Log Starlink disposition as decision record? | `_decisions/2026-05-24_starlink_connectivity_disposition.md` / keep sidebar only |

---

## Master open-decisions queue (next planning session)

Use this as the agenda checklist. Nothing below executes without explicit operator yes.

### Strategic / substrate

- [ ] **A1–A4** Project memory scope, decision record, validating slice, registry placement
- [ ] **C1–C2** Dossier next cut; scaffold canonical doc?
- [ ] **E1** Starlink decision record?

### Commercialization (parallel agent)

- [ ] Apply Part A revisions + Part B addendum to `HAUSKA_COMMERCIALIZATION_VISION.md`
- [ ] Reconcile atom/rule-unit count (2414 vs 698)
- [ ] Public "atom" vs "rule-unit" terminology

### Cortex / fleet (verify live state first)

- [ ] Merge PRs #110, #111, #112 (per `00` 2026-05-24)
- [ ] 40e activation flip after merges + migration apply
- [ ] **B1–B4** Replit UI overhaul scope + dispatch

### Side thread from early paste (human assistant — Codex/Cortex)

Three behaviors identified as "feels human": persistent project memory, proactive volunteering, courage to push back — maps to Items 1–3 above (Thread A).

---

## Atom portability sidebar (unresolved pick)

Dimensions named for future session; most loaded: **#4 cross-buyer/agent-context portability** and **#5 cross-mirror**. Dossier vision (Thread C) is the concrete instantiation of #4+#5 combined. No separate decision until operator picks "map all vs drill one."

---

## What was learned (changes to ground truth)

- Multiple substantial planning threads existed only in Claude chat history until this capture.
- Commercialization v1 and dossier v2 are intentionally split; folding dossier into v1 exec summary is an anti-pattern (focus erosion risk).
- Starlink and city-to-city must remain decoupled in all future docs.
- Project memory work has a cheap validation path (Item 3 + JSON on Cortex) that does not block substrate v1.

## What's still open

Everything in the master queue above. No `_decisions/` records filed yet for project memory scope, dossier vision, or Starlink disposition (unless operator requests in a follow-up).

## Suggested canonical doc updates (rollup backlog)

| Doc | Action |
|-----|--------|
| `HAUSKA_COMMERCIALIZATION_VISION.md` | Part A edits + Part B addendum (parallel agent) |
| `10_*` dossier vision (new, draft) | When C2 = yes; premortem + catalog-thesis first |
| `_decisions/2026-05-23_project_memory_assistant_scope.md` | If A2 = file now |
| `_decisions/2026-05-24_starlink_connectivity_disposition.md` | If E1 = yes |
| `00_current_state.md` | Pointer to this file (done 2026-05-24) |
| Reconcile commercialization atom count vs `10_ground_truth` / substrate sprint metrics | Before external share |

## Recommended order for next major planning session

1. **Tactical gate** (15 min): Read `00` §4; confirm PR #110/#111/#112 merge state; don't replan fleet from stale paste.
2. **Binary strategic queue** (30 min): A1–A4 yes/no batch; then C1 (dossier next cut) or defer dossier entirely.
3. **Commercialization handoff** (15 min): Confirm parallel agent applied Part A/B; reconcile counts.
4. **Replit** (if activation path clear): B1–B4 only if operator still wants UI overhaul this cycle.
5. **Park or log**: E1 Starlink; atom-portability map-all session only if bandwidth.

---

*Filed from operator paste of Claude parallel chats. Not a substitute for session-close on those chats; prevents loss of planning context.*
