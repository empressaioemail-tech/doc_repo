## Mission: Plan review honesty path — edition selector, typed absence, applicability matrix

Plan row G-108 (OPS-17, Layer 1 Wave 1). WDLL acceptance items 8, 9, 10 in
`_inbox/2026-08-25_govtech_wave1_WDLL.md` are the frozen definition of done — cite
them directly in your close.

### Context verified this session (2026-09-02), trust this over older docs

- `DEPLOY-7` is LIVE and graded (OPS-17 A-087): `plan-review-00014-zot` @100% +
  Vercel `plan-review-app-ten.vercel.app`. The neighbour-fallback fabrication defect
  is confirmed gone — a nonsense section now returns a typed absence, not a
  fabricated `R311.7`/`R302.1`. Build on top of this, do not re-fix it.
- The typed-absence PLUMBING already exists and is deployed:
  `src/code-lookup.mjs` ships `ABSENCE_KINDS` (`unchecked`, `source-unavailable`,
  `not-entitled`, `verified-absent`) and a `CODE_BOOKS` manifest keyed by book id
  (`IBC2018P6`, `IPMC2018P2` — both currently EMPTY manifests, zero sections
  ingested, by design per that file's own comments). Read that file before writing
  anything; it explains why the manifests are empty and what "resolved" means there.
  **Spelling is `verified-absent`, not `verified_absent` or `absent-verified`.** (A
  separate item, L3, tracks a spelling divergence elsewhere — do not import it here.)
- `editionId`/`applicability`/`plan_review_findings` do NOT appear anywhere in the
  route or lookup code today (grepped `src/` this session, zero hits outside
  `store.mjs`) — S2-9, S2-7, and S2-8 are genuinely unbuilt, not just ungraded.
  `store.mjs` is the only file already touching these concepts; start reading there.
- `GET /api/plan-review/code` requires `Authorization: Bearer $PLAN_REVIEW_SERVICE_TOKEN`
  (secret `plan-review-service-token` in GCP project `plan-review-505715`) — this is
  a PRE-EXISTING gate from PR #6, not something to build or remove. Any new probe or
  test against this route needs that header.
- Interim path: this track does NOT need S2-1 (engine migration) or DOC-5 (ADR-023
  ratification) to proceed. The WDLL's own interim clause allows an HTTP hop to
  `hauska-engine` retrieval-api (`$ENGINE_API_URL/v1/findings/generate`) for finding
  generation until S2-1 lands. Don't block on the operator ratifying DOC-5.

### Acceptance (from the frozen WDLL — do not edit, only cite)

**Item 8 — edition selector live.** UI exposes an edition selector bound to the
engagement; every returned citation-shaped object carries non-empty `editionId`.
Depends on items 1 (done) and 7 (Track A).

**Item 9 — typed absence, no silent empty success.** Forced corpus-unreachable
returns `verdict: "Unchecked"` with `absence.verdict` in
`{lookup-failed, absent-verified}`, never a 200 all-Pass matrix.

**Item 10 — honest applicability matrix.** At least one `Pass` and one `Fail` per
review run, or typed `Unchecked` for unreached sections — never a silent omit, never
hand-authored citation text.

### Out of scope

Do not touch Smart Files (Track A, G-106/G-107). Do not touch the ICC ledger (Track
D, G-109). Do not attempt S2-1 engine migration. Live Bastrop is absolute no-touch.
