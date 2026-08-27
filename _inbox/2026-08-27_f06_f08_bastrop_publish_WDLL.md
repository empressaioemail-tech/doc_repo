---
id: 2026-08-27_f06_f08_bastrop_publish_WDLL
title: WDLL — F-06, F-07, F-08 for Bastrop only: publish the new shape to a staging Smart Site under the Factory URL, walk gold 48021:34137 on real endpoints, production only on a passed staging sibling and the operator's word
date: 2026-08-27
last_updated: 2026-08-27
status: approved
applies_to: legacy-design-tools (facet bakes, PMTiles bake, cortex-api canary on staging secrets, county-ledger GET), hauska-map (staging Property Explorer project, tiles manifest), hauska-factory (publish job, walk job, tiles.json, freshness stamps)
plan_row: F-06, F-07, F-08
depends_on: the conformant-writer card's Bastrop rows (written by run 15c5c397; the card's close adds the flood re-point, item 8) · F-05 item 20 is delivered by F-10 wave 1 item 6 or by this card, whichever lands first, not both
operator_go: 2026-08-27 ("F-10 wave 1 and the Bastrop publish in parallel, two lanes")
decision: _decisions/2026-08-26_factory_program_and_hold_lifts.md (staging site under the Factory URL; tiles are fabric; three finish lines); OPS-19 rule 6 (staging first, identical job second)
model_law: 19_the_instrument_contract.md (Access two fields; Lens selects rendering never content); _blueprint/10_model.md (V3 access never defaulted, V6 situs refused at serve, V9 repoint consumers before retiring a store); _blueprint/40_rule_register.md (BP-SERVE-01, BP-SERVE-02, BP-ACCESS-01, BP-ADDRESS-01, BP-MEANING-01, BP-VERIFY-01); 50_grading.md
design: _inbox/2026-08-26_factory_program_design.md (L4 Serve, Verify and maintain, sections 5 and 12)
snapshot: doc_repo main 462010f · Bastrop 48021 on the new shape in hauska_mcp beside 77,073 old-shape cad-parcel-roll rows and 62,394 parcel-nodes (old) · production Smart Site reads the old shape through cortex-api and the pinned PMTiles hash in PE config · Factory console on its own Vercel project · county ledger GET carries no published_at · gold parcel 48021:34137 serves today on the old shape
owner: property seat, a fresh LANE PLANNER (may spawn sub-agents under AGENT_CONTRACT section 1). Worktrees registered ahead of creation, all on seat/property-publish from origin/main: P:/seat-worktrees/property/legacy-design-tools-publish, P:/seat-worktrees/property/hauska-map-publish, P:/seat-worktrees/property/hauska-factory-publish. Never the conform, records, pricing, ai, or factory worktrees. Deploys are recorded by this lane and verified by the planner; the production shift is the operator's word.
---

# WDLL: the Bastrop publish (F-06, F-07, F-08)

Date: 2026-08-27  Status: approved  Operator approval: 2026-08-27

This card makes the new shape visible to a person for one county, on a staging Smart Site that mirrors production by construction, and proves the serving cutover with a walk before any of it touches production. It runs in parallel with F-10 wave 1 and needs nothing from it except, optionally, item 6 of that card. Nothing here repoints production until the staging walk passes and the operator says go.

## Lane planner mode

Same conditions as every Factory lane: sub-agents produce artifacts and never commit, deploy, or execute a job; the lane planner supervises to completion, reads every diff, runs CP1 and CP2 adversarially, and keeps verification; one writer at a time per worktree; the no-nesting clause opens every sub-agent prompt.

## What exists

Production serving: Smart Site (`hauska-map/apps/property-explorer`) reads facets through cortex-api (LDT, Cloud Run us-central1, canary workflow with `deploy-canary`, `smoke`, `shift-traffic`) and draws parcels from a PMTiles fabric whose hash is pinned in PE config; the facet bakes write `place_layer_snapshots`; the county ledger GET builds from `county_facet_coverage` and the manifest grid and carries no `published_at`. The Factory has a publish job precedent (`cc-publish`, one-way manifest copy), a console on its own Vercel project, a store in us-east-1, and Bastrop's new-shape rows beside the old ones. Neon supports branches of `neondb` and `hauska_mcp`; the Neon MCP tool cannot set a region, so branches are created by the REST API or CLI and their host is read back before use. Every consumer of the old shape stays pointed at it until this card's production step.

## Done looks like

A staging Smart Site at the Factory base URL under `/site` reads Bastrop from Neon branches of `neondb` and `hauska_mcp` reset from production, through a canary-tagged cortex-api revision on staging secrets, with the Bastrop facet bakes tier 1 and 2 produced from the new-shape rows, a PMTiles bake for Bastrop whose feature ids equal parcel-node ids equal CAD aliases (an id no node carries fails the bake), a `tiles.json` per environment so the tile path is data not a code deploy, and a freshness stamp per county per target. A verify walk of N known Bastrop parcels on the staging site's real endpoints passes on gold `48021:34137` and fails on a deliberately broken parcel; every artifact is graded by rule id and a presence-only grade reads UNMEASURED. A production publish is the identical job on production targets and refuses without a passed staging sibling; it runs only on the operator's word, and after it the production walk is identical to staging's. Access is never defaulted at serve; a punctuation-only situs is refused at serve. The old-shape rows are retired only after every consumer reads the new shape (V9), which is not this card.

## Acceptance items

1. **Worktrees and the read of the serving path.** Three `-publish` worktrees from `origin/main`. CP1 maps the serving path as it is: which PE routes read which cortex-api routes, which tables and views those read, where the PMTiles hash is pinned, how cortex-api's canary deploys, how the facet bakes are produced today, and what "the new shape" changes at each hop. No code before the map. | check: CP1 map with file paths and the live production revision named | grade: [ ]

2. **Staging targets exist and are faithful by construction (F-07).** Neon branches of `neondb` and `hauska_mcp` created from production by API or CLI (direct host read back, never a pooler); a cortex-api revision deployed by digest with a `staging` tag on staging secrets that point at those branches, zero production traffic; a staging Property Explorer Vercel project served under the Factory base URL at `/site`; a staging tile path. A reset job re-creates the branches from production before each staging publish and records the branch ids and reset time as a run. Verified by violation: a staging publish against a branch older than its recorded reset refuses. | check: branch ids and hosts recorded; tagged revision at zero traffic; `/site` answers; refusal fixture | grade: [ ]

3. **Facet bakes tier 1 and 2 from the new shape (F-06).** The Bastrop bakes into `place_layer_snapshots` are produced from the new-shape rows (nodes, atoms, edges, verdicts) by a recorded Factory publish run, never from the old rows and never by a laptop; each baked layer carries its verdict, its provenance, and the two access fields; access is never defaulted (a row without both fields refuses); a situs that is punctuation only is refused at serve, not baked as a string. Old-shape bakes are left in place on production. | check: publish run row; refusal fixtures for access and situs; the staging facet for `48021:34137` reads the new shape and says so | grade: [ ]

4. **PMTiles bake as the fabric join proof (F-06).** A Bastrop PMTiles bake in which every feature id equals a parcel-node id equals a CAD alias; a tile carrying an id no node holds fails the bake; `tiles.json` per environment names the tile path and its hash so PE reads the pointer and no code deploy carries a hash. Verified by violation: a bake with one injected orphan id fails. | check: bake run row; `tiles.json` on staging; orphan fixture | grade: [ ]

5. **Freshness stamp per county per target.** Staging and production each carry, per county, the publish run id, the source vintage, and the stamp time, readable on the console and on the served ledger; the served county-ledger GET carries `published_at` (F-05 item 20) if F-10 wave 1 has not landed it first. | check: console row; GET field | grade: [ ]

6. **Verify walk (F-08).** A Factory job walks N known Bastrop parcels (gold `48021:34137`, the two other smoke parcels `48021:34073`, `48021:34785`, `48021:34017` if warm, and at least ten others chosen by area sweep, never by sampling one) through the staging site's real endpoints and asserts each layer renders with its verdict, citations, and provenance; the walk fails on a deliberately broken parcel; every artifact graded by rule id per `50_grading`, UNMEASURED where only presence checks ran; a walk fail blocks promotion and quarantines the county on the manifest. | check: walk run with per-parcel grades; the broken-parcel fixture fails; gold passes | grade: [ ]

7. **Production publish refuses without a passed staging sibling (rule 6).** The production publish job is the same job with production targets; it reads the staging walk result for the same publish run and refuses if it is absent or failed; a publish outside the job is detected as unrecorded (the served freshness stamp names a run id that must exist). It is NOT executed on this card without the operator's explicit go, given after the staging walk passes and the CP2 is read. | check: refusal fixture; unrecorded-publish detector fixture | grade: [ ]

8. **Production, on the operator's word only.** If the operator says go: the identical job on production, the production walk identical to staging's, the served freshness stamp and `published_at` moved, the old-shape bakes for Bastrop superseded not deleted, the pinned PMTiles hash in PE config replaced by the `tiles.json` pointer. If the operator does not say go, this item grades not-started and the card still closes. | check: production walk; stamps; PE reads `tiles.json` | grade: [ ]

9. **Checkpoints, close, leave-behind.** CP1 after item 1, CP2 after item 6 with the staging walk result and the `/site` URL, close at `_inbox/2026-08-27_f06-f08-bastrop-publish_close.json` with grades, the run ids, the branch ids, the revision digests, and `leave_behind`. | check: artifacts | grade: [ ]

10. **Out of this card.** Any county but Bastrop; retiring old-shape rows (V9 is a later card); the Hauska MCP gate; P-85 and P-86 surfaces; the console operator-login proxy (F-04); changes to the atom contract. | check: pathspec and `notStarted` | grade: [ ]

## Do not

- Bake from the old shape, or from a laptop.
- Default an access field, or bake a punctuation-only situs.
- Deploy cortex-api by tag, or shift production traffic; the production step is the operator's word.
- Point production PE at staging branches, or staging PE at production stores.
- Pass the walk with presence checks; UNMEASURED is the grade for that.
- Let a sub-agent deploy, execute, or commit.

## Amendments

- None yet.

## Finish card (graded at close)

(not yet)
