# 76j Workstream F — scratch

## GROUND-TRUTH (2026-08-09T22:34Z)

- P0 CLOSED PASS. retrieval `00061-bib` @100%; MCP `00041-x56` @100%.
- Root cause: retrieval plaintext 40-char RETRIEVAL_API_KEY vs MCP 59-char HAUSKA_ENGINE_API_KEY secret.
- Fix: mount `RETRIEVAL_API_KEY=HAUSKA_ENGINE_API_KEY:latest` in deploy config (`cloudbuild.retrieval-api.yaml`).
- CORPUS_SNAPSHOT_PATH fixed: `/app/services/retrieval-api/corpus/snapshot.json`.
- MCP health: `probeRetrievalCatalogSeam` — 401 on authenticated /search → degraded (fail-loud).

## L3 live (verbatim paths)

- Gold MCP public `48021:34145`: status `ready`, GC, F/R/S 20/20/5 — NOT 401.
- Fabric MCP public `48201:0010020000001`: status `atom_path_pending`, honest null slots — NOT 401.
- Wrong bearer retrieval: `{"error":"unauthorized"}` HTTP 401.

## OPEN (P1, not this dispatch)

- Chain schema 1.15.0 families, Cotality copy, contract pin bump, brief substrate wiring.
