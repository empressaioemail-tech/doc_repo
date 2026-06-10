---
id: 2026-06-10_legacy-design-tools_cc-agent-C2_precedence_gate_exposure_recon
title: Precedence / reconciliation — gate-exposure + full-matrix recon
date: 2026-06-10
agent: cc-agent-C2
repo: legacy-design-tools (cross-repo read: hauska-mcp-server @ 392884c)
kind: recon
status: complete
model: Grok Build 0.1 (Cursor base URL https://api.x.ai/v1) — no escalation
related: [58_gtm_readiness_sprint, 59_spine_moat_and_high_value_features, 80_adrs/adr_021_constraint_resolution_and_precedence, 03a_positioning_framework, 2026-06-10_cc-agent-C2_precedence_gate_exposure_recon]
---

# Precedence / reconciliation — gate-exposure + full-matrix recon

Read-only recon for Sprint 58 moat #4. Taxonomy canary (#149, ADA-vs-FHA `most-stringent-governs`) is merged on `origin/main` (`a84bbe1`). This report answers the two remaining questions: gate exposure and full-matrix completeness, plus cross-stack reconciliation scope.

**Worktree discipline:** Evidence read from detached worktree `P:\ldt-fe-track2-track7-recon` and production gate clone `P:\tmp\hauska-mcp-server-recon` (shallow clone of `empressaioemail-tech/hauska-mcp-server`, HEAD `392884c`). No edits to `P:\legacy-design-tools` (cc-agent-C owned).

---

## Executive summary

| Question | Verdict |
|---|---|
| **Gate exposure** | **Not exposed.** `reconcileStandardPrecedence` is a library primitive exported from `@workspace/finding-engine`; it is exercised only in unit tests. No MCP tool, no HTTP route, and no production call site in `engine.ts`. |
| **Full matrix** | **Partial.** Federal intra-tier (co-applicable), cross-tier federal→model preempt, and model+local overlay are handled with tests. State-amendment tier, zoning (Layer 3), private recorded restrictions, and ADR-021 `constraint-resolution` atom are unhandled or out of scope for this primitive. |
| **Cross-stack** | **Within-layer only (model + local overlay + federal).** Does not reconcile building code against zoning or CC&Rs; does not compose ADR-019 effective-rule query-time resolution. |
| **Launch gating** | **Not launch-gating** for gate tool exposure or full matrix (per [`58_gtm_readiness_sprint.md`](../58_gtm_readiness_sprint.md) § Moat #4). Fast-follow with high moat value once wired + exposed. |

**Recommendation:** Expose `resolve_precedence` at the gate (Layer 2 / Cortex product key) after a thin build wires the primitive into the finding-engine accessibility path and adds requirement-ingest from `ApplicableRequirement` shells. Full ADR-021 `resolve_constraints` (parcel + zoning + encumbrances) remains a separate, larger build.

---

## 1. Gate exposure

### 1.1 Is `reconcileStandardPrecedence` a first-class gate tool?

**No.** Verified against live registries:

| Surface | Exposed? | Evidence |
|---|---|---|
| **MCP gate** (`hauska-mcp-server/src/tools.ts` → `registerTools`) | **No** | Shallow-cloned production repo (`392884c`): 58 `server.tool(` registrations; `grep` over `src/` returns **zero** matches for `precedence`, `reconcile`, `resolve_precedence`, `resolve_constraints`. Tool names include corpus search, jurisdiction query, Codex/Cortex job surfaces — no precedence/reconciliation tool. |
| **HTTP api-server** | **No** | `grep` over `artifacts/api-server/src` for `reconcileStandardPrecedence` / `reconcileRequirementsByTopic` → only `gtmTriage.test.ts` pattern-matches the symbol name for package classification (`inferDataPackage("reconcileStandardPrecedence")` → `"code"`). No route handler. |
| **Finding-engine production path** | **No** | `lib/finding-engine/src/engine.ts` → `finalizeDrafts` (and full file): **no** import or call to precedence module. Precedence is library-only today. |
| **Library export** | **Yes (internal API)** | `lib/finding-engine/src/precedence/index.ts` exports `reconcileStandardPrecedence`, `reconcileRequirementsByTopic`, `formatPrecedenceFindingText`. Re-exported from `lib/finding-engine/src/index.ts`. Comment in `types.ts` L3–4: *"Callable from finding-engine, briefing-engine, or MCP wrappers — not plan-review-only."* — intent documented, wiring not done. |

The local skeleton clone at `C:\Users\cente\Documents\hauska-mcp-server` (5 bootstrap tools) is **stale**; production gate at GitHub HEAD has the full ~58-tool registry per [`50_hauska_mcp_server.md`](../50_hauska_mcp_server.md) and the 2026-06-09 lineage audit. Precedence is absent in both.

### 1.2 Internal-only vs exposed-as-tool

**Recommend exposed-as-tool** (`resolve_precedence`), with internal wiring first.

Reasoning aligned to [`03a_positioning_framework.md`](../03a_positioning_framework.md) and [`59_spine_moat_and_high_value_features.md`](../59_spine_moat_and_high_value_features.md) item 4:

- The positioning line — *"the code tells you the rule; Hauska tells you what it means for your building, reconciled with every other code that applies"* — is explicitly the precedence/reconciliation engine (ADR-021).
- [`76d_gtm_data_package_go_to_market.md`](../76d_gtm_data_package_go_to_market.md) / capability matrix already lists *"most-stringent-governs precedence reconciliation"* as a sellable Layer-2 reasoning SKU (`spine_capabilities_added_since_v1.0.precedence_reconciliation_engine`).
- An external agent cannot buy or verify that capability today: the primitive is exported from a npm workspace package but unreachable through the gate — the moat is **not yet a product surface**.
- ADR-021 L82 normatively names MCP tool `resolve_constraints` (Phase 2) wrapping the broader resolver; a narrower `resolve_precedence` is the right v1 gate slice for code-standard reconciliation before full parcel lattice.

Internal-only is insufficient for GTM: Cortex findings could eventually call the primitive silently, but that does not satisfy "AI accessible by default" / sell-reasoning for BYO-agent buyers.

---

## 2. Tool sketch — `resolve_precedence` (alias `reconcile_codes`)

Thin gate wrapper over `reconcileRequirementsByTopic` + optional auto-hydration from atom refs. Lives in `hauska-mcp-server` calling spine `engine-api` (post A2 lift) or legacy finding-engine package until lift lands.

### Inputs (Zod-validated)

```typescript
{
  jurisdiction: string;                    // e.g. "bastrop-tx" — drives corpus tenant + amendment lookup
  domain: "accessibility" | "life-safety" | "dimensional" | "general";
  topic?: string;                          // optional filter; omit to reconcile all grouped topics
  requirements?: ApplicableRequirement[];  // caller-supplied competing requirements (advanced)
  code_refs?: Array<{                       // convenience path — gate hydrates shells
    atom_id: string;                        // code-section atom id (corpus UUID or federal path)
    topic: string;
    dimension: string;
    requirement_kind: "minimum" | "maximum" | "exact" | "qualitative";
    numeric_value?: number;
    numeric_unit?: string;
    text_value?: string;
    overlays_atom_id?: string;              // local amendment → model base link
  }>;
  project_facts?: {                          // surfaced in reasoning chain, not used in v1 pick logic
    occupancy?: string;
    dwelling_units?: number;
    is_multifamily?: boolean;
  };
  federal_preempts?: boolean;               // default: true for accessibility/life-safety per reconcile.ts
  evaluated_at?: string;                    // ISO-8601; default now (ADR-011 as-of-time hook)
}
```

**Validation rule:** require `requirements` **or** `code_refs` (min 2 entries after hydration). Gate calls `detectStandardDescriptor` / `codeSectionToRequirementShell` (`standardRegistry.ts`) when authority metadata is missing.

### Output (`data` payload)

Maps 1:1 from `PrecedenceReconciliationResult` / `ReconcileRequirementsByTopicResult`:

```typescript
{
  reconciliations: Array<{
    topic: string;
    dimension: string;
    governing: {
      atom_id: string;
      standard_key: string;
      standard_label: string;
      authority: "federal" | "model-code" | "local-amendment" | "private-advisory";
      numeric_value?: number;
      numeric_unit?: string;
      text_value?: string;
      citation_label: string;
      confidence: number;
    };
    compared: /* same shape, all non-governing + governing */;
    rule_applied: PrecedenceRuleApplied;
    reasoning_chain: string[];              // includes federal-preempt step when model-code dropped
    conflicts: Array<{
      topic: string;
      competing_atom_ids: string[];
      status: "resolved" | "unresolved";
      resolution_note: string;
    }>;
    citations: Array<{ kind: "code-section"; atom_id: string }>;
    confidence: number;                     // min of compared
    evaluated_at: string;
  }>;
  uncontested: /* requirements with <2 on topic, passed through */;
  formatted_findings?: string[];            // formatPrecedenceFindingText per reconciliation
}
```

### Uniform provenance envelope (required)

Per moat #3 ([`59`](../59_spine_moat_and_high_value_features.md) item 3) and existing gate pattern (`hauska-mcp-server/src/atom-shape.ts` → `ToolEnvelope<T>`):

```typescript
{
  data: /* payload above */,
  atoms: AtomProvenanceEntry[];             // one entry per compared atom_id (union of all reconciliations)
  meta: {
    attribution?: string;                   // free tier
    reasoning: {
      rule_applied: string;                 // primary rule from first/only reconciliation or per-topic map
      precedence_steps: string[];           // copy of reasoning_chain
      project_facts?: object;
    };
    confidence: number;
    evaluated_at: string;
    edition_notes?: Record<string, string>; // atom_id → edition in force (when hydration adds it)
    verification_state?: Record<string, string>; // atom_id → verified | credential-pending | unverified-web-source
    calibration_grade?: null;               // rail-quiet (I7) at launch; slot reserved
  }
}
```

**New envelope builder:** `precedenceReconciliationEnvelope()` in `atom-shape.ts`, mirroring `generateBriefEnvelope` — enumerate every `compared[].atom_id` into `atoms[]` with `did:hauska:code-section:{entityId}` and fetch source adapter/url via `get_atom` batch or inline from hydration.

**Product gate:** Layer 2, Cortex product key (same tier as plan-review reasoning per capability matrix).

---

## 3. Full-matrix case table

Symbol of record: `lib/finding-engine/src/precedence/reconcile.ts` → `reconcileStandardPrecedence`, `applyLocalOverlay`; tests in `lib/finding-engine/src/__tests__/precedenceReconcile.test.ts`.

| Case | Status | Evidence | Notes |
|---|---|---|---|
| **Most-stringent-governs** (intra-tier, co-applicable federal) | **Handled** | `reconcile.ts` L257–259, L273–333; test `most-stringent-governs` + ADA/FHA pair | FHA 24in governs over ADA 18in. `#149` fix: `ruleApplied === "most-stringent-governs"` when `decisionPool.length >= 2`. |
| **Federal-preempts-where-genuinely-preemptive** (cross-tier) | **Handled** | `reconcile.ts` L237–242, L260–262; test `single federal preempts model-code` | Federal drops model-code from pool; `ruleApplied === "federal-preempts-where-applicable"` only when pool collapses to one federal (no intra-tier contest). Preempt step stays in `reasoningChain` even when final rule is most-stringent (3-standard test). |
| **Local-overlay** (amendment overrides base) | **Handled** | `reconcile.ts` → `applyLocalOverlay` L51–110; test `local-amendment-overlay` | Local amendment replaces model-code on same topic via `overlaysAtomId`. Runs before federal preempt. |
| **Co-applicable** (two standards both apply, neither preempts) | **Handled** (as most-stringent) | `reconcile.ts` L243–247 (federal+model remain when `federalPreempts: false`); ADA+FHA pair | No separate `co-applicable` label — correctly subsumed under `most-stringent-governs`. Outcome + chain are right. |
| **Cross-layer: model code vs state amendment** | **Partial / unhandled** | `StandardAuthority` in `types.ts` L10–14 — only `federal \| model-code \| local-amendment \| private-advisory`; `standardRegistry.ts` L44–49 detects `\bamendment\b` → `local-amendment` | ADR-019 Layer 2 state adoption amendments are not distinguished from city local amendments. State overlay would be misclassified unless caller sets authority explicitly. |
| **Cross-layer: model code vs local amendment** | **Handled** | `applyLocalOverlay` | This is the exercised path (Bastrop IBC amendment fixture). |
| **Cross-layer: model/amendment vs zoning (Layer 3)** | **Unhandled** | No `zoning` authority; `query_jurisdiction` returns zoning separately (`hauska-mcp-server/src/tools.ts` → `query_jurisdiction`) but no bridge into precedence primitive | Zoning dimensional limits never enter `ApplicableRequirement[]` in reconcile. Positioning claim spans "code + zoning" — not satisfied by this primitive alone. |
| **Cross-layer: code vs private recorded restriction (CC&R)** | **Unhandled** | `private-advisory` in authority enum but ADR-020/021 `restriction-clause` / `legalWeight: recorded` not modeled; when federal preempts, `privateAdvisory` dropped from pool entirely (`reconcile.ts` L237–250) | Does not implement ADR-021 rules 2–4 (private stricter-than-zoning, recorded-over-advisory, temporal). |
| **Conflict-unresolved** (incomparable) | **Handled** | `reconcile.ts` L274–294, L302–321; test `conflict-surface` | Qualitative mismatch → `ruleApplied: conflict-unresolved`, `conflicts[].status: unresolved`. |
| **Single source** (no reconciliation) | **Handled** | `reconcile.ts` L193–209 | `ruleApplied: single-source`. |
| **Equal numeric tie** | **Handled** | `reconcile.ts` L323–330 | Tie-break by `AUTHORITY_RANK` (federal < model-code < local-amendment < private-advisory). |
| **General domain stringency labeling** | **Partial** | `reconcile.ts` L252–271 — most-stringent label assignment skipped when `domain === "general"` | `pickMostStringent` still runs, but `ruleApplied` may remain `local-amendment-overlays-model-code` even with 2+ pool members; reasoning step "Most-stringent-governs applied…" not appended. **Taxonomy gap** (lower severity than #149 canary). |

### Taxonomy labels — conceptually off?

| Label | Status after #149 |
|---|---|
| `federal-preempts-where-applicable` on ADA-vs-FHA | **Fixed** — now `most-stringent-governs`; preempt only in chain (`a84bbe1`, tests L21–39, L42–74). |
| `federal-preempts-where-applicable` when single federal remains after dropping model | **Correct** — cross-tier only (test L76–91). |
| `local-amendment-overlays-model-code` when pool still has 2+ post-overlay | **Potentially sticky** in `general` domain — same class of bug as #149 but unexercised in tests. Flag for follow-up. |
| Missing `co-applicable` label | **Not an error** — ADR-021 clarification (2026-06-08) defines co-applicable as most-stringent-governs outcome. |

---

## 4. Reconciliation across the stack

### What works today

Within a **single plan-review code track** on a shared `topic` + `dimension`:

1. **Layer 1 model-code** (`authority: model-code`) — e.g. A117.1 stub.
2. **Layer 2 local amendment** (`authority: local-amendment`, `overlaysAtomId`) — overlays base per ADR-019.
3. **Federal standards** (`authority: federal`) — preempt model-code in accessibility/life-safety domains; intra-federal stringency pick.

Implemented in one function call with full citation union and reasoning chain (`PrecedenceReconciliationResult`).

### What does not work today

| ADR-019 / ADR-021 intent | Gap |
|---|---|
| Effective rule = base + amendment **at query time** via `jurisdiction-corpus` composition | Primitive expects pre-built `ApplicableRequirement[]`; no auto-expansion from jurisdiction + topic. Gate tool must hydrate or finding-engine must assemble. |
| Layer 3 zoning / UDC | Not in authority model; no cross-domain reconcile (setback from zoning vs building code egress). |
| State adoption amendment as distinct tier | Collapsed into `local-amendment` or `model-code` via regex detection only. |
| ADR-021 `constraint-resolution` atom (`resolveConstraints({ parcelDid, … })`) | **Not implemented.** Only the narrow `reconcileStandardPrecedence` primitive exists (PR #147). |
| Encumbrances / `restriction-clause` | `search_encumbrances` / `get_restrictions` gate tools exist; no merge into precedence primitive. |
| Production finding emission | Engine never calls reconcile — multi-standard conflicts in live findings are still LLM-improvised unless prompt luck holds. |

### Honesty check for launch positioning ([`03a`](../03a_positioning_framework.md))

*"Reconciled with every other code that applies"* is **truthful for the demo path** (ADA + FHA + A117.1 latch-side clearance) and **not yet truthful** as an automated, gate-callable, cross-layer (code + zoning + private restrictions) capability. Recommend GTM copy scope to **federal accessibility + adopted model code + local amendments on the same dimension** until wiring + gate tool land.

---

## 5. Scoping recommendation

### Build slices (sequenced)

| Slice | Repo | Size | Depends on |
|---|---|---|---|
| **S1 — Wire into finding-engine** | legacy-design-tools | **Small** (~1–2 days) | Accessibility domain hook in plan-set orchestrator: when multiple federal/model sections match a topic, build `ApplicableRequirement[]` via `codeSectionToRequirementShell`, call `reconcileRequirementsByTopic`, emit finding text via `formatPrecedenceFindingText` with structured `citations[]`. |
| **S2 — Gate tool `resolve_precedence`** | hauska-mcp-server + engine-api | **Small–medium** (~2–3 days) | S1 or direct package import; `precedenceReconciliationEnvelope`; Layer 2 product gate; hydration from `code_refs`. |
| **S3 — Jurisdiction auto-expansion** | hauska-engine / codes | **Medium** | Given `jurisdiction` + `topic`, resolve applicable base + amendments from corpus (ADR-019 composition) before reconcile. Required for "just give us an address" UX. |
| **S4 — Matrix hardening** | legacy-design-tools | **Medium** | State-amendment tier; `general` domain label fix; private recorded vs advisory per ADR-021; tests per case row above. |
| **S5 — Full ADR-021 `resolve_constraints`** | hauska-engine + legacy-design-tools | **Large** (Phase 6) | Parcel anchor, zoning, encumbrances, `constraint-resolution` atom, procedure-execution gating. |

### Launch-gating call

Per [`58_gtm_readiness_sprint.md`](../58_gtm_readiness_sprint.md) (2026-06-10 update):

| Item | Launch-gating? | Rationale |
|---|---|---|
| **`resolve_precedence` MCP tool** | **No — fast-follow (high priority)** | Moat #4 explicitly "recon FIRST"; launch gate is Cortex + extension on spine with uniform envelope on architect-facing surfaces, not full ~57-tool fleet. |
| **Wire precedence into Cortex findings (S1)** | **Soft gate — recommended pre-launch if accessibility demo is hero GTM path** | Primitive exists but is not in production path; without S1, the EntreArchitect demo is test-fixture-only. Not listed as hard acceptance in 58, but weakens the positioning line if marketed live. |
| **Model + local amendment reconciliation (S3 hydration)** | **Partial honesty gate** | Algorithm handles overlay; automated jurisdiction expansion does not. Thin launch OK with coverage-honesty pill when amendment corpus incomplete. |
| **Zoning + CC&R cross-layer (S4–S5)** | **No — post-llaunch** | ADR-021 Phase 6; required for full positioning line, not Texas architect launch wedge. |
| **Uniform envelope on precedence output (S2)** | **Rides C1/C2** | Architect-facing precedence output should use standard envelope when S2 lands; not blocking launch if precedence stays internal-only initially. |

**Net:** None of the precedence-tighten work is **hard launch-gating** per sprint 58. **S1 (internal wire)** is the highest-value pre-launch fast-follow if GTM leads with the reconciliation demo. **S2 (gate tool)** is the moat productization step — schedule immediately after A2 engine-core lift so the gate calls spine `engine-api`, not a legacy bypass.

---

## 6. Acceptance checklist

- [x] Gate exposure answered with file+symbol evidence (`tools.ts`, `engine.ts`, `precedence/index.ts`)
- [x] Full-matrix case table with handled/partial/unhandled per case
- [x] Taxonomy canary (#149) status confirmed; residual label gaps flagged
- [x] Cross-stack reconciliation scope documented
- [x] Concrete `resolve_precedence` tool sketch (inputs / output / envelope)
- [x] Scoping recommendation with launch-gating call
- [x] Read-only: no code, no schema, no PR

---

## References

- ADR-021: [`80_adrs/adr_021_constraint_resolution_and_precedence.md`](../80_adrs/adr_021_constraint_resolution_and_precedence.md)
- Moat #4: [`59_spine_moat_and_high_value_features.md`](../59_spine_moat_and_high_value_features.md) item 4
- Positioning: [`03a_positioning_framework.md`](../03a_positioning_framework.md)
- Gate registry: `hauska-mcp-server/src/tools.ts` @ `392884c` (58 tools, no precedence)
- Primitive: `legacy-design-tools/lib/finding-engine/src/precedence/reconcile.ts` → `reconcileStandardPrecedence`
- Taxonomy fix: PR #149 / `a84bbe1`
