---
id: 2026-06-01_shared_engines_vision_and_current_state
title: Shared engines — vision vs current state (plan review + property intelligence)
date: 2026-06-01
status: active
applies_to: portfolio
related: [47_codex_plan_review, 44_mcp_cortex_architecture_map, 80_adrs/adr_008_engine_factor_out, 09_post_saas_substrate_thesis, 08_tiered_access_model, 50_hauska_mcp_server, 28_mcp_first_product_design]
---

# Shared engines — vision vs current state

> Planning anchor for the realignment session ahead of the sprint later this week. Two diagrams: the destination (two shared engines on the Hauska substrate, consumed by every app, context gated per app tier) and the verified-today topology. The delta between them is the realignment agenda, captured in the final section.
>
> **Sourcing.** Current-state diagram is drawn from [`44_mcp_cortex_architecture_map.md`](../44_mcp_cortex_architecture_map.md) (code-verified 2026-05-20, updated 2026-05-22). That map flags a post-deploy topology refresh as owed; items marked "recon owed" below should be re-verified against the live repos as the first task of the sprint. Vision placement is checked against [`adr_008_engine_factor_out.md`](../80_adrs/adr_008_engine_factor_out.md), [`08_tiered_access_model.md`](../08_tiered_access_model.md), and [`09_post_saas_substrate_thesis.md`](../09_post_saas_substrate_thesis.md).

## The two engines

1. **Plan review engine** — compliance pass against jurisdiction code, parcel, neighbor, and firm-precedent context. Already conceived as one engine across surfaces and being factored into `hauska-engine` per ADR-008. Mode separation (fast incremental vs full pass) still aspirational; one code path today.

2. **Property intelligence engine** — reasoning over property layers: flood/hydrology ("what happens to this property with 4 inches of rain"), environmental, parcel, hazard, site context. Today welded inside `cortex-api`, not factored out at all.

The motivating principle from the operator: both engines shared across all current and future apps, with **context gated per app tier**. That gating mechanism already exists (the MCP server product gate plus accessPolicy plus the Layer 1 / Layer 2 tier model); the work is to route both engines through it, not to invent it.

---

## Diagram A — Vision (destination)

```mermaid
%%{init: {'theme': 'dark', 'flowchart': {'nodeSpacing': 40, 'rankSpacing': 55}}}%%
flowchart TB
    subgraph APPS["PRODUCT SURFACES — Empressa apps (consume, never own, the engines)"]
        direction LR
        CORTEX["Cortex (architect)<br/><i>fn: design-side brief + incremental compliance view</i>"]
        CODEX["Codex (reviewer)<br/><i>fn: full-pass plan review, code lookup</i>"]
        SCOS["SmartCity OS (city)<br/><i>fn: city plan review + dashboards</i>"]
        BRIEF["Hauska Brief ext (broker)<br/><i>fn: property brief for a parcel</i>"]
        FUTURE["Future apps<br/><i>fn: TBD, same contract</i>"]
    end

    GATE["HAUSKA MCP SERVER — the gating boundary<br/><b>fn: one process, many tools; product + accessPolicy + tier gate AT CALL TIME</b><br/>(this is where 'context gated per app tier' is enforced)"]

    subgraph ENGINES["SHARED ENGINES — Hauska substrate (hauska-engine)"]
        direction LR
        PRE["PLAN REVIEW ENGINE<br/><b>fn: compliance pass</b><br/>parcel + neighbor + firm precedent context<br/>incremental (fast) vs full (30-120s) modes<br/>emits: finding atoms"]
        PIE["PROPERTY INTELLIGENCE ENGINE<br/><b>fn: reasoning over property layers</b><br/>flood/hydrology ('4in rain'), environmental,<br/>parcel, hazard, site context<br/>emits: scored prediction atoms"]
    end

    ENV["REASONING ENVELOPE — applied to every output<br/><b>fn: reasoning chain + source citation + confidence score + timestamp</b><br/>(sell reasoning, not data)"]

    CONTRACT["@hauska/atom-contract<br/><b>fn: the atom shape every layer speaks</b><br/>carries accessPolicy (Layer 1 free / Layer 2 paid)"]

    subgraph DATA["SUBSTRATE DATA"]
        direction LR
        CORPUS[("hauska-engine corpus (Neon)<br/><i>fn: jurisdiction code + property atoms</i>")]
        PUBAPI["Public national APIs<br/><i>fn: Layer 1 inputs — FEMA, USGS,<br/>USDA, USFWS, FCC, Regrid</i>"]
        PARTNER["Partnership-sourced data<br/><i>fn: city operational corpus (Bastrop template)</i>"]
    end

    CORTEX --> GATE
    CODEX --> GATE
    SCOS --> GATE
    BRIEF --> GATE
    FUTURE --> GATE

    GATE --> PRE
    GATE --> PIE

    PRE --> ENV
    PIE --> ENV
    ENV --> CONTRACT

    PRE -.consumes.-> CONTRACT
    PIE -.consumes.-> CONTRACT
    CONTRACT --> CORPUS
    PIE -.pulls Layer 1.-> PUBAPI
    PRE -.pulls.-> PARTNER
    CORPUS --- PUBAPI

    classDef gate fill:#3a2d00,stroke:#d4a200,color:#fff;
    classDef engine fill:#04293a,stroke:#3aa0d4,color:#fff;
    classDef env fill:#2a0a2a,stroke:#c050c0,color:#fff;
    class GATE gate;
    class PRE,PIE engine;
    class ENV env;
```

What the vision asserts, made explicit:

The MCP server is the only place gating happens. Apps do not decide what context they receive; the gate does, per product key and tier. That is why "future apps, same contract" costs almost nothing to add.

The reasoning envelope sits between the engines and the contract on purpose. It is the layer that converts raw data into a sellable Layer 2 output. The "4 inches of rain" answer is not a data lookup; it is the property-intelligence engine reasoning over Layer 1 flood inputs and wrapping the result in citation plus confidence.

Both engines live in the Hauska substrate, not in any product. Per ADR-008, catalog, MCP server, atom substrate, and reasoning layer attribute to Hauska; product surfaces attribute to Empressa.

---

## Diagram B — Current state (verified topology, 2026-05-22 baseline)

```mermaid
%%{init: {'theme': 'dark', 'flowchart': {'nodeSpacing': 38, 'rankSpacing': 50}}}%%
flowchart TB
    subgraph APPS["Product surfaces today"]
        direction LR
        SPA["Browser SPAs<br/>design-tools / plan-review / qa<br/><i>fn: Cortex + Codex UI</i>"]
        REVIT["Revit add-in (C#)<br/><i>fn: model ingest</i>"]
        BRIEFEXT["Hauska Brief extension<br/><i>fn: broker property brief</i>"]
        SCOS["SmartCity OS (Bastrop)<br/><i>fn: city platform, own plan-review surface<br/>embeds Prophecy VENDOR chat</i>"]
    end

    CORTEX["cortex-api (Cloud Run, LIVE)<br/><b>fn: HOLDS plan-review engine AND<br/>prop-intel / brief engine</b><br/>self-contained; still on @workspace/empressa-atom"]
    MCP["hauska-mcp-server (hauska-prod)<br/><b>fn: 40 tools, product gate at call time</b><br/>imports atom-contract TYPE-ONLY"]
    ENGINE["hauska-engine retrieval API<br/><i>fn: catalog retrieval</i><br/>reported live 2026-05-22 — wiring/coverage RECON OWED"]

    subgraph NEON["cortex-prod Neon"]
        direction LR
        NEONDB[("neondb<br/>Cortex domain + code_atoms +<br/>briefing_sources + L-surface atoms")]
        MCPDB[("hauska_mcp<br/>api_keys")]
    end
    SUBSTRATE[("substrate Neon (separate)<br/>jurisdiction corpus atoms")]
    EXT["Public APIs<br/>FEMA USGS EPA FCC Regrid geocoder"]
    ANTH["Anthropic API"]
    CONTRACT["@hauska/atom-contract"]

    SPA --> CORTEX
    REVIT --> CORTEX
    BRIEFEXT --> CORTEX
    SCOS -. not wired to shared engines .- CORTEX

    MCP -->|"Bearer SERVICE_API_KEY — L-surface, ONE-DIRECTIONAL"| CORTEX
    CORTEX -.->|"QA-17 Code-Library outbound (mock-mode default)"| MCP
    MCP --> MCPDB
    MCP -. type-only .- CONTRACT
    MCP --> ENGINE
    ENGINE -. SQL .-> SUBSTRATE
    CORTEX --> NEONDB
    CORTEX --> EXT
    CORTEX --> ANTH

    classDef live fill:#04293a,stroke:#3aa0d4,color:#fff;
    classDef owed fill:#3a1500,stroke:#d46a00,color:#fff;
    class CORTEX,MCP live;
    class ENGINE owed;
```

What is actually true today:

Both engines live inside `cortex-api`, an Empressa product surface. The plan-review pass and the prop-intel / brief pass are the same self-contained backend, not substrate components.

The MCP-to-cortex edge runs backwards from the vision. `cortex-api` is a one-directional data provider into the MCP layer over the L-surface; it consumes nothing back. The QA-17 Code-Library outbound path (mock-mode default) is the only hint of inversion and it is not real data yet.

`cortex-api` has not migrated from `@workspace/empressa-atom` to `@hauska/atom-contract`. That migration is the tracked can-kick and it blocks clean extraction.

SmartCity OS is not wired to the shared engines at all. It runs its own surfaces and embeds the third-party Prophecy chat. Codex 1b is the planned bridge.

The Hauska Brief extension talks to `cortex-api` directly, not through the MCP gate. So per-tier gating is not actually enforced at the substrate boundary for the brokerage surface yet.

---

## The delta — realignment agenda

The gap between Diagram B and Diagram A is the work. Ordered by dependency, not by calendar.

1. **Re-verify the post-deploy topology.** The 2026-05-22 map flags this as owed. Confirm `hauska-engine` retrieval API deploy state, coverage, and live wiring; confirm `hauska-mcp-server` hauska-prod state; confirm whether QA-17 is still mock-mode. This is the first sprint task because every downstream decision rests on it.

2. **`hauska-engine` is the spine and the chokepoint.** Both engines and the entire catalog surface depend on it. Its real coverage gates everything in Diagram A.

3. **Extract the engines out of `cortex-api` into the substrate.** ADR-008 places them in the Hauska layer. This is the largest structural move and it requires inverting the MCP-to-cortex edge so cortex becomes a consumer of its own former logic.

4. **`cortex-api` atom-contract migration.** The can-kick. It is the unlock that lets engine logic move to the substrate without a rewrite.

5. **Route the Hauska Brief extension through the MCP gate.** Today it bypasses the gate by calling cortex-api directly, so per-tier gating is not enforced for the brokerage surface.

6. **Bridge SmartCity OS to the shared engines.** Codex 1b is the planned path; today the city platform consumes nothing from the substrate.

7. **Verify the reasoning envelope is uniformly applied.** Chain plus citation plus confidence plus timestamp is a structural commitment; enforcement across all surfaces is unverified and should be confirmed, not assumed.

## Open fork carried into the session

Where the property-intelligence engine lives is the one genuine architectural fork. Path A (extract into `hauska-engine`, thesis-correct, gated on the deploy and the migration) versus Path B (leave it in cortex-api and let apps call the L-surface, faster but makes an Empressa surface the shared engine, ADR-008 conflict). Recommendation on record is Path A as the destination with a staged route. Run premortem-check formally before this locks into an ADR or a sprint commitment.
