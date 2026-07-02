---
id: 2026-07-02_hauska-engine_phase2-document-ingest-close
title: "Phase 2 close — hauska-engine document-ingest (unstructured-to-atom)"
status: close
last_updated: 2026-07-02
applies_to: hauska-engine
related: [_research/2026-07-02_ai_native_and_twin_review, _inbox/2026-07-02_deepreview_ai_native_DR1, 25_atom_architecture_reference, 08_tiered_access_model]
owner: cc-agent-E (document-ingest lead)
---

# Phase 2 close — document-ingest

The unstructured-to-atom `document-ingest` capability is built, adversarially reviewed (PASS), deployed live, and merged to `main` (PR #78, squash commit `52f760c`). This is the foundation for datarooms and the data marketplace. Built exactly to the section-2 design in `_research/2026-07-02_ai_native_and_twin_review.md` and the section-3 recommendation in `_inbox/2026-07-02_deepreview_ai_native_DR1.md`.

## The design as built

Point-to by default. A real-world document is ingested as ONE content-addressed blob (sha256 content hash, pinned, deduped). Minted atoms are CLAIMS extracted from that document, which remains the source of truth. Every atom carries `sourceDocumentCid` (the pinned blob) plus extraction provenance: `sourceAdapter`, `extractedAt`, `verificationStatus`, and an `extractionRegion` (page / bounding box / locator) where the adapter reports it. This is the shape the encumbrance atoms already ship.

Embed-with only for small born-digital fragments that ARE the unit of meaning. The decision rule lives in code as `storageRelationForExtraction`: embed-with when the atom's content is small text (defaults to a 2000-char cap) that is itself the meaning; point-to when the atom is a claim extracted from a document that remains source of truth. Only embed-with atoms carry inline `extractedText`; point-to atoms never inline the document.

Asserted-baseline widthed confidence, never calibrated. Every minted atom carries `confidence: { kind: "asserted", value, intervalWidth, n: 0 }`. The value is seeded from source-document quality (born-digital text higher-trust than a scan) discounted by the adapter's per-claim extraction confidence; the interval is deliberately wide. There is no path that mints a `calibrated` number. The live `recomputeCalibrationOverlay` earns the calibrated axis over time from adjudication and outcome signal (structural commitment #2 held).

Adapters shipped. A framework (adapter interface + classifier + orchestrator + storage port + confidence seeding + mint helpers) plus a generic PDF/text adapter (the always-available fallback, mints `document-derived-claim` atoms) and two typed example adapters: a survey/plat adapter (`survey-record` atoms: parcel descriptor, acreage, boundary calls, surveyor, recording reference) and a utility-bill adapter (`utility-bill-record` atoms: utility type, account, usage, amount, service period). Text extraction uses the injected-hook pattern the corpus `RawPdfAdapter` already uses (pdfjs born-digital / Claude-vision OCR in production, stubbed in tests), so no parallel OCR stack. Classification routes to the highest-scoring adapter; the generic adapter returns a low floor score so an unrecognized document always routes to it rather than failing.

Persistence reuses the engine's non-code atom persistence pattern (a dedicated storage port + in-memory implementation + emit layer, exactly as the `workspace` package does — the code-corpus `StoragePort` is typed to `CodeAtomInstance` only, so document atoms get their own port, not a parallel invented store).

## The ingest endpoint contract (for the Dataroom tile track)

`POST /v1/document-ingest` on engine-api, behind the gate-front seam (the gate resolves tenant + access tier and forwards the `x-hauska-*` headers; engine-api does not re-resolve).

Request body:

```
{
  "document":
    { "kind": "inline", "body": "<base64|utf8>", "encoding": "base64"|"utf8",
      "contentType": "application/pdf", "sourceRef": "survey.pdf" }
    | { "kind": "blob-ref", "cid": "<already-pinned-cid>",
        "contentType": "...", "sourceRef": "..." },
  "accessPolicy": "public-free|public-paid|platform-internal|tenant-private|tenant-shared",  // optional, clamped
  "verificationStatus": "extracted-unverified|unverified-web-source|human-verified",          // optional
  "contextRefs": { "nodeId": "...", "apn": "...", "engagementId": "...", "jurisdiction": "..." } // optional
}
```

Response is an EngineEnvelope whose `payload` is:

```
{
  "status": "ok" | "empty" | "degraded",
  "sourceDocument": { "cid", "contentHash", "contentType", "accessPolicy": "tenant-private", "pinned": true },
  "classification": { "documentType", "adapter", "score" },
  "atoms": [
    { "atomDid", "entityType", "entityId", "accessPolicy", "storageRelation": "point-to"|"embed-with",
      "confidence": { "kind":"asserted","value","intervalWidth","n":0 },
      "verificationStatus", "sourceDocumentCid", "created": true|false }
  ],
  "reason": "<present when degraded/empty>"
}
```

The envelope-level `confidence` is the min atom confidence value, `kind: "asserted"` (never calibrated for freshly minted atoms); `source.citationIds` lists the minted atom DIDs; `coverage.degraded` is true on a degraded ingest.

How the Dataroom tile calls it, one line: POST the uploaded file (base64) plus the gate-front headers (tenant + access tier) and the workspace/parcel `contextRefs`; render the returned `atoms[]` as cited chips, each linking back to `sourceDocumentCid` with its `confidence` grade, over the raw upload.

## accessPolicy parameterization + firewall

The extracted-atom accessPolicy is a PARAMETER, resolved server-side by `resolveExtractedAccessPolicy(requested, gateAccessTier)` and defaulting to `tenant-private`. A tenant-private-tier caller CANNOT escalate its extracted atoms to a public tier no matter what it requests — a `public-paid` request under a private gate is clamped to `tenant-private`. A public (marketplace) tier is only honored when the gate itself resolved a public access tier. A user's private dataroom upload therefore mints `tenant-private` atoms and never auto-publishes; when WE ingest a public/licensed document for the marketplace under a public gate tier, the extracted reasoning atoms can be `public-paid`. The SOURCE BLOB is always `tenant-private` regardless — the licensed/private document stays gated while only the extracted reasoning becomes a sellable SKU. This is the sell-reasoning-not-raw-data firewall (doc 08, commitment #1) implemented as the point-to/embed-with + accessPolicy split.

## Idempotency + degrade evidence

Idempotent: an atom's `entityId` is deterministic from the source blob CID plus the atom's own content hash (`stableEntityId`), and no wall-clock value enters the hashed canonical body, so re-ingesting the same document mints the same atom ids. The store dedups on DID and the blob pin dedups on content hash. Live smoke: re-posting an identical survey returned the same `did:hauska:survey-record:424cba22...` with `created: false`.

Never hard-fails (commitment #1): a malformed/unreadable document returns `status: "degraded"` with the blob still pinned and a reason, never a 500. Adapters never throw (each guards its extraction and returns degraded); the orchestrator guards pin, classify, extract, and persist; the route wraps the whole call in a belt-and-suspenders catch that degrades to an envelope. Live smoke: an unreadable base64 "PDF" returned `status:degraded`, `pinned:true`, `coverage.degraded:true`, HTTP 200.

## Verification

12/12 document-ingest package tests, 43/43 engine-api tests, full-workspace typecheck + test green, CI green on PR #78. An independent adversarial review returned PASS on all six claims (point-to, asserted-only, firewall no-escalation, idempotency-no-timestamp-in-hash, never-500, valid EngineEnvelope). Two non-blocking review findings were fixed before merge: (1) the canonical-hash function was replaced with a proper recursive deep stable-stringify (the `JSON.stringify` replacer-array form silently drops nested-object keys and would have false-deduped atoms with nested canonical fields); (2) the persist loop was wrapped so a store fault degrades honestly rather than breaking the orchestrator's never-throws contract.

## Deploy revision + health

Built via Cloud Build with `services/engine-api/Dockerfile` (NOT the root Dockerfile — the root builds retrieval-api; a first build with `gcloud builds submit --tag` used root and produced a retrieval-api image under the engine-api service, caught at smoke and rebuilt with the correct Dockerfile). Project `hauska-prod-497015`, region `us-central1`.

Live revision: `hauska-engine-api-00026-dop`, 100% traffic. Both the `envelope-canary` and `docingest` tags repointed to it (per the deploy note: repoint the envelope-canary tag or probes hit a stale revision). Health: `{"status":"ok","service":"engine-api","adapters":true,"engineCore":true,"envelope":true,"documentIngest":true}` on the base URL and the envelope-canary tag. Live end-to-end smoke passed: survey document classified (score 0.95), a point-to `survey-record` atom minted with `sourceDocumentCid`, asserted confidence, `tenant-private`, wrapped in a valid EngineEnvelope; firewall clamp and idempotency and honest-degrade all confirmed against the live revision.

## PR + merge

PR #78 (`feat: document-ingest — unstructured-to-atom pipeline`), squash-merged to `main` at commit `52f760c`, branch `phase2/document-ingest` deleted. `main` contains the merge (verified `git log origin/main`).

## For the Dataroom tile track

Call `POST /v1/document-ingest` with the uploaded file (inline base64 or a blob-ref cid) plus the gate-front headers (the gate supplies tenant + access tier) and the workspace/parcel `contextRefs`; render the returned `atoms[]` as cited, confidence-graded chips over the raw upload, each linking back to `sourceDocumentCid`. Do not set `accessPolicy` for a user's private upload (it defaults to `tenant-private`); the server clamps any escalation attempt.

## Follow-ups (non-blocking)

- Production storage: the deployed revision uses the in-process store (blob pin + atom persistence in memory per process), so idempotency holds within a process/revision. Wiring the Postgres + GCS/IPFS `DocumentIngestStore` implementation (reusing the product upload blob path) is the runtime-layer follow-up before the Dataroom tile persists across restarts. The port + orchestrator are already shaped for it.
- The generic adapter's line-splitting is a simple heuristic; typed adapters should be added per document class as datarooms surface real corpora (title commitments, geotech, ALTA, spreadsheets, DWG/IFC — the `cortex_ifc_ingest` decoder should move behind this stream).
- No `ENGINE_API_GATE_TOKEN` is set on the live engine-api revision, so the gate-service bearer check is currently disabled (dev-mode) and only the gate-front header presence is enforced; set the token when the gate leg hardens.
