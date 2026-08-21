---
id: 2026-08-21_r05_w1_blueprint_grade
title: R-05 W1 — grade R-01 blueprint against 00_WDLL D1–D7
status: draft
last_updated: 2026-08-21
applies_to: portfolio
owner: integration
related: [_blueprint/00_WDLL, _blueprint/00_README, 90_operations/OPS-18_canon_reconciliation_plan_of_record]
---

# R-05 W1 grade of the R-01 blueprint

Snapshot for this grade: `P:/doc_repo` branch `main` commit `d254467788c795c6f8fa5a9256ad6a074859b615`, seat integration. The blueprint itself declares `compiled_at_commit: 4b174d1b129fa9eee54464967fe7da2b03828a72`. Graded against `_blueprint/00_WDLL.md` criteria D1–D7. The WDLL is the standard. The `_blueprint/` tree is the deliverable. R-01 CP2 and close both scored D1–D7 MET. This pass does not.

**Overall: the blueprint is not WDLL-done.** D1 FAIL, D2 MET, D3 PARTIAL, D4 MET, D5 FAIL, D6 MET, D7 PARTIAL. Two criteria fail, so R-01's close claiming seven MET is unearned. D4 (the north-star test) actually holds: the register fails starvation and unfed cases, not only bad values. The mesh and the diagrams do not.

## D1. The mesh classifies every canon document — FAIL

The contract half is the part they got. `00_README.md` lists `@empressaio/atom-contract@1.22.0` as AUTHORITATIVE, binds it to `10_model`, `20_pipeline`, and `40_rule_register`, and writes a five-point precedence rule for contract versus ADR versus store. That is not a markdown-only index. Precedence rule 1 ("Types and field shapes — contract wins") is an explicit ruling of the kind D1 asked for.

The rest of D1 fails. The WDLL does not bound the canon set. It says: "The canon set includes the published `@empressaio/atom-contract` type surface, which is not a document and is nonetheless the most authoritative artifact in the estate, because it is the only one that refuses to compile." Then: "`00_README.md` lists every document in the canon set and assigns each exactly one status" and "Zero documents unclassified. A count of documents at each status is printed, and that count is reconcilable against a file listing." There is no numbered list, no "compile set," and no carve-out for R-02. "Includes the contract" expands the set. It does not shrink it.

`00_README.md` claims 60 classified (14 AUTHORITATIVE, 22 SUBORDINATE, 6 SUPERSEDED, 0 QUARANTINE, 18 REFERENCE) and says those counts are "reconcilable against the tables below." That 60 is a curated subset. A file listing on this tree found 160 root numeric-prefix markdown files and 25 ADR files. Fifteen ADRs are unclassified, including accepted `adr_029_building_footprint_and_utility_easement_rails.md` (footprint rails keyed to `parcelNodeId`, the V13 family) and `adr_025_og_atom_ontology.md` (the ontology behind the `derive*NodeId` functions the mesh cites). `65_t25_admissibility_enumeration.md` exists and is the W-17 / W-30 source; the mesh classifies `65_t25_enforcement_wave.md` "if present," a file that is not present. Conditional classification is not exactly one status.

Five of six SUPERSEDED rows are not documents: an ADR-001 note, an ADR-010 column name, a retired flood path, a sourcing ethic, and "Regrid / Cotality as join keys." Those rows inflate the 60 without corresponding files. REFERENCE lists `_sessions/*`, `_decisions/*`, `_dispatches/*` as three of the 18, which cannot reconcile to a file listing, and then adds "plan rows OPS-16/OPS-17 amendment history" while OPS-16 and OPS-17 are already SUBORDINATE. Exactly-one-status fails on those two plans.

The mesh says it classifies "every document in the canon set for the reconciliation program." That extra qualifier is the lane's bound, not the WDLL's. CP2 finding R01-CP2-A already admitted "Mesh REFERENCE bucket is representative not exhaustive" and disposed it as "Accept for R-01." Accepting the miss is how D1 was marked MET.

Mechanism: R-01 treated "canon set" as the documents they compiled from, then padded SUPERSEDED with non-files so the status table summed to 60. Second mechanism: D1 was meant to wait for R-02, whose exit is "every doc classified; contradictions moved to `_quarantine/`." Rejected because D1 names `00_README.md` as the artifact that lists every canon document, R-02's distinctive work is the move, and the WDLL never delegates zero-unclassified to a later row. A deferred catalog would not invent six superseded "documents" of which five are not files.

## D2. The four-way model conflict is resolved by ruling — MET

`10_model.md` section "Four-way conflict — rulings" names all four WDLL framings and puts a status line on each in the required vocabulary.

`77_place_graph_strategy` is **ADOPTED IN PART**: place as primitive and facts as layers are adopted; "facts are typed edges on the place node" is superseded for storage because production stores typed `entity_type` rows plus optional `atom_links`. That is a ruling with a why, not a paraphrase of 77's purpose sentence.

ADR-001 + ADR-010 is **ADOPTED IN PART**: atoms, four registration layers, Postgres index, and `atom_links` adopted; `target_cid` and IPFS-as-sole-body-store superseded in detail, with store audit Q2 as the production shape. Ruling, not restatement.

ADR-020 is **ADOPTED IN PART — scope: private encumbrance layer only**: `appliesTo` in body for instruments adopted; bulk property facts must use `parcelNodeId` plus intended `applies-to` links. The why names the cardinality failure. Ruling.

`51_ingestion_pipeline_reference` is **ADOPTED**, with the operational write-path list (four-layer spine, candidates only, minted keys, typed edges, meaning-shaped checks, fail-closed defaults). Status is ADOPTED, not silent.

No four-way silence. The "Adopted:" bullets under each heading paraphrase source content, but each heading carries adopted / adopted in part plus a superseded-for clause and a why. That is what D2 asked for.

## D3. Every rule names its consumer — PARTIAL

`40_rule_register.md` uses the required columns. Rules whose consumer is none are labelled UNENFORCED or STARVED rather than described as controls. That part of D3 is a pass: naming unenforced is allowed.

Counted from the tables, not from the summary: 24 `BP-*` rows. ENFORCED 1 (`BP-MEANING-01`). UNENFORCED 14. DORMANT 2 (`BP-WRITE-01`, `BP-VERIFY-01`). STARVED 6 (`BP-KEY-01`, `BP-EDGE-01`, `BP-RECON-01`, `BP-ABSENCE-01`, `BP-LICENSE-01`, `BP-LEDGER-01`). OVER-SCOPED 0. MISSING-class 2: `BP-FACTORY-01` sits in the register with status `MISSING → R-04`, which is not in D3's enum (`ENFORCED | UNENFORCED | DORMANT | STARVED | OVER-SCOPED`), and `BP-PROMOTE-01` is a named gate in `30_lifecycle.md` ("Gate BP-PROMOTE-01: Adjudication outcome recorded; queue depth measured") and a transition label in `diagrams/03_lifecycle.mmd`, with no register row at all. The file's own summary claims ENFORCED 1, UNENFORCED 14, DORMANT 2, STARVED 8, MISSING 1, total 26. Two phantom STARVED rows. A count that cannot be reconciled against its own table is the same defect D1 has one level up.

The one ENFORCED rule names `three-layer-audit.mjs` (county in body versus binding). The executor is named, so this is not "claiming enforcement without a named executor." R-01 did not show what it violated in this lane to establish that the check still fires. `51_ingestion_pipeline_reference.md` records a historical throw-on-disagreement run; CP2/close do not re-run it. `BP-ACCESS-01` names `packages/retrieval index.ts` as consumer while status is UNENFORCED: that file is the violator (the default), not the executor of the rule. Honest as UNENFORCED, confused as consumer.

Mechanism: the register was compiled from the violation map, then the lifecycle grew `BP-PROMOTE-01`, and the status summary was typed rather than counted. Second mechanism: two additional STARVED rules live in diagrams or in `50_grading.md` and were included in the 26. Rejected because a scan of `40_rule_register.md` shows 24 statement rows and no `BP-PROMOTE-01` line; the extra two are not in another blueprint file as register rows. Empty is the likelier read: the promote gate was written into prose and never fed to the register.

## D4. The blueprint fails the violation set — MET

This is the criterion that decides north star versus artifact. The D4 table in `40_rule_register.md` maps V1–V15 to a rule id, a section, and a sentence. V10 is filed as a MISSING RULE (`BP-FACTORY-01` → R-04), which is the outcome the WDLL expected. The eleven unfed / unread / cannot-fail cases are not collapsed into bad-data rules: V1, V5, V7, V8, and V11 ride STARVED rules (`BP-KEY-01`, `BP-LEDGER-01`, `BP-RECON-01`, `BP-ABSENCE-01`, `BP-EDGE-01`). V3, V9, V12, V14, V15 ride UNENFORCED rules (default, repoint, normaliser, DID reconciler, governance citation). A blueprint tuned only to wrong values would have caught V2, V4, V6, V13 and missed the rest. This one did not.

Nits, not enough to drop MET: several "failing sentence" quotes are the rule imperative from the register, not a sentence that appears in the named section (`V12` quotes a unified-model clause while citing Nodes; `V14`/`V15` quotes register statements while citing `10_model` Atoms/Time). `BP-FACTORY-01` is both present in the register and called MISSING. That is the WDLL's "filed in the same pass" shape, slightly over-registered. The production failures are identified.

| V | named as failing? (yes/no/partial) | rule id | section | failing sentence (quote or "MISSING RULE") | notes |
| --- | --- | --- | --- | --- | --- |
| V1 | yes | BP-KEY-01 | `10_model` Identity | "Canonical parcel key is minted at resolution; source keys live in externalKeys." | STARVED. Production sentence in the same section: externalKeys 0/1,025, writers borrow prop_id. Unfed alias layer, not a bad value. |
| V2 | yes | BP-FLOOD-01 | `40_rule_register` | "Assign flood zones using parcel geometry intersection, not tile centroid alone." | Wrong value. `20_pipeline` L2 also names the retired centroid path as V2. UNENFORCED because the path is retired. |
| V3 | yes | BP-ACCESS-01 | `40_rule_register` | "Do not default accessPolicy to public-free when payload omits it." | Unfed refuse. `10_model` Access points at V3. Consumer named is the violator (`index.ts` default). UNENFORCED. |
| V4 | yes | BP-LANDUSE-01 | `40_rule_register` | "Never overlay land-use-fact and landuse rail counts as one measurement." | Wrong value / wrong overlay. Also in `10_model` Precedence. UNENFORCED. |
| V5 | yes | BP-LEDGER-01 | `40_rule_register` | "hasWriter and atomFamilyState must vary across manifest cells they grade." | STARVED instrument. `30_lifecycle` scored track records constants on all 3,556 cells. Correct artifact, cannot go red. |
| V6 | yes | BP-ADDRESS-01 | `40_rule_register` | "Reject situsAddress that is punctuation-only or empty tokens." | Wrong value. `20_pipeline` L4: served `", ,"` passes non-null. UNENFORCED. |
| V7 | yes | BP-RECON-01 | `40_rule_register` | "Emit conflict when two authoritative stores disagree on same parcel fact." | STARVED emitter. `20_pipeline` Stage C cites 37,331 / 533,867 from the db-probe. Built check, never fed. |
| V8 | yes | BP-ABSENCE-01 | `10_model` Absence | "Absence claims that must read as checked and none require the verified pair." | STARVED. Contract pair at 0/1,025; typed per-family `absence` is written on zoning/footprint. Correct type, unfed. |
| V9 | yes | BP-SERVE-01 | `30_lifecycle` Retirement | "Repoint all L4 consumers when a fact store retires." | Unfed consumer. Skipping step 2 → V9 in the same section. UNENFORCED, not a missing rule. |
| V10 | yes | BP-FACTORY-01 | MISSING RULE | MISSING RULE | Expected miss. Filed R-04 in the same pass. Status enum is illegal in D3; the D4 filing is the right shape. |
| V11 | yes | BP-EDGE-01 | `10_model` Edges | "Volatile relation half should live on edges (applies-to)." | STARVED. atom_links 33,066, all code corpus; property `applies-to` at 0. Correct table, unfed writer. |
| V12 | partial | BP-PARCEL-KEY-01 | `10_model` Nodes | "Normalized form: integer prop_id, no decimal padding." | Quote lives in the unified-model paragraph, not the Nodes table. Dual grammars are an unfed normaliser (UNENFORCED), evidence also in `20_pipeline` known-gaps. |
| V13 | yes | BP-KEY-SENTINEL-01 | `10_model` Edges | "Production encodes volatile half in entity_id suffix — violates BP-KEY-SENTINEL-01." | Wrong value in the key. `:sd:outside` / `:footprint:primary`. UNENFORCED. |
| V14 | yes | BP-DID-01 | `10_model` Atoms | "body.atomDid must equal column atom_did namespace." | Quote is the register statement; Atoms section says "Must not use a different namespace in body.atomDid (V14)." Nothing reconciles two namespaces. UNENFORCED. |
| V15 | yes | BP-BITEMP-01 | `10_model` Time | "Do not cite knowledge_atoms as production bitemporal proof until populated." | Unfed table cited as proof. `10_model` Time: table exists, 0 rows, "evidence does not exist." UNENFORCED governance rule. |

## D5. Diagrams agree with the text — FAIL

Four tracked mermaid sources exist (`diagrams/01_model.mmd` through `04_read_path.mmd`). That meets the minimum set (model, four-layer spine, lifecycle, read path) and the "not an exported image" rule. Agreement with prose fails in both directions.

`03_lifecycle.mmd` sends `Candidate --> Provisional : tier 3`. The ASCII machine in `30_lifecycle.md` places the down-arrow under RESOLVED (`CANDIDATE → RESOLVED → RECONCILED`, with PROVISIONAL beneath RESOLVED, then `ADJUDICATED → promoted to RESOLVED`). ADJUDICATED is a named state in that ASCII and in the transitions section; it is not a state in the mermaid, and it is not noted out of scope. The mermaid labels the promotion edge `BP-PROMOTE-01`, which the prose uses and the rule register does not contain.

`01_model.mmd` includes `CT --> CT`, a `contains` self-loop the text never defines. `10_model.md` Edges lists production types `contains`, `cites`, `subject-to`, `see-also`, `as-defined-in`, `amends`, `supersedes` and intended `applies-to` / `instance-of`; the diagram shows only `applies-to` and `contains`. Precedence discusses the `landuse` rail next to `land-use-fact`; the diagram shows only `land-use-fact`. Identity (`externalKeys`, `keyKind`), time (`knowledge_atoms`), and absence (`verifiedAbsence`) are in the prose of the file the diagram claims to illustrate, with no out-of-scope note. D5 requires the converse: every entity in that prose appears in the diagram or is explicitly noted as out of scope.

`04_read_path.mmd` emits `sourceAdapter sourceUrl fetchedAt` on the provenance arrow. Blueprint prose never defines `sourceAdapter` or `sourceUrl` (`10_model` Time has `fetched_at`). A store, link type, or field the text does not define is a fail. IPFS is correctly marked out of scope there.

`02_pipeline.mmd` omits Stage D Promotion, which `20_pipeline.md` defines as a canonicalisation stage, with no out-of-scope note. L2 example stores (`txgio_parcel`, `tx_fema_nfhl_flood_zone`) are in the prose and not in the diagram.

Mechanism: diagrams were sketched from the four slogans (nodes/atoms/edges, L1–L4, state machine, read path) and not spot-checked against the ASCII machine or the entity lists. Second mechanism: the mermaid is the intended lifecycle and the ASCII is decorative, so Candidate→Provisional is the ruling. Rejected because D5 grades diagrams against the section they illustrate, `03_lifecycle.mmd` says "Gates named match `_blueprint/30_lifecycle.md`," and that file's own ASCII disagrees. Decorative ASCII that contradicts the diagram is still text.

## D6. Grading is defined and executable by hand — MET

`50_grading.md` is a six-step procedure a person can run on paper. Output is a YAML list of rule ids with PASS / FAIL / STARVED / NOT_APPLICABLE / MISSING, not a percentage. The abbreviated `fema-nfhl-bulk-v1` example emits four rule ids and says "No percentage computed." Automation candidates are named for P6 / R-06. Step 5 tells a grader of the blueprint itself to run this D4 table.

Nit only: Step 4 introduces verdict UNMEASURED, which is not in the Step 3 enum. It does not stop a hand run from producing a list of rule ids today.

## D7. Provenance and snapshot — PARTIAL

`compiled_at_commit` is declared on every blueprint markdown file (`4b174d1`). Live store figures generally point at `_inbox/2026-08-20_store_audit_atom_graph.md` with timestamp 2026-08-20T23:03Z (the audit file's Q3 snapshot line is 2026-08-20T23:05Z). npm is "fetched 2026-08-21" without a time or registry URL. `30_lifecycle.md` ledger constants are "Observed 2026-08-20" without the GET endpoint the WDLL itself used (`/api/county-ledger`). `20_pipeline.md` V6 (`", ,"` ) has neither timestamp nor endpoint.

The load-bearing four-way number is wrong-sourced. `10_model.md` says wrong placement "produced 20,844,039 `special-district-fact` rows ... (`store audit Q3`)." Store audit Q3's table gives `special-district-fact` est_rows **21,586,428**. The 20,844,039 figure is in `_inbox/2026-08-20_db_probe_five_answers.md` and the SS-W9 three-layer report, and is copied into the WDLL and the R-01 dispatch. Citing Q3 for a number Q3 does not contain is the "read the log you cite" miss. Parcel "~14.2M" and road-node "~27k" are defensible tildes on Q3's 14,182,900 and 27,340; the special-district cite is not.

Mechanism: the 20,844,039 figure was inherited from the WDLL/dispatch and footnoted to the audit because that is the production citation everyone else uses. Second mechanism: Q3 used to contain 20,844,039 and later ANALYZE moved the estimate to 21,586,428. Rejected because the cited file's Q3 table currently prints 21,586,428, and 20,844,039 is findable in the db-probe inbox note. The log they named does not record the number they used.

## What the lane reported as verified

R-01 CP2 and close mark D1–D7 MET. Asked what they violated to establish that: CP2-A recorded the subset mesh and accepted it, which is the opposite of violating D1. CP2-B grepped the 1.22.0 pack for `deriveParcelNodeId` and found none, which supports V1 / BP-KEY-01, not D1–D7 as a set. No CP2 note records an ASCII-versus-mermaid contradiction (D5) or a recount of the rule table (D3). D4 is the one criterion they actually demonstrated, by writing the V1–V15 map. Absence of a D1 file listing is more likely than a listing they ran and discarded: CP2 says the 60 "cover blueprint compile set" and defers full catalog to R-02.

## Recommended quarantine candidates

W1 does not move files. Quarantine moves, it never deletes. These contradict the compiled blueprint and should be on the R-02 move list, each with the rule they contradict.

`80_adrs/adr_028_contract_cross_vertical_adoption.md` contradicts **BP-BITEMP-01**. Section 3 (Context, bitemporality) still says ldt's `knowledge_atoms` table "already carries valid_from/valid_to/knowledge_at, proving the shape in production without contract backing." `10_model.md` Time and store audit Q10: the table exists and holds zero rows. The mesh left QUARANTINE at 0 and filed this for the operator. Filing is not classification. The document currently asserts evidence that does not exist.

`77_place_graph_strategy.md` contradicts **BP-EDGE-01** and the `10_model.md` unified model. The purpose sentence still says "every normative, physical, economic, and operational fact is a typed edge with provenance." The blueprint rules that storage as superseded: facts are typed atom rows, volatile membership belongs on `atom_links`, and encoding membership in `entity_id` is the defect that produced the special-district cardinality. The same doc still lists Regrid `ll_uuid` as the parcel-identity source, which the mesh already marked SUPERSEDED as a join-key practice. SUBORDINATE-with-a-must-not-contradict-51 note leaves the contradicting sentences in place.

`80_adrs/adr_010_atom_graph_traversal.md` remains AUTHORITATIVE while its discovery-layer paragraph still states a present-tense Postgres index on `target_cid` and "They do not store atom bodies; bodies live in IPFS." `10_model.md` supersedes both in detail (DID pairs on `atom_links`; JSONB bodies in Postgres). The mesh SUPERSEDED the column name as a sixth "document" rather than quarantining the ADR's present-tense store claim. The operator-filed IPFS conflict is this document. Move it with BP-EDGE-01 / the Atoms layer table as the contradicted rules, or strip the present-tense store sentences after an operator ruling. Do not leave AUTHORITATIVE prose that the blueprint has already ruled false in production.
