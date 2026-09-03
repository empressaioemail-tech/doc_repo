## Mission: P-115 stored-hollow download refuse, fail-closed on missing artifact record

Repo: `hauska-mcp-server` only. Isolated worktree from `origin/main`. Substrate seat. Do not touch `hauska-engine` or `hauska-map`.

This is the leftover P-89 left open on 2026-08-28 and reconfirmed unchanged on 2026-09-03. It is the only thing blocking P-90 item 1's gate from grading MET — P-90 (property seat, `hauska-engine`) is dispatched and waiting on this closing.

### The defect

`src/xray-export-gate.ts`, `isStoredDossierArtifactHollow`:

```ts
export function isStoredDossierArtifactHollow(
  artifact: DossierExportArtifactEntry | undefined,
): boolean {
  if (!artifact || artifact.deferred === true) return false;
  ...
}
```

When no artifact record exists at all (`artifact === undefined`), this returns `false` — "not hollow" — instead of failing closed. Confirmed via `git log` that this function has been touched by exactly two commits ever (the original P-89 implementation and one unrelated test fix) and is unchanged on the commit currently serving production (`40e48d4`).

### Done looks like

`isStoredDossierArtifactHollow(undefined)` returns `true`. A download request for a parcel with no stored artifact record refuses with the same named `formatStoredHollowRefuse()` shape (`422 pipeline_output_absent`, `missing: ["verdict", "brief_facts"]`) that a present-but-hollow artifact already produces — never reaching the engine's `/dossier-export/download` route. The `deferred: true` case is unaffected.

### Acceptance items

1. **Fail-closed on missing record.** `isStoredDossierArtifactHollow(undefined)` returns `true`. Check: unit test asserting this exact input/output, added alongside the existing present-but-hollow and present-and-complete cases, not replacing them.
2. **No new fabrication path.** `deferred: true` still returns `false`. Check: explicit test with a comment naming why (a deferred export is an honest not-yet-run state, distinct from hollow), so a future edit doesn't collapse the distinction.
3. **Live refuse on a genuinely missing artifact.** Find or construct a parcel with no stored `pdf-dossier` artifact record and confirm live: `download_parcel_dossier_export` on it returns the named `422 pipeline_output_absent` refuse, not a 404 passthrough. Check: live MCP call against the deployed revision after shipping, request id and response body recorded in the close artifact — same violate-then-pass discipline as every other P-89 item.
4. **No regression on the present-and-real path.** `48021:34137` and `48021:27479` (both re-verified live 2026-09-03, both hold real stored dossiers) still download successfully, unchanged. Check: re-run `_inbox/_tmp_p89_live_probe.mjs` (or its successor) post-deploy.
5. **Deploy and grade on the serving revision, not the merged PR.** Canary, smoke, shift, then grade against `gcloud run services describe` read by JSON field name — never a positional formatter, never the Cloud Run revision ordinal or a traffic-tag name as a proxy for what shipped. Trace the serving image's digest to its git SHA and confirm this fix's commit is an ancestor before declaring done.
6. **Feeds P-90.** On this item closing live, write a new close superseding `_inbox/2026-09-03_p89_gate_reverify_close.json`, naming P-89 customer-done in full. That close is what unblocks P-90's dispatch to actually start.

### Out of scope

Any other hollow-export or refuse-shape work on `hauska-mcp-server`. Widening `isStoredDossierArtifactHollow`'s signature or callers beyond this one default. P-90 itself (hauska-engine). The flood-pair test still reading `assert.ok(true)` (P-89's own separate leftover, item 5, untouched here).

### Source

Full WDLL: `_inbox/2026-09-03_p115_hollow_artifact_failclosed_WDLL.md`. Gate finding: `_inbox/2026-09-03_p89_gate_reverify_close.json`.
