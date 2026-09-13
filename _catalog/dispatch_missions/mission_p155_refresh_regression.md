## Mission — P-155 (wave-5 addendum): the feasibility refresh produces no new document

You are the deepest worker in OPS-23 wave 5. You do not spawn sub-agents. The dispatch
planner supervises you, reviews CP1 and CP2, and runs the surface probe itself.

Exit-bounded verification: every command you run must terminate on its own; wrap anything that
could hang in `timeout`; never leave a watch, a tail or a dev server running.

### The finding (F23, overseer 2026-09-13)

`export_instrument` kind `feasibility` for `48021:34049`, called twice about a minute apart at
23:00Z, returned byte-identical PDFs (sha256 `84eab707…`, 1,172,470 bytes) whose
`/CreationDate` is `2026-09-13T19:12:15Z`, two hours before hauska-engine #440 deployed
(`hauska-engine-api-00217-gir`, 100 percent). The P-167 lane saw the same across repeated
calls. P-155 closed PASS on 2026-09-12 on the operator's first click (the async refresh
returned 202 with a job reference and the download landed within the poll budget). Something
between then and now stopped the refresh from producing a new document: the refresh hop returns
a cached artifact, or the background job fails silently, or the MCP path skips the refresh hop.
No Cloud Run job named for feasibility exists in either project (the refresh runs in-process
in the engine, if it runs).

### Where you work

`hauska-engine-p155-refresh` (branch `fix/p155-refresh-produces-new-document`) and
`legacy-design-tools-p155-refresh` (branch `fix/p155-mcp-refresh-hop`), from `origin/main`;
declare start commits. `hauska-map-p155-feasibility-poll` from wave 1 exists if the BFF's poll
path is implicated.

### What you build

1. **Read the path.** From `export_instrument` (LDT `artifacts/smartsite-mcp`) through the
   engine's refresh route (`pe-feasibility-export-handler.ts` and the 202/job path P-155
   built) to the document store: what the refresh returns today for `48021:34049`, what the
   job does, where it logs, and what the cache key and TTL are. CP1 is this reading, with the
   log lines for one refresh call pasted (request id, job id, outcome).
2. **State the mechanism and one rejected alternative.** Then fix it: a refresh call must
   either produce a new document within the poll budget or return a typed refusal that says
   why (`refresh_failed`, with the job's error), never a stale 200 presented as fresh. The
   document's `generatedAt` is on the wire beside the bytes so a caller can see its age.
3. **Verify by violation live.** Two `export_instrument` calls after the deploy: the second
   document's `/CreationDate` is later than the first's, or the response is the typed refusal.
   Paste both dates and both sha256 prefixes. Then the P-155 probe row with the operator's
   click observation as before.

### Falsifiers

- If after the fix two calls still return the same `/CreationDate`, the refresh still does
  not run; if they differ but the content is stale (pre-#440 strings), the job reads the wrong
  source.
- If a refresh failure returns 200 with the old bytes, the fix widened nothing.

### Out of scope

The report's content (P-152, P-167). The 55 s client budget (already solved by the poll).

### Close

`_inbox/<date>_p155-refresh_close.json`, `planRows` `["P-155"]`, with the log lines, the PRs
and merge SHAs with conclusion strings, the revisions by field, the two dated exports, and the
planner's probe artifact. `leave_behind` is required.
