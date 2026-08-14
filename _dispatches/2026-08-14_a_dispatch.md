CANON-PREAMBLE v0f465c77

- COTALITY IS EXTINGUISHED — when code hits it (502/OAuth/fallthrough), re-route to county-gis/public-record, NEVER rotate the credential. Regrid also dead.
- DEPLOYS ARE PLANNER-OWNED — the agent deploys and fixes failed deploys; never escalate a deploy to the operator; "failed on X, fixing X".
- NO PRIVILEGED DATA — everything via uniform public-record; any path must work for a no-relationship jurisdiction.
- CTX / national HELD until Bastrop QA-done + operator go.
- CODE-DONE != CUSTOMER-DONE — a grade is a live probe on the deployed surface across multiple different-data parcels, never a merged PR.
- Full standing-decisions detail: `MEMORY.md` (auto-memory) + `_decisions/`.

AGENT-CONTRACT vbcc3efb6 — you are bound by 90_runbooks/AGENT_CONTRACT.md in full (fan model,
interruption recovery, slot law + lease, heavy-scan serialization, verification rules, close schema).
Read it before any work; where this dispatch and the contract disagree, STOP and report.

DEV-PROCESS v48da8334 — you are bound by 90_runbooks/DEV_PROCESS.md in full. It governs how work
is SHAPED and how a result is JUDGED: coverage figures travel with their denominator, classes are
measured never subtracted, an instrument's exclusion set is part of its contract, gating indicators are
proven able to fire, paired controls need a divergence test, guardrails that do not survive a clone are
not guardrails. Every rule in it is traced to an incident. Read it before any work.

PLAN-ROW: G-14, G-10 (90_operations/OPS-17_govtech_stack_plan_of_record.md)
repo: legacy-design-tools

# Lane A — Smart Files foundation: a new atom family and its artifact store

## Mission — Lane A: Smart Files foundation

You are the LANE A planner. Smart Files is the twin's DOCUMENTS: the city-facing replacement for a
city's file system, and the foundation three other lanes consume. It is sequenced FIRST for that reason.

**This dispatch covers G-14 only** (the foundation), plus the half of G-10 that lane A must settle to
build anything. G-20, G-34, G-44 and G-53 are lane A rows but are NOT in scope here; they land in later
dispatches once the foundation exists. Naming them now so you can see where you sit, not so you build them.

### The governing rulings you inherit — do not relitigate these

- **Smart Files is a NEW atom family** (OPS-17 amendment A-012, operator-ruled 2026-08-14). It does NOT
  extend `brokerage_workspaces`. The brokerage CONCEPT is dead; the CODE under that name is the live
  property reasoning substrate, and its rename is backlogged as its own focused lane
  (`_catalog/repo_cleanup_backlog.md` item 25). **You do not rename anything. You do not refactor
  brokerage code.** Read it to learn from it; leave it alone.
- **Smart Files is a BUILD, not a rendering pass** (amendment A-002). Doc 34's open item 1 asserted the
  substrate was built and only a surface was owed; the G0 audit falsified that at the schema.
- **Doc 34's approved claims stay as written and get BUILT TRUE** (amendment A-003, operator ruling).
  You are building to a promise that is already published, at a price already submitted to a reseller.

### Why the existing schema cannot carry it — the premise of your work

`brokerage_workspace_attachments` (`legacy-design-tools/lib/db/src/schema/brokerageWorkspaces.ts:54-76`)
has **8 columns** and a single `notNull` FK to one workspace with cascade delete. Planner-verified at
source. It has **no `updated_at`, no `version`, no `cid`, no `access_policy`.** Therefore:

- *"A document lives once and appears everywhere it belongs"* is structurally impossible — one
  attachment belongs to exactly one workspace, so many placements means many copies, which is the exact
  problem Smart Files claims to solve.
- *"Revise once, current everywhere, and what it was before is still there"* has no schema at all. Only
  insert and delete exist.
- Production holds **142 workspaces and 0 attachments**. The files half was never written to.

Those three sentences are the promise in doc 34's approved-claims register. Your family must make them
true.

### What to build (G-14)

A Smart Files atom family and artifact store where, at minimum:

1. **A document is one record with many placements.** The placement relation is many-to-many. A
   document appearing in five places is one record and five relationships, never five rows.
2. **Revision is first-class.** A new version supersedes without destroying; the prior version stays
   retrievable. Nothing is silently overwritten.
3. **Every artifact carries provenance and a freshness stamp** — source, `computedAt`, `servedAt` —
   per inherited spine constraint 4. Smart Files is an artifact store, and a cache without a stamp is a
   liar waiting for load.
4. **`accessPolicy` is on the record**, resolved at read time (ADR-017), because "who sees what is
   controlled" is an approved claim and because lane B's Bastrop-private layer depends on it.
5. **The entityId shape is DECLARED, not reconstructed** (constraint 6). A document twin is not the
   parcel-keyed shape. Declare it and write it down; a wrong reconstruction silently matches zero rows
   and looks like an honest absence.

### Two planner findings to verify, not trust

- `artifacts/api-server/src/atoms/property-workspace.atom.ts` exists and its header says
  *"shape-only until workspace DB lookup ships"* — and it imports the OLD package name
  `@hauska/atom-contract`, while the current published name is `@empressaio/atom-contract`. Establish
  what is actually current before you build against either.
- The workspace family in the contract was described by the G0 audit as brokerage-shaped. Confirm what
  the contract exports today, at what version, from npm and from source — not from a doc and not from
  this brief.

**The numbers and file references in this brief are the planner's and may be wrong. Reporting one wrong
is a successful outcome** (DEV_PROCESS 3.2), and a correction carries the same evidentiary standard as
the claim it corrects: quote the source text, name file and line (3.2a).

### Sequencing inside this dispatch

Contract type FIRST, then the store. The freshness and absence requirements need somewhere to write to,
and the family shape is the thing three other lanes will consume. Do not build a surface in this
dispatch; there is no UI in scope. Function before form.

### WDLL card — required before implementation

Per `90_runbooks/wdll_practice.md` and OPS-17's WDLL card rule: write the frozen What Done Looks Like
card for G-14 at CP1, before building. Never call it an "acceptance card". It is frozen once written;
drift is measured against it at close.

### Constraints

- `smartcity-os` is **absolute no-touch** (live Bastrop production).
- No brokerage rename, no brokerage refactor.
- Write-slot law: only `--apply` against the atoms store queues. Design, build, and dry-runs are free.
- Doc_repo commits are planner-owned. Product-repo work follows the normal PR path; merge only on the
  CI conclusion STRING "success".
- Your close carries `missionPremise`, `completionPredicate`, and `scopeBasis` (AGENT_CONTRACT 6). Where
  a field is inapplicable, say so explicitly — an absent field and an inapplicable one must not look
  the same.

### Out of scope

G-20, G-34, G-44, G-53. Any Smart Files UI or collateral. Lane B, C, or D work. The brokerage rename.
Any claim change to doc 34 — the claims are fixed and you are building to them.

CHECKPOINTS AND CLOSE (exact paths; machine-checkable per contract section 6):
  CP1: _inbox/2026-08-14_a_cp1.json
  CP2: _inbox/2026-08-14_a_cp2.json
  CLOSE: _inbox/2026-08-14_a_close.json
