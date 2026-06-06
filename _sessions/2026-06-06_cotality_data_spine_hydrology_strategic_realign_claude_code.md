---
id: 2026-06-06_cotality_data_spine_hydrology_strategic_realign
title: Session — Cotality data spine, Cortex hydrology, strategic-core realignment
date: 2026-06-06
agent: claude_code (doc_repo planner)
kind: session
related: [00d_portfolio_roadmap_reference, 03_structural_constitution_and_drift_guard, 04_roadmap_alignment_audit, 77b_cotality_integration_strategy, 40d_cortex_site_context_sprint, _decisions/2026-06-06_cotality_parcel_provider, _decisions/2026-06-06_engine_extraction_unfrozen]
---

# Session — Cotality data spine, Cortex hydrology, strategic-core realignment

Long multi-thread session. Three workstreams advanced: the strategic-core theology was filed and the roadmap realigned; the full Cotality data spine was cataloged, built (by cc-agent-C), and integration-strategized; the Cortex hydrology engine was dispatched and landed. Everything substantive is committed and pushed to `origin/main`. The one open external dependency is the Cotality OAuth credential.

## What landed (committed)

**Strategic-core realignment (`af36ed5`).** Filed the theology into the doc set: [`03_structural_constitution_and_drift_guard.md`](../03_structural_constitution_and_drift_guard.md) (10 invariants + 8-question drift method), [`03a_positioning_framework.md`](../03a_positioning_framework.md) (two roots: calibration + sovereignty), [`03b_thought_leadership.md`](../03b_thought_leadership.md). Added [`00d_portfolio_roadmap_reference.md`](../00d_portfolio_roadmap_reference.md) as the honed planned-work roadmap; retired and reconciled `11_roadmap.md` (status flipped to superseded, banner added, content preserved). Filed [`04_roadmap_alignment_audit.md`](../04_roadmap_alignment_audit.md) with the 7-item audit frame, arrow-two calibration capture ranked priority #1.

**Two operator decisions logged (`af36ed5`).**
- [Cotality over Regrid](../_decisions/2026-06-06_cotality_parcel_provider.md) — Cotality is the data spine for the browser extension + Cortex/Codex viability (national public-records aggregator, out of partnership-first scope per the 2026-05-23 clarifier; premortem cleared).
- [Engine extraction unfrozen](../_decisions/2026-06-06_engine_extraction_unfrozen.md) — reverses audit item 6; ADR-008 is dealt with (build the spine clean) rather than frozen behind a first paid call, but sequenced behind M-Stabilize 2C and the wedge ship so it does not pull build attention off shipping. Adjacency firewall (trading/issuance/PE/IBKR) retained.

**Cotality data spine (`8cea89a`→`4553d9f`).** Full API surface cataloged ([`_research/2026-06-06_cotality_api_surface_catalog.md`](../_research/2026-06-06_cotality_api_surface_catalog.md)); verbatim Comet docs + 10 swagger specs indexed ([`_research/cotality/`](../_research/cotality/)); integration strategy filed ([`77b_cotality_integration_strategy.md`](../77b_cotality_integration_strategy.md)). cc-agent-C built the **full 8-adapter data layer** (parcels+polygon, zoning, property, climate, hazards, replacement-cost, mineral/O&G, utility) — **264 tests green, typecheck clean, PR #141 held**, token-gated. MCP setup runbooked ([`90_runbooks/cotality_mcp_setup.md`](../90_runbooks/cotality_mcp_setup.md)), token-blocked. Key resolutions: parcel polygon = Spatial Tile (not Property V2 centroid); climate = demo-reachable (not premium-eval-gated); O&G = SpatialRecord tiers. Confirmed env constants live in the data-layer-pack inbox close.

**ICC Code Connect captured (`4553d9f`).** [`_research/icc/2026-06-06_icc_code_connect_api_findings.md`](../_research/icc/2026-06-06_icc_code_connect_api_findings.md) — plane-A / Codex model-code feed; OAuth bearer, partner-pilot; needs ICC creds + partner onboarding. Contract moving forward (operator).

**Cortex hydrology engine — dispatched (`8ecd0b2`) and landed.** cc-agent-C built 40d Phase 2D.2 (drainage) + 2D.3 (rainfall sim) on branch `cortex/hydrology-engine`. Library: **pysheds** (not WhiteboxTools — lighter Cloud Run packaging) with a TS D8 native fallback. NOAA Atlas 14 PFDS forcing live; Cotality flood-depth overlay hook present but inert (`useCotalityForcing` default false, per 77b §2); `site-drainage` tenant-private atom (ADR-017); briefing integration wired. **Typecheck + unit tests green; PR held, uncommitted on branch.** Report: [`_inbox/2026-06-06_legacy-design-tools_cc-agent-C_cortex_hydrology_engine.md`](../_inbox/2026-06-06_legacy-design-tools_cc-agent-C_cortex_hydrology_engine.md).

## The Cotality auth blocker — current diagnosis

The single open external dependency. The OAuth2 `client_credentials` token throws `Invalid client identifier` across every host/request-shape tried (catalog has the full matrix). **Operator insight at session close (the likely root cause):** the Cotality eval app was signed up under **`nick@hauska.io`**, not `empressaioemail@gmail.com`. OAuth uses the `client_id`/`client_secret` pair, not an email login — but that pair is bound to the developer account that created the app. If the key/secret currently in Secret Manager came from the old demo signup (or a different account), the mismatch is exactly the `Invalid client identifier` symptom.

**The fix (next-agent / operator, mechanical):** log into `developer.corelogic.com` as `nick@hauska.io`, copy the eval app's `client_id` + `secret` with the portal copy buttons, overwrite the two Secret Manager secrets (`COTALITY_PROPERTY_KEY`, `COTALITY_PROPERTY_SECRET`), re-mint the token. This supersedes the earlier Comet-read-back / Michelle-escalation path.

Michelle's 30-day API eval is live (100 property calls/day + 25 AVM/day) and the Michelle reply was sent (operator confirmed item 1 done). Use-case paragraph for the MCP eval / Permissible Use Committee was drafted this session (in chat).

## Open threads / next-agent handoff

1. **Cotality token** — apply the `nick@hauska.io` credential re-copy above. This is the single gate for all live Cotality smoke + PR #141 merge + the Cotality MCP connection.
2. **PR #141 (Cotality 8-adapter data layer)** — held; merge after token works + smoke. Do not surface Cotality fields in the consumer extension until license/PUC clears.
3. **Cortex hydrology PR** — held on `cortex/hydrology-engine`, uncommitted. Smoke "4 inches" on 1904 Heathwood Cir with DB + GCS. Prod needs `artifacts/hydrology-worker/requirements.txt` + `python3` in the Cloud Run image, else native D8 fallback runs.
4. **Cotality PUC data-protection one-pager** — Gene (sales engineer) asked for a written architecture/data-protection writeup for the Permissible Use Committee; a prior deal died at that gate. Draft offered, not yet written.
5. **Arrow-two calibration capture** — ranked priority #1 in 00d/04, still has no canonical home or atom-first dispatch. Offered to scaffold, not yet done.
6. **Cortex MCP (`user-hauska-cortex`)** errored at cc-agent-C dispatch start (fell back to docs). Worth checking.
7. **ICC/Forrest transcripts** — filed; not re-mined for fresh action items this session.

## Verification

```
HEAD 8ecd0b2 = origin/main (0 0); working tree clean (CRLF phantoms only, 0 real diff)
af36ed5 docs(realign): file strategic-core theology, add 00d, retire+reconcile 11_roadmap, log Cotality-over-Regrid + engine-extraction-unfreeze
8ecd0b2 docs(cortex): dispatch hydrology engine
```
