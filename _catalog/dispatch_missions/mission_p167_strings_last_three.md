## Mission — P-167 (wave 5): the last three reasons the strings differ

You are the deepest worker in OPS-23 wave 5. You do not spawn sub-agents. The dispatch
planner supervises you and runs `scripts/surface-probe.mjs --rows P-167 --observations <file>`
itself.

Exit-bounded verification: every command you run must terminate on its own; wrap anything that
could hang in `timeout`; never leave a watch, a tail or a dev server running.

### Where you work

`hauska-atom-contract-p167-strings` (substrate seat; branch `feat/p167-no-zoning-stamp-token`),
`hauska-engine-p167-strings` (branch `fix/p167-pdf-labels-from-vocab`), `hauska-map-p167-strings`
(branch `feat/p167-zoning-provenance-wire`), from `origin/main`; declare start commits.

### What is true today (P-167 wave-4 close, `_inbox/2026-09-13_p167-pdf_close.json`)

The package is `@empressaio/atom-contract` 1.33.1 with the `./display` vocabulary; every
consumer is pinned and no parity lock survives. The per-parcel strings still differ across the
panel, the MCP and the PDF for three named reasons:

1. `no-zoning-stamp` is a raw decline-reason code with no vocabulary token, so each surface
   prints it its own way.
2. hauska-engine `site-model.ts:658-660` hardcodes two PDF labels instead of reading the
   vocabulary's `pdfLabel` for those dispositions (documented as deliberate by the lane; it is
   the exception that keeps the predicate from PASS).
3. `zoningProvenance` has a citation URL at the MCP layer and no wire field in hauska-map's
   Property Explorer facets type, so the panel cannot print it.

### What you build

1. **Token.** Add `no-zoning-stamp` (display text and pdfLabel) to the display vocabulary; bump
   to 1.34.0; publish; bump the three consumers' pins; the parity guard test asserts the token
   is read from the package on every surface.
2. **PDF labels.** `site-model.ts:658-660` reads `pdfLabel` from the vocabulary; a test fails
   on a hardcoded string for any disposition the vocabulary defines. Deploy engine-api under
   the planner's lease.
3. **Wire field.** `zoningProvenance` on the Property Explorer facets type and the panel's
   zoning row prints it as the citation it is (the MCP already carries the URL). Deploy through
   the Vercel CLI.
4. **Observations.** Regenerate the side-by-side table for the five probe parcels across panel,
   MCP and PDF and write `_inbox/<date>_p167_observations.json` in the probe's shape with
   `displayStringsIdentical` true only where all three agree byte for byte.

### Falsifiers

- If any string differs on any surface after step 3, name the surface, the disposition and
  the string; if it is a fourth reason, it is a finding, not a fix.
- If the parity guard passes while a consumer hardcodes a defined token, the guard is vacuous.

### Out of scope

New dispositions. Setback values (P-152 lane 6).

### Close

`_inbox/<date>_p167-strings_close.json`, `planRows` `["P-167"]`, with the three PRs and merge
SHAs with conclusion strings, the npm version read, the revisions and deployment by field, the
table, the observation file path and the planner's probe artifact. `leave_behind` is required.
