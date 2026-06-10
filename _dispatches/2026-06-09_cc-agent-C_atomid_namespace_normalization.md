---
id: 2026-06-09_cc-agent-C_atomid_namespace_normalization
title: Dispatch — canonical atom-id key function (overlay attribution correctness, the P0b now-fix)
date: 2026-06-09
agent: cc-agent-AC (atom-contract) + cc-agent-C (legacy-design-tools)
repo: hauska-atom-contract + legacy-design-tools
kind: dispatch
status: READY (split). The cc-agent-AC part fires now (atom-contract, independent of the harness). The cc-agent-C consumption sequences after the cold-warm harness PR merges (same clone). Load-bearing now-fix; the overlay silently misses without it, on the HTTP path too.
related: [57_national_code_warming_sprint, _decisions/2026-06-09_codewarm_arrow_two_combined, _inbox/2026-06-09_legacy-design-tools_cc-agent-C_lineage_completeness_audit, _dispatches/2026-06-07_cc-agent-C_arrow2_phase3_calibration, 20_agent_operating_rules]
---

# Canonical atom-id key function (P0b)

> The lineage audit ([`_inbox/2026-06-09_legacy-design-tools_cc-agent-C_lineage_completeness_audit.md`](../_inbox/2026-06-09_legacy-design-tools_cc-agent-C_lineage_completeness_audit.md)) proved the atom-id key-spaces diverge: Cortex findings use `code_atoms.id` UUID in `citations[].atomId`; MCP engine tools use `did:hauska:code-section:{entityId}`; the brokerage brief labels the field `atomDid` but stores a UUID. The arrow-two overlay (Phase 3) keys on atom id, so a citation can resolve at generation yet find no overlay row when key-spaces diverge (decision commitment 8). This is a correctness bug on the HTTP path today, independent of the gate, and it is the part of the decoupling bite that bites now. This dispatch makes one canonical key the single source of truth.

> **Placement correction (2026-06-09).** The gate-citation-lineage recon found `hauska-mcp-server` has no import path to `lib/codes`, so a `lib/codes`-only key function cannot be consumed by the gate without forking (forbidden). The canonical key function therefore lives in **`@hauska/atom-contract`** (the one package both legacy-design-tools and hauska-mcp-server consume), defined and published by cc-agent-AC, then consumed by cc-agent-C here and by cc-agent-M at the gate (P0a). This is the single source of truth; do not re-implement it in either consumer.

You are **cc-agent-AC** (for the atom-contract definition) and **cc-agent-C** (for the legacy-design-tools consumption). One agent per clone; coordinate the two halves, do not cross clones in one run.

## Model (HR-12)

Grok Build 0.1 default; escalate to Claude only on failure after retry, log it.

## Read first

1. The lineage audit (above) — Sections 4 and the namespace-divergence table; blockers 2.
2. [`57_national_code_warming_sprint.md`](../57_national_code_warming_sprint.md) — the overlay and the attribution-coverage gate.
3. [`20_agent_operating_rules.md`](../20_agent_operating_rules.md) — HR-1, HR-2, HR-3, HR-8, HR-11.

## Workspace ownership

Clone `P:\legacy-design-tools`, branch prefix `lineage/`. One agent per clone. Refuse alien HEAD or uncommitted state; report verbatim `git status` and `git log -3`.

## Scope

1. **Recon (report before building).** Confirm the three id forms and the sites that produce/consume them: citation production (`resolveEngineInputs` → `toCodeSectionInput` `atomId: a.id`; `supplementCodeSectionsWithReasoningGrounding` for `reasoning:`/`websearch:`); the adjudication ledger join (`atomAdjudicationEvidenceLedger.ts` → `extractCodeCitationAtomIds`); `brokerageBriefAtoms.ts` (`atomDid`, `buildCodeSectionDid`); and the (future) Phase-3 overlay lookup key.

2. **Define ONE canonical overlay key function in `@hauska/atom-contract` (cc-agent-AC, minor version bump, published).** Normalize any of the three forms to a single overlay key. Corpus atoms: `code_atoms.id` UUID and `did:hauska:code-section:{uuid}` collapse to the same key. Reasoning atoms: `reasoning:`/`websearch:` ids are distinct atoms and pass through as identity (never collapsed into a corpus key). It ships in atom-contract so both legacy-design-tools (here) and hauska-mcp-server (P0a) and Phase 3 import the same function. Single source of truth; do not fork it into either consumer. (An untracked `lib/codes/src/overlayAtomKey.ts` from a prior run is the wrong home — move the logic into atom-contract and have lib/codes import it.)

3. **Apply at all sites.** Citation production carries the canonical key; the ledger join normalizes before fanning; `brokerageBriefAtoms` normalizes `atomDid`; provide the overlay-lookup helper Phase 3 will import (do not build Phase 3 calibration here, just the key helper it will key on).

4. **Tests (the correctness proof).** A finding citing a corpus atom via the `did:hauska:code-section:{uuid}` form and the same atom via bare UUID resolve to the SAME overlay key (no silent miss). A `reasoning:`/`websearch:` id round-trips and never collides with a corpus key. An attribution assertion: the keystone `[[CODE:reasoning:fbc-2023:fbc-m601-6]]` resolves to its expected overlay key.

Out of scope: the gate-side envelope alignment (P0a, cc-agent-M consumes this function); Phase 3 calibration computation; any change to the public catalog or the engine corpus.

## Acceptance criteria

- One canonical key function, exported, the single source of truth; all four sites use it; no UUID-vs-DID mismatch can produce a missed overlay row.
- Reasoning-atom ids never collapse into corpus keys.
- Tests prove the UUID/DID equivalence, the reasoning round-trip, and the keystone resolution.
- `pnpm run typecheck` green; affected `lib/codes` + finding-engine + brokerage tests green.
- PR held for operator merge. Branch + SHA reported.

## Reporting

At break-point write to `P:\doc_repo\_inbox\` as `2026-06-09_legacy-design-tools_cc-agent-C_atomid_namespace_normalization.md`: the recon (three forms, four sites), the canonical-key design + export path, the test output proving no silent miss, PR URL + branch SHA, blockers verbatim.
