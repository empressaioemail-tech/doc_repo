---
id: 11_roadmap
title: Roadmap
status: active
last_updated: 2026-05-10
applies_to: portfolio
related: [10_ground_truth, 15_replit_neon_ownership_advisory, 23_dev_setup_assessment]
---

# Roadmap

> **Working checklist.** Edit in place. Check items off as they ship.
> Move items between tiers as priority shifts. Bump `last_updated` on
> every edit, however small. The checklist is the roadmap; surrounding
> prose stays minimal so the action items are scannable.
>
> **2026-05-06 changes:** Tooling setup complete on Nick box (`gh
> auth login` + `gh auth setup-git` + credential username pinned;
> all four repos verified accessible). Migration sprint structure
> decided as 3-phase split (legacy-design-tools full migration â
> SmartCity OS Neon swap â Drizzle migrate adoption); landed as
> [`12_migration_sprint.md`](12_migration_sprint.md). Cloud Run
> canary deploy pattern codified at
> [`90_runbooks/cloud_run_canary_deploy.md`](90_runbooks/cloud_run_canary_deploy.md).
> Biz ops repo concept agreed (separate repo for finance / sales /
> customer / corporate; cross-references to canonical-numbers
> docs); creation queued in P2. Pricing framework renumbered
> 15 â 14 (slot collision).
>
> **2026-05-05 changes:** P0 docs work closed (atom ADR + reference +
> upgrade guide migrated; recon backfill landed; ADR-Replit-Neon
> migration done; saga package cleanup decided as retire-both). Part 8
> open questions from `04_strategic_conversation_record.md` folded in:
> action-shaped items added to P-tiers; genuinely-open questions in
> new "Open strategic questions" section. Risk register, leading
> indicators, and pricing framework extracted as `13`, `17`, `14`.
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
- [x] **Fire 1:** W1.C.4a auth bypass fix on SmartCity OS â closed 2026-05-10 (PR #6, commit `5e9fca3`, Cloud Run revision `smartcity-api-00084-weg`) â `fire` Â· Nick + agent Â· M Â· ref: [`10_ground_truth.md`](10_ground_truth.md)
- [ ] **Fire 2:** plaintext secrets in `.replit` â rotate ADMIN_RESET / USER_RESET / BASTROP_BOOTSTRAP / ARCGIS / VERKADA / CALENDAR / VFD_*, remove `[userenv.shared]` plaintext, decide on git history scrub â `fire` Â· Nick Â· M Â· ref: [`10_ground_truth.md`](10_ground_truth.md) **(held â Bastrop IT engagement required for external rotations)**
- [x] **Atom architecture ADR migration** â [`80_adrs/adr_001_atom_architecture.md`](80_adrs/adr_001_atom_architecture.md) + reference in [`25_atom_architecture_reference.md`](25_atom_architecture_reference.md) + upgrade guide in [`26_atom_upgrade_guide.md`](26_atom_upgrade_guide.md). Closed 3 forward-references in 30 / 40 / 41. **Shipped 2026-05-05.**
- [x] **Recon backfill** into `_sessions/2026-05-05_*` (3 summaries: smartcity-os, legacy-design-tools, legacy-revit-sensor). **Shipped 2026-05-05.** Closes the audit trail behind [`10_ground_truth.md`](10_ground_truth.md)'s planner-belief corrections.

## P1 â this week / next

- [ ] **Migration sprint Phase 1** â legacy-design-tools full migration (Cloud Run + GHA CI + Empressa Neon swap). Sub-phases 1A/1B/1C per [`12_migration_sprint.md`](12_migration_sprint.md). â `migration` Â· Nick + agent Â· XL sprint Â· ref: [`12_migration_sprint.md`](12_migration_sprint.md). **2026-05-06 progress:** **Phase 1A verified** â scaffold + first-deploy + cascading test fixes shipped via PRs #18, #20, #21, #22, #24 + `fix/cloud-run-first-deploy-and-auth-flags`. GCP infrastructure stood up in `legacy-design-tools-prod`. Canary revision `api-server-00003-wix` healthz 200. Traffic ramp pending. Phases 1B + 1C unblocked. Frontend hosting deferred. **2026-05-06 PM:** Traffic ramp closed (100% to api-server-00003-wix, post-ramp backup tag at `e4b15c1`). Empressa Neon project provisioned for Phase 1B. Phase 1B Stage 1 dispatch ready, blocked on workstation Postgres client install + `EMPRESSA_DATABASE_URL` secret load.
- [ ] **Migration sprint Phase 2** â SmartCity OS Empressa Neon swap (us-central1 closes Fire 5). â `migration` Â· Nick + agent Â· XL sprint Â· ref: [`12_migration_sprint.md`](12_migration_sprint.md)
- [ ] **Migration sprint Phase 3** â Drizzle migrate adoption for both apps. â `migration` Â· Nick + agent Â· XL sprint Â· ref: [`12_migration_sprint.md`](12_migration_sprint.md)
- [ ] **Dispatch prompts queue** â 11 prompts pending draft (Fire 4 Repl drift, W1.A.6-9 forensics, W1.C.1-3 implementation, A04.7 followups, lockfile drift, prefix collisions, GoTo OAuth). Batch by similarity per prior planner recommendation. â `docs` Â· planner Â· M (batch turns) Â· ref: chat 2026-05-06
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
- [x] **SSH remotes migration on Nick box** â superseded 2026-05-06 by `gh auth setup-git` + `credential.https://github.com.username` pinning. SSH remotes deferred indefinitely; current pattern works.
- [x] **`gh auth login` on Nick box** â done 2026-05-06. All four working repos verified accessible.
- [x] **Cloud Run canary deploy runbook** â [`90_runbooks/cloud_run_canary_deploy.md`](90_runbooks/cloud_run_canary_deploy.md). **Shipped 2026-05-06.** Pattern from W1.C.4a generalized for Phase 1A and ongoing Cloud Run work.
- [x] **Migration sprint structure decision** â **decided 2026-05-06 as 3-phase split**, captured in [`12_migration_sprint.md`](12_migration_sprint.md). Surgical phasing avoids stacked-failure pattern from Track B saga.
- [ ] **Biz ops repo creation** â separate repo for finance / sales / customer relationships / corporate / strategy. Repo name TBD (`biz_ops_repo` / `legacy_biz_ops` / `empressa_biz`). First content: README + `00_logs/` directory with 6 capture log templates (pricing log, deal events log, sprint actuals log, pipeline movement log, time allocation log, expenses log). Cross-references from `doc_repo` (`14_pricing_framework`, `13_risk_register`, `17_leading_indicators`). Backfill Track B saga sprint actuals + Sylvia $1M proposal data point + current Bastrop pipeline state. â `corporate` Â· Nick + planner Â· M Â· ref: chat 2026-05-05
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
- [ ] **Semgrep `// nosemgrep:` annotation on `server/routes/mygov.ts:269`** (GCP metadata-server false positive â clears CI noise) â `docs/cleanup` Â· agent Â· S Â· ref: [`91_postmortems/2026-05-07_replit_dev_db_wedged.md`](91_postmortems/2026-05-07_replit_dev_db_wedged.md)
- [ ] **`server/routes/ai-assistant.ts:4212` stale `"x-internal-ai": "1"` header** (broken internal call, separate from Fire 1) â `bug` Â· agent Â· S Â· ref: [`10_ground_truth.md`](10_ground_truth.md)
- [ ] **`server/app.ts:85` CORS allowlist removal of `x-internal-ai`** (defense-in-depth post-Fire-1) â `security` Â· agent Â· S Â· ref: [`10_ground_truth.md`](10_ground_truth.md)
- [ ] **Auth middleware vitest coverage gap** (`c4c559d` covers 5 surfaces, auth not one) â `test-debt` Â· agent Â· M Â· ref: [`10_ground_truth.md`](10_ground_truth.md)
- [ ] **Audit production Neon for MyGov raw-records growth pattern** (independent of Repl dev-DB issue) â `recon` Â· agent Â· M Â· ref: [`91_postmortems/2026-05-07_replit_dev_db_wedged.md`](91_postmortems/2026-05-07_replit_dev_db_wedged.md)

---

## Open decisions / judgment calls

Roadmap-shape calls that affect priority/scope but haven't been
resolved. Resolved items struck through.

- ~~Atom ADR + recon backfill at P0~~ â resolved 2026-05-05 (both shipped).
- **$21M grant at P1 with size XL** â time-bound by external deadline (June 1) but currently no owner / no narrative. If this stays at P1 it needs decisions and bodies; otherwise it slides to "abandoned" rather than "deferred."
- ~~**Migration sprint as one item vs split into pieces**~~ â resolved 2026-05-06 as **3-phase split** (legacy-design-tools full migration â SmartCity OS Neon swap â Drizzle migrate adoption). See [`12_migration_sprint.md`](12_migration_sprint.md).
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
- [`12_migration_sprint.md`](12_migration_sprint.md) â 3-phase migration sprint plan (Cloud Run + Empressa Neon + Drizzle migrate)
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
- [`90_runbooks/cloud_run_canary_deploy.md`](90_runbooks/cloud_run_canary_deploy.md) â Cloud Run canary deploy runbook (build â 0% canary â smoke probe â traffic shift â backup tag â observation)
- [`90_runbooks/replit_deploy.md`](90_runbooks/replit_deploy.md) â Replit deploy runbook
- [`91_postmortems/2026-05-05_track_b_deploy_saga.md`](91_postmortems/2026-05-05_track_b_deploy_saga.md) â Track B postmortem

**Archived:**
- [`_sessions/archived/2026-04/2026-04-18_strategic_record.md`](_sessions/archived/2026-04/2026-04-18_strategic_record.md) â strategic conversation record snapshot (extractions live across `13`, `15`, `17`, this roadmap, and product home docs)
- `_sessions/2026-05-05_*` â multi-repo recon summaries (rolled up into `10_ground_truth.md`)

Items marked `userMemories` (no doc yet) are tracked only in this roadmap and in Claude.ai planner memory until they earn their own canonical doc.
