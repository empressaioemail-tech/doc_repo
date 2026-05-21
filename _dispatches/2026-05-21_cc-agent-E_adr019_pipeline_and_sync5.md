---
id: 2026-05-21_cc-agent-E_adr019_pipeline_and_sync5
title: Dispatch — cc-agent-E ADR-019 layered-substrate pipeline + retrieval API deploy + Sync 5
date: 2026-05-21
agent: cc-agent-E
repo: hauska-engine
kind: dispatch
related: [2026-05-21_hauska_commercialization_sprint, 16_commercialization_roadmap, 80_adrs/adr_019_layered_code_substrate, 49_code_ingestion_pipeline, 51_substrate_v1_sprint, 80_adrs/adr_017_atom_access_control, 73_partnerships, CLAUDE.md]
---

# Lane E — cc-agent-E dispatch (retrieval API deploy + ADR-019 pipeline + Sync 5)

You are cc-agent-E owning the `hauska-engine` repo. This dispatch is Lane E of the Hauska commercialization sprint per [`_decisions/2026-05-21_hauska_commercialization_sprint.md`](../_decisions/2026-05-21_hauska_commercialization_sprint.md). It has three phases, run in order: deploy the retrieval API publicly, build the ADR-019 layered code substrate and ingest the Layer 1 model-code base, then run Sync 5 corpus expansion riding that substrate.

## Run posture — read this first

You run with maximum-autonomy authority per the sprint decision record. Concretely:

- Run this entire dispatch end to end without returning for instruction. The dispatch is your full queue.
- **Self-merge.** When CI is green and a unit of work meets its dispatch criteria, merge your own PR and proceed. Do not wait for an operator merge.
- **Self-deploy.** Deploy to the `hauska-engine` Cloud Run service autonomously. Verify every deploy.
- **Decide and document.** The ADR-019 mechanism decisions and other design choices inside this dispatch's scope are yours. Pick, document in a session summary, move on.
- File a session summary per phase and per natural break-point (a jurisdiction batch, a phase milestone) so the operator can audit asynchronously. Do not block between summaries.

**Hard stop — never do this autonomously:** ADR-019 decision 6, hosting verbatim model-code text. This dispatch runs strictly on the interim deep-link footing. Hosting the licensed base text is gated independently on the IP attorney memo or an ICC/NFPA partnership; it is out of scope here and not yours to trigger.

**Pause and flag** (stop, file an Open Question session summary, wait) for: a mechanism decision that turns out to be a structural fork rather than a mechanism choice; eval scoring below the quality bar; cost-per-jurisdiction exceeding the structural commitment; a security or legal-exposure concern; a conflict with a structural commitment.

**Structural constraints that always hold (not exceptions-eligible):**

- **Path A tagging.** Every non-partnered jurisdiction you ingest is tagged `accessPolicy: platform-internal`. Partnership-flip is the only path to `public-free`. Do not expose a non-partnered jurisdiction's Layer 2 or Layer 3 atoms as `public-free` under any corpus-depth or launch pressure. The Layer 1 model-code base is `public-free` for the structure and reasoning it hosts; that is correct and is the design.
- **Quality gate.** Every atom carries source attribution, confidence score, timestamp.
- **Interim deep-link footing.** Layer 1 base `code-section` atoms host structure, hierarchy, cross-references, and reasoning, and deep-link the verbatim normative text to the publishers' free public viewers. Never host the verbatim model-code text.

## Why this exists

The Hauska commercialization layer sells the jurisdiction catalog through the Hauska MCP Server. Two things make that catalog a real public product: it must be reachable (the retrieval API deployed), and it must be deep (the model-code base plus many jurisdictions). ADR-019 ratified the architecture that makes depth cheap. This dispatch executes it.

The public-free catalog today is thin: Grand County plus Bastrop UDC. The decisive public corpus is the Layer 1 model-code base, the ICC I-Codes and the NEC, which underlie every US construction project and are `public-free` substrate. For the agent-builder ICP, "what does the IRC require for X" is the highest-value query you can serve. Phase E1 is therefore not just cost optimization; it is the public launch corpus.

## Read first

1. [`CLAUDE.md`](../CLAUDE.md) — operating instructions.
2. [`_decisions/2026-05-21_hauska_commercialization_sprint.md`](../_decisions/2026-05-21_hauska_commercialization_sprint.md) — the sprint, the autonomy model.
3. [`80_adrs/adr_019_layered_code_substrate.md`](../80_adrs/adr_019_layered_code_substrate.md) — the architecture you execute; read the Decision, Consequences, and Open decisions sections closely.
4. [`49_code_ingestion_pipeline.md`](../49_code_ingestion_pipeline.md) — the pipeline ADR-019 layers; its two open-design items are closed by the ADR.
5. [`80_adrs/adr_017_atom_access_control.md`](../80_adrs/adr_017_atom_access_control.md) — the `accessPolicy` field; Path A tagging.
6. [`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md) §Stream 1D — the TX city prioritization ladder; Hutto rollup.
7. Your prior sessions: the Sync 4.5 close, the Grand County LAND_USE work, the Hutto UDC ingest — pattern reference and the source of the layered-substrate proposal.

## Phase E0 — Deploy the hauska-engine retrieval API

Deploy the `services/retrieval-api` to a Cloud Run service so the Hauska MCP Server's public catalog tools have a stable, publicly reachable read-only endpoint. cc-agent-M (Lane M) is blocked on this for production catalog wiring; do E0 first and hand the endpoint URL to cc-agent-M.

Storage backing is your call: load the current corpus into memory on boot, or stand up the Postgres-backed StoragePort, whichever is the right read-only-serving choice at the current corpus size. Document the choice. The retrieval API is read-only in production; production write is a separate concern.

E0 closes when the retrieval API answers a real query over public TLS and cc-agent-M has the endpoint URL.

## Phase E1 — ADR-019 layered substrate pipeline + Layer 1 model-code base

Build the three-layer decomposition per ADR-019: shared `code-edition` and `code-section` atoms for the Layer 1 model-code base, jurisdiction-scoped `code-amendment` overlay atoms for Layer 2, bespoke `code-section` atoms for Layer 3. A `jurisdiction-corpus` atom references the shared Layer 1 editions it adopts plus its own Layer 2 and Layer 3 atoms. Effective-rule resolution composes a base section with the jurisdiction's overlay.

Then ingest the Layer 1 model-code base: the ICC I-Codes (IRC, IBC, IFC, IMC, IPC, IFGC, IECC) and the NEC, by edition, on the interim deep-link footing. This is the one-time front-loaded investment that amortizes across the whole catalog.

**The five mechanism decisions are yours.** ADR-019 §Open decisions explicitly leaves these to you as engine and retrieval calls. Decide each, build, and document the choice in a session summary. They are: whether `code-amendment` carries jurisdictional amendments directly or a distinct type or link is cleaner; which editions to ingest first and in what order (likely the editions Texas jurisdictions most commonly adopt, recent IRC, IBC, IECC first); deep-link target granularity, section-level versus chapter-level, depending on what the ICC and NFPA viewers expose as addressable anchors; effective-rule composition, query-time merge versus a materialized per-jurisdiction effective-section atom; deep-link health and drift detection, folded into B.5. If any one of these turns out on contact to be a structural fork rather than a mechanism choice, pause and flag it; otherwise decide and proceed.

Layer 1 base atoms carry `public-free` accessPolicy for the structure and reasoning they host. This is the design and the public launch corpus.

E1 closes when the layered pipeline is built and the Layer 1 model-code base is ingested, queryable through the retrieval API, and passes eval at the quality bar.

## Phase E2 — Sync 5 corpus expansion

Onboard the remaining TX cities as cheap Layer 2 amendment-overlay plus Layer 3 zoning ingests against the shared Layer 1 base. This is where the cost-per-jurisdiction win materializes.

The ladder, Hutto already done: Tier 1 Bastrop-network — Round Rock, Pflugerville, Cedar Park, Leander, Taylor, Georgetown. Tier 2 metros — Austin, San Antonio, Fort Worth, El Paso, Plano, Arlington, Irving, Garland, Lubbock, Laredo. Tier 3 — Jarrell, Frisco, McKinney, Killeen. Sequence Tier 1 first. One PR per jurisdiction, or per small batch where the source pattern is identical.

Self-merge each jurisdiction when its PR is CI-green AND it passes eval at the 1.0 / 1.0 / 1.0 quality bar AND the cost-per-jurisdiction structural commitment holds (under 200 dollars compute plus one hour human review). If a jurisdiction's eval falls below the bar or its cost runs over, pause and flag rather than merging.

**Path A tagging is mandatory on every jurisdiction.** A city ingested without a partnership is tagged `platform-internal`. It becomes `public-free` only when a partnership closes and the operator flips it. Do not exception this for corpus depth.

A jurisdiction whose source is access-blocked (eCode360 without the General Code partnership API, as Smithville was) is deferred and routed to the bizops partnership track, not forced. Note it in a session summary and move to the next city.

E2 closes when the Tier 1 through Tier 3 ladder is worked: each city either ingested and eval-passing, or explicitly deferred with the blocker named.

## Test plan

Per phase: E0, the retrieval API answers a real query over public TLS. E1, the layered pipeline produces correct three-layer atoms; an effective-rule query ("what does the IRC require for X in jurisdiction Y") resolves base section composed with overlay; the Layer 1 base passes eval. E2, each jurisdiction passes eval at 1.0 / 1.0 / 1.0; Path A tagging is correct on every ingested jurisdiction; the running catalog total and per-jurisdiction cost are reported in each session summary.

## Close criteria

Lane E closes when: the retrieval API is deployed and public (E0); the ADR-019 layered pipeline is built and the Layer 1 model-code base is ingested, public-free, and eval-passing (E1); and the Sync 5 ladder is worked to completion, every ingested jurisdiction eval-passing and Path-A-tagged, every deferred jurisdiction named with its blocker (E2). File a final hand-off session summary with the running catalog total, the public-free vs platform-internal split, and the realized cost-per-jurisdiction trend.

## Hand-off

Session summaries land at `_sessions/<date>_<topic>_cc-agent-E.md` per phase and per break-point. Hand the E0 retrieval API endpoint URL to cc-agent-M as soon as E0 closes; that unblocks Lane M's production catalog wiring. Roll the Sync 5 catalog totals into [`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md) as you go, matching the existing Hutto rollup pattern. If a mechanism decision lands cleanly, decide and document; pause and flag only a genuine structural fork, a sub-bar eval, a cost overrun, or a legal-exposure concern.
