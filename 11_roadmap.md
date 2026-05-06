---
id: 11_roadmap
title: Roadmap
status: active
last_updated: 2026-05-05
applies_to: portfolio
related: [10_ground_truth, 15_replit_neon_ownership_advisory, 23_dev_setup_assessment]
---

# Roadmap

> **Working checklist.** Edit in place. Check items off as they ship.
> Move items between tiers as priority shifts. Bump `last_updated` on
> every edit, however small. The checklist is the roadmap; surrounding
> prose stays minimal so the action items are scannable.
>
> **2026-05-05 changes:** P0 docs work closed (atom ADR + reference +
> upgrade guide migrated; recon backfill landed; ADR-Replit-Neon
> migration done; saga package cleanup decided as retire-both). Part 8
> open questions from `04_strategic_conversation_record.md` folded in:
> action-shaped items added to P-tiers; genuinely-open questions in
> new "Open strategic questions" section. Risk register, leading
> indicators, and pricing framework extracted as `13`, `17`, `15`.
>
> **Supersedes** the pre-docs-repo `11_roadmap.md` carried forward in
> Claude.ai project knowledge â Phase 0 framing is dropped because the
> Phase 0 Stage 8 closure narrative had no codified evidence (see
> [`10_ground_truth.md`](10_ground_truth.md)).

## Summary

~45 pending items across the portfolio. Five active fires (3 unfixed
as of 2026-05-05; 2 mitigated/tracked), two infrastructure
migrations, two product wave plans (architect-side Moab waves +
city-side AI Plan Review M4-B), a stack of operational debt, a
handful of strategic items, and a register of open strategic
questions awaiting external signal.

**Priority tiers:**
- **P0** â fire / blocking / today-this week
- **P1** â committed work this week / next
- **P2** â next 2-4 weeks
- **P3** â backlog (important, not urgent)
- **Open strategic questions** â genuinely-open, awaiting signal /
  conversation / data; listed separately because they're not work
  items in the same shape

**Sizing:** S < 1h Â· M = 1-4h Â· L = 1+ days Â· XL = multi-day sprint.

**Owner notation:** Nick = manual / decision / browser. Agent =
Cursor Claude Code or Replit Agent. Planner = Claude.ai planning
chat. Open = no owner currently assigned. Valerie / Sylvia = named
externals where a question depends on them.

---

## P0 â now / this week

- [ ] **Fire 3:** verify legacy-design-tools `post-merge.sh` Neon-guard on GitHub web UI â `fire` Â· Nick (browser) Â· S Â· ref: [`10_ground_truth.md`](10_ground_truth.md)
- [ ] **Fire 1:** W1.C.4a auth bypass fix on SmartCity OS â `fire` Â· Nick + agent Â· M Â· ref: [`10_ground_truth.md`](10_ground_truth.md)
- [ ] **Fire 2:** plaintext secrets in `.replit` â rotate ADMIN_RESET / USER_RESET / BASTROP_BOOTSTRAP / ARCGIS / VERKADA / CALENDAR / VFD_*, remove `[userenv.shared]` plaintext, decide on git history scrub â `fire` Â· Nick Â· M Â· ref: [`10_ground_truth.md`](10_ground_truth.md)
- [x] **Atom architecture ADR migration** â [`80_adrs/adr_001_atom_architecture.md`](80_adrs/adr_001_atom_architecture.md) + reference in [`25_atom_architecture_reference.md`](25_atom_architecture_reference.md) + upgrade guide in [`26_atom_upgrade_guide.md`](26_atom_upgrade_guide.md). Closed 3 forward-references in 30 / 40 / 41. **Shipped 2026-05-05.**
- [x] **Recon backfill** into `_sessions/2026-05-05_*` (3 summaries: smartcity-os, legacy-design-tools, legacy-revit-sensor). **Shipped 2026-05-05.** Closes the audit trail behind [`10_ground_truth.md`](10_ground_truth.md)'s planner-belief corrections.

## P1 â this week / next

- [ ] **Cloud Run + GitHub Actions CI migration** for legacy-design-tools â `migration` Â· Nick + agent Â· XL sprint Â· ref: [`15_replit_neon_ownership_advisory.md`](15_replit_neon_ownership_advisory.md), [`23_dev_setup_assessment.md`](23_dev_setup_assessment.md)
- [ ] **Empressa Neon swap, both apps** (paired with Cloud Run sprint; SmartCity OS Neon to `us-central1` to close Fire 5 cross-region hop) â `migration` Â· Nick + agent Â· XL sprint Â· ref: [`15_replit_neon_ownership_advisory.md`](15_replit_neon_ownership_advisory.md)
- [ ] **W1.A.6-9 forensics dispatches** (calendar event visibility / Power BI accuracy / police units & Spireon / daily health-watch email) â `sprint` Â· agent Â· XL Â· ref: [`10_ground_truth.md`](10_ground_truth.md)
- [ ] **W1.C.1-3 implementation dispatches** (Prophecy layout / CSP frame-src / OpenGov BNP hardening) â `sprint` Â· agent Â· XL Â· ref: [`10_ground_truth.md`](10_ground_truth.md)
- [ ] **$21M water/wastewater state grant** â June 1 deadline, no owner, no technology narrative drafted â `strategic` Â· Nick (open) Â· XL Â· ref: `userMemories` (no doc yet â propose `12_grants_pipeline.md` if multiple grants surface)

## P2 â next 2-4 weeks

- [ ] **Fire 4:** SmartCity OS Repl drift cleanup (cherry-pick `b67c333` if functional, discard auto-checkpoints, neutralize `[deployment]` block) â `fire (demoted)` Â· Nick + agent Â· M Â· ref: [`10_ground_truth.md`](10_ground_truth.md)
- [x] **Saga package cleanup** â cross-app handoff disposition + package README disposition. **Shipped 2026-05-05.** Decision: retire both (handoff's recon-request was fulfilled by 2026-05-05 multi-repo recon; package README replaced by individual doc frontmatter).
- [x] **ADR-Replit-Neon-001/002/003 migrate** from advisory body to [`80_adrs/`](80_adrs/) â [`adr_002_replit_neon_migration.md`](80_adrs/adr_002_replit_neon_migration.md), [`adr_003_replit_neon_tactical.md`](80_adrs/adr_003_replit_neon_tactical.md), [`adr_004_future_neon_provisioning.md`](80_adrs/adr_004_future_neon_provisioning.md). **Shipped 2026-05-05.**
- [ ] **ADR-005 multitenancy** migration â `80_adrs/adr_005_smartcity_multitenancy.md` from pre-docs-repo `45_smartcity_multitenancy_spec.md` (every atom is tenant-scoped per ADR-001; this captures the multitenancy decision separately). Decided 2026-05-05 to land as ADR not sub-product spec â `docs` Â· planner Â· M Â· ref: [`02_doc_migration_plan.md`](02_doc_migration_plan.md) item 11
- [ ] **Watchlist / risk register owner assignment** â Suggested in [`13_risk_register.md`](13_risk_register.md) and [`17_leading_indicators.md`](17_leading_indicators.md) as Nick to set, Valerie to operate. Until owner is named, monthly cadence is aspirational. â `ops` Â· Nick (decision) Â· S Â· ref: [`13_risk_register.md`](13_risk_register.md)
- [ ] **Cente box layout confirmation** (paths, `gcloud`, `gh`, `doc_repo` clone, working repo paths) â `ops` Â· Nick Â· S Â· ref: [`22_workstation_inventory.md`](22_workstation_inventory.md)
- [ ] **SSH remotes migration on Nick box** + `gh auth login` â `ops` Â· Nick Â· S Â· ref: [`22_workstation_inventory.md`](22_workstation_inventory.md)
- [ ] **Anthropic GitHub MCP wiring** (post seed-doc-stable; replaces manual project-knowledge sync) â `ops` Â· Nick + planner Â· M Â· ref: [`22_workstation_inventory.md`](22_workstation_inventory.md)
- [ ] **Empressa credentials vault decision** â pick 1Password or equivalent as canonical store â `ops` Â· Nick Â· S Â· ref: [`15_replit_neon_ownership_advisory.md`](15_replit_neon_ownership_advisory.md), [`22_workstation_inventory.md`](22_workstation_inventory.md)
- [ ] **Pre-docs-repo migration progress** â work the queue in [`02_doc_migration_plan.md`](02_doc_migration_plan.md) (~22 migrate items, 12 absorb, 6 archive, 7 retire). Sequence per matrix's "Suggested execution order." â `docs` Â· planner Â· L (multi-turn) Â· ref: [`02_doc_migration_plan.md`](02_doc_migration_plan.md)
- [ ] **Design Accelerator Moab waves W0-W3** (foundation / parcel + 3DEP / context + render / comments) â `product` Â· Nick + agent Â· XL sprint Â· ref: [`40_design_accelerator.md`](40_design_accelerator.md)
- [ ] **DA-PI-1:** Design Accelerator parcel intelligence MVP â `product` Â· Nick + agent Â· XL sprint Â· ref: [`40_design_accelerator.md`](40_design_accelerator.md)
- [ ] **AI Plan Review M4-B kickoff** (PLR-1..28 active, SD-1..8 settled, W1 three-button â W6 differentiation) â `product` Â· Nick + agent Â· XL sprint Â· ref: [`30_smartcity_os.md`](30_smartcity_os.md)
- [ ] **B1 bidirectional taxonomy** (v1.0 requirement; server-side classification in api-server) â `product` Â· Nick + agent Â· L Â· ref: [`40_design_accelerator.md`](40_design_accelerator.md), [`41_revit_connector.md`](41_revit_connector.md)
- [ ] **Sprint A04.7 followups** â dedup edge cases, post-fix monitoring â `product` Â· agent Â· M Â· ref: [`40_design_accelerator.md`](40_design_accelerator.md)

## P3 â backlog

- [ ] **Jarrell onboarding** + city-to-city architecture (M9) â `product` Â· Nick + open Â· XL sprint Â· ref: [`30_smartcity_os.md`](30_smartcity_os.md)
- [ ] **Digital Twinning surface** â early product, depth deferred â `product` Â· Nick + agent Â· XL Â· ref: [`30_smartcity_os.md`](30_smartcity_os.md)
- [ ] **typecheck baseline â zero** (SmartCity OS 422 errors) â `ops` Â· agent Â· XL Â· ref: [`10_ground_truth.md`](10_ground_truth.md)
- [ ] **SmartCity OS `migrations/` prefix collisions** (two `0003_*`, two `0004_*`) â `ops` Â· agent Â· S Â· ref: [`10_ground_truth.md`](10_ground_truth.md)
- [ ] **Lockfile drift root cause** (SmartCity OS â `bufferutil` / `@emnapi/runtime`) â `ops` Â· agent Â· S Â· ref: [`10_ground_truth.md`](10_ground_truth.md)
- [ ] **Universal `sync_health` adoption** across integrations â `ops` Â· agent Â· M Â· ref: [`30_smartcity_os.md`](30_smartcity_os.md)
- [ ] **Schema migration framework decision** (drizzle migrate vs raw SQL in CI vs manual; post-Empressa-Neon) â `ops` Â· Nick + planner Â· S Â· ref: [`15_replit_neon_ownership_advisory.md`](15_replit_neon_ownership_advisory.md)
- [ ] **Devcontainer / Codespaces evaluation** for cross-box parity â `ops` Â· Nick + planner Â· L Â· ref: [`23_dev_setup_assessment.md`](23_dev_setup_assessment.md)
- [ ] **Compass system prompt refactoring** â `ops` Â· planner + agent Â· M Â· ref: [`30_smartcity_os.md`](30_smartcity_os.md)
- [ ] **Quantum cryptography strategic vision doc** â `strategic` Â· Nick + planner Â· L Â· ref: `userMemories` (no doc yet â would land as `13_quantum_strategy.md` or similar)
- [ ] **Security Day** â 4 deferred security commits â `ops` Â· Nick + agent Â· M Â· ref: `userMemories` (no doc yet)
- [ ] **GoTo Connect OAuth fix** (descoped to separate day) â `ops` Â· agent Â· S Â· ref: `userMemories`
- [ ] **Deduplicate `mygov_work_orders` schema** (one-row-per-job vs intentional duplicates â architectural decision pending) â `ops` Â· Nick (decision) Â· M Â· ref: [`10_ground_truth.md`](10_ground_truth.md)
- [ ] **Hauska â Legacy services agreement** â formal document. Currently informal/founder-overlap. â `corporate` Â· Nick + Valerie Â· M Â· ref: archived [`_sessions/archived/2026-04/2026-04-18_strategic_record.md`](_sessions/archived/2026-04/2026-04-18_strategic_record.md) Part 8 #8
- [ ] **Hauska Inc. GitHub org migration** â code currently lives under `empressaioemail-tech` org. Migrate Hauska SDK packages to a Hauska-Inc-owned org. â `corporate / ops` Â· Nick Â· M Â· ref: archived strategic record Part 8 #9
- [ ] **Engineer-2 operational protocol** â onboarding doc + agent rules training + first-PRs review pattern. Triggers when first additional engineer onboards. â `ops` Â· Nick Â· M (when triggered) Â· ref: archived strategic record Part 8 #10, [`13_risk_register.md`](13_risk_register.md) Risk 8
- [ ] **ADR-006 anchoring substrate decision** â Polygon CDK (existing ADR-007 in pre-docs-repo project knowledge) vs. public TSA vs. customer-controlled. Precondition for M6. â `architecture` Â· Nick + planner (ADR doc) Â· M Â· ref: archived strategic record Part 8 #16
- [ ] **Nick Chesser subdivision real name** â low-stakes text reply pending. Trivial. â `ops` Â· Nick Â· S Â· ref: archived strategic record Part 8 #17

---

## Open decisions / judgment calls

Roadmap-shape calls that affect priority/scope but haven't been
resolved. Resolved items struck through.

- ~~Atom ADR + recon backfill at P0~~ â resolved 2026-05-05 (both shipped).
- **$21M grant at P1 with size XL** â time-bound by external deadline (June 1) but currently no owner / no narrative. If this stays at P1 it needs decisions and bodies; otherwise it slides to "abandoned" rather than "deferred."
- **Migration sprint as one item vs split into pieces** â currently lumped (Cloud Run + GHA + Empressa Neon for both apps as effectively two rows). Could split into 4-6 sub-items to surface dependencies more clearly. Nick to decide before sprint kickoff.
- **Jarrell at P3 not P2** â demoted because Bastrop fires + product roadmap have to clear first. Could be argued the other way (Jarrell drives the city-to-city architecture which needs scoping work even before the city is live).
- **Compass system prompt refactoring at P3** â if blocking AI Plan Review M4-B work, rises to P2.
- **Items not on this roadmap because it's a software roadmap:** marketing/sales pipeline (Pipedrive, Synthesia content, TCMA/ICMA prep), Sylvia $1M proposal restructuring (per [`14_pricing_framework.md`](14_pricing_framework.md)), EdgeConneX partnership outreach. These shape *what* the software needs to do and *when* â surface them on a separate sales/customer roadmap or absorb them here. Decision pending.

## Open strategic questions

Questions that are not work items in the same shape as roadmap
entries. They're decisions awaiting external signal â customer
conversations, market data, regulatory developments, or sustained
deliberation. Listed by category with current owner. Folded in from
Part 8 of [`_sessions/archived/2026-04/2026-04-18_strategic_record.md`](_sessions/archived/2026-04/2026-04-18_strategic_record.md)
on 2026-05-05.

These don't get checkboxes (they don't ship in a single state
change). When a question resolves, it gets struck through and a
short note explains the resolution. New questions can be added as
they surface.

### Commercial â Legacy

- **Per-city price envelope for deal #2** â *Valerie*. Resolves with Jarrell pricing decision and/or pipeline data from city-manager outreach. Affects [`14_pricing_framework.md`](14_pricing_framework.md) defaults if we discover a different anchor profile.
- **Services vs. platform revenue on Bastrop** â *Valerie + Nick*. How much of current Bastrop revenue is implementation services (one-time) vs. platform/SaaS (recurring)? Affects how we project deal #2 economics.
- **Plan review module-or-bundle** â *Nick + Valerie*. Is AI Plan Review (M4-B) sold as a bundled feature of SmartCity OS or as an add-on module? Resolves before Bastrop's first plan-review billing event.
- **Tenth-deal economics** â *Valerie*. What does the bundle look like at customer #10? Pricing, services intensity, expansion math. Resolves with cumulative pipeline data; not urgent but informs Path A/B framework defaults.
- **`@empressaio/atom` commercial posture revisit trigger** â *Nick*. Currently proprietary, internal to Legacy products only. Trigger: third-party vertical app builders asking to consume it. Reopens license decision when triggered. See [`25_atom_architecture_reference.md`](25_atom_architecture_reference.md) Licensing section.

### Commercial â Hauska Inc.

- **Hauska SDK pricing model** â *Nick*. Hauska is a separate C-corp; the SDK is its product. Pricing model not yet set (per-seat, usage-based, value-based). Resolves before Hauska Inc. external developer motion launches.
- **Hauska Inc. external developer motion** â *Nick*. If/when to launch SDK to external developers. Today, Legacy is the sole customer (intra-Nick relationship). Triggers: external developer demand surfaces, OR Legacy's revenue independence makes the developer motion strategically necessary for Hauska's identity.

### Corporate / structural

- *(Action items for HauskaâLegacy services agreement, GitHub org migration, Engineer-2 protocol moved to P3 above â they're concrete deliverables.)*

### Regulatory and positioning

- **Active vs. passive posture toward TCEQ standard-setting** â *Nick + Sylvia conversation*. Active = help write the rules, become reference implementation, compliance-as-differentiator. Passive = meet whatever standard TCEQ settles on. Resolves with Sylvia's input on Bastrop VVater DPR engagement and TCEQ relationship. Tied to [`13_risk_register.md`](13_risk_register.md) Risk 7.
- **Bring-your-own-agent public API** â *Nick (product decision)*. Should SmartCity OS expose its atom graph + context interface to customer-supplied AI agents? Architectural fit is good; commercial implications are not yet thought through. Tied to [`13_risk_register.md`](13_risk_register.md) Risk 1 (AI-access commoditization).
- **Empressa Company Intelligence trajectory** â *Nick*. ECI v1 is shipped (internal team workspace). Question: stays internal-only forever, or eventually becomes a commercial product (small-team coordination tool)? Resolves with Empressa's own growth and any external interest signal.

### Market and customer

- **Which second customer, and what the referral funnel looks like** â *Valerie + Sylvia*. Jarrell is confirmed pipeline; what comes after? Sylvia's TCMA/ICMA network is the primary referral channel. Resolves with TCMA/ICMA outreach yield and Jarrell-conversion signal.
- *(Watchlist ownership moved to P2 above â it's a concrete decision, not an open question.)*

### Architectural

- *(Anchoring substrate decision moved to P3 above as ADR-006 task â concrete deliverable, not an open question.)*

## References

The canonical docs each item points back to:

**Foundation / meta:**
- [`00_README.md`](00_README.md) â repo purpose, scope, numbering bands
- [`01_doc_conventions.md`](01_doc_conventions.md) â naming, frontmatter, archive/rollup conventions
- [`02_doc_migration_plan.md`](02_doc_migration_plan.md) â pre-docs-repo migration triage matrix

**Portfolio reference:**
- [`10_ground_truth.md`](10_ground_truth.md) â current state, fires, planner-belief corrections
- [`13_risk_register.md`](13_risk_register.md) â 10 named failure modes
- [`14_pricing_framework.md`](14_pricing_framework.md) â Path A vs Path B, defaults, live Sylvia application
- [`15_replit_neon_ownership_advisory.md`](15_replit_neon_ownership_advisory.md) â Replit-managed Neon migration plan
- [`17_leading_indicators.md`](17_leading_indicators.md) â flat-table watchlist

**Agent rules + dev flow:**
- [`20_agent_operating_rules.md`](20_agent_operating_rules.md) â rules the fleet operates under
- [`21_ai_first_dev_flow.md`](21_ai_first_dev_flow.md) â fleet structure, work cycle, routing
- [`22_workstation_inventory.md`](22_workstation_inventory.md) â per-machine paths, gh / gcloud / git auth
- [`23_dev_setup_assessment.md`](23_dev_setup_assessment.md) â strategic three-layer plan (Today / This week / Next quarter)
- [`25_atom_architecture_reference.md`](25_atom_architecture_reference.md) â full atom architecture spec
- [`26_atom_upgrade_guide.md`](26_atom_upgrade_guide.md) â atom adoption protocol

**Product homes:**
- [`30_smartcity_os.md`](30_smartcity_os.md) â SmartCity OS product home
- [`40_design_accelerator.md`](40_design_accelerator.md) â Design Accelerator product home
- [`41_revit_connector.md`](41_revit_connector.md) â Revit Connector product home

**ADRs:**
- [`80_adrs/adr_001_atom_architecture.md`](80_adrs/adr_001_atom_architecture.md) â atom contract as foundational pattern
- [`80_adrs/adr_002_replit_neon_migration.md`](80_adrs/adr_002_replit_neon_migration.md) â migration commitment
- [`80_adrs/adr_003_replit_neon_tactical.md`](80_adrs/adr_003_replit_neon_tactical.md) â tactical workaround
- [`80_adrs/adr_004_future_neon_provisioning.md`](80_adrs/adr_004_future_neon_provisioning.md) â future products provision Empressa-owned
- ADR-005 (multitenancy) and ADR-006 (anchoring substrate) â pending, see P2 / P3

**Operational:**
- [`90_runbooks/replit_deploy.md`](90_runbooks/replit_deploy.md) â Replit deploy runbook
- [`91_postmortems/2026-05-05_track_b_deploy_saga.md`](91_postmortems/2026-05-05_track_b_deploy_saga.md) â Track B postmortem

**Archived:**
- [`_sessions/archived/2026-04/2026-04-18_strategic_record.md`](_sessions/archived/2026-04/2026-04-18_strategic_record.md) â strategic conversation record snapshot (extractions live across `13`, `15`, `17`, this roadmap, and product home docs)
- `_sessions/2026-05-05_*` â multi-repo recon summaries (rolled up into `10_ground_truth.md`)

Items marked `userMemories` (no doc yet) are tracked only in this roadmap and in Claude.ai planner memory until they earn their own canonical doc.
