---
id: 2026-07-23_phase05_contract_extension_design_GATE_B
title: Phase 0.5 contract-extension design — reasoning chain + source-obligation (Gate B)
status: active
date: 2026-07-23
last_updated: 2026-07-23
published_npm: "@empressaio/atom-contract@1.8.0"
published_gitHead: be7e4da01ab2f569f27c04aeb50188bae5115a7b
published_pr: "https://github.com/empressaioemail-tech/hauska-atom-contract/pull/7"
applies_to: hauska-atom-contract, hauska-sdk (SourceActorReference seam), hauska-mcp-server (inbound meter consumer), hauska-engine
related: [2026-07-23_MASTER_WDLL_property_reasoning_substrate, 2026-07-23_phase0_spine_readiness_audit_GATE_A, 2026-07-23_reasoning_chain_atom_shape_design, 25b_monetization_provenance_storage_stack, 75n_icc_code_connect_catalog, 80_adrs/adr_015_actor_atoms, 80_adrs/adr_025_og_atom_ontology]
owner: nick
gate: B
gate_b_round: 2
baseline_npm: "@empressaio/atom-contract@1.7.0"
proposed_npm: "@empressaio/atom-contract@1.8.0"
---

# Phase 0.5 — contract-extension design (Gate B)

Design only. **No publish until Gate B go.** Grades master WDLL 2.5.1–2.5.4. Built against live `@empressaio/atom-contract@1.7.0` (`gitHead` `25215fd`).

Gate A ruling carried forward: Option A; 2.1 PARTIAL-with-escalation-noted; Phase 1a StoragePort is a hard bar before 1b; do not re-own Overpass; I-2 shim replaced only at Gate C.

**Gate B round 1 (2026-07-23):** 2.5.1 / 2.5.2 / 2.5.3 APPROVED as designed. **2.5.4 REWORK required** — do not ship a second obligation model beside the existing core `ObligationAtomInstance`. This file's §5 is the corrected 2.5.4. Round-2 re-verify before any contract PR.

## 0. Publish posture (what Gate B is approving)

| Field | Value |
|---|---|
| Package | `@empressaio/atom-contract` |
| Bump | **1.8.0** (additive minor, same pattern as 1.7.0) |
| Publish rail | tag-push CI (`.github/workflows/publish.yml` on `v*.*.*`) |
| Scope of this bump | PRIMITIVES only — reasoning-chain shape, consequence ruling for non-life-safety, provenance field map (docs + helpers), **ADR-015 `actor-record` + licensing terms on that actor**, additive `ObligationType` variants for license royalties (reuse shipped `ObligationAtomInstance`), ICC actor + obligation fixtures |
| Explicitly NOT in 1.8.0 | property fact/rule/derived **kinds** (master 3.2 — Phase 1b, after StoragePort 3.1 clears); gate inbound-meter wiring (Phase 1d); Stripe→SDK swap (Gate D); StoragePort; **any parallel `SourceAttribution` / standalone source-obligation type** |

Consumers on `^1.7.0` stay green until they import the new exports. `./og`, `./encumbrances`, `./temporal`, existing `./read-contract` requiredness for life-safety `ThreeAxisConfidence` — **unchanged**.

---

## 1. Live baseline (reconfirmed; do not relitigate)

```
npm view @empressaio/atom-contract version  → 1.7.0
npm view @empressaio/atom-contract gitHead → 25215fdd304f465652a7f10428ac3204f7c63004
```

| Claim | Live fact |
|---|---|
| Generic reasoning-chain (multi input-atom refs + composed confidence) | ABSENT |
| `AtomComposition` | RENDER edge only (`childEntityType` / `childMode` / `dataKey`) |
| Closest idiom | `./og` `production-timeseries`: `streamKind: "derived-allocation"` requires `derivationMethod` + `derivesFromStreamDid` + `WidthedConfidence` |
| `ThreeAxisConfidence.consequence` | REQUIRED; ASCE7/IBC life-safety-shaped |
| `actor-record` (ADR-015) | Accepted in ADR; **not published** in 1.7.0 `src/` (grep-clean) |
| SDK `SourceActorReference` | Provisional in `@hauska-sdk/payment` (`id` / `type` / `ref`) — comment says "until atom-contract fields land" |
| Source-obligation **model** | **ALREADY SHIPPED** as core `ObligationAtomInstance` (`src/obligation.ts`, ADR-025, "domain-neutral from birth") with `obligationType`, `owedToActorDid?`, `anchorDid`, derived `status`, `sourceCitation` — main barrel + `./og` re-export |
| License royalty `ObligationType` variants | ABSENT (O&G lease types + `"other"` only) — additive extend if needed |
| Licensing terms on an actor | ABSENT (blocked on unpublished `actor-record`) |

---

## 2. Design — 2.5.1 Reasoning-chain primitive

### 2.1 Adopt, do not invent

Generalize the shipped O&G derived idiom into a **core** module (not `./og`), exported from the main barrel and optionally re-exported under `./reasoning` for discoverability.

| production-timeseries (keep as-is) | New core primitive |
|---|---|
| `streamKind: "reported" \| "derived-allocation"` | `reasoningKind: "observed" \| "derived"` |
| single `derivesFromStreamDid?: string` | `inputAtomRefs: AtomInputRef[]` (required when derived; min length 1) |
| `derivationMethod?: string` | `derivationMethod: string` (required when derived) |
| `confidence?: WidthedConfidence` on instance | composed confidence expressed via read axes at READ (I-E); instance MAY carry asserted snapshot for bake, never as sole calibrated freeze |
| O&G-only entityType | entity-type-agnostic; property kinds in Phase 1b bind to this shape |

**Do not rename** `derivesFromStreamDid` on O&G types. Do not make O&G import the new type as a breaking rewrite. New code (property chain, future compliance findings) uses the core primitive; O&G may migrate later voluntarily.

### 2.2 Proposed types (publish surface)

New file: `src/reasoning-chain.ts` (main barrel export). Optional subpath `./reasoning` that re-exports the same symbols (mirror `obligation` / `./og` convenience pattern).

```typescript
/** Stable typed pointer to an input atom in a reasoning chain. */
export interface AtomInputRef {
  /** DID or atomDid string of the input atom. Bare strings without resolvable identity = FAIL at conformance. */
  atomDid: string;
  /**
   * Role of this input in the derivation.
   * - fact / rule / derived = atom inputs
   * - reference-field = continuous cited input (geometry, topo, road) that is NOT itself atomized
   */
  role: "fact" | "rule" | "derived" | "reference-field";
  /** Optional entityType hint for validators / UI (e.g. "zoning-fact", "setback-rule"). */
  entityType?: string;
  /** Optional human citation label for inspect-card rendering. */
  citationLabel?: string;
}

/**
 * Discriminated reasoning block. Observed atoms omit or set observed.
 * Derived atoms MUST carry method + at least one input ref.
 * Composed confidence is NOT frozen here — it resolves at read via
 * calibration overlay (I-E) + asserted axes.
 */
export type ReasoningChain =
  | { reasoningKind: "observed" }
  | {
      reasoningKind: "derived";
      derivationMethod: string;
      inputAtomRefs: AtomInputRef[]; // min 1
    };

export const REASONING_CHAIN_SCHEMA: /* zod */ unknown;
```

Zod refine (mirror production-timeseries):
- `reasoningKind === "derived"` ⇒ `derivationMethod` non-empty AND `inputAtomRefs.length >= 1` AND every `atomDid` non-empty.
- `role === "reference-field"` inputs are allowed WITHOUT requiring a resolvable atom row in conformance fixtures (they cite external fields); fact/rule/derived roles require DID-shaped refs in fixtures.

### 2.3 Conformance fixtures (ship with 1.8.0)

Minimum fixture set under `src/reasoning/fixtures.ts` (or `src/reasoning-chain.fixtures.ts`):

1. **Observed fact stub** — `reasoningKind: "observed"`, accessPolicy explicit `public-free`, provenance fields present.
2. **Derived envelope stub** — `reasoningKind: "derived"`, `derivationMethod: "buildable-envelope-inset-v1"`, `inputAtomRefs` to (a) zoning-fact DID, (b) setback-rule DID, (c) geometry reference-field, (d) front-edge reference-field; axes per §3; no stuffed consequence.
3. **Negative fixture** — derived without `inputAtomRefs` MUST fail schema.
4. **Negative fixture** — derived with bare empty `atomDid` MUST fail.

Property entityTypes (`zoning-fact`, `setback-rule`, `buildable-envelope`) are **named in fixture comments as Phase 1b bindings**, not registered as full kinds in 1.8.0. The primitive must validate without those kinds existing.

### 2.4 Link vocabulary note

Document (comment + CHANGELOG) a semantic edge name `derives-from` already used in `./og/common.ts`. The typed `inputAtomRefs` ARE the contract-level expression of that edge for derived reasoning; graph engines remain free to materialize edges. No change to `AtomComposition`.

---

## 3. Design — 2.5.2 Consequence axis for non-life-safety

### 3.1 Ruling (binary)

**Do NOT** make `ThreeAxisConfidence.consequence` optional. That would break every existing read-contract emitter/fixture that requires three axes.

**DO** introduce an additive alternate axes shape for reasoning-family atoms:

```typescript
/** Existing — unchanged. Life-safety / code-risk surfaces keep using this. */
// ThreeAxisConfidence { calibrated, asserted, consequence: ConsequenceAxis }

/**
 * For property / envelope / non-life-safety reasoning atoms.
 * Consequence is either an honest property-risk stratum OR explicitly
 * not-applicable — never a stuffed ASCE7/IBC value.
 */
export type PropertyConsequence =
  | {
      kind: "property-risk";
      stratum: "routine" | "elevated" | "critical"; // no "essential" invent
      /** Honest basis: e.g. "flood-sfha", "no-buildable-area", "setback-constrained". */
      basis: string;
      assertedAt: string;
      auditRef?: string;
    }
  | {
      kind: "not-applicable";
      reason: string; // e.g. "envelope-geometry-derivation-has-no-life-safety-stratum"
      assertedAt: string;
    };

export interface ReasoningThreeAxisConfidence {
  readonly calibratedConfidence: WidthedConfidence;
  readonly assertedConfidence: WidthedConfidence;
  readonly consequence: PropertyConsequence;
}
```

Envelope fixture uses `kind: "not-applicable"` with an explicit reason. Flood-adjacent fact atoms MAY use `kind: "property-risk"` with an honest basis. Stuffing `ConsequenceAxis` with fake ASCE7 category I to pass old schema = **FAIL** (negative-done-line).

### 3.2 Read-contract assembly

`ReadContract` today requires `axes: ThreeAxisConfidence`. Additive path:

- Keep `ReadContract` as-is for existing consumers.
- Add `ReasoningReadContract` with `axes: ReasoningThreeAxisConfidence` + same `assembledAt` / optional `modelAttribution`.
- Conformance helper `validateReasoningReadContract`.
- Document: property Phase 1b emitters use `ReasoningReadContract`; life-safety / ICC code-risk surfaces keep `ReadContract`.

---

## 4. Design — 2.5.3 Provenance + tier decomposition

No new `{source, vintage, verificationState}` triple. Map the plan's informal triple onto **real 1.7.0 fields**:

| Plan informal field | Real contract field | Notes |
|---|---|---|
| source | `sourceCitation: string` (+ optional `sourceAdapter` where family-local) | Required on reasoning instances |
| vintage | `extractedAt: string` (ISO) + optional `asOf?: string` | Same as O&G quality gate |
| verificationState | `WidthedConfidence.provenance` (`asserted` \| `backtest` \| `seed` \| `live`) on asserted/calibrated axes | Match-basis (exact/prefix/fallback) lives in asserted estimate + `citationLabel` / derivation notes — NOT a parallel enum |
| LLM-authored step | `modelAttribution?: ModelAttributionStamp` on read-contract | Already shipped |
| signed-history applicability | `AtomTier`: `"data"` \| `"app"` | **zoning-fact / setback-rule / buildable-envelope ⇒ `data`** (signed history required). Bake orchestration containers stay `app` if introduced later. |

Helper (optional, publish): `assertReasoningProvenance(instance)` — fails if `sourceCitation` or `extractedAt` missing on data-tier reasoning instances.

---

## 5. Design — 2.5.4 Source-obligation + ICC test account (REWORKED — Gate B round 2)

### 5.0 Correction (anti-zombie)

Round-1 design proposed net-new `SourceLicensingTerms` + `SourceAttribution` as the obligation/attribution model. That **duplicates** the shipped core type:

```
src/obligation.ts — ObligationAtomInstance (ADR-025, "domain-neutral from birth")
  obligationType / owedToActorDid? / anchorDid / status (engine-derived)
  / sourceCitation / confidence / accessPolicy
```

Exported from the main barrel today (`OBLIGATION_SCHEMA`, `OBLIGATION_TYPES`, …) and re-exported from `./og`. Live fixture pattern already uses `owedToActorDid: "actor_lessor_001"` (string actor id — the typed `actor-record` target was never published).

**Ruling:** do **not** ship a second obligation model. ICC royalties are `ObligationAtomInstance` rows. Genuinely net-new publish surface = ADR-015 `actor-record` (the `owedToActorDid` target) + licensing terms **attached to that actor-record**.

### 5.1 Live re-grep (required before redesign)

Verbatim against `P:\hauska-atom-contract` @ `25215fd` / npm `1.7.0`:

| Symbol | Where |
|---|---|
| `ObligationAtomInstance` | `src/obligation.ts` — core, not `./og`-only |
| `ObligationType` | `"delay-rental" \| "shut-in-royalty" \| "minimum-royalty" \| "bonus" \| "rental" \| "lease-expiration" \| "continuous-development" \| "pugh-release" \| "other"` |
| `owedToActorDid` | optional `string` on `ObligationAtomInstance` |
| `anchorDid` | required; domain-neutral (`anchorKind?` hint) |
| `status` | `"upcoming" \| "due" \| "satisfied" \| "delinquent" \| "released"` — engine-derived |
| `actor-record` / `ActorRecord` | **ZERO** matches in `src/` |
| `SourceAttribution` / `SourceLicensingTerms` | **ZERO** (correct — must not invent as parallel obligation) |

Comment in `obligation.ts` L18–19 already says: *"additively extensible for other verticals (Mox facility obligations, etc.)."* License royalties are that extension.

### 5.2 What is ABSENT vs what is REUSED

| Piece | Action |
|---|---|
| `ObligationAtomInstance` shape | **REUSE** — zero parallel type |
| `owedToActorDid` | **REUSE** — point at ICC `actor-record.actorId` |
| `anchorDid` | **REUSE** — point at the referenced code-section / setback-rule / report atom DID |
| O&G `ObligationType` values | **UNCHANGED** |
| License royalty types | **ADDITIVE** extend `ObligationType` (existing variants are lease-shaped; `"other"` is a last-resort escape, not the ICC demo type) |
| `actor-record` | **NET-NEW** publish (ADR-015) |
| Licensing terms (rates / rev-share / meter-free / purge / derivedOk) | **NET-NEW** — fields on `actor-record` when `tenantKind === "licensed-source"` |
| Standalone `SourceAttribution` interface | **DO NOT SHIP** |
| Standalone source-obligation type / meter schema | **DO NOT SHIP** |

### 5.3 Additive `ObligationType` extension

None of the shipped O&G types name a per-reference content-license royalty. Extend additively (comment already permits other verticals):

```typescript
export type ObligationType =
  | "delay-rental"
  | "shut-in-royalty"
  | "minimum-royalty"
  | "bonus"
  | "rental"
  | "lease-expiration"
  | "continuous-development"
  | "pugh-release"
  // --- additive 1.8.0 (licensed-source / ICC) ---
  | "license-reference-royalty"  // INBOUND: every reference, free tier included (I-K)
  | "license-revenue-share"      // OUTBOUND: source cut of a paid sale
  | "other";
```

Zod `OBLIGATION_TYPES` array gains the two new literals. Existing O&G fixtures keep validating. `"other"` remains for unclassified cases — ICC demo **must not** use `"other"`.

### 5.4 How an ICC royalty is modeled (one shape, two meters)

**INBOUND (every reference, free included):** gate read path (Phase 1d) mints an `ObligationAtomInstance`:

| Field | ICC inbound value |
|---|---|
| `entityType` | `"obligation"` |
| `obligationType` | `"license-reference-royalty"` |
| `anchorDid` | DID of the referenced atom (code-section, or setback-rule that cites it) |
| `anchorKind` | e.g. `"code-section"` / `"setback-rule"` |
| `owedToActorDid` | `did:hauska:actor:org:icc` (ICC actor-record) |
| `dueDate` | billing-period end or reference timestamp (ISO) — required by schema today |
| `recurrence` | `"per-reference"` |
| `amount` | from `actor-record.sourceLicensing.perReferenceRateMinor` when set; **omit** when rate pending |
| `status` | engine-derived (`upcoming` → `due` → `satisfied`); never hand-asserted |
| `confidence` | `WidthedConfidence` (asserted until settlement backtest) |
| `sourceCitation` | license / book+section citation string |
| `accessPolicy` | `platform-internal` (obligation ledger is not a public catalog atom) |

When rates are unset: still mint the obligation with `amount` omitted and `graceTerms: "pending-rate"` — **countable accrual, never silent zero** (I-K).

**OUTBOUND (paid sale):** mint `obligationType: "license-revenue-share"`, `anchorDid` = sold report / paid atom DID, `amount` derived from sale × `actor-record.sourceLicensing.revShareBps`. RevenueRouter (Gate D) settles; until SDK maps `owedToActorDid` → its provisional `SourceActorReference`, status may remain `upcoming` / ledger `pending-routing` — honest degrade, not a second model.

### 5.5 Net-new: `actor-record` + licensing terms on the actor

New file: `src/actor-record.ts`, main barrel export. This is the typed target `owedToActorDid` has been waiting for.

```typescript
export type ActorType = "person" | "agent" | "organization";
export type ActorTrustLevel =
  | "verified-human"
  | "verified-org"
  | "known-agent"
  | "unverified";

export type OrganizationTenantKind =
  | "city"
  | "firm"
  | "enterprise-customer"
  | "internal"
  | "public"
  | "licensed-source"; // additive vs ADR-015 list — ICC / code partners / parcel licensors

/**
 * Commercial terms for a licensed-source organization.
 * NOT an obligation record — rates the meter reads when minting
 * ObligationAtomInstance rows owed to this actor.
 */
export interface ActorLicensingTerms {
  perReferenceRateMinor?: number;
  currency?: string; // default USD
  revShareBps?: number;
  licenseRef: string;
  meterFreeTier: boolean;      // ICC: true
  purgeOnWindDown: boolean;    // ICC: true
  derivedOk: boolean;          // ICC: false (no public calibration pool)
}

export interface ActorRecordAtomInstance {
  entityType: "actor-record";
  actorId: string; // DID — this is what ObligationAtomInstance.owedToActorDid holds
  actorType: ActorType;
  displayName: string;
  trustLevel: ActorTrustLevel;
  accessPolicy: AccessPolicy;
  agentVersion?: string;
  producerSurface?: string;
  principalActor?: string;
  tenantKind?: OrganizationTenantKind;
  jurisdictionalScope?: string;
  /** Required when tenantKind === "licensed-source". */
  sourceLicensing?: ActorLicensingTerms;
  sourceCitation?: string;
  extractedAt?: string;
}
```

Zod refine: `tenantKind === "licensed-source"` ⇒ `sourceLicensing` present with `licenseRef` + `meterFreeTier` + `purgeOnWindDown` + `derivedOk`.

Naming: `ActorLicensingTerms` (on the actor) — **not** `SourceAttribution`, **not** a parallel obligation type. Round-1 name `SourceLicensingTerms` retired to avoid implying a second obligation package.

### 5.6 How the gate knows an atom is ICC-sourced (no SourceAttribution type)

Do **not** publish a `SourceAttribution` interface. Identity for metering:

1. **Preferred at mint time (Phase 1d):** corpus / adapter stamps that produce ICC code-section atoms also know the ICC `actorId`; the gate mints `ObligationAtomInstance` with `owedToActorDid` = that DID and `anchorDid` = the served atom. The obligation row IS the durable "this reference owed ICC" record.
2. **Optional thin actor-link (only if Phase 1d needs a field on the content atom):** a single optional `sourceActorDid?: string` on content families — ADR-015 actor-link identity only, no licensing blob, no obligation fields. If added, it lives on the property/code kind schemas in Phase 1b, **not** as a 1.8.0 standalone `SourceAttribution` module. Default for 1.8.0: **omit**; fixtures demonstrate via obligation → actor edges only.
3. **Purge / wind-down grain (book+section):** already carried by code-section identity + `sourceCitation` on the code atom itself (existing corpus). Obligation `sourceCitation` mirrors it for the accrual row.

### 5.7 ICC fixtures (test account)

**A. `ICC_ACTOR_RECORD_FIXTURE`**

| Field | Value |
|---|---|
| entityType | `actor-record` |
| actorId | `did:hauska:actor:org:icc` |
| actorType | `organization` |
| displayName | `International Code Council` |
| trustLevel | `verified-org` |
| tenantKind | `licensed-source` |
| accessPolicy | `platform-internal` |
| sourceLicensing.licenseRef | `icc-code-connect-poc` |
| sourceLicensing.meterFreeTier | `true` |
| sourceLicensing.purgeOnWindDown | `true` |
| sourceLicensing.derivedOk | `false` |
| sourceLicensing.perReferenceRateMinor / revShareBps | omit until commercial rates set |

**B. `ICC_LICENSE_REFERENCE_OBLIGATION_FIXTURE`** (proves reuse of shipped obligation shape)

| Field | Value |
|---|---|
| entityType | `obligation` |
| obligationDid | `oblg_<16-hex>` conforming |
| obligationType | `license-reference-royalty` |
| anchorDid | stub code-section DID |
| anchorKind | `code-section` |
| owedToActorDid | `did:hauska:actor:org:icc` |
| dueDate | fixture ISO date |
| recurrence | `per-reference` |
| amount | omit (pending-rate) |
| graceTerms | `pending-rate` |
| status | `upcoming` |
| accessPolicy | `platform-internal` |
| sourceCitation / extractedAt / confidence | required per existing schema |

**C. Negative fixture:** `license-reference-royalty` with empty/missing `owedToActorDid` fails a **new** refine (licensed-source obligation types require `owedToActorDid`). O&G types keep `owedToActorDid` optional as today.

### 5.8 SDK seam (Phase 1d / Gate D — not this bump)

```typescript
// Map ObligationAtomInstance.owedToActorDid → provisional SourceActorReference
// { id: actorDid, type: "atom", ref: actorDid } until SDK adopts actorDid natively.
// Rates / rev-share read from actor-record.sourceLicensing — not from a parallel type.
```

Outbound may `pending-routing` until that map lands. **Inbound obligation minting is NOT deferrable** once ICC-cited codes serve at volume (I-K) — Phase 1d implements mint-on-read against this 1.8.0 surface.

### 5.9 Two meters (corrected)

| Meter | Contract 1.8.0 | Runtime |
|---|---|---|
| INBOUND | `ObligationType: "license-reference-royalty"` + `owedToActorDid` + rates on `actor-record.sourceLicensing` | Phase 1d gate mints `ObligationAtomInstance` on every reference (free included when `meterFreeTier`) |
| OUTBOUND | `ObligationType: "license-revenue-share"` + `revShareBps` on actor | Gate D / RevenueRouter settles; honest `pending-routing` until SDK maps DID |

---

## 6. Package / export / CHANGELOG plan

### 6.1 `package.json` exports (additive)

```json
"./reasoning": { "types": "./dist/reasoning/index.d.ts", "import": "./dist/reasoning/index.js" }
```

Main barrel also exports reasoning-chain + actor-record symbols (like existing `obligation`). **No** `source-attribution` export.

### 6.2 Files to add / touch (implementation checklist for post-Gate-B executor)

- `src/reasoning-chain.ts` + tests
- `src/reasoning/index.ts` (re-export subpath)
- `src/actor-record.ts` + tests (`ActorRecordAtomInstance`, `ActorLicensingTerms`)
- `src/obligation.ts` — additive `ObligationType` literals + refine requiring `owedToActorDid` for license-* types (O&G unchanged)
- `src/read-contract/reasoning-axes.ts` (`PropertyConsequence`, `ReasoningThreeAxisConfidence`, `ReasoningReadContract`)
- `src/reasoning/fixtures.ts` + ICC actor + ICC obligation fixtures + conformance wiring
- `CHANGELOG.md` `[1.8.0]` section
- bump `package.json` version to `1.8.0`
- **Do not** ship `src/source-attribution.ts`
- **Recommendation:** introduce `REASONING_CONFORMANCE_TARGET_VERSION = "1.8.0"` beside existing `ATOM_CONFORMANCE_TARGET_VERSION` (`1.5.0`); leave the latter unchanged

### 6.3 Backward-compat matrix

| Consumer | Risk | Mitigation |
|---|---|---|
| `./og` / core `obligation` | Low | Additive `ObligationType` only; existing O&G fixtures green |
| `./encumbrances` | Low | Untouched |
| `./temporal` (`AtomFamily: "derived"`) | Low | Label only; do not overload |
| `ThreeAxisConfidence` / life-safety | **None** if consequence requiredness unchanged | Additive `ReasoningThreeAxisConfidence` only |
| Existing `^1.7.0` installs | None until they import new symbols | Minor bump |
| SDK `SourceActorReference` | Medium (seam rename later) | Map from `owedToActorDid` in Phase 1d; provisional shape remains valid |

---

## 7. Adversarial self-review (attack this design)

| Attack | Response |
|---|---|
| "This is inventing a second confidence model" | No — reuses `WidthedConfidence` + calibrated/asserted; only replaces stuffed life-safety consequence with honest property/N/A. |
| "This invents a second obligation model" | **Fixed in round 2** — reuses `ObligationAtomInstance`; only adds `ObligationType` variants + `actor-record` + `ActorLicensingTerms` on the actor. |
| "Shipping actor-record in 0.5 is scope creep" | ADR-015 accepted May 2026 and never published; `owedToActorDid` is already on the obligation schema with nowhere typed to point. |
| "Just use ObligationType other for ICC" | Rejected for the demo/test account — `"other"` hides the meter semantics; additive types are what the file comment invites. |
| "Property kinds belong in 1.8.0" | Rejected — kinds need StoragePort write+retrieval-serve (Gate A Option A hard bar on 3.1 before 1b). |
| "Making consequence optional on ThreeAxisConfidence is simpler" | Rejected — breaks life-safety consumers. |
| "Inbound without rates is fake" | Mint `ObligationAtomInstance` with `amount` omitted + `graceTerms: pending-rate`; never silent zero. |
| "composition already covers reasoning" | Live code says render-only; fan + Gate A confirmed. |

---

## 8. Grades claimed for Gate B round 2 (design; publish NOT done)

| Item | Design grade | Publish grade |
|---|---|---|
| 2.5.1 Reasoning-chain primitive | **APPROVED** (round 1) | **NOT STARTED** |
| 2.5.2 Consequence ruling | **APPROVED** (round 1) | **NOT STARTED** |
| 2.5.3 Provenance decomposition | **APPROVED** (round 1) | **NOT STARTED** |
| 2.5.4 Source-obligation + ICC | **REWORKED — awaiting round-2 verify** (reuse `ObligationAtomInstance`; net-new = `actor-record` + `ActorLicensingTerms` + additive license `ObligationType`s) | **NOT STARTED**; inbound mint runtime = Phase 1d |

Negative-done-line: no publish has stuffed consequence or silent source liability — N/A until publish. Round-1 zombie (second obligation model) is removed from the design.

---

## 9. Implementation sequence AFTER Gate B round-2 go (not now)

1. Fresh tmp clone `hauska-atom-contract` @ `origin/main` (`25215fd` baseline).
2. Branch `feat/reasoning-chain-1.8.0`.
3. Land types + zod + fixtures + tests; CI green on PR.
4. Adversarial review of PR against this design (confirm zero `SourceAttribution` module; og obligation fixtures still green; license types require `owedToActorDid`).
5. Merge; tag `v1.8.0`; tag-push publish.
6. Planner verifies live: `npm view @empressaio/atom-contract version` → `1.8.0` (verbatim).
7. Then Phase 1a StoragePort (hard bar: durable-write-PLUS-retrieval-serve on one family) — **not** Phase 1b kinds.

---

## 10. Stop

**GATE B round 2.** Do not open the contract PR or publish until the reviewing doc_repo planner re-verifies §5 against live `obligation.ts` and the operator gives go.
