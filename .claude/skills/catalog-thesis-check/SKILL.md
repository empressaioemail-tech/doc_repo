---
name: catalog-thesis-check
description: "Verify any new product, feature, commercial move, or architectural decision against the Hauska catalog thesis and the four structural commitments. Use this skill whenever the conversation involves brand placement, naming, tier positioning, MCP architecture, atom contract scope, or product line positioning. Trigger on phrases like 'is this Empressa or Hauska', 'should this be free or paid', 'how should we name', 'where does this fit in the product line', or whenever the operator proposes something that could conflict with settled decisions in the doc set."
---

# Catalog Thesis Check

Verifies proposed moves against the canonical Hauska catalog thesis and settled architectural decisions.

## When this triggers

When the conversation touches brand placement, naming, tier positioning, MCP architecture, atom contract scope, product line positioning, or any decision that could conflict with settled architecture in the canonical doc set.

## What this checks

### Brand placement (ADR-008)

Catalog, MCP server, atom substrate, reasoning layer attribute to Hauska layer. Product surfaces attribute to Empressa. SmartCity OS, Cortex, Codex (plan review and code intelligence), Revit Connector are Empressa product surfaces. Hauska Engine, Hauska SDK, Hauska MCP Server, atom contract are Hauska layer.

If proposed move places catalog or substrate work under Empressa, flag as conflict with `80_adrs/adr_008_engine_factor_out.md`.

### Codex naming (2026-05-16 update)

Codex is the product brand covering plan review AND code intelligence capability per the 2026-05-16 decision. The building-code-lookup surface IS Codex, sitting on Hauska MCP Server tools, free at Layer 1 per `08_tiered_access_model.md`.

This supersedes the earlier framing that reserved Codex for plan review only. If a doc or proposal still says "Codex refers only to plan review", flag as out of date.

### Tier model (08_tiered_access_model.md)

Layer 1 atoms (bare code references, FEMA, USFWS, USGS, ICC code text where licensing permits, RRC public records) are free with maximum distribution. Layer 2 atoms (context-enriched: adjudication-record, per-reviewer-pattern, comparable-project-precedent) are paid.

If proposed move inverts this (paywalls Layer 1, free Layer 2), flag as conflict with 08.

### MCP architecture (51_substrate_v1_sprint.md settled)

v1 is one MCP server with many tools. Per-atom MCP split is v2 evolution only if listing visibility or per-domain branding becomes a growth lever.

If proposed move ships separate MCP servers per atom in v1, flag as conflict with 51.

### MCP-first product design (28_mcp_first_product_design.md)

Net-new products ship MCP-first with UI as second surface. Existing UI-first products retrofit MCP as a tracked roadmap item. Every product surface lands an MCP ship date in its program plan.

If proposed move ships a net-new product UI-first without an MCP plan, flag as conflict with 28.

### Web UI per atom (settled)

Deferred to v2 at the catalog level. v1 catalog surface is MCP server only. Per-product UI follows per-product roadmap.

If proposed move adds catalog-level web UI work to v1 scope, flag as scope creep.

### Active sprint awareness

Check `00_current_state.md` for the current list of in-flight sprints before flagging sprint capacity concerns. Sprints in flight as of last snapshot regeneration are listed there.

If proposed move competes for capacity with active sprints, flag for sequencing review.

## What this skill does not do

Does not check commercial viability, pricing specifics, or stakeholder politics. Those are separate conversations with Nick or Valerie.

Does not check technical implementation details. Those are reviewed in product repos, not here.

## Output format

For each applicable check, state: aligned / partial / conflict, with a one or two sentence justification.

If any conflict, do not recommend the move without explicit acknowledgment from the operator that the canonical doc set is being overridden. Some overrides are valid (the world changes); they should be conscious.

If only partials, proceed but name the items to clean up.

If all aligned, note the move passes thesis check and proceed.

End of skill.
