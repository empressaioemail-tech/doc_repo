---
id: 2026-05-21_e1_layer1_icc_source_blocker_cc-agent-E
title: Open Question — Lane E E1 Layer 1 ingest blocked on ICC structured-data access
date: 2026-05-21
agent: cc-agent-E
repo: hauska-engine
session_type: engineering
rolled_up: false
related: [2026-05-21_e1_layered_substrate_architecture_cc-agent-E, 80_adrs/adr_019_layered_code_substrate, 73_partnerships, _dispatches/2026-05-21_cc-agent-E_adr019_pipeline_and_sync5]
---

# Open Question — E1 Layer 1 ingest blocked on ICC structured-data access

## Pause and flag

Lane E Phase E1's Layer 1 model-code base ingest is paused. The ADR-019
interim deep-link footing assumed the section structure of the ICC
I-Codes could be ingested freely, with only the verbatim normative text
being the gated, copyright-exposed, deep-linked part. On contact that
assumption does not hold. There is no autonomously accessible, clean
source for the I-Codes' section structure and deep-link anchors. Per
the operator's E1 instruction this is a pause-and-flag, and it routes
to the ICC partnership track in [`73_partnerships.md`](../73_partnerships.md).

The layered-substrate architecture (E1.A, E1.B, E1.C.1) is complete and
merged and is unaffected. What is blocked is only the corpus-volume
ingest of the Layer 1 base.

## What was attempted

The ICC structural source was investigated autonomously, as instructed,
before escalating.

ICC's free Digital Codes viewer at `codes.iccsafe.org` is a
single-page application. The edition landing page, and chapter-level
pages, serve no section structure in their HTML at all: a fetch of the
2021 IRC chapter-3 page returns only the chapter heading and a
"Printing is a feature of Digital Codes Premium" subscription notice.
Zero section numbers or titles are retrievable from the served markup.
The structure is rendered client-side from a backend the page's
JavaScript calls.

ICC's documented programmatic access is the Code Connect API
(`api.iccsafe.org`, marketed at `solutions.iccsafe.org/codeconnect`).
It returns complete book contents as JSON, individual sections through
entire chapters per request. It is a paid commercial marketplace
product sold to organizations; it requires a license and API
credentials that cannot be self-provisioned. The developer pages
expose no free or open tier for structure-only access, and the
Code Connect demo endpoint (`api-dev.iccsafe.org/demo/`) redirects to a
host that returns 404.

There is therefore no clean autonomous path to the I-Codes' section
hierarchy, numbers, titles, and viewer deep-link anchors. The only
reliable structured source is the Code Connect API, which is the ICC
licensing relationship itself.

## Why this is a structural finding, not just a mechanism blocker

ADR-019 decoupled the interim deep-link substrate from the ICC and NFPA
partnership: the partnership was framed as the upgrade that unlocks
full-text *hosting*, while the interim footing "needs no legal
clearance to begin." The unstated assumption underneath that was that
the model-code *structure* — the chapter and section skeleton, as
distinct from the verbatim normative text — is freely ingestable, and
that only the verbatim text is gated.

The contact reality is that ICC serves no structure freely. The free
viewer paywalls its content layer behind a SPA, and the only structured
feed is the paid Code Connect API. So the Layer 1 ingest, even
structure-only on the interim deep-link footing, is in practice gated
on the ICC partnership or a Code Connect license. The interim footing
removes the copyright exposure of hosting text; it does not remove the
access dependency for obtaining the structure in the first place.

This bears on ADR-019 and on the partnership track's priority. It is
the planner's call whether ADR-019 takes a revision-history entry; this
session only surfaces the finding.

## What would unblock it

The clean unblock is access to the ICC Code Connect API, which comes
with the ICC partnership or licence in `73_partnerships.md`. The same
class of dependency applies to the NEC: NFPA's equivalent is NFPA LiNK,
a comparable commercial platform, so the NEC leg of the Layer 1 base
carries a parallel NFPA dependency.

A fallback exists but is not recommended as the primary path: a
hand-curated structural manifest per edition, assembled from free ICC
tables of contents, would supply hierarchy, numbers, and titles, but
not reliable viewer deep-link anchors, and it is heavy manual work
across the 30-to-40-edition base. The adapter built for the licensed
feed would consume the same manifest shape, so this fallback is
available later without rework if the operator wants to seed one or two
editions manually ahead of the partnership.

## State of Lane E

- E0 retrieval API: deployed in `hauska-prod-497015`, public, the 5 MCP
  catalog tools verified end to end, interim deploy torn down.
- E1 architecture: complete and merged (PRs #17, #18, #19) — the Layer
  2 overlay atom shape, the effective-rule composition engine, the
  Layer 1 deep-link footing field. The substrate is ready to receive
  Layer 1 atoms.
- E1 Layer 1 ingest: paused here, gated on ICC (and NFPA) structured-
  data access.
- E2 Sync 5: not started. Its Layer 3 bespoke-code ingests (zoning,
  UDC) do not depend on the Layer 1 base and are not blocked by this;
  its Layer 2 overlay ingests do reference Layer 1 base sections and so
  inherit this gate for the model-code-amendment portion.

## Recommendation

Route the Code Connect API access requirement into the ICC partnership
track in `73_partnerships.md` as a concrete, near-term ask: the
partnership conversation already exists for full-text hosting; this
finding adds that even the interim deep-link substrate needs Code
Connect access, which raises the partnership's priority from "upgrade"
to "unblocks Layer 1 entirely." If the operator wants Lane E to keep
moving while the partnership is worked, the available decision-
independent path is E2's Layer 3 city ingests (Sync 5 zoning/UDC), the
Hutto-shaped work, which needs no Layer 1 base.
