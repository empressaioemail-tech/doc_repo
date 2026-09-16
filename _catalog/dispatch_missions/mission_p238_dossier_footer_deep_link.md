## Mission — P-238: X-ray dossier footer counter and deep link

Do NOT spawn sub-agents. You are the deepest worker; do the work yourself.

### Where you work

Fresh clone of `empressaioemail-tech/hauska-engine` from `origin/main`, on a
new branch `fix/p238-dossier-footer`. Declare the commit you started from
before you write anything.

### The defect

The X-ray dossier assembler renders the new chrome masthead correctly (SMART
SITE wordmark, `PROPERTY X-RAY` doctype, `PARCEL <id>` subject meta,
disclaimer line — all present, all decode cleanly) but its footer carries
**no `SHEET nn / NN` counter and no deep link**, on every regenerated
`XR-<parcel>` dossier. P-228 already fixed and verified this exact footer
(counter `01/10`..`10/10`) on the Feasibility assembler, which shares the
same header primitive with the dossier assembler — this row is that same
fix, applied to the dossier assembler, which was in scope for P-228's lane
but not completed there.

Read `_design/report-chrome/README.md` in this repo (or doc_repo, wherever it
resolves — check both) for the footer spec and the deep-link host decision:
production is `smartsite.cloud`, never `smartsite.app` (a parked stub).

### What to build

Find the Feasibility assembler's footer implementation (disclaimer,
generation timestamp, deep link, zero-padded `SHEET nn / NN` counter) and
apply the same footer to the X-ray dossier assembler. Do not reimplement it
independently — reuse the shared primitive if the two assemblers already
share one, or extract one if they don't, rather than forking the format a
second time.

### Verification (exit-bounded — every command must terminate on its own; no watch, tail, or serve)

Generate a real X-ray dossier for a real parcel and decode it — **do not grep
the PDF for the footer text**, per this repo's own recorded finding: these
PDFs use Identity-H CID fonts, and drawn text is not greppable. Decode via the
ToUnicode CMap (inflate the FlateDecode streams, parse `beginbfchar` into a
CID→Unicode map, decode each `<hex> Tj` operand) the same way P-228's lane
verified the Feasibility fix. Confirm the deep link resolves to
`smartsite.cloud`, not `smartsite.app`. Also confirm the fonts used are the
already-embedded Barlow variants with a real ToUnicode CMap, never
`pdf-lib`'s `StandardFonts` — P-228's lane found `StandardFonts` text is
silently invisible to this exact verification method, which would make a
broken footer look like a passing one. Run this repo's test suite and
typecheck; confirm both exit 0, paste real output.

### Close

Commit, push, open a PR with `gh pr create` (base `main`). Do NOT merge it
yourself. Do NOT deploy.
