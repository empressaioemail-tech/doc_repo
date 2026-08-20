## Snapshot

All findings READ from `hauska-engine` at **`d3f37949003fae5a99a82b62956352b7dcaa1022`** (2026-08-19, "Merge PR #350 ss/w14-rail-scorer-specs"), read exclusively via `git show d3f3794:<path>`. The working tree is at `8d8e8803550f6f7fdaae42c59a25c4a2d9acc71c` with 4 modified + 1 untracked file in `packages/engine-core`; it was not read. **Nothing was executed — every row is READ, zero VERIFIED.**

## Pre-registration and how each resolved

**PR-1 — "I will grade predicates in isolation and miss that the input type sets the floor."** *Bit, and catching it produced findings.* `project-sheet.ts:225` reads `typeof env?.buildableAreaSqFt === "number"` off `rec(facets.envelope)`, typed `Record<string, unknown>` — so the value is untyped JSON at runtime and **`NaN` satisfies it**. Its two siblings in the same package (`atom-chain-to-facets.ts:370`, `buildable-display-vocab.ts:74`) both add `Number.isFinite`. Grading the predicate alone would have scored it clean. The exception case also fired: `chain-assembly.ts:78` `(inst.status ?? "active") !== "active"` defaults *before* comparing, so `AtomLike.status?: string` optionality — not the predicate — sets the cheapest satisfier to OMISSION.

**PR-2 — "I will count tally/classifier control flow as validity checks and inflate the row count."** *Bit.* My first pass had rows for `tally.ts:116`/`:127`/`:138` (`?? 0` lazy-init) and `bumpRailTally`. Applying the test *does anything refuse, throw, or fail?* — those only route into a counter. **`serving-sweep/tally.ts` contains zero validity checks and gets zero rows.** I kept classifier branches only where the outcome is a refusal to publish (`scoreCell` guards, `classifyCell`'s `not-measured`, `classifyEntity`'s `vintage-undecidable`).

## The prediction: half false, half true, and in the wrong file

**"Sentinel defaults on serving-sweep field tallies" — FALSE, and the opposite is the case.** `FieldTally` zeros (`tally.ts:49`) are measured zeros: the sweep is exhaustive over the county roster and each parcel contributes exactly one state to exactly one bucket per field. Unmeasurability is carried *out of band* by `parcelsUnresolvable` (`tally.ts:109-112`, explicitly "Never enters a field tally"). `serving-sweep.mjs:133` `if (key == null) return` refuses to bucket a null source, and `:374` `if (!src) continue` **omits** an unmeasured `sourcesByField` entry rather than zeroing it. This code is unusually disciplined about absent-vs-zero.

**"`?? 0` collapsing absent/zero/unmeasured" — TRUE, but in `duplicate-subject`, not `serving-sweep`,** and the worst instance is load-bearing on a *classification*, not a display: `classify.ts:205` and `:232` coerce `groundTruth.samplePointDistanceM ?? 0`, so an **unmeasured** sample-point distance reads as a **measured zero**, suppressing the `explained-by-sampling-point` branch and setting `sameSamplePoint` true. Rows S-119 and S-121.

---

## Rows S-25 – S-182

### `src/serving-sweep/project-sheet.ts`

| location | predicate | cheapest satisfier | sem. valid | deriv |
|---|---|---|---|---|
| S-25 :74-76 | `v && typeof v === "object" && !Array.isArray(v)` | `{}` | No | 4 |
| S-26 :79 | `typeof v === "string" && v.trim() ? v.trim() : null` | `","` | No | 4 |
| S-27 :84 | `typeof v === "string" && /[A-Za-z0-9]/.test(v)` | `"0"` | No | 4 |
| S-28 :108-109 | `const street = v.split(",")[0] ?? ""; return /[A-Za-z0-9]/.test(street.trim())` | `"0,"` | No | 1 |
| S-29 :121 | `return /^A\d?$/i.test(code.trim())` | `"A"` | Yes | 3 |
| S-30 :141 | `hasStreetSegment(servedSitus)` | `"0,"` | No | 1 |
| S-31 :143 | `typeof servedSitus === "string" && servedSitus.trim().length > 0` | `","` | No (deliberately — this is the branch that *catches* the sentinel) | 1 |
| S-32 :152 | `if (cadHasLegibleSitus) contradictions.push("address-absent-but-on-cad-roll")` | cad situs `"0,"` | No | 1 |
| S-33 :160 | `isLegibleText(base.apn)` | `"0"` | No | 3 |
| S-34 :165 | `const landUseCode = str(rec(base.landUse)?.code)` | `{code:","}` | No | 1 |
| S-35 :168 | `cov.landUse === true` | `true` | No | 3 |
| S-36 :172 | `rec(facets.provenance)?.landUseGateBlocked === true` | `true` | No | 3 |
| S-37 :185 | `env && env.status === "declined"` | `{status:"declined"}` | Yes | 3 |
| S-38 :188 | `cov.zoning === true && district` | `{zoning:{district:","}}` + flag | No | 1 |
| S-39 :190 | `declineReason === "atom_path_pending"` | exact string | Yes | 3 |
| S-40 :204 | `cardSetbackState === "present"` | exact enum | Yes | 3 |
| S-41 :219 | `wireSetbacks && cardSetbackState !== "present"` | `env.setbacks = {}` | No | 3 |
| S-42 :225 | `typeof env?.buildableAreaSqFt === "number"` | **`NaN`** | **No** | 4 |
| S-43 :227 | `typeof env?.buildableAreaPct === "number"` | **`NaN`** | **No** | 4 |
| S-44 :231 | `Array.isArray(f) ? f.length : g ? 1 : 0` | `{geojson:{}}` | No | 4 |
| S-45 :248-251 | `card.buildablePct.state !== "present" && (envArea !== null \|\| envPct !== null \|\| envGeoFeatures > 0)` | `{geojson:{}}` | No | 3 |
| S-46 :271 | `servedFloodStatus && servedFloodStatus !== "unavailable"` | `","` | No | 1 |
| S-47 :275 | `storeFloodStatus \|\| factFloodZone` | `","` | No | 1 |
| S-48 :288-292 | `storeFloodZone && factFloodZone && storeFloodZone.toUpperCase() !== factFloodZone.toUpperCase()` | two distinct non-blank strings | **Yes** | **1** |
| S-49 :310 | `envGeoFeatures > 0` | `{geojson:{}}` | No | 4 |
| S-50 :329 | `!str(facets.countyName) && /^\d{5}:/.test(input.parcelNodeId)` | omit countyName + well-formed id | Yes | 3 |

S-48 is the one meaning-shaped check in this file: `storeTier2Flood` comes from cortex `place_layer_snapshots`, `floodHazardFact` from the `atoms` store, written by two different adapters (`fema:nfhl-flood-zone` vs `fema-nfhl-bulk-v1`). No single party writes both sides.

### `src/serving-sweep/chain-assembly.ts`

| location | predicate | cheapest satisfier | sem. valid | deriv |
|---|---|---|---|---|
| S-51 :78 | `(inst.status ?? "active") !== "active"` | **OMISSION** | No | 4 |
| S-52 :79 | `inst.parcelNodeId !== parcelNodeId` | body echoing the requested id | No | 3 |
| S-53 :85 | `inst.entityId === parcelNodeId && prior.entityId !== parcelNodeId` | exact match | Yes | 3 |
| S-54 :94 | `typeof raw === "string" && raw.startsWith("did:")` | `"did:"` | No | 4 |
| S-55 :122-124 | `zoningFact && typeof zoningFact.sourceAdapter === "string" ? zoningFact.sourceAdapter : ""` | **OMISSION** | No — empty-string sentinel, fails **open** past R13 | 4 |
| S-56 :127-128 | `zoningAdapter.includes("bastrop-city") \|\| zoningAdapter.includes("txgio-zoning-stamp:bastrop-city-tx")` | substring anywhere | No | 4 |
| S-57 :142-145 | `setbackRule.sourceCodeAtomRef && typeof … === "object" && typeof …atomDid === "string"` | `{atomDid:""}` | No | 4 |

### `src/serving-sweep/bff-flow.ts`

| location | predicate | cheapest satisfier | sem. valid | deriv |
|---|---|---|---|---|
| S-58 :41 | `if (!body \|\| typeof body !== "object") return body` | `{}` | No | 4 |
| S-59 :44-45 | `root.facets && typeof root.facets === "object"` | `{}` | No | 4 |
| S-60 :84 | `fips && /^\d{5}$/.test(fips) ? fips : undefined` | `"00000"` | Yes | 3 |
| S-61 :98 | `baseFacts: !!apn` | `"0"` after the colon | No | 3 |
| S-62 :176 | `adapted.readPath === "atom-chain-warm"` | exact enum | Yes | 3 |

### `src/envelope-serve-independent.ts`

| location | predicate | cheapest satisfier | sem. valid | deriv |
|---|---|---|---|---|
| S-63 :24 | `return envelope.entityType === "buildable-envelope"` | exact | Yes | 3 |
| S-64 :36 | `envelope.depthWarmPromotion === DEPTH_WARM_PROMOTION_MARKER` | `"depth-warm-promoted-v1"` | Yes | 3 |
| S-65 :38-40 | `typeof envelope.absence?.kind === "string" && envelope.absence.kind.trim().length > 0` | `"x"` | No | 4 |
| S-66 :44-46 | `typeof envelope.warmVerifyDecline === "string" && …trim().length > 0` | `"x"` | No | 4 |
| S-67 :50-52 | `typeof envelope.warmVerifyDeclineCode === "string" && …trim().length > 0` | `"x"` | No | 4 |
| S-68 :56-59 | `typeof citation === "string" && citation.toLowerCase().includes("depth-warm-verify-decline")` | substring anywhere | No | 4 |

Four independent one-string-wide doors into "this envelope survives R27 suppression". Any of `"x"` in three different fields opens it.

### `src/index.ts`

| location | predicate | cheapest satisfier | sem. valid | deriv |
|---|---|---|---|---|
| S-69 :136 | `typeof existing === "string" && existing.startsWith("did:")` | `"did:"` | No | 4 |
| S-70 :244 | `annotated.filter((r) => r.isCurrentEdition !== false)` | `undefined` | No (declared fail-open) | 2 — needs `jurisdiction-corpus.currentEditionId` resolvable per tenant |
| S-71 :262 | `typeof r.editionId === "string" && r.editionId.length > 0` | `"0"` | No | 4 |
| S-72 :285 | `r.editionId === currentEditionId` | identical strings | Yes | 3 |
| **S-73 :402** | **`accessPolicy: payload.accessPolicy ?? "public-free"`** | **OMISSION** | **No** | **4** |
| **S-74 :484** | **`accessPolicy: payload.accessPolicy ?? "public-free"`** | **OMISSION** | **No** | **4** |
| S-75 :209 | `typeof body.isPedestrianWay === "boolean"` | `false` | No | 3 |
| S-76 :515-518 | `typeof input.limit === "number" && Number.isFinite(input.limit) ? Math.max(1, Math.min(Math.floor(input.limit), 2000)) : 400` | OMISSION | Yes | 4 |
| S-77 :576 | `if (!result.countyHasNodes)` | `false` | Yes | 3 |

### `src/node-detail.ts`

| location | predicate | cheapest satisfier | sem. valid | deriv |
|---|---|---|---|---|
| S-78 :70-74 | `if (PARCEL_NODE_ID_RE.test(id) && !id.includes(":road:") && !id.includes(":boundary:"))` | `"00000:0"` | Yes | 4 |
| S-79 :81 | `/^(\d{5}):([A-Za-z0-9._-]+):boundary:(\d+)$/.exec(boundaryEdgeId.trim())` | `"00000:0:boundary:0"` | Yes | 4 |
| S-80 :278-280 | `edges.find((e) => e.boundaryEdgeId === boundaryEdgeId) ?? edges.find((e) => e.edgeIndex === parsed.edgeIndex) ?? null` | any edge with a matching numeric index | **No** — resolves a requested id to a *different* atom on index alone | 3 |
| S-81 :282 | `if (!edge \|\| !isBoundaryEdgeAtomInstance(edge))` | a conforming instance | Yes | 3 |
| S-82 :219 | `const hasAny = propertyRows.length > 0 \|\| boundaryEdges.length > 0` | one row of any family | No — drives `resolution_status:"resolved"` / `status:"active"` from bare row presence | 3 |

### `src/atom-trace.ts`

| location | predicate | cheapest satisfier | sem. valid | deriv |
|---|---|---|---|---|
| S-83 :40-43 | `if (!stored \|\| isPropertyAtomInstance(stored) \|\| isRoadNodeAtomInstance(stored)) { return null } return stored as CodeAtomInstance` | any atom that is neither property nor road | No — negative narrowing then a bare cast | 4 |
| S-84 :122 | same predicate in `getAtomTrace` | same | No | 4 |
| S-85 :101 | `if (!resolved.ok)` | a registered entityType | Yes | 3 |
| S-86 :164 | `xref && xref.entityType === "code-cross-reference"` | exact | Yes | 3 |

### `src/effective-rule.ts`

| location | predicate | cheapest satisfier | sem. valid | deriv |
|---|---|---|---|---|
| S-87 :123 | `baseTextGoverns: input.baseSection !== null` | any non-null section | No | 4 |
| S-88 :135-137 | `overlays.some((o) => o.overlayOperation === "replace" \|\| o.overlayOperation === "delete")` | exact enum | Yes | 3 |
| S-89 :138-141 | `input.baseSection !== null && !hasReplaceOrDelete && resolution !== "added"` | non-null base + all-modify overlays | Yes | 3 |

### `src/rail-scoring-spec/score-cell.ts` — the strongest guard set in the package

| location | predicate | cheapest satisfier | sem. valid | deriv |
|---|---|---|---|---|
| S-90 :113 | `if (ceiling.railKey !== measurement.railKey)` | matching keys | Yes | 3 |
| S-91 :119-124 | `measurement.covered < 0 \|\| measurement.establishedAbsent < 0 \|\| measurement.denominator < 0 \|\| measurement.orphanDeterminations < 0` | `0` | Yes (sign guard, claims no more) | 4 |
| S-92 :131 | `if (!measurement.measured)` | `measured: true` | **No** — caller-asserted boolean, nothing corroborates | 4 |
| S-93 :142-143 | `if (!measurement.insideDeterminationCeiling) { if (ceiling.counties.has(measurement.countyFips))` | agreeing flag + set | **Yes** | **1** |
| S-94 :158 | `if (!ceiling.counties.has(measurement.countyFips))` | FIPS in the set | **Yes** | **1** |
| S-95 :167 | `if (!spec.scorableToday)` | `scorableToday: true` in `specs.ts` | Yes | 3 |
| S-96 :178 | `if (measurement.orphanDeterminations > 0)` | `0` | No — 0 and unmeasured are one value | 4 |
| S-97 :187 | `if (measurement.denominator === 0)` | `1` | Yes (refuses rather than dividing) | 4 |
| S-98 :200 | `if (pct > 100)` | `pct <= 100` | Yes | 3 |
| S-99 :210 | `if (rounded < spec.thresholdPct)` | threshold from spec | Yes | 3 |
| S-100 :223-225 | `if (measurement.covered === 0 && measurement.establishedAbsent > 0) { if (!absenceBasis \|\| absenceBasis.trim().length === 0)` | `"x"` | No | 4 |
| S-101 :246-247 | `return score.guardViolations.length === 0` | empty array | Yes | 3 |

S-93/S-94 are the only pair in the package where a *type* carries the constraint the way ENFORCEMENT prefers: `DeterminationCeilingSet.counties` is a `ReadonlySet<string>` and membership, not a count, decides out-of-reach.

### `src/statewide-audit/classify.ts`

| location | predicate | cheapest satisfier | sem. valid | deriv |
|---|---|---|---|---|
| S-102 :90 | `return ledgerDisplayState !== null && SATISFIED.has(ledgerDisplayState)` | `"satisfied-absent"` | Yes | 3 |
| S-103 :103-107 | `if (!scoredComputedAt \|\| !writtenAt) return false; … if (Number.isNaN(s) \|\| Number.isNaN(w)) return false; return s < w` | omit either stamp | No (declared: unknown never upgraded to an accusation) | **1** |
| S-104 :145-148 | `railCeilingCounties !== null && railCeilingCounties < countiesTotal && railCountiesWritten <= railCeilingCounties` | a ceiling **count** | **No** | **2** — needs a `DeterminationCeilingSet` (`score-cell.ts:54-62`) plumbed here |
| S-105 :150 | `if (writtenAtoms === 0)` | `1` | No — 0 and unmeasured collapse | 4 |
| S-106 :164 | `if (!scoredRowExists)` | `true` | No | 3 |
| S-107 :182 | `if (SERVED_FIELD_BY_RAIL[railKey] === null)` | a non-null field name | Yes | 3 |
| S-108 :189 | `if (servedPresentParcels === null \|\| servedSweptParcels === null)` | a number | **Yes** — the gate that refuses to publish a zero | 3 |
| S-109 :196 | `if (servedPresentParcels === 0)` | `1` | Yes | 1 |

S-104 is the sharpest internal contradiction in the package: `score-cell.ts:48-53` states that a ceiling **count** cannot classify a cell and names the exact 2-of-1 rail-corridor error it caused — and `classifyCell` in the *same package* still classifies `out-of-reach` from `railCeilingCounties: number | null`.

### `src/statewide-audit/rail-served.ts`

| location | predicate | cheapest satisfier | sem. valid | deriv |
|---|---|---|---|---|
| S-110 :128-133 | `const hasValue = v !== null && v !== undefined && !(typeof v === "string" && v.trim() === "") && !(Array.isArray(v) && v.length === 0) && v !== false` | `", ,"` or `{}` | **No** — this is the `IS NOT NULL` rung the package documents at `project-sheet.ts:97` | 4 |
| S-111 :178 | `hits.filter((h) => tokens.some((t) => h.leaf.includes(t)))` | any key whose *name* contains the token | No | 4 |
| S-112 :220-222 | `if (slotPaths.length > 0) { for (const p of slotPaths) if (valuedPaths.has(p)) return "served"; return "slot-empty" }` | one slot path with a `hasValue` leaf | No (inherits S-110) | 3 |
| S-113 :224-227 | `if (!wireProbeUnavailable) { for (const t of RAIL_WIRE_ENTITY_TYPES[rail]) { if (chainEntityTypes.has(t)) return "on-wire-not-served" } }` | one atom of the family on the chain | Yes | 1 |

S-110 is mitigated but not fixed: `three-layer-sweep.mjs:515-522` publishes an `_authorityRule` naming exactly this and telling the reader that for seven rails the nine-field `FieldTally` overrides. For the other seven rails there is no override and S-110 is the whole measurement.

### `src/duplicate-subject/classify.ts`

| location | predicate | cheapest satisfier | sem. valid | deriv |
|---|---|---|---|---|
| S-114 :36-40 | `if (v == null) return null; const t = String(v).trim().toUpperCase(); return t === "" ? null : t` | `","` | No | 4 |
| S-115 :56-62 | `const head = z[0]; if (head === "A" \|\| head === "V") return true; if (head === "X" \|\| head === "D") return false; return null` | `"A"` | Yes (unknown ⇒ `null`, not `false`) | 4 |
| S-116 :130 | `if (va == null \|\| vb == null)` | both non-null | Yes | 1 |
| S-117 :160 | `if (va === vb)` | identical normalised strings | **Yes** | **1** |
| S-118 :169 | `if (a.edition == null \|\| b.edition == null)` | both stores name an edition | **Yes** — refuses to fabricate `edition-differs` | **1** |
| S-119 :200-206 | `gtA != null && gtB != null && gtA === va && gtB === vb && (groundTruth.samplePointDistanceM ?? 0) > 0` | omit the distance ⇒ `0` ⇒ branch **not** taken | **No** | 1 |
| S-120 :220 | `if (zoneSet.includes(va) && zoneSet.includes(vb))` | both values in the GT zone set | Yes | 1 |
| S-121 :232 | `const sameSamplePoint = (groundTruth.samplePointDistanceM ?? 0) === 0` | **OMISSION** | **No** — an unmeasured distance reports as "same sample point" | 1 |
| S-122 :234 | `truthAtEntity != null && (truthAtEntity === va) !== (truthAtEntity === vb)` | truth matching exactly one side | Yes | 1 |
| S-123 :313 | `const pct = (n, d) => (d === 0 ? 0 : Number(((n / d) * 100).toFixed(4)))` | `d === 0` | **No** — an undefined rate publishes as `0` | 4 |

This file has the highest density of state-1 checks in the package — it is built on two genuinely independent stores plus a PostGIS ground truth. S-119/S-121 are the defect: `GroundTruthReading.samplePointDistanceM` is typed `number | null` precisely so null is representable, and both call sites throw the null away.

### `scripts/duplicate-subject-detector.mjs`

| location | predicate | cheapest satisfier | sem. valid | deriv |
|---|---|---|---|---|
| S-124 :296 | `declared.filter((k) => !derivedStoreKeys.has(suffixed(k)))` | every declared key present live | **Yes** | **1** |
| S-125 :298-305 | `!claimed.has(k) && !excluded.has(k) && !k.includes(".")` | key claimed or excluded | **Yes** | **1** |
| S-126 :338 | `clean: deadDeclarations.length === 0 && unclassified.length === 0` | both empty | Yes | 1 |
| S-127 :347-349 | `if (checkRegistry && !report.registryDivergence.clean) { … process.exitCode = 1 }` | **omit `--check-registry`** | **No** — opt-in per invocation; see R-6 | 1 |
| S-128 :408-414 | `const isoInstant = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/; … if (isoInstant.test(r.vintage_field))` | an ISO instant | **Yes** | 1 |
| S-129 :437-439 | `b != null && Number.isFinite(b.lat) && Number.isFinite(b.lng)` | float8-cast lat/lng | Yes | 4 |
| S-130 :506 | `if (!b \|\| !Number.isFinite(b.lat) \|\| !Number.isFinite(b.lng)) continue` | same | Yes | 4 |
| S-131 :633-636 | `filter((g) => g.has_geom !== true)` / `(g) => g.has_geom === true && (g.zone_set ?? null) == null` | real booleans | **Yes** — separates no-geometry from no-zone-intersect | 1 |
| S-132 :686 | `gtA !== "" && gtA === (v.a.value ?? "").toUpperCase()` | matching non-blank zone codes | Yes — self-check on the declared stand-in | 1 |
| S-133 :691 | `pct: n === 0 ? 0 : Number(((ok / n) * 100).toFixed(2))` | `n === 0` | **No** — 0 adjudicated publishes 0% reproduction, indistinguishable from a broken stand-in | 4 |
| S-134 :146-147 | `if (!out.inventory && out.counties.length === 0) throw new Error("--inventory or --county <fips> required")` | pass either | Yes | 4 |
| S-135 :153 | `if (!v \|\| !v.trim()) throw new Error(\`FATAL: ${name} is required\`)` | `"x"` | No | 4 |
| S-136 :734-737 | `if (s !== "flood-zone") throw new Error(…)` | `"flood-zone"` | Yes — refuses subjects it cannot measure | 4 |

S-124/S-125/S-128/S-131/S-132 are the best-constructed checks in `packages/retrieval`: each pays the cost of a second derivation instead of weakening. S-127 is what strands them.

### `scripts/serving-sweep.mjs`

`three-layer-sweep.mjs` is a near-verbatim superset and carries **the same thirteen predicates** at :165, :166, :172, :192, :216, :260, :338, :361, :366, :393, :413, :496-498, :501. Rows are not duplicated; the offsets are named here instead.

| location | predicate | cheapest satisfier | sem. valid | deriv |
|---|---|---|---|---|
| S-137 :82 | `if (out.counties.length === 0) throw new Error("--county <fips> required")` | `--county x` (no FIPS shape check) | No | 4 |
| S-138 :83 | `if (!out.out) throw new Error("--out <dir> required")` | any string | Yes | 4 |
| S-139 :89 | `if (!v \|\| !v.trim()) throw new Error(\`FATAL: ${name} is required\`)` | `"x"` | No | 4 |
| S-140 :109 | `const n = Number.isFinite(featureCount) ? featureCount : 1` | SQL NULL feature count | **No** — an unmeasured count becomes exactly one feature, and `project-sheet.ts:310` reads `envGeoFeatures > 0` as geometry present | 4 |
| S-141 :133 | `if (key == null) return` | any non-null key | **Yes** — an unmeasured source is omitted, never bucketed | 4 |
| S-142 :177 | `btrim(split_part(body->>'situsAddress', ',', 1)) ~ '[A-Za-z0-9]'` | `"0,"` | No | 1 |
| S-143 :248 | `typeof body.parcelNodeId === "string" ? body.parcelNodeId : r.entity_id` | **OMISSION** | No — see R-11 | 3 |
| S-144 :271 | `t1Payload && typeof t1Payload.countyName === "string" && t1Payload.countyName.trim()` | `","` | No — last non-blank wins for the whole county record | 4 |
| S-145 :276 | `if (!t1Payload && parcelAtoms.length === 0)` | either present | **Yes** — routes to `addUnresolvable`, out of band from every tally | 1 |
| S-146 :303 | `storeTier2 && storeTier2.flood && typeof storeTier2.flood === "object"` | `{flood:{}}` | No | 4 |
| S-147 :323 | `geo && Number.isFinite(geo.lat) && Number.isFinite(geo.lng)` | a JS `number` from Postgres | **Unresolved — see R-7** | 4 |
| S-148 :374 | `const src = mode(srcCounters[key]); if (!src) continue` | any observed source | **Yes** — unmeasured field omitted from `sourcesByField` | 4 |
| S-149 :377 | `vintage: vintageCounters[key] ? mode(vintageCounters[key]) : null` | a tracked field | No — `apn`/`frontage` have no vintage counter and report `vintage: null`, identical to a tracked field whose vintage was never seen | 4 |

### `src/serving-sweep/vendor/atom-chain-to-facets.ts`

| location | predicate | cheapest satisfier | sem. valid | deriv |
|---|---|---|---|---|
| S-150 :92 | `if (!/^48021:[^/\s]+$/.test(parcelNodeId.trim()) \|\| !rule) return false` | any non-Bastrop id | No — R13 hardcoded to one FIPS | 4 |
| S-151 :99 | `if (adapter === "bastrop-per-parcel-record-layer-23") return false` | exact string | Yes | 4 |
| S-152 :113 | `return adapter !== "bastrop-per-parcel-record-layer-23"` | exact string | No — but fails **closed**: a missing `sourceAdapter` becomes `""` at :98 and is judged stale | 4 |
| S-153 :242-246 | `if (!parcelNodeId \|\| parcelNodeId.includes("..")) return null; if (tail !== "facets") return null; if (path.length !== 3) return null; if (parcelNodeId.includes("/")) return null` | `"0"` | Yes for traversal, No as an id | 4 |
| S-154 :251-255 | `if (chain.zoningFact && typeof chain.zoningFact === "object") return true; if (Array.isArray(chain.atoms) && chain.atoms.length > 0) return true` | `{zoningFact:{}}` | **No** — an empty object makes the chain "usable" and diverts the read off the cortex fallback | 4 |
| S-155 :299-305 | `if (typeof front !== "number" \|\| typeof side !== "number" \|\| typeof rear !== "number") return undefined` | `NaN` | No | 4 |
| S-156 :504-505 | `const hasDistrict = !absenceKind && typeof zf?.district === "string" && zf.district.trim().length > 0` | `","` | No | 1 |
| S-157 :441-443 | `const m = a.match(/(?:zoning-stamp\|jurisdiction)[:/]([a-z0-9][a-z0-9-]*)/i); if (m && m[1]) return m[1].toLowerCase(); return null` | `"zoning-stamp:a"` | No | 4 |
| S-158 :463 | `if (!code && !message && !outcomeReason) return null` | `"x"` in any of three | No | 4 |
| S-159 :517-521 | `typeof rule.maxHeightFt === "number" && rule.maxHeightFt > 0` | `0.0001` | Yes (`NaN > 0` is false, so NaN excluded) | 4 |
| S-160 :640 | `typeof areaSqFt === "number" && areaSqFt > 0` | `0.0001` | Yes | 4 |
| S-161 :368-372 | `typeof bakedBase.acreage.value === "number" && Number.isFinite(bakedBase.acreage.value)` | `0` | **Yes** — the finite guard `project-sheet.ts:225` lacks | 4 |
| S-162 :359-364 | `typeof bakedBase.landUse.code === "string" && bakedBase.landUse.code.trim()` | `","` | No | 1 |
| S-163 :401-404 | `atomFacets.facetCoverage?.baseFacts === true \|\| bakedCov.baseFacts === true \|\| !!apn` | any of three | No | 3 |
| S-164 :352 | `if (!baked \|\| typeof baked !== "object") return atomResponse` | `{}` | No | 4 |

### `src/serving-sweep/vendor/baked-facets.ts`

| location | predicate | cheapest satisfier | sem. valid | deriv |
|---|---|---|---|---|
| S-165 :280 | `typeof bf.apn === "string" && bf.apn.trim()` | `","` | No | 3 |
| S-166 :285 | `typeof bf.situsAddress === "string" && bf.situsAddress.trim()` | **`", ,"`** | **No** — the exact predicate `project-sheet.ts:10-16` names as the source of the "99.3% populated" figure | 1 |
| S-167 :233-238 | `const label = code && description ? … : description \|\| code; if (!label) return null` | `","` | No | 4 |
| S-168 :253 | `if (!ac \|\| typeof ac.value !== "number" \|\| !Number.isFinite(ac.value)) return null` | `0` | Yes | 4 |
| S-169 :334 | `const hasEnvelope = cov.envelope === true && !!env && env.status !== "declined"` | `{envelope:{status:"ok"}}` + flag | No | 3 |
| S-170 :336-340 | `!!(s?.not_specified?.front \|\| s?.not_specified?.side \|\| s?.not_specified?.rear)` | one `true` | Yes | 3 |
| S-171 :443-455 | `if (res.status === 404) …; if (res.status === 503 \|\| res.status === 502 \|\| res.status === 504 \|\| res.status === 429) …; if (!res.ok) …` | an HTTP status | **Yes** — transient never folded into absence | 4 |
| S-172 :468 | `if (b && typeof b === "object" && b.retryable === true)` | `{retryable:true}` | Yes | 3 |
| S-173 :475 | `if (!b \|\| typeof b !== "object" \|\| !b.facets)` | `{facets:{}}` | No | 4 |

S-166 is the package's own documented defect, still live in the vendored serving code. The sweep does not fix it — `project-sheet.ts:139` records the card's verdict separately as `servedCardCallsSitusPresent` so the divergence is published rather than silently corrected. That is the right handling of a vendored defect.

### `src/serving-sweep/vendor/setback-not-specified.ts` and `buildable-display-vocab.ts`

| location | predicate | cheapest satisfier | sem. valid | deriv |
|---|---|---|---|---|
| S-174 setback :33-36 | `if (typeof raw !== "string") return ""; const t = raw.trim().split(/\s+/)[0] ?? ""; return t.toUpperCase()` | `"P-1 anything"` | Yes (leading-token MATCH CONTRACT) | 4 |
| S-175 setback :44 | `return BASTROP_B3_NOT_SPECIFIED[token] ?? null` | `"P-1"` | Yes | 4 |
| S-176 setback :102 | `if (!c.section_number) return null` | `"x"` | No — any non-empty string counts as a citation | 4 |
| S-177 setback :105-107 | `const head = value ?? routed; if (!head) return null` | a numeric `value_ft` or a district | Yes | 4 |
| S-178 vocab :73-75 | `typeof n === "number" && Number.isFinite(n) && n > 0` | `0.0001` | Yes | 4 |
| S-179 vocab :77-79 | `typeof n === "number" && Number.isFinite(n) && n >= 0` | `0` | Yes | 4 |
| S-180 vocab :278-285 | `if (!drawableOrAreaPresent(input)) return false; … if (/consumes?\s+lot/.test(blob)) return true; if (vocab.kind === "declined-consume") return true; …` | any vocab whose labels avoid those tokens | Yes as a guard — see R-5 | 3 |

### `scripts/capture-live-parity-fixtures.mjs`

| location | predicate | cheapest satisfier | sem. valid | deriv |
|---|---|---|---|---|
| S-181 :66 | `if (!v \|\| !v.trim()) throw new Error(\`FATAL: ${name} is required\`)` | `"x"` | No | 4 |
| S-182 :79-82 | `if (!res.ok) { process.stderr.write(…); continue }` | HTTP 200 | **No** — a non-ok parcel is *skipped*, so the fixture silently shrinks and `live-parity.test.ts` asserts over whatever survived | 4 |

---

## Remarks — absences (no predicate, therefore no row)

**R-1 — no check that `accessPolicy` was resolved.** `index.ts:402` and `:484` serve `payload.accessPolicy ?? "public-free"`. ADR-017's five-value union is a type the compiler could enforce at the write site; at this read site an atom with **no** policy is served as the most permissive value in the union. `listJurisdictions`' own docblock (`:666`) states the rule as intentional for jurisdiction snapshots — but S-73/S-74 apply it to **every atom on the property and road chains**, which the docblock does not cover. There is no predicate to grade, only a default. The second mechanism I considered and rejected: that upstream storage guarantees the field non-null, making the default unreachable. I rejected it because `StoredAtomInstance.accessPolicy` is optional at the type level (the `??` would be a type error otherwise) and because `atom-chain-to-facets.ts` never carries the field at all.

**R-2 — `src/serving-sweep/tally.ts` contains no validity check.** 215 lines, zero predicates that admit or refuse. This is the file the dispatch predicted would hold sentinel defaults. It holds none: the `?? 0` at :116, :127, :138, :176-177 are lazy map initialisers whose keys exist only once observed, and the fixed-list zeros at :49 and :174-178 are exhaustive-sweep zeros. Second mechanism considered: that a zeroed `ContradictionTally.count` could be a dormant detector reporting a false clean. I rejected it for four of five kinds because `detectors-fire.test.ts` exists (unread, named at `__tests__/detectors-fire.test.ts`) and `project-sheet.ts` pushes every kind from a live branch — but I did **not** verify the test actually exercises all five, so this rejection is bounded.

**R-3 — nothing derives `CellMeasurement.measured`.** `score-cell.ts:131` is the package's flagship "unmeasured is not zero" guard and its input is a boolean the caller asserts. `types.ts:213` documents it as "False where the scorer did not run for this cell. Never inferred" — but *never inferred* is a comment, not a mechanism. A caller that hardcodes `measured: true` gets confident percentages from `scoreCell` with no guard violation. No check exists; the type could carry the constraint (a discriminated union of `{measured:false}` | `{measured:true, measuredAt, measuredBy}`) and does not.

**R-4 — same shape for `orphanDeterminations`.** S-96 tests `> 0`. There is no field distinguishing "measured zero orphans" from "never counted orphans", so the guard the file's own header calls "Measured, never assumed zero" is satisfiable by assuming zero.

**R-5 — `violatesHistoricalDisagreementGuard` is a starved detector inside this package.** Exported at `buildable-display-vocab.ts:274`. I read every non-test source file in `packages/retrieval`; the only import of `buildable-display-vocab.js` is `baked-facets.ts:28`, which imports `mapBuildableDisplay` alone. So nothing in this package calls it in a gating position. Second mechanism, which I do **not** reject: this is a *vendored verbatim* copy (`vendor/README.md`, `VENDOR_SOURCE_SHA.txt`), so the guard is very likely gated in `hauska-map`, and its presence here is fidelity to the vendored source, not a dead control. I am asserting starvation **within `packages/retrieval` only**, and I did not open `hauska-map`.

**R-6 — the package's only exit-1 divergence control has no trigger.** Three-question gate for S-127:
1. *What executes it?* A manual `node --import tsx packages/retrieval/scripts/duplicate-subject-detector.mjs --inventory --check-registry`.
2. *What triggers it?* Nothing. Both workflow files at the snapshot are `ci.yml` and `block13-cert-grade.yml` (`git ls-tree -r --name-only d3f3794 .github/workflows` — a directory enumeration, not a grep). `ci.yml` runs `pnpm test`, two hardcoded `grep`/`rg` gates, and `pnpm typecheck`; `block13-cert-grade.yml` runs two `engine-core` vitest files. Neither invokes the detector. `packages/retrieval/package.json:15-21` scripts a `serving-sweep` entry and nothing else.
3. *What fails?* `process.exitCode = 1` observed by whoever ran it by hand.
4. *What bypasses it?* Omitting the flag; the runner still writes `inventory.json` and prints the divergence, exit 0.

The subject registry's own header (`subject-registry.ts:10-14`) states "the declaration is never trusted on its own — the divergence test is", and cites the `has_writer`/`atomFamilyState` drift precedent. The divergence test exists and is correct. It is not armed. Separately and in the other direction: **the test suites are armed, not dormant** — root `package.json:16` `pnpm -r run test` reaches `packages/retrieval`'s `vitest run --passWithNoTests`, and `ci.yml:99-100` runs it on every push and PR to `main`.

**R-7 — the centroid guard may be silently starving `absenceClusters`, and I cannot settle it from this repo.** `serving-sweep.mjs:323` and `three-layer-sweep.mjs:413` run `Number.isFinite(geo.lat)` on `(south_lat + north_lat) / 2.0` selected from `txgio_parcel` with **no cast**. If those columns are `numeric`, the quotient is `numeric`, postgres.js returns a **string**, `Number.isFinite("30.1")` is `false`, every centroid resolves `null`, `tally.ts:128` (`if (o.state !== "present" && obs.centroid)`) never clusters, and `absenceClusters` is `[]` for every county — a starved mechanism reporting as a clean zero, on the exact question the operator asked ("is this hole a region or is it scattered", `tally.ts:9-12`). Two pieces of same-repo evidence point at the hazard: `duplicate-subject-detector.mjs:376-377` casts `lat_rounded::float8` explicitly, and `write-building-footprint-county.mjs:254-256` reads **the same table's** bbox columns through `Number.isFinite(Number(n))` with an explicit coercion. **Second mechanism, which I cannot reject:** the columns may be `double precision` — as `tx_special_district` and `tx_zoning_district_staging` are declared in migrations `0072`/`0074` — in which case `float8 / numeric-literal` resolves to `float8`, postgres.js returns a JS number, and the guard works correctly. `txgio_parcel` has no DDL in `hauska-engine` at this snapshot (it is cortex-owned; `git grep -l txgio_parcel -- '*.sql'` at `d3f3794` returns nothing). **This is the single highest-value item to settle, and one `\d+ txgio_parcel` against cortex settles it.** READ, not VERIFIED.

**R-8 — no divergence test for the situs predicate pair.** `serving-sweep.mjs:177` (SQL) and `project-sheet.ts:108-109` (JS) are two implementations of one rule, and the script's own comment at :169-171 says so ("the same rule on both sides of the comparison, or the contradiction count measures the predicate rather than the data"). `assembly-divergence.test.ts` exists for the `chain-assembly` ↔ `getPropertyAtomChain` pair; there is no equivalent for this one. The `address-absent-but-on-cad-roll` count is therefore unprotected against the two predicates drifting.

**R-9 — `FieldTally.unresolved` cannot be fed from the BFF layer, and the file says so.** `bff-flow.ts:18-25` declares that the live handler's three failure branches (401, transient, JSON parse) are unreachable offline, so `unresolved` can only come from the DB read. A zero there is not evidence the live path does not fail. Correctly declared, no row.

**R-10 — `frontage` is a constant, not a measurement.** `project-sheet.ts:321-324` returns a hardcoded `{state:"absentUncovered", reason:"attaching-roads-not-adapted-to-facets"}` for every parcel in Texas. No predicate. Downstream, `statewide-audit/classify.ts:196` (`servedPresentParcels === 0`) will therefore classify the `roads` rail `written-unserved` for every county without anything having looked.

**R-11 — the sweep's re-keying and the dedupe filter disagree, silently.** `serving-sweep.mjs:248` buckets an atom under `r.entity_id` when `body.parcelNodeId` is absent — but pushes the **unmodified body**, so `chain-assembly.ts:79` (`inst.parcelNodeId !== parcelNodeId`) then evaluates `undefined !== "48021:123"` and drops the atom. The atom is bucketed and then discarded with no counter. This mirrors the live `PgStoragePort` behaviour (per `chain-assembly.ts:64-71`), so it is fidelity rather than a divergence — but it means an atom family that stops writing `body.parcelNodeId` disappears from both the sweep and production identically and invisibly.

---

## Files READ vs not opened

**READ in full at `d3f3794`** (23): `package.json`, `scripts/serving-sweep.mjs`, `scripts/three-layer-sweep.mjs`, `scripts/duplicate-subject-detector.mjs`, `scripts/capture-live-parity-fixtures.mjs`, `src/index.ts`, `src/node-detail.ts`, `src/atom-trace.ts`, `src/effective-rule.ts`, `src/edition-at-date.ts`, `src/envelope-serve-independent.ts`, `src/serving-sweep/{index,types,tally,project-sheet,chain-assembly,bff-flow}.ts`, `src/serving-sweep/vendor/{baked-facets,atom-chain-to-facets,setback-not-specified}.ts`, `src/statewide-audit/{index,classify,rail-served}.ts`, `src/duplicate-subject/{index,types,classify}.ts`, `src/rail-scoring-spec/{index,types,score-cell}.ts`. Plus `.github/workflows/ci.yml` in full and `block13-cert-grade.yml` filtered to its `run:`/`name:` lines.

**READ in part, sufficient for this task:**
- `src/serving-sweep/vendor/buildable-display-vocab.ts` — lines 55-286 (all executable code; 1-54 is the input interface).
- `src/duplicate-subject/subject-registry.ts` — lines 1-250 and 380-484. Lines 250-380 are more `SubjectDeclaration` literals of identical shape; the file's only two functions (`declaredStoreKeys`, `duplicatedSubjects`, :475-484) contain no predicate beyond `d.stores.length >= 2`.
- `src/rail-scoring-spec/specs.ts` (703 lines) — **not read in full.** Filtered for executable lines: exactly one hit, `:701-702` `Object.fromEntries(RAIL_SCORING_SPECS.map(…))`, an index build with no predicate. The rest is declarative spec data consumed by `score-cell.ts`.
- `src/statewide-audit/types.ts` (248 lines) — filtered for `function|=>|return|if (|===|!==|&&|??`: **zero matches.** Pure type declarations, unlike its `duplicate-subject` counterpart which carries `isDisagreement`/`isComparable`.

**NOT OPENED, named:**
- `scripts/three-layer-audit.mjs` — excluded by the dispatch.
- All 8 test files: `src/__tests__/{atom-chain-wire-dids,calibration-overlay-readthrough,effective-rule,mcp1-property-chain-widen,r27-warm-decline-survives-stale-setback,road-atom-chain-no-calibration,search-edition-honesty}.test.ts`; plus `src/serving-sweep/__tests__/{assembly-divergence,detectors-fire,live-parity,vendor-drift}.test.ts`, `src/statewide-audit/__tests__/{classify,rail-served}.test.ts`, `src/duplicate-subject/__tests__/{classify,subject-registry}.test.ts`, `src/rail-scoring-spec/__tests__/rail-scoring-spec.test.ts`. Excluded deliberately: test assertions are a different mechanism class from admissibility checks, and grading ~400 `expect()` calls would be padding. Their armed/dormant status is settled in R-6.
- `src/serving-sweep/__tests__/__fixtures__/live-parity.json` (3,842 lines, data).
- `src/serving-sweep/vendor/buildable-envelope-types.d.ts` (124 lines, declared verbatim type shim).
- `src/serving-sweep/vendor/VENDOR_SOURCE_SHA.txt`, `vendor/README.md`, `src/rail-scoring-spec/README.md`, `src/statewide-audit/README.md`, `tsconfig.json`.