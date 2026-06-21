---
id: 2026-06-21_cortex_cc-agent-R_wave1-f4-reach-and-embed-mount
title: cc-agent-R — Wave 1 F4 Cortex reach inventory + R1 embedded-map mount contract
date: 2026-06-21
agent: cc-agent-R
repo: legacy-design-tools (Cortex runtime — `artifacts/design-tools` + cortex-api routes it consumes)
branch: map/track123-free-federal-layers (verify read against live tree; not merged)
dispatch: Calibrated Spine Wave 1 — F0 verify-first (F4 reach), define R1 embed contract (no report build)
tasks: [F0-F4-reach, R1-contract]
blocks_unblocked: [F4-Cortex-propagation design, R2–R6 Wave 4 reporting build]
---

# Close — Wave 1 F4 Cortex reach + R1 embedded-map mount contract

## Summary

Re-verified live `legacy-design-tools` tree (2026-06-21) for **every Cortex confidence-emitting surface** (F4 migration scope) and **defined the R1 embedded-map mount contract** coordinated with map-agent V1/V3. **No Wave 1 build landed** — no report renderer, no F4 propagation, no embedded map instance in Cortex UI.

**Cortex runtime scope:** `artifacts/design-tools` (Architect / Cortex UI) plus cortex-api routes and atom registrations the engagement UI calls. Plan-review (`artifacts/plan-review`) is Codex reviewer — excluded from this inventory except where Cortex shares the same API wire types.

---

## F0 — F4 reach: full Cortex confidence-emitting surface inventory

Confidence appears today as a **bare numeric scalar** (`0..1`), as **`EngineHonesty.confidence { value, kind }`**, or as a **categorical geocode label** (`high` | `coordinates` | `low`). None expose F4 target fields (`n`, interval `width`, three-axis contract, calibration-provenance).

### A. Surfaces that **display** a confidence number in Cortex UI today

| # | Surface | Location | What is shown | Wire field | F4 migration note |
|---|---|---|---|---|---|
| A1 | **Plan-review findings detail** | `FindingsTab` → `@workspace/portal-ui` `FindingDetailPanel` → `EngineHonestyChrome` | Kind label + **NN%** (e.g. "Asserted confidence 87%") when `engineHonesty` present | `Finding.engineHonesty.confidence.value` + `.kind` | Replace chrome with read-contract object; ban bare `%` without width |
| A2 | **Encumbrance clause rows** | `EncumbrancesPanel` (Site tab + Site Context tab) | Per-clause **NN%** beside legal weight | `EncumbranceClause.clause.confidence` | Scalar extract confidence; no kind/provenance |
| A3 | **Private restrictions briefing block** | `EncumbrancesPanel` | Aggregate **"Confidence NN%"** on summary | `PrivateRestrictionsBriefing.confidence` | Same — briefing encumbrance synthesis scalar |

**Not displayed in Cortex UI today (but on wire):** `Finding.confidence` scalar and `Finding.lowConfidence` flag — plan-review reviewer UI uses `LowConfidencePill`; Cortex `FindingsList` does **not** render the scalar or low-confidence chip (only severity/category in list rows).

### B. cortex-api routes **emitting confidence** consumed by (or reserved for) Cortex

| # | Route / handler | Schema field(s) | Consumer today | Notes |
|---|---|---|---|---|
| B1 | `GET/POST …/submissions/{id}/findings*` | `Finding.confidence`, `Finding.engineHonesty`, run-level `engineHonesty` on generation status/runs | Findings tab, chat agent | LLM-emitted scalar persisted in `findings.confidence`; honesty slice forwarded from engine-api on runs (**F9 violation**) |
| B2 | `GET …/engagements/{id}/briefing` | `privateRestrictions.confidence`, internal `provenance.confidence` on briefing projection | EncumbrancesPanel | `ProvenanceEnvelope.confidence` built in `provenanceEnvelope.ts` — **not rendered** in briefing narrative UI |
| B3 | `GET …/briefing/status`, `GET …/briefing/generation-runs` | `engineHonesty` persisted on jobs (`briefing_generation_jobs.engine_honesty`) | **Not in OpenAPI**; not displayed in `BriefingNarrativePanel` | Code–spec drift: handler wires honesty; OpenAPI `BriefingGenerationStatusResponse` omits it |
| B4 | `GET/POST …/engagements/{id}/encumbrances*` | Clause + aggregate confidence | EncumbrancesPanel | Extract model self-reported |
| B5 | `POST …/submissions/{id}/reclassify`, submission atom | `SubmissionClassification.confidence` | **Not displayed** in Cortex engagement UI | Atom `contextSummary` keyMetrics would expose if atom drill-in renders classification |
| B6 | **Claude chat agent tools** (`chatAgentTools.ts`) | `list_findings` → DB `findings.confidence`; `create_response_tasks` accepts `confidence` in task body; prose cites `confidence N` in task description | `ClaudeChat` (operator-facing agent) | Agent sees raw scalars in JSON tool results |
| B7 | `GET /api/atoms/{type}/{id}/summary` — **finding** atom | `keyMetrics: [{ label: "Confidence", value }]`, `typed.confidence` | Atom probe / future E7; **not** engagement Findings list | Registration: `finding.atom.ts:250` |
| B8 | `GET /api/atoms/…/summary` — **submission-classification** atom | `keyMetrics` confidence, `typed.confidence` | Not rendered in Cortex today | `submission-classification.atom.ts:218` |
| B9 | `POST /api/brokerage/v1/place/resolve` | `geocode.confidence` enum (`high` \| `coordinates` \| `low`) | Indirect (site-context eligibility copy) | Not numeric F4 shape — still honesty-relevant |
| B10 | `POST /api/brokerage/v1/map-data/*` (gis-layer, composite-layer, assemble) | `EngineEnvelope.confidence { value, kind }` per slot | **Not consumed by Cortex `SiteMap`** (Leaflet site-context path); reserved for R3 embed + Property Intel | Default asserted 0.72 in `brokerageSiteContext.ts`; composites in `brokerageGisCompositeLayers.ts` |
| B11 | `GET …/place/:placeKey/layers`, dossier GIS slots | Per-layer `engineHonesty` | Spine console / future embed | Same EngineHonesty slice |
| B12 | `buildBrokerageBriefProvenanceEnvelope` / brief runs | `BriefProvenanceEnvelope.confidence` | Extension brief path; **not** engagement briefing UI in Cortex | Rail-quiet brokerage brief pipeline (separate from architect briefing) |
| B13 | **L2 sheet-content-extraction** atom schema | Segment `confidence` in `[0,1]` | L2 deliverable path; no numeric display in Cortex L2 UI today | `@workspace/atoms-l-surface` OCR segments |

### C. Cortex L1–L6 deliverables — confidence on wire vs UI

| Lane | Emits confidence? | Displayed in Cortex? |
|---|---|---|
| L1 response-task | Stores `findingId` / severity reference; optional `confidence` on create via chat tool | No numeric chip in `ResponseTasksTab` |
| L2 sheet-content-extraction | Segment-level confidence in atom payload | No |
| L3 deliverable-letter | Provenance refs only; no confidence field on letter schema | No |
| L4 detail-callout-spec | No confidence field | No |
| L5 product-spec-reference | No confidence field | No |
| L6 deliverable-letter-render | No confidence field | No |

Site-bound L3–L6 reports will gain **embedded maps** under R3; map slots carry confidence via B10/B11 even when the letter body does not.

### D. Shared library surfaces in Cortex dependency graph (migration must touch)

| Package | File | Role |
|---|---|---|
| `@workspace/engine-core` | `envelope.ts` | Authoritative `EngineEnvelope` / `EngineHonesty` types |
| `@workspace/portal-ui` | `EngineHonestyChrome.tsx` | **Primary buyer-facing confidence renderer** in Cortex findings |
| `@workspace/portal-ui` | `LowConfidencePill.tsx` | Used by plan-review, **not** imported in design-tools FindingsTab |
| `@workspace/api-spec` | `Finding`, `EngineHonesty`, `PrivateRestrictionsBriefing`, `SubmissionClassification` | OpenAPI wire contracts |
| `artifacts/api-server` | `engineHonestyWire.ts`, `provenanceEnvelope.ts`, `findings.ts`, `parcelBriefings.ts`, `chatAgentTools.ts`, `brokerageSiteContext.ts`, `brokerageGisCompositeLayers.ts` | Emit/normalize paths |

### E. F4 Cortex propagation count (for planning)

| Category | Count |
|---|---|
| **UI render sites (numeric shown)** | **3** (A1–A3) |
| **API wire fields (scalar or EngineHonesty)** | **13 route families** (B1–B13) |
| **Atom registrations emitting confidence** | **2** (finding, submission-classification) + L2 segment schema |
| **Shared components requiring read-contract** | **1 primary** (`EngineHonestyChrome`) + EncumbrancesPanel inline `%` |

**Verdict:** Gap analysis F4 row **confirmed**. Confidence is `{ value, kind }` at best on EngineEnvelope paths; findings still carry LLM scalar; no `n`, no width, no calibration-provenance object, no scalar accessor ban.

### Verified commands

```text
# EngineEnvelope shape (cc-agent-C already ran; re-confirmed)
cd P:\legacy-design-tools\lib\engine-core
pnpm exec vitest run src/__tests__/envelope.test.ts --reporter=verbose
→ Test Files 1 passed | Tests 4 passed

# Cortex UI confidence grep (2026-06-21)
rg "confidence|EngineHonesty|LowConfidence" artifacts/design-tools/src
→ EncumbrancesPanel (display); FindingsTab imports FindingDetailPanel (EngineHonesty via portal-ui)

# Findings wire mapper still scalar
rg "confidence: Number\\(row.confidence\\)" artifacts/api-server/src/routes/findings.ts
→ line 337 (confirmed F9)
```

---

## R1 — Embedded-map mount contract (definition only; coordinated with map-agent V3)

Wave 1 delivers the **contract text** only. No embedded map instance in Cortex reports yet. Aligns with map-agent V1 four-signal renderer (`P:\hauska-map\src\renderer\map-renderer.js`) and V3 static registry placeholder (`layer-registry.js`).

### 1. Mount kinds

| Kind | Host | Window FSM | Used by |
|---|---|---|---|
| `floating` | V2 floating window manager (E6 spine console, extension sidebar) | Yes — floating/snapped/minimized/maximized/closed | End-state E, Brief extension |
| **`embedded-static`** | **In-flow DOM block inside a report** | **No** — fixed aspect box in document layout | **R1/R3 reports**, PDF/export snapshots |

**Keystone rule (from endstate D):** embedded report maps use the **same renderer instance contract** as the floating map, not a second map engine. View state (`center`, `zoom`, `pitch`, `bearing`, `visibleLayers`) is preserved across floating ↔ embedded transitions when a host explicitly handoffs (Wave 2+).

### 2. V1 renderer contract (unchanged — map-agent owns implementation)

```typescript
/** Map-agent V1 — renderer knows nothing about windows or reports */
interface MapRenderer {
  mount(slot: HTMLElement): void;
  resize(width?: number, height?: number): void;
  setLayerVisibility(visible: Set<string>): void;
  bindContext(ctx: MapRendererContext): void;
  // helpers: getViewState, setViewState, destroy
}

interface MapRendererContext {
  center?: { latitude: number; longitude: number };
  address?: string;
  useFixture?: boolean;
  onParcelSelect?: (selection: ParcelSelection) => void;
}
```

### 3. R1 static embed host contract (cc-agent-R + map-agent)

```typescript
/** Report host supplies a single content slot in document flow */
interface ReportEmbedMapHost {
  mountKind: "embedded-static";
  /** Sized block — host owns CSS (width 100%, aspect-ratio, min-height) */
  mountSlot: HTMLElement;
  /** Unique per embed on page (report section id) */
  embedId: string;
  /** Host app identifier for V3 allocation lookup */
  appId: AppId;
  /** Report type key from endstate D binding table */
  reportType: ReportType;
}

/** Extends V1 context with report + allocation binding */
interface ReportEmbedContext extends MapRendererContext {
  appId: AppId;
  reportType: ReportType;
  /** V3 allocation resolver input — see §4 */
  allocationKey: string;
  /** Parcel / engagement binding (at least one required) */
  placeKey?: string;
  engagementId?: string;
  /** Optional: pre-warmed cache generation id (W2) */
  warmGenerationId?: string;
}

/** Lifecycle — embedded host responsibilities */
interface ReportEmbedLifecycle {
  /** Create one renderer per mountSlot; call mount() once */
  onMount(host: ReportEmbedMapHost, ctx: ReportEmbedContext): MapRenderer;
  /** ResizeObserver → renderer.resize() on slot dimension change */
  onSlotResize(): void;
  /** Tab/section hide: preserve view state in host store; do not destroy GL context until unmount */
  onVisibilityChange(visible: boolean): void;
  /** Report unmount: renderer.destroy() */
  onUnmount(): void;
}
```

**Layout defaults for static embed:**

| Report class | `aspectRatio` | `minHeightPx` | Notes |
|---|---|---|---|
| Site-context / plan-review locator | `16/9` | 320 | Hero map above fold |
| Hydrology / flood depth | `4/3` | 360 | Contour + flow readability |
| Inline comment-letter embed | `16/9` | 240 | Narrow column safe |
| PDF/export capture | `16/9` | fixed px width | Host passes pixel box; no interaction |

### 4. Per-app layer allocation interface (V3 registry — map-agent owns registry file)

```typescript
type AppId = "cortex" | "radar" | "brief" | "smartcity-os" | "codex-reviewer";

type ReportType =
  | "property-brief"
  | "site-context"
  | "hydrology"
  | "codex-plan-review"
  | "cortex-deliverable-site-bound"
  | "radar-baseline"
  | "radar-cotality"        // R4 fuel-gated
  | "cotality-property-intel" // R4
  | "subsurface"              // R5
  | "precedence-jurisdiction" // R5
  | "plan-set-locator";       // R5

/** One row in V3 registry YAML/JSON — map-agent `LAYER_REGISTRY` superset */
interface LayerRegistryEntry {
  key: string;
  label: string;
  group: string;
  fixture: boolean;
  live: boolean;
  fuelGated: boolean;
  pending?: boolean;
}

/** Resolved allocation for one (app, report) pair */
interface LayerAllocation {
  visibleLayers: string[];          // subset of registry keys
  defaultOn: string[];              // initial setLayerVisibility
  fuelGated: string[];              // host must confirm tier/credentials before enable
  reasoningOverlays: {
    contestedGround?: boolean;
    triage?: boolean;
    consequenceChoropleth?: boolean;
  };
  layout: { aspectRatio: "16/9" | "4/3" | "auto"; minHeightPx: number };
}

/** V3 resolver — implemented map-agent; consumed by cc-agent-R report hosts */
function resolveLayerAllocation(input: {
  appId: AppId;
  reportType: ReportType;
  tier: "free" | "pro" | "max";
  allocationKey?: string; // optional override; default `${appId}:${reportType}`
}): LayerAllocation;
```

**Allocation key convention:** `allocationKey = "${appId}:${reportType}"` unless R6 per-report override table supplies a custom key (e.g. `cortex:hydrology:cotality-forcing`).

### 5. Report-to-layer binding table (from endstate D — allocation defaults for V3 seed)

| ReportType | Cortex default layers | Radar default | Brief ext. | SmartCity |
|---|---|---|---|---|
| `property-brief` | parcel, zoning, flood, consequence†, triage†, contested† | parcel, flood, national heat | same as brief ext. | parcel, flood, municipal overlay |
| `site-context` | flood, contours, EJ, parcel | flood, parcel | flood, parcel, contours | flood, parcel |
| `hydrology` | D8 flow, flood depth, contours, contested† | — | D8, flood | D8, flood |
| `codex-plan-review` | site locator, zoning/setback, finding pins | — | — | site locator |
| `cortex-deliverable-site-bound` | site-context subset | — | — | — |
| `radar-baseline` | — | national baseline, area heat | — | — |

† Wave 2 reasoning layers (V5) — registry keys `consequence-choropleth`, `triage-state`, `contested-ground` (map-agent `wave2: true` entries today).

**Fuel-gated (R4 — host refuses mount layer set until credentials):** Cotality comps/rent-heat, hydrology Cotality forcing, `calibrated-accuracy` (V6).

### 6. Data plane (shared with floating map — no fork)

| Need | API | Auth |
|---|---|---|
| Layer GeoJSON / mesh | `POST /api/brokerage/v1/map-data/gis-layer` | Bearer / X-Hauska-Key |
| Composite reasoning | `POST …/map-data/composite-layer` | tier-gated |
| Viewport assemble + overlays | `POST …/map-data` | max tier |
| Layer catalog | `GET …/map-data/gis-layers` | operator |
| Place context | `POST …/place/resolve`, `GET …/place/:key/layers` | brokerage auth |
| W warmed slots | W2 cache read (Wave 2 — same slot shape as live) | engagement-scoped |

Embedded maps **must** consume the same `EngineEnvelope` slot shape as floating maps. F4/V4 read-contract is mandatory before honesty-critical layers render (width-as-saturation).

### 7. R1 acceptance criteria (for Wave 2/4 build)

- [ ] Cortex report host implements `ReportEmbedMapHost` + `embedded-static` mount only (no FSM).
- [ ] `resolveLayerAllocation({ appId: 'cortex', reportType })` returns distinct layer set from `radar` for the same report body (R6).
- [ ] Same renderer module as spine console E6 / extension map (V1).
- [ ] No bare scalar confidence in map legend or parcel popup after F4/V4 (width + provenance required).
- [ ] Warming and on-demand report generation bind identical slots (R2).

---

## Gap analysis contradictions (F4 / R rows — cc-agent-R verify)

| Gap row | Hypothesis in `03_gap_analysis.md` | Live ground truth (2026-06-21) | Rewrite |
|---|---|---|---|
| **F4** | "Wide refactor across … Cortex … EngineEnvelope" | **Confirmed** — 3 UI sites + 13 API families + 2 atom regs in Cortex lane; `EngineHonestyChrome` is the main buyer-facing renderer | Confirmed GAP; Cortex slice is smaller than 46 MCP tools but includes chat agent + map-data |
| **F4** | "confidence is a scalar" | Findings: **both** scalar (`findings.confidence`) **and** `engineHonesty.confidence.value` on wire; UI shows honesty slice when present, not bare finding scalar | Partial nuance — dual path makes F9 + F4 migration harder |
| **F9** | "Plan-review confidence still LLM-emitted" | **Confirmed for Cortex Findings tab** — same `findings.ts` mapper; overlay API exists but not wired to display | Confirmed GAP |
| **R reporting** | "embedded-map … absent" | **Confirmed** — Cortex uses Leaflet `SiteMap`; no MapLibre embed; no allocation | Confirmed GAP; R1 contract now defined |
| **R reporting** | "Reports exist … read-contract-on-every-claim absent" | Briefing narrative + findings text have **no** read-contract; encumbrance % is bare scalar | Confirmed GAP |
| **R / V** | "Map exists … registry and per-app allocation absent" | **Confirmed** — `hauska-map` has static `LAYER_REGISTRY`; no `resolveLayerAllocation` | Confirmed; R6 blocked on V3 |
| **Briefing status** | (not listed) | Handler persists `engineHonesty` on jobs; **OpenAPI omits field** | New drift row — spec/code mismatch |
| **Cortex vs Codex** | Gap lumps "Codex review, Cortex L1-L6" | Cortex **does not** import `LowConfidencePill`; Codex plan-review does — shared API, different UI reach | Clarify per-repo F4 propagation ownership |

---

## Proposed Wave 2 / Wave 3 task list (cc-agent-R lane + dependencies)

### Wave 2 (can start when F4 type lands from cc-agent-AC)

| Task | Unit | Owner | Depends on | Blockers |
|---|---|---|---|---|
| **F4-Cortex-UI** | Migrate `EngineHonestyChrome` + EncumbrancesPanel to read-contract; remove bare `%` formatters | cc-agent-R | cc-agent-AC F4 type | **F4 type** |
| **F4-Cortex-API** | Propagate read-contract on findings/briefing/encumbrance wire; deprecate bare `Finding.confidence` accessor in zod | cc-agent-R + cc-agent-C | F4 type | F4 type |
| **F4-chat-agent** | `list_findings` / task tools emit read-contract JSON, not raw scalar | cc-agent-R | F4 type | F4 type |
| **S5** | Consequence-gated routing stub — label asserted routing on high-consequence stratum | cc-agent-R | **F2** consequence metadata | **cc-agent-E F2** |
| **V3** | Dynamic registry + `resolveLayerAllocation(appId, reportType)` | map-agent | V1 ✓ | None |
| **V4/V5** | Read-contract map consumption + reasoning layers | map-agent | F4, F2, F5, V3 | F4 long pole |
| **R1-impl** | Shared `@workspace/map-embed` host adapter implementing §3 lifecycle | cc-agent-R + map-agent | V1, V3 draft, R1 contract ✓ | V3 resolver |
| **OpenAPI drift** | Add `engineHonesty` to briefing generation status/runs schemas | cc-agent-C or cc-agent-R | — | None (quick) |

### Wave 3 (measurement gate — mostly not cc-agent-R)

| Task | Unit | Owner | Depends on | Blockers |
|---|---|---|---|---|
| **M1** | Measurement A/B | cc-agent-C + planner | F1, F2, F3, F7, K2 | K1, F-track |
| **K6** | Calibration provenance in read-contract | cc-agent-AC | F4 | M1 design |
| **V6** | Calibrated-accuracy layer | map-agent | M1, X | Fuel |

### Wave 4 (reporting surface — after Wave 2 map + F4)

| Task | Unit | Owner | Depends on | Blockers |
|---|---|---|---|---|
| **R2** | Unify warming + reporting pipeline (two mount contexts) | cc-agent-C | W1, R1-impl | W1 harness |
| **R3** | Cortex site-bound deliverables + site-context + hydrology embeds | cc-agent-R | R1-impl, V5, W2 | W2 parcel universe optional for instant render |
| **R6** | Per-report per-app allocation through V3 | cc-agent-R | V3, R1-impl | V3 |
| **R4** | Fuel-gated Cotality / calibrated-accuracy report maps | cc-agent-R | Cotality cache, X, M1, V6 | Credentials + M1 |
| **R5** | Planned-corpus reports (subsurface, precedence, plan-set locator) | cc-agent-C2 + cc-agent-E | corpus engines | Master roadmap streams |

**Named blockers for cc-agent-R:**

1. **F4 read-contract type (cc-agent-AC)** — blocks all propagation and honest map legend.
2. **V3 `resolveLayerAllocation` (map-agent)** — blocks R1 implementation and R6.
3. **F2 consequence metadata (cc-agent-E)** — blocks S5 and consequence choropleth in report allocations.
4. **W1/W2 warming (cc-agent-C)** — blocks R2 instant render and R3 warm-cache embed path.
5. **F9 adjudication loop (cc-agent-C)** — blocks honest findings confidence on Cortex Findings tab.

---

## What this wave did **not** build (explicit)

- No embedded map in any Cortex report or deliverable letter
- No F4 code changes in design-tools or api-server
- No S5 routing implementation
- No new OpenAPI commits for briefing `engineHonesty` drift

---

## Handoff to map-agent (V3)

Please treat §4 `resolveLayerAllocation` + §5 binding table as the seed config for V3 YAML. cc-agent-R will import the resolver from the map package (or shared `@workspace/map-registry` once extracted) in Wave 2 R1-impl. Allocation keys use `appId:reportType` unless R6 overrides are added later.
