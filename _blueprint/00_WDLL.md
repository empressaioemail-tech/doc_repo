---
id: blueprint_00_wdll
title: Master blueprint — what done looks like
status: draft
last_updated: 2026-08-21
applies_to: portfolio
owner: nick
related: [80_adrs/adr_001_atom_architecture, 80_adrs/adr_010_atom_graph_traversal, 80_adrs/adr_011_atom_identity_across_versions, 80_adrs/adr_020_recorded_instruments_and_restriction_clauses, 80_adrs/adr_021_constraint_resolution_and_precedence, 80_adrs/adr_028_contract_cross_vertical_adoption, 51_ingestion_pipeline_reference, 77_place_graph_strategy, 25_atom_architecture_reference, 61_enforcement_doctrine, ENFORCEMENT]
---

# Master blueprint — what done looks like

This document defines done for the master blueprint. It is P0 of the reconciliation
program. It is not the blueprint. Agents are dispatched against this file, and the
blueprint they produce is graded against it.

## Why the blueprint exists

Eleven findings on 2026-08-20 share one shape. The ingestion reference existed and was
untracked. ADR-028 was written, correct, and unaccepted. `appliesTo` was designed for one
atom family and never generalised. The per-writer key grammar was derived, verified, and
left as a footnote. Q3 and Q4 were scoped and never dispatched. The calibrated spine
roadmap was frozen pending an audit that has since finished. Three ledger indicators were
built, deployed, and constant. Two launch criteria are graded by those constants. tier2
flood was retired correctly and its consumer was never repointed. The 157 retrieval rows
were measured and left in a transcript. A ring-store divergence was asserted in one test
and nowhere else.

Not eleven problems. One: the artifact exists and nothing feeds it or reads it.

`ENFORCEMENT.md` already names this defect class in its first line, and then fails its own
three-question gate, because prose loaded into an agent context has no executor. The job of
the blueprint is to be the one artifact that binds, and to make everything else gradable
against it.

The store audit of 2026-08-20T23:03Z confirmed the same shape one level down, and made the
diagnosis bidirectional rather than one-way. Ten fields shipped in atom-contract 1.22.0 are
at zero in production. The `atom_links` edge table exists, is correctly shaped, is indexed
four ways, and holds 33,066 rows against 100,025,152 atoms, all of them the code corpus,
with `applies-to` never written once. Meanwhile fourteen contract versions shipped with no
ADR, and the entire `./property` atom family, the alias layer and `keyKind` were implemented
and never documented.

So it is not that canon was written and never built. Canon was written and partly built,
the build ran ahead of canon in places and behind it in others, and neither side knows what
the other did. Almost nothing here is missing. Nearly everything is built, correct, and
unfed. The blueprint is therefore a wiring exercise, not a design exercise, and the rule
register in `40_rule_register.md` is where its value lives.

## What the blueprint IS

The single reconciled statement of the model, the pipeline, the lifecycle, and the rules
that govern data in this portfolio, with every rule naming what enforces it.

## What the blueprint is NOT

It is not a rewrite of the ADRs. ADRs remain the decision record with their reasoning and
their reversal criteria. The blueprint is the compiled view over them: it states which ADR
governs which question, and it resolves conflicts between them by ruling, not by silence.

It is not the plan of record. `OPS-16` and `OPS-17` say what work is scoped. The blueprint
says what correct looks like.

It is not state. `_STATE.md` says what is true right now. The blueprint says what ought to
be true and does not move when the world does.

It is not a style guide, a roadmap, or a thesis.

## Structure

    _blueprint/
      00_README.md        the mesh
      10_model.md         nodes, atoms, edges, identity, lineage, time, absence, precedence, access
      20_pipeline.md      four layer spine, adapter contract, resolution, promotion, reconciliation
      30_lifecycle.md     written, resolved, scored, served, and what gates each transition
      40_rule_register.md every governing rule, with its consumer
      50_grading.md       how any artifact is scored against this blueprint
      diagrams/           diagrams that agree with the text

## Done criteria

Each criterion below is falsifiable. An agent that cannot demonstrate one has not met it.

### D1. The mesh classifies every canon document

The canon set is the set of paths that satisfy the inclusion rule below, plus one non-file
row for the published npm `@empressaio/atom-contract` type surface. The set is enumerated in
`_blueprint/canon_set_listing.json`. A curated subset is not the canon set. Classification
is against that listing, not against a remembered sixty.

Inclusion rule (operator-approved 2026-08-21):

IN:

1. Markdown files directly in the repo root (not recursive) whose names match
   `/^[0-9]{2}[a-zA-Z]?_.*\.md$/`
2. `80_adrs/*.md` (files only, not subdirs unless they are `adr_*.md`)
3. `_blueprint/00_WDLL.md` only
4. `_smartcity_masters/**/*.md`
5. `_smartsite_masters/**/*.md`
6. Exactly these three plans: `90_operations/OPS-16_texas_market_plan_of_record.md`,
   `OPS-17_govtech_stack_plan_of_record.md`, `OPS-18_canon_reconciliation_plan_of_record.md`
7. `90_runbooks/AGENT_CONTRACT.md`, `DEV_PROCESS.md`, `fleet_memory_practice.md`
8. `ENFORCEMENT.md` (repo root)
9. `AGENTS.md`, `CLAUDE.md`
10. `_catalog/repo_map.md`, `_catalog/repo_intents.md`
11. Non-file row: published npm `@empressaio/atom-contract` type surface (cite the fetched
    latest, currently 1.22.0)

OUT (do not list, do not classify): `_inbox`, `_sessions`, `_dispatches`, `_decisions`,
`_scratch`, `OPS/` shadow copies, `_blueprint/10_model.md` through `50_grading.md`,
`_blueprint/diagrams`, `_blueprint/00_README.md` (the mesh itself), `node_modules`,
anything gitignored.

The canon set includes the published `@empressaio/atom-contract` type surface, which is not
a document and is nonetheless the most authoritative artifact in the estate, because it is
the only one that refuses to compile. The mesh classifies it, compiles from it, and rules
explicitly on which wins where the contract and an ADR disagree. A mesh that indexes only
markdown has missed the one thing that binds.

`00_README.md` lists every path in `canon_set_listing.json` and assigns each exactly one
status:

    AUTHORITATIVE   the blueprint compiles from it; it governs
    SUBORDINATE     it elaborates an authoritative source and may not contradict it
    SUPERSEDED      it was authoritative and is not; the replacing document is named
    QUARANTINE      it contradicts the blueprint; P2 moves it; the contradicted rule is named
    REFERENCE       narrative, strategy, or history; governs nothing

Every listing row has exactly one status. Every entry names the blueprint section that
governs its subject. Zero listing paths unclassified. A count of paths at each status is
printed, and those counts are reconcilable against `canon_set_listing.json` (`countFiles`,
`countNpm`, `countTotal`).

#### Amendments

- 2026-08-21: D1 was uncloseable because 'the canon set' was unbounded; a curated 60 is a subset of nothing statable.

### D2. The four-way model conflict is resolved by ruling

Four canon documents describe the model and do not agree.

    77_place_graph_strategy     facts are typed edges on the place node
    ADR-001 + ADR-010           atoms with composition slots; instance links in the index
    ADR-020                     appliesTo anchors carried in the atom body
    51_ingestion_pipeline       typed atoms attached to resolved nodes with typed edges

`10_model.md` states one model. For each of the four, it states whether the framing is
adopted, adopted in part, or superseded, and why. The disagreement is not cosmetic: it
decides where the volatile half of a relation lives, which is the question that produced
21,586,428 special-district-fact rows against 14,182,900 parcel-node rows
(`_inbox/2026-08-20_store_audit_atom_graph.md` Q3, hauska_mcp UTC 2026-08-20T23:05:00Z,
reltuples estimates, not COUNT(*)).

Silence on any of the four is a fail.

### D3. Every rule names its consumer

`40_rule_register.md` carries one row per governing rule with these columns, none omitted:

    id            stable identifier, cited from elsewhere
    statement     the rule, one sentence, in the imperative
    source        the canon document it compiles from
    consumer      the script, hook, CI job, type, or blocking field that executes it
    trigger       the commit, merge, write, deploy, or schedule that fires it
    failure       what fails when the rule is violated
    bypass        the paths that reach the same state without passing through the consumer
    status        ENFORCED | UNENFORCED | DORMANT | STARVED | OVER-SCOPED

A rule whose consumer is an operator review or an agent reading the document is recorded
with consumer NONE and status UNENFORCED. It is not permitted to be described as a control.
Naming a rule unenforced is a pass. Claiming enforcement without a named executor is a
fail.

### D4. The blueprint fails the violation set

This is the criterion that decides whether the blueprint is a north star or an artifact.
Each item below is a defect with evidence already in the estate. For each, the blueprint
must identify it as failing and name the rule id it breaks.

    V1   the canonical key is borrowed, not minted, and the alias layer that would carry
         the source key instead ships in the contract and is empty. externalKeys is at 0
         of 1,025 sampled. atom-contract 1.22.0 ships fourteen derive*NodeId minting
         functions and not one of them is for a parcel, road or jurisdiction.
         evidence: 51 section 3; store audit Q5; npm @empressaio/atom-contract@1.22.0

    V2   tier2 flood queried FEMA at a 0.005 degree tile centre and stamped the answer on
         every parcel in the tile, 137 to 319 m off
         evidence: _inbox/2026-08-20_c10_flood_store_adjudication.md

    V3   accessPolicy defaults to public-free when the payload omits it
         evidence: 65_t25 W-30; packages/retrieval index.ts 402 and 484

    V4   land-use at 19 counties and landuse at 254 are different measurements under
         near-identical keys, and overlaying them would publish a wrong number
         evidence: _inbox/2026-08-20_a4_landuse_orphaning.md

    V5   hasWriter and atomFamilyState are constant across all 3,556 ledger cells, and two
         launch criteria are graded by them
         evidence: live GET /api/county-ledger, 2026-08-20

    V6   situsAddress ", ," passes a non-null test and is served to a customer
         evidence: `_inbox/2026-08-20_audit_programme_handover_planner_variant.md`
         (2026-08-20; 1,248,412 parcels counted populated on `", ,"` / `", TX 78660"`);
         `_inbox/2026-08-20_c12_retrieval_candidate_rows.md` S-166 (baked-facets.ts:285)

    V7   two flood stores disagreed on 37,331 of 533,867 parcels and the disagreement was
         found by probe rather than emitted as a conflict
         evidence: _inbox/2026-08-20_db_probe_five_answers.md Q5

    V8   the verified-absence pair shipped in the contract and no writer populates it, so
         every absence claim in production is still indistinguishable from a claim that
         nobody looked. evaluated and provenanceScope are both 0 of 1,025 sampled, while
         typed per-family absence IS written on the zoning and footprint paths. Built,
         correct, unfed.
         evidence: ADR-028 section 2; store audit Q5; contract 1.22.0 ships the pair

    V9   tier2 flood was retired and deployed and no consumer was repointed, so the served
         payload carries no flood at all for a warm parcel whose atom exists
         evidence: live GET, 2026-08-20; _sessions/2026-08-19_smartsite_qa_to_enforcement

    V10  a factory can be started and there is no defined way to end one
         evidence: operator observation, relayed from the prior planning seat

    V11  the edge layer exists, is correctly shaped and indexed, and the property substrate
         has never written a single row to it. atom_links holds 33,066 links against
         100,025,152 atoms, 0.033 percent, all of it the code corpus. applies-to,
         derives-from, adjudicates, precedent-of, interprets and instance-of are each at
         zero. No parcel is linked to a district, a flood zone or a jurisdiction.
         evidence: store audit Q2 and Q9

    V12  two parcel key grammars coexist in one store, decimal-padded and integer, with no
         normalisation, and roughly one fact atom in six cannot reach its parcel. flood
         84/9/7 and special-district 80/14/6 resolved / unresolved / key-shape-mismatch,
         while a single-county batch resolved 100 of 100, so the failure clusters by
         ingest wave rather than spraying evenly.
         evidence: store audit Q4 and Q8

    V13  sentinels sit inside primary identity keys, where no later repair can recover the
         distinguishing value. sd:outside on 289 of 500 special-district atoms and
         footprint:primary on 182 of 200 building footprints. The second supersedes the
         T-25 assessment that W-17 had no live blast radius.
         evidence: store audit Q4 and Q8; 65_t25 W-17

    V14  one atom row carries two identity namespaces and nothing reconciles them. The
         atom_did column is canonical and matched the derivation 200 of 200; the body
         atomDid is a short prefixed hash in a different namespace.
         evidence: store audit Q5 and Q6

    V15  an ADR argues from evidence that does not exist. ADR-028 supports bitemporality by
         citing knowledge_atoms as proving the shape in production. The table exists with
         valid_from, valid_to and knowledge_at, and holds zero rows.
         evidence: store audit Q10; ADR-028 section 3

Where the blueprint cannot fail an item, that is not a blueprint defect to hide. It names a
MISSING RULE, and the missing rule is filed as a P4 build item in the same pass. V10 is
expected to land here.

The demonstration is written down: for each of V1 through V15, the rule id, the section
that carries it, and the sentence that fails it. A blueprint observed only passing has not
been observed working.

Note the shape of this set. Only V2, V4, V6 and V13 are wrong values. The rest are correct
artifacts that nothing feeds, nothing reads, or nothing can fail against. A blueprint tuned
to catch bad data will miss most of this list.

### D5. Diagrams agree with the text

Every diagram in `diagrams/` is mermaid in a tracked source file, not an exported image
without a source. Every entity, edge, and state in a diagram appears in the prose of the
section it illustrates, and every entity in that prose appears in the diagram or is
explicitly noted as out of scope for it. A diagram that shows a store, a link type, or a
state the text does not define is a fail.

Minimum set: the model, showing nodes, atoms, edges and where each is stored; the four
layer spine; the lifecycle state machine with its gates; and the read path from a customer
request back to the bytes it came from.

### D6. Grading is defined and executable by hand

`50_grading.md` states how any artifact, whether a writer, a store, a document, a part, or a
dataset, is scored against the blueprint. It produces a list of rule ids, not a percentage.
It is written so a person can run it on paper today, before any tooling exists, and it
names which steps are candidates for automation in P6.

### D7. Provenance and snapshot

Every factual claim in the blueprint cites the canon document or the live query it came
from. Every live figure carries the timestamp and the endpoint it was read from. The
blueprint declares the doc_repo commit it was compiled at.

## Explicitly out of scope for P1

No product code. No migrations. No schema changes. No writes to any store. No new ADRs. No
changes to `OPS-16` or `OPS-17`. No document is moved or deleted in P1; quarantine is P2 and
it moves rather than deletes. No decision is reversed. A conflict is resolved by ruling
which existing decision governs, and where two accepted decisions genuinely conflict, the
conflict is filed for the operator rather than settled by an agent.

## Known hazards for the agents doing this

The doc_repo working tree moves under you. It moved twice inside one hour on 2026-08-20.
Check `git log -1` before staging, stage explicit pathspecs, and never use `git add -A`.

Subagents do not commit. They produce artifacts and hand them back.

Text search cannot answer structural questions. Reachability, ownership, and identity need
an instrument that traverses structure. Distrust a negative result from grep most of all.

That rule has a live instance from the session that wrote this file. The planner asserted
that no link table existed, inferring it from the shape of somebody else's orphan
query rather than from the catalog. `atom_links` had been in production the whole time with
33,066 rows and four indexes. The claim was wrong, it was confident, and it was made in the
same session the rule was written down. Enumerate the catalog. Do not reason from the shape
of a query somebody else wrote.

Absence of a mechanism and starvation of a mechanism look identical from the outside and
have opposite fixes. Before reporting anything as missing, check whether it exists and is
empty. In this estate, empty is the more likely answer.

A document being correct is not evidence that anything reads it. That is the defect this
program exists to fix, and it is the easiest one to reproduce while fixing it.

## Verification of this WDLL itself

This file is proven useful when an agent working from it produces a blueprint that fails at
least one criterion, and the failure is legible from the criterion alone without asking the
operator what was meant. A WDLL that nothing can fail against is the same defect one level
up.
