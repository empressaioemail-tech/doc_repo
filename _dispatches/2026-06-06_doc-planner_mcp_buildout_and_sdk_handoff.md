---
id: 2026-06-06_doc-planner_mcp_buildout_and_sdk_handoff
title: Handoff — flesh out MCP build-out + SDK completion plan, author execution dispatches
date: 2026-06-06
agent: doc_repo planning agent (planner-to-planner handoff)
repo: doc_repo
kind: dispatch
related: [52_mcp_offer_and_buildout, 50_hauska_mcp_server, 16_commercialization_roadmap, 14_pricing_framework, 72_hauska_inc_operations, _research/2026-06-06_cross_repo_recon, _decisions/2026-06-06_v1_tier_pricing_decision_b]
---

# Handoff — MCP build-out + SDK completion planning

> **Trail note.** Planner-to-planner handoff sent by the operator 2026-06-06 to a second doc_repo planning agent, so this session stays free for high-level planning. Anchored on [`52_mcp_offer_and_buildout.md`](../52_mcp_offer_and_buildout.md). Status: **sent, in progress.**

## Scope

Take [`52_mcp_offer_and_buildout.md`](../52_mcp_offer_and_buildout.md) (the captured current MCP offer, the built-but-not-offered gap, Tier 1/2 build-out, SDK punch list, and build-before-launch sequence) and do the detailed follow-on planning plus author the execution dispatches.

## Tasks

1. **Verify before specifying** (doc set lags code): grep cortex-api for the brief pipeline, hydrology/site-drainage, site-context adapter, site-topography entry points; grep `hauska-mcp-server` for the tool-registry pattern; check `hauska-sdk` live state (Circle stub `generateFiatCheckoutUrl`, revenue-routing absence). `gh pr` where status is in doubt. Paste verbatim.
2. **Cross-link 52** into `50_hauska_mcp_server.md`, `16_commercialization_roadmap.md` (build-out lane preceding launch steps; Decision C stays pinned), and `00_current_state.md`. Bump `last_updated` where substantive.
3. **Flesh out Tier 1 tool specs** (per tool: wrapped cortex-api/engine endpoint, product + tier, atom shape, gate). Lead with `generate_property_brief`. Cotality tier designed-but-inert until CoreLogic credential activation.
4. **Author the SDK completion plan** (recommend a home per 52 section 6; sequence the five punch-list items as a sprint with acceptance criteria; make the Circle-rail to first-paid-revenue dependency explicit).
5. **Draft execution dispatches** (operator hands them out): cc-agent-M (Tier 1 MCP tool wraps), cc-agent-C (cortex-api endpoint exposure if needed), hauska-sdk owner (Circle rail + revenue routing + metering + tests). Use `_dispatches/_template.md`.

## Constraints

- Honor the 52 section 5 sequence: capture (done) -> Tier 1 MCP build-out -> finish SDK -> then unpin Decision C. Nothing moves toward public launch; Decision C stays pinned in `_catalog/ops/gtm_launch_channel_plan_v1.yaml`.
- Do not relitigate settled items (Decision B pricing, brand placement, tier model).
- Run `premortem-check` on the build-out (tool tier placement + metering touch the sell-reasoning load-bearing commitment).
- Doc conventions (frontmatter, no em/en dashes in body, edit-in-place + bump, source attribution). Shared-clone hazard: `git log -3` before commit, explicit paths, skip CRLF phantom-dirty files.

## Deliverables

Updated 50/16/00_current_state cross-links; fleshed Tier 1 tool specs; SDK completion plan doc/section; three `_dispatches/` artifacts. One commit batch, presented for operator review before push.

## Note on division of labor

This handoff agent does the detailed capture + dispatch authoring. The originating session (Claude Code planner) remains on high-level planning and operator-block tee-up; coordinate through the operator.
