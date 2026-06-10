---
id: 2026-06-09_legacy-design-tools_cc-agent-C_lineage_completeness_audit
title: Lineage-completeness audit across all emission surfaces
date: 2026-06-09
agent: cc-agent-C
repo: legacy-design-tools (cross-repo read: hauska-mcp-server, hauska-brief-extension)
kind: recon
status: complete
related: [57_national_code_warming_sprint, 04a_arrow_two_calibration_capture, _decisions/2026-06-09_codewarm_arrow_two_combined, 50_hauska_mcp_server, 55_spine_data_intelligence_stack, 20_agent_operating_rules]
---

# Lineage-completeness audit across all emission surfaces

Read-only recon across `legacy-design-tools`, `hauska-mcp-server`, and `hauska-brief-extension`. Frame: arrow-two can only return a deposit where the outbound emission carried an attributable atom id (corpus UUID, `reasoning:…`, or `websearch:…`). Surfaces that emit code citations without that lineage are arrow-one-only withdrawal and cannot become deposits.

**Headline:** Cortex findings (HTTP wire) are the only surface with end-to-end structured code-citation lineage today. Every other surface is partial or arrow-one-only at the MCP gate. The highest-severity gaps are (1) no MCP tool returns completed findings with `citations[].atomId`, (2) brokerage brief uses a different id namespace than the findings ledger, and (3) `briefing-source` citations are attributable for site-context but not for code-section calibration deposit.

---

## Surface-by-surface table

| # | Surface | Emits citations? | Carries attributable atom id? | File + symbol of record | Gap |
|---|---------|------------------|-------------------------------|-------------------------|-----|
| 1 | **Cortex findings** (plan-review engine + HTTP wire) | **Y** | **Y** (code-section); **partial** (briefing-source) | `lib/finding-engine/src/engine.ts` → `finalizeDrafts`; `artifacts/api-server/src/routes/findings.ts` → `toWire`; `lib/finding-engine/src/citationAdapter.ts` → `validateInlineCitations` | Code citations carry `findings.citations[].atomId` (corpus UUID or `reasoning:`/`websearch:` id). Briefing-source citations carry `id` not `atomId` — excluded from adjudication ledger (`extractCodeCitationAtomIds`). Token-stripping silently drops unresolvable `[[CODE:…]]` tokens; run row mirrors count on `invalidCitationCount`. |
| 2 | **Codex** (reviewer UI + 4 MCP tools) | **Y** (UI); **partial** (MCP) | **Y** (UI via HTTP); **partial** (MCP) | UI: `artifacts/codex-reviewer-qa/src/lib/findings.ts` → `citationLabel`; `artifacts/codex-reviewer-qa/src/components/FindingCard.tsx`. MCP: `hauska-mcp-server/src/tools.ts` → `codex_*` handlers; `hauska-mcp-server/src/atom-shape.ts` → `codexProvenance` | Reviewer reads `GET /api/submissions/:id/findings` — full `citations[]` with atom ids. MCP `codex_finding_generation` returns only `generationId` + synthetic `legacy:finding-generation-run:…` provenance — **no findings, no citations**. `codex_briefing_fetch` returns narrative text with inline tokens but no structured per-citation atom array. `codex_override_write` returns override row, not cited atoms. No separate “building-code-lookup” Codex surface exists beyond corpus retrieval via public MCP tools. |
| 3 | **MCP tools (gate)** — 46 tools in `hauska-mcp-server/src/tools.ts` | **subset** | **partial** | `hauska-mcp-server/src/tools.ts` → `registerTools`; `hauska-mcp-server/src/atom-shape.ts` → envelope builders | See MCP breakdown below. Tools that emit code citations in `data` carry atom ids on only a subset; Codex/Cortex job-kickoff tools strip citation payload entirely. |
| 4 | **Brief extension** (`POST /api/brokerage/v1/brief` + extension ingress) | **Y** | **partial** | API: `artifacts/api-server/src/routes/brokerageBrief.ts` → `runCodeRetrieval`, response body; `artifacts/api-server/src/lib/brokerageBriefAtoms.ts` → `buildBriefAtomProjection`. Extension: `hauska-brief-extension/src/lib/inline-atoms.js` → `inlineRefsFromBrief`; `hauska-brief-extension/src/lib/reasoning-summary.js` → `citeLink` | `citations[].atomDid` is the **corpus UUID** (`RetrievedAtom.id` from `lib/codes/src/retrieval.ts`), not a `did:hauska:…` DID. `atoms.inlineRefs` and `atoms.citationRefs` wrap UUIDs into `did:hauska:code-section:{uuid}` via `buildCodeSectionDid`. Prose (`laySummary`, consumer mode) strips inline refs via `stripInlineCitations` — numbered `[n]` buttons only. Legacy MCP path in `brief-engine.js` uses engine `atomDid` (DID namespace) — **diverges from API path**. |
| 5 | **Briefing-source citations** | **Y** | **reference-only for arrow-two code deposit** | `lib/briefing-engine/src/citationValidator.ts` → `validateSectionCitations`; `lib/api-zod/src/generated/types/findingSourceCitation.ts` → `FindingSourceCitation`; `artifacts/api-server/src/lib/atomAdjudicationEvidenceLedger.ts` → `extractCodeCitationAtomIds` | `{{atom\|briefing-source\|<id>\|<label>}}` tokens resolve to stable briefing-source row uuids. Attributable for site-context / narrative provenance. **Not** counted in arrow-two adjudication ledger (only `kind: "code-section"` with `atomId`). Not in calibration overlay key-space per decision commitment 8 (`corpus atom id` or `websearch:`/`reasoning:` id). |

---

## 1. Cortex findings (baseline confirmation)

### Structured lineage — YES for code-section

- Engine stamps findings after validation: `lib/finding-engine/src/engine.ts` → `finalizeDrafts` sets `citations: retained` where `retained` filters `draft.citations` to known ids (`isKnownCodeSectionId` / `isKnownBriefingSourceId`).
- Wire projection passes citations verbatim: `artifacts/api-server/src/routes/findings.ts` → `toWire` reads `row.citations` as `FindingCitation[]`.
- Code citation shape: `lib/api-zod/src/generated/types/findingCodeCitation.ts` → `FindingCodeCitation { kind, atomId }`.
- Inline token path: `[[CODE:<atomId>]]` validated by `lib/finding-engine/src/citationAdapter.ts` → `validateInlineCitations` (alias of `lib/briefing-engine/src/citationValidator.ts` → `validateSectionCitations`).
- Atom ids in reference block come from `artifacts/api-server/src/routes/findings.ts` → `resolveEngineInputs` → `toCodeSectionInput` (`atomId: a.id` = `code_atoms.id` UUID) plus `supplementCodeSectionsWithReasoningGrounding` for `reasoning:` / `websearch:` ids.

### Adjudication ledger join — YES for code-section only

- `artifacts/api-server/src/lib/atomAdjudicationEvidenceLedger.ts` → `extractCodeCitationAtomIds` / `isCodeSectionCitation` fans `finding.accepted|rejected|overridden` events to `citedAtomId` from `findings.citations[].atomId`.

### `invalidCitationCount` behavior — silent strip, ledger starvation risk

- Unknown `[[CODE:…]]` and `{{atom|briefing-source|…}}` tokens are **stripped from `text`** and appended to `invalidCitations` (engine) / `invalidCitationCount` + `invalidCitations[]` (run row). Policy: strip-not-fail (`lib/briefing-engine/src/citationValidator.ts` lines 11–16).
- Findings with all citations stripped and no `elementRef` are **discarded** (`discardReason` in `engine.ts`).
- A surviving finding whose last code token was stripped retains a shrunk `citations[]` array — adjudication can deposit on surviving citations only; stripped tokens never reach the ledger.
- Run row fields: `lib/db/src/schema/findingRuns.ts` → `invalidCitationCount`, `invalidCitations`.

### Recent invalid-citation rates

- Observable endpoint: `artifacts/api-server/src/routes/findingsEvidenceLedger.ts` → `GET /api/findings/adjudication-evidence/health` → `computeInvalidCitationHealth` (60-day window, `runInvalidRate`).
- **No production snapshot in this recon** (read-only, no live DB). Test fixture (`artifacts/api-server/src/__tests__/findings-evidence-ledger.test.ts`) confirms metric: 2 completed runs, 1 with `invalidCitationCount > 0` → `runInvalidRate = 0.5`.

**Verdict:** **Attributable** for code-section citations end-to-end. **Partial** overall because briefing-source citations are not ledger-partitioned. Token-stripping is a known starvation vector (counted but not blocking).

---

## 2. Codex surfaces

### Codex Reviewer QA (HTTP) — YES

- Consumes `Finding` wire from `@workspace/api-client-react` with `citations: FindingCitation[]`.
- `artifacts/codex-reviewer-qa/src/lib/findings.ts` → `citationLabel`: code-section shows `atomId`, briefing-source shows `label`.
- `artifacts/codex-reviewer-qa/src/components/FindingCard.tsx` renders full `finding.text` + citation list — reasoning IS the text with inline tokens (no separate reasoning chain).

### Codex MCP tools (4) — PARTIAL / arrow-one-only

| Tool | Emits code citations in `data`? | Atom-id lineage? | Symbol |
|------|--------------------------------|------------------|--------|
| `codex_finding_generation` | **N** (returns `generationId`, `state`, `alreadyInFlight`) | Synthetic `legacy:finding-generation-run:{uuid}` only | `tools.ts` ~743; `legacy-client.ts` → `generateFindings` |
| `codex_override_write` | **N** (returns override row) | Synthetic `legacy:finding-override:{findingId}` | `tools.ts` ~801 |
| `codex_briefing_fetch` | **Y** (narrative sections with inline tokens) | Engagement-level `legacy:parcel-briefing:{engagementId}` — **not per-citation** | `tools.ts` ~887; `legacy-client.ts` → `fetchBriefing` |
| `codex_snapshot_ingest` | **N** (submission row) | Synthetic `legacy:submission:{submissionId}` | `tools.ts` ~944 |

`hauska-mcp-server/src/atom-shape.ts` → `codexProvenance` explicitly documents: legacy rows carry uuid row ids, not Hauska DIDs; canonical DID materializes only when atom-registry surfaces via engine retrieval API.

**Critical gap:** `legacy-client.ts` has **no** `fetchSubmissionFindings` / `fetchFindingStatus` — agents cannot retrieve `citations[].atomId` through the gate after `codex_finding_generation`.

**Verdict:** **Attributable** on the reviewer HTTP path. **Arrow-one-only** on the MCP Codex path for finding emission (kickoff without citation payload).

---

## 3. MCP tools (gate) — 46-tool breakdown

Registered in `hauska-mcp-server/src/tools.ts` → `registerTools` (46 tools per `55_spine_data_intelligence_stack.md` §1).

### Tier A — Code citations with atom id in `data` (attributable, with namespace caveats)

| Tool | Citation fields | Id format | Envelope provenance |
|------|-----------------|-----------|---------------------|
| `search_atoms` | `data.results[].atomDid`, `entityId` | `did:hauska:code-section:{entityId}` | `atom-shape.ts` → `searchAtomsEnvelope` |
| `get_atom` | Full atom `entityId` | DID input required | `getAtomEnvelope` |
| `search_permit_atoms` | `data.permitAtoms[].atomDid` | Engine DID | `searchPermitAtomsEnvelope` |
| `generate_property_brief` | `data.citations[].atomDid`, `data.sections[].hits[].atomDid`, `data.atoms.inlineRefs[].did` | **Mixed:** citations use corpus UUID; inlineRefs use `did:hauska:code-section:{uuid}` | `generateBriefEnvelope` |
| `get_property_brief_run` | Same as above | Same | `getBriefRunEnvelope` |

### Tier B — Atom provenance only, no inline code citations in `data`

Includes: `query_jurisdiction`, `list_jurisdictions`, `list_property_workspaces`, `get_property_workspace`, `list_workspace_share_edges`, `resolve_place`, `get_place_layers`, `get_place_dossier`, all Cortex L1–L6 tools (`cortex_response_task_*`, `cortex_sheet_*`, `cortex_attached_document_*`, `cortex_deliverable_letter_*`, `cortex_detail_callout_spec_*`, `cortex_product_spec_reference_*`, `cortex_snapshot_register`, `cortex_ifc_ingest`, `cortex_bim_model_query`), hydrology/topography (`simulate_site_drainage`, `get_site_drainage`, `get_site_topography`), encumbrances (`search_encumbrances`, `get_restrictions`), Cotality pack (`get_property_detail`, `get_replacement_cost`, `get_hazard_profile`, `get_parcel_polygon`).

These return operational atoms (tasks, letters, place layers, etc.) with `did:hauska:{entityType}:{entityId}` in `envelope.atoms[]` but **do not emit plan-review code citations**.

### Tier C — Job kickoff / empty provenance — arrow-one-only for code deposit

| Tool | Issue |
|------|-------|
| `codex_finding_generation` | No findings/citations in response |
| `cortex_briefing_emit` | Returns `generationId` only; provenance mis-tagged as `finding-generation-run` (`tools.ts` ~1309) |
| `codex_briefing_fetch` | Narrative tokens in `data.briefing.narrative.section*` but no structured `citations[]`; envelope is engagement-scoped |
| `codex_override_write` | No code citation threading on override body |

### Rail-quiet (I7) vs lineage

- Decision commitment 8: rail-quiet hides **calibration grade** from buyer-facing schemas, not atom-id lineage.
- MCP envelopes today carry `atoms[]` provenance but **do not** surface per-citation `atomId` on Codex finding-generation responses — lineage is what arrow-two needs and is distinct from grade.

**Verdict:** **Partial.** Corpus search/get tools are attributable (DID namespace). Property-brief tools are attributable but **id-namespace-mixed**. Codex finding path through the gate is **arrow-one-only**.

---

## 4. Brief extension

### API path (`POST /api/brokerage/v1/brief`)

- Retrieval: `brokerageBrief.ts` → `runCodeRetrieval` → `retrieveAtomsForQuestion` → `citations[].atomDid = top.id` (corpus UUID).
- Projection: `brokerageBriefAtoms.ts` → `buildBriefAtomProjection` maps citations to `citationRefs[].citationDid = buildCodeSectionDid(c.atomDid)` and `inlineRefs[].did`.
- LLM output: `brokerageBriefLlm.ts` → `NumberedCitation { atomDid }` parsed from `[n]` markers; `generateLaySummary` consumer path calls `stripInlineCitations`.

### Extension client

- `hauska-brief-extension/src/lib/brief-engine.js`: when API URL set, uses `/brief` response; when not, legacy MCP `searchAtoms` → `hit.atomDid` (engine DID).
- `inline-atoms.js` → `inlineRefsFromBrief` reads `brief.atoms.inlineRefs`; chips carry `data-did`.
- `reasoning-summary.js` → numbered `[n]` buttons with `data-did="${atomDid}"`.

### Namespace divergence (blocker for overlay attribution)

| Path | Id in `citations` | Id in findings ledger |
|------|--------------------|-----------------------|
| Cortex findings | `code_atoms.id` UUID in `citations[].atomId` | Same |
| Brokerage brief API | UUID in `citations[].atomDid` | Same UUID if keyed correctly |
| MCP `search_atoms` | `did:hauska:code-section:{entityId}` | **May differ** if `entityId` ≠ corpus UUID |
| Brief `atoms.inlineRefs` | `did:hauska:code-section:{uuid}` | Normalizable to UUID |

Decision commitment 8 flags this explicitly: citation can resolve at generation yet find no overlay row if key-spaces diverge.

**Verdict:** **Partial.** Corpus UUID is present in API `citations[]` and derivable from `atoms.inlineRefs`, but consumer prose strips inline tokens, MCP legacy path uses DID namespace, and there is no structured `citations[]` on the reasoning-summary wire beyond numbered refs.

---

## 5. Briefing-source citations

- Token grammar: `{{atom|briefing-source|<id>|<displayLabel>}}` (`citationValidator.ts` → `BRIEFING_SOURCE_TOKEN_RE`).
- Persisted citation: `FindingSourceCitation { kind: "briefing-source", id, label }` (`findingSourceCitation.ts`).
- Used in: Cortex findings (`finding-engine` prompt), parcel briefing narrative (`briefing-engine`), manual finding create (`findings.ts` ~1441).
- **Not** extracted by `atomAdjudicationEvidenceLedger.ts` → `extractCodeCitationAtomIds` (code-section only).

Per `55_spine_data_intelligence_stack.md` §4, briefing-source is a first-class citation kind for plan-review, but arrow-two combined decision commitment 3 routes calibration via `findings.citations[].atomId` on **code** atoms.

**Verdict:** **Reference-only for arrow-two code deposit.** Attributable to a briefing-source row for site-context lineage; cannot fund calibration overlay on code-section atoms. Expanding arrow-two to site-context deposits would require a separate ledger partition (out of current scope).

---

## Prioritized close-list

| Priority | Surface | Today | Minimal fix | Non-trivial? |
|----------|---------|-------|-------------|--------------|
| **P0** | MCP `codex_finding_generation` (+ status poll) | Arrow-one-only | Add `codex_findings_fetch` (or extend generation poll) wrapping `GET /api/submissions/:id/findings` + `GET …/findings/status`; return `data.findings[].citations` with atom ids; envelope `atoms[]` per cited code-section DID | **Yes** — gate must thread citations it currently strips; `legacy-client.ts` needs new methods |
| **P0** | Id namespace normalization | Partial | Single canonical key function: corpus UUID ↔ `did:hauska:code-section:{id}` ↔ `reasoning:`/`websearch:`; use at brokerage brief `atomDid`, MCP envelopes, overlay lookup | **Yes** — cross-repo (`codes`, `brokerageBriefAtoms`, `hauska-mcp-server`, overlay migration) |
| **P1** | Brief extension consumer prose | Partial | Preserve attributable refs in `laySummary` (chip or `[[CODE:uuid]]` token) instead of `stripInlineCitations` for pro mode; align extension MCP fallback to API UUID shape | Moderate |
| **P1** | MCP `codex_briefing_fetch` / `cortex_briefing_emit` | Partial | Return structured `citations[]` parsed from narrative tokens (code-section atomId + briefing-source id) alongside section text; fix `cortex_briefing_emit` provenance `atomKind` (`brief-run` not `finding-generation-run`) | Moderate |
| **P1** | `invalidCitationCount` starvation | Risk on Cortex | Surface stripped tokens on wire (already on status endpoint); add attribution-coverage metric at adjudication write time per decision commitment 8 | Moderate (Phase 3 scope) |
| **P2** | `codex_override_write` | No citation lineage on new text | Require/validate `citations[]` on override body same as manual-create finding path (`findings.ts` ~1434) | Low |
| **P2** | Briefing-source → arrow-two | Reference-only | **Decision required:** either expand ledger to `briefing-source` ids (separate overlay class) or document as intentionally non-deposit for code calibration | Policy + schema if expanded |
| **P3** | MCP Tier B tools | N/A for code | No action unless a tool starts emitting code prose (e.g. deliverable letter sections citing code by section number only) — audit letter render output when enabled | Watch |

---

## Blockers (verbatim)

1. **No MCP tool returns completed findings with `citations[].atomId`.** `codex_finding_generation` stops at `generationId`. `legacy-client.ts` has `generateFindings` but no `listSubmissionFindings` / `getFindingGenerationStatus`. Agents using the gate cannot complete the arrow-two loop without bypassing MCP to HTTP.

2. **Atom-id key-space divergence.** Cortex findings use `code_atoms.id` UUIDs in `citations[].atomId`. MCP engine tools use `did:hauska:code-section:{entityId}`. Brokerage brief labels the field `atomDid` but stores UUID. Overlay attribution can silently miss if lookup keys are not normalized (decision commitment 8, attribution-coverage metric).

3. **Codex envelope is row-scoped, not citation-scoped.** `codexProvenance` (`atom-shape.ts`) emits one synthetic `legacy:{atomKind}:{rowId}` entry per tool call. Cited code atoms in briefing narrative or (if ever returned) findings are not enumerated in `envelope.atoms[]`.

4. **Briefing-source citations are outside the adjudication ledger.** `extractCodeCitationAtomIds` filters `kind === "code-section"` only. Findings citing only briefing-sources produce adjudication events with **zero** cited atoms for overlay — arrow-one-only for code calibration even when the finding is accepted.

5. **Token-stripping drops lineage without blocking the finding.** `validateSectionCitations` strips unknown tokens; surviving findings may have fewer citations than the model intended; `invalidCitationCount` records the gap but does not prevent adjudication on a partially-unanchored finding (unless discard rule fires).

6. **`cortex_briefing_emit` provenance mis-tag.** Handler uses `atomKind: "finding-generation-run"` for a briefing-generation job (`tools.ts` ~1312) — confusing for agents tracing lineage class.

---

## Acceptance checklist

- [x] All five surfaces covered, each cited by file + symbol
- [x] Clear verdict per surface (attributable / partial / arrow-one-only)
- [x] Prioritized close-list with minimal fix per surface
- [x] Non-trivial gaps flagged (gate citation threading, namespace normalization)
- [x] No code, no schema, no PR
