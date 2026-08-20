---
id: 2026-08-19_wave3_surfaces_and_vpat_WDLL
title: WDLL — wave 3, every surface done pending QA, and a VPAT that can be re-run
status: draft-for-operator-approval
last_updated: 2026-08-19
applies_to: smartcity
owner: nick
related:
  [
    90_operations/OPS-17_govtech_stack_plan_of_record,
    _inbox/2026-08-19_template_city_lens_build_sheet,
    _decisions/2026-08-17_smartcity_visual_law,
  ]
---

# WDLL: wave 3 — every surface done pending QA, and a VPAT that can be re-run

Operator goal, in his words: **every surface in SmartCity Dashboards done pending QA, and the VPAT documented with proof the reports can be run against template city.** All product surfaces need conformance coverage, not just Dashboards.

The hand-off brief the operator drafted was written for the OLD product (`smartcityos.io`, `/demo/:city`, Kyle, 139 routes, a separate dashboards host). Most of it does not survive contact with what now ships. Below is the reconciliation, and every claim in it was measured against the deployed surface on 2026-08-19 rather than carried over.

## Baseline, measured before scoping

axe (the `axe.min.js` already in `P:/tmp/VPAT`) run through a real Chromium against
`https://smartcity-dashboards-52ecsl5mvq-ue.a.run.app`, revision `00025-mam`, across **16 surfaces**:
nine lenses, six work views, and `empty-city`. Counting rule, stated where it is read: a VIOLATION is one
axe rule failing on at least one surface; NODES sums failing DOM elements across surfaces; a rule counts
as CONFORMANCE only if tagged `wcag2a`/`wcag2aa`/`wcag21a`/`wcag21aa`, and anything else is best-practice
and is not a conformance failure.

| rule | nodes | tag | disposition |
|---|---|---|---|
| `color-contrast` | 54 | wcag2aa | **product-line token decision, not a Dashboards PR** |
| `scrollable-region-focusable` | 4 | wcag2a | Dashboards fix |
| `heading-order` | 11 | best-practice | fix anyway; it reads on 1.3.1 and 2.4.6 in a VPAT |

16 of 16 surfaces scanned clean of everything else. For comparison, the old site's six pages failed
`button-name`, `color-contrast`, `heading-order`, `meta-viewport`, `landmark-one-main` and `target-size`
at Lighthouse scores of 0.80 to 0.90.

## The old brief's ten "known defects", re-measured against what ships now

| # | Old defect | Status on the new product |
|---|---|---|
| 1 | `maximum-scale=1` on viewport | **NOT PRESENT.** Serves `width=device-width, initial-scale=1`. |
| 2 | Missing focus indicators | **UNMEASURED.** axe cannot settle this; it needs the manual walk. |
| 3 | Icon-only controls unnamed | **NOT PRESENT.** `button-name` did not fire on any of 16 surfaces. |
| 4 | No skip link / no `<main>` | **NOT PRESENT.** `<main class="shell-main">` ships and axe's `bypass` did not fire. |
| 5 | Brand teal `#6499aa` fails 3.14:1 | **SUBSTANCE SURVIVES, SPECIFICS DO NOT.** That hex is not in this product. But `color-contrast` fails 54 nodes and the failing selectors are `.badge` and `.p-quiet.pill` — **kit classes**. See the escalation below. |
| 6 | `aria-live` on async status | **UNMEASURED.** Needs the manual pass. |
| 7 | `document.title` unique per route | **FAILS, and it is structural.** Every lens serves `<title>SmartCity Dashboards</title>`. Nav items are real `<a href>` full navigations, so each lens IS a distinct page under 2.4.2, and axe cannot catch it because it scans one page at a time and a title is present. |
| 8 | Untagged generated PDFs | **OUT OF SCOPE FOR THIS PRODUCT.** Dashboards has no PDF pipeline. It is in scope for whichever surface generated `48021_34649_site_plan.pdf` — Plan Review or SmartSite, not here. |
| 9 | Nested anchor+button duplicate tab stops | **NOT PRESENT.** Did not fire. |
| 10 | Heading outline sequential, one `h1` | **PARTLY FAILS.** `heading-order`, 11 nodes. |

Six of ten do not survive measurement. That is the value of measuring before scoping, and it is the same
lesson the `Not built` misreading cost three handoffs.

## The escalation, and it is the only one that is not an engineering call

**`color-contrast` fails on `.badge` and `.p-quiet.pill`, which are kit classes coloured by `--sc-*`
tokens in `sc-kit.css`.** That file is byte-identical across `smartcity-dashboards`, `smart-files` and
`plan-review`, and its own header says a repo that edits a token value has forked the system. So the
single largest conformance finding on the product **cannot be fixed in a Dashboards PR**. It is a
product-line token decision that lands in all three repos at once, and it then requires a kit re-vendor
and a bundle re-sync behind it.

This is exactly what the operator's own brief anticipated: *"the design token set needs a compliant
primary before any component work starts."* The specifics changed; the sequencing point did not.

**Operator decision needed:** approve a contrast remediation pass on the `--sc-*` quiet/badge scale as a
product-line change. Nothing else in wave 3 is blocked by it, but the VPAT cannot claim Supports on 1.4.3
until it lands.

## What wave 3 is

Two halves, and the second cannot start before the first, because a VPAT that covers surfaces which do
not render yet is a VPAT of nothing.

### Half A — every surface done pending QA

The eleven registered domains reach no pixel today. Wave 3 renders them. This is a **serial markup pass**:
all fifteen lenses share one `web/index.html` and one unpartitioned `web/shell.css`, so lens PRs merge one
at a time with a rebase between, in the order the build sheet already fixes.

Each surface, on merge, must additionally carry:

- Its four source states rendered honestly. `ungranted` and `granted-empty` are different sentences and
  the markup must show which; `no-fixture-source` on `empty-city` keeps the region reachable and quiet.
- Every `.basis` line preserved, no invented freshness, one `Demo` chip.
- **Accessibility as a merge gate, not a later pass.** `heading-order` clean on the surface, sequential
  headings with exactly one `h1`, every new control with an accessible name, every new scrollable region
  keyboard-reachable. Retrofitting this after fifteen surfaces ship costs multiples.

### Half B — the conformance evidence pack

Reuse the structure that already exists in `P:/tmp/VPAT` — the 42-row per-criterion worksheet is the right
shape and the ACR fills from it. Rebuild its CONTENT against the new surfaces.

1. **Scope map.** SKU → product surface → template-city route → conformance surface. This is the document
   that proves the VPAT covers what is sold. **Blocked on the operator supplying the current contracts
   line items**; the old brief named a Vertosoft form and I do not have it.
2. **Surface inventory, not a route inventory.** The old audit counted 139 routes. This product is ONE
   document with fifteen lenses plus six work views. Findings cluster by surface, and 16 surfaces is the
   real denominator.
3. **Automated gate in CI.** The axe scanner built for this baseline, wired to fail the build, reporting
   per-surface conformance nodes. Target zero A and AA violations.
4. **Manual protocol and evidence.** The three axe cannot settle: keyboard-only completion of every
   surface, focus-visible walk, and a screen-reader pass. Plus 2.4.2 per surface once titles are fixed.
5. **The re-runnable proof the operator asked for.** A single command that regenerates the worksheet from
   a live scan of template-city, so the ACR is never hand-typed from a stale report. That is the
   difference between this VPAT and the last one.
6. **Cross-surface scope.** All product surfaces need coverage: Dashboards, Smart Files, Plan Review,
   SmartSite. Dashboards is first because it is the one that is nearly clean. **Document generation
   (504.2.2) belongs to whichever surface emits PDFs**, and that is not Dashboards.

## Baseline CORRECTED 2026-08-19 by G-95 — the planner's scope was narrow and one claim was overstated

Two corrections to the section above, recorded rather than silently edited, because these are VPAT inputs
and a wrong claim in an ACR discredits the true ones.

**The denominator was hand-enumerated and too small.** The planner scanned **16 surfaces on one theme**.
G-95 derived the surface list from the id sets `src/staff-review.mjs` exports and scanned **23 surfaces
x 2 themes = 46 scans**. On the planner's own 16-surface subset its scanner reproduced the planner's
numbers exactly, so the instruments agree and only the SCOPE differed. Corrected figures:

| rule | planner (16 surfaces, dark) | G-95 (23 surfaces, both themes) | after |
|---|---|---|---|
| `color-contrast` | 54 | **1002** (light 930, dark 72) | 0 |
| `heading-order` | 11 | **30** | 0 |
| `scrollable-region-focusable` | 4 | **8** | 0 |
| 2.4.2 Page Titled | not counted | **24 findings** | 0 |
| 2.4.7 Focus Visible | unmeasured | 0 of 1038 stops | 0 of 1058 |

The planner's 16 came from hand-enumerating nine lenses, six work views and `empty-city`. It omitted the
Development-services and Assets TAB panels, which are distinct rendered surfaces. **A conformance
denominator is derived or it is wrong**, which is the same hand-declared defect class as `has_writer`,
and it is why the evidence pack must state the derivation beside the number.

**The escalation was overstated, and the correction is narrow but real.** The planner wrote that
`color-contrast` "cannot be fixed in a Dashboards PR" because the failing selectors are kit classes.
Measured: `web/sc-kit.css` contains **zero** rules for `.badge` or `.p-quiet`. Those rules live in
`web/shell.css` at lines 162, 632 and 643 and merely REFERENCE `var(--sc-ink-3)` and
`var(--sc-quiet)`. A local re-pairing to different existing tokens was therefore possible, and the
planner asserted an impossibility from a plausible mechanism without checking where the declarations
actually lived.

**The conclusion still holds on its own merits and the shipped fix is not revisited:** a `--sc-quiet`
that fails contrast is wrong everywhere it is used, not only on badges, so the token was the right owner
and a shell-local re-pairing would have left the same defect live in `smart-files` and `plan-review`.
Right answer, wrong reason, and the reason is what was in the document.

**The pattern across three corrections today** — the PDF raster claim, the `prefers-color-scheme` theme
lever, and this — is one failure mode: reasoning about where a thing SHOULD live instead of grepping for
where it DOES. All three were caught by executors measuring, which is the control working; the durable
form of that control is that planner figures travel into dispatches as claims to be checked and never as
settled facts.

### Two methodology facts the evidence pack must carry

**A zero from axe is not evidence unless the scan looked at something.** G-95's eighth planted violation
did not fire: a full-viewport overlay makes axe evaluate nothing, so the gate PASSED a page nobody could
read. Every scan now counts legible text as a floor — 75 on the leanest real surface, 0 under an overlay
— and eight of eight plants fire. An auditor will ask how we know the scan was not empty, and the answer
has to be in the report.

**The scanner is the artifact the other surfaces adopt.** `scripts/a11y-scan.mjs` carries the derived
surface list, the `data-theme` lever with its landed-assertion, the both-themes-identical guard, the
legible-text floor and the waiver ledger. Smart Files and Plan Review consume it rather than growing
their own axe gate, or each new gate is born with the blindness this one had to be taught out of.

## Operator decisions, 2026-08-19 — all four taken

**1. Fix the kit.** The contrast remediation on the `--sc-*` scale is approved as a product-line change.
It lands in `sc-kit.css` and therefore in every repo that vendors it, followed by a kit re-vendor and a
bundle re-sync. Nothing else in wave 3 blocks on it, but 1.4.3 cannot read Supports until it lands.

**2. Conformance target is BOTH WCAG 2.0 AA (Revised 508, federal) and WCAG 2.1 AA (ADA Title II, state
and local).** The worksheet is the union of both criteria sets, and each row states which standard it
answers, because a Rev508 ACR and a WCAG 2.1 ACR are different documents filled from one body of
evidence. Note that the baseline scan already ran the `wcag21a` and `wcag21aa` tag sets and **no
2.1-specific rule fired** — but axe cannot settle reflow (1.4.10), orientation (1.3.4), text spacing
(1.4.12), content on hover or focus (1.4.13) or status messages (4.1.3), so those are manual and are new
work relative to a 2.0-only pass.

**3. Scope is the whole sellable product line:** Dashboards, Asset Management, Plan Review, Smart Files.

**4. PDF export is IN scope**, because the original SmartCity has it. See the finding below.

## Finding: the PDF path must be replaced — CORRECTED 2026-08-19, the first rationale was wrong

**The planner's first version of this finding claimed the exports are rasters and therefore fail 1.1.1
and 1.4.5 as well as 504.2.2. That claim is FALSE and is retracted.** G-96 measured it and the correction
is recorded here rather than quietly edited, because a wrong finding inside an ACR discredits the true
ones: a federal reviewer who opens one of these PDFs will find selectable text, and will then have reason
to disbelieve everything else in the report.

**What is actually true.** Every application PDF path in the original SmartCity draws **vector text**
through jsPDF `.text()` and jspdf-autotable. html2canvas is bundled only as an optional dependency of
the jsPDF `html()` plugin and has **zero call sites**: `.html(` occurs **0** times in 5,578,225 bytes,
`.text(` occurs 73 times and `autoTable` 10, and all six `addImage(` sites sit inside html2canvas,
the jsPDF html plugin, or canvg. **1.1.1 and 1.4.5 come OUT of the PDF rationale.**

**Replace is still the verdict, on different and better evidence.** `/StructTreeRoot` and `/MarkInfo`
occur **0** times in the bundle, and jsPDF's own `putCatalog` writes only `/Type /Catalog`,
`/Pages`, `/OpenAction` and `/PageLayout`. jsPDF 4.2.1 has no tagged-PDF capability at all.
`setLanguage` and `setDocumentProperties` exist in the bundle but are not called by application code,
so there is no `/Lang` and no document title either. That is a straight 504.2.2 failure and it cannot be
configured away, because the library cannot emit a structure tree at any setting.

**The planner's token counts were also wrong, and the reason is a counting rule.** The first version said
jsPDF 17 and html2canvas 3. Those came from `grep -oci`, which counts matching LINES, against a
minified bundle that is nearly all one line. Measured as occurrences with `grep -oF`: **jsPDF 143,
html2canvas 23**. Not load-bearing for the verdict, and a clean example of DEV_PROCESS 1.2 — a ratio
whose counting rule is not stated at the point of use will be quoted wrong.

### Three findings from G-96 that move the work

**The site-plan PDF is SmartSite, not Plan Review**, established on four independent links: `filenameFor`
in `hauska-map/apps/property-explorer/src/browse/SitePlanExportSection.tsx` produces exactly
`48021_34649_site_plan.pdf`; its `HONESTY_LINE` matches the extracted page-1 text verbatim;
`hauska-engine/.../site-plan/pdf/render.ts:1152` builds the `SP-48021-34649` id; and the served
SmartSite bundle carries `pe-site-plan-export` with zero client PDF libraries. It is generated
server-side by engine-api with pdf-lib.

**Its worse defect is not the missing tags.** `render.ts:373` draws tracked runs glyph by glyph, so
**64.4% of extracted lines are a single character** (268 of 416, pypdf `extract_text()` newline-split).
Tagging that file would pass an automated 504.2.2 check and still read one letter at a time to a screen
reader. This is the strongest argument in the whole investigation for why an automated gate is necessary
and not sufficient.

**Scope-map correction:** Dashboards generates no documents, but it MOUNTS SmartSite in an iframe, so a
Dashboards user reaches an untagged pdf-lib PDF without leaving the product. The ACR scope cannot stop at
"Dashboards emits nothing".

### The recommendation, with its limit stated

**Headless Chromium print-to-PDF from semantic HTML, through one shared render service.** Not a
preference: four PDFs already on the operator's machine, produced by `Skia/PDF m151` / HeadlessChrome,
each carry the complete 504.2.2 set — `/MarkInfo Marked true`, `/StructTreeRoot`, `/Lang en`, a real
`/Title`, `/DisplayDocTitle true`.

**The limit travels with the recommendation:** the structure walk on those files reads `/Document 1,
/H1 1, /H2 3, /P 4, /NonStruct 50`. Chromium tags what the HTML says, so this does not fix conformance on
its own — it makes the G-94 and G-95 semantics count twice. Bad HTML in, bad tags out.

Cost against these repos specifically: all three are `pg`-only with no build step on `node:22-alpine`.
Puppeteer in-repo means leaving alpine, roughly 300-400 MB of image, a Cloud Run sandbox decision, and a
browser launch in cold start. The shared-service form keeps each product at one dependency plus one
`fetch`. The cheapest valid alternative is `window.print()` against a print stylesheet — zero
dependencies, same Chromium path — but it is browser-dependent, so an ACR cannot claim it uniformly, and
there are currently **zero** `@media print` rules across all three kits.

**SmartSite is a different problem and should NOT be replaced.** Add `setTitle`/`setLanguage` to its
three emitters (three lines, and it kills two of five failures), then fix the glyph-by-glyph tracked runs,
then decide on the summary sheet.

### Sizing

22 document types by rendered layout, or 15 by `.save()` call site, on the original SmartCity; plus 3
server-side pdf-lib types on SmartSite; plus 5 CSV and one `.txt` generator carrying no 504.2.2
obligation. The SmartCity 15 are one fix at the library seam and 22 decisions at the content seam. The
SmartSite 3 are one fix. Dashboards, Smart Files and Plan Review are zero fixes and one operator decision.

## Finding: Asset Management has no repository

`empressaioemail-tech/smartcity-dashboards`, `smart-files` and `plan-review` all exist. There is no
asset-management repo under any of the obvious names. Assets is currently a **lens inside Dashboards**,
held at zero by the G-24 ruling.

So one of the four surfaces in the approved VPAT scope **does not exist yet**. That is not a blocker for
the other three, and it is not something to discover during an audit: a conformance report cannot cover a
product with no code, and the scope map must carry it explicitly as not-yet-built rather than silently
omitting it. If Asset Management is being sold or quoted before it is built, that is worth knowing now.

## Escalate before proceeding, unchanged from the operator's brief because these are still open

- The current contracts line items, for the scope map.
- Whether revision 1 of the ACR ships covering the three surfaces that EXIST, with Asset Management
  carried in the scope map as not-yet-built, or waits for all four. Recommendation: ship on three.
- The PDF generator decision, which gates the document-generation workstream.

## Out of scope

Marketing site. Live Bastrop, which stays no-touch. Net-new product capability. Any token edit made
unilaterally in one repo.

## Definition of done

Every registered domain renders on its surface with its four source states honest. Every surface passes
the automated gate at zero A and AA violations. Every surface has a unique descriptive title. The manual
protocol is executed and recorded. The worksheet regenerates from a live scan by one command, and the ACR
is filled from it without a single unverified claim.
