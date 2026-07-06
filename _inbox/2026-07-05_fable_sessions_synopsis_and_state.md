# Fable sessions synopsis + built-since state (2026-07-05)

Context capture requested by Nick: the two first Fable sessions (2026-07-03 O&G wedge, 2026-07-04 stack audit), what has been built since, what is in flight. Planner opinion delivered in chat; this file is the durable record.

## Session 1 — 2026-07-03: the O&G wedge (transcript 5fb0b08a)

Started as "build a complete 3D representation of all Texas Railroad Commission data as a paid wedge product" with per-company private IPFS overlays and a land administration system feeding a marketplace. The session reshaped it substantially and the reshaping was accepted:

- **Public/private split corrected to spine terms.** RRC twin = public spine graph (public-free/public-paid); company data = tenant-private overlay edging into the public graph by stable ID, never pooling; marketplace = verified overlays checkable against RRC ground truth. One graph split by accessPolicy, not two systems.
- **"Pay for the model" rejected** as a commitment-1 violation (data resale). Paid tiers are reasoning/composition; raw public atoms are free. The twin is the acquisition loss-leader, not the moat, and must not be framed as the moat on the record.
- **Who writes the first check (forced in adversarial review):** the landman or small operator's land function; the job is "never lose a lease to a missed obligation." First check = land-admin subscription (obligations engine + document workspace + twin as spatial view of their book). Herbert's one-line reply then pulled **title** up to co-headline with obligations, and a 2-3 tract Reeves title slice entered the skeleton.
- **Scope:** Permian deep (TX 08/8A/7C + NM OCD Eddy/Lea) → **Reeves County walking skeleton first**, full data-type and viz-layer set, to prove collection + plumbing + viz before scale.
- **One spine, separate repo.** O&G atom families extend `@hauska/atom-contract`; RRC/NM adapters feed the same engine/retrieval spine; the new repo holds only O&G ingestion + twin/admin app. Payoff named: the unified surface+subsurface map nobody else can hold on one substrate.
- **Other rulings:** new fleet + repo (RE spine was waiting on Cotality/Chris); backend adjudication admin panel is core (it IS the cost-per-jurisdiction human-review gate and calibration capture point); water/injection upfront and its own tier; resolved-identity graph as a tier and the A&D buyer list; Empressa branding, name held open ("empressa land"-shaped); slb_prototype harvested but kept separate; GTM = self-serve landman/SMB + sales-assisted enterprise on one product, no bespoke builds; adversarial review replaced premortem for this commitment (operator called the logged premortem stale).
- **Gate at session end:** commitment package explicitly held behind Herbert's recorded review → fold corrections → adversarial review → then decision record + contract extension spec + fleet dispatch. Artifacts produced: `_verticals/oil_gas/85_landman_data_model_review.md` (+title section), `86_executive_summary.md`. Open at close: Herbert tract selection, pipelines in/out, TexNet in/out, repo name.

## Session 2 — 2026-07-04: the stack audit → convergence program (transcript c43ae5ff)

Ten-agent audit of nine repos + doc_repo. Verdict: "the substrate is more built than your docs say, but it exists in three diverging copies of the truth (docs, git, deployed/npm), and the highest-leverage move is not a new build, it is convergence."

- **Truth skew found:** contract 1.5.0 npm / 1.6.0 git-only, conformance+export source untracked (single disk copy); engine pinned 1.3.0; MCP four-gate stranded 12 days on PRs #32/#33; CLAUDE.md said 46 tools vs 59 deployed; SDK Circle rail built June, npm serving April; ~2,900 lines uncommitted engine TCE; Mox redesign uncommitted; fail-open accessPolicy filter in retrieval (security); Secrets.txt in repo root; ICC's 8 questions unanswered 12 days into a 180-day contract; Cotality demo expiring ~07-06.
- **Architecture assessment:** adapter contract is the best-factored code in the portfolio; leaky seams are the BFF boundary (traffic around it), five coexisting auth planes in cortex-api ("collapse to one plane, then add tenancy to that plane"), and monetization fully built but fully disconnected (metering is an ICC contract acceptance criterion, not discretionary). Governance surprise: empressa-trading is a 584-commit production trading cockpit absent from the doc set.
- **Rulings (repo-intent walkthrough Q1-Q15 → `_catalog/repo_intents.md` + five decision records):** Hauska = substrate only, everything else Empressa/SmartCity (six `@hauska/*` surface packages rename to `@empressaio/*`); legacy-design-tools retires by decomposition with a captured-elsewhere checklist; one master map + one command center (LAYER_REGISTRY, allocation policy: center sets MAY, apps set DO); trading console stays separate; smartcity-os absolute no-touch; AEC-cortex parked for Chris rework; land #32/#33 after fresh review; mox/slb/platform/radar-repo parked.
- **GTM pivot declared:** "get it to market and maximize our impact and footprint in each vertical as well as own the MCP market... make this a dominating tech stack." Doc repo to support product/bizdev/marketing.
- **Convergence program spawned** (Phases 0-4: rescue/truth → own the layer → tenancy → surfaces → monetization capture), planner plans/verifies/merges, Cursor executes, verification never delegated.
- **Opportunity map surfaced** (partially ratified): tenancy as the gate on four verticals at once; the atom contract as the product (three independent reimplementations = validation → open atom spec); time-travel retrieval unsold; conformance/export pair as the insurance wedge; federal adapter suite as a national Layer-1 MCP product; ICC two-screen PoC (cited reasoning + live revenue meter); data-center siting intelligence; proof-of-record; certification revenue; the grounding market. Nick ratified the atom spec, master map, ICC play, and the program itself; siting/robotics/proof-of-record/GTM band were proposed, not ratified.
- **Process friction on the record:** the npm publish saga (false "bypass confirmed," settled answer = CI tag-push publishing, never local CLI); execution burning the Max plan instead of Cursor (owned, corrected); the babysitting blowup ("supposed to be fully autonomous and I have done nothing but babysit it for 3 hours") resolved by session close + handoff to a fresh planner with the Workflow-style lesson written in.

## Built since (2026-07-04 → 07-05, verified per tracker + snapshot)

- **Truth converged:** `@hauska/atom-contract@1.6.1` live on npm (git/npm parity restored, conformance/export source rescued via PR #3); engine fail-open fix merged (#80, fail-closed); ldt mock-LLM fail-loud merged (#225); boot docs corrected; repo_intents filed; secrets deleted.
- **Deploy chain complete and live:** MCP four-gate deployed (migrations 004+005, 63 tools, gate matrix probed live; canary probes caught a latent keyed-request outage — dead Upstash — fixed with ResilientRateLimitStore PR #36); cortex-api `00288-lab`, engine-api `00031-rap` (contract 1.6.1 + ICC secrets), retrieval-api `00008-ber` all on current main with rollback handles.
- **ICC live end to end:** real OAuth endpoint found and verified, adapter reconciled to the real wire contract (engine PR #83), planner live run produced 4,966 IBC section atoms with deep links and reasoning-layer bodyText (ADR-019 boundary held). Corpus ingest run queued deliberately.
- **Tenancy T1 built and staged** across all three repos (mcp #37 producer, engine #84 + ldt #227 consumers, HMAC-signed gate context, log-only default), signing key staged unmounted; coordinated flip is operator-approved next step. DO-NOT-MERGE-IN-ISOLATION.
- **Surfaces:** command center live at cmdcenter-blush.vercel.app, Empressa-branded, server-side key proxy, console unification merged (hauska-map #6, five React panels, vanilla console retired).
- **Monetization scaffolding:** Stripe test-mode pricing created (Builder $49 / Pro $199 + layer2_call meter + metered overage); `@hauska-sdk/payment@0.1.1` published; three Phase 4 drafts filed for framing review (proof-of-record, certification scaffold, siting spike memo).
- **O&G advanced to activation drafts (2026-07-05, in _inbox, uncommitted):** `2026-07-05_draft_og_activation_decision.md` (one graph, three lenses; dependency path ADR-025 → RRC adapters Reeves-first → Reeves mint with non-vacuous eval gate → LAYER_REGISTRY keys → thin Chris BFF → 3D lateral lens; county-clerk title NOT activated) and `2026-07-05_draft_adr_025_og_atom_ontology.md` (contract 1.7.0 additive `./og`; operator rulings applied: mineral-lease/rrc-lease separate, obligation domain-neutral in core, interest/DOI tenant-private default, Empressa Land still working-name only; pooled-units routed to Herbert).
- **Honesty flag preserved:** the eval-scores artifact is NOT publishable (32/34 jurisdictions pass vacuously with zero queries evaluated); needs curated queries first.

## In flight / queued (dependency order per tracker)

1. ICC corpus ingest + eval + snapshot re-mint + retrieval data deploy, then extension PR #5.
2. Tenancy T1 coordinated flip (merge #37/#84/#227 → mount key → log-mode soak → enforce), then T2 tenant-private write.
3. MCP metering wire-up (layer2_call events at the tool-call layer).
4. Coordinated landings held for operator: rename PR #226, atom-spec PR #4, NPM_TOKEN CI publish path.
5. Eval-scores curated queries before any external use.
6. Upstash replacement decision.
7. O&G: ratify activation decision + ADR-025, Herbert corrections fold in before 1.7.0 freezes, then the six-step path.

**Operator-owed:** Cotality production keys (demo expires 2026-07-06 — the one dated external gate); extension key rotation; T1 flip approval; Phase 4 draft framing reviews; npm automation token; CLAUDE.md slim/audit; Herbert recorded review.

Planner opinion delivered in chat 2026-07-05; not restated here.
