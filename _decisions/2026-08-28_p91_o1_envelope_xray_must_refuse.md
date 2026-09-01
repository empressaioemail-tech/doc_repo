---
decision_id: 2026-08-28_p91_o1_envelope_xray_must_refuse
date: 2026-08-28
owner: planner
status: active
related_canonical:
  - _inbox/2026-08-28_p91_o1_producer_read.md
  - _inbox/2026-08-28_p91_o1_paired_probe.md
  - _inbox/2026-08-28_smartsite_mcp_app_WDLL.md
  - _inbox/2026-08-28_smartsite_mcp_app_v1_scope.md
  - _decisions/2026-08-28_smartsite_mcp_app_screen_save_decouple.md
  - _decisions/2026-07-23_pe_envelope_atom_spine_and_post_map_truth_pickups.md
  - _catalog/thesis_parity_ledger.md
---

## Decision

Ruling B. The X-ray must refuse buildable envelope the same way `get_smart_site` refuses it (`atom_path_pending` / `envelope.kind: "not-derived"`). MCP does not serve a lot-percentage from live `deriveBuildableEnvelope`. There is no buildable-envelope atom or bake facet MCP can serve with matching provenance. The board and parcel panel do not print a buildable percentage until that atom path is live and both surfaces read it.

## Context

P-91 item 7 (O1) required an A-or-B ruling before the MCP App iframe ships. The X-ray on `48021:33223` has been observed as "Buildable (approximate), 42% of the lot" while gold and the MCP draw overlay refuse envelope. [O1 producer read](c864e21a-0997-4188-8545-5fbb2734f851) recommended B. Planner re-read the write paths this session on LDT `5a20f61d` (`legacy-design-tools-p91-cite`) and hauska-map `parcel-fact-sheet` / `live-envelope-augment.ts`. The 42 percent figure itself remains an operator observation with no filed X-ray JSON; the ruling does not depend on that number.

Alternatives: A would have MCP call the same live derive and emit `buildableAreaPct`. Rejected. That re-opens O2 (corner-lot / road-class inset) and contradicts the honest refuse already on the gold draw.

## Structural commitment check

Sell reasoning, not data: a lot-percentage without an atom producer is a number, not a cited claim.
Confidence is earned: live inset from setback tables is not an earned envelope atom.
Cost per jurisdiction: no new ingest.
Dual interface: MCP and X-ray must agree on the same fact class; a Studio-only percentage is the defect O1 named.

## Reasoning

`computeTier1Envelope` always returns `status: "declined"` with `atom_path_pending` (or `no-zoning-stamp`). `assembleParcelDraw` always emits overlay `id: "envelope"` as `state: "refused"` with `reason` defaulting to `atom_path_pending`. It never calls `deriveBuildableEnvelope`. `get_smart_site` reads that R1/draw path.

The X-ray path is different. When atom-chain facets carry `envelope.status === "ok"` plus setback scalars, `facetsNeedLiveEnvelopeDerive` is true and `fetchLiveEnvelopeDerive` POSTs `…/place/buildable-envelope`. `deriveBuildableEnvelope` computes `buildableAreaPct` from `labelEdges` plus `insetFeetForLabeling` (road-class table only for Bastrop P-5; otherwise flat district scalars). `composeVerdict` then prints "Buildable (approximate), N% of the lot" when `envelope.kind` is derived.

The 2026-08-24 Option C close named `labelEdges+derive` as the geometry composer so stale atom geojson and client insets would not compete. It did not authorize a second surface to print that inset as a customer percentage while MCP refuses, and it did not settle O2. Anti-zombie (2026-07-23) retired bake-authored envelope confidence. Serving the live pct on X-ray only is the side door that makes the two surfaces disagree.

Second mechanism rejected: the percentage is a baked or atom-chain field MCP already has. Bake never writes pct. Atom-chain adaptation withholds geometry. MCP R1 after strip has no pct on the wire.

## Reversal criteria

Revisit to ruling A only when a `buildable-envelope` atom (or successor) is live on the parcel, MCP `get_smart_site` serves the same `buildableAreaPct` with the same provenance refs, and O2 no longer forbids printing setback-derived geometry on the gold class of corner lots. A paired live probe that showed MCP already emitting the same pct as the X-ray would falsify this read and force a new ruling.

## Dependencies

WDLL item 7 stays partial. Paired probe filed `_inbox/2026-08-28_p91_o1_paired_probe.md`: MCP refuse measured on `48021:33223`; composed X-ray (`kind` / `areaPctOfLot` / verdict) unmeasured. Item 8 still holds. Wave C iframe stays blocked until the X-ray refuse is serving and that composed sheet is graded, not merely until this record exists. Persistence tools (Wave B) do not wait on the X-ray change.

## Counterparties

Internal. Operator. Studio X-ray and Smart Site MCP App reviewers see the same envelope refusal.
