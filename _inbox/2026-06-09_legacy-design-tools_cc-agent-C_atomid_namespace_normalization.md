---
id: 2026-06-09_legacy-design-tools_cc-agent-C_atomid_namespace_normalization
date: 2026-06-09
agent: cc-agent-C
repo: legacy-design-tools
branch: lineage/atomid-namespace-normalization
dispatch: 2026-06-09_cc-agent-C_atomid_namespace_normalization
status: break-point
model: Grok Build 0.1 (HR-12)
---

# Break-point report — canonical atom-id key function (P0b)

## Workspace gate

Started from merged main (`7cc7022`, codewarm harness PR #157). Branch `lineage/atomid-namespace-normalization` off `origin/main`. Submodule dirt only (non-blocking).

---

## Recon — three id forms, four sites

| Form | Example | Producer | Consumer |
|---|---|---|---|
| Corpus UUID | `550e8400-e29b-41d4-a716-446655440000` | `findings.ts` → `toCodeSectionInput` (`atomId: a.id`); `brokerageBrief.ts` → `citations[].atomDid` | Adjudication ledger, overlay lookup |
| Hauska code-section DID | `did:hauska:code-section:{uuid}` | MCP engine tools; `brokerageBriefAtoms.ts` → `buildCodeSectionDid` | Brief `inlineRefs`, MCP envelopes |
| Reasoning / websearch | `reasoning:fbc-2023:fbc-m601-6`, `websearch:…` | `supplementCodeSectionsWithReasoningGrounding` | Findings citations, cold-warm overlay |

| Site | File + symbol | Before | After |
|---|---|---|---|
| Citation production | `findings.ts` → `toCodeSectionInput` | Raw `a.id` UUID | `canonicalOverlayAtomKey(a.id)` |
| Adjudication ledger join | `atomAdjudicationEvidenceLedger.ts` → `extractCodeCitationAtomIds` | Raw `citations[].atomId` | Normalized via `canonicalOverlayAtomKey` |
| Brokerage brief | `brokerageBriefAtoms.ts` → `buildBriefAtomProjection` | Mixed UUID in `entityId`; DID in `citationDid` | `entityId` canonical; `buildCodeSectionDid` → `toHauskaCodeSectionDid` |
| Phase-3 overlay lookup | `@workspace/codes` → `overlayAtomLookupKey` | N/A (new) | `(jurisdictionTenant, canonicalOverlayAtomKey)` |

Reasoning grounding unchanged — ids already `reasoning:`/`websearch:` and pass through identity.

---

## Canonical key design + export path

**Module:** `lib/codes/src/overlayAtomKey.ts`  
**Package export:** `@workspace/codes` — `canonicalOverlayAtomKey`, `overlayAtomLookupKey`, `canonicalOverlayKeyFromCodeToken`, `toHauskaCodeSectionDid`, `isReasoningOverlayAtomId`, `HAUSKA_CODE_SECTION_DID_PREFIX`

Rules:
- Corpus UUID + `did:hauska:code-section:{uuid}` → **lowercase UUID** (one overlay row)
- `reasoning:` / `websearch:` → **identity** (never collapsed into corpus)
- Other `did:` forms → pass through verbatim (non-code-section entities)

---

## Branch + SHA

| Field | Value |
|---|---|
| Branch | `lineage/atomid-namespace-normalization` |
| **Feature SHA** | `e306040b551f2b5599a0479c6582f78226d6a973` |
| PR | https://github.com/empressaioemail-tech/legacy-design-tools/pull/158 (held for operator merge) |

---

## Test output (correctness proof)

```
@workspace/codes overlayAtomKey.test.ts — 7 passed
  ✓ collapses bare UUID and did:hauska:code-section DID to the same key
  ✓ round-trips reasoning ids without collapsing into corpus keys
  ✓ round-trips websearch ids
  ✓ keystone [[CODE:reasoning:fbc-2023:fbc-m601-6]] → overlay key
  ✓ UUID and DID citations share one overlay lookup key

pnpm run typecheck — green
@workspace/finding-engine — 84 passed
```

Integration (CI): `findings-evidence-ledger.test.ts` — UUID + DID citations fan to **one** `citedAtomId` row (`acceptCount: 2`).

---

## Blockers

None. Local Postgres not required for overlay key unit tests; ledger integration runs in CI Test job.
