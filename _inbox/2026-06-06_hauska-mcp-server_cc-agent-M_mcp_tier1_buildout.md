---
date: 2026-06-06
agent: cc-agent-M
repo: hauska-mcp-server
dispatch: 2026-06-06_cc-agent-M_mcp_tier1_buildout
model: Grok Build 0.1 (default; no escalation)
---

# cc-agent-M — Tier 1 MCP build-out session close

## Atom refs touched

- `current-state:portfolio` — build-out lane, Cotality credential blocker
- `mcp-offer:52` §3a — tool spec table (contract-grade names)
- `decision:2026-06-06_v1_tier_pricing_decision_b` — Layer 2 metering deferred to SDK sprint

## PR + branch

| Field | Value |
|---|---|
| Branch | `tier1/mcp-tier1-buildout` |
| SHA | `f806cab558687eaf5bc357796ad827df6e9e7da9` |
| PR | https://github.com/empressaioemail-tech/hauska-mcp-server/pull/25 |
| Merge | **MERGED** — see Operator merge close below |

## Workspace hygiene (verbatim)

```
On branch tier1/mcp-tier1-buildout
Your branch is up to date with 'origin/tier1/mcp-tier1-buildout'.

Untracked files:
  _research/2026-05-20_mcp_architecture_map.md
  _sessions/2026-05-26_cc-agent-M_post_batch49_snapshot_deploy.md
  pnpm-lock.yaml

nothing added to commit but untracked files present
```

Recent commits at session start:

```
0842d07 feat(gtm): discoverability docs, place MCP tools, GTM observation (#24)
91d4799 feat: add brokerage workspace retrieval MCP surface (#23)
f181ae7 docs: Lane M final hand-off summary (#22)
```

## Scope landed

### Group A — Property Brief (keystone)

| Tool | Backend | Gate |
|---|---|---|
| `generate_property_brief` | `POST /api/brokerage/v1/brief` | `requireProduct(..., "cortex")` |
| `get_property_brief_run` | `GET /api/brokerage/v1/brief/{runId}` (MCP-first contract) | cortex |

- `legacyClient.generateBrief({ address, mls_id?, source?, presentationMode? })`
- `legacyClient.getBriefRun({ runId })`
- Envelope: `generateBriefEnvelope` / `getBriefRunEnvelope` — `did:hauska:brief-run:<runId>` + cited inline refs

### Group B — Hydrology and topography

| Tool | Backend |
|---|---|
| `simulate_site_drainage` | `POST /api/engagements/:id/site-drainage/refresh` |
| `get_site_drainage` | `GET .../site-drainage` (+ optional design-storms) |
| `get_site_topography` | `GET .../site-topography` (+ optional `refresh=true` → POST refresh) |

Engagement-scoped v1 contract per §3a.

### Group C — Encumbrances

| Tool | Backend |
|---|---|
| `search_encumbrances` | `GET /api/brokerage/v1/workspaces/encumbrances?workspaceDid=...` |
| `get_restrictions` | Same route; tool projects restriction-clause provenance |

Note: legacy route still requires `X-Hauska-Install-Id` today (`brokerageEncumbrances.ts:84`). MCP client uses bearer + optional `x-hauska-mcp-service`; e2e blocked until cc-agent-C service path.

### Group D — Cotality (designed, inert)

| Tool | Adapter key |
|---|---|
| `get_property_detail` | `cotality:property` |
| `get_replacement_cost` | `cotality:replacementCost` |
| `get_hazard_profile` | `cotality:hazards` |
| `get_parcel_polygon` | `cotality:parcels` |

When `COTALITY_CLIENT_ID` + `COTALITY_CLIENT_SECRET` are absent → `credential-pending` envelope via `credentialPendingEnvelope` (no fetch, no fake data). Docs-site copy not updated (tools marked DESIGNED, INERT in `tool-copy.ts`).

## cc-agent-C seam status

| Seam | MCP wiring | Live e2e |
|---|---|---|
| Brief service auth + metering bypass | Bearer + `LEGACY_MCP_SERVICE_TOKEN` → `x-hauska-mcp-service` header on `brokerageFetch` | **Mock-tested only.** POST brief works without install id (wallet paywall skipped when no install id). GET `brief/{runId}` is MCP-first — route not yet in cortex-api at session time. |
| Drainage/topography place-scoped entry | Not built (fast-follow per dispatch) | Engagement-scoped routes wired |
| Encumbrances service caller | Bearer on GET encumbrances | Blocked on install-id middleware |
| Cotality adapter routes | MCP-first POST paths under `/api/brokerage/v1/cotality/*` | Blocked on CoreLogic OAuth (`Invalid client identifier`) |

## Tool-name / shape divergence from §3a

**None requiring planner ratification.** Names match §3a exactly. Minor implementation notes (not contract changes):

1. **`get_site_topography`** — single tool with `refresh: boolean` param to cover both POST refresh and GET read (§3a lists one tool wrapping both verbs).
2. **`get_site_drainage`** — optional `include_design_storms: boolean` bundles the design-storms GET (§3a lists design-storms as part of the drainage surface).
3. **`get_restrictions`** — same upstream GET as `search_encumbrances`; MCP layer projects clause-focused envelope (`restrictionsEnvelope`).

## Verification artifacts (HR-8)

### `npm run lint`

```
> hauska-mcp-server@0.1.0 lint
> tsc --noEmit

(exit 0)
```

### `npm test` (verbatim tail)

```
✔ requireProduct denies public key for generate_property_brief (1.0064ms)
✔ requireProduct allows cortex key for generate_property_brief (0.1822ms)
ℹ tests 238
ℹ suites 0
ℹ pass 238
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 1055.3089
```

New test file: `tests/tier1-cortex-tools.test.ts` (11 cases — brief, drainage, encumbrances, Cotality credential-pending, product gate, envelope shape).

## Blockers (verbatim)

1. **cc-agent-C brief service path** — `GET /api/brokerage/v1/brief/{runId}` not present in cortex-api at read time (dispatch cites `:687` but live file has research-chat at that line). MCP client defines contract; e2e blocked.
2. **Encumbrances install-id gate** — `brokerageEncumbrances.ts` requires `X-Hauska-Install-Id`; MCP bearer caller cannot list encumbrances until service path lands.
3. **Cotality OAuth** — `Invalid client identifier` (operator-mechanical fix per `00_current_state.md`). Group D tools correctly return credential-pending.
4. **MCP Inspector round-trip** — not run in this session (operator acceptance step).

## Files changed

- `src/legacy-client.ts` — Tier 1 wire types + 14 new methods
- `src/atom-shape.ts` — brief-run, site-drainage/topography, encumbrance, credential-pending envelopes
- `src/tools.ts` — 12 tool registrations
- `src/tool-copy.ts` — LLM descriptions
- `scripts/generate-tool-reference.ts` — Cortex product classification for new tools
- `tests/tier1-cortex-tools.test.ts` — mock-fetch contract tests

## Out of scope (confirmed not built)

- Site-context single tools (`get_flood_zone`, etc.) — de-scoped per §3a
- Tier 1.b code-intelligence tools — cc-agent-E dispatch
- Per-call metering/charging — SDK sprint item 3

---

## Operator merge close (2026-06-07)

PR #25 merged by operator. Tier 1 MCP build-out is on `main`.

### Merge record (verbatim)

```
gh pr view 25 --json state,mergedAt,mergeCommit,title,url
```

```json
{
  "state": "MERGED",
  "mergedAt": "2026-06-07T12:51:27Z",
  "mergeCommit": { "oid": "a9638707c67681f2a3b0716e8cac137da1f483b7" },
  "title": "feat(tier1): Layer 2 MCP build-out — brief, drainage, topography, encumbrances, Cotality",
  "url": "https://github.com/empressaioemail-tech/hauska-mcp-server/pull/25"
}
```

| Field | Value |
|---|---|
| PR | https://github.com/empressaioemail-tech/hauska-mcp-server/pull/25 |
| Branch (source) | `tier1/mcp-tier1-buildout` |
| Branch SHA (pre-merge) | `f806cab558687eaf5bc357796ad827df6e9e7da9` |
| Merge commit on `main` | `a9638707c67681f2a3b0716e8cac137da1f483b7` |
| Merged at | 2026-06-07T12:51:27Z |

### `origin/main` head after merge (verbatim)

```
a963870 feat(tier1): register Layer 2 MCP tools for brief, drainage, encumbrances, Cotality (#25)
0842d07 feat(gtm): discoverability docs, place MCP tools, GTM observation (#24)
91d4799 feat: add brokerage workspace retrieval MCP surface (#23)
```

Merge commit message:

```
feat(tier1): register Layer 2 MCP tools for brief, drainage, encumbrances, Cotality (#25)

Lift cortex-api engine surfaces into product-gated cortex tools with legacyClient
contracts, provenance envelopes, and mock-fetch tests pending cc-agent-C service seams.

Co-authored-by: hauskababylon <nick.smith@hauska.ai>
Co-authored-by: Cursor <cursoragent@cursor.com>
```

### Surface now on `main` (58 tools total)

**New Layer 2 cortex tools (12):**

- `generate_property_brief`, `get_property_brief_run`
- `simulate_site_drainage`, `get_site_drainage`, `get_site_topography`
- `search_encumbrances`, `get_restrictions`
- `get_property_detail`, `get_replacement_cost`, `get_hazard_profile`, `get_parcel_polygon` (Cotality — credential-pending until OAuth clears)

**Prior surface unchanged:** 46 tools (Layer 1 catalog + place/workspace + codex + cortex Groups 1–3).

### Acceptance criteria status post-merge

| Criterion | Status |
|---|---|
| Groups A/B/C registered, cortex-gated, provenance envelopes | **Landed on main** |
| `legacy-client.ts` methods + mock-fetch contract tests | **Landed on main** |
| Group D credential-pending, no fake data, not live in docs-site | **Landed on main** |
| `npm test` green at merge | **238 pass** (pre-merge CI) |
| PR operator merge | **Done** (#25) |
| MCP Inspector round-trip | **Still open** (operator) |
| cc-agent-C service seam e2e | **Still open** (brief GET, encumbrances install-id bypass) |
| Cotality OAuth activation | **Still open** (operator-mechanical) |

### cc-agent-C seam status (unchanged post-merge)

MCP-side contracts ship on `main`; live e2e remains blocked on cortex-api service paths documented in session close above. cc-agent-C dispatch: `2026-06-06_cc-agent-C_brief_service_endpoint_exposure.md`.

### Blockers still active

1. `GET /api/brokerage/v1/brief/{runId}` — MCP-first; cortex-api route pending cc-agent-C
2. Encumbrances — legacy `X-Hauska-Install-Id` gate; service path pending cc-agent-C
3. Cotality — `Invalid client identifier`; Group D tools return credential-pending correctly
4. MCP Inspector per-tool round-trip — operator acceptance step not yet recorded

### Local clone note

Agent clone remained on `tier1/mcp-tier1-buildout` at merge time; `origin/main` advanced to `a963870`. Operator/local should `git checkout main && git pull` to pick up merged surface.
