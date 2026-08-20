# C12 return — verify the 157 retrieval candidate rows

## Snapshot

- Worker: C12. READ-ONLY. No product-repo edits. No commit.
- Seat: running from the parent planner fan; product read via throwaway worktree, not `P:/hauska-engine` (dirty, detached `8d8e880`).
- **hauska-engine `d3f37949003fae5a99a82b62956352b7dcaa1022`** (2026-08-19, "Merge PR #350 ss/w14-rail-scorer-specs").
- Read tree: `P:/tmp/mp-c12-engine-ro` created `git worktree add --detach` at that commit. `git rev-parse HEAD` = `d3f37949003fae5a99a82b62956352b7dcaa1022`.
- Execution (VERIFIED rows): `tsx` from `P:/hauska-engine/node_modules` importing snapshot modules under `P:/tmp/mp-c12-engine-ro`. Harness: `P:/tmp/mp-c12-violate.mts` and `P:/tmp/mp-c12-violate2.mts`.
- doc_repo hunt was against the live integration tree. The original list is not a doc_repo object.

## Pre-registered ways this output could be wrong

**PR-1.** Treat a reconstructed enumeration as S-25..S-182 and report a survive count as if the 157 had been filed. Check: the original list was found outside the estate (Claude transcript). Survive arithmetic below is sampled-vs-unmeasured, never "157 confirmed". Rows I reconstructed in passing are labelled as such and are not numbered S-25..S-182.

**PR-2.** Assert "no CellMeasurement constructor besides the test helper" or "no workflow passes `--check-registry`" from a grep miss. Check: construction sites were reached by reading the type module, its barrel, sibling package indexes, and the test that imports the barrel. Workflows were enumerated by `git ls-tree -r --name-only` then read in full (both `.github/workflows` files and both `cloudbuild*.yaml` files). A grep that found nothing was not used as the proof.

Both checks were applied before the counts below.

---

## 1. Was the 157 list found?

**Found, and unfiled.** That is the first finding.

It is not in `_inbox`, `_scratch`, `_sessions`, or any doc_repo path matching S-25..S-182. Commit `e6de1eb` ("packages/retrieval returns 158 CANDIDATE rows; W-30 verified and filed") changes one file, `65_t25_admissibility_enumeration.md`, **+40 lines**. It names the range and files W-30. It does not contain the table.

The original table lives only in the Claude Code subagent that produced it:

- session `f6fb1037-ab85-4d20-87c2-e17ff773a9dd`
- agent `aaae06f9fbadca8b4` ("Enumerate packages/retrieval")
- transcript `C:\Users\cente\.claude\projects\p--doc-repo\f6fb1037-ab85-4d20-87c2-e17ff773a9dd\subagents\agent-aaae06f9fbadca8b4.jsonl` (last assistant message, 39,319 chars)
- task output file `...\tasks\aaae06f9fbadca8b4.output` exists and is **empty**
- a working extract was written to `P:/tmp/mp-c12-original-list.md` for this pass (tmp, not estate)

**Second mechanism:** the list was filed under a name that does not contain S-25. Rejected: targeted searches of `_inbox`/`_scratch`/`_sessions` for `S-182`, `158 CANDIDATE`, `CellMeasurement`, and `duplicate-subject/classify` hit only canon's 40-line summary and this dispatch's scratch note.

**Consequence for the 157:** they cannot be verified against a list that never entered the estate. A later reader of doc_repo still cannot cite S-25..S-182. This pass sampled the transcript original, not a silent re-enumeration.

Original numbering: **S-25 through S-182 inclusive = 158 rows**. S-73 and S-74 are the two W-30 sites. Canon treated those two sites as one verified check (W-30) and said 157 remain unread. Arithmetic of "158 minus one check" is 157; arithmetic of "158 minus two sites" is 156 unread others. Both are stated rather than collapsed.

---

## 2. How many survive?

**Zero of the 157 enter the verified 48.** Sampling does not promote them.

Of the transcript original, this pass sampled **71 unique S-ids** (listed in the tables below). None of those 71 is a ghost (wrong file / no such code). **Rejected as nonexistent: 0.**

Corrections among the sampled set, not a second census:

- S-76 Valid=Yes is wrong; it is a default (VERIFIED).
- S-55 / S-56 / S-57 were numbered on `chain-assembly.ts` only; the same predicates also run in live `index.ts:348-374`.
- S-48 deriv=1 (two independent writers) is READ from comments, not VERIFIED at the write path.
- S-75: the type requires `isPedestrianWay: boolean`; the runtime treats it as possibly missing.
- S-85 Valid=Yes is generous: the branch degrades rather than refuses.
- S-101: a `measured: false` cell is `isPublishable: true` because the unmeasured branch pushes no violation.

Unsampled remainder: **87 rows** (158 − 71). That is **unmeasured**, not a survive count and not a reject count. Do not add sampled-confirmed + W-30 and call it canon.

---

## 3. Per-row verdicts (sampled)

Grade is together with the input type except where a default fires before any schema (W-30 / S-73 / S-74 / S-51 / S-76 / S-119 / S-121). Those defaults are downstream of nothing.

### Serving path: `packages/retrieval/src/index.ts` (entire file READ, 672 lines)

HybridRetrieval emits values here. Callees inside this package: `envelope-serve-independent.ts`, `node-detail.ts`, `atom-trace.ts`, `effective-rule.ts`, `edition-at-date.ts` (pass-through, no local predicate, no original row). `chain-assembly.ts` is the sweep's second implementation, not called by `index.ts`.

| id | location | verdict | evidence |
|---|---|---|---|
| S-69 | `index.ts:134-140` `withGuaranteedAtomDid` | **confirmed** READ | `typeof existing === "string" && existing.startsWith("did:")`. Cheapest `"did:"`. Input: `payload.atomDid?: unknown` via cast. |
| S-70 | `index.ts:244` | **confirmed** VERIFIED | `annotated.filter((r) => r.isCurrentEdition !== false)`. Executed `[undefined, true, false].filter(r => r !== false)` keeps undefined and true, drops false. Valid=No, declared fail-open. Deriv 2 as filed (needs currentEditionId). |
| S-71 | `index.ts:262` | **confirmed** READ | `typeof r.editionId === "string" && r.editionId.length > 0`. Cheapest `"0"`. |
| S-72 | `index.ts:285` | **confirmed** READ | `r.editionId === currentEditionId`. Internal consistency (both from this annotation pass). Valid=Yes as equality, not as a second derivation. |
| S-73 | `index.ts:402` | **confirmed** VERIFIED | `accessPolicy: payload.accessPolicy ?? "public-free"`. Executed: omitted and `undefined` both become `"public-free"`; `"tenant-private"` is preserved. **This is W-30.** Default fires before any schema. Input type: `StoredAtomInstance` union. `CodeAtomInstance.accessPolicy` is **optional** (`instances.ts:108`, `:360`). Property contract fields are required on some members; the union still admits omission, and postgres JSON is untyped at runtime. |
| S-74 | `index.ts:484` | **confirmed** VERIFIED | Same expression on the road chain. Same execution. Docblock at `:666` covers `listJurisdictions` only. |
| S-75 | `index.ts:209` | **confirmed** READ | `typeof body.isPedestrianWay === "boolean"` then return. Cheapest `false`. Input: `RoadNodeAtomInstance.isPedestrianWay: boolean` (`road-instances.ts:118`) is required on the type; the runtime guard exists because stored rows may predate the flag (`:201-203`). Type and check disagree: the type says always present, the check treats absence as derivable from `osmHighwayTag`. |
| S-76 | `index.ts:515-518` | **corrected** VERIFIED | Filed Valid=Yes. It is a default, not a holding check. Executed: `undefined`/`NaN`/`Infinity` → `400`; `0` → `1`. T-25 Valid=Yes means refuse, not clamp. Valid=No, state 4, self-authored. |
| S-77 | `index.ts:576` | **confirmed** READ | `if (!result.countyHasNodes)` returns honest-empty. Did not read `StoragePort` result type this pass (provisional on whether `countyHasNodes` can be omitted). |

Live path also inlines the S-55/S-56/S-57 predicates at `index.ts:348-374` (zoning adapter substring, `sourceCodeAtomRef.atomDid` stringness). Original numbered those on `chain-assembly.ts` only. **Corrected location:** they run on the live emitter too.

### Serving path: `envelope-serve-independent.ts` (entire file READ, 60 lines)

| id | verdict | evidence |
|---|---|---|
| S-63 | **confirmed** VERIFIED | `entityType === "buildable-envelope"`. `{entityType:"zoning-fact"}` → `false`. |
| S-64 | **confirmed** VERIFIED | `depthWarmPromotion === "depth-warm-promoted-v1"` → `true`. |
| S-65 | **confirmed** VERIFIED | `absence.kind` any non-empty trimmed string. `{kind:"x"}` → `true`. Input: optional string, not an enum. |
| S-66 | **confirmed** READ | `warmVerifyDecline` same presence shape. |
| S-67 | **confirmed** READ | `warmVerifyDeclineCode` same. |
| S-68 | **confirmed** VERIFIED | `sourceCitation.toLowerCase().includes("depth-warm-verify-decline")` → `true` on `"see depth-warm-verify-decline-xyz"`. |

Four independent one-string doors. Filed remark stands. Second mechanism: a real decline always sets one of these. Rejected: `"x"` and a citation substring are enough, and nothing in this function asks whether a decline was actually written.

### Serving path: `node-detail.ts` (functions READ in full)

| id | verdict | evidence |
|---|---|---|
| S-78 | **confirmed** READ; regex VERIFIED in isolation | `PARCEL_NODE_ID_RE = /^\d{5}:[A-Za-z0-9._-]+$/`. `"00000:0"` matches. Function itself not executed (`@hauska-engine/atoms` unresolved in the harness). |
| S-79 | **confirmed** READ; regex VERIFIED | `"00000:0:boundary:0"` parses to fips `00000`, prop `0`, edgeIndex `0`. |
| S-80 | **confirmed** READ | `:277-280` `edges.find(boundaryEdgeId) ?? edges.find(edgeIndex) ?? null`. A requested id can resolve to a different atom by numeric index. Input: `edgeIndex` is `Number(m[3])` from the id, so the fallback is the same number the id already named; it still binds a *different row* when ids diverge and indexes collide. |
| S-81 | **confirmed** READ | `isBoundaryEdgeAtomInstance` then fail closed. |
| S-82 | **confirmed** READ | `hasAny = propertyRows.length > 0 \|\| boundaryEdges.length > 0` drives `resolution_status:"resolved"` / `status:"active"`. Whole `buildParcelNodeDetail` read through the return at `:254`. |

### Serving path: `atom-trace.ts` and `effective-rule.ts` (functions READ in full)

| id | verdict | evidence |
|---|---|---|
| S-83 / S-84 | **confirmed** READ | `asCodeAtom` / `getAtomTrace`: if not property and not road, `return stored as CodeAtomInstance`. Negative narrowing then a cast. Boundary-edge or workspace atoms would pass. |
| S-85 | **confirmed** READ | `if (!resolved.ok)` still returns a summary, does not throw. Filed Valid=Yes is generous (it degrades, it does not refuse). Left as confirmed on the predicate's existence. |
| S-86 | **confirmed** READ | `xref.entityType === "code-cross-reference"`. |
| S-87 | **confirmed** READ | `baseTextGoverns: input.baseSection !== null`. Any non-null section. |
| S-88 | **confirmed** READ | overlayOperation `replace` or `delete`. |
| S-89 | **confirmed** READ | conjunction of non-null base, no replace/delete, resolution !== `"added"`. |

### State-1 rows (derivation state 1)

| id | verdict | evidence |
|---|---|---|
| S-28 | **confirmed** VERIFIED | `hasStreetSegment("0,") === true`. Input `unknown`; cheapest is any string whose first comma-segment has an alphanumeric. |
| S-30 | **confirmed** VERIFIED | same function on served situs. `"0,"` counted present. |
| S-31 | **confirmed** VERIFIED | `", ,"` and `", TX 78754"` fail street-segment, take the non-empty branch. `hasStreetSegment(", ,") === false`. |
| S-32 | **confirmed** READ | contradiction pushes when cad has street-segment and served does not. Cad side uses the same `hasStreetSegment`. |
| S-34 | **confirmed** READ | `str(rec(base.landUse)?.code)` ; `str(",")` is `","` because trim of `","` is still `","`. |
| S-38 | **confirmed** READ | `cov.zoning === true && district` with `district` from `str(...)`. Cheapest `{zoning:{district:","}}` plus coverage flag. |
| S-46 | **confirmed** READ | `servedFloodStatus && servedFloodStatus !== "unavailable"` after `str()`. `","` is a present flood. |
| S-47 | **confirmed** READ | `storeFloodStatus \|\| factFloodZone` after `str()`. |
| S-48 | **confirmed** VERIFIED | `storeFloodZone && factFloodZone && toUpperCase inequality`. AE vs X → `flood-zone-disagreement`. AE vs AE → no disagreement. AE vs absent fact → no disagreement. Input both `Record<string, unknown>` via `str()`. Two independent stores is a comment in the file (`:283-287`); write-path independence was not re-verified here. Second mechanism: one adapter writing both fields. Rejected for the *predicate* (it compares two inputs). Not rejected for the *deriv=1 claim* (that needs the writers). Deriv=1 remains a claim about adapters, READ not VERIFIED. |
| S-93 | **confirmed** VERIFIED | `insideDeterminationCeiling: false` while FIPS in set → verdict `out-of-reach`, violation `"IS in the ... set"`, `publishable: false`. Neighbouring FIPS not in set → same verdict, empty violations, `publishable: true`. Two ways. |
| S-94 | **confirmed** VERIFIED | `insideDeterminationCeiling: true` while FIPS not in set → still `satisfied-present` at 95%, violation `"is NOT in the ... set"`, `publishable: false`. The percentage is computed; only `isPublishable` refuses. Input: `insideDeterminationCeiling` is a caller boolean, same class as `measured`. The set is the second derivation. |
| S-109 | **confirmed** VERIFIED | `servedPresentParcels === 0` after the null gate → `written-unserved`. Nulls → `not-measured` (S-108, also VERIFIED). Input: `number \| null`. The null gate is the type doing the work; `=== 0` then treats a measured zero as empty-slot. |
| S-113 | **confirmed** VERIFIED | empty `slotPaths` + chain has `building-footprint` → `"on-wire-not-served"`. Empty chain → `"no-slot-in-payload"`. `wireProbeUnavailable: true` hides on-wire (returns no-slot). Two failure modes. |
| S-116 | **confirmed** READ | `va == null \|\| vb == null` after `normalizeValue`. |
| S-117 | **confirmed** READ | `va === vb` on normalised strings. |
| S-118 | **confirmed** READ | `a.edition == null \|\| b.edition == null` refuses `edition-differs`. |
| S-119 | **confirmed** VERIFIED | `(groundTruth.samplePointDistanceM ?? 0) > 0`. `null` does **not** take `explained-by-sampling-point`. Input: `samplePointDistanceM: number \| null` (`types.ts:162`). Default fires before the predicate. Exception case: schema is irrelevant to the default. |
| S-120 | **confirmed** READ | both values in `entityZoneSet`. |
| S-121 | **confirmed** VERIFIED | `(groundTruth.samplePointDistanceM ?? 0) === 0`. `null` and `0` both classify `edition-differs` with basis `"same sample point; ..."`. `366` classifies `explained-by-sampling-point`. Unmeasured and measured-zero are one value. |
| S-122 | **confirmed** READ | truth matches exactly one side. |
| S-124 / S-125 / S-126 | **confirmed** READ | registry vs derived keys; `clean` is both empty. Not executed (needs live stores). |
| S-127 | **confirmed** VERIFIED by reading the control + every CI file | `checkRegistry` defaults `false` (`parseArgs` `:124`). Exit 1 only `if (checkRegistry && !report.registryDivergence.clean)` `:347-349`. See structural remark 2. |
| S-128 / S-131 / S-132 | **confirmed** READ | not executed (SQL / live). Predicates match the filed text. |
| S-142 | **confirmed** READ | SQL `btrim(split_part(body->>'situsAddress', ',', 1)) ~ '[A-Za-z0-9]'` at `serving-sweep.mjs:177`. Twin of S-28. `"0,"` satisfies. |
| S-145 | **confirmed** READ | `if (!t1Payload && parcelAtoms.length === 0) acc.addUnresolvable()` `:276-279`. Routes out of band from field tallies (`tally.ts:108-112`). |
| S-156 | **confirmed** READ | `zf.district.trim().length > 0` after a string check. `","` is a district. |
| S-162 | **confirmed** READ | `bakedBase.landUse.code.trim()` at `atom-chain-to-facets.ts:359-364`. `","` is a code. |
| S-166 | **confirmed** READ | `typeof bf.situsAddress === "string" && bf.situsAddress.trim()` at `baked-facets.ts:285`. `", ,"` trims to `", ,"` and is present. Matches the project-sheet comment at `:10-16`. |

### Other Valid=Yes / structural samples

| id | verdict | evidence |
|---|---|---|
| S-51 | **confirmed** READ | `chain-assembly.ts:78` `(inst.status ?? "active") !== "active"`. Omission = active. Input `AtomLike.status?: string`. Default before compare. **Not on the live `index.ts` path** (storage is assumed to have filtered). |
| S-92 | **confirmed** VERIFIED | `if (!measurement.measured)` is the only unmeasured gate. See structural remark 1. |
| S-97 | **confirmed** READ | `denominator === 0` returns `not-measured` / `coveragePct: null`. |
| S-101 | **confirmed** VERIFIED | `isPublishable` is `guardViolations.length === 0`. A `measured: false` cell has empty violations and is **publishable: true**. Cheapest satisfier is any score with an empty array, including not-measured. |
| S-104 | **confirmed** VERIFIED | `railCeilingCounties` is `number \| null`. Executed: writtenAtoms 0, ceiling 253, written 252, total 254 → `out-of-reach` from a **count**. Contradicts `score-cell.ts:47-53` which says a count cannot classify a cell. Deriv 2 as filed. |
| S-108 | **confirmed** VERIFIED | null served counts → `not-measured`. |
| S-110 | **confirmed** VERIFIED | `keyPathsOf({situsAddress:", ,"})` → `hasValue: true`. `""` → `false`. `{flood:{}}` → `hasValue: true`. |
| S-123 | **confirmed** READ | `d === 0 ? 0 : ...` in `tallyPair`. An undefined rate publishes as 0. |
| S-140 | **confirmed** READ | `Number.isFinite(featureCount) ? featureCount : 1` at `serving-sweep.mjs:109`. Unmeasured feature count becomes 1. |
| S-141 / S-148 | **confirmed** READ | null source omitted, not zeroed. |
| S-143 | **confirmed** READ | `body.parcelNodeId` absent → bucket under `r.entity_id`, body unmodified. |

No sampled row was rejected as "code not there". The cheap errors in this set are Valid grades and one location split (S-55 family also live in `index.ts`).

---

## 4. Structural remark 1 — `CellMeasurement.measured`

**Confirmed. VERIFIED by violation.**

Type (READ, entire `rail-scoring-spec/types.ts`):

```196:215:P:/tmp/mp-c12-engine-ro/packages/retrieval/src/rail-scoring-spec/types.ts
export interface CellMeasurement {
  countyFips: string;
  railKey: UnscoredRailKey;
  covered: number;
  establishedAbsent: number;
  denominator: number;
  orphanDeterminations: number;
  insideDeterminationCeiling: boolean;
  /** False where the scorer did not run for this cell. Never inferred. */
  measured: boolean;
}
```

`"Never inferred"` is a comment. The type is a flat interface of numbers plus two booleans. There is no discriminated union `{measured:false} | {measured:true, ...}`. `orphanDeterminations: number` cannot express uncounted (S-96). `insideDeterminationCeiling: boolean` is the same caller-asserted shape as `measured`.

Construction sites, by following the type module (not by grepping the repo to prove absence):

1. `types.ts` — definition only.
2. `specs.ts` — imports `RailScoringSpec` / `UnscoredRailKey`, not `CellMeasurement`.
3. `score-cell.ts` — type-only import; **consumes**, does not construct.
4. `rail-scoring-spec/index.ts` — re-exports the type and `scoreCell`.
5. Sibling barrels READ (`serving-sweep/index.ts`, `statewide-audit/index.ts`, `duplicate-subject/index.ts`, `packages/retrieval/src/index.ts`) — **none import** `rail-scoring-spec`.
6. Package `exports` is only `"."` → `src/index.ts`. `CellMeasurement` is not on the published HybridRetrieval surface.
7. `rail-scoring-spec/__tests__/rail-scoring-spec.test.ts` — the `cell()` helper **constructs** with `measured: true` by default (`:52-64`).

I did not walk `services/` or other packages. I am not asserting "no other constructors in hauska-engine". I am asserting: inside `packages/retrieval`, after reading the type's module graph, the only constructor found is the test helper, and it defaults `measured: true`.

Guard (`score-cell.ts:128-138`, whole function READ through `:243`):

```
if (!measurement.measured) {
  return { verdict: "not-measured", coveragePct: null, ... };
}
```

**Violation, executed against the snapshot module:**

| input | verdict | coveragePct | guardViolations | isPublishable |
|---|---|---|---|---|
| `measured: true`, covered 0, absent 0, den 100 (invented zeros) | `not-yet` | **0** | `[]` | **true** |
| `measured: false`, same numbers | `not-measured` | `null` | `[]` | true |
| `measured: true`, covered 95, den 100 (fabricated coverage) | `satisfied-present` | **95** | `[]` | **true** |

The guard *can* fire (`measured: false`). It cannot tell a lie (`measured: true` on an unrun cell). No check fails. A 0% and a 95% both publish.

**Second mechanism:** a production scorer derives `measured` from `measuredAt` / a run log, so the boolean is not caller-asserted in practice. Rejected: the type has no such field; `scoreCell` reads only the boolean; the only constructor found hardcodes `true`.

---

## 5. Structural remark 2 — exit-1 divergence control, opt-in, no workflow

**Confirmed.**

Control (READ): `packages/retrieval/scripts/duplicate-subject-detector.mjs`

- `parseArgs` initialises `checkRegistry: false` (`:124`).
- Flag is `--check-registry` (`:135`).
- Exit: `if (checkRegistry && !report.registryDivergence.clean) { process.exitCode = 1 }` (`:347-349`).
- Without the flag the runner still writes `inventory.json` and prints the divergence, exit 0.

CI files at `d3f3794`, enumerated by `git ls-tree -r --name-only` then **read in full** (not grepped for absence):

| file | what it runs |
|---|---|
| `.github/workflows/ci.yml` | pnpm install, python workers, `pnpm typecheck`, two hardcoded `rg`/`grep` gates, `pnpm test`. No retrieval script. |
| `.github/workflows/block13-cert-grade.yml` | two `packages/engine-core` vitest files. |
| `cloudbuild.engine-api.yaml` | docker build of `services/engine-api`. |
| `cloudbuild.property-atom-bake.yaml` | `pnpm --filter @hauska-engine/engine-core run bake-property-atom-county`. |

None pass `--check-registry`. None invoke `duplicate-subject-detector.mjs`.

`packages/retrieval/package.json` scripts: `serving-sweep` only, besides build/typecheck/test.

A grep that found `--check-registry` in a workflow would have disproved this. Directory listing plus full reads is what supports absence.

**Second mechanism:** a Cloud Scheduler / operator cron outside this repo. Not rejected as a possibility. Rejected as a claim that *this snapshot's workflow files* invoke it: they do not. Armed status of the *vitest* suite (`pnpm test` in `ci.yml:99`) is a different control and is live, as the original R-6 said.

Three-question gate: (1) manual node invocation with `--check-registry`; (2) nothing in CI/cloudbuild; (3) `process.exitCode = 1` only for whoever ran it; (4) omit the flag.

---

## 6. Dispatch predictions, verified at source

**`tally.ts` sentinel defaults: FALSE. READ entire file (215 lines).**

`emptyTally()` zeros at `:49` are exhaustive-sweep bucket zeros. `?? 0` at `:116`, `:127`, `:138`, `:176-177` are lazy map initialisers whose keys exist only once observed. `addUnresolvable` (`:108-112`) never enters a field tally. No predicate admits or refuses a value. Zero validity-check rows, as the original claimed.

**Second mechanism:** `ContradictionTally.count` of 0 is a starved detector. Not closed here: `detectors-fire.test.ts` was not opened (original also left it unread). Bounded the same way.

**`?? 0` collapse in `duplicate-subject/classify.ts`: TRUE. VERIFIED.**

`GroundTruthReading.samplePointDistanceM: number | null` (`types.ts:162`). Both call sites throw the null away:

- `:205` `(groundTruth.samplePointDistanceM ?? 0) > 0`
- `:232` `(groundTruth.samplePointDistanceM ?? 0) === 0`

Executed: `null` and `0` produce identical `edition-differs` / `"same sample point"` output. `366` produces `explained-by-sampling-point`. Absent, zero, and unmeasured are collapsed.

`tallyPair` `:313` `(d === 0 ? 0 : ...)` is a second collapse (rate).

---

## 7. What could not be verified

- The 106 unsampled original rows. Unmeasured, not rejected.
- Whether `@empressaio/atom-contract` property schemas require `accessPolicy` at the write site (throwaway tree has no `node_modules`; W-30 still holds because the read site defaults and the engine union types it optional on code atoms).
- Whether live `listPropertyAtomsByParcelNodeId` rows actually omit `accessPolicy` (store not queried this pass).
- Production `CellMeasurement` constructors outside `packages/retrieval`.
- `classifyPropertyNodeId` / `parseBoundaryEdgeId` as functions (atoms package unresolved in the harness). Regexes were executed.
- S-124..S-132, S-128 against live stores.
- S-48's claim that the two flood writers are independent (predicate VERIFIED; independence READ from comments).
- `detectors-fire.test.ts` (whether all five contradiction kinds actually fire).
- `edition-at-date.ts` body in `@hauska-engine/corpus` (local file is a one-line re-export; original correctly filed no row).
- Cron / operator invocations of `--check-registry` outside this repo.

---

## 8. Files and commands

READ (snapshot worktree): `packages/retrieval/src/index.ts` (full), `envelope-serve-independent.ts` (full), `node-detail.ts` (full through parcel and boundary builders), `atom-trace.ts` (full), `effective-rule.ts` (compose function), `edition-at-date.ts` (full), `rail-scoring-spec/{types,score-cell,index}.ts` (full), `specs.ts` header, `rail-scoring-spec.test.ts` (full), `statewide-audit/{index,classify,rail-served}.ts`, `duplicate-subject/{index,types,classify}.ts`, `serving-sweep/{index,tally,project-sheet,chain-assembly}.ts`, `vendor/baked-facets.ts` situs block, `vendor/atom-chain-to-facets.ts` land-use block, `scripts/{serving-sweep,duplicate-subject-detector}.mjs` (args + situs SQL + unresolvable + registry exit), `.github/workflows/{ci,block13-cert-grade}.yml` (full), `cloudbuild.{engine-api,property-atom-bake}.yaml` (full), `packages/retrieval/package.json`, `packages/atoms/src/{property-instances,instances,road-instances}.ts` (accessPolicy types).

VERIFIED by execution: `scoreCell` / `isPublishable`, `classifyEntity`, `projectSheet` flood disagreement, `hasStreetSegment` / `isLegibleText`, `keyPathsOf`, `classifyCell`, `railServedState`, `envelopeServeIndependentOfStaleSetback`, accessPolicy `??`, limit clamp, edition filter.

leave_behind: throwaway worktree `P:/tmp/mp-c12-engine-ro`; extracts `P:/tmp/mp-c12-original-list.md`, `P:/tmp/mp-c12-violate.mts`, `P:/tmp/mp-c12-violate2.mts`. Owner: planner. Plan row: this C12 fan.
