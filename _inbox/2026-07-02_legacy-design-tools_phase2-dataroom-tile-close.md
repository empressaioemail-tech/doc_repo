---
title: Phase 2 close — legacy-design-tools Dataroom/Files tile (file -> atom UI)
date: 2026-07-02
agent: cc-agent-C (dataroom tile lead)
track: Phase 2 Dataroom/Files
repo: empressaioemail-tech/legacy-design-tools
status: COMPLETE
pr: 222
merge_commit: c6ba01f
deploy_revision: cortex-api-00284-zuq
related: [_inbox/2026-07-02_hauska-engine_phase2-document-ingest-close, _research/2026-07-02_ai_native_and_twin_review, _inbox/2026-07-01_legacy-design-tools_cc-agent-C_track-D-close]
---

# Phase 2 close — Dataroom/Files tile

Status COMPLETE. The last Phase-2 build: the UI over the file->atom pipeline. A Dataroom/Files tile lists an engagement's uploaded files, ingests each through the hauska-engine `POST /v1/document-ingest` pipeline via a cortex-api BFF proxy, and renders the returned atoms as cited, confidence-graded chips over the raw file. Adversarially reviewed (PASS on all six claims), deployed live via the canary sequence, and squash-merged to main (PR #222, commit `c6ba01f`). Built to the section-2 point-to design in `_research/2026-07-02_ai_native_and_twin_review.md` and the engine ingest contract in `_inbox/2026-07-02_hauska-engine_phase2-document-ingest-close.md`.

## The tile + BFF proxy

Tile `DataroomTile` in `@hauska/cortex-tiles` (`packages/cortex-tiles/src/dataroom/DataroomTile.tsx`), registered in the tile-capability registry and the app COMPONENTS map. Reads from the shared active-parcel context (`useEngagement().engagementId`); no per-tile parcel state.

Upload reuses the Track D per-engagement path verbatim (presign `requestDocumentUploadUrl` -> browser `PUT` to the signed GCS url -> `completeDocumentUpload`), which writes an `attached_documents` row. It does not reinvent uploads. The tile lists the engagement's files as a collection with the `accessPolicy` shown per atom (permission-ready display, not user-editable since tenancy is not live).

BFF proxy is `dataroomIngest` (`artifacts/api-server/src/lib/dataroomIngest.ts`) plus three routes on `planReviewBff`:

- `POST /plan-review/engagements/:id/documents/:docId/ingest` — downloads the uploaded blob bytes, base64-encodes them, and POSTs inline to engine-api `/v1/document-ingest` over the gate-front seam (`engineSpineClient`: service bearer + `x-hauska-*` context headers). Persists the returned `atoms[]` and returns them as chips.
- `GET /plan-review/engagements/:id/documents/:docId/atoms` — persisted chips for one file (no re-ingest).
- `GET /plan-review/engagements/:id/dataroom-atoms` — persisted chips for every file, keyed by documentId (the tile's one-shot hydrate on open).

Error posture: engine unreachable/rejected degrades to HTTP 502 (never 500); a non-ingestible blob is 422; unknown doc/engagement is 404; the engine's own `status: "degraded"` returns 200 and the tile shows a degraded note. Never hard-fails the tile.

## The upload -> ingest -> atom-chip flow

A file uploaded to an engagement appears in the Dataroom collection. Clicking "Extract atoms" calls the ingest proxy, which runs the file through the engine pipeline and returns the extracted CLAIM atoms. Each renders as a chip showing `entityType`, an `accessPolicy` pill, `verificationStatus`, a non-bare widthed confidence rendered as `NN% ±M (asserted, n=0)` from the `{ kind, value, intervalWidth, n }` shape, a `cite:` reference back to `sourceDocumentCid`, the `storageRelation` (point-to/embed-with), and the `atomDid`. Chips persist in `dataroom_document_atoms` so re-opening the tile re-renders them without re-ingesting.

Live evidence (canary smoke, then production base URL after traffic shift):

```
PROD HEALTH:          200 {"status":"ok"}
PROD DATAROOM-ATOMS:  404 {"error":"engagement_not_found"}   (GET .../dataroom-atoms — route mounted, engagement guard firing)
PROD INGEST:          404 {"error":"engagement_not_found"}   (POST .../documents/:docId/ingest — proxy route mounted, guard firing)
```

The full upload+ingest+chip render was exercised against a live Postgres 18 in the test harness (`dataroom-ingest.test.ts`, 5/5): a survey file ingests, the mocked engine returns a `survey-record` atom, and the BFF returns/persists a cited confidence-graded chip (`did:hauska:survey-record:...`, `sourceDocumentCid: bafycid-source-blob-1`, confidence `{kind:asserted, value:0.72, intervalWidth:0.3, n:0}`, `tenant-private`, `extracted-unverified`), re-listable via both the per-document and engagement-wide routes. A real browser upload against live GCS was not exercisable in-environment; not overclaimed.

## Firewall confirmation

For a user's private upload the proxy sends NO `accessPolicy` on the ingest call, and the gate-front context carries an explicit `accessTier: "tenant-private"`. The engine defaults + clamps, and the BFF persists exactly what the engine returns — a grep of the whole dataroom path found zero code that assigns or overrides a public access policy. There is no auto-publish path. This is enforced by a test that asserts the CAPTURED outbound engine body has no `accessPolicy` property and that the persisted/returned atom is `tenant-private`. The reviewer independently verified the firewall holds in the call, the gate-front tier, and the stored data.

## Migration

Migration `0050_dataroom_document_atoms.sql` — `dataroom_document_atoms (id, document_id FK->attached_documents ON DELETE CASCADE, engagement_id FK->engagements ON DELETE CASCADE, atom_did, entity_type, access_policy, storage_relation, confidence jsonb NOT NULL, verification_status, source_document_cid, created_at)` with a unique index on `(document_id, atom_did)` that matches the engine's deterministic atomDid so the persist path is idempotent (upsert-on-conflict; re-ingest updates rather than duplicates). Drizzle schema `dataroomDocumentAtoms.ts` + barrel export; `schema.sql.template` (table/PK/indexes/FKs in pg_dump sort order), the schema.integration table list, and api-server `TRUNCATE_TABLES` all updated. The FK column is named `document_id` (not `attached_document_id`) so the drizzle-generated FK identifier stays under the 63-char Postgres limit (60 chars).

Applied to live Neon via the run-migrations job. Verbatim:

```
  0049_saved_workspace_spaces.sql  (2026-07-02T15:50:48.317Z)
  0050_dataroom_document_atoms.sql  (2026-07-02T16:57:45.429Z)

migrate-prod: done.
```

The schema drift guard is green: a local drizzle-kit push -> pg_dump -> template diff on a real Postgres 18 printed "Schema fixture matches live DB", and CI's Test job (which runs the same push + `test:fixture:drift`) passed on the PR.

## Deploy revision + health

Deployed via the cortex-api canary sequence (deploy-canary -> run-migrations -> smoke -> shift-traffic, separate dispatches). Service `cortex-api`, project smartcity-os (legacy-design-tools-prod), us-central1. First deploy-canary attempt failed because the workflow needs the FULL image sha (the build tags `:<full-sha>` + `:latest`, not the short sha); re-dispatched with `c6ba01fe0872b33db665c7bcf0d55466e0da1d66` and it deployed clean.

Live revision: `cortex-api-00284-zuq`, 100% traffic (image `cortex-api@sha256:5f6f4ca4...`). Prior/rollback revision: `cortex-api-00281-joy`. Canary smoke passed on `canary---cortex-api-...` before the shift; the workflow's own production `/api/healthz` smoke passed on the shift; an independent production base-URL probe confirmed health 200 and both new routes mounted (see the evidence block above).

## Verification discipline

Build plus an independent adversarial review sub-agent. The reviewer stood up a real Postgres 18, ran the drift guard (green), the lib/db suite (15/15 incl schema integration + fixture drift), the new dataroom-ingest suite (5/5), the sibling planReviewBff suite (8/8 — no regression), and both artifact typechecks + `tsc --build` (clean), and confirmed all six acceptance claims with evidence: upload lists the file; ingest renders cited confidence-graded chips linked to sourceDocumentCid; a private upload's atoms are tenant-private with no public escalation; the tile has correct capability fields and the drift guard is green; the migration matches the schema with the FK under the identifier limit; no regression. Verdict PASS. Only a cosmetic stale comment was found and fixed before merge.

## PR + merge

PR #222 (`feat(dataroom): Dataroom/Files tile — file -> atom pipeline UI (Phase 2)`), all three CI checks green (Typecheck, Test incl DB-backed integration + fixture drift, Rubric), squash-merged to `main` at commit `c6ba01f`, branch `phase2/dataroom-tile` deleted. `main` verified to contain the merge (`git merge-base --is-ancestor` confirmed).

## Known gaps / follow-ups (non-blocking)

- The engine's deployed revision uses an in-process document-ingest store (blob pin + atom persistence in memory per process), per the engine close note. Idempotency of the source-blob CID holds within a process/revision; wiring the Postgres/GCS `DocumentIngestStore` is the engine-side runtime follow-up. On the cortex side the extracted-atom association is durably persisted in `dataroom_document_atoms`, so the tile re-renders chips across restarts regardless.
- No `ENGINE_API_GATE_TOKEN` is set on the live engine-api revision (gate-service bearer check is dev-mode), so the firewall currently rests on the BFF sending no accessPolicy + the explicit tenant-private gate-front tier; the engine clamp hardens further when the gate token is set.
- No MCP tool backs the tile yet (mcpTools: []); the ingest is a BFF-to-engine proxy. An `ingest_document` MCP tool is the natural agent-surface follow-up.
- Typed per-document-class adapters (title commitments, geotech, ALTA, spreadsheets, DWG/IFC) are added engine-side as datarooms surface real corpora; the tile renders whatever atoms the engine returns.
