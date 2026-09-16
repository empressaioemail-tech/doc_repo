## Mission — P-206: an earned retirement serves as a bare `parcel_not_found`

Do NOT spawn sub-agents. You are the deepest worker; do the work yourself.

### Where you work

`legacy-design-tools`. No worktree exists yet for this lane. Clone fresh from `origin/main`,
cut your own branch, and declare the commit you started from before you write anything. A
second lane (P-241's ETJ acquisition build) may be running concurrently in this same repo,
scoped to `lib/cad-ingest/src/boundary/` and `lib/db/src/schema/` — do not touch either path;
this row has no reason to.

### Why this row is dispatchable now — read this before assuming the blocker still applies

The row's own text says **"BLOCKED ON P-212: DO NOT DISPATCH THIS ROW FIRST"** — that block is
cleared. P-212 (the SEV-1 mass false retirement, 57,704 of 62,394 Bastrop parcel-nodes wrongly
marked retired) is resolved per OPS-16 A-178 (2026-09-16): 56,691 reactivated, verified three
independent ways. **This is not zero, though** — 57,704 minus 56,691 leaves roughly 1,013
parcel-nodes (about 1.8 percent of the county) still marked retired that this pass did not
reactivate. State this residual rate plainly in your close; it is the real remaining risk this
row's fix would expose (a serve path that finally honors retirement will show that ~1.8 percent
as retired too, correctly for most of them, possibly wrongly for some fraction still). This is
a much smaller blast radius than the 92.5 percent the row was originally blocked on, which is
why the row is now dispatchable — but "much smaller" is not "zero," so don't treat it as fully
resolved.

### The defect, as measured (row text, quoted)

`48209:84629` (Hays) at `get_smart_site` depth node returned `{"reason":"parcel_not_found",
"parcelExists":false}`, while the store holds an EARNED retirement for that node (`status:
retired, verdict: absent-verified, lastSeenTaxYear: 2025`, `asOf 2026-09-14T03:31:56Z`). The
vocabulary defines `parcel_not_found` as no record existing in coverage at all. `absent-
verified` is the highest-quality absence the vocabulary defines — a positive, checked claim
that the parcel does not carry a value — and the serve collapses it into "never had a record,"
which is a stronger and different claim than the data supports. This is the customer-facing
half of the same seam P-180 already fixed on the walk-grading side (merged `d249ba13`); the
walk grades a declined earned retirement correctly, and the serve still describes it wrongly.

### What I traced this session, so you don't re-derive it — and where I stopped

`parcelExists`/`reason` on a `get_smart_site` miss are **pass-through fields**, not computed
locally: `artifacts/smartsite-mcp/src/mcp-app.ts:2617-2636` (`missRowsFrom`) reads
`rec.parcelExists`/`rec.reason` directly off an already-fetched upstream JSON body (`rec`) and
does no existence check of its own — `parcelExists === false` just widens the `missClass`
classification, it never originates the claim. **`parcelExists` does not appear anywhere in
`artifacts/api-server` (zero grep hits)** — so whatever upstream call actually produces
`{"reason":"parcel_not_found","parcelExists":false}` for a `get_smart_site` node-depth call is
NOT the PE brief route I also checked (`propertyExplorer.ts`'s `sendBriefMiss`, lines 772-798,
which returns a different shape — `error: "parcel_not_found"` with no `parcelExists` field at
all, and is the PE web app's own miss path, probably unrelated to this row's evidence). **I did
not find the real originating function before handing this off — trace it yourself, live,
before assuming a fix location.** Start from `get_smart_site`'s node-depth handler in
`artifacts/smartsite-mcp/src/tools.ts` and follow its actual upstream call for a single-node
miss; the retirement vocabulary in the row's evidence (`status: retired, verdict: absent-
verified`) reads like Factory/ledger terms, so the real source may be a call into
`hauska-engine`'s `retrieval-api` (`parcelRecordReaderClient.ts`-style client) rather than
`api-server` at all — confirm, don't assume.

### The second mechanism the row already names — test before fixing

`48209:84629` is an **account-keyed** node; the serve path may be **parcel-keyed**. The row
warns `parcelExists:false` may be true at the parcel layer while the retirement lives at the
account layer — the ruled Hays crosswalk pattern (account attributes only through the published
crosswalk, never a bare-number join — `_decisions/2026-09-13` era ruling, referenced elsewhere
as "Hays node id is the parcel-map id"). **Test this before writing any fix.** If the account/
parcel layering genuinely makes today's question malformed, the row's own predicate accepts
that as a valid outcome: "a node with an earned retirement serves a declared retirement state
with its vintage, **or the account/parcel layering is shown to make the question malformed.**"

### Predicate (quoted from the row, do not weaken it)

"A node with an earned retirement serves a declared retirement state with its vintage, or the
account/parcel layering is shown to make the question malformed."

### Falsifiers, pre-register your answers before you run anything

1. **Re-measure `48209:84629` live**, exactly as the row did, and confirm the defect still
   reproduces on current `origin/main` before writing any fix — do not trust the row's
   2026-09-14 measurement as still current.
2. **Trace the real call chain** for that miss end to end (falsifier, not optional): name the
   exact function that first sets `parcelExists`/`reason` on the response body, in which repo.
3. **The account/parcel layering test.** Query the same node both ways (by its account-keyed id
   and by whatever the crosswalk resolves it to at the parcel layer, if they differ) and show
   whether the retirement claim changes depending on which key is used. This is the row's own
   named risk, not optional due diligence.
4. **A genuine `parcel_not_found` (a node that really has no record anywhere) must still read
   as `parcel_not_found`.** Your fix must not turn every miss into a retirement claim — find or
   construct a real never-existed node and confirm it still resolves honestly.
5. **The residual ~1.8 percent.** Pick a handful of still-retired Bastrop nodes from the P-212
   close's own unreactivated set (57,704 minus the 56,691 reactivated) and check whether your
   fix would now present any of them as a confident "retired" claim that is itself still wrong.
   If so, say so plainly — this row does not get to inherit P-212's residual error silently.

### Known traps

- Do not assume the fix belongs in `legacy-design-tools` just because the row's title says
  "legacy-design-tools serve path" — that was true of the ORIGINAL miss route the row's author
  had in mind, but I could not confirm it traces there for the actual `get_smart_site` call.
  If your trace lands in `hauska-engine`, say so and scope the fix there instead of forcing it
  into this repo.
- `absent-verified` is Factory/ledger vocabulary (see the atom-contract's `VerificationState`
  and the "ledger is the serving path" canon). If the real source of truth for this claim is the
  ledger and not whatever `api-server` currently queries, the honest fix may be a read-path
  change (consult the ledger) rather than a copy/vocabulary change on the existing miss.
- Do not conflate this with P-204 (mid-cutover rails) or P-201 (gate-verdict three-state split)
  — those are hauska-factory publish-gate concerns; this row is about what the MCP/serve layer
  tells a customer about ONE already-identified node, a different layer entirely.

### Do not

- Do not touch `lib/cad-ingest/src/boundary/` or `lib/db/src/schema/` — a concurrent lane owns
  the ETJ acquisition build there.
- Do not deploy. Open the PR green and hand it back.
- Do not spawn sub-agents.

### Close

State your snapshot (repo, branch, commit). Name the exact function and repo where
`parcelExists`/`reason` actually originate for a `get_smart_site` node miss — this alone is a
real finding even if you get no further. State plainly which predicate branch you satisfied
(the fix, or "the question is malformed") and why. Paste all five falsifier results with real
data, including the account/parcel layering test and the residual-1.8-percent check. Declare
`leave_behind` explicitly.
