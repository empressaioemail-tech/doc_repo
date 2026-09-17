# Fixtures for `scripts/check-preview-key-drift.mjs` (P-305)

These two files are **recorded HTTP bodies, byte-for-byte**, kept verbatim so the instrument's
self-test runs against the real shapes rather than against synthesized ones. The instrument reads
each file as raw text and classifies it exactly as it would a live network body. Provenance is
below; the files themselves carry no wrapper, because a wrapper would be a second shape and the
point of a recorded body is that it is the first one.

## `preview-panel-401-recorded.json` — must be graded AUTH_FAILURE

- Measured `2026-09-16T18:1xZ` against `https://smartsite.cloud/api/spine/property-atoms/{id}/facets`.
- HTTP **503 wrapping an upstream 401** — the wrapper status is not the signal; the body is. This is
  the exact class A-205 records (`retrieval_auth_failed`), one day before P-251's Preview miss.
- Recorded at source in `_inbox/2026-09-16_p230-bake-trigger_cp2.json`, key
  `falsifier3.theCustomerLegIsRefusingToday.body` (cited, not retyped from memory).
- `"parcelNodeId":"<id>"` is in the record itself and is kept as recorded; the classifier does not
  read that field. A separate transcript capture of the same incident carries the real id
  (`48209:97658`) and an em dash in the message — the classifier is insensitive to both, and that
  variant is why the marker is the `error` / `atomPathReason` field rather than the punctuation.

## `preview-panel-200-recorded.json` — must be graded OK

- Captured **2026-09-17T14:52Z** (this lane, read-only GET) from the deploy the dispatch names:
  `https://property-explorer-jmvakhksg-empressaioemail-techs-projects.vercel.app/api/spine/property-atoms/48021:34137/facets`.
- HTTP 200, 15,458 bytes, `parcelNodeId=48021:34137` (gold Bastrop 34137 — the same parcel the
  existing `property-explorer-sync-retrieval-key.yml` live-verify leg uses).
- `readPath` is `record`, **not** `atom-chain-warm`. That is P-230's bake-staleness finding
  (`bakedAt` six days old), an unrelated pre-existing condition. This instrument deliberately does
  **not** assert `readPath`: it grades the credential leg, and asserting the bake would make the
  gate permanently red for a reason that is not P-305 (DEV_PROCESS 2.0).

Neither body contains a key, a token, a header or a request id.
