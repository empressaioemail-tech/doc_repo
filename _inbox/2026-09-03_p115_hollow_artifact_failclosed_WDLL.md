---
id: 2026-09-03_p115_hollow_artifact_failclosed_WDLL
title: WDLL — P-115 stored-hollow download refuse, fail-closed on missing artifact record
status: draft
last_updated: 2026-09-03
operator_approval: approved 2026-09-03 (operator: "yes and yes", in response to the planner's proposal to draft this card and compile the P-90 dispatch)
plan_row: P-115
related:
  - _inbox/2026-09-03_p89_gate_reverify_close.json
  - _inbox/2026-08-28_p89_serving_close.json
  - _inbox/2026-08-27_p89_xray_mcp_WDLL.md
  - _decisions/2026-09-03_p90_approved_gate_still_open.md
  - _inbox/2026-08-28_p90_engine_pdf_WDLL.md
---

# WDLL: P-115 stored-hollow download refuse, fail-closed on missing artifact record

Date: 2026-09-03  Status: draft, operator-approved
Plan row: P-115
Repo: `hauska-mcp-server` only. Isolated worktree from `origin/main`. Substrate seat. Do not touch `hauska-engine` or `hauska-map`.

This is the leftover P-89 left open on 2026-08-28 and reconfirmed unchanged on 2026-09-03 (`_inbox/2026-09-03_p89_gate_reverify_close.json`). It is the only thing blocking P-90 item 1's gate from grading MET. Narrow, single-function scope by design — do not fold in unrelated hollow-export work.

## The defect

`src/xray-export-gate.ts`, `isStoredDossierArtifactHollow`:

```ts
export function isStoredDossierArtifactHollow(
  artifact: DossierExportArtifactEntry | undefined,
): boolean {
  if (!artifact || artifact.deferred === true) return false;
  ...
}
```

When no artifact record exists at all (`artifact === undefined`), this returns `false` — "not hollow" — instead of failing closed. It is a default on a value nobody resolved, the exact class ENFORCEMENT.md names under "fail closed, always": *"Never default a field whose correct value is unknown."* The consequence is not a fabricated success (the download call still proceeds to the engine and gets a 404), but it is the wrong refuse: an unnamed `artifact_unavailable` 404 instead of the same named `422 pipeline_output_absent` shape every other gap in this pipeline produces. Confirmed via `git log` that this function has been touched by exactly two commits ever (the original P-89 implementation and one unrelated test fix) and is unchanged on the commit currently serving production.

## Done looks like

`isStoredDossierArtifactHollow(undefined)` returns `true`. A download request for a parcel with no stored artifact record refuses with the same named `formatStoredHollowRefuse()` shape (`422 pipeline_output_absent`, `missing: ["verdict", "brief_facts"]`) that a present-but-hollow artifact already produces — never reaching the engine's `/dossier-export/download` route at all. The `deferred: true` case is unaffected (that's a different, correct state — a scheduled-not-yet-run export, not evidence of hollowness).

## Acceptance items

1. **Fail-closed on missing record.** `isStoredDossierArtifactHollow(undefined)` returns `true`. Check: unit test asserting this exact input/output, alongside the existing present-but-hollow and present-and-complete cases (do not replace those, add to them).
2. **No new fabrication path.** `deferred: true` still returns `false` — confirm this by an explicit test naming why (a deferred export is an honest not-yet-run state, distinct from hollow). Check: test asserts `{deferred: true}` still yields `false`, with a comment citing this distinction so a future edit doesn't collapse it by accident.
3. **Live refuse on a genuinely missing artifact.** Find or construct a parcel with no stored `pdf-dossier` artifact record and confirm live: `download_parcel_dossier_export` on that parcel returns the named `422 pipeline_output_absent` refuse, not a 404 passthrough. Check: live MCP call against the deployed revision after this ships, request id and response body recorded in the close artifact — same violate-then-pass discipline as every other P-89 item.
4. **No regression on the present-and-real path.** The two parcels currently holding real stored dossiers (`48021:34137`, `48021:27479`, both re-verified live 2026-09-03) still download successfully, unchanged. Check: re-run `_inbox/_tmp_p89_live_probe.mjs` (or its successor) post-deploy; both `cortex_download_gold` and `cortex_download_27479` cases still show `isError: false`, real PDF bytes.
5. **Deploy and grade on the serving revision, not the merged PR.** Same discipline as every other item in this program: canary, smoke, shift, then grade against `gcloud run services describe` read by JSON field name — never a positional formatter, never the Cloud Run revision ordinal or a traffic-tag name as a proxy for what shipped. Trace the serving image's digest to its git SHA and confirm this fix's commit is an ancestor before declaring done.
6. **Feeds P-90 item 1.** On this item closing live, `_inbox/2026-09-03_p89_gate_reverify_close.json`'s verdict is superseded by a new close naming P-89 customer-done in full, unblocking P-90's dispatch to actually start (not just compile).

## Out of scope

Any other hollow-export or refuse-shape work on `hauska-mcp-server`. Widening `isStoredDossierArtifactHollow`'s signature or callers beyond this one default. P-90 itself (hauska-engine). The flood-pair test still reading `assert.ok(true)` (P-89's own separate leftover, item 5, untouched here).

## Amendments

None yet.
