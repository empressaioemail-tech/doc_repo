## Mission — P-228: one page frame for all three report types

### What you are building

The page frame on generated PDF reports: **masthead, running header, footer**. One frame for
Feasibility Study (`FS-`), Site Plan (`SP-`) and Flood & Drainage (`FD-`); only the
report-type string and the footer disclaimer differ between them.

**Sheet bodies are explicitly OUT OF SCOPE and unchanged.** If you find yourself editing what
a sheet says rather than the frame around it, you have left this row.

Design reviewed and approved 2026-09-15. Treatment is **Option 1a "Rule"**: no fills, no
bands, structure carried by two rule weights and mono meta.

### The spec and the assets are committed

`_design/report-chrome/` on doc_repo main:

| File | What it is |
|---|---|
| `README.md` | the full spec — geometry, masthead, running header, footer, print tokens, the rulings, and the checks before merge |
| `report-chrome.css` | the whole frame, drop-in |
| `report-chrome.html` | working reference: sheet 1 plus a continuation sheet, print-ready. Print it to PDF and compare against your output |
| `logo-wordmark-print.svg` | paper wordmark, 175x40 in use |
| `logo-mark.svg` | ring only, for the 20px running header |

Read `README.md` first. It carries exact values and you should not re-derive them.

### Three integration findings already recorded — do not rediscover them

These are in `_design/report-chrome/README.md` under "Integration notes", established by the
integration seat before this row was dispatched.

1. **The C2PA metadata is already stripped from both SVGs.** As delivered each carried an
   embedded ~14 KB base64 provenance manifest. The mark renders on EVERY continuation sheet,
   so that payload would have been embedded in every generated report. The committed files are
   the stripped versions. If provenance must be retained, retain it on the source asset and
   strip at build time — never ship it inside the PDF.

2. **THE SPEC'S FOOTER DEEP-LINK HOST IS WRONG AND IS DELIBERATELY LEFT UNCORRECTED.** The
   spec and the HTML reference both print `smartsite.app/?parcelNodeId=...`. Production is
   **`smartsite.cloud`**. Measured, not assumed: `smartsite.app` returns **HTTP 200**, so a
   naive reachability check PASSES it, but it is a **parked domain** — 114 bytes, no Vercel
   headers, no application bundle, body is only `window.location.href="/lander"`.
   `smartsite.cloud` serves the real app. **As delivered, this frame would print a
   customer-facing deep link onto a parking page**, which is not a 404 and is exactly why a
   status check would not catch it. Resolve the host and **verify by SERVED CONTENT, not by
   status code.**

3. **Existing reports already print a RELATIVE deep link with no host at all** —
   `/?parcelNodeId=48021%3A34049` in the 2026-09-15 feasibility footer. So whether the frame
   prints an absolute host, and which, is a decision this spec makes implicitly. **Make it
   explicitly**, and say which you chose and why.

### How to verify a PDF, because the text is not greppable

The generated PDFs use Identity-H CID fonts, so the drawn strings do not appear as plain text
in the file or in its inflated streams. A `grep` for "SHEET 01 / 13" will return nothing on a
perfectly correct PDF. **Do not conclude from a failed grep that a value is missing.**

A method that works, used by the integration seat on 2026-09-15 to verify P-219: inflate the
PDF's FlateDecode streams, parse the `beginbfchar` blocks into a CID-to-Unicode map, then
decode every `<hex> Tj` operand through that map. That recovers the drawn text exactly.
Rendering the page to an image and reading it also works.

### Done looks like

The frame renders on all three report types, and the spec's own checks pass:

- A sheet element measures **exactly 816 x 1056**. (The spec names this trap: with
  `content-box` instead of `border-box` the padding lands outside the declared box and sheets
  render 912 x 1126. It was a real bug in the first draft.)
- The footer sits on the bottom margin on a SHORT sheet and on a FULL one.
- The sheet counter zero-pads and matches the actual sheet count.
- A long address wraps to two lines in the masthead without pushing the hairline into the
  body; the running-header meta truncates rather than wraps.
- Report-type strings render uppercase from CSS, so source strings can stay sentence case.
- The deep-link host resolves to the real application.

### Falsifiers, pre-register your answers before you run anything

1. **Measure a rendered sheet element.** If it is 912 x 1126 the box-sizing trap bit you, and
   every other check you ran was against the wrong geometry.
2. **Fetch the deep-link host you chose and inspect the BODY, not the status.** If it returns
   200 with ~114 bytes and a `/lander` redirect, you kept the parked domain.
3. **Generate a 13-sheet feasibility study and read the last sheet's counter.** If it says
   anything other than `SHEET 13 / 13`, the counter is not bound to the real count.
4. If any sheet BODY content changes as a side effect of the frame, you exceeded scope — the
   frame is the only thing this row touches.

### Known traps

- **hauska-engine has NO deploy workflow.** A merge there ships nothing and nothing says so.
  Your work is not live when it is merged; say so plainly in the close.
- **P-219 changed the site-plan author on 2026-09-15** (`packages/engine-core/src/site-plan/`,
  19 files, a new `resolve-export-setback.ts`) and P-221 changed the dossier path hours ago.
  Read `git log` on the files you intend to touch before editing; this repo has been busy.
- Gold is paper-only and appears nowhere else in the frame. `--ss-gold #E8963B` is 2.3:1 on
  paper and fails as text, which is why `--ss-print-gold #B87116` exists for the wordmark's
  letterforms while the ring dot keeps true gold. Do not add gold rules, gold sheet counters
  or gold accents, and do not edit `assets/logo.svg`.
- Port the print tokens into a `print-tokens.css` rather than inlining hexes. An inlined
  literal is a second copy of a token value and desyncs the moment the palette moves.

### Do not

- Do not change sheet body content.
- Do not deploy or merge. Open the PR green and hand it back.
- Do not spawn sub-agents that themselves spawn sub-agents. You own your fan.

### Close

State the host you chose for the deep link and what you verified it against. State the
measured sheet dimensions. Close to `_inbox/` on doc_repo main and PUSH it. Declare
`leave_behind` explicitly. State your snapshot (repo, branch, commit).
