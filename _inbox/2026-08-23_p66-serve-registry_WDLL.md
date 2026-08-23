# WDLL: P-66 serve-layer registry wiring
Date: 2026-08-23  Status: approved
Operator approval: 2026-08-23 (Nick — Phase 2 launch session)

## Done looks like

Serve paths read `_catalog/instrument_entity_type_classifications.json` (active 21/21) and attach `provenanceClass`, `subjectKind`, `chainAnchoring`, and `serveLayer` to facet/verdict responses where a family maps to an entity type. No `hauska_mcp.atoms` row migration. Live probes on gold `48021:34137` and Haysel `48021:35433` show registry metadata on at least landUseFact, pipelineFact, and envelope/setback wire. Instrument self-test in doc_repo passes both directions.

## Acceptance items

1. doc_repo `scripts/instrument-entity-type-registry.mjs` loads registry, asserts 21 keys, violation fixture fails | check: `--self-test` exit 0; violation exit non-zero | grade: [ ]
2. Synced registry JSON in legacy-design-tools + hauska-map consumable at build time (generated copy or import path documented) | check: file exists + CI typecheck | grade: [ ]
3. LDT `verdictLayerServe` and/or `brokerageNodeFacets` attach classification metadata per family slot | check: unit test + live GET facets field | grade: [ ]
4. PE `layer-absence.ts` or atom-chain facets wire includes `provenanceClass` on absence/present facts | check: test in hauska-map | grade: [ ]
5. `scripts/verdict-layer-serve-selftest.mjs` extended fixture asserts registry field on layer response | check: exit 0 | grade: [ ]
6. Close artifact `_inbox/2026-08-23_p66-serve-registry_close.json` with probe timestamps | grade: [ ]

## Amendments

(none)

## Finish card (graded at close)

(filled at lane close)
