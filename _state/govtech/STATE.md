# Govtech seat state

**Created 2026-08-24.** Namespace `govtech`. Branch `seat/govtech`. Carries OPS-17 lanes B, C and D: SmartCity Dashboards, plan review, Smart Files, ICC.

## Why this seat exists

Operator ruling 2026-08-24: "seat on govtech, i have a long ways to go on the property seat." Four repos moved off the property seat so the two programs stop sharing a writer. Property keeps `legacy-design-tools`, `hauska-engine`, `hauska-map` and `smartcity-os`.

**`smartcity-os` deliberately stayed with property and remains ABSOLUTE NO-TOUCH.** It is this seat's subject, not its property. Bastrop v2 is built alongside the live city and cut over later by a named card. Read it only from a fresh clone in scratch, never from `P:/smartcity-os`.

**No branch is pinned on the four product repo entries, by design.** This seat ships through per-PR feature branches, and `seat-worktree-gate` only enforces a branch when the register entry declares one. The doc_repo entry does pin `seat/govtech`.

## Standing rules for this seat

- Product repos: branch, PR, merge on green. This seat may merge its own branches.
- Does not write property, markets or substrate repos. Request changes from the owning seat.
- `hauska-mcp-server` and `hauska-atom-contract` are SUBSTRATE seat property. Every ICC meter, gate and rate change is a request to that seat, not a write from here.
- `hauska-engine` is PROPERTY seat property. The ICC ingest and the `?? "public-free"` writer default live there and are requests, not writes.

## OPEN

**PR #6 plan-review, OPEN not merged, CI `success` at `93fd897`.** Smart Files scope gate on the BFF plus this repository's first CI. The gate NARROWS and does not close: persona is a localStorage string any caller can set, so it binds a request to one org rather than authenticating it. Closing needs read-path scope enforcement inside Smart Files keyed to a verified identity, which revisits the PR #5 ruling of 2026-08-17.

**Live exposure, verified 2026-08-24, unresolved until PR #6 merges.** `GET https://plan-review-app-ten.vercel.app/api/backend?path=/api/smart-files/folders&scopeType=tenant&scopeId=<tenant>` returns 200 with `tenant-private` folder listings, unauthenticated, for any tenant named. Reproduced on `icc-demo`, `template-city`, `acme`. Only demo tenants exist today, which is timing and not a control.

**No branch protection on any repo in this seat.** `plan-review`, `smartcity-dashboards`, `smart-files`, `smartcity-kit` and `icc-portal` all read `protected: false` with no rulesets, verified 2026-08-24 by two instruments and confirmed against a positive control. Branch Protection Stage 1 (2026-08-20) covered `doc_repo`, `hauska-map`, `hauska-engine`, `legacy-design-tools`, `empressa-trading` and `smart-markets` and never covered these. **The 2026-08-20 VPAT scope map states protection is present on all four product repositories; that sentence is wrong.** It does not require a correction to the shipped ACR, whose stated conclusion was that green is a courtesy and nothing blocks a release, which remains true.

**Scope document:** `_inbox/2026-08-24_govtech_program_scope.md`. Four scopes, 43 items, five rulings, six ordering constraints, built from six read-only code reviews at recorded commits.

## Rulings taken

- **PermitFlow is EXTINGUISHED** (operator, 2026-08-24). An old prototype, no longer used. Plan review as surfaced in Dashboards is the version to build out. Nothing is owed to PermitFlow compatibility: it has no document handling at all and its data is seeded fixture.
- **Intake is staff upload**, not a permit-system integration (operator, 2026-08-24). MyGov is not a Wave 1 dependency.
- **Wave 1 runs on `template-city`, not Bastrop** (operator, 2026-08-24). The demo city doubles as the end-to-end test and the reseller demo.
- **The finding engine MIGRATES OUT of `hauska-engine` INTO the `plan-review` repo** (operator, 2026-08-24). Hauska is substrate only per ADR-008; plan review reasoning is Empressa product logic and does not belong in the substrate engine. Nothing replaces it there. The planner had recommended the opposite (delegate to the engine) and was corrected on the layer rule. A shared reasoning home was considered and rejected: with exactly one consumer it is how a fifth implementation appears.
- **Smart Files serves the WHOLE CITY and must not depend on the city buying plan review** (operator, 2026-08-24). Plan review and SmartCity are PEER CONSUMERS of Smart Files; each consumes independently or composes into one system. Smart Files is now a first-class scope, not plan review's document plane.
- **One app is acceptable** provided the ruling above holds, and provided each product stays independently deployable and independently sellable. `SCOS-FILE-DEP` (25,000) and `SCOS-PLAN-DEP` (42,000) are separate SKUs; a city must be able to buy filing without plan review.
- **Fourth demo pack approved.** It makes `ungranted` reachable. It does NOT deliver a full demo city: a pack selects and re-seeds, it does not author.
- **SmartSite is PARKED** for its own discussion (operator, 2026-08-24). Out of scope except where Dashboards embeds it.

## Rulings owed

- Source payment model: flat per-reference, or percentage of a settled customer payment. Planner recommends flat.
- Which ICC ledger is authoritative: `plan_review_activity` (works, carries the numbers) or `source_obligation_ledger` (designated source of truth, empty, zero readers).
- `spireon` / `patrol-vehicles`: planner recommends keeping it ungranted, because it is the only running proof that `ungranted` is implemented rather than described.
- Branch protection Stage 2: satisfy the reliability-report gate or drop it deliberately.
- Bastrop identity hold: deferred to Wave 2 by the template-city ruling.

## Corrections the planner made to its own reporting, 2026-08-24

Recorded because a fresh agent will otherwise re-derive the wrong versions from the session summary.

- **"The corpus has no building code at all" was over-generalised** from one artifact (`hauska-engine/services/retrieval-api/corpus/snapshot.json`, 2026-08-05) to the whole estate. Bastrop building-and-development content renders live under `did:hauska:code-section:bastrop_tx-bdc-2026-adopted/…`, an identity that also carries an adoption marker.
- **Absent I-Code bodies are the LICENCE WORKING, not a gap.** The serving surface states `bodyVerbatim=false`. Per `75n` the contracted posture is deep-link display, never reproducing body text.
- **There are TWO ICC ledgers.** `plan_review_activity` (plan-review's Postgres, `rate DEFAULT 0.01`) is what the ICC portal renders and it works. `source_obligation_ledger` (MCP) is the designated source of truth and is empty with zero readers. The earlier claim that "one citing surface accrues nothing at all" was wrong; the real finding is a reconciliation problem.
- **ADR-018 is SATISFIED**, contrary to a stale memory index line the planner carried into the session and stated to the operator.
- Still true and still real: `R311.7` and `R302.1` are IRC sections labelled as 2018 Building Code with IBC book ids, on the ICC-facing surface.

## The defect class this seat inherited

Enforcement and provenance written on the write path and absent on the read path, with defaults fabricated rather than refused. Ten instances across five repos, listed in the scope document. Every card in this seat carries its share, and no card may add an eleventh.
