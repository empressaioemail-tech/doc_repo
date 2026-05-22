---
date: 2026-05-22
agent: cc-agent-E
repo: hauska-engine
session_type: execute
rolled_up: true
rolled_up_into: [00_current_state, 80_adrs/adr_019_layered_code_substrate]
---

> Filed by the doc_repo planner from the cc-agent-E `_inbox/` courier
> drop per HR-11. PR #24 verified **OPEN** via `gh pr view 24`
> (`state: OPEN`, `mergeable: MERGEABLE`, `mergeStateStatus: CLEAN`,
> commit `184eec6`); CI check `typecheck + test` `conclusion: SUCCESS`.
> **Awaiting operator merge.** Deliverable 4 (the corpus-edition plan)
> is rolled into [`80_adrs/adr_019_layered_code_substrate.md`](../80_adrs/adr_019_layered_code_substrate.md)
> Open decisions + revision history. The 16-item "needs confirmation
> from the live API / OpenAPI spec" list below is the operator's
> ICC-meeting checklist; pointed at from the `00_current_state.md` ICC
> watch-list item.

# ICC Code Connect prebuild — adapter shipped, extractor + eval rubric scoped

**Status: deliverable 1 (the adapter) shipped as hauska-engine PR #24,
CI green. Deliverable 4 (corpus-edition plan) resolved, below.
Deliverables 2 (model-code extractor) and 3 (Layer 1 eval rubric)
diagnosed and scoped this session; their build is the next break-point.
Operator-supervised — PR opened, not merged.**

The dispatch (`2026-05-22_cc-agent-E_icc_code_connect_prebuild`) is the
ICC Code Connect pre-credential build-out for ADR-019 Layer 1. The
keystone — the OAuth2 adapter, the credential-critical surface — is
done and verified; staging it inside the pre-meeting window was the
named priority.

## Deliverable 1 — ICC Code Connect adapter (DONE, PR #24)

`packages/corpus/src/adapters/icc-code-connect/`:

- `CodeConnectClient` — OAuth2 client-credentials flow with token
  caching + a 60s refresh buffer; typed `listTitles` / `getChapters` /
  `getChapter` / `getSection` / `search` / `getVersions` endpoint
  methods; `fetchCodeDocument` assembles a whole edition. Three modes:
  `live` (credentials), `mock` (fixtures, hermetic), `unconfigured`
  (neither — inert, so a bare construction stays green until the secret
  lands).
- `IccCodeConnectAdapter` — conforms to the existing `CodeSourceAdapter`
  contract; `normalize()` walks the assembled ICC JSON into the common
  `NormalizedBlock` stream (chapter/section headings, prose, tables,
  figures, structurally-tagged definitions, prose-parsed cross-refs).
- Hand-built IRC 2021 fixture + 21 hermetic tests (conformance,
  content, OAuth2 flow, unconfigured stub). Full corpus suite green
  (74 tests); typecheck green; CI on PR #24 green.

OAuth2 credentials slot in via `ICC_CODE_CONNECT_CLIENT_ID` /
`ICC_CODE_CONNECT_CLIENT_SECRET`, left empty until access lands.

## Diagnose-first findings

Read the existing adapter contract (`adapters/types.ts`), the Path C
Municode JSON walker, the RawPdfAdapter, the layered-substrate atoms
(`@hauska-engine/atoms` `code-section` with `verbatimTextDeepLink`,
`code-amendment` discriminated union from PRs #17/#18/#19), the generic
`extraction` + `atomization`, and the `eval` + `curated-queries`
modules. No contract drift; the ICC adapter slots into the established
patterns cleanly. One consequential observation drives deliverable 2:
the generic `atomize()` produces Layer 3 hosted sections (full
`bodyText`, no deep-link). Layer 1 needs the deep-link footing variant
— that is exactly deliverable 2, kept distinct rather than overloading
`atomize()`.

## Needs confirmation from the live API / OpenAPI spec

The Code Connect dev portal (`api.iccsafe.org`) is a credential-gated
SPA; only "OAuth 2.0 JSON API, returns sections/tables/figures/chapters,
search across titles, current + historical versions" is public.
Everything else in `code-connect-client.ts` is an assumed contract,
tagged `@assumption`. The operator should bring back, and we reconcile
against:

1. **OAuth2 token endpoint URL.** Assumed `https://api.iccsafe.org/oauth2/token`.
2. **OAuth2 grant style.** Assumed `client_credentials` with id/secret
   in a form-encoded body. RFC 6749 alternative is HTTP Basic for the
   client id/secret — confirm which.
3. **Token response shape.** Assumed `{ access_token, token_type,
   expires_in }`, `expires_in` in seconds.
4. **API base URL + version segment.** Assumed
   `https://api.iccsafe.org/codeconnect/v1`.
5. **Endpoint paths** for titles, chapters, a single chapter, a single
   section, search, and versions.
6. **The edition identifier.** Assumed field `titleId`; every other
   call keys on it, so it is the highest-value field to confirm first.
7. **Title fields** — `codeAbbrev`, `name`, `year`, `versionStatus`.
8. **Chapter response** — assumed lightweight section refs with bodies
   fetched per-section; the API may return whole chapters with inlined
   section bodies (then `fetchCodeDocument` skips the per-section
   fan-out).
9. **Section content shape** — assumed an ordered array of discriminated
   `prose | table | figure` nodes; the API may deliver a single HTML
   blob (then `normalize()` switches to an HTML walk).
10. **Cross-references** — assumed NOT structurally tagged; the adapter
    parses `Section R301.2` / `Table ...` citations from prose. If Code
    Connect tags them, prefer the structured field.
11. **Defined terms** — assumed structurally tagged (`definedTerms`)
    for the Definitions chapters; if absent, the extractor parses
    definitions from prose.
12. **Per-section deep-link** — whether a section response carries a
    free-viewer `viewerUrl`.
13. **Search** — result shape, title-scoped vs. global, pagination.
14. **Pagination** on `listTitles` / `getChapters` / `search` — assumed
    none; a full I-Code is large and the real API very likely paginates.
15. **Rate limits** — the client throttles at a conservative 2 rps;
    the real documented ceiling is unknown.
16. **ICC free Digital Codes viewer URL scheme** — assumed
    `codes.iccsafe.org/content/{CODE}{YEAR}`, and whether the viewer
    exposes per-section anchors (ADR-019's "deep-link target
    granularity" open decision; drives deliverable 2's deep-link
    precision).

## Deliverable 4 — corpus-edition plan (RESOLVED)

ADR-019 open decision: which I-Code editions to ingest first, in what
order. Resolution, for the planner to roll into ADR-019:

Ingest in three waves, ordered by how many jurisdictions in the active
corpus each edition immediately serves (the amortization logic ADR-019
turns on).

Wave 1 — the 2021 editions of the IRC, IBC, and IECC, in that order.
The Central Texas Tier 1 cities driving the current sprint (Round Rock,
Leander, Hutto, plus the queued Georgetown, Pflugerville, Cedar Park)
and Austin predominantly adopt the 2021 I-Codes; one 2021 ingest
immediately underlies the whole active corpus. IRC first because
residential plan review is the customer-zero volume surface; IBC
second; IECC third.

Wave 2 — the 2018 editions of the IRC, IBC, and IECC, the prior-cycle
editions still in force in slower-adopting jurisdictions, needed for
correct effective-rule resolution against those cities and for
as-of-time queries.

Wave 3 — the remaining I-Codes (IFC, IMC, IPC, IFGC) at 2021, then 2015
editions of the high-traffic codes as a tail.

Within each code, ingest the current edition before historical ones
(the adapter's `versionStatus` distinguishes them). The NEC (NFPA 70)
is excluded — it is an NFPA publication, not an I-Code, not on Code
Connect; a separate NFPA arrangement and dispatch.

Caveat: exact per-city adopted editions should be confirmed against
each city's adopting ordinance. That confirmation is not a blocker — it
is captured anyway by the Layer 2 jurisdictional-overlay ingest, which
records each city's adoption ordinance and the edition it adopts.

## Deliverables 2 + 3 — scoped for the next break-point

Deliverable 2, the model-code structural extractor. A new module
(`packages/corpus/src/extraction/model-code.ts` or a `model-code/`
dir) `extractModelCodeAtoms(document: IccCodeDocument, options) → {
edition, sections, definitions, crossReferences, links }`, producing
the four Layer 1 atom types the dispatch names. Distinct from the
generic `atomize()` because ADR-019 Layer 1 sections are on the interim
deep-link footing: `code-section.verbatimTextDeepLink` is set to the
ICC free-viewer URL, and `bodyText` carries the reasoning layer, NOT
the verbatim normative text. The verbatim text Code Connect returns is
input to the reasoning-layer step and to cross-reference / definition
detection, never persisted. The reasoning-layer generator is a
provider-agnostic hook with a deterministic non-LLM default (a
structural descriptor naming the code, edition, chapter, section, and
deep-link); the Claude wiring is a CLI-layer concern, mirroring the
`curated-queries` `LlmQueryGenerator` pattern. The edition + corpus
ingest as `public-free` (Layer 1 free-tier substrate per ADR-019).

Deliverable 3, the Layer 1 eval rubric. A curated `CuratedQuery` set
for the I-Code model-code ingest, mirroring the per-jurisdiction
1.0/1.0/1.0 eval the Sync 4/4.5/5 ingests use: a retrieval set
(reviewer-realistic I-Code queries — "what wind speed does the IRC
require for design", expected `code-section` atom), a coverage set
(section-number retrievability), and a cross-reference set. It cannot
run until the corpus exists; authored now so it is ready. It depends on
deliverable 2's atom-entityId scheme for each query's `expectedAtomDid`
— so deliverable 3 lands with or just after deliverable 2.

## Re-entry state

Branch `lane-e/icc-code-connect-adapter` pushed; PR #24 open against
`main`, CI green. hauska-engine working tree otherwise clean on a fresh
`main` pull. Next session: build deliverables 2 and 3 (one PR each per
the dispatch's split-by-surface guidance), branching from `main` after
PR #24 merges. The remaining Sync 5 Tier 1 cities (Georgetown,
Pflugerville, Cedar Park) resume after the ICC prebuild per the
dispatch's activation note.
