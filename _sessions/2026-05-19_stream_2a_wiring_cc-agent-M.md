---
id: 2026-05-19_stream_2a_wiring_cc-agent-M
title: Session — hauska-mcp-server Stream 2A wiring (Sync 1 + Sync 3 consumed; live end-to-end pair-up; Phase 0 trim landed)
date: 2026-05-19
agent: cc-agent-M
repo: hauska-mcp-server
session_type: engineering
rolled_up: false
rolled_up_into: []
---

## What was done

Session kickoff per `_dispatches/2026-05-18_cc-agent-M_hauska_mcp_server.md` plus Nick's Stream 2A dispatch this morning. Two sync points landed on the consuming side; one cross-repo fix went into hauska-engine to unblock local end-to-end testing on Windows.

Stream 2A work in `hauska-mcp-server` shipped on feature branch `feat/stream-2a-wiring`; PR open at [empressaioemail-tech/hauska-mcp-server#1](https://github.com/empressaioemail-tech/hauska-mcp-server/pull/1). Single commit `701a87e` on top of `2c0e277` from the prior 2B foundations session.

**Sync 1 fold-in.** Added `@hauska/atom-contract@^1.0.0` to `package.json` dependencies. cc-agent-AC published the package this morning; Bump 1 cross-repo pin lands here as part of Stream 2A rather than a separate planner-owned PR, since it's a single-line dep addition co-located with the wiring work that consumes the contract.

**Sync 3 consumed.** `src/hauska-client.ts` replaced end to end with a native-fetch HTTP client against the engine retrieval API. Five endpoints wired against the locked contract at `services/retrieval-api/src/server.ts`:

- `GET /search` → `search_atoms`
- `GET /atoms/:did` → `get_atom`
- `GET /jurisdictions` → `list_jurisdictions`
- `GET /jurisdictions/:id` → `query_jurisdiction`
- `GET /jurisdictions/:id/permits` → `search_permit_atoms`

Bearer-token auth via `HAUSKA_ENGINE_API_KEY`; base URL via `HAUSKA_BACKEND_URL` (default `http://localhost:8080`, matching the engine's default port). 10-second per-request timeout via `AbortController`. `EngineUnreachableError` and `EngineHttpError` surfaced so tool handlers can present `unreachable` vs `4xx` vs `5xx` cases distinctly to agents. 404 on `/atoms/:did` and `/jurisdictions/:id` maps cleanly to `{atom: null}` / `{status: null}` rather than a thrown error, since those are normal-traffic empty results.

Wire-shape types live alongside the client: `CodeAtomEntityType`, `AtomSearchResult`, `AtomInstanceBase`, `JurisdictionStatusSnapshot`, plus per-endpoint response types. They mirror the engine's storage port + atom-instance shapes by hand rather than importing `@hauska-engine/*` workspace packages, so the mcp-server build graph stays clean and a future engine contract drift surfaces as a type error in `tools.ts`.

**Phase 0 tool surface trim.** Per Phase 0 close [`_decisions/2026-05-18_substrate_v1_phase_0_close.md`](../_decisions/2026-05-18_substrate_v1_phase_0_close.md):

- `get_permit_requirements` renamed to `search_permit_atoms`. Honest Layer 1 retrieval semantics: returns permit-tagged atoms, not engine-inferred permit requirements (engine-side reasoning lives in Codex 1b per [`29_mcp_surface_tier_model.md`](../29_mcp_surface_tier_model.md)).
- `query_jurisdiction` dropped `parcel_id` and `address` parameters. Parcel atoms are Bump 2 per [`27_engine_evolution_plan.md`](../27_engine_evolution_plan.md) Stream B and out of v1 scope; the tool now returns a per-jurisdiction status snapshot only (loaded edition, quality bar, atom count, drift).
- `search_atoms` gained an optional `entity_type` filter against the six Bump 1 atom types; limit max bumped from 50 to 100 to match the engine.
- `get_atom` `atom_id` parameter is now Zod-validated as a Hauska DID (`did:hauska:<entityType>:<localId>`); mocked-stub IDs no longer pass the gate.

**Atom-shape response envelope.** New module `src/atom-shape.ts` builds a consistent envelope every tool response uses: original engine payload under `data`; provenance entries under `atoms` (each carrying DID + content hash + source adapter + source URL + fetched-at, with a `cidNote` explaining that the retrieval API exposes content hash directly and CID maps from content hash at storage time per [ADR-010](../80_adrs/adr_010_atom_graph_traversal.md)); free-tier attribution under `meta.attribution`. The attribution string is the verbatim brand form `Powered by Hauska Engine — hauska.dev`; the em dash is intentional per the brand convention even though internal prose stays em-dash-free.

**Tier-aware behavior threaded.** The MCP SDK tool handler does not receive the Express `req` object, so per-tier behavior (currently: should the attribution string surface) needed a different plumbing path. `src/request-context.ts` uses `AsyncLocalStorage` to bind the auth context around the `transport.handleRequest()` call in `index.ts`; tool handlers read tier via `getCurrentTier()` without changing handler signatures. Per [`50_hauska_mcp_server.md`](../50_hauska_mcp_server.md) §Free-tier-attribution: Embedder tier strips attribution; every other tier retains it.

**Per-request McpServer + transport.** Real bug caught during end-to-end probe: the MCP SDK's stateless-mode `StreamableHTTPServerTransport` throws `Stateless transport cannot be reused across requests` on the second call (`node_modules/.../webStandardStreamableHttp.js:140`). The previous Stream 2B scaffold shared one transport across requests, which silently worked for the first `tools/list` call I sent during 2B but never tried tools/call. `index.ts` now builds a fresh server + transport per `/mcp` POST and tears them down on response close. Tool registration is cheap (Zod schema attachment, no I/O), so the per-request cost is negligible.

**Dev-mode opt-out.** `HAUSKA_DEV_MODE=true` skips Postgres + Upstash provisioning, swaps the auth middleware for a pass-through that tags every request as `free_anonymous`, and uses the in-memory rate-limit store. This unblocks local end-to-end testing without standing up Cloud SQL + an Upstash dev DB. Production must leave it unset; the dev startup logs a `dev_mode_enabled` warning.

**Cross-repo fix in hauska-engine.** Discovered during the e2e pair-up: `services/retrieval-api/src/index.ts` `isMain` check used `process.argv[1].endsWith("services/retrieval-api/src/index.ts")` with forward slashes, which never matched on Windows where argv[1] is backslash-pathed. Engine started under `tsx watch` but `startServer` was silently skipped, so no port bound. Patched in commit [`d55d51d`](https://github.com/empressaioemail-tech/hauska-engine/commit/d55d51d) on `hauska-engine` `main`: normalize backslashes before the endsWith check. Push also carried Nick's local-only `4256bf2 feat(migrate-legacy-codes)` commit from this morning; both went up cleanly.

**End-to-end pair-up.** Engine on `:8080` + mcp-server on `:3000` in dev mode. All five tools verified live via curl:

- `tools/list` returns all five tools with the trim applied (search_permit_atoms present, no get_permit_requirements).
- `tools/call list_jurisdictions` returns the atom-shape envelope with empty `jurisdictions` (corpus not loaded), empty `atoms`, attribution string present.
- `tools/call search_atoms` returns empty results, attribution present.
- `tools/call query_jurisdiction` with `jurisdiction=bastrop-tx` returns `status: null` plus the helpful note "Jurisdiction not loaded. Call list_jurisdictions to see available tenants."
- `tools/call search_permit_atoms` returns null status plus empty permits.
- `tools/call get_atom` against a synthetic DID returns null + the "No atom found" note.
- `tools/call get_permit_requirements` (old name) returns `MCP error -32602: Tool get_permit_requirements not found`. Rename verified.

Empty arrays are the expected Stream 2A done state per dispatch: data load is cc-agent-E's pending Sync 4 work, and the dispatch explicitly stated wiring being live and correct is the done criterion, not data being populated.

**Tests.** 38/38 pass (13 new for Stream 2A + 25 existing for Stream 2B). 13 new tests cover atom-shape envelope per-tier attribution rules (free / free-key / pro / team / embedder), provenance shape (DID, content hash, source from search-result vs full atom), per-tool envelope builders, plus mocked-fetch wire conformance for every endpoint and the 404→null fallback paths. `tsc --noEmit` clean.

**REPO_NOTES.md** rewritten with the local-dev pair-up sequence, the `NODE_OPTIONS=--use-system-ca` requirement on Nick's Windows box, the stateless-transport per-request constraint, and the AsyncLocalStorage threading pattern.

**CHANGELOG.md** added. v0.1.0 is the Stream 2B foundation; the Stream 2A work lands as `[Unreleased]` with the two breaking changes (`get_permit_requirements` rename, `query_jurisdiction` parcel-path drop) flagged.

## What was learned

Four things worth carrying forward.

**The MCP SDK stateless transport cannot be reused across requests.** This is documented in code (`webStandardStreamableHttp.js:140` throws `Stateless transport cannot be reused across requests. Create a new transport per request.`) but is not in the SDK's README or the StreamableHTTPServerTransport docstring example block. Stream 2B's scaffold shipped with a shared transport that silently worked once. Every product MCP retrofit on this SDK version should use the per-request build pattern from the start. Worth a one-line note in [`28_mcp_first_product_design.md`](../28_mcp_first_product_design.md) so Codex 1a, Codex 1b, SmartCity OS, and Cortex retrofits don't re-litigate.

**Tool handler context threading.** Express `req`-augmentation is the cleanest place to stash per-request data (we use `req.hauska` from Stream 2B for tier, key_id, etc.), but the MCP SDK tool handler does not see `req`. `AsyncLocalStorage` is the idiomatic Node solution. The pattern is: bind on `requestContext.run(ctx, async () => { await transport.handleRequest(...) })` in the Express handler, read via `getCurrentTier()` inside tool handlers. Same pattern will apply to every product MCP retrofit that needs tier-aware or tenant-aware behavior in tool handlers.

**Brand-string em dashes vs prose em dashes.** The attribution string is the canonical example: `Powered by Hauska Engine — hauska.dev` ships the em dash intentionally because brand conventions outrank the portfolio prose rule. The rule from [`CLAUDE.md`](../CLAUDE.md) Communication section ("No em dashes or en dashes anywhere") is for prose Nick writes, drafts, ADRs, session summaries, commit messages. Verbatim brand strings, third-party content, and direct quotes are exempt. Worth a one-line clarification in CLAUDE.md so this stops being ambiguous (I flagged the same conflict in the 2026-05-18 session close after over-applying the rule to commit subject lines).

**Engine `isMain` on Windows.** Same pattern as `NODE_OPTIONS=--use-system-ca`: Node-on-Windows quirks that bite local dev but pass cleanly through Linux CI. The two together (TLS cert + path separator) effectively bricked local end-to-end testing before this session resolved both. Worth checking other tools/services that use `import.meta.url` or `process.argv[1]` comparisons for similar issues — a portfolio-wide sweep would be cheap.

## What's still open

Stream 2A follow-ups deferred from this session:

- **Bastrop UDC + Grand County IRC live data pass.** Tools return real responses against the wire but the corpus is empty. cc-agent-E's pending Sync 4 work (first jurisdiction passes eval) unblocks meaningful data round-trips. When Sync 4 lands, re-run the e2e probe and capture sample tool outputs in the next cc-agent-M session summary.
- **MCP Inspector pass.** The Inspector is browser-based; I exercised the wire via curl as the headless equivalent. Once Bastrop is loaded, run `npx @modelcontextprotocol/inspector http://localhost:3000/mcp` against the local pair and capture a screenshot for the launch package.
- **Pagination on `/jurisdictions`.** The engine currently returns the full list; at 20+ jurisdictions per Sync 5 this should chunk. Engine-side concern, not Stream 2A's; flagging.
- **Response payload size cap.** `search_atoms` with `limit=100` plus 1KB snippets could return ~150KB. MCP clients may truncate. Not a 2A done-criterion issue, but worth adding to Stream 2C observability so we know if it bites in production.

Other Track 2 work, in dependency order:

- **Stream 2C structured logger upgrade.** Phase 0 shape (`{ts, request_id, method, params, ip, key_hash, tier, response_status, atom_ids_returned, latency_ms, tool, jurisdiction}`) plus Postgres index + GCS raw payloads. The field plumbing is in place from 2B (req.hauska carries tier, key_id, rate_limit_id); 2C wires those into the logger and adds the request_id middleware. Natural next session.
- **Stream 2D Dockerfile + Cloud Run scaffold.** Independent of Sync 4. Secret Manager bindings now need: `DATABASE_URL`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `HAUSKA_ADMIN_BOOTSTRAP_KEY`, `HAUSKA_BACKEND_URL`, `HAUSKA_ENGINE_API_KEY`.
- **Stripe scaffold + self-serve signup (Phase 8).** Stream 2B follow-up; not blocking sprint exit.

Sync points consumed this session: **Sync 1** (atom-contract dep pin) plus **Sync 3** (retrieval API wired). Sync 4 + Sync 5 remain pending (cc-agent-E).

## Suggested canonical doc updates

Two light updates plus two findings:

- **[`00_current_state.md`](../00_current_state.md) §5 (Recent session summaries).** Prepend a line pointing at this session.
- **[`51_substrate_v1_sprint.md`](../51_substrate_v1_sprint.md) §Stream 2A.** The backend-coupling plus tool-surface-trim plus atom-shape plus attribution sub-bullets can flip from `[ ]` to `[x]`. The live-data integration test sub-bullet stays `[ ]` pending cc-agent-E Sync 4.
- **[`28_mcp_first_product_design.md`](../28_mcp_first_product_design.md).** One-line note: every product MCP retrofit on the `@modelcontextprotocol/sdk` should build the McpServer + StreamableHTTPServerTransport per request in stateless mode. Saves Codex 1a, Codex 1b, SmartCity OS, and Cortex sessions from re-discovering this.
- **[`CLAUDE.md`](../CLAUDE.md) Communication section.** Clarify that the no-em-dash rule applies to prose Nick writes / drafts / ADRs / session summaries / commit messages, but verbatim brand strings (e.g. `Powered by Hauska Engine — hauska.dev`), third-party content, and direct quotes are exempt. Resolves the ambiguity I hit in 2026-05-18 session close (where I used em dashes in commit subjects following cc-agent-E's earlier-in-the-day pattern) and locks in the right rule going forward.

## Commit batch

Three commits land this session close, two repos:

- `hauska-engine` `main` `d55d51d`: `fix(retrieval-api): normalize argv path so isMain matches on Windows`. Pushed. Carried Nick's local-only `4256bf2 feat(migrate-legacy-codes)` commit along with it.
- `hauska-mcp-server` `feat/stream-2a-wiring` `701a87e`: `feat(2a): wire tools to hauska-engine retrieval API + Phase 0 trim + atom-shape envelope`. Pushed; PR #1 open at [empressaioemail-tech/hauska-mcp-server#1](https://github.com/empressaioemail-tech/hauska-mcp-server/pull/1). Squash-merge on operator approval per the established pattern.
- `doc_repo` `main`: this session summary.
