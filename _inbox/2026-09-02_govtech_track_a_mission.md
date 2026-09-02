## Mission: Smart Files read-path scope, then staff upload

Plan rows G-106, G-107 (OPS-17, Layer 1 Wave 1). WDLL acceptance items 5, 6, 7 in
`_inbox/2026-08-25_govtech_wave1_WDLL.md` are the frozen definition of done for this
work — cite them directly in your close, do not re-derive.

### Context verified this session (2026-09-02), trust this over older docs

- Defect #3 ("Smart Files read scope write-only") is still open. PR #6 narrowed the
  BFF layer only; folder, file, document, and blob reads are not yet scope-checked.
- `P:/smart-files` (the primary local checkout) is DIRTY and 8 commits behind
  `origin/main` — do not build on it, do not touch it. The registered seat worktree
  `P:/seat-worktrees/govtech/smart-files` does not exist on disk yet — create it
  fresh from `origin/main` before starting (register it in
  `_catalog/seat_register.json` first if it isn't already; check current content,
  it may already be listed ahead-of-creation).
- Likely home for scope checks: `src/identity.mjs` (scope validators) and
  `src/server.mjs` (route handlers) in the smart-files repo — this is a pointer from
  a file-existence grep, not a verified read. Confirm the actual shape at source
  before writing anything.
- `template-city` is the Wave 1 tenant, not `icc-demo` (S1-17, WDLL item 6). Staff
  uploads must land under `entity_id` matching `smartfile:tenant:template-city:%`.

### Acceptance (from the frozen WDLL — do not edit these, only cite them)

**Item 5 — read-path scope enforced.** Anonymous or wrong-tenant reads of
folders/files/documents/blobs return 403. Matching-tenant service token returns 200.
Check commands are in the WDLL verbatim.

**Item 6 — tenant identity unified on `template-city`.** `entity_id` prefix check
plus `CITY_KEY`/`orgId` agreement across plan-review's deployed `web/app.js` and
`src/actors.mjs`.

**Item 7 — staff upload end to end.** File input in the plan-review UI, PDF upload,
provenance stamped (`capturedBy`, `capturedAt`, `sourceKind=staff-upload`,
`originalFilename`, `declaredRole`), bytes land in the city-scoped folder before
review runs.

### Sequencing

Item 5 first (read-path scope) — it's the prerequisite for everything else per the
WDLL's own dependency line. Items 6 and 7 follow. G-107 in OPS-17 depends on G-106,
DOC-1 (already filed, `_inbox/2026-08-24_govtech_transaction_contract.md`), and S3-1.

### Out of scope

Do not touch plan-review's honesty/edition-selector work (that's Track C, G-108).
Do not touch the ICC ledger (Track D, G-109). Do not redeploy DEPLOY-7 or DEPLOY-39
— both are live and graded (OPS-17 A-087). Live Bastrop (`smartcity-os`) is
absolute no-touch.
