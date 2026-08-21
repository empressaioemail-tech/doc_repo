# Phase D — PE serve-path fix + superseded cohort (2026-08-03)

## Problem 1 root cause (141364 R6 staleness)

**Not** not-warmed-yet. **Not** no-zoning-fact-stamp.

Chain of failure:

1. Substrate has **stale** `setback-rule` (`descriptor-fixture`, 2026-07-30) **and** fresh `buildable-envelope` with `warmVerifyDeclineCode: superseded-prop-id` (2026-08-03 warm).
2. Retrieval `getPropertyAtomChain` R27: stale Bastrop setback suppression **nulled both** stale rule **and** buildable-envelope — including warm honest-decline envelopes that are NOT dependents of the stale rule.
3. PE adapter received chain with `setbackRule: null`, `buildableEnvelope: null`, MU district present → mapped to generic **`setback-rule-pending`** with `snapshotAt` from zoning-fact (2026-07-23).

**Fix (two layers):**

| Repo | Change |
|------|--------|
| `hauska-engine` `@hauska-engine/retrieval` | `envelopeServeIndependentOfStaleSetback()` — warm declines + depth-warm promotes survive R27 suppression |
| `hauska-map` `atom-chain-to-facets.ts` | `mapWarmVerifyDeclineEnvelope()` before `setback-rule-pending` fallback |

Tests: retrieval `r27-warm-decline-survives-stale-setback.test.ts` (3/3); PE `atom-chain-to-facets.test.ts` 141364 fixture (19/19 file).

**Live verify gate:** deploy retrieval-api + property-explorer; re-curl `48021:141364` must show `declineReason: superseded-prop-id`, `snapshotAt: 2026-08-03*`. **Do NOT merge PR #213 until live pass.**

## Problem 2 — cadastral-currency cohort (layer-23 roster ∩ ¬BCAD)

Quantified 2026-08-03 via `loadDominantDistrictRoster` + BCAD batch query:

| Block | Roster unique | BCAD present | Superseded | Notes |
|-------|---------------|--------------|------------|-------|
| SF-1 | 2383 | 2353 | **30** | incl. prop_id `0` artifact |
| GC | 743 | 734 | **9** | |
| MU | 440 | 430 | **10** | **141364** in set |
| RR | 630 | 624 | **6** | |
| PI | 195 | 194 | **1** | |
| IND | 88 | 86 | **2** | |
| **Σ** | **4479** | **4421** | **58** | prop_id `0` repeats per block |

**v1 PASS doctrine:** named `superseded-prop-id` honest decline is acceptable; bare `setback-rule-pending` is NOT.

**R15 re-key to successor prop_ids:** tracked follow-up (enumerate-all-successors) — not in scope for this close; warm already writes honest decline.

**Zero-pending target reframed:** zero **bare** pending — every non-served parcel carries a **named** decline (superseded / PDD / null / landlocked / etc.).

## Evidence — 141364 substrate (unchanged)

```
zoning-fact: MU (2026-07-30)
setback-rule: descriptor-fixture STALE (2026-07-30) — suppressed at read
envelope: warmVerifyDeclineCode=superseded-prop-id (2026-08-03T15:11:03)
BCAD: absent | txgio: present (1101 Pine St)
```

## Block-13

7/7 CERT-RESTORE ELIGIBLE on `feat/phase-d-layer23-cohort` branch (unchanged).
