# WDLL: Lane A — Smart Files (OPS-17)
Date: 2026-08-14  Status: draft
Operator approval: pending

Plan rows: G-14 (L1), G-34 (L3), G-44 (L4), G-53 (L5), and G-20 (L2, added by the successor:
OPS-17 lists G-20 as Lane A and G-44 is blocked on it, so the corpus count could not be omitted).
Amendments governing: A-002 (Lane A is a BUILD, not a rendering pass), A-003 (doc 34 claims are NOT
revised; the build is made true), A-007 (Lane A sequenced first; the EXTEND-vs-SUPERSEDE ruling
routes to G-10/S-6).

CONTINUATION: items 1 through 5 were drafted by SA-3, which was stopped mid-draft. Items 6 through
10 were written by its successor as a supervised continuation per AGENT_CONTRACT 2; items 1 through 5
are carried forward unedited. Recovery record: `_inbox/2026-08-14_g09_sa3_handoff.json`, close at
`_inbox/2026-08-14_g09_sa3_successor_close.json`.

## Done looks like

A city file system exists as a real artifact family with its own schema, not as a rendering of the
brokerage workspace family. A document is stored once and is referenced from every place it belongs
without being copied, so revising it once makes the revision current in every one of those places
while the prior version remains retrievable. Every artifact the store serves carries its source, a
computedAt and a servedAt stamp, and a STALE indicator that has been backdate-tested and proven able
to fire before anyone relies on it. Where the store does not hold something, it says so with a typed
absence carrying its basis, never an empty result rendered as a data gap. The real Bastrop document
corpus is captured into that store with provenance and counted with its counting rule, and the
surface a city touches is deployed and sellable at the set 25,000 dollar entry price using only
language already in the doc 34 approved-claims register.

## Acceptance items

1. **The family placement is RULED before any schema is written.** A written ruling at G-10/S-6
   states whether Smart Files EXTENDS `brokerage_workspaces` or is a SEPARATE family that leaves the
   brokerage one untouched, and names the entityId shape for the city-file node class.
   | check: a merged decision record in `_decisions/` naming the verdict and the entityId shape, cited
   by the first schema PR; `brokerage_workspaces` untouched in that PR's diff if the verdict is
   SEPARATE. | grade: [ ] | depends on: nothing (blocks 2)

2. **The store schema carries the four columns the brokerage family provably lacks.** The city-file
   artifact table has `updated_at`, a version identity, a content identifier, and `access_policy`
   from the atom-contract five-value union.
   | check: the merged migration's table definition read at source shows all four columns present
   and non-vestigial; a live `\d` (or drizzle schema read) against the deployment database confirms
   the migration is APPLIED, not merely merged. | grade: [ ] | depends on: 1

   *Counting rule and basis:* the comparison baseline is
   `legacy-design-tools/lib/db/src/schema/brokerageWorkspaces.ts:54-76`, verified at source by this
   drafter on 2026-08-14: `brokerage_workspace_attachments` defines 8 columns in its object literal
   (`id`, `workspace_id`, `kind`, `uri`, `body`, `title`, `created_by_install_id`, `created_at`) with
   a single notNull FK on cascade delete, and no `updated_at`, no `version`, no `cid`, no
   `access_policy`. A-002 states "9 columns" for the same line range; the object literal contains 8.
   The load-bearing half of the claim (the four absent columns, the single cascade FK, the exact line
   range) is CONFIRMED; the column count is off by one and is reported per DEV_PROCESS 3.2 rather
   than propagated.

3. **A document placed in N locations is stored once, not N times.** Placement is a reference from a
   location to one stored artifact, so the artifact row count does not rise when a document is placed
   again.
   | check: live probe — store one document, place it in three locations, then query the artifact
   table for that content identifier and get exactly one row while the placement table returns three.
   This is the direct structural test of the doc 34 approved claim "A document lives once, appears
   everywhere it belongs" (register line 127), which A-002 showed is impossible on the brokerage
   schema because one attachment belongs to exactly one workspace by a single notNull FK. | grade: [ ]
   | depends on: 2

4. **Revise once, current everywhere, and the prior version is still there.** A revision to a
   multi-placed document is current at every placement on the next read, and the superseded version
   remains independently retrievable by version identity.
   | check: live probe on the same three placements — revise once, read all three and get the new
   version, then fetch the prior version by its version identity and get the pre-revision content.
   This tests doc 34 register lines 125 and 126, which A-002 found have NO schema at all on the
   brokerage family (insert and delete only). | grade: [ ] | depends on: 3

5. **Every served artifact carries source, computedAt, and servedAt, and the STALE indicator is
   PROVEN able to fire.** This is the G-14 instrument verbatim plus inherited spine constraint 4.
   | check: a live response from the deployed serving path shows all three fields populated and
   non-null; separately, a backdate test drives the stamp past the freshness threshold and the STALE
   indicator fires, with the negative case (fresh artifact, indicator silent) also demonstrated on
   the real exit code, not a pipe's exit code (DEV_PROCESS 2.2, 2.3). A cache without a stamp is a
   liar waiting for load. | grade: [ ] | depends on: 2

6. **A missing thing is a typed absence carrying its basis, never an empty result.** When the store
   is asked for something it does not hold, the response is a typed absence naming what was looked
   for, where it was looked for, and why the determination is negative. An empty query result is
   never rendered as a data gap, and a silent fallback to a default never substitutes for a lookup.
   | check: live probe - request an artifact class the store provably does not hold for Bastrop and
   receive a typed absence with a populated basis field; separately, prove the negative case on the
   real exit code, not a pipe's exit code, that no code path returns a bare empty collection on that
   route (DEV_PROCESS 2.3, 4.3). This is the G-34 instrument's absence half. | grade: [ ]
   | depends on: 2, 5 | plan row: G-34

7. **The Bastrop document corpus is CAPTURED through Factory 1.5 staging, with provenance on every
   staged row.** Documents are acquired by the CAPTURE verb into the Factory 1.5 acquisition and
   staging tier and land as staged rows carrying source citation and vintage provenance, then drain
   into the artifact store. Acquisition is uniform public-record; no path depends on the Bastrop
   relationship, and the same path must work for a jurisdiction with no relationship at all.
   | check: a store query returns the count of Bastrop artifacts whose provenance fields are
   populated and non-null, and a spot read of three of them resolves to a retrievable source
   citation; the staging run's close artifact names the acquisition method and shows zero rows
   admitted without provenance. Factory 1.5 is acquisition-tier and does not take the atoms bulk
   writer slot (AGENT_CONTRACT 3); the drain into the store does. | grade: [ ] | depends on: 3, 4
   | plan row: G-44

   *Counting rule:* "captured" counts staged rows that drained into the artifact store and are
   retrievable by content identifier, not documents fetched, not files on disk, not pages parsed.
   Fetched-but-undrained is a separate number and is reported separately if it is non-zero.

8. **Corpus coverage ships with its denominator or it does not ship.** The Bastrop coverage figure
   names what the denominator is (the enumerated set of documents the city holds, by whatever
   enumeration was actually used) and states its exclusion set at the point the number is read, not
   in an appendix. A bare ratio is a failed item even if the ratio is high.
   | check: the published figure carries numerator, denominator, counting rule, exclusion set, and a
   snapshot timestamp inline; a second independent count of the same class agrees, or the
   disagreement is reconciled rather than rounded off (DEV_PROCESS 1.1, 1.2, 1.4, 1.6). The
   denominator is MEASURED, never derived by subtraction (DEV_PROCESS 1.3). | grade: [ ]
   | depends on: 7 | plan row: G-20

9. **The city-facing surface is DEPLOYED and probed live, not merged.** The surface a city touches
   serves the captured corpus from the deployed serving revision, verified by a live probe against
   that revision rather than by a merged PR or a new-but-not-serving revision.
   | check: a live request to the deployed surface returns real Bastrop artifacts with their
   provenance and freshness stamps intact, and the serving revision is confirmed to be the revision
   under test before the probe is believed (DEV_PROCESS 4.4; the Cloud Run traffic trap). Code-done
   is not customer-done. | grade: [ ] | depends on: 5, 6, 7 | plan row: G-53

10. **Sellable at the set price on approved language only.** Smart Files is sellable at the entry
    price of 25,000 dollars, and every line of customer-facing collateral traces to a row in the doc
    34 approved-claims register with zero terms from its avoid list.
    | check: each collateral claim maps to a named register row in
    `_smartcity_masters/34_smartcity_smart_files_and_foundation.md`; a mechanical grep of the
    collateral against the avoid list at line 118 returns zero hits for storage layer, substrate,
    atom, node, graph, IPFS, content-addressed, distributed storage, digital twin, RWA,
    tokenization, on-chain, and blockchain; the foundation is not named as a product; the reworked
    Compass sidebar is not claimed as shipped; and the three build-gated register rows are only
    stated once items 3, 4, and 8 grade met. | grade: [ ] | depends on: 8, 9 | plan row: G-53

    *Basis and counting rule, verified at source by the successor on 2026-08-14:* the entry price of
    25,000 dollars is set in `_smartcity_masters/00_README.md:68` (submitted to Vertosoft as MSRP on
    2026-08-10, alongside Dashboards 65,000, Plan Review 42,000, Asset Management 52,000, Full
    Program 150,000). The three register rows this card's build makes true are lines 125 (revise
    once, current everywhere), 126 (prior versions remain retrievable), and 127 (a document lives
    once, appears everywhere it belongs) of doc 34; line numbers confirmed at source, matching the
    citations in items 3 and 4. Per A-003 the register is NOT revised, so these rows are the
    specification, and per A-003 no Smart Files collateral ships ahead of the build.

    *Successor finding RETRACTED at CP-review, per DEV_PROCESS 1.4 and 4.2:* the successor reported
    A-003's "doc 34 line 32" as off by two, placing the phrase at line 34. Re-verified by SA-3 with
    three independent instruments (`grep -n`, `sed -n '32p'`, and `awk` NR), all three return line
    **32**. A-003 is CORRECT as written and its line citation stands; the successor's correction was
    a false positive and is retracted rather than carried into this card. The substance of A-003 is
    unaffected: the phrase "the foundation is the node-and-graph substrate, built and running in the
    command center" is false as written given the A-002 BUILD verdict, and the scoped in-place
    correction remains owed to the operator (DEV_PROCESS 5.4). Recorded here rather than silently
    deleted, because a retracted finding is itself the record worth keeping.

**Out of scope for this card, explicitly** (DEV_PROCESS 3.3). The EXTEND-vs-SUPERSEDE ruling is
CONSUMED by item 1 but is made at G-10/S-6 and is not this lane's to make. IPFS migration stays doc
34 open-item 2: portability is structural, not operational, and no item here grades on it. The
Compass sidebar rework (doc 34 open-item 3) is a separate surface and is named here only as a claim
this card must not make. Lane B asset ingest (G-24), plan-review document handling (Lane C), and the
brokerage workspace family itself are all out of scope; if the item 1 ruling comes back SEPARATE,
`brokerage_workspaces` is not touched by this lane at all. Auth and tenancy (G-11, S-1) gate real
per-tenant enforcement of `access_policy`; item 2 requires the COLUMN, not its enforcement, and that
enforcement gap is stated rather than silently assumed closed.

## Amendments

(none; card is draft and not yet frozen. Amendments begin only at operator approval - until then,
edits are drafting, not scope changes. Items 1 through 5 were carried forward unedited across the
SA-3 handoff and are therefore not amendments.)

## Finish card (graded at close)

(not graded; card is draft)
