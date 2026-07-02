---
id: 2026-07-02_hauska-engine_phase2-ingest-persistent-store-close
title: "Phase 2 close — hauska-engine document-ingest persistent store (durable across restarts)"
status: close
last_updated: 2026-07-02
applies_to: hauska-engine
related: [_inbox/2026-07-02_hauska-engine_phase2-document-ingest-close, _research/2026-07-02_ai_native_and_twin_review, 25_atom_architecture_reference, 08_tiered_access_model, 80_adrs/adr_017_atom_access_control]
owner: cc-agent-E (document-ingest lead)
---

# Phase 2 close — document-ingest persistent store

PR #78 shipped `POST /v1/document-ingest` but the live revision used an IN-PROCESS `DocumentIngestStore`, so minted atoms and the idempotency/dedup index survived only within a Cloud Run revision, not across restarts. This close wires the persistent implementation behind the existing port so ingest is durable and idempotency holds across restarts. Built, adversarially reviewed (PASS), migration applied to the live engine DB, deployed live, smoked end-to-end against Postgres + GCS, and squash-merged to `main` (PR #79, commit `7e15710`).

## The persistent store as built

Blobs live in GCS, records and atoms live in Postgres, behind the same `DocumentIngestStore` port PR #78 shaped. This is the durable impl of that port, not a parallel invented store.

Ground-truth correction to the dispatch premise. The engine had NO existing pg-backed atom persistence path to reuse: `packages/storage/src/pg-storage.ts` does not exist, and even code atoms run on `InMemoryStorage` hydrated from a committed corpus snapshot. The engine also had NO GCS wiring at all (no `@google-cloud/storage` dependency anywhere; the GCS references in the repo were adapter test mocks). So the durable store is a new, self-contained implementation of the document-ingest port. It reuses the `postgres` (porsager) library that `@hauska-engine/storage` already depends on and the live `DATABASE_URL` Neon secret convention; it adds `@google-cloud/storage` as a new dependency.

Postgres (records and atoms). Two tables via migration `packages/document-ingest/migrations/004_document_ingest.sql`:
- `document_blobs` (cid pk, content_hash text NOT NULL UNIQUE, content_type, size, tenant, access_policy NOT NULL default 'tenant-private', created_at). This is the restart-durable contentHash-to-cid dedup index plus blob metadata; the bytes live in GCS.
- `document_ingest_atoms` (atom_did pk, entity_type, entity_id, jurisdiction_tenant, source_document_cid, access_policy, storage_relation, verification_status, confidence_value, atom_json jsonb NOT NULL, created_at) with an index on source_document_cid. The full atom instance is stored as jsonb and read back via the matching per-entityType Zod schema (a corrupt or schema-drifted row parses to null rather than throwing, so the read path stays honest).

`PgDocumentAtomStore.writeDocumentAtom` does `INSERT ... ON CONFLICT (atom_did) DO NOTHING RETURNING atom_did` and derives `created` from `rows.length > 0`. `PgBlobIndex` dedups on the `content_hash UNIQUE` column. The durability mechanism is SQL, not memory: re-ingesting the same document after a restart hits the existing rows and returns `created: false` read from Postgres.

GCS (blob bytes). `GcsDocumentBlobStore.pinBlob` checks the Postgres index first for an existing cid by content hash (idempotent, restart-durable), then uploads the body to `gs://<bucket>/bafydoc-<contentHash>` (the cid is the object key, deterministic from the content hash, identical in spirit to the in-memory store), then records the index row. `fetchBlob` returns null on a GCS 404 and never throws on not-found. The blob record is ALWAYS `tenant-private` (hardcoded at the SQL default and the INSERT), so the licensed or private source document stays gated regardless of the extracted-atom policy.

Composition and honest fallback. `DurableDocumentIngestStore` composes the two behind the combined port. `resolveDocumentIngestStore(env)` selects the durable store only when BOTH a Postgres URL (`DATABASE_URL` or `SUBSTRATE_DATABASE_URL`) AND `DOC_INGEST_BLOB_BUCKET` are set; otherwise it returns the in-memory store so dev and test keep working with no cloud dependency. The route now calls the resolver when no store is injected, preserving the injected-store path for tests. One shared `postgres` handle is opened at route-build time (lazy connect, no per-request throw).

## Infrastructure provisioned

GCS bucket `hauska-prod-497015-doc-ingest-blobs` created in project `hauska-prod-497015`, region us-central1, `uniform_bucket_level_access: true` and `public_access_prevention: enforced` (tenant-private storage, no public path). The engine-api runtime service account `172690833726-compute@developer.gserviceaccount.com` was granted `roles/storage.objectAdmin` on the bucket and `roles/secretmanager.secretAccessor` on the `DATABASE_URL` secret (the SA had access to the Cotality and XAI and Anthropic secrets but not `DATABASE_URL`; the first deploy failed on exactly that permission and the grant fixed it).

## The migration

`004_document_ingest.sql`, applied to the live engine DB (the `DATABASE_URL` Neon instance, `ep-lucky-truth-apodo8hr`, us-east-1) via psql. It is idempotent (CREATE TABLE IF NOT EXISTS, CREATE INDEX IF NOT EXISTS) and records itself into the existing `schema_migrations(filename, applied_at)` convention with ON CONFLICT DO NOTHING. Live verification:

```
=== schema_migrations rows (after apply) ===
 001_api_keys.sql         | 2026-05-20 ...
 002_api_keys_product.sql | 2026-05-20 ...
 003_request_log.sql      | 2026-05-21 ...
 004_document_ingest.sql  | 2026-07-02 16:08:08.153081+00
=== re-run is idempotent ===
NOTICE: relation "document_blobs" already exists, skipping
NOTICE: relation "document_ingest_atoms" already exists, skipping
INSERT 0 0    (schema_migrations still has exactly 1 row for 004)
```

A convenience runner also exists at `packages/document-ingest/scripts/apply-migration.mjs` (reads `DATABASE_URL`, applies the same file idempotently, prints the migration rows and table columns); the live apply was done via psql and this runner is the reproducible path.

## Restart-durable idempotency evidence

Two proofs, both against a real durable backend.

Unit test (`packages/document-ingest/src/__tests__/durable-store.test.ts`). Constructs two SEPARATE `DurableDocumentIngestStore` instances (`storeA`, `storeB`) sharing ONE fake Postgres backend and ONE fake GCS backend whose dedup Maps live on the backend objects, not on the store instances. This is the shape of two processes reconnecting to the same Postgres and GCS after a restart. storeA pins a blob and writes a survey atom (both `created: true`); storeB, sharing only the backend, re-ingests the identical content and gets the same cid and the same atom DID with `created: false`, reads the atom back (acreage 2.35), and lists exactly one atom for the source cid (no duplicate). If the "restart" were faked by reusing the same store object the test would not prove durability; it does not.

Live end-to-end (the deployed durable revision). A first ingest of a survey minted `did:hauska:survey-record:2386d921...` with `created: true`; a SECOND request with the identical document returned the SAME cid and the SAME DID with `created: false` (a separate request that could only have read the existing atom from Postgres). The rows are physically present:

```
=== document_ingest_atoms (live DATABASE_URL) ===
 did:hauska:survey-record:2386d921a5886d2a48f4d4ca399a868e | survey-record | tenant-private | point-to | extracted-unverified | 0.51 | bafydoc-0a3cf2...
=== document_blobs (live) ===
 bafydoc-0a3cf2... | 0a3cf2c60b0b... | application/pdf | 148 | tenant-private
=== GCS bytes ===
 gs://hauska-prod-497015-doc-ingest-blobs/bafydoc-0a3cf2...   (survey)
 gs://hauska-prod-497015-doc-ingest-blobs/bafydoc-e4a419...   (degraded-doc blob, pinned even on degrade)
=== confidence.kind persisted ===
 asserted
```

## Invariant-preservation evidence

point-to default with sourceDocumentCid. The live-minted atom is `storage_relation: point-to` with `source_document_cid` set to the pinned blob cid. Confirmed in the Postgres row and the smoke payload.

Source blob always tenant-private. `document_blobs.access_policy` is hardcoded `tenant-private` at the SQL default and in the INSERT; the live blob row and the ingest payload `sourceDocument.accessPolicy` are both `tenant-private`. The bucket itself enforces public-access-prevention.

Confidence kind asserted, never calibrated. The persisted `atom_json->confidence->kind` is `asserted` on the live row; no code path in the new store mints or rewrites confidence, and a grep for `calibrated` across the new store files returns nothing.

accessPolicy firewall unchanged. `resolveExtractedAccessPolicy` in the route is byte-identical to `origin/main` (the route diff is only the store-selection swap); a private-tier caller cannot escalate its extracted atoms to public. The persistent store never re-stamps accessPolicy; it persists the orchestrator-computed value verbatim.

Never-500 honest degrade. The live degrade smoke (an unreadable base64 "PDF") returned `status: degraded`, `sourceDocument.pinned: true`, `coverage.degraded: true`, HTTP 200, reason "no extractable text". The orchestrator's pin, extract, and persist guards plus the route's belt-and-suspenders catch are all preserved; the new pg and gcs code lets a real fault surface through those existing guards rather than adding un-guarded throws to the route.

No endpoint-contract regression. The route diff against main is only the store-selection change; request and response schema, envelope shaping, min-confidence aggregation, citationIds, and degraded coverage are unchanged. `/health` still returns `documentIngest: true` and adds an additive `documentIngestStore` kind field.

## Verification

document-ingest 15/15 tests (the 12 from PR #78 plus 3 new durable-store tests), engine-api 43/43, `pnpm -r build` and `pnpm -r typecheck` green across all packages. CI green on PR #79 (typecheck + test, 1m11s). Adversarial review PASS on all nine checks (build/test green, restart-durable idempotency real, GCS blobs, Postgres records and atoms, firewall not regressed, asserted confidence, never-500 degrade, no endpoint-contract regression, secret hygiene).

Secret hygiene note. A stray `.dburl.tmp` connection-string file in the working tree was swept into the build agent's first local commit and caught before push; it was removed from the commit, gitignored, and never entered pushed history (`git log --all` for the neon host returns nothing; the file is not tracked). The live connection string never reached GitHub.

## Deploy revision and health

Built via Cloud Build with `services/engine-api/Dockerfile` (NOT the root Dockerfile, which builds retrieval-api; PR #78 caught exactly this substitution). Image `hauska-engine-api:persist-09feaed`, digest `sha256:8800cd40...`, project `hauska-prod-497015`, region us-central1, build `d061bd07` SUCCESS in 3m11s.

Deployed as a canary (`--no-traffic --tag=persist`) with `--update-env-vars=DOC_INGEST_BLOB_BUCKET=hauska-prod-497015-doc-ingest-blobs` and `--update-secrets=DATABASE_URL=DATABASE_URL:latest`, smoked on the tagged URL, then shifted to 100% traffic and repointed the `envelope-canary` and `docingest` tags (plus `persist`).

Live revision: `hauska-engine-api-00029-buy`, 100% traffic, all three tags pointing to it. Health on the base URL and the envelope-canary tag: `{"status":"ok","service":"engine-api","adapters":true,"engineCore":true,"envelope":true,"documentIngest":true,"documentIngestStore":"durable",...}`. The `documentIngestStore: durable` field confirms both `DATABASE_URL` and `DOC_INGEST_BLOB_BUCKET` resolved and the durable store is the one serving requests.

## PR and merge

PR #79 (`feat(document-ingest): persistent DocumentIngestStore (Postgres records/atoms + GCS blobs)`), CI green, squash-merged to `main` at commit `7e15710`, branch `phase2/ingest-persistent-store` deleted. `main` contains the merge on top of PR #78's `52f760c` (verified `git log origin/main`).

## Follow-ups (non-blocking)

- The `document_blobs.tenant` column is recorded as empty string because the port's `pinBlob` signature carries no tenant field; the meaningful gate (`access_policy = 'tenant-private'`) is always set. If per-blob tenant attribution on the metadata row is wanted later, the port's `pinBlob` signature needs a tenant param (a small additive change).
- No `ENGINE_API_GATE_TOKEN` is set on the live revision, so the gate-service bearer check remains disabled (dev-mode) and only gate-front header presence is enforced, unchanged from PR #78. Set the token when the gate leg hardens.
- The engine still has no live pg-backed StoragePort for CODE atoms (they remain snapshot plus in-memory). This close is scoped to document-ingest only; the code-atom Postgres backend is a separate storage-migration sprint and was deliberately not touched.
