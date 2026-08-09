---
id: 2026-08-08_PROBE_770_refusal_join
title: PROBE — 770 computePassNotPersisted refusal band, parcel-level join attempt
date: 2026-08-08
status: active
owner: nick
related: [2026-08-08_T1_dry_apply_reconciliation, 2026-08-07_T1_bastrop_cohort_apply_ABORT]
---

# PROBE — the 770 refusal band

Read-only diagnostic. No DB writes, no applies, no branch changes. Engine read at `dba7a82` (`Merge pull request #277 from empressaioemail-tech/fix/warden-situs-address-column`), working tree carries only untracked `_*.mjs` scratch files.

## Headline verdict

**The leading hypothesis is WRONG.** The refusal band is not network-dependent and does not originate in the live BCAD ArcGIS call. It is a **deterministic code-path divergence**: the apply leg loads the stored boundary primitive from the database and the dry leg does not, so the two legs compute the envelope through **two different functions** from **two different data sources**. The dry leg's 2438 `verifyPass` was never a measurement of what the apply leg would do.

The four runs are not merely "nearly identical" in accounting. They are **byte-identical** in every uncapped per-parcel diagnostic emitted, down to the floating-point digit. That is not what a rate-limited external endpoint produces.

---

## Q1 — Are the same parcels refused in both runs?

**VERDICT: Cannot be answered by parcel-ID join. The rosters do not exist. This is itself a critical finding.**

I attempted the join and it is not performable. The batch script emits only capped samples, never a refused-cohort roster:

`packages/engine-core/scripts/depth-warm-bastrop-batch.mjs`
- line 826 / 845 / 868 — `if (sampleOutcomes.length < 8)` / `< 5` / `< 8`
- line 865 — `if (args.diagnoseFailures && failureSamples.length < 30)`

Parsed structure of all four logs (they are **UTF-16LE with BOM**, not UTF-8 — decoded via `iconv -f UTF-16LE`):

```
top-level keys: ['event','countyFips','dryRun','cohort','roadsLoaded','outcomes',
                 'parcelRingSourceDivergences','cost','sampleOutcomes','failureSamples','wdll9Note']
  LIST sampleOutcomes len 8
  LIST failureSamples len 30
  LIST parcelRingSourceDivergences len 201
```

8 + 30 entries against a 770-parcel refused cohort. **There is no per-parcel list of the 770 anywhere in the artifacts.** The `_inbox` set was swept; no companion roster file exists.

### But the determinism question IS answerable, by a different instrument

`parcelRingSourceDivergences` is the one **uncapped** per-parcel list in the log (initialized `[]` at line 475, pushed unconditionally at line 674, emitted whole at line 937). It records one entry per parcel where a **live BCAD fetch** returned a ring diverging >2ft from txgio. It is therefore simultaneously a determinism probe and a direct log of BCAD fetch success.

Cross-run comparison of the divergence parcel-ID sets:

```
2026-08-08_T1_bastrop_recovery_apply  n= 201
2026-08-08_T1_bastrop_recovery_dryrun n= 201
2026-08-07_T1_bastrop_cohort_apply    n= 201
2026-08-07_T1_bastrop_cohort_dryrun   n= 200

apply08 vs dry08: same ids? True
  only in apply08: []
  only in dry08  : []
  deviation value diffs: [('48021:47600', 163.69, 29.44)] count 1

apply07 vs apply08 same ids? True
dry07 vs dry08 same ids? False
  only in dry08 vs dry07: ['48021:31587']
```

**201 of 201 parcel IDs identical across both legs and both runs, 70 minutes and one day apart.** If the BCAD endpoint were transiently failing or rate-limiting, these sets would differ — a failed fetch is caught (lines 704, 717 `catch { /* best-effort */ }`) and simply records no divergence entry. They do not differ. **BCAD was reached reliably on every leg.**

The capped `failureSamples` are likewise identical across all four runs, to the last digit:

```
========= 2026-08-08_T1_bastrop_recovery_apply
  48021:0      | superseded-prop-id | ['prop_id 0 absent from county cadastral - superseded; re-key manifest to successor parcel(s)']
  48021:103397 | superseded-prop-id | ['prop_id 103397 absent from county cadastral - superseded; re-key manifest to successor parcel(s)']
  48021:104127 | r32-per-edge-inset | ['edge 5: R32 11.003524942673023ft != expected 5ft for role side']
  48021:104130 | r32-per-edge-inset | ['edge 1: R32 26.19576386357959ft != expected 15ft for role side_corner']
  48021:104226 | front-orientation  | ['fresh labeling produced no front edge']
========= 2026-08-08_T1_bastrop_recovery_dryrun     (identical)
========= 2026-08-07_T1_bastrop_cohort_apply        (identical)
========= 2026-08-07_T1_bastrop_cohort_dryrun       (identical)
```

`11.003524942673023ft` reproducing exactly across four independent runs rules out network nondeterminism in the compute path.

### One real dry-vs-apply parcel join DOES exist

`48021:103281` appears in `sampleOutcomes` on both legs of the 08-08 run — the only genuine per-parcel dry/apply pairing in the artifacts, and it is diagnostic gold:

Dry leg:
```json
{ "parcelNodeId": "48021:103281", "verifyPass": true,
  "buildableAreaSqFt": 49227.33442476832, "insetFeet": [5, 20, 20, 5] }
```

Apply leg:
```json
{ "parcelNodeId": "48021:103281", "verifyPass": false,
  "reasons": ["promote: envelope ground-truth predicate failed for 48021:103281 (p2-inset-distance-mismatch): {\"p1\":{\"pass\":true,\"outsideVertexCount\":0},\"p2Fails\":[{\"edgeIndex\":2,\"role\":\"side_corner\",\"measuredFt\":19.999999998641385,\"expectedFt\":5,\"pass\":false,\"satisfiedByMoreRestrictiveNeighbor\":false},{\"edgeIndex\":3,\"role\":\"front\",\"measuredFt\":4.999999999608277,\"expectedFt\":20,\"pass\":false,\"satisfiedByMoreRestrictiveNeighbor\":false}],\"p3\":{\"pass\":true,\"frontEdgeIndex\":3,\"frontIsStreetAdjacent\":true}}"]
}
```

Read the numbers. Edge 2 measured **20ft** where **5ft** expected; edge 3 measured **5ft** where **20ft** expected. The geometry is *the same geometry* — 5 and 20 are both present and both exact to nine decimals. What differs is **which edge index carries which role**. The apply leg assigned roles `side_corner`/`front` to edges the dry leg had as `front`/`side_corner`. `p1` passes (containment fine, `outsideVertexCount: 0`) and `p3` passes. Only the role-to-edge mapping is transposed.

That is a **role/edge-index misalignment introduced by the stored boundary primitive**, not a bad envelope and not a network artifact.

**Answer to Q1:** the refused set cannot be enumerated from current instrumentation, but every uncapped and capped per-parcel signal available says the pipeline is **deterministic**. The 768-vs-770 delta is a ~0.26% jitter, and the one located dry/apply divergence has a structural cause (below), not a random one. This is a **deterministic data/code condition**, not nondeterminism at persist time.

---

## Q2 — What is `road-classification-mismatch`, and why is it apply-only?

**VERDICT: It is the mechanical road-classification gate firing on `osmHighwayTag` values that exist ONLY on the apply leg, because they are read from the stored boundary-primitive atoms. No re-fetch of roads or BCAD rings is involved. The dry leg cannot emit this bucket by construction.**

### The emitter

`packages/engine-core/src/depth-warm/honest-decline-promote.ts:135-137`
```ts
  if (text.includes("classification") && text.includes("osm")) {
    return "road-classification-mismatch";
  }
```

Bucketing is a substring match over the joined verify reasons. Only one gate produces text with both tokens:

`packages/engine-core/src/depth-warm/verify-mechanical.ts:45-77`
```ts
export function verifyRoadClassificationMatchesSource(
  candidate: WarmCandidate,
): { pass: boolean; reasons: string[] } {
  const reasons: string[] = [];
  for (const edge of candidate.edges) {
    if (
      edge.roadProvenanceKind === "county-roadway-authoritative" ||
      edge.roadProvenanceKind === "county-surveyed-2016"
    )
      continue;
    if (!edge.roadClass || !edge.osmHighwayTag) continue;      // <-- LINE 55
    const fromTag = classifyForVerify(edge.osmHighwayTag, edge.osmSurfaceTag);
    if (fromTag !== edge.roadClass) {
      reasons.push(
        `edge ${edge.index}: classification ${edge.roadClass} != OSM tag ${edge.osmHighwayTag} (${fromTag})`,
      );
    }
  }
```

Wired in at `verify-mechanical.ts:238`: `const roadClassification = verifyRoadClassificationMatchesSource(candidate);`

**Line 55 is the whole answer.** The gate is a no-op unless `edge.osmHighwayTag` is populated on the candidate's edges.

### Why the tag is populated only on apply

`packages/engine-core/scripts/depth-warm-bastrop-batch.mjs:651-662`
```js
  /** @type {import('@hauska-engine/atoms').BoundaryEdgeAtomInstance[] | null} */
  let boundaryEdges = null;
  if (!dryRun && storageHandle?.storage) {
    try {
      boundaryEdges = await readBoundaryEdgesForParcel(
        storageHandle.storage,
        parcelNodeId,
      );
    } catch (err) {
      if (!(err instanceof BoundaryPrimitiveMissingError)) throw err;
    }
  }
```

`boundaryEdges` is **hard-gated on `!dryRun`**. On the dry leg it is permanently `null`.

That flag then selects the entire compute function — `packages/engine-core/src/depth-warm/warm-compute.ts:176-190`:
```js
export function computeWarmCandidate(input: WarmComputeInput): WarmCandidate {
  if (input.boundaryEdges && input.boundaryEdges.length > 0) {
    return computeWarmCandidateFromBoundary({ ... });    // APPLY leg
  }
  const full = computeWarmCandidateWithLabels(input, input.edgeLabels);   // DRY leg
  ...
```

And the apply-only branch is the one that stamps the tag — `packages/engine-core/src/boundary-primitive/consume.ts:82-102`:
```js
  const edges: WarmEdgeInfo[] = sorted.map((atom) => {
    ...
    return {
      index: atom.edgeIndex,
      label: atom.role,                                 // role FROM STORAGE
      roadClass: atom.facingRoad?.classification,        // class FROM STORAGE
      osmHighwayTag: atom.facingRoad?.osmHighwayTag,     // tag FROM STORAGE  <-- line 99
      insetFeet,
    };
  });
```

Chain, end to end:

```
dry leg  -> boundaryEdges = null (batch:653)
         -> computeWarmCandidateWithLabels (warm-compute:189, from live labelEdgesFromRoads)
         -> edge.osmHighwayTag absent -> verify-mechanical:55 `continue` -> gate no-ops
         -> road-classification-mismatch IMPOSSIBLE. Count: 0. Bucket absent from JSON entirely.

apply leg -> boundaryEdges = readBoundaryEdgesForParcel(...) (batch:655)
          -> computeWarmCandidateFromBoundary (warm-compute:178)
          -> edge.osmHighwayTag = atom.facingRoad.osmHighwayTag (consume:99)
          -> gate ACTIVE, compares stored classification vs stored tag
          -> road-classification-mismatch = 472
```

**Explicitly answering the hypothesis:** there is no re-fetch of roads at persist time. `roads` is loaded once per run (`roadsLoaded: 13987`, identical in all four logs) and passed identically to both legs. There *are* live BCAD calls at `batch:702` and `batch:715`, but both sit inside `try/catch` blocks whose comments state `divergence report is best-effort; construction never depends on it` — they feed only the report-only `recordParcelRingSourceDivergence`. `batch:532` `assertParcelCurrencyInBcad` runs on **both** legs identically (no `dryRun` guard), which is why `superseded-prop-id` is 84 on both. **None of the three BCAD call sites is dry/apply asymmetric.** The asymmetry is exclusively `batch:653`.

### What the mismatch means

The gate compares two fields that were **both written by a previous promote generation** into the same stored atom: `facingRoad.classification` vs `classifyOsmHighwayTag(facingRoad.osmHighwayTag)`. 472 stored boundary-edge atoms hold a classification that no longer re-derives from their own recorded OSM tag. This is **stale/incoherent stored primitive state** — either written under an older `classifyOsmHighwayTag` ruleset, or written with a mismatched road match. It is a genuine data defect the gate is correctly catching; it is not an apply-time computation error. But it is invisible to the dry leg, which is why the dry leg's 2438 overpredicts.

---

## Q3 — What are the 369 `declines.other`?

**VERDICT: They are promote-path throws. Both `EnvelopeGroundTruthPromoteDeclineError` and `EnvelopeWriteThenVerifyMismatchError` collapse into this one counter, along with every other exception. They CANNOT be distinguished from the summary JSON — but the log's sampleOutcomes prove at least the pre-write ground-truth variant is firing, and the evidence points to that being the dominant or sole contributor.**

### The collapse site

`packages/engine-core/scripts/depth-warm-bastrop-batch.mjs:802-834`
```js
  let result;
  try {
    result = await warmThenVerify({ ... });
  } catch (err) {
    stats.declines.other++;                     // <-- LINE 823, everything lands here
    stats.processed++;
    stats.wallMsPerParcel.push(Math.round(performance.now() - parcelT0));
    if (sampleOutcomes.length < 8) {
      sampleOutcomes.push({
        parcelNodeId,
        verifyPass: false,
        reasons: [String(err?.message ?? err)].slice(0, 3),
      });
    }
    continue;
  }
```

A bare `catch (err)` incrementing a single `other` counter. No `instanceof` discrimination, no per-type counter. Note also that this bucket **does not** get a `promoteHonestVerifyDecline` write (unlike the verifyFail path at line 876) — these 369 parcels are left with whatever was previously in the store.

### The two throw types

`packages/engine-core/src/depth-warm/promote.ts:290-297` — **pre-write** gate:
```ts
    if (!groundTruth.pass) {
      throw new EnvelopeGroundTruthPromoteDeclineError(
        input.candidate.parcelNodeId,
        groundTruth.failureReason,
        JSON.stringify({ p1: groundTruth.p1, p2Fails: ..., p3: groundTruth.p3 }),
      );
    }
```

`promote.ts:353-359` and `promote.ts:370-388` — **post-write** read-back gate, which retires the just-written atom before throwing:
```ts
      if (!readBackGroundTruth.pass) {
        // Fail-closed: retire the atom just written rather than leave a
        // predicate-rejected ring active and servable.
        const retired = { ...readBack, status: "retired" as const };
        await writePropertyAtomIfEnabled(storage, retired);
        throw new EnvelopeWriteThenVerifyMismatchError(...)
```

### Can they be distinguished from existing artifacts? Partially — and the answer is informative

The counters cannot distinguish them. But the **message prefixes** differ and `sampleOutcomes` captures `err.message`. All three throwing samples in the 08-08 apply log carry the pre-write prefix:

```
"promote: envelope ground-truth predicate failed for 48021:103281 (p2-inset-distance-mismatch)"
"promote: envelope ground-truth predicate failed for 48021:104124 (p2-inset-distance-mismatch)"
"promote: envelope ground-truth predicate failed for 48021:104128 (p2-inset-distance-mismatch)"
```

Zero samples carry the write-then-verify prefix (`promote: write-then-verify mismatch for ...`). Three of three is a small sample and cannot prove the 369 are homogeneous, but it is the only direct evidence available and it points one way.

**This matters for the disposition question you raised.** A write-then-verify mismatch would indicate a serializer/storage defect — bytes going in differently than they come out — and would be "arguably correct refusal" masking a real bug. A **pre-write** `EnvelopeGroundTruthPromoteDeclineError` with `p2-inset-distance-mismatch` is different: it means the in-memory candidate was already wrong before any write. And per the 48021:103281 join above, the specific failure mode is **role/edge transposition** — the same 5ft and 20ft values landing on swapped edge indices. That is the **same root cause as Q2**: the stored boundary primitive is supplying role-to-edge assignments that disagree with fresh labeling.

Note the batch script has extensive machinery acknowledging exactly this hazard — the R28 winding gate at `batch:743-760` and the R30 re-label at `batch:770-781` — but both are conditioned on `args.forceRepromote || ringSwapped`. On a plain `--force-overwrite` run (which is what both these runs used: `"--city-cohort" "--force-overwrite" "--promote" "--limit=10000" "--diagnose-failures" "--upsert-ledger"`), `args.forceRepromote` is false, so stored edges are consumed with their stored roles **unless** the ring happened to be swapped. That is the mechanism by which stale stored roles reach the ground-truth predicate.

**Answer to Q3:** 369 = promote throws, indistinguishable by counter, but sampled evidence is 3/3 pre-write `EnvelopeGroundTruthPromoteDeclineError` with `p2-inset-distance-mismatch`, consistent with stored-primitive role misalignment rather than a storage-layer defect.

---

## Q4 — What are the 84 `superseded-prop-id` declines?

**VERDICT: Real data conditions, NOT transient BCAD misses. Proven by exact reproduction across all four runs, and at least one is a structurally invalid ID that never touches the network at all.**

The count is **84 on every single leg** — both dry runs, both applies:

```
2026-08-08 apply : "superseded-prop-id": 84
2026-08-08 dryrun: "superseded-prop-id": 84
2026-08-07 apply : "superseded-prop-id": 84
2026-08-07 dryrun: "superseded-prop-id": 84
```

A transient/rate-limited endpoint cannot produce 84 four times running. Any BCAD miss converts directly into a `superseded-prop-id` decline (`parcel-currency.ts:43-49`, `if (!hit?.ring?.length)`), so flakiness would move this number. It never moves.

Corroborating: `assertParcelCurrencyInBcad` at `batch:532` is **ungated by `dryRun`** — it runs identically on all four legs, and all four agree. And the 201-entry divergence roster proves BCAD returned good rings for at least 201 parcels per leg with identical results.

One of the two sampled declines is definitively **not** a network event:

```
48021:0 | superseded-prop-id | ['prop_id 0 absent from county cadastral - superseded; re-key manifest to successor parcel(s)']
```

`prop_id 0` is a malformed roster entry. Per `packages/engine-core/src/boundary-primitive/parcel-currency.ts:29-37`, a falsy id short-circuits before `fetchBcadParcelRings` is ever called:
```ts
  const id = String(propId).trim();
  if (!id) {
    return { ok: false, propId: id, code: "superseded-prop-id",
      reason: "empty prop_id" };
  }
```
(`"0"` is truthy as a string so it does reach the fetch, but it is plainly a bad roster key, not a real parcel.)

The second sample, `48021:103397`, reproduces identically on all four legs — consistent with a genuine re-plat/split as the reason text asserts.

**Answer to Q4:** 84 is a stable, deterministic cohort of dead/re-platted/malformed prop_ids. It is *not* part of the 770 mystery at all — these decline identically on the dry leg, so they are already excluded from the 2438 baseline. They warrant a roster-hygiene pass (starting with `48021:0`), not a BCAD investigation.

---

## Reconciling the arithmetic

The 770 is not one phenomenon. Against the dry baseline of 2438:

| Mechanism | Counter movement | Cause |
|---|---|---|
| `road-classification-mismatch` | 0 → **472** | Gate inert on dry (`verify-mechanical:55`); active on apply via stored `osmHighwayTag` (`consume:99`) |
| `declines.other` (promote throws) | 0 → **369** | `batch:823`; pre-write ground-truth predicate, role transposition |
| `front-orientation` | 437 → **569** | +132, stored roles vs fresh labeling |
| `no-road-adjacency` | 116 → **14** | −102, stored primitive supplies adjacency the dry leg had to derive |
| `front-orientation-unresolved` | 61 → **8** | −53, same cause |
| `r32-per-edge-inset` | 287 → **251** | −36 |
| `faces-answer` | 196 → **179** | −17 |
| `null-inset` | 219 → **224** | +5 |
| `no-setback-row` | 1947 → 1947 | unchanged (pre-primitive early decline) |
| `superseded-prop-id` | 84 → 84 | unchanged (pre-primitive, BCAD, deterministic) |

Every single bucket that moves is downstream of `batch:653`. Every bucket upstream of it is frozen. The counters shift in **both directions**, which is the signature of a different-computation, not a degraded-computation: the stored primitive fixes some parcels (road adjacency, orientation resolution) and breaks others (classification coherence, role alignment).

**The dry leg is not a valid predictor of the apply leg, and the "extended parity equation" `2438 == promoted + computePassNotPersisted` is arithmetically true but diagnostically empty** — it is a tautology, since `computePassNotPersisted` is *defined* as the residual. It reconciles by construction regardless of what the pipeline does. It should not be treated as evidence that the contract holds.

---

## WHAT I COULD NOT DETERMINE

1. **The identity of the 770 refused parcels.** No roster exists in any artifact. `sampleOutcomes` caps at 8 (`batch:826/845/868`) and `failureSamples` at 30 (`batch:865`). The parcel-level join the task asked for is **not performable from current instrumentation**. I did not fabricate one. The single genuine dry/apply parcel pairing available is `48021:103281`.

2. **Whether the 768 and 770 sets are literally the same parcels.** Not determinable directly (see #1). All available determinism probes — the uncapped 201-entry divergence roster, the identical 30-entry failure samples, the four-way-stable 84/1947 early declines — say yes. But this is inference from strong proxies, not a set comparison.

3. **The exact split of the 369 `declines.other`** between `EnvelopeGroundTruthPromoteDeclineError` and `EnvelopeWriteThenVerifyMismatchError`. The counter collapses both (`batch:823`). Sampled evidence is 3/3 pre-write, but n=3.

4. **Whether the 472 stored classification mismatches are stale-write or ruleset-drift.** Distinguishing requires querying the stored boundary-edge atoms against current `classifyOsmHighwayTag` — a DB read I was not authorized to perform.

5. **Whether any of the 84 `superseded-prop-id` are true BCAD absences vs roster keying errors.** Only 2 of 84 were sampled. `48021:0` is clearly a roster defect; `48021:103397` is plausibly a real re-plat. The other 82 are unenumerated.

6. **Whether the killed concurrent process on the 08-07 run contributed anything.** The 08-08 single-process run reproduces the 08-07 accounting to within 2 parcels, so its contribution appears negligible — but I cannot rule out that it left stored-primitive state that both subsequent runs then read identically.

7. **The 48021:47600 deviation difference** (163.69ft apply vs 29.44ft dry) — the only value-level divergence in the entire divergence roster. It is on the ring-swap path (`batch:711-724`) and plausibly reflects `boundaryEdges.length !== ringVerts` firing only on apply, but I did not trace it to certainty.

---

## Required instrumentation (to make this diagnosable)

The reconciliation doc already recommends counters. Counters are not enough — **rosters** are what is missing. Minimum emission for the next engine touch:

1. **Uncapped refused-parcel roster.** `computePassNotPersisted[]` as an array of `{parcelNodeId, mechanism, bucket}`, not an integer. Without this, no dry/apply join is ever possible. This is the single highest-value change.
2. **Discriminate the promote catch** at `batch:823`: `stats.promoteGroundTruthRefused++` vs `stats.writeThenVerifyRefused++` vs `stats.promoteUnexpectedError++`, via `instanceof`. Currently a serializer bug and a geometry bug are indistinguishable.
3. **Emit `boundaryPrimitiveConsumed` / `boundaryPrimitiveAbsent` counts.** The dry/apply divergence is entirely explained by this flag and it is not reported at all.
4. **Make the dry leg honest.** Either (a) let dry-run read boundary primitives read-only so the two legs compute identically, or (b) label the dry `verifyPass` as `computeOnlyVerifyPass` and stop using it as an apply target. Option (a) is correct — a dry run that exercises a different code path than the apply it predicts is not a dry run.
5. **Raise or remove the sample caps** under `--diagnose-failures`. A diagnostic flag that caps at 30 rows across 5785 parcels is not diagnostic.

## Recommendation

Do **not** re-run the pair expecting different numbers; it is deterministic and will reproduce. The fix lane is: instrument per #1/#2 above, then determine whether the 472 stored classification mismatches and the role-transposition cohort should be repaired by **re-deriving the stored boundary primitives** (the R30 re-label path at `batch:770-781`, currently gated behind `--force-repromote`) rather than consumed as-is. A `--force-repromote` run would exercise that path — but that is a write operation and out of scope for this probe.
