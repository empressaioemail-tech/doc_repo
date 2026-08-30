---
id: 2026-08-29_p91_p555_canary_deploy
title: p555 canary serving at 0% on smartsite-mcp-00059-jab
date: 2026-08-29
status: superseded-by-p556 (served at 100% between the two shifts; see _inbox/2026-08-29_p91_p556_deploy.md)
plan_row: P-91
service: smartsite-mcp
revision: smartsite-mcp-00059-jab
tag: p555
digest: sha256:82c243026177ed48e126f67b7402b9572c3cc926887e82498bf20bf18ae6e697
uri: ui://smartsite/app-p555.html
tree: P:/tmp/legacy-design-tools-p91-stone feat/p91-wave-h-stone 3f360e5b
build: Cloud Build 111baa4b-13bd-4767-9e4f-3b4addb324f8 SUCCESS (project legacy-design-tools-prod, config artifacts/smartsite-mcp/cloudbuild.p555.yaml)
pr: empressaioemail-tech/legacy-design-tools #551
---

# Deploy

Built from the stone clone at `3f360e5b` (commits: p554 record `ef4be437`, main merge `67c80b92`, server cut `370359a5`, iframe cut `2cd7e108`, shared resolve-core test `3f360e5b`). Image tag `p555`; digest read from Artifact Registry `image_summary.digest` by field name, not from the build log.

`gcloud run deploy smartsite-mcp --image ...@sha256:82c243026177ed48e126f67b7402b9572c3cc926887e82498bf20bf18ae6e697 --no-traffic --tag p555`. Existing service config carried (runtime SA `api-server-runtime@`, minScale 1, secrets by `:latest` reference). No `--set-env-vars`.

Traffic after deploy, by field name: `revisionName=smartsite-mcp-00057-xuk percent=100 tag=p554`; `revisionName=smartsite-mcp-00059-jab percent=undefined tag=p555`.

Tag `https://p555---smartsite-mcp-tds7av26va-uc.a.run.app/health`:

```
{"status":"ok","service":"smartsite-mcp","name":"Smart Site","version":"0.0.1","authConfigured":true,"cortexConfigured":true,"revision":"smartsite-mcp-00059-jab","failureDomain":"smartsite-mcp"}
```

Prod `/health` unchanged: `revision=smartsite-mcp-00057-xuk status=ok`.

# What is on this image

Server: `get_smart_site` non-OK mapped once (404 single-id `{ parcels: [], notFound, reason, parcelExists }`; 402 `{ refused: [...] }`; both `isError: false`; everything else an error); `run_report` read-mode stamp only on OK; `ask_the_map` blocked (`not_ready`) with a strict two-field schema that does not echo unknown keys; `/health` `authConfigured` from the `/mcp` gate predicate; enum `source`/`status`; batch cap published as `maxItems`; descriptions rewritten. Iframe: `ui://smartsite/app-p555.html`; panel paints miss (county-correct), unbaked, refused, unreadable, batch-stub board, screen rails at first paint from its result alone; board acknowledges a click (`Sent to chat. Press Send to open.`), dead only on no reply or an error reply; `ev.source` guard; attribute escaping; one parser embedded by source and parity-tested; served-script suite. Verified before shift: package suite 141/144 (three cross-package failures documented on #551), `_inbox/2026-08-29_p91_iframe_instrument_p555.mjs` 12/12 against the TS source and against a local esbuild bundle built with the Dockerfile's flags.

# Shift

Held at 0% until `cortex-api` tag `p542` was canary-healthy (`_inbox/2026-08-29_p91_p542_deploy.md`), then shifted `--to-tags=p555=100` immediately after cortex. Traffic after shift, by field name:

```
latestReady= smartsite-mcp-00059-jab
  revisionName= smartsite-mcp-00057-xuk percent= undefined tag= p554
  revisionName= smartsite-mcp-00059-jab percent= 100 tag= p555
```

Prod `/health`: `{"status":"ok",...,"authConfigured":true,"cortexConfigured":true,"revision":"smartsite-mcp-00059-jab",...}`. Revision `status.imageDigest` equals the Artifact Registry digest above. Status of this record: serving-100pct.

# Grade

`_inbox/2026-08-29_p91_p556_connect_grade_prompt.md` after both tags are at 100%.
