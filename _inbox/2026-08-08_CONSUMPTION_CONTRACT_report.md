---
id: 2026-08-08_CONSUMPTION_CONTRACT_report
title: Consumption contract program report — Phase 1 contract, nine-rail reconciliation, adversarial verdict
date: 2026-08-08
status: program report — contract NOT ratified until FATAL amendments land in code
owner: nick
related: [_inbox/2026-08-08_CONSUMPTION_CONTRACT_draft_for_review, _inbox/2026-08-08_CONSUMPTION_CONTRACT_adversarial_review, _inbox/2026-08-08_ATOM_families_ten_rail_spec, _inbox/2026-08-08_DATA_MODEL_adversarial_review, _decisions/2026-08-07_envelope_saga_close_and_geometry_law, _decisions/2026-08-08_county_shape_thirteen_rails_and_geometry_first, hauska-engine PR #284]
memory_graded: pending
---

# Consumption contract program report

## Verdict

The two-factory joint can be written as a contract. The draft authority split holds: `txgio_parcel` owns rings; `parcel-node` owns membership and provenance-by-reference; jurisdiction atoms own claims; `atom_links` owns structural edges. The prior REJECT list (ring atom, new relationship layer, parcel re-key) is not re-proposed.

Adversarial review ([adversarial review](2026-08-08_CONSUMPTION_CONTRACT_adversarial_review.md)) returned **PARTIAL HOLD WITH FATAL GAPS** (FATAL 2 / GAP 2 / HOLDS 1). The FATAL findings are accepted and folded into the amended contract below. **This contract is not ratifiable and must not authorize re-acquire of warmed counties until the FATAL amendments have enforcing code.** Naming a check that does not exist is how three other invariant sets in this portfolio failed; Geometry Law held because each rule made its defect class unrepresentable.

Kenedy proof (PR #284 OPEN, not merged): 528 atoms, 528/528 read-back verified, zero bodies with coordinates. Crossing the seam once is real; the consumption contract is what makes 254 counties unambiguous.

---

## Part 1 — Amended consumption contract

### Authority split

| Concern | Authoritative store | Sole writer |
|---|---|---|
| Parcel ring geometry | `txgio_parcel` | Statewide TxGIO ingest |
| Parcel membership + geometry provenance by reference | `parcel-node` atoms | Statewide parcel-node writer only |
| Zoning, setbacks, envelope, boundary edges, jurisdiction claims | property atoms | Jurisdiction factory |
| Structural relationships (succession, parcel↔well/pipeline/district) | `atom_links` | Named adapter after this contract |

Forever rejected (prior adversarial REJECT, restated): ring bytes in atoms; a second relationship table; re-keying `parcelNodeId` / MCP `parcel_node_id`.

### Invariant C1 — What the jurisdiction factory READS

**Rule.** Read `parcel-node` for warm eligibility, key discipline, and vintage binding. Never read it as a geometry store. Rings always come from `txgio_parcel` via the resolver pin (Geometry Law rules 1 and 8).

**Warm eligibility (amended after FATAL).** A parcel may enter warm/promote only when all of:

1. An **active** (`status !== "retired"`) `parcel-node` exists for that `parcelNodeId`.
2. `geometryLoaded: true`.
3. The atom is not a multi-feature fold that the serve path cannot represent honestly. Until `additionalFeatureIndexes` is a first-class field on the atom body (it is hashed then dropped today — `parcel-node-atoms.ts`), multi-feature accounts must be planned as `geometry-incomplete` absence, not resolved warm-eligible anchors.
4. `geometryStoreRef` resolves under a **keyKind-aware** lookup: `prop_id` column when `keyKind=prop_id`; `geo_id` column when `keyKind=geo_id_crosswalk`. Today's resolver queries `prop_id` only (`parcel-geometry-resolver.ts:166-178`) — that is a C1 blocker for crosswalk counties until fixed.
5. Synthetic / non-account keys (`parcelNodeId` matching `{fips}:_feature-*`) are **never warm-eligible**. They are absence findings, not warm anchors.

**Cohort sizing.** Recipe eligibility (e.g. `zoning-fact` presence) defines which claims can be computed. The countable warm set is the intersection of recipe eligibility and C1. Acquisition accounting ("how many parcels exist") remains store-truth from `txgio_parcel` at execution time (Geometry Law rule 8). Atom counts are not acquisition.

**Today.** `depth-warm-bastrop-batch.mjs` sizes from `zoning-fact` and has zero parcel-node gate (verified by search). That is the defect C1 closes.

**Enforcing check C1 (must exist before ratification).**

| Check | Mechanism | Exists today? |
|---|---|---|
| Warm preflight decline `no-parcel-node-anchor` | Shared dry/apply preflight in warm batch (no `!dryRun` compute fork) | **No** |
| Decline `parcel-node-key-unresolved` / block `_feature-*` | Same preflight | **No** |
| Unit: zoning-fact alone cannot promote | Fixture test on warm entry | **No** |
| keyKind-aware resolve | Resolver queries `geo_id` when keyKind requires it | **No** (prop_id only) |
| Multi-feature honesty | Planner emits `geometry-incomplete` OR atom carries `additionalFeatureIndexes` | **Partial** (fold is resolved + extras dropped from body) |
| Plan vs active cardinality after parcel-node apply | Fail if disagree | **No** (writer write-then-verifies bodies only) |

### Invariant C2 — What it WRITES BACK

**Rule.** Jurisdiction factory writes **zero** `parcel-node` atoms and **zero** `txgio_parcel` rows. It writes jurisdiction claims keyed by `parcelNodeId`, and writes `atom_links` under C4. No ring coordinates in any atom body.

**Membership reconciliation (amended after dual-SOT hunt).** For "which parcel is this claim about?":

- **`body.parcelNodeId` is authoritative.**
- `applies-to` links (claim DID → parcel-node DID) are a **derived index**, written in the same transaction as the claim persist. If link and body disagree, body wins and the link is repaired or the write fails closed.
- Drift probe: count of active jurisdiction atoms whose `applies-to` target DID does not match `did:hauska:parcel-node:{body.parcelNodeId}` must be zero after promote.

**Manifest.** Atom store authoritative for satisfied-present and satisfied-absent. Manifest authoritative for `not-yet` only, defined as complement (prior Proposal 5 ADOPT-WITH-CHANGES). Manifest is a materialized view, not a hand ledger.

**Enforcing check C2.**

| Check | Mechanism | Exists today? |
|---|---|---|
| Only parcel-node writer constructs `entityType: "parcel-node"` | Package allowlist / import lint | **No** |
| Builders omit coordinates | Writer seam + unit assert | **Yes** (builder tests) |
| Schema fail-closed on coordinates / geometry keys | `PARCEL_NODE_SCHEMA.strict()` + refine | **No** — Zod strips unknowns; draft's "schema rejects" claim was false (adversarial) |
| Membership drift probe | Post-promote SELECT | **No** |
| Manifest recompute | Job + drift alarm | **No** (manifest schema itself absent) |

### Invariant C3 — Re-acquisition semantics

**Trigger.** Statewide ingest replaces `txgio_parcel` for a `county_fips` (delete+load in one transaction).

**Ordered procedure.**

1. Geometry replace completes in `txgio_parcel`.
2. Parcel-node reconcile: `planCountyParcelNodes` from store-truth.
3. Upsert planned atoms (existing CLI; claim-stable content hash).
4. **Orphan retirement (REQUIRED; not built).** Every previously active `parcel-node` for the county whose `parcelNodeId` is absent from the new plan → `status: "retired"`, `retiredAt`, reason. Fail closed if any active orphan remains.
5. **Successor edges** only when succession evidence exists: `atom_links` `linkType: "supersedes"` from successor DID → retired predecessor DID (same direction as `successorPropertyAtomIdentity`).
6. Jurisdiction atoms whose `parcelNodeId` is retired are **not current**. Serve/export must not present them as live. Re-warm against successor id(s) required.
7. **Same-key vintage bump (amended).** Applies **only** to account keys under the county's established `keyKind` (`prop_id` or `geo_id_crosswalk` tokens that pass `KEY_TOKEN_PATTERN` and are not `_feature-*`). Synthetic keyless ids are **never** same-key-continuous across re-acquire: always retire the old `_feature-*` row and mint a new absence under the new plan (new feature index may collide; DID reuse is identity theft — Case B FATAL).

**Succession evidence (must not invent).**

1. Same account `parcelNodeId` under established `keyKind`.
2. Explicit source successor attributes if a future edition ships them (none observed — do not invent).
3. Operator-approved spatial lineage job with named thresholds and an evidence artifact (**not specified** — Gap; until then: retire without successor only).

`feature_index` is within-vintage tile de-dupe only. It is not cross-vintage identity. The planner's `_feature-${featureIndex}` token embeds that sequence number and **must not** participate in C3.7 continuity.

**Geometry-binding stamp (amended after FATAL on hash).** `parcelNodeContentHash` today hashes pointer metadata + vintage string, **not ring bytes**. It is insufficient as a ring-change detector. Jurisdiction invalidate-on-mismatch requires a persisted stamp that changes when the resolvable ring changes (e.g. hash of normalized WKB / reducible ring from `txgio_parcel`, stored on the parcel-node claim and copied onto jurisdiction atom provenance at promote). Until that stamp exists, C3.7 is policy fiction for same-key ring moves under a stable vintage label.

**Split / merge table (account keys only).**

| Event | Parcel-node | Jurisdiction |
|---|---|---|
| Delete, no successor | Retire orphan; no supersedes | Non-current (`parcel-node-retired`) |
| Split A→B,C with evidence | Retire A; upsert B,C; supersedes B→A, C→A | Re-warm B and C |
| Merge A,B→C with evidence | Retire A,B; upsert C; supersedes C→A, C→B | Re-warm C |
| Re-key without evidence | Retire old; upsert new; **no** fabricated supersedes | Same as delete+create |
| Same account key, new vintage / ring stamp | Upsert parcel-node; jurisdiction stale by stamp mismatch | Re-warm before serve-as-current |
| Keyless `_feature-*` on any re-acquire | Always retire prior + mint new from plan; never upsert-as-continuity | N/A (never warm-eligible) |

**Enforcing check C3.**

| Check | Mechanism | Exists today? |
|---|---|---|
| Orphan retirement in writer after plan | Flip retired; fail if active∉plan | **No** |
| `_feature-*` never same-key continuity | Explicit branch in reconcile | **No** (upsert treats them as ordinary ids) |
| Ring-binding stamp on parcel-node + jurisdiction | Store-side geometry fingerprint | **No** |
| Serve probe: no current chain on retired subject | MCP/retrieval customer-done grade | **No** |
| Fixtures: delete / split / merge / keyless reshuffle / vintage bump | Unit + integration | **No** |

**Hard stop.** Until orphan retirement and the `_feature-*` carve-out ship, re-acquiring a county that already has jurisdiction atoms is **contract-unsafe**.

### Invariant C4 — `atom_links` carry relationships

**Rule.** Use shipped `atom_links` and `LinkType`. No parallel graph.

| Relationship | LinkType | Direction |
|---|---|---|
| Jurisdiction claim about a parcel | `applies-to` | claim → parcel-node (derived index per C2) |
| Envelope / derived inputs | `derives-from` | envelope → input claim / parcel-node |
| Parcel under easement / district / restriction | `subject-to` | parcel-node → encumbrance/district |
| Parcel succession | `supersedes` | successor parcel-node → retired predecessor |
| Parcel ∩ well | **add** `intersects-well` | well → parcel-node |
| Parcel ∩ pipeline | **add** `intersects-pipeline` | pipeline-segment → parcel-node |

Property succession field `supersedesEntityId` stays on property atoms; parcel-node succession uses `atom_links` only. Do not mix vocabularies without stating the scope (adversarial dual-vocabulary note — accepted as scoped, not fatal).

**AccessPolicy.** `atom_links` has no accessPolicy column (prior M6). Write-time reject: no link endpoint may be `tenant-private` when the other end is a public parcel-node.

**Enforcing check C4.**

| Check | Mechanism | Exists today? |
|---|---|---|
| Property/O&G join paths call `writeAtomLinks` | Adapter tests | **No** (zero property writers) |
| Spine-health count after well-join apply | Probe | **No** |
| Write-time tenant-private reject | Storage guard | **No** |

C4 text HOLDS under adversarial attack (uses shipped layer; additive members match prior salvage).

### Invariant C5 — Ordering before warm

**Rule.** Warm parcel P only when:

1. `txgio_parcel` has reducible geometry for P (resolver would not decline multi-part / unusable).
2. C1 warm eligibility holds (amended).
3. Recipe prerequisites for the claim class are met.
4. Parcel-node not retired.
5. For promote-as-current: geometry-binding stamp matches (once stamp exists per C3).

**Enforcing check C5.** Shared preflight for dry and apply; contract-visible decline / absence shapes (never engine-only fields that die at MCP export). County "warm allowed" probe. **None of this exists today** — GAP until shipped; inherits C1 FATAL definition until C1 is rewritten in code.

### What cannot be written without more information

1. **Spatial succession thresholds** for split/merge without prop_id continuity — no decision exists; inventing IoU/overlap numbers would be dishonest. Until decided: retire without successor only.
2. **Live `atom_links` row counts by linkType** — not queried (safety). Property write absence is from source recon.
3. **PR #284 merge/deploy permanence** — OPEN; Kenedy 528 is PR-body proven, not yet planner-merged production canon.
4. **Annexation / `valid_from` on property atoms** (prior M5) — out of v1 scope; C3 does not cover jurisdiction change over time.
5. **Condo / vertical subdivision** (prior M2) — unsolved; not papered over here.

---

## Part 2 — Nine-rail reconciliation (against the contract, by data arrival)

Scope: the ten-rail spec minus `parcel-node` (seam crossed). Join remains derived per operator ruling. Footprint/easement excluded (publishing lane). Existing rails (zoning/setback, roads, envelope) unchanged.

| # | Rail | Atom or derived | Family / mechanism | accessPolicy | Typed absence (contract-native) | Data arrival now | Build order |
|---|---|---|---|---|---|---|---|
| 1 | Join quality | **derived** | roster / manifest metric only; `keyKind` on atoms is identity metadata, not this rate | n/a | n/a | roster 254/254 | **0 — do not atomize** |
| 2 | Flood hazard | atom | `flood-hazard-fact` | `public-free` | `no-flood-coverage`; Zone X / SFHA false = satisfied-present | adapter payload exists; NFHL bulk L4 open | **2 — first new family when NFHL lands** |
| 3 | Soils (SSURGO) | atom | `soil-survey-fact` | `public-free` | `no-soil-mapping` | adapter point-in-polygon; bulk weakest link | **3 — with SSURGO acquisition, not before** |
| 4 | CAD attributes | atom | `cad-parcel-roll` | `public-free` | `no-cad-row`, `join-hold`, county `verifiedAbsence` | **15 rows statewide** | **4 — after CAD bulk** |
| 5 | Land use | atom | `land-use-fact` (separate so manifest thresholds can diverge from full CAD promote) | `public-free` | `no-land-use-code`, `join-hold` | same CAD field | **4 — same ingest wave as CAD** |
| 6 | Owner facet | atom | `parcel-owner-facet` | `public-paid` | `owner-join-hold` (crosswalk HOLD counties) | CAD owner columns; paywall path | **5 — after CAD + paywall gate** |
| 7 | RRC wells | existing `well` + `intersects-well` links | no new well type | `public-free` | county `verifiedAbsence` after probe | W3 HELD; O&G types exist | **6 — when W3 un-HELD** |
| 8 | RRC pipelines | atom | `pipeline-segment` + `intersects-pipeline` | `public-free` | county `verifiedAbsence` | **no adapter / no source wired** | **7 — acquisition first** |
| 9 | MUD / districts | atom | `special-district-membership` + `subject-to` | `public-free` | `no-special-district` (satisfied-present when outside all) | W4 HELD; no table | **7 — when W4 un-HELD** |

Contract constraints on every new family: pointer/key via `parcelNodeId`; absence first-class (no `warmVerifyDecline` engine-only pattern); writes `applies-to` as derived index; never stores parcel ring bytes; warm only under C5.

---

## Part 3 — Adversarial reviewer verdict (verbatim excerpts)

Full artifact: `_inbox/2026-08-08_CONSUMPTION_CONTRACT_adversarial_review.md` (authored by independent reviewer seat; Geometry Law rule 5).

**Overall verdict (verbatim):**

> **PARTIAL HOLD WITH FATAL GAPS.**
>
> The draft's authority split and anti-REJECT posture survive attack: it does not re-propose a ring atom, a second relationship table, or a parcel re-key. Geometry stays in `txgio_parcel`. Relationships stay on shipped `atom_links`. That framing is not the failure.
>
> What fails is the hard seam the draft exists to define. **C1 warm eligibility and C3 re-acquisition semantics are wrong as written** against the live parcel-node planner/writer they cite as evidence. Several "enforcing checks" are named as if they constrain the system; most do not exist, and one (schema rejects coordinates) is a false claim about `PARCEL_NODE_SCHEMA`. Until C1/C3 are rewritten against the planner's actual key and hash behavior, and until orphan retirement plus warm gates exist as code, this contract must not be ratified and must not authorize re-acquire of any warmed county.

**Counts (verbatim):** FATAL 2 / GAP 2 / HOLDS 1 — C1 FATAL, C2 GAP, C3 FATAL, C4 HOLDS, C5 GAP.

**Worst break (verbatim):**

> **FATAL — synthetic `_feature-${featureIndex}` keys vs C3 same-key / upsert.** Contract forbids feature_index as cross-vintage identity, then binds re-acquisition to upsert on `parcelNodeId` tokens the planner derives from feature_index for keyless rows.

**What broke (verbatim list condensed with evidence the parent re-verified):**

1. Synthetic `_feature-*` same-key upsert = identity theft on StratMap reshuffle — confirmed `plan-county-parcel-nodes.ts:445`.
2. C1.1 incomplete: multi-feature still resolved; extras dropped from body; resolver prop_id-only; warm has zero parcel-node gate — confirmed.
3. `parcelNodeContentHash` is not a ring-binding instrument — confirmed hash inputs in `parcel-node-atoms.ts:55-85`.
4. Most "enforcing checks" aspirational; schema does not `.strict()`-reject coordinates — confirmed.
5. Dual membership SOT: `body.parcelNodeId` + mandatory `applies-to` without winner — accepted; amended in C2 above.

**What could not be broken (verbatim summary):** anti-ring commitment; no invented relationship table; no silent parcel re-key; manifest-as-view prose; draft honesty that orphan retirement is unbuilt.

**Re-proposal check:** no re-proposal of prior REJECT items 1, 2, or 4.

---

## Part 4 — What to build first

**Not a new atom family.** Contract machinery on the existing seam:

1. **Orphan retirement + `_feature-*` carve-out** in `write-parcel-node-county.mjs` (C3 FATAL). Fail closed on active∉plan. Keyless absences never same-key-continuous across re-acquire.
2. **C1/C5 warm preflight** in the real batch entry: `no-parcel-node-anchor`, block `_feature-*`, unit test that zoning-fact alone cannot promote.
3. **keyKind-aware resolve** (geo_id column path) before any crosswalk county is warmed under the gate.
4. **Multi-feature honesty:** surface `additionalFeatureIndexes` on the atom or plan them as `geometry-incomplete`.
5. **Ring-binding stamp** (geometry fingerprint on parcel-node + copy onto jurisdiction provenance) before C3.7 is claimed.
6. **`PARCEL_NODE_SCHEMA.strict()` + coordinates forbid** so the negative test matches the claim.

**First new family by data arrival:** `flood-hazard-fact` when L4 NFHL is loaded (adapter payload already exists; no CAD dependency). Do not build `parcel-owner-facet` or `cad-parcel-roll` before CAD bulk moves off 15 rows. Do not build pipeline/MUD shapes before their acquisition is un-HELD.

**Do not re-acquire any warmed county** until items 1–2 ship.

---

## Artifacts in this program

| File | Role |
|---|---|
| `_inbox/2026-08-08_CONSUMPTION_CONTRACT_draft_for_review.md` | Pre-review draft (superseded by Part 1 amendments where they conflict) |
| `_inbox/2026-08-08_CONSUMPTION_CONTRACT_adversarial_review.md` | Independent refutation (rule 5) |
| `_inbox/2026-08-08_CONSUMPTION_CONTRACT_report.md` | This report — single deliverable |

Planner verification of reviewer claims: re-read planner synthetic key, warm CLI (no parcel-node references), resolver prop_id-only query, and hash inputs. Did not trust the reviewer's close on self-claim alone.
