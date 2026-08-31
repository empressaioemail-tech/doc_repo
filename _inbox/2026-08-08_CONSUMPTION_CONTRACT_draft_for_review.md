---
id: 2026-08-08_CONSUMPTION_CONTRACT_draft_for_review
title: DRAFT — two-factory consumption contract (for adversarial review)
date: 2026-08-08
status: draft for adversarial review — not yet ratified
owner: nick
related: [_inbox/2026-08-08_ATOM_families_ten_rail_spec, _inbox/2026-08-08_DATA_MODEL_adversarial_review, _decisions/2026-08-07_envelope_saga_close_and_geometry_law, _decisions/2026-08-08_county_shape_thirteen_rails_and_geometry_first, hauska-engine PR #284]
---

# DRAFT — Consumption contract between statewide and jurisdiction factories

This draft is the Phase 1 deliverable under attack. Reviewer: refute it. Do not grade it.

## Evidence base (not invented)

- Geometry Law, eight rules (`_decisions/2026-08-07_envelope_saga_close_and_geometry_law.md`).
- County shape / three states (`_decisions/2026-08-08_county_shape_thirteen_rails_and_geometry_first.md`).
- Prior adversarial REJECT of ring-atom, new relationship layer, and parcel re-key (`_inbox/2026-08-08_DATA_MODEL_adversarial_review.md`).
- Live writer: `P:\hauska-engine\packages\engine-core\src\parcel-node\` + `scripts/write-parcel-node-county.mjs` (PR #284 OPEN). Kenedy 48261: 528 atoms written, 528/528 read-back verified, zero bodies with coordinates (PR body).
- Jurisdiction warm today sizes from `zoning-fact` atoms and resolves rings from `txgio_parcel` (`depth-warm-bastrop-batch.mjs`); it does not consult `parcel-node`.
- `atom_links` + 15-member `LinkType` ship; property adapters do not write rows (`atom-link.ts`, adversarial S1).
- Writer upserts planned atoms; **orphan retirement on re-acquisition is not implemented** (verified by reading the CLI end-to-end).

## Authority split (non-negotiable framing)

| Concern | Authoritative store | Writer |
|---|---|---|
| Parcel ring geometry | `txgio_parcel` only | Statewide / TxGIO ingest |
| Parcel membership + geometry provenance by reference | `parcel-node` atoms | Statewide parcel-node writer only |
| Zoning, setbacks, envelope, boundary edges, jurisdiction claims | property atoms | Jurisdiction factory |
| Structural relationships (succession, parcel↔well/district) | `atom_links` | Named adapter after this contract |

Rejected forever under this contract (re-statement of prior REJECT, not re-proposal): ring bytes in atoms; a second relationship table; re-keying `parcelNodeId` / MCP `parcel_node_id`.

---

## Invariant C1 — What the jurisdiction factory READS, and when

**Rule.** The jurisdiction factory reads `parcel-node` atoms for warm eligibility, key discipline, and vintage binding. It does not treat `parcel-node` as a second geometry store. Ring bytes always come from `txgio_parcel` via the existing resolver pin (Geometry Law rules 1 and 8).

Concrete reads:

1. **Warm eligibility.** A parcel may enter a warm/promote cohort only if there exists an **active** `parcel-node` with `geometryLoaded: true` whose `geometryStoreRef` resolves in `txgio_parcel`.
2. **Key discipline.** Warm and CAD join paths must honor `keyKind` on the parcel-node (`prop_id` | `geo_id_crosswalk`). A county with `unresolved` key policy cannot promote owner-bearing or CAD-joined claims.
3. **Vintage binding.** Before promote, the warm path records the parcel-node `sourceVintage` (and content hash of the geometry claim) onto the produced atoms' provenance. That stamp is what re-acquisition invalidation keys on (C3).
4. **Cohort sizing.** Recipe eligibility (e.g. presence of `zoning-fact`) still defines *which claims can be computed*. The **countable warm set** is the intersection of recipe eligibility and C1.1. Acquisition accounting ("how many parcels exist in the county") remains store-truth from `txgio_parcel` at execution time (Geometry Law rule 8), never from a hardcoded allowlist and never from a stale atom count alone.

**What changes vs today.** Today `depth-warm-bastrop-batch.mjs` sizes from `zoning-fact` and resolves geometry from `txgio_parcel` with no parcel-node gate. That gate becomes mandatory once a county has a completed parcel-node apply (Kenedy-class). Counties with geometry loaded but no parcel-node apply remain **not warmable under this contract** (ordering C5), which is intentional: crossing the seam once without the gate is how 254 counties become ambiguous.

**Enforcing check C1.**

- Runtime: warm/promote preflight decline `no-parcel-node-anchor` when C1.1 fails; decline `parcel-node-key-unresolved` when keyKind blocks the claim class.
- Mechanical: unit test on the warm entry that a fixture parcel with zoning-fact but no active resolved parcel-node cannot promote.
- Drift: county job fails if `count(active resolved parcel-node)` and `planCountyParcelNodes(...).counts.resolved` disagree after a parcel-node apply (writer already write-then-verifies bodies; this check is plan-vs-store cardinality).

---

## Invariant C2 — What it WRITES BACK (and the one-truth rule)

**Rule.** The jurisdiction factory writes **zero** `parcel-node` atoms. It writes jurisdiction claims keyed by `parcelNodeId`, and it writes `atom_links` that attach those claims to parcel-node DIDs. It never writes ring coordinates into any atom body.

Write permissions:

| Writer | May write | Must not write |
|---|---|---|
| Statewide parcel-node CLI / seam | `parcel-node` (+ county-coverage absence) | zoning / setback / envelope / boundary edges |
| Jurisdiction warm / promote | `zoning-fact`, `setback-rule`, `buildable-envelope`, `property-boundary-edge`, future jurisdiction families under Phase 2 | `parcel-node`, `txgio_parcel` rows |
| Either, via named adapter | `atom_links` rows under C4 | a parallel link table |

**One-truth rule.** For any claim class, exactly one writer family is authoritative. Geometry claim class = `txgio_parcel` + `parcel-node` pointer. Jurisdiction claim class = jurisdiction atoms. The manifest is a materialized view over atoms (satisfied-present / satisfied-absent) with `not-yet` as complement only — prior adversarial ADOPT-WITH-CHANGES on Proposal 5, adopted here as binding.

**Enforcing check C2.**

- Mechanical ownership test: engine package allowlist — `write-parcel-node*` and `parcel-node-writer` are the only call sites that may construct `entityType: "parcel-node"`. Warm/promote paths assert they never import those builders.
- Schema: `PARCEL_NODE_SCHEMA` rejects bodies containing GeoJSON `coordinates` (already the pointer-only shape; keep a negative test that a ring-bearing payload fails parse).
- Manifest drift alarm: recompute job; hand-edited manifest rows are non-authoritative.

---

## Invariant C3 — Re-acquisition semantics (the hard one)

**Trigger.** A county is re-acquired when statewide ingest replaces `txgio_parcel` rows for that `county_fips` with a fresher StratMap (or override) vintage. Observed pattern: delete + load in one transaction (`_inbox/2026-08-08_L2_first_county_proof.md`).

**Ordered procedure (binding).**

1. **Geometry replace** completes in `txgio_parcel` (statewide).
2. **Parcel-node reconcile** runs (statewide writer), producing a new plan from store-truth rows.
3. **Upsert** all planned atoms (existing CLI behavior: idempotent on `atom_did`, claim-stable content hash).
4. **Orphan retirement (REQUIRED; not built today).** Every previously **active** `parcel-node` for the county whose `parcelNodeId` is absent from the new plan MUST be flipped to `status: "retired"` with a recorded `retiredAt` and reason. Silence (leaving the old active row) is a contract violation.
5. **Successor edges.** When succession is established, write `atom_links` with `linkType: "supersedes"` from each **successor** parcel-node DID to each **retired** predecessor DID (same direction as `successorPropertyAtomIdentity` / `supersedesEntityId` on property atoms: the survivor points at what it replaces).
6. **Jurisdiction invalidation.** Any jurisdiction atom (zoning-fact, setback-rule, buildable-envelope, boundary-edge, future families) whose `parcelNodeId` refers to a retired parcel-node is **not current**. Serve and export paths must not present it as live. Re-warm against successor id(s) is required before the claim is current again.
7. **Same-key vintage bump.** If `parcelNodeId` survives but `sourceVintage` / geometry claim hash changes, the parcel-node upserts in place, and jurisdiction atoms whose recorded geometry vintage/hash no longer match are **stale** and require re-warm (same class as R30 "never reuse stale roles," applied to geometry binding).

### Split / merge / delete / re-key (what "hold" means)

| Event | Parcel-node action | Jurisdiction action |
|---|---|---|
| Delete (key gone, no successor) | Retire orphan; no `supersedes` edge | Prior claims become non-current (`parcel-node-retired`) |
| Split (A → B,C) | Retire A; upsert B,C; `supersedes` edges B→A and C→A | Claims on A non-current; warm B and C separately |
| Merge (A,B → C) | Retire A,B; upsert C; `supersedes` C→A and C→B | Claims on A,B non-current; warm C |
| Re-key without evidence | Retire old; upsert new; **no** fabricated `supersedes` | Same as delete + create; do not invent continuity |
| Same key, new vintage | Upsert parcel-node; mark jurisdiction stale by vintage mismatch | Re-warm before serve-as-current |

### Succession evidence (must not invent)

`feature_index` is a **within-vintage** shapefile sequence number. It is valid for tile de-duplication inside one load (PR #284 planner). It is **not** a cross-vintage identity. Succession evidence, in order of strength:

1. Same `parcelNodeId` token under the county's established `keyKind` (continuity of account key).
2. Explicit source-provided successor/predecessor attributes if a future StratMap edition ships them (none observed today — do not pretend they exist).
3. Operator-approved spatial lineage job with named thresholds and an evidence artifact (not yet specified; see Gaps).

If none apply: retire without successor. Wrong continuity is worse than a gap (owner-join doctrine, OPS-1).

**Enforcing check C3.**

- Re-acquire gate: after parcel-node reconcile, `count(active parcel-node where county prefix) == plan.planned.length` AND `count(active parcel-node not in plan) == 0`. Fail closed otherwise.
- Unit tests: fixtures for delete, split, merge, same-key vintage bump; assert retirement, link rows, and warm declines on retired ids.
- Serve probe: MCP/retrieval must not return retired-subject jurisdiction atoms as the current chain slot (customer-done grade, not PR-green).
- **Honesty about today:** the orphan-retirement step and succession matcher are **not implemented** in `write-parcel-node-county.mjs`. Until they ship, re-acquiring a county that already has jurisdiction atoms is **contract-unsafe** and must not be run against warmed counties.

---

## Invariant C4 — `atom_links` carry relationships

**Rule.** Use the shipped `atom_links` table and `LinkType` union. Do not invent a parallel graph.

| Relationship | LinkType | Direction | Notes |
|---|---|---|---|
| Jurisdiction claim about a parcel | `applies-to` | claim DID → parcel-node DID | zoning-fact, setback-rule, flood-hazard-fact, soil-survey-fact, land-use-fact, cad-parcel-roll |
| Envelope / derived reasoning inputs | `derives-from` | envelope DID → input claim DID (and/or parcel-node) | already in union |
| Parcel under easement / district / restriction | `subject-to` | parcel-node DID → encumbrance/district DID | ADR-029 vocabulary; already in union |
| Parcel succession | `supersedes` | successor parcel-node DID → retired predecessor DID | already in union; write the rows |
| Parcel spatially intersects well | **extend** `LinkType` with `intersects-well` | well DID → parcel-node DID | only when RRC join writes; do not overload `see-also` |
| Parcel spatially intersects pipeline | **extend** with `intersects-pipeline` | pipeline-segment DID → parcel-node DID | same |
| Parcel in special district | prefer `subject-to` | parcel-node → special-district-membership | no new type unless `subject-to` proves too overloaded in serve filters |

**Enforcing check C4.**

- Adapter write tests: property/O&G join paths call `writeAtomLinks` (today: zero property writers — that absence is the defect).
- Retrieval tally already SELECTs `atom_links`; add a spine-health probe that county X with N well joins has ≥N `intersects-well` rows after apply.
- AccessPolicy caveat (prior M6): `atom_links` has no accessPolicy column. Until gated, links may only connect `public-free` / `public-paid` endpoints that the retrieval scope already allows; **no** `tenant-private` endpoint may be linked from a public parcel-node. Enforce with a write-time reject.

---

## Invariant C5 — Ordering before warm

**Rule.** The jurisdiction factory may warm parcel P only when all of the following are true:

1. `txgio_parcel` contains a reducible geometry for P (resolver would not return `MULTI_PART_GEOMETRY_UNSUPPORTED` / unusable).
2. Active resolved `parcel-node` for P exists (C1.1).
3. Recipe prerequisites for the claim class are met (e.g. zoning-fact stamp for envelope promote — existing layer-23 / dominant-district discipline).
4. P's parcel-node is not retired (C3).
5. For promote-as-current: no open geometry-vintage mismatch between the parcel-node and the jurisdiction atom being replaced (C3.7).

**Enforcing check C5.**

- Preflight function shared by dry-run and apply (no `!dryRun` compute fork — engine #279 lesson).
- Decline codes are contract-visible where the family has `absence` / decline shapes; never engine-only fields that die at MCP export (`buildable-envelope` mistake, QUEUE:129 — fix that family separately, do not repeat).
- Conformance: a county-level "warm allowed" probe lists counts for blocked-by-C5 vs eligible.

---

## Gaps that block a complete contract (named, not invented)

These are not soft TODOs; they are places where inventing a number or algorithm would be dishonest:

1. **Succession spatial matcher thresholds** for split/merge when `prop_id` does not continue — not specified in any decision; must be a separate short decision before re-acquire-of-warmed-counties is allowed.
2. **Live `atom_links` row counts by linkType** — not queried this session (safety: no casual prod SELECT beyond documented probes). Property write absence is from source recon, not row proof.
3. **PR #284 is OPEN**, not merged — Kenedy 528 is proven on the PR's apply path per its body; treat production permanence as pending merge/deploy ownership.
4. **Temporal `valid_from` / `valid_to` on property atoms** (prior M5) — out of scope for this contract's v1, but annexation will re-litigate; do not pretend C3 covers annexation jurisdiction changes.
5. **Condo / vertical subdivision** (prior M2) — model still one ring → one envelope; not solved here.

---

## Phase 2 preview (for review against the contract, not independent ambition)

Nine rails from the ten-rail spec after `parcel-node`:

| Rail | Atom or derived | Family | accessPolicy | Typed absence | Build when data arrives |
|---|---|---|---|---|---|
| Join quality | **derived** | roster / manifest only | n/a | n/a | already |
| CAD attributes | atom | `cad-parcel-roll` | `public-free` | `no-cad-row`, `join-hold`, county `verifiedAbsence` | CAD bulk >15 rows |
| Flood hazard | atom | `flood-hazard-fact` | `public-free` | `no-flood-coverage`; Zone X is present | NFHL load / adapter mint |
| Soils | atom | `soil-survey-fact` | `public-free` | `no-soil-mapping` | SSURGO acquisition path |
| Land use | atom | `land-use-fact` | `public-free` | `no-land-use-code`, `join-hold` | with CAD |
| Owner facet | atom | `parcel-owner-facet` | `public-paid` | `owner-join-hold` | after CAD + paywall |
| RRC wells | existing `well` + links | no new well type | `public-free` | county verifiedAbsence after probe | W3 un-HELD + intersects-well writes |
| RRC pipelines | atom | `pipeline-segment` | `public-free` | county verifiedAbsence | source+ingest exist |
| MUD / districts | atom | `special-district-membership` | `public-free` | `no-special-district` (satisfied-present) | W4 un-HELD |

**Build first (after Phase 1 machinery):** orphan retirement + C1/C5 warm gate (contract enforcement on the existing seam). **First new family by data arrival:** `flood-hazard-fact` when L4 NFHL is loaded (adapter payload already exists; no CAD dependency). Do not build `parcel-owner-facet` before CAD bulk.
