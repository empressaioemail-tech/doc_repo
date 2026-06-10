---
id: 2026-06-09_cc-agent-C_atomid_namespace_normalization
title: Dispatch — canonical atom-id key function (overlay attribution correctness, the P0b now-fix)
date: 2026-06-09
agent: cc-agent-C
repo: legacy-design-tools
kind: dispatch
status: MERGED - PR #158, `lib/codes` / `@workspace/codes` `canonicalOverlayAtomKey`. The HTTP-path overlay now-fix is closed. Report: `_inbox/2026-06-09_legacy-design-tools_cc-agent-C_atomid_namespace_normalization.md`.
related: [57_national_code_warming_sprint, _decisions/2026-06-09_codewarm_arrow_two_combined, _inbox/2026-06-09_legacy-design-tools_cc-agent-C_lineage_completeness_audit, _dispatches/2026-06-07_cc-agent-C_arrow2_phase3_calibration, 20_agent_operating_rules]
---

# Canonical atom-id key function (P0b)

> The lineage audit ([`_inbox/2026-06-09_legacy-design-tools_cc-agent-C_lineage_completeness_audit.md`](../_inbox/2026-06-09_legacy-design-tools_cc-agent-C_lineage_completeness_audit.md)) proved the atom-id key-spaces diverge: Cortex findings use `code_atoms.id` UUID in `citations[].atomId`; MCP engine tools use `did:hauska:code-section:{entityId}`; the brokerage brief labels the field `atomDid` but stores a UUID. The arrow-two overlay (Phase 3) keys on atom id, so a citation can resolve at generation yet find no overlay row when key-spaces diverge (decision commitment 8). This is a correctness bug on the HTTP path today, independent of the gate, and it is the part of the decoupling bite that bites now. This dispatch makes one canonical key the single source of truth.

> **Resolved (2026-06-09). `lib/codes` is the correct home; the atom-contract detour was unnecessary.** The gate-citation-lineage recon worried the gate could not import a `lib/codes` function, but the gate does not need to: P0b normalizes citations at write time (`toCodeSectionInput`), so `findings.citations[].atomId` is already canonical in the stored rows. The gate (P0a) is a reader of those rows and returns them verbatim; the overlay lookup stays server-side in Phase 3 (cortex-api imports `@workspace/codes`). The "gate imports the function" requirement was an over-specification in the earlier draft and is withdrawn. Shipped as PR #158.

You are **cc-agent-C**, single owner of the `legacy-design-tools` clone.

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

2. **Define ONE canonical overlay key function in `lib/codes`, exported from `@workspace/codes`.** Normalize any of the three forms to a single overlay key. Corpus atoms: `code_atoms.id` UUID and `did:hauska:code-section:{uuid}` collapse to the same key (lowercase UUID). Reasoning atoms: `reasoning:`/`websearch:` ids are distinct atoms and pass through as identity (never collapsed into a corpus key). All in-repo consumers (citation production, ledger join, brokerage projection, the Phase-3 overlay lookup helper) import it. The gate does not import it; it reads already-canonical stored citations. [Shipped: `canonicalOverlayAtomKey`, `overlayAtomLookupKey`, `toHauskaCodeSectionDid`, `isReasoningOverlayAtomId`.]

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
