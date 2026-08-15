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

### WDLL card — a DRAFT ALREADY EXISTS. Do not author a second one.

**`_inbox/2026-08-14_g09_wdll_lane_a_smart_files.md`** — a ten-item draft card written during the G-09
proving run, status `draft`, operator approval pending. It is scoped to FIVE plan rows (G-14, G-20,
G-34, G-44, G-53); this dispatch is scoped to G-14 plus lane A's half of G-10. **Authoring a fresh card
would produce two cards for one lane graded against different scopes, and inheriting it whole would
grade you on rows this dispatch tells you not to build.**

At CP1: **freeze a G-14-scoped SUBSET of that card.** Items 1 through 5 fall inside this dispatch
(family placement ruling, the four missing columns, store-once-place-many, revise-once-with-history,
provenance and freshness with a proven STALE indicator). Items 6 through 10 reach into typed absence,
Bastrop corpus capture, coverage counting, surface deployment, and sellability — **defer them; they are
later dispatches.** Record explicitly which items you carried and which you deferred, and why.

Read the existing card before you decide. If you judge an item to straddle the boundary, say so and
rule it deliberately rather than silently. Never call it an "acceptance card". Once frozen it is not
edited; drift is measured against it at close.

That card's item 2 already did work you would otherwise repeat: it read
`brokerageWorkspaces.ts:54-76` at source, found **8** columns, and corrected amendment A-002's "9
columns" — the correction propagated into this brief. Do not re-litigate it; do verify it if you
depend on it.

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
