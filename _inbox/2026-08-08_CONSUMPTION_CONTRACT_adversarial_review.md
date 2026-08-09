---
id: 2026-08-08_CONSUMPTION_CONTRACT_adversarial_review
title: Adversarial review — two-factory consumption contract draft
date: 2026-08-08
status: review finding (read-only against sources; deliverable is this file)
owner: nick
reviews: _inbox/2026-08-08_CONSUMPTION_CONTRACT_draft_for_review
method: tool-read of draft, prior DATA_MODEL adversarial review, Geometry Law decision, write-parcel-node-county.mjs, plan-county-parcel-nodes.ts, atom-link.ts, depth-warm-bastrop-batch.mjs, property-reasoning/retire.ts, parcel-node-writer.ts, PARCEL_NODE_SCHEMA, parcel-geometry-resolver.ts
related: [_inbox/2026-08-08_DATA_MODEL_adversarial_review, _decisions/2026-08-07_envelope_saga_close_and_geometry_law, _decisions/2026-08-08_county_shape_thirteen_rails_and_geometry_first]
---

# Adversarial review — consumption contract draft

## Verdict

**PARTIAL HOLD WITH FATAL GAPS.**

The draft's authority split and anti-REJECT posture survive attack: it does not re-propose a ring atom, a second relationship table, or a parcel re-key. Geometry stays in `txgio_parcel`. Relationships stay on shipped `atom_links`. That framing is not the failure.

What fails is the hard seam the draft exists to define. **C1 warm eligibility and C3 re-acquisition semantics are wrong as written** against the live parcel-node planner/writer they cite as evidence. Several "enforcing checks" are named as if they constrain the system; most do not exist, and one (schema rejects coordinates) is a false claim about `PARCEL_NODE_SCHEMA`. Until C1/C3 are rewritten against the planner's actual key and hash behavior, and until orphan retirement plus warm gates exist as code, this contract must not be ratified and must not authorize re-acquire of any warmed county.

Counts below: **FATAL 2 / GAP 2 / HOLDS 1** (primary classification per invariant C1–C5).

---

## Per-invariant attack table

| Inv | Classification | Attack that landed | Evidence |
|---|---|---|---|
| **C1** | **FATAL** | Warm eligibility = `geometryLoaded: true` + `geometryStoreRef` resolves is incomplete and, for `geo_id_crosswalk`, incompatible with the live resolver. Multi-feature accounts stay `geometryLoaded: true` while `additionalFeatureIndexes` is hashed then **dropped from the atom body**, so no consumer can decline them. Live warm path has **zero** parcel-node gate. | `plan-county-parcel-nodes.ts:391-403` (multi-feature still `resolved`); `parcel-node-atoms.ts:101-121` (extras only in contentHash, not on atom); `parcel-node-writer.ts:146-150` (`geometryStoreRef.propId = parcelKey`); `parcel-geometry-resolver.ts:166-178` (lookup is `txgio_parcel.prop_id` only); `depth-warm-bastrop-batch.mjs` grep for `parcel-node` / `geometryLoaded` → no hits; cohort sized from `zoning-fact` at `:322-442` |
| **C2** | **GAP** | One-truth geometry rule holds in prose. Claimed checks do not. `PARCEL_NODE_SCHEMA` is not `.strict()` and has no coordinates forbid — Zod strips unknown keys; it does **not** "reject bodies containing GeoJSON coordinates." Ownership allowlist / "warm never imports builders" is aspirational. Writing `applies-to` **and** keeping `body.parcelNodeId` without a reconciliation rule creates a membership dual-read (see two-SOT hunt). | `hauska-atom-contract/src/property/parcel-node.ts:103-262` (no `.strict()`, no coordinates gate); `parcel-node-registration.test.ts:89-100` (asserts builders omit coordinates, not that parse fails on ring payload); draft C2 enforcing-check bullets; prior review Proposal 5 ADOPT-WITH-CHANGES on manifest-as-view (draft adopts correctly in prose) |
| **C3** | **FATAL** | Same-key upsert semantics collide with the planner's synthetic keyless ids. Planner mints `parcelKey: "_feature-${featureIndex}"` (`plan-county-parcel-nodes.ts:445`). Contract correctly says `feature_index` is **not** cross-vintage identity (`draft:105-112`), then C3 step 3 upserts on `atom_did` derived from that token and C3.7 treats surviving `parcelNodeId` as account continuity. Re-acquire reshuffles shapefile order → silent identity theft. Separately, "geometry claim hash" as implemented (`parcelNodeContentHash`) hashes pointer metadata + vintage string, **never ring bytes**, so a ring move under a stable vintage label is invisible to C3.7. Orphan retirement is correctly admitted missing — that honesty is not a defense of the broken same-key rule. | `plan-county-parcel-nodes.ts:434-450`, test expects `_feature-0` at `plan-county-parcel-nodes.test.ts:222`; `write-parcel-node-county.mjs` upsert loop `:329-377` with **no** retire/orphan path (grep `retired\|orphan` → none); `parcel-node-atoms.ts:55-85` (hash inputs); `retire.ts` exists for property status flip but is **not** called from the parcel-node CLI |
| **C4** | **HOLDS** | Attack: "this invents a relationship layer." Failed. Draft uses shipped `LinkType` / `atom_links` and proposes additive members (`intersects-well`, `intersects-pipeline`), which matches the prior review's recommended salvage of Proposal 4, not Proposal 4 itself. AccessPolicy caveat (M6) is correctly carried. Nested enforcement (no property writers today) is a GAP under "what is missing," not a failure of the invariant text. | `atom-link.ts:8-23` (15-member union includes `applies-to`, `derives-from`, `subject-to`, `supersedes`); prior review S1 on Proposal 4 REJECT + recommended LinkType extension; draft C4 table |
| **C5** | **GAP** | Ordering prose is right (geometry reducible → active resolved parcel-node → recipe → not retired → vintage match). Every named check is aspirational. C5.2 inherits C1's FATAL definition of "resolved." No shared preflight; warm still forks on recipe/`zoning-fact` only. | draft C5 enforcing checks; `depth-warm-bastrop-batch.mjs` header + `:322+` (zoning-fact cohort); no `no-parcel-node-anchor` decline string in engine-core warm scripts (searched) |

---

## Split scenario walkthrough (concrete)

**County:** `48261` (Kenedy-class). **Vintage V1** StratMap load. **Vintage V2** re-acquire: delete+load of `txgio_parcel` for `county_fips=48261` (pattern the draft cites).

### Case A — true CAD split (prop_id continuity breaks)

V1 store: one account `prop_id=100`, `feature_index=50`, ring covering parent tract. Jurisdiction factory (hypothetically) has warmed `zoning-fact` / `buildable-envelope` keyed `48261:100`.

V2 store: parent gone. Two new accounts `prop_id=200` (`feature_index=50`) and `prop_id=201` (`feature_index=51`). Shapefile sequence reused index 50 for a different polygon.

**What the draft says should happen:** retire `48261:100`; upsert `48261:200` and `48261:201`; `supersedes` edges `200→100` and `201→100`; jurisdiction on `100` non-current; re-warm 200 and 201.

**What today's writer does (`write-parcel-node-county.mjs` end-to-end):**

1. Geometry replace completes in `txgio_parcel`.
2. `planCountyParcelNodes` plans resolved atoms for `200` and `201` only. `100` is absent from the plan.
3. Upsert writes/updates `48261:200` and `48261:201` (`writePropertyAtomsBatch` on `atom_did`).
4. **`48261:100` remains `status: "active"`** with `geometryStoreRef.propId = "100"`. That prop_id no longer exists in `txgio_parcel`. No `retiredAt`, no reason, no `atom_links` row.
5. Jurisdiction atoms on `100` remain active rows. No serve probe filters "subject parcel-node retired" today.
6. Succession cannot be inferred from `feature_index=50`: V2's feature 50 is account `200`, not a continuation of V1 account `100`. The draft is correct that using feature_index as succession would be a fallacy — and the live planner already forbids that for **resolved** accounts.

**Classification:** draft procedure is directionally right for Case A; **enforcement is GAP** (orphan retirement + supersedes + serve filter not built). Draft honesty at `:119` matches the code. Case A alone would be GAP, not FATAL.

### Case B — keyless / placeholder path (FATAL)

V1: feature `feature_index=7`, `prop_id='0'` (Kenedy-class placeholder). Planner emits absence under synthetic key:

```text
parcelKey = "_feature-7"   // plan-county-parcel-nodes.ts:445
parcelNodeId = "48261:_feature-7"
atom_did = did:hauska:parcel-node:48261:_feature-7
```

V2: StratMap reshuffles shapefile order. A **different** no-account polygon is now `feature_index=7`. Another former keyless polygon gains a real `prop_id=555`.

**What C3 as written does:**

- Step 3 upserts planned atoms. New plan includes `_feature-7` again → **upsert overwrites** `48261:_feature-7` in place (same `atom_did`), new `sourceVintage`, new absence reason. C3.7 "same key, new vintage" fires as if an **account** continued. It did not. The key token is a within-vintage sequence number with a cosmetic prefix.
- New `48261:555` is upserted as unrelated create.
- No retire of the conceptual V1 land; the DID was reused for different land.

**This is the feature_index cross-vintage fallacy, reintroduced through the synthetic parcelNodeId the statewide writer already emits.** The consumption contract restates the fallacy ban in prose and then binds re-acquisition to upsert-on-`parcelNodeId` without carving out `_feature-*` (or any non-`keyKind` account token) as **never eligible for same-key continuity**.

### Case C — multi-feature account that looks like a split

V1/V2: CAD keeps one `prop_id=100` but StratMap ships two `feature_index` values sharing that account (two polygons). Planner folds to **one** resolved atom with `additionalFeatureIndexes: [secondary]` (`plan-county-parcel-nodes.ts:391-403`), still `geometryLoaded: true`. Warm under C1.1 is allowed. Resolver returns one row via `prop_id` (`ORDER BY ingested_at DESC LIMIT 1`) — which feature's ring wins is store-order, not plan-primary. Contract split table never describes this; C1 never blocks it. Silent partial geometry under an "active resolved" anchor.

---

## Two-sources-of-truth hunt

| Concern | Dual read? | Verdict |
|---|---|---|
| **Ring geometry** | Draft: `txgio_parcel` only; parcel-node is pointer. Matches Geometry Law rule 1 and prior REJECT of ring atom. Builder path does not accept coordinates. | **Clear** if followed. Residual risk: schema does not hard-reject a hand-inserted `coordinates` field (strip, not fail). |
| **Parcel membership (claim → parcel)** | Jurisdiction atoms already carry `body.parcelNodeId` (`property-instances.ts` keyed families). C2/C4 also require `applies-to` links claim DID → parcel-node DID. Two independently readable answers to "which parcel is this claim about?" with no stated winner if they disagree. | **Dual** — FATAL unless contract adds "body key is authoritative; links are index/projection" (or the reverse) and a drift check. |
| **Warm eligibility** | Today: `zoning-fact` presence (`depth-warm-bastrop-batch.mjs`). Draft: intersection with parcel-node gate. Until gate ships, operators can still warm from recipe alone (current code). After gate ships without killing recipe-only paths, two eligibility oracles. | **Dual until C1 code lands and is the only entry.** |
| **Acquisition / "how many parcels"** | Draft correctly assigns store-truth to `txgio_parcel` (Geometry Law rule 8) and warm-count to intersection. Plan `counts.resolved` vs active atom cardinality is a third number (absences, folds, keyless). Named drift check (plan vs active) is not implemented; misuse of atom counts as acquisition would re-open the allowlist defect the CLI header documents. | **Clear in prose; GAP in enforcement.** |
| **Manifest completeness** | Draft adopts prior ADOPT-WITH-CHANGES: manifest = materialized view; `not-yet` = complement. Good. Manifest still has no schema/file/code (prior review S2). | **Clear in prose; GAP in existence.** |
| **Succession** | Parcel-node: draft wants `atom_links.linkType=supersedes`. Property atoms: `supersedesEntityId` + `/vN` entityIds (`retire.ts:successorPropertyAtomIdentity`). Two succession mechanisms across layers. | **Dual vocabulary** — not fatal if scoped (parcel-node uses links only; property uses field only) but must be stated; draft only states the link direction. |
| **Geometry freshness for jurisdiction** | C3.7 wants vintage/hash on jurisdiction provenance. Live zoning/envelope paths do not record parcel-node `sourceVintage` / geometry claim hash for invalidate-on-mismatch (no matches under `depth-warm/` for those fields). Serve can show active jurisdiction beside a bumped parcel-node. | **Dual (stale claim vs fresh pointer)** — GAP today, FATAL if C3.7 is declared binding without a field home. |

---

## Re-proposal check vs prior REJECT list

Prior REJECT list from `_inbox/2026-08-08_DATA_MODEL_adversarial_review.md`:

| Prior REJECT | Re-proposed here? | Evidence |
|---|---|---|
| **Proposal 1 — ring is an atom** | **No.** Explicit forever-reject; pointer-only `parcel-node`; rings from `txgio_parcel`. | draft `:33`, `:60-61`, authority table |
| **Proposal 4 — new relationship layer** | **No.** Uses shipped `atom_links` + `LinkType`; additive union members only. | draft C4; `atom-link.ts` |
| **Proposal 2 — parcel re-key / stable internal identity migration** | **No.** Keeps `parcelNodeId` / MCP `parcel_node_id` shape; uses `keyKind` + `supersedes` links as the prior cheap fix. | draft `:33`, C3 table |

**No re-proposal of the three REJECT items.** C4's `intersects-well` / `intersects-pipeline` extensions are the prior review's recommended salvage, not a new graph store.

---

## What I tried to break and could not

1. **Ring-atom regression.** Tried to find a path where the draft reintroduces ring bytes into atoms or a second geometry store. Authority table, C2 write permissions, and writer seam comments all forbid it. Builder tests assert no `"coordinates"` in emitted JSON. Could not break the anti-ring commitment in the draft text.
2. **Invented relationship table.** Tried to read C4 as Proposal 4 redux. It is not: `applies-to` / `supersedes` / `subject-to` already exist; draft extends the union and demands writers. Survives.
3. **Silent parcel re-key.** Tried to find a new identity scheme. Draft keeps `{fips}:{token}` and MCP-facing stability. Survives.
4. **Manifest as parallel authority.** Tried to re-land prior Proposal 5 defect. Draft explicitly makes manifest a view with `not-yet` as complement. Prose survives; implementation still missing.
5. **Draft dishonesty about orphan retirement.** Tried to catch the draft claiming retirement exists. It does not: `:22`, `:89`, `:119` admit not built. Honesty holds.

## What broke

1. **FATAL — synthetic `_feature-${featureIndex}` keys vs C3 same-key / upsert.** Contract forbids feature_index as cross-vintage identity, then binds re-acquisition to upsert on `parcelNodeId` tokens the planner derives from feature_index for keyless rows. Concrete Case B above. Paths: `plan-county-parcel-nodes.ts:445`, `write-parcel-node-county.mjs:329-332`, draft `:105-112` vs `:86-102`.
2. **FATAL — C1.1 warm eligibility.** (a) Multi-feature resolved anchors are warm-eligible with no atom-visible `additionalFeatureIndexes`. (b) `geometryStoreRef` "resolves" is defined against a resolver that only queries `prop_id`, so `geo_id_crosswalk` keys cannot satisfy C1.1 as implemented. (c) Named declines / unit tests / plan-vs-store cardinality check do not exist; warm still sizes from `zoning-fact`.
3. **FATAL (definition) — C3.7 geometry claim hash.** `parcelNodeContentHash` omits geometry bytes; only vintage string + pointer metadata. Ring change without vintage string change does not invalidate jurisdiction. Draft speaks as if a geometry claim hash exists as a ring-binding instrument; the cited writer hash is not that instrument.
4. **GAP — almost every "Enforcing check" bullet.** Orphan retirement, warm preflight declines, ownership allowlist, manifest recompute, serve probe for retired subjects, adapter `writeAtomLinks` tests, shared C5 preflight: none present in the cited warm CLI or parcel-node CLI. Draft admits some; still lists others in present tense.
5. **GAP / false claim — C2 schema "rejects" coordinates.** `PARCEL_NODE_SCHEMA` does not fail closed on extra `coordinates`; no `.strict()`. Negative parse test described in the draft is not what `parcel-node-registration.test.ts:89-100` implements.
6. **Dual membership SOT** — `body.parcelNodeId` plus mandatory `applies-to` without reconciliation (see hunt).

---

## What is missing that would make the contract enforceable

These are ratification blockers, not polish:

1. **Carve-out or redesign of synthetic keys.** Either: (a) keyless absences use a vintage-scoped id (e.g. include `sourceVintage` in the token / DID) and are never eligible for C3.7 same-key continuity; or (b) keyless rows are not atom-DID-stable across re-acquire (always retire+mint); or (c) keyless absences are not parcel-node rows at all until an account key exists. Pick one in a short decision; amend C3 table accordingly.
2. **Implement orphan retirement in the statewide writer** before any re-acquire of a county that has jurisdiction atoms: flip `status: "retired"`, `retiredAt`, reason; fail closed if `count(active not in plan) != 0`. Wire `flipPropertyAtomRetired` (or equivalent) into `write-parcel-node-county.mjs` after plan build — today that file has no retire path.
3. **Succession matcher decision** (draft Gap 1) before inventing `supersedes` rows for splits/merges without prop_id continuity. Until then: retire without successor only (draft already says this — enforce it).
4. **Define and persist a real geometry-binding stamp on jurisdiction atoms** (vintage + content identity that changes when the resolvable ring changes). Do not overload `parcelNodeContentHash` as that stamp without adding a store-side geometry fingerprint (e.g. hash of WKB / normalized ring) into the parcel-node claim.
5. **C1.1 rewrite:** require `geometryLoaded: true` AND zero multi-feature fold (surface `additionalFeatureIndexes` on the atom or decline multi-feature as `geometry-incomplete`) AND a keyKind-aware resolve (prop_id column vs geo_id column) AND `status !== retired`.
6. **Ship the warm preflight** with decline codes `no-parcel-node-anchor` / `parcel-node-key-unresolved` in the real batch entry (`depth-warm-*-batch.mjs` / shared module), with a unit test that zoning-fact alone cannot promote. Until then C1/C5 are policy fiction.
7. **Membership reconciliation rule:** body `parcelNodeId` authoritative; `applies-to` is a derived index written in the same transaction as the claim — or the reverse. Add a drift probe.
8. **Make coordinate rejection real:** `PARCEL_NODE_SCHEMA.strict()` plus an explicit refine forbidding `coordinates` / `geometry` keys, and a parse-fail test — or stop claiming the schema rejects them.
9. **Serve probe (customer-done):** MCP/retrieval must not return jurisdiction chain slots whose subject parcel-node is retired or vintage-mismatched. PR-green on writer tests is not the grade (canon preamble).

---

## Instrument note (Geometry Law rule 5)

This review did not run the writer's own tests as exoneration. Findings are from reading planner/CLI/resolver/schema sources and the prior adversarial REJECT list. No `DATABASE_URL` was pointed at deployment Postgres; no test suite was executed against a live store.
