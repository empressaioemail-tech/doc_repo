# Smart Site — report chrome: running header and footer

Implementation spec for the repo agent. Scope is the page frame on generated
PDF reports: masthead, running header, footer. Sheet bodies are out of scope and
unchanged.

Chosen treatment: **Option 1a "Rule"** — no fills, no bands. Structure is two
rule weights and mono meta. Reviewed 2026-09-15.

Applies to: Feasibility Study (`FS-`), Site Plan (`SP-`), Flood & Drainage
(`FD-`). One frame for all three; only the report-type string and the footer
disclaimer differ.

## Files

| File | What it is |
|---|---|
| `report-chrome.css` | The whole frame. Print tokens, sheet geometry, masthead, running header, footer. Drop-in. |
| `report-chrome.html` | Working reference: sheet 1 and a continuation sheet, print-ready. Open it, print to PDF, compare against your output. |
| `logo-wordmark-print.svg` | Paper variant of the wordmark, 175×40 in use. |
| `logo-mark.svg` | Ring only, for the 20px running header. |

## Page geometry

Letter portrait, 816 × 1056 px at 96 dpi (8.5 × 11 in). `@page { size: letter
portrait; margin: 0 }` — margins live on the sheet element, not the page box.

- Top margin 40, sides 48, bottom 30.
- The 48px side margin is the type column edge. Every element in the frame
  aligns to it; nothing bleeds.
- **`box-sizing: border-box` on `.ss-sheet` is load-bearing.** With
  `content-box` the padding lands outside the declared box and sheets render
  912 × 1126. This was a real bug in the first draft.
- One `.ss-sheet` per printed page, `break-after: page` on all but the last.
  The footer is pinned with `margin-top: auto`, so a short body still puts the
  footer on the bottom margin.

## Masthead — sheet 1 only

| Element | Spec |
|---|---|
| Wordmark | `logo-wordmark-print.svg`, 175 × 40, flush left |
| Report type | 12px / 700 / `.16em` tracking / uppercase, flush right, baseline-aligned to the wordmark (3px bottom padding) |
| Structural rule | 1.5px `--ss-print-ink`, 14px clear above and below |
| Address | 26px / 700 / line-height 1.05 / `-.005em`. The one thing read first. Verbatim county casing — `1109 PECAN ST`, never title case |
| Subject meta | mono 12.5px / `.02em` / `--ss-print-meta`, `·`-joined: `CITY, ST ZIP · PARCEL 48021:34049 · COUNTY NAME (48021)` |
| Document ID | label 10px / 700 / `.16em` / uppercase / `--ss-print-label` over mono 13px value, right-aligned |
| Hairline | 1px `--ss-print-line`, 14px above, closes the masthead |
| Body starts | 28px below the hairline |

## Running header — sheets 2..N

| Element | Spec |
|---|---|
| Mark | `logo-mark.svg`, 20 × 20 |
| Report type | 11px / 700 / `.16em` / uppercase, 11px after the mark. Takes a section qualifier where the sheet has one: `FEASIBILITY STUDY · NARRATIVE` |
| Right meta | mono 11px / `.02em` / `--ss-print-meta`: `1109 PECAN ST · 48021:34049` (address then parcel, `·`-joined) |
| Structural rule | 1.5px `--ss-print-ink`, 10px below the row |
| Body starts | 26px below the rule |

Row height is the mark's 20px. The full wordmark and the document-ID block do
not repeat — the document ID is recoverable from the deep link in the footer.

## Footer — every sheet

1px `--ss-print-line` hairline, 9px gap, then one row, space-between:

**Left** — short disclaimer, 9.5px / line-height 1.5 / `--ss-print-meta`,
`max-width: 430px`. Two or three sentences ending in a sheet pointer: *"Derived
from public GIS records. Not a boundary survey. Not for legal record. Sources
and confidence, sheet 12."* The full legal text stays where it already lives, on
the provenance sheet. Per report type:

- `FS-` → `Derived from public GIS records. Not a boundary survey. Not for legal record. Sources and confidence, sheet {provenanceSheet}.`
- `SP-` → `Derived from public GIS records. Not a boundary survey. Not for legal record. Provenance and citations, sheet {provenanceSheet}.`
- `FD-` → `Screening-level drainage model, not an engineering determination. Full model basis and provenance, sheet {provenanceSheet}.`

Sheets carrying their own caveat override the first sentence (the narrative
sheet and the aerial sheet already do) and keep the pointer.

**Right** — mono 9.5px / `.03em` / `--ss-print-meta`, 24px gaps, `nowrap`,
in this order:

1. Generation timestamp, `2026-09-15 11:29Z` — ISO, UTC, already the format in use.
2. Deep link, `smartsite.app/?parcelNodeId=48021:34049` — `--ss-print-blue`, no
   underline. Display form unescapes `%3A` to `:`; the `href` stays escaped.
3. Sheet counter, `SHEET 01 / 13` — `--ss-print-ink`, weight 600. Zero-padded to
   two digits. This is the only ink-weight item in the footer, because it is the
   one thing a reader hunts for while flipping.

## Print tokens

The app's shell is dark; paper inverts it, so the surface and text tokens cannot
be reused as-is. `report-chrome.css` declares the paper counterparts in `:root`,
each annotated with the app token it derives from. Port them into a
`print-tokens.css` alongside `pe-tokens.css` rather than inlining the hexes —
the design system's own ruling: an alpha wash or a literal is a second copy of a
token value and desyncs the moment the palette moves.

Contrast on `--ss-paper #FCFBF9`: ink 15.1:1, meta 7.4:1, label 5.6:1, blue
6.3:1, warn 5.9:1. `--ss-print-line` is a hairline separator and is exempt from
the 3:1 gate, same as `--ss-line-06`.

### Two rulings to carry forward

1. **`--ss-print-gold #B87116` exists and is paper-only.** `--ss-gold #E8963B`
   is 2.3:1 on paper and fails as text, so the wordmark's letterforms take the
   print gold in `logo-wordmark-print.svg`. The ring dot keeps true `--ss-gold`:
   it is a mark, not text. `assets/logo.svg` is **not** edited — the two golds
   in it stay hardcoded as the system requires; this is a second file for a
   second ground. On any dark ground, use the original untouched.
2. **Gold still appears nowhere else.** No gold rules, no gold sheet counters,
   no gold accents in the frame. Rule 1 holds. The frame adds no blue fills
   either — the deep link is the only blue on the sheet.

## Type steps used

Everything in the frame maps to the fixed ramp except the two footer sizes:

- 26px = `--ss-fs-title` (masthead address)
- 13px / 12.5px ≈ `--ss-fs-meta`
- 12px / 11px / 10px ≈ `--ss-fs-label` and below

Footer copy and footer meta are **9.5px**, below the six-step ramp. This is
deliberate and is not a request for a seventh UI step: it is print matter at
reading distance on paper, not a screen step, and it is confined to the footer.
If you would rather not have an off-ramp value in the codebase, name it
`--ss-fs-print-fine: 9.5px` in `print-tokens.css`, scoped to `.ss-footer`.

## Checks before merge

- A sheet element measures exactly 816 × 1056 (the box-sizing trap).
- Footer sits on the bottom margin on a short sheet and on a full one.
- Sheet counter zero-pads and matches the actual sheet count.
- Long addresses: the masthead address wraps to two lines without pushing the
  hairline into the body; the running header meta truncates rather than wraps.
- Report type strings render uppercase from the CSS, so source strings can stay
  sentence case.

---

## Integration notes — added by the doc_repo integration seat, 2026-09-15

Two changes were made to the files as delivered, and one defect in the spec is
flagged rather than silently fixed. Recorded so the implementing lane does not
rediscover them.

**1. C2PA provenance metadata stripped from both SVGs.** As delivered, each SVG
carried an embedded `<c2pa:manifest>` base64 block of roughly 14 KB. The
wordmark renders on sheet 1 and the mark renders on every continuation sheet, so
that payload would be embedded in every generated report. The marks here are the
stripped versions. If the provenance manifest must be retained for any reason,
retain it on the source asset and strip at build time; do not ship it inside the
PDF.

**2. The deep-link domain in the spec is WRONG and is NOT corrected in these
files.** The footer spec and `report-chrome.html` both use
`smartsite.app/?parcelNodeId=...`. Production is **`smartsite.cloud`** — that is
the live alias verified repeatedly against Vercel this session, and the domain
every other surface uses.

**Measured 2026-09-15, not assumed.** `smartsite.app` returns HTTP 200, so a
naive reachability check passes it. It is a **parked domain**: 114 bytes, no
Vercel headers, no application bundle, and a body consisting only of
`window.location.href="/lander"`. `smartsite.cloud` returns the real
application and the current bundle. So the spec as delivered would print a
customer-facing deep link onto a parking page — not a 404, which is why a status
check alone would not catch it.

Left as delivered so the design intent is not silently edited, but the
implementing lane MUST resolve the host against the live alias before this frame
prints a link into a customer document, and must verify by the served content
rather than the status code.

**3. Existing reports already use a RELATIVE deep link.** The 2026-09-15
feasibility study footer prints `/?parcelNodeId=48021%3A34049` with no host at
all. Whether the frame should print an absolute host, and which one, is a real
decision this spec makes implicitly. Make it explicitly.
