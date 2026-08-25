---
id: 2026-08-24_govtech_program_scope
title: Govtech program scope — Smart Files, plan review, SmartCity, ICC and payment
status: active
last_updated: 2026-08-25
applies_to: portfolio
owner: nick
related:
  [
    90_operations/OPS-17_govtech_stack_plan_of_record,
    _inbox/2026-08-24_govtech_transaction_contract,
    _inbox/2026-08-24_govtech_engine_migration_plan,
    _inbox/2026-08-24_govtech_plan_adversarial_cp1,
    _inbox/2026-08-24_adr023_amendment_draft,
    _inbox/2026-08-25_govtech_execution_hardening_index,
    _inbox/2026-08-25_govtech_wave1_WDLL,
    90_operations/OPS-17_govtech_stack_plan_of_record,
    _decisions/2026-08-15_capability_mount_composition,
    _decisions/2026-08-16_plan_review_owns_files_ui,
    _inbox/2026-08-16_icc_demo_planner_pickup,
    _inbox/2026-08-20_vpat_scope_map,
    80_adrs/adr_008_engine_factor_out,
    80_adrs/adr_023_cortex_reporting_repo_designation,
    61_enforcement_doctrine,
    75n_icc_code_connect_catalog,
  ]
---

# Govtech program scope

Revision 3, 2026-08-24. Revisions 1 and 2 are recorded below rather than quietly replaced. Rev 3 aligns the scope doc with the adversarial CP1 review (`_inbox/2026-08-24_govtech_plan_adversarial_cp1.json`), files S5-1 and S2-1 plans into `_inbox/`, fixes S2-2 and O-2 against operator rulings, and adds an explicit Wave 1 critical path. **Live program board:** `canvases/govtech-master-program.canvas.tsx` (Cursor managed path under the workspace).

## Rulings taken 2026-08-24

| # | Ruling | Consequence |
|---|---|---|
| R-A | **PermitFlow is extinguished.** An old prototype, no longer used. Plan review as surfaced in Dashboards is the version to build out. | Nothing is owed to PermitFlow compatibility. It has no document handling at all and its data is seeded fixture, so plan review is a first implementation, not a migration with rollback risk. |
| R-B | **Intake is staff upload**, not a permit-system integration. | MyGov leaves the Wave 1 critical path entirely. |
| R-C | **Wave 1 runs on `template-city`, not Bastrop.** | No Bastrop pack, no lifting the identity hold, no dependency on a real adopted-code corpus. The demo city doubles as the end-to-end test and the reseller demo. |
| R-D | **The finding engine migrates out of `hauska-engine` into the `plan-review` repo.** | Hauska is substrate only (ADR-008). Plan review reasoning is Empressa product logic and does not belong in the substrate engine. This also collapses the four-homes problem in the right direction. |
| R-E | **Smart Files serves the whole city and must not depend on the city buying plan review.** Plan review and SmartCity are peer consumers; each can consume independently or compose into one system. | Smart Files becomes a first-class scope rather than plan review's document plane. |
| R-F | **One app is acceptable** provided R-E holds. | The presentation plane may converge; each product stays independently deployable and independently sellable, because `SCOS-FILE-DEP` and `SCOS-PLAN-DEP` are separate SKUs. |
| R-G | **SmartSite is parked** for its own discussion. | Out of scope here except where Dashboards embeds it. |
| R-H | **Fourth demo pack approved.** | Makes `ungranted` reachable. It does NOT deliver a full demo city; see Scope 1. |
| R-I | **`source_obligation_ledger` is authoritative.** | `plan_review_activity` is a cache that reconciles against it. O-2 is closed. S4-1 implementation remains open. |
| R-J | **Architect plan-review surface (home A) is DEFERRED**, not retired. | City-internal plan review is the build. Home A is a different product for a different user; see migration plan step 11. |

## Corrections to revision 1

Recorded because a scope document that silently repairs itself teaches nobody.

**The corpus claim was over-generalised.** Revision 1 said "the corpus has no building code at all." The measurement behind it was one artifact, `hauska-engine/services/retrieval-api/corpus/snapshot.json` generated 2026-08-05, in which 44 editions are municipal zoning and land-development and zero sections match an I-Code token. That is true of that file. It was turned into a claim about the estate, which it does not support. Bastrop building-and-development content renders live under `did:hauska:code-section:bastrop_tx-bdc-2026-adopted/…`, an identity that also carries an adoption marker, which weakens the companion claim that no adopted-edition concept exists anywhere.

**Absent I-Code bodies are the licence working, not a gap.** The serving surface states `bodyVerbatim=false · IBC body is not rendered`. Per `75n_icc_code_connect_catalog.md` the contracted posture is display by deep-link and never reproduce body text. Revision 1 reported the absence as a defect. It is the one place the licensing discipline is visibly holding.

**There are two ICC ledgers and revision 1 described only the starved one.** `plan_review_activity`, in plan-review's own Postgres, carries `rate numeric NOT NULL DEFAULT 0.01` and is what the ICC portal renders: 49 references, 0.49 accrued, plan-review-ui the top source. It works. `source_obligation_ledger`, in the MCP server, lands `amount_minor NULL / pending-rate` and has zero readers. The migration comment names the intended relationship: "Activity cache for /icc/activity. Source of truth later is the inbound ledger." The accurate finding is a **reconciliation problem**: the designated source of truth is empty while the cache carries the numbers. Revision 1's "one of your two citing surfaces accrues nothing at all" was wrong.

What survives from that review and is still real: `R311.7` "Stairways" and `R302.1` "Exterior walls" are IRC sections labelled as 2018 **Building** Code with IBC book ids and IBC deep links. Two rows, on the ICC-facing surface.

## How this was produced

Nine parallel read-only code reviews against fresh depth-1 clones at `origin/main` in a scratch directory, so no seat working tree was read and every claim carries a snapshot. Returns at `P:/tmp/scope_20260824/returns/`. Claims that reached this document were re-verified by the planner at source; several agent claims were corrected in the process and those corrections are inline rather than dropped.

| Repo | Commit | Repo | Commit |
|---|---|---|---|
| smartcity-dashboards | `238e023` | legacy-design-tools | `1fd6233` |
| smartcity-kit | `54efe8c` | hauska-engine | `60adb1f` |
| plan-review | `2b5a713` | hauska-mcp-server | `bdbb99d` |
| smart-files | `86975d0` | hauska-sdk | `60cdaa7` |
| smartcity-os | `e2fcdd1` | icc-portal | `e7a36a5` |

## The finding that governs every scope

One defect class runs through five repositories, found independently by reviews that were not told to look for it: **enforcement and provenance are written on the write path and absent on the read path, and defaults are fabricated rather than refused.**

| # | Instance | Repo |
|---|---|---|
| 1 | `atomVisibleToCaller` returns `true` on an absent `accessPolicy` | smartcity-dashboards |
| 2 | `/api/lenses/city-manager/compose` calls `resolveCaller` then never gates on it | smartcity-dashboards |
| 3 | Scope enforced on write only; the folder read's own comment says "a non-empty scopeId is the whole rule on this route" | smart-files |
| 4 | The BFF attached the service token for any anonymous caller | plan-review (**fixed, PR #6**) |
| 5 | `resolveAccessPolicy` returns `maybePolicy ?? "public-free"` on the atoms writer | hauska-engine |
| 6 | Code lookup resolves `IBC_SEED.find(...) \|\| chapterHits[0] \|\| IBC_SEED[0]`, serving a neighbouring section as the answer | plan-review |
| 7 | Retrieval failure caught into `codeSections = []` and the run completes as `succeeded` | legacy-design-tools |
| 8 | Repealed B3 setbacks served over HTTP as current law; the repeal exists only as a code comment | legacy-design-tools |
| 9 | Fabricated dashboard constants render identically to measured values | smartcity-os |
| 10 | `no-fixture-source` asserts "and no adapter is granted on it" without reading `grantedAdapters` | smartcity-dashboards |

This is one habit, and `61_enforcement_doctrine.md` already names it. The integration scope owns proving it closed, because a lane that fixes only its own instance leaves the class unowned.

## The target architecture

Ruled by R-D, R-E and R-F, and consistent with G-13 and capability-mount composition.

    Hauska substrate            atoms, retrieval, the MCP gate, the meter
        ^  service-http / MCP        (no product reasoning lives here)
        |
    Smart Files                 the city's filing system
        ^  service-http              own repo, own Neon, own service
        |                            independently sellable at SCOS-FILE-DEP
        +---------------------+
        |                     |
    Plan review           SmartCity Dashboards
    own reasoning         lens family over records
    SCOS-PLAN-DEP         SCOS-DASH-DEP
        |                     |
        +---------- optional composition ----------+
                    one shell, one design system

Three rules that fall out of it and bind every card:

**The data plane does not merge.** Separate repos, separate databases, separate services. Consumers reach suppliers by HTTP service token or the one MCP server, never a DSN and never a copied table as system of record.

**Each product stands alone.** A city can buy filing without plan review, and plan review without Dashboards. Composition is a capability, not a precondition.

**Product reasoning never lives in the substrate.** R-D moves the finding engine into plan review. Nothing replaces it in `hauska-engine`.

### On the iframe

G-13's Application column names an embed for exactly one supplier, SmartSite. For Smart Files it names HTTP plus a service key; for plan review it says Cloud Run HTTP plus Codex tools on the one MCP. **Both current iframes are deviations from that contract, not implementations of it**, and the product's own UI copy says so: "Native compose is a later card."

The convergence is unusually cheap here. The three products are plain Node with no framework, no bundler and no build step, and the design system is CSS classes, framework-agnostic. A shared React component package is ruled out on inspection: the kit is React, is imported by **zero** of the three products, and vendors copies **from** dashboards rather than to them.

Scope cannot travel today under any option: there is **no `postMessage` anywhere in any of the four repos**, so the embed boundary is one-way, and `plan-review/web/app.js` hardcodes `const CITY_KEY = "template-city"`.

## Wave 1 — the template city, end to end

The demo and the end-to-end test are the same artifact. This is what makes the reseller work not a detour.

**Definition of done:** a submittal uploaded by staff into Smart Files on `template-city`, reviewed against a code corpus whose edition is declared, producing determinations that cite real sections with honest absence where we have not looked, accruing a reference to ICC in the store designated as the source of truth, all inside one shell, with each product still able to run standalone.

### Doc hygiene (DOC-*)

| id | Item | Status |
|---|---|---|
| DOC-1 | Transaction contract filed | done — `_inbox/2026-08-24_govtech_transaction_contract.md` |
| DOC-2 | Engine migration plan filed | done — `_inbox/2026-08-24_govtech_engine_migration_plan.md` |
| DOC-3 | Scope S2-2 deferred not retired | done — rev 3 |
| DOC-4 | OPS-17 rows G-105–G-110 | done — A-085 in `90_operations/OPS-17_govtech_stack_plan_of_record.md` |
| DOC-5 | ADR-023 amendment draft | draft filed — `_inbox/2026-08-24_adr023_amendment_draft.md`; operator ratify before S2-1 execute |
| DOC-8 | govtech STATE refreshed | done — `_state/govtech/STATE.md` |

**Dispatch:** compile with `node scripts/dispatch.mjs --plan OPS-17 --lane <ID> --plan-row G-105` (or G-106–G-110). Live board: `canvases/govtech-master-program.canvas.tsx`.

## Wave 2 — Bastrop v2

Everything that makes Dashboards a complete city product: the feed record path against real vendors, the remaining lenses, the Bastrop pack, MyGov, and the cutover. Live Bastrop stays no-touch throughout; v2 is built alongside and cut over by a later named card.

---

## SCOPE 1 — Template city and the demo engine

**A pack selects and re-seeds. It does not author.** A generator receives `(pack, seedFor)` and reads two fields: `cityKey` and `accessPolicy`, and `cityKey` is itself the entire seed. So a fourth pack re-seeds, changes the seal and title, and selects which catalogued kinds demonstrate. It cannot change a record's content, count, vocabulary, or which lenses exist. All richness lives in `src/domains/*.mjs` and the UI. **R-H is real but small; it is the last step, not the first.**

The product is further along than it looks: eleven registered domains, 171 planned records across ten populated ones, five of six Development-services tabs wired, four department lenses rendering through one shared four-state renderer. **Development services is architecturally done** and denser plans is the whole remaining job there.

### Demo feeds

There is exactly one feed path and it is real end to end: fetch, parse, write to Smart Files, read back, render. What blocks a rich demo pack from carrying a feed is one rule:

    if (pack.generatesFixtures) {
      if (pack.grantedAdapters.length > 0)
        throw new Error("a pack that generates fixtures grants no adapter");
    }

**That rule is not arbitrary. It is the control that closed G-74**, the identity leak where template-city hydrated Bastrop's clerk meetings. Its own comment says so. The fix is not to delete it but to make the two record kinds structurally distinct, so one pack can carry both without collapsing identity.

**A synthetic source is the real seam, not a parallel fake.** `fetchMunicodeMeetings` takes a `sourceUrl` and has no notion of demo, and `assertPublicFeedSourceUrl` would accept an external static host today with zero source changes.

**The test every step in this arc is held to:** does the demo feed enter through the same function a real vendor's would, differing only in `grant.sourceUrl`? If any boolean anywhere means "this is the demo", it is a wrapper and it gets thrown away.

| id | Item | Size | Depends on |
|---|---|---|---|
| S1-1 | Fix `no-fixture-source` to read `grantedAdapters`. True today only because no shipped pack has a grant; the first connected pack ships a false sentence on eleven surfaces. | S | none, do first |
| S1-2 | Close the money gate. `"1.4 million"` passes the content gate, the vocabulary gate and all nine `includes("$")` tests. A Finance demo is exactly what would print it. | S | none |
| S1-3 | Correct the Connections register: four subjects dispositioned "Not built" render 72 records across four shipped tabs. Hand-declared and drift-capable both ways. | S | none |
| S1-4 | Densify the eleven domain plans. Cheapest high-value work in the program. | M | S1-1 |
| S1-5 | Overview metric strip and decision queue: four hardcoded "Not read" tiles above ten populated lenses. | M | S1-4 |
| S1-6 | Split `composeDomain` into `composeGeneratedDomain` and `composeFedDomain` over one envelope validator, with a resolver that cannot fall through. **Not an `if`** — that would convert the product's one structural control into a conditional one. | **L** | S1-1 |
| S1-7 | Three-state source model (fixture / feed / none) replacing the `generatesFixtures` implies `demo` coupling, so one pack can carry both kinds without identity collapse. | M | S1-6 |
| S1-8 | First demo feed against a synthetic https source, entering through the real vendor function. | M | S1-6, S1-7 |
| S1-9 | Finance lens data path. Three independent blockers, including `FORBIDDEN_KEYS` containing `amount` and `fee`. | **L** | S1-2, S1-6 |
| S1-10 | Citizen lens data path. No catalogued vendor family exists and "CRM feed" is dispositioned *Killed, not a city feed*. | **L** | S1-6 |
| S1-11 | Fourth demo pack (R-H), so `ungranted` is reachable on Development services. | S | S1-4 |
| S1-12 | Make `granted-empty` reachable. No pack shape can produce it; every generator plan carries a literal non-zero count, proven across twenty seeds. | M | S1-11 |
| S1-13 | Gate `/api/lenses/city-manager/compose` on `packContentReadStatus`, and add the authenticated files branch. **Keep** the existing anonymous test as the guard on the anonymous path; do not change it. | S | none, do first |
| S1-14 | Fail closed on unknown or absent atom `accessPolicy`. | S | none |
| S1-15 | Supply `HAUSKA_MCP_URL`. Without it `caller.kind === "tenant"` is unreachable, so `tenant-private` is unusable. | S | none |
| S1-16 | Pack-scope the plan-review and Smart Files mounts; de-hardcode `CITY_KEY` on the supplier side. Valuable under every composition option. | M | none |

**One decision, not a build.** `spireon` is deliberately withheld so `patrol-vehicles` renders built-and-sourceless. Granting it to make Police look full deletes the product's only running proof that `ungranted` is implemented rather than described. Recommendation: keep it ungranted; add a second Police domain if fullness is wanted.

## SCOPE 2 — Plan review, including the engine migration

R-D settles the architecture. There were four homes for plan review logic: cortex-api routers in ldt (live, serving a SPA there), a 2,908-line unmounted BFF whose own test asserts it stays unmounted, the plan-review service, and `hauska-engine /v1/findings/generate*` where the reasoning actually went. The plan-review service **duplicates rather than delegates** — its only outbound hosts are the ICC API, a map embed, the MCP server and its own app, and it explicitly refuses cortex-api as a backend.

The engine is an **issue emitter, not a section adjudicator**: one LLM call whose closing instruction is "the findings array MAY be empty", output is severity, category, free text and citations. Everything after the model validates that citations **resolve**, never that findings are **true**.

| id | Item | Size | Depends on |
|---|---|---|---|
| S2-1 | Migrate the finding engine from `hauska-engine` into `plan-review`. Nothing replaces it in the substrate. Plan: `_inbox/2026-08-24_govtech_engine_migration_plan.md`. | **L** | DOC-5, DOC-2 |
| S2-2 | **DEFERRED:** architect pre-submittal surface (home A). Not retired in Wave 1. Home B (unmounted BFF) retirement is separate and mostly done. | **L** | parked |
| S2-3 | Kill the code-lookup fallback. An unknown section refuses; it never returns a neighbour. | S | none, do first |
| S2-4 | Fix the IRC-labelled-as-IBC seed, or delete it with the engine migration. | S | S2-3 |
| S2-5 | Kill mock mode as a default. It fabricates a `blocker` at confidence 0.92 claiming a setback violation. Verified **not** live — serving revision `hauska-engine-api-00174-zus` runs `AIR_FINDING_LLM_MODE=grok` with `XAI_API_KEY` bound — but a default that invents a high-confidence blocker is one missing key from being live. | S | none |
| S2-6 | Build the staff upload path end to end into Smart Files, with provenance and freshness stamps. There is no file input, no `FileReader` and no base64 in the UI today; the backend endpoint is unreachable from the interface. | **L** | DOC-1, S3-1, S1-17 |
| S2-7 | Real applicability matrix replacing four hardcoded rows; make `Pass` and `Fail` reachable. The determination vocabulary **already exists** as a CHECK constraint in `plan-review/sql/001_foundation.sql`. | **L** | S2-1 |
| S2-8 | Typed absence on the code path: never-looked, source-down, paywalled, genuinely-absent. The typed guard exists and is exported; `findings.ts` does not import it. | M | S2-1 |
| S2-9 | Edition as a selector, not a label. Reads filter on jurisdiction alone; `toCodeSectionInput` drops edition entirely so the model never sees which edition it cites; `annotateEditionCurrency` compares our-scrape to our-latest-scrape, fails open, and is starved. | **L** | S2-1 |
| S2-10 | Vintage that means adoption, not scraping. All 44 editions in the snapshot carry `effectiveFrom === fetchedAt`. | M | S2-9 |
| S2-11 | Reconcile the two edition parsers: one splits three segments correctly, the other slices at the first slash and returns the jurisdiction as the edition. | S | S2-9 |
| S2-12 | Stop serving repealed B3 setbacks. One accessor declines them and a mounted anonymous route calls the other. Add `repealedOn` to the schema and validate it. | M | none |
| S2-13 | Corpus fidelity pass: 17.03% of sections in the snapshot have empty bodies, and B3 has title/body mis-association from PDF extraction. | M | S2-9 |
| S2-14 | Remove Cotality. Six `COTALITY_*` secrets are mounted on production engine-api; adapters remain in `ALL_ADAPTERS`; `cotality:hazards` is still a hardcoded key. | M | none |

Branch protection and CI for the five govtech repos is **S5-4 only** (S2-15 retired as duplicate).

### Accuracy, which is a Scope 2 deliverable in its own right

Three tiers are measurable today with no vocabulary change, and one is not:

| Tier | Measurable now | Golden set |
|---|---|---|
| Retrieval accuracy | yes | small |
| Corpus fidelity | yes | none |
| **Citation faithfulness** | **yes** | **none** |
| Per-section determination ("84% accurate") | needs S2-7 | 40–50 submissions |

**Citation faithfulness is built first.** It needs no ground truth, and it is the check that catches the IRC-as-IBC seed and any wrong-edition citation.

Golden set sizing: one submission end to end, then 10 to 15 to rank error classes, then 40 to 50 before any calibration claim, reporting missed Fails and false Fails separately.

Two reasons the existing eval harness is not watching: it imports a **drifted duplicate** of the production engine (37 differing lines in `engine.ts`), and its CI path filters watch a directory that is not the one that runs reviews.

| id | Item | Size | Depends on |
|---|---|---|---|
| S2-16 | Citation faithfulness harness. | M | S2-4 |
| S2-17 | Point the eval harness at the real engine and fix its path filters. | S | S2-1 |
| S2-18 | Golden set, n=1 first. | M | S2-6, S2-7 |
| S2-19 | Calibration write-back. Reviewer accept/reject/override is captured richly and routed nowhere; the outcome ledger's three kinds are all confirmations, so **no row can say a finding was wrong** and confidence can only ratchet upward. The consumer is built — `resolveReadPathConfidence` already returns `kind: "calibrated"` — and its input is never supplied. | **L** | S2-18 |

## SCOPE 3 — Smart Files as the city's filing system

R-E promotes this from plan review's document plane to a first-class product. Structurally it already has what it needs: own repo, own Neon project, own Cloud Run service, per G-58. What it lacks is a life outside plan review.

| id | Item | Size | Depends on |
|---|---|---|---|
| S3-1 | Read-path scope enforcement on `listFolders`, `listFolderFiles`, `readDocument`, `getBlob`, keyed to a verified identity. Revisits the shipped PR #5 ruling, so it is a decision, not a patch. **This is what actually closes the exposure PR #6 only narrowed.** | **L** | ruling |
| S3-2 | City-shaped scoping: departments and record series rather than one flat tenant. | **L** | S3-1 |
| S3-3 | Retention and disposition. A city filing system without them is not a filing system. | **L** | S3-2 |
| S3-4 | City-wide search across series. | M | S3-2 |
| S3-5 | A Files lens in Dashboards that is not the plan review tab, and does not require plan review. | M | S3-2 |
| S3-6 | Replace the embedded QA UI. The panel currently hides its persona selector with `display: none !important`, leaving it on its first option, so a city sees **`acme/joe`'s folders** with no control to change it. | M | S3-5 |
| S3-7 | Real product UI at city altitude, standalone-capable, per R-F. | **L** | S3-2 |
| S3-8 | Typed absence and a proven STALE indicator on the artifact store. | M | S3-1 |

## SCOPE 4 — ICC and payment

**Nothing charges money anywhere today, not even in sandbox.** ADR-018 is satisfied, contrary to a memory carried into this session and stated to the operator: `@hauska-sdk/metering` is a production dependency, `McpMeteringGate.authorizeCall` runs before serve, a CI test enforces the boundary, and remaining Stripe references are a `stripe_customer_id` column, not a charging path.

| id | Item | Size | Depends on |
|---|---|---|---|
| S4-1a | **Ruling closed (R-I):** `source_obligation_ledger` is authoritative; `plan_review_activity` is cache. | — | R-I |
| S4-1b | **Implement reconciliation:** one write path into obligation ledger; activity repointed; dedup keys; no double-count. | M | S4-7, DEPLOY-75, S4-0 |
| S4-2 | Fix the MCP plan-review meter bypass: `wrap()` builds an envelope with a hardcoded empty provenance array and the accrual guard is `atom_ids.length > 0`. One function. | S | none |
| S4-3 | Populate `sourceActorDid` across all envelope builders. Reached by 3 of roughly 20 today, so `search_atoms` returning real ICC sections accrues zero. | M | none |
| S4-4 | Reconcile the two ICC detectors onto one definition. `access-policy.ts` matches on adapter **or** jurisdiction tenant; `source-obligation-meter.ts` never checks the tenant, which under-counts against a licensor. | S | none |
| S4-5 | Fix the `?? "public-free"` writer default to refuse, and stamp all four ICC atom types. Only `code-section` is stamped today. | M | none |
| S4-6 | Backfill existing rows, **after** S4-5 or the next ingest undoes it. | M | S4-5 |
| S4-7 | Record the **cited** atom, not the served one, and add `book_id` and `section_id`. ICC cannot currently determine which of their sections were referenced. | M | S4-4 |
| S4-8 | Give the source-of-truth ledger a reader: query, statement, invoice. | M | S4-1b, S4-7, DOC-1 |
| S4-9 | Rate resolution from an actor atom or rate table. The value currently lives on a fixture inside the `@empressaio/atom-contract` npm package, so setting it is a package publish. | M | open ruling |
| S4-10 | Fix the `billed` semantic. It means authorized, not paid, and feeds the Command Center revenue panel. | S | none |
| S4-11 | Circle webhook route and a durable routing ledger. `RevenueRouter` is wired to an in-memory ledger on a service running up to ten instances. | **L** | open ruling |
| S4-12 | G-50 accessPolicy flip. `atoms.access_policy` is a **write-only column** — reads are `SELECT body` and the gate reads the JSONB body — so the obvious `UPDATE` is a silent no-op. Needs `jsonb_set` plus code. | M | S4-5 |
| S4-13 | Fix `publish.yml`: it iterates `packages/*/package.json`, matching 6 of 13 workspaces, so seven adapter packages are unreachable by CI publish. | S | none |

**Non-negotiable ordering:** fix the bypass and the detectors **before** setting a real rate. A real number over an under-counting meter converts a visible gap into silent underpayment to a licensor.

### Operator and business items, which are not engineering

| id | Item |
|---|---|
| S4-B1 | Agree a per-reference rate with ICC in writing. The single input that turns a fixture rate into a real one. |
| S4-B2 | Open the Circle account and replace the placeholder secrets. Operator-only per `deploy/secrets.md`. |
| S4-B3 | Run the ICC demo and execute the SaaS agreement (G-50). |
| S4-B4 | Settle IPMC. "Empty upstream" and "not entitled" are indistinguishable from code. |
| S4-B5 | Tax and reporting treatment for royalty payouts. |

## SCOPE 5 — Integration

The collision point is one transaction: **a submittal reviewed against a declared code edition, producing a determination that cites a section and accrues a reference.** It crosses every scope. Built as parallel lanes, each will invent its own definition of a citation and they will meet at integration, which is the failure OPS-17's preamble was written to prevent.

| id | Item | Size | Depends on |
|---|---|---|---|
| S5-1 | **The transaction contract, filed before lanes build.** `_inbox/2026-08-24_govtech_transaction_contract.md`. Lanes gate on DOC-1 (filed copy), not scratch. | S | none |
| S5-2a | Deploy cut + live violation probes (#7+#39 together; #75; #361). | M | DEPLOY-7, DEPLOY-39, DEPLOY-75, DEPLOY-361 |
| S5-2b | Cross-repo bypass inventory (writer, load-snapshot, MCP withhold retirement). | M | S4-5, S4-6 |
| S5-2c | Seam vocabulary conformance (citation validator, absence type, accrual fields). | **L** | DOC-1 |
| S5-3 | Presentation convergence per R-F, with independent deployability preserved. | **L** | DOC-1 |
| S5-4 | CI and branch protection across the five govtech repos. None has protection today; `plan-review` had no CI at all until PR #6. Stage 2 requires a check to have already run on the protected branch. Two traps: **skipped counts as passing**, and **job renames break required checks silently**. | M | PR #6 merged |
| S5-5 | Wave 1 end-to-end proof on `template-city`. The program's definition of done. | **L** | see Wave 1 critical path |
| S5-6 | One honest status surface: what is fixture, what is fed, what is absent, per city and per lane. | M | S1-6 |

## Wave 1 critical path

Minimum chain to satisfy S5-5 without lying. Full board lives in `govtech-master-program.canvas.tsx`.

1. **DOC-1** — transaction contract filed (done: `_inbox/2026-08-24_govtech_transaction_contract.md`)
2. **DOC-5 (draft filed), DOC-2, DOC-4** — ADR-023 amendment draft at `_inbox/2026-08-24_adr023_amendment_draft.md` (operator ratify); migration plan filed; OPS-17 G-105–G-110 via A-085
3. **DEPLOY-7, DEPLOY-39** — plan-review #7 service + Vercel together; dashboards #39
4. **DEPLOY-75, DEPLOY-361, S4-0** — substrate MCP #75; property engine-api #361; migration 009 applied probe
5. **S1-17** — resolve `template-city` vs `icc-demo` tenant identity
6. **S3-1** — Smart Files read-path scope (closes defect #3; PR #6 only narrowed BFF)
7. **S2-6** — staff upload into Smart Files
8. **S2-9, S2-8, S2-7** — edition selector, typed absence, applicability matrix (after S2-1 migration or scoped ICC-model interim)
9. **S4-2, S4-4, S4-3, S4-7, S4-1b, S4-8** — meter deployed; cited atom recorded; reconciliation; obligation ledger reader
10. **S5-2a–c** — deploy probes, bypass inventory, seam vocabulary
11. **S5-3, S5-5** — shell composition proof on template-city

## Execution hardening (2026-08-25)

Wave 1 build lanes require an approved WDLL and file-based instruments before grading. Full index: `_inbox/2026-08-25_govtech_execution_hardening_index.md`. WDLL: `_inbox/2026-08-25_govtech_wave1_WDLL.md` (15 items; **operator approval pending**). G-105 dispatch cites WDLL items 1–4 (deploy violation probes). Interim engine path decision: `_decisions/2026-08-25_govtech_wave1_interim_engine_path.md`.

## Latent fail-open register

Same defect class as the ten instances; tracked explicitly so "no eleventh" does not hide them.

| id | Instance | Seat | Blocks Wave 1? |
|---|---|---|---|
| L1 | `canReadPack` defaults unknown `pack.accessPolicy` → `public-free` | govtech | partial |
| L2 | `load-snapshot-into-pg.mjs` bypasses writer `resolveAccessPolicyOrRefuse` | property | yes (S4-5) |
| L3 | `verified-absent` (plan-review) vs `absent-verified` (Smart Files) | govtech | yes (S5-2c) |
| L4 | `chat.ts` accepts `mode: "mock"` | govtech / property | partial |
| L5 | ICC withhold at `access-policy.ts:87` compensates mis-stamped atoms | substrate | until S4-6 |

## Ordering constraints

Not a schedule. These are places where doing the second thing first causes harm.

1. **PR #6 merged before wiring Smart Files service key for any real city.** Done. S3-1 still closes the Smart Files read path.
2. **Fix the `?? "public-free"` writer default before backfilling access policy**, or the next ingest undoes it.
3. **Deploy meter bypass and detector fixes (#75) before setting a real rate**, or a visible gap becomes silent underpayment. Merged ≠ deployed.
4. **Deploy code-lookup fix (#7 service + Vercel together) before any real determination**, or fabrication returns on the ICC surface.
5. **Split the compose seam before connecting any feed**, and never as an `if`.
6. **File S5-1 contract (DOC-1) before cross-scope lane work.** Gate: DOC-1, not scratch.
7. **Draft ADR-023 amendment (DOC-5) and file migration plan (DOC-2) before executing S2-1.**
8. **S4-6 backfill before G-50 flip (S4-12).**

## Open rulings

| # | Ruling | Blocks |
|---|---|---|
| O-1 | Source payment model: flat per-reference, or percentage of a settled customer payment. Recommendation: **flat**. Do not set a real rate until DEPLOY-75 + Wave 1 accrual probe pass. | S4-9, S4-11, S4-B1 |
| O-2 | ~~Which ledger is authoritative~~ **CLOSED by R-I.** Implementation is S4-1b. | — |
| O-3 | `spireon` / `patrol-vehicles`. Recommendation: keep ungranted. | S1-11 |
| O-4 | Stage 2 protection: satisfy the reliability-report gate or drop it deliberately. | S5-4 |
| O-5 | Bastrop identity hold — deferred to Wave 2 by R-C. | Wave 2 |
| O-5a | Connections disposition values undefined. Four DS rows moved to `Empty` on inferred meaning. | S1-3 remainder |

## What could not be established

Carried forward rather than guessed, each with its settling probe.

- Whether `HAUSKA_MCP_URL` is set on the live dashboards service.
- What the `city_packs` table contains. A stray `bastrop` row would already be failing `/api/city-packs` in production.
- Whether migrations 008 and 009 are applied to the deployment Neon. If 009 is unapplied, accruals throw into a caught branch and an empty ledger is indistinguishable from no traffic.
- How many ICC-by-tenant atoms lack the adapter marker, which sizes the under-count. One SQL query.
- Whether real PermitFlow rows accumulated on top of the seed. Moot under R-A except for data disposition.
- Whether 171 demo records **looks** full. Nobody rendered a page.
- All clones were depth-1, so no claim of the form "X was removed on date D" is supported by this pass.
