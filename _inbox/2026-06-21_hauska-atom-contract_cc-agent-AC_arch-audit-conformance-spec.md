---
id: 2026-06-21_hauska-atom-contract_cc-agent-AC_arch-audit-conformance-spec
title: cc-agent-AC — architecture-homes phase 1 conformance target + export shape
date: 2026-06-21
repo: hauska-atom-contract
agent: cc-agent-AC
tasks: [Track D atom contract, conformance target spec, downloadable-atom export, npm pin 1.5.0]
dispatch: Architecture-homes phase 1 audit/cleanup — no new product features
related: [architecture_homes_atoms, architecture_homes_mcp_gate, architecture_homes_audit_sequence]
---

# Close — architecture-homes phase 1 conformance target + export shape (cc-agent-AC)

## Summary

Authored the **atom conformance target** (read-contract + accessPolicy + signed-history for data-level atoms) as a runtime validator and Vitest suite in `@hauska/atom-contract`. Authored the **downloadable-atom export shape** as a contract type for the gate atom-export tool (cc-agent-M) and operator console. Pinned **`ATOM_CONFORMANCE_TARGET_VERSION = "1.5.0"`** as the semver every consumer co-bumps to.

**Publish status:** `@hauska/atom-contract@1.5.0` is **live on npm** (2026-06-21 operator stage-publish). No pending stages.

---

## 1. Atom conformance target spec

Source: [`02_atoms_lifecycle_ownership.md`](../_architecture_homes/02_atoms_lifecycle_ownership.md) — "The conformance target."

Every atom emission, regardless of family, must carry:

| Field | Requirement | Enforcement |
|---|---|---|
| `readContract` | Three-axis object: `calibratedConfidence`, `assertedConfidence`, `consequence`. Each widthed axis carries `estimate`, `n`, `intervalWidth`, `provenance` (`asserted` \| `backtest` \| `seed` \| `live`). Consequence axis carries ASCE 7 / IBC classification inputs + discrete stratum. | `READ_CONTRACT_SCHEMA` via `validateAtomConformance()` |
| `accessPolicy` | Five-value union: `public-free`, `public-paid`, `platform-internal`, `tenant-private`, `tenant-shared` | `ACCESS_POLICY_SCHEMA` |
| `signedHistory` | **Data-level atoms only** (`tier: "data"`): append-only signed event chain + `verifyEventChain()` result. App-level workflow containers (`tier: "app"`) omit this layer. | `verifyEventChain()` + chain shape validation |

### Canonical type

```typescript
import type {
  AtomConformanceTarget,
  AtomTier,
  ValidateAtomConformanceInput,
} from "@hauska/atom-contract/conformance";

// Emission snapshot every family must satisfy at read/export time:
interface AtomConformanceTarget {
  conformanceTargetVersion: "1.5.0";
  tier: AtomTier; // "data" | "app"
  readContract: ReadContract;
  accessPolicy: AccessPolicy;
  signedHistory?: {
    events: ReadonlyArray<AtomEvent>;
    verifyChain: VerifyChainResult;
  };
}
```

### Validator API

Import path: `@hauska/atom-contract/conformance`

| Export | Purpose |
|---|---|
| `ATOM_CONFORMANCE_TARGET_VERSION` | Pin constant (`"1.5.0"`) — co-bump semver |
| `validateAtomConformance(input)` | Runtime validator; returns `{ ok, errors[], target? }` |
| `verifyEventChain(events)` | SHA-256 chain verification (same formula as `PostgresEventAnchoringService`) |
| `ACCESS_POLICY_SCHEMA` | Zod schema for five-value policy |
| Fixtures | `SAMPLE_DATA_CONFORMANCE_TARGET`, `SAMPLE_APP_CONFORMANCE_TARGET`, `buildValidSignedEventChain()` |

### Contract test harness

Import path: `@hauska/atom-contract/testing`

```typescript
import { describe } from "vitest";
import { runAtomConformanceTests } from "@hauska/atom-contract/testing";
import { SAMPLE_READ_CONTRACT } from "@hauska/atom-contract/read-contract";

describe("code-section conformance", () => {
  runAtomConformanceTests("code-section", {
    tier: "data",
    readContract: SAMPLE_READ_CONTRACT,
    accessPolicy: "public-free",
    signedHistory: { events: mySignedEvents },
  });
});
```

Existing `runAtomContractTests()` (registration four-layer shape) remains unchanged; conformance is additive.

---

## 2. Downloadable-atom export shape

Source: doc 02 — "The downloaded atom" and doc 03 — gate `atom-export` tool.

Import path: `@hauska/atom-contract/export`

The portable audit unit returned by gate export and console download:

```typescript
interface DownloadableAtom {
  exportVersion: "1.5.0";           // matches ATOM_CONFORMANCE_TARGET_VERSION
  identity: {
    entityType: string;
    entityId: string;
    contentId: string;              // stable content id (hash, edition key, corpus row)
    vdaRef?: string;                  // data-level real-world entities
  };
  accessPolicy: AccessPolicy;
  contextSummary: ContextSummary;     // four-layer context + optional instance policy
  readContract: ReadContract;         // three-axis confidence
  compositionReferences: AtomReference[];
  citations: DownloadableAtomCitation[];
  signedEventChain: AtomEvent[];
  verifyChain: VerifyChainResult;
  exportedAt: string;                 // ISO-8601 assembly timestamp
}

interface DownloadableAtomCitation {
  citationDid: string;
  label?: string;
  sourceCitation?: string;
  citedAtom?: AtomReference;
}
```

| Export | Purpose |
|---|---|
| `createDownloadableAtom(input)` | Assemble export bundle; runs conformance + verify-chain before return |
| `isDownloadableAtom(value)` | Runtime wire guard for gate/console payloads |
| `DOWNLOADABLE_ATOM_IDENTITY_SCHEMA` | Zod identity shape |
| `DOWNLOADABLE_ATOM_CITATION_SCHEMA` | Zod citation shape |

**AccessPolicy gate:** export respects policy — tenant exports own `tenant-private` atoms plus public atoms composed by reference; never another tenant's private data (enforcement lives in gate/cc-agent-M; shape is policy-aware via `accessPolicy` field).

---

## 3. Package surface (new subpaths)

| Subpath | Version | Contents |
|---|---|---|
| `@hauska/atom-contract/conformance` | 1.5.0 | Conformance target validator, verify-chain, fixtures |
| `@hauska/atom-contract/export` | 1.5.0 | `DownloadableAtom` type, `createDownloadableAtom`, guards |
| `@hauska/atom-contract/read-contract` | 1.4.0+ | Three-axis read-contract (unchanged API) |
| `@hauska/atom-contract/testing` | 1.5.0 | + `runAtomConformanceTests()` |

Main barrel unchanged — existing consumers unaffected until opt-in.

---

## 4. Pinned conformance-target version

```typescript
export const ATOM_CONFORMANCE_TARGET_VERSION = "1.5.0" as const;
```

**Consumer install pin (after npm publish):**

```bash
npm install @hauska/atom-contract@^1.5.0
```

---

## 5. Publish status

| Version | npm registry | Status |
|---|---|---|
| 1.4.0 | Live | superseded |
| 1.5.0 | **Live** | conformance + export + widthed encumbrance/workspace |

Registry check (2026-06-21, post-publish):

```text
npm view @hauska/atom-contract version
1.5.0

npm stage list @hauska/atom-contract
No staged versions of package name "@hauska/atom-contract".
```

Published tarball shasum: `1422fb5da8e3692d1ee551340f18509a4ac409f1`

**Consumer pin:**

```bash
npm install @hauska/atom-contract@^1.5.0
```

---

## 6. Co-bump list (pin `@hauska/atom-contract@^1.5.0`)

Every repo adopting conformance validation or downloadable-atom export co-bumps together.

### Phase-1 unblock targets (E, C, M, map)

| Consumer | Current pin | Owner | Co-bump scope |
|---|---|---|---|
| **hauska-mcp-server** | `^1.4.0` | cc-agent-M | `atom-export` tool shape, `get_atom` read-contract, conformance validation on catalog reads |
| **legacy-design-tools** (cortex-api) | vendor `1.4.0.tgz` | cc-agent-C | OpenAPI honesty envelope, encumbrance/workspace widthed confidence, export endpoint |
| **hauska-engine** (`atom-contract-pin`, `atoms`, `workspace`) | `^1.3.0` | cc-agent-E | Atom registry validation, encumbrance family conformance audit |
| **hauska-map** | file `1.5.0.tgz` | map-agent | Console download render against `DownloadableAtom` |
| **hauska-brief-extension** | `^1.4.0` | extension | Brief read-contract envelope migration |
| **Cortex / legacy-design-tools-r** | `^1.1.0` / vendor tgz | cc-agent-R | Read-contract UI surfaces |

### Conformance audit families (Track A — per-family `runAtomConformanceTests`)

| Family | Tier | Signed history | Remediation path |
|---|---|---|---|
| Corpus (code-section, code-edition, jurisdiction-corpus, …) | data | required | Re-mint via rebuilt snapshot |
| Encumbrances (recorded-instrument, restriction-clause, …) | data | required | Conformance-migrate + backfill |
| Workspace (property-workspace, brief-run, …) | app | skip | Conformance-migrate in place |
| Reasoning atoms | data | required | Conformance-migrate + backfill |
| Arrow-two (finding, decision-event, …) | data | required | Conformance-migrate + backfill |
| Site (site-topography, site-drainage) | data | required | Conformance-migrate + backfill |
| L-surface deliverables | data | required | Conformance-migrate + backfill |
| User-generated parcel/project cluster | app + data refs | mixed | Tenant-private workspace (app); public facts by reference (data) — **tenant leg (sprint 54) blocks owner-isolation audit items** |

---

## 7. Files changed

| File | Change |
|---|---|
| `src/conformance/common.ts` | Pin version, accessPolicy schema, AtomTier |
| `src/conformance/verify-chain.ts` | `verifyEventChain()` |
| `src/conformance/validate.ts` | `validateAtomConformance()`, `AtomConformanceTarget` |
| `src/conformance/fixtures.ts` | Sample targets + chain builder |
| `src/conformance/index.ts` | Subpath barrel |
| `src/conformance/__tests__/conformance.test.ts` | 9 tests |
| `src/export/downloadable-atom.ts` | `DownloadableAtom`, `createDownloadableAtom()` |
| `src/export/index.ts` | Subpath barrel |
| `src/export/__tests__/export.test.ts` | 3 tests |
| `src/testing/index.ts` | `runAtomConformanceTests()` |
| `package.json` | `./conformance`, `./export` exports; version `1.5.0` |
| `CHANGELOG.md` | 1.5.0 conformance + export entry |

---

## 8. Unblocked

| Agent | What this unblocks |
|---|---|
| **cc-agent-M** | `atom-export` MCP tool can return `DownloadableAtom` from `@hauska/atom-contract/export` |
| **cc-agent-C** | cortex-api export endpoint + read-contract propagation against typed export shape |
| **cc-agent-E** | Per-family conformance audit via `validateAtomConformance()` + `runAtomConformanceTests()` |
| **map-agent** | Console download render against `DownloadableAtom`; already on local 1.5.0 tgz |

---

## 9. Blockers

| Blocker | Owner | Notes |
|---|---|---|
| Tenant-leg (sprint 54) | platform | Tenant-family ownership/isolation conformance items must be marked blocked in Track A audit matrix |
| Family backfill | E + C | Mutable families need conformance-migrate; corpus re-mint rides snapshot rebuild |

---

## 10. Acceptance criteria

- [x] Conformance target spec documented and encoded as `validateAtomConformance()`
- [x] Vitest harness (`runAtomConformanceTests`) ships on `./testing`
- [x] `DownloadableAtom` export type ships on `./export`
- [x] `ATOM_CONFORMANCE_TARGET_VERSION` pinned to `"1.5.0"`
- [x] Co-bump list documented for E, C, M, map
- [x] `@hauska/atom-contract@1.5.0` live on npm
